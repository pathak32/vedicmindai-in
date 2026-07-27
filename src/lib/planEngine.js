// ─── Plan Engine ─────────────────────────────────────────────────────────────
// Central source of truth for plan-based feature gating.

export function getUserPlan() {
  try {
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    return progress.plan || 'free';
  } catch {
    return 'free';
  }
}

// Returns true if the user has at least the given plan tier
const TIER_ORDER = ['free', 'basic', 'pro', 'family'];
export function hasPlan(minPlan) {
  const current = getUserPlan();
  return TIER_ORDER.indexOf(current) >= TIER_ORDER.indexOf(minPlan);
}

// ─── Free plan lesson gating ──────────────────────────────────────────────────
// Free users get Concept + Practice access for l1_01 through l1_05 (5 lessons)
// — enough to genuinely learn the techniques. Quizzes stay locked for free
// users on ALL lessons (see isQuizFreeAccess below) — this is the deliberate
// "curiosity gap" conversion mechanism: you can learn it, but you can't verify
// you've mastered it without upgrading. Decided 24-Jun-2026.
const FREE_LESSON_IDS = ['l1_01', 'l1_02', 'l1_03', 'l1_04', 'l1_05'];

export function isLessonFreeAccess(lessonId) {
  const plan = getUserPlan();
  if (plan === 'free') return FREE_LESSON_IDS.includes(lessonId);
  return true; // basic+ gets all lessons
}

// Quiz access is gated separately from lesson content. Free users can read
// concepts and try practice questions (untimed, no XP-gating consequence),
// but cannot take the scored Quiz tab on any lesson — that requires upgrading.
export function isQuizFreeAccess(lessonId) {
  const plan = getUserPlan();
  if (plan === 'free') return false;
  return true;
}

// ─── Aptitude gating ──────────────────────────────────────────────────────────
const APTITUDE_FREE_LIMIT = 5;
const APTITUDE_BASIC_LIMIT = 30;

export function getAptitudeUsage() {
  try {
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    const thisMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    if (progress.aptitudeFreeMonth !== thisMonth) {
      return { used: 0, month: thisMonth };
    }
    return { used: progress.aptitudeFreeCount || 0, month: thisMonth };
  } catch {
    return { used: 0, month: new Date().toISOString().slice(0, 7) };
  }
}

export function incrementAptitudeCount() {
  try {
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    const thisMonth = new Date().toISOString().slice(0, 7);
    const used = progress.aptitudeFreeMonth === thisMonth ? (progress.aptitudeFreeCount || 0) : 0;
    const updated = { ...progress, aptitudeFreeCount: used + 1, aptitudeFreeMonth: thisMonth };
    localStorage.setItem('vedicmind_progress', JSON.stringify(updated));
  } catch {}
}

export function getAptitudeLimit() {
  const plan = getUserPlan();
  if (plan === 'free') return APTITUDE_FREE_LIMIT;
  if (plan === 'basic') return APTITUDE_BASIC_LIMIT;
  return Infinity; // pro / family
}

export function isAptitudeLimitReached() {
  const limit = getAptitudeLimit();
  if (limit === Infinity) return false;
  const { used } = getAptitudeUsage();
  return used >= limit;
}

// ─── Reasoning & Aptitude — one full chapter free (Jul 27 decision) ───────────
// Different model from Vedic Maths on purpose: instead of many lessons with
// concept+practice only (no quiz), free users get exactly ONE chapter with
// FULL access (concept AND quiz), so they experience the complete value once,
// then see a subscribe prompt for every other chapter. Chosen as each
// vertical's natural Chapter 1.
const FREE_REASONING_CHAPTER = 'odd-one-out';       // Level 1, Chapter 1
const FREE_APTITUDE_CHAPTER = 'word-meanings';      // Primary, Chapter 1

export function isReasoningChapterFreeAccess(chapterId) {
  const plan = getUserPlan();
  if (plan === 'free') return chapterId === FREE_REASONING_CHAPTER;
  return true; // basic+ gets everything
}

export function isAptitudeChapterFreeAccess(chapterId) {
  const plan = getUserPlan();
  if (plan === 'free') return chapterId === FREE_APTITUDE_CHAPTER;
  return true; // basic+ gets everything
}

// Quiz access for Reasoning/Aptitude follows the SAME single-chapter rule as
// concept access (unlike Vedic Maths, where quiz is blocked on every free
// lesson) — the one free chapter is meant to be a genuinely complete preview.
export const isReasoningChapterQuizFreeAccess = isReasoningChapterFreeAccess;
export const isAptitudeChapterQuizFreeAccess = isAptitudeChapterFreeAccess;

