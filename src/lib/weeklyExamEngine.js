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