// Aptitude teaching content — consolidated from all chapters built so far.
// Matches the EXACT same data contract as reasoningAptitudeLevel1Content.js
// (RA_LEVEL1_CHAPTERS + getChapterContent), so it plugs into the same shared
// UI components (StepBox, ExampleCard, OriginBox, WhyItWorksBox,
// CommonMistakeBox, RealWorldBox from ConceptTab.jsx) with zero changes needed
// to those components.
//
// Status as of this file: Level 0 (Pre-K) chapters have simpler
// parent/teacher-facing notes instead of the full pattern, since toddlers
// can't read — see prekNote field. Levels 1-2 chapters below are complete.
// Levels 3-4 (Secondary, Intermediate) not yet built.

export const APTITUDE_CHAPTERS = [
  // ── Level 0: Pre-K ──────────────────────────────────────────────────────
  // Simpler structure — a brief parent/teacher-facing note instead of the
  // full steps/mistake pattern, since this level has no reading involved.
  {
    id: 'match-the-picture', order: 1, level: 'PRE_K',
    title: { en: 'Match the Picture', hi: 'तस्वीर मिलाएं' },
    subtitle: { en: 'Visual Discrimination', hi: 'दृश्य विभेदन' },
    prekNote: {
      en: 'Builds early visual discrimination — the ability to notice fine differences between similar-looking objects, a foundational pre-reading skill (the same skill later used to tell similar-looking letters like b/d apart).',
      hi: 'शुरुआती दृश्य विभेदन बनाता है — मिलती-जुलती वस्तुओं में बारीक अंतर पहचानने की क्षमता, एक बुनियादी पढ़ाई-पूर्व कौशल (वही कौशल जो बाद में b/d जैसे मिलते-जुलते अक्षरों में फ़र्क करने में इस्तेमाल होता है)।',
    },
  },
  {
    id: 'what-doesnt-belong', order: 2, level: 'PRE_K',
    title: { en: "What Doesn't Belong", hi: 'क्या नहीं जुड़ता' },
    subtitle: { en: 'Early Classification', hi: 'शुरुआती वर्गीकरण' },
    prekNote: {
      en: 'Introduces early classification — grouping objects by a shared property. This is the earliest form of the same reasoning skill used throughout school (categorizing, comparing, organizing information).',
      hi: 'शुरुआती वर्गीकरण से परिचय कराता है — वस्तुओं को साझा गुण के आधार पर समूहित करना। यह उसी तर्क कौशल का सबसे शुरुआती रूप है जो पूरी स्कूली शिक्षा में इस्तेमाल होता है (वर्गीकरण, तुलना, जानकारी व्यवस्थित करना)।',
    },
  },
  {
    id: 'count-the-objects', order: 3, level: 'PRE_K',
    title: { en: 'Count the Objects', hi: 'वस्तुएं गिनें' },
    subtitle: { en: 'Early Numeracy', hi: 'शुरुआती संख्या ज्ञान' },
    prekNote: {
      en: 'Builds one-to-one counting — pointing at and naming each object exactly once. This is the single most important early-numeracy skill, and it directly precedes true number sense.',
      hi: 'एक-से-एक गिनती बनाता है — हर वस्तु की ओर इशारा करना और उसे बिल्कुल एक बार नाम देना। यह सबसे महत्वपूर्ण शुरुआती-संख्या कौशल है, और यह सच्ची संख्या समझ से ठीक पहले आता है।',
    },
  },
  {
    id: 'big-or-small', order: 4, level: 'PRE_K',
    title: { en: 'Big or Small', hi: 'बड़ा या छोटा' },
    subtitle: { en: 'Size Comparison', hi: 'आकार तुलना' },
    prekNote: {
      en: 'Introduces comparative reasoning — the idea that properties like size are relative, not fixed (an elephant is big compared to an ant, but small compared to a mountain). This is the seed of later concepts like "greater than / less than."',
      hi: 'तुलनात्मक तर्क से परिचय कराता है — यह विचार कि आकार जैसे गुण सापेक्ष होते हैं, स्थिर नहीं (हाथी चींटी की तुलना में बड़ा है, लेकिन पहाड़ की तुलना में छोटा)। यह बाद के "बड़ा / छोटा" जैसे concepts का बीज है।',
    },
  },
  {
    id: 'what-comes-next', order: 5, level: 'PRE_K',
    title: { en: 'What Comes Next', hi: 'आगे क्या आएगा' },
    subtitle: { en: 'Simple Patterns', hi: 'सरल पैटर्न' },
    prekNote: {
      en: 'Introduces simple repeating patterns (AB-AB) using real pictures. Pattern awareness at this age strongly predicts later maths and reading readiness — it is genuinely one of the best-evidenced early interventions.',
      hi: 'असली तस्वीरों का उपयोग करके सरल दोहराए जाने वाले पैटर्न (AB-AB) से परिचय कराता है। इस उम्र में पैटर्न जागरूकता बाद की गणित और पढ़ाई-तैयारी की मज़बूत भविष्यवाणी करती है — यह वाकई सबसे अच्छे प्रमाण वाले शुरुआती हस्तक्षेपों में से एक है।',
    },
  },

  // ── Level 1: Primary ────────────────────────────────────────────────────
  {
    id: 'word-meanings', order: 1, level: 'PRIMARY',
    title: { en: 'Word Meanings', hi: 'शब्दों के अर्थ' },
    subtitle: { en: 'Verbal Aptitude', hi: 'शाब्दिक योग्यता' },
    origin: { en: "Knowing a word's meaning — and the words closest to it or opposite to it — is the very first skill every Aptitude test in the world checks, from a Class 1 classroom quiz all the way to graduate-level exams like the GRE. It's not about memorizing a dictionary; it's about understanding shades of meaning well enough to tell two similar-sounding words apart.", hi: 'किसी शब्द का अर्थ जानना — और उसके सबसे नज़दीकी या विपरीत शब्दों को पहचानना — दुनिया के हर Aptitude टेस्ट की सबसे पहली परख है, चाहे वह Class 1 की क्लास क्विज़ हो या GRE जैसी उच्च स्तरीय परीक्षा। यह डिक्शनरी रटने के बारे में नहीं है; यह अर्थ के बारीक फ़र्क को इतनी अच्छी तरह समझने के बारे में है कि आप मिलते-जुलते दो शब्दों में अंतर बता सकें।' },
    steps: [
      { text: { en: 'Read the given word carefully and think of its exact meaning first, before looking at the options', hi: 'दिए गए शब्द को ध्यान से पढ़ें और विकल्पों को देखने से पहले उसका सटीक अर्थ सोचें' }, example: { en: "'Happy' means feeling good or pleased", hi: "'Happy' का मतलब है अच्छा या प्रसन्न महसूस करना" } },
      { text: { en: 'Check each option against that exact meaning, not just a vaguely related feeling', hi: 'हर विकल्प को उसी सटीक अर्थ से जांचें, सिर्फ किसी अस्पष्ट-सी जुड़ी भावना से नहीं' }, example: { en: "'Joyful' matches closely; 'Angry' does not match at all", hi: "'Joyful' नज़दीकी रूप से मेल खाता है; 'Angry' बिल्कुल मेल नहीं खाता" } },
      { text: { en: 'For OPPOSITE questions, flip the meaning completely — not just to something slightly different', hi: 'OPPOSITE (विपरीत) सवालों के लिए, अर्थ को पूरी तरह पलटें — सिर्फ थोड़ा अलग नहीं' }, example: { en: "Opposite of 'Hot' is 'Cold', not 'Warm' (Warm is still somewhat hot)", hi: "'Hot' का विपरीत है 'Cold', 'Warm' नहीं (Warm अब भी कुछ हद तक गर्म है)" } },
    ],
    whyItWorks: { en: 'Every language organizes words into families of meaning — near-synonyms, opposites, and unrelated words. Training your brain to instantly sort a new word into one of these three buckets is the exact mental move used in reading comprehension, writing clearly, and every verbal reasoning test format worldwide.', hi: 'हर भाषा शब्दों को अर्थ के परिवारों में व्यवस्थित करती है — लगभग-समान अर्थ वाले, विपरीत अर्थ वाले, और असंबंधित शब्द। किसी नए शब्द को तुरंत इन तीन श्रेणियों में से एक में रखना सीखना वही मानसिक कौशल है जो पढ़कर समझने, स्पष्ट लिखने, और दुनिया भर के हर मौखिक तर्क टेस्ट में इस्तेमाल होता है।' },
    example: { title: { en: "Which word means the same as 'Small'?", hi: "'Small' के समान अर्थ वाला शब्द कौन सा है?" }, lines: [{ en: "'Huge' means very big — the opposite direction entirely", hi: "'Huge' का मतलब है बहुत बड़ा — बिल्कुल विपरीत दिशा" }, { en: "'Tiny' means very small — matches closely", hi: "'Tiny' का मतलब है बहुत छोटा — नज़दीकी रूप से मेल खाता है" }], result: { en: 'Answer: Tiny ✓', hi: 'उत्तर: Tiny ✓' } },
    commonMistake: { en: "Students often pick a word just because it 'sounds nice' or is the first option, without actually comparing its meaning to the original word. Another common slip: confusing a SAME-meaning question with an OPPOSITE-meaning question. Always re-read the question word (same or opposite?) right before picking the final answer.", hi: 'छात्र अक्सर कोई शब्द सिर्फ इसलिए चुन लेते हैं क्योंकि वह \'अच्छा लगता है\' या पहला विकल्प है। एक और आम गलती: SAME-meaning सवाल को OPPOSITE-meaning सवाल समझ लेना। अंतिम उत्तर चुनने से ठीक पहले सवाल के शब्द को दोबारा ज़रूर पढ़ें।' },
    realWorld: { en: 'This exact skill is what helps you understand a difficult paragraph in a textbook, write a school essay without repeating the same word ten times, and read instructions or contracts carefully as an adult.', hi: 'यही कौशल किसी किताब के कठिन पैराग्राफ को समझने में, स्कूल निबंध में एक ही शब्द को दस बार दोहराए बिना लिखने में, और बड़े होकर निर्देशों या अनुबंधों को ध्यान से पढ़ने में मदद करता है।' },
  },
  {
    id: 'shape-patterns', order: 2, level: 'PRIMARY',
    title: { en: 'Shape Patterns', hi: 'आकृति पैटर्न' },
    subtitle: { en: 'Non-Verbal Aptitude', hi: 'अशाब्दिक योग्यता' },
    origin: { en: "Long before children can read fluently, they can already spot patterns in shapes — a skill so fundamental that nearly every school admission test in the world uses shape-based questions specifically because they don't depend on language or vocabulary at all.", hi: 'बच्चे धाराप्रवाह पढ़ना सीखने से बहुत पहले ही आकृतियों में पैटर्न पहचानने लगते हैं — यह इतना बुनियादी कौशल है कि दुनिया भर की लगभग हर स्कूल प्रवेश परीक्षा आकृति-आधारित सवाल विशेष रूप से इसलिए इस्तेमाल करती हैं क्योंकि इनका भाषा या शब्दावली से कोई लेना-देना नहीं होता।' },
    steps: [
      { text: { en: 'Look at what stays the SAME across the shapes shown, and what CHANGES', hi: 'दिखाई गई आकृतियों में क्या एक जैसा रहता है और क्या बदलता है, यह देखें' }, example: { en: 'Circle, Square, Circle, Square — the shapes alternate', hi: 'Circle, Square, Circle, Square — आकृतियाँ बदलती हैं' } },
      { text: { en: 'For a classification question, find the ONE rule that 3 of the 4 shapes share', hi: 'वर्गीकरण के सवाल के लिए, वह EK नियम खोजें जो 4 में से 3 आकृतियाँ साझा करती हैं' }, example: { en: 'Circle, Oval, Square, Ellipse — 3 are curved shapes, 1 has straight sides', hi: 'Circle, Oval, Square, Ellipse — 3 गोल आकृतियाँ हैं, 1 की सीधी भुजाएँ हैं' } },
      { text: { en: 'For "what comes next", count how many items form one repeating group', hi: '"आगे क्या आएगा" के लिए, गिनें कि एक दोहराया जाने वाला समूह कितने आइटम से बनता है' }, example: { en: 'Triangle, Triangle, Circle repeats every 3 items', hi: 'Triangle, Triangle, Circle हर 3 आइटम पर दोहराता है' } },
    ],
    whyItWorks: { en: "Recognizing patterns in shapes trains the exact same mental skill used later for recognizing patterns in numbers, in language (grammar rules), and even in music (rhythm). It's genuinely one of the most transferable skills a young learner can practice.", hi: 'आकृतियों में पैटर्न पहचानना वही मानसिक कौशल सिखाता है जो बाद में संख्याओं, भाषा, और संगीत में पैटर्न पहचानने के काम आता है। यह वाकई एक छोटे शिक्षार्थी के लिए सबसे स्थानांतरणीय कौशलों में से एक है।' },
    example: { title: { en: 'Triangle, Square, Pentagon, ? — what comes next?', hi: 'Triangle, Square, Pentagon, ? — आगे क्या आएगा?' }, lines: [{ en: 'Triangle has 3 sides, Square has 4 sides, Pentagon has 5 sides', hi: 'Triangle की 3, Square की 4, Pentagon की 5 भुजाएँ हैं' }, { en: 'Each shape has exactly one more side than the last', hi: 'हर आकृति में पिछली से ठीक एक भुजा ज़्यादा है' }], result: { en: 'Answer: Hexagon (6 sides) ✓', hi: 'उत्तर: Hexagon (6 भुजाएँ) ✓' } },
    commonMistake: { en: "Students often focus on the wrong feature — noticing shapes getting bigger when the actual pattern is about sides or color. Before answering, explicitly name out loud what you think is changing and what is staying the same.", hi: 'छात्र अक्सर गलत विशेषता पर ध्यान देते हैं। जवाब देने से पहले, ज़ोर से बोलकर बताएं कि आपको क्या बदलता हुआ और क्या एक जैसा लग रहा है।' },
    realWorld: { en: 'This is the same skill used when reading a map, following a recipe, or recognizing that traffic lights always follow the same red-yellow-green pattern.', hi: 'यही कौशल नक्शा पढ़ते समय, रेसिपी का पालन करते समय, या ट्रैफिक लाइट का पैटर्न पहचानने में काम आता है।' },
  },
  {
    id: 'number-puzzles', order: 3, level: 'PRIMARY',
    title: { en: 'Number Puzzles', hi: 'संख्या पहेलियाँ' },
    subtitle: { en: 'Numerical Aptitude', hi: 'संख्यात्मक योग्यता' },
    origin: { en: "This chapter is different from Vedic Maths on purpose — Vedic Maths teaches you HOW to calculate fast, while Number Puzzles teaches you to reason ABOUT numbers: filling in missing pieces, comparing quantities, and working backwards from an answer.", hi: 'यह अध्याय जानबूझकर Vedic Maths से अलग है — Vedic Maths आपको तेज़ी से हिसाब करना सिखाता है, जबकि Number Puzzles आपको संख्याओं के बारे में तर्क करना सिखाता है।' },
    steps: [
      { text: { en: 'For a missing-number equation, work backwards from what you know', hi: 'गायब संख्या वाले समीकरण के लिए, जो आप जानते हैं उससे पीछे की ओर काम करें' }, example: { en: '5 + ? = 9 means the missing number is 9 - 5 = 4', hi: '5 + ? = 9 का मतलब है गायब संख्या 9 - 5 = 4 है' } },
      { text: { en: 'For word problems, find the "per unit" value first, then scale it', hi: 'शब्द समस्याओं के लिए, पहले "प्रति इकाई" मूल्य पता करें, फिर उसे बढ़ाएं या घटाएं' }, example: { en: 'If 3 pencils cost 15 rupees, one pencil costs 15÷3=5 rupees', hi: 'अगर 3 पेंसिल की कीमत 15 रुपये है, तो एक पेंसिल की कीमत 15÷3=5 रुपये है' } },
      { text: { en: 'For comparison questions, actually calculate both sides before deciding', hi: 'तुलना के सवालों के लिए, फैसला करने से पहले दोनों पक्षों की वास्तव में गणना करें' }, example: { en: "Don't guess whether 4+5 or 3×2 is bigger — compute both", hi: 'यह अनुमान न लगाएं — दोनों की गणना करें' } },
    ],
    whyItWorks: { en: 'Working backwards from an answer, and breaking a problem into a "per unit" rate, are two of the most widely useful math habits — they show up in budgeting, cooking, shopping, and virtually every practical use of numbers.', hi: 'उत्तर से पीछे की ओर काम करना, और "प्रति इकाई" दर में तोड़ना, सबसे उपयोगी गणित आदतों में से हैं — बजट, खाना पकाने, खरीदारी में दिखती हैं।' },
    example: { title: { en: 'If 3 pencils cost 15 rupees, how much do 5 pencils cost?', hi: 'अगर 3 पेंसिल की कीमत 15 रुपये है, तो 5 पेंसिल की कीमत कितनी होगी?' }, lines: [{ en: 'One pencil costs 15 ÷ 3 = 5 rupees', hi: 'एक पेंसिल की कीमत 15 ÷ 3 = 5 रुपये है' }, { en: '5 pencils cost 5 × 5 = 25 rupees', hi: '5 पेंसिल की कीमत 5 × 5 = 25 रुपये है' }], result: { en: 'Answer: 25 rupees ✓', hi: 'उत्तर: 25 रुपये ✓' } },
    commonMistake: { en: "A very common error is scaling the wrong direction. Before answering, ask: 'am I finding the value of ONE unit, or SEVERAL units?'", hi: 'एक आम गलती गलत दिशा में स्केल करना है। पूछें: \'क्या मैं एक इकाई का मूल्य पता कर रहा हूं, या कई इकाइयों का?\'' },
    realWorld: { en: 'This is exactly the math used when scaling a recipe, figuring out if a bulk pack is cheaper per item, or splitting a bill fairly among friends.', hi: 'यह ठीक वही गणित है जो रेसिपी बढ़ाने, थोक पैक की तुलना करने, या बिल बांटने में इस्तेमाल होता है।' },
  },
  {
    id: 'speed-maths-connect', order: 4, level: 'PRIMARY',
    title: { en: 'Speed Maths Connect', hi: 'स्पीड मैथ्स कनेक्ट' },
    subtitle: { en: 'Cross-Link: Aptitude ↔ Vedic Maths', hi: 'क्रॉस-लिंक: Aptitude ↔ Vedic Maths' },
    origin: { en: "This chapter is a bridge, not a full subject on its own — it takes techniques you've already learned in Vedic Maths and shows you how they apply directly to Aptitude-style problems, so the two subjects reinforce each other instead of feeling separate.", hi: 'यह अध्याय एक पुल है, अपने आप में पूरा विषय नहीं — यह वे तकनीकें लेता है जो आपने पहले से Vedic Maths में सीखी हैं और दिखाता है कि वे सीधे Aptitude-शैली की समस्याओं पर कैसे लागू होती हैं।' },
    steps: [
      { text: { en: 'Recognize the Vedic Maths technique the question is hinting at', hi: 'पहचानें कि सवाल किस Vedic Maths तकनीक का इशारा कर रहा है' }, example: { en: 'A number close to 100 being multiplied? That is Nikhilam.', hi: '100 के करीब की संख्या गुणा हो रही है? यह Nikhilam है।' } },
      { text: { en: 'Apply the exact same steps you already practiced in Vedic Maths', hi: 'वही चरण लगाएं जिनका आपने Vedic Maths में पहले से अभ्यास किया है' }, example: { en: 'No new method to learn — just recognizing where to use it', hi: 'कोई नया तरीका नहीं सीखना — बस यह पहचानना कि इसे कहां इस्तेमाल करना है' } },
    ],
    whyItWorks: { en: 'Real exams never label which "chapter" a question comes from — being able to recognize a familiar tool in an unfamiliar wrapper is a genuinely higher-level skill than just applying a formula when told to.', hi: 'असली परीक्षाएं कभी नहीं बताती कि कोई सवाल किस "अध्याय" से है — किसी अनजान रूप में एक जाने-पहचाने औज़ार को पहचान पाना एक genuinely उच्च-स्तरीय कौशल है।' },
    example: { title: { en: 'What is 98 × 97?', hi: '98 × 97 क्या है?' }, lines: [{ en: 'Both numbers are close to 100 — this is Nikhilam base 100', hi: 'दोनों संख्याएं 100 के करीब हैं — यह Nikhilam आधार 100 है' }, { en: 'Deviations: -2 and -3. Cross: 98-3=95. Product: -2×-3=6', hi: 'विचलन: -2 और -3। क्रॉस: 98-3=95। गुणनफल: -2×-3=6' }], result: { en: 'Answer: 9506 ✓', hi: 'उत्तर: 9506 ✓' } },
    commonMistake: { en: "Students sometimes try to solve these the slow, standard way even though they already know a faster Vedic technique — simply because the question is phrased differently than in the Vedic Maths section. Watch for the same numeric patterns you already know shortcuts for.", hi: 'छात्र कभी-कभी इन्हें धीमे, मानक तरीके से हल करने की कोशिश करते हैं, भले ही वे पहले से तेज़ Vedic तकनीक जानते हों — क्योंकि सवाल अलग तरह से लिखा है।' },
    realWorld: { en: 'This is exactly the flexibility competitive exams reward — the same speed technique applied under time pressure, regardless of how the question is framed.', hi: 'यही वह लचीलापन है जिसे प्रतियोगी परीक्षाएं पुरस्कृत करती हैं — समय के दबाव में वही स्पीड तकनीक, चाहे सवाल कैसे भी लिखा हो।' },
  },

  // ── Level 2: Middle ─────────────────────────────────────────────────────
  {
    id: 'verbal-classification', order: 1, level: 'MIDDLE',
    title: { en: 'Verbal Classification', hi: 'शाब्दिक वर्गीकरण' },
    subtitle: { en: 'Verbal Aptitude', hi: 'शाब्दिक योग्यता' },
    origin: { en: "Classification is the mental skill of sorting things into groups based on shared meaning — one of the oldest tested skills in psychology, dating back over a century. Knowing which category a word truly belongs to is a strong sign of genuinely understanding it.", hi: 'वर्गीकरण चीज़ों को साझा अर्थ के आधार पर समूहों में बांटने का मानसिक कौशल है — मनोविज्ञान में सबसे पुराने परखे गए कौशलों में से एक। यह जानना कि कोई शब्द वास्तव में किस श्रेणी में आता है, यह दिखाता है कि आप उसे सच में समझते हैं।' },
    steps: [
      { text: { en: 'Identify what 3 of the 4 words genuinely have in common', hi: 'पहचानें कि 4 में से 3 शब्दों में वास्तव में क्या समानता है' }, example: { en: 'Doctor, Teacher, Engineer are all professions', hi: 'Doctor, Teacher, Engineer सभी पेशे हैं' } },
      { text: { en: 'Check that the 4th word breaks that SPECIFIC shared rule', hi: 'जांचें कि चौथा शब्द उस विशिष्ट साझा नियम को तोड़ता है' }, example: { en: 'School is a place, not a profession', hi: 'School एक जगह है, पेशा नहीं' } },
    ],
    whyItWorks: { en: 'This mirrors exactly how the human brain naturally organizes vocabulary — into semantic categories. Strengthening this skill directly improves reading comprehension.', hi: 'यह ठीक उसी तरह है जैसे मानव मस्तिष्क स्वाभाविक रूप से शब्दावली को व्यवस्थित करता है। इस कौशल को मज़बूत करना सीधे पढ़ने की समझ को बेहतर बनाता है।' },
    example: { title: { en: 'Which word does NOT belong: Red, Blue, Green, Circle?', hi: 'कौन सा शब्द नहीं जुड़ता: Red, Blue, Green, Circle?' }, lines: [{ en: 'Red, Blue, and Green are all colours', hi: 'Red, Blue, और Green सभी रंग हैं' }, { en: 'Circle is a shape, not a colour', hi: 'Circle एक आकृति है, रंग नहीं' }], result: { en: 'Answer: Circle ✓', hi: 'उत्तर: Circle ✓' } },
    commonMistake: { en: "The most common error is picking a category that's too broad or too vague instead of the SPECIFIC shared category intended. A good check: can you name the category in one precise word?", hi: 'सबसे आम गलती एक ऐसी श्रेणी चुनना है जो बहुत व्यापक या अस्पष्ट है। एक अच्छी जांच: क्या आप श्रेणी को एक सटीक शब्द में नाम दे सकते हैं?' },
    realWorld: { en: 'This exact skill is what a librarian uses to shelve books, what a doctor uses to diagnose symptoms into a category, and what anyone uses organizing files into sensible groups.', hi: 'यही कौशल एक लाइब्रेरियन किताबों को सही जगह रखने के लिए, एक डॉक्टर लक्षणों को पहचानने के लिए इस्तेमाल करता है।' },
  },
  {
    id: 'percentage-puzzles', order: 4, level: 'MIDDLE',
    title: { en: 'Percentage Puzzles', hi: 'प्रतिशत पहेलियाँ' },
    subtitle: { en: 'Numerical Aptitude', hi: 'संख्यात्मक योग्यता' },
    origin: { en: "Percentages are one of the most-used numerical concepts in real life — discounts, exam scores, interest rates, statistics in the news — yet they trip up more students than almost any other topic, mostly from not having a fast, reliable mental method.", hi: 'प्रतिशत रोज़मर्रा की ज़िंदगी में सबसे ज़्यादा इस्तेमाल होने वाली संख्यात्मक concepts में से एक हैं — छूट, परीक्षा अंक, ब्याज दरें — फिर भी ये लगभग किसी भी और विषय से ज़्यादा छात्रों को उलझा देती हैं, ज़्यादातर एक तेज़, भरोसेमंद मानसिक तरीके की कमी से।' },
    steps: [
      { text: { en: 'Remember: 10% is always the number divided by 10 — the fastest anchor point', hi: 'याद रखें: 10% हमेशा संख्या को 10 से भाग देने पर मिलता है — सबसे तेज़ आधार बिंदु' }, example: { en: '10% of 250 = 25', hi: '250 का 10% = 25' } },
      { text: { en: 'Build any other percentage from combinations of 10%, 5%, and 1%', hi: 'किसी भी और प्रतिशत को 10%, 5%, और 1% के मेल से बनाएं' }, example: { en: '20% = 10% doubled; 5% = half of 10%', hi: '20% = 10% को दोगुना करना; 5% = 10% का आधा' } },
    ],
    whyItWorks: { en: 'This "building block" approach means you never need to memorize percentage formulas — every percentage can be mentally assembled from the same few easy anchor points.', hi: 'यह "बिल्डिंग ब्लॉक" तरीका मतलब है कि आपको कभी प्रतिशत सूत्र याद नहीं करने पड़ते — हर प्रतिशत को उन्हीं कुछ आसान आधार बिंदुओं से मानसिक रूप से जोड़ा जा सकता है।' },
    example: { title: { en: 'What is 20% of 150?', hi: '150 का 20% क्या है?' }, lines: [{ en: '10% of 150 = 15', hi: '150 का 10% = 15' }, { en: '20% is double 10%, so 15 × 2 = 30', hi: '20%, 10% का दोगुना है, तो 15 × 2 = 30' }], result: { en: 'Answer: 30 ✓', hi: 'उत्तर: 30 ✓' } },
    commonMistake: { en: 'Students often try to use the standard formula (value × percentage ÷ 100) even for simple round numbers, which is slower and more error-prone than building from 10%. Save the formula for when the building-block approach genuinely does not fit.', hi: 'छात्र अक्सर सरल गोल संख्याओं के लिए भी मानक सूत्र इस्तेमाल करने की कोशिश करते हैं, जो 10% से बनाने से धीमा और गलती-प्रवण है।' },
    realWorld: { en: 'This exact mental technique is what lets you instantly estimate a restaurant tip, a shopping discount, or an exam score without reaching for a calculator.', hi: 'यही मानसिक तकनीक आपको बिना कैलकुलेटर के तुरंत रेस्टोरेंट टिप, खरीदारी छूट, या परीक्षा अंक का अनुमान लगाने देती है।' },
  },
  {
    id: 'reasoning-connect', order: 5, level: 'MIDDLE',
    title: { en: 'Reasoning Connect', hi: 'रीज़निंग कनेक्ट' },
    subtitle: { en: 'Cross-Link: Aptitude ↔ Reasoning', hi: 'क्रॉस-लिंक: Aptitude ↔ Reasoning' },
    origin: { en: "You might notice this chapter feels familiar — that's intentional. Aptitude and Reasoning share real overlap in the skills they test, and this chapter exists to make that connection explicit rather than hidden.", hi: 'हो सकता है यह अध्याय आपको जाना-पहचाना लगे — यह जानबूझकर है। Aptitude और Reasoning जिन कौशलों की परख करते हैं उनमें वाकई असली ओवरलैप है।' },
    steps: [
      { text: { en: 'Solve the question using whatever approach feels natural — the underlying skill is shared', hi: 'सवाल को जो भी तरीका स्वाभाविक लगे उससे हल करें' }, example: { en: 'A classification question here uses the exact same logic as Reasoning\'s Odd One Out chapter', hi: 'यहां का वर्गीकरण सवाल Reasoning के Odd One Out अध्याय जैसा ही तर्क इस्तेमाल करता है' } },
      { text: { en: 'Notice which Reasoning chapter each question links back to', hi: 'ध्यान दें कि हर सवाल किस Reasoning अध्याय से जुड़ता है' }, example: { en: 'That Reasoning chapter has many more questions like it', hi: 'उस Reasoning अध्याय में और भी कई ऐसे सवाल हैं' } },
    ],
    whyItWorks: { en: "Real-world problems rarely announce which 'subject' they belong to. Practicing the connection between Aptitude and Reasoning builds the flexibility to recognize a familiar skill in an unfamiliar format.", hi: 'असली दुनिया की समस्याएं शायद ही कभी बताती हैं कि वे किस \'विषय\' से जुड़ी हैं। Aptitude और Reasoning के बीच जुड़ाव का अभ्यास लचीलापन बनाता है।' },
    example: { title: { en: 'If all Cats are Animals, and Tom is a Cat, is Tom an Animal?', hi: 'अगर सभी Cats, Animals हैं, और Tom एक Cat है, तो क्या Tom एक Animal है?' }, lines: [{ en: 'This is a classic logical deduction', hi: 'यह एक क्लासिक तार्किक निष्कर्ष है' }], result: { en: 'Answer: Yes ✓', hi: 'उत्तर: Yes ✓' } },
    commonMistake: { en: "Students sometimes treat Aptitude and Reasoning as completely separate subjects requiring different mindsets. Remember: the skill is the same, just the packaging is different.", hi: 'छात्र कभी-कभी Aptitude और Reasoning को पूरी तरह अलग विषय मानते हैं। याद रखें: कौशल वही है, बस पैकेजिंग अलग है।' },
    realWorld: { en: 'Competitive exams worldwide routinely mix these skill types within the same section precisely because real decision-making does too.', hi: 'दुनिया भर की प्रतियोगी परीक्षाएं अक्सर एक ही सेक्शन में इन कौशल प्रकारों को मिलाती हैं।' },
  },
];

export function getAptitudeChapterContent(chapterId) {
  return APTITUDE_CHAPTERS.find((c) => c.id === chapterId) || null;
}

export function getAptitudeChaptersByLevel(level) {
  return APTITUDE_CHAPTERS.filter((c) => c.level === level).sort((a, b) => a.order - b.order);
}
