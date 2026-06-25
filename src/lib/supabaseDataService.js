import { getSupabase } from './supabaseClient';

// ─── USER PROFILE ────────────────────────────────────────────────────────────

export async function getUserProfile(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('getUserProfile:', error);
  return data || {};
}

// Fetches plan/subscription_status from the `profiles` table — the table
// VedicAuthContext actually writes to on signup, payment activation, and
// admin-granted access. This is separate from `users` (read by
// getUserProfile above) and is the real source of truth for plan gating.
// Added 25-Jun-2026: planEngine.js's getUserPlan() reads progress.plan from
// localStorage only, and nothing was syncing it from here — meaning plan
// upgrades only ever "stuck" if set on the exact device that made the
// Razorpay payment. This closes that gap.
export async function getPlanProfile(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('plan, subscription_status, trial_end_date')
    .eq('id', userId)
    .maybeSingle();
  if (error) console.error('getPlanProfile:', error);
  return data || null;
}

export async function saveUserProfile(userId, profile) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('users')
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
  if (error) console.error('saveUserProfile:', error);
  return !error;
}

// ─── USER PROGRESS ───────────────────────────────────────────────────────────

export async function getUserProgress(userId) {
  const supabase = await getSupabase();
  // progress.id is the table's own primary key (unrelated to any user) —
  // progress.user_id is the actual foreign key to the logged-in user, and
  // it's UNIQUE (one progress row per user). Filtering on .eq('id', userId)
  // here was matching the wrong column entirely; it returned no row for
  // any real user and silently fell through to the all-zero default below
  // every single time, on every dashboard load, app-wide.
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('getUserProgress:', error);
  return data || {
    completed_lessons: [],
    lesson_scores: {},
    total_xp: 0,
    streak: 0,
    badges: [],
    current_level: 1,
    daily_quiz_streak: 0,
    daily_quiz_history: [],
  };
}

export async function saveUserProgress(userId, progress) {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      completed_lessons: progress.completedLessons || progress.completed_lessons || [],
      lesson_scores: progress.lessonScores || progress.lesson_scores || {},
      total_xp: progress.totalXP ?? progress.total_xp ?? 0,
      streak: progress.streak ?? 0,
      badges: progress.badges || [],
      current_level: progress.currentLevel ?? progress.current_level ?? 1,
      daily_quiz_streak: progress.dailyQuizStreak ?? progress.daily_quiz_streak ?? 0,
      last_activity_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) console.error('saveUserProgress:', error);
  return !error;
}

// ─── DAILY QUIZ HISTORY ──────────────────────────────────────────────────────

export async function getDailyQuizHistory(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('daily_quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('quiz_date', { ascending: false })
    .limit(30);
  if (error) console.error('getDailyQuizHistory:', error);
  return data || [];
}

// For the Reviewer Activity view in Admin Panel — every general quiz
// attempt (Tier/lesson quizzes, not the daily quiz) by a specific user.
export async function getQuizResultsByUser(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) console.error('getQuizResultsByUser:', error);
  return data || [];
}

// For the Reviewer Activity view — weekly exam attempts by a specific user.
export async function getWeeklyExamResultsByUser(userId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('weekly_exam_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) console.error('getWeeklyExamResultsByUser:', error);
  return data || [];
}

export async function saveDailyQuizResult(userId, result) {
  const supabase = await getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('daily_quiz_results')
    .upsert({
      user_id: userId,
      quiz_date: today,
      score: result.score || 0,
      total_possible: result.totalPossible || 110,
      answers: result.answers || [],
      time_taken: result.timeTaken || 0,
      rank: result.rank || null,
    }, { onConflict: 'user_id,quiz_date' });
  if (error) console.error('saveDailyQuizResult:', error);
  return !error;
}

export async function getTodayQuizResult(userId) {
  const supabase = await getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_quiz_results')
    .select('*')
    .eq('user_id', userId)
    .eq('quiz_date', today)
    .single();
  if (error && error.code !== 'PGRST116') console.error('getTodayQuizResult:', error);
  return data || null;
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

export async function getLeaderboard(classGroup = 'class_a') {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('progress')
    .select('id, total_xp, streak, users!inner(name, class_group)')
    .eq('users.class_group', classGroup)
    .order('total_xp', { ascending: false })
    .limit(50);
  if (error) console.error('getLeaderboard:', error);
  return data || [];
}

// ─── MIGRATE localStorage → Supabase (one-time on login) ────────────────────

export async function migrateLocalStorageToSupabase(userId) {
  try {
    // Check if already migrated
    const migrated = localStorage.getItem('vedicmind_supabase_migrated');
    if (migrated) return;

    const profile = JSON.parse(localStorage.getItem('vedicmind_profile') || '{}');
    const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');

    // Save profile if exists
    if (Object.keys(profile).length > 0) {
      await saveUserProfile(userId, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        goal: profile.goal,
        class_group: profile.classGroup || 'class_a',
        subscription_status: profile.subscriptionStatus || 'trial',
        payment_status: profile.paymentStatus,
        ai_analysis: profile.aiAnalysis || {},
      });
    }

    // Save progress if exists
    if (Object.keys(progress).length > 0) {
      await saveUserProgress(userId, progress);

      // Migrate daily quiz history
      const quizHistory = progress.dailyQuizHistory || [];
      if (quizHistory.length > 0) {
        const supabase = await getSupabase();
        for (const entry of quizHistory.slice(0, 30)) {
          await supabase.from('daily_quiz_results').upsert({
            user_id: userId,
            quiz_date: entry.date,
            score: entry.score || 0,
            total_possible: entry.totalPossible || 110,
            answers: entry.answers || [],
          }, { onConflict: 'user_id,quiz_date' });
        }
      }
    }

    localStorage.setItem('vedicmind_supabase_migrated', 'true');
    console.log('✅ localStorage migrated to Supabase');
  } catch (e) {
    console.error('Migration error:', e);
  }
}