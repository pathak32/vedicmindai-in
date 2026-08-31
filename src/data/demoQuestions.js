// Demo question bank — 40 questions across 4 subjects × 3 difficulties
// Used by DemoPage.jsx for the interactive pre-signup demo
// All questions are self-contained (no external dependencies)

export const DEMO_QUESTIONS = [

  // ── VEDIC MATHS — EASY ────────────────────────────────────────────────────
  { id: 'vm_e1', subject: 'Vedic Maths', difficulty: 'easy', emoji: '🧮',
    topic: 'Ekadhikena Purvena', question: 'What is 35²?',
    hint: 'Numbers ending in 5: (3×4) | 25 → 1225',
    options: ['1025', '1225', '1125', '1325'], correct: 1 },

  { id: 'vm_e2', subject: 'Vedic Maths', difficulty: 'easy', emoji: '🧮',
    topic: 'Multiply by 11', question: 'What is 53 × 11?',
    hint: 'Add digits and place between: 5_(5+3)_3',
    options: ['583', '593', '573', '603'], correct: 0 },

  { id: 'vm_e3', subject: 'Vedic Maths', difficulty: 'easy', emoji: '🧮',
    topic: 'Multiply by 5', question: 'What is 148 × 5?',
    hint: 'Divide by 2, multiply by 10: 148÷2 = 74 → 740',
    options: ['720', '730', '740', '750'], correct: 2 },

  { id: 'vm_e4', subject: 'Vedic Maths', difficulty: 'easy', emoji: '🧮',
    topic: 'Complement Method', question: 'What is 97 × 99?',
    hint: 'Both close to 100: (97-1)(99-1) | 03×01 = 9603',
    options: ['9603', '9503', '9703', '9403'], correct: 0 },

  // ── VEDIC MATHS — MEDIUM ─────────────────────────────────────────────────
  { id: 'vm_m1', subject: 'Vedic Maths', difficulty: 'medium', emoji: '🧮',
    topic: 'Urdhva Tiryagbhyam', question: 'What is 23 × 47?',
    hint: 'Cross-multiply: (2×4) | (2×7 + 3×4) | (3×7)',
    options: ['1071', '1081', '1091', '1061'], correct: 1 },

  { id: 'vm_m2', subject: 'Vedic Maths', difficulty: 'medium', emoji: '🧮',
    topic: 'Squaring', question: 'What is 64²?',
    hint: '(60+4)² = 3600 + 480 + 16',
    options: ['4006', '4096', '4016', '4196'], correct: 1 },

  { id: 'vm_m3', subject: 'Vedic Maths', difficulty: 'medium', emoji: '🧮',
    topic: 'Division Shortcut', question: 'What is 108 ÷ 9?',
    hint: 'Digit sum of 108 = 9, so it divides exactly',
    options: ['11', '12', '13', '14'], correct: 1 },

  // ── VEDIC MATHS — HARD ───────────────────────────────────────────────────
  { id: 'vm_h1', subject: 'Vedic Maths', difficulty: 'hard', emoji: '🧮',
    topic: 'Cube Root', question: 'What is ∛13824?',
    hint: 'Last digit 4 → cube root ends in 4. First group 13 → 2³=8, 3³=27. So 24.',
    options: ['22', '23', '24', '26'], correct: 2 },

  { id: 'vm_h2', subject: 'Vedic Maths', difficulty: 'hard', emoji: '🧮',
    topic: 'Paravartya', question: 'What is 1023 ÷ 97?',
    hint: 'Nikhilam division: divisor close to 100',
    options: ['10 rem 53', '11 rem 53', '10 rem 43', '11 rem 43'], correct: 0 },

  // ── REASONING — EASY ─────────────────────────────────────────────────────
  { id: 're_e1', subject: 'Reasoning', difficulty: 'easy', emoji: '🧠',
    topic: 'Number Series', question: 'Find the next number: 2, 6, 12, 20, 30, ?',
    hint: 'Differences: 4, 6, 8, 10... next difference is 12',
    options: ['38', '40', '42', '44'], correct: 2 },

  { id: 're_e2', subject: 'Reasoning', difficulty: 'easy', emoji: '🧠',
    topic: 'Letter Series', question: 'Find the next: AZ, BY, CX, DW, ?',
    hint: 'First letter goes forward, second goes backward',
    options: ['EV', 'EU', 'FV', 'EW'], correct: 0 },

  { id: 're_e3', subject: 'Reasoning', difficulty: 'easy', emoji: '🧠',
    topic: 'Odd One Out', question: 'Which is the odd one out: Square, Circle, Triangle, Cube?',
    hint: 'Three are 2D shapes, one is 3D',
    options: ['Square', 'Circle', 'Triangle', 'Cube'], correct: 3 },

  { id: 're_e4', subject: 'Reasoning', difficulty: 'easy', emoji: '🧠',
    topic: 'Analogy', question: 'Book is to Library as Painting is to?',
    hint: 'Where is a collection of that thing kept?',
    options: ['Artist', 'Gallery', 'Museum', 'Canvas'], correct: 1 },

  // ── REASONING — MEDIUM ───────────────────────────────────────────────────
  { id: 're_m1', subject: 'Reasoning', difficulty: 'medium', emoji: '🧠',
    topic: 'Seating Arrangement', question: 'A sits to the left of B. C sits to the right of B. D sits between A and B. Who is second from left?',
    hint: 'Order from left: A, D, B, C',
    options: ['A', 'B', 'C', 'D'], correct: 3 },

  { id: 're_m2', subject: 'Reasoning', difficulty: 'medium', emoji: '🧠',
    topic: 'Coding-Decoding', question: 'If MANGO = NBOHP, what does GRAPE = ?',
    hint: 'Each letter is shifted by +1',
    options: ['HSBQF', 'HSBOF', 'ISBQF', 'HSBPE'], correct: 0 },

  { id: 're_m3', subject: 'Reasoning', difficulty: 'medium', emoji: '🧠',
    topic: 'Blood Relations', question: 'A is the father of B. B is the sister of C. C is the son of D. How is A related to D?',
    hint: 'B is C\'s sister, so A is C\'s father too. C is D\'s son, so D is C\'s other parent — the mother. Both are C\'s parents, so A is D\'s husband',
    options: ['Husband', 'Brother', 'Father-in-law', 'Uncle'], correct: 0 },

  // ── REASONING — HARD ─────────────────────────────────────────────────────
  { id: 're_h1', subject: 'Reasoning', difficulty: 'hard', emoji: '🧠',
    topic: 'Syllogism', question: 'All pens are books. Some books are copies. Conclusion: Some pens are copies — True or False?',
    hint: 'All pens are books, but only SOME books are copies — those some may or may not be pens',
    options: ['Definitely True', 'Possibly True', 'Definitely False', 'Data Insufficient'], correct: 1 },

  { id: 're_h2', subject: 'Reasoning', difficulty: 'hard', emoji: '🧠',
    topic: 'Direction Sense', question: 'Rahul walks 10km North, turns right 5km, turns right 10km, turns left 5km. How far is he from the start?',
    hint: 'Track X and Y coordinates at each step',
    options: ['5 km', '10 km', '15 km', '20 km'], correct: 1 },

  // ── APTITUDE — EASY ──────────────────────────────────────────────────────
  { id: 'ap_e1', subject: 'Aptitude', difficulty: 'easy', emoji: '📊',
    topic: 'Percentage', question: 'What is 15% of 240?',
    hint: '10% = 24, 5% = 12. Add: 24+12',
    options: ['34', '36', '38', '40'], correct: 1 },

  { id: 'ap_e2', subject: 'Aptitude', difficulty: 'easy', emoji: '📊',
    topic: 'Simple Interest', question: 'SI on ₹1000 at 5% per annum for 3 years?',
    hint: 'SI = P×R×T/100',
    options: ['₹100', '₹150', '₹200', '₹250'], correct: 1 },

  { id: 'ap_e3', subject: 'Aptitude', difficulty: 'easy', emoji: '📊',
    topic: 'Ratio & Proportion', question: 'If 3:5 = x:20, find x.',
    hint: 'Cross multiply: 5x = 60',
    options: ['10', '11', '12', '13'], correct: 2 },

  { id: 'ap_e4', subject: 'Aptitude', difficulty: 'easy', emoji: '📊',
    topic: 'Speed & Distance', question: 'A train travels 120 km in 2 hours. What is its speed?',
    hint: 'Speed = Distance ÷ Time',
    options: ['50 km/h', '55 km/h', '60 km/h', '65 km/h'], correct: 2 },

  // ── APTITUDE — MEDIUM ────────────────────────────────────────────────────
  { id: 'ap_m1', subject: 'Aptitude', difficulty: 'medium', emoji: '📊',
    topic: 'Profit & Loss', question: 'A shopkeeper buys an item for ₹400 and sells for ₹500. What is the profit percentage?',
    hint: 'Profit% = (Profit/CP) × 100',
    options: ['20%', '22%', '25%', '28%'], correct: 2 },

  { id: 'ap_m2', subject: 'Aptitude', difficulty: 'medium', emoji: '📊',
    topic: 'Time & Work', question: 'A can do a job in 10 days, B in 15 days. Working together, how many days?',
    hint: 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6',
    options: ['4 days', '5 days', '6 days', '7 days'], correct: 2 },

  { id: 'ap_m3', subject: 'Aptitude', difficulty: 'medium', emoji: '📊',
    topic: 'Compound Interest', question: 'CI on ₹1000 at 10% p.a. for 2 years?',
    hint: 'Year 1: 1100. Year 2: 1100×1.1 = 1210. CI = 210',
    options: ['₹200', '₹205', '₹210', '₹215'], correct: 2 },

  // ── APTITUDE — HARD ──────────────────────────────────────────────────────
  { id: 'ap_h1', subject: 'Aptitude', difficulty: 'hard', emoji: '📊',
    topic: 'Permutations', question: 'In how many ways can 5 people sit in a row if 2 specific people must sit together?',
    hint: 'Treat the 2 as 1 unit: 4! × 2! arrangements',
    options: ['24', '36', '48', '96'], correct: 2 },

  { id: 'ap_h2', subject: 'Aptitude', difficulty: 'hard', emoji: '📊',
    topic: 'Data Interpretation', question: 'If sales in Jan=₹40L, Feb=₹50L, Mar=₹45L, what % increase from Jan to Mar?',
    hint: '(45-40)/40 × 100',
    options: ['10.5%', '11%', '12.5%', '15%'], correct: 2 },

  // ── VEDIC SCIENCE — EASY ─────────────────────────────────────────────────
  { id: 'vs_e1', subject: 'Vedic Science', difficulty: 'easy', emoji: '🔬',
    topic: 'Vedic Physics', question: 'Who described atomic theory in India ~2,400 years before John Dalton?',
    hint: 'His name means "one who studies the smallest particles"',
    options: ['Aryabhatta', 'Rishi Kanada', 'Bhaskaracharya', 'Chanakya'], correct: 1 },

  { id: 'vs_e2', subject: 'Vedic Science', difficulty: 'easy', emoji: '🔬',
    topic: 'Vedic Biology', question: 'Who performed plastic surgery (rhinoplasty) 2,600 years ago?',
    hint: 'His text lists 300+ surgical procedures and 120 instruments',
    options: ['Charaka', 'Dhanvantari', 'Sushruta', 'Vagbhata'], correct: 2 },

  { id: 'vs_e3', subject: 'Vedic Science', difficulty: 'easy', emoji: '🔬',
    topic: 'Vedic Maths History', question: 'The Kerala School mathematician who developed infinite series 300 years before Newton was?',
    hint: 'He lived from 1340-1425 CE',
    options: ['Brahmagupta', 'Madhava', 'Pingala', 'Aryabhatta'], correct: 1 },

  { id: 'vs_m1', subject: 'Vedic Science', difficulty: 'medium', emoji: '🔬',
    topic: 'Ancient Chemistry', question: 'The Delhi Iron Pillar (400 CE) is famous for what scientific achievement?',
    hint: 'It has stood for 1,600 years without this common problem',
    options: ['Magnetic properties', 'No rust for 1,600 years', 'Perfect symmetry', 'Electrical conductivity'], correct: 1 },

  { id: 'vs_h1', subject: 'Vedic Science', difficulty: 'hard', emoji: '🔬',
    topic: 'Quantum Physics & Vedas', question: 'Which Nobel physicist said "Quantum theory will not look ridiculous to people who have read Vedanta"?',
    hint: 'He formulated the Uncertainty Principle',
    options: ['Niels Bohr', 'Albert Einstein', 'Werner Heisenberg', 'Erwin Schrödinger'], correct: 2 },
];

export const SUBJECTS = ['Mixed', 'Vedic Maths', 'Reasoning', 'Aptitude', 'Vedic Science'];
export const DIFFICULTIES = ['All', 'easy', 'medium', 'hard'];
export const QUESTION_COUNTS = [5, 10, 15];

export function pickDemoQuestions(subject = 'Mixed', difficulty = 'All', count = 10) {
  let pool = DEMO_QUESTIONS;
  if (subject !== 'Mixed') pool = pool.filter(q => q.subject === subject);
  if (difficulty !== 'All') pool = pool.filter(q => q.difficulty === difficulty);

  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // If mixed, ensure variety across subjects
  if (subject === 'Mixed' && difficulty === 'All') {
    const subjects = ['Vedic Maths', 'Reasoning', 'Aptitude', 'Vedic Science'];
    const perSubject = Math.floor(count / subjects.length);
    const result = [];
    subjects.forEach(s => {
      const sq = shuffled.filter(q => q.subject === s).slice(0, perSubject);
      result.push(...sq);
    });
    // Fill remaining slots with any leftover
    const remaining = shuffled.filter(q => !result.includes(q));
    result.push(...remaining.slice(0, count - result.length));
    return result.slice(0, count).sort(() => Math.random() - 0.5);
  }

  return shuffled.slice(0, count);
}
