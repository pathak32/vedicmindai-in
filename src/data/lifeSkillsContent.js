// Life Skills modules — Parent / Student / Teacher tracks.
// Distinct from Sutra/Reasoning content: this is mindset and guidance, not
// math. Unlock mechanic is time-based (a real week must pass + a genuine
// reflection submitted), not score-based — see lifeSkillsProgress.js.
//
// Sourcing discipline: factual/scriptural content is cited by real source
// (Taittiriya Upanishad, Shiksha Valli, Anuvaka 11), not paraphrased loosely.
// Everything else is practical guidance, clearly not scripture.

export const LIFE_SKILLS_TRACKS = {
  parent: {
    label: { en: 'Parent Guide', hi: 'माता-पिता के लिए मार्गदर्शन' },
    tiered: true,
    modules: [
      {
        id: 'parent_m1',
        order: 1,
        title: { en: 'This Is Not the End of the World', hi: 'यह दुनिया का अंत नहीं है' },
        tiers: {
          primary: {
            concept: {
              en: "When a young child struggles with a subject, the moment feels enormous to them — because they don't yet have the life experience to know it's small. Your reaction in that moment teaches them more than the mistake itself does. If they see panic or disappointment on your face, they learn that mistakes are dangerous. If they see steadiness, they learn that mistakes are just part of learning something new.",
              hi: 'जब एक छोटा बच्चा किसी विषय में संघर्ष करता है, तो वह पल उन्हें बहुत बड़ा लगता है — क्योंकि उनके पास अभी यह जानने का जीवन अनुभव नहीं है कि यह छोटी बात है। उस पल में आपकी प्रतिक्रिया गलती से भी ज़्यादा उन्हें सिखाती है। अगर वे आपके चेहरे पर घबराहट या निराशा देखते हैं, तो वे सीखते हैं कि गलतियाँ खतरनाक हैं। अगर वे स्थिरता देखते हैं, तो वे सीखते हैं कि गलतियाँ कुछ नया सीखने का हिस्सा भर हैं।',
            },
            steps: [
              { en: 'When they show you a low mark, pause before reacting — even 3 seconds of silence beats an instant sigh or frown.', hi: 'जब वे आपको कम अंक दिखाएं, प्रतिक्रिया देने से पहले रुकें — तीन सेकंड की चुप्पी भी तुरंत आह भरने से बेहतर है।' },
              { en: 'Ask "what part felt hard?" before anything else — not "why did this happen?"', hi: 'सबसे पहले पूछें "कौन सा हिस्सा मुश्किल लगा?" — यह मत पूछें "ऐसा क्यों हुआ?"' },
              { en: 'Say the mark out loud without your own emotion attached to it: "Okay, 60%. Let\'s look at what that tells us." Not a verdict — information.', hi: '"ठीक है, 60%। चलो देखते हैं यह क्या बताता है" — बिना अपनी भावना जोड़े अंक को ज़ोर से बोलें। यह फैसला नहीं, जानकारी है।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your 8-year-old comes home upset about a low quiz score. What\'s the best first thing to say?', hi: 'आपका 8 साल का बच्चा कम क्विज़ स्कोर से परेशान होकर घर आता है। सबसे पहले क्या कहना सही है?' },
                options: [
                  { en: '"It\'s okay, you\'ll do better next time" (dismisses the feeling)', hi: '"कोई बात नहीं, अगली बार अच्छा करना" (भावना को नज़रअंदाज़ करता है)' },
                  { en: '"What part of it felt hard for you?"', hi: '"इसमें कौन सा हिस्सा मुश्किल लगा?"' },
                  { en: '"We need to practice more this week" (jumps straight to fixing)', hi: '"इस हफ्ते और अभ्यास करना होगा" (सीधे सुधार पर कूदना)' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'True or False: A young child\'s panic about a bad mark is usually about the mark itself, not about how the adults around them react to it.', hi: 'सही या गलत: एक छोटे बच्चे की खराब अंक को लेकर घबराहट आमतौर पर अंक के बारे में ही होती है, आसपास के बड़ों की प्रतिक्रिया के बारे में नहीं।' },
                options: [{ en: 'True', hi: 'सही' }, { en: 'False', hi: 'गलत' }],
                correct: 1,
              },
            ],
          },
          secondary: {
            concept: {
              en: 'Somewhere between Class 6 and 9, a child\'s sense of "am I good at this" starts hardening into "am I a smart person or not" — a shift from judging a moment to judging an identity. This is exactly the age where phrases like "I\'m just not a maths person" get adopted permanently, often after just one or two bad experiences reinforced by an adult\'s disappointment.',
              hi: 'कक्षा 6 से 9 के बीच कहीं, बच्चे की "क्या मैं इसमें अच्छा हूं" की समझ धीरे-धीरे "क्या मैं एक होशियार व्यक्ति हूं या नहीं" में बदलने लगती है — एक पल को आंकने से एक पहचान को आंकने की ओर बदलाव। यही वह उम्र है जब "मैं बस गणित वाला इंसान नहीं हूं" जैसे वाक्य स्थायी रूप से अपना लिए जाते हैं।',
            },
            steps: [
              { en: 'Catch yourself before saying "you\'re so smart" — praise the specific effort or method instead ("you stuck with that problem for 20 minutes, that\'s real focus").', hi: '"तुम बहुत होशियार हो" कहने से पहले खुद को रोकें — इसके बजाय खास प्रयास या तरीके की तारीफ करें।' },
              { en: 'When they say "I\'m bad at this," respond with "you\'re still learning this" — the tense matters more than it seems.', hi: 'जब वे कहें "मैं इसमें खराब हूं," जवाब दें "तुम अभी इसे सीख रहे हो" — काल (tense) का फर्क दिखने से ज़्यादा मायने रखता है।' },
              { en: 'Avoid comparing to a sibling or classmate, even in passing — this is the age where those comparisons get remembered word for word.', hi: 'भाई-बहन या सहपाठी से तुलना करने से बचें, बात-बात में भी — यही वह उम्र है जब ऐसी तुलनाएं शब्द-दर-शब्द याद रह जाती हैं।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your child says "I\'m just bad at maths." What response helps most?', hi: 'आपका बच्चा कहता है "मैं बस गणित में खराब हूं।" कौन सा जवाब सबसे ज़्यादा मदद करता है?' },
                options: [
                  { en: '"No you\'re not, you\'re smart!" (denies the feeling without addressing it)', hi: '"नहीं तुम नहीं हो, तुम होशियार हो!" (भावना को बिना संबोधित किए नकारना)' },
                  { en: '"You\'re still learning this — that\'s different from being bad at it."', hi: '"तुम अभी इसे सीख रहे हो — यह इसमें खराब होने से अलग बात है।"' },
                  { en: '"Everyone in the family is good at maths, you will be too" (adds pressure via comparison)', hi: '"परिवार में सब गणित में अच्छे हैं, तुम भी होगे" (तुलना से दबाव जोड़ता है)' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why does praising effort ("you worked hard on that") tend to work better long-term than praising ability ("you\'re so smart")?', hi: 'प्रयास की तारीफ ("तुमने उस पर मेहनत की") लंबे समय में क्षमता की तारीफ ("तुम बहुत होशियार हो") से बेहतर क्यों काम करती है?' },
                options: [
                  { en: 'It doesn\'t really matter which one you use', hi: 'इससे कोई फर्क नहीं पड़ता कि आप कौन सा इस्तेमाल करते हैं' },
                  { en: 'Effort praise teaches that trying is what leads to results, which a child can always choose to do again — ability praise implies a fixed trait they might "lose"', hi: 'प्रयास की तारीफ सिखाती है कि कोशिश करना ही परिणाम लाता है, जिसे बच्चा हमेशा फिर से चुन सकता है — क्षमता की तारीफ एक स्थिर गुण होने का संकेत देती है जिसे वे "खो" सकते हैं' },
                ],
                correct: 1,
              },
            ],
          },
          teen: {
            concept: {
              en: 'At this age, the pressure is real and specific — board exams, competitive exams, college admissions — and dismissing that pressure as "not a big deal" usually backfires, because it *is* a big deal to them, and pretending otherwise reads as not understanding their actual life. The reframe here isn\'t "this doesn\'t matter" — it\'s "this is one important thing, not the only thing that will ever determine your life."',
              hi: 'इस उम्र में, दबाव असली और खास होता है — बोर्ड परीक्षा, प्रतियोगी परीक्षा, कॉलेज दाखिला — और इस दबाव को "बड़ी बात नहीं" कहकर नकारना आमतौर पर उल्टा असर करता है, क्योंकि उनके लिए यह वाकई एक बड़ी बात है। यहां पुनर्विचार यह नहीं है कि "यह मायने नहीं रखता" — बल्कि यह है कि "यह एक महत्वपूर्ण चीज़ है, पर यह अकेली चीज़ नहीं जो आपकी पूरी ज़िंदगी तय करेगी।"',
            },
            steps: [
              { en: 'Validate the pressure as real before offering perspective: "I know this exam genuinely matters to you, and I\'m not brushing that off."', hi: 'नज़रिया देने से पहले दबाव को असली मानें: "मुझे पता है यह परीक्षा तुम्हारे लिए सच में मायने रखती है, और मैं इसे नज़रअंदाज़ नहीं कर रहा।"' },
              { en: 'Share a real, specific example of someone whose path wasn\'t linear — not a vague "some people succeed without marks" claim.', hi: 'किसी ऐसे व्यक्ति का असली, ठोस उदाहरण साझा करें जिसका रास्ता सीधा नहीं था — यह अस्पष्ट दावा नहीं कि "बिना अंकों के भी लोग सफल होते हैं।"' },
              { en: 'Ask what they\'re actually afraid will happen if this goes badly — often the real fear is smaller and more specific than "everything is ruined," and naming it makes it manageable.', hi: 'पूछें कि अगर यह ठीक न हुआ तो असल में उन्हें किस बात का डर है — अक्सर असली डर "सब कुछ बर्बाद हो जाएगा" से छोटा और ज़्यादा खास होता है, और उसे नाम देने से वह संभालने लायक बन जाता है।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your teenager is anxious before board exams. Which approach helps most?', hi: 'आपका किशोर बोर्ड परीक्षा से पहले चिंतित है। कौन सा तरीका सबसे ज़्यादा मदद करता है?' },
                options: [
                  { en: '"Don\'t worry, it\'s not a big deal" (dismisses real pressure)', hi: '"चिंता मत करो, बड़ी बात नहीं है" (असली दबाव को नकारता है)' },
                  { en: '"I know this really matters to you — what specifically worries you most?"', hi: '"मुझे पता है यह तुम्हारे लिए सच में मायने रखता है — तुम्हें सबसे ज़्यादा किस बात की चिंता है?"' },
                  { en: '"You need to study harder, that\'s the only way" (adds pressure without addressing the anxiety)', hi: '"तुम्हें और मेहनत करनी होगी, यही एकमात्र रास्ता है" (चिंता को संबोधित किए बिना दबाव जोड़ता है)' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why is naming a teen\'s specific fear ("what exactly worries you") often more helpful than general reassurance?', hi: 'किशोर के खास डर को नाम देना ("तुम्हें ठीक-ठीक किस बात की चिंता है") सामान्य आश्वासन से अक्सर ज़्यादा मददगार क्यों होता है?' },
                options: [
                  { en: 'A vague fear feels limitless; a named, specific fear can actually be discussed and made smaller', hi: 'एक अस्पष्ट डर असीमित लगता है; एक नाम दिया गया, खास डर पर वाकई चर्चा हो सकती है और उसे छोटा किया जा सकता है' },
                  { en: 'It doesn\'t make a real difference either way', hi: 'इससे कोई असली फर्क नहीं पड़ता' },
                ],
                correct: 0,
              },
            ],
          },
        },
      },
    ],
  },

  student: {
    label: { en: 'Student Guide', hi: 'छात्र मार्गदर्शन' },
    tiered: true,
    modules: [
      {
        id: 'student_m1',
        order: 1,
        title: { en: 'Your Marks Are Not Your Worth', hi: 'आपके अंक आपकी कीमत नहीं हैं' },
        tiers: {
          primary: {
            concept: {
              en: 'A test tells you what you know about one topic, on one day. It does not tell you if you are a good or bad person, or if people will love you less. When you get something wrong, it just means that\'s a good place to look closer next — not a reason to feel small.',
              hi: 'एक परीक्षा आपको बस यह बताती है कि आप एक दिन, एक विषय के बारे में क्या जानते हैं। यह नहीं बताती कि आप अच्छे या बुरे इंसान हैं, या लोग आपको कम प्यार करेंगे। जब आपसे कुछ गलत होता है, तो इसका मतलब है कि वहां थोड़ा और ध्यान देना है — छोटा महसूस करने की वजह नहीं।',
            },
            steps: [
              { en: 'When you get a low mark, say to yourself: "this tells me what to look at next," not "this tells me I\'m bad at this."', hi: 'जब कम अंक मिलें, खुद से कहें: "यह मुझे बताता है कि आगे क्या देखना है," न कि "यह बताता है कि मैं इसमें खराब हूं।"' },
              { en: 'Tell an adult you trust how the mark made you feel, not just what the mark was.', hi: 'किसी भरोसेमंद बड़े को बताएं कि अंक ने आपको कैसा महसूस कराया, सिर्फ अंक क्या था यह नहीं।' },
              { en: 'Pick one small thing to try differently next time — just one, not everything at once.', hi: 'अगली बार अलग तरीके से करने के लिए एक छोटी सी बात चुनें — बस एक, सब कुछ एक साथ नहीं।' },
            ],
            practiceSet: [
              {
                q: { en: 'You got a low score on a test. What\'s the most helpful thing to think?', hi: 'आपको टेस्ट में कम अंक मिले। सोचने के लिए सबसे मददगार बात क्या है?' },
                options: [
                  { en: '"I\'m bad at this subject forever"', hi: '"मैं इस विषय में हमेशा के लिए खराब हूं"' },
                  { en: '"This shows me what to practice next"', hi: '"यह मुझे बताता है कि आगे क्या अभ्यास करना है"' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'True or False: One low mark means you are not smart.', hi: 'सही या गलत: एक कम अंक का मतलब है कि आप होशियार नहीं हैं।' },
                options: [{ en: 'True', hi: 'सही' }, { en: 'False', hi: 'गलत' }],
                correct: 1,
              },
            ],
          },
          secondary: {
            concept: {
              en: 'Somewhere around this age, it\'s easy to start believing your marks say something permanent about who you are — "I\'m a topper" or "I\'m just average." Neither is really true. Marks measure one subject, on one test, on one day. They don\'t measure your character, your creativity, or what you\'re capable of a year from now.',
              hi: 'इस उम्र के आसपास, यह मानना आसान हो जाता है कि आपके अंक आपके बारे में कुछ स्थायी बताते हैं — "मैं टॉपर हूं" या "मैं बस औसत हूं।" दोनों ही सच नहीं हैं। अंक एक विषय को, एक परीक्षा में, एक दिन मापते हैं। वे आपके चरित्र, आपकी रचनात्मकता, या एक साल बाद आप क्या कर सकते हैं, यह नहीं मापते।',
            },
            steps: [
              { en: 'Notice when you say "I am bad at maths" and change it to "I am still learning maths" — say it out loud, not just in your head.', hi: 'जब आप कहें "मैं गणित में खराब हूं," उसे बदलकर कहें "मैं अभी भी गणित सीख रहा हूं" — इसे ज़ोर से बोलें, सिर्फ मन में नहीं।' },
              { en: 'After a bad result, write down one specific thing you\'ll do differently — vague resolutions ("study more") don\'t actually change much.', hi: 'खराब परिणाम के बाद, एक खास बात लिखें जो आप अलग करेंगे — अस्पष्ट इरादे ("ज़्यादा पढ़ूंगा") असल में ज़्यादा फर्क नहीं डालते।' },
              { en: 'Compare this month\'s you to last month\'s you — not to your classmate\'s marks.', hi: 'इस महीने के खुद की तुलना पिछले महीने के खुद से करें — अपने सहपाठी के अंकों से नहीं।' },
            ],
            practiceSet: [
              {
                q: { en: 'A classmate scored higher than you on a test. What\'s the most useful way to think about it?', hi: 'एक सहपाठी ने टेस्ट में आपसे ज़्यादा अंक पाए। इसके बारे में सोचने का सबसे उपयोगी तरीका क्या है?' },
                options: [
                  { en: '"They\'re just naturally better than me"', hi: '"वे बस स्वाभाविक रूप से मुझसे बेहतर हैं"' },
                  { en: '"What did they do differently that I could try?"', hi: '"उन्होंने क्या अलग किया जो मैं भी आज़मा सकता हूं?"' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why is comparing "this month\'s me to last month\'s me" more useful than comparing to a classmate?', hi: '"इस महीने के मुझसे पिछले महीने के मुझे" की तुलना एक सहपाठी से तुलना करने से ज़्यादा उपयोगी क्यों है?' },
                options: [
                  { en: 'It shows real progress you actually have control over, instead of a comparison shaped by things outside your control', hi: 'यह असली प्रगति दिखाता है जिस पर आपका वाकई नियंत्रण है, न कि उन चीज़ों से आकार लिया गया मुकाबला जो आपके नियंत्रण से बाहर हैं' },
                  { en: 'There\'s no real difference between the two', hi: 'दोनों में कोई असली फर्क नहीं है' },
                ],
                correct: 0,
              },
            ],
          },
          teen: {
            concept: {
              en: 'Right now, one exam can feel like it decides your whole future. It doesn\'t — not because exams don\'t matter, but because a life is built from hundreds of decisions and second chances, not one number on one day. The pressure you feel is real. The idea that this one result is final is not.',
              hi: 'अभी, एक परीक्षा ऐसा महसूस करा सकती है जैसे वह आपका पूरा भविष्य तय कर देगी। ऐसा नहीं है — इसलिए नहीं कि परीक्षाएं मायने नहीं रखतीं, बल्कि इसलिए कि एक ज़िंदगी सैकड़ों फैसलों और दूसरे मौकों से बनती है, एक दिन के एक नंबर से नहीं। जो दबाव आप महसूस करते हैं वह असली है। यह विचार कि यह एक परिणाम आखिरी है, वह असली नहीं है।',
            },
            steps: [
              { en: 'Write down one person you know (or know of) whose path wasn\'t a straight line — and what they\'re doing now.', hi: 'किसी ऐसे व्यक्ति को लिखें जिसे आप जानते हैं (या जिसके बारे में जानते हैं) जिसका रास्ता सीधा नहीं था — और वे अभी क्या कर रहे हैं।' },
              { en: 'Name the specific fear behind the pressure — not "everything will be ruined," but the actual, specific thing you\'re afraid of.', hi: 'दबाव के पीछे के खास डर को नाम दें — "सब कुछ बर्बाद हो जाएगा" नहीं, बल्कि वह असली, खास चीज़ जिससे आप डरते हैं।' },
              { en: 'Talk to one adult about the pressure itself, separate from asking for help with the subject.', hi: 'विषय में मदद मांगने से अलग, दबाव के बारे में किसी एक बड़े से बात करें।' },
            ],
            practiceSet: [
              {
                q: { en: 'You\'re convinced this one exam will determine your entire future. What\'s the most accurate way to think about it?', hi: 'आप आश्वस्त हैं कि यह एक परीक्षा आपका पूरा भविष्य तय कर देगी। इसके बारे में सोचने का सबसे सटीक तरीका क्या है?' },
                options: [
                  { en: '"This exam matters, and it is also not the only chance I\'ll ever get"', hi: '"यह परीक्षा मायने रखती है, और यह एकमात्र मौका भी नहीं है जो मुझे मिलेगा"' },
                  { en: '"If this goes badly, nothing else will matter"', hi: '"अगर यह खराब हुआ, तो कुछ और मायने नहीं रखेगा"' },
                ],
                correct: 0,
              },
            ],
            test: [
              {
                q: { en: 'What\'s the value in naming your specific fear rather than just feeling generally anxious?', hi: 'सिर्फ सामान्य रूप से चिंतित महसूस करने के बजाय अपने खास डर को नाम देने का क्या फायदा है?' },
                options: [
                  { en: 'A named fear can be examined and often turns out smaller than the vague feeling of dread', hi: 'एक नाम दिए गए डर की जांच की जा सकती है और अक्सर वह अस्पष्ट भय की भावना से छोटा निकलता है' },
                  { en: 'It doesn\'t change anything real', hi: 'इससे कुछ भी असली नहीं बदलता' },
                ],
                correct: 0,
              },
            ],
          },
        },
      },
    ],
  },

  teacher: {
    label: { en: 'Teacher Guide', hi: 'शिक्षक मार्गदर्शन' },
    tiered: false,
    modules: [
      {
        id: 'teacher_m1',
        order: 1,
        title: { en: 'The Weight You Carry', hi: 'आप जो बोझ उठाते हैं' },
        concept: {
          en: 'The Taittiriya Upanishad\'s Shiksha Valli (Krishna Yajurveda, Anuvaka 11) instructs a student, at the very end of their formal education, to hold their teacher in the same regard as the divine — "Acharya Devo Bhava." That reverence was never meant to be one-directional. It comes with real weight: a teacher shapes how a young person will feel about learning itself, often for the rest of their life, in ways that outlast any single lesson or test score. This module isn\'t about that pressure — it\'s about recognizing it honestly, so it can be carried well instead of carried alone.',
          hi: 'तैत्तिरीय उपनिषद की शिक्षावल्ली (कृष्ण यजुर्वेद, अनुवाक 11) एक छात्र को, उनकी औपचारिक शिक्षा के अंत में, अपने शिक्षक को उतना ही सम्मान देने का निर्देश देती है जितना ईश्वर को — "आचार्य देवो भव।" यह श्रद्धा कभी एकतरफा नहीं थी। इसके साथ असली ज़िम्मेदारी आती है: एक शिक्षक इस बात को आकार देता है कि एक युवा व्यक्ति सीखने के बारे में कैसा महसूस करेगा।',
        },
        steps: [
          { en: 'Notice one moment each week where a student\'s reaction to you (not just to the subject) shapes how they feel about learning — and name it to yourself.', hi: 'हर हफ्ते एक ऐसा पल पहचानें जहां आपके प्रति (सिर्फ विषय के प्रति नहीं) किसी छात्र की प्रतिक्रिया यह आकार देती है कि वे सीखने के बारे में कैसा महसूस करते हैं — और उसे खुद को पहचानें।' },
          { en: 'Before a difficult conversation with a struggling student, take 10 seconds to remember: they are not being difficult at you, they are struggling near you.', hi: 'किसी संघर्षरत छात्र के साथ मुश्किल बातचीत से पहले, 10 सेकंड लेकर याद करें: वे आपके सामने मुश्किल नहीं बना रहे, वे आपके पास संघर्ष कर रहे हैं।' },
          { en: 'At the end of a hard day, name one specific thing that went well — not generally, specifically ("Aarav asked a real question today") — this rebuilds the weight into something sustainable.', hi: 'एक मुश्किल दिन के अंत में, एक खास बात नाम दें जो अच्छी हुई — सामान्य रूप से नहीं, खास रूप से — यह बोझ को कुछ टिकाऊ में बदल देता है।' },
        ],
        practiceSet: [
          {
            q: { en: 'A student who\'s normally engaged suddenly goes quiet and stops participating for a week. What\'s the most useful first response?', hi: 'एक छात्र जो सामान्यतः जुड़ा रहता है, अचानक चुप हो जाता है और एक हफ्ते तक भाग नहीं लेता। सबसे उपयोगी पहली प्रतिक्रिया क्या है?' },
            options: [
              { en: 'Call them out in front of the class to re-engage them', hi: 'उन्हें फिर से जोड़ने के लिए क्लास के सामने बुलाएं' },
              { en: 'A brief, private, low-pressure check-in — "I noticed you\'ve been quiet, everything okay?"', hi: 'एक संक्षिप्त, निजी, कम दबाव वाली बातचीत — "मैंने देखा तुम चुप हो, सब ठीक है?"' },
              { en: 'Wait and see if it resolves on its own', hi: 'इंतज़ार करें और देखें कि क्या यह अपने आप ठीक हो जाता है' },
            ],
            correct: 1,
          },
        ],
      },
    ],
  },
};

export function getModulesForTrack(trackId) {
  return LIFE_SKILLS_TRACKS[trackId]?.modules || [];
}

export function getModuleContent(trackId, moduleId, ageTier) {
  const mod = getModulesForTrack(trackId).find((m) => m.id === moduleId);
  if (!mod) return null;
  if (LIFE_SKILLS_TRACKS[trackId].tiered) {
    return { ...mod, ...mod.tiers[ageTier || 'secondary'] };
  }
  return mod;
}

export function mapGradeToTier(grade) {
  const n = parseInt(grade, 10);
  if (isNaN(n)) return 'secondary';
  if (n <= 5) return 'primary';
  if (n <= 9) return 'secondary';
  return 'teen';
}
