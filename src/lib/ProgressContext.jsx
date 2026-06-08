import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'vedicmind_progress';

const defaultProgress = {
  currentLevel: 1,
  currentLesson: 1,
  completedLessons: [],
  lessonScores: {},
  totalXP: 0,
  streak: 0,
  lastStudyDate: null,
  studyDates: [],
  badges: [],
  practiceHistory: [],
};

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addXP = (amount) => {
    setProgress(prev => ({ ...prev, totalXP: prev.totalXP + amount }));
  };

  const completeLesson = (lessonId, score) => {
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const newStudyDates = prev.studyDates.includes(today) ? prev.studyDates : [...prev.studyDates, today];
      const isConsecutive = prev.lastStudyDate
        ? (new Date(today) - new Date(prev.lastStudyDate)) / 86400000 <= 1
        : true;
      return {
        ...prev,
        completedLessons: [...new Set([...prev.completedLessons, lessonId])],
        lessonScores: { ...prev.lessonScores, [lessonId]: Math.max(prev.lessonScores[lessonId] || 0, score) },
        totalXP: prev.totalXP + score * 10,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastStudyDate: today,
        studyDates: newStudyDates,
      };
    });
  };

  const addPracticeResult = (result) => {
    setProgress(prev => ({
      ...prev,
      practiceHistory: [...prev.practiceHistory, { ...result, date: new Date().toISOString() }],
      totalXP: prev.totalXP + (result.correct ? 15 : 0),
    }));
  };

  return (
    <ProgressContext.Provider value={{ progress, addXP, completeLesson, addPracticeResult }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}