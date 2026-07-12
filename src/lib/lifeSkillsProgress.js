// Life Skills progress — deliberately time-based unlocking, not score-based.
// You can't "quiz-pass" whether you actually woke up at 5am for a week or
// actually tried the parenting suggestion — this needs a real week to pass
// plus a genuine reflection, not a correctness check.

import { getSupabase } from './supabaseClient';

const UNLOCK_DAYS = 7;

function readProgress() {
  try { return JSON.parse(localStorage.getItem('vedicmind_progress') || '{}'); }
  catch { return {}; }
}
function writeProgress(p) {
  localStorage.setItem('vedicmind_progress', JSON.stringify(p));
}

// Local key format: lifeSkills.<track>.<moduleId> = { startedAt, reflection, completedAt }
export function getLifeSkillsState(track, moduleId) {
  const p = readProgress();
  return p.lifeSkills?.[track]?.[moduleId] || null;
}

export function startModule(track, moduleId) {
  const p = readProgress();
  if (!p.lifeSkills) p.lifeSkills = {};
  if (!p.lifeSkills[track]) p.lifeSkills[track] = {};
  if (!p.lifeSkills[track][moduleId]) {
    p.lifeSkills[track][moduleId] = { startedAt: Date.now(), reflection: null, completedAt: null };
    writeProgress(p);
  }
  return p.lifeSkills[track][moduleId];
}

export function submitReflection(track, moduleId, reflectionText) {
  const p = readProgress();
  if (!p.lifeSkills?.[track]?.[moduleId]) return false;
  p.lifeSkills[track][moduleId].reflection = reflectionText;
  p.lifeSkills[track][moduleId].completedAt = Date.now();
  writeProgress(p);
  syncLifeSkillsToServer(track, moduleId, p.lifeSkills[track][moduleId]);
  return true;
}

async function syncLifeSkillsToServer(track, moduleId, state) {
  try {
    const sb = await getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (!session?.user?.id) return;
    await sb.from('life_skills_progress').upsert({
      user_id: session.user.id,
      track,
      module_id: moduleId,
      started_at: new Date(state.startedAt).toISOString(),
      completed_at: state.completedAt ? new Date(state.completedAt).toISOString() : null,
      reflection: state.reflection,
    }, { onConflict: 'user_id,track,module_id' });
  } catch (e) {
    console.warn('Life Skills sync failed (non-critical):', e);
  }
}

// A module unlocks if: it's module 1 (always open), OR the previous module
// in the same track was completed AND at least UNLOCK_DAYS have passed since
// that completion — real time, not a quiz score.
export function isModuleUnlocked(track, moduleOrder, allModulesInTrack) {
  if (moduleOrder === 1) return true;
  const prevModule = allModulesInTrack.find((m) => m.order === moduleOrder - 1);
  if (!prevModule) return false;
  const prevState = getLifeSkillsState(track, prevModule.id);
  if (!prevState?.completedAt) return false;
  const daysSince = (Date.now() - prevState.completedAt) / (1000 * 60 * 60 * 24);
  return daysSince >= UNLOCK_DAYS;
}

export function daysUntilUnlock(track, moduleOrder, allModulesInTrack) {
  const prevModule = allModulesInTrack.find((m) => m.order === moduleOrder - 1);
  if (!prevModule) return null;
  const prevState = getLifeSkillsState(track, prevModule.id);
  if (!prevState?.completedAt) return null;
  const daysSince = (Date.now() - prevState.completedAt) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(UNLOCK_DAYS - daysSince));
}

export { UNLOCK_DAYS };
