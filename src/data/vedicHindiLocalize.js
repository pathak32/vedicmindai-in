// Adds Hindi to Vedic Maths practice and quiz questions that only have English text.
// Anything this cannot translate with confidence is left in English.
import { promptHindi, DAYS_HI } from './vedicHindi.js';
import { MANUAL } from './vedicHindiManual.js';
import { explanationHindi } from './vedicHindiExp.js';
import { EXP_MANUAL } from './vedicHindiExpManual.js';

const OPTION_WORDS = {
  Yes: 'हाँ', No: 'नहीं', 'Correct ✓': 'सही ✓', 'Wrong ✗': 'गलत ✗',
  "Yes, correct": "हाँ, सही है",
  "No, wrong": "नहीं, गलत है",
  "Aryabhata": "आर्यभट",
  "Bharati Krishna Tirthaji": "भारती कृष्ण तीर्थजी",
  "Ramanujan": "रामानुजन",
  "Brahmagupta": "ब्रह्मगुप्त",
  "To replace school Maths entirely": "स्कूल के गणित की पूरी तरह जगह लेने के लिए",
  "To speed up calculation and build mental math confidence": "गणना तेज़ करने और मानसिक गणित का आत्मविश्वास बढ़ाने के लिए",
  "It's only useful for competitive exams": "यह केवल प्रतियोगी परीक्षाओं के लिए उपयोगी है",
  "It removes the need to learn tables": "इससे पहाड़े सीखने की ज़रूरत खत्म हो जाती है",
  "They teach completely different, unrelated subjects": "वे बिल्कुल अलग, असंबंधित विषय सिखाते हैं",
  "Vedic Maths gives faster mental shortcuts to the same answers school methods already teach": "वैदिक गणित वही उत्तर तेज़ मानसिक शॉर्टकट से देता है जो स्कूल की विधियाँ पहले से सिखाती हैं",
  "School Maths is only for exams, Vedic Maths is only for daily life": "स्कूल का गणित केवल परीक्षाओं के लिए है, वैदिक गणित केवल रोज़मर्रा के जीवन के लिए",
  "There is no real difference": "कोई वास्तविक अंतर नहीं है",
  "A long formula": "एक लंबा सूत्र",
  "A short, memorable rule or formula": "एक छोटा, याद रखने योग्य नियम या सूत्र",
  "A type of number": "एक प्रकार की संख्या",
  "A calculator method": "कैलकुलेटर की एक विधि",
  "Shankaracharya of Puri": "पुरी के शंकराचार्य",
  "A university professor": "एक विश्वविद्यालय प्राध्यापक",
  "A government minister": "एक सरकारी मंत्री",
  "A temple priest": "एक मंदिर का पुजारी",
  "Rig Veda": "ऋग्वेद",
  "Sama Veda": "सामवेद",
  "Atharva Veda": "अथर्ववेद",
  "Yajur Veda": "यजुर्वेद",
  "Calculation": "गणना",
  "Speed": "गति",
  "Number": "संख्या",
  "Knowledge": "ज्ञान",
  "Calculation methods": "गणना की विधियाँ",
  "The underlying number theory": "अंतर्निहित संख्या-सिद्धांत",
  "Geometry proofs": "ज्यामिति के उपपत्ति",
  "Statistics": "सांख्यिकी",
  "Nothing, just the answer": "कुछ नहीं, केवल उत्तर",
  "Standard working/steps as required by the exam": "परीक्षा के अनुसार आवश्यक मानक हल/चरण",
  "Only the sutra name": "केवल सूत्र का नाम",
  "A drawing": "एक चित्र",
  "Guaranteed 100% exam scores": "100% परीक्षा-अंकों की गारंटी",
  "No longer needing to learn tables": "अब पहाड़े सीखने की ज़रूरत नहीं",
  "Faster mental calculation and reduced errors": "तेज़ मानसिक गणना और कम गलतियाँ",
  "Skipping geometry entirely": "ज्यामिति को पूरी तरह छोड़ देना",
  "Hindi": "हिंदी",
  "Tamil": "तमिल",
  "Pali": "पाली",
  "Sanskrit": "संस्कृत",
  "Each is a short rule applicable to a specific pattern of numbers": "हर एक संख्याओं के किसी विशेष पैटर्न पर लागू होने वाला छोटा नियम है",
  "Each replaces an entire branch of mathematics": "हर एक गणित की एक पूरी शाखा की जगह लेता है",
  "Each works for every possible number with no exceptions": "हर एक बिना किसी अपवाद के हर संभव संख्या पर काम करता है",
  "Each requires a calculator to apply": "हर एक को लगाने के लिए कैलकुलेटर चाहिए",
  "Only art exams": "केवल कला की परीक्षाएँ",
  "Competitive/speed-based exams (like JEE, SSC, banking exams)": "प्रतियोगी/गति-आधारित परीक्षाएँ (जैसे JEE, SSC, बैंकिंग परीक्षाएँ)",
  "Only language exams": "केवल भाषा की परीक्षाएँ",
  "Only sports trials": "केवल खेल के ट्रायल",
  "Powers of 2": "2 की घातें",
  "Powers of 10": "10 की घातें",
  "Prime numbers": "अभाज्य संख्याएँ",
  "Fibonacci numbers": "फ़िबोनाची संख्याएँ",
  "Both parts of the answer": "उत्तर के दोनों भाग",
  "Only the quotient": "केवल भागफल",
  "Only the remainder": "केवल शेषफल",
  "The exponent": "घातांक",
  "Nikhilam": "निखिलम्",
  "Gunita Samuchyah": "गुणित समुच्चयः",
  "Anurupyena": "आनुरूप्येण",
  "Vilokanam": "विलोकनम्",
  "Ekadhikena Purvena": "एकाधिकेन पूर्वेण",
  "Urdhva-Tiryagbhyam": "ऊर्ध्व-तिर्यग्भ्याम्",
};
const hasHindi = (v) => v && typeof v === 'object' && !!v.hi;
const englishOf = (v) => (v && typeof v === 'object' ? v.en : v);

function optionHindi(o) {
  if (typeof o !== 'string') return o;
  const hi = DAYS_HI[o] || OPTION_WORDS[o];
  return hi ? { en: o, hi } : o;
}

export function localizeVedicQuestion(q) {
  const qText = englishOf(q.q ?? q.prompt);
  if (typeof qText !== 'string') return q;
  const manual = MANUAL[qText];
  const out = { ...q };

  if (!hasHindi(q.q)) {
    const hi = manual ? manual[0] : promptHindi(qText);
    if (hi) out.q = { en: qText, hi };
  }

  if (manual?.[2] && Array.isArray(q.options)) {
    out.options = q.options.map((o, i) => (typeof o === 'string' && manual[2][i] ? { en: o, hi: manual[2][i] } : o));
  } else if (Array.isArray(q.options)) {
    out.options = q.options.map(optionHindi);
  }

  const expText = englishOf(q.exp);
  if (typeof expText === 'string' && expText && !hasHindi(q.exp)) {
    let hi = EXP_MANUAL[expText] ?? manual?.[1] ?? null;
    if (!hi) {
      const r = explanationHindi(expText);
      if (!r.left.length) hi = r.text;
    }
    if (hi) out.exp = { en: expText, hi };
  }
  return out;
}
