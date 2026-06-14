// VedicMind Voice Explanation — Web Speech API (zero cost)
// Usage: speak("As per Nikhilam sutra, the answer is 9312")

export function speakExplanation(text, lang = 'hi-IN') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // stop any ongoing speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.9;
  utter.pitch = 1;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

export function buildExplanation(question, correctOption, explanation, sutra) {
  const hindi = `गलत उत्तर। ${sutra} सूत्र के अनुसार, सही उत्तर है ${correctOption}। ${explanation || ''}`;
  const english = `Wrong answer. As per ${sutra} sutra, the correct answer is ${correctOption}. ${explanation || ''}`;
  return { hindi, english };
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
