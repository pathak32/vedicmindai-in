// Bank of 20 questions for the homepage "Test Your Mind" challenge.
// Mix of Vedic Maths sutra-based calculations, Aptitude, and Reasoning —
// mirrors the three pillars taught inside the app.

export const MIND_CHECK_QUESTIONS = [
  // --- Vedic Maths / Sutras ---
  { id: 1, category: 'sutra', tag: 'Nikhilam Sutra', prompt: '98 × 97 = ?', options: ['9406', '9506', '9606'], answer: '9506' },
  { id: 2, category: 'sutra', tag: 'Ekadhikena Purvena', prompt: '75² = ?', options: ['5625', '5525', '5725'], answer: '5625' },
  { id: 3, category: 'sutra', tag: 'By 11 Trick', prompt: '123 × 11 = ?', options: ['1353', '1343', '1453'], answer: '1353' },
  { id: 4, category: 'sutra', tag: 'Nikhilam Sutra', prompt: '999 × 998 = ?', options: ['997002', '996002', '998002'], answer: '997002' },
  { id: 5, category: 'sutra', tag: 'Antyayor Dashakepi', prompt: '48 × 52 = ?', options: ['2496', '2596', '2400'], answer: '2496' },
  { id: 6, category: 'sutra', tag: 'Nikhilam Sutra', prompt: '106 × 104 = ?', options: ['11024', '10924', '11124'], answer: '11024' },
  { id: 7, category: 'sutra', tag: 'Ekadhikena Purvena', prompt: '45² = ?', options: ['2025', '2125', '1925'], answer: '2025' },
  { id: 8, category: 'sutra', tag: 'Antyayor Dashakepi', prompt: '89 × 91 = ?', options: ['8099', '8199', '7999'], answer: '8099' },

  // --- Aptitude ---
  { id: 9, category: 'aptitude', tag: 'Speed & Distance', prompt: 'A train covers 60 km in 45 min. Speed in km/h?', options: ['80', '75', '90'], answer: '80' },
  { id: 10, category: 'aptitude', tag: 'Profit & Loss', prompt: 'Sold for ₹120 at 20% profit. Cost price?', options: ['₹100', '₹110', '₹90'], answer: '₹100' },
  { id: 11, category: 'aptitude', tag: 'Number Series', prompt: '2, 6, 12, 20, 30, ?', options: ['40', '42', '36'], answer: '42' },
  { id: 12, category: 'aptitude', tag: 'Time & Work', prompt: '5 workers build a wall in 12 days. Time for 10 workers?', options: ['6 days', '8 days', '10 days'], answer: '6 days' },
  { id: 13, category: 'aptitude', tag: 'Simple Interest', prompt: '₹800 becomes ₹880 in 1 year. Rate of interest?', options: ['10%', '12%', '8%'], answer: '10%' },
  { id: 14, category: 'aptitude', tag: 'Number Series', prompt: '3, 9, 27, 81, ?', options: ['243', '162', '324'], answer: '243' },

  // --- Reasoning ---
  { id: 15, category: 'reasoning', tag: 'Odd One Out', prompt: 'Which does not belong: Apple, Banana, Carrot, Mango?', options: ['Apple', 'Carrot', 'Mango'], answer: 'Carrot' },
  { id: 16, category: 'reasoning', tag: 'Coding-Decoding', prompt: 'If CAT = DBU, then DOG = ?', options: ['EPH', 'EPI', 'FPH'], answer: 'EPH' },
  { id: 17, category: 'reasoning', tag: 'Blood Relations', prompt: '"She is the daughter of my grandfather\'s only son." Who is she to him?', options: ['Sister', 'Daughter', 'Niece'], answer: 'Sister' },
  { id: 18, category: 'reasoning', tag: 'Number Series', prompt: '1, 4, 9, 16, 25, ?', options: ['36', '30', '49'], answer: '36' },
  { id: 19, category: 'reasoning', tag: 'Coding-Decoding', prompt: 'If MONEY = NPOFZ, then HONEST = ?', options: ['IPOFTU', 'IPOETU', 'IPOFTV'], answer: 'IPOFTU' },
  { id: 20, category: 'reasoning', tag: 'Logical Order', prompt: 'A > B, B > C, C > D (height). Who is shortest?', options: ['D', 'A', 'C'], answer: 'D' },
];

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
