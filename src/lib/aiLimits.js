// VedicMind AI Tutor — Daily Message Limits
// Free: 10/day | Basic: 30/day | Pro: 100/day

const LIMITS = { free: 10, trial: 10, basic: 30, pro: 100, demo: 20, admin: 9999 };

function getTodayKey(userId) {
  const today = new Date().toISOString().slice(0, 10);
  return `vm_ai_limit_${userId}_${today}`;
}

export function getAILimit(plan) {
  return LIMITS[plan?.toLowerCase()] ?? 10;
}

export function getAIUsage(userId) {
  try {
    const key = getTodayKey(userId);
    return parseInt(localStorage.getItem(key) || '0', 10);
  } catch { return 0; }
}

export function incrementAIUsage(userId) {
  try {
    const key = getTodayKey(userId);
    const current = getAIUsage(userId);
    localStorage.setItem(key, (current + 1).toString());
    return current + 1;
  } catch { return 0; }
}

export function canUseAI(userId, plan) {
  const limit = getAILimit(plan);
  const used = getAIUsage(userId);
  return used < limit;
}

export function getRemainingMessages(userId, plan) {
  const limit = getAILimit(plan);
  const used = getAIUsage(userId);
  return Math.max(0, limit - used);
}

// UI component for showing limit meter
export function AILimitMeter({ userId, plan }) {
  const limit = getAILimit(plan);
  const used = getAIUsage(userId);
  const remaining = Math.max(0, limit - used);
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? '#DC2626' : pct >= 70 ? '#D97706' : '#059669';

  return (
    <div style={{ padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#6B7280' }}>
        <span>🤖 AI messages today</span>
        <span style={{ fontWeight: 600, color }}>{remaining} left</span>
      </div>
      <div style={{ background: '#E5E7EB', borderRadius: 20, height: 5, overflow: 'hidden' }}>
        <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: 20, transition: 'width 0.3s' }} />
      </div>
      {remaining === 0 && (
        <p style={{ color: '#DC2626', marginTop: 6, fontWeight: 500 }}>
          Daily limit reached. <a href="/pricing" style={{ color: '#1E40AF' }}>Upgrade for more →</a>
        </p>
      )}
    </div>
  );
}
