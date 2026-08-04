// api/og.js — Dynamic OG image generator
// Font is bundled in public/fonts/ to avoid runtime fetch failures
import { ImageResponse } from '@vercel/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const COLORS = {
  'Vedic Maths':   '#3B82F6',
  'Reasoning':     '#8B5CF6',
  'Aptitude':      '#F59E0B',
  'Vedic Science': '#10B981',
};

function trunc(str, max) {
  const s = (str || '').replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : s.slice(0, max - 1) + '\u2026';
}

// Load font once at module level so it's cached across warm invocations
let _font = null;
async function getFont() {
  if (_font) return _font;
  try {
    _font = await readFile(join(process.cwd(), 'public', 'fonts', 'Inter-Regular.woff'));
    return _font;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'https://vedicmindai.in');
    const slug = url.searchParams.get('slug');

    let title = 'VedicMindAI \u2014 Ancient Wisdom. Modern Speed.';
    let excerpt = 'Learn Vedic Mathematics, Reasoning & Aptitude with AI personalisation. Free to start.';
    let category = 'Vedic Maths';

    if (slug) {
      try {
        const r = await fetch(
          `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,content,category`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
        );
        if (r.ok) {
          const rows = await r.json();
          if (rows?.[0]) {
            title = rows[0].title || title;
            excerpt = (rows[0].content || '').replace(/\s+/g, ' ').trim().slice(0, 130);
            category = rows[0].category || category;
          }
        }
      } catch (_) {}
    }

    const fontData = await getFont();
    if (!fontData) {
      res.status(500).send('Font not found at public/fonts/Inter-Regular.woff');
      return;
    }

    const accent = COLORS[category] || '#6366F1';
    const t = trunc(title, 68);
    const e = trunc(excerpt, 120);

    const ir = new ImageResponse(
      {
        type: 'div',
        props: {
          style: { width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', background: '#0A1628', fontFamily: 'Inter' },
          children: [
            { type: 'div', props: { style: { width: '100%', height: '6px', background: accent, display: 'flex', flexShrink: 0 }, children: [] } },
            { type: 'div', props: {
              style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px 28px' },
              children: [
                { type: 'div', props: {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [
                      { type: 'div', props: { style: { width: '40px', height: '40px', borderRadius: '8px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: '900' }, children: 'V' } },
                      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
                        { type: 'span', props: { style: { color: 'white', fontSize: '18px', fontWeight: '800' }, children: 'VedicMindAI' } },
                        { type: 'span', props: { style: { color: 'rgba(255,255,255,0.4)', fontSize: '12px' }, children: 'vedicmindai.in' } },
                      ]}},
                    ]}},
                    { type: 'div', props: { style: { borderRadius: '100px', padding: '8px 18px', display: 'flex', border: `1px solid ${accent}88`, background: accent + '22' },
                      children: { type: 'span', props: { style: { color: accent, fontSize: '14px', fontWeight: '700' }, children: category } }
                    }},
                  ]
                }},
                { type: 'div', props: { style: { fontSize: t.length > 50 ? '34px' : '40px', fontWeight: '800', color: 'white', lineHeight: '1.2', marginBottom: '18px', maxWidth: '900px', display: 'flex' }, children: t } },
                { type: 'div', props: { style: { fontSize: '18px', color: 'rgba(255,255,255,0.60)', lineHeight: '1.5', flex: 1, display: 'flex', maxWidth: '820px' }, children: e } },
                { type: 'div', props: {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.10)' },
                  children: [
                    { type: 'span', props: { style: { color: 'rgba(255,255,255,0.38)', fontSize: '14px', display: 'flex' }, children: 'Free on Google Play  \u00b7  vedicmindai.in' } },
                    { type: 'div', props: { style: { background: accent, borderRadius: '8px', padding: '10px 20px', color: 'white', fontSize: '14px', fontWeight: '700', display: 'flex' }, children: 'Read Article \u2192' } },
                  ]
                }},
              ]
            }},
          ]
        }
      },
      { width: 1200, height: 630, fonts: [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }] }
    );

    const buf = Buffer.from(await ir.arrayBuffer());
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(buf);

  } catch (e) {
    console.error('OG error:', e.message);
    res.status(500).send('OG error: ' + e.message);
  }
}
