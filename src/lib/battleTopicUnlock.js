import { CURRICULUM } from '@/components/learn/curriculumData';

// Maps a Battle Mode topic to a keyword that identifies it within lesson
// titles. This is how we determine whether a student has actually
// completed a lesson covering that sutra before letting them battle on it.
//
// NOTE: 'Antyayor Dashakepi' currently has no matching lesson anywhere in
// CURRICULUM — it's a real sutra used in the battle question bank, but
// nothing in the taught curriculum covers it yet. Until a lesson exists,
// this topic will never unlock for anyone. Flagging this rather than
// silently leaving it always-locked or always-open.
const TOPIC_KEYWORDS = {
  'Nikhilam Sutra': 'nikhilam',
  'Ekadhikena Purvena': 'ekadhikena',
  'By 11 Trick': 'by 11',
  'Antyayor Dashakepi': 'antyayor',
};

// Returns true if this student's class is considered "lower stage" — young
// enough that picking Hard difficulty should show a warning first, rather
// than being freely available like it is for older/more advanced students.
// Grade can be numeric ("3".."12"), a named stage ("Nursery"), or a
// competitive-exam track ("JEE"/"NEET"/"SSC") from the signup dropdown.
export function isLowerStage(grade) {
  if (!grade) return true; // unknown grade — default to the safer, gated behavior
  const advancedTracks = ['JEE', 'NEET', 'SSC'];
  if (advancedTracks.includes(grade)) return false;
  const num = parseInt(grade, 10);
  if (Number.isNaN(num)) return true; // "Nursery", custom text, etc. — treat as young/unknown
  return num <= 5;
}

// Returns the list of Battle Mode topics this student has actually earned
// the right to battle on, based on lessons they've completed. 'Mixed' is
// only offered once at least one real topic is unlocked — a student who
// hasn't finished anything yet gets nothing to battle on, by design.
export function getUnlockedBattleTopics(completedLessons = []) {
  const completedTitles = [];
  CURRICULUM.forEach((level) => {
    level.lessons.forEach((lesson) => {
      if (completedLessons.includes(lesson.id)) completedTitles.push(lesson.title.toLowerCase());
    });
  });

  const unlocked = [];
  Object.entries(TOPIC_KEYWORDS).forEach(([topic, keyword]) => {
    if (completedTitles.some((t) => t.includes(keyword))) unlocked.push(topic);
  });

  if (unlocked.length > 0) unlocked.unshift('Mixed');
  return unlocked;
}
