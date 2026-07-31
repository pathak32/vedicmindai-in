import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/LanguageContext';
import { awardPoints, recalculateMonthlyStatus, POINTS } from '@/lib/knowledgePoints';
import { useVedicAuth } from '@/lib/VedicAuthContext';

// Resolves a field that may be a plain string (older English-only question
// banks) or a { en, hi } bilingual object (new banks). Falls back to English.
function tr(field, language) {
  if (field == null) return field;
  if (typeof field === 'string') return field;
  return field[language] ?? field.en ?? '';
}

// ─── Per-lesson quiz question banks ──────────────────────────────────────────

const LESSON_QUESTIONS = {
  l1_01: [
    { q: { en: 'Who is credited with compiling the modern system of Vedic Mathematics?', hi: 'वैदिक गणित की आधुनिक प्रणाली को संकलित करने का श्रेय किसे दिया जाता है?' , exp: 'Bharati Krishna Tirthaji compiled the 16 sutras that form the modern Vedic Mathematics system, first published in 1965.' }, options: ['Aryabhata', 'Bharati Krishna Tirthaji', 'Ramanujan', 'Brahmagupta'], correct: 1 },
    { q: { en: 'How many main sutras (aphorisms) make up the core Vedic Mathematics system?', hi: 'वैदिक गणित की मुख्य प्रणाली में कितने मुख्य सूत्र (सूत्रवाक्य) होते हैं?' , exp: 'The system is built on 16 main sutras, each a short rule covering a family of calculation techniques.' }, options: ['10', '13', '16', '21'], correct: 2 },
    { q: { en: 'Why is Vedic Mathematics taught alongside regular school Maths?', hi: 'वैदिक गणित को स्कूल के नियमित Maths के साथ क्यों पढ़ाया जाता है?' , exp: 'Vedic Maths speeds up calculation and builds mental math confidence — it\'s designed to work alongside the school curriculum, not replace it.' }, options: ['To replace school Maths entirely', 'To speed up calculation and build mental math confidence', 'It\'s only useful for competitive exams', 'It removes the need to learn tables'], correct: 1 },
    { q: { en: 'What is the key difference between Vedic Maths and the Maths taught in school?', hi: 'वैदिक गणित और स्कूल में पढ़ाए जाने वाले Maths में मुख्य अंतर क्या है?' , exp: 'School Maths teaches standard step-by-step algorithms and builds the conceptual foundation. Vedic Maths offers quick mental shortcuts to reach the same correct answers faster — it supplements school Maths, it doesn\'t replace it.' }, options: ['They teach completely different, unrelated subjects', 'Vedic Maths gives faster mental shortcuts to the same answers school methods already teach', 'School Maths is only for exams, Vedic Maths is only for daily life', 'There is no real difference'], correct: 1 },
    { q: { en: 'What does the word \'Sutra\' mean?', hi: '\'सूत्र\' शब्द का अर्थ क्या है?' , exp: 'A sutra is a short, memorable rule or formula — a compact instruction that captures a calculation principle.' }, options: ['A long formula', 'A short, memorable rule or formula', 'A type of number', 'A calculator method'], correct: 1 },
    { q: { en: 'Besides the 16 main sutras, how many sub-sutras (supporting corollaries) does the system include?', hi: '16 मुख्य सूत्रों के अलावा, इस प्रणाली में कितने उप-सूत्र (सहायक सूत्र) शामिल हैं?' , exp: 'The system also includes 13 sub-sutras, which support and extend the 16 main sutras for more specialized cases.' }, options: ['8', '10', '13', '16'], correct: 2 },
    { q: { en: 'Bharati Krishna Tirthaji held which religious title?', hi: 'भारती कृष्ण तीर्थजी के पास कौन सी धार्मिक उपाधि थी?' , exp: 'Bharati Krishna Tirthaji was the Shankaracharya (head monk) of the Govardhana Matha in Puri, one of Hinduism\'s four major monastic seats.' }, options: ['Shankaracharya of Puri', 'A university professor', 'A government minister', 'A temple priest'], correct: 0 },
    { q: { en: 'In which year was the book "Vedic Mathematics" first published?', hi: '"Vedic Mathematics" पुस्तक पहली बार किस वर्ष प्रकाशित हुई थी?' , exp: 'The book "Vedic Mathematics" by Bharati Krishna Tirthaji was first published in 1965, four years after his death in 1960.' }, options: ['1965', '1955', '1975', '1985'], correct: 0 },
    { q: { en: 'Which Veda are the Vedic Mathematics sutras traditionally said to be connected to?', hi: 'परंपरागत रूप से Vedic Mathematics के सूत्र किस वेद से जुड़े माने जाते हैं?' , exp: 'Tirthaji stated the sutras were derived from the Parishishta (an appendix) of the Atharva Veda -- though this specific textual source has not been independently located, and the claim is debated among scholars.' }, options: ['Rig Veda', 'Sama Veda', 'Atharva Veda', 'Yajur Veda'], correct: 2 },
    { q: { en: 'What does the word "Veda" itself mean?', hi: '"वेद" शब्द का अर्थ स्वयं क्या है?' , exp: '"Veda" is a Sanskrit word meaning "knowledge" -- the same root as the English word "wit."' }, options: ['Calculation', 'Speed', 'Number', 'Knowledge'], correct: 3 },
    { q: { en: 'Vedic Mathematics techniques are best described as an alternative for which part of maths?', hi: 'Vedic Mathematics की तकनीकों को गणित के किस भाग के विकल्प के रूप में सबसे बेहतर बताया जा सकता है?' , exp: 'Vedic Mathematics offers faster calculation techniques -- it does not propose a different mathematical theory, just quicker ways to reach the same, standard answers.' }, options: ['Calculation methods', 'The underlying number theory', 'Geometry proofs', 'Statistics'], correct: 0 },
    { q: { en: 'A student using Vedic Maths shortcuts should still show which of these on school exams (unless the exam explicitly allows shortcuts)?', hi: 'Vedic Maths की शॉर्टकट तकनीक इस्तेमाल करने वाले छात्र को स्कूल परीक्षा में अब भी इनमें से क्या दिखाना चाहिए (जब तक परीक्षा स्पष्ट रूप से शॉर्टकट की अनुमति न दे)?' , exp: 'Most school exams require standard working to be shown for marks -- Vedic shortcuts are best used to check answers quickly or for mental math, not as a replacement for exam-required steps.' }, options: ['Nothing, just the answer', 'Standard working/steps as required by the exam', 'Only the sutra name', 'A drawing'], correct: 1 },
    { q: { en: 'What is a common benefit students report from regular Vedic Maths practice?', hi: 'नियमित Vedic Maths अभ्यास से छात्र आमतौर पर कौन सा लाभ बताते हैं?' , exp: 'Regular practice commonly improves calculation speed and reduces careless errors -- it is not a guarantee of perfect scores or a replacement for the full syllabus.' }, options: ['Guaranteed 100% exam scores', 'No longer needing to learn tables', 'Faster mental calculation and reduced errors', 'Skipping geometry entirely'], correct: 2 },
    { q: { en: 'The 16 main sutras of Vedic Mathematics are written in which language?', hi: 'Vedic Mathematics के 16 मुख्य सूत्र किस भाषा में लिखे गए हैं?' , exp: 'All 16 main sutras (like Ekadhikena Purvena, Nikhilam, Urdhva-Tiryagbhyam) are Sanskrit phrases.' }, options: ['Hindi', 'Tamil', 'Pali', 'Sanskrit'], correct: 3 },
    { q: { en: 'Which of these best describes how Vedic Maths sutras work?', hi: 'इनमें से कौन सा विकल्प यह सबसे अच्छी तरह बताता है कि Vedic Maths के सूत्र कैसे काम करते हैं?' , exp: 'Each sutra is a targeted shortcut -- for example, Ekadhikena Purvena works specifically for squaring numbers ending in 5, not for all multiplication.' }, options: ['Each is a short rule applicable to a specific pattern of numbers', 'Each replaces an entire branch of mathematics', 'Each works for every possible number with no exceptions', 'Each requires a calculator to apply'], correct: 0 },
    { q: { en: 'Vedic Mathematics is commonly used today to prepare for which type of exams, alongside regular schoolwork?', hi: 'आज के समय में Vedic Mathematics का उपयोग सामान्य स्कूली पढ़ाई के साथ-साथ किस प्रकार की परीक्षाओं की तैयारी के लिए आमतौर पर किया जाता है?' , exp: 'Vedic Maths shortcuts are especially popular for competitive exams with strict time limits, where calculation speed directly affects how many questions a student can attempt.' }, options: ['Only art exams', 'Competitive/speed-based exams (like JEE, SSC, banking exams)', 'Only language exams', 'Only sports trials'], correct: 1 },
  ],
  l1_02: [
    { q: { en: 'What is the result of applying Ekadhikena Purvena to 55²?', hi: '55² पर एकाधिकेन पूर्वेण लागू करने का परिणाम क्या है?' , exp: '5 × 6 = 30, append 25 → 3025.' }, options: ['3000','3025','3125','2925'], correct: 1 },
    { q: { en: 'What is 115²?', hi: '115² क्या है?' , exp: '11 × 12 = 132, append 25 → 13225.' }, options: ['13125','13225','13325','13425'], correct: 1 },
    { q: { en: 'What is 145²?', hi: '145² क्या है?' , exp: '14 × 15 = 210, append 25 → 21025.' }, options: ['20925','21025','21125','21225'], correct: 1 },
    { q: { en: 'To square a number ending in 5, you append ___ after the prefix.', hi: '5 पर समाप्त संख्या का वर्ग करने के लिए, प्रीफ़िक्स के बाद ___ जोड़ें।' , exp: 'The rule always appends 25 after the prefix product.' }, options: ['05','25','50','52'], correct: 1 },
    { q: { en: 'What is 65²?', hi: '65² क्या है?' , exp: '6 × 7 = 42, append 25 → 4225.' }, options: ['4025','4125','4225','4325'], correct: 2 },
    { q: { en: 'What is 245²?', hi: '245² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 245 = 24 tens and 5 units. Multiply the tens digit by one more than itself: 24 × (24+1) = 24 × 25 = 600. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 60025 → 60025.' }, options: ['60025', '57625', '60125', '59925'], correct: 0 },
    { q: { en: 'What is 25²?', hi: '25² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 25 = 2 tens and 5 units. Multiply the tens digit by one more than itself: 2 × (2+1) = 2 × 3 = 6. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 625 → 625.' }, options: ['425', '725', '625', '525'], correct: 2 },
    { q: { en: 'What is 125²?', hi: '125² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 125 = 12 tens and 5 units. Multiply the tens digit by one more than itself: 12 × (12+1) = 12 × 13 = 156. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 15625 → 15625.' }, options: ['14425', '15725', '15525', '15625'], correct: 3 },
    { q: { en: 'What is 105²?', hi: '105² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 105 = 10 tens and 5 units. Multiply the tens digit by one more than itself: 10 × (10+1) = 10 × 11 = 110. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 11025 → 11025.' }, options: ['11025', '10025', '11125', '10925'], correct: 0 },
    { q: { en: 'What is 505²?', hi: '505² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 505 = 50 tens and 5 units. Multiply the tens digit by one more than itself: 50 × (50+1) = 50 × 51 = 2550. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 255025 → 255025.' }, options: ['250025', '255025', '255125', '254925'], correct: 1 },
    { q: { en: 'What is 75²?', hi: '75² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 75 = 7 tens and 5 units. Multiply the tens digit by one more than itself: 7 × (7+1) = 7 × 8 = 56. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 5625 → 5625.' }, options: ['4925', '5725', '5625', '5525'], correct: 2 },
    { q: { en: 'What is 405²?', hi: '405² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 405 = 40 tens and 5 units. Multiply the tens digit by one more than itself: 40 × (40+1) = 40 × 41 = 1640. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 164025 → 164025.' }, options: ['160025', '164125', '163925', '164025'], correct: 3 },
    { q: { en: 'What is 45²?', hi: '45² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 45 = 4 tens and 5 units. Multiply the tens digit by one more than itself: 4 × (4+1) = 4 × 5 = 20. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 2025 → 2025.' }, options: ['2025', '1625', '2125', '1925'], correct: 0 },
    { q: { en: 'What is 175²?', hi: '175² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 175 = 17 tens and 5 units. Multiply the tens digit by one more than itself: 17 × (17+1) = 17 × 18 = 306. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 30625 → 30625.' }, options: ['28925', '30625', '30725', '30525'], correct: 1 },
    { q: { en: 'What is 305²?', hi: '305² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 305 = 30 tens and 5 units. Multiply the tens digit by one more than itself: 30 × (30+1) = 30 × 31 = 930. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 93025 → 93025.' }, options: ['90025', '93125', '93025', '92925'], correct: 2 },
    { q: { en: 'What is 185²?', hi: '185² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 185 = 18 tens and 5 units. Multiply the tens digit by one more than itself: 18 × (18+1) = 18 × 19 = 342. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 34225 → 34225.' }, options: ['32425', '34325', '34125', '34225'], correct: 3 },
    { q: { en: 'What is 35²?', hi: '35² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 35 = 3 tens and 5 units. Multiply the tens digit by one more than itself: 3 × (3+1) = 3 × 4 = 12. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 1225 → 1225.' }, options: ['1225', '925', '1325', '1125'], correct: 0 },
    { q: { en: 'What is 215²?', hi: '215² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 215 = 21 tens and 5 units. Multiply the tens digit by one more than itself: 21 × (21+1) = 21 × 22 = 462. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 46225 → 46225.' }, options: ['44125', '46225', '46325', '46125'], correct: 1 },
    { q: { en: 'What is 155²?', hi: '155² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 155 = 15 tens and 5 units. Multiply the tens digit by one more than itself: 15 × (15+1) = 15 × 16 = 240. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 24025 → 24025.' }, options: ['22525', '24125', '24025', '23925'], correct: 2 },
    { q: { en: 'What is 255²?', hi: '255² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 255 = 25 tens and 5 units. Multiply the tens digit by one more than itself: 25 × (25+1) = 25 × 26 = 650. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 65025 → 65025.' }, options: ['62525', '65125', '64925', '65025'], correct: 3 },
    { q: { en: 'What is 195²?', hi: '195² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 195 = 19 tens and 5 units. Multiply the tens digit by one more than itself: 19 × (19+1) = 19 × 20 = 380. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 38025 → 38025.' }, options: ['38025', '36125', '38125', '37925'], correct: 0 },
    { q: { en: 'What is 85²?', hi: '85² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 85 = 8 tens and 5 units. Multiply the tens digit by one more than itself: 8 × (8+1) = 8 × 9 = 72. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 7225 → 7225.' }, options: ['6425', '7325', '7225', '7125'], correct: 2 },
    { q: { en: 'What is 95²?', hi: '95² क्या है?' , exp: 'For numbers ending in 5, split off the tens digit: 95 = 9 tens and 5 units. Multiply the tens digit by one more than itself: 9 × (9+1) = 9 × 10 = 90. Append 25 to the end (since the last two digits of a number ending in 5, squared, are always 25): 9025 → 9025.' }, options: ['8125', '9125', '8925', '9025'], correct: 3 },
  ],
  l1_03: [
    { q: { en: 'Nikhilam works best for numbers near which bases?', hi: 'निखिलम् किन आधारों के निकट संख्याओं के लिए सबसे अच्छा काम करता है?' , exp: 'Nikhilam works on deficiencies from a base. The most useful bases are powers of 10: 10, 100, 1000.' }, options: ['Powers of 2','Powers of 10','Prime numbers','Fibonacci numbers'], correct: 1 },
    { q: { en: 'Calculate 9 × 8 using Nikhilam', hi: 'निखिलम् से 9 × 8 निकालें' , exp: 'Deficits from 10: 9→1, 8→2. Cross: 9−2=7. Product of deficits: 1×2=2. Answer: 72.' }, options: ['70','72','74','68'], correct: 1 },
    { q: { en: 'What are the "deficits" for 9 and 8?', hi: '9 और 8 की "कमियाँ" क्या हैं?' }, options: ['1 and 2','2 and 3','1 and 3','2 and 4'], correct: 0 , exp: 'Deficit means \'how far below the base.\' For base 10: 10-9=1 and 10-8=2.' },
    { q: { en: 'In Nikhilam, the cross subtraction and digit product give?', hi: 'निखिलम् में, तिरछा घटाव और अंक गुणनफल क्या देते हैं?' , exp: 'The cross subtraction gives the left (higher) part of the answer; the product of deficits gives the right (lower) part.' }, options: ['Both parts of the answer','Only the quotient','Only the remainder','The exponent'], correct: 0 },
    { q: { en: 'Calculate 7 × 9', hi: '7 × 9 निकालें' , exp: 'Deficits: 3 and 1. Cross: 7−1=6. Product: 3×1=3. Answer: 63.' }, options: ['61','63','65','67'], correct: 1 },
    { q: { en: 'What is 8 × 13?', hi: '8 × 13 क्या है?' , exp: 'Base 10. 8 is -2 from the base, 13 is +3 from the base. Cross-step: 8 + (+3) = 11. Multiply the deviations: (-2) × (+3) = -6. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 11 × 10 + (-6) = 104.' }, options: ['104', '114', '102', '144'], correct: 0 },
    { q: { en: 'What is 7 × 8?', hi: '7 × 8 क्या है?' , exp: 'Base 10. 7 is -3 from the base, 8 is -2 from the base. Cross-step (add one number\'s deviation to the other number): 7 + (-2) = 5. This is the left part of the answer. Multiply the two deviations: (-3) × (-2) = 6. This is the right part (padded to 1 digit: 6). Combine: 5 and 6 → 56.' }, options: ['66', '56', '58', '96'], correct: 1 },
    { q: { en: 'What is 9 × 13?', hi: '9 × 13 क्या है?' , exp: 'Base 10. 9 is -1 from the base, 13 is +3 from the base. Cross-step: 9 + (+3) = 12. Multiply the deviations: (-1) × (+3) = -3. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 12 × 10 + (-3) = 117.' }, options: ['127', '115', '117', '157'], correct: 2 },
    { q: { en: 'What is 6 × 9?', hi: '6 × 9 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 9 is -1 from the base. Cross-step (add one number\'s deviation to the other number): 6 + (-1) = 5. This is the left part of the answer. Multiply the two deviations: (-4) × (-1) = 4. This is the right part (padded to 1 digit: 4). Combine: 5 and 4 → 54.' }, options: ['64', '56', '94', '54'], correct: 3 },
    { q: { en: 'What is 6 × 10?', hi: '6 × 10 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 10 is +0 from the base. Cross-step (add one number\'s deviation to the other number): 6 + (+0) = 6. This is the left part of the answer. Multiply the two deviations: (-4) × (+0) = 0. This is the right part (padded to 1 digit: 0). Combine: 6 and 0 → 60.' }, options: ['60', '70', '62', '100'], correct: 0 },
    { q: { en: 'What is 10 × 10?', hi: '10 × 10 क्या है?' , exp: 'Base 10. 10 is +0 from the base, 10 is +0 from the base. Cross-step (add one number\'s deviation to the other number): 10 + (+0) = 10. This is the left part of the answer. Multiply the two deviations: (+0) × (+0) = 0. This is the right part (padded to 1 digit: 0). Combine: 10 and 0 → 100.' }, options: ['110', '100', '102', '140'], correct: 1 },
    { q: { en: 'What is 8 × 10?', hi: '8 × 10 क्या है?' , exp: 'Base 10. 8 is -2 from the base, 10 is +0 from the base. Cross-step (add one number\'s deviation to the other number): 8 + (+0) = 8. This is the left part of the answer. Multiply the two deviations: (-2) × (+0) = 0. This is the right part (padded to 1 digit: 0). Combine: 8 and 0 → 80.' }, options: ['90', '82', '80', '120'], correct: 2 },
    { q: { en: 'What is 11 × 13?', hi: '11 × 13 क्या है?' , exp: 'Base 10. 11 is +1 from the base, 13 is +3 from the base. Cross-step (add one number\'s deviation to the other number): 11 + (+3) = 14. This is the left part of the answer. Multiply the two deviations: (+1) × (+3) = 3. This is the right part (padded to 1 digit: 3). Combine: 14 and 3 → 143.' }, options: ['153', '145', '183', '143'], correct: 3 },
    { q: { en: 'What is 7 × 10?', hi: '7 × 10 क्या है?' , exp: 'Base 10. 7 is -3 from the base, 10 is +0 from the base. Cross-step (add one number\'s deviation to the other number): 7 + (+0) = 7. This is the left part of the answer. Multiply the two deviations: (-3) × (+0) = 0. This is the right part (padded to 1 digit: 0). Combine: 7 and 0 → 70.' }, options: ['70', '80', '72', '110'], correct: 0 },
    { q: { en: 'What is 8 × 11?', hi: '8 × 11 क्या है?' , exp: 'Base 10. 8 is -2 from the base, 11 is +1 from the base. Cross-step: 8 + (+1) = 9. Multiply the deviations: (-2) × (+1) = -2. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 9 × 10 + (-2) = 88.' }, options: ['98', '88', '86', '128'], correct: 1 },
    { q: { en: 'What is 6 × 7?', hi: '6 × 7 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 7 is -3 from the base. Cross-step: 6 + (-3) = 3. Multiply the deviations: (-4) × (-3) = 12. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 3 × 10 + (12) = 42.' }, options: ['52', '44', '42', '82'], correct: 2 },
    { q: { en: 'What is 8 × 9?', hi: '8 × 9 क्या है?' , exp: 'Base 10. 8 is -2 from the base, 9 is -1 from the base. Cross-step (add one number\'s deviation to the other number): 8 + (-1) = 7. This is the left part of the answer. Multiply the two deviations: (-2) × (-1) = 2. This is the right part (padded to 1 digit: 2). Combine: 7 and 2 → 72.' }, options: ['82', '74', '112', '72'], correct: 3 },
    { q: { en: 'What is 6 × 12?', hi: '6 × 12 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 12 is +2 from the base. Cross-step: 6 + (+2) = 8. Multiply the deviations: (-4) × (+2) = -8. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 8 × 10 + (-8) = 72.' }, options: ['72', '82', '70', '112'], correct: 0 },
    { q: { en: 'What is 12 × 12?', hi: '12 × 12 क्या है?' , exp: 'Base 10. 12 is +2 from the base, 12 is +2 from the base. Cross-step (add one number\'s deviation to the other number): 12 + (+2) = 14. This is the left part of the answer. Multiply the two deviations: (+2) × (+2) = 4. This is the right part (padded to 1 digit: 4). Combine: 14 and 4 → 144.' }, options: ['154', '144', '146', '184'], correct: 1 },
    { q: { en: 'What is 6 × 8?', hi: '6 × 8 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 8 is -2 from the base. Cross-step (add one number\'s deviation to the other number): 6 + (-2) = 4. This is the left part of the answer. Multiply the two deviations: (-4) × (-2) = 8. This is the right part (padded to 1 digit: 8). Combine: 4 and 8 → 48.' }, options: ['58', '50', '48', '88'], correct: 2 },
    { q: { en: 'What is 7 × 12?', hi: '7 × 12 क्या है?' , exp: 'Base 10. 7 is -3 from the base, 12 is +2 from the base. Cross-step: 7 + (+2) = 9. Multiply the deviations: (-3) × (+2) = -6. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 9 × 10 + (-6) = 84.' }, options: ['94', '82', '124', '84'], correct: 3 },
    { q: { en: 'What is 13 × 13?', hi: '13 × 13 क्या है?' , exp: 'Base 10. 13 is +3 from the base, 13 is +3 from the base. Cross-step (add one number\'s deviation to the other number): 13 + (+3) = 16. This is the left part of the answer. Multiply the two deviations: (+3) × (+3) = 9. This is the right part (padded to 1 digit: 9). Combine: 16 and 9 → 169.' }, options: ['169', '179', '171', '209'], correct: 0 },
    { q: { en: 'What is 9 × 9?', hi: '9 × 9 क्या है?' , exp: 'Base 10. 9 is -1 from the base, 9 is -1 from the base. Cross-step (add one number\'s deviation to the other number): 9 + (-1) = 8. This is the left part of the answer. Multiply the two deviations: (-1) × (-1) = 1. This is the right part (padded to 1 digit: 1). Combine: 8 and 1 → 81.' }, options: ['91', '81', '83', '121'], correct: 1 },
    { q: { en: 'What is 6 × 13?', hi: '6 × 13 क्या है?' , exp: 'Base 10. 6 is -4 from the base, 13 is +3 from the base. Cross-step: 6 + (+3) = 9. Multiply the deviations: (-4) × (+3) = -12. Since this doesn\'t fit cleanly as a simple 1-digit right part, combine algebraically: 9 × 10 + (-12) = 78.' }, options: ['88', '76', '78', '118'], correct: 2 },
    { q: { en: 'What is 11 × 11?', hi: '11 × 11 क्या है?' , exp: 'Base 10. 11 is +1 from the base, 11 is +1 from the base. Cross-step (add one number\'s deviation to the other number): 11 + (+1) = 12. This is the left part of the answer. Multiply the two deviations: (+1) × (+1) = 1. This is the right part (padded to 1 digit: 1). Combine: 12 and 1 → 121.' }, options: ['131', '123', '161', '121'], correct: 3 },
  ],
  l1_04: [
    { q: { en: 'For base 100 Nikhilam, the right part must have how many digits?', hi: 'आधार 100 निखिलम् में, दायें भाग में कितने अंक होने चाहिए?' , exp: 'Base 100 means the right part must always have exactly 2 digits. Pad with a leading zero if needed (e.g. 06, not 6).' }, options: ['1','2','3','4'], correct: 1 },
    { q: { en: 'Calculate 93 × 92', hi: '93 × 92 निकालें' , exp: 'Deficits: 7 and 8. Cross: 93−8=85. Product: 7×8=56. Answer: 8556.' }, options: ['8456','8556','8656','8356'], correct: 1 },
    { q: { en: 'What are the deficits for 98 and 95?', hi: '98 और 95 की कमियाँ क्या हैं?' , exp: 'Base 100: 100−98=2 and 100−95=5.' }, options: ['2 and 4','2 and 5','3 and 4','3 and 5'], correct: 1 },
    { q: { en: 'Calculate 96 × 95', hi: '96 × 95 निकालें' , exp: 'Deficits: 4 and 5. Cross: 96−5=91. Product: 4×5=20. Answer: 9120.' }, options: ['9020','9120','9220','8920'], correct: 1 },
    { q: { en: 'If the product of deficits is 6, you write it as ___ in the right part (base 100)', hi: 'यदि कमियों का गुणनफल 6 है, तो दायें भाग में इसे ___ लिखें (आधार 100)' , exp: 'Always write 2 digits for base 100: so 6 becomes 06 to fill the right part correctly.' }, options: ['6','06','006','60'], correct: 1 },
    { q: { en: 'What is 95 × 104?', hi: '95 × 104 क्या है?' , exp: 'Base 100. 95 is -5 from the base, 104 is +4 from the base. Cross-step: 95 + (+4) = 99. Multiply the deviations: (-5) × (+4) = -20. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 99 × 100 + (-20) = 9880.' }, options: ['9880', '9980', '9870', '10280'], correct: 0 },
    { q: { en: 'What is 102 × 104?', hi: '102 × 104 क्या है?' , exp: 'Base 100. 102 is +2 from the base, 104 is +4 from the base. Cross-step (add one number\'s deviation to the other number): 102 + (+4) = 106. This is the left part of the answer. Multiply the two deviations: (+2) × (+4) = 8. This is the right part (padded to 2 digits: 08). Combine: 106 and 08 → 10608.' }, options: ['10708', '10608', '10618', '11008'], correct: 1 },
    { q: { en: 'What is 96 × 96?', hi: '96 × 96 क्या है?' , exp: 'Base 100. 96 is -4 from the base, 96 is -4 from the base. Cross-step (add one number\'s deviation to the other number): 96 + (-4) = 92. This is the left part of the answer. Multiply the two deviations: (-4) × (-4) = 16. This is the right part (padded to 2 digits: 16). Combine: 92 and 16 → 9216.' }, options: ['9316', '9226', '9216', '9616'], correct: 2 },
    { q: { en: 'What is 99 × 102?', hi: '99 × 102 क्या है?' , exp: 'Base 100. 99 is -1 from the base, 102 is +2 from the base. Cross-step: 99 + (+2) = 101. Multiply the deviations: (-1) × (+2) = -2. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 101 × 100 + (-2) = 10098.' }, options: ['10198', '10088', '10498', '10098'], correct: 3 },
    { q: { en: 'What is 95 × 105?', hi: '95 × 105 क्या है?' , exp: 'Base 100. 95 is -5 from the base, 105 is +5 from the base. Cross-step: 95 + (+5) = 100. Multiply the deviations: (-5) × (+5) = -25. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 100 × 100 + (-25) = 9975.' }, options: ['9975', '10075', '9965', '10375'], correct: 0 },
    { q: { en: 'What is 98 × 99?', hi: '98 × 99 क्या है?' , exp: 'Base 100. 98 is -2 from the base, 99 is -1 from the base. Cross-step (add one number\'s deviation to the other number): 98 + (-1) = 97. This is the left part of the answer. Multiply the two deviations: (-2) × (-1) = 2. This is the right part (padded to 2 digits: 02). Combine: 97 and 02 → 9702.' }, options: ['9802', '9702', '9712', '10102'], correct: 1 },
    { q: { en: 'What is 98 × 105?', hi: '98 × 105 क्या है?' , exp: 'Base 100. 98 is -2 from the base, 105 is +5 from the base. Cross-step: 98 + (+5) = 103. Multiply the deviations: (-2) × (+5) = -10. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 103 × 100 + (-10) = 10290.' }, options: ['10390', '10280', '10290', '10690'], correct: 2 },
    { q: { en: 'What is 106 × 107?', hi: '106 × 107 क्या है?' , exp: 'Base 100. 106 is +6 from the base, 107 is +7 from the base. Cross-step (add one number\'s deviation to the other number): 106 + (+7) = 113. This is the left part of the answer. Multiply the two deviations: (+6) × (+7) = 42. This is the right part (padded to 2 digits: 42). Combine: 113 and 42 → 11342.' }, options: ['11442', '11352', '11742', '11342'], correct: 3 },
    { q: { en: 'What is 91 × 94?', hi: '91 × 94 क्या है?' , exp: 'Base 100. 91 is -9 from the base, 94 is -6 from the base. Cross-step (add one number\'s deviation to the other number): 91 + (-6) = 85. This is the left part of the answer. Multiply the two deviations: (-9) × (-6) = 54. This is the right part (padded to 2 digits: 54). Combine: 85 and 54 → 8554.' }, options: ['8554', '8654', '8564', '8954'], correct: 0 },
    { q: { en: 'What is 107 × 107?', hi: '107 × 107 क्या है?' , exp: 'Base 100. 107 is +7 from the base, 107 is +7 from the base. Cross-step (add one number\'s deviation to the other number): 107 + (+7) = 114. This is the left part of the answer. Multiply the two deviations: (+7) × (+7) = 49. This is the right part (padded to 2 digits: 49). Combine: 114 and 49 → 11449.' }, options: ['11549', '11449', '11459', '11849'], correct: 1 },
    { q: { en: 'What is 91 × 107?', hi: '91 × 107 क्या है?' , exp: 'Base 100. 91 is -9 from the base, 107 is +7 from the base. Cross-step: 91 + (+7) = 98. Multiply the deviations: (-9) × (+7) = -63. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 98 × 100 + (-63) = 9737.' }, options: ['9837', '9727', '9737', '10137'], correct: 2 },
    { q: { en: 'What is 92 × 109?', hi: '92 × 109 क्या है?' , exp: 'Base 100. 92 is -8 from the base, 109 is +9 from the base. Cross-step: 92 + (+9) = 101. Multiply the deviations: (-8) × (+9) = -72. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 101 × 100 + (-72) = 10028.' }, options: ['10128', '10018', '10428', '10028'], correct: 3 },
    { q: { en: 'What is 93 × 94?', hi: '93 × 94 क्या है?' , exp: 'Base 100. 93 is -7 from the base, 94 is -6 from the base. Cross-step (add one number\'s deviation to the other number): 93 + (-6) = 87. This is the left part of the answer. Multiply the two deviations: (-7) × (-6) = 42. This is the right part (padded to 2 digits: 42). Combine: 87 and 42 → 8742.' }, options: ['8742', '8842', '8752', '9142'], correct: 0 },
    { q: { en: 'What is 93 × 109?', hi: '93 × 109 क्या है?' , exp: 'Base 100. 93 is -7 from the base, 109 is +9 from the base. Cross-step: 93 + (+9) = 102. Multiply the deviations: (-7) × (+9) = -63. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 102 × 100 + (-63) = 10137.' }, options: ['10237', '10137', '10127', '10537'], correct: 1 },
    { q: { en: 'What is 88 × 90?', hi: '88 × 90 क्या है?' , exp: 'Base 100. 88 is -12 from the base, 90 is -10 from the base. Cross-step: 88 + (-10) = 78. Multiply the deviations: (-12) × (-10) = 120. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 78 × 100 + (120) = 7920.' }, options: ['8020', '7930', '7920', '8320'], correct: 2 },
    { q: { en: 'What is 90 × 112?', hi: '90 × 112 क्या है?' , exp: 'Base 100. 90 is -10 from the base, 112 is +12 from the base. Cross-step: 90 + (+12) = 102. Multiply the deviations: (-10) × (+12) = -120. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 102 × 100 + (-120) = 10080.' }, options: ['10180', '10070', '10480', '10080'], correct: 3 },
    { q: { en: 'What is 112 × 112?', hi: '112 × 112 क्या है?' , exp: 'Base 100. 112 is +12 from the base, 112 is +12 from the base. Cross-step: 112 + (+12) = 124. Multiply the deviations: (+12) × (+12) = 144. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 124 × 100 + (144) = 12544.' }, options: ['12544', '12644', '12554', '12944'], correct: 0 },
    { q: { en: 'What is 89 × 89?', hi: '89 × 89 क्या है?' , exp: 'Base 100. 89 is -11 from the base, 89 is -11 from the base. Cross-step: 89 + (-11) = 78. Multiply the deviations: (-11) × (-11) = 121. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 78 × 100 + (121) = 7921.' }, options: ['8021', '7921', '7931', '8321'], correct: 1 },
    { q: { en: 'What is 89 × 111?', hi: '89 × 111 क्या है?' , exp: 'Base 100. 89 is -11 from the base, 111 is +11 from the base. Cross-step: 89 + (+11) = 100. Multiply the deviations: (-11) × (+11) = -121. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 100 × 100 + (-121) = 9879.' }, options: ['9979', '9869', '9879', '10279'], correct: 2 },
    { q: { en: 'What is 88 × 88?', hi: '88 × 88 क्या है?' , exp: 'Base 100. 88 is -12 from the base, 88 is -12 from the base. Cross-step: 88 + (-12) = 76. Multiply the deviations: (-12) × (-12) = 144. Since this doesn\'t fit cleanly as a simple 2-digit right part, combine algebraically: 76 × 100 + (144) = 7744.' }, options: ['7844', '7754', '8144', '7744'], correct: 3 },
  ],
  l1_05: [
    { q: { en: 'For base 1000 Nikhilam, the right part must have how many digits?', hi: 'आधार 1000 निखिलम् में, दायें भाग में कितने अंक होने चाहिए?' , exp: 'Base 1000 means the right part must always have exactly 3 digits. Pad with leading zeros if needed.' }, options: ['1','2','3','4'], correct: 2 },
    { q: { en: 'Calculate 993 × 992', hi: '993 × 992 निकालें' , exp: 'Deficits: 7 and 8. Cross: 993−8=985. Product: 7×8=56 → write as 056. Answer: 985056.' }, options: ['983056','984056','985056','986056'], correct: 2 },
    { q: { en: 'Calculate 995 × 994', hi: '995 × 994 निकालें' , exp: 'Deficits: 5 and 6. Cross: 995−6=989. Product: 5×6=30 → write as 030. Answer: 989030.' }, options: ['987030','988030','989030','990030'], correct: 2 },
    { q: { en: 'The deficits for 996 and 994 are?', hi: '996 और 994 की कमियाँ हैं?' , exp: 'Base 1000: 1000−996=4 and 1000−994=6.' }, options: ['4 and 6','3 and 7','5 and 5','6 and 4'], correct: 0 },
    { q: { en: 'Calculate 991 × 989', hi: '991 × 989 निकालें' , exp: 'Deficits: 9 and 11. Cross: 991−11=980. Product: 9×11=99 → write as 099. Answer: 980099.' }, options: ['980099','981099','982099','979099'], correct: 0 },
    { q: { en: 'What is 990 × 1006?', hi: '990 × 1006 क्या है?' , exp: 'Base 1000. 990 is -10 from the base, 1006 is +6 from the base. Cross-step: 990 + (+6) = 996. Multiply the deviations: (-10) × (+6) = -60. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 996 × 1000 + (-60) = 995940.' }, options: ['995940', '996940', '995840', '999940'], correct: 0 },
    { q: { en: 'What is 992 × 993?', hi: '992 × 993 क्या है?' , exp: 'Base 1000. 992 is -8 from the base, 993 is -7 from the base. Cross-step (add one number\'s deviation to the other number): 992 + (-7) = 985. This is the left part of the answer. Multiply the two deviations: (-8) × (-7) = 56. This is the right part (padded to 3 digits: 056). Combine: 985 and 056 → 985056.' }, options: ['986056', '985056', '985156', '989056'], correct: 1 },
    { q: { en: 'What is 991 × 991?', hi: '991 × 991 क्या है?' , exp: 'Base 1000. 991 is -9 from the base, 991 is -9 from the base. Cross-step (add one number\'s deviation to the other number): 991 + (-9) = 982. This is the left part of the answer. Multiply the two deviations: (-9) × (-9) = 81. This is the right part (padded to 3 digits: 081). Combine: 982 and 081 → 982081.' }, options: ['983081', '982181', '982081', '986081'], correct: 2 },
    { q: { en: 'What is 993 × 1003?', hi: '993 × 1003 क्या है?' , exp: 'Base 1000. 993 is -7 from the base, 1003 is +3 from the base. Cross-step: 993 + (+3) = 996. Multiply the deviations: (-7) × (+3) = -21. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 996 × 1000 + (-21) = 995979.' }, options: ['996979', '995879', '999979', '995979'], correct: 3 },
    { q: { en: 'What is 996 × 1009?', hi: '996 × 1009 क्या है?' , exp: 'Base 1000. 996 is -4 from the base, 1009 is +9 from the base. Cross-step: 996 + (+9) = 1005. Multiply the deviations: (-4) × (+9) = -36. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 1005 × 1000 + (-36) = 1004964.' }, options: ['1004964', '1005964', '1004864', '1008964'], correct: 0 },
    { q: { en: 'What is 994 × 994?', hi: '994 × 994 क्या है?' , exp: 'Base 1000. 994 is -6 from the base, 994 is -6 from the base. Cross-step (add one number\'s deviation to the other number): 994 + (-6) = 988. This is the left part of the answer. Multiply the two deviations: (-6) × (-6) = 36. This is the right part (padded to 3 digits: 036). Combine: 988 and 036 → 988036.' }, options: ['989036', '988036', '988136', '992036'], correct: 1 },
    { q: { en: 'What is 994 × 997?', hi: '994 × 997 क्या है?' , exp: 'Base 1000. 994 is -6 from the base, 997 is -3 from the base. Cross-step (add one number\'s deviation to the other number): 994 + (-3) = 991. This is the left part of the answer. Multiply the two deviations: (-6) × (-3) = 18. This is the right part (padded to 3 digits: 018). Combine: 991 and 018 → 991018.' }, options: ['992018', '991118', '991018', '995018'], correct: 2 },
    { q: { en: 'What is 971 × 1016?', hi: '971 × 1016 क्या है?' , exp: 'Base 1000. 971 is -29 from the base, 1016 is +16 from the base. Cross-step: 971 + (+16) = 987. Multiply the deviations: (-29) × (+16) = -464. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 987 × 1000 + (-464) = 986536.' }, options: ['987536', '986436', '990536', '986536'], correct: 3 },
    { q: { en: 'What is 983 × 1012?', hi: '983 × 1012 क्या है?' , exp: 'Base 1000. 983 is -17 from the base, 1012 is +12 from the base. Cross-step: 983 + (+12) = 995. Multiply the deviations: (-17) × (+12) = -204. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 995 × 1000 + (-204) = 994796.' }, options: ['994796', '995796', '994696', '998796'], correct: 0 },
    { q: { en: 'What is 975 × 1024?', hi: '975 × 1024 क्या है?' , exp: 'Base 1000. 975 is -25 from the base, 1024 is +24 from the base. Cross-step: 975 + (+24) = 999. Multiply the deviations: (-25) × (+24) = -600. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 999 × 1000 + (-600) = 998400.' }, options: ['999400', '998400', '998300', '1002400'], correct: 1 },
    { q: { en: 'What is 1017 × 1028?', hi: '1017 × 1028 क्या है?' , exp: 'Base 1000. 1017 is +17 from the base, 1028 is +28 from the base. Cross-step (add one number\'s deviation to the other number): 1017 + (+28) = 1045. This is the left part of the answer. Multiply the two deviations: (+17) × (+28) = 476. This is the right part (padded to 3 digits: 476). Combine: 1045 and 476 → 1045476.' }, options: ['1046476', '1045576', '1045476', '1049476'], correct: 2 },
    { q: { en: 'What is 983 × 983?', hi: '983 × 983 क्या है?' , exp: 'Base 1000. 983 is -17 from the base, 983 is -17 from the base. Cross-step (add one number\'s deviation to the other number): 983 + (-17) = 966. This is the left part of the answer. Multiply the two deviations: (-17) × (-17) = 289. This is the right part (padded to 3 digits: 289). Combine: 966 and 289 → 966289.' }, options: ['967289', '966389', '970289', '966289'], correct: 3 },
    { q: { en: 'What is 983 × 1018?', hi: '983 × 1018 क्या है?' , exp: 'Base 1000. 983 is -17 from the base, 1018 is +18 from the base. Cross-step: 983 + (+18) = 1001. Multiply the deviations: (-17) × (+18) = -306. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 1001 × 1000 + (-306) = 1000694.' }, options: ['1000694', '1001694', '1000594', '1004694'], correct: 0 },
    { q: { en: 'What is 973 × 981?', hi: '973 × 981 क्या है?' , exp: 'Base 1000. 973 is -27 from the base, 981 is -19 from the base. Cross-step (add one number\'s deviation to the other number): 973 + (-19) = 954. This is the left part of the answer. Multiply the two deviations: (-27) × (-19) = 513. This is the right part (padded to 3 digits: 513). Combine: 954 and 513 → 954513.' }, options: ['955513', '954513', '954613', '958513'], correct: 1 },
    { q: { en: 'What is 952 × 961?', hi: '952 × 961 क्या है?' , exp: 'Base 1000. 952 is -48 from the base, 961 is -39 from the base. Cross-step: 952 + (-39) = 913. Multiply the deviations: (-48) × (-39) = 1872. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 913 × 1000 + (1872) = 914872.' }, options: ['915872', '914972', '914872', '918872'], correct: 2 },
    { q: { en: 'What is 1041 × 1052?', hi: '1041 × 1052 क्या है?' , exp: 'Base 1000. 1041 is +41 from the base, 1052 is +52 from the base. Cross-step: 1041 + (+52) = 1093. Multiply the deviations: (+41) × (+52) = 2132. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 1093 × 1000 + (2132) = 1095132.' }, options: ['1096132', '1095232', '1099132', '1095132'], correct: 3 },
    { q: { en: 'What is 942 × 956?', hi: '942 × 956 क्या है?' , exp: 'Base 1000. 942 is -58 from the base, 956 is -44 from the base. Cross-step: 942 + (-44) = 898. Multiply the deviations: (-58) × (-44) = 2552. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 898 × 1000 + (2552) = 900552.' }, options: ['900552', '901552', '900652', '904552'], correct: 0 },
    { q: { en: 'What is 961 × 1036?', hi: '961 × 1036 क्या है?' , exp: 'Base 1000. 961 is -39 from the base, 1036 is +36 from the base. Cross-step: 961 + (+36) = 997. Multiply the deviations: (-39) × (+36) = -1404. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 997 × 1000 + (-1404) = 995596.' }, options: ['996596', '995596', '995496', '999596'], correct: 1 },
    { q: { en: 'What is 954 × 1030?', hi: '954 × 1030 क्या है?' , exp: 'Base 1000. 954 is -46 from the base, 1030 is +30 from the base. Cross-step: 954 + (+30) = 984. Multiply the deviations: (-46) × (+30) = -1380. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 984 × 1000 + (-1380) = 982620.' }, options: ['983620', '982520', '982620', '986620'], correct: 2 },
    { q: { en: 'What is 965 × 1030?', hi: '965 × 1030 क्या है?' , exp: 'Base 1000. 965 is -35 from the base, 1030 is +30 from the base. Cross-step: 965 + (+30) = 995. Multiply the deviations: (-35) × (+30) = -1050. Since this doesn\'t fit cleanly as a simple 3-digit right part, combine algebraically: 995 × 1000 + (-1050) = 993950.' }, options: ['994950', '993850', '997950', '993950'], correct: 3 },
  ],
  l1_06: [
    { q: { en: 'The digit sum of 7654 is?', hi: '7654 का अंक योग है?' , exp: '7+6+5+4=22, 2+2=4. Digit sum reduces to a single digit by repeated addition.' }, options: ['4','13','22','7'], correct: 0 },
    { q: { en: 'Digit sum verification is called which Vedic principle?', hi: 'अंक योग सत्यापन किस वैदिक सिद्धांत को कहते हैं?' , exp: 'Gunita Samuchyah — meaning \'the product of the sum equals the sum of the products\' — is the Vedic basis for digit-sum verification.' }, options: ['Nikhilam','Gunita Samuchyah','Anurupyena','Vilokanam'], correct: 1 },
    { q: { en: 'What digit sum check applies to multiplication a × b = c?', hi: 'गुणन a × b = c पर कौन सी अंक योग जांच लागू होती है?' , exp: 'DS(a) × DS(b) = DS(c). If both sides don\'t match, the multiplication is wrong.' }, options: ['DS(a)+DS(b)=DS(c)','DS(a)×DS(b)=DS(c)','DS(a)−DS(b)=DS(c)','DS(a)÷DS(b)=DS(c)'], correct: 1 },
    { q: { en: 'The digit sum of 18 is?', hi: '18 का अंक योग है?' , exp: '1+8=9. In the Vedic convention, digit sum 9 is written as 0 (since 9 ≡ 0 mod 9).' }, options: ['0','8','7','6'], correct: 0 },
    { q: { en: 'Verify 24 × 13 = 312 using digit sums', hi: 'अंक योग से 24 × 13 = 312 की जांच करें' , exp: 'DS(24)=6, DS(13)=4, DS(312)=6. 6×4=24, DS(24)=6 ✓ — the calculation is correct.' }, options: [{ en: 'Correct', hi: 'सही' }, { en: 'Wrong', hi: 'गलत' }], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 58?', hi: '58 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 58 (5+8=13) → 13 (1+3=4) → 4. The digit sum of 58 is 4.' }, options: ['4', '9', '5', '7'], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 52?', hi: '52 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 52 (5+2=7) → 7. The digit sum of 52 is 7.' }, options: ['8', '7', '1', '3'], correct: 1 },
    { q: { en: 'What is the digit sum (digital root) of 39?', hi: '39 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 39 (3+9=12) → 12 (1+2=3) → 3. The digit sum of 39 is 3.' }, options: ['8', '4', '3', '6'], correct: 2 },
    { q: { en: 'What is the digit sum (digital root) of 31?', hi: '31 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 31 (3+1=4) → 4. The digit sum of 31 is 4.' }, options: ['9', '5', '7', '4'], correct: 3 },
    { q: { en: 'What is the digit sum (digital root) of 59?', hi: '59 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 59 (5+9=14) → 14 (1+4=5) → 5. The digit sum of 59 is 5.' }, options: ['5', '8', '1', '6'], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 83?', hi: '83 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 83 (8+3=11) → 11 (1+1=2) → 2. The digit sum of 83 is 2.' }, options: ['3', '2', '5', '7'], correct: 1 },
    { q: { en: 'What is the digit sum (digital root) of 98?', hi: '98 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 98 (9+8=17) → 17 (1+7=8) → 8. The digit sum of 98 is 8.' }, options: ['9', '2', '8', '4'], correct: 2 },
    { q: { en: 'What is the digit sum (digital root) of 390?', hi: '390 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 390 (3+9+0=12) → 12 (1+2=3) → 3. The digit sum of 390 is 3.' }, options: ['8', '4', '6', '3'], correct: 3 },
    { q: { en: 'What is the digit sum (digital root) of 666?', hi: '666 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly: 666 → ... → 9. On VedicMindAI, a digit sum that reduces to 9 is shown as 0 (not 9) — this follows the \'casting out nines\' convention, since a digit sum of 9 means the number is exactly divisible by 9, which casting-out-nines treats as a remainder of 0.' }, options: ['0', '1', '3', '5'], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 383?', hi: '383 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 383 (3+8+3=14) → 14 (1+4=5) → 5. The digit sum of 383 is 5.' }, options: ['8', '5', '1', '6'], correct: 1 },
    { q: { en: 'What is the digit sum (digital root) of 492?', hi: '492 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 492 (4+9+2=15) → 15 (1+5=6) → 6. The digit sum of 492 is 6.' }, options: ['9', '2', '6', '7'], correct: 2 },
    { q: { en: 'What is the digit sum (digital root) of 972?', hi: '972 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly: 972 → ... → 9. On VedicMindAI, a digit sum that reduces to 9 is shown as 0 (not 9) — this follows the \'casting out nines\' convention, since a digit sum of 9 means the number is exactly divisible by 9, which casting-out-nines treats as a remainder of 0.' }, options: ['1', '3', '5', '0'], correct: 3 },
    { q: { en: 'What is the digit sum (digital root) of 849?', hi: '849 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 849 (8+4+9=21) → 21 (2+1=3) → 3. The digit sum of 849 is 3.' }, options: ['3', '8', '4', '6'], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 881?', hi: '881 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 881 (8+8+1=17) → 17 (1+7=8) → 8. The digit sum of 881 is 8.' }, options: ['9', '8', '2', '4'], correct: 1 },
    { q: { en: 'What is the digit sum (digital root) of 76553?', hi: '76553 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 76553 (7+6+5+5+3=26) → 26 (2+6=8) → 8. The digit sum of 76553 is 8.' }, options: ['9', '2', '8', '4'], correct: 2 },
    { q: { en: 'What is the digit sum (digital root) of 2222?', hi: '2222 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 2222 (2+2+2+2=8) → 8. The digit sum of 2222 is 8.' }, options: ['9', '2', '4', '8'], correct: 3 },
    { q: { en: 'What is the digit sum (digital root) of 33646?', hi: '33646 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 33646 (3+3+6+4+6=22) → 22 (2+2=4) → 4. The digit sum of 33646 is 4.' }, options: ['4', '9', '5', '7'], correct: 0 },
    { q: { en: 'What is the digit sum (digital root) of 87714?', hi: '87714 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly: 87714 → ... → 9. On VedicMindAI, a digit sum that reduces to 9 is shown as 0 (not 9) — this follows the \'casting out nines\' convention, since a digit sum of 9 means the number is exactly divisible by 9, which casting-out-nines treats as a remainder of 0.' }, options: ['1', '0', '3', '5'], correct: 1 },
    { q: { en: 'What is the digit sum (digital root) of 3403?', hi: '3403 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 3403 (3+4+0+3=10) → 10 (1+0=1) → 1. The digit sum of 3403 is 1.' }, options: ['2', '4', '1', '6'], correct: 2 },
    { q: { en: 'What is the digit sum (digital root) of 58592?', hi: '58592 का अंक योग (डिजिटल रूट) क्या है?' , exp: 'Add the digits repeatedly until one digit remains: 58592 (5+8+5+9+2=29) → 29 (2+9=11) → 11 (1+1=2) → 2. The digit sum of 58592 is 2.' }, options: ['3', '5', '7', '2'], correct: 3 },
  ],
  l1_07: [
    { q: { en: 'Urdhva-Tiryagbhyam means?', hi: 'ऊर्ध्व-तिर्यग्भ्याम् का अर्थ है?' , exp: '\'Vertically and crosswise\' — the sutra describes the pattern of multiplications: vertical (units×units, tens×tens) and crosswise (units×tens + tens×units).' }, options: ['All from 9','Vertically and crosswise','By one more','Proportionality'], correct: 1 },
    { q: { en: 'Calculate 13 × 14 using Urdhva', hi: 'ऊर्ध्व विधि से 13 × 14 निकालें' , exp: 'Units: 3×4=12, write 2 carry 1. Cross: 1×4+3×1=7, +1=8. Tens: 1×1=1. Answer: 182.' }, options: ['172','182','192','162'], correct: 1 },
    { q: { en: 'In AB × CD, the middle step computes?', hi: 'AB × CD में, मध्य चरण क्या गणना करता है?' , exp: 'The middle (crosswise) step computes A×D + B×C — the sum of the two diagonal products.' }, options: ['A×C','B×D','A×D + B×C','A×B × C×D'], correct: 2 },
    { q: { en: 'Calculate 24 × 31', hi: '24 × 31 निकालें' , exp: 'Units: 4×1=4. Cross: 2×1+4×3=14, write 4 carry 1. Tens: 2×3=6+1=7. Answer: 744.' }, options: ['734','744','754','764'], correct: 1 },
    { q: { en: 'Calculate 32 × 41', hi: '32 × 41 निकालें' , exp: 'Units: 2×1=2. Cross: 3×1+2×4=11, write 1 carry 1. Tens: 3×4=12+1=13. Answer: 1312.' }, options: ['1302','1312','1322','1332'], correct: 1 },
    { q: { en: 'What is 15 × 21?', hi: '15 × 21 क्या है?' , exp: 'Split 15 into tens and units: 1 and 5. Split 21 into tens and units: 2 and 1. Step 1 (units × units): 5 × 1 = 5. Write down 5, carry 0. Step 2 (cross-multiply and add): (1 × 1) + (5 × 2) = 11, plus the carried 0 = 11. Write down 1, carry 1. Step 3 (tens × tens): 1 × 2 = 2, plus the carried 1 = 3. Combine the three parts left to right: 3, 1, 5 → 315.' }, options: ['315', '325', '215', '365'], correct: 0 },
    { q: { en: 'What is 10 × 11?', hi: '10 × 11 क्या है?' , exp: 'Split 10 into tens and units: 1 and 0. Split 11 into tens and units: 1 and 1. Step 1 (units × units): 0 × 1 = 0. Write down 0, carry 0. Step 2 (cross-multiply and add): (1 × 1) + (0 × 1) = 1, plus the carried 0 = 1. Write down 1, carry 0. Step 3 (tens × tens): 1 × 1 = 1, plus the carried 0 = 1. Combine the three parts left to right: 1, 1, 0 → 110.' }, options: ['120', '110', '10', '160'], correct: 1 },
    { q: { en: 'What is 24 × 26?', hi: '24 × 26 क्या है?' , exp: 'Split 24 into tens and units: 2 and 4. Split 26 into tens and units: 2 and 6. Step 1 (units × units): 4 × 6 = 24. Write down 4, carry 2. Step 2 (cross-multiply and add): (2 × 6) + (4 × 2) = 20, plus the carried 2 = 22. Write down 2, carry 2. Step 3 (tens × tens): 2 × 2 = 4, plus the carried 2 = 6. Combine the three parts left to right: 6, 2, 4 → 624.' }, options: ['634', '524', '624', '674'], correct: 2 },
    { q: { en: 'What is 11 × 15?', hi: '11 × 15 क्या है?' , exp: 'Split 11 into tens and units: 1 and 1. Split 15 into tens and units: 1 and 5. Step 1 (units × units): 1 × 5 = 5. Write down 5, carry 0. Step 2 (cross-multiply and add): (1 × 5) + (1 × 1) = 6, plus the carried 0 = 6. Write down 6, carry 0. Step 3 (tens × tens): 1 × 1 = 1, plus the carried 0 = 1. Combine the three parts left to right: 1, 6, 5 → 165.' }, options: ['175', '65', '215', '165'], correct: 3 },
    { q: { en: 'What is 21 × 24?', hi: '21 × 24 क्या है?' , exp: 'Split 21 into tens and units: 2 and 1. Split 24 into tens and units: 2 and 4. Step 1 (units × units): 1 × 4 = 4. Write down 4, carry 0. Step 2 (cross-multiply and add): (2 × 4) + (1 × 2) = 10, plus the carried 0 = 10. Write down 0, carry 1. Step 3 (tens × tens): 2 × 2 = 4, plus the carried 1 = 5. Combine the three parts left to right: 5, 0, 4 → 504.' }, options: ['504', '514', '404', '554'], correct: 0 },
    { q: { en: 'What is 14 × 18?', hi: '14 × 18 क्या है?' , exp: 'Split 14 into tens and units: 1 and 4. Split 18 into tens and units: 1 and 8. Step 1 (units × units): 4 × 8 = 32. Write down 2, carry 3. Step 2 (cross-multiply and add): (1 × 8) + (4 × 1) = 12, plus the carried 3 = 15. Write down 5, carry 1. Step 3 (tens × tens): 1 × 1 = 1, plus the carried 1 = 2. Combine the three parts left to right: 2, 5, 2 → 252.' }, options: ['262', '252', '152', '302'], correct: 1 },
    { q: { en: 'What is 25 × 26?', hi: '25 × 26 क्या है?' , exp: 'Split 25 into tens and units: 2 and 5. Split 26 into tens and units: 2 and 6. Step 1 (units × units): 5 × 6 = 30. Write down 0, carry 3. Step 2 (cross-multiply and add): (2 × 6) + (5 × 2) = 22, plus the carried 3 = 25. Write down 5, carry 2. Step 3 (tens × tens): 2 × 2 = 4, plus the carried 2 = 6. Combine the three parts left to right: 6, 5, 0 → 650.' }, options: ['660', '550', '650', '700'], correct: 2 },
    { q: { en: 'What is 32 × 34?', hi: '32 × 34 क्या है?' , exp: 'Split 32 into tens and units: 3 and 2. Split 34 into tens and units: 3 and 4. Step 1 (units × units): 2 × 4 = 8. Write down 8, carry 0. Step 2 (cross-multiply and add): (3 × 4) + (2 × 3) = 18, plus the carried 0 = 18. Write down 8, carry 1. Step 3 (tens × tens): 3 × 3 = 9, plus the carried 1 = 10. Combine the three parts left to right: 10, 8, 8 → 1088.' }, options: ['1098', '988', '1138', '1088'], correct: 3 },
    { q: { en: 'What is 40 × 52?', hi: '40 × 52 क्या है?' , exp: 'Split 40 into tens and units: 4 and 0. Split 52 into tens and units: 5 and 2. Step 1 (units × units): 0 × 2 = 0. Write down 0, carry 0. Step 2 (cross-multiply and add): (4 × 2) + (0 × 5) = 8, plus the carried 0 = 8. Write down 8, carry 0. Step 3 (tens × tens): 4 × 5 = 20, plus the carried 0 = 20. Combine the three parts left to right: 20, 8, 0 → 2080.' }, options: ['2080', '2090', '1980', '2130'], correct: 0 },
    { q: { en: 'What is 44 × 48?', hi: '44 × 48 क्या है?' , exp: 'Split 44 into tens and units: 4 and 4. Split 48 into tens and units: 4 and 8. Step 1 (units × units): 4 × 8 = 32. Write down 2, carry 3. Step 2 (cross-multiply and add): (4 × 8) + (4 × 4) = 48, plus the carried 3 = 51. Write down 1, carry 5. Step 3 (tens × tens): 4 × 4 = 16, plus the carried 5 = 21. Combine the three parts left to right: 21, 1, 2 → 2112.' }, options: ['2122', '2112', '2012', '2162'], correct: 1 },
    { q: { en: 'What is 34 × 48?', hi: '34 × 48 क्या है?' , exp: 'Split 34 into tens and units: 3 and 4. Split 48 into tens and units: 4 and 8. Step 1 (units × units): 4 × 8 = 32. Write down 2, carry 3. Step 2 (cross-multiply and add): (3 × 8) + (4 × 4) = 40, plus the carried 3 = 43. Write down 3, carry 4. Step 3 (tens × tens): 3 × 4 = 12, plus the carried 4 = 16. Combine the three parts left to right: 16, 3, 2 → 1632.' }, options: ['1642', '1532', '1632', '1682'], correct: 2 },
    { q: { en: 'What is 28 × 28?', hi: '28 × 28 क्या है?' , exp: 'Split 28 into tens and units: 2 and 8. Split 28 into tens and units: 2 and 8. Step 1 (units × units): 8 × 8 = 64. Write down 4, carry 6. Step 2 (cross-multiply and add): (2 × 8) + (8 × 2) = 32, plus the carried 6 = 38. Write down 8, carry 3. Step 3 (tens × tens): 2 × 2 = 4, plus the carried 3 = 7. Combine the three parts left to right: 7, 8, 4 → 784.' }, options: ['794', '684', '834', '784'], correct: 3 },
    { q: { en: 'What is 42 × 52?', hi: '42 × 52 क्या है?' , exp: 'Split 42 into tens and units: 4 and 2. Split 52 into tens and units: 5 and 2. Step 1 (units × units): 2 × 2 = 4. Write down 4, carry 0. Step 2 (cross-multiply and add): (4 × 2) + (2 × 5) = 18, plus the carried 0 = 18. Write down 8, carry 1. Step 3 (tens × tens): 4 × 5 = 20, plus the carried 1 = 21. Combine the three parts left to right: 21, 8, 4 → 2184.' }, options: ['2184', '2194', '2084', '2234'], correct: 0 },
    { q: { en: 'What is 23 × 43?', hi: '23 × 43 क्या है?' , exp: 'Split 23 into tens and units: 2 and 3. Split 43 into tens and units: 4 and 3. Step 1 (units × units): 3 × 3 = 9. Write down 9, carry 0. Step 2 (cross-multiply and add): (2 × 3) + (3 × 4) = 18, plus the carried 0 = 18. Write down 8, carry 1. Step 3 (tens × tens): 2 × 4 = 8, plus the carried 1 = 9. Combine the three parts left to right: 9, 8, 9 → 989.' }, options: ['999', '989', '889', '1039'], correct: 1 },
    { q: { en: 'What is 65 × 92?', hi: '65 × 92 क्या है?' , exp: 'Split 65 into tens and units: 6 and 5. Split 92 into tens and units: 9 and 2. Step 1 (units × units): 5 × 2 = 10. Write down 0, carry 1. Step 2 (cross-multiply and add): (6 × 2) + (5 × 9) = 57, plus the carried 1 = 58. Write down 8, carry 5. Step 3 (tens × tens): 6 × 9 = 54, plus the carried 5 = 59. Combine the three parts left to right: 59, 8, 0 → 5980.' }, options: ['5990', '5880', '5980', '6030'], correct: 2 },
    { q: { en: 'What is 59 × 61?', hi: '59 × 61 क्या है?' , exp: 'Split 59 into tens and units: 5 and 9. Split 61 into tens and units: 6 and 1. Step 1 (units × units): 9 × 1 = 9. Write down 9, carry 0. Step 2 (cross-multiply and add): (5 × 1) + (9 × 6) = 59, plus the carried 0 = 59. Write down 9, carry 5. Step 3 (tens × tens): 5 × 6 = 30, plus the carried 5 = 35. Combine the three parts left to right: 35, 9, 9 → 3599.' }, options: ['3609', '3499', '3649', '3599'], correct: 3 },
    { q: { en: 'What is 75 × 85?', hi: '75 × 85 क्या है?' , exp: 'Split 75 into tens and units: 7 and 5. Split 85 into tens and units: 8 and 5. Step 1 (units × units): 5 × 5 = 25. Write down 5, carry 2. Step 2 (cross-multiply and add): (7 × 5) + (5 × 8) = 75, plus the carried 2 = 77. Write down 7, carry 7. Step 3 (tens × tens): 7 × 8 = 56, plus the carried 7 = 63. Combine the three parts left to right: 63, 7, 5 → 6375.' }, options: ['6375', '6385', '6275', '6425'], correct: 0 },
    { q: { en: 'What is 72 × 87?', hi: '72 × 87 क्या है?' , exp: 'Split 72 into tens and units: 7 and 2. Split 87 into tens and units: 8 and 7. Step 1 (units × units): 2 × 7 = 14. Write down 4, carry 1. Step 2 (cross-multiply and add): (7 × 7) + (2 × 8) = 65, plus the carried 1 = 66. Write down 6, carry 6. Step 3 (tens × tens): 7 × 8 = 56, plus the carried 6 = 62. Combine the three parts left to right: 62, 6, 4 → 6264.' }, options: ['6274', '6264', '6164', '6314'], correct: 1 },
    { q: { en: 'What is 74 × 76?', hi: '74 × 76 क्या है?' , exp: 'Split 74 into tens and units: 7 and 4. Split 76 into tens and units: 7 and 6. Step 1 (units × units): 4 × 6 = 24. Write down 4, carry 2. Step 2 (cross-multiply and add): (7 × 6) + (4 × 7) = 70, plus the carried 2 = 72. Write down 2, carry 7. Step 3 (tens × tens): 7 × 7 = 49, plus the carried 7 = 56. Combine the three parts left to right: 56, 2, 4 → 5624.' }, options: ['5634', '5524', '5624', '5674'], correct: 2 },
    { q: { en: 'What is 78 × 91?', hi: '78 × 91 क्या है?' , exp: 'Split 78 into tens and units: 7 and 8. Split 91 into tens and units: 9 and 1. Step 1 (units × units): 8 × 1 = 8. Write down 8, carry 0. Step 2 (cross-multiply and add): (7 × 1) + (8 × 9) = 79, plus the carried 0 = 79. Write down 9, carry 7. Step 3 (tens × tens): 7 × 9 = 63, plus the carried 7 = 70. Combine the three parts left to right: 70, 9, 8 → 7098.' }, options: ['7108', '6998', '7148', '7098'], correct: 3 },
  ],
  l1_08: [
    { q: { en: 'Calculate 56 × 11', hi: '56 × 11 निकालें' , exp: 'Rule: A|(A+B)|B → 5|(5+6)|6 = 5|11|6. Carry the 1: 616.' }, options: ['606','616','626','596'], correct: 1 },
    { q: { en: 'The rule for multiplying a 2-digit number AB by 11 is?', hi: '2-अंकीय संख्या AB को 11 से गुणा करने का नियम है?' , exp: 'Write A, then A+B (carry if ≥10), then B. This gives the full answer directly.' }, options: ['A | A+B | B','A+B | A | B','B | A+B | A','A | B | A+B'], correct: 0 },
    { q: { en: 'Calculate 73 × 11', hi: '73 × 11 निकालें' , exp: '7|(7+3)|3 = 7|10|3 → carry: 803.' }, options: ['793','803','813','783'], correct: 1 },
    { q: { en: 'Calculate 92 × 11', hi: '92 × 11 निकालें' , exp: '9|(9+2)|2 = 9|11|2 → carry: 1012.' }, options: ['1002','1012','1022','992'], correct: 1 },
    { q: { en: 'Calculate 45 × 12', hi: '45 × 12 निकालें' , exp: '45×12 = 45×11 + 45 = 495+45 = 540. Or direct Urdhva: 4×1|4×2+5×1|5×2 = 4|13|10 → 540.' }, options: ['530','540','550','520'], correct: 1 },
    { q: { en: 'What is 41 × 11?', hi: '41 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 41: this gives 451. Quick check: 41 × 11 = 41 × 10 + 41 = 410 + 41 = 451.' }, options: ['451', '461', '441', '452'], correct: 0 },
    { q: { en: 'What is 21 × 11?', hi: '21 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 21: this gives 231. Quick check: 21 × 11 = 21 × 10 + 21 = 210 + 21 = 231.' }, options: ['241', '231', '221', '232'], correct: 1 },
    { q: { en: 'What is 45 × 12?', hi: '45 × 12 क्या है?' , exp: '×12 shortcut: 45 × 12 = 45 × 10 + 45 × 2 = 450 + 90 = 540.' }, options: ['550', '530', '540', '541'], correct: 2 },
    { q: { en: 'What is 23 × 11?', hi: '23 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 23: this gives 253. Quick check: 23 × 11 = 23 × 10 + 23 = 230 + 23 = 253.' }, options: ['263', '243', '254', '253'], correct: 3 },
    { q: { en: 'What is 30 × 12?', hi: '30 × 12 क्या है?' , exp: '×12 shortcut: 30 × 12 = 30 × 10 + 30 × 2 = 300 + 60 = 360.' }, options: ['360', '370', '350', '361'], correct: 0 },
    { q: { en: 'What is 28 × 11?', hi: '28 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 28: this gives 308. Quick check: 28 × 11 = 28 × 10 + 28 = 280 + 28 = 308.' }, options: ['318', '308', '298', '309'], correct: 1 },
    { q: { en: 'What is 47 × 11?', hi: '47 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 47: this gives 517. Quick check: 47 × 11 = 47 × 10 + 47 = 470 + 47 = 517.' }, options: ['527', '507', '517', '518'], correct: 2 },
    { q: { en: 'What is 57 × 12?', hi: '57 × 12 क्या है?' , exp: '×12 shortcut: 57 × 12 = 57 × 10 + 57 × 2 = 570 + 114 = 684.' }, options: ['694', '674', '784', '684'], correct: 3 },
    { q: { en: 'What is 174 × 12?', hi: '174 × 12 क्या है?' , exp: '×12 shortcut: 174 × 12 = 174 × 10 + 174 × 2 = 1740 + 348 = 2088.' }, options: ['2088', '2098', '2078', '2188'], correct: 0 },
    { q: { en: 'What is 141 × 12?', hi: '141 × 12 क्या है?' , exp: '×12 shortcut: 141 × 12 = 141 × 10 + 141 × 2 = 1410 + 282 = 1692.' }, options: ['1702', '1692', '1682', '1792'], correct: 1 },
    { q: { en: 'What is 66 × 12?', hi: '66 × 12 क्या है?' , exp: '×12 shortcut: 66 × 12 = 66 × 10 + 66 × 2 = 660 + 132 = 792.' }, options: ['802', '782', '792', '892'], correct: 2 },
    { q: { en: 'What is 153 × 12?', hi: '153 × 12 क्या है?' , exp: '×12 shortcut: 153 × 12 = 153 × 10 + 153 × 2 = 1530 + 306 = 1836.' }, options: ['1846', '1826', '1936', '1836'], correct: 3 },
    { q: { en: 'What is 168 × 12?', hi: '168 × 12 क्या है?' , exp: '×12 shortcut: 168 × 12 = 168 × 10 + 168 × 2 = 1680 + 336 = 2016.' }, options: ['2016', '2026', '2006', '2116'], correct: 0 },
    { q: { en: 'What is 134 × 12?', hi: '134 × 12 क्या है?' , exp: '×12 shortcut: 134 × 12 = 134 × 10 + 134 × 2 = 1340 + 268 = 1608.' }, options: ['1618', '1608', '1598', '1708'], correct: 1 },
    { q: { en: 'What is 371 × 11?', hi: '371 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 371: this gives 4081. Quick check: 371 × 11 = 371 × 10 + 371 = 3710 + 371 = 4081.' }, options: ['4091', '4071', '4081', '4181'], correct: 2 },
    { q: { en: 'What is 542 × 12?', hi: '542 × 12 क्या है?' , exp: '×12 shortcut: 542 × 12 = 542 × 10 + 542 × 2 = 5420 + 1084 = 6504.' }, options: ['6514', '6494', '6604', '6504'], correct: 3 },
    { q: { en: 'What is 846 × 12?', hi: '846 × 12 क्या है?' , exp: '×12 shortcut: 846 × 12 = 846 × 10 + 846 × 2 = 8460 + 1692 = 10152.' }, options: ['10152', '10162', '10142', '10252'], correct: 0 },
    { q: { en: 'What is 206 × 12?', hi: '206 × 12 क्या है?' , exp: '×12 shortcut: 206 × 12 = 206 × 10 + 206 × 2 = 2060 + 412 = 2472.' }, options: ['2482', '2472', '2462', '2572'], correct: 1 },
    { q: { en: 'What is 714 × 11?', hi: '714 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 714: this gives 7854. Quick check: 714 × 11 = 714 × 10 + 714 = 7140 + 714 = 7854.' }, options: ['7864', '7844', '7854', '7954'], correct: 2 },
    { q: { en: 'What is 905 × 11?', hi: '905 × 11 क्या है?' , exp: '×11 shortcut: write the first digit, then each pair of neighbouring digits added together (carrying if the sum is 10 or more), then the last digit. For 905: this gives 9955. Quick check: 905 × 11 = 905 × 10 + 905 = 9050 + 905 = 9955.' }, options: ['9965', '9945', '10055', '9955'], correct: 3 },
  ],
  l1_09: [
    { q: { en: 'The shortcut for n × 9 is?', hi: 'n × 9 का शॉर्टकट है?' , exp: 'n × 9 = n × (10−1) = n×10 − n. This is faster than direct multiplication.' }, options: ['n × 8 + n','n × 10 − n','n × 10 + n','n × 8 − n'], correct: 1 },
    { q: { en: 'Calculate 6 × 9', hi: '6 × 9 निकालें' , exp: '6×10 − 6 = 60 − 6 = 54.' }, options: ['52','54','56','58'], correct: 1 },
    { q: { en: 'Calculate 34 × 9', hi: '34 × 9 निकालें' , exp: '34×10 − 34 = 340 − 34 = 306.' }, options: ['296','306','316','286'], correct: 1 },
    { q: { en: 'Calculate 67 × 99', hi: '67 × 99 निकालें' , exp: '67×100 − 67 = 6700 − 67 = 6633.' }, options: ['6533','6633','6733','6433'], correct: 1 },
    { q: { en: 'To multiply by 999, the shortcut is n × 1000 − n. What is 25 × 999?', hi: '999 से गुणा करने का शॉर्टकट है n × 1000 − n. 25 × 999 क्या है?' }, options: ['24875','24975','25075','24775'], correct: 1 , exp: '25 x 1000 - 25 = 25000 - 25 = 24975.' },
    { q: { en: 'What is 51 × 9?', hi: '51 × 9 क्या है?' , exp: '51 × 9 = 51 × 10 − 51 = 510 − 51 = 459.' }, options: ['459', '469', '449', '561'], correct: 0 },
    { q: { en: 'What is 75 × 9?', hi: '75 × 9 क्या है?' , exp: '75 × 9 = 75 × 10 − 75 = 750 − 75 = 675.' }, options: ['685', '675', '665', '825'], correct: 1 },
    { q: { en: 'What is 89 × 9?', hi: '89 × 9 क्या है?' , exp: '89 × 9 = 89 × 10 − 89 = 890 − 89 = 801.' }, options: ['811', '791', '801', '979'], correct: 2 },
    { q: { en: 'What is 11 × 9?', hi: '11 × 9 क्या है?' , exp: '11 × 9 = 11 × 10 − 11 = 110 − 11 = 99.' }, options: ['109', '89', '121', '99'], correct: 3 },
    { q: { en: 'What is 43 × 9?', hi: '43 × 9 क्या है?' , exp: '43 × 9 = 43 × 10 − 43 = 430 − 43 = 387.' }, options: ['387', '397', '377', '473'], correct: 0 },
    { q: { en: 'What is 29 × 9?', hi: '29 × 9 क्या है?' , exp: '29 × 9 = 29 × 10 − 29 = 290 − 29 = 261.' }, options: ['271', '261', '251', '319'], correct: 1 },
    { q: { en: 'What is 35 × 9?', hi: '35 × 9 क्या है?' , exp: '35 × 9 = 35 × 10 − 35 = 350 − 35 = 315.' }, options: ['325', '305', '315', '385'], correct: 2 },
    { q: { en: 'What is 144 × 99?', hi: '144 × 99 क्या है?' , exp: '144 × 99 = 144 × 100 − 144 = 14400 − 144 = 14256.' }, options: ['14356', '14156', '14544', '14256'], correct: 3 },
    { q: { en: 'What is 54 × 99?', hi: '54 × 99 क्या है?' , exp: '54 × 99 = 54 × 100 − 54 = 5400 − 54 = 5346.' }, options: ['5346', '5446', '5246', '5454'], correct: 0 },
    { q: { en: 'What is 112 × 99?', hi: '112 × 99 क्या है?' , exp: '112 × 99 = 112 × 100 − 112 = 11200 − 112 = 11088.' }, options: ['11188', '11088', '10988', '11312'], correct: 1 },
    { q: { en: 'What is 272 × 99?', hi: '272 × 99 क्या है?' , exp: '272 × 99 = 272 × 100 − 272 = 27200 − 272 = 26928.' }, options: ['27028', '26828', '26928', '27472'], correct: 2 },
    { q: { en: 'What is 38 × 99?', hi: '38 × 99 क्या है?' , exp: '38 × 99 = 38 × 100 − 38 = 3800 − 38 = 3762.' }, options: ['3862', '3662', '3838', '3762'], correct: 3 },
    { q: { en: 'What is 314 × 99?', hi: '314 × 99 क्या है?' , exp: '314 × 99 = 314 × 100 − 314 = 31400 − 314 = 31086.' }, options: ['31086', '31186', '30986', '31714'], correct: 0 },
    { q: { en: 'What is 109 × 99?', hi: '109 × 99 क्या है?' , exp: '109 × 99 = 109 × 100 − 109 = 10900 − 109 = 10791.' }, options: ['10891', '10791', '10691', '11009'], correct: 1 },
    { q: { en: 'What is 268 × 999?', hi: '268 × 999 क्या है?' , exp: '268 × 999 = 268 × 1000 − 268 = 268000 − 268 = 267732.' }, options: ['268732', '266732', '267732', '268268'], correct: 2 },
    { q: { en: 'What is 22 × 999?', hi: '22 × 999 क्या है?' , exp: '22 × 999 = 22 × 1000 − 22 = 22000 − 22 = 21978.' }, options: ['22978', '20978', '22022', '21978'], correct: 3 },
    { q: { en: 'What is 426 × 999?', hi: '426 × 999 क्या है?' , exp: '426 × 999 = 426 × 1000 − 426 = 426000 − 426 = 425574.' }, options: ['425574', '426574', '424574', '426426'], correct: 0 },
    { q: { en: 'What is 364 × 999?', hi: '364 × 999 क्या है?' , exp: '364 × 999 = 364 × 1000 − 364 = 364000 − 364 = 363636.' }, options: ['364636', '363636', '362636', '364364'], correct: 1 },
    { q: { en: 'What is 279 × 999?', hi: '279 × 999 क्या है?' , exp: '279 × 999 = 279 × 1000 − 279 = 279000 − 279 = 278721.' }, options: ['279721', '277721', '278721', '279279'], correct: 2 },
    { q: { en: 'What is 197 × 999?', hi: '197 × 999 क्या है?' , exp: '197 × 999 = 197 × 1000 − 197 = 197000 − 197 = 196803.' }, options: ['197803', '195803', '197197', '196803'], correct: 3 },
  ],
  l2_01: [
    { q: { en: 'Using the Paravartya method, divide 79038 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 79038 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 7 Step 3: 9 + (-1×7) = 2 Step 4: 0 + (-1×2) = -2 Step 5: 3 + (-1×-2) = 5 Step 6: Remainder digit: 8 + (-1×5) = 3 Step 7: -2 is negative → borrow 1 from left (2→1), +10 = 8 Step 8: Answer — Q = 7185, R = 3 (check: 11×7185+3 = 79038)' }, options: ['Q = 7184, R = 3', 'Q = 7185, R = 4', 'Q = 7185, R = 3', 'Q = 7186, R = 2'], correct: 2 },
    { q: { en: 'Using the Paravartya method, divide 196 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 196 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 1 Step 3: 9 + (-1×1) = 8 Step 4: Remainder digit: 6 + (-1×8) = -2 Step 5: Remainder -2 negative → borrow 1 from quotient (18→17), +1×11 = 9 Step 6: Answer — Q = 17, R = 9 (check: 11×17+9 = 196)' }, options: ['Q = 17, R = 10', 'Q = 17, R = 9', 'Q = 18, R = 8', 'Q = 16, R = 9'], correct: 1 },
    { q: { en: 'Using the Paravartya method, divide 357 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 357 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 3 Step 3: 5 + (-2×3) = -1 Step 4: Remainder digit: 7 + (-2×-1) = 9 Step 5: -1 is negative → borrow 1 from left (3→2), +10 = 9 Step 6: Answer — Q = 29, R = 9 (check: 12×29+9 = 357)' }, options: ['Q = 28, R = 9', 'Q = 29, R = 10', 'Q = 29, R = 9', 'Q = 30, R = 7'], correct: 2 },
    { q: { en: 'Using the Paravartya method, divide 71411 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 71411 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 7 Step 3: 1 + (-1×7) = -6 Step 4: 4 + (-1×-6) = 10 Step 5: 1 + (-1×10) = -9 Step 6: Remainder digit: 1 + (-1×-9) = 10 Step 7: -9 is negative → borrow 1 from left (10→9), +10 = 1 Step 8: -6 is negative → borrow 1 from left (7→6), +10 = 4 Step 9: Answer — Q = 6491, R = 10 (check: 11×6491+10 = 71411)' }, options: ['Q = 6490, R = 10', 'Q = 6491, R = 10', 'Q = 6491, R = 9', 'Q = 6492, R = 9'], correct: 1 },
    { q: { en: 'Using the Paravartya method, divide 1933 by 15. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1933 को 15 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 15 = 10+5, so flag = -5 Step 2: Bring down first digit: 1 Step 3: 9 + (-5×1) = 4 Step 4: 3 + (-5×4) = -17 Step 5: Remainder digit: 3 + (-5×-17) = 88 Step 6: -17 is negative → borrow 1 from left (4→3), +10 = -7 Step 7: -7 is negative → borrow 1 from left (3→2), +10 = 3 Step 8: Remainder 88 ≥ divisor → carry 5 into quotient (123→128), -5×15 = 13 Step 9: Answer — Q = 128, R = 13 (check: 15×128+13 = 1933)' }, options: ['Q = 128, R = 13', 'Q = 129, R = 8', 'Q = 127, R = 13', 'Q = 128, R = 14'], correct: 0 },
    { q: { en: 'Using the Paravartya method, divide 1504 by 16. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1504 को 16 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 16 = 10+6, so flag = -6 Step 2: Bring down first digit: 1 Step 3: 5 + (-6×1) = -1 Step 4: 0 + (-6×-1) = 6 Step 5: Remainder digit: 4 + (-6×6) = -32 Step 6: -1 is negative → borrow 1 from left (1→0), +10 = 9 Step 7: Remainder -32 negative → borrow 2 from quotient (96→94), +2×16 = 0 Step 8: Answer — Q = 94, R = 0 (check: 16×94+0 = 1504)' }, options: ['Q = 94, R = 0', 'Q = 94, R = 1', 'Q = 93, R = 0', 'Q = 95, R = 0'], correct: 0 },
    { q: { en: 'Using the Paravartya method, divide 1999 by 17. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1999 को 17 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 17 = 10+7, so flag = -7 Step 2: Bring down first digit: 1 Step 3: 9 + (-7×1) = 2 Step 4: 9 + (-7×2) = -5 Step 5: Remainder digit: 9 + (-7×-5) = 44 Step 6: -5 is negative → borrow 1 from left (2→1), +10 = 5 Step 7: Remainder 44 ≥ divisor → carry 2 into quotient (115→117), -2×17 = 10 Step 8: Answer — Q = 117, R = 10 (check: 17×117+10 = 1999)' }, options: ['Q = 118, R = 3', 'Q = 117, R = 10', 'Q = 116, R = 10', 'Q = 117, R = 11'], correct: 1 },
    { q: { en: 'Using the Paravartya method, divide 85798 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 85798 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 8 Step 3: 5 + (-1×8) = -3 Step 4: 7 + (-1×-3) = 10 Step 5: 9 + (-1×10) = -1 Step 6: Remainder digit: 8 + (-1×-1) = 9 Step 7: -1 is negative → borrow 1 from left (10→9), +10 = 9 Step 8: -3 is negative → borrow 1 from left (8→7), +10 = 7 Step 9: Answer — Q = 7799, R = 9 (check: 11×7799+9 = 85798)' }, options: ['Q = 7799, R = 10', 'Q = 7798, R = 9', 'Q = 7800, R = 8', 'Q = 7799, R = 9'], correct: 3 },
    { q: { en: 'Using the Paravartya method, divide 468 by 13. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 468 को 13 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 13 = 10+3, so flag = -3 Step 2: Bring down first digit: 4 Step 3: 6 + (-3×4) = -6 Step 4: Remainder digit: 8 + (-3×-6) = 26 Step 5: -6 is negative → borrow 1 from left (4→3), +10 = 4 Step 6: Remainder 26 ≥ divisor → carry 2 into quotient (34→36), -2×13 = 0 Step 7: Answer — Q = 36, R = 0 (check: 13×36+0 = 468)' }, options: ['Q = 36, R = 0', 'Q = 37, R = 0', 'Q = 36, R = 1', 'Q = 35, R = 0'], correct: 0 },
    { q: { en: 'Using the Paravartya method, divide 275 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 275 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 2 Step 3: 7 + (-1×2) = 5 Step 4: Remainder digit: 5 + (-1×5) = 0 Step 5: Answer — Q = 25, R = 0 (check: 11×25+0 = 275)' }, options: ['Q = 26, R = 0', 'Q = 25, R = 0', 'Q = 24, R = 0', 'Q = 25, R = 1'], correct: 1 },
    { q: { en: 'Using the Paravartya method, divide 389 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 389 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 3 Step 3: 8 + (-2×3) = 2 Step 4: Remainder digit: 9 + (-2×2) = 5 Step 5: Answer — Q = 32, R = 5 (check: 12×32+5 = 389)' }, options: ['Q = 31, R = 5', 'Q = 32, R = 5', 'Q = 33, R = 3', 'Q = 32, R = 6'], correct: 1 },
    { q: { en: 'Using the Paravartya method, divide 24156 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 24156 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 2 Step 3: 4 + (-2×2) = 0 Step 4: 1 + (-2×0) = 1 Step 5: 5 + (-2×1) = 3 Step 6: Remainder digit: 6 + (-2×3) = 0 Step 7: Answer — Q = 2013, R = 0 (check: 12×2013+0 = 24156)' }, options: ['Q = 2012, R = 0', 'Q = 2014, R = 0', 'Q = 2013, R = 1', 'Q = 2013, R = 0'], correct: 3 },
    { q: { en: 'Using the Paravartya method, divide 1614 by 18. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1614 को 18 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 18 = 10+8, so flag = -8 Step 2: Bring down first digit: 1 Step 3: 6 + (-8×1) = -2 Step 4: 1 + (-8×-2) = 17 Step 5: Remainder digit: 4 + (-8×17) = -132 Step 6: 17 is 2 digits → carry 1 left (-2→-1), -10 = 7 Step 7: -1 is negative → borrow 1 from left (1→0), +10 = 9 Step 8: Remainder -132 negative → borrow 8 from quotient (97→89), +8×18 = 12 Step 9: Answer — Q = 89, R = 12 (check: 18×89+12 = 1614)' }, options: ['Q = 89, R = 13', 'Q = 88, R = 12', 'Q = 90, R = 4', 'Q = 89, R = 12'], correct: 3 },
    { q: { en: 'Using the Paravartya method, divide 592 by 13. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 592 को 13 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 13 = 10+3, so flag = -3 Step 2: Bring down first digit: 5 Step 3: 9 + (-3×5) = -6 Step 4: Remainder digit: 2 + (-3×-6) = 20 Step 5: -6 is negative → borrow 1 from left (5→4), +10 = 4 Step 6: Remainder 20 ≥ divisor → carry 1 into quotient (44→45), -1×13 = 7 Step 7: Answer — Q = 45, R = 7 (check: 13×45+7 = 592)' }, options: ['Q = 45, R = 7', 'Q = 44, R = 7', 'Q = 46, R = 4', 'Q = 45, R = 8'], correct: 0 },
    { q: { en: 'Using the Paravartya method, divide 5513 by 11. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 5513 को 11 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 11 = 10+1, so flag = -1 Step 2: Bring down first digit: 5 Step 3: 5 + (-1×5) = 0 Step 4: 1 + (-1×0) = 1 Step 5: Remainder digit: 3 + (-1×1) = 2 Step 6: Answer — Q = 501, R = 2 (check: 11×501+2 = 5513)' }, options: ['Q = 502, R = 1', 'Q = 500, R = 2', 'Q = 501, R = 3', 'Q = 501, R = 2'], correct: 3 },
    { q: { en: 'Using the Paravartya method, divide 3057 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 3057 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 3 Step 3: 0 + (-2×3) = -6 Step 4: 5 + (-2×-6) = 17 Step 5: Remainder digit: 7 + (-2×17) = -27 Step 6: 17 is 2 digits → carry 1 left (-6→-5), -10 = 7 Step 7: -5 is negative → borrow 1 from left (3→2), +10 = 5 Step 8: Remainder -27 negative → borrow 3 from quotient (257→254), +3×12 = 9 Step 9: Answer — Q = 254, R = 9 (check: 12×254+9 = 3057)' }, options: ['Q = 254, R = 10', 'Q = 253, R = 9', 'Q = 255, R = 7', 'Q = 254, R = 9'], correct: 3 },
    { q: { en: 'Using the Paravartya method, divide 1247 by 13. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1247 को 13 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 13 = 10+3, so flag = -3 Step 2: Bring down first digit: 1 Step 3: 2 + (-3×1) = -1 Step 4: 4 + (-3×-1) = 7 Step 5: Remainder digit: 7 + (-3×7) = -14 Step 6: -1 is negative → borrow 1 from left (1→0), +10 = 9 Step 7: Remainder -14 negative → borrow 2 from quotient (97→95), +2×13 = 12 Step 8: Answer — Q = 95, R = 12 (check: 13×95+12 = 1247)' }, options: ['Q = 96, R = 9', 'Q = 94, R = 12', 'Q = 95, R = 12', 'Q = 95, R = 11'], correct: 2 },
    { q: { en: 'Using the Paravartya method, divide 1528 by 14. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 1528 को 14 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 14 = 10+4, so flag = -4 Step 2: Bring down first digit: 1 Step 3: 5 + (-4×1) = 1 Step 4: 2 + (-4×1) = -2 Step 5: Remainder digit: 8 + (-4×-2) = 16 Step 6: -2 is negative → borrow 1 from left (1→0), +10 = 8 Step 7: Remainder 16 ≥ divisor → carry 1 into quotient (108→109), -1×14 = 2 Step 8: Answer — Q = 109, R = 2 (check: 14×109+2 = 1528)' }, options: ['Q = 108, R = 2', 'Q = 110, R = 0', 'Q = 109, R = 2', 'Q = 109, R = 3'], correct: 2 },
    { q: { en: 'Using the Paravartya method, divide 59278 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 59278 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 5 Step 3: 9 + (-2×5) = -1 Step 4: 2 + (-2×-1) = 4 Step 5: 7 + (-2×4) = -1 Step 6: Remainder digit: 8 + (-2×-1) = 10 Step 7: -1 is negative → borrow 1 from left (4→3), +10 = 9 Step 8: -1 is negative → borrow 1 from left (5→4), +10 = 9 Step 9: Answer — Q = 4939, R = 10 (check: 12×4939+10 = 59278)' }, options: ['Q = 4939, R = 10', 'Q = 4938, R = 10', 'Q = 4940, R = 8', 'Q = 4939, R = 11'], correct: 0 },
    { q: { en: 'Using the Paravartya method, divide 37897 by 12. What is the quotient and remainder?', hi: 'पैरावर्त्य विधि का उपयोग करते हुए, 37897 को 12 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 12 = 10+2, so flag = -2 Step 2: Bring down first digit: 3 Step 3: 7 + (-2×3) = 1 Step 4: 8 + (-2×1) = 6 Step 5: 9 + (-2×6) = -3 Step 6: Remainder digit: 7 + (-2×-3) = 13 Step 7: -3 is negative → borrow 1 from left (6→5), +10 = 7 Step 8: Remainder 13 ≥ divisor → carry 1 into quotient (3157→3158), -1×12 = 1 Step 9: Answer — Q = 3158, R = 1 (check: 12×3158+1 = 37897)' }, options: ['Q = 3157, R = 1', 'Q = 3158, R = 2', 'Q = 3158, R = 1', 'Q = 3159, R = 0'], correct: 2 },
  ],
  l2_02: [
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 123 by 212.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 123 को 212 से गुणा करें।' , exp: 'Step 1: Units: 3×2 = 6 Step 2: Tens: 2×2+3×1 = 7 Step 3: Hundreds: 1×2+2×1+3×2 = 10 Step 4: Thousands: 1×1+2×2 = 5 Step 5: Ten-thousands: 1×2 = 2 Step 6: Combine with carries: 26076 (check: 123×212=26076)' }, options: ['26077', '26086', '26066', '26076'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 211 by 132.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 211 को 132 से गुणा करें।' , exp: 'Step 1: Units: 1×2 = 2 Step 2: Tens: 1×2+1×3 = 5 Step 3: Hundreds: 2×2+1×3+1×1 = 8 Step 4: Thousands: 2×3+1×1 = 7 Step 5: Ten-thousands: 2×1 = 2 Step 6: Combine with carries: 27852 (check: 211×132=27852)' }, options: ['27851', '27842', '27862', '27852'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 302 by 213.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 302 को 213 से गुणा करें।' , exp: 'Step 1: Units: 2×3 = 6 Step 2: Tens: 0×3+2×1 = 2 Step 3: Hundreds: 3×3+0×1+2×2 = 13 Step 4: Thousands: 3×1+0×2 = 3 Step 5: Ten-thousands: 3×2 = 6 Step 6: Combine with carries: 64326 (check: 302×213=64326)' }, options: ['64426', '64326', '64325', '64316'], correct: 1 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 122 by 321.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 122 को 321 से गुणा करें।' , exp: 'Step 1: Units: 2×1 = 2 Step 2: Tens: 2×1+2×2 = 6 Step 3: Hundreds: 1×1+2×2+2×3 = 11 Step 4: Thousands: 1×2+2×3 = 8 Step 5: Ten-thousands: 1×3 = 3 Step 6: Combine with carries: 39162 (check: 122×321=39162)' }, options: ['39162', '39163', '39262', '39161'], correct: 0 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 213 by 312.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 213 को 312 से गुणा करें।' , exp: 'Step 1: Units: 3×2 = 6 Step 2: Tens: 1×2+3×1 = 5 Step 3: Hundreds: 2×2+1×1+3×3 = 14 Step 4: Thousands: 2×1+1×3 = 5 Step 5: Ten-thousands: 2×3 = 6 Step 6: Combine with carries: 66456 (check: 213×312=66456)' }, options: ['66457', '66455', '66446', '66456'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 111 by 222.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 111 को 222 से गुणा करें।' , exp: 'Step 1: Units: 1×2 = 2 Step 2: Tens: 1×2+1×2 = 4 Step 3: Hundreds: 1×2+1×2+1×2 = 6 Step 4: Thousands: 1×2+1×2 = 4 Step 5: Ten-thousands: 1×2 = 2 Step 6: Combine with carries: 24642 (check: 111×222=24642)' }, options: ['24632', '24652', '24642', '24643'], correct: 2 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 234 by 156.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 234 को 156 से गुणा करें।' , exp: 'Step 1: Units: 4×6 = 24 Step 2: Tens: 3×6+4×5 = 38 Step 3: Hundreds: 2×6+3×5+4×1 = 31 Step 4: Thousands: 2×5+3×1 = 13 Step 5: Ten-thousands: 2×1 = 2 Step 6: Combine with carries: 36504 (check: 234×156=36504)' }, options: ['36504', '36503', '36494', '36514'], correct: 0 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 345 by 267.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 345 को 267 से गुणा करें।' , exp: 'Step 1: Units: 5×7 = 35 Step 2: Tens: 4×7+5×6 = 58 Step 3: Hundreds: 3×7+4×6+5×2 = 55 Step 4: Thousands: 3×6+4×2 = 26 Step 5: Ten-thousands: 3×2 = 6 Step 6: Combine with carries: 92115 (check: 345×267=92115)' }, options: ['92215', '92114', '92125', '92115'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 456 by 178.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 456 को 178 से गुणा करें।' , exp: 'Step 1: Units: 6×8 = 48 Step 2: Tens: 5×8+6×7 = 82 Step 3: Hundreds: 4×8+5×7+6×1 = 73 Step 4: Thousands: 4×7+5×1 = 33 Step 5: Ten-thousands: 4×1 = 4 Step 6: Combine with carries: 81168 (check: 456×178=81168)' }, options: ['81168', '81169', '81178', '81167'], correct: 0 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 523 by 349.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 523 को 349 से गुणा करें।' , exp: 'Step 1: Units: 3×9 = 27 Step 2: Tens: 2×9+3×4 = 30 Step 3: Hundreds: 5×9+2×4+3×3 = 62 Step 4: Thousands: 5×4+2×3 = 26 Step 5: Ten-thousands: 5×3 = 15 Step 6: Combine with carries: 182527 (check: 523×349=182527)' }, options: ['182517', '182527', '182528', '182537'], correct: 1 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 287 by 394.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 287 को 394 से गुणा करें।' , exp: 'Step 1: Units: 7×4 = 28 Step 2: Tens: 8×4+7×9 = 95 Step 3: Hundreds: 2×4+8×9+7×3 = 101 Step 4: Thousands: 2×9+8×3 = 42 Step 5: Ten-thousands: 2×3 = 6 Step 6: Combine with carries: 113078 (check: 287×394=113078)' }, options: ['113178', '113079', '113078', '113077'], correct: 2 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 618 by 257.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 618 को 257 से गुणा करें।' , exp: 'Step 1: Units: 8×7 = 56 Step 2: Tens: 1×7+8×5 = 47 Step 3: Hundreds: 6×7+1×5+8×2 = 63 Step 4: Thousands: 6×5+1×2 = 32 Step 5: Ten-thousands: 6×2 = 12 Step 6: Combine with carries: 158826 (check: 618×257=158826)' }, options: ['158836', '158827', '158816', '158826'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 742 by 389.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 742 को 389 से गुणा करें।' , exp: 'Step 1: Units: 2×9 = 18 Step 2: Tens: 4×9+2×8 = 52 Step 3: Hundreds: 7×9+4×8+2×3 = 101 Step 4: Thousands: 7×8+4×3 = 68 Step 5: Ten-thousands: 7×3 = 21 Step 6: Combine with carries: 288638 (check: 742×389=288638)' }, options: ['288637', '288648', '288638', '288738'], correct: 2 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 456 by 623.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 456 को 623 से गुणा करें।' , exp: 'Step 1: Units: 6×3 = 18 Step 2: Tens: 5×3+6×2 = 27 Step 3: Hundreds: 4×3+5×2+6×6 = 58 Step 4: Thousands: 4×2+5×6 = 38 Step 5: Ten-thousands: 4×6 = 24 Step 6: Combine with carries: 284088 (check: 456×623=284088)' }, options: ['284087', '284078', '284089', '284088'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 789 by 456.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 789 को 456 से गुणा करें।' , exp: 'Step 1: Units: 9×6 = 54 Step 2: Tens: 8×6+9×5 = 93 Step 3: Hundreds: 7×6+8×5+9×4 = 118 Step 4: Thousands: 7×5+8×4 = 67 Step 5: Ten-thousands: 7×4 = 28 Step 6: Combine with carries: 359784 (check: 789×456=359784)' }, options: ['359794', '359785', '359774', '359784'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 867 by 934.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 867 को 934 से गुणा करें।' , exp: 'Step 1: Units: 7×4 = 28 Step 2: Tens: 6×4+7×3 = 45 Step 3: Hundreds: 8×4+6×3+7×9 = 113 Step 4: Thousands: 8×3+6×9 = 78 Step 5: Ten-thousands: 8×9 = 72 Step 6: Combine with carries: 809778 (check: 867×934=809778)' }, options: ['809788', '809777', '809878', '809778'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 923 by 678.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 923 को 678 से गुणा करें।' , exp: 'Step 1: Units: 3×8 = 24 Step 2: Tens: 2×8+3×7 = 37 Step 3: Hundreds: 9×8+2×7+3×6 = 104 Step 4: Thousands: 9×7+2×6 = 75 Step 5: Ten-thousands: 9×6 = 54 Step 6: Combine with carries: 625794 (check: 923×678=625794)' }, options: ['625793', '625794', '625795', '625804'], correct: 1 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 756 by 845.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 756 को 845 से गुणा करें।' , exp: 'Step 1: Units: 6×5 = 30 Step 2: Tens: 5×5+6×4 = 49 Step 3: Hundreds: 7×5+5×4+6×8 = 103 Step 4: Thousands: 7×4+5×8 = 68 Step 5: Ten-thousands: 7×8 = 56 Step 6: Combine with carries: 638820 (check: 756×845=638820)' }, options: ['638821', '638819', '638920', '638820'], correct: 3 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 689 by 912.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 689 को 912 से गुणा करें।' , exp: 'Step 1: Units: 9×2 = 18 Step 2: Tens: 8×2+9×1 = 25 Step 3: Hundreds: 6×2+8×1+9×9 = 101 Step 4: Thousands: 6×1+8×9 = 78 Step 5: Ten-thousands: 6×9 = 54 Step 6: Combine with carries: 628368 (check: 689×912=628368)' }, options: ['628468', '628368', '628378', '628369'], correct: 1 },
    { q: { en: 'Using Urdhva-Tiryagbhyam, multiply 834 by 567.', hi: 'ऊर्ध्व-तिर्यग्भ्याम विधि का उपयोग करते हुए, 834 को 567 से गुणा करें।' , exp: 'Step 1: Units: 4×7 = 28 Step 2: Tens: 3×7+4×6 = 45 Step 3: Hundreds: 8×7+3×6+4×5 = 94 Step 4: Thousands: 8×6+3×5 = 63 Step 5: Ten-thousands: 8×5 = 40 Step 6: Combine with carries: 472878 (check: 834×567=472878)' }, options: ['472877', '472879', '472878', '472978'], correct: 2 },
  ],
  l2_03: [
    { q: { en: 'Using the Vedic squaring method, find 27².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 27² ज्ञात करें।' , exp: 'Step 1: Units: 7×7 = 49 Step 2: Cross (double): 2×2×7 = 28 Step 3: Tens: 2×2 = 4 Step 4: Combine with carries: 729 (check: 27²=729)' }, options: ['730', '729', '829', '739'], correct: 1 },
    { q: { en: 'Using the Vedic squaring method, find 41².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 41² ज्ञात करें।' , exp: 'Step 1: Units: 1×1 = 1 Step 2: Cross (double): 2×4×1 = 8 Step 3: Tens: 4×4 = 16 Step 4: Combine with carries: 1681 (check: 41²=1681)' }, options: ['1691', '1671', '1681', '1680'], correct: 2 },
    { q: { en: 'Using the Vedic squaring method, find 13².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 13² ज्ञात करें।' , exp: 'Step 1: Units: 3×3 = 9 Step 2: Cross (double): 2×1×3 = 6 Step 3: Tens: 1×1 = 1 Step 4: Combine with carries: 169 (check: 13²=169)' }, options: ['179', '269', '168', '169'], correct: 3 },
    { q: { en: 'Using the Vedic squaring method, find 88².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 88² ज्ञात करें।' , exp: 'Step 1: Units: 8×8 = 64 Step 2: Cross (double): 2×8×8 = 128 Step 3: Tens: 8×8 = 64 Step 4: Combine with carries: 7744 (check: 88²=7744)' }, options: ['7754', '7844', '7734', '7744'], correct: 3 },
    { q: { en: 'Using the Vedic squaring method, find 67².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 67² ज्ञात करें।' , exp: 'Step 1: Units: 7×7 = 49 Step 2: Cross (double): 2×6×7 = 84 Step 3: Tens: 6×6 = 36 Step 4: Combine with carries: 4489 (check: 67²=4489)' }, options: ['4499', '4479', '4589', '4489'], correct: 3 },
    { q: { en: 'Using the Vedic squaring method, find 33².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 33² ज्ञात करें।' , exp: 'Step 1: Units: 3×3 = 9 Step 2: Cross (double): 2×3×3 = 18 Step 3: Tens: 3×3 = 9 Step 4: Combine with carries: 1089 (check: 33²=1089)' }, options: ['1079', '1090', '1189', '1089'], correct: 3 },
    { q: { en: 'Using the Vedic squaring method, find 99².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 99² ज्ञात करें।' , exp: 'Step 1: Units: 9×9 = 81 Step 2: Cross (double): 2×9×9 = 162 Step 3: Tens: 9×9 = 81 Step 4: Combine with carries: 9801 (check: 99²=9801)' }, options: ['9802', '9801', '9811', '9791'], correct: 1 },
    { q: { en: 'Using the Vedic squaring method, find 25².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 25² ज्ञात करें।' , exp: 'Step 1: Units: 5×5 = 25 Step 2: Cross (double): 2×2×5 = 20 Step 3: Tens: 2×2 = 4 Step 4: Combine with carries: 625 (check: 25²=625)' }, options: ['625', '615', '725', '624'], correct: 0 },
    { q: { en: 'Using the Vedic squaring method, find 93².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 93² ज्ञात करें।' , exp: 'Step 1: Units: 3×3 = 9 Step 2: Cross (double): 2×9×3 = 54 Step 3: Tens: 9×9 = 81 Step 4: Combine with carries: 8649 (check: 93²=8649)' }, options: ['8749', '8649', '8639', '8650'], correct: 1 },
    { q: { en: 'Using the Vedic squaring method, find 54².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 54² ज्ञात करें।' , exp: 'Step 1: Units: 4×4 = 16 Step 2: Cross (double): 2×5×4 = 40 Step 3: Tens: 5×5 = 25 Step 4: Combine with carries: 2916 (check: 54²=2916)' }, options: ['2915', '2926', '2916', '2906'], correct: 2 },
    { q: { en: 'Using the Vedic squaring method, find 20².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 20² ज्ञात करें।' , exp: 'Step 1: Units: 0×0 = 0 Step 2: Cross (double): 2×2×0 = 0 Step 3: Tens: 2×2 = 4 Step 4: Combine with carries: 400 (check: 20²=400)' }, options: ['400', '399', '401', '390'], correct: 0 },
    { q: { en: 'Using the Vedic squaring method, find 39².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 39² ज्ञात करें।' , exp: 'Step 1: Units: 9×9 = 81 Step 2: Cross (double): 2×3×9 = 54 Step 3: Tens: 3×3 = 9 Step 4: Combine with carries: 1521 (check: 39²=1521)' }, options: ['1521', '1520', '1531', '1621'], correct: 0 },
    { q: { en: 'Using the Vedic squaring method, find 44².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 44² ज्ञात करें।' , exp: 'Step 1: Units: 4×4 = 16 Step 2: Cross (double): 2×4×4 = 32 Step 3: Tens: 4×4 = 16 Step 4: Combine with carries: 1936 (check: 44²=1936)' }, options: ['1937', '1935', '1936', '2036'], correct: 2 },
    { q: { en: 'Using the Vedic squaring method, find 16².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 16² ज्ञात करें।' , exp: 'Step 1: Units: 6×6 = 36 Step 2: Cross (double): 2×1×6 = 12 Step 3: Tens: 1×1 = 1 Step 4: Combine with carries: 256 (check: 16²=256)' }, options: ['256', '356', '255', '266'], correct: 0 },
    { q: { en: 'Using the Vedic squaring method, find 50².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 50² ज्ञात करें।' , exp: 'Step 1: Units: 0×0 = 0 Step 2: Cross (double): 2×5×0 = 0 Step 3: Tens: 5×5 = 25 Step 4: Combine with carries: 2500 (check: 50²=2500)' }, options: ['2490', '2499', '2500', '2600'], correct: 2 },
    { q: { en: 'Using the Vedic squaring method, find 86².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 86² ज्ञात करें।' , exp: 'Step 1: Units: 6×6 = 36 Step 2: Cross (double): 2×8×6 = 96 Step 3: Tens: 8×8 = 64 Step 4: Combine with carries: 7396 (check: 86²=7396)' }, options: ['7496', '7386', '7406', '7396'], correct: 3 },
    { q: { en: 'Using the Vedic squaring method, find 32².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 32² ज्ञात करें।' , exp: 'Step 1: Units: 2×2 = 4 Step 2: Cross (double): 2×3×2 = 12 Step 3: Tens: 3×3 = 9 Step 4: Combine with carries: 1024 (check: 32²=1024)' }, options: ['1034', '1024', '1025', '1023'], correct: 1 },
    { q: { en: 'Using the Vedic squaring method, find 80².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 80² ज्ञात करें।' , exp: 'Step 1: Units: 0×0 = 0 Step 2: Cross (double): 2×8×0 = 0 Step 3: Tens: 8×8 = 64 Step 4: Combine with carries: 6400 (check: 80²=6400)' }, options: ['6500', '6400', '6399', '6390'], correct: 1 },
    { q: { en: 'Using the Vedic squaring method, find 97².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 97² ज्ञात करें।' , exp: 'Step 1: Units: 7×7 = 49 Step 2: Cross (double): 2×9×7 = 126 Step 3: Tens: 9×9 = 81 Step 4: Combine with carries: 9409 (check: 97²=9409)' }, options: ['9409', '9408', '9410', '9509'], correct: 0 },
    { q: { en: 'Using the Vedic squaring method, find 65².', hi: 'वैदिक वर्ग विधि का उपयोग करते हुए, 65² ज्ञात करें।' , exp: 'Step 1: Units: 5×5 = 25 Step 2: Cross (double): 2×6×5 = 60 Step 3: Tens: 6×6 = 36 Step 4: Combine with carries: 4225 (check: 65²=4225)' }, options: ['4225', '4235', '4325', '4226'], correct: 0 },
  ],
  l2_04: [
    { q: { en: 'Using the Vedic cubing method, find 83³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 83³ ज्ञात करें।' , exp: 'Step 1: Four terms: 8³=512, 3×8²×3=576, 3×8×3²=216, 3³=27 Step 2: Combine right-to-left with carries: 571787 (check: 83³=571787)' }, options: ['571787', '571788', '572787', '571887'], correct: 0 },
    { q: { en: 'Using the Vedic cubing method, find 31³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 31³ ज्ञात करें।' , exp: 'Step 1: Four terms: 3³=27, 3×3²×1=27, 3×3×1²=9, 1³=1 Step 2: Combine right-to-left with carries: 29791 (check: 31³=29791)' }, options: ['29790', '29891', '29791', '30791'], correct: 2 },
    { q: { en: 'Using the Vedic cubing method, find 90³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 90³ ज्ञात करें।' , exp: 'Step 1: Four terms: 9³=729, 3×9²×0=0, 3×9×0²=0, 0³=0 Step 2: Combine right-to-left with carries: 729000 (check: 90³=729000)' }, options: ['728900', '730000', '729000', '729001'], correct: 2 },
    { q: { en: 'Using the Vedic cubing method, find 39³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 39³ ज्ञात करें।' , exp: 'Step 1: Four terms: 3³=27, 3×3²×9=243, 3×3×9²=729, 9³=729 Step 2: Combine right-to-left with carries: 59319 (check: 39³=59319)' }, options: ['59319', '59318', '60319', '59419'], correct: 0 },
    { q: { en: 'Using the Vedic cubing method, find 45³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 45³ ज्ञात करें।' , exp: 'Step 1: Four terms: 4³=64, 3×4²×5=240, 3×4×5²=300, 5³=125 Step 2: Combine right-to-left with carries: 91125 (check: 45³=91125)' }, options: ['91126', '91125', '91124', '91225'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 71³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 71³ ज्ञात करें।' , exp: 'Step 1: Four terms: 7³=343, 3×7²×1=147, 3×7×1²=21, 1³=1 Step 2: Combine right-to-left with carries: 357911 (check: 71³=357911)' }, options: ['357811', '358011', '357911', '358911'], correct: 2 },
    { q: { en: 'Using the Vedic cubing method, find 93³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 93³ ज्ञात करें।' , exp: 'Step 1: Four terms: 9³=729, 3×9²×3=729, 3×9×3²=243, 3³=27 Step 2: Combine right-to-left with carries: 804357 (check: 93³=804357)' }, options: ['804457', '805357', '804357', '804358'], correct: 2 },
    { q: { en: 'Using the Vedic cubing method, find 78³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 78³ ज्ञात करें।' , exp: 'Step 1: Four terms: 7³=343, 3×7²×8=1176, 3×7×8²=1344, 8³=512 Step 2: Combine right-to-left with carries: 474552 (check: 78³=474552)' }, options: ['474552', '474553', '474652', '475552'], correct: 0 },
    { q: { en: 'Using the Vedic cubing method, find 77³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 77³ ज्ञात करें।' , exp: 'Step 1: Four terms: 7³=343, 3×7²×7=1029, 3×7×7²=1029, 7³=343 Step 2: Combine right-to-left with carries: 456533 (check: 77³=456533)' }, options: ['456532', '457533', '456533', '456534'], correct: 2 },
    { q: { en: 'Using the Vedic cubing method, find 33³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 33³ ज्ञात करें।' , exp: 'Step 1: Four terms: 3³=27, 3×3²×3=81, 3×3×3²=81, 3³=27 Step 2: Combine right-to-left with carries: 35937 (check: 33³=35937)' }, options: ['36937', '35937', '35938', '35837'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 88³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 88³ ज्ञात करें।' , exp: 'Step 1: Four terms: 8³=512, 3×8²×8=1536, 3×8×8²=1536, 8³=512 Step 2: Combine right-to-left with carries: 681472 (check: 88³=681472)' }, options: ['682472', '681473', '681372', '681472'], correct: 3 },
    { q: { en: 'Using the Vedic cubing method, find 74³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 74³ ज्ञात करें।' , exp: 'Step 1: Four terms: 7³=343, 3×7²×4=588, 3×7×4²=336, 4³=64 Step 2: Combine right-to-left with carries: 405224 (check: 74³=405224)' }, options: ['405225', '405224', '405223', '405124'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 51³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 51³ ज्ञात करें।' , exp: 'Step 1: Four terms: 5³=125, 3×5²×1=75, 3×5×1²=15, 1³=1 Step 2: Combine right-to-left with carries: 132651 (check: 51³=132651)' }, options: ['133651', '132651', '132650', '132652'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 97³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 97³ ज्ञात करें।' , exp: 'Step 1: Four terms: 9³=729, 3×9²×7=1701, 3×9×7²=1323, 7³=343 Step 2: Combine right-to-left with carries: 912673 (check: 97³=912673)' }, options: ['912674', '912672', '913673', '912673'], correct: 3 },
    { q: { en: 'Using the Vedic cubing method, find 66³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 66³ ज्ञात करें।' , exp: 'Step 1: Four terms: 6³=216, 3×6²×6=648, 3×6×6²=648, 6³=216 Step 2: Combine right-to-left with carries: 287496 (check: 66³=287496)' }, options: ['287495', '288496', '287497', '287496'], correct: 3 },
    { q: { en: 'Using the Vedic cubing method, find 46³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 46³ ज्ञात करें।' , exp: 'Step 1: Four terms: 4³=64, 3×4²×6=288, 3×4×6²=432, 6³=216 Step 2: Combine right-to-left with carries: 97336 (check: 46³=97336)' }, options: ['98336', '97336', '97335', '97436'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 96³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 96³ ज्ञात करें।' , exp: 'Step 1: Four terms: 9³=729, 3×9²×6=1458, 3×9×6²=972, 6³=216 Step 2: Combine right-to-left with carries: 884736 (check: 96³=884736)' }, options: ['884737', '884736', '884735', '884836'], correct: 1 },
    { q: { en: 'Using the Vedic cubing method, find 91³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 91³ ज्ञात करें।' , exp: 'Step 1: Four terms: 9³=729, 3×9²×1=243, 3×9×1²=27, 1³=1 Step 2: Combine right-to-left with carries: 753571 (check: 91³=753571)' }, options: ['753571', '753671', '754571', '753572'], correct: 0 },
    { q: { en: 'Using the Vedic cubing method, find 19³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 19³ ज्ञात करें।' , exp: 'Step 1: Four terms: 1³=1, 3×1²×9=27, 3×1×9²=243, 9³=729 Step 2: Combine right-to-left with carries: 6859 (check: 19³=6859)' }, options: ['6858', '7859', '6959', '6859'], correct: 3 },
    { q: { en: 'Using the Vedic cubing method, find 48³.', hi: 'वैदिक घन विधि का उपयोग करते हुए, 48³ ज्ञात करें।' , exp: 'Step 1: Four terms: 4³=64, 3×4²×8=384, 3×4×8²=768, 8³=512 Step 2: Combine right-to-left with carries: 110592 (check: 48³=110592)' }, options: ['110591', '110593', '110592', '110492'], correct: 2 },
  ],
  l2_05: [
    { q: { en: 'Using the Vedic square root method, find √1600.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √1600 ज्ञात करें।' , exp: 'Step 1: 1600 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 16 | 00 Step 3: Largest a with a² ≤ 16 is 4 (since 4²=16 ≤ 16 but 5²=25 > 16) → first digit = 4 Step 4: Last digit of N is 0 → last digit of root is 0 (only option) Step 5: Answer — √1600 = 40 (check: 40×40 = 1600)' }, options: ['39', '40', '50', '41'], correct: 1 },
    { q: { en: 'Using the Vedic square root method, find √2025.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √2025 ज्ञात करें।' , exp: 'Step 1: 2025 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 20 | 25 Step 3: Largest a with a² ≤ 20 is 4 (since 4²=16 ≤ 20 but 5²=25 > 20) → first digit = 4 Step 4: Last digit of N is 5 → last digit of root is 5 (only option) Step 5: Answer — √2025 = 45 (check: 45×45 = 2025)' }, options: ['45', '44', '55', '46'], correct: 0 },
    { q: { en: 'Using the Vedic square root method, find √3600.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √3600 ज्ञात करें।' , exp: 'Step 1: 3600 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 36 | 00 Step 3: Largest a with a² ≤ 36 is 6 (since 6²=36 ≤ 36 but 7²=49 > 36) → first digit = 6 Step 4: Last digit of N is 0 → last digit of root is 0 (only option) Step 5: Answer — √3600 = 60 (check: 60×60 = 3600)' }, options: ['70', '60', '61', '59'], correct: 1 },
    { q: { en: 'Using the Vedic square root method, find √4225.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √4225 ज्ञात करें।' , exp: 'Step 1: 4225 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 42 | 25 Step 3: Largest a with a² ≤ 42 is 6 (since 6²=36 ≤ 42 but 7²=49 > 42) → first digit = 6 Step 4: Last digit of N is 5 → last digit of root is 5 (only option) Step 5: Answer — √4225 = 65 (check: 65×65 = 4225)' }, options: ['75', '64', '66', '65'], correct: 3 },
    { q: { en: 'Using the Vedic square root method, find √1225.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √1225 ज्ञात करें।' , exp: 'Step 1: 1225 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 12 | 25 Step 3: Largest a with a² ≤ 12 is 3 (since 3²=9 ≤ 12 but 4²=16 > 12) → first digit = 3 Step 4: Last digit of N is 5 → last digit of root is 5 (only option) Step 5: Answer — √1225 = 35 (check: 35×35 = 1225)' }, options: ['35', '34', '45', '36'], correct: 0 },
    { q: { en: 'Using the Vedic square root method, find √2500.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √2500 ज्ञात करें।' , exp: 'Step 1: 2500 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 25 | 00 Step 3: Largest a with a² ≤ 25 is 5 (since 5²=25 ≤ 25 but 6²=36 > 25) → first digit = 5 Step 4: Last digit of N is 0 → last digit of root is 0 (only option) Step 5: Answer — √2500 = 50 (check: 50×50 = 2500)' }, options: ['51', '60', '50', '49'], correct: 2 },
    { q: { en: 'Using the Vedic square root method, find √1764.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √1764 ज्ञात करें।' , exp: 'Step 1: 1764 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 17 | 64 Step 3: Largest a with a² ≤ 17 is 4 (since 4²=16 ≤ 17 but 5²=25 > 17) → first digit = 4 Step 4: Last digit of N is 4 → last digit of root is 2 or 8 Step 5: 1764 < 45²=2025 → take the smaller option: 2 Step 6: Answer — √1764 = 42 (check: 42×42 = 1764)' }, options: ['48', '42', '52', '43'], correct: 1 },
    { q: { en: 'Using the Vedic square root method, find √3249.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √3249 ज्ञात करें।' , exp: 'Step 1: 3249 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 32 | 49 Step 3: Largest a with a² ≤ 32 is 5 (since 5²=25 ≤ 32 but 6²=36 > 32) → first digit = 5 Step 4: Last digit of N is 9 → last digit of root is 3 or 7 Step 5: 3249 ≥ 55²=3025 → take the larger option: 7 Step 6: Answer — √3249 = 57 (check: 57×57 = 3249)' }, options: ['53', '67', '56', '57'], correct: 3 },
    { q: { en: 'Using the Vedic square root method, find √4624.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √4624 ज्ञात करें।' , exp: 'Step 1: 4624 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 46 | 24 Step 3: Largest a with a² ≤ 46 is 6 (since 6²=36 ≤ 46 but 7²=49 > 46) → first digit = 6 Step 4: Last digit of N is 4 → last digit of root is 2 or 8 Step 5: 4624 ≥ 65²=4225 → take the larger option: 8 Step 6: Answer — √4624 = 68 (check: 68×68 = 4624)' }, options: ['78', '67', '68', '62'], correct: 2 },
    { q: { en: 'Using the Vedic square root method, find √5329.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √5329 ज्ञात करें।' , exp: 'Step 1: 5329 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 53 | 29 Step 3: Largest a with a² ≤ 53 is 7 (since 7²=49 ≤ 53 but 8²=64 > 53) → first digit = 7 Step 4: Last digit of N is 9 → last digit of root is 3 or 7 Step 5: 5329 < 75²=5625 → take the smaller option: 3 Step 6: Answer — √5329 = 73 (check: 73×73 = 5329)' }, options: ['72', '74', '73', '83'], correct: 2 },
    { q: { en: 'Using the Vedic square root method, find √7056.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √7056 ज्ञात करें।' , exp: 'Step 1: 7056 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 70 | 56 Step 3: Largest a with a² ≤ 70 is 8 (since 8²=64 ≤ 70 but 9²=81 > 70) → first digit = 8 Step 4: Last digit of N is 6 → last digit of root is 4 or 6 Step 5: 7056 < 85²=7225 → take the smaller option: 4 Step 6: Answer — √7056 = 84 (check: 84×84 = 7056)' }, options: ['86', '83', '94', '84'], correct: 3 },
    { q: { en: 'Using the Vedic square root method, find √1521.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √1521 ज्ञात करें।' , exp: 'Step 1: 1521 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 15 | 21 Step 3: Largest a with a² ≤ 15 is 3 (since 3²=9 ≤ 15 but 4²=16 > 15) → first digit = 3 Step 4: Last digit of N is 1 → last digit of root is 1 or 9 Step 5: 1521 ≥ 35²=1225 → take the larger option: 9 Step 6: Answer — √1521 = 39 (check: 39×39 = 1521)' }, options: ['40', '39', '31', '38'], correct: 1 },
    { q: { en: 'Using the Vedic square root method, find √8281.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √8281 ज्ञात करें।' , exp: 'Step 1: 8281 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 82 | 81 Step 3: Largest a with a² ≤ 82 is 9 (since 9²=81 ≤ 82 but 10²=100 > 82) → first digit = 9 Step 4: Last digit of N is 1 → last digit of root is 1 or 9 Step 5: 8281 < 95²=9025 → take the smaller option: 1 Step 6: Answer — √8281 = 91 (check: 91×91 = 8281)' }, options: ['81', '92', '91', '99'], correct: 2 },
    { q: { en: 'Using the Vedic square root method, find √2116.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √2116 ज्ञात करें।' , exp: 'Step 1: 2116 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 21 | 16 Step 3: Largest a with a² ≤ 21 is 4 (since 4²=16 ≤ 21 but 5²=25 > 21) → first digit = 4 Step 4: Last digit of N is 6 → last digit of root is 4 or 6 Step 5: 2116 ≥ 45²=2025 → take the larger option: 6 Step 6: Answer — √2116 = 46 (check: 46×46 = 2116)' }, options: ['44', '45', '46', '47'], correct: 2 },
    { q: { en: 'Using the Vedic square root method, find √5929.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √5929 ज्ञात करें।' , exp: 'Step 1: 5929 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 59 | 29 Step 3: Largest a with a² ≤ 59 is 7 (since 7²=49 ≤ 59 but 8²=64 > 59) → first digit = 7 Step 4: Last digit of N is 9 → last digit of root is 3 or 7 Step 5: 5929 ≥ 75²=5625 → take the larger option: 7 Step 6: Answer — √5929 = 77 (check: 77×77 = 5929)' }, options: ['77', '76', '78', '73'], correct: 0 },
    { q: { en: 'Using the Vedic square root method, find √7744.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √7744 ज्ञात करें।' , exp: 'Step 1: 7744 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 77 | 44 Step 3: Largest a with a² ≤ 77 is 8 (since 8²=64 ≤ 77 but 9²=81 > 77) → first digit = 8 Step 4: Last digit of N is 4 → last digit of root is 2 or 8 Step 5: 7744 ≥ 85²=7225 → take the larger option: 8 Step 6: Answer — √7744 = 88 (check: 88×88 = 7744)' }, options: ['88', '87', '98', '89'], correct: 0 },
    { q: { en: 'Using the Vedic square root method, find √8649.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √8649 ज्ञात करें।' , exp: 'Step 1: 8649 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 86 | 49 Step 3: Largest a with a² ≤ 86 is 9 (since 9²=81 ≤ 86 but 10²=100 > 86) → first digit = 9 Step 4: Last digit of N is 9 → last digit of root is 3 or 7 Step 5: 8649 < 95²=9025 → take the smaller option: 3 Step 6: Answer — √8649 = 93 (check: 93×93 = 8649)' }, options: ['83', '97', '92', '93'], correct: 3 },
    { q: { en: 'Using the Vedic square root method, find √3844.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √3844 ज्ञात करें।' , exp: 'Step 1: 3844 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 38 | 44 Step 3: Largest a with a² ≤ 38 is 6 (since 6²=36 ≤ 38 but 7²=49 > 38) → first digit = 6 Step 4: Last digit of N is 4 → last digit of root is 2 or 8 Step 5: 3844 < 65²=4225 → take the smaller option: 2 Step 6: Answer — √3844 = 62 (check: 62×62 = 3844)' }, options: ['62', '72', '61', '63'], correct: 0 },
    { q: { en: 'Using the Vedic square root method, find √9216.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √9216 ज्ञात करें।' , exp: 'Step 1: 9216 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 92 | 16 Step 3: Largest a with a² ≤ 92 is 9 (since 9²=81 ≤ 92 but 10²=100 > 92) → first digit = 9 Step 4: Last digit of N is 6 → last digit of root is 4 or 6 Step 5: 9216 ≥ 95²=9025 → take the larger option: 6 Step 6: Answer — √9216 = 96 (check: 96×96 = 9216)' }, options: ['95', '96', '97', '94'], correct: 1 },
    { q: { en: 'Using the Vedic square root method, find √2916.', hi: 'वैदिक वर्गमूल विधि का उपयोग करते हुए, √2916 ज्ञात करें।' , exp: 'Step 1: 2916 has 4 digits → the square root has 2 digits Step 2: Split into pairs from the right: 29 | 16 Step 3: Largest a with a² ≤ 29 is 5 (since 5²=25 ≤ 29 but 6²=36 > 29) → first digit = 5 Step 4: Last digit of N is 6 → last digit of root is 4 or 6 Step 5: 2916 < 55²=3025 → take the smaller option: 4 Step 6: Answer — √2916 = 54 (check: 54×54 = 2916)' }, options: ['53', '64', '55', '54'], correct: 3 },
  ],
  l2_06: [
    { q: { en: 'Using the Vedic cube root method, find ³√1728.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√1728 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 1 | 728 Step 2: Last digit of N is 8 → cube root\'s last digit is 2 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 1 is 1 (since 1³=1 ≤ 1 but 2³=8 > 1) → first digit = 1 Step 4: Answer — ³√1728 = 12 (check: 12×12×12 = 1728)' }, options: ['13', '12', '11', '22'], correct: 1 },
    { q: { en: 'Using the Vedic cube root method, find ³√3375.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√3375 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 3 | 375 Step 2: Last digit of N is 5 → cube root\'s last digit is 5 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 3 is 1 (since 1³=1 ≤ 3 but 2³=8 > 3) → first digit = 1 Step 4: Answer — ³√3375 = 15 (check: 15×15×15 = 3375)' }, options: ['15', '14', '16', '25'], correct: 0 },
    { q: { en: 'Using the Vedic cube root method, find ³√5832.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√5832 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 5 | 832 Step 2: Last digit of N is 2 → cube root\'s last digit is 8 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 5 is 1 (since 1³=1 ≤ 5 but 2³=8 > 5) → first digit = 1 Step 4: Answer — ³√5832 = 18 (check: 18×18×18 = 5832)' }, options: ['17', '28', '19', '18'], correct: 3 },
    { q: { en: 'Using the Vedic cube root method, find ³√8000.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√8000 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 8 | 000 Step 2: Last digit of N is 0 → cube root\'s last digit is 0 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 8 is 2 (since 2³=8 ≤ 8 but 3³=27 > 8) → first digit = 2 Step 4: Answer — ³√8000 = 20 (check: 20×20×20 = 8000)' }, options: ['19', '21', '20', '30'], correct: 2 },
    { q: { en: 'Using the Vedic cube root method, find ³√2197.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√2197 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 2 | 197 Step 2: Last digit of N is 7 → cube root\'s last digit is 3 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 2 is 1 (since 1³=1 ≤ 2 but 2³=8 > 2) → first digit = 1 Step 4: Answer — ³√2197 = 13 (check: 13×13×13 = 2197)' }, options: ['12', '13', '14', '23'], correct: 1 },
    { q: { en: 'Using the Vedic cube root method, find ³√4913.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√4913 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 4 | 913 Step 2: Last digit of N is 3 → cube root\'s last digit is 7 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 4 is 1 (since 1³=1 ≤ 4 but 2³=8 > 4) → first digit = 1 Step 4: Answer — ³√4913 = 17 (check: 17×17×17 = 4913)' }, options: ['18', '16', '27', '17'], correct: 3 },
    { q: { en: 'Using the Vedic cube root method, find ³√13824.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√13824 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 13 | 824 Step 2: Last digit of N is 4 → cube root\'s last digit is 4 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 13 is 2 (since 2³=8 ≤ 13 but 3³=27 > 13) → first digit = 2 Step 4: Answer — ³√13824 = 24 (check: 24×24×24 = 13824)' }, options: ['23', '34', '25', '24'], correct: 3 },
    { q: { en: 'Using the Vedic cube root method, find ³√24389.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√24389 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 24 | 389 Step 2: Last digit of N is 9 → cube root\'s last digit is 9 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 24 is 2 (since 2³=8 ≤ 24 but 3³=27 > 24) → first digit = 2 Step 4: Answer — ³√24389 = 29 (check: 29×29×29 = 24389)' }, options: ['39', '28', '29', '30'], correct: 2 },
    { q: { en: 'Using the Vedic cube root method, find ³√35937.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√35937 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 35 | 937 Step 2: Last digit of N is 7 → cube root\'s last digit is 3 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 35 is 3 (since 3³=27 ≤ 35 but 4³=64 > 35) → first digit = 3 Step 4: Answer — ³√35937 = 33 (check: 33×33×33 = 35937)' }, options: ['32', '43', '33', '34'], correct: 2 },
    { q: { en: 'Using the Vedic cube root method, find ³√54872.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√54872 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 54 | 872 Step 2: Last digit of N is 2 → cube root\'s last digit is 8 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 54 is 3 (since 3³=27 ≤ 54 but 4³=64 > 54) → first digit = 3 Step 4: Answer — ³√54872 = 38 (check: 38×38×38 = 54872)' }, options: ['38', '39', '48', '37'], correct: 0 },
    { q: { en: 'Using the Vedic cube root method, find ³√68921.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√68921 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 68 | 921 Step 2: Last digit of N is 1 → cube root\'s last digit is 1 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 68 is 4 (since 4³=64 ≤ 68 but 5³=125 > 68) → first digit = 4 Step 4: Answer — ³√68921 = 41 (check: 41×41×41 = 68921)' }, options: ['41', '40', '42', '51'], correct: 0 },
    { q: { en: 'Using the Vedic cube root method, find ³√91125.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√91125 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 91 | 125 Step 2: Last digit of N is 5 → cube root\'s last digit is 5 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 91 is 4 (since 4³=64 ≤ 91 but 5³=125 > 91) → first digit = 4 Step 4: Answer — ³√91125 = 45 (check: 45×45×45 = 91125)' }, options: ['44', '55', '45', '46'], correct: 2 },
    { q: { en: 'Using the Vedic cube root method, find ³√19683.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√19683 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 19 | 683 Step 2: Last digit of N is 3 → cube root\'s last digit is 7 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 19 is 2 (since 2³=8 ≤ 19 but 3³=27 > 19) → first digit = 2 Step 4: Answer — ³√19683 = 27 (check: 27×27×27 = 19683)' }, options: ['26', '28', '27', '37'], correct: 2 },
    { q: { en: 'Using the Vedic cube root method, find ³√46656.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√46656 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 46 | 656 Step 2: Last digit of N is 6 → cube root\'s last digit is 6 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 46 is 3 (since 3³=27 ≤ 46 but 4³=64 > 46) → first digit = 3 Step 4: Answer — ³√46656 = 36 (check: 36×36×36 = 46656)' }, options: ['36', '35', '46', '37'], correct: 0 },
    { q: { en: 'Using the Vedic cube root method, find ³√140608.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√140608 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 140 | 608 Step 2: Last digit of N is 8 → cube root\'s last digit is 2 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 140 is 5 (since 5³=125 ≤ 140 but 6³=216 > 140) → first digit = 5 Step 4: Answer — ³√140608 = 52 (check: 52×52×52 = 140608)' }, options: ['52', '53', '51', '62'], correct: 0 },
    { q: { en: 'Using the Vedic cube root method, find ³√226981.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√226981 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 226 | 981 Step 2: Last digit of N is 1 → cube root\'s last digit is 1 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 226 is 6 (since 6³=216 ≤ 226 but 7³=343 > 226) → first digit = 6 Step 4: Answer — ³√226981 = 61 (check: 61×61×61 = 226981)' }, options: ['71', '61', '60', '62'], correct: 1 },
    { q: { en: 'Using the Vedic cube root method, find ³√405224.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√405224 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 405 | 224 Step 2: Last digit of N is 4 → cube root\'s last digit is 4 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 405 is 7 (since 7³=343 ≤ 405 but 8³=512 > 405) → first digit = 7 Step 4: Answer — ³√405224 = 74 (check: 74×74×74 = 405224)' }, options: ['84', '74', '73', '75'], correct: 1 },
    { q: { en: 'Using the Vedic cube root method, find ³√571787.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√571787 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 571 | 787 Step 2: Last digit of N is 7 → cube root\'s last digit is 3 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 571 is 8 (since 8³=512 ≤ 571 but 9³=729 > 571) → first digit = 8 Step 4: Answer — ³√571787 = 83 (check: 83×83×83 = 571787)' }, options: ['84', '83', '93', '82'], correct: 1 },
    { q: { en: 'Using the Vedic cube root method, find ³√778688.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√778688 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 778 | 688 Step 2: Last digit of N is 8 → cube root\'s last digit is 2 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 778 is 9 (since 9³=729 ≤ 778 but 10³=1000 > 778) → first digit = 9 Step 4: Answer — ³√778688 = 92 (check: 92×92×92 = 778688)' }, options: ['91', '93', '82', '92'], correct: 3 },
    { q: { en: 'Using the Vedic cube root method, find ³√314432.', hi: 'वैदिक घनमूल विधि का उपयोग करते हुए, ³√314432 ज्ञात करें।' , exp: 'Step 1: Group the last 3 digits, the rest form the first group: 314 | 432 Step 2: Last digit of N is 2 → cube root\'s last digit is 8 (unique match, no ambiguity) Step 3: Largest a with a³ ≤ 314 is 6 (since 6³=216 ≤ 314 but 7³=343 > 314) → first digit = 6 Step 4: Answer — ³√314432 = 68 (check: 68×68×68 = 314432)' }, options: ['78', '67', '69', '68'], correct: 3 },
  ],
  l2_07: [
    { q: { en: 'A student calculated 23 × 45 = 1035. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 23 × 45 = 1035 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 23: 2+3 = 5 Step 2: Digit sum of 45: 4+5 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 3: Multiply the digit sums: 5×0 = 0 (check value) Step 4: Digit sum of the product 1035: 1+0+3+5 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '0', '7', '1'], correct: 1 },
    { q: { en: 'A student calculated 34 × 52 = 1768. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 34 × 52 = 1768 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 34: 3+4 = 7 Step 2: Digit sum of 52: 5+2 = 7 Step 3: Multiply the digit sums: 7×7=49 → reduce: 4+9 = 13; 1+3 = 4 Step 4: Digit sum of the product 1768: 1+7+6+8 = 22; 2+2 = 4 Step 5: Check value (4) = product\'s digit sum (4) → verification passes Step 6: Answer — check value = 4' }, options: ['2', '3', '6', '4'], correct: 3 },
    { q: { en: 'A student calculated 18 × 27 = 486. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 18 × 27 = 486 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 18: 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 27: 2+7 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 3: Multiply the digit sums: 0×0 = 0 (check value) Step 4: Digit sum of the product 486: 4+8+6 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '0', '7', '1'], correct: 1 },
    { q: { en: 'A student calculated 41 × 36 = 1476. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 41 × 36 = 1476 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 41: 4+1 = 5 Step 2: Digit sum of 36: 3+6 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 3: Multiply the digit sums: 5×0 = 0 (check value) Step 4: Digit sum of the product 1476: 1+4+7+6 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '0', '1'], correct: 2 },
    { q: { en: 'A student calculated 29 × 63 = 1827. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 29 × 63 = 1827 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 29: 2+9 = 11; 1+1 = 2 Step 2: Digit sum of 63: 6+3 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 3: Multiply the digit sums: 2×0 = 0 (check value) Step 4: Digit sum of the product 1827: 1+8+2+7 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '1', '0'], correct: 3 },
    { q: { en: 'A student calculated 56 × 17 = 952. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 56 × 17 = 952 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 56: 5+6 = 11; 1+1 = 2 Step 2: Digit sum of 17: 1+7 = 8 Step 3: Multiply the digit sums: 2×8=16 → reduce: 1+6 = 7 Step 4: Digit sum of the product 952: 9+5+2 = 16; 1+6 = 7 Step 5: Check value (7) = product\'s digit sum (7) → verification passes Step 6: Answer — check value = 7' }, options: ['8', '5', '0', '7'], correct: 3 },
    { q: { en: 'A student calculated 234 × 56 = 13104. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 234 × 56 = 13104 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 234: 2+3+4 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 56: 5+6 = 11; 1+1 = 2 Step 3: Multiply the digit sums: 0×2 = 0 (check value) Step 4: Digit sum of the product 13104: 1+3+1+0+4 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['0', '8', '7', '1'], correct: 0 },
    { q: { en: 'A student calculated 187 × 43 = 8041. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 187 × 43 = 8041 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 187: 1+8+7 = 16; 1+6 = 7 Step 2: Digit sum of 43: 4+3 = 7 Step 3: Multiply the digit sums: 7×7=49 → reduce: 4+9 = 13; 1+3 = 4 Step 4: Digit sum of the product 8041: 8+0+4+1 = 13; 1+3 = 4 Step 5: Check value (4) = product\'s digit sum (4) → verification passes Step 6: Answer — check value = 4' }, options: ['2', '4', '3', '6'], correct: 1 },
    { q: { en: 'A student calculated 326 × 71 = 23146. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 326 × 71 = 23146 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 326: 3+2+6 = 11; 1+1 = 2 Step 2: Digit sum of 71: 7+1 = 8 Step 3: Multiply the digit sums: 2×8=16 → reduce: 1+6 = 7 Step 4: Digit sum of the product 23146: 2+3+1+4+6 = 16; 1+6 = 7 Step 5: Check value (7) = product\'s digit sum (7) → verification passes Step 6: Answer — check value = 7' }, options: ['7', '8', '5', '0'], correct: 0 },
    { q: { en: 'A student calculated 459 × 28 = 12852. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 459 × 28 = 12852 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 459: 4+5+9 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 28: 2+8 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 0×1 = 0 (check value) Step 4: Digit sum of the product 12852: 1+2+8+5+2 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '0', '1'], correct: 2 },
    { q: { en: 'A student calculated 612 × 37 = 22644. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 612 × 37 = 22644 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 612: 6+1+2 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 37: 3+7 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 0×1 = 0 (check value) Step 4: Digit sum of the product 22644: 2+2+6+4+4 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '0', '7', '1'], correct: 1 },
    { q: { en: 'A student calculated 738 × 19 = 14022. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 738 × 19 = 14022 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 738: 7+3+8 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 19: 1+9 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 0×1 = 0 (check value) Step 4: Digit sum of the product 14022: 1+4+0+2+2 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '0', '1'], correct: 2 },
    { q: { en: 'A student calculated 295 × 64 = 18880. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 295 × 64 = 18880 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 295: 2+9+5 = 16; 1+6 = 7 Step 2: Digit sum of 64: 6+4 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 7×1 = 7 (check value) Step 4: Digit sum of the product 18880: 1+8+8+8+0 = 25; 2+5 = 7 Step 5: Check value (7) = product\'s digit sum (7) → verification passes Step 6: Answer — check value = 7' }, options: ['8', '5', '7', '0'], correct: 2 },
    { q: { en: 'A student calculated 821 × 45 = 36945. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 821 × 45 = 36945 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 821: 8+2+1 = 11; 1+1 = 2 Step 2: Digit sum of 45: 4+5 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 3: Multiply the digit sums: 2×0 = 0 (check value) Step 4: Digit sum of the product 36945: 3+6+9+4+5 = 27; 2+7 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '0', '1'], correct: 2 },
    { q: { en: 'A student calculated 342 × 57 = 19494. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 342 × 57 = 19494 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 342: 3+4+2 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 57: 5+7 = 12; 1+2 = 3 Step 3: Multiply the digit sums: 0×3 = 0 (check value) Step 4: Digit sum of the product 19494: 1+9+4+9+4 = 27; 2+7 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '7', '1', '0'], correct: 3 },
    { q: { en: 'A student calculated 1353 × 984 = 1331352. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 1353 × 984 = 1331352 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 1353: 1+3+5+3 = 12; 1+2 = 3 Step 2: Digit sum of 984: 9+8+4 = 21; 2+1 = 3 Step 3: Multiply the digit sums: 3×3 = 9 → 0 (platform rule: 9 displays as 0) Step 4: Digit sum of the product 1331352: 1+3+3+1+3+5+2 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['0', '8', '7', '1'], correct: 0 },
    { q: { en: 'A student calculated 789 × 456 = 359784. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 789 × 456 = 359784 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 789: 7+8+9 = 24; 2+4 = 6 Step 2: Digit sum of 456: 4+5+6 = 15; 1+5 = 6 Step 3: Multiply the digit sums: 6×6=36 → reduce: 3+6 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 4: Digit sum of the product 359784: 3+5+9+7+8+4 = 36; 3+6 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['0', '8', '7', '1'], correct: 0 },
    { q: { en: 'A student calculated 2468 × 73 = 180164. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 2468 × 73 = 180164 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 2468: 2+4+6+8 = 20; 2+0 = 2 Step 2: Digit sum of 73: 7+3 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 2×1 = 2 (check value) Step 4: Digit sum of the product 180164: 1+8+0+1+6+4 = 20; 2+0 = 2 Step 5: Check value (2) = product\'s digit sum (2) → verification passes Step 6: Answer — check value = 2' }, options: ['4', '3', '1', '2'], correct: 3 },
    { q: { en: 'A student calculated 9127 × 58 = 529366. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 9127 × 58 = 529366 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 9127: 9+1+2+7 = 19; 1+9 = 10; 1+0 = 1 Step 2: Digit sum of 58: 5+8 = 13; 1+3 = 4 Step 3: Multiply the digit sums: 1×4 = 4 (check value) Step 4: Digit sum of the product 529366: 5+2+9+3+6+6 = 31; 3+1 = 4 Step 5: Check value (4) = product\'s digit sum (4) → verification passes Step 6: Answer — check value = 4' }, options: ['4', '2', '3', '6'], correct: 0 },
    { q: { en: 'A student calculated 5634 × 829 = 4670586. Using the digit-sum (casting-out-nines) method, what is the check value?', hi: 'एक छात्र ने 5634 × 829 = 4670586 की गणना की। अंक-योग (नौ-निकालने की) विधि का उपयोग करते हुए, जांच मूल्य क्या है?' , exp: 'Step 1: Digit sum of 5634: 5+6+3+4 = 18; 1+8 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 2: Digit sum of 829: 8+2+9 = 19; 1+9 = 10; 1+0 = 1 Step 3: Multiply the digit sums: 0×1 = 0 (check value) Step 4: Digit sum of the product 4670586: 4+6+7+0+5+8+6 = 36; 3+6 = 9; 9 → 0 (platform rule: 9 displays as 0) Step 5: Check value (0) = product\'s digit sum (0) → verification passes Step 6: Answer — check value = 0' }, options: ['8', '0', '7', '1'], correct: 1 },
  ],
  l2_08: [
    { q: { en: 'Using the Vedic shortcut, find 62 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 62 × 5 ज्ञात करें।' , exp: 'Step 1: 62×10 = 620 Step 2: Divide by 2: 620÷2 = 310' }, options: ['320', '310', '315', '305'], correct: 1 },
    { q: { en: 'Using the Vedic shortcut, find 76 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 76 × 5 ज्ञात करें।' , exp: 'Step 1: 76×10 = 760 Step 2: Divide by 2: 760÷2 = 380' }, options: ['370', '380', '375', '390'], correct: 1 },
    { q: { en: 'Using the Vedic shortcut, find 79 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 79 × 5 ज्ञात करें।' , exp: 'Step 1: 79×10 = 790 Step 2: Divide by 2: 790÷2 = 395' }, options: ['390', '400', '385', '395'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 99 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 99 × 5 ज्ञात करें।' , exp: 'Step 1: 99×10 = 990 Step 2: Divide by 2: 990÷2 = 495' }, options: ['495', '490', '485', '505'], correct: 0 },
    { q: { en: 'Using the Vedic shortcut, find 24 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 24 × 25 ज्ञात करें।' , exp: 'Step 1: 24×100 = 2400 Step 2: Divide by 4: 2400÷4 = 600' }, options: ['610', '575', '600', '625'], correct: 2 },
    { q: { en: 'Using the Vedic shortcut, find 32 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 32 × 25 ज्ञात करें।' , exp: 'Step 1: 32×100 = 3200 Step 2: Divide by 4: 3200÷4 = 800' }, options: ['825', '810', '800', '775'], correct: 2 },
    { q: { en: 'Using the Vedic shortcut, find 488 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 488 × 5 ज्ञात करें।' , exp: 'Step 1: 488×10 = 4880 Step 2: Divide by 2: 4880÷2 = 2440' }, options: ['2440', '2435', '2430', '2450'], correct: 0 },
    { q: { en: 'Using the Vedic shortcut, find 330 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 330 × 5 ज्ञात करें।' , exp: 'Step 1: 330×10 = 3300 Step 2: Divide by 2: 3300÷2 = 1650' }, options: ['1655', '1640', '1660', '1650'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 396 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 396 × 5 ज्ञात करें।' , exp: 'Step 1: 396×10 = 3960 Step 2: Divide by 2: 3960÷2 = 1980' }, options: ['1990', '1980', '1975', '1985'], correct: 1 },
    { q: { en: 'Using the Vedic shortcut, find 39 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 39 × 25 ज्ञात करें।' , exp: 'Step 1: 39×100 = 3900 Step 2: Divide by 4: 3900÷4 = 975' }, options: ['985', '965', '975', '950'], correct: 2 },
    { q: { en: 'Using the Vedic shortcut, find 240 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 240 × 25 ज्ञात करें।' , exp: 'Step 1: 240×100 = 24000 Step 2: Divide by 4: 24000÷4 = 6000' }, options: ['5975', '5990', '6010', '6000'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 129 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 129 × 25 ज्ञात करें।' , exp: 'Step 1: 129×100 = 12900 Step 2: Divide by 4: 12900÷4 = 3225' }, options: ['3250', '3235', '3200', '3225'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 592 × 125.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 592 × 125 ज्ञात करें।' , exp: 'Step 1: 592×1000 = 592000 Step 2: Divide by 8: 592000÷8 = 74000' }, options: ['73875', '74125', '73990', '74000'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 19 × 125.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 19 × 125 ज्ञात करें।' , exp: 'Step 1: 19×1000 = 19000 Step 2: Divide by 8: 19000÷8 = 2375' }, options: ['2375', '2385', '2500', '2250'], correct: 0 },
    { q: { en: 'Using the Vedic shortcut, find 2641 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 2641 × 5 ज्ञात करें।' , exp: 'Step 1: 2641×10 = 26410 Step 2: Divide by 2: 26410÷2 = 13205' }, options: ['13215', '13200', '13195', '13205'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 3567 × 5.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 3567 × 5 ज्ञात करें।' , exp: 'Step 1: 3567×10 = 35670 Step 2: Divide by 2: 35670÷2 = 17835' }, options: ['17825', '17830', '17835', '17845'], correct: 2 },
    { q: { en: 'Using the Vedic shortcut, find 8516 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 8516 × 25 ज्ञात करें।' , exp: 'Step 1: 8516×100 = 851600 Step 2: Divide by 4: 851600÷4 = 212900' }, options: ['212910', '212875', '212900', '212890'], correct: 2 },
    { q: { en: 'Using the Vedic shortcut, find 5064 × 25.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 5064 × 25 ज्ञात करें।' , exp: 'Step 1: 5064×100 = 506400 Step 2: Divide by 4: 506400÷4 = 126600' }, options: ['126610', '126575', '126625', '126600'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 6300 × 125.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 6300 × 125 ज्ञात करें।' , exp: 'Step 1: 6300×1000 = 6300000 Step 2: Divide by 8: 6300000÷8 = 787500' }, options: ['787510', '787625', '787490', '787500'], correct: 3 },
    { q: { en: 'Using the Vedic shortcut, find 9782 × 125.', hi: 'वैदिक शॉर्टकट का उपयोग करते हुए, 9782 × 125 ज्ञात करें।' , exp: 'Step 1: 9782×1000 = 9782000 Step 2: Divide by 8: 9782000÷8 = 1222750' }, options: ['1222740', '1222875', '1222625', '1222750'], correct: 3 },
  ],
  l2_09: [
    { q: { en: 'Using the Straight Division method, divide 384 by 21. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 384 को 21 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 21 -> principal divisor 2, flag 1 Step 2: 3 ÷ 2 = 1 r 1 Step 3: 18 - 1×1 = 17, ÷2 = 8 r 1 Step 4: Remainder: 14 - 1×8 = 6 Step 5: Answer — Q = 18, R = 6 (check: 21×18+6 = 384)' }, options: ['Q = 18, R = 7', 'Q = 19, R = 5', 'Q = 17, R = 6', 'Q = 18, R = 6'], correct: 3 },
    { q: { en: 'Using the Straight Division method, divide 764 by 33. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 764 को 33 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 33 -> principal divisor 3, flag 3 Step 2: 7 ÷ 3 = 2 r 1 Step 3: 16 - 3×2 = 10, ÷3 = 3 r 1 Step 4: Remainder: 14 - 3×3 = 5 Step 5: Answer — Q = 23, R = 5 (check: 33×23+5 = 764)' }, options: ['Q = 24, R = 2', 'Q = 23, R = 5', 'Q = 22, R = 5', 'Q = 23, R = 6'], correct: 1 },
    { q: { en: 'Using the Straight Division method, divide 581 by 32. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 581 को 32 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 32 -> principal divisor 3, flag 2 Step 2: 5 ÷ 3 = 1 r 2 Step 3: 28 - 2×1 = 26, ÷3 = 8 r 2 Step 4: Remainder: 21 - 2×8 = 5 Step 5: Answer — Q = 18, R = 5 (check: 32×18+5 = 581)' }, options: ['Q = 18, R = 5', 'Q = 18, R = 6', 'Q = 19, R = 3', 'Q = 17, R = 5'], correct: 0 },
    { q: { en: 'Using the Straight Division method, divide 388 by 35. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 388 को 35 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 35 -> principal divisor 3, flag 5 Step 2: 3 ÷ 3 = 1 r 0 Step 3: 8 - 5×1 = 3, ÷3 = 1 r 0 Step 4: Remainder: 8 - 5×1 = 3 Step 5: Answer — Q = 11, R = 3 (check: 35×11+3 = 388)' }, options: ['Q = 11, R = 3', 'Q = 12, R = 0', 'Q = 10, R = 3', 'Q = 11, R = 4'], correct: 0 },
    { q: { en: 'Using the Straight Division method, divide 302 by 27. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 302 को 27 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 27 -> principal divisor 2, flag 7 Step 2: 3 ÷ 2 = 1 r 1 Step 3: 10 - 7×1 = 3, ÷2 = 1 r 1 Step 4: Remainder: 12 - 7×1 = 5 Step 5: Answer — Q = 11, R = 5 (check: 27×11+5 = 302)' }, options: ['Q = 11, R = 5', 'Q = 12, R = 0', 'Q = 10, R = 5', 'Q = 11, R = 6'], correct: 0 },
    { q: { en: 'Using the Straight Division method, divide 668 by 31. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 668 को 31 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 31 -> principal divisor 3, flag 1 Step 2: 6 ÷ 3 = 2 r 0 Step 3: 6 - 1×2 = 4, ÷3 = 1 r 1 Step 4: Remainder: 18 - 1×1 = 17 Step 5: Answer — Q = 21, R = 17 (check: 31×21+17 = 668)' }, options: ['Q = 20, R = 17', 'Q = 22, R = 16', 'Q = 21, R = 17', 'Q = 21, R = 18'], correct: 2 },
    { q: { en: 'Using the Straight Division method, divide 9441 by 66. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 9441 को 66 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 66 -> principal divisor 6, flag 6 Step 2: 9 ÷ 6 = 1 r 3 Step 3: 34 - 6×1 = 28, ÷6 = 4 r 4 Step 4: 44 - 6×4 = 20, ÷6 = 3 r 2 Step 5: Remainder: 21 - 6×3 = 3 Step 6: Answer — Q = 143, R = 3 (check: 66×143+3 = 9441)' }, options: ['Q = 142, R = 3', 'Q = 143, R = 4', 'Q = 144, R = 0', 'Q = 143, R = 3'], correct: 3 },
    { q: { en: 'Using the Straight Division method, divide 9667 by 21. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 9667 को 21 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 21 -> principal divisor 2, flag 1 Step 2: 9 ÷ 2 = 4 r 1 Step 3: 16 - 1×4 = 12, ÷2 = 6 r 0 Step 4: 6 - 1×6 = 0, ÷2 = 0 r 0 Step 5: Remainder: 7 - 1×0 = 7 Step 6: Answer — Q = 460, R = 7 (check: 21×460+7 = 9667)' }, options: ['Q = 461, R = 6', 'Q = 460, R = 7', 'Q = 459, R = 7', 'Q = 460, R = 8'], correct: 1 },
    { q: { en: 'Using the Straight Division method, divide 6951 by 21. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 6951 को 21 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 21 -> principal divisor 2, flag 1 Step 2: 6 ÷ 2 = 3 r 0 Step 3: 9 - 1×3 = 6, ÷2 = 3 r 0 Step 4: 5 - 1×3 = 2, ÷2 = 1 r 0 Step 5: Remainder: 1 - 1×1 = 0 Step 6: Answer — Q = 331, R = 0 (check: 21×331+0 = 6951)' }, options: ['Q = 331, R = 1', 'Q = 331, R = 0', 'Q = 332, R = 0', 'Q = 330, R = 0'], correct: 1 },
    { q: { en: 'Using the Straight Division method, divide 4993 by 38. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 4993 को 38 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 38 -> principal divisor 3, flag 8 Step 2: 4 ÷ 3 = 1 r 1 Step 3: 19 - 8×1 = 11, ÷3 = 3 r 2 Step 4: 29 - 8×3 = 5, ÷3 = 1 r 2 Step 5: Remainder: 23 - 8×1 = 15 Step 6: Answer — Q = 131, R = 15 (check: 38×131+15 = 4993)' }, options: ['Q = 130, R = 15', 'Q = 132, R = 7', 'Q = 131, R = 16', 'Q = 131, R = 15'], correct: 3 },
    { q: { en: 'Using the Straight Division method, divide 4472 by 22. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 4472 को 22 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 22 -> principal divisor 2, flag 2 Step 2: 4 ÷ 2 = 2 r 0 Step 3: 4 - 2×2 = 0, ÷2 = 0 r 0 Step 4: 7 - 2×0 = 7, ÷2 = 3 r 1 Step 5: Remainder: 12 - 2×3 = 6 Step 6: Answer — Q = 203, R = 6 (check: 22×203+6 = 4472)' }, options: ['Q = 202, R = 6', 'Q = 203, R = 6', 'Q = 204, R = 4', 'Q = 203, R = 7'], correct: 1 },
    { q: { en: 'Using the Straight Division method, divide 4691 by 51. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 4691 को 51 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 51 -> principal divisor 5, flag 1 Step 2: 46 ÷ 5 = 9 r 1 Step 3: 19 - 1×9 = 10, ÷5 = 2 r 0 Step 4: negative → reduce previous digit (2→1), remainder +5 Step 5: Remainder: 51 - 1×1 = 50 Step 6: Answer — Q = 91, R = 50 (check: 51×91+50 = 4691)' }, options: ['Q = 92, R = 49', 'Q = 91, R = 50', 'Q = 91, R = 49', 'Q = 90, R = 50'], correct: 1 },
    { q: { en: 'Using the Straight Division method, divide 9338 by 23. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 9338 को 23 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 23 -> principal divisor 2, flag 3 Step 2: 9 ÷ 2 = 4 r 1 Step 3: 13 - 3×4 = 1, ÷2 = 0 r 1 Step 4: 13 - 3×0 = 13, ÷2 = 6 r 1 Step 5: Remainder: 18 - 3×6 = 0 Step 6: Answer — Q = 406, R = 0 (check: 23×406+0 = 9338)' }, options: ['Q = 406, R = 1', 'Q = 407, R = 0', 'Q = 405, R = 0', 'Q = 406, R = 0'], correct: 3 },
    { q: { en: 'Using the Straight Division method, divide 1650 by 67. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 1650 को 67 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 67 -> principal divisor 6, flag 7 Step 2: 16 ÷ 6 = 2 r 4 Step 3: 45 - 7×2 = 31, ÷6 = 5 r 1 Step 4: negative → reduce previous digit (5→4), remainder +6 Step 5: Remainder: 70 - 7×4 = 42 Step 6: Answer — Q = 24, R = 42 (check: 67×24+42 = 1650)' }, options: ['Q = 25, R = 35', 'Q = 24, R = 43', 'Q = 24, R = 42', 'Q = 23, R = 42'], correct: 2 },
    { q: { en: 'Using the Straight Division method, divide 49385 by 42. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 49385 को 42 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 42 -> principal divisor 4, flag 2 Step 2: 4 ÷ 4 = 1 r 0 Step 3: 9 - 2×1 = 7, ÷4 = 1 r 3 Step 4: 33 - 2×1 = 31, ÷4 = 7 r 3 Step 5: 38 - 2×7 = 24, ÷4 = 6 r 0 Step 6: negative → reduce previous digit (6→5), remainder +4 Step 7: Remainder: 45 - 2×5 = 35 Step 8: Answer — Q = 1175, R = 35 (check: 42×1175+35 = 49385)' }, options: ['Q = 1175, R = 35', 'Q = 1174, R = 35', 'Q = 1176, R = 33', 'Q = 1175, R = 36'], correct: 0 },
    { q: { en: 'Using the Straight Division method, divide 43341 by 92. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 43341 को 92 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 92 -> principal divisor 9, flag 2 Step 2: 43 ÷ 9 = 4 r 7 Step 3: 73 - 2×4 = 65, ÷9 = 7 r 2 Step 4: 24 - 2×7 = 10, ÷9 = 1 r 1 Step 5: Remainder: 11 - 2×1 = 9 Step 6: Answer — Q = 471, R = 9 (check: 92×471+9 = 43341)' }, options: ['Q = 470, R = 9', 'Q = 471, R = 10', 'Q = 471, R = 9', 'Q = 472, R = 7'], correct: 2 },
    { q: { en: 'Using the Straight Division method, divide 68574 by 91. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 68574 को 91 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 91 -> principal divisor 9, flag 1 Step 2: 68 ÷ 9 = 7 r 5 Step 3: 55 - 1×7 = 48, ÷9 = 5 r 3 Step 4: 37 - 1×5 = 32, ÷9 = 3 r 5 Step 5: Remainder: 54 - 1×3 = 51 Step 6: Answer — Q = 753, R = 51 (check: 91×753+51 = 68574)' }, options: ['Q = 753, R = 51', 'Q = 752, R = 51', 'Q = 753, R = 52', 'Q = 754, R = 50'], correct: 0 },
    { q: { en: 'Using the Straight Division method, divide 34483 by 41. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 34483 को 41 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 41 -> principal divisor 4, flag 1 Step 2: 34 ÷ 4 = 8 r 2 Step 3: 24 - 1×8 = 16, ÷4 = 4 r 0 Step 4: 8 - 1×4 = 4, ÷4 = 1 r 0 Step 5: Remainder: 3 - 1×1 = 2 Step 6: Answer — Q = 841, R = 2 (check: 41×841+2 = 34483)' }, options: ['Q = 841, R = 3', 'Q = 842, R = 1', 'Q = 841, R = 2', 'Q = 840, R = 2'], correct: 2 },
    { q: { en: 'Using the Straight Division method, divide 27530 by 74. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 27530 को 74 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 74 -> principal divisor 7, flag 4 Step 2: 27 ÷ 7 = 3 r 6 Step 3: 65 - 4×3 = 53, ÷7 = 7 r 4 Step 4: 43 - 4×7 = 15, ÷7 = 2 r 1 Step 5: Remainder: 10 - 4×2 = 2 Step 6: Answer — Q = 372, R = 2 (check: 74×372+2 = 27530)' }, options: ['Q = 373, R = 0', 'Q = 372, R = 3', 'Q = 372, R = 2', 'Q = 371, R = 2'], correct: 2 },
    { q: { en: 'Using the Straight Division method, divide 22832 by 92. What is the quotient and remainder?', hi: 'स्ट्रेट डिवीज़न विधि का उपयोग करते हुए, 22832 को 92 से भाग दें। भागफल और शेषफल क्या है?' , exp: 'Step 1: 92 -> principal divisor 9, flag 2 Step 2: 22 ÷ 9 = 2 r 4 Step 3: 48 - 2×2 = 44, ÷9 = 4 r 8 Step 4: 83 - 2×4 = 75, ÷9 = 8 r 3 Step 5: Remainder: 32 - 2×8 = 16 Step 6: Answer — Q = 248, R = 16 (check: 92×248+16 = 22832)' }, options: ['Q = 249, R = 14', 'Q = 247, R = 16', 'Q = 248, R = 17', 'Q = 248, R = 16'], correct: 3 },
  ],
  l2_10: [
    { q: { en: 'Using the Vedic cross-multiplication method, find 1/2 + 1/3 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 1/2 + 1/3 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 1×3=3 and 1×2=2 Step 2: Numerator: 3 + 2 = 5 Step 3: Denominator: 2×3 = 6 Step 4: 5/6 is already in simplest form (GCD = 1) Step 5: Answer — 1/2 + 1/3 = 5/6' }, options: ['6/6', '5/7', '5/6', '4/6'], correct: 2 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 2/3 + 1/6 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 2/3 + 1/6 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 2×6=12 and 1×3=3 Step 2: Numerator: 12 + 3 = 15 Step 3: Denominator: 3×6 = 18 Step 4: Simplify by GCD 3: 15/18 = 5/6 Step 5: Answer — 2/3 + 1/6 = 5/6' }, options: ['5/6', '6/6', '5/7', '15/18'], correct: 0 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 3/4 − 1/4 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 3/4 − 1/4 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 3×4=12 and 1×4=4 Step 2: Numerator: 12 - 4 = 8 Step 3: Denominator: 4×4 = 16 Step 4: Simplify by GCD 8: 8/16 = 1/2 Step 5: Answer — 3/4 - 1/4 = 1/2' }, options: ['1/2', '8/16', '1/3', '2/2'], correct: 0 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 1/4 + 1/2 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 1/4 + 1/2 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 1×2=2 and 1×4=4 Step 2: Numerator: 2 + 4 = 6 Step 3: Denominator: 4×2 = 8 Step 4: Simplify by GCD 2: 6/8 = 3/4 Step 5: Answer — 1/4 + 1/2 = 3/4' }, options: ['6/8', '3/4', '4/4', '3/5'], correct: 1 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 5/6 − 1/6 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 5/6 − 1/6 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 5×6=30 and 1×6=6 Step 2: Numerator: 30 - 6 = 24 Step 3: Denominator: 6×6 = 36 Step 4: Simplify by GCD 12: 24/36 = 2/3 Step 5: Answer — 5/6 - 1/6 = 2/3' }, options: ['2/4', '3/3', '24/36', '2/3'], correct: 3 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 1/3 + 1/2 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 1/3 + 1/2 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 1×2=2 and 1×3=3 Step 2: Numerator: 2 + 3 = 5 Step 3: Denominator: 3×2 = 6 Step 4: 5/6 is already in simplest form (GCD = 1) Step 5: Answer — 1/3 + 1/2 = 5/6' }, options: ['6/6', '5/7', '5/6', '7/6'], correct: 2 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 3/5 + 2/7 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 3/5 + 2/7 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 3×7=21 and 2×5=10 Step 2: Numerator: 21 + 10 = 31 Step 3: Denominator: 5×7 = 35 Step 4: 31/35 is already in simplest form (GCD = 1) Step 5: Answer — 3/5 + 2/7 = 31/35' }, options: ['32/35', '31/35', '31/36', '33/35'], correct: 1 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 5/8 − 1/3 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 5/8 − 1/3 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 5×3=15 and 1×8=8 Step 2: Numerator: 15 - 8 = 7 Step 3: Denominator: 8×3 = 24 Step 4: 7/24 is already in simplest form (GCD = 1) Step 5: Answer — 5/8 - 1/3 = 7/24' }, options: ['7/25', '7/24', '8/24', '9/24'], correct: 1 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 4/9 + 2/3 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 4/9 + 2/3 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 4×3=12 and 2×9=18 Step 2: Numerator: 12 + 18 = 30 Step 3: Denominator: 9×3 = 27 Step 4: Simplify by GCD 3: 30/27 = 10/9 Step 5: Answer — 4/9 + 2/3 = 10/9' }, options: ['11/9', '30/27', '10/9', '10/10'], correct: 2 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 7/10 − 1/4 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 7/10 − 1/4 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 7×4=28 and 1×10=10 Step 2: Numerator: 28 - 10 = 18 Step 3: Denominator: 10×4 = 40 Step 4: Simplify by GCD 2: 18/40 = 9/20 Step 5: Answer — 7/10 - 1/4 = 9/20' }, options: ['9/20', '9/21', '18/40', '10/20'], correct: 0 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 5/12 + 1/4 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 5/12 + 1/4 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 5×4=20 and 1×12=12 Step 2: Numerator: 20 + 12 = 32 Step 3: Denominator: 12×4 = 48 Step 4: Simplify by GCD 16: 32/48 = 2/3 Step 5: Answer — 5/12 + 1/4 = 2/3' }, options: ['32/48', '2/4', '3/3', '2/3'], correct: 3 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 3/4 − 2/5 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 3/4 − 2/5 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 3×5=15 and 2×4=8 Step 2: Numerator: 15 - 8 = 7 Step 3: Denominator: 4×5 = 20 Step 4: 7/20 is already in simplest form (GCD = 1) Step 5: Answer — 3/4 - 2/5 = 7/20' }, options: ['7/20', '8/20', '7/21', '9/20'], correct: 0 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 5/6 + 3/8 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 5/6 + 3/8 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 5×8=40 and 3×6=18 Step 2: Numerator: 40 + 18 = 58 Step 3: Denominator: 6×8 = 48 Step 4: Simplify by GCD 2: 58/48 = 29/24 Step 5: Answer — 5/6 + 3/8 = 29/24' }, options: ['29/25', '30/24', '58/48', '29/24'], correct: 3 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 7/9 − 1/3 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 7/9 − 1/3 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 7×3=21 and 1×9=9 Step 2: Numerator: 21 - 9 = 12 Step 3: Denominator: 9×3 = 27 Step 4: Simplify by GCD 3: 12/27 = 4/9 Step 5: Answer — 7/9 - 1/3 = 4/9' }, options: ['4/10', '4/9', '12/27', '5/9'], correct: 1 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 7/12 + 5/18 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 7/12 + 5/18 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 7×18=126 and 5×12=60 Step 2: Numerator: 126 + 60 = 186 Step 3: Denominator: 12×18 = 216 Step 4: Simplify by GCD 6: 186/216 = 31/36 Step 5: Answer — 7/12 + 5/18 = 31/36' }, options: ['186/216', '31/37', '32/36', '31/36'], correct: 3 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 11/15 − 3/10 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 11/15 − 3/10 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 11×10=110 and 3×15=45 Step 2: Numerator: 110 - 45 = 65 Step 3: Denominator: 15×10 = 150 Step 4: Simplify by GCD 5: 65/150 = 13/30 Step 5: Answer — 11/15 - 3/10 = 13/30' }, options: ['14/30', '13/31', '13/30', '65/150'], correct: 2 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 9/14 + 5/21 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 9/14 + 5/21 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 9×21=189 and 5×14=70 Step 2: Numerator: 189 + 70 = 259 Step 3: Denominator: 14×21 = 294 Step 4: Simplify by GCD 7: 259/294 = 37/42 Step 5: Answer — 9/14 + 5/21 = 37/42' }, options: ['37/42', '37/43', '38/42', '259/294'], correct: 0 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 13/18 − 7/24 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 13/18 − 7/24 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 13×24=312 and 7×18=126 Step 2: Numerator: 312 - 126 = 186 Step 3: Denominator: 18×24 = 432 Step 4: Simplify by GCD 6: 186/432 = 31/72 Step 5: Answer — 13/18 - 7/24 = 31/72' }, options: ['186/432', '32/72', '31/73', '31/72'], correct: 3 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 5/16 + 7/12 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 5/16 + 7/12 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 5×12=60 and 7×16=112 Step 2: Numerator: 60 + 112 = 172 Step 3: Denominator: 16×12 = 192 Step 4: Simplify by GCD 4: 172/192 = 43/48 Step 5: Answer — 5/16 + 7/12 = 43/48' }, options: ['172/192', '44/48', '43/48', '43/49'], correct: 2 },
    { q: { en: 'Using the Vedic cross-multiplication method, find 17/20 − 3/8 (give the answer in simplest form).', hi: 'वैदिक क्रॉस-गुणन विधि का उपयोग करते हुए, 17/20 − 3/8 ज्ञात करें (उत्तर सरलतम रूप में दें)।' , exp: 'Step 1: Cross-multiply: 17×8=136 and 3×20=60 Step 2: Numerator: 136 - 60 = 76 Step 3: Denominator: 20×8 = 160 Step 4: Simplify by GCD 4: 76/160 = 19/40 Step 5: Answer — 17/20 - 3/8 = 19/40' }, options: ['20/40', '19/40', '76/160', '19/41'], correct: 1 },
  ],
  l2_11: [
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 23 by 27.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 23 को 27 से गुणा करें।' , exp: 'Step 1: Tens digit same (2), units 3+7=10 -> pattern applies Step 2: Left part: 2×(2+1) = 2×3 = 6 Step 3: Right part: 3×7 = 21 Step 4: Combine: 6 and 21 → 621 Step 5: Answer — 23×27 = 621 (check: 23×27=621)' }, options: ['620', '621', '611', '631'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 68 by 62.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 68 को 62 से गुणा करें।' , exp: 'Step 1: Tens digit same (6), units 8+2=10 -> pattern applies Step 2: Left part: 6×(6+1) = 6×7 = 42 Step 3: Right part: 8×2 = 16 Step 4: Combine: 42 and 16 → 4216 Step 5: Answer — 68×62 = 4216 (check: 68×62=4216)' }, options: ['4316', '4216', '4226', '4206'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 24 by 26.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 24 को 26 से गुणा करें।' , exp: 'Step 1: Tens digit same (2), units 4+6=10 -> pattern applies Step 2: Left part: 2×(2+1) = 2×3 = 6 Step 3: Right part: 4×6 = 24 Step 4: Combine: 6 and 24 → 624 Step 5: Answer — 24×26 = 624 (check: 24×26=624)' }, options: ['614', '624', '623', '724'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 52 by 58.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 52 को 58 से गुणा करें।' , exp: 'Step 1: Tens digit same (5), units 2+8=10 -> pattern applies Step 2: Left part: 5×(5+1) = 5×6 = 30 Step 3: Right part: 2×8 = 16 Step 4: Combine: 30 and 16 → 3016 Step 5: Answer — 52×58 = 3016 (check: 52×58=3016)' }, options: ['3116', '3016', '3017', '3026'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 35 by 35.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 35 को 35 से गुणा करें।' , exp: 'Step 1: Tens digit same (3), units 5+5=10 -> pattern applies Step 2: Left part: 3×(3+1) = 3×4 = 12 Step 3: Right part: 5×5 = 25 Step 4: Combine: 12 and 25 → 1225 Step 5: Answer — 35×35 = 1225 (check: 35×35=1225)' }, options: ['1225', '1224', '1325', '1235'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 97 by 93.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 97 को 93 से गुणा करें।' , exp: 'Step 1: Tens digit same (9), units 7+3=10 -> pattern applies Step 2: Left part: 9×(9+1) = 9×10 = 90 Step 3: Right part: 7×3 = 21 Step 4: Combine: 90 and 21 → 9021 Step 5: Answer — 97×93 = 9021 (check: 97×93=9021)' }, options: ['9021', '9022', '9031', '9011'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 751 by 759.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 751 को 759 से गुणा करें।' , exp: 'Step 1: Tens digit same (75), units 1+9=10 -> pattern applies Step 2: Left part: 75×(75+1) = 75×76 = 5700 Step 3: Right part: 1×9 = 9 Step 4: Combine: 5700 and 09 → 570009 Step 5: Answer — 751×759 = 570009 (check: 751×759=570009)' }, options: ['570010', '570009', '570109', '570019'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 838 by 832.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 838 को 832 से गुणा करें।' , exp: 'Step 1: Tens digit same (83), units 8+2=10 -> pattern applies Step 2: Left part: 83×(83+1) = 83×84 = 6972 Step 3: Right part: 8×2 = 16 Step 4: Combine: 6972 and 16 → 697216 Step 5: Answer — 838×832 = 697216 (check: 838×832=697216)' }, options: ['697217', '697216', '697316', '697215'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 599 by 591.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 599 को 591 से गुणा करें।' , exp: 'Step 1: Tens digit same (59), units 9+1=10 -> pattern applies Step 2: Left part: 59×(59+1) = 59×60 = 3540 Step 3: Right part: 9×1 = 9 Step 4: Combine: 3540 and 09 → 354009 Step 5: Answer — 599×591 = 354009 (check: 599×591=354009)' }, options: ['354008', '354109', '354009', '354010'], correct: 2 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 616 by 614.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 616 को 614 से गुणा करें।' , exp: 'Step 1: Tens digit same (61), units 6+4=10 -> pattern applies Step 2: Left part: 61×(61+1) = 61×62 = 3782 Step 3: Right part: 6×4 = 24 Step 4: Combine: 3782 and 24 → 378224 Step 5: Answer — 616×614 = 378224 (check: 616×614=378224)' }, options: ['378234', '378324', '378224', '378223'], correct: 2 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 901 by 909.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 901 को 909 से गुणा करें।' , exp: 'Step 1: Tens digit same (90), units 1+9=10 -> pattern applies Step 2: Left part: 90×(90+1) = 90×91 = 8190 Step 3: Right part: 1×9 = 9 Step 4: Combine: 8190 and 09 → 819009 Step 5: Answer — 901×909 = 819009 (check: 901×909=819009)' }, options: ['819010', '819009', '819008', '819019'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 905 by 905.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 905 को 905 से गुणा करें।' , exp: 'Step 1: Tens digit same (90), units 5+5=10 -> pattern applies Step 2: Left part: 90×(90+1) = 90×91 = 8190 Step 3: Right part: 5×5 = 25 Step 4: Combine: 8190 and 25 → 819025 Step 5: Answer — 905×905 = 819025 (check: 905×905=819025)' }, options: ['819015', '819025', '819024', '819026'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 154 by 156.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 154 को 156 से गुणा करें।' , exp: 'Step 1: Tens digit same (15), units 4+6=10 -> pattern applies Step 2: Left part: 15×(15+1) = 15×16 = 240 Step 3: Right part: 4×6 = 24 Step 4: Combine: 240 and 24 → 24024 Step 5: Answer — 154×156 = 24024 (check: 154×156=24024)' }, options: ['24034', '24024', '24023', '24025'], correct: 1 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 649 by 641.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 649 को 641 से गुणा करें।' , exp: 'Step 1: Tens digit same (64), units 9+1=10 -> pattern applies Step 2: Left part: 64×(64+1) = 64×65 = 4160 Step 3: Right part: 9×1 = 9 Step 4: Combine: 4160 and 09 → 416009 Step 5: Answer — 649×641 = 416009 (check: 649×641=416009)' }, options: ['416009', '416008', '416109', '416019'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 1537 by 1533.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 1537 को 1533 से गुणा करें।' , exp: 'Step 1: Tens digit same (153), units 7+3=10 -> pattern applies Step 2: Left part: 153×(153+1) = 153×154 = 23562 Step 3: Right part: 7×3 = 21 Step 4: Combine: 23562 and 21 → 2356221 Step 5: Answer — 1537×1533 = 2356221 (check: 1537×1533=2356221)' }, options: ['2356221', '2356211', '2356222', '2356321'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 6147 by 6143.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 6147 को 6143 से गुणा करें।' , exp: 'Step 1: Tens digit same (614), units 7+3=10 -> pattern applies Step 2: Left part: 614×(614+1) = 614×615 = 377610 Step 3: Right part: 7×3 = 21 Step 4: Combine: 377610 and 21 → 37761021 Step 5: Answer — 6147×6143 = 37761021 (check: 6147×6143=37761021)' }, options: ['37761021', '37761020', '37761031', '37761022'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 8824 by 8826.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 8824 को 8826 से गुणा करें।' , exp: 'Step 1: Tens digit same (882), units 4+6=10 -> pattern applies Step 2: Left part: 882×(882+1) = 882×883 = 778806 Step 3: Right part: 4×6 = 24 Step 4: Combine: 778806 and 24 → 77880624 Step 5: Answer — 8824×8826 = 77880624 (check: 8824×8826=77880624)' }, options: ['77880623', '77880614', '77880625', '77880624'], correct: 3 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 9584 by 9586.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 9584 को 9586 से गुणा करें।' , exp: 'Step 1: Tens digit same (958), units 4+6=10 -> pattern applies Step 2: Left part: 958×(958+1) = 958×959 = 918722 Step 3: Right part: 4×6 = 24 Step 4: Combine: 918722 and 24 → 91872224 Step 5: Answer — 9584×9586 = 91872224 (check: 9584×9586=91872224)' }, options: ['91872224', '91872223', '91872324', '91872214'], correct: 0 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 2994 by 2996.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 2994 को 2996 से गुणा करें।' , exp: 'Step 1: Tens digit same (299), units 4+6=10 -> pattern applies Step 2: Left part: 299×(299+1) = 299×300 = 89700 Step 3: Right part: 4×6 = 24 Step 4: Combine: 89700 and 24 → 8970024 Step 5: Answer — 2994×2996 = 8970024 (check: 2994×2996=8970024)' }, options: ['8970023', '8970014', '8970124', '8970024'], correct: 3 },
    { q: { en: 'Using the Antyayor Dashakepi method, multiply 3372 by 3378.', hi: 'अंत्ययोर् दशकेऽपि विधि का उपयोग करते हुए, 3372 को 3378 से गुणा करें।' , exp: 'Step 1: Tens digit same (337), units 2+8=10 -> pattern applies Step 2: Left part: 337×(337+1) = 337×338 = 113906 Step 3: Right part: 2×8 = 16 Step 4: Combine: 113906 and 16 → 11390616 Step 5: Answer — 3372×3378 = 11390616 (check: 3372×3378=11390616)' }, options: ['11390606', '11390615', '11390616', '11390617'], correct: 2 },
  ],
  l2_12: [
    { q: { en: 'Using the Vedic calendar method, what day of the week was July 20, 1969?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 20 जुलाई 1969 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 1969 Step 2: Year code: 1969 mod 7 = 2 Step 3: Century/leap adjustment: (1969÷4 - 1969÷100 + 1969÷400) mod 7 = 1 Step 4: Month code for July: 5 Step 5: Date: 20 Step 6: Sum all codes: 2+1+5+20 = 28, mod 7 = 0 Step 7: Answer — July 20, 1969 was a Sunday' }, options: ['Thursday', 'Sunday', 'Monday', 'Saturday'], correct: 1 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 29, 2096?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 29 फरवरी 2096 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 2096-1 = 2095 for the year codes Step 2: Year code: 2095 mod 7 = 2 Step 3: Century/leap adjustment: (2095÷4 - 2095÷100 + 2095÷400) mod 7 = 4 Step 4: Month code for February: 3 Step 5: Date: 29 Step 6: Sum all codes: 2+4+3+29 = 38, mod 7 = 3 Step 7: Answer — February 29, 2096 was a Wednesday' }, options: ['Tuesday', 'Thursday', 'Wednesday', 'Monday'], correct: 2 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 29, 1904?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 29 फरवरी 1904 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 1904-1 = 1903 for the year codes Step 2: Year code: 1903 mod 7 = 6 Step 3: Century/leap adjustment: (1903÷4 - 1903÷100 + 1903÷400) mod 7 = 5 Step 4: Month code for February: 3 Step 5: Date: 29 Step 6: Sum all codes: 6+5+3+29 = 43, mod 7 = 1 Step 7: Answer — February 29, 1904 was a Monday' }, options: ['Thursday', 'Wednesday', 'Monday', 'Saturday'], correct: 2 },
    { q: { en: 'Republic Day in 2027 falls on January 26, 2027. Using the Vedic calendar method, what day of the week will it be?', hi: '2027 में गणतंत्र दिवस 26 जनवरी 2027 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 2027-1 = 2026 for the year codes Step 2: Year code: 2026 mod 7 = 3 Step 3: Century/leap adjustment: (2026÷4 - 2026÷100 + 2026÷400) mod 7 = 1 Step 4: Month code for January: 0 Step 5: Date: 26 Step 6: Sum all codes: 3+1+0+26 = 30, mod 7 = 2 Step 7: Answer — January 26, 2027 was a Tuesday' }, options: ['Tuesday', 'Friday', 'Wednesday', 'Sunday'], correct: 0 },
    { q: { en: 'Independence Day in 2027 falls on August 15, 2027. Using the Vedic calendar method, what day of the week will it be?', hi: '2027 में स्वतंत्रता दिवस 15 अगस्त 2027 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2027 Step 2: Year code: 2027 mod 7 = 4 Step 3: Century/leap adjustment: (2027÷4 - 2027÷100 + 2027÷400) mod 7 = 1 Step 4: Month code for August: 1 Step 5: Date: 15 Step 6: Sum all codes: 4+1+1+15 = 21, mod 7 = 0 Step 7: Answer — August 15, 2027 was a Sunday' }, options: ['Monday', 'Sunday', 'Tuesday', 'Saturday'], correct: 1 },
    { q: { en: 'Teachers\' Day in 2028 falls on September 5, 2028. Using the Vedic calendar method, what day of the week will it be?', hi: '2028 में शिक्षक दिवस 5 सितंबर 2028 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2028 Step 2: Year code: 2028 mod 7 = 5 Step 3: Century/leap adjustment: (2028÷4 - 2028÷100 + 2028÷400) mod 7 = 2 Step 4: Month code for September: 4 Step 5: Date: 5 Step 6: Sum all codes: 5+2+4+5 = 16, mod 7 = 2 Step 7: Answer — September 5, 2028 was a Tuesday' }, options: ['Tuesday', 'Sunday', 'Wednesday', 'Saturday'], correct: 0 },
    { q: { en: 'Gandhi Jayanti in 2029 falls on October 2, 2029. Using the Vedic calendar method, what day of the week will it be?', hi: '2029 में गांधी जयंती 2 अक्टूबर 2029 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2029 Step 2: Year code: 2029 mod 7 = 6 Step 3: Century/leap adjustment: (2029÷4 - 2029÷100 + 2029÷400) mod 7 = 2 Step 4: Month code for October: 6 Step 5: Date: 2 Step 6: Sum all codes: 6+2+6+2 = 16, mod 7 = 2 Step 7: Answer — October 2, 2029 was a Tuesday' }, options: ['Tuesday', 'Thursday', 'Monday', 'Wednesday'], correct: 0 },
    { q: { en: 'Children\'s Day in 2030 falls on November 14, 2030. Using the Vedic calendar method, what day of the week will it be?', hi: '2030 में बाल दिवस 14 नवंबर 2030 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2030 Step 2: Year code: 2030 mod 7 = 0 Step 3: Century/leap adjustment: (2030÷4 - 2030÷100 + 2030÷400) mod 7 = 2 Step 4: Month code for November: 2 Step 5: Date: 14 Step 6: Sum all codes: 0+2+2+14 = 18, mod 7 = 4 Step 7: Answer — November 14, 2030 was a Thursday' }, options: ['Wednesday', 'Sunday', 'Thursday', 'Tuesday'], correct: 2 },
    { q: { en: 'New Year\'s Day in 2031 falls on January 1, 2031. Using the Vedic calendar method, what day of the week will it be?', hi: '2031 में नव वर्ष दिवस 1 जनवरी 2031 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 2031-1 = 2030 for the year codes Step 2: Year code: 2030 mod 7 = 0 Step 3: Century/leap adjustment: (2030÷4 - 2030÷100 + 2030÷400) mod 7 = 2 Step 4: Month code for January: 0 Step 5: Date: 1 Step 6: Sum all codes: 0+2+0+1 = 3, mod 7 = 3 Step 7: Answer — January 1, 2031 was a Wednesday' }, options: ['Monday', 'Wednesday', 'Friday', 'Thursday'], correct: 1 },
    { q: { en: 'Independence Day in 2032 falls on August 15, 2032. Using the Vedic calendar method, what day of the week will it be?', hi: '2032 में स्वतंत्रता दिवस 15 अगस्त 2032 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2032 Step 2: Year code: 2032 mod 7 = 2 Step 3: Century/leap adjustment: (2032÷4 - 2032÷100 + 2032÷400) mod 7 = 3 Step 4: Month code for August: 1 Step 5: Date: 15 Step 6: Sum all codes: 2+3+1+15 = 21, mod 7 = 0 Step 7: Answer — August 15, 2032 was a Sunday' }, options: ['Thursday', 'Friday', 'Saturday', 'Sunday'], correct: 3 },
    { q: { en: 'Republic Day in 2033 falls on January 26, 2033. Using the Vedic calendar method, what day of the week will it be?', hi: '2033 में गणतंत्र दिवस 26 जनवरी 2033 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 2033-1 = 2032 for the year codes Step 2: Year code: 2032 mod 7 = 2 Step 3: Century/leap adjustment: (2032÷4 - 2032÷100 + 2032÷400) mod 7 = 3 Step 4: Month code for January: 0 Step 5: Date: 26 Step 6: Sum all codes: 2+3+0+26 = 31, mod 7 = 3 Step 7: Answer — January 26, 2033 was a Wednesday' }, options: ['Friday', 'Thursday', 'Saturday', 'Wednesday'], correct: 3 },
    { q: { en: 'Christmas in 2034 falls on December 25, 2034. Using the Vedic calendar method, what day of the week will it be?', hi: '2034 में क्रिसमस 25 दिसंबर 2034 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2034 Step 2: Year code: 2034 mod 7 = 4 Step 3: Century/leap adjustment: (2034÷4 - 2034÷100 + 2034÷400) mod 7 = 3 Step 4: Month code for December: 4 Step 5: Date: 25 Step 6: Sum all codes: 4+3+4+25 = 36, mod 7 = 1 Step 7: Answer — December 25, 2034 was a Monday' }, options: ['Saturday', 'Friday', 'Wednesday', 'Monday'], correct: 3 },
    { q: { en: 'Teachers\' Day in 2035 falls on September 5, 2035. Using the Vedic calendar method, what day of the week will it be?', hi: '2035 में शिक्षक दिवस 5 सितंबर 2035 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2035 Step 2: Year code: 2035 mod 7 = 5 Step 3: Century/leap adjustment: (2035÷4 - 2035÷100 + 2035÷400) mod 7 = 3 Step 4: Month code for September: 4 Step 5: Date: 5 Step 6: Sum all codes: 5+3+4+5 = 17, mod 7 = 3 Step 7: Answer — September 5, 2035 was a Wednesday' }, options: ['Thursday', 'Wednesday', 'Tuesday', 'Sunday'], correct: 1 },
    { q: { en: 'Gandhi Jayanti in 2040 falls on October 2, 2040. Using the Vedic calendar method, what day of the week will it be?', hi: '2040 में गांधी जयंती 2 अक्टूबर 2040 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2040 Step 2: Year code: 2040 mod 7 = 3 Step 3: Century/leap adjustment: (2040÷4 - 2040÷100 + 2040÷400) mod 7 = 5 Step 4: Month code for October: 6 Step 5: Date: 2 Step 6: Sum all codes: 3+5+6+2 = 16, mod 7 = 2 Step 7: Answer — October 2, 2040 was a Tuesday' }, options: ['Saturday', 'Thursday', 'Tuesday', 'Friday'], correct: 2 },
    { q: { en: 'India\'s 100th Independence Day in 2047 falls on August 15, 2047. Using the Vedic calendar method, what day of the week will it be?', hi: '2047 में भारत का 100वां स्वतंत्रता दिवस 15 अगस्त 2047 को है। वैदिक कैलेंडर विधि का उपयोग करते हुए, यह सप्ताह का कौन सा दिन होगा?' , exp: 'Step 1: Year code base = 2047 Step 2: Year code: 2047 mod 7 = 3 Step 3: Century/leap adjustment: (2047÷4 - 2047÷100 + 2047÷400) mod 7 = 6 Step 4: Month code for August: 1 Step 5: Date: 15 Step 6: Sum all codes: 3+6+1+15 = 25, mod 7 = 4 Step 7: Answer — August 15, 2047 was a Thursday' }, options: ['Friday', 'Tuesday', 'Thursday', 'Monday'], correct: 2 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was June 15, 2023?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 15 जून 2023 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2023 Step 2: Year code: 2023 mod 7 = 0 Step 3: Century/leap adjustment: (2023÷4 - 2023÷100 + 2023÷400) mod 7 = 0 Step 4: Month code for June: 3 Step 5: Date: 15 Step 6: Sum all codes: 0+0+3+15 = 18, mod 7 = 4 Step 7: Answer — June 15, 2023 was a Thursday' }, options: ['Thursday', 'Monday', 'Sunday', 'Friday'], correct: 0 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was March 10, 2019?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 10 मार्च 2019 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2019 Step 2: Year code: 2019 mod 7 = 3 Step 3: Century/leap adjustment: (2019÷4 - 2019÷100 + 2019÷400) mod 7 = 6 Step 4: Month code for March: 2 Step 5: Date: 10 Step 6: Sum all codes: 3+6+2+10 = 21, mod 7 = 0 Step 7: Answer — March 10, 2019 was a Sunday' }, options: ['Monday', 'Saturday', 'Friday', 'Sunday'], correct: 3 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was September 22, 2015?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 22 सितंबर 2015 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2015 Step 2: Year code: 2015 mod 7 = 6 Step 3: Century/leap adjustment: (2015÷4 - 2015÷100 + 2015÷400) mod 7 = 5 Step 4: Month code for September: 4 Step 5: Date: 22 Step 6: Sum all codes: 6+5+4+22 = 37, mod 7 = 2 Step 7: Answer — September 22, 2015 was a Tuesday' }, options: ['Wednesday', 'Thursday', 'Sunday', 'Tuesday'], correct: 3 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was November 5, 2021?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 5 नवंबर 2021 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2021 Step 2: Year code: 2021 mod 7 = 5 Step 3: Century/leap adjustment: (2021÷4 - 2021÷100 + 2021÷400) mod 7 = 0 Step 4: Month code for November: 2 Step 5: Date: 5 Step 6: Sum all codes: 5+0+2+5 = 12, mod 7 = 5 Step 7: Answer — November 5, 2021 was a Friday' }, options: ['Monday', 'Wednesday', 'Thursday', 'Friday'], correct: 3 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was January 30, 2017?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 30 जनवरी 2017 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 2017-1 = 2016 for the year codes Step 2: Year code: 2016 mod 7 = 0 Step 3: Century/leap adjustment: (2016÷4 - 2016÷100 + 2016÷400) mod 7 = 6 Step 4: Month code for January: 0 Step 5: Date: 30 Step 6: Sum all codes: 0+6+0+30 = 36, mod 7 = 1 Step 7: Answer — January 30, 2017 was a Monday' }, options: ['Saturday', 'Sunday', 'Thursday', 'Monday'], correct: 3 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was August 8, 2024?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 8 अगस्त 2024 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2024 Step 2: Year code: 2024 mod 7 = 1 Step 3: Century/leap adjustment: (2024÷4 - 2024÷100 + 2024÷400) mod 7 = 1 Step 4: Month code for August: 1 Step 5: Date: 8 Step 6: Sum all codes: 1+1+1+8 = 11, mod 7 = 4 Step 7: Answer — August 8, 2024 was a Thursday' }, options: ['Thursday', 'Monday', 'Tuesday', 'Wednesday'], correct: 0 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was August 15, 1947?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 15 अगस्त 1947 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 1947 Step 2: Year code: 1947 mod 7 = 1 Step 3: Century/leap adjustment: (1947÷4 - 1947÷100 + 1947÷400) mod 7 = 2 Step 4: Month code for August: 1 Step 5: Date: 15 Step 6: Sum all codes: 1+2+1+15 = 19, mod 7 = 5 Step 7: Answer — August 15, 1947 was a Friday' }, options: ['Sunday', 'Wednesday', 'Friday', 'Tuesday'], correct: 2 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was January 26, 1950?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 26 जनवरी 1950 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 1950-1 = 1949 for the year codes Step 2: Year code: 1949 mod 7 = 3 Step 3: Century/leap adjustment: (1949÷4 - 1949÷100 + 1949÷400) mod 7 = 3 Step 4: Month code for January: 0 Step 5: Date: 26 Step 6: Sum all codes: 3+3+0+26 = 32, mod 7 = 4 Step 7: Answer — January 26, 1950 was a Thursday' }, options: ['Thursday', 'Tuesday', 'Saturday', 'Wednesday'], correct: 0 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was April 3, 1991?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 3 अप्रैल 1991 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 1991 Step 2: Year code: 1991 mod 7 = 3 Step 3: Century/leap adjustment: (1991÷4 - 1991÷100 + 1991÷400) mod 7 = 6 Step 4: Month code for April: 5 Step 5: Date: 3 Step 6: Sum all codes: 3+6+5+3 = 17, mod 7 = 3 Step 7: Answer — April 3, 1991 was a Wednesday' }, options: ['Wednesday', 'Saturday', 'Sunday', 'Tuesday'], correct: 0 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was December 25, 2008?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 25 दिसंबर 2008 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 2008 Step 2: Year code: 2008 mod 7 = 6 Step 3: Century/leap adjustment: (2008÷4 - 2008÷100 + 2008÷400) mod 7 = 4 Step 4: Month code for December: 4 Step 5: Date: 25 Step 6: Sum all codes: 6+4+4+25 = 39, mod 7 = 4 Step 7: Answer — December 25, 2008 was a Thursday' }, options: ['Monday', 'Thursday', 'Sunday', 'Wednesday'], correct: 1 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was June 6, 1935?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 6 जून 1935 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 1935 Step 2: Year code: 1935 mod 7 = 3 Step 3: Century/leap adjustment: (1935÷4 - 1935÷100 + 1935÷400) mod 7 = 6 Step 4: Month code for June: 3 Step 5: Date: 6 Step 6: Sum all codes: 3+6+3+6 = 18, mod 7 = 4 Step 7: Answer — June 6, 1935 was a Thursday' }, options: ['Tuesday', 'Thursday', 'Monday', 'Sunday'], correct: 1 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was October 10, 1999?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 10 अक्टूबर 1999 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Year code base = 1999 Step 2: Year code: 1999 mod 7 = 4 Step 3: Century/leap adjustment: (1999÷4 - 1999÷100 + 1999÷400) mod 7 = 1 Step 4: Month code for October: 6 Step 5: Date: 10 Step 6: Sum all codes: 4+1+6+10 = 21, mod 7 = 0 Step 7: Answer — October 10, 1999 was a Sunday' }, options: ['Wednesday', 'Friday', 'Sunday', 'Thursday'], correct: 2 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 14, 2005?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 14 फरवरी 2005 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 2005-1 = 2004 for the year codes Step 2: Year code: 2004 mod 7 = 2 Step 3: Century/leap adjustment: (2004÷4 - 2004÷100 + 2004÷400) mod 7 = 3 Step 4: Month code for February: 3 Step 5: Date: 14 Step 6: Sum all codes: 2+3+3+14 = 22, mod 7 = 1 Step 7: Answer — February 14, 2005 was a Monday' }, options: ['Thursday', 'Tuesday', 'Monday', 'Sunday'], correct: 2 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 29, 2000?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 29 फरवरी 2000 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 2000-1 = 1999 for the year codes Step 2: Year code: 1999 mod 7 = 4 Step 3: Century/leap adjustment: (1999÷4 - 1999÷100 + 1999÷400) mod 7 = 1 Step 4: Month code for February: 3 Step 5: Date: 29 Step 6: Sum all codes: 4+1+3+29 = 37, mod 7 = 2 Step 7: Answer — February 29, 2000 was a Tuesday' }, options: ['Tuesday', 'Sunday', 'Thursday', 'Monday'], correct: 0 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 29, 1996?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 29 फरवरी 1996 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 1996-1 = 1995 for the year codes Step 2: Year code: 1995 mod 7 = 0 Step 3: Century/leap adjustment: (1995÷4 - 1995÷100 + 1995÷400) mod 7 = 0 Step 4: Month code for February: 3 Step 5: Date: 29 Step 6: Sum all codes: 0+0+3+29 = 32, mod 7 = 4 Step 7: Answer — February 29, 1996 was a Thursday' }, options: ['Monday', 'Thursday', 'Saturday', 'Sunday'], correct: 1 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was January 1, 1900?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 1 जनवरी 1900 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is January (Jan/Feb), so use adjusted year 1900-1 = 1899 for the year codes Step 2: Year code: 1899 mod 7 = 2 Step 3: Century/leap adjustment: (1899÷4 - 1899÷100 + 1899÷400) mod 7 = 5 Step 4: Month code for January: 0 Step 5: Date: 1 Step 6: Sum all codes: 2+5+0+1 = 8, mod 7 = 1 Step 7: Answer — January 1, 1900 was a Monday' }, options: ['Tuesday', 'Saturday', 'Sunday', 'Monday'], correct: 3 },
    { q: { en: 'Using the Vedic calendar method, what day of the week was February 29, 2004?', hi: 'वैदिक कैलेंडर विधि का उपयोग करते हुए, 29 फरवरी 2004 को सप्ताह का कौन सा दिन था?' , exp: 'Step 1: Month is February (Jan/Feb), so use adjusted year 2004-1 = 2003 for the year codes Step 2: Year code: 2003 mod 7 = 1 Step 3: Century/leap adjustment: (2003÷4 - 2003÷100 + 2003÷400) mod 7 = 2 Step 4: Month code for February: 3 Step 5: Date: 29 Step 6: Sum all codes: 1+2+3+29 = 35, mod 7 = 0 Step 7: Answer — February 29, 2004 was a Sunday' }, options: ['Tuesday', 'Sunday', 'Thursday', 'Monday'], correct: 1 },
  ],
  l3_01: [
    { q: '31 × 22 = ?', options: ['672','682','692','702'], correct: 1 , exp: 'Units: 1×2=2. Cross: 3×2+1×2=8. Tens: 3×2=6. Answer: 682.' },
    { q: '43 × 31 = ?', options: ['1233','1323','1333','1343'], correct: 2 , exp: 'Units: 3×1=3. Cross: 4×1+3×3=13, write 3 carry 1. Tens: 4×3=12+1=13. Answer: 1333.' },
    { q: '52 × 21 = ?', options: ['1092','1082','1102','1072'], correct: 0 , exp: 'Units: 2×1=2. Cross: 5×1+2×2=9. Tens: 5×2=10. Answer: 1092.' },
    { q: 'Which step comes FIRST in Urdhva-Tiryagbhyam for AB × CD?', options: ['B×D','A×D+B×C','A×C','B×C'], correct: 2 , exp: 'Always start with the rightmost vertical: B×D (units×units).' },
    { q: '64 × 32 = ?', options: ['2038','2048','2058','2068'], correct: 1 , exp: 'Units: 4×2=8. Cross: 6×2+4×3=24, write 4 carry 2. Tens: 6×3=18+2=20. Answer: 2048.' },
  ],
  l3_02: [
    { q: '99 × 97 = ?', options: ['9503','9603','9403','9703'], correct: 1 , exp: 'Deficits: 1 and 3. Cross: 99−3=96. Product: 1×3=03. Answer: 9603.' },
    { q: '96 × 98 = ?', options: ['9408','9508','9308','9608'], correct: 0 , exp: 'Deficits: 4 and 2. Cross: 96−2=94. Product: 4×2=08. Answer: 9408.' },
    { q: 'For 88 × 96, the deficiencies are?', options: ['−12,−4','−12,−6','−8,−4','−8,−6'], correct: 0 , exp: 'Base 100: 100−88=12 and 100−96=4.' },
    { q: '994 × 998 = ?', options: ['992012','991012','992112','993012'], correct: 0 , exp: 'Deficits: 6 and 2. Cross: 994−2=992. Product: 6×2=012. Answer: 992012.' },
    { q: '95 × 95 = ?', options: ['9015','9025','9035','9045'], correct: 1 , exp: 'Deficits: 5 and 5. Cross: 95−5=90. Product: 5×5=25. Answer: 9025.' },
  ],
  l3_03: [
    { q: '49 × 47 = ?', options: ['2293','2303','2313','2283'], correct: 1 , exp: 'Near base 50. Deficits from 50: 1 and 3. Cross: 49−3=46, then ×(50/100×2)... direct: 49×47=(48−1)(48+1)... actually 49×47=2303.' },
    { q: 'For base-50 method, 46 × 48: the cross result is?', options: ['44','46','48','42'], correct: 0 , exp: 'Cross = either number minus the other\'s deficit: 46−2=44 or 48−4=44.' },
    { q: '198 × 197 = ?', options: ['39006','38906','39106','39206'], correct: 0 , exp: 'Near base 200. Deficits: 2 and 3. Cross: 198−3=195. Product: 2×3=006. Answer: 195×200+6? No: 195|006... base-200 means multiply cross by 200 then add product = 39000+6=39006.' },
    { q: '44 × 46 = ?', options: ['2014','2024','2034','2044'], correct: 1 , exp: 'Near base 50. Cross: 44−4=40 (×50/50=40 — half-base method: 40/2=20, ×100+product). Actually: 44×46=(45−1)(45+1)=45²−1=2025−1=2024.' },
    { q: 'What base is most useful for multiplying numbers near 195–205?', options: ['100','150','200','250'], correct: 2 , exp: '200 is the most useful base — numbers in that range have small deficits from 200.' },
  ],
  l3_04: [
    { q: 'Vinculum form of 89 is?', options: ['8(1)','9(1)','9(2)','8(2)'], correct: 1 , exp: '89 = 90−1 = 9(1̄). The overlined 1 (written in brackets here as (1)) means subtract 1 from the units place.' },
    { q: '67 × 3 using vinculum = ?', options: ['201','198','204','191'], correct: 0 , exp: 'Direct: 67×3=201.' },
    { q: 'Vinculum of 96 = ?', options: ['10(4)','9(4)','10(6)','9(6)'], correct: 0 , exp: '96 = 100−4 = 10(4̄). Equivalently 9(−4) in some notations, meaning 100−4=96.' },
    { q: 'Why do we use vinculum?', options: ['Only works for even numbers','Converts large digits to small ones for easier math','Only for division','Replaces addition'], correct: 1 , exp: 'Vinculum replaces large digits (6,7,8,9) with small ones, making mental arithmetic simpler since you only work with digits 1–5.' },
    { q: '78 × 6 = ?', options: ['468','478','458','488'], correct: 0 , exp: '78×6=468.' },
  ],
  l3_05: [
    { q: 'D(34) (Duplex of two-digit 34) = ?', options: ['12','24','7','16'], correct: 1 , exp: 'Duplex D(ab) = 2×a×b = 2×3×4 = 24.' },
    { q: '31² = ?', options: ['961','951','971','941'], correct: 0 , exp: 'D(3)=9, D(31)=6, D(1)=1 → 9|6|1 = 961.' },
    { q: 'D(abc) formula is?', options: ['a²+c²','2ac+b²','2ab+c²','a²+2bc'], correct: 1 , exp: 'For a 3-digit number abc: D = 2ac + b². This is the middle step in squaring.' },
    { q: '42² = ?', options: ['1764','1774','1754','1784'], correct: 0 , exp: 'D(4)=16, D(42)=16, D(2)=4 → 16|16|4 → carry: 1764.' },
    { q: '111² = ?', options: ['12211','12321','12421','12221'], correct: 1 , exp: 'D(1)=1, D(11)=2, D(111)=1+2+1=4... full duplex: 1|2|3|2|1=12321.' },
  ],
  l3_06: [
    { q: '∛32768 = ?', options: ['28','32','36','38'], correct: 1 , exp: 'Groups: 32|768. Last digit 8 → root ends in 2. First digit: 3 (3³=27≤32). Answer: 32.' },
    { q: 'A cube ends in 7. Its cube root ends in?', options: ['7','3','1','9'], correct: 1 , exp: '3³=27 ends in 7 — so a cube ending in 7 always has a cube root ending in 3.' },
    { q: '∛19683 = ?', options: ['23','27','29','33'], correct: 1 , exp: 'Groups: 19|683. Last digit 3 → root ends in 7. First digit: 2 (2³=8≤19). Answer: 27.' },
    { q: '∛68921 = ?', options: ['39','41','43','47'], correct: 1 , exp: 'Groups: 68|921. Last digit 1 → root ends in 1. First digit: 4 (4³=64≤68). Answer: 41.' },
    { q: 'For ∛n, how do we find the first digit?', options: ['Divide n by 9','Remove last 3 digits, find largest cube ≤ result','Find last digit pattern','Multiply by 3'], correct: 1 , exp: 'Remove the last 3 digits to get the left group. Find the largest integer whose cube is ≤ that left group.' },
  ],
  l3_07: [
    { q: '1234 ÷ 9 = ?', options: ['Q:137 R:1','Q:136 R:2','Q:138 R:0','Q:135 R:3'], correct: 0 , exp: 'Running sum: 1; 1+2=3; 3+3=6; 6+4=10→ Q=137 R=1. (Carry the 1: 6+1=7, remainder 4−3×1... standard Vedic straight division gives Q=137 R=1.)' },
    { q: 'In Paravartya for ÷9, the complement used is?', options: ['9','1','0','10'], correct: 1 , exp: 'For dividing by 9, the flag digit is 1 (since 9 = 10−1, complement = 1).' },
    { q: '999 ÷ 9 = ?', options: ['Q:111 R:0','Q:110 R:9','Q:109 R:8','Q:112 R:0'], correct: 0 , exp: '9+9+9=27 → Q=111 R=0. ✓' },
    { q: 'Paravartya sutra means?', options: ['By one more','Transpose and apply','All from 9','Vertically and crosswise'], correct: 1 , exp: '\'Transpose and apply\' — you use the transposed (sign-reversed) digits of the divisor as multipliers in each step.' },
    { q: '2222 ÷ 9 = ?', options: ['Q:246 R:8','Q:247 R:0','Q:246 R:9','Q:248 R:2'], correct: 0 , exp: 'Running: 2; 2+2=4; 4+2=6; 6+2=8→ Q=246 R=8.' },
  ],
  l3_08: [
    { q: '(x+4)(x+5) = ?', options: ['x²+9x+20','x²+8x+20','x²+9x+9','x²+20x+9'], correct: 0 , exp: 'Urdhva pattern: x²|(4+5)x|(4×5) = x²+9x+20.' },
    { q: 'Cross term of (2x+3)(x+2) = ?', options: ['7x','6x','8x','5x'], correct: 0 , exp: 'Cross: 2x×2 + 3×x = 4x+3x = 7x.' },
    { q: '(x+1)(x+1) = ?', options: ['x²+x+1','x²+2x+1','x²+2x+2','2x²+2x+1'], correct: 1 , exp: 'x²|(1+1)x|(1×1) = x²+2x+1.' },
    { q: 'Urdhva-Tiryagbhyam means?', options: ['By one more','Vertically and crosswise','All from 9','Transpose'], correct: 1, exp: 'Vertically and crosswise — the same sutra used for both numeric and algebraic multiplication, describing the pattern of vertical and diagonal products.' },
    { q: '(x+6)(x−2) = ?', options: ['x²+4x−12','x²−4x−12','x²+8x−12','x²+4x+12'], correct: 0 , exp: 'x²|(6+(−2))x|(6×(−2)) = x²+4x−12.' },
  ],
  l3_09: [
    { q: 'For 2x+3y=7, x+2y=4 → x=?', options: ['1','2','3','4'], correct: 1 , exp: 'Cross multiply: x=(7×2−4×3)/(2×2−1×3) = (14−12)/(4−3) = 2.' },
    { q: 'Denominator in cross-multiplication for ax+by=c, dx+ey=f?', options: ['ae+bd','ae−bd','ab−de','ab+de'], correct: 1 , exp: 'Denominator = ae−bd (the determinant of the coefficient matrix).' },
    { q: '3x+y=10, x+y=6 → y=?', options: ['1','2','3','4'], correct: 3 , exp: 'Subtract equations: 2x=4 → x=2. Then y=6−2=4.' },
    { q: 'Which sutra applies to simultaneous equations?', options: ['Nikhilam','Ekadhikena','Paravartya','Yavadunam'], correct: 2 , exp: 'Paravartya Yojayet — \'Transpose and apply\' — is used for the cross-multiplication method in simultaneous equations.' },
    { q: '2x+y=7, x+2y=8 → x+y=?', options: ['4','5','6','7'], correct: 1 , exp: 'Add both equations: 3x+3y=15 → x+y=5.' },
  ],
  l3_10: [
    { q: '67 × 83 using Urdhva-Tiryagbhyam = ?', options: ['5551','5561','5571','5581'], correct: 1 , exp: 'Units: 7×3=21, write 1 carry 2. Cross: 6×3+7×8=74, +2=76, write 6 carry 7. Tens: 6×8=48+7=55. Answer: 5561.' },
    { q: '97 × 94 = ? (Nikhilam base 100)', options: ['9018','9118','9218','9318'], correct: 1 , exp: 'Deficits: 3 and 6. Cross: 97−6=91. Product: 3×6=18. Answer: 9118.' },
    { q: '∛32768 = ?', options: ['28','32','36','38'], correct: 1 , exp: 'Groups: 32|768. Root ends in 2 (cube of 2 ends in 8). First digit: 3. Answer: 32.' },
    { q: 'D(45) duplex = ?', options: ['20','40','16','36'], correct: 1 , exp: 'D(45) = 2×4×5 = 40.' },
    { q: 'Vinculum of 87 = ?', options: ['8(3)','9(3)','9(7)','8(7)'], correct: 1 , exp: '87 = 90−3 = 9(3̄). The digit 3 with vinculum represents subtraction from the next position.' },
    { q: '1357 ÷ 9 = ?', options: ['Q:150 R:7','Q:151 R:8','Q:149 R:6','Q:152 R:9'], correct: 0 , exp: 'Running: 1; 1+3=4; 4+5=9; 9+7=16→ Q=150 R=7. (The running sum hits 9 on the third digit: carry to get Q=150, R=7.)' },
    { q: '(x+3)(x+7) = ?', options: ['x²+10x+21','x²+21x+10','x²+10x+10','x²+4x+21'], correct: 0 , exp: 'x²|(3+7)x|(3×7) = x²+10x+21.' },
    { q: '48² using Duplex = ?', options: ['2294','2304','2314','2324'], correct: 1 , exp: 'D(4)=16, D(48)=2×4×8=64, D(8)=64. Assembled with carries: 2304.' },
    { q: '2x+3y=16, x+2y=10 → x=?', options: ['1','2','3','4'], correct: 1 , exp: 'Cross: x=(16×2−10×3)/(2×2−1×3) = (32−30)/1 = 2.' },
    { q: '196 × 198 using Anurupyena (base 200) = ?', options: ['38798','38808','38818','38828'], correct: 1 , exp: 'Deficits from 200: 4 and 2. Cross: 196−2=194. Product: 4×2=008. Base 200 → cross×200+product = 38800+8? No: 194 is the cross result, then ×(200/100=2 adjustment)... 194×200=38800 + 4×2=8 = 38808.' },
  ],
  l4_01: [
    { q: '12³ = ?', options: ['1628','1728','1828','1928'], correct: 1 , exp: 'Pattern a³|3a²b|3ab²|b³ for a=1,b=2: 1|6|12|8. Assembled with carries: 1728.' },
    { q: '21³ = ?', options: ['9161','9261','9361','9461'], correct: 1 , exp: 'a=2,b=1: 8|12|6|1. Assembled with carries: 9261.' },
    { q: '32³ = ?', options: ['32568','32668','32768','32868'], correct: 2 , exp: 'a=3,b=2: 27|54|36|8. Assembled with carries: 32768.' },
    { q: 'The four-term pattern a³ : 3a²b : 3ab² : b³ used for cubing a two-digit number comes from expanding?', options: ['(a+b)³','(a−b)³','a²+b²','a²−b²'], correct: 0 , exp: 'It is the binomial expansion of (a+b)³ = a³+3a²b+3ab²+b³.' },
    { q: '43³ = ?', options: ['78507','79507','80507','81507'], correct: 1 , exp: 'a=4,b=3: 64|144|108|27. Assembled with carries: 79507.' },
  ],
  l4_02: [
    { q: '123² using Duplex = ?', options: ['14129','15129','16129','17129'], correct: 1 , exp: 'D(1)=1, D(12)=4, D(123)=2×1×3+2²=10, D(23)=12, D(3)=9. Assembled with carries: 15129.' },
    { q: '213² using Duplex = ?', options: ['44369','45369','46369','47369'], correct: 1 , exp: 'D(2)=4, D(21)=4, D(213)=2×2×3+1²=13, D(13)=6, D(3)=9. Assembled with carries: 45369.' },
    { q: 'For a 3-digit number \'abc\', the Duplex D(abc) = ?', options: ['2ac + b²','2ab + c²','a²+b²+c²','2bc + a²'], correct: 0 , exp: 'For a 3-digit number, the Duplex is 2ac + b² (outer pair cross-product doubled, plus the square of the middle digit).' },
    { q: '312² using Duplex = ?', options: ['96344','97344','98344','99344'], correct: 1 , exp: 'D(3)=9, D(31)=6, D(312)=2×3×2+1²=13, D(12)=4, D(2)=4. Assembled with carries: 97344.' },
    { q: 'For a 2-digit number \'ab\', the Duplex D(ab) = ?', options: ['2ab','a²+b²','ab','a²−b²'], correct: 0 , exp: 'For a 2-digit number, the Duplex is simply 2ab (twice the product of the two digits).' },
  ],
  l4_03: [
    { q: 'What is the osculator for testing divisibility by 7?', options: ['+2','−2','+4','−4'], correct: 1 , exp: 'The negative osculator for 7 is −2: multiply the last digit by 2 and subtract it from the remaining number.' },
    { q: 'What is the osculator for testing divisibility by 13?', options: ['+2','+4','−2','−4'], correct: 1 , exp: 'The positive osculator for 13 is +4: multiply the last digit by 4 and add it to the remaining number.' },
    { q: 'What is the osculator for testing divisibility by 19?', options: ['+2','+4','−2','−4'], correct: 0 , exp: 'The positive osculator for 19 is +2: multiply the last digit by 2 and add it to the remaining number.' },
    { q: 'Using the osculator −2 for 7: is 133 divisible by 7?', options: ['Yes','No'], correct: 0 , exp: 'Last digit 3×2=6, remaining 13−6=7, which is divisible by 7. So 133 is divisible by 7 (133=7×19).' },
    { q: 'What is the osculator for testing divisibility by 17?', options: ['+5','−5','+3','−3'], correct: 1 , exp: 'The negative osculator for 17 is −5: multiply the last digit by 5 and subtract it from the remaining number.' },
  ],
  l4_04: [
    { q: 'For a fraction with denominator ending in 9 (like 1/19), the auxiliary fraction method converts the denominator to end in ___ by adding 1.', options: ['0','1','5','9'], correct: 0 , exp: 'Adding 1 to a denominator ending in 9 gives a denominator ending in 0, which is easy to divide by using Ekadhikena Purvena.' },
    { q: '1/19 — first 3 decimal digits using the auxiliary fraction method = ?', options: ['0.051','0.052','0.053','0.054'], correct: 1 , exp: '1/19 ≈ 0.0526..., generated by repeatedly multiplying by the osculator 2 (Ekadhikena Purvena).' },
    { q: 'For a denominator ending in 1 (like 1/21), we get an auxiliary denominator ending in 0 by ___ 1.', options: ['adding','subtracting','multiplying by','dividing by'], correct: 1 , exp: 'Subtracting 1 from a denominator ending in 1 gives a denominator ending in 0.' },
    { q: '1/29 using the auxiliary fraction method: the auxiliary denominator becomes?', options: ['28','29','30','31'], correct: 2 , exp: '29 ends in 9, so add 1 to get an auxiliary denominator of 30.' },
    { q: 'The auxiliary fraction method is primarily useful for denominators close to which type of number?', options: ['Powers of 10','Prime numbers only','Perfect squares','Multiples of 7'], correct: 0 , exp: 'The method works by nudging the denominator to the nearest number ending in 0 (i.e., close to a power of 10), making division by the running-digit method straightforward.' },
  ],
  l4_05: [
    { q: 'Month code for August = ?', options: ['2','3','4','5'], correct: 1 , exp: 'In the standard calendar formula, August has month code 3.' },
    { q: 'Century code for 2000s = ?', options: ['0','2','4','6'], correct: 3 , exp: 'The century correction for years 2000–2099 is +6 in the standard formula.' },
    { q: '15 August 1947 fell on which day?', options: ['Friday','Saturday','Sunday','Monday'], correct: 0 , exp: '15 August 1947 was a Friday — verified directly. India\'s Independence Day.' },
    { q: 'In the day formula, result mod 7 = 0 means?', options: ['Monday','Saturday','Sunday','Friday'], correct: 2 , exp: 'Result 0 = Sunday in the standard Doomsday mapping for this formula.' },
    { q: 'Month code for January = ?', options: ['0','1','2','4'], correct: 1 , exp: 'January has month code 1 in the standard Vedic calendar formula.' },
  ],
  l4_06: [
    { q: '√2 ≈ ?', options: ['1.212','1.314','1.414','1.514'], correct: 2 , exp: '√2 ≈ 1.414 — memorise as \'1.41421...\' or \'root 2 is roughly 1.4\'.' },
    { q: 'First step in Vedic square root method?', options: ['Divide by 2','Group digits in pairs from decimal point','Find last digit','Multiply by 10'], correct: 1 , exp: 'Pair the digits starting from the decimal point — left for the integer part, right for decimal places.' },
    { q: '√3 ≈ ?', options: ['1.632','1.712','1.732','1.832'], correct: 2 , exp: '√3 ≈ 1.732 — memorise as \'1.732\' (a useful approximation for triangles and hexagons).' },
    { q: 'Trial divisor after finding first digit d is?', options: ['d','d²','2d','3d'], correct: 2 , exp: 'After finding the first digit d, the trial divisor for the next step is 2d (the doubled current root).' },
    { q: '√10 ≈ ?', options: ['3.062','3.162','3.262','3.362'], correct: 1 , exp: '√10 ≈ 3.162 — since 3²=9 and 4²=16, √10 is just above 3.' },
  ],
  l4_07: [
    { q: 'Factors of x²+8x+15 = ?', options: ['(x+3)(x+5)','(x+4)(x+4)','(x+6)(x+2)','(x+1)(x+15)'], correct: 0 , exp: 'Find two numbers that add to 8 and multiply to 15: 3 and 5. Factors: (x+3)(x+5).' },
    { q: 'For x²+bx+c, if factors are (x+p)(x+q), then b = ?', options: ['p×q','p+q','p−q','p²+q²'], correct: 1 , exp: 'Expanding (x+p)(x+q) = x²+(p+q)x+pq, so b = p+q (sum of the two factor constants).' },
    { q: 'Factors of x²−9 = ?', options: ['(x+3)(x+3)','(x−3)(x−3)','(x+3)(x−3)','(x+9)(x−1)'], correct: 2 , exp: 'Difference of squares: x²−9 = x²−3² = (x+3)(x−3).' },
    { q: 'Sutra "Adyamadyena" means?', options: ['All from 9','First by first, last by last','By one more','Vertically and crosswise'], correct: 1 , exp: 'Adyamadyena means First by first, last by last - the leading coefficient times the leading term, and the last term times the last term.' },
    { q: 'Factors of 2x²+3x+1 = ?', options: ['(2x+1)(x+1)','(x+1)(x+2)','(2x−1)(x+1)','(2x+2)(x+1)'], correct: 0 , exp: 'Test (2x+1)(x+1): 2x²+2x+x+1=2x²+3x+1 ✓' },
  ],
  l4_08: [
    { q: '67 × 83 using Urdhva-Tiryagbhyam = ?', options: ['5551','5561','5571','5581'], correct: 1 , exp: 'Units: 7x3=21 write 1 carry 2. Cross: 6x3+7x8=74+2=76 write 6 carry 7. Tens: 6x8+7=55. Answer: 5561.' },
    { q: '23³ = ?', options: ['12067','12167','12267','12367'], correct: 1 , exp: 'a=2, b=3. Pattern: 8|12×2×3=36... a³|3a²b|3ab²|b³ = 8|36|54|27 → carry: 12167.' },
    { q: '∛54872 = ?', options: ['36','37','38','39'], correct: 2 , exp: 'Groups: 54|872. Last digit 2 → root ends in 8. First digit: 3 (3³=27≤54). Answer: 38.' },
    { q: '√7 ≈ ?', options: ['2.436','2.546','2.646','2.746'], correct: 2 , exp: '√7 ≈ 2.646 — since 2²=4 and 3²=9, √7 is between 2 and 3, closer to 3.' },
    { q: 'Factors of 2x²+7x+6 = ?', options: ['(2x+3)(x+2)','(2x+2)(x+3)','(x+2)(2x+1)','(2x+6)(x+1)'], correct: 0 , exp: 'Test (2x+3)(x+2): 2x²+4x+3x+6=2x²+7x+6 ✓' },
    { q: '15 August 1947 = ?', options: ['Friday','Saturday','Sunday','Monday'], correct: 0 , exp: '15 August 1947 was a Friday - India s Independence Day, verified directly.' },
    { q: '1/19 first 4 decimal digits = ?', options: ['0.0512','0.0526','0.0536','0.0516'], correct: 1 , exp: '1/19 ≈ 0.0526... The Ekadhikena Purvena sutra generates the full recurring decimal of 1/19 starting from 1, multiplying by 2 each step.' },
    { q: '321² = ?', options: ['102041','103041','104041','105041'], correct: 1 , exp: 'Duplex method: D(3)=9, D(32)=12, D(321)=9+4=13, D(21)=4, D(1)=1. Assembled: 9|12|13|4|1 → with carries: 103041.' },
    { q: 'Is 572 divisible by 11?', options: ['Yes','No'], correct: 0 , exp: 'Rule: alternating digit sum: 5−7+2=0. Since 0 is divisible by 11, yes — 572÷11=52 ✓' },
    { q: '97 × 96 using Nikhilam = ?', options: ['9212','9312','9412','9512'], correct: 1 , exp: 'Deficits: 3 and 4. Cross: 97−4=93. Product: 3×4=12. Answer: 9312.' },
  ],
  l2_13: [
    { q: '1/3 + 1/4 using the Vedic method = ?', options: ['5/12','7/12','1/7','7/7'], correct: 1 , exp: 'Cross-multiply: 1x4+3x1=7 numerator, 3x4=12 denominator. Answer: 7/12.' },
    { q: 'Paravartya division works best for divisors?', options: ['2–9','11–19','50–99','100+'], correct: 1 , exp: 'Paravartya works best for divisors 11-19, just above the base of 10.' },
    { q: 'For ∛x, you split x into groups of ___ digits from the right', options: ['1','2','3','4'], correct: 2 , exp: 'Groups of 3 digits from the right - each group gives one digit of the cube root.' },
    { q: 'Multiplying by 125 using Anurupyena: divide by ___, then append 000', options: ['4','5','8','10'], correct: 2, exp: '125 = 1000 / 8. So multiplying by 125 means dividing by 8 and then appending 000 (multiplying by 1000).' },
    { q: 'Verify 47 × 32 = 1504 using digit sums', options: ['Correct ✓','Wrong ✗'], correct: 0, exp: 'DS(47)=2, DS(32)=5. 2×5=10→DS=1. DS(1504)=10→1. Both sides give 1 ✓. And 47×32=1504 directly confirms it.' },
  ],
  l1_10: [
    { q: { en: 'Calculate 98 × 97 using Nikhilam (base 100)', hi: 'निखिलम् (आधार 100) से 98 × 97 निकालें' }, options: ['9406','9506','9606','9706'], correct: 1, exp: 'Deficits: 2 and 3. Cross: 98-3=95. Product: 2×3=06. Answer: 9506.' },
    { q: { en: 'Which sutra means "By one more than the previous one"?', hi: 'कौन सा सूत्र "पिछले से एक अधिक" का अर्थ रखता है?' }, options: ['Nikhilam','Ekadhikena Purvena','Urdhva-Tiryagbhyam','Anurupyena'], correct: 1, exp: 'Ekadhikena Purvena literally means By one more than the previous one - it generates recurring decimals and squares numbers ending in 5.' },
    { q: { en: 'What is 85²?', hi: '85² क्या है?' }, options: ['7025','7125','7225','7325'], correct: 2, exp: '8 × 9 = 72, append 25 → 7225.' },
    { q: { en: 'Calculate 8 × 9 using Nikhilam', hi: 'निखिलम् से 8 × 9 निकालें' }, options: ['70','72','74','76'], correct: 1, exp: 'Deficits from 10: 8→2, 9→1. Cross: 8-1=7. Product: 2×1=2. Answer: 72.' },
    { q: { en: 'Calculate 67 × 11 using the Vedic method', hi: 'वैदिक विधि से 67 × 11 निकालें' }, options: ['727','737','747','717'], correct: 1, exp: 'Rule: A|(A+B)|B. For 67: 6|(6+7)|7 = 6|13|7 → carry the 1: 737.' },
  ],
};

function getQuestions(lessonId) {
  return LESSON_QUESTIONS[lessonId] || Array.from({ length: 5 }, (_, i) => ({
    q: `Quiz Question ${i + 1}: Apply a Vedic technique to solve this problem`,
    options: ['Option A', 'Option B — Correct Answer', 'Option C', 'Option D'],
    correct: 1,
  }));
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({ label, idx, selected, correct, revealed, onClick }) {
  let bg = 'white';
  let border = '1.5px solid rgba(30,64,175,0.15)';
  let textColor = '#0A1628';
  let icon = null;

  if (revealed) {
    if (idx === correct) { bg = '#D1FAE5'; border = '1.5px solid #10B981'; icon = '✅'; }
    else if (idx === selected) { bg = '#FEE2E2'; border = '1.5px solid #EF4444'; icon = '❌'; textColor = '#4B5563'; }
    else { textColor = '#9CA3AF'; }
  }

  return (
    <button
      onClick={() => !revealed && onClick(idx)}
      style={{
        width: '100%', minHeight: 48, padding: '12px 16px',
        border, borderRadius: 10, background: bg, color: textColor,
        fontFamily: 'var(--font-body)', fontSize: 15,
        textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
        transition: 'all 0.15s', marginBottom: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}
    >
      <span>
        <span style={{ fontWeight: 700, marginRight: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: revealed ? textColor : '#9CA3AF' }}>
          {String.fromCharCode(65 + idx)}.
        </span>
        {label}
      </span>
      {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
    </button>
  );
}

// ─── Master Celebration ───────────────────────────────────────────────────────

function MasterCelebration({ totalXP, badgeCount, xpEarned, correct, total, shareText, onComplete, fireConfetti, glass }) {
  const { t } = useLanguage();
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center' }}
    >
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628, #7C3AED)',
        borderRadius: 20, padding: '40px 28px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>👑</div>
        <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>
          You are a VedicMind Master!
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
          You have completed all 40 lessons of Ancient Vedic Mathematics 🎉
        </p>

        {/* Score */}
        <div style={{ display: 'inline-flex', gap: 24, background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: '16px 28px', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#FCD34D' }}>{correct}/{total}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Final Score</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#34D399' }}>+{xpEarned}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('xpEarned')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#93C5FD' }}>{totalXP}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('totalXP')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#FCA5A5' }}>{badgeCount}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Badges</div>
          </div>
        </div>

        {/* Master badge */}
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '8px 20px', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', fontWeight: 600 }}>🏆 Master Badge Unlocked!</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', minHeight: 48, background: '#25D366', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer', textDecoration: 'none',
              lineHeight: '48px', textAlign: 'center',
            }}
          >
            📲 Share Your Achievement →
          </a>
          <button
            onClick={onComplete}
            style={{
              minHeight: 48, background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12,
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            View Dashboard →
          </button>
        </div>
      </div>

      {/* Replay confetti */}
      <button
        onClick={fireConfetti}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563',
        }}
      >
        🎉 Celebrate again!
      </button>
    </motion.div>
  );
}

import { pickQuizQuestions } from '@/lib/quizQuestionPicker';

// Picks (or restores) a capped, rotating subset of questions for this lesson.
// QuizTab unmounts every time the Concept/Practice/Quiz tab switches, so a
// plain useState lazy-initializer alone isn't enough to survive that -- the
// SPECIFIC subset chosen has to persist in localStorage (like quizInProgress
// already does for current/selectedAnswers) so navigating away mid-quiz and
// back doesn't silently swap in a different random set of questions out from
// under the student's in-progress answers.
function loadOrPickLessonQuestions(lessonId, fullPool) {
  try {
    const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    const saved = p.quizQuestionSet?.[lessonId];
    if (Array.isArray(saved) && saved.length > 0 && saved.every((i) => i < fullPool.length)) {
      return saved.map((i) => fullPool[i]);
    }
  } catch { /* fall through to picking a new set */ }
  return pickNewLessonQuestions(lessonId, fullPool);
}

function pickNewLessonQuestions(lessonId, fullPool) {
  const { questions, indices } = pickQuizQuestions(fullPool);
  try {
    const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
    if (!p.quizQuestionSet) p.quizQuestionSet = {};
    p.quizQuestionSet[lessonId] = indices;
    localStorage.setItem('vedicmind_progress', JSON.stringify(p));
  } catch { /* silent -- worst case, a fresh random set gets picked again next mount */ }
  return questions;
}

// ─── Main QuizTab ─────────────────────────────────────────────────────────────

export default function QuizTab({lesson, glass, onComplete, onNextLesson, allLessonIds }) {
  const { t, language } = useLanguage();
  const { user } = useVedicAuth();
  const fullPool = getQuestions(lesson.id);
  // Lazy initializer -- runs once per mount, not on every render, matching
  // the same discipline Reasoning's question loading already follows (a
  // per-render reshuffle there previously caused questions to silently
  // change mid-quiz, reported by testers).
  const [questions, setQuestions] = useState(() => loadOrPickLessonQuestions(lesson.id, fullPool));

  // If this lesson was already completed, restore that state on mount instead
  // of always starting blank at Question 1. The score was already being saved
  // to lessonScores — it just was never read back, so returning to a done
  // lesson looked identical to never having attempted it (Mr. Ray's report).
  const priorScore = (() => {
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      return typeof p.lessonScores?.[lesson.id] === 'number' ? p.lessonScores[lesson.id] : null;
    } catch { return null; }
  })();
  const priorAnswers = priorScore != null
    ? Array.from({ length: questions.length }, (_, i) => i < Math.round((priorScore / 100) * questions.length))
    : [];

  // Restore an unfinished attempt (mid-quiz, not yet scored). QuizTab is
  // unmounted every time the Concept/Practice/Quiz tab switches (LessonViewer
  // only renders the active tab), which was wiping current/selectedAnswers
  // even though the quiz was never completed — reported by Mr. Ray as
  // "leaving Quiz half-done, coming back, quiz not saved". Only used when
  // there's no completed score for this lesson (that case is handled above).
  const inProgress = (() => {
    if (priorScore != null) return null;
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      const saved = p.quizInProgress?.[lesson.id];
      if (saved && Array.isArray(saved.selectedAnswers) && saved.selectedAnswers.length === questions.length) {
        return saved;
      }
      return null;
    } catch { return null; }
  })();

  const [current, setCurrent] = useState(inProgress?.current ?? 0);
  // Selected option index per question (null = unanswered yet). Replaces the
  // old single 'selected'/'revealed' state that only tracked the CURRENT
  // question — that made it impossible to go back and see a previous
  // question's answer, since leaving it wiped that state. Now each question
  // keeps its own answer, so navigating back just reads a different slot.
  const [selectedAnswers, setSelectedAnswers] = useState(
    inProgress?.selectedAnswers ?? Array(questions.length).fill(null)
  );
  const [done, setDone] = useState(priorScore != null);
  const [isReviewOfPastAttempt] = useState(priorScore != null);

  // Award Knowledge Points once, only on a genuinely fresh completion — never
  // when revisiting an already-done lesson (isReviewOfPastAttempt), and only
  // once per completion even if this component re-renders.
  const pointsAwardedRef = React.useRef(false);
  useEffect(() => {
    if (!done || isReviewOfPastAttempt || pointsAwardedRef.current || !user?.id) return;
    pointsAwardedRef.current = true;
    (async () => {
      const correctCount = answers.filter(Boolean).length;
      const wrongCount = questions.length - correctCount;
      if (correctCount > 0) await awardPoints(user.id, correctCount * POINTS.QUESTION_CORRECT, 'lesson_quiz', lesson.id);
      if (wrongCount > 0) await awardPoints(user.id, wrongCount * POINTS.QUESTION_WRONG, 'lesson_quiz', lesson.id);
      await awardPoints(user.id, POINTS.LESSON_COMPLETE, 'lesson_completion', lesson.id);
      recalculateMonthlyStatus(user.id);
    })();
  }, [done, isReviewOfPastAttempt, user?.id]);

  // Persist in-progress (unfinished, unscored) attempts so switching to
  // another tab and back restores exactly where the student left off.
  useEffect(() => {
    if (done) return; // once scored, the completed-lesson path above takes over
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      if (!p.quizInProgress) p.quizInProgress = {};
      p.quizInProgress[lesson.id] = { current, selectedAnswers };
      localStorage.setItem('vedicmind_progress', JSON.stringify(p));
    } catch { /* silent */ }
  }, [current, selectedAnswers, done, lesson.id]);

  // Clear the in-progress record once the quiz is completed and scored —
  // the completed score (lessonScores) takes over as the source of truth.
  useEffect(() => {
    if (!done) return;
    try {
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      if (p.quizInProgress?.[lesson.id]) {
        delete p.quizInProgress[lesson.id];
        localStorage.setItem('vedicmind_progress', JSON.stringify(p));
      }
    } catch { /* silent */ }
  }, [done, lesson.id]);

  const q = questions[current];
  const selected = selectedAnswers[current];
  const revealed = selected !== null;
  const answers = priorScore != null && selectedAnswers.every((a) => a === null)
    ? priorAnswers // still showing the restored past-attempt summary, nothing answered fresh yet
    : selectedAnswers.map((sel, i) => sel !== null && sel === questions[i]?.correct);

  const handleSelect = (idx) => {
    if (selectedAnswers[current] !== null) return; // already answered — view only, no changing after the fact
    const next = [...selectedAnswers];
    next[current] = idx;
    setSelectedAnswers(next);
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const correct = answers.filter(Boolean).length;
    const pct = Math.round((correct / questions.length) * 100);
    const xpEarned = Math.round((correct / questions.length) * 100) + 20;
    const isFinalMaster = lesson.id === 'l4_08' && pct >= 60;

    // Master completion celebration screen
    if (isFinalMaster) {
      // Award master badge & fire confetti
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      if (!Array.isArray(p.badges)) p.badges = [];
      if (!p.badges.includes('master_complete')) {
        p.badges = [...p.badges, 'master_complete'];
        localStorage.setItem('vedicmind_progress', JSON.stringify(p));
      }

      const totalXP = p.totalXP || 0;
      const badgeCount = p.badges.length;

      const fireConfetti = () => {
        const burst = (x, angle) => confetti({ particleCount: 80, spread: 70, origin: { x, y: 0.6 }, angle });
        burst(0.25, 120); burst(0.75, 60);
        setTimeout(() => { burst(0.1, 90); burst(0.9, 90); }, 400);
        setTimeout(() => { burst(0.5, 90); }, 800);
        setTimeout(() => { burst(0.3, 110); burst(0.7, 70); }, 1200);
        setTimeout(() => { burst(0.5, 90); }, 1800);
      };

      const shareText = encodeURIComponent('I just completed all 40 Vedic Maths lessons on VedicMind and became a Master! 🧮🏆\nTry it free at vedicmindai.in');

      return (
        <MasterCelebration
          totalXP={totalXP}
          badgeCount={badgeCount}
          xpEarned={xpEarned}
          correct={correct}
          total={questions.length}
          shareText={shareText}
          onComplete={() => onComplete(pct, xpEarned)}
          fireConfetti={fireConfetti}
          glass={glass}
        />
      );
    }

    const feedbackColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';
    const feedbackText = pct >= 80
      ? (language === 'hi' ? 'शानदार! आपने यह पाठ पूरी तरह समझ लिया है। 🌟' : 'Excellent work! You\'ve mastered this lesson. 🌟')
      : pct >= 60
        ? (language === 'hi' ? 'अच्छा! अगला पाठ अनलॉक हो गया है। और अभ्यास करते रहें।' : 'Good job! Next lesson unlocked. Keep practising to strengthen this technique.')
        : (language === 'hi'
            ? `अभी अगला पाठ लॉक है। अगला पाठ खोलने के लिए इस क्विज़ में 60% या उससे अधिक अंक प्राप्त करना आवश्यक है।`
            : `Next lesson is still locked. You need 60% or above on this quiz to unlock it — you scored ${pct}%. Review the Concept tab and try again.`);

    const allIds = allLessonIds || [];
    const nextId = allIds[allIds.indexOf(lesson.id) + 1];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#F0F4FF', borderLeft: '3px solid #10B981',
          borderRadius: 16, padding: 24,
        }}>
        <style>{`@media(max-width:360px){.quiz-btn-row{flex-direction:column!important;}}`}</style>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{isReviewOfPastAttempt ? '✅' : '🎉'}</div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {isReviewOfPastAttempt ? (language === 'hi' ? 'आपने यह पाठ पहले ही पूरा किया है' : 'You already completed this lesson') : t('lessonComplete')}
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
          {correct}/{questions.length} correct · {pct}%
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#10B981', marginBottom: 8 }}>
          {isReviewOfPastAttempt
            ? (language === 'hi' ? `पहले ${xpEarned} XP अर्जित किया गया था` : `${xpEarned} XP was earned on your first attempt`)
            : `+${xpEarned} XP earned`}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: feedbackColor, marginBottom: 20 }}>
          {feedbackText}
        </div>
        <div className="quiz-btn-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {pct >= 60 && nextId ? (
            <button
              onClick={() => onNextLesson && onNextLesson(lesson.id, xpEarned, pct)}
              style={{ flex: 1, minWidth: 120, minHeight: 44, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Next Lesson →
            </button>
          ) : pct >= 60 ? (
            <button
              onClick={() => onComplete(pct, xpEarned)}
              style={{ flex: 1, minWidth: 120, minHeight: 44, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Complete Lesson →
            </button>
          ) : null}
          <button
            onClick={() => {
              const fresh = pickNewLessonQuestions(lesson.id, fullPool);
              setQuestions(fresh);
              setCurrent(0);
              setSelectedAnswers(Array(fresh.length).fill(null));
              setDone(false);
            }}
            style={{ flex: 1, minWidth: 120, minHeight: 44, background: 'transparent', color: '#0A1628', border: '1.5px solid #0A1628', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Retake Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ ...glass, padding: 24 }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>
            Q{current + 1} of {questions.length}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {questions.map((_, i) => (
              <div
                key={i}
                onClick={() => { if (i <= current || selectedAnswers[i] !== null) setCurrent(i); }}
                style={{
                  width: 28, height: 4, borderRadius: 100,
                  background: i < current ? '#10B981' : i === current ? '#3B82F6' : 'rgba(30,64,175,0.12)',
                  cursor: (i <= current || selectedAnswers[i] !== null) ? 'pointer' : 'default',
                }}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: '#0A1628', marginBottom: 20, lineHeight: 1.5 }}>
          {tr(q.q, language)}
        </div>

        {/* Options */}
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={opt}
            idx={i}
            selected={selected}
            correct={q.correct}
            revealed={revealed}
            onClick={handleSelect}
          />
        ))}

        {/* Explanation — shown immediately on reveal, same pattern already proven
            in Daily Quiz and Practice, just never built into Lesson Quiz until now */}
        {revealed && (q.exp || (q.q && q.q.exp)) && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14 }}>
            <div style={{
              background: selected === q.correct ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${selected === q.correct ? '#BBF7D0' : '#FECACA'}`,
              borderRadius: 12, padding: '14px 16px',
              fontFamily: 'var(--font-body)', fontSize: 14, color: '#374151', lineHeight: 1.65,
            }}>
              {selected !== q.correct && (
                <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#B91C1C' }}>
                  {language === 'hi' ? `सही उत्तर: ${q.options[q.correct]}` : `Correct answer: ${q.options[q.correct]}`}
                </p>
              )}
              {(() => {
                const rawExp = q.exp || (q.q && q.q.exp) || '';
                const translated = tr(rawExp, language);
                if (translated.includes('\n')) {
                  const steps = translated.split('\n').filter(Boolean);
                  return (
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: 600 }}>💡 {language === 'hi' ? 'समाधान:' : 'How to solve it:'}</p>
                      <ol style={{ margin: 0, paddingLeft: 18 }}>
                        {steps.map((line, i) => {
                          const m = line.match(/^(Step \d+:)\s*(.*)$/);
                          return (
                            <li key={i} style={{ marginBottom: 2 }}>
                              {m ? <><strong>{m[1]}</strong> {m[2]}</> : line}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  );
                }
                return <p style={{ margin: 0 }}>💡 {translated}</p>;
              })()}
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6B7280' }}>
                {language === 'hi'
                  ? '📘 अभी भी समझ नहीं आया? ऊपर "सिद्धांत" टैब देखें।'
                  : '📘 Still stuck? Revisit the Concept tab above for the full method.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Previous / Next buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {current > 0 && (
            <button onClick={handlePrevious} style={{
              minHeight: 44, padding: '0 20px', background: 'transparent', color: '#0A1628',
              border: '1.5px solid #0A1628', borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              ← {language === 'hi' ? 'पिछला प्रश्न' : 'Previous Question'}
            </button>
          )}
          {revealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={handleNext} style={{
                minHeight: 44, padding: '0 24px', background: '#0A1628', color: 'white',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
                {current < questions.length - 1 ? 'Next Question →' : 'See Results →'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}