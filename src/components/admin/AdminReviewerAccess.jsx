import React, { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

// ─── Reviewer Accounts ───────────────────────────────────────────────────────
// For real people you want to have a permanent, full-access identity in the
// app — instructors, partners, advisors you're courting for a relationship
// (e.g. Ray in Tokyo) — as opposed to AdminDemoLogin.jsx, which is built for
// time-boxed school trials (random throwaway email, expires_at, plan:'demo').
//
// Differences from Demo Login, deliberately:
//   - Real mobile number + a real, memorable password (not a random string)
//   - No expires_at / trial_end_date — this account does not expire
//   - plan: 'family' (full app, no tier walls) + subscription_status: 'active'
//   - Tracked in its own reviewer_accounts table so these are never confused
//     with demo-school records or accidentally swept up by demo cleanup
//
// Uses real signUp() (not auth.admin.createUser) because the browser client
// only ever holds the anon key here — same constraint AdminDemoLogin runs
// into. This is safe to call from the Admin Panel because that page is
// PIN-gated and never holds its own Supabase session, so this signUp can't
// hijack anything.

// IMPORTANT: this must match the login page's fakeEmail exactly. The login
// page (VedicAuthContext.signInWithPassword) always builds mobile as
// `${countryCode}${localNumber}` (e.g. "+919565524546") BEFORE stripping to
// digits. This form only ever collects Indian numbers, so we must prepend
// +91 here too — otherwise the auth user we create here
// ("9565524546@vedicmindai.in") never matches what login looks up
// ("919565524546@vedicmindai.in") and the account is permanently unloginable
// regardless of password.
const mobileToEmail = (mobile) => {
  const digits = `91${mobile.replace(/\D/g, '')}`;
  return `${digits}@vedicmindai.in`;
};

export default function AdminReviewerAccess() {
  const [form, setForm] = useState({ name: '', mobile: '', password: '', notes: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [tab, setTab] = useState('create');
  // When createReviewer() finds an existing account on that mobile number,
  // this holds what we found so the admin can see who it is and confirm
  // before we touch their data — never upgrade silently.
  const [existingAccount, setExistingAccount] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [resettingPw, setResettingPw] = useState(false);
  const [pwResetResult, setPwResetResult] = useState(null);

  async function createReviewer() {
    setError('');
    setResult(null);
    if (!form.name.trim()) { setError('Enter a name'); return; }
    if (!/^\d{10}$/.test(form.mobile.trim())) { setError('Enter a valid 10-digit mobile number'); return; }
    if (!form.password || form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const sb = await getSupabase();
      const fakeEmail = mobileToEmail(form.mobile);

      // 0. Check for an existing account FIRST, before ever calling signUp().
      // Supabase's duplicate-email error is inconsistent — sometimes it's
      // "User already registered", but for accounts with an existing
      // confirmed identity it can instead return a generic
      // "Database error saving new user", which used to slip past the
      // string-matching below and surface as a confusing raw failure.
      // Checking profiles directly means we never have to guess which
      // error message Supabase feels like returning.
      const { data: preExisting } = await sb
        .from('profiles')
        .select('id, name, full_name, plan, subscription_status, mobile')
        .eq('mobile', `+91${form.mobile.trim()}`)
        .maybeSingle();

      if (preExisting) {
        setExistingAccount({
          ...preExisting,
          mobileEntered: form.mobile.trim(),
          requestedName: form.name,
          requestedNotes: form.notes,
        });
        setLoading(false);
        return;
      }

      // 1. Create the real auth user (same signup path real users go through)
      const { data: signUpData, error: signUpErr } = await sb.auth.signUp({
        email: fakeEmail,
        password: form.password,
        options: { emailRedirectTo: undefined, data: { name: form.name, mobile: form.mobile } },
      });

      let userId = signUpData?.user?.id;

      if (signUpErr) {
        // Fallback safety net, in case Supabase has an account under this
        // email that isn't reflected in profiles (e.g. profile row missing).
        if (/already registered|already exists|database error saving new user/i.test(signUpErr.message)) {
          const { data: existing } = await sb
            .from('profiles')
            .select('id, name, full_name, plan, subscription_status, mobile')
            .eq('mobile', `+91${form.mobile.trim()}`)
            .maybeSingle();
          setExistingAccount({
            ...(existing || {}),
            mobileEntered: form.mobile.trim(),
            requestedName: form.name,
            requestedNotes: form.notes,
          });
          setLoading(false);
          return;
        }
        throw new Error(signUpErr.message);
      }
      if (!userId) throw new Error('Account creation failed — no user ID returned.');

      // 2. Write profile with permanent full access, no expiry.
      // IMPORTANT: this must run BEFORE signing out — profiles' own RLS
      // policy ("Users can insert own profile") requires auth.uid() = id,
      // which only holds while still authenticated as the user signUp()
      // just created. Signing out first makes auth.uid() NULL and this
      // insert silently fails its row-level check every time.
      const { error: profileErr } = await sb.from('profiles').upsert({
        id: userId,
        full_name: form.name,
        name: form.name,
        mobile: `+91${form.mobile.trim()}`,
        plan: 'family',
        plan_type: 'family',
        subscription_status: 'active',
        trial_end_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
      if (profileErr) {
        await sb.auth.signOut().catch(() => {});
        throw new Error('Profile setup failed: ' + profileErr.message);
      }

      // signUp() automatically authenticated this browser AS the new user.
      // Now that the profile write (which needed that session) is done,
      // sign back out — the Admin Panel should never stay logged in as
      // someone else's account, and the remaining write below runs as
      // anon, matching the RLS policy set up for reviewer_accounts.
      await sb.auth.signOut();

      // 3. Track separately from demo_logins. Account already works at this
      // point (auth user + profile are real) — a failure here only means
      // it won't show in the "View All" list, so warn rather than throw.
      const { error: trackErr } = await sb.from('reviewer_accounts').upsert({
        user_id: userId,
        name: form.name,
        mobile: `+91${form.mobile.trim()}`,
        password_plain: form.password,
        notes: form.notes,
        created_at: new Date().toISOString(),
        is_active: true,
      });

      setResult({
        name: form.name,
        mobile: form.mobile,
        password: form.password,
        trackingWarning: trackErr ? trackErr.message : null,
      });
      setForm({ name: '', mobile: '', password: '', notes: '' });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // Upgrades an account that already existed (found via the lookup in
  // createReviewer above) to full reviewer-style access — WITHOUT ever
  // touching their password or auth identity. Only the plan/profile fields
  // change. The admin has already seen who this is and confirmed via the
  // UI before this runs.
  async function upgradeExisting() {
    if (!existingAccount?.id) { setError('No existing account ID to upgrade.'); return; }
    setUpgrading(true);
    setError('');
    try {
      const sb = await getSupabase();
      const { error: profileErr } = await sb.from('profiles').update({
        plan: 'family',
        plan_type: 'family',
        subscription_status: 'active',
        trial_end_date: null,
        updated_at: new Date().toISOString(),
      }).eq('id', existingAccount.id);
      if (profileErr) throw new Error('Upgrade failed: ' + profileErr.message);

      const { error: trackErr } = await sb.from('reviewer_accounts').upsert({
        user_id: existingAccount.id,
        name: existingAccount.requestedName || existingAccount.name || existingAccount.full_name,
        mobile: existingAccount.mobile || `+91${existingAccount.mobileEntered}`,
        password_plain: '(existing password unchanged — ask user or use Forgot Password)',
        notes: existingAccount.requestedNotes,
        created_at: new Date().toISOString(),
        is_active: true,
      });

      setResult({
        name: existingAccount.requestedName || existingAccount.name || existingAccount.full_name,
        mobile: existingAccount.mobileEntered,
        password: null,
        upgraded: true,
        trackingWarning: trackErr ? trackErr.message : null,
      });
      setExistingAccount(null);
      setForm({ name: '', mobile: '', password: '', notes: '' });
    } catch (e) {
      setError(e.message);
    }
    setUpgrading(false);
  }

  // Directly sets a password for an already-existing account (found via the
  // lookup above). Needed because these accounts use a mobile-number fake
  // email, so Supabase's normal "email a reset link" flow has no real inbox
  // to deliver to. Uses the service-role admin-reset-password endpoint.
  async function resetPassword() {
    if (!existingAccount?.id) { setError('No existing account ID to reset.'); return; }
    if (!form.password || form.password.length < 6) {
      setError('Enter a password (min 6 chars) in the Password field above, then click Reset Password.');
      return;
    }
    setResettingPw(true);
    setError('');
    try {
      const res = await fetch('/api/admin-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: existingAccount.id, newPassword: form.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Reset failed');
      setPwResetResult(form.password);
    } catch (e) {
      setError(e.message);
    }
    setResettingPw(false);
  }

  async function loadList() {
    const sb = await getSupabase();
    const { data, error } = await sb.from('reviewer_accounts').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) { setError('Could not load list: ' + error.message + ' (the reviewer_accounts table may not exist yet — see note below)'); return; }
    setList(data || []);
  }

  const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
  const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none' };
  const btn = (c = '#1e40af') => ({ padding: '9px 20px', borderRadius: 9, background: c, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 4, border: '1px solid #E5E7EB', marginBottom: 16, width: 'fit-content' }}>
        {['create', 'list'].map(tb => (
          <button key={tb} onClick={() => { setTab(tb); if (tb === 'list') loadList(); }}
            style={{ padding: '7px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: tab === tb ? '#0A1628' : 'transparent', color: tab === tb ? 'white' : '#4B5563' }}>
            {tb === 'create' ? '➕ Create Reviewer' : '📋 View All'}
          </button>
        ))}
      </div>

      {tab === 'create' && (
        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>🧑‍🏫 Create Permanent Reviewer Account</h3>
          <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 16 }}>
            Full access, no expiry. For real instructors/partners (e.g. Ray) — not for short-term school trials.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Name *</label>
              <input style={inp} placeholder="e.g. Ray" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Mobile Number * (10 digits)</label>
              <input style={inp} placeholder="9839320911" value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Password * (min 6 chars — share this with them)</label>
              <input style={inp} placeholder="e.g. Ray@Tokyo2026" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Notes (internal — who/why)</label>
              <input style={inp} placeholder="Vedic Maths instructor, Tokyo — via Kalash" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
          </div>
          <button onClick={createReviewer} disabled={loading} style={btn(loading ? '#9CA3AF' : '#059669')}>
            {loading ? '⏳ Creating...' : '✨ Create Reviewer Account'}
          </button>

          {error && (
            <div style={{ marginTop: 14, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 14, color: '#B91C1C', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {existingAccount && (
            <div style={{ marginTop: 14, background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
                📱 This mobile number already has an account
              </p>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, marginBottom: 12 }}>
                <div><strong>Existing name:</strong> {existingAccount.name || existingAccount.full_name || '(none on file)'}</div>
                <div><strong>Current plan:</strong> {existingAccount.plan || 'free'} ({existingAccount.subscription_status || 'unknown status'})</div>
                <div><strong>Mobile:</strong> {existingAccount.mobile || `+91${existingAccount.mobileEntered}`}</div>
              </div>
              <p style={{ fontSize: 12, color: '#92400E', marginBottom: 12 }}>
                Their password stays exactly as it is — this only changes their plan to full (Family) access. Confirm this is the right person before upgrading.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={upgradeExisting} disabled={upgrading} style={btn(upgrading ? '#9CA3AF' : '#D97706')}>
                  {upgrading ? '⏳ Upgrading...' : '✅ Yes, upgrade this account to full access'}
                </button>
                <button onClick={() => setExistingAccount(null)} style={{ ...btn('#6B7280') }}>
                  Cancel
                </button>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed #FCD34D' }}>
                <p style={{ fontSize: 12, color: '#92400E', marginBottom: 8 }}>
                  Don't know their password (e.g. it's a leftover account from before, or they forgot it)? Set a new one directly — this account uses a mobile-number fake email, so "forgot password" emails can't reach them.
                </p>
                <button onClick={resetPassword} disabled={resettingPw} style={btn(resettingPw ? '#9CA3AF' : '#DC2626')}>
                  {resettingPw ? '⏳ Setting password...' : `🔑 Set password to "${form.password || '(enter one above)'}"`}
                </button>
                {pwResetResult && (
                  <p style={{ fontSize: 12, color: '#166534', marginTop: 8, fontFamily: 'monospace' }}>
                    ✅ Password set. They can log in with mobile +91{existingAccount.mobileEntered} and password: <strong>{pwResetResult}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {result && (
            <div style={{ marginTop: 16, background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 700, color: '#166534', marginBottom: 8 }}>
                ✅ {result.upgraded ? `Existing account upgraded for ${result.name}!` : `Reviewer Account Created for ${result.name}!`}
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
                <div>📱 Mobile: <strong>+91{result.mobile}</strong></div>
                {result.upgraded ? (
                  <div>🔑 Password: <strong>unchanged — they keep using their existing password</strong></div>
                ) : (
                  <div>🔑 Password: <strong>{result.password}</strong></div>
                )}
                <div>♾️ Access: <strong>Full (Family plan) — no expiry</strong></div>
              </div>
              {result.trackingWarning && (
                <div style={{ marginTop: 10, background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, padding: 10, color: '#92400E', fontSize: 12 }}>
                  ⚠️ Account works fine, but couldn't save to your tracking list: {result.trackingWarning}. Save these details somewhere yourself for now.
                </div>
              )}
              <button onClick={() => {
                navigator.clipboard.writeText(`VedicMindAI Reviewer Login
Mobile: +91${result.mobile}
Password: ${result.upgraded ? '(use your existing password)' : result.password}
Login at: vedicmindai.in`);
                alert('Copied to clipboard!');
              }} style={{ ...btn('#1e40af'), marginTop: 10, fontSize: 12 }}>
                📋 Copy & Share via WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'list' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>All Reviewer Accounts ({list.length})</h3>
            <button onClick={loadList} style={btn()}>Refresh</button>
          </div>
          {error && <p style={{ color: '#B91C1C', fontSize: 13, marginBottom: 10 }}>⚠️ {error}</p>}
          {list.length === 0 ? <p style={{ color: '#6B7280' }}>No reviewer accounts yet.</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Name', 'Mobile', 'Password', 'Notes', 'Created', 'Status'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((d, i) => (
                    <tr key={d.user_id || i} style={{ background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontSize: 11 }}>{d.mobile}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontWeight: 700 }}>{d.password_plain}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', color: '#6B7280' }}>{d.notes || '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ background: '#D1FAE5', color: '#059669', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                          Active — no expiry
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
