// Question bank for Battle Mode 1v1 matches. Expanded to 20 questions per
// topic (up from a much smaller original set) specifically so a single
// battle never feels repetitive, and each question is tagged by difficulty
// so a battle can be scoped to the creator's chosen level.
//
// All results below were verified by direct multiplication, not just the
// sutra shortcut, before being added.

export const BATTLE_TOPICS = ['Mixed', 'Nikhilam Sutra', 'Ekadhikena Purvena', 'By 11 Trick', 'Antyayor Dashakepi'];
export const BATTLE_DIFFICULTIES = ['easy', 'moderate', 'hard'];

export const BATTLE_QUESTIONS = [
  // ============================== NIKHILAM SUTRA ==============================
  { prompt: '8 × 9 = ?', options: ['72', '71', '73'], answer: '72', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '7 × 8 = ?', options: ['56', '54', '58'], answer: '56', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '9 × 6 = ?', options: ['54', '52', '56'], answer: '54', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '9 × 9 = ?', options: ['81', '79', '83'], answer: '81', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '8 × 8 = ?', options: ['64', '62', '66'], answer: '64', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '7 × 7 = ?', options: ['49', '47', '51'], answer: '49', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '6 × 8 = ?', options: ['48', '46', '50'], answer: '48', tag: 'Nikhilam Sutra', difficulty: 'easy' },
  { prompt: '97 × 96 = ?', options: ['9312', '9212', '9412'], answer: '9312', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '98 × 97 = ?', options: ['9506', '9406', '9606'], answer: '9506', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '95 × 94 = ?', options: ['8930', '8830', '9030'], answer: '8930', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '93 × 92 = ?', options: ['8556', '8456', '8656'], answer: '8556', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '96 × 94 = ?', options: ['9024', '8924', '9124'], answer: '9024', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '99 × 98 = ?', options: ['9702', '9602', '9802'], answer: '9702', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '92 × 91 = ?', options: ['8372', '8272', '8472'], answer: '8372', tag: 'Nikhilam Sutra', difficulty: 'moderate' },
  { prompt: '998 × 997 = ?', options: ['995006', '994006', '996006'], answer: '995006', tag: 'Nikhilam Sutra', difficulty: 'hard' },
  { prompt: '997 × 996 = ?', options: ['993012', '992012', '994012'], answer: '993012', tag: 'Nikhilam Sutra', difficulty: 'hard' },
  { prompt: '999 × 998 = ?', options: ['997002', '996002', '998002'], answer: '997002', tag: 'Nikhilam Sutra', difficulty: 'hard' },
  { prompt: '996 × 994 = ?', options: ['990024', '989024', '991024'], answer: '990024', tag: 'Nikhilam Sutra', difficulty: 'hard' },
  { prompt: '112 × 108 = ?', options: ['12096', '11996', '12196'], answer: '12096', tag: 'Nikhilam Sutra', difficulty: 'hard' },
  { prompt: '106 × 104 = ?', options: ['11024', '10924', '11124'], answer: '11024', tag: 'Nikhilam Sutra', difficulty: 'hard' },

  // ============================ EKADHIKENA PURVENA ============================
  { prompt: '15² = ?', options: ['225', '215', '235'], answer: '225', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '25² = ?', options: ['625', '615', '635'], answer: '625', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '35² = ?', options: ['1225', '1215', '1235'], answer: '1225', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '45² = ?', options: ['2025', '2015', '2035'], answer: '2025', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '55² = ?', options: ['3025', '3015', '3035'], answer: '3025', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '65² = ?', options: ['4225', '4215', '4235'], answer: '4225', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '75² = ?', options: ['5625', '5615', '5635'], answer: '5625', tag: 'Ekadhikena Purvena', difficulty: 'easy' },
  { prompt: '85² = ?', options: ['7225', '7215', '7235'], answer: '7225', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '95² = ?', options: ['9025', '9015', '9035'], answer: '9025', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '105² = ?', options: ['11025', '10925', '11125'], answer: '11025', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '115² = ?', options: ['13225', '13125', '13325'], answer: '13225', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '125² = ?', options: ['15625', '15525', '15725'], answer: '15625', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '135² = ?', options: ['18225', '18125', '18325'], answer: '18225', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '145² = ?', options: ['21025', '20925', '21125'], answer: '21025', tag: 'Ekadhikena Purvena', difficulty: 'moderate' },
  { prompt: '155² = ?', options: ['24025', '23925', '24125'], answer: '24025', tag: 'Ekadhikena Purvena', difficulty: 'hard' },
  { prompt: '165² = ?', options: ['27225', '27125', '27325'], answer: '27225', tag: 'Ekadhikena Purvena', difficulty: 'hard' },
  { prompt: '175² = ?', options: ['30625', '30525', '30725'], answer: '30625', tag: 'Ekadhikena Purvena', difficulty: 'hard' },
  { prompt: '185² = ?', options: ['34225', '34125', '34325'], answer: '34225', tag: 'Ekadhikena Purvena', difficulty: 'hard' },
  { prompt: '195² = ?', options: ['38025', '37925', '38125'], answer: '38025', tag: 'Ekadhikena Purvena', difficulty: 'hard' },
  { prompt: '205² = ?', options: ['42025', '41925', '42125'], answer: '42025', tag: 'Ekadhikena Purvena', difficulty: 'hard' },

  // ================================ BY 11 TRICK ================================
  { prompt: '12 × 11 = ?', options: ['132', '122', '142'], answer: '132', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '23 × 11 = ?', options: ['253', '243', '263'], answer: '253', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '34 × 11 = ?', options: ['374', '364', '384'], answer: '374', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '41 × 11 = ?', options: ['451', '441', '461'], answer: '451', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '52 × 11 = ?', options: ['572', '562', '582'], answer: '572', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '61 × 11 = ?', options: ['671', '661', '681'], answer: '671', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '81 × 11 = ?', options: ['891', '881', '901'], answer: '891', tag: 'By 11 Trick', difficulty: 'easy' },
  { prompt: '75 × 11 = ?', options: ['825', '815', '835'], answer: '825', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '86 × 11 = ?', options: ['946', '936', '956'], answer: '946', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '67 × 11 = ?', options: ['737', '727', '747'], answer: '737', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '93 × 11 = ?', options: ['1023', '1013', '1033'], answer: '1023', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '88 × 11 = ?', options: ['968', '958', '978'], answer: '968', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '59 × 11 = ?', options: ['649', '639', '659'], answer: '649', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '77 × 11 = ?', options: ['847', '837', '857'], answer: '847', tag: 'By 11 Trick', difficulty: 'moderate' },
  { prompt: '123 × 11 = ?', options: ['1353', '1343', '1453'], answer: '1353', tag: 'By 11 Trick', difficulty: 'hard' },
  { prompt: '234 × 11 = ?', options: ['2574', '2564', '2674'], answer: '2574', tag: 'By 11 Trick', difficulty: 'hard' },
  { prompt: '345 × 11 = ?', options: ['3795', '3785', '3895'], answer: '3795', tag: 'By 11 Trick', difficulty: 'hard' },
  { prompt: '456 × 11 = ?', options: ['5016', '5006', '5116'], answer: '5016', tag: 'By 11 Trick', difficulty: 'hard' },
  { prompt: '567 × 11 = ?', options: ['6237', '6227', '6337'], answer: '6237', tag: 'By 11 Trick', difficulty: 'hard' },
  { prompt: '678 × 11 = ?', options: ['7458', '7448', '7558'], answer: '7458', tag: 'By 11 Trick', difficulty: 'hard' },

  // ============================= ANTYAYOR DASHAKEPI =============================
  { prompt: '9 × 11 = ?', options: ['99', '97', '101'], answer: '99', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '18 × 22 = ?', options: ['396', '386', '406'], answer: '396', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '12 × 18 = ?', options: ['216', '206', '226'], answer: '216', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '24 × 26 = ?', options: ['624', '614', '634'], answer: '624', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '28 × 32 = ?', options: ['896', '886', '906'], answer: '896', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '10 × 14 = ?', options: ['140', '130', '150'], answer: '140', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '14 × 22 = ?', options: ['308', '298', '318'], answer: '308', tag: 'Antyayor Dashakepi', difficulty: 'easy' },
  { prompt: '48 × 52 = ?', options: ['2496', '2486', '2506'], answer: '2496', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '44 × 56 = ?', options: ['2464', '2454', '2474'], answer: '2464', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '39 × 61 = ?', options: ['2379', '2369', '2389'], answer: '2379', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '58 × 62 = ?', options: ['3596', '3586', '3606'], answer: '3596', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '55 × 65 = ?', options: ['3575', '3565', '3585'], answer: '3575', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '67 × 73 = ?', options: ['4891', '4881', '4901'], answer: '4891', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '36 × 64 = ?', options: ['2304', '2294', '2314'], answer: '2304', tag: 'Antyayor Dashakepi', difficulty: 'moderate' },
  { prompt: '89 × 91 = ?', options: ['8099', '8089', '8109'], answer: '8099', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
  { prompt: '96 × 94 = ?', options: ['9024', '9014', '9034'], answer: '9024', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
  { prompt: '83 × 97 = ?', options: ['8051', '8041', '8061'], answer: '8051', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
  { prompt: '78 × 102 = ?', options: ['7956', '7946', '7966'], answer: '7956', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
  { prompt: '92 × 108 = ?', options: ['9936', '9926', '9946'], answer: '9936', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
  { prompt: '79 × 121 = ?', options: ['9559', '9549', '9569'], answer: '9559', tag: 'Antyayor Dashakepi', difficulty: 'hard' },
];

export function drawBattleQuestions(count = 5, topic = 'Mixed', difficulty = null) {
  let pool = topic === 'Mixed' ? BATTLE_QUESTIONS : BATTLE_QUESTIONS.filter((q) => q.tag === topic);
  if (difficulty) {
    const narrowed = pool.filter((q) => q.difficulty === difficulty);
    if (narrowed.length > 0) pool = narrowed; // only narrow if it doesn't empty the pool
  }
  const source = pool.length > 0 ? pool : BATTLE_QUESTIONS; // true fallback only if genuinely empty
  const result = [];
  let shuffled = [];
  while (result.length < count) {
    if (shuffled.length === 0) shuffled = [...source].sort(() => Math.random() - 0.5);
    result.push(shuffled.pop());
  }
  return result;
}
