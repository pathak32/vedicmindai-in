import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', marginBottom: 16 }}>Chapter not found.</p>
          <Link to="/reasoning" style={{ color: '#3B82F6', fontWeight: 600 }}>← Back to Reasoning & Aptitude</Link>
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
    <div style={{ minHeight: '100vh', background: '#F8FAFF', padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Link to="/reasoning" style={{ display: 'inline-block', marginBottom: 16, color: '#6B7280', fontSize: 14, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
          {language === 'hi' ? '← सभी अध्याय' : '← All Chapters'}
        </Link>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {tr(chapter.title, language)}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', marginBottom: 24 }}>
          {language === 'hi' ? 'रीज़निंग व एप्टीट्यूड — लेवल 1' : 'Reasoning & Aptitude — Level 1'} · {tr(chapter.subtitle, language)} · {language === 'hi' ? `अध्याय ${chapter.order}` : `Chapter ${chapter.order}`}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => setTab('concept')}
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              background: tab === 'concept' ? '#0A1628' : '#E5E7EB',
              color: tab === 'concept' ? 'white' : '#374151',
            }}
          >
            {language === 'hi' ? 'सिद्धांत' : 'Concept'}
          </button>
          <button
            onClick={() => setTab('quiz')}
            style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
              background: tab === 'quiz' ? '#0A1628' : '#E5E7EB',
              color: tab === 'quiz' ? 'white' : '#374151',
            }}
          >
            {language === 'hi' ? `प्रश्नोत्तरी (${questions.length})` : `Quiz (${questions.length} questions)`}
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(10,22,40,0.06)' }}>
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
                style={{ marginTop: 20, width: '100%', padding: '12px 20px', borderRadius: 10, background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
              >
                {language === 'hi' ? 'अभ्यास शुरू करें →' : 'Start Practice →'}
              </button>
            </>
          )}

          {tab === 'quiz' && q && (
            <div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
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
                      style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: bg, textAlign: 'left', cursor: 'pointer', fontSize: 15 }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selected && qIndex < questions.length - 1 && (
                <button onClick={nextQuestion} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {language === 'hi' ? 'अगला प्रश्न →' : 'Next Question →'}
                </button>
              )}
              {selected && qIndex === questions.length - 1 && (
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontWeight: 700, color: '#0A1628', marginBottom: 16 }}>
                    {language === 'hi' ? `पूरा हुआ! अंतिम स्कोर: ${score}/${questions.length}` : `Done! Final score: ${score}/${questions.length}`}
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={restartQuiz} style={{ padding: '10px 20px', borderRadius: 10, background: '#E5E7EB', color: '#374151', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      {language === 'hi' ? 'दोबारा करें' : 'Retry Quiz'}
                    </button>
                    {nextChapter && (
                      <button onClick={() => navigate(`/reasoning/${nextChapter.id}`)} style={{ padding: '10px 20px', borderRadius: 10, background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
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
