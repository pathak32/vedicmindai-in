// api/og.js — Dynamic OG image generator
// Generates 1200x630 PNG social share cards for blog posts
// Uses satori + @resvg/resvg-js with Inter font fetched from Google Fonts

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const CATEGORY_COLORS = {
  'Vedic Maths':   { accent: '#3B82F6', emoji: '🧮' },
  'Reasoning':     { accent: '#8B5CF6', emoji: '🧠' },
  'Aptitude':      { accent: '#F59E0B', emoji: '📊' },
  'Vedic Science': { accent: '#10B981', emoji: '🔬' },
};
const DEFAULT_COLOR = { accent: '#6366F1', emoji: '✨' };

function truncate(str, max) {
  const clean = (str || '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + '…';
}

// Fetch Inter font from Google Fonts — cached by Vercel between invocations
let fontCache = null;
async function getFont() {
  if (fontCache) return fontCache;
  const res = await fetch(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff'
  );
  if (!res.ok) throw new Error('Failed to fetch font');
  fontCache = await res.arrayBuffer();
  return fontCache;
}

export default async function handler(req, res) {
  try {
    const slug = new URL(req.url, 'https://vedicmindai.in').searchParams.get('slug');

    let title = 'VedicMindAI';
    let excerpt = 'Ancient Wisdom. Modern Speed. Learn Vedic Mathematics with AI personalisation.';
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
            excerpt = (rows[0].content || '').replace(/\s+/g, ' ').trim().slice(0, 120);
            category = rows[0].category || category;
          }
        }
      } catch (_) {}
    }

    const colors = CATEGORY_COLORS[category] || DEFAULT_COLOR;
    const displayTitle = truncate(title, 65);
    const displayExcerpt = truncate(excerpt, 115);
    const fontSize = displayTitle.length > 50 ? 36 : 42;

    const fontData = await getFont();

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
                style: { width: '1200px', height: '6px', background: colors.accent, display: 'flex' },
                children: [],
              },
            },
            // Main content
            {
              type: 'div',
              props: {
                style: {
                  flex: 1, display: 'flex', flexDirection: 'column',
                  padding: '36px 56px 32px',
                },
                children: [
                  // Brand row
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: '28px',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { display: 'flex', alignItems: 'center', gap: '12px' },
                            children: [
                              {
                                type: 'div',
                                props: {
                                  style: {
                                    width: '42px', height: '42px', borderRadius: '9px',
                                    background: '#6366F1', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '22px', fontWeight: '900',
                                  },
                                  children: 'V',
                                },
                              },
                              {
                                type: 'div',
                                props: {
                                  style: { display: 'flex', flexDirection: 'column' },
                                  children: [
                                    {
                                      type: 'span',
                                      props: {
                                        style: { color: 'white', fontSize: '18px', fontWeight: '800' },
                                        children: 'VedicMindAI',
                                      },
                                    },
                                    {
                                      type: 'span',
                                      props: {
                                        style: { color: 'rgba(255,255,255,0.40)', fontSize: '12px' },
                                        children: 'vedicmindai.in',
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                        // Category badge
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex', alignItems: 'center', gap: '8px',
                              background: `rgba(${parseInt(colors.accent.slice(1,3),16)},${parseInt(colors.accent.slice(3,5),16)},${parseInt(colors.accent.slice(5,7),16)},0.18)`,
                              borderRadius: '100px', padding: '8px 18px',
                            },
                            children: [
                              {
                                type: 'span',
                                props: { style: { fontSize: '16px' }, children: colors.emoji },
                              },
                              {
                                type: 'span',
                                props: {
                                  style: { color: colors.accent, fontSize: '14px', fontWeight: '700' },
                                  children: category,
                                },
                              },
                            ],
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
                        fontSize: `${fontSize}px`, fontWeight: '800',
                        color: 'white', lineHeight: '1.2',
                        marginBottom: '18px', maxWidth: '900px',
                        display: 'flex',
                      },
                      children: displayTitle,
                    },
                  },
                  // Excerpt
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '19px', color: 'rgba(255,255,255,0.58)',
                        lineHeight: '1.5', maxWidth: '820px',
                        flex: 1, display: 'flex',
                      },
                      children: displayExcerpt,
                    },
                  },
                  // Bottom strip
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginTop: '24px',
                        paddingTop: '18px',
                        borderTop: '1px solid rgba(255,255,255,0.10)',
                      },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: {
                              color: 'rgba(255,255,255,0.38)', fontSize: '14px', display: 'flex',
                            },
                            children: 'Free on Google Play  ·  vedicmindai.in',
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              background: colors.accent, borderRadius: '8px',
                              padding: '10px 22px', color: 'white',
                              fontSize: '14px', fontWeight: '700', display: 'flex',
                            },
                            children: 'Read Full Article',
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

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const png = resvg.render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(png);
  } catch (e) {
    console.error('OG generation failed:', e.message);
    res.status(500).json({ error: e.message });
  }
}
