import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './curriculumData';
import ConceptTab from './ConceptTab';
import PracticeTab from './PracticeTab';
import QuizTab from './QuizTab';

import { motion, AnimatePresence } from 'framer-motion';
import { isLessonAccessible } from '@/lib/trialEngine';
import { isLessonFreeAccess } from '@/lib/planEngine';
import LessonLockOverlay from './LessonLockOverlay';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

// ─── Flow Progress Indicator ──────────────────────────────────────────────────

function FlowIndicator({
  conceptDone, practiceDone, quizDone, activeTab }) {
  const steps = [
    { key: 'concept',  label: 'Concept',  done: conceptDone },
    { key: 'practice', label: 'Practice', done: practiceDone },
    { key: 'quiz',     label: 'Quiz',     done: quizDone },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, padding: '0 4px' }}>
      {steps.map((step, i) => {
        const isActive = activeTab === step.key;
        const dotSize = isActive ? 10 : 8;
        const dotColor = step.done ? '#10B981' : isActive ? '#0A1628' : '#D1D5DB';
        return (
          <React.Fragment key={step.key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: dotSize, height: dotSize, borderRadius: '50%',
                background: dotColor,
                transition: 'all 0.3s',
                ...(isActive && !step.done ? {
                  boxShadow: '0 0 0 3px rgba(10,22,40,0.15)',
                  animation: 'lessonDotPulse 1.8s ease-in-out infinite',
                } : {}),
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 10,
                color: step.done ? '#10B981' : isActive ? '#0A1628' : '#9CA3AF',
                fontWeight: isActive || step.done ? 600 : 400,
              }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, marginBottom: 14,
                background: steps[i].done ? '#10B981' : 'rgba(30,64,175,0.1)',
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
      <style>{`@keyframes lessonDotPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, background: '#0A1628', color: 'white',
            borderRadius: 12, padding: '12px 24px',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(10,22,40,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main LessonViewer ────────────────────────────────────────────────────────

export default function LessonViewer({ lesson, progress, onLessonComplete, allLessonIds, onNavigateToLesson }) {
  const [activeTab, setActiveTab] = useState('concept');
  const [conceptDone, setConceptDone] = useState(false);
  const [practiceDone, setPracticeDone] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Reset all flow state when lesson changes
  useEffect(() => {
    setActiveTab('concept');
    setConceptDone(false);
    setPracticeDone(false);
    setQuizDone(false);
    window.scrollTo(0, 0);
  }, [lesson.id]);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const handleConceptComplete = () => {
    setConceptDone(true);
    setTimeout(() => {
      setActiveTab('practice');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Great! Now practice what you learned 💪');
    }, 1500);
  };

  const handlePracticeComplete = () => {
    setPracticeDone(true);
    setTimeout(() => {
      setActiveTab('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Quiz time! Give it your best 🧮');
    }, 600);
  };

  const handleNextLesson = (lessonId, xpEarned, score) => {
    setQuizDone(true);
    onLessonComplete(lessonId, xpEarned, score);
    // Navigate to next lesson
    if (allLessonIds && onNavigateToLesson) {
      const nextId = allLessonIds[allLessonIds.indexOf(lessonId) + 1];
      if (nextId) {
        setTimeout(() => onNavigateToLesson(nextId), 400);
      }
    }
  };

  const level = CURRICULUM.find(lv => lv.lessons.some(l => l.id === lesson.id));
  const lessonIdx = level?.lessons.findIndex(l => l.id === lesson.id) ?? 0;
  const completed = progress.completedLessons || [];
  const isDone = completed.includes(lesson.id);

  const tabs = ['concept', 'practice', 'quiz'];
  const tabLabels = { concept: 'Concept', practice: 'Practice', quiz: 'Quiz' };

  const lessonLocked = !isLessonAccessible(lesson.id) || !isLessonFreeAccess(lesson.id);

  return (
    <div style={{ position: 'relative' }}>
      {lessonLocked && <LessonLockOverlay />}
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 8 }}>
          Level {level?.level} › Lesson {lessonIdx + 1}
        </div>
        <h1 className="font-heading" style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
          {lesson.title}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ background: '#DBEAFE', color: '#1E40AF', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
            Level {level?.level} — {level?.name}
          </span>
          <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
            ⭐ +{lesson.xp} XP
          </span>
          <span style={{ fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)' }}>
            Lesson {lessonIdx + 1} of {level?.lessons.length}
          </span>
          {isDone && (
            <span style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontFamily: 'var(--font-body)' }}>
              ✅ Completed
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid rgba(30,64,175,0.1)', marginBottom: 12 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', minHeight: 44, border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 15,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#0A1628' : '#4B5563',
              borderBottom: activeTab === tab ? '3px solid #0A1628' : '3px solid transparent',
              marginBottom: -2,
              transition: 'all 0.15s',
            }}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Flow Progress Indicator */}
      <FlowIndicator
        conceptDone={conceptDone}
        practiceDone={practiceDone}
        quizDone={quizDone}
        activeTab={activeTab}
      />

      {/* Tab content */}
      {activeTab === 'concept' && (
        <ConceptTab
          lesson={lesson}
          glass={glass}
          progress={progress}
          onSwitchTab={setActiveTab}
          onConceptComplete={handleConceptComplete}
        />
      )}
      {activeTab === 'practice' && (
        <PracticeTab
          lesson={lesson}
          glass={glass}
          progress={progress}
          onPracticeComplete={handlePracticeComplete}
        />
      )}
      {activeTab === 'quiz' && (
        <QuizTab
          lesson={lesson}
          glass={glass}
          progress={progress}
          allLessonIds={allLessonIds}
          onComplete={(score, xpEarned) => {
            setQuizDone(true);
            onLessonComplete(lesson.id, xpEarned, score);
          }}
          onNextLesson={(lessonId, xpEarned, score) => handleNextLesson(lessonId, xpEarned, score)}
        />
      )}
      <Toast message={toast} visible={toastVisible} />
    </div>
  );
}