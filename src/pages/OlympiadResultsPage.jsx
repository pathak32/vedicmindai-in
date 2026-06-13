import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getOlympiadLevelLabel } from '@/lib/olympiadEngine';

function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += inc;
      if (current >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return val;
}

function MedalAnimation({ score }) {
  let medal = '🏅';
  if (score >= 150) medal = '🥇';
  else if (score >= 120) medal = '🥈';
  else if (score >= 90) medal = '🥉';

  return (
    <div style={{
      fontSize: 72,
      animation: 'medalDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
      display: 'inline-block', marginBottom: 8,
    }}>
      {medal}
    </div>
  );
}

function getMessage(score) {
  if (score >= 150) return '🌟 Extraordinary! Olympiad Champion material!';
  if (score >= 120) return '🏆 Brilliant! You\'re among the elite!';
  if (score >= 90) return '🎯 Strong performance! Keep competing!';
  if (score >= 60) return '💪 Good effort! More practice next quarter!';
  return '📚 Keep learning! Every Olympiad makes you stronger.';
}

export default function OlympiadResultsPage() {
  const navigate = useNavigate();
  const progress = JSON.parse(localStorage.getItem('vedicmind_progress') || '{}');
  const history = progress.olympiadHistory || [];
  const result = history[history.length - 1];

  const score = result?.score ?? 0;
  const total = result?.totalPossible ?? 180;
  const correct = result?.correct ?? 0;
  const wrong = result?.wrong ?? 0;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  const timeTaken = result?.timeTaken ?? 0;
  const level = result?.level ?? 'senior';
  const quarter = result?.quarter ?? '';

  const displayScore = useCountUp(score);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const handleShare = () => {
    const text = `I just competed in the VedicMind Olympiad! 🏅🧮
Score: ${score}/180 | Level: ${getOlympiadLevelLabel(level)}
Quarter: ${quarter}
Think you can beat me?
Register at vedicmindai.in`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadCertificate = () => {
    toast.success('Certificate feature coming soon! We\'ll email it to you. 🏅');
  };

  const stats = [
    { label: 'Correct', value: correct, color: '#10B981' },
    { label: 'Wrong', value: wrong, color: '#EF4444' },
    { label: 'Accuracy', value: `${accuracy}%`, color: '#F59E0B' },
    { label: 'Time', value: formatTime(timeTaken), color: '#60A5FA' },
  ];

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: '32px 16px 48px', display: 'flex', justifyContent: 'center' }}>
      <style>{`
        @keyframes medalDrop{
          0%{opacity:0;transform:scale(0) translateY(-40px)}
          80%{transform:scale(1.3) translateY(0)}
          100%{opacity:1;transform:scale(1) translateY(0)}
        }
        @media(max-width:500px){
          .oly-stats-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Medal */}
        <MedalAnimation score={score} />

        {/* Score */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontFamily: 'var(--font-heading)', fontSize: 56, fontWeight: 700, color: '#F59E0B',
          }}>
            {displayScore}
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, color: 'white' }}>
            /{total}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
          Olympiad Score
        </div>

        {/* Medal label */}
        {result?.medal && (
          <div style={{
            display: 'inline-block', background: 'rgba(245,158,11,0.2)',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 99, padding: '6px 18px',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#F59E0B',
            marginBottom: 16,
          }}>
            {result.medal}
          </div>
        )}

        {/* Performance message */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, color: 'white',
          lineHeight: 1.6, marginBottom: 24,
        }}>
          {getMessage(score)}
        </p>

        {/* Stats grid */}
        <div className="oly-stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '14px 8px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: s.color, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate card */}
        <div style={{
          border: '2px solid #F59E0B', borderRadius: 16, padding: '20px 20px 24px',
          marginBottom: 16,
          background: 'rgba(245,158,11,0.05)',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏅</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#F59E0B', marginBottom: 4 }}>
            Your Certificate is Ready
          </div>
          <div className="font-heading" style={{ fontSize: 18, color: 'white', marginBottom: 4 }}>
            VedicMind Olympiad {quarter}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
            {getOlympiadLevelLabel(level)}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#F59E0B', marginBottom: 20 }}>
            Score: {score} / 180
          </div>
          <button
            onClick={handleDownloadCertificate}
            style={{
              width: '100%', height: 48, background: '#F59E0B', color: '#0A1628',
              border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}
          >
            Download Certificate 📄
          </button>
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', height: 48, background: '#25D366', color: 'white',
            border: 'none', borderRadius: 12, fontFamily: 'var(--font-body)',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 12,
          }}
        >
          Share My Achievement 🏆
        </button>

        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', height: 44, background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12,
            color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
