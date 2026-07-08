-- Founding Circle tester roster — the ~20 known testers Hitesh wants to
-- track individually in the admin panel for the closed-testing window.
-- Run this once in Supabase Dashboard → SQL Editor.

create table if not exists founding_circle_testers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text,               -- matched against profiles.mobile to find the real user
  email text,                -- optional, kept for reference only (matching is by mobile)
  notes text,
  added_at timestamptz default now()
);

alter table founding_circle_testers enable row level security;

-- Admin-only access (matches the same admin emails used elsewhere in the app)
create policy "Admin manages founding circle roster"
  on founding_circle_testers for all
  using (auth.jwt() ->> 'email' in ('918573000191@vedicmindai.in','hitesh@vedicmindai.in'));
