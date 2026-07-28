import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Menu, ArrowLeft, Lock } from 'lucide-react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import AptitudeSidebar from '@/components/learn/AptitudeSidebar';
import { useLanguage } from '@/lib/LanguageContext';
import { APTITUDE_CHAPTERS, getAptitudeChapterContent, getAptitudeChaptersByLevel } from '@/data/aptitudeContent';
import { getAptitudeQuestionsByChapter } from '@/data/aptitudeQuizBank';
import { saveAptitudeChapterResult, isAptitudeChapterUnlocked, isAptitudeLevelUnlocked, getAptitudeScores, APTITUDE_PASS_THRESHOLD } from '@/lib/aptitudeProgress';
import { isAptitudeChapterFreeAccess, getUserPlan } from '@/lib/planEngine';
import {
  StepBox, ExampleCard, SectionTitle, OriginBox, WhyItWorksBox, CommonMistakeBox, RealWorldBox,
} from '@/components/learn/ConceptTab';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

// Renders one answer option — handles three shapes: plain string (Primary+),
// an {label, image} object (Pre-K match/odd-one-out/big-or-small), or a plain
// numeric string for counting questions (rendered large, no image).
function OptionButton({ opt, isCorrect, selected, onClick, disabled }) {
  const isImageOption = opt && typeof opt === 'object' && opt.image;
  const label = isImageOption ? opt.label : opt;
  let bg = '#F3F4F6';
  if (selected && isCorrect) bg = '#D1FAE5';
  else if (selected === label && !isCorrect) bg = '#FEE2E2';

  return (
    <button
      onClick={() => onClick(label)}
      disabled={disabled}
      style={{
        padding: isImageOption ? '10px 14px' : '12px 16px', borderRadius: 10, border: '1px solid #E5E7EB',
        background: bg, textAlign: 'left', cursor: disabled ? 'default' : 'pointer',
        fontSize: 15, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      {isImageOption && <img src={opt.image} alt={opt.label} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />}
      <span>{label}</span>
    </button>
  );
}

export default function AptitudeChapterPage() {
  const { chapterId: paramChapterId } = useParams();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('concept');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

  // 'order' is only unique WITHIN a level (each level restarts at 1), so
  // sorting on it alone interleaves chapters across levels incorrectly —
  // e.g. PRE_K's chapter 1 and PRIMARY's chapter 1 both have order:1 and
  // used to land next to each other. Rank by level first, then order.
  const APTITUDE_LEVEL_RANK = { PRE_K: 0, PRIMARY: 1, MIDDLE: 2, SECONDARY: 3, INTERMEDIATE: 4 };
  const sortedChapters = [...APTITUDE_CHAPTERS].sort((a, b) =>
    (APTITUDE_LEVEL_RANK[a.level] - APTITUDE_LEVEL_RANK[b.level]) || (a.order - b.order)
  );
  const chapterId = paramChapterId || sortedChapters[0].id;
  const chapter = getAptitudeChapterContent(chapterId);
  const isPreK = chapter?.level === 'PRE_K';

  // Access control: free-plan users only get the one designated free chapter
  // (planEngine.js). Basic+ users get everything, subject to the 60%
  // sequential-progression unlock (aptitudeProgress.js) — same model as
  // Reasoning and Vedic Maths, except Pre-K, which has no score gate.
  const plan = getUserPlan();
  const levelChapterIds = chapter ? getAptitudeChaptersByLevel(chapter.level).map((c) => c.id) : [];
  const freeOk = plan !== 'free' || isAptitudeChapterFreeAccess(chapterId);
  const levelOk = plan === 'free' || isAptitudeLevelUnlocked(chapter?.level);
  const progressionOk = plan === 'free' || isAptitudeChapterUnlocked(chapterId, levelChapterIds, chapter?.level);
  const isLocked = chapter && !(freeOk && levelOk && progressionOk);

  const chapterIndex = sortedChapters.findIndex((c) => c.id === chapterId);
  const nextChapter = sortedChapters[chapterIndex + 1];
  const nextLevelChapterIds = nextChapter ? getAptitudeChaptersByLevel(nextChapter.level).map((c) => c.id) : [];
  const nextChapterAccessible = nextChapter && (
    plan !== 'free'
      ? isAptitudeLevelUnlocked(nextChapter.level) && isAptitudeChapterUnlocked(nextChapter.id, nextLevelChapterIds, nextChapter.level)
      : isAptitudeChapterFreeAccess(nextChapter.id)
  );

  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    setQuestions(getAptitudeQuestionsByChapter(chapterId) || []);
    setQIndex(0); setSelected(null); setScore(0); setTab('concept'); setFinalScore(null);
  }, [chapterId]);

  const q = questions[qIndex];

  // Save the result once the quiz's last question has been answered —
  // wires Aptitude into the same progress-tracking every other vertical has.
  useEffect(() => {
    if (questions.length > 0 && selected && qIndex === questions.length - 1) {
      const pct = Math.round((score / questions.length) * 100);
      saveAptitudeChapterResult(chapterId, pct);
      setFinalScore(pct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, qIndex, questions.length]);

  function handleAnswer(label) {
    if (selected) return;
    setSelected(label);
    if (label === q.answer) setScore((s) => s + 1);
  }
  function nextQuestion() {
    setSelected(null);
    setQIndex((i) => i + 1);
  }
  function restartQuiz() {
    setSelected(null); setQIndex(0); setScore(0); setFinalScore(null);
  }

  if (!chapter) return null;

  if (isLocked) {
    const reason = !freeOk
      ? { en: 'This chapter needs a paid plan to unlock.', hi: 'इस अध्याय को अनलॉक करने के लिए एक paid plan चाहिए।' }
      : { en: `Score ${APTITUDE_PASS_THRESHOLD}%+ on the previous chapter to unlock this one.`, hi: `इसे अनलॉक करने के लिए पिछले अध्याय में ${APTITUDE_PASS_THRESHOLD}%+ स्कोर करें।` };
    return (
      <div style={{ minHeight: '100vh', background: '#0A0118', display: 'flex', flexDirection: 'column' }}>
        <DashboardNavbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', maxWidth: 440, textAlign: 'center' }}>
            <Lock size={36} color="#9CA3AF" style={{ marginBottom: 16 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
              {tr(chapter.title, language)}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: 24, lineHeight: 1.6 }}>{tr(reason, language)}</p>
            {!freeOk && (
              <Link to="/pricing" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 10, background: '#10B981', color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                {language === 'hi' ? 'Subscribe करें' : 'Subscribe Now'}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0118', display: 'flex', flexDirection: 'column' }}>
      <DashboardNavbar />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <div className="aptitude-sidebar-desktop" style={{ width: 280, flexShrink: 0 }}>
          <AptitudeSidebar activeChapterId={chapterId} />
        </div>

        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 300, background: '#17102E', zIndex: 201 }}>
              <AptitudeSidebar activeChapterId={chapterId} onClose={() => setSidebarOpen(false)} showClose />
            </div>
          </div>
        )}

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', padding: '28px 24px 80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#A5A0C4', fontSize: 14, textDecoration: 'none' }}>
                <ArrowLeft size={15} /> {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </Link>
              <button onClick={() => setSidebarOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#B8B2D6', cursor: 'pointer', fontSize: 13 }}>
                <Menu size={15} /> {language === 'hi' ? 'पाठ्यक्रम' : 'Curriculum'}
              </button>
            </div>

            <LearnPillarSwitcher active="aptitude" dark />

            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#6EE7B7', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, margin: '4px 0 16px' }}>
              {chapter.level} · {language === 'hi' ? `अध्याय ${chapter.order}` : `CHAPTER ${chapter.order}`}
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 34, fontWeight: 700, color: '#F5F3FF', marginBottom: 6 }}>
              {tr(chapter.title, language)}
            </h1>
            <p style={{ color: '#A5A0C4', marginBottom: 26 }}>{tr(chapter.subtitle, language)}</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <button onClick={() => setTab('concept')} style={{ padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: tab === 'concept' ? '#10B981' : 'rgba(255,255,255,0.06)', color: tab === 'concept' ? '#022C22' : '#B8B2D6' }}>
                {language === 'hi' ? 'सिद्धांत' : 'Concept'}
              </button>
              <button onClick={() => setTab('quiz')} style={{ padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: tab === 'quiz' ? '#10B981' : 'rgba(255,255,255,0.06)', color: tab === 'quiz' ? '#022C22' : '#B8B2D6' }}>
                {language === 'hi' ? `प्रश्नोत्तरी (${questions.length})` : `Quiz (${questions.length})`}
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: 20, padding: '32px 34px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
              {tab === 'concept' && (
                <>
                  {isPreK ? (
                    // Pre-K: simpler parent/teacher-facing note, no reading-heavy pattern
                    <div style={{ background: '#FCE7F3', borderRadius: 12, padding: '18px 20px' }}>
                      <p style={{ fontWeight: 700, color: '#9D174D', marginBottom: 8, fontSize: 13 }}>
                        {language === 'hi' ? 'माता-पिता/शिक्षक के लिए' : 'For Parents & Teachers'}
                      </p>
                      <p style={{ color: '#374151', lineHeight: 1.65, margin: 0 }}>{tr(chapter.prekNote, language)}</p>
                    </div>
                  ) : (
                    <>
                      <OriginBox text={chapter.origin} />
                      <SectionTitle>{{ en: 'How to Approach It', hi: 'कैसे हल करें' }}</SectionTitle>
                      {chapter.steps.map((s, i) => <StepBox key={i} number={i + 1} text={s.text} example={s.example} />)}
                      <WhyItWorksBox text={chapter.whyItWorks} />
                      <SectionTitle>{{ en: 'Worked Example', hi: 'हल किया गया उदाहरण' }}</SectionTitle>
                      <ExampleCard title={chapter.example.title} lines={chapter.example.lines} result={chapter.example.result} />
                      <CommonMistakeBox text={chapter.commonMistake} />
                      <RealWorldBox text={chapter.realWorld} />
                    </>
                  )}
                  <button onClick={() => setTab('quiz')} style={{ marginTop: 20, width: '100%', padding: '12px 20px', borderRadius: 10, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                    {language === 'hi' ? 'अभ्यास शुरू करें →' : 'Start Practice →'}
                  </button>
                </>
              )}

              {tab === 'quiz' && q && (
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
                    {language === 'hi' ? `प्रश्न ${qIndex + 1} / ${questions.length} · स्कोर: ${score}` : `Question ${qIndex + 1} of ${questions.length} · Score: ${score}`}
                  </p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>{q.prompt}</p>

                  {q.display_image && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {Array.from({ length: q.display_count || 1 }).map((_, i) => (
                        <img key={i} src={q.display_image} alt="" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} />
                      ))}
                    </div>
                  )}
                  {q.sequence_images && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                      {q.sequence_images.map((src, i) => <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />)}
                      <span style={{ fontSize: 24, fontWeight: 700, color: '#9CA3AF' }}>?</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: 10 }}>
                    {q.options.map((opt, i) => (
                      <OptionButton key={i} opt={opt} isCorrect={(typeof opt === 'object' ? opt.label : opt) === q.answer} selected={selected} onClick={handleAnswer} disabled={!!selected} />
                    ))}
                  </div>

                  {selected && q.exp && (
                    <div style={{ marginTop: 14, background: selected === q.answer ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${selected === q.answer ? '#BBF7D0' : '#FECACA'}`, borderRadius: 12, padding: '14px 16px', fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
                      {selected !== q.answer && <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#B91C1C' }}>{language === 'hi' ? `सही उत्तर: ${q.answer}` : `Correct answer: ${q.answer}`}</p>}
                      <p style={{ margin: 0 }}>💡 {q.exp}</p>
                    </div>
                  )}

                  {selected && qIndex < questions.length - 1 && (
                    <button onClick={nextQuestion} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      {language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →'}
                    </button>
                  )}
                  {selected && qIndex === questions.length - 1 && finalScore !== null && (
                    <div style={{ marginTop: 20 }}>
                      {(() => {
                        const passed = finalScore >= APTITUDE_PASS_THRESHOLD;
                        return (
                          <>
                            <p style={{ fontWeight: 700, color: passed ? '#059669' : '#0A1628', marginBottom: 6 }}>
                              {language === 'hi' ? `पूरा हुआ! अंतिम स्कोर: ${score}/${questions.length} (${finalScore}%)` : `Done! Final score: ${score}/${questions.length} (${finalScore}%)`}
                            </p>
                            {nextChapter && chapter?.level !== 'PRE_K' && (
                              <p style={{ fontSize: 13, color: passed ? '#059669' : '#D97706', marginBottom: 16 }}>
                                {passed
                                  ? (language === 'hi' ? `✓ अगला अध्याय अनलॉक हो गया (${APTITUDE_PASS_THRESHOLD}%+ चाहिए था)` : `✓ Next chapter unlocked (needed ${APTITUDE_PASS_THRESHOLD}%+)`)
                                  : (language === 'hi' ? `अगला अध्याय अनलॉक करने के लिए ${APTITUDE_PASS_THRESHOLD}% चाहिए — दोबारा प्रयास करें` : `Need ${APTITUDE_PASS_THRESHOLD}%+ to unlock the next chapter — try again`)}
                              </p>
                            )}
                          </>
                        );
                      })()}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={restartQuiz} style={{ padding: '10px 20px', borderRadius: 10, background: '#E5E7EB', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                          {language === 'hi' ? 'दोबारा करें' : 'Retry Quiz'}
                        </button>
                        {nextChapter && nextChapterAccessible && (
                          <Link to={`/aptitude/${nextChapter.id}`} style={{ padding: '10px 20px', borderRadius: 10, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            {language === 'hi' ? 'अगला अध्याय →' : 'Next Chapter →'}
                          </Link>
                        )}
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
