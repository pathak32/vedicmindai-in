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
    tiered: true,
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

      // ── Module 3 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m3',
        order: 3,
        title: { en: 'Shraddha — The Student Who Has Stopped Believing', hi: 'श्रद्धा — वह छात्र जिसने विश्वास करना बंद कर दिया' },
        concept: {
          en: 'Shraddha in the Vedic tradition is not blind belief — it is the student\'s active, willing openness to be changed by learning. The Mundaka Upanishad places it as the first requirement for a student approaching a Guru. Without Shraddha, the teacher\'s words land and leave, like water on stone.\n\nIn a modern classroom, you will recognise the absence of Shraddha: the student who stares through you, who submits blank papers not out of inability but out of having decided — often after repeated failures or humiliation — that trying is not worth it. This is not laziness. It is self-protection.\n\nThe Gurukul teacher understood this. The Guru did not simply increase the volume of instruction for a struggling student — they first worked to restore the student\'s belief that their mind was capable of change. The instruction came second.',
          hi: 'श्रद्धा का अर्थ अंधा विश्वास नहीं है — यह छात्र की वह सक्रिय, स्वेच्छापूर्ण खुलापन है जो सीखने से परिवर्तित होने के लिए तैयार हो। जब कक्षा में एक छात्र आपसे आर-पार देखता है, खाली कागज़ जमा करता है — तो यह आलस नहीं है। यह आत्म-सुरक्षा है। गुरुकुल का शिक्षक यह समझता था — वह पहले छात्र की श्रद्धा को पुनर्जीवित करता था, फिर ज्ञान देता था।',
        },
        vedic_source: 'Mundaka Upanishad 1.2.12',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'Find one thing the child does well — anything — and name it specifically in front of them before any correction.', hi: 'एक चीज़ ढूंढें जो बच्चा अच्छी तरह करता है — कुछ भी — और उसे उसके सामने नाम से कहें।' },
              { en: 'Lower the task until they succeed, then raise it one step. One success changes the internal story — "I can\'t" softens to "maybe."', hi: 'काम को इतना छोटा करें कि वे सफल हों, फिर एक कदम आगे बढ़ें। एक सफलता आंतरिक कहानी बदलती है।' },
              { en: 'Never correct them in front of others — primary-age children take public correction as identity-level feedback.', hi: 'उन्हें कभी दूसरों के सामने न सुधारें — इस उम्र में सार्वजनिक सुधार पहचान पर चोट की तरह लगता है।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'Address the pattern, not the instance: "I\'ve noticed you don\'t attempt the last two questions — what\'s happening there?"', hi: '"मैंने देखा है कि तुम आखिरी दो सवाल नहीं करते — वहां क्या हो रहा है?"' },
              { en: 'Share a moment when you yourself didn\'t understand something — briefly. It signals that confusion is normal, not a sign of deficiency.', hi: 'एक पल साझा करें जब आप खुद कुछ नहीं समझ पाए थे — संक्षेप में। यह संकेत देता है कि भ्रम सामान्य है।' },
              { en: 'Give a task slightly below their current ceiling — guaranteed success — before raising difficulty.', hi: 'उनकी मौजूदा सीमा से थोड़ा नीचे का काम दें — पक्की सफलता — फिर कठिनाई बढ़ाएं।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'Separate effort from outcome: "the score doesn\'t tell me how hard you worked — tell me what you tried."', hi: '"अंक मुझे यह नहीं बताते कि तुमने कितनी मेहनत की — मुझे बताओ तुमने क्या कोशिश की।"' },
              { en: 'When a student says "I\'m just bad at this," respond with specificity: "you solved the first three steps correctly — you\'re not bad at it, you\'re stuck at step four."', hi: '"तुमने पहले तीन चरण सही हल किए — तुम इसमें बुरे नहीं हो, चरण चार पर अटके हो।"' },
              { en: 'Protect their attempt in front of peers — never let class laughter at a wrong answer go unaddressed.', hi: 'साथियों के सामने उनके प्रयास की रक्षा करें — गलत जवाब पर कक्षा की हंसी को कभी अनसुना न करें।' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'A Class 9 student who previously performed well has stopped attempting questions. When you ask why, they shrug. What is most likely happening?', hi: 'कक्षा 9 का एक छात्र जो पहले अच्छा करता था, सवाल करना बंद कर दिया है। सबसे अधिक क्या हो रहा है?' },
            options: [
              { en: 'They have become lazy — needs stricter enforcement', hi: 'वे आलसी हो गए हैं — सख्त अनुशासन चाहिए' },
              { en: 'They have lost Shraddha — self-protection after repeated failure or humiliation', hi: 'उन्होंने श्रद्धा खो दी है — बार-बार विफलता के बाद आत्म-सुरक्षा' },
              { en: 'The content is too easy — they are bored', hi: 'सामग्री बहुत आसान है — वे ऊब गए हैं' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'Think of one student who seems to have "switched off." What do you actually know about what brought them to that point?', hi: 'एक छात्र के बारे में सोचें जो "बंद" लगता है। आप वास्तव में उस बारे में क्या जानते हैं जो उन्हें उस बिंदु पर लाया?' },
      },

      // ── Module 4 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m4',
        order: 4,
        title: { en: 'Speaking So They Hear — The Four Levels of Vak', hi: 'ऐसे बोलें कि वे सुनें — वाक् के चार स्तर' },
        concept: {
          en: 'The Rigveda describes four levels of speech — Para, Pashyanti, Madhyama, Vaikhari. Vaikhari is the spoken word — what you say in class. The student receives it through Madhyama (their inner formulation). When instruction fails, teachers often respond by repeating Vaikhari — saying the same thing louder or slower. But the failure is rarely at the Vaikhari level. It happens when the teacher\'s spoken word cannot reach the student\'s Madhyama — when the formulation is too abstract, too fast, or delivered in a way that assumes prior knowledge the student doesn\'t have.',
          hi: 'ऋग्वेद में वाक् के चार स्तर — परा, पश्यन्ती, मध्यमा, वैखरी। वैखरी वह है जो आप कक्षा में कहते हैं। जब शिक्षण विफल होता है, शिक्षक अक्सर वैखरी को दोहराते हैं। लेकिन विफलता शायद ही वैखरी के स्तर पर होती है। यह तब होती है जब बोला गया शब्द छात्र की मध्यमा तक नहीं पहुंच पाता।',
        },
        vedic_source: 'Rigveda 1.164.45',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'Use concrete objects and stories before abstract words. "Three apples plus two apples" reaches Madhyama; "addition" alone does not, at age 6.', hi: 'अमूर्त शब्दों से पहले ठोस वस्तुओं का उपयोग करें। "तीन सेब और दो सेब" मध्यमा तक पहुंचता है।' },
              { en: 'After explaining, ask "can you show me with your hands?" — this externalises Madhyama and shows whether understanding has formed.', hi: 'समझाने के बाद पूछें "क्या तुम इसे हाथों से दिखा सकते हो?"' },
              { en: 'Leave 7 seconds of silence after a question before taking an answer. Primary children need processing time.', hi: 'सवाल के बाद 7 सेकंड की चुप्पी रखें।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'Before teaching a new concept, ask what students already know about it. Connecting new information to existing Madhyama is how retention happens.', hi: 'नई अवधारणा सिखाने से पहले पूछें कि छात्र पहले से क्या जानते हैं।' },
              { en: 'When a student gives a wrong answer, ask "how did you get there?" before correcting. Their path of thinking reveals where Madhyama diverged.', hi: 'गलत जवाब पर सुधारने से पहले पूछें "तुम वहां कैसे पहुंचे?"' },
              { en: 'Use analogies from the students\' own world — cricket, cooking, WhatsApp — not from yours.', hi: 'छात्रों की अपनी दुनिया से उपमाएं लें — क्रिकेट, खाना बनाना।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'Ask students to explain a concept to each other — peer Vaikhari is often more effective because the peer speaks from a closer Madhyama.', hi: 'छात्रों से एक-दूसरे को अवधारणा समझाने को कहें।' },
              { en: 'Slow down at exactly the point where you feel most confident — overexplanation of easy parts, underexplanation of hard parts is the most common teaching error.', hi: 'ठीक उस बिंदु पर धीमे हों जहां आप सबसे आत्मविश्वासी हैं।' },
              { en: 'Replace "any doubts?" with "tell me the first step of this method in your own words."', hi: '"कोई शंका?" की जगह "इस विधि का पहला चरण अपने शब्दों में बताओ।"' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'You have explained a concept twice using the same words. Most students still look confused. What is the most useful next move?', hi: 'आपने एक अवधारणा को एक ही शब्दों से दो बार समझाया। अधिकांश छात्र अभी भी भ्रमित दिखते हैं। सबसे उपयोगी अगला कदम क्या है?' },
            options: [
              { en: 'Explain it a third time, more slowly', hi: 'इसे तीसरी बार, और धीरे समझाएं' },
              { en: 'Ask a student to tell you in their own words what they understand so far — use their Madhyama as the starting point', hi: 'एक छात्र से पूछें कि वे अब तक क्या समझते हैं — उनकी मध्यमा को शुरुआती बिंदु बनाएं' },
              { en: 'Move on and come back to it next class', hi: 'आगे बढ़ें और अगली कक्षा में वापस आएं' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'Think of a concept you teach that students consistently struggle with. What assumption about prior knowledge might you be making?', hi: 'एक अवधारणा के बारे में सोचें जो छात्र लगातार संघर्ष करते हैं। पूर्व ज्ञान के बारे में आप क्या मान रहे होंगे?' },
      },

      // ── Module 5 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m5',
        order: 5,
        title: { en: 'The Question That Opens and the Question That Closes', hi: 'वह प्रश्न जो खोलता है और वह जो बंद करता है' },
        concept: {
          en: 'The Upanishads were not lectures — they were dialogues driven by the Guru\'s questions. There are two kinds of questions a teacher can ask. Opening questions — "what do you notice about these three numbers?" — require the student to generate thought. Closing questions — "what is the formula for this?" — test retrieval. Both have a place, but when teachers use only closing questions, students learn to wait for the teacher to ask the right question rather than developing their own capacity to inquire.',
          hi: 'उपनिषद् व्याख्यान नहीं थे — वे गुरु के प्रश्नों से चलने वाले संवाद थे। दो प्रकार के प्रश्न होते हैं। खोलने वाले प्रश्न — "इन तीन संख्याओं में तुम क्या देखते हो?" जब शिक्षक केवल बंद करने वाले प्रश्न पूछते हैं, तो छात्र सही प्रश्न का इंतज़ार करना सीखते हैं।',
        },
        vedic_source: 'Brihadaranyaka Upanishad 3.1–9 (Yajnavalkya dialogues)',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'Use "what do you notice?" as your primary opening question — it has no wrong answer, and every child can respond.', hi: '"तुम्हें क्या दिखता है?" को अपना प्राथमिक प्रश्न बनाएं।' },
              { en: 'When a child gives a surprising answer, ask "how did you think of that?" — modelling curiosity about thinking itself.', hi: 'जब बच्चा कोई आश्चर्यजनक जवाब दे, "तुमने ऐसा कैसे सोचा?" पूछें।' },
              { en: 'End lessons with "what is one thing you are still wondering about?" — this teaches children that confusion is a starting point, not an endpoint.', hi: 'पाठ का अंत "एक चीज़ जो तुम अभी भी जानना चाहते हो?" से करें।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'Replace "does everyone understand?" with "what is one thing that is still unclear?" — specific enough to answer honestly.', hi: '"क्या सब समझे?" की जगह "एक चीज़ जो अभी भी स्पष्ट नहीं है?" पूछें।' },
              { en: 'Ask "what\'s another way to look at this?" after giving the standard explanation.', hi: 'मानक व्याख्या देने के बाद "इसे देखने का एक और तरीका क्या है?" पूछें।' },
              { en: 'When a student is stuck, ask "what do you know for certain about this problem?" — certainty-mapping shows them they have more ground than they think.', hi: 'जब छात्र अटका हो, "इस समस्या के बारे में तुम क्या निश्चित रूप से जानते हो?" पूछें।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'Ask "where could this be wrong?" about your own explanations — modelling self-questioning is one of the highest-value things a teacher can demonstrate.', hi: '"यह कहां गलत हो सकता है?" — अपनी खुद की व्याख्याओं के बारे में पूछें।' },
              { en: 'Use Socratic questioning on misconceptions: don\'t correct directly — ask "if that\'s true, what would follow from it?" and let students reach the contradiction themselves.', hi: 'गलतफहमियों पर सीधे सुधार न करें — "अगर यह सच है, तो इससे क्या निकलेगा?" पूछें।' },
              { en: 'Ask "what would change in your approach if you had 30 minutes less?" — forces prioritisation thinking, the actual skill tested in competitive exams.', hi: '"अगर तुम्हारे पास 30 मिनट कम होते तो तुम्हारा तरीका क्या बदलता?"' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'You ask "does everyone understand?" after a difficult explanation. The class is silent. What does that silence most likely mean?', hi: 'आप कठिन व्याख्या के बाद "क्या सब समझे?" पूछते हैं। कक्षा चुप है। इस चुप्पी का सबसे अधिक क्या मतलब है?' },
            options: [
              { en: 'Everyone understood — no questions', hi: 'सभी समझ गए — कोई सवाल नहीं' },
              { en: 'The question was too broad to answer honestly — students need a specific, safer question', hi: 'प्रश्न ईमानदारी से उत्तर देने के लिए बहुत व्यापक था — छात्रों को एक विशिष्ट, सुरक्षित प्रश्न चाहिए' },
              { en: 'Students are tired — move on', hi: 'छात्र थके हुए हैं — आगे बढ़ें' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'In your last class, what proportion of your questions were opening questions versus closing questions?', hi: 'आपकी पिछली कक्षा में, आपके कितने प्रश्न खोलने वाले थे बनाम बंद करने वाले?' },
      },

      // ── Module 6 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m6',
        order: 6,
        title: { en: 'Seeing the Whole Child — Pancha Kosha', hi: 'पूरे बच्चे को देखना — पंचकोश' },
        concept: {
          en: 'The Taittiriya Upanishad describes five layers (koshas) of a human being: Annamaya (physical body), Pranamaya (vital/breath body), Manomaya (mental body), Vijnanamaya (intellectual body), Anandamaya (bliss body). Learning is only possible when the first three are stable. A student who hasn\'t eaten, who slept badly, or who is in acute social stress has genuinely reduced cognitive bandwidth — this is not metaphor, it is neuroscience. The Gurukul teacher knew their students deeply enough to read which Kosha was unavailable on a given day.',
          hi: 'तैत्तिरीय उपनिषद् पंचकोश का वर्णन करता है। सीखना तभी संभव है जब पहले तीन स्थिर हों। जो छात्र भूखा है, जिसने बुरी तरह सोया है, या जो तीव्र तनाव में है — उसकी संज्ञानात्मक क्षमता वास्तव में कम होती है।',
        },
        vedic_source: 'Taittiriya Upanishad 2.1–5 (Brahmananda Valli)',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'Notice if a child is physically off — hasn\'t eaten, tired, in pain. A 2-minute conversation ("you seem quiet today, everything okay?") is not lost teaching time — it is the condition for teaching time.', hi: 'ध्यान दें कि क्या बच्चा शारीरिक रूप से ठीक नहीं है। 2 मिनट की बातचीत खोया हुआ समय नहीं — यह पढ़ाने के समय की शर्त है।' },
              { en: 'Build a 3-minute settling routine at the start of class — a breath, a question. This transitions Pranamaya from the stimulation of the corridor to the focus of the classroom.', hi: 'कक्षा की शुरुआत में 3 मिनट का स्थिरीकरण रूटीन बनाएं।' },
              { en: 'Seat children who seem anxious near you — not as punishment, but as proximity support.', hi: 'जो बच्चे चिंतित दिखें उन्हें अपने पास बिठाएं — दंड के रूप में नहीं, निकटता समर्थन के रूप में।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'If a student who is normally present seems absent — eyes glazed — check in privately after class, not during. Public check-ins at this age are threatening to Pranamaya.', hi: 'अगर सामान्यतः उपस्थित छात्र अनुपस्थित लगे — कक्षा के दौरान नहीं, बाद में निजी रूप से बात करें।' },
              { en: 'Acknowledge when the class seems collectively anxious — before a major exam. Naming group Pranamaya is more effective than ignoring it and teaching through it.', hi: 'जब पूरी कक्षा सामूहिक रूप से चिंतित हो — नाम लेकर स्वीकार करें।' },
              { en: 'After a school event that caused conflict, give 5 minutes for students to settle before beginning content.', hi: 'किसी संघर्षपूर्ण घटना के बाद सामग्री शुरू करने से पहले 5 मिनट दें।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'In weeks before board exams, explicitly teach one breathing technique. The 3-5 minutes this costs is recovered tenfold in cognitive availability during the exam.', hi: 'बोर्ड परीक्षाओं से पहले एक श्वास तकनीक सिखाएं।' },
              { en: 'Watch for Annamaya signals — students not eating, surviving on caffeine, not sleeping. Name it: "your brain doesn\'t retain well below 6 hours of sleep."', hi: '"6 घंटे से कम नींद में मस्तिष्क अच्छी तरह याद नहीं रखता।"' },
              { en: 'Distinguish between a student who can\'t do the work and one who currently can\'t access their capacity because Pranamaya is overwhelmed. The intervention is completely different.', hi: 'उस छात्र में फर्क करें जो काम नहीं कर सकता और जो इस समय नहीं कर सकता क्योंकि उसका प्राणमय अभिभूत है।' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'A student who normally performs well scores very poorly and seems distracted for a week. What does the Pancha Kosha framework suggest first?', hi: 'एक छात्र जो सामान्यतः अच्छा करता है, एक हफ्ते के लिए खराब प्रदर्शन करता है। पंचकोश ढांचा पहले क्या सुझाता है?' },
            options: [
              { en: 'Increase academic support immediately — extra practice', hi: 'तुरंत अकादमिक समर्थन बढ़ाएं' },
              { en: 'Check whether something has disrupted their Pranamaya or Annamaya first — performance changes are often symptoms, not problems', hi: 'पहले जांचें कि क्या उनके प्राणमय या अन्नमय को कुछ बाधित किया है' },
              { en: 'Inform parents immediately about the drop', hi: 'तुरंत माता-पिता को गिरावट के बारे में सूचित करें' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'Think of a student who is consistently underperforming. What do you actually know about their Annamaya and Pranamaya conditions?', hi: 'एक छात्र के बारे में सोचें जो लगातार कम प्रदर्शन कर रहा है। आप उनकी अन्नमय और प्राणमय स्थिति के बारे में वास्तव में क्या जानते हैं?' },
      },

      // ── Module 7 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m7',
        order: 7,
        title: { en: 'Sama, Dama, Uparati — Managing Yourself in the Classroom', hi: 'शम, दम, उपरति — कक्षा में स्वयं को संभालना' },
        concept: {
          en: 'Adi Shankaracharya\'s Vivekachudamani lists Sama (inner calm), Dama (sense restraint), and Uparati (non-reactivity) as foundational qualities for a teacher. A teacher who cannot access these in a difficult moment — when a student is disruptive, when the class is chaotic — loses the capacity to respond thoughtfully and falls back on reaction. The Gurukul Guru\'s authority came from this visible quality of groundedness. Students trust a teacher who does not lose themselves under pressure.',
          hi: 'आदि शंकराचार्य के विवेकचूड़ामणि में शम, दम और उपरति — एक शिक्षक के लिए मूलभूत गुण हैं। गुरुकुल गुरु का अधिकार पद से नहीं — इस दृश्यमान स्थिरता से आता था। उपरति उदासीनता नहीं है — यह उत्तेजना और प्रतिक्रिया के बीच के अंतर को बनाने के बारे में है।',
        },
        vedic_source: 'Vivekachudamani v.22–24 (Adi Shankaracharya)',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'When a child\'s behaviour triggers frustration, use a physical anchor before responding — a deliberate breath, lower your voice rather than raising it.', hi: 'जब किसी बच्चे का व्यवहार निराशा उत्पन्न करे, जवाब देने से पहले एक जानबूझकर श्वास लें, आवाज़ को ऊंचा करने की जगह नीचा करें।' },
              { en: 'Build a classroom signal for "pause" that gives both you and students a reset moment.', hi: 'एक कक्षा "विराम" संकेत बनाएं जो आपको और छात्रों को रीसेट पल देता है।' },
              { en: 'After a difficult classroom moment, acknowledge it briefly: "that was a hard moment — let\'s take a breath and start again."', hi: 'कठिन पल के बाद संक्षेप में स्वीकार करें: "वह एक कठिन पल था — एक श्वास लेते हैं।"' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'Respond to the behaviour, not your interpretation: "you\'re talking when I\'m teaching" not "you don\'t care about this class."', hi: '"तुम तब बात कर रहे हो जब मैं पढ़ा रहा हूं" — न कि "तुम्हें इस कक्षा की परवाह नहीं।"' },
              { en: 'Identify your personal triggers — the specific student behaviours that most reliably destabilise your Sama. Name them to yourself so they become less automatic.', hi: 'अपने व्यक्तिगत ट्रिगर पहचानें — वे व्यवहार जो सबसे विश्वसनीय रूप से आपके शम को अस्थिर करते हैं।' },
              { en: 'When you make an error in class, acknowledge it without excessive apology or defensiveness. This is Dama in action.', hi: 'जब आप गलती करें — बिना अत्यधिक माफी या रक्षात्मकता के स्वीकार करें।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'When students challenge or confront you, Uparati means receiving it without either collapsing or escalating. Neither is strength.', hi: 'जब छात्र चुनौती दें, उपरति का अर्थ है — न ढहकर और न बढ़ाकर स्वीकार करना।' },
              { en: 'Build a post-class reflection practice: "what triggered me today, and what was my actual response?" Sama is a capacity that can be trained.', hi: 'कक्षा के बाद चिंतन अभ्यास बनाएं: "आज मुझे क्या ट्रिगर हुआ?"' },
              { en: 'Before a major exam, your visible Sama is the most powerful intervention available — students borrow nervous system regulation from calm adults around them.', hi: 'प्रमुख परीक्षा से पहले, आपका दृश्यमान शम सबसे शक्तिशाली हस्तक्षेप है।' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'A student responds to your correction with visible irritation: "this explanation doesn\'t make sense." Which response best demonstrates Uparati?', hi: 'एक छात्र आपके सुधार पर चिड़चिड़ाहट से कहता है: "यह व्याख्या समझ नहीं आती।" कौन सी प्रतिक्रिया उपरति दर्शाती है?' },
            options: [
              { en: '"You need to be more respectful in this classroom."', hi: '"तुम्हें इस कक्षा में अधिक सम्मानजनक होना होगा।"' },
              { en: '"Tell me specifically which part isn\'t clear — I\'d like to explain it better."', hi: '"मुझे बताओ विशेष रूप से कौन सा हिस्सा स्पष्ट नहीं है — मैं इसे बेहतर समझाना चाहूंगा।"' },
              { en: 'Continue the lesson and address their attitude after class', hi: 'पाठ जारी रखें और उनके रवैये को बाद में संबोधित करें' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'What is the one student behaviour that most reliably destabilises your Sama? What do you do in those moments that you would not do if you had two more seconds?', hi: 'वह कौन सा छात्र व्यवहार है जो सबसे विश्वसनीय रूप से आपके शम को अस्थिर करता है?' },
      },

      // ── Module 8 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m8',
        order: 8,
        title: { en: 'The Moment of Mastery — Naming What You See', hi: 'महारत का पल — जो दिखे उसे नाम दो' },
        concept: {
          en: 'In the Chandogya Upanishad, when Satyakama Jabali returns to his Guru after twelve years, the Guru says: "You shine like one who knows Brahman." Not "well done" — but a precise naming of what the Guru observes. Modern teaching has largely replaced this with generic praise: "good job," "excellent." These phrases pass through students without sticking because they contain no information. The moment of mastery — when a struggling student finally gets something — is a pedagogical event. What you do in that moment determines whether the student\'s identity updates to include "I can do this."',
          hi: 'छांदोग्य उपनिषद् में, गुरु कहते हैं: "तुम ब्रह्म को जानने वाले की तरह चमकते हो।" यह सामान्य प्रशंसा नहीं — विशिष्ट, देखी हुई है। "अच्छा किया," "बहुत बढ़िया" — ये वाक्यांश छात्रों से गुज़र जाते हैं। महारत का पल — जब एक संघर्षरत छात्र अंततः कुछ समझ जाता है — एक शैक्षणिक घटना है।',
        },
        vedic_source: 'Chandogya Upanishad 4.14 (Satyakama Jabali)',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'When a child gets something after struggling, name what you observed specifically: "you kept trying even when it was hard — that\'s the thing that made it work."', hi: 'जब बच्चा संघर्ष के बाद कुछ समझे, विशेष रूप से नाम लें: "तुम कठिन होने पर भी कोशिश करते रहे।"' },
              { en: 'Avoid comparative recognition — "best in the class." Comparative praise teaches children to evaluate themselves against others, not their own previous state.', hi: 'तुलनात्मक मान्यता से बचें। तुलनात्मक प्रशंसा बच्चों को दूसरों के मुकाबले खुद का मूल्यांकन करना सिखाती है।' },
              { en: 'Keep a mental note of each child\'s last mastery moment — reference it when they struggle next: "remember when you finally got this? this is the same kind of problem."', hi: 'हर बच्चे के आखिरी महारत पल का मानसिक नोट रखें और अगले संघर्ष में उसका संदर्भ दें।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'When a student produces something genuinely good, name it precisely in front of the class: "what Priya just did is called a proof by contradiction — that\'s a university-level move."', hi: 'जब छात्र कुछ वास्तव में अच्छा करे, इसे कक्षा के सामने सटीक रूप से नाम दें।' },
              { en: 'After a student who has struggled gets something right, acknowledge it privately first — then, if appropriate, publicly.', hi: 'जब एक संघर्षरत छात्र सही करे, पहले निजी रूप से स्वीकार करें — फिर उचित हो तो सार्वजनिक रूप से।' },
              { en: 'Distinguish between praising the result and praising the process: "the way you checked your work at the end caught an error that most people miss."', hi: '"तुमने अंत में अपना काम जांचा जिसने वह त्रुटि पकड़ी जो ज़्यादातर लोग चूक जाते हैं।"' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'When a struggling student makes a breakthrough, stop the class for 30 seconds to name it: "what just happened in Rahul\'s working is exactly the insight this entire topic depends on."', hi: 'जब एक संघर्षरत छात्र को सफलता मिले — 30 सेकंड के लिए कक्षा रोककर इसे नाम दें।' },
              { en: 'Write specific feedback, not grades alone: "your analysis in paragraph 3 correctly identified the causal chain — this is the level of reasoning the board exam tests."', hi: 'केवल ग्रेड नहीं — विशिष्ट फीडबैक लिखें।' },
              { en: 'In the last weeks before exams, create explicit moments to remind students how far they have come — not to comfort, but to anchor their identity before assessment.', hi: 'परीक्षाओं से पहले के अंतिम हफ्तों में छात्रों को याद दिलाएं कि वे कितनी दूर आए हैं।' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'After a struggling student finally solves a difficult problem correctly, which response best follows the Chandogya Upanishad\'s principle?', hi: 'एक संघर्षरत छात्र अंततः एक कठिन समस्या सही हल करता है। कौन सी प्रतिक्रिया सबसे अच्छी है?' },
            options: [
              { en: '"Good job!"', hi: '"अच्छा किया!"' },
              { en: '"Excellent — 10 out of 10."', hi: '"बहुत बढ़िया — 10 में से 10।"' },
              { en: '"You found the pattern that makes this whole method work — that\'s the thinking that will carry you through the rest of this chapter."', hi: '"तुमने वह पैटर्न खोजा जो इस पूरी विधि को काम करता है।"' },
            ],
            correct: 2,
          },
        ],
        reflection: { en: 'Think of the last time a student in your class had a genuine mastery moment. What did you say? What would you say now?', hi: 'उस आखिरी बार के बारे में सोचें जब आपके कक्षा में किसी छात्र को वास्तविक महारत का पल मिला। आपने क्या कहा?' },
      },

      // ── Module 9 ─────────────────────────────────────────────────────
      {
        id: 'teacher_m9',
        order: 9,
        title: { en: 'Fair Witness — Assessment Without Bias', hi: 'निष्पक्ष साक्षी — बिना पूर्वाग्रह के आकलन' },
        concept: {
          en: 'The Nyaya Shastra holds that valid knowledge (Pramana) must be acquired through correct means. Pratyaksha (direct perception) is the highest — but teachers most often assess through Anumana (inference). "This student is bright but lazy" — the "bright" might be Pratyaksha, but the "lazy" is almost certainly Anumana. Research on teacher expectation effects (Rosenthal and Jacobson, 1968) confirms what the Nyaya school articulated 2500 years ago: how you perceive a student becomes a self-fulfilling prophecy through your differential treatment of them.',
          hi: 'न्याय शास्त्र: किसी चीज़ को जानने का दावा करने से पहले, यह पहचानें कि आप किस प्रमाण से उस ज्ञान तक आए। "यह छात्र प्रतिभाशाली लेकिन आलसी है" — "आलसी" लगभग निश्चित रूप से अनुमान है। रोसेन्थल और जैकबसन (1968) ने पुष्टि की: आप एक छात्र को जैसा देखते हैं, वह स्व-पूर्ण भविष्यवाणी बन जाता है।',
        },
        vedic_source: 'Nyaya Sutras (Gautama Muni) — Pratyaksha, Anumana, Upamana, Shabda',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'Before a test, write one genuine observation about each child\'s understanding — not expectation. Compare to the result. Where they diverge is where your Anumana was operating.', hi: 'परीक्षा से पहले, प्रत्येक बच्चे की समझ के बारे में एक वास्तविक अवलोकन लिखें — अपेक्षा नहीं।' },
              { en: 'When a child consistently underperforms, ask: "what do I actually observe, versus what have I come to assume about this child?"', hi: '"मैं वास्तव में क्या देखता हूं, बनाम इस बच्चे के बारे में मैंने क्या मान लिया है?"' },
              { en: 'Give every child a low-stakes oral opportunity separate from written tests — some children\'s Pratyaksha is invisible in written form.', hi: 'हर बच्चे को लिखित परीक्षाओं से अलग एक मौखिक अवसर दें।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'When marking, cover the name before reading the paper — especially for students you have a strong prior impression of. This is Pratyaksha discipline.', hi: 'जांचते समय पेपर पढ़ने से पहले नाम ढकें — विशेष रूप से उन छात्रों के लिए जिनके बारे में आपकी पहले से मजबूत राय है।' },
              { en: 'Audit your questioning patterns: which students do you call on most? Least? These patterns reveal your Anumana about who is capable.', hi: 'अपने प्रश्न पूछने के पैटर्न की जांच करें: आप किन छात्रों को सबसे अधिक बुलाते हैं?' },
              { en: 'When a student surprises you, treat it as data about your Anumana — not the student\'s inconsistency.', hi: 'जब कोई छात्र आपको आश्चर्यचकित करे, इसे अपने अनुमान के बारे में डेटा मानें।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'Be explicit with students: "right now, your approach to time-management is weak" is not the same as "you are weak." Assessment of current performance ≠ assessment of capacity.', hi: '"अभी, परीक्षाओं में समय-प्रबंधन के प्रति तुम्हारा दृष्टिकोण कमज़ोर है" — "तुम कमज़ोर हो" जैसा नहीं।' },
              { en: 'In coaching, students who have been with you longer get more benefit-of-the-doubt. Name this to yourself and actively counteract it.', hi: 'कोचिंग में, जो छात्र अधिक समय से हैं उन्हें अधिक संदेह का लाभ मिलता है। इसे खुद से कहें और प्रतिकार करें।' },
              { en: 'Separate prediction from preparation: "I think you\'ll get 85" is Anumana. "Here\'s what I observe about your preparation" is Pratyaksha.', hi: '"मुझे लगता है तुम्हें 85 मिलेंगे" अनुमान है। "तुम्हारी तैयारी के बारे में मैं यह देखता हूं" प्रत्यक्ष है।' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'A teacher says: "I know Arun is bright — he just doesn\'t apply himself." Using the Nyaya framework, what kind of knowledge claim is "he doesn\'t apply himself"?', hi: 'एक शिक्षक कहता है: "अरुण प्रतिभाशाली है — वह बस खुद को नहीं लगाता।" न्याय ढांचे में यह किस प्रकार का ज्ञान दावा है?' },
            options: [
              { en: 'Pratyaksha — directly observed', hi: 'प्रत्यक्ष — सीधे देखा गया' },
              { en: 'Anumana — inferred from incomplete observation, filtered through expectation', hi: 'अनुमान — अधूरे अवलोकन से निष्कर्षित, अपेक्षा से फ़िल्टर किया गया' },
              { en: 'Shabda — received from another teacher\'s report', hi: 'शब्द — किसी अन्य शिक्षक की रिपोर्ट से प्राप्त' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'Name one student about whom you hold a strong opinion. How much of that opinion is Pratyaksha and how much is Anumana?', hi: 'एक छात्र का नाम लें जिसके बारे में आपकी मजबूत राय है। वह राय कितनी प्रत्यक्ष है और कितनी अनुमान?' },
      },

      // ── Module 10 ────────────────────────────────────────────────────
      {
        id: 'teacher_m10',
        order: 10,
        title: { en: 'The Teacher Who Keeps Learning — Neti Neti', hi: 'वह शिक्षक जो सीखता रहता है — नेति नेति' },
        concept: {
          en: '"Neti neti" — not this, not this — is the Upanishadic recognition that reality exceeds any description of it. Applied to teaching: every model you have of a subject is "neti neti" — correct as far as it goes, but incomplete. Every model of a student is the same. The moment a teacher stops treating their own understanding as provisional — the moment they stop being curious — their teaching calcifies into information delivery. A teacher who stops being a student cannot transmit the living quality of Shraddha — only its dead form.',
          hi: '"नेति नेति" — "यह नहीं, यह नहीं।" किसी विषय के बारे में आपका हर मॉडल "नेति नेति" है। जो शिक्षक छात्र बनना बंद कर देता है, वह श्रद्धा को जीवित रूप में नहीं बल्कि उसके मृत रूप में ही प्रसारित कर सकता है।',
        },
        vedic_source: 'Brihadaranyaka Upanishad 2.3.6',
        tiers: {
          primary: {
            label: { en: 'Classes 1–5', hi: 'कक्षा 1–5' },
            steps: [
              { en: 'When a child asks a question you can\'t answer, say "I don\'t know — let\'s find out together." You are teaching them that not-knowing is the beginning of learning, not its failure.', hi: '"मुझे नहीं पता — चलो मिलकर पता करते हैं।" आप उन्हें सिखा रहे हैं कि न-जानना सीखने की शुरुआत है।' },
              { en: 'Show genuine curiosity about something outside your subject in class. Curiosity is caught, not taught — students need to see it in you.', hi: 'कक्षा में अपने विषय से बाहर किसी चीज़ के बारे में वास्तविक जिज्ञासा दिखाएं।' },
              { en: 'When a child corrects you, receive it fully: "you\'re right, I made an error." This models intellectual honesty at the most formative age.', hi: 'जब बच्चा सुधारे: "तुम सही हो, मैंने गलती की।" यह सबसे महत्वपूर्ण उम्र में बौद्धिक ईमानदारी का आदर्श है।' },
            ],
          },
          secondary: {
            label: { en: 'Classes 6–10', hi: 'कक्षा 6–10' },
            steps: [
              { en: 'Periodically tell your class something you are currently learning — not as performance, but genuine disclosure. It signals that learning doesn\'t stop when you become a teacher.', hi: 'समय-समय पर अपनी कक्षा को कुछ बताएं जो आप वर्तमान में सीख रहे हैं।' },
              { en: 'When a student interprets a concept you\'ve taught for years in an unexpected way, be genuinely curious before evaluating it. "Neti neti" applies to your own subject knowledge.', hi: 'जब छात्र एक अवधारणा को अप्रत्याशित रूप से व्याख्यायित करे, मूल्यांकन करने से पहले वास्तव में जिज्ञासु हों।' },
              { en: 'Identify one chapter you teach without thinking. Relearn it — what changed in the field? What do you now find unsatisfying in your old explanation?', hi: 'एक अध्याय पहचानें जो आप बिना सोचे पढ़ाते हैं। इसे फिर से सीखें।' },
            ],
          },
          senior: {
            label: { en: 'Classes 11–12 & Coaching', hi: 'कक्षा 11–12 एवं कोचिंग' },
            steps: [
              { en: 'When a student knows more about a narrow topic than you do, acknowledge it: "you\'ve read more recent work on this than I have — teach me." This is not a loss of authority; it is its highest form.', hi: '"तुमने इस पर मुझसे अधिक हालिया शोध पढ़ा है — मुझे सिखाओ।" यह अधिकार का नुकसान नहीं — इसका सर्वोच्च रूप है।' },
              { en: 'When your approach is challenged with a valid alternative method, work through both publicly — "neti neti" means neither has the final word.', hi: 'वैध वैकल्पिक विधि से चुनौती मिले तो दोनों को सार्वजनिक रूप से देखें।' },
              { en: 'Tell students directly: "I have been wrong about things I was certain of. The willingness to update when evidence changes is not weakness — it distinguishes a thinker from a parrot."', hi: '"मैं उन चीज़ों के बारे में गलत रहा हूं जिनके बारे में मैं निश्चित था। सबूत बदलने पर अपडेट करने की इच्छा कमज़ोरी नहीं है।"' },
            ],
          },
        },
        practiceSet: [
          {
            q: { en: 'A student corrects your explanation with a valid alternative interpretation you hadn\'t considered. What best reflects Neti Neti?', hi: 'एक छात्र आपकी व्याख्या को एक वैध वैकल्पिक व्याख्या से सुधारता है। नेति नेति क्या दर्शाता है?' },
            options: [
              { en: '"That\'s an interesting idea but the textbook approach is what matters for exams."', hi: '"यह दिलचस्प विचार है लेकिन परीक्षाओं के लिए पाठ्यपुस्तक का तरीका मायने रखता है।"' },
              { en: '"You\'re right — let\'s examine both and see where each one holds and where it breaks."', hi: '"तुम सही हो — चलो दोनों को देखते हैं और जांचते हैं कि हर एक कहां टिकता है।"' },
              { en: 'Acknowledge it briefly and continue with your original explanation', hi: 'संक्षेप में स्वीकार करें और अपनी मूल व्याख्या जारी रखें' },
            ],
            correct: 1,
          },
        ],
        reflection: { en: 'What is one thing you believe about teaching that you have never seriously questioned? Where did that belief come from?', hi: 'शिक्षण के बारे में एक चीज़ क्या है जिसे आपने कभी गंभीरता से नहीं पूछा? वह विश्वास कहां से आया?' },
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
    // Teacher modules use 'senior' key; page tier selector uses 'teen' — map transparently
    const tierKey = ageTier === 'teen' && mod.tiers && mod.tiers.senior ? 'senior' : (ageTier || 'secondary');
    return { ...mod, ...mod.tiers[tierKey] };
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
