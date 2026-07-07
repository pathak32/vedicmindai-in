// Reasoning & Aptitude — Level 1 (Foundations) Question Bank
// 10 chapters × 8 questions each = 80 questions total.
// Structure matches the app's existing question schema pattern:
// { chapter, prompt, options, answer, difficulty }
// Ready to be loaded into Supabase `questions` table once reviewed.

export const RA_LEVEL1_QUESTIONS = [
  // ---------------- Chapter 1: Odd One Out (Classification) ----------------
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Apple, Banana, Carrot, Mango?', options: ['Apple', 'Carrot', 'Mango'], answer: 'Carrot', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Dog, Cat, Cow, Table?', options: ['Cow', 'Table', 'Dog'], answer: 'Table', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Circle, Square, Triangle, Red?', options: ['Red', 'Circle', 'Square'], answer: 'Red', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Pen, Pencil, Eraser, Apple?', options: ['Apple', 'Pen', 'Eraser'], answer: 'Apple', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Rose, Lily, Lotus, Mango?', options: ['Mango', 'Rose', 'Lily'], answer: 'Mango', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Delhi, Mumbai, India, Chennai?', options: ['India', 'Delhi', 'Chennai'], answer: 'India', difficulty: 'medium' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: Guitar, Violin, Flute, Football?', options: ['Football', 'Guitar', 'Violin'], answer: 'Football', difficulty: 'easy' },
  { chapter: 'odd-one-out', prompt: 'Which one does not belong: 2, 4, 7, 8?', options: ['7', '2', '4'], answer: '7', difficulty: 'medium' },

  // ---------------- Chapter 2: Simple Number Series ----------------
  { chapter: 'number-series-basic', prompt: '2, 4, 6, 8, ?', options: ['9', '10', '12'], answer: '10', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '5, 10, 15, 20, ?', options: ['22', '25', '30'], answer: '25', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '1, 3, 5, 7, ?', options: ['8', '9', '10'], answer: '9', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '20, 18, 16, 14, ?', options: ['13', '12', '10'], answer: '12', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '3, 6, 9, 12, ?', options: ['14', '15', '16'], answer: '15', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '10, 20, 30, 40, ?', options: ['45', '50', '60'], answer: '50', difficulty: 'easy' },
  { chapter: 'number-series-basic', prompt: '1, 2, 4, 8, ?', options: ['12', '16', '10'], answer: '16', difficulty: 'medium' },
  { chapter: 'number-series-basic', prompt: '100, 90, 80, 70, ?', options: ['65', '60', '50'], answer: '60', difficulty: 'easy' },

  // ---------------- Chapter 3: Basic Analogies ----------------
  { chapter: 'analogies-basic', prompt: 'Hand is to Glove as Foot is to ?', options: ['Shoe', 'Sock', 'Leg'], answer: 'Shoe', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Bird is to Nest as Bee is to ?', options: ['Flower', 'Hive', 'Sky'], answer: 'Hive', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Sun is to Day as Moon is to ?', options: ['Night', 'Star', 'Sky'], answer: 'Night', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Doctor is to Hospital as Teacher is to ?', options: ['Book', 'School', 'Student'], answer: 'School', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Fish is to Water as Bird is to ?', options: ['Sky', 'Nest', 'Tree'], answer: 'Sky', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Pen is to Write as Knife is to ?', options: ['Cut', 'Kitchen', 'Sharp'], answer: 'Cut', difficulty: 'easy' },
  { chapter: 'analogies-basic', prompt: 'Cow is to Calf as Dog is to ?', options: ['Puppy', 'Kitten', 'Cub'], answer: 'Puppy', difficulty: 'medium' },
  { chapter: 'analogies-basic', prompt: 'India is to Delhi as Japan is to ?', options: ['Tokyo', 'Beijing', 'Seoul'], answer: 'Tokyo', difficulty: 'medium' },

  // ---------------- Chapter 4: Ranking & Ordering ----------------
  { chapter: 'ranking-ordering', prompt: 'Rahul is taller than Priya. Priya is taller than Aman. Who is the shortest?', options: ['Rahul', 'Priya', 'Aman'], answer: 'Aman', difficulty: 'easy' },
  { chapter: 'ranking-ordering', prompt: 'In a race, Rani finished before Sam, and Sam finished before Tina. Who finished first?', options: ['Rani', 'Sam', 'Tina'], answer: 'Rani', difficulty: 'easy' },
  { chapter: 'ranking-ordering', prompt: 'A is older than B. C is older than A. Who is the oldest?', options: ['A', 'B', 'C'], answer: 'C', difficulty: 'easy' },
  { chapter: 'ranking-ordering', prompt: 'Meena scored more than Nisha. Nisha scored more than Om. Who scored the least?', options: ['Meena', 'Nisha', 'Om'], answer: 'Om', difficulty: 'easy' },
  { chapter: 'ranking-ordering', prompt: 'Of 5 friends, Raj is 2nd tallest. Who is taller than Raj?', options: ['Only 1 person', '2 people', '3 people'], answer: 'Only 1 person', difficulty: 'medium' },
  { chapter: 'ranking-ordering', prompt: 'Sita ranks 5th from the top in a class of 20. What is her rank from the bottom?', options: ['15th', '16th', '14th'], answer: '16th', difficulty: 'medium' },
  { chapter: 'ranking-ordering', prompt: 'Vijay is shorter than Karan but taller than Deepak. Who is the tallest?', options: ['Vijay', 'Karan', 'Deepak'], answer: 'Karan', difficulty: 'easy' },
  { chapter: 'ranking-ordering', prompt: 'If Ashok is 3rd from the left in a row of 7, how many are to his right?', options: ['3', '4', '5'], answer: '4', difficulty: 'medium' },

  // ---------------- Chapter 5: Direction Sense (Basic) ----------------
  { chapter: 'direction-basic', prompt: 'You walk 5m North, then turn right. Which direction are you facing now?', options: ['East', 'West', 'South'], answer: 'East', difficulty: 'easy' },
  { chapter: 'direction-basic', prompt: 'You walk 3m East, then turn left. Which direction are you facing now?', options: ['North', 'South', 'West'], answer: 'North', difficulty: 'easy' },
  { chapter: 'direction-basic', prompt: 'Facing North, if you turn 180°, which direction do you face?', options: ['South', 'East', 'West'], answer: 'South', difficulty: 'easy' },
  { chapter: 'direction-basic', prompt: 'Facing South, if you turn right, which direction do you face?', options: ['West', 'East', 'North'], answer: 'West', difficulty: 'medium' },
  { chapter: 'direction-basic', prompt: 'Sunrise happens in which direction?', options: ['East', 'West', 'North'], answer: 'East', difficulty: 'easy' },
  { chapter: 'direction-basic', prompt: 'You walk 4m North and 4m South. How far are you from the start?', options: ['0m', '4m', '8m'], answer: '0m', difficulty: 'medium' },
  { chapter: 'direction-basic', prompt: 'Facing West, if you turn left, which direction do you face?', options: ['South', 'North', 'East'], answer: 'South', difficulty: 'medium' },
  { chapter: 'direction-basic', prompt: 'If North is to your left, which direction are you facing?', options: ['East', 'West', 'South'], answer: 'East', difficulty: 'hard' },

  // ---------------- Chapter 6: Basic Coding-Decoding ----------------
  { chapter: 'coding-decoding-basic', prompt: 'If CAT is coded as DBU, how is DOG coded?', options: ['EPH', 'EPI', 'FPH'], answer: 'EPH', difficulty: 'medium' },
  { chapter: 'coding-decoding-basic', prompt: 'If A=1, B=2, C=3, what does C-A-T spell as numbers?', options: ['3-1-20', '3-1-19', '3-2-20'], answer: '3-1-20', difficulty: 'medium' },
  { chapter: 'coding-decoding-basic', prompt: 'If BALL is coded as CBMM, how is BELL coded?', options: ['CFMM', 'CFMN', 'CFLM'], answer: 'CFMM', difficulty: 'medium' },
  { chapter: 'coding-decoding-basic', prompt: 'If SUN is coded as TVO, how is MOON coded?', options: ['NPPO', 'NPPO', 'NPOO'], answer: 'NPPO', difficulty: 'medium' },
  { chapter: 'coding-decoding-basic', prompt: 'Each letter shifts back by 1. If DOG becomes CNF, what does CAT become?', options: ['BZS', 'BZR', 'BYS'], answer: 'BZS', difficulty: 'hard' },
  { chapter: 'coding-decoding-basic', prompt: 'If 1=A, 2=B, 3=C... what word does 2-1-20 spell?', options: ['BAT', 'CAT', 'BAG'], answer: 'BAT', difficulty: 'medium' },
  { chapter: 'coding-decoding-basic', prompt: 'If PEN is coded as QFO, how is BOOK coded?', options: ['CPPL', 'CPOL', 'CPPK'], answer: 'CPPL', difficulty: 'hard' },
  { chapter: 'coding-decoding-basic', prompt: 'If RAIN is coded as SBJO, how is SNOW coded?', options: ['TOPX', 'TOPY', 'TPQX'], answer: 'TOPX', difficulty: 'hard' },

  // ---------------- Chapter 7: Calendar Basics ----------------
  { chapter: 'calendar-basics', prompt: 'If today is Monday, what day will it be after 10 days?', options: ['Wednesday', 'Thursday', 'Friday'], answer: 'Thursday', difficulty: 'medium' },
  { chapter: 'calendar-basics', prompt: 'How many days are there in a leap year?', options: ['365', '366', '364'], answer: '366', difficulty: 'easy' },
  { chapter: 'calendar-basics', prompt: 'If today is Friday, what day was it 3 days ago?', options: ['Tuesday', 'Wednesday', 'Monday'], answer: 'Tuesday', difficulty: 'easy' },
  { chapter: 'calendar-basics', prompt: 'How many months have exactly 30 days?', options: ['4', '5', '6'], answer: '4', difficulty: 'medium' },
  { chapter: 'calendar-basics', prompt: 'If January 1st is a Sunday, what day is January 8th?', options: ['Sunday', 'Monday', 'Saturday'], answer: 'Sunday', difficulty: 'medium' },
  { chapter: 'calendar-basics', prompt: 'How many days are in the month of February in a normal year?', options: ['28', '29', '30'], answer: '28', difficulty: 'easy' },
  { chapter: 'calendar-basics', prompt: 'If today is Wednesday, what day will it be after 21 days?', options: ['Wednesday', 'Tuesday', 'Thursday'], answer: 'Wednesday', difficulty: 'medium' },
  { chapter: 'calendar-basics', prompt: 'Which day comes 2 days before Sunday?', options: ['Friday', 'Saturday', 'Thursday'], answer: 'Friday', difficulty: 'easy' },

  // ---------------- Chapter 8: Pattern Completion (Visual) ----------------
  // Note: these are described textually; actual implementation should use image/shape assets.
  { chapter: 'pattern-completion', prompt: 'A square, then a circle, then a square, then a circle. What comes next?', options: ['Square', 'Circle', 'Triangle'], answer: 'Square', difficulty: 'easy' },
  { chapter: 'pattern-completion', prompt: 'Red, Blue, Red, Blue, Red, ? — what color comes next?', options: ['Red', 'Blue', 'Green'], answer: 'Blue', difficulty: 'easy' },
  { chapter: 'pattern-completion', prompt: 'A shape grows: 1 dot, 2 dots, 3 dots, 4 dots. How many dots come next?', options: ['5', '6', '4'], answer: '5', difficulty: 'easy' },
  { chapter: 'pattern-completion', prompt: 'Triangle, Triangle, Square, Triangle, Triangle, Square, ? — what comes next?', options: ['Triangle', 'Square', 'Circle'], answer: 'Triangle', difficulty: 'medium' },
  { chapter: 'pattern-completion', prompt: 'A pattern rotates 90° each time. After 4 rotations, what happens?', options: ['Back to start', 'Upside down', 'Sideways'], answer: 'Back to start', difficulty: 'medium' },
  { chapter: 'pattern-completion', prompt: 'Small circle, medium circle, large circle, ? — what comes next in the size pattern?', options: ['Small circle', 'Extra-large circle', 'Square'], answer: 'Extra-large circle', difficulty: 'easy' },
  { chapter: 'pattern-completion', prompt: 'A line pattern: 1 line, 2 lines, 3 lines. How many lines in the 5th figure?', options: ['4', '5', '6'], answer: '5', difficulty: 'easy' },
  { chapter: 'pattern-completion', prompt: 'Star, Star, Moon, Star, Star, Moon, Star, ? — what comes next?', options: ['Star', 'Moon', 'Sun'], answer: 'Star', difficulty: 'medium' },

  // ---------------- Chapter 9: Basic Blood Relations ----------------
  { chapter: 'blood-relations-basic', prompt: '"This is my father\'s son, but not me." Who is it?', options: ['Brother', 'Uncle', 'Cousin'], answer: 'Brother', difficulty: 'medium' },
  { chapter: 'blood-relations-basic', prompt: 'My mother\'s mother is my ?', options: ['Grandmother', 'Aunt', 'Sister'], answer: 'Grandmother', difficulty: 'easy' },
  { chapter: 'blood-relations-basic', prompt: 'My father\'s brother is my ?', options: ['Uncle', 'Cousin', 'Nephew'], answer: 'Uncle', difficulty: 'easy' },
  { chapter: 'blood-relations-basic', prompt: 'My sister\'s daughter is my ?', options: ['Niece', 'Cousin', 'Aunt'], answer: 'Niece', difficulty: 'easy' },
  { chapter: 'blood-relations-basic', prompt: 'My mother\'s sister is my ?', options: ['Aunt', 'Cousin', 'Grandmother'], answer: 'Aunt', difficulty: 'easy' },
  { chapter: 'blood-relations-basic', prompt: 'My father\'s wife is my ?', options: ['Mother', 'Aunt', 'Sister'], answer: 'Mother', difficulty: 'easy' },
  { chapter: 'blood-relations-basic', prompt: 'My son\'s wife is my ?', options: ['Daughter-in-law', 'Niece', 'Granddaughter'], answer: 'Daughter-in-law', difficulty: 'medium' },
  { chapter: 'blood-relations-basic', prompt: '"She is the daughter of my grandfather\'s only son." If I am that son, who is she to me?', options: ['Sister', 'Daughter', 'Niece'], answer: 'Sister', difficulty: 'hard' },

  // ---------------- Chapter 10: Mirror Images (Basic) ----------------
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the letter "b" looks like which letter?', options: ['d', 'p', 'q'], answer: 'd', difficulty: 'easy' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, does "3:00" on a clock face appear reversed as which time position?', options: ['9:00 position', '3:00 position', '6:00 position'], answer: '9:00 position', difficulty: 'medium' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the word "MOM" appears as ?', options: ['MOM', 'WOW', 'MOW'], answer: 'MOM', difficulty: 'medium' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, your left hand appears as your ?', options: ['Right hand', 'Left hand', 'Both hands'], answer: 'Right hand', difficulty: 'easy' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the number "2" would appear ?', options: ['Flipped/reversed', 'Exactly the same', 'Upside down'], answer: 'Flipped/reversed', difficulty: 'easy' },
  { chapter: 'mirror-images-basic', prompt: 'Which letter looks the same in a mirror: A, B, or C?', options: ['A', 'B', 'C'], answer: 'A', difficulty: 'medium' },
  { chapter: 'mirror-images-basic', prompt: 'In a mirror, the letter "E" would look like ?', options: ['A backward E (Ǝ)', 'Exactly the same E', 'The letter F'], answer: 'A backward E (Ǝ)', difficulty: 'easy' },
  { chapter: 'mirror-images-basic', prompt: 'Which of these words looks the same forward and in a mirror (approximately): TOOT, HELLO, WATER?', options: ['TOOT', 'HELLO', 'WATER'], answer: 'TOOT', difficulty: 'hard' },
];

export function getQuestionsByChapter(chapterId) {
  return RA_LEVEL1_QUESTIONS.filter((q) => q.chapter === chapterId);
}
