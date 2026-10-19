import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const routes=['index','library','spark-lab','foundry'];
test('informational routes resolve local links and prohibit active commerce/PII collection',async()=>{for(const route of routes){const s=await readFile(`dist/${route}.html`,'utf8');assert.match(s,/noindex,nofollow/);assert.match(s,/Skip to content/);assert.equal((s.match(/<h1>/g)||[]).length,1);assert.doesNotMatch(s,/<(?:form|input|script|iframe)\b|buy\.stripe|gumroad|convertkit|shopify/i);for(const [,href]of s.matchAll(/href="(\/[^"]*)"/g)){const p=href.split('#')[0];await access(`dist${p==='/'?'/index.html':p.includes('.')?p:p+'.html'}`);}}});
test('checkout is explicitly unavailable and no payment functions are configured',async()=>{assert.equal(JSON.parse(await readFile('dist/api/checkout.json')).available,false);const config=JSON.parse(await readFile('vercel.json'));assert.equal(config.functions,undefined);assert.equal(config.env,undefined);});
test('Foundry and book maturity remain qualified',async()=>{assert.match(await readFile('dist/foundry.html','utf8'),/proposed|Proposed/);assert.match(await readFile('dist/library.html','utf8'),/Foundation stage/);assert.match(await readFile('dist/library.html','utf8'),/Books in production/);});
