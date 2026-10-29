// Registry of the 16 Vedic Mathematics sutras and their sub-sutras.
//
// status:
//   'covered' — at least one lesson teaches it
//   'partial' — taught only in concept text or in question banks, no lesson id yet
//   'missing' — no content anywhere in the app
//
// `lessons` lists curriculum ids from curriculumData.jsx that teach the sutra.
// The sub-sutra list is the standard set from Tirthaji's text; verify before publishing.

export const VEDIC_SUTRAS = [
  { id: 'ekadhikena-purvena', name: 'Ekadhikena Purvena', meaning: 'By one more than the previous one', status: 'covered', lessons: ['l1_02', 'l1_06', 'l2_03'] },
  { id: 'nikhilam', name: 'Nikhilam Navatashcaramam Dashatah', meaning: 'All from 9 and the last from 10', status: 'covered', lessons: ['l1_03', 'l1_04', 'l1_05', 'l3_02'] },
  { id: 'urdhva-tiryagbhyam', name: 'Urdhva-Tiryagbhyam', meaning: 'Vertically and crosswise', status: 'covered', lessons: ['l1_07', 'l2_02', 'l3_01'] },
  { id: 'paravartya-yojayet', name: 'Paravartya Yojayet', meaning: 'Transpose and apply', status: 'covered', lessons: ['l2_01'] },
  { id: 'shunyam-saamyasamuccaye', name: 'Shunyam Saamyasamuccaye', meaning: 'When the sum is the same, that sum is zero', status: 'covered', lessons: ['l3_11'] },
  { id: 'anurupyena', name: 'Anurupyena', meaning: 'Proportionately', status: 'covered', lessons: ['l3_03'], isSubSutra: true },
  { id: 'sankalana-vyavakalanabhyam', name: 'Sankalana-vyavakalanabhyam', meaning: 'By addition and by subtraction', status: 'covered', lessons: ['l2_14'] },
  { id: 'puranapuranabhyam', name: 'Puranapuranabhyam', meaning: 'By the completion or non-completion', status: 'covered', lessons: ['l3_13'] },
  { id: 'chalana-kalanabhyam', name: 'Chalana-Kalanabhyam', meaning: 'Sequential motion and differences', status: 'missing', lessons: [] },
  { id: 'yavadunam', name: 'Yavadunam', meaning: 'Whatever the extent of its deficiency', status: 'covered', lessons: ['l2_15'] },
  { id: 'vyashtisamanstih', name: 'Vyashtisamanstih', meaning: 'Part and whole', status: 'missing', lessons: [] },
  { id: 'shesanyankena-charamena', name: 'Shesanyankena Charamena', meaning: 'The remainders by the last digit', status: 'covered', lessons: ['l3_12'] },
  { id: 'sopaantyadvayamantyam', name: 'Sopaantyadvayamantyam', meaning: 'The ultimate and twice the penultimate', status: 'missing', lessons: [] },
  { id: 'ekanyunena-purvena', name: 'Ekanyunena Purvena', meaning: 'By one less than the previous one', status: 'covered', lessons: ['l4_09'] },
  { id: 'gunitasamuccayah', name: 'Gunitasamuccayah', meaning: 'The product of the sum is the sum of the products', status: 'missing', lessons: [] },
  { id: 'gunakasamuccayah', name: 'Gunakasamuccayah', meaning: 'The factors of the sum are the sum of the factors', status: 'covered', lessons: ['l3_14'] },
];

export const VEDIC_SUB_SUTRAS = [
  { id: 'antyayor-dashakepi', name: 'Antyayor Dashakepi', meaning: 'The ultimate digits when their tens are the same and units add to ten', status: 'covered', lessons: ['l2_11'], isSubSutra: true },
  { id: 'shunyam-anyat', name: 'Shunyam Anyat', meaning: 'If one is in ratio, the other is zero', status: 'partial', lessons: [], isSubSutra: true },
  { id: 'adyamadyenantyamantyena', name: 'Adyamadyenantyamantyena', meaning: 'The first by the first and the last by the last', status: 'covered', lessons: ['l3_15'], isSubSutra: true },
  { id: 'sisyate-sesasamjnah', name: 'Sisyate Sesasamjnah', meaning: 'The remainder is called the rest', status: 'missing', lessons: [], isSubSutra: true },
  { id: 'kevalaih-saptakam-gunyat', name: 'Kevalaih Saptakam Gunyat', meaning: 'For 7 multiply by the combined value', status: 'covered', lessons: ['l3_16'], isSubSutra: true },
  { id: 'vestanam', name: 'Vestanam', meaning: 'By the completion or non-completion (of the arrangement)', status: 'missing', lessons: [], isSubSutra: true },
];

// Returns sutras and sub-sutras with no lesson and no partial content.
export function getMissingSutras() {
  return [...VEDIC_SUTRAS, ...VEDIC_SUB_SUTRAS].filter((s) => s.status === 'missing');
}
