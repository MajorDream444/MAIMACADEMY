import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {createSchoolHandler} from '../../api/school.js';
import {withMemberResponse} from '../../lib/member-runtime.js';
const A='00000000-0000-4000-8000-000000000001',B='00000000-0000-4000-8000-000000000002',F='00000000-0000-4000-8000-000000000003',N='00000000-0000-4000-8000-000000000004',C='founding-2026-11-18';
function response(){return {code:200,headers:{},status(n){this.code=n;return this;},setHeader(k,v){this.headers[k]=v;},json(v){this.data=v;return this;},send(v){this.html=v;return this;},end(){return this;}};}
test('School TEST migration and API: real PostgreSQL learner journey, RLS and review authority',async t=>{
 const db=new PGlite();t.after(()=>db.close());
 await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,banned_until timestamptz);create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;`);
 for(const [id,email]of [[A,'a'],[B,'b'],[F,'f'],[N,'n']])await db.query('insert into auth.users values($1,$2,now(),null)',[id,email+'@example.invalid']);
 for(const file of ['20261026024608_academy_uuid_preview.sql','20261103000100_academy_school_preview.sql'])await db.exec(await readFile(new URL('../../supabase/migrations/'+file,import.meta.url),'utf8'));
 await db.exec(`set search_path=academy_test,pg_catalog;insert into school_memberships values('${C}','${A}','learner',true,now()+interval '1 year'),('${C}','${B}','learner',true,now()+interval '1 year'),('${C}','${F}','facilitator',true,now()+interval '1 year');insert into academy_grants(user_id,resource,status,starts_at,offer_version) values('${A}','journey','active',now(),'synthetic'),('${B}','journey','active',now(),'synthetic');`);
 const asMember=async(uid,work)=>{await db.exec('begin;set local role academy_test_member');try{await db.query("select set_config('request.jwt.claim.sub',$1,true)",[uid]);const result=await work(db);await db.exec('commit');return result;}catch(e){await db.exec('rollback');throw e;}};
 const query=(uid,sql,args=[])=>asMember(uid,db=>db.query(sql,args));
 const call=async(uid,action,body,opts={})=>{const handler=createSchoolHandler({secure:res=>res.setHeader('Cache-Control','private, no-store'),configured:()=>opts.configured!==false,sessionFor:async()=>uid?{user:{id:uid}}:null,withMemberResponse:(id,res,work)=>withMemberResponse(id,res,work,asMember),sameOrigin:()=>opts.origin!==false,bodyFor:async()=>body});const res=response();await handler({method:body?'POST':'GET',headers:{},query:{action,...opts.query}},res);return res;};
 let sid,post;
 await t.test('absent config, unauthenticated, nonmember and wrong origin deny access',async()=>{
  assert.equal((await call(A,'dashboard',null,{configured:false})).code,503);
  assert.equal((await call(null,'dashboard')).code,401);
  assert.equal((await call(N,'dashboard')).code,403);
  assert.equal((await call(A,'post',{channel:'questions',body:'Hello sample'},{origin:false})).code,403);
  assert.equal((await call(A,'page',null,{query:{section:'facilitator'}})).code,403);
  const page=await call(A,'page');assert.equal(page.code,200);assert.match(page.html,/Checking school access/);assert.doesNotMatch(page.html,/private evidence/);
 });
 await t.test('draft instruction stays hidden even on direct lesson request',async()=>{
  await db.query("insert into school_lessons values('draft',$1,'Draft','Private teaching draft','v1','draft','owned-fixture',null,null),('ready',$1,'Synthetic published','Test instruction only','v1','published','owned-fixture',$2,now())",[C,F]);
  assert.deepEqual((await call(A,'dashboard')).data.lessons.map(l=>l.id),['ready']);
  assert.equal((await call(A,'lesson',null,{query:{id:'draft'}})).code,404);
  assert.equal((await call(A,'lesson',null,{query:{id:'ready'}})).data.body,'Test instruction only');
 });
 await t.test('private persisted draft is invisible to peer; client cannot forge owner or direct-update state',async()=>{
  const r=await call(A,'save',{milestone:'audit',body:'My private evidence baseline is 20 minutes.',shared:false,submit:false,version:0,user_id:B});assert.equal(r.code,200);
  sid=(await query(A,'select id from school_submissions')).rows[0].id;
  assert.equal((await query(B,'select * from school_submissions')).rows.length,0);
  assert.equal((await query(A,'select user_id from school_submissions')).rows[0].user_id,A);
  await assert.rejects(query(A,"update school_submissions set state='accepted'"),e=>e.code==='42501');
  await assert.rejects(query(A,"update school_memberships set role='facilitator'"),e=>e.code==='42501');
  assert.equal((await call(B,'review',{id:sid,version:1,decision:'peer',body:'A peer feedback example.'})).code,403);
 });
 await t.test('optimistic versions reject stale edits; peer cannot see a shared draft',async()=>{
  assert.equal((await call(A,'save',{milestone:'audit',body:'Updated private evidence baseline.',shared:true,submit:false,version:0})).code,409);
  assert.equal((await call(A,'save',{milestone:'audit',body:'Updated evidence baseline is 20 minutes.',shared:true,submit:false,version:1})).code,200);
  assert.equal((await query(B,'select * from school_submissions')).rows.length,0);
 });
 await t.test('submit -> peer feedback -> revision -> resubmit -> new peer feedback -> human acceptance',async()=>{
  assert.equal((await call(A,'save',{milestone:'audit',body:'My synthetic workflow takes 20 minutes.',shared:true,submit:true,version:2})).code,200);
  assert.equal((await call(F,'review',{id:sid,version:3,decision:'accepted',body:'Cannot skip the peer review.'})).code,403);
  assert.equal((await call(B,'review',{id:sid,version:3,decision:'accepted',body:'Cannot self-authorize acceptance.'})).code,403);
  assert.equal((await call(A,'review',{id:sid,version:3,decision:'peer',body:'Cannot review my own submission.'})).code,403);
  assert.equal((await call(B,'review',{id:sid,version:3,decision:'peer',body:'Describe the baseline measurement clearly.'})).code,200);
  assert.equal((await query(B,'select * from school_history')).rows.length,0);
  assert.equal((await call(A,'request-review',{id:sid,version:3})).code,200);
  assert.equal((await call(F,'review',{id:sid,version:3,decision:'changes_requested',body:'Add an observation to support the baseline.'})).code,200);
  assert.equal((await call(A,'save',{milestone:'audit',body:'Measured synthetic workflow: 20 minutes over three runs.',shared:true,submit:true,version:3})).code,200);
  assert.equal((await call(F,'review',{id:sid,version:4,decision:'accepted',body:'Old peer feedback must not carry forward.'})).code,403);
  await call(B,'review',{id:sid,version:4,decision:'peer',body:'The three observations clarify your starting point.'});
  await call(A,'request-review',{id:sid,version:4});
  assert.equal((await call(F,'review',{id:sid,version:4,decision:'accepted',body:'Baseline and problem are evidenced in this synthetic test.'})).code,200);
  const state=(await query(A,'select * from school_submissions')).rows[0];assert.equal(state.state,'accepted');assert.equal(state.version,4);
  const reviews=(await query(A,"select * from school_reviews where kind='accepted'")).rows;assert.equal(reviews[0].reviewer_id,F);assert.ok(reviews[0].created_at);
  assert.equal((await call(A,'save',{milestone:'audit',body:'Cannot rewrite accepted work.',shared:true,submit:true,version:4})).code,403);
  assert.equal((await query(A,'select * from school_history')).rows.length,10);
 });
 await t.test('cohort discussion, reply/report/hide and private-project separation',async()=>{
  assert.equal((await query(A,'select * from school_posts')).rows.length,0);
  await call(A,'post',{channel:'questions',body:'How should I record my synthetic baseline?'});post=(await query(A,'select id from school_posts')).rows[0].id;
  assert.equal((await call(B,'post',{channel:'questions',parent_id:post,body:'Try three short observations.'})).code,200);
  assert.equal((await call(B,'post',{channel:'wins',parent_id:post,body:'Cross-channel reply blocked.'})).code,403);
  await call(B,'report',{id:post,body:'Synthetic moderation report.'});await call(B,'report',{id:post,body:'Synthetic duplicate report.'});
  assert.equal((await query(B,'select * from school_reports')).rows.length,0);
  assert.equal((await query(F,'select * from school_reports')).rows.length,1);
  assert.equal((await call(A,'hide',{id:post})).code,403);
  assert.equal((await call(F,'hide',{id:post})).code,200);
  assert.equal((await query(A,'select * from school_posts')).rows.length,0);
 });
 await t.test('peer sharing can be withdrawn without erasing acceptance or evidence',async()=>{
  assert.equal((await call(B,'unshare',{id:sid})).code,403);
  assert.equal((await call(A,'unshare',{id:sid})).code,200);
  assert.equal((await query(B,'select * from school_submissions')).rows.length,0);
  assert.equal((await query(B,'select * from school_reviews')).rows.length,0);
  assert.equal((await query(A,'select state from school_submissions')).rows[0].state,'accepted');
 });
 await t.test('other-cohort membership does not expose work, discussions or moderator reports',async()=>{
  await db.exec("insert into academy_cohorts values('other',20,'2026-11-11',now(),now()+interval '30 days');");
  await db.query("insert into school_memberships values('other',$1,'facilitator',true,now()+interval '1 year')",[N]);
  assert.equal((await query(N,'select * from school_submissions')).rows.length,0);
  assert.equal((await query(N,'select * from school_posts')).rows.length,0);
  assert.equal((await call(N,'review',{id:sid,version:4,decision:'accepted',body:'Cross-cohort review denied.'})).code,403);
 });
 await t.test('revoked/expired work access denies reads and writes, own export stays available',async()=>{
  await db.query("update academy_grants set status='revoked' where user_id=$1",[A]);
  assert.equal((await call(A,'dashboard')).code,403);assert.equal((await query(A,'select * from school_submissions')).rows.length,0);
  assert.equal((await call(A,'post',{channel:'wins',body:'Must not save this.'})).code,403);
  const exported=await call(A,'export');assert.equal(exported.code,200);assert.equal(exported.data.submissions.length,1);assert.equal(exported.data.submissions[0].user_id,A);assert.ok(exported.data.history.length);
  assert.equal((await call(B,'export')).data.submissions.length,0);
  await db.query("update school_memberships set work_expires_at=now()-interval '1 second' where user_id=$1",[B]);assert.equal((await call(B,'dashboard')).code,403);
 });
 await t.test('submitted private work can opt into peer review later and revoke sharing again',async()=>{
  await db.query("update academy_grants set status='active' where user_id in ($1,$2)",[A,B]);
  await db.query("update school_memberships set work_expires_at=now()+interval '1 year' where user_id=$1",[B]);
  assert.equal((await call(A,'save',{milestone:'design',body:'A synthetic private design map with human review.',shared:false,submit:true,version:0})).code,200);
  const design=(await query(A,"select * from school_submissions where milestone='design'")).rows[0];
  assert.equal((await query(B,'select * from school_submissions where id=$1',[design.id])).rows.length,0);
  assert.equal((await call(B,'sharing',{id:design.id,shared:true})).code,403);
  assert.equal((await call(A,'sharing',{id:design.id,shared:true})).code,200);
  assert.equal((await query(B,'select * from school_submissions where id=$1',[design.id])).rows.length,1);
  assert.equal((await call(B,'review',{id:design.id,version:1,decision:'peer',body:'The human review step is clearly marked.'})).code,200);
  assert.equal((await call(A,'sharing',{id:design.id,shared:false})).code,200);
  assert.equal((await query(B,'select * from school_reviews where submission_id=$1',[design.id])).rows.length,0);
  assert.equal((await query(A,'select version from school_submissions where id=$1',[design.id])).rows[0].version,1);
 });
 await t.test('portable export contains owned evidence and human decisions, excludes another learner and credential issuance',async()=>{
  await call(B,'save',{milestone:'measure',body:'PRIVATE_B_EXPORT_SENTINEL synthetic work must never enter A export.',shared:false,submit:false,version:0});
  const exported=await call(A,'export');assert.equal(exported.code,200);
  assert.equal(exported.data.format,'maim-academy-work-record');assert.equal(exported.data.schema_version,1);assert.ok(exported.data.exported_at);assert.equal(exported.data.credential_issued,false);
  assert.ok(exported.data.submissions.every(s=>s.user_id===A));assert.ok(!JSON.stringify(exported.data).includes('PRIVATE_B_EXPORT_SENTINEL'));
  assert.ok(exported.data.submissions.some(s=>s.id===sid&&s.state==='accepted'&&s.body.includes('20 minutes')));
  assert.ok(exported.data.reviews.some(r=>r.kind==='accepted'&&r.reviewer_id===F&&r.created_at));
  assert.ok(exported.data.history.some(h=>h.event==='accepted'&&h.actor_id===F&&h.snapshot.feedback));
  assert.equal(exported.data.reports,undefined);assert.equal(exported.data.memberships,undefined);
  for(const uid of [A,F])assert.equal((await call(uid,'issue-credential',{id:sid})).code,400);
 });
 await t.test('anonymous and auth role cannot invoke definer functions',async()=>{
  for(const role of ['anon','authenticated','academy_test_auth']){await db.exec('begin;set local role '+role);await assert.rejects(db.exec('select academy_test.school_export()'),e=>e.code==='42501');await db.exec('rollback');}
 });
});
