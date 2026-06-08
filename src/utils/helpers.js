const STORAGE_KEY = 'vedicmind_progress';

export const defaultProgress = {
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

export function getProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? { ...defaultProgress, ...JSON.parse(stored) } : defaultProgress;
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getTodayString() {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function calculateAndSaveStreak(progress) {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (progress.lastStudyDate === today) return progress; // already counted

  let newStreak;
  if (progress.lastStudyDate === yesterday) {
    newStreak = (progress.streak || 0) + 1;
  } else {
    newStreak = 1;
  }

  const studyDates = progress.studyDates || [];
  const newStudyDates = studyDates.includes(today) ? studyDates : [...studyDates, today];

  return {
    ...progress,
    streak: newStreak,
    lastStudyDate: today,
    studyDates: newStudyDates,
  };
}

export function isLevelUnlocked(levelNumber, progress) {
  if (levelNumber === 1) return true;
  if (levelNumber === 2) return (progress.lessonScores?.['l1_10'] || 0) >= 60;
  if (levelNumber === 3) return (progress.lessonScores?.['l2_12'] || 0) >= 60;
  if (levelNumber === 4) return (progress.lessonScores?.['l3_10'] || 0) >= 60;
  return false;
}

export const BADGE_DEFS = [
  { id: 'first_lesson', emoji: '🎯', name: 'First Lesson', check: (p) => p.completedLessons.length >= 1 },
  { id: 'streak_3', emoji: '🔥', name: '3-Day Streak', check: (p) => (p.streak || 0) >= 3 },
  { id: 'streak_7', emoji: '🔥🔥', name: '7-Day Streak', check: (p) => (p.streak || 0) >= 7 },
  { id: 'lessons_5', emoji: '📚', name: '5 Lessons', check: (p) => p.completedLessons.length >= 5 },
  { id: 'lessons_10', emoji: '🧠', name: '10 Lessons', check: (p) => p.completedLessons.length >= 10 },
  { id: 'lessons_20', emoji: '⚡', name: '20 Lessons', check: (p) => p.completedLessons.length >= 20 },
  { id: 'perfect_score', emoji: '💯', name: 'Perfect Score', check: (p) => Object.values(p.lessonScores || {}).some(s => s >= 100) },
  { id: 'beginner_complete', emoji: '🌱', name: 'Beginner Complete', check: (p) => (p.lessonScores?.['l1_10'] || 0) >= 60 },
  { id: 'vedic_master', emoji: '👑', name: 'Vedic Master', check: (p) => p.completedLessons.length >= 40 },
  { id: 'xp_500', emoji: '⭐', name: '500 XP', check: (p) => (p.totalXP || 0) >= 500 },
  { id: 'xp_1000', emoji: '🌟', name: '1000 XP', check: (p) => (p.totalXP || 0) >= 1000 },
  { id: 'speed_demon', emoji: '⚡', name: 'Speed Demon', check: (p) => (p.practiceHistory || []).filter(r => r.correct).length >= 200 },
  { id: 'challenger', emoji: '🏅', name: 'Challenger', check: (p) => (p.practiceHistory || []).length >= 50 },
];

export function checkAndAwardBadges(progress) {
  const earned = progress.badges || [];
  const newBadges = [];
  for (const badge of BADGE_DEFS) {
    if (!earned.includes(badge.id) && badge.check(progress)) {
      newBadges.push(badge.id);
    }
  }
  if (newBadges.length === 0) return { progress, newBadges: [] };
  return {
    progress: { ...progress, badges: [...earned, ...newBadges] },
    newBadges,
  };
}

export function completeLessonHelper(progress, lessonId, score, xpEarned) {
  let updated = {
    ...progress,
    completedLessons: [...new Set([...progress.completedLessons, lessonId])],
    lessonScores: {
      ...progress.lessonScores,
      [lessonId]: Math.max(progress.lessonScores?.[lessonId] || 0, score),
    },
    totalXP: (progress.totalXP || 0) + (xpEarned || 0),
  };
  updated = calculateAndSaveStreak(updated);
  const { progress: withBadges, newBadges } = checkAndAwardBadges(updated);
  saveProgress(withBadges);
  return { progress: withBadges, newBadges };
}