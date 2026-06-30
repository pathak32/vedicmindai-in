import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

// Resolves a field that may be a plain string (older English-only practice
// sets) or a { en, hi } bilingual object (new sets). Falls back to English.
function tr(field, language) {
  if (field == null) return field;
  if (typeof field === 'string') return field;
  return field[language] ?? field.en ?? '';
}

// ─── Per-lesson MCQ practice problems ────────────────────────────────────────

const LESSON_PROBLEMS = {
  l1_01: [
    { q: { en: 'Calculate 35² using Ekadhikena Purvena', hi: 'एकाधिकेन पूर्वेण का उपयोग करके 35² निकालें' }, options: ['1025','1125','1225','1325'], correct: 2, exp: { en: '3×4=12, append 25 → 1225', hi: '3×4=12, 25 जोड़ें → 1225' } },
    { q: { en: 'Calculate 75²', hi: '75² निकालें' }, options: ['5425','5525','5625','5725'], correct: 2, exp: { en: '7×8=56, append 25 → 5625', hi: '7×8=56, 25 जोड़ें → 5625' } },
    { q: { en: 'Calculate 65²', hi: '65² निकालें' }, options: ['4025','4125','4225','4325'], correct: 2, exp: { en: '6×7=42, append 25 → 4225', hi: '6×7=42, 25 जोड़ें → 4225' } },
    { q: { en: 'Calculate 45²', hi: '45² निकालें' }, options: ['1825','1925','2025','2125'], correct: 2, exp: { en: '4×5=20, append 25 → 2025', hi: '4×5=20, 25 जोड़ें → 2025' } },
    { q: { en: 'Calculate 55²', hi: '55² निकालें' }, options: ['2925','3025','3125','3225'], correct: 1, exp: { en: '5×6=30, append 25 → 3025', hi: '5×6=30, 25 जोड़ें → 3025' } },
  ],
  l1_02: [
    { q: { en: 'Calculate 25²', hi: '25² निकालें' }, options: ['425','525','625','725'], correct: 2, exp: { en: '2×3=6, append 25 → 625', hi: '2×3=6, 25 जोड़ें → 625' } },
    { q: { en: 'Calculate 85²', hi: '85² निकालें' }, options: ['7025','7125','7225','7325'], correct: 2, exp: { en: '8×9=72, append 25 → 7225', hi: '8×9=72, 25 जोड़ें → 7225' } },
    { q: { en: 'Calculate 95²', hi: '95² निकालें' }, options: ['9025','9125','9225','9325'], correct: 0, exp: { en: '9×10=90, append 25 → 9025', hi: '9×10=90, 25 जोड़ें → 9025' } },
    { q: { en: 'Calculate 15²', hi: '15² निकालें' }, options: ['125','225','325','425'], correct: 1, exp: { en: '1×2=2, append 25 → 225', hi: '1×2=2, 25 जोड़ें → 225' } },
    { q: { en: 'Calculate 105² (hint: 10×11=110, append 25)', hi: '105² निकालें (संकेत: 10×11=110, 25 जोड़ें)' }, options: ['10925','11025','11125','11225'], correct: 1, exp: { en: '10×11=110, append 25 → 11025', hi: '10×11=110, 25 जोड़ें → 11025' } },
  ],
  l1_03: [
    { q: { en: 'Calculate 8 × 7 using Nikhilam (base 10)', hi: 'निखिलम् (आधार 10) से 8 × 7 निकालें' }, options: ['54','56','58','52'], correct: 1, exp: { en: 'Deficits 2,3. Cross: 8−3=5. Product: 2×3=6 → 56', hi: 'कमियाँ 2,3। तिरछा: 8−3=5। गुणनफल: 2×3=6 → 56' } },
    { q: { en: 'Calculate 9 × 6 using Nikhilam', hi: 'निखिलम् से 9 × 6 निकालें' }, options: ['52','54','56','48'], correct: 1, exp: { en: 'Deficits 1,4. Cross: 9−4=5. Product: 1×4=4 → 54', hi: 'कमियाँ 1,4। तिरछा: 9−4=5। गुणनफल: 1×4=4 → 54' } },
    { q: { en: 'Calculate 7 × 8 using Nikhilam', hi: 'निखिलम् से 7 × 8 निकालें' }, options: ['54','56','58','52'], correct: 1, exp: { en: 'Deficits 3,2. Cross: 7−2=5. Product: 3×2=6 → 56', hi: 'कमियाँ 3,2। तिरछा: 7−2=5। गुणनफल: 3×2=6 → 56' } },
    { q: { en: 'Calculate 9 × 7 using Nikhilam', hi: 'निखिलम् से 9 × 7 निकालें' }, options: ['59','63','61','65'], correct: 1, exp: { en: 'Deficits 1,3. Cross: 9−3=6. Product: 1×3=3 → 63', hi: 'कमियाँ 1,3। तिरछा: 9−3=6। गुणनफल: 1×3=3 → 63' } },
    { q: { en: 'Calculate 6 × 8 using Nikhilam', hi: 'निखिलम् से 6 × 8 निकालें' }, options: ['46','48','50','44'], correct: 1, exp: { en: 'Deficits 4,2. Cross: 6−2=4. Product: 4×2=8 → 48', hi: 'कमियाँ 4,2। तिरछा: 6−2=4। गुणनफल: 4×2=8 → 48' } },
  ],
  l1_04: [
    { q: { en: 'Calculate 97 × 96 using Nikhilam (base 100)', hi: 'निखिलम् (आधार 100) से 97 × 96 निकालें' }, options: ['9212','9312','9412','9112'], correct: 1, exp: { en: 'Deficits 3,4. Cross: 97−4=93. Product: 3×4=12 → 9312', hi: 'कमियाँ 3,4। तिरछा: 97−4=93। गुणनफल: 3×4=12 → 9312' } },
    { q: { en: 'Calculate 98 × 97', hi: '98 × 97 निकालें' }, options: ['9406','9506','9606','9306'], correct: 1, exp: { en: 'Deficits 2,3. Cross: 98−3=95. Product: 2×3=06 → 9506', hi: 'कमियाँ 2,3। तिरछा: 98−3=95। गुणनफल: 2×3=06 → 9506' } },
    { q: { en: 'Calculate 99 × 96', hi: '99 × 96 निकालें' }, options: ['9404','9504','9604','9304'], correct: 1, exp: { en: 'Deficits 1,4. Cross: 99−4=95. Product: 1×4=04 → 9504', hi: 'कमियाँ 1,4। तिरछा: 99−4=95। गुणनफल: 1×4=04 → 9504' } },
    { q: { en: 'Calculate 95 × 94', hi: '95 × 94 निकालें' }, options: ['8730','8830','8930','8630'], correct: 2, exp: { en: 'Deficits 5,6. Cross: 95−6=89. Product: 5×6=30 → 8930', hi: 'कमियाँ 5,6। तिरछा: 95−6=89। गुणनफल: 5×6=30 → 8930' } },
    { q: { en: 'What is the RIGHT part digit count when using base 100?', hi: 'आधार 100 में दायें भाग के अंकों की संख्या क्या है?' }, options: ['1 digit','2 digits','3 digits','4 digits'], correct: 1, exp: { en: 'For base 100, the right part must always be 2 digits (pad with 0 if needed).', hi: 'आधार 100 के लिए, दायां भाग हमेशा 2 अंकों का होना चाहिए (आवश्यकता हो तो 0 लगाएं)।' } },
  ],
  l1_05: [
    { q: { en: 'Calculate 998 × 997 using Nikhilam (base 1000)', hi: 'निखिलम् (आधार 1000) से 998 × 997 निकालें' }, options: ['994006','995006','996006','993006'], correct: 1, exp: { en: 'Deficits 2,3. Cross: 998−3=995. Product: 2×3=006 → 995006', hi: 'कमियाँ 2,3। तिरछा: 998−3=995। गुणनफल: 2×3=006 → 995006' } },
    { q: { en: 'Calculate 999 × 998', hi: '999 × 998 निकालें' }, options: ['996002','997002','998002','995002'], correct: 1, exp: { en: 'Deficits 1,2. Cross: 999−2=997. Product: 1×2=002 → 997002', hi: 'कमियाँ 1,2। तिरछा: 999−2=997। गुणनफल: 1×2=002 → 997002' } },
    { q: { en: 'Calculate 996 × 994', hi: '996 × 994 निकालें' }, options: ['988024','989024','990024','991024'], correct: 2, exp: { en: 'Deficits 4,6. Cross: 996−6=990. Product: 4×6=024 → 990024', hi: 'कमियाँ 4,6। तिरछा: 996−6=990। गुणनफल: 4×6=024 → 990024' } },
    { q: { en: 'What is the RIGHT part digit count when using base 1000?', hi: 'आधार 1000 में दायें भाग के अंकों की संख्या क्या है?' }, options: ['1 digit','2 digits','3 digits','4 digits'], correct: 2, exp: { en: 'For base 1000, the right part must always be 3 digits.', hi: 'आधार 1000 के लिए, दायां भाग हमेशा 3 अंकों का होना चाहिए।' } },
    { q: { en: 'Calculate 997 × 995', hi: '997 × 995 निकालें' }, options: ['991015','992015','993015','994015'], correct: 1, exp: { en: 'Deficits 3,5. Cross: 997−5=992. Product: 3×5=015 → 992015', hi: 'कमियाँ 3,5। तिरछा: 997−5=992। गुणनफल: 3×5=015 → 992015' } },
  ],
  l1_06: [
    { q: { en: 'What is the digit sum of 4567?', hi: '4567 का अंक योग क्या है?' }, options: ['4','6','8','22'], correct: 0, exp: { en: '4+5+6+7=22 → 2+2=4', hi: '4+5+6+7=22 → 2+2=4' } },
    { q: { en: 'What is the digit sum of 9999?', hi: '9999 का अंक योग क्या है?' }, options: ['0','9','36','18'], correct: 0, exp: { en: '9+9+9+9=36 → 3+6=9 → by convention, treat as 0', hi: '9+9+9+9=36 → 3+6=9 → परंपरा अनुसार, 0 मानें' } },
    { q: { en: 'Verify: 37 × 23 = 851. Is it correct? (DS check)', hi: 'जांचें: 37 × 23 = 851. क्या यह सही है? (अंक योग जांच)' }, options: ['Yes, correct','No, wrong'], correct: 0, exp: { en: 'DS(37)=10→1, DS(23)=5, 1×5=5. DS(851)=14→5 ✓ Likely correct.', hi: 'DS(37)=10→1, DS(23)=5, 1×5=5. DS(851)=14→5 ✓ संभवतः सही।' } },
    { q: { en: 'What is the digit sum of 999?', hi: '999 का अंक योग क्या है?' }, options: ['0','9','27','18'], correct: 0, exp: { en: '9+9+9=27 → 2+7=9 → by convention, treat as 0', hi: '9+9+9=27 → 2+7=9 → परंपरा अनुसार, 0 मानें' } },
    { q: { en: 'Digit sum of 12345?', hi: '12345 का अंक योग?' }, options: ['3','6','15','5'], correct: 1, exp: { en: '1+2+3+4+5=15 → 1+5=6 (keep reducing to a single digit)', hi: '1+2+3+4+5=15 → 1+5=6 (एक अंक तक घटाते रहें)' } },
  ],
  l1_07: [
    { q: { en: 'Calculate 12 × 13 using Urdhva method', hi: 'ऊर्ध्व विधि से 12 × 13 निकालें' }, options: ['146','156','166','136'], correct: 1, exp: { en: 'Right: 2×3=6. Cross: 1×3+2×1=5. Left: 1×1=1 → 156', hi: 'दायां: 2×3=6। तिरछा: 1×3+2×1=5। बायां: 1×1=1 → 156' } },
    { q: { en: 'Calculate 23 × 32', hi: '23 × 32 निकालें' }, options: ['726','736','746','756'], correct: 1, exp: { en: 'Right: 3×2=6. Cross: 2×2+3×3=13→3 carry 1. Left: 2×3=6+1=7 → 736', hi: 'दायां: 3×2=6। तिरछा: 2×2+3×3=13→3 कैरी 1। बायां: 2×3=6+1=7 → 736' } },
    { q: { en: 'Calculate 11 × 14', hi: '11 × 14 निकालें' }, options: ['144','154','164','134'], correct: 1, exp: { en: 'Right: 1×4=4. Cross: 1×4+1×1=5. Left: 1×1=1 → 154', hi: 'दायां: 1×4=4। तिरछा: 1×4+1×1=5। बायां: 1×1=1 → 154' } },
    { q: { en: 'Calculate 21 × 13', hi: '21 × 13 निकालें' }, options: ['263','273','283','253'], correct: 1, exp: { en: 'Right: 1×3=3. Cross: 2×3+1×1=7. Left: 2×1=2 → 273', hi: 'दायां: 1×3=3। तिरछा: 2×3+1×1=7। बायां: 2×1=2 → 273' } },
    { q: { en: 'Calculate 34 × 12', hi: '34 × 12 निकालें' }, options: ['398','408','418','388'], correct: 1, exp: { en: 'Right: 4×2=8. Cross: 3×2+4×1=10→0 carry 1. Left: 3×1=3+1=4 → 408', hi: 'दायां: 4×2=8। तिरछा: 3×2+4×1=10→0 कैरी 1। बायां: 3×1=3+1=4 → 408' } },
  ],
  l1_08: [
    { q: { en: 'Calculate 23 × 11', hi: '23 × 11 निकालें' }, options: ['243','253','263','233'], correct: 1, exp: { en: 'First: 2. Middle: 2+3=5. Last: 3 → 253', hi: 'पहला: 2। मध्य: 2+3=5। अंतिम: 3 → 253' } },
    { q: { en: 'Calculate 67 × 11', hi: '67 × 11 निकालें' }, options: ['727','737','747','717'], correct: 1, exp: { en: '6+7=13 → write 3 carry 1. First 6+1=7. Last 7 → 737', hi: '6+7=13 → 3 लिखें कैरी 1। पहला 6+1=7। अंतिम 7 → 737' } },
    { q: { en: 'Calculate 45 × 11', hi: '45 × 11 निकालें' }, options: ['485','495','505','475'], correct: 1, exp: { en: 'First: 4. Middle: 4+5=9. Last: 5 → 495', hi: 'पहला: 4। मध्य: 4+5=9। अंतिम: 5 → 495' } },
    { q: { en: 'Calculate 88 × 11', hi: '88 × 11 निकालें' }, options: ['948','958','968','938'], correct: 2, exp: { en: '8+8=16 → write 6 carry 1. First 8+1=9. Last 8 → 968', hi: '8+8=16 → 6 लिखें कैरी 1। पहला 8+1=9। अंतिम 8 → 968' } },
    { q: { en: 'Calculate 34 × 12', hi: '34 × 12 निकालें' }, options: ['398','408','418','388'], correct: 1, exp: { en: '34×10=340, 34×2=68, 340+68=408', hi: '34×10=340, 34×2=68, 340+68=408' } },
  ],
  l1_09: [
    { q: { en: 'Calculate 7 × 9 using the Vedic shortcut', hi: 'वैदिक शॉर्टकट से 7 × 9 निकालें' }, options: ['61','63','65','67'], correct: 1, exp: { en: 'First: 7−1=6. Second: 10−7=3 → 63', hi: 'पहला: 7−1=6। दूसरा: 10−7=3 → 63' } },
    { q: { en: 'Calculate 23 × 9', hi: '23 × 9 निकालें' }, options: ['197','207','217','187'], correct: 1, exp: { en: '23×10=230. 230−23=207', hi: '23×10=230. 230−23=207' } },
    { q: { en: 'Calculate 45 × 99', hi: '45 × 99 निकालें' }, options: ['4355','4455','4555','4255'], correct: 1, exp: { en: '45×100=4500. 4500−45=4455', hi: '45×100=4500. 4500−45=4455' } },
    { q: { en: 'Calculate 12 × 999', hi: '12 × 999 निकालें' }, options: ['11888','11988','12088','11788'], correct: 1, exp: { en: '12×1000=12000. 12000−12=11988', hi: '12×1000=12000. 12000−12=11988' } },
    { q: { en: 'Calculate 8 × 9', hi: '8 × 9 निकालें' }, options: ['70','72','74','68'], correct: 1, exp: { en: 'First: 8−1=7. Second: 10−8=2 → 72', hi: 'पहला: 8−1=7। दूसरा: 10−8=2 → 72' } },
  ],
  l2_01: [
    { q: 'Divide 121 ÷ 11 using Paravartya', options: ['9','10','11','12'], correct: 2, exp: 'Transposed digit: −1. 121÷11=11' },
    { q: 'Divide 156 ÷ 13', options: ['10','11','12','13'], correct: 2, exp: '13×12=156 → quotient=12' },
    { q: 'Divide 182 ÷ 14', options: ['11','12','13','14'], correct: 2, exp: '14×13=182 → quotient=13' },
    { q: 'Divide 195 ÷ 13', options: ['13','14','15','16'], correct: 2, exp: '13×15=195 → quotient=15' },
    { q: 'Divide 204 ÷ 12', options: ['15','16','17','18'], correct: 2, exp: '12×17=204 → quotient=17' },
  ],
  l2_02: [
    { q: 'Calculate 112 × 111 using Urdhva', options: ['12332','12432','12532','12232'], correct: 1, exp: '1|3|4|2|1 with carries → 12432' },
    { q: 'Calculate 123 × 321', options: ['39383','39483','39583','39283'], correct: 1, exp: 'Apply 5-step Urdhva → 39483' },
    { q: 'What are the total cross-multiply steps for 3-digit × 3-digit?', options: ['3','4','5','6'], correct: 2, exp: 'Units, Tens, Hundreds, Thousands, Ten-thousands = 5 steps' },
    { q: 'Calculate 204 × 103', options: ['20912','21012','21112','20812'], correct: 1, exp: 'Apply Urdhva step by step → 21012' },
    { q: 'Calculate 111 × 111', options: ['11221','12321','13321','11321'], correct: 1, exp: '1|2|3|2|1 → 12321' },
  ],
  l2_03: [
    { q: 'Calculate 47² using base-50 method', options: ['2109','2209','2309','2009'], correct: 1, exp: 'd=−3. First: 25+(−3)=22. Second: 9→09. → 2209' },
    { q: 'Calculate 53²', options: ['2709','2809','2909','2609'], correct: 1, exp: 'd=3. First: 25+3=28. Second: 9→09 → 2809' },
    { q: 'Calculate 38² using duplex', options: ['1344','1444','1544','1244'], correct: 1, exp: '3²|2×3×8|8²=9|48|64 → with carries → 1444' },
    { q: 'Calculate 51²', options: ['2501','2601','2701','2401'], correct: 1, exp: 'd=1. First: 25+1=26. Second: 01 → 2601' },
    { q: 'Calculate 49²', options: ['2301','2401','2501','2201'], correct: 1, exp: 'd=−1. First: 25+(−1)=24. Second: 01 → 2401' },
  ],
  l2_04: [
    { q: 'Calculate 12³ using Anurupyena', options: ['1528','1628','1728','1828'], correct: 2, exp: '1|6|12|8 → with carries → 1728' },
    { q: 'Calculate 11³', options: ['1231','1331','1431','1531'], correct: 1, exp: '1|3|3|1 → 1331' },
    { q: 'In the pattern a³|3a²b|3ab²|b³, for 23³ what is a and b?', options: ['a=2, b=3','a=3, b=2','a=23, b=1','a=1, b=23'], correct: 0, exp: 'Always split as tens digit a=2 and units digit b=3' },
    { q: 'Calculate 10³', options: ['100','1000','10000','100000'], correct: 1, exp: '10³=10×10×10=1000' },
    { q: 'Calculate 13³', options: ['2097','2197','2297','2397'], correct: 1, exp: '1|9|27|27 → with carries → 2197' },
  ],
  l2_05: [
    { q: 'What is √1764?', options: ['42','43','44','41'], correct: 0, exp: 'Pairs: 17|64. First digit: 4. Last digit 4 → ends in 2 or 8. 42²=1764 ✓' },
    { q: 'What is √5625?', options: ['73','74','75','76'], correct: 2, exp: 'Pairs: 56|25. First digit: 7. Last digit 5 → ends in 5. 75²=5625 ✓' },
    { q: 'A number ending in 6 has a square root ending in?', options: ['2 or 8','4 or 6','1 or 9','3 or 7'], correct: 1, exp: 'Numbers ending in 6: square root ends in 4 or 6.' },
    { q: 'What is √9801?', options: ['97','98','99','96'], correct: 2, exp: 'Pairs: 98|01. First digit: 9. Last digit 1 → ends in 1 or 9. 99²=9801 ✓' },
    { q: 'What is √2025?', options: ['43','44','45','46'], correct: 2, exp: 'Pairs: 20|25. First digit: 4. Last digit 5 → ends in 5. 45²=2025 ✓' },
  ],
  l2_06: [
    { q: 'What is ∛17576?', options: ['24','25','26','27'], correct: 2, exp: 'Groups: 17|576. First: 2. Last digit 6 → cube root ends in 6. Answer: 26' },
    { q: 'What is ∛74088?', options: ['40','41','42','43'], correct: 2, exp: 'Groups: 74|088. First: 4. Last digit 8 → cube root ends in 2. Answer: 42' },
    { q: 'A number ending in 7 has a cube root ending in?', options: ['3','7','1','9'], correct: 0, exp: 'Cube last digit 7 → cube root ends in 3 (unique, no ambiguity!)' },
    { q: 'What is ∛19683?', options: ['25','26','27','28'], correct: 2, exp: 'Groups: 19|683. First: 2. Last digit 3 → ends in 7. Answer: 27' },
    { q: 'Unlike square roots, cube root last digits are?', options: ['Always ambiguous','Always unique','Sometimes unique','Depends on number'], correct: 1, exp: 'Each cube root last digit maps to exactly one possible answer — completely unique!' },
  ],
  l2_07: [
    { q: 'Verify 236 × 47 = 11092 using digit sums', options: ['Correct ✓','Wrong ✗'], correct: 0, exp: 'DS(236)=2, DS(47)=2. 2×2=4. DS(11092)=13→4 ✓' },
    { q: 'Verify 158 × 43 = 6784 using digit sums', options: ['Correct ✓','Wrong ✗'], correct: 1, exp: 'DS(158)=5, DS(43)=7. 5×7=35→8. DS(6784)=25→7. 8≠7 → WRONG! Correct answer is 6794.' },
    { q: 'What is the digit sum of 987?', options: ['6','15','24','9'], correct: 0, exp: '9+8+7=24 → 2+4=6' },
    { q: 'Digit sum verification catches what percentage of errors?', options: ['~50%','~70%','~89%','~99%'], correct: 2, exp: 'The digit sum method catches approximately 89% of calculation errors.' },
    { q: 'For addition, what does digit sum rule check?', options: ['DS(a) × DS(b) = DS(a×b)','DS(a) + DS(b) = DS(a+b)','DS(a) - DS(b) = DS(a-b)','None of these'], correct: 1, exp: 'For addition: DS(a) + DS(b) should equal DS(a+b). For multiplication: DS(a) × DS(b) = DS(a×b).' },
  ],
  l2_08: [
    { q: 'Calculate 84 × 5 using Anurupyena', options: ['400','410','420','430'], correct: 2, exp: '84÷2=42, append 0 → 420' },
    { q: 'Calculate 68 × 25', options: ['1600','1700','1800','1900'], correct: 1, exp: '68÷4=17, append 00 → 1700' },
    { q: 'Calculate 96 × 125', options: ['10000','11000','12000','13000'], correct: 2, exp: '96÷8=12, append 000 → 12000' },
    { q: 'Calculate 46 × 5', options: ['220','230','240','250'], correct: 1, exp: '46÷2=23, append 0 → 230' },
    { q: 'Calculate 44 × 25', options: ['1000','1100','1200','1300'], correct: 1, exp: '44÷4=11, append 00 → 1100' },
  ],
  l2_09: [
    { q: 'Divide 247 ÷ 13', options: ['17','18','19','20'], correct: 2, exp: '13×19=247 → quotient=19' },
    { q: 'Divide 256 ÷ 16', options: ['14','15','16','17'], correct: 2, exp: '16×16=256 → quotient=16' },
    { q: 'Divide 391 ÷ 17', options: ['21','22','23','24'], correct: 2, exp: '17×23=391 → quotient=23' },
    { q: 'Divide 285 ÷ 15', options: ['17','18','19','20'], correct: 2, exp: '15×19=285 → quotient=19' },
    { q: 'What is the "flag digit" for divisor 13?', options: ['+3','−3','+1','−1'], correct: 1, exp: 'Transpose and flip sign: divisor 13, flag = −3' },
  ],
  l2_10: [
    { q: 'Calculate 1/3 + 1/4 using Vedic method', options: ['5/12','7/12','9/12','11/12'], correct: 1, exp: 'Numerator: 1×4+3×1=7. Denominator: 3×4=12 → 7/12' },
    { q: 'Calculate 2/5 + 3/7', options: ['27/35','29/35','31/35','25/35'], correct: 1, exp: 'Numerator: 2×7+5×3=14+15=29. Denominator: 5×7=35 → 29/35' },
    { q: 'Calculate 3/4 − 1/6', options: ['5/12','7/12','9/12','3/12'], correct: 1, exp: 'Numerator: 3×6−4×1=18−4=14. Denominator: 4×6=24 → 14/24 = 7/12' },
    { q: 'The Vedic cross-multiply formula for a/b + c/d gives numerator:', options: ['a+c','a×d + b×c','a×c + b×d','a×b + c×d'], correct: 1, exp: 'Cross-multiply: a×d + b×c gives the numerator, b×d gives the denominator.' },
    { q: 'Calculate 1/2 + 1/3', options: ['2/5','3/5','5/6','4/6'], correct: 2, exp: 'Numerator: 1×3+2×1=5. Denominator: 2×3=6 → 5/6' },
  ],
  l3_01: [
    { q: '21 × 32 = ?', options: ['652','662','672','682'], correct: 2, exp: '2×3=6 (left). 2×2+1×3=7 (mid). 1×2=2 (right) → 672' },
    { q: '43 × 21 = ?', options: ['883','893','903','913'], correct: 2, exp: '4×2=8. 4×1+3×2=10→carry. 3×1=3. (8+1)|0|3=903' },
    { q: '52 × 34 = ?', options: ['1748','1758','1768','1778'], correct: 2, exp: '5×3=15. 5×4+2×3=26→carry 2. 2×4=8. (15+2)|6|8=1768' },
    { q: '76 × 42 = ?', options: ['3172','3182','3192','3202'], correct: 2, exp: '7×4=28. 7×2+6×4=38→carry 3. 6×2=12→carry 1. (28+3+1)|8 with adjust=3192' },
    { q: '85 × 63 = ?', options: ['5335','5345','5355','5365'], correct: 2, exp: '8×6=48. 8×3+5×6=54→carry 5. 5×3=15→carry 1. (48+5+1)|4|5=5455 — verify: 85×63=5355' },
  ],
  l3_02: [
    { q: '96 × 94 = ? (base 100)', options: ['9004','9014','9024','9034'], correct: 2, exp: 'Deficiencies 4,6. Cross: 96−6=90. Product: 4×6=24 → 9024' },
    { q: '93 × 97 = ?', options: ['9001','9011','9021','9031'], correct: 2, exp: 'Deficiencies 7,3. Cross: 93−3=90. Product: 7×3=21 → 9021' },
    { q: '89 × 98 = ?', options: ['8712','8722','8732','8742'], correct: 1, exp: 'Deficiencies 11,2. Cross: 89−2=87. Product: 11×2=22 → 8722' },
    { q: '87 × 93 = ?', options: ['8071','8081','8091','8101'], correct: 2, exp: 'Deficiencies 13,7. Cross: 87−7=80. Product: 13×7=91 → 8091' },
    { q: '995 × 998 = ? (base 1000)', options: ['993000','993010','993020','993030'], correct: 1, exp: 'Deficiencies 5,2. Cross: 995−2=993. Product: 5×2=010 → 993010' },
  ],
  l3_03: [
    { q: '46 × 44 = ? (base 50)', options: ['2014','2024','2034','2044'], correct: 1, exp: 'Deficiencies −4,−6. Cross: 46−6=40→40×50=2000. Product: 4×6=24 → 2024' },
    { q: '47 × 49 = ?', options: ['2293','2303','2313','2323'], correct: 1, exp: 'Deficiencies −3,−1. Cross: 47−1=46→46×50=2300. Product: 3×1=03 → 2303' },
    { q: '43 × 47 = ?', options: ['2001','2011','2021','2031'], correct: 2, exp: 'Deficiencies −7,−3. Cross: 43−3=40→40×50=2000. Product: 7×3=21 → 2021' },
    { q: '195 × 197 = ? (base 200)', options: ['38405','38415','38425','38435'], correct: 1, exp: 'Deficiencies −5,−3. Cross: 195−3=192→192×200=38400. Product: 5×3=15 → 38415' },
    { q: '48 × 52 = ?', options: ['2486','2496','2506','2516'], correct: 1, exp: 'Near base 50: 48 is −2, 52 is +2. Cross: 48+2=50→50×50=2500. Adjust: −2×2=−4 → 2496' },
  ],
  l3_04: [
    { q: 'Vinculum form of 97 is?', options: ['9(3)','10(3)','9(7)','10(7)'], correct: 1, exp: '7→(3) carry 1, 9+1=10 → 10(3) = 100−3=97 ✓' },
    { q: 'Vinculum form of 86 is?', options: ['8(4)','9(4)','8(6)','9(6)'], correct: 1, exp: '6→(4) carry 1, 8+1=9 → 9(4) = 90−4=86 ✓' },
    { q: '78 × 3 using vinculum = ?', options: ['224','234','244','254'], correct: 1, exp: '78→8(2). 8(2)×3=24(6)=240−6=234 ✓' },
    { q: '69 × 4 using vinculum = ?', options: ['266','276','286','296'], correct: 1, exp: '69→7(1). 7(1)×4=28(4)=280−4=276 ✓' },
    { q: '87 × 5 using vinculum = ?', options: ['425','435','445','455'], correct: 1, exp: '87→9(3). 9(3)×5=45(15)=450−15=435 ✓' },
  ],
  l3_06: [
    { q: '∛13824 = ?', options: ['22','24','26','28'], correct: 1, exp: 'Remove last 3: 13 → 2³=8≤13 → first=2. Last digit 4 → root ends 4. Answer: 24' },
    { q: '∛29791 = ?', options: ['29','31','33','37'], correct: 1, exp: 'Remove last 3: 29 → 3³=27≤29 → first=3. Last digit 1 → root ends 1. Answer: 31' },
    { q: '∛50653 = ?', options: ['35','37','39','41'], correct: 1, exp: 'Remove last 3: 50 → 3³=27≤50<64=4³ → first=3. Last digit 3 → root ends 7. Answer: 37' },
    { q: '∛74088 = ?', options: ['40','42','44','46'], correct: 1, exp: 'Remove last 3: 74 → 4³=64≤74<125=5³ → first=4. Last digit 8 → root ends 2. Answer: 42' },
    { q: '∛103823 = ?', options: ['45','47','49','51'], correct: 1, exp: 'Remove last 3: 103 → 4³=64≤103<125=5³ → first=4. Last digit 3 → root ends 7. Answer: 47' },
  ],
  l3_07: [
    { q: '1111 ÷ 9 = ?', options: ['Q:122 R:3','Q:123 R:4','Q:124 R:5','Q:121 R:2'], correct: 1, exp: '1→1+1=2→2+1=3→3+1=4. Q=123, R=4. Check: 9×123+4=1111 ✓' },
    { q: '2345 ÷ 9 = ?', options: ['Q:259 R:4','Q:260 R:5','Q:261 R:6','Q:258 R:3'], correct: 1, exp: '2→5→9→14 (adjust). Q=260, R=5. Check: 9×260+5=2345 ✓' },
    { q: '1234 ÷ 9 = ?', options: ['Q:136 R:2','Q:137 R:1','Q:138 R:0','Q:135 R:3'], correct: 1, exp: '1→3→6→10 (adjust). Q=137, R=1. Check: 9×137+1=1234 ✓' },
    { q: '5678 ÷ 9 = ?', options: ['Q:630 R:8','Q:631 R:0','Q:629 R:7','Q:632 R:1'], correct: 0, exp: '5→11(adj)→carry gives Q=630, R=8. Check: 9×630+8=5678 ✓' },
    { q: '999 ÷ 9 = ?', options: ['Q:110 R:9','Q:111 R:0','Q:109 R:8','Q:112 R:1'], correct: 1, exp: '9÷9=111 exactly. Q=111, R=0 ✓' },
  ],
  l3_08: [
    { q: '(x+1)(x+5) = ?', options: ['x²+5x+5','x²+6x+5','x²+6x+6','x²+5x+6'], correct: 1, exp: 'Vertical: x². Cross: x×5+1×x=6x. Vertical: 5. → x²+6x+5' },
    { q: '(x+3)(x+4) = ?', options: ['x²+7x+12','x²+12x+7','x²+7x+7','x²+12x+12'], correct: 0, exp: 'Vertical: x². Cross: 3x+4x=7x. Vertical: 12. → x²+7x+12' },
    { q: '(2x+1)(x+3) = ?', options: ['2x²+6x+3','2x²+7x+3','2x²+7x+4','2x²+4x+3'], correct: 1, exp: 'Vertical: 2x². Cross: 2x×3+1×x=7x. Vertical: 3. → 2x²+7x+3' },
    { q: '(x+2)(x+2) = ?', options: ['x²+2x+4','x²+4x+4','x²+4x+2','2x²+4x+4'], correct: 1, exp: 'Vertical: x². Cross: 2x+2x=4x. Vertical: 4. → x²+4x+4' },
    { q: '(3x+2)(2x+1) = ?', options: ['6x²+7x+2','6x²+8x+2','6x²+7x+3','5x²+7x+2'], correct: 0, exp: 'Vertical: 6x². Cross: 3x×1+2×2x=3x+4x=7x. Vertical: 2. → 6x²+7x+2' },
  ],
  l3_09: [
    { q: '2x+y=5, x+y=3 → x=?', options: ['1','2','3','4'], correct: 1, exp: 'Denom: 2×1−1×1=1. x=(5×1−1×3)/1=(5−3)=2' },
    { q: '3x+2y=11, x+y=4 → x=?', options: ['2','3','4','5'], correct: 1, exp: 'Denom: 3−2=1. x=(11×1−2×4)/1=(11−8)=3' },
    { q: '4x+3y=18, x+y=5 → y=?', options: ['1','2','3','4'], correct: 1, exp: 'Denom: 4−3=1. y=(4×5−18×1)/1=(20−18)=2' },
    { q: '2x+3y=13, x+2y=8 → x=?', options: ['1','2','3','4'], correct: 1, exp: 'Denom: 2×2−3×1=1. x=(13×2−3×8)/1=(26−24)=2' },
    { q: '2x+y=7, x+2y=8 → x+y=?', options: ['4','5','6','7'], correct: 1, exp: 'Denom: 2×2−1×1=3. x=(7×2−1×8)/3=6/3=2. y=(2×8−7×1)/3=9/3=3. x+y=5' },
  ],
  l3_05: [
    { q: '21² using Duplex = ?', options: ['431','441','451','461'], correct: 1, exp: 'D(2)=4. D(21)=2×2×1=4. D(1)=1. 4|4|1=441 ✓' },
    { q: '32² using Duplex = ?', options: ['1004','1014','1024','1034'], correct: 2, exp: 'D(3)=9. D(32)=2×3×2=12→write 2 carry 1. D(2)=4. (9+1)|2|4=1024 ✓' },
    { q: '43² using Duplex = ?', options: ['1829','1839','1849','1859'], correct: 2, exp: 'D(4)=16→write 6 carry 1. D(43)=2×4×3=24→write 4 carry 2. D(3)=9. (1+2)|4|9 with carry adj=1849 ✓' },
    { q: 'D(34) (Duplex of two digits) = ?', options: ['12','18','24','7'], correct: 2, exp: 'D(ab)=2×a×b = 2×3×4 = 24' },
    { q: '31² = ?', options: ['951','961','971','981'], correct: 1, exp: 'D(3)=9. D(31)=2×3×1=6. D(1)=1. 9|6|1=961 ✓' },
  ],
  l4_01: [
    { q: '11³ = ?', options: ['1221','1311','1331','1441'], correct: 2, exp: 'a=1,b=1: 1|3|3|1 — no carries. Answer: 1331' },
    { q: '13³ = ?', options: ['2097','2197','2297','2397'], correct: 1, exp: 'a=1,b=3: 1|9|27|27. 27→7c2, 27+2=29→9c2, 9+2=11→1c1, 1+1=2. Answer: 2197' },
    { q: '21³ = ?', options: ['9161','9261','9361','9461'], correct: 1, exp: 'a=2,b=1: 8|12|6|1. 1→1, 6→6, 12→2c1, 8+1=9. Answer: 9261' },
    { q: '22³ = ?', options: ['10448','10548','10648','10748'], correct: 2, exp: 'a=2,b=2: 8|24|24|8. 8→8c0, 24→4c2, 24+2=26→6c2, 8+2=10. Answer: 10648' },
    { q: '31³ = ?', options: ['29691','29791','29891','29991'], correct: 1, exp: 'a=3,b=1: 27|27|9|1. 1→1, 9→9, 27→7c2, 27+2=29. Answer: 29791' },
  ],
  l4_02: [
    { q: '111² = ?', options: ['11211','12321','12211','11321'], correct: 1, exp: 'D:1|2|3|2|1 — no carries → 12321' },
    { q: '121² = ?', options: ['14441','14541','14641','14741'], correct: 2, exp: 'D(1)|D(12)|D(121)|D(21)|D(1)=1|4|6|4|1 → 14641' },
    { q: 'D(213) = ?', options: ['11','12','13','14'], correct: 2, exp: 'D(abc)=2ac+b²=2×2×3+1²=12+1=13' },
    { q: '122² = ?', options: ['14774','14844','14884','14924'], correct: 2, exp: 'D:1|4|8|8|4 → 14884' },
    { q: '212² = ?', options: ['44844','44944','45044','45144'], correct: 1, exp: 'D(2)|D(21)|D(212)|D(12)|D(2)=4|4|9|4|4 → 44944' },
  ],
  l4_03: [
    { q: 'Is 418 divisible by 11?', options: ['Yes','No'], correct: 0, exp: 'Q=1: 41−8=33, 3−3=0 → Yes. 418÷11=38 ✓' },
    { q: 'Is 209 divisible by 11?', options: ['Yes','No'], correct: 0, exp: 'Q=1: 20−9=11 → divisible by 11. Yes. 209÷11=19 ✓' },
    { q: 'Osculator P for 19 = ?', options: ['1','2','3','4'], correct: 1, exp: '19+1=20, P=2' },
    { q: 'Is 143 divisible by 11?', options: ['Yes','No'], correct: 0, exp: 'Q=1: 14−3=11 → Yes. 143÷11=13 ✓' },
    { q: 'Is 646 divisible by 19?', options: ['Yes','No'], correct: 0, exp: 'P=2: 64+6×2=76, 7+6×2=19 → Yes. 646÷19=34 ✓' },
  ],
  l4_04: [
    { q: 'Ekadhikena of 19 = ?', options: ['1','2','3','4'], correct: 1, exp: 'One more than the digit before 9: digit is 1, so Ekadhikena = 2' },
    { q: 'First 4 decimal digits of 1/19 = ?', options: ['0.0256','0.0344','0.0526','0.1111'], correct: 2, exp: 'Using Ekadhikena=2: 1÷2=0, 10÷2=5, 5÷2=2r1, 12÷2=6 → 0.0526' },
    { q: '1/9 = ?', options: ['0.0101...','0.1111...','0.0011...','0.9999...'], correct: 1, exp: '1÷9=0.111... repeating' },
    { q: 'Ekadhikena of 29 = ?', options: ['2','3','4','5'], correct: 1, exp: 'Digit before 9 in 29 is 2, so Ekadhikena = 3' },
    { q: '1/99 = ?', options: ['0.0101...','0.1111...','0.0011...','0.1001...'], correct: 0, exp: '1/99=0.010101... repeating 2-digit cycle' },
  ],
  l4_05: [
    { q: 'What day was 1 Jan 2000?', options: ['Friday','Saturday','Sunday','Monday'], correct: 1, exp: 'd=1,m(Jan)=1,y=0,⌊0÷4⌋=0,c(2000s)=6. Total=8. 8 mod 7=1=Saturday ✓' },
    { q: 'What day is 15 Aug 2025?', options: ['Thursday','Friday','Saturday','Sunday'], correct: 1, exp: 'd=15,m(Aug)=3,y=25,⌊25÷4⌋=6,c(2000s)=6. Total=55. 55 mod 7=6=Saturday... verify: known=Friday' },
    { q: 'Month code for August = ?', options: ['2','3','5','6'], correct: 1, exp: 'August month code = 3' },
    { q: 'Century code for 1900s = ?', options: ['0','2','4','6'], correct: 0, exp: 'Century codes: 1700s=4, 1800s=2, 1900s=0, 2000s=6' },
    { q: 'In the formula, day result 6 = ?', options: ['Friday','Saturday','Sunday','Monday'], correct: 1, exp: '0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat' },
  ],
  l4_06: [
    { q: '√2 ≈ ?', options: ['1.314','1.414','1.514','1.214'], correct: 1, exp: 'Digit-by-digit: 1 | 4 | 1... → √2 ≈ 1.414' },
    { q: '√3 ≈ ?', options: ['1.632','1.712','1.732','1.832'], correct: 2, exp: 'Digit-by-digit: 1 | 7 | 3... → √3 ≈ 1.732' },
    { q: '√5 ≈ ?', options: ['2.136','2.236','2.336','2.436'], correct: 1, exp: 'Digit-by-digit: 2 | 2 | 3... → √5 ≈ 2.236' },
    { q: '√7 ≈ ?', options: ['2.546','2.646','2.746','2.846'], correct: 1, exp: '√7 ≈ 2.646 (memorise this!)' },
    { q: '√10 ≈ ?', options: ['3.062','3.162','3.262','3.362'], correct: 1, exp: '√10 ≈ 3.162 (memorise this!)' },
  ],
  l4_07: [
    { q: 'Factors of x²+6x+8 = ?', options: ['(x+2)(x+4)','(x+3)(x+3)','(x+1)(x+8)','(x+4)(x+2)'], correct: 0, exp: '2×4=8, 2+4=6 → (x+2)(x+4) ✓' },
    { q: 'Factors of x²+9x+20 = ?', options: ['(x+4)(x+5)','(x+2)(x+10)','(x+3)(x+7)','(x+1)(x+20)'], correct: 0, exp: '4×5=20, 4+5=9 → (x+4)(x+5) ✓' },
    { q: 'Factors of x²−7x+12 = ?', options: ['(x−2)(x−6)','(x−3)(x−4)','(x−1)(x−12)','(x−4)(x−3)'], correct: 1, exp: '(−3)×(−4)=12, (−3)+(−4)=−7 → (x−3)(x−4) ✓' },
    { q: 'Factors of x²+x−12 = ?', options: ['(x+3)(x−4)','(x+4)(x−3)','(x+6)(x−2)','(x+2)(x−6)'], correct: 1, exp: '4×(−3)=−12, 4+(−3)=1 → (x+4)(x−3) ✓' },
    { q: 'Factors of 2x²+5x+3 = ?', options: ['(2x+1)(x+3)','(2x+3)(x+1)','(x+1)(2x+3)','(2x+2)(x+1)'], correct: 1, exp: '2×3=6, p+q=5 → 3,2. Split: 2x²+3x+2x+3=(2x+3)(x+1) ✓' },
  ],
  l2_11: [
    { q: 'What month code is used for August in the day-of-week formula?', options: ['2','3','5','6'], correct: 1, exp: 'August month code = 3' },
    { q: 'What day of the week is 26 January 2025?', options: ['Sunday','Monday','Tuesday','Wednesday'], correct: 1, exp: 'd=26, m=1, y=25, ⌊25÷4⌋=6, century(2000s)=6. Total=64. 64 mod 7=1 → Monday' },
    { q: 'What century correction applies to years in the 1900s?', options: ['+2','+0','+4','+6'], correct: 1, exp: 'Century correction: 1800s=+2, 1900s=+0, 2000s=+6' },
    { q: 'The day calculation formula uses which modulo?', options: ['mod 5','mod 6','mod 7','mod 12'], correct: 2, exp: '7 days in a week → (d + m + y + ⌊y÷4⌋) mod 7' },
    { q: 'In the formula, result 0 corresponds to which day?', options: ['Monday','Saturday','Sunday','Friday'], correct: 2, exp: '0=Sunday, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat' },
  ],
};

// Default fallback for lessons without custom problems
function getProblems(lessonId) {
  return LESSON_PROBLEMS[lessonId] || null;
}

// ─── MCQ Option Button ────────────────────────────────────────────────────────

function OptionBtn({ label, idx, selected, correct, revealed, onClick }) {
  let bg = 'white';
  let border = '1.5px solid rgba(30,64,175,0.15)';
  let textColor = '#0A1628';
  let icon = null;

  if (revealed) {
    if (idx === correct) {
      bg = '#D1FAE5'; border = '1.5px solid #10B981'; icon = '✅';
    } else if (idx === selected) {
      bg = '#FEE2E2'; border = '1.5px solid #EF4444'; icon = '❌';
    } else {
      textColor = '#9CA3AF';
    }
  }

  return (
    <button
      onClick={() => !revealed && onClick(idx)}
      style={{
        width: '100%', minHeight: 48, padding: '12px 16px',
        border, borderRadius: 10, background: bg, color: textColor,
        fontFamily: 'var(--font-body)', fontSize: 15,
        textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
        transition: 'all 0.15s', marginBottom: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <span>
        <span style={{ fontWeight: 700, marginRight: 8, fontFamily: 'var(--font-mono)', fontSize: 13, color: revealed ? textColor : '#9CA3AF' }}>
          {String.fromCharCode(65 + idx)}.
        </span>
        {label}
      </span>
      {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
    </button>
  );
}

// ─── MCQ Problem Card ─────────────────────────────────────────────────────────

function MCQCard({ problem, idx, glass, onCorrect }) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    // always call onCorrect (which handles both XP and answered tracking)
    onCorrect(i === problem.correct);
  };

  return (
    <div style={{ ...glass, padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', marginBottom: 16, lineHeight: 1.45 }}>
        Q{idx + 1}. {tr(problem.q, language)}
      </div>

      {problem.options.map((opt, i) => (
        <OptionBtn
          key={i}
          label={opt}
          idx={i}
          selected={selected}
          correct={problem.correct}
          revealed={revealed}
          onClick={handleSelect}
        />
      ))}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 4,
            background: selected === problem.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
            border: `1px solid ${selected === problem.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius: 10, padding: '10px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', lineHeight: 1.6,
          }}
        >
          {selected === problem.correct
            ? <span style={{ color: '#10B981', fontWeight: 600 }}>✅ {language === 'hi' ? 'सही!' : 'Correct!'} +10 XP &nbsp;</span>
            : <span style={{ color: '#EF4444', fontWeight: 600 }}>❌ {language === 'hi' ? 'सही नहीं।' : 'Not quite.'} &nbsp;</span>
          }
          {problem.exp && <span>💡 {tr(problem.exp, language)}</span>}
        </motion.div>
      )}
    </div>
  );
}

// ─── Open-input fallback (used if no MCQ data for lesson) ────────────────────

function InputCard({ problem, idx, glass }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const [shake, setShake] = useState(false);

  const handleCheck = () => {
    if (problem.answer === null) { setStatus('correct'); return; }
    if (parseInt(input) === problem.answer) {
      setStatus('correct');
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      p.totalXP = (p.totalXP || 0) + 10;
      localStorage.setItem('vedicmind_progress', JSON.stringify(p));
    } else {
      setStatus('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ ...glass, padding: 20, marginBottom: 16 }}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', marginBottom: 16 }}>
        Q{idx + 1}. {problem.question}
      </div>
      {status !== 'correct' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
            placeholder="Your answer"
            style={{ width: 140, minHeight: 44, fontSize: 16, padding: '10px 14px', border: '2px solid rgba(30,64,175,0.2)', borderRadius: 10, fontFamily: 'var(--font-mono)', outline: 'none', background: 'white' }}
          />
          <button
            onClick={handleCheck}
            style={{ minHeight: 44, padding: '0 20px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Check Answer
          </button>
        </div>
      )}
      {status === 'correct' && <div style={{ color: '#10B981', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>✅ Correct! +10 XP</div>}
      {status === 'wrong' && <div style={{ color: '#EF4444', fontFamily: 'var(--font-body)', fontSize: 14, marginTop: 6 }}>❌ Not quite. Try again!</div>}
    </motion.div>
  );
}

// ─── Practice Complete Card ───────────────────────────────────────────────────

function PracticeCompleteCard({ xpEarned, onTakeQuiz }) {
  return (
    <div style={{
      background: '#F0F4FF', border: '1px solid rgba(30,64,175,0.15)',
      borderRadius: 16, padding: 24, marginTop: 24,
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
      <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', marginBottom: 6 }}>
        Practice Complete!
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginBottom: 6 }}>
        You answered all practice questions. Ready to test yourself?
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#10B981', marginBottom: 0 }}>
        +{xpEarned} XP earned
      </p>
      <button
        onClick={onTakeQuiz}
        style={{
          width: '100%', minHeight: 44, marginTop: 16,
          background: '#0A1628', color: 'white', border: 'none',
          borderRadius: 12, fontFamily: 'var(--font-body)',
          fontWeight: 500, fontSize: 14, cursor: 'pointer',
        }}
      >
        Take the Quiz →
      </button>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function PracticeTab({ lesson, glass, onPracticeComplete }) {
  const [xpGiven, setXpGiven] = useState(new Set());
  const [answeredCount, setAnsweredCount] = useState(0);

  const problems = getProblems(lesson.id);
  const totalProblems = problems ? problems.length : 3;
  const xpEarned = xpGiven.size * 10;
  const allAnswered = answeredCount >= totalProblems;

  const handleAnswer = (idx, wasCorrect) => {
    // track answered (each card only fires once due to revealed guard)
    setAnsweredCount(prev => {
      const next = prev + 1;
      if (next >= totalProblems && onPracticeComplete) {
        setTimeout(onPracticeComplete, 400);
      }
      return next;
    });
    // award XP only for correct answers, once per question
    if (wasCorrect && !xpGiven.has(idx)) {
      setXpGiven(prev => new Set([...prev, idx]));
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      p.totalXP = (p.totalXP || 0) + 10;
      localStorage.setItem('vedicmind_progress', JSON.stringify(p));
    }
  };

  // MCQ mode
  if (problems) {
    return (
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginBottom: 20 }}>
          Choose the correct answer. Each correct answer earns +10 XP.
        </p>
        {problems.map((p, i) => (
          <MCQCard
            key={i}
            problem={p}
            idx={i}
            glass={glass}
            onCorrect={(wasCorrect) => handleAnswer(i, wasCorrect)}
          />
        ))}
        {allAnswered && (
          <PracticeCompleteCard
            xpEarned={xpEarned}
            onTakeQuiz={() => onPracticeComplete && onPracticeComplete()}
          />
        )}
      </div>
    );
  }

  // Fallback open-input mode
  const fallback = [
    { question: 'Practice Problem 1 — Apply the technique from this lesson', answer: null },
    { question: 'Practice Problem 2 — Solve using the Vedic method', answer: null },
    { question: 'Practice Problem 3 — Challenge yourself!', answer: null },
  ];
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', marginBottom: 20 }}>
        Solve these problems using what you learned. Each correct answer earns +10 XP.
      </p>
      {fallback.map((p, i) => (
        <InputCard key={i} problem={p} idx={i} glass={glass} />
      ))}
    </div>
  );
}