#!/usr/bin/env python3
"""Review drafts for four remaining episodes; never overwrites ceiling v10."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'build/thumbnails/remaining-drafts'
B='#050505'; G='#D8AF55'; L='#9F742C'; V='#1F7A3A'; W='#F7F4EA'; BLUE='#006BB6'
ITEMS={
 'bottleneck': [('IT ALL','NEEDS YOU'),('BUSY ≠','LOAD-BEARING')],
 'expertise': [('WRITE','IT DOWN'),('ONLY YOU','KNOW HOW?')],
 'boat': [('STILL','SINKING'),('FIX THE','SYSTEM')],
 'triangle': [('TALENT NEEDS','A SYSTEM'),('WHO RUNS IT','WITHOUT YOU?')],
}
def font(n):return ImageFont.truetype(str(ROOT/'assets/fonts/ArchivoBlack-Regular.ttf'),n)
def make(slug,lines):
 im=Image.new('RGBA',(1280,720),B); d=ImageDraw.Draw(im)
 # Same bilateral narrowing motif, concentrated behind the text and portrait.
 for y in range(120,690,18):
  d.line([(0,y),(620,365)],fill=L,width=1)
 # Original approved cutout, proportionate resize only, no face processing.
 cut=Image.open(ROOT/'assets/thumbnails/ceiling-cutout-187s.png').convert('RGBA')
 cut=cut.crop(cut.getbbox()); h=600; cut=cut.resize((round(cut.width*h/cut.height),h),Image.Resampling.LANCZOS)
 x=1280-cut.width+20;y=720-h
 shadow=Image.new('RGBA',im.size,(0,0,0,0)); shadow.alpha_composite(cut,(x-12,y+10))
 shadow=shadow.filter(ImageFilter.GaussianBlur(12)); im.alpha_composite(shadow); im.alpha_composite(cut,(x,y))
 # Original mark, never a generated approximation.
 mark=Image.open(ROOT/'assets/brand/MD-Circle-Transparent.png').convert('RGBA').resize((66,66),Image.Resampling.LANCZOS)
 im.alpha_composite(mark,(30,20)); d=ImageDraw.Draw(im)
 d.text((112,35),'MAIM ACADEMY',font=font(33),fill=G)
 # A dark base under the headline gives a consistent mobile reading surface.
 d.rectangle((24,210,760,555),fill=B)
 for j,line in enumerate(lines):
  size=108
  while d.textlength(line,font=font(size))>714:size-=1
  f=font(size); yy=235+j*145
  d.text((40,yy+4),line,font=f,fill=L,stroke_width=2,stroke_fill=L)
  d.text((38,yy),line,font=f,fill=W,stroke_width=1,stroke_fill=G)
 d.rounded_rectangle((40,570,727,630),radius=12,fill=V,outline=G,width=2)
 d.text((62,582),'ONE IDEA. ONE ASSIGNMENT.',font=font(26),fill=W)
 for xx,col in [(40,V),(90,G),(140,BLUE)]:d.rounded_rectangle((xx,661,xx+43,667),radius=3,fill=col)
 return im.convert('RGB')
def main():
 OUT.mkdir(parents=True,exist_ok=True)
 for slug,variants in ITEMS.items():
  for label,lines in zip(('A','B'),variants):
   im=make(slug,lines);p=OUT/f'maim_yt_{slug}_1280x720_{label}_DRAFT.png';im.save(p)
   im.resize((320,180),Image.Resampling.LANCZOS).save(OUT/f'maim_yt_{slug}_320x180_{label}_DRAFT.png')
 print('Wrote 8 review drafts + mobile previews; ceiling v10 untouched.')
if __name__=='__main__':main()
