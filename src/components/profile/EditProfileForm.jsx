import React, { useState } from 'react';
import SelectionDrawer from '@/components/ui/SelectionDrawer';
import { useLanguage } from '@/lib/LanguageContext';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];
const LANGUAGES = ['English', 'हिंदी', 'தமிழ்', 'मराठी'];
const TIME_OPTIONS = ['15 min/day', '30 min/day', '45 min/day', '1 hr+/day'];
const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'];
const EXAMS = ['JEE Main/Advanced', 'CAT', 'UPSC Civil Services', 'SSC CGL', 'IBPS/SBI Banking', 'GMAT', 'Other'];

const glass = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(30,64,175,0.15)',
  boxShadow: '0 8px 32px rgba(10,22,40,0.08)',
  borderRadius: 16,
};

const inputStyle = {
  width: '100%', minHeight: 44, fontSize: 16, padding: '10px 14px',
  border: '1.5px solid rgba(30,64,175,0.15)', borderRadius: 10,
  fontFamily: 'var(--font-body)', color: '#0A1628', background: 'white',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle = { fontSize: 13, color: '#4B5563', fontFamily: 'var(--font-body)', marginBottom: 6, display: 'block' };

function PillGroup({
  options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          style={{
            padding: '8px 16px', minHeight: 40, borderRadius: 100, fontSize: 14,
            fontFamily: 'var(--font-body)', cursor: 'pointer', border: 'none',
            background: value === o ? '#0A1628' : '#F0F4FF',
            color: value === o ? 'white' : '#0A1628',
            fontWeight: value === o ? 600 : 400,
            transition: 'all 0.15s',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function EditProfileForm({profile, onSave, onCancel }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: profile.name || '',
    age: profile.age || '',
    gender: profile.gender || '',
    grade: profile.grade || '',
    board: profile.board || '',
    exam: profile.exam || '',
    language: profile.language || 'English',
    timeCommitment: profile.timeCommitment || '',
    ...profile,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.age || Number(form.age) < 6 || Number(form.age) > 60) e.age = 'Enter age 6–60';
    if (!form.gender) e.gender = 'Select gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...profile, ...form });
  };

  return (
    <div style={{ ...glass, padding: 24 }}>
      <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 20 }}>{t('editProfile')}</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>{t('fullName')}</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
          {errors.name && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
        </div>
        <div>
          <label style={labelStyle}>Age</label>
          <input type="number" min={6} max={60} value={form.age} onChange={e => set('age', e.target.value)} style={inputStyle} />
          {errors.age && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.age}</p>}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Gender</label>
        <PillGroup options={GENDERS} value={form.gender} onChange={v => set('gender', v)} />
        {errors.gender && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.gender}</p>}
      </div>

      {(profile.role === 'Student' || profile.role === 'Parent') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>{profile.role === 'Parent' ? "Child's Class" : 'Your Class'}</label>
            <SelectionDrawer
              value={form.grade}
              onChange={v => set('grade', v)}
              options={CLASSES}
              placeholder="Select..."
              label={profile.role === 'Parent' ? "Child's Class" : 'Your Class'}
            />
          </div>
          <div>
            <label style={labelStyle}>Board</label>
            <SelectionDrawer
              value={form.board}
              onChange={v => set('board', v)}
              options={BOARDS}
              placeholder="Select..."
              label="Board"
            />
          </div>
        </div>
      )}

      {profile.role === 'Exam Aspirant' && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Target Exam</label>
          <SelectionDrawer
            value={form.exam}
            onChange={v => set('exam', v)}
            options={EXAMS}
            placeholder="Select..."
            label="Target Exam"
          />
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Language Preference</label>
        <PillGroup options={LANGUAGES} value={form.language} onChange={v => set('language', v)} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Daily Time Commitment</label>
        <PillGroup options={TIME_OPTIONS} value={form.timeCommitment} onChange={v => set('timeCommitment', v)} />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={handleSave}
          style={{ minHeight: 44, padding: '0 28px', background: '#0A1628', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          style={{ minHeight: 44, padding: '0 20px', background: 'transparent', color: '#0A1628', border: '1.5px solid rgba(30,64,175,0.2)', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}