# Academy UX QA: 25 October 2026

Checked by Claude Code against the local production build (`npm run build`),
served with the **same security headers as `vercel.json`** (CSP enforced).
Script: `scripts/qa-ux.mjs`, which anyone can rerun. Raw results:
`docs/qa/academy-ux-qa-2026-10-25.json`. Screenshots:
`docs/qa/screenshots-2026-10-25/`.

**Viewports:** desktop 1440×900, phone 390×844 (touch). The home page was also
run with `prefers-reduced-motion: reduce` at both sizes.
**Routes:** `/`, `/major-moves`, `/library`, `/spark-lab`, `/foundry`,
`/reserve`, `/sign-in`, `/member-preview`, `/walkthrough`.

## Final result

| Check | Result |
|---|---|
| Horizontal overflow | 0px on every route, both sizes |
| Header and footer links | 16px text, every target ≥44×44px |
| axe WCAG 2 A/AA at rest | 0 violations on every route, both sizes |
| Console errors, page errors, failed requests, CSP violations | none |
| Home link on every page | footer `← majoraimindset.com` present |
| Mobile menu | opens, `aria-expanded="true"`, closes |
| Cohort card | shown on content pages; absent on `/reserve`, `/sign-in`, `/member-room`, `/walkthrough`; dismiss works and is remembered |
| Home: one CTA at a time | card waits while the teaser is on screen and slides in after it scrolls away |
| Teaser, normal motion | plays (muted, looped, started from script; no `autoplay` attribute) |
| Teaser, reduced motion | paused on the poster |
| Countdown | counts to 2026-11-18T14:00Z (cohort start) |
| Preview or pilot language in visible copy | 0 occurrences on the indexable routes (enforced by test) |
| `npm run check` | build, html-validate and 28/28 tests passing |

## Failures found and fixed in this pass

These were real failures on the first run, not hypothetical ones.

1. **Header links were 39px tall on desktop**, and footer links 43px tall, both under the 44px
   minimum. This came from the shared chrome. Fixed in `site-chrome.css` on **both** sites, and
   the brand link now has a 44px minimum height too.
2. **The home teaser caused 40px of horizontal scroll on desktop.** The main site's
   absolute-positioned teaser didn't fit the Academy layout. The home hero is now a two-column
   grid on wide screens and stacks on phones.
3. **The desktop "Reserve your spot" button wrapped under the nav bar.** There were seven links
   plus the CTA. The nav is now five links, an external "Major AI Mindset ↗" link and the CTA.
   The home link is the brand mark, with "Academy home" in the footer.
4. **The hero facts ran together:** "Starts 18 November20 spotsUS$249". They now have separators.
5. **html-validate rejected the div-based landmarks.** The chrome now uses native
   `header`/`nav`/`footer` elements, the old global `header`/`footer` rules were removed from
   `style.css`, and the member sidebar `aside` has a label.
6. **html-validate rejected `autoplay`.** The teaser is now started by `site-chrome.js` only
   when reduced motion is off.
7. **Off-token colours.** `style.css` used `#b8b8b8` and `#424248`, which are not in
   `design-tokens.json`. They are now Smoke Gray `#A8A8A8` and Border Dark `#27272A`. Form inputs
   have a Smoke Gray border, because Border Dark on Dark Surface is below the 3:1 contrast that
   input boundaries need.

## Known and accepted

- **`/major-moves`: axe can report `color-contrast` on one text block while it is mid-fade.**
  The week panels use a scroll-driven reveal (`animation-timeline: view()`). Text below the fold
  is partly transparent until it scrolls in. Once scrolled into view, the same nodes pass, which
  was verified by scrolling and re-running axe. This is a transient state, not a resting failure.
  It is already disabled under reduced motion.
- At 390px the hero facts wrap after "20 spots", so the last separator starts a new line.
  This is cosmetic.

## Found on the main site (not fixed here: Academy scope only)

- **The `majoraimindset.com` home overflows by 133px at 390px.** The page's own legacy
  `.footer-links` row and the ABC `.abc-locked-label`/`.mc-more` cards are wider than the screen.
  The other main-site routes checked (`/pillars`, `/library`, `/shop`) are 0px. Handed to Codex
  in `docs/handoffs/CLAUDE_TO_CODEX_ACADEMY_UX_2026-10-25.md`.
