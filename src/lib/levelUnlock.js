import { CURRICULUM } from '@/components/learn/curriculumData';

export const LEVEL_PASS_PERCENT = 60;

// A level opens only when every lesson of the level before it is completed AND that
// level's assessment is passed. The assessment itself can be tried at any time.
export function getLevelUnlockProgress(levelNumber, completed = [], scores = {}) {
  const idx = CURRICULUM.findIndex((l) => l.level === levelNumber);
  if (idx <= 0) return { unlocked: true, lessonsDone: 0, lessonsTotal: 0, assessmentPassed: true };
  const prev = CURRICULUM[idx - 1];
  const lessons = prev.lessons.filter((l) => !l.isAssessment);
  const assessment = prev.lessons.find((l) => l.isAssessment);
  const lessonsDone = lessons.filter((l) => completed.includes(l.id)).length;
  const assessmentPassed = assessment ? (scores[assessment.id] || 0) >= LEVEL_PASS_PERCENT : true;
  return {
    unlocked: lessonsDone === lessons.length && assessmentPassed,
    lessonsDone,
    lessonsTotal: lessons.length,
    assessmentPassed,
    previousLevel: prev.level,
  };
}

export function isLevelUnlocked(levelNumber, completed, scores) {
  return getLevelUnlockProgress(levelNumber, completed, scores).unlocked;
}
