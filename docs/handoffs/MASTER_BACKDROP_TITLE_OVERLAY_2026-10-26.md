# Master backdrop and episode-title continuation — 26 October 2026

Owner direction: one reusable master, bright warm Crown/Legacy Gold filaments,
Jamaica Green outer lines, soft capped tips, exact green/gold/blue signature,
original approved Academy badge, current 18 November CTA, EMPTY episode panel.
Titles are added in post. Do not regenerate backgrounds for each title.

## Delivered
- MAIMACADEMY: `scripts/build_master_backdrop.py`; run `python scripts/build_master_backdrop.py`.
- Four PNGs in `build/backdrop/master/`: NORMAL and MIRRORED at 1920x1080 and 3840x2160.
- 4K is drawn natively, 1080p downsampled. No generated mark or font substitution.
- Manifest records dimensions, panel bounds and successful mirror/token checks.
- Major-AI-OS: `remotion/src/compositions/AcademyEpisodeTitle.tsx`, registered as
  `AcademyEpisodeTitle` and `AcademyEpisodeTitle4K` in Root.
- Props: title, context, showBackdrop, mirroredSource. Change text only for next episode.
- `showBackdrop: false` produces a transparent overlay. For alpha export use ProRes
  4444 (`--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le`).
- Default preview uses Expertise title. The 4K composition scales panel positions.
- The backdrop copy in Remotion public is preview-only 1080p; use the native 4K
  Academy master for final 4K recording/compositing.

## Orientation
MIRRORED is a whole-frame flip. Choose it only when the recording pipeline flips
it back. Normalize saved footage to readable orientation before adding title text.
The overlay text is always readable; mirroredSource only flips its preview background.

## Validation and remaining limit
- All four images generated; 1080p visually inspected.
- Exact tri-bar RGB samples and mirror roundtrip assertions pass.
- All five season title strings fit the panel in font-metric checks.
- Remotion `npx tsc --noEmit` passes.
- FontFace load explicitly delays render and fails visibly instead of silently using fallback.
- Studio start also fails here in Node os.networkInterfaces with uv_interface_addresses error 1.
- Updated TypeScript moduleResolution from Node to Bundler: latest TS removed node10.
- Attempted verbose Remotion still render. Chromium download from remotion.media
  timed out establishing proxy tunnel. No browser render or animation playback is
  claimed. The previous Claude verbose log/new uncommitted files were not present
  in either cloned repo, so its reported font failure is not diagnosed here.

## Resume verification
From Major-AI-OS/remotion: `npm ci`, `npx remotion studio src/index.ts --no-open`.
Then `npx remotion still src/index.ts AcademyEpisodeTitle out/title-review.png --frame=30`.
If Chromium is already installed pass `--browser-executable=/absolute/path/to/chrome`.
Inspect frames 0, 6, 12 and 30, font load, title wrapping and transparent export.
New renders are review candidates; do not silently replace previously approved assets.
No merge, production deployment, payment, email or YouTube changes made.

Both repos use branch `codex/master-backdrop-title-overlay` for this continuation.
