#!/usr/bin/env python3
"""MAIM Academy — Bottleneck thumbnail: "18 GUESTS. NO WINE."

Major's direction, 25 Oct 2026: shared brand, individual story. The badge,
token colours and type carry the series; each episode earns its own scene.
Start from the story's defining moment, then build the image.

The dinner-party setting is the illustrated concept Major supplied
(assets/thumbnails/bottleneck-scene-concept.webp). Its generated portrait is
segmented out and filled with the surrounding scene, so no generated likeness
survives. Major's portrait is his own video frame (476 s), composited with
its pixels untouched, and the badge is the approved file. Lettering and
lighting follow the locked material finish; the tri-bar stays flat.

Output: build/thumbnails/maim_yt_bottleneck_1280x720_v2.png and a 320x180 preview.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
from rembg import remove, new_session

ROOT = Path(__file__).resolve().parent.parent
R = f"{ROOT}/"
OUT = ROOT / "build/thumbnails"; OUT.mkdir(parents=True, exist_ok=True)
hx = lambda h: np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)
BLACK, GOLD, LEGACY, GREEN, WHITE, BLUE = (hx(c) for c in
    ("#050505", "#D8AF55", "#9F742C", "#1F7A3A", "#F7F4EA", "#006BB6"))
t = lambda c: tuple(int(v) for v in c)
W, H = 1280, 720
AB = lambda n: ImageFont.truetype(f"{R}assets/fonts/ArchivoBlack-Regular.ttf", n)
def OS(n):
    f = ImageFont.truetype(f"{R}assets/fonts/Oswald-Variable.ttf", n); f.set_variation_by_name(b"Medium"); return f
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W]
def mix(a, b, k): return a * (1 - k) + b * k
def layer(rgb, alpha):
    a = np.clip(alpha, 0, 1)[..., None]
    return Image.fromarray(np.concatenate([np.clip(rgb, 0, 255), a * 255], -1).astype(np.uint8), "RGBA")
def mask_of(fn):
    m = Image.new("L", (W, H), 0); fn(ImageDraw.Draw(m)); return m
def screen_glow(img, mask_img, col, strength):
    base = np.asarray(img.convert("RGB"), float) / 255; g = np.asarray(mask_img, float)[..., None] / 255 * strength
    out = 1 - (1 - base) * (1 - g * col / 255)
    return Image.fromarray(np.round(np.clip(out, 0, 1) * 255).astype(np.uint8)).convert("RGBA")

# ---- scene: the supplied setting, with the generated figure removed
scene = Image.open(f"{R}assets/thumbnails/bottleneck-scene-concept.webp").convert("RGB")
person = remove(scene, session=new_session("isnet-general-use"), only_mask=True)
scene = scene.resize((W, H), Image.LANCZOS)
hole = person.resize((W, H)).point(lambda v: 255 if v > 30 else 0).filter(ImageFilter.MaxFilter(41))
known = 1 - np.asarray(hole, float)[..., None] / 255
src = np.asarray(scene, float)
fill = np.zeros_like(src)
for r in (8, 24, 64, 160):                      # normalised convolution: the hole fills from its own surroundings
    num = np.asarray(Image.fromarray(np.clip(src * known, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float)
    den = np.asarray(Image.fromarray((known[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float)[..., None] / 255
    est = num / np.maximum(den, 1e-3)
    fill = np.where((fill.sum(-1, keepdims=True) == 0) & (den > 0.15), est, fill)
fill = np.where(fill.sum(-1, keepdims=True) == 0, est, fill)
bg = src * known + fill * (1 - known)
# dark band for the headline; it also clears the concept's own lettering and badge
band = np.clip((385 - yy) / 45, 0, 1) * np.clip((1000 - xx) / 120, 0, 1)
bg = mix(bg, BLACK, band[..., None])
img = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).convert("RGBA")

# ---- portrait: Major's own frame, untouched pixels; separation is light behind him
cut = Image.open(f"{R}assets/thumbnails/bottleneck-cutout-476s.png").convert("RGBA")
cut = cut.crop(cut.split()[3].point(lambda v: 255 if v > 110 else 0).getbbox())
S = 1.06; cut = cut.resize((int(cut.width * S), int(cut.height * S)), Image.LANCZOS)
a = cut.split()[3].point(lambda v: 255 if v > 110 else 0).filter(ImageFilter.GaussianBlur(1.2)); cut.putalpha(a)
px, py = int(1010 - 0.48 * cut.width), 40
pad = 80; big = Image.new("L", (cut.width + 2 * pad, cut.height + 2 * pad), 0); big.paste(a, (pad, pad))
back = Image.new("L", (W, H), 0); back.paste(big.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(34)), (px - pad, py - pad - 10))
img = screen_glow(img, back, LEGACY, 0.4)
sh = Image.new("RGBA", big.size, t(BLACK) + (255,)); sh.putalpha(big.filter(ImageFilter.GaussianBlur(16)).point(lambda v: int(v * 0.8)))
img.alpha_composite(sh, (px - pad - 14, py - pad + 12))
rim = Image.new("RGBA", big.size, t(GOLD) + (255,)); rim.putalpha(big.filter(ImageFilter.MaxFilter(5)))
img.alpha_composite(rim, (px - pad, py - pad)); img.alpha_composite(cut, (px, py))

# ---- headline: locked finish. White line bevelled; gold line in token metal
tex = np.asarray(Image.fromarray(((rng.normal(0, 1, (H, W)) * 40 + 128).clip(0, 255)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6)), float) / 255 - 0.5
def lettering(text, font, xy, face_top, face_bot):
    global img
    m = mask_of(lambda q: q.text(xy, text, font=font, fill=255)); ma = np.asarray(m, float) / 255; bb = m.getbbox()
    v = np.clip((yy - bb[1]) / (bb[3] - bb[1]), 0, 1)[..., None]
    face = mix(face_top, face_bot, v) + tex[..., None] * 22
    hgt = np.asarray(m.filter(ImageFilter.GaussianBlur(2.6)), float) / 255 + tex * 0.05
    gy, gx = np.gradient(hgt); light = -(gx * 0.6 + gy * 0.8) * 7
    rgb = mix(face, mix(GOLD, WHITE, 0.5), np.clip(light, 0, 1)[..., None] * 0.8)
    rgb = mix(rgb, mix(LEGACY, BLACK, 0.3), np.clip(-light, 0, 1)[..., None] * 0.75)
    edge = ImageChops.subtract(m, m.filter(ImageFilter.MinFilter(5)))
    rgb = mix(rgb, GOLD, (np.asarray(edge, float) / 255 * 0.7)[..., None])
    s = Image.new("RGBA", (W, H), t(BLACK) + (255,)); s.putalpha(m.filter(ImageFilter.GaussianBlur(7)).point(lambda p: int(p * 0.75)))
    img.alpha_composite(s, (5, 7)); img.alpha_composite(layer(rgb, ma)); return bb
d = ImageDraw.Draw(img)
def fit(text, width):
    n = 300
    while d.textlength(text, font=AB(n)) > width: n -= 2
    return AB(n)
f1 = fit("18 GUESTS.", 780); f2 = fit("NO WINE.", 780)
b1 = lettering("18 GUESTS.", f1, (40, 82), WHITE, mix(WHITE, GOLD, 0.22))
b2 = lettering("NO WINE.", f2, (40, b1[3] + 22 - d.textbbox((0, 0), "NO WINE.", font=f2)[1]), mix(WHITE, GOLD, 0.55), LEGACY)

# ---- Academy badge + wordmark, straight on the canvas
m = Image.open(f"{R}assets/brand/MD-Academy-Badge-Transparent.png").convert("RGBA").resize((64, 64), Image.LANCZOS)
img.alpha_composite(m, (30, 16)); d = ImageDraw.Draw(img)
x = 108
for ch in "MAIM ACADEMY": d.text((x, 27), ch, font=OS(32), fill=t(GOLD)); x += d.textlength(ch, font=OS(32)) + 5

# ---- tri-bar: flat and exact, the quiet signature
tb_y = b2[3] + 22
for i, c in enumerate([GREEN, GOLD, BLUE]):
    d.rounded_rectangle((44 + i * 50, tb_y, 44 + i * 50 + 44, tb_y + 6), radius=3, fill=t(c))

out = img.convert("RGB"); out.save(OUT / "maim_yt_bottleneck_1280x720_v2.png")
out.resize((320, 180), Image.LANCZOS).save(OUT / "maim_yt_bottleneck_1280x720_v2-320.png")
o = np.asarray(out, float); srcp = np.asarray(cut.convert("RGB"), float); al = np.asarray(cut.split()[3])
y0, x0 = np.nonzero(al == 255); k = (x0 + px < W) & (y0 + py < H)
bad = np.abs(o[y0[k] + py, x0[k] + px] - srcp[y0[k], x0[k]]).max(1) > 2
print("tri-bar:", ["#%02X%02X%02X" % tuple(o[tb_y + 3, 44 + i * 50 + 20].astype(int)) for i in range(3)])
print("portrait pixels changed:", int(bad.sum()))
