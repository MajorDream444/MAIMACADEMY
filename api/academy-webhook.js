import Stripe from 'stripe';
import {configured,database,secure} from '../lib/member-runtime.js';
import {checkoutConfigured} from '../lib/access-policy.js';
import {deliverReceipt} from '../lib/receipt-delivery.js';
import {applyTestPayment} from '../lib/test-payment-events.js';
export const config={api:{bodyParser:false}};
async function rawBody(req){let size=0;const chunks=[];for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>1000000)throw new Error('Too large');chunks.push(Buffer.from(chunk));}return Buffer.concat(chunks);}
export default async function handler(req,res){secure(res);if(req.method!=='POST')return res.status(405).end();if(!configured()||!checkoutConfigured(process.env))return res.status(503).json({received:false});const stripe=new Stripe(process.env.ACADEMY_STRIPE_KEY,{timeout:10000,maxNetworkRetries:1});let event;try{event=stripe.webhooks.constructEvent(await rawBody(req),req.headers['stripe-signature'],process.env.ACADEMY_STRIPE_WEBHOOK_SECRET);}catch{return res.status(400).json({error:'Invalid signature.'});}if(event.livemode!==false)return res.status(400).json({error:'Test events only.'});let client;try{
 let session;if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))session=await stripe.checkout.sessions.retrieve(event.data.object.id,{expand:['line_items']});
 if(event.type==='charge.dispute.created'){const charge=await stripe.charges.retrieve(event.data.object.charge);event.data.object.payment_intent=charge.payment_intent;}
 client=await database('worker').connect();await client.query('begin');const result=await applyTestPayment(client,event,session);await client.query('commit');client.release();client=null;if(session)await deliverReceipt(database('worker'),session);return res.status(200).json({received:true,...result});
 }catch{if(client)await client.query('rollback');return res.status(503).json({error:'Payment sync pending retry.'});}finally{client?.release();}}
