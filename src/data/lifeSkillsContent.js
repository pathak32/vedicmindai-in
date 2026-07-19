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
      {
        id: 'parent_m2',
        order: 2,
        title: { en: 'How to Help Without Taking Over', hi: 'मदद कैसे करें — बिना सब खुद करे' },
        tiers: {
          primary: {
            concept: {
              en: "Sitting next to a young child while they do homework feels like helping. And it can be — but only if you're watching them think, not thinking for them. The moment you pick up the pen, or say \"no, do it like this,\" you've moved from supporting to replacing. The child then learns two things: that they can't figure things out themselves, and that they need you to check every step. Neither is what you want.",
              hi: 'होमवर्क करते समय छोटे बच्चे के पास बैठना मदद जैसा लगता है। और हो सकता है — लेकिन केवल तभी जब आप उन्हें सोचते हुए देख रहे हों, उनकी जगह सोच नहीं रहे। जिस पल आपने पेन उठाया, या कहा "नहीं, ऐसे करो," आप सहयोग से हटकर बदलने में चले गए। बच्चा तब दो चीज़ें सीखता है: कि वह खुद कुछ नहीं सोच सकता, और कि हर कदम पर उसे आपकी ज़रूरत है।',
            },
            steps: [
              { en: 'Ask "what do you think the first step is?" before giving any hint — even if they\'re stuck, give them 30 seconds of quiet first.', hi: 'कोई संकेत देने से पहले पूछें "तुम्हें क्या लगता है पहला कदम क्या है?" — भले ही वे अटके हों, पहले 30 सेकंड की शांति दें।' },
              { en: 'When they get something wrong, ask "what makes you say that?" instead of "that\'s wrong" — they often catch their own mistake in explaining it.', hi: 'जब वे कुछ गलत करें, "यह गलत है" की जगह पूछें "तुम ऐसा क्यों कह रहे हो?" — वे अक्सर समझाते-समझाते खुद ही अपनी गलती पकड़ लेते हैं।' },
              { en: 'Leave the room for 5 minutes during homework time — see if they can begin without you. You\'re building a habit, not just completing a worksheet.', hi: 'होमवर्क के दौरान 5 मिनट के लिए कमरे से बाहर जाएं — देखें क्या वे आपके बिना शुरू कर सकते हैं। आप एक आदत बना रहे हैं, सिर्फ एक वर्कशीट पूरी नहीं कर रहे।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your child is stuck on a maths problem and looks at you for help. What\'s the most useful first move?', hi: 'आपका बच्चा एक गणित की समस्या में अटका है और आपकी तरफ मदद के लिए देखता है। सबसे उपयोगी पहला कदम क्या है?' },
                options: [
                  { en: 'Show them the correct method immediately so they don\'t stay stuck', hi: 'तुरंत सही तरीका दिखाएं ताकि वे अटके न रहें' },
                  { en: '"What do you think the first step might be?"', hi: '"तुम्हें क्या लगता है पहला कदम क्या हो सकता है?"' },
                  { en: 'Do the problem alongside them so they can copy the method', hi: 'उनके साथ समस्या करें ताकि वे तरीका नकल कर सकें' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why can doing a child\'s problem for them actually slow down their learning?', hi: 'बच्चे की समस्या उनके लिए करना उनकी सीखने की प्रक्रिया को वास्तव में धीमा क्यों कर सकता है?' },
                options: [
                  { en: 'It takes away the thinking moment they needed — and teaches them they can\'t manage without you', hi: 'यह उस सोचने के पल को छीन लेता है जिसकी उन्हें ज़रूरत थी — और उन्हें सिखाता है कि वे आपके बिना नहीं कर सकते' },
                  { en: 'It doesn\'t — helping always speeds up learning', hi: 'नहीं करता — मदद हमेशा सीखने को तेज़ करती है' },
                ],
                correct: 0,
              },
            ],
          },
          secondary: {
            concept: {
              en: 'At this age, the content is harder and the temptation to just explain it yourself is real — especially if you know the subject. But a child who watches you solve it hasn\'t solved it. What they\'ve learned is that when it gets hard, someone else handles it. That habit, if it sets in between Class 6 and 9, is genuinely difficult to unlearn before competitive exams.',
              hi: 'इस उम्र में, विषय-वस्तु कठिन होती है और खुद ही समझाने का लालच असली होता है — खासकर अगर आप विषय जानते हों। लेकिन जो बच्चा आपको हल करते देखता है, उसने हल नहीं किया। उसने जो सीखा वह यह है कि जब मुश्किल होती है, कोई और संभाल लेता है। यह आदत, अगर कक्षा 6 से 9 के बीच जम जाए, तो प्रतियोगी परीक्षाओं से पहले सच में छुड़ाना मुश्किल है।',
            },
            steps: [
              { en: 'Instead of explaining the solution, explain the type of problem — "this is the kind where you work backwards from the answer" — then let them try.', hi: 'हल समझाने की जगह, समस्या का प्रकार समझाएं — "यह वैसी है जहां आप जवाब से पीछे की ओर काम करते हैं" — फिर उन्हें करने दें।' },
              { en: 'When they say "I can\'t do this," reply with "you haven\'t figured this type out yet" — the word "yet" is doing real work here.', hi: 'जब वे कहें "मैं यह नहीं कर सकता," जवाब दें "तुमने अभी तक इस प्रकार को नहीं समझा है" — यहां "अभी तक" शब्द असली काम कर रहा है।' },
              { en: 'Set a visible timer for 10 minutes of solo attempt before any discussion — the boundary makes the attempt feel defined, not endless.', hi: 'किसी भी चर्चा से पहले 10 मिनट के एकल प्रयास के लिए एक दिखाई देने वाला टाइमर लगाएं — सीमा प्रयास को परिभाषित बनाती है, अंतहीन नहीं।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your Class 7 child is struggling with algebra. Which response builds independence best?', hi: 'आपका कक्षा 7 का बच्चा बीजगणित में संघर्ष कर रहा है। कौन सी प्रतिक्रिया सबसे अच्छी स्वतंत्रता बनाती है?' },
                options: [
                  { en: 'Sit with them and work through every problem together', hi: 'उनके साथ बैठें और हर समस्या मिलकर हल करें' },
                  { en: '"Try it for 10 minutes first — then show me where you got stuck"', hi: '"पहले 10 मिनट खुद कोशिश करो — फिर मुझे दिखाओ कहां अटके"' },
                  { en: 'Call a tutor immediately', hi: 'तुरंत एक ट्यूटर बुलाएं' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'What does adding the word "yet" do when a child says "I can\'t do this"?', hi: 'जब बच्चा कहे "मैं यह नहीं कर सकता" तो "अभी तक" शब्द जोड़ने से क्या होता है?' },
                options: [
                  { en: 'It changes inability from a fixed state into a temporary one — something that can change with effort', hi: 'यह असमर्थता को एक स्थायी अवस्था से अस्थायी में बदल देता है — कुछ ऐसा जो प्रयास से बदल सकता है' },
                  { en: 'It doesn\'t change anything — it\'s just a word', hi: 'इससे कुछ नहीं बदलता — यह सिर्फ एक शब्द है' },
                ],
                correct: 0,
              },
            ],
          },
          teen: {
            concept: {
              en: 'At this stage, your role is less teacher and more thinking partner — if you can manage it. A teenager who has to explain their reasoning to you, out loud, will often catch their own gaps. That\'s more valuable than a correct answer you handed them. The practical limit: this only works if they actually believe you won\'t take over when it gets hard.',
              hi: 'इस चरण में, आपकी भूमिका कम शिक्षक और अधिक सोचने में साझेदार है — अगर आप यह कर सकते हैं। एक किशोर जिसे आपको अपनी सोच ज़ोर से समझानी होती है, वह अक्सर खुद ही अपनी कमियां पकड़ लेता है। यह किसी सही जवाब से ज़्यादा मूल्यवान है जो आपने दे दिया। व्यावहारिक सीमा: यह तभी काम करता है जब वे वाकई यकीन करते हों कि मुश्किल होने पर आप संभाल नहीं लेंगे।',
            },
            steps: [
              { en: 'Ask "walk me through what you\'ve tried" — not to evaluate, but to make them articulate the problem. They will often find it themselves while explaining.', hi: 'पूछें "मुझे बताओ तुमने क्या-क्या कोशिश की है" — आंकने के लिए नहीं, बल्कि उन्हें समस्या को शब्दों में कहने पर मजबूर करने के लिए। वे अक्सर समझाते-समझाते खुद ही इसे खोज लेंगे।' },
              { en: 'When they figure something out themselves — even partially — notice it out loud: "you worked that one out yourself." This lands differently than general praise.', hi: 'जब वे खुद कुछ समझ लें — थोड़ा भी — उसे ज़ोर से नोटिस करें: "तुमने यह खुद निकाला।" यह सामान्य प्रशंसा से अलग तरह से असर करता है।' },
              { en: 'Set a rule for yourself: don\'t give the answer in the last 30 days before a major exam. Let them wrestle. Struggling through a problem the night before is better preparation than seeing you solve it cleanly.', hi: 'अपने लिए एक नियम बनाएं: किसी बड़ी परीक्षा से पहले के आखिरी 30 दिनों में जवाब न दें। उन्हें संघर्ष करने दें।' },
            ],
            practiceSet: [
              {
                q: { en: 'Your teen preparing for a competitive exam asks you to explain a concept you actually know well. What\'s most helpful?', hi: 'प्रतियोगी परीक्षा की तैयारी कर रहा आपका किशोर आपसे एक अवधारणा समझाने को कहता है जो आप वाकई अच्छी तरह जानते हैं। सबसे मददगार क्या है?' },
                options: [
                  { en: 'Explain it clearly and completely — your knowledge is the resource here', hi: 'इसे स्पष्ट और पूरी तरह समझाएं — आपका ज्ञान यहां संसाधन है' },
                  { en: '"Tell me what you already understand about it, and where it stops making sense"', hi: '"मुझे बताओ तुम इसके बारे में पहले से क्या समझते हो, और कहां समझ बंद हो जाती है"' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why is "walk me through what you\'ve tried" often more useful than directly answering a teenager\'s question?', hi: '"मुझे बताओ तुमने क्या कोशिश की" एक किशोर के सवाल का सीधे जवाब देने से अक्सर ज़्यादा उपयोगी क्यों है?' },
                options: [
                  { en: 'It forces them to articulate the problem — and people often solve their own problems while explaining them', hi: 'यह उन्हें समस्या को शब्दों में कहने पर मजबूर करता है — और लोग अक्सर समझाते-समझाते अपनी समस्याएं खुद हल कर लेते हैं' },
                  { en: 'It doesn\'t — directly explaining is always faster and better', hi: 'नहीं करता — सीधे समझाना हमेशा तेज़ और बेहतर होता है' },
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
      {
        id: 'student_m2',
        order: 2,
        title: { en: 'How to Actually Study (Not Just Sit There)', hi: 'असल में पढ़ाई कैसे करें (बस बैठे न रहें)' },
        tiers: {
          primary: {
            concept: {
              en: 'Studying and reading are not the same thing. When you read something three times without thinking about it, you haven\'t studied it — you\'ve just seen the words. Real studying means stopping, closing the book, and asking yourself: "what did I just read?" If you can\'t say it in your own words, your brain hasn\'t stored it yet.',
              hi: 'पढ़ाई और पढ़ना एक नहीं है। जब आप बिना सोचे कुछ तीन बार पढ़ते हैं, तो आपने इसे पढ़ा नहीं है — आपने बस शब्द देखे हैं। असली पढ़ाई का मतलब है रुकना, किताब बंद करना, और खुद से पूछना: "मैंने अभी क्या पढ़ा?" अगर आप इसे अपने शब्दों में नहीं कह सकते, तो आपके दिमाग ने इसे अभी तक सहेजा नहीं है।',
            },
            steps: [
              { en: 'After reading one page, close the book and say out loud — or write — one thing you just learned. Not copying, your own words.', hi: 'एक पेज पढ़ने के बाद, किताब बंद करें और ज़ोर से बोलें — या लिखें — एक चीज़ जो आपने अभी सीखी। नकल नहीं, अपने शब्दों में।' },
              { en: 'Make a question out of what you just read — "what would a test ask about this?" — then answer it without looking.', hi: 'जो आपने अभी पढ़ा उससे एक सवाल बनाएं — "टेस्ट इसके बारे में क्या पूछेगा?" — फिर बिना देखे जवाब दें।' },
              { en: 'Study in 20-minute bursts with a real break — not an hour of half-attention. Shorter, sharper, then rest.', hi: '20 मिनट की कोशिश करें एक असली ब्रेक के साथ — एक घंटे की आधी-अधूरी ध्यान नहीं। छोटा, तेज़, फिर आराम।' },
            ],
            practiceSet: [
              {
                q: { en: 'You\'ve read the same chapter three times but still don\'t feel confident. What\'s most likely missing?', hi: 'आपने एक ही अध्याय तीन बार पढ़ा है लेकिन फिर भी आत्मविश्वास नहीं लगता। सबसे अधिक क्या कमी है?' },
                options: [
                  { en: 'You haven\'t read it enough times yet', hi: 'आपने इसे अभी तक पर्याप्त बार नहीं पढ़ा' },
                  { en: 'You\'ve been reading without testing yourself — re-reading feels like learning but often isn\'t', hi: 'आप खुद को जांचे बिना पढ़ रहे हैं — दोबारा पढ़ना सीखने जैसा लगता है लेकिन अक्सर होता नहीं' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'True or False: Closing the book and trying to say what you just read — even roughly — helps you remember it better than reading it again.', hi: 'सही या गलत: किताब बंद करके यह कहने की कोशिश करना कि आपने अभी क्या पढ़ा — भले ही मोटे तौर पर — इसे दोबारा पढ़ने से बेहतर याद रखने में मदद करता है।' },
                options: [{ en: 'True', hi: 'सही' }, { en: 'False', hi: 'गलत' }],
                correct: 0,
              },
            ],
          },
          secondary: {
            concept: {
              en: 'The most common study mistake at this age: reading notes and thinking that\'s the same as knowing them. It isn\'t. Recognition (seeing something and thinking "yes, I know this") is not the same as recall (being able to produce it from nothing). Every exam tests recall — not recognition. The fix isn\'t more time studying; it\'s changing what you do during that time.',
              hi: 'इस उम्र में सबसे आम पढ़ाई की गलती: नोट्स पढ़ना और यह सोचना कि यह उन्हें जानने जैसा है। यह नहीं है। पहचानना (कुछ देखकर सोचना "हां, मैं यह जानता हूं") याद करने जैसा नहीं है (बिना कुछ देखे इसे बता पाना)। हर परीक्षा याद करने की जांच करती है — पहचानने की नहीं।',
            },
            steps: [
              { en: 'After reading a section, flip the page over or close the book — try to write the key points from memory. Check what you missed, not what you got right.', hi: 'एक खंड पढ़ने के बाद, पेज पलटें या किताब बंद करें — याददाश्त से मुख्य बिंदु लिखने की कोशिश करें। यह जांचें कि आप क्या चूके, क्या सही किया यह नहीं।' },
              { en: 'Use a blank sheet: write a topic in the middle and try to build everything you know around it, without notes. The gaps are what to study next.', hi: 'एक खाली शीट इस्तेमाल करें: बीच में एक विषय लिखें और बिना नोट्स के आप जो जानते हैं वह सब उसके आसपास बनाने की कोशिश करें। कमियां ही अगली पढ़ाई का विषय हैं।' },
              { en: 'Teach one concept to someone — a sibling, a friend, or even an imaginary listener. If you can\'t explain it, you don\'t know it yet.', hi: 'किसी को एक अवधारणा सिखाएं — एक भाई-बहन, दोस्त, या काल्पनिक श्रोता को। अगर आप इसे समझा नहीं सकते, तो आप अभी तक इसे जानते नहीं।' },
            ],
            practiceSet: [
              {
                q: { en: 'Which study method will most reliably prepare you for a recall-based exam?', hi: 'कौन सा अध्ययन तरीका सबसे भरोसेमंद तरीके से आपको याद करने पर आधारित परीक्षा के लिए तैयार करेगा?' },
                options: [
                  { en: 'Reading your notes carefully multiple times until they feel familiar', hi: 'अपने नोट्स को कई बार ध्यान से पढ़ना जब तक वे परिचित न लगें' },
                  { en: 'Closing notes and testing yourself — then using mistakes to guide what to review', hi: 'नोट्स बंद करके खुद को जांचना — फिर गलतियों का इस्तेमाल करके यह तय करना कि क्या दोबारा पढ़ना है' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'What\'s the difference between recognition and recall, and why does it matter for exams?', hi: 'पहचानने और याद करने में क्या फर्क है, और परीक्षाओं के लिए यह क्यों मायने रखता है?' },
                options: [
                  { en: 'Recognition is seeing something and thinking "I know this"; recall is producing it from nothing — exams test recall, not recognition', hi: 'पहचानना है कुछ देखकर सोचना "मैं यह जानता हूं"; याद करना है इसे बिना कुछ देखे बताना — परीक्षाएं याद करने की जांच करती हैं, पहचानने की नहीं' },
                  { en: 'They\'re the same thing — if you recognise it, you can recall it', hi: 'वे एक ही चीज़ हैं — अगर आप इसे पहचानते हैं, तो आप इसे याद कर सकते हैं' },
                ],
                correct: 0,
              },
            ],
          },
          teen: {
            concept: {
              en: 'You have probably heard about "active recall" and "spaced repetition." This isn\'t new science — it\'s been studied since the 1880s (Hermann Ebbinghaus, the forgetting curve). What\'s new is that most students still don\'t do it, because re-reading feels more comfortable than being tested. Comfort is not the same as learning. The discomfort of not knowing the answer — and then finding it — is exactly where the memory forms.',
              hi: 'आपने शायद "सक्रिय स्मरण" और "अंतरिक्षीय पुनरावृत्ति" के बारे में सुना होगा। यह नया विज्ञान नहीं है — इसका अध्ययन 1880 के दशक से किया जा रहा है। जो नया है वह यह है कि अधिकांश छात्र अभी भी इसे नहीं करते, क्योंकि दोबारा पढ़ना जांचे जाने से ज़्यादा आरामदायक लगता है। आराम सीखने जैसा नहीं है।',
            },
            steps: [
              { en: 'Build a "question deck" as you study — not flash cards with the answer visible, but questions only, answered from memory, checked after.', hi: 'पढ़ाई करते समय एक "प्रश्न डेक" बनाएं — जवाब दिखने वाले फ्लैशकार्ड नहीं, बल्कि केवल प्रश्न, याददाश्त से जवाब दिए जाएं, बाद में जांचे जाएं।' },
              { en: 'Space your review: look at something once today, once in 2 days, once in a week. Three spaced sessions beats one 3-hour session the night before.', hi: 'अपनी समीक्षा को बांटें: आज एक बार देखें, 2 दिन में एक बार, एक हफ्ते में एक बार। तीन बंटे हुए सत्र परीक्षा से एक रात पहले एक 3 घंटे के सत्र को हराते हैं।' },
              { en: 'When you get something wrong during self-testing, don\'t just read the correct answer — explain to yourself why you got it wrong. That explanation is what sticks.', hi: 'जब आप खुद-परीक्षण में कुछ गलत करें, तो सिर्फ सही जवाब न पढ़ें — खुद को समझाएं कि आप गलत क्यों हुए। वह समझाना ही याद रहता है।' },
            ],
            practiceSet: [
              {
                q: { en: 'You have 3 hours to study one topic. Which plan will produce the strongest memory?', hi: 'आपके पास एक विषय पढ़ने के लिए 3 घंटे हैं। कौन सी योजना सबसे मज़बूत याददाश्त बनाएगी?' },
                options: [
                  { en: 'Read thoroughly for 3 hours — depth over interruption', hi: 'पूरी तरह 3 घंटे पढ़ें — बाधा से ज़्यादा गहराई' },
                  { en: '1 hour reading + 2 hours of self-testing and reviewing mistakes', hi: '1 घंटे पढ़ना + 2 घंटे खुद को जांचना और गलतियों की समीक्षा करना' },
                ],
                correct: 1,
              },
            ],
            test: [
              {
                q: { en: 'Why does self-testing feel harder than re-reading — and why is that exactly the point?', hi: 'खुद को जांचना दोबारा पढ़ने से ज़्यादा कठिन क्यों लगता है — और यही बात महत्वपूर्ण क्यों है?' },
                options: [
                  { en: 'The difficulty of retrieval is where memory forms — struggle during study means less struggle during the real exam', hi: 'याद करने की कठिनाई ही वह जगह है जहां स्मृति बनती है — पढ़ाई के दौरान संघर्ष का मतलब है असली परीक्षा के दौरान कम संघर्ष' },
                  { en: 'It\'s harder because it\'s less efficient — re-reading is actually better for most students', hi: 'यह कठिन है क्योंकि यह कम कुशल है — ज़्यादातर छात्रों के लिए दोबारा पढ़ना वास्तव में बेहतर है' },
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
      {
        id: 'teacher_m2',
        order: 2,
        title: { en: 'The Student Who Isn\'t Getting It', hi: 'वह छात्र जो समझ नहीं पा रहा' },
        concept: {
          en: 'Every class has at least one student who consistently doesn\'t follow — and in a room of 30, the temptation is to keep moving and let the group carry them. But what that student is learning, lesson by lesson, is that being lost is their permanent condition. There\'s a specific, small thing you can do that doesn\'t slow the class but signals to that student that they\'re seen — and that changes what they do next.',
          hi: 'हर कक्षा में कम से कम एक छात्र होता है जो लगातार नहीं समझता — और 30 छात्रों के कमरे में, आगे बढ़ते रहने और समूह को उन्हें संभालने देने का लालच होता है। लेकिन वह छात्र, पाठ दर पाठ, यह सीख रहा होता है कि खोया रहना उनकी स्थायी स्थिति है। एक खास, छोटी चीज़ है जो आप कर सकते हैं जो कक्षा को धीमा नहीं करती लेकिन उस छात्र को संकेत देती है कि उन्हें देखा गया है।',
        },
        steps: [
          { en: 'At the end of a lesson, say the key concept in a second, simpler way — not for the class, just one more version — "another way to think about this is..." This costs 30 seconds and catches the ones who almost understood.', hi: 'पाठ के अंत में, मुख्य अवधारणा को एक दूसरे, सरल तरीके से कहें — पूरी कक्षा के लिए नहीं, बस एक और संस्करण — "इसके बारे में सोचने का एक और तरीका यह है..." यह 30 सेकंड लेता है और उन्हें पकड़ता है जो लगभग समझ गए थे।' },
          { en: 'Identify the one student who looks most lost — not to call on them, but to position a question near them: "let\'s check this from the beginning — what\'s the first step?" This lets them hear the foundation again without being singled out.', hi: 'उस एक छात्र को पहचानें जो सबसे अधिक खोया हुआ दिखता है — उन्हें बुलाने के लिए नहीं, बल्कि उनके पास एक सवाल रखने के लिए: "चलो इसे शुरू से जांचते हैं — पहला कदम क्या है?" यह उन्हें अलग किए बिना फिर से नींव सुनने देता है।' },
          { en: 'When a student makes a wrong answer in front of the class, respond to the logic, not the error: "I can see why you\'d think that — here\'s the part that shifts it..." This keeps others willing to try.', hi: 'जब कोई छात्र कक्षा के सामने गलत जवाब दे, गलती पर नहीं बल्कि तर्क पर प्रतिक्रिया करें: "मैं समझ सकता हूं आप ऐसा क्यों सोचेंगे — यहां वह हिस्सा है जो इसे बदलता है..." यह दूसरों को कोशिश करने के लिए तैयार रखता है।' },
        ],
        practiceSet: [
          {
            q: { en: 'A student answers a question incorrectly in front of the class. Which response best keeps them and others willing to participate?', hi: 'एक छात्र कक्षा के सामने एक सवाल का गलत जवाब देता है। कौन सी प्रतिक्रिया उन्हें और दूसरों को भाग लेने के लिए तैयार रखती है?' },
            options: [
              { en: '"That\'s wrong — who has the correct answer?"', hi: '"यह गलत है — किसके पास सही जवाब है?"' },
              { en: '"I can see why you\'d think that — the part that changes it is..."', hi: '"मैं समझ सकता हूं आप ऐसा क्यों सोचेंगे — जो हिस्सा इसे बदलता है वह है..."' },
              { en: 'Move on quickly to avoid embarrassing them', hi: 'उन्हें शर्मिंदगी से बचाने के लिए जल्दी आगे बढ़ें' },
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
