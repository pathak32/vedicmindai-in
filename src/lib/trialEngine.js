// ─── Trial / Plan helpers ─────────────────────────────────────────────────────

export function getTrialStatus() {
  // Check vedicmind_plan for paid plan
  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  if (plan.planStatus && plan.planStatus !== 'trial' && plan.planStatus !== 'free') return 'paid';
  if (localStorage.getItem('vedicmind_subscription') === 'active') return 'paid';

  // Determine if trial is active or expired
  if (!plan.trialEndDate) return 'trial';
  const now = new Date();
  const end = new Date(plan.trialEndDate);
  return now > end ? 'expired' : 'trial';
}

export function getDaysRemaining() {
  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  if (!plan.trialEndDate) return 7;
  const now = new Date();
  const end = new Date(plan.trialEndDate);
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getCurrentPlan() {
  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  return plan.planStatus || 'trial';
}

export function getTrialEndDate() {
  const plan = JSON.parse(localStorage.getItem('vedicmind_plan') || '{}');
  if (!plan.trialEndDate) return null;
  return new Date(plan.trialEndDate);
}

export function initTrial() {
  const trialData = {
    trialStartDate: new Date().toISOString(),
    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    planStatus: 'trial',
    planActivatedDate: null,
    razorpayPaymentId: null,
  };
  localStorage.setItem('vedicmind_plan', JSON.stringify(trialData));
}

/**
 * Returns true if a lesson is accessible given the current trial status.
 * Level 1 (l1_xx) is always free. Levels 2–4 are locked on expired.
 */
export function isLessonAccessible(lessonId) {
  const status = getTrialStatus();
  if (status === 'trial' || status === 'paid') return true;
  // expired → only level 1 is free
  return lessonId.startsWith('l1_');
}