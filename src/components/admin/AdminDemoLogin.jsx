import React, { useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';


function randPass() {
  return 'Demo@' + Math.random().toString(36).slice(2,8).toUpperCase();
}
function randEmail(school) {
  const slug = school.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,10);
  return `demo.${slug}.${Date.now().toString(36)}@vedicmindai.in`;
}

export default function AdminDemoLogin() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ school: '', city: '', days: 7, contact: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [tab, setTab] = useState('create'); // create | list

  async function createDemo() {
    if (!form.school) { alert('Enter school name'); return; }
    setLoading(true);
    setResult(null);
    try {
      const email = randEmail(form.school);
      const password = randPass();

      const response = await fetch('/api/admin?action=create-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          school: form.school,
          city: form.city,
          contact: form.contact,
          days: form.days,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create demo login');
      }

      setResult(data);
      setForm({ school: '', city: '', days: 7, contact: '' });
    } catch (e) {
      alert('Error: ' + e.message);
    }
    setLoading(false);
  }

  async function loadList() {
    try {
      const res = await fetch('/api/admin?action=list-demo-logins');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load demo logins');
      setList(data.demoLogins || []);
    } catch (e) {
      console.error('loadList:', e);
      setList([]);
    }
  }

  const card = { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,64,175,0.1)', borderRadius: 14, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 16 };
  const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none' };
  const btn = (c='#1e40af') => ({ padding: '9px 20px', borderRadius: 9, background: c, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 });

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 12, padding: 4, border: '1px solid #E5E7EB', marginBottom: 16, width: 'fit-content' }}>
        {['create','list'].map(t => (
          <button key={t} onClick={() => { setTab(t); if(t==='list') loadList(); }}
            style={{ padding: '7px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: tab===t ? '#0A1628' : 'transparent', color: tab===t ? 'white' : '#4B5563' }}>
            {t === 'create' ? '➕ Create Demo' : '📋 View All'}
          </button>
        ))}
      </div>

      {tab === 'create' && (
        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🏫 Create Demo Login for School</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>School / Institute Name *</label>
              <input style={inp} placeholder="e.g. CMS Lucknow" value={form.school} onChange={e => setForm(p=>({...p, school: e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>City</label>
              <input style={inp} placeholder="e.g. Lucknow" value={form.city} onChange={e => setForm(p=>({...p, city: e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Contact (principal email/phone)</label>
              <input style={inp} placeholder="principal@school.com" value={form.contact} onChange={e => setForm(p=>({...p, contact: e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>Access Duration</label>
              <select style={inp} value={form.days} onChange={e => setForm(p=>({...p, days: parseInt(e.target.value)}))}>
                <option value={7}>7 days</option>
                <option value={15}>15 days</option>
                <option value={30}>30 days (1 month)</option>
              </select>
            </div>
          </div>
          <button onClick={createDemo} disabled={loading} style={btn(loading ? '#9CA3AF' : '#059669')}>
            {loading ? '⏳ Creating...' : '✨ Generate Demo Login'}
          </button>

          {result && (
            <div style={{ marginTop: 16, background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 12, padding: 16 }}>
              <p style={{ fontWeight: 700, color: '#166534', marginBottom: 8 }}>✅ Demo Login Created for {result.school}!</p>
              <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
                <div>📧 Email: <strong>{result.email}</strong></div>
                <div>🔑 Password: <strong>{result.password}</strong></div>
                <div>⏰ Expires: <strong>{new Date(result.expiresAt).toLocaleDateString('en-IN')}</strong></div>
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(`VedicMindAI Demo Login
Email: ${result.email}
Password: ${result.password}
Expires: ${new Date(result.expiresAt).toLocaleDateString('en-IN')}
Login at: vedicmindai.in`);
                alert('Copied to clipboard!');
              }} style={{ ...btn('#1e40af'), marginTop: 10, fontSize: 12 }}>
                📋 Copy & Share via Email/WhatsApp
              </button>
            </div>
          )}
        </div>
      )}

      {tab === 'list' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>All Demo Logins ({list.length})</h3>
            <button onClick={loadList} style={btn()}>{t('refresh')}</button>
          </div>
          {list.length === 0 ? <p style={{ color: '#6B7280' }}>No demo logins yet.</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['School','City','Email','Password','Expires','Status'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map((d,i) => {
                    const expired = new Date(d.expires_at) < new Date();
                    return (
                      <tr key={d.id} style={{ background: i%2===0?'#fff':'#F9FAFB' }}>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontWeight: 600 }}>{d.school_name}</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>{d.city || '—'}</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontSize: 11 }}>{d.email}</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontWeight: 700 }}>{d.password_plain}</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>{d.expires_at ? new Date(d.expires_at).toLocaleDateString('en-IN') : '—'}</td>
                        <td style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6' }}>
                          <span style={{ background: expired?'#FEE2E2':'#D1FAE5', color: expired?'#DC2626':'#059669', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                            {expired ? 'Expired' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
