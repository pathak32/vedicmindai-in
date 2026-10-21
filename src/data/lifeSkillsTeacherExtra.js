// Teacher track, modules 3 to 10. Each tier already has its label and steps;
// this file adds the concept, practice question and test question for each tier.
// Tier keys match the teacher track: primary, secondary, senior.
// Hindi is written for native readers. Review before publishing.

const q = (en, hi, options, correct) => ({ q: { en, hi }, options: options.map(([a, b]) => ({ en: a, hi: b })), correct });

export const TEACHER_TIER_CONTENT = {
  teacher_m3: {
    primary: {
      concept: {
        en: 'A child who has stopped believing they can learn often hides it behind silence or jokes. Start with a success they can see, then build from there.',
        hi: 'जो बच्चा मानना छोड़ चुका है कि वह सीख सकता है, वह अक्सर चुप्पी या मज़ाक के पीछे छिपाता है। किसी दिखने वाली सफलता से शुरू करें, फिर उसी से आगे बढ़ाएँ।',
      },
      practiceSet: [q('A child says, "I am just bad at maths." What is the best first response?', 'बच्चा कहता है, "मैं गणित में बस खराब हूँ।" पहला सबसे अच्छा जवाब क्या है?',
        [['"Everyone is bad at something."', '"हर कोई किसी न किसी चीज़ में खराब होता है।"'], ['"Show me the one sum you got right today."', '"मुझे आज का वह एक सवाल दिखाओ जो तुमने सही किया।"']], 1)],
      test: [q('Why start with a visible success?', 'दिखने वाली सफलता से शुरू क्यों करें?',
        [['It gives the child evidence they can learn.', 'इससे बच्चे को सबूत मिलता है कि वह सीख सकता है।'], ['It means the lesson is over.', 'इसका मतलब है कि पाठ खत्म हो गया।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Students who have stopped believing often stop trying before they are tested. Ask what they used to enjoy, and connect new work to that.',
        hi: 'जो छात्र मानना छोड़ चुके हैं, वे अक्सर परखे जाने से पहले ही कोशिश बंद कर देते हैं। पूछें कि उन्हें पहले क्या अच्छा लगता था, और नए काम को उससे जोड़ें।',
      },
      practiceSet: [q('A student says, "What is the point? I always fail." What is the most useful step?', 'छात्र कहता है, "फ़ायदा क्या है? मैं हमेशा फेल होता हूँ।" सबसे उपयोगी कदम क्या है?',
        [['Give them harder work to prove a point.', 'बात साबित करने के लिए उन्हें और कठिन काम देना।'], ['Ask what they used to enjoy and link the next task to it.', 'पूछना कि उन्हें पहले क्या अच्छा लगता था, और अगला काम उससे जोड़ना।']], 1)],
      test: [q('What helps a student who has stopped trying?', 'जो छात्र कोशिश बंद कर चुका है, उसकी मदद क्या करता है?',
        [['A link between new work and something they value.', 'नए काम और उनकी किसी पसंदीदा चीज़ के बीच एक कड़ी।'], ['More pressure to finish quickly.', 'जल्दी खत्म करने का और दबाव।']], 0)],
    },
    senior: {
      concept: {
        en: 'Senior students who have lost belief often judge their future by one result. Help them separate a single test from their ability, and set a realistic next step.',
        hi: 'वरिष्ठ छात्र जिन्होंने विश्वास खो दिया है, अक्सर अपने भविष्य को एक नतीजे से आँकते हैं। एक टेस्ट को उनकी क्षमता से अलग करने में मदद करें, और एक यथार्थवादी अगला कदम तय करें।',
      },
      practiceSet: [q('A Class 12 student says, "One bad mock means I am finished." What is the best response?', 'कक्षा 12 का छात्र कहता है, "एक खराब मॉक का मतलब है मैं खत्म हो गया।" सबसे अच्छा जवाब क्या है?',
        [['"Do not worry about it."', '"इसकी चिंता मत करो।"'], ['"One mock measures one day. Let us find the two topics to fix next."', '"एक मॉक एक दिन को मापता है। चलो अगले दो सुधारने वाले विषय ढूँढते हैं।"']], 1)],
      test: [q('What does one mock test measure?', 'एक मॉक टेस्ट क्या मापता है?',
        [['Their whole ability forever.', 'उनकी पूरी क्षमता हमेशा के लिए।'], ['Their performance on one day, on one set of questions.', 'एक दिन, एक सेट के सवालों पर उनका प्रदर्शन।']], 1)],
    },
  },
  teacher_m4: {
    primary: {
      concept: {
        en: 'Young children hear the tone of a sentence before its meaning. Speak slowly, use the child\'s own words, and check that they have understood.',
        hi: 'छोटे बच्चे वाक्य का अर्थ समझने से पहले उसका लहज़ा सुनते हैं। धीरे बोलें, बच्चे के अपने शब्द इस्तेमाल करें, और जाँचें कि उन्होंने समझा या नहीं।',
      },
      practiceSet: [q('You explain a fraction and a child looks lost. What do you do?', 'आप भिन्न समझाते हैं और बच्चा खोया हुआ लगता है। आप क्या करते हैं?',
        [['Repeat the same explanation louder.', 'वही समझाना ज़ोर से दोहराना।'], ['Ask the child to say it back in their own words.', 'बच्चे से अपने शब्दों में दोहराने को कहना।']], 1)],
      test: [q('What shows that a child has understood?', 'बच्चे ने समझा है, यह कैसे पता चलता है?',
        [['They can explain it back in their own words.', 'वे इसे अपने शब्दों में समझा सकते हैं।'], ['They stay quiet.', 'वे चुप रहते हैं।']], 0)],
    },
    secondary: {
      concept: {
        en: 'The Vak framework reminds teachers that the same idea can be said at four levels, from sound to meaning. Choose the level the student can receive, then move deeper.',
        hi: 'वाक् का ढाँचा शिक्षकों को याद दिलाता है कि एक ही विचार चार स्तरों पर कहा जा सकता है, ध्वनि से अर्थ तक। वह स्तर चुनें जिसे छात्र ग्रहण कर सके, फिर गहराई में जाएँ।',
      },
      practiceSet: [q('A student cannot follow an abstract explanation of a theorem. What should you do?', 'छात्र किसी प्रमेय की अमूर्त व्याख्या समझ नहीं पा रहा। आपको क्या करना चाहिए?',
        [['Repeat the abstract version faster.', 'अमूर्त व्याख्या को और तेज़ी से दोहराना।'], ['Give a concrete example first, then return to the theorem.', 'पहले एक ठोस उदाहरण देना, फिर प्रमेय पर लौटना।']], 1)],
      test: [q('What is the main lesson of meeting the student at their level?', 'छात्र से उसके स्तर पर मिलने का मुख्य सबक क्या है?',
        [['The student can then receive the idea and go deeper.', 'तब छात्र विचार को ग्रहण करके गहराई में जा सकता है।'], ['The teacher can skip the topic.', 'शिक्षक उस विषय को छोड़ सकता है।']], 0)],
    },
    senior: {
      concept: {
        en: 'In senior classes, the same idea must move from sound to meaning to application. Check at each level before moving on, so that the student can use the idea, not only repeat it.',
        hi: 'वरिष्ठ कक्षाओं में एक ही विचार को ध्वनि से अर्थ और फिर उपयोग तक ले जाना होता है। आगे बढ़ने से पहले हर स्तर पर जाँचें, ताकि छात्र विचार को सिर्फ़ दोहराए नहीं, बल्कि इस्तेमाल भी कर सके।',
      },
      practiceSet: [q('A student repeats a definition perfectly but cannot solve a new problem. Which level is missing?', 'छात्र परिभाषा बिल्कुल सही दोहराता है लेकिन नया सवाल हल नहीं कर पाता। कौन सा स्तर छूटा है?',
        [['Application.', 'उपयोग का स्तर।'], ['Sound.', 'ध्वनि का स्तर।']], 0)],
      test: [q('Why check at each level before moving on?', 'आगे बढ़ने से पहले हर स्तर पर क्यों जाँचें?',
        [['So the student can use the idea, not only repeat it.', 'ताकि छात्र विचार को सिर्फ़ दोहराए नहीं, बल्कि इस्तेमाल भी करे।'], ['So the lesson finishes faster.', 'ताकि पाठ जल्दी खत्म हो।']], 0)],
    },
  },
  teacher_m5: {
    primary: {
      concept: {
        en: 'Some questions open a child\'s thinking, such as "What do you notice?" Others close it, such as "Is it 5?" Use more opening questions with young learners.',
        hi: 'कुछ सवाल बच्चे की सोच खोलते हैं, जैसे "तुम्हें क्या दिखता है?" और कुछ उसे बंद करते हैं, जैसे "क्या यह 5 है?" छोटे बच्चों के साथ खुले सवाल ज़्यादा पूछें।',
      },
      practiceSet: [q('Which question opens thinking best?', 'कौन सा सवाल सोच को सबसे अच्छी तरह खोलता है?',
        [['"Is it 5?"', '"क्या यह 5 है?"'], ['"What do you notice about these numbers?"', '"इन संख्याओं में तुम्हें क्या दिखता है?"']], 1)],
      test: [q('What does a closed question usually do?', 'बंद सवाल आमतौर पर क्या करता है?',
        [['Ends the thinking with a yes or no.', 'हाँ या ना के साथ सोच को खत्म कर देता है।'], ['Starts a long discussion.', 'लंबी चर्चा शुरू करता है।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Good questions open a discussion and invite reasoning. Closed questions are useful to check a fact, but they should not be the main tool.',
        hi: 'अच्छे सवाल चर्चा खोलते हैं और तर्क को आमंत्रित करते हैं। बंद सवाल किसी तथ्य को जाँचने के लिए उपयोगी हैं, पर उन्हें मुख्य औज़ार नहीं होना चाहिए।',
      },
      practiceSet: [q('You want students to explain their reasoning. Which question works?', 'आप चाहते हैं कि छात्र अपना तर्क समझाएँ। कौन सा सवाल काम करेगा?',
        [['"Did you get the right answer?"', '"क्या तुम्हारा जवाब सही है?"'], ['"How did you decide which method to use?"', '"तुमने कौन सा तरीका चुनने का फैसला कैसे किया?"']], 1)],
      test: [q('When is a closed question useful?', 'बंद सवाल कब उपयोगी है?',
        [['To check a specific fact quickly.', 'किसी खास तथ्य को जल्दी जाँचने के लिए।'], ['To start a long discussion.', 'लंबी चर्चा शुरू करने के लिए।']], 0)],
    },
    senior: {
      concept: {
        en: 'In senior classes, the closing question often ends a thought too early. Use opening questions to test ideas, and closing questions only when you need a precise answer.',
        hi: 'वरिष्ठ कक्षाओं में बंद सवाल अक्सर विचार को बहुत जल्दी खत्म कर देता है। विचारों को परखने के लिए खुले सवाल, और सटीक जवाब चाहिए तभी बंद सवाल इस्तेमाल करें।',
      },
      practiceSet: [q('A student gives a quick answer to a complex problem. Which follow-up opens it up?', 'छात्र एक जटिल सवाल का जल्दी जवाब देता है। कौन सा फॉलो-अप उसे खोलेगा?',
        [['"Correct, next question."', '"सही है, अगला सवाल।"'], ['"What would change if the numbers were larger?"', '"अगर संख्याएँ बड़ी होतीं तो क्या बदलता?"']], 1)],
      test: [q('Why avoid relying only on closing questions with senior students?', 'वरिष्ठ छात्रों के साथ सिर्फ़ बंद सवालों पर निर्भर रहने से क्यों बचें?',
        [['They end thinking too early and hide gaps in reasoning.', 'वे सोच को बहुत जल्दी खत्म करते हैं और तर्क की कमियाँ छिपा देते हैं।'], ['They take too long to answer.', 'उनके जवाब में बहुत देर लगती है।']], 0)],
    },
  },
  teacher_m6: {
    primary: {
      concept: {
        en: 'A young child is more than their marks. Notice their body, their mood, and their interests, because these shape how they learn today.',
        hi: 'छोटा बच्चा अपने अंकों से कहीं ज़्यादा है। उसके शरीर, मूड और रुचियों पर ध्यान दें, क्योंकि यही बताते हैं कि आज वह कैसे सीखेगा।',
      },
      practiceSet: [q('A child is quiet and sluggish today. What should you consider first?', 'बच्चा आज चुप और सुस्त है। आपको सबसे पहले क्या ध्यान में रखना चाहिए?',
        [['That they are just lazy.', 'कि वह बस आलसी है।'], ['That they may be tired or upset, and check gently.', 'कि वह थका या परेशान हो सकता है, और धीरे से पूछें।']], 1)],
      test: [q('What shapes how a child learns today?', 'आज बच्चा कैसे सीखेगा, यह क्या तय करता है?',
        [['Their body, mood, and interests.', 'उनका शरीर, मूड और रुचियाँ।'], ['Only their last test score.', 'सिर्फ़ उनका पिछला टेस्ट स्कोर।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Pancha Kosha describes five layers: body, breath, mind, understanding, and joy. A student who struggles in class may be affected in one of these layers, so look beyond the subject.',
        hi: 'पंचकोश पाँच परतों का वर्णन करता है: शरीर, प्राण, मन, विज्ञान और आनंद। कक्षा में संघर्ष करने वाला छात्र इनमें से किसी परत से प्रभावित हो सकता है, इसलिए विषय से आगे देखें।',
      },
      practiceSet: [q('A student stops engaging in class. Which layer might be the cause, and what does that suggest?', 'छात्र कक्षा में रुचि लेना बंद कर देता है। कौन सी परत कारण हो सकती है, और इसका क्या संकेत है?',
        [['Only the understanding layer, so give more worksheets.', 'सिर्फ़ विज्ञान की परत, इसलिए और वर्कशीट दें।'], ['Possibly the mind or body layer, so talk to the student first.', 'शायद मन या शरीर की परत, इसलिए पहले छात्र से बात करें।']], 1)],
      test: [q('What does Pancha Kosha ask a teacher to do?', 'पंचकोश शिक्षक से क्या करने को कहता है?',
        [['Look beyond the subject to the whole student.', 'विषय से आगे पूरे छात्र को देखना।'], ['Teach only the understanding layer.', 'सिर्फ़ विज्ञान की परत पढ़ाना।']], 0)],
    },
    senior: {
      concept: {
        en: 'Senior students carry pressures across all five layers. A teacher who sees the whole student can respond to the real cause, instead of only pushing harder on the subject.',
        hi: 'वरिष्ठ छात्र पाँचों परतों में दबाव लेकर चलते हैं। पूरे छात्र को देखने वाला शिक्षक असली कारण पर प्रतिक्रिया दे सकता है, सिर्फ़ विषय पर ज़्यादा ज़ोर देने की जगह।',
      },
      practiceSet: [q('A Class 12 student\'s marks drop after a family event. What is the wisest response?', 'कक्षा 12 के छात्र के परिवार में किसी घटना के बाद अंक गिर जाते हैं। सबसे समझदार प्रतिक्रिया क्या है?',
        [['Increase homework to recover the marks quickly.', 'अंक जल्दी वापस लाने के लिए होमवर्क बढ़ाना।'], ['Check in privately and adjust the workload with care.', 'निजी तौर पर हाल पूछना और सावधानी से काम का बोझ बदलना।']], 1)],
      test: [q('Why look at the whole student?', 'पूरे छात्र को क्यों देखें?',
        [['Because the real cause may sit outside the subject.', 'क्योंकि असली कारण विषय से बाहर हो सकता है।'], ['Because marks never reflect anything else.', 'क्योंकि अंक कभी कुछ और नहीं दिखाते।']], 0)],
    },
  },
  teacher_m7: {
    primary: {
      concept: {
        en: 'Calm is contagious in a classroom. When you are steady, children settle. Notice your own tension and breathe before you respond to a noisy moment.',
        hi: 'कक्षा में शांति संक्रामक होती है। जब आप स्थिर होते हैं, तो बच्चे भी शांत हो जाते हैं। शोर वाले पल में प्रतिक्रिया देने से पहले अपना तनाव पहचानें और साँस लें।',
      },
      practiceSet: [q('The class becomes very noisy. What is the best first move?', 'कक्षा बहुत शोरगुल वाली हो जाती है। सबसे पहला अच्छा कदम क्या है?',
        [['Shout to be heard.', 'सुने जाने के लिए चिल्लाना।'], ['Pause, breathe, and wait calmly until they settle.', 'रुकना, साँस लेना, और शांत होकर इंतज़ार करना।']], 1)],
      test: [q('Why does a calm teacher help a class?', 'शांत शिक्षक कक्षा की मदद कैसे करता है?',
        [['Children settle when the adult is steady.', 'बड़े के स्थिर होने पर बच्चे भी शांत होते हैं।'], ['Calm makes lessons longer.', 'शांति से पाठ लंबे होते हैं।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Sama, dama, and uparati describe balance, self-control, and withdrawal from reactive habits. In class, they mean staying steady, controlling your response, and not reacting to every provocation.',
        hi: 'सम, दम और उपरति संतुलन, आत्म-नियंत्रण और प्रतिक्रियात्मक आदतों से दूरी को दर्शाते हैं। कक्षा में इसका मतलब है स्थिर रहना, अपनी प्रतिक्रिया पर नियंत्रण रखना, और हर उकसावे पर प्रतिक्रिया न देना।',
      },
      practiceSet: [q('A student makes a sarcastic comment to test you. What is the balanced response?', 'छात्र आपको परखने के लिए व्यंग्य करता है। संतुलित प्रतिक्रिया क्या है?',
        [['Respond with equal sarcasm.', 'उतने ही व्यंग्य के साथ जवाब देना।'], ['Stay steady, answer the question calmly, and move on.', 'स्थिर रहना, सवाल का शांति से जवाब देना, और आगे बढ़ना।']], 1)],
      test: [q('What does dama mean in classroom practice?', 'कक्षा के अभ्यास में दम का क्या अर्थ है?',
        [['Self-control in response.', 'प्रतिक्रिया में आत्म-नियंत्रण।'], ['Ignoring every student.', 'हर छात्र को नज़रअंदाज़ करना।']], 0)],
    },
    senior: {
      concept: {
        en: 'In senior classrooms, a teacher\'s steadiness protects both the discussion and the student. Manage your own reactions first, and then guide the room.',
        hi: 'वरिष्ठ कक्षाओं में शिक्षक की स्थिरता चर्चा और छात्र, दोनों की रक्षा करती है। पहले अपनी प्रतिक्रियाओं को संभालें, फिर कक्षा का मार्गदर्शन करें।',
      },
      practiceSet: [q('A heated argument breaks out between two students. What do you do first?', 'दो छात्रों के बीच गरमागरम बहस छिड़ जाती है। आप पहले क्या करते हैं?',
        [['Take sides immediately.', 'तुरंत किसी एक का पक्ष लेना।'], ['Stay composed, slow the exchange, and address the issue, not the person.', 'शांत रहना, बातचीत धीमी करना, और व्यक्ति की नहीं, मुद्दे की बात करना।']], 1)],
      test: [q('What should a teacher manage first in a heated moment?', 'गरम पल में शिक्षक को सबसे पहले क्या संभालना चाहिए?',
        [['Their own reaction.', 'अपनी प्रतिक्रिया।'], ['The timetable.', 'समय-सारणी।']], 0)],
    },
  },
  teacher_m8: {
    primary: {
      concept: {
        en: 'Young children light up when a teacher notices a small moment of understanding. Name it clearly so the child knows exactly what they did well.',
        hi: 'जब शिक्षक समझ के छोटे पल को देखते हैं, तो छोटे बच्चे खिल उठते हैं। उसका साफ़ नाम लें, ताकि बच्चे को पता चले कि उसने ठीक-ठीक क्या अच्छा किया।',
      },
      practiceSet: [q('A child suddenly understands a counting pattern. What do you say?', 'बच्चा अचानक गिनती का पैटर्न समझ जाता है। आप क्या कहते हैं?',
        [['"Good."', '"अच्छा।"'], ['"You spotted the pattern by yourself. That is exactly how it works."', '"तुमने खुद पैटर्न पकड़ लिया। यही सही तरीका है।"']], 1)],
      test: [q('What makes praise helpful for a young child?', 'छोटे बच्चे के लिए प्रशंसा मददगार कब होती है?',
        [['It names exactly what they did well.', 'वह ठीक बताती है कि उन्होंने क्या अच्छा किया।'], ['It is said very quickly.', 'वह बहुत जल्दी कही जाती है।']], 0)],
    },
    secondary: {
      concept: {
        en: 'The moment of mastery is when a student says the idea in their own words for the first time. Name what you see, so they recognise their own growth.',
        hi: 'महारत का पल वह होता है जब छात्र पहली बार विचार को अपने शब्दों में कहता है। जो आप देखते हैं उसका नाम लें, ताकि वे अपनी प्रगति को पहचान सकें।',
      },
      practiceSet: [q('A student explains a concept in their own words for the first time. What is the best response?', 'छात्र पहली बार एक अवधारणा अपने शब्दों में समझाता है। सबसे अच्छा जवाब क्या है?',
        [['"Right, now the next topic."', '"सही है, अब अगला विषय।"'], ['"You explained that in your own words. That shows you have really got it."', '"तुमने इसे अपने शब्दों में समझाया। यह दिखाता है कि तुमने सच में समझ लिया है।"']], 1)],
      test: [q('What is the moment of mastery?', 'महारत का पल क्या है?',
        [['When a student first explains an idea in their own words.', 'जब छात्र पहली बार विचार को अपने शब्दों में समझाता है।'], ['When the test is finished.', 'जब टेस्ट खत्म होता है।']], 0)],
    },
    senior: {
      concept: {
        en: 'For senior students, naming growth precisely builds identity as a learner. Point to the specific shift in their reasoning, not only the result.',
        hi: 'वरिष्ठ छात्रों के लिए विकास का सटीक नाम लेना उन्हें एक सीखने वाले के रूप में पहचान देता है। सिर्फ़ नतीजा नहीं, बल्कि उनके तर्क में आए खास बदलाव की ओर इशारा करें।',
      },
      practiceSet: [q('A student\'s proof improves noticeably this term. Which feedback is most precise?', 'इस सत्र में छात्र का प्रमाण साफ़ तौर पर सुधरता है। कौन सा फ़ीडबैक सबसे सटीक है?',
        [['"Your proof is better this term."', '"इस सत्र में तुम्हारा प्रमाण बेहतर है।"'], ['"You now justify each step before using it. That is the shift."', '"अब तुम हर कदम इस्तेमाल करने से पहले उसका कारण बताते हो। यही बदलाव है।"']], 1)],
      test: [q('Why name the specific shift in reasoning?', 'तर्क में खास बदलाव का नाम क्यों लें?',
        [['It helps the student recognise their growth as a learner.', 'इससे छात्र अपने विकास को एक सीखने वाले के रूप में पहचानता है।'], ['It makes the feedback longer.', 'इससे फ़ीडबैक लंबा होता है।']], 0)],
    },
  },
  teacher_m9: {
    primary: {
      concept: {
        en: 'Young children can feel judged by a test, even when it is meant to help. Make assessment look like play where possible, and compare each child only with their own earlier work.',
        hi: 'छोटे बच्चे टेस्ट से आँके जाने पर डर सकते हैं, भले ही वह मदद के लिए हो। जहाँ संभव हो, मूल्यांकन को खेल जैसा बनाएँ, और हर बच्चे की तुलना सिर्फ़ उसके अपने पहले काम से करें।',
      },
      practiceSet: [q('You want to know what a young child has learned. What is the fairest way?', 'आप जानना चाहते हैं कि छोटे बच्चे ने क्या सीखा है। सबसे निष्पक्ष तरीका क्या है?',
        [['Compare them with the fastest child in class.', 'उन्हें कक्षा के सबसे तेज़ बच्चे से तुलना करना।'], ['Watch them play a counting game and note what they do.', 'उन्हें गिनती का खेल खेलते देखना और लिखना कि वे क्या करते हैं।']], 1)],
      test: [q('Whom should a young child be compared with?', 'छोटे बच्चे की तुलना किससे करनी चाहिए?',
        [['Their own earlier work.', 'उनके अपने पहले के काम से।'], ['The fastest child in class.', 'कक्षा के सबसे तेज़ बच्चे से।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Fair assessment means checking the skill being tested, not the background a student comes from. Watch for bias in language, examples, and expectations, which can unfairly lower some students\' marks.',
        hi: 'निष्पक्ष मूल्यांकन का मतलब है जिस कौशल की परख हो रही है उसे जाँचना, न कि छात्र की पृष्ठभूमि को। भाषा, उदाहरणों और उम्मीदों में पूर्वाग्रह पर ध्यान दें, जो कुछ छात्रों के अंक अनुचित रूप से कम कर सकता है।',
      },
      practiceSet: [q('A word problem uses a sport few students in your class know. What is the fairer choice?', 'एक शब्द-सवाल में ऐसे खेल का उदाहरण है जो कक्षा के ज़्यादातर छात्र नहीं जानते। निष्पक्ष विकल्प क्या है?',
        [['Keep it, students should learn about all sports.', 'इसे रखना, छात्रों को सभी खेलों के बारे में सीखना चाहिए।'], ['Use a familiar context, so the maths is what is being tested.', 'कोई जानी-पहचानी स्थिति लेना, ताकि गणित ही परखा जाए।']], 1)],
      test: [q('What should a fair assessment test?', 'निष्पक्ष मूल्यांकन किसकी परख करता है?',
        [['The skill being tested, not the student\'s background.', 'जिस कौशल की परख हो रही है, छात्र की पृष्ठभूमि नहीं।'], ['How familiar the student is with the context.', 'छात्र उस संदर्भ से कितना परिचित है।']], 0)],
    },
    senior: {
      concept: {
        en: 'Senior assessments can carry hidden bias through wording, cultural references, and assumptions about access to resources. Review each question for what it quietly assumes about the student.',
        hi: 'वरिष्ठ मूल्यांकनों में शब्दों, सांस्कृतिक संदर्भों और संसाधनों की पहुँच के बारे में धारणाओं से छिपा पूर्वाग्रह हो सकता है। हर सवाल की जाँच करें कि वह छात्र के बारे में चुपचाप क्या मानकर चलता है।',
      },
      practiceSet: [q('A question assumes every student has a personal computer at home. What should you do?', 'एक सवाल मानकर चलता है कि हर छात्र के घर पर निजी कंप्यूटर है। आपको क्या करना चाहिए?',
        [['Leave it, it is a common assumption.', 'इसे रहने देना, यह आम धारणा है।'], ['Rewrite it so the maths does not depend on home resources.', 'इसे ऐसे दोबारा लिखना कि गणित घर के संसाधनों पर निर्भर न हो।']], 1)],
      test: [q('What does a fair review of a question check?', 'सवाल की निष्पक्ष समीक्षा क्या जाँचती है?',
        [['What the question quietly assumes about the student.', 'सवाल छात्र के बारे में चुपचाप क्या मानकर चलता है।'], ['How long the question is.', 'सवाल कितना लंबा है।']], 0)],
    },
  },
  teacher_m10: {
    primary: {
      concept: {
        en: 'A teacher who keeps learning shows children that learning never stops. Admit what you do not know, and find it out together with the class.',
        hi: 'जो शिक्षक सीखना जारी रखता है, वह बच्चों को दिखाता है कि सीखना कभी नहीं रुकता। जो आप नहीं जानते उसे स्वीकार करें, और कक्षा के साथ मिलकर उसे खोजें।',
      },
      practiceSet: [q('A child asks a question you cannot answer. What is the best response?', 'बच्चा एक ऐसा सवाल पूछता है जिसका जवाब आप नहीं जानते। सबसे अच्छा जवाब क्या है?',
        [['Make up an answer quickly.', 'जल्दी से कोई जवाब गढ़ देना।'], ['"I do not know yet. Let us find out together."', '"मुझे अभी नहीं पता। चलो मिलकर पता करते हैं।"']], 1)],
      test: [q('What does a teacher who admits not knowing teach children?', 'जो शिक्षक नहीं जानते यह स्वीकार करता है, वह बच्चों को क्या सिखाता है?',
        [['That learning never stops.', 'कि सीखना कभी नहीं रुकता।'], ['That teachers must always know everything.', 'कि शिक्षक को हमेशा सब कुछ पता होना चाहिए।']], 0)],
    },
    secondary: {
      concept: {
        en: 'Neti neti means "not this, not this", a method of understanding by letting go of what something is not. Teachers can use it to refine their own understanding, and to model humility with students.',
        hi: 'नेति नेति का अर्थ है "यह नहीं, यह नहीं", यानी जो चीज़ नहीं है उसे छोड़ते हुए समझने का तरीका। शिक्षक इसे अपनी समझ सुधारने और छात्रों के सामने विनम्रता दिखाने के लिए इस्तेमाल कर सकते हैं।',
      },
      practiceSet: [q('You realise your explanation of a topic was wrong. What do you do?', 'आपको पता चलता है कि किसी विषय पर आपकी व्याख्या गलत थी। आप क्या करते हैं?',
        [['Hide the mistake and move on.', 'गलती छिपाकर आगे बढ़ना।'], ['Admit it, correct it in class, and thank the student who noticed.', 'गलती स्वीकार करना, कक्षा में सुधारना, और ध्यान दिलाने वाले छात्र का धन्यवाद करना।']], 1)],
      test: [q('What does neti neti help a teacher do?', 'नेति नेति शिक्षक को क्या करने में मदद करता है?',
        [['Refine their understanding by letting go of what is not true.', 'जो सच नहीं है उसे छोड़कर अपनी समझ सुधारना।'], ['Avoid all questions from students.', 'छात्रों के सभी सवालों से बचना।']], 0)],
    },
    senior: {
      concept: {
        en: 'Senior teachers who keep learning model intellectual honesty for students who are preparing for demanding futures. Read widely, test your own assumptions, and share what you change your mind about.',
        hi: 'जो वरिष्ठ शिक्षक सीखना जारी रखते हैं, वे कठिन भविष्य की तैयारी कर रहे छात्रों के सामने बौद्धिक ईमानदारी का उदाहरण रखते हैं। व्यापक पढ़ें, अपनी धारणाओं को परखें, और बताएँ कि आपने किस बात पर अपनी राय बदली।',
      },
      practiceSet: [q('A teacher changes their view after new evidence. What does this teach students?', 'नए सबूत के बाद एक शिक्षक अपनी राय बदलता है। इससे छात्रों को क्या सिखाया जाता है?',
        [['That changing your mind is a weakness.', 'कि राय बदलना कमज़ोरी है।'], ['That following evidence is a strength.', 'कि सबूत का अनुसरण करना ताकत है।']], 1)],
      test: [q('Why should senior teachers share what they changed their mind about?', 'वरिष्ठ शिक्षकों को अपनी राय बदलने की बात क्यों साझा करनी चाहिए?',
        [['It models intellectual honesty for students.', 'इससे छात्रों के सामने बौद्धिक ईमानदारी का उदाहरण बनता है।'], ['It makes the teacher look more certain.', 'इससे शिक्षक ज़्यादा निश्चित दिखता है।']], 0)],
    },
  },
};
