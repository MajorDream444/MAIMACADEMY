# MAIM Academy — visual system

**Decided by Major, 25 October 2026.** Same palette as the rest of MAIM, used
differently. Read this before drawing any Academy thumbnail, card, backdrop or
graphic.

## The rule

**No invented colours.** Every colour comes from
`major-ai-os/data/design-tokens.json` v2.1, by name and exact hex. Academy uses
a subset. No replacement shades, no "emerald", no glows or gradients that
create in-between tones. If a value you need is not in the file, flag it —
do not approximate.

**The tri-bar stays.** Green → gold → blue under the headline. It is the
subtle thread that tells a viewer the Academy and the Mindset are one
ecosystem.

**Academy differs by emphasis, not by new colours.**

## Academy palette (subset of the tokens)

| Role | Token | Hex |
|---|---|---|
| Ground | maimBlack | `#050505` |
| Headline, key words, bubble fill | clarityWhite | `#F7F4EA` |
| Authority: kicker, marks, edges | crownGold | `#D8AF55` |
| Deeper gold edge | legacyGold | `#9F742C` |
| **Academy accent** — the one accent | jamaicanLegacyGreen | `#1F7A3A` |
| Tri-bar third stripe only | championBlue | `#006BB6` |
| Panels, patches | darkSurface | `#18181B` |
| Panel borders | borderDark | `#27272A` |
| Secondary text, guides | smokeGray | `#A8A8A8` |
| Ink on light surfaces | textDark | `#111827` |

**Gold stays central** — crownGold and legacyGold carry authority on every
Academy piece. Not used: sovereignGold (the alternate gold, so two golds never
compete), championOrange (Mindset's action/ABC energy), systemLime, pureWhite —
unless Major says otherwise.

## How the Academy reads differently from the Mindset

| | Major AI Mindset | MAIM Academy |
|---|---|---|
| Accent | rotates (orange → green → blue) | **jamaicanLegacyGreen, always** |
| Motif | crown seal, ABC letters | **the problem made physical** — the ceiling beam, the line that hits a limit |
| Mark | crown seal | MD mark + MAIM ACADEMY wordmark in the display face, **straight on the canvas** |
| Frame | morning robe | desk, notebook, something built |

## Craft rules (Major, 25 Oct)

- **Marks sit on a clear background.** Never put the logo or wordmark in a
  black or grey box on top of a black canvas — the box is visible and cheap.
- **Design like Apple.** Load the `impeccable` and `taste-skill` skills
  (`MajorDream444/impeccable`, `MajorDream444/taste-skill`) before design work.
  From them: no lazy containers, no monospace as costume, depth from an offset
  soft shadow rather than a zero-offset coloured halo, cut-outs from a real
  alpha matte rather than geometric masks.
- Shadows use maimBlack at partial opacity — the only opacity in use.
- Major's repositories number in the hundreds. Search them
  (`list_repos` with a query) before concluding a skill or asset does not exist.

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

- MAIM Black: DESIGN.md says `#030304`; tokens.json, Remotion and MAIM 04 use
  `#050505`. Academy uses `#050505` until Major decides.
- DESIGN.md-only values: Deep Obsidian `#0A0A0A`, Muted Text `#B8B8B8`.
- Volume I's tokens are marked PROVISIONAL (`#0A0A0B`, `#F4EDE1`, `#C9A227`,
  `#009B4D`, `#2E6BE6`) and do not match tokens.json. Use tokens.json.
- MAIM 04 renders also use `#3FA45C`, `#E0162B` (LIVE flag) and `#3a9be0`,
  which are not in tokens.json. Not used by the Academy.
- Shadows and opacity: the tokens define none. A compression shadow would need
  maimBlack at partial opacity — not used until approved.
