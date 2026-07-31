import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { CURRICULUM } from './curriculumData';
import { isLessonAccessible } from '@/lib/trialEngine';
import { isLessonFreeAccess, getUserPlan } from '@/lib/planEngine';

function isLevelLocked(level, scores) {
  if (!level.lockKey) return false;
  return (scores?.[level.lockKey] || 0) < 60;
}

function isLessonUnlocked(lessonId, completed, scores, isReviewer) {
  const allIds = CURRICULUM.flatMap(lv => lv.lessons.map(l => l.id));
  const idx = allIds.indexOf(lessonId);
  if (idx === 0) return true;
  // Reviewer accounts get every lesson unlocked immediately, no sequential
  // completion required — they're evaluating content, not progressing
  // through it as a learner would. Deliberately NOT tied to plan tier alone
  // (paying 'family' customers should still progress normally); this checks
  // the isReviewer flag set specifically from the reviewer_accounts table.
  if (isReviewer) return true;
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
  const isReviewer = !!progress.isReviewer;
  const [collapsed, setCollapsed] = useState({});
  const [lockedTooltip, setLockedTooltip] = useState(null); // lessonId of the tooltip to show

  const toggle = (lvl) => setCollapsed(p => ({ ...p, [lvl]: !p[lvl] }));

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: '#F5F3FF' }}>📚 Curriculum</span>
        {showClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#A5A0C4" />
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
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: locked ? '#6B6590' : '#F5F3FF' }}>
                  Level {level.level} — {level.name}
                </span>
                <span style={{ fontSize: 11, color: '#8B85AD', fontFamily: 'var(--font-body)', marginRight: 4 }}>
                  {lvCompleted}/{level.lessons.length}
                </span>
                {isOpen ? <ChevronDown size={14} color="#8B85AD" /> : <ChevronRight size={14} color="#8B85AD" />}
              </button>

              {/* Lesson list */}
              {isOpen && (
                <div style={{ paddingLeft: 4 }}>
                  {locked ? (
                    <div style={{ padding: '8px 12px', fontSize: 12, color: '#6B6590', fontFamily: 'var(--font-body)' }}>
                      Complete Level {level.level - 1} to unlock
                    </div>
                  ) : (
                    level.lessons.map((lesson) => {
                      const isDone = completed.includes(lesson.id);
                      const isActive = activeLessonId === lesson.id;
                      const unlocked = isLessonUnlocked(lesson.id, completed, scores, isReviewer);
                      const planLocked = !isLessonAccessible(lesson.id);

                      return (
                        <div key={lesson.id} style={{ position: 'relative' }}>
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (!unlocked && !planLocked) {
                              setLockedTooltip(lockedTooltip === lesson.id ? null : lesson.id);
                            } else if (unlocked && !planLocked) {
                              setLockedTooltip(null);
                              onSelect(lesson.id);
                            }
                          }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            height: 40, padding: '0 12px', borderRadius: 8, border: 'none',
                            cursor: (unlocked && !planLocked) ? 'pointer' : 'not-allowed',
                            background: isActive ? 'rgba(167,139,250,0.18)' : 'transparent',
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
                            color: planLocked ? '#6B6590' : isDone ? '#34D399' : unlocked ? '#F5F3FF' : '#6B6590',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {lesson.title}
                          </span>
                          {!planLocked && (
                            <span style={{ fontSize: 11, color: '#8B85AD', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
                              +{lesson.xp}
                            </span>
                          )}
                        </button>
                        {lockedTooltip === lesson.id && !unlocked && !planLocked && (
                          <div style={{
                            position: 'relative', margin: '0 8px 8px 8px',
                            background: '#1E1A3A', border: '1px solid rgba(167,139,250,0.3)',
                            borderRadius: 8, padding: '8px 12px',
                            fontSize: 12, color: '#C4B5FD', fontFamily: 'var(--font-body)',
                            lineHeight: 1.5,
                          }}>
                            🔒 Complete the previous lesson and score 60% or above on its quiz to unlock this one.
                            <button
                              onClick={() => setLockedTooltip(null)}
                              style={{ position: 'absolute', top: 4, right: 6, background: 'none', border: 'none', color: '#A5A0C4', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                            >✕</button>
                          </div>
                        )}
                        </div>
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