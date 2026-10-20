// Hindi labels for the signed-in navigation. Keyed by the English label, so the
// existing link lists stay unchanged. Falls back to English for unknown labels.
const HI = {
  'Dashboard': 'डैशबोर्ड',
  'Learn': 'सीखें',
  'Daily Quiz': 'दैनिक क्विज़',
  'Weekly Exam': 'साप्ताहिक परीक्षा',
  'Olympiad 🏅': 'ओलंपियाड 🏅',
  '⚔️ Battle': '⚔️ बैटल',
  '🏅 My Battles': '🏅 मेरी बैटल',
  'Practice': 'अभ्यास',
  'Leaderboard': 'लीडरबोर्ड',
  'Profile': 'प्रोफ़ाइल',
  'Sign Out': 'साइन आउट',
  'More': 'और',
};

export function navLabel(label, language) {
  if (language !== 'hi') return label;
  return HI[label] ?? label;
}
