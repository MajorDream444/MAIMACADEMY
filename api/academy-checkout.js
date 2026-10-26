import Stripe from 'stripe';
import {randomUUID,randomBytes} from 'node:crypto';
import {configured,sessionFor,secure,sameOrigin,database,withMember,hash} from '../lib/member-runtime.js';
import {JOURNEY,checkoutConfigured} from '../lib/access-policy.js';
export default async function handler(req,res){
 secure(res);if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({available:false});}
 if(!configured()||!checkoutConfigured(process.env))return res.status(503).json({available:false,reason:'TEST checkout is not approved/configured.'});
 if(!sameOrigin(req))return res.status(403).json({available:false});
 try{
  const session=await sessionFor(req);if(!session)return res.status(401).json({available:false});
  const consent=await withMember(session.user.id,async db=>(await db.query('select user_id from academy_reservations where user_id=$1',[session.user.id])).rowCount);
  if(!consent)return res.status(409).json({available:false,reason:'Reservation consent required.'});
  const stripe=new Stripe(process.env.ACADEMY_STRIPE_KEY,{timeout:10000,maxNetworkRetries:1});
  const price=await stripe.prices.retrieve(process.env.ACADEMY_JOURNEY_PRICE_ID,{expand:['product']});
  if(price.livemode||!price.active||price.type!=='one_time'||price.unit_amount!==24900||price.currency!=='usd'||!price.product?.active||price.product.metadata?.sku!=='MAIM-ACADEMY-JOURNEY-001')throw new Error('Price mismatch');
  const db=database('worker');let seat=(await db.query('select * from claim_seat($1,$2)',[session.user.id,randomUUID()])).rows[0];
  if(!seat||!['pending','checkout'].includes(seat.status))return res.status(409).json({available:false,reason:'A paid or held seat already exists.'});
  // Acceptance metadata is frozen before any external create; retry uses the same seat/key.
  seat=(await db.query('update academy_seats set agreement_version=coalesce(agreement_version,$2),terms_url=coalesce(terms_url,$3),price_id=coalesce(price_id,$4) where id=$1 returning *',[seat.id,process.env.ACADEMY_AGREEMENT_VERSION,process.env.ACADEMY_TERMS_URL,price.id])).rows[0];
  const proposedPayload={mode:'payment',line_items:[{price:seat.price_id,quantity:1}],client_reference_id:session.user.id,customer_email:session.user.email,metadata:{offer:JOURNEY,user_id:session.user.id,user_email_hash:hash(session.user.email.toLowerCase()),agreement_version:seat.agreement_version,terms_url:seat.terms_url,seat_id:seat.id,cohort:seat.cohort_id},success_url:process.env.ACADEMY_ORIGIN+'/member-room?payment=pending',cancel_url:process.env.ACADEMY_ORIGIN+'/major-moves',consent_collection:{terms_of_service:'required'},custom_text:{terms_of_service_acceptance:{message:`I agree to the [journey terms](${seat.terms_url}).`}},integration_identifier:'maim_academy_'+[...randomBytes(8)].map(x=>String.fromCharCode(97+x%26)).join('')};
  seat=(await db.query('update academy_seats set checkout_payload=coalesce(checkout_payload,$2::jsonb) where id=$1 returning *',[seat.id,JSON.stringify(proposedPayload)])).rows[0];
  const result=seat.session_id?await stripe.checkout.sessions.retrieve(seat.session_id):await stripe.checkout.sessions.create(seat.checkout_payload,{idempotencyKey:'academy-seat-'+seat.id});
  if(result.livemode||!result.url?.startsWith('https://checkout.stripe.com/'))throw new Error('Invalid checkout');
  await db.query("update academy_seats set session_id=$2,status='checkout' where id=$1 and status in ('pending','checkout')",[seat.id,result.id]);
  return res.status(200).json({url:result.url});
 }catch{return res.status(503).json({available:false,reason:'Test checkout unavailable. A pending seat is retained for safe recovery.'});}
}
