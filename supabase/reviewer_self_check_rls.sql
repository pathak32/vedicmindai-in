-- The app now needs to check "is the CURRENTLY LOGGED IN user a reviewer?"
-- from LearnSidebar (regular user session, not the admin panel), to bypass
-- sequential lesson unlocking for reviewer accounts like Mr. Ray's. The
-- existing RLS on reviewer_accounts (same admin-only pattern used elsewhere
-- in this codebase) only allows the two admin emails to read it — a regular
-- user querying for their own row would be silently filtered to zero rows,
-- making the bypass never activate. Adding a policy that lets a user read
-- (SELECT only) their own row by matching auth.uid() = user_id.
--
-- Run this once in Supabase Dashboard → SQL Editor.

create policy "Users can check their own reviewer status"
  on reviewer_accounts for select
  using (auth.uid() = user_id);
