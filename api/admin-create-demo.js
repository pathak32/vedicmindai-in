// Vercel Serverless Function — Admin Demo Login creation
// Moves Supabase admin.createUser() server-side, where it belongs.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password, school, city, contact, days } = req.body;

    if (!email || !password || !school) {
      return res.status(400).json({ error: 'Missing required fields: email, password, school' });
    }

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authErr) {
      return res.status(400).json({ error: authErr.message });
    }

    const userId = authData?.user?.id;
    const expiresAt = new Date(Date.now() + (days || 7) * 86400000).toISOString();

    const { error: demoErr } = await supabase.from('demo_logins').upsert({
      user_id: userId,
      email,
      password_plain: password,
      school_name: school,
      city: city || null,
      contact: contact || null,
      expires_at: expiresAt,
      days: days || 7,
      created_at: new Date().toISOString(),
      is_active: true,
    });

    if (demoErr) {
      console.error('demo_logins upsert error:', demoErr);
    }

    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: `Demo — ${school}`,
      plan: 'demo',
      trial_end_date: expiresAt,
      subscription_status: 'demo',
    }, { onConflict: 'id' });

    if (profileErr) {
      console.error('profiles upsert error:', profileErr);
    }

    return res.status(200).json({ email, password, expiresAt, school });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
