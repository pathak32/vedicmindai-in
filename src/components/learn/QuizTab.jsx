import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/LanguageContext';

// ─── Per-lesson quiz question banks ──────────────────────────────────────────

const LESSON_QUESTIONS = {
  l1_01: [
    { q: "What does 'Ekadhikena Purvena' mean?", options: ['All from 9 and last from 10','By one more than the previous one','Vertically and crosswise','Transpose and apply'], correct: 1 },
    { q: 'Using Ekadhikena Purvena, what is 45²?', options: ['1925','2005','2025','2125'], correct: 2 },
    { q: 'What is 85²?', options: ['7225','7025','7625','6825'], correct: 0 },
    { q: 'Which sutra is used for multiplication near bases like 100?', options: ['Urdhva-Tiryagbhyam','Ekadhikena Purvena','Nikhilam Navatashcaramam Dashatah','Paravartya Yojayet'], correct: 2 },
    { q: 'What is 95²?', options: ['8025','9025','8225','9225'], correct: 1 },
  ],
  l1_02: [
    { q: 'What is the result of applying Ekadhikena Purvena to 55²?', options: ['3000','3025','3125','2925'], correct: 1 },
    { q: 'What is 75²?', options: ['5425','5525','5625','5725'], correct: 2 },
    { q: 'What is 25²?', options: ['425','525','625','725'], correct: 2 },
    { q: 'To square a number ending in 5, you append ___ after the prefix.', options: ['05','25','50','52'], correct: 1 },
    { q: 'What is 15²?', options: ['125','225','325','425'], correct: 1 },
  ],
  l1_03: [
    { q: 'Nikhilam works best for numbers near which bases?', options: ['Powers of 2','Powers of 10','Prime numbers','Fibonacci numbers'], correct: 1 },
    { q: 'Calculate 8 × 7 using Nikhilam', options: ['54','56','58','52'], correct: 1 },
    { q: 'What are the "deficits" for 9 and 6?', options: ['1 and 4','2 and 3','1 and 3','2 and 4'], correct: 0 },
    { q: 'In Nikhilam, the cross subtraction and digit product give?', options: ['Both parts of the answer','Only the quotient','Only the remainder','The exponent'], correct: 0 },
    { q: 'Calculate 9 × 7', options: ['61','63','65','67'], correct: 1 },
  ],
  l1_04: [
    { q: 'For base 100 Nikhilam, the right part must have how many digits?', options: ['1','2','3','4'], correct: 1 },
    { q: 'Calculate 97 × 96', options: ['9212','9312','9412','9112'], correct: 1 },
    { q: 'What are the deficits for 98 and 95?', options: ['2 and 4','2 and 5','3 and 4','3 and 5'], correct: 1 },
    { q: 'Calculate 95 × 94', options: ['8730','8830','8930','8630'], correct: 2 },
    { q: 'If the product of deficits is 6, you write it as ___ in the right part (base 100)', options: ['6','06','006','60'], correct: 1 },
  ],
  l1_05: [
    { q: 'For base 1000 Nikhilam, the right part must have how many digits?', options: ['1','2','3','4'], correct: 2 },
    { q: 'Calculate 998 × 997', options: ['994006','995006','996006','993006'], correct: 1 },
    { q: 'Calculate 999 × 998', options: ['996002','997002','998002','995002'], correct: 1 },
    { q: 'The deficits for 996 and 994 are?', options: ['4 and 6','3 and 7','5 and 5','6 and 4'], correct: 0 },
    { q: 'Calculate 997 × 995', options: ['991015','992015','993015','994015'], correct: 1 },
  ],
  l1_06: [
    { q: 'The digit sum of 9999 is?', options: ['0','9','36','27'], correct: 1 },
    { q: 'Digit sum verification is called which Vedic principle?', options: ['Nikhilam','Gunita Samuchyah','Anurupyena','Vilokanam'], correct: 1 },
    { q: 'What digit sum check applies to multiplication a × b = c?', options: ['DS(a)+DS(b)=DS(c)','DS(a)×DS(b)=DS(c)','DS(a)−DS(b)=DS(c)','DS(a)÷DS(b)=DS(c)'], correct: 1 },
    { q: 'The digit sum of 18 is?', options: ['9','8','7','6'], correct: 0 },
    { q: 'This technique catches approximately what % of errors?', options: ['~50%','~70%','~89%','~100%'], correct: 2 },
  ],
  l1_07: [
    { q: 'Urdhva-Tiryagbhyam means?', options: ['All from 9','Vertically and crosswise','By one more','Proportionality'], correct: 1 },
    { q: 'Calculate 12 × 13 using Urdhva', options: ['146','156','166','136'], correct: 1 },
    { q: 'In AB × CD, the middle step computes?', options: ['A×C','B×D','A×D + B×C','A×B × C×D'], correct: 2 },
    { q: 'Calculate 23 × 32', options: ['726','736','746','756'], correct: 1 },
    { q: 'Calculate 47 × 63', options: ['2851','2951','2961','3061'], correct: 2 },
  ],
  l1_08: [
    { q: 'Calculate 23 × 11', options: ['243','253','263','233'], correct: 1 },
    { q: 'The rule for multiplying a 2-digit number AB by 11 is?', options: ['A | A+B | B','A+B | A | B','B | A+B | A','A | B | A+B'], correct: 0 },
    { q: 'Calculate 67 × 11', options: ['727','737','747','717'], correct: 1 },
    { q: 'Calculate 88 × 11', options: ['948','958','968','978'], correct: 2 },
    { q: 'Calculate 34 × 12', options: ['398','408','418','428'], correct: 1 },
  ],
  l1_09: [
    { q: 'The shortcut for n × 9 is?', options: ['n × 8 + n','n × 10 − n','n × 10 + n','n × 8 − n'], correct: 1 },
    { q: 'Calculate 7 × 9', options: ['61','63','65','67'], correct: 1 },
    { q: 'Calculate 23 × 9', options: ['197','207','217','187'], correct: 1 },
    { q: 'Calculate 45 × 99', options: ['4355','4455','4555','4255'], correct: 1 },
    { q: 'To multiply by 999, the shortcut is n × 1000 − n. What is 12 × 999?', options: ['11888','11988','12088','11788'], correct: 1 },
  ],
  l2_01: [
    { q: 'Paravartya Yojayet means?', options: ['Vertically and crosswise','Transpose and apply','All from 9','Mere observation'], correct: 1 },
    { q: 'For divisor 13, the transposed flag digit is?', options: ['+3','−3','+1','−1'], correct: 1 },
    { q: 'Divide 121 ÷ 11', options: ['9','10','11','12'], correct: 2 },
    { q: 'Divide 156 ÷ 13', options: ['10','11','12','13'], correct: 2 },
    { q: 'Paravartya division works fastest for divisors in which range?', options: ['1–10','11–19','20–50','51–99'], correct: 1 },
  ],
  l2_02: [
    { q: 'How many steps does 3-digit × 3-digit Urdhva multiplication have?', options: ['3','4','5','6'], correct: 2 },
    { q: 'Calculate 112 × 111', options: ['12332','12432','12532','12232'], correct: 1 },
    { q: 'Calculate 111 × 111', options: ['11221','12321','13321','11321'], correct: 1 },
    { q: 'In the 5-step method, step 3 (hundreds) involves multiplying?', options: ['A×F only','A×F + B×E + C×D','B×E only','A×D + B×C'], correct: 1 },
    { q: 'Calculate 100 × 100 (trivial check)', options: ['1000','10000','100000','100'], correct: 1 },
  ],
  l2_03: [
    { q: 'To square numbers near 50, the formula is?', options: ['(25 + d) | d²','(50 + d) | d²','(25 × d) | d²','(d + 25) | 2d'], correct: 0 },
    { q: 'Calculate 47²', options: ['2109','2209','2309','2009'], correct: 1 },
    { q: 'Calculate 53²', options: ['2709','2809','2909','2609'], correct: 1 },
    { q: 'For the duplex method, (AB)² equals?', options: ['A²|2AB|B²','A|2AB|B','A²|AB|B²','2A|AB|2B'], correct: 0 },
    { q: 'Calculate 51²', options: ['2501','2601','2701','2401'], correct: 1 },
  ],
  l2_04: [
    { q: 'The cubing pattern using Anurupyena is?', options: ['a²|a|b|b²','a³|3a²b|3ab²|b³','a|b|a|b','3a|3b|a|b'], correct: 1 },
    { q: 'Calculate 11³', options: ['1231','1331','1431','1531'], correct: 1 },
    { q: 'Calculate 12³', options: ['1528','1628','1728','1828'], correct: 2 },
    { q: 'For 23³, the values are a=?, b=?', options: ['a=2, b=3','a=3, b=2','a=23, b=0','a=0, b=23'], correct: 0 },
    { q: 'Calculate 10³', options: ['100','1000','10000','100'], correct: 1 },
  ],
  l2_05: [
    { q: 'To find the square root of a 4-digit number, you split it into pairs of how many digits?', options: ['1','2','3','4'], correct: 1 },
    { q: 'What is √1764?', options: ['41','42','43','44'], correct: 1 },
    { q: 'A perfect square ending in 1 has a square root ending in?', options: ['1 only','1 or 9','1 or 3','3 or 7'], correct: 1 },
    { q: 'What is √5625?', options: ['73','74','75','76'], correct: 2 },
    { q: 'What is √9801?', options: ['97','98','99','96'], correct: 2 },
  ],
  l2_06: [
    { q: 'For cube roots, you split the number into groups of ___ digits from the right', options: ['1','2','3','4'], correct: 2 },
    { q: 'What is ∛17576?', options: ['24','25','26','27'], correct: 2 },
    { q: 'A number ending in 8 has a cube root ending in?', options: ['2','4','6','8'], correct: 0 },
    { q: 'What is ∛19683?', options: ['25','26','27','28'], correct: 2 },
    { q: 'Unlike square roots, cube root last digits are always?', options: ['Ambiguous','Unique','Even','Odd'], correct: 1 },
  ],
  l2_07: [
    { q: 'Gunita Samuchyah is used for?', options: ['Multiplication','Division','Verification of calculations','Squaring numbers'], correct: 2 },
    { q: 'Verify 236 × 47 = 11092. Is it correct?', options: ['Yes ✓','No ✗'], correct: 0 },
    { q: 'Verify 158 × 43 = 6784. Is it correct?', options: ['Yes ✓','No ✗'], correct: 1 },
    { q: 'The digit sum of 999 is?', options: ['0','9','18','27'], correct: 1 },
    { q: 'Digit sum check catches about ___ of errors', options: ['50%','70%','89%','100%'], correct: 2 },
  ],
  l2_08: [
    { q: 'Calculate 84 × 5 using Anurupyena', options: ['400','420','440','460'], correct: 1 },
    { q: 'Calculate 68 × 25', options: ['1600','1700','1800','1900'], correct: 1 },
    { q: 'Calculate 96 × 125', options: ['10000','11000','12000','13000'], correct: 2 },
    { q: 'Multiplying by 25 is the same as dividing by 4 then multiplying by?', options: ['10','100','1000','25'], correct: 1 },
    { q: 'Calculate 48 × 125', options: ['5000','6000','7000','8000'], correct: 1 },
  ],
  l2_09: [
    { q: 'Paravartya division: for divisor 17, the flag digit is?', options: ['+7','−7','+1','−1'], correct: 1 },
    { q: 'Calculate 247 ÷ 13', options: ['17','18','19','20'], correct: 2 },
    { q: 'Calculate 256 ÷ 16', options: ['14','15','16','17'], correct: 2 },
    { q: 'Calculate 391 ÷ 17', options: ['21','22','23','24'], correct: 2 },
    { q: 'Paravartya division is fastest for divisors in which range?', options: ['2–9','11–19','20–50','100+'], correct: 1 },
  ],
  l2_10: [
    { q: 'The Vedic formula for a/b + c/d gives numerator as?', options: ['a+c','a×d + b×c','a×c + b×d','b×d'], correct: 1 },
    { q: 'Calculate 1/3 + 1/4', options: ['5/12','7/12','9/12','11/12'], correct: 1 },
    { q: 'Calculate 2/5 + 3/7', options: ['27/35','29/35','31/35','25/35'], correct: 1 },
    { q: 'Calculate 3/4 − 1/6', options: ['5/12','7/12','9/12','3/12'], correct: 1 },
    { q: 'The denominator in the cross-multiply formula is?', options: ['a+c','b+d','a×c','b×d'], correct: 3 },
  ],
  l2_11: [
    { q: 'What is the month code for January?', options: ['0','1','2','4'], correct: 1 },
    { q: 'What day of the week is 26 January 2025?', options: ['Sunday','Monday','Tuesday','Wednesday'], correct: 1 },
    { q: 'Century correction for years 2000–2099 is?', options: ['+0','+2','+4','+6'], correct: 3 },
    { q: 'The formula (d+m+y+⌊y÷4⌋) mod 7 gives?', options: ['Month number','Day of week number','Year code','Week number'], correct: 1 },
    { q: 'Result 6 in the formula corresponds to?', options: ['Sunday','Friday','Saturday','Monday'], correct: 2 },
  ],
  l3_01: [
    { q: '31 × 22 = ?', options: ['672','682','692','702'], correct: 1 },
    { q: '43 × 31 = ?', options: ['1233','1323','1333','1343'], correct: 2 },
    { q: '52 × 21 = ?', options: ['1092','1082','1102','1072'], correct: 0 },
    { q: 'Which step comes FIRST in Urdhva-Tiryagbhyam for AB × CD?', options: ['B×D','A×D+B×C','A×C','B×C'], correct: 2 },
    { q: '64 × 32 = ?', options: ['2038','2048','2058','2068'], correct: 1 },
  ],
  l3_02: [
    { q: '99 × 97 = ?', options: ['9503','9603','9403','9703'], correct: 1 },
    { q: '96 × 98 = ?', options: ['9408','9508','9308','9608'], correct: 0 },
    { q: 'For 88 × 96, the deficiencies are?', options: ['−12,−4','−12,−6','−8,−4','−8,−6'], correct: 0 },
    { q: '994 × 998 = ?', options: ['992012','991012','992112','993012'], correct: 0 },
    { q: '95 × 95 = ?', options: ['9015','9025','9035','9045'], correct: 1 },
  ],
  l3_03: [
    { q: '49 × 47 = ?', options: ['2293','2303','2313','2283'], correct: 1 },
    { q: 'For base-50 method, 46 × 48: the cross result is?', options: ['44','46','48','42'], correct: 0 },
    { q: '198 × 197 = ?', options: ['39006','38906','39106','39206'], correct: 0 },
    { q: '44 × 46 = ?', options: ['2014','2024','2034','2044'], correct: 1 },
    { q: 'What base is most useful for multiplying numbers near 195–205?', options: ['100','150','200','250'], correct: 2 },
  ],
  l3_04: [
    { q: 'Vinculum form of 89 is?', options: ['8(1)','9(1)','9(2)','8(2)'], correct: 1 },
    { q: '67 × 3 using vinculum = ?', options: ['201','198','204','191'], correct: 0 },
    { q: 'Vinculum of 96 = ?', options: ['10(4)','9(4)','10(6)','9(6)'], correct: 0 },
    { q: 'Why do we use vinculum?', options: ['Only works for even numbers','Converts large digits to small ones for easier math','Only for division','Replaces addition'], correct: 1 },
    { q: '78 × 6 = ?', options: ['468','478','458','488'], correct: 0 },
  ],
  l3_05: [
    { q: 'D(34) (Duplex of two-digit 34) = ?', options: ['12','24','7','16'], correct: 1 },
    { q: '31² = ?', options: ['961','951','971','941'], correct: 0 },
    { q: 'D(abc) formula is?', options: ['a²+c²','2ac+b²','2ab+c²','a²+2bc'], correct: 1 },
    { q: '42² = ?', options: ['1764','1774','1754','1784'], correct: 0 },
    { q: '111² = ?', options: ['12211','12321','12421','12221'], correct: 1 },
  ],
  l3_06: [
    { q: '∛32768 = ?', options: ['28','32','36','38'], correct: 1 },
    { q: 'A cube ends in 7. Its cube root ends in?', options: ['7','3','1','9'], correct: 1 },
    { q: '∛19683 = ?', options: ['23','27','29','33'], correct: 1 },
    { q: '∛68921 = ?', options: ['39','41','43','47'], correct: 1 },
    { q: 'For ∛n, how do we find the first digit?', options: ['Divide n by 9','Remove last 3 digits, find largest cube ≤ result','Find last digit pattern','Multiply by 3'], correct: 1 },
  ],
  l3_07: [
    { q: '1234 ÷ 9 = ?', options: ['Q:137 R:1','Q:136 R:2','Q:138 R:0','Q:135 R:3'], correct: 0 },
    { q: 'In Paravartya for ÷9, the complement used is?', options: ['9','1','0','10'], correct: 1 },
    { q: '999 ÷ 9 = ?', options: ['Q:111 R:0','Q:110 R:9','Q:109 R:8','Q:112 R:0'], correct: 0 },
    { q: 'Paravartya sutra means?', options: ['By one more','Transpose and apply','All from 9','Vertically and crosswise'], correct: 1 },
    { q: '2222 ÷ 9 = ?', options: ['Q:246 R:8','Q:247 R:0','Q:246 R:9','Q:248 R:2'], correct: 0 },
  ],
  l3_08: [
    { q: '(x+4)(x+5) = ?', options: ['x²+9x+20','x²+8x+20','x²+9x+9','x²+20x+9'], correct: 0 },
    { q: 'Cross term of (2x+3)(x+2) = ?', options: ['7x','6x','8x','5x'], correct: 0 },
    { q: '(x+1)(x+1) = ?', options: ['x²+x+1','x²+2x+1','x²+2x+2','2x²+2x+1'], correct: 1 },
    { q: 'Urdhva-Tiryagbhyam means?', options: ['By one more','Vertically and crosswise','All from 9','Transpose'], correct: 1 },
    { q: '(x+6)(x−2) = ?', options: ['x²+4x−12','x²−4x−12','x²+8x−12','x²+4x+12'], correct: 0 },
  ],
  l3_09: [
    { q: 'For 2x+3y=7, x+2y=4 → x=?', options: ['1','2','3','4'], correct: 1 },
    { q: 'Denominator in cross-multiplication for ax+by=c, dx+ey=f?', options: ['ae+bd','ae−bd','ab−de','ab+de'], correct: 1 },
    { q: '3x+y=10, x+y=6 → y=?', options: ['1','2','3','4'], correct: 3 },
    { q: 'Which sutra applies to simultaneous equations?', options: ['Nikhilam','Ekadhikena','Paravartya','Yavadunam'], correct: 2 },
    { q: '2x+y=7, x+2y=8 → x+y=?', options: ['4','5','6','7'], correct: 1 },
  ],
  l3_10: [
    { q: '67 × 83 using Urdhva-Tiryagbhyam = ?', options: ['5551','5561','5571','5581'], correct: 1 },
    { q: '97 × 94 = ? (Nikhilam base 100)', options: ['9018','9118','9218','9318'], correct: 1 },
    { q: '∛32768 = ?', options: ['28','32','36','38'], correct: 1 },
    { q: 'D(45) duplex = ?', options: ['20','40','16','36'], correct: 1 },
    { q: 'Vinculum of 87 = ?', options: ['8(3)','9(3)','9(7)','8(7)'], correct: 1 },
    { q: '1357 ÷ 9 = ?', options: ['Q:150 R:7','Q:151 R:8','Q:149 R:6','Q:152 R:9'], correct: 0 },
    { q: '(x+3)(x+7) = ?', options: ['x²+10x+21','x²+21x+10','x²+10x+10','x²+4x+21'], correct: 0 },
    { q: '48² using Duplex = ?', options: ['2294','2304','2314','2324'], correct: 1 },
    { q: '2x+3y=16, x+2y=10 → x=?', options: ['1','2','3','4'], correct: 1 },
    { q: '196 × 198 using Anurupyena (base 200) = ?', options: ['38798','38808','38818','38828'], correct: 1 },
  ],
  l4_05: [
    { q: 'Month code for August = ?', options: ['2','3','4','5'], correct: 1 },
    { q: 'Century code for 2000s = ?', options: ['0','2','4','6'], correct: 3 },
    { q: '15 August 1947 fell on which day?', options: ['Friday','Saturday','Sunday','Monday'], correct: 1 },
    { q: 'In the day formula, result mod 7 = 0 means?', options: ['Monday','Saturday','Sunday','Friday'], correct: 2 },
    { q: 'Month code for January = ?', options: ['0','1','2','4'], correct: 1 },
  ],
  l4_06: [
    { q: '√2 ≈ ?', options: ['1.212','1.314','1.414','1.514'], correct: 2 },
    { q: 'First step in Vedic square root method?', options: ['Divide by 2','Group digits in pairs from decimal point','Find last digit','Multiply by 10'], correct: 1 },
    { q: '√3 ≈ ?', options: ['1.632','1.712','1.732','1.832'], correct: 2 },
    { q: 'Trial divisor after finding first digit d is?', options: ['d','d²','2d','3d'], correct: 2 },
    { q: '√10 ≈ ?', options: ['3.062','3.162','3.262','3.362'], correct: 1 },
  ],
  l4_07: [
    { q: 'Factors of x²+8x+15 = ?', options: ['(x+3)(x+5)','(x+4)(x+4)','(x+6)(x+2)','(x+1)(x+15)'], correct: 0 },
    { q: 'For x²+bx+c, if factors are (x+p)(x+q), then b = ?', options: ['p×q','p+q','p−q','p²+q²'], correct: 1 },
    { q: 'Factors of x²−9 = ?', options: ['(x+3)(x+3)','(x−3)(x−3)','(x+3)(x−3)','(x+9)(x−1)'], correct: 2 },
    { q: 'Sutra "Adyamadyena" means?', options: ['All from 9','First by first, last by last','By one more','Vertically and crosswise'], correct: 1 },
    { q: 'Factors of 2x²+3x+1 = ?', options: ['(2x+1)(x+1)','(x+1)(x+2)','(2x−1)(x+1)','(2x+2)(x+1)'], correct: 0 },
  ],
  l4_08: [
    { q: '67 × 83 using Urdhva-Tiryagbhyam = ?', options: ['5551','5561','5571','5581'], correct: 1 },
    { q: '23³ = ?', options: ['12067','12167','12267','12367'], correct: 1 },
    { q: '∛54872 = ?', options: ['36','37','38','39'], correct: 2 },
    { q: '√7 ≈ ?', options: ['2.436','2.546','2.646','2.746'], correct: 2 },
    { q: 'Factors of 2x²+7x+6 = ?', options: ['(2x+3)(x+2)','(2x+2)(x+3)','(x+2)(2x+1)','(2x+6)(x+1)'], correct: 0 },
    { q: '15 August 1947 = ?', options: ['Friday','Saturday','Sunday','Monday'], correct: 1 },
    { q: '1/19 first 4 decimal digits = ?', options: ['0.0512','0.0526','0.0536','0.0516'], correct: 1 },
    { q: '321² = ?', options: ['102041','103041','104041','105041'], correct: 1 },
    { q: 'Is 572 divisible by 11?', options: ['Yes','No'], correct: 0 },
    { q: '97 × 96 using Nikhilam = ?', options: ['9212','9312','9412','9512'], correct: 1 },
  ],
  l2_12: [
    { q: 'To pass the Level 2 assessment, you need at least?', options: ['40%','50%','60%','80%'], correct: 2 },
    { q: 'Paravartya division works best for divisors?', options: ['2–9','11–19','50–99','100+'], correct: 1 },
    { q: 'For ∛x, you split x into groups of ___ digits from the right', options: ['1','2','3','4'], correct: 2 },
    { q: 'Multiplying by 125 using Anurupyena: divide by ___, then append 000', options: ['4','5','8','10'], correct: 2 },
    { q: 'The Vedic digit sum verification catches what approximate % of errors?', options: ['50%','70%','89%','99%'], correct: 2 },
  ],
  l1_10: [
    { q: 'To pass the Level 1 assessment, you need at least?', options: ['40%','50%','60%','80%'], correct: 2 },
    { q: 'Which sutra means "By one more than the previous one"?', options: ['Nikhilam','Ekadhikena Purvena','Urdhva-Tiryagbhyam','Anurupyena'], correct: 1 },
    { q: 'What is 85²?', options: ['7025','7125','7225','7325'], correct: 2 },
    { q: 'Calculate 8 × 9 using Nikhilam', options: ['70','72','74','76'], correct: 1 },
    { q: 'Calculate 67 × 11 using the Vedic method', options: ['727','737','747','717'], correct: 1 },
  ],
};

function getQuestions(lessonId) {
  return LESSON_QUESTIONS[lessonId] || Array.from({ length: 5 }, (_, i) => ({
    q: `Quiz Question ${i + 1}: Apply a Vedic technique to solve this problem`,
    options: ['Option A', 'Option B — Correct Answer', 'Option C', 'Option D'],
    correct: 1,
  }));
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({ label, idx, selected, correct, revealed, onClick }) {
  let bg = 'white';
  let border = '1.5px solid rgba(30,64,175,0.15)';
  let textColor = '#0A1628';
  let icon = null;

  if (revealed) {
    if (idx === correct) { bg = '#D1FAE5'; border = '1.5px solid #10B981'; icon = '✅'; }
    else if (idx === selected) { bg = '#FEE2E2'; border = '1.5px solid #EF4444'; icon = '❌'; textColor = '#4B5563'; }
    else { textColor = '#9CA3AF'; }
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
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

// ─── Master Celebration ───────────────────────────────────────────────────────

function MasterCelebration({ totalXP, badgeCount, xpEarned, correct, total, shareText, onComplete, fireConfetti, glass }) {
  const { t } = useLanguage();
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center' }}
    >
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628, #7C3AED)',
        borderRadius: 20, padding: '40px 28px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>👑</div>
        <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 8 }}>
          You are a VedicMind Master!
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
          You have completed all 40 lessons of Ancient Vedic Mathematics 🎉
        </p>

        {/* Score */}
        <div style={{ display: 'inline-flex', gap: 24, background: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: '16px 28px', marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#FCD34D' }}>{correct}/{total}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Final Score</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#34D399' }}>+{xpEarned}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('xpEarned')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#93C5FD' }}>{totalXP}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('totalXP')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: '#FCA5A5' }}>{badgeCount}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Badges</div>
          </div>
        </div>

        {/* Master badge */}
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 100, padding: '8px 20px', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'white', fontWeight: 600 }}>🏆 Master Badge Unlocked!</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', minHeight: 48, background: '#25D366', color: 'white',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 16, cursor: 'pointer', textDecoration: 'none',
              lineHeight: '48px', textAlign: 'center',
            }}
          >
            📲 Share Your Achievement →
          </a>
          <button
            onClick={onComplete}
            style={{
              minHeight: 48, background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12,
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            View Dashboard →
          </button>
        </div>
      </div>

      {/* Replay confetti */}
      <button
        onClick={fireConfetti}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563',
        }}
      >
        🎉 Celebrate again!
      </button>
    </motion.div>
  );
}

// ─── Main QuizTab ─────────────────────────────────────────────────────────────

export default function QuizTab({lesson, glass, onComplete, onNextLesson, allLessonIds }) {
  const { t } = useLanguage();
  const questions = getQuestions(lesson.id);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleSelect = (idx) => {
    setSelected(idx);
    setRevealed(true);
    setAnswers(prev => [...prev, idx === q.correct]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const correct = answers.filter(Boolean).length;
    const pct = Math.round((correct / questions.length) * 100);
    const xpEarned = Math.round((correct / questions.length) * 100) + 20;
    const isFinalMaster = lesson.id === 'l4_08' && pct >= 60;

    // Master completion celebration screen
    if (isFinalMaster) {
      // Award master badge & fire confetti
      const p = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
      if (!Array.isArray(p.badges)) p.badges = [];
      if (!p.badges.includes('master_complete')) {
        p.badges = [...p.badges, 'master_complete'];
        localStorage.setItem('vedicmind_progress', JSON.stringify(p));
      }

      const totalXP = p.totalXP || 0;
      const badgeCount = p.badges.length;

      const fireConfetti = () => {
        const burst = (x, angle) => confetti({ particleCount: 80, spread: 70, origin: { x, y: 0.6 }, angle });
        burst(0.25, 120); burst(0.75, 60);
        setTimeout(() => { burst(0.1, 90); burst(0.9, 90); }, 400);
        setTimeout(() => { burst(0.5, 90); }, 800);
        setTimeout(() => { burst(0.3, 110); burst(0.7, 70); }, 1200);
        setTimeout(() => { burst(0.5, 90); }, 1800);
      };

      const shareText = encodeURIComponent('I just completed all 40 Vedic Maths lessons on VedicMind and became a Master! 🧮🏆\nTry it free at vedicmindai.in');

      return (
        <MasterCelebration
          totalXP={totalXP}
          badgeCount={badgeCount}
          xpEarned={xpEarned}
          correct={correct}
          total={questions.length}
          shareText={shareText}
          onComplete={() => onComplete(pct, xpEarned)}
          fireConfetti={fireConfetti}
          glass={glass}
        />
      );
    }

    const feedbackColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';
    const feedbackText = pct >= 80
      ? 'Excellent work! You\'ve mastered this lesson. 🌟'
      : pct >= 60
        ? 'Good job! Keep practicing to strengthen this technique.'
        : 'Keep going — revisit the concept and try the quiz again.';

    const allIds = allLessonIds || [];
    const nextId = allIds[allIds.indexOf(lesson.id) + 1];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: '#F0F4FF', borderLeft: '3px solid #10B981',
          borderRadius: 16, padding: 24,
        }}>
        <style>{`@media(max-width:360px){.quiz-btn-row{flex-direction:column!important;}}`}</style>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
        <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {t('lessonComplete')}
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 4 }}>
          {correct}/{questions.length} correct · {pct}%
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#10B981', marginBottom: 8 }}>
          +{xpEarned} XP earned
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: feedbackColor, marginBottom: 20 }}>
          {feedbackText}
        </div>
        <div className="quiz-btn-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {pct >= 60 && nextId ? (
            <button
              onClick={() => onNextLesson && onNextLesson(lesson.id, xpEarned, pct)}
              style={{ flex: 1, minWidth: 120, minHeight: 44, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Next Lesson →
            </button>
          ) : pct >= 60 ? (
            <button
              onClick={() => onComplete(pct, xpEarned)}
              style={{ flex: 1, minWidth: 120, minHeight: 44, background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Complete Lesson →
            </button>
          ) : null}
          <button
            onClick={() => { setCurrent(0); setSelected(null); setRevealed(false); setAnswers([]); setDone(false); }}
            style={{ flex: 1, minWidth: 120, minHeight: 44, background: 'transparent', color: '#0A1628', border: '1.5px solid #0A1628', borderRadius: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Retake Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ ...glass, padding: 24 }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563' }}>
            Q{current + 1} of {questions.length}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: 28, height: 4, borderRadius: 100,
                background: i < current ? '#10B981' : i === current ? '#3B82F6' : 'rgba(30,64,175,0.12)',
              }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: '#0A1628', marginBottom: 20, lineHeight: 1.5 }}>
          {q.q}
        </div>

        {/* Options */}
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={opt}
            idx={i}
            selected={selected}
            correct={q.correct}
            revealed={revealed}
            onClick={handleSelect}
          />
        ))}

        {/* Next button */}
        {revealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 12 }}>
            <button onClick={handleNext} style={{
              minHeight: 44, padding: '0 24px', background: '#0A1628', color: 'white',
              border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              {current < questions.length - 1 ? 'Next Question →' : 'See Results →'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}