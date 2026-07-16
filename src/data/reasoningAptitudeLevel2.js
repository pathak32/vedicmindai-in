// Reasoning & Aptitude — Level 2 (Intermediate) Question Bank
// Same 10 topics as Level 1, stepped up to medium/hard difficulty.
// 10 chapters × 8 questions each = 80 questions total.
// Unlocked once the user passes ALL Level 1 chapters (≥ 60% each).

export const RA_LEVEL2_QUESTIONS = [

  // ── Chapter 1: Odd One Out (Level 2 — abstract/tricky categories) ──
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Newspaper, Television, Radio, Telephone?', options: ['Newspaper', 'Telephone', 'Radio'], answer: 'Telephone', difficulty: 'medium', exp: 'Newspaper, Television, and Radio are all mass media — they broadcast the same information to many people at once (one-to-many). A Telephone is two-way, point-to-point communication between individuals, not a broadcast medium — that\'s the difference.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Square, Rectangle, Rhombus, Circle?', options: ['Circle', 'Rhombus', 'Square'], answer: 'Circle', difficulty: 'medium', exp: 'Square, Rectangle, and Rhombus are all quadrilaterals — shapes with 4 straight sides. A Circle has no straight sides at all, so it doesn\'t belong to that group.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Mercury, Venus, Moon, Mars?', options: ['Moon', 'Venus', 'Mercury'], answer: 'Moon', difficulty: 'medium', exp: 'Mercury, Venus, and Mars are planets that orbit the Sun directly. The Moon is a natural satellite — it orbits Earth, not the Sun — so it belongs to a different category.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Poet, Author, Sculptor, Reader?', options: ['Reader', 'Poet', 'Sculptor'], answer: 'Reader', difficulty: 'medium', exp: 'A Poet, Author, and Sculptor all create something — a poem, a book, a sculpture. A Reader consumes what others created rather than creating something themselves, which makes it the odd one out.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: 8, 27, 64, 100?', options: ['100', '64', '27'], answer: '100', difficulty: 'hard', exp: '8, 27, and 64 are perfect cubes (2³, 3³, 4³). 100 is not a perfect cube — the closest cubes to it are 64 (4³) and 125 (5³) — so it breaks the pattern even though it\'s a perfect square (10²).' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Laugh, Cry, Run, Smile?', options: ['Run', 'Laugh', 'Cry'], answer: 'Run', difficulty: 'hard', exp: 'Laugh, Cry, and Smile are all ways of expressing an emotion through your face. Run is a physical action unrelated to expressing feelings — that\'s the distinction.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: Wool, Cotton, Silk, Nylon?', options: ['Nylon', 'Silk', 'Cotton'], answer: 'Nylon', difficulty: 'medium', exp: 'Wool, Cotton, and Silk are all natural fibers — wool from animals, cotton and silk from plants/insects. Nylon is a synthetic (man-made) fiber, produced chemically rather than grown.' },
  { chapter: 'odd-one-out-l2', prompt: 'Which does not belong: 2, 3, 5, 9?', options: ['9', '2', '5'], answer: '9', difficulty: 'hard', exp: '2, 3, and 5 are all prime numbers — divisible only by 1 and themselves. 9 is divisible by 3 as well (9 = 3×3), which makes it composite, not prime.' },

  // ── Chapter 2: Number Series (Level 2 — geometric, alternating, mixed) ──
  { chapter: 'number-series-l2', prompt: '3, 6, 12, 24, ?', options: ['36', '48', '30'], answer: '48', difficulty: 'medium' },
  { chapter: 'number-series-l2', prompt: '1, 4, 9, 16, ?', options: ['20', '25', '30'], answer: '25', difficulty: 'medium' },
  { chapter: 'number-series-l2', prompt: '2, 3, 5, 8, 13, ?', options: ['18', '21', '20'], answer: '21', difficulty: 'hard' },
  { chapter: 'number-series-l2', prompt: '81, 27, 9, 3, ?', options: ['2', '1', '0'], answer: '1', difficulty: 'medium' },
  { chapter: 'number-series-l2', prompt: '2, 6, 12, 20, 30, ?', options: ['40', '42', '36'], answer: '42', difficulty: 'hard' },
  { chapter: 'number-series-l2', prompt: '1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13'], answer: '13', difficulty: 'medium' },
  { chapter: 'number-series-l2', prompt: '5, 11, 23, 47, ?', options: ['94', '95', '96'], answer: '95', difficulty: 'hard' },
  { chapter: 'number-series-l2', prompt: '144, 121, 100, 81, ?', options: ['64', '72', '60'], answer: '64', difficulty: 'medium' },

  // ── Chapter 3: Analogies (Level 2 — abstract relationships) ──
  { chapter: 'analogies-l2', prompt: 'Author is to Novel as Composer is to ?', options: ['Symphony', 'Concert', 'Instrument'], answer: 'Symphony', difficulty: 'medium', exp: 'An Author writes a Novel — that\'s the finished creative work. A Composer writes a Symphony — also the finished work itself. A Concert is the event where it\'s performed, and an Instrument is just a tool, not the created work.' },
  { chapter: 'analogies-l2', prompt: 'Marathon is to Running as Regatta is to ?', options: ['Rowing', 'Swimming', 'Cycling'], answer: 'Rowing', difficulty: 'hard', exp: 'A Marathon is a race built around Running. A Regatta is a race built around boats — specifically Rowing (or sailing) — making it the matching sport.' },
  { chapter: 'analogies-l2', prompt: 'Paw is to Cat as Hoof is to ?', options: ['Horse', 'Dog', 'Cow'], answer: 'Horse', difficulty: 'medium', exp: 'Worth being honest here — Cow also has hooves, so this can feel ambiguous at first glance. The distinction: a Horse has a single, solid hoof, while a Cow has a cloven (split) hoof — and "Horse" is the standard, conventional pairing used in these analogy questions specifically because of that solid, single-hoof structure.' },
  { chapter: 'analogies-l2', prompt: 'Coward is to Bravery as Miser is to ?', options: ['Generosity', 'Money', 'Fear'], answer: 'Generosity', difficulty: 'hard', exp: 'A Coward lacks Bravery. A Miser lacks Generosity — someone who hoards money instead of sharing it. Money and Fear describe the person, not the missing quality.' },
  { chapter: 'analogies-l2', prompt: 'Earthquake is to Seismograph as Heart is to ?', options: ['ECG', 'Stethoscope', 'X-Ray'], answer: 'ECG', difficulty: 'hard', exp: 'A Seismograph doesn\'t just detect an earthquake, it records and graphs the activity over time. An ECG does the same for the heart — it records the heart\'s electrical activity as a graph. A Stethoscope only lets you listen, it doesn\'t produce a recorded measurement, which is why ECG is the closer match.' },
  { chapter: 'analogies-l2', prompt: 'Microscope is to Small as Telescope is to ?', options: ['Distant', 'Large', 'Dark'], answer: 'Distant', difficulty: 'medium', exp: 'A Microscope helps you see things that are too Small to see normally. A Telescope helps you see things that are too Distant to see normally — the pairing is about what kind of object each instrument reveals, not about making things bigger.' },
  { chapter: 'analogies-l2', prompt: 'Carpenter is to Wood as Mason is to ?', options: ['Bricks', 'Steel', 'Glass'], answer: 'Bricks', difficulty: 'medium', exp: 'A Carpenter\'s main material is Wood. A Mason\'s main material is Bricks (or stone) — that\'s their equivalent trade material.' },
  { chapter: 'analogies-l2', prompt: 'Hunger is to Food as Thirst is to ?', options: ['Water', 'Sleep', 'Rest'], answer: 'Water', difficulty: 'easy', exp: 'Hunger is satisfied by Food. Thirst is satisfied by Water — the same "need and its solution" relationship.' },

  // ── Chapter 4: Ranking & Ordering (Level 2 — multi-step, complex) ──
  { chapter: 'ranking-ordering-l2', prompt: 'A > B, C > A, D > C. Who is the greatest?', options: ['D', 'C', 'A'], answer: 'D', difficulty: 'medium' },
  { chapter: 'ranking-ordering-l2', prompt: 'In a class of 30, Riya ranks 8th from the top. What is her rank from the bottom?', options: ['22nd', '23rd', '24th'], answer: '23rd', difficulty: 'medium' },
  { chapter: 'ranking-ordering-l2', prompt: 'Five people sit in a row. Mohan is between Raj and Priya. Raj is at one end. Who is at the other end?', options: ['Cannot determine', 'Priya', 'Mohan'], answer: 'Cannot determine', difficulty: 'hard' },
  { chapter: 'ranking-ordering-l2', prompt: 'X is heavier than Y. Z is lighter than X but heavier than Y. Who is the lightest?', options: ['Y', 'Z', 'X'], answer: 'Y', difficulty: 'medium' },
  { chapter: 'ranking-ordering-l2', prompt: 'P is taller than Q. R is shorter than P but taller than Q. S is taller than P. How many people are shorter than S?', options: ['3', '2', '1'], answer: '3', difficulty: 'hard' },
  { chapter: 'ranking-ordering-l2', prompt: 'In a row of 40 students, if Arjun is 15th from the left, what is his position from the right?', options: ['25th', '26th', '27th'], answer: '26th', difficulty: 'medium' },
  { chapter: 'ranking-ordering-l2', prompt: 'A scores more than B. C scores more than D. D scores more than A. Who scores the least?', options: ['B', 'D', 'A'], answer: 'B', difficulty: 'hard' },
  { chapter: 'ranking-ordering-l2', prompt: 'Of 6 boxes stacked, Box 3 is directly above Box 4. Box 1 is at the top. Which box is at the bottom?', options: ['Cannot determine', 'Box 6', 'Box 4'], answer: 'Cannot determine', difficulty: 'hard' },

  // ── Chapter 5: Direction Sense (Level 2 — multi-turn, distance) ──
  { chapter: 'direction-l2', prompt: 'Arun walks 10m North, turns right and walks 5m, then turns right and walks 10m. How far is he from his starting point?', options: ['5m', '10m', '15m'], answer: '5m', difficulty: 'medium' },
  { chapter: 'direction-l2', prompt: 'Facing East, you turn left twice. Which direction do you face now?', options: ['West', 'South', 'North'], answer: 'West', difficulty: 'medium' },
  { chapter: 'direction-l2', prompt: 'Priya walks 4m West, 3m South. What is the straight-line distance from start?', options: ['5m', '7m', '6m'], answer: '5m', difficulty: 'hard' },
  { chapter: 'direction-l2', prompt: 'A man drives 20km North, then 20km East, then 20km South. Where is he relative to start?', options: ['20km East', '20km North', '20km West'], answer: '20km East', difficulty: 'medium' },
  { chapter: 'direction-l2', prompt: 'If at 6:00 AM you face the sunrise, and turn 90° clockwise, which direction do you face?', options: ['South', 'North', 'West'], answer: 'South', difficulty: 'medium' },
  { chapter: 'direction-l2', prompt: 'A walks 5m South, turns left and walks 4m, turns left and walks 5m. What direction does he face and how far is he from start?', options: ['Facing North, 4m from start', 'Facing South, 4m from start', 'Facing East, 5m from start'], answer: 'Facing North, 4m from start', difficulty: 'hard' },
  { chapter: 'direction-l2', prompt: 'You face South-West. After turning 135° clockwise, which direction do you face?', options: ['North', 'East', 'South'], answer: 'North', difficulty: 'hard' },
  { chapter: 'direction-l2', prompt: 'A house\'s main door faces East. The back of the house faces which direction?', options: ['West', 'North', 'South'], answer: 'West', difficulty: 'easy' },

  // ── Chapter 6: Coding-Decoding (Level 2 — number/position codes) ──
  { chapter: 'coding-decoding-l2', prompt: 'If FRIEND is coded as GSJFOE, how is ENEMY coded?', options: ['FOFNZ', 'FOFOZ', 'FNFNZ'], answer: 'FOFNZ', difficulty: 'medium' },
  { chapter: 'coding-decoding-l2', prompt: 'If 15 = P, 1 = A, 20 = T, what does "PAT" equal as a sum of numbers?', options: ['36', '35', '37'], answer: '36', difficulty: 'medium' },
  { chapter: 'coding-decoding-l2', prompt: 'If MANGO is coded as 13-1-14-7-15, how is APPLE coded?', options: ['1-16-16-12-5', '1-15-16-12-5', '1-16-15-12-5'], answer: '1-16-16-12-5', difficulty: 'hard' },
  { chapter: 'coding-decoding-l2', prompt: 'In a code, WATER = 23-1-20-5-18. What is the code for FIRE?', options: ['6-9-18-5', '6-8-18-5', '5-9-18-5'], answer: '6-9-18-5', difficulty: 'medium' },
  { chapter: 'coding-decoding-l2', prompt: 'If COME = BNLD (each letter shifted back by 1), how is GOLD coded?', options: ['FNKC', 'FNLC', 'FMKC'], answer: 'FNKC', difficulty: 'hard' },
  { chapter: 'coding-decoding-l2', prompt: 'If RED = 18-5-4 (A=1, B=2...), what is the sum for the word "CAB"?', options: ['6', '7', '5'], answer: '6', difficulty: 'medium' },
  { chapter: 'coding-decoding-l2', prompt: 'If STRONG is coded as TUTRPI (each letter +1, -1, +1, -1...), what does MAN become?', options: ['NBM', 'NBO', 'NCM'], answer: 'NBM', difficulty: 'hard' },
  { chapter: 'coding-decoding-l2', prompt: 'If in a language CLOCK = 34 (C=3, L=12, O=15, C=3, K=11; sum=44), what is the value of SUN? (S=19, U=21, N=14)', options: ['54', '52', '56'], answer: '54', difficulty: 'hard' },

  // ── Chapter 7: Calendar (Level 2 — date logic, day calculations) ──
  { chapter: 'calendar-l2', prompt: 'If 1st January 2023 was a Sunday, what day was 1st January 2024?', options: ['Monday', 'Tuesday', 'Sunday'], answer: 'Monday', difficulty: 'hard' },
  { chapter: 'calendar-l2', prompt: 'How many odd days are in a century (100 years)?', options: ['5', '3', '1'], answer: '5', difficulty: 'hard' },
  { chapter: 'calendar-l2', prompt: 'A meeting is scheduled every 3rd day of the month. In a 31-day month, how many meetings are held?', options: ['10', '11', '9'], answer: '10', difficulty: 'medium' },
  { chapter: 'calendar-l2', prompt: 'If today is Thursday and the exam is in 45 days, on which day is the exam?', options: ['Monday', 'Tuesday', 'Wednesday'], answer: 'Monday', difficulty: 'medium' },
  { chapter: 'calendar-l2', prompt: 'What is the day on 15th August 2025 if 1st January 2025 is a Wednesday?', options: ['Friday', 'Saturday', 'Sunday'], answer: 'Friday', difficulty: 'hard' },
  { chapter: 'calendar-l2', prompt: 'If a year starts on Friday and is a leap year, on what day does it end?', options: ['Saturday', 'Sunday', 'Monday'], answer: 'Saturday', difficulty: 'hard' },
  { chapter: 'calendar-l2', prompt: 'How many Sundays are in the month of October if October 1st is a Saturday?', options: ['4', '5', '3'], answer: '5', difficulty: 'medium' },
  { chapter: 'calendar-l2', prompt: 'In 2 years where neither is a leap year, how many total odd days are there?', options: ['2', '3', '1'], answer: '2', difficulty: 'medium' },

  // ── Chapter 8: Pattern Completion (Level 2 — complex, rule-based) ──
  { chapter: 'pattern-completion-l2', prompt: 'A pattern: +2, ×2, +2, ×2... Starting from 1: 1, 3, 6, 8, ?', options: ['16', '10', '12'], answer: '16', difficulty: 'hard' },
  { chapter: 'pattern-completion-l2', prompt: 'Each figure adds 2 new dots arranged in an L-shape: 1, 3, 6, 10, ? — what is next?', options: ['14', '15', '16'], answer: '15', difficulty: 'medium' },
  { chapter: 'pattern-completion-l2', prompt: 'A sequence of shapes rotates 45° clockwise each step. After 8 steps, the shape is in the position of step ?', options: ['1', '0', '8'], answer: '1', difficulty: 'hard' },
  { chapter: 'pattern-completion-l2', prompt: 'A grid: Row 1 = 1,2,3. Row 2 = 4,5,6. Row 3 = 7,8,?', options: ['9', '10', '8'], answer: '9', difficulty: 'easy' },
  { chapter: 'pattern-completion-l2', prompt: 'Pattern: ODD, EVEN, ODD, EVEN... The 7th term in the pattern (starting with ODD) is?', options: ['ODD', 'EVEN', 'Neither'], answer: 'ODD', difficulty: 'medium' },
  { chapter: 'pattern-completion-l2', prompt: 'A shape has 3 sides, then 4, then 5. Following the pattern, the 6th shape has how many sides?', options: ['8', '7', '9'], answer: '8', difficulty: 'medium' },
  { chapter: 'pattern-completion-l2', prompt: 'A tile pattern: ■□■□ / □■□■ / ■□■□ / ? — what is the 4th row?', options: ['□■□■', '■□■□', '□□■■'], answer: '□■□■', difficulty: 'medium' },
  { chapter: 'pattern-completion-l2', prompt: 'Numbers in a triangle: top=1, second row=1,1, third=1,2,1, fourth=1,3,3,1. What is the sum of the 5th row?', options: ['16', '8', '12'], answer: '16', difficulty: 'hard' },

  // ── Chapter 9: Blood Relations (Level 2 — multi-step chains) ──
  { chapter: 'blood-relations-l2', prompt: 'Pointing to a man, a woman says "His mother is the only daughter of my mother." How is the woman related to the man?', options: ['Mother', 'Aunt', 'Sister'], answer: 'Mother', difficulty: 'hard', exp: '"My mother\'s only daughter" is the woman herself — she is her own mother\'s only daughter. So "his mother" refers to the woman, meaning she is the man\'s mother.' },
  { chapter: 'blood-relations-l2', prompt: 'A + B means A is the father of B. A – B means A is the mother of B. If P + Q – R, how is P related to R?', options: ['Grandfather', 'Father', 'Uncle'], answer: 'Grandfather', difficulty: 'hard', exp: 'P + Q means P is Q\'s father. Q – R means Q is R\'s mother. So P is the father of R\'s mother — that makes P R\'s (maternal) grandfather.' },
  { chapter: 'blood-relations-l2', prompt: 'If Ravi\'s father is Suresh\'s son, how is Suresh related to Ravi?', options: ['Grandfather', 'Uncle', 'Father'], answer: 'Grandfather', difficulty: 'medium', exp: 'Suresh\'s son is Ravi\'s father. So Suresh is the father of Ravi\'s father — that makes Suresh Ravi\'s (paternal) grandfather.' },
  { chapter: 'blood-relations-l2', prompt: 'Anita says "That girl is the wife of the grandson of my mother." Who is Anita to the girl?', options: ['Mother-in-law', 'Aunt', 'Grandmother-in-law'], answer: 'Mother-in-law', difficulty: 'hard', exp: 'Read this as: "my mother\'s grandson" is Anita\'s own son (the most direct family reading here). The girl is his wife — so from the girl\'s side, Anita is her husband\'s mother, making Anita her mother-in-law.' },
  { chapter: 'blood-relations-l2', prompt: 'Neha is the only child of Mr. and Mrs. Sharma. Neha\'s son refers to Mr. Sharma as ?', options: ['Maternal grandfather', 'Paternal grandfather', 'Uncle'], answer: 'Maternal grandfather', difficulty: 'medium', exp: 'Neha is Mr. Sharma\'s daughter. Her son\'s grandfather through his mother\'s (Neha\'s) side is his maternal grandfather — that\'s Mr. Sharma.' },
  { chapter: 'blood-relations-l2', prompt: 'Introducing a man, a woman says "He is the brother of my uncle\'s only daughter." How is the man related to the woman?', options: ['Cousin', 'Brother', 'Uncle'], answer: 'Cousin', difficulty: 'hard', exp: '"My uncle\'s only daughter" is the woman\'s cousin. The man is that cousin\'s brother — meaning he\'s also the uncle\'s child, which makes him the woman\'s cousin too.' },
  { chapter: 'blood-relations-l2', prompt: 'A man says "This boy\'s mother is my only sister." How is the man related to the boy?', options: ['Father', 'Uncle', 'Brother'], answer: 'Uncle', difficulty: 'hard', exp: 'The boy\'s mother is the man\'s sister. That makes the man her brother, and his sister\'s son — the boy — is his (maternal) nephew, which makes the man the boy\'s uncle.' },
  { chapter: 'blood-relations-l2', prompt: 'My mother\'s brother\'s son is my ?', options: ['Cousin', 'Nephew', 'Brother'], answer: 'Cousin', difficulty: 'medium', exp: 'Your mother\'s brother is your maternal uncle. His son is your cousin — children of siblings are cousins to each other.' },

  // ── Chapter 10: Mirror Images (Level 2 — clock faces, complex shapes) ──
  { chapter: 'mirror-images-l2', prompt: 'If a clock shows 3:40, what time does its mirror image show?', options: ['8:20', '8:40', '3:20'], answer: '8:20', difficulty: 'hard' },
  { chapter: 'mirror-images-l2', prompt: 'Which of these letter sequences looks the same in a mirror: AHA, BOB, MOM?', options: ['AHA', 'BOB', 'MOM'], answer: 'AHA', difficulty: 'hard' },
  { chapter: 'mirror-images-l2', prompt: 'The mirror image of the number "1001" is ?', options: ['1001', '1000', '0011'], answer: '1001', difficulty: 'medium' },
  { chapter: 'mirror-images-l2', prompt: 'A square rotated 45° looks like a diamond. What does its mirror image look like?', options: ['A diamond', 'A square', 'A circle'], answer: 'A diamond', difficulty: 'medium' },
  { chapter: 'mirror-images-l2', prompt: 'If a clock shows 9:15, its mirror image shows?', options: ['2:45', '3:45', '2:15'], answer: '2:45', difficulty: 'hard' },
  { chapter: 'mirror-images-l2', prompt: 'Which number looks the same in a mirror: 0, 1, 2?', options: ['0', '1', '2'], answer: '0', difficulty: 'medium' },
  { chapter: 'mirror-images-l2', prompt: 'In a mirror placed on the right side, the letter "d" appears as ?', options: ['b', 'p', 'q'], answer: 'b', difficulty: 'hard' },
  { chapter: 'mirror-images-l2', prompt: 'If a clock shows 6:30, what time does its mirror image show?', options: ['5:30', '6:30', '5:00'], answer: '5:30', difficulty: 'hard' },
];

export function getLevel2QuestionsByChapter(chapterId) {
  return RA_LEVEL2_QUESTIONS.filter((q) => q.chapter === chapterId);
}
