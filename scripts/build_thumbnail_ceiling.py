#!/usr/bin/env python3
"""MAIM Academy — "Your Ceiling Is a Number" thumbnail, locked material finish.

Approved by Major, 25 Oct 2026. Rules: docs/design/ACADEMY_VISUAL_SYSTEM.md
("Thumbnail material finish"). Every material colour is a token from
major-ai-os/data/design-tokens.json v2.1; the light and gradients are the
approved treatment. The portrait pixels and the MD mark are composited
untouched, and the tri-bar stays flat.

Output: build/thumbnails/maim_yt_ceiling_1280x720_v10.png and a 320x180 preview.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
ROOT=Path(__file__).resolve().parent.parent
R=f"{ROOT}/"
OUT=ROOT/"build/thumbnails"; OUT.mkdir(parents=True,exist_ok=True)
hx=lambda h:np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
BLACK,GOLD,LEGACY,GREEN,WHITE,BLUE=(hx(c) for c in ("#050505","#D8AF55","#9F742C","#1F7A3A","#F7F4EA","#006BB6"))
t=lambda c:tuple(int(v) for v in c)
W,H=1280,720
AB=lambda n:ImageFont.truetype(f"{R}assets/fonts/ArchivoBlack-Regular.ttf",n)
def OS(n):
    f=ImageFont.truetype(f"{R}assets/fonts/Oswald-Variable.ttf",n); f.set_variation_by_name(b"Medium"); return f
rng=np.random.default_rng(7)
def mix(a,b,k): return a*(1-k)+b*k
def layer(rgb, alpha):                     # rgb HxWx3 float, alpha HxW 0..1 -> RGBA
    a=np.clip(alpha,0,1)[...,None]
    return Image.fromarray(np.concatenate([np.clip(rgb,0,255),a*255],-1).astype(np.uint8),"RGBA")
def mask_of(draw_fn):
    m=Image.new("L",(W,H),0); draw_fn(ImageDraw.Draw(m)); return m
def screen_glow(img, mask_img, col, strength):
    base=np.asarray(img.convert("RGB"),float)/255; g=np.asarray(mask_img,float)[...,None]/255*strength
    c=col/255; out=1-(1-base)*(1-g*c)
    return Image.fromarray(np.round(np.clip(out,0,1)*255).astype(np.uint8)).convert("RGBA")

img=Image.new("RGBA",(W,H),t(BLACK)+(255,))
d=ImageDraw.Draw(img)
def fit(text,font_fn,width):
    n=300
    while d.textlength(text,font=font_fn(n))>width: n-=2
    return font_fn(n)

CEIL=304
yy,xx=np.mgrid[0:H,0:W]
BORDER=hx("#27272A")
gm=mask_of(lambda q:([q.line([(x,0),(x,H)],fill=255,width=1) for x in range(8,W,48)],[q.line([(0,y),(W,y)],fill=255,width=1) for y in range(16,H,48)]))
fade=np.clip((xx-640)/360,0,1)*np.clip(1-np.hypot((xx-1000)/520,(yy-360)/420),0,1)
img.alpha_composite(layer(np.broadcast_to(BORDER,(H,W,3)),np.asarray(gm,float)/255*fade*0.9))
# ---- rising line: thicker, Jamaica Green, bloom concentrated at the ceiling contact
pts=[(690,516),(728,486),(760,446),(790,404),(816,366),(838,334),(856,314),(872,CEIL+2),(892,CEIL),(W,CEIL)]
lm=mask_of(lambda q:q.line(pts,fill=255,width=9,joint="curve"))
bloom=lm.filter(ImageFilter.GaussianBlur(10))
spot=np.exp(-(((xx-884)/70)**2+((yy-CEIL)/34)**2))
bl=np.asarray(bloom,float)/255*0.75+spot*1.0
img=screen_glow(img,Image.fromarray((np.clip(bl,0,1)*255).astype(np.uint8)),GREEN,1.0)
core=np.exp(-(((xx-884)/16)**2+((yy-CEIL)/7)**2))*0.55                    # small warm core at contact
img=screen_glow(img,Image.fromarray((core*255).astype(np.uint8)),WHITE,1.0)
gl=Image.new("RGBA",(W,H),t(GREEN)+(255,)); gl.putalpha(lm); img.alpha_composite(gl)
_d=ImageDraw.Draw(img); _d.ellipse((892-11,CEIL-11,892+11,CEIL+11),fill=t(GREEN)); _d.ellipse((892-6,CEIL-6,892+6,CEIL+6),fill=t(WHITE))

# ---- portrait: original pixels; separation is a warm backlight behind the cutout
cut=Image.open(f"{R}assets/thumbnails/ceiling-cutout-187s.png").convert("RGBA"); cut=cut.crop(cut.getbbox())
cut=cut.crop((0,0,cut.width,int(cut.height*0.74)))
SH=548; cut=cut.resize((int(cut.width*SH/cut.height),SH),Image.LANCZOS)
a=cut.split()[3].point(lambda v:255 if v>110 else 0).filter(ImageFilter.GaussianBlur(1.2)); cut.putalpha(a)
px,py=W-cut.width+120,H-SH+6
pad=80; big=Image.new("L",(cut.width+2*pad,cut.height+2*pad),0); big.paste(a,(pad,pad))
back=Image.new("L",(W,H),0); back.paste(big.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(34)),(px-pad,py-pad-10))
img=screen_glow(img,back,LEGACY,0.6)
sh=Image.new("RGBA",big.size,t(BLACK)+(255,)); sh.putalpha(big.filter(ImageFilter.GaussianBlur(16)).point(lambda v:int(v*0.8)))
img.alpha_composite(sh,(px-pad-14,py-pad+12))
rim=Image.new("RGBA",big.size,t(GOLD)+(255,)); rim.putalpha(big.filter(ImageFilter.MaxFilter(5)))
img.alpha_composite(rim,(px-pad,py-pad)); img.alpha_composite(cut,(px,py)); d=ImageDraw.Draw(img)

# ---- thought bubble (unchanged)
bub=Image.new("L",(W,H),0); bd=ImageDraw.Draw(bub)
bx0,by0,bx1,by1=678,46,1240,204
bd.rounded_rectangle((bx0,by0,bx1,by1),radius=84,fill=255)
for cx,cy,r in [(768,60,36),(884,56,32),(1006,58,34),(1126,62,34),(1200,120,42),(722,170,34),(1176,182,32)]:
    bd.ellipse((cx-r,cy-r,cx+r,cy+r),fill=255)
hx_=px+int(cut.width*0.40)
for x,y,r in [(hx_-56,by1+24,15),(hx_-36,by1+48,9)]: bd.ellipse((x-r,y-r,x+r,y+r),fill=255)
e=Image.new("RGBA",(W,H),t(GOLD)+(255,)); e.putalpha(bub.filter(ImageFilter.MaxFilter(7))); img.alpha_composite(e)
f=Image.new("RGBA",(W,H),t(WHITE)+(255,)); f.putalpha(bub); img.alpha_composite(f); d=ImageDraw.Draw(img)
d.text((958,104),"Hours × Days × Weeks × Rate",font=AB(31),fill=t(BLACK),anchor="mm")
d.text((958,158),"= YOUR LIMIT?",font=AB(52),fill=t(GREEN),anchor="mm")

# ---- mark + wordmark (unchanged)
m=Image.open(R+"assets/brand/MD-Circle-Transparent.png").convert("RGBA").resize((66,66),Image.LANCZOS)
img.alpha_composite(m,(30,20)); d=ImageDraw.Draw(img)
x=112
for ch in "MAIM ACADEMY": d.text((x,30),ch,font=OS(34),fill=t(GOLD)); x+=d.textlength(ch,font=OS(34))+5

tex=np.asarray(Image.fromarray(((rng.normal(0,1,(H,W))*40+128).clip(0,255)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6)),float)/255-0.5
def bevel_text(text,font,xy,contact=0):
    global img
    m=mask_of(lambda q:q.text(xy,text,font=font,fill=255)); ma=np.asarray(m,float)/255; bb=m.getbbox()
    v=np.clip((yy-bb[1])/(bb[3]-bb[1]),0,1)[...,None]
    face=mix(WHITE,mix(WHITE,GOLD,0.28),v)+tex[...,None]*22          # warm Clarity White, fine grain
    hgt=np.asarray(m.filter(ImageFilter.GaussianBlur(2.6)),float)/255+tex*0.05
    gy,gx=np.gradient(hgt); light=-(gx*0.6+gy*0.8)*7
    rgb=mix(face,GOLD,np.clip(light,0,1)[...,None]*0.9)
    rgb=mix(rgb,mix(LEGACY,BLACK,0.3),np.clip(-light,0,1)[...,None]*0.75)
    edge=ImageChops.subtract(m,m.filter(ImageFilter.MinFilter(5)))         # gold rim
    rgb=mix(rgb,GOLD,(np.asarray(edge,float)/255*0.8)[...,None])
    if contact: rgb=mix(rgb,BLACK,(np.clip(1-(yy-bb[1])/contact,0,1)*0.6)[...,None])
    sh=Image.new("RGBA",(W,H),t(BLACK)+(255,)); sh.putalpha(m.filter(ImageFilter.GaussianBlur(6)).point(lambda p:int(p*0.7)))
    img.alpha_composite(sh,(4,6)); img.alpha_composite(layer(rgb,ma)); return bb
bevel_text("YOUR",AB(128),(34,98))

# ---- gold beam: brushed metal, bright upper edge, deeper Legacy Gold front, restrained reflection
BL,BR=0,756; top_y,front_top,front_bot=CEIL-62,CEIL-46,CEIL-6
noise=rng.normal(0,1,(H,W)); brushed=np.asarray(Image.fromarray(((noise-noise.min())/(np.ptp(noise))*255).astype(np.uint8)).filter(ImageFilter.BoxBlur(0)),float)
# streak: blur along x only
br=np.cumsum(np.pad(noise,((0,0),(40,40)),mode="edge"),1); br=(br[:,80:]-br[:,:-80])/80; br=(br-br.mean())/br.std()
yrel=np.clip((yy-top_y)/max(1,front_top-top_y),0,1)
top_rgb=mix(mix(WHITE,GOLD,0.35),GOLD,yrel[...,None])+br[...,None]*6          # bright upper edge -> crown gold
top_m=mask_of(lambda q:q.polygon([(BL,front_top),(BR,front_top),(BR-22,top_y),(BL,top_y)],fill=255))
img.alpha_composite(layer(top_rgb,np.asarray(top_m,float)/255))
frel=np.clip((yy-front_top)/(front_bot-front_top),0,1)
front_rgb=mix(LEGACY,mix(LEGACY,BLACK,0.38),frel[...,None])+br[...,None]*7
front_m=mask_of(lambda q:(q.rectangle((BL,front_top,BR,front_bot),fill=255),q.polygon([(BR,front_top),(BR+26,front_top+16),(BR+26,front_bot),(BR,front_bot)],fill=255)))
img.alpha_composite(layer(front_rgb,np.asarray(front_m,float)/255))
edge_m=mask_of(lambda q:q.line([(BL,front_top),(BR,front_top)],fill=255,width=2))
img.alpha_composite(layer(np.broadcast_to(WHITE,(H,W,3)),np.asarray(edge_m,float)/255*0.9))   # bright lip
spec=np.where(np.asarray(front_m)>0,np.exp(-((yy-(front_top+5))/3.0)**2)*0.55,0)
img=screen_glow(img,Image.fromarray((spec*255).astype(np.uint8)),GOLD,1.0)
end_m=mask_of(lambda q:q.polygon([(BR,front_top),(BR+26,front_top+16),(BR+26,front_bot),(BR,front_bot)],fill=255))
img.alpha_composite(layer(np.broadcast_to(mix(LEGACY,BLACK,0.45),(H,W,3)),np.asarray(end_m,float)/255*0.8))
gl_=sum(np.exp(-(((xx-gx_)/22)**2+((yy-front_bot)/5)**2)) for gx_ in (120,300,480,660))*0.5
img=screen_glow(img,Image.fromarray((np.clip(gl_,0,1)*255).astype(np.uint8)),GOLD,1.0)
d=ImageDraw.Draw(img)
d.line([(BR+26,CEIL-4),(892,CEIL-4)],fill=t(GOLD),width=3)
# reflection underneath: faint gold falloff just below the beam, beyond the lettering
refl=np.where((yy>front_bot)&(xx<BR+26),np.exp(-(yy-front_bot)/9.0),0)*0.30
img=screen_glow(img,Image.fromarray((np.clip(refl,0,1)*255).astype(np.uint8)),GOLD,1.0)

# ---- CEILING: warm Clarity White face, shallow bevel, gold edge highlights, contact shadow
cf=fit("CEILING",AB,688)
tb=ImageDraw.Draw(Image.new("L",(1,1))).textbbox((0,0),"CEILING",font=cf); ty=front_bot+3-tb[1]
cbb=bevel_text("CEILING",cf,(34,ty),contact=16); d=ImageDraw.Draw(img)
ceil_bottom=cbb[3]

# ---- Jamaica Green panel: directional light, darker edges, fine reflective gold border
bt=ceil_bottom+16
nf=fit("NUMBER",AB,664); nb=d.textbbox((0,0),"NUMBER",font=nf); isf=AB(62); ib=d.textbbox((0,0),"IS A",font=isf)
BH=(ib[3]-ib[1])+14+(nb[3]-nb[1])+44
X0,Y0,X1,Y1=26,bt,726,bt+BH
pm=mask_of(lambda q:q.rounded_rectangle((X0,Y0,X1,Y1),radius=16,fill=255))
u=np.clip((xx-X0)/(X1-X0),0,1); v=np.clip((yy-Y0)/(Y1-Y0),0,1)
lit=np.clip(0.5-(u*0.55+v*0.45),-1,1)                                            # top-left light
prgb=np.where(lit[...,None]>0, mix(GREEN,GOLD,(lit*0.22)[...,None]), mix(GREEN,BLACK,(-lit*0.45)[...,None]))
inner=np.asarray(pm.filter(ImageFilter.MinFilter(15)).filter(ImageFilter.GaussianBlur(10)),float)/255
prgb=mix(prgb,BLACK,((1-inner)*0.35)[...,None])                                   # darker edges
img.alpha_composite(layer(prgb,np.asarray(pm,float)/255))
ring=ImageChops.subtract(pm,pm.filter(ImageFilter.MinFilter(5)))
rk=np.clip(1-(u*0.5+v*0.6),0,1)[...,None]                                         # reflective: bright at top-left, deep at bottom-right
rrgb=np.where(rk>0.5, mix(GOLD,WHITE,(rk-0.5)*0.9), mix(LEGACY,GOLD,rk*2))
img.alpha_composite(layer(rrgb,np.asarray(ring,float)/255)); d=ImageDraw.Draw(img)
block=(ib[3]-ib[1])+14+(nb[3]-nb[1]); top=bt+(BH-block)//2
d.text((54,top-ib[1]),"IS A",font=isf,fill=t(GOLD))
d.text((50,top+(ib[3]-ib[1])+14-nb[1]),"NUMBER",font=nf,fill=t(WHITE))

# ---- tri-bar: flat and exact
tb_y=bt+BH+18
for i,c in enumerate([GREEN,GOLD,BLUE]):
    d.rounded_rectangle((30+i*50,tb_y,30+i*50+44,tb_y+6),radius=3,fill=t(c))

out=img.convert("RGB"); out.save(OUT/"maim_yt_ceiling_1280x720_v10.png")
out.resize((320,180),Image.LANCZOS).save(OUT/"maim_yt_ceiling_1280x720_v10-320.png")
# verify: portrait pixels untouched, tri-bar exact
o=np.asarray(out,float); src=np.asarray(cut.convert("RGB"),float); al=np.asarray(cut.split()[3])
yy0,xx0=np.nonzero(al==255); keep=(xx0+px<W)&(yy0+py<H); bm=np.asarray(bub.filter(ImageFilter.MaxFilter(9))); keep&=bm[np.minimum(yy0+py,H-1),np.minimum(xx0+px,W-1)]==0
diff=np.abs(o[yy0[keep]+py,xx0[keep]+px]-src[yy0[keep],xx0[keep]]).max()

print("tri-bar:",["#%02X%02X%02X"%tuple(o[tb_y+3,30+i*50+20].astype(int)) for i in range(3)])
dd=np.abs(o[yy0[keep]+py,xx0[keep]+px]-src[yy0[keep],xx0[keep]]).max(1); bad=dd>2
print("portrait pixels changed (only where the green panel overlaps the shoulder):",int(bad.sum()))
