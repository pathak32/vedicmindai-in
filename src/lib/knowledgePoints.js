// Knowledge Points — the redeemable-for-discount system replacing "XP".
// Points still show as a score in the app, but unlike XP, they convert to a
// real subscription discount when the monthly (or annual) criteria are met.

import { getSupabase } from './supabaseClient';

export const POINTS = {
  QUESTION_CORRECT: 1,
  QUESTION_WRONG: -1,      // negative marking, applies to lesson quiz, practice, battle mode
  DAILY_QUIZ_COMPLETE: 5,
  LESSON_COMPLETE: 5,
};

// Tiers are fixed and capped — 2000 points is the ceiling, matching the
// max useful discount. No further benefit past this point in a given month.
export const TIERS = [
  { points: 2000, discountPct: 50 },
  { points: 1500, discountPct: 40 },
  { points: 1000, discountPct: 30 },
];

export function getTierForPoints(points) {
  for (const tier of TIERS) {
    if (points >= tier.points) return tier;
  }
  return { points: 0, discountPct: 0 };
}

export function pointsToNextTier(points) {
  const next = [...TIERS].reverse().find(t => points < t.points);
  if (!next) return null; // already at max tier
  return { pointsNeeded: next.points - points, tier: next };
}

function currentMonthYear() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Record a points event — called from Daily Quiz, Lesson Quiz, Practice,
// Battle Mode completion handlers. Fire-and-forget against Supabase; local
// running total is updated synchronously so the UI never waits on network.
export async function awardPoints(userId, amount, source, referenceId = null) {
  if (!userId) return;
  try {
    const sb = await getSupabase();
    await sb.from('knowledge_points_ledger').insert({
      user_id: userId, points: amount, source, reference_id: referenceId,
    });
  } catch (e) {
    console.warn('awardPoints failed (non-critical):', e);
  }
}

// Recalculates the current month's totals and criteria from the ledger +
// actual activity tables, and updates knowledge_points_monthly accordingly.
// Call this after any point-earning event, or on demand when the Knowledge
// Points page loads.
export async function recalculateMonthlyStatus(userId) {
  if (!userId) return null;
  const sb = await getSupabase();
  const monthYear = currentMonthYear();
  const [year, month] = monthYear.split('-').map(Number);
  const monthStart = new Date(year, month - 1, 1).toISOString();
  const monthEnd = new Date(year, month, 0, 23, 59, 59).toISOString();
  const daysInMonth = new Date(year, month, 0).getDate();

  try {
    const [ledgerRes, dailyQuizRes, weeklyExamRes] = await Promise.all([
      sb.from('knowledge_points_ledger').select('points, source, reference_id').eq('user_id', userId)
        .gte('created_at', monthStart).lte('created_at', monthEnd),
      sb.from('daily_quiz_results').select('quiz_date').eq('user_id', userId)
        .gte('quiz_date', monthStart.slice(0, 10)).lte('quiz_date', monthEnd.slice(0, 10)),
      sb.from('weekly_exam_results').select('id').eq('user_id', userId)
        .gte('created_at', monthStart).lte('created_at', monthEnd),
    ]);

    const ledgerRows = ledgerRes.data || [];
    const totalPoints = Math.max(0, ledgerRows.reduce((sum, r) => sum + r.points, 0));
    const dailyQuizDays = new Set((dailyQuizRes.data || []).map(r => r.quiz_date)).size;
    const dailyQuizPct = (dailyQuizDays / daysInMonth) * 100;

    const weeklyExamsGiven = (weeklyExamRes.data || []).length;
    const allWeeklyExamsGiven = weeklyExamsGiven >= 4;

    // Lesson completions THIS MONTH specifically — counted from the ledger
    // (which is timestamped), not from the lifetime-cumulative progress
    // tables. Using those instead would let someone who finished 5 lessons
    // years ago pass this criterion forever, which defeats the point of a
    // monthly re-engagement requirement.
    const reasoningLessonsThisMonth = new Set(
      ledgerRows.filter(r => r.source === 'reasoning_lesson_completion').map(r => r.reference_id)
    ).size;
    const mathsLessonsCompleted = new Set(
      ledgerRows.filter(r => r.source === 'lesson_completion').map(r => r.reference_id)
    ).size;

    const criteriaMet = dailyQuizPct >= 50 && allWeeklyExamsGiven &&
      reasoningLessonsThisMonth >= 5 && mathsLessonsCompleted >= 5;

    const tier = criteriaMet ? getTierForPoints(totalPoints) : { points: 0, discountPct: 0 };

    await sb.from('knowledge_points_monthly').upsert({
      user_id: userId,
      month_year: monthYear,
      total_points: totalPoints,
      daily_quiz_attempted_pct: dailyQuizPct,
      all_weekly_exams_given: allWeeklyExamsGiven,
      reasoning_lessons_completed: reasoningLessonsThisMonth,
      maths_lessons_completed: mathsLessonsCompleted,
      criteria_met: criteriaMet,
      tier_reached: tier.points,
      discount_pct: tier.discountPct,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,month_year' });

    // Annual subscribers: if this month's tier is higher than the locked
    // tier, upgrade the lock. Never downgrades.
    const { data: profile } = await sb.from('profiles').select('plan').eq('id', userId).maybeSingle();
    if (profile?.plan?.includes('_annual')) {
      await upgradeAnnualLockIfHigher(userId, tier);
    }

    return { totalPoints, dailyQuizPct, allWeeklyExamsGiven, reasoningLessonsThisMonth, mathsLessonsCompleted, criteriaMet, tier };
  } catch (e) {
    console.warn('recalculateMonthlyStatus failed:', e);
    return null;
  }
}

async function upgradeAnnualLockIfHigher(userId, tier) {
  const sb = await getSupabase();
  const { data: existing } = await sb.from('knowledge_points_annual_lock')
    .select('*').eq('user_id', userId).order('subscription_start_date', { ascending: false }).limit(1).maybeSingle();

  if (!existing) {
    // First lock record for this subscription — needs subscription_start_date,
    // which should be set when the annual plan is first purchased. Skipping
    // creation here if it doesn't exist; that record should be seeded at
    // checkout time instead (see payment success handler).
    return;
  }
  if (tier.points > existing.locked_tier) {
    await sb.from('knowledge_points_annual_lock').update({
      locked_tier: tier.points,
      locked_discount_pct: tier.discountPct,
      last_updated_month: currentMonthYear(),
      updated_at: new Date().toISOString(),
    }).eq('id', existing.id);
  }
}
