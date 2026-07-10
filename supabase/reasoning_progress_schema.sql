-- Reasoning chapter progress — syncs what's currently localStorage-only so
-- it survives device changes and shows up in the Founding Circle Tracker.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists reasoning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null,
  best_score integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz default now(),
  unique (user_id, chapter_id)
);

alter table reasoning_progress enable row level security;

-- Users can read/write their own rows (normal app usage).
create policy "Users manage their own reasoning progress"
  on reasoning_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Open read for admin tracking (Founding Circle Tracker etc.) — same
-- deliberate tradeoff already made for daily_quiz_results and friends today:
-- reliability during closed beta over stricter access, revisit before public launch.
create policy "Open read for admin tracking" on reasoning_progress for select using (true);
