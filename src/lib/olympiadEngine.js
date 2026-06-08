// ─── Olympiad Level Logic ────────────────────────────────────────────────────

export function getOlympiadLevel(grade) {
  if (!grade) return 'senior';
  if (grade >= 1 && grade <= 7) return 'junior';
  if (grade >= 8 && grade <= 12) return 'senior';
  if (grade >= 13) return 'open';
  return 'senior';
}

export function getOlympiadLevelLabel(level) {
  const labels = {
    junior: 'Junior Level (Class 1–7)',
    senior: 'Senior Level (Class 8–12)',
    open: 'Open Level (Adults)',
  };
  return labels[level] || 'Senior Level';
}

// ─── Quarter ID ──────────────────────────────────────────────────────────────

export function getQuarterId() {
  const now = new Date();
  const month = now.getMonth();
  const q = Math.floor(month / 3) + 1;
  return 'Q' + q + '-' + now.getFullYear();
}

// ─── Schedule Logic ──────────────────────────────────────────────────────────

function lastSundayOf(year, month) {
  const lastDay = new Date(year, month + 1, 0);
  const day = lastDay.getDay();
  const offset = day === 0 ? 0 : day;
  return new Date(year, month, lastDay.getDate() - offset);
}

export function getNextOlympiadDate() {
  const now = new Date();
  const year = now.getFullYear();

  const dates = [
    lastSundayOf(year, 2),  // March
    lastSundayOf(year, 5),  // June
    lastSundayOf(year, 8),  // September
    lastSundayOf(year, 11), // December
  ];

  for (const d of dates) {
    if (d >= now) return d;
  }
  return lastSundayOf(year + 1, 2);
}

export function getOlympiadStatus() {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.olympiadHistory || [];

  const next = getNextOlympiadDate();
  const now = new Date();

  const isToday =
    now.getFullYear() === next.getFullYear() &&
    now.getMonth() === next.getMonth() &&
    now.getDate() === next.getDate();

  if (isToday) {
    const todayStr =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');
    const done = history.find(e => e.date === todayStr);
    if (done) return 'completed';
    if (now.getHours() >= 10) return 'live';
    return 'today_waiting';
  }
  return 'upcoming';
}

// ─── Formatting Helpers ──────────────────────────────────────────────────────

export function formatOlympiadDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDaysUntil(date) {
  const now = new Date();
  const diff = date - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── Question Bank Cache ─────────────────────────────────────────────────────

export function getCachedQuestions(level) {
  try {
    const cache = JSON.parse(localStorage.getItem('vedicmind_olympiad_banks') || '{}');
    const quarterId = getQuarterId();
    return cache[quarterId]?.[level] || null;
  } catch {
    return null;
  }
}

export function setCachedQuestions(level, questions) {
  try {
    const cache = JSON.parse(localStorage.getItem('vedicmind_olympiad_banks') || '{}');
    const quarterId = getQuarterId();
    if (!cache[quarterId]) cache[quarterId] = {};
    cache[quarterId][level] = questions;
    localStorage.setItem('vedicmind_olympiad_banks', JSON.stringify(cache));
  } catch {}
}

// ─── Save Result ─────────────────────────────────────────────────────────────

export function saveOlympiadResult(result) {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  if (!progress.olympiadHistory) progress.olympiadHistory = [];

  const xpGain = Math.floor(result.score / 3);
  progress.totalXP = (progress.totalXP || 0) + xpGain;

  // Badges
  if (!progress.badges) progress.badges = [];
  const addBadge = (id) => {
    if (!progress.badges.includes(id)) progress.badges.push(id);
  };
  addBadge('olympiad_participant');
  if (result.score >= 90) addBadge('olympiad_bronze');
  if (result.score >= 120) addBadge('olympiad_silver');
  if (result.score >= 150) addBadge('olympiad_gold');

  progress.olympiadHistory.push(result);
  localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
}