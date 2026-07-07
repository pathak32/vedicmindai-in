// Vercel Serverless Function — Admin Reset Password
// Directly sets a user's password using the service role key.
//
// Why this exists: accounts use mobile-number-as-fake-email
// (e.g. 919565524546@vedicmindai.in), so Supabase's normal
// "send password reset email" flow is useless here — there's no real
// inbox behind that address. This lets the PIN-gated Admin Panel set a
// known password directly, the same way AdminReviewerAccess creates
// accounts and admin-delete-user removes them.
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
    const { userId, newPassword } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing required field: userId' });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'newPassword must be at least 6 characters' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true, userId: data.user.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
