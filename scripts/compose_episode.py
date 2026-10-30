#!/usr/bin/env python3
"""Compose a finished MAIM Academy episode from the recording and its graphics.

Layers, bottom to top: the recording (shot on the master backdrop), the episode
title in the THIS EPISODE panel, the teaching cards (Remotion AcademyCardRegion
clips with alpha, placed at REGION_ORIGIN), then the approved captions (ASS).
Audio is loudness-normalised to -14 LUFS for YouTube.

    python3 scripts/compose_episode.py SOURCE.mp4 cards.json CARDS_DIR title.png captions.ass OUT.mp4
"""
import json, subprocess, sys
from pathlib import Path

REGION_ORIGIN = (1360, 126)      # must match AcademyCard.tsx
FONTS = Path(__file__).resolve().parent.parent / "assets" / "fonts"

src, cards_json, cards_dir, title, ass, out = sys.argv[1:7]
cards = json.load(open(cards_json))["cards"]
args = ["ffmpeg", "-y", "-v", "error", "-stats", "-i", src, "-loop", "1", "-i", title]
fc = ["[1:v]format=rgba,fade=in:st=0:d=0.4:alpha=1[ttl]", "[0:v][ttl]overlay=0:0:shortest=1[b0]"]
last = "b0"
for n, c in enumerate(cards):
    clip = Path(cards_dir) / f"{c['id']}.webm"
    args += ["-itsoffset", f"{c['start']:.3f}", "-c:v", "libvpx", "-i", str(clip)]
    i = n + 2
    end = c["start"] + c["duration"]
    fc.append(f"[{last}][{i}:v]overlay={REGION_ORIGIN[0]}:{REGION_ORIGIN[1]}:eof_action=pass:"
              f"enable='between(t,{c['start']:.3f},{end:.3f})'[b{i}]")
    last = f"b{i}"
fc.append(f"[{last}]ass={ass}:fontsdir={FONTS}[vout]")
fc.append("[0:a]loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
args += ["-filter_complex", ";".join(fc), "-map", "[vout]", "-map", "[aout]",
         "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out]
subprocess.run(args, check=True)
