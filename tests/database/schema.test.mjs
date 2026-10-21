import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

// Embedded PostgreSQL tests: no hosted database, credentials or learner data.
// Minimal user fixture exercises application foreign keys, NOT Better Auth.
test('application schema executes in PostgreSQL and enforces advisory invariants', async t => {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec('create table "user" (id text primary key); insert into "user" values (\'alice\'),(\'bob\');');
  for (const name of ['schema.sql', 'advisory-schema.sql']) {
    await db.exec(await readFile(new URL(`../../docs/member-access/${name}`, import.meta.url), 'utf8'));
  }
  const scalar = async sql => Object.values((await db.query(sql)).rows[0])[0];
  await t.test('active journey creates exactly one credit with a 90-day window', async () => {
    await db.exec("insert into academy_grants(user_id,resource,status,starts_at,source_payment,offer_version) values('alice','journey','active','2026-10-20T00:00Z','pi_one','test-v1');");
    assert.equal(await scalar('select count(*)::int from academy_session_credits'), 1);
    assert.equal(await scalar("select extract(epoch from expires_at-starts_at)::int from academy_session_credits"), 90 * 86400);
    await db.exec("insert into academy_grants(user_id,resource,status,starts_at,source_payment,offer_version) values('alice','journey','active','2026-10-20T00:00Z','pi_one','test-v1') on conflict(source_payment) do nothing;");
    assert.equal(await scalar('select count(*)::int from academy_session_credits'), 1);
  });
  await t.test('held journey and vault create no advisory credits', async () => {
    await db.exec("insert into academy_grants(user_id,resource,status,starts_at,expires_at,offer_version) values('bob','journey','held','2026-10-20',null,'test-v1'),('bob','vault','active','2026-10-20','2026-11-20','test-v1');");
    assert.equal(await scalar("select count(*)::int from academy_session_credits where user_id='bob'"), 0);
  });
  await t.test('vault requires expiry and invalid progress cannot be stored', async () => {
    await assert.rejects(db.exec("insert into academy_grants(user_id,resource,status,starts_at,offer_version) values('alice','vault','active',now(),'test-v1');"), e => e.code === '23514');
    await assert.rejects(db.exec("insert into academy_progress(user_id,day,status) values('alice',31,'completed');"), e => e.code === '23514');
    await assert.rejects(db.exec("insert into academy_progress(user_id,day,status) values('unknown',1,'completed');"), e => e.code === '23503');
  });
  await t.test('approval requires reviewer evidence', async () => {
    await assert.rejects(db.exec("insert into academy_briefs(user_id,problem,desired_result,tried,decision,status) values('alice','problem','result','tried','decision','approved');"), e => e.code === '23514');
    await db.exec("insert into academy_briefs(user_id,problem,desired_result,tried,decision,status,reviewer_id,reviewed_at) values('alice','problem','result','tried','decision','approved','operator-fixture',now());");
  });
  await t.test('appointments require 45 minutes, reject overlaps and permit adjacent slots', async () => {
    await db.exec("insert into academy_advisory_slots(starts_at,ends_at,status) values('2026-10-21T10:00Z','2026-10-21T10:45Z','open');");
    await assert.rejects(db.exec("insert into academy_advisory_slots(starts_at,ends_at,status) values('2026-10-21T10:15Z','2026-10-21T11:00Z','open');"), e => e.code === '23P01');
    await assert.rejects(db.exec("insert into academy_advisory_slots(starts_at,ends_at,status) values('2026-10-22T10:00Z','2026-10-22T11:00Z','open');"), e => e.code === '23514');
    await db.exec("insert into academy_advisory_slots(starts_at,ends_at,status) values('2026-10-21T10:45Z','2026-10-21T11:30Z','open');");
    assert.equal(await scalar('select count(*)::int from academy_advisory_slots'), 2);
  });
  await t.test('booking uniqueness rejects reusing a credit, brief or slot', async () => {
    const credit = await scalar('select id from academy_session_credits limit 1');
    const brief = await scalar('select id from academy_briefs limit 1');
    const slot = await scalar('select min(id) from academy_advisory_slots');
    await db.query('insert into academy_bookings(user_id,credit_id,brief_id,slot_id) values($1,$2,$3,$4)', ['alice',credit,brief,slot]);
    await db.exec("insert into academy_grants(user_id,resource,status,starts_at,offer_version) values('alice','journey','active','2026-10-20','test-v1');");
    await db.exec("insert into academy_briefs(user_id,problem,desired_result,tried,decision,status,reviewer_id,reviewed_at) values('alice','another problem','result','tried','decision','approved','operator-fixture',now());");
    const otherCredit = await scalar('select max(id) from academy_session_credits');
    const otherBrief = await scalar('select max(id) from academy_briefs');
    const otherSlot = await scalar('select max(id) from academy_advisory_slots');
    for (const [ids, constraint] of [
      [[credit, otherBrief, otherSlot], 'academy_bookings_credit_id_key'],
      [[otherCredit, brief, otherSlot], 'academy_bookings_brief_id_key'],
      [[otherCredit, otherBrief, slot], 'academy_bookings_slot_id_key'],
    ]) {
      await assert.rejects(db.query('insert into academy_bookings(user_id,credit_id,brief_id,slot_id) values($1,$2,$3,$4)', ['alice', ...ids]), e => e.code === '23505' && e.constraint === constraint);
    }
    assert.equal(await scalar('select count(*)::int from academy_bookings'), 1);
  });
  await t.test('failed transaction rolls back progress changes', async () => {
    await db.exec('begin');
    await db.exec("insert into academy_progress(user_id,day,status) values('alice',1,'started');");
    await assert.rejects(db.exec("insert into academy_progress(user_id,day,status) values('alice',0,'started');"));
    await db.exec('rollback');
    assert.equal(await scalar('select count(*)::int from academy_progress'), 0);
  });
});
