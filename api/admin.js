// api/admin.js — Unified admin serverless function
// Consolidates 4 separate admin endpoints into 1 to stay within
// Vercel Hobby plan's 12-function limit.
// Route by ?action= query param:
//   create-demo       → POST  (was /api/admin-create-demo)
//   delete-user       → POST  (was /api/admin-delete-user)
//   list-demo-logins  → GET   (was /api/admin-list-demo-logins)
//   reset-password    → POST  (was /api/admin-reset-password)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;
  if (!action) return res.status(400).json({ error: 'Missing ?action= param' });

  try {
    // ── create-demo ───────────────────────────────────────────────
    if (action === 'create-demo') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { mobile, name, password } = req.body;
      if (!mobile || !password) return res.status(400).json({ error: 'mobile and password required' });
      const email = `demo_${mobile}@vedicmindai.in`;
      const { data, error } = await supabase.auth.admin.createUser({
        email, password,
        user_metadata: { name: name || 'Demo User', mobile, isDemo: true },
        email_confirm: true,
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user: data.user });
    }

    // ── delete-user ───────────────────────────────────────────────
    if (action === 'delete-user') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId required' });
      const tables = ['progress','quiz_results','daily_quiz_results','weekly_exam_results','reasoning_progress','olympiad_results','profiles'];
      for (const t of tables) {
        await supabase.from(t).delete().eq('user_id', userId).catch(() => {});
      }
      await supabase.from('profiles').delete().eq('id', userId).catch(() => {});
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    // ── list-demo-logins ──────────────────────────────────────────
    if (action === 'list-demo-logins') {
      if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
      const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
      if (error) return res.status(400).json({ error: error.message });
      const demos = (data.users || []).filter(u => u.user_metadata?.isDemo);
      return res.status(200).json({ users: demos });
    }

    // ── reset-password ────────────────────────────────────────────
    if (action === 'reset-password') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) return res.status(400).json({ error: 'userId and newPassword required' });
      const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });

  } catch (e) {
    console.error('admin handler error:', e);
    return res.status(500).json({ error: e.message });
  }
}
