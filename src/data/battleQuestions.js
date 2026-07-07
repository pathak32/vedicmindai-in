// Question bank for Battle Mode 1v1 matches. Each match randomly draws
// 5 questions from this pool so repeated battles don't feel identical.

export const BATTLE_QUESTIONS = [
  { prompt: '98 × 97 = ?', options: ['9406', '9506', '9606'], answer: '9506', tag: 'Nikhilam Sutra' },
  { prompt: '75² = ?', options: ['5625', '5525', '5725'], answer: '5625', tag: 'Ekadhikena Purvena' },
  { prompt: '123 × 11 = ?', options: ['1353', '1343', '1453'], answer: '1353', tag: 'By 11 Trick' },
  { prompt: '999 × 998 = ?', options: ['997002', '996002', '998002'], answer: '997002', tag: 'Nikhilam Sutra' },
  { prompt: '48 × 52 = ?', options: ['2496', '2596', '2400'], answer: '2496', tag: 'Antyayor Dashakepi' },
  { prompt: '106 × 104 = ?', options: ['11024', '10924', '11124'], answer: '11024', tag: 'Nikhilam Sutra' },
  { prompt: '45² = ?', options: ['2025', '2125', '1925'], answer: '2025', tag: 'Ekadhikena Purvena' },
  { prompt: '89 × 91 = ?', options: ['8099', '8199', '7999'], answer: '8099', tag: 'Antyayor Dashakepi' },
  { prompt: '65² = ?', options: ['4225', '4125', '4325'], answer: '4225', tag: 'Ekadhikena Purvena' },
  { prompt: '997 × 996 = ?', options: ['993012', '992012', '994012'], answer: '993012', tag: 'Nikhilam Sutra' },
  { prompt: '112 × 108 = ?', options: ['12096', '11996', '12196'], answer: '12096', tag: 'Nikhilam Sutra' },
  { prompt: '234 × 11 = ?', options: ['2574', '2564', '2674'], answer: '2574', tag: 'By 11 Trick' },
  { prompt: '85² = ?', options: ['7225', '7125', '7325'], answer: '7225', tag: 'Ekadhikena Purvena' },
  { prompt: '96 × 94 = ?', options: ['9024', '9124', '8924'], answer: '9024', tag: 'Antyayor Dashakepi' },
  { prompt: '25² = ?', options: ['625', '525', '725'], answer: '625', tag: 'Ekadhikena Purvena' },
];

export const BATTLE_TOPICS = ['Mixed', 'Nikhilam Sutra', 'Ekadhikena Purvena', 'By 11 Trick', 'Antyayor Dashakepi'];

export function drawBattleQuestions(count = 5, topic = 'Mixed') {
  const pool = topic === 'Mixed' ? BATTLE_QUESTIONS : BATTLE_QUESTIONS.filter((q) => q.tag === topic);
  const source = pool.length >= count ? pool : BATTLE_QUESTIONS; // fall back if a topic is too small
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
