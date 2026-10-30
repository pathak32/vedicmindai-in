// Spreads easy / medium / hard evenly across the questions of every chapter,
// in the same rotating pattern the Vedic Maths banks use.
const LEVELS = ['easy', 'medium', 'hard'];

export function tagDifficulty(questions, skipChapters = []) {
  const seen = {};
  questions.forEach((q, i) => {
    if (skipChapters.includes(q.chapter)) return;
    const n = seen[q.chapter] ?? 0;
    seen[q.chapter] = n + 1;
    questions[i] = { ...q, difficulty: LEVELS[n % LEVELS.length] };
  });
}
