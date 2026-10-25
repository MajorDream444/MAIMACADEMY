#!/usr/bin/env python3
"""MAIM Academy — Bottleneck thumbnail: "18 GUESTS. NO WINE."

Major supplied the finished design on 25 Oct 2026
(assets/thumbnails/bottleneck-thumbnail-supplied.webp). It is his own photo,
not generated, and it is kept as he made it. This script only:
  - resizes it to 1280x720,
  - places the approved badge file exactly over the badge position,
  - adds the flat tri-bar as the quiet signature after the wordmark.

Output: build/thumbnails/maim_yt_bottleneck_1280x720_v3.png and a 320x180 preview.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "build/thumbnails"; OUT.mkdir(parents=True, exist_ok=True)
GREEN, GOLD, BLUE = (31, 122, 58), (216, 175, 85), (0, 107, 182)   # tokens, flat
W, H = 1280, 720

src = Image.open(ROOT / "assets/thumbnails/bottleneck-thumbnail-supplied.webp").convert("RGBA")
k = W / src.width
img = src.resize((W, H), Image.LANCZOS)

# the badge in the design sits in a ~68 px circle centred at (64, 51) of the 1672 px source
cx, cy, dia = 64 * k, 51 * k, 74 * k
badge = Image.open(ROOT / "assets/brand/MD-Academy-Badge-Transparent.png").convert("RGBA")
badge = badge.resize((round(dia), round(dia)), Image.LANCZOS)
img.alpha_composite(badge, (round(cx - dia / 2), round(cy - dia / 2)))

# tri-bar after the MAIM ACADEMY wordmark (which ends near x=385 of the source)
d = ImageDraw.Draw(img)
x0, y0 = round(400 * k), round(cy) - 2
for i, c in enumerate((GREEN, GOLD, BLUE)):
    d.rounded_rectangle((x0 + i * 30, y0, x0 + i * 30 + 24, y0 + 4), radius=2, fill=c)

out = img.convert("RGB")
out.save(OUT / "maim_yt_bottleneck_1280x720_v3.png")
out.resize((320, 180), Image.LANCZOS).save(OUT / "maim_yt_bottleneck_1280x720_v3-320.png")
print("tri-bar:", ["#%02X%02X%02X" % out.getpixel((x0 + i * 30 + 12, y0 + 2)) for i in range(3)])
