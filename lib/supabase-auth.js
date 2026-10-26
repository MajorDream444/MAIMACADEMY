import {randomBytes,createHash,createCipheriv,createDecipheriv} from 'node:crypto';
import {allowedEmail,UUID,hash,cookie,sessionCookie,COOKIE} from './member-runtime.js';
const PKCE='__Host-maim_academy_pkce';
function key(env){return createHash('sha256').update(env.ACADEMY_AUTH_SECRET).digest();}
function seal(value,env){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(env),iv);const encrypted=Buffer.concat([cipher.update(JSON.stringify(value)),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64url');}
function unseal(value,env){const b=Buffer.from(value,'base64url');const cipher=createDecipheriv('aes-256-gcm',key(env),b.subarray(0,12));cipher.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([cipher.update(b.subarray(28)),cipher.final()]).toString());}
const pkceCookie=(v,age=600)=>`${PKCE}=${v}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;
export async function authRequest(req,res,{env=process.env,fetcher=fetch,db,now=()=>Date.now()}={}){
 const path=new URL(req.url,env.ACADEMY_ORIGIN).pathname;
 const headers={apikey:env.ACADEMY_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'};
 const post=async(path,body)=>{const r=await fetcher(env.ACADEMY_SUPABASE_URL+'/auth/v1/'+path,{method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('Authentication unavailable');return r.json();};
 if(path.endsWith('/sign-in/magic-link')){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  if(req.headers.origin!==env.ACADEMY_ORIGIN)return res.status(403).json({error:'Origin rejected.'});
  if(env.ENABLE_ACADEMY_AUTH_EMAIL!=='true')return res.status(503).json({error:'Sign-in email is not open yet.'});
  const email=req.body?.email?.trim().toLowerCase();
  if(!allowedEmail(email,env))return res.status(200).json({requested:true});
  const verifier=randomBytes(32).toString('base64url');
  await post('otp?redirect_to='+encodeURIComponent(env.ACADEMY_ORIGIN+'/api/academy-auth/callback'),{email,create_user:false,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'s256'});
  res.setHeader('Set-Cookie',pkceCookie(seal({verifier,email,expires:now()+600000},env)));
  return res.status(200).json({requested:true});
 }
 if(path.endsWith('/callback')){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed.'});
  res.setHeader('Set-Cookie',pkceCookie('',0));
  const state=unseal(cookie(req,PKCE),env),code=new URL(req.url,env.ACADEMY_ORIGIN).searchParams.get('code');
  if(!code||code.length>2000||state.expires<=now()||!allowedEmail(state.email,env))throw new Error('Invalid sign-in');
  const data=await post('token?grant_type=pkce',{auth_code:code,code_verifier:state.verifier});
  // Verified provider response, never user_metadata or an unverified JWT decode.
  if(!UUID.test(data.user?.id)||!data.user?.email_confirmed_at||data.user.email?.toLowerCase()!==state.email)throw new Error('Invalid identity');
  const token=randomBytes(32).toString('hex');
  await db.query('select create_session($1,$2)',[hash(token),data.user.id]);
  const check=await db.query('select * from resolve_session($1)',[hash(token)]);
  if(check.rows[0]?.user_id!==data.user.id)throw new Error('QA identity not registered');
  res.setHeader('Set-Cookie',[pkceCookie('',0),sessionCookie(token)]);
  res.setHeader('Location','/member-room');return res.status(303).end();
 }
 if(path.endsWith('/sign-out')){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  if(req.headers.origin!==env.ACADEMY_ORIGIN)return res.status(403).json({error:'Origin rejected.'});
  const token=cookie(req,COOKIE);if(/^[a-f0-9]{64}$/.test(token))await db.query('select revoke_session($1)',[hash(token)]);
  res.setHeader('Set-Cookie',sessionCookie('',0));return res.status(200).json({signedOut:true});
 }
 return res.status(404).json({error:'Not found.'});
}
