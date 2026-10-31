// Vercel Serverless Function — Daily Quiz question selector
// Picks the 5 Vedic Maths questions of the Daily Quiz for the logged-in user from
// quiz_questions, one per lesson, from their completed lessons (the 'progress' table).
// The page adds 3 Reasoning and 2 Aptitude questions to make the 10 (see dailyQuizEngine.js).
//
// SETUP REQUIRED before this works:
// Vercel -> Settings -> Environment Variables -> add:
//   SUPABASE_SERVICE_ROLE_KEY = <your service_role secret key from Supabase>
// (Already done as of this session — just documenting for future reference.)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';

// Default lesson to use for brand-new users with 0 completed lessons
const DEFAULT_FIRST_LESSON = 'l1_01';

// Total number of questions in each Daily Quiz
const DAILY_QUIZ_QUESTION_COUNT = 5;

// Daily Quiz difficulty target — adjusted to match actual question bank
// distribution which skews medium/hard. Using 40/40/20 until the easy
// bucket is filled out via content expansion (post-launch task).
const DIFFICULTY_TARGET = { easy: 0.4, medium: 0.4, hard: 0.2 };

function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server');
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Given a target difficulty mix and a total count, compute how many
// questions of each difficulty to request. Always returns counts that
// sum exactly to totalCount (remainder goes to 'easy').
function computeDifficultyCounts(totalCount, mix) {
  const easyCount = Math.round(totalCount * mix.easy);
  const mediumCount = Math.round(totalCount * mix.medium);
  let hardCount = totalCount - easyCount - mediumCount;
  if (hardCount < 0) hardCount = 0;
  return { easy: easyCount, medium: mediumCount, hard: hardCount };
}

// Weighted-random pick favoring lower used_count, without fully
// blocking any question (per the "flexible repeat tolerance" decision).
function weightedPick(pool, count) {
  if (pool.length === 0) return [];
  const maxUsed = Math.max(...pool.map(q => q.used_count || 0));
  // Give every question a weight; lower used_count = higher weight.
  const weighted = pool.map(q => ({
    q,
    weight: (maxUsed - (q.used_count || 0)) + 1, // +1 so nothing has zero weight
  }));

  const picked = [];
  const remaining = [...weighted];
  const n = Math.min(count, remaining.length);

  for (let i = 0; i < n; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * totalWeight;
    let idx = 0;
    for (; idx < remaining.length; idx++) {
      r -= remaining[idx].weight;
      if (r <= 0) break;
    }
    idx = Math.min(idx, remaining.length - 1);
    picked.push(remaining[idx].q);
    remaining.splice(idx, 1);
  }
  return picked;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const supabase = getSupabaseAdmin();

    // 1. Get the user's completed lessons from the progress table
    const { data: progressRow, error: progressError } = await supabase
      .from('progress')
      .select('completed_lessons')
      .eq('user_id', user_id)
      .maybeSingle();

    if (progressError) {
      return res.status(500).json({ error: 'Failed to load progress', details: progressError.message });
    }

    let completedLessons = progressRow?.completed_lessons || [];
    if (!Array.isArray(completedLessons) || completedLessons.length === 0) {
      // Brand-new user — give them questions from the very first lesson
      completedLessons = [DEFAULT_FIRST_LESSON];
    }

    // 2. Figure out how many of each difficulty we need
    const counts = computeDifficultyCounts(DAILY_QUIZ_QUESTION_COUNT, DIFFICULTY_TARGET);

    // 3. Pull approved questions for these lessons, eligible for 'daily' or 'both'
    const { data: candidatePool, error: poolError } = await supabase
      .from('quiz_questions')
      .select('*')
      .in('lesson_id', completedLessons)
      .in('quiz_type', ['daily', 'both'])
      .eq('status', 'approved');

    if (poolError) {
      return res.status(500).json({ error: 'Failed to load questions', details: poolError.message });
    }

    let pool = candidatePool || [];

    // A learner with fewer than 5 lessons done would otherwise get every question
    // from one or two lessons. Fill the gap with the next lessons in order.
    const lessonIdsIn = (rows) => [...new Set(rows.map(q => q.lesson_id))];
    if (lessonIdsIn(pool).length < DAILY_QUIZ_QUESTION_COUNT) {
      const { data: extraPool, error: extraError } = await supabase
        .from('quiz_questions')
        .select('*')
        .not('lesson_id', 'in', `(${completedLessons.join(',')})`)
        .in('quiz_type', ['daily', 'both'])
        .eq('status', 'approved')
        .order('lesson_id', { ascending: true })
        .limit(400);
      if (!extraError && extraPool?.length) {
        const wanted = lessonIdsIn(extraPool).slice(0, DAILY_QUIZ_QUESTION_COUNT - lessonIdsIn(pool).length);
        pool = pool.concat(extraPool.filter(q => wanted.includes(q.lesson_id)));
      }
    }

    if (pool.length === 0) {
      return res.status(404).json({ error: 'No approved questions available for this user yet' });
    }

    // 4. One question per lesson so the quiz covers different topics: shuffle the
    //    lessons, give each of the 5 slots its own lesson and its target difficulty,
    //    and take the least-used question of that difficulty (any difficulty if none).
    const byLesson = new Map();
    for (const q of pool) {
      if (!byLesson.has(q.lesson_id)) byLesson.set(q.lesson_id, []);
      byLesson.get(q.lesson_id).push(q);
    }
    const lessonOrder = [...byLesson.keys()];
    for (let i = lessonOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lessonOrder[i], lessonOrder[j]] = [lessonOrder[j], lessonOrder[i]];
    }
    const slotDifficulties = [
      ...Array(counts.easy).fill('easy'),
      ...Array(counts.medium).fill('medium'),
      ...Array(counts.hard).fill('hard'),
    ];

    let selected = [];
    const pickedIds = new Set();
    for (let slot = 0; slot < DAILY_QUIZ_QUESTION_COUNT; slot++) {
      // Lessons repeat only when fewer than 5 lessons have questions.
      const lessonQs = byLesson.get(lessonOrder[slot % lessonOrder.length]).filter(q => !pickedIds.has(q.id));
      const sameDifficulty = lessonQs.filter(q => q.difficulty === slotDifficulties[slot]);
      const [q] = weightedPick(sameDifficulty.length ? sameDifficulty : lessonQs, 1);
      if (q) { selected.push(q); pickedIds.add(q.id); }
    }

    // If a lesson ran dry, top up from whatever remains in the pool.
    if (selected.length < DAILY_QUIZ_QUESTION_COUNT) {
      const leftover = pool.filter(q => !pickedIds.has(q.id));
      selected = selected.concat(weightedPick(leftover, DAILY_QUIZ_QUESTION_COUNT - selected.length));
    }

    // Shuffle final order so difficulty isn't always in the same sequence
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    // 5. Increment used_count for every question actually served
    const servedIds = selected.map(q => q.id);
    if (servedIds.length > 0) {
      // Fire-and-forget style update per question (small counts, fine to await)
      await Promise.all(
        selected.map(q =>
          supabase
            .from('quiz_questions')
            .update({ used_count: (q.used_count || 0) + 1 })
            .eq('id', q.id)
        )
      );

      // 6. Log this serving in quiz_question_history for repeat-avoidance
      const historyRows = servedIds.map(id => ({
        user_id,
        question_id: id,
        quiz_type: 'daily',
      }));
      await supabase.from('quiz_question_history').insert(historyRows);
    }

    // 7. Shape the response for the frontend (hide correct_answer letter
    //    mapping logic stays server-side until the answer is submitted —
    //    but for now we include it since the existing frontend checks
    //    correctness client-side, matching current app behavior).
    const formatted = selected.map(q => {
      const options = [q.option_a, q.option_b, q.option_c, q.option_d];
      const correctIndex = ['a', 'b', 'c', 'd'].indexOf(q.correct_answer);
      return {
        id: q.id,
        question: q.question_text,
        options,
        correctIndex,
        difficulty: q.difficulty,
        lessonId: q.lesson_id,
        explanation: q.explanation || null,
      };
    });

    return res.status(200).json({ questions: formatted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}