# Herk Edit Kit — bounded test on MAIM footage (31 Oct 2026)

Tested `MajorDream444/herk-edit-kit` at `10511e5` in the Claude Code cloud
container (Linux, Node 22.22, FFmpeg 6.1.1, Chromium headless 1243). The production
Expertise master and its files were not touched. Nothing was uploaded, and there
were no paid calls (no ElevenLabs, no Kie.ai).

**Clip:** Drive `1xHmtgOODtyIh3udzS9JVf_p1UoHm9pK8`, 81.06 s, 1080p. It is the
audience-trust passage (see the Drive finding below).

## What worked

- **Install:** `npm ci`, 11/11 tests pass, and `npm run check` reports 716 files,
  406 cards and 0 errors.
- **Local transcription:** faster-whisper small.en gave word timestamps for the clip
  (183 words), normalised to the kit's `{text, audio_duration_secs, words[]}` format.
  No ElevenLabs call was needed.
- **cut-silences:** removed 2.62 s across 5 pauses (gap ≥ 0.55 s). It is
  conservative and kept your natural pauses.
- **Re-skinning:** the Kallaway cards read every colour and font from `tokens.css`. A
  MAIM token file (black, Crown Gold, Jamaica Green, Champion Blue, Clarity White,
  clean Inter) re-skins them without editing the card code. This also removes the
  AI Automation Society palette, which the licence excludes from reuse.
- **Beats:** two beats were rendered over the trimmed clip.
  - A tier-1 takeover, "Who is your *audience?*", adapted from `kallaway.t1.section.question`.
  - A tier-2 card in the MAIM right-hand strip, "No one will ever do it the way *you* do."
  - Both checks pass on these beats: beat sync OK, slack −0.08 s and −0.09 s; HyperFrames lint 0 errors.
- **Render:** a 78.5 s 1080p draft with audio. Audio sync against the trimmed source is 0.0 ms.

## What broke or needs care

1. **FFmpeg 7+ is required but not documented.** `cut-silences` and `apply-cuts`
   pass `-/filter_complex`, which FFmpeg 6 rejects. `npm run test:media` crashes
   on FFmpeg 6. The kit was verified only on FFmpeg 8.1.1 on Windows.
   - The test ran through a one-line shim that maps the option to `-filter_complex_script`.
   - Fix for the fork: detect the version, or state FFmpeg ≥ 7 in the README.
2. **The mistake finder is blind to stutters with local Whisper.** It proposed
   0 cuts. Whisper normalises disfluencies: the source caption track has
   "the thing thing", and Whisper wrote "the thing". A verbatim prompt didn't help.
   `cut-mistakes` needs a verbatim transcript, either ElevenLabs Scribe (the kit's
   default, paid) or a verbatim-capable model.
3. **Preflight contradicts lint.** `preflight.mjs` blocks `data-start` on both the
   root and the video, while HyperFrames 0.7.109 lint requires both. The kit's
   own `claude-edit-intro` example fails preflight the same way but lints clean
   and has a rendered `final.mp4`. The preflight rule is stale.
4. **Speed.** The HyperFrames draft took 552 s for 78.5 s of video (about 7× slower
   than real time; a starter with no video rendered 8 s in 24 s). A full 19.5-minute episode
   would take more than 2 hours to draft here. The current MAIM path (Remotion
   region cards, then FFmpeg overlays and the caption burn) finished the whole
   episode in about 20 minutes.
5. **Tier-1 takeovers hide the speaker.** That's useful for a few big moments,
   like a thesis, a question or a stat, but our approved teaching cards keep Major on
   screen. Use takeovers sparingly, about 4 s, as the kit's own beats skill advises.

## Drive finding

`5_51–7_11_ highlight the hidden "it depends" decisions..mp4` and
`10_33–11_53_ distinguish handing over tasks from protecting audience trust..mp4`
are the same file (identical size, identical first 2 MB). Both contain the
audience-trust passage. The real 5:51–7:11 "it depends" clip is missing.

## Recommendation

Use Herk **selectively**, with Yawdie still coordinating:
- Adopt its **silence cut**, with FFmpeg ≥ 7 or the shim, and its **beat-sync and lint gates**.
- Use its **card library, re-skinned through a MAIM token file**, for a few
  full-screen moments per episode.
- Keep the **current MAIM compositor** (Remotion region cards, FFmpeg, approved ASS
  captions) for full-length episodes, because it is about 7× faster.
- Run **mistake cuts** only with a verbatim transcript.
- Any Yawdie adapter must pin FFmpeg ≥ 7, pass the silenced transcript downstream,
  and return the draft plus a VERIFY.md as review evidence.

Test project (gitignored inside the kit): `video-projects/maim-expertise-it-depends/`.
