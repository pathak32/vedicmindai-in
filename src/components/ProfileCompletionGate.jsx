import React, { useState } from 'react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import { isProfileComplete } from '@/lib/profileCompletion';

const glass = {
  background: 'rgba(255,255,255,0.9)',
  borderRadius: 20,
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 20px 60px rgba(10,22,40,0.25)',
};

const inputStyle = {
  width: '100%', minHeight: 48, padding: '0 14px', borderRadius: 10,
  border: '1.5px solid rgba(30,64,175,0.2)', fontSize: 15,
  fontFamily: 'var(--font-body)', color: '#0A1628', background: 'white',
  boxSizing: 'border-box',
};
const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#4B5563', marginBottom: 6, display: 'block' };

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'];
const GRADES = ['1','2','3','4','5','6','7','8','9','10','11','12','Other'];

// Wrap any exam/quiz/battle entry point with this. Lessons should never
// be wrapped — only the competitive/gated features. If the profile is
// already complete, children render immediately and this is a no-op.
export default function ProfileCompletionGate({ children }) {
  const { profile, refreshProfile } = useVedicAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isParent = profile?.user_type === 'Parent';

  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [classSection, setClassSection] = useState('');
  const [childName, setChildName] = useState('');
  const [childSchoolName, setChildSchoolName] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [childSection, setChildSection] = useState('');

  if (!profile || isProfileComplete(profile)) {
    return children;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isParent) {
      if (!childName.trim() || !childSchoolName.trim() || !childGrade) {
        setError('Please fill in all required fields.'); return;
      }
    } else {
      if (!schoolName.trim() || !board) {
        setError('Please fill in all required fields.'); return;
      }
    }
    setSaving(true);
    try {
      const sb = await getSupabase();
      const updates = isParent
        ? { child_name: childName.trim(), child_school_name: childSchoolName.trim(), child_grade: childGrade, child_section: childSection.trim() || null }
        : { school_name: schoolName.trim(), board, class_section: classSection.trim() || null };
      const { error: updErr } = await sb.from('profiles').update(updates).eq('id', profile.id);
      if (updErr) throw updErr;
      await refreshProfile();
    } catch (err) {
      setError('Could not save — please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ ...glass, padding: 32, maxWidth: 440, width: '100%' }}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>📋</div>
        <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 700, color: '#0A1628', textAlign: 'center', marginBottom: 8 }}>
          {isParent ? "Complete Your Child's Profile" : 'Complete Your Profile'}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 24 }}>
          {isParent
            ? "We need a few details about your child before you can attempt exams, quizzes, or battles on their behalf. Lessons remain open in the meantime."
            : 'We need a few details before you can attempt exams, quizzes, or battles. Lessons remain fully open in the meantime.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isParent ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's Name *</label>
                <input style={inputStyle} value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Aarav Sharma" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's School Name *</label>
                <input style={inputStyle} value={childSchoolName} onChange={e => setChildSchoolName(e.target.value)} placeholder="e.g. Delhi Public School" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's Class *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={childGrade} onChange={e => setChildGrade(e.target.value)}>
                  <option value="">-- Select Class --</option>
                  {GRADES.map(g => <option key={g} value={g}>{g === 'Other' ? 'Other' : `Class ${g}`}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Child's Section (optional)</label>
                <input style={inputStyle} value={childSection} onChange={e => setChildSection(e.target.value)} placeholder="e.g. A" />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>School Name *</label>
                <input style={inputStyle} value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Delhi Public School" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Board *</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={board} onChange={e => setBoard(e.target.value)}>
                  <option value="">-- Select Board --</option>
                  {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Class & Section (optional)</label>
                <input style={inputStyle} value={classSection} onChange={e => setClassSection(e.target.value)} placeholder="e.g. 8-A" />
              </div>
            </>
          )}

          {error && <p style={{ color: '#EF4444', fontSize: 13, fontFamily: 'var(--font-body)', marginTop: 8 }}>{error}</p>}

          <button type="submit" disabled={saving} style={{
            width: '100%', minHeight: 48, marginTop: 20, background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
            fontFamily: 'var(--font-body)', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
