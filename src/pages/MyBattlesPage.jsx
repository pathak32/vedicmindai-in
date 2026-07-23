import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useLanguage } from '@/lib/LanguageContext';

export default function MyBattlesPage() {
  const { user } = useVedicAuth();
  const { t } = useLanguage();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const supabase = await getSupabase();
      const { data } = await supabase
        .from('battle_rooms')
        .select('*')
        .or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50);
      setBattles(data || []);
      setLoading(false);
    })();
  }, [user]);

  const wins = battles.filter((b) => b.match_winner_id === user?.id).length;
  const losses = battles.length - wins;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF' }}>
      <DashboardNavbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>
          {t('myBattlesTitle')}
        </h1>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>
          {battles.length} {battles.length !== 1 ? t('myBattlesPlayedStatPlural') : t('myBattlesPlayedStat')} {t('myBattlesPlayedSuffix')} - {wins}W {losses}L
        </p>

        {loading && <p style={{ color: '#6B7280' }}>{t('loadingText')}</p>}

        {!loading && battles.length === 0 && (
          <div style={{ background: 'white', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 4px 20px rgba(10,22,40,0.06)' }}>
            <span style={{ fontSize: 40 }}>Battle</span>
            <p style={{ color: '#0A1628', fontWeight: 600, marginTop: 12, marginBottom: 8 }}>{t('myBattlesEmptyTitle')}</p>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>{t('myBattlesEmptyDesc')}</p>
            <Link to="/battle" style={{ display: 'inline-block', background: '#0A1628', color: 'white', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>
              {t('myBattlesStartBtn')}
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {battles.map((b) => {
            const isCreator = b.creator_id === user.id;
            const opponentName = isCreator ? b.opponent_name : b.creator_name;
            const myScore = isCreator ? b.creator_score : b.opponent_score;
            const oppScore = isCreator ? b.opponent_score : b.creator_score;
            const won = b.match_winner_id === user.id;
            const date = new Date(b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div key={b.id} style={{ background: 'white', borderRadius: 14, padding: 18, boxShadow: '0 2px 10px rgba(10,22,40,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#0A1628', marginBottom: 2 }}>{t('myBattlesVs')} {opponentName || t('myBattlesUnknown')}</p>
                  <p style={{ fontSize: 13, color: '#6B7280' }}>{b.topic || t('myBattlesMixed')} - {date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: '#0A1628' }}>{myScore} - {oppScore}</p>
                  <span style={{
                    display: 'inline-block', marginTop: 4, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 99,
                    background: won ? '#D1FAE5' : '#FEE2E2', color: won ? '#065F46' : '#991B1B',
                  }}>
                    {won ? t('myBattlesWon') : t('myBattlesLost')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
