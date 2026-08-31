// Reasoning & Aptitude — Level 2 (Intermediate) Deep Content
// Matches level-2 chapter ids in reasoningAptitudeLevel2.js.
// Same bilingual {en, hi} structure as Level 1.

export const RA_LEVEL2_CHAPTERS = [
  {
    id: 'odd-one-out-l2',
    order: 1,
    title: { en: 'Odd One Out', hi: 'विषम को पहचानें' },
    subtitle: { en: 'Abstract Classification', hi: 'अमूर्त वर्गीकरण' },
    origin: {
      en: 'At Level 2, Odd One Out puzzles stop being obvious and start hiding the shared rule inside abstract properties — prime numbers, natural vs man-made, concrete vs abstract, or "tools that measure." Competitive exams like SSC, CAT, and UPSC heavily test this form because it separates students who memorise lists from those who think in categories.',
      hi: 'स्तर 2 में, विषम-को-पहचानें पहेलियाँ स्पष्ट नहीं रहतीं — साझा नियम अमूर्त गुणों में छिपा होता है: जैसे अभाज्य संख्याएँ, प्राकृतिक बनाम मानव-निर्मित, या "मापने के उपकरण।" SSC, CAT और UPSC जैसी परीक्षाएँ इसी रूप की जाँच करती हैं, क्योंकि यह उन छात्रों को अलग करता है जो रटते हैं उनसे जो श्रेणियों में सोचते हैं।',
    },
    steps: [
      { text: { en: 'Look for hidden properties, not just surface appearance', hi: 'सतही रूप-रंग नहीं, छिपे गुणों को खोजें' }, example: { en: '8, 27, 64, 100 → check if they are perfect cubes (8=2³, 27=3³, 64=4³, but 100 is not)', hi: '8, 27, 64, 100 → जांचें कि क्या ये पूर्ण घन हैं (8=2³, 27=3³, 64=4³, लेकिन 100 नहीं)' } },
      { text: { en: 'Test multiple possible grouping rules before choosing', hi: 'चुनने से पहले कई संभावित समूहीकरण नियम जांचें' }, example: { en: 'Newspaper, Television, Radio, Telephone — all broadcast info? No, Telephone doesn\'t broadcast. So Telephone is out.', hi: 'अखबार, टेलीविजन, रेडियो, टेलीफोन — सभी जानकारी प्रसारित करते हैं? नहीं, टेलीफोन नहीं करता। तो टेलीफोन अलग है।' } },
      { text: { en: 'Pick the rule that applies to exactly 3 items and excludes exactly 1', hi: 'वह नियम चुनें जो ठीक 3 वस्तुओं पर लागू हो और ठीक 1 को बाहर करे' }, example: { en: 'Laugh, Cry, Run, Smile → three express emotion (Laugh, Cry, Smile), Run is a physical action', hi: 'हँसना, रोना, दौड़ना, मुस्कुराना → तीन भावना व्यक्त करते हैं, दौड़ना एक शारीरिक क्रिया है' } },
    ],
    whyItWorks: {
      en: 'Abstract classification is how scientists, lawyers, and engineers think. A doctor classifying symptoms, a lawyer categorising case precedents, a programmer defining data types — all of them ask the same question you\'re practising here: "What shared property binds these, and which one breaks the rule?" Training this skill on abstract puzzles makes your brain faster at it in every domain.',
      hi: 'अमूर्त वर्गीकरण वैसे ही होता है जैसे वैज्ञानिक, वकील और इंजीनियर सोचते हैं। एक डॉक्टर लक्षणों का वर्गीकरण, एक वकील मामलों की श्रेणी, एक प्रोग्रामर डेटा प्रकार — सभी वही सवाल पूछते हैं जो आप यहाँ अभ्यास कर रहे हैं: "इन्हें कौन सा साझा गुण जोड़ता है, और कौन नियम तोड़ता है?"',
    },
    example: {
      title: { en: '2, 3, 5, 9 — which is the odd one out?', hi: '2, 3, 5, 9 — कौन सा विषम है?' },
      lines: [
        { en: '2, 3, 5 are all prime numbers (divisible only by 1 and themselves)', hi: '2, 3, 5 सभी अभाज्य संख्याएँ हैं (केवल 1 और स्वयं से विभाज्य)' },
        { en: '9 = 3 × 3, so it is NOT a prime number', hi: '9 = 3 × 3, इसलिए यह अभाज्य नहीं है' },
      ],
      result: { en: 'Answer: 9 ✓ (it\'s the only non-prime)', hi: 'उत्तर: 9 ✓ (यह एकमात्र गैर-अभाज्य है)' },
    },
    commonMistake: {
      en: 'At Level 2, students often pick the item that "looks most different" visually rather than the one that breaks the hidden rule. Train yourself to always ask "What do 3 of these share in common?" before even looking at the options.',
      hi: 'स्तर 2 में, छात्र अक्सर वह वस्तु चुन लेते हैं जो देखने में "सबसे अलग" लगे, न कि वह जो छिपे नियम को तोड़े। खुद को हमेशा पहले पूछने के लिए प्रशिक्षित करें: "इनमें से 3 में क्या समान है?"',
    },
    realWorld: {
      en: 'This exact reasoning appears in data analysis — spotting the "outlier" in a dataset — and in medical diagnosis, where a doctor checks which symptom doesn\'t fit the expected disease pattern. Abstract Odd One Out trains the exact mental muscle for anomaly detection.',
      hi: 'यही तर्क डेटा विश्लेषण में प्रकट होता है — किसी डेटासेट में "आउटलायर" पहचानना — और चिकित्सा निदान में, जहाँ डॉक्टर जाँचता है कि कौन सा लक्षण अपेक्षित बीमारी के पैटर्न से मेल नहीं खाता।',
    },
  },

  {
    id: 'number-series-l2',
    order: 2,
    title: { en: 'Number Series', hi: 'संख्या श्रृंखला' },
    subtitle: { en: 'Geometric, Fibonacci & Mixed Patterns', hi: 'ज्यामितीय, फिबोनाची और मिश्रित पैटर्न' },
    origin: {
      en: 'Level 2 series go beyond simple "add the same number" rules. You now encounter geometric series (multiply each time), Fibonacci-style series (each term = sum of two before it), and alternating two-rule series. These appear in JEE, NEET, and banking aptitude tests as standard difficulty.',
      hi: 'स्तर 2 की श्रृंखलाएँ "हर बार एक ही संख्या जोड़ो" के सरल नियमों से आगे जाती हैं। अब आपका सामना होगा ज्यामितीय श्रृंखला (हर बार गुणा करें), फिबोनाची-शैली (प्रत्येक पद = पिछले दो का योग), और दो नियमों वाली वैकल्पिक श्रृंखला से।',
    },
    steps: [
      { text: { en: 'Check ratios, not just differences — consecutive terms may be multiplied, not added', hi: 'अंतर नहीं, अनुपात जांचें — क्रमागत पद जोड़े नहीं, गुणे जाते हों' }, example: { en: '3, 6, 12, 24 — ratio is ×2 each time (geometric), not +3', hi: '3, 6, 12, 24 — अनुपात हर बार ×2 है (ज्यामितीय), +3 नहीं' } },
      { text: { en: 'For Fibonacci-style: check if each term = the sum of the two terms before it', hi: 'फिबोनाची-शैली के लिए: जांचें कि क्या प्रत्येक पद = पिछले दो पदों का योग है' }, example: { en: '1, 1, 2, 3, 5, 8 → 1+1=2, 1+2=3, 2+3=5, 3+5=8', hi: '1, 1, 2, 3, 5, 8 → 1+1=2, 1+2=3, 2+3=5, 3+5=8' } },
      { text: { en: 'For alternating rules: note whether ODD and EVEN positioned terms follow different rules', hi: 'वैकल्पिक नियमों के लिए: ध्यान दें कि विषम और सम स्थान के पदों में अलग-अलग नियम हों' }, example: { en: '2, 6, 12, 20, 30, 42 → differences are 4, 6, 8, 10, 12 (increasing by 2 each time)', hi: '2, 6, 12, 20, 30, 42 → अंतर हैं 4, 6, 8, 10, 12 (हर बार 2 बढ़ता है)' } },
    ],
    whyItWorks: {
      en: 'Geometric series model compound interest, population growth, and radioactive decay. Fibonacci series appear in nature (flower petals, spiral shells). By learning to recognise these patterns, you\'re not just solving aptitude questions — you\'re building the mental model that underlies science and finance.',
      hi: 'ज्यामितीय श्रृंखला चक्रवृद्धि ब्याज, जनसंख्या वृद्धि और रेडियोधर्मी क्षय को मॉडल करती है। फिबोनाची श्रृंखला प्रकृति में मिलती है (फूलों की पंखुड़ियाँ, सर्पिल कुंडलियाँ)। इन पैटर्नों को पहचानना सीखकर आप न केवल योग्यता प्रश्न हल कर रहे हैं — बल्कि वह मानसिक मॉडल बना रहे हैं जो विज्ञान और वित्त का आधार है।',
    },
    example: {
      title: { en: '5, 11, 23, 47, ?', hi: '5, 11, 23, 47, ?' },
      lines: [
        { en: 'Difference: 6, 12, 24 → differences are doubling each time', hi: 'अंतर: 6, 12, 24 → अंतर हर बार दोगुना हो रहा है' },
        { en: 'Next difference = 48, so ? = 47 + 48 = 95', hi: 'अगला अंतर = 48, तो ? = 47 + 48 = 95' },
      ],
      result: { en: 'Answer: 95 ✓', hi: 'उत्तर: 95 ✓' },
    },
    commonMistake: {
      en: 'Students trained on Level 1 automatically look for a constant difference. At Level 2, always compute the SECOND level of differences (differences between differences) — this reveals the hidden rule in most medium-hard series.',
      hi: 'स्तर 1 पर प्रशिक्षित छात्र स्वचालित रूप से एक स्थिर अंतर खोजते हैं। स्तर 2 पर, हमेशा अंतरों के अंतर (द्वितीय स्तर के अंतर) निकालें — यह अधिकांश मध्यम-कठिन श्रृंखलाओं में छिपा नियम उजागर करता है।',
    },
    realWorld: {
      en: 'Population doubling time, viral spread rates, compound interest calculations — all of these are geometric or exponential series in disguise. Students who can spot these patterns early have a huge head start in economics, biology, and data science.',
      hi: 'जनसंख्या दोगुनी होने का समय, वायरस फैलने की दर, चक्रवृद्धि ब्याज गणना — ये सभी ज्यामितीय या घातांकीय श्रृंखलाएँ हैं। इन पैटर्नों को जल्दी पहचानने वाले छात्रों को अर्थशास्त्र, जीव विज्ञान और डेटा साइंस में बड़ा फायदा होता है।',
    },
  },

  {
    id: 'analogies-l2',
    order: 3,
    title: { en: 'Analogies', hi: 'सादृश्य' },
    subtitle: { en: 'Abstract & Functional Relationships', hi: 'अमूर्त और कार्यात्मक संबंध' },
    origin: {
      en: 'Level 2 analogies move from simple "belongs to" relationships to functional, oppositional, and instrument-object relationships. A question like "Earthquake : Seismograph :: Heart : ?" requires knowing that a seismograph measures earthquakes — then finding what measures a heart.',
      hi: 'स्तर 2 के सादृश्य सरल "किससे संबंधित है" संबंधों से कार्यात्मक, विरोधात्मक और यंत्र-वस्तु संबंधों की ओर बढ़ते हैं। "भूकंप : सीस्मोग्राफ :: हृदय : ?" जैसे प्रश्न के लिए यह जानना ज़रूरी है कि सीस्मोग्राफ भूकंप मापता है।',
    },
    steps: [
      { text: { en: 'Name the EXACT relationship type before filling the blank', hi: 'रिक्त स्थान भरने से पहले संबंध का सटीक प्रकार नाम दें' }, example: { en: 'Author:Novel = Creator:Creation. Now apply: Composer:? = Creator:Creation → Symphony', hi: 'लेखक:उपन्यास = निर्माता:रचना। अब लागू करें: संगीतकार:? = निर्माता:रचना → सिम्फनी' } },
      { text: { en: 'Watch for antonym pairs — the relationship may be "opposite of"', hi: 'विलोम जोड़ी पर ध्यान दें — संबंध "का विपरीत" हो सकता है' }, example: { en: 'Coward:Bravery = person who lacks the quality : the quality they lack', hi: 'कायर:बहादुरी = जो गुण की कमी है वाला व्यक्ति : वह गुण जिसकी कमी है' } },
      { text: { en: 'For instrument analogies: identify what each instrument MEASURES or RECORDS', hi: 'उपकरण सादृश्य के लिए: पहचानें कि प्रत्येक उपकरण क्या मापता या रिकॉर्ड करता है' }, example: { en: 'Seismograph measures earthquake → ECG measures heart activity ✓', hi: 'सीस्मोग्राफ भूकंप मापता है → ECG हृदय गतिविधि मापता है ✓' } },
    ],
    whyItWorks: {
      en: 'Analogical reasoning is the core of legal precedent, scientific hypothesis generation, and engineering design. "This bridge failed — analogously, what other bridges might fail by the same mechanism?" Mastering analogy types means you can transfer knowledge from known situations to unknown ones — the hallmark of expert thinking.',
      hi: 'सादृश्यात्मक तर्क कानूनी नजीर, वैज्ञानिक परिकल्पना निर्माण और इंजीनियरिंग डिजाइन का मूल है। "यह पुल विफल हुआ — सादृश्य से, कौन से अन्य पुल उसी तंत्र से विफल हो सकते हैं?" सादृश्य प्रकार में महारत हासिल करने का मतलब है कि आप ज्ञान को ज्ञात स्थितियों से अज्ञात पर स्थानांतरित कर सकते हैं।',
    },
    example: {
      title: { en: 'Marathon : Running :: Regatta : ?', hi: 'मैराथन : दौड़ना :: रिगाटा : ?' },
      lines: [
        { en: 'A Marathon is a competitive event for Running', hi: 'मैराथन दौड़ने की एक प्रतिस्पर्धी प्रतियोगिता है' },
        { en: 'A Regatta is a competitive event for Rowing', hi: 'रिगाटा नौकायन की एक प्रतिस्पर्धी प्रतियोगिता है' },
      ],
      result: { en: 'Answer: Rowing ✓', hi: 'उत्तर: नौकायन ✓' },
    },
    commonMistake: {
      en: '"Marathon relates to running, so Regatta relates to... water?" is wrong — you need the specific activity (Rowing), not the environment (Water). Always be as specific as the original pair.',
      hi: '"मैराथन दौड़ने से जुड़ी है, तो रिगाटा... पानी से?" यह गलत है — आपको विशिष्ट गतिविधि (नौकायन) चाहिए, न कि पर्यावरण (पानी)।',
    },
    realWorld: {
      en: 'Every time a doctor says "This infection behaves like a virus, so we\'ll treat it similarly to virus X," they\'re using functional analogy. Scientists use it to design drugs (this molecule works like molecule X, so it might treat disease Y). It\'s arguably the most powerful thinking tool in existence.',
      hi: 'जब भी एक डॉक्टर कहता है "यह संक्रमण वायरस की तरह व्यवहार करता है, इसलिए हम इसे वायरस X की तरह उपचारित करेंगे," वे कार्यात्मक सादृश्य का उपयोग कर रहे हैं।',
    },
  },

  {
    id: 'ranking-ordering-l2',
    order: 4,
    title: { en: 'Ranking & Ordering', hi: 'रैंकिंग और क्रमबद्धता' },
    subtitle: { en: 'Multi-Variable & Position Logic', hi: 'बहु-चर और स्थिति तर्क' },
    origin: {
      en: 'Level 2 ranking problems involve 4–6 people with multiple clues that must be chained together, or position problems where you calculate ranks from both ends. This is exactly the logic that scheduling algorithms and database sorting use.',
      hi: 'स्तर 2 की रैंकिंग समस्याओं में 4-6 लोग होते हैं जिनमें कई सुराग होते हैं जिन्हें एक साथ जोड़ना होता है, या दोनों सिरों से रैंक की गणना करनी होती है।',
    },
    steps: [
      { text: { en: 'Write out the inequality chain: A > B > C — then read off the answer', hi: 'असमानता श्रृंखला लिखें: A > B > C — फिर उत्तर पढ़ें' }, example: { en: 'A > B, C > A, D > C → chain: D > C > A > B → greatest = D, least = B', hi: 'A > B, C > A, D > C → श्रृंखला: D > C > A > B → सबसे बड़ा = D, सबसे छोटा = B' } },
      { text: { en: 'Rank from bottom formula: Rank from bottom = (Total + 1) – Rank from top', hi: 'नीचे से रैंक का सूत्र: नीचे से रैंक = (कुल + 1) – ऊपर से रैंक' }, example: { en: 'Class of 30, Riya is 8th from top → 30 + 1 - 8 = 23rd from bottom', hi: '30 का वर्ग, रिया ऊपर से 8वीं → 30 + 1 - 8 = नीचे से 23वीं' } },
      { text: { en: 'For "position in a row" problems: positions from right = (Total + 1) – position from left', hi: '"पंक्ति में स्थिति" प्रश्नों के लिए: दाईं से = (कुल + 1) – बाईं से स्थिति' }, example: { en: 'Row of 40, Arjun is 15th from left → from right = 40 + 1 - 15 = 26th', hi: '40 की पंक्ति, अर्जुन बाईं से 15वां → दाईं से = 40 + 1 - 15 = 26वां' } },
    ],
    whyItWorks: {
      en: 'These are essentially constraint satisfaction problems — the same logic used in AI scheduling (who can meet when), database indexing (what rank does this record hold?), and tournament seeding. Writing the inequality chain converts a confusing verbal puzzle into a clear ordered list you can simply read.',
      hi: 'ये मूलतः बाधा-संतुष्टि समस्याएँ हैं — वही तर्क जो AI शेड्यूलिंग, डेटाबेस इंडेक्सिंग और टूर्नामेंट सीडिंग में उपयोग होता है।',
    },
    example: {
      title: { en: 'A scores more than B. C > D. D > A. Who scores least?', hi: 'A, B से ज़्यादा स्कोर करता है। C > D. D > A. सबसे कम कौन?' },
      lines: [
        { en: 'Chain all clues: C > D > A > B', hi: 'सभी सुराग जोड़ें: C > D > A > B' },
        { en: 'The last in the chain scores least', hi: 'श्रृंखला में अंतिम सबसे कम स्कोर करता है' },
      ],
      result: { en: 'Answer: B ✓', hi: 'उत्तर: B ✓' },
    },
    commonMistake: {
      en: 'When the question says "cannot determine," students force an answer anyway. Practice recognising when information is genuinely insufficient — this is tested in competitive exams specifically to catch students who over-commit to an answer.',
      hi: 'जब प्रश्न "निर्धारित नहीं किया जा सकता" कहता है, तो छात्र फिर भी उत्तर देने की कोशिश करते हैं। पहचानना सीखें कि कब जानकारी वास्तव में अपर्याप्त है।',
    },
    realWorld: {
      en: 'Sports rankings, search engine results ordering, stock market price sorting, university merit lists — all of these are the same problem: building an ordered sequence from a set of comparison rules.',
      hi: 'खेल रैंकिंग, सर्च इंजन परिणाम क्रम, शेयर बाजार मूल्य सॉर्टिंग, विश्वविद्यालय मेरिट सूची — ये सभी एक ही समस्या हैं।',
    },
  },

  {
    id: 'direction-l2',
    order: 5,
    title: { en: 'Direction Sense', hi: 'दिशा ज्ञान' },
    subtitle: { en: 'Distance Calculation & Multi-Turn', hi: 'दूरी गणना और बहु-मोड़' },
    origin: {
      en: 'Level 2 direction problems add distance calculation — you need to figure out not just which direction someone ends up facing, but how far they are from their starting point. This requires the Pythagorean theorem for right-angle paths and careful cancellation of opposite movements.',
      hi: 'स्तर 2 की दिशा समस्याओं में दूरी गणना जुड़ जाती है — यह नहीं, बल्कि यह भी पता लगाना होता है कि कोई शुरुआती बिंदु से कितनी दूर है। इसके लिए समकोण पथों के लिए पाइथागोरस प्रमेय और विपरीत गतिविधियों को रद्द करना आवश्यक है।',
    },
    steps: [
      { text: { en: 'Draw the path on paper (even a rough sketch) — never do direction problems in your head', hi: 'कागज़ पर रास्ता बनाएं (मोटा चित्र भी काम करेगा) — दिशा समस्याएँ मन में कभी न करें' }, example: { en: '10m North, turn right, 5m East, turn right, 10m South → you\'re 5m East of start', hi: '10m उत्तर, दाएं मुड़ें, 5m पूर्व, दाएं मुड़ें, 10m दक्षिण → आप शुरू से 5m पूर्व हैं' } },
      { text: { en: 'Cancel opposite movements (North/South cancel, East/West cancel)', hi: 'विपरीत गतिविधियाँ रद्द करें (उत्तर/दक्षिण रद्द, पूर्व/पश्चिम रद्द)' }, example: { en: '10m N and 10m S cancel out → net displacement = 0 in N-S direction', hi: '10m उ और 10m द रद्द → N-S दिशा में शुद्ध विस्थापन = 0' } },
      { text: { en: 'Use Pythagoras when left with two perpendicular distances: √(a² + b²)', hi: 'जब दो लंबवत दूरियाँ बचें तो पाइथागोरस का उपयोग करें: √(a² + b²)' }, example: { en: '4m West + 3m South → distance = √(4² + 3²) = √(16+9) = √25 = 5m', hi: '4m पश्चिम + 3m दक्षिण → दूरी = √(4² + 3²) = √25 = 5m' } },
    ],
    whyItWorks: {
      en: 'This is vector addition — the same mathematics that GPS systems, robotics navigation, and aircraft auto-pilots use. The "cancel opposite directions" step is literally how engineers calculate net displacement. Pythagorean distance is the most important formula in 2D geometry.',
      hi: 'यह सदिश योग है — वही गणित जो GPS सिस्टम, रोबोटिक्स नेविगेशन और विमान ऑटो-पायलट उपयोग करते हैं।',
    },
    example: {
      title: { en: 'Walk 4m West, 3m South. Distance from start?', hi: '4m पश्चिम चलें, 3m दक्षिण। शुरू से दूरी?' },
      lines: [
        { en: 'Two perpendicular movements: 4m West, 3m South', hi: 'दो लंबवत गतिविधियाँ: 4m पश्चिम, 3m दक्षिण' },
        { en: 'Straight-line distance = √(4² + 3²) = √(16 + 9) = √25 = 5m', hi: 'सीधी दूरी = √(4² + 3²) = √(16 + 9) = √25 = 5m' },
      ],
      result: { en: 'Answer: 5m ✓ (classic 3-4-5 right triangle)', hi: 'उत्तर: 5m ✓ (प्रसिद्ध 3-4-5 समकोण त्रिभुज)' },
    },
    commonMistake: {
      en: 'Students add all distances together (4+3=7) instead of using Pythagoras. Always check whether the two remaining movements are perpendicular — if they are, you MUST use √(a²+b²), not a+b.',
      hi: 'छात्र पाइथागोरस के बजाय सभी दूरियाँ जोड़ देते हैं (4+3=7)। हमेशा जांचें कि क्या दो शेष गतिविधियाँ लंबवत हैं — यदि हैं, तो √(a²+b²) उपयोग करें, a+b नहीं।',
    },
    realWorld: {
      en: 'Every drone delivery route, every robot arm movement, every ship navigation calculation uses this exact logic: separate movements into N-S and E-W components, cancel opposites, use Pythagoras for the final distance.',
      hi: 'हर ड्रोन डिलीवरी मार्ग, हर रोबोट आर्म मूवमेंट, हर जहाज नेविगेशन गणना इसी तर्क का उपयोग करती है।',
    },
  },

  {
    id: 'coding-decoding-l2',
    order: 6,
    title: { en: 'Coding-Decoding', hi: 'कोडिंग-डिकोडिंग' },
    subtitle: { en: 'Number Codes & Position Logic', hi: 'संख्या कोड और स्थिति तर्क' },
    origin: {
      en: 'Level 2 coding-decoding introduces number-based codes (A=1, B=2...) and position-shift alternating rules. These are direct precursors to real cryptography — the Caesar cipher that Julius Caesar used to send military messages is exactly a "+N shift" coding rule.',
      hi: 'स्तर 2 की कोडिंग-डिकोडिंग में संख्या-आधारित कोड (A=1, B=2...) और स्थिति-शिफ्ट वैकल्पिक नियम आते हैं। ये वास्तविक क्रिप्टोग्राफी के प्रत्यक्ष अग्रदूत हैं।',
    },
    steps: [
      { text: { en: 'For letter→number codes: always establish A=1, B=2... Z=26 first', hi: 'अक्षर→संख्या कोड के लिए: पहले A=1, B=2... Z=26 स्थापित करें' }, example: { en: 'WATER = 23-1-20-5-18 (W=23, A=1, T=20, E=5, R=18)', hi: 'WATER = 23-1-20-5-18 (W=23, A=1, T=20, E=5, R=18)' } },
      { text: { en: 'For shift codes: test the first 2-3 letters to find the shift rule', hi: 'शिफ्ट कोड के लिए: पहले 2-3 अक्षरों पर शिफ्ट नियम जाँचें' }, example: { en: 'FRIEND → GSJFOE: F+1=G, R+1=S, I+1=J, E+1=F, N+1=O, D+1=E ✓', hi: 'FRIEND → GSJFOE: F+1=G, R+1=S, I+1=J, E+1=F, N+1=O, D+1=E ✓' } },
      { text: { en: 'For alternating shift: odd positions shift one way, even positions shift another', hi: 'वैकल्पिक शिफ्ट के लिए: विषम स्थान एक तरफ शिफ्ट, सम स्थान दूसरी तरफ' }, example: { en: 'MAN → NZO: position 1 M+1 = N, position 2 A−1 = Z (wrapping back from A), position 3 N+1 = O', hi: 'MAN: स्थिति 1,3,5... को +1 करें, 2,4,6... को -1 — नियम को सावधानी से जाँचें' } },
    ],
    whyItWorks: {
      en: 'Every password you use online, every HTTPS connection in your browser, every UPI payment — all rely on encoding logic far more complex than what you\'re practising here, but built on exactly the same foundation: "replace each symbol with another according to a fixed rule." Caesar cipher → modern AES encryption. Same idea, vastly more steps.',
      hi: 'आपका हर ऑनलाइन पासवर्ड, हर HTTPS कनेक्शन, हर UPI भुगतान — सभी यहाँ से कहीं अधिक जटिल एन्कोडिंग तर्क पर निर्भर हैं, लेकिन उसी नींव पर बने हैं।',
    },
    example: {
      title: { en: 'If COME = BNLD (each letter -1), how is GOLD coded?', hi: 'अगर COME = BNLD (प्रत्येक अक्षर -1), तो GOLD कैसे कोड होगा?' },
      lines: [
        { en: 'G-1=F, O-1=N, L-1=K, D-1=C', hi: 'G-1=F, O-1=N, L-1=K, D-1=C' },
        { en: 'GOLD → FNKC', hi: 'GOLD → FNKC' },
      ],
      result: { en: 'Answer: FNKC ✓', hi: 'उत्तर: FNKC ✓' },
    },
    commonMistake: {
      en: 'Forgetting that after Z comes A (or before A comes Z) in circular shift codes. Also, always VERIFY the rule on 2 letters before applying to all — a wrong rule assumption leads to a confidently wrong answer.',
      hi: 'चक्रीय शिफ्ट कोड में Z के बाद A आना (या A से पहले Z) भूल जाना। साथ ही, सभी पर लागू करने से पहले 2 अक्षरों पर नियम सत्यापित करें।',
    },
    realWorld: {
      en: 'QR codes, bar codes, ISBN numbers on books, SWIFT codes for bank transfers — all of these encode information using position-based rules. Understanding coding logic demystifies the "magic" of how digital systems store and transmit information.',
      hi: 'QR कोड, बार कोड, किताबों पर ISBN नंबर, बैंक ट्रांसफर के SWIFT कोड — ये सभी स्थिति-आधारित नियमों का उपयोग करके जानकारी एन्कोड करते हैं।',
    },
  },

  {
    id: 'calendar-l2',
    order: 7,
    title: { en: 'Calendar Problems', hi: 'कैलेंडर समस्याएं' },
    subtitle: { en: 'Day Calculation & Odd Days', hi: 'दिन गणना और विषम दिन' },
    origin: {
      en: 'Level 2 calendar problems introduce the "odd days" concept used in competitive exams to find the day for any past or future date. One odd day = 1 extra day beyond complete weeks. A normal year has 1 odd day (365 = 52×7 + 1), a leap year has 2.',
      hi: 'स्तर 2 की कैलेंडर समस्याओं में "विषम दिन" की अवधारणा आती है जो किसी भी अतीत या भविष्य की तिथि का दिन खोजने के लिए उपयोग होती है। एक विषम दिन = पूर्ण सप्ताहों से परे 1 अतिरिक्त दिन।',
    },
    steps: [
      { text: { en: 'Odd days in a normal year = 1. In a leap year = 2. In a century = 5.', hi: 'सामान्य वर्ष में विषम दिन = 1। लीप वर्ष में = 2। सदी में = 5।' }, example: { en: '365 = 52 weeks + 1 day → 1 odd day per normal year', hi: '365 = 52 सप्ताह + 1 दिन → सामान्य वर्ष में 1 विषम दिन' } },
      { text: { en: 'To find day N days from today: add N to the current day number (Sun=0, Mon=1...) and take mod 7', hi: 'आज से N दिन बाद का दिन खोजने के लिए: N को वर्तमान दिन संख्या में जोड़ें और mod 7 लें' }, example: { en: '45 days from Thursday: 45 = 6×7 + 3, so 42 of those days are whole weeks and land back on Thursday. The remaining 3 days shift it Thu → Fri → Sat → Sun. Answer: Sunday', hi: 'गुरुवार = 4। 45 दिनों में: 45 mod 7 = 3, गुरुवार से 3 दिन बाद = रविवार' } },
      { text: { en: 'Count Sundays in a month: if the 1st is Saturday, count how many Sundays fall in 31 days', hi: 'महीने में रविवार गिनें: अगर 1 तारीख शनिवार है, 31 दिनों में रविवार कितने होंगे' }, example: { en: 'Oct 1 = Sat, so Oct 2,9,16,23,30 are Sundays = 5 Sundays', hi: 'अक्टूबर 1 = शनिवार, तो 2,9,16,23,30 = रविवार = 5 रविवार' } },
    ],
    whyItWorks: {
      en: 'The mod-7 operation is the foundation of all cyclical scheduling — shift rotations, maintenance schedules, fiscal quarter calculations, even the algorithm that tells your phone what day of the week a given date falls on. The calendar problem is really modular arithmetic in disguise.',
      hi: 'mod-7 ऑपरेशन सभी चक्रीय शेड्यूलिंग की नींव है — शिफ्ट रोटेशन, रखरखाव कार्यक्रम, वित्तीय तिमाही गणना।',
    },
    example: {
      title: { en: 'October 1st is Saturday. How many Sundays in October?', hi: 'अक्टूबर 1 शनिवार है। अक्टूबर में कितने रविवार?' },
      lines: [
        { en: 'Oct 1 = Sat, so Oct 2 = Sunday (first Sunday)', hi: 'अक्टू 1 = शनि, अक्टू 2 = रवि (पहला रविवार)' },
        { en: 'Sundays: 2, 9, 16, 23, 30 → that is 5 Sundays in a 31-day month', hi: 'रविवार: 2, 9, 16, 23, 30 → 31 दिनों में 5 रविवार' },
      ],
      result: { en: 'Answer: 5 ✓', hi: 'उत्तर: 5 ✓' },
    },
    commonMistake: {
      en: 'Confusing "odd days" (a specific technical term in calendar arithmetic) with "odd-numbered days" (1st, 3rd, 5th...). In calendar problems, "odd days" = extra days beyond complete weeks. This trips up almost every student the first time.',
      hi: '"विषम दिन" (कैलेंडर अंकगणित में एक विशिष्ट तकनीकी शब्द) को "विषम-संख्या वाले दिन" (1, 3, 5...) से भ्रमित करना।',
    },
    realWorld: {
      en: 'Every calendar app on every phone uses this logic. When you ask "what day is Christmas this year?" your phone runs exactly this algorithm — add days from a known reference date, take mod 7, look up the day name.',
      hi: 'हर फोन का हर कैलेंडर ऐप इसी तर्क का उपयोग करता है। जब आप पूछते हैं "इस साल क्रिसमस किस दिन है?" आपका फोन ठीक यही एल्गोरिदम चलाता है।',
    },
  },

  {
    id: 'pattern-completion-l2',
    order: 8,
    title: { en: 'Pattern Completion', hi: 'पैटर्न पूर्णता' },
    subtitle: { en: 'Rule-Based & Number Grid Patterns', hi: 'नियम-आधारित और संख्या ग्रिड पैटर्न' },
    origin: {
      en: 'Level 2 patterns involve Pascal\'s Triangle (each number = sum of two above it), alternating grid patterns, and sequences built from two alternating rules (+2, ×2, +2, ×2...). These appear in matrix reasoning questions in IQ tests and in actual computer graphics algorithms.',
      hi: 'स्तर 2 के पैटर्न में पास्कल त्रिभुज (प्रत्येक संख्या = उसके ऊपर की दो संख्याओं का योग), वैकल्पिक ग्रिड पैटर्न, और दो वैकल्पिक नियमों से बनी श्रृंखलाएँ शामिल हैं।',
    },
    steps: [
      { text: { en: 'For two-rule patterns: label each step as Rule A or Rule B and track both', hi: 'दो-नियम पैटर्न के लिए: प्रत्येक चरण को नियम A या B के रूप में लेबल करें' }, example: { en: 'Take 1, 3, 6, 8, ? — 1→3 (+2 = Rule A), 3→6 (×2 = Rule B), 6→8 (+2 = A). The rules alternate, so the next step is Rule B: 8×2 = 16', hi: '1→3 (+2 = नियम A), 3→6 (×2 = नियम B), 6→8 (+2 = A), 8→? (×2 = B) = 16 ✓' } },
      { text: { en: 'For Pascal\'s Triangle: row N sum = 2^(N-1). Row 5 sum = 2^4 = 16', hi: 'पास्कल त्रिभुज के लिए: पंक्ति N का योग = 2^(N-1)। पंक्ति 5 का योग = 2^4 = 16' }, example: { en: 'Row 1:1, Row 2:1+1=2, Row 3:1+2+1=4, Row 4:1+3+3+1=8, Row 5:1+4+6+4+1=16', hi: 'पंक्ति 1:1, 2:2, 3:4, 4:8, 5:16 — हर बार दोगुना' } },
      { text: { en: 'For grid patterns, check if rows are mirror/inverse of adjacent rows', hi: 'ग्रिड पैटर्न के लिए, जांचें कि क्या पंक्तियाँ निकटवर्ती पंक्तियों की दर्पण/व्युत्क्रम हैं' }, example: { en: 'Row 1: ■□■□, Row 2: □■□■ (inverted), Row 3: ■□■□ (same as Row 1) → Row 4: □■□■', hi: 'पंक्ति 1: ■□■□, पंक्ति 2: □■□■ (उल्टी), पंक्ति 3: ■□■□ → पंक्ति 4: □■□■' } },
    ],
    whyItWorks: {
      en: 'Pascal\'s Triangle appears in probability (coin flip outcomes), algebra (binomial expansion), and computer science (combinations). Alternating-rule sequences are how digital signals work (on/off switching). Grid patterns underlie pixel art, QR codes, and matrix mathematics.',
      hi: 'पास्कल त्रिभुज प्रायिकता (सिक्का उछाल परिणाम), बीजगणित (द्विपद विस्तार) और कंप्यूटर साइंस (संयोजन) में प्रकट होता है।',
    },
    example: {
      title: { en: 'What is the sum of the 5th row of Pascal\'s Triangle?', hi: 'पास्कल त्रिभुज की 5वीं पंक्ति का योग क्या है?' },
      lines: [
        { en: 'Row 5: 1, 4, 6, 4, 1', hi: 'पंक्ति 5: 1, 4, 6, 4, 1' },
        { en: 'Sum = 1+4+6+4+1 = 16. Also: 2^(5-1) = 2^4 = 16', hi: 'योग = 1+4+6+4+1 = 16. साथ ही: 2^4 = 16' },
      ],
      result: { en: 'Answer: 16 ✓', hi: 'उत्तर: 16 ✓' },
    },
    commonMistake: {
      en: 'For two-rule alternating patterns, students often assume the same rule applies throughout. Always test the FIRST rule on step 1→2, then a DIFFERENT rule on 2→3, and confirm the pattern alternates before applying it.',
      hi: 'दो-नियम वैकल्पिक पैटर्न के लिए, छात्र अक्सर मान लेते हैं कि एक ही नियम लागू होता है। हमेशा चरण 1→2 पर पहला नियम जांचें, फिर 2→3 पर भिन्न नियम।',
    },
    realWorld: {
      en: 'Image compression algorithms, game level generation, and fabric weaving patterns all rely on the same principle: a simple repeating or alternating rule generates complex visual results. Recognising the underlying rule = ability to predict or replicate any pattern.',
      hi: 'छवि संपीड़न एल्गोरिदम, गेम स्तर निर्माण, और कपड़ा बुनाई पैटर्न सभी एक ही सिद्धांत पर निर्भर हैं।',
    },
  },

  {
    id: 'blood-relations-l2',
    order: 9,
    title: { en: 'Blood Relations', hi: 'रक्त संबंध' },
    subtitle: { en: 'Multi-Step Chains & Coded Relations', hi: 'बहु-चरण श्रृंखला और कोडित संबंध' },
    origin: {
      en: 'Level 2 blood relation problems use coded language (A + B means A is the father of B) or multi-step chains requiring 3–4 relationship jumps. These are standard "hard" questions in SSC, Banking, and UPSC reasoning sections.',
      hi: 'स्तर 2 की रक्त संबंध समस्याओं में कोडित भाषा (A + B का अर्थ A, B का पिता है) या 3-4 संबंध छलांग की आवश्यकता वाली बहु-चरण श्रृंखलाएँ होती हैं।',
    },
    steps: [
      { text: { en: 'Always draw a family tree diagram — never solve blood relations purely in your head', hi: 'हमेशा परिवार वृक्ष आरेख बनाएं — रक्त संबंध कभी भी सिर्फ मन में न करें' }, example: { en: '"His mother is the only daughter of my mother" → draw: [My mother] → [only daughter = Me?] → [son of this daughter = He] → I am his mother', hi: '"उसकी माँ मेरी माँ की इकलौती बेटी है" → आरेख: [मेरी माँ] → [इकलौती बेटी = मैं] → [इस बेटी का बेटा = वह] → मैं उसकी माँ हूँ' } },
      { text: { en: 'For coded relations (A+B, A-B): decode each symbol first, then build the chain', hi: 'कोडित संबंधों के लिए (A+B, A-B): पहले प्रत्येक प्रतीक को डिकोड करें, फिर श्रृंखला बनाएं' }, example: { en: 'P + Q means P is father of Q. Q – R means Q is mother of R. So P+Q–R: P is father of Q, Q is mother of R → P is grandfather of R', hi: 'P + Q = P, Q का पिता। Q – R = Q, R की माँ। तो P → Q → R: P, R का दादा है' } },
      { text: { en: 'Always note the gender when stated — it changes "uncle/aunt" and "nephew/niece"', hi: 'जब बताया जाए तो लिंग हमेशा नोट करें — यह "चाचा/चाची" और "भांजा/भांजी" बदलता है' }, example: { en: 'My mother\'s brother\'s son = my cousin (male). My mother\'s brother\'s daughter = my cousin (female)', hi: 'मेरी माँ के भाई का बेटा = मेरा चचेरा भाई। मेरी माँ के भाई की बेटी = मेरी चचेरी बहन' } },
    ],
    whyItWorks: {
      en: 'Blood relation problems are graph traversal problems in disguise — each person is a node, each relationship is an edge. Computer scientists use the same structure to represent social networks, dependency trees, and inheritance hierarchies in software. Drawing the family tree IS drawing a directed graph.',
      hi: 'रक्त संबंध समस्याएँ छिपी हुई ग्राफ ट्रैवर्सल समस्याएँ हैं — प्रत्येक व्यक्ति एक नोड है, प्रत्येक संबंध एक किनारा।',
    },
    example: {
      title: { en: 'P + Q – R: how is P related to R?', hi: 'P + Q – R: P, R से कैसे संबंधित है?' },
      lines: [
        { en: 'P + Q = P is father of Q', hi: 'P + Q = P, Q का पिता है' },
        { en: 'Q – R = Q is mother of R → Q is female', hi: 'Q – R = Q, R की माँ है → Q महिला है' },
        { en: 'P is father of Q, Q is mother of R → P is maternal grandfather of R', hi: 'P, Q का पिता; Q, R की माँ → P, R का नाना है' },
      ],
      result: { en: 'Answer: Grandfather ✓', hi: 'उत्तर: दादा/नाना ✓' },
    },
    commonMistake: {
      en: '"Only daughter of my mother" — students often think this means someone ELSE\'s daughter, when "only daughter" means the speaker herself. Re-read carefully: who is "my mother\'s only daughter"? It\'s the speaker!',
      hi: '"मेरी माँ की इकलौती बेटी" — छात्र अक्सर सोचते हैं यह किसी और की बेटी है, जबकि "इकलौती बेटी" मतलब वक्ता खुद है।',
    },
    realWorld: {
      en: 'DNA genealogy testing, inheritance law (who inherits what from whom), government family pension eligibility, and hospital emergency contacts — all require systematically tracing multi-step family relationships, exactly what these problems train.',
      hi: 'DNA वंशावली परीक्षण, उत्तराधिकार कानून, सरकारी पारिवारिक पेंशन पात्रता — सभी के लिए बहु-चरण पारिवारिक संबंधों का पता लगाना आवश्यक है।',
    },
  },

  {
    id: 'mirror-images-l2',
    order: 10,
    title: { en: 'Mirror Images', hi: 'दर्पण प्रतिबिम्ब' },
    subtitle: { en: 'Clock Reflections & Symmetry Logic', hi: 'घड़ी प्रतिबिम्ब और सममिति तर्क' },
    origin: {
      en: 'Level 2 mirror image problems introduce clock face reflections — a favourite in SSC and banking exams. The formula: Mirror time = 11:60 minus original time. Also: identifying which words, numbers, or shapes are symmetric enough to look the same in a mirror.',
      hi: 'स्तर 2 की दर्पण प्रतिबिम्ब समस्याओं में घड़ी की सतह का प्रतिबिम्ब आता है — SSC और बैंकिंग परीक्षाओं में यह पसंदीदा है। सूत्र: दर्पण समय = 11:60 माइनस मूल समय।',
    },
    steps: [
      { text: { en: 'Clock mirror formula: Mirror time = 11 hours 60 minutes – original time', hi: 'घड़ी दर्पण सूत्र: दर्पण समय = 11 घंटे 60 मिनट – मूल समय' }, example: { en: 'Original: 3:40 → 11:60 – 3:40 = 8:20', hi: 'मूल: 3:40 → 11:60 – 3:40 = 8:20' } },
      { text: { en: 'For numbers/letters: a symbol is the same in a mirror only if it has LEFT-RIGHT symmetry', hi: 'संख्याओं/अक्षरों के लिए: कोई प्रतीक दर्पण में तभी समान होता है जब उसमें बाएं-दाएं सममिति हो' }, example: { en: 'A has left-right symmetry (both sides match). B, C, D do not (they "open" to the right)', hi: 'A में बाएं-दाएं सममिति है। B, C, D में नहीं (वे दाईं ओर "खुलते" हैं)' } },
      { text: { en: 'For words: check each letter individually — the word looks the same only if ALL its letters are symmetric', hi: 'शब्दों के लिए: प्रत्येक अक्षर अलग से जांचें — शब्द तभी समान दिखेगा जब उसके सभी अक्षर सममित हों' }, example: { en: 'AHA: A is symmetric, H is symmetric, A is symmetric → AHA looks the same in a mirror ✓', hi: 'AHA: A सममित, H सममित, A सममित → AHA दर्पण में समान दिखता है ✓' } },
    ],
    whyItWorks: {
      en: 'The clock mirror formula works because a mirror effectively "subtracts" your clock position from the total 12-hour cycle. This is the same mathematics as "complement" operations in digital electronics. Symmetry is the core concept in crystallography, molecular biology (DNA helix), and architecture.',
      hi: 'घड़ी दर्पण सूत्र काम करता है क्योंकि दर्पण प्रभावी रूप से आपकी घड़ी की स्थिति को कुल 12-घंटे के चक्र से "घटाता" है।',
    },
    example: {
      title: { en: 'Clock shows 9:15. What does the mirror show?', hi: 'घड़ी 9:15 दिखाती है। दर्पण क्या दिखाएगा?' },
      lines: [
        { en: '11:60 – 9:15 = 2:45', hi: '11:60 – 9:15 = 2:45' },
        { en: 'Mirror of 9:15 = 2:45', hi: '9:15 का दर्पण = 2:45' },
      ],
      result: { en: 'Answer: 2:45 ✓', hi: 'उत्तर: 2:45 ✓' },
    },
    commonMistake: {
      en: 'Students try to "visualise" the mirror clock instead of using the formula, and get it wrong about 70% of the time. Always use 11:60 – original time. If the minutes of the original > 60 minutes somehow, use 12:60 instead of 11:60, but this is rare.',
      hi: 'छात्र सूत्र का उपयोग करने के बजाय दर्पण घड़ी को "कल्पना" करने की कोशिश करते हैं, और लगभग 70% समय गलत हो जाते हैं। हमेशा 11:60 – मूल समय का उपयोग करें।',
    },
    realWorld: {
      en: 'Ambulance vehicles have "AMBULANCE" written in mirror script so drivers can read it correctly in their rear-view mirror. Surgeons reading X-rays must mentally "flip" the image. Printing plates are mirror images of the final print. Mirror symmetry is literally everywhere in manufacturing and medicine.',
      hi: 'एम्बुलेंस पर "AMBULANCE" दर्पण लिपि में लिखा होता है ताकि ड्राइवर इसे रियर-व्यू मिरर में सही पढ़ सकें। X-ray पढ़ते समय सर्जनों को मानसिक रूप से छवि "पलटनी" होती है।',
    },
  },
];

export function getLevel2ChapterContent(chapterId) {
  return RA_LEVEL2_CHAPTERS.find((c) => c.id === chapterId) || null;
}
