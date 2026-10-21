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
];
