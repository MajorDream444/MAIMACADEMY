import {UUID} from './member-runtime.js';
import {paidJourney} from './access-policy.js';
// Called only after Stripe signature verification and TEST-mode checks.
export async function applyTestPayment(db,event,session){
 const paid=['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type);
 const expired=event.type==='checkout.session.expired';
 const refund=event.type==='charge.refunded'||event.type==='charge.dispute.created';
 if(!paid&&!expired&&!refund)return {ignored:true};
 if(event.livemode!==false)throw new Error('TEST event required');
 const object=event.data.object;
 const pi=paid?(typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id):typeof object.payment_intent==='string'?object.payment_intent:object.payment_intent?.id;
 // Global cohort lock serializes admission, completion, refund and expiration.
 await db.query("select id from academy_cohorts where id='founding-2026-11-18' for update");
 if((await db.query('select id from academy_payment_events where id=$1',[event.id])).rowCount)return {duplicate:true};
 if(expired){
  await db.query("update academy_seats set status='expired' where session_id=$1 and status='checkout'",[object.id]);
  await db.query('insert into academy_payment_events(id,payment_intent,event_type) values($1,$2,$3)',[event.id,pi||object.id,event.type]);return {expired:true};
 }
 if(typeof pi!=='string')throw new Error('Missing payment intent');
 if(paid){
  if(!UUID.test(session.metadata?.seat_id||''))throw new Error('Missing seat');
  const seat=(await db.query('select * from academy_seats where id=$1 for update',[session.metadata.seat_id])).rows[0];
  if(!seat||String(seat.user_id)!==session.client_reference_id||seat.cohort_id!==session.metadata.cohort||session.metadata.terms_url!==seat.terms_url||!paidJourney(session,{priceId:seat.price_id,amount:24900,agreementVersion:seat.agreement_version})||(seat.session_id&&seat.session_id!==session.id)||seat.status==='expired')throw new Error('Payment/seat mismatch');
  const hold=(await db.query('select reason from academy_payment_holds where payment_intent=$1',[pi])).rows[0];
  const held=Boolean(hold);
  const status=seat.status==='refunded'||hold?.reason==='full_refund'?'refunded':held||seat.status==='held'?'held':'paid';
  await db.query('update academy_seats set session_id=$2,payment_intent=$3,status=$4 where id=$1',[seat.id,session.id,pi,status]);
  await db.query("insert into academy_grants(user_id,resource,status,starts_at,expires_at,source_payment,offer_version) values($1,'journey',$2,now(),null,$3,$4) on conflict(source_payment) do nothing",[seat.user_id,status==='paid'?'active':status==='refunded'?'revoked':'held',pi,seat.agreement_version]);
  if(status==='paid')await db.query('insert into academy_receipts(payment_intent,user_id,session_id) values($1,$2,$3) on conflict(payment_intent) do nothing',[pi,seat.user_id,session.id]);
 }else{
  const full=event.type==='charge.refunded'&&object.amount_refunded>=object.amount;
  await db.query("insert into academy_payment_holds(payment_intent,reason) values($1,$2) on conflict(payment_intent) do update set reason=case when academy_payment_holds.reason='full_refund' then academy_payment_holds.reason else excluded.reason end",[pi,full?'full_refund':event.type]);
  await db.query("update academy_grants set status=$2 where source_payment=$1 and status<>'revoked'",[pi,full?'revoked':'held']);
  await db.query("update academy_session_credits set status='revoked' where grant_id in (select id from academy_grants where source_payment=$1)",[pi]);
  await db.query("update academy_seats set status=$2 where payment_intent=$1 and status<>'refunded'",[pi,full?'refunded':'held']);
 }
 await db.query('insert into academy_payment_events(id,payment_intent,event_type) values($1,$2,$3)',[event.id,pi,event.type]);return {processed:true};
}
