import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { CURRICULUM } from '@/components/learn/curriculumData';
import { useLanguage } from '@/lib/LanguageContext';

const LEVEL_BG = {
  1: '#0A1628',
  2: '#0D2252',
  3: '#1E40AF',
  4: 'linear-gradient(135deg, #0A1628, #1E40AF)',
};

export default function CurriculumPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 16px 60px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-heading" style={{ fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
            {t('curriculumHeroTitle')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4B5563', marginBottom: 24 }}>
            {t('curriculumHeroSubtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[t('curriculumStat1'), t('curriculumStat2'), t('curriculumStat3')].map(stat => (
              <div key={stat} style={{
                background: 'white', border: '1px solid rgba(30,64,175,0.15)',
                borderRadius: 12, padding: '12px 20px',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628',
              }}>
                {stat}
              </div>
            ))}
          </div>
        </div>

        {/* Level Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {CURRICULUM.map((level, li) => (
            <motion.div key={level.level} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: li * 0.08 }}>
              {/* Level Header */}
              <div style={{
                background: LEVEL_BG[level.level], borderRadius: 16, padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12, marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{level.icon}</span>
                  <span className="font-heading" style={{ fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, color: 'white' }}>
                    {t('curriculumLevelWord')} {level.level} — {level.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    {level.lessons.length} {t('curriculumLessonsCount')}
                  </span>
                  {level.lockKey && (
                    <span style={{
                      background: 'rgba(255,255,255,0.1)', color: 'white',
                      borderRadius: 100, padding: '4px 14px',
                      fontFamily: 'var(--font-body)', fontSize: 12,
                    }}>
                      {t('curriculumLockedMsg')}
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson Grid */}
              <style>{`
                .lesson-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                @media (max-width: 767px) { .lesson-grid { grid-template-columns: 1fr; } }
                @media (min-width: 768px) and (max-width: 1023px) { .lesson-grid { grid-template-columns: repeat(2, 1fr); } }
              `}</style>
              <div className="lesson-grid">
                {level.lessons.map((lesson, idx) => {
                  const num = idx + 1;
                  const locked = level.level > 1;
                  return (
                    <div key={lesson.id} style={{
                      background: 'white', border: '1px solid rgba(30,64,175,0.12)',
                      borderRadius: 12, padding: 16,
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      opacity: locked ? 0.75 : 1,
                    }}>
                      {/* Number circle */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#F0F4FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
                        color: '#0A1628', flexShrink: 0,
                      }}>
                        {locked ? '🔒' : num}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', lineHeight: 1.4 }}>
                            {lesson.title}
                          </span>
                          <span style={{
                            background: '#FEF3C7', borderRadius: 100, padding: '2px 10px',
                            fontFamily: 'var(--font-body)', fontSize: 12, color: '#92400E',
                            whiteSpace: 'nowrap', flexShrink: 0,
                          }}>
                            +{lesson.xp} XP
                          </span>
                        </div>
                        {!locked && (
                          <button onClick={() => navigate('/demo')}
                            style={{ marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, color: '#3B82F6', padding: 0 }}>
                            {t('curriculumPreview')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          background: '#0A1628', borderRadius: 20, padding: '48px 24px',
          textAlign: 'center', margin: '48px 0',
        }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
            {t('curriculumCtaTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
            {t('curriculumCtaSubtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/auth')}
              style={{ minHeight: 48, padding: '0 28px', background: 'white', color: '#0A1628', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              {t('curriculumCtaBtn1')}
            </button>
            <button onClick={() => navigate('/demo')}
              style={{ minHeight: 48, padding: '0 28px', background: 'transparent', color: 'white', border: '1.5px solid white', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              {t('curriculumCtaBtn2')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}