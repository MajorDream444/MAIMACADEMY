import pg from 'pg';
import {createHash} from 'node:crypto';
const pools=new Map();
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const COOKIE='__Host-maim_academy';
export function allowedEmail(email,env=process.env){return typeof email==='string'&&(env.ACADEMY_PILOT_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());}
function origin(value){try{return new URL(value).origin===value&&value.startsWith('https://');}catch{return false;}}
export function configured(env=process.env){return env.VERCEL_ENV==='preview'&&env.ACADEMY_IDENTITY_MODEL==='supabase-uuid-test-v1'&&env.ACADEMY_DATABASE_SCHEMA==='academy_test'&&env.ENABLE_ACADEMY_MEMBERS==='true'&&[env.ACADEMY_DATABASE_URL,env.ACADEMY_AUTH_DATABASE_URL,env.ACADEMY_WORKER_DATABASE_URL].every(Boolean)&&new Set([env.ACADEMY_DATABASE_URL,env.ACADEMY_AUTH_DATABASE_URL,env.ACADEMY_WORKER_DATABASE_URL]).size===3&&!!env.ACADEMY_AUTH_SECRET&&env.ACADEMY_AUTH_SECRET.length>=32&&origin(env.ACADEMY_ORIGIN)&&origin(env.ACADEMY_SUPABASE_URL)&&!!env.ACADEMY_SUPABASE_PUBLISHABLE_KEY&&!!env.ACADEMY_PILOT_EMAILS;}
export function hash(value){return createHash('sha256').update(value).digest('hex');}
export function cookie(req,name){return String(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='))?.slice(name.length+1)||'';}
export function sessionCookie(token,age=3600){return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`;}
export function database(kind='worker'){
 if(!configured())throw new Error('Members not configured');
 const variable={member:'ACADEMY_DATABASE_URL',auth:'ACADEMY_AUTH_DATABASE_URL',worker:'ACADEMY_WORKER_DATABASE_URL'}[kind];
 if(!variable)throw new Error('Invalid role');
 const key=kind+process.env[variable];
 if(!pools.has(key))pools.set(key,new pg.Pool({connectionString:process.env[variable],options:'-c search_path=academy_test,pg_catalog',max:2,connectionTimeoutMillis:5000,statement_timeout:10000}));
 const connect=async()=>{const client=await pools.get(key).connect();try{
  const {rows}=await client.query("select rolsuper,rolbypassrls,pg_has_role(current_user,$1,'member') as expected,pg_has_role(current_user,$2,'member') as other_a,pg_has_role(current_user,$3,'member') as other_b from pg_roles where rolname=current_user",['academy_test_'+kind,...['member','worker','auth'].filter(x=>x!==kind).map(x=>'academy_test_'+x)]);
  if(rows.length!==1||rows[0].rolsuper||rows[0].rolbypassrls||!rows[0].expected||rows[0].other_a||rows[0].other_b)throw new Error('Restricted TEST role required');
  return client;
 }catch(error){client.release();throw error;}};
 return {connect,query:async(...args)=>{const c=await connect();try{return await c.query(...args);}finally{c.release();}}};
}
export async function withMember(uid,work){if(!UUID.test(uid))throw new Error('Invalid identity');const c=await database('member').connect();try{await c.query('begin');await c.query("select set_config('request.jwt.claim.sub',$1,true)",[uid]);const result=await work(c);await c.query('commit');return result;}catch(error){await c.query('rollback');throw error;}finally{c.release();}}
// Do not acknowledge a saved reflection/booking before its transaction commits.
export async function withMemberResponse(uid,res,work,transaction=withMember){
 let code=200,kind='end',body;const headers=[];
 const staged={status(value){code=value;return this;},json(value){kind='json';body=value;return this;},end(){kind='end';return this;},setHeader(k,v){headers.push([k,v]);}};
 await transaction(uid,db=>work(db,staged));
 for(const [k,v] of headers)res.setHeader(k,v);
 return kind==='json'?res.status(code).json(body):res.status(code).end();
}
export async function sessionFor(req){const token=cookie(req,COOKIE);if(!/^[a-f0-9]{64}$/.test(token))return null;const {rows}=await database('auth').query('select * from resolve_session($1)',[hash(token)]);const user=rows[0];return user&&UUID.test(user.user_id)&&allowedEmail(user.email)?{user:{id:user.user_id,email:user.email,emailVerified:true}}:null;}
export function secure(res){res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Vary','Cookie');res.setHeader('Referrer-Policy','no-referrer');}
export function sameOrigin(req){return req.headers.origin===process.env.ACADEMY_ORIGIN;}
export async function bodyFor(req){if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;let text=typeof req.body==='string'?req.body:'';if(!text)for await(const c of req){text+=c;if(Buffer.byteLength(text)>10000)throw new Error('Request too large');}if(Buffer.byteLength(text)>10000)throw new Error('Request too large');return JSON.parse(text||'{}');}
