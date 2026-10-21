// Student track, modules 3 to 10. Same structure as the original modules:
// three tiers (primary: Class 1-5, secondary: Class 6-10, teen: Class 10-12),
// each with a concept, three steps, a practice question and a test question.
// Hindi is written for native readers. Review before publishing.

const q = (en, hi, options, correct) => ({ q: { en, hi }, options, correct });
const o = (en, hi) => ({ en, hi });
const s = (en, hi) => ({ en, hi });

export const STUDENT_EXTRA_MODULES = [
  {
    id: 'student_m3',
    order: 3,
    title: { en: 'Asking for Help Is a Strength', hi: 'मदद माँगना एक ताकत है' },
    tiers: {
      primary: {
        concept: {
          en: 'Asking for help is what good learners do. When you do not understand something, it is smart to say so. Your teacher and your family want to help you learn, and they can only help when they know where you are stuck.',
          hi: 'मदद माँगना अच्छे सीखने वालों का काम है। जब आपको कुछ समझ न आए, तो यह बताना समझदारी है। आपके टीचर और परिवार आपको सीखने में मदद करना चाहते हैं, और वे तभी मदद कर पाते हैं जब उन्हें पता हो कि आप कहाँ अटके हैं।',
        },
        steps: [
          s('Say which part you do not understand: "I do not get this step."', 'बताएँ कि कौन सा हिस्सा समझ नहीं आ रहा: "मुझे यह कदम समझ नहीं आ रहा।"'),
          s('Ask the teacher or a family member to show you one example.', 'टीचर या घर के किसी सदस्य से एक उदाहरण दिखाने को कहें।'),
          s('Try the next question yourself, then check your answer.', 'अगला सवाल खुद हल करें, फिर अपना जवाब जाँचें।'),
        ],
        practiceSet: [
          q('You are stuck on a maths problem. What is the best thing to do?', 'आप गणित के एक सवाल पर अटके हैं। सबसे अच्छा क्या करना है?',
            [o('Leave it blank and hope nobody notices.', 'इसे खाली छोड़ दें और उम्मीद करें कि किसी को पता न चले।'), o('Ask the teacher to show you one step.', 'टीचर से एक कदम दिखाने को कहें।')], 1),
        ],
        test: [
          q('Why is it smart to ask for help?', 'मदद माँगना समझदारी क्यों है?',
            [o('It helps you learn faster and avoid staying stuck.', 'इससे आप जल्दी सीखते हैं और अटके नहीं रहते।'), o('It means you are not clever.', 'इसका मतलब है कि आप होशियार नहीं हैं।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often avoid asking for help because they fear looking weak in front of friends. But the students who progress fastest ask the most precise questions. A clear question about one step gets you much further than a general "I do not get it".',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर दोस्तों के सामने कमज़ोर दिखने के डर से मदद नहीं माँगते। लेकिन सबसे तेज़ आगे बढ़ने वाले छात्र सबसे सटीक सवाल पूछते हैं। किसी एक कदम के बारे में साफ़ सवाल, "मुझे समझ नहीं आता" कहने से कहीं ज़्यादा मदद करता है।',
        },
        steps: [
          s('Write the exact step where your thinking breaks.', 'वह ठीक कदम लिखें जहाँ आपकी सोच रुकती है।'),
          s('Ask one precise question, not a general one.', 'एक सटीक सवाल पूछें, सामान्य नहीं।'),
          s('After getting help, redo a similar question on your own.', 'मदद मिलने के बाद मिलता-जुलता सवाल खुद दोबारा करें।'),
        ],
        practiceSet: [
          q('Which question is more useful when you are stuck on algebra?', 'बीजगणित में अटकने पर कौन सा सवाल ज़्यादा काम का है?',
            [o('"I do not understand algebra at all."', '"मुझे बीजगणित बिल्कुल समझ नहीं आता।"'), o('"Why do we move the 3 to the other side in step two?"', '"दूसरे कदम में 3 को दूसरी तरफ़ क्यों ले जाते हैं?"')], 1),
        ],
        test: [
          q('What makes a help request more effective?', 'मदद माँगना ज़्यादा असरदार कब होता है?',
            [o('Asking about one specific step.', 'किसी एक खास कदम के बारे में पूछना।'), o('Asking for the answer to the whole chapter.', 'पूरे अध्याय का जवाब माँगना।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 face pressure to appear self-sufficient. Still, asking for help early, from a teacher, a classmate, or a tutor, saves time before exams. Learning to seek support is a skill you will use at university and at work.',
          hi: 'कक्षा 10 से 12 के छात्रों पर खुद को सक्षम दिखाने का दबाव होता है। फिर भी परीक्षा से पहले, टीचर, साथी या ट्यूटर से जल्दी मदद माँगने से समय बचता है। मदद ढूँढना सीखना एक ऐसा कौशल है जो आप कॉलेज और नौकरी में भी इस्तेमाल करेंगे।',
        },
        steps: [
          s('Identify the topic that is blocking several other topics.', 'वह विषय पहचानें जो बाकी कई विषयों को रोक रहा है।'),
          s('Choose the right person: a teacher for concepts, a peer for practice.', 'सही व्यक्ति चुनें: अवधारणाओं के लिए टीचर, अभ्यास के लिए साथी।'),
          s('Ask early, at least a week before the exam.', 'जल्दी पूछें, परीक्षा से कम से कम एक हफ्ता पहले।'),
        ],
        practiceSet: [
          q('You are weak in a topic that affects three other chapters. What is the smartest move?', 'आप एक ऐसे विषय में कमज़ोर हैं जो तीन और अध्यायों को प्रभावित करता है। सबसे समझदार कदम क्या है?',
            [o('Ignore it and focus on the easier chapters.', 'उसे नज़रअंदाज़ करके आसान अध्यायों पर ध्यान दें।'), o('Ask a teacher for help on that topic early.', 'उस विषय पर जल्दी टीचर से मदद माँगें।')], 1),
        ],
        test: [
          q('When is the best time to ask for help before exams?', 'परीक्षा से पहले मदद माँगने का सबसे अच्छा समय कब है?',
            [o('The night before the exam.', 'परीक्षा से एक रात पहले।'), o('At least a week before the exam.', 'परीक्षा से कम से कम एक हफ्ता पहले।')], 1),
        ],
      },
    },
  },
  {
    id: 'student_m4',
    order: 4,
    title: { en: 'Handling Peer Pressure Around Marks', hi: 'अंकों को लेकर साथियों के दबाव को संभालना' },
    tiers: {
      primary: {
        concept: {
          en: 'Sometimes friends say things like "I got more than you" or "You are slow". These words can hurt. Your marks do not decide who you are, and you can be a good friend without competing over every score.',
          hi: 'कभी-कभी दोस्त कहते हैं "मुझे तुमसे ज़्यादा अंक मिले" या "तुम धीमे हो।" ये बातें दुख देती हैं। आपके अंक यह तय नहीं करते कि आप कौन हैं, और आप हर अंक पर होड़ किए बिना भी अच्छे दोस्त बन सकते हैं।',
        },
        steps: [
          s('Notice how the comment makes you feel.', 'ध्यान दें कि उस बात से आपको कैसा लगा।'),
          s('Reply calmly: "Good for you. I am working on my own thing."', 'शांति से जवाब दें: "बढ़िया है। मैं अपनी चीज़ों पर काम कर रहा हूँ।"'),
          s('Tell a grown-up you trust if the teasing continues.', 'अगर चिढ़ाना जारी रहे, तो किसी भरोसेमंद बड़े को बताएँ।'),
        ],
        practiceSet: [
          q('A friend laughs and says you are slow at maths. What is the best response?', 'एक दोस्त हँसकर कहता है कि आप गणित में धीमे हो। सबसे अच्छा जवाब क्या है?',
            [o('Get angry and shout back.', 'गुस्सा करके चिल्लाना।'), o('Stay calm and say you are working on it.', 'शांत रहना और कहना कि आप उस पर काम कर रहे हैं।')], 1),
        ],
        test: [
          q('Do your marks decide who you are?', 'क्या आपके अंक तय करते हैं कि आप कौन हैं?',
            [o('Yes, marks show your whole worth.', 'हाँ, अंक आपकी पूरी कीमत दिखाते हैं।'), o('No, marks show one part of what you can do.', 'नहीं, अंक आपकी क्षमता के एक हिस्से को दिखाते हैं।')], 1),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often compare marks in groups, and comparison can become teasing. Being part of a group does not require you to match everyone. You can support a friend who scores lower instead of mocking them, and you lose nothing by doing so.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर समूह में अंकों की तुलना करते हैं, और तुलना चिढ़ाने में बदल सकती है। समूह का हिस्सा होने का मतलब यह नहीं कि आप सबके बराबर हों। कम अंक वाले दोस्त का मज़ाक उड़ाने की जगह उसका साथ दे सकते हैं, और ऐसा करने से आप कुछ नहीं खोते।',
        },
        steps: [
          s('Decide your own goal for the test, not the group\'s.', 'परीक्षा के लिए अपना लक्ष्य तय करें, समूह का नहीं।'),
          s('Support a friend by offering to study together.', 'साथ पढ़ने की पेशकश करके दोस्त का साथ दें।'),
          s('Do not share someone else\'s marks without their permission.', 'किसी और के अंक उनकी इजाज़त के बिना न बताएँ।'),
        ],
        practiceSet: [
          q('A classmate is teased for a low score. What is the kindest action?', 'एक सहपाठी का कम स्कोर पर मज़ाक उड़ाया जाता है। सबसे दयालु कदम क्या है?',
            [o('Join in the teasing to fit in.', 'दोस्तों में शामिल होने के लिए मज़ाक में शामिल होना।'), o('Offer to study together for the next test.', 'अगले टेस्ट के लिए साथ पढ़ने की पेशकश करना।')], 1),
        ],
        test: [
          q('What should your goal for a test be?', 'परीक्षा के लिए आपका लक्ष्य क्या होना चाहिए?',
            [o('To beat everyone in the group.', 'समूह में हर किसी को हराना।'), o('To improve on your own previous score.', 'अपने पिछले स्कोर से बेहतर करना।')], 1),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 face pressure from peers about rank, colleges, and coaching. Compare yourself only to your own progress, and choose friends who celebrate your effort. If a friendship only works when you are doing worse, it is a warning sign.',
          hi: 'कक्षा 10 से 12 के छात्रों पर रैंक, कॉलेज और कोचिंग को लेकर साथियों का दबाव होता है। खुद की तुलना सिर्फ़ अपनी प्रगति से करें, और ऐसे दोस्त चुनें जो आपकी मेहनत पर खुश हों। अगर कोई दोस्ती तभी चलती है जब आप बुरा कर रहे हों, तो यह चेतावनी का संकेत है।',
        },
        steps: [
          s('List the people whose comments make you doubt your effort.', 'उन लोगों की सूची बनाएँ जिनकी बातें आपकी मेहनत पर शक पैदा करती हैं।'),
          s('Track your own progress over the last three tests.', 'पिछले तीन टेस्ट में अपनी प्रगति पर नज़र रखें।'),
          s('Talk to a trusted adult if the pressure starts to affect sleep or mood.', 'अगर दबाव नींद या मूड पर असर डालने लगे, तो किसी भरोसेमंद बड़े से बात करें।'),
        ],
        practiceSet: [
          q('A friend says you should be ranked higher and makes you feel guilty. What helps most?', 'एक दोस्त कहता है कि आपकी रैंक और ऊपर होनी चाहिए और आपको दोषी महसूस कराता है। सबसे ज़्यादा क्या मदद करता है?',
            [o('Comparing your rank to theirs every day.', 'हर दिन अपनी रैंक उनकी रैंक से मिलाना।'), o('Tracking your own progress over recent tests.', 'हाल के टेस्ट में अपनी प्रगति पर नज़र रखना।')], 1),
        ],
        test: [
          q('What is a warning sign in a friendship?', 'दोस्ती में चेतावनी का संकेत क्या है?',
            [o('They celebrate your effort.', 'वे आपकी मेहनत का जश्न मनाते हैं।'), o('It only works when you are doing worse.', 'यह तभी चलती है जब आप बुरा कर रहे हों।')], 1),
        ],
      },
    },
  },
  {
    id: 'student_m5',
    order: 5,
    title: { en: 'Making a Study Plan That Works', hi: 'ऐसी पढ़ाई की योजना बनाना जो काम करे' },
    tiers: {
      primary: {
        concept: {
          en: 'A study plan does not need to be long. Pick one small task for each study time, such as reading one page or doing five sums. Short plans are easy to finish, and finishing gives you the feeling of success.',
          hi: 'पढ़ाई की योजना लंबी होने की ज़रूरत नहीं है। हर पढ़ाई के समय के लिए एक छोटा काम चुनें, जैसे एक पन्ना पढ़ना या पाँच सवाल करना। छोटी योजनाएँ आसानी से पूरी होती हैं, और पूरा करने से सफलता का एहसास होता है।',
        },
        steps: [
          s('Pick one task for today, written on a card.', 'आज के लिए एक काम चुनें और उसे कार्ड पर लिखें।'),
          s('Set a timer for 15 minutes and start.', 'एक टाइमर 15 मिनट का लगाएँ और शुरू करें।'),
          s('Tick the card when you finish, and feel proud.', 'पूरा होने पर कार्ड पर निशान लगाएँ, और गर्व महसूस करें।'),
        ],
        practiceSet: [
          q('What makes a study plan easy to follow?', 'पढ़ाई की योजना आसानी से कैसे पालन होती है?',
            [o('Many long tasks at once.', 'एक साथ बहुत सारे लंबे काम।'), o('One small task at a time.', 'एक बार में एक छोटा काम।')], 1),
        ],
        test: [
          q('Why are short plans helpful?', 'छोटी योजनाएँ मददगार क्यों हैं?',
            [o('They are easy to finish, which builds confidence.', 'वे आसानी से पूरी होती हैं, जिससे आत्मविश्वास बढ़ता है।'), o('They mean you study less.', 'इसका मतलब है कि आप कम पढ़ते हैं।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often make plans that are too ambitious, then give up after two days. A good plan matches your real time and energy, includes breaks, and has a weekly review so you can adjust it.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर इतनी बड़ी योजना बनाते हैं कि दो दिन बाद छोड़ देते हैं। अच्छी योजना आपके असली समय और ऊर्जा के हिसाब से होती है, उसमें ब्रेक होते हैं, और हर हफ्ते उसकी समीक्षा होती है ताकि आप उसे बदल सकें।',
        },
        steps: [
          s('List your fixed commitments first: school, tuition, sports.', 'पहले अपने तय काम लिखें: स्कूल, ट्यूशन, खेल।'),
          s('Fill the free time with two focused study blocks, each about 40 minutes.', 'खाली समय में दो केंद्रित पढ़ाई के समय लगाएँ, हर एक लगभग 40 मिनट का।'),
          s('Review the plan every Sunday and change one thing.', 'हर रविवार योजना की समीक्षा करें और एक चीज़ बदलें।'),
        ],
        practiceSet: [
          q('Your plan fails after two days because it is too ambitious. What should you change?', 'आपकी योजना दो दिन में विफल हो जाती है क्योंकि वह बहुत बड़ी है। आपको क्या बदलना चाहिए?',
            [o('Add more hours to every day.', 'हर दिन और घंटे जोड़ना।'), o('Make the plan match your real time and energy.', 'योजना को अपने असली समय और ऊर्जा के हिसाब से बनाना।')], 1),
        ],
        test: [
          q('What should a weekly review do?', 'हफ्तेवार समीक्षा क्या करनी चाहिए?',
            [o('Let you adjust the plan based on what worked.', 'जो काम आया उसके आधार पर योजना बदलने देना।'), o('Replace your plan with a new one every week.', 'हर हफ्ते योजना को पूरी तरह नई से बदल देना।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 need study plans that cover the full syllabus across months, with buffer days for missed work. Plan by topic, rank topics by weight in the exam, and leave a few days before boards for revision and mock tests.',
          hi: 'कक्षा 10 से 12 के छात्रों को ऐसी योजना चाहिए जो महीनों में पूरे सिलेबस को कवर करे, और छूटे काम के लिए अतिरिक्त दिन रखे। विषयवार योजना बनाएँ, परीक्षा में वेटेज के हिसाब से विषयों को क्रम दें, और बोर्ड से पहले रिवीज़न और मॉक टेस्ट के लिए कुछ दिन छोड़ें।',
        },
        steps: [
          s('Map the syllabus by month, with one buffer week in every month.', 'सिलेबस को महीने के हिसाब से बाँटें, हर महीने एक बफ़र हफ्ता रखें।'),
          s('Prioritise high-weight topics in the first half of the plan.', 'योजना के पहले हिस्से में ज़्यादा वेटेज वाले विषयों को प्राथमिकता दें।'),
          s('Schedule two full mock tests before the boards.', 'बोर्ड से पहले दो पूरे मॉक टेस्ट तय करें।'),
        ],
        practiceSet: [
          q('Why keep a buffer week in each month of your plan?', 'योजना के हर महीने में एक बफ़र हफ्ता क्यों रखें?',
            [o('To absorb missed work without falling behind.', 'छूटे काम को बिना पिछड़े संभालने के लिए।'), o('Because you should not study on that week.', 'क्योंकि उस हफ्ते पढ़ना नहीं चाहिए।')], 0),
        ],
        test: [
          q('When should you schedule full mock tests?', 'पूरे मॉक टेस्ट कब तय करने चाहिए?',
            [o('Only after the boards are over.', 'सिर्फ़ बोर्ड खत्म होने के बाद।'), o('Before the boards, to find weak spots.', 'बोर्ड से पहले, कमज़ोर जगहें ढूँढने के लिए।')], 1),
        ],
      },
    },
  },
  {
    id: 'student_m6',
    order: 6,
    title: { en: 'Dealing With Exam Nerves', hi: 'परीक्षा की घबराहट से निपटना' },
    tiers: {
      primary: {
        concept: {
          en: 'Feeling nervous before a test is normal. Your body may feel fast and your tummy may feel funny. Slow breathing and a calm thought help the nervous feeling settle.',
          hi: 'परीक्षा से पहले घबराहट होना सामान्य है। आपका दिल तेज़ धड़क सकता है और पेट में अजीब लग सकता है। धीमी साँस और एक शांत विचार घबराहट को शांत करने में मदद करते हैं।',
        },
        steps: [
          s('Breathe in for three counts, then breathe out for three counts.', 'तीन गिनती तक साँस लें, फिर तीन गिनती तक छोड़ें।'),
          s('Say to yourself: "I know some of this, and I will do my best."', 'खुद से कहें: "मुझे इसका कुछ हिस्सा आता है, और मैं अपनी पूरी कोशिश करूँगा।"'),
          s('Start with the question you know best.', 'उस सवाल से शुरू करें जो आपको सबसे अच्छा आता है।'),
        ],
        practiceSet: [
          q('You feel nervous just before a test. What should you do?', 'टेस्ट से ठीक पहले आपको घबराहट होती है। आपको क्या करना चाहिए?',
            [o('Panic and skip the test.', 'घबराकर टेस्ट छोड़ देना।'), o('Take three slow breaths and start with a known question.', 'तीन धीमी साँसें लें और एक जाने-पहचाने सवाल से शुरू करें।')], 1),
        ],
        test: [
          q('What helps a nervous feeling settle?', 'घबराहट शांत होने में क्या मदद करता है?',
            [o('Slow breathing and a calm thought.', 'धीमी साँस और एक शांत विचार।'), o('Thinking about all the things that could go wrong.', 'वे सारी बातें सोचना जो गलत हो सकती हैं।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often feel nerves that stop them from thinking clearly during a test. Practise under test-like conditions, so the real exam feels familiar. Simple routines, such as the same breakfast and the same bag check, lower the surprise.',
          hi: 'ग्यारह से पंद्रह साल के छात्रों को अक्सर ऐसी घबराहट होती है जो परीक्षा के दौरान साफ़ सोचने से रोकती है। परीक्षा जैसी स्थितियों में अभ्यास करें, ताकि असली परीक्षा जानी-पहचानी लगे। एक जैसी छोटी आदतें, जैसे एक ही नाश्ता और बैग की जाँच, हैरानी को कम करती हैं।',
        },
        steps: [
          s('Do one timed practice paper a week, in a quiet room.', 'हर हफ्ते एक शांत कमरे में समय लेकर एक अभ्यास पेपर करें।'),
          s('Use a fixed pre-test routine: same breakfast, same bag check.', 'परीक्षा से पहले एक तय दिनचर्या रखें: वही नाश्ता, वही बैग की जाँच।'),
          s('If your mind goes blank, skip to the next question and come back.', 'अगर दिमाग खाली हो जाए, तो अगले सवाल पर जाएँ और बाद में लौटें।'),
        ],
        practiceSet: [
          q('Your mind goes blank on a hard question during the exam. What is the best move?', 'परीक्षा में एक कठिन सवाल पर दिमाग खाली हो जाता है। सबसे अच्छा कदम क्या है?',
            [o('Stay stuck on that one question until time runs out.', 'समय खत्म होने तक उसी एक सवाल पर अटके रहना।'), o('Skip it, answer others, and come back later.', 'उसे छोड़ दें, बाकी सवाल हल करें, और बाद में लौटें।')], 1),
        ],
        test: [
          q('Why practise under test-like conditions?', 'परीक्षा जैसी स्थितियों में अभ्यास क्यों करें?',
            [o('So the real exam feels familiar and less surprising.', 'ताकि असली परीक्षा जानी-पहचानी और कम हैरान करने वाली लगे।'), o('So you can finish the syllabus faster.', 'ताकि आप सिलेबस जल्दी खत्म कर सकें।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 may face panic attacks, sleeplessness, or a racing mind before boards. These are common, but they are also signs to get support early. Preparation, sleep, and talking to someone you trust can reduce the load.',
          hi: 'कक्षा 10 से 12 के छात्रों को बोर्ड से पहले घबराहट के दौरे, नींद न आना या दिमाग का बहुत तेज़ चलना हो सकता है। ये आम बातें हैं, पर ये जल्दी मदद लेने के संकेत भी हैं। तैयारी, नींद और किसी भरोसेमंद व्यक्ति से बात करने से बोझ कम हो सकता है।',
        },
        steps: [
          s('Protect sleep in the final two weeks. Set a fixed bedtime.', 'आखिरी दो हफ्तों में नींद की रक्षा करें। सोने का एक तय समय रखें।'),
          s('Use slow breathing before sleep and during the exam.', 'सोने से पहले और परीक्षा के दौरान धीमी साँस का अभ्यास करें।'),
          s('Tell a trusted adult or counsellor if panic or sleeplessness lasts more than a few days.', 'अगर घबराहट या नींद न आना कुछ दिनों से ज़्यादा चले, तो किसी भरोसेमंद बड़े या काउंसलर को बताएँ।'),
        ],
        practiceSet: [
          q('Two nights before boards, you cannot sleep because of worry. What is the best step?', 'बोर्ड से दो रात पहले चिंता के कारण नींद नहीं आती। सबसे अच्छा कदम क्या है?',
            [o('Study through the night to feel prepared.', 'तैयार महसूस करने के लिए रात भर पढ़ना।'), o('Keep a fixed bedtime, breathe slowly, and talk to someone you trust.', 'सोने का तय समय रखें, धीमी साँस लें, और किसी भरोसेमंद से बात करें।')], 1),
        ],
        test: [
          q('When should a student seek support for exam anxiety?', 'परीक्षा की चिंता के लिए छात्र को मदद कब लेनी चाहिए?',
            [o('Only after the results are out.', 'सिर्फ़ नतीजे आने के बाद।'), o('When panic or sleeplessness lasts more than a few days.', 'जब घबराहट या नींद न आना कुछ दिनों से ज़्यादा चले।')], 1),
        ],
      },
    },
  },
  {
    id: 'student_m7',
    order: 7,
    title: { en: 'Learning From Mistakes', hi: 'गलतियों से सीखना' },
    tiers: {
      primary: {
        concept: {
          en: 'Mistakes are part of learning. When you make one, you have found something to practise. Look at the mistake calmly, find what went wrong, and try the question again.',
          hi: 'गलतियाँ सीखने का हिस्सा हैं। जब आप गलती करते हैं, तो आपको अभ्यास के लिए कुछ मिल गया है। गलती को शांति से देखें, पता लगाएँ कि क्या गलत हुआ, और सवाल को दोबारा करें।',
        },
        steps: [
          s('Find the wrong answer and say, "This is a mistake, and I can fix it."', 'गलत जवाब ढूँढें और कहें, "यह गलती है, और मैं इसे ठीक कर सकता हूँ।"'),
          s('Work the question again, slowly.', 'सवाल को धीरे-धीरे दोबारा हल करें।'),
          s('Write the right answer next to the wrong one.', 'गलत जवाब के बगल में सही जवाब लिखें।'),
        ],
        practiceSet: [
          q('You got a sum wrong. What is the best next step?', 'आपका एक सवाल गलत हो गया। अगला सबसे अच्छा कदम क्या है?',
            [o('Feel bad and stop trying.', 'बुरा महसूस करके कोशिश बंद कर देना।'), o('Work the sum again slowly and find the mistake.', 'सवाल को धीरे-धीरे दोबारा करें और गलती ढूँढें।')], 1),
        ],
        test: [
          q('What does a mistake show you?', 'गलती आपको क्या दिखाती है?',
            [o('Something you can practise to get better.', 'कुछ ऐसा जिस पर अभ्यास करके आप बेहतर हो सकते हैं।'), o('That you are not good at maths.', 'कि आप गणित में अच्छे नहीं हैं।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often repeat the same mistake because they never look at it closely. Keep a simple mistake log with three columns: the question, why you got it wrong, and the correct method. Reviewing the log before each test prevents the same errors.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर एक ही गलती बार-बार करते हैं, क्योंकि वे उसे कभी ध्यान से नहीं देखते। एक सरल गलती-लॉग रखें जिसमें तीन कॉलम हों: सवाल, गलत होने का कारण, और सही तरीका। हर टेस्ट से पहले इस लॉग को देखने से वही गलतियाँ रुकती हैं।',
        },
        steps: [
          s('Start a mistake log in a notebook, with the three columns.', 'एक नोटबुक में तीन कॉलम वाला गलती-लॉग शुरू करें।'),
          s('Write why the mistake happened: a careless sign, a wrong formula, or a misread question.', 'लिखें कि गलती क्यों हुई: लापरवाही से चिह्न, गलत सूत्र, या गलत पढ़ा गया सवाल।'),
          s('Review the log before every test.', 'हर टेस्ट से पहले लॉग की समीक्षा करें।'),
        ],
        practiceSet: [
          q('You keep losing marks for careless signs. What helps most?', 'आपके अंक लापरवाही से चिह्नों के कारण बार-बार कटते हैं। सबसे ज़्यादा क्या मदद करेगा?',
            [o('Ignore it, signs do not matter much.', 'इसे नज़रअंदाज़ करना, चिह्न ज़्यादा मायने नहीं रखते।'), o('Log the mistake and check signs before every answer.', 'गलती लॉग करना और हर जवाब से पहले चिह्न जाँचना।')], 1),
        ],
        test: [
          q('What should a mistake log record?', 'गलती-लॉग में क्या दर्ज होना चाहिए?',
            [o('The question, why it went wrong, and the correct method.', 'सवाल, गलत होने का कारण, और सही तरीका।'), o('Only the total score.', 'सिर्फ़ कुल स्कोर।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 need to analyse mistakes at the level of thinking, not just answers. Ask whether you lacked a concept, misread the question, ran out of time, or panicked. Each cause needs a different fix.',
          hi: 'कक्षा 10 से 12 के छात्रों को गलतियों का विश्लेषण सिर्फ़ जवाब के स्तर पर नहीं, बल्कि सोच के स्तर पर करना चाहिए। पूछें कि क्या अवधारणा कमज़ोर थी, सवाल गलत पढ़ा गया, समय कम पड़ा, या घबराहट हुई। हर कारण का इलाज अलग है।',
        },
        steps: [
          s('Classify each mistake: concept gap, misreading, time pressure, or panic.', 'हर गलती को वर्गीकृत करें: अवधारणा में कमी, गलत पढ़ना, समय का दबाव, या घबराहट।'),
          s('For a concept gap, revisit the topic. For time pressure, practise timed sets.', 'अवधारणा में कमी के लिए विषय दोबारा पढ़ें। समय के दबाव के लिए समय लेकर अभ्यास करें।'),
          s('Track whether the same category repeats across tests.', 'देखें कि एक ही वर्ग की गलतियाँ टेस्ट में बार-बार आती हैं या नहीं।'),
        ],
        practiceSet: [
          q('Most of your mistakes come from running out of time. What should you practise?', 'आपकी ज़्यादातर गलतियाँ समय कम पड़ने से होती हैं। आपको किसका अभ्यास करना चाहिए?',
            [o('Re-reading the textbook slowly.', 'पाठ्यपुस्तक धीरे-धीरे दोबारा पढ़ना।'), o('Timed practice sets.', 'समय लेकर अभ्यास सेट।')], 1),
        ],
        test: [
          q('Why classify mistakes by cause?', 'गलतियों को कारण के हिसाब से क्यों वर्गीकृत करें?',
            [o('Because each cause needs a different fix.', 'क्योंकि हर कारण का इलाज अलग होता है।'), o('Because it makes the mistakes disappear.', 'क्योंकि इससे गलतियाँ अपने आप गायब हो जाती हैं।')], 0),
        ],
      },
    },
  },
  {
    id: 'student_m8',
    order: 8,
    title: { en: 'Balancing Study, Sleep, and Play', hi: 'पढ़ाई, नींद और खेल में संतुलन' },
    tiers: {
      primary: {
        concept: {
          en: 'Children need time to study, sleep, and play. Each one helps the others. Good sleep helps you remember what you learned, and play helps your mind and body rest.',
          hi: 'बच्चों को पढ़ने, सोने और खेलने, तीनों का समय चाहिए। हर एक दूसरों की मदद करता है। अच्छी नींद से आपको जो सीखा वह याद रहता है, और खेल से दिमाग और शरीर को आराम मिलता है।',
        },
        steps: [
          s('Keep a fixed bedtime that is the same most nights.', 'सोने का एक तय समय रखें जो ज़्यादातर रातों में एक जैसा हो।'),
          s('Study for a short time, then play for a short time.', 'थोड़ी देर पढ़ें, फिर थोड़ी देर खेलें।'),
          s('Notice how you feel after good sleep and after play.', 'ध्यान दें कि अच्छी नींद और खेल के बाद आप कैसा महसूस करते हैं।'),
        ],
        practiceSet: [
          q('Why does good sleep help you learn?', 'अच्छी नींद आपको सीखने में कैसे मदद करती है?',
            [o('It helps you remember what you learned.', 'इससे आपको जो सीखा वह याद रहता है।'), o('It means you do not need to study.', 'इसका मतलब है कि आपको पढ़ने की ज़रूरत नहीं।')], 0),
        ],
        test: [
          q('What does play do for your mind and body?', 'खेल आपके दिमाग और शरीर के लिए क्या करता है?',
            [o('It helps them rest.', 'इससे उन्हें आराम मिलता है।'), o('It makes them tired for no reason.', 'यह उन्हें बेवजह थका देता है।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often sacrifice sleep for late study, then struggle to concentrate the next day. Protecting sleep and play is part of studying well, not a break from it. Plan rest into your week on purpose.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर देर रात पढ़ने के लिए नींद कुर्बान करते हैं, फिर अगले दिन ध्यान लगाने में मुश्किल होती है। नींद और खेल की रक्षा अच्छी पढ़ाई का ही हिस्सा है, उससे छुट्टी नहीं। आराम को जानबूझकर अपने हफ्ते में शामिल करें।',
        },
        steps: [
          s('Count your hours of sleep for three nights. Is it enough?', 'तीन रातों के सोने के घंटे गिनें। क्या यह काफ़ी है?'),
          s('Schedule play or a hobby in your weekly plan.', 'अपनी हफ्तेवार योजना में खेल या शौक का समय तय करें।'),
          s('Stop studying at a set time, so the night stays for rest.', 'पढ़ाई एक तय समय पर रोकें, ताकि रात आराम के लिए रहे।'),
        ],
        practiceSet: [
          q('You study until midnight and feel tired in class. What is the best change?', 'आप आधी रात तक पढ़ते हैं और क्लास में थके रहते हैं। सबसे अच्छा बदलाव क्या है?',
            [o('Study even later to finish faster.', 'जल्दी खत्म करने के लिए और देर तक पढ़ना।'), o('Stop studying at a set time to protect sleep.', 'नींद की रक्षा के लिए पढ़ाई एक तय समय पर रोकना।')], 1),
        ],
        test: [
          q('Why is rest part of good study?', 'आराम अच्छी पढ़ाई का हिस्सा क्यों है?',
            [o('Because it helps you concentrate and remember.', 'क्योंकि इससे ध्यान लगता है और याद रहता है।'), o('Because it lets you skip studying.', 'क्योंकि इससे पढ़ाई छोड़ी जा सकती है।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 are under strain, and sleep is often the first thing sacrificed. Lack of sleep reduces memory and focus, so it works against your exam goals. Balance means choosing a study schedule that you can sustain, not the longest one.',
          hi: 'कक्षा 10 से 12 के छात्र भारी दबाव में होते हैं, और नींद अक्सर सबसे पहले कुर्बान होती है। कम नींद याद्दाश्त और ध्यान घटाती है, इसलिए यह परीक्षा के लक्ष्यों के खिलाफ़ काम करती है। संतुलन का मतलब है वह पढ़ाई का समय चुनना जो आप लगातार निभा सकें, सबसे लंबा नहीं।',
        },
        steps: [
          s('Set a study schedule you can keep for six weeks, not just three days.', 'ऐसी पढ़ाई का समय तय करें जो आप छह हफ्ते तक निभा सकें, सिर्फ़ तीन दिन नहीं।'),
          s('Protect seven to eight hours of sleep on most nights.', 'ज़्यादातर रातों में सात से आठ घंटे की नींद की रक्षा करें।'),
          s('Keep one activity you enjoy each week that has nothing to do with exams.', 'हर हफ्ते एक ऐसी गतिविधि रखें जिसका परीक्षा से कोई लेना-देना न हो।'),
        ],
        practiceSet: [
          q('You plan to study nine hours a day but sleep only four. What is the better plan?', 'आप रोज़ नौ घंटे पढ़ने की योजना बनाते हैं लेकिन सिर्फ़ चार घंटे सोते हैं। बेहतर योजना कौन सी है?',
            [o('Keep the nine hours and push through the tiredness.', 'नौ घंटे रखें और थकान के बावजूद जारी रखें।'), o('Choose a schedule you can sustain with enough sleep.', 'पर्याप्त नींद के साथ निभाने लायक योजना चुनें।')], 1),
        ],
        test: [
          q('What does balance mean for an exam student?', 'परीक्षा के छात्र के लिए संतुलन का क्या अर्थ है?',
            [o('The longest study schedule possible.', 'संभव सबसे लंबा पढ़ाई का समय।'), o('A schedule you can sustain without losing sleep.', 'ऐसा समय जो नींद खोए बिना लगातार निभ सके।')], 1),
        ],
      },
    },
  },
  {
    id: 'student_m9',
    order: 9,
    title: { en: 'Speaking Up in Class', hi: 'कक्षा में अपनी बात रखना' },
    tiers: {
      primary: {
        concept: {
          en: 'Speaking up in class can feel scary, but it helps you learn. When you answer a question, even a wrong one, your teacher can see what you understand and help you. Everyone in class is learning too.',
          hi: 'कक्षा में बोलना डरावना लग सकता है, लेकिन इससे आप सीखते हैं। जब आप सवाल का जवाब देते हैं, भले ही गलत हो, तो टीचर देख सकते हैं कि आप क्या समझते हैं और मदद कर सकते हैं। कक्षा में हर कोई भी सीख रहा है।',
        },
        steps: [
          s('Raise your hand and say your answer in a clear voice.', 'हाथ उठाएँ और अपना जवाब साफ़ आवाज़ में बोलें।'),
          s('If you are not sure, say, "I think it is this, but I am not sure."', 'अगर आप पक्का न हों, तो कहें, "मुझे लगता है यह है, लेकिन पक्का नहीं।"'),
          s('Listen to the teacher\'s answer and learn from it.', 'टीचर का जवाब सुनें और उससे सीखें।'),
        ],
        practiceSet: [
          q('You are not sure of the answer but the teacher asks. What should you do?', 'आप जवाब पक्का नहीं जानते लेकिन टीचर पूछते हैं। आपको क्या करना चाहिए?',
            [o('Stay silent and hope someone else answers.', 'चुप रहना और उम्मीद करना कि कोई और जवाब दे।'), o('Say your guess and that you are not sure.', 'अपना अनुमान बताना और कहना कि आप पक्का नहीं हैं।')], 1),
        ],
        test: [
          q('Why does answering a question help your teacher?', 'सवाल का जवाब देने से टीचर को क्या मदद मिलती है?',
            [o('They can see what you understand and help you.', 'वे देख सकते हैं कि आप क्या समझते हैं और मदद कर सकते हैं।'), o('It makes the lesson shorter.', 'इससे पाठ छोटा हो जाता है।')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often stay silent in class because they fear being laughed at. Speaking up is a skill that gets easier with practice. Start small: ask one question in each class, and remember that good questions show you are thinking.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर हँसी उड़ने के डर से कक्षा में चुप रहते हैं। बोलना एक ऐसा कौशल है जो अभ्यास से आसान होता है। छोटे से शुरू करें: हर कक्षा में एक सवाल पूछें, और याद रखें कि अच्छे सवाल दिखाते हैं कि आप सोच रहे हैं।',
        },
        steps: [
          s('Prepare one question before each class.', 'हर कक्षा से पहले एक सवाल तैयार करें।'),
          s('Ask it at a good moment, not in the middle of a sentence.', 'उसे सही समय पर पूछें, किसी की बात के बीच में नहीं।'),
          s('Thank the person who answers, even if the answer is not the one you expected.', 'जवाब देने वाले को धन्यवाद दें, भले ही जवाब आपकी उम्मीद से अलग हो।'),
        ],
        practiceSet: [
          q('You are afraid of being laughed at for asking a question. What helps most?', 'सवाल पूछने पर हँसी उड़ने का डर है। सबसे ज़्यादा क्या मदद करेगा?',
            [o('Never asking any question.', 'कभी कोई सवाल न पूछना।'), o('Preparing one question and asking it at a good moment.', 'एक सवाल तैयार करना और सही समय पर पूछना।')], 1),
        ],
        test: [
          q('What do good questions show about you?', 'अच्छे सवाल आपके बारे में क्या दिखाते हैं?',
            [o('That you are thinking about the lesson.', 'कि आप पाठ के बारे में सोच रहे हैं।'), o('That you already know everything.', 'कि आप सब कुछ पहले से जानते हैं।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 often hold back from class discussions because they are afraid of looking unprepared. Clear, short contributions, such as a question about a method or a reason for an answer, build your reputation and deepen your understanding.',
          hi: 'कक्षा 10 से 12 के छात्र अक्सर अनतैयार दिखने के डर से कक्षा की चर्चा में पीछे रहते हैं। साफ़ और छोटे योगदान, जैसे किसी तरीके के बारे में सवाल या किसी जवाब का कारण पूछना, आपकी छवि बनाते हैं और आपकी समझ गहरी करते हैं।',
        },
        steps: [
          s('Prepare one sharp question or comment from each chapter you read.', 'पढ़े गए हर अध्याय से एक तेज़ सवाल या टिप्पणी तैयार करें।'),
          s('Ask about the reasoning, such as "Why does this method work here?"', 'तर्क के बारे में पूछें, जैसे "यह तरीका यहाँ क्यों काम करता है?"'),
          s('Follow up once if the answer is unclear, then move on.', 'अगर जवाब साफ़ न हो, तो एक बार और पूछें, फिर आगे बढ़ें।'),
        ],
        practiceSet: [
          q('In a class discussion, which contribution adds the most value?', 'कक्षा की चर्चा में कौन सा योगदान सबसे ज़्यादा मूल्य जोड़ता है?',
            [o('"I agree with everything."', '"मैं सब बातों से सहमत हूँ।"'), o('"Why does this method work for this type of question?"', '"यह तरीका इस तरह के सवाल के लिए क्यों काम करता है?"')], 1),
        ],
        test: [
          q('What is a good way to follow up an unclear answer?', 'अस्पष्ट जवाब पर फॉलो-अप करने का अच्छा तरीका क्या है?',
            [o('Ask once more, then move on.', 'एक बार और पूछें, फिर आगे बढ़ें।'), o('Argue until the teacher gives up.', 'टीचर हार मानने तक बहस करना।')], 0),
        ],
      },
    },
  },
  {
    id: 'student_m10',
    order: 10,
    title: { en: 'Building Confidence Step by Step', hi: 'कदम-दर-कदम आत्मविश्वास बनाना' },
    tiers: {
      primary: {
        concept: {
          en: 'Confidence grows when you do something hard and succeed a little. It does not come all at once. Each small try is a brick in the wall of confidence.',
          hi: 'आत्मविश्वास तब बढ़ता है जब आप कोई कठिन काम करते हैं और थोड़ी सफलता पाते हैं। यह एक साथ नहीं आता। हर छोटी कोशिश आत्मविश्वास की दीवार की एक ईंट है।',
        },
        steps: [
          s('Pick one thing you find hard and try it a little each day.', 'एक ऐसा काम चुनें जो आपको मुश्किल लगता है, और हर दिन उसे थोड़ा करें।'),
          s('Notice one thing you did well today.', 'आज आपने जो एक अच्छा काम किया, उसे पहचानें।'),
          s('Tell yourself: "I am learning, and it takes time."', 'खुद से कहें: "मैं सीख रहा हूँ, और इसमें समय लगता है।"'),
        ],
        practiceSet: [
          q('How does confidence usually grow?', 'आत्मविश्वास आमतौर पर कैसे बढ़ता है?',
            [o('All at once, after one big success.', 'एक बड़ी सफलता के बाद, एक साथ।'), o('Step by step, through small tries.', 'छोटी कोशिशों के ज़रिए, कदम-दर-कदम।')], 1),
        ],
        test: [
          q('What is a good thing to tell yourself when learning something hard?', 'कुछ कठिन सीखते समय खुद से कहने की अच्छी बात क्या है?',
            [o('"I am learning, and it takes time."', '"मैं सीख रहा हूँ, और इसमें समय लगता है।"'), o('"I will never be good at this."', '"मैं इसमें कभी अच्छा नहीं हो पाऊँगा।"')], 0),
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often judge their confidence by their last test. A better measure is whether you are trying new methods and recovering from setbacks. Build confidence through a small challenge each week, followed by a short reflection on what you learned.',
          hi: 'ग्यारह से पंद्रह साल के छात्र अक्सर आखिरी टेस्ट से अपने आत्मविश्वास को आँकते हैं। एक बेहतर पैमाना यह है कि आप नए तरीके आज़मा रहे हैं या नहीं, और झटकों से उबर रहे हैं या नहीं। हर हफ्ते एक छोटी चुनौती लें, और फिर संक्षेप में सोचें कि आपने क्या सीखा।',
        },
        steps: [
          s('Choose one small challenge each week, such as a harder set of questions.', 'हर हफ्ते एक छोटी चुनौती चुनें, जैसे कठिन सवालों का एक सेट।'),
          s('Write two lines after it: what worked and what you would change.', 'उसके बाद दो पंक्तियाँ लिखें: क्या काम आया और क्या बदलेंगे।'),
          s('Count the new methods you tried, not only the marks you got.', 'सिर्फ़ अंक नहीं, बल्कि नए तरीकों की गिनती करें जो आपने आज़माए।'),
        ],
        practiceSet: [
          q('What is a better sign of growing confidence than your last test score?', 'आखिरी टेस्ट स्कोर से बढ़ते आत्मविश्वास का बेहतर संकेत क्या है?',
            [o('Trying new methods and recovering from setbacks.', 'नए तरीके आज़माना और झटकों से उबरना।'), o('Never making any mistakes.', 'कभी कोई गलती न करना।')], 0),
        ],
        test: [
          q('Why write a short reflection after a challenge?', 'चुनौती के बाद संक्षिप्त चिंतन क्यों लिखें?',
            [o('To notice what worked and what to change.', 'यह देखने के लिए कि क्या काम आया और क्या बदलना है।'), o('To avoid doing the challenge again.', 'ताकि चुनौती दोबारा न करनी पड़े।')], 0),
        ],
      },
      teen: {
        concept: {
          en: 'Students in Class 10 to 12 may doubt themselves under constant evaluation. Confidence built on real evidence lasts longer than confidence built on praise. Keep a record of concrete wins, such as a hard topic cleared or a mock score improved, and review it when doubt arrives.',
          hi: 'कक्षा 10 से 12 के छात्र लगातार मूल्यांकन के दबाव में खुद पर शक कर सकते हैं। असली सबूत पर बना आत्मविश्वास, तारीफ़ पर बने आत्मविश्वास से ज़्यादा टिकता है। ठोस उपलब्धियों का रिकॉर्ड रखें, जैसे कोई कठिन विषय पूरा होना या मॉक स्कोर सुधरना, और शक आने पर उसे देखें।',
        },
        steps: [
          s('Keep a wins log with dated, concrete entries.', 'तारीख वाली, ठोस प्रविष्टियों के साथ एक उपलब्धि-लॉग रखें।'),
          s('When doubt comes, read three entries before deciding what is true.', 'जब शक आए, तो सच मानने से पहले तीन प्रविष्टियाँ पढ़ें।'),
          s('Set one growth goal for the next month and track it weekly.', 'अगले महीने के लिए एक विकास लक्ष्य तय करें और हर हफ्ते उसे देखें।'),
        ],
        practiceSet: [
          q('You doubt yourself before boards. What builds the most reliable confidence?', 'बोर्ड से पहले आपको खुद पर शक होता है। सबसे भरोसेमंद आत्मविश्वास क्या बनाता है?',
            [o('Hearing that you are talented, again and again.', 'बार-बार यह सुनना कि आप प्रतिभाशाली हैं।'), o('Reviewing a record of concrete wins.', 'ठोस उपलब्धियों के रिकॉर्ड की समीक्षा करना।')], 1),
        ],
        test: [
          q('Why does evidence-based confidence last longer?', 'सबूत पर आधारित आत्मविश्वास ज़्यादा क्यों टिकता है?',
            [o('It rests on real results you can point to.', 'यह असली नतीजों पर टिका होता है जिन्हें आप दिखा सकते हैं।'), o('It never needs to be checked.', 'इसे कभी जाँचने की ज़रूरत नहीं होती।')], 0),
        ],
      },
    },
  },
];
