// api/og.js — Dynamic OG image generator (viral/shareable design)
import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const CATEGORY = {
  'Vedic Maths':   { color: '#3B82F6', bg: '#1D3A6E', emoji: '🧮', tag: 'VEDIC MATHS' },
  'Reasoning':     { color: '#A78BFA', bg: '#2D1B69', emoji: '🧠', tag: 'REASONING' },
  'Aptitude':      { color: '#FCD34D', bg: '#78350F', emoji: '📊', tag: 'APTITUDE' },
  'Vedic Science': { color: '#34D399', bg: '#064E3B', emoji: '🔬', tag: 'VEDIC SCIENCE' },
};

const fontData = readFileSync(join(process.cwd(), 'public', 'fonts', 'Inter-Regular.woff'));

function trunc(str, max) {
  const s = (str || '').replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : s.slice(0, max - 1) + '\u2026';
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'https://vedicmindai.in');
    const slug = url.searchParams.get('slug');

    let title = 'Ancient Wisdom. Modern Speed.';
    let excerpt = 'Learn calculation tricks 10\u00d7 faster using 3,000-year-old Vedic techniques.';
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
            excerpt = (rows[0].content || '').replace(/\s+/g, ' ').trim().slice(0, 110);
            category = rows[0].category || category;
          }
        }
      } catch (_) {}
    }

    const cat = CATEGORY[category] || CATEGORY['Vedic Maths'];
    const t = trunc(title, 60);
    const e = trunc(excerpt, 110);

    const ir = new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px', height: '630px',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1A3A 50%, #0A0F1E 100%)',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          },
          children: [

            // Large background emoji watermark
            { type: 'div', props: { style: { position: 'absolute', right: '-20px', top: '-20px', fontSize: '280px', opacity: '0.06', display: 'flex' }, children: cat.emoji } },

            // Left accent bar
            { type: 'div', props: { style: { position: 'absolute', left: 0, top: 0, width: '8px', height: '630px', background: `linear-gradient(180deg, ${cat.color}, ${cat.color}44)`, display: 'flex' }, children: [] } },

            // Main content
            { type: 'div', props: {
              style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 64px 44px 72px' },
              children: [

                // Top: category pill + brand
                { type: 'div', props: {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
                  children: [
                    // Category pill
                    { type: 'div', props: {
                      style: { display: 'flex', alignItems: 'center', gap: '8px', background: cat.bg, borderRadius: '100px', padding: '8px 18px', border: `1.5px solid ${cat.color}66` },
                      children: [
                        { type: 'span', props: { style: { fontSize: '18px' }, children: cat.emoji } },
                        { type: 'span', props: { style: { color: cat.color, fontSize: '13px', fontWeight: '800', letterSpacing: '1.5px' }, children: cat.tag } },
                      ]
                    }},
                    // Brand
                    { type: 'div', props: {
                      style: { display: 'flex', alignItems: 'center', gap: '8px' },
                      children: [
                        { type: 'div', props: { style: { width: '32px', height: '32px', borderRadius: '6px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '900' }, children: 'V' } },
                        { type: 'span', props: { style: { color: 'rgba(255,255,255,0.55)', fontSize: '15px', fontWeight: '600' }, children: 'VedicMindAI' } },
                      ]
                    }},
                  ]
                }},

                // BIG title
                { type: 'div', props: {
                  style: {
                    fontSize: t.length > 45 ? '42px' : '52px',
                    fontWeight: '900',
                    color: 'white',
                    lineHeight: '1.15',
                    marginBottom: '24px',
                    maxWidth: '860px',
                    display: 'flex',
                    letterSpacing: '-0.5px',
                  },
                  children: t
                }},

                // Excerpt with left highlight bar
                { type: 'div', props: {
                  style: { display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 },
                  children: [
                    { type: 'div', props: { style: { width: '3px', height: '100%', background: cat.color, borderRadius: '2px', flexShrink: 0, display: 'flex', minHeight: '48px' }, children: [] } },
                    { type: 'div', props: { style: { fontSize: '20px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.55', display: 'flex', maxWidth: '780px' }, children: e } },
                  ]
                }},

                // Bottom bar
                { type: 'div', props: {
                  style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px' },
                  children: [
                    // Stars + free tag
                    { type: 'div', props: {
                      style: { display: 'flex', alignItems: 'center', gap: '12px' },
                      children: [
                        { type: 'span', props: { style: { fontSize: '18px', letterSpacing: '2px' }, children: '\u2b50\u2b50\u2b50\u2b50\u2b50' } },
                        { type: 'span', props: { style: { color: 'rgba(255,255,255,0.4)', fontSize: '14px' }, children: 'Free App on Google Play' } },
                      ]
                    }},
                    // CTA pill
                    { type: 'div', props: {
                      style: { display: 'flex', alignItems: 'center', gap: '10px', background: cat.color, borderRadius: '12px', padding: '12px 24px' },
                      children: [
                        { type: 'span', props: { style: { color: '#0A0F1E', fontSize: '15px', fontWeight: '800' }, children: 'Read on vedicmindai.in' } },
                        { type: 'span', props: { style: { color: '#0A0F1E', fontSize: '18px' }, children: '\u2192' } },
                      ]
                    }},
                  ]
                }},

              ]
            }},
          ]
        }
      },
      {
        width: 1200,
        height: 630,
        fonts: [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }]
      }
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
