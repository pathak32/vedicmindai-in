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
//
// BUG FIXED (Aug 2026): blogPostJsonLd() was referencing `path` from
// the outer middleware() scope — but as a top-level function it can't
// close over that variable. In Edge strict mode this threw a
// ReferenceError on every blog post request, which the try/catch caught
// silently and returned undefined, causing Vercel to fall through to the
// raw index.html. That response got CDN-cached with x-vercel-cache:HIT,
// so ALL blog posts were being served with homepage meta. Fixed by
// passing the slug directly into blogPostJsonLd() instead.
// Also added: no-store cache headers on all middleware responses (belt-
// and-suspenders), and a 3-second AbortController timeout on the
// Supabase fetch so a slow DB response never hangs the edge function.

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
    title: 'Vedic Maths App Pricing — Free Plan + ₹499/mo | VedicMindAI',
    description: 'VedicMindAI plans start at ₹499/month. Free tier available forever. Vedic Maths, Reasoning & Aptitude for Class 1–12 students and JEE/SSC/CAT aspirants.',
  },
  '/curriculum': {
    title: 'Vedic Maths Curriculum — 40 Lessons for Class 1–12 & JEE/SSC | VedicMindAI',
    description: '40 structured Vedic Maths lessons across 4 levels, plus Reasoning & Aptitude tracks. Mapped to Class 1–12 syllabus, JEE, SSC, CAT, and UPSC preparation.',
  },
  '/reviews': {
    title: 'Student Reviews — VedicMindAI | Real Results from Vedic Maths Learners',
    description: 'See how students across India are calculating 10× faster with VedicMindAI. Real reviews from Class 6–12 students, parents, and competitive exam aspirants.',
  },
  '/collaborate': {
    title: 'School & Educator Partnerships — VedicMindAI | Vedic Maths for Schools',
    description: 'Partner with VedicMindAI for school programmes, educator collaborations, and institutional Vedic Mathematics training across India.',
  },
  '/screenless': {
    title: 'Screenless Vedic Maths Learning — Practice Without a Screen | VedicMindAI',
    description: 'Printable Vedic Maths worksheets and offline practice bundles for students who need screen-free learning. Ideal for parents and teachers.',
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
    title: 'Free Vedic Maths Demo — Try 32 Questions, No Signup | VedicMindAI',
    description: 'Take VedicMindAI\'s free interactive demo — 32 questions across Vedic Maths, Reasoning and Aptitude. No signup needed. See how fast you can calculate.',
  },
  '/blog': {
    title: 'Vedic Maths Blog — Shortcuts, Tricks & Study Tips | VedicMindAI',
    description: '200+ articles on Vedic Mathematics tricks, Reasoning shortcuts, and Aptitude tips for Class 6–12 students and JEE/SSC/CAT/UPSC aspirants.',
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
  // 3-second timeout -- if Supabase is slow, fall through rather than
  // hanging the edge function until Vercel's own timeout kills it.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,content,published_at,created_at`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        signal: controller.signal,
      }
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
  } finally {
    clearTimeout(timeoutId);
  }
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

// FIX: slug is now passed as an explicit parameter instead of reading
// the outer-scope `path` variable, which was never accessible here and
// caused a ReferenceError (silently caught, middleware fell through).
function blogPostJsonLd(meta, canonicalUrl, slug) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: meta.rawTitle,
        description: meta.description,
        datePublished: meta.publishedAt,
        author: { '@type': 'Organization', name: 'VedicMindAI' },
        publisher: {
          '@type': 'Organization',
          name: 'VedicMindAI',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-192.png` },
        },
        image: `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}`,
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
    let blogSlug = null;

    if (path.startsWith('/blog/') && path.length > 6) {
      blogSlug = path.slice('/blog/'.length);
      meta = await getBlogPostMeta(blogSlug);
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
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${SITE_URL}/icons/icon-512.png" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${safeDesc}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${SITE_URL}/icons/icon-512.png" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Structured data (JSON-LD) -- same schema BlogListPage.jsx/
    // BlogPostPage.jsx already inject client-side, now also in the raw
    // HTML for the same non-JS-crawler reason as everything else here.
    // The </script escaping guards against article content that happens
    // to contain that literal substring breaking out of the tag.
    let jsonLd = null;
    if (path === '/blog') {
      jsonLd = blogListJsonLd();
    } else if (blogSlug && meta.rawTitle) {
      // FIX: pass blogSlug explicitly -- the old call passed nothing for
      // the third argument, so blogPostJsonLd read an outer `path` that
      // was out of scope, threw ReferenceError, and the catch returned
      // undefined on every single blog post request.
      jsonLd = blogPostJsonLd(meta, canonicalUrl, blogSlug);
    }
    if (jsonLd) {
      const safeJsonLd = jsonLd.replace(/<\/script/gi, '<\\/script');
      html = html.replace('</head>', `<script type="application/ld+json">${safeJsonLd}</script></head>`);
    }

    // no-store: prevent Vercel CDN from caching this middleware-modified
    // response. Each blog post has unique meta fetched live from Supabase;
    // caching would serve one post's meta for a different post's URL.
    // Belt-and-suspenders alongside the vercel.json /blog/* header rule.
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store, no-cache, must-revalidate',
        'x-middleware-injected': 'true',
      },
    });
  } catch (e) {
    // Anything at all going wrong -- fall through to the normal,
    // unmodified response. Never let this middleware break a page.
    return;
  }
}
