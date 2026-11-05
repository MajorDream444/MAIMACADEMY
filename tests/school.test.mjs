import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import school from '../api/school.js';
import {withMemberResponse} from '../lib/member-runtime.js';
test('School production access fails closed; no customer data or draft teaching enters static build',async()=>{
 const res={code:0,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.data=v;return this;}};
 await school({method:'GET',query:{action:'page'},headers:{}},res);assert.equal(res.code,503);assert.equal(res.headers['Cache-Control'],'private, no-store');
 const html=await readFile('dist/school-walkthrough.html','utf8');assert.match(html,/Synthetic walkthrough/);assert.match(html,/noindex,nofollow/);assert.doesNotMatch(html,/Synthetic Audit:|rk_test_|postgres:/);
 await assert.rejects(access('dist/data/paid-cohort-manifest.json'));await assert.rejects(access('dist/school.html'));
 const v=JSON.parse(await readFile('vercel.json'));assert.equal(v.git.deploymentEnabled['codex/academy-school-v1'],false);assert.ok(v.rewrites.some(r=>r.source==='/school'&&r.destination==='/api/school?action=page'));
 const manifest=JSON.parse(await readFile('data/paid-cohort-manifest.json'));assert.equal(manifest.published,false);assert.equal(manifest.days.length,7);assert.ok(manifest.days.every(d=>d.status==='draft'&&d.source_ref===null));
});
test('School dates are date-only newer decisions and never inherit old times/links',async()=>{
 const c=JSON.parse(await readFile('data/school-cohort.json'));assert.equal(c.timezone,null);assert.equal(c.meeting_url,null);assert.equal(c.access_policy.work_months_from_cohort_close,12);assert.equal(c.access_policy.expiry_warning_days,30);assert.match(c.access_policy.exact_expiry_status,/pending/);assert.equal(c.credential_issuance_enabled,false);assert.match(c.credential_requirements.join(' '),/Ship real-use proof, Measure tracked result/);assert.deepEqual(c.projects.map(p=>p.id),['audit','design','prototype','test','ship','measure']);assert.equal(c.group_dates[0],'2026-11-22');assert.equal(c.group_dates[3],'2026-12-13');for(const p of c.projects)assert.ok(p.taught<p.due);
});
test('protected HTML is withheld if the database transaction cannot commit',async()=>{
 let sent=false;const res={setHeader(){},status(){return this;},send(){sent=true;}};
 await assert.rejects(withMemberResponse('fixture',res,async(db,out)=>out.send('<h1>Private school</h1>'),async(uid,work)=>{await work({});throw Error('commit failed');}),/commit failed/);assert.equal(sent,false);
});
