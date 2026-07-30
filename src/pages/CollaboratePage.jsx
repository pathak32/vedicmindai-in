import React, { useState } from 'react';
import { useCanonical } from '@/lib/useCanonical';
import { Link } from 'react-router-dom';
import { getSupabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function CollaboratePage() {
  useCanonical('/collaborate');
  const { t } = useLanguage();
  const [form, setForm] = useState({
    org_name: '', org_type: 'school', city: '', state: '',
    student_count: '', contact_name: '', contact_email: '',
    contact_phone: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.org_name || !form.contact_email || !form.contact_phone) {
      setError(t('collabErrRequired')); return;
    }
    setLoading(true); setError('');
    try {
      const sb = await getSupabase();
      const { error: err } = await sb.from('collaboration_requests').insert({
        ...form,
        created_at: new Date().toISOString(),
        status: 'pending'
      });
      if (err) throw err;
      setSubmitted(true);
    } catch(e) {
      setError(t('collabErrGeneric'));
    }
    setLoading(false);
  }

  const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const label = { fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 5 };

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🤝</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{t('collabReceivedTitle')}</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>{t('collabReceivedDesc')}</p>
        <Link to="/" style={{ background: '#1E40AF', color: 'white', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>{t('collabBackHome')}</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628, #1E40AF)', padding: '48px 24px 40px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{t('collabHeroTitle')}</h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 auto' }}>
          {t('collabHeroSubtitle')}
        </p>
      </div>

      {/* Benefits */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '🎓', title: t('collabForSchoolsTitle'), desc: t('collabForSchoolsDesc') },
            { icon: '📚', title: t('collabForCoachingTitle'), desc: t('collabForCoachingDesc') },
            { icon: '💼', title: t('collabForBusinessTitle'), desc: t('collabForBusinessDesc') },
          ].map((b,i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#0A1628' }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A1628', marginBottom: 24 }}>{t('collabFillDetails')}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={label}>{t('collabOrgName')}</label>
                <input style={inp} placeholder={t('collabOrgNamePlaceholder')} value={form.org_name} onChange={e=>set('org_name',e.target.value)} required />
              </div>
              <div>
                <label style={label}>{t('collabType')}</label>
                <select style={inp} value={form.org_type} onChange={e=>set('org_type',e.target.value)}>
                  <option value="school">{t('collabTypeSchool')}</option>
                  <option value="coaching">{t('collabTypeCoaching')}</option>
                  <option value="college">{t('collabTypeCollege')}</option>
                  <option value="business">{t('collabTypeBusiness')}</option>
                  <option value="ngo">{t('collabTypeNgo')}</option>
                  <option value="other">{t('collabTypeOther')}</option>
                </select>
              </div>
              <div>
                <label style={label}>{t('collabStudentCount')}</label>
                <select style={inp} value={form.student_count} onChange={e=>set('student_count',e.target.value)}>
                  <option value="">{t('collabSelectRange')}</option>
                  <option value="1-50">1–50</option>
                  <option value="51-200">51–200</option>
                  <option value="201-500">201–500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label style={label}>{t('collabCity')}</label>
                <input style={inp} placeholder={t('collabCityPlaceholder')} value={form.city} onChange={e=>set('city',e.target.value)} />
              </div>
              <div>
                <label style={label}>{t('collabState')}</label>
                <input style={inp} placeholder={t('collabStatePlaceholder')} value={form.state} onChange={e=>set('state',e.target.value)} />
              </div>
              <div>
                <label style={label}>{t('collabContactPerson')}</label>
                <input style={inp} placeholder={t('collabContactPersonPlaceholder')} value={form.contact_name} onChange={e=>set('contact_name',e.target.value)} />
              </div>
              <div>
                <label style={label}>{t('collabEmail')}</label>
                <input style={inp} type="email" placeholder={t('collabEmailPlaceholder')} value={form.contact_email} onChange={e=>set('contact_email',e.target.value)} required />
              </div>
              <div>
                <label style={label}>{t('collabPhone')}</label>
                <input style={inp} placeholder="+91 98765 43210" value={form.contact_phone} onChange={e=>set('contact_phone',e.target.value)} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={label}>{t('collabMessage')}</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder={t('collabMessagePlaceholder')} value={form.message} onChange={e=>set('message',e.target.value)} />
              </div>
            </div>

            {error && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#9CA3AF' : '#0A1628', color: 'white', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? t('collabSubmitting') : t('collabSubmitBtn')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>
            {t('collabWhatsappNote')} <a href="https://wa.me/918573000191" style={{ color: '#1E40AF' }}>+91 8573000191</a>
          </p>
        </div>
      </div>
    </div>
  );
}
