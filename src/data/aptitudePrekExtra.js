// Extra Pre-K aptitude questions, so each Pre-K chapter reaches 20 questions.
// These use emoji in the text and plain text options, so they need no image links.
// The image-based questions already in aptitudeQuizBank.js are kept as they are.
// Every answer is checked against its options at the bottom of this file.

const mc = (chapter, prompt, options, answer, exp) => ({ chapter, prompt, options, answer, exp });

const MATCH = [
  ['Apple', ['🍎 Apple', '🍌 Banana', '🥕 Carrot'], 0],
  ['Banana', ['🍌 Banana', '🍊 Orange', '🍎 Apple'], 0],
  ['Carrot', ['🍓 Strawberry', '🥕 Carrot', '🍇 Grapes'], 1],
  ['Dog', ['🐶 Dog', '🐱 Cat', '🐰 Rabbit'], 0],
  ['Cat', ['🐰 Rabbit', '🐶 Dog', '🐱 Cat'], 2],
  ['Fish', ['🐄 Cow', '🐟 Fish', '🐦 Bird'], 1],
  ['Bird', ['🐦 Bird', '🐄 Cow', '🐟 Fish'], 0],
  ['Cow', ['🐘 Elephant', '🐄 Cow', '🐶 Dog'], 1],
  ['Star', ['🌞 Sun', '🌙 Moon', '⭐ Star'], 2],
  ['Moon', ['⭐ Star', '🌙 Moon', '🌞 Sun'], 1],
  ['Sun', ['🌞 Sun', '⭐ Star', '🌙 Moon'], 0],
  ['Strawberry', ['🍇 Grapes', '🍊 Orange', '🍓 Strawberry'], 2],
  ['Grapes', ['🍇 Grapes', '🍓 Strawberry', '🍊 Orange'], 0],
  ['Orange', ['🍌 Banana', '🍊 Orange', '🍓 Strawberry'], 1],
  ['Elephant', ['🐜 Ant', '🐭 Mouse', '🐘 Elephant'], 2],
  ['Ant', ['🐘 Elephant', '🐭 Mouse', '🐜 Ant'], 2],
];

const DOES_NOT_BELONG = [
  [['🍎 Apple', '🍌 Banana', '🐶 Dog', '🍊 Orange'], '🐶 Dog', 'Apple, Banana and Orange are fruits. The dog is an animal.'],
  [['🐱 Cat', '🐘 Elephant', '🥕 Carrot', '🐰 Rabbit'], '🥕 Carrot', 'Cat, Elephant and Rabbit are animals. The carrot is a vegetable.'],
  [['🚗 Car', '🚌 Bus', '🚲 Bicycle', '🍎 Apple'], '🍎 Apple', 'Car, Bus and Bicycle are vehicles. The apple is a fruit.'],
  [['🌳 Tree', '🌸 Flower', '🌱 Plant', '🚗 Car'], '🚗 Car', 'Tree, Flower and Plant grow in the ground. The car does not.'],
  [['🔴 Red', '🔵 Blue', '🟢 Green', '🍎 Apple'], '🍎 Apple', 'Red, Blue and Green are colours. The apple is a fruit.'],
  [['🐟 Fish', '🐦 Bird', '🐄 Cow', '🥕 Carrot'], '🥕 Carrot', 'Fish, Bird and Cow are animals. The carrot is a vegetable.'],
  [['🍉 Watermelon', '🍇 Grapes', '🍓 Strawberry', '🐘 Elephant'], '🐘 Elephant', 'Watermelon, Grapes and Strawberry are fruits. The elephant is an animal.'],
  [['🌞 Sun', '🌙 Moon', '⭐ Star', '🍌 Banana'], '🍌 Banana', 'Sun, Moon and Star are in the sky. The banana is a fruit.'],
  [['🏠 House', '🏫 School', '🏥 Hospital', '🐶 Dog'], '🐶 Dog', 'House, School and Hospital are buildings. The dog is an animal.'],
  [['🎈 Balloon', '⚽ Ball', '🧸 Teddy Bear', '🍕 Pizza'], '🍕 Pizza', 'Balloon, Ball and Teddy Bear are toys. Pizza is food.'],
  [['🥛 Milk', '🧃 Juice', '🍞 Bread', '📝 Notebook'], '📝 Notebook', 'Milk, Juice and Bread are food and drink. A notebook is for writing.'],
  [['🍰 Cake', '🍪 Cookie', '🍩 Donut', '🐄 Cow'], '🐄 Cow', 'Cake, Cookie and Donut are sweet food. The cow is an animal.'],
  [['🚂 Train', '🚢 Ship', '🚁 Helicopter', '🍉 Watermelon'], '🍉 Watermelon', 'Train, Ship and Helicopter travel. The watermelon is a fruit.'],
  [['🐜 Ant', '🦋 Butterfly', '🐞 Ladybird', '🌷 Tulip'], '🌷 Tulip', 'Ant, Butterfly and Ladybird are insects. The tulip is a flower.'],
  [['👕 Shirt', '👖 Trousers', '🧦 Socks', '🍳 Pan'], '🍳 Pan', 'Shirt, Trousers and Socks are clothes. A pan is for cooking.'],
  [['🧊 Ice', '💧 Water', '🌊 Sea', '🔥 Fire'], '🔥 Fire', 'Ice, Water and Sea are all water. Fire is not.'],
];

const COUNT_EMOJI = [
  ['🍎', 'Apples'], ['🍌', 'Bananas'], ['🥕', 'Carrots'], ['🍊', 'Oranges'], ['🍇', 'Grapes'],
  ['🍓', 'Strawberries'], ['🐶', 'Dogs'], ['🐱', 'Cats'], ['🐟', 'Fish'], ['⭐', 'Stars'],
];

const BIG_SMALL = [
  ['BIGGER', ['🐘 Elephant', '🐜 Ant'], '🐘 Elephant', 'An elephant is much bigger than an ant.'],
  ['SMALLER', ['🐶 Dog', '🐜 Ant'], '🐜 Ant', 'An ant is much smaller than a dog.'],
  ['BIGGER', ['🍓 Strawberry', '🍉 Watermelon'], '🍉 Watermelon', 'A watermelon is much bigger than a strawberry.'],
  ['SMALLER', ['🍍 Pineapple', '🍇 Grapes'], '🍇 Grapes', 'Grapes are much smaller than a pineapple.'],
  ['BIGGER', ['🚲 Bicycle', '🚌 Bus'], '🚌 Bus', 'A bus is much bigger than a bicycle.'],
  ['SMALLER', ['🚌 Bus', '🚗 Car'], '🚗 Car', 'A car is smaller than a bus.'],
  ['BIGGER', ['🚪 Door', '🏠 House'], '🏠 House', 'A house is much bigger than a door.'],
  ['SMALLER', ['🌳 Tree', '🌱 Sprout'], '🌱 Sprout', 'A sprout is much smaller than a tree.'],
  ['BIGGER', ['🐟 Fish', '🐋 Whale'], '🐋 Whale', 'A whale is much bigger than a fish.'],
  ['SMALLER', ['🐄 Cow', '🐭 Mouse'], '🐭 Mouse', 'A mouse is much smaller than a cow.'],
  ['BIGGER', ['🌙 Moon', '🌍 Earth'], '🌍 Earth', 'Earth is much bigger than the Moon.'],
  ['SMALLER', ['🦒 Giraffe', '🐞 Ladybird'], '🐞 Ladybird', 'A ladybird is much smaller than a giraffe.'],
  ['BIGGER', ['🐰 Rabbit', '🐻 Bear'], '🐻 Bear', 'A bear is much bigger than a rabbit.'],
  ['SMALLER', ['🥥 Coconut', '🥚 Egg'], '🥚 Egg', 'An egg is smaller than a coconut.'],
  ['BIGGER', ['🍒 Cherry', '🥥 Coconut'], '🥥 Coconut', 'A coconut is much bigger than a cherry.'],
  ['SMALLER', ['🎃 Pumpkin', '🍎 Apple'], '🍎 Apple', 'An apple is smaller than a pumpkin.'],
  ['BIGGER', ['🐜 Ant', '🦅 Eagle'], '🦅 Eagle', 'An eagle is much bigger than an ant.'],
];

// Pattern sets for "what comes next". Each set has at least three items.
const PATTERN_SETS = [
  ['🔴', '🔵', '🟢', '🟡'],
  ['🍎', '🍌', '🍇', '🍊'],
  ['🐶', '🐱', '🐰', '🐟'],
];

function buildNextQuestions() {
  const items = [];
  for (let k = 0; k < 16; k++) {
    const set = PATTERN_SETS[k % 3];
    const length = k % 2 === 0 ? 2 : 3;
    const cycle = set.slice(0, length);
    const shown = Array.from({ length: 5 }, (_, i) => cycle[i % length]);
    const answer = cycle[5 % length];
    const distractors = set.filter((s) => s !== answer).slice(0, 2);
    const options = k % 3 === 0 ? [answer, ...distractors] : k % 3 === 1 ? [distractors[0], answer, distractors[1]] : [...distractors, answer];
    items.push(
      mc(
        'what-comes-next',
        `What comes next in the pattern? ${shown.join(' ')} ___`,
        options,
        answer,
        `The pattern repeats every ${length} items. Next comes ${answer}.`,
      ),
    );
  }
  return items;
}

function buildCountQuestions() {
  return Array.from({ length: 16 }, (_, i) => {
    const [emoji, name] = COUNT_EMOJI[i % COUNT_EMOJI.length];
    const n = 2 + (i % 4);
    const row = Array(n).fill(emoji).join(' ');
    const options = i % 3 === 0 ? [String(n - 1), String(n), String(n + 1)] : i % 3 === 1 ? [String(n), String(n + 1), String(n - 1)] : [String(n + 1), String(n - 1), String(n)];
    return mc('count-the-objects', `How many ${name} are there? ${row}`, options, String(n), `Counting one by one: there are ${n}.`);
  });
}

export const APTITUDE_PREK_EXTRA_QUESTIONS = [
  ...MATCH.map(([name, options, idx]) =>
    mc('match-the-picture', `Which one matches the ${name}?`, options, options[idx], `The ${name} matches the ${options[idx].split(' ').slice(1).join(' ')}.`),
  ),
  ...DOES_NOT_BELONG.map(([options, answer, exp]) => mc('what-doesnt-belong', 'Which one does not belong?', options, answer, exp)),
  ...buildCountQuestions(),
  ...BIG_SMALL.map(([dir, options, answer, exp]) =>
    mc('big-or-small', `Which one is ${dir}?`, options, answer, exp),
  ),
  ...buildNextQuestions(),
];

// Check every entry: the answer must be one of the options, and options must be unique.
for (const q of APTITUDE_PREK_EXTRA_QUESTIONS) {
  if (!q.options.includes(q.answer)) throw new Error(`Answer not in options: ${q.prompt}`);
  if (new Set(q.options).size !== q.options.length) throw new Error(`Duplicate options: ${q.prompt}`);
}
