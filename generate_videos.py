#!/usr/bin/env python3
"""
VedicMindAI Blog to Video Generator v2
Usage:
  python generate_videos.py VM-001
  python generate_videos.py VM-013:VM-017
  python generate_videos.py VA-001,VA-005,VA-010
  python generate_videos.py --all VA
Output: video_output/ folder (auto-created)
"""
import os,sys,re,subprocess,requests,tempfile,wave,struct,math,array
from pathlib import Path

SURL="https://xlyfyqjmzwyyoqurvuzx.supabase.co"
SKEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM"
W,H,FPS=1080,1920,30
SECS=[3,2,5]
OUT=Path("video_output")
AUD=Path("assets/95bpm_beat.mp3")
WAV=Path("assets/_beat.wav")
NAVY=(10,22,40);BLUE=(30,58,95);SAFFRON=(245,158,11)
WHITE=(255,255,255);CREAM=(248,246,240);PURPLE=(109,40,217);PINK=(219,39,119)

try:
    from PIL import Image,ImageDraw,ImageFont
except ImportError:
    os.system("pip install Pillow -q")
    from PIL import Image,ImageDraw,ImageFont

# ── Audio generator (no external file needed) ─────────────────────────────────
def gen_audio(path,duration=15,bpm=95):
    sr=44100
    n=sr*duration
    data=array.array('h',[0]*n)
    beat=int(sr*60/bpm)
    for i in range(n):
        t=i/sr
        # Melody tone
        v=int(1800*math.sin(2*math.pi*180*t))
        # Kick drum on beat
        bp=i%beat
        if bp<int(sr*0.07):
            dec=1.0-(bp/(sr*0.07))
            v+=int(13000*math.sin(2*math.pi*55*bp/sr)*dec)
        # Hi-hat on offbeat
        offbeat=int(beat/2)
        hp=(i+offbeat//2)%offbeat
        if hp<int(sr*0.015):
            dec2=1.0-(hp/(sr*0.015))
            v+=int(4000*math.sin(2*math.pi*8000*hp/sr)*dec2)
        # Fade in/out
        if i<sr*0.5: v=int(v*i/(sr*0.5))
        if i>n-sr*0.5: v=int(v*(n-i)/(sr*0.5))
        data[i]=max(-32767,min(32767,v))
    Path(path).parent.mkdir(exist_ok=True)
    with wave.open(str(path),'w') as wf:
        wf.setnchannels(1);wf.setsampwidth(2)
        wf.setframerate(sr);wf.writeframes(data.tobytes())
    print(f"    Beat audio generated: {path}")

# ── Font loader ───────────────────────────────────────────────────────────────
def fnt(sz,b=False):
    bold=["C:/Windows/Fonts/calibrib.ttf","C:/Windows/Fonts/arialbd.ttf",
          "C:/Windows/Fonts/ariblk.ttf","C:/Windows/Fonts/verdanab.ttf",
          "C:/Windows/Fonts/Impact.ttf","C:/Windows/Fonts/trebucbd.ttf",
          "C:/Windows/Fonts/georgiab.ttf"]
    reg=["C:/Windows/Fonts/calibri.ttf","C:/Windows/Fonts/arial.ttf",
         "C:/Windows/Fonts/verdana.ttf","C:/Windows/Fonts/tahoma.ttf",
         "C:/Windows/Fonts/georgia.ttf","C:/Windows/Fonts/trebuc.ttf"]
    for p in(bold if b else reg):
        if os.path.exists(p):
            try: return ImageFont.truetype(p,sz)
            except: pass
    try: return ImageFont.load_default(size=max(sz,10))
    except: return ImageFont.load_default()

# ── Gradient helper ───────────────────────────────────────────────────────────
def grad(img,top,bot):
    d=ImageDraw.Draw(img)
    for r in range(img.height):
        t=r/img.height
        d.line([(0,r),(img.width,r)],fill=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)))

# ── Text wrap helper ──────────────────────────────────────────────────────────
def wt(dr,txt,x,y,mw,f,fill,lh=None):
    lh=lh or f.size+16
    ln=""
    for w in txt.split():
        ts=(ln+" "+w).strip()
        bb=dr.textbbox((0,0),ts,font=f)
        if bb[2]-bb[0]>mw and ln:
            dr.text((x,y),ln,font=f,fill=fill);y+=lh;ln=w
        else: ln=ts
    if ln: dr.text((x,y),ln,font=f,fill=fill)
    return y+lh

# ── Content extractor ─────────────────────────────────────────────────────────
def extract(post):
    raw=(post.get("content") or "").replace("\n"," ")
    ss=[s.strip() for s in re.split(r"[.!?]+",raw) if len(s.strip())>20]
    t=post.get("title","")
    hook=t[:55] if len(t)<=55 else (ss[0][:55] if ss else t[:55])
    sub=next((s for s in ss if re.search(r"second|faster|%|times|vs",s,re.I)),
             ss[1] if len(ss)>1 else "")[:65]
    bl=[s[:50] for s in ss if re.search(r":|[0-9]|vedic|faster|exam",s,re.I)][:3]
    while len(bl)<3: bl.append("Learn more at vedicmindai.in")
    return {"hook":hook,"sub":sub,"bullets":bl}

# ── Slide 1: HOOK (Navy gradient) ─────────────────────────────────────────────
def mk_hook(d,cat,sid):
    img=Image.new("RGB",(W,H));grad(img,NAVY,BLUE)
    dr=ImageDraw.Draw(img)
    # Serial badge
    dr.rounded_rectangle([60,75,290,148],radius=18,fill=(50,38,8))
    dr.text((80,88),sid,font=fnt(40,True),fill=SAFFRON)
    # Category
    dr.text((310,90),cat.upper()[:16],font=fnt(36),fill=(160,160,160))
    # Did you know label
    dr.text((80,int(H*0.36)),"DID YOU KNOW?",font=fnt(44,True),fill=(140,140,140))
    # Hook text (large saffron)
    y=wt(dr,d["hook"],80,int(H*0.41),W-160,fnt(int(W*0.074),True),SAFFRON,lh=int(W*0.092))
    # Subtext
    if d["sub"]:
        wt(dr,d["sub"],80,y+20,W-160,fnt(44),(195,195,195),lh=60)
    # Footer
    dr.text((W//2-130,H-108),"VedicMindAI",font=fnt(40,True),fill=(110,110,110))
    return img

# ── Slide 2: PROOF (Cream background) ────────────────────────────────────────
def mk_proof(d,cat,sid):
    img=Image.new("RGB",(W,H),CREAM)
    dr=ImageDraw.Draw(img)
    # Serial chip
    dr.rounded_rectangle([60,78,60+len(sid)*25+22,148],radius=16,fill=NAVY)
    dr.text((78,88),sid,font=fnt(36,True),fill=SAFFRON)
    # Title
    dr.text((80,200),"Here's the truth",font=fnt(74,True),fill=NAVY)
    # Underline
    dr.rectangle([80,292,310,302],fill=SAFFRON)
    # Bullets - NO EMOJI, plain text with colored prefix
    prefixes=["01.","02.","03."]
    for i,bl in enumerate(d["bullets"]):
        by=395+i*232
        dr.rounded_rectangle([60,by,W-60,by+192],radius=18,fill=WHITE)
        # Colored number prefix
        dr.rounded_rectangle([80,by+56,148,by+136],radius=12,fill=NAVY)
        dr.text((92,by+64),prefixes[i],font=fnt(38,True),fill=SAFFRON)
        # Bullet text
        wt(dr,bl[:42],168,by+58,W-240,fnt(48,True),NAVY,lh=58)
    # Footer
    dr.text((W//2-130,H-108),"VedicMindAI",font=fnt(40,True),fill=(140,140,140))
    return img

# ── Slide 3: CTA (Purple to Pink) ────────────────────────────────────────────
def mk_cta(cat,sid):
    img=Image.new("RGB",(W,H));grad(img,PURPLE,PINK)
    dr=ImageDraw.Draw(img)
    # Serial chip top left
    dr.rounded_rectangle([60,78,270,150],radius=16,fill=(255,255,255,55))
    dr.text((78,90),sid,font=fnt(38,True),fill=WHITE)
    # Top label
    dr.text((80,int(H*0.26)),">> TRY IT FREE",font=fnt(48,True),fill=(230,200,255))
    # Main headline lines
    dr.text((80,int(H*0.34)),"Ancient wisdom.",font=fnt(int(W*0.083),True),fill=WHITE)
    dr.text((80,int(H*0.34)+134),"Modern speed.",font=fnt(int(W*0.083),True),fill=(253,230,138))
    # WHITE CTA BOX — guaranteed visible
    by=int(H*0.575)
    dr.rounded_rectangle([65,by,W-65,by+248],radius=26,fill=WHITE)
    # CTA text in purple on white — maximum contrast
    dr.text((W//2-292,by+22),"FREE  DEMO",font=fnt(92,True),fill=PURPLE)
    dr.text((W//2-300,by+144),"vedicmindai.in/demo",font=fnt(56,True),fill=(90,15,110))
    # Divider
    dr.rectangle([120,by+210,W-120,by+213],fill=(200,160,240))
    # Exam boards row
    bx=120; by2=by+222
    for tag in ["CBSE","ICSE","JEE","SSC","CAT"]:
        tw=len(tag)*30+28
        dr.rounded_rectangle([bx,by2,bx+tw,by2+46],radius=10,fill=(200,160,240))
        dr.text((bx+10,by2+7),tag,font=fnt(30,True),fill=PURPLE)
        bx+=tw+16
    # Footer
    dr.text((W//2-148,H-106),"@vedicmindai",font=fnt(44,True),fill=(230,210,255))
    return img

# ── Video builder ─────────────────────────────────────────────────────────────
def build(post):
    d=extract(post)
    sid=post.get("serial_id","???")
    slug=re.sub(r"[^a-zA-Z0-9]+","_",post.get("title","")[:28])
    out=OUT/f"{sid}_{slug}.mp4"
    cat=post.get("category","")
    print(f"  [{sid}] {post.get('title','')[:52]}")
    slides=[mk_hook(d,cat,sid),mk_proof(d,cat,sid),mk_cta(cat,sid)]
    with tempfile.TemporaryDirectory() as tmp:
        n=0
        for img,sec in zip(slides,SECS):
            for _ in range(sec*FPS):
                img.save(os.path.join(tmp,f"f{n:05d}.png"));n+=1
        print(f"    {n} frames rendered — encoding...")
        cmd=["ffmpeg","-y","-framerate",str(FPS),"-i",os.path.join(tmp,"f%05d.png")]
        # Audio: use mp3 if available, else generate wav
        if AUD.exists():
            cmd+=["-i",str(AUD),"-c:a","aac","-shortest"]
        else:
            if not WAV.exists():
                print("    Generating 95BPM beat...")
                gen_audio(WAV,duration=15)
            cmd+=["-i",str(WAV),"-c:a","aac","-shortest"]
        cmd+=["-c:v","libx264","-pix_fmt","yuv420p","-preset","fast",str(out)]
        r=subprocess.run(cmd,capture_output=True,text=True)
        if r.returncode!=0:
            print(f"    FFmpeg error: {r.stderr[-200:]}")
            return False
    sz=os.path.getsize(out)/1024/1024
    print(f"    Saved: {out.name} ({sz:.1f} MB)")
    return True

# ── Supabase helpers ──────────────────────────────────────────────────────────
def sb(path):
    h={"apikey":SKEY,"Authorization":f"Bearer {SKEY}"}
    return requests.get(SURL+path,headers=h).json()

def fetch(ids):
    q=",".join(f'"{x}"' for x in ids)
    return sb(f"/rest/v1/blog_posts?serial_id=in.({q})&select=*")

def fetch_range(c,s,e):
    return sb(f"/rest/v1/blog_posts?cat_code=eq.{c}&cat_num=gte.{s}&cat_num=lte.{e}&select=*&order=cat_num.asc")

def fetch_all(c):
    return sb(f"/rest/v1/blog_posts?cat_code=eq.{c}&select=*&order=cat_num.asc")

# ── Argument parser ───────────────────────────────────────────────────────────
def parse(args):
    if not args: print(__doc__);sys.exit(0)
    a=" ".join(args)
    if "--all" in a:
        code=a.split()[-1].upper()
        print(f"Fetching ALL {code} articles...")
        return fetch_all(code)
    m=re.match(r"([A-Z]+)-(\d+):([A-Z]+)-(\d+)",a.strip())
    if m:
        c,s,e=m.group(1),int(m.group(2)),int(m.group(4))
        print(f"Fetching {c}-{s:03d} to {c}-{e:03d}...")
        return fetch_range(c,s,e)
    if "," in a:
        ids=[x.strip().upper() for x in a.split(",")]
        print(f"Fetching {len(ids)} articles...")
        return fetch(ids)
    sid=a.strip().upper()
    print(f"Fetching {sid}...")
    return fetch([sid])

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__=="__main__":
    OUT.mkdir(exist_ok=True)
    posts=parse(sys.argv[1:])
    if not posts or isinstance(posts,dict):
        print("No articles found.");sys.exit(1)
    print(f"\nGenerating {len(posts)} video(s)...\n")
    ok=fail=0
    for p in posts:
        if build(p): ok+=1
        else: fail+=1
    print(f"\nDone: {ok} generated, {fail} failed")
    print(f"Folder: {OUT.absolute()}")
