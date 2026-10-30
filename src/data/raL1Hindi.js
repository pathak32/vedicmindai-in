// Hindi text for Reasoning & Aptitude Level 1, odd-one-out chapter.
// Words map to [Hindi word, category key]. Questions are rebuilt as { en, hi }
// objects; the English answer stays as the scoring key.

const CAT = {
  fruit: ['फल', 'फल'],
  vegetable: ['सब्ज़ियाँ', 'सब्ज़ी'],
  animal: ['जानवर', 'जानवर'],
  bird: ['पक्षी', 'पक्षी'],
  insect: ['कीड़े', 'कीड़ा'],
  furniture: ['फ़र्नीचर', 'फ़र्नीचर'],
  instrument: ['वाद्य यंत्र', 'वाद्य यंत्र'],
  vehicle: ['वाहन', 'वाहन'],
  colour: ['रंग', 'रंग'],
  shape: ['आकृतियाँ', 'आकृति'],
  stationery: ['स्टेशनरी की चीज़ें', 'स्टेशनरी की चीज़'],
  flower: ['फूल', 'फूल'],
  city: ['शहर', 'शहर'],
  day: ['दिन', 'दिन'],
  month: ['महीने', 'महीना'],
  sport: ['खेल', 'खेल'],
  dairy: ['डेयरी उत्पाद', 'डेयरी उत्पाद'],
  grain: ['अनाज', 'अनाज'],
  profession: ['पेशे', 'पेशा'],
  plant: ['पौधे', 'पौधा'],
};

const W = {
  Apple: ['सेब', 'fruit'], Banana: ['केला', 'fruit'], Mango: ['आम', 'fruit'],
  Orange: ['संतरा', 'fruit'], Papaya: ['पपीता', 'fruit'],
  Carrot: ['गाजर', 'vegetable'], Tomato: ['टमाटर', 'vegetable'], Potato: ['आलू', 'vegetable'],
  Onion: ['प्याज़', 'vegetable'], Cabbage: ['पत्तागोभी', 'vegetable'], Radish: ['मूली', 'vegetable'],
  Peas: ['मटर', 'vegetable'], Spinach: ['पालक', 'vegetable'], Brinjal: ['बैंगन', 'vegetable'],
  Dog: ['कुत्ता', 'animal'], Cat: ['बिल्ली', 'animal'], Cow: ['गाय', 'animal'], Lion: ['शेर', 'animal'],
  Elephant: ['हाथी', 'animal'], Tiger: ['बाघ', 'animal'], Rabbit: ['खरगोश', 'animal'], Horse: ['घोड़ा', 'animal'],
  Eagle: ['उकाब', 'bird'], Sparrow: ['गौरैया', 'bird'], Crow: ['कौआ', 'bird'], Pigeon: ['कबूतर', 'bird'],
  Duck: ['बत्तख', 'bird'], Peacock: ['मोर', 'bird'], Parrot: ['तोता', 'bird'], Owl: ['उल्लू', 'bird'],
  Butterfly: ['तितली', 'insect'], Ant: ['चींटी', 'insect'], Bee: ['मधुमक्खी', 'insect'],
  Table: ['मेज़', 'furniture'], Chair: ['कुर्सी', 'furniture'], Shelf: ['शेल्फ़', 'furniture'],
  Sofa: ['सोफ़ा', 'furniture'], Bed: ['बिस्तर', 'furniture'], Stool: ['स्टूल', 'furniture'], Desk: ['डेस्क', 'furniture'],
  Guitar: ['गिटार', 'instrument'], Violin: ['वायलिन', 'instrument'], Flute: ['बाँसुरी', 'instrument'],
  Piano: ['पियानो', 'instrument'], Drum: ['ढोल', 'instrument'], Tabla: ['तबला', 'instrument'],
  Harmonium: ['हारमोनियम', 'instrument'],
  Car: ['कार', 'vehicle'], Bus: ['बस', 'vehicle'], Bicycle: ['साइकिल', 'vehicle'],
  Red: ['लाल', 'colour'], Blue: ['नीला', 'colour'], Green: ['हरा', 'colour'],
  Circle: ['वृत्त', 'shape'], Square: ['वर्ग', 'shape'], Triangle: ['त्रिभुज', 'shape'], Rectangle: ['आयत', 'shape'],
  Pen: ['पेन', 'stationery'], Pencil: ['पेंसिल', 'stationery'], Eraser: ['रबर', 'stationery'],
  Rose: ['गुलाब', 'flower'], Lily: ['लिली', 'flower'], Lotus: ['कमल', 'flower'], Sunflower: ['सूरजमुखी', 'flower'],
  Delhi: ['दिल्ली', 'city'], Mumbai: ['मुंबई', 'city'], Chennai: ['चेन्नई', 'city'],
  Monday: ['सोमवार', 'day'], Tuesday: ['मंगलवार', 'day'], Friday: ['शुक्रवार', 'day'],
  January: ['जनवरी', 'month'],
  Cricket: ['क्रिकेट', 'sport'], Football: ['फ़ुटबॉल', 'sport'], Hockey: ['हॉकी', 'sport'],
  Milk: ['दूध', 'dairy'], Curd: ['दही', 'dairy'], Cheese: ['पनीर', 'dairy'],
  Wheat: ['गेहूँ', 'grain'], Rice: ['चावल', 'grain'], Corn: ['मक्का', 'grain'],
  Doctor: ['डॉक्टर', 'profession'], Teacher: ['शिक्षक', 'profession'], Engineer: ['इंजीनियर', 'profession'],
  Tree: ['पेड़', 'plant'],
  // Words with no group of their own, used only as the odd one out.
  India: ['भारत', null], School: ['स्कूल', null], Bread: ['ब्रेड', null], Cotton: ['कपास', null],
  Painting: ['चित्रकारी', null], Cloud: ['बादल', null], Happy: ['ख़ुश', null], Sphere: ['गोला', null],
  Sun: ['सूरज', null], Moon: ['चाँद', null], Star: ['तारा', null], River: ['नदी', null],
};

// Exact English-to-Hindi explanations for the items whose reason is not a plain category.
const CUSTOM = {
  'Which one does not belong: Delhi, Mumbai, India, Chennai?': { exp: ['दिल्ली, मुंबई और चेन्नई सभी शहर हैं। भारत एक देश है, यह अलग श्रेणी का है।', 'Delhi, Mumbai, and Chennai are all cities. India is a country — it belongs to a different category.'] },
  'Which one does not belong: Red, Blue, Green, Happy?': { exp: ['लाल और नीला रंग हैं। ख़ुश एक भावना है, रंग नहीं।', 'Red and Blue are colours. Happy is a feeling, not a colour.'] },
  'Which one does not belong: Circle, Square, Triangle, Cloud?': { exp: ['वृत्त और वर्ग तय आकृतियाँ हैं। बादल का कोई निश्चित आकार नहीं होता।', 'Circle and Square are defined geometric shapes. A cloud has no fixed shape.'] },
  'Which one does not belong: Milk, Curd, Cheese, Bread?': { exp: ['दूध, दही और पनीर डेयरी उत्पाद हैं। ब्रेड गेहूँ के आटे से बनती है, दूध से नहीं।', 'Milk and Cheese are dairy products. Bread is made from wheat flour, not milk.'] },
  'Which one does not belong: Doctor, Teacher, Engineer, School?': { exp: ['डॉक्टर और इंजीनियर पेशे हैं। स्कूल एक जगह है, पेशा नहीं।', 'Doctor and Engineer are professions (people). School is a place, not a profession.'] },
  'Which one does not belong: Triangle, Rectangle, Square, Sphere?': { exp: ['त्रिभुज और वर्ग समतल, 2D आकृतियाँ हैं। गोला ठोस, 3D आकार है।', 'Triangle and Square are flat, 2D shapes. Sphere is a solid, 3D shape.'] },
  'Which one does not belong: Sun, Moon, Star, River?': { exp: ['सूरज और तारा आकाश में दिखने वाली वस्तुएँ हैं। नदी पृथ्वी की सतह का भू-आकार है।', 'Sun and Star are objects seen in the sky. River is a landform on Earth\'s surface.'] },
  'Which one does not belong: Wheat, Rice, Corn, Cotton?': { exp: ['गेहूँ और मक्का खाए जाने वाले अनाज हैं। कपास एक रेशेदार फसल है, जिसे खाया नहीं जाता।', 'Wheat and Corn are food grains people eat. Cotton is a fibre crop, not eaten as food.'] },
  'Which one does not belong: Piano, Painting?': null,
  'Which one does not belong: Piano, Guitar, Drum, Painting?': { exp: ['पियानो और ढोल वाद्य यंत्र हैं। चित्रकारी एक दृश्य कला है, वाद्य यंत्र नहीं।', 'Piano and Drum are musical instruments. Painting is a visual art form, not an instrument.'] },
  'Which one does not belong: 2, 4, 7, 8?': { exp: ['2, 4 और 8 सम संख्याएँ हैं। 7 एक विषम संख्या है, इसलिए यह नहीं जुड़ता।', '2, 4, and 8 are all even numbers. 7 is an odd number — it doesn\'t belong.'] },
  'Which one does not belong: Ant, Bee, Spider, Elephant?': { exp: ['चींटी और मधुमक्खी कीड़े हैं। हाथी स्तनधारी है, बहुत बड़ा और संरचना में अलग।', 'Ant and Bee are insects. Elephant is a mammal, much larger and structurally different.'] },
};

const EN_EXP_SEP = /, | and /;

function listHi(words) {
  return words.map((w) => (W[w] ? W[w][0] : w));
}

function joinHi(parts) {
  if (parts.length <= 1) return parts.join('');
  return parts.slice(0, -1).join(', ') + ' और ' + parts[parts.length - 1];
}

// Rebuilds one odd-one-out question as bilingual. Returns the question unchanged if it
// is not an odd-one-out question or an unknown word has no Hindi entry.
export function localizeOddOneOut(q) {
  if (q.chapter !== 'odd-one-out' || typeof q.prompt !== 'string') return q;
  const custom = CUSTOM[q.prompt];
  const match = q.prompt.match(/^Which one does not belong: (.*)\?$/);
  if (!match) return q;
  const words = match[1].split(', ');
  const optionsHi = q.options.map((o) => ({ en: o, hi: W[o] ? W[o][0] : o }));
  const promptHi = 'इनमें से कौन सा नहीं जुड़ता: ' + listHi(words).join(', ') + '?';
  let expHi;
  if (custom) {
    expHi = custom.exp[0];
  } else {
    const others = q.options.filter((o) => o !== q.answer);
    const group = others.map((o) => W[o] && W[o][1]).find(Boolean);
    const answerCat = W[q.answer] && W[q.answer][1];
    if (!group || !answerCat || others.some((o) => !W[o])) return q;
    expHi = `${joinHi(others.map((o) => W[o][0]))} सभी ${CAT[group][0]} हैं। ${W[q.answer][0]} ${CAT[answerCat][1]} है, इसलिए यह नहीं जुड़ता।`;
  }
  return {
    ...q,
    prompt: { en: q.prompt, hi: promptHi },
    options: optionsHi,
    exp: { en: q.exp, hi: expHi },
  };
}

// Number series: the rule is worked out from the numbers themselves, so every question
// in the chapter is translated the same way. Returns the question unchanged if the
// computed next value does not match the stored answer.
export function localizeNumberSeries(q) {
  if (q.chapter !== 'number-series-basic' || typeof q.prompt !== 'string') return q;
  const body = q.prompt.replace(/^What comes next: /, '').replace(/,?\s*\?$/, '');
  const seq = body.split(',').map((s) => Number(s.trim()));
  if (seq.some((n) => Number.isNaN(n)) || seq.length < 3) return q;
  const last = seq[seq.length - 1];
  const diffs = seq.slice(1).map((n, i) => n - seq[i]);
  const ratios = seq.slice(1).map((n, i) => n / seq[i]);
  const constDiff = diffs.every((d) => d === diffs[0]);
  const constRatio = ratios.every((r) => Math.abs(r - ratios[0]) < 1e-9) && Number.isInteger(ratios[0]);
  const isSquares = seq.every((n) => Number.isInteger(Math.sqrt(n)))
    && seq.every((n, i) => i === 0 || Math.sqrt(n) - Math.sqrt(seq[i - 1]) === 1);
  let next, expHi;
  if (constDiff) {
    const d = diffs[0];
    next = last + d;
    const rule = d > 0 ? `हर संख्या ${d} से बढ़ती है` : `हर संख्या ${-d} से घटती है`;
    expHi = `${rule}। ${last} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${next}।`;
  } else if (constRatio) {
    const r = ratios[0];
    next = last * r;
    expHi = `हर संख्या को ${r} से गुणा किया जाता है। ${last} × ${r} = ${next}।`;
  } else if (isSquares) {
    const k = Math.sqrt(last) + 1;
    next = k * k;
    expHi = `ये वर्ग संख्याएँ हैं। अगली वर्ग संख्या ${k}² = ${next} है।`;
  } else {
    return q;
  }
  if (String(next) !== q.answer) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi: 'अगला क्या होगा: ' + body + ', ?' },
    exp: { en: q.exp, hi: expHi },
  };
}

// Analogies: every word in the chapter, translated. The Hindi uses the A : B :: C : ? form,
// and the explanation states the same relation in words.
const AN = {
  Hand: 'हाथ', Glove: 'दस्ताना', Foot: 'पैर', Shoe: 'जूता', Sock: 'मोजा', Leg: 'टाँग',
  Bird: 'पक्षी', Nest: 'घोंसला', Bee: 'मधुमक्खी', Hive: 'छत्ता', Flower: 'फूल', Sky: 'आकाश',
  Sun: 'सूरज', Day: 'दिन', Moon: 'चाँद', Night: 'रात', Star: 'तारा',
  Doctor: 'डॉक्टर', Hospital: 'अस्पताल', Teacher: 'शिक्षक', School: 'स्कूल', Book: 'किताब', Student: 'छात्र',
  Fish: 'मछली', Water: 'पानी', Pen: 'कलम', Write: 'लिखना', Knife: 'चाकू', Cut: 'काटना',
  Kitchen: 'रसोई', Sharp: 'तेज़', Cow: 'गाय', Calf: 'बछड़ा', Dog: 'कुत्ता', Puppy: 'पिल्ला',
  Cub: 'शावक', Kitten: 'बिल्ली का बच्चा', Cat: 'बिल्ली', India: 'भारत', Delhi: 'दिल्ली', Japan: 'जापान',
  Tokyo: 'टोक्यो', Beijing: 'बीजिंग', Seoul: 'सियोल', Read: 'पढ़ना', Song: 'गाना', Listen: 'सुनना',
  Password: 'पासवर्ड', Account: 'खाता', Key: 'चाबी', Lock: 'ताला', Field: 'मैदान', Chef: 'रसोइया',
  Farmer: 'किसान', Thermometer: 'थर्मामीटर', Temperature: 'तापमान', Clock: 'घड़ी', Time: 'समय',
  Author: 'लेखक', Painting: 'चित्र', Painter: 'चित्रकार', Wheel: 'पहिया', Car: 'कार', Wing: 'पंख',
  Aeroplane: 'हवाई जहाज़', Airplane: 'हवाई जहाज़', Milk: 'दूध', Honey: 'शहद', Library: 'पुस्तकालय',
  Books: 'किताबें', Zoo: 'चिड़ियाघर', Animals: 'जानवर', Umbrella: 'छाता', Rain: 'बारिश',
  Sunscreen: 'सनस्क्रीन', Actor: 'अभिनेता', Film: 'फ़िल्म', Singer: 'गायक', Chick: 'चूज़ा', Egg: 'अंडा',
  Tree: 'पेड़', Seed: 'बीज', Lie: 'झूठ', Thief: 'चोर', Steal: 'चुराना', Liar: 'झूठा', Sword: 'तलवार',
  Soldier: 'सैनिक', Brush: 'ब्रश', Furniture: 'फ़र्नीचर', Tailor: 'दर्ज़ी', Clothes: 'कपड़े',
  Carpenter: 'बढ़ई', Badminton: 'बैडमिंटन', Cricket: 'क्रिकेट', Bat: 'बल्ला', Racket: 'रैकेट',
  Petrol: 'पेट्रोल', Food: 'खाना', Body: 'शरीर', Nurse: 'नर्स', Patient: 'मरीज़', Ice: 'बर्फ़',
  Steam: 'भाप', Judge: 'न्यायाधीश', Court: 'अदालत', Referee: 'रेफ़री', Hen: 'मुर्गी', Eat: 'खाना खाना',
  Drink: 'पीना', Rice: 'चावल', Eye: 'आँख', See: 'देखना', Ear: 'कान', Hear: 'सुनना', Hot: 'गर्म',
  Cold: 'ठंडा', Up: 'ऊपर', Down: 'नीचे', Silkworm: 'रेशम का कीड़ा', Silk: 'रेशम', Airport: 'हवाई अड्डा',
  Cockpit: 'कॉकपिट', Plane: 'विमान', Harbour: 'बंदरगाह', Forest: 'जंगल', Galaxy: 'आकाशगंगा',
  Pride: 'झुंड', Flock: 'झुंड', Crow: 'कौआ', Kennel: 'कुत्ते का घर', Air: 'हवा', Ship: 'जहाज़',
  Pilot: 'पायलट',
  Lion: 'शेर',
};

export function localizeAnalogy(q) {
  if (q.chapter !== 'analogies-basic' || typeof q.prompt !== 'string') return q;
  const m = q.prompt.match(/^(.+?) is to (.+?) as (.+?) is to \?$/);
  if (!m) return q;
  const [a, b, c] = [m[1], m[2], m[3]];
  const words = [a, b, c, ...q.options.map((o) => o), q.answer];
  if (words.some((w) => !AN[w])) return q;
  const optionsHi = q.options.map((o) => ({ en: o, hi: AN[o] }));
  return {
    ...q,
    prompt: { en: q.prompt, hi: `${AN[a]} : ${AN[b]} :: ${AN[c]} : ?` },
    options: optionsHi,
    exp: { en: q.exp, hi: `${AN[a]} का ${AN[b]} से जो संबंध है, वही संबंध ${AN[c]} का ${AN[q.answer]} से है।` },
  };
}

// Ranking and ordering: names are translated, relation phrases are matched and rebuilt,
// and each explanation is restated from the numbers or the chain of names.
const RK_NAME = {
  Rahul: 'राहुल', Priya: 'प्रिया', Aman: 'अमन', Rani: 'रानी', Sam: 'सैम', Tina: 'टीना',
  Meena: 'मीना', Nisha: 'निशा', Om: 'ओम', Raj: 'राज', Sita: 'सीता', Vijay: 'विजय', Karan: 'करण',
  Deepak: 'दीपक', Ashok: 'अशोक', Anil: 'अनिल', Suresh: 'सुरेश', Vikram: 'विक्रम', Reena: 'रीना',
  Sonal: 'सोनल', Meera: 'मीरा', Kiran: 'किरण', Farah: 'फ़राह', Divya: 'दिव्या', Neha: 'नेहा',
  Rohan: 'रोहन', Tara: 'तारा', Sameer: 'समीर', Iqbal: 'इक़बाल', Naveen: 'नवीन', Leela: 'लीला',
  Zoya: 'ज़ोया', Farhan: 'फ़रहान', Rekha: 'रेखा', Vivek: 'विवेक', Salman: 'सलमान', Kabir: 'कबीर',
  Usha: 'उषा', Asha: 'आशा', Sunil: 'सुनील', Amit: 'अमित', Gita: 'गीता', Bina: 'बीना',
  Chirag: 'चिराग', Dev: 'देव', Esha: 'ईशा', Hari: 'हरि', Sameer2: 'समीर',
  Sheela: 'शीला', Anand: 'आनंद',
};
const RK_ADJ = { taller: 'लंबा', shorter: 'छोटा', older: 'बड़ा', younger: 'छोटा', heavier: 'भारी', lighter: 'हल्का' };
const RK_MORE = { scored: 'ज़्यादा अंक लाया', earns: 'ज़्यादा कमाता है' };
const RK_LESS = { scored: 'कम अंक लाया', earns: 'कम कमाता है' };
const RK_WHO = {
  shortest: 'सबसे छोटा', tallest: 'सबसे लंबा', oldest: 'सबसे बड़ा', youngest: 'सबसे छोटा',
  lightest: 'सबसे हल्का', heaviest: 'सबसे भारी', highest: 'सबसे ज़्यादा', lowest: 'सबसे कम',
  least: 'सबसे कम', 'the highest': 'सबसे ज़्यादा', 'the least': 'सबसे कम', 'the lowest': 'सबसे कम',
};

function rkName(w) {
  return RK_NAME[w] || w;
}

function rkSentence(s) {
  let t = s.trim();
  let m;
  if ((m = t.match(/^(\w+) is (taller|shorter|older|younger|heavier|lighter) than (\w+)$/))) {
    return `${rkName(m[1])}, ${rkName(m[3])} से ${RK_ADJ[m[2]]} है`;
  }
  if ((m = t.match(/^(\w+) (scored|earns) more than (\w+)$/))) return `${rkName(m[1])}, ${rkName(m[3])} से ${RK_MORE[m[2]]}`;
  if ((m = t.match(/^(\w+) (scored|earns) less than (\w+)$/))) return `${rkName(m[1])}, ${rkName(m[3])} से ${RK_LESS[m[2]]}`;
  if ((m = t.match(/^(\w+) is ahead of (\w+)$/))) return `${rkName(m[1])}, ${rkName(m[2])} से आगे है`;
  if ((m = t.match(/^(\w+) is (taller|shorter|older|younger|heavier|lighter) than (\w+) but (taller|shorter|older|younger|heavier|lighter) than (\w+)$/))) {
    return `${rkName(m[1])}, ${rkName(m[3])} से ${RK_ADJ[m[2]]} है लेकिन ${rkName(m[5])} से ${RK_ADJ[m[4]]} है`;
  }
  if ((m = t.match(/^(\w+) is (taller|shorter|older|younger|heavier|lighter) than (\w+) but (taller|shorter|older|younger|heavier|lighter) than (\w+)$/))) return null;
  if ((m = t.match(/^(\w+) finished before (\w+)$/))) return `${rkName(m[1])}, ${rkName(m[2])} से पहले खत्म किया`;
  if ((m = t.match(/^(\w+) finished before (\w+), and (\w+) finished before (\w+)$/))) return null;
  return null;
}

export function localizeRanking(q) {
  if (q.chapter !== 'ranking-ordering' || typeof q.prompt !== 'string') return q;
  const parts = q.prompt.split(/\.\s+/).map((p) => p.replace(/\?$/, '').trim());
  const last = parts[parts.length - 1];
  const qWho = q.prompt.match(/Who (?:is|was|scored|earns|finished|ranks|is at)?.*\?$/);
  // Relation sentences.
  const sentences = parts.slice(0, -1).map(rkSentence);
  if (sentences.some((s) => s === null)) return q;
  let promptHi = sentences.join('। ') + '। ';
  const whoKey = Object.keys(RK_WHO).find((k) => q.prompt.includes(`Who is the ${k}?`) || q.prompt.includes(`Who scored the ${k}?`) || q.prompt.includes(`Who earns the ${k}?`));
  if (whoKey) {
    promptHi += `${RK_WHO[whoKey]} कौन है?`;
  } else {
    return q;
  }
  const optionsHi = q.options.map((o) => ({ en: o, hi: rkName(o) }));
  const ansHi = rkName(q.answer);
  const chain = q.exp.match(/Chain: ([^.]+)\./);
  let expHi;
  if (chain) {
    const names = chain[1].split(' > ').map((n) => rkName(n.trim()));
    expHi = `क्रम: ${names.join(' > ')}। ${ansHi} ${q.exp.includes('top') ? 'सबसे ऊपर' : q.exp.includes('bottom') ? 'सबसे नीचे' : 'बीच में'} है।`;
  } else {
    return { ...q, prompt: { en: q.prompt, hi: promptHi }, options: optionsHi, exp: { en: q.exp, hi: q.exp } };
  }
  return { ...q, prompt: { en: q.prompt, hi: promptHi }, options: optionsHi, exp: { en: q.exp, hi: expHi } };
}

const RK_ORD = {
  1: 'पहला', 2: 'दूसरा', 3: 'तीसरा', 4: 'चौथा', 5: 'पाँचवाँ', 6: 'छठा', 7: 'सातवाँ', 8: 'आठवाँ',
  9: 'नौवाँ', 10: 'दसवाँ', 11: 'ग्यारहवाँ', 12: 'बारहवाँ', 13: 'तेरहवाँ', 14: 'चौदहवाँ',
  15: 'पंद्रहवाँ', 16: 'सोलहवाँ', 17: 'सत्रहवाँ', 18: 'अठारहवाँ', 19: 'उन्नीसवाँ', 20: 'बीसवाँ',
};

function rkOptionHi(o) {
  const ord = o.match(/^(\d+)(st|nd|rd|th)$/);
  if (ord) return RK_ORD[Number(ord[1])] || `${ord[1]}वाँ`;
  const people = o.match(/^(\d+) people$/);
  if (people) return `${people[1]} व्यक्ति`;
  if (o === 'Only 1 person') return 'सिर्फ़ 1 व्यक्ति';
  return RK_NAME[o] || o;
}

// Ranking questions whose wording is not a plain chain: each one is written out in Hindi.
const RK_MANUAL = {
  'In a race, Rani finished before Sam, and Sam finished before Tina. Who finished first?': {
    hi: 'एक दौड़ में, रानी सैम से पहले खत्म हुई, और सैम टीना से पहले खत्म हुआ। पहले कौन आया?',
    exp: 'क्रम: रानी > सैम > टीना। रानी सबसे ऊपर है — वह पहले आई।',
  },
  'Of 5 friends, Raj is 2nd tallest. Who is taller than Raj?': {
    hi: '5 मित्रों में, राज दूसरा सबसे लंबा है। राज से कौन लंबा है?',
    exp: 'दूसरा सबसे लंबा होने का मतलब है कि राज से ठीक एक व्यक्ति लंबा है — सिर्फ़ 1 व्यक्ति।',
  },
  'Sita ranks 5th from the top in a class of 20. What is her rank from the bottom?': {
    hi: '20 छात्रों की कक्षा में सीता ऊपर से पाँचवें स्थान पर है। नीचे से उसका स्थान क्या है?',
    exp: 'सूत्र: कुल − ऊपर से स्थान + 1 = 20 − 5 + 1 = 16वाँ।',
  },
  'If Ashok is 3rd from the left in a row of 7, how many are to his right?': {
    hi: 'एक पंक्ति में 7 लोग हैं। अशोक बायें से तीसरे स्थान पर है। उसके दाईं ओर कितने लोग हैं?',
    exp: 'उसके दाईं ओर लोग = 7 − 3 = 4।',
  },
  'In a queue, Reena is ahead of Sonal, and Sonal is ahead of Meera. Who is at the very back?': {
    hi: 'एक कतार में रीना, सोनल से आगे है, और सोनल, मीरा से आगे है। सबसे पीछे कौन है?',
    exp: 'क्रम: रीना > सोनल > मीरा। मीरा सबसे पीछे है।',
  },
  'Of 6 students, Neha is 3rd from the top. How many students are above her?': {
    hi: '6 छात्रों में नेहा ऊपर से तीसरे स्थान पर है। उससे ऊपर कितने छात्र हैं?',
    exp: 'ऊपर से तीसरा होने का मतलब है कि उससे ठीक 2 छात्र ऊपर हैं।',
  },
  'Aman ranks 4th from the bottom in a class of 15. What is his rank from the top?': {
    hi: '15 छात्रों की कक्षा में अमन नीचे से चौथे स्थान पर है। ऊपर से उसका स्थान क्या है?',
    exp: 'सूत्र: कुल − नीचे से स्थान + 1 = 15 − 4 + 1 = 12वाँ।',
  },
  'If Priya is 5th from the right in a row of 12, how many are to her left?': {
    hi: '12 लोगों की पंक्ति में प्रिया दाईं ओर से पाँचवें स्थान पर है। उसके बायीं ओर कितने लोग हैं?',
    exp: 'उसके बायीं ओर लोग = 12 − 5 = 7।',
  },
  'In a line of runners, Tara finished 2nd. Rohan finished right after Tara. What position did Rohan finish?': {
    hi: 'दौड़ाकों की एक पंक्ति में तारा दूसरे स्थान पर आई। रोहन तारा के ठीक बाद आया। रोहन किस स्थान पर आया?',
    exp: 'रोहन तारा के बाद आया, और तारा दूसरे स्थान पर थी, इसलिए रोहन तीसरे स्थान पर आया।',
  },
  'Of 5 boxes stacked, the red box is 2nd from the bottom. How many boxes are above it?': {
    hi: '5 डिब्बे एक के ऊपर रखे हैं। लाल डिब्बा नीचे से दूसरे स्थान पर है। उसके ऊपर कितने डिब्बे हैं?',
    exp: '5 − 2 = 3 डिब्बे उसके ऊपर हैं।',
  },
  'Sameer is shorter than Iqbal but taller than Naveen. Who is in the middle in height?': {
    hi: 'समीर, इक़बाल से छोटा है लेकिन नवीन से लंबा है। लंबाई में बीच में कौन है?',
    exp: 'क्रम: इक़बाल > समीर > नवीन। समीर दोनों के बीच में है — बीच की लंबाई।',
  },
  'In a race of 10 runners, Leela finished 6th from the last. What is her position from the start?': {
    hi: '10 दौड़ाकों की दौड़ में लीला आखिर से छठे स्थान पर आई। शुरुआत से उसका स्थान क्या है?',
    exp: 'सूत्र: कुल − आखिर से स्थान + 1 = 10 − 6 + 1 = 5वाँ।',
  },
  'Weight order: X is heavier than Y, Y is heavier than Z, Z is heavier than W. Who is the heaviest?': {
    hi: 'वज़न का क्रम: X, Y से भारी है, Y, Z से भारी है, Z, W से भारी है। सबसे भारी कौन है?',
    exp: 'क्रम: X > Y > Z > W। X सबसे ऊपर है — सबसे भारी।',
  },
  'A shelf has 8 books. The red book is 3rd from the left. How many books are to its right?': {
    hi: 'एक शेल्फ़ पर 8 किताबें हैं। लाल किताब बायें से तीसरे स्थान पर है। उसके दाईं ओर कितनी किताबें हैं?',
    exp: 'उसके दाईं ओर किताबें = 8 − 3 = 5।',
  },
  'Of 4 friends, Om is taller than Raj, Raj is taller than Sunil, and Sunil is taller than Amit. Who is the shortest?': {
    hi: '4 मित्रों में, ओम, राज से लंबा है, राज, सुनील से लंबा है, और सुनील, अमित से लंबा है। सबसे छोटा कौन है?',
    exp: 'क्रम: ओम > राज > सुनील > अमित। अमित सबसे नीचे है — सबसे छोटा।',
  },
  'Neeta ranks 7th from the top in a class of 20. What is her rank from the bottom?': {
    hi: '20 छात्रों की कक्षा में नीता ऊपर से सातवें स्थान पर है। नीचे से उसका स्थान क्या है?',
    exp: 'सूत्र: कुल − ऊपर से स्थान + 1 = 20 − 7 + 1 = 14वाँ।',
  },
  'In a line of 9 people, Vivek is exactly in the middle. What is his position from either end?': {
    hi: '9 लोगों की पंक्ति में विवेक ठीक बीच में है। किसी भी सिरे से उसका स्थान क्या है?',
    exp: '9 लोगों में ठीक बीच का स्थान हर सिरे से पाँचवाँ है (हर तरफ़ 4 लोग)।',
  },
  "A team of 11 players lines up. The captain stands 6th from the left. How many players stand to the captain's left?": {
    hi: '11 खिलाड़ी एक पंक्ति में खड़े हैं। कप्तान बायें से छठे स्थान पर है। कप्तान के बायीं ओर कितने खिलाड़ी हैं?',
    exp: 'कप्तान के बायीं ओर = 6 − 1 = 5।',
  },
  'Of 3 sisters, Asha is older than Usha, and Usha is older than Nisha. Who is the middle sister in age?': {
    hi: '3 बहनों में, आशा, उषा से बड़ी है, और उषा, निशा से बड़ी है। उम्र में बीच की बहन कौन है?',
    exp: 'क्रम: आशा > उषा > निशा। उषा दोनों के बीच में है — बीच की उम्र।',
  },
};

function localizeRankingRow(q) {
  const m = q.prompt.match(/^In a row of (\d+) (students|people), (\w+) is (\d+)(st|nd|rd|th) from the front\. How many (?:students|people) are behind \3\?$/);
  if (!m) return null;
  const [, n, , x, k] = m;
  const xHi = RK_NAME[x] || x;
  const hi = `${n} छात्रों की पंक्ति में ${xHi}, आगे से ${RK_ORD[Number(k)] || k + 'वाँ'} स्थान पर है। ${xHi} के पीछे कितने छात्र हैं?`;
  const exp = `${n} − ${k} = ${q.answer} छात्र ${xHi} के पीछे हैं।`;
  return { hi, exp };
}

export function localizeRankingFull(q) {
  if (q.chapter !== 'ranking-ordering' || typeof q.prompt !== 'string') return q;
  const manual = RK_MANUAL[q.prompt];
  const row = manual ? null : localizeRankingRow(q);
  if (!manual && !row) return localizeRanking(q);
  const t = manual || row;
  return {
    ...q,
    prompt: { en: q.prompt, hi: t.hi },
    options: q.options.map((o) => ({ en: o, hi: rkOptionHi(o) })),
    exp: { en: q.exp, hi: t.exp },
  };
}

const DR = { North: 'उत्तर', South: 'दक्षिण', East: 'पूर्व', West: 'पश्चिम' };
const SIDE = { left: 'बायीं', right: 'दायीं' };
const TURN = { left: 'बायें', right: 'दायें' };
const dirOptionHi = (o) => {
  if (DR[o]) return DR[o];
  const m = o.match(/^(\d+)m$/);
  return m ? `${m[1]} मी` : o;
};
const deg = (s) => (s.startsWith('180') ? '180°' : s.startsWith('270') ? '270°' : '90°');

const DR_MANUAL = {
  'Sunrise happens in which direction?': ['सूर्योदय किस दिशा में होता है?', 'सूर्य हमेशा पूर्व में उगता है — यह एक निश्चित भौगोलिक तथ्य है।'],
  'Sunset happens in which direction?': ['सूर्यास्त किस दिशा में होता है?', 'सूर्य हमेशा पश्चिम में अस्त होता है — यह एक निश्चित भौगोलिक तथ्य है।'],
  "A compass needle's red tip always points toward which direction?": ['कम्पास की सुई का लाल सिरा हमेशा किस दिशा की ओर रहता है?', 'कम्पास की सुई का लाल सिरा हमेशा चुंबकीय उत्तर की ओर रहता है — यह एक निश्चित भौतिक तथ्य है।'],
  'You walk 3m East, turn right, walk 3m, turn right again. Which direction are you now facing?': ['आप 3 मी पूर्व की ओर चलते हैं, दायें मुड़ते हैं, 3 मी चलते हैं, फिर दोबारा दायें मुड़ते हैं। अब आप किस दिशा की ओर हैं?', 'पूर्व से दायें मुड़ने पर दक्षिण, फिर दोबारा दायें मुड़ने पर पश्चिम। अब आप पश्चिम की ओर हैं।'],
};

function drPrompt(p) {
  let m;
  if ((m = p.match(/^You walk (\d+)m (\w+), then turn (left|right)\. Which direction are you facing now\?$/))) return `आप ${m[1]} मी ${DR[m[2]]} की ओर चलते हैं, फिर ${TURN[m[3]]} मुड़ते हैं। अब आप किस दिशा की ओर हैं?`;
  if ((m = p.match(/^You walk facing (\w+), then turn (left|right)\. Which direction are you facing now\?$/))) return `आप ${DR[m[1]]} की ओर मुँह करके चलते हैं, फिर ${TURN[m[2]]} मुड़ते हैं। अब आप किस दिशा की ओर हैं?`;
  if ((m = p.match(/^You walk facing (\w+), then turn (left|right) twice \(90 degrees each\)\. Which direction are you facing now\?$/))) return `आप ${DR[m[1]]} की ओर मुँह करके चलते हैं, फिर दो बार ${TURN[m[2]]} (हर बार 90°) मुड़ते हैं। अब आप किस दिशा की ओर हैं?`;
  if ((m = p.match(/^You walk facing (\w+), then turn (left|right)\. Which direction are you facing now\?$/))) return null;
  if ((m = p.match(/^Facing (\w+), if you turn (?:180°|180 degrees), which direction do you face\?$/))) return `${DR[m[1]]} की ओर मुँह करके, यदि आप 180° मुड़ें, तो आप किस दिशा की ओर होंगे?`;
  if ((m = p.match(/^Facing (\w+), if you turn (left|right), which direction do you face\?$/))) return `${DR[m[1]]} की ओर मुँह करके, यदि आप ${TURN[m[2]]} मुड़ें, तो आप किस दिशा की ओर होंगे?`;
  if ((m = p.match(/^Facing (\w+), if you turn (left|right) twice \((?:90 degrees|90°) each\), which direction do you face\?$/))) return `${DR[m[1]]} की ओर मुँह करके, यदि आप दो बार ${TURN[m[2]]} (हर बार 90°) मुड़ें, तो आप किस दिशा की ओर होंगे?`;
  if ((m = p.match(/^Facing (\w+), you turn (left|right) (\d+) degrees\. Which direction are you facing now\?$/))) return `${DR[m[1]]} की ओर मुँह करके, आप ${TURN[m[2]]} ${m[3]}° मुड़ते हैं। अब आप किस दिशा की ओर हैं?`;
  if ((m = p.match(/^If (\w+) is to your (left|right), which direction are you facing\?$/))) return `यदि ${DR[m[1]]} आपकी ${SIDE[m[2]]} ओर है, तो आप किस दिशा की ओर मुँह करके हैं?`;
  if ((m = p.match(/^You walk (\d+)m (\w+) and (?:then )?(\d+)m (\w+)\. How far are you from the start\?$/))) return `आप ${m[1]} मी ${DR[m[2]]} और ${m[3]} मी ${DR[m[4]]} की ओर चलते हैं। आप शुरुआत से कितनी दूर हैं?`;
  if ((m = p.match(/^You walk (\d+)m (\w+) and then (\d+)m (\w+)\. How far are you from the start\?$/))) return `आप ${m[1]} मी ${DR[m[2]]} और फिर ${m[3]} मी ${DR[m[4]]} की ओर चलते हैं। आप शुरुआत से कितनी दूर हैं?`;
  return null;
}

function drExp(e, ans) {
  let m;
  if ((m = e.match(/^Turning (left|right) from (\w+) means you face (\w+)\.$/))) return `${DR[m[2]]} से ${TURN[m[1]]} मुड़ने पर आप ${DR[m[3]]} की ओर मुँह करते हैं।`;
  if ((m = e.match(/^A 180° turn from (\w+) brings you to face (\w+) — the exact opposite direction\.$/))) return `${DR[m[1]]} से 180° मुड़ने पर आप ${DR[m[2]]} की ओर मुँह करते हैं — ठीक विपरीत दिशा।`;
  if ((m = e.match(/^Turning (left|right) from (\w+) means you face (\w+) \((?:\w+) → (?:\w+) (?:in a )?(?:clockwise|counter-clockwise)(?: turn)?\)\.$/))) return `${DR[m[2]]} से ${TURN[m[1]]} मुड़ने पर आप ${DR[m[3]]} की ओर मुँह करते हैं।`;
  if (/^The two legs cancel out exactly/.test(e)) return 'दोनों दूरियाँ आपस में कट जाती हैं — आप अपने शुरुआती बिंदु पर वापस आ जाते हैं, यानी 0 मी दूर।';
  if (/^Following standard clockwise/.test(e)) return `कम्पास की दिशाओं के नियम (दक्षिणावर्त/वामावर्त मोड़) से परिणामी दिशा ${DR[ans]} है।`;
  if ((m = e.match(/^Each quarter turn moves you one direction along North, East, South, West\. Facing (\w+) now\.$/))) return `हर चौथाई मोड़ आपको उत्तर, पूर्व, दक्षिण, पश्चिम के क्रम में एक दिशा आगे ले जाता है। अब आप ${DR[m[1]]} की ओर हैं।`;
  if ((m = e.match(/^If (\w+) is directly to your (left|right), you must be facing (\w+)/))) {
    const rel = m[2] === 'left' ? 'वामावर्त' : 'दक्षिणावर्त';
    return `यदि ${DR[m[1]]} ठीक आपकी ${SIDE[m[2]]} ओर है, तो आप ${DR[m[3]]} की ओर मुँह करके हैं (${DR[m[1]]}, ${DR[m[3]]} से 90° ${rel} है)।`;
  }
  return null;
}

export function localizeDirection(q) {
  if (q.chapter !== 'direction-basic' || typeof q.prompt !== 'string') return q;
  let hi = null; let exp = null;
  const man = DR_MANUAL[q.prompt];
  if (man) { hi = man[0]; exp = man[1]; } else { hi = drPrompt(q.prompt); exp = drExp(q.exp, q.answer); }
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: dirOptionHi(o) })),
    exp: { en: q.exp, hi: exp },
  };
}

const CD_DIR = { forward: 'आगे', back: 'पीछे' };

function cdPrompt(p) {
  let m;
  if ((m = p.match(/^If (\w+) is coded as (\w+), how is (\w+) coded\?$/))) return `यदि ${m[1]} को ${m[2]} के रूप में कोड किया जाए, तो ${m[3]} को कैसे कोड किया जाएगा?`;
  if ((m = p.match(/^If A=1, B=2, C=3(?:\.\.\.| and so on)?, what does ([A-Z-]+) spell as numbers\?$/))) return `यदि A=1, B=2, C=3..., तो ${m[1]} संख्याओं में क्या बनेगा?`;
  if ((m = p.match(/^Each letter shifts back by (\d+)\. If (\w+) becomes (\w+), what does (\w+) become\?$/))) return `हर अक्षर ${m[1]} स्थान पीछे खिसकता है। यदि ${m[2]} का कोड ${m[3]} बनता है, तो ${m[4]} का कोड क्या बनेगा?`;
  if ((m = p.match(/^If 1=A, 2=B, 3=C(?:\.\.\.|,\s*\.\.\.)?,? what word does ([\d-]+) spell\?$/))) return `यदि 1=A, 2=B, 3=C..., तो ${m[1]} से कौन-सा शब्द बनता है?`;
  if ((m = p.match(/^If each letter shifts (forward|back) by (\d+), how is (\w+) coded\?$/))) return `यदि हर अक्षर ${m[2]} स्थान ${CD_DIR[m[1]]} खिसकता है, तो ${m[3]} को कैसे कोड किया जाएगा?`;
  if ((m = p.match(/^In a code, each letter moves (\d+) places? forward\. What is the code for (\w+)\?$/))) return `एक कोड में हर अक्षर ${m[1]} स्थान आगे बढ़ता है। ${m[2]} का कोड क्या है?`;
  if ((m = p.match(/^Which letter is (\d+) places after (\w) in the alphabet\?$/))) return `वर्णमाला में ${m[2]} से ${m[1]} स्थान आगे कौन-सा अक्षर है?`;
  if ((m = p.match(/^If A=1, B=2, C=3 and so on, what is the sum of the letter values of (\w+)\?$/))) return `यदि A=1, B=2, C=3 और इसी तरह आगे, तो ${m[1]} के अक्षरों के मानों का योग क्या है?`;
  return null;
}

function cdExp(e) {
  let m;
  if ((m = e.match(/^Each letter shifts forward by 1 \((.*)\)\. Apply the same \+1 shift to (\w+): (.*) = (\w+)\.$/))) return `हर अक्षर 1 स्थान आगे खिसकता है (${m[1]})। यही +1 खिसकाव ${m[2]} पर लागू करें: ${m[3]} = ${m[4]}।`;
  if ((m = e.match(/^Each letter shifts \+1: (.*) = (\w+)\. Apply to (\w+): (.*) = (\w+)\.$/))) return `हर अक्षर +1 खिसकता है: ${m[1]} = ${m[2]}। ${m[3]} पर लागू करें: ${m[4]} = ${m[5]}।`;
  if ((m = e.match(/^Each letter shifts \+1\. Apply to (\w+): (.*) = (\w+)\.$/))) return `हर अक्षर +1 खिसकता है। ${m[1]} पर लागू करें: ${m[2]} = ${m[3]}।`;
  if ((m = e.match(/^Each letter shifts back by 1 \(−1\)\. Apply to (\w+): (.*) = (\w+)\.$/))) return `हर अक्षर 1 स्थान पीछे खिसकता है (−1)। ${m[1]} पर लागू करें: ${m[2]} = ${m[3]}।`;
  if ((m = e.match(/^Each letter shifts forward by (\d+) \((.*)\)\. (\w+) becomes (\w+)\.$/))) return `हर अक्षर ${m[1]} स्थान आगे खिसकता है (${m[2].replace(/->/g, '→')})। ${m[3]} का कोड ${m[4]} बनता है।`;
  if ((m = e.match(/^Each letter shifts (forward|back) by (\d+)\. (\w+) becomes (\w+)\.$/))) return `हर अक्षर ${m[2]} स्थान ${CD_DIR[m[1]]} खिसकता है। ${m[3]} का कोड ${m[4]} बनता है।`;
  if ((m = e.match(/^Move each letter (\d+) forward: (\w+) becomes (\w+)\.$/))) return `हर अक्षर को ${m[1]} स्थान आगे ले जाएँ: ${m[2]} का कोड ${m[3]} बनता है।`;
  if ((m = e.match(/^Counting (\d+) places after (\w) gives (\w)\.$/))) return `${m[2]} से ${m[1]} स्थान आगे गिनने पर ${m[3]} मिलता है।`;
  if (/^Add the value of each letter: the total is (\d+)\.$/.test(e)) return `हर अक्षर का मान जोड़ें: कुल ${e.match(/(\d+)\.$/)[1]} है।`;
  if ((m = e.match(/^Using standard alphabet positions: (.*)\.$/))) return `वर्णमाला के मानक स्थानों से: ${m[1]}।`;
  if ((m = e.match(/^(\w)=(\d+), (\w)=(\d+), (\w)=(\d+) (?:—|--) the word is (\w+)\.$/))) return `${m[1]}=${m[2]}, ${m[3]}=${m[4]}, ${m[5]}=${m[6]} — शब्द ${m[7]} है।`;
  if ((m = e.match(/^(\d+)=(\w), (\d+)=(\w), (\d+)=(\w) (?:—|--) the word is (\w+)\.$/))) return `${m[1]}=${m[2]}, ${m[3]}=${m[4]}, ${m[5]}=${m[6]} — शब्द ${m[7]} है।`;
  if ((m = e.match(/^(\w) is the (\d+)(?:st|nd|rd|th) letter, (\w) is the (\d+)(?:st|nd|rd|th) letter, (\w) is the (\d+)(?:st|nd|rd|th) letter of the alphabet\.$/))) return `वर्णमाला में ${m[1]} ${m[2]}वाँ अक्षर है, ${m[3]} ${m[4]}वाँ अक्षर है, और ${m[5]} ${m[6]}वाँ अक्षर है।`;
  return null;
}

export function localizeCoding(q) {
  if (q.chapter !== 'coding-decoding-basic' || typeof q.prompt !== 'string') return q;
  const hi = cdPrompt(q.prompt);
  const exp = cdExp(q.exp);
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: o })),
    exp: { en: q.exp, hi: exp },
  };
}

const BR_NAME = {
  Harish: 'हरीश', Shanti: 'शांति', Vivek: 'विवेक', Anita: 'अनीता', Suresh: 'सुरेश', Meera: 'मीरा', Tarun: 'तरुण', Mini: 'मिनी',
  Ravi: 'रवि', Om: 'ओम', Gita: 'गीता', Raj: 'राज', Divya: 'दिव्या', Manish: 'मनीष', Shyam: 'श्याम', Pooja: 'पूजा', Ajay: 'अजय',
  Sonal: 'सोनल', Mohit: 'मोहित', Kabir: 'कबीर', Esha: 'ईशा', Mohan: 'मोहन', Radha: 'राधा', Vikas: 'विकास', Neha: 'नेहा',
  Prakash: 'प्रकाश', Farida: 'फ़रीदा', Imran: 'इमरान', Salim: 'सलीम', Dinesh: 'दिनेश', Sheela: 'शीला', Pankaj: 'पंकज',
  Kiran: 'किरण', Lata: 'लता', Prem: 'प्रेम', Leela: 'लीला', Tara: 'तारा', Anand: 'आनंद', Veer: 'वीर', Ajit: 'अजीत',
  Sanjay: 'संजय', Sita: 'सीता', Ramesh: 'रमेश', Priya: 'प्रिया', Dev: 'देव', Sunita: 'सुनीता', Ganesh: 'गणेश', Gauri: 'गौरी',
  Hari: 'हरि', Asha: 'आशा', Lila: 'लिला', Rohit: 'रोहित', Kavita: 'कविता', Anil: 'अनिल', Arjun: 'अर्जुन', Rekha: 'रेखा', Vijay: 'विजय',
};

// [Hindi word, gender] — m takes "के", f takes "की" after the possessor.
const BR_REL = {
  father: ['पिता', 'm'], mother: ['माँ', 'f'], brother: ['भाई', 'm'], sister: ['बहन', 'f'], son: ['बेटा', 'm'], daughter: ['बेटी', 'f'],
  wife: ['पत्नी', 'f'], husband: ['पति', 'm'], uncle: ['अंकल', 'm'], aunt: ['आंटी', 'f'], cousin: ['कज़िन', 'm'],
  nephew: ['भतीजा/भांजा', 'm'], niece: ['भतीजी/भांजी', 'f'], grandfather: ['दादा/नाना', 'm'], grandmother: ['दादी/नानी', 'f'],
  grandson: ['पोता/नाती', 'm'], granddaughter: ['पोती/नातिन', 'f'], 'daughter-in-law': ['बहू', 'f'], 'son-in-law': ['दामाद', 'm'],
  'mother-in-law': ['सास', 'f'], 'father-in-law': ['ससुर', 'm'], 'brother-in-law': ['जीजा/साला', 'm'], 'sister-in-law': ['भाभी/साली/ननद', 'f'],
};
const brOpt = (o) => { const r = BR_REL[o.toLowerCase()]; return r ? r[0] : o; };

// Exact Hindi relation for "A's B" (used only in explanations).
const BR_SPEC = {
  'mother,mother': ['नानी', 'f'], 'father,brother': ['चाचा', 'm'], 'sister,daughter': ['भांजी', 'f'], 'mother,sister': ['मौसी', 'f'],
  'father,wife': ['माँ', 'f'], 'son,wife': ['बहू', 'f'], 'father,father': ['दादा', 'm'], 'mother,brother': ['मामा', 'm'],
  'brother,son': ['भतीजा', 'm'], 'brother,daughter': ['भतीजी', 'f'], 'daughter,husband': ['दामाद', 'm'], 'mother,father': ['नाना', 'm'],
  'sister,son': ['भांजा', 'm'], 'wife,mother': ['सास', 'f'], 'husband,father': ['ससुर', 'm'], 'father,sister': ['बुआ', 'f'],
  'son,son': ['पोता', 'm'], 'daughter,daughter': ['नातिन', 'f'], 'wife,brother': ['साला', 'm'], 'husband,sister': ['ननद', 'f'],
  'sister,husband': ['जीजा', 'm'], 'brother,wife': ['भाभी', 'f'], 'mother,husband': ['पिता', 'm'],
};
const BR_OBL = { बेटा: 'बेटे' };
const brMy = (a) => { const [w, g] = BR_REL[a]; return `${g === 'f' ? 'मेरी' : 'मेरे'} ${BR_OBL[w] || w}`; };
const brYour = (a) => { const [w, g] = BR_REL[a]; return `${g === 'f' ? 'आपकी' : 'आपके'} ${BR_OBL[w] || w}`; };
const brOf = (b) => (BR_REL[b][1] === 'f' ? 'की' : 'का');

const BR_MANUAL = {
  '"This is my father\'s son, but not me." Who is it?': ['"यह मेरे पिता का बेटा है, पर मैं नहीं।" यह कौन है?', 'आपके पिता का बेटा या तो आप हैं या आपका भाई। चूँकि वह आप नहीं हैं, इसलिए वह आपका भाई है।'],
  'A boy says: "She is the daughter of the only son of my grandfather." Who is she to the boy?': ['एक लड़का कहता है: "वह मेरे दादा के इकलौते बेटे की बेटी है।" वह लड़के की कौन है?', 'लड़के के दादा का इकलौता बेटा लड़के के अपने पिता हैं। लड़की उन्हीं की बेटी है — इसलिए वह लड़के की बहन है।'],
  'A man points to a woman and says, "She is my mother\'s mother." Who is she to him?': ['एक आदमी एक महिला की ओर इशारा करके कहता है, "वह मेरी माँ की माँ है।" वह उसकी कौन है?', 'आदमी की माँ की माँ उसकी नानी होती है।'],
  'A woman points to a man and says, "He is my father\'s father." Who is he to her?': ['एक महिला एक पुरुष की ओर इशारा करके कहती है, "वह मेरे पिता के पिता हैं।" वह उसके कौन हैं?', 'महिला के पिता के पिता उसके दादा होते हैं।'],
  'A man says, "This is my son\'s daughter." Who is she to the man?': ['एक आदमी कहता है, "यह मेरे बेटे की बेटी है।" वह आदमी की कौन है?', 'आदमी के बेटे की बेटी उसकी पोती होती है।'],
};

const BR_N = (n) => BR_NAME[n] || n;
const brPoss = (n, rel) => `${BR_N(n)} ${BR_REL[rel][1] === 'f' ? 'की' : 'का'} ${BR_REL[rel][0]}`;

function brSentence(s) {
  let m;
  if ((m = s.match(/^(\w+)'s ([\w-]+) is (\w+)$/))) return `${brPoss(m[1], m[2])} ${BR_N(m[3])} है`;
  if ((m = s.match(/^(\w+) is the (only )?([\w-]+) of (\w+)$/))) return `${BR_N(m[1])}, ${BR_N(m[4])} ${m[2] ? 'का इकलौता' : BR_REL[m[3]][1] === 'f' ? 'की' : 'का'} ${BR_REL[m[3]][0]} है`;
  return null;
}

function brPrompt(p) {
  let m;
  if ((m = p.match(/^My (\w+)'s (\w+) is my \?$/))) return `${brMy(m[1])} ${brOf(m[2])} ${BR_REL[m[2]][0]} का मुझसे क्या संबंध है?`;
  if ((m = p.match(/^(.*)\. How is (\w+) related to (\w+)\?$/))) {
    const parts = m[1].split('. ').map(brSentence);
    if (parts.some((x) => !x)) return null;
    return `${parts.join('। ')}। ${BR_N(m[2])} का ${BR_N(m[3])} से क्या संबंध है?`;
  }
  return null;
}

function brExp(e, q) {
  let m;
  if ((m = e.match(/^Your (\w+)'s (\w+) is your ([\w-]+)/))) {
    const spec = BR_SPEC[`${m[1]},${m[2]}`];
    if (!spec) return null;
    return `${brYour(m[1])} ${brOf(m[2])} ${BR_REL[m[2]][0]} ${spec[1] === 'f' ? 'आपकी' : 'आपके'} ${spec[0]} ${spec[1] === 'f' ? 'होती है' : 'होते हैं'}।`;
  }
  if ((m = e.match(/^Working through the family links, ([\w-]+) is the correct relation\.$/))) return `परिवार के रिश्तों को क्रम से जोड़ने पर सही संबंध "${brOpt(m[1])}" निकलता है।`;
  return null;
}

export function localizeBlood(q) {
  if (q.chapter !== 'blood-relations-basic' || typeof q.prompt !== 'string') return q;
  let hi; let exp;
  const man = BR_MANUAL[q.prompt];
  if (man) { [hi, exp] = man; } else { hi = brPrompt(q.prompt); exp = brExp(q.exp, q); }
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: brOpt(o) })),
    exp: { en: q.exp, hi: exp },
  };
}

const CL_DAY = { Monday: 'सोमवार', Tuesday: 'मंगलवार', Wednesday: 'बुधवार', Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार', Sunday: 'रविवार' };
const CL_MON = { January: 'जनवरी', February: 'फ़रवरी', March: 'मार्च', April: 'अप्रैल', June: 'जून', December: 'दिसंबर' };
const clOpt = (o) => CL_DAY[o] || (o === 'Every 4 years' ? 'हर 4 साल में' : o === 'Every 3 years' ? 'हर 3 साल में' : o === 'Every 5 years' ? 'हर 5 साल में' : o);

const CL_MANUAL = {
  'How many days are there in a leap year?': ['लीप वर्ष में कितने दिन होते हैं?', 'लीप वर्ष में एक अतिरिक्त दिन (29 फ़रवरी) होता है, इसलिए 365 + 1 = 366 दिन।'],
  'How many months have exactly 30 days?': ['कितने महीनों में ठीक 30 दिन होते हैं?', 'अप्रैल, जून, सितंबर और नवंबर — हर एक में ठीक 30 दिन होते हैं, यानी 4 महीने।'],
  'How many days are in the month of February in a normal year?': ['सामान्य वर्ष में फ़रवरी महीने में कितने दिन होते हैं?', 'सामान्य (गैर-लीप) वर्ष में फ़रवरी में 28 दिन होते हैं।'],
  'How many days are there in the month of April?': ['अप्रैल महीने में कितने दिन होते हैं?', 'अप्रैल में ठीक 30 दिन होते हैं।'],
  'How many days are there in the month of December?': ['दिसंबर महीने में कितने दिन होते हैं?', 'दिसंबर में ठीक 31 दिन होते हैं।'],
  'How many odd days are there in an ordinary (non-leap) year?': ['एक सामान्य (गैर-लीप) वर्ष में कितने विषम दिन होते हैं?', 'सामान्य वर्ष में 365 दिन होते हैं। 365 को 7 से भाग देने पर शेषफल 1 बचता है — इसलिए 1 विषम दिन।'],
  'How many odd days are there in a leap year?': ['एक लीप वर्ष में कितने विषम दिन होते हैं?', 'लीप वर्ष में 366 दिन होते हैं। 366 को 7 से भाग देने पर शेषफल 2 बचता है — इसलिए 2 विषम दिन।'],
  'How many months in a year have exactly 31 days?': ['एक वर्ष में कितने महीनों में ठीक 31 दिन होते हैं?', 'जनवरी, मार्च, मई, जुलाई, अगस्त, अक्टूबर और दिसंबर — हर एक में 31 दिन होते हैं, यानी 7 महीने।'],
  'How many days are in a normal (non-leap) year?': ['सामान्य (गैर-लीप) वर्ष में कितने दिन होते हैं?', 'सामान्य, गैर-लीप वर्ष में 365 दिन होते हैं।'],
  'A leap year occurs how often?': ['लीप वर्ष कितने अंतराल पर आता है?', 'लीप वर्ष (जिसमें 29 फ़रवरी का अतिरिक्त दिन होता है) हर 4 साल में आता है, कुछ शताब्दी वर्षों के अपवाद के साथ।'],
  'If today is Monday, what day will it be after 10 days?': ['यदि आज सोमवार है, तो 10 दिन बाद कौन-सा दिन होगा?', '10 ÷ 7 का शेषफल 3 है। सोमवार के तीन दिन बाद: मंगलवार, बुधवार, गुरुवार।'],
  'If today is Friday, what day was it 3 days ago?': ['यदि आज शुक्रवार है, तो 3 दिन पहले कौन-सा दिन था?', 'शुक्रवार से तीन दिन पहले: गुरुवार, बुधवार, मंगलवार।'],
  'If January 1st is a Sunday, what day is January 8th?': ['यदि 1 जनवरी रविवार है, तो 8 जनवरी को कौन-सा दिन होगा?', '8 जनवरी, 1 जनवरी से ठीक 7 दिन (1 सप्ताह) बाद है, इसलिए वही दिन — रविवार।'],
  'If today is Wednesday, what day will it be after 21 days?': ['यदि आज बुधवार है, तो 21 दिन बाद कौन-सा दिन होगा?', '21 ÷ 7 = ठीक 3 सप्ताह, शेषफल नहीं — इसलिए सप्ताह का वही दिन: बुधवार।'],
  'Which day comes 2 days before Sunday?': ['रविवार से 2 दिन पहले कौन-सा दिन आता है?', 'रविवार से दो दिन पहले: शनिवार, फिर शुक्रवार। उत्तर शुक्रवार है।'],
  'If March 1st is a Monday, what day is March 15th?': ['यदि 1 मार्च सोमवार है, तो 15 मार्च को कौन-सा दिन होगा?', '15 मार्च, 1 मार्च से 14 दिन बाद है, यानी ठीक 2 सप्ताह — सप्ताह का वही दिन।'],
  'If June 1st is a Thursday, what day is June 22nd?': ['यदि 1 जून गुरुवार है, तो 22 जून को कौन-सा दिन होगा?', '22 जून, 1 जून से 21 दिन बाद है, यानी ठीक 3 सप्ताह — सप्ताह का वही दिन।'],
};

function clPrompt(p) {
  let m;
  if ((m = p.match(/^If today is (\w+), what day will it be after (\d+) days\?$/))) return `यदि आज ${CL_DAY[m[1]]} है, तो ${m[2]} दिन बाद कौन-सा दिन होगा?`;
  if ((m = p.match(/^If today is (\w+), what day was it (\d+) days ago\?$/))) return `यदि आज ${CL_DAY[m[1]]} है, तो ${m[2]} दिन पहले कौन-सा दिन था?`;
  if ((m = p.match(/^Which day comes (\d+) days (after|before) (\w+)\?$/))) return `${CL_DAY[m[3]]} से ${m[1]} दिन ${m[2] === 'after' ? 'बाद' : 'पहले'} कौन-सा दिन आता है?`;
  if ((m = p.match(/^If (\w+) 1st is a (\w+), what day is \1 (\d+)(?:st|nd|rd|th)\?$/))) return `यदि 1 ${CL_MON[m[1]]} ${CL_DAY[m[2]]} है, तो ${m[3]} ${CL_MON[m[1]]} को कौन-सा दिन होगा?`;
  return null;
}

function clExp(e, ans) {
  let m;
  if (/^Counting the days forward\/backward/.test(e)) return `सप्ताह के 7-दिन के चक्र में दिनों को आगे/पीछे गिनने पर ${CL_DAY[ans]} मिलता है।`;
  if ((m = e.match(/^(\d+) days after (\w+) is (\w+), since each week has 7 days\.$/))) return `${CL_DAY[m[2]]} के ${m[1]} दिन बाद ${CL_DAY[m[3]]} आता है, क्योंकि हर सप्ताह में 7 दिन होते हैं।`;
  if ((m = e.match(/^(\d+) days before (\w+) is (\w+)\.$/))) return `${CL_DAY[m[2]]} से ${m[1]} दिन पहले ${CL_DAY[m[3]]} था।`;
  if ((m = e.match(/^(\d+) days after (\w+) is (\w+)\.$/))) return `${CL_DAY[m[2]]} के ${m[1]} दिन बाद ${CL_DAY[m[3]]} आता है।`;
  return null;
}

export function localizeCalendar(q) {
  if (q.chapter !== 'calendar-basics' || typeof q.prompt !== 'string') return q;
  let hi; let exp;
  const man = CL_MANUAL[q.prompt];
  if (man) { [hi, exp] = man; } else { hi = clPrompt(q.prompt); exp = clExp(q.exp, q.answer); }
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: clOpt(o) })),
    exp: { en: q.exp, hi: exp },
  };
}

const MR_OPT = {
  '9:00 position': '9:00 की स्थिति', '3:00 position': '3:00 की स्थिति', '6:00 position': '6:00 की स्थिति', '12:00 position': '12:00 की स्थिति',
  'Right hand': 'दायाँ हाथ', 'Left hand': 'बायाँ हाथ', 'Both hands': 'दोनों हाथ', 'Right foot': 'दायाँ पैर', 'Left foot': 'बायाँ पैर', 'Both feet': 'दोनों पैर',
  'Flipped/reversed': 'उलटा/पलटा हुआ', 'Exactly the same': 'बिल्कुल वैसा ही', 'Upside down': 'ऊपर-नीचे उलटा',
  'A backward E (Ǝ)': 'उलटा E (Ǝ)', 'The letter F': 'अक्षर F',
};
const mrOpt = (o) => MR_OPT[o] || o;
const MR_SIDE = { left: 'बायीं', right: 'दायीं' };
const MR_PART = { hand: 'हाथ', foot: 'पैर' };

const MR_MANUAL = {
  'In a mirror, does "3:00" on a clock face appear reversed as which time position?': ['दर्पण में घड़ी के चेहरे पर "3:00" उलटकर किस समय की स्थिति पर दिखाई देता है?', 'घड़ी का चेहरा बाएँ से दाएँ उलट जाता है। 3:00 की स्थिति (दायीं ओर) बायीं ओर चली जाती है, जो 9:00 की स्थिति है।'],
  'In a mirror, which clock position does 6:00 appear as?': ['दर्पण में 6:00 की स्थिति किस स्थिति के रूप में दिखाई देती है?', '6:00 की स्थिति ऊर्ध्वाधर दर्पण-अक्ष पर (ठीक नीचे) होती है, इसलिए बाएँ-दाएँ उलटने से वह प्रभावित नहीं होती — वह 6:00 पर ही रहती है।'],
  'In a mirror, the 9:00 position on a clock face appears as which position?': ['दर्पण में घड़ी के चेहरे की 9:00 की स्थिति किस स्थिति के रूप में दिखाई देती है?', 'घड़ी का चेहरा बाएँ से दाएँ उलट जाता है। 9:00 की स्थिति (बायीं ओर) दायीं ओर चली जाती है, जो 3:00 की स्थिति है।'],
  'In a mirror, the 12:00 position on a clock face appears as which position?': ['दर्पण में घड़ी के चेहरे की 12:00 की स्थिति किस स्थिति के रूप में दिखाई देती है?', '12:00 की स्थिति ऊर्ध्वाधर दर्पण-अक्ष पर (ठीक ऊपर) होती है, इसलिए बाएँ-दाएँ उलटने से वह प्रभावित नहीं होती — वह 12:00 पर ही रहती है।'],
  'In a mirror, the letter "E" would look like ?': ['दर्पण में अक्षर "E" कैसा दिखेगा?', 'E की तीनों क्षैतिज रेखाएँ दायीं ओर होती हैं। दर्पण में वे बायीं ओर हो जाती हैं — जिससे उलटा E (Ǝ) बनता है।'],
  'Which of these words looks the same forward and in a mirror (approximately): TOOT, HELLO, WATER?': ['इनमें से कौन-सा शब्द आगे से और दर्पण में (लगभग) एक जैसा दिखता है: TOOT, HELLO, WATER?', 'किसी शब्द के दर्पण में वैसा ही दिखने के लिए हर अक्षर अपने आप में सममित होना चाहिए और शब्द आगे-पीछे दोनों ओर से एक जैसा पढ़ा जाना चाहिए। T और O दोनों सममित हैं, और TOOT एक पैलिंड्रोम है — इसलिए वह दर्पण में अपने जैसा ही रहता है।'],
  'Which of these words looks the same forward and in a mirror: MOM, DOG, CAT?': ['इनमें से कौन-सा शब्द आगे से और दर्पण में एक जैसा दिखता है: MOM, DOG, CAT?', 'M और O दोनों सममित हैं, और MOM एक पैलिंड्रोम है — इसलिए वह दर्पण में अपने जैसा ही रहता है। DOG और CAT में असममित अक्षर हैं और वे पैलिंड्रोम नहीं हैं।'],
  'In a mirror, your left hand appears as your ?': ['दर्पण में आपका बायाँ हाथ आपके किस रूप में दिखाई देता है?', 'दर्पण में बायाँ और दायाँ आपस में बदल जाते हैं — आपका बायाँ हाथ वहाँ दिखता है जहाँ आपका दायाँ हाथ होता।'],
};

function mrPrompt(p) {
  let m;
  if ((m = p.match(/^In a mirror, the letter "(.)" looks like which letter\?$/))) return `दर्पण में अक्षर "${m[1]}" किस अक्षर जैसा दिखता है?`;
  if ((m = p.match(/^In a mirror, the (?:digit|number) "(\d)" would appear \?$/))) return `दर्पण में अंक "${m[1]}" कैसा दिखेगा?`;
  if ((m = p.match(/^In a mirror, the word "(\w+)" appears as \?$/))) return `दर्पण में शब्द "${m[1]}" कैसा दिखाई देता है?`;
  if ((m = p.match(/^Which letter looks the same in a mirror: (\w), (\w), or (\w)\?$/))) return `दर्पण में कौन-सा अक्षर वैसा ही दिखता है: ${m[1]}, ${m[2]}, या ${m[3]}?`;
  if (p === 'Which letter looks exactly the same in a mirror?') return 'दर्पण में कौन-सा अक्षर बिल्कुल वैसा ही दिखता है?';
  if ((m = p.match(/^What is the mirror image of the letter '(.)'\?$/))) return `अक्षर '${m[1]}' का दर्पण-प्रतिबिंब क्या है?`;
  if ((m = p.match(/^In a mirror, your (left|right) (hand|foot) appears as your \?$/))) return `दर्पण में आपका ${m[1] === 'left' ? 'बायाँ' : 'दायाँ'} ${MR_PART[m[2]]} आपके किस रूप में दिखाई देता है?`;
  return null;
}

function mrExp(e) {
  let m;
  if ((m = e.match(/^A mirror flips left and right\. The stroke in "(.)" is on the (left|right) — flipped, it moves to the (left|right), which is exactly "(.)"\.$/))) return `दर्पण बाएँ और दाएँ को उलट देता है। "${m[1]}" की रेखा ${MR_SIDE[m[2]]} ओर है — उलटने पर वह ${MR_SIDE[m[3]]} ओर चली जाती है, जो ठीक "${m[4]}" है।`;
  if ((m = e.match(/^The (?:digit|number) (\d) is not left-right symmetric, so it appears flipped\/reversed in a mirror\.$/))) return `अंक ${m[1]} बाएँ-दाएँ सममित नहीं है, इसलिए वह दर्पण में उलटा/पलटा हुआ दिखता है।`;
  if ((m = e.match(/^(\w) and (\w) are both left-right symmetric letters, and (\w+) reads the same forwards and backwards — so it mirrors to itself: (\w+)\.$/))) return `${m[1]} और ${m[2]} दोनों बाएँ-दाएँ सममित अक्षर हैं, और ${m[3]} आगे-पीछे दोनों ओर से एक जैसा पढ़ा जाता है — इसलिए वह दर्पण में अपने जैसा ही रहता है: ${m[4]}।`;
  if ((m = e.match(/^(\w) is vertically symmetric — its left and right halves (?:are mirror images of each other|mirror each other exactly)\. (\w) and (\w) are not symmetric (?:in )?this way\.$/))) return `${m[1]} ऊर्ध्वाधर रूप से सममित है — इसके बायें और दायें आधे भाग एक-दूसरे के दर्पण-प्रतिबिंब हैं। ${m[2]} और ${m[3]} इस तरह सममित नहीं हैं।`;
  if ((m = e.match(/^(\w) is vertically symmetric — its left and right halves are mirror images of each other\. (\w) and (\w) are not symmetric in this way\.$/))) return null;
  if ((m = e.match(/^(\w) is symmetrical, so its mirror image is the same letter\.$/))) return `${m[1]} सममित है, इसलिए उसका दर्पण-प्रतिबिंब वही अक्षर रहता है।`;
  if ((m = e.match(/^The mirror of '(.)' is '(.)'\.$/))) return `'${m[1]}' का दर्पण-प्रतिबिंब '${m[2]}' है।`;
  if ((m = e.match(/^In a mirror, left and right are swapped — your (left|right) (hand|foot) appears where your (left|right) (?:hand|foot) would be\.$/))) return `दर्पण में बायाँ और दायाँ आपस में बदल जाते हैं — आपका ${m[1] === 'left' ? 'बायाँ' : 'दायाँ'} ${MR_PART[m[2]]} वहाँ दिखता है जहाँ आपका ${m[3] === 'left' ? 'बायाँ' : 'दायाँ'} ${MR_PART[m[2]]} होता।`;
  return null;
}

export function localizeMirror(q) {
  if (q.chapter !== 'mirror-images-basic' || typeof q.prompt !== 'string') return q;
  let hi; let exp;
  const man = MR_MANUAL[q.prompt];
  if (man) { [hi, exp] = man; } else { hi = mrPrompt(q.prompt); exp = mrExp(q.exp); }
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: mrOpt(o) })),
    exp: { en: q.exp, hi: exp },
  };
}

const PT_W = {
  Square: 'चौकोर', Circle: 'वृत्त', Triangle: 'त्रिभुज', Star: 'तारा', Moon: 'चाँद', Sun: 'सूरज', Cloud: 'बादल', Diamond: 'हीरा', Heart: 'दिल',
  Red: 'लाल', Blue: 'नीला', Green: 'हरा', Yellow: 'पीला', Black: 'काला', White: 'सफ़ेद', Grey: 'स्लेटी',
  Tiny: 'बहुत छोटा', Small: 'छोटा', Medium: 'मध्यम', Large: 'बड़ा', 'Extra-large': 'बहुत बड़ा',
  'Back to start': 'शुरुआती स्थिति में वापस', 'Upside down': 'उलटा (ऊपर-नीचे)', Sideways: 'बगल में (आड़ा)',
};
const PT_SH = { square: 'चौकोर', circle: 'वृत्त' };
function ptItem(s) {
  const m = s.match(/^(Tiny|Small|Medium|Large|Extra-large) (square|circle)$/i);
  if (m) return `${PT_W[m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()]} ${PT_SH[m[2].toLowerCase()]}`;
  return PT_W[s] || s;
}
const ptOpt = (o) => ptItem(o);
const ptList = (s) => s.split(', ').map(ptItem).join(', ');
const ptLow = (s) => ptItem(s.charAt(0).toUpperCase() + s.slice(1));

const PT_MANUAL = {
  'A shape grows: 1 dot, 2 dots, 3 dots, 4 dots. How many dots come next?': ['एक आकृति बढ़ती है: 1 बिंदु, 2 बिंदु, 3 बिंदु, 4 बिंदु। अगली आकृति में कितने बिंदु होंगे?', 'हर चरण में एक बिंदु जुड़ता है। अगली आकृति में 5 बिंदु होंगे।'],
  'A line pattern: 1 line, 2 lines, 3 lines. How many lines in the 5th figure?': ['रेखाओं का पैटर्न: 1 रेखा, 2 रेखाएँ, 3 रेखाएँ। 5वीं आकृति में कितनी रेखाएँ होंगी?', 'हर आकृति में एक रेखा जुड़ती है। 5वीं आकृति में 5 रेखाएँ होंगी।'],
  'A shape shrinks: 5 dots, 4 dots, 3 dots, 2 dots. How many dots come next?': ['एक आकृति घटती है: 5 बिंदु, 4 बिंदु, 3 बिंदु, 2 बिंदु। अगली आकृति में कितने बिंदु होंगे?', 'हर चरण में एक बिंदु घटता है। अगली आकृति में 1 बिंदु होगा।'],
  'A dot pattern: 2 dots, 4 dots, 6 dots. How many dots in the 5th figure?': ['बिंदुओं का पैटर्न: 2 बिंदु, 4 बिंदु, 6 बिंदु। 5वीं आकृति में कितने बिंदु होंगे?', 'हर आकृति में 2 बिंदु जुड़ते हैं (सम संख्याएँ)। 5वीं आकृति में 10 बिंदु होंगे।'],
  'A figure has 1 side, then 2 sides, then 3 sides. How many sides does the 6th figure have?': ['एक आकृति में पहले 1 भुजा, फिर 2 भुजाएँ, फिर 3 भुजाएँ हैं। 6वीं आकृति में कितनी भुजाएँ होंगी?', 'हर आकृति में एक भुजा जुड़ती है। 6वीं आकृति में 6 भुजाएँ होंगी।'],
  'A shape doubles in size each step: small, medium, large, ? -- what comes next?': ['एक आकृति हर चरण में आकार में दोगुनी होती है: छोटा, मध्यम, बड़ा, ? — आगे क्या आएगा?', 'हर चरण में आकार दोगुना होता है। अगला आकार बहुत बड़ा होगा।'],
  'A pattern grows by 3 each time: 3, 6, 9, 12. What comes next in the sequence of shapes?': ['एक पैटर्न हर बार 3 से बढ़ता है: 3, 6, 9, 12। आकृतियों के क्रम में आगे क्या आएगा?', 'हर चरण में 3 जुड़ता है। अगला है 12 + 3 = 15।'],
  'A line grows: 2 lines, 4 lines, 6 lines, 8 lines. How many lines in the next figure?': ['एक रेखा-पैटर्न बढ़ता है: 2 रेखाएँ, 4 रेखाएँ, 6 रेखाएँ, 8 रेखाएँ। अगली आकृति में कितनी रेखाएँ होंगी?', 'हर आकृति में 2 रेखाएँ जुड़ती हैं। अगली आकृति में 10 रेखाएँ होंगी।'],
  'A shape shrinks by half each step: large, medium, small, ? -- what comes next?': ['एक आकृति हर चरण में आधी होती जाती है: बड़ा, मध्यम, छोटा, ? — आगे क्या आएगा?', 'हर चरण में आकार आधा हो जाता है। अगला आकार बहुत छोटा होगा।'],
  'A dot pattern: 1, 3, 5, 7 dots (odd numbers). How many dots in the 5th figure?': ['बिंदुओं का पैटर्न: 1, 3, 5, 7 बिंदु (विषम संख्याएँ)। 5वीं आकृति में कितने बिंदु होंगे?', 'पैटर्न विषम संख्याओं का है, हर बार +2। 5वीं आकृति में 9 बिंदु होंगे।'],
  'A pattern rotates 90° each time. After 4 rotations, what happens?': ['एक पैटर्न हर बार 90° घूमता है। 4 बार घूमने के बाद क्या होता है?', '4 × 90° = 360°, यानी पूरा एक चक्कर — आकृति ठीक उसी स्थिति में वापस आ जाती है जहाँ से शुरू हुई थी।'],
  'Triangle, Triangle, Square, Triangle, Triangle, Square, ? — what comes next?': ['त्रिभुज, त्रिभुज, चौकोर, त्रिभुज, त्रिभुज, चौकोर, ? — आगे क्या आएगा?', 'पैटर्न 3 के समूहों में दोहराता है (त्रिभुज, त्रिभुज, चौकोर)। 7वीं वस्तु नया समूह शुरू करती है — त्रिभुज।'],
  'Star, Star, Moon, Star, Star, Moon, Star, ? — what comes next?': ['तारा, तारा, चाँद, तारा, तारा, चाँद, तारा, ? — आगे क्या आएगा?', 'पैटर्न दोहराता है: तारा, तारा, चाँद। 7वीं वस्तु (तारा) के बाद 8वीं वस्तु अगले समूह को जारी रखती है — तारा।'],
  'Square, Square, Square, Circle, Square, Square, Square, ? -- what comes next?': ['चौकोर, चौकोर, चौकोर, वृत्त, चौकोर, चौकोर, चौकोर, ? — आगे क्या आएगा?', 'पैटर्न 4 के समूहों में दोहराता है (3 चौकोर, 1 वृत्त)। 7वीं वस्तु के बाद 8वीं वस्तु उस समूह को पूरा करती है — वृत्त।'],
};

function ptPrompt(p) {
  let m;
  if ((m = p.match(/^A (\w+), then a (\w+), then a (\w+), then a (\w+)\. What comes next\?$/))) return `एक ${ptLow(m[1])}, फिर एक ${ptLow(m[2])}, फिर एक ${ptLow(m[3])}, फिर एक ${ptLow(m[4])}। आगे क्या आएगा?`;
  if ((m = p.match(/^(.+), \? (?:—|--) what (colou?r )?comes next( in the size pattern)?\?$/))) return `${ptList(m[1])}, ? — आगे ${m[2] ? 'कौन-सा रंग' : 'क्या'} आएगा${m[3] ? ' (आकार के पैटर्न में)' : ''}?`;
  if ((m = p.match(/^A pattern rotates (\d+)(?:°| degrees) each time\. After (\d+) rotations, what happens\?$/))) return `एक पैटर्न हर बार ${m[1]}° घूमता है। ${m[2]} बार घूमने के बाद क्या होता है?`;
  if ((m = p.match(/^Complete the pattern: ([\d, ]+), \?$/))) return `पैटर्न पूरा कीजिए: ${m[1]}, ?`;
  return null;
}

function ptExp(e) {
  let m;
  if ((m = e.match(/^The pattern alternates ([\w ]+(?:, [\w ]+)*)\.\.\. The next is (\w+)\.$/))) return `पैटर्न बारी-बारी से चलता है: ${ptList(m[1])}... अगला ${ptItem(m[2])} है।`;
  if ((m = e.match(/^The pattern repeats in groups of 3 \(([\w, ]+)\)\. The 7th item starts a new group -- (\w+)\.$/))) return `पैटर्न 3 के समूहों में दोहराता है (${ptList(m[1])})। 7वीं वस्तु नया समूह शुरू करती है — ${ptItem(m[2])}।`;
  if ((m = e.match(/^The pattern repeats: ([\w, ]+)\. After the 7th item \((\w+)\), the 8th continues the next group -- (\w+)\.$/))) return `पैटर्न दोहराता है: ${ptList(m[1])}। 7वीं वस्तु (${ptItem(m[2])}) के बाद 8वीं वस्तु अगले समूह को जारी रखती है — ${ptItem(m[3])}।`;
  if ((m = e.match(/^The (squares|circles) grow in size one step at a time\. The next is an? ([\w-]+) (square|circle)\.$/))) return `आकार एक-एक चरण में बढ़ता है। अगला ${ptItem(m[2].charAt(0).toUpperCase() + m[2].slice(1))} ${PT_SH[m[3]]} है।`;
  if ((m = e.match(/^(\d+) x (\d+) = 360 degrees, a complete full rotation -- the shape is back exactly where it started\.$/))) return `${m[1]} × ${m[2]} = 360°, यानी पूरा एक चक्कर — आकृति ठीक उसी स्थिति में वापस आ जाती है जहाँ से शुरू हुई थी।`;
  if ((m = e.match(/^Each number goes up by (\d+)\.$/))) return `हर संख्या ${m[1]} से बढ़ती है।`;
  if ((m = e.match(/^Each number is the sum of the two numbers before it\. Next: (\d+)\.$/))) return `हर संख्या अपने पिछली दो संख्याओं का योग है। अगली संख्या: ${m[1]}।`;
  if (e === 'Each number is multiplied by 2.') return 'हर संख्या को 2 से गुणा किया जाता है।';
  return null;
}

export function localizePattern(q) {
  if (q.chapter !== 'pattern-completion' || typeof q.prompt !== 'string') return q;
  let hi; let exp;
  const man = PT_MANUAL[q.prompt];
  if (man) { [hi, exp] = man; } else { hi = ptPrompt(q.prompt); exp = ptExp(q.exp); }
  if (!hi || !exp) return q;
  return {
    ...q,
    prompt: { en: q.prompt, hi },
    options: q.options.map((o) => ({ en: o, hi: ptOpt(o) })),
    exp: { en: q.exp, hi: exp },
  };
}
