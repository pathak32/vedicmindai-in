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
  const { t, language } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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
          setLikeCount(data.likes || 0);
          setLiked(localStorage.getItem(`vedicmind_blog_liked_${data.id}`) === '1');

          sb.from('blog_comments').select('*')
            .eq('post_id', data.id).eq('status', 'approved')
            .order('created_at', { ascending: false })
            .then(({ data: c }) => setComments(c || []));

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

  async function handleLike() {
    if (liked) return; // one like per browser per post, enforced client-side via localStorage
    setLiked(true);
    setLikeCount((c) => c + 1);
    localStorage.setItem(`vedicmind_blog_liked_${post.id}`, '1');
    try {
      const sb = await getSupabase();
      await sb.rpc('increment_blog_likes', { post_slug: post.slug });
    } catch (e) {
      console.warn('Like failed to save (non-critical):', e);
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title} — VedicMindAI`;

  async function handleNativeShare() {
    // Web Share API pops up the phone's real OS share sheet -- every app
    // installed (WhatsApp, Instagram DM, Telegram, Email, etc.), not just
    // the handful we can build explicit buttons for. Falls back to our own
    // menu on desktop browsers that don't support it.
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
      } catch (e) {
        // User cancelled the share sheet -- not an error, do nothing.
      }
    } else {
      setShareMenuOpen((v) => !v);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const sb = await getSupabase();
      const { error } = await sb.from('blog_comments').insert({
        post_id: post.id,
        name: commentName.trim().slice(0, 80),
        comment: commentText.trim().slice(0, 2000),
        status: 'pending',
      });
      if (error) throw error;
      setCommentSubmitted(true);
      setCommentName('');
      setCommentText('');
    } catch (e) {
      console.warn('Comment submit failed:', e);
    } finally {
      setSubmittingComment(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
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

          <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
            <button
              onClick={handleLike}
              disabled={liked}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 100,
                background: liked ? '#EEF2FF' : 'white',
                border: `1px solid ${liked ? '#6366F1' : '#E5E7EB'}`,
                color: liked ? '#4338CA' : '#374151',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                cursor: liked ? 'default' : 'pointer',
              }}
            >
              <span>{liked ? '👍' : '🤍'}</span>
              {liked ? t('blogLikedBtn') : t('blogLikeBtn')}
              {likeCount > 0 && <span style={{ opacity: 0.7 }}>· {likeCount}</span>}
            </button>

            <button
              onClick={handleNativeShare}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 100,
                background: 'white', border: '1px solid #E5E7EB', color: '#374151',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>📤</span>{t('blogShareBtn')}
            </button>

            {shareMenuOpen && (
              <>
                <div
                  onClick={() => setShareMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                />
                <div style={{
                  position: 'absolute', top: '110%', left: 0, zIndex: 50,
                  background: 'white', borderRadius: 12, border: '1px solid #E5E7EB',
                  boxShadow: '0 8px 24px rgba(10,22,40,0.12)', padding: 8, minWidth: 220,
                }}>
                  {[
                    { label: t('blogShareWhatsapp'), icon: '💬', href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
                    { label: t('blogShareFacebook'), icon: '📘', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                    { label: t('blogShareTwitter'), icon: '𝕏', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
                    { label: t('blogShareLinkedin'), icon: '💼', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                  ].map((opt) => (
                    <a
                      key={opt.label} href={opt.href} target="_blank" rel="noopener noreferrer"
                      onClick={() => setShareMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                        borderRadius: 8, textDecoration: 'none', color: '#374151',
                        fontFamily: 'var(--font-body)', fontSize: 14,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 16 }}>{opt.icon}</span>{opt.label}
                    </a>
                  ))}
                  {/* Instagram has no web link-share intent -- copy-link is the standard workaround every site uses */}
                  <button
                    onClick={() => { handleCopyLink(); setShareMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', width: '100%', textAlign: 'left',
                      color: '#374151', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 16 }}>📸</span>{t('blogShareInstagram')}
                  </button>
                  <button
                    onClick={() => { handleCopyLink(); setShareMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', width: '100%', textAlign: 'left',
                      color: '#374151', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: 16 }}>🔗</span>{t('blogCopyLink')}
                  </button>
                </div>
              </>
            )}

            {linkCopied && (
              <span style={{ alignSelf: 'center', fontSize: 13, color: '#059669', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {t('blogLinkCopied')}
              </span>
            )}
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

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #F0F4FF' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
              {t('blogCommentsTitle')} {comments.length > 0 && `(${comments.length})`}
            </h2>

            {commentSubmitted ? (
              <div style={{ padding: 16, borderRadius: 12, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontFamily: 'var(--font-body)', fontSize: 14, marginBottom: 24 }}>
                {t('blogCommentPendingMsg')}
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: 32 }}>
                <input
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder={t('blogCommentNamePlaceholder')}
                  maxLength={80}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }}
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('blogCommentTextPlaceholder')}
                  maxLength={2000}
                  style={{ width: '100%', minHeight: 90, padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentName.trim() || !commentText.trim()}
                  style={{
                    padding: '10px 24px', borderRadius: 10, border: 'none',
                    background: (!commentName.trim() || !commentText.trim()) ? '#D1D5DB' : '#0A1628',
                    color: 'white', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
                    cursor: (submittingComment || !commentName.trim() || !commentText.trim()) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submittingComment ? t('blogCommentSubmitting') : t('blogCommentSubmit')}
                </button>
              </form>
            )}

            {comments.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#9CA3AF' }}>{t('blogCommentEmpty')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comments.map((c) => (
                  <div key={c.id} style={{ padding: 16, borderRadius: 12, background: 'white', border: '1px solid #F0F4FF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628' }}>{c.name}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF' }}>
                        {new Date(c.created_at).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{c.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
