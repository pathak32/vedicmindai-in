-- Adds platform (web vs app) tracking to the existing site_visits table.
-- Run this once in the Supabase SQL editor, after the original
-- site_visits_schema.sql has already been run.
--
-- Detection: when the Android TWA (package in.vedicmindai.app) launches a
-- page, document.referrer is set to "android-app://in.vedicmindai.app" —
-- a value a regular browser visit never produces. That's captured
-- client-side in src/lib/visitorTracking.jsx and stored here.

ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS platform text NOT NULL DEFAULT 'web';

CREATE INDEX IF NOT EXISTS site_visits_platform_idx ON site_visits (platform);
