// Vercel Cron Job — Daily Progress Snapshot Backup
//
// WHY THIS EXISTS:
// 28-Jul-2026 incident — a bug in the app's read path caused a user's real
// Vedic Maths progress (17-18 completed chapters) to be silently overwritten
// with an almost-empty record. The Supabase project is on the Free tier,
// which has NO automatic backups at all, so there was no way to restore the
// real data except by reconstructing it from a separate permanent ledger
// table that happened to still hold the history.
//
// This is the missing safety net: once a day, snapshot every row in the
// tables that matter most (progress, reasoning_progress, aptitude_progress)
// into an append-only backup table. If a future bug corrupts a live row
// again, yesterday's snapshot is sitting right there to restore from — no
// archaeology required.
//
// SCOPE / LIMITATION: this protects against app-level bugs overwriting
// specific rows (exactly what happened here). It does NOT protect against
// whole-database loss (a deleted project, a botched migration wiping a
// whole table, etc.) — that class of risk needs Supabase's own
// Point-in-Time Recovery, which requires upgrading off the Free plan.
// This is the free, immediate stopgap; the paid option is a separate,
// bigger safety net worth considering later.
//
// SETUP REQUIRED (cannot be done from code — see accompanying instructions):
// 1. Run the SQL in /supabase-migrations/001-progress-snapshots.sql once,
//    in the Supabase SQL editor, to create the progress_snapshots table.
// 2. This function reuses the existing SUPABASE_SERVICE_ROLE_KEY Vercel env
//    var (already set up for razorpay-webhook.js) — no new secret needed.
// 3. vercel.json's "crons" entry triggers this once daily automatically
//    once deployed — no manual scheduling needed beyond that.

import { createClient } from '@supabase/supabase-js';


// ── Founding 500 Monthly XP Check ───────────────────────────────────────────
async function checkFoundingMemberXP(sb) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  // Get founding members due for XP check (last check > 30 days ago, billing_month >= 2)
  const { data: members } = await sb
    .from('founding_members')
    .select('user_id, billing_month, last_xp_check')
    .eq('is_active', true)
    .gte('billing_month', 2)
    .or(`last_xp_check.is.null,last_xp_check.lt.${thirtyDaysAgo}`);

  if (!members || members.length === 0) return { checked: 0 };

  let checked = 0;
  for (const member of members) {
    try {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      // Sum XP earned in last 30 days from xp_transactions table
      const { data: xpData } = await sb
        .from('xp_transactions')
        .select('amount')
        .eq('user_id', member.user_id)
        .gte('created_at', since);

      const totalXP = (xpData || []).reduce((sum, r) => sum + (r.amount || 0), 0);
      const qualifies = totalXP >= 200;

      if (!qualifies) {
        // XP too low — exit from founding programme
        await sb.from('founding_members').update({
          is_active: false,
          exited_reason: 'low_xp',
          exited_at: new Date().toISOString(),
          last_month_xp: totalXP,
        }).eq('user_id', member.user_id);

        // Downgrade to regular basic plan
        await sb.from('profiles').update({ planStatus: 'basic' }).eq('id', member.user_id);
      } else {
        // XP qualifies — update last check
        await sb.from('founding_members').update({
          last_xp_check: new Date().toISOString(),
          last_month_xp: totalXP,
          billing_month: member.billing_month + 1,
        }).eq('user_id', member.user_id);
      }
      checked++;
    } catch (e) {
      console.error('XP check failed for', member.user_id, e.message);
    }
  }
  return { checked };
}

export default async function handler(req, res) {
  // Vercel Cron sends a GET request with this header — reject anything else
  // so this endpoint can't be triggered by a random public request.
  const isVercelCron = req.headers['x-vercel-cron'] || req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`;
  if (!isVercelCron && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const snapshotDate = new Date().toISOString().split('T')[0];
  const results = {};

  try {
    const tables = ['progress', 'reasoning_progress', 'aptitude_progress'];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        results[table] = { error: error.message };
        continue;
      }
      if (!data || data.length === 0) {
        results[table] = { rows: 0 };
        continue;
      }

      const snapshotRows = data.map(row => ({
        snapshot_date: snapshotDate,
        source_table: table,
        user_id: row.user_id,
        row_data: row,
      }));

      // One snapshot per user per table per day — re-running the same day
      // (e.g. a manual re-trigger) just replaces that day's snapshot rather
      // than duplicating it.
      const { error: insertErr } = await supabase
        .from('progress_snapshots')
        .upsert(snapshotRows, { onConflict: 'snapshot_date,source_table,user_id' });

      results[table] = insertErr ? { error: insertErr.message } : { rows: snapshotRows.length };
    }

    // Prune snapshots older than 30 days so this doesn't grow forever.
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    await supabase.from('progress_snapshots').delete().lt('snapshot_date', cutoff.toISOString().split('T')[0]);

    return res.status(200).json({ ok: true, date: snapshotDate, results });
  } catch (e) {
    console.error('backup-progress-snapshot failed:', e);
    return res.status(500).json({ error: e.message });
  }
}
