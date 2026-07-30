import React, { useState } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { CURRICULUM } from '@/components/learn/curriculumData';
import { RA_LEVEL1_CHAPTERS } from '@/data/reasoningAptitudeLevel1Content';
import { RA_LEVEL2_CHAPTERS } from '@/data/reasoningAptitudeLevel2Content';
import { useLanguage } from '@/lib/LanguageContext';

const LEVEL_BG = {
  1: '#0A1628',
  2: '#0D2252',
  3: '#1E40AF',
  4: 'linear-gradient(135deg, #0A1628, #1E40AF)',
};

// Levels 3 and 4 are fully designed (docs/reasoning-aptitude-curriculum.md)
// but question content isn't built yet — shown here as real planned
// chapters, locked, with no Preview and no question count (since there's
// no real content to preview or count).
const RA_LEVEL3_TITLES = [
  { en: 'Time, Speed & Distance', hi: 'समय, गति और दूरी' },
  { en: 'Time & Work', hi: 'समय और कार्य' },
  { en: 'Compound Interest', hi: 'चक्रवृद्धि ब्याज' },
  { en: 'Mixture & Alligation', hi: 'मिश्रण और एलिगेशन' },
  { en: 'HCF & LCM Applications', hi: 'HCF और LCM के अनुप्रयोग' },
  { en: 'Syllogisms (Basic)', hi: 'न्यायवाक्य (मूल)' },
  { en: 'Seating Arrangement (Linear)', hi: 'बैठक व्यवस्था (रैखिक)' },
  { en: 'Data Interpretation (Bar/Pie Basics)', hi: 'डेटा व्याख्या (बार/पाई मूल)' },
  { en: 'Number System (Divisibility, Remainders)', hi: 'संख्या पद्धति (विभाज्यता, शेषफल)' },
  { en: 'Statement & Conclusion', hi: 'कथन और निष्कर्ष' },
];
const RA_LEVEL4_TITLES = [
  { en: 'Seating Arrangement (Circular & Complex)', hi: 'बैठक व्यवस्था (वृत्ताकार और जटिल)' },
  { en: 'Puzzles (Multi-Variable)', hi: 'पहेलियां (बहु-चर)' },
  { en: 'Permutation & Combination (Basics)', hi: 'क्रमचय और संचय (मूल)' },
  { en: 'Probability (Basics)', hi: 'प्रायिकता (मूल)' },
  { en: 'Advanced Data Interpretation', hi: 'उन्नत डेटा व्याख्या' },
  { en: 'Syllogisms (Advanced)', hi: 'न्यायवाक्य (उन्नत)' },
  { en: 'Cause & Effect / Critical Reasoning', hi: 'कारण और प्रभाव / क्रिटिकल रीजनिंग' },
  { en: 'Mensuration (Applied)', hi: 'क्षेत्रमिति (अनुप्रयुक्त)' },
  { en: 'Algebra-Based Reasoning', hi: 'बीजगणित-आधारित तर्क' },
  { en: 'Mixed Competitive Aptitude (Capstone)', hi: 'मिश्रित प्रतियोगी एप्टीट्यूड (कैप्स्टोन)' },
];
const toChapterShape = (titles, prefix) => titles.map((title, i) => ({ id: `${prefix}-${i}`, title }));

// Real questions for the inline chapter/lesson preview (Item: "solve it in
// 3 seconds" for Vedic Maths, no answer shown; worked example with answer
// highlighted for Reasoning). Pulled directly from the real, verified
// question banks already used elsewhere in the app — not invented.
// l1_01 ("Introduction to Vedic Mathematics") intentionally has no entry:
// an overview lesson doesn't need a preview question.
const VEDIC_L1_PREVIEW = {
  l1_02: { question: 'What is 45²?', options: ['1925', '2005', '2025', '2125'] },
  l1_03: { question: 'Calculate 9 × 8 using Nikhilam', options: ['70', '72', '74', '68'] },
  l1_04: { question: 'Calculate 93 × 92', options: ['8456', '8556', '8656', '8356'] },
  l1_05: { question: 'Calculate 993 × 992', options: ['983056', '984056', '985056', '986056'] },
  l1_06: { question: 'The digit sum of 7654 is?', options: ['4', '13', '22', '7'] },
  l1_07: { question: 'Calculate 13 × 14 using Urdhva', options: ['172', '182', '192', '162'] },
  l1_08: { question: 'Calculate 56 × 11', options: ['606', '616', '626', '596'] },
  l1_09: { question: 'Calculate 34 × 9', options: ['296', '306', '316', '286'] },
};
const REASONING_L1_PREVIEW = {
  'odd-one-out': { question: 'Which one does not belong: Apple, Banana, Carrot, Mango?', options: ['Apple', 'Banana', 'Carrot', 'Mango'], answer: 'Carrot' },
  'number-series-basic': { question: '2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], answer: '10' },
  'analogies-basic': { question: 'Hand is to Glove as Foot is to ?', options: ['Shoe', 'Sock', 'Leg', 'Knee'], answer: 'Shoe' },
  'ranking-ordering': { question: 'Rahul is taller than Priya. Priya is taller than Aman. Who is the shortest?', options: ['Rahul', 'Priya', 'Aman'], answer: 'Aman' },
  'direction-basic': { question: 'You walk 5m North, then turn right. Which direction are you facing now?', options: ['East', 'West', 'South', 'North'], answer: 'East' },
  'coding-decoding-basic': { question: 'If CAT is coded as DBU, how is DOG coded?', options: ['EPH', 'EPI', 'FPH', 'DPH'], answer: 'EPH' },
  'blood-relations-basic': { question: '"This is my father\'s son, but not me." Who is it?', options: ['Brother', 'Uncle', 'Cousin', 'Father'], answer: 'Brother' },
  'calendar-basics': { question: 'If today is Monday, what day will it be after 10 days?', options: ['Wednesday', 'Thursday', 'Friday'], answer: 'Thursday' },
  'mirror-images-basic': { question: 'In a mirror, the letter "b" looks like which letter?', options: ['d', 'p', 'q'], answer: 'd' },
  'pattern-completion': { question: 'A square, then a circle, then a square, then a circle. What comes next?', options: ['Square', 'Circle', 'Triangle'], answer: 'Square' },
};

export default function CurriculumPage() {
  useCanonical('/curriculum');
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [pillar, setPillar] = useState('vedic'); // vedic | reasoning | aptitude
  const [previewOpen, setPreviewOpen] = useState(null); // lesson/chapter id with its inline preview expanded

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />

      {/* Lesson/chapter grid — always available regardless of which pillar
          tab is active, since this used to live inside the Vedic-only
          block and silently had no effect on the Reasoning tab. */}
      <style>{`
        .lesson-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media (max-width: 767px) { .lesson-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) and (max-width: 1023px) { .lesson-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

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

        {/* Pillar Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { id: 'vedic', label: t('curriculumTabVedic') },
            { id: 'reasoning', label: t('curriculumTabReasoning') },
            { id: 'aptitude', label: t('curriculumTabAptitude') },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPillar(p.id)}
              style={{
                padding: '10px 20px', borderRadius: 100,
                border: pillar === p.id ? 'none' : '1.5px solid rgba(30,64,175,0.15)',
                background: pillar === p.id ? '#0A1628' : 'white',
                color: pillar === p.id ? 'white' : '#4B5563',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Vedic Mathematics */}
        {pillar === 'vedic' && (
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
              <div className="lesson-grid">
                {level.lessons.map((lesson, idx) => {
                  const num = idx + 1;
                  const locked = level.level > 1;
                  return (
                    <div key={lesson.id} style={{
                      background: 'white', border: '1px solid rgba(30,64,175,0.12)',
                      borderRadius: 12, padding: 16,
                      opacity: locked ? 0.75 : 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
                          {!locked && VEDIC_L1_PREVIEW[lesson.id] && (
                            <button onClick={() => setPreviewOpen(previewOpen === lesson.id ? null : lesson.id)}
                              style={{ marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, color: '#3B82F6', padding: 0 }}>
                              {previewOpen === lesson.id ? t('curriculumHidePreview') : t('curriculumPreview')}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline "solve it in 3 seconds" challenge — no answer shown */}
                      {previewOpen === lesson.id && VEDIC_L1_PREVIEW[lesson.id] && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(30,64,175,0.15)' }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                            {t('curriculumSolveIt')}
                          </p>
                          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: '#0A1628', marginBottom: 10 }}>
                            {VEDIC_L1_PREVIEW[lesson.id].question}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {VEDIC_L1_PREVIEW[lesson.id].options.map(opt => (
                              <span key={opt} style={{
                                background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)',
                                borderRadius: 8, padding: '6px 12px', fontFamily: 'var(--font-body)',
                                fontSize: 13, color: '#0A1628',
                              }}>
                                {opt}
                              </span>
                            ))}
                          </div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 10, fontStyle: 'italic' }}>
                            {t('curriculumSignUpForAnswer')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Intelligent Reasoning — all 4 levels */}
        {pillar === 'reasoning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {[
            { level: 1, name: language === 'hi' ? 'फाउंडेशन' : 'Foundation', icon: '🌱', chapters: RA_LEVEL1_CHAPTERS, locked: false, hasContent: true },
            { level: 2, name: language === 'hi' ? 'इंटरमीडिएट' : 'Intermediate', icon: '📈', chapters: RA_LEVEL2_CHAPTERS, locked: true, hasContent: true },
            { level: 3, name: language === 'hi' ? 'गहन अभ्यास' : 'Real Depth', icon: '⚡', chapters: toChapterShape(RA_LEVEL3_TITLES, 'l3'), locked: true, hasContent: false },
            { level: 4, name: language === 'hi' ? 'प्रतियोगी महारत' : 'Competitive Mastery', icon: '👑', chapters: toChapterShape(RA_LEVEL4_TITLES, 'l4'), locked: true, hasContent: false },
          ].map((lvl, li) => (
            <motion.div key={lvl.level} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: li * 0.08 }}>
              <div style={{
                background: LEVEL_BG[lvl.level], borderRadius: 16, padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12, marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{lvl.icon}</span>
                  <span className="font-heading" style={{ fontSize: 'clamp(18px,3vw,22px)', fontWeight: 700, color: 'white' }}>
                    {t('curriculumLevelWord')} {lvl.level} — {lvl.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    {lvl.chapters.length} {t('curriculumLessonsCount')}
                  </span>
                  {lvl.locked && (
                    <span style={{
                      background: 'rgba(255,255,255,0.1)', color: 'white',
                      borderRadius: 100, padding: '4px 14px',
                      fontFamily: 'var(--font-body)', fontSize: 12,
                    }}>
                      {lvl.hasContent ? t('curriculumLockedMsg') : t('curriculumAptitudeComingSoonTitle')}
                    </span>
                  )}
                </div>
              </div>

              <div className="lesson-grid">
                {lvl.chapters.map((chapter, idx) => (
                  <div key={chapter.id} style={{
                    background: 'white', border: '1px solid rgba(30,64,175,0.12)',
                    borderRadius: 12, padding: 16,
                    opacity: lvl.locked ? 0.75 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#F0F4FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12,
                        color: '#0A1628', flexShrink: 0,
                      }}>
                        {lvl.locked ? '🔒' : idx + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', lineHeight: 1.4 }}>
                          {chapter.title[language] || chapter.title.en}
                        </span>
                        {!lvl.locked && REASONING_L1_PREVIEW[chapter.id] && (
                          <div>
                            <button onClick={() => setPreviewOpen(previewOpen === chapter.id ? null : chapter.id)}
                              style={{ marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, color: '#3B82F6', padding: 0 }}>
                              {previewOpen === chapter.id ? t('curriculumHidePreview') : t('curriculumPreview')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline worked example — correct answer highlighted so the
                        chapter's meaning is instantly clear even without knowing
                        the term "Odd One Out" etc. */}
                    {previewOpen === chapter.id && REASONING_L1_PREVIEW[chapter.id] && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(30,64,175,0.15)' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                          {t('curriculumWorkedExample')}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: '#0A1628', marginBottom: 10 }}>
                          {REASONING_L1_PREVIEW[chapter.id].question}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {REASONING_L1_PREVIEW[chapter.id].options.map(opt => {
                            const isAnswer = opt === REASONING_L1_PREVIEW[chapter.id].answer;
                            return (
                              <span key={opt} style={{
                                background: isAnswer ? '#D1FAE5' : '#F3F4F6',
                                border: isAnswer ? '1.5px solid #10B981' : '1px solid rgba(30,64,175,0.1)',
                                color: isAnswer ? '#065F46' : '#4B5563',
                                fontWeight: isAnswer ? 700 : 400,
                                borderRadius: 8, padding: '6px 12px', fontFamily: 'var(--font-body)', fontSize: 13,
                              }}>
                                {isAnswer ? '✓ ' : ''}{opt}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Mindful Aptitude — Coming Soon */}
        {pillar === 'aptitude' && (
          <div style={{
            background: 'white', border: '1px dashed rgba(30,64,175,0.25)',
            borderRadius: 20, padding: '60px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
              {t('curriculumAptitudeComingSoonTitle')}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563', maxWidth: 440, margin: '0 auto' }}>
              {t('curriculumAptitudeComingSoonDesc')}
            </p>
          </div>
        )}

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
