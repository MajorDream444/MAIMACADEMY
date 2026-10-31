#!/usr/bin/env python3
"""Approved MAIM Academy captions (SUBTITLE_STYLE_RULES.md, 26-27 Oct 2026).

White text, thin black outline, Academy Crown Gold on the active spoken word.
Input: faster-whisper word timings (JSON). Output: an .ass file for burn-in and a
corrected .srt for YouTube closed captions. Word timing comes from the audio
alignment, not from guessing inside a subtitle line.

    python3 scripts/build_captions.py words.json out.ass out.srt
"""
import json, re, sys

FIXES = [  # brand and product spellings; meaning is never rewritten
    (r"(?i)\bmame\b", "MAIM"), (r"\bNotebook ?LM\b", "NotebookLM"),
    (r"\bnotebook ?lm\b", "NotebookLM"), (r"\bsub stack\b", "Substack"), (r"\bsubstack\b", "Substack"),
]
MAX_LINE = 36          # characters per line
MAX_LINES = 2
GAP_BREAK = 0.6        # a pause this long starts a new caption
GOLD, WHITE = "&H0055AFD8&", "&H00EAF4F7&"   # Crown Gold #D8AF55, Clarity White #F7F4EA (ASS is BGR)


def ts_ass(t):
    h, r = divmod(max(t, 0), 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def ts_srt(t):
    ms = int(round(max(t, 0) * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def fix(text):
    for a, b in FIXES:
        text = re.sub(a, b, text)
    return text


def words_of(segs):
    out = []
    for s in segs:
        for i, w in enumerate(s["words"]):
            t = w["w"].strip()
            if not t:
                continue
            out.append({"t": t, "s": w["s"], "e": w["e"], "seg_end": i == len(s["words"]) - 1})
    # merge "sub" + "stack" style splits after fixing
    merged = []
    for w in out:
        if merged and merged[-1]["t"].lower() == "sub" and w["t"].lower().startswith("stack"):
            merged[-1].update(t="Substack" + w["t"][5:], e=w["e"], seg_end=w["seg_end"]); continue
        if merged and merged[-1]["t"].lower().rstrip(",.") == "notebook" and w["t"].lower().startswith("lm"):
            merged[-1].update(t="NotebookLM" + w["t"][2:], e=w["e"], seg_end=w["seg_end"]); continue
        merged.append(w)
    for w in merged:
        w["t"] = fix(w["t"])
    return merged


def chunk(words):
    """Group words into captions of at most MAX_LINES lines of MAX_LINE characters."""
    caps, cur = [], []
    def lines_for(ws):
        """One line if it fits, else two lines split near the middle (no widows)."""
        toks = [w["t"] for w in ws]
        text = " ".join(toks)
        if len(text) <= MAX_LINE:
            return [text]
        best = None
        for k in range(1, len(toks)):
            a, b = " ".join(toks[:k]), " ".join(toks[k:])
            if len(a) > MAX_LINE or len(b) > MAX_LINE:
                continue
            score = abs(len(a) - len(b))
            if best is None or score < best[0]:
                best = (score, [a, b])
        return best[1] if best else [text[:0]] * 3   # 3 lines = does not fit
    for w in words:
        if cur and w["s"] - cur[-1]["e"] > GAP_BREAK:
            caps.append(cur); cur = []
        elif cur and len(lines_for(cur + [w])) > MAX_LINES:
            # prefer to break after a comma in the second half, so phrases stay whole
            j = max((k for k, x in enumerate(cur) if x["t"][-1:] in ",.?!" and k >= 2), default=None)
            if j is not None and j < len(cur) - 1:
                caps.append(cur[:j + 1]); cur = cur[j + 1:]
            else:
                caps.append(cur); cur = []
        cur.append(w)
        if w["t"][-1:] in ".?!" and len(" ".join(x["t"] for x in cur)) > 18:
            caps.append(cur); cur = []
    if cur:
        caps.append(cur)
    return caps, lines_for


def main(src, ass_out, srt_out):
    words = words_of(json.load(open(src)))
    caps, lines_for = chunk(words)
    head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Academy,Inter Medium,46,&H00EAF4F7,&H00EAF4F7,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1.5,0,2,510,510,140,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev, srt = [], []
    for n, cap in enumerate(caps):
        end_cap = cap[-1]["e"] + 0.25
        if n + 1 < len(caps):
            end_cap = min(end_cap, caps[n + 1][0]["s"])
        lines = lines_for(cap)
        srt.append(f"{n + 1}\n{ts_srt(cap[0]['s'])} --> {ts_srt(end_cap)}\n" + "\n".join(lines) + "\n")
        # one event per word: the whole caption, with the active word in gold
        for i, w in enumerate(cap):
            a = w["s"] if i else cap[0]["s"]
            b = cap[i + 1]["s"] if i + 1 < len(cap) else end_cap
            if b <= a:
                continue
            out, k, idx = [], 0, 0
            for li, line in enumerate(lines):
                parts = []
                for tok in line.split(" "):
                    parts.append(f"{{\\c{GOLD}}}{tok}{{\\c{WHITE}}}" if idx == i else tok)
                    idx += 1
                out.append(" ".join(parts))
            ev.append(f"Dialogue: 0,{ts_ass(a)},{ts_ass(b)},Academy,,0,0,0,,{{\\fad(0,0)}}" + "\\N".join(out))
    open(ass_out, "w").write(head + "\n".join(ev) + "\n")
    open(srt_out, "w").write("\n".join(srt))
    print(f"{len(caps)} captions, {len(ev)} word events")


if __name__ == "__main__":
    main(*sys.argv[1:4])
