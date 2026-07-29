// Caps how many questions a student sees per quiz attempt, instead of showing
// every question in the chapter's full bank. Built per his request (Jul 29):
// as chapter banks grow past a few dozen questions, showing ALL of them every
// time makes the quiz feel like a slog and doesn't take advantage of having a
// larger pool to rotate through on repeat attempts.
//
// Behavior:
// - Pools at or under the cap are returned unchanged (no point capping a
//   15-question chapter to 15).
// - When the pool has a `difficulty` field (easy/medium/hard) on each
//   question, the selection is stratified roughly evenly across the three so
//   a single attempt can't randomly land all-easy or all-hard.
// - Without difficulty data, falls back to a plain random sample of the pool
//   (still gives the rotation behavior, just not difficulty-balanced).
// - The final order is shuffled so difficulty tiers don't appear in visible
//   blocks (all easy first, etc).
//
// NOTE: difficulty stratification currently only takes effect for Reasoning,
// since Vedic Maths and Aptitude's live question banks don't carry a
// `difficulty` field through from the review queue into the merged files
// (it exists in pending_questions but gets dropped at merge time). Flagged
// as a real, separate follow-up if per-difficulty rotation matters there too.

export const DEFAULT_QUIZ_CAP = 15;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns { questions, indices } — a capped, rotated subset of `pool`.
 * `indices` are the original positions in `pool`, so callers can persist the
 * exact selection (e.g. to survive a page remount mid-quiz) and reconstruct
 * the same subset later via indices.map(i => pool[i]).
 */
export function pickQuizQuestions(pool, cap = DEFAULT_QUIZ_CAP) {
  if (!Array.isArray(pool) || pool.length <= cap) {
    return { questions: pool || [], indices: (pool || []).map((_, i) => i) };
  }

  const withIdx = pool.map((q, i) => ({ q, i }));
  const hasDifficulty = withIdx.some(({ q }) => q.difficulty);

  let chosen;
  if (hasDifficulty) {
    const buckets = { easy: [], medium: [], hard: [] };
    withIdx.forEach((item) => {
      const d = item.q.difficulty && buckets[item.q.difficulty] ? item.q.difficulty : 'medium';
      buckets[d].push(item);
    });
    Object.keys(buckets).forEach((k) => { buckets[k] = shuffle(buckets[k]); });

    const perBucket = Math.floor(cap / 3);
    chosen = [
      ...buckets.easy.slice(0, perBucket),
      ...buckets.medium.slice(0, perBucket),
      ...buckets.hard.slice(0, perBucket),
    ];
    // Fill any shortfall (cap not divisible by 3, or a bucket ran out) from
    // whatever's left across all buckets combined.
    const chosenIdxSet = new Set(chosen.map((c) => c.i));
    const remaining = shuffle(withIdx.filter((c) => !chosenIdxSet.has(c.i)));
    while (chosen.length < cap && remaining.length) {
      chosen.push(remaining.pop());
    }
  } else {
    chosen = shuffle(withIdx).slice(0, cap);
  }

  chosen = shuffle(chosen);
  return { questions: chosen.map((c) => c.q), indices: chosen.map((c) => c.i) };
}
