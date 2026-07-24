import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';

const SESSION_KEY = 'vm_visitor_session_id';
const HEARTBEAT_INTERVAL_MS = 45_000; // 45s — keeps "live now" fresh without hammering the DB

function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// The Android TWA (package in.vedicmindai.app) sets document.referrer to
// "android-app://in.vedicmindai.app" when it launches a page — a regular
// browser visit never produces this. document.referrer is fixed for the
// lifetime of the document load, so this only needs to be read once.
function detectPlatform() {
  return document.referrer && document.referrer.startsWith('android-app://') ? 'app' : 'web';
}

// Mounted once at the top of App.jsx. Tracks anonymous site visitors
// (logged in or not) for the admin panel's Live Visitors / Today's
// Visitors stats — separate from `profiles`, which only covers accounts
// that actually registered.
export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // Don't count the owner's own admin-panel visits as public site traffic
    if (location.pathname.startsWith('/admin-panel')) return;

    const sessionId = getOrCreateSessionId();
    const platform = detectPlatform();

    async function ping() {
      try {
        const sb = await getSupabase();
        await sb.from('site_visits').upsert(
          {
            session_id: sessionId,
            last_seen_at: new Date().toISOString(),
            page_path: window.location.pathname,
            platform,
          },
          { onConflict: 'session_id' }
        );
      } catch (e) {
        // Non-critical — never let tracking errors affect the actual app
        console.error('Visitor tracking ping failed:', e);
      }
    }

    ping(); // immediate ping on mount / route change
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return null;
}
