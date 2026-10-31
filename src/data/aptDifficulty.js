// Hand-judged difficulty per Aptitude question: e = easy, m = medium, h = hard, one letter per
// question in the order it appears in the chapter. If a chapter's question count changes this
// string no longer fits and the chapter falls back to the rotating easy/medium/hard tags.
export const APT_DIFFICULTY = {
  'word-meanings': 'eeeemeeeee' + 'eeemmememe' + 'ememhh' + 'memememmem' + 'meehmmeeee',
  'shape-patterns': 'eeemmeemme' + 'meemmeeeme' + 'mmemmm' + 'eeemeeeeem' + 'eheeeemehm',
  'reasoning-connect': 'eeeemeeeem' + 'eeeehmeeme' + 'hmhmhhmhhm' + 'hhhmmhmmmm',
  'percentage-puzzles': 'eeememeeem' + 'meeemmeeem' + 'emmeemhmmm' + 'ehemmmmhme',
  'speed-maths-connect': 'mmemmmemme' + 'eeemmmmmee' + 'eeemmemmmh' + 'hhemheemhe' + 'mhhmmm',
  'verbal-classification': 'eehehememm' + 'hemeemmmhh' + 'eeeeeeeeme' + 'eeeemeemem',
  'number-puzzles': 'eeeemmemme' + 'eeeeeemmem' + 'hmmhhmmmhm' + 'hmmhmhhmmm',
  'cube-nets-folding': 'eememe' + 'mmmm' + 'memehhemem',
  'rotating-shapes': 'eeemmmemem' + 'emheemmhmm',
  'data-interpretation': 'emmmmmeeee' + 'emmheeeehh' + 'emeemeemmm' + 'eememmeeme',
  'advanced-data-interpretation': 'mhhmmmehmm' + 'mmmmmmmeee' + 'emeeemeeme' + 'eemmmeeemm',
  '3d-spatial-secondary': 'memhemmmem' + 'hmhhmhhhee' + 'mhhhhmhhhe' + 'hhhhemmhhh',
  'reasoning-connect-secondary': 'eemmehehmh' + 'ehhmhemehe' + 'mmemhhhhmm' + 'mhemmmhmhm',
  'verbal-reasoning': 'eeeeemmmhm' + 'mmhmhmhmhm' + 'eeeeeeeeee' + 'eemmemeeme',
  'critical-reasoning': 'mmmmhmhmmh' + 'mhmhhhmhmh' + 'mmmemhemmh' + 'hmmeemhmmm',
  'data-sufficiency': 'eehmmmmhmm' + 'hmhhmmmmhm' + 'emmmmhmmmm' + 'mmmemeheem',
};

const NAMES = { e: 'easy', m: 'medium', h: 'hard' };

// Overwrites the rotating difficulty tag with the hand-judged one, chapter by chapter.
export function applyAptDifficulty(questions) {
  const seen = {};
  const counts = {};
  questions.forEach((q) => { counts[q.chapter] = (counts[q.chapter] || 0) + 1; });
  questions.forEach((q, i) => {
    const marks = APT_DIFFICULTY[q.chapter];
    if (!marks || marks.length !== counts[q.chapter]) return;
    const n = seen[q.chapter] ?? 0;
    seen[q.chapter] = n + 1;
    questions[i] = { ...q, difficulty: NAMES[marks[n]] };
  });
}
