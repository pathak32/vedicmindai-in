// Vercel Serverless Function — Admin: List Demo Logins
// Reads demo_logins using the service role key, server-side only.
// The admin panel itself has no real Supabase auth session (it's accessed
// via a secret URL + PIN, not a Supabase login), so RLS policies that check
// auth.jwt() can never pass for it — they'd silently return zero rows.
// Reading this server-side sidesteps that entirely and keeps the
// service key off the browser, since this table stores plaintext demo
// passwords.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data, error } = await supabase
      .from('demo_logins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ demoLogins: data || [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
