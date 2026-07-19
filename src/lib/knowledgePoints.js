// Knowledge Points — the redeemable-for-discount system replacing "XP".
// Points still show as a score in the app, but unlike XP, they convert to a
// real subscription discount when the monthly (or annual) criteria are met.

import { getSupabase } from './supabaseClient';

export const POINTS = {
  QUESTION_CORRECT: 2,          // was 1
  QUESTION_WRONG: -1,           // unchanged — negative marking
  DAILY_QUIZ_COMPLETE: 25,      // was 5
  LESSON_COMPLETE: 15,          // was 5
  WEEKLY_EXAM_COMPLETE: 50,     // new
  BATTLE_DAY: 10,               // new — flat per day, win or lose
};

// Monthly caps — points beyond these limits are silently ignored.
// Natural limits (daily quiz = 1/day, weekly exam = 1/week) need no cap.
export const MONTHLY_CAPS = {
  LESSONS: 20,                  // max 20 lesson completions count per month
  BATTLE: 300,                  // 30 days × 10 = 300 max
  SPEED_DRILL: 50,              // combined answer points from speed drill
  TOPIC_PRACTICE: 50,           // combined answer points from topic practice
  CHALLENGE_MODE: 50,           // combined answer points from challenge mode
};

// Tiers are fixed and capped — 2000 points is the ceiling.
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

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Record a points event — called from Daily Quiz, Lesson Quiz, Practice,
// Battle Mode completion handlers. Fire-and-forget against Supabase; local
// running total is updated synchronously so the UI never waits on network.
export async function awardPoints(userId, amount, source, referenceId = null) {
  if (!userId || amount === 0) return;
  try {
    const sb = await getSupabase();
    await sb.from('knowledge_points_ledger').insert({
      user_id: userId, points: amount, source, reference_id: referenceId,
    });
  } catch (e) {
    console.warn('awardPoints failed (non-critical):', e);
  }
}

// Battle Mode: award +10 only once per calendar day per user.
// Checks the ledger for an existing battle_mode entry today before inserting.
export async function awardBattlePoints(userId) {
  if (!userId) return false;
  try {
    const sb = await getSupabase();
    const today = todayString();
    const { data: existing } = await sb
      .from('knowledge_points_ledger')
      .select('id')
      .eq('user_id', userId)
      .eq('source', 'battle_mode')
      .eq('reference_id', today)
      .maybeSingle();
    if (existing) return false; // already awarded today
    await sb.from('knowledge_points_ledger').insert({
      user_id: userId, points: POINTS.BATTLE_DAY, source: 'battle_mode', reference_id: today,
    });
    return true;
  } catch (e) {
    console.warn('awardBattlePoints failed (non-critical):', e);
    return false;
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

    // --- Apply monthly caps per source category ---
    // Lessons (capped at 20 unique lessons)
    const lessonCompletionIds = new Set(
      ledgerRows.filter(r => r.source === 'lesson_completion').map(r => r.reference_id)
    );
    const reasoningLessonIds = new Set(
      ledgerRows.filter(r => r.source === 'reasoning_lesson_completion').map(r => r.reference_id)
    );
    const cappedLessonCount = Math.min(lessonCompletionIds.size + reasoningLessonIds.size, MONTHLY_CAPS.LESSONS);

    // Practice caps: sum raw points per source, cap each
    const sumSource = (src) => ledgerRows.filter(r => r.source === src).reduce((s, r) => s + r.points, 0);
    const speedDrillPts = Math.min(sumSource('speed_drill'), MONTHLY_CAPS.SPEED_DRILL);
    const topicPracticePts = Math.min(sumSource('topic_practice'), MONTHLY_CAPS.TOPIC_PRACTICE);
    const challengeModePts = Math.min(sumSource('challenge_mode'), MONTHLY_CAPS.CHALLENGE_MODE);

    // Battle: already 1/day enforced at insert time, but also cap total
    const battlePts = Math.min(sumSource('battle_mode'), MONTHLY_CAPS.BATTLE);

    // Daily quiz, weekly exam, lesson quiz answers — no extra cap (natural limits)
    const dailyQuizPts = sumSource('daily_quiz') + sumSource('daily_quiz_complete');
    const weeklyExamPts = sumSource('weekly_exam') + sumSource('weekly_exam_complete');
    const lessonQuizPts = sumSource('lesson_quiz');

    // Lesson completion bonuses: only count up to cap
    const lessonBonusPts = cappedLessonCount * POINTS.LESSON_COMPLETE;

    const totalPoints = Math.max(0,
      dailyQuizPts + weeklyExamPts + lessonQuizPts +
      lessonBonusPts + battlePts +
      speedDrillPts + topicPracticePts + challengeModePts
    );

    const dailyQuizDays = new Set((dailyQuizRes.data || []).map(r => r.quiz_date)).size;
    const dailyQuizPct = (dailyQuizDays / daysInMonth) * 100;
    const weeklyExamsGiven = (weeklyExamRes.data || []).length;
    const allWeeklyExamsGiven = weeklyExamsGiven >= 4;

    const reasoningLessonsThisMonth = reasoningLessonIds.size;
    const mathsLessonsCompleted = lessonCompletionIds.size;

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

    return {
      totalPoints, dailyQuizPct, allWeeklyExamsGiven,
      reasoningLessonsThisMonth, mathsLessonsCompleted,
      criteriaMet, tier,
    };
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
    // First lock record for this subscription — seeded at checkout time.
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
