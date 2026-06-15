import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

const mobileToEmail = (mobile) => {
  const digits = mobile.replace(/\D/g, '');
  return `91${digits}@vedicmindai.in`;
};

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [mobile, setMobile] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const supabase = await getSupabase();
      const email = mobileToEmail(mobile);
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="text-3xl">🧮</span>
        </div>

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">{t('forgotPassword')}</h2>
            <p className="text-center text-slate-500 text-sm mb-6">
              Enter your registered mobile number. We'll send a reset link to your linked email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('mobileNumber')}</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <span className="px-3 py-3 text-slate-500 text-sm border-r border-slate-200 bg-slate-100">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-3 bg-transparent outline-none text-slate-800 text-sm"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-2">📧</div>
            <h2 className="text-2xl font-bold text-slate-800">Check your email!</h2>
            <p className="text-slate-500 text-sm">
              A password reset link has been sent to the email linked with mobile{' '}
              <strong>+91 {mobile}</strong>.<br />
              Check your inbox (and spam folder).
            </p>
            <p className="text-xs text-slate-400">
              The link expires in 1 hour.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-sm text-blue-600 hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
