// Gate: lessons stay open to everyone, but attempting any exam, quiz,
// or battle requires a complete profile first.
//   Student accounts (still in school, Class 1-12): school name + board
//     required, section optional.
//   Student accounts (above-academic / competitive prep — JEE, NEET,
//     SSC, or "other" at signup): no fields required at all — they
//     have no school/board to give.
//   Parent accounts: child's name, school, and grade required; child's
//     section optional.
// Roll number and photo are optional everywhere (not required to
// unlock exams — used only for certification eligibility later).

const PREP_GRADES = ['JEE', 'NEET', 'SSC', 'other'];

export function isAboveAcademic(grade) {
  return PREP_GRADES.includes(grade);
}

export function isProfileComplete(profile) {
  if (!profile) return false;
  if (profile.user_type === 'Parent') {
    return Boolean(profile.child_name && profile.child_school_name && profile.child_grade);
  }
  if (isAboveAcademic(profile.grade)) return true;
  // Default to academic Student rules for null/undefined grade too.
  return Boolean(profile.school_name && profile.board);
}
