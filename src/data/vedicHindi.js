// Hindi for the Vedic Maths practice and quiz questions that only had English text.
// localizeVedicQuestion() leaves a question alone when it already has Hindi, and also
// leaves any field it does not recognise in English rather than guessing.

const MONTH = { January: 'जनवरी', February: 'फ़रवरी', March: 'मार्च', April: 'अप्रैल', May: 'मई', June: 'जून', July: 'जुलाई', August: 'अगस्त', September: 'सितंबर', October: 'अक्टूबर', November: 'नवंबर', December: 'दिसंबर', Jan: 'जन.', Aug: 'अग.' };
const DAY = { Monday: 'सोमवार', Tuesday: 'मंगलवार', Wednesday: 'बुधवार', Thursday: 'गुरुवार', Friday: 'शुक्रवार', Saturday: 'शनिवार', Sunday: 'रविवार', Mon: 'सोम', Tue: 'मंगल', Wed: 'बुध', Thu: 'गुरु', Fri: 'शुक्र', Sat: 'शनि', Sun: 'रवि' };
const ORD = { 1: 'पहला', 2: 'दूसरा', 3: 'तीसरा' };
const ord = (n) => ORD[n] || `${n}वाँ`;

// prompt rules: [regex, (match) => hindi]
const P = [];
const rule = (re, fn) => P.push([re, fn]);
const NUM = '(-?\\d+(?:\\.\\d+)?)';

rule(new RegExp(`^What is ${NUM} × ${NUM}\\?$`), (m) => `${m[1]} × ${m[2]} क्या है?`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using Nikhilam \\(base ${NUM}\\)\\.$`), (m) => `निखिलम् (आधार ${m[3]}) से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using Nikhilam\\.?$`), (m) => `निखिलम् से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^What is ${NUM} ÷ ${NUM}\\? Give the quotient and remainder\\.$`), (m) => `${m[1]} ÷ ${m[2]} क्या है? भागफल और शेषफल बताइए।`);
rule(new RegExp(`^Find ${NUM}² using the Duplex method\\.$`), (m) => `डुप्लेक्स विधि से ${m[1]}² ज्ञात कीजिए।`);
rule(new RegExp(`^What is ${NUM}³\\?$`), (m) => `${m[1]}³ क्या है?`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using Urdhva-Tiryagbhyam(?: \\(vertically and crosswise\\))?\\.$`), (m) => `ऊर्ध्व-तिर्यग्भ्याम् से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using Urdhva\\.?$`), (m) => `ऊर्ध्व-तिर्यग्भ्याम् से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^What is ${NUM}²\\?$`), (m) => `${m[1]}² क्या है?`);
rule(new RegExp(`^What is the cube root of ${NUM}\\?$`), (m) => `${m[1]} का घनमूल क्या है?`);
rule(new RegExp(`^What is ∛${NUM}\\?$`), (m) => `∛${m[1]} क्या है?`);
rule(new RegExp(`^Find √${NUM} correct to ${NUM} decimal places?\\.$`), (m) => `√${m[1]} का मान दशमलव के ${m[2]} स्थानों तक ज्ञात कीजिए।`);
rule(new RegExp(`^What is √${NUM}\\?$`), (m) => `√${m[1]} क्या है?`);
rule(new RegExp(`^What is the remainder when ${NUM} is divided by ${NUM}\\?$`), (m) => `${m[1]} को ${m[2]} से भाग देने पर शेषफल क्या है?`);
rule(new RegExp(`^What is the digit sum of ${NUM}\\?$`), (m) => `${m[1]} का अंकयोग क्या है?`);
rule(new RegExp(`^Check ${NUM} × ${NUM} = ${NUM} by casting out nines\\. What is the digital root of ${NUM}\\?$`), (m) => `नौ के त्याग (कास्टिंग आउट नाइन्स) से ${m[1]} × ${m[2]} = ${m[3]} की जाँच कीजिए। ${m[4]} का डिजिटल रूट क्या है?`);
rule(new RegExp(`^What is the alternating sum of ${NUM}, starting from the units digit\\?$`), (m) => `${m[1]} का एकांतर योग (इकाई अंक से शुरू करके) क्या है?`);
rule(new RegExp(`^Add (\\d+/\\d+) \\+ (\\d+/\\d+)\\. Give your answer in lowest terms\\.$`), (m) => `${m[1]} + ${m[2]} जोड़िए। उत्तर को सरलतम रूप में दीजिए।`);
rule(new RegExp(`^Calculate ${NUM}² using Yavadunam(?: \\(base ${NUM}\\))?\\.$`), (m) => `यावदूनम्${m[2] ? ` (आधार ${m[2]})` : ''} से ${m[1]}² निकालिए।`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using Anurupyena(?: \\(proportional scaling\\))?\\.?$`), (m) => `आनुरूप्येण${/proportional/.test(m[0]) ? ' (अनुपाती मापन)' : ''} से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM} using the vinculum \\(complement\\) method\\.$`), (m) => `विंकुलम (पूरक) विधि से ${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^${NUM} × ${NUM} = \\?$`), (m) => `${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM} × ${NUM} = \\? \\(base ${NUM}\\)$`), (m) => `${m[1]} × ${m[2]} = ? (आधार ${m[3]})`);
rule(new RegExp(`^${NUM} × ${NUM} = \\? \\(Nikhilam base ${NUM}\\)$`), (m) => `${m[1]} × ${m[2]} = ? (निखिलम्, आधार ${m[3]})`);
rule(new RegExp(`^${NUM} × ${NUM} using vinculum = \\?$`), (m) => `विंकुलम से ${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM} × ${NUM} using Nikhilam \\(base ${NUM}\\) = \\?$`), (m) => `निखिलम् (आधार ${m[3]}) से ${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM} × ${NUM} using Nikhilam = \\?$`), (m) => `निखिलम् से ${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM} × ${NUM} using Urdhva-Tiryagbhyam = \\?$`), (m) => `ऊर्ध्व-तिर्यग्भ्याम् से ${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM} × ${NUM} using Anurupyena \\(base ${NUM}\\) = \\?$`), (m) => `आनुरूप्येण (आधार ${m[3]}) से ${m[1]} × ${m[2]} = ?`);
rule(new RegExp(`^${NUM}² = \\?$`), (m) => `${m[1]}² = ?`);
rule(new RegExp(`^${NUM}³ = \\?$`), (m) => `${m[1]}³ = ?`);
rule(new RegExp(`^∛${NUM} = \\?$`), (m) => `∛${m[1]} = ?`);
rule(new RegExp(`^√${NUM} ≈ \\?$`), (m) => `√${m[1]} ≈ ?`);
rule(new RegExp(`^${NUM} ÷ ${NUM} = \\?$`), (m) => `${m[1]} ÷ ${m[2]} = ?`);
rule(new RegExp(`^${NUM}/${NUM} = \\?$`), (m) => `${m[1]}/${m[2]} = ?`);
rule(new RegExp(`^Divide ${NUM} ÷ ${NUM}(?: using Paravartya)?$`), (m) => `${m[1]} ÷ ${m[2]}${/Paravartya/.test(m[0]) ? ' को परावर्त्य से' : ''} भाग दीजिए`);
rule(new RegExp(`^Calculate ${NUM} × ${NUM}\\.?$`), (m) => `${m[1]} × ${m[2]} निकालिए।`);
rule(new RegExp(`^Calculate ${NUM}²$`), (m) => `${m[1]}² निकालिए।`);
rule(new RegExp(`^Calculate ${NUM}³$`), (m) => `${m[1]}³ निकालिए।`);
rule(new RegExp(`^Calculate ${NUM}³ using Anurupyena$`), (m) => `आनुरूप्येण से ${m[1]}³ निकालिए।`);
rule(new RegExp(`^Calculate ${NUM}² using base-${NUM} method$`), (m) => `आधार-${m[2]} विधि से ${m[1]}² निकालिए।`);
rule(new RegExp(`^Calculate ${NUM}² using duplex$`), (m) => `डुप्लेक्स से ${m[1]}² निकालिए।`);
rule(new RegExp(`^${NUM}² using Duplex = \\?$`), (m) => `डुप्लेक्स से ${m[1]}² = ?`);
rule(new RegExp(`^${NUM}² using the Duplex method = \\?$`), (m) => `डुप्लेक्स विधि से ${m[1]}² = ?`);
rule(new RegExp(`^${NUM}² using Duplex \\(${NUM}-digit\\) = \\?$`), (m) => `डुप्लेक्स (${m[2]}-अंकीय) से ${m[1]}² = ?`);
rule(new RegExp(`^${NUM}³ using the Vedic cubing shortcut = \\?$`), (m) => `वैदिक घन-शॉर्टकट से ${m[1]}³ = ?`);
rule(new RegExp(`^${NUM} ÷ ${NUM} using Straight Division = \\?$`), (m) => `सीधी भाग-विधि (स्ट्रेट डिवीज़न) से ${m[1]} ÷ ${m[2]} = ?`);
rule(new RegExp(`^√${NUM} to ${NUM} decimal places ≈ \\?$`), (m) => `√${m[1]} दशमलव के ${m[2]} स्थानों तक ≈ ?`);
rule(new RegExp(`^Calculate (\\d+/\\d+) \\+ (\\d+/\\d+)(?: using (?:the )?Vedic method)?$`), (m) => `${m[1]} + ${m[2]}${/Vedic/.test(m[0]) ? ' को वैदिक विधि से' : ''} निकालिए`);
rule(new RegExp(`^(\\d+/\\d+) \\+ (\\d+/\\d+) using the Vedic method = \\?$`), (m) => `वैदिक विधि से ${m[1]} + ${m[2]} = ?`);
rule(new RegExp(`^Calculate (\\d+/\\d+) − (\\d+/\\d+)$`), (m) => `${m[1]} − ${m[2]} निकालिए`);
rule(new RegExp(`^Verify ${NUM} × ${NUM} = ${NUM} using digit sums$`), (m) => `अंकयोग से ${m[1]} × ${m[2]} = ${m[3]} की जाँच कीजिए`);

// algebra and word-light questions: the expression stays, only the instruction is Hindi
rule(/^Solve (.+)\. What is (x|y)\?$/, (m) => `हल कीजिए: ${m[1].replace(/ and /g, ' और ')}। ${m[2]} क्या है?`);
rule(/^Solve (.+)\. What is the (smaller|larger) root\?$/, (m) => `हल कीजिए: ${m[1]}। ${m[2] ==='smaller' ? 'छोटा' : 'बड़ा'} मूल क्या है?`);
rule(/^Factorise (.+)\.$/, (m) => `${m[1]} के गुणनखंड कीजिए।`);
rule(/^Expand (.+)\.$/, (m) => `${m[1]} का प्रसार कीजिए।`);
rule(/^Factors of (.+) = \?$/, (m) => `${m[1]} के गुणनखंड = ?`);
rule(/^(\(.+\)) = \?$/, (m) => `${m[1]} = ?`);
rule(/^(\d*x[+\-−]?\d*y?.*→.*)\?$/, (m) => `${m[1]}?`);
rule(/^Solve (.+) What is x\?$/, (m) => `हल कीजिए: ${m[1].replace(/ and /g, " और ")} x क्या है?`);
rule(/^What is the sum of the coefficients of (.+)\?$/, (m) => `${m[1]} के गुणांकों का योग क्या है?`);
rule(/^What is the (\d+)(?:st|nd|rd|th) digit of (\d+) × (\d+)\?$/, (m) => `${m[2]} × ${m[3]} का ${ord(+m[1])} अंक क्या है?`);
rule(/^In (\d+\/\d+) = ([\d.]+)(?:…|\.\.\.), what is the (\d+|first)(?:st|nd|rd|th)? digit after the decimal point\?$/, (m) => `${m[1]} = ${m[2]}… में, दशमलव के बाद ${m[3] === 'first' ? 'पहला' : ord(+m[3])} अंक क्या है?`);
rule(/^What is the (\d+|first)(?:st|nd|rd|th)? digit after the decimal point of (\d+\/\d+)\?$/, (m) => `${m[2]} में दशमलव के बाद ${m[1] === 'first' ? 'पहला' : ord(+m[1])} अंक क्या है?`);
rule(/^How many digits repeat in the decimal of (\d+\/\d+)\?$/, (m) => `${m[1]} के दशमलव रूप में कितने अंक दोहराते हैं?`);
rule(/^Is (\d+) divisible by (\d+)\?$/, (m) => `क्या ${m[1]}, ${m[2]} से विभाज्य है?`);
rule(/^What day of the week does (\d+) (\w+) (\d+) fall on\?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} सप्ताह के किस दिन पड़ता है?`);
rule(/^What day of the week is (\d+) (\w+) (\d+)\?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} सप्ताह का कौन-सा दिन है?`);
rule(/^What day was (\d+) (\w+) (\d+)\?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} को कौन-सा दिन था?`);
rule(/^What day is (\d+) (\w+) (\d+)\?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} को कौन-सा दिन है?`);
rule(/^(\d+) (\w+) (\d+) fell on which day\?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} किस दिन पड़ा था?`);
rule(/^(\d+) (\w+) (\d+) = \?$/, (m) => MONTH[m[2]] && `${m[1]} ${MONTH[m[2]]} ${m[3]} = ?`);
rule(/^Month code for (\w+) = \?$/, (m) => MONTH[m[1]] && `${MONTH[m[1]]} का माह-कोड = ?`);
rule(/^What month code is used for (\w+) in the day-of-week formula\?$/, (m) => MONTH[m[1]] && `सप्ताह-दिवस सूत्र में ${MONTH[m[1]]} के लिए कौन-सा माह-कोड प्रयोग होता है?`);
rule(/^Century code for (\d+)s = \?$/, (m) => `${m[1]} के दशक वाली सदी का शताब्दी-कोड = ?`);
rule(/^What century correction applies to years in the (\d+)s\?$/, (m) => `${m[1]} के दशक वाले वर्षों पर कौन-सा शताब्दी-सुधार लागू होता है?`);
rule(/^What is the osculator for testing divisibility by (\d+)\?$/, (m) => `${m[1]} से विभाज्यता जाँचने के लिए ऑस्कुलेटर क्या है?`);
rule(/^Osculator P for (\d+) = \?$/, (m) => `${m[1]} के लिए ऑस्कुलेटर P = ?`);
rule(/^D\((\d+)\)(?: \((?:Duplex of (?:two-digit )?\d+|)\))?(?: duplex)? = \?$/, (m) => `D(${m[1]}) (डुप्लेक्स) = ?`);
rule(/^D\((\d+)\) \(Duplex of (?:two-digit )?(\d+)\) = \?$/, (m) => `D(${m[1]}) (${m[2]} का डुप्लेक्स) = ?`);
rule(/^Ekadhikena of (\d+) = \?$/, (m) => `${m[1]} का एकाधिक = ?`);
rule(/^Nikhilam$/, () => null);

export const PROMPT_RULES = P;
export const MONTHS_HI = MONTH;
export const DAYS_HI = DAY;
export const ordinalHi = ord;

export function promptHindi(text) {
  for (const [re, fn] of P) {
    const m = text.match(re);
    if (m) {
      const out = fn(m);
      if (out) return out;
    }
  }
  return null;
}
