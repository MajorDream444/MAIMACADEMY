# Starting work on the MAIM Academy YouTube channel

**Read this before proposing anything.** The channel plan already exists and is
approved. Writing another one creates a competing document.

## What is already decided

| File | What |
|---|---|
| `docs/marketing/YOUTUBE_SEASON_ONE_PLAN.md` | five videos from Volume 1, with clips, assignments and CTA discipline |
| `docs/marketing/YOUTUBE_CHANNEL_COPY.md` | channel description, banner and avatar, with upload locations |
| `docs/marketing/COHORT_PRELAUNCH_SEQUENCE.md` | six-email pre-launch sequence, drafted and unsent |
| `docs/handoffs/CLAUDE_TO_CODEX_ACADEMY_BOUNDARY_2026-10-24.md` | why the Academy and the Mindset are separate brands |

## Skills — load these, do not re-derive them

`.claude/skills/` and `.agents/skills/` carry:

- **`maim-channel-operations`** — the two-agent lane split, which accounts belong
  to whom, what each connector can actually do, the vidIQ credit budget, and the
  YouTube-unlisted media staging pipeline.
- **`maim-brand-production`** — canonical colour tokens, the Inter font pipeline,
  the transparent marks, the builders, and the verification discipline.
- **`maim-integrity-publishing-design`** — the identity lock on the MD mark and
  the author photograph.

## The channel

`@MAIM_ACADEMY` · `UCAxy4YB0VlQgrmQiKowu04g` · **zero videos.**

Embeds and a videos page are premature until something is published.

## Assets ready to use

```
build/banner/maim-academy-banner-2560x1440.png   channel banner
build/avatars/youtube-avatar-800.png             channel avatar
assets/brand/                                     marks, portrait, hashes
assets/fonts/                                     Inter TrueType, embeddable
scripts/build_youtube_banner.py                   regenerate the banner
scripts/build_catalog_images.py                   thumbnails and social exports
```

## Standing constraints

- Production commerce is **disabled**. Founding cohort enrollment is **closed**.
  Nothing may imply a seat can be bought.
- Never synthesize a replacement author likeness; never redraw the MD mark.
- Several videos in Google Drive are Gemini-generated and carry a synthesised
  likeness. Do not use them. The real footage is `the mindset of major pt1.mp4`
  and `Brother Ling Conversation.mp4`.
- vidIQ runs on 150 credits a month. Clipping costs 9 per minute of source.
  Check `vidiq_balance` before spending.
