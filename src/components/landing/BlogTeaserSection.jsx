import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

const CATEGORY_COLORS = {
  'Vedic Maths': { bg: '#DBEAFE', color: '#1E40AF' },
  'Reasoning': { bg: '#EDE9FE', color: '#5B21B6' },
  'Aptitude': { bg: '#FEF3C7', color: '#92400E' },
};

export default function BlogTeaserSection() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const sb = await getSupabase();
        const { data } = await sb.from('blog_posts')
          .select('*').eq('status', 'published')
          .order('published_at', { ascending: false }).limit(3);
        setPosts(data || []);
      } catch (e) { /* silent — teaser just won't show if it fails */ }
    })();
  }, []);

  // No published posts yet — don't show an empty section on the homepage.
  if (posts.length === 0) return null;

  return (
    <section style={{ background: '#F8FAFF', padding: '80px 0' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('blogTeaserLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: '#0A1628', margin: 0 }}>
            {t('blogTeaserTitle')}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
          {posts.map((post, i) => {
            const colors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['Vedic Maths'];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white', borderRadius: 16, padding: 20, height: '100%',
                    border: '1px solid rgba(30,64,175,0.1)', boxShadow: '0 4px 16px rgba(10,22,40,0.05)',
                  }}>
                    <span style={{
                      display: 'inline-block', background: colors.bg, color: colors.color,
                      borderRadius: 100, padding: '3px 12px', fontSize: 11, fontWeight: 700,
                      fontFamily: 'var(--font-body)', marginBottom: 10,
                    }}>
                      {post.category}
                    </span>
                    <h3 className="font-heading" style={{ fontSize: 15, fontWeight: 700, color: '#0A1628', lineHeight: 1.4, margin: 0 }}>
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/blog" style={{
            display: 'inline-block', padding: '10px 24px', background: 'transparent',
            color: '#0A1628', border: '1.5px solid rgba(10,22,40,0.2)', borderRadius: 10,
            textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
          }}>
            {t('blogViewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
