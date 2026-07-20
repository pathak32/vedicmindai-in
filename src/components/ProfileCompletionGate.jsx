import React, { useState } from 'react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import { isProfileComplete, isAboveAcademic, isIndianStudent } from '@/lib/profileCompletion';

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

function dismissedKey(userId) {
  return `vedicmind_gate_optional_dismissed_${userId}`;
}

// Wrap any exam/quiz/battle entry point with this. Lessons should never
// be wrapped — only the competitive/gated features.
//
// Two distinct paths:
//   BLOCKING — Indian academic students (Class 1-12) missing School/
//     Board, or Parent accounts missing child details. Must fill
//     required fields to proceed, no skip.
//   OPTIONAL — non-Indian students or above-academic/competitive-prep
//     students, who have no CBSE/ICSE/State board to give. Shown once
//     (dismissal remembered per-device via localStorage) with every
//     field optional and a Skip button; never blocks.
export default function ProfileCompletionGate({ children }) {
  const { profile, refreshProfile } = useVedicAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const isParent = profile?.user_type === 'Parent';

  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [classSection, setClassSection] = useState('');
  const [childName, setChildName] = useState('');
  const [childSchoolName, setChildSchoolName] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [childSection, setChildSection] = useState('');

  if (!profile) return children;

  const blocking = !isProfileComplete(profile);
  const optionalPath = !isParent && !blocking && (isAboveAcademic(profile.grade) || !isIndianStudent(profile));
  const alreadySkipped = optionalPath && (() => {
    try { return localStorage.getItem(dismissedKey(profile.id)) === '1'; } catch { return false; }
  })();

  if (!blocking && (!optionalPath || alreadySkipped || dismissed)) {
    return children;
  }

  const skipOptional = () => {
    try { localStorage.setItem(dismissedKey(profile.id), '1'); } catch {}
    setDismissed(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (blocking) {
      if (isParent) {
        if (!childName.trim() || !childSchoolName.trim() || !childGrade) {
          setError('Please fill in all required fields.'); return;
        }
      } else {
        if (!schoolName.trim() || !board) {
          setError('Please fill in all required fields.'); return;
        }
      }
    }
    setSaving(true);
    try {
      const sb = await getSupabase();
      const updates = isParent
        ? { child_name: childName.trim() || null, child_school_name: childSchoolName.trim() || null, child_grade: childGrade || null, child_section: childSection.trim() || null }
        : { school_name: schoolName.trim() || null, board: board || null, class_section: classSection.trim() || null };
      const { error: updErr } = await sb.from('profiles').update(updates).eq('id', profile.id);
      if (updErr) throw updErr;
      if (optionalPath) { try { localStorage.setItem(dismissedKey(profile.id), '1'); } catch {} }
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
          {blocking
            ? (isParent
                ? "We need a few details about your child before you can attempt exams, quizzes, or battles on their behalf. Lessons remain open in the meantime."
                : 'We need a few details before you can attempt exams, quizzes, or battles. Lessons remain fully open in the meantime.')
            : "These details are optional for you, but help us personalize your experience. Feel free to skip."}
        </p>

        <form onSubmit={handleSubmit}>
          {isParent ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's Name {blocking && '*'}</label>
                <input style={inputStyle} value={childName} onChange={e => setChildName(e.target.value)} placeholder="e.g. Aarav Sharma" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's School Name {blocking && '*'}</label>
                <input style={inputStyle} value={childSchoolName} onChange={e => setChildSchoolName(e.target.value)} placeholder="e.g. Delhi Public School" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Child's Class {blocking && '*'}</label>
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
          ) : blocking ? (
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
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>School / Institution Name (optional)</label>
                <input style={inputStyle} value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. your school or coaching institute" />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={labelStyle}>Class & Section (optional)</label>
                <input style={inputStyle} value={classSection} onChange={e => setClassSection(e.target.value)} placeholder="e.g. Grade 10 / Section A" />
              </div>
            </>
          )}

          {error && <p style={{ color: '#EF4444', fontSize: 13, fontFamily: 'var(--font-body)', marginTop: 8 }}>{error}</p>}

          <button type="submit" disabled={saving} style={{
            width: '100%', minHeight: 48, marginTop: 20, background: '#0A1628', color: 'white',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
            fontFamily: 'var(--font-body)', opacity: saving ? 0.7 : 1,
          }}>
            {saving ? 'Saving...' : (blocking ? 'Continue' : 'Save & Continue')}
          </button>

          {!blocking && (
            <button type="button" onClick={skipOptional} disabled={saving} style={{
              width: '100%', minHeight: 44, marginTop: 10, background: 'transparent', color: '#4B5563',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              Skip for now
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
