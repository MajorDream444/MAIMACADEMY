#!/usr/bin/env python3
"""Owner correction, 25 Oct: enhance the complete original; preserve geometry."""
import json
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import build_video_backdrop as original

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'build/backdrop/enhanced'
GREEN = (31, 122, 58)
BLUE = (0, 107, 182)

def enhanced_field(d, side, cy):
    # Identical seed, coordinates, taper, tremble and sample count to original.
    rnd = random.Random(8821 if side < 0 else 8822)
    ss = original.SS
    edge_x = 0 if side < 0 else original.W * ss
    waist_x = (original.W / 2 + side * original.WAIST_OFFSET) * ss
    for i in range(original.N_LINES):
        u = i / (original.N_LINES - 1) * 2 - 1
        drift = rnd.uniform(-.06, .06)
        phase = rnd.uniform(0, math.tau)
        amp = rnd.uniform(.6, 2.6) * ss
        edge = abs(u)
        pts = []
        for s in range(original.SAMPLES + 1):
            t = s / original.SAMPLES
            half = (original.EDGE_HALF + (original.WAIST_HALF-original.EDGE_HALF)*t**original.TAPER)*ss
            tremble = amp*math.sin(phase+t*4.1)*(half/(original.EDGE_HALF*ss))
            pts.append((edge_x+t*(waist_x-edge_x),cy*ss+(u+drift*(1-abs(u)))*half+tremble))
        selected = i % 13 in (0, 1) and edge > .30
        for j in range(original.SAMPLES):
            t = (j+.5)/original.SAMPLES
            # Brightness stays off the apex; no headlight at the waist.
            alpha = (.36+.26*(1-edge))*original.fade(t)
            gold = original.lerp(original.LEGACY,original.CROWN,t**.6)
            col = original.lerp(GREEN,gold,min(1,t/.72)) if selected else gold
            width = max(1,round((.65+.55*(1-edge))*ss))
            if i % 17 == 0:
                d.line([pts[j],pts[j+1]],fill=col+(round(alpha*55),),width=width+5)
            d.line([pts[j],pts[j+1]],fill=col+(min(210,round(alpha*255)),),width=width)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    original.draw_field = enhanced_field
    img = original.build(False,False,('','')).convert('RGB')
    # Protect original identity/type pixel regions. Never use generated marks.
    source = Image.open(ROOT/'build/backdrop/maim-academy-backdrop-1920x1080.png').convert('RGB')
    protected = [(0,0,1920,90),(1430,790,1880,976),(0,980,1920,1080)]
    for box in protected:
        img.paste(source.crop(box),box[:2])
    # Quiet shared signature. Flat exact token values; same order everywhere.
    d = ImageDraw.Draw(img)
    for x,col in [(72,GREEN),(120,original.CROWN),(168,BLUE)]:
        d.rounded_rectangle((x,108,x+39,113),radius=2,fill=col)
    # Neutral charcoal presenter depth, confined to clearance zone.
    bloom = Image.new('RGBA',img.size,(0,0,0,0))
    bd = ImageDraw.Draw(bloom)
    bd.ellipse((650,180,1270,850),fill=(17,17,17,90))
    bloom = bloom.filter(ImageFilter.GaussianBlur(65))
    mask = Image.new('L',img.size,0)
    ImageDraw.Draw(mask).rectangle((570,96,1349,769),fill=255)
    bloom.putalpha(ImageChops.multiply(bloom.getchannel('A'),mask))
    img = Image.alpha_composite(img.convert('RGBA'),bloom).convert('RGB')
    normal = OUT/'maim-academy-backdrop-enhanced-NORMAL-1920x1080.png'
    mirror = OUT/'maim-academy-backdrop-enhanced-MIRRORED-1920x1080.png'
    img.save(normal)
    flipped = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    flipped.save(mirror)
    # Verification of the locked mark, headings, name/role and footer.
    for box in protected:
        assert ImageChops.difference(source.crop(box),img.crop(box)).getbbox() is None,box
    assert ImageChops.difference(img,flipped.transpose(Image.Transpose.FLIP_LEFT_RIGHT)).getbbox() is None
    for x,col in [(80,GREEN),(128,original.CROWN),(176,BLUE)]:
        assert img.getpixel((x,110)) == col
    print(json.dumps({'files':[str(normal),str(mirror)],'protected_pixels':'PASS','mirror_roundtrip':'PASS','tri_bar_tokens':'PASS'}))

if __name__ == '__main__':
    main()
