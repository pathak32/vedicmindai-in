// Gate: lessons stay open to everyone, but attempting any exam, quiz,
// or battle requires a complete profile first.
//   Student accounts: school name, board, and class/section.
//   Parent accounts: their child's name, school, and grade.
// Roll number and photo are optional everywhere (used only for
// certification eligibility later, not required to unlock exams).

export function isProfileComplete(profile) {
  if (!profile) return false;
  if (profile.user_type === 'Parent') {
    return Boolean(profile.child_name && profile.child_school_name && profile.child_grade);
  }
  // Default to Student rules for null/undefined user_type too.
  return Boolean(profile.school_name && profile.board && profile.class_section);
}
