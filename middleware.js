// Vercel Edge Middleware — server-side meta tag injection
//
// WHY THIS EXISTS: this is a React SPA. The raw HTML Vercel serves for
// EVERY route is identical (index.html, homepage meta tags baked in) --
// the correct per-page title/description/canonical only ever get set
// client-side, after React mounts and runs. That's invisible to anything
// that doesn't execute JavaScript: Facebook's/WhatsApp's/Twitter's link-
// preview crawlers, and (for the raw-HTML layer specifically, though
// Googlebot itself does render JS) SEO audit tools. Confirmed via curl
// with a Facebook user-agent on 30-Jul-2026 -- sharing a blog post link
// showed the homepage's title and description, not the article's.
//
// This intercepts requests to a known, fixed list of routes and rewrites
// index.html's <title>/<meta description>/<link canonical>/OG/Twitter
// tags before the response leaves the server. It does NOT server-render
// the actual page content (that's the much bigger SSR question, still
// intentionally deferred) -- only the <head> metadata.
//
// SAFETY: every failure path falls through to the completely unmodified
// origin response. A Supabase fetch failing, a slug not found, a
// malformed regex match, anything -- worst case is "meta tags stay as
// they were," never a broken or unavailable page.

export const config = {
  matcher: [
    '/blog',
    '/blog/:slug',
    '/pricing',
    '/curriculum',
    '/reviews',
    '/collaborate',
    '/screenless',
    '/terms',
    '/privacy',
    '/demo',
    '/life-skills',
  ],
};

const SITE_URL = 'https://www.vedicmindai.in';
const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
// Public anon key -- same one already shipped in the client bundle
// (src/lib/supabaseClient.js), safe to embed here for the same reason.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const STATIC_META = {
  '/pricing': {
    title: 'Pricing — VedicMindAI™',
    description: 'Simple, transparent pricing for VedicMindAI. Start free, upgrade anytime. Plans for individuals and families.',
  },
  '/curriculum': {
    title: 'Curriculum — VedicMindAI™',
    description: "Explore VedicMindAI's full curriculum: Vedic Mathematics, Reasoning, and Aptitude, structured for Class 1 to 12 and competitive exams.",
  },
  '/reviews': {
    title: 'Reviews — VedicMindAI™',
    description: 'See what students, parents, and educators say about learning Vedic Mathematics with VedicMindAI.',
  },
  '/collaborate': {
    title: 'Collaborate With Us — VedicMindAI™',
    description: 'Partner with VedicMindAI — for educators, institutions, and organizations interested in Vedic Mathematics education.',
  },
  '/screenless': {
    title: 'Screenless Learning — VedicMindAI™',
    description: 'VedicMindAI\'s screenless learning resources — Vedic Mathematics practice without screen time.',
  },
  '/terms': {
    title: 'Terms & Conditions — VedicMindAI™',
    description: "VedicMindAI's terms and conditions of use.",
  },
  '/privacy': {
    title: 'Privacy Policy — VedicMindAI™',
    description: "VedicMindAI's privacy policy — how we collect, use, and protect your data.",
  },
  '/demo': {
    title: 'Try the Demo — VedicMindAI™',
    description: 'Try VedicMindAI\'s interactive Vedic Mathematics demo — no signup required.',
  },
  '/blog': {
    title: 'Blog — VedicMindAI™',
    description: 'Vedic Mathematics, Reasoning, and Aptitude articles, tips, and shortcuts from VedicMindAI.',
  },
  '/life-skills': {
    title: 'Life Skills — VedicMindAI™',
    description: 'Practical life skills tracks from VedicMindAI, alongside Vedic Mathematics, Reasoning, and Aptitude.',
  },
};

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function getBlogPostMeta(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,content,published_at,created_at`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  if (!rows || !rows[0]) return null;
  const row = rows[0];
  return {
    title: `${row.title} — VedicMindAI™`,
    description: row.content.replace(/\s+/g, ' ').trim().slice(0, 155),
    rawTitle: row.title,
    publishedAt: row.published_at || row.created_at,
  };
}

function blogListJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Blog', name: 'VedicMindAI Blog', url: `${SITE_URL}/blog`, publisher: { '@type': 'Organization', name: 'VedicMindAI' } },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        ],
      },
    ],
  });
}

function blogPostJsonLd(meta, canonicalUrl) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: meta.rawTitle,
        description: meta.description,
        datePublished: meta.publishedAt,
        author: { '@type': 'Organization', name: 'VedicMindAI' },
        publisher: { '@type': 'Organization', name: 'VedicMindAI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png` } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: meta.rawTitle, item: canonicalUrl },
        ],
      },
    ],
  });
}

export default async function middleware(request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    let meta = null;
    let canonicalPath = path;

    if (path.startsWith('/blog/') && path.length > 6) {
      const slug = path.slice('/blog/'.length);
      meta = await getBlogPostMeta(slug);
      // Unknown/unpublished slug -- let the app's own client-side
      // "not found" handling take over, don't inject anything.
      if (!meta) return;
    } else if (STATIC_META[path]) {
      meta = STATIC_META[path];
    }

    if (!meta) return; // not a route we handle -- pass through untouched

    const originResponse = await fetch(new URL('/index.html', request.url));
    if (!originResponse.ok) return; // fall through, never break the page

    let html = await originResponse.text();
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const safeTitle = escapeHtml(meta.title);
    const safeDesc = escapeHtml(meta.description);

    html = html
      .replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${safeDesc}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${safeDesc}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${SITE_URL}/api/og?slug=${encodeURIComponent(path.replace('/blog/', ''))}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${safeDesc}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${SITE_URL}/api/og?slug=${encodeURIComponent(path.replace('/blog/', ''))}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Structured data (JSON-LD) -- same schema BlogListPage.jsx/
    // BlogPostPage.jsx already inject client-side, now also in the raw
    // HTML for the same non-JS-crawler reason as everything else here.
    // The </script escaping guards against article content that happens
    // to contain that literal substring breaking out of the tag.
    let jsonLd = null;
    if (path === '/blog') {
      jsonLd = blogListJsonLd();
    } else if (path.startsWith('/blog/') && meta.rawTitle) {
      jsonLd = blogPostJsonLd(meta, canonicalUrl);
    }
    if (jsonLd) {
      const safeJsonLd = jsonLd.replace(/<\/script/gi, '<\\/script');
      html = html.replace('</head>', `<script type="application/ld+json">${safeJsonLd}</script></head>`);
    }

    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (e) {
    // Anything at all going wrong -- fall through to the normal,
    // unmodified response. Never let this middleware break a page.
    return;
  }
}
