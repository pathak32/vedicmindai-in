// Splits a chapter's question pool into lessons of 10 (max 4), ordered by difficulty: lesson 1
// holds the easiest questions, then medium, then hardest, and lesson 4 is a mix spread across
// the whole range. Questions not used by any lesson are kept as a bonus pool. A chapter with
// 20 questions gets 2 lessons (easier half, harder half). Pre-K chapters do not use lessons.
export const LESSON_SIZE = 10;
export const MAX_LESSONS = 4;

const RANK = { easy: 0, medium: 1, hard: 2 };

export function buildAptitudeLessons(questions) {
  const pool = questions || [];
  const count = Math.min(MAX_LESSONS, Math.floor(pool.length / LESSON_SIZE));
  if (count === 0) return { lessons: [], bonus: pool };

  const sorted = pool
    .map((q, i) => ({ q, i }))
    .sort((a, b) => (RANK[a.q.difficulty] ?? 1) - (RANK[b.q.difficulty] ?? 1) || a.i - b.i)
    .map((x) => x.q);

  const lessons = [];
  let rest = sorted;
  if (count === MAX_LESSONS) {
    const picked = new Set();
    for (let k = 0; k < LESSON_SIZE; k++) picked.add(Math.round((k * (sorted.length - 1)) / (LESSON_SIZE - 1)));
    lessons[3] = sorted.filter((_, i) => picked.has(i));
    rest = sorted.filter((_, i) => !picked.has(i));
  }
  const graded = Math.min(count, 3);
  const middleStart = graded === 3 ? Math.floor((rest.length - LESSON_SIZE) / 2) : 0;
  const starts = graded === 3
    ? [0, middleStart, rest.length - LESSON_SIZE]
    : Array.from({ length: graded }, (_, k) => (k === 0 ? 0 : rest.length - LESSON_SIZE));
  starts.forEach((s, k) => { lessons[k] = rest.slice(s, s + LESSON_SIZE); });

  const used = new Set(lessons.flat());
  return { lessons, bonus: pool.filter((q) => !used.has(q)) };
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
