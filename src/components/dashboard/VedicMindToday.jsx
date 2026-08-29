import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

// VedicMind Today — the live "what's happening" feed on the dashboard.
// Three panels:
//   1. Live numbers: active users today, daily quiz count, blog posts this week
//   2. Announcements: admin-posted cards (new videos, features, events)
//   3. Latest blog posts: 3 most recent, tap to open in browser

export default function VedicMindToday() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const sb = await getSupabase();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

      const [
        { count: activeToday },
        { count: quizzesToday },
        { count: blogsThisWeek },
        { data: announceData },
        { data: blogData },
      ] = await Promise.all([
        sb.from('site_visits')
          .select('*', { count: 'exact', head: true })
          .gte('visited_at', weekAgo.toISOString()),
        sb.from('daily_quiz_results')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo.toISOString()),
        sb.from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('published_at', weekAgo.toISOString()),
        sb.from('announcements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(5),
        sb.from('blog_posts')
          .select('title, slug, category, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3),
      ]);

      setStats({
        activeToday: activeToday || 0,
        quizzesToday: quizzesToday || 0,
        blogsThisWeek: blogsThisWeek || 0,
      });
      setAnnouncements(announceData || []);
      setBlogs(blogData || []);
    } catch (e) {
      // Non-critical — announcements table may not exist yet
      console.warn('VedicMindToday load failed (non-critical):', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null;

  const CATEGORY_COLOR = {
    'Vedic Maths': '#1E40AF',
    'Reasoning': '#5B21B6',
    'Aptitude': '#92400E',
  };

  return (
    <div style={{
      marginBottom: 20,
      background: 'linear-gradient(135deg, #0A1628 0%, #0D2252 100%)',
      borderRadius: 16,
      padding: '18px 18px 14px',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: '#10B981',
          boxShadow: '0 0 0 3px rgba(16,185,129,0.25)',
          animation: 'pulse 2s infinite',
        }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#F5F3FF', margin: 0 }}>
          VedicMind Today
        </h2>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>

      {/* Live stats row */}
      {stats && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { icon: '👥', value: stats.activeToday, label: 'Active this week' },
            { icon: '⚡', value: stats.quizzesToday, label: 'Quizzes this week' },
            { icon: '📝', value: stats.blogsThisWeek, label: 'New blogs this week' },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{
              flex: 1, minWidth: 90,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 12, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#F5F3FF', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {announcements.map(a => (
            <div key={a.id} style={{
              background: a.type === 'video'
                ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.15))'
                : a.type === 'feature'
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(6,95,70,0.15))'
                  : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, padding: '12px 14px', marginBottom: 8,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>
                {a.type === 'video' ? '🎬' : a.type === 'feature' ? '✨' : a.type === 'blog' ? '📝' : '📣'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F3FF', marginBottom: 3 }}>
                  {a.title}
                </div>
                {a.body && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    {a.body}
                  </div>
                )}
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block', marginTop: 6, fontSize: 11,
                      color: '#93C5FD', textDecoration: 'none', fontWeight: 600,
                    }}
                  >
                    View →
                  </a>
                )}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: 2 }}>
                {a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Latest blog posts */}
      {blogs.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
            Latest from the Blog
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {blogs.map(b => (
              <div
                key={b.slug}
                onClick={() => navigate(`/blog/${b.slug}`)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '10px 14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 100,
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  background: 'rgba(99,102,241,0.25)', color: '#A5B4FC',
                }}>
                  {b.category}
                </span>
                <div style={{
                  flex: 1, fontSize: 12, fontWeight: 600, color: '#E0E7FF',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {b.title}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                  {b.published_at ? new Date(b.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                </div>
              </div>
            ))}
          </div>
          <div
            onClick={() => navigate('/blog')}
            style={{
              marginTop: 8, textAlign: 'center', fontSize: 12,
              color: '#93C5FD', cursor: 'pointer', fontWeight: 600,
              padding: '6px 0',
            }}
          >
            See all articles →
          </div>
        </div>
      )}
    </div>
  );
}
