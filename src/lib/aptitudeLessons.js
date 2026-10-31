// Splits a chapter's question pool into lessons of 10 (max 4). Questions past the last full
// lesson are kept as a bonus pool. Pre-K chapters do not use lessons.
export const LESSON_SIZE = 10;
export const MAX_LESSONS = 4;

export function buildAptitudeLessons(questions) {
  const pool = questions || [];
  const count = Math.min(MAX_LESSONS, Math.floor(pool.length / LESSON_SIZE));
  const lessons = Array.from({ length: count }, (_, i) => pool.slice(i * LESSON_SIZE, (i + 1) * LESSON_SIZE));
  return { lessons, bonus: pool.slice(count * LESSON_SIZE) };
}

const KEY = 'vm_apt_lesson_best';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function getLessonBests(chapterId) {
  return read()[chapterId] || {};
}

// Keeps the best score per lesson and returns the chapter score: the average of every
// lesson's best, with an unattempted lesson counting as 0, so a chapter only passes once
// all its lessons have been done.
export function saveLessonResult(chapterId, lessonIndex, pct, lessonCount) {
  const all = read();
  const bests = { ...(all[chapterId] || {}) };
  if (pct > (bests[lessonIndex] ?? -1)) bests[lessonIndex] = pct;
  all[chapterId] = bests;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage blocked */ }
  let sum = 0;
  for (let i = 0; i < lessonCount; i++) sum += bests[i] ?? 0;
  return Math.round(sum / lessonCount);
}
