import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

function StarRow({ stars }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= stars ? '#F59E0B' : '#D1D5DB', fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

export default function FamiliesReviewsSection() {
  const { t } = useLanguage();

  const SAMPLE_REVIEWS = [
    { id: '1', role: 'Parent', name: 'Sunita', city: 'Mumbai', stars: 5, duration: t('durationMonth1'), text: t('familiesReview1Text'), date: '2025-05-10T00:00:00.000Z', approved: true },
    { id: '2', role: 'Student', name: 'Arjun', city: 'Pune', stars: 5, duration: t('durationMonths3'), text: t('familiesReview2Text'), date: '2025-05-18T00:00:00.000Z', approved: true },
    { id: '3', role: 'Parent', name: 'Kavitha', city: 'Chennai', stars: 5, duration: t('durationWeeks2'), text: t('familiesReview3Text'), date: '2025-06-01T00:00:00.000Z', approved: true },
  ];

  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vedicmind_reviews') || '[]');
      const approved = stored.filter(r => r.approved);
      if (approved.length > 0) {
        const top3 = [...approved].sort((a, b) => b.stars - a.stars).slice(0, 3);
        setReviews(top3);
      }
    } catch {}
  }, []);

  const roleColor = { Student: '#DBEAFE', Parent: '#D1FAE5', Guardian: '#EDE9FE' };
  const roleText  = { Student: '#1E40AF', Parent: '#065F46', Guardian: '#5B21B6' };
  const roleLabel = { Student: t('roleStudent'), Parent: t('roleParent'), Guardian: t('roleGuardian') };

  return (
    <section style={{ background: '#F0F4FF', padding: '72px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DBEAFE', borderRadius: 99, padding: '6px 16px', marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#1E40AF' }}>{t('familiesReviewsBadge')}</span>
          </div>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
            {t('familiesReviewsTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', margin: 0 }}>
            {t('familiesReviewsSubtitle')}
          </p>
        </div>

        {/* Cards */}
        <style>{`
          @media(min-width:640px){ .reviews-grid{ grid-template-columns: repeat(3,1fr) !important; } }
        `}</style>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 32 }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(30,64,175,0.12)',
              borderRadius: 16,
              padding: '24px 20px',
              boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
            }}>
              <StarRow stars={r.stars} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', lineHeight: 1.65, margin: '12px 0 16px', fontStyle: 'italic' }}>
                "{r.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#0A1628' }}>{r.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280' }}>{r.city} · {r.duration}</div>
                </div>
                <span style={{
                  background: roleColor[r.role] || '#F0F4FF',
                  color: roleText[r.role] || '#4B5563',
                  borderRadius: 99, padding: '3px 10px', fontSize: 11,
                  fontFamily: 'var(--font-body)', fontWeight: 600,
                }}>
                  {roleLabel[r.role] || r.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/reviews" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 28px', background: 'transparent', color: '#0A1628',
              border: '1.5px solid rgba(10,22,40,0.25)', borderRadius: 10,
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              {t('readAllReviews')}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}