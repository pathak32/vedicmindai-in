// Reasoning & Aptitude — Level 1 (Foundations) Question Bank
// 10 chapters × 8 questions each = 80 questions total.
// Structure matches the app's existing question schema pattern:
// { chapter, prompt, options, answer, difficulty }
// Ready to be loaded into Supabase `questions` table once reviewed.

export const RA_LEVEL1_QUESTIONS = [
  // ---------------- Chapter 1: Odd One Out (Classification) ----------------
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Apple, Banana, Carrot, Mango?', options: ['Apple', 'Carrot', 'Mango'], answer: 'Carrot', difficulty: 'easy' , exp: 'Apple, Banana, and Mango are all fruits. Carrot is a vegetable — it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Dog, Cat, Cow, Table?', options: ['Cow', 'Table', 'Dog'], answer: 'Table', difficulty: 'easy' , exp: 'Dog, Cat, and Cow are all animals. Table is furniture — it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Circle, Square, Triangle, Red?', options: ['Red', 'Circle', 'Square'], answer: 'Red', difficulty: 'easy' , exp: 'Circle, Square, and Triangle are all shapes. Red is a colour — not a shape, so it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Pen, Pencil, Eraser, Apple?', options: ['Apple', 'Pen', 'Eraser'], answer: 'Apple', difficulty: 'easy' , exp: 'Pen, Pencil, and Eraser are all stationery items. Apple is a fruit — it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Rose, Lily, Lotus, Mango?', options: ['Mango', 'Rose', 'Lily'], answer: 'Mango', difficulty: 'easy' , exp: 'Rose, Lily, and Lotus are all flowers. Mango is a fruit — it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Delhi, Mumbai, India, Chennai?', options: ['India', 'Delhi', 'Chennai'], answer: 'India', difficulty: 'medium' , exp: 'Delhi, Mumbai, and Chennai are all cities. India is a country — it belongs to a different category.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Guitar, Violin, Flute, Football?', options: ['Football', 'Guitar', 'Violin'], answer: 'Football', difficulty: 'easy' , exp: 'Guitar, Violin, and Flute are all musical instruments. Football is a sport — it doesn\'t belong.' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: 2, 4, 7, 8?', options: ['7', '2', '4'], answer: '7', difficulty: 'medium' , exp: '2, 4, and 8 are all even numbers. 7 is an odd number — it doesn\'t belong.' },

  // ---------------- Chapter 2: Simple Number Series ----------------
  { chapter: 'number-series-basic', prompt: '2, 4, 6, 8, ?', options: ['9', '10', '12'], answer: '10', difficulty: 'easy' , exp: 'Each number increases by 2 (+2, +2...). The next is 8 + 2 = 10.' },
  { chapter: 'number-series-basic', prompt: '5, 10, 15, 20, ?', options: ['22', '25', '30'], answer: '25', difficulty: 'easy' , exp: 'Each number increases by 5 (+5, +5...). The next is 20 + 5 = 25.' },
  { chapter: 'number-series-basic', prompt: '1, 3, 5, 7, ?', options: ['8', '9', '10'], answer: '9', difficulty: 'easy' , exp: 'Odd numbers in order, each +2. The next is 7 + 2 = 9.' },
  { chapter: 'number-series-basic', prompt: '20, 18, 16, 14, ?', options: ['13', '12', '10'], answer: '12', difficulty: 'easy' , exp: 'Each number decreases by 2 (−2, −2...). The next is 14 − 2 = 12.' },
  { chapter: 'number-series-basic', prompt: '3, 6, 9, 12, ?', options: ['14', '15', '16'], answer: '15', difficulty: 'easy' , exp: 'Multiples of 3. The next is 12 + 3 = 15.' },
  { chapter: 'number-series-basic', prompt: '10, 20, 30, 40, ?', options: ['45', '50', '60'], answer: '50', difficulty: 'easy' , exp: 'Multiples of 10. The next is 40 + 10 = 50.' },
  { chapter: 'number-series-basic', prompt: '1, 2, 4, 8, ?', options: ['12', '16', '10'], answer: '16', difficulty: 'medium' , exp: 'Each number doubles (×2). The next is 8 × 2 = 16.' },
  { chapter: 'number-series-basic', prompt: '100, 90, 80, 70, ?', options: ['65', '60', '50'], answer: '60', difficulty: 'easy' , exp: 'Each number decreases by 10. The next is 70 − 10 = 60.' },

  // ---------------- Chapter 3: Basic Analogies ----------------
  { chapter: 'analogies-basic', prompt: 'Hand is to Glove as Foot is to ?', options: ['Shoe', 'Sock', 'Leg'], answer: 'Shoe', difficulty: 'easy' , exp: 'A Glove covers/protects the Hand. Similarly, a Shoe covers/protects the Foot.' },
  { chapter: 'analogies-basic', prompt: 'Bird is to Nest as Bee is to ?', options: ['Flower', 'Hive', 'Sky'], answer: 'Hive', difficulty: 'easy' , exp: 'A Nest is where a Bird lives. Similarly, a Hive is where a Bee lives.' },
  { chapter: 'analogies-basic', prompt: 'Sun is to Day as Moon is to ?', options: ['Night', 'Star', 'Sky'], answer: 'Night', difficulty: 'easy' , exp: 'The Sun lights the Day. Similarly, the Moon lights the Night.' },
  { chapter: 'analogies-basic', prompt: 'Doctor is to Hospital as Teacher is to ?', options: ['Book', 'School', 'Student'], answer: 'School', difficulty: 'easy' , exp: 'A Doctor works at a Hospital. Similarly, a Teacher works at a School.' },
  { chapter: 'analogies-basic', prompt: 'Fish is to Water as Bird is to ?', options: ['Sky', 'Nest', 'Tree'], answer: 'Sky', difficulty: 'easy' , exp: 'A Fish lives in Water. Similarly, a Bird lives in the Sky.' },
  { chapter: 'analogies-basic', prompt: 'Pen is to Write as Knife is to ?', options: ['Cut', 'Kitchen', 'Sharp'], answer: 'Cut', difficulty: 'easy' , exp: 'A Pen is used to Write. Similarly, a Knife is used to Cut.' },
  { chapter: 'analogies-basic', prompt: 'Cow is to Calf as Dog is to ?', options: ['Puppy', 'Kitten', 'Cub'], answer: 'Puppy', difficulty: 'medium' , exp: 'A Calf is the young of a Cow. Similarly, a Puppy is the young of a Dog.' },
  { chapter: 'analogies-basic', prompt: 'India is to Delhi as Japan is to ?', options: ['Tokyo', 'Beijing', 'Seoul'], answer: 'Tokyo', difficulty: 'medium' , exp: 'Delhi is the capital of India. Similarly, Tokyo is the capital of Japan.' },

  // ---------------- Chapter 4: Ranking & Ordering ----------------
  { chapter: 'ranking-ordering', prompt: 'Rahul is taller than Priya. Priya is taller than Aman. Who is the shortest?', options: ['Rahul', 'Priya', 'Aman'], answer: 'Aman', difficulty: 'easy' , exp: 'Chain: Rahul > Priya > Aman. Aman is at the bottom — the shortest.' },
  { chapter: 'ranking-ordering', prompt: 'In a race, Rani finished before Sam, and Sam finished before Tina. Who finished first?', options: ['Rani', 'Sam', 'Tina'], answer: 'Rani', difficulty: 'easy' , exp: 'Chain: Rani > Sam > Tina. Rani is at the top — she finished first.' },
  { chapter: 'ranking-ordering', prompt: 'A is older than B. C is older than A. Who is the oldest?', options: ['A', 'B', 'C'], answer: 'C', difficulty: 'easy' , exp: 'Chain: C > A > B. C is at the top — the oldest.' },
  { chapter: 'ranking-ordering', prompt: 'Meena scored more than Nisha. Nisha scored more than Om. Who scored the least?', options: ['Meena', 'Nisha', 'Om'], answer: 'Om', difficulty: 'easy' , exp: 'Chain: Meena > Nisha > Om. Om is at the bottom — the lowest score.' },
  { chapter: 'ranking-ordering', prompt: 'Of 5 friends, Raj is 2nd tallest. Who is taller than Raj?', options: ['Only 1 person', '2 people', '3 people'], answer: 'Only 1 person', difficulty: 'medium' , exp: '2nd tallest means exactly one person is taller than Raj — only 1 person.' },
  { chapter: 'ranking-ordering', prompt: 'Sita ranks 5th from the top in a class of 20. What is her rank from the bottom?', options: ['15th', '16th', '14th'], answer: '16th', difficulty: 'medium' , exp: 'Formula: Total − Rank from top + 1 = 20 − 5 + 1 = 16th from the bottom.' },
  { chapter: 'ranking-ordering', prompt: 'Vijay is shorter than Karan but taller than Deepak. Who is the tallest?', options: ['Vijay', 'Karan', 'Deepak'], answer: 'Karan', difficulty: 'easy' , exp: 'Chain: Karan > Vijay > Deepak. Karan is at the top — the tallest.' },
  { chapter: 'ranking-ordering', prompt: 'If Ashok is 3rd from the left in a row of 7, how many are to his right?', options: ['3', '4', '5'], answer: '4', difficulty: 'medium' , exp: 'People to his right = 7 − 3 = 4.' },

  // ---------------- Chapter 5: Direction Sense (Basic) ----------------
  { chapter: 'direction-basic', prompt: 'You walk 5m North, then turn right. Which direction are you facing now?', options: ['East', 'West', 'South'], answer: 'East', difficulty: 'easy' , exp: 'Turning right from North means you face East.' },
  { chapter: 'direction-basic', prompt: 'You walk 3m East, then turn left. Which direction are you facing now?', options: ['North', 'South', 'West'], answer: 'North', difficulty: 'easy' , exp: 'Turning left from East means you face North.' },
  { chapter: 'direction-basic', prompt: 'Facing North, if you turn 180°, which direction do you face?', options: ['South', 'East', 'West'], answer: 'South', difficulty: 'easy' , exp: 'A 180° turn from North brings you to face South — the exact opposite direction.' },
  { chapter: 'direction-basic', prompt: 'Facing South, if you turn right, which direction do you face?', options: ['West', 'East', 'North'], answer: 'West', difficulty: 'medium' , exp: 'Turning right from South means you face West (South → West in a clockwise turn).' },
  { chapter: 'direction-basic', prompt: 'Sunrise happens in which direction?', options: ['East', 'West', 'North'], answer: 'East', difficulty: 'easy' , exp: 'The sun always rises in the East — a fixed geographical fact.' },
  { chapter: 'direction-basic', prompt: 'You walk 4m North and 4m South. How far are you from the start?', options: ['0m', '4m', '8m'], answer: '0m', difficulty: 'medium' , exp: 'The two legs cancel out exactly — you are back at your starting point, 0m away.' },
  { chapter: 'direction-basic', prompt: 'Facing West, if you turn left, which direction do you face?', options: ['South', 'North', 'East'], answer: 'South', difficulty: 'medium' , exp: 'Turning left from West means you face South (West → South counter-clockwise).' },
  { chapter: 'direction-basic', prompt: 'If North is to your left, which direction are you facing?', options: ['East', 'West', 'South'], answer: 'East', difficulty: 'hard' , exp: 'If North is directly to your left, you must be facing East — the direction 90° clockwise from North.' },

  // ---------------- Chapter 6: Basic Coding-Decoding ----------------
  { chapter: 'coding-decoding-basic', prompt: 'If CAT is coded as DBU, how is DOG coded?', options: ['EPH', 'EPI', 'FPH'], answer: 'EPH', difficulty: 'medium' , exp: 'Each letter shifts forward by 1 (C→D, A→B, T→U). Apply the same +1 shift to DOG: D→E, O→P, G→H = EPH.' },
  { chapter: 'coding-decoding-basic', prompt: 'If A=1, B=2, C=3, what does C-A-T spell as numbers?', options: ['3-1-20', '3-1-19', '3-2-20'], answer: '3-1-20', difficulty: 'medium' , exp: 'Using standard alphabet positions: C=3, A=1, T=20.' },
  { chapter: 'coding-decoding-basic', prompt: 'If BALL is coded as CBMM, how is BELL coded?', options: ['CFMM', 'CFMN', 'CFLM'], answer: 'CFMM', difficulty: 'medium' , exp: 'Each letter shifts +1: B→C, A→B, L→M, L→M = CBMM. Apply to BELL: B→C, E→F, L→M, L→M = CFMM.' },
  { chapter: 'coding-decoding-basic', prompt: 'If SUN is coded as TVO, how is MOON coded?', options: ['NPPO', 'MPPO', 'NPOO'], answer: 'NPPO', difficulty: 'medium' , exp: 'Each letter shifts +1. Apply to MOON: M→N, O→P, O→P, N→O = NPPO.' },
  { chapter: 'coding-decoding-basic', prompt: 'Each letter shifts back by 1. If DOG becomes CNF, what does CAT become?', options: ['BZS', 'BZR', 'BYS'], answer: 'BZS', difficulty: 'hard' , exp: 'Each letter shifts back by 1 (−1). Apply to CAT: C→B, A→Z, T→S = BZS.' },
  { chapter: 'coding-decoding-basic', prompt: 'If 1=A, 2=B, 3=C... what word does 2-1-20 spell?', options: ['BAT', 'CAT', 'BAG'], answer: 'BAT', difficulty: 'medium' , exp: 'B=2, A=1, T=20 — the word is BAT.' },
  { chapter: 'coding-decoding-basic', prompt: 'If PEN is coded as QFO, how is BOOK coded?', options: ['CPPL', 'CPOL', 'CPPK'], answer: 'CPPL', difficulty: 'hard' , exp: 'Each letter shifts +1. Apply to BOOK: B→C, O→P, O→P, K→L = CPPL.' },
  { chapter: 'coding-decoding-basic', prompt: 'If RAIN is coded as SBJO, how is SNOW coded?', options: ['TOPX', 'TOPY', 'TPQX'], answer: 'TOPX', difficulty: 'hard' , exp: 'Each letter shifts +1. Apply to SNOW: S→T, N→O, O→P, W→X = TOPX.' },

  // ---------------- Chapter 7: Calendar Basics ----------------
  { chapter: 'calendar-basics', prompt: 'If today is Monday, what day will it be after 10 days?', options: ['Wednesday', 'Thursday', 'Friday'], answer: 'Thursday', difficulty: 'medium' , exp: '10 ÷ 7 leaves a remainder of 3. Three days after Monday: Tuesday, Wednesday, Thursday.' },
  { chapter: 'calendar-basics', prompt: 'How many days are there in a leap year?', options: ['365', '366', '364'], answer: '366', difficulty: 'easy' , exp: 'A leap year has one extra day (February 29), giving 365 + 1 = 366 days.' },
  { chapter: 'calendar-basics', prompt: 'If today is Friday, what day was it 3 days ago?', options: ['Tuesday', 'Wednesday', 'Monday'], answer: 'Tuesday', difficulty: 'easy' , exp: 'Three days before Friday: Thursday, Wednesday, Tuesday.' },
  { chapter: 'calendar-basics', prompt: 'How many months have exactly 30 days?', options: ['4', '5', '6'], answer: '4', difficulty: 'medium' , exp: 'April, June, September, and November each have exactly 30 days — that\'s 4 months.' },
  { chapter: 'calendar-basics', prompt: 'If January 1st is a Sunday, what day is January 8th?', options: ['Sunday', 'Monday', 'Saturday'], answer: 'Sunday', difficulty: 'medium' , exp: 'January 8th is exactly 7 days (1 week) after January 1st, so it falls on the same day — Sunday.' },
  { chapter: 'calendar-basics', prompt: 'How many days are in the month of February in a normal year?', options: ['28', '29', '30'], answer: '28', difficulty: 'easy' , exp: 'February has 28 days in a normal (non-leap) year.' },
  { chapter: 'calendar-basics', prompt: 'If today is Wednesday, what day will it be after 21 days?', options: ['Wednesday', 'Tuesday', 'Thursday'], answer: 'Wednesday', difficulty: 'medium' , exp: '21 ÷ 7 = exactly 3 weeks, with no remainder — so it is the same day of the week: Wednesday.' },
  { chapter: 'calendar-basics', prompt: 'Which day comes 2 days before Sunday?', options: ['Friday', 'Saturday', 'Thursday'], answer: 'Friday', difficulty: 'easy' , exp: 'Two days before Sunday: Saturday, then Friday. The answer is Friday.' },

  // ---------------- Chapter 8: Pattern Completion (Visual) ----------------
  // Note: these are described textually; actual implementation should use image/shape assets.
  { chapter: 'pattern-completion', prompt: 'A square, then a circle, then a square, then a circle. What comes next?', options: ['Square', 'Circle', 'Triangle'], answer: 'Square', difficulty: 'easy' , exp: 'The pattern alternates Square, Circle, Square, Circle... The next is Square.' },
  { chapter: 'pattern-completion', prompt: 'Red, Blue, Red, Blue, Red, ? — what color comes next?', options: ['Red', 'Blue', 'Green'], answer: 'Blue', difficulty: 'easy' , exp: 'The pattern alternates Red, Blue, Red, Blue... The next is Blue.' },
  { chapter: 'pattern-completion', prompt: 'A shape grows: 1 dot, 2 dots, 3 dots, 4 dots. How many dots come next?', options: ['5', '6', '4'], answer: '5', difficulty: 'easy' , exp: 'Each step adds one dot. The next is 5 dots.' },
  { chapter: 'pattern-completion', prompt: 'Triangle, Triangle, Square, Triangle, Triangle, Square, ? — what comes next?', options: ['Triangle', 'Square', 'Circle'], answer: 'Triangle', difficulty: 'medium' , exp: 'The pattern repeats in groups of 3 (Tri, Tri, Sq). The 7th item starts a new group — Triangle.' },
  { chapter: 'pattern-completion', prompt: 'A pattern rotates 90° each time. After 4 rotations, what happens?', options: ['Back to start', 'Upside down', 'Sideways'], answer: 'Back to start', difficulty: 'medium' , exp: '4 × 90° = 360°, a complete full rotation — the shape is back exactly where it started.' },
  { chapter: 'pattern-completion', prompt: 'Small circle, medium circle, large circle, ? — what comes next in the size pattern?', options: ['Small circle', 'Extra-large circle', 'Square'], answer: 'Extra-large circle', difficulty: 'easy' , exp: 'The circles grow in size one step at a time. The next is an extra-large circle.' },
  { chapter: 'pattern-completion', prompt: 'A line pattern: 1 line, 2 lines, 3 lines. How many lines in the 5th figure?', options: ['4', '5', '6'], answer: '5', difficulty: 'easy' , exp: 'Each figure adds one line. The 5th figure has 5 lines.' },
  { chapter: 'pattern-completion', prompt: 'Star, Star, Moon, Star, Star, Moon, Star, ? — what comes next?', options: ['Star', 'Moon', 'Sun'], answer: 'Star', difficulty: 'medium' , exp: 'The pattern repeats: Str, Str, Moon. After the 7th item (Star), the 8th continues the next group — Star.' },

  // ---------------- Chapter 9: Basic Blood Relations ----------------
  { chapter: 'blood-relations-basic', prompt: '"This is my father\'s son, but not me." Who is it?', options: ['Brother', 'Uncle', 'Cousin'], answer: 'Brother', difficulty: 'medium' , exp: 'Your father\'s son is either you or your brother. Since it isn\'t you, it must be your brother.' },
  { chapter: 'blood-relations-basic', prompt: 'My mother\'s mother is my ?', options: ['Grandmother', 'Aunt', 'Sister'], answer: 'Grandmother', difficulty: 'easy' , exp: 'Your mother\'s mother is your grandmother (on your mother\'s side).' },
  { chapter: 'blood-relations-basic', prompt: 'My father\'s brother is my ?', options: ['Uncle', 'Cousin', 'Nephew'], answer: 'Uncle', difficulty: 'easy' , exp: 'Your father\'s brother is your uncle (paternal uncle).' },
  { chapter: 'blood-relations-basic', prompt: 'My sister\'s daughter is my ?', options: ['Niece', 'Cousin', 'Aunt'], answer: 'Niece', difficulty: 'easy' , exp: 'Your sister\'s daughter is your niece.' },
  { chapter: 'blood-relations-basic', prompt: 'My mother\'s sister is my ?', options: ['Aunt', 'Cousin', 'Grandmother'], answer: 'Aunt', difficulty: 'easy' , exp: 'Your mother\'s sister is your aunt (maternal aunt).' },
  { chapter: 'blood-relations-basic', prompt: 'My father\'s wife is my ?', options: ['Mother', 'Aunt', 'Sister'], answer: 'Mother', difficulty: 'easy' , exp: 'Your father\'s wife is your mother.' },
  { chapter: 'blood-relations-basic', prompt: 'My son\'s wife is my ?', options: ['Daughter-in-law', 'Niece', 'Granddaughter'], answer: 'Daughter-in-law', difficulty: 'medium' , exp: 'Your son\'s wife is your daughter-in-law.' },
  { chapter: 'blood-relations-basic', prompt: 'A boy says: "She is the daughter of the only son of my grandfather." Who is she to the boy?', options: ['Sister', 'Daughter', 'Niece'], answer: 'Sister', difficulty: 'hard', exp: "The only son of the boy\'s grandfather is the boy\'s own father. The girl is the daughter of that son — which makes her the boy\'s sister." },

  // ---------------- Chapter 10: Mirror Images (Basic) ----------------
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the letter "b" looks like which letter?', options: ['d', 'p', 'q'], answer: 'd', difficulty: 'easy' , exp: 'A mirror flips left and right. The stroke in "b" is on the right — flipped, it moves to the left, which is exactly "d".' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, does "3:00" on a clock face appear reversed as which time position?', options: ['9:00 position', '3:00 position', '6:00 position'], answer: '9:00 position', difficulty: 'medium' , exp: 'A clock face is mirrored left-to-right. The 3:00 position (right side) moves to the left side, which is the 9:00 position.' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the word "MOM" appears as ?', options: ['MOM', 'WOW', 'MOW'], answer: 'MOM', difficulty: 'medium' , exp: 'M and O are both left-right symmetric letters, and MOM reads the same forwards and backwards — so it mirrors to itself: MOM.' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, your left hand appears as your ?', options: ['Right hand', 'Left hand', 'Both hands'], answer: 'Right hand', difficulty: 'easy' , exp: 'In a mirror, left and right are swapped — your left hand appears where your right hand would be.' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the number "2" would appear ?', options: ['Flipped/reversed', 'Exactly the same', 'Upside down'], answer: 'Flipped/reversed', difficulty: 'easy' , exp: 'The number 2 is not left-right symmetric, so it appears flipped/reversed in a mirror.' },
  { chapter: 'mirror-images-basic', prompt: 'Which letter looks the same in a mirror: A, B, or C?', options: ['A', 'B', 'C'], answer: 'A', difficulty: 'medium' , exp: 'A is vertically symmetric — its left and right halves are mirror images of each other. B and C are not symmetric in this way.' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the letter "E" would look like ?', options: ['A backward E (Ǝ)', 'Exactly the same E', 'The letter F'], answer: 'A backward E (Ǝ)', difficulty: 'easy' , exp: 'E has its three horizontal bars pointing right. In a mirror these point left — producing a backward E (Ǝ).' },
  { chapter: 'mirror-images-basic', prompt: 'Which of these words looks the same forward and in a mirror (approximately): TOOT, HELLO, WATER?', options: ['TOOT', 'HELLO', 'WATER'], answer: 'TOOT', difficulty: 'hard' , exp: 'For a word to look the same in a mirror, every letter must be individually symmetric AND the word must read the same forwards and backwards. T and O are both symmetric, and TOOT is a palindrome — so it mirrors to itself.' },
];

export function getQuestionsByChapter(chapterId) {
  const qs = RA_LEVEL1_QUESTIONS.filter((q) => q.chapter === chapterId);
  // Fisher-Yates shuffle — unbiased, unlike sort(() => Math.random() - 0.5)
  // which is a well-known anti-pattern that skews toward certain orderings.
  const arr = [...qs];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
