# Expertise — release package (episode 02, third release)

**Status: review candidate.** Not uploaded, not published. Major uploads and
sets visibility; nothing goes public without his say.

## Master

- **Source:** Major's export `Episode 02 — "What lives in your head is not expertise".mp4`
  (Hanzo Drive, MAIM ACADEMY VIDEOS, `1r3XQkvl2dxeDdOdGX48EYUTVILf26_Hr`), 19:28.75, 1080p30.
  Shot on the master backdrop with the empty THIS EPISODE panel. No trims; times below match the source.
- **Post-production master:** `maim-academy-expertise-master-v1.mp4` (Drive, alongside the source).
- **Layers:**
  1. The episode title in the panel. This is Remotion `AcademyEpisodeTitle` with
     `showBackdrop:false`, and it fades in over the first 0.4 seconds.
  2. Twenty teaching cards. These are Remotion `AcademyCardRegion` clips with alpha, placed at (1360,126) in the right-hand strip.
     - They stay clear of the face, the panel, the badge and the CTA bar.
     - Steps pop in on Major's words.
     - Timeline: `data/episodes/expertise-cards.json`.
  3. Burned-in captions to the approved rule: white text, 1.5 px black outline,
     and the active word in Crown Gold.
     - At most two lines, placed low and centred.
     - Word timing comes from an audio alignment (faster-whisper small.en), not from estimates.
- **Audio:** loudness-normalised to −14 LUFS with peaks at −1.5 dBTP.
- **Rebuild:**
  - Cards: `scripts/compose_episode.py` together with `scripts/build_captions.py`, after rendering the cards with
    `npx remotion render <bundle> AcademyCardRegion <id>.webm --props=<card>.json --codec=vp8 --pixel-format=yuva420p --image-format=png`.
  - Region rendering is five times faster than full-frame rendering.

## Closed captions

`expertise-en.srt` is the corrected caption file to upload as English captions. It fixes:

- MAIM, which the source track had as "Mame" and "MAME".
- NotebookLM and Substack.
- majoraimindset.com.

Meaning is unchanged.

## Thumbnail

`build/thumbnails/maim_yt_expertise_1280x720_v1.jpg` is Major's supplied design
(`assets/thumbnails/expertise-thumbnail-supplied.webp`), resized only. Major uploads it.

## Title (recommend the first)

1. **What Lives in Your Head Isn't Expertise. It's Risk.**
2. Get It Out of Your Head: The System Audit
3. If Only You Know How, It's Not a System

## Description

```
If only you know how to do it, it isn't expertise. It's risk.

It can't be improved, handed over, sold or passed on, because nobody can see it.
In this episode I take one task I do every week, my Substack workflow, and show
where my written steps stop and my instincts take over. Then you do the same.

TODAY'S ASSIGNMENT: the System Audit
1. Choose one recurring task (maybe from your bottleneck list)
2. Write the steps
3. Circle the hidden decisions
4. Label each one: unwritten rule, or judgment

Chapters
0:00 When you automate, itemize everything
0:12 What people leave out
1:02 Choose one task
1:53 My content workflow, step by step
3:48 If someone took over tomorrow
5:47 Where instinct takes over
7:48 Why we don't write it down
9:28 What only you should handle
12:01 Circle every "it depends"
13:34 Unwritten rule or judgment?
16:27 Today's assignment: the System Audit
18:43 Reserve your spot

MAIM Academy founding cohort
Reserve free: https://academy.majoraimindset.com/reserve
US$249, paid once. 20 places. Payment opens 11 November; we start 18 November.

Free guide: https://www.majoraimindset.com

Fix the system, fix the income.
```

**Tags:** systems thinking, document your process, SOP, small business systems,
delegation, NotebookLM workflow, AI for business owners, founder bottleneck,
MAIM Academy, Major Dream Williams

**Playlist:** Major Moves. **Visibility:** Major's call; suggest unlisted until he has watched the master.

## QA done

- Frames were checked at the opening, at every card and at the CTA. Card placement, panel title and captions were checked against the face, badge and CTA bar.
- The spoken CTA matches `CTA_FACTS_LIVE.md`: reserving is free, US$249 paid once, 20 places, payment opens 11 Nov, starts 18 Nov.
- The on-screen CTA card shows the correct reserve URL, which is also written into the captions.
- **Not done:** a full real-time watch-through by a person. Major should watch it once before upload.
