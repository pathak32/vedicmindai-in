// Chapter descriptions and worked examples for the Aptitude Zone topic selector.
// Each entry: description (2-3 lines), example question + solution, emoji, questionCount estimate.

export const TOPIC_INFO = {

  // ── PRIMARY ──────────────────────────────────────────────────────────────
  'Addition': {
    emoji: '➕',
    description: 'Master fast addition using Vedic rounding and grouping tricks. Learn to add any two numbers mentally in seconds without carrying digits the traditional way.',
    example: {
      q: 'What is 48 + 37?',
      steps: 'Round 48 → 50. Add 37: 50 + 37 = 87. Adjust: 87 − 2 = 85.',
      answer: '85',
    },
    tags: ['Class 1–5', 'Ekadhikena Purvena'],
  },
  'Subtraction': {
    emoji: '➖',
    description: 'Use the Nikhilam sutra ("All from 9, last from 10") to subtract from round numbers like 100, 1000 instantly — no borrowing needed.',
    example: {
      q: 'What is 1000 − 456?',
      steps: 'All from 9: 9−4=5, 9−5=4. Last from 10: 10−6=4. Answer: 544.',
      answer: '544',
    },
    tags: ['Class 1–5', 'Nikhilam'],
  },
  'Multiplication': {
    emoji: '✖️',
    description: 'Multiply numbers ending in 5, multiply by 11, and use the Urdhva-Tiryak cross-multiplication method for any 2-digit × 2-digit problem.',
    example: {
      q: 'What is 15²?',
      steps: 'For any number ending in 5: multiply first digit by next number (1×2=2), append 25. Answer: 225.',
      answer: '225',
    },
    tags: ['Class 1–5', 'Urdhva-Tiryagbhyam'],
  },
  'Division': {
    emoji: '➗',
    description: 'Learn Vedic division shortcuts — divide by 9, by near-10 numbers, and spot divisibility rules instantly without long division.',
    example: {
      q: 'What is 108 ÷ 9?',
      steps: 'Sum of digits of 108 = 1+0+8 = 9. Divisible by 9. 108 ÷ 9 = 12.',
      answer: '12',
    },
    tags: ['Class 1–5', 'Paravartya'],
  },
  'Tables': {
    emoji: '📋',
    description: 'Go beyond rote learning — understand the pattern behind multiplication tables and extend them mentally to 20×20 and beyond.',
    example: {
      q: 'What is 17 × 8?',
      steps: '17 × 8 = 17 × (10 − 2) = 170 − 34 = 136. Vedic split method.',
      answer: '136',
    },
    tags: ['Class 1–5', 'Anurupyena'],
  },

  // ── MIDDLE ────────────────────────────────────────────────────────────────
  'Fractions': {
    emoji: '½',
    description: 'Add, subtract and compare fractions without finding LCM — use cross-multiplication and Vedic proportionality tricks for instant results.',
    example: {
      q: 'Which is greater: 3/7 or 4/9?',
      steps: 'Cross-multiply: 3×9=27, 4×7=28. Since 28>27, so 4/9 > 3/7.',
      answer: '4/9',
    },
    tags: ['Class 6–8', 'Anurupyena'],
  },
  'Percentages': {
    emoji: '%',
    description: 'Calculate percentages of any number mentally — use the "swap trick" (x% of y = y% of x) and base-100 anchoring for fast competitive exam answers.',
    example: {
      q: 'What is 8% of 125?',
      steps: 'Swap: 8% of 125 = 125% of 8 = 8 + half of 8 = 8 + 4 = 10. Answer: 10.',
      answer: '10',
    },
    tags: ['Class 6–8', 'Speed Maths'],
  },
  'Squares & Cubes': {
    emoji: '²³',
    description: 'Square any 2-digit number in under 3 seconds using the Duplex method. Find cube roots of perfect cubes instantly by pattern recognition.',
    example: {
      q: 'What is 47²?',
      steps: '47² = (47+3)(47−3) + 3² = 50×44 + 9 = 2200 + 9 = 2209.',
      answer: '2209',
    },
    tags: ['Class 6–8', 'Urdhva-Tiryagbhyam'],
  },
  'Basic Algebra': {
    emoji: '𝑥',
    description: 'Solve linear equations and simple algebraic expressions using Vedic "Paravartya" (transpose and apply) — no trial and error needed.',
    example: {
      q: 'Solve: 3x + 7 = 22',
      steps: 'Transpose: 3x = 22 − 7 = 15. Divide: x = 15 ÷ 3 = 5.',
      answer: 'x = 5',
    },
    tags: ['Class 6–8', 'Paravartya Yojayet'],
  },
  'HCF & LCM': {
    emoji: '🔗',
    description: 'Find HCF and LCM of numbers in one step using Vedic factorisation — useful for fractions, ratio problems, and competitive exam shortcuts.',
    example: {
      q: 'Find HCF of 36 and 48.',
      steps: '36 = 12×3, 48 = 12×4. Since 3 and 4 share no factor, 12 cannot be increased. HCF = 12.',
      answer: '12',
    },
    tags: ['Class 6–8', 'Anurupyena'],
  },

  // ── SECONDARY ─────────────────────────────────────────────────────────────
  'Speed Maths': {
    emoji: '⚡',
    description: 'The ultimate competitive exam skill — combine multiple Vedic sutras to solve complex arithmetic problems under 10 seconds. Used in SSC, banking, and JEE.',
    example: {
      q: 'What is 998 × 997?',
      steps: 'Both near 1000. Deficits: 2, 3. Cross-subtract: 998−3 = 995. Multiply deficits: 2×3=6. Answer: 995006.',
      answer: '995006',
    },
    tags: ['Class 9–10', 'Nikhilam', 'SSC/JEE'],
  },
  'Number Systems': {
    emoji: '🔢',
    description: 'Master divisibility rules, properties of prime numbers, and number classification — the foundation of all competitive exam quantitative sections.',
    example: {
      q: 'Is 4567 divisible by 7?',
      steps: 'Double last digit: 7×2=14. Subtract: 456−14=442. Repeat: 2×2=4, 44−4=40. 40 not divisible by 7. So No.',
      answer: 'No',
    },
    tags: ['Class 9–10', 'JEE/NEET'],
  },
  'Profit & Loss': {
    emoji: '📈',
    description: 'Calculate profit%, loss%, selling price, and cost price instantly using the multiplier method — no formula memorisation needed.',
    example: {
      q: 'Bought for ₹400, sold for ₹500. Profit%?',
      steps: 'Profit = 500−400 = ₹100. Profit% = (100/400)×100 = 25%.',
      answer: '25%',
    },
    tags: ['Class 9–10', 'SSC/Banking'],
  },
  'Time & Work': {
    emoji: '⏱️',
    description: 'Solve Time & Work, Pipes & Cisterns, and Speed-Distance problems using the LCM method — the fastest approach for competitive exams.',
    example: {
      q: 'A does a job in 10 days, B in 15 days. Together?',
      steps: 'LCM of 10,15 = 30. A does 3 units/day, B does 2 units/day. Together: 5 units/day. Days = 30÷5 = 6.',
      answer: '6 days',
    },
    tags: ['Class 9–10', 'SSC/Banking'],
  },
  'Vedic Tricks': {
    emoji: '🪄',
    description: 'A curated set of the most impressive Vedic Maths tricks — squaring numbers near 100, multiplying numbers with same first digit, and the "magic" 11× rule.',
    example: {
      q: 'What is 104 × 106?',
      steps: 'Both near 100. Surpluses: 4, 6. Cross-add: 104+6=110. Multiply surpluses: 4×6=24. Answer: 11024.',
      answer: '11024',
    },
    tags: ['Class 9–10', 'Nikhilam'],
  },

  // ── INTERMEDIATE ──────────────────────────────────────────────────────────
  'Vedic Algebra': {
    emoji: '🔣',
    description: 'Solve simultaneous equations, quadratic expressions, and polynomial identities using Vedic algebraic methods — faster than substitution.',
    example: {
      q: 'Solve simultaneously: x+y=7, x−y=3',
      steps: 'Add: 2x=10, x=5. Subtract: 2y=4, y=2. Verify: 5+2=7 ✓, 5−2=3 ✓.',
      answer: 'x=5, y=2',
    },
    tags: ['Class 11–12', 'JEE'],
  },
  'Quadratic Equations': {
    emoji: 'x²',
    description: 'Factorise and solve quadratic equations without the quadratic formula — use Vedic splitting of the middle term and product-sum method.',
    example: {
      q: 'Solve: x² + 5x + 6 = 0',
      steps: 'Find two numbers: product=6, sum=5 → 2 and 3. So (x+2)(x+3)=0. x=−2 or x=−3.',
      answer: 'x = −2 or −3',
    },
    tags: ['Class 11–12', 'JEE/NEET'],
  },
  'Number Theory': {
    emoji: '🔍',
    description: 'Explore advanced properties of numbers — remainders, modular arithmetic, Fermat\'s little theorem applications, and digit-sum verification in complex calculations.',
    example: {
      q: 'What is the remainder when 7²⁰ is divided by 5?',
      steps: '7≡2 (mod 5). 7²=49≡4≡−1. 7²⁰=(7²)¹⁰≡(−1)¹⁰=1 (mod 5). Remainder = 1.',
      answer: '1',
    },
    tags: ['Class 11–12', 'JEE'],
  },
  'Sequences': {
    emoji: '🔄',
    description: 'Find nth terms of AP, GP, and special sequences. Use Vedic pattern-spotting to solve sequence problems in competitive exams instantly.',
    example: {
      q: 'Find the 10th term of 2, 5, 8, 11...',
      steps: 'AP with a=2, d=3. nth term = a+(n−1)d = 2+(10−1)×3 = 2+27 = 29.',
      answer: '29',
    },
    tags: ['Class 11–12', 'JEE/NEET'],
  },
  'Mental Calculus': {
    emoji: '∫',
    description: 'Apply Vedic methods to approximate derivatives, integrals, and limits — powerful for checking JEE answers mentally and verifying calculus results.',
    example: {
      q: 'Approximate d/dx(x³) at x=4 without formula.',
      steps: 'At x=4: x³=64. At x=4.001: ≈64.048. Rate = 0.048/0.001 ≈ 48. Exact: 3×4²=48 ✓.',
      answer: '48',
    },
    tags: ['Class 11–12', 'JEE Advanced'],
  },
};

// Returns info for a topic, with safe fallback
export function getTopicInfo(topic) {
  return TOPIC_INFO[topic] || {
    emoji: '📚',
    description: 'Practise questions on this topic to build speed and accuracy for competitive exams.',
    example: null,
    tags: [],
  };
}
