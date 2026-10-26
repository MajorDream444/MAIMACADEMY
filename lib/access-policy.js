export const JOURNEY = 'major-moves-founding';
export const VAULT_TERMS = Object.freeze([1,3,6,12]);
export function addCalendarMonths(iso, months) {
  if (!VAULT_TERMS.includes(months)) throw new Error('Invalid vault term');
  const d=new Date(iso); if(!Number.isFinite(d.getTime()))throw new Error('Invalid date');
  const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+months);
  const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d.toISOString();
}
export function canAccess(grants,userId,resource,now=new Date()) {
  const at=+new Date(now);if(!userId||!Number.isFinite(at)||!['journey','vault'].includes(resource))return false;
  return grants.some(g=>g.user_id===userId&&g.resource===resource&&g.status==='active'&&Number.isFinite(Date.parse(g.starts_at))&&Date.parse(g.starts_at)<=at&&(g.expires_at===null||Number.isFinite(Date.parse(g.expires_at))&&Date.parse(g.expires_at)>at));
}
export function validateProgress(body) {
  const day=Number(body.day);if(!Number.isInteger(day)||day<1||day>30)throw new Error('Invalid day');
  if(typeof body.reflection!=='string'||body.reflection.length>4000)throw new Error('Reflection must be at most 4000 characters');
  if(!['started','completed'].includes(body.status))throw new Error('Invalid status');
  return {day,status:body.status,reflection:body.reflection};
}
export function paidJourney(session,{priceId,amount,currency='usd',agreementVersion}) {
  const item=session.line_items?.data;
  return session.livemode===false&&session.mode==='payment'&&session.payment_status==='paid'&&session.metadata?.offer===JOURNEY&&!!agreementVersion&&session.metadata?.agreement_version===agreementVersion&&typeof session.client_reference_id==='string'&&session.client_reference_id.length>0&&session.client_reference_id===session.metadata?.user_id&&session.amount_subtotal===amount&&session.currency===currency&&Array.isArray(item)&&item.length===1&&item[0].quantity===1&&item[0].price?.id===priceId;
}
export function checkoutConfigured(env) {
  return env.ENABLE_ACADEMY_TEST_CHECKOUT==='true'&&env.ACADEMY_OFFER_APPROVED==='true'&&/^rk_test_/.test(env.ACADEMY_STRIPE_KEY||'')&&!!env.ACADEMY_STRIPE_WEBHOOK_SECRET&&/^price_/.test(env.ACADEMY_JOURNEY_PRICE_ID||'')&&Number.isSafeInteger(Number(env.ACADEMY_PRICE_CENTS))&&Number(env.ACADEMY_PRICE_CENTS)===24900&&!!env.ACADEMY_AGREEMENT_VERSION&&/^https:\/\//.test(env.ACADEMY_TERMS_URL||'');
}
