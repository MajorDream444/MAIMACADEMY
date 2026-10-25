// UX QA: serves dist with the production headers from vercel.json and checks
// every public route at desktop and phone width. Usage: node scripts/qa-ux.mjs
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axe = await readFile('node_modules/axe-core/axe.min.js', 'utf8');
const headers = JSON.parse(await readFile('vercel.json', 'utf8')).headers[0].headers;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json', '.txt': 'text/plain', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index';
  let f = join('dist', p);
  try { await stat(f + '.html'); f += '.html'; } catch { try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch { res.writeHead(404); return res.end('404'); } }
  for (const h of headers) res.setHeader(h.key, h.value);
  res.setHeader('Content-Type', types[extname(f)] || 'application/octet-stream');
  res.end(await readFile(f));
}).listen(4173);
const base = 'http://localhost:4173';
const routes = ['/', '/major-moves', '/library', '/spark-lab', '/foundry', '/reserve', '/sign-in', '/member-preview', '/walkthrough'];
const views = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true } };
const browser = await chromium.launch();
const results = [];
for (const [vname, vp] of Object.entries(views)) {
  for (const motion of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: motion });
    for (const route of routes) {
      if (motion === 'reduce' && route !== '/') continue;
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push('pageerror: ' + e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
      await page.goto(base + route, { waitUntil: 'load' });
      await page.waitForTimeout(2600);
      const r = await page.evaluate(() => {
        const out = { overflowX: document.documentElement.scrollWidth - window.innerWidth };
        const navLinks = [...document.querySelectorAll('.mc-bar a, .mc-bar button')].filter(e => e.offsetParent);
        out.navMinFont = Math.min(...navLinks.map(e => parseFloat(getComputedStyle(e).fontSize)));
        const targets = [...document.querySelectorAll('.mc-bar a, .mc-bar button, .mc-foot a, .mc-cohort a, .mc-cohort button, main .button')].filter(e => e.offsetParent);
        out.smallTargets = targets.map(e => [e.textContent.trim().slice(0, 30), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)]).filter(([, w, h]) => w < 44 || h < 44);
        const card = document.getElementById('mc-cohort');
        out.cohortCard = card ? (card.classList.contains('mc-in') ? 'shown' : 'waiting') : 'absent';
        const v = document.querySelector('.mc-teaser video');
        out.teaser = v ? (v.paused ? 'paused' : 'playing') : 'none';
        out.homeLoop = !!document.querySelector('.mc-foot a.mc-home[href="https://www.majoraimindset.com"]');
        out.primaryCta = [...document.querySelectorAll('a[href="/reserve"]')].length;
        out.previewWords = (document.body.innerText.match(/\b(preview|pilot)\b/gi) || []).length;
        return out;
      });
      const axeCtx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, bypassCSP: true, reducedMotion: motion });
      const axePage = await axeCtx.newPage(); await axePage.goto(base + route); await axePage.waitForTimeout(2600);
      await axePage.addScriptTag({ content: axe });
      const ax = await axePage.evaluate(async () => window.axe ? (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map(v => `${v.id} (${v.impact}) ×${v.nodes.length}`) : ['axe not loaded']).catch(e => ['axe error ' + e.message]);
      await axeCtx.close();
      const name = `${vname}${motion === 'reduce' ? '-reduced-motion' : ''}-${route === '/' ? 'home' : route.slice(1)}`;
      await page.screenshot({ path: `docs/qa/screenshots-2026-10-25/${name}.png`, fullPage: false });
      if (vname === 'mobile' && motion !== 'reduce' && route === '/') {
        await page.click('.mc-menu'); await page.waitForTimeout(300);
        r.menuExpanded = await page.getAttribute('.mc-menu', 'aria-expanded');
        await page.screenshot({ path: `docs/qa/screenshots-2026-10-25/mobile-home-menu-open.png` });
        await page.click('.mc-menu');
      }
      if (r.cohortCard === 'shown') {
        r.cardBox = await page.evaluate(() => { const b = document.getElementById('mc-cohort').getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; });
        try { await page.click('#mc-cohort .mc-x', { timeout: 3000 }); } catch (e) { errors.push('dismiss button not clickable: ' + e.message.split('\n')[0]); }
        await page.waitForTimeout(600);
        r.dismissed = await page.evaluate(() => document.getElementById('mc-cohort').hidden && localStorage.getItem('maim-cohort-dismissed') !== null);
        await page.evaluate(() => localStorage.clear());
      }
      results.push({ view: vname, motion, route, ...r, axe: ax, errors });
      await page.close();
    }
    await ctx.close();
  }
}
// Home on desktop: does the card wait for the teaser to scroll away?
{
  const ctx = await browser.newContext({ viewport: views.desktop });
  const page = await ctx.newPage(); await page.goto(base + '/'); await page.waitForTimeout(2600);
  const before = await page.evaluate(() => !document.getElementById('mc-cohort').classList.contains('mc-in'));
  await page.mouse.wheel(0, 1400); await page.waitForTimeout(2800);
  const after = await page.evaluate(() => !document.getElementById('mc-cohort').classList.contains('mc-in'));
  await page.screenshot({ path: 'docs/qa/screenshots-2026-10-25/desktop-home-scrolled-card.png' });
  results.push({ check: 'home card waits for teaser', hiddenWhileTeaserVisible: before, hiddenAfterScroll: after });
  await ctx.close();
}
await browser.close(); server.close();
await writeFile('docs/qa/academy-ux-qa-2026-10-25.json', JSON.stringify(results, null, 2));
for (const r of results) console.log(JSON.stringify(r));
