import {readFile} from 'node:fs/promises';
import * as runtime from '../lib/member-runtime.js';
import {renderSchool} from '../lib/school-view.js';
const cohort=JSON.parse(await readFile(new URL('../data/school-cohort.json',import.meta.url),'utf8'));
const validId=v=>typeof v==='string'&&runtime.UUID.test(v);
const text=(v,min,max)=>typeof v==='string'&&v.trim().length>=min&&v.length<=max;
const gatedRuntime={...runtime,configured:()=>runtime.configured()&&process.env.ENABLE_ACADEMY_SCHOOL==='true'};
export function createSchoolHandler(deps=gatedRuntime){return async(req,res)=>{
 deps.secure(res);
 if(!deps.configured())return res.status(503).json({error:'The school is being prepared. Member access is not enabled.'});
 try{
  const session=await deps.sessionFor(req);if(!session)return res.status(401).json({error:'Please sign in to your Academy account.'});
  return await deps.withMemberResponse(session.user.id,res,async(db,out)=>{
   const action=req.query?.action||'dashboard';
   if(req.method==='GET'&&action==='export'){
    const {rows}=await db.query('select school_export() as data');out.setHeader('Content-Disposition','attachment; filename="my-academy-work.json"');return out.status(200).json(rows[0].data);
   }
   const {rows:memberships}=await db.query('select role,work_expires_at from school_memberships where user_id=$1 and cohort_id=$2 and school_access(cohort_id)',[session.user.id,cohort.id]);
   const membership=memberships[0];if(!membership)return out.status(403).json({error:'Active cohort membership and work access are required.'});
   if(req.method==='GET'){
    if(action==='page'){
     if(req.query?.section==='facilitator'&&membership.role!=='facilitator')return out.status(403).json({error:'Facilitator access required.'});
     out.setHeader('Content-Type','text/html; charset=utf-8');return out.status(200).send(renderSchool(false));
    }
    if(action==='lesson'){
     if(!text(req.query?.id,1,100))return out.status(400).json({error:'Invalid lesson.'});
     const {rows}=await db.query("select id,title,body,version,source_ref from school_lessons where id=$1 and cohort_id=$2 and status='published'",[req.query.id,cohort.id]);
     return rows[0]?out.status(200).json(rows[0]):out.status(404).json({error:'This lesson is not published.'});
    }
    if(action!=='dashboard')return out.status(404).json({error:'Not found.'});
    const submissions=(await db.query('select * from school_submissions where cohort_id=$1 order by updated_at desc limit 200',[cohort.id])).rows;
    const reviews=(await db.query('select r.* from school_reviews r join school_submissions s on s.id=r.submission_id where s.cohort_id=$1 order by r.created_at limit 500',[cohort.id])).rows;
    const history=(await db.query('select h.* from school_history h join school_submissions s on s.id=h.submission_id where s.cohort_id=$1 order by h.created_at limit 500',[cohort.id])).rows;
    const posts=(await db.query('select * from school_posts where cohort_id=$1 order by created_at desc limit 200',[cohort.id])).rows;
    const lessons=(await db.query("select id,title,version,status from school_lessons where cohort_id=$1 and status='published' order by id",[cohort.id])).rows;
    const reports=membership.role==='facilitator'?(await db.query('select r.* from school_reports r join school_posts p on p.id=r.post_id where p.cohort_id=$1 and r.resolved_at is null',[cohort.id])).rows:[];
    return out.status(200).json({user_id:session.user.id,membership,cohort,submissions,reviews,history,posts,lessons,reports});
   }
   if(req.method!=='POST'){out.setHeader('Allow','GET, POST');return out.status(405).end();}
   if(!deps.sameOrigin(req))return out.status(403).json({error:'Origin rejected.'});
   let b;try{b=await deps.bodyFor(req);}catch{return out.status(400).json({error:'Invalid request.'});}
   if(!b||typeof b!=='object')return out.status(400).json({error:'Invalid request.'});
   const version=Number.isInteger(b.version)&&b.version>=0;
   if(action==='save'&&cohort.projects.some(p=>p.id===b.milestone)&&text(b.body,10,4000)&&typeof b.shared==='boolean'&&typeof b.submit==='boolean'&&version){
    await db.query('select school_save($1,$2,$3,$4,$5,$6)',[cohort.id,b.milestone,b.body,b.shared,b.submit,b.version]);
   }else if(action==='review'&&validId(b.id)&&version&&['peer','changes_requested','accepted'].includes(b.decision)&&text(b.body,10,2000)){
    await db.query('select school_review($1,$2,$3,$4)',[b.id,b.version,b.decision,b.body]);
   }else if(action==='request-review'&&validId(b.id)&&version){await db.query('select school_request_review($1,$2)',[b.id,b.version]);
   }else if(action==='post'&&['introductions','questions','resources','wins','showcases'].includes(b.channel)&&text(b.body,5,2000)&&(!b.parent_id||validId(b.parent_id))){await db.query('select school_post($1,$2,$3,$4)',[cohort.id,b.channel,b.body,b.parent_id||null]);
   }else if(action==='report'&&validId(b.id)&&text(b.body,5,1000)){await db.query('select school_report($1,$2)',[b.id,b.body]);
   }else if(action==='sharing'&&validId(b.id)&&typeof b.shared==='boolean'){await db.query('select school_set_sharing($1,$2)',[b.id,b.shared]);
   }else if(action==='unshare'&&validId(b.id)){await db.query('select school_unshare($1)',[b.id]);
   }else if(action==='hide'&&validId(b.id)){await db.query('select school_hide($1)',[b.id]);
   }else return out.status(400).json({error:'Invalid school action or fields.'});
   return out.status(200).json({saved:true});
  });
 }catch(error){
  if(error.code==='P0001')return res.status(error.message==='Version conflict'?409:403).json({error:error.message==='Version conflict'?'Your work changed. Reload before saving.':'This action is not permitted in the current review state.'});
  return res.status(503).json({error:'The school is temporarily unavailable. Your action has not been confirmed.'});
 }
};}
export default createSchoolHandler();
