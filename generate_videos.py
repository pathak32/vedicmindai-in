#!/usr/bin/env python3
"""
VedicMindAI Blog to Video Generator v3
Usage:
  python generate_videos.py VM-001
  python generate_videos.py VM-013:VM-017
  python generate_videos.py VA-001,VA-005,VA-010
  python generate_videos.py --all VA
Output: video_output/ folder (auto-created)
"""
import os,sys,re,subprocess,requests,tempfile,wave,math,array
from pathlib import Path

SURL="https://xlyfyqjmzwyyoqurvuzx.supabase.co"
SKEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM"
W,H,FPS=1080,1920,30
SECS=[3,4,5]
OUT=Path("video_output")
AUD=Path("assets/95bpm_beat.mp3")
WAV=Path("assets/_beat_v3.wav")
NAVY=(10,22,40);BLUE=(30,58,95);SAFFRON=(245,158,11)
WHITE=(255,255,255);CREAM=(248,246,240);PURPLE=(109,40,217);PINK=(219,39,119)

try:
    from PIL import Image,ImageDraw,ImageFont
except ImportError:
    os.system("pip install Pillow -q")
    from PIL import Image,ImageDraw,ImageFont

# ── HOOK QUESTION ENGINE ──────────────────────────────────────────────────────
def make_hook_question(post):
    """Generate a curiosity-gap question hook based on article type."""
    title = post.get("title","").lower()
    cat   = post.get("category","").lower()
    sub   = (post.get("subcategory") or "").lower()

    # Template 1: Abacus vs Vedic comparison
    if "abacus" in title or "abacus" in sub:
        if "class 5" in title or "retention" in title:
            return "Did you know abacus training\nbecomes useless after Class 5?"
        if "cost" in title or "price" in title or "lakh" in title:
            return "Are you paying lakhs for\nabacus when this costs less?"
        if "algebra" in title or "struggle" in title:
            return "Why do abacus students\nstruggle in Class 8 algebra?"
        return "Is your child learning the\nwrong maths tool for their future?"

    # Template 2: Speed / Calculation tricks
    if any(w in title for w in ["trick","fast","second","instant","quick","multiply","speed"]):
        nums = re.findall(r"\d+",title)
        if nums:
            return f"Can your child calculate\n{nums[0]}x faster than classmates?"
        return "What if maths calculations\ntook 5 seconds instead of 50?"

    # Template 3: Exam specific
    if any(w in title for w in ["jee","ssc","cat","upsc","ntse","bank","clat","nda","cgl"]):
        exam = next((w.upper() for w in ["JEE","SSC","CAT","UPSC","NTSE","NDA","CLAT"] if w.lower() in title),"Exam")
        return f"Are {exam} toppers using\na calculation secret you don't know?"

    # Template 4: Parent / Child decisions
    if any(w in title for w in ["parent","child","kid","school","class","student","your"]):
        return "Are you making the right\nmaths decision for your child?"

    # Template 5: Myth busting
    if any(w in title for w in ["myth","wrong","real","truth","lie","actually","honest"]):
        return "What if everything you believed\nabout maths speed training is wrong?"

    # Template 6: Time / Age specific
    if any(w in title for w in ["class 3","class 4","class 5","class 6","age","year","late"]):
        return "What is the right age to start\nVedic Maths for maximum impact?"

    # Template 7: Reasoning / Aptitude
    if cat == "reasoning":
        return "Can you solve this logical puzzle\nin under 10 seconds?"
    if cat == "aptitude":
        return "Are you leaving marks on the\ntable in every aptitude exam?"

    # Default — curiosity gap
    return "What ancient Indian secret\nare top rankers using right now?"


def make_proof_points(post, d):
    """Generate 3 punchy proof bullets from article content."""
    raw  = (post.get("content") or "").replace("\n"," ")
    title = post.get("title","")
    ss   = [s.strip() for s in re.split(r"[.!?]+",raw) if 25<len(s.strip())<90]

    # Priority: sentences with numbers, comparisons, or strong claims
    priority = [s for s in ss if re.search(
        r"\d+|faster|slower|never|always|every|most|best|worst|can|cannot|without",s,re.I)]

    bullets = []
    used = set()
    for s in priority:
        key = s[:20]
        if key not in used and len(bullets)<3:
            clean = s.strip().rstrip(".,;")
            # Ensure it ends properly
            if len(clean)>52: clean = clean[:50]+"..."
            bullets.append(clean)
            used.add(key)

    # Fill remaining slots with general sentences
    for s in ss:
        if len(bullets)>=3: break
        key = s[:20]
        if key not in used:
            clean = s.strip().rstrip(".,;")
            if len(clean)>52: clean = clean[:50]+"..."
            bullets.append(clean)
            used.add(key)

    # Guarantee 3 bullets
    defaults = [
        "Vedic Maths works from Class 3 to JEE level",
        "Used by toppers in SSC, CAT and UPSC",
        "Learn free at vedicmindai.in/demo",
    ]
    while len(bullets)<3:
        bullets.append(defaults[len(bullets)])

    return bullets[:3]


def extract(post):
    """Full content extraction with question hook."""
    raw  = (post.get("content") or "").replace("\n"," ")
    ss   = [s.strip() for s in re.split(r"[.!?]+",raw) if len(s.strip())>20]
    hook = make_hook_question(post)
    sub  = next((s for s in ss if 20<len(s)<85 and re.search(
                 r"second|faster|class|student|exam|method|technique",s,re.I)),
                ss[0][:80] if ss else "")[:80]
    d    = {"hook":hook,"sub":sub,"bullets":[]}
    d["bullets"] = make_proof_points(post, d)
    return d


# ── 3-PART AUDIO ENGINE ───────────────────────────────────────────────────────
def gen_3part_audio(path, s1=3, s2=2, s3=5):
    """
    Generate 3-part 95BPM beat synced to slides:
      Part 1 (s1 sec): HIGH ENERGY — heavy bass kick, 128BPM, scroll-stopper
      Part 2 (s2 sec): INFORMATIONAL — steady mid-tone, 90BPM, trust-building
      Part 3 (s3 sec): MELODIOUS — warm melody, 75BPM, action-driving
    """
    sr = 44100
    total = (s1+s2+s3)*sr
    data  = array.array('h',[0]*total)

    def clamp(v): return max(-32767,min(32767,int(v)))
    def sine(freq,t):   return math.sin(2*math.pi*freq*t)
    def decay(pos,dur): return max(0.0, 1.0-(pos/dur))
    def fade(i,total,fade_s=0.4):
        fi=int(sr*fade_s)
        if i<fi:   return i/fi
        if i>total-fi: return (total-i)/fi
        return 1.0

    # ── PART 1: ATTENTION HOOK — smooth rising energy ────────────────────────
    bpm1=105; beat1=int(sr*60/bpm1)
    for i in range(s1*sr):
        t=i/sr; v=0; bp=i%beat1
        # Moderate kick — punchy not harsh
        if bp<int(sr*0.05):
            v+=clamp(18000*sine(65,bp/sr)*decay(bp,int(sr*0.05)))
        # Soft snare on offbeat
        eighth=beat1//2; sp=i%eighth
        if sp<int(sr*0.02) and (i//eighth)%2==1:
            v+=clamp(5000*sine(200,sp/sr)*decay(sp,int(sr*0.02)))
        # Rising build tone -- creates anticipation
        rise_freq=150+int(i*(250/(s1*sr)))
        v+=clamp(3500*sine(rise_freq,t)*(i/(s1*sr)))
        # Warm bass pulse
        v+=clamp(5000*sine(82,t)*0.6)
        # Bright chime on beat 1
        if bp<int(sr*0.03):
            v+=clamp(8000*sine(660,bp/sr)*decay(bp,int(sr*0.03)))
        data[i]=clamp(v*fade(i,s1*sr))

    # ── PART 2: INFORMATIONAL PROOF (s1*sr to (s1+s2)*sr) ──────────────────
    start2=s1*sr; bpm2=90; beat2=int(sr*60/bpm2)
    for j in range(s2*sr):
        i=start2+j; t=j/sr
        v=0
        bp=j%beat2
        # Softer kick
        if bp<int(sr*0.04):
            v+=clamp(14000*sine(70,bp/sr)*decay(bp,int(sr*0.04)))
        # Steady mid pulse — 150Hz
        v+=clamp(3500*sine(150,t))
        # Chord stabs — E minor feel
        for freq in [164,196,246]:
            chord_pos=j%int(beat2*2)
            if chord_pos<int(sr*0.08):
                v+=clamp(1800*sine(freq,t)*decay(chord_pos,int(sr*0.08)))
        # Soft hi-hat
        eighth2=beat2//2
        hp2=j%eighth2
        if hp2<int(sr*0.01):
            v+=clamp(2500*sine(5000,hp2/sr)*decay(hp2,int(sr*0.01)))
        data[i]=clamp(v*fade(j,s2*sr,0.2))

    # ── PART 3: MELODIOUS CTA (s1+s2)*sr onwards ──────────────────────────
    start3=(s1+s2)*sr; bpm3=75; beat3=int(sr*60/bpm3)
    # Simple pentatonic melody pattern (D major pentatonic)
    melody=[293,329,370,440,493,440,370,329]  # D E F# A B A F# E
    note_len=beat3//2
    for j in range(s3*sr):
        i=start3+j; t=j/sr
        v=0
        bp=j%beat3
        # Gentle kick
        if bp<int(sr*0.03):
            v+=clamp(10000*sine(80,bp/sr)*decay(bp,int(sr*0.03)))
        # Warm bass 82Hz
        v+=clamp(4500*sine(82,t))
        # Melody notes
        note_idx=(j//note_len)%len(melody)
        freq=melody[note_idx]
        note_pos=j%note_len
        env=decay(note_pos,note_len)*0.8+0.2
        v+=clamp(8000*sine(freq,t)*env)
        # Harmony (third above)
        v+=clamp(4000*sine(freq*1.26,t)*env*0.6)
        # Soft pad — warm shimmer
        v+=clamp(2000*sine(freq*2,t)*env*0.4)
        # Bells on beat 1
        if bp<int(sr*0.05):
            bell_dec=decay(bp,int(sr*0.05))
            v+=clamp(6000*sine(880,bp/sr)*bell_dec)
        data[i]=clamp(v*fade(j,s3*sr,0.5))

    Path(path).parent.mkdir(exist_ok=True)
    with wave.open(str(path),'w') as wf:
        wf.setnchannels(1);wf.setsampwidth(2)
        wf.setframerate(sr);wf.writeframes(data.tobytes())
    print(f"    3-part audio generated ({s1}s hook + {s2}s proof + {s3}s CTA)")


# ── FONT LOADER ───────────────────────────────────────────────────────────────
def fnt(sz,b=False):
    bold=["C:/Windows/Fonts/calibrib.ttf","C:/Windows/Fonts/arialbd.ttf",
          "C:/Windows/Fonts/ariblk.ttf","C:/Windows/Fonts/verdanab.ttf",
          "C:/Windows/Fonts/Impact.ttf","C:/Windows/Fonts/trebucbd.ttf"]
    reg=["C:/Windows/Fonts/calibri.ttf","C:/Windows/Fonts/arial.ttf",
         "C:/Windows/Fonts/verdana.ttf","C:/Windows/Fonts/tahoma.ttf",
         "C:/Windows/Fonts/georgia.ttf"]
    for p in(bold if b else reg):
        if os.path.exists(p):
            try: return ImageFont.truetype(p,sz)
            except: pass
    try: return ImageFont.load_default(size=max(sz,10))
    except: return ImageFont.load_default()


# ── DRAW HELPERS ──────────────────────────────────────────────────────────────
def grad(img,top,bot):
    d=ImageDraw.Draw(img)
    for r in range(img.height):
        t=r/img.height
        d.line([(0,r),(img.width,r)],fill=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)))

def wt(dr,txt,x,y,mw,f,fill,lh=None):
    lh=lh or f.size+18
    ln=""
    for w in txt.split():
        ts=(ln+" "+w).strip()
        bb=dr.textbbox((0,0),ts,font=f)
        if bb[2]-bb[0]>mw and ln:
            dr.text((x,y),ln,font=f,fill=fill);y+=lh;ln=w
        else: ln=ts
    if ln: dr.text((x,y),ln,font=f,fill=fill)
    return y+lh


# ── SLIDE 1: HOOK ─────────────────────────────────────────────────────────────
def mk_hook(d,cat,sid):
    img=Image.new("RGB",(W,H));grad(img,NAVY,BLUE)
    dr=ImageDraw.Draw(img)

    # Serial + category chips
    dr.rounded_rectangle([60,72,292,148],radius=18,fill=(55,40,8))
    dr.text((80,85),sid,font=fnt(42,True),fill=SAFFRON)
    dr.text((315,88),cat.upper()[:14],font=fnt(36),fill=(155,155,155))

    # Question label
    dr.text((80,int(H*0.28)),"ASK YOURSELF:",font=fnt(40,True),fill=(130,130,130))

    # Hook question — always has "?" — large, saffron
    hook_lines = d["hook"].split("\n")
    y = int(H*0.33)
    for line in hook_lines:
        fsz = int(W*0.076) if len(line)<28 else int(W*0.062) if len(line)<38 else int(W*0.052)
        y = wt(dr,line,80,y,W-160,fnt(fsz,True),SAFFRON,lh=int(fsz*1.22))
    y += 18

    # Divider line
    dr.rectangle([80,y,W-80,y+4],fill=(245,158,11,80))
    y += 28

    # Subtext — first content sentence
    if d["sub"] and y < int(H*0.76):
        y = wt(dr,d["sub"],80,y,W-160,fnt(44),(190,190,190),lh=58)

    # "Full answer in our blog" prompt
    if y < int(H*0.85):
        dr.text((80,int(H*0.86)),"Full answer at vedicmindai.in",font=fnt(36),fill=(100,130,180))

    # Footer
    dr.text((W//2-130,H-100),"VedicMindAI",font=fnt(40,True),fill=(100,100,100))
    return img


# ── SLIDE 2: PROOF ────────────────────────────────────────────────────────────
def mk_proof(d,cat,sid):
    img=Image.new("RGB",(W,H),CREAM)
    dr=ImageDraw.Draw(img)

    # Serial chip
    cw=len(sid)*25+32
    dr.rounded_rectangle([60,72,60+cw,148],radius=16,fill=NAVY)
    dr.text((78,85),sid,font=fnt(38,True),fill=SAFFRON)

    # Title
    dr.text((80,195),"Here's the truth",font=fnt(76,True),fill=NAVY)
    dr.rectangle([80,290,320,300],fill=SAFFRON)

    # 3 Bullets with colored number prefix
    colors=[(10,22,40),(20,80,150),(80,40,150)]
    for i,bl in enumerate(d["bullets"]):
        by=390+i*240
        dr.rounded_rectangle([58,by,W-58,by+200],radius=18,fill=WHITE)
        # Number badge
        dr.rounded_rectangle([78,by+58,148,by+142],radius=12,fill=colors[i])
        num=str(i+1)
        nbb=dr.textbbox((0,0),num,font=fnt(46,True))
        nx=78+(70-(nbb[2]-nbb[0]))//2
        ny=by+58+(84-(nbb[3]-nbb[1]))//2
        dr.text((nx,ny),num,font=fnt(46,True),fill=SAFFRON)
        # Bullet text
        wt(dr,bl[:44],170,by+68,W-250,fnt(46,True),NAVY,lh=56)

    dr.text((W//2-130,H-100),"VedicMindAI",font=fnt(40,True),fill=(140,140,140))
    return img


# ── SLIDE 3: CTA ──────────────────────────────────────────────────────────────
def mk_cta(cat,sid):
    img=Image.new("RGB",(W,H));grad(img,PURPLE,PINK)
    dr=ImageDraw.Draw(img)

    # Serial chip — DARK bg so text visible
    dr.rounded_rectangle([60,72,272,148],radius=16,fill=(38,8,65))
    dr.text((78,85),sid,font=fnt(38,True),fill=SAFFRON)

    # Category chip
    dr.rounded_rectangle([290,72,290+len(cat)*22+20,148],radius=16,fill=(60,10,90))
    dr.text((305,85),cat.upper()[:14],font=fnt(28,True),fill=(200,180,240))

    # Prompt line
    dr.text((80,int(H*0.25)),"Your next step is simple:",font=fnt(46,True),fill=(230,210,255))

    # Main text
    dr.text((80,int(H*0.32)),"Ancient wisdom.",font=fnt(int(W*0.085),True),fill=WHITE)
    dr.text((80,int(H*0.32)+140),"Modern speed.",font=fnt(int(W*0.085),True),fill=(253,230,138))
    dr.text((80,int(H*0.32)+280),"Proven results.",font=fnt(int(W*0.065),True),fill=(220,200,255))

    # WHITE CTA BOX
    by=int(H*0.60)
    dr.rounded_rectangle([62,by,W-62,by+268],radius=26,fill=WHITE)
    # Main CTA text in purple
    dr.text((W//2-310,by+20),"FREE  DEMO",font=fnt(96,True),fill=PURPLE)
    # Subtext
    dr.text((W//2-295,by+148),"vedicmindai.in/demo",font=fnt(56,True),fill=(80,10,110))
    # Divider
    dr.rectangle([110,by+222,W-110,by+226],fill=(200,160,240))
    # Exam tags
    bx=115; by2=by+234
    for tag in ["CBSE","ICSE","JEE","SSC","CAT"]:
        tw=len(tag)*29+26
        dr.rounded_rectangle([bx,by2,bx+tw,by2+46],radius=10,fill=(210,170,248))
        dr.text((bx+9,by2+7),tag,font=fnt(29,True),fill=PURPLE)
        bx+=tw+14

    # Footer
    dr.text((W//2-148,H-85),"@vedicmindai",font=fnt(44,True),fill=(230,210,255))
    return img


# ── VIDEO BUILDER ─────────────────────────────────────────────────────────────
def build(post):
    d=extract(post)
    sid=post.get("serial_id","???")
    slug=re.sub(r"[^a-zA-Z0-9]+","_",post.get("title","")[:28])
    out=OUT/f"{sid}_{slug}.mp4"
    cat=post.get("category","")
    print(f"  [{sid}] {post.get('title','')[:54]}")
    print(f"  Hook: {d['hook'][:60].replace(chr(10),' ')}")
    slides=[mk_hook(d,cat,sid),mk_proof(d,cat,sid),mk_cta(cat,sid)]
    with tempfile.TemporaryDirectory() as tmp:
        n=0
        for img,sec in zip(slides,SECS):
            for _ in range(sec*FPS):
                img.save(os.path.join(tmp,f"f{n:05d}.png"));n+=1
        print(f"  {n} frames rendered — encoding...")
        cmd=["ffmpeg","-y","-framerate",str(FPS),"-i",os.path.join(tmp,"f%05d.png")]
        if AUD.exists():
            cmd+=["-i",str(AUD),"-c:a","aac","-shortest"]
        else:
            if not WAV.exists():
                print("  Generating 3-part beat audio...")
                gen_3part_audio(WAV,s1=SECS[0],s2=SECS[1],s3=SECS[2])
            cmd+=["-i",str(WAV),"-c:a","aac","-shortest"]
        cmd+=["-c:v","libx264","-pix_fmt","yuv420p","-preset","fast",str(out)]
        r=subprocess.run(cmd,capture_output=True,text=True)
        if r.returncode!=0:
            print(f"  FFmpeg error: {r.stderr[-200:]}")
            return False
    sz=os.path.getsize(out)/1024/1024
    print(f"  Saved: {out.name} ({sz:.1f} MB)\n")
    return True


# ── SUPABASE ──────────────────────────────────────────────────────────────────
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

def parse(args):
    if not args: print(__doc__);sys.exit(0)
    a=" ".join(args)
    if "--all" in a:
        code=a.split()[-1].upper()
        print(f"Fetching ALL {code} articles...");return fetch_all(code)
    m=re.match(r"([A-Z]+)-(\d+):([A-Z]+)-(\d+)",a.strip())
    if m:
        c,s,e=m.group(1),int(m.group(2)),int(m.group(4))
        print(f"Fetching {c}-{s:03d} to {c}-{e:03d}...");return fetch_range(c,s,e)
    if "," in a:
        ids=[x.strip().upper() for x in a.split(",")]
        print(f"Fetching {len(ids)} articles...");return fetch(ids)
    sid=a.strip().upper()
    print(f"Fetching {sid}...");return fetch([sid])


# ── MAIN ──────────────────────────────────────────────────────────────────────
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
    print(f"Done: {ok} generated, {fail} failed")
    print(f"Folder: {OUT.absolute()}")
