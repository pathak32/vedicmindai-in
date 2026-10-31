// ─── Weekly Exam Engine ───────────────────────────────────────────────────────

export function getWeekId() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now - start) / 86400000 + start.getDay() + 1) / 7
  );
  return now.getFullYear() + '-W' + String(week).padStart(2, '0');
}

export function getClassGroup(grade) {
  if (!grade) return 'middle';
  if (grade >= 1  && grade <= 5)  return 'junior';
  if (grade >= 6  && grade <= 8)  return 'middle';
  if (grade >= 9  && grade <= 10) return 'senior';
  if (grade >= 11 && grade <= 12) return 'higher';
  if (grade >= 13)                return 'open';
  return 'middle';
}

export function getClassGroupLabel(group) {
  const labels = {
    junior: 'Junior (Class 1–5)',
    middle: 'Middle (Class 6–8)',
    senior: 'Senior (Class 9–10)',
    higher: 'Higher (Class 11–12)',
    open:   'Open (Adults)',
  };
  return labels[group] || 'Middle';
}

export function getGradeForGroup(group) {
  const map = { junior: 3, middle: 7, senior: 10, higher: 11, open: 13 };
  return map[group] || 7;
}

export function getWeeklyExamStatus() {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.weeklyExamHistory || [];
  const weekId = getWeekId();
  const done = history.find(e => e.weekId === weekId);
  if (done) return 'completed';

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  if (day === 0 && hour >= 10) return 'live';
  if (day === 0 && hour < 10)  return 'today_waiting';
  return 'upcoming';
}

export function getDaysUntilSunday() {
  const day = new Date().getDay();
  return day === 0 ? 7 : 7 - day;
}

export function getSecondsUntilSunday10AM() {
  const now = new Date();
  const next = new Date(now);
  const day = now.getDay();
  const daysUntil = day === 0 ? 7 : 7 - day;
  next.setDate(now.getDate() + daysUntil);
  next.setHours(10, 0, 0, 0);
  return Math.max(0, Math.floor((next - now) / 1000));
}

export function getSecondsUntil10AM() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);
  return Math.max(0, Math.floor((target - now) / 1000));
}

export function formatCountdown(seconds) {
  const days  = Math.floor(seconds / 86400);
  const hrs   = Math.floor((seconds % 86400) / 3600);
  const mins  = Math.floor((seconds % 3600) / 60);
  const secs  = seconds % 60;
  const pad   = n => String(n).padStart(2, '0');
  if (days > 0) return `${days}d ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export function formatMMSS(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// Seeded shuffle — same seed = same order
export function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getSeedFromWeekAndGroup(weekId, group) {
  let hash = 0;
  const str = weekId + group;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getThisWeekResult() {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.weeklyExamHistory || [];
  const weekId = getWeekId();
  return history.find(e => e.weekId === weekId) || null;
}

export function saveExamResult(result) {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.weeklyExamHistory || [];
  history.push(result);
  progress.weeklyExamHistory = history;
  progress.totalXP = (progress.totalXP || 0) + Math.floor(result.score / 2);
  localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
}
// ─── 30-question exam: 10 Vedic Maths, 10 Reasoning, 10 Aptitude ──────────────

export const EXAM_SECTION_SIZE = 10;
export const EXAM_QUESTION_COUNT = EXAM_SECTION_SIZE * 3;
export const EXAM_TIME_SECONDS = 60 * 60;
export const EXAM_SECONDS_PER_Q = 120; // visual pacing bar only
export const POINTS_CORRECT = 5;
export const POINTS_FAST = 1; // answered in under 30 seconds
export const FAST_SECONDS = 30;
export const EXAM_MAX_SCORE = EXAM_QUESTION_COUNT * (POINTS_CORRECT + POINTS_FAST);

// Vedic Maths lessons by level (l1 foundations ... l4 advanced) for each group.
const VEDIC_LEVELS = {
  junior: ['l1'],
  middle: ['l1', 'l2'],
  senior: ['l2', 'l3'],
  higher: ['l3', 'l4'],
  open: ['l1', 'l2', 'l3', 'l4'],
};
const VEDIC_DIFFICULTY = {
  junior: ['easy', 'medium'],
  middle: ['easy', 'medium', 'hard'],
  senior: ['medium', 'hard'],
  higher: ['medium', 'hard'],
  open: ['easy', 'medium', 'hard'],
};
const BAND_OF_GROUP = { junior: 'JUNIOR', middle: 'MIDDLE', senior: 'SENIOR', higher: 'HIGHER', open: null };

// Keeps the preferred difficulties when the pool is still big enough.
function preferDifficulty(pool, allowed, needed) {
  const preferred = pool.filter((q) => allowed.includes(q.difficulty));
  return preferred.length >= needed * 3 ? preferred : pool;
}

// The same week and class group always give the same 30 questions, so every student in a group sits one exam.
export async function buildWeeklyExam(classGroup, weekId) {
  const group = VEDIC_LEVELS[classGroup] ? classGroup : 'middle';
  const engine = await import('./dailyQuizEngine.js');
  const { hashString, mulberry, shuffled, isTextOnly, pickAcrossChapters, uniqueByPrompt, promptKey, APT_CHAPTERS, ALL_APT_CHAPTERS } = engine;
  const rand = mulberry(hashString(`${weekId}|${group}|weekly`));

  const [{ LESSON_QUESTIONS }, l1, l2, apt] = await Promise.all([
    import('../components/learn/QuizTab.jsx'),
    import('../data/reasoningAptitudeLevel1.js'),
    import('../data/reasoningAptitudeLevel2.js'),
    import('../data/aptitudeQuizBank.js'),
  ]);

  // Vedic Maths: one question from each of 10 different lessons.
  const lessonIds = shuffled(Object.keys(LESSON_QUESTIONS).filter((id) => VEDIC_LEVELS[group].some((lv) => id.startsWith(`${lv}_`))), rand);
  const vedic = [];
  const vedicKeys = new Set();
  for (let i = 0; vedic.length < EXAM_SECTION_SIZE && lessonIds.length && i < EXAM_SECTION_SIZE * 3; i++) {
    const id = lessonIds[i % lessonIds.length];
    const pool = preferDifficulty(LESSON_QUESTIONS[id], VEDIC_DIFFICULTY[group], 1);
    const q = pool[Math.floor(rand() * pool.length)];
    const key = q && String(q.q?.en ?? q.q).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (q && !vedicKeys.has(key)) { vedicKeys.add(key); vedic.push({ ...q, lesson: id }); }
  }
  const vedicOut = vedic.map((q, i) => ({
    id: `v${i + 1}`,
    type: 'vedic',
    q: q.q,
    options: q.options,
    correct: q.correct,
    hint: q.exp || (q.q && q.q.exp) || null,
    topic: { en: 'Vedic Maths', hi: 'वैदिक गणित' },
    difficulty: q.difficulty || 'medium',
  }));

  // Reasoning and Aptitude use the main banks, one chapter at a time.
  const raBase = group === 'junior' ? l1.RA_LEVEL1_QUESTIONS
    : group === 'senior' || group === 'higher' ? l2.RA_LEVEL2_QUESTIONS
    : [...l1.RA_LEVEL1_QUESTIONS, ...l2.RA_LEVEL2_QUESTIONS];
  // No question appears twice in the exam, even when Reasoning and Aptitude hold the same one.
  const seen = new Set();
  const ra = pickAcrossChapters(preferDifficulty(uniqueByPrompt(raBase.filter(isTextOnly), seen), VEDIC_DIFFICULTY[group], EXAM_SECTION_SIZE), EXAM_SECTION_SIZE, rand);
  ra.forEach((q) => seen.add(promptKey(q)));
  const aptChapters = new Set(BAND_OF_GROUP[group] ? APT_CHAPTERS[BAND_OF_GROUP[group]] : ALL_APT_CHAPTERS);
  const ap = pickAcrossChapters(
    preferDifficulty(uniqueByPrompt(apt.APTITUDE_QUESTIONS.filter((q) => aptChapters.has(q.chapter) && isTextOnly(q)), seen), VEDIC_DIFFICULTY[group], EXAM_SECTION_SIZE),
    EXAM_SECTION_SIZE, rand,
  );

  const keyOf = (o) => (typeof o === 'string' ? o : (o.en ?? o.label));
  const fromBank = (list, type, prefix, topic) => list.map((q, i) => {
    const options = shuffled(q.options, rand);
    return {
      id: `${prefix}${i + 1}`,
      type,
      q: q.prompt,
      options,
      correct: options.findIndex((o) => keyOf(o) === q.answer),
      hint: q.exp || null,
      topic,
      difficulty: q.difficulty || 'medium',
    };
  });

  return [
    ...vedicOut,
    ...fromBank(ra, 'reasoning', 'r', { en: 'Reasoning', hi: 'तर्क' }),
    ...fromBank(ap, 'aptitude', 'a', { en: 'Aptitude', hi: 'अभिक्षमता' }),
  ].filter((q) => q.correct >= 0);
}

// Scores answers of the form { selectedOption, timeTaken } (null when unanswered).
export function scoreExam(questions, answers) {
  let score = 0;
  const details = questions.map((q, i) => {
    const ans = answers[i];
    if (!ans) return { questionIndex: i, selectedOption: null, correct: false, timeTaken: 0 };
    const correct = ans.selectedOption === q.correct;
    if (correct) score += POINTS_CORRECT + (ans.timeTaken < FAST_SECONDS ? POINTS_FAST : 0);
    return { questionIndex: i, selectedOption: ans.selectedOption, correct, timeTaken: ans.timeTaken };
  });
  return { score, details };
}

// A started exam survives a refresh: answers and the end time are kept, so a refresh
// cannot restart the clock or show the answers again.
const ATTEMPT_KEY = 'vm_weekly_attempt';

export function loadAttempt(weekId, classGroup) {
  try {
    const a = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || 'null');
    return a && a.weekId === weekId && a.classGroup === classGroup ? a : null;
  } catch { return null; }
}

export function saveAttempt(attempt) {
  try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); } catch { /* storage full or blocked */ }
}

export function clearAttempt() {
  try { localStorage.removeItem(ATTEMPT_KEY); } catch { /* ignore */ }
}
