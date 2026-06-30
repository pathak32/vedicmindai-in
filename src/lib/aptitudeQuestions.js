// ─── Class group helper ───────────────────────────────────────────────────────

export function getClassGroup(classNum) {
  const n = parseInt(classNum) || 8;
  if (n <= 5)  return 'PRIMARY';
  if (n <= 8)  return 'MIDDLE';
  if (n <= 10) return 'SECONDARY';
  return 'INTERMEDIATE';
}

export const CLASS_GROUPS = {
  PRIMARY:      { label: 'Primary (1–5)',       classes: [1,2,3,4,5],     color: '#10B981', bg: '#D1FAE5' },
  MIDDLE:       { label: 'Middle (6–8)',         classes: [6,7,8],         color: '#3B82F6', bg: '#DBEAFE' },
  SECONDARY:    { label: 'Secondary (9–10)',     classes: [9,10],          color: '#8B5CF6', bg: '#EDE9FE' },
  INTERMEDIATE: { label: 'Intermediate (11–12)', classes: [11,12],         color: '#F59E0B', bg: '#FEF3C7' },
};

export const TOPICS = {
  PRIMARY:      ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Tables'],
  MIDDLE:       ['Fractions', 'Percentages', 'Squares & Cubes', 'Basic Algebra', 'HCF & LCM'],
  SECONDARY:    ['Speed Maths', 'Number Systems', 'Profit & Loss', 'Time & Work', 'Vedic Tricks'],
  INTERMEDIATE: ['Vedic Algebra', 'Quadratic Equations', 'Number Theory', 'Sequences', 'Mental Calculus'],
};

// ─── Question Bank ────────────────────────────────────────────────────────────

const QUESTIONS = [

  // ── PRIMARY ──────────────────────────────────────────────────────────────────

  // Addition
  { id: 'p01', group: 'PRIMARY', topic: 'Addition',
    question: 'What is 48 + 37?',
    options: ['75','84','85','87'], correct: 2,
    vedic_sutra: 'Ekadhikena Purvena', difficulty: 1,
    vedic_tip: 'Round 48 → 50, add 37 = 87, subtract 2 → 85. Always round up then adjust!' },

  { id: 'p02', group: 'PRIMARY', topic: 'Addition',
    question: 'What is 99 + 56?',
    options: ['154','155','156','157'], correct: 1,
    vedic_sutra: 'Nikhilam', difficulty: 1,
    vedic_tip: '99 = 100 − 1. So 100 + 56 = 156, then subtract 1 → 155. Fast!' },

  { id: 'p03', group: 'PRIMARY', topic: 'Addition',
    question: 'What is 125 + 75?',
    options: ['190','195','200','205'], correct: 2,
    vedic_sutra: 'Anurupyena', difficulty: 1,
    vedic_tip: '125 + 75 = 100 + (25 + 75) = 100 + 100 = 200. Group to make round numbers!' },

  // Subtraction
  { id: 'p04', group: 'PRIMARY', topic: 'Subtraction',
    question: 'What is 100 − 37?',
    options: ['53','63','73','67'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 1,
    vedic_tip: '"All from 9, last from 10": 9−3=6, 10−7=3 → 63. Works for any subtraction from 100!' },

  { id: 'p05', group: 'PRIMARY', topic: 'Subtraction',
    question: 'What is 1000 − 456?',
    options: ['444','544','554','644'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 1,
    vedic_tip: '"All from 9, last from 10": 9−4=5, 9−5=4, 10−6=4 → 544.' },

  // Multiplication
  { id: 'p06', group: 'PRIMARY', topic: 'Multiplication',
    question: 'What is 25 × 4?',
    options: ['90','95','100','105'], correct: 2,
    vedic_sutra: 'Anurupyena', difficulty: 1,
    vedic_tip: '25 × 4 = 25 × (2×2) = 50 × 2 = 100. Or: 100 ÷ 4 × 4 = 100!' },

  { id: 'p07', group: 'PRIMARY', topic: 'Multiplication',
    question: 'What is 15²?',
    options: ['125','215','225','235'], correct: 2,
    vedic_sutra: 'Ekadhikena Purvena', difficulty: 1,
    vedic_tip: 'For any number ending in 5: 1×2=2, append 25 → 225!' },

  { id: 'p08', group: 'PRIMARY', topic: 'Multiplication',
    question: 'What is 12 × 11?',
    options: ['122','132','142','152'], correct: 1,
    vedic_sutra: 'Urdhva-Tiryagbhyam', difficulty: 1,
    vedic_tip: 'Multiply by 11: write 1, middle 1+2=3, write 2 → 132!' },

  // Division
  { id: 'p09', group: 'PRIMARY', topic: 'Division',
    question: 'What is 84 ÷ 4?',
    options: ['19','21','22','23'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 1,
    vedic_tip: 'Halve twice: 84÷2=42, 42÷2=21. Dividing by 4 = halving twice!' },

  { id: 'p10', group: 'PRIMARY', topic: 'Division',
    question: 'What is 125 ÷ 5?',
    options: ['20','23','25','27'], correct: 2,
    vedic_sutra: 'Anurupyena', difficulty: 1,
    vedic_tip: 'Dividing by 5 = multiply by 2, then divide by 10: 125×2=250, ÷10=25!' },

  // Tables
  { id: 'p11', group: 'PRIMARY', topic: 'Tables',
    question: 'What is 7 × 8?',
    options: ['54','56','58','60'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 1,
    vedic_tip: 'Deficits from 10: 3 and 2. Cross: 7−2=5. Product: 3×2=6 → 56!' },

  { id: 'p12', group: 'PRIMARY', topic: 'Tables',
    question: 'What is 9 × 6?',
    options: ['52','54','56','58'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 1,
    vedic_tip: 'Deficits from 10: 1 and 4. Cross: 9−4=5. Product: 1×4=4 → 54!' },

  { id: 'p13', group: 'PRIMARY', topic: 'Tables',
    question: 'What is 8 × 9?',
    options: ['70','72','74','76'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 1,
    vedic_tip: 'Deficits: 2 and 1. Cross: 8−1=7. Product: 2×1=2 → 72!' },

  // ── MIDDLE ───────────────────────────────────────────────────────────────────

  // Fractions
  { id: 'm01', group: 'MIDDLE', topic: 'Fractions',
    question: 'What is 1/3 + 1/4?',
    options: ['2/7','5/12','7/12','3/7'], correct: 2,
    vedic_sutra: 'Anurupyena', difficulty: 2,
    vedic_tip: 'Cross multiply numerators: 1×4 + 3×1 = 7. Multiply denominators: 3×4 = 12 → 7/12.' },

  { id: 'm02', group: 'MIDDLE', topic: 'Fractions',
    question: 'What is 3/4 − 1/6?',
    options: ['5/12','7/12','1/2','2/3'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 2,
    vedic_tip: '3×6 − 4×1 = 14. Denominator: 4×6 = 24. → 14/24 = 7/12.' },

  { id: 'm03', group: 'MIDDLE', topic: 'Fractions',
    question: 'Simplify: 2/3 × 3/4',
    options: ['1/2','2/3','3/4','5/6'], correct: 0,
    vedic_sutra: 'Vilokanam', difficulty: 2,
    vedic_tip: 'Cancel common factors first: 2/3 × 3/4 = 2/4 = 1/2. Observe before computing!' },

  // Percentages
  { id: 'm04', group: 'MIDDLE', topic: 'Percentages',
    question: 'What is 15% of 200?',
    options: ['25','30','35','40'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 2,
    vedic_tip: '10% = 20. 5% = 10. 10+20 = 30. Always split percentages into 10% chunks!' },

  { id: 'm05', group: 'MIDDLE', topic: 'Percentages',
    question: 'A price rises from ₹80 to ₹100. What is the percentage increase?',
    options: ['20%','25%','30%','15%'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 2,
    vedic_tip: 'Increase = 20. Base = 80. 20/80 = 1/4 = 25%. Convert to fraction first, then %!' },

  // Squares & Cubes
  { id: 'm06', group: 'MIDDLE', topic: 'Squares & Cubes',
    question: 'What is 45²?',
    options: ['1925','2005','2025','2125'], correct: 2,
    vedic_sutra: 'Ekadhikena Purvena', difficulty: 2,
    vedic_tip: 'Ending in 5: 4×5=20, append 25 → 2025. Take digit before 5, multiply by next number!' },

  { id: 'm07', group: 'MIDDLE', topic: 'Squares & Cubes',
    question: 'What is 12³?',
    options: ['1528','1628','1728','1828'], correct: 2,
    vedic_sutra: 'Urdhva-Tiryagbhyam', difficulty: 2,
    vedic_tip: 'Pattern a³|3a²b|3ab²|b³: 1|6|12|8 → with carries → 1728.' },

  { id: 'm08', group: 'MIDDLE', topic: 'Squares & Cubes',
    question: 'What is √1764?',
    options: ['41','42','43','44'], correct: 1,
    vedic_sutra: 'Vilokanam', difficulty: 2,
    vedic_tip: 'Split: 17|64. First digit: 4 (4²=16≤17). Last digit 4 → root ends in 2 or 8. Test 42: 42²=1764 ✓' },

  // Basic Algebra
  { id: 'm09', group: 'MIDDLE', topic: 'Basic Algebra',
    question: 'If 2x + 3 = 11, what is x?',
    options: ['3','4','5','6'], correct: 1,
    vedic_sutra: 'Paravartya Yojayet', difficulty: 2,
    vedic_tip: 'Transpose: 2x = 11−3 = 8. x = 4. "Paravartya" means transpose and apply!' },

  { id: 'm10', group: 'MIDDLE', topic: 'Basic Algebra',
    question: 'What is the value of x if 5x = 75?',
    options: ['13','14','15','16'], correct: 2,
    vedic_sutra: 'Anurupyena', difficulty: 2,
    vedic_tip: 'x = 75÷5. Dividing by 5 = ×2 then ÷10: 75×2=150, ÷10=15!' },

  // HCF & LCM
  { id: 'm11', group: 'MIDDLE', topic: 'HCF & LCM',
    question: 'What is the LCM of 4 and 6?',
    options: ['8','10','12','24'], correct: 2,
    vedic_sutra: 'Vilokanam', difficulty: 2,
    vedic_tip: 'Observe: 4=2², 6=2×3. LCM = 2²×3 = 12. Always factor first!' },

  { id: 'm12', group: 'MIDDLE', topic: 'HCF & LCM',
    question: 'What is the HCF of 24 and 36?',
    options: ['6','8','10','12'], correct: 3,
    vedic_sutra: 'Vilokanam', difficulty: 2,
    vedic_tip: '24=2³×3, 36=2²×3². HCF = 2²×3 = 12. Take lowest powers of common factors.' },

  // ── SECONDARY ────────────────────────────────────────────────────────────────

  // Speed Maths
  { id: 's01', group: 'SECONDARY', topic: 'Speed Maths',
    question: 'What is 97 × 96?',
    options: ['9212','9312','9412','9512'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 3,
    vedic_tip: 'Deficits from 100: 3 and 4. Cross: 97−4=93. Product: 3×4=12 → 9312!' },

  { id: 's02', group: 'SECONDARY', topic: 'Speed Maths',
    question: 'What is 998 × 997?',
    options: ['994006','995006','996006','997006'], correct: 1,
    vedic_sutra: 'Nikhilam Navatashcaramam Dashatah', difficulty: 3,
    vedic_tip: 'Deficits from 1000: 2 and 3. Cross: 998−3=995. Product: 006 → 995006!' },

  { id: 's03', group: 'SECONDARY', topic: 'Speed Maths',
    question: 'What is 85²?',
    options: ['7025','7125','7225','7325'], correct: 2,
    vedic_sutra: 'Ekadhikena Purvena', difficulty: 3,
    vedic_tip: '8×9=72, append 25 → 7225. Squaring numbers ending in 5 is instant!' },

  // Number Systems
  { id: 's04', group: 'SECONDARY', topic: 'Number Systems',
    question: 'Which of the following is NOT a prime number?',
    options: ['97','91','89','83'], correct: 1,
    vedic_sutra: 'Vilokanam', difficulty: 3,
    vedic_tip: '91 = 7 × 13. Check divisibility by primes up to √91 ≈ 9.5 (i.e., 2, 3, 5, 7).' },

  { id: 's05', group: 'SECONDARY', topic: 'Number Systems',
    question: 'What is the digit sum of 9999999?',
    options: ['0','9','63','72'], correct: 0,
    vedic_sutra: 'Gunita Samuchyah', difficulty: 3,
    vedic_tip: '7 nines: 9×7=63 → 6+3=9 → by convention, treat as 0. When all digits are 9, digit sum = 0!' },

  // Profit & Loss
  { id: 's06', group: 'SECONDARY', topic: 'Profit & Loss',
    question: 'An item bought at ₹80 is sold at ₹100. Find the profit %.',
    options: ['20%','25%','30%','15%'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 3,
    vedic_tip: 'Profit = 20. CP = 80. Profit% = 20/80 × 100 = 25%. Use proportionality!' },

  { id: 's07', group: 'SECONDARY', topic: 'Profit & Loss',
    question: 'If SP = ₹660 and profit = 10%, what is the CP?',
    options: ['₹580','₹590','₹600','₹610'], correct: 2,
    vedic_sutra: 'Paravartya Yojayet', difficulty: 3,
    vedic_tip: 'CP = SP ÷ 1.1 = 660 ÷ 1.1 = 600. Transpose the relationship!' },

  // Time & Work
  { id: 's08', group: 'SECONDARY', topic: 'Time & Work',
    question: 'A and B can finish a job in 6 and 12 days. Together, in how many days?',
    options: ['3','4','5','6'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 3,
    vedic_tip: 'Combined rate = 1/6 + 1/12 = 3/12 = 1/4. Time = 4 days. Add the fractions!' },

  { id: 's09', group: 'SECONDARY', topic: 'Time & Work',
    question: 'Speed = 60 km/h, Distance = 150 km. Time = ?',
    options: ['2h','2.5h','3h','3.5h'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 3,
    vedic_tip: 'Time = D/S = 150/60 = 5/2 = 2.5h. Convert to fraction for speed!' },

  // Vedic Tricks
  { id: 's10', group: 'SECONDARY', topic: 'Vedic Tricks',
    question: 'What is 23 × 99?',
    options: ['2177','2277','2377','2477'], correct: 1,
    vedic_sutra: 'Nikhilam', difficulty: 3,
    vedic_tip: '23 × (100−1) = 2300 − 23 = 2277. Multiply by 100 then subtract!' },

  { id: 's11', group: 'SECONDARY', topic: 'Vedic Tricks',
    question: 'What is 47² (near 50)?',
    options: ['2109','2209','2309','2409'], correct: 1,
    vedic_sutra: 'Yavadunam', difficulty: 3,
    vedic_tip: 'd = 47−50 = −3. First: 25+(−3) = 22. Second: 3² = 09 → 2209!' },

  // ── INTERMEDIATE ─────────────────────────────────────────────────────────────

  // Vedic Algebra
  { id: 'i01', group: 'INTERMEDIATE', topic: 'Vedic Algebra',
    question: 'Solve: (x+2)(x+3) = 0. What are the roots?',
    options: ['x=2,3','x=−2,−3','x=2,−3','x=−2,3'], correct: 1,
    vedic_sutra: 'Vilokanam', difficulty: 4,
    vedic_tip: 'By observation: factors are (x+2) and (x+3). Each = 0 → x = −2 or −3.' },

  { id: 'i02', group: 'INTERMEDIATE', topic: 'Vedic Algebra',
    question: 'If x + 1/x = 3, what is x² + 1/x²?',
    options: ['5','7','9','11'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 4,
    vedic_tip: '(x + 1/x)² = x² + 2 + 1/x². So x² + 1/x² = 9 − 2 = 7!' },

  // Quadratic Equations
  { id: 'i03', group: 'INTERMEDIATE', topic: 'Quadratic Equations',
    question: 'Roots of x² − 5x + 6 = 0?',
    options: ['2 and 4','2 and 3','3 and 4','1 and 6'], correct: 1,
    vedic_sutra: 'Vilokanam', difficulty: 4,
    vedic_tip: 'Find two numbers: sum=5, product=6 → 2 and 3. Observe the pattern directly!' },

  { id: 'i04', group: 'INTERMEDIATE', topic: 'Quadratic Equations',
    question: 'Discriminant of x² − 4x + 4 = 0 is?',
    options: ['−4','0','4','8'], correct: 1,
    vedic_sutra: 'Vilokanam', difficulty: 4,
    vedic_tip: 'D = b²−4ac = 16−16 = 0. Equal roots! Observe: x² − 4x + 4 = (x−2)².' },

  // Number Theory
  { id: 'i05', group: 'INTERMEDIATE', topic: 'Number Theory',
    question: 'What is the sum of all digits of 9¹⁰?',
    options: ['9','18','27','36'], correct: 0,
    vedic_sutra: 'Gunita Samuchyah', difficulty: 4,
    vedic_tip: 'Digit sum of any power of 9 is always 9! (Since 9 ≡ 0 mod 9)' },

  { id: 'i06', group: 'INTERMEDIATE', topic: 'Number Theory',
    question: 'What is 2⁵ × 5⁵?',
    options: ['10000','100000','1000000','10'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 4,
    vedic_tip: '2⁵ × 5⁵ = (2×5)⁵ = 10⁵ = 100000. Combine bases with proportionality!' },

  // Sequences
  { id: 'i07', group: 'INTERMEDIATE', topic: 'Sequences',
    question: 'Find the next term: 2, 3, 5, 8, 13, __',
    options: ['18','20','21','22'], correct: 2,
    vedic_sutra: 'Vilokanam', difficulty: 4,
    vedic_tip: 'Fibonacci! Each term = sum of previous two: 8+13=21.' },

  { id: 'i08', group: 'INTERMEDIATE', topic: 'Sequences',
    question: 'Sum of first 10 natural numbers?',
    options: ['45','50','55','60'], correct: 2,
    vedic_sutra: 'Ekadhikena Purvena', difficulty: 4,
    vedic_tip: 'S = n(n+1)/2 = 10×11/2 = 55. Vedic shortcut: pair first and last: (1+10)×5=55!' },

  // Mental Calculus
  { id: 'i09', group: 'INTERMEDIATE', topic: 'Mental Calculus',
    question: 'What is d/dx(x²)?',
    options: ['x','2x','x²','2'], correct: 1,
    vedic_sutra: 'Urdhva-Tiryagbhyam', difficulty: 4,
    vedic_tip: 'Power rule: bring power down, reduce by 1. x² → 2x. Vedic maths sees this as a pattern!' },

  { id: 'i10', group: 'INTERMEDIATE', topic: 'Mental Calculus',
    question: 'Integral of 2x dx = ?',
    options: ['x²','x² + C','2x² + C','2 + C'], correct: 1,
    vedic_sutra: 'Anurupyena', difficulty: 4,
    vedic_tip: 'Reverse power rule: increase power by 1, divide by new power. 2x → x² + C.' },
];

export function getQuestions(group, topic = null) {
  let pool = QUESTIONS.filter(q => q.group === group);
  if (topic) pool = pool.filter(q => q.topic === topic);
  // Shuffle
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
}

export { QUESTIONS };