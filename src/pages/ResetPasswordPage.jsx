import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash — it auto-exchanges it
    const init = async () => {
      const supabase = await getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else {
        // listen for the SIGNED_IN event from the recovery link
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
            setSessionReady(true);
          }
        });
        return () => subscription.unsubscribe();
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setStatus('loading');
    try {
      const supabase = await getSupabase();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
      setStatus('error');
    }
  };

  // Invalid / expired link
  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center space-y-4">
          <div className="text-4xl">⏳</div>
          <h2 className="text-xl font-bold text-slate-800">Verifying reset link…</h2>
          <p className="text-slate-500 text-sm">
            If this takes too long, your link may have expired.{' '}
            <a href="/forgot-password" className="text-blue-600 hover:underline">Request a new one</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <span className="text-3xl">🔐</span>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-2xl font-bold text-slate-800">Password Updated!</h2>
            <p className="text-slate-500 text-sm">Redirecting you to dashboard…</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Set New Password</h2>
            <p className="text-center text-slate-500 text-sm mb-6">
              Choose a strong password for your VedicMind account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="px-3 text-slate-400 hover:text-slate-600 text-sm"
                  >
                    {show ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 outline-none text-slate-800 text-sm"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Updating…' : 'Update Password →'}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <a href="/auth" className="text-sm text-blue-600 hover:underline">← Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}
