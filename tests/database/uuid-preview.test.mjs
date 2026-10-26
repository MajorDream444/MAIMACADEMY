import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {applyTestPayment} from '../../lib/test-payment-events.js';
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002';
test('reviewed UUID TEST migration: actual PostgreSQL roles, RLS, sessions, capacity and recovery',async t=>{
 const db=new PGlite();t.after(()=>db.close());
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,banned_until timestamptz);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;insert into auth.users values('${A}','a@example.invalid',now(),null),('${B}','b@example.invalid',now(),null);`);
 const dir=new URL('../../supabase/migrations/',import.meta.url),file=(await readdir(dir)).find(n=>n.endsWith('_academy_uuid_preview.sql'));await db.exec(await readFile(new URL(file,dir),'utf8'));
 await db.exec(`set search_path=academy_test,pg_catalog;insert into academy_testers values('${A}'),('${B}');insert into academy_grants(user_id,resource,status,starts_at,source_payment,offer_version) values('${A}','journey','active',now(),'pi_a','test'),('${B}','journey','active',now(),'pi_b','test');insert into academy_progress(user_id,day,status,reflection) values('${A}',1,'started','private A'),('${B}',1,'completed','private B');insert into academy_lessons values(1,'Test lesson','Synthetic fixture, not teaching content','test',true),(2,'Draft','Not public','test',false);`);
 const asMember=async(uid,work)=>{await db.exec('begin;set local role academy_test_member');try{await db.query("select set_config('request.jwt.claim.sub',$1,true)",[uid]);const r=await work();await db.exec('commit');return r;}catch(e){await db.exec('rollback');throw e;}};
 await t.test('RLS hides other user progress and refuses forged writes without trusting API filters',async()=>{
  const r=await asMember(A,()=>db.query('select * from academy_progress'));assert.equal(r.rows.length,1);assert.equal(r.rows[0].reflection,'private A');
  await assert.rejects(asMember(A,()=>db.query('insert into academy_progress(user_id,day,status) values($1,2,\'started\')',[B])),e=>e.code==='42501');
  await assert.rejects(asMember(A,()=>db.query('update academy_progress set user_id=$1',[B])),e=>e.code==='42501');
  assert.equal((await asMember(B,()=>db.query('select * from academy_progress'))).rows[0].reflection,'private B');
 });
 await t.test('private lessons require active ownership and draft is never visible',async()=>{
  assert.deepEqual((await asMember(A,()=>db.query('select day from academy_lessons'))).rows.map(x=>x.day),[1]);
  await db.query("update academy_grants set status='held' where user_id=$1",[B]);assert.equal((await asMember(B,()=>db.query('select * from academy_lessons'))).rowCount,0);
  await assert.rejects(asMember(B,()=>db.query("update academy_progress set status='completed'")),e=>e.code==='42501');
 });
 await t.test('auth role creates/revokes hash-only sessions for registered UUIDs; member cannot mint them',async()=>{
  const h='a'.repeat(64);await db.exec('set role academy_test_auth');await db.query('select create_session($1,$2)',[h,A]);assert.equal((await db.query('select * from resolve_session($1)',[h])).rows[0].user_id,A);await db.query('select revoke_session($1)',[h]);assert.equal((await db.query('select * from resolve_session($1)',[h])).rowCount,0);await db.exec('reset role');
  await assert.rejects(asMember(A,()=>db.query('select create_session($1,$2)',['b'.repeat(64),A])),e=>e.code==='42501');
 });
 await t.test('reservation consent is own-user, explicit and never a paid seat',async()=>{
  await asMember(A,()=>db.query("insert into academy_reservations(user_id,notice_version,source) values($1,'qa-notice-v1','academy-protected-test')",[A]));
  assert.equal((await asMember(B,()=>db.query('select * from academy_reservations'))).rowCount,0);
 });
 let seat;
 await t.test('reviewed private booking is owned, deadline-safe and cannot consume credit twice',async()=>{
  await db.query("update academy_session_credits set starts_at=now()-interval '1 day' where user_id=$1",[A]);
  const credit=(await db.query('select id from academy_session_credits where user_id=$1',[A])).rows[0].id;
  const brief=(await db.query("insert into academy_briefs(user_id,problem,desired_result,tried,decision,status,reviewer_id,reviewed_at,created_at) values($1,'problem','result','tried','decision','approved','operator',now(),now()-interval '3 days') returning id",[A])).rows[0].id;
  const slot=(await db.query("insert into academy_advisory_slots(starts_at,ends_at,status) values(now()+interval '4 days',now()+interval '4 days 45 minutes','open') returning id")).rows[0].id;
  await assert.rejects(asMember(B,()=>db.query('select reserve_booking($1,$2,$3)',[credit,brief,slot])),/Ineligible/);
  const booking=await asMember(A,()=>db.query('select reserve_booking($1,$2,$3) as id',[credit,brief,slot]));assert.ok(booking.rows[0].id);
  await assert.rejects(asMember(A,()=>db.query('select reserve_booking($1,$2,$3)',[credit,brief,slot])),/Ineligible/);
 });
 await t.test('interest reservations are uncapped; checkout holds atomically protect 20 paid places',async()=>{
  const ids=[];for(let i=2;i<=21;i++){const uid='00000000-0000-4000-8000-'+String(i).padStart(12,'0');ids.push(uid);await db.query("insert into auth.users values($1,'fixture@example.invalid',now(),null) on conflict do nothing",[uid]);await db.query('insert into academy_testers values($1) on conflict do nothing',[uid]);await db.query("insert into academy_reservations(user_id,notice_version,source) values($1,'qa-notice-v1','academy-protected-test') on conflict do nothing",[uid]);}
  assert.equal((await db.query('select count(*)::int as n from academy_reservations')).rows[0].n,21);assert.equal((await db.query('select count(*)::int as n from academy_seats')).rows[0].n,0);
  await db.exec('set role academy_test_worker');seat=(await db.query('select * from claim_seat($1,$2)',[A,A])).rows[0];assert.equal((await db.query('select * from claim_seat($1,$2)',[A,B])).rows[0].id,seat.id);
  for(const uid of ids.slice(0,19))await db.query('select * from claim_seat($1,$2)',[uid,uid]);
  await assert.rejects(db.query('select * from claim_seat($1,$2)',[ids[19],ids[19]]),/capacity/);
  assert.equal((await db.query("select count(*)::int as n from academy_seats where status in ('pending','checkout','paid','held')")).rows[0].n,20);
  const expiring=ids[0];await db.query("update academy_seats set status='checkout',session_id='cs_test_expiring' where user_id=$1",[expiring]);await db.exec('begin');await applyTestPayment(db,{id:'evt_expired_qa',type:'checkout.session.expired',livemode:false,data:{object:{id:'cs_test_expiring'}}});await db.exec('commit');
  await db.query('select * from claim_seat($1,$2)',[ids[19],ids[19]]);await db.exec('reset role');
  assert.equal((await db.query("select count(*)::int as n from academy_seats where status in ('pending','checkout','paid','held')")).rows[0].n,20);
  assert.equal((await db.query("select status from academy_seats where user_id=$1",[expiring])).rows[0].status,'expired');
 });
 await t.test('signed-event core deduplicates fulfillment and cannot restore access after refund',async()=>{
  await db.query("update academy_seats set agreement_version='qa-v1',terms_url='https://example.invalid/terms/qa-v1',price_id='price_qa' where id=$1",[seat.id]);
  const session={id:'cs_test_qa',livemode:false,mode:'payment',payment_status:'paid',client_reference_id:A,payment_intent:'pi_qa',amount_subtotal:24900,currency:'usd',metadata:{offer:'major-moves-founding',user_id:A,agreement_version:'qa-v1',terms_url:'https://example.invalid/terms/qa-v1',cohort:'founding-2026-11-18',seat_id:seat.id},line_items:{data:[{quantity:1,price:{id:'price_qa'}}]}};
  const event={id:'evt_paid_qa',type:'checkout.session.completed',livemode:false,data:{object:session}};
  await db.exec('set role academy_test_worker;begin');await applyTestPayment(db,event,session);await db.exec('commit;begin');assert.equal((await applyTestPayment(db,event,session)).duplicate,true);await db.exec('commit;begin');await applyTestPayment(db,{id:'evt_refund_qa',type:'charge.refunded',livemode:false,data:{object:{payment_intent:'pi_qa',amount:24900,amount_refunded:24900}}});await db.exec('commit;begin');await applyTestPayment(db,{...event,id:'evt_late_paid'},session);await db.exec('commit;reset role');
  const g=(await db.query("select * from academy_grants where source_payment='pi_qa'")).rows;assert.equal(g.length,1);assert.equal(g[0].status,'revoked');assert.equal((await db.query("select status from academy_session_credits where grant_id=$1",[g[0].id])).rows[0].status,'revoked');
 });
 await t.test('member role cannot bypass booking review or access MAIM/customer/Auth tables',async()=>{
  await assert.rejects(asMember(A,()=>db.query('select * from auth.users')),e=>e.code==='42501');
  await assert.rejects(asMember(A,()=>db.query("insert into academy_bookings(user_id,credit_id,brief_id,slot_id) values($1,1,1,1)",[A])),e=>e.code==='42501');
  await assert.rejects(asMember(A,()=>db.query('select reserve_booking(1,1,1)')),/Ineligible/);
 });
});
