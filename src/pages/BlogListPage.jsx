import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function BlogListPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    document.title = 'Blog — VedicMindAI™';
    (async () => {
      try {
        const sb = await getSupabase();
        const { data } = await sb.from('blog_posts')
          .select('*').eq('status', 'published')
          .order('published_at', { ascending: false });
        setPosts(data || []);
      } catch (e) {
        console.error('Failed to load blog posts:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ['All', 'Vedic Maths', 'Reasoning', 'Aptitude'];
  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '96px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(28px,5vw,38px)', fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            {t('blogPageTitle')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563' }}>
            {t('blogPageSubtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '8px 18px', borderRadius: 100,
                border: filter === c ? 'none' : '1.5px solid rgba(30,64,175,0.15)',
                background: filter === c ? '#0A1628' : 'white',
                color: filter === c ? 'white' : '#4B5563',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#6B7280' }}>{t('loadingText')}</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <p style={{ fontFamily: 'var(--font-body)', color: '#6B7280' }}>{t('blogEmptyState')}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((post, i) => {
            const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Vedic Maths'];
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white', borderRadius: 16, padding: 22, height: '100%',
                    border: '1px solid rgba(30,64,175,0.1)', boxShadow: '0 4px 16px rgba(10,22,40,0.05)',
                  }}>
                    <span style={{
                      display: 'inline-block', background: colors.bg, color: colors.color,
                      borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700,
                      fontFamily: 'var(--font-body)', marginBottom: 12,
                    }}>
                      {post.category}{post.subcategory ? ` · ${post.subcategory}` : ''}
                    </span>
                    <h3 className="font-heading" style={{ fontSize: 17, fontWeight: 700, color: '#0A1628', marginBottom: 8, lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                      {post.content.slice(0, 130)}…
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
