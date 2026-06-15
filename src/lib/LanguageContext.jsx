import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    home: "Home", learn: "Learn", quiz: "Daily Quiz", leaderboard: "Leaderboard",
    profile: "Profile", settings: "Settings", logout: "Logout",
    welcome: "Welcome back", continueLesson: "Continue Learning",
    dailyQuizTitle: "Daily Quiz", streakDays: "Day Streak",
    lessonsCompleted: "Lessons Done", totalXP: "Total XP", yourRank: "Your Rank",
    concept: "Concept", practice: "Practice", aiTutor: "AI Tutor",
    watchVideo: "Watch Video", markComplete: "Mark Concept Complete",
    nextLesson: "Continue to Next Lesson", lessonComplete: "Lesson Complete!",
    score: "Score", xpEarned: "XP Earned", submitAnswer: "Submit Answer",
    nextQuestion: "Next Question", quizComplete: "Quiz Complete!",
    correct: "Correct!", incorrect: "Incorrect", explanation: "Explanation",
    askTutor: "Ask your AI Tutor...",
    tutorGreeting: "Namaste! I am your VedicMindAI tutor. Ask me anything about Vedic Mathematics!",
    send: "Send", thinking: "Thinking...", signIn: "Sign In", signUp: "Sign Up",
    mobileNumber: "Mobile Number", enterOTP: "Enter OTP", verifyOTP: "Verify OTP",
    resendOTP: "Resend OTP", forgotPassword: "Forgot Password?",
    freeTrial: "7-Day Free Trial", subscribe: "Subscribe Now",
    basicPlan: "Basic", proPlan: "Pro", familyPlan: "Family",
    perMonth: "/month", perYear: "/year", startTrial: "Start Free Trial",
    loading: "Loading...", error: "Something went wrong", retry: "Try Again",
    save: "Save", cancel: "Cancel", close: "Close", back: "Back",
    next: "Next", done: "Done", share: "Share", copy: "Copy",
  },
  hi: {
    home: "होम", learn: "सीखें", quiz: "दैनिक क्विज़", leaderboard: "लीडरबोर्ड",
    profile: "प्रोफाइल", settings: "सेटिंग्स", logout: "लॉग आउट",
    welcome: "वापस स्वागत है", continueLesson: "सीखना जारी रखें",
    dailyQuizTitle: "दैनिक क्विज़", streakDays: "दिन की स्ट्रीक",
    lessonsCompleted: "पाठ पूरे किए", totalXP: "कुल XP", yourRank: "आपकी रैंक",
    concept: "अवधारणा", practice: "अभ्यास", aiTutor: "AI शिक्षक",
    watchVideo: "वीडियो देखें", markComplete: "अवधारणा पूर्ण करें",
    nextLesson: "अगले पाठ पर जाएं", lessonComplete: "पाठ पूरा हुआ!",
    score: "स्कोर", xpEarned: "XP अर्जित", submitAnswer: "उत्तर जमा करें",
    nextQuestion: "अगला प्रश्न", quizComplete: "क्विज़ पूरी हुई!",
    correct: "सही!", incorrect: "गलत", explanation: "व्याख्या",
    askTutor: "अपना प्रश्न पूछें...",
    tutorGreeting: "नमस्ते! मैं आपका VedicMindAI शिक्षक हूँ। वैदिक गणित के बारे में कुछ भी पूछें!",
    send: "भेजें", thinking: "सोच रहा हूँ...", signIn: "साइन इन करें",
    signUp: "साइन अप करें", mobileNumber: "मोबाइल नंबर", enterOTP: "OTP दर्ज करें",
    verifyOTP: "OTP सत्यापित करें", resendOTP: "OTP दोबारा भेजें",
    forgotPassword: "पासवर्ड भूल गए?", freeTrial: "7 दिन का निःशुल्क ट्रायल",
    subscribe: "अभी सब्सक्राइब करें", basicPlan: "बेसिक", proPlan: "प्रो",
    familyPlan: "फैमिली", perMonth: "/माह", perYear: "/वर्ष",
    startTrial: "निःशुल्क ट्रायल शुरू करें", loading: "लोड हो रहा है...",
    error: "कुछ गलत हुआ", retry: "फिर कोशिश करें", save: "सेव करें",
    cancel: "रद्द करें", close: "बंद करें", back: "वापस",
    next: "आगे", done: "हो गया", share: "शेयर करें", copy: "कॉपी करें",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("vedicmind_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("vedicmind_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
