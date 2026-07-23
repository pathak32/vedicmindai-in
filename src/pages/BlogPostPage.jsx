import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

const CATEGORY_COLORS = {
  'Vedic Maths': { bg: '#DBEAFE', color: '#1E40AF' },
  'Reasoning': { bg: '#EDE9FE', color: '#5B21B6' },
  'Aptitude': { bg: '#FEF3C7', color: '#92400E' },
};

// Creates the meta tag if it doesn't already exist (index.html only ships
// the homepage's default set), otherwise updates it in place.
function setMetaTag(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const sb = await getSupabase();
        const { data } = await sb.from('blog_posts')
          .select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
        if (!data) {
          setNotFound(true);
        } else {
          setPost(data);
          const pageTitle = `${data.title} — VedicMindAI™`;
          const description = data.content.slice(0, 155);
          const canonicalUrl = `https://www.vedicmindai.in/blog/${data.slug}`;

          document.title = pageTitle;
          setMetaTag('name', 'description', description);
          setMetaTag('property', 'og:title', data.title);
          setMetaTag('property', 'og:description', description);
          setMetaTag('property', 'og:url', canonicalUrl);
          setMetaTag('property', 'og:type', 'article');
          setMetaTag('name', 'twitter:title', data.title);
          setMetaTag('name', 'twitter:description', description);

          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', canonicalUrl);

          // Article structured data — helps eligibility for rich results in
          // Google Search (byline, publish date, etc.)
          let ld = document.getElementById('blog-post-jsonld');
          if (!ld) {
            ld = document.createElement('script');
            ld.type = 'application/ld+json';
            ld.id = 'blog-post-jsonld';
            document.head.appendChild(ld);
          }
          ld.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: description,
            datePublished: data.published_at || data.created_at,
            author: { '@type': 'Organization', name: 'VedicMindAI' },
            publisher: {
              '@type': 'Organization',
              name: 'VedicMindAI',
              logo: { '@type': 'ImageObject', url: 'https://www.vedicmindai.in/icons/icon-512.png' },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          });
        }
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);

    // Clean up the JSON-LD tag when navigating away, so it doesn't leak
    // stale article data onto some other page.
    return () => {
      const ld = document.getElementById('blog-post-jsonld');
      if (ld) ld.remove();
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
        <LandingNavbar />
        <p style={{ textAlign: 'center', padding: '120px 16px', color: '#6B7280' }}>{t('loadingText')}</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
        <LandingNavbar />
        <div style={{ textAlign: 'center', padding: '120px 16px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
            {t('blogNotFoundTitle')}
          </h1>
          <button onClick={() => navigate('/blog')} style={{
            marginTop: 8, padding: '10px 24px', background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, cursor: 'pointer',
          }}>
            {t('blogBackToBlog')}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Vedic Maths'];
  const paragraphs = post.content.split(/\n\s*\n/).filter(p => p.trim());

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <LandingNavbar />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '96px 20px 60px' }}>
        <Link to="/blog" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#3B82F6', textDecoration: 'none' }}>
          {t('blogBackToBlog')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginTop: 20, marginBottom: 16 }}>
            <span style={{
              display: 'inline-block', background: colors.bg, color: colors.color,
              borderRadius: 100, padding: '4px 14px', fontSize: 12, fontWeight: 700,
              fontFamily: 'var(--font-body)',
            }}>
              {post.category}{post.subcategory ? ` · ${post.subcategory}` : ''}
            </span>
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 12, lineHeight: 1.3 }}>
            {post.title}
          </h1>

          {post.target_audience && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>
              {t('blogForAudience')}: {post.target_audience}
            </p>
          )}

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#1F2937', lineHeight: 1.8 }}>
            {paragraphs.map((para, i) => (
              <p key={i} style={{ marginBottom: 20 }}>{para.trim()}</p>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #F0F4FF', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', marginBottom: 16 }}>
              {t('blogCtaText')}
            </p>
            <button onClick={() => navigate('/auth')} style={{
              padding: '12px 32px', background: '#0A1628', color: 'white', border: 'none',
              borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>
              {t('blogCtaBtn')}
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
