import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import { useLanguage } from '@/lib/LanguageContext';
import { getQuestionsByChapter } from '@/data/reasoningAptitudeLevel1';
import { RA_LEVEL1_CHAPTERS, getChapterContent } from '@/data/reasoningAptitudeLevel1Content';
import {
  StepBox, ExampleCard, SectionTitle, OriginBox, WhyItWorksBox, CommonMistakeBox, RealWorldBox,
} from '@/components/learn/ConceptTab';

const tr = (field, language) => field?.[language] ?? field?.en ?? '';

export default function ReasoningChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [tab, setTab] = useState('concept');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const chapter = getChapterContent(chapterId);
  const questions = getQuestionsByChapter(chapterId);
  const chapterIndex = RA_LEVEL1_CHAPTERS.findIndex((c) => c.id === chapterId);
  const nextChapter = RA_LEVEL1_CHAPTERS[chapterIndex + 1];

  if (!chapter) {
    return (
      <div style={{ minHeight: '100vh', background: '#100B22', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: '#A5A0C4', marginBottom: 16 }}>Chapter not found.</p>
          <Link to="/reasoning" style={{ color: '#C4B5FD', fontWeight: 600 }}>← Back to Reasoning & Aptitude</Link>
        </div>
      </div>
    );
  }

  const q = questions[qIndex];

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setQIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const restartQuiz = () => {
    setSelected(null);
    setQIndex(0);
    setScore(0);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#100B22', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .ra-grid-bg2 {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(167,139,250,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 80% 55% at 50% 0%, black 40%, transparent 90%);
        }
      `}</style>
      <div className="ra-grid-bg2" />

      <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto', padding: '44px 24px 80px' }}>
        <LearnPillarSwitcher active="reasoning" dark />
        <Link to="/reasoning" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, color: '#A5A0C4', fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={15} />
          {language === 'hi' ? 'सभी अध्याय' : 'All Chapters'}
        </Link>

        <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', color: '#C4B5FD', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
          {language === 'hi' ? `शुरुआती · अध्याय ${chapter.order}` : `BEGINNER · CHAPTER ${chapter.order}`}
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700, color: '#F5F3FF', marginBottom: 8 }}>
          {tr(chapter.title, language)}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#A5A0C4', marginBottom: 28 }}>
          {tr(chapter.subtitle, language)}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setTab('concept')}
            style={{
              padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-body)',
              background: tab === 'concept' ? '#A78BFA' : 'rgba(255,255,255,0.06)',
              color: tab === 'concept' ? '#1E0B4B' : '#B8B2D6',
            }}
          >
            {language === 'hi' ? 'सिद्धांत' : 'Concept'}
          </button>
          <button
            onClick={() => setTab('quiz')}
            style={{
              padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-body)',
              background: tab === 'quiz' ? '#A78BFA' : 'rgba(255,255,255,0.06)',
              color: tab === 'quiz' ? '#1E0B4B' : '#B8B2D6',
            }}
          >
            {language === 'hi' ? `प्रश्नोत्तरी (${questions.length})` : `Quiz (${questions.length} questions)`}
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: '32px 34px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', maxWidth: 720 }}>
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
              {selected && qIndex === questions.length - 1 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontWeight: 700, color: '#0A1628', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
                    {language === 'hi' ? `पूरा हुआ! अंतिम स्कोर: ${score}/${questions.length}` : `Done! Final score: ${score}/${questions.length}`}
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={restartQuiz} style={{ padding: '10px 20px', borderRadius: 10, background: '#E5E7EB', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                      {language === 'hi' ? 'दोबारा करें' : 'Retry Quiz'}
                    </button>
                    {nextChapter && (
                      <button onClick={() => navigate(`/reasoning/${nextChapter.id}`)} style={{ padding: '10px 20px', borderRadius: 10, background: '#6D28D9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                        {language === 'hi' ? 'अगला अध्याय →' : 'Next Chapter →'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
