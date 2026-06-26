import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { useVedicAuth } from '@/lib/VedicAuthContext';

// ─── Hindi/English Auto-Detect System Prompt ──────────────────────────────────
function buildSystemPrompt(lesson, language) {
  const lessonTitle = lesson?.title || 'Vedic Mathematics';
  const lessonSutra = lesson?.sutra || '';
  const lessonDesc = lesson?.description || '';

  return `You are VedicMind AI Tutor — an expert Vedic Mathematics teacher for Indian students (CBSE, ICSE, UP Board, JEE, NEET, SSC, UPSC).

CURRENT LESSON: ${lessonTitle}${lessonSutra ? ` (Sutra: ${lessonSutra})` : ''}
${lessonDesc ? `LESSON CONTEXT: ${lessonDesc}` : ''}

LANGUAGE RULE (MOST IMPORTANT):
- Detect the language of EVERY student message
- If student writes in Hindi/Hinglish → respond ENTIRELY in Hindi (Devanagari script)
- If student writes in English → respond in English
- NEVER mix languages in a single response
- Always match the student's language automatically

TEACHING STYLE:
- Be warm, encouraging, like a friendly Indian tutor (think "Masterji" energy)
- Use simple language — avoid heavy jargon
- Always show step-by-step working for math problems
- Use examples with real numbers
- End with a motivating line when student solves correctly
- If student makes an error — correct gently, explain why

VEDIC MATHS EXPERTISE:
- Teach Vedic sutras with their Sanskrit names + meaning
- Show both Vedic method AND why it's faster than conventional
- Use ✅ ❌ 📝 🔢 emojis to make explanations visual
- For calculations: show work like:
  97 × 96
  = (100-3)(100-4)
  = 100|(3×4) = 100|12 → but adjust for carry
  = 9312 ✅

RESPONSE FORMAT:
- Keep responses concise (max 150 words)
- Use line breaks for readability
- For Hindi: use easy conversational Hindi, not formal/bookish
- Start with direct answer, then explain

LIMITS: You are inside the VedicMind app. Only answer Vedic Maths questions. For unrelated topics, politely redirect to the lesson.`;
}

// ─── Greeting messages ─────────────────────────────────────────────────────────
function getGreeting(language, lessonTitle) {
  if (language === 'hi') {
    return `नमस्ते! 🙏 मैं आपका VedicMind AI शिक्षक हूँ।\n\n**${lessonTitle}** के बारे में कोई भी सवाल पूछें — Hindi या English दोनों में! मैं automatically समझ जाऊँगा। 😊\n\nकोई example problem solve करना है? बस लिखें! 🔢`;
  }
  return `Namaste! 🙏 I'm your VedicMind AI Tutor.\n\nAsk me anything about **${lessonTitle}** — in Hindi or English, I'll respond in whichever language you use! 😊\n\nWant to try a practice problem? Just ask! 🔢`;
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function AITutorPanel({ lesson, onClose }) {
  const { t, language } = useLanguage();
  const { user, profile } = useVedicAuth();
  const lessonTitle = lesson?.title || 'Vedic Mathematics';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: getGreeting(language, lessonTitle),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const userId = user?.id || 'guest';
  const plan = profile?.plan || profile?.subscription_status || 'trial';
  const [remaining, setRemaining] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystemPrompt(lesson, language),
          messages: history,
          userId,
          plan,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setLimitReached(true);
        setRemaining(0);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: language === 'hi'
            ? `⚠️ आज की ${data.limit} सवालों की सीमा खत्म हो गई। कल फिर से आएं, या upgrade करें।`
            : data.message || 'Daily limit reached. Come back tomorrow, or upgrade for more.',
        }]);
        setLoading(false);
        return;
      }

      const reply = data.content?.[0]?.text || (language === 'hi'
        ? 'माफ़ करें, कुछ गलत हो गया। फिर से कोशिश करें।'
        : 'Sorry, something went wrong. Please try again.');

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (data._usage) {
        setRemaining(data._usage.remaining);
        setLimitReached(data._usage.remaining <= 0);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'hi'
          ? '⚠️ Connection error। Internet check करें और फिर try करें।'
          : '⚠️ Connection error. Check your internet and try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '100%', maxWidth: 400,
          background: 'white', display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 32px rgba(10,22,40,0.12)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,64,175,0.1)', display: 'flex', alignItems: 'center', gap: 10, background: '#F8FAFF' }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>
              {t('aiTutor')}
              <span style={{ marginLeft: 8, background: '#10B981', color: 'white', borderRadius: 99, padding: '2px 7px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>LIVE</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
              {lessonTitle}
            </div>
          </div>
          {/* Remaining messages badge */}
          {remaining !== null && (
            <div style={{ fontSize: 11, color: remaining <= 0 ? '#DC2626' : '#6B7280', fontFamily: 'var(--font-body)', textAlign: 'right', marginRight: 4 }}>
              <div style={{ fontWeight: 600 }}>{remaining}</div>
              <div>{language === 'hi' ? 'बचे' : 'left'}</div>
            </div>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#4B5563" />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <span style={{ fontSize: 18, marginRight: 6, marginTop: 2, flexShrink: 0 }}>🤖</span>
              )}
              <div style={{
                maxWidth: '82%',
                background: msg.role === 'user' ? '#1E40AF' : '#F0F4FF',
                color: msg.role === 'user' ? 'white' : '#0A1628',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ background: '#F0F4FF', borderRadius: '16px 16px 16px 4px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#1E40AF',
                    animation: 'bounce 1.2s infinite',
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Limit reached banner */}
        {limitReached && (
          <div style={{ padding: '10px 16px', background: '#FEF2F2', borderTop: '1px solid #FECACA', fontSize: 13, color: '#DC2626', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
            {language === 'hi'
              ? '⚠️ आज की limit खत्म हो गई। '
              : '⚠️ Daily limit reached. '}
            <a href="/pricing" style={{ color: '#1E40AF', fontWeight: 600 }}>
              {language === 'hi' ? 'Upgrade करें →' : 'Upgrade →'}
            </a>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(30,64,175,0.1)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading || limitReached}
            placeholder={language === 'hi' ? 'Hindi या English में पूछें...' : 'Ask in Hindi or English...'}
            rows={1}
            style={{
              flex: 1, minHeight: 44, maxHeight: 120, fontSize: 14,
              padding: '10px 14px', borderRadius: 22,
              border: '1.5px solid rgba(30,64,175,0.2)',
              fontFamily: 'var(--font-body)', resize: 'none',
              outline: 'none', lineHeight: 1.5,
              background: limitReached ? '#F9FAFB' : 'white',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || limitReached}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: loading || !input.trim() || limitReached ? '#E5E7EB' : '#1E40AF',
              cursor: loading || !input.trim() || limitReached ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.2s',
            }}
          >
            {loading
              ? <Loader2 size={18} color="white" style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={18} color={!input.trim() || limitReached ? '#9CA3AF' : 'white'} />
            }
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
