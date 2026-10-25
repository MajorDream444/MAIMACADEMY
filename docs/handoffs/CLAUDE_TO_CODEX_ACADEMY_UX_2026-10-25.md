# Claude Code → Codex: Academy public site UX and schedule revision (25 Oct 2026)

Claude Code owned the Academy's **public website and UX only**. Backend,
enrollment, commerce, member access and integrations stay with Codex. Nothing
here activates payments or touches subscriber data.

**Read first:** `docs/decisions/MAIM_ACADEMY_SCHEDULE_REVISION_2026-10-25.md`.
The schedule is now: **payment opens Wed 11 Nov** (subject to release approval),
**the cohort starts Wed 18 Nov**, with sessions 18 and 25 Nov and 2 and 9 Dec at
14:00 UTC. 4 Nov is gone. The price is still US$249 once, and the cap is still 20.

## What changed (MAIMACADEMY)

- **Shared chrome**, the same standard as majoraimindset.com:
  - Native `header`/`nav`/`footer` with the MD mark and "MAIM Academy" wordmark.
    Below 64px it uses the MD mark, not the badge.
  - The menu: 30 Major Moves, Library, Spark Lab, Foundry, Sign in, Major AI Mindset ↗,
    plus the "Reserve your spot" CTA and a phone menu.
  - The footer loops back to `← majoraimindset.com`.
  - The cohort card has a countdown to 2026-11-18T14:00Z. It is off on `/reserve`, `/sign-in`,
    `/member-room` and `/walkthrough`.
  - Files: `public/site-chrome.css` and `public/site-chrome.js` (copied from Major-AI-OS, plus
    Academy additions at the end), and `chrome()` and `wrapper()` in `scripts/build.mjs`.
- **Copy:**
  - Every "preview", "pilot", "V1" and "proposed journey" placeholder in the visible copy is
    replaced with founding-cohort sales copy: a new home page ("Stop being the bottleneck."),
    what's included, how reserving works and the pathways.
  - Foundry stays honestly "in design".
  - `/member-preview` and `/walkthrough` remain clearly non-accounts.
- **Home hero:** the Remotion teaser plays beside the copy, and is paused under reduced motion.
  The cohort card waits until the teaser has scrolled away.
- **Schedule everywhere:**
  - `data/founding-cohort.json` (`cohort_starts`, `sessions`, `schedule_decision`).
  - `public/founding-cohort.ics`: same UIDs, `SEQUENCE:1`, so existing subscribers' calendars
    update.
  - The reserve-page copy and the confirmation message in `public/reserve.js`.
  - The countdown, the meta description and `api/checkout.json`.
  - The backdrop CTA in `scripts/build_video_backdrop.py`.
  - The video-production skill and the CTA and shoot docs.
- **Tokens:** `--muted` and `--line` are now the tokens. Inputs have a Smoke Gray border.
- **Tests:** 28 tests pass.
  - The shared chrome is present, the only script on informational pages is `site-chrome.js`,
    and there is no preview or pilot wording.
  - The schedule test covers 11/18 Nov, US$249 and 20 seats.
- **QA:** `docs/qa/ACADEMY_UX_QA_2026-10-25.md`, with screenshots and JSON. Rerun it with
  `node scripts/qa-ux.mjs` after `npm run build`.
- **Migration inventory:** `docs/migration/BPT_STB_TO_AMA_SOLUTIONS_INVENTORY_2026-10-25.md`.
  Nothing was deleted or redirected.

## What changed (Major-AI-OS)

- `apps/maim-site/vercel.json`: **temporary redirects** `/academy`, `/academy/:path*`
  and `/reserve` → `academy.majoraimindset.com`. Tested in `tests/redirects.test.ts`.
- `maim/site-chrome.css`: 44px touch targets for header and footer links and the brand.
- The cohort card, the front-door countdown and the front-door facts now point to 18 Nov.
  "Payment opens 11 November" is kept.
- The teaser (`remotion/src/compositions/CohortTeaser.tsx`) now says "Starts November 18".
  The vertical cut stacks the date. It was re-rendered to `maim/assets/cohort-teaser.mp4`
  (1280×720, 185 KB), and the same file is in the Academy.
- The decision record is `docs/decisions/MAIM_ACADEMY_SCHEDULE_REVISION_2026-10-25.md`.
  The CTA facts and the Stripe link setup doc are updated.

## For Codex (not done here)

1. **Stripe Payment Link metadata and copy.**
   - Per `docs/commerce/ACADEMY_LINK_SETUP_2026-10-22.md`, `session_dates` is now
     `2026-11-18,2026-11-25,2026-12-02,2026-12-09`.
   - The description and the `after_completion` message list the new dates.
   - If the link was already created, update it in Stripe (test mode). Don't activate it.
2. **The 11 Nov payment-invitation send** to the reservation segment. Build it and test it;
   don't send. It needs Major's release approval.
3. **Onboarding emails and session calendar invites** must use the four new dates. The ICS file
   is the source.
4. **Engine:** check that anything reading `data/founding-cohort.json` copes with the new
   `cohort_starts` and `schedule_decision` keys, and that it doesn't assume the first session is
   the payment date.
5. **Main-site phone overflow:** the `majoraimindset.com` home overflows by **133px at 390px**.
   The legacy `.footer-links` row and the ABC `.abc-locked-label`/`.mc-more` cards are too wide.
   The other routes are fine.
6. **Main-site copy:** the front door's Pressure Test card still says "Preview". It is part of the
   BPT migration, so leave it until Major decides.

## Open for Major

- **Confirm the session calendar** of 18 and 25 Nov and 2 and 9 Dec. It is derived from the
  18 Nov start.
- **The Bottleneck master and older backdrops** have "· 11 November" in the CTA bar. That is still
  accurate as the payment date, and on camera it should be said as "payment opens 11 November, we
  start 18 November."
- **BPT/STB:** the open calls are listed in section 6 of the inventory.

## Boundaries kept

No payments activated, no invitations sent, no subscriber data written (the
reservation flow was not exercised in this pass), no BPT/STB asset deleted or
redirected, and no secrets committed.
