-- Life Skills modules (Parent/Student/Teacher guidance tracks) — progress sync.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists life_skills_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track text not null,        -- 'parent' | 'student' | 'teacher'
  module_id text not null,    -- e.g. 'parent_m1'
  started_at timestamptz,
  completed_at timestamptz,
  reflection text,
  updated_at timestamptz default now(),
  unique (user_id, track, module_id)
);

alter table life_skills_progress enable row level security;

create policy "Users manage their own life skills progress" on life_skills_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Open read for admin tracking" on life_skills_progress for select using (true);
