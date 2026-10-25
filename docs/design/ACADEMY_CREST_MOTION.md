# Academy crest and page motion — 26 October 2026

Major supplied the Academy learning crest and requested it replace the Academy
logo and become a page motion graphic. The original PNG is copied unchanged to
`public/assets/academy-learning-crest.png` (1254 × 1254).

SHA-256: `3ac05d8ebe13db3df46d15025e51a7150b31c844b97842bd158798abf5f7887f`.

This direct request supersedes the older Academy badge selection for the header,
page icon and Major Moves scene only. Previous assets and the earlier cohort
video remain available; the main MAIM website and its identity are unchanged.

The homepage uses an eight-section assembly entrance (approximately 2.4 seconds),
then four slow floating/light-sweep cycles before settling. Desktop cursor movement
adds bounded perspective tilt; touch scrolling is never intercepted. Major directly
approved the dynamic reflective treatment on 26 October. The original PNG remains
unchanged; decorative clipped copies form the entrance, then the complete source
image takes over. This is a dimensional image treatment, not a modeled 3D asset.
The quiet green → gold → blue tri-bar uses the existing approved tokens. No generated or
redrawn artwork, external media service, additional dependency, or video export.
Pause/resume and replay are keyboard-accessible. Reduced-motion users receive
the complete still composition without autoplay or animation controls; preference
changes cancel animation. Hidden tabs and offscreen graphics pause. Without
JavaScript the artwork and all cohort information remain visible.

The cohort remains 18 November 2026, US$249 once, maximum 20 members; payments
remain scheduled for 11 November subject to release approval. This visual change
does not approve legal terms, enable checkout, or establish operational membership.

Review through an isolated Preview deployment only. Rollback: revert this scoped
change to restore the previous logo and homepage teaser; no provider or data
migration is involved.

## Assembly follow-up verification

- Updated main baseline: `fb15885` (includes PRs #20 and #22).
- Build, HTML validation and all 32 current tests pass; shared JS syntax and
  `git diff --check` pass.
- Playwright sampled entrance/assembled states at 320, 390 and 1440 px widths:
  no horizontal overflow after containing the assembly within its stage.
- Automated axe scan reports no violations on the desktop homepage.
- Cursor movement produces bounded perspective rotation; pause resets tilt.
- Reduced-motion changes cancel every graphic animation and restore the intact
  crest. No-JavaScript rendering retains the image and hides inactive controls.
- This is a Preview candidate for visual approval, not a production release.
  No payment flags, reservation handlers, schedules or provider settings changed.
