import React, { useState } from 'react';

const SAFFRON   = '#F59E0B';
const DARK_BLUE = '#0A1628';
const MED_BLUE  = '#1E40AF';

const EXAMPLES = ['97 × 96', '104 × 108', '998 × 997', '43 × 47', '112 × 108'];

export default function VedicAITutorWidget() {
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  const solve = async (problem) => {
    const q = (problem || input).trim();
    if (!q) return;
    setInput(q);
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch('/api/vedic-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (e) {
      setError(e.message || 'Could not solve. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)', padding: '56px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 30, padding: '6px 16px', marginBottom: 14,
          }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: SAFFRON, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Live AI Tutor Demo — No Signup
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'white', margin: '0 0 10px', lineHeight: 1.2 }}>
            Watch AI Solve Any Multiplication<br />
            <span style={{ color: SAFFRON }}>the Vedic Way</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6 }}>
            Type any multiplication problem. Our AI picks the right Vedic sutra and shows you every step instantly.
          </p>
        </div>

        {/* Input card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '24px 24px 20px',
        }}>
          {/* Example chips */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Try an example:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => solve(ex)}
                  style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, padding: '5px 12px', color: 'rgba(255,255,255,0.85)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(245,158,11,0.2)'; e.target.style.borderColor = SAFFRON; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && solve()}
              placeholder="e.g. 97 × 96 or 998 × 994"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 12, padding: '12px 16px',
                color: 'white', fontSize: 16, fontWeight: 500, outline: 'none',
              }}
            />
            <button
              onClick={() => solve()}
              disabled={loading || !input.trim()}
              style={{
                background: loading ? 'rgba(245,158,11,0.4)' : SAFFRON,
                color: DARK_BLUE, border: 'none', borderRadius: 12,
                padding: '12px 22px', fontWeight: 700, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {loading ? '✨ Solving…' : '⚡ Solve'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '12px 16px',
            color: '#FCA5A5', fontSize: 14, textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div style={{
            marginTop: 16,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: '24px',
            animation: 'fadeIn 0.4s ease',
          }}>
            {/* Sutra badge */}
            <div style={{ marginBottom: 18 }}>
              <div style={{
                display: 'inline-flex', flexDirection: 'column',
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 12, padding: '10px 16px',
              }}>
                <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Vedic Sutra Applied
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: SAFFRON, marginTop: 2 }}>
                  {result.sutra}
                </span>
                {result.sutra_meaning && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    "{result.sutra_meaning}"
                  </span>
                )}
              </div>
              {result.why && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '10px 0 0', lineHeight: 1.5 }}>
                  {result.why}
                </p>
              )}
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {(result.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: `rgba(245,158,11,${0.15 + i * 0.05})`,
                    border: '1px solid rgba(245,158,11,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: SAFFRON,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6, paddingTop: 3 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Answer */}
            {result.answer !== undefined && (
              <div style={{
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 12, padding: '14px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: result.speed_note ? 12 : 0,
              }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Answer</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#4ADE80' }}>
                  {result.answer.toLocaleString()}
                </span>
              </div>
            )}

            {/* Speed note */}
            {result.speed_note && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '10px 0 0', fontStyle: 'italic' }}>
                ⚡ {result.speed_note}
              </p>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 12px' }}>
            Liked it? This is just one of 40+ sutras waiting for you inside.
          </p>
          <a href="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'white', color: DARK_BLUE,
            padding: '12px 28px', borderRadius: 12,
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
          }}>
            Start Learning Free — No Credit Card 🚀
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: rgba(255,255,255,0.35); }
        input:focus { border-color: ${SAFFRON} !important; }
      `}</style>
    </section>
  );
}
