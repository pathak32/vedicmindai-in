// Extra aptitude questions: 20 per chapter, for all 19 aptitude chapters.
// Rules compute the answers where possible. Critical reasoning and verbal items use curated lists.
import { rngFrom, pick, shuffle, mkQ, numWrong, pickTwenty, fromList } from './raAptitudeExtra.js';

const rng = rngFrom(4001);
const out = [];

// ---------------- Pre-K (emoji text, no image links) ----------------

const PREK_NAMES = [
  ['Pineapple', '🍍'], ['Watermelon', '🍉'], ['Mango', '🥭'], ['Pear', '🍐'], ['Lion', '🦁'], ['Horse', '🐴'],
  ['Pig', '🐷'], ['Duck', '🦆'], ['Frog', '🐸'], ['Tiger', '🐯'], ['Owl', '🦉'], ['Snake', '🐍'],
  ['Monkey', '🐵'], ['Turtle', '🐢'], ['Bee', '🐝'], ['Butterfly', '🦋'], ['Penguin', '🐧'], ['Giraffe', '🦒'],
  ['Bear', '🐻'], ['Zebra', '🦓'],
];
out.push(...pickTwenty('match-the-picture', PREK_NAMES.map(([name, em], i) => {
  const others = PREK_NAMES.filter((_, j) => j !== i).map(([n, e]) => `${e} ${n}`);
  return mkQ(rng, 'match-the-picture', `Which one matches the ${name}?`, `${em} ${name}`, shuffle(rng, others), `The ${name} picture matches the ${name}.`);
}), rng));

const FRUIT = [['Apple', '🍎'], ['Banana', '🍌'], ['Orange', '🍊'], ['Grapes', '🍇'], ['Strawberry', '🍓'], ['Watermelon', '🍉'], ['Pineapple', '🍍']];
const VEG = [['Carrot', '🥕'], ['Potato', '🥔'], ['Tomato', '🍅'], ['Corn', '🌽']];
const ANIMAL = [['Dog', '🐶'], ['Cat', '🐱'], ['Rabbit', '🐰'], ['Elephant', '🐘'], ['Cow', '🐄'], ['Fish', '🐟']];
const VEHICLE = [['Car', '🚗'], ['Bus', '🚌'], ['Bicycle', '🚲'], ['Train', '🚂']];
const GROUPS = [FRUIT, VEG, ANIMAL, VEHICLE];
const dnbCands = [];
for (let a = 0; a < GROUPS.length; a++) {
  for (let b = 0; b < GROUPS.length; b++) {
    if (a === b) continue;
    for (let i = 0; i < 12; i++) {
      const three = shuffle(rng, GROUPS[a]).slice(0, 3);
      const odd = pick(rng, GROUPS[b]);
      const opts = shuffle(rng, [...three, odd].map(([n, e]) => `${e} ${n}`));
      dnbCands.push({
        chapter: 'what-doesnt-belong',
        prompt: 'Which one does not belong?',
        options: opts,
        answer: `${odd[1]} ${odd[0]}`,
        exp: `${three.map(([n]) => n).join(', ')} are not in the same group as ${odd[0]}.`,
      });
    }
  }
}
out.push(...pickTwenty('what-doesnt-belong', dnbCands, rng));

const COUNT_EMOJI = ['🍎', '🍌', '🥕', '🍊', '🍇', '🍓', '🐶', '🐱', '🐟', '⭐'];
const countCands = [];
for (const em of COUNT_EMOJI) {
  for (let n = 2; n <= 6; n++) {
    const row = Array(n).fill(em).join(' ');
    countCands.push({
      chapter: 'count-the-objects',
      prompt: `How many are there? ${row}`,
      options: shuffle(rng, [String(n), String(n - 1), String(n + 1)]),
      answer: String(n),
      exp: `Counting one by one: there are ${n}.`,
    });
  }
}
out.push(...pickTwenty('count-the-objects', countCands, rng));

const SIZE = [['Ant', '🐜', 1], ['Ladybird', '🐞', 2], ['Mouse', '🐭', 3], ['Cat', '🐱', 4], ['Dog', '🐶', 5], ['Cow', '🐄', 6], ['Horse', '🐴', 7], ['Elephant', '🐘', 8], ['Whale', '🐋', 9]];
const bigCands = [];
for (const [n1, e1, r1] of SIZE) {
  for (const [n2, e2, r2] of SIZE) {
    if (r1 >= r2) continue;
    const small = `${e1} ${n1}`;
    const big = `${e2} ${n2}`;
    bigCands.push({
      chapter: 'big-or-small',
      prompt: 'Which one is BIGGER?',
      options: shuffle(rng, [small, big]),
      answer: big,
      exp: `${n2} is bigger than ${n1}.`,
    });
    bigCands.push({
      chapter: 'big-or-small',
      prompt: 'Which one is SMALLER?',
      options: shuffle(rng, [small, big]),
      answer: small,
      exp: `${n1} is smaller than ${n2}.`,
    });
  }
}
out.push(...pickTwenty('big-or-small', bigCands, rng));

const PATTERN_SETS = [['🔺', '🔷', '🔶', '⬛'], ['🌳', '🌸', '🍄', '🌻'], ['🐮', '🐷', '🐸', '🐵']];
const PATTERNS = [
  { name: 'repeats every 2 items', make: (s) => [s[0], s[1]] },
  { name: 'repeats every 3 items', make: (s) => [s[0], s[1], s[2]] },
  { name: 'repeats every 4 items (two of each)', make: (s) => [s[0], s[0], s[1], s[1]] },
];
const nextCands = [];
for (const set of PATTERN_SETS) {
  for (const pat of PATTERNS) {
    const base = pat.make(set);
    const L = base.length;
    for (let r = 0; r < L; r++) {
      const cycle = [...base.slice(r), ...base.slice(0, r)];
      const shown = Array.from({ length: 5 }, (_, i) => cycle[i % L]);
      const answer = cycle[5 % L];
      const wrong = set.filter((x) => x !== answer).slice(0, 2);
      nextCands.push({
        chapter: 'what-comes-next',
        prompt: `What comes next in the pattern? ${shown.join(' ')} ___`,
        options: shuffle(rng, [answer, ...wrong]),
        answer,
        exp: `The pattern ${pat.name}. Next comes ${answer}.`,
      });
    }
  }
}
out.push(...pickTwenty('what-comes-next', nextCands, rng));

// ---------------- Primary ----------------

const SYN = [['Happy', 'Glad'], ['Big', 'Large'], ['Quick', 'Fast'], ['Begin', 'Start'], ['Brave', 'Bold'], ['Clever', 'Smart'], ['Tiny', 'Small'], ['Cold', 'Chilly'], ['Shout', 'Yell'], ['Gift', 'Present'], ['Huge', 'Enormous'], ['Rich', 'Wealthy'], ['Silent', 'Quiet'], ['Journey', 'Trip'], ['Kind', 'Gentle'], ['Ancient', 'Old']];
const ANT = [['Hot', 'Cold'], ['Early', 'Late'], ['Strong', 'Weak'], ['Happy', 'Sad'], ['Light', 'Dark'], ['Full', 'Empty'], ['Open', 'Closed'], ['Win', 'Lose'], ['Tall', 'Short'], ['Clean', 'Dirty'], ['Begin', 'End'], ['Loud', 'Quiet'], ['Brave', 'Cowardly'], ['Ancient', 'Modern'], ['Rich', 'Poor']];
const wordCands = [];
SYN.forEach(([w, s], i) => {
  const wrong = SYN.filter((_, j) => j !== i).map(([, x]) => x);
  wordCands.push(mkQ(rng, 'word-meanings', `Which word means the same as '${w}'?`, s, shuffle(rng, wrong), `'${w}' and '${s}' mean the same thing.`));
});
ANT.forEach(([w, a], i) => {
  const wrong = ANT.filter((_, j) => j !== i).map(([, x]) => x);
  wordCands.push(mkQ(rng, 'word-meanings', `Which word means the opposite of '${w}'?`, a, shuffle(rng, wrong), `'${w}' and '${a}' are opposites.`));
});
out.push(...pickTwenty('word-meanings', wordCands, rng));

const POLY = ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'Nonagon', 'Decagon', 'Hendecagon', 'Dodecagon'];
const shapeCands = [];
for (let s = 0; s <= 4; s++) {
  const seq = [POLY[s], POLY[s + 1], POLY[s + 2]];
  const ans = POLY[s + 3];
  shapeCands.push(mkQ(rng, 'shape-patterns', `${seq.join(', ')}, ? — what comes next?`, ans, POLY.filter((x) => x !== ans).slice(0, 4), `Each shape has one more side than the one before. Next: ${ans}.`));
}
for (let s = 0; s <= 3; s++) {
  const seq = [POLY[s], POLY[s + 2], POLY[s + 4]];
  const ans = POLY[s + 6];
  shapeCands.push(mkQ(rng, 'shape-patterns', `${seq.join(', ')}, ? — what comes next?`, ans, POLY.filter((x) => x !== ans).slice(0, 4), `Each step skips one shape: the next one is ${ans}.`));
}
const ALT = ['Circle', 'Triangle', 'Square', 'Star', 'Heart', 'Diamond'];
for (let i = 0; i < ALT.length; i++) {
  for (let j = 0; j < ALT.length; j++) {
    if (i === j) continue;
    const x = ALT[i];
    const y = ALT[j];
    shapeCands.push(mkQ(rng, 'shape-patterns', `${x}, ${y}, ${x}, ${y}, ? — what comes next?`, x, ALT.filter((z) => z !== x).slice(0, 4), `The two shapes alternate, so the next one is ${x}.`));
  }
}
out.push(...pickTwenty('shape-patterns', shapeCands, rng));

const numPuzzleCands = [];
for (let n = 2; n <= 9; n++) {
  for (let u = 2; u <= 20; u += 3) {
    const m = n === 2 ? 6 : n - 1;
    numPuzzleCands.push(mkQ(rng, 'number-puzzles', `If ${n} pencils cost Rs. ${n * u}, how much do ${m} pencils cost (in Rs.)?`, m * u, numWrong(m * u), `One pencil costs Rs. ${u}, so ${m} pencils cost ${m} × ${u} = Rs. ${m * u}.`));
  }
}
for (let k = 2; k <= 5; k++) {
  for (let b = 2; b <= 12; b++) {
    numPuzzleCands.push(mkQ(rng, 'number-puzzles', `Two numbers add up to ${(k + 1) * b}. One is ${k} times the other. What is the larger number?`, k * b, numWrong(k * b), `The smaller number is ${b}, so the larger is ${k} × ${b} = ${k * b}.`));
  }
}
out.push(...pickTwenty('number-puzzles', numPuzzleCands, rng));

const speedCands = [];
for (let n = 12; n <= 49; n++) {
  speedCands.push(mkQ(rng, 'speed-maths-connect', `Find ${n} × 11 quickly. (Hint: split the digits and add the middle.)`, n * 11, numWrong(n * 11), `${n} × 11 = ${n * 11}.`));
}
for (let n = 15; n <= 95; n += 10) {
  speedCands.push(mkQ(rng, 'speed-maths-connect', `Find ${n}² quickly. (Hint: for numbers ending in 5, multiply the tens digit by the next number, then add 25.)`, n * n, numWrong(n * n), `${n}² = ${n * n}.`));
}
for (let n = 11; n <= 49; n++) {
  speedCands.push(mkQ(rng, 'speed-maths-connect', `Find ${n} × 99 quickly. (Hint: multiply by 100, then subtract the number.)`, n * 99, numWrong(n * 99), `${n} × 100 − ${n} = ${n * 99}.`));
}
for (let a = 1; a <= 9; a++) {
  for (let b = 1; b <= 3; b++) {
    const x = 100 - a;
    const y = 100 + b;
    speedCands.push(mkQ(rng, 'speed-maths-connect', `Find ${x} × ${y} using the base 100 method.`, x * y, numWrong(x * y), `Both numbers are near 100. The answer is ${x * y}.`));
  }
}
out.push(...pickTwenty('speed-maths-connect', speedCands, rng));

// ---------------- Middle ----------------

const VCATS = {
  fruits: ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Papaya'],
  vegetables: ['Carrot', 'Potato', 'Onion', 'Brinjal', 'Spinach', 'Peas'],
  animals: ['Dog', 'Cat', 'Cow', 'Lion', 'Tiger', 'Horse'],
  vehicles: ['Car', 'Bus', 'Bicycle', 'Train', 'Truck', 'Scooter'],
  colours: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'],
  instruments: ['Guitar', 'Violin', 'Flute', 'Piano', 'Drum', 'Sitar'],
};
const vnames = Object.keys(VCATS);
const vclsCands = [];
for (let i = 0; i < 300; i++) {
  const a = pick(rng, vnames);
  const b = pick(rng, vnames);
  if (a === b) continue;
  const three = shuffle(rng, VCATS[a]).slice(0, 3);
  const odd = pick(rng, VCATS[b]);
  vclsCands.push({
    chapter: 'verbal-classification',
    prompt: 'Which word does NOT belong in this group?',
    options: shuffle(rng, [...three, odd]),
    answer: odd,
    exp: `${three.join(', ')} are all ${a}. ${odd} is ${b}.`,
  });
}
out.push(...pickTwenty('verbal-classification', vclsCands, rng));

const pctCands = [];
for (const p of [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]) {
  for (let k = 1; k <= 9; k++) {
    const n = 100 * k;
    pctCands.push(mkQ(rng, 'percentage-puzzles', `What is ${p}% of ${n}?`, (p * n) / 100, numWrong((p * n) / 100), `${p}% of ${n} = ${(p * n) / 100}.`));
    pctCands.push(mkQ(rng, 'percentage-puzzles', `A number ${n} is increased by ${p}%. What is the new number?`, (n * (100 + p)) / 100, numWrong((n * (100 + p)) / 100), `${p}% of ${n} is ${(p * n) / 100}, so the new number is ${n} + ${(p * n) / 100} = ${(n * (100 + p)) / 100}.`));
  }
}
for (const p of [10, 20, 25, 50]) {
  for (let k = 2; k <= 9; k++) {
    const b = 100 * k;
    const a = (b * p) / 100;
    pctCands.push(mkQ(rng, 'percentage-puzzles', `${a} is what percent of ${b}?`, p, numWrong(p), `${a} ÷ ${b} × 100 = ${p}%.`));
  }
}
out.push(...pickTwenty('percentage-puzzles', pctCands, rng));

const SYLLOGISM = [
  ['Dogs', 'Mammals', 'Animals'], ['Roses', 'Flowers', 'Plants'], ['Sparrows', 'Birds', 'Animals'], ['Mangoes', 'Fruits', 'Foods'],
  ['Teachers', 'Professionals', 'Workers'], ['Cars', 'Vehicles', 'Machines'], ['Oaks', 'Trees', 'Plants'],
  ['Squares', 'Rectangles', 'Quadrilaterals'], ['Cats', 'Mammals', 'Animals'], ['Pianos', 'Instruments', 'Objects'],
  ['Lions', 'Cats', 'Mammals'], ['Apples', 'Fruits', 'Foods'],
];
const rcCands = [];
for (const [a, b, c] of SYLLOGISM) {
  rcCands.push({
    chapter: 'reasoning-connect',
    prompt: `All ${a} are ${b}. All ${b} are ${c}. Which conclusion must be true?`,
    options: shuffle(rng, [`All ${a} are ${c}`, `All ${c} are ${a}`, `No ${a} are ${c}`, `All ${b} are ${a}`]),
    answer: `All ${a} are ${c}`,
    exp: `Every ${a} is a ${b}, and every ${b} is a ${c}, so every ${a} is a ${c}.`,
  });
  rcCands.push({
    chapter: 'reasoning-connect',
    prompt: `Some ${a} are ${b}. All ${b} are ${c}. Which conclusion must be true?`,
    options: shuffle(rng, [`Some ${a} are ${c}`, `All ${c} are ${b}`, `No ${a} are ${c}`, `All ${a} are ${c}`]),
    answer: `Some ${a} are ${c}`,
    exp: `Some ${a} are ${b}, and all ${b} are ${c}, so those same ${a} are also ${c}.`,
  });
}
out.push(...pickTwenty('reasoning-connect', rcCands, rng));

// ---------------- Secondary ----------------

const diCands = [];
for (const k of [2, 3, 4, 5, 6, 7, 8, 9]) {
  for (const p of [10, 20, 25, 50]) {
    const feb = 100 * k;
    const mar = (feb * (100 + p)) / 100;
    diCands.push(mkQ(rng, 'data-interpretation', `A shop's sales were Rs. ${feb} in February and Rs. ${mar} in March. What is the percentage growth from February to March?`, p, numWrong(p), `Growth = (${mar} − ${feb}) ÷ ${feb} × 100 = ${p}%.`));
  }
}
for (let k = 1; k <= 12; k++) {
  const jan = 100 * (k + 1);
  const feb = 100 * (k + 3);
  const mar = 100 * (k + 6);
  diCands.push(mkQ(rng, 'data-interpretation', `Sales were Rs. ${jan} in January, Rs. ${feb} in February and Rs. ${mar} in March. What is the total sales for the three months (in Rs.)?`, jan + feb + mar, numWrong(jan + feb + mar), `Add the three months: ${jan} + ${feb} + ${mar} = ${jan + feb + mar}.`));
}
out.push(...pickTwenty('data-interpretation', diCands, rng));

const VERBAL_REL = [
  ['Calf', 'Cow', 'Foal', 'Horse'], ['Cub', 'Lion', 'Kid', 'Goat'], ['Tadpole', 'Frog', 'Caterpillar', 'Butterfly'],
  ['Sugar', 'Sweet', 'Lemon', 'Sour'], ['Ice', 'Cold', 'Fire', 'Hot'], ['Snow', 'White', 'Coal', 'Black'],
  ['Metre', 'Length', 'Kilogram', 'Weight'], ['Litre', 'Volume', 'Second', 'Time'], ['Scissors', 'Cut', 'Needle', 'Stitch'],
  ['Doctor', 'Patient', 'Teacher', 'Student'], ['Eagle', 'Soar', 'Fish', 'Swim'], ['Tiger', 'Jungle', 'Penguin', 'Antarctica'],
  ['Camel', 'Desert', 'Polar bear', 'Arctic'], ['Bee', 'Hive', 'Ant', 'Anthill'], ['Gold', 'Metal', 'Oak', 'Tree'],
  ['Rose', 'Flower', 'Pine', 'Tree'], ['Teacher', 'Chalk', 'Painter', 'Brush'], ['Chef', 'Spatula', 'Carpenter', 'Saw'],
  ['Puppy', 'Dog', 'Kitten', 'Cat'], ['Wood', 'Carpenter', 'Clay', 'Potter'],
];
out.push(...fromList(rng, 'verbal-reasoning', VERBAL_REL, ([a, b, c, d], i) => {
  const wrong = VERBAL_REL.filter((_, j) => j !== i).map((x) => x[3]);
  return mkQ(rng, 'verbal-reasoning', `${a} : ${b} :: ${c} : ?`, d, shuffle(rng, wrong), `${a} and ${b} have the same relation as ${c} and ${d}.`);
}));

const cubeCands = [];
for (let n = 3; n <= 7; n++) {
  const total = n ** 3;
  const inner = (n - 2) ** 3;
  cubeCands.push(mkQ(rng, '3d-spatial-secondary', `A ${n}×${n}×${n} cube is painted on all outer faces, then cut into ${total} unit cubes. How many have exactly 2 painted faces?`, 12 * (n - 2), numWrong(12 * (n - 2)), `Cubes on the edges, not at the corners, have 2 painted faces: 12 × (${n} − 2) = ${12 * (n - 2)}.`));
  cubeCands.push(mkQ(rng, '3d-spatial-secondary', `A ${n}×${n}×${n} cube is painted on all outer faces, then cut into ${total} unit cubes. How many have exactly 1 painted face?`, 6 * (n - 2) ** 2, numWrong(6 * (n - 2) ** 2), `Each face has (${n} − 2)² = ${(n - 2) ** 2} inner cubes, and 6 faces give ${6 * (n - 2) ** 2}.`));
  cubeCands.push(mkQ(rng, '3d-spatial-secondary', `A ${n}×${n}×${n} cube is painted on all outer faces, then cut into ${total} unit cubes. How many have no painted face?`, inner, numWrong(inner), `The inside block is (${n} − 2)³ = ${inner}.`));
  cubeCands.push(mkQ(rng, '3d-spatial-secondary', `A ${n}×${n}×${n} cube is painted on all outer faces, then cut into ${total} unit cubes. How many have at least one painted face?`, total - inner, numWrong(total - inner), `${total} − ${inner} = ${total - inner}.`));
}
out.push(...pickTwenty('3d-spatial-secondary', cubeCands, rng));

const avgCands = [];
for (let M = 10; M <= 40; M++) {
  for (let x = 1; x <= 60; x++) {
    if ((5 * M + x) % 6 === 0) {
      const ans = (5 * M + x) / 6;
      avgCands.push(mkQ(rng, 'reasoning-connect-secondary', `The average of 5 numbers is ${M}. If the number ${x} is added, what is the new average?`, ans, numWrong(ans), `Total = 5 × ${M} + ${x} = ${5 * M + x}. Divided by 6 gives ${ans}.`));
    }
    if ((4 * M - x) % 3 === 0 && x < 4 * M) {
      const ans = (4 * M - x) / 3;
      avgCands.push(mkQ(rng, 'reasoning-connect-secondary', `The average of 4 numbers is ${M}. If the number ${x} is removed, what is the average of the remaining numbers?`, ans, numWrong(ans), `Total = 4 × ${M} = ${4 * M}. Remove ${x}: ${4 * M - x} left, divided by 3 gives ${ans}.`));
    }
  }
}
out.push(...pickTwenty('reasoning-connect-secondary', avgCands, rng));

// ---------------- Intermediate ----------------

const CRITICAL = [
  ['The new park opened last year, and crime in the area has fallen since then. So the park reduced crime.', ['Crime also fell in nearby areas that have no park', 'Many residents enjoy the park', 'The park cost a lot to build', 'The park is open every day'], 0],
  ['Students who eat breakfast score higher in exams, so schools should serve breakfast to raise scores.', ['Students who eat breakfast also sleep longer and study more', 'Breakfast is a popular meal', 'Schools have kitchens', 'Exams are held in the morning'], 0],
  ['Sales rose after our ad campaign, so the campaign caused the rise.', ['Competitors raised their prices during the same period', 'The ad was shown on television', 'The company sells many products', 'Customers liked the colour of the ad'], 0],
  ['All students in Class 8 passed this year, so the new teaching method works.', ['This year\'s exam was much easier than last year\'s', 'Class 8 has 30 students', 'Teachers attended a workshop', 'The method uses charts'], 0],
  ['Our rival\'s software failed last month, so our software is now the best on the market.', ['Other rivals\' software is also performing well', 'Our software has many features', 'It was launched in March', 'Customers were surveyed'], 0],
  ['The city now has more ice cream shops, so ice cream sales are higher than ever.', ['Shops now sell fewer ice creams each on average than before', 'The shops are painted bright colours', 'Ice cream is sweet', 'The city is large'], 0],
  ['Mohan got sick after eating at the new restaurant, so the restaurant\'s food is unsafe.', ['Mohan has eaten there many times with no problems', 'The restaurant has a blue sign', 'Mohan is 40 years old', 'The restaurant opened on a Monday'], 0],
  ['Most successful entrepreneurs wake up early, so waking early will make you successful.', ['Many successful entrepreneurs also wake up late', 'Early waking is a common phrase', 'Entrepreneurship is hard work', 'Some people wake up at noon'], 0],
  ['The school library bought new books, so students will read more this year.', ['Last year students borrowed no books even when the library had many', 'The books have bright covers', 'The library is on the second floor', 'The books cost Rs. 500'], 0],
  ['Rainfall was high last year, so the crops grew well. We should plant more crops this year.', ['Last year\'s rains were followed by pests that destroyed the crops', 'Crops need sunlight as well as rain', 'Farmers are busy in summer', 'The farm is large'], 0],
  ['The new road reduced traffic, so people prefer the new road.', ['Traffic also fell on the old road, for reasons unrelated to the new road', 'The road is well lit', 'Roads are important for towns', 'The road has three lanes'], 0],
  ['Players who train with the new coach win more matches, so the coach is excellent.', ['The coach trained players who were already the best winners', 'The coach has a long career', 'Training happens in the morning', 'Players enjoy the sport'], 0],
  ['Our app has 10 million downloads, so it must be the best learning app.', ['Many downloads were free and most users stopped after one day', 'The app is available in Hindi', 'The app icon is green', 'Downloads started in June'], 0],
  ['Honest people never lie, and Rahul never lies, so Rahul is honest.', ['Rahul once told a lie to his teacher about homework', 'Rahul is tall', 'Honest people are rare', 'Rahul lives nearby'], 0],
  ['Bottled water is safer than tap water, so everyone should drink only bottled water.', ['Tap water in the city is tested every day and meets safety standards', 'Bottled water comes in plastic bottles', 'Water is essential for health', 'Bottles are expensive'], 0],
  ['Profits doubled after the company hired a new CEO, so the CEO caused the increase.', ['The whole industry also doubled its profits in the same period', 'The CEO has an MBA', 'The company has 500 staff', 'The new CEO is 45 years old'], 0],
  ['Children who play video games do poorly at school, so video games harm learning.', ['Children who struggle at school may play more games to escape pressure', 'Video games have good graphics', 'Schools have computer labs', 'Many children own tablets'], 0],
  ['The festival brought many tourists, so tourism is now the town\'s main source of income.', ['Most visitors come for one day and spend very little', 'The festival has live music', 'The town is on a river', 'The hotels are clean'], 0],
  ['The government spent money on roads, so the economy grew.', ['The economy grew at the same rate in regions where no road was built', 'Roads are made of asphalt', 'Officials travel by car', 'The budget was announced in February'], 0],
  ['Solar panels worked well in one village, so we should adopt solar power everywhere.', ['That village is unusually sunny, unlike most places', 'Solar panels are blue', 'Villages need electricity', 'The panels were installed in May'], 0],
];
out.push(...CRITICAL.map(([arg, opts, idx]) => ({
  chapter: 'critical-reasoning',
  prompt: `Which statement, if true, would most WEAKEN the argument: "${arg}"?`,
  options: shuffle(rng, opts),
  answer: opts[idx],
  exp: `"${opts[idx]}" gives an alternative explanation or a counterexample, which weakens the argument.`,
})));

const dsCands = [];
for (let k = 2; k <= 9; k++) {
  for (let a = k - 2; a <= k + 2; a++) {
    for (let b = k - 2; b <= k + 3; b++) {
      const s1 = a >= k;
      const s2 = b <= k + 1;
      let ans;
      if (s1 && s2) ans = 'Each statement ALONE is sufficient';
      else if (s1) ans = 'Statement 1 ALONE is sufficient, Statement 2 is not';
      else if (s2) ans = 'Statement 2 ALONE is sufficient, Statement 1 is not';
      else ans = 'NOT sufficient, even using both statements together';
      const opts = ['Statement 1 ALONE is sufficient, Statement 2 is not', 'Statement 2 ALONE is sufficient, Statement 1 is not', 'Each statement ALONE is sufficient', 'NOT sufficient, even using both statements together'];
      dsCands.push({
        chapter: 'data-sufficiency',
        prompt: `Is x > ${k}? (1) x > ${a}  (2) x < ${b}  (x is an integer)`,
        options: shuffle(rng, opts),
        answer: ans,
        exp: `Statement 1 alone ${s1 ? 'settles' : 'does not settle'} the question. Statement 2 alone ${s2 ? 'settles' : 'does not settle'} the question.`,
      });
    }
  }
}
out.push(...pickTwenty('data-sufficiency', dsCands, rng));

const adiCands = [];
const CITIES = ['Delhi', 'Mumbai'];
for (let u1 = 100; u1 <= 300; u1 += 50) {
  for (let u2 = 100; u2 <= 300; u2 += 100) {
    for (let p1 = 200; p1 <= 400; p1 += 100) {
      for (let p2 = 200; p2 <= 400; p2 += 100) {
        const r1 = u1 * p1;
        const r2 = u2 * p2;
        const ans = r1 > r2 ? CITIES[0] : r2 > r1 ? CITIES[1] : 'Both are equal';
        adiCands.push({
          chapter: 'advanced-data-interpretation',
          prompt: `Table 1 (units sold): Delhi ${u1}, Mumbai ${u2}. Table 2 (price per unit): Delhi Rs. ${p1}, Mumbai Rs. ${p2}. Which city had higher revenue?`,
          options: shuffle(rng, ['Delhi', 'Mumbai', 'Both are equal', 'Cannot be determined']),
          answer: ans,
          exp: `Revenue = units × price. Delhi: ${r1}. Mumbai: ${r2}.`,
        });
      }
    }
  }
}
out.push(...pickTwenty('advanced-data-interpretation', adiCands, rng));

export const APTITUDE_EXTRA_QUESTIONS = out;
