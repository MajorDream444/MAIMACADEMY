import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('official schedule: cohort starts 15 January 2027, payments readiness-gated with no fixed date',async()=>{
  const cohort=JSON.parse(await readFile('data/founding-cohort.json','utf8'));
  assert.equal(cohort.payment_opens,null);assert.equal(cohort.cohort_starts,'2027-01-15');
  assert.equal(cohort.payment_invitations_require_release_approval,true);assert.equal(cohort.enrollment_open,false);
  assert.equal(cohort.price_usd,249);assert.equal(cohort.capacity,20);assert.equal(cohort.reservations_open,true);
  assert.equal(cohort.sessions[0],'2027-01-15T14:00:00Z');assert.equal(cohort.sessions.length,4);
  assert.equal(cohort.sessions.at(-1),'2027-02-05T14:00:00Z');
  const calendar=await readFile('public/founding-cohort.ics','utf8');assert.doesNotMatch(calendar,/DTSTART:2026/);assert.equal((calendar.match(/SEQUENCE:2/g)||[]).length,4);assert.match(calendar,/DTSTART:20270115T140000Z/);
});
