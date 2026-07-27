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
    { q: 'Paravartya Yojayet means?', options: ['Vertically and crosswise','Transpose and apply','All from 9','Mere observation'], correct: 1 , exp: '\'Transpose and apply\' — for division, you transpose the sign of the divisor\'s non-leading digits and apply them as multipliers.' },
    { q: 'For divisor 13, the transposed flag digit is?', options: ['+3','−3','+1','−1'], correct: 1 , exp: '13 has leading digit 1. The remaining digit is 3, transposed to −3. This flag digit is used in each step of the division.' },
    { q: 'Divide 121 ÷ 11', options: ['9','10','11','12'], correct: 2 , exp: '11 = 1|1. Flag = −1. Running: 1; 1×(−1)+2=1; 1×(−1)+1=0. Quotient: 11, Remainder: 0. ✓' },
    { q: 'Divide 156 ÷ 13', options: ['10','11','12','13'], correct: 2 , exp: '13 = 1|3. Flag = −3. Running: 1; 1×(−3)+5=2; 2×(−3)+6=0. Quotient: 12, Remainder: 0. ✓' },
    { q: 'Paravartya division works fastest for divisors in which range?', options: ['1–10','11–19','20–50','51–99'], correct: 1 , exp: 'Paravartya is designed specifically for divisors just above a power of 10, like 11–19 (just above 10) and 101–109 (just above 100).' },
  ],
  l2_02: [
    { q: 'How many steps does 3-digit × 3-digit Urdhva multiplication have?', options: ['3','4','5','6'], correct: 2 , exp: 'A 3-digit × 3-digit product has 5 steps: units, two-digit cross, three-way middle, two-digit cross (left side), and tens.' },
    { q: 'Calculate 112 × 111', options: ['12332','12432','12532','12232'], correct: 1 , exp: 'Full 5-step Urdhva: 2|2+1|1+2+1|1+1|1 = 2|3|4|2|1 = 12432.' },
    { q: 'Calculate 111 × 111', options: ['11221','12321','13321','11321'], correct: 1 , exp: '5-step Urdhva: 1|2|3|2|1 = 12321.' },
    { q: 'In the 5-step method, step 3 (hundreds) involves multiplying?', options: ['A×F only','A×F + B×E + C×D','B×E only','A×D + B×C'], correct: 1 , exp: 'The middle step involves all three cross products: A×F + B×E + C×D (where ABC and DEF are the two numbers).' },
    { q: 'Calculate 100 × 100 (trivial check)', options: ['1000','10000','100000','100'], correct: 1 , exp: '100 × 100 = 10000 — a trivial check confirming the method works at boundaries.' },
  ],
  l2_03: [
    { q: 'To square numbers near 50, the formula is?', options: ['(25 + d) | d²','(50 + d) | d²','(25 × d) | d²','(d + 25) | 2d'], correct: 0 , exp: 'For n = 50 + d: answer = (25+d) | d². The left part is 25+d, the right part is d² (2 digits).' },
    { q: 'Calculate 47²', options: ['2109','2209','2309','2009'], correct: 1 , exp: 'd = −3. Left: 25+(−3)=22. Right: (−3)²=09. Answer: 2209.' },
    { q: 'Calculate 53²', options: ['2709','2809','2909','2609'], correct: 1 , exp: 'd = +3. Left: 25+3=28. Right: 3²=09. Answer: 2809.' },
    { q: 'For the duplex method, (AB)² equals?', options: ['A²|2AB|B²','A|2AB|B','A²|AB|B²','2A|AB|2B'], correct: 0 , exp: 'A²|2AB|B² — vertical square of first digit, twice the cross product, vertical square of second digit.' },
    { q: 'Calculate 51²', options: ['2501','2601','2701','2401'], correct: 1 , exp: 'd = +1. Left: 25+1=26. Right: 1²=01. Answer: 2601.' },
  ],
  l2_04: [
    { q: 'The cubing pattern using Anurupyena is?', options: ['a²|a|b|b²','a³|3a²b|3ab²|b³','a|b|a|b','3a|3b|a|b'], correct: 1 , exp: 'For (a+b)³: the pattern is a³ | 3a²b | 3ab² | b³. Each term is 3× the previous ratio.' },
    { q: 'Calculate 11³', options: ['1231','1331','1431','1531'], correct: 1 , exp: 'a=1, b=1. Pattern: 1|3|3|1 = 1331.' },
    { q: 'Calculate 12³', options: ['1528','1628','1728','1828'], correct: 2 , exp: 'a=1, b=2. Pattern: 1|6|12|8. Carry: 1|7|2|8 = 1728.' },
    { q: 'For 23³, the values are a=?, b=?', options: ['a=2, b=3','a=3, b=2','a=23, b=0','a=0, b=23'], correct: 0 , exp: 'Split the two digits: a=2 (tens), b=3 (units).' },
    { q: 'Calculate 10³', options: ['100','1000','10000','100'], correct: 1 , exp: '10³ = 1000.' },
  ],
  l2_05: [
    { q: 'To find the square root of a 4-digit number, you split it into pairs of how many digits?', options: ['1','2','3','4'], correct: 1 , exp: 'Split into pairs of 2 from the right: a 4-digit number gives 2 pairs, meaning the square root has 2 digits.' },
    { q: 'What is √1764?', options: ['41','42','43','44'], correct: 1 , exp: 'Pairs: 17|64. First digit: largest n where n²≤17 → 4 (4²=16). Last digit: 1764 ends in 4, so root ends in 2 (2²=4) or 8 (8²=64). Check: 42²=1764 ✓' },
    { q: 'A perfect square ending in 1 has a square root ending in?', options: ['1 only','1 or 9','1 or 3','3 or 7'], correct: 1 , exp: 'Only 1²=1 and 9²=81 end in 1 — so a perfect square ending in 1 has a root ending in 1 or 9.' },
    { q: 'What is √5625?', options: ['73','74','75','76'], correct: 2 , exp: 'Pairs: 56|25. First digit: 7 (7²=49≤56). Last digit: ends in 5 → root ends in 5. Check: 75²=5625 ✓' },
    { q: 'What is √9801?', options: ['97','98','99','96'], correct: 2 , exp: 'Pairs: 98|01. First digit: 9 (9²=81≤98). Last digit: ends in 1 → root ends in 1 or 9. Check: 99²=9801 ✓' },
  ],
  l2_06: [
    { q: 'For cube roots, you split the number into groups of ___ digits from the right', options: ['1','2','3','4'], correct: 2 , exp: 'Group into 3 digits from the right. The number of groups tells you how many digits the cube root has.' },
    { q: 'What is ∛17576?', options: ['24','25','26','27'], correct: 2 , exp: 'Groups: 17|576. Last digit of 576 is 6 → cube root ends in 6 (6³=216). First digit: 2 (2³=8≤17). Answer: 26.' },
    { q: 'A number ending in 8 has a cube root ending in?', options: ['2','4','6','8'], correct: 0 , exp: '2³=8 — the only cube ending in 8. So a perfect cube ending in 8 always has a cube root ending in 2.' },
    { q: 'What is ∛19683?', options: ['25','26','27','28'], correct: 2 , exp: 'Groups: 19|683. Last digit 3 → root ends in 7 (7³=343). First digit: 2 (2³=8≤19). Answer: 27.' },
    { q: 'Unlike square roots, cube root last digits are always?', options: ['Ambiguous','Unique','Even','Odd'], correct: 1 , exp: 'Every digit 0–9 maps to a unique cube last digit — the mapping is one-to-one. Unlike square roots (where 2 and 8 both give last digit 4), cube roots are always unique.' },
  ],
  l2_07: [
    { q: 'Gunita Samuchyah is used for?', options: ['Multiplication','Division','Verification of calculations','Squaring numbers'], correct: 2 , exp: 'Gunita Samuchyah provides a quick verification check using digit sums — if DS(a) × DS(b) ≠ DS(c), the calculation is definitely wrong.' },
    { q: 'Verify 236 × 47 = 11092. Is it correct?', options: ['Yes ✓','No ✗'], correct: 0 , exp: 'DS(236)=2, DS(47)=2, DS(11092)=4. DS(2)×DS(2)=4 ✓' },
    { q: 'Verify 158 × 43 = 6784. Is it correct?', options: ['Yes ✓','No ✗'], correct: 1 , exp: 'DS(158)=5, DS(43)=7, DS(6784)=7. DS(5)×DS(7)=35→8. But DS(6784)=7≠8 ✗. The real answer is 158×43=6794.' },
    { q: 'The digit sum of 999 is?', options: ['0','9','18','27'], correct: 0 , exp: '9+9+9=27, 2+7=9. By Vedic convention, 9 reduces to 0.' },
    { q: 'Verify 35 × 22 = 760 using digit sums', options: ['Correct ✓','Wrong ✗'], correct: 1 , exp: 'DS(35)=8, DS(22)=4, DS(760)=4. DS(8)×DS(4)=32→5≠4 ✗. The real answer is 35×22=770, not 760.' },
  ],
  l2_08: [
    { q: 'Calculate 84 × 5 using Anurupyena', options: ['400','420','440','460'], correct: 1 , exp: 'Multiply by 5 = divide by 2 then ×10. 84÷2=42, ×10=420.' },
    { q: 'Calculate 68 × 25', options: ['1600','1700','1800','1900'], correct: 1 , exp: 'Multiply by 25 = divide by 4 then ×100. 68÷4=17, ×100=1700.' },
    { q: 'Calculate 96 × 125', options: ['10000','11000','12000','13000'], correct: 2 , exp: 'Multiply by 125 = divide by 8 then ×1000. 96÷8=12, ×1000=12000.' },
    { q: 'Multiplying by 25 is the same as dividing by 4 then multiplying by?', options: ['10','100','1000','25'], correct: 1 , exp: '25 = 100÷4, so ×25 = ÷4 then ×100.' },
    { q: 'Calculate 48 × 125', options: ['5000','6000','7000','8000'], correct: 1 , exp: '48÷8=6, ×1000=6000.' },
  ],
  l2_09: [
    { q: 'Paravartya division: for divisor 17, the flag digit is?', options: ['+7','−7','+1','−1'], correct: 1 , exp: '17 = 1|7. Transpose the 7 to −7. This −7 flag is used in each division step.' },
    { q: 'Calculate 247 ÷ 13', options: ['17','18','19','20'], correct: 2 , exp: '13 → flag −3. Steps: 2; 2×(−3)+4=−2... actually: Q=19. Verify: 19×13=247 ✓' },
    { q: 'Calculate 256 ÷ 16', options: ['14','15','16','17'], correct: 2 , exp: '16 → flag −6. Verify: 16×16=256 ✓' },
    { q: 'Calculate 391 ÷ 17', options: ['21','22','23','24'], correct: 2 , exp: '17 → flag −7. Verify: 23×17=391 ✓' },
    { q: 'Paravartya division is fastest for divisors in which range?', options: ['2–9','11–19','20–50','100+'], correct: 1 , exp: 'Paravartya excels for divisors just above a power of 10: 11–19, 101–109, 1001–1009 etc.' },
  ],
  l2_10: [
    { q: 'The Vedic formula for a/b + c/d gives numerator as?', options: ['a+c','a×d + b×c','a×c + b×d','b×d'], correct: 1 , exp: 'Cross-multiply: a×d + b×c for the numerator, b×d for the denominator.' },
    { q: 'Calculate 1/3 + 1/4', options: ['5/12','7/12','9/12','11/12'], correct: 1 , exp: 'Numerator: 1×4+3×1=7. Denominator: 3×4=12. Answer: 7/12.' },
    { q: 'Calculate 2/5 + 3/7', options: ['27/35','29/35','31/35','25/35'], correct: 1 , exp: 'Numerator: 2×7+5×3=29. Denominator: 5×7=35. Answer: 29/35.' },
    { q: 'Calculate 3/4 − 1/6', options: ['5/12','7/12','9/12','3/12'], correct: 1 , exp: 'Numerator: 3×6−4×1=14. Denominator: 4×6=24. Simplify: 7/12.' },
    { q: 'The denominator in the cross-multiply formula is?', options: ['a+c','b+d','a×c','b×d'], correct: 3 , exp: 'The denominator is always b×d — the product of both original denominators.' },
  ],
  l2_11: [
    { q: '63 × 67 = ?', options: ['4221','4211','4231','4241'], correct: 0, exp: 'Same tens (6), units 3+7=10. Left: 6×7=42. Right: 3×7=21. Answer: 4221.' },
    { q: '24 × 26 = ?', options: ['614','624','634','644'], correct: 1, exp: 'Same tens (2), units 4+6=10. Left: 2×3=6. Right: 4×6=24. Answer: 624.' },
    { q: '48 × 42 = ?', options: ['2006','2016','2026','2036'], correct: 1, exp: 'Same tens (4), units 8+2=10. Left: 4×5=20. Right: 8×2=16. Answer: 2016.' },
    { q: 'In Antyayor Dashakepi, the right part of 89 × 81 is?', options: ['9','09','90','18'], correct: 1, exp: '9×1=9 but right part must always be 2 digits — write 09, not 9. Joining: 72|09 = 7209.' },
    { q: '36 × 34 = ?', options: ['1214','1224','1234','1244'], correct: 1, exp: 'Same tens (3), units 6+4=10. Left: 3×4=12. Right: 6×4=24. Answer: 1224.' },
    { q: 'Which pair can use Antyayor Dashakepi?', options: ['43×57','43×47','42×48','63×64'], correct: 1, exp: '43×47: same tens digit (4) and 3+7=10. That\'s the pattern. 43×57 has different tens digits; 42×48 has 2+8=10 but tens are same — actually this also works! But 43×47 is the cleaner standard example.' },
    { q: '73 × 77 = ?', options: ['5521','5621','5721','5821'], correct: 1, exp: 'Same tens (7), units 3+7=10. Left: 7×8=56. Right: 3×7=21. Answer: 5621.' },
    { q: 'The formula for Antyayor Dashakepi is T×(T+1) joined with A×B. For 56×54, what is T?', options: ['4','5','6','10'], correct: 1, exp: 'T is the common tens digit. For 56×54, both numbers start with 5, so T=5.' },
  ],
  l2_12: [
    { q: 'What is the month code for January?', options: ['0','1','2','4'], correct: 1 , exp: 'In the Vedic calendar formula, January has month code 1.' },
    { q: 'What day of the week is 26 January 2025?', options: ['Sunday','Monday','Tuesday','Wednesday'], correct: 0 , exp: '26 Jan 2025 = Sunday. (Verified directly — India\'s Republic Day 2025 was indeed a Sunday.)' },
    { q: 'Century correction for years 2000–2099 is?', options: ['+0','+2','+4','+6'], correct: 3 , exp: 'The century correction for the 2000s is +6 in the standard Doomsday/Vedic calendar formula.' },
    { q: 'The formula (d+m+y+⌊y÷4⌋−1) mod 7 gives?', options: ['Month number','Day of week number','Year code','Week number'], correct: 1 , exp: 'The result mod 7 gives a number 0–6 corresponding to the day of the week.' },
    { q: 'Result 6 in the formula corresponds to?', options: ['Sunday','Friday','Saturday','Monday'], correct: 2 , exp: 'In the standard mapping for this formula, result 6 = Saturday.' },
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

// ─── Main QuizTab ─────────────────────────────────────────────────────────────

export default function QuizTab({lesson, glass, onComplete, onNextLesson, allLessonIds }) {
  const { t, language } = useLanguage();
  const { user } = useVedicAuth();
  const questions = getQuestions(lesson.id);

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
      ? 'Excellent work! You\'ve mastered this lesson. 🌟'
      : pct >= 60
        ? 'Good job! Keep practicing to strengthen this technique.'
        : 'Keep going — revisit the concept and try the quiz again.';

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
            onClick={() => { setCurrent(0); setSelectedAnswers(Array(questions.length).fill(null)); setDone(false); }}
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
                        {steps.map((line, i) => (
                          <li key={i} style={{ marginBottom: 2 }}>{line.replace(/^Step \d+:\s*/, '')}</li>
                        ))}
                      </ol>
                    </div>
                  );
                }
                return <p style={{ margin: 0 }}>💡 {translated}</p>;
              })()}
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