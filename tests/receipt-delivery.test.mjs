import {test} from 'node:test';import assert from 'node:assert/strict';import {deliverReceipt} from '../lib/receipt-delivery.js';import {hash} from '../lib/member-runtime.js';
test('receipt is gated, allowlisted, durable and never resends uncertain or accepted delivery',async()=>{
 const email='qa@example.invalid',session={id:'cs_test_qa',customer_details:{email},metadata:{user_email_hash:hash(email)}};
 const env={ENABLE_ACADEMY_RECEIPT_EMAIL:'true',ACADEMY_RESEND_KEY:'fixture',ACADEMY_EMAIL_FROM:'MAIM QA <qa@majoraimindset.com>',ACADEMY_SUPPORT_EMAIL:'contact@majoraimindset.com',ACADEMY_ORIGIN:'https://academy.example.invalid',ACADEMY_PILOT_EMAILS:email};
 let state='pending',sends=0;const db={query:async(sql)=>{if(sql.includes("set status='sending'")){if(!['pending','failed'].includes(state))return{rows:[]};state='sending';return{rows:[{payment_intent:'pi_test'}]};}state=sql.includes("status='accepted'")?'accepted':sql.includes("status='uncertain'")?'uncertain':'failed';return{rows:[]};}};
 const fetcher=async()=>{sends++;return{ok:true,json:async()=>({id:'message_fixture'})};};assert.equal(await deliverReceipt(db,session,{env:{},fetcher}),'blocked');assert.equal(sends,0);
 assert.equal(await deliverReceipt(db,session,{env,fetcher}),'accepted');assert.equal(await deliverReceipt(db,session,{env,fetcher}),'not_pending');assert.equal(sends,1);
 state='pending';assert.equal(await deliverReceipt(db,session,{env,fetcher:async()=>{throw Error('timeout');}}),'uncertain');assert.equal(await deliverReceipt(db,session,{env,fetcher}),'not_pending');assert.equal(sends,1);
 await assert.rejects(deliverReceipt(db,{...session,customer_details:{email:'other@example.invalid'}},{env,fetcher}),/identity/);
});
