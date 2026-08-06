// Vercel Serverless Function — dynamic sitemap.xml
// Generated live on every request (cached briefly at the edge) so newly
// published blog posts appear automatically, with no manual regeneration
// or code deploy needed.
//
// SETUP: uses the same SUPABASE_SERVICE_ROLE_KEY already configured in
// Vercel for the other api/ functions.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SITE_URL = 'https://www.vedicmindai.in';

// Static routes worth surfacing to search engines. Auth-gated app pages
// (dashboard, practice, etc.) are intentionally excluded — nothing to
// index there for a logged-out crawler.
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/curriculum', priority: '0.8', changefreq: 'weekly' },
  { path: '/reviews', priority: '0.6', changefreq: 'weekly' },
  { path: '/demo', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/life-skills', priority: '0.6', changefreq: 'monthly' },
  { path: '/screenless', priority: '0.6', changefreq: 'monthly' },
  { path: '/for-schools', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/vedic-science', priority: '0.7', changefreq: 'weekly' },
  { path: '/collaborate', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
];

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server');
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('status', 'published');

    const urls = [];

    for (const route of STATIC_ROUTES) {
      urls.push(
        `<url><loc>${SITE_URL}${route.path}</loc><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`
      );
    }

    for (const post of posts || []) {
      const lastmod = post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : undefined;
      urls.push(
        `<url><loc>${SITE_URL}/blog/${escapeXml(post.slug)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>monthly</changefreq><priority>0.7</priority></url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // edge-cache 1hr, safe since blog posts don't need second-by-second freshness
    res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err.message);
    // Fail gracefully with just the static routes rather than a broken response —
    // a sitemap missing new blog posts is far less harmful than Search Console
    // reporting the whole sitemap URL as broken.
    const fallbackUrls = STATIC_ROUTES.map(
      r => `<url><loc>${SITE_URL}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    ).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${fallbackUrls}\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  }
}
