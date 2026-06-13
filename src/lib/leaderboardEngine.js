// ─── Seeded RNG ───────────────────────────────────────────────────────────────

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ─── Performance Score ────────────────────────────────────────────────────────

export function calculatePerformanceScore(progress) {
  const totalXP = progress?.totalXP || 0;
  const scores = Object.values(progress?.lessonScores || {});
  const accuracy = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const streakScore = Math.min((progress?.streak || 0) * 10, 100);
  const quizHistory = progress?.dailyQuizHistory || [];
  const avgQuiz = quizHistory.length > 0
    ? quizHistory.reduce((a, b) => a + (b.score || 0), 0) / quizHistory.length : 0;
  const quizBonus = Math.round(avgQuiz * 20);
  return Math.min(Math.round(
    (totalXP * 0.35) + (accuracy * 0.25) +
    (streakScore * 0.25) + (quizBonus * 0.15)
  ), 9999);
}

// ─── Generate Leaderboard ─────────────────────────────────────────────────────

const FIRST_NAMES = ['Aarav','Priya','Rohan','Ananya','Vikram','Ishaan',
  'Neha','Arjun','Divya','Karan','Pooja','Rahul','Sneha','Amit','Kavya',
  'Riya','Siddharth','Meera','Aditya','Shreya','Vivek','Tanvi','Kunal',
  'Nisha','Rajesh','Swati','Mohit','Anjali','Deepak','Sakshi'];
const LAST_INITS = ['S','K','V','R','P','M','G','J','T','A',
  'N','B','C','D','H','L','O','Q','U','W'];
const GRADES = ['Class 6','Class 7','Class 8','Class 9',
  'Class 10','Class 11','Class 12'];

export function generateLeaderboard(profile, progress, scope) {
  const userGrade = profile?.grade || 'Class 10';
  const userScore = calculatePerformanceScore(progress);
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 + today.getDate();
  const scopeSeed = scope === 'class' ? 1 : scope === 'school' ? 2 : 3;
  const rand = mulberry32(dateSeed + scopeSeed * 1000);
  const counts = { class: 35, school: 120, global: 500 };
  const total = counts[scope] || 35;
  const competitors = [];
  for (let i = 0; i < total; i++) {
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastInit = LAST_INITS[Math.floor(rand() * LAST_INITS.length)];
    const grade = scope === 'class'
      ? userGrade
      : GRADES[Math.floor(rand() * GRADES.length)];
    const variance = Math.max(userScore, 50) * 0.6;
    const score = Math.max(0, Math.round(
      userScore + (rand() - 0.5) * variance * 2
    ));
    const r = rand();
    competitors.push({
      id: 'sim_' + i,
      name: firstName + ' ' + lastInit + '.',
      grade, score,
      streak: Math.floor(rand() * 15),
      lessonsCompleted: Math.floor(rand() * 35),
      isSimulated: true,
      isAnonymous: rand() < 0.08,
      movement: r < 0.4 ? 'up' : r < 0.7 ? 'down' : 'same',
      movementAmount: Math.floor(rand() * 5) + 1,
    });
  }
  const optedOut = progress?.leaderboardOptOut === true;
  const isAnonymous = progress?.leaderboardAnonymous === true;
  const fullName = (profile?.name || 'You').trim();
  const nameParts = fullName.split(' ');
  const maskedName = isAnonymous
    ? 'Anonymous 🎭'
    : (nameParts[0] + (nameParts[1] ? ' ' + nameParts[1][0].toUpperCase() + '.' : ''));
  competitors.push({
    id: 'current_user', name: maskedName, grade: userGrade,
    score: userScore, streak: progress?.streak || 0,
    lessonsCompleted: progress?.completedLessons?.length || 0,
    isCurrentUser: true, isSimulated: false, isAnonymous,
    isOptedOut: optedOut,
    movement: 'up', movementAmount: Math.floor(rand() * 3) + 1,
  });
  competitors.sort((a, b) => b.score - a.score);
  competitors.forEach((c, i) => { c.rank = i + 1; });
  return competitors;
}

export function getUserEntry(lb) {
  return lb.find(c => c.isCurrentUser);
}

export function getTopN(lb, n) {
  return lb.slice(0, n);
}

export function getUserPercentile(lb) {
  const user = getUserEntry(lb);
  if (!user) return 0;
  const below = lb.filter(c => c.score < user.score).length;
  return Math.round((below / lb.length) * 100);
}

export function filterByPeriod(lb, period) {
  const mult = period === 'daily' ? 0.15 : period === 'weekly' ? 0.4 : 1;
  if (mult === 1) return lb;
  return lb.map(c => ({ ...c, score: Math.floor(c.score * mult) }))
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}