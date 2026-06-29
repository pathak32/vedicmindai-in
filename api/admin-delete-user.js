// Vercel Serverless Function — Admin Delete User
// Hard-deletes a user from Supabase Auth + every related table.
// Mirrors the service-role pattern used in admin-create-demo.js.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' });
    }

    const tablesAndColumns = [
      { table: 'progress', column: 'user_id' },
      { table: 'quiz_results', column: 'user_id' },
      { table: 'quiz_question_history', column: 'user_id' },
      { table: 'daily_quiz_results', column: 'user_id' },
      { table: 'weekly_exam_results', column: 'user_id' },
      { table: 'subscriptions', column: 'user_id' },
      { table: 'reviews', column: 'user_id' },
      { table: 'ai_tutor_usage', column: 'user_id' },
      { table: 'demo_logins', column: 'user_id' },
      { table: 'screenless_submissions', column: 'user_id' },
      { table: 'referrals', column: 'user_id' },
      { table: 'affiliate_referrals', column: 'subscriber_id' },
      { table: 'affiliates', column: 'user_id' },
      { table: 'reviewer_accounts', column: 'user_id' },
      { table: 'profiles', column: 'id' },
    ];

    const tableErrors = [];
    for (const { table, column } of tablesAndColumns) {
      const { error } = await supabase.from(table).delete().eq(column, userId);
      if (error) {
        tableErrors.push(`${table}: ${error.message}`);
      }
    }

    // Finally remove the actual auth user. This must happen last —
    // once this succeeds, the user can no longer log in even if some
    // related-table cleanup above had issues.
    const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
    if (authErr) {
      // "User not found" means the auth record was already gone (e.g. an
      // orphaned profile row left over from an earlier manual deletion).
      // That's not a failure from this endpoint's point of view — the table
      // rows above have already been cleaned up, and there's no auth user
      // left to remove. Only treat other auth errors as real failures.
      const isAlreadyGone = /not found/i.test(authErr.message || '');
      if (!isAlreadyGone) {
        return res.status(500).json({
          error: `Failed to delete auth user: ${authErr.message}`,
          tableErrors,
        });
      }
    }

    return res.status(200).json({
      success: true,
      userId,
      tableErrors: tableErrors.length ? tableErrors : undefined,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
