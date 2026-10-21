import {toNodeHandler} from 'better-auth/node';
import {configured,memberAuth,secure} from '../../lib/member-runtime.js';
export const config={api:{bodyParser:false}};
export default async function handler(req,res){secure(res);if(!configured())return res.status(503).json({error:'Member sign-in is not open yet.'});try{return await toNodeHandler(memberAuth())(req,res);}catch{return res.status(503).json({error:'Sign-in unavailable. Please try again later.'});}}
