"""Build the Kiez Notes submission video from saved slides, captures and narration.
Run with Python, Pillow and imageio-ffmpeg. Does not call any provider or modify app data.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import json, subprocess, wave, math, textwrap
import imageio_ffmpeg

ASSETS=Path(__file__).resolve().parent
OUT=ASSETS.parent/'Kiez_Notes_Project_Video.mp4'
WORK=Path('/private/tmp/kiez-video/render')
WORK.mkdir(parents=True,exist_ok=True)
FF=imageio_ffmpeg.get_ffmpeg_exe()
PAPER='#f7f5ef'; INK='#303b33'; GREEN='#455840'; MUTED='#737d68'; ACCENT='#ac694f'; LINE='#d4d9ca'
FONTS=Path('/System/Library/Fonts/Supplemental')
def font(size,bold=False,serif=False):
 return ImageFont.truetype(str(FONTS/('Georgia.ttf' if serif else 'Arial Bold.ttf' if bold else 'Arial.ttf')),size)
def run(args):
 r=subprocess.run([FF,'-hide_banner','-loglevel','error','-y',*args],capture_output=True,text=True)
 if r.returncode: raise RuntimeError(r.stderr[-3000:])
def wrap(text,max_width,f):
 lines=[];line=''
 for w in text.split():
  candidate=(line+' '+w).strip()
  if f.getlength(candidate)>max_width and line:lines.append(line);line=w
  else:line=candidate
 if line:lines.append(line)
 return lines

def fit(im,box):
 x,y,w,h=box
 scaled=ImageOps.contain(im,(w,h),Image.Resampling.LANCZOS)
 return scaled,(x+(w-scaled.width)//2,y+(h-scaled.height)//2)
def place(canvas,path,box):
 im=Image.open(path).convert('RGB');im,pos=fit(im,box);canvas.paste(im,pos)

clips=json.loads((ASSETS/'narration.json').read_text())
chapters=['New narratives','Find a place','The latest note','Shared memory','Across languages','Explore the project']
# Each visual uses a true slide or a labeled read-only website capture.
visuals={1:('slide-1.png','slide'),2:('slide-1.png','slide'),3:('website-map.png','map'),4:('website-diary.png','diary'),5:('slide-2.png','slide'),6:('website-note.png','note'),7:('slide-2.png','slide'),8:('slide-3.png','slide'),9:('website-chronicle-full.png','chronicle'),10:('website-archive.png','archive'),11:('slide-4.png','slide'),12:('slide-4.png','slide'),13:('website-controls.png','controls'),14:('slide-4.png','slide'),15:('slide-5.png','slide'),16:('slide-5.png','slide'),17:('slide-5.png','slide')}

# Normalize existing audio and remove excessive leading/trailing silence.
for c in clips:
 p=WORK/f"audio-{c['id']:02d}.wav"
 if not p.exists():
  run(['-i',str(ASSETS/c['file']),'-af','silenceremove=start_periods=1:start_duration=0.04:start_threshold=-48dB:start_silence=0.1,areverse,silenceremove=start_periods=1:start_duration=0.04:start_threshold=-48dB:start_silence=0.15,areverse,loudnorm=I=-16:TP=-1.5:LRA=7','-ar','24000','-ac','1',str(p)])
 with wave.open(str(p)) as w: c['audio_duration']=w.getnframes()/w.getframerate()
 c['duration']=math.ceil((c['audio_duration']+(4 if c['id']==17 else .25))*24)/24
 c['audio_path']=str(p)
 assert c['audio_duration']>1, c

total=sum(c['duration'] for c in clips)
assert total<180,f'Video too long: {total:.2f}'
print(f'Total duration: {total:.2f}s',flush=True)

avatar=Image.open(ASSETS/'presenter.png').convert('RGB').resize((166,166),Image.Resampling.LANCZOS)
elapsed=0
srt=[]
def timestamp(s):
 ms=round(s*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);sec,ms=divmod(ms,1000)
 return f'{h:02d}:{m:02d}:{sec:02d},{ms:03d}'

for c in clips:
 n=c['id'];scene=c['scene'];asset,kind=visuals[n]
 frame=Image.new('RGB',(1280,720),PAPER);d=ImageDraw.Draw(frame)
 # Consistent presenter panel, separate from slide and caption content.
 d.line((1080,35,1080,610),fill=LINE,width=1)
 d.text((1102,47),'Kiez Notes.',font=font(20,serif=True),fill=INK)
 frame.paste(avatar,(1098,118))
 d.text((1131,303),'AI narrator',font=font(15),fill=MUTED)
 d.text((1102,405),f'{scene:02d} / 06',font=font(14,bold=True),fill=ACCENT)
 y=437
 for line in wrap(chapters[scene-1],150,font(21,serif=True)):
  d.text((1102,y),line,font=font(21,serif=True),fill=INK);y+=28
 d.text((1102,572),'Every place',font=font(14),fill=MUTED)
 d.text((1102,592),'has a story.',font=font(14),fill=MUTED)

 if kind=='slide':
  place(frame,ASSETS/asset,(18,23,1048,589))
 else:
  titles={'map':'Discover a neighborhood','diary':'A shared page for the present','note':'Only today’s latest note is visible','chronicle':'One day. Different voices. A shared narrative.','archive':'Past days live in the archive','controls':'Read and listen across languages'}
  d.text((42,28),titles[kind],font=font(29,serif=True),fill=INK)
  d.text((43,68),'WEBSITE CAPTURE  /  KIEZ-TEN.VERCEL.APP',font=font(11,bold=True),fill=MUTED)
  if kind=='map':
   place(frame,ASSETS/asset,(26,99,1038,490))
   d.text((43,604),'Illustrative areas · Fictional demo notes · Map © OpenStreetMap contributors',font=font(12),fill=MUTED)
  elif kind=='diary':
   im=Image.open(ASSETS/asset).convert('RGB')
   # Preserve the actual page, focusing on neighborhood and latest contribution.
   im=im.crop((140,210,2420,1440));im,pos=fit(im,(30,97,1034,506));frame.paste(im,pos)
   d.text((43,604),'Current website · Demo moment',font=font(12),fill=MUTED)
  elif kind=='note':
   place(frame,ASSETS/asset,(100,112,886,424))
   d.text((100,566),'New note → visible moment replaced → earlier notes retained',font=font(21),fill=INK)
   d.text((100,601),'Website capture · Fictional demo note',font=font(12),fill=MUTED)
  elif kind=='chronicle':
   im=Image.open(ASSETS/asset).convert('RGB')
   # Crop into the actual prose, with external fixture label retained below.
   im=im.crop((55,600,im.width-55,min(im.height,1440)))
   im,pos=fit(im,(52,119,972,438));frame.paste(im,pos)
   d.text((43,596),'Editorial demo Chronicle · “I” is the neighborhood',font=font(14),fill=MUTED)
  elif kind=='archive':
   im=Image.open(ASSETS/asset).convert('RGB').crop((230,180,2350,1540));im,pos=fit(im,(40,99,1008,492));frame.paste(im,pos)
   d.text((43,604),'Website capture · Labeled editorial demo stories',font=font(12),fill=MUTED)
  elif kind=='controls':
   d.text((60,138),'People don’t need to share a language',font=font(39,serif=True),fill=INK)
   d.text((60,189),'to share a place.',font=font(39,serif=True),fill=GREEN)
   place(frame,ASSETS/asset,(82,293,929,104))
   d.text((70,440),'English   ·   Deutsch   ·   Türkçe   ·   Arabic   ·   Español',font=font(22),fill=GREEN)
   d.text((70,510),'Original text preserved. Translation and speech on demand.',font=font(21),fill=INK)
   d.text((70,581),'Controls captured from the live Chronicle page',font=font(13),fill=MUTED)
 # Caption band; no text is placed over the slide.
 d.rectangle((0,635,1280,720),fill=GREEN)
 cf=font(23)
 lines=wrap(c['text'],1180,cf)
 assert len(lines)<=2,(n,lines)
 y=648 if len(lines)==2 else 663
 for line in lines:
  d.text(((1280-cf.getlength(line))/2,y),line,font=cf,fill='#fffdf3');y+=29
 d.rectangle((0,632,int(1280*(elapsed+c['duration'])/total),635),fill=ACCENT)
 png=WORK/f'frame-{n:02d}.png';frame.save(png)
 srt.append(f"{n}\n{timestamp(elapsed)} --> {timestamp(elapsed+c['audio_duration'])}\n"+'\n'.join(lines)+'\n')
 video=WORK/f'clip-{n:02d}.mp4'
 # A small waveform is driven by the actual narration; the avatar stays static.
 fadeout=c['duration']-.16
 fades=('fade=t=in:st=0:d=0.25,' if n==1 else '')+(f'fade=t=out:st={fadeout:.4f}:d=0.16,' if n==17 else '')
 graph=f"[1:a]apad,asplit=2[voice][wave];[wave]showwaves=s=148x36:mode=cline:colors=0xac694f:r=24,format=rgba[w];[0:v][w]overlay=1106:346:shortest=1,{fades}format=yuv420p[v]"
 run(['-loop','1','-framerate','24','-i',str(png),'-i',c['audio_path'],'-filter_complex',graph,'-map','[v]','-map','[voice]','-t',f"{c['duration']:.6f}",'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-ar','48000','-ac','1','-movflags','+faststart',str(video)])
 elapsed+=c['duration']
 print(f'Rendered {n:02d}/17',flush=True)

concat=WORK/'concat.txt'
concat.write_text('\n'.join(f"file '{WORK}/clip-{c['id']:02d}.mp4'" for c in clips))
# Encode one continuous audio stream so independent AAC encoder delays cannot
# introduce timestamp overlaps at clip boundaries.
master=WORK/'narration-master.wav'
with wave.open(str(master),'wb') as out:
 out.setnchannels(1);out.setsampwidth(2);out.setframerate(24000)
 for c in clips:
  with wave.open(c['audio_path'],'rb') as source:
   data=source.readframes(source.getnframes())
  target=round(c['duration']*24000)*2
  assert len(data)<=target
  out.writeframes(data+b'\x00'*(target-len(data)))
run(['-f','concat','-safe','0','-i',str(concat),'-i',str(master),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','96k','-ar','48000','-ac','1','-movflags','+faststart','-t',f'{total:.6f}',str(OUT)])
(ASSETS/'captions.srt').write_text('\n'.join(srt))
(ASSETS/'timeline.json').write_text(json.dumps({'duration':total,'clips':clips},indent=2))
print(f'Saved {OUT} ({OUT.stat().st_size/1000000:.2f} MB)',flush=True)
