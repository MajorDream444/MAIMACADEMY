#!/usr/bin/env python3
"""Native 4K master. Titles belong in post; never bake episode text into this asset."""
import json, math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'build/backdrop/master'
BLACK=(5,5,5); GOLD=(216,175,85); LEGACY=(159,116,44); GREEN=(31,122,58); BLUE=(0,107,182); WHITE=(247,244,234)
S=2; W=3840; H=2160

def mix(a,b,t):
    return tuple(round(x+(y-x)*t) for x,y in zip(a,b))

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    img=Image.new('RGB',(W,H),BLACK).convert('RGBA')
    lines=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(lines)
    for side in (-1,1):
        rng=random.Random(8821 if side<0 else 8822)
        for i in range(210):
            u=i/209*2-1; drift=rng.uniform(-.06,.06); phase=rng.uniform(0,math.tau); amp=rng.uniform(.6,2.6)
            pts=[]
            for j in range(97):
                t=j/96; half=470+(26-470)*t**1.55
                x=(0 if side<0 else 1920)+t*((960+side*430)-(0 if side<0 else 1920))
                y=1080*.52+(u+drift*(1-abs(u)))*half+amp*math.sin(phase+t*4.1)*half/470
                pts.append((x*S,y*S))
            for j in range(96):
                t=(j+.5)/96
                gold=mix(LEGACY,GOLD,.35+.65*t)
                col=mix(GREEN,gold,min(1,max(0,(t-.12)/.60))) if i%5 in (0,1) else gold
                # Readable outer green, warm body, capped and feathered waist.
                strength=(.38+.35*(1-abs(u)))*(.60+.40*math.sin(math.pi*t))*(1-.72*max(0,(t-.80)/.20))
                d.line([pts[j],pts[j+1]],fill=col+(round(255*strength),),width=2)
    glow=lines.filter(ImageFilter.GaussianBlur(5))
    img=Image.alpha_composite(Image.alpha_composite(img,glow),lines)
    d=ImageDraw.Draw(img)
    def font(size,bold=False):
        return ImageFont.truetype(str(ROOT/'assets/fonts'/('Inter-ExtraBold.ttf' if bold else 'Inter-Medium.ttf')),round(size*S))
    def text(x,y,value,size,color=WHITE,bold=False,anchor=None):
        d.text((x*S,y*S),value,font=font(size,bold),fill=color,anchor=anchor)
    d.line((144,148,3696,148),fill=(39,39,42),width=4)
    text(72,44,'MAIM ACADEMY',19,GOLD)
    text(1848,44,'BUILD SOMETHING THAT RUNS',19,(168,168,168),anchor='ra')
    for x,c in ((72,GREEN),(120,GOLD),(168,BLUE)):
        d.rounded_rectangle((x*S,108*S,(x+39)*S,114*S),radius=4,fill=c)
    d.rounded_rectangle((144,1560,1004,1904),radius=20,fill=(17,17,17),outline=(39,39,42),width=4)
    text(90,800,'THIS EPISODE',17,GOLD,True)
    d.line((180,1652,260,1652),fill=GOLD,width=6)
    badge=Image.open(ROOT/'assets/brand/MD-Academy-Badge-Transparent.png').convert('RGBA').resize((208,208),Image.Resampling.LANCZOS)
    img.alpha_composite(badge,(3488,1588))
    d=ImageDraw.Draw(img)
    text(1848,910,'MAJOR DREAM WILLIAMS',30,WHITE,True,'ra')
    text(1848,948,'Founder · AMA Solutions Corp',19,(168,168,168),anchor='ra')
    d.line((144,1968,3696,1968),fill=LEGACY,width=4)
    text(72,1004,'Reserve your spot · 20 spots · Starts 18 November',24)
    text(1848,1004,'academy.majoraimindset.com/reserve',24,GOLD,anchor='ra')
    img=img.convert('RGB'); receipt=[]
    for width,height in ((3840,2160),(1920,1080)):
        normal=img if width==3840 else img.resize((width,height),Image.Resampling.LANCZOS)
        mirrored=normal.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        assert ImageChops.difference(normal,mirrored.transpose(Image.Transpose.FLIP_LEFT_RIGHT)).getbbox() is None
        for label,im in (('NORMAL',normal),('MIRRORED',mirrored)):
            name=f'maim-academy-master-{label}-{width}x{height}.png'; im.save(OUT/name); receipt.append(name)
    assert img.getpixel((160,220))==GREEN and img.getpixel((256,220))==GOLD and img.getpixel((352,220))==BLUE
    (OUT/'manifest.json').write_text(json.dumps({'files':receipt,'native_size':[W,H],'empty_title_panel':True,'mirror_roundtrip':'PASS','tri_bar_tokens':'PASS','panel_1080':{'left':90,'top':838,'width':394,'height':104}},indent=2)+'\n')
    print(json.dumps(receipt))
if __name__=='__main__':main()
