// Extra questions: 20 per chapter for Reasoning Level 1, Reasoning Level 2 and Aptitude.
// Most questions come from rules, so each answer is computed here, not typed by hand.
// Analogies, blood relations, verbal and critical reasoning use curated lists, because a rule
// cannot make those fair. Every question is checked before the export.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const PER = 20;

function rngFrom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const between = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const ordinal = (n) => {
  const v = n % 100;
  const suffix = v >= 11 && v <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  return `${n}${suffix}`;
};
const encode = (word, k) =>
  [...word].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26 + 26) % 26 + 65)).join('');

// Builds one question with the answer plus three wrong options, shuffled.
function mkQ(rng, chapter, prompt, answer, wrong, exp, extra = {}) {
  const ans = String(answer);
  const wrongs = [];
  for (const w of wrong) {
    const s = String(w);
    if (s !== ans && !wrongs.includes(s)) wrongs.push(s);
  }
  if (wrongs.length < 3) return null;
  return { chapter, prompt, options: shuffle(rng, [ans, ...wrongs.slice(0, 3)]), answer: ans, exp, ...extra };
}

// Numeric distractors close to the answer.
function numWrong(answer) {
  return [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 10, -10]
    .map((d) => answer + d)
    .filter((n) => n >= 0 && n !== answer);
}

// Picks PER unique candidates (unique by prompt and options).
function pickTwenty(chapter, cands, rng) {
  const seen = new Set();
  const unique = [];
  for (const q of cands) {
    if (!q) continue;
    const key = `${q.prompt}|${q.options.join(',')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(q);
  }
  if (unique.length < PER) throw new Error(`${chapter}: only ${unique.length} candidates`);
  return shuffle(rng, unique).slice(0, PER);
}

const fromList = (rng, chapter, items, toQ) => pickTwenty(chapter, items.map((it, i) => toQ(it, i)), rng);

// ---------------- Reasoning Level 1 ----------------
const L1 = 'L1';
const L1_DIFF = 'easy';

function l1Chapters() {
  const out = [];
  const rng = rngFrom(2001);

  // Odd one out: three from one group, one from another.
  const CATS = {
    fruits: ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Papaya', 'Guava', 'Pear'],
    vegetables: ['Carrot', 'Potato', 'Onion', 'Brinjal', 'Spinach', 'Peas', 'Cabbage', 'Radish'],
    animals: ['Dog', 'Cat', 'Cow', 'Lion', 'Tiger', 'Horse', 'Goat', 'Rabbit'],
    vehicles: ['Car', 'Bus', 'Bicycle', 'Train', 'Truck', 'Scooter', 'Tractor', 'Ship'],
    furniture: ['Table', 'Chair', 'Sofa', 'Bed', 'Stool', 'Cupboard', 'Desk', 'Shelf'],
    instruments: ['Guitar', 'Violin', 'Flute', 'Piano', 'Drum', 'Harmonium', 'Sitar', 'Tabla'],
    birds: ['Crow', 'Sparrow', 'Parrot', 'Pigeon', 'Eagle', 'Peacock', 'Owl', 'Duck'],
  };
  const catNames = Object.keys(CATS);
  const oddCands = [];
  for (let i = 0; i < 400; i++) {
    const a = pick(rng, catNames);
    const b = pick(rng, catNames);
    if (a === b) continue;
    const three = shuffle(rng, CATS[a]).slice(0, 3);
    const odd = pick(rng, CATS[b]);
    const opts = shuffle(rng, [...three, odd]);
    oddCands.push({
      chapter: 'odd-one-out',
      prompt: `Which one does not belong: ${opts.join(', ')}?`,
      options: opts,
      answer: odd,
      exp: `${three.join(', ')} are all ${a}. ${odd} is ${b}, so it does not belong.`,
      difficulty: L1_DIFF,
    });
  }
  out.push(...pickTwenty('odd-one-out', oddCands, rng));

  // Number series: arithmetic, geometric, growing gaps, squares.
  const seriesCands = [];
  for (let a = 1; a <= 20; a++) {
    for (let d = 2; d <= 9; d++) {
      const seq = [0, 1, 2, 3].map((i) => a + i * d);
      const ans = a + 4 * d;
      seriesCands.push(mkQ(rng, 'number-series-basic', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number increases by ${d}. Next: ${ans}.`, { difficulty: L1_DIFF }));
    }
  }
  for (let a = 1; a <= 4; a++) {
    for (let r = 2; r <= 3; r++) {
      const seq = [0, 1, 2, 3].map((i) => a * r ** i);
      const ans = a * r ** 4;
      seriesCands.push(mkQ(rng, 'number-series-basic', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is multiplied by ${r}. Next: ${ans}.`, { difficulty: L1_DIFF }));
    }
  }
  for (let s = 1; s <= 8; s++) {
    const seq = [s * s, (s + 1) ** 2, (s + 2) ** 2, (s + 3) ** 2];
    const ans = (s + 4) ** 2;
    seriesCands.push(mkQ(rng, 'number-series-basic', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `These are square numbers. Next: ${ans}.`, { difficulty: L1_DIFF }));
  }
  out.push(...pickTwenty('number-series-basic', seriesCands, rng));

  // Analogies (curated).
  const ANALOGY = [
    ['Doctor', 'Hospital', 'Teacher', 'School'], ['Bird', 'Nest', 'Dog', 'Kennel'], ['Cow', 'Milk', 'Hen', 'Egg'],
    ['Fish', 'Water', 'Bird', 'Air'], ['Pen', 'Write', 'Knife', 'Cut'], ['Eye', 'See', 'Ear', 'Hear'],
    ['Book', 'Read', 'Food', 'Eat'], ['Sun', 'Day', 'Moon', 'Night'], ['Hot', 'Cold', 'Up', 'Down'],
    ['Tree', 'Forest', 'Star', 'Galaxy'], ['Shoe', 'Foot', 'Glove', 'Hand'], ['Wheel', 'Car', 'Wing', 'Airplane'],
    ['Bee', 'Honey', 'Silkworm', 'Silk'], ['Chef', 'Kitchen', 'Pilot', 'Cockpit'], ['Dog', 'Puppy', 'Cat', 'Kitten'],
    ['Ship', 'Harbour', 'Plane', 'Airport'], ['Clock', 'Time', 'Thermometer', 'Temperature'], ['Lion', 'Pride', 'Crow', 'Flock'],
    ['Student', 'School', 'Patient', 'Hospital'], ['Water', 'Drink', 'Rice', 'Eat'],
  ];
  const analogyCands = ANALOGY.map(([a, b, c, d], i) => {
    const wrong = ANALOGY.filter((_, j) => j !== i).map((x) => x[3]);
    return mkQ(rng, 'analogies-basic', `${a} is to ${b} as ${c} is to ?`, d, shuffle(rng, wrong), `${a} and ${b} have the same relation as ${c} and ${d}.`, { difficulty: L1_DIFF });
  });
  out.push(...pickTwenty('analogies-basic', analogyCands, rng));

  // Ranking and ordering.
  const names = ['Asha', 'Bina', 'Chirag', 'Dev', 'Esha', 'Farhan', 'Gita', 'Hari'];
  const rankCands = [];
  for (let n = 5; n <= 12; n++) {
    for (let k = 1; k <= n; k++) {
      const who = pick(rng, names);
      const ans = n - k;
      rankCands.push(mkQ(rng, 'ranking-ordering', `In a row of ${n} students, ${who} is ${ordinal(k)} from the front. How many students are behind ${who}?`, ans, numWrong(ans), `${n} minus ${k} = ${ans} students are behind ${who}.`, { difficulty: L1_DIFF }));
    }
  }
  for (let i = 0; i < 200; i++) {
    const chain = shuffle(rng, names).slice(0, 4);
    const stmts = [0, 1, 2].map((j) => `${chain[j]} is taller than ${chain[j + 1]}`);
    rankCands.push({
      chapter: 'ranking-ordering',
      prompt: `${stmts.join('. ')}. Who is the shortest?`,
      options: shuffle(rng, chain),
      answer: chain[3],
      exp: `The chain of heights goes ${chain.join(' > ')}, so ${chain[3]} is the shortest.`,
      difficulty: L1_DIFF,
    });
  }
  out.push(...pickTwenty('ranking-ordering', rankCands, rng));

  // Direction: quarter turns.
  const DIRS = ['North', 'East', 'South', 'West'];
  const dirCands = [];
  for (const d of DIRS) {
    for (const turn of ['right', 'left']) {
      for (let k = 1; k <= 3; k++) {
        const idx = DIRS.indexOf(d);
        const now = (((idx + (turn === 'right' ? k : -k)) % 4) + 4) % 4;
        dirCands.push({
          chapter: 'direction-basic',
          prompt: `Facing ${d}, you turn ${turn} ${k * 90} degrees. Which direction are you facing now?`,
          options: shuffle(rng, DIRS),
          answer: DIRS[now],
          exp: `Each quarter turn moves you one direction along North, East, South, West. Facing ${DIRS[now]} now.`,
          difficulty: L1_DIFF,
        });
      }
    }
  }
  out.push(...pickTwenty('direction-basic', dirCands, rng));

  // Coding-decoding: shifts, letter sums and letter positions.
  const WORDS = ['CAT', 'DOG', 'SUN', 'BAT', 'MAP', 'TEA', 'RUN', 'BIRD', 'LAMP', 'RAIN', 'FISH', 'HAT', 'MOON', 'WIND', 'KITE'];
  const codeCands = [];
  for (const w of WORDS) {
    for (let k = 1; k <= 3; k++) {
      const code = encode(w, k);
      codeCands.push(mkQ(rng, 'coding-decoding-basic', `In a code, each letter moves ${k} place${k > 1 ? 's' : ''} forward. What is the code for ${w}?`, code, [encode(w, -k), encode(w, k + 1), w], `Move each letter ${k} forward: ${w} becomes ${code}.`, { difficulty: L1_DIFF }));
    }
    const sum = [...w].reduce((t, c) => t + (c.charCodeAt(0) - 64), 0);
    codeCands.push(mkQ(rng, 'coding-decoding-basic', `If A=1, B=2, C=3 and so on, what is the sum of the letter values of ${w}?`, sum, numWrong(sum), `Add the value of each letter: the total is ${sum}.`, { difficulty: L1_DIFF }));
  }
  for (let i = 0; i < 40; i++) {
    const p = between(rng, 0, 22);
    const k = between(rng, 2, 4);
    const from = String.fromCharCode(65 + p);
    const to = String.fromCharCode(65 + p + k);
    codeCands.push(mkQ(rng, 'coding-decoding-basic', `Which letter is ${k} places after ${from} in the alphabet?`, to, [String.fromCharCode(65 + p + k - 1), String.fromCharCode(65 + p + k + 1), String.fromCharCode(65 + p - 1)], `Counting ${k} places after ${from} gives ${to}.`, { difficulty: L1_DIFF }));
  }
  out.push(...pickTwenty('coding-decoding-basic', codeCands, rng));

  // Blood relations (curated, each answer checked by hand).
  const BLOOD = [
    ["Anita's father is Suresh. Suresh's sister is Meera. How is Meera related to Anita?", 'Aunt'],
    ['Rohit is the son of Kavita. Kavita\'s brother is Anil. How is Anil related to Rohit?', 'Uncle'],
    ['Pooja is the mother of Ajay. Ajay is the brother of Sonal. How is Pooja related to Sonal?', 'Mother'],
    ["Mohan's wife is Radha. Radha's son is Vikas. How is Mohan related to Vikas?", 'Father'],
    ["Neha's grandfather is Prakash. Prakash's son is Ravi. How is Ravi related to Neha?", 'Father'],
    ["Sita is the daughter of Ramesh. Ramesh's brother is Mohan. How is Mohan related to Sita?", 'Uncle'],
    ['Arjun is the only son of Rekha. Rekha\'s husband is Vijay. How is Vijay related to Arjun?', 'Father'],
    ["Kiran's mother is Lata. Lata's brother is Prem. How is Prem related to Kiran?", 'Uncle'],
    ["Divya is the sister of Manish. Manish's father is Shyam. How is Shyam related to Divya?", 'Father'],
    ['Om is the brother of Gita. Gita\'s son is Raj. How is Om related to Raj?', 'Uncle'],
    ["Leela is the grandmother of Tara. Tara's father is Anand. How is Leela related to Anand?", 'Mother'],
    ["Harish's aunt is Shanti. Shanti's son is Vivek. How is Vivek related to Harish?", 'Cousin'],
    ["Priya's uncle is Dev. Dev's wife is Sunita. How is Sunita related to Priya?", 'Aunt'],
    ["Asha's son is Dev. Dev's sister is Lila. How is Lila related to Asha?", 'Daughter'],
    ['Mohit is the father of Kabir. Kabir is the brother of Esha. How is Esha related to Mohit?', 'Daughter'],
    ["Ganesh's mother is Gauri. Gauri's husband is Hari. How is Hari related to Ganesh?", 'Father'],
    ["Nisha is the wife of Kunal. Kunal's mother is Rama. How is Rama related to Nisha?", 'Mother-in-law'],
    ["Tarun's sister is Mini. Mini's husband is Ravi. How is Ravi related to Tarun?", 'Brother-in-law'],
    ["Farida's grandson is Imran. Imran's father is Salim. How is Salim related to Farida?", 'Son'],
    ["Veer's father is Ajit. Ajit's brother is Sanjay. How is Sanjay related to Veer?", 'Uncle'],
    ["Dinesh is the husband of Sheela. Sheela's son is Pankaj. How is Dinesh related to Pankaj?", 'Father'],
  ];
  const RELS = ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Son', 'Daughter', 'Cousin', 'Grandfather', 'Grandmother', 'Nephew', 'Niece', 'Mother-in-law', 'Brother-in-law'];
  out.push(...fromList(rng, 'blood-relations-basic', BLOOD, ([p, a]) => mkQ(rng, 'blood-relations-basic', p, a, shuffle(rng, RELS.filter((r) => r !== a)), `Working through the family links, ${a} is the correct relation.`, { difficulty: L1_DIFF })));

  // Calendar basics.
  const calCands = [];
  for (let d = 0; d < 7; d++) {
    for (let n = 1; n <= 30; n++) {
      const ahead = DAYS[(d + n) % 7];
      calCands.push(mkQ(rng, 'calendar-basics', `If today is ${DAYS[d]}, what day will it be after ${n} day${n > 1 ? 's' : ''}?`, ahead, DAYS.filter((x) => x !== ahead).slice(0, 4), `${n} days after ${DAYS[d]} is ${ahead}, since each week has 7 days.`, { difficulty: L1_DIFF }));
      const back = DAYS[(((d - n) % 7) + 7) % 7];
      calCands.push(mkQ(rng, 'calendar-basics', `If today is ${DAYS[d]}, what day was it ${n} day${n > 1 ? 's' : ''} ago?`, back, DAYS.filter((x) => x !== back).slice(0, 4), `${n} days before ${DAYS[d]} is ${back}.`, { difficulty: L1_DIFF }));
    }
  }
  out.push(...pickTwenty('calendar-basics', calCands, rng));

  // Mirror images: letter pairs and symmetric letters.
  const SYM = ['A', 'H', 'I', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y'];
  const ASYM = ['B', 'C', 'E', 'F', 'G', 'J', 'K', 'L', 'N', 'P', 'Q', 'R', 'S', 'Z', 'D'];
  const mirrorCands = [];
  for (const s of SYM) {
    for (let i = 0; i < 6; i++) {
      const three = shuffle(rng, ASYM).slice(0, 3);
      mirrorCands.push(mkQ(rng, 'mirror-images-basic', 'Which letter looks exactly the same in a mirror?', s, three, `${s} is symmetrical, so its mirror image is the same letter.`, { difficulty: L1_DIFF }));
    }
  }
  const PAIR = { b: 'd', d: 'b', p: 'q', q: 'p' };
  for (const [l, m] of Object.entries(PAIR)) {
    mirrorCands.push(mkQ(rng, 'mirror-images-basic', `What is the mirror image of the letter '${l}'?`, m, ['a', 'e', 'g', 'h', 'j'], `The mirror of '${l}' is '${m}'.`, { difficulty: L1_DIFF }));
  }
  out.push(...pickTwenty('mirror-images-basic', mirrorCands, rng));

  // Pattern completion: numeric patterns.
  const patCands = [];
  for (let a = 1; a <= 5; a++) {
    for (let r = 2; r <= 3; r++) {
      const seq = [0, 1, 2, 3].map((i) => a * r ** i);
      patCands.push(mkQ(rng, 'pattern-completion', `Complete the pattern: ${seq.join(', ')}, ?`, a * r ** 4, numWrong(a * r ** 4), `Each number is multiplied by ${r}.`, { difficulty: L1_DIFF }));
    }
  }
  for (let a = 1; a <= 10; a++) {
    for (let d = 3; d <= 8; d += 1) {
      const seq = [0, 1, 2, 3].map((i) => a + i * d);
      patCands.push(mkQ(rng, 'pattern-completion', `Complete the pattern: ${seq.join(', ')}, ?`, a + 4 * d, numWrong(a + 4 * d), `Each number goes up by ${d}.`, { difficulty: L1_DIFF }));
    }
  }
  for (let a = 1; a <= 6; a++) {
    for (let b = a + 1; b <= a + 4; b++) {
      const seq = [a, b, a + b, a + 2 * b];
      const ans = 2 * a + 3 * b;
      patCands.push(mkQ(rng, 'pattern-completion', `Complete the pattern: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is the sum of the two numbers before it. Next: ${ans}.`, { difficulty: L1_DIFF }));
    }
  }
  out.push(...pickTwenty('pattern-completion', patCands, rng));

  return out;
}

// ---------------- Reasoning Level 2 ----------------
const L2_DIFF = 'medium';

function l2Chapters() {
  const out = [];
  const rng = rngFrom(3001);

  // Odd one out by number property.
  const SETS = [
    { name: 'prime numbers', items: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] },
    { name: 'square numbers', items: [4, 9, 16, 25, 36, 49, 64, 81, 100] },
    { name: 'cube numbers', items: [8, 27, 64, 125, 216] },
    { name: 'triangular numbers', items: [1, 3, 6, 10, 15, 21, 28, 36] },
    { name: 'multiples of 5', items: [5, 10, 15, 20, 25, 30, 35, 40] },
    { name: 'even multiples of 3', items: [6, 12, 18, 24, 30, 36] },
  ];
  const oddCands = [];
  for (const S of SETS) {
    for (const T of SETS) {
      if (S === T) continue;
      const pool = S.items.filter((x) => !T.items.includes(x));
      const outside = T.items.filter((x) => !S.items.includes(x));
      if (pool.length < 3 || outside.length < 1) continue;
      for (let i = 0; i < 6; i++) {
        const three = shuffle(rng, pool).slice(0, 3);
        const odd = pick(rng, outside);
        const opts = shuffle(rng, [...three, odd].map(String));
        oddCands.push({
          chapter: 'odd-one-out-l2',
          prompt: `Which number does not belong: ${opts.join(', ')}?`,
          options: opts,
          answer: String(odd),
          exp: `${three.join(', ')} are ${S.name}. ${odd} is ${T.name}, not ${S.name}.`,
          difficulty: L2_DIFF,
        });
      }
    }
  }
  out.push(...pickTwenty('odd-one-out-l2', oddCands, rng));

  // Number series with rules.
  const serCands = [];
  for (let a = 1; a <= 5; a++) {
    const seq = [a, 2 * a + 1, 4 * a + 3, 8 * a + 7];
    const ans = 16 * a + 15;
    serCands.push(mkQ(rng, 'number-series-l2', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is double the previous one plus 1. Next: ${ans}.`, { difficulty: L2_DIFF }));
  }
  for (let a = 2; a <= 4; a++) {
    const seq = [a, 3 * a - 1, 9 * a - 4, 27 * a - 13];
    const ans = 81 * a - 40;
    serCands.push(mkQ(rng, 'number-series-l2', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is 3 times the previous one minus 1. Next: ${ans}.`, { difficulty: L2_DIFF }));
  }
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      if (a === b) continue;
      const seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
      const ans = 3 * a + 5 * b;
      serCands.push(mkQ(rng, 'number-series-l2', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is the sum of the two before it. Next: ${ans}.`, { difficulty: L2_DIFF }));
    }
  }
  for (let a = 1; a <= 10; a++) {
    const seq = [a, a + 2, a + 6, a + 12];
    const ans = a + 20;
    serCands.push(mkQ(rng, 'number-series-l2', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `The gaps grow by 2 each time: 2, 4, 6, then 8. Next: ${ans}.`, { difficulty: L2_DIFF }));
  }
  for (let s = 1; s <= 8; s++) {
    const seq = [s * s + 1, (s + 1) ** 2 + 1, (s + 2) ** 2 + 1, (s + 3) ** 2 + 1];
    const ans = (s + 4) ** 2 + 1;
    serCands.push(mkQ(rng, 'number-series-l2', `What comes next: ${seq.join(', ')}, ?`, ans, numWrong(ans), `Each number is a square plus 1. Next: ${ans}.`, { difficulty: L2_DIFF }));
  }
  out.push(...pickTwenty('number-series-l2', serCands, rng));

  // Analogies (abstract, curated).
  const ANALOGY = [
    ['Marathon', 'Running', 'Regatta', 'Rowing'], ['Scalpel', 'Surgeon', 'Brush', 'Painter'],
    ['Thermometer', 'Temperature', 'Speedometer', 'Speed'], ['Pilot', 'Aircraft', 'Driver', 'Car'],
    ['Architect', 'Building', 'Composer', 'Music'], ['Astronomer', 'Star', 'Botanist', 'Plant'],
    ['Geologist', 'Rock', 'Ornithologist', 'Bird'], ['Hammer', 'Nail', 'Key', 'Lock'],
    ['Oven', 'Bake', 'Fridge', 'Cool'], ['Bow', 'Arrow', 'Gun', 'Bullet'], ['Compass', 'Direction', 'Clock', 'Time'],
    ['Snake', 'Hiss', 'Lion', 'Roar'], ['Umbrella', 'Rain', 'Sunscreen', 'Sun'], ['Chapter', 'Book', 'Verse', 'Poem'],
    ['Scientist', 'Laboratory', 'Judge', 'Court'], ['Seed', 'Tree', 'Egg', 'Bird'], ['Heat', 'Melt', 'Cold', 'Freeze'],
    ['Hunger', 'Food', 'Thirst', 'Water'], ['Librarian', 'Books', 'Chef', 'Food'], ['Author', 'Novel', 'Composer', 'Symphony'],
  ];
  out.push(...fromList(rng, 'analogies-l2', ANALOGY, ([a, b, c, d], i) => {
    const wrong = ANALOGY.filter((_, j) => j !== i).map((x) => x[3]);
    return mkQ(rng, 'analogies-l2', `${a} : ${b} :: ${c} : ?`, d, shuffle(rng, wrong), `${a} and ${b} have the same relation as ${c} and ${d}.`, { difficulty: L2_DIFF });
  }));

  // Ranking with a chain of comparisons.
  const names = ['Asha', 'Bina', 'Chirag', 'Dev', 'Esha', 'Farhan', 'Gita', 'Hari', 'Isha', 'Jay'];
  const rankCands = [];
  for (let i = 0; i < 120; i++) {
    const chain = shuffle(rng, names).slice(0, 5);
    const stmts = [0, 1, 2, 3].map((j) => `${chain[j]} scores more than ${chain[j + 1]}`);
    rankCands.push({
      chapter: 'ranking-ordering-l2',
      prompt: `${stmts.join('. ')}. Who scores the least?`,
      options: shuffle(rng, [chain[4], chain[0], chain[1], chain[2]]),
      answer: chain[4],
      exp: `The scores go ${chain.join(' > ')}, so ${chain[4]} scores the least.`,
      difficulty: L2_DIFF,
    });
  }
  out.push(...pickTwenty('ranking-ordering-l2', rankCands, rng));

  // Direction: distance with Pythagoras, and compass direction.
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
  const dirCands = [];
  for (const [a, b, c] of TRIPLES) {
    for (let k = 1; k <= 3; k++) {
      dirCands.push(mkQ(rng, 'direction-l2', `Walk ${a * k} m North, then ${b * k} m East. How far are you from the starting point (in m)?`, c * k, numWrong(c * k), `The two legs form a right angle: ${a * k}² + ${b * k}² = ${c * k}², so the distance is ${c * k} m.`, { difficulty: L2_DIFF }));
      dirCands.push(mkQ(rng, 'direction-l2', `Walk ${a * k} m South, then ${b * k} m West. How far are you from the starting point (in m)?`, c * k, numWrong(c * k), `The two legs form a right angle, so the distance is ${c * k} m.`, { difficulty: L2_DIFF }));
    }
  }
  for (const ns of ['North', 'South']) {
    for (const ew of ['East', 'West']) {
      for (let a = 1; a <= 12; a++) {
        for (let b = 1; b <= 12; b++) {
          const ans = `${ns}-${ew}`;
          dirCands.push({
            chapter: 'direction-l2',
            prompt: `Walk ${a} m ${ns} and then ${b} m ${ew}. In which direction are you from the starting point?`,
            options: shuffle(rng, ['North-East', 'North-West', 'South-East', 'South-West']),
            answer: ans,
            exp: `You are ${a} m ${ns} and ${b} m ${ew} of the start, so you are ${ans}.`,
            difficulty: L2_DIFF,
          });
        }
      }
    }
  }
  out.push(...pickTwenty('direction-l2', dirCands, rng));

  // Calendar: day of the week for a date in a non-leap year.
  const calCands = [];
  for (let w = 0; w < 7; w++) {
    for (let m = 1; m < 12; m++) {
      for (let dd = 1; dd <= 28; dd += 3) {
        const offset = MONTH_DAYS.slice(0, m).reduce((x, y) => x + y, 0) + dd - 1;
        const ans = DAYS[(w + offset) % 7];
        calCands.push(mkQ(rng, 'calendar-l2', `If 1st January is a ${DAYS[w]} (non-leap year), what day is ${dd} ${MONTHS[m]}?`, ans, DAYS.filter((x) => x !== ans).slice(0, 4), `Counting ${offset} days after 1 January gives ${ans}.`, { difficulty: L2_DIFF }));
      }
    }
  }
  out.push(...pickTwenty('calendar-l2', calCands, rng));

  // Coding: move each letter forward, then write the word backwards.
  const WORDS = ['CAT', 'DOG', 'SUN', 'BAT', 'MAP', 'TEA', 'RUN', 'BIRD', 'LAMP', 'RAIN', 'FISH', 'HAT', 'MOON', 'WIND', 'KITE'];
  const codeCands = [];
  for (const w of WORDS) {
    for (let k = 1; k <= 3; k++) {
      const fwd = encode(w, k);
      const ans = [...fwd].reverse().join('');
      codeCands.push(mkQ(rng, 'coding-decoding-l2', `In a code, each letter moves ${k} forward and then the whole code is written backwards. What is the code for ${w}?`, ans, [fwd, w.split('').reverse().join(''), encode(w, -k)], `First ${w} becomes ${fwd}. Written backwards that is ${ans}.`, { difficulty: L2_DIFF }));
    }
  }
  out.push(...pickTwenty('coding-decoding-l2', codeCands, rng));

  // Pattern completion with letters: the gaps grow 2, 3, 4, 5.
  const letterCands = [];
  for (let s = 0; s <= 10; s++) {
    const idx = [s, s + 2, s + 5, s + 9];
    const ans = s + 14;
    const L = (i) => String.fromCharCode(65 + i);
    letterCands.push(mkQ(rng, 'pattern-completion-l2', `Complete the letter pattern: ${idx.map(L).join(', ')}, ?`, L(ans), [L(ans - 1), L(ans + 1), L(s + 12)], `The gaps in the alphabet are 2, 3, 4 and then 5. ${L(idx[3])} + 5 = ${L(ans)}.`, { difficulty: L2_DIFF }));
  }
  for (let s = 0; s <= 8; s++) {
    const idx = [s, s + 1, s + 3, s + 6];
    const ans = s + 10;
    const L = (i) => String.fromCharCode(65 + i);
    letterCands.push(mkQ(rng, 'pattern-completion-l2', `Complete the letter pattern: ${idx.map(L).join(', ')}, ?`, L(ans), [L(ans - 1), L(ans + 2), L(s + 8)], `The gaps are 1, 2, 3 and then 4. ${L(idx[3])} + 4 = ${L(ans)}.`, { difficulty: L2_DIFF }));
  }
  out.push(...pickTwenty('pattern-completion-l2', letterCands, rng));

  // Mirror images of clock times (mirror placed vertically).
  const clockCands = [];
  const fmt = (t) => {
    const h = Math.floor(t / 60) || 12;
    const m = t % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
  };
  for (let h = 1; h <= 12; h++) {
    for (let m = 0; m < 60; m += 5) {
      const t = (h % 12) * 60 + m;
      const mirror = (720 - t) % 720;
      const ans = fmt(mirror);
      const wrong = [fmt((mirror + 60) % 720), fmt((mirror + 720 - 60) % 720), fmt(t)];
      clockCands.push(mkQ(rng, 'mirror-images-l2', `What is the mirror image of the clock time ${fmt(t)}, seen in a mirror placed vertically?`, ans, wrong, `The mirror time is 11:60 minus the time, which gives ${ans}.`, { difficulty: L2_DIFF }));
    }
  }
  out.push(...pickTwenty('mirror-images-l2', clockCands, rng));

  // Blood relations with two links (curated, each answer checked by hand).
  const BLOOD2 = [
    ['Sameer is the son of Lata. Lata is the sister of Tej. Tej\'s daughter is Ria. How is Ria related to Sameer?', 'Cousin'],
    ['Ajay\'s father\'s only sister is Rekha. Rekha\'s son is Mohit. How is Mohit related to Ajay?', 'Cousin'],
    ['Vina is the wife of Raman. Raman\'s father is Kanhaiya. How is Kanhaiya related to Vina?', 'Father-in-law'],
    ['Meena\'s husband is Arun. Arun\'s sister is Lata. How is Lata related to Meena?', 'Sister-in-law'],
    ['Ritu is the mother of Kunal. Kunal\'s wife is Asha. How is Ritu related to Asha?', 'Mother-in-law'],
    ['Farhan\'s son is Zaid. Zaid\'s sister is Noor. How is Noor related to Farhan?', 'Daughter'],
    ['Hema is the daughter of Ganga. Ganga\'s husband is Mahesh. How is Mahesh related to Hema?', 'Father'],
    ['Kartik\'s aunt is Pushpa. Pushpa\'s husband is Dinesh. How is Dinesh related to Kartik?', 'Uncle'],
    ['Anil is the brother of Bhavna. Bhavna\'s son is Yash. How is Anil related to Yash?', 'Uncle'],
    ['Nandini\'s father-in-law is Rajan. Rajan\'s daughter is Simran. How is Simran related to Nandini?', 'Sister-in-law'],
    ['Ravi\'s mother is Sudha. Sudha\'s son is Naveen. How is Naveen related to Ravi?', 'Brother'],
    ['Tara is the granddaughter of Shanta. Shanta\'s son is Vikram. How is Vikram related to Tara?', 'Father'],
    ['Harsh is the nephew of Lalita. Lalita\'s husband is Nitin. How is Nitin related to Harsh?', 'Uncle'],
    ['Girish is the father of Rohan. Rohan\'s grandmother is Kamla. Kamla\'s son is Girish. How is Kamla related to Girish?', 'Mother'],
    ['Pooja\'s husband is Sahil. Sahil\'s sister is Mamta. How is Mamta related to Pooja?', 'Sister-in-law'],
    ['Jatin is the father of Ira. Ira\'s mother is Mona. How is Mona related to Jatin?', 'Wife'],
    ['Leena\'s father is Tarun. Tarun\'s wife is Rita. How is Rita related to Leena?', 'Mother'],
    ['Vikas is the son of Shobha. Shobha\'s husband is Deepak. Deepak\'s brother is Sunny. How is Sunny related to Vikas?', 'Uncle'],
    ['Gautam\'s mother-in-law is Lakshmi. Lakshmi\'s son is Hemant. How is Hemant related to Gautam?', 'Brother-in-law'],
    ['Asha\'s husband is Ravi. Ravi\'s father is Shyam. How is Shyam related to Asha?', 'Father-in-law'],
    ['Kiran is the brother of Pooja. Pooja\'s husband is Sameer. How is Sameer related to Kiran?', 'Brother-in-law'],
  ];
  const RELS2 = ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Son', 'Daughter', 'Cousin', 'Husband', 'Wife', 'Father-in-law', 'Mother-in-law', 'Brother-in-law', 'Sister-in-law'];
  out.push(...fromList(rng, 'blood-relations-l2', BLOOD2, ([p, a]) => mkQ(rng, 'blood-relations-l2', p, a, shuffle(rng, RELS2.filter((r) => r !== a)), `Following each family link in turn, ${a} is the correct relation.`, { difficulty: L2_DIFF })));

  return out;
}

export const RA_EXTRA_L1_QUESTIONS = l1Chapters();
export const RA_EXTRA_L2_QUESTIONS = l2Chapters();

export { rngFrom, between, pick, shuffle, mkQ, numWrong, pickTwenty, encode, fromList, ordinal, DAYS, MONTHS, MONTH_DAYS };
