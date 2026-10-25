import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('official schedule keeps readiness-gated November11 payments and November18 start',async()=>{
  const cohort=JSON.parse(await readFile('data/founding-cohort.json','utf8'));
  assert.equal(cohort.payment_opens,'2026-11-11');assert.equal(cohort.cohort_starts,'2026-11-18');
  assert.equal(cohort.payment_invitations_require_release_approval,true);assert.equal(cohort.enrollment_open,false);
  assert.equal(cohort.price_usd,249);assert.equal(cohort.capacity,20);assert.equal(cohort.reservations_open,true);
  assert.equal(cohort.sessions[0],'2026-11-18T14:00:00Z');assert.equal(cohort.sessions.length,4);
  assert.equal(cohort.sessions.at(-1),'2026-12-09T14:00:00Z');
  const calendar=await readFile('public/founding-cohort.ics','utf8');assert.doesNotMatch(calendar,/DTSTART:20261111/);assert.equal((calendar.match(/SEQUENCE:1/g)||[]).length,4);assert.match(calendar,/DTSTART:20261118T140000Z/);
});
