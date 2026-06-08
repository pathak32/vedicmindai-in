function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeChoices(correct) {
  const wrongs = new Set();
  const deltas = [10, 20, 100, 25, 50, 75, 5, 15];
  while (wrongs.size < 3) {
    const delta = randFrom(deltas) * (Math.random() < 0.5 ? 1 : -1);
    const w = correct + delta;
    if (w > 0 && w !== correct) wrongs.add(w);
  }
  const options = shuffle([correct, ...wrongs]);
  return { options, correctIndex: options.indexOf(correct) };
}

export function generateQuestion(topic) {
  if (topic === 'ekadhikena') {
    const nums = [15, 25, 35, 45, 55, 65, 75, 85, 95];
    const n = randFrom(nums);
    const d = Math.floor(n / 10);
    const answer = d * (d + 1) * 100 + 25;
    const { options, correctIndex } = makeChoices(answer);
    return { question: `What is ${n}²?`, answer, options, correctIndex, topic };
  }

  if (topic === 'nikhilam_100') {
    const pool = [91, 92, 93, 94, 95, 96, 97, 98, 99];
    const a = randFrom(pool), b = randFrom(pool);
    const defA = a - 100, defB = b - 100;
    const cross = a + defB;
    const prod = defA * defB;
    const answer = cross * 100 + prod;
    const { options, correctIndex } = makeChoices(answer);
    return { question: `Calculate ${a} × ${b}`, answer, options, correctIndex, topic };
  }

  if (topic === 'multiply_11') {
    const nums = [12, 13, 14, 21, 22, 23, 24, 31, 32, 41, 43, 52, 61, 71, 81];
    const n = randFrom(nums);
    const answer = n * 11;
    const { options, correctIndex } = makeChoices(answer);
    return { question: `What is ${n} × 11?`, answer, options, correctIndex, topic };
  }

  if (topic === 'multiply_9') {
    const nums = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25];
    const n = randFrom(nums);
    const answer = n * 9;
    const { options, correctIndex } = makeChoices(answer);
    return { question: `What is ${n} × 9?`, answer, options, correctIndex, topic };
  }

  if (topic === 'multiply_99') {
    const nums = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32];
    const n = randFrom(nums);
    const answer = n * 99;
    const { options, correctIndex } = makeChoices(answer);
    return { question: `What is ${n} × 99?`, answer, options, correctIndex, topic };
  }

  if (topic === 'digit_sum') {
    const a = Math.floor(Math.random() * 90) + 10;
    const b = Math.floor(Math.random() * 90) + 10;
    const product = a * b;
    const ds = (n) => { let s = n; while (s >= 10) { s = String(s).split('').reduce((a, d) => a + parseInt(d), 0); } return s; };
    const answer = ds(product);
    const wrongPool = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== answer);
    const wrongs = shuffle(wrongPool).slice(0, 3);
    const options = shuffle([answer, ...wrongs]);
    return { question: `What is the digit sum of ${a} × ${b} = ${product}?`, answer, options, correctIndex: options.indexOf(answer), topic };
  }

  // fallback: multiply_11
  return generateQuestion('multiply_11');
}

export function generateMixed() {
  const topics = ['ekadhikena', 'nikhilam_100', 'multiply_11', 'multiply_9', 'multiply_99'];
  // bias toward harder topics for challenge
  const weighted = ['nikhilam_100', 'nikhilam_100', 'ekadhikena', 'multiply_99', 'multiply_99', 'multiply_11', 'multiply_9'];
  return generateQuestion(randFrom(weighted));
}

export const TOPIC_OPTIONS = [
  { value: 'ekadhikena',   label: 'Ekadhikena Purvena — Squaring in 5s' },
  { value: 'nikhilam_100', label: 'Nikhilam — Near Base Multiplication' },
  { value: 'multiply_11',  label: 'Urdhva-Tiryagbhyam — Multiply by 11' },
  { value: 'multiply_9',   label: 'Multiplication by 9' },
  { value: 'multiply_99',  label: 'Multiplication by 99' },
  { value: 'digit_sum',    label: 'Digit Sum Verification' },
];

export function getTodayString() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function saveProgress({ xpEarned, mode, score, accuracy }) {
  const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  p.totalXP = Math.max(0, (p.totalXP || 0) + xpEarned);
  if (!p.practiceHistory) p.practiceHistory = [];
  p.practiceHistory.push({ mode, date: getTodayString(), score, xpEarned, accuracy });
  if (!p.badges) p.badges = [];

  // badge checks
  if (mode === 'speed' && xpEarned > 200 && !p.badges.includes('speed_demon')) p.badges.push('speed_demon');
  if (mode === 'challenge' && !p.badges.includes('challenger')) p.badges.push('challenger');

  // streak
  const today = getTodayString();
  if (!p.studyDates) p.studyDates = [];
  if (!p.studyDates.includes(today)) p.studyDates.push(today);

  const yesterday = (() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  })();

  if (!p.lastStudyDate) { p.streak = 1; }
  else if (p.lastStudyDate === today) { /* unchanged */ }
  else if (p.lastStudyDate === yesterday) { p.streak = (p.streak || 0) + 1; }
  else { p.streak = 1; }
  p.lastStudyDate = today;

  localStorage.setItem('vedicmind_progress', JSON.stringify(p));
}