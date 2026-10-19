# V1 preview release checklist

Date: 19 October 2026. Scope: informational Academy, four routes. Production HOLD.

## Tested

- `npm run check`: static build, HTML validation, JavaScript syntax and 3/3 safety/link/status tests pass.
- `npm audit --audit-level=high`: zero reported vulnerabilities at install time.
- Chromium: /, /library, /spark-lab, /foundry rendered at 320, 390, 768, 1440px; document widths match viewport (no horizontal overflow in all 16 samples).
- axe-core 4.10.3: WCAG 2 A/AA + 2.1 AA tags, all four pages: zero violations, 15 applicable rule groups passing per page. Automated scan performed per page, not separately at all four sizes. Not full accessibility certification.
- Keyboard Tab first reaches visible Skip to content; semantic headings/landmarks and visible focus styles checked. Desktop/mobile screenshots inspected locally.
- All 12 unique external HTTPS destinations return 200 (MAIM home/campus/privacy/library, free guide, Ten Pillars, Lucky sources, Spark Lab/STB and Foundry sources). Links to GitHub documents are labeled as plans/scope. Mail delivery not tested.
- Local /api/checkout returns HTTP 200 with available=false; no payment runtime, provider configuration, forms, auth or learner-data collection. Existing MAIM production /api/checkout also returns available=false, without mutation.
- Source reviewed against Academy issue #1 and Foundry draft PR #2. No operational memberships, live books, deployed tutors, verified work evidence or accepted enterprise capability claimed.

## Preview verification

Deploy only the isolated branch to hamal-agi/maimacademy; record exact commit, deployment URL/ID, target and provider READY state in issue #1 / PR. No production promotion or custom domain. Local browser checks do not substitute for deployed access testing; Vercel authentication, if enabled, may require an owner to view the preview.

## OPEN blockers before production integration

1. Human visual/content/accessibility review of the preview, including real devices and screen-reader testing.
2. Stable Academy destination/domain decision and reviewed additive entry/navigation change in Major-AI-OS. Existing MAIM navigation remains unchanged in this implementation.
3. Exact preview route/security-header/checkout-unavailable smoke evidence; no credentials or tokens in receipts.
4. Lucky manuscripts/age pathways, book production/rights and Reading Room content remain owned by their original repositories; no claim of a completed paid library.
5. Auth/tenant and child safety, consent/export/deletion, AI grounding and moderation require separate contracts before future feature work. No infrastructure selection or spend inferred.
6. Foundry PR #2 review and evidence upgrades remain separate. STB service commercial validation is independently OPEN.

## Rollback

No existing MAIM deployment, domain or commerce setting was changed. Do not promote the preview; close the implementation PR to withdraw it. Main initially contains only baseline documentation. Later production changes require a reviewed commit/deployment rollback reference and explicit authority. Never delete content authorities or revert another agent's work.

## Commands

`npm ci --ignore-scripts && npm run check && npm audit --audit-level=high`

`npm run dev` serves the built site at 127.0.0.1:4173 for browser QA. Vercel builds from package.json/vercel.json; no .env values needed. Generated output, browser artifacts, local provider linkage and .env files are ignored.

## Work continuation: 30-Day Major Moves

The work/academy-curriculum-2026-10-19 continuation adds a fifth route, /major-moves. Fresh checks this session: build PASS, HTML validation and build-script syntax PASS, 4/4 Node tests PASS, whitespace check PASS. Route/link/collection and checkout-unavailable tests include the new page. Prior four-page browser/axe results above are historical Codex results and do not cover the new route. Browser/mobile/screen-reader and deployed-route verification for this continuation remain OPEN until recorded. No new dependency versions, account/data flows, payment integration or production changes.
