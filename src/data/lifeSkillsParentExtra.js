// Parent track, modules 3 onward. Same structure as the original modules:
// three age tiers (primary: Class 1-5, secondary: Class 6-10, teen: Class 10-12),
// each with a concept, three steps, a practice question and a test question.
// Hindi is written for native readers. Review before publishing.

export const PARENT_EXTRA_MODULES = [
  {
    id: 'parent_m3',
    order: 3,
    title: { en: 'Listening Before Advising', hi: 'सलाह देने से पहले सुनना' },
    tiers: {
      primary: {
        concept: {
          en: 'Young children often need to be heard before they can hear advice. When a child tells you about a friend, a teacher, or a hard day, the first response matters most. If we jump in with a fix, the child learns that their feelings are a problem to solve. If we listen first, they learn that they can come to us.',
          hi: 'छोटे बच्चों को सलाह सुनने से पहले अक्सर खुद को सुने जाने की ज़रूरत होती है। जब बच्चा दोस्त, टीचर या किसी मुश्किल दिन के बारे में बताता है, तो आपकी पहली प्रतिक्रिया सबसे ज़्यादा मायने रखती है। अगर हम तुरंत हल बताने लगें, तो बच्चा सीखता है कि उसकी भावनाएँ कोई समस्या हैं। अगर पहले सुनें, तो वह सीखता है कि वह हमारे पास आ सकता है।',
        },
        steps: [
          { en: 'Stop what you are doing and look at your child when they start talking.', hi: 'जब बच्चा बोलना शुरू करे, तो जो कर रहे हैं उसे रोककर उसकी ओर देखें।' },
          { en: 'Repeat back the feeling in simple words: "That sounds like it made you sad."', hi: 'भावना को सरल शब्दों में दोहराएँ: "लगता है इससे तुम्हें दुख हुआ।"' },
          { en: 'Ask one open question before giving any advice, such as "What happened next?"', hi: 'कोई सलाह देने से पहले एक खुला सवाल पूछें, जैसे "उसके बाद क्या हुआ?"' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 7-year-old says, "Nobody wanted to play with me today." What is the best first response?', hi: 'आपका 7 साल का बच्चा कहता है, "आज कोई मेरे साथ खेलना नहीं चाहता था।" पहली सबसे अच्छी प्रतिक्रिया क्या होगी?' },
            options: [
              { en: '"Then go and play with someone else."', hi: '"तो जाकर किसी और के साथ खेलो।"' },
              { en: '"That sounds lonely. What happened?"', hi: '"लगता है तुम्हें अकेलापन लगा होगा। क्या हुआ था?"' },
              { en: '"Don\'t worry, everyone is mean sometimes."', hi: '"चिंता मत करो, कभी-कभी सब बुरे होते हैं।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Which response lets your child keep talking?', hi: 'कौन सी प्रतिक्रिया बच्चे को बात करते रहने देती है?' },
            options: [
              { en: '"Stop complaining and focus on your homework."', hi: '"शिकायत मत करो, होमवर्क पर ध्यान दो।"' },
              { en: '"Tell me more about what happened."', hi: '"मुझे और बताओ कि क्या हुआ था।"' },
            ],
            correct: 1,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often share problems in small pieces and watch how we react. A quick lecture or a sharp "just study harder" can close the conversation for weeks. Listening first, without judgment, makes them more willing to bring real problems to you, including the ones that matter most, like bullying or pressure from friends.',
          hi: 'ग्यारह से पंद्रह साल के बच्चे अक्सर अपनी समस्याएँ छोटे-छोटे हिस्सों में बताते हैं और देखते हैं कि हम कैसे प्रतिक्रिया देते हैं। एक जल्दबाज़ी वाला भाषण या "बस और मेहनत करो" कहने से बातचीत हफ्तों के लिए बंद हो सकती है। बिना फैसला सुनाए पहले सुनने से वे असली समस्याएँ भी आपको बताने लगते हैं, जैसे धमकाया जाना या दोस्तों का दबाव।',
        },
        steps: [
          { en: 'Wait for the full sentence before you respond, even if you already know the answer.', hi: 'जवाब देने से पहले पूरा वाक्य सुनें, भले ही आपको जवाब पहले से पता हो।' },
          { en: 'Name what you hear without judging it: "So you felt left out and a bit angry."', hi: 'जो सुनें उसे बिना फैसला सुनाए बताएँ: "तो तुम्हें अकेला छूटा हुआ और थोड़ा गुस्सा महसूस हुआ।"' },
          { en: 'Ask before you advise: "Do you want ideas, or do you just want me to listen?"', hi: 'सलाह देने से पहले पूछें: "तुम्हें सुझाव चाहिए, या बस कोई सुने?"' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 13-year-old says the coach is unfair and they want to quit the team. What should you do first?', hi: 'आपका 13 साल का बच्चा कहता है कि कोच अन्यायपूर्ण है और वह टीम छोड़ना चाहता है। आपको पहले क्या करना चाहिए?' },
            options: [
              { en: 'Call the coach immediately.', hi: 'तुरंत कोच को फ़ोन करें।' },
              { en: 'Ask what happened and how it felt before deciding anything.', hi: 'कुछ तय करने से पहले पूछें कि क्या हुआ और कैसा लगा।' },
              { en: 'Tell them quitting is never an option.', hi: 'बताएँ कि टीम छोड़ना कभी विकल्प नहीं है।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What is the main purpose of listening first?', hi: 'पहले सुनने का मुख्य उद्देश्य क्या है?' },
            options: [
              { en: 'To delay giving an answer.', hi: 'जवाब देने में देरी करना।' },
              { en: 'So your child feels safe bringing real problems to you.', hi: 'ताकि बच्चा आपके पास असली समस्याएँ लाने में सुरक्षित महसूस करे।' },
            ],
            correct: 1,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Teenagers in Class 10 to 12 are working out who they are. They will often stop talking the moment they sense a lecture coming. Listening without immediately fixing things signals that you respect their judgment. It also gives you the chance to notice what matters to them, such as exam pressure, friendships, or future choices.',
          hi: 'कक्षा 10 से 12 के किशोर यह समझ रहे होते हैं कि वे कौन हैं। जैसे ही उन्हें भाषण का अंदेशा होता है, वे अक्सर बात करना बंद कर देते हैं। बिना तुरंत हल बताए सुनना यह दिखाता है कि आप उनकी समझ का सम्मान करते हैं। इससे आपको यह भी पता चलता है कि उनके लिए क्या मायने रखता है, जैसे परीक्षा का दबाव, दोस्ती या भविष्य के फैसले।',
        },
        steps: [
          { en: 'Ask about their day without a plan to correct anything.', hi: 'बिना किसी बात को सुधारने की योजना के उनके दिन के बारे में पूछें।' },
          { en: 'Reflect the stress you hear, not the conclusion you expect: "This exam has you really worried."', hi: 'आपको जो तनाव सुनाई दे, उसे दोहराएँ, अपने अनुमानित निष्कर्ष को नहीं: "इस परीक्षा को लेकर तुम सच में चिंतित हो।"' },
          { en: 'Leave silence for a few seconds after they finish. Often the most useful thing comes next.', hi: 'उनके बात खत्म करने के बाद कुछ सेकंड चुप रहें। अक्सर सबसे उपयोगी बात उसी के बाद आती है।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 16-year-old says, "I am going to fail the boards anyway." What is the most helpful reply?', hi: 'आपका 16 साल का बच्चा कहता है, "मैं वैसे भी बोर्ड में फेल हो जाऊँगा।" सबसे मददगार जवाब क्या होगा?' },
            options: [
              { en: '"Don\'t say that, you are very smart."', hi: '"ऐसा मत कहो, तुम बहुत होशियार हो।"' },
              { en: '"That sounds like a lot of pressure. What feels hardest right now?"', hi: '"लगता है इस पर बहुत दबाव है। अभी सबसे मुश्किल क्या लग रहा है?"' },
              { en: '"Then you need to study at least six hours a day."', hi: '"तो तुम्हें रोज़ कम से कम छह घंटे पढ़ना होगा।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What is most likely to end a teen\'s open conversation?', hi: 'किशोर की खुली बातचीत को सबसे ज़्यादा क्या बंद करता है?' },
            options: [
              { en: 'A quiet pause after they speak.', hi: 'उनके बोलने के बाद एक शांत विराम।' },
              { en: 'Jumping straight to a lecture about what they should do.', hi: 'सीधे यह बताना कि उन्हें क्या करना चाहिए।' },
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m4',
    order: 4,
    title: { en: 'Praise That Builds Effort', hi: 'ऐसी प्रशंसा जो मेहनत बढ़ाए' },
    tiers: {
      primary: {
        concept: {
          en: 'Children learn what we notice. Praise for being clever ("you are so smart") can make a child afraid to try things they might fail at. Praise for effort and strategy ("you kept trying different ways until it worked") teaches them that improvement is in their hands.',
          hi: 'बच्चे वही सीखते हैं जिस पर हम ध्यान देते हैं। "तुम बहुत होशियार हो" जैसी प्रशंसा बच्चे को उन कामों से डरा सकती है जिनमें वह असफल हो सकता है। मेहनत और तरीके की प्रशंसा ("जब तक काम नहीं हुआ, तुम अलग-अलग तरीके आज़माते रहे") सिखाती है कि सुधार उनके हाथ में है।',
        },
        steps: [
          { en: 'Name the specific action you saw: "You checked your answer twice."', hi: 'जो खास काम आपने देखा उसका नाम लें: "तुमने जवाब दो बार जाँचा।"' },
          { en: 'Praise the effort or the strategy, not the person.', hi: 'व्यक्ति की नहीं, बल्कि मेहनत या तरीके की प्रशंसा करें।' },
          { en: 'Ask what they will try next time, so they own the next step.', hi: 'पूछें कि अगली बार वे क्या आज़माएँगे, ताकि अगला कदम उनका अपना हो।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your child finishes a hard puzzle. Which praise builds effort?', hi: 'आपका बच्चा एक कठिन पहेली पूरी करता है। कौन सी प्रशंसा मेहनत बढ़ाती है?' },
            options: [
              { en: '"You are a genius."', hi: '"तुम तो जीनियस हो।"' },
              { en: '"You kept trying different pieces until it fit. That was patient."', hi: '"तुम अलग-अलग टुकड़े आज़माते रहे जब तक वह फिट नहीं हुआ। यह धैर्य था।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Which praise focuses on what the child can control?', hi: 'कौन सी प्रशंसा उस पर केंद्रित है जिस पर बच्चे का नियंत्रण है?' },
            options: [
              { en: '"You were born good at this."', hi: '"तुम इसमें पैदाइशी अच्छे हो।"' },
              { en: '"You practised every day, and it shows."', hi: '"तुमने हर दिन अभ्यास किया, और वह दिख रहा है।"' },
            ],
            correct: 1,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 can tell when praise is empty. "Good job" after an easy task teaches them nothing. Specific praise for a strategy or a hard choice tells them what to repeat. Praise that connects effort to a result helps them see that their choices affect outcomes.',
          hi: 'ग्यारह से पंद्रह साल के बच्चे पहचान लेते हैं कि प्रशंसा खोखली है या नहीं। किसी आसान काम पर "शाबाश" कहने से उन्हें कुछ नहीं सिखाया जाता। किसी तरीके या कठिन फैसले की खास प्रशंसा उन्हें बताती है कि क्या दोहराना है। मेहनत को नतीजे से जोड़ने वाली प्रशंसा उन्हें दिखाती है कि उनके चुनाव नतीजों को बदलते हैं।',
        },
        steps: [
          { en: 'Praise the choice that led to the result: "Starting with the hardest question was a smart move."', hi: 'नतीजे तक ले जाने वाले चुनाव की प्रशंसा करें: "सबसे कठिन सवाल से शुरू करना एक समझदारी भरा फैसला था।"' },
          { en: 'Avoid comparing them to siblings or classmates, even as praise.', hi: 'प्रशंसा के रूप में भी भाई-बहनों या सहपाठियों से तुलना न करें।' },
          { en: 'Ask them to explain their method. Explaining reinforces what worked.', hi: 'उनसे अपना तरीका समझाने को कहें। समझाने से जो काम आया वह पक्का होता है।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 12-year-old improves their score from 45% to 68%. What is the most useful praise?', hi: 'आपके 12 साल के बच्चे का स्कोर 45% से 68% हो जाता है। सबसे उपयोगी प्रशंसा क्या है?' },
            options: [
              { en: '"Your cousin never got that high."', hi: '"तुम्हारे चचेरे भाई का स्कोर तो कभी इतना नहीं आया।"' },
              { en: '"Your revision plan clearly worked. What did you change?"', hi: '"तुम्हारी रिवीज़न योजना साफ़ तौर पर काम आई। तुमने क्या बदला?"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Why is praise for a strategy more useful than praise for talent?', hi: 'हुनर की जगह किसी तरीके की प्रशंसा ज़्यादा उपयोगी क्यों है?' },
            options: [
              { en: 'Because it tells the student what to repeat next time.', hi: 'क्योंकि इससे छात्र को पता चलता है कि अगली बार क्या दोहराना है।' },
              { en: 'Because it makes the student feel more special.', hi: 'क्योंकि इससे छात्र को ज़्यादा खास महसूस होता है।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Teenagers in Class 10 to 12 often dismiss praise that feels generic. They respond better to praise that shows you noticed the thinking behind their work. It also helps to praise persistence through setbacks, since they will face many in the coming years.',
          hi: 'कक्षा 10 से 12 के किशोर अक्सर उस प्रशंसा को टाल देते हैं जो सामान्य लगती है। वे उस प्रशंसा पर बेहतर प्रतिक्रिया देते हैं जो दिखाती है कि आपने उनकी सोच पर ध्यान दिया। असफलताओं के बीच टिके रहने की प्रशंसा भी मदद करती है, क्योंकि आने वाले वर्षों में उन्हें ऐसी कई स्थितियों का सामना करना होगा।',
        },
        steps: [
          { en: 'Name the thinking: "You changed your approach after the mock test. That was a real decision."', hi: 'सोच का नाम लें: "मॉक टेस्ट के बाद तुमने अपना तरीका बदला। वह एक असली फैसला था।"' },
          { en: 'Praise recovery after a setback, not only the final result.', hi: 'सिर्फ़ अंतिम नतीजे की नहीं, बल्कि झटके के बाद वापसी की भी प्रशंसा करें।' },
          { en: 'Keep praise short and specific. Long speeches are easy to tune out.', hi: 'प्रशंसा छोटी और खास रखें। लंबे भाषण आसानी से अनसुने हो जाते हैं।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 17-year-old recovers from a bad mock test and gets a strong score the next month. Which response is best?', hi: 'आपका 17 साल का बच्चा खराब मॉक टेस्ट के बाद अगले महीने अच्छा स्कोर लाता है। कौन सी प्रतिक्रिया सबसे अच्छी है?' },
            options: [
              { en: '"Good, now you can relax."', hi: '"अच्छा है, अब आराम कर सकते हो।"' },
              { en: '"You rebuilt your plan after the bad test and stuck to it. That recovery is worth noticing."', hi: '"खराब टेस्ट के बाद तुमने अपनी योजना नए सिरे से बनाई और उस पर टिके रहे। वह वापसी ध्यान देने लायक है।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What makes praise feel real to a teenager?', hi: 'किशोर को प्रशंसा असली कब लगती है?' },
            options: [
              { en: 'Long and general compliments.', hi: 'लंबी और सामान्य तारीफ़ें।' },
              { en: 'A short comment on a specific decision they made.', hi: 'उनके किसी खास फैसले पर एक छोटी टिप्पणी।' },
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m5',
    order: 5,
    title: { en: 'Handling Comparison With Siblings and Classmates', hi: 'भाई-बहनों और सहपाठियों से तुलना को संभालना' },
    tiers: {
      primary: {
        concept: {
          en: 'Young children compare themselves constantly, and a comparison can turn into hurt quickly. When a child says "Riya got more stars than me," they are often asking whether they are loved and capable. Acknowledge the feeling, then focus on the child\'s own progress instead of the other child\'s result.',
          hi: 'छोटे बच्चे लगातार खुद की तुलना करते हैं, और तुलना जल्दी दुख में बदल सकती है। जब बच्चा कहता है "रिया को मुझसे ज़्यादा स्टार मिले," तो अक्सर वह पूछ रहा होता है कि क्या वह प्यारा और सक्षम है। पहले भावना को स्वीकार करें, फिर दूसरे बच्चे के नतीजे की जगह अपने बच्चे की अपनी प्रगति पर ध्यान दें।',
        },
        steps: [
          { en: 'Say the feeling out loud: "It hurts when someone else gets the star."', hi: 'भावना को शब्दों में कहें: "जब किसी और को स्टार मिलता है तो दुख होता है।"' },
          { en: 'Point to your child\'s own change: "Last month you could not do this. Look at you now."', hi: 'बच्चे का अपना बदलाव दिखाएँ: "पिछले महीने तुम यह नहीं कर पाते थे। अब देखो।"' },
          { en: 'Avoid saying "Don\'t compare" as the only reply. Show them a fair way to measure themselves.', hi: 'सिर्फ़ "तुलना मत करो" कहकर बात खत्म न करें। उन्हें खुद को आँकने का एक सही तरीका दिखाएँ।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 8-year-old says, "My brother is better at everything." What is the best reply?', hi: 'आपका 8 साल का बच्चा कहता है, "मेरा भाई हर काम में मुझसे अच्छा है।" सबसे अच्छा जवाब क्या है?' },
            options: [
              { en: '"Stop comparing yourself, every child is different."', hi: '"तुलना करना बंद करो, हर बच्चा अलग होता है।"' },
              { en: '"That feels unfair. Which thing do you want to get better at?"', hi: '"यह अनुचित लगता है। तुम किस चीज़ में और अच्छे होना चाहते हो?"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What helps a child stop comparing?', hi: 'बच्चे को तुलना करना छोड़ने में क्या मदद करता है?' },
            options: [
              { en: 'Seeing their own progress over time.', hi: 'समय के साथ अपनी प्रगति देखना।' },
              { en: 'Being told the other child has problems.', hi: 'यह सुनना कि दूसरे बच्चे में कमियाँ हैं।' },
            ],
            correct: 0,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 compare grades, friends, and appearance, often without saying so. Comparison with siblings can build resentment that lasts into adulthood. Shift the focus from ranking to growth, and be careful not to compare your child to an older sibling at the same age.',
          hi: 'ग्यारह से पंद्रह साल के बच्चे अंकों, दोस्तों और रूप की तुलना करते हैं, अक्सर बिना कहे। भाई-बहनों से तुलना से ऐसी नाराज़गी पनप सकती है जो बड़े होने तक बनी रहती है। ध्यान रैंकिंग से हटाकर विकास पर लाएँ, और अपने बच्चे की तुलना उसी उम्र के बड़े भाई-बहन से करने से बचें।',
        },
        steps: [
          { en: 'Notice when you compare, even casually, such as "Why can\'t you be like your sister?"', hi: 'ध्यान दें कि आप कब तुलना करते हैं, भले ही हल्के में, जैसे "तुम अपनी बहन जैसे क्यों नहीं हो?"' },
          { en: 'Talk about what they enjoy and value, not only marks.', hi: 'सिर्फ़ अंकों की नहीं, बल्कि उन्हें जो पसंद है और जो उनके लिए मायने रखता है, उस पर बात करें।' },
          { en: 'Ask: "Compared to last term, what has got easier for you?"', hi: 'पूछें: "पिछले सत्र की तुलना में अब तुम्हारे लिए क्या आसान हुआ है?"' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 12-year-old is upset that a classmate scored higher. Which response builds the child up?', hi: 'आपका 12 साल का बच्चा इस बात से परेशान है कि एक सहपाठी का स्कोर ज़्यादा आया। कौन सी प्रतिक्रिया बच्चे का हौसला बढ़ाती है?' },
            options: [
              { en: '"Their marks are not your concern. What did you improve this time?"', hi: '"उनके अंक तुम्हारी चिंता नहीं हैं। इस बार तुमने क्या सुधारा?"' },
              { en: '"You should try to beat them next time."', hi: '"अगली बार तुम्हें उन्हें हराना चाहिए।"' },
            ],
            correct: 0,
          },
        ],
        test: [
          {
            q: { en: 'Why is comparing a child to an older sibling of the same age harmful?', hi: 'किसी बच्चे की तुलना उसी उम्र के बड़े भाई-बहन से करना हानिकारक क्यों है?' },
            options: [
              { en: 'It can create lasting resentment and lower the child\'s confidence.', hi: 'इससे स्थायी नाराज़गी पैदा हो सकती है और बच्चे का आत्मविश्वास घट सकता है।' },
              { en: 'It always motivates children to work harder.', hi: 'इससे बच्चे हमेशा ज़्यादा मेहनत करने लगते हैं।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Teenagers in Class 10 to 12 compare themselves to peers on social media, on rank lists, and against family expectations. Constant comparison can turn into anxiety and self-doubt. Help your teen define success in their own terms, and talk openly about how comparison shows up in their life.',
          hi: 'कक्षा 10 से 12 के किशोर सोशल मीडिया, रैंक सूचियों और परिवार की उम्मीदों पर अपने साथियों से खुद की तुलना करते हैं। लगातार तुलना चिंता और खुद पर शक में बदल सकती है। किशोर को सफलता को अपनी शर्तों पर परिभाषित करने में मदद करें, और खुलकर बात करें कि तुलना उनकी ज़िंदगी में कहाँ दिखती है।',
        },
        steps: [
          { en: 'Ask where they feel the pressure most: marks, friends, social media, or your expectations.', hi: 'पूछें कि दबाव उन्हें सबसे ज़्यादा कहाँ महसूस होता है: अंक, दोस्त, सोशल मीडिया, या आपकी उम्मीदें।' },
          { en: 'Acknowledge your own part, such as "I have compared you to cousins before, and I am sorry."', hi: 'अपनी भूमिका भी स्वीकार करें, जैसे "मैंने पहले भी तुम्हारी तुलना चचेरे भाई-बहनों से की है, और उसके लिए माफ़ी।"' },
          { en: 'Help them write down two things they want for themselves, separate from what others expect.', hi: 'उन्हें दो ऐसी बातें लिखने में मदद करें जो वे खुद चाहते हैं, दूसरों की उम्मीदों से अलग।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 16-year-old says, "Everyone on my feed is doing better than me." What is the most helpful response?', hi: 'आपका 16 साल का बच्चा कहता है, "मेरी फ़ीड पर सब मुझसे बेहतर कर रहे हैं।" सबसे मददगार जवाब क्या है?' },
            options: [
              { en: '"Then delete the app right now."', hi: '"तो अभी ऐप डिलीट कर दो।"' },
              { en: '"Social media shows highlights, not the whole story. What do you feel when you scroll?"', hi: '"सोशल मीडिया में सिर्फ़ झलकियाँ दिखती हैं, पूरी कहानी नहीं। स्क्रॉल करते समय तुम्हें कैसा लगता है?"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What helps a teen define success on their own terms?', hi: 'किशोर को अपनी शर्तों पर सफलता परिभाषित करने में क्या मदद करता है?' },
            options: [
              { en: 'Writing down what they want, separate from others\' expectations.', hi: 'अपनी चाहत लिखना, दूसरों की उम्मीदों से अलग।' },
              { en: 'Comparing their rank with the top student every week.', hi: 'हर हफ्ते अपनी रैंक को सबसे अच्छे छात्र से मिलाना।' },
            ],
            correct: 0,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m6',
    order: 6,
    title: { en: 'Screen Time and Study Routines', hi: 'स्क्रीन टाइम और पढ़ाई की दिनचर्या' },
    tiers: {
      primary: {
        concept: {
          en: 'Young children do best with short, predictable routines. A fixed time for homework, a clear end to screen time, and a calm transition between them help a child settle. Rules work better when they are the same every day and explained simply.',
          hi: 'छोटे बच्चे छोटी और अनुमानित दिनचर्या में सबसे अच्छा करते हैं। होमवर्क का एक तय समय, स्क्रीन टाइम का साफ़ अंत, और दोनों के बीच शांत बदलाव बच्चे को स्थिर रखने में मदद करते हैं। नियम तब बेहतर काम करते हैं जब वे हर दिन एक जैसे हों और सरल शब्दों में समझाए जाएँ।',
        },
        steps: [
          { en: 'Pick one fixed homework time and keep it every day, even on weekends.', hi: 'होमवर्क का एक तय समय चुनें और हर दिन उसी पर कायम रहें, सप्ताहांत पर भी।' },
          { en: 'Give a five-minute warning before screen time ends, so the switch is gentle.', hi: 'स्क्रीन टाइम खत्म होने से पाँच मिनट पहले चेतावनी दें, ताकि बदलाव आसान रहे।' },
          { en: 'Praise the routine itself: "You started on time today. That was easy to see."', hi: 'दिनचर्या की ही प्रशंसा करें: "आज तुमने समय पर शुरू किया। यह देखना अच्छा लगा।"' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 6-year-old protests every time screen time ends. What works best?', hi: 'आपका 6 साल का बच्चा हर बार स्क्रीन टाइम खत्म होने पर विरोध करता है। सबसे अच्छा क्या काम करता है?' },
            options: [
              { en: 'Take the tablet away suddenly without warning.', hi: 'बिना चेतावनी के अचानक टैबलेट ले लेना।' },
              { en: 'Give a five-minute warning and a clear next activity.', hi: 'पाँच मिनट की चेतावनी और अगली गतिविधि साफ़ बताना।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What makes a routine work for a young child?', hi: 'छोटे बच्चे के लिए दिनचर्या कब काम करती है?' },
            options: [
              { en: 'Being the same, predictable, and explained simply.', hi: 'एक जैसी, अनुमानित और सरल शब्दों में समझाई हुई होना।' },
              { en: 'Changing the timing every day to keep it exciting.', hi: 'रोज़ समय बदलना ताकि मज़ा बना रहे।' },
            ],
            correct: 0,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 often use screens for both study and distraction, so banning devices outright rarely works. Agree on a routine together: when study happens, which devices stay in another room, and what counts as a break. Students follow routines they helped create.',
          hi: 'ग्यारह से पंद्रह साल के बच्चे स्क्रीन का इस्तेमाल पढ़ाई और ध्यान भटकाने, दोनों के लिए करते हैं, इसलिए पूरी तरह रोक अक्सर काम नहीं करती। साथ मिलकर एक दिनचर्या तय करें: पढ़ाई कब होगी, कौन से उपकरण दूसरे कमरे में रहेंगे, और ब्रेक में क्या गिना जाएगा। छात्र उस दिनचर्या का पालन ज़्यादा करते हैं जिसे बनाने में उनकी भी भूमिका हो।',
        },
        steps: [
          { en: 'Agree on a study block together, and write it down where both of you can see it.', hi: 'पढ़ाई का एक समय मिलकर तय करें, और उसे ऐसी जगह लिखें जहाँ दोनों देख सकें।' },
          { en: 'Keep phones outside the study room during the block, and agree on the rule ahead of time.', hi: 'पढ़ाई के समय फ़ोन पढ़ाई वाले कमरे से बाहर रखें, और नियम पहले से तय करें।' },
          { en: 'Review the routine once a week. Change what is not working.', hi: 'हर हफ्ते दिनचर्या की समीक्षा करें। जो काम नहीं कर रहा, उसे बदलें।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 13-year-old keeps checking their phone during homework. What is the most effective first step?', hi: 'आपका 13 साल का बच्चा होमवर्क के दौरान बार-बार फ़ोन देखता रहता है। पहला सबसे असरदार कदम क्या है?' },
            options: [
              { en: 'Take the phone and punish them for the whole week.', hi: 'पूरे हफ्ते के लिए फ़ोन ले लेना और सज़ा देना।' },
              { en: 'Agree together on a study block with phones kept in another room.', hi: 'फ़ोन दूसरे कमरे में रखने वाले पढ़ाई के समय पर मिलकर सहमत होना।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Why do students follow routines they help create?', hi: 'छात्र उन दिनचर्याओं का पालन क्यों करते हैं जिन्हें बनाने में उनकी भूमिका हो?' },
            options: [
              { en: 'Because they have a stake in it and feel respected.', hi: 'क्योंकि उनकी उसमें हिस्सेदारी होती है और उन्हें सम्मान महसूस होता है।' },
              { en: 'Because adults never change a routine once it is set.', hi: 'क्योंकि बड़े एक बार तय दिनचर्या कभी नहीं बदलते।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Teenagers in Class 10 to 12 need study routines that fit real life: tuition, sports, sleep, and phones. Screens are also tools for revision and online test practice. A useful approach is to judge screen use by its effect on sleep and focus, not by the clock alone.',
          hi: 'कक्षा 10 से 12 के किशोरों को ऐसी पढ़ाई की दिनचर्या चाहिए जो असली ज़िंदगी में फिट हो: ट्यूशन, खेल, नींद और फ़ोन। स्क्रीन रिवीज़न और ऑनलाइन टेस्ट अभ्यास के लिए भी उपयोगी साधन है। एक सही तरीका यह है कि स्क्रीन के इस्तेमाल को सिर्फ़ घड़ी से नहीं, बल्कि नींद और ध्यान पर उसके असर से आँकें।',
        },
        steps: [
          { en: 'Ask them to track one week of screen use and sleep. Look at the pattern together.', hi: 'एक हफ्ते का स्क्रीन इस्तेमाल और नींद लिखने को कहें। पैटर्न मिलकर देखें।' },
          { en: 'Protect sleep first. Set a time when devices go to charge outside the bedroom.', hi: 'पहले नींद की रक्षा करें। एक समय तय करें जब उपकरण बेडरूम के बाहर चार्ज हों।' },
          { en: 'Separate study screens from leisure screens, so revision apps do not become entertainment.', hi: 'पढ़ाई वाली स्क्रीन और मनोरंजन वाली स्क्रीन अलग रखें, ताकि रिवीज़न ऐप्स मनोरंजन न बन जाएँ।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 17-year-old studies late and sleeps very little before boards. What should you focus on?', hi: 'आपका 17 साल का बच्चा बोर्ड से पहले देर रात तक पढ़ता है और बहुत कम सोता है। आपको किस पर ध्यान देना चाहिए?' },
            options: [
              { en: 'Only the total hours of study, however tired they are.', hi: 'सिर्फ़ कुल पढ़ाई के घंटे, चाहे वे कितने भी थके हों।' },
              { en: 'How sleep and focus are being affected, and a fixed time for devices to stop.', hi: 'नींद और ध्यान पर असर, और उपकरण बंद करने का एक तय समय।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What is a better measure of healthy screen use for a teen?', hi: 'किशोर के लिए स्वस्थ स्क्रीन इस्तेमाल का बेहतर पैमाना क्या है?' },
            options: [
              { en: 'Its effect on sleep and focus.', hi: 'नींद और ध्यान पर उसका असर।' },
              { en: 'The number of minutes on the clock alone.', hi: 'सिर्फ़ घड़ी पर बीते मिनट।' },
            ],
            correct: 0,
          },
        ],
      },
    },
  },
];
