import React, { useState } from 'react';
import SelectionDrawer from '@/components/ui/SelectionDrawer';

const selectStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: '1.5px solid rgba(255,255,255,0.2)',
  borderRadius: 10,
  color: 'white',
  padding: '10px 14px',
  minHeight: 44,
  fontSize: 16,
  width: '100%',
  outline: 'none',
  appearance: 'auto',
  fontFamily: 'var(--font-body)',
};

const inputStyle = { ...selectStyle };

const labelStyle = {
  display: 'block',
  fontSize: 14,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 8,
  fontFamily: 'var(--font-body)',
};

const fieldWrap = { marginBottom: 20 };

function Field({ label, error, children }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  );
}

function StyledSelect({ value, onChange, options, placeholder, label }) {
  return (
    <SelectionDrawer
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder || 'Select...'}
      label={label}
      dark
    />
  );
}

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'];
const EXAMS = ['JEE Main/Advanced', 'CAT', 'UPSC Civil Services', 'SSC CGL', 'IBPS/SBI Banking', 'GMAT', 'Other'];
const STAGES = ['Just Starting', '6+ Months to Exam', '3 Months to Exam', 'Final Month'];
const PURPOSES = ['Career Growth', 'Personal Interest', 'Help my Children', 'Mental Agility', 'Other'];
const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export default function Step2Details({ data, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const { role, grade, board, exam, examStage, purpose, age, gender } = data;

  const validate = () => {
    const e = {};
    if (role === 'Student') {
      if (!grade) e.grade = 'Please select your class.';
      if (!board) e.board = 'Please select your board.';
    }
    if (role === 'Exam Aspirant') {
      if (!exam) e.exam = 'Please select your target exam.';
      if (!examStage) e.examStage = 'Please select your preparation stage.';
    }
    if (role === 'Working Professional') {
      if (!purpose) e.purpose = 'Please select a purpose.';
    }
    if (role === 'Parent') {
      if (!grade) e.grade = "Please select your child's class.";
      if (!board) e.board = "Please select your child's board.";
    }
    if (!age) {
      e.age = 'Please enter your age.';
    } else if (Number(age) < 6 || Number(age) > 60) {
      e.age = 'Age must be between 6 and 60.';
    }
    if (!gender) e.gender = 'Please select a gender.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div>
      <h2 className="font-heading mb-1" style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>
        Tell us about yourself
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
        We'll customize your curriculum based on this.
      </p>

      {/* Role-conditional fields */}
      {role === 'Student' && (
        <>
          <Field label="Your Class" error={errors.grade}>
            <StyledSelect value={grade} onChange={v => onUpdate({ grade: v })} options={CLASSES} placeholder="Select class..." label="Your Class" />
          </Field>
          <Field label="Your Board" error={errors.board}>
            <StyledSelect value={board} onChange={v => onUpdate({ board: v })} options={BOARDS} placeholder="Select board..." label="Your Board" />
          </Field>
        </>
      )}

      {role === 'Exam Aspirant' && (
        <>
          <Field label="Target Exam" error={errors.exam}>
            <StyledSelect value={exam} onChange={v => onUpdate({ exam: v })} options={EXAMS} placeholder="Select exam..." label="Target Exam" />
          </Field>
          <Field label="Preparation Stage" error={errors.examStage}>
            <StyledSelect value={examStage} onChange={v => onUpdate({ examStage: v })} options={STAGES} placeholder="Select stage..." label="Preparation Stage" />
          </Field>
        </>
      )}

      {role === 'Working Professional' && (
        <Field label="Why are you learning Vedic Maths?" error={errors.purpose}>
          <StyledSelect value={purpose} onChange={v => onUpdate({ purpose: v })} options={PURPOSES} placeholder="Select purpose..." label="Why are you learning Vedic Maths?" />
        </Field>
      )}

      {role === 'Parent' && (
        <>
          <Field label="Child's Class" error={errors.grade}>
            <StyledSelect value={grade} onChange={v => onUpdate({ grade: v })} options={CLASSES} placeholder="Select class..." label="Child's Class" />
          </Field>
          <Field label="Child's Board" error={errors.board}>
            <StyledSelect value={board} onChange={v => onUpdate({ board: v })} options={BOARDS} placeholder="Select board..." label="Child's Board" />
          </Field>
        </>
      )}

      {/* Age */}
      <Field label="Your Age" error={errors.age}>
        <input
          type="number"
          min={6}
          max={60}
          placeholder="e.g. 16"
          value={age}
          onChange={e => onUpdate({ age: e.target.value })}
          style={inputStyle}
        />
      </Field>

      {/* Gender */}
      <Field label="Gender" error={errors.gender}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {GENDERS.map(g => {
            const sel = gender === g;
            return (
              <button
                key={g}
                onClick={() => onUpdate({ gender: g })}
                style={{
                  background: sel ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${sel ? '#3B82F6' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: 100,
                  padding: '8px 20px',
                  minHeight: 40,
                  color: 'white',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            minHeight: 44,
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.3)',
            borderRadius: 12,
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 2,
            minHeight: 44,
            background: '#3B82F6',
            border: 'none',
            borderRadius: 12,
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}