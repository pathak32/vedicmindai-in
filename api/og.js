// api/og.js — Dynamic Open Graph image generator
// Usage: /api/og?slug=some-blog-slug
// Returns a 1200x630 PNG image optimized for social sharing
// Works for WhatsApp, Facebook, Twitter/X, LinkedIn, Instagram (link in bio)
//
// Design: dark navy card with category color accent, large hook title,
// 2-line excerpt, VedicMindAI branding, and a CTA strip at bottom.

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';

const CATEGORY_COLORS = {
  'Vedic Maths':    { accent: '#3B82F6', badge: '#1D4ED8', emoji: '🧮' },
  'Reasoning':      { accent: '#8B5CF6', badge: '#6D28D9', emoji: '🧠' },
  'Aptitude':       { accent: '#F59E0B', badge: '#B45309', emoji: '📊' },
  'Vedic Science':  { accent: '#10B981', badge: '#047857', emoji: '🔬' },
};

const DEFAULT = { accent: '#6366F1', badge: '#4338CA', emoji: '✨' };

function truncate(str, max) {
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 1) + '…';
}

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    let title = 'VedicMindAI — Ancient Wisdom. Modern Speed.';
    let excerpt = 'Learn Vedic Mathematics, Reasoning & Aptitude with AI personalisation.';
    let category = 'Vedic Maths';

    // Fetch post data from Supabase if slug provided
    if (slug) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=title,content,category`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows?.[0]) {
          title = rows[0].title || title;
          excerpt = rows[0].content?.replace(/\s+/g, ' ').trim().slice(0, 120) || excerpt;
          category = rows[0].category || category;
        }
      }
    }

    const colors = CATEGORY_COLORS[category] || DEFAULT;
    const displayTitle = truncate(title, 72);
    const displayExcerpt = truncate(excerpt, 120);

    return new ImageResponse(
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0A1628 0%, #0D1F3C 60%, #111827 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: `${colors.accent}18`,
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: `${colors.accent}10`,
          display: 'flex',
        }} />

        {/* Top accent bar */}
        <div style={{
          width: '100%', height: '6px',
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.badge})`,
          display: 'flex',
        }} />

        {/* Main content area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '40px 56px 32px',
          position: 'relative',
        }}>

          {/* Brand + Category row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>V</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>
                  VedicMindAI™
                </span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '2px' }}>
                  vedicmindai.in
                </span>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: `${colors.badge}44`,
              border: `1px solid ${colors.accent}66`,
              borderRadius: '100px', padding: '8px 18px',
            }}>
              <span style={{ fontSize: '18px' }}>{colors.emoji}</span>
              <span style={{ color: colors.accent, fontSize: '15px', fontWeight: '700' }}>
                {category}
              </span>
            </div>
          </div>

          {/* Main title */}
          <div style={{
            fontSize: displayTitle.length > 50 ? '36px' : '42px',
            fontWeight: '800',
            color: 'white',
            lineHeight: '1.2',
            marginBottom: '20px',
            maxWidth: '900px',
            display: 'flex',
          }}>
            {displayTitle}
          </div>

          {/* Excerpt */}
          <div style={{
            fontSize: '19px',
            color: 'rgba(255,255,255,0.62)',
            lineHeight: '1.5',
            maxWidth: '820px',
            display: 'flex',
            flex: 1,
          }}>
            {displayExcerpt}
          </div>

          {/* Bottom CTA strip */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.10)',
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['📱 Free App on Google Play', '🌐 vedicmindai.in'].map(text => (
                <span key={text} style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '14px',
                  display: 'flex',
                }}>
                  {text}
                </span>
              ))}
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.badge})`,
              borderRadius: '10px', padding: '10px 24px',
              color: 'white', fontSize: '15px', fontWeight: '700',
              display: 'flex',
            }}>
              Read Full Article →
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    // Fallback — return a simple branded image if anything fails
    return new ImageResponse(
      <div style={{
        width: '1200px', height: '630px',
        background: '#0A1628',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <span style={{ color: 'white', fontSize: '48px', fontWeight: '800' }}>
          VedicMindAI™
        </span>
      </div>,
      { width: 1200, height: 630 }
    );
  }
}
