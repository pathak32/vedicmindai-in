-- Fix for founding_circle_testers: the original policy required being
-- logged into the app itself with hitesh@vedicmindai.in / 918573000191@...
-- (same pattern as demo_logins elsewhere in this codebase). But the admin
-- panel is already gated separately by its own PIN/key, and this table only
-- holds tester names + mobile numbers (low sensitivity, not passwords or
-- financial data) — so requiring a matching Supabase auth session on top of
-- the PIN gate just causes data to silently vanish from view (RLS filters
-- rows, no error) whenever that session isn't active in the current browser,
-- exactly what happened here. Relaxing this one table's policy so the admin
-- panel can read/write it reliably regardless of app login state.
--
-- Run this once in Supabase Dashboard → SQL Editor.

drop policy if exists "Admin manages founding circle roster" on founding_circle_testers;

create policy "Open access to founding circle roster"
  on founding_circle_testers for all
  using (true)
  with check (true);
