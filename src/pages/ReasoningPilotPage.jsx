import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { getQuestionsByChapter } from '@/data/reasoningAptitudeLevel1';
import {
  StepBox, ExampleCard, SectionTitle, OriginBox, WhyItWorksBox, CommonMistakeBox, RealWorldBox,
} from '@/components/learn/ConceptTab';

// PILOT / REVIEW PAGE — not linked from navigation yet.
// This demonstrates the deep-content template applied to a brand-new
// Reasoning & Aptitude chapter (distinct from the existing arithmetic-focused
// "Aptitude Zone"). Reachable directly at /reasoning-pilot for review.

const QUESTIONS = getQuestionsByChapter('odd-one-out');

export default function ReasoningPilotPage() {
  const { language } = useLanguage();
  const [tab, setTab] = useState('concept'); // concept | quiz
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[qIndex];

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setQIndex((i) => Math.min(i + 1, QUESTIONS.length - 1));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', padding: '32px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 16 }}>
          PILOT — FOR REVIEW ONLY
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          Odd One Out (Classification)
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#4B5563', marginBottom: 24 }}>
          Reasoning & Aptitude — Level 1, Chapter 1
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
            Concept
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
            Quiz ({QUESTIONS.length} questions)
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(10,22,40,0.06)' }}>
          {tab === 'concept' && (
            <>
              <OriginBox text={{
                en: 'Classification is one of the oldest reasoning skills humans developed — long before formal schooling, our ancestors needed to quickly sort "safe to eat" from "not safe," or "predator" from "not predator." Odd-One-Out puzzles are a modern, playful version of that exact same mental skill: spotting what doesn\'t belong to a group.',
              }} />

              <SectionTitle>How to Approach It</SectionTitle>
              <StepBox number={1}
                text="Look at all the items first — don't jump to an answer immediately"
                example="Apple, Banana, Carrot, Mango" />
              <StepBox number={2}
                text="Ask: what do MOST of these items have in common?"
                example="Apple, Banana, Mango are all fruits" />
              <StepBox number={3}
                text="The item that breaks that shared pattern is the odd one out"
                example="Carrot is a vegetable, not a fruit → that's the answer" />

              <WhyItWorksBox text={{
                en: 'This isn\'t just a party trick — it\'s literally the foundation of how categories and definitions work in every subject, from biology (classifying species) to computer science (data types). Learning to instantly spot "what makes this group similar, and what breaks it" is a transferable skill you\'ll use in science classification, grammar (odd word out), and even everyday decision-making.',
              }} />

              <SectionTitle>Worked Example</SectionTitle>
              <ExampleCard
                title="Guitar, Violin, Flute, Football"
                lines={[
                  'Guitar, Violin, and Flute are all musical instruments',
                  'Football is a sport, not an instrument',
                ]}
                result="Answer: Football ✓"
              />

              <CommonMistakeBox text={{
                en: 'Students often pick the item that "looks different" visually or is simply the last one they read, instead of actually checking what property connects the other three. Always find the shared rule FIRST, then check which item breaks it — don\'t guess by feel.',
              }} />

              <RealWorldBox text={{
                en: 'This exact skill shows up in real school science (classifying living things), in competitive exams (verbal reasoning sections), and in everyday life — like quickly noticing when something in a list, a bill, or a set of instructions doesn\'t fit and needs a second look.',
              }} />
            </>
          )}

          {tab === 'quiz' && q && (
            <div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
                Question {qIndex + 1} of {QUESTIONS.length} · Score: {score}
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
              {selected && qIndex < QUESTIONS.length - 1 && (
                <button onClick={nextQuestion} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, background: '#0A1628', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Next Question →
                </button>
              )}
              {selected && qIndex === QUESTIONS.length - 1 && (
                <p style={{ marginTop: 20, fontWeight: 700, color: '#0A1628' }}>
                  Done! Final score: {score}/{QUESTIONS.length}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
