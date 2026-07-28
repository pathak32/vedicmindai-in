// Aptitude chapter progress — mirrors reasoningProgress.js exactly, so all
// three verticals (Vedic Maths, Reasoning, Aptitude) now share the same
// consistent 60% progression-unlock model for Basic+ paying users.
// Built 27-Jul-2026 — Aptitude previously had ZERO progress tracking or
// unlock gating at all; every chapter was fully open regardless of score.
//
// Design note: Pre-K is intentionally EXEMPT from score-gating. Toddler
// content is parent-guided and exploratory, not a pass/fail model — gating
// a 4-year-old's access behind a quiz score doesn't fit the pedagogy. All
// Pre-K chapters stay open (for paid users) without a sequential unlock.
// The 60% gate applies to Primary and Middle (and future Secondary/
// Intermediate) chapters, same as Reasoning's Level 1/Level 2 model.

import { getSupabase } from './supabaseClient';
import { getAptitudeChaptersByLevel } from '@/data/aptitudeContent';

export const APTITUDE_PASS_THRESHOLD = 60; // % required to unlock the next chapter — matches Vedic Maths & Reasoning
const XP_PER_CHAPTER = 50;

function readProgress() {
  try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); }
  catch { return {}; }
}

function writeProgress(p) {
  localStorage.setItem('vedicmind_progress', JSON.stringify(p));
}

export function getAptitudeScores() {
  return readProgress().aptitudeScores || {};
}

export function getAptitudeCompleted() {
  return readProgress().aptitudeCompleted || [];
}

// Call once when a chapter's quiz is finished. Idempotent — same guard
// pattern as reasoningProgress.js and the Concept-tab XP fix.
export function saveAptitudeChapterResult(chapterId, pct) {
  const p = readProgress();
  if (!p.aptitudeScores) p.aptitudeScores = {};
  if (!Array.isArray(p.aptitudeCompleted)) p.aptitudeCompleted = [];

  const priorBest = p.aptitudeScores[chapterId] ?? -1;
  const alreadyCounted = p.aptitudeCompleted.includes(chapterId);

  if (pct > priorBest) p.aptitudeScores[chapterId] = pct;

  if (pct >= APTITUDE_PASS_THRESHOLD && !p.aptitudeCompleted.includes(chapterId)) {
    p.aptitudeCompleted.push(chapterId);
  }

  if (pct >= APTITUDE_PASS_THRESHOLD && !alreadyCounted) {
    p.totalXP = (p.totalXP || 0) + XP_PER_CHAPTER;
  }

  writeProgress(p);
  syncAptitudeProgressToServer(chapterId, p.aptitudeScores[chapterId] ?? pct, p.aptitudeCompleted.includes(chapterId));
}

// Fire-and-forget sync to Supabase — non-blocking, same pattern as Reasoning.
async function syncAptitudeProgressToServer(chapterId, bestScore, completed) {
  try {
    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;
    await supabase.from('aptitude_progress').upsert({
      user_id: session.user.id,
      chapter_id: chapterId,
      best_score: bestScore,
      completed,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,chapter_id' });
  } catch (e) {
    console.warn('Aptitude progress sync failed (non-critical, local save succeeded):', e);
  }
}

// Sequential unlock WITHIN a level. First chapter of a gated level is always
// open (once the level itself is reachable); every later chapter requires
// the immediately previous one to have scored >= APTITUDE_PASS_THRESHOLD.
// Pre-K chapters always return true — see design note above.
export function isAptitudeChapterUnlocked(chapterId, sortedChapterIds, level) {
  if (level === 'PRE_K') return true;
  const idx = sortedChapterIds.indexOf(chapterId);
  if (idx <= 0) return true;
  const scores = getAptitudeScores();
  const prevId = sortedChapterIds[idx - 1];
  return (scores[prevId] ?? 0) >= APTITUDE_PASS_THRESHOLD;
}

// ── Cross-level unlock ─────────────────────────────────────────────────────
// Middle becomes accessible only once every Primary chapter has been passed
// at >= APTITUDE_PASS_THRESHOLD — same "clear the whole prior level" rule
// Reasoning uses for Level 2. Pre-K has no prerequisite (entry point).

export function isAptitudeLevelUnlocked(level) {
  if (level === 'PRE_K' || level === 'PRIMARY') return true;
  const scores = getAptitudeScores();
  const allCleared = (priorLevel) =>
    getAptitudeChaptersByLevel(priorLevel).every((c) => (scores[c.id] ?? 0) >= APTITUDE_PASS_THRESHOLD);
  if (level === 'MIDDLE') return allCleared('PRIMARY');
  if (level === 'SECONDARY') return allCleared('MIDDLE');
  if (level === 'INTERMEDIATE') return allCleared('SECONDARY');
  return true;
}

// Pull server-side progress down into localStorage on load, same gap-fix
// pattern as reconcileReasoningFromServer — otherwise a new device/browser
// shows Aptitude as fully unstarted even if the server has real progress.
export async function reconcileAptitudeFromServer(userId) {
  if (!userId) return false;
  try {
    const sb = await getSupabase();
    const { data, error } = await sb
      .from('aptitude_progress')
      .select('chapter_id, best_score, completed')
      .eq('user_id', userId);
    if (error || !data || data.length === 0) return false;

    const p = readProgress();
    if (!p.aptitudeScores) p.aptitudeScores = {};
    if (!Array.isArray(p.aptitudeCompleted)) p.aptitudeCompleted = [];

    let changed = false;
    for (const row of data) {
      const localScore = p.aptitudeScores[row.chapter_id] ?? -1;
      if (row.best_score > localScore) {
        p.aptitudeScores[row.chapter_id] = row.best_score;
        changed = true;
      }
      if (row.completed && !p.aptitudeCompleted.includes(row.chapter_id)) {
        p.aptitudeCompleted.push(row.chapter_id);
        changed = true;
      }
    }
    if (changed) writeProgress(p);
    return changed;
  } catch (e) {
    console.warn('reconcileAptitudeFromServer failed (non-critical):', e);
    return false;
  }
}
