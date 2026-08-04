import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import { useLanguage } from '@/lib/LanguageContext';
import { VEDIC_PHYSICS_CHAPTERS } from '@/data/vedicScienceContent';

const tr = (f, lang) => {
  if (!f) return '';
  if (typeof f === 'string') return f;
  return f[lang] ?? f.en ?? '';
};

const SECTION_META = {
  physics: { emoji: '⚛️', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
};

// ── CONCEPT TAB ───────────────────────────────────────────────────────────
function ConceptTab({ chapter, language }) {
  const meta = SECTION_META[chapter.section] || SECTION_META.physics;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 48px' }}>
      {/* Origin story */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: `1px solid ${meta.color}33`,
        borderRadius: 14, padding: '20px 22px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: meta.color, letterSpacing: 1, marginBottom: 10 }}>
          📖 {language === 'hi' ? 'पृष्ठभूमि' : 'BACKGROUND'}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>
          {tr(chapter.origin, language)}
        </p>
      </div>

      {/* Source */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12, padding: '14px 18px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📜</span>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 4 }}>
            {language === 'hi' ? 'स्रोत' : 'SOURCE'}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
            {tr(chapter.source, language)}
          </p>
        </div>
      </div>

      {/* Key concepts / steps */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: meta.color, letterSpacing: 1, marginBottom: 12 }}>
          🔑 {language === 'hi' ? 'मुख्य अवधारणाएं' : 'KEY CONCEPTS'}
        </div>
        {chapter.steps.map((step, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '16px 18px', marginBottom: 10,
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: meta.color + '33', border: `1px solid ${meta.color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: meta.color,
            }}>
              {i + 1}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6, lineHeight: 1.4 }}>
                {tr(step.text, language)}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, fontStyle: 'italic' }}>
                {tr(step.example, language)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern connection */}
      {chapter.modernConnection && (
        <div style={{
          background: `linear-gradient(135deg, ${meta.color}22, rgba(255,255,255,0.03))`,
          border: `1px solid ${meta.color}44`, borderRadius: 14, padding: '18px 20px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: meta.color, letterSpacing: 1, marginBottom: 10 }}>
            🔬 {language === 'hi' ? 'आधुनिक विज्ञान से संबंध' : 'MODERN CONNECTION'}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0 }}>
            {tr(chapter.modernConnection, language)}
          </p>
        </div>
      )}
    </div>
  );
}

// ── QUIZ TAB ──────────────────────────────────────────────────────────────
function QuizTab({ chapter, language }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const meta = SECTION_META[chapter.section] || SECTION_META.physics;

  const questions = chapter.questions || [];
  const q = questions[current];

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 16px', color: 'rgba(255,255,255,0.5)' }}>
        No questions yet for this chapter.
      </div>
    );
  }

  function handleSelect(optIdx) {
    if (selected !== null) return;
    const isCorrect = tr(q.options[optIdx], language) === tr(q.answer, language) ||
                      q.options[optIdx] === q.answer ||
                      (typeof q.options[optIdx] === 'object' && q.options[optIdx].en === q.answer.en);
    setSelected(optIdx);
    setAnswers(prev => [...prev, isCorrect]);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  if (finished) {
    const score = answers.filter(Boolean).length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 0 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{pct >= 70 ? '🏆' : '📚'}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 6 }}>
          {score}/{questions.length}
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, color: pct >= 70 ? '#10B981' : '#F59E0B', marginBottom: 16 }}>
          {pct}%
        </div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 28 }}>
          {pct >= 70
            ? (language === 'hi' ? 'शानदार! आपने यह अध्याय समझ लिया।' : 'Excellent! You\'ve mastered this chapter.')
            : (language === 'hi' ? 'Concept tab दोबारा पढ़ें और फिर try करें।' : 'Review the Concept tab and try again.')}
        </div>
        <button onClick={handleRetry} style={{
          padding: '12px 28px', borderRadius: 12, background: meta.color,
          color: 'white', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
        }}>
          {language === 'hi' ? 'दोबारा कोशिश करें' : 'Try Again'}
        </button>
      </div>
    );
  }

  // Determine correct option index for highlighting
  const correctIdx = q.options.findIndex(opt =>
    (typeof opt === 'object' ? opt.en : opt) === (typeof q.answer === 'object' ? q.answer.en : q.answer)
  );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 0 48px' }}>
      {/* Progress */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: 'white' }}>
            {language === 'hi' ? `प्रश्न ${current + 1}/${questions.length}` : `Question ${current + 1} of ${questions.length}`}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 0.5, padding: '2px 8px', borderRadius: 4,
            background: q.difficulty === 'easy' ? '#10B98133' : q.difficulty === 'medium' ? '#F59E0B33' : '#EF444433',
            color: q.difficulty === 'easy' ? '#10B981' : q.difficulty === 'medium' ? '#F59E0B' : '#EF4444',
          }}>
            {q.difficulty?.toUpperCase()}
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 100, height: 4 }}>
          <div style={{ width: `${(current / questions.length) * 100}%`, background: meta.color, height: 4, borderRadius: 100, transition: 'width 0.3s' }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}>

          {/* Question */}
          <div style={{
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${meta.color}33`,
            borderRadius: 14, padding: '20px 20px', marginBottom: 16,
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.5 }}>
              {tr(q.q, language)}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {q.options.map((opt, idx) => {
              let bg = 'rgba(255,255,255,0.05)';
              let border = '1px solid rgba(255,255,255,0.12)';
              let color = 'rgba(255,255,255,0.85)';
              if (selected !== null) {
                if (idx === correctIdx) { bg = 'rgba(16,185,129,0.2)'; border = '1.5px solid #10B981'; color = '#6EE7B7'; }
                else if (idx === selected) { bg = 'rgba(239,68,68,0.2)'; border = '1.5px solid #EF4444'; color = '#FCA5A5'; }
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} style={{
                  padding: '14px 16px', borderRadius: 12, border, background: bg, color,
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, textAlign: 'left',
                  cursor: selected !== null ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s',
                }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: selected !== null && idx === correctIdx ? '#10B981' : selected === idx ? '#EF4444' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                    color: selected !== null && (idx === correctIdx || idx === selected) ? 'white' : 'rgba(255,255,255,0.5)',
                  }}>
                    {selected !== null && idx === correctIdx ? '✓' : selected === idx && idx !== correctIdx ? '✗' : String.fromCharCode(65 + idx)}
                  </span>
                  {tr(opt, language)}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {selected !== null && q.exp && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,247,237,0.08)', border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: 12, padding: '14px 16px', marginBottom: 14,
              }}>
              <div style={{ fontSize: 13, color: '#FCD34D', fontWeight: 600, marginBottom: 4 }}>
                💡 {language === 'hi' ? 'व्याख्या' : 'Explanation'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                {tr(q.exp, language)}
              </div>
            </motion.div>
          )}

          {selected !== null && (
            <button onClick={handleNext} style={{
              width: '100%', height: 48, background: meta.color, color: 'white', border: 'none',
              borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {current + 1 >= questions.length
                ? (language === 'hi' ? 'परिणाम देखें →' : 'See Results →')
                : (language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →')}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function VedicScienceChapterPage() {
  const { sectionId, chapterId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [tab, setTab] = useState('concept');

  // Get chapters for this section
  const allChapters = sectionId === 'physics' ? VEDIC_PHYSICS_CHAPTERS : [];
  const chapter = allChapters.find(c => c.id === chapterId);
  const meta = SECTION_META[sectionId] || SECTION_META.physics;

  if (!chapter) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F1E', display: 'flex', flexDirection: 'column' }}>
        <DashboardNavbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Chapter not found</div>
            <button onClick={() => navigate('/vedic-science')} style={{ color: meta.color, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              ← Back to Vedic Science
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabStyle = (active) => ({
    flex: 1, height: 42, border: 'none', borderRadius: 10,
    background: active ? meta.color : 'transparent',
    color: active ? 'white' : 'rgba(255,255,255,0.45)',
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', color: '#F5F3FF' }}>
      <DashboardNavbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 48px' }}>
        <LearnPillarSwitcher active="vedic-science" dark />

        {/* Back button */}
        <button onClick={() => navigate('/vedic-science')} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0,
        }}>
          ← {language === 'hi' ? 'वैदिक विज्ञान' : 'Vedic Science'}
        </button>

        {/* Chapter header */}
        <div style={{
          background: meta.bg, border: `1px solid ${meta.color}33`,
          borderRadius: 16, padding: '20px 22px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: meta.color, letterSpacing: 1 }}>
              ⚛️ {language === 'hi' ? 'वैदिक भौतिकी' : 'VEDIC PHYSICS'} · {language === 'hi' ? `अध्याय ${chapter.order}` : `CHAPTER ${chapter.order}`}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>
            {tr(chapter.title, language)}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            {tr(chapter.subtitle, language)}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, background: 'rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 4, marginBottom: 24,
        }}>
          <button style={tabStyle(tab === 'concept')} onClick={() => setTab('concept')}>
            📖 {language === 'hi' ? 'अवधारणा' : 'Concept'}
          </button>
          <button style={tabStyle(tab === 'quiz')} onClick={() => setTab('quiz')}>
            ⚡ {language === 'hi' ? 'प्रश्नोत्तरी' : 'Quiz'} ({chapter.questions?.length || 0})
          </button>
        </div>

        {tab === 'concept'
          ? <ConceptTab chapter={chapter} language={language} />
          : <QuizTab chapter={chapter} language={language} />
        }
      </div>
    </div>
  );
}
