import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function submit(reply, {ok=true, rejects=false}={}) {
  const status={textContent:''}, button={disabled:false};
  let listener, resets=0, calls=0;
  const form={email:{value:'test@example.invalid'},first_name:{value:'Test'},website:{value:''},querySelector:()=>button,reset(){resets++;},addEventListener(_event,fn){listener=fn;}};
  const context={document:{getElementById:id=>id==='reserve-form'?form:status},fetch:async()=>{calls++;if(rejects)throw new Error('Network unavailable.');return {ok,json:async()=>reply};}};
  vm.runInNewContext(await readFile('public/reserve.js','utf8'),context);
  await listener({preventDefault(){}});
  return {message:status.textContent,resets,calls,disabled:button.disabled};
}
test('guide-only and honeypot-shaped success never claim cohort enrollment',async()=>{
  for(const reply of [{ok:true,waitlisted:false},{ok:true,guide:'/guide.pdf'}]){
    const result=await submit(reply);assert.match(result.message,/reservation was not confirmed/);assert.equal(result.resets,0);assert.equal(result.disabled,false);
  }
});
test('confirmed interest-list entry states target invitation and distinguishes paid capacity',async()=>{
  const result=await submit({ok:true,waitlisted:true});assert.match(result.message,/Payments open 11 November/);assert.match(result.message,/cohort begins 18 November/);assert.doesNotMatch(result.message,/4 November/);assert.match(result.message,/does not guarantee/);assert.equal(result.resets,1);
});
test('provider and network failures preserve retry and do not claim successful signup',async()=>{
  for(const result of [await submit({error:'Signup unavailable'},{ok:false}),await submit({}, {rejects:true})]){assert.match(result.message,/contact@majoraimindset.com/);assert.equal(result.resets,0);assert.equal(result.disabled,false);}
});
