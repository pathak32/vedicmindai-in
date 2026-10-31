import { localizePrek } from './aptPrekHindi.js';

// Hindi for the Aptitude question bank (Pre-K lives in aptPrekHindi.js). Answers keep their English key.
// Vocabulary questions keep the English word and add a Hindi gloss, so the learner still practises the English word.

const bi = (q, hi, exp, optMap) => ({
  ...q,
  prompt: { en: q.prompt, hi },
  options: q.options.map((o) => (typeof o === 'string' ? { en: o, hi: optMap(o) } : { ...o, en: o.label ?? o.en, hi: optMap(o.label ?? o.en) })),
  exp: { en: q.exp, hi: exp },
});
const id = (o) => o;

// ── Word Meanings ──
const GL = {
  Above: 'ऊपर', Ancient: 'प्राचीन', Angry: 'क्रोधित', Basic: 'बुनियादी', Beautiful: 'सुंदर', Begin: 'शुरू करना', Big: 'बड़ा', Bold: 'साहसी',
  Brave: 'बहादुर', Bright: 'चमकीला', Calm: 'शांत', Clever: 'चतुर', Closed: 'बंद', Cold: 'ठंडा', Complete: 'पूरा', Correct: 'सही',
  Cowardly: 'कायर', Damp: 'नम', Dark: 'अंधेरा', Day: 'दिन', Difficult: 'कठिन', Dirty: 'गंदा', Down: 'नीचे', Dry: 'सूखा', Easy: 'आसान',
  Empty: 'खाली', End: 'अंत', Enormous: 'विशाल', Excited: 'उत्साहित', Famous: 'मशहूर', Fast: 'तेज़', Fearless: 'निडर', Full: 'भरा हुआ',
  Furious: 'अत्यंत क्रोधित', Gentle: 'कोमल', Gift: 'उपहार', Gigantic: 'भीमकाय', Glad: 'प्रसन्न', Glowing: 'दमकता हुआ', Happy: 'खुश',
  Healthy: 'स्वस्थ', High: 'ऊँचा', Historic: 'ऐतिहासिक', Hot: 'गरम', Huge: 'विशाल', Ill: 'बीमार', Journey: 'यात्रा', Joyful: 'आनंदित',
  Large: 'बड़ा', Late: 'देर से', Lose: 'हारना', Loud: 'तेज़ आवाज़ वाला', Miniature: 'लघु', Modern: 'आधुनिक', Morning: 'सुबह', New: 'नया',
  Night: 'रात', Noisy: 'शोरगुल वाला', Noon: 'दोपहर', Odd: 'अजीब', Old: 'पुराना', Open: 'खुला', Peaceful: 'शांतिपूर्ण', Plain: 'सादा',
  Poor: 'गरीब', Present: 'उपहार', Pretty: 'सुंदर', Quick: 'जल्दी', Quiet: 'शांत', Rich: 'अमीर', Right: 'सही', Sad: 'उदास', Sharp: 'तीखा',
  Shiny: 'चमकदार', Short: 'छोटा', Shout: 'चिल्लाना', Sick: 'बीमार', Simple: 'सरल', Sleepy: 'नींद में', Slow: 'धीमा', Small: 'छोटा',
  Smart: 'चतुर', Speedy: 'तेज़ रफ़्तार', Start: 'शुरू करना', Stop: 'रुकना', Strong: 'मज़बूत', Sunny: 'धूप वाला', Tall: 'लंबा',
  Timid: 'डरपोक', Tiny: 'नन्हा', Trip: 'सफ़र', Ugly: 'बदसूरत', Unhappy: 'अप्रसन्न', Up: 'ऊपर', Warm: 'गुनगुना', Weak: 'कमज़ोर',
  Wealthy: 'धनवान', Wet: 'गीला', Whole: 'पूरा', Wide: 'चौड़ा', Win: 'जीतना', Wrong: 'गलत', Yell: 'चीखना', Young: 'जवान',
};
const wg = (s) => (GL[s] ? `${s} (${GL[s]})` : s);
const WM_MANUAL = {
  'Which word does NOT belong: Happy, Joyful, Sad, Glad?': 'Happy, Joyful और Glad — तीनों अच्छा महसूस करने का अर्थ देते हैं। Sad का अर्थ बुरा महसूस करना है — यानी विपरीत।',
  'Which word does NOT belong: Bright, Shiny, Glowing, Dark?': 'Bright, Shiny और Glowing — तीनों रोशनी देने का अर्थ देते हैं। Dark का अर्थ रोशनी का अभाव है — यानी विपरीत।',
  'Which word does NOT belong: Gigantic, Enormous, Huge, Miniature?': 'Gigantic, Enormous और Huge — तीनों बहुत बड़े का अर्थ देते हैं। Miniature का अर्थ बहुत छोटा है — यानी विपरीत।',
};
export function localizeWordMeanings(q) {
  if (q.chapter !== 'word-meanings' || typeof q.prompt !== 'string') return q;
  let m; let e;
  if ((m = q.prompt.match(/^Which word means the same as '(\w+)'\?$/))) {
    const h = `'${wg(m[1])}' का समानार्थी (समान अर्थ वाला) शब्द कौन-सा है?`;
    if ((e = q.exp.match(/^(\w+) means the same as (\w+) -- (.*)\.$/)) || (e = q.exp.match(/^'(\w+)' and '(\w+)' mean the same thing\.$/))) {
      return bi(q, h, `${e[1]} और ${e[2]} का अर्थ समान है — ${wg(e[1])} और ${wg(e[2])}।`, wg);
    }
    return q;
  }
  if ((m = q.prompt.match(/^Which word means the (?:OPPOSITE|opposite) of '(\w+)'\?$/))) {
    const h = `'${wg(m[1])}' का विलोम (उलटा अर्थ वाला) शब्द कौन-सा है?`;
    if ((e = q.exp.match(/^(\w+) is the opposite of (\w+)\.$/))) return bi(q, h, `${e[1]} और ${e[2]} विलोम हैं — ${wg(e[1])} बनाम ${wg(e[2])}।`, wg);
    if ((e = q.exp.match(/^'(\w+)' and '(\w+)' are opposites\.$/))) return bi(q, h, `${e[1]} और ${e[2]} विलोम हैं — ${wg(e[1])} बनाम ${wg(e[2])}।`, wg);
    return q;
  }
  if ((m = q.prompt.match(/^Which word does NOT belong: (.+)\?$/)) && WM_MANUAL[q.prompt]) {
    return bi(q, `कौन-सा शब्द समूह का नहीं है: ${m[1].split(', ').map(wg).join(', ')}?`, WM_MANUAL[q.prompt], wg);
  }
  return q;
}

// ── Shape Patterns ──
const SH = {
  Triangle: 'त्रिभुज', Square: 'वर्ग', Pentagon: 'पंचभुज', Hexagon: 'षट्भुज', Heptagon: 'सप्तभुज', Octagon: 'अष्टभुज', Nonagon: 'नवभुज',
  Decagon: 'दशभुज', Hendecagon: 'एकादशभुज', Dodecagon: 'द्वादशभुज', Circle: 'वृत्त', Oval: 'अंडाकार', Ellipse: 'दीर्घवृत्त',
  Rectangle: 'आयत', Rhombus: 'समचतुर्भुज', Star: 'तारा', Heart: 'दिल', Diamond: 'हीरा', Cube: 'घन', Sphere: 'गोला', Pyramid: 'पिरामिड',
  Same: 'बराबर', Both: 'दोनों', Neither: 'कोई नहीं',
};
const SHM = { Small: 'छोटा', Medium: 'मध्यम', Large: 'बड़ा', 'Extra-large': 'बहुत बड़ा', Big: 'बड़ा', Tiny: 'बहुत छोटा', Red: 'लाल', Blue: 'नीला', Green: 'हरा', Yellow: 'पीला' };
function shItem(s) {
  const t = s.trim();
  if (SH[t]) return SH[t];
  const m = t.match(/^([A-Za-z-]+) ([A-Za-z]+)$/);
  if (m) {
    const mod = SHM[m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()];
    const sh = SH[m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase()];
    if (mod && sh) return `${mod} ${sh}`;
  }
  return t;
}
const shList = (s) => s.split(', ').map(shItem).join(', ');
const SH_MANUAL = {
  'Which shape has the MOST sides: Triangle, Square, Pentagon?': ['किस आकृति में सबसे अधिक भुजाएँ हैं: त्रिभुज, वर्ग, पंचभुज?', 'पंचभुज की 5 भुजाएँ हैं, जो वर्ग (4 भुजाएँ) या त्रिभुज (3 भुजाएँ) से अधिक हैं।'],
  'Small circle, medium circle, large circle, ? -- what comes next?': ['छोटा वृत्त, मध्यम वृत्त, बड़ा वृत्त, ? — आगे क्या आएगा?', 'वृत्त हर बार बड़े होते जाते हैं। अगला बहुत बड़ा वृत्त है।'],
  'Which shape has NO corners?': ['किस आकृति में कोई कोना नहीं है?', 'वृत्त गोल होता है और उसमें कोई कोना नहीं होता, वर्ग या त्रिभुज के विपरीत।'],
  'Triangle, Square, Pentagon, ? -- following the pattern of adding one side, what comes next?': ['त्रिभुज, वर्ग, पंचभुज, ? — एक-एक भुजा जोड़ने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर आकृति में पिछली से एक भुजा अधिक है: 3, 4, 5। अगली आकृति में 6 भुजाएँ होंगी — षट्भुज।'],
  'Which shape does not belong: Circle, Oval, Square, Ellipse?': ['कौन-सी आकृति समूह की नहीं है: वृत्त, अंडाकार, वर्ग, दीर्घवृत्त?', 'वृत्त, अंडाकार और दीर्घवृत्त — तीनों वक्र/गोल आकृतियाँ हैं। वर्ग की भुजाएँ सीधी हैं।'],
  'Which shape does not belong: Triangle, Pentagon, Hexagon, Circle?': ['कौन-सी आकृति समूह की नहीं है: त्रिभुज, पंचभुज, षट्भुज, वृत्त?', 'त्रिभुज, पंचभुज और षट्भुज — तीनों की भुजाएँ सीधी हैं। वृत्त गोल है और उसकी कोई भुजा नहीं होती।'],
  'Square, Pentagon, Hexagon, ? -- following the pattern of adding one side, what comes next?': ['वर्ग, पंचभुज, षट्भुज, ? — एक-एक भुजा जोड़ने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर आकृति में पिछली से एक भुजा अधिक है: 4, 5, 6। अगली आकृति में 7 भुजाएँ होंगी — सप्तभुज।'],
  'Which shape has the FEWEST sides: Square, Triangle, Pentagon?': ['किस आकृति में सबसे कम भुजाएँ हैं: वर्ग, त्रिभुज, पंचभुज?', 'त्रिभुज की 3 भुजाएँ हैं, जो वर्ग (4 भुजाएँ) या पंचभुज (5 भुजाएँ) से कम हैं।'],
  'Big star, medium star, small star, ? -- what comes next?': ['बड़ा तारा, मध्यम तारा, छोटा तारा, ? — आगे क्या आएगा?', 'तारे हर बार छोटे होते जाते हैं। अगला बहुत छोटा तारा है।'],
  'Which shape has exactly 4 equal sides?': ['किस आकृति में ठीक 4 बराबर भुजाएँ हैं?', 'वर्ग की ठीक 4 बराबर भुजाएँ होती हैं, आयत (असमान भुजाएँ) या त्रिभुज (3 भुजाएँ) के विपरीत।'],
  'Which shape does not belong: Square, Rectangle, Rhombus, Circle?': ['कौन-सी आकृति समूह की नहीं है: वर्ग, आयत, समचतुर्भुज, वृत्त?', 'वर्ग, आयत और समचतुर्भुज — तीनों चतुर्भुज हैं (4 सीधी भुजाएँ)। वृत्त की कोई सीधी भुजा नहीं होती।'],
  'Triangle, Triangle, Square, Triangle, Triangle, ? -- what comes next?': ['त्रिभुज, त्रिभुज, वर्ग, त्रिभुज, त्रिभुज, ? — आगे क्या आएगा?', 'पैटर्न हर 3 पर दोहराता है: त्रिभुज, त्रिभुज, वर्ग। अगला वर्ग आता है।'],
  'Which shape has MORE corners: Pentagon or Square?': ['किस आकृति में अधिक कोने हैं: पंचभुज या वर्ग?', 'पंचभुज के 5 कोने हैं, जो वर्ग के 4 कोनों से अधिक हैं।'],
  'Which shape rolls easily: Cube, Sphere, Pyramid?': ['कौन-सी आकृति आसानी से लुढ़कती है: घन, गोला, पिरामिड?', 'गोला पूरी तरह गोल होता है और आसानी से लुढ़कता है, घन या पिरामिड के विपरीत जिनके सपाट फलक होते हैं।'],
  'Hexagon, Pentagon, Square, ? -- following the pattern of losing one side, what comes next?': ['षट्भुज, पंचभुज, वर्ग, ? — एक-एक भुजा घटाने के पैटर्न के अनुसार अगला क्या आएगा?', 'हर आकृति में पिछली से एक भुजा कम है: 6, 5, 4। अगली आकृति में 3 भुजाएँ होंगी — त्रिभुज।'],
  'Which shape has NO straight sides?': ['किस आकृति में कोई सीधी भुजा नहीं है?', 'वृत्त पूरी तरह वक्र होता है और उसकी कोई सीधी भुजा नहीं होती, वर्ग या त्रिभुज के विपरीत।'],
  'Diamond, Diamond, Star, Diamond, Diamond, ? -- what comes next?': ['हीरा, हीरा, तारा, हीरा, हीरा, ? — आगे क्या आएगा?', 'पैटर्न हर 3 पर दोहराता है: हीरा, हीरा, तारा। अगला तारा आता है।'],
  'Which shape is used for a stop sign: Circle, Octagon, Square?': ['स्टॉप के संकेत-चिह्न के लिए कौन-सी आकृति प्रयोग होती है: वृत्त, अष्टभुज, वर्ग?', 'स्टॉप का संकेत-चिह्न अष्टभुज (8 भुजाएँ) के आकार का होता है।'],
  'Small square, big square, small square, big square, ? -- what comes next?': ['छोटा वर्ग, बड़ा वर्ग, छोटा वर्ग, बड़ा वर्ग, ? — आगे क्या आएगा?', 'पैटर्न बारी-बारी से चलता है: छोटा, बड़ा... अगला छोटा वर्ग आता है।'],
  'Which shape has equal sides AND equal angles: Rectangle or Square?': ['किस आकृति में भुजाएँ भी बराबर हैं और कोण भी बराबर: आयत या वर्ग?', 'वर्ग की चारों भुजाएँ बराबर और चारों कोण बराबर (90° प्रत्येक) होते हैं। आयत में केवल कोण बराबर होते हैं, भुजाएँ ज़रूरी नहीं।'],
  'Yellow triangle, Yellow triangle, Blue triangle, ? -- following the repeating group, what comes next?': ['पीला त्रिभुज, पीला त्रिभुज, नीला त्रिभुज, ? — दोहराते समूह के अनुसार अगला क्या आएगा?', 'पैटर्न हर 3 पर दोहराता है: पीला, पीला, नीला। नीले के बाद अगला समूह फिर पीले से शुरू होता है।'],
  'Red circle, Blue circle, Red circle, Blue circle, ? -- what comes next?': ['लाल वृत्त, नीला वृत्त, लाल वृत्त, नीला वृत्त, ? — आगे क्या आएगा?', 'पैटर्न बारी-बारी से चलता है: लाल, नीला... अगला लाल वृत्त आता है।'],
  'Which shape looks the same when rotated any amount: Square or Circle?': ['कौन-सी आकृति किसी भी कोण से घुमाने पर एक जैसी दिखती है: वर्ग या वृत्त?', 'वृत्त कितना भी घुमाने पर हू-ब-हू एक जैसा दिखता है। वर्ग केवल खास कोणों (90°) पर ही वैसा दिखता है।'],
};
export function localizeShapePatterns(q) {
  if (q.chapter !== 'shape-patterns' || typeof q.prompt !== 'string') return q;
  const man = SH_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], shItem);
  let m; let e;
  if ((m = q.prompt.match(/^(.+), \? (?:--|—) what comes next\?$/))) {
    const head = `${shList(m[1])}, ? — आगे क्या आएगा?`;
    if ((e = q.exp.match(/^The pattern alternates (.+)\.\.\. Next comes (.+)\.$/))) return bi(q, head, `पैटर्न बारी-बारी से चलता है: ${shList(e[1])}... अगला ${shItem(e[2])} आता है।`, shItem);
    if ((e = q.exp.match(/^The two shapes alternate, so the next one is (\w+)\.$/))) return bi(q, head, `दोनों आकृतियाँ बारी-बारी से आती हैं, इसलिए अगली ${shItem(e[1])} है।`, shItem);
    if ((e = q.exp.match(/^Each shape has one more side than the one before\. Next: (\w+)\.$/))) return bi(q, head, `हर आकृति में पिछली से एक भुजा अधिक है। अगली: ${shItem(e[1])}।`, shItem);
    if ((e = q.exp.match(/^Each step skips one shape: the next one is (\w+)\.$/))) return bi(q, head, `हर कदम पर एक आकृति छोड़ी जाती है: अगली आकृति ${shItem(e[1])} है।`, shItem);
  }
  return q;
}

// ── Reasoning Connect (Primary) ──
const RCW = {
  Wednesday: 'बुधवार', Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार', Sunday: 'रविवार', Monday: 'सोमवार', Tuesday: 'मंगलवार',
  Uncle: 'अंकल', Father: 'पिता', Grandfather: 'दादा/नाना', Cousin: 'कज़िन', Grandmother: 'दादी/नानी', Aunt: 'आंटी',
  Apple: 'सेब', Banana: 'केला', Carrot: 'गाजर', Mango: 'आम', Rose: 'गुलाब', Lily: 'कुमुदिनी', Tulip: 'ट्यूलिप', Hammer: 'हथौड़ा',
  Screwdriver: 'पेचकस', Wrench: 'रिंच', Guitar: 'गिटार', Drum: 'ढोल', Flute: 'बाँसुरी', Ball: 'गेंद', Book: 'किताब', Read: 'पढ़ना',
  Song: 'गीत', Listen: 'सुनना', Write: 'लिखना', Watch: 'देखना', Pen: 'कलम', Scissors: 'कैंची', Cut: 'काटना', Draw: 'चित्र बनाना',
  Key: 'चाबी', Lock: 'ताला', Password: 'पासवर्ड', Account: 'खाता', Computer: 'कंप्यूटर', Phone: 'फ़ोन',
  Yes: 'हाँ', No: 'नहीं', 'Cannot say': 'कह नहीं सकते',
};
const RCP = {
  Cats: 'बिल्लियाँ', Mammals: 'स्तनधारी', Animals: 'जानवर', Squares: 'वर्ग', Rectangles: 'आयत', Quadrilaterals: 'चतुर्भुज', Roses: 'गुलाब',
  Flowers: 'फूल', Plants: 'पौधे', Teachers: 'शिक्षक', Professionals: 'पेशेवर', Workers: 'कामगार', Apples: 'सेब', Fruits: 'फल',
  Foods: 'खाद्य पदार्थ', Sparrows: 'गौरैया', Birds: 'पक्षी', Oaks: 'बलूत (ओक) के पेड़', Trees: 'पेड़', Lions: 'शेर', Cars: 'कारें',
  Vehicles: 'वाहन', Machines: 'मशीनें', Pianos: 'पियानो', Instruments: 'वाद्य-यंत्र', Objects: 'वस्तुएँ', Mangoes: 'आम', Dogs: 'कुत्ते',
};
const rcp = (s) => RCP[s] || s;
const rcOpt = (o) => {
  let m;
  if ((m = o.match(/^(Some|All|No) (\w+) are (\w+)$/)) && RCP[m[2]]) {
    return m[1] === 'Some' ? `कुछ ${rcp(m[2])}, ${rcp(m[3])} हैं` : m[1] === 'All' ? `सभी ${rcp(m[2])}, ${rcp(m[3])} हैं` : `कोई ${rcp(m[2]).replace(/ के पेड़$/, '')}, ${rcp(m[3])} नहीं हैं`;
  }
  return RCW[o] || o;
};
const RC_MANUAL = {
  'If today is Monday, what day is it 3 days later?': ['यदि आज सोमवार है, तो 3 दिन बाद कौन-सा दिन होगा?', 'सोमवार + 3 दिन = गुरुवार। (इस तरह की कैलेंडर-तर्कशक्ति रीज़निंग सेक्शन में भी आती है।)'],
  "My father's father is my ?": ['मेरे पिता के पिता मेरे क्या लगते हैं?', 'आपके पिता के पिता आपके दादा हैं। (पारिवारिक संबंधों का तर्क रीज़निंग सेक्शन के रक्त-संबंध अध्याय में पूरी तरह समझाया गया है।)'],
  'A is taller than B. B is taller than C. Who is the shortest?': ['A, B से लंबा है। B, C से लंबा है। सबसे छोटा कौन है?', 'क्रम: A > B > C। C सबसे नीचे है — सबसे छोटा। (यह क्रमबद्धता का कौशल रीज़निंग सेक्शन के रैंकिंग और क्रम अध्याय में भी आता है।)'],
  'Which does not belong: Apple, Banana, Carrot, Mango?': ['कौन-सा समूह का नहीं है: सेब, केला, गाजर, आम?', 'सेब, केला और आम फल हैं। गाजर एक सब्ज़ी है। (यह वर्गीकरण का कौशल रीज़निंग सेक्शन के बेमेल चुनें अध्याय से मेल खाता है।)'],
  'Book is to Read as Song is to ?': ['किताब का पढ़ने से वही संबंध है जो गीत का किससे है?', 'किताब पढ़ने के लिए होती है; गीत सुनने के लिए होता है। (यह सादृश्य का कौशल रीज़निंग सेक्शन में भी सिखाया जाता है।)'],
  'If all Birds can fly, and a Sparrow is a Bird, can a Sparrow fly?': ['यदि सभी पक्षी उड़ सकते हैं, और गौरैया एक पक्षी है, तो क्या गौरैया उड़ सकती है?', 'चूँकि सभी पक्षी उड़ सकते हैं, और गौरैया एक पक्षी है, इसलिए गौरैया उड़ सकती है। (यह निगमन का कौशल रीज़निंग सेक्शन से मेल खाता है।)'],
  'P is older than Q. Q is older than R. Who is the oldest?': ['P, Q से बड़ा है। Q, R से बड़ा है। सबसे बड़ा कौन है?', 'क्रम: P > Q > R। P सबसे ऊपर है — सबसे बड़ा। (क्रमबद्धता का तर्क रीज़निंग के रैंकिंग और क्रम अध्याय में भी आता है।)'],
  'Which does not belong: Rose, Lily, Tulip, Carrot?': ['कौन-सा समूह का नहीं है: गुलाब, कुमुदिनी, ट्यूलिप, गाजर?', 'गुलाब, कुमुदिनी और ट्यूलिप फूल हैं। गाजर एक सब्ज़ी है। (यह वर्गीकरण का कौशल रीज़निंग के बेमेल चुनें अध्याय से मेल खाता है।)'],
  'Pen is to Write as Scissors is to ?': ['कलम का लिखने से वही संबंध है जो कैंची का किससे है?', 'कलम लिखने के लिए प्रयोग होती है; कैंची काटने के लिए। (यह सादृश्य का कौशल रीज़निंग में भी सिखाया जाता है।)'],
  'If today is Wednesday, what day is it 4 days later?': ['यदि आज बुधवार है, तो 4 दिन बाद कौन-सा दिन होगा?', 'बुधवार + 4 दिन = रविवार। (कैलेंडर-तर्कशक्ति रीज़निंग में भी आती है।)'],
  "My mother's sister is my ?": ['मेरी माँ की बहन मेरी क्या लगती है?', 'आपकी माँ की बहन आपकी मौसी (आंटी) है। (पारिवारिक संबंधों का तर्क रीज़निंग के रक्त-संबंध अध्याय में समझाया गया है।)'],
  'If all Squares are Rectangles, and this shape is a Square, is it a Rectangle?': ['यदि सभी वर्ग आयत हैं, और यह आकृति एक वर्ग है, तो क्या वह एक आयत है?', 'चूँकि सभी वर्ग आयत हैं, और यह आकृति एक वर्ग है, इसलिए वह अवश्य एक आयत है।'],
  'X is shorter than Y. Y is shorter than Z. Who is the tallest?': ['X, Y से छोटा है। Y, Z से छोटा है। सबसे लंबा कौन है?', 'क्रम: Z > Y > X। Z सबसे ऊपर है — सबसे लंबा।'],
  'Which does not belong: Hammer, Screwdriver, Wrench, Apple?': ['कौन-सा समूह का नहीं है: हथौड़ा, पेचकस, रिंच, सेब?', 'हथौड़ा, पेचकस और रिंच औज़ार हैं। सेब एक फल है।'],
  'Key is to Lock as Password is to ?': ['चाबी का ताले से वही संबंध है जो पासवर्ड का किससे है?', 'चाबी ताले को खोलती है; पासवर्ड खाते को खोलता/अनलॉक करता है।'],
  'If today is Friday, what day was it 6 days ago?': ['यदि आज शुक्रवार है, तो 6 दिन पहले कौन-सा दिन था?', 'शुक्रवार − 6 दिन = शनिवार (पिछले सप्ताह का)।'],
  "My father's brother is my ?": ['मेरे पिता के भाई मेरे क्या लगते हैं?', 'आपके पिता के भाई आपके चाचा (अंकल) हैं।'],
  'If all Dogs are Mammals, and Rex is a Dog, is Rex a Mammal?': ['यदि सभी कुत्ते स्तनधारी हैं, और रेक्स एक कुत्ता है, तो क्या रेक्स एक स्तनधारी है?', 'चूँकि सभी कुत्ते स्तनधारी हैं, और रेक्स एक कुत्ता है, इसलिए रेक्स अवश्य स्तनधारी है।'],
  'A, B, and C are friends. A is taller than B. C is taller than A. Who is the shortest?': ['A, B और C मित्र हैं। A, B से लंबा है। C, A से लंबा है। सबसे छोटा कौन है?', 'क्रम: C > A > B। B सबसे नीचे है — सबसे छोटा।'],
  'Which does not belong: Guitar, Drum, Flute, Ball?': ['कौन-सा समूह का नहीं है: गिटार, ढोल, बाँसुरी, गेंद?', 'गिटार, ढोल और बाँसुरी वाद्य-यंत्र हैं। गेंद खेल का सामान है।'],
};
export function localizeReasoningConnect(q) {
  if (q.chapter !== 'reasoning-connect' || typeof q.prompt !== 'string') return q;
  const man = RC_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], rcOpt);
  const m = q.prompt.match(/^(Some|All) (\w+) are (\w+)\. All \3 are (\w+)\. Which conclusion must be true\?$/);
  if (!m || !RCP[m[2]] || !RCP[m[3]] || !RCP[m[4]]) return q;
  const [, k, a, b, c] = m;
  const first = k === 'Some' ? `कुछ ${rcp(a)}, ${rcp(b)} हैं` : `सभी ${rcp(a)}, ${rcp(b)} हैं`;
  const exp = k === 'Some'
    ? `कुछ ${rcp(a)}, ${rcp(b)} हैं, और सभी ${rcp(b)}, ${rcp(c)} हैं, इसलिए वही ${rcp(a)} ${rcp(c)} भी हैं।`
    : `सभी ${rcp(a)}, ${rcp(b)} हैं, और सभी ${rcp(b)}, ${rcp(c)} हैं, इसलिए सभी ${rcp(a)}, ${rcp(c)} हैं।`;
  return bi(q, `${first}। सभी ${rcp(b)}, ${rcp(c)} हैं। कौन-सा निष्कर्ष अवश्य सत्य है?`, exp, rcOpt);
}

// ── Percentage Puzzles ──
export function localizePercentage(q) {
  if (q.chapter !== 'percentage-puzzles' || typeof q.prompt !== 'string') return q;
  let m; let e; let hi; let exp;
  if ((m = q.prompt.match(/^Using the Vedic (÷4|÷2|÷10) shortcut, what is (\d+)% of (\d+)\?$/))) {
    hi = `वैदिक ${m[1]} शॉर्टकट का प्रयोग करके, ${m[3]} का ${m[2]}% क्या है?`;
  } else if ((m = q.prompt.match(/^Using the Vedic shortcut \(÷4, then ×3\), what is (\d+)% of (\d+)\?$/))) {
    hi = `वैदिक शॉर्टकट (÷4, फिर ×3) का प्रयोग करके, ${m[2]} का ${m[1]}% क्या है?`;
  } else if ((m = q.prompt.match(/^Using the Vedic shortcut \(10% then double\), what is (\d+)% of (\d+)\?$/))) {
    hi = `वैदिक शॉर्टकट (10% निकालकर दोगुना) का प्रयोग करके, ${m[2]} का ${m[1]}% क्या है?`;
  } else if ((m = q.prompt.match(/^What is (\d+)% of (\d+)\?$/))) {
    hi = `${m[2]} का ${m[1]}% क्या है?`;
  } else if ((m = q.prompt.match(/^A number (\d+) is increased by (\d+)%\. What is the new number\?$/))) {
    hi = `संख्या ${m[1]} में ${m[2]}% की वृद्धि की जाती है। नई संख्या क्या है?`;
  } else if ((m = q.prompt.match(/^(\d+) is what percent of (\d+)\?$/))) {
    hi = `${m[1]}, ${m[2]} का कितना प्रतिशत है?`;
  } else return q;

  if ((e = q.exp.match(/^25% means one-quarter\. (\d+) ÷ 4 = (\d+)\.$/))) exp = `25% का अर्थ है एक-चौथाई। ${e[1]} ÷ 4 = ${e[2]}।`;
  else if ((e = q.exp.match(/^25% means one-quarter\. (\d+) ÷ 4 = (\d+) -- much faster than long percentage calculation\.$/))) exp = `25% का अर्थ है एक-चौथाई। ${e[1]} ÷ 4 = ${e[2]} — लंबी प्रतिशत गणना से कहीं तेज़।`;
  else if ((e = q.exp.match(/^50% means half\. (\d+) ÷ 2 = (\d+)\.$/))) exp = `50% का अर्थ है आधा। ${e[1]} ÷ 2 = ${e[2]}।`;
  else if ((e = q.exp.match(/^75% means three-quarters\. (\d+) ÷ 4 = (\d+), then (\d+) × 3 = (\d+)\.$/))) exp = `75% का अर्थ है तीन-चौथाई। ${e[1]} ÷ 4 = ${e[2]}, फिर ${e[3]} × 3 = ${e[4]}।`;
  else if ((e = q.exp.match(/^10% means one-tenth\. (\d+) ÷ 10 = (\d+)\.$/))) exp = `10% का अर्थ है दसवाँ भाग। ${e[1]} ÷ 10 = ${e[2]}।`;
  else if ((e = q.exp.match(/^20% is double 10%\. 10% of (\d+) = ([\d.]+), so 20% = ([\d.]+) × 2 = (\d+)\.$/))) exp = `20%, 10% का दोगुना है। ${e[1]} का 10% = ${e[2]}, इसलिए 20% = ${e[3]} × 2 = ${e[4]}।`;
  else if ((e = q.exp.match(/^(\d+)% of (\d+) = (\d+)\.$/))) exp = `${e[2]} का ${e[1]}% = ${e[3]}।`;
  else if ((e = q.exp.match(/^(\d+)% of (\d+) is (\d+), so the new number is (\d+) \+ (\d+) = (\d+)\.$/))) exp = `${e[2]} का ${e[1]}% ${e[3]} है, इसलिए नई संख्या ${e[4]} + ${e[5]} = ${e[6]} है।`;
  else if ((e = q.exp.match(/^(\d+) ÷ (\d+) × 100 = (\d+)%\.$/))) exp = `${e[1]} ÷ ${e[2]} × 100 = ${e[3]}%।`;
  else return q;
  return bi(q, hi, exp, id);
}

// ── Speed Maths Connect ──
export function localizeSpeedMaths(q) {
  if (q.chapter !== 'speed-maths-connect' || typeof q.prompt !== 'string') return q;
  let m; let e; let hi; let exp;
  if ((m = q.prompt.match(/^Using the Vedic Maths ×11 trick you learned, what is (\d+) × 11\?$/))) {
    hi = `आपने जो वैदिक गणित की ×11 तरकीब सीखी है, उसका प्रयोग करके ${m[1]} × 11 क्या है?`;
    if ((e = q.exp.match(/^Using the ×11 shortcut from Vedic Maths: (\d+) × 11 = (\d+) × 10 \+ (\d+) = (\d+) \+ (\d+) = (\d+)\.$/))) exp = `वैदिक गणित के ×11 शॉर्टकट से: ${e[1]} × 11 = ${e[2]} × 10 + ${e[3]} = ${e[4]} + ${e[5]} = ${e[6]}।`;
  } else if ((m = q.prompt.match(/^Using the Nikhilam trick \(base 100\) from Vedic Maths, what is (\d+) × (\d+)\?$/))) {
    hi = `वैदिक गणित की निखिलम तरकीब (आधार 100) से ${m[1]} × ${m[2]} क्या है?`;
    if ((e = q.exp.match(/^Nikhilam base 100: deviations (-?\d+) and (-?\d+)\. Cross: (\S+)\. Product of deviations: (\S+)\. Combine: (\d+)\.$/))) exp = `निखिलम आधार 100: विचलन ${e[1]} और ${e[2]}। तिर्यक: ${e[3]}। विचलनों का गुणनफल: ${e[4]}। जोड़ने पर: ${e[5]}।`;
  } else if ((m = q.prompt.match(/^Using Ekadhikena Purvena from Vedic Maths, what is (\d+)²\?$/))) {
    hi = `वैदिक गणित के एकाधिकेन पूर्वेण से ${m[1]}² क्या है?`;
    if ((e = q.exp.match(/^Ekadhikena Purvena: (\d+) × (\d+) = (\d+), append 25 → (\d+)\.$/))) exp = `एकाधिकेन पूर्वेण: ${e[1]} × ${e[2]} = ${e[3]}, पीछे 25 जोड़ें → ${e[4]}।`;
  } else if ((m = q.prompt.match(/^Find (\d+) × 11 quickly\. \(Hint: split the digits and add the middle\.\)$/))) {
    hi = `${m[1]} × 11 जल्दी से निकालिए। (संकेत: अंकों को अलग करके बीच में उनका योग रखें।)`;
    if ((e = q.exp.match(/^(\d+) × 11 = (\d+)\.$/))) exp = `${e[1]} × 11 = ${e[2]}।`;
  } else if ((m = q.prompt.match(/^Find (\d+) × 99 quickly\. \(Hint: multiply by 100, then subtract the number\.\)$/))) {
    hi = `${m[1]} × 99 जल्दी से निकालिए। (संकेत: 100 से गुणा करें, फिर संख्या घटाएँ।)`;
    if ((e = q.exp.match(/^(\d+) × 100 − (\d+) = (\d+)\.$/))) exp = `${e[1]} × 100 − ${e[2]} = ${e[3]}।`;
  } else if ((m = q.prompt.match(/^Find (\d+) × (\d+) using the base 100 method\.$/))) {
    hi = `आधार 100 विधि से ${m[1]} × ${m[2]} निकालिए।`;
    if ((e = q.exp.match(/^Both numbers are near 100\. The answer is (\d+)\.$/))) exp = `दोनों संख्याएँ 100 के पास हैं। उत्तर ${e[1]} है।`;
  }
  if (!hi || !exp) return q;
  return bi(q, hi, exp, id);
}

// ── Verbal Classification ──
const VC = {
  Happy: 'खुश', Cheerful: 'प्रसन्नचित्त', Delighted: 'हर्षित', Joyful: 'आनंदित', Sad: 'उदास', Angry: 'क्रोधित', Run: 'दौड़ना', Walk: 'चलना',
  Jump: 'कूदना', Chair: 'कुर्सी', Doctor: 'डॉक्टर', Teacher: 'शिक्षक', Engineer: 'इंजीनियर', School: 'विद्यालय', Hospital: 'अस्पताल',
  Lawyer: 'वकील', Red: 'लाल', Blue: 'नीला', Green: 'हरा', Circle: 'वृत्त', Quickly: 'जल्दी से', Slowly: 'धीरे से', Carefully: 'सावधानी से',
  Quick: 'जल्दी', Loudly: 'ज़ोर से', Fast: 'तेज़', Lion: 'शेर', Tiger: 'बाघ', Leopard: 'तेंदुआ', Rose: 'गुलाब', Piano: 'पियानो',
  Guitar: 'गिटार', Violin: 'वायलिन', Drum: 'ढोल', Book: 'किताब', Swim: 'तैरना', Table: 'मेज़', India: 'भारत', Japan: 'जापान',
  France: 'फ़्रांस', Asia: 'एशिया', Ocean: 'महासागर', Germany: 'जर्मनी', Silver: 'चाँदी', Gold: 'सोना', Bronze: 'काँसा', Wooden: 'लकड़ी का',
  Whisper: 'फुसफुसाना', Shout: 'चिल्लाना', Mumble: 'बुदबुदाना', Listen: 'सुनना', Speak: 'बोलना', Silent: 'चुप', Rectangle: 'आयत',
  Triangle: 'त्रिभुज', Square: 'वर्ग', Melody: 'धुन', Novel: 'उपन्यास', Magazine: 'पत्रिका', Newspaper: 'समाचार-पत्र', Comic: 'कॉमिक',
  Spoon: 'चम्मच', Bicycle: 'साइकिल', Motorcycle: 'मोटरसाइकिल', Scooter: 'स्कूटर', Sandwich: 'सैंडविच', Furious: 'अत्यंत क्रोधित',
  Irritated: 'चिढ़ा हुआ', Annoyed: 'खीजा हुआ', Calm: 'शांत', Autumn: 'शरद ऋतु', Winter: 'सर्दी', Summer: 'गर्मी', Monday: 'सोमवार',
  Hammer: 'हथौड़ा', Screwdriver: 'पेचकस', Wrench: 'रिंच', Flower: 'फूल', Pliers: 'प्लास', Cloud: 'बादल', Whale: 'व्हेल',
  Dolphin: 'डॉल्फ़िन', Shark: 'शार्क', Eagle: 'चील', Sculpture: 'मूर्तिकला', Painting: 'चित्रकला', Drawing: 'रेखाचित्र', Artwork: 'कलाकृति',
  Number: 'संख्या', Weather: 'मौसम', Murmur: 'बुदबुदाना', Orange: 'संतरा/नारंगी', Banana: 'केला', Mango: 'आम', Grapes: 'अंगूर',
  Papaya: 'पपीता', Potato: 'आलू', Sitar: 'सितार', Peas: 'मटर', Brinjal: 'बैंगन', Spinach: 'पालक', Onion: 'प्याज़', Carrot: 'गाजर',
  Apple: 'सेब', Cat: 'बिल्ली', Dog: 'कुत्ता', Horse: 'घोड़ा', Cow: 'गाय', Flute: 'बाँसुरी', Car: 'कार', Truck: 'ट्रक', Purple: 'बैंगनी',
};
const vg = (s) => (VC[s] ? `${s} (${VC[s]})` : s);
const VC_CAT = { fruits: 'फल', vehicles: 'वाहन', instruments: 'वाद्य-यंत्र', animals: 'जानवर', vegetables: 'सब्ज़ियाँ', colours: 'रंग' };
const VC_MANUAL = {
  'Happy, Cheerful, and Delighted all describe positive feelings. Joyful belongs in this same group.': 'Happy, Cheerful और Delighted — तीनों सकारात्मक भावनाओं का वर्णन करते हैं। Joyful इसी समूह में आता है।',
  'Run, Walk, and Jump are all actions (verbs). Chair is an object, not an action.': 'Run, Walk और Jump — तीनों क्रियाएँ (क्रिया-शब्द) हैं। Chair एक वस्तु है, क्रिया नहीं।',
  'Doctor, Teacher, and Engineer are all professions. Lawyer is also a profession -- it belongs in this group.': 'Doctor, Teacher और Engineer — तीनों पेशे हैं। Lawyer भी एक पेशा है — इसलिए वह इस समूह में आता है।',
  'Red, Blue, and Green are all colours. Circle is a shape, not a colour.': 'Red, Blue और Green — तीनों रंग हैं। Circle एक आकृति है, रंग नहीं।',
  'Quickly, Slowly, and Carefully all describe HOW an action is done (adverbs). Loudly is also an adverb -- it belongs.': 'Quickly, Slowly और Carefully — तीनों बताते हैं कि क्रिया कैसे की जाती है (क्रिया-विशेषण)। Loudly भी क्रिया-विशेषण है — इसलिए वह इस समूह में आता है।',
  'Lion, Tiger, and Leopard are all big cats (animals). Rose is a flower.': 'Lion, Tiger और Leopard — तीनों बड़ी बिल्लियाँ (जानवर) हैं। Rose एक फूल है।',
  'Piano, Guitar, and Violin are all musical instruments. Drum is also a musical instrument -- it belongs.': 'Piano, Guitar और Violin — तीनों वाद्य-यंत्र हैं। Drum भी एक वाद्य-यंत्र है — इसलिए वह इस समूह में आता है।',
  'Swim, Run, and Jump are all actions. Table is an object, not an action.': 'Swim, Run और Jump — तीनों क्रियाएँ हैं। Table एक वस्तु है, क्रिया नहीं।',
  'India, Japan, and France are all countries. Germany is also a country -- it belongs.': 'India, Japan और France — तीनों देश हैं। Germany भी एक देश है — इसलिए वह इस समूह में आता है।',
  'Silver, Gold, and Bronze are all metals. Wooden describes something made of wood, not a metal.': 'Silver, Gold और Bronze — तीनों धातुएँ हैं। Wooden लकड़ी से बनी चीज़ का वर्णन करता है, धातु का नहीं।',
  'Whisper, Shout, and Mumble are all ways of speaking. Speak is also a way of communicating with your voice -- it belongs.': 'Whisper, Shout और Mumble — तीनों बोलने के तरीके हैं। Speak भी आवाज़ से संवाद करने का एक तरीका है — इसलिए वह इस समूह में आता है।',
  'Rectangle, Triangle, and Square are all shapes. Melody is related to music, not shape.': 'Rectangle, Triangle और Square — तीनों आकृतियाँ हैं। Melody का संबंध संगीत से है, आकृति से नहीं।',
  'Novel, Magazine, and Newspaper are all things you read. Comic is also something you read -- it belongs.': 'Novel, Magazine और Newspaper — तीनों पढ़ने की चीज़ें हैं। Comic भी पढ़ने की चीज़ है — इसलिए वह इस समूह में आता है।',
  'Bicycle, Motorcycle, and Scooter are all two-wheeled vehicles. Sandwich is food.': 'Bicycle, Motorcycle और Scooter — तीनों दो पहियों वाले वाहन हैं। Sandwich खाने की चीज़ है।',
  'Furious, Irritated, and Annoyed all describe being upset. Angry also describes this feeling -- it belongs.': 'Furious, Irritated और Annoyed — तीनों परेशान/नाराज़ होने का वर्णन करते हैं। Angry भी इसी भावना का वर्णन करता है — इसलिए वह इस समूह में आता है।',
  'Autumn, Winter, and Summer are all seasons. Monday is a day of the week.': 'Autumn, Winter और Summer — तीनों ऋतुएँ हैं। Monday सप्ताह का एक दिन है।',
  'Hammer, Screwdriver, and Wrench are all tools. Pliers is also a tool -- it belongs.': 'Hammer, Screwdriver और Wrench — तीनों औज़ार हैं। Pliers भी एक औज़ार है — इसलिए वह इस समूह में आता है।',
  'Whale, Dolphin, and Shark all live in water. Eagle is a bird that flies in the sky.': 'Whale, Dolphin और Shark — तीनों पानी में रहते हैं। Eagle एक पक्षी है जो आकाश में उड़ता है।',
  'Sculpture, Painting, and Drawing are all forms of art. Artwork is the general term for these -- it belongs.': 'Sculpture, Painting और Drawing — तीनों कला के रूप हैं। Artwork इन सबके लिए सामान्य शब्द है — इसलिए वह इस समूह में आता है।',
  'Whisper, Mumble, and Murmur all mean speaking quietly. Shout means speaking loudly -- the opposite.': 'Whisper, Mumble और Murmur — तीनों का अर्थ धीमे बोलना है। Shout का अर्थ ज़ोर से बोलना है — यानी विपरीत।',
};
export function localizeVerbalClassification(q) {
  if (q.chapter !== 'verbal-classification' || typeof q.prompt !== 'string') return q;
  let m; let e; let hi; let exp;
  if ((m = q.prompt.match(/^Which word belongs with: (.+)\?$/))) hi = `कौन-सा शब्द इनके साथ आता है: ${m[1].split(', ').map(vg).join(', ')}?`;
  else if ((m = q.prompt.match(/^Which word does NOT belong: (.+)\?$/))) hi = `कौन-सा शब्द समूह का नहीं है: ${m[1].split(', ').map(vg).join(', ')}?`;
  else if (q.prompt === 'Which word does NOT belong in this group?') hi = 'इस समूह में कौन-सा शब्द नहीं आता?';
  else return q;
  exp = VC_MANUAL[q.exp];
  if (!exp && (e = q.exp.match(/^([\w, ]+) are all (\w+)\. (\w+) is (\w+)\.$/)) && VC_CAT[e[2]] && VC_CAT[e[4]]) {
    exp = `${e[1].split(', ').map(vg).join(', ')} — सभी ${VC_CAT[e[2]]} हैं। ${vg(e[3])} ${VC_CAT[e[4]]} में आता है।`;
  }
  if (!exp) return q;
  return bi(q, hi, exp, vg);
}

// ── Number Puzzles ──
const NP_ITEM = { apples: 'सेब', chocolates: 'चॉकलेट', pencils: 'पेंसिलें' };
const NP_SING = { apple: 'सेब', chocolate: 'चॉकलेट', pencil: 'पेंसिल' };
const npOpt = (o) => {
  const d = o.match(/^(\d+)(?:st|nd|rd|th)$/);
  if (d) return `${d[1]} तारीख़`;
  return o === 'They are equal' ? 'दोनों बराबर हैं' : o;
};
export function localizeNumberPuzzles(q) {
  if (q.chapter !== 'number-puzzles' || typeof q.prompt !== 'string') return q;
  let m; let e; let hi; let exp;
  if (/^[\d?+×÷\- =]+$/.test(q.prompt)) {
    hi = `लुप्त संख्या ज्ञात कीजिए: ${q.prompt}`;
    if ((e = q.exp.match(/^(.+), so the missing number is (\d+)\.$/))) exp = `${e[1]}, इसलिए लुप्त संख्या ${e[2]} है।`;
  } else if ((m = q.prompt.match(/^If (\d+) (apples|chocolates|pencils) cost (?:Rs\. )?(\d+)(?: rupees)?, how much do (\d+) \2 cost(?: \(in Rs\.\))?\?$/))) {
    hi = `यदि ${m[1]} ${NP_ITEM[m[2]]} की कीमत ${m[3]} रुपये है, तो ${m[4]} ${NP_ITEM[m[2]]} की कीमत कितनी होगी${/\(in Rs\.\)/.test(q.prompt) ? ' (रुपये में)' : ''}?`;
    if ((e = q.exp.match(/^Each (\w+) costs (\d+) ÷ (\d+) = (\d+) rupees\. (\d+) \w+ cost (\d+) × (\d+) = (\d+) rupees\.$/))) exp = `हर ${NP_SING[e[1]]} की कीमत ${e[2]} ÷ ${e[3]} = ${e[4]} रुपये है। ${e[5]} ${NP_ITEM[m[2]]} की कीमत ${e[6]} × ${e[7]} = ${e[8]} रुपये होगी।`;
    else if ((e = q.exp.match(/^One (\w+) costs Rs\. (\d+), so (\d+) \w+ cost (\d+) × (\d+) = Rs\. (\d+)\.$/))) exp = `एक ${NP_SING[e[1]]} की कीमत ${e[2]} रुपये है, इसलिए ${e[3]} ${NP_ITEM[m[2]]} की कीमत ${e[4]} × ${e[5]} = ${e[6]} रुपये होगी।`;
  } else if ((m = q.prompt.match(/^Which number is bigger: the sum of (\d+\+\d+), or the product of (\d+×\d+)\?$/))) {
    hi = `कौन-सी संख्या बड़ी है: ${m[1]} का योग, या ${m[2]} का गुणनफल?`;
    if ((e = q.exp.match(/^(\S+) = (\d+), and (\S+) = (\d+)\. Since (\d+) is bigger than (\d+), (\S+) is the bigger one\.$/))) exp = `${e[1]} = ${e[2]}, और ${e[3]} = ${e[4]}। चूँकि ${e[5]}, ${e[6]} से बड़ा है, इसलिए ${e[7]} बड़ा है।`;
  } else if ((m = q.prompt.match(/^What number comes exactly between (\d+) and (\d+)\?$/))) {
    hi = `${m[1]} और ${m[2]} के ठीक बीच में कौन-सी संख्या आती है?`;
    if ((e = q.exp.match(/^(\d+) is exactly halfway between (\d+) and (\d+) \((.*)\)\.$/))) exp = `${e[1]}, ${e[2]} और ${e[3]} के ठीक बीच में है (${e[4]})।`;
  } else if ((m = q.prompt.match(/^If today is the (\d+)(?:st|nd|rd|th), what date was it (\d+) days ago\?$/))) {
    hi = `यदि आज ${m[1]} तारीख़ है, तो ${m[2]} दिन पहले कौन-सी तारीख़ थी?`;
    if ((e = q.exp.match(/^(\d+) - (\d+) = (\d+), so it was the (\d+)(?:st|nd|rd|th)\.$/))) exp = `${e[1]} − ${e[2]} = ${e[3]}, इसलिए वह ${e[4]} तारीख़ थी।`;
  } else if ((m = q.prompt.match(/^Two numbers add up to (\d+)\. One is (\d+) times the other\. What is the larger number\?$/))) {
    hi = `दो संख्याओं का योग ${m[1]} है। एक संख्या दूसरी की ${m[2]} गुनी है। बड़ी संख्या कौन-सी है?`;
    if ((e = q.exp.match(/^The smaller number is (\d+), so the larger is (\d+) × (\d+) = (\d+)\.$/))) exp = `छोटी संख्या ${e[1]} है, इसलिए बड़ी संख्या ${e[2]} × ${e[3]} = ${e[4]} है।`;
  }
  if (!hi || !exp) return q;
  return bi(q, hi, exp, npOpt);
}

// ── Cube Nets & Folding ──
const CN_OPT = {
  Circle: 'वृत्त', Square: 'वर्ग', Triangle: 'त्रिभुज', 'Adjacent squares': 'आसन्न (सटे हुए) वर्ग', 'Cannot be determined': 'निर्धारित नहीं किया जा सकता',
  'Two squares away in the same row': 'एक ही पंक्ति में दो वर्ग दूर', 'Straight line of 6': '6 वर्गों की सीधी रेखा', 'Cross shape': 'क्रॉस आकार',
  'Row of 4 with one above the first and one below the last': '4 की पंक्ति, पहले के ऊपर एक और आख़िरी के नीचे एक',
  Yes: 'हाँ', No: 'नहीं', 'Only sometimes': 'केवल कभी-कभी', 'One of the 4 middle squares': 'बीच के 4 वर्गों में से कोई एक', 'None of them': 'इनमें से कोई नहीं',
  'The one at the end of the arm': 'भुजा के सिरे वाला वर्ग', 'Depends on which squares are removed': 'इस पर निर्भर करता है कि कौन-से वर्ग हटाए गए',
};
const cnOpt = (o) => CN_OPT[o] || o;
const CN_MANUAL = {
  'A cube net (unfolded cube) has how many squares?': ['घन का जाल (खुला हुआ घन) कितने वर्गों से बना होता है?', 'घन के 6 फलक होते हैं, इसलिए उसके खुले जाल में हमेशा ठीक 6 वर्ग होते हैं।'],
  'A cross-shaped cube net has a row of four squares with one square above the row and one square below it. How many squares does it have in total?': ['क्रॉस आकार के घन-जाल में चार वर्गों की एक पंक्ति है, जिसके ऊपर एक वर्ग और नीचे एक वर्ग है। उसमें कुल कितने वर्ग हैं?', 'क्रॉस आकार के घन-जाल को मोड़कर पूरा घन बनाने के लिए कुल ठीक 6 वर्ग चाहिए।'],
  'When a cube net folds up, which two faces end up OPPOSITE each other: the top face of the net, or a face two squares away in the same row?': ['जब घन का जाल मुड़ता है, तो कौन-से दो फलक एक-दूसरे के सामने (विपरीत) आ जाते हैं: जाल का ऊपरी फलक, या एक ही पंक्ति में दो वर्ग दूर वाला फलक?', 'मानक क्रॉस आकार के जाल में, एक ही पंक्ति/स्तंभ में ठीक एक वर्ग के अंतर पर स्थित फलक मोड़ने पर एक-दूसरे के विपरीत आ जाते हैं।'],
  'How many edges meet at each corner of a cube?': ['घन के हर कोने पर कितने किनारे मिलते हैं?', 'घन के हर कोने पर ठीक 3 किनारे मिलते हैं।'],
  'If you cut a cube exactly in half through its center (parallel to one face), what shape is the cross-section?': ['यदि आप घन को उसके केंद्र से ठीक आधा काटें (एक फलक के समानांतर), तो अनुप्रस्थ काट की आकृति क्या होगी?', 'घन को उसके किसी फलक के समानांतर काटने पर हमेशा वर्गाकार अनुप्रस्थ काट बनती है।'],
  'A cube has 6 faces. If one face is red, how many faces are NOT red?': ['घन के 6 फलक होते हैं। यदि एक फलक लाल है, तो कितने फलक लाल नहीं हैं?', 'कुल 6 फलक में से 1 लाल फलक घटाने पर 5 फलक बचते हैं जो लाल नहीं हैं।'],
  'Which of these is NOT a valid cube net: a cross shape (a row of 4 with one square above and one below), a straight line of 6 squares, or a row of 4 squares with one square above the first and one below the last?': ['इनमें से कौन-सा मान्य घन-जाल नहीं है: क्रॉस आकार (4 की पंक्ति जिसके ऊपर एक और नीचे एक वर्ग), 6 वर्गों की सीधी रेखा, या 4 वर्गों की पंक्ति जिसके पहले वर्ग के ऊपर एक और आख़िरी के नीचे एक वर्ग हो?', '6 वर्गों की सीधी रेखा मोड़कर घन नहीं बनाया जा सकता — वर्ग एक-दूसरे पर चढ़ जाएँगे। क्रॉस आकार (4 की पंक्ति, ऊपर एक और नीचे एक वर्ग) सही मुड़कर घन बनाता है, और 4 की पंक्ति जिसके पहले के ऊपर एक और आख़िरी के नीचे एक वर्ग हो वह भी (11 मान्य जालों में से एक) घन बनाता है।'],
  'If a cube is labeled 1-6 on its faces like a die, and 1 is opposite 6, 2 is opposite 5, what must 3 be opposite to?': ['यदि घन के फलकों पर पासे की तरह 1-6 लिखा है, और 1 सामने 6 के है, 2 सामने 5 के है, तो 3 किसके सामने होना चाहिए?', 'मानक पासे में विपरीत फलकों का योग हमेशा 7 होता है। चूँकि 1-6 और 2-5 की जोड़ियाँ (दोनों का योग 7) हैं, इसलिए 3 की जोड़ी 4 के साथ बनेगी (3+4=7)।'],
  'A cube net is unfolded flat. How many squares in the net touch (are adjacent to) the square that will become the TOP face?': ['घन का जाल सपाट खुला है। जाल के कितने वर्ग उस वर्ग को छूते (उससे सटे) हैं जो ऊपरी फलक बनेगा?', 'घन में ऊपरी फलक ठीक 4 अन्य फलकों से सटा होता है (नीचे वाले को छोड़कर, जो उसके विपरीत है)।'],
  'If you fold a cross-shaped net into a cube, how many squares fold upward to become the sides?': ['यदि आप क्रॉस आकार के जाल को मोड़कर घन बनाएँ, तो कितने वर्ग ऊपर की ओर मुड़कर बगल के फलक बनते हैं?', 'एक केंद्रीय वर्ग वाले मानक क्रॉस आकार के जाल में, उससे सीधे जुड़े 4 वर्ग ऊपर मुड़कर 4 बगल के फलक बनते हैं।'],
  'How many edges connect the top face to the bottom face of a cube (out of 12 total edges)?': ['घन के कुल 12 किनारों में से कितने किनारे ऊपरी फलक को निचले फलक से जोड़ते हैं?', '12 कुल किनारे − 4 (ऊपर) − 4 (नीचे) = 4 ऊर्ध्वाधर किनारे जो ऊपर को नीचे से जोड़ते हैं।'],
  'If a die shows 4 on top, which number is on the bottom (opposite the top)?': ['यदि पासे के ऊपर 4 दिख रहा है, तो नीचे (ऊपर के विपरीत) कौन-सी संख्या है?', 'मानक पासे में विपरीत फलकों का योग 7 होता है। यदि ऊपर 4 है, तो नीचे (विपरीत) 7−4=3 होगा।'],
  'A cube net has 6 squares arranged in an L-shape. Can this fold into a valid cube?': ['एक घन-जाल में 6 वर्ग L-आकार में सजे हैं। क्या यह मुड़कर मान्य घन बन सकता है?', 'घन के 11 अलग-अलग मान्य जाल होते हैं, और 6 वर्गों की कई L-आकार की व्यवस्थाएँ सही मुड़कर घन बनाती हैं।'],
  'How many faces of a cube can you see at once when looking at one corner?': ['किसी एक कोने की ओर देखने पर घन के एक साथ कितने फलक दिखाई देते हैं?', 'घन के किसी कोने को सीधे देखने पर आप उसके 6 फलकों में से ठीक 3 एक साथ देख सकते हैं।'],
  'In a cross-shaped cube net with a center square and 4 squares around it plus 1 more attached at the end of one arm, which square becomes opposite the center square when folded?': ['केंद्रीय वर्ग और उसके चारों ओर 4 वर्गों वाले, तथा एक भुजा के सिरे पर 1 और वर्ग जुड़े क्रॉस आकार के घन-जाल में, मोड़ने पर कौन-सा वर्ग केंद्रीय वर्ग के विपरीत आता है?', 'किसी एक भुजा के सिरे पर जुड़ा वर्ग मुड़कर घूम जाता है और केंद्रीय वर्ग के ठीक विपरीत फलक बनता है।'],
  'A cube is painted on all 6 faces, then cut into 8 equal smaller cubes (2×2×2). How many small cubes have paint on exactly 3 faces?': ['एक घन के सभी 6 फलकों पर रंग किया गया, फिर उसे 8 बराबर छोटे घनों (2×2×2) में काटा गया। कितने छोटे घनों के ठीक 3 फलकों पर रंग है?', '2×2×2 कटाई में हर एक छोटा घन कोने वाला घन होता है, इसलिए सभी 8 के ठीक 3 फलकों पर रंग होता है।'],
  'How many faces of a cube touch (are adjacent to) the bottom face?': ['घन के कितने फलक निचले फलक को छूते (उससे सटे) हैं?', 'ऊपरी फलक की तरह, घन का निचला फलक भी ठीक 4 अन्य फलकों से सटा होता है (ऊपरी फलक को छोड़कर, जो उसके विपरीत है)।'],
  'Does a full 3×2 rectangular grid of 6 squares fold into a valid cube?': ['क्या 6 वर्गों का पूरा 3×2 आयताकार ग्रिड मुड़कर मान्य घन बनाता है?', '6 वर्गों का पूरा 3×2 आयत मुड़कर घन नहीं बन सकता — वर्ग एक-दूसरे पर चढ़ जाएँगे, इसलिए वह घन के 11 मान्य जालों में से नहीं है।'],
  'A cube has how many pairs of opposite (parallel) faces?': ['घन में विपरीत (समांतर) फलकों की कितनी जोड़ियाँ होती हैं?', 'घन के 6 फलक ठीक 3 विपरीत जोड़ियाँ बनाते हैं (ऊपर-नीचे, बायाँ-दायाँ, आगे-पीछे)।'],
  "In a cube's net, how many faces are NOT adjacent to the Top face (only the opposite Bottom face)?": ['घन के जाल में, कितने फलक ऊपरी फलक से सटे नहीं हैं (केवल विपरीत निचला फलक)?', 'केवल निचला फलक (ठीक ऊपरी के विपरीत) ऊपरी से सटा नहीं है — बाकी सभी 4 फलक उससे सटे हैं।'],
};
export function localizeCubeNets(q) {
  if (q.chapter !== 'cube-nets-folding' || typeof q.prompt !== 'string') return q;
  const man = CN_MANUAL[q.prompt];
  return man ? bi(q, man[0], man[1], cnOpt) : q;
}

// ── Rotating Shapes ──
const RS_D = { North: 'उत्तर', South: 'दक्षिण', East: 'पूर्व', West: 'पश्चिम', 'North-East': 'उत्तर-पूर्व', 'North-West': 'उत्तर-पश्चिम', 'South-East': 'दक्षिण-पूर्व', 'South-West': 'दक्षिण-पश्चिम' };
const RS_SIDE = { clockwise: 'दक्षिणावर्त (घड़ी की दिशा में)', anticlockwise: 'वामावर्त (घड़ी की उलटी दिशा में)' };
const RS_OPT = {
  'the same as before (a square looks identical every 90 degrees)': 'पहले जैसा ही (वर्ग हर 90° पर एक जैसा दिखता है)', 'different each time': 'हर बार अलग', 'impossible to determine': 'निर्धारित करना असंभव',
  'the same as before': 'पहले जैसा ही', 'upside down': 'उलटा', 'upside down only': 'केवल उलटा', 'different (rotated on its side)': 'अलग (बगल की ओर घूमा हुआ)',
  'only symmetric at 180 degrees': 'केवल 180° पर सममित', Yes: 'हाँ', No: 'नहीं', 'Only from certain angles': 'केवल कुछ कोणों से',
};
const rsOpt = (o) => RS_D[o] || RS_OPT[o] || o;
const RS_MANUAL = {
  'A square rotated 90 degrees looks': ['90° घुमाया गया वर्ग कैसा दिखता है', 'वर्ग में 4-गुना घूर्णन-सममिति होती है — उसे ठीक 90° घुमाने पर वह अपनी शुरुआती स्थिति जैसा ही दिखता है।'],
  'An equilateral triangle rotated 120 degrees looks': ['120° घुमाया गया समबाहु त्रिभुज कैसा दिखता है', 'समबाहु त्रिभुज में 3-गुना घूर्णन-सममिति होती है — उसे ठीक 120° घुमाने पर वह अपनी शुरुआती स्थिति जैसा ही दिखता है।'],
  'A rectangle (non-square) rotated 90 degrees looks': ['90° घुमाया गया आयत (वर्ग नहीं) कैसा दिखता है', 'आयत में केवल 2-गुना सममिति (180°) होती है, 4-गुना नहीं — उसे 90° घुमाने पर उसका अभिविन्यास बदल जाता है।'],
  'A regular hexagon rotated 60 degrees looks': ['60° घुमाया गया सम षट्भुज कैसा दिखता है', 'सम षट्भुज में 6-गुना घूर्णन-सममिति होती है — उसे ठीक 60° घुमाने पर वह हू-ब-हू वैसा ही दिखता है।'],
  'How many degrees must a square rotate to look exactly the same as its start?': ['वर्ग को कितने अंश घुमाने पर वह अपनी शुरुआती स्थिति जैसा बिल्कुल एक जैसा दिखता है?', 'वर्ग में 4-गुना सममिति होती है, इसलिए उसका रूप हर 360/4 = 90° पर दोहराता है।'],
  'How many degrees must an equilateral triangle rotate to look exactly the same as its start?': ['समबाहु त्रिभुज को कितने अंश घुमाने पर वह अपनी शुरुआती स्थिति जैसा बिल्कुल एक जैसा दिखता है?', 'त्रिभुज में 3-गुना सममिति होती है, इसलिए उसका रूप हर 360/3 = 120° पर दोहराता है।'],
  'How many degrees must a regular pentagon rotate to look exactly the same as its start?': ['सम पंचभुज को कितने अंश घुमाने पर वह अपनी शुरुआती स्थिति जैसा बिल्कुल एक जैसा दिखता है?', 'सम पंचभुज में 5-गुना सममिति होती है, इसलिए उसका रूप हर 360/5 = 72° पर दोहराता है।'],
  "A clock's minute hand rotates 90 degrees. How many minutes have passed?": ['घड़ी की मिनट की सुई 90° घूमती है। कितने मिनट बीते?', 'घड़ी का पूरा चेहरा 60 मिनट के लिए 360° का होता है। 90° उसका एक-चौथाई है: 60/4 = 15 मिनट।'],
  "A clock's minute hand rotates 180 degrees. How many minutes have passed?": ['घड़ी की मिनट की सुई 180° घूमती है। कितने मिनट बीते?', '180°, 360° का आधा है, इसलिए 60 मिनट का आधा = 30 मिनट।'],
  'If the minute hand starts at 12 and rotates 270 degrees clockwise, which number does it point to?': ['यदि मिनट की सुई 12 से शुरू होकर 270° दक्षिणावर्त घूमती है, तो वह किस संख्या पर इशारा करती है?', '270°, पूरे चक्कर का तीन-चौथाई है। 60 मिनट का तीन-चौथाई = 45 मिनट, जो घड़ी पर 9 की ओर इशारा करता है।'],
  'A wheel with 8 equally-spaced spokes is rotated by 45 degrees. Does it look the same as before?': ['समान दूरी पर 8 तीलियों वाले पहिये को 45° घुमाया जाता है। क्या वह पहले जैसा ही दिखता है?', '8 समान दूरी की तीलियों का मतलब है कि पहिये में 8-गुना सममिति है, जो हर 360/8 = 45° पर दोहराती है — इसलिए 45° घुमाने पर वह हू-ब-हू वैसा ही दिखता है।'],
  'How many degrees must a regular octagon (8 sides) rotate to look exactly the same as its start?': ['सम अष्टभुज (8 भुजाएँ) को कितने अंश घुमाने पर वह अपनी शुरुआती स्थिति जैसा बिल्कुल एक जैसा दिखता है?', 'सम अष्टभुज में 8-गुना सममिति होती है, इसलिए उसका रूप हर 360/8 = 45° पर दोहराता है।'],
  "If a clock's hour hand moves from 12 to 4, how many degrees has it rotated?": ['यदि घड़ी की घंटे की सुई 12 से 4 तक जाती है, तो वह कितने अंश घूमी?', 'घड़ी का पूरा चेहरा 12 घंटों के लिए 360° का होता है, इसलिए हर घंटा 30° है। 12 से 4 तक 4 घंटे हैं: 4×30 = 120°।'],
};
export function localizeRotatingShapes(q) {
  if (q.chapter !== 'rotating-shapes' || typeof q.prompt !== 'string') return q;
  const man = RS_MANUAL[q.prompt];
  if (man) {
    const hi = /looks$/.test(q.prompt) ? `${man[0]}?` : man[0];
    return bi(q, hi, man[1], rsOpt);
  }
  const m = q.prompt.match(/^If you (?:are facing|face) ([\w-]+) and turn (\d+) degrees(?: (clockwise|anticlockwise))?, which direction do you (?:now )?face\?$/);
  const e = q.exp.match(/^(?:Rotating )?(\d+) degrees (clockwise|anticlockwise) from ([\w-]+) lands on ([\w-]+)\.$/);
  if (!m || !e) return q;
  return bi(q, `यदि आप ${RS_D[m[1]]} की ओर मुँह करके हैं और ${m[2]}° ${RS_SIDE[m[3] || e[2]]} मुड़ते हैं, तो अब आप किस दिशा की ओर होंगे?`, `${RS_D[e[3]]} से ${e[1]}° ${RS_SIDE[e[2]]} घूमने पर आप ${RS_D[e[4]]} पर पहुँचते हैं।`, rsOpt);
}

// ── Data Interpretation ──
const DI_OPT = { 'City A': 'शहर A', 'City B': 'शहर B', 'Both are equal': 'दोनों बराबर हैं', 'Team X': 'टीम X', 'Team Y': 'टीम Y', 'Product P': 'उत्पाद P', 'Product Q': 'उत्पाद Q' };
const diOpt = (o) => DI_OPT[o] || o.replace(/^Rs\./, '₹');
const DI_MANUAL = {
  "A shop's revenue grew from Rs.200 to Rs.250 crore in a year. What was the % growth?": ['एक दुकान का राजस्व एक वर्ष में ₹200 करोड़ से बढ़कर ₹250 करोड़ हो गया। प्रतिशत वृद्धि कितनी थी?', '% वृद्धि = (250−200)/200 × 100 = 50/200 × 100 = 25%।'],
  'A product priced at Rs.2,000 gets a 15% discount, then an additional flat Rs.100 off. What is the final price?': ['₹2,000 की कीमत वाले उत्पाद पर 15% की छूट मिलती है, फिर ₹100 की अतिरिक्त सीधी छूट। अंतिम कीमत क्या है?', '2000 × 0.85 = 1700, फिर 1700 − 100 = 1600।'],
  "A company's headcount grew from 400 to 460 employees. What was the % growth?": ['एक कंपनी में कर्मचारियों की संख्या 400 से बढ़कर 460 हो गई। प्रतिशत वृद्धि कितनी थी?', '% वृद्धि = (460−400)/400 × 100 = 60/400 × 100 = 15%।'],
  'Website visits grew from 150 to 180 thousand in a month. What was the % growth?': ['एक महीने में वेबसाइट पर विज़िट 150 हज़ार से बढ़कर 180 हज़ार हो गए। प्रतिशत वृद्धि कितनी थी?', '% वृद्धि = (180−150)/150 × 100 = 30/150 × 100 = 20%।'],
  "A factory's daily output grew from 600 to 750 units. What was the % growth?": ['एक कारखाने का दैनिक उत्पादन 600 से बढ़कर 750 इकाई हो गया। प्रतिशत वृद्धि कितनी थी?', '% वृद्धि = (750−600)/600 × 100 = 150/600 × 100 = 25%।'],
  'Monthly rainfall went from 500mm to 620mm. What was the % increase?': ['मासिक वर्षा 500 मिमी से बढ़कर 620 मिमी हो गई। प्रतिशत वृद्धि कितनी थी?', '% वृद्धि = (620−500)/500 × 100 = 120/500 × 100 = 24%।'],
  'Three test scores are 70, 80, and 90. What is the average?': ['तीन परीक्षाओं के अंक 70, 80 और 90 हैं। औसत क्या है?', 'औसत = (70+80+90)/3 = 240/3 = 80।'],
  "Four months' sales (in units) are 100, 150, 200, 150. What is the average?": ['चार महीनों की बिक्री (इकाइयों में) 100, 150, 200, 150 है। औसत क्या है?', 'औसत = (100+150+200+150)/4 = 600/4 = 150।'],
  "Four days' temperatures (deg C) are 20, 25, 30, 25. What is the average?": ['चार दिनों के तापमान (°C) 20, 25, 30, 25 हैं। औसत क्या है?', 'औसत = (20+25+30+25)/4 = 100/4 = 25।'],
  "Three cities' rainfall (mm) are 60, 75, 90. What is the average?": ['तीन शहरों की वर्षा (मिमी) 60, 75, 90 है। औसत क्या है?', 'औसत = (60+75+90)/3 = 225/3 = 75।'],
  "Five weeks' revenue (Rs. thousand) are 300, 400, 500, 400, 400. What is the average?": ['पाँच सप्ताहों का राजस्व (₹ हज़ार में) 300, 400, 500, 400, 400 है। औसत क्या है?', 'औसत = (300+400+500+400+400)/5 = 2000/5 = 400।'],
  'City A sold 240 units at Rs.50 each. City B sold 200 units at Rs.55 each. Which city had higher total revenue?': ['शहर A ने 240 इकाइयाँ ₹50 प्रति इकाई के हिसाब से बेचीं। शहर B ने 200 इकाइयाँ ₹55 प्रति इकाई के हिसाब से बेचीं। किस शहर का कुल राजस्व अधिक था?', 'शहर A: 12000। शहर B: 11000। शहर A का राजस्व अधिक है।'],
  'Team X won 18 out of 24 matches. Team Y won 20 out of 30 matches. Which team has the better win %?': ['टीम X ने 24 में से 18 मैच जीते। टीम Y ने 30 में से 20 मैच जीते। किस टीम का जीत-प्रतिशत बेहतर है?', 'टीम X: 75%। टीम Y: 66.7%। टीम X का प्रतिशत अधिक है।'],
  'Product P costs Rs.80 with 25% margin. Product Q costs Rs.100 with 20% margin. Which has the higher profit amount per unit?': ['उत्पाद P की लागत ₹80 है और लाभ-अंश 25% है। उत्पाद Q की लागत ₹100 है और लाभ-अंश 20% है। प्रति इकाई किसमें लाभ की राशि अधिक है?', 'उत्पाद P: 20। उत्पाद Q: 20। दोनों बराबर हैं।'],
  'A survey of 100 people found 50 like tea, 30 like coffee, 20 like juice. What % like tea?': ['100 लोगों के सर्वे में 50 को चाय, 30 को कॉफ़ी और 20 को जूस पसंद है। कितने प्रतिशत को चाय पसंद है?', 'कुल = 50+30+20 = 100। अभीष्ट हिस्सा = 50। % = 50/100 × 100 = 50%।'],
  'Out of 300 students, 120 chose Science, 80 chose Commerce, 100 chose Arts. What % chose Science?': ['300 छात्रों में से 120 ने विज्ञान, 80 ने वाणिज्य और 100 ने कला चुनी। कितने प्रतिशत ने विज्ञान चुना?', 'कुल = 120+80+100 = 300। अभीष्ट हिस्सा = 120। % = 120/300 × 100 = 40%।'],
  'A budget of Rs.100 crore splits as: Salaries 45, Marketing 15, R&D 40. What % went to R&D?': ['₹100 करोड़ का बजट इस प्रकार बँटा है: वेतन 45, विपणन 15, अनुसंधान एवं विकास 40। कितना प्रतिशत अनुसंधान एवं विकास को गया?', 'कुल = 45+15+40 = 100। अभीष्ट हिस्सा = 40। % = 40/100 × 100 = 40%।'],
  "A company's 1000 orders came from 3 regions: North 200, South 300, East 500. What % came from South?": ['एक कंपनी के 1000 ऑर्डर 3 क्षेत्रों से आए: उत्तर 200, दक्षिण 300, पूर्व 500। कितने प्रतिशत दक्षिण से आए?', 'कुल = 200+300+500 = 1000। अभीष्ट हिस्सा = 300। % = 300/1000 × 100 = 30%।'],
  "A store's revenue was Rs.500,000 last year. This year it grew 20%, then next year it grew another 10% on the new amount. What is the revenue after 2 years?": ['एक दुकान का राजस्व पिछले वर्ष ₹5,00,000 था। इस वर्ष वह 20% बढ़ा, फिर अगले वर्ष नई राशि पर 10% और बढ़ा। 2 वर्ष बाद राजस्व क्या है?', '500000 × 1.2 = 600000, फिर 600000 × 1.1 = 660000।'],
  "A city's population was 40,000. It grew 25% in year 1, then dropped 10% in year 2. What is the population after year 2?": ['एक शहर की जनसंख्या 40,000 थी। पहले वर्ष में वह 25% बढ़ी, फिर दूसरे वर्ष में 10% घट गई। दूसरे वर्ष के बाद जनसंख्या क्या है?', '40000 × 1.25 = 50000, फिर 50000 × 0.9 = 45000।'],
};
export function localizeDataInterpretation(q) {
  if (q.chapter !== 'data-interpretation' || typeof q.prompt !== 'string') return q;
  const man = DI_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], diOpt);
  let m; let e;
  if ((m = q.prompt.match(/^A shop's sales were Rs\. (\d+) in February and Rs\. (\d+) in March\. What is the percentage growth from February to March\?$/))) {
    if ((e = q.exp.match(/^Growth = \((\d+) − (\d+)\) ÷ (\d+) × 100 = (\d+)%\.$/))) return bi(q, `एक दुकान की बिक्री फ़रवरी में ₹${m[1]} और मार्च में ₹${m[2]} थी। फ़रवरी से मार्च तक प्रतिशत वृद्धि कितनी है?`, `वृद्धि = (${e[1]} − ${e[2]}) ÷ ${e[3]} × 100 = ${e[4]}%।`, diOpt);
  }
  if ((m = q.prompt.match(/^Sales were Rs\. (\d+) in January, Rs\. (\d+) in February and Rs\. (\d+) in March\. What is the total sales for the three months \(in Rs\.\)\?$/))) {
    if ((e = q.exp.match(/^Add the three months: (.+) = (\d+)\.$/))) return bi(q, `बिक्री जनवरी में ₹${m[1]}, फ़रवरी में ₹${m[2]} और मार्च में ₹${m[3]} थी। तीनों महीनों की कुल बिक्री (₹ में) कितनी है?`, `तीनों महीनों को जोड़ें: ${e[1]} = ${e[2]}।`, diOpt);
  }
  return q;
}

// ── Advanced Data Interpretation ──
const ADW = { Team: 'टीम', Product: 'उत्पाद', Worker: 'कर्मचारी', Dept: 'विभाग', Shop: 'दुकान', Store: 'स्टोर', Workshop: 'कार्यशाला' };
const ADC = { Delhi: 'दिल्ली', Mumbai: 'मुंबई', Chennai: 'चेन्नई', Pune: 'पुणे' };
const adOpt = (o) => {
  let m;
  if (o === 'Equal' || o === 'Both are equal') return 'दोनों बराबर हैं';
  if (o === 'Cannot be determined') return 'निर्धारित नहीं किया जा सकता';
  if (ADC[o]) return ADC[o];
  if ((m = o.match(/^(Team|Product|Worker|Dept|Shop|Store|Workshop) ?(\w+)$/))) return `${ADW[m[1]]} ${m[2]}`;
  return o;
};
const AD_MANUAL = {
  "A farm's yield (tonnes): Year1: Wheat 300, Rice 200. Year2: Wheat 330, Rice 220. What was the % growth in TOTAL yield?": ['एक खेत की उपज (टन): वर्ष 1: गेहूँ 300, चावल 200। वर्ष 2: गेहूँ 330, चावल 220। कुल उपज में प्रतिशत वृद्धि कितनी थी?', 'वर्ष 1 का कुल = 500। वर्ष 2 का कुल = 550। वृद्धि = (550−500)/500 × 100 = 10%।'],
  'Table 1 (production, units): P 500, Q 700, R 600. Table 2 (defect rate): P 4%, Q 2%, R 5%. Which product had the FEWEST defective units?': ['तालिका 1 (उत्पादन, इकाइयाँ): P 500, Q 700, R 600। तालिका 2 (दोष दर): P 4%, Q 2%, R 5%। किस उत्पाद में सबसे कम दोषपूर्ण इकाइयाँ थीं?', 'P: 20; Q: 14; R: 30। Q में सबसे कम हैं।'],
  'Table 1 (staff count): Team1 20, Team2 30, Team3 25. Table 2 (avg output/staff): Team1 50, Team2 35, Team3 45. Which team had the HIGHEST total output?': ['तालिका 1 (कर्मचारी संख्या): टीम 1: 20, टीम 2: 30, टीम 3: 25। तालिका 2 (प्रति कर्मचारी औसत उत्पादन): टीम 1: 50, टीम 2: 35, टीम 3: 45। किस टीम का कुल उत्पादन सबसे अधिक था?', 'टीम 1: 1000; टीम 2: 1050; टीम 3: 1125। टीम 3 सबसे आगे है।'],
  'Table 1 (units sold): Product A 100, Product B 90. Table 2 (price/unit): Product A Rs.50, Product B Rs.60. Which product had higher total revenue?': ['तालिका 1 (बिकी इकाइयाँ): उत्पाद A: 100, उत्पाद B: 90। तालिका 2 (प्रति इकाई कीमत): उत्पाद A: ₹50, उत्पाद B: ₹60। किस उत्पाद का कुल राजस्व अधिक था?', 'उत्पाद A: 5,000; उत्पाद B: 5,400। उत्पाद B का राजस्व अधिक है।'],
  'Table 1 (hours worked): Worker 1 40, Worker 2 35. Table 2 (rate/hour): Worker 1 Rs.200, Worker 2 Rs.250. Which worker earned more?': ['तालिका 1 (काम के घंटे): कर्मचारी 1: 40, कर्मचारी 2: 35। तालिका 2 (प्रति घंटा दर): कर्मचारी 1: ₹200, कर्मचारी 2: ₹250। किसने अधिक कमाया?', 'कर्मचारी 1: 8,000; कर्मचारी 2: 8,750। कर्मचारी 2 की कमाई अधिक है।'],
  "Two regions' sales (Rs. lakh): East 300, West 200. What % of TOTAL sales is West?": ['दो क्षेत्रों की बिक्री (₹ लाख): पूर्व 300, पश्चिम 200। कुल बिक्री का कितना प्रतिशत पश्चिम है?', 'कुल = 300+200 = 500। हिस्सा = 200/500 × 100 = 40%।'],
  'A survey of 400 people: 240 prefer online shopping, 160 prefer in-store. What % prefer in-store?': ['400 लोगों के सर्वे में: 240 ऑनलाइन खरीदारी पसंद करते हैं, 160 दुकान में जाकर खरीदना। कितने प्रतिशत दुकान में खरीदना पसंद करते हैं?', 'कुल = 240+160 = 400। हिस्सा = 160/400 × 100 = 40%।'],
  'Table 1 (units produced): X 400, Y 350, Z 500. Table 2 (defect rate): X 5%, Y 4%, Z 6%. Which had the MOST defective units?': ['तालिका 1 (उत्पादित इकाइयाँ): X 400, Y 350, Z 500। तालिका 2 (दोष दर): X 5%, Y 4%, Z 6%। किसमें सबसे अधिक दोषपूर्ण इकाइयाँ थीं?', 'X: 20; Y: 14; Z: 30। Z में सबसे अधिक हैं।'],
  'Table 1 (staff): Dept1 15, Dept2 25. Table 2 (avg output/staff): Dept1 60, Dept2 40. Which dept had HIGHER total output?': ['तालिका 1 (कर्मचारी): विभाग 1: 15, विभाग 2: 25। तालिका 2 (प्रति कर्मचारी औसत उत्पादन): विभाग 1: 60, विभाग 2: 40। किस विभाग का कुल उत्पादन अधिक था?', 'विभाग 1: 900; विभाग 2: 1000। विभाग 2 आगे है।'],
  "A retailer's profit (Rs. lakh): Year1: Store1 40, Store2 60. Year2: Store1 48, Store2 72. What was the % growth in TOTAL profit?": ['एक खुदरा विक्रेता का लाभ (₹ लाख): वर्ष 1: स्टोर 1: 40, स्टोर 2: 60। वर्ष 2: स्टोर 1: 48, स्टोर 2: 72। कुल लाभ में प्रतिशत वृद्धि कितनी थी?', 'वर्ष 1 का कुल = 100। वर्ष 2 का कुल = 120। वृद्धि = (120−100)/100 × 100 = 20%।'],
  "A company's revenue (Rs. cr): Year1: Product A 100, Product B 150. Year2: Product A 130, Product B 170. What was the % growth in TOTAL revenue (both products combined)?": ['एक कंपनी का राजस्व (₹ करोड़): वर्ष 1: उत्पाद A: 100, उत्पाद B: 150। वर्ष 2: उत्पाद A: 130, उत्पाद B: 170। कुल राजस्व (दोनों उत्पाद मिलाकर) में प्रतिशत वृद्धि कितनी थी?', 'वर्ष 1 का कुल = 250। वर्ष 2 का कुल = 300। वृद्धि = (300−250)/250 × 100 = 20%।'],
  "A school's enrollment: Year1: Boys 200, Girls 180. Year2: Boys 220, Girls 198. What was the % growth in TOTAL enrollment?": ['एक विद्यालय का नामांकन: वर्ष 1: लड़के 200, लड़कियाँ 180। वर्ष 2: लड़के 220, लड़कियाँ 198। कुल नामांकन में प्रतिशत वृद्धि कितनी थी?', 'वर्ष 1 का कुल = 380। वर्ष 2 का कुल = 418। वृद्धि = (418−380)/380 × 100 = 10%।'],
  'Table 1 (units sold): Shop P 60, Shop Q 80. Table 2 (price/unit): Shop P Rs.100, Shop Q Rs.90. Which shop had higher total revenue?': ['तालिका 1 (बिकी इकाइयाँ): दुकान P: 60, दुकान Q: 80। तालिका 2 (प्रति इकाई कीमत): दुकान P: ₹100, दुकान Q: ₹90। किस दुकान का कुल राजस्व अधिक था?', 'दुकान P: 60×100 = 6000। दुकान Q: 80×90 = 7200। दुकान Q का राजस्व अधिक है।'],
  'Table 1 (units sold): Delhi 200, Mumbai 150. Table 2 (price/unit): Delhi Rs.300, Mumbai Rs.400. Which city had higher total revenue?': ['तालिका 1 (बिकी इकाइयाँ): दिल्ली: 200, मुंबई: 150। तालिका 2 (प्रति इकाई कीमत): दिल्ली: ₹300, मुंबई: ₹400। किस शहर का कुल राजस्व अधिक था?', 'दिल्ली: 60,000; मुंबई: 60,000। दोनों बराबर हैं।'],
  'Table 1 (units sold): Chennai 180, Pune 220. Table 2 (price/unit): Chennai Rs.250, Pune Rs.200. Which city had higher total revenue?': ['तालिका 1 (बिकी इकाइयाँ): चेन्नई: 180, पुणे: 220। तालिका 2 (प्रति इकाई कीमत): चेन्नई: ₹250, पुणे: ₹200। किस शहर का कुल राजस्व अधिक था?', 'चेन्नई: 45,000; पुणे: 44,000। चेन्नई का राजस्व अधिक है।'],
  'Table 1 (units sold): Store A 500, Store B 400. Table 2 (cost/unit): Store A Rs.60, Store B Rs.70. Which store had higher total cost?': ['तालिका 1 (बिकी इकाइयाँ): स्टोर A: 500, स्टोर B: 400। तालिका 2 (प्रति इकाई लागत): स्टोर A: ₹60, स्टोर B: ₹70। किस स्टोर की कुल लागत अधिक थी?', 'स्टोर A: 30,000; स्टोर B: 28,000। स्टोर A की लागत अधिक है।'],
  'Table 1 (attendees): Workshop X 300, Workshop Y 250. Table 2 (fee/attendee): Workshop X Rs.500, Workshop Y Rs.600. Which workshop earned more?': ['तालिका 1 (प्रतिभागी): कार्यशाला X: 300, कार्यशाला Y: 250। तालिका 2 (प्रति प्रतिभागी शुल्क): कार्यशाला X: ₹500, कार्यशाला Y: ₹600। किस कार्यशाला ने अधिक कमाया?', 'कार्यशाला X: 1,50,000; कार्यशाला Y: 1,50,000। दोनों बराबर हैं।'],
  "Three branches' Q1 sales (Rs. lakh): North 40, South 60, East 100. What % of the TOTAL did East contribute?": ['तीन शाखाओं की पहली तिमाही की बिक्री (₹ लाख): उत्तर 40, दक्षिण 60, पूर्व 100। कुल का कितना प्रतिशत पूर्व ने दिया?', 'कुल = 40+60+100 = 200। हिस्सा = 100/200 × 100 = 50%।'],
  "Three products' monthly units: A 150, B 250, C 100. What % of the TOTAL did B contribute?": ['तीन उत्पादों की मासिक इकाइयाँ: A 150, B 250, C 100। कुल का कितना प्रतिशत B ने दिया?', 'कुल = 150+250+100 = 500। हिस्सा = 250/500 × 100 = 50%।'],
  "Three departments' headcount: Sales 90, Tech 150, Ops 60. What % of the TOTAL is Tech?": ['तीन विभागों की कर्मचारी संख्या: बिक्री 90, तकनीक 150, संचालन 60। कुल का कितना प्रतिशत तकनीक है?', 'कुल = 90+150+60 = 300। हिस्सा = 150/300 × 100 = 50%।'],
};
export function localizeAdvancedDI(q) {
  if (q.chapter !== 'advanced-data-interpretation' || typeof q.prompt !== 'string') return q;
  const man = AD_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], adOpt);
  const m = q.prompt.match(/^Table 1 \(units sold\): Delhi (\d+), Mumbai (\d+)\. Table 2 \(price per unit\): Delhi Rs\. (\d+), Mumbai Rs\. (\d+)\. Which city had higher revenue\?$/);
  const e = q.exp.match(/^Revenue = units × price\. Delhi: (\d+)\. Mumbai: (\d+)\.$/);
  if (!m || !e) return q;
  return bi(q, `तालिका 1 (बिकी इकाइयाँ): दिल्ली ${m[1]}, मुंबई ${m[2]}। तालिका 2 (प्रति इकाई कीमत): दिल्ली ₹${m[3]}, मुंबई ₹${m[4]}। किस शहर का राजस्व अधिक था?`, `राजस्व = इकाइयाँ × कीमत। दिल्ली: ${e[1]}। मुंबई: ${e[2]}।`, adOpt);
}

// ── 3D Spatial (Secondary) ──
const S3_DIR = { North: 'उत्तर', South: 'दक्षिण', East: 'पूर्व', West: 'पश्चिम' };
const s3Opt = (o) => ({ Back: 'पीछे वाला फलक', Left: 'बायाँ फलक', Right: 'दायाँ फलक', Front: 'सामने वाला फलक', ...S3_DIR }[o] || o);
const S3_QUAL = {
  'exactly 3 painted faces (corner cubes)': 'ठीक 3 फलकों पर रंग है (कोने वाले घन)',
  'exactly 2 painted faces (edge cubes)': 'ठीक 2 फलकों पर रंग है (किनारे वाले घन)',
  'exactly 1 painted face (face-center cubes)': 'ठीक 1 फलक पर रंग है (फलक के केंद्र वाले घन)',
  'no painted faces at all (fully inside)': 'किसी भी फलक पर रंग नहीं है (पूरी तरह भीतर)',
  'no painted face': 'किसी भी फलक पर रंग नहीं है',
  'exactly 1 painted face': 'ठीक 1 फलक पर रंग है',
  'exactly 2 painted faces': 'ठीक 2 फलकों पर रंग है',
  'at least one painted face': 'कम से कम एक फलक पर रंग है',
};
const S3_MANUAL = {
  'A regular hexagon (6 equal sides) is rotated until it looks identical to its start. What is the SMALLEST rotation angle (in degrees) that does this?': ['एक सम षट्भुज (6 बराबर भुजाएँ) को तब तक घुमाया जाता है जब तक वह अपनी शुरुआती स्थिति जैसा न दिखे। ऐसा करने वाला सबसे छोटा घूर्णन कोण (अंशों में) क्या है?', 'n भुजाओं वाले सम बहुभुज में हर 360/n अंश पर घूर्णन-सममिति होती है। 360/6 = 60।'],
  'A regular pentagon (5 equal sides) has rotational symmetry every how many degrees?': ['सम पंचभुज (5 बराबर भुजाएँ) में हर कितने अंश पर घूर्णन-सममिति होती है?', '360/5 = 72 अंश।'],
  'A cube is rotated 90 degrees counter-clockwise (viewed from above) about a vertical axis. A dot that started on the FRONT face is now on which face?': ['एक घन को ऊर्ध्वाधर अक्ष के परितः 90° वामावर्त (ऊपर से देखने पर) घुमाया जाता है। जो बिंदु सामने वाले फलक पर था, वह अब किस फलक पर है?', 'ऊर्ध्वाधर अक्ष के परितः 90° के मोड़ से सामने वाला फलक दायें फलक पर चला जाता है (ऊपर से देखने पर वामावर्त मोड़ के लिए)।'],
  'A square (4 equal sides) has rotational symmetry every how many degrees?': ['वर्ग (4 बराबर भुजाएँ) में हर कितने अंश पर घूर्णन-सममिति होती है?', '360/4 = 90 अंश।'],
  'A shape is rotated 90 degrees clockwise from facing North. Which direction does it now face?': ['एक आकृति उत्तर की ओर मुँह करके 90° दक्षिणावर्त घुमाई जाती है। अब वह किस दिशा की ओर है?', 'उत्तर से 90° दक्षिणावर्त घुमाने पर पूर्व मिलता है।'],
  'A shape is rotated 180 degrees from facing East. Which direction does it now face?': ['एक आकृति पूर्व की ओर मुँह करके 180° घुमाई जाती है। अब वह किस दिशा की ओर है?', 'पूर्व से 180° घुमाने पर पश्चिम (विपरीत दिशा) मिलता है।'],
};
export function localize3dSpatial(q) {
  if (q.chapter !== '3d-spatial-secondary' || typeof q.prompt !== 'string') return q;
  const man = S3_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], s3Opt);
  const m = q.prompt.match(/^A (\d)[x×]\1[x×]\1 cube is painted on all outer faces, then cut into (\d+) unit cubes\. How many have (.+)\?$/);
  if (!m || !S3_QUAL[m[3]]) return q;
  const hi = `एक ${m[1]}×${m[1]}×${m[1]} घन के सभी बाहरी फलकों पर रंग किया गया, फिर उसे ${m[2]} इकाई घनों में काटा गया। कितने घनों के लिए ${S3_QUAL[m[3]]}?`;
  let e; let exp;
  if ((e = q.exp.match(/^Corners\(3 faces\)=(\d+), Edges\(2 faces\)=(\d+), Faces\(1 face\)=(\d+), Inner\(0 faces\)=(\d+)\. Total=(\d+)\. Answer for '.*' = (\d+)\.$/))) exp = `कोने (3 फलक)=${e[1]}, किनारे (2 फलक)=${e[2]}, फलक (1 फलक)=${e[3]}, भीतर (0 फलक)=${e[4]}। कुल=${e[5]}। उत्तर = ${e[6]}।`;
  else if ((e = q.exp.match(/^The inside block is \((\d) − 2\)³ = (\d+)\.$/))) exp = `भीतरी खंड (${e[1]} − 2)³ = ${e[2]} है।`;
  else if ((e = q.exp.match(/^Each face has \((\d) − 2\)² = (\d+) inner cubes, and 6 faces give (\d+)\.$/))) exp = `हर फलक पर (${e[1]} − 2)² = ${e[2]} भीतरी घन हैं, और 6 फलकों से ${e[3]} मिलते हैं।`;
  else if ((e = q.exp.match(/^(\d+) − (\d+) = (\d+)\.$/))) exp = `${e[1]} − ${e[2]} = ${e[3]}।`;
  else if ((e = q.exp.match(/^Cubes on the edges, not at the corners, have 2 painted faces: 12 × \((\d) − 2\) = (\d+)\.$/))) exp = `किनारों पर (कोनों को छोड़कर) स्थित घनों के 2 फलकों पर रंग होता है: 12 × (${e[1]} − 2) = ${e[2]}।`;
  if (!exp) return q;
  return bi(q, hi, exp, s3Opt);
}

// ── Reasoning Connect (Secondary) ──
const RS2_OPT = {
  'No, only squares are squares': 'नहीं, केवल वर्ग ही वर्ग होते हैं', 'Cannot be determined': 'निर्धारित नहीं किया जा सकता',
  'Yes - Shape X is a square (4 equal sides, 4 right angles), and all squares are rectangles': 'हाँ — आकृति X एक वर्ग है (4 बराबर भुजाएँ, 4 समकोण), और सभी वर्ग आयत होते हैं',
  "No - practicing daily doesn't guarantee club membership": 'नहीं — रोज़ अभ्यास करने से क्लब की सदस्यता सुनिश्चित नहीं होती', 'Yes, definitely': 'हाँ, निश्चित रूप से', 'Yes, if she enjoys debate': 'हाँ, यदि उसे वाद-विवाद पसंद है',
  'WH1 and WH3': 'WH1 और WH3', 'WH1': 'WH1', None: 'कोई नहीं', 'W2 and W4': 'W2 और W4', 'Only W1': 'केवल W1', 'W1 and W3': 'W1 और W3',
  'Yes, Anil leads both': 'हाँ, अनिल दोनों में आगे है', 'No - Bimal has the highest attendance (95%), but Anil has the highest score': 'नहीं — बिमल की उपस्थिति सबसे अधिक (95%) है, पर अनिल के अंक सबसे अधिक हैं', 'Yes, Bimal leads both': 'हाँ, बिमल दोनों में आगे है',
  'No, this is a data error': 'नहीं, यह डेटा की त्रुटि है', 'Yes - the platypus is the well-known exception to the egg-laying rule for mammals': 'हाँ — प्लैटिपस स्तनधारियों के अंडे देने के नियम का प्रसिद्ध अपवाद है',
  'R2 alone is fastest, no tie': 'अकेला R2 सबसे तेज़ है, कोई बराबरी नहीं', 'R1 is fastest': 'R1 सबसे तेज़ है', 'R2 and R4 tie for fastest at 42 seconds': 'R2 और R4, 42 सेकंड पर सबसे तेज़ होने में बराबर हैं',
  'Yes, fully consistent': 'हाँ, पूरी तरह संगत', 'No - a rating above 4.0 should mean approved status, so this is inconsistent with the stated rule': 'नहीं — 4.0 से ऊपर की रेटिंग का अर्थ स्वीकृत स्थिति होना चाहिए, इसलिए यह बताए गए नियम से असंगत है', 'Cannot be determined at all': 'बिल्कुल निर्धारित नहीं किया जा सकता',
  'Yes, identical order': 'हाँ, क्रम एक जैसा है', 'No - by speed: Esha(220) > Farah(210) > Deepa(200), which differs from the age order Deepa > Esha > Farah': 'नहीं — गति के अनुसार: एशा (220) > फ़राह (210) > दीपा (200), जो उम्र के क्रम दीपा > एशा > फ़राह से अलग है',
  'Sam is shortest; No, Priya weighs the least': 'सैम सबसे छोटा है; नहीं, सबसे कम वज़न प्रिया का है', 'Sam is shortest; Yes, Sam also weighs the least': 'सैम सबसे छोटा है; हाँ, सैम का वज़न भी सबसे कम है', 'Rohan is shortest; No, Priya weighs the least': 'रोहन सबसे छोटा है; नहीं, सबसे कम वज़न प्रिया का है',
  'B, D': 'B, D', 'D, B': 'D, B', 'D, C': 'D, C', 'Rohit scored 70 exactly': 'रोहित को ठीक 70 अंक मिले', "There is a contradiction - Rohit's score conflicts with the stated rule": 'विरोधाभास है — रोहित के अंक बताए गए नियम से टकराते हैं', 'The rule only applies to some members': 'नियम केवल कुछ सदस्यों पर लागू होता है',
  'Only partially consistent': 'केवल आंशिक रूप से संगत', "No - Meera's time (20) is fastest, so she should have finished first, not last": 'नहीं — मीरा का समय (20) सबसे तेज़ है, इसलिए उसे सबसे पहले आना चाहिए था, सबसे आखिर में नहीं',
  Uday: 'उदय', Sita: 'सीता', Ravi: 'रवि',
};
const rs2Opt = (o) => RS2_OPT[o] || o;
const RS2_MANUAL = {
  "A table shows 4 products' prices: P1 Rs.200, P2 Rs.350, P3 Rs.150, P4 Rs.400. If a discount applies to any product priced above the average, how many products get the discount?": ['एक तालिका 4 उत्पादों की कीमतें दिखाती है: P1 ₹200, P2 ₹350, P3 ₹150, P4 ₹400। यदि औसत से ऊपर कीमत वाले हर उत्पाद पर छूट लागू होती है, तो कितने उत्पादों को छूट मिलेगी?', 'औसत = (200+350+150+400)/4 = 1100/4 = 275। केवल P4 (400) 275 से अधिक है, इसलिए 1 उत्पाद को छूट मिलेगी।'],
  'All squares are rectangles. A table lists shapes and their properties: Shape X has 4 equal sides and 4 right angles. Is Shape X a rectangle?': ['सभी वर्ग आयत होते हैं। एक तालिका आकृतियों और उनके गुणों को सूचीबद्ध करती है: आकृति X की 4 बराबर भुजाएँ और 4 समकोण हैं। क्या आकृति X एक आयत है?', 'आकृति X वर्ग की परिभाषा पर ठीक बैठती है। चूँकि सभी वर्ग आयत होते हैं, इसलिए आकृति X भी अवश्य आयत है।'],
  "A table shows 4 weeks' sales (units): W1 30, W2 45, W3 30, W4 55. Which week(s) had sales BELOW the average?": ['एक तालिका 4 सप्ताहों की बिक्री (इकाइयों में) दिखाती है: W1 30, W2 45, W3 30, W4 55। किन सप्ताहों की बिक्री औसत से नीचे थी?', 'औसत = (30+45+30+55)/4 = 160/4 = 40। 40 से नीचे: W1 (30) और W3 (30)।'],
  'All members of the debate club practice daily. Meena practices daily. Can we conclude Meena is a member of the debate club?': ['वाद-विवाद क्लब के सभी सदस्य रोज़ अभ्यास करते हैं। मीना रोज़ अभ्यास करती है। क्या हम निष्कर्ष निकाल सकते हैं कि मीना वाद-विवाद क्लब की सदस्य है?', 'नियम कहता है कि क्लब के सदस्य रोज़ अभ्यास करते हैं, यह नहीं कि केवल क्लब के सदस्य ही रोज़ अभ्यास करते हैं — यह उलटे तर्क की त्रुटि है।'],
  "A table shows 3 warehouses' stock: WH1 500, WH2 750, WH3 620. If a reorder is triggered when stock falls below 600, which warehouse(s) need reordering?": ['एक तालिका 3 गोदामों का स्टॉक दिखाती है: WH1 500, WH2 750, WH3 620। यदि स्टॉक 600 से नीचे गिरने पर दोबारा ऑर्डर किया जाता है, तो किन गोदामों को दोबारा ऑर्डर की ज़रूरत है?', '600 से नीचे: WH1 (500)। WH2 (750) और WH3 (620) दोनों 600 से ऊपर हैं।'],
  'Anil scored higher than Bimal. Bimal scored higher than Charu. A table shows their attendance %: Anil 90%, Bimal 95%, Charu 85%. Does the student with the highest score also have the highest attendance?': ['अनिल के अंक बिमल से अधिक हैं। बिमल के अंक चारु से अधिक हैं। एक तालिका उनकी उपस्थिति % दिखाती है: अनिल 90%, बिमल 95%, चारु 85%। क्या सबसे अधिक अंक वाले छात्र की उपस्थिति भी सबसे अधिक है?', 'अंकों का क्रम: अनिल > बिमल > चारु। उपस्थिति: बिमल (95%) > अनिल (90%) > चारु (85%)। सबसे अधिक अंक वाला (अनिल) सबसे अधिक उपस्थिति वाला (बिमल) नहीं है।'],
  "A table shows 5 products' monthly returns: A 12, B 8, C 15, D 5, E 10. If a product with more than 10 returns is flagged for quality review, how many products are flagged?": ['एक तालिका 5 उत्पादों की मासिक वापसी दिखाती है: A 12, B 8, C 15, D 5, E 10। यदि 10 से अधिक वापसी वाले उत्पाद को गुणवत्ता समीक्षा के लिए चिह्नित किया जाता है, तो कितने उत्पाद चिह्नित होंगे?', '10 से अधिक: A (12) और C (15) = 2 उत्पाद। B (8), D (5), E (10) नहीं हैं (E=10, 10 से अधिक नहीं है)।'],
  "No mammal lays eggs, with one known exception: the platypus. A table lists 'Animal: Platypus, Lays eggs: Yes, Class: Mammal'. Is this entry consistent with general mammal biology?": ['कोई भी स्तनधारी अंडे नहीं देता, सिवाय एक ज्ञात अपवाद के: प्लैटिपस। एक तालिका में दर्ज है \'जानवर: प्लैटिपस, अंडे देता है: हाँ, वर्ग: स्तनधारी\'। क्या यह प्रविष्टि स्तनधारियों के सामान्य जीव-विज्ञान से संगत है?', 'पूर्वधारणा स्पष्ट रूप से कहती है कि प्लैटिपस एक अपवाद है, इसलिए प्लैटिपस के लिए अंडे देने वाले स्तनधारी की प्रविष्टि संगत है, विरोधाभासी नहीं।'],
  "A table shows 4 runners' race times (seconds): R1 45, R2 42, R3 48, R4 42. Who has the FASTEST time, and is there a tie?": ['एक तालिका 4 धावकों के दौड़ के समय (सेकंड) दिखाती है: R1 45, R2 42, R3 48, R4 42। सबसे तेज़ समय किसका है, और क्या कोई बराबरी है?', 'सबसे कम समय = सबसे तेज़। R2=42 और R4=42 दोनों सबसे कम हैं, बराबर।'],
  "All approved vendors have a rating above 4.0. A table shows Vendor X with rating 4.2 but status 'Not Approved'. Is this consistent?": ['सभी स्वीकृत विक्रेताओं की रेटिंग 4.0 से ऊपर है। एक तालिका में विक्रेता X की रेटिंग 4.2 है पर स्थिति \'अस्वीकृत\' है। क्या यह संगत है?', 'नियम कहता है कि स्वीकृत विक्रेताओं की रेटिंग > 4.0 होती है; ऊँची रेटिंग वाली \'अस्वीकृत\' प्रविष्टि एक चिह्नित असंगति है जिसकी जाँच होनी चाहिए।'],
  "A table shows 3 classes' average scores: Class A 72, Class B 68, Class C 75. If a class needs an average of 70+ to advance, how many classes advance?": ['एक तालिका 3 कक्षाओं के औसत अंक दिखाती है: कक्षा A 72, कक्षा B 68, कक्षा C 75। यदि आगे बढ़ने के लिए कक्षा का औसत 70+ चाहिए, तो कितनी कक्षाएँ आगे बढ़ेंगी?', 'औसत ≥ 70: कक्षा A (72) और कक्षा C (75) = 2 कक्षाएँ। कक्षा B (68) नहीं।'],
  'Deepa is older than Esha. Esha is older than Farah. A table shows their reading speeds (words/min): Deepa 200, Esha 220, Farah 210. Is age order the same as reading-speed order?': ['दीपा, एशा से बड़ी है। एशा, फ़राह से बड़ी है। एक तालिका उनकी पढ़ने की गति (शब्द/मिनट) दिखाती है: दीपा 200, एशा 220, फ़राह 210। क्या उम्र का क्रम पढ़ने की गति के क्रम जैसा ही है?', 'उम्र का क्रम: दीपा > एशा > फ़राह। गति का क्रम (सबसे तेज़ पहले): एशा > फ़राह > दीपा। ये अलग-अलग क्रम हैं।'],
  'A table shows 3 students\' marks: Aman 72, Bela unknown, Chetan 78. Chetan is the second-highest scorer. The topper must score at least 10 more than the second-highest. What is the minimum possible score for the topper (Bela)?': ['एक तालिका 3 छात्रों के अंक दिखाती है: अमन 72, बेला अज्ञात, चेतन 78। चेतन दूसरे सबसे अधिक अंक वाला है। टॉपर के अंक दूसरे सबसे अधिक से कम से कम 10 अधिक होने चाहिए। टॉपर (बेला) के लिए न्यूनतम संभव अंक क्या है?', 'दूसरा सबसे अधिक = चेतन (78)। टॉपर के कम से कम 78+10=88 अंक होने चाहिए, इसलिए बेला के लिए न्यूनतम संभव अंक 88 है।'],
  'A table shows quarterly profits (Rs. lakh): Q1 40, Q2 55, Q3 35, Q4 60. If a bonus is paid only when a quarter\'s profit exceeds the AVERAGE of all 4 quarters, in how many quarters was a bonus paid?': ['एक तालिका तिमाही लाभ (₹ लाख) दिखाती है: Q1 40, Q2 55, Q3 35, Q4 60। यदि बोनस तभी दिया जाता है जब किसी तिमाही का लाभ चारों तिमाहियों के औसत से अधिक हो, तो कितनी तिमाहियों में बोनस दिया गया?', 'औसत = (40+55+35+60)/4 = 190/4 = 47.5। 47.5 से अधिक वाली तिमाहियाँ: Q2 (55) और Q4 (60) = 2 तिमाहियाँ।'],
  'Priya is taller than Rohan. Rohan is taller than Sam. A table separately shows their weights: Priya 55kg, Rohan 60kg, Sam 58kg. Who is the SHORTEST, and does the shortest also weigh the least?': ['प्रिया, रोहन से लंबी है। रोहन, सैम से लंबा है। एक तालिका अलग से उनके वज़न दिखाती है: प्रिया 55 किग्रा, रोहन 60 किग्रा, सैम 58 किग्रा। सबसे छोटा कौन है, और क्या सबसे छोटे का वज़न भी सबसे कम है?', 'लंबाई का क्रम: प्रिया > रोहन > सैम, इसलिए सैम सबसे छोटा है। वज़न: प्रिया 55, रोहन 60, सैम 58 — सबसे कम वज़न प्रिया (55) का है, सैम का नहीं। इसलिए सबसे छोटा ≠ सबसे हल्का।'],
  "A table shows 5 employees' sales (units): A 20, B 35, C 28, D 42, E 15. If the top 2 performers get a bonus, list them in order (highest first).": ['एक तालिका 5 कर्मचारियों की बिक्री (इकाइयों में) दिखाती है: A 20, B 35, C 28, D 42, E 15। यदि शीर्ष 2 प्रदर्शनकर्ताओं को बोनस मिलता है, तो उन्हें क्रम से सूचीबद्ध कीजिए (सबसे अधिक पहले)।', 'क्रमबद्ध: D (42), B (35), C (28), A (20), E (15)। शीर्ष 2 = पहले D फिर B।'],
  'All members of Team Alpha scored above 70 in a test. Rohit is a member of Team Alpha. A separate table shows Rohit scored 65. What can be concluded?': ['टीम अल्फ़ा के सभी सदस्यों ने एक परीक्षा में 70 से ऊपर अंक पाए। रोहित टीम अल्फ़ा का सदस्य है। एक अलग तालिका दिखाती है कि रोहित को 65 अंक मिले। क्या निष्कर्ष निकाला जा सकता है?', 'नियम कहता है कि टीम अल्फ़ा के सभी सदस्यों ने 70 से ऊपर अंक पाए, पर तालिका में रोहित के 65 हैं, जो उस नियम का सीधा विरोध करता है।'],
  "A table shows 3 shops' daily customers: Shop A 120, Shop B 95, Shop C 110. If a shop needs at least 100 customers/day to break even, how many shops are breaking even?": ['एक तालिका 3 दुकानों के दैनिक ग्राहक दिखाती है: दुकान A 120, दुकान B 95, दुकान C 110। यदि लागत निकालने (ब्रेक-ईवन) के लिए दुकान को प्रतिदिन कम से कम 100 ग्राहक चाहिए, तो कितनी दुकानें ब्रेक-ईवन कर रही हैं?', 'ग्राहक ≥ 100 वाली दुकानें: दुकान A (120) और दुकान C (110) = 2 दुकानें। दुकान B (95) नहीं।'],
  'In a race, Karan finished before Leela. Leela finished before Meera. A table shows their times (minutes): Karan 22, Leela 25, Meera 20. Is the table consistent with the finishing order described?': ['एक दौड़ में, करण लीला से पहले खत्म हुआ। लीला मीरा से पहले खत्म हुई। एक तालिका उनके समय (मिनट) दिखाती है: करण 22, लीला 25, मीरा 20। क्या तालिका वर्णित समापन-क्रम से संगत है?', 'कम समय = पहले खत्म। समय के अनुसार क्रम: मीरा (20) < करण (22) < लीला (25)। पर विवरण कहता है करण, लीला से पहले और लीला, मीरा से पहले — ये आपस में विरोधी हैं।'],
  'A table shows 4 friends\' heights (cm): Ravi 160, Sita 155, Tara 168, Uday 150. Who is the SHORTEST?': ['एक तालिका 4 मित्रों की ऊँचाई (सेमी) दिखाती है: रवि 160, सीता 155, तारा 168, उदय 150। सबसे छोटा कौन है?', 'सभी 4 की तुलना: रवि 160, सीता 155, तारा 168, उदय 150। उदय सबसे कम है।'],
};
export function localizeReasoningConnectSecondary(q) {
  if (q.chapter !== 'reasoning-connect-secondary' || typeof q.prompt !== 'string') return q;
  const man = RS2_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], rs2Opt);
  let m; let e;
  if ((m = q.prompt.match(/^The average of (\d) numbers is (\d+)\. If the number (\d+) is (removed|added), what is the (?:average of the remaining numbers|new average)\?$/))) {
    const hi = `${m[1]} संख्याओं का औसत ${m[2]} है। यदि संख्या ${m[3]} ${m[4] === 'removed' ? 'हटा दी जाए, तो शेष संख्याओं का औसत' : 'जोड़ दी जाए, तो नया औसत'} क्या होगा?`;
    if ((e = q.exp.match(/^Total = (\d) × (\d+) = (\d+)\. Remove (\d+): (\d+) left, divided by (\d) gives (\d+)\.$/))) return bi(q, hi, `कुल = ${e[1]} × ${e[2]} = ${e[3]}। ${e[4]} हटाने पर: ${e[5]} बचे, ${e[6]} से भाग देने पर ${e[7]} मिलता है।`, id);
    if ((e = q.exp.match(/^Total = (\d) × (\d+) \+ (\d+) = (\d+)\. Divided by (\d) gives (\d+)\.$/))) return bi(q, hi, `कुल = ${e[1]} × ${e[2]} + ${e[3]} = ${e[4]}। ${e[5]} से भाग देने पर ${e[6]} मिलता है।`, id);
  }
  return q;
}

// ── Verbal Reasoning ──
const VR = {
  Pen: 'कलम', Write: 'लिखना', Knife: 'चाकू', Cut: 'काटना', Sharp: 'तेज़', Kitchen: 'रसोई', Doctor: 'डॉक्टर', Hospital: 'अस्पताल', Teacher: 'शिक्षक',
  Student: 'छात्र', Book: 'किताब', School: 'विद्यालय', Fish: 'मछली', Water: 'पानी', Bird: 'पक्षी', Nest: 'घोंसला', Wing: 'पंख', Air: 'हवा',
  Hot: 'गर्म', Cold: 'ठंडा', Tall: 'लंबा', Short: 'छोटा', Big: 'बड़ा', High: 'ऊँचा', Puppy: 'पिल्ला', Dog: 'कुत्ता', Kitten: 'बिल्ली का बच्चा',
  Cub: 'शावक', Cat: 'बिल्ली', Foal: 'घोड़े का बच्चा', Author: 'लेखक', Sculptor: 'मूर्तिकार', Statue: 'मूर्ति', Chisel: 'छेनी', Museum: 'संग्रहालय',
  Thermometer: 'थर्मामीटर', Temperature: 'तापमान', Speedometer: 'स्पीडोमीटर', Speed: 'गति', Car: 'कार', Dashboard: 'डैशबोर्ड', Tailor: 'दर्ज़ी',
  Cloth: 'कपड़ा', Carpenter: 'बढ़ई', Hammer: 'हथौड़ा', Furniture: 'फ़र्नीचर', Wood: 'लकड़ी', Optimist: 'आशावादी', Hopeful: 'आशावान',
  Pessimist: 'निराशावादी', Sad: 'उदास', Gloomy: 'उदासीन', Angry: 'क्रोधित', Library: 'पुस्तकालय', Books: 'किताबें', Curator: 'संग्रहाध्यक्ष',
  Artifacts: 'कलाकृतियाँ', Ticket: 'टिकट', Cause: 'कारण', Effect: 'प्रभाव', Question: 'प्रश्न', Ask: 'पूछना', Answer: 'उत्तर', Problem: 'समस्या',
  Bouquet: 'गुलदस्ता', Flowers: 'फूल', Herd: 'झुंड', Flock: 'झुंड (भेड़ों का)', Cattle: 'पशु', Farm: 'खेत', Ornithologist: 'पक्षी-विज्ञानी',
  Birds: 'पक्षी', Entomologist: 'कीट-विज्ञानी', Zoologist: 'जंतु-विज्ञानी', Botany: 'वनस्पति विज्ञान', Insects: 'कीड़े', Verbose: 'वाचाल',
  Concise: 'संक्षिप्त', Timid: 'डरपोक', Bold: 'साहसी', Shy: 'शर्मीला', Quiet: 'शांत', Frugal: 'मितव्ययी', Miserly: 'कंजूस', Confident: 'आत्मविश्वासी',
  Proud: 'गर्वित', Humble: 'विनम्र', Arrogant: 'अहंकारी', Meteorologist: 'मौसम-विज्ञानी', Weather: 'मौसम', Seismologist: 'भूकंप-विज्ञानी',
  Geologist: 'भूवैज्ञानिक', Earthquakes: 'भूकंप', Volcano: 'ज्वालामुखी', Chapter: 'अध्याय', Scene: 'दृश्य', Actor: 'अभिनेता', Play: 'नाटक',
  Stage: 'मंच', Cobbler: 'मोची', Shoes: 'जूते', Potter: 'कुम्हार', Pots: 'मिट्टी के बर्तन', Clay: 'मिट्टी', Wheel: 'चाक', Anachronism: 'कालदोष',
  Time: 'समय', Misnomer: 'अनुचित नामकरण', Name: 'नाम', Mistake: 'गलती', Label: 'लेबल', Symphony: 'सिम्फ़नी', Composer: 'संगीत-रचयिता',
  Novel: 'उपन्यास', Publisher: 'प्रकाशक', Tiger: 'बाघ', Jungle: 'जंगल', Penguin: 'पेंगुइन', Swim: 'तैरना', Saw: 'आरी', Antarctica: 'अंटार्कटिका',
  Weight: 'वज़न', Metre: 'मीटर', Length: 'लंबाई', Kilogram: 'किलोग्राम', Snow: 'बर्फ़', White: 'सफ़ेद', Coal: 'कोयला', Black: 'काला',
  Sour: 'खट्टा', Tadpole: 'टैडपोल', Frog: 'मेंढक', Caterpillar: 'इल्ली', Butterfly: 'तितली', Tree: 'पेड़', Rose: 'गुलाब', Flower: 'फूल',
  Pine: 'चीड़', Calf: 'बछड़ा', Cow: 'गाय', Horse: 'घोड़ा', Goat: 'बकरी', Kid: 'बकरी का बच्चा', Chef: 'रसोइया (शेफ़)', Spatula: 'कलछी',
  Brush: 'कूची', Gold: 'सोना', Metal: 'धातु', Oak: 'बलूत (ओक)', Stitch: 'सिलाई', Anthill: 'बाँबी', Patient: 'मरीज़', Ice: 'बर्फ़', Fire: 'आग',
  Scissors: 'कैंची', Needle: 'सुई', Chalk: 'चॉक', Painter: 'चित्रकार', Camel: 'ऊँट', Desert: 'रेगिस्तान', 'Polar bear': 'ध्रुवीय भालू',
  Arctic: 'आर्कटिक', Sugar: 'चीनी', Sweet: 'मीठा', Lemon: 'नींबू', Bee: 'मधुमक्खी', Hive: 'छत्ता', Ant: 'चींटी', Litre: 'लीटर',
  Volume: 'आयतन', Second: 'सेकंड', Eagle: 'चील', Soar: 'ऊँचा उड़ना',
};
const vr = (s) => VR[s] || s;
const VR_REL = {
  'tool used to perform this action': 'औज़ार और वह क्रिया जो उससे की जाती है',
  'person works at this place': 'व्यक्ति और वह स्थान जहाँ वह काम करता है',
  'natural habitat/medium': 'प्राकृतिक आवास/माध्यम',
  opposites: 'विलोम',
  'baby animal to adult animal': 'जानवर का बच्चा और उसका वयस्क रूप',
  'creator to their creation': 'रचयिता और उसकी रचना',
  'instrument to what it measures': 'यंत्र और जो वह मापता है',
  'craftsperson to their raw material': 'कारीगर और उसका कच्चा माल',
  'personality type to its defining trait': 'व्यक्तित्व का प्रकार और उसकी पहचान वाला गुण',
  'place to what it primarily houses': 'स्थान और जो उसमें मुख्य रूप से रखा जाता है',
  'sequential/logical pair': 'क्रमिक/तार्किक जोड़ी',
  'collective noun to the group it names': 'समूहवाचक संज्ञा और वह समूह जिसे वह नाम देती है',
  'specialist to their field of study': 'विशेषज्ञ और उसका अध्ययन-क्षेत्र',
  'antonyms (opposite personality traits)': 'विलोम (विपरीत व्यक्तित्व-गुण)',
  'trait to its extreme/negative version': 'गुण और उसका अति/नकारात्मक रूप',
  'specialist to what they study': 'विशेषज्ञ और जो वह अध्ययन करता है',
  'sub-unit to the whole work it belongs to': 'उप-इकाई और वह पूरी कृति जिसका वह हिस्सा है',
  'craftsperson to what they make': 'कारीगर और जो वह बनाता है',
  "type of error to the category it's wrong about": 'त्रुटि का प्रकार और वह श्रेणी जिसके बारे में वह गलत है',
  'creative work to its creator': 'रचनात्मक कृति और उसका रचयिता',
};
export function localizeVerbalReasoning(q) {
  if (q.chapter !== 'verbal-reasoning' || typeof q.prompt !== 'string') return q;
  const m = q.prompt.match(/^(.+?) : (.+?) :: (.+?) : \?$/);
  if (!m) return q;
  const hi = `${vr(m[1])} : ${vr(m[2])} :: ${vr(m[3])} : ?`;
  let e = q.exp.match(/^Relationship: (.+)\. (.+?):(.+?) matches (.+?):(.+?)\.$/);
  if (e && VR_REL[e[1]]) return bi(q, hi, `संबंध: ${VR_REL[e[1]]}। ${vr(e[2])}:${vr(e[3])} का संबंध ${vr(e[4])}:${vr(e[5])} से मेल खाता है।`, vr);
  e = q.exp.match(/^(.+?) and (.+?) have the same relation as (.+?) and (.+?)\.$/);
  if (e) return bi(q, hi, `${vr(e[1])} और ${vr(e[2])} का जो संबंध है, वही ${vr(e[3])} और ${vr(e[4])} का है।`, vr);
  return q;
}

// ── Critical Reasoning ──
const CR_OPT = {
  '80% is a high percentage': '80% एक ऊँचा प्रतिशत है', 'Brand A is a real company': 'ब्रांड A एक वास्तविक कंपनी है', 'A small, self-selected sample may not represent all consumers': 'एक छोटा, स्वयं-चयनित नमूना सभी उपभोक्ताओं का प्रतिनिधित्व नहीं कर सकता',
  'The politician is popular': 'नेता लोकप्रिय है', 'Crime is a serious issue': 'अपराध एक गंभीर मुद्दा है', 'Reporting methods changed at the same time, undercounting crimes': 'उसी समय रिपोर्टिंग के तरीके बदल गए, जिससे अपराधों की गिनती कम हुई',
  'Yes, this is a valid conclusion': 'हाँ, यह एक वैध निष्कर्ष है', "No — being denied a bonus doesn't guarantee lateness was the reason": 'नहीं — बोनस न मिलने का मतलब यह नहीं कि कारण देर से आना ही था', 'Yes, but only if Rahul admits it': 'हाँ, पर केवल तभी जब राहुल इसे स्वीकार करे',
  'The ad campaign was expensive': 'विज्ञापन अभियान महँगा था', 'The company is profitable': 'कंपनी लाभ में है', 'Sales rose by the same amount in regions with no ad campaign': 'जिन क्षेत्रों में कोई विज्ञापन अभियान नहीं था, वहाँ भी बिक्री उतनी ही बढ़ी',
  'The fertilizer is affordable': 'खाद सस्ती है', 'No other factor (like better weather) changed at the same time': 'उसी समय कोई अन्य कारक (जैसे बेहतर मौसम) नहीं बदला', 'Farmers liked the fertilizer': 'किसानों को खाद पसंद आई',
  'Exercise burns calories': 'व्यायाम से कैलोरी जलती हैं', 'The study had many participants': 'अध्ययन में बहुत से प्रतिभागी थे', 'Healthier people are more likely to exercise daily in the first place': 'स्वस्थ लोग शुरू से ही रोज़ व्यायाम करने की अधिक संभावना रखते हैं',
  'City X has a large population': 'शहर X की जनसंख्या बड़ी है', 'No other traffic safety measures were introduced in City X that year': 'उस वर्ष शहर X में कोई अन्य यातायात सुरक्षा उपाय लागू नहीं किए गए', 'Other cities have higher speed limits': 'अन्य शहरों में गति-सीमा अधिक है',
  'Rising costs could reduce profit even with record sales': 'रिकॉर्ड बिक्री के बावजूद बढ़ती लागत लाभ घटा सकती है', 'The sales team works hard': 'बिक्री टीम कड़ी मेहनत करती है', 'The company has many employees': 'कंपनी में बहुत से कर्मचारी हैं',
  'Generalizing from observed examples to a universal claim': 'देखे गए उदाहरणों से सार्वभौमिक दावे तक सामान्यीकरण', 'Deducing from a stated rule': 'बताए गए नियम से निगमन', 'Testing a hypothesis experimentally': 'प्रयोग द्वारा परिकल्पना की जाँच',
  'The match was definitely not postponed': 'मैच निश्चित रूप से स्थगित नहीं हुआ', 'The match was definitely postponed': 'मैच निश्चित रूप से स्थगित हुआ', 'Nothing can be concluded about whether the match was postponed': 'मैच स्थगित हुआ या नहीं, इस बारे में कुछ भी निष्कर्ष नहीं निकाला जा सकता',
  'Yes, definitely': 'हाँ, निश्चित रूप से', 'No — she could have passed for another reason': 'नहीं — वह किसी अन्य कारण से भी पास हो सकती थी', 'Yes, but only sometimes': 'हाँ, पर केवल कभी-कभी',
  'The vaccine was developed quickly': 'टीका जल्दी विकसित किया गया', 'An independent lab replicated the same 95% result with a different 1,000 participants': 'एक स्वतंत्र प्रयोगशाला ने 1,000 अलग प्रतिभागियों के साथ वही 95% परिणाम दोहराया', 'The disease is dangerous': 'बीमारी ख़तरनाक है',
  "The restaurant's food quality also declined at the same time": 'रेस्तराँ के खाने की गुणवत्ता भी उसी समय गिरी', 'The restaurant is popular': 'रेस्तराँ लोकप्रिय है', 'Prices affect customer decisions': 'कीमतें ग्राहकों के निर्णय को प्रभावित करती हैं',
  'A dolphin is not a fish': 'डॉल्फ़िन मछली नहीं है', 'Dolphins are dangerous': 'डॉल्फ़िन ख़तरनाक होती हैं', 'All dolphins live in water': 'सभी डॉल्फ़िन पानी में रहती हैं',
  "The remaining 10% and the difference between 'satisfied' and 'delighted'": "शेष 10% और 'संतुष्ट' तथा 'प्रसन्न' के बीच का अंतर", 'The survey took time to conduct': 'सर्वे में समय लगा', '90% is a majority': '90% बहुमत है',
  'Nothing can be concluded about whether people evacuated': 'लोगों ने निकासी की या नहीं, इस बारे में कुछ भी निष्कर्ष नहीं निकाला जा सकता', 'No one evacuated': 'किसी ने निकासी नहीं की', 'Everyone stayed calm': 'सभी शांत रहे',
  'The exam was made easier the same year the method was adopted': 'जिस वर्ष यह पद्धति अपनाई गई, उसी वर्ष परीक्षा आसान बना दी गई', 'The school is well-funded': 'विद्यालय के पास अच्छा धन है', 'Teachers liked the new method': 'शिक्षकों को नई पद्धति पसंद आई',
  'The CEO is a good speaker': 'सीईओ एक अच्छे वक्ता हैं', 'No other market news affected the stock price that day': 'उस दिन किसी अन्य बाज़ार-समाचार ने शेयर की कीमत को प्रभावित नहीं किया', 'The company is large': 'कंपनी बड़ी है',
  "No — being good at logic doesn't guarantee club membership": 'नहीं — तर्क में अच्छा होने से क्लब की सदस्यता सुनिश्चित नहीं होती', 'Yes, if he enjoys chess': 'हाँ, यदि उसे शतरंज पसंद है',
  'The gym has good equipment': 'जिम में अच्छे उपकरण हैं', 'Members paid a membership fee': 'सदस्यों ने सदस्यता शुल्क दिया', 'A control group that did NOT follow the program lost significantly less weight in the same period': 'जिस नियंत्रण समूह ने कार्यक्रम का पालन नहीं किया, उसका उसी अवधि में काफ़ी कम वज़न घटा',
  // weaken-argument options (20-39)
  'Many residents enjoy the park': 'कई निवासियों को पार्क पसंद है', 'The park cost a lot to build': 'पार्क बनाने में बहुत खर्च हुआ', 'The park is open every day': 'पार्क रोज़ खुला रहता है', 'Crime also fell in nearby areas that have no park': 'आसपास के उन इलाकों में भी अपराध घटा जहाँ कोई पार्क नहीं है',
  'Exams are held in the morning': 'परीक्षाएँ सुबह होती हैं', 'Breakfast is a popular meal': 'नाश्ता एक लोकप्रिय भोजन है', 'Schools have kitchens': 'विद्यालयों में रसोई होती है', 'Students who eat breakfast also sleep longer and study more': 'जो छात्र नाश्ता करते हैं वे अधिक सोते और अधिक पढ़ते भी हैं',
  'Customers liked the colour of the ad': 'ग्राहकों को विज्ञापन का रंग पसंद आया', 'The ad was shown on television': 'विज्ञापन टेलीविज़न पर दिखाया गया', 'The company sells many products': 'कंपनी कई उत्पाद बेचती है', 'Competitors raised their prices during the same period': 'उसी अवधि में प्रतिस्पर्धियों ने अपनी कीमतें बढ़ा दीं',
  "This year's exam was much easier than last year's": 'इस वर्ष की परीक्षा पिछले वर्ष की तुलना में बहुत आसान थी', 'Teachers attended a workshop': 'शिक्षकों ने एक कार्यशाला में भाग लिया', 'Class 8 has 30 students': 'कक्षा 8 में 30 छात्र हैं', 'The method uses charts': 'इस पद्धति में चार्ट का उपयोग होता है',
  'It was launched in March': 'इसे मार्च में लॉन्च किया गया था', 'Customers were surveyed': 'ग्राहकों का सर्वे किया गया', 'Our software has many features': 'हमारे सॉफ़्टवेयर में कई सुविधाएँ हैं', "Other rivals' software is also performing well": 'अन्य प्रतिस्पर्धियों के सॉफ़्टवेयर भी अच्छा प्रदर्शन कर रहे हैं',
  'Shops now sell fewer ice creams each on average than before': 'दुकानें अब औसतन हर एक पहले से कम आइसक्रीम बेचती हैं', 'The shops are painted bright colours': 'दुकानों को चटकीले रंगों से रंगा गया है', 'The city is large': 'शहर बड़ा है', 'Ice cream is sweet': 'आइसक्रीम मीठी होती है',
  'The restaurant opened on a Monday': 'रेस्तराँ सोमवार को खुला था', 'Mohan has eaten there many times with no problems': 'मोहन वहाँ कई बार खा चुका है और कभी कोई समस्या नहीं हुई', 'Mohan is 40 years old': 'मोहन 40 वर्ष का है', 'The restaurant has a blue sign': 'रेस्तराँ का साइनबोर्ड नीला है',
  'Entrepreneurship is hard work': 'उद्यमिता कड़ी मेहनत का काम है', 'Early waking is a common phrase': 'जल्दी उठना एक आम मुहावरा है', 'Many successful entrepreneurs also wake up late': 'कई सफल उद्यमी देर से भी उठते हैं', 'Some people wake up at noon': 'कुछ लोग दोपहर में उठते हैं',
  'The books have bright covers': 'किताबों के आवरण चटकीले हैं', 'The library is on the second floor': 'पुस्तकालय दूसरी मंज़िल पर है', 'The books cost Rs. 500': 'किताबों की कीमत ₹500 थी', 'Last year students borrowed no books even when the library had many': 'पिछले वर्ष पुस्तकालय में बहुत किताबें होने पर भी छात्रों ने कोई किताब नहीं ली',
  "Last year's rains were followed by pests that destroyed the crops": 'पिछले वर्ष की बारिश के बाद कीट आए जिन्होंने फ़सलें नष्ट कर दीं', 'Farmers are busy in summer': 'किसान गर्मियों में व्यस्त रहते हैं', 'The farm is large': 'खेत बड़ा है', 'Crops need sunlight as well as rain': 'फ़सलों को बारिश के साथ धूप भी चाहिए',
  'The road is well lit': 'सड़क पर अच्छी रोशनी है', 'Traffic also fell on the old road, for reasons unrelated to the new road': 'पुरानी सड़क पर भी ट्रैफ़िक घटा, ऐसे कारणों से जिनका नई सड़क से कोई संबंध नहीं', 'The road has three lanes': 'सड़क में तीन लेन हैं', 'Roads are important for towns': 'कस्बों के लिए सड़कें महत्वपूर्ण होती हैं',
  'The coach has a long career': 'कोच का लंबा करियर है', 'Training happens in the morning': 'प्रशिक्षण सुबह होता है', 'Players enjoy the sport': 'खिलाड़ियों को यह खेल पसंद है', 'The coach trained players who were already the best winners': 'कोच ने उन खिलाड़ियों को प्रशिक्षित किया जो पहले से ही सबसे अच्छे विजेता थे',
  'The app icon is green': 'ऐप का आइकन हरा है', 'Many downloads were free and most users stopped after one day': 'कई डाउनलोड मुफ़्त थे और अधिकतर उपयोगकर्ताओं ने एक दिन बाद इस्तेमाल बंद कर दिया', 'The app is available in Hindi': 'ऐप हिंदी में उपलब्ध है', 'Downloads started in June': 'डाउनलोड जून में शुरू हुए',
  'Rahul is tall': 'राहुल लंबा है', 'Rahul once told a lie to his teacher about homework': 'राहुल ने एक बार गृहकार्य के बारे में अपने शिक्षक से झूठ बोला था', 'Honest people are rare': 'ईमानदार लोग दुर्लभ होते हैं', 'Rahul lives nearby': 'राहुल पास में रहता है',
  'Bottled water comes in plastic bottles': 'बोतलबंद पानी प्लास्टिक की बोतलों में आता है', 'Water is essential for health': 'स्वास्थ्य के लिए पानी ज़रूरी है', 'Tap water in the city is tested every day and meets safety standards': 'शहर के नल के पानी की रोज़ जाँच होती है और वह सुरक्षा मानकों पर खरा उतरता है', 'Bottles are expensive': 'बोतलें महँगी होती हैं',
  'The whole industry also doubled its profits in the same period': 'उसी अवधि में पूरे उद्योग का लाभ भी दोगुना हुआ', 'The company has 500 staff': 'कंपनी में 500 कर्मचारी हैं', 'The new CEO is 45 years old': 'नया सीईओ 45 वर्ष का है', 'The CEO has an MBA': 'सीईओ के पास एमबीए की डिग्री है',
  'Many children own tablets': 'कई बच्चों के पास टैबलेट हैं', 'Schools have computer labs': 'विद्यालयों में कंप्यूटर प्रयोगशालाएँ हैं', 'Children who struggle at school may play more games to escape pressure': 'जो बच्चे स्कूल में संघर्ष करते हैं वे दबाव से बचने के लिए अधिक गेम खेल सकते हैं', 'Video games have good graphics': 'वीडियो गेम में अच्छे ग्राफ़िक्स होते हैं',
  'The festival has live music': 'उत्सव में लाइव संगीत होता है', 'The town is on a river': 'कस्बा नदी के किनारे है', 'Most visitors come for one day and spend very little': 'अधिकतर आगंतुक एक दिन के लिए आते हैं और बहुत कम खर्च करते हैं', 'The hotels are clean': 'होटल साफ़-सुथरे हैं',
  'Roads are made of asphalt': 'सड़कें डामर से बनी होती हैं', 'Officials travel by car': 'अधिकारी कार से यात्रा करते हैं', 'The economy grew at the same rate in regions where no road was built': 'जिन क्षेत्रों में कोई सड़क नहीं बनी, वहाँ भी अर्थव्यवस्था उसी दर से बढ़ी', 'The budget was announced in February': 'बजट फ़रवरी में घोषित हुआ था',
  'Solar panels are blue': 'सोलर पैनल नीले होते हैं', 'That village is unusually sunny, unlike most places': 'वह गाँव असामान्य रूप से धूप वाला है, अधिकतर जगहों के विपरीत', 'Villages need electricity': 'गाँवों को बिजली की ज़रूरत है', 'The panels were installed in May': 'पैनल मई में लगाए गए थे',
};
const crOpt = (o) => CR_OPT[o] || o;
const CR_ARG = {
  'The new park opened last year, and crime in the area has fallen since then. So the park reduced crime.': 'पार्क पिछले वर्ष खुला, और तब से इलाके में अपराध घटा है। इसलिए पार्क ने अपराध घटाया।',
  'Students who eat breakfast score higher in exams, so schools should serve breakfast to raise scores.': 'जो छात्र नाश्ता करते हैं वे परीक्षाओं में अधिक अंक पाते हैं, इसलिए विद्यालयों को अंक बढ़ाने के लिए नाश्ता परोसना चाहिए।',
  'Sales rose after our ad campaign, so the campaign caused the rise.': 'हमारे विज्ञापन अभियान के बाद बिक्री बढ़ी, इसलिए अभियान ही इस वृद्धि का कारण था।',
  'All students in Class 8 passed this year, so the new teaching method works.': 'इस वर्ष कक्षा 8 के सभी छात्र पास हुए, इसलिए नई शिक्षण पद्धति कारगर है।',
  "Our rival's software failed last month, so our software is now the best on the market.": 'हमारे प्रतिस्पर्धी का सॉफ़्टवेयर पिछले महीने विफल रहा, इसलिए अब हमारा सॉफ़्टवेयर बाज़ार में सबसे अच्छा है।',
  'The city now has more ice cream shops, so ice cream sales are higher than ever.': 'शहर में अब आइसक्रीम की दुकानें अधिक हैं, इसलिए आइसक्रीम की बिक्री पहले से कहीं अधिक है।',
  "Mohan got sick after eating at the new restaurant, so the restaurant's food is unsafe.": 'नए रेस्तराँ में खाना खाने के बाद मोहन बीमार पड़ गया, इसलिए रेस्तराँ का खाना असुरक्षित है।',
  'Most successful entrepreneurs wake up early, so waking early will make you successful.': 'अधिकतर सफल उद्यमी जल्दी उठते हैं, इसलिए जल्दी उठने से आप सफल बनेंगे।',
  'The school library bought new books, so students will read more this year.': 'विद्यालय के पुस्तकालय ने नई किताबें खरीदीं, इसलिए इस वर्ष छात्र अधिक पढ़ेंगे।',
  'Rainfall was high last year, so the crops grew well. We should plant more crops this year.': 'पिछले वर्ष वर्षा अधिक हुई, इसलिए फ़सलें अच्छी उगीं। हमें इस वर्ष अधिक फ़सलें बोनी चाहिए।',
  'The new road reduced traffic, so people prefer the new road.': 'नई सड़क से ट्रैफ़िक घटा, इसलिए लोग नई सड़क को पसंद करते हैं।',
  'Players who train with the new coach win more matches, so the coach is excellent.': 'नए कोच के साथ प्रशिक्षण लेने वाले खिलाड़ी अधिक मैच जीतते हैं, इसलिए कोच उत्कृष्ट है।',
  'Our app has 10 million downloads, so it must be the best learning app.': 'हमारे ऐप के 1 करोड़ डाउनलोड हैं, इसलिए वह सबसे अच्छा सीखने का ऐप होगा।',
  'Honest people never lie, and Rahul never lies, so Rahul is honest.': 'ईमानदार लोग कभी झूठ नहीं बोलते, और राहुल कभी झूठ नहीं बोलता, इसलिए राहुल ईमानदार है।',
  'Bottled water is safer than tap water, so everyone should drink only bottled water.': 'बोतलबंद पानी नल के पानी से अधिक सुरक्षित है, इसलिए सभी को केवल बोतलबंद पानी पीना चाहिए।',
  'Profits doubled after the company hired a new CEO, so the CEO caused the increase.': 'कंपनी द्वारा नया सीईओ नियुक्त करने के बाद लाभ दोगुना हुआ, इसलिए वृद्धि का कारण सीईओ है।',
  'Children who play video games do poorly at school, so video games harm learning.': 'जो बच्चे वीडियो गेम खेलते हैं वे स्कूल में खराब प्रदर्शन करते हैं, इसलिए वीडियो गेम सीखने को नुकसान पहुँचाते हैं।',
  'The festival brought many tourists, so tourism is now the town\'s main source of income.': 'उत्सव ने बहुत से पर्यटकों को आकर्षित किया, इसलिए अब पर्यटन ही कस्बे की आय का मुख्य स्रोत है।',
  'The government spent money on roads, so the economy grew.': 'सरकार ने सड़कों पर पैसा खर्च किया, इसलिए अर्थव्यवस्था बढ़ी।',
  'Solar panels worked well in one village, so we should adopt solar power everywhere.': 'सोलर पैनल एक गाँव में अच्छे से चले, इसलिए हमें हर जगह सौर ऊर्जा अपनानी चाहिए।',
};
const CR_MANUAL = {
  'A survey of 50 self-selected online respondents found 80% prefer Brand A, so 80% of all consumers prefer Brand A. This argument is flawed primarily because:': ['50 स्वयं-चयनित ऑनलाइन उत्तरदाताओं के सर्वे में पाया गया कि 80% ब्रांड A को पसंद करते हैं, इसलिए सभी उपभोक्ताओं में 80% ब्रांड A को पसंद करते हैं। यह तर्क मुख्यतः इसलिए त्रुटिपूर्ण है क्योंकि:', 'स्वयं-चयनित ऑनलाइन उत्तरदाता सभी उपभोक्ताओं का यादृच्छिक, प्रतिनिधि नमूना नहीं होते, इसलिए परिणाम का इस तरह सामान्यीकरण नहीं किया जा सकता।'],
  'A politician claims a new law reduced crime, citing a 10% drop in reported crimes since the law passed. Which statement would most WEAKEN this claim?': ['एक नेता दावा करता है कि नए कानून से अपराध घटा, और वह कानून पास होने के बाद दर्ज अपराधों में 10% की गिरावट का हवाला देता है। कौन-सा कथन इस दावे को सबसे अधिक कमज़ोर करेगा?', 'यदि कम अपराध दर्ज किए जा रहे थे (कम अपराध हुए नहीं), तो आँकड़ों में गिरावट का मतलब यह नहीं कि कानून ने सच में अपराध घटाया।'],
  'All employees who arrived late were denied a bonus. Rahul was denied a bonus. Can we validly conclude Rahul arrived late?': ['जो भी कर्मचारी देर से आए, उन सबको बोनस नहीं मिला। राहुल को बोनस नहीं मिला। क्या हम वैध रूप से निष्कर्ष निकाल सकते हैं कि राहुल देर से आया?', 'नियम केवल यह कहता है कि देर से आने वालों को बोनस नहीं मिलता, यह नहीं कि देर से आना बोनस न मिलने का एकमात्र कारण है — यह उलटे तर्क की एक क्लासिक त्रुटि है।'],
  'Sales rose after the ad campaign, so the campaign caused the rise. Which statement, if true, would most WEAKEN this argument?': ['विज्ञापन अभियान के बाद बिक्री बढ़ी, इसलिए अभियान ही वृद्धि का कारण था। कौन-सा कथन, यदि सत्य हो, इस तर्क को सबसे अधिक कमज़ोर करेगा?', 'कमज़ोर करने वाले कथन को इस धारणा पर प्रहार करना चाहिए कि वृद्धि की और कोई व्याख्या नहीं है; जिस क्षेत्र में कोई अभियान नहीं था वहाँ भी वही वृद्धि होना ठीक यही करता है।'],
  'Since the new fertilizer was used, crop yield increased by 20%, so the fertilizer must be effective. Which assumption does this argument rely on?': ['नई खाद इस्तेमाल करने के बाद फ़सल की उपज 20% बढ़ी, इसलिए खाद अवश्य प्रभावी है। यह तर्क किस धारणा पर निर्भर करता है?', 'तर्क यह मानता है कि परिवर्तन का एकमात्र कारण खाद है; यदि कुछ और भी बदला हो, तो निष्कर्ष नहीं निकलता।'],
  'A study found that people who exercise daily live longer, so exercising daily causes a longer life. Which statement would most WEAKEN this argument?': ['एक अध्ययन में पाया गया कि जो लोग रोज़ व्यायाम करते हैं वे अधिक जीते हैं, इसलिए रोज़ व्यायाम करना लंबी आयु का कारण है। कौन-सा कथन इस तर्क को सबसे अधिक कमज़ोर करेगा?', 'यह उलटे कार्य-कारण का सुझाव देकर कारणात्मक दावे को कमज़ोर करता है: स्वास्थ्य व्यायाम का कारण हो सकता है, उलटा नहीं।'],
  'City X reduced speed limits and traffic accidents dropped 30% the next year, so lower speed limits reduce accidents. Which statement would most STRENGTHEN this argument?': ['शहर X ने गति-सीमा घटाई और अगले वर्ष यातायात दुर्घटनाएँ 30% घटीं, इसलिए कम गति-सीमा दुर्घटनाएँ घटाती है। कौन-सा कथन इस तर्क को सबसे अधिक मज़बूत करेगा?', 'दुर्घटनाओं में गिरावट की अन्य व्याख्याओं को ख़ारिज करना इस दावे को मज़बूत करता है कि कारण विशेष रूप से गति-सीमा में बदलाव ही था।'],
  "A company's profits fell this quarter despite record sales, so the sales team must be underperforming. This argument is flawed because it fails to consider:": ['रिकॉर्ड बिक्री के बावजूद इस तिमाही कंपनी का लाभ घट गया, इसलिए बिक्री टीम अवश्य खराब प्रदर्शन कर रही है। यह तर्क इसलिए त्रुटिपूर्ण है क्योंकि यह इस पर विचार नहीं करता:', 'लाभ राजस्व और लागत दोनों पर निर्भर करता है; रिकॉर्ड बिक्री इस संभावना को ख़ारिज नहीं करती कि लागत और तेज़ी से बढ़ी, जिसे तर्क अनदेखा करता है।'],
  "Every cat I've seen has whiskers, so all cats have whiskers. This argument uses which type of reasoning?": ['मैंने जितनी भी बिल्लियाँ देखी हैं सबके मूँछें हैं, इसलिए सभी बिल्लियों के मूँछें होती हैं। यह तर्क किस प्रकार की तर्कशक्ति का प्रयोग करता है?', 'यह आगमनात्मक तर्क है: विशिष्ट देखे गए मामलों से सामान्य नियम की ओर जाना, जो तार्किक रूप से कभी निश्चित नहीं होता, केवल संभावित होता है।'],
  'If it rains, the match is postponed. It did not rain today. What can be validly concluded?': ['यदि बारिश होती है, तो मैच स्थगित हो जाता है। आज बारिश नहीं हुई। वैध रूप से क्या निष्कर्ष निकाला जा सकता है?', 'नियम केवल यह बताता है कि बारिश होने पर क्या होता है; बारिश न होने पर क्या होता है इस बारे में वह कुछ नहीं कहता, इसलिए "बारिश न होना" दोनों परिणामों की गुंजाइश छोड़ता है।'],
  'If a student studies hard, they pass the exam. Priya passed the exam. Can we validly conclude Priya studied hard?': ['यदि कोई छात्र कड़ी मेहनत से पढ़ता है, तो वह परीक्षा पास कर लेता है। प्रिया परीक्षा में पास हो गई। क्या हम वैध रूप से निष्कर्ष निकाल सकते हैं कि प्रिया ने कड़ी मेहनत से पढ़ाई की?', 'नियम कहता है कि कड़ी मेहनत से पढ़ने पर पास होते हैं, यह नहीं कि पास होने के लिए कड़ी मेहनत ज़रूरी है — वह किसी और तरीके से भी पास हो सकती थी।'],
  'A new vaccine trial showed 95% effectiveness in preventing the disease among 1,000 diverse participants over 6 months. Which statement would most STRENGTHEN confidence in this result?': ['एक नए टीके के परीक्षण में 6 महीनों में 1,000 विविध प्रतिभागियों के बीच बीमारी रोकने में 95% प्रभावशीलता दिखी। कौन-सा कथन इस परिणाम में विश्वास को सबसे अधिक मज़बूत करेगा?', 'स्वतंत्र पुनरावृत्ति यह पुष्टि करने का सबसे मज़बूत तरीका है कि परिणाम उस विशेष परीक्षण के नमूने का संयोग नहीं था।'],
  "A restaurant's online rating dropped after it raised prices, so the price increase caused the rating drop. Which statement would most WEAKEN this argument?": ['कीमतें बढ़ाने के बाद एक रेस्तराँ की ऑनलाइन रेटिंग गिर गई, इसलिए कीमतें बढ़ाना ही रेटिंग गिरने का कारण था। कौन-सा कथन इस तर्क को सबसे अधिक कमज़ोर करेगा?', 'यदि खाने की गुणवत्ता भी गिरी, तो यह कम रेटिंग की एक वैकल्पिक व्याख्या देता है, जो "कीमत ही कारण थी" के दावे को कमज़ोर करता है।'],
  'No fish can survive out of water. A dolphin can survive short periods out of water. What can we validly conclude?': ['कोई भी मछली पानी के बाहर जीवित नहीं रह सकती। डॉल्फ़िन पानी के बाहर थोड़े समय जीवित रह सकती है। हम वैध रूप से क्या निष्कर्ष निकाल सकते हैं?', 'यह वैध निगमन है (मोडस टोलेन्स): यदि कोई भी मछली पानी के बाहर जीवित नहीं रह सकती, और डॉल्फ़िन रह सकती है, तो डॉल्फ़िन मछली नहीं है।'],
  "A company assumes that because 90% of surveyed customers are 'satisfied,' the product needs no improvement. This reasoning is flawed because it overlooks:": ["एक कंपनी मानती है कि चूँकि सर्वे किए गए 90% ग्राहक 'संतुष्ट' हैं, इसलिए उत्पाद में किसी सुधार की ज़रूरत नहीं। यह तर्क इसलिए त्रुटिपूर्ण है क्योंकि यह अनदेखा करता है:", "'संतुष्ट' होना 'प्रसन्न' या 'निष्ठावान' होने के समान नहीं है — और असंतुष्ट 10% को पूरी तरह अनदेखा करने से सुधार के वास्तविक अवसर छूट जाते हैं।"],
  'If the alarm rings, everyone must evacuate. The alarm did not ring. What can be validly concluded?': ['यदि अलार्म बजता है, तो सबको बाहर निकल जाना चाहिए। अलार्म नहीं बजा। वैध रूप से क्या निष्कर्ष निकाला जा सकता है?', 'बारिश/मैच वाले उदाहरण जैसी ही संरचना: नियम केवल यह बताता है कि अलार्म बजने पर क्या होता है, न बजने पर क्या होता है यह नहीं।'],
  "A school claims its teaching method works because students' average scores rose after adopting it. Which statement would most WEAKEN this claim?": ['एक विद्यालय का दावा है कि उसकी शिक्षण पद्धति कारगर है क्योंकि उसे अपनाने के बाद छात्रों के औसत अंक बढ़े। कौन-सा कथन इस दावे को सबसे अधिक कमज़ोर करेगा?', 'यदि परीक्षा स्वयं आसान हो गई, तो बढ़े हुए अंक यह साबित नहीं करते कि शिक्षण पद्धति कारगर थी — एक उलझाने वाली व्याख्या मौजूद है।'],
  "Since Company X's stock price rose after its CEO gave a speech, the speech caused the price rise. Which assumption does this argument require?": ['चूँकि कंपनी X के सीईओ के भाषण के बाद उसके शेयर की कीमत बढ़ी, इसलिए भाषण ही कीमत बढ़ने का कारण था। इस तर्क के लिए कौन-सी धारणा आवश्यक है?', 'तर्क के लिए ज़रूरी है कि भाषण ही एकमात्र प्रासंगिक घटना हो; यदि उस दिन बाज़ार की कोई अन्य ख़बर आई, तो भाषण कारण नहीं भी हो सकता।'],
  'All members of the chess club are good at logic. Ankit is good at logic. Can we validly conclude Ankit is a member of the chess club?': ['शतरंज क्लब के सभी सदस्य तर्क में अच्छे हैं। अंकित तर्क में अच्छा है। क्या हम वैध रूप से निष्कर्ष निकाल सकते हैं कि अंकित शतरंज क्लब का सदस्य है?', 'पहले के बोनस वाले उदाहरण जैसी ही उलटे तर्क की त्रुटि: नियम यह नहीं कहता कि केवल शतरंज क्लब के सदस्य ही तर्क में अच्छे होते हैं।'],
  'A gym claims its new program works because members who completed it lost weight on average. Which statement would most STRENGTHEN this claim?': ['एक जिम का दावा है कि उसका नया कार्यक्रम कारगर है क्योंकि उसे पूरा करने वाले सदस्यों का औसतन वज़न घटा। कौन-सा कथन इस दावे को सबसे अधिक मज़बूत करेगा?', 'नियंत्रण समूह की तुलना इस संभावना को ख़ारिज करती है कि लोगों का वज़न वैसे भी घट जाता, जिससे कारणात्मक दावा मज़बूत होता है।'],
};
export function localizeCriticalReasoning(q) {
  if (q.chapter !== 'critical-reasoning' || typeof q.prompt !== 'string') return q;
  const man = CR_MANUAL[q.prompt];
  if (man) return bi(q, man[0], man[1], crOpt);
  const m = q.prompt.match(/^Which statement, if true, would most WEAKEN the argument: "(.+)"\?$/);
  if (!m || !CR_ARG[m[1]]) return q;
  const e = q.exp.match(/^"(.+)" gives an alternative explanation or a counterexample, which weakens the argument\.$/);
  if (!e || !CR_OPT[e[1]]) return q;
  return bi(q, `कौन-सा कथन, यदि सत्य हो, इस तर्क को सबसे अधिक कमज़ोर करेगा: "${CR_ARG[m[1]]}"?`, `"${CR_OPT[e[1]]}" एक वैकल्पिक व्याख्या या प्रतिउदाहरण देता है, जो तर्क को कमज़ोर करता है।`, crOpt);
}

// ── Data Sufficiency ──
const DS_OPT = {
  'Statement 1 ALONE is sufficient, Statement 2 is not': 'कथन 1 अकेला पर्याप्त है, कथन 2 नहीं',
  'Statement 2 ALONE is sufficient, Statement 1 is not': 'कथन 2 अकेला पर्याप्त है, कथन 1 नहीं',
  'Each statement ALONE is sufficient': 'प्रत्येक कथन अकेला पर्याप्त है',
  'BOTH statements together are needed (neither alone is enough)': 'दोनों कथन साथ-साथ चाहिए (अकेला कोई भी पर्याप्त नहीं)',
  'NOT sufficient, even using both statements together': 'दोनों कथनों को साथ मिलाकर भी पर्याप्त नहीं',
};
const dsOpt = (o) => DS_OPT[o] || o;
const DS_Q = {
  'Is a > b?': 'क्या a > b है?', 'Is x = 10?': 'क्या x = 10 है?', 'Is x even?': 'क्या x सम है?', 'What is the remainder when x is divided by 5?': 'x को 5 से भाग देने पर शेषफल क्या है?',
  'Is x^2 greater than 25?': 'क्या x² , 25 से बड़ा है?', 'Is n a multiple of 4?': 'क्या n, 4 का गुणज है?', 'Is x between 10 and 20?': 'क्या x, 10 और 20 के बीच है?',
  'Is x^3 negative?': 'क्या x³ ऋणात्मक है?', 'What is the value of x?': 'x का मान क्या है?', 'Is n divisible by 6?': 'क्या n, 6 से विभाज्य है?',
  'Is x positive?': 'क्या x धनात्मक है?', 'Is x negative?': 'क्या x ऋणात्मक है?', 'Is y an integer greater than 20?': 'क्या y, 20 से बड़ा पूर्णांक है?',
  'Is x divisible by 3?': 'क्या x, 3 से विभाज्य है?', 'Is xy > 0?': 'क्या xy > 0 है?', 'Is x an odd number?': 'क्या x एक विषम संख्या है?',
  'Is x a prime number?': 'क्या x एक अभाज्य संख्या है?', 'Is |x| < 5?': 'क्या |x| < 5 है?', 'Is x a multiple of both 2 and 3?': 'क्या x, 2 और 3 दोनों का गुणज है?',
};
const DS_S = {
  'x squared is even': 'x का वर्ग सम है', 'x is divisible by 4': 'x, 4 से विभाज्य है', 'x is odd': 'x विषम है', 'x is an integer greater than 5': 'x, 5 से बड़ा पूर्णांक है',
  'x is a multiple of 3': 'x, 3 का गुणज है', 'n is a multiple of 8': 'n, 8 का गुणज है', 'n is even': 'n सम है', 'x is negative': 'x ऋणात्मक है',
  'x^2 is positive': 'x² धनात्मक है', 'x squared = 16': 'x का वर्ग = 16', 'n is divisible by 2 and by 3': 'n, 2 और 3 दोनों से विभाज्य है',
  'n is divisible by 12': 'n, 12 से विभाज्य है', 'x cubed > 0': 'x का घन > 0', 'the absolute value of x equals x': 'x का निरपेक्ष मान x के बराबर है',
  'x is a multiple of 5': 'x, 5 का गुणज है', 'x is a multiple of 5 and x < 15 and x > 5': 'x, 5 का गुणज है और x < 15 तथा x > 5', 'x squared > 100': 'x का वर्ग > 100',
  'y is a multiple of 11 and y < 30': 'y, 11 का गुणज है और y < 30', 'the digit sum of x is 9': 'x के अंकों का योग 9 है', 'x is divisible by 9': 'x, 9 से विभाज्य है',
  'x + 1 is even': 'x + 1 सम है', 'x is divisible by 3': 'x, 3 से विभाज्य है', 'x is greater than 1 and less than 4': 'x, 1 से बड़ा और 4 से छोटा है', 'x is even': 'x सम है',
  'x is a multiple of 6': 'x, 6 का गुणज है', 'x is a multiple of 12': 'x, 12 का गुणज है',
};
const dsPart = (s) => DS_S[s] || s;
export function localizeDataSufficiency(q) {
  if (q.chapter !== 'data-sufficiency' || typeof q.prompt !== 'string') return q;
  const m = q.prompt.match(/^(.+?\?) \(1\) (.+?) +\(2\) (.+?)(?: +\(x is an integer\))?$/);
  if (!m) return q;
  const isInt = / \(x is an integer\)$/.test(q.prompt);
  let qn = DS_Q[m[1]];
  const g = m[1].match(/^Is x > (\d+)\?$/);
  if (!qn && g) qn = `क्या x > ${g[1]} है?`;
  if (!qn) return q;
  const hi = `${qn} (1) ${dsPart(m[2])} (2) ${dsPart(m[3])}${isInt ? ' (x एक पूर्णांक है)' : ''}`;
  let exp; let e;
  if ((e = q.exp.match(/^Testing statement 1 alone: (not sufficient|sufficient)\. Testing statement 2 alone: (not sufficient|sufficient)\.$/))) {
    exp = `कथन 1 को अकेले परखने पर: ${e[1] === 'sufficient' ? 'पर्याप्त' : 'पर्याप्त नहीं'}। कथन 2 को अकेले परखने पर: ${e[2] === 'sufficient' ? 'पर्याप्त' : 'पर्याप्त नहीं'}।`;
  } else if ((e = q.exp.match(/^Statement 1 alone (settles|does not settle) the question\. Statement 2 alone (settles|does not settle) the question\.$/))) {
    exp = `कथन 1 अकेला प्रश्न ${e[1] === 'settles' ? 'हल कर देता है' : 'हल नहीं करता'}। कथन 2 अकेला प्रश्न ${e[2] === 'settles' ? 'हल कर देता है' : 'हल नहीं करता'}।`;
  } else if (/^Stmt1 alone: sufficient\. Stmt2 alone: sufficient \(b\+5 > b always\)\.$/.test(q.exp)) {
    exp = 'कथन 1 अकेला: पर्याप्त। कथन 2 अकेला: पर्याप्त (b+5 > b हमेशा)।';
  } else if (/^Stmt1 alone: not sufficient/.test(q.exp)) {
    exp = 'कथन 1 अकेला: पर्याप्त नहीं (y का चिह्न अभी भी अज्ञात है)। कथन 2 अकेला: पर्याप्त नहीं। दोनों साथ: x>0 और y>0 का अर्थ है xy>0 हमेशा।';
  }
  if (!exp) return q;
  return bi(q, hi, exp, dsOpt);
}

export const APT_LOCALIZERS = [localizeWordMeanings, localizeShapePatterns, localizeReasoningConnect, localizePercentage, localizeSpeedMaths, localizeVerbalClassification, localizeNumberPuzzles, localizeCubeNets, localizeRotatingShapes, localizeDataInterpretation, localizeAdvancedDI, localize3dSpatial, localizeReasoningConnectSecondary, localizeVerbalReasoning, localizeCriticalReasoning, localizeDataSufficiency, localizePrek];
