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
// Free users can only access l1_01
export function isLessonFreeAccess(lessonId) {
  const plan = getUserPlan();
  if (plan === 'free') return lessonId === 'l1_01';
  return true; // basic+ gets all lessons
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

// ─── AI Tutor gating (Basic: 20/day, Pro+: unlimited) ────────────────────────
const AI_BASIC_DAILY_LIMIT = 20;

export function getAITutorUsage() {
  try {
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    const today = new Date().toISOString().slice(0, 10);
    if (progress.aiTutorResetDate !== today) {
      return { used: 0, today };
    }
    return { used: progress.aiTutorUsedToday || 0, today };
  } catch {
    return { used: 0, today: new Date().toISOString().slice(0, 10) };
  }
}

export function incrementAITutorCount() {
  try {
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    const today = new Date().toISOString().slice(0, 10);
    const used = progress.aiTutorResetDate === today ? (progress.aiTutorUsedToday || 0) : 0;
    const updated = { ...progress, aiTutorUsedToday: used + 1, aiTutorResetDate: today };
    localStorage.setItem('vedicmind_progress', JSON.stringify(updated));
  } catch {}
}

export function getAITutorLimit() {
  const plan = getUserPlan();
  if (plan === 'free') return 0; // no access
  if (plan === 'basic') return AI_BASIC_DAILY_LIMIT;
  return Infinity;
}

export function isAITutorLimitReached() {
  const limit = getAITutorLimit();
  if (limit === 0) return true;
  if (limit === Infinity) return false;
  const { used } = getAITutorUsage();
  return used >= limit;
}

export function getAITutorRemaining() {
  const limit = getAITutorLimit();
  if (limit === Infinity) return Infinity;
  const { used } = getAITutorUsage();
  return Math.max(0, limit - used);
}