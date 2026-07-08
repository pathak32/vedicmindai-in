import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';

const PILLARS = [
  { id: 'vedic-maths', path: '/learn', emoji: '📘', label: { en: 'Vedic Maths', hi: 'वैदिक गणित' } },
  { id: 'reasoning',   path: '/reasoning', emoji: '🧠', label: { en: 'Intelligent Reasoning', hi: 'बौद्धिक तर्क' } },
  { id: 'aptitude',    path: '/aptitude', emoji: '🎯', label: { en: 'Mindful Aptitude', hi: 'माइंडफुल एप्टीट्यूड' } },
];

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

// Rendered at the top of each of the 3 Learn pillars so students always know
// there are exactly three sections and which one they're currently in —
// more coming later (flagged, not built), but this keeps today's app legible.
export default function LearnPillarSwitcher({ active, dark }) {
  const { language } = useLanguage();
  const border = dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB';

  return (
    <div style={{
      display: 'flex', gap: 8, flexWrap: 'wrap',
      padding: '10px 12px', marginBottom: 20,
      background: dark ? 'rgba(255,255,255,0.03)' : '#F8FAFF',
      border: `1px solid ${border}`, borderRadius: 14,
    }}>
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
        color: dark ? '#8B85AD' : '#9CA3AF', textTransform: 'uppercase',
        alignSelf: 'center', paddingLeft: 4, paddingRight: 4,
      }}>
        {language === 'hi' ? 'सीखें' : 'Learn'}
      </span>
      {PILLARS.map((p) => {
        const isActive = p.id === active;
        return (
          <Link
            key={p.id}
            to={p.path}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 99, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              background: isActive ? (dark ? '#A78BFA' : '#0A1628') : 'transparent',
              color: isActive ? (dark ? '#1E0B4B' : 'white') : (dark ? '#B8B2D6' : '#4B5563'),
              border: `1px solid ${isActive ? 'transparent' : border}`,
            }}
          >
            <span>{p.emoji}</span>
            {tr(p.label, language)}
          </Link>
        );
      })}
    </div>
  );
}
