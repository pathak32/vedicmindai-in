import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

export default function ReasoningIndexPage() {
  const { language } = useLanguage();
  const chapters = [...RA_LEVEL1_CHAPTERS].sort((a, b) => a.order - b.order);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#DBEAFE', color: '#1E40AF', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 16 }}>
          {language === 'hi' ? 'लेवल 1 · शुरुआती' : 'LEVEL 1 · BEGINNER'}
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {language === 'hi' ? 'रीज़निंग व एप्टीट्यूड' : 'Reasoning & Aptitude'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', marginBottom: 28, lineHeight: 1.6 }}>
          {language === 'hi'
            ? 'तार्किक सोच को कदम-दर-कदम बनाएं — वर्गीकरण, संख्या श्रृंखला, दिशा-ज्ञान और बहुत कुछ। हर अध्याय पूरा करके अगले पर आगे बढ़ें।'
            : 'Build logical thinking step by step — classification, number series, direction sense, and more. Complete each chapter to unlock mastery.'}
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          {chapters.map((c) => (
            <Link
              key={c.id}
              to={`/reasoning/${c.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'white', borderRadius: 14, padding: '16px 20px',
                boxShadow: '0 2px 10px rgba(10,22,40,0.05)', textDecoration: 'none',
                border: '1px solid #EEF2FF',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {c.order}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: '#0A1628' }}>
                    {tr(c.title, language)}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B7280', marginTop: 4, marginLeft: 38 }}>
                  {tr(c.subtitle, language)}
                </p>
              </div>
              <span style={{ color: '#9CA3AF', fontSize: 18, flexShrink: 0 }}>›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
