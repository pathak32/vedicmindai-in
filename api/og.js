// api/og.js — Dynamic OG image generator (Node.js serverless, not Edge)
// Uses satori (HTML→SVG) + @resvg/resvg-js (SVG→PNG)
// Usage: /api/og?slug=some-blog-slug

const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');

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
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + '…';
}

module.exports = async (req, res) => {
  try {
    const slug = req.query?.slug || '';
    let title = 'VedicMindAI — Ancient Wisdom. Modern Speed.';
    let excerpt = 'Learn Vedic Mathematics, Reasoning & Aptitude with AI personalisation.';
    let category = 'Vedic Maths';

    if (slug) {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,content,category`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (r.ok) {
        const rows = await r.json();
        if (rows?.[0]) {
          title = rows[0].title || title;
          excerpt = rows[0].content?.replace(/\s+/g, ' ').trim().slice(0, 110) || excerpt;
          category = rows[0].category || category;
        }
      }
    }

    const colors = CATEGORY_COLORS[category] || DEFAULT_COLOR;
    const displayTitle = truncate(title, 68);
    const displayExcerpt = truncate(excerpt, 110);

    // Fetch font for satori (required — satori needs at least one font)
    const fontRes = await fetch('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff');
    const fontData = await fontRes.arrayBuffer();

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px', height: '630px',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(135deg, #0A1628 0%, #0D1F3C 100%)',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
          },
          children: [
            // Top accent line
            {
              type: 'div',
              props: {
                style: { width: '100%', height: '6px', background: colors.accent, display: 'flex' },
              },
            },
            // Content
            {
              type: 'div',
              props: {
                style: {
                  flex: 1, display: 'flex', flexDirection: 'column',
                  padding: '40px 56px 36px',
                },
                children: [
                  // Brand row
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
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
                                    width: '42px', height: '42px', borderRadius: '10px',
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
                                    { type: 'span', props: { style: { color: 'white', fontSize: '19px', fontWeight: '800' }, children: 'VedicMindAI' } },
                                    { type: 'span', props: { style: { color: 'rgba(255,255,255,0.4)', fontSize: '13px' }, children: 'vedicmindai.in' } },
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
                              border: `1.5px solid ${colors.accent}`,
                              borderRadius: '100px', padding: '8px 20px',
                            },
                            children: [
                              { type: 'span', props: { style: { fontSize: '16px' }, children: colors.emoji } },
                              { type: 'span', props: { style: { color: colors.accent, fontSize: '15px', fontWeight: '700' }, children: category } },
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
                        fontSize: displayTitle.length > 55 ? '34px' : '40px',
                        fontWeight: '800', color: 'white',
                        lineHeight: '1.25', marginBottom: '18px',
                        maxWidth: '1000px', display: 'flex',
                      },
                      children: displayTitle,
                    },
                  },
                  // Excerpt
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '18px', color: 'rgba(255,255,255,0.6)',
                        lineHeight: '1.55', maxWidth: '900px',
                        display: 'flex', flex: 1,
                      },
                      children: displayExcerpt,
                    },
                  },
                  // Bottom strip
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)',
                        marginTop: '20px',
                      },
                      children: [
                        {
                          type: 'span',
                          props: {
                            style: { color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
                            children: 'Free on Google Play · vedicmindai.in',
                          },
                        },
                        {
                          type: 'div',
                          props: {
                            style: {
                              background: colors.accent, borderRadius: '10px',
                              padding: '10px 24px', color: 'white',
                              fontSize: '15px', fontWeight: '700', display: 'flex',
                            },
                            children: 'Read Article →',
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
        width: 1200, height: 630,
        fonts: [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }],
      }
    );

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const png = resvg.render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.end(png);
  } catch (e) {
    console.error('OG image error:', e);
    res.status(500).json({ error: e.message });
  }
};
