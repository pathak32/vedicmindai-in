import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

export default function FeaturesShowcaseSection() {
  const { t } = useLanguage();
  const [lifeSkillsTrack, setLifeSkillsTrack] = useState('student');

  const lifeSkillsExamples = {
    student: { title: t('showcaseLifeSkillsExampleTitle'), body: t('showcaseLifeSkillsExampleBody') },
    parent: { title: t('showcaseParentExampleTitle'), body: t('showcaseParentExampleBody') },
    teacher: { title: t('showcaseTeacherExampleTitle'), body: t('showcaseTeacherExampleBody') },
  };
  const currentLifeSkillsExample = lifeSkillsExamples[lifeSkillsTrack];

  const cards = [
    {
      emoji: '🌱',
      title: t('showcaseLifeSkillsTitle'),
      desc: t('showcaseLifeSkillsDesc'),
      badge: t('showcaseLifeSkillsBadge'),
      link: '/life-skills',
      accent: '#10B981',
      accentBg: '#ECFDF5',
      isLifeSkills: true,
      exampleTitle: currentLifeSkillsExample.title,
      exampleBody: currentLifeSkillsExample.body,
      restNote: t('showcaseLifeSkillsRest'),
    },
    {
      emoji: '📝',
      title: t('showcaseScreenlessTitle'),
      desc: t('showcaseScreenlessDesc'),
      badge: t('showcaseScreenlessBadge'),
      link: '/screenless',
      accent: '#3B82F6',
      accentBg: '#EFF6FF',
      exampleTitle: t('showcaseScreenlessExampleTitle'),
      exampleBody: t('showcaseScreenlessExampleBody'),
      restNote: t('showcaseScreenlessRest'),
    },
  ];

  return (
    <section style={{ background: 'white', padding: '80px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('showcaseSectionLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: '#0A1628', margin: 0 }}>
            {t('showcaseSectionTitle')}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                border: '1px solid rgba(30,64,175,0.12)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: card.accentBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 16,
              }}>
                {card.emoji}
              </div>
              <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 16 }}>
                {card.desc}
              </p>
              <span style={{
                display: 'inline-block', background: card.accentBg, color: card.accent,
                borderRadius: 100, padding: '4px 12px', fontSize: 12, fontWeight: 600,
                fontFamily: 'var(--font-body)', marginBottom: 20,
              }}>
                {card.badge}
              </span>

              {/* Student/Parent/Teacher track selector — Life Skills only */}
              {card.isLifeSkills && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {[
                    { id: 'student', label: t('showcaseTrackStudent') },
                    { id: 'parent', label: t('showcaseTrackParent') },
                    { id: 'teacher', label: t('showcaseTrackTeacher') },
                  ].map(track => (
                    <button
                      key={track.id}
                      onClick={() => setLifeSkillsTrack(track.id)}
                      style={{
                        flex: 1, padding: '6px 8px', borderRadius: 8,
                        border: lifeSkillsTrack === track.id ? 'none' : '1px solid rgba(16,185,129,0.25)',
                        background: lifeSkillsTrack === track.id ? '#10B981' : 'white',
                        color: lifeSkillsTrack === track.id ? 'white' : '#4B5563',
                        fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {track.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Real example preview */}
              <div style={{
                background: '#F8FAFF', borderLeft: `3px solid ${card.accent}`,
                borderRadius: '0 12px 12px 0', padding: '14px 16px', marginBottom: 16,
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: card.accent,
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
                }}>
                  {t('showcaseExampleLabel')}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#0A1628', marginBottom: 6 }}>
                  {card.exampleTitle}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                  {card.exampleBody}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginBottom: 18 }}>
                {card.restNote}
              </p>

              <div>
                <Link to={card.link} style={{
                  display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: 14,
                  fontWeight: 600, color: card.accent, textDecoration: 'none',
                }}>
                  {t('showcaseLearnMore')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
