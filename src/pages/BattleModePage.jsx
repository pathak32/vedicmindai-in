import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { useProgress } from '@/lib/ProgressContext';
import { getSupabase } from '@/lib/supabaseClient';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { drawBattleQuestions } from '@/data/battleQuestions';
import { getUnlockedBattleTopics, isLowerStage } from '@/lib/battleTopicUnlock';
import { BATTLE_DIFFICULTIES } from '@/data/battleQuestions';

const WIN_TARGET = 5;
const COUNTDOWN_SECONDS = 10;
const ROUND_SECONDS = 15; // per-question time limit — also what resolves a disconnected/quit opponent

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function BattleModePage() {
  const { t } = useLanguage();
  const { user, profile, loading: authLoading } = useVedicAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { progress } = useProgress();
  const myName = profile?.name || 'Player';
  const unlockedTopics = getUnlockedBattleTopics(progress?.completedLessons || []);

  const [phase, setPhase] = useState('menu');
  const [room, setRoom] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [showHardWarning, setShowHardWarning] = useState(false);
  const lowerStage = isLowerStage(profile?.grade);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [roundTimeLeft, setRoundTimeLeft] = useState(ROUND_SECONDS);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    if (unlockedTopics.length > 0 && !selectedTopic) setSelectedTopic(unlockedTopics[0]);
  }, [unlockedTopics, selectedTopic]);

  // Handle someone arriving via a shared WhatsApp battle link
  // (vedicmindai.in/battle?code=ABC123). If they're not logged in yet,
  // send them to sign in first and bring them right back here afterward.
  // If they are logged in, auto-run the preview lookup for that code.
  useEffect(() => {
    const codeFromLink = searchParams.get('code');
    if (!codeFromLink || authLoading) return;
    if (!user) {
      const returnPath = `/battle?code=${codeFromLink}`;
      navigate(`/auth?redirect=${encodeURIComponent(returnPath)}`, { replace: true });
      return;
    }
    if (phase === 'menu') {
      setJoinCode(codeFromLink);
      handlePreview(codeFromLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user, authLoading]);

  const isCreator = room && user && room.creator_id === user.id;
  const myScore = room ? (isCreator ? room.creator_score : room.opponent_score) : 0;
  const opponentScore = room ? (isCreator ? room.opponent_score : room.creator_score) : 0;
  const opponentName = room ? (isCreator ? room.opponent_name : room.creator_name) : '';
  const currentQuestion = room?.questions?.[room.current_round];

  const applyRoomUpdate = useCallback((newRoom) => {
    setRoom((prev) => {
      if (prev && prev.status === newRoom.status &&
          prev.current_round === newRoom.current_round && prev.round_winner_id === newRoom.round_winner_id &&
          prev.creator_score === newRoom.creator_score && prev.opponent_score === newRoom.opponent_score &&
          prev.creator_answered === newRoom.creator_answered && prev.opponent_answered === newRoom.opponent_answered) {
        return prev;
      }
      if (!prev || prev.current_round !== newRoom.current_round) {
        setSelected(null);
      }
      return newRoom;
    });
    setPhase((p) => {
      if (newRoom.match_winner_id) return 'completed';
      if (newRoom.status === 'starting' && (p === 'waiting' || p === 'preview')) return 'starting';
      if (newRoom.status === 'active' && p !== 'active' && p !== 'completed') return 'active';
      return p;
    });
  }, []);

  const subscribeToRoom = useCallback((roomId) => {
    (async () => {
      const supabase = await getSupabase();
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      const channel = supabase
        .channel(`battle_room_${roomId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'battle_rooms', filter: `id=eq.${roomId}` },
          (payload) => applyRoomUpdate(payload.new)
        )
        .subscribe();
      channelRef.current = channel;
    })();
  }, [applyRoomUpdate]);

  useEffect(() => {
    if (!room?.id || phase === 'completed' || phase === 'menu') return undefined;
    const interval = setInterval(async () => {
      const supabase = await getSupabase();
      const { data } = await supabase.from('battle_rooms').select('*').eq('id', room.id).maybeSingle();
      if (data) applyRoomUpdate(data);
    }, 2000);
    return () => clearInterval(interval);
  }, [room?.id, phase, applyRoomUpdate]);

  useEffect(() => {
    if (phase !== 'starting' || !room?.battle_starts_at) return undefined;
    const target = new Date(room.battle_starts_at).getTime();
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        setPhase('active');
        getSupabase().then((supabase) =>
          supabase.from('battle_rooms').update({ status: 'active', round_started_at: new Date().toISOString() }).eq('id', room.id).eq('status', 'starting')
        );
      }
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [phase, room?.battle_starts_at, room?.id]);

  // Per-question timer. This is also what protects the game from a
  // disconnected, quit, or unresponsive opponent — rather than trying to
  // detect "they left" directly (which needs presence/heartbeat tracking),
  // every question simply has a hard time limit. If nobody answers
  // correctly in time, the round resolves with no winner and play moves
  // on, exactly like a double-miss.
  useEffect(() => {
    if (phase !== 'active' || !room?.round_started_at || room.round_winner_id) return undefined;
    const alreadyBothMissed = room.creator_answered && room.opponent_answered;
    if (alreadyBothMissed) return undefined;

    const target = new Date(room.round_started_at).getTime() + ROUND_SECONDS * 1000;
    const tick = async () => {
      const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      setRoundTimeLeft(remaining);
      if (remaining <= 0) {
        const supabase = await getSupabase();
        await supabase
          .from('battle_rooms')
          .update({
            current_round: room.current_round + 1,
            round_winner_id: null,
            creator_answered: false,
            opponent_answered: false,
            round_started_at: new Date().toISOString(),
          })
          .eq('id', room.id)
          .eq('current_round', room.current_round)
          .is('round_winner_id', null);
      }
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [phase, room?.round_started_at, room?.current_round, room?.round_winner_id, room?.creator_answered, room?.opponent_answered, room?.id]);

  // Leaving mid-battle forfeits the match to whoever's still there, rather
  // than leaving them stuck waiting indefinitely for someone who's gone.
  const handleForfeit = async () => {
    if (!room || !user) return;
    if (!window.confirm('Leave this battle? Your opponent will be declared the winner.')) return;
    const opponentId = isCreator ? room.opponent_id : room.creator_id;
    const supabase = await getSupabase();
    await supabase
      .from('battle_rooms')
      .update({ match_winner_id: opponentId, status: 'completed' })
      .eq('id', room.id);
    resetToMenu();
  };

  const handleCreate = async () => {
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      const supabase = await getSupabase();
      const code = generateRoomCode();
      const { data, error: insertErr } = await supabase
        .from('battle_rooms')
        .insert({
          code,
          creator_id: user.id,
          creator_name: myName,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          questions: drawBattleQuestions(10, selectedTopic, selectedDifficulty),
          status: 'waiting',
        })
        .select()
        .single();
      if (insertErr) throw insertErr;
      setRoom(data);
      setPhase('waiting');
      subscribeToRoom(data.id);
    } catch (e) {
      setError('Could not create a battle right now. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handlePreview = async (codeOverride) => {
    const rawCode = codeOverride ?? joinCode;
    if (!user || rawCode.trim().length < 4) {
      setError('Enter a valid battle code');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const supabase = await getSupabase();
      const code = rawCode.trim().toUpperCase();
      const { data: found, error: findErr } = await supabase
        .from('battle_rooms')
        .select('*')
        .eq('code', code)
        .eq('status', 'waiting')
        .is('opponent_id', null)
        .maybeSingle();
      if (findErr || !found) {
        setError('Battle not found, already started, or already full.');
        setBusy(false);
        return;
      }
      setRoom(found);
      setPhase('preview');
    } catch (e) {
      setError('Something went wrong looking up that battle.');
    } finally {
      setBusy(false);
    }
  };

  const handleAccept = async () => {
    if (!room || !user) return;
    setBusy(true);
    try {
      const supabase = await getSupabase();
      const startsAt = new Date(Date.now() + COUNTDOWN_SECONDS * 1000).toISOString();
      const { data: updated, error: acceptErr } = await supabase
        .from('battle_rooms')
        .update({
          opponent_id: user.id,
          opponent_name: myName,
          status: 'starting',
          battle_starts_at: startsAt,
        })
        .eq('id', room.id)
        .is('opponent_id', null)
        .select()
        .single();
      if (acceptErr || !updated) {
        setError('Someone just accepted this battle first — try another code.');
        setPhase('menu');
        setBusy(false);
        return;
      }
      setRoom(updated);
      setPhase('starting');
      subscribeToRoom(updated.id);
    } catch (e) {
      setError('Something went wrong accepting the battle.');
    } finally {
      setBusy(false);
    }
  };

  const handleDecline = () => {
    setRoom(null);
    setPhase('menu');
    setJoinCode('');
  };

  const handleAnswer = async (opt) => {
    if (!room || selected || !currentQuestion) return;
    setSelected(opt);
    const isCorrect = opt === currentQuestion.answer;
    const supabase = await getSupabase();

    if (!isCorrect) {
      const answeredField = isCreator ? 'creator_answered' : 'opponent_answered';
      const { data: afterMiss } = await supabase
        .from('battle_rooms')
        .update({ [answeredField]: true })
        .eq('id', room.id)
        .eq('current_round', room.current_round)
        .select()
        .single();

      if (afterMiss && afterMiss.creator_answered && afterMiss.opponent_answered && !afterMiss.round_winner_id) {
        setRoom(afterMiss);
        setTimeout(async () => {
          await supabase
            .from('battle_rooms')
            .update({
              current_round: afterMiss.current_round + 1,
              round_winner_id: null,
              creator_answered: false,
              opponent_answered: false,
              round_started_at: new Date().toISOString(),
            })
            .eq('id', room.id)
            .eq('current_round', afterMiss.current_round)
            .eq('creator_answered', true)
            .eq('opponent_answered', true);
        }, 3000);
      } else if (afterMiss) {
        setRoom(afterMiss);
      }
      return;
    }

    const scoreField = isCreator ? 'creator_score' : 'opponent_score';
    const newScore = myScore + 1;
    const matchWinnerId = newScore >= WIN_TARGET ? user.id : null;

    const updatePayload = {
      round_winner_id: user.id,
      [scoreField]: newScore,
      match_winner_id: matchWinnerId,
    };
    // A match that just ended needs status flipped to 'completed' too —
    // otherwise the row is never picked up by "My Battles" history, which
    // filters on status specifically (this was the actual bug: a real win
    // was being saved with match_winner_id set, but status stuck on
    // 'active' forever, so it silently never showed up in history).
    if (matchWinnerId) updatePayload.status = 'completed';

    const { data: claimed } = await supabase
      .from('battle_rooms')
      .update(updatePayload)
      .eq('id', room.id)
      .is('round_winner_id', null)
      .select()
      .single();

    if (claimed) {
      setRoom(claimed);
      if (claimed.match_winner_id) {
        setPhase('completed');
        return;
      }
      setTimeout(async () => {
        await supabase
          .from('battle_rooms')
          .update({ current_round: claimed.current_round + 1, round_winner_id: null, creator_answered: false, opponent_answered: false, round_started_at: new Date().toISOString() })
          .eq('id', room.id)
          .eq('round_winner_id', user.id);
      }, 3000);
    }
  };

  const resetToMenu = () => {
    if (channelRef.current) {
      getSupabase().then((supabase) => supabase.removeChannel(channelRef.current));
    }
    setRoom(null);
    setPhase('menu');
    setSelected(null);
    setJoinCode('');
    setError('');
    setCountdown(COUNTDOWN_SECONDS);
  };

  const shareText = room ? `I'm challenging you to a Vedic Maths battle on VedicMindAI! 🥊\nTopic: ${room.topic} (${room.difficulty})\n\nTap to accept: https://vedicmindai.in/battle?code=${room.code}\n\n(If you're not logged in yet, it'll ask you to sign in first, then bring you straight here.)` : '';
  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard?.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleShareWhatsApp = () => {
    if (!room) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1628 0%, #1a0533 100%)' }}>
      <DashboardNavbar />

      <main style={{ padding: '48px 24px 64px', textAlign: 'center' }}>
        <span style={{ fontSize: 64, display: 'inline-block' }}>🥊</span>
        <h1 className="font-heading" style={{ fontSize: 36, fontWeight: 700, color: 'white', marginTop: 16 }}>
          {t('liveBattleMode') || 'Live Battle Mode'}
        </h1>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: '28px 24px',
            maxWidth: 480,
            margin: '32px auto',
          }}
        >
          {phase === 'menu' && (
            <div>
              {unlockedTopics.length === 0 ? (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'left' }}>
                  <p style={{ color: '#FCD34D', fontWeight: 600, marginBottom: 4 }}>Complete a lesson to unlock Battle Mode</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>You can only battle on topics you've actually learned. <Link to="/learn" style={{ color: '#93C5FD' }}>Start with Lesson 1 →</Link></p>
                </div>
              ) : (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8, textAlign: 'left' }}>Choose a topic you've completed:</p>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={{
                      width: '100%', height: 44, borderRadius: 10, marginBottom: 16, padding: '0 12px',
                      background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: 14,
                    }}
                  >
                    {unlockedTopics.map((topic) => (
                      <option key={topic} value={topic} style={{ color: '#0A1628' }}>{topic}</option>
                    ))}
                  </select>

                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8, textAlign: 'left' }}>Choose difficulty:</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {BATTLE_DIFFICULTIES.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => {
                          if (diff === 'hard' && lowerStage) {
                            setShowHardWarning(true);
                          } else {
                            setSelectedDifficulty(diff);
                          }
                        }}
                        style={{
                          flex: 1, height: 40, borderRadius: 10, textTransform: 'capitalize', cursor: 'pointer',
                          fontWeight: 600, fontSize: 13, border: '1px solid rgba(255,255,255,0.2)',
                          background: selectedDifficulty === diff ? '#3B82F6' : 'rgba(255,255,255,0.08)',
                          color: 'white',
                        }}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                  {showHardWarning && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: 14, marginBottom: 16, textAlign: 'left' }}>
                      <p style={{ color: '#FCA5A5', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>⚠️ This is the hardest difficulty</p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 10 }}>
                        You might be challenging someone more advanced than you, and there's a real chance you could lose. Are you sure?
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setShowHardWarning(false)} style={{ flex: 1, height: 34, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                        <button onClick={() => { setSelectedDifficulty('hard'); setShowHardWarning(false); }} style={{ flex: 1, height: 34, borderRadius: 8, background: '#EF4444', border: 'none', color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Yes, I'm sure</button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleCreate}
                    disabled={busy}
                    style={{
                      width: '100%', height: 52, borderRadius: 14, background: '#3B82F6', color: 'white',
                      fontWeight: 700, fontSize: 16, border: 'none', marginBottom: 16, cursor: 'pointer',
                    }}
                  >
                    {busy ? 'Creating...' : 'Create a Battle'}
                  </button>
                </>
              )}

              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '16px 0' }}>— or join with a code —</p>

              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-letter code"
                maxLength={6}
                style={{
                  width: '100%', height: 48, borderRadius: 12, textAlign: 'center', fontSize: 20,
                  letterSpacing: 4, marginBottom: 12, border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: 'white',
                }}
              />
              <button
                onClick={handlePreview}
                disabled={busy}
                style={{
                  width: '100%', height: 48, borderRadius: 12, background: 'transparent',
                  border: '1.5px solid #3B82F6', color: '#93C5FD', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Look Up Battle
              </button>
              {error && <p style={{ color: '#FCA5A5', marginTop: 12, fontSize: 14 }}>{error}</p>}
            </div>
          )}

          {phase === 'waiting' && room && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Topic: <strong style={{ color: 'white' }}>{room.topic}</strong> · Difficulty: <strong style={{ color: 'white', textTransform: 'capitalize' }}>{room.difficulty}</strong></p>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Share this code with your opponent:</p>
              <div style={{
                fontFamily: 'monospace', fontSize: 40, fontWeight: 700, color: '#3B82F6',
                letterSpacing: 8, margin: '16px 0',
              }}>
                {room.code}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button
                  onClick={handleCopyCode}
                  style={{ flex: 1, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Code'}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  style={{ flex: 1, height: 44, borderRadius: 10, background: '#25D366', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                >
                  Share on WhatsApp
                </button>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Waiting for them to accept...</p>
              <button onClick={resetToMenu} style={{ marginTop: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13 }}>
                Cancel
              </button>
            </div>
          )}

          {phase === 'preview' && room && (
            <div>
              <span style={{ fontSize: 40 }}>⚔️</span>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '12px 0 4px' }}>
                {room.creator_name} has challenged you!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Topic: <strong style={{ color: 'white' }}>{room.topic}</strong></p>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                Difficulty: <strong style={{ color: room.difficulty === 'hard' ? '#FCA5A5' : 'white', textTransform: 'capitalize' }}>{room.difficulty}</strong>
                {room.difficulty === 'hard' && ' 🔥'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>First to {WIN_TARGET} correct answers wins</p>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDecline}
                  style={{ flex: 1, height: 48, borderRadius: 12, background: 'transparent', border: '1.5px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={busy}
                  style={{ flex: 1, height: 48, borderRadius: 12, background: '#3B82F6', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                >
                  {busy ? 'Accepting...' : 'Accept Battle'}
                </button>
              </div>
              {error && <p style={{ color: '#FCA5A5', marginTop: 12, fontSize: 14 }}>{error}</p>}
            </div>
          )}

          {phase === 'starting' && room && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                {isCreator ? `${room.opponent_name} accepted!` : 'Battle accepted!'}
              </p>
              <p style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Get ready — {room.topic}</p>
              <div style={{
                width: 100, height: 100, borderRadius: '50%', margin: '0 auto',
                background: 'rgba(59,130,246,0.15)', border: '3px solid #3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, fontWeight: 700, color: 'white', fontFamily: 'monospace',
              }}>
                {countdown}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 20 }}>
                First to {WIN_TARGET} correct answers wins. Good luck!
              </p>
            </div>
          )}

          {phase === 'active' && room && currentQuestion && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                <span>You: <strong style={{ color: '#6EE7B7' }}>{myScore}</strong></span>
                <span style={{ fontFamily: 'monospace', color: roundTimeLeft <= 5 ? '#FCA5A5' : 'rgba(255,255,255,0.6)' }}>⏱ {roundTimeLeft}s</span>
                <span>{opponentName || 'Opponent'}: <strong style={{ color: '#FCA5A5' }}>{opponentScore}</strong></span>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{currentQuestion.tag}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 24 }}>
                {currentQuestion.prompt}
              </p>
              <div style={{ display: 'grid', gap: 12 }}>
                {currentQuestion.options.map((opt) => {
                  const bothMissed = room.creator_answered && room.opponent_answered && !room.round_winner_id;
                  const showState = room.round_winner_id != null || bothMissed;
                  const isThisCorrect = opt === currentQuestion.answer;
                  let bg = 'rgba(255,255,255,0.1)';
                  if (showState && isThisCorrect) bg = 'rgba(16,185,129,0.9)';
                  else if (selected === opt && !isThisCorrect) bg = 'rgba(239,68,68,0.9)';
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!selected || room.round_winner_id != null}
                      style={{
                        padding: '14px', borderRadius: 12, fontFamily: 'monospace', fontSize: 18,
                        fontWeight: 700, color: 'white', background: bg, border: '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {room.round_winner_id && (
                <p style={{ marginTop: 16, fontWeight: 600, color: room.round_winner_id === user.id ? '#6EE7B7' : '#FCA5A5' }}>
                  {room.round_winner_id === user.id ? 'You won this round! 🎉' : `${opponentName} won this round`}
                </p>
              )}
              {!room.round_winner_id && room.creator_answered && room.opponent_answered && (
                <p style={{ marginTop: 16, fontWeight: 600, color: '#FCD34D' }}>
                  Both of you missed this one! The answer was {currentQuestion.answer} — next question coming up.
                </p>
              )}
              <button onClick={handleForfeit} style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }}>
                Leave Battle
              </button>
            </div>
          )}

          {phase === 'completed' && room && (
            <div>
              <span style={{ fontSize: 48 }}>{room.match_winner_id === user.id ? '🏆' : '🥈'}</span>
              <h2 style={{ color: 'white', fontSize: 24, fontWeight: 700, margin: '16px 0' }}>
                {room.match_winner_id === user.id ? 'You are the Battle Champion!' : `${opponentName} won this match`}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Final score: {myScore} - {opponentScore}</p>
              <button
                onClick={resetToMenu}
                style={{
                  height: 48, padding: '0 28px', borderRadius: 12, background: '#3B82F6', color: 'white',
                  fontWeight: 700, border: 'none', cursor: 'pointer',
                }}
              >
                Battle Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
