// Reasoning chapter progress — mirrors how Sutra lessons track completion
// (lessonScores + completedLessons in vedicmind_progress), which Reasoning
// never had at all until now: no checkmarks, no sequential unlock, quiz
// score was pure in-memory React state that vanished the moment you left
// the page. This gives Reasoning the same persistence + gating Sutras have.

export const REASONING_PASS_THRESHOLD = 80; // % required to unlock the next chapter
const XP_PER_CHAPTER = 50;

function readProgress() {
  try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); }
  catch { return {}; }
}

function writeProgress(p) {
  localStorage.setItem('vedicmind_progress', JSON.stringify(p));
}

export function getReasoningScores() {
  return readProgress().reasoningScores || {};
}

export function getReasoningCompleted() {
  return readProgress().reasoningCompleted || [];
}

// Call once when a chapter's quiz is finished. Idempotent — re-finishing an
// already-completed chapter updates the score (if improved) but never
// double-awards XP, same guard pattern as the Concept-tab XP bug fixed
// earlier today.
export function saveReasoningChapterResult(chapterId, pct) {
  const p = readProgress();
  if (!p.reasoningScores) p.reasoningScores = {};
  if (!Array.isArray(p.reasoningCompleted)) p.reasoningCompleted = [];

  const priorBest = p.reasoningScores[chapterId] ?? -1;
  const alreadyCounted = p.reasoningCompleted.includes(chapterId);

  if (pct > priorBest) p.reasoningScores[chapterId] = pct;

  if (pct >= REASONING_PASS_THRESHOLD && !p.reasoningCompleted.includes(chapterId)) {
    p.reasoningCompleted.push(chapterId);
  }

  if (pct >= REASONING_PASS_THRESHOLD && !alreadyCounted) {
    p.totalXP = (p.totalXP || 0) + XP_PER_CHAPTER;
  }

  writeProgress(p);
}

// First chapter always open. Every later chapter requires the immediately
// previous chapter to have scored >= REASONING_PASS_THRESHOLD at least once.
export function isReasoningChapterUnlocked(chapterId, sortedChapterIds) {
  const idx = sortedChapterIds.indexOf(chapterId);
  if (idx <= 0) return true;
  const scores = getReasoningScores();
  const prevId = sortedChapterIds[idx - 1];
  return (scores[prevId] ?? 0) >= REASONING_PASS_THRESHOLD;
}
