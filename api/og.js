// api/og.js — Dynamic OG image generator
// Serves 1200x630 PNG social cards for blog posts
// Usage: /api/og?slug=some-blog-slug

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const CATEGORY_COLORS = {
  'Vedic Maths':   '#3B82F6',
  'Reasoning':     '#8B5CF6',
  'Aptitude':      '#F59E0B',
  'Vedic Science': '#10B981',
};

function truncate(str, max) {
  const clean = (str || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + '…';
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'https://vedicmindai.in');
    const slug = url.searchParams.get('slug');

    let title = 'VedicMindAI™ — Ancient Wisdom. Modern Speed.';
    let excerpt = 'Learn Vedic Mathematics, Reasoning & Aptitude with AI personalisation.';
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

    // Fetch Inter font from Google Fonts for satori
    const fontRes = await fetch(
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
    ).catch(() => null);

    let fontData = null;
    if (fontRes?.ok) {
      fontData = await fontRes.arrayBuffer();
    }

    if (!fontData) {
      // Fallback: fetch Roboto from npm CDN
      const fallback = await fetch('https://cdn.jsdelivr.net/npm/@canvas-fonts/roboto@1.0.4/Roboto-Regular.ttf').catch(() => null);
      if (fallback?.ok) fontData = await fallback.arrayBuffer();
    }

    if (!fontData) {
      res.status(500).send('Could not load font');
      return;
    }

    const accent = CATEGORY_COLORS[category] || '#6366F1';
    const displayTitle = truncate(title, 68);
    const displayExcerpt = truncate(excerpt, 120);

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px', height: '630px',
            display: 'flex', flexDirection: 'column',
            background: '#0A1628',
            fontFamily: 'Inter',
          },
          children: [
            // Top accent bar
            {
              type: 'div',
              props: {
                style: { width: '1200px', height: '6px', background: accent, display: 'flex' },
                children: [],
              },
            },
            // Main content
            {
              type: 'div',
              props: {
                style: { flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px 28px' },
                children: [
                  // Header: brand + category
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center', gap: '10px' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: { width: '40px', height: '40px', borderRadius: '8px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: '900' },
                                  children: 'V',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { display: 'flex', flexDirection: 'column' },
                                  children: [
                                    { type: 'span', props: { style: { color: 'white', fontSize: '18px', fontWeight: '800' }, children: 'VedicMindAI' } },
                                    { type: 'span', props: { style: { color: 'rgba(255,255,255,0.4)', fontSize: '12px' }, children: 'vedicmindai.in' } },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: { background: accent + '33', border: `1px solid ${accent}66`, borderRadius: '100px', padding: '8px 18px', display: 'flex', alignItems: 'center' },
                            children: { type: 'span', props: { style: { color: accent, fontSize: '14px', fontWeight: '700' }, children: category } },
                          },
                        },
                      ],
                    },
                  },
                  // Title
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: displayTitle.length > 50 ? '34px' : '40px',
                        fontWeight: '800', color: 'white', lineHeight: '1.2',
                        marginBottom: '18px', maxWidth: '900px', display: 'flex',
                      },
                      children: displayTitle,
                    },
                  },
                  // Excerpt
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: '18px', color: 'rgba(255,255,255,0.60)', lineHeight: '1.5', flex: 1, display: 'flex', maxWidth: '820px' },
                      children: displayExcerpt,
                    },
                  },
                  // Bottom strip
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.10)' },
                      children: [
                        { type: 'span', props: { style: { color: 'rgba(255,255,255,0.38)', fontSize: '14px', display: 'flex' }, children: 'Free on Google Play  ·  vedicmindai.in' } },
                        {
                          type: 'div',
                          props: {
                            style: { background: accent, borderRadius: '8px', padding: '10px 20px', color: 'white', fontSize: '14px', fontWeight: '700', display: 'flex' },
                            children: 'Read Article',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(png);
  } catch (e) {
    console.error('OG image error:', e.message);
    res.status(500).send('Error: ' + e.message);
  }
}
