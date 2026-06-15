// VedicMind AI Tutor — Daily Message Limits
// Free: 10/day | Basic: 30/day | Pro: 100/day

const LIMITS = { free: 10, trial: 10, basic: 30, pro: 100, demo: 20, admin: 9999 };

function getTodayKey(userId) {
  const today = new Date().toISOString().slice(0, 10);
  return `vm_ai_limit_${userId}_${today}`;
}

export function getAILimit(plan) {
  return LIMITS[plan?.toLowerCase()] ?? 10;
}

export function getAIUsage(userId) {
  try {
    const key = getTodayKey(userId);
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch { return 0; }
}

export function incrementAIUsage(userId) {
  try {
    const key = getTodayKey(userId);
    const current = getAIUsage(userId);
    localStorage.setItem(key, (current + 1).toString());
    return current + 1;
  } catch { return 0; }
}

export function canUseAI(userId, plan) {
  const limit = getAILimit(plan);
  const used = getAIUsage(userId);
  return used < limit;
}

export function getRemainingMessages(userId, plan) {
  const limit = getAILimit(plan);
  const used = getAIUsage(userId);
  return Math.max(0, limit - used);
}
