import {configured,database,secure,bodyFor} from '../../lib/member-runtime.js';
import {authRequest} from '../../lib/supabase-auth.js';
export default async function handler(req,res){secure(res);if(!configured())return res.status(503).json({error:'Member sign-in is not open yet.'});try{if(req.method==='POST')req.body=await bodyFor(req);return await authRequest(req,res,{db:database('auth')});}catch{return res.status(503).json({error:'Sign-in unavailable. Please request a fresh link.'});}}
