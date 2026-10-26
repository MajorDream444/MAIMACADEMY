import {allowedEmail,hash} from './member-runtime.js';
// No email sends unless explicitly enabled; uncertainty requires operator review.
export async function deliverReceipt(db,session,{env=process.env,fetcher=fetch}={}){
 if(env.ENABLE_ACADEMY_RECEIPT_EMAIL!=='true'||!env.ACADEMY_RESEND_KEY||!/@majoraimindset\.com(?:>|$)/i.test(env.ACADEMY_EMAIL_FROM||'')||!/@majoraimindset\.com$/i.test(env.ACADEMY_SUPPORT_EMAIL||''))return 'blocked';
 const email=session.customer_details?.email?.toLowerCase();
 if(!allowedEmail(email,env)||hash(email)!==session.metadata?.user_email_hash)throw new Error('QA receipt identity mismatch');
 const rows=(await db.query("update academy_receipts set status='sending' where session_id=$1 and status in ('pending','failed') and exists(select 1 from academy_grants where source_payment=academy_receipts.payment_intent and status='active') returning payment_intent",[session.id])).rows;
 if(!rows.length)return 'not_pending';
 let response;
 try{response=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.ACADEMY_RESEND_KEY,'Content-Type':'application/json','Idempotency-Key':'academy-receipt-'+session.id},body:JSON.stringify({from:env.ACADEMY_EMAIL_FROM,to:[email],reply_to:env.ACADEMY_SUPPORT_EMAIL,subject:'Your MAIM Academy test purchase',text:'Your controlled TEST purchase is recorded. No live payment was made. Open your private member room: '+env.ACADEMY_ORIGIN+'/member-room\nSupport: '+env.ACADEMY_SUPPORT_EMAIL}),signal:AbortSignal.timeout(10000)});}
 catch{await db.query("update academy_receipts set status='uncertain' where session_id=$1",[session.id]);return 'uncertain';}
 if(!response.ok){const state=response.status>=500||[408,409].includes(response.status)?'uncertain':'failed';await db.query('update academy_receipts set status=$2 where session_id=$1',[session.id,state]);return state;}
 let data;try{data=await response.json();}catch{data={};}
 if(!data.id){await db.query("update academy_receipts set status='uncertain' where session_id=$1",[session.id]);return 'uncertain';}
 // If this write fails, 'sending' remains held; never blindly send again.
 await db.query("update academy_receipts set status='accepted',provider_id=$2 where session_id=$1",[session.id,data.id]);return 'accepted';
}
