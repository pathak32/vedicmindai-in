#!/usr/bin/env python3
"""
VedicMindAI — Blog to Video Generator
Usage:
  python generate_videos.py VM-001:VM-010     # range
  python generate_videos.py VA-001,VA-005,VA-010  # specific
  python generate_videos.py VM-013            # single
  python generate_videos.py --all VM          # all Vedic Maths
  python generate_videos.py --all VA          # all Vedic vs Abacus

Requirements:
  pip install Pillow requests python-dotenv
  FFmpeg must be installed (https://ffmpeg.org/download.html)

Output: ./video_output/<serial_id>_<title>.mp4
"""

import os, sys, json, re, math, subprocess, textwrap, requests
from pathlib import Path
from datetime import datetime

# ── Config ────────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://xlyfyqjmzwyyoqurvuzx.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM"

W, H     = 1080, 1920          # 9:16 vertical
FPS      = 30
SLIDE_TIMES = [3, 2, 5]        # seconds per slide
TOTAL_S  = sum(SLIDE_TIMES)    # 10s

# Colors
NAVY    = (10, 22, 40)
BLUE    = (30, 58, 95)
SAFFRON = (245, 158, 11)
WHITE   = (255, 255, 255)
CREAM   = (248, 246, 240)
PURPLE  = (109, 40, 217)
PINK    = (219, 39, 119)

OUTPUT_DIR = Path("video_output")
AUDIO_FILE = Path("assets/95bpm_beat.mp3")  # your existing audio file

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Install Pillow: pip install Pillow")
    sys.exit(1)

# ── Supabase helpers ──────────────────────────────────────────────────────────
def fetch_articles(serial_ids):
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    ids_str = ",".join(f'"{s}"' for s in serial_ids)
    url = f"{SUPABASE_URL}/rest/v1/blog_posts?serial_id=in.({ids_str})&select=id,title,slug,category,subcategory,content,serial_id,cat_code,cat_num"
    r = requests.get(url, headers=headers)
    return r.json()

def fetch_range(code, start, end):
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    url = (f"{SUPABASE_URL}/rest/v1/blog_posts"
           f"?cat_code=eq.{code}&cat_num=gte.{start}&cat_num=lte.{end}"
           f"&select=id,title,slug,category,subcategory,content,serial_id,cat_code,cat_num"
           f"&order=cat_num.asc")
    r = requests.get(url, headers=headers)
    return r.json()

def fetch_all_in_code(code):
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    url = (f"{SUPABASE_URL}/rest/v1/blog_posts"
           f"?cat_code=eq.{code}"
           f"&select=id,title,slug,category,subcategory,content,serial_id,cat_code,cat_num"
           f"&order=cat_num.asc")
    r = requests.get(url, headers=headers)
    return r.json()

# ── Content extraction ────────────────────────────────────────────────────────
def extract_data(post):
    raw = (post.get("content") or "").replace("\n", " ")
    sentences = [s.strip() for s in re.split(r"[.!?]+", raw) if len(s.strip()) > 20]
    title = post.get("title", "")
    hook = title if len(title) < 55 else (sentences[0] if sentences else title)
    hook_sub = next((s for s in sentences if re.search(r"second|faster|%|times|vs", s, re.I)), sentences[1] if len(sentences)>1 else "")
    icons = ["⚡", "✅", "🎯"]
    bullets = [s[:52]+"…" if len(s)>52 else s
               for s in sentences if re.search(r":|[0-9]|vedic|faster|exam", s, re.I)][:3]
    while len(bullets) < 3: bullets.append("Learn more inside")
    return {
        "hook": hook[:55],
        "hook_sub": hook_sub[:65],
        "bullets": [{"icon": icons[i], "text": bullets[i]} for i in range(3)]
    }

# ── Font loader ───────────────────────────────────────────────────────────────
def get_font(size, bold=False):
    paths = [
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            try: return ImageFont.truetype(p, size)
            except: pass
    return ImageFont.load_default()

def draw_text_wrapped(draw, text, x, y, max_width, font, fill, line_height=None):
    lh = line_height or (font.size + 10)
    words = text.split()
    line = ""
    for w in words:
        test = (line + " " + w).strip()
        bbox = draw.textbbox((0,0), test, font=font)
        if bbox[2] - bbox[0] > max_width and line:
            draw.text((x, y), line, font=font, fill=fill)
            y += lh; line = w
        else: line = test
    if line: draw.text((x, y), line, font=font, fill=fill)
    return y + lh

def draw_rounded_rect(draw, xy, radius, fill):
    x0,y0,x1,y1 = xy
    draw.rounded_rectangle([x0,y0,x1,y1], radius=radius, fill=fill)

# ── Slide renderers ───────────────────────────────────────────────────────────
def render_hook(d, category, serial_id):
    img = Image.new("RGB", (W,H), NAVY)
    draw = ImageDraw.Draw(img)
    # Gradient overlay
    for row in range(H):
        t = row/H
        r_val = int(NAVY[0]*(1-t) + BLUE[0]*t)
        g_val = int(NAVY[1]*(1-t) + BLUE[1]*t)
        b_val = int(NAVY[2]*(1-t) + BLUE[2]*t)
        draw.line([(0,row),(W,row)], fill=(r_val,g_val,b_val))

    # Serial badge
    f_sm = get_font(36, bold=True)
    draw_rounded_rect(draw, (60, 80, 280, 140), 20, (245,158,11,40))
    draw.text((80, 90), serial_id, font=f_sm, fill=SAFFRON)
    # Category chip
    draw.text((300, 90), category.upper()[:20], font=f_sm, fill=(255,255,255,100))

    # "DID YOU KNOW?" label
    f_label = get_font(38, bold=True)
    draw.text((W//2 - 140, H*2//5 - 60), "DID YOU KNOW?",
              font=f_label, fill=(255,255,255,100))

    # Hook (big saffron text)
    f_hook = get_font(int(W*0.075), bold=True)
    y = draw_text_wrapped(draw, d["hook"], 80, H*2//5, W-160, f_hook,
                          SAFFRON, line_height=int(W*0.085))

    # Subtext
    if d["hook_sub"]:
        f_sub = get_font(42)
        draw_text_wrapped(draw, d["hook_sub"], 80, y+20, W-160, f_sub,
                          (200,200,200), line_height=54)

    # Footer
    f_foot = get_font(38, bold=True)
    draw.text((W//2 - 120, H - 100), "VedicMindAI", font=f_foot,
              fill=(255,255,255,90))
    return img

def render_proof(d, category, serial_id):
    img = Image.new("RGB", (W,H), CREAM)
    draw = ImageDraw.Draw(img)

    # Header chip
    f_chip = get_font(34, bold=True)
    draw_rounded_rect(draw, (60, 80, 60+len(serial_id)*22+20, 135), 15, NAVY)
    draw.text((75, 87), serial_id, font=f_chip, fill=SAFFRON)

    # Title
    f_title = get_font(72, bold=True)
    draw.text((80, 200), "Here's the truth", font=f_title, fill=NAVY)
    draw.rectangle([80, 285, 280, 292], fill=SAFFRON)

    # Bullets
    f_bull = get_font(48, bold=True)
    f_text = get_font(44)
    y_start = 380
    for i, b in enumerate(d["bullets"]):
        y_box = y_start + i * 220
        draw_rounded_rect(draw, (60, y_box, W-60, y_box+180), 18, WHITE)
        # Shadow
        draw.text((92, y_box+52), b["icon"], font=get_font(70), fill=NAVY)
        draw.text((185, y_box+45), b["text"][:38], font=f_bull, fill=NAVY)

    # Footer
    draw.text((W//2 - 120, H - 100), "VedicMindAI", font=get_font(38,True),
              fill=(100,100,100))
    return img

def render_cta(category, serial_id):
    img = Image.new("RGB", (W,H), PURPLE)
    draw = ImageDraw.Draw(img)
    # Gradient: purple to pink
    for row in range(H):
        t = row/H
        r_val = int(PURPLE[0]*(1-t) + PINK[0]*t)
        g_val = int(PURPLE[1]*(1-t) + PINK[1]*t)
        b_val = int(PURPLE[2]*(1-t) + PINK[2]*t)
        draw.line([(0,row),(W,row)], fill=(r_val,g_val,b_val))

    # Serial
    f_chip = get_font(34, bold=True)
    draw_rounded_rect(draw, (60,80,260,135), 15, (255,255,255,50))
    draw.text((75,87), serial_id, font=f_chip, fill=WHITE)

    # Label
    draw.text((W//2 - 180, H*3//10), "TRY IT YOURSELF →",
              font=get_font(38,True), fill=(255,255,255,140))

    # Main text
    f_big = get_font(int(W*0.08), bold=True)
    draw.text((80, H*2//5), "Ancient wisdom.", font=f_big, fill=WHITE)
    draw.text((80, H*2//5 + 110), "Modern speed.", font=f_big,
              fill=(253,230,138))   # warm yellow

    # CTA box
    box_y = H*3//5
    draw_rounded_rect(draw, (80, box_y, W-80, box_y+200), 24,
                      (255,255,255,40))
    draw.text((W//2 - 190, box_y+30), "🚀  FREE Demo",
              font=get_font(70,True), fill=WHITE)
    draw.text((W//2 - 230, box_y+120), "vedicmindai.in/demo",
              font=get_font(46), fill=(255,255,255,180))

    # Footer
    draw.text((W//2 - 120, H - 100), "@vedicmindai",
              font=get_font(38,True), fill=(255,255,255,120))
    return img

# ── Frame assembler ───────────────────────────────────────────────────────────
def frames_for_slide(slide_img, n_frames):
    return [slide_img] * n_frames

def build_video(post, output_path):
    d = extract_data(post)
    sid = post.get("serial_id","???")
    cat = post.get("category","")

    print(f"  Rendering slides for {sid}…")
    slides = [
        render_hook(d, cat, sid),
        render_proof(d, cat, sid),
        render_cta(cat, sid),
    ]

    # Write frames as PNG sequence to temp dir
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        frame_num = 0
        for slide_idx, (img, secs) in enumerate(zip(slides, SLIDE_TIMES)):
            n = secs * FPS
            for _ in range(n):
                fp = os.path.join(tmp, f"frame_{frame_num:05d}.png")
                img.save(fp)
                frame_num += 1

        print(f"  Encoding video {sid}…")
        cmd = [
            "ffmpeg", "-y",
            "-framerate", str(FPS),
            "-i", os.path.join(tmp, "frame_%05d.png"),
        ]

        if AUDIO_FILE.exists():
            cmd += ["-i", str(AUDIO_FILE),
                    "-c:a", "aac", "-shortest"]
        else:
            # silent
            cmd += ["-an"]

        cmd += [
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "fast",
            str(output_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  FFmpeg error: {result.stderr[-300:]}")
            return False

    print(f"  ✅ Saved: {output_path.name}")
    return True

# ── CLI argument parser ───────────────────────────────────────────────────────
def parse_args(args):
    """Returns list of serial_ids to process."""
    if not args:
        print(__doc__); sys.exit(0)

    arg = " ".join(args)

    # --all VM / --all VA etc
    if "--all" in arg:
        code = arg.split()[-1].upper()
        print(f"Fetching all {code} articles…")
        return fetch_all_in_code(code)

    # Range: VM-013:VM-017
    m = re.match(r"([A-Z]+)-(\d+):([A-Z]+)-(\d+)", arg.strip())
    if m:
        code1, start, code2, end = m.group(1), int(m.group(2)), m.group(3), int(m.group(4))
        if code1 != code2:
            print("Range must be within same category (e.g. VM-013:VM-017)"); sys.exit(1)
        print(f"Fetching {code1}-{start:03d} to {code1}-{end:03d}…")
        return fetch_range(code1, start, end)

    # List: VA-001,VA-005
    if "," in arg:
        ids = [x.strip().upper() for x in arg.split(",")]
        print(f"Fetching {len(ids)} articles: {ids}…")
        return fetch_articles(ids)

    # Single: VM-013
    m2 = re.match(r"([A-Z]+-\d+)", arg.strip())
    if m2:
        sid = m2.group(1).upper()
        print(f"Fetching {sid}…")
        return fetch_articles([sid])

    print(f"Could not parse argument: {arg}"); sys.exit(1)

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    OUTPUT_DIR.mkdir(exist_ok=True)
    articles = parse_args(sys.argv[1:])

    if not articles:
        print("No articles found for that range."); sys.exit(1)
    if isinstance(articles, dict) and "message" in articles:
        print(f"Supabase error: {articles}"); sys.exit(1)

    print(f"\n📹 Generating {len(articles)} video(s)…\n")
    success, fail = 0, 0

    for post in articles:
        sid = post.get("serial_id","???")
        title_slug = re.sub(r"[^a-zA-Z0-9]+","_", post.get("title","")[:30])
        out = OUTPUT_DIR / f"{sid}_{title_slug}.mp4"
        print(f"[{sid}] {post.get('title','')[:55]}")
        ok = build_video(post, out)
        if ok: success += 1
        else: fail += 1

    print(f"\n✅ Done: {success} videos generated, {fail} failed")
    print(f"📁 Output folder: {OUTPUT_DIR.absolute()}")
