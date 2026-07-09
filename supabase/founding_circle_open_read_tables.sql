-- The Founding Circle Tracker (and Live Today tab) read from these five
-- tables to compute per-tester daily activity. Like founding_circle_testers
-- before this fix, reads here likely depend on RLS policies that only allow
-- a row's owner (auth.uid() = user_id) or a specific logged-in admin session
-- to see data — which is why this worked once (when Hitesh happened to have
-- an active app login in that browser tab) and then silently went back to
-- showing zeros for everyone once that session wasn't active. RLS filtering
-- returns zero rows with NO error, which is why no error banner ever showed.
--
-- HONEST TRADEOFF: this makes these tables readable via the public anon key,
-- which is embedded in the frontend JS bundle. For a closed 20-person beta
-- with no payment/password data in these specific tables (just lesson IDs
-- and quiz scores), this is a reasonable short-term tradeoff to get reliable
-- admin visibility. Before a public launch, this should be replaced with a
-- proper server-side admin endpoint using a service role key instead of
-- broadening anon access — flagging this now so it isn't forgotten later.
--
-- Run this once in Supabase Dashboard → SQL Editor.

drop policy if exists "select_own_progress" on progress;
create policy "Open read for admin tracking" on progress for select using (true);

drop policy if exists "select_own_daily_quiz" on daily_quiz_results;
create policy "Open read for admin tracking" on daily_quiz_results for select using (true);

drop policy if exists "select_own_quiz_results" on quiz_results;
create policy "Open read for admin tracking" on quiz_results for select using (true);

drop policy if exists "select_own_weekly_exam" on weekly_exam_results;
create policy "Open read for admin tracking" on weekly_exam_results for select using (true);

drop policy if exists "select_own_battle_rooms" on battle_rooms;
create policy "Open read for admin tracking" on battle_rooms for select using (true);
