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
  {
    id: 'parent_m7',
    order: 7,
    title: { en: 'When Your Child Says "I Hate Maths"', hi: 'जब बच्चा कहे "मुझे गणित से नफ़रत है"' },
    tiers: {
      primary: {
        concept: {
          en: 'A young child who says "I hate maths" usually means "this feels hard and I feel bad." Hatred is often a protection against feeling stupid. Show them that maths can be playful and that mistakes are part of learning.',
          hi: 'छोटा बच्चा जब कहता है "मुझे गणित से नफ़रत है," तो अक्सर उसका मतलब होता है "यह मुश्किल लगता है और मुझे बुरा लगता है।" नफ़रत अक्सर खुद को बेवकूफ़ महसूस करने से बचने का तरीका होती है। उसे दिखाएँ कि गणित खेल जैसा भी हो सकता है और गलतियाँ सीखने का हिस्सा हैं।',
        },
        steps: [
          { en: 'Ask what part feels hardest, then pick only that part to practise.', hi: 'पूछें कि कौन सा हिस्सा सबसे मुश्किल लगता है, फिर सिर्फ़ उसी का अभ्यास करें।' },
          { en: 'Use everyday counting: coins, steps, or cooking amounts.', hi: 'रोज़मर्रा की गिनती इस्तेमाल करें: सिक्के, कदम या खाना बनाने की मात्रा।' },
          { en: 'Celebrate one small win each session.', hi: 'हर सत्र में एक छोटी जीत का जश्न मनाएँ।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your child says, "I hate maths." What is the best first step?', hi: 'बच्चा कहता है, "मुझे गणित से नफ़रत है।" पहला सबसे अच्छा कदम क्या है?' },
            options: [
              { en: '"Maths is important, you must like it."', hi: '"गणित ज़रूरी है, तुम्हें यह पसंद करना होगा।"' },
              { en: '"What part feels hardest for you?"', hi: '"तुम्हें सबसे मुश्किल कौन सा हिस्सा लगता है?"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What does "I hate maths" often really mean for a young child?', hi: 'छोटे बच्चे के लिए "मुझे गणित से नफ़रत है" का असली मतलब अक्सर क्या होता है?' },
            options: [
              { en: 'This feels hard and I feel bad.', hi: 'यह मुश्किल लगता है और मुझे बुरा लगता है।' },
              { en: 'I have finished all my maths.', hi: 'मैंने अपना सारा गणित पूरा कर लिया है।' },
            ],
            correct: 0,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 may dislike maths after a few hard years. Avoid arguing about whether they should like it. Instead, find the gap they are stuck on and show how it connects to things they care about, such as sports statistics or money.',
          hi: 'ग्यारह से पंद्रह साल के बच्चे कुछ मुश्किल सालों के बाद गणित से दूर हो सकते हैं। इस बात पर बहस न करें कि उन्हें इसे पसंद करना चाहिए या नहीं। इसकी जगह वह कमी ढूँढें जहाँ वे अटके हैं, और दिखाएँ कि यह उन चीज़ों से कैसे जुड़ता है जो उन्हें पसंद हैं, जैसे खेल के आँकड़े या पैसा।',
        },
        steps: [
          { en: 'Ask which topic they dislike and when the dislike started.', hi: 'पूछें कि उन्हें कौन सा विषय पसंद नहीं और यह नापसंदगी कब शुरू हुई।' },
          { en: 'Connect one topic to something they enjoy, such as cricket averages.', hi: 'एक विषय को किसी ऐसी चीज़ से जोड़ें जो उन्हें पसंद है, जैसे क्रिकेट के औसत।' },
          { en: 'Agree on a short, focused practice plan for the weak topic only.', hi: 'सिर्फ़ कमज़ोर विषय के लिए एक छोटी और केंद्रित अभ्यास योजना पर सहमत हों।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your child dislikes maths after failing a unit on fractions. What helps most?', hi: 'आपका बच्चा भिन्न वाली इकाई में फेल होने के बाद गणित से नफ़रत करता है। सबसे ज़्यादा क्या मदद करता है?' },
            options: [
              { en: 'Reteach only the fractions they missed, in small steps.', hi: 'सिर्फ़ वे भिन्न दोबारा छोटे-छोटे कदमों में पढ़ाएँ जो छूट गए थे।' },
              { en: 'Give them the whole syllabus again at once.', hi: 'पूरा सिलेबस एक साथ फिर से दे दें।' },
            ],
            correct: 0,
          },
        ],
        test: [
          {
            q: { en: 'What is a good way to reconnect a teen with maths?', hi: 'किशोर को गणित से दोबारा जोड़ने का अच्छा तरीका क्या है?' },
            options: [
              { en: 'Show how maths connects to something they already enjoy.', hi: 'दिखाएँ कि गणित उस चीज़ से कैसे जुड़ता है जो उन्हें पहले से पसंद है।' },
              { en: 'Tell them maths is the only subject that matters.', hi: 'कहें कि गणित ही एकमात्र विषय है जो मायने रखता है।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'A Class 10 to 12 student who hates maths may feel the subject is a gate to their future, which raises the stakes and the fear. Acknowledge the pressure honestly, separate the exam from their worth, and plan a realistic path that uses their strengths.',
          hi: 'कक्षा 10 से 12 का छात्र जो गणित से नफ़रत करता है, शायद यह महसूस करता है कि यह विषय उसके भविष्य का दरवाज़ा है, जिससे दबाव और डर बढ़ जाता है। दबाव को ईमानदारी से स्वीकार करें, परीक्षा को उसकी कीमत से अलग करें, और ऐसी यथार्थवादी योजना बनाएँ जो उसकी ताकत का इस्तेमाल करे।',
        },
        steps: [
          { en: 'Name the fear directly: "Are you worried that maths will decide your future?"', hi: 'डर का सीधे नाम लें: "क्या तुम्हें डर है कि गणित तुम्हारा भविष्य तय करेगा?"' },
          { en: 'Review the marks and find the chapters that gain the most with least effort.', hi: 'अंकों की समीक्षा करें और वे अध्याय ढूँढें जिनमें सबसे कम मेहनत में सबसे ज़्यादा अंक मिलें।' },
          { en: 'Consider a tutor for one or two topics, not the whole subject.', hi: 'पूरे विषय के लिए नहीं, बल्कि एक-दो विषयों के लिए ट्यूटर पर विचार करें।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 16-year-old says maths will ruin their chances for college. What is the best response?', hi: 'आपका 16 साल का बच्चा कहता है कि गणित उसके कॉलेज के मौकों को बर्बाद कर देगा। सबसे अच्छा जवाब क्या है?' },
            options: [
              { en: '"Stop worrying, it will be fine."', hi: '"चिंता मत करो, सब ठीक हो जाएगा।"' },
              { en: '"Let us look at which chapters give you the most marks for the effort, and plan from there."', hi: '"चलो देखते हैं कि कौन से अध्याय कम मेहनत में ज़्यादा अंक देते हैं, फिर उसी से योजना बनाते हैं।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What separates a student\'s worth from an exam result?', hi: 'छात्र की कीमत को परीक्षा के नतीजे से क्या अलग करता है?' },
            options: [
              { en: 'Nothing, the result is the whole measure.', hi: 'कुछ नहीं, नतीजा ही पूरा पैमाना है।' },
              { en: 'Recognising that one exam measures one set of skills on one day.', hi: 'यह समझना कि एक परीक्षा एक दिन में एक तरह के कौशल को मापती है।' },
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m8',
    order: 8,
    title: { en: 'Talking About Exams Without Fear', hi: 'डर के बिना परीक्षा के बारे में बात करना' },
    tiers: {
      primary: {
        concept: {
          en: 'Young children pick up fear from how adults talk about tests. Words like "this is very important" or "don\'t make mistakes" can make a child freeze. Describe exams as a chance to show what they have learned, and keep the tone calm.',
          hi: 'छोटे बच्चे परीक्षा के बारे में बड़ों की बातों से डर सीख लेते हैं। "यह बहुत ज़रूरी है" या "गलती मत करना" जैसे शब्द बच्चे को जमा सकते हैं। परीक्षा को यह दिखाने का मौका बताएँ कि उन्होंने क्या सीखा है, और लहज़ा शांत रखें।',
        },
        steps: [
          { en: 'Describe a test as "a way to see what you have learned", not as a judgement.', hi: 'परीक्षा को "यह देखने का तरीका कि तुमने क्या सीखा है" बताएँ, फैसला नहीं।' },
          { en: 'Avoid saying "don\'t get it wrong" before a test.', hi: 'परीक्षा से पहले "गलत मत करना" कहने से बचें।' },
          { en: 'After the test, ask what they enjoyed solving, before asking about marks.', hi: 'परीक्षा के बाद अंकों के बारे में पूछने से पहले पूछें कि उन्हें हल करने में क्या अच्छा लगा।' },
        ],
        practiceSet: [
          {
            q: { en: 'Before a test, which sentence reduces fear the most?', hi: 'परीक्षा से पहले कौन सा वाक्य डर सबसे ज़्यादा कम करता है?' },
            options: [
              { en: '"Do not make any mistakes today."', hi: '"आज कोई गलती मत करना।"' },
              { en: '"Show me what you have learned, I am curious."', hi: '"मुझे दिखाओ तुमने क्या सीखा है, मुझे उत्सुकता है।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'How should a test be described to a young child?', hi: 'छोटे बच्चे को परीक्षा का वर्णन कैसे करना चाहिए?' },
            options: [
              { en: 'As a judgement of their worth.', hi: 'उनकी कीमत के फैसले के रूप में।' },
              { en: 'As a way to see what they have learned.', hi: 'यह देखने के तरीके के रूप में कि उन्होंने क्या सीखा है।' },
            ],
            correct: 1,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 notice how a parent talks about exams, and they often carry worry from those words. Keep the focus on preparation and effort, and avoid making every test feel like a turning point.',
          hi: 'ग्यारह से पंद्रह साल के छात्र ध्यान देते हैं कि माता-पिता परीक्षा के बारे में कैसे बात करते हैं, और अक्सर उन शब्दों से चिंता ले जाते हैं। ध्यान तैयारी और मेहनत पर रखें, और हर परीक्षा को निर्णायक मोड़ की तरह महसूस न कराएँ।',
        },
        steps: [
          { en: 'Ask what they need to feel ready, such as a plan, a practice test, or quiet time.', hi: 'पूछें कि तैयार महसूस करने के लिए उन्हें क्या चाहिए, जैसे योजना, अभ्यास टेस्ट या शांत समय।' },
          { en: 'Talk about the preparation plan, not the expected score.', hi: 'अपेक्षित स्कोर की नहीं, तैयारी की योजना पर बात करें।' },
          { en: 'Agree on a simple check-in after the exam, separate from the marks.', hi: 'परीक्षा के बाद एक सरल बातचीत तय करें, जो अंकों से अलग हो।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 14-year-old is anxious before a test. What helps most?', hi: 'आपका 14 साल का बच्चा परीक्षा से पहले घबराया हुआ है। सबसे ज़्यादा क्या मदद करता है?' },
            options: [
              { en: 'Repeating that the test is the most important thing ever.', hi: 'बार-बार कहना कि यह परीक्षा अब तक की सबसे ज़रूरी चीज़ है।' },
              { en: 'Going through a simple preparation plan together.', hi: 'साथ मिलकर एक सरल तैयारी योजना पर चलना।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What should the talk after an exam focus on?', hi: 'परीक्षा के बाद की बातचीत किस पर केंद्रित होनी चाहिए?' },
            options: [
              { en: 'Only the marks they got.', hi: 'सिर्फ़ उन्हें मिले अंक।' },
              { en: 'How they prepared and how they felt.', hi: 'उन्होंने कैसे तैयारी की और उन्हें कैसा लगा।' },
            ],
            correct: 1,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Teenagers in Class 10 to 12 may hide their exam fear behind irritation or silence. Make it safe to say "I am scared", and treat the fear as information about what they need, not as a weakness.',
          hi: 'कक्षा 10 से 12 के किशोर परीक्षा के डर को चिढ़ या चुप्पी के पीछे छिपा सकते हैं। यह कहना सुरक्षित बनाएँ कि "मुझे डर लग रहा है", और डर को कमज़ोरी नहीं, बल्कि इस बात की जानकारी मानें कि उन्हें क्या चाहिए।',
        },
        steps: [
          { en: 'Ask: "What is the scariest part of this exam for you?"', hi: 'पूछें: "इस परीक्षा का सबसे डरावना हिस्सा तुम्हारे लिए कौन सा है?"' },
          { en: 'Support rest and sleep before the exam, and keep the last day light.', hi: 'परीक्षा से पहले आराम और नींद का समर्थन करें, और आखिरी दिन हल्का रखें।' },
          { en: 'Give space: "I am here if you want to talk. You do not have to."', hi: 'जगह दें: "अगर बात करनी हो तो मैं यहाँ हूँ। ज़रूरी नहीं है।"' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 17-year-old snaps at you before boards. What is the most helpful response?', hi: 'आपका 17 साल का बच्चा बोर्ड से पहले आप पर चिढ़ जाता है। सबसे मददगार प्रतिक्रिया क्या है?' },
            options: [
              { en: 'Snap back and remind them of the rules.', hi: 'पलटकर जवाब देना और नियम याद दिलाना।' },
              { en: '"This is a lot of pressure. Do you want quiet time, or a chat?"', hi: '"इस पर बहुत दबाव है। तुम्हें शांत समय चाहिए, या बात करनी है?"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What makes it safe for a teen to say they are scared?', hi: 'किशोर के लिए यह कहना सुरक्षित कब होता है कि उसे डर लग रहा है?' },
            options: [
              { en: 'Being told fear is not allowed.', hi: 'यह सुनना कि डर की अनुमति नहीं है।' },
              { en: 'Being met with calm and without judgement.', hi: 'शांति और बिना फैसले के सामना होना।' },
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m9',
    order: 9,
    title: { en: 'Supporting a Child Who Is Stuck', hi: 'ऐसे बच्चे का साथ देना जो अटका हुआ है' },
    tiers: {
      primary: {
        concept: {
          en: 'When a young child is stuck, they often freeze or give up. Help by breaking the task into one small step and showing the first step together. Then step back so they can try the next one on their own.',
          hi: 'जब छोटा बच्चा अटक जाता है, तो अक्सर वह जम जाता है या हार मान लेता है। काम को एक छोटे कदम में बाँटकर पहला कदम साथ में दिखाकर मदद करें। फिर पीछे हट जाएँ ताकि वे अगला कदम खुद आज़मा सकें।',
        },
        steps: [
          { en: 'Ask "Which part is stuck?" before you help.', hi: 'मदद करने से पहले पूछें "कौन सा हिस्सा अटक रहा है?"' },
          { en: 'Show the first step, then let them do the second.', hi: 'पहला कदम दिखाएँ, फिर दूसरा कदम उन्हें करने दें।' },
          { en: 'Praise the attempt, even if it is not correct yet.', hi: 'कोशिश की प्रशंसा करें, भले ही वह अभी सही न हो।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your child is stuck on a counting problem and starts to cry. What should you do first?', hi: 'आपका बच्चा गिनती के सवाल पर अटक गया है और रोने लगता है। आपको पहले क्या करना चाहिए?' },
            options: [
              { en: 'Give the full answer so they can stop crying.', hi: 'पूरा जवाब दे दें ताकि वे रोना बंद कर दें।' },
              { en: 'Ask which part is stuck, and help with just the first step.', hi: 'पूछें कौन सा हिस्सा अटक रहा है, और सिर्फ़ पहले कदम में मदद करें।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What helps a stuck young child most?', hi: 'अटके हुए छोटे बच्चे की सबसे ज़्यादा मदद क्या करता है?' },
            options: [
              { en: 'Doing the whole task for them.', hi: 'उनके लिए पूरा काम कर देना।' },
              { en: 'Showing one small step and letting them try the next.', hi: 'एक छोटा कदम दिखाना और अगला उन्हें आज़माने देना।' },
            ],
            correct: 1,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Students aged 11 to 15 who are stuck often hide it, because asking for help feels like admitting failure. Make help feel normal by sitting alongside them and asking them to explain their thinking, which reveals exactly where the gap is.',
          hi: 'ग्यारह से पंद्रह साल के छात्र जब अटकते हैं, तो अक्सर इसे छिपाते हैं, क्योंकि मदद माँगना असफलता मानने जैसा लगता है। उनके बगल में बैठकर और उनसे अपनी सोच समझाने को कहकर मदद को सामान्य बनाएँ। इससे ठीक पता चलता है कि कमी कहाँ है।',
        },
        steps: [
          { en: 'Ask them to explain how they started, step by step.', hi: 'उनसे कहें कि वे शुरुआत कैसे करते हैं, कदम-दर-कदम समझाएँ।' },
          { en: 'Point to the exact line where the thinking changes direction.', hi: 'ठीक उस पंक्ति की ओर इशारा करें जहाँ सोच की दिशा बदलती है।' },
          { en: 'Let them redo the step themselves before you move on.', hi: 'आगे बढ़ने से पहले उन्हें वह कदम खुद दोबारा करने दें।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 12-year-old is stuck on algebra and says "I just don\'t get it." What is the best next step?', hi: 'आपका 12 साल का बच्चा बीजगणित में अटका है और कहता है "मुझे बस समझ नहीं आता।" अगला सबसे अच्छा कदम क्या है?' },
            options: [
              { en: '"Okay, just watch the video and it will click."', hi: '"ठीक है, बस वीडियो देख लो, समझ आ जाएगा।"' },
              { en: '"Show me how you started, step by step."', hi: '"मुझे दिखाओ तुमने शुरुआत कैसे की, कदम-दर-कदम।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Why ask a stuck student to explain their thinking?', hi: 'अटके हुए छात्र से उनकी सोच समझाने को क्यों कहें?' },
            options: [
              { en: 'It reveals exactly where the gap is.', hi: 'इससे ठीक पता चलता है कि कमी कहाँ है।' },
              { en: 'It gives you time to do something else.', hi: 'इससे आपको कुछ और करने का समय मिलता है।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'A Class 10 to 12 student who is stuck may already feel overwhelmed. Rather than solving the problem for them, help them plan which topic to tackle first, which resource to use, and when to ask a teacher. Independence grows when they make these decisions.',
          hi: 'कक्षा 10 से 12 का छात्र जो अटका है, शायद पहले ही बोझ महसूस कर रहा हो। समस्या को उनके लिए हल करने की जगह, यह तय करने में मदद करें कि पहले कौन सा विषय लें, कौन सा संसाधन इस्तेमाल करें, और शिक्षक से कब पूछें। ये फैसले वे खुद लेते हैं तो आत्मनिर्भरता बढ़ती है।',
        },
        steps: [
          { en: 'Ask them to list the three topics that feel most blocked, then rank them.', hi: 'उनसे तीन सबसे अटकाने वाले विषयों की सूची बनाने को कहें, फिर उन्हें क्रम दें।' },
          { en: 'Agree on one resource and one time to ask a teacher this week.', hi: 'इस हफ्ते के लिए एक संसाधन और शिक्षक से पूछने का एक समय तय करें।' },
          { en: 'Check in after the plan, not during every step.', hi: 'हर कदम के दौरान नहीं, बल्कि योजना के बाद बात करें।' },
        ],
        practiceSet: [
          {
            q: { en: 'Your 16-year-old is stuck on several topics at once. What is the most useful help?', hi: 'आपका 16 साल का बच्चा एक साथ कई विषयों में अटका है। सबसे उपयोगी मदद क्या है?' },
            options: [
              { en: 'Solve each problem for them so they catch up quickly.', hi: 'हर सवाल उनके लिए हल कर दें ताकि वे जल्दी आगे बढ़ें।' },
              { en: 'Help them rank the topics and plan one step at a time.', hi: 'उन्हें विषयों को क्रम देने और एक-एक कदम की योजना बनाने में मदद करें।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Why should a teen make decisions about their own study plan?', hi: 'किशोर को अपनी पढ़ाई की योजना के फैसले खुद क्यों लेने चाहिए?' },
            options: [
              { en: 'Because independence grows when they make these decisions.', hi: 'क्योंकि ये फैसले लेने से आत्मनिर्भरता बढ़ती है।' },
              { en: 'Because adults should never be involved in study.', hi: 'क्योंकि बड़ों को पढ़ाई में कभी शामिल नहीं होना चाहिए।' },
            ],
            correct: 0,
          },
        ],
      },
    },
  },
  {
    id: 'parent_m10',
    order: 10,
    title: { en: 'Looking After Your Own Stress', hi: 'अपने तनाव का ख्याल रखना' },
    tiers: {
      primary: {
        concept: {
          en: 'Children read their parents\' stress closely. When you are calm, your child feels safer to learn and make mistakes. Looking after your own stress is part of helping your child, not a separate task.',
          hi: 'बच्चे अपने माता-पिता के तनाव को गौर से पढ़ते हैं। जब आप शांत होते हैं, तो बच्चा सीखने और गलतियाँ करने में ज़्यादा सुरक्षित महसूस करता है। अपने तनाव का ख्याल रखना बच्चे की मदद का ही हिस्सा है, अलग काम नहीं।',
        },
        steps: [
          { en: 'Notice your own tension before you speak to your child about marks.', hi: 'बच्चे से अंकों की बात करने से पहले अपने तनाव को पहचानें।' },
          { en: 'Take three slow breaths before you respond to a low score.', hi: 'कम अंक पर प्रतिक्रिया देने से पहले तीन धीमी साँसें लें।' },
          { en: 'Tell your child calmly when you need a break, so they learn it is healthy.', hi: 'जब आपको ब्रेक चाहिए, तो बच्चे को शांति से बताएँ, ताकि वह सीखे कि यह स्वस्थ है।' },
        ],
        practiceSet: [
          {
            q: { en: 'You are stressed about your child\'s low score. What is the best first step?', hi: 'आप बच्चे के कम अंकों से परेशान हैं। पहला सबसे अच्छा कदम क्या है?' },
            options: [
              { en: 'Discuss the score immediately while you are upset.', hi: 'परेशान होते हुए तुरंत अंकों पर बात करना।' },
              { en: 'Take a few slow breaths, then talk when you are calm.', hi: 'कुछ धीमी साँसें लें, फिर शांत होकर बात करें।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'Why does a parent\'s calm help a child learn?', hi: 'माता-पिता की शांति बच्चे को सीखने में कैसे मदद करती है?' },
            options: [
              { en: 'The child feels safer to learn and make mistakes.', hi: 'बच्चा सीखने और गलतियाँ करने में ज़्यादा सुरक्षित महसूस करता है।' },
              { en: 'The child stops needing any help at all.', hi: 'बच्चे को किसी भी मदद की ज़रूरत नहीं रहती।' },
            ],
            correct: 0,
          },
        ],
      },
      secondary: {
        concept: {
          en: 'Parents of students aged 11 to 15 often carry worry about school, money, and the future. That stress leaks into conversations about marks. Name your own stress, find a small outlet, and avoid making your child responsible for managing your feelings.',
          hi: 'ग्यारह से पंद्रह साल के बच्चों के माता-पिता अक्सर स्कूल, पैसे और भविष्य की चिंता लिए रहते हैं। वह तनाव अंकों की बातचीत में आ जाता है। अपने तनाव को पहचानें, उसके लिए कोई छोटा सहारा ढूँढें, और अपने बच्चे पर अपनी भावनाएँ संभालने की ज़िम्मेदारी न डालें।',
        },
        steps: [
          { en: 'Notice when you start comparing your child\'s marks with your own worries.', hi: 'ध्यान दें कि आप कब बच्चे के अंकों को अपनी चिंताओं से जोड़ने लगते हैं।' },
          { en: 'Find one small outlet this week: a walk, a call with a friend, or a quiet cup of tea.', hi: 'इस हफ्ते एक छोटा सहारा ढूँढें: टहलना, किसी दोस्त से बात, या शांति से एक कप चाय।' },
          { en: 'Ask a partner, friend, or counsellor for help when stress lasts for weeks.', hi: 'जब तनाव हफ्तों तक रहे, तो साथी, दोस्त या काउंसलर से मदद लें।' },
        ],
        practiceSet: [
          {
            q: { en: 'You snap at your child after a bad day at work. What is the best repair?', hi: 'काम पर बुरे दिन के बाद आप बच्चे पर चिढ़ जाते हैं। सबसे अच्छा सुधार क्या है?' },
            options: [
              { en: 'Ignore it, children forget quickly.', hi: 'इसे नज़रअंदाज़ करें, बच्चे जल्दी भूल जाते हैं।' },
              { en: '"I was stressed earlier and I shouldn\'t have snapped. I am sorry."', hi: '"मैं पहले तनाव में था और मुझे इस तरह नहीं चिढ़ना चाहिए था। मुझे माफ़ करना।"' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'What should a parent avoid?', hi: 'माता-पिता को किससे बचना चाहिए?' },
            options: [
              { en: 'Making the child responsible for managing the parent\'s feelings.', hi: 'बच्चे पर माता-पिता की भावनाएँ संभालने की ज़िम्मेदारी डालना।' },
              { en: 'Taking a short break to recover.', hi: 'ठीक होने के लिए एक छोटा ब्रेक लेना।' },
            ],
            correct: 0,
          },
        ],
      },
      teen: {
        concept: {
          en: 'Parents of teenagers in Class 10 to 12 may feel powerless as their child faces boards and big choices. Your stress is real, and it helps to keep a steady routine for yourself, share the load with your partner, and remember that your teen learns how to handle pressure by watching you.',
          hi: 'कक्षा 10 से 12 के किशोरों के माता-पिता को बोर्ड और बड़े फैसलों के दौर में लाचार महसूस हो सकता है। आपका तनाव वास्तविक है, और अपने लिए एक स्थिर दिनचर्या रखना, साथी के साथ बोझ बाँटना मददगार होता है। याद रखें कि किशोर दबाव कैसे संभालें, यह आपको देखकर भी सीखता है।',
        },
        steps: [
          { en: 'Keep one routine for yourself, such as sleep, a walk, or a hobby, even during exam season.', hi: 'परीक्षा के मौसम में भी अपने लिए एक दिनचर्या रखें, जैसे नींद, टहलना या कोई शौक।' },
          { en: 'Share the load with a partner or relative so one person is not carrying it all.', hi: 'बोझ साथी या रिश्तेदार के साथ बाँटें, ताकि एक ही व्यक्ति सब न उठाए।' },
          { en: 'Model healthy coping: say out loud how you are handling stress, calmly.', hi: 'स्वस्थ तरीके से सामना करने का उदाहरण बनें: शांति से बताएँ कि आप तनाव कैसे संभाल रहे हैं।' },
        ],
        practiceSet: [
          {
            q: { en: 'During boards, you feel constantly anxious. What is the most helpful thing you can do for your teen and yourself?', hi: 'बोर्ड के दौरान आप लगातार बेचैन रहते हैं। अपने किशोर और अपने लिए सबसे मददगार काम क्या है?' },
            options: [
              { en: 'Keep your own worry to yourself and hope it passes.', hi: 'अपनी चिंता अपने तक रखें और उम्मीद करें कि गुज़र जाएगी।' },
              { en: 'Keep a steady routine for yourself and share the load with a partner.', hi: 'अपने लिए एक स्थिर दिनचर्या रखें और साथी के साथ बोझ बाँटें।' },
            ],
            correct: 1,
          },
        ],
        test: [
          {
            q: { en: 'How does a teen learn to handle pressure?', hi: 'किशोर दबाव संभालना कैसे सीखता है?' },
            options: [
              { en: 'Partly by watching how their parents handle stress.', hi: 'कुछ हद तक यह देखकर कि उनके माता-पिता तनाव कैसे संभालते हैं।' },
              { en: 'Only from lectures about stress.', hi: 'सिर्फ़ तनाव पर भाषण सुनकर।' },
            ],
            correct: 0,
          },
        ],
      },
    },
  },
];
