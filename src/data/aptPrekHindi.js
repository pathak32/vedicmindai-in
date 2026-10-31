// Hindi for the five Pre-K Aptitude chapters. Answers keep their English key.
// Words the Hindi cannot cover are left in English, and the coverage check in the review
// script lists them.

const W = {
  apple: 'सेब', banana: 'केला', orange: 'संतरा', carrot: 'गाजर', tomato: 'टमाटर', potato: 'आलू', dog: 'कुत्ता', cat: 'बिल्ली',
  rabbit: 'खरगोश', elephant: 'हाथी', ant: 'चींटी', owl: 'उल्लू', pig: 'सूअर', frog: 'मेंढक', penguin: 'पेंगुइन', zebra: 'ज़ेबरा',
  turtle: 'कछुआ', pear: 'नाशपाती', horse: 'घोड़ा', giraffe: 'जिराफ़', tiger: 'बाघ', mango: 'आम', monkey: 'बंदर', bear: 'भालू',
  watermelon: 'तरबूज़', duck: 'बत्तख', pineapple: 'अनानास', butterfly: 'तितली', lion: 'शेर', snake: 'साँप', bee: 'मधुमक्खी',
  fish: 'मछली', bird: 'चिड़िया', cow: 'गाय', star: 'तारा', moon: 'चाँद', sun: 'सूरज', strawberry: 'स्ट्रॉबेरी', grapes: 'अंगूर',
  mouse: 'चूहा', whale: 'व्हेल', ladybird: 'लेडीबग', 'toy car': 'खिलौना कार', bicycle: 'साइकिल', bus: 'बस', car: 'कार',
  train: 'रेलगाड़ी', corn: 'मक्का', ship: 'जहाज़', helicopter: 'हेलीकॉप्टर', tree: 'पेड़', flower: 'फूल', plant: 'पौधा',
  red: 'लाल', blue: 'नीला', green: 'हरा', house: 'घर', school: 'स्कूल', hospital: 'अस्पताल', balloon: 'गुब्बारा', ball: 'गेंद',
  'teddy bear': 'टेडी बियर', pizza: 'पिज़्ज़ा', milk: 'दूध', juice: 'जूस', bread: 'ब्रेड', notebook: 'कॉपी', cake: 'केक',
  cookie: 'बिस्किट', donut: 'डोनट', ice: 'बर्फ़', water: 'पानी', sea: 'समुद्र', fire: 'आग', tulip: 'ट्यूलिप', shirt: 'कमीज़',
  trousers: 'पतलून', socks: 'मोज़े', pan: 'कड़ाही', sprout: 'अंकुर', door: 'दरवाज़ा', earth: 'पृथ्वी', coconut: 'नारियल',
  egg: 'अंडा', pumpkin: 'कद्दू', eagle: 'बाज़', cherry: 'चेरी',
};
const FEM = new Set(['ant', 'strawberry', 'whale', 'cow', 'cat', 'bicycle', 'bus', 'car', 'fish', 'earth', 'cherry']);
const PLURAL = {
  oranges: ['संतरे', false], grapes: ['अंगूर', false], carrots: ['गाजरें', true], apples: ['सेब', false], bananas: ['केले', false],
  strawberries: ['स्ट्रॉबेरी', true], dogs: ['कुत्ते', false], cats: ['बिल्लियाँ', true], fish: ['मछलियाँ', true], stars: ['तारे', false],
};
const wh = (s) => W[String(s).trim().toLowerCase()] || s;
// Option or name that may start with an emoji: "🦉 Owl" -> "🦉 उल्लू".
const hiOpt = (o) => {
  const m = String(o).match(/^(\S+)\s+(.+)$/);
  if (m && !/^[A-Za-z]/.test(m[1])) return `${m[1]} ${wh(m[2])}`;
  return wh(o);
};
const list = (s) => s.split(/,\s*(?:and\s+)?|\s+and\s+/).map((x) => wh(x.replace(/^(the|a|an)\s+/i, ''))).join(', ');

const bi = (q, hi, exp) => ({
  ...q,
  prompt: { en: q.prompt, hi },
  options: q.options.map((o) => (typeof o === 'string' ? { en: o, hi: hiOpt(o) } : { ...o, en: o.label ?? o.en, hi: hiOpt(o.label ?? o.en) })),
  exp: { en: q.exp, hi: exp },
});

const CAT = { fruits: 'फल', vegetables: 'सब्ज़ियाँ', animals: 'जानवर', vehicles: 'वाहन', colours: 'रंग', toys: 'खिलौने', insects: 'कीड़े', clothes: 'कपड़े', buildings: 'इमारतें' };
const ONE = { fruit: 'फल', vegetable: 'सब्ज़ी', animal: 'जानवर', flower: 'फूल' };
const WDB_MANUAL = {
  'Tree, Flower and Plant grow in the ground. The car does not.': 'पेड़, फूल और पौधा ज़मीन में उगते हैं। कार नहीं उगती।',
  'Sun, Moon and Star are in the sky. The banana is a fruit.': 'सूरज, चाँद और तारा आसमान में होते हैं। केला एक फल है।',
  'Milk, Juice and Bread are food and drink. A notebook is for writing.': 'दूध, जूस और ब्रेड खाने-पीने की चीज़ें हैं। कॉपी लिखने के लिए होती है।',
  'Balloon, Ball and Teddy Bear are toys. Pizza is food.': 'गुब्बारा, गेंद और टेडी बियर खिलौने हैं। पिज़्ज़ा खाने की चीज़ है।',
  'Cake, Cookie and Donut are sweet food. The cow is an animal.': 'केक, बिस्किट और डोनट मीठी चीज़ें हैं। गाय एक जानवर है।',
  'Train, Ship and Helicopter travel. The watermelon is a fruit.': 'रेलगाड़ी, जहाज़ और हेलीकॉप्टर सफ़र कराते हैं। तरबूज़ एक फल है।',
  'Shirt, Trousers and Socks are clothes. A pan is for cooking.': 'कमीज़, पतलून और मोज़े कपड़े हैं। कड़ाही खाना पकाने के लिए होती है।',
  'Ice, Water and Sea are all water. Fire is not.': 'बर्फ़, पानी और समुद्र सब पानी हैं। आग पानी नहीं है।',
  'House, School and Hospital are buildings. The dog is an animal.': 'घर, स्कूल और अस्पताल इमारतें हैं। कुत्ता एक जानवर है।',
};

function expDoesNotBelong(e) {
  if (WDB_MANUAL[e]) return WDB_MANUAL[e];
  let m;
  if ((m = e.match(/^(.+) are not in the same group as (.+)\.$/))) return `${list(m[1])} का समूह ${list(m[2])} से अलग है।`;
  if ((m = e.match(/^(.+?) are (fruits|vegetables|animals|vehicles|colours|toys|insects|clothes|buildings)\. (?:The )?(.+?) is (not )?(?:a |an )?(fruit|vegetable|animal|flower)\.$/))) {
    return `${list(m[1])} ${CAT[m[2]]} हैं। ${wh(m[3])} ${ONE[m[5]]} ${m[4] ? 'नहीं ' : ''}है।`;
  }
  if ((m = e.match(/^(.+?) are (fruits|vegetables|animals|vehicles|colours|toys|insects|clothes|buildings)\. (?:The )?(.+?) is not a fruit\.$/))) return `${list(m[1])} ${CAT[m[2]]} हैं। ${wh(m[3])} फल नहीं है।`;
  if ((m = e.match(/^(.+?) are (fruits|vegetables|animals|vehicles|colours|toys|insects|clothes|buildings)\. (?:The )?(.+?) is a (fruit|vegetable|animal|flower)\.$/))) return `${list(m[1])} ${CAT[m[2]]} हैं। ${wh(m[3])} ${ONE[m[4]]} है।`;
  if ((m = e.match(/^(.+?) are (fruits|vegetables|animals|vehicles|colours|toys|insects|clothes|buildings)\. (?:The )?(.+?) is an (animal)\.$/))) return `${list(m[1])} ${CAT[m[2]]} हैं। ${wh(m[3])} ${ONE[m[4]]} है।`;
  return null;
}

export function localizePrek(q) {
  if (typeof q.prompt !== 'string') return q;
  let m; let e;
  switch (q.chapter) {
    case 'match-the-picture': {
      if (!(m = q.prompt.match(/^Which (picture|one) matches the (.+)\?$/))) return q;
      const hi = m[1] === 'picture' ? `कौन-सी तस्वीर ${wh(m[2])} से मेल खाती है?` : `कौन-सा ${wh(m[2])} से मेल खाता है?`;
      if ((e = q.exp.match(/^The (.+?) picture matches the (.+)\.$/))) return bi(q, hi, `${wh(e[1])} की तस्वीर ${wh(e[2])} से मेल खाती है।`);
      if ((e = q.exp.match(/^The (.+?) matches the (.+)\.$/))) return bi(q, hi, `${wh(e[1])}, ${wh(e[2])} से मेल खाता है।`);
      return q;
    }
    case 'what-doesnt-belong': {
      if (q.prompt !== 'Which one does not belong?') return q;
      const hi = expDoesNotBelong(q.exp);
      return hi ? bi(q, 'कौन-सा समूह में नहीं जुड़ता?', hi) : q;
    }
    case 'count-the-objects': {
      let hi;
      if ((m = q.prompt.match(/^How many (\w+) are there\?(.*)$/)) && PLURAL[m[1].toLowerCase()]) {
        const [w, f] = PLURAL[m[1].toLowerCase()];
        hi = `${f ? 'कितनी' : 'कितने'} ${w} हैं?${m[2]}`;
      } else if ((m = q.prompt.match(/^How many are there\?(.*)$/))) hi = `कुल कितने हैं?${m[1]}`;
      else return q;
      if (!(e = q.exp.match(/^Counting one by one: there are (\d+)\.$/))) return q;
      return bi(q, hi, `एक-एक करके गिनने पर: कुल ${e[1]} हैं।`);
    }
    case 'big-or-small': {
      const big = /BIGGER/.test(q.prompt);
      if (!/^Which one is (BIGGER|SMALLER)\?$/.test(q.prompt)) return q;
      if (!(e = q.exp.match(/^(?:(?:An?|The)\s+)?(.+?) (?:is|are) (much )?(bigger|smaller) than (?:(?:an?|the)\s+)?(.+)\.$/i))) return q;
      const x = e[1].toLowerCase();
      const word = e[3] === 'bigger' ? (FEM.has(x) ? 'बड़ी' : 'बड़ा') : (FEM.has(x) ? 'छोटी' : 'छोटा');
      const plural = x === 'grapes' ? (e[3] === 'bigger' ? 'बड़े' : 'छोटे') : word;
      return bi(q, big ? 'कौन-सा बड़ा है?' : 'कौन-सा छोटा है?', `${wh(x)}, ${wh(e[4])} से ${e[2] ? 'बहुत ' : ''}${plural} है${x === 'grapes' ? 'ं' : ''}।`);
    }
    case 'what-comes-next': {
      let hi;
      if (q.prompt === 'What comes next in the picture pattern?') hi = 'तस्वीर वाले पैटर्न में आगे क्या आएगा?';
      else if ((m = q.prompt.match(/^What comes next in the pattern\? (.*)$/))) hi = `पैटर्न में आगे क्या आएगा? ${m[1]}`;
      else return q;
      if ((e = q.exp.match(/^(.+?)\.\.\. the pattern repeats every (\d+) items\. Next comes (.+)\.$/))) {
        return bi(q, hi, `${e[1].split(', ').map(wh).join(', ')}... पैटर्न हर ${e[2]} चीज़ों के बाद दोहराता है। आगे ${hiOpt(e[3])} आता है।`);
      }
      if ((e = q.exp.match(/^The pattern repeats every (\d+) items( \(two of each\))?\. Next comes (.+)\.$/))) {
        return bi(q, hi, `पैटर्न हर ${e[1]} चीज़ों${e[2] ? ' (दो-दो)' : ''} के बाद दोहराता है। आगे ${hiOpt(e[3])} आता है।`);
      }
      return q;
    }
    default: return q;
  }
}
