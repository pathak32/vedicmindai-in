-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query
-- → paste this whole file → Run). Safe to run exactly once; re-running is
-- harmless (IF NOT EXISTS guards everything).
--
-- Creates the backup table that api/backup-progress-snapshot.js writes to
-- once a day via Vercel Cron. This table has no existing readers anywhere
-- in the app, so — unlike the live progress/reasoning_progress/
-- aptitude_progress tables — it's safe to lock down with RLS from the
-- start: only the service role (used server-side by the cron job) can
-- touch it, nobody else, by design.

CREATE TABLE IF NOT EXISTS progress_snapshots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  source_table  text NOT NULL,
  user_id       uuid NOT NULL,
  row_data      jsonb NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snapshot_date, source_table, user_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_snapshots_user
  ON progress_snapshots (user_id, source_table, snapshot_date DESC);

ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;
-- Deliberately NO policies added. With RLS on and zero policies, only
-- the service role (which bypasses RLS entirely) can read or write —
-- exactly right for a backup table nothing in the client app should
-- ever touch directly.
