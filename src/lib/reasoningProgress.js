// Reasoning chapter progress — mirrors how Sutra lessons track completion
// (lessonScores + completedLessons in vedicmind_progress), which Reasoning
// never had at all until now: no checkmarks, no sequential unlock, quiz
// score was pure in-memory React state that vanished the moment you left
// the page. This gives Reasoning the same persistence + gating Sutras have.

import { getSupabase } from './supabaseClient';

export const REASONING_PASS_THRESHOLD = 60; // % required to unlock the next chapter — matches Sutra lessons
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
  syncReasoningProgressToServer(chapterId, p.reasoningScores[chapterId] ?? pct, p.reasoningCompleted.includes(chapterId));
}

// Fire-and-forget sync to Supabase — local write above already happened, so
// the UI never waits on this. Mirrors the same non-blocking pattern used
// for daily quiz saves.
async function syncReasoningProgressToServer(chapterId, bestScore, completed) {
  try {
    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;
    await supabase.from('reasoning_progress').upsert({
      user_id: session.user.id,
      chapter_id: chapterId,
      best_score: bestScore,
      completed,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,chapter_id' });
  } catch (e) {
    console.warn('Reasoning progress sync failed (non-critical, local save succeeded):', e);
  }
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

// ── Level 2 unlock ──────────────────────────────────────────────────────────
// Level 2 becomes accessible only once the user has passed EVERY Level 1
// chapter at >= REASONING_PASS_THRESHOLD. Within Level 2, the same
// sequential unlock rule applies (each chapter requires the previous one).

export function isLevel2Unlocked(level1ChapterIds) {
  const scores = getReasoningScores();
  return level1ChapterIds.every((id) => (scores[id] ?? 0) >= REASONING_PASS_THRESHOLD);
}

export function isLevel2ChapterUnlocked(chapterId, sortedLevel2Ids, level1ChapterIds) {
  if (!isLevel2Unlocked(level1ChapterIds)) return false;
  const idx = sortedLevel2Ids.indexOf(chapterId);
  if (idx <= 0) return true; // first L2 chapter is open once L2 is unlocked
  const scores = getReasoningScores();
  const prevId = sortedLevel2Ids[idx - 1];
  return (scores[prevId] ?? 0) >= REASONING_PASS_THRESHOLD;
}

// The gap that caused Hitesh's bug: every read above only ever looked at
// localStorage. If someone logs in on a new device/browser, or clears
// storage, the app has no way to know the server already has their real
// progress — Reasoning silently shows as fully unstarted even though the
// admin panel (which reads directly from Supabase) shows it correctly.
// Call this once on load, before the sidebar/chapter page render their
// lock states, to pull server data down and merge it into localStorage.
export async function reconcileReasoningFromServer(userId) {
  if (!userId) return false;
  try {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from('reasoning_progress')
      .select('chapter_id, best_score, completed')
      .eq('user_id', userId);
    if (error || !data || data.length === 0) return false;

    const p = readProgress();
    if (!p.reasoningScores) p.reasoningScores = {};
    if (!Array.isArray(p.reasoningCompleted)) p.reasoningCompleted = [];

    let changed = false;
    for (const row of data) {
      const localScore = p.reasoningScores[row.chapter_id] ?? -1;
      if (row.best_score > localScore) {
        p.reasoningScores[row.chapter_id] = row.best_score;
        changed = true;
      }
      if (row.completed && !p.reasoningCompleted.includes(row.chapter_id)) {
        p.reasoningCompleted.push(row.chapter_id);
        changed = true;
      }
    }
    if (changed) writeProgress(p);
    return changed;
  } catch (e) {
    console.warn('reconcileReasoningFromServer failed (non-critical):', e);
    return false;
  }
}
