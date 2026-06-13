import React from 'react';

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
  'Undergraduate', 'Postgraduate', 'Working Professional', 'Other'
];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Not Applicable'];
const HARD_TOPICS = ['Arithmetic', 'Algebra', 'Geometry', 'Trigonometry', 'Mental Maths', 'None'];
const GOAL_PILLS = ['Speed in Calculations', 'Competitive Exams', 'Help My Child', 'Personal Growth', 'Mental Fitness'];

const inputCls = "w-full h-11 px-4 rounded-xl border border-[#D1D5DB] text-[#0A1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1628]/30 focus:border-[#0A1628]";
const selectCls = `${inputCls} bg-white cursor-pointer`;

function PillToggle({ options, selected = [], onChange, max = Infinity, single = false }) {
  const toggle = (opt) => {
    if (single) { onChange([opt]); return; }
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else if (selected.length < max) {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
            selected.includes(opt)
              ? 'bg-[#0A1628] text-white border-[#0A1628]'
              : 'bg-white text-[#0A1628] border-[#D1D5DB] hover:border-[#0A1628]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function Step3Academic({ data, onChange, role }) {
  const isAdult = data.currentClass === 'Working Professional' || data.currentClass === 'Other' || parseInt(data.age) >= 22;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-[#0A1628]">Tell us about your studies</h2>
        <p className="text-[#4B5563] mt-2">We'll tailor your curriculum accordingly</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">
            Current Class / Level<span className="text-[#EF4444] ml-0.5">*</span>
          </label>
          <select
            className={selectCls}
            value={data.currentClass || ''}
            onChange={e => onChange({ currentClass: e.target.value })}
          >
            <option value="">Select class...</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {!isAdult && (
          <>
            <div>
              <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">Board of Education</label>
              <select
                className={selectCls}
                value={data.board || ''}
                onChange={e => onChange({ board: e.target.value })}
              >
                <option value="">Select board...</option>
                {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">School Name <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
              <input
                className={inputCls}
                placeholder="e.g. Delhi Public School"
                value={data.schoolName || ''}
                onChange={e => onChange({ schoolName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A1628] mb-2">
                Hardest Math Topics <span className="text-[#9CA3AF] font-normal">(pick up to 3)</span>
              </label>
              <PillToggle
                options={HARD_TOPICS}
                selected={data.hardTopics || []}
                onChange={val => onChange({ hardTopics: val })}
                max={3}
              />
            </div>
          </>
        )}

        {isAdult && (
          <>
            <div>
              <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">Profession</label>
              <input
                className={inputCls}
                placeholder="e.g. Software Engineer"
                value={data.profession || ''}
                onChange={e => onChange({ profession: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A1628] mb-2">Goals <span className="text-[#9CA3AF] font-normal">(multi-select)</span></label>
              <PillToggle
                options={GOAL_PILLS}
                selected={data.adultGoals || []}
                onChange={val => onChange({ adultGoals: val })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}