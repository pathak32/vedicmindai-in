// Reasoning & Aptitude — Level 1 (Beginner) — Deep Content
// One entry per chapter, matching chapter ids in reasoningAptitudeLevel1.js.
// Every text field is bilingual { en, hi } and consumed via ConceptTab's
// OriginBox / WhyItWorksBox / CommonMistakeBox / RealWorldBox / StepBox /
// ExampleCard components, which already know how to pick the active language.

export const RA_LEVEL1_CHAPTERS = [
  {
    id: 'odd-one-out',
    order: 1,
    title: { en: 'Odd One Out', hi: 'विषम को पहचानें' },
    subtitle: { en: 'Classification', hi: 'वर्गीकरण' },
    origin: {
      en: 'Classification is one of the oldest reasoning skills humans developed — long before formal schooling, our ancestors needed to quickly sort "safe to eat" from "not safe," or "predator" from "not predator." Odd-One-Out puzzles are a modern, playful version of that exact same mental skill: spotting what doesn\'t belong to a group.',
      hi: 'वर्गीकरण इंसानों के सबसे पुराने तर्क-कौशलों में से एक है — स्कूली शिक्षा शुरू होने से बहुत पहले, हमारे पूर्वजों को जल्दी से यह पहचानना पड़ता था कि क्या "खाने के लिए सुरक्षित" है और क्या नहीं, या कौन "शिकारी" है और कौन नहीं। विषम-को-पहचानें पहेलियाँ उसी मानसिक कौशल का एक आधुनिक, मज़ेदार रूप हैं — यह पहचानना कि समूह में कौन सा हिस्सा फिट नहीं बैठता।',
    },
    steps: [
      { text: { en: "Look at all the items first — don't jump to an answer immediately", hi: 'पहले सभी वस्तुओं को देखें — तुरंत उत्तर पर मत कूदें' }, example: { en: 'Apple, Banana, Carrot, Mango', hi: 'सेब, केला, गाजर, आम' } },
      { text: { en: 'Ask: what do MOST of these items have in common?', hi: 'पूछें: इनमें से ज़्यादातर वस्तुओं में क्या समान है?' }, example: { en: 'Apple, Banana, Mango are all fruits', hi: 'सेब, केला, आम — सभी फल हैं' } },
      { text: { en: 'The item that breaks that shared pattern is the odd one out', hi: 'जो वस्तु इस साझा पैटर्न को तोड़ती है, वही विषम है' }, example: { en: "Carrot is a vegetable, not a fruit → that's the answer", hi: 'गाजर एक सब्ज़ी है, फल नहीं → यही उत्तर है' } },
    ],
    whyItWorks: {
      en: "This isn't just a party trick — it's literally the foundation of how categories and definitions work in every subject, from biology (classifying species) to computer science (data types). Learning to instantly spot \"what makes this group similar, and what breaks it\" is a transferable skill you'll use in science classification, grammar (odd word out), and everyday decision-making.",
      hi: 'यह सिर्फ एक खेल नहीं है — यह हर विषय में श्रेणियों और परिभाषाओं के काम करने की नींव है, चाहे वह जीव विज्ञान (प्रजातियों का वर्गीकरण) हो या कंप्यूटर साइंस (डेटा टाइप्स)। "इस समूह को समान क्या बनाता है, और कौन इसे तोड़ता है" — यह तुरंत पहचानना विज्ञान वर्गीकरण, व्याकरण (विषम शब्द) और रोज़मर्रा के फैसलों में काम आने वाला हुनर है।',
    },
    example: {
      title: { en: 'Guitar, Violin, Flute, Football', hi: 'गिटार, वायलिन, बांसुरी, फुटबॉल' },
      lines: [
        { en: 'Guitar, Violin, and Flute are all musical instruments', hi: 'गिटार, वायलिन और बांसुरी — सभी संगीत वाद्ययंत्र हैं' },
        { en: 'Football is a sport, not an instrument', hi: 'फुटबॉल एक खेल है, वाद्ययंत्र नहीं' },
      ],
      result: { en: 'Answer: Football ✓', hi: 'उत्तर: फुटबॉल ✓' },
    },
    commonMistake: {
      en: 'Students often pick the item that "looks different" visually or is simply the last one they read, instead of actually checking what property connects the other three. Always find the shared rule FIRST, then check which item breaks it — don\'t guess by feel.',
      hi: 'छात्र अक्सर वह वस्तु चुन लेते हैं जो देखने में "अलग" लगे, या बस आखिरी में पढ़ी गई हो — बिना यह जांचे कि बाकी तीन में क्या समानता है। हमेशा पहले साझा नियम खोजें, फिर देखें कि कौन उसे तोड़ता है — अंदाज़े से मत चुनें।',
    },
    realWorld: {
      en: 'This exact skill shows up in real school science (classifying living things), in competitive exams (verbal reasoning sections), and in everyday life — like quickly noticing when something in a list, a bill, or a set of instructions doesn\'t fit and needs a second look.',
      hi: 'यही कौशल स्कूल विज्ञान (जीवों का वर्गीकरण), प्रतियोगी परीक्षाओं (मौखिक तर्क खंड) और रोज़मर्रा की ज़िंदगी में काम आता है — जैसे किसी लिस्ट, बिल या निर्देशों में कुछ गड़बड़ जल्दी पकड़ लेना।',
    },
  },

  {
    id: 'number-series-basic',
    order: 2,
    title: { en: 'Simple Number Series', hi: 'सरल संख्या श्रृंखला' },
    subtitle: { en: 'Pattern Recognition', hi: 'पैटर्न पहचान' },
    origin: {
      en: 'Number series puzzles trace back to how mathematicians first noticed that numbers in nature and counting often follow a hidden rule — like seasons repeating or a heartbeat keeping rhythm. Recognizing "what comes next" trains the brain to find order inside what looks like a random list of numbers.',
      hi: 'संख्या श्रृंखला पहेलियाँ उस समय से जुड़ी हैं जब गणितज्ञों ने पहली बार देखा कि प्रकृति और गिनती में संख्याएँ अक्सर एक छिपे नियम का पालन करती हैं — जैसे मौसमों का दोहराव या दिल की धड़कन की लय। "आगे क्या आएगा" पहचानना दिमाग को बेतरतीब दिखने वाली सूची में भी क्रम खोजना सिखाता है।',
    },
    steps: [
      { text: { en: 'Find the difference (or ratio) between the first two numbers', hi: 'पहली दो संख्याओं के बीच का अंतर (या अनुपात) निकालें' }, example: { en: '2, 4, 6, 8 → difference is +2', hi: '2, 4, 6, 8 → अंतर है +2' } },
      { text: { en: 'Check if the SAME rule applies to the next pairs too', hi: 'जांचें कि क्या यही नियम अगले जोड़ों पर भी लागू होता है' }, example: { en: '4→6 is +2, 6→8 is +2 too — confirmed', hi: '4→6 भी +2, 6→8 भी +2 — पुष्टि हो गई' } },
      { text: { en: 'Apply the same rule one more time to find the missing number', hi: 'गायब संख्या पाने के लिए वही नियम एक बार और लगाएं' }, example: { en: '8 + 2 = 10', hi: '8 + 2 = 10' } },
    ],
    whyItWorks: {
      en: 'Every number series has one underlying rule — addition, subtraction, multiplication, or a mix. Once you test the rule on two pairs and it holds true both times, it will hold for the rest of the series too. This is the same logic used in algebra, computer programming loops, and financial forecasting (like compound interest patterns).',
      hi: 'हर संख्या श्रृंखला में एक अंतर्निहित नियम होता है — जोड़, घटाव, गुणा, या मिश्रण। एक बार जब आप नियम को दो जोड़ों पर जांच लें और वह दोनों बार सही निकले, तो वही नियम पूरी श्रृंखला में चलेगा। यही तर्क बीजगणित, कंप्यूटर प्रोग्रामिंग लूप्स, और वित्तीय अनुमान (जैसे चक्रवृद्धि ब्याज पैटर्न) में इस्तेमाल होता है।',
    },
    example: {
      title: { en: '1, 2, 4, 8, ?', hi: '1, 2, 4, 8, ?' },
      lines: [
        { en: '1 → 2 is ×2', hi: '1 → 2 है ×2' },
        { en: '2 → 4 is ×2, 4 → 8 is ×2 too', hi: '2 → 4 भी ×2, 4 → 8 भी ×2' },
      ],
      result: { en: '8 × 2 = 16 ✓', hi: '8 × 2 = 16 ✓' },
    },
    commonMistake: {
      en: 'Students often guess based on only the first pair of numbers and stop checking. Always verify the rule on at least two consecutive pairs before applying it — some series look like addition at first but are actually multiplication or a mix of two alternating rules.',
      hi: 'छात्र अक्सर सिर्फ पहले जोड़े के आधार पर अंदाज़ा लगाकर रुक जाते हैं। नियम को लागू करने से पहले कम से कम दो लगातार जोड़ों पर ज़रूर जांचें — कुछ श्रृंखलाएँ पहली नज़र में जोड़ लगती हैं लेकिन असल में गुणा या दो बारी-बारी नियमों का मिश्रण होती हैं।',
    },
    realWorld: {
      en: 'Number series thinking is used in reading bank statements (spotting a recurring charge), tracking a savings goal, understanding EMI schedules, and in every competitive exam\'s quantitative aptitude section.',
      hi: 'संख्या श्रृंखला की सोच बैंक स्टेटमेंट पढ़ने (बार-बार लगने वाला चार्ज पकड़ना), बचत लक्ष्य ट्रैक करने, EMI शेड्यूल समझने, और हर प्रतियोगी परीक्षा के मात्रात्मक योग्यता खंड में काम आती है।',
    },
  },

  {
    id: 'analogies-basic',
    order: 3,
    title: { en: 'Basic Analogies', hi: 'मूल सादृश्य (Analogies)' },
    subtitle: { en: 'Relationship Mapping', hi: 'संबंध पहचान' },
    origin: {
      en: 'Analogy — "A is to B as C is to ?" — is one of the oldest tools in human reasoning, used since ancient Greek philosophy to explain new ideas by comparing them to familiar ones. It\'s also a core part of how IQ tests and verbal reasoning sections have measured relational thinking for over a century.',
      hi: 'सादृश्य — "A का B से वैसा ही संबंध है जैसा C का ? से" — मानव तर्क के सबसे पुराने औजारों में से एक है, जिसका इस्तेमाल प्राचीन यूनानी दर्शन से लेकर आज तक नई बातों को परिचित चीज़ों से जोड़कर समझाने में होता आया है। यह IQ टेस्ट और मौखिक तर्क खंडों का भी मूल हिस्सा रहा है।',
    },
    steps: [
      { text: { en: 'Figure out the exact relationship between the first pair', hi: 'पहले जोड़े के बीच का सटीक संबंध पहचानें' }, example: { en: 'Hand is to Glove → "Glove covers/protects the Hand"', hi: 'हाथ का दस्ताने से → "दस्ताना हाथ को ढकता/सुरक्षित करता है"' } },
      { text: { en: 'Apply the SAME relationship to the second pair', hi: 'यही संबंध दूसरे जोड़े पर लागू करें' }, example: { en: 'Foot is to ? → something that covers/protects the Foot', hi: 'पैर का ? से → जो पैर को ढके/सुरक्षित करे' } },
      { text: { en: 'Pick the option that fits that exact relationship, not just any related word', hi: 'वही उत्तर चुनें जो उसी संबंध में फिट बैठे, सिर्फ जुड़ा हुआ शब्द नहीं' }, example: { en: 'Shoe fits (covers the foot); Leg does not (that\'s part-of, not covering)', hi: 'जूता फिट बैठता है (पैर को ढकता है); टांग नहीं (वह हिस्सा है, ढकने वाला नहीं)' } },
    ],
    whyItWorks: {
      en: 'Analogies work because most relationships fall into a small set of types — part-to-whole, cause-to-effect, tool-to-user, category-to-member. Once you name the TYPE of relationship in words, applying it to a new pair becomes mechanical instead of a guess.',
      hi: 'सादृश्य इसलिए काम करते हैं क्योंकि ज़्यादातर संबंध कुछ गिने-चुने प्रकारों में आते हैं — भाग-से-पूर्ण, कारण-से-प्रभाव, औज़ार-से-उपयोगकर्ता, श्रेणी-से-सदस्य। एक बार जब आप संबंध के प्रकार को शब्दों में बता दें, तो नए जोड़े पर लागू करना अंदाज़े की बजाय एक तरीका बन जाता है।',
    },
    example: {
      title: { en: 'Doctor is to Hospital as Teacher is to ?', hi: 'डॉक्टर का अस्पताल से → शिक्षक का ? से' },
      lines: [
        { en: 'Doctor works at a Hospital', hi: 'डॉक्टर अस्पताल में काम करता है' },
        { en: 'A Teacher works at a School', hi: 'शिक्षक स्कूल में काम करता है' },
      ],
      result: { en: 'Answer: School ✓', hi: 'उत्तर: स्कूल ✓' },
    },
    commonMistake: {
      en: 'Students often pick a word that\'s just "related" in some vague way instead of matching the exact same relationship type. Book relates to Teacher too, but the relationship (workplace) is different from Doctor-Hospital — always name the relationship in a full sentence before picking an answer.',
      hi: 'छात्र अक्सर ऐसा शब्द चुन लेते हैं जो किसी न किसी तरह "जुड़ा" लगे, बिना यह जांचे कि संबंध बिल्कुल वैसा ही है या नहीं। किताब भी शिक्षक से जुड़ी है, पर वह संबंध (कार्यस्थल) डॉक्टर-अस्पताल जैसा नहीं है — उत्तर चुनने से पहले संबंध को पूरे वाक्य में बोलकर देखें।',
    },
    realWorld: {
      en: 'Analogical thinking is how we explain new concepts using familiar ones — "the heart is like a pump," "the internet is like a highway." It\'s used heavily in verbal reasoning sections of exams, and in everyday explanation and teaching.',
      hi: 'सादृश्य सोच से हम नई बातों को परिचित चीज़ों से जोड़कर समझते हैं — "दिल एक पंप की तरह है," "इंटरनेट एक हाईवे की तरह है।" यह परीक्षाओं के मौखिक तर्क खंडों में और रोज़मर्रा की समझाने-सिखाने की प्रक्रिया में बहुत काम आता है।',
    },
  },

  {
    id: 'ranking-ordering',
    order: 4,
    title: { en: 'Ranking & Ordering', hi: 'क्रम व स्थान (Ranking)' },
    subtitle: { en: 'Comparative Reasoning', hi: 'तुलनात्मक तर्क' },
    origin: {
      en: 'Ranking puzzles come from a very human need — comparing and ordering things, whether it\'s who\'s tallest in a family photo or who finished first in a race. Ancient trade and record-keeping systems needed ranking to settle disputes ("whose crop yield was highest"), and that same comparative logic is tested here.',
      hi: 'क्रम व स्थान की पहेलियाँ एक बहुत ही मानवीय ज़रूरत से आती हैं — चीज़ों की तुलना और क्रम तय करना, चाहे परिवार की फोटो में सबसे लंबा कौन हो या दौड़ में पहले कौन आया। प्राचीन व्यापार और लेखा-जोखा प्रणालियों में भी क्रम तय करना ज़रूरी था, और वही तुलनात्मक तर्क यहाँ परखा जाता है।',
    },
    steps: [
      { text: { en: 'Write down each comparison as a simple line, in order', hi: 'हर तुलना को एक सरल पंक्ति में क्रम से लिखें' }, example: { en: 'Rahul > Priya, Priya > Aman', hi: 'राहुल > प्रिया, प्रिया > अमन' } },
      { text: { en: 'Chain the comparisons together into one single line', hi: 'सभी तुलनाओं को एक ही श्रृंखला में जोड़ें' }, example: { en: 'Rahul > Priya > Aman', hi: 'राहुल > प्रिया > अमन' } },
      { text: { en: 'Read off the answer directly from the chain — leftmost is highest, rightmost is lowest', hi: 'श्रृंखला से सीधे उत्तर पढ़ें — सबसे बाईं ओर सबसे ऊँचा, सबसे दाईं ओर सबसे नीचा' }, example: { en: 'Shortest = Aman (rightmost)', hi: 'सबसे छोटा = अमन (सबसे दाईं ओर)' } },
    ],
    whyItWorks: {
      en: 'Two "greater than" statements that share a common name (like Priya appearing in both) can always be chained into one line, because "greater than" is transitive — if A > B and B > C, then A must be > C. This is the exact same rule used in sorting algorithms in computer science.',
      hi: 'दो "से बड़ा" कथन जिनमें एक साझा नाम हो (जैसे प्रिया दोनों में), हमेशा एक श्रृंखला में जोड़े जा सकते हैं, क्योंकि "से बड़ा" संक्रमणीय (transitive) होता है — अगर A > B और B > C, तो A ज़रूर C से बड़ा होगा। यही नियम कंप्यूटर विज्ञान के सॉर्टिंग एल्गोरिदम में भी इस्तेमाल होता है।',
    },
    example: {
      title: { en: 'A is older than B. C is older than A. Who is the oldest?', hi: 'A, B से बड़ा है। C, A से बड़ा है। सबसे बड़ा कौन है?' },
      lines: [
        { en: 'C > A and A > B', hi: 'C > A और A > B' },
        { en: 'Chain: C > A > B', hi: 'श्रृंखला: C > A > B' },
      ],
      result: { en: 'Answer: C is the oldest ✓', hi: 'उत्तर: C सबसे बड़ा है ✓' },
    },
    commonMistake: {
      en: 'Students often mix up the direction of comparison halfway through (forgetting whether "taller than" means the first or second name is on top). Always rewrite every clue using one consistent symbol (>) before chaining them, instead of solving in your head.',
      hi: 'छात्र अक्सर बीच में तुलना की दिशा भूल जाते हैं (यह भूल जाना कि "से लंबा" में पहला या दूसरा नाम ऊपर है)। हर सुराग को एक ही चिन्ह (>) में दोबारा लिखें, फिर श्रृंखला बनाएं — दिमाग में ही हल करने की कोशिश न करें।',
    },
    realWorld: {
      en: 'Ranking logic is used in leaderboards, exam merit lists, sports standings, and sorting search results — anywhere something needs to be ordered from best to worst based on multiple comparisons.',
      hi: 'क्रम व्यवस्था का उपयोग लीडरबोर्ड, परीक्षा मेरिट सूची, खेल की रैंकिंग, और खोज परिणामों को क्रमबद्ध करने में होता है — जहाँ भी कई तुलनाओं के आधार पर चीज़ों को सबसे अच्छे से सबसे कम क्रम में रखना हो।',
    },
  },

  {
    id: 'direction-basic',
    order: 5,
    title: { en: 'Direction Sense (Basic)', hi: 'दिशा ज्ञान (मूल)' },
    subtitle: { en: 'Spatial Reasoning', hi: 'स्थानिक तर्क' },
    origin: {
      en: 'Humans have used directions (North, South, East, West) for navigation for thousands of years — sailors, traders, and travelers all relied on direction sense before maps and GPS existed. Direction puzzles train the same mental compass your brain uses to picture movement in space.',
      hi: 'इंसान हज़ारों सालों से दिशाओं (उत्तर, दक्षिण, पूर्व, पश्चिम) का उपयोग रास्ता खोजने के लिए करते आए हैं — नाविक, व्यापारी और यात्री सभी नक्शों और GPS से पहले दिशा-ज्ञान पर निर्भर थे। दिशा पहेलियाँ उसी मानसिक दिशा-सूचक को प्रशिक्षित करती हैं जो दिमाग गति की कल्पना करने में इस्तेमाल करता है।',
    },
    steps: [
      { text: { en: 'Picture a simple compass in your head: North on top, East on the right', hi: 'दिमाग में एक सरल दिशा-सूचक की कल्पना करें: ऊपर उत्तर, दाईं ओर पूर्व' }, example: { en: 'N↑ E→ S↓ W←', hi: 'N↑ E→ S↓ W←' } },
      { text: { en: 'For "turn right," rotate 90° clockwise from your current direction', hi: '"दाएं मुड़ें" के लिए, मौजूदा दिशा से 90° घड़ी की दिशा में घूमें' }, example: { en: 'Facing North, turn right → now facing East', hi: 'उत्तर की ओर मुख करके दाएं मुड़ें → अब पूर्व की ओर' } },
      { text: { en: 'For "turn left," rotate 90° counter-clockwise instead', hi: '"बाएं मुड़ें" के लिए, 90° उल्टी घड़ी की दिशा में घूमें' }, example: { en: 'Facing East, turn left → now facing North', hi: 'पूर्व की ओर मुख करके बाएं मुड़ें → अब उत्तर की ओर' } },
    ],
    whyItWorks: {
      en: 'This works because direction changes are just rotations on a fixed compass — a right turn always moves you one position clockwise (N→E→S→W→N), and a left turn always moves you one position counter-clockwise. Once you memorize this one small compass wheel, every direction question becomes simple counting.',
      hi: 'यह इसलिए काम करता है क्योंकि दिशा बदलना एक तय दिशा-सूचक पर घूर्णन ही है — दायां मोड़ हमेशा एक स्थान घड़ी की दिशा में ले जाता है (N→E→S→W→N), और बायां मोड़ हमेशा उल्टी दिशा में। एक बार यह छोटा सा चक्र याद हो जाए, हर दिशा प्रश्न सिर्फ गिनती बन जाता है।',
    },
    example: {
      title: { en: 'Facing South, if you turn right, which direction do you face?', hi: 'दक्षिण की ओर मुख करके अगर आप दाएं मुड़ें, तो किस दिशा में मुख होगा?' },
      lines: [
        { en: 'Clockwise order: N → E → S → W → N', hi: 'घड़ी की दिशा में क्रम: N → E → S → W → N' },
        { en: 'One step clockwise from South is West', hi: 'दक्षिण से एक कदम घड़ी की दिशा में पश्चिम है' },
      ],
      result: { en: 'Answer: West ✓', hi: 'उत्तर: पश्चिम ✓' },
    },
    commonMistake: {
      en: 'Students often confuse their own left/right with map directions, especially when facing South or West (where "right" doesn\'t visually point toward the right side of a printed map). Always use the clockwise/counter-clockwise compass wheel instead of physically imagining left and right.',
      hi: 'छात्र अक्सर अपने खुद के बाएं/दाएं को नक्शे की दिशाओं से गड़बड़ा देते हैं, खासकर दक्षिण या पश्चिम की ओर मुख होने पर। शारीरिक रूप से बाएं-दाएं सोचने की बजाय हमेशा घड़ी की दिशा वाला चक्र इस्तेमाल करें।',
    },
    realWorld: {
      en: 'Direction sense is used in reading maps, giving and following directions, navigation apps, and understanding compass-based instructions in trekking, sailing, or even simple household directions like "the kitchen is to the east of the hall."',
      hi: 'दिशा-ज्ञान नक्शे पढ़ने, रास्ता बताने-समझने, नेविगेशन ऐप्स, और ट्रेकिंग, नौकायन या घर के भीतर दिशा-आधारित निर्देशों (जैसे "रसोई हॉल के पूर्व में है") में काम आता है।',
    },
  },

  {
    id: 'coding-decoding-basic',
    order: 6,
    title: { en: 'Basic Coding-Decoding', hi: 'मूल कोडिंग-डिकोडिंग' },
    subtitle: { en: 'Pattern Substitution', hi: 'पैटर्न प्रतिस्थापन' },
    origin: {
      en: 'Coding and decoding puzzles are a playful version of real cryptography — the ancient art of hiding messages, used by armies and spies for centuries (Julius Caesar famously shifted letters by a fixed number to send secret military messages). Every coding-decoding puzzle here follows that same "shift the letters" idea.',
      hi: 'कोडिंग-डिकोडिंग पहेलियाँ असली क्रिप्टोग्राफी (गुप्त-लेखन) का एक मज़ेदार रूप हैं — संदेश छिपाने की प्राचीन कला, जिसका उपयोग सेनाओं और जासूसों ने सदियों से किया है (जूलियस सीज़र अक्षरों को एक तय संख्या से खिसकाकर गुप्त सैन्य संदेश भेजते थे)। यहाँ हर कोडिंग-डिकोडिंग पहेली उसी "अक्षर खिसकाने" के विचार पर आधारित है।',
    },
    steps: [
      { text: { en: 'Write out the alphabet and find the shift between one real letter and its coded letter', hi: 'वर्णमाला लिखें और एक असली अक्षर व उसके कोडेड अक्षर के बीच का शिफ्ट पता करें' }, example: { en: 'C → D is a shift of +1', hi: 'C → D एक +1 का शिफ्ट है' } },
      { text: { en: 'Confirm the SAME shift works for the other letters in the word too', hi: 'जांचें कि यही शिफ्ट शब्द के बाकी अक्षरों पर भी काम करता है' }, example: { en: 'A→B (+1), T→U (+1) — confirmed, CAT → DBU', hi: 'A→B (+1), T→U (+1) — पुष्टि, CAT → DBU' } },
      { text: { en: 'Apply the same shift to every letter of the new word', hi: 'नए शब्द के हर अक्षर पर वही शिफ्ट लगाएं' }, example: { en: 'D+1=E, O+1=P, G+1=H → DOG becomes EPH', hi: 'D+1=E, O+1=P, G+1=H → DOG बनता है EPH' } },
    ],
    whyItWorks: {
      en: 'This works because these codes use a fixed, repeatable rule (usually shifting every letter by the same number of positions in the alphabet). Once you find that one number using a known example, it applies to every letter of every new word, exactly like a lock and key.',
      hi: 'यह इसलिए काम करता है क्योंकि ये कोड एक तय, दोहराए जाने वाले नियम का उपयोग करते हैं (आमतौर पर हर अक्षर को वर्णमाला में उतनी ही संख्या से खिसकाना)। एक बार जब आप किसी ज्ञात उदाहरण से वह संख्या निकाल लें, तो वह हर नए शब्द के हर अक्षर पर लागू होती है — बिल्कुल ताले-चाबी की तरह।',
    },
    example: {
      title: { en: 'If A=1, B=2, C=3, what does C-A-T spell as numbers?', hi: 'अगर A=1, B=2, C=3, तो C-A-T अंकों में क्या होगा?' },
      lines: [
        { en: 'C=3, A=1, T=20', hi: 'C=3, A=1, T=20' },
      ],
      result: { en: 'Answer: 3-1-20 ✓', hi: 'उत्तर: 3-1-20 ✓' },
    },
    commonMistake: {
      en: 'Students often assume every letter shifts by the same amount without checking a second letter to confirm — but some questions use a different code entirely (like reversing the alphabet, or a number-to-letter map). Always verify the rule on at least two letters before applying it to the whole word.',
      hi: 'छात्र अक्सर बिना दूसरे अक्षर से पुष्टि किए मान लेते हैं कि हर अक्षर उतना ही शिफ्ट होगा — लेकिन कुछ प्रश्नों में बिल्कुल अलग कोड होता है (जैसे वर्णमाला उल्टी करना, या संख्या-से-अक्षर मैपिंग)। पूरे शब्द पर लगाने से पहले कम से कम दो अक्षरों पर नियम जांच लें।',
    },
    realWorld: {
      en: 'The same shifting logic sits behind real-world password hints, simple encryption used in early computer science courses, and even how children invent "secret languages" by shifting letters when passing notes.',
      hi: 'यही खिसकाने वाला तर्क असल दुनिया के पासवर्ड संकेतों, शुरुआती कंप्यूटर विज्ञान पाठ्यक्रमों में सिखाई जाने वाली सरल एन्क्रिप्शन, और यहां तक कि बच्चों द्वारा बनाई गई "गुप्त भाषाओं" के पीछे भी है।',
    },
  },

  {
    id: 'blood-relations-basic',
    order: 7,
    title: { en: 'Blood Relations (Basic)', hi: 'रक्त संबंध (मूल)' },
    subtitle: { en: 'Family Logic', hi: 'पारिवारिक तर्क' },
    origin: {
      en: 'Family relationship puzzles come from how every culture has always needed clear words for exact family roles — who counts as your uncle vs. your father\'s brother-in-law, for instance. These puzzles test whether you can mentally build a small family tree from a few spoken clues, the same way genealogists trace family history.',
      hi: 'पारिवारिक संबंध पहेलियाँ इस बात से आती हैं कि हर संस्कृति में सटीक पारिवारिक भूमिकाओं के लिए स्पष्ट शब्द ज़रूरी रहे हैं — जैसे कौन आपका चाचा है और कौन आपके पिता का साढ़ू। ये पहेलियाँ जांचती हैं कि आप कुछ सुराग सुनकर मन में एक छोटा पारिवारिक वृक्ष बना सकते हैं या नहीं।',
    },
    steps: [
      { text: { en: 'Draw a tiny family tree on paper as you read each clue', hi: 'हर सुराग पढ़ते समय कागज़ पर एक छोटा पारिवारिक वृक्ष बनाएं' }, example: { en: "'A is B's father' → write A above B, joined by a line", hi: "'A, B का पिता है' → A को B के ऊपर लिखें, एक रेखा से जोड़ें" } },
      { text: { en: 'Add every new clue onto the SAME tree, connecting to names already there', hi: 'हर नया सुराग उसी वृक्ष में जोड़ें, पहले से मौजूद नामों से जोड़ते हुए' }, example: { en: "'B is C's brother' → add C next to B, same level", hi: "'B, C का भाई है' → C को B के बगल में, उसी स्तर पर जोड़ें" } },
      { text: { en: 'Once the tree is complete, read the relationship directly off the diagram', hi: 'वृक्ष पूरा होने पर, सीधे चित्र से संबंध पढ़ें' }, example: { en: 'A is directly above both B and C → A is father to both', hi: 'A सीधे B और C दोनों के ऊपर है → A दोनों का पिता है' } },
    ],
    whyItWorks: {
      en: 'A family tree turns spoken clues (which are easy to lose track of) into a visual map (which your brain can scan instantly). Every relationship — father, sister, grandmother — is really just a position on this tree, so once the tree is drawn correctly, no relationship can be wrong.',
      hi: 'पारिवारिक वृक्ष सुराग वाले शब्दों (जिन्हें भूलना आसान है) को एक चित्र (जिसे दिमाग तुरंत देख सकता है) में बदल देता है। हर संबंध — पिता, बहन, दादी — असल में इस वृक्ष पर एक स्थान ही है, तो एक बार वृक्ष सही बन जाए, कोई संबंध गलत नहीं हो सकता।',
    },
    example: {
      title: { en: "Pointing to a photo, Ravi says, 'She is the daughter of my mother's only son.' Who is she to Ravi?", hi: 'रवि एक फोटो की ओर इशारा करते हुए कहता है, "वह मेरी माँ के इकलौते बेटे की बेटी है।" वह रवि की कौन है?' },
      lines: [
        { en: "Ravi's mother's only son = Ravi himself", hi: 'रवि की माँ का इकलौता बेटा = रवि खुद' },
        { en: 'So she is the daughter of Ravi', hi: 'तो वह रवि की बेटी है' },
      ],
      result: { en: 'Answer: Daughter ✓', hi: 'उत्तर: बेटी ✓' },
    },
    commonMistake: {
      en: 'Students often try to solve blood relation clues purely in their head and lose track after 2-3 people. Always draw the tree — even a rough one — the moment a question introduces more than two people.',
      hi: 'छात्र अक्सर रक्त संबंध के सुराग सिर्फ दिमाग में हल करने की कोशिश करते हैं और 2-3 लोगों के बाद भूल जाते हैं। जैसे ही प्रश्न में दो से ज़्यादा लोग आएं, वृक्ष ज़रूर बनाएं — भले ही मोटा-मोटा ही सही।',
    },
    realWorld: {
      en: 'This exact skill is used in reading family trees for genealogy, legal inheritance cases, understanding relations in extended Indian joint families, and it\'s a near-guaranteed section in every competitive reasoning exam.',
      hi: 'यह कौशल वंशावली (पारिवारिक इतिहास), कानूनी विरासत मामलों, भारतीय संयुक्त परिवारों के संबंध समझने में, और हर प्रतियोगी तर्क परीक्षा में लगभग निश्चित रूप से काम आता है।',
    },
  },

  {
    id: 'calendar-basics',
    order: 8,
    title: { en: 'Calendar Basics', hi: 'कैलेंडर मूल बातें' },
    subtitle: { en: 'Day-Date Logic', hi: 'दिन-तारीख तर्क' },
    origin: {
      en: 'Calendars have followed a repeating 7-day cycle for thousands of years, ever since ancient Babylonian and Roman systems fixed the 7-day week we still use today. Because the cycle always repeats every 7 days, the day of the week for any date can always be calculated with simple counting — no need to memorize an actual calendar.',
      hi: 'कैलेंडर हज़ारों सालों से एक दोहराए जाने वाले 7-दिन के चक्र का पालन करते आए हैं, जब से प्राचीन बेबीलोनियन और रोमन प्रणालियों ने वह 7-दिन का सप्ताह तय किया जो आज भी उपयोग होता है। चूंकि यह चक्र हर 7 दिन में दोहराता है, किसी भी तारीख का दिन सरल गिनती से निकाला जा सकता है।',
    },
    steps: [
      { text: { en: 'Find how many days are between the known date and the date you need', hi: 'ज्ञात तारीख और चाहिए वाली तारीख के बीच कितने दिन हैं, यह निकालें' }, example: { en: 'Jan 1 is Monday. How many days to Jan 15? → 14 days', hi: '1 जनवरी सोमवार है। 15 जनवरी तक कितने दिन? → 14 दिन' } },
      { text: { en: 'Divide that number of days by 7 and keep only the remainder', hi: 'उन दिनों की संख्या को 7 से भाग दें और सिर्फ शेषफल रखें' }, example: { en: '14 ÷ 7 = 2 remainder 0', hi: '14 ÷ 7 = 2 शेष 0' } },
      { text: { en: 'Count forward that many days from the known day of the week (0 means it\'s the same day)', hi: 'ज्ञात दिन से उतने दिन आगे गिनें (0 का मतलब है वही दिन)' }, example: { en: 'Remainder 0 → Jan 15 is also a Monday', hi: 'शेष 0 → 15 जनवरी भी सोमवार है' } },
    ],
    whyItWorks: {
      en: 'This works because a 7-day week is a perfect repeating cycle — exactly like a clock with 7 numbers on it instead of 12. Any gap of days can be reduced to "how many full weeks, plus how many extra days," and only the extra days actually move the day-of-week forward.',
      hi: 'यह इसलिए काम करता है क्योंकि 7-दिन का सप्ताह एक पूर्ण दोहराव वाला चक्र है — बिल्कुल एक घड़ी की तरह, बस 12 के बजाय 7 अंकों वाली। किसी भी अंतर को "कितने पूरे सप्ताह, प्लस कितने अतिरिक्त दिन" में बदला जा सकता है, और सिर्फ अतिरिक्त दिन ही दिन-सप्ताह को आगे बढ़ाते हैं।',
    },
    example: {
      title: { en: 'If today is Wednesday, what day will it be after 10 days?', hi: 'अगर आज बुधवार है, तो 10 दिन बाद कौन सा दिन होगा?' },
      lines: [
        { en: '10 ÷ 7 = 1 remainder 3', hi: '10 ÷ 7 = 1 शेष 3' },
        { en: 'Count 3 days forward from Wednesday: Thu, Fri, Sat', hi: 'बुधवार से 3 दिन आगे गिनें: गुरु, शुक्र, शनि' },
      ],
      result: { en: 'Answer: Saturday ✓', hi: 'उत्तर: शनिवार ✓' },
    },
    commonMistake: {
      en: "Students often forget to take the remainder after dividing by 7, and instead count all the days one by one, which is slow and error-prone for large gaps. Always divide by 7 first — only the leftover days matter for the day-of-week.",
      hi: 'छात्र अक्सर 7 से भाग देने के बाद शेषफल लेना भूल जाते हैं, और इसके बजाय सभी दिन एक-एक करके गिनते हैं, जो बड़े अंतर के लिए धीमा और गलतियों भरा होता है। हमेशा पहले 7 से भाग दें — सिर्फ बचे हुए दिन ही मायने रखते हैं।',
    },
    realWorld: {
      en: 'Calendar logic is used in planning recurring events (like "every 2nd Monday"), figuring out what day a future date falls on for travel or exam planning, and understanding leap years and monthly schedules.',
      hi: 'कैलेंडर तर्क दोहराए जाने वाले कार्यक्रमों की योजना (जैसे "हर दूसरा सोमवार"), यात्रा या परीक्षा योजना के लिए भविष्य की तारीख का दिन पता करने, और लीप वर्ष व मासिक कार्यक्रम समझने में काम आता है।',
    },
  },

  {
    id: 'mirror-images-basic',
    order: 9,
    title: { en: 'Mirror Images (Basic)', hi: 'दर्पण प्रतिबिंब (मूल)' },
    subtitle: { en: 'Visual Reversal', hi: 'दृश्य उलटाव' },
    origin: {
      en: 'Mirror image reasoning comes directly from how light reflects — a mirror always flips left and right (but never up and down), which is exactly why text held up to a mirror reads backwards. This isn\'t just a puzzle trick — it\'s real optical physics your brain is learning to predict.',
      hi: 'दर्पण प्रतिबिंब तर्क सीधे इस बात से आता है कि प्रकाश कैसे परावर्तित होता है — दर्पण हमेशा बाएं और दाएं को उलट देता है (लेकिन ऊपर-नीचे को नहीं), और यही कारण है कि दर्पण में रखा गया शब्द उलटा दिखता है। यह सिर्फ एक पहेली की चाल नहीं, असली प्रकाशिकी भौतिकी है।',
    },
    steps: [
      { text: { en: 'Picture the mirror standing upright, right next to the object or letter', hi: 'दर्पण को सीधा खड़ा हुआ, वस्तु या अक्षर के ठीक बगल में कल्पना करें' }, example: { en: 'A clock face, mirror placed on its right side', hi: 'एक घड़ी, दर्पण उसके दाईं ओर रखा हुआ' } },
      { text: { en: 'Flip everything left-to-right only — keep top and bottom exactly the same', hi: 'सब कुछ केवल बाएं-से-दाएं पलटें — ऊपर और नीचे बिल्कुल वैसा ही रखें' }, example: { en: '3 o\'clock position flips to the 9 o\'clock position', hi: '3 बजे की स्थिति 9 बजे की स्थिति में बदल जाती है' } },
      { text: { en: 'Read or redraw the flipped result as the final answer', hi: 'पलटे हुए परिणाम को अंतिम उत्तर के रूप में पढ़ें या दोबारा बनाएं' }, example: { en: 'A clock showing 4:00 mirrors to show 8:00', hi: 'एक घड़ी जो 4:00 दिखाती है, दर्पण में 8:00 दिखाती है' } },
    ],
    whyItWorks: {
      en: 'A mirror only reverses the direction that is perpendicular to its surface (left-right when it stands upright) — it never reverses up-down. Once you internalize this ONE rule, every mirror puzzle — letters, clock times, shapes — becomes the same simple flip applied consistently.',
      hi: 'दर्पण केवल उस दिशा को उलटता है जो उसकी सतह के लंबवत होती है (जब वह सीधा खड़ा हो तो बाएं-दाएं) — यह कभी ऊपर-नीचे नहीं उलटता। एक बार यह एक नियम समझ आ जाए, हर दर्पण पहेली — अक्षर, घड़ी का समय, आकृतियाँ — वही सरल पलटाव बन जाती है।',
    },
    example: {
      title: { en: "What is the mirror image of the letter 'b'?", hi: '"b" अक्षर का दर्पण प्रतिबिंब क्या है?' },
      lines: [
        { en: 'The vertical stroke and loop flip left-to-right', hi: 'खड़ी रेखा और लूप बाएं-से-दाएं पलट जाते हैं' },
      ],
      result: { en: "Answer: 'd' ✓", hi: 'उत्तर: "d" ✓' },
    },
    commonMistake: {
      en: 'Students often flip shapes upside-down (top-bottom) by mistake instead of left-right, especially with numbers and clock faces. Remember: a standing mirror only ever swaps left and right — never up and down.',
      hi: 'छात्र अक्सर गलती से आकृतियों को ऊपर-नीचे (top-bottom) पलट देते हैं, बाएं-दाएं की बजाय, खासकर अंकों और घड़ी के मामले में। याद रखें: खड़ा दर्पण हमेशा सिर्फ बाएं और दाएं बदलता है — कभी ऊपर-नीचे नहीं।',
    },
    realWorld: {
      en: 'Mirror-image thinking is used in reading X-rays and medical scans correctly, understanding ambulance "AMBULANCE" text written backwards (so it reads correctly in a car\'s rear-view mirror), and in design, printing, and stamp-making where a reversed template is needed.',
      hi: 'दर्पण-प्रतिबिंब सोच एक्स-रे और मेडिकल स्कैन सही तरीके से पढ़ने, "AMBULANCE" शब्द उल्टा लिखे जाने (ताकि वह कार के रियर-व्यू मिरर में सही दिखे), और डिज़ाइन, प्रिंटिंग व मुहर बनाने में काम आती है।',
    },
  },

  {
    id: 'pattern-completion',
    order: 10,
    title: { en: 'Pattern Completion', hi: 'पैटर्न पूर्ति' },
    subtitle: { en: 'Visual & Logical Sequences', hi: 'दृश्य व तार्किक श्रृंखला' },
    origin: {
      en: 'Pattern completion is the most fundamental skill tested across almost every reasoning system — from ancient decorative art (repeating tile and rangoli designs) to modern IQ tests, humans have always been drawn to finding and completing repeating patterns, visual or logical.',
      hi: 'पैटर्न पूर्ति लगभग हर तर्क प्रणाली में परखा जाने वाला सबसे बुनियादी कौशल है — प्राचीन सजावटी कला (दोहराए जाने वाले टाइल और रंगोली डिज़ाइन) से लेकर आधुनिक IQ परीक्षणों तक, इंसान हमेशा दोहराए जाने वाले पैटर्न — दृश्य या तार्किक — को खोजने और पूरा करने की ओर आकर्षित रहे हैं।',
    },
    steps: [
      { text: { en: 'Look at how each item changes from the one before it', hi: 'देखें कि हर वस्तु अपने पिछले से कैसे बदलती है' }, example: { en: '△ △△ △△△ → each step adds one more triangle', hi: '△ △△ △△△ → हर चरण में एक और त्रिभुज जुड़ता है' } },
      { text: { en: 'State the rule of change in one short sentence', hi: 'बदलाव के नियम को एक छोटे वाक्य में बताएं' }, example: { en: '"Add one triangle every step"', hi: '"हर चरण में एक त्रिभुज जोड़ें"' } },
      { text: { en: 'Apply that same rule once more to build the missing/next item', hi: 'गायब/अगली वस्तु बनाने के लिए वही नियम एक बार और लगाएं' }, example: { en: 'Next in sequence: △△△△', hi: 'श्रृंखला में अगला: △△△△' } },
    ],
    whyItWorks: {
      en: 'Every valid pattern has exactly one repeating rule of change — it might be "add one," "rotate 90°," or "alternate between two shapes." Once that rule is stated in plain words, applying it forward (or backward) is no longer guesswork, it\'s simple, repeatable logic.',
      hi: 'हर वैध पैटर्न में बदलाव का बिल्कुल एक ही दोहराया जाने वाला नियम होता है — जैसे "एक जोड़ें," "90° घुमाएं," या "दो आकृतियों के बीच बारी-बारी बदलें।" एक बार यह नियम स्पष्ट शब्दों में कह दिया जाए, आगे (या पीछे) लगाना अंदाज़ा नहीं, सरल दोहराया जाने वाला तर्क बन जाता है।',
    },
    example: {
      title: { en: '2, 6, 18, 54, ?', hi: '2, 6, 18, 54, ?' },
      lines: [
        { en: '2 → 6 is ×3, 6 → 18 is ×3, 18 → 54 is ×3', hi: '2 → 6 है ×3, 6 → 18 है ×3, 18 → 54 है ×3' },
      ],
      result: { en: '54 × 3 = 162 ✓', hi: '54 × 3 = 162 ✓' },
    },
    commonMistake: {
      en: 'Students often assume the pattern is always addition and try to force-fit that rule even when it clearly doesn\'t hold. Always test your assumed rule on at least 2-3 consecutive pairs before locking it in — patterns can involve multiplication, alternating rules, or even a combination of two separate patterns interleaved together.',
      hi: 'छात्र अक्सर मान लेते हैं कि पैटर्न हमेशा जोड़ है और उसी नियम को ज़बरदस्ती फिट करने की कोशिश करते हैं, भले ही वह साफ तौर पर सही न बैठे। नियम को अपनाने से पहले कम से कम 2-3 लगातार जोड़ों पर जांच लें — पैटर्न में गुणा, बारी-बारी नियम, या दो अलग पैटर्न भी मिल सकते हैं।',
    },
    realWorld: {
      en: 'Pattern recognition is the foundation of learning any new subject (grammar rules, chemistry periodic trends, music rhythm), and it\'s the exact skill machine learning and AI systems are built to imitate — finding a repeating rule from limited examples.',
      hi: 'पैटर्न पहचान किसी भी नए विषय को सीखने की नींव है (व्याकरण नियम, रसायन विज्ञान की आवर्ती प्रवृत्तियाँ, संगीत की लय), और यही वह कौशल है जिसकी नकल मशीन लर्निंग और AI सिस्टम करने की कोशिश करते हैं — सीमित उदाहरणों से एक दोहराया जाने वाला नियम खोजना।',
    },
  },
];

export function getChapterContent(chapterId) {
  return RA_LEVEL1_CHAPTERS.find((c) => c.id === chapterId) || null;
}
