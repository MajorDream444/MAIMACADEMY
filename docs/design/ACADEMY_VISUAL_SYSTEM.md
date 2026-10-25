# MAIM Academy — visual system

**Decided by Major, 25 October 2026.** Same palette as the rest of MAIM, used
differently. Read this before drawing any Academy thumbnail, card, backdrop or
graphic.

## The rule

**No invented colours.** Every colour comes from
`major-ai-os/data/design-tokens.json` v2.1, by name and exact hex. Academy uses
a subset. No replacement shades, no "emerald", no glows or gradients that
create in-between tones — except the approved thumbnail material finish
below. If a value you need is not in the file, flag it — do not approximate.

**The tri-bar is the one common thread.** Green → gold → blue
(jamaicanLegacyGreen `#1F7A3A` → crownGold `#D8AF55` → championBlue
`#006BB6`). Major, 25 Oct: it connects *everything* he builds — MAIM Academy,
Major AI Mindset, the agripreneur work and whatever comes next.

- **Loud vs quiet.** The crown, the hat and the MD mark are in-your-face.
  The tri-bar is the subtle one: a viewer who connects the dots recognises
  where the piece belongs. Never make it the hero; never leave it out.
- **The order and the three hues never change.** The rendering can: flat,
  metallic, retro, anime, whatever the piece's style is. It always reads
  as these three tokens in this order.
- **Open:** a metallic or retro treatment means sheen, grain or gradient on
  the token hues. That is a treatment rule the tokens don't define yet —
  flag it and get Major's approval per treatment before shipping one.
- This is an ecosystem rule, not an Academy one. It belongs in
  `major-ai-os/DESIGN.md`; recorded here until it lands there.

**Academy differs by emphasis, not by new colours.**

## Academy palette (subset of the tokens)

| Role | Token | Hex |
|---|---|---|
| Ground | maimBlack | `#050505` |
| Headline, key words, bubble fill | clarityWhite | `#F7F4EA` |
| Authority: kicker, marks, edges | crownGold | `#D8AF55` |
| Deeper gold edge | legacyGold | `#9F742C` |
| Sovereign moments — ownership, the step up | sovereignGold | `#D4AF37` |
| **Academy accent** — the one accent | jamaicanLegacyGreen | `#1F7A3A` |
| Tri-bar third stripe only | championBlue | `#006BB6` |
| Panels, patches | darkSurface | `#18181B` |
| Panel borders | borderDark | `#27272A` |
| Secondary text, guides | smokeGray | `#A8A8A8` |
| Ink on light surfaces | textDark | `#111827` |

**All three golds stay available** (Major, 25 Oct). crownGold is the default
authority gold. legacyGold is the deeper edge. sovereignGold is kept on
purpose: sovereignty — owning what you build — runs through the whole
ecosystem, so its gold is not to be discarded. Use one gold as the lead on a
piece and let the others support; which moments sovereignGold leads is
Major's to name as they come up.

Not used by default: championOrange (Mindset's action/ABC energy),
systemLime, pureWhite — unless Major says otherwise.

## How the Academy reads differently from the Mindset

| | Major AI Mindset | MAIM Academy |
|---|---|---|
| Accent | rotates (orange → green → blue) | **jamaicanLegacyGreen, always** |
| Motif | crown seal, ABC letters | **the problem made physical** — the ceiling beam, the line that hits a limit |
| Mark | crown seal | **the Academy badge** (`assets/brand/MD-Academy-Badge-Transparent.png`), straight on the canvas. Small sizes can still use the MD mark + MAIM ACADEMY wordmark |
| Frame | morning robe | desk, notebook, something built |

## The Academy badge (Major, 25 Oct)

Major chose this as the Academy's mark: the MD mark over the woven palm crown,
an open book, ACADEMY. Supplied file `assets/brand/MD-Academy-Badge-supplied.webp`.
Use `MD-Academy-Badge-Transparent.png` for placement, and
`build/avatars/youtube-avatar-academy-800.png` for the channel avatar.

- Use it as supplied. Never redraw, recolour, retouch or regenerate it. The crown
  rule applies: no distortion, nothing gimmicky.
- Its green ring (about `#015D1B`) is an artwork treatment, approved as is.
  **`#1F7A3A` stays the canonical Jamaica Green** for every new design element
  (Major, 25 Oct).
- **Where it is used:** the Academy backdrops (name lockup, 104 px) and the
  episode thumbnails (top left, beside the MAIM ACADEMY wordmark). Major AI
  Mindset keeps its own emblem.
- It is detailed. Below about 64 px it turns to mush; there, use the MD mark
  with the wordmark.

## Craft rules (Major, 25 Oct)

- **Marks sit on a clear background.** Never put the logo or wordmark in a
  black or grey box on top of a black canvas — the box is visible and cheap.
- **Design like Apple.** Load the `impeccable` and `taste-skill` skills
  (`MajorDream444/impeccable`, `MajorDream444/taste-skill`) before design work.
  From them: no lazy containers, no monospace as costume, depth from an offset
  soft shadow rather than a zero-offset coloured halo, cut-outs from a real
  alpha matte rather than geometric masks.
- Shadows use maimBlack at partial opacity. Other opacity only inside the
  approved thumbnail material finish.
- Major's repositories number in the hundreds. Search them
  (`list_repos` with a query) before concluding a skill or asset does not exist.

## Thumbnail material finish (locked, Major, 25 Oct)

The first approved lighting treatment. Reference build:
`scripts/build_thumbnail_ceiling.py` →
`build/thumbnails/maim_yt_ceiling_1280x720_v10.png`. Light and gradients are
allowed here, but every material starts from a token. No new base colours.

| Element | Finish | Tokens |
|---|---|---|
| Gold beam | brushed grain, Clarity White top lip, specular band, darker bevel end, small glints on the lower edge, soft reflection below | crownGold, legacyGold, clarityWhite, maimBlack |
| Headline (YOUR, CEILING) | shallow bevel lit from the top left, fine grain, gold rim, offset soft shadow; CEILING gets a short contact shadow under the beam | clarityWhite face, crownGold highlights, legacyGold shade |
| Green panel | directional light from the top left, darker edges, thin reflective gold border | jamaicanLegacyGreen, crownGold, legacyGold, clarityWhite |
| Rising line | stays jamaicanLegacyGreen, never neon. Bloom concentrated at the ceiling contact, with a Clarity White node | jamaicanLegacyGreen, clarityWhite |
| Grid | faint, right half only, fades out | borderDark |
| Portrait | **original pixels only.** Separation from a soft backlight, thin gold rim and offset shadow behind the cutout. Never regenerated, sharpened or smoothed | legacyGold backlight, crownGold rim |
| MD mark | the original file, untouched | — |
| Tri-bar | **flat and exact.** No finish | green → gold → blue |

Checks before shipping: the portrait's pixels match the cutout (the build
script prints this), the tri-bar samples at the exact hexes, and the line
reads Jamaica Green at 320×180.

## Thumbnails: shared brand, individual story (Major, 25 Oct)

The badge, token colours and type give the series its continuity. Each
episode earns its own scene and visual idea. **Start with the story's defining
moment, then build the image**, not the other way round. Ceiling's
beam-and-line diagram belongs to Ceiling. Bottleneck is the dinner table:
"18 GUESTS. NO WINE.", Major's own finished design
(`assets/thumbnails/bottleneck-thumbnail-supplied.webp`).

- **Thumbnails are clean and crisp.** Use the best, sharpest photo of Major.
  A soft video frame is not good enough for a thumbnail.
- **A design Major supplies is used as he made it.** Its photo is Major
  himself. Don't relabel it, re-cut it or rebuild it. Finishing is limited to
  the exact badge file and the tri-bar.
- No heavy black blocks behind the headline. Let the scene carry it.
- The tri-bar stays flat and exact. When the design has no room for it under
  the headline, it sits after the wordmark.

## Sources of truth

- `major-ai-os/data/design-tokens.json` v2.1 — the colours
- `major-ai-os/docs/maim-04-youtube-thumbnail-system.md` — thumbnail rules
  (2-second test, ≤5 headline words, tri-bar, one accent, naming
  `maim_yt_[topic]_1280x720_v#`). Its "mark on a solid patch" rule is
  overridden for the Academy: marks sit on a clear background.
- *Volume I · Media Design System* (Claude Design) — the eight video components
  (Hero Title, Lower Third, ABC Progression, Quote Card, Knowledge Diagram,
  Network Viz, Closing Signature, CTA Card). On-screen graphics are built from
  these, not invented per video.
- Type: Archivo / Archivo Black for display, JetBrains Mono for labels, Inter
  for body (DESIGN.md v2.3).

## Open conflicts — flagged, not resolved

- ~~MAIM Black conflict~~ **Settled 25 Oct: `#050505`.** `#030304` came in with
  the Google AI Studio landing-page experiment (5 Jul) and is retired.
- DESIGN.md-only values: Deep Obsidian `#0A0A0A`, Muted Text `#B8B8B8`.
- Volume I's tokens are marked PROVISIONAL (`#0A0A0B`, `#F4EDE1`, `#C9A227`,
  `#009B4D`, `#2E6BE6`) and do not match tokens.json. Use tokens.json.
- MAIM 04 renders also use `#3FA45C`, `#E0162B` (LIVE flag) and `#3a9be0`,
  which are not in tokens.json. Not used by the Academy.
- ~~Shadows and opacity~~ **Approved 25 Oct** for thumbnails as part of the
  material finish above. tokens.json still defines none; it should, when the
  finish moves into major-ai-os.
