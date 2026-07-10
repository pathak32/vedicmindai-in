import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Menu, ArrowLeft, Lock } from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import ReasoningSidebar from '@/components/learn/ReasoningSidebar';
import { useLanguage } from '@/lib/LanguageContext';
import { getQuestionsByChapter } from '@/data/reasoningAptitudeLevel1';
import { RA_LEVEL1_CHAPTERS, getChapterContent } from '@/data/reasoningAptitudeLevel1Content';
import {
  StepBox, ExampleCard, SectionTitle, OriginBox, WhyItWorksBox, CommonMistakeBox, RealWorldBox,
} from '@/components/learn/ConceptTab';
import { saveReasoningChapterResult, isReasoningChapterUnlocked, getReasoningScores, REASONING_PASS_THRESHOLD } from '@/lib/reasoningProgress';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

export default function ReasoningChapterPage() {
  const { chapterId: paramChapterId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('concept');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null); // set once on last answer, avoids async state race

  const sortedChapters = [...RA_LEVEL1_CHAPTERS].sort((a, b) => a.order - b.order);
  const sortedChapterIds = sortedChapters.map((c) => c.id);
  const chapterId = paramChapterId || sortedChapters[0].id;
  const chapter = getChapterContent(chapterId);
  const questions = getQuestionsByChapter(chapterId);
  const chapterIndex = sortedChapters.findIndex((c) => c.id === chapterId);
  const nextChapter = sortedChapters[chapterIndex + 1];
  const scores = getReasoningScores();
  const nextChapterUnlocked = nextChapter ? isReasoningChapterUnlocked(nextChapter.id, sortedChapterIds) : false;

  const q = questions[qIndex];

  // If someone reaches this chapter directly (URL, back button, etc.)
  // without having unlocked it via the sidebar, bounce them to the last
  // chapter they've actually earned — mirrors how Sutra lessons enforce
  // this, which Reasoning never did until now.
  useEffect(() => {
    if (!isReasoningChapterUnlocked(chapterId, sortedChapterIds)) {
      const lastUnlockedIdx = sortedChapterIds.findIndex((id) => !isReasoningChapterUnlocked(id, sortedChapterIds));
      navigate(`/reasoning/${sortedChapterIds[Math.max(0, lastUnlockedIdx - 1)] || sortedChapterIds[0]}`, { replace: true });
    }
  }, [chapterId]);

  // Score is saved synchronously in handleAnswer on the last question
  // to avoid React async state race (score state lags by 1 update).

  const selectChapter = (id) => {
    navigate(`/reasoning/${id}`);
    setTab('concept');
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setSidebarOpen(false);
  };

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.answer;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    // On last question — compute final score synchronously (avoids React async state race)
    if (qIndex === questions.length - 1) {
      const pct = Math.round((newScore / questions.length) * 100);
      setFinalScore(pct);
      saveReasoningChapterResult(chapterId, pct);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setQIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const restartQuiz = () => {
    setSelected(null);
    setQIndex(0);
    setScore(0);
    setFinalScore(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#100B22', display: 'flex', flexDirection: 'column' }}>
      <DashboardNavbar />

      <style>{`
        .ra-grid-bg3 {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(167,139,250,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.05) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 70% 60% at 30% 0%, black 40%, transparent 90%);
        }
        .reasoning-sidebar-desktop {
          width: 280px; flex-shrink: 0; height: calc(100vh - 64px);
          position: sticky; top: 64px; overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
        }
        .reasoning-sidebar-btn { display: none !important; }
        @media (max-width: 768px) {
          .reasoning-sidebar-desktop { display: none !important; }
          .reasoning-sidebar-btn { display: flex !important; }
        }
      `}</style>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <div className="reasoning-sidebar-desktop">
          <ReasoningSidebar activeChapterId={chapterId} />
        </div>

        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, background: '#17102E', zIndex: 201 }}>
              <ReasoningSidebar activeChapterId={chapterId} onClose={() => setSidebarOpen(false)} showClose />
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          <div className="ra-grid-bg3" />
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '28px 24px 80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#A5A0C4', fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
                <ArrowLeft size={15} /> {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </Link>
              <button
                className="reasoning-sidebar-btn"
                onClick={() => setSidebarOpen(true)}
                style={{ display: 'none', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#B8B2D6', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13 }}
              >
                <Menu size={15} /> {language === 'hi' ? 'पाठ्यक्रम' : 'Curriculum'}
              </button>
            </div>

            <LearnPillarSwitcher active="reasoning" dark />

            <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', color: '#C4B5FD', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, margin: '4px 0 16px', fontFamily: 'var(--font-body)' }}>
              {language === 'hi' ? `शुरुआती · अध्याय ${chapter.order}` : `BEGINNER · CHAPTER ${chapter.order}`}
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 34, fontWeight: 700, color: '#F5F3FF', marginBottom: 6 }}>
              {tr(chapter.title, language)}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: '#A5A0C4', marginBottom: 26 }}>
              {tr(chapter.subtitle, language)}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setTab('concept')}
                style={{ padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-body)', background: tab === 'concept' ? '#A78BFA' : 'rgba(255,255,255,0.06)', color: tab === 'concept' ? '#1E0B4B' : '#B8B2D6' }}
              >
                {language === 'hi' ? 'सिद्धांत' : 'Concept'}
              </button>
              <button
                onClick={() => setTab('quiz')}
                style={{ padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-body)', background: tab === 'quiz' ? '#A78BFA' : 'rgba(255,255,255,0.06)', color: tab === 'quiz' ? '#1E0B4B' : '#B8B2D6' }}
              >
                {language === 'hi' ? `प्रश्नोत्तरी (${questions.length})` : `Quiz (${questions.length} questions)`}
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: '32px 34px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
              {tab === 'concept' && (
                <>
                  <OriginBox text={chapter.origin} />
                  <SectionTitle>{{ en: 'How to Approach It', hi: 'कैसे हल करें' }}</SectionTitle>
                  {chapter.steps.map((s, i) => (
                    <StepBox key={i} number={i + 1} text={s.text} example={s.example} />
                  ))}
                  <WhyItWorksBox text={chapter.whyItWorks} />
                  <SectionTitle>{{ en: 'Worked Example', hi: 'हल किया गया उदाहरण' }}</SectionTitle>
                  <ExampleCard title={chapter.example.title} lines={chapter.example.lines} result={chapter.example.result} />
                  <CommonMistakeBox text={chapter.commonMistake} />
                  <RealWorldBox text={chapter.realWorld} />
                  <button
                    onClick={() => setTab('quiz')}
                    style={{ marginTop: 20, width: '100%', padding: '12px 20px', borderRadius: 10, background: '#6D28D9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-body)' }}
                  >
                    {language === 'hi' ? 'अभ्यास शुरू करें →' : 'Start Practice →'}
                  </button>
                </>
              )}

              {tab === 'quiz' && q && (
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8, fontFamily: 'var(--font-body)' }}>
                    {language === 'hi' ? `प्रश्न ${qIndex + 1} / ${questions.length} · स्कोर: ${score}` : `Question ${qIndex + 1} of ${questions.length} · Score: ${score}`}
                  </p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>
                    {q.prompt}
                  </p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {q.options.map((opt) => {
                      const isCorrect = opt === q.answer;
                      let bg = '#F3F4F6';
                      if (selected && isCorrect) bg = '#D1FAE5';
                      else if (selected === opt && !isCorrect) bg = '#FEE2E2';
                      return (
                        <button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          disabled={!!selected}
                          style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: bg, textAlign: 'left', cursor: 'pointer', fontSize: 15, fontFamily: 'var(--font-body)' }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selected && qIndex < questions.length - 1 && (
                    <button onClick={nextQuestion} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                      {language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →'}
                    </button>
                  )}
                  {selected && qIndex === questions.length - 1 && finalScore !== null && (
                    <div style={{ marginTop: 20 }}>
                      {(() => {
                        const pct = finalScore;
                        const passed = pct >= REASONING_PASS_THRESHOLD;
                        // Re-read unlock status AFTER save — finalScore means save already happened
                        const nextNowUnlocked = nextChapter
                          ? isReasoningChapterUnlocked(nextChapter.id, sortedChapterIds)
                          : false;
                        return (
                          <>
                            <p style={{ fontWeight: 700, color: passed ? '#059669' : '#0A1628', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                              {language === 'hi' ? `पूरा हुआ! अंतिम स्कोर: ${score}/${questions.length} (${pct}%)` : `Done! Final score: ${score}/${questions.length} (${pct}%)`}
                            </p>
                            <p style={{ fontSize: 13, color: passed ? '#059669' : '#D97706', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
                              {passed
                                ? (language === 'hi' ? `✓ अगला अध्याय अनलॉक हो गया (${REASONING_PASS_THRESHOLD}%+ चाहिए था)` : `✓ Next chapter unlocked (needed ${REASONING_PASS_THRESHOLD}%+)`)
                                : (language === 'hi' ? `अगला अध्याय अनलॉक करने के लिए ${REASONING_PASS_THRESHOLD}% चाहिए — दोबारा प्रयास करें` : `Need ${REASONING_PASS_THRESHOLD}%+ to unlock the next chapter — try again`)}
                            </p>
                          </>
                        );
                      })()}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={restartQuiz} style={{ padding: '10px 20px', borderRadius: 10, background: '#E5E7EB', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                          {language === 'hi' ? 'दोबारा करें' : 'Retry Quiz'}
                        </button>
                        {nextChapter && (() => {
                          const pct = finalScore;
                          const passed = pct >= REASONING_PASS_THRESHOLD;
                          const nextNowUnlocked = nextChapter
                            ? isReasoningChapterUnlocked(nextChapter.id, sortedChapterIds)
                            : false;
                          return passed && nextNowUnlocked ? (
                            <button onClick={() => selectChapter(nextChapter.id)} style={{ padding: '10px 20px', borderRadius: 10, background: '#6D28D9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                              {language === 'hi' ? 'अगला अध्याय →' : 'Next Chapter →'}
                            </button>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
