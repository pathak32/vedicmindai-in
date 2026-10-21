import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';

// Date of birth is stored as DD/MM/YYYY. True when the student is under 18 today.
function isUnder18(dob) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob || '')) return false;
  const [d, m, y] = dob.split('/').map(Number);
  const birth = new Date(y, m - 1, d);
  const eighteen = new Date(y + 18, m - 1, d);
  return birth <= new Date() && eighteen > new Date();
}

// Optional prompt for existing under-18 students who have not yet had a parent confirm.
// It does not block the account. Dismissal is remembered for this browser session only.
export default function ConsentPrompt() {
  const { profile } = useVedicAuth();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('vm_consent_prompt_dismissed') === '1'; } catch { return false; }
  });

  if (dismissed || !profile || profile.parental_consent_at) return null;
  if (!isUnder18(profile.dob || profile.date_of_birth)) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', margin: '12px 16px' }}>
      <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: '#78350F', lineHeight: 1.5 }}>
        Ask a parent or guardian to confirm this account. It takes one WhatsApp code.
      </div>
      <Link to="/consent" style={{ background: '#0A1628', color: 'white', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Confirm with parent</Link>
      <button type="button" aria-label="Dismiss" onClick={() => { try { sessionStorage.setItem('vm_consent_prompt_dismissed', '1'); } catch {} setDismissed(true); }}
        style={{ background: 'none', border: 'none', fontSize: 18, color: '#92400E', cursor: 'pointer' }}>×</button>
    </div>
  );
}
