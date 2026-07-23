// Gate: lessons stay open to everyone, but attempting any exam, quiz,
// or battle requires a complete profile first.
//   Student accounts (still in school, Class 1-12, India): school name
//     + board required, section optional — CBSE/ICSE/State board
//     structure only applies to Indian schools.
//   Student accounts outside India, or above-academic / competitive
//     prep (JEE, NEET, SSC, or "other" at signup): no fields are
//     required at all — a foreign curriculum has no CBSE/ICSE/State
//     equivalent to ask for, so the gate auto-passes for them too.
//   Parent accounts: child's name, school, and grade required; child's
//     section optional (regardless of country).
// Roll number and photo are optional everywhere (not required to
// unlock exams — used only for certification eligibility later).

const PREP_GRADES = ['JEE', 'NEET', 'SSC', 'other'];

export function isAboveAcademic(grade) {
  return PREP_GRADES.includes(grade);
}

export function isIndianStudent(profile) {
  // country_name is set at signup from countryCodes.js — 'India' is the
  // exact string used for the +91 option; everything else (including
  // the free-text "Other (+XX)" case) is treated as non-Indian.
  return profile?.country_name === 'India';
}

export function isProfileComplete(profile) {
  if (!profile) return false;
  if (profile.user_type === 'Parent') {
    return Boolean(profile.child_name && profile.child_school_name && profile.child_grade);
  }
  if (isAboveAcademic(profile.grade)) return true;
  if (!isIndianStudent(profile)) return true; // no board system to ask for
  // Default to academic Student rules (India, Class 1-12) for
  // null/undefined grade too.
  return Boolean(profile.school_name && profile.board);
}
