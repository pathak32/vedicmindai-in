import React, { useState } from 'react';
import { CURRICULUM } from '@/components/learn/curriculumData';
import { useLanguage } from '@/lib/LanguageContext';

const glass = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(30,64,175,0.12)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(10,22,40,0.06)',
};

const INPUT_STYLE = {
  width: '100%', border: '1.5px solid rgba(30,64,175,0.15)', borderRadius: 10,
  padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14,
  color: '#0A1628', background: '#F8FAFF', outline: 'none',
  boxSizing: 'border-box', marginBottom: 12,
};

function flattenLessons() {
  return CURRICULUM.flatMap(level => level.lessons.map(l => ({ ...l, levelName: level.name, levelIcon: level.icon, level: level.level })));
}

export default function AdminLessons() {
  const { t } = useLanguage();
  const [lessons, setLessons] = useState(flattenLessons);
  const [editing, setEditing] = useState(null); // lesson id or 'new'
  const [form, setForm] = useState({});

  function startEdit(lesson) {
    setForm({ ...lesson });
    setEditing(lesson.id);
  }

  function startNew() {
    setForm({ id: `custom_${Date.now()}`, title: '', description: '', youtube_video_id: '', xp: 50, level: 1, levelName: 'Beginner', levelIcon: '🌱', isAssessment: false });
    setEditing('new');
  }

  function save() {
    if (editing === 'new') {
      setLessons(prev => [...prev, form]);
    } else {
      setLessons(prev => prev.map(l => l.id === editing ? { ...l, ...form } : l));
    }
    setEditing(null);
  }

  const levelColors = { 1: '#10B981', 2: '#3B82F6', 3: '#8B5CF6', 4: '#F59E0B' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#4B5563' }}>{lessons.length} lessons total</div>
        <button onClick={startNew} style={{
          minHeight: 40, padding: '0 20px', background: '#0A1628', color: 'white',
          border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>+ Add Lesson</button>
      </div>

      {/* Edit/New form */}
      {editing && (
        <div style={{ ...glass, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628', marginBottom: 16 }}>
            {editing === 'new' ? 'New Lesson' : `Edit: ${form.title}`}
          </h3>
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Title</label>
          <input style={INPUT_STYLE} value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Lesson title" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea style={{ ...INPUT_STYLE, height: 80, resize: 'vertical' }} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Lesson description" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>Content / Notes</label>
          <textarea style={{ ...INPUT_STYLE, height: 100, resize: 'vertical' }} value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Lesson content (markdown supported)" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>YouTube Video ID</label>
          <input style={INPUT_STYLE} value={form.youtube_video_id || ''} onChange={e => setForm(f => ({ ...f, youtube_video_id: e.target.value }))} placeholder="e.g. dQw4w9WgXcQ" />
          <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#4B5563', display: 'block', marginBottom: 4 }}>XP Reward</label>
          <input type="number" style={{ ...INPUT_STYLE, width: 120 }} value={form.xp || 50} onChange={e => setForm(f => ({ ...f, xp: parseInt(e.target.value) }))} />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={save} style={{ minHeight: 40, padding: '0 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('save')}</button>
            <button onClick={() => setEditing(null)} style={{ minHeight: 40, padding: '0 20px', background: 'transparent', border: '1.5px solid #D1D5DB', color: '#4B5563', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Lessons grouped by level */}
      {[1, 2, 3, 4].map(lvl => {
        const lvlLessons = lessons.filter(l => l.level === lvl);
        if (!lvlLessons.length) return null;
        const meta = CURRICULUM.find(c => c.level === lvl);
        return (
          <div key={lvl} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: levelColors[lvl], marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {meta?.icon} Level {lvl} — {meta?.name} ({lvlLessons.length} lessons)
            </div>
            <div style={{ ...glass, overflow: 'hidden' }}>
              {lvlLessons.map((lesson, i) => (
                <div key={lesson.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderBottom: i < lvlLessons.length - 1 ? '1px solid rgba(30,64,175,0.06)' : 'none',
                  background: editing === lesson.id ? 'rgba(59,130,246,0.04)' : 'transparent',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#9CA3AF', minWidth: 50, flexShrink: 0 }}>{lesson.id}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 14, color: '#0A1628', fontWeight: 500 }}>{lesson.title}</span>
                  {lesson.youtube_video_id && <span style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>▶ Video</span>}
                  {lesson.isAssessment && <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 100, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>📝 Assessment</span>}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#F59E0B', flexShrink: 0 }}>+{lesson.xp}xp</span>
                  <button onClick={() => startEdit(lesson)} style={{ minHeight: 44, padding: '0 14px', background: '#F0F4FF', color: '#1E40AF', border: 'none', borderRadius: 8, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}