// Hindi for the Vedic Maths explanations. Most are arithmetic with a few connecting words, so
// the maths stays as written and the English phrases around it are replaced.
import { DAYS_HI } from './vedicHindi.js';

const D = '(\\d+)';
const REORDER = [
  [new RegExp(`Digit sum of ${D} reduces to ${D}`, 'g'), '$1 का अंकयोग घटकर $2 हो जाता है'],
  [new RegExp(`Check: digital roots of ${D} and ${D} are ${D} and ${D}, and ${D} × ${D} reduces to ${D}`, 'g'), 'जाँच: $1 और $2 के डिजिटल रूट $3 और $4 हैं, और $5 × $6 घटकर $7 होता है'],
  [new RegExp(`so √${D} lies between ${D} and ${D}\\. Value: ${D}`, 'g'), 'इसलिए √$1, $2 और $3 के बीच है। मान: $4'],
  [new RegExp(`so the remainder is ${D}`, 'g'), 'इसलिए शेषफल $1 है'],
  [new RegExp(`so the cube root is ${D}`, 'g'), 'इसलिए घनमूल $1 है'],
  [new RegExp(`Last digit check: ${D}³ ends in ${D}, matching the last digit ${D} of ${D}`, 'g'), 'अंतिम अंक की जाँच: $1³ का अंतिम अंक $2 है, जो $4 के अंतिम अंक $3 से मेल खाता है'],
  [new RegExp(`Remainder method: the digits of (\\d+/\\d+) repeat every ${D} places as ([\\d.]+), so digit ${D} is ${D}`, 'g'), 'शेषफल विधि: $1 के अंक हर $2 स्थान पर $3 के रूप में दोहराते हैं, इसलिए अंक $4, $5 है'],
  [new RegExp(`${D} is ${D} below ${D}`, 'g'), '$1, $3 से $2 कम है'],
  [new RegExp(`${D} is ${D} above ${D}`, 'g'), '$1, $3 से $2 अधिक है'],
  [new RegExp(`Same tens digit ${D}, and units ${D} \\+ ${D} = ${D}`, 'g'), 'दहाई का अंक वही है ($1), और इकाइयाँ $2 + $3 = $4'],
  [new RegExp(`Same tens \\(${D}\\), ${D}\\+${D}=${D}`, 'g'), 'दहाई वही है ($1), $2+$3=$4'],
  [new RegExp(`both scaled by ${D}\\. So`, 'g'), 'दोनों को $1 से गुणा किया गया। इसलिए'],
  [new RegExp(`Write ${D}, then`, 'g'), '$1 लिखें, फिर'],
  [new RegExp(`Carry the ${D} into the first digit`, 'g'), '$1 को पहले अंक में हासिल जोड़ें'],
  [new RegExp(`and its ${D}(?:st|nd|rd|th) digit is ${D}`, 'g'), 'और उसका $1वाँ अंक $2 है'],
  [new RegExp(`so digit ${D} is ${D}`, 'g'), 'इसलिए अंक $1, $2 है'],
  [new RegExp(`so the first digit is ${D}`, 'g'), 'इसलिए पहला अंक $1 है'],
  [new RegExp(`The day-of-the-week calculation gives (\\w+), checked against the standard calendar`, 'g'), (m, d) => `सप्ताह-दिवस की गणना से ${DAYS_HI[d] || d} मिलता है, जिसे मानक कैलेंडर से मिलाकर जाँचा गया`],
  [new RegExp(`Long division of ${D} by ${D} returns to remainder ${D} after ${D} digits`, 'g'), '$1 को $2 से लंबी भाग विधि से भाग देने पर $4 अंकों के बाद शेषफल फिर $3 आ जाता है'],
  [new RegExp(`${D} repeats every ${D} digits`, 'g'), '$1 हर $2 अंकों पर दोहराता है'],
  [new RegExp(`Factors of ${D} that add to ${D}: ${D} and ${D}`, 'g'), '$1 के गुणनखंड जिनका योग $2 है: $3 और $4'],
  [new RegExp(`Find two numbers that add to ${D} and multiply to ${D}: ${D} and ${D}`, 'g'), 'ऐसी दो संख्याएँ ढूँढें जिनका योग $1 और गुणनफल $2 हो: $3 और $4'],
  [new RegExp(`Expand to check: (.+?) gives`, 'g'), 'जाँचने के लिए प्रसार: $1 से मिलता है'],
  [new RegExp(`Last digit ${D} → cube root ends in ${D}`, 'g'), 'अंतिम अंक $1 → घनमूल $2 पर समाप्त होता है'],
  [new RegExp(`Last digit ${D} → ends in ${D} or ${D}`, 'g'), 'अंतिम अंक $1 → $2 या $3 पर समाप्त होता है'],
  [new RegExp(`Last digit ${D} → ends in ${D}`, 'g'), 'अंतिम अंक $1 → $2 पर समाप्त होता है'],
  [new RegExp(`Last digit ${D} → root ends in ${D}`, 'g'), 'अंतिम अंक $1 → मूल $2 पर समाप्त होता है'],
  [new RegExp(`Last digit ${D} → root ends ${D}`, 'g'), 'अंतिम अंक $1 → मूल $2 पर समाप्त'],
  [new RegExp(`Remove last ${D}: `, 'g'), 'अंतिम $1 अंक हटाएँ: '],
];
const PHRASES = [
  ['Four terms:', 'चार पद:'], ['Combine with carries:', 'हासिल के साथ जोड़ने पर:'], ['Combine with place values:', 'स्थानीय मान के साथ जोड़ने पर:'],
  ['Duplex (column) sums from the right:', 'दायें से डुप्लेक्स (स्तंभ) योग:'], ['Column sums from the right:', 'दायें से स्तंभ-योग:'],
  ['Carrying from the right gives', 'दायें से हासिल लेने पर'], ['Carrying gives', 'हासिल लेने पर'],
  ['Units:', 'इकाई:'], ['Cross:', 'तिर्यक:'], ['Tens:', 'दहाई:'], ['Hundreds:', 'सैकड़ा:'], ['Thousands:', 'हज़ार:'], ['Ten-thousands:', 'दस-हज़ार:'],
  ['Deficits from', 'न्यूनताएँ आधार'], ['Deficiencies', 'न्यूनताएँ'], ['Deficiency', 'न्यूनता'], ['Deficits:', 'न्यूनताएँ:'], ['Deficit product:', 'न्यूनताओं का गुणनफल:'],
  ['Complements from', 'पूरक आधार'], ['Product of complements:', 'पूरकों का गुणनफल:'], ['Surplus', 'अधिकता'],
  ['Answer:', 'उत्तर:'], ['Product:', 'गुणनफल:'], ['Sum:', 'योग:'], ['Check:', 'जाँच:'], ['Value:', 'मान:'],
  ['Ekadhikena Purvena:', 'एकाधिकेन पूर्वेण:'], [', then append', ', फिर जोड़ें'], ['then append', 'फिर जोड़ें'], [', then ÷', ', फिर ÷'],
  ['Add the denominators:', 'हरों को जोड़ें:'], ['Add denominators:', 'हरों को जोड़ें:'], ['Add:', 'जोड़ें:'], ['Subtract:', 'घटाएँ:'], ['Subtract equations:', 'समीकरणों को घटाएँ:'], ['Add both equations:', 'दोनों समीकरणों को जोड़ें:'],
  ['Numerator:', 'अंश:'], ['Denominator:', 'हर:'], ['Denom:', 'हर:'], ['Cross-multiply:', 'तिर्यक-गुणन:'],
  ['First:', 'पहला:'], ['Last:', 'अंतिम:'], ['Left:', 'बायाँ:'], ['Right:', 'दायाँ:'], ['Join:', 'जोड़ें:'], ['Vertical:', 'ऊर्ध्वाधर:'],
  ['which simplifies to', 'जो सरल होकर बनता है'], ['written as', 'के रूप में लिखा'], ['followed by', 'उसके बाद'],
  ['so x =', 'इसलिए x ='], ['so y =', 'इसलिए y ='], ['So x =', 'इसलिए x ='], ['So ', 'इसलिए '], [', so ', ', इसलिए '],
  ['remainder', 'शेषफल'], ['quotient', 'भागफल'], ['Remainder', 'शेषफल'], ['Quotient', 'भागफल'],
  ['Groups:', 'समूह:'], ['Pairs:', 'जोड़ियाँ:'], ['Digits are', 'अंक हैं'], ['The digits rotate:', 'अंक घूमते हैं:'],
  ['Assembled with carries:', 'हासिल के साथ जोड़ने पर:'], ['Assembled:', 'जोड़ने पर:'], ['Assembled with carries', 'हासिल के साथ जोड़ने पर'], ['with carries', 'हासिल के साथ'], ['→ carry', '→ हासिल'],
  ['Units: ', 'इकाई: '], ['write ', 'लिखें '], ['carry ', 'हासिल '], ['Carry ', 'हासिल '], ['Cross multiply', 'तिर्यक-गुणन'], ['Cross-multiplying', 'तिर्यक-गुणन'],
  ['Near base ', 'आधार के निकट '], ['Adjust:', 'समायोजन:'], ['adjust', 'समायोजन'], ['Test ', 'जाँच '], ['Rule:', 'नियम:'], ['Direct:', 'सीधे:'], ['Pattern ', 'पैटर्न '],
  ['Digit-by-digit:', 'अंक-दर-अंक:'], ['Apply ', 'लागू करें '], ['Second:', 'दूसरा:'], ['Total=', 'कुल='], ['Total =', 'कुल ='],
  ['followed by units', 'उसके बाद इकाइयाँ'], [' units ', ' इकाइयाँ '], ['append', 'पीछे जोड़ें'], ['first=', 'पहला अंक='], ['root ends', 'मूल का अंतिम अंक'],
  ['Sum:', 'योग:'], ['Subtract equations:', 'समीकरणों को घटाएँ:'], ['Then y=', 'फिर y='], ['Then ', 'फिर '],
  ['Same tens (', 'दहाई वही ('], ['Transposed digit:', 'स्थानांतरित अंक:'], ['Quotient', 'भागफल'], ['Verified:', 'जाँचा गया:'], ['verify:', 'जाँच:'],
  ['Running sum', 'चलता योग'], ['Running:', 'चलता योग:'], ['Roots:', 'मूल:'], ['Complete the square:', 'वर्ग पूरा करें:'], ['First digit:', 'पहला अंक:'],
];
const ALLOWED = new Set(['DS', 'mod', 'abc', 'adj', 'Zeller', 'NcN']);

export function explanationHindi(text) {
  let s = text;
  for (const [re, rep] of REORDER) s = s.replace(re, rep);
  for (const [en, hi] of PHRASES) s = s.split(en).join(hi);
  s = s.replace(/\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b/g, (d) => DAYS_HI[d]);
  s = s.replace(/ and /g, ' और ').replace(/, then /g, ', फिर ').replace(/ then /g, ' फिर ');
  s = s.replace(/\.(\s|$)/g, '।$1');
  const left = (s.match(/[A-Za-z][A-Za-z'’-]*/g) || []).filter((w) => !ALLOWED.has(w) && !/^[A-Za-z]{1,2}$/.test(w) && !/^[a-z]+[A-Z]?[a-z]?$/.test('') && !/^[a-d]{1,3}$/.test(w));
  return { text: s, left };
}
