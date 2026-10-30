// Hindi for Reasoning Level 2. Answers keep their English key; only display text gets a Hindi side.

const W = {
  Newspaper: 'समाचार-पत्र', Television: 'टेलीविज़न', Radio: 'रेडियो', Telephone: 'टेलीफ़ोन', Square: 'वर्ग', Rectangle: 'आयत',
  Rhombus: 'समचतुर्भुज', Circle: 'वृत्त', Mercury: 'बुध', Venus: 'शुक्र', Moon: 'चंद्रमा', Mars: 'मंगल', Poet: 'कवि', Author: 'लेखक',
  Sculptor: 'मूर्तिकार', Reader: 'पाठक', Laugh: 'हँसना', Cry: 'रोना', Run: 'दौड़ना', Smile: 'मुस्कुराना', Wool: 'ऊन', Cotton: 'कपास',
  Silk: 'रेशम', Nylon: 'नायलॉन', Diameter: 'व्यास', Radius: 'त्रिज्या', Circumference: 'परिधि', Novel: 'उपन्यास', Biography: 'जीवनी',
  Encyclopedia: 'विश्वकोश', Pen: 'कलम', Whale: 'व्हेल', Dolphin: 'डॉल्फ़िन', Shark: 'शार्क', Seal: 'सील', Democracy: 'लोकतंत्र',
  Monarchy: 'राजतंत्र', Dictatorship: 'तानाशाही', Election: 'चुनाव', Kilometre: 'किलोमीटर', Litre: 'लीटर', Metre: 'मीटर',
  Centimetre: 'सेंटीमीटर', Oxygen: 'ऑक्सीजन', Nitrogen: 'नाइट्रोजन', Hydrogen: 'हाइड्रोजन', Water: 'पानी', Polyester: 'पॉलिएस्टर',
  Triangle: 'त्रिभुज', Pentagon: 'पंचभुज', Hexagon: 'षट्भुज', Sphere: 'गोला', Jupiter: 'बृहस्पति', Saturn: 'शनि', Sun: 'सूर्य',
  Lion: 'शेर', Tiger: 'बाघ', Leopard: 'तेंदुआ', Crocodile: 'मगरमच्छ', Himalayas: 'हिमालय', Alps: 'आल्प्स', Andes: 'एंडीज़',
  Sahara: 'सहारा', Trapezium: 'समलंब', Cube: 'घन', Penguin: 'पेंगुइन', Ostrich: 'शुतुरमुर्ग', Kiwi: 'कीवी', Eagle: 'चील',
  Addition: 'जोड़', Subtraction: 'घटाव', Multiplication: 'गुणा', Number: 'संख्या', Piano: 'पियानो', Violin: 'वायलिन',
  Trumpet: 'तुरही', Painting: 'चित्रकला', Magazine: 'पत्रिका', Textbook: 'पाठ्यपुस्तक', Bicycle: 'साइकिल', Solar: 'सौर',
  Wind: 'पवन', Hydro: 'जल', Table: 'मेज़',
};
const wd = (s) => W[s] || s;
const bi = (q, hi, exp, optMap = wd) => ({
  ...q,
  prompt: { en: q.prompt, hi },
  options: q.options.map((o) => (typeof o === 'string' ? { en: o, hi: optMap(o) } : { ...o, en: o.label ?? o.en, hi: optMap(o.label ?? o.en) })),
  exp: { en: q.exp, hi: exp },
});

// ── Odd One Out (L2) ──
const OO_EXP = {
  'Which does not belong: Newspaper, Television, Radio, Telephone?': 'समाचार-पत्र, टेलीविज़न और रेडियो — तीनों जनसंचार माध्यम हैं; ये एक ही सूचना एक साथ बहुत लोगों तक पहुँचाते हैं (एक-से-अनेक)। टेलीफ़ोन दो व्यक्तियों के बीच द्विमार्गी, आमने-सामने का संचार है, प्रसारण माध्यम नहीं — यही अंतर है।',
  'Which does not belong: Square, Rectangle, Rhombus, Circle?': 'वर्ग, आयत और समचतुर्भुज — तीनों चतुर्भुज हैं, यानी 4 सीधी भुजाओं वाली आकृतियाँ। वृत्त की कोई सीधी भुजा नहीं होती, इसलिए वह इस समूह का नहीं है।',
  'Which does not belong: Mercury, Venus, Moon, Mars?': 'बुध, शुक्र और मंगल ग्रह हैं जो सीधे सूर्य की परिक्रमा करते हैं। चंद्रमा एक प्राकृतिक उपग्रह है — वह पृथ्वी की परिक्रमा करता है, सूर्य की नहीं — इसलिए वह दूसरी श्रेणी का है।',
  'Which does not belong: Poet, Author, Sculptor, Reader?': 'कवि, लेखक और मूर्तिकार — तीनों कुछ रचते हैं: कविता, पुस्तक, मूर्ति। पाठक दूसरों की रची चीज़ का उपभोग करता है, खुद कुछ नहीं रचता, इसलिए वही अलग है।',
  'Which does not belong: 8, 27, 64, 100?': '8, 27 और 64 पूर्ण घन हैं (2³, 3³, 4³)। 100 पूर्ण घन नहीं है — इसके सबसे निकट घन 64 (4³) और 125 (5³) हैं — भले ही वह पूर्ण वर्ग (10²) है, इसलिए वह पैटर्न तोड़ता है।',
  'Which does not belong: Laugh, Cry, Run, Smile?': 'हँसना, रोना और मुस्कुराना — तीनों चेहरे से भावना व्यक्त करने के तरीके हैं। दौड़ना एक शारीरिक क्रिया है जिसका भावनाएँ व्यक्त करने से कोई संबंध नहीं — यही अंतर है।',
  'Which does not belong: Wool, Cotton, Silk, Nylon?': 'ऊन, कपास और रेशम — तीनों प्राकृतिक रेशे हैं: ऊन जानवरों से, कपास पौधों से और रेशम कीड़ों से मिलता है। नायलॉन एक कृत्रिम (मानव-निर्मित) रेशा है, जो रासायनिक रूप से बनाया जाता है, उगाया नहीं जाता।',
  'Which does not belong: 2, 3, 5, 9?': '2, 3 और 5 अभाज्य संख्याएँ हैं — केवल 1 और स्वयं से विभाज्य। 9 भी 3 से विभाज्य है (9 = 3×3), इसलिए वह भाज्य संख्या है, अभाज्य नहीं।',
  'Which does not belong: Diameter, Radius, Circumference, Square?': 'व्यास, त्रिज्या और परिधि — तीनों वृत्त के माप/भाग हैं। वर्ग बिल्कुल अलग आकृति है।',
  'Which does not belong: Novel, Biography, Encyclopedia, Pen?': 'उपन्यास, जीवनी और विश्वकोश — तीनों लिखित पुस्तकों के प्रकार हैं। कलम लिखने का साधन है, पुस्तक का प्रकार नहीं।',
  'Which does not belong: Whale, Dolphin, Shark, Seal?': 'व्हेल, डॉल्फ़िन और सील — तीनों जल में रहने वाले स्तनधारी हैं। शार्क मछली है, स्तनधारी नहीं।',
  'Which does not belong: Democracy, Monarchy, Dictatorship, Election?': 'लोकतंत्र, राजतंत्र और तानाशाही — तीनों शासन-प्रणालियाँ हैं। चुनाव एक प्रक्रिया है, शासन-प्रणाली नहीं।',
  'Which does not belong: 16, 25, 36, 40?': '16, 25 और 36 पूर्ण वर्ग हैं (4 का वर्ग, 5 का वर्ग, 6 का वर्ग)। 40 पूर्ण वर्ग नहीं है।',
  'Which does not belong: Kilometre, Litre, Metre, Centimetre?': 'किलोमीटर, मीटर और सेंटीमीटर — तीनों लंबाई/दूरी मापते हैं। लीटर आयतन मापता है, जो अलग राशि है।',
  'Which does not belong: Oxygen, Nitrogen, Hydrogen, Water?': 'ऑक्सीजन, नाइट्रोजन और हाइड्रोजन तत्व हैं। पानी एक यौगिक है जो दो तत्वों के मेल से बना है।',
  'Which does not belong: 3, 5, 7, 10?': '3, 5 और 7 विषम अभाज्य संख्याएँ हैं। 10 सम है और अभाज्य नहीं।',
  'Which does not belong: Cotton, Wool, Polyester, Silk?': 'कपास, ऊन और रेशम — तीनों प्राकृतिक रेशे हैं। पॉलिएस्टर कृत्रिम, मानव-निर्मित रेशा है।',
  'Which does not belong: Triangle, Pentagon, Hexagon, Sphere?': 'त्रिभुज, पंचभुज और षट्भुज — तीनों समतल, द्विविमीय बहुभुज हैं। गोला एक ठोस, त्रिविमीय आकृति है।',
  'Which does not belong: Jupiter, Saturn, Mars, Sun?': 'बृहस्पति, शनि और मंगल — तीनों ग्रह हैं। सूर्य एक तारा है, ग्रह नहीं।',
  'Which does not belong: Lion, Tiger, Leopard, Crocodile?': 'शेर, बाघ और तेंदुआ — तीनों बड़ी बिल्लियाँ (स्तनधारी) हैं। मगरमच्छ सरीसृप है।',
  'Which does not belong: Himalayas, Alps, Andes, Sahara?': 'हिमालय, आल्प्स और एंडीज़ — तीनों पर्वत श्रृंखलाएँ हैं। सहारा एक रेगिस्तान है, पर्वत श्रृंखला नहीं।',
  'Which does not belong: 121, 144, 169, 150?': '121, 144 और 169 पूर्ण वर्ग हैं (11 का वर्ग, 12 का वर्ग, 13 का वर्ग)। 150 पूर्ण वर्ग नहीं है।',
  'Which does not belong: Rectangle, Rhombus, Trapezium, Cube?': 'आयत, समचतुर्भुज और समलंब — तीनों समतल, द्विविमीय चतुर्भुज हैं। घन एक ठोस, त्रिविमीय आकृति है।',
  'Which does not belong: Penguin, Ostrich, Kiwi, Eagle?': 'पेंगुइन, शुतुरमुर्ग और कीवी — तीनों उड़ने में असमर्थ पक्षी हैं। चील उड़ सकती है, इसलिए वही अलग है।',
  'Which does not belong: Addition, Subtraction, Multiplication, Number?': 'जोड़, घटाव और गुणा — तीनों गणितीय संक्रियाएँ हैं। संख्या वह चीज़ है जिस पर संक्रिया की जाती है, स्वयं संक्रिया नहीं।',
  'Which does not belong: Piano, Violin, Trumpet, Painting?': 'पियानो, वायलिन और तुरही — तीनों वाद्य-यंत्र हैं। चित्रकला एक दृश्य कला है, वाद्य-यंत्र नहीं।',
  'Which does not belong: Newspaper, Magazine, Textbook, Bicycle?': 'समाचार-पत्र, पत्रिका और पाठ्यपुस्तक — तीनों पढ़ने की चीज़ें हैं। साइकिल एक वाहन है, पढ़ने की सामग्री नहीं।',
  'Which does not belong: Solar, Wind, Hydro, Table?': 'सौर, पवन और जल — तीनों नवीकरणीय ऊर्जा के प्रकार हैं। मेज़ फ़र्नीचर है, ऊर्जा से उसका कोई संबंध नहीं।',
};
const NUMCAT = {
  'cube numbers': ['घन संख्याएँ', 'घन संख्या'], 'prime numbers': ['अभाज्य संख्याएँ', 'अभाज्य संख्या'],
  'even multiples of 3': ['3 के सम गुणज', '3 का सम गुणज'], 'multiples of 5': ['5 के गुणज', '5 का गुणज'],
  'triangular numbers': ['त्रिकोणीय संख्याएँ', 'त्रिकोणीय संख्या'], 'square numbers': ['वर्ग संख्याएँ', 'वर्ग संख्या'],
};
export function localizeOddL2(q) {
  if (q.chapter !== 'odd-one-out-l2' || typeof q.prompt !== 'string') return q;
  let m;
  if ((m = q.prompt.match(/^Which does not belong: (.+)\?$/)) && OO_EXP[q.prompt]) {
    return bi(q, `कौन-सा समूह का नहीं है: ${m[1].split(', ').map(wd).join(', ')}?`, OO_EXP[q.prompt]);
  }
  if ((m = q.prompt.match(/^Which number does not belong: (.+)\?$/))) {
    const e = q.exp.match(/^([\d, ]+) are ([a-z0-9 ]+)\. (\d+) is ([a-z0-9 ]+), not ([a-z0-9 ]+)\.$/);
    if (!e || !NUMCAT[e[2]] || !NUMCAT[e[4]]) return q;
    return bi(q, `कौन-सी संख्या समूह की नहीं है: ${m[1]}?`, `${e[1]} ${NUMCAT[e[2]][0]} हैं। ${e[3]} एक ${NUMCAT[e[4]][1]} है, ${NUMCAT[e[2]][1]} नहीं।`, (o) => o);
  }
  return q;
}


// ── Number Series (L2) ──
const NS_MANUAL = {
  '3, 6, 12, 24, ?': 'हर संख्या अपनी पिछली संख्या की दोगुनी है: 3→6→12→24। 24 को दोगुना करने पर 48 मिलता है।',
  '1, 4, 9, 16, ?': 'ये पूर्ण वर्ग हैं: 1², 2², 3², 4²। अगली संख्या 5² = 25 है।',
  '2, 3, 5, 8, 13, ?': 'हर संख्या अपनी पिछली दो संख्याओं का योग है (फ़िबोनाची जैसा नियम): 8 + 13 = 21।',
  '81, 27, 9, 3, ?': 'हर संख्या अपनी पिछली संख्या को 3 से भाग देने पर मिलती है: 81→27→9→3, इसलिए 3÷3 = 1।',
  '2, 6, 12, 20, 30, ?': 'संख्याओं के बीच का अंतर हर बार 2 बढ़ता है: +4, +6, +8, +10 — इसलिए अगला अंतर +12 है, यानी 30 + 12 = 42। (इसे 1×2, 2×3, 3×4, 4×5, 5×6 → 6×7 = 42 के रूप में भी देखा जा सकता है।)',
  '1, 1, 2, 3, 5, 8, ?': 'यह प्रसिद्ध फ़िबोनाची अनुक्रम है — हर संख्या पिछली दो संख्याओं का योग है: 5 + 8 = 13।',
  '5, 11, 23, 47, ?': 'हर संख्या पिछली संख्या की दोगुनी में 1 जोड़ने पर मिलती है: 5→11 (5×2+1), 11→23, 23→47 — इसलिए 47×2+1 = 95।',
  '144, 121, 100, 81, ?': 'ये पूर्ण वर्ग घटते क्रम में हैं: 12², 11², 10², 9²। अगली संख्या 8² = 64 है।',
  '36, 49, 64, 81, ?': 'ये पूर्ण वर्ग हैं: 6 के वर्ग से 9 के वर्ग तक। अगली संख्या 10 का वर्ग = 100 है।',
  '1, 3, 6, 10, ?': 'अंतर बढ़ते जाते हैं: +2, +3, +4। पैटर्न के अनुसार अगला अंतर +5 है, यानी 10 + 5 = 15।',
  '9, 16, 25, 36, ?': 'ये पूर्ण वर्ग हैं: 3 के वर्ग से 6 के वर्ग तक। अगली संख्या 7 का वर्ग = 49 है।',
  '4, 8, 16, 32, ?': 'हर संख्या दोगुनी होती है: 4→8→16→32। 32 को दोगुना करने पर 64 मिलता है।',
  '2, 3, 5, 8, ?': 'अंतर बढ़ते जाते हैं: +1, +2, +3। पैटर्न के अनुसार अगला अंतर +4 है, यानी 8 + 4 = 12।',
  '5, 10, 20, 40, ?': 'हर संख्या दोगुनी होती है: 5→10→20→40, इसलिए 40 × 2 = 80।',
  '2, 4, 8, 16, 32, ?': 'हर संख्या दोगुनी होती है: 2→4→8→16→32, इसलिए 32 × 2 = 64।',
  '7, 14, 28, 56, ?': 'हर संख्या दोगुनी होती है: 7→14→28→56, इसलिए 56 × 2 = 112।',
  '1000, 500, 250, 125, ?': 'हर संख्या आधी होती है: 1000→500→250→125, इसलिए 125 ÷ 2 = 62.5।',
  '2, 4, 7, 11, 16, ?': 'अंतर हर बार 1 बढ़ता है: +2, +3, +4, +5, इसलिए अगला अंतर +6 है, यानी 16 + 6 = 22।',
  '1, 3, 6, 10, 15, ?': 'ये त्रिकोणीय संख्याएँ हैं: अंतर हर बार 1 बढ़ता है (+2, +3, +4, +5, +6)। 15 + 6 = 21।',
  '3, 9, 27, 81, ?': 'हर संख्या को 3 से गुणा किया जाता है: 3→9→27→81, इसलिए 81 × 3 = 243।',
  '6, 11, 21, 41, ?': 'हर संख्या पिछली संख्या की दोगुनी में से 1 घटाने पर मिलती है: 6→11 (6×2−1), 11→21, 21→41, इसलिए 41×2−1 = 81।',
  '100, 50, 25, 12.5, ?': 'हर संख्या आधी होती है: 100→50→25→12.5, इसलिए 12.5 ÷ 2 = 6.25।',
  '2, 5, 11, 23, 47, ?': 'हर संख्या पिछली संख्या की दोगुनी में 1 जोड़ने पर मिलती है: 2→5, 5→11, 11→23, 23→47, इसलिए 47×2+1 = 95।',
  '1, 2, 6, 24, ?': 'हर संख्या को अगली गिनती वाली संख्या से गुणा किया जाता है: ×2, ×3, ×4, ×5। इसलिए 24 × 5 = 120 (यह 5 का क्रमगुणित है)।',
  '225, 196, 169, 144, ?': 'ये पूर्ण वर्ग घटते क्रम में हैं: 15 का वर्ग, 14 का वर्ग, 13 का वर्ग, 12 का वर्ग। अगली संख्या 11 का वर्ग = 121 है।',
  '4, 12, 36, 108, ?': 'हर संख्या को 3 से गुणा किया जाता है: 4→12→36→108, इसलिए 108 × 3 = 324।',
  '8, 27, 64, 125, ?': 'ये पूर्ण घन हैं: 2 का घन, 3 का घन, 4 का घन, 5 का घन। अगली संख्या 6 का घन = 216 है।',
};
const NS_RULE = [
  [/^Each number is the sum of the two before it\. Next: (\d+)\.$/, (m) => `हर संख्या अपनी पिछली दो संख्याओं का योग है। अगली संख्या: ${m[1]}।`],
  [/^Each number is double the previous one plus 1\. Next: (\d+)\.$/, (m) => `हर संख्या पिछली संख्या की दोगुनी में 1 जोड़ने पर मिलती है। अगली संख्या: ${m[1]}।`],
  [/^Each number is 3 times the previous one minus 1\. Next: (\d+)\.$/, (m) => `हर संख्या पिछली संख्या के 3 गुने में से 1 घटाने पर मिलती है। अगली संख्या: ${m[1]}।`],
  [/^The gaps grow by 2 each time: 2, 4, 6, then 8\. Next: (\d+)\.$/, (m) => `अंतर हर बार 2 बढ़ता है: 2, 4, 6, फिर 8। अगली संख्या: ${m[1]}।`],
  [/^Each number is a square plus 1\. Next: (\d+)\.$/, (m) => `हर संख्या एक वर्ग संख्या में 1 जोड़ने पर मिलती है। अगली संख्या: ${m[1]}।`],
];
export function localizeNumSeriesL2(q) {
  if (q.chapter !== 'number-series-l2' || typeof q.prompt !== 'string') return q;
  const p = q.prompt.replace(/^What comes next: /, '');
  const head = q.prompt.startsWith('What comes next: ') ? `आगे क्या आएगा: ${p}` : `श्रृंखला पूरी कीजिए: ${p}`;
  let exp = NS_MANUAL[q.prompt];
  if (!exp) { for (const [re, f] of NS_RULE) { const m = q.exp.match(re); if (m) { exp = f(m); break; } } }
  if (!exp) return q;
  return bi(q, head, exp, (o) => o);
}

// ── Analogies (L2) ──
const AW = {
  Author: 'लेखक', Novel: 'उपन्यास', Composer: 'संगीत-रचयिता', Symphony: 'सिम्फ़नी', Concert: 'संगीत समारोह', Instrument: 'वाद्य-यंत्र',
  Marathon: 'मैराथन', Running: 'दौड़', Regatta: 'नौका-दौड़', Rowing: 'नौकायन', Swimming: 'तैराकी', Cycling: 'साइकिल चलाना', Paw: 'पंजा',
  Cat: 'बिल्ली', Hoof: 'खुर', Horse: 'घोड़ा', Dog: 'कुत्ता', Cow: 'गाय', Coward: 'कायर', Bravery: 'बहादुरी', Miser: 'कंजूस',
  Generosity: 'उदारता', Money: 'पैसा', Fear: 'डर', Earthquake: 'भूकंप', Seismograph: 'भूकंपमापी', Heart: 'हृदय', ECG: 'ईसीजी',
  Stethoscope: 'स्टेथोस्कोप', 'X-Ray': 'एक्स-रे', Microscope: 'सूक्ष्मदर्शी', Small: 'छोटा', Telescope: 'दूरबीन', Distant: 'दूर का',
  Large: 'बड़ा', Dark: 'अंधेरा', Carpenter: 'बढ़ई', Wood: 'लकड़ी', Mason: 'राजमिस्त्री', Bricks: 'ईंटें', Steel: 'इस्पात', Glass: 'काँच',
  Hunger: 'भूख', Food: 'भोजन', Thirst: 'प्यास', Water: 'पानी', Sleep: 'नींद', Rest: 'आराम', Tailor: 'दर्ज़ी', Needle: 'सुई',
  Chisel: 'छेनी', Nail: 'कील', Sculptor: 'मूर्तिकार', Painter: 'चित्रकार', Brush: 'कूची', Canvas: 'कैनवास', Colour: 'रंग',
  Optimist: 'आशावादी', Hope: 'आशा', Pessimist: 'निराशावादी', Sadness: 'उदासी', Despair: 'निराशा', Anger: 'क्रोध', Cub: 'शावक',
  Lion: 'शेर', Fawn: 'हिरन का बच्चा', Sheep: 'भेड़', Goat: 'बकरी', Deer: 'हिरन', Library: 'पुस्तकालय', Books: 'किताबें', Museum: 'संग्रहालय',
  Building: 'इमारत', Artifacts: 'कलाकृतियाँ', Visitors: 'आगंतुक', Caterpillar: 'इल्ली', Butterfly: 'तितली', Tadpole: 'टैडपोल',
  Frog: 'मेंढक', Fish: 'मछली', Toad: 'टोड', Frugal: 'मितव्ययी', Spendthrift: 'फ़िज़ूलखर्च', Timid: 'डरपोक', Shy: 'शर्मीला', Bold: 'साहसी',
  Quiet: 'शांत', Vaccine: 'टीका', Disease: 'बीमारी', Umbrella: 'छाता', Sun: 'सूरज', Wind: 'हवा', Rain: 'बारिश', Ounce: 'औंस',
  Weight: 'वज़न', Inch: 'इंच', Area: 'क्षेत्रफल', Length: 'लंबाई', Volume: 'आयतन', Compass: 'कम्पास', Direction: 'दिशा', Map: 'नक्शा',
  Distance: 'दूरी', Speed: 'गति', Location: 'स्थान', Bouquet: 'गुलदस्ता', Flowers: 'फूल', Herd: 'झुंड', Cattle: 'पशु', Grass: 'घास',
  Farm: 'खेत', Puppy: 'पिल्ला', Bark: 'भौंकना', Kitten: 'बिल्ली का बच्चा', Purr: 'घुरघुराना', Meow: 'म्याऊँ', Hiss: 'फुफकार',
  Rehearsal: 'पूर्वाभ्यास', Performance: 'प्रदर्शन', Draft: 'मसौदा', Pencil: 'पेंसिल', Editor: 'संपादक', 'Final Copy': 'अंतिम प्रति',
  Antidote: 'प्रतिकारक', Poison: 'ज़हर', Cure: 'इलाज', Doctor: 'डॉक्टर', Medicine: 'दवा', Glacier: 'हिमनद', Ice: 'बर्फ़',
  Volcano: 'ज्वालामुखी', Mountain: 'पर्वत', Lava: 'लावा', Ash: 'राख', Ticket: 'टिकट', Entry: 'प्रवेश', Password: 'पासवर्ड',
  Computer: 'कंप्यूटर', Security: 'सुरक्षा', Access: 'पहुँच', Cocoon: 'कोकून', Moth: 'पतंगा', Shell: 'खोल', Egg: 'अंडा',
  Turtle: 'कछुआ', Snail: 'घोंघा', Apprentice: 'प्रशिक्षु', Master: 'उस्ताद', Student: 'छात्र', School: 'विद्यालय', Teacher: 'शिक्षक',
  Book: 'किताब', Thermometer: 'थर्मामीटर', Temperature: 'तापमान', Speedometer: 'स्पीडोमीटर', Car: 'कार', Recipe: 'विधि', Cook: 'रसोइया',
  'Sheet Music': 'संगीत-लिपि', Musician: 'संगीतकार', Oven: 'ओवन', Bake: 'सेंकना', Fridge: 'फ़्रिज', Cool: 'ठंडा करना', Bow: 'धनुष',
  Arrow: 'तीर', Gun: 'बंदूक', Plant: 'पौधा', Bird: 'पक्षी', Bullet: 'गोली', Snake: 'साँप', Roar: 'दहाड़', Court: 'न्यायालय',
  Seed: 'बीज', Tree: 'पेड़', Key: 'चाबी', Lock: 'ताला', Hammer: 'हथौड़ा', Sunscreen: 'सनस्क्रीन', Scientist: 'वैज्ञानिक',
  Laboratory: 'प्रयोगशाला', Judge: 'न्यायाधीश', Clock: 'घड़ी', Time: 'समय', Librarian: 'पुस्तकालयाध्यक्ष', Chef: 'रसोइया (शेफ़)',
  Architect: 'वास्तुकार', Music: 'संगीत', Scalpel: 'शल्य-चाकू', Surgeon: 'शल्य-चिकित्सक', Poem: 'कविता', Astronomer: 'खगोलशास्त्री',
  Star: 'तारा', Botanist: 'वनस्पतिशास्त्री', Freeze: 'जमना', Geologist: 'भूवैज्ञानिक', Rock: 'चट्टान', Ornithologist: 'पक्षी-विज्ञानी',
  Heat: 'गर्मी', Melt: 'पिघलना', Cold: 'ठंड', Pilot: 'पायलट', Aircraft: 'विमान', Driver: 'चालक', Chapter: 'अध्याय', Verse: 'पद',
};
const aw = (s) => AW[s] || s;
const AN_MANUAL = {
  'Author is to Novel as Composer is to ?': 'लेखक उपन्यास लिखता है — यह तैयार रचनात्मक कृति है। संगीत-रचयिता सिम्फ़नी रचता है — यह भी स्वयं तैयार कृति है। संगीत समारोह वह आयोजन है जहाँ उसे प्रस्तुत किया जाता है, और वाद्य-यंत्र केवल एक साधन है, रची हुई कृति नहीं।',
  'Marathon is to Running as Regatta is to ?': 'मैराथन दौड़ पर आधारित प्रतियोगिता है। नौका-दौड़ नावों पर आधारित प्रतियोगिता है — विशेषकर नौकायन (या पाल-नौकायन) पर — इसलिए यही मेल खाता खेल है।',
  'Paw is to Cat as Hoof is to ?': 'यहाँ ईमानदारी से कहें तो — गाय के भी खुर होते हैं, इसलिए पहली नज़र में यह अस्पष्ट लग सकता है। अंतर यह है: घोड़े का खुर एक ठोस, अखंड खुर होता है, जबकि गाय का खुर विभाजित (फटा हुआ) होता है — और ऐसे सादृश्य प्रश्नों में इसी ठोस, एकल खुर की बनावट के कारण "घोड़ा" ही मानक, पारंपरिक जोड़ी मानी जाती है।',
  'Coward is to Bravery as Miser is to ?': 'कायर में बहादुरी की कमी होती है। कंजूस में उदारता की कमी होती है — वह पैसा बाँटने के बजाय जमा करता है। पैसा और डर व्यक्ति का वर्णन करते हैं, कमी वाले गुण का नहीं।',
  'Earthquake is to Seismograph as Heart is to ?': 'भूकंपमापी केवल भूकंप का पता नहीं लगाता, वह समय के साथ गतिविधि को दर्ज करके उसका ग्राफ़ बनाता है। ईसीजी हृदय के लिए यही करता है — वह हृदय की विद्युतीय गतिविधि को ग्राफ़ के रूप में दर्ज करता है। स्टेथोस्कोप से केवल सुना जा सकता है, वह दर्ज किया हुआ माप नहीं देता — इसीलिए ईसीजी अधिक निकट का मेल है।',
  'Microscope is to Small as Telescope is to ?': 'सूक्ष्मदर्शी उन चीज़ों को देखने में मदद करता है जो सामान्य रूप से देखने के लिए बहुत छोटी हैं। दूरबीन उन चीज़ों को देखने में मदद करती है जो सामान्य रूप से देखने के लिए बहुत दूर हैं — यह जोड़ी इस बारे में है कि हर यंत्र किस प्रकार की वस्तु दिखाता है, चीज़ों को बड़ा करने के बारे में नहीं।',
  'Carpenter is to Wood as Mason is to ?': 'बढ़ई की मुख्य सामग्री लकड़ी है। राजमिस्त्री की मुख्य सामग्री ईंटें (या पत्थर) हैं — यही उसकी समकक्ष सामग्री है।',
  'Hunger is to Food as Thirst is to ?': 'भूख भोजन से मिटती है। प्यास पानी से बुझती है — वही "आवश्यकता और उसका समाधान" वाला संबंध।',
  'Tailor is to Needle as Carpenter is to ?': 'दर्ज़ी का ज़रूरी औज़ार सुई है। बढ़ई का ज़रूरी औज़ार छेनी है — औज़ार और कारीगर का संबंध।',
  'Sculptor is to Chisel as Painter is to ?': 'मूर्तिकार का औज़ार छेनी है। चित्रकार का औज़ार कूची है — औज़ार और कारीगर का संबंध।',
  'Optimist is to Hope as Pessimist is to ?': 'आशावादी की पहचान आशा से होती है। निराशावादी की पहचान निराशा से होती है — मेल खाता भावनात्मक दृष्टिकोण।',
  'Cub is to Lion as Fawn is to ?': 'शावक शेर का बच्चा है। हिरन का बच्चा (फ़ॉन) हिरन का बच्चा है।',
  'Library is to Books as Museum is to ?': 'पुस्तकालय में किताबें रखी जाती हैं। संग्रहालय में कलाकृतियाँ रखी जाती हैं — स्थान और उसमें रखी चीज़ का संबंध।',
  'Caterpillar is to Butterfly as Tadpole is to ?': 'इल्ली तितली में बदल जाती है। टैडपोल मेंढक में बदल जाता है — कायांतरण (रूप-परिवर्तन) का संबंध।',
  'Frugal is to Spendthrift as Timid is to ?': 'मितव्ययी, फ़िज़ूलखर्च का विलोम है। डरपोक, साहसी का विलोम है — विपरीतार्थक संबंध।',
  'Vaccine is to Disease as Umbrella is to ?': 'टीका बीमारी से बचाता है। छाता बारिश से बचाता है — सुरक्षा का संबंध।',
  'Ounce is to Weight as Inch is to ?': 'औंस वज़न मापता है। इंच लंबाई मापता है — इकाई और राशि का संबंध।',
  'Compass is to Direction as Map is to ?': 'कम्पास दिशा खोजने में मदद करता है। नक्शा स्थान खोजने में मदद करता है — औज़ार और उद्देश्य का संबंध।',
  'Bouquet is to Flowers as Herd is to ?': 'गुलदस्ता फूलों का समूह है। झुंड पशुओं का समूह है — समूहवाचक संज्ञा का संबंध।',
  'Puppy is to Bark as Kitten is to ?': 'पिल्ले की विशिष्ट आवाज़ भौंकना है। बिल्ली के बच्चे की विशिष्ट आवाज़ म्याऊँ है।',
  'Rehearsal is to Performance as Draft is to ?': 'पूर्वाभ्यास प्रदर्शन से पहले आता है। मसौदा अंतिम प्रति से पहले आता है — तैयारी और परिणाम का संबंध।',
  'Antidote is to Poison as Cure is to ?': 'प्रतिकारक ज़हर का असर काटता है। इलाज बीमारी का असर काटता है — उपचार का संबंध।',
  'Glacier is to Ice as Volcano is to ?': 'हिमनद बर्फ़ से बना होता है। ज्वालामुखी लावा से जुड़ा होता है — बनावट और सामग्री का संबंध।',
  'Ticket is to Entry as Password is to ?': 'टिकट प्रवेश दिलाता है। पासवर्ड पहुँच दिलाता है — प्रमाण-पत्र का संबंध।',
  'Cocoon is to Moth as Shell is to ?': 'कोकून वह सुरक्षात्मक आवरण है जिसके भीतर पतंगा विकसित होता है। खोल अंडे का सुरक्षात्मक आवरण है।',
  'Apprentice is to Master as Student is to ?': 'प्रशिक्षु उस्ताद से सीखता है। छात्र शिक्षक से सीखता है — सीखने वाले और मार्गदर्शक का संबंध।',
  'Thermometer is to Temperature as Speedometer is to ?': 'थर्मामीटर तापमान मापता है। इसी तरह स्पीडोमीटर गति मापता है — दोनों सीधे, सटीक माप का संबंध हैं।',
  'Recipe is to Cook as Sheet Music is to ?': 'विधि रसोइये का मार्गदर्शन करती है। इसी तरह संगीत-लिपि संगीतकार का मार्गदर्शन करती है — नक्शे (जिसे इंजीनियर और वास्तुकार दोनों उपयोग करते हैं) के विपरीत, संगीत-लिपि स्पष्ट रूप से एक ही भूमिका की होती है।',
};
export function localizeAnalogyL2(q) {
  if (q.chapter !== 'analogies-l2' || typeof q.prompt !== 'string') return q;
  let m;
  if ((m = q.prompt.match(/^(.+) is to (.+) as (.+) is to \?$/)) && AN_MANUAL[q.prompt]) {
    return bi(q, `${aw(m[1])} का ${aw(m[2])} से वही संबंध है जो ${aw(m[3])} का किससे है?`, AN_MANUAL[q.prompt], aw);
  }
  if ((m = q.prompt.match(/^(.+) : (.+) :: (.+) : \?$/))) {
    const e = q.exp.match(/^(.+) and (.+) have the same relation as (.+) and (.+)\.$/);
    if (!e) return q;
    return bi(q, `${aw(m[1])} : ${aw(m[2])} :: ${aw(m[3])} : ?`, `${aw(e[1])} और ${aw(e[2])} का जो संबंध है, वही ${aw(e[3])} और ${aw(e[4])} का है।`, aw);
  }
  return q;
}

// ── Ranking & Ordering (L2) ──
const RKN = {
  Riya: 'रिया', Mohan: 'मोहन', Raj: 'राज', Priya: 'प्रिया', Arjun: 'अर्जुन', Kabir: 'कबीर', Meera: 'मीरा', Sunil: 'सुनील', Rani: 'रानी',
  Tanya: 'तान्या', Vikas: 'विकास', Priyanka: 'प्रियंका', Manoj: 'मनोज', Suresh: 'सुरेश', Ravi: 'रवि', Deepak: 'दीपक', Neha: 'नेहा',
  Om: 'ओम', Kiran: 'किरण', Sana: 'सना', Bina: 'बीना', Asha: 'आशा', Hari: 'हरि', Farhan: 'फ़रहान', Jay: 'जय', Esha: 'ईशा',
  Isha: 'इशा', Chirag: 'चिराग', Dev: 'देव', Gita: 'गीता',
};
const rkn = (s) => RKN[s] || s;
const rk2Opt = (o) => {
  const m = o.match(/^(\d+)(?:st|nd|rd|th)$/);
  if (m) return `${m[1]}वाँ`;
  if (o === 'Cannot determine') return 'निर्धारित नहीं किया जा सकता';
  const b = o.match(/^Box (\d)$/);
  if (b) return `डिब्बा ${b[1]}`;
  return rkn(o);
};
const RK2_MANUAL = {
  'A > B, C > A, D > C. Who is the greatest?': ['A > B, C > A, D > C। सबसे बड़ा कौन है?', 'असमानताओं को जोड़ने पर: D>C>A>B — D सबसे ऊपर है।'],
  'In a class of 30, Riya ranks 8th from the top. What is her rank from the bottom?': ['30 छात्रों की कक्षा में रिया ऊपर से 8वें स्थान पर है। नीचे से उसका स्थान क्या है?', 'सूत्र: कुल − ऊपर से स्थान + 1 = 30 − 8 + 1 = नीचे से 23वाँ।'],
  'Five people sit in a row. Mohan is between Raj and Priya. Raj is at one end. Who is at the other end?': ['पाँच लोग एक पंक्ति में बैठे हैं। मोहन, राज और प्रिया के बीच में है। राज एक सिरे पर है। दूसरे सिरे पर कौन है?', 'हम जानते हैं कि राज एक सिरे पर है, उसके बगल में मोहन है, फिर प्रिया — लेकिन दो और लोग हैं जिनकी स्थिति नहीं बताई गई, इसलिए दूसरे सिरे पर कौन है यह निर्धारित नहीं किया जा सकता।'],
  'X is heavier than Y. Z is lighter than X but heavier than Y. Who is the lightest?': ['X, Y से भारी है। Z, X से हल्का है लेकिन Y से भारी है। सबसे हल्का कौन है?', 'क्रम: X > Z > Y। Y सबसे नीचे है — सबसे हल्का।'],
  'P is taller than Q. R is shorter than P but taller than Q. S is taller than P. How many people are shorter than S?': ['P, Q से लंबा है। R, P से छोटा है लेकिन Q से लंबा है। S, P से लंबा है। S से कितने लोग छोटे हैं?', 'क्रम: S > P > R > Q। तीन लोग (P, R, Q) S से छोटे हैं।'],
  'In a row of 40 students, if Arjun is 15th from the left, what is his position from the right?': ['40 छात्रों की पंक्ति में अर्जुन बायें से 15वें स्थान पर है। दायें से उसका स्थान क्या है?', 'सूत्र: कुल − बायें से स्थान + 1 = 40 − 15 + 1 = दायें से 26वाँ।'],
  'A scores more than B. C scores more than D. D scores more than A. Who scores the least?': ['A के अंक B से अधिक हैं। C के अंक D से अधिक हैं। D के अंक A से अधिक हैं। किसके अंक सबसे कम हैं?', 'क्रम: C > D > A > B। B सबसे नीचे है — सबसे कम अंक।'],
  'Of 6 boxes stacked, Box 3 is directly above Box 4. Box 1 is at the top. Which box is at the bottom?': ['6 डिब्बे एक के ऊपर एक रखे हैं। डिब्बा 3, डिब्बा 4 के ठीक ऊपर है। डिब्बा 1 सबसे ऊपर है। सबसे नीचे कौन-सा डिब्बा है?', 'डिब्बा 1 सबसे ऊपर है, और डिब्बा 3, डिब्बा 4 के ठीक ऊपर है — लेकिन डिब्बा 2, 5 और 6 की स्थिति नहीं बताई गई। यह जाने बिना कि वे ढेर में कहाँ आते हैं, यह बताना असंभव है कि सबसे नीचे कौन-सा डिब्बा है।'],
  'P > Q, R > P, S > R. Who is the greatest?': ['P > Q, R > P, S > R। सबसे बड़ा कौन है?', 'असमानताओं को जोड़ने पर: S > R > P > Q। S सबसे ऊपर है।'],
  'In a class of 40, Kabir ranks 12th from the top. What is his rank from the bottom?': ['40 छात्रों की कक्षा में कबीर ऊपर से 12वें स्थान पर है। नीचे से उसका स्थान क्या है?', 'सूत्र: कुल − ऊपर से स्थान + 1 = 40 − 12 + 1 = नीचे से 29वाँ।'],
  'A is taller than B. C is shorter than D. D is shorter than B. Who is the tallest?': ['A, B से लंबा है। C, D से छोटा है। D, B से छोटा है। सबसे लंबा कौन है?', 'संकेतों से: A > B > D > C। A सबसे ऊपर है — सबसे लंबा।'],
  'In a row of 50 people, Meera is 18th from the left. What is her position from the right?': ['50 लोगों की पंक्ति में मीरा बायें से 18वें स्थान पर है। दायें से उसका स्थान क्या है?', 'सूत्र: कुल − बायें से स्थान + 1 = 50 − 18 + 1 = दायें से 33वाँ।'],
  'Five friends: X is taller than Y, Y is taller than Z, W is taller than X, V is shorter than Z. Who is the tallest?': ['पाँच मित्र: X, Y से लंबा है, Y, Z से लंबा है, W, X से लंबा है, V, Z से छोटा है। सबसे लंबा कौन है?', 'क्रम: W > X > Y > Z > V। W सबसे ऊपर है — सबसे लंबा।'],
  'Sunil ranks 15th from the top and 20th from the bottom in his class. How many students are there in total?': ['सुनील अपनी कक्षा में ऊपर से 15वें और नीचे से 20वें स्थान पर है। कक्षा में कुल कितने छात्र हैं?', 'सूत्र: कुल = ऊपर से स्थान + नीचे से स्थान − 1 = 15 + 20 − 1 = 34 छात्र।'],
  'In a queue, there are 12 people ahead of Rani and 8 people behind her. How many people are in the queue in total?': ['एक कतार में रानी के आगे 12 लोग और पीछे 8 लोग हैं। कतार में कुल कितने लोग हैं?', 'कुल = आगे के लोग + स्वयं रानी + पीछे के लोग = 12 + 1 + 8 = 21।'],
  'A, B, C, D, E finish a race. A finishes before C but after B. D finishes before B. E finishes last. Who finishes first?': ['A, B, C, D, E एक दौड़ पूरी करते हैं। A, C से पहले लेकिन B के बाद खत्म करता है। D, B से पहले खत्म करता है। E सबसे आखिर में खत्म करता है। पहले कौन खत्म करता है?', 'क्रम: D > B > A > C, और E सबसे आखिर में है। D सबसे ऊपर है — पहले खत्म करता है।'],
  'If Tanya is 9th from the top and there are 14 people below her, how many people are there in total?': ['यदि तान्या ऊपर से 9वें स्थान पर है और उसके नीचे 14 लोग हैं, तो कुल कितने लोग हैं?', 'कुल = ऊपर से स्थान + नीचे के लोग = 9 + 14 = 23।'],
  'In a line of 25 students, Vikas is exactly in the middle. What is his position from either end?': ['25 छात्रों की पंक्ति में विकास ठीक बीच में है। किसी भी सिरे से उसका स्थान क्या है?', '25 लोगों में ठीक बीच का स्थान हर सिरे से 13वाँ है (दोनों ओर 12 लोग)।'],
  'P is older than Q but younger than R. S is older than R. Who is the oldest?': ['P, Q से बड़ा है लेकिन R से छोटा है। S, R से बड़ा है। सबसे बड़ा (उम्र में) कौन है?', 'क्रम: S > R > P > Q। S सबसे ऊपर है — सबसे बड़ा।'],
  'A stack of 30 books has the red book 11th from the top. How many books are below it?': ['30 किताबों के ढेर में लाल किताब ऊपर से 11वें स्थान पर है। उसके नीचे कितनी किताबें हैं?', 'नीचे की किताबें = कुल − ऊपर से स्थान = 30 − 11 = 19।'],
  "In a class, Priyanka's rank improved from 15th to 9th. By how many positions did she move up?": ['एक कक्षा में प्रियंका का स्थान 15वें से सुधरकर 9वाँ हो गया। वह कितने स्थान ऊपर आई?', 'सुधार = पुराना स्थान − नया स्थान = 15 − 9 = 6 स्थान।'],
  'Manoj is heavier than Suresh. Suresh is heavier than Ravi. Deepak is heavier than Manoj. Who is the lightest?': ['मनोज, सुरेश से भारी है। सुरेश, रवि से भारी है। दीपक, मनोज से भारी है। सबसे हल्का कौन है?', 'क्रम: दीपक > मनोज > सुरेश > रवि। रवि सबसे नीचे है — सबसे हल्का।'],
  'A runner improved her rank from 20th to 14th out of 50 runners. How many people does she now rank above (excluding herself)?': ['एक धावक का स्थान 50 धावकों में 20वें से सुधरकर 14वाँ हो गया। अब वह कितने लोगों से ऊपर है (स्वयं को छोड़कर)?', 'यदि वह 50 में 14वें स्थान पर है, तो 50 − 14 = 36 लोग उससे नीचे हैं।'],
  'In a row of 18 chairs, the guest of honour sits 7th from the left. How many chairs are to the right?': ['18 कुर्सियों की पंक्ति में मुख्य अतिथि बायें से 7वीं कुर्सी पर बैठा है। उसके दायीं ओर कितनी कुर्सियाँ हैं?', 'दायीं ओर की कुर्सियाँ = कुल − बायें से स्थान = 18 − 7 = 11।'],
  'Five students score marks such that: Neha > Om, Om > Kiran, Priya > Neha, Kiran > Sana. Who scored the lowest?': ['पाँच छात्रों के अंक इस प्रकार हैं: नेहा > ओम, ओम > किरण, प्रिया > नेहा, किरण > सना। सबसे कम अंक किसके हैं?', 'क्रम: प्रिया > नेहा > ओम > किरण > सना। सना सबसे नीचे है — सबसे कम अंक।'],
  'A company has 200 employees. An employee\'s performance rank is 45th from the top. How many employees rank below this employee?': ['एक कंपनी में 200 कर्मचारी हैं। एक कर्मचारी का प्रदर्शन-स्थान ऊपर से 45वाँ है। इस कर्मचारी से नीचे कितने कर्मचारी हैं?', 'नीचे के कर्मचारी = कुल − ऊपर से स्थान = 200 − 45 = 155।'],
  'In a group of 60 people, Arjun is ranked 25th from the bottom. What is his rank from the top?': ['60 लोगों के समूह में अर्जुन नीचे से 25वें स्थान पर है। ऊपर से उसका स्थान क्या है?', 'सूत्र: कुल − नीचे से स्थान + 1 = 60 − 25 + 1 = ऊपर से 36वाँ।'],
  'Five houses on a street: House B is to the right of House A. House C is to the left of A. House D is to the right of B. House E is to the left of C. What is the order from left to right?': ['एक गली में पाँच मकान हैं: मकान B, मकान A के दायीं ओर है। मकान C, A के बायीं ओर है। मकान D, B के दायीं ओर है। मकान E, C के बायीं ओर है। बायें से दायें का क्रम क्या है?', 'संकेतों से क्रम बनाने पर: E, C के बायें है, C, A के बायें है, A, B के बायें है, B, D के बायें है — इसलिए क्रम E, C, A, B, D है।'],
};
export function localizeRankingL2(q) {
  if (q.chapter !== 'ranking-ordering-l2' || typeof q.prompt !== 'string') return q;
  const man = RK2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], rk2Opt);
  if (/ scores more than /.test(q.prompt)) {
    const parts = q.prompt.replace(/ Who scores the least\?$/, '').split('. ').map((s) => s.replace(/\.$/, ''));
    const hi = parts.map((s) => { const m = s.match(/^(\w+) scores more than (\w+)$/); return m ? `${rkn(m[1])} के अंक ${rkn(m[2])} से अधिक हैं` : null; });
    const e = q.exp.match(/^The scores go (.+), so (\w+) scores the least\.$/);
    if (hi.includes(null) || !e) return q;
    return bi(q, `${hi.join('। ')}। किसके अंक सबसे कम हैं?`, `अंकों का क्रम है ${e[1].split(' > ').map(rkn).join(' > ')}, इसलिए ${rkn(e[2])} के अंक सबसे कम हैं।`, rk2Opt);
  }
  return q;
}

// ── Direction Sense (L2) ──
const D2 = { North: 'उत्तर', South: 'दक्षिण', East: 'पूर्व', West: 'पश्चिम', 'North-East': 'उत्तर-पूर्व', 'North-West': 'उत्तर-पश्चिम', 'South-East': 'दक्षिण-पूर्व', 'South-West': 'दक्षिण-पश्चिम' };
const d2 = (s) => D2[s] || s;
const D2U = { m: 'मी', km: 'किमी' };
const d2Opt = (o) => {
  let m;
  if (D2[o]) return D2[o];
  if ((m = o.match(/^(\d+)(m|km)$/))) return `${m[1]} ${D2U[m[2]]}`;
  if ((m = o.match(/^(\d+)(m|km) (\w+(?:-\w+)?)$/)) && D2[m[3]]) return `${m[1]} ${D2U[m[2]]} ${D2[m[3]]}`;
  if ((m = o.match(/^Facing (\w+(?:-\w+)?), (\d+)m from start$/))) return `${D2[m[1]]} की ओर मुँह, शुरुआत से ${m[2]} मी`;
  if (o === 'Back at the start (0m)') return 'शुरुआती बिंदु पर वापस (0 मी)';
  return o;
};
const D2_MANUAL = {
  'Arun walks 10m North, turns right and walks 5m, then turns right and walks 10m. How far is he from his starting point?': ['अरुण 10 मी उत्तर चलता है, दायें मुड़कर 5 मी चलता है, फिर दायें मुड़कर 10 मी चलता है। वह अपने शुरुआती बिंदु से कितनी दूर है?', 'उत्तर 10 मी, फिर दायें (पूर्व की ओर) 5 मी, फिर दोबारा दायें (दक्षिण की ओर) 10 मी — वह शुरुआती ऊँचाई पर वापस आ जाता है, पर उससे 5 मी पूर्व में — इसलिए वह शुरुआती बिंदु से 5 मी दूर है।'],
  'Facing East, you turn left twice. Which direction do you face now?': ['पूर्व की ओर मुँह करके आप दो बार बायें मुड़ते हैं। अब आप किस दिशा की ओर हैं?', 'बायें मुड़ने पर क्रम है पूर्व → उत्तर → पश्चिम। पूर्व से दो बार बायें मुड़ने पर आप पश्चिम की ओर होते हैं।'],
  'Priya walks 4m West, 3m South. What is the straight-line distance from start?': ['प्रिया 4 मी पश्चिम, फिर 3 मी दक्षिण चलती है। शुरुआत से सीधी दूरी क्या है?', 'पश्चिम और दक्षिण की दूरियाँ समकोण बनाती हैं, इसलिए सीधी दूरी कर्ण है: √(4² + 3²) = √25 = 5 मी — प्रसिद्ध 3-4-5 त्रिभुज।'],
  'A man drives 20km North, then 20km East, then 20km South. Where is he relative to start?': ['एक आदमी 20 किमी उत्तर, फिर 20 किमी पूर्व, फिर 20 किमी दक्षिण गाड़ी चलाता है। शुरुआत के सापेक्ष वह कहाँ है?', 'उत्तर और दक्षिण की दूरियाँ बराबर हैं (20-20 किमी), इसलिए वे पूरी तरह कट जाती हैं — केवल 20 किमी पूर्व की दूरी बचती है, यानी वह शुरुआती जगह से 20 किमी पूर्व में है।'],
  'If at 6:00 AM you face the sunrise, and turn 90° clockwise, which direction do you face?': ['यदि सुबह 6:00 बजे आप सूर्योदय की ओर मुँह करते हैं और 90° दक्षिणावर्त (घड़ी की दिशा में) मुड़ते हैं, तो आप किस दिशा की ओर होंगे?', 'सूर्य पूर्व में उगता है, इसलिए आप पहले पूर्व की ओर हैं। पूर्व से 90° दक्षिणावर्त मुड़ने पर आप दक्षिण की ओर होते हैं।'],
  'A walks 5m South, turns left and walks 4m, turns left and walks 5m. What direction does he face and how far is he from start?': ['A 5 मी दक्षिण चलता है, बायें मुड़कर 4 मी चलता है, फिर बायें मुड़कर 5 मी चलता है। वह किस दिशा की ओर है और शुरुआत से कितनी दूर है?', 'दक्षिण, फिर बायें (अब पूर्व की ओर), फिर दोबारा बायें (अब उत्तर की ओर) — दोनों 5-5 मी की दूरियाँ (दक्षिण और फिर उत्तर) पूरी तरह कट जाती हैं, केवल 4 मी पूर्व की चाल बचती है। वह उत्तर की ओर मुँह करके शुरुआत से 4 मी दूर है।'],
  'You face South-West. After turning 135° clockwise, which direction do you face?': ['आप दक्षिण-पश्चिम की ओर मुँह करते हैं। 135° दक्षिणावर्त मुड़ने के बाद आप किस दिशा की ओर होंगे?', 'कम्पास पर दक्षिण-पश्चिम 225° पर होता है (उत्तर = 0°, दक्षिणावर्त गिनने पर)। इसमें 135° जोड़ने पर 360° मिलता है, जो घूमकर 0° यानी उत्तर बन जाता है।'],
  "A house's main door faces East. The back of the house faces which direction?": ['एक घर का मुख्य दरवाज़ा पूर्व की ओर है। घर का पिछला हिस्सा किस दिशा की ओर है?', 'घर का पिछला हिस्सा हमेशा सामने के ठीक विपरीत दिशा में होता है — पूर्व की विपरीत दिशा पश्चिम है।'],
  'A person walks 10m South, then turns left and walks 10m, then turns left again and walks 10m. In which direction is he now facing?': ['एक व्यक्ति 10 मी दक्षिण चलता है, फिर बायें मुड़कर 10 मी चलता है, फिर दोबारा बायें मुड़कर 10 मी चलता है। अब वह किस दिशा की ओर मुँह किए है?', 'दक्षिण की ओर मुँह करके बायें मुड़ने का मतलब है पूर्व की ओर; पूर्व से दोबारा बायें मुड़ने का मतलब है उत्तर की ओर।'],
  'A person walks 5m North, then 5m East, then 5m South. How far and in which direction is he from the start?': ['एक व्यक्ति 5 मी उत्तर, फिर 5 मी पूर्व, फिर 5 मी दक्षिण चलता है। वह शुरुआत से कितनी दूर और किस दिशा में है?', 'उत्तर और दक्षिण की दूरियाँ कट जाती हैं (दोनों 5 मी)। केवल 5 मी पूर्व की दूरी बचती है — वह शुरुआत से 5 मी पूर्व में है।'],
  'A person walks 3m East, then 4m North. What is the shortest (straight-line) distance from the start?': ['एक व्यक्ति 3 मी पूर्व, फिर 4 मी उत्तर चलता है। शुरुआत से सबसे छोटी (सीधी) दूरी क्या है?', 'यह 3 मी और 4 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से सीधी दूरी = √(3² + 4²) = √25 = 5 मी।'],
  'A person walks 6m East, then 8m North. What is the shortest (straight-line) distance from the start?': ['एक व्यक्ति 6 मी पूर्व, फिर 8 मी उत्तर चलता है। शुरुआत से सबसे छोटी (सीधी) दूरी क्या है?', 'यह 6 मी और 8 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से सीधी दूरी = √(6² + 8²) = √100 = 10 मी।'],
  'Facing North-East, if you turn 90 degrees clockwise, which direction do you face?': ['उत्तर-पूर्व की ओर मुँह करके, यदि आप 90° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', '90° दक्षिणावर्त मोड़ आपको कम्पास का एक पूरा कदम आगे ले जाता है: उत्तर-पूर्व → दक्षिण-पूर्व।'],
  'Facing South-West, if you turn 90 degrees anticlockwise, which direction do you face?': ['दक्षिण-पश्चिम की ओर मुँह करके, यदि आप 90° वामावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', '90° वामावर्त मोड़ आपको कम्पास का एक पूरा कदम पीछे ले जाता है: दक्षिण-पश्चिम → दक्षिण-पूर्व।'],
  'Facing East, if you turn 45 degrees clockwise, which direction do you face?': ['पूर्व की ओर मुँह करके, यदि आप 45° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', 'पूर्व से 45° दक्षिणावर्त मुड़ने पर आप ठीक पूर्व और दक्षिण के बीच — दक्षिण-पूर्व — की ओर होते हैं।'],
  'A man walks 4m North, 4m East, 4m South, 4m West. Where does he end up relative to the start?': ['एक आदमी 4 मी उत्तर, 4 मी पूर्व, 4 मी दक्षिण, 4 मी पश्चिम चलता है। शुरुआत के सापेक्ष वह कहाँ पहुँचता है?', 'चारों दूरियाँ पूरी तरह कट जाती हैं — उत्तर दक्षिण को और पूर्व पश्चिम को काट देता है — वह अपने शुरुआती बिंदु पर वापस पहुँच जाता है।'],
  'Facing North, if you turn 270 degrees clockwise, which direction do you face?': ['उत्तर की ओर मुँह करके, यदि आप 270° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', '270° दक्षिणावर्त, 90° वामावर्त के बराबर है। उत्तर से वह पश्चिम पर पहुँचता है।'],
  'A cyclist rides 12km East, then 5km North. What is the shortest distance back to the starting point?': ['एक साइकिल सवार 12 किमी पूर्व, फिर 5 किमी उत्तर चलता है। शुरुआती बिंदु तक वापसी की सबसे छोटी दूरी क्या है?', 'यह 12 किमी और 5 किमी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से सीधी दूरी = √(12² + 5²) = √169 = 13 किमी।'],
  'A person walks 8m West, then 6m North. What is the shortest distance from the starting point?': ['एक व्यक्ति 8 मी पश्चिम, फिर 6 मी उत्तर चलता है। शुरुआती बिंदु से सबसे छोटी दूरी क्या है?', 'यह 8 मी और 6 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से दूरी = √(8² + 6²) = √100 = 10 मी।'],
  'Facing West, if you turn 135 degrees clockwise, which direction do you face?': ['पश्चिम की ओर मुँह करके, यदि आप 135° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', 'पश्चिम से दक्षिणावर्त मुड़ने पर: 45° पर उत्तर-पश्चिम, 90° पर उत्तर, 135° पर उत्तर-पूर्व।'],
  'A boy walks 15m East, then 8m South. What is the shortest distance from his starting point?': ['एक लड़का 15 मी पूर्व, फिर 8 मी दक्षिण चलता है। उसके शुरुआती बिंदु से सबसे छोटी दूरी क्या है?', 'यह 15 मी और 8 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से दूरी = √(15² + 8²) = √289 = 17 मी।'],
  'Facing South, if you turn 90 degrees clockwise then 90 degrees clockwise again, which direction do you face?': ['दक्षिण की ओर मुँह करके, यदि आप 90° दक्षिणावर्त और फिर दोबारा 90° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', 'दक्षिण से लगातार दो 90° दक्षिणावर्त मोड़: दक्षिण → पश्चिम → उत्तर।'],
  'A woman walks 9m North, then 12m East. What is the shortest distance from the starting point?': ['एक महिला 9 मी उत्तर, फिर 12 मी पूर्व चलती है। शुरुआती बिंदु से सबसे छोटी दूरी क्या है?', 'यह 9 मी और 12 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से दूरी = √(9² + 12²) = √225 = 15 मी।'],
  'A man walks 20m North, then 15m West. What is the shortest distance from the starting point?': ['एक आदमी 20 मी उत्तर, फिर 15 मी पश्चिम चलता है। शुरुआती बिंदु से सबसे छोटी दूरी क्या है?', 'यह 20 मी और 15 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से दूरी = √(20² + 15²) = √625 = 25 मी।'],
  'Facing South-East, if you turn 90 degrees clockwise, which direction do you face?': ['दक्षिण-पूर्व की ओर मुँह करके, यदि आप 90° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', '90° दक्षिणावर्त मोड़ आपको कम्पास का एक पूरा कदम आगे ले जाता है: दक्षिण-पूर्व → दक्षिण-पश्चिम।'],
  'A person walks 6m North, 8m East, then 6m South. How far and in which direction is he from the start?': ['एक व्यक्ति 6 मी उत्तर, 8 मी पूर्व, फिर 6 मी दक्षिण चलता है। वह शुरुआत से कितनी दूर और किस दिशा में है?', 'उत्तर और दक्षिण की दूरियाँ कट जाती हैं (दोनों 6 मी)। केवल 8 मी पूर्व की दूरी बचती है — वह शुरुआत से 8 मी पूर्व में है।'],
  'Facing North-West, if you turn 90 degrees clockwise, which direction do you face?': ['उत्तर-पश्चिम की ओर मुँह करके, यदि आप 90° दक्षिणावर्त मुड़ें, तो आप किस दिशा की ओर होंगे?', '90° दक्षिणावर्त मोड़ आपको कम्पास का एक पूरा कदम आगे ले जाता है: उत्तर-पश्चिम → उत्तर-पूर्व।'],
  'A person walks 7m South, then 24m East. What is the shortest distance from the starting point?': ['एक व्यक्ति 7 मी दक्षिण, फिर 24 मी पूर्व चलता है। शुरुआती बिंदु से सबसे छोटी दूरी क्या है?', 'यह 7 मी और 24 मी भुजाओं वाला समकोण त्रिभुज बनाता है। पाइथागोरस प्रमेय से दूरी = √(7² + 24²) = √625 = 25 मी।'],
};
export function localizeDirectionL2(q) {
  if (q.chapter !== 'direction-l2' || typeof q.prompt !== 'string') return q;
  const man = D2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], d2Opt);
  const m = q.prompt.match(/^Walk (\d+) m (\w+) and then (\d+) m (\w+)\. In which direction are you from the starting point\?$/);
  const e = q.exp.match(/^You are (\d+) m (\w+) and (\d+) m (\w+) of the start, so you are ([\w-]+)\.$/);
  if (!m || !e) return q;
  return bi(q, `${m[1]} मी ${d2(m[2])} और फिर ${m[3]} मी ${d2(m[4])} चलें। शुरुआती बिंदु से आप किस दिशा में हैं?`, `आप शुरुआत से ${e[1]} मी ${d2(e[2])} और ${e[3]} मी ${d2(e[4])} पर हैं, इसलिए आप ${d2(e[5])} दिशा में हैं।`, d2Opt);
}

// ── Coding-Decoding (L2) ── (code words, letters and numbers stay as they are; only the wording is Hindi)
const CD2_MANUAL = {
  'If 15 = P, 1 = A, 20 = T, what does "PAT" equal as a sum of numbers?': ['यदि 15 = P, 1 = A, 20 = T, तो "PAT" संख्याओं के योग के रूप में कितना होगा?', 'प्रश्न में दिए गए मान ही प्रयोग करें (यहाँ P=15, न कि P का सामान्य वर्णमाला-स्थान 16) — यही पकड़ने की मुख्य बात है। 15 + 1 + 20 = 36।'],
  'If MANGO is coded as 13-1-14-7-15, how is APPLE coded?': ['यदि MANGO को 13-1-14-7-15 के रूप में कोड किया जाए, तो APPLE को कैसे कोड किया जाएगा?', 'यह हर अक्षर का मानक वर्णमाला-स्थान है (A=1, B=2... Z=26) — M 13वाँ अक्षर है, A पहला, इत्यादि। APPLE के लिए: A=1, P=16, P=16, L=12, E=5।'],
  'In a code, WATER = 23-1-20-5-18. What is the code for FIRE?': ['एक कोड में WATER = 23-1-20-5-18 है। FIRE का कोड क्या है?', 'पहले जैसा ही विचार — मानक वर्णमाला-स्थान (A=1...Z=26)। F छठा, I नौवाँ, R अठारहवाँ और E पाँचवाँ अक्षर है।'],
  'If COME = BNLD (each letter shifted back by 1), how is GOLD coded?': ['यदि COME = BNLD (हर अक्षर 1 स्थान पीछे खिसका हुआ), तो GOLD को कैसे कोड किया जाएगा?', 'वर्णमाला में हर अक्षर 1 स्थान पीछे जाता है: G→F, O→N, L→K, D→C, जिससे FNKC बनता है।'],
  'If RED = 18-5-4 (A=1, B=2...), what is the sum for the word "CAB"?': ['यदि RED = 18-5-4 (A=1, B=2...), तो शब्द "CAB" का योग क्या है?', 'मानक वर्णमाला-स्थान से C=3, A=1, B=2 — 3 + 1 + 2 = 6।'],
  'If TIGER is coded as UHHDS (each letter alternately +1, −1, +1, −1, +1), how is BIRD coded?': ['यदि TIGER को UHHDS के रूप में कोड किया जाए (हर अक्षर बारी-बारी से +1, −1, +1, −1, +1), तो BIRD को कैसे कोड किया जाएगा?', 'खिसकाव की दिशा हर अक्षर के साथ बदलती है: +1, फिर −1, फिर +1, इत्यादि। BIRD के लिए: B+1=C, I−1=H, R+1=S, D−1=C, जिससे CHSC बनता है।'],
  'If in a language CLOCK = 44 (C=3, L=12, O=15, C=3, K=11), what is the value of SUN? (S=19, U=21, N=14)': ['यदि किसी भाषा में CLOCK = 44 (C=3, L=12, O=15, C=3, K=11) है, तो SUN का मान क्या है? (S=19, U=21, N=14)', 'हर अक्षर अपने मानक वर्णमाला-स्थान का मान लेता है, और सबको जोड़ा जाता है (C+L+O+C+K = 3+12+15+3+11 = 44, जिससे पैटर्न की पुष्टि होती है)। SUN के लिए: 19+21+14 = 54।'],
};
export function localizeCodingL2(q) {
  if (q.chapter !== 'coding-decoding-l2' || typeof q.prompt !== 'string') return q;
  const id = (o) => o;
  const man = CD2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], id);
  let m; let e;
  if ((m = q.prompt.match(/^If (\w+) is coded as (\w+), how is (\w+) coded\?$/))) {
    e = q.exp.match(/^Every letter in (\w+) shifts forward by 1 to get (\w+) \((.*)\)\. Apply the same \+1 shift to (\w+): (.*), giving (\w+)\.$/);
    if (!e) return q;
    return bi(q, `यदि ${m[1]} को ${m[2]} के रूप में कोड किया जाए, तो ${m[3]} को कैसे कोड किया जाएगा?`, `${e[1]} का हर अक्षर 1 स्थान आगे खिसककर ${e[2]} बनता है (${e[3].replace('and so on', 'इत्यादि')})। यही +1 खिसकाव ${e[4]} पर लागू करें: ${e[5]}, जिससे ${e[6]} बनता है।`, id);
  }
  if ((m = q.prompt.match(/^If each letter is replaced by its alphabet position and the positions are summed, what is the total for (\w+)\?$/))) {
    e = q.exp.match(/^(\w+): ([\d+]+) = (\d+)\.$/);
    if (!e) return q;
    return bi(q, `यदि हर अक्षर को उसके वर्णमाला-स्थान से बदला जाए और स्थानों का योग किया जाए, तो ${m[1]} का कुल योग क्या होगा?`, `${e[1]}: ${e[2]} = ${e[3]}।`, id);
  }
  if ((m = q.prompt.match(/^If a word is coded by simply reversing its letters, how is (\w+) coded\?$/))) {
    e = q.exp.match(/^Reversing the letters of (\w+) gives (\w+)\.$/);
    if (!e) return q;
    return bi(q, `यदि किसी शब्द को केवल उसके अक्षरों को उलटकर कोड किया जाए, तो ${m[1]} को कैसे कोड किया जाएगा?`, `${e[1]} के अक्षरों को उलटने पर ${e[2]} मिलता है।`, id);
  }
  if ((m = q.prompt.match(/^If each letter shifts forward by (\d+) and then the result is reversed, how is (\w+) coded\?$/))) {
    e = q.exp.match(/^First shift each letter forward by (\d+): (\w+) becomes (\w+)\. Then reverse that result: (\w+)\.$/);
    if (!e) return q;
    return bi(q, `यदि हर अक्षर ${m[1]} स्थान आगे खिसकता है और फिर परिणाम को उलट दिया जाता है, तो ${m[2]} को कैसे कोड किया जाएगा?`, `पहले हर अक्षर को ${e[1]} स्थान आगे खिसकाएँ: ${e[2]} से ${e[3]} बनता है। फिर उस परिणाम को उलटें: ${e[4]}।`, id);
  }
  if ((m = q.prompt.match(/^If letters in odd positions \(1st, 3rd, 5th\.\.\.\) shift forward by 1 and letters in even positions shift back by 1, how is (\w+) coded\?$/))) {
    e = q.exp.match(/^Applying \+1 to positions 1,3,5 and -1 to positions 2,4 of (\w+) gives (\w+)\.$/);
    if (!e) return q;
    return bi(q, `यदि विषम स्थानों (1ला, 3रा, 5वाँ...) के अक्षर 1 स्थान आगे और सम स्थानों के अक्षर 1 स्थान पीछे खिसकते हैं, तो ${m[1]} को कैसे कोड किया जाएगा?`, `${e[1]} के स्थान 1, 3, 5 पर +1 और स्थान 2, 4 पर −1 लागू करने से ${e[2]} मिलता है।`, id);
  }
  if ((m = q.prompt.match(/^If each letter shifts forward by (\d+), how is (\w+) coded\?$/))) {
    e = q.exp.match(/^Each letter shifts forward by (\d+)\. (\w+) becomes (\w+)\.$/);
    if (!e) return q;
    return bi(q, `यदि हर अक्षर ${m[1]} स्थान आगे खिसकता है, तो ${m[2]} को कैसे कोड किया जाएगा?`, `हर अक्षर ${e[1]} स्थान आगे खिसकता है। ${e[2]} का कोड ${e[3]} बनता है।`, id);
  }
  if ((m = q.prompt.match(/^In a code, each letter moves (\d+) forward and then the whole code is written backwards\. What is the code for (\w+)\?$/))) {
    e = q.exp.match(/^First (\w+) becomes (\w+)\. Written backwards that is (\w+)\.$/);
    if (!e) return q;
    return bi(q, `एक कोड में हर अक्षर ${m[1]} स्थान आगे बढ़ता है और फिर पूरा कोड उलटा लिखा जाता है। ${m[2]} का कोड क्या है?`, `पहले ${e[1]} का कोड ${e[2]} बनता है। उसे उलटा लिखने पर ${e[3]} मिलता है।`, id);
  }
  return q;
}

// ── Calendar (L2) ──
const CL2D = { Monday: 'सोमवार', Tuesday: 'मंगलवार', Wednesday: 'बुधवार', Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार', Sunday: 'रविवार' };
const CL2M = { January: 'जनवरी', February: 'फ़रवरी', March: 'मार्च', April: 'अप्रैल', May: 'मई', June: 'जून', July: 'जुलाई', August: 'अगस्त', September: 'सितंबर', October: 'अक्टूबर', November: 'नवंबर', December: 'दिसंबर' };
const cl2Opt = (o) => {
  let m;
  if (CL2D[o]) return CL2D[o];
  if ((m = o.match(/^(\w+) (\d+)(?:st|nd|rd|th)$/)) && CL2M[m[1]]) return `${m[2]} ${CL2M[m[1]]}`;
  if (o === 'No') return 'नहीं';
  if (o === 'Yes') return 'हाँ';
  if (o === 'Cannot be determined') return 'निर्धारित नहीं किया जा सकता';
  return o;
};
const CL2_MANUAL = {
  'If 1st January 2023 was a Sunday, what day was 1st January 2024?': ['यदि 1 जनवरी 2023 रविवार था, तो 1 जनवरी 2024 को कौन-सा दिन था?', '2023 लीप वर्ष नहीं है, इसलिए उसमें 365 दिन हैं — ठीक 52 सप्ताह और 1 अतिरिक्त दिन। वह अतिरिक्त दिन अगले वर्ष की 1 जनवरी को एक दिन आगे खिसका देता है, रविवार से सोमवार पर।'],
  'How many odd days are in a century (100 years)?': ['एक शताब्दी (100 वर्ष) में कितने विषम दिन होते हैं?', '100 वर्ष = 76 सामान्य वर्ष + 24 लीप वर्ष (100÷4=25, उसमें से 1 घटाया क्योंकि शताब्दी वर्ष लीप वर्ष नहीं होता) = कुल 36,524 दिन। इसे 7 से भाग देने पर शेषफल 5 बचता है — किसी भी शताब्दी के लिए मानक परिणाम 5 "विषम दिन" है।'],
  'A meeting is scheduled every 3rd day of the month. In a 31-day month, how many meetings are held?': ['एक बैठक महीने के हर तीसरे दिन निर्धारित है। 31 दिनों के महीने में कितनी बैठकें होंगी?', 'बैठकें दिन 3, 6, 9... पर होती हैं, 31 से कम या बराबर 3 के सबसे बड़े गुणज तक। वह दिन 30 (3×10) है — 11वीं बैठक दिन 33 पर होती, जो महीने के अंत के बाद है। इसलिए 10 बैठकें।'],
  'If today is Thursday and the exam is in 46 days, on which day is the exam?': ['यदि आज गुरुवार है और परीक्षा 46 दिन बाद है, तो परीक्षा किस दिन है?', '46 ÷ 7 का शेषफल 4 है। गुरुवार से 4 दिन आगे गिनें: शुक्रवार, शनिवार, रविवार, सोमवार — इसलिए परीक्षा सोमवार को है।'],
  'What is the day on 15th August 2025 if 1st January 2025 is a Wednesday?': ['यदि 1 जनवरी 2025 बुधवार है, तो 15 अगस्त 2025 को कौन-सा दिन होगा?', '1 जनवरी और 15 अगस्त के बीच 226 दिन हैं। 226 ÷ 7 का शेषफल 2 है — बुधवार से 2 दिन आगे गिनने पर शुक्रवार आता है।'],
  'If a year starts on Friday and is a leap year, on what day does it end?': ['यदि कोई वर्ष शुक्रवार से शुरू होता है और लीप वर्ष है, तो वह किस दिन समाप्त होगा?', 'लीप वर्ष में 366 दिन होते हैं, इसलिए 31 दिसंबर, 1 जनवरी के 365 दिन बाद है। 365 ÷ 7 का शेषफल 1 है — शुक्रवार से एक दिन आगे शनिवार है।'],
  'How many Sundays are in the month of October if October 1st is a Saturday?': ['यदि 1 अक्टूबर शनिवार है, तो अक्टूबर महीने में कितने रविवार होंगे?', 'यदि 1 अक्टूबर शनिवार है, तो पहला रविवार 2 अक्टूबर को है। वहाँ से रविवार हर 7 दिन बाद आते हैं: 2, 9, 16, 23, 30 — यानी 31 दिनों के अक्टूबर में 5 रविवार।'],
  'In 2 years where neither is a leap year, how many total odd days are there?': ['2 वर्षों में, जिनमें कोई भी लीप वर्ष नहीं है, कुल कितने विषम दिन होते हैं?', 'हर सामान्य वर्ष में 365 दिन होते हैं, यानी 52 सप्ताह और 1 अतिरिक्त ("विषम") दिन। ऐसे दो वर्षों में 1 + 1 = 2 विषम दिन होते हैं।'],
  'Is the year 1900 a leap year?': ['क्या वर्ष 1900 एक लीप वर्ष है?', '1900, 100 से विभाज्य है पर 400 से नहीं, इसलिए वह लीप वर्ष नहीं है, भले ही वह 4 से विभाज्य है — शताब्दी वर्ष का अपवाद नियम।'],
  'Which of these years is a leap year: 2100, 2200, 2400?': ['इनमें से कौन-सा वर्ष लीप वर्ष है: 2100, 2200, 2400?', '2400, 400 से विभाज्य है, इसलिए वह लीप वर्ष है। 2100 और 2200, 100 से विभाज्य हैं पर 400 से नहीं, इसलिए वे लीप वर्ष नहीं हैं — शताब्दी वर्ष का अपवाद नियम।'],
  'If today is Friday, what day will it be after 1000 days?': ['यदि आज शुक्रवार है, तो 1000 दिन बाद कौन-सा दिन होगा?', '1000 को 7 से भाग देने पर शेषफल 6 बचता है। शुक्रवार के छह दिन बाद: शनिवार, रविवार, सोमवार, मंगलवार, बुधवार, गुरुवार।'],
  'If a century (100 years) has 5 odd days, and today is a Monday, what day was it exactly 100 years ago?': ['यदि एक शताब्दी (100 वर्ष) में 5 विषम दिन होते हैं, और आज सोमवार है, तो ठीक 100 वर्ष पहले कौन-सा दिन था?', 'एक शताब्दी 5 विषम दिन जोड़ती है। 100 वर्ष पीछे जाने का मतलब साप्ताहिक चक्र में 5 दिन पीछे जाना है: सोमवार − 5 दिन = बुधवार।'],
  'How many odd days does the month of December contribute (31 days)?': ['दिसंबर का महीना (31 दिन) कितने विषम दिन जोड़ता है?', '31 दिनों को 7 से भाग देने पर शेषफल 3 बचता है — इसलिए दिसंबर 3 विषम दिन जोड़ता है, किसी भी अन्य 31 दिनों वाले महीने की तरह।'],
  'If today is Wednesday, what day was it 100 days ago?': ['यदि आज बुधवार है, तो 100 दिन पहले कौन-सा दिन था?', '100 को 7 से भाग देने पर शेषफल 2 बचता है। बुधवार से दो दिन पहले: मंगलवार, सोमवार।'],
  'If March 1st is a Saturday, what day is April 1st? (March has 31 days)': ['यदि 1 मार्च शनिवार है, तो 1 अप्रैल को कौन-सा दिन होगा? (मार्च में 31 दिन होते हैं)', '31 दिनों को 7 से भाग देने पर शेषफल 3 बचता है। शनिवार के तीन दिन बाद: रविवार, सोमवार, मंगलवार।'],
  'A person was born on a Friday. If they turn 7 years old and (hypothetically) none of those 7 years were leap years, what day of the week is their birthday now?': ['एक व्यक्ति का जन्म शुक्रवार को हुआ। यदि वह 7 वर्ष का हो जाए और (काल्पनिक रूप से) उन 7 वर्षों में कोई लीप वर्ष न हो, तो अब उसका जन्मदिन सप्ताह के किस दिन पड़ता है?', 'हर सामान्य वर्ष ठीक 1 विषम दिन जोड़ता है। ऐसे 7 वर्षों में कुल 7 विषम दिन होते हैं, जो ठीक एक पूरा सप्ताह है (7 को 7 से भाग देने पर शेषफल 0) — इसलिए सप्ताह का दिन नहीं बदलता: शुक्रवार।'],
  'If today is Tuesday, what day will it be after 90 days?': ['यदि आज मंगलवार है, तो 90 दिन बाद कौन-सा दिन होगा?', '90 को 7 से भाग देने पर शेषफल 6 बचता है। मंगलवार के छह दिन बाद: बुधवार, गुरुवार, शुक्रवार, शनिवार, रविवार, सोमवार।'],
  'How many odd days does the month of February contribute in a leap year (29 days)?': ['लीप वर्ष में फ़रवरी का महीना (29 दिन) कितने विषम दिन जोड़ता है?', '29 दिनों को 7 से भाग देने पर शेषफल 1 बचता है — इसलिए लीप वर्ष की फ़रवरी 1 विषम दिन जोड़ती है।'],
  'How many odd days does the month of January contribute (31 days)?': ['जनवरी का महीना (31 दिन) कितने विषम दिन जोड़ता है?', '31 दिनों को 7 से भाग देने पर शेषफल 3 बचता है — इसलिए जनवरी 3 विषम दिन जोड़ती है।'],
  "If today's date is February 28th on a normal (non-leap) year, what date is 3 days later?": ['यदि आज की तारीख़ सामान्य (गैर-लीप) वर्ष में 28 फ़रवरी है, तो 3 दिन बाद कौन-सी तारीख़ होगी?', 'सामान्य वर्ष में फ़रवरी में 28 दिन होते हैं, इसलिए 28 फ़रवरी + 3 दिन = 3 मार्च (28 फ़र → 1 मार्च → 2 मार्च → 3 मार्च)।'],
  'If today is Sunday, what day was it 365 days ago (assuming that period includes exactly one leap day)?': ['यदि आज रविवार है, तो 365 दिन पहले कौन-सा दिन था (मान लें कि उस अवधि में ठीक एक लीप दिन शामिल है)?', '365 दिन पहले सामान्यतः 1 दिन पहले होता (365 को 7 से भाग देने पर शेषफल 1), पर लीप दिन शामिल होने के कारण यह प्रभावी रूप से 366 दिन = 2 दिन पहले है: रविवार − 2 = शुक्रवार।'],
  'Is the year 2000 a leap year?': ['क्या वर्ष 2000 एक लीप वर्ष है?', '2000, 400 से विभाज्य है, इसलिए शताब्दी वर्ष (100 से विभाज्य) होते हुए भी वह लीप वर्ष है — शताब्दी वर्ष का अपवाद नियम।'],
  'If today is Thursday, what day will it be after 200 days?': ['यदि आज गुरुवार है, तो 200 दिन बाद कौन-सा दिन होगा?', '200 को 7 से भाग देने पर शेषफल 4 बचता है। गुरुवार के चार दिन बाद: शुक्रवार, शनिवार, रविवार, सोमवार।'],
  'How many odd days are there in a century (100 years)?': ['एक शताब्दी (100 वर्ष) में कितने विषम दिन होते हैं?', 'एक शताब्दी में 76 सामान्य वर्ष (हर एक में 1 विषम दिन) और 24 लीप वर्ष (हर एक में 2 विषम दिन) होते हैं = 76 + 48 = 124 विषम दिन। 124 को 7 से भाग देने पर शेषफल 5 बचता है।'],
  'If a leap year starts on a Monday, what day does the next year start on?': ['यदि कोई लीप वर्ष सोमवार से शुरू होता है, तो अगला वर्ष किस दिन से शुरू होगा?', 'लीप वर्ष में 366 दिन = 52 सप्ताह + 2 विषम दिन, इसलिए अगला वर्ष 2 दिन बाद शुरू होता है: सोमवार + 2 = बुधवार।'],
  'If a normal year starts on a Wednesday, what day does the next year start on? (assuming the first year is not a leap year)': ['यदि कोई सामान्य वर्ष बुधवार से शुरू होता है, तो अगला वर्ष किस दिन से शुरू होगा? (मान लें कि पहला वर्ष लीप वर्ष नहीं है)', 'सामान्य वर्ष में 365 दिन = 52 सप्ताह + 1 विषम दिन, इसलिए अगला वर्ष 1 दिन बाद शुरू होता है: बुधवार + 1 = गुरुवार।'],
  'If January 26th, 2026 is a Monday, what day is Republic Day (January 26th) in 2027? (2026 is not a leap year)': ['यदि 26 जनवरी 2026 सोमवार है, तो 2027 में गणतंत्र दिवस (26 जनवरी) को कौन-सा दिन होगा? (2026 लीप वर्ष नहीं है)', 'सामान्य (गैर-लीप) वर्ष में 365 दिन = 52 सप्ताह + 1 विषम दिन होते हैं। इसलिए अगले वर्ष की वही तारीख़ सप्ताह में 1 दिन बाद पड़ती है: सोमवार + 1 = मंगलवार।'],
};
export function localizeCalendarL2(q) {
  if (q.chapter !== 'calendar-l2' || typeof q.prompt !== 'string') return q;
  const man = CL2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], cl2Opt);
  const m = q.prompt.match(/^If 1st January is a (\w+) \(non-leap year\), what day is (\d+) (\w+)\?$/);
  const e = q.exp.match(/^Counting (\d+) days after 1 January gives (\w+)\.$/);
  if (!m || !e || !CL2M[m[3]]) return q;
  return bi(q, `यदि 1 जनवरी ${CL2D[m[1]]} है (गैर-लीप वर्ष), तो ${m[2]} ${CL2M[m[3]]} को कौन-सा दिन होगा?`, `1 जनवरी के ${e[1]} दिन बाद गिनने पर ${CL2D[e[2]]} मिलता है।`, cl2Opt);
}

// ── Pattern Completion (L2) ──
const P2_OPT = {
  ODD: 'विषम', EVEN: 'सम', Neither: 'कोई नहीं', 'Octagon (8 sides)': 'अष्टभुज (8 भुजाएँ)', Circle: 'वृत्त', 'Heptagon (7 sides)': 'सप्तभुज (7 भुजाएँ)',
  '12-sided shape (Dodecagon)': '12 भुजाओं वाली आकृति (द्वादशभुज)', '9-sided shape': '9 भुजाओं वाली आकृति', '24-sided shape': '24 भुजाओं वाली आकृति',
  '0 (360, back to start)': '0 (360, शुरुआत पर वापस)', 'Eighth-circle': 'वृत्त का आठवाँ भाग', 'No circle': 'कोई वृत्त नहीं', 'Full circle': 'पूरा वृत्त',
  Square: 'वर्ग',
};
const p2Opt = (o) => {
  const m = o.match(/^(\d+) dots$/);
  return m ? `${m[1]} बिंदु` : P2_OPT[o] || o;
};
const P2_MANUAL = {
  'A pattern: +2, ×2, +2, ×2... Starting from 1: 1, 3, 6, 8, ?': ['एक पैटर्न: +2, ×2, +2, ×2... 1 से शुरू करके: 1, 3, 6, 8, ?', 'नियम बारी-बारी से चलता है: +2, फिर ×2। 1 से शुरू करके: +2=3, ×2=6, +2=8, ×2=16।'],
  'Each figure adds 2 new dots arranged in an L-shape: 1, 3, 6, 10, ? — what is next?': ['हर आकृति में L-आकार में 2 नए बिंदु जुड़ते हैं: 1, 3, 6, 10, ? — अगला क्या है?', 'त्रिकोणीय संख्याएँ — हर चरण में अगली गिनती वाली संख्या जुड़ती है: +2, +3, +4, +5। इसलिए 10 + 5 = 15।'],
  'A sequence of shapes rotates 45° clockwise each step. After 8 steps, the shape is in the position of step ?': ['आकृतियों का एक क्रम हर चरण में 45° दक्षिणावर्त घूमता है। 8 चरणों के बाद आकृति किस चरण की स्थिति में होती है?', '8 चरण × 45° = 360° — एक पूरा चक्कर, जिससे आकृति अपनी मूल स्थिति में लौट आती है, यानी चरण 1 के बराबर।'],
  'A grid: Row 1 = 1,2,3. Row 2 = 4,5,6. Row 3 = 7,8,?': ['एक ग्रिड: पंक्ति 1 = 1,2,3। पंक्ति 2 = 4,5,6। पंक्ति 3 = 7,8,?', 'ग्रिड क्रमागत संख्याओं से बाएँ से दाएँ, ऊपर से नीचे भरा जाता है। पंक्ति 3: 7, 8, 9 — इसलिए लुप्त संख्या 9 है।'],
  'Pattern: ODD, EVEN, ODD, EVEN... The 7th term in the pattern (starting with ODD) is?': ['पैटर्न: विषम, सम, विषम, सम... इस पैटर्न का 7वाँ पद (विषम से शुरू करके) क्या है?', 'विषम स्थान (1ला, 3रा, 5वाँ...) "विषम" होते हैं। 7वाँ पद विषम स्थान पर है, इसलिए उत्तर "विषम" है।'],
  'A shape has 3 sides, then 4, then 5. Following the pattern, the 6th shape has how many sides?': ['एक आकृति में पहले 3 भुजाएँ हैं, फिर 4, फिर 5। पैटर्न के अनुसार 6वीं आकृति में कितनी भुजाएँ होंगी?', 'हर चरण में भुजाएँ 1 बढ़ती हैं, 3 से शुरू होकर। 6वीं आकृति में 3 + (6−1) = 8 भुजाएँ होंगी।'],
  'A tile pattern: ■□■□ / □■□■ / ■□■□ / ? — what is the 4th row?': ['एक टाइल पैटर्न: ■□■□ / □■□■ / ■□■□ / ? — 4थी पंक्ति क्या है?', 'पंक्तियाँ दो पैटर्न के बीच बारी-बारी से आती हैं (■□■□ और □■□■)। पंक्ति 4, पंक्ति 2 वाले पैटर्न का अनुसरण करती है — वह □■□■ है।'],
  'Numbers in a triangle: top=1, second row=1,1, third=1,2,1, fourth=1,3,3,1. What is the sum of the 5th row?': ['एक त्रिभुज में संख्याएँ: ऊपर=1, दूसरी पंक्ति=1,1, तीसरी=1,2,1, चौथी=1,3,3,1। 5वीं पंक्ति का योग क्या है?', 'पास्कल का त्रिभुज — पंक्तियों के योग हर बार दोगुने होते हैं: 1, 2, 4, 8, 16। 5वीं पंक्ति का योग 16 है।'],
  'A pattern: 2 dots, 6 dots, 12 dots, 20 dots. How many dots in the 5th figure?': ['एक पैटर्न: 2 बिंदु, 6 बिंदु, 12 बिंदु, 20 बिंदु। 5वीं आकृति में कितने बिंदु हैं?', 'अंतर बढ़ते हैं: +4, +6, +8, इसलिए अगला अंतर +10 है, यानी 20 + 10 = 30। (पैटर्न: n × (n+1) — 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30।)'],
  'A shape rotates 60 degrees clockwise each step. After how many steps does it first return to its original position?': ['एक आकृति हर चरण में 60° दक्षिणावर्त घूमती है। कितने चरणों के बाद वह पहली बार अपनी मूल स्थिति में लौटती है?', 'एक पूरा चक्कर 360° का होता है। 360 ÷ 60 = 6 चरणों में पूरा चक्कर लगाकर शुरुआती स्थिति पर वापसी हो जाती है।'],
  'Triangle, Square, Pentagon, Hexagon, ? -- following the pattern of increasing sides, what comes next?': ['त्रिभुज, वर्ग, पंचभुज, षट्भुज, ? — बढ़ती भुजाओं के पैटर्न के अनुसार अगला क्या आएगा?', 'हर आकृति में पिछली से एक भुजा अधिक है: 3, 4, 5, 6 भुजाएँ। अगली आकृति में 7 भुजाएँ होंगी — सप्तभुज।'],
  'A sequence of shapes doubles its number of sides each time: Triangle(3), Hexagon(6), ? -- what comes next?': ['आकृतियों का एक क्रम हर बार अपनी भुजाओं की संख्या दोगुनी करता है: त्रिभुज (3), षट्भुज (6), ? — अगला क्या आएगा?', 'हर आकृति में पिछली से दोगुनी भुजाएँ हैं: 3, 6, 12। अगली आकृति में 12 भुजाएँ होंगी — द्वादशभुज।'],
  'A, C, E, G, ? -- following the letter-skip pattern, what comes next?': ['A, C, E, G, ? — अक्षर छोड़ने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर अक्षर वर्णमाला का एक अक्षर छोड़ता है: A (B छोड़ा) C (D छोड़ा) E (F छोड़ा) G (H छोड़ा) I। अगला अक्षर I है।'],
  'Z, X, V, T, ? -- following the backward letter-skip pattern, what comes next?': ['Z, X, V, T, ? — पीछे की ओर अक्षर छोड़ने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर अक्षर वर्णमाला में 2 स्थान पीछे जाता है: Z, X, V, T, R। अगला अक्षर R है।'],
  'A pattern of squares: 1x1, 2x2, 3x3, 4x4. How many small unit squares are in the 5th figure (5x5)?': ['वर्गों का एक पैटर्न: 1×1, 2×2, 3×3, 4×4। 5वीं आकृति (5×5) में कितने छोटे इकाई वर्ग हैं?', 'हर आकृति वर्गों का n × n ग्रिड है, इसलिए उसमें n² इकाई वर्ग होते हैं: 1, 4, 9, 16, 25। 5वीं आकृति (5×5) में 25 हैं।'],
  'A dot pattern grows by the previous two terms added together: 1, 1, 2, 3, 5, ? -- how many dots in the next figure?': ['बिंदुओं का एक पैटर्न पिछले दो पदों को जोड़कर बढ़ता है: 1, 1, 2, 3, 5, ? — अगली आकृति में कितने बिंदु होंगे?', 'यह फ़िबोनाची पैटर्न है — हर पद पिछले दो पदों का योग है: 3 + 5 = 8।'],
  "A shape's rotation pattern: 0, 90, 180, 270, ? -- what is the next rotation value (in degrees, before repeating)?": ['एक आकृति का घूर्णन पैटर्न: 0, 90, 180, 270, ? — अगला घूर्णन मान (डिग्री में, दोहराव से पहले) क्या है?', 'पैटर्न हर बार 90° बढ़ता है: 0, 90, 180, 270, 360। चूँकि 360° एक पूरा चक्कर है, वह 0 के बराबर है — शुरुआत पर वापसी।'],
  'B, D, G, K, ? -- the gap between letters increases by 1 each time. What comes next?': ['B, D, G, K, ? — अक्षरों के बीच का अंतर हर बार 1 बढ़ता है। अगला क्या आएगा?', 'अंतर: B से D +2, D से G +3, G से K +4। इसलिए अगला अंतर +5 है: K + 5 = P।'],
  'A, D, I, P, ? -- following the pattern where the gap itself squares each time, what comes next?': ['A, D, I, P, ? — उस पैटर्न के अनुसार जिसमें अंतर स्वयं हर बार वर्ग के रूप में बढ़ता है, अगला क्या आएगा?', 'अंतर: A से D +3, D से I +5, I से P +7 (2 से बढ़ती विषम संख्याएँ)। अगला अंतर +9 है: P + 9 = Y।'],
  '2, 4, 8, 16, 32, ? -- if this represents a doubling shape pattern (number of petals on a flower), how many petals in the 6th figure?': ['2, 4, 8, 16, 32, ? — यदि यह दोगुना होने वाले आकृति-पैटर्न (फूल की पंखुड़ियों की संख्या) को दर्शाता है, तो 6ठी आकृति में कितनी पंखुड़ियाँ होंगी?', 'हर आकृति में पंखुड़ियों की संख्या दोगुनी हो जाती है: 2, 4, 8, 16, 32, 64। 6ठी आकृति में 64 पंखुड़ियाँ होंगी।'],
  'A pattern of triangles nested inside each other adds 3 new smaller triangles each step: 1, 4, 7, 10, ? -- how many total triangles in the 5th figure?': ['एक-दूसरे के भीतर बने त्रिभुजों का पैटर्न हर चरण में 3 नए छोटे त्रिभुज जोड़ता है: 1, 4, 7, 10, ? — 5वीं आकृति में कुल कितने त्रिभुज हैं?', 'हर चरण में 3 त्रिभुज जुड़ते हैं: हर बार +3। 10 + 3 = 13।'],
  'Square, Circle, Square, Square, Circle, Square, Square, Square, Circle, ? -- following the pattern where the group of squares grows by one each time, what comes next?': ['वर्ग, वृत्त, वर्ग, वर्ग, वृत्त, वर्ग, वर्ग, वर्ग, वृत्त, ? — उस पैटर्न के अनुसार जिसमें वर्गों का समूह हर बार एक बढ़ता है, अगला क्या आएगा?', 'समूह हैं: 1 वर्ग + वृत्त, 2 वर्ग + वृत्त, 3 वर्ग + वृत्त। तीसरे वृत्त के बाद 4 वर्गों का नया समूह शुरू होता है — अगली वस्तु वर्ग है।'],
  'A figure grows by adding a full ring of dots around it: 1, 7, 19, 37, ? -- how many dots in the next figure (using the pattern of centered hexagonal numbers)?': ['एक आकृति अपने चारों ओर बिंदुओं का पूरा घेरा जोड़कर बढ़ती है: 1, 7, 19, 37, ? — अगली आकृति में कितने बिंदु होंगे (केंद्रित षट्भुजीय संख्याओं के पैटर्न से)?', 'पदों के बीच के अंतर 6, 12, 18 हैं (6 के गुणज, हर बार 6 बढ़ते हुए)। अगला अंतर 24 है: 37 + 24 = 61।'],
  'Circle, Half-circle, Quarter-circle, ? -- following the pattern of halving each time, what comes next?': ['वृत्त, अर्धवृत्त, चतुर्थांश वृत्त, ? — हर बार आधा करने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर चरण में दिखने वाला वृत्त का भाग आधा हो जाता है: पूरा, आधा, चौथाई। अगले चरण में फिर आधा होगा — वृत्त का आठवाँ भाग।'],
  'A, C, F, J, ? -- the gap increases by 1 each time (skip pattern). What comes next?': ['A, C, F, J, ? — अंतर हर बार 1 बढ़ता है (छोड़ने का पैटर्न)। अगला क्या आएगा?', 'अंतर: A से C +2, C से F +3, F से J +4। अगला अंतर +5 है: J + 5 = O।'],
  "A number pattern representing growing squares' areas: 1, 4, 9, 16, 25, ? -- what is the area of the 6th square (side length 6)?": ['बढ़ते वर्गों के क्षेत्रफल दर्शाने वाला संख्या-पैटर्न: 1, 4, 9, 16, 25, ? — 6ठे वर्ग का क्षेत्रफल (भुजा 6) क्या है?', 'ये पूर्ण वर्ग हैं (भुजा का वर्ग): 1, 4, 9, 16, 25, 36। 6ठा पद 6 का वर्ग = 36 है।'],
  '3 dots, 3 dots, 6 dots, 3 dots, 3 dots, 6 dots, 3 dots, ? -- following the repeating group pattern, what comes next?': ['3 बिंदु, 3 बिंदु, 6 बिंदु, 3 बिंदु, 3 बिंदु, 6 बिंदु, 3 बिंदु, ? — दोहराते समूह के पैटर्न के अनुसार अगला क्या आएगा?', 'पैटर्न 3 के समूहों में दोहराता है: (3, 3, 6)। 7वीं वस्तु (3) के बाद 8वीं वस्तु उसी समूह को जारी रखती है — 3 बिंदु।'],
  'A pattern of nested squares adds one square layer each time, with each new layer having 4 more unit squares than the last: 4, 8, 12, 16, ? -- how many unit squares in the 5th layer?': ['नेस्टेड वर्गों का एक पैटर्न हर बार एक वर्ग-परत जोड़ता है, जिसमें हर नई परत में पिछली से 4 इकाई वर्ग अधिक होते हैं: 4, 8, 12, 16, ? — 5वीं परत में कितने इकाई वर्ग हैं?', 'हर परत में पिछली से ठीक 4 इकाई वर्ग अधिक होते हैं: हर बार +4। 16 + 4 = 20।'],
};
export function localizePatternL2(q) {
  if (q.chapter !== 'pattern-completion-l2' || typeof q.prompt !== 'string') return q;
  const man = P2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], p2Opt);
  const m = q.prompt.match(/^Complete the letter pattern: ([A-Z, ]+), \?$/);
  if (!m) return q;
  let e = q.exp.match(/^The gaps (?:in the alphabet )?are (\d), (\d), (\d) and then (\d)\. (\w) \+ (\d) = (\w)\.$/);
  if (!e) e = q.exp.match(/^The gaps in the alphabet are (\d), (\d), (\d) and then (\d)\. (\w) \+ (\d) = (\w)\.$/);
  if (!e) return q;
  return bi(q, `अक्षर-पैटर्न पूरा कीजिए: ${m[1]}, ?`, `वर्णमाला में अंतर ${e[1]}, ${e[2]}, ${e[3]} और फिर ${e[4]} हैं। ${e[5]} + ${e[6]} = ${e[7]}।`, p2Opt);
}

// ── Blood Relations (L2) ──
const B2R = {
  Mother: ['माँ', 'f'], Father: ['पिता', 'm'], Aunt: ['आंटी', 'f'], Uncle: ['अंकल', 'm'], Sister: ['बहन', 'f'], Brother: ['भाई', 'm'],
  Grandfather: ['दादा/नाना', 'm'], Grandmother: ['दादी/नानी', 'f'], 'Maternal grandfather': ['नाना', 'm'], 'Paternal grandfather': ['दादा', 'm'],
  'Mother-in-law': ['सास', 'f'], 'Father-in-law': ['ससुर', 'm'], 'Grandmother-in-law': ['दादी-सास', 'f'], Cousin: ['कज़िन', 'm'],
  Nephew: ['भतीजा/भांजा', 'm'], Niece: ['भतीजी/भांजी', 'f'], Daughter: ['बेटी', 'f'], Son: ['बेटा', 'm'], Wife: ['पत्नी', 'f'],
  Husband: ['पति', 'm'], 'Son-in-law': ['दामाद', 'm'], 'Brother-in-law': ['जीजा/साला', 'm'], 'Sister-in-law': ['भाभी/साली/ननद', 'f'],
  Grandson: ['पोता/नाती', 'm'], Granddaughter: ['पोती/नातिन', 'f'],
};
const b2n = {
  Kartik: 'कार्तिक', Pushpa: 'पुष्पा', Dinesh: 'दिनेश', Sameer: 'समीर', Lata: 'लता', Tej: 'तेज', Ria: 'रिया', Jatin: 'जतिन', Ira: 'इरा',
  Mona: 'मोना', Nandini: 'नंदिनी', Rajan: 'राजन', Simran: 'सिमरन', Ravi: 'रवि', Sudha: 'सुधा', Naveen: 'नवीन', Anil: 'अनिल',
  Bhavna: 'भावना', Yash: 'यश', Leena: 'लीना', Tarun: 'तरुण', Rita: 'रीता', Pooja: 'पूजा', Sahil: 'साहिल', Mamta: 'ममता', Ajay: 'अजय',
  Rekha: 'रेखा', Mohit: 'मोहित', Ritu: 'ऋतु', Kunal: 'कुणाल', Asha: 'आशा', Harsh: 'हर्ष', Lalita: 'ललिता', Nitin: 'नितिन', Kiran: 'किरण',
  Hema: 'हेमा', Ganga: 'गंगा', Mahesh: 'महेश', Meena: 'मीना', Arun: 'अरुण', Gautam: 'गौतम', Lakshmi: 'लक्ष्मी', Hemant: 'हेमंत',
  Girish: 'गिरीश', Rohan: 'रोहन', Kamla: 'कमला', Farhan: 'फ़रहान', Zaid: 'ज़ैद', Noor: 'नूर', Shyam: 'श्याम', Vikas: 'विकास',
  Shobha: 'शोभा', Deepak: 'दीपक', Sunny: 'सनी', Tara: 'तारा', Shanta: 'शांता', Vikram: 'विक्रम',
};
const b2 = (n) => b2n[n] || n;
const b2Opt = (o) => (B2R[o] ? B2R[o][0] : o);
const b2Rel = (r) => {
  const key = r.charAt(0).toUpperCase() + r.slice(1);
  return B2R[key] || null;
};
const B2_MANUAL = {
  'Pointing to a man, a woman says "His mother is the only daughter of my mother." How is the woman related to the man?': ['एक पुरुष की ओर इशारा करके एक महिला कहती है, "उसकी माँ मेरी माँ की इकलौती बेटी है।" वह महिला उस पुरुष की क्या लगती है?', '"मेरी माँ की इकलौती बेटी" स्वयं वह महिला ही है — वह अपनी माँ की इकलौती बेटी है। इसलिए "उसकी माँ" का मतलब वही महिला है, यानी वह उस पुरुष की माँ है।'],
  'A + B means A is the father of B. A – B means A is the mother of B. If P + Q – R, how is P related to R?': ['A + B का अर्थ है A, B का पिता है। A – B का अर्थ है A, B की माँ है। यदि P + Q – R, तो P का R से क्या संबंध है?', 'P + Q का अर्थ है P, Q का पिता है। Q – R का अर्थ है Q, R की माँ है। इसलिए P, R की माँ का पिता है — यानी P, R का नाना है।'],
  "If Ravi's father is Suresh's son, how is Suresh related to Ravi?": ['यदि रवि के पिता सुरेश के बेटे हैं, तो सुरेश का रवि से क्या संबंध है?', 'सुरेश का बेटा रवि का पिता है। इसलिए सुरेश, रवि के पिता का पिता है — यानी सुरेश रवि का दादा है।'],
  'Anita says "That girl is the wife of the grandson of my mother." Who is Anita to the girl?': ['अनीता कहती है, "वह लड़की मेरी माँ के पोते/नाती की पत्नी है।" अनीता उस लड़की की क्या लगती है?', 'इसे यूँ पढ़ें: "मेरी माँ का पोता/नाती" अनीता का अपना बेटा है (यहाँ सबसे सीधा पारिवारिक अर्थ)। लड़की उसकी पत्नी है — इसलिए लड़की की ओर से अनीता उसके पति की माँ है, यानी उसकी सास।'],
  "Neha is the only child of Mr. and Mrs. Sharma. Neha's son refers to Mr. Sharma as ?": ['नेहा श्रीमान और श्रीमती शर्मा की इकलौती संतान है। नेहा का बेटा श्री शर्मा को क्या कहेगा?', 'नेहा श्री शर्मा की बेटी है। उसके बेटे के लिए माँ (नेहा) की ओर से पिता नाना कहलाते हैं — और वही श्री शर्मा हैं।'],
  'Introducing a man, a woman says "He is the brother of my uncle\'s only daughter." How is the man related to the woman?': ['एक पुरुष का परिचय कराते हुए एक महिला कहती है, "वह मेरे अंकल की इकलौती बेटी का भाई है।" वह पुरुष उस महिला का क्या लगता है?', '"मेरे अंकल की इकलौती बेटी" महिला की कज़िन है। पुरुष उस कज़िन का भाई है — यानी वह भी अंकल की संतान है, इसलिए वह भी महिला का कज़िन है।'],
  'A man says "This boy\'s mother is my only sister." How is the man related to the boy?': ['एक आदमी कहता है, "इस लड़के की माँ मेरी इकलौती बहन है।" वह आदमी उस लड़के का क्या लगता है?', 'लड़के की माँ उस आदमी की बहन है। यानी आदमी उसका भाई है, और उसकी बहन का बेटा — यह लड़का — उसका भांजा है, इसलिए आदमी लड़के का मामा (अंकल) है।'],
  "My mother's brother's son is my ?": ['मेरे मामा का बेटा मेरा क्या लगता है?', 'आपकी माँ का भाई आपका मामा है। उसका बेटा आपका कज़िन है — भाई-बहनों की संतानें आपस में कज़िन होती हैं।'],
  'Pointing to a photo, a man says, "She is the daughter of my father\'s only son." If the man has no brothers, who is the woman to him?': ['एक फ़ोटो की ओर इशारा करके एक आदमी कहता है, "वह मेरे पिता के इकलौते बेटे की बेटी है।" यदि आदमी का कोई भाई नहीं है, तो वह महिला उसकी क्या लगती है?', 'आदमी के पिता का इकलौता बेटा स्वयं वह आदमी ही है (क्योंकि उसका कोई भाई नहीं)। इसलिए महिला स्वयं उस आदमी की बेटी है।'],
  'A introduces B saying, "B is the son of my father\'s sister." How is B related to A?': ['A, B का परिचय कराते हुए कहता है, "B मेरे पिता की बहन का बेटा है।" B, A का क्या लगता है?', 'A के पिता की बहन A की बुआ है। उसका बेटा A का कज़िन है।'],
  'Pointing to a man, a woman says, "His mother is the only daughter of my mother." How is the woman related to the man?': ['एक पुरुष की ओर इशारा करके एक महिला कहती है, "उसकी माँ मेरी माँ की इकलौती बेटी है।" वह महिला उस पुरुष की क्या लगती है?', 'महिला की माँ की इकलौती बेटी स्वयं वह महिला ही है। इसलिए पुरुष की माँ वही महिला है।'],
  "A is B's father. C is A's mother. D is C's husband. How is D related to B?": ['A, B का पिता है। C, A की माँ है। D, C का पति है। D का B से क्या संबंध है?', 'C, A की माँ है और D, C का पति है, इसलिए D, A का पिता है। चूँकि A, B का पिता है, इसलिए D (A का पिता) B का दादा है।'],
  'P and Q are brother and sister, sharing the same mother and father. R is the mother of P. Who is R to Q?': ['P और Q भाई-बहन हैं, उनके माता-पिता एक ही हैं। R, P की माँ है। R, Q की क्या लगती है?', 'चूँकि P और Q सगे भाई-बहन हैं जिनके माता-पिता दोनों एक ही हैं, इसलिए P की माँ R, Q की भी माँ है।'],
  'A man said, "This girl is the wife of the grandson of my mother." What is the relationship of the man to the girl?': ['एक आदमी ने कहा, "यह लड़की मेरी माँ के पोते/नाती की पत्नी है।" उस आदमी का उस लड़की से क्या संबंध है?', '"मेरी माँ का पोता/नाती" को आदमी का अपना बेटा पढ़ें (यहाँ सबसे सीधा पारिवारिक अर्थ)। लड़की उस बेटे की पत्नी है, इसलिए आदमी उसका ससुर है।'],
  'X and Y are sisters. R is the mother of X. T is the husband of Y. How is T related to R?': ['X और Y बहनें हैं। R, X की माँ है। T, Y का पति है। T का R से क्या संबंध है?', 'Y, R की बेटी है (क्योंकि X और Y बहनें हैं और R, X की माँ है, इसलिए R, Y की भी माँ है)। T, Y का पति है, इसलिए T, R का दामाद है।'],
  'Introducing a man, a woman said, "His wife is the only daughter of my father." How is the woman related to the man?': ['एक पुरुष का परिचय कराते हुए एक महिला ने कहा, "उसकी पत्नी मेरे पिता की इकलौती बेटी है।" वह महिला उस पुरुष की क्या लगती है?', 'महिला के पिता की इकलौती बेटी स्वयं वह महिला ही है। इसलिए पुरुष की पत्नी वही महिला है — यानी महिला उस पुरुष की पत्नी है।'],
  "A's father is B. B's sister is C. C's mother is D. D's husband is E. How is E related to A?": ['A के पिता B हैं। B की बहन C है। C की माँ D है। D के पति E हैं। E का A से क्या संबंध है?', 'D, B और C की माँ है, इसलिए D के पति E, B के पिता हैं। चूँकि A के पिता B हैं, इसलिए E (B के पिता) A के दादा हैं।'],
  'Pointing to a boy, a man says, "He is the son of my wife\'s mother\'s only daughter." How is the boy related to the man, assuming the man\'s wife has no sisters?': ['एक लड़के की ओर इशारा करके एक आदमी कहता है, "वह मेरी पत्नी की माँ की इकलौती बेटी का बेटा है।" यह मानते हुए कि आदमी की पत्नी की कोई बहन नहीं है, लड़का आदमी का क्या लगता है?', 'पत्नी की माँ की इकलौती बेटी स्वयं पत्नी ही है (क्योंकि उसकी कोई बहन नहीं)। इसलिए लड़का आदमी की पत्नी का बेटा है — यानी उसका अपना बेटा।'],
  'A is the son of B. C is the daughter of B. D is the husband of C. How is D related to A?': ['A, B का बेटा है। C, B की बेटी है। D, C का पति है। D का A से क्या संबंध है?', 'C, A की बहन है (दोनों B की संतान हैं)। D, C का पति है, इसलिए D, A का बहनोई (जीजा) है।'],
  "P's mother is the sister of Q. Q has no children. R is Q's mother. How is R related to P?": ['P की माँ Q की बहन है। Q की कोई संतान नहीं है। R, Q की माँ है। R का P से क्या संबंध है?', 'Q, P की माँ का भाई/बहन है, यानी R (Q की माँ) P की माँ की भी माँ है — P की नानी।'],
  'Pointing to a photograph, a man says, "I have no brothers, and this man\'s father is my father\'s only son." How is the man in the photograph related to the speaker?': ['एक फ़ोटो की ओर इशारा करके एक आदमी कहता है, "मेरा कोई भाई नहीं है, और इस आदमी के पिता मेरे पिता के इकलौते बेटे हैं।" फ़ोटो वाला आदमी बोलने वाले का क्या लगता है?', '"मेरे पिता का इकलौता बेटा" (यह देखते हुए कि बोलने वाले का कोई भाई नहीं) स्वयं बोलने वाला ही है। इसलिए "इस आदमी के पिता" बोलने वाला है — यानी फ़ोटो वाला आदमी बोलने वाले का बेटा है।'],
  'A and B are brothers. C and D are sisters. A\'s son is C\'s brother. How is D related to A?': ['A और B भाई हैं। C और D बहनें हैं। A का बेटा C का भाई है। D का A से क्या संबंध है?', 'A का बेटा C का भाई है, यानी A, C और D दोनों का पिता है, क्योंकि C और D बहनें हैं। इसलिए D, A की बेटी है।'],
  'Introducing a girl, a boy says, "She is the daughter of the only daughter of my father\'s mother." Who is the girl to the boy?': ['एक लड़की का परिचय कराते हुए एक लड़का कहता है, "वह मेरे पिता की माँ की इकलौती बेटी की बेटी है।" वह लड़की लड़के की क्या लगती है?', 'लड़के के पिता की माँ उसकी दादी है। उसकी इकलौती बेटी लड़के के पिता की बहन है — यानी उसकी बुआ। उस बुआ की बेटी लड़के की कज़िन है।'],
  'M is the father of N. N is the sister of O. O is the son of P. How is P related to M?': ['M, N का पिता है। N, O की बहन है। O, P का बेटा है। P का M से क्या संबंध है?', 'N और O भाई-बहन हैं, M और P की संयुक्त संतान। इसलिए P, M की पत्नी (जीवनसाथी) है।'],
  "A's father has a brother, B. B's son is C. How is C related to A?": ['A के पिता का एक भाई B है। B का बेटा C है। C का A से क्या संबंध है?', 'A के पिता का भाई A का चाचा (अंकल) है। चाचा का बेटा (C) A का कज़िन है।'],
  'A man says, "This woman\'s son is my son\'s father." How is the woman related to the man?': ['एक आदमी कहता है, "इस महिला का बेटा मेरे बेटे का पिता है।" वह महिला उस आदमी की क्या लगती है?', 'आदमी के बेटे का पिता स्वयं वह आदमी ही है। इसलिए महिला का बेटा वही आदमी है — यानी महिला उस आदमी की माँ है।'],
  "P is Q's father. Q is R's mother. S is R's father. How is P related to S?": ['P, Q का पिता है। Q, R की माँ है। S, R का पिता है। P का S से क्या संबंध है?', 'Q, R की माँ और S, R का पिता है, इसलिए Q और S पति-पत्नी हैं। P, Q का पिता है, इसलिए P, S का ससुर है।'],
  'A is the daughter of B. B is the son of C. D is the daughter of C. How is D related to A?': ['A, B की बेटी है। B, C का बेटा है। D, C की बेटी है। D का A से क्या संबंध है?', 'B, C का बेटा है, इसलिए D (जो C की संतान है) B की बहन है। चूँकि A, B की बेटी है, इसलिए D (B की बहन) A की बुआ है।'],
  "Ajay's father's only sister is Rekha. Rekha's son is Mohit. How is Mohit related to Ajay?": ['अजय के पिता की इकलौती बहन रेखा है। रेखा का बेटा मोहित है। मोहित का अजय से क्या संबंध है?', 'परिवार के रिश्तों को क्रम से जोड़ने पर सही संबंध "कज़िन" निकलता है।'],
};
export function localizeBloodL2(q) {
  if (q.chapter !== 'blood-relations-l2' || typeof q.prompt !== 'string') return q;
  const man = B2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], b2Opt);
  const e = q.exp.match(/^Following each family link in turn, ([\w-]+) is the correct relation\.$/);
  if (!e || !B2R[e[1]]) return q;
  const sentence = (s) => {
    let m;
    if ((m = s.match(/^(\w+)'s ([\w-]+) is (\w+)$/)) && b2Rel(m[2])) { const [w, g] = b2Rel(m[2]); return `${b2(m[1])} ${g === 'f' ? 'की' : 'का'} ${w} ${b2(m[3])} है`; }
    if ((m = s.match(/^(\w+) is the ([\w-]+) of (\w+)$/)) && b2Rel(m[2])) { const [w, g] = b2Rel(m[2]); return `${b2(m[1])}, ${b2(m[3])} ${g === 'f' ? 'की' : 'का'} ${w} है`; }
    return null;
  };
  const m = q.prompt.match(/^(.*)\. How is (\w+) related to (\w+)\?$/);
  if (!m) return q;
  const parts = m[1].split('. ').map(sentence);
  if (parts.includes(null)) return q;
  return bi(q, `${parts.join('। ')}। ${b2(m[2])} का ${b2(m[3])} से क्या संबंध है?`, `परिवार के रिश्तों को क्रम से जोड़ने पर सही संबंध "${b2Opt(e[1])}" निकलता है।`, b2Opt);
}

// ── Mirror Images (L2) ──
const M2_OPT = {
  Yes: 'हाँ', No: 'नहीं', Both: 'दोनों', Neither: 'कोई नहीं', 'Only TOT does': 'केवल TOT', 'A diamond': 'एक समचतुर्भुज (डायमंड)', 'A square': 'एक वर्ग',
  'A circle': 'एक वृत्त', 'An oval': 'एक अंडाकार', 'A half-circle': 'एक अर्धवृत्त', 'Only in some fonts': 'केवल कुछ फ़ॉन्ट में',
  'Still pointing straight up': 'अब भी सीधा ऊपर की ओर', 'Pointing sideways': 'बगल की ओर', 'Pointing down': 'नीचे की ओर',
  'A left-pointing arrow (←)': 'बायीं ओर इशारा करता तीर (←)', 'A right-pointing arrow (→)': 'दायीं ओर इशारा करता तीर (→)', 'An up-pointing arrow (↑)': 'ऊपर की ओर इशारा करता तीर (↑)',
  'b and d': 'b और d', 'b and p': 'b और p', 'Both pairs': 'दोनों जोड़ियाँ',
};
const m2Opt = (o) => M2_OPT[o] || o;
const M2_MANUAL = {
  'If a clock shows 3:40, what time does its mirror image show?': ['यदि घड़ी में 3:40 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', 'घड़ी का दर्पण-समय वास्तविक समय को 12:00 में से घटाने पर मिलता है। 12:00 − 3:40 = 8:20।'],
  'Which of these letter sequences looks the same in a mirror: AHA, BOB, DAD?': ['इनमें से कौन-सा अक्षर-क्रम दर्पण में वैसा ही दिखता है: AHA, BOB, DAD?', 'किसी शब्द के दर्पण में हू-ब-हू वैसा दिखने के लिए हर अक्षर स्वयं बाएँ-दाएँ सममित होना चाहिए (जैसे A, H, M, O, T, U, V, W, X, Y)। B और D का एक किनारा गोलाकार है, इसलिए दर्पण में उनकी सममिति टूट जाती है — केवल AHA पूरी तरह सममित अक्षरों से बना है।'],
  'The mirror image of the number "1001" is ?': ['संख्या "1001" का दर्पण-प्रतिबिंब क्या है?', '0 और 1 दोनों बाएँ-दाएँ सममित अंक हैं, और "1001" आगे-पीछे दोनों ओर से एक जैसा पढ़ा जाता है — इसलिए वह दर्पण में हू-ब-हू अपने जैसा ही रहता है।'],
  'A square rotated 45° looks like a diamond. What does its mirror image look like?': ['45° घुमाया गया वर्ग समचतुर्भुज (डायमंड) जैसा दिखता है। उसका दर्पण-प्रतिबिंब कैसा दिखेगा?', 'समचतुर्भुज अपनी ऊर्ध्वाधर केंद्र-रेखा के दोनों ओर सममित होता है, इसलिए उसे बाएँ-दाएँ उलटने पर वह बिल्कुल वैसा ही दिखता है — फिर भी समचतुर्भुज।'],
  'If a clock shows 9:15, its mirror image shows?': ['यदि घड़ी में 9:15 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 9:15 = 2:45, उसी दर्पण-घड़ी नियम से।'],
  'Which number looks the same in a mirror: 0, 1, 2?': ['कौन-सी संख्या दर्पण में वैसी ही दिखती है: 0, 1, 2?', '0 एक सरल सममित अंडाकार है, इसलिए वह दोनों तरह एक जैसा दिखता है। 2 उलटने पर साफ़ बदल जाता है, और मानक छपाई में 1 के ऊपर आमतौर पर एक छोटा तिरछा झंडा होता है जो उसकी सममिति भी तोड़ देता है — 0 सुरक्षित, असंदिग्ध उत्तर है।'],
  'In a mirror placed on the right side, the letter "d" appears as ?': ['दायीं ओर रखे दर्पण में अक्षर "d" कैसा दिखाई देता है?', 'बाएँ-दाएँ दर्पण अक्षर की ऊर्ध्वाधर रेखा को एक ओर से दूसरी ओर पहुँचा देता है। "d" की रेखा दायीं ओर है — उलटने पर वह बायीं ओर चली जाती है, जो ठीक "b" जैसा दिखता है।'],
  'If a clock shows 6:30, what time does its mirror image show?': ['यदि घड़ी में 6:30 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 6:30 = 5:30।'],
  'In a mirror, the word "TOT" combined with "MOM" (as one phrase "TOT MOM") -- does the whole phrase mirror to itself?': ['दर्पण में, शब्द "TOT" को "MOM" के साथ मिलाकर (एक वाक्यांश "TOT MOM" के रूप में) — क्या पूरा वाक्यांश दर्पण में अपने जैसा ही रहता है?', 'T, O और M तीनों ऊर्ध्वाधर रूप से सममित अक्षर हैं, और TOT तथा MOM दोनों अलग-अलग पैलिंड्रोम हैं — इसलिए पूरा वाक्यांश TOT MOM दर्पण में अपने जैसा ही रहता है।'],
  'If a clock shows 2:20, what time does its mirror image show?': ['यदि घड़ी में 2:20 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 2:20 = 9:40, उसी दर्पण-घड़ी नियम से।'],
  'If a clock shows 4:50, what time does its mirror image show?': ['यदि घड़ी में 4:50 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 4:50 = 7:10।'],
  'If a clock shows 10:10, what time does its mirror image show?': ['यदि घड़ी में 10:10 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 10:10 = 1:50।'],
  'If a clock shows 1:05, what time does its mirror image show?': ['यदि घड़ी में 1:05 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 1:05 = 10:55।'],
  'If a clock shows 7:25, what time does its mirror image show?': ['यदि घड़ी में 7:25 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 7:25 = 4:35।'],
  'If a clock shows 11:40, what time does its mirror image show?': ['यदि घड़ी में 11:40 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 11:40 = 0:20, जो घड़ी के चेहरे पर 12:20 के रूप में दिखाया जाता है।'],
  'If a clock shows 5:00, what time does its mirror image show?': ['यदि घड़ी में 5:00 बजे हैं, तो उसके दर्पण-प्रतिबिंब में कितने बजे दिखेंगे?', '12:00 − 5:00 = 7:00।'],
  'Which letter is mirror-symmetric: "F" or "H"?': ['कौन-सा अक्षर दर्पण-सममित है: "F" या "H"?', 'H के दोनों ओर एक-एक ऊर्ध्वाधर रेखा है और बीच में एक मिलती-जुलती पट्टी — उसे बाएँ-दाएँ उलटने पर वह हू-ब-हू वैसा ही दिखता है। F की भुजाएँ केवल एक ओर निकली हैं, इसलिए उलटने पर उसका आकार बदल जाता है।'],
  'Which letter looks the same in a mirror: "K" or "X"?': ['कौन-सा अक्षर दर्पण में वैसा ही दिखता है: "K" या "X"?', 'X दो तिरछी रेखाओं के क्रॉस से बना है जो दर्पण में एक-दूसरे पर पूरी तरह मेल खाती हैं। K की दोनों भुजाएँ ऊर्ध्वाधर रेखा से केवल दायीं ओर जाती हैं, इसलिए उलटने पर उनकी दिशा बदल जाती है।'],
  'Which word is made ENTIRELY of mirror-symmetric letters: "TOY" or "BOY"?': ['कौन-सा शब्द पूरी तरह दर्पण-सममित अक्षरों से बना है: "TOY" या "BOY"?', 'T, O और Y तीनों अपने आप में सममित अक्षर हैं। BOY में अक्षर B सममित नहीं है, इसलिए BOY दर्पण में अपने जैसा नहीं रहता।'],
  'Is the letter "S" mirror-symmetric (does it look the same flipped left-right)?': ['क्या अक्षर "S" दर्पण-सममित है (क्या बाएँ-दाएँ उलटने पर वह वैसा ही दिखता है)?', 'S ऊपर एक ओर मुड़ता है और नीचे विपरीत ओर। दर्पण में वह उलटे S जैसा दिखता है, वही S नहीं।'],
  'Which of these three letters is NOT mirror-symmetric: "A", "M", "N"?': ['इन तीन अक्षरों में से कौन-सा दर्पण-सममित नहीं है: "A", "M", "N"?', 'A और M दोनों बीच की रेखा के दोनों ओर सममित हैं। N की तिरछी रेखा नीचे-बायें से ऊपर-दायें जाती है, इसलिए उसे बाएँ-दाएँ उलटने पर N वापस नहीं मिलता।'],
  'Which digit is mirror-symmetric: "5" or "8"?': ['कौन-सा अंक दर्पण-सममित है: "5" या "8"?', '8 एक के ऊपर एक रखे दो सममित फंदों से बना है, इसलिए उलटने पर वह वैसा ही दिखता है। 5 का एक ओर खुला हिस्सा है जो दर्पण में साफ़ बदल जाता है।'],
  'The mirror image of the number "808" is ?': ['संख्या "808" का दर्पण-प्रतिबिंब क्या है?', '8 और 0 दोनों अपने आप में दर्पण-सममित अंक हैं, और "808" आगे-पीछे दोनों ओर से एक जैसा पढ़ा जाता है — इसलिए वह दर्पण में हू-ब-हू अपने जैसा ही रहता है।'],
  'The mirror image of the number "88" is ?': ['संख्या "88" का दर्पण-प्रतिबिंब क्या है?', '8 एक सममित अंक है, और दोनों अंक एक ही हैं, इसलिए "88" दर्पण में अपने जैसा ही रहता है।'],
  'What does a circle look like when mirrored?': ['वृत्त को दर्पण में देखने पर वह कैसा दिखता है?', 'वृत्त हर दिशा में सममित होता है, इसलिए उसे बाएँ-दाएँ उलटने पर वह बिल्कुल वैसा ही दिखता है।'],
  'An equilateral triangle pointing straight up is mirrored left-right. What does it look like now?': ['सीधे ऊपर की ओर इशारा करते समबाहु त्रिभुज को बाएँ-दाएँ दर्पण में देखा जाता है। अब वह कैसा दिखता है?', 'सीधा ऊपर की ओर इशारा करता त्रिभुज अपनी ही ऊर्ध्वाधर केंद्र-रेखा के दोनों ओर सममित होता है, इसलिए बाएँ-दाएँ दर्पण से वह अपरिवर्तित रहता है।'],
  'A right-pointing arrow (→) is held up to a mirror. What does its reflection show?': ['दायीं ओर इशारा करता तीर (→) दर्पण के सामने रखा जाता है। उसका प्रतिबिंब क्या दिखाता है?', 'बाएँ-दाएँ दर्पण क्षैतिज दिशा को उलट देता है, इसलिए दायीं ओर इशारा करता तीर बायीं ओर इशारा करता तीर बनकर दिखता है।'],
  'In a mirror, the letter "b" appears as ?': ['दर्पण में अक्षर "b" कैसा दिखाई देता है?', 'बाएँ-दाएँ दर्पण अक्षर की ऊर्ध्वाधर रेखा को एक ओर से दूसरी ओर पहुँचा देता है। "b" की रेखा बायीं ओर है — उलटने पर वह दायीं ओर चली जाती है, जो ठीक "d" जैसा दिखता है।'],
  'In a mirror, the letter "p" appears as ?': ['दर्पण में अक्षर "p" कैसा दिखाई देता है?', 'b/d वाला ही नियम: "p" की रेखा बायीं ओर है — उलटने पर वह दायीं ओर चली जाती है, जो ठीक "q" जैसा दिखता है।'],
  'Which pair are TRUE left-right mirror images of each other: "b and d" or "b and p"?': ['कौन-सी जोड़ी एक-दूसरे की सच्ची बाएँ-दाएँ दर्पण-प्रतिबिंब है: "b और d" या "b और p"?', 'b और d एक ही आकृति हैं जो बाएँ-दाएँ उलटी हुई है। b और p वास्तव में एक ही आकृति हैं जो ऊपर-नीचे उलटी हुई है, जो एक अलग प्रकार का उलटना है, बाएँ-दाएँ दर्पण नहीं।'],
};
export function localizeMirrorL2(q) {
  if (q.chapter !== 'mirror-images-l2' || typeof q.prompt !== 'string') return q;
  const man = M2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], m2Opt);
  const m = q.prompt.match(/^What is the mirror image of the clock time (\d+:\d+), seen in a mirror placed vertically\?$/);
  const e = q.exp.match(/^The mirror time is 11:60 minus the time, which gives (\d+:\d+)\.$/);
  if (!m || !e) return q;
  return bi(q, `ऊर्ध्वाधर रखे दर्पण में देखने पर घड़ी के समय ${m[1]} का दर्पण-प्रतिबिंब क्या होगा?`, `दर्पण-समय = 11:60 − वास्तविक समय, जिससे ${e[1]} मिलता है।`, m2Opt);
}

export const RA_L2_LOCALIZERS = [localizeOddL2, localizeNumSeriesL2, localizeAnalogyL2, localizeRankingL2, localizeDirectionL2, localizeCodingL2, localizeCalendarL2, localizePatternL2, localizeBloodL2, localizeMirrorL2];
