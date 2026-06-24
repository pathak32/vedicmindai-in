import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { CURRICULUM } from './curriculumData';
import { isLessonAccessible } from '@/lib/trialEngine';
import { isLessonFreeAccess, getUserPlan } from '@/lib/planEngine';

function isLevelLocked(level, scores) {
  if (!level.lockKey) return false;
  return (scores?.[level.lockKey] || 0) < 60;
}

function isLessonUnlocked(lessonId, completed, scores) {
  const allIds = CURRICULUM.flatMap(lv => lv.lessons.map(l => l.id));
  const idx = allIds.indexOf(lessonId);
  if (idx === 0) return true;
  // level lock check
  const level = CURRICULUM.find(lv => lv.lessons.some(l => l.id === lessonId));
  if (level && isLevelLocked(level, scores)) return false;
  // Free-PLAN users get l1_01-l1_05 unlocked by plan alone, bypassing the
  // sequential chain below — checked against getUserPlan() directly (not
  // isLessonFreeAccess alone) because that function returns true for every
  // lesson on paid plans, which would have wrongly bypassed sequential
  // unlock for paid users too. Without this exception, locking the Quiz on
  // free lessons would mean 'completed' never gets set for them (quiz pass
  // is what marks a lesson complete), permanently blocking every subsequent
  // free lesson from ever unlocking. Decided 24-Jun-2026.
  if (getUserPlan() === 'free' && isLessonFreeAccess(lessonId)) return true;
  // sequential unlock: can access if previous is completed or already done self
  return completed?.includes(allIds[idx - 1]) || completed?.includes(lessonId);
}

export default function LearnSidebar({ activeLessonId, onSelect, progress, onClose, showClose }) {
  const completed = progress.completedLessons || [];
  const scores = progress.lessonScores || {};
  const [collapsed, setCollapsed] = useState({});

  const toggle = (lvl) => setCollapsed(p => ({ ...p, [lvl]: !p[lvl] }));

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid rgba(30,64,175,0.1)', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>📚 Curriculum</span>
        {showClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#4B5563" />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {CURRICULUM.map((level) => {
          const locked = isLevelLocked(level, scores);
          const isOpen = !collapsed[level.level];
          const lvCompleted = completed.filter(id => id.startsWith(`l${level.level}_`)).length;

          return (
            <div key={level.level} style={{ marginBottom: 8 }}>
              {/* Level header */}
              <button
                onClick={() => toggle(level.level)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'transparent', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18 }}>{locked ? '🔒' : level.icon}</span>
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: locked ? '#9CA3AF' : '#0A1628' }}>
                  Level {level.level} — {level.name}
                </span>
                <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-body)', marginRight: 4 }}>
                  {lvCompleted}/{level.lessons.length}
                </span>
                {isOpen ? <ChevronDown size={14} color="#4B5563" /> : <ChevronRight size={14} color="#4B5563" />}
              </button>

              {/* Lesson list */}
              {isOpen && (
                <div style={{ paddingLeft: 4 }}>
                  {locked ? (
                    <div style={{ padding: '8px 12px', fontSize: 12, color: '#9CA3AF', fontFamily: 'var(--font-body)' }}>
                      Complete Level {level.level - 1} to unlock
                    </div>
                  ) : (
                    level.lessons.map((lesson) => {
                      const isDone = completed.includes(lesson.id);
                      const isActive = activeLessonId === lesson.id;
                      const unlocked = isLessonUnlocked(lesson.id, completed, scores);
                      const planLocked = !isLessonAccessible(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => unlocked && !planLocked && onSelect(lesson.id)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            height: 40, padding: '0 12px', borderRadius: 8, border: 'none',
                            cursor: (unlocked && !planLocked) ? 'pointer' : 'not-allowed',
                            background: isActive ? '#DBEAFE' : 'transparent',
                            textAlign: 'left', marginBottom: 2,
                            transition: 'background 0.15s',
                          }}
                        >
                          <span style={{ fontSize: 13, flexShrink: 0 }}>
                            {planLocked ? '🔒' : isDone ? '✅' : isActive ? '▶️' : unlocked ? '⭕' : '🔒'}
                          </span>
                          <span style={{
                            flex: 1, fontSize: 13, fontFamily: 'var(--font-body)',
                            fontWeight: isActive ? 600 : 400,
                            color: planLocked ? '#9CA3AF' : isDone ? '#10B981' : unlocked ? '#0A1628' : '#9CA3AF',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {lesson.title}
                          </span>
                          {!planLocked && (
                            <span style={{ fontSize: 11, color: '#4B5563', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                              +{lesson.xp}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}