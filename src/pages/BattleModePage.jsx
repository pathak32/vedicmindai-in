import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';
import { drawBattleQuestions } from '@/data/battleQuestions';

const WIN_TARGET = 5;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function BattleModePage() {
  const { t } = useLanguage();
  const { user, profile } = useVedicAuth();
  const myName = profile?.name || 'Player';

  const [phase, setPhase] = useState('menu');
  const [room, setRoom] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const channelRef = useRef(null);

  const isCreator = room && user && room.creator_id === user.id;
  const myScore = room ? (isCreator ? room.creator_score : room.opponent_score) : 0;
  const opponentScore = room ? (isCreator ? room.opponent_score : room.creator_score) : 0;
  const opponentName = room ? (isCreator ? room.opponent_name : room.creator_name) : '';
  const currentQuestion = room?.questions?.[room.current_round];

  // Shared handler for any fresh room data, whether it arrived via the
  // realtime subscription or the polling fallback below.
  const applyRoomUpdate = useCallback((newRoom) => {
    setRoom((prev) => {
      if (prev && prev.status === newRoom.status &&
          prev.current_round === newRoom.current_round && prev.round_winner_id === newRoom.round_winner_id &&
          prev.creator_score === newRoom.creator_score && prev.opponent_score === newRoom.opponent_score &&
          prev.creator_answered === newRoom.creator_answered && prev.opponent_answered === newRoom.opponent_answered) {
        return prev;
      }
      // Only clear the locally-selected answer once the round has actually
      // moved on — otherwise a player who already answered (right or wrong)
      // would briefly see their choice un-highlight while still waiting on
      // their opponent, which looks like the app forgot their answer.
      if (!prev || prev.current_round !== newRoom.current_round) {
        setSelected(null);
      }
      return newRoom;
    });
    setPhase((p) => {
      if (newRoom.match_winner_id) return 'completed';
      if (newRoom.status === 'active' && p === 'waiting') return 'active';
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

  // Polling safety net — real-time delivery isn't always reliable across
  // every device/network combination, so this quietly re-checks room state
  // every 2s as a backup. Whichever arrives first (realtime or this) wins;
  // applyRoomUpdate ignores no-op updates so this is cheap and harmless.
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
    return () => {
      if (channelRef.current) {
        getSupabase().then((supabase) => supabase.removeChannel(channelRef.current));
      }
    };
  }, []);

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
          questions: drawBattleQuestions(10),
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

  const handleJoin = async () => {
    if (!user || joinCode.trim().length < 4) {
      setError('Enter a valid battle code');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const supabase = await getSupabase();
      const code = joinCode.trim().toUpperCase();
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
      const { data: updated, error: joinErr } = await supabase
        .from('battle_rooms')
        .update({ opponent_id: user.id, opponent_name: myName, status: 'active' })
        .eq('id', found.id)
        .is('opponent_id', null)
        .select()
        .single();
      if (joinErr || !updated) {
        setError('Someone just joined this battle first — try another code.');
        setBusy(false);
        return;
      }
      setRoom(updated);
      setPhase('active');
      subscribeToRoom(updated.id);
    } catch (e) {
      setError('Something went wrong joining the battle.');
    } finally {
      setBusy(false);
    }
  };

  const handleAnswer = async (opt) => {
    if (!room || selected || !currentQuestion) return;
    setSelected(opt);
    const isCorrect = opt === currentQuestion.answer;
    const supabase = await getSupabase();

    if (!isCorrect) {
      // Mark that I've submitted a (wrong) answer this round, then check
      // whether BOTH players have now missed — if so, resolve the round
      // with no winner instead of leaving it stuck forever.
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

    const { data: claimed } = await supabase
      .from('battle_rooms')
      .update({
        round_winner_id: user.id,
        [scoreField]: newScore,
        match_winner_id: matchWinnerId,
      })
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
          .update({ current_round: claimed.current_round + 1, round_winner_id: null, creator_answered: false, opponent_answered: false })
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
                onClick={handleJoin}
                disabled={busy}
                style={{
                  width: '100%', height: 48, borderRadius: 12, background: 'transparent',
                  border: '1.5px solid #3B82F6', color: '#93C5FD', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Join Battle
              </button>
              {error && <p style={{ color: '#FCA5A5', marginTop: 12, fontSize: 14 }}>{error}</p>}
            </div>
          )}

          {phase === 'waiting' && room && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Share this code with your opponent:</p>
              <div style={{
                fontFamily: 'monospace', fontSize: 40, fontWeight: 700, color: '#3B82F6',
                letterSpacing: 8, margin: '16px 0',
              }}>
                {room.code}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Waiting for them to join...</p>
              <button onClick={resetToMenu} style={{ marginTop: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13 }}>
                Cancel
              </button>
            </div>
          )}

          {phase === 'active' && room && currentQuestion && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                <span>You: <strong style={{ color: '#6EE7B7' }}>{myScore}</strong></span>
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
