import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {pieces.map(i => (
        <motion.div key={i}
          initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 20, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: 'linear' }}
          style={{ position: 'absolute', width: 8, height: 8, borderRadius: Math.random() > 0.5 ? '50%' : 2, background: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}

export default function DemoPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const QUESTIONS = [
    { id: 1, topic: t('demoQ1Topic'), question: t('demoQ1Question'), hint: t('demoQ1Hint'),
      options: [t('demoQ1OptA'), t('demoQ1OptB'), t('demoQ1OptC'), t('demoQ1OptD')], correct: 1 },
    { id: 2, topic: t('demoQ2Topic'), question: t('demoQ2Question'), hint: t('demoQ2Hint'),
      options: [t('demoQ2OptA'), t('demoQ2OptB'), t('demoQ2OptC'), t('demoQ2OptD')], correct: 0 },
    { id: 3, topic: t('demoQ3Topic'), question: t('demoQ3Question'), hint: t('demoQ3Hint'),
      options: [t('demoQ3OptA'), t('demoQ3OptB'), t('demoQ3OptC'), t('demoQ3OptD')], correct: 2 },
  ];

  const TECHNIQUES = [
    { name: t('demoTech1Name'), desc: t('demoTech1Desc') },
    { name: t('demoTech2Name'), desc: t('demoTech2Desc') },
    { name: t('demoTech3Name'), desc: t('demoTech3Desc') },
  ];

  const q = QUESTIONS[current];

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore(s => s + 1);
    setTimeout(() => setShowNext(true), 1000);
  };

  const handleNext = () => {
    if (current < 2) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowNext(false);
    } else {
      setDone(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getOptionStyle = (idx) => {
    const base = {
      width: '100%', minHeight: 52, border: '1.5px solid rgba(30,64,175,0.15)',
      borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16,
      textAlign: 'left', padding: '0 20px', cursor: selected !== null ? 'default' : 'pointer',
      background: 'white', color: '#0A1628', transition: 'all 0.2s',
    };
    if (selected === null) return base;
    if (idx === q.correct) return { ...base, background: '#D1FAE5', border: '1.5px solid #10B981', color: '#065F46' };
    if (idx === selected && idx !== q.correct) return { ...base, background: '#FEE2E2', border: '1.5px solid #EF4444', color: '#991B1B' };
    return { ...base, opacity: 0.5 };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      <LandingNavbar />
      {showConfetti && <Confetti />}

      {/* Hero */}
      <div style={{ background: '#0A1628', padding: '80px 24px 40px', textAlign: 'center' }}>
        <h1 className="font-heading" style={{ fontSize: 'clamp(24px,5vw,32px)', fontWeight: 700, color: 'white', marginBottom: 12 }}>
          {t('demoHeroTitle')}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 16, maxWidth: 500, margin: '0 auto 16px' }}>
          {t('demoHeroSubtitle')}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          {t('demoHeroChecklist')}
        </p>
      </div>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 60px' }}>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}
              style={{ ...glass, padding: 28 }}>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                  {t('demoQuestionOf')} {current + 1} {t('demoOf3')}
                </span>
                <span style={{ background: '#F0F4FF', color: '#4B5563', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--font-body)', fontSize: 12 }}>
                  {q.topic}
                </span>
              </div>

              {/* Question */}
              <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', margin: '0 0 16px' }}>
                {q.question}
              </h2>

              {/* Hint */}
              <div style={{ background: 'white', borderLeft: '4px solid #3B82F6', borderRadius: '0 12px 12px 0', padding: 16, marginBottom: 20 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', margin: 0, lineHeight: 1.6 }}>{q.hint}</p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {q.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleSelect(idx)} style={getOptionStyle(idx)}>{opt}</button>
                ))}
              </div>

              {/* Result message */}
              {selected !== null && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 14, margin: '0 0 12px', color: selected === q.correct ? '#065F46' : '#991B1B' }}>
                  {selected === q.correct ? t('demoCorrectMsg') : t('demoWrongMsg')}
                </motion.p>
              )}

              {showNext && (
                <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  style={{ width: '100%', minHeight: 48, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  {current < 2 ? t('demoNextQuestion') : t('demoSeeResults')}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              style={{ ...glass, padding: 32, textAlign: 'center' }}>
              <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
                {t('demoDoneTitle')}
              </h2>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, color: '#3B82F6', margin: '12px 0 24px' }}>
                {score}/3 {t('demoCorrectCount')}
              </p>

              {/* Technique cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 28, textAlign: 'left' }}>
                {TECHNIQUES.map(tech => (
                  <div key={tech.name} style={{ background: '#F0F4FF', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#0A1628', marginBottom: 4 }}>{tech.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#4B5563' }}>{tech.desc}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: '#0A1628', marginBottom: 16 }}>
                {t('demoMoreTechniques')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => navigate('/auth')}
                  style={{ width: '100%', minHeight: 52, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                  {t('demoStartLearningBtn')}
                </button>
                <button onClick={() => navigate('/curriculum')}
                  style={{ width: '100%', minHeight: 52, background: 'white', color: '#0A1628', border: '1.5px solid #0A1628', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  {t('demoViewCurriculumBtn')}
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>
                {t('demoFooterNote')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
