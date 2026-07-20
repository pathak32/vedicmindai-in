// ─── Seeded RNG (as specified) ───────────────────────────────────────────────

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function getTodaySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// ─── Grade Band Helper ────────────────────────────────────────────────────────

function getGradeBand(grade) {
  const g = parseInt(String(grade).replace(/\D/g, '')) || 8;
  if (g <= 5)  return 'JUNIOR';
  if (g <= 8)  return 'MIDDLE';
  if (g <= 10) return 'SENIOR';
  return 'HIGHER';
}

// ─── Question Banks ───────────────────────────────────────────────────────────
// Each question: { id, type, question, options, correctIndex, explanation, sutra, bands[] }

const VEDIC_BANK = [
  // JUNIOR
  { id: 'v01', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 8 × 7 using Nikhilam (base 10)?', options: ['54','56','58','52'], correctIndex: 1,
    explanation: 'Deficits: 2 and 3. Cross: 8−3=5. Product: 2×3=6 → 56', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v02', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 43 × 11?', options: ['463','473','453','483'], correctIndex: 1,
    explanation: 'Write 4, middle=4+3=7, write 3 → 473', sutra: 'Urdhva-Tiryagbhyam' },
  { id: 'v03', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is the digit sum of 9999?', options: ['0','36','9','18'], correctIndex: 0,
    explanation: '9+9+9+9=36 → 3+6=9 → by convention, treat as 0', sutra: 'Gunita Samuchyah' },
  { id: 'v04', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 25²?', options: ['525','625','725','425'], correctIndex: 1,
    explanation: '2×3=6, append 25 → 625', sutra: 'Ekadhikena Purvena' },
  { id: 'v05', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 248 × 5 using Vedic shortcut?', options: ['1230','1240','1220','1250'], correctIndex: 1,
    explanation: '248 ÷ 2 = 124, append 0 → 1240', sutra: 'Anurupyena' },
  { id: 'v06', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 23 × 11?', options: ['243','253','263','233'], correctIndex: 1,
    explanation: '2, 2+3=5, 3 → 253', sutra: 'Urdhva-Tiryagbhyam' },
  { id: 'v07', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 45 × 11?', options: ['485','505','495','475'], correctIndex: 2,
    explanation: '4, 4+5=9, 5 → 495', sutra: 'Urdhva-Tiryagbhyam' },
  { id: 'v08', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 45²?', options: ['1925','2025','2125','1825'], correctIndex: 1,
    explanation: '4×5=20, append 25 → 2025', sutra: 'Ekadhikena Purvena' },
  { id: 'v09', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 35²?', options: ['1125','1225','1325','1025'], correctIndex: 1,
    explanation: '3×4=12, append 25 → 1225', sutra: 'Ekadhikena Purvena' },
  { id: 'v10', type: 'vedic', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 75²?', options: ['5425','5625','5825','5225'], correctIndex: 1,
    explanation: '7×8=56, append 25 → 5625', sutra: 'Ekadhikena Purvena' },
  // MIDDLE+
  { id: 'v11', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 97 × 96 using Nikhilam?', options: ['9312','9412','9212','9112'], correctIndex: 0,
    explanation: 'Deficits: 3,4. Cross: 97−4=93. Product: 3×4=12 → 9312', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v12', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 98 × 97?', options: ['9506','9606','9406','9706'], correctIndex: 0,
    explanation: 'Deficits: 2,3. Cross: 98−3=95. Product: 2×3=06 → 9506', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v13', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 99 × 98?', options: ['9702','9802','9602','9902'], correctIndex: 0,
    explanation: 'Deficits: 1,2. Cross: 99−2=97. Product: 1×2=02 → 9702', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v14', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 67 × 11?', options: ['727','737','747','717'], correctIndex: 1,
    explanation: '6+7=13, carry 1: 6+1=7 → 737', sutra: 'Urdhva-Tiryagbhyam' },
  { id: 'v15', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 55²?', options: ['3000','3025','3125','2925'], correctIndex: 1,
    explanation: '5×6=30, append 25 → 3025', sutra: 'Ekadhikena Purvena' },
  { id: 'v16', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 65²?', options: ['4025','4125','4225','4325'], correctIndex: 2,
    explanation: '6×7=42, append 25 → 4225', sutra: 'Ekadhikena Purvena' },
  { id: 'v17', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 44 × 25 using Vedic shortcut?', options: ['1000','1100','1200','900'], correctIndex: 1,
    explanation: '44 ÷ 4 = 11, multiply by 100 → 1100', sutra: 'Anurupyena' },
  { id: 'v18', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 23 × 99?', options: ['2277','2377','2177','2477'], correctIndex: 0,
    explanation: '23×100 − 23 = 2300 − 23 = 2277', sutra: 'Nikhilam' },
  { id: 'v19', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 93 × 92?', options: ['8456','8556','8356','8656'], correctIndex: 1,
    explanation: 'Deficits: 7,8. Cross: 93−8=85. Product: 7×8=56 → 8556', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v20', type: 'vedic', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'What is 12 × 13 using Urdhva method?', options: ['146','156','166','136'], correctIndex: 1,
    explanation: '1×1=1 | 1×3+2×1=5 | 2×3=6 → 156', sutra: 'Urdhva-Tiryagbhyam' },
  // SENIOR+
  { id: 'v21', type: 'vedic', bands: ['SENIOR','HIGHER'],
    question: 'What is 85²?', options: ['7025','7125','7225','7325'], correctIndex: 2,
    explanation: '8×9=72, append 25 → 7225', sutra: 'Ekadhikena Purvena' },
  { id: 'v22', type: 'vedic', bands: ['SENIOR','HIGHER'],
    question: 'What is 95²?', options: ['9025','8925','9125','8825'], correctIndex: 0,
    explanation: '9×10=90, append 25 → 9025', sutra: 'Ekadhikena Purvena' },
  { id: 'v23', type: 'vedic', bands: ['SENIOR','HIGHER'],
    question: 'What is 103² using Yavadunam?', options: ['10509','10609','10709','10409'], correctIndex: 1,
    explanation: '103+3=106, 3²=09 → 10609', sutra: 'Yavadunam' },
  { id: 'v24', type: 'vedic', bands: ['SENIOR','HIGHER'],
    question: 'What is 12³?', options: ['1528','1628','1728','1828'], correctIndex: 2,
    explanation: '12³ = 12×12×12 = 144×12 = 1728', sutra: 'Urdhva-Tiryagbhyam' },
  // HIGHER
  { id: 'v25', type: 'vedic', bands: ['HIGHER'],
    question: 'What is 23³?', options: ['11167','12167','13167','10167'], correctIndex: 1,
    explanation: '23³ = 23×23×23 = 529×23 = 12167', sutra: 'Urdhva-Tiryagbhyam' },
  { id: 'v26', type: 'vedic', bands: ['HIGHER'],
    question: 'What is 998 × 997 using Nikhilam (base 1000)?', options: ['995006','994006','996006','993006'], correctIndex: 0,
    explanation: 'Deficits: 2,3. Cross: 998−3=995. Product: 2×3=006 → 995006', sutra: 'Nikhilam Navatashcaramam Dashatah' },
  { id: 'v27', type: 'vedic', bands: ['HIGHER'],
    question: 'What is 96 × 125 using Anurupyena?', options: ['10000','11000','12000','13000'], correctIndex: 2,
    explanation: '96 ÷ 8 = 12, append 000 → 12000', sutra: 'Anurupyena' },
];

const APTITUDE_BANK = [
  // JUNIOR
  { id: 'a01', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What comes next: 2, 4, 8, 16, __?', options: ['24','28','32','30'], correctIndex: 2,
    explanation: 'Each number doubles: 16×2=32', sutra: null },
  { id: 'a02', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If 4 pens cost ₹20, how much do 10 pens cost?', options: ['₹40','₹45','₹50','₹55'], correctIndex: 2,
    explanation: '1 pen = ₹5. 10 pens = ₹50', sutra: null },
  { id: 'a03', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Complete the series: 1, 4, 9, 16, __?', options: ['20','25','24','36'], correctIndex: 1,
    explanation: 'Perfect squares: 1²,2²,3²,4²,5²=25', sutra: null },
  { id: 'a04', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Which is the odd one out: 2, 3, 5, 7, 9?', options: ['2','3','5','9'], correctIndex: 3,
    explanation: '9=3×3 is not prime. All others are prime numbers', sutra: null },
  { id: 'a05', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is 25% of 200?', options: ['40','50','60','25'], correctIndex: 1,
    explanation: '25/100 × 200 = 50', sutra: null },
  { id: 'a06', type: 'aptitude', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'What is the LCM of 4 and 6?', options: ['8','10','12','16'], correctIndex: 2,
    explanation: 'Multiples of 4: 4,8,12. Multiples of 6: 6,12. LCM=12', sutra: null },
  // MIDDLE+
  { id: 'a07', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'Find the missing number: 3, 6, 11, 18, __?', options: ['25','27','29','23'], correctIndex: 1,
    explanation: 'Differences: 3,5,7,9 (odd numbers). 18+9=27', sutra: null },
  { id: 'a08', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: '36 : 6 :: 64 : __?', options: ['6','7','8','9'], correctIndex: 2,
    explanation: '36=6², 64=8². Relationship: perfect square to its root', sutra: null },
  { id: 'a09', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'If CAT = 24 (C=3+A=1+T=20), what is DOG?', options: ['24','26','28','30'], correctIndex: 1,
    explanation: 'D=4, O=15, G=7. Sum=4+15+7=26', sutra: null },
  { id: 'a10', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'A train travels 120 km in 2 hours. What is its speed?', options: ['50 km/h','60 km/h','70 km/h','40 km/h'], correctIndex: 1,
    explanation: 'Speed = Distance/Time = 120/2 = 60 km/h', sutra: null },
  { id: 'a11', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'Which number fits: 121, 144, 169, __?', options: ['181','196','200','189'], correctIndex: 1,
    explanation: '11²=121, 12²=144, 13²=169, 14²=196', sutra: null },
  { id: 'a12', type: 'aptitude', bands: ['MIDDLE','SENIOR','HIGHER'],
    question: 'If MATHS = 61 (sum of letter positions), what does ADD equal?', options: ['9','8','10','11'], correctIndex: 0,
    explanation: 'A=1, D=4, D=4. Total=1+4+4=9', sutra: null },
  // SENIOR+
  { id: 'a13', type: 'aptitude', bands: ['SENIOR','HIGHER'],
    question: 'Buy at ₹80, sell at ₹100. Profit %?', options: ['20%','25%','15%','30%'], correctIndex: 1,
    explanation: 'Profit=₹20. Profit%=20/80×100=25%', sutra: null },
  { id: 'a14', type: 'aptitude', bands: ['SENIOR','HIGHER'],
    question: 'A is B\'s sister. B is C\'s brother. C is D\'s father. How is A related to D?', options: ['Mother','Aunt','Sister','Grandmother'], correctIndex: 1,
    explanation: 'A→sister of B→sibling of C→parent of D. So A is D\'s aunt', sutra: null },
  { id: 'a15', type: 'aptitude', bands: ['SENIOR','HIGHER'],
    question: 'All cats are animals. All animals are living. Therefore:', options: ['All living are cats','All cats are living','Some animals not living','No cats are living'], correctIndex: 1,
    explanation: 'Cats→Animals→Living, so all cats are living', sutra: null },
  // HIGHER
  { id: 'a16', type: 'aptitude', bands: ['HIGHER'],
    question: 'Two pipes fill a tank in 6 and 8 hours. Together, in how many hours?', options: ['3.43h','3.25h','3.5h','4h'], correctIndex: 0,
    explanation: 'Combined rate=1/6+1/8=7/24. Time=24/7≈3.43 hours', sutra: null },
  { id: 'a17', type: 'aptitude', bands: ['HIGHER'],
    question: 'Simple interest on ₹1000 at 5% for 2 years?', options: ['₹50','₹100','₹150','₹200'], correctIndex: 1,
    explanation: 'SI=PRT/100=1000×5×2/100=₹100', sutra: null },
  { id: 'a18', type: 'aptitude', bands: ['HIGHER'],
    question: 'If 2x + 3 = 11, what is x?', options: ['3','4','5','6'], correctIndex: 1,
    explanation: '2x=11−3=8, x=8/2=4', sutra: null },
  { id: 'a19', type: 'aptitude', bands: ['HIGHER'],
    question: 'Series: 2, 3, 5, 8, 13, __?', options: ['18','20','21','19'], correctIndex: 2,
    explanation: 'Fibonacci: each term = sum of previous two. 8+13=21', sutra: null },
  { id: 'a20', type: 'aptitude', bands: ['HIGHER'],
    question: 'Probability of getting heads twice in 2 coin flips?', options: ['1/2','1/3','1/4','1/8'], correctIndex: 2,
    explanation: 'P(H)×P(H) = 1/2 × 1/2 = 1/4', sutra: null },
];

const REASONING_BANK = [
  { id: 'r01', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Which one does not belong: Apple, Banana, Carrot, Mango?', options: ['Apple','Carrot','Mango'], correctIndex: 1,
    explanation: 'Apple, Banana, and Mango are all fruits. Carrot is a vegetable — it doesn\'t belong.', sutra: null },
  { id: 'r02', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Which one does not belong: Dog, Cat, Cow, Table?', options: ['Cow','Table','Dog'], correctIndex: 1,
    explanation: 'Dog, Cat, and Cow are all animals. Table is furniture — it doesn\'t belong.', sutra: null },
  { id: 'r03', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Which one does not belong: Circle, Square, Triangle, Red?', options: ['Red','Circle','Square'], correctIndex: 0,
    explanation: 'Circle, Square, and Triangle are all shapes. Red is a colour — not a shape, so it doesn\'t belong.', sutra: null },
  { id: 'r04', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: '2, 4, 6, 8, ?', options: ['9','10','12'], correctIndex: 1,
    explanation: 'Each number increases by 2 (+2, +2...). The next is 8 + 2 = 10.', sutra: null },
  { id: 'r05', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: '5, 10, 15, 20, ?', options: ['22','25','30'], correctIndex: 1,
    explanation: 'Each number increases by 5 (+5, +5...). The next is 20 + 5 = 25.', sutra: null },
  { id: 'r06', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: '1, 3, 5, 7, ?', options: ['8','9','10'], correctIndex: 1,
    explanation: 'Odd numbers in order, each +2. The next is 7 + 2 = 9.', sutra: null },
  { id: 'r07', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Hand is to Glove as Foot is to ?', options: ['Shoe','Sock','Leg'], correctIndex: 0,
    explanation: 'A Glove covers/protects the Hand. Similarly, a Shoe covers/protects the Foot.', sutra: null },
  { id: 'r08', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Bird is to Nest as Bee is to ?', options: ['Flower','Hive','Sky'], correctIndex: 1,
    explanation: 'A Nest is where a Bird lives. Similarly, a Hive is where a Bee lives.', sutra: null },
  { id: 'r09', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Sun is to Day as Moon is to ?', options: ['Night','Star','Sky'], correctIndex: 0,
    explanation: 'The Sun lights the Day. Similarly, the Moon lights the Night.', sutra: null },
  { id: 'r10', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Rahul is taller than Priya. Priya is taller than Aman. Who is the shortest?', options: ['Rahul','Priya','Aman'], correctIndex: 2,
    explanation: 'Chain: Rahul > Priya > Aman. Aman is at the bottom — the shortest.', sutra: null },
  { id: 'r11', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'In a race, Rani finished before Sam, and Sam finished before Tina. Who finished first?', options: ['Rani','Sam','Tina'], correctIndex: 0,
    explanation: 'Chain: Rani > Sam > Tina. Rani is at the top — she finished first.', sutra: null },
  { id: 'r12', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'A is older than B. C is older than A. Who is the oldest?', options: ['A','B','C'], correctIndex: 2,
    explanation: 'Chain: C > A > B. C is at the top — the oldest.', sutra: null },
  { id: 'r13', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'You walk 5m North, then turn right. Which direction are you facing now?', options: ['East','West','South'], correctIndex: 0,
    explanation: 'Turning right from North means you face East.', sutra: null },
  { id: 'r14', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'You walk 3m East, then turn left. Which direction are you facing now?', options: ['North','South','West'], correctIndex: 0,
    explanation: 'Turning left from East means you face North.', sutra: null },
  { id: 'r15', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Facing North, if you turn 180°, which direction do you face?', options: ['South','East','West'], correctIndex: 0,
    explanation: 'A 180° turn from North brings you to face South — the exact opposite direction.', sutra: null },
  { id: 'r16', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If CAT is coded as DBU, how is DOG coded?', options: ['EPH','EPI','FPH'], correctIndex: 0,
    explanation: 'Each letter shifts forward by 1 (C→D, A→B, T→U). Apply the same +1 shift to DOG: D→E, O→P, G→H = EPH.', sutra: null },
  { id: 'r17', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If A=1, B=2, C=3, what does C-A-T spell as numbers?', options: ['3-1-20','3-1-19','3-2-20'], correctIndex: 0,
    explanation: 'Using standard alphabet positions: C=3, A=1, T=20.', sutra: null },
  { id: 'r18', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If BALL is coded as CBMM, how is BELL coded?', options: ['CFMM','CFMN','CFLM'], correctIndex: 0,
    explanation: 'Each letter shifts +1: B→C, A→B, L→M, L→M = CBMM. Apply to BELL: B→C, E→F, L→M, L→M = CFMM.', sutra: null },
  { id: 'r19', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If today is Monday, what day will it be after 10 days?', options: ['Wednesday','Thursday','Friday'], correctIndex: 1,
    explanation: '10 ÷ 7 leaves a remainder of 3. Three days after Monday: Tuesday, Wednesday, Thursday.', sutra: null },
  { id: 'r20', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'How many days are there in a leap year?', options: ['365','366','364'], correctIndex: 1,
    explanation: 'A leap year has one extra day (February 29), giving 365 + 1 = 366 days.', sutra: null },
  { id: 'r21', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'If today is Friday, what day was it 3 days ago?', options: ['Tuesday','Wednesday','Monday'], correctIndex: 0,
    explanation: 'Three days before Friday: Thursday, Wednesday, Tuesday.', sutra: null },
  { id: 'r22', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'A square, then a circle, then a square, then a circle. What comes next?', options: ['Square','Circle','Triangle'], correctIndex: 0,
    explanation: 'The pattern alternates Square, Circle, Square, Circle... The next is Square.', sutra: null },
  { id: 'r23', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'Red, Blue, Red, Blue, Red, ? — what color comes next?', options: ['Red','Blue','Green'], correctIndex: 1,
    explanation: 'The pattern alternates Red, Blue, Red, Blue... The next is Blue.', sutra: null },
  { id: 'r24', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'A shape grows: 1 dot, 2 dots, 3 dots, 4 dots. How many dots come next?', options: ['5','6','4'], correctIndex: 0,
    explanation: 'Each step adds one dot. The next is 5 dots.', sutra: null },
  { id: 'r25', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: '"This is my father\'s son, but not me." Who is it?', options: ['Brother','Uncle','Cousin'], correctIndex: 0,
    explanation: 'Your father\'s son is either you or your brother. Since it isn\'t you, it must be your brother.', sutra: null },
  { id: 'r26', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'My mother\'s mother is my ?', options: ['Grandmother','Aunt','Sister'], correctIndex: 0,
    explanation: 'Your mother\'s mother is your grandmother (on your mother\'s side).', sutra: null },
  { id: 'r27', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'My father\'s brother is my ?', options: ['Uncle','Cousin','Nephew'], correctIndex: 0,
    explanation: 'Your father\'s brother is your uncle (paternal uncle).', sutra: null },
  { id: 'r28', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'In a mirror, the letter "b" looks like which letter?', options: ['d','p','q'], correctIndex: 0,
    explanation: 'A mirror flips left and right. The stroke in "b" is on the right — flipped, it moves to the left, which is exactly "d".', sutra: null },
  { id: 'r29', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'In a mirror, does "3:00" on a clock face appear reversed as which time position?', options: ['9:00 position','3:00 position','6:00 position'], correctIndex: 0,
    explanation: 'A clock face is mirrored left-to-right. The 3:00 position (right side) moves to the left side, which is the 9:00 position.', sutra: null },
  { id: 'r30', type: 'reasoning', bands: ['JUNIOR','MIDDLE','SENIOR','HIGHER'],
    question: 'In a mirror, the word "MOM" appears as ?', options: ['MOM','WOW','MOW'], correctIndex: 0,
    explanation: 'M and O are both left-right symmetric letters, and MOM reads the same forwards and backwards — so it mirrors to itself: MOM.', sutra: null },
];

// ─── seededPick helper ────────────────────────────────────────────────────────

function seededPick(pool, count, rand) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getTodayString() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

export function getDailyQuestions(grade) {
  const rand = seededRandom(getTodaySeed());
  const band = getGradeBand(grade);

  const vmPool = VEDIC_BANK.filter(q => q.bands.includes(band));
  const rsPool = REASONING_BANK.filter(q => q.bands.includes(band));
  // Aptitude paused from the daily rotation until the Aptitude Zone
  // section itself has live content — re-enable alongside APTITUDE_BANK
  // when that's ready (plan: expand to 9-10 total questions then).

  const vmPicks = seededPick(vmPool, 3, rand);
  const rsPicks = seededPick(rsPool, 2, rand);

  const combined = seededPick([...vmPicks, ...rsPicks], 5, rand);

  return combined.map((q, i) => {
    // Shuffle options with the same seeded rand so results are deterministic
    const opts = [...q.options];
    const correct = opts[q.correctIndex];
    for (let j = opts.length - 1; j > 0; j--) {
      const k = Math.floor(rand() * (j + 1));
      [opts[j], opts[k]] = [opts[k], opts[j]];
    }
    return {
      id: 'q' + (i + 1),
      type: q.type,
      question: q.question,
      options: opts,
      correctIndex: opts.indexOf(correct),
      explanation: q.explanation,
      sutra: q.sutra || null,
      topic: q.id, // keep original id for reference
    };
  });
}

export function getDailyQuizStatus(progress) {
  const hour = new Date().getHours();
  if (hour < 8) return 'waiting';
  const today = getTodayString();
  const history = progress?.dailyQuizHistory || [];
  const taken = history.some(h => h.date === today);
  return taken ? 'completed' : 'pending';
}

// ─── Legacy helpers (kept for backward compatibility) ─────────────────────────

export function getTodayQuizKey() {
  const d = new Date();
  return 'dq_' + d.getFullYear() + '_' +
    String(d.getMonth() + 1).padStart(2, '0') + '_' +
    String(d.getDate()).padStart(2, '0');
}

export function hasCompletedTodayQuiz() {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  return getDailyQuizStatus(progress) === 'completed';
}

export function getTodayQuizResult() {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const today = getTodayString();
  return progress.dailyQuizHistory?.find(h => h.date === today) || null;
}

export function saveDailyQuizResult(result) {
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  if (!progress.dailyQuizHistory) progress.dailyQuizHistory = [];
  // Prevent duplicate saves for same day
  const today = getTodayString();
  if (!progress.dailyQuizHistory.some(h => h.date === today)) {
    progress.dailyQuizHistory.push({ ...result, date: today });
    progress.totalXP = (progress.totalXP || 0) + result.xpEarned;
    localStorage.setItem('vedicmind_progress', JSON.stringify(progress));
  }
}