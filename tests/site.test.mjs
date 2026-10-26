import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const routes=['index','library','spark-lab','foundry','major-moves'];
test('informational routes are indexable, resolve local links and take no payment or personal data',async()=>{for(const route of routes){const s=await readFile(`dist/${route}.html`,'utf8');assert.match(s,/index,follow/);assert.doesNotMatch(s,/noindex/);assert.match(s,/href="\/reserve"/);assert.match(s,/Skip to content/);assert.equal((s.match(/<h1\b[^>]*>/g)||[]).length,1);assert.doesNotMatch(s,/<(?:form|input|iframe)\b|buy\.stripe|gumroad|convertkit|shopify/i);assert.deepEqual([...s.matchAll(/<script\b[^>]*>/g)].map(m=>m[0]),['<script defer src="/site-chrome.js"></script>'.slice(0,-9)]);assert.match(s,/<header class="mc-bar">/);assert.match(s,/class="mc-home" href="https:\/\/www\.majoraimindset\.com"/);assert.doesNotMatch(s,/\b(?:preview|pilot)\b/i);for(const [,href]of s.matchAll(/href="(\/[^"]*)"/g)){const p=href.split('#')[0];await access(`dist${p==='/'?'/index.html':p.includes('.')?p:p+'.html'}`);}}});
test('checkout is explicitly unavailable and no payment functions are configured',async()=>{const checkout=JSON.parse(await readFile('dist/api/checkout.json'));assert.equal(checkout.available,false);assert.match(checkout.reason,/after release approval/);const config=JSON.parse(await readFile('vercel.json'));assert.equal(config.functions,undefined);assert.equal(config.env,undefined);});
test('Foundry and book maturity remain qualified',async()=>{assert.match(await readFile('dist/foundry.html','utf8'),/proposed|Proposed/);assert.match(await readFile('dist/library.html','utf8'),/Foundation stage/);assert.match(await readFile('dist/library.html','utf8'),/Books in production/);});

test('journey has 30 distinct days, all pillars, private defaults and source review flags',async()=>{const lessons=JSON.parse(await readFile('data/major-moves.json'));assert.deepEqual(lessons.map(l=>l.day),Array.from({length:30},(_,i)=>i+1));assert.deepEqual([...new Set(lessons.flatMap(l=>l.pillars))].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);for(const l of lessons){for(const key of ['learn','explore','major_move','artifact','reflection','completion','age_adaptation'])assert.ok(l[key]);assert.match(l.source_status,/OPEN/);}const page=await readFile('dist/major-moves.html','utf8');for(const l of lessons.slice(0,3))assert.ok(page.includes(`id="day-${l.day}"`));for(const l of lessons.slice(3)){assert.ok(!page.includes(`id="day-${l.day}"`));assert.ok(!page.includes(l.major_move));}assert.match(page,/need no account and save nothing/);});

test('funnel exposes only samples, uses native disclosures and keeps paid lesson files out of dist',async()=>{const page=await readFile('dist/major-moves.html','utf8');assert.equal((page.match(/class="week-panel /g)||[]).length,4);assert.equal((page.match(/class="sample-day"/g)||[]).length,3);assert.match(page,/Reservations are open now and free[\s\S]*Payment invitations may open no earlier than 11 November and require release approval/);await assert.rejects(access('dist/data/major-moves.json'));const css=await readFile('dist/style.css','utf8');assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/animation-timeline:view/);});
test('member pages are explicit design/locked shells with no embedded private lesson data',async()=>{const preview=await readFile('dist/member-preview.html','utf8');assert.match(preview,/not an account/);assert.match(preview,/1 month/);assert.match(preview,/12 months/);const room=await readFile('dist/member-room.html','utf8');assert.match(room,/Checking member access/);assert.doesNotMatch(room,/Describe one thing you want to learn/);const script=await readFile('dist/member-client.js','utf8');assert.doesNotMatch(script,/localStorage|sessionStorage|innerHTML/);});

test('reservation page collects only name and email, reserves free and takes no payment',async()=>{const page=await readFile('dist/reserve.html','utf8');assert.equal((page.match(/<form\b/g)||[]).length,1);assert.deepEqual([...page.matchAll(/<input[^>]*name="([^"]+)"/g)].map(m=>m[1]).sort(),['email','first_name','website']);assert.match(page,/Reserving is free/);assert.match(page,/11 November/);assert.match(page,/18 November/);assert.doesNotMatch(page,/buy\.stripe|checkout\.stripe|card number/i);const js=await readFile('dist/reserve.js','utf8');assert.match(js,/https:\/\/www\.majoraimindset\.com\/api\/subscribe/);assert.match(js,/cohort: true/);const csp=JSON.parse(await readFile('vercel.json')).headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;assert.match(csp,/connect-src 'self' https:\/\/www\.majoraimindset\.com/);const robots=await readFile('dist/robots.txt','utf8');assert.match(robots,/Allow: \//);});

test('schedule follows the 25 Oct founder decision: payment opens 11 Nov, cohort starts 18 Nov',async()=>{const c=JSON.parse(await readFile('data/founding-cohort.json'));assert.equal(c.payment_opens,'2026-11-11');assert.equal(c.cohort_starts,'2026-11-18');assert.equal(c.sessions[0],'2026-11-18T14:00:00Z');assert.equal(c.price_usd,249);assert.equal(c.capacity,20);const ics=await readFile('public/founding-cohort.ics','utf8');assert.ok(!ics.includes('DTSTART:20261111'));assert.match(ics,/DTSTART:20261118T140000Z/);for(const r of ['index','major-moves','library','spark-lab','foundry','reserve','sign-in']){const s=await readFile(`dist/${r}.html`,'utf8');assert.doesNotMatch(s,/(?:starts?|begins?|cohort starts on|from) 11 November/i);assert.doesNotMatch(s,/data-start="2026-11-11/);}});

test('public copy keeps payment, enrollment and replay delivery conditional on readiness',async()=>{
  const pages=await Promise.all(['index','major-moves','library','spark-lab','foundry','reserve','sign-in'].map(r=>readFile(`dist/${r}.html`,'utf8')));
  const publicCopy=pages.join('\n');
  assert.doesNotMatch(publicCopy,/payment link (?:arrives|goes out)|we(?:'|’)ll email you the payment link/i);
  assert.doesNotMatch(publicCopy,/replays are posted/i);
  assert.match(await readFile('dist/index.html','utf8'),/11 November is the earliest payment-invitation date[\s\S]*require release approval/);
  assert.match(await readFile('dist/reserve.html','utf8'),/does not guarantee a paid place[\s\S]*require release approval/);
  assert.match(await readFile('dist/sign-in.html','utf8'),/not yet an operational member service/);
});

test('authoritative Airtable mapping cannot be mistaken for Academy Contacts',async()=>{
  const authority=JSON.parse(await readFile('data/integration-authority.json','utf8'));
  const table=authority.airtable.tables.find(item=>item.id==='tbl1pPhCa6bx3ST3E');
  assert.equal(table.canonical_name,'MAIM Follow-up Queue');
  assert.equal(table.academy_runtime_enabled,false);
  assert.ok(table.not_names.includes('Contacts'));
  assert.match(table.purpose,/Existing assessment follow-up queue/);
  assert.match(table.purpose,/not Academy contacts, reservations, enrolments or paid orders/);
});
