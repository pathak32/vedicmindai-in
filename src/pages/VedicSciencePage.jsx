import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearnPillarSwitcher from '@/components/learn/LearnPillarSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

const SECTIONS = [
  {
    id: 'physics',
    emoji: '⚛️',
    title: { en: 'Vedic Physics', hi: 'वैदिक भौतिकी' },
    subtitle: { en: 'Ancient discoveries that shaped modern science', hi: 'प्राचीन खोजें जिन्होंने आधुनिक विज्ञान को आकार दिया' },
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
    chapters: [
      { id: 1, title: { en: 'The First Atomic Theory', hi: 'प्रथम परमाणु सिद्धांत' }, sub: { en: 'Rishi Kanada — 600 BCE', hi: 'ऋषि कणाद — 600 ईसा पूर्व' }, ready: true },
      { id: 2, title: { en: 'Gravity Before Newton', hi: 'न्यूटन से पहले गुरुत्वाकर्षण' }, sub: { en: 'Bhaskaracharya — 1114 CE', hi: 'भास्कराचार्य — 1114 ई.' }, ready: true },
      { id: 3, title: { en: 'Speed of Light in the Rig Veda', hi: 'ऋग्वेद में प्रकाश की गति' }, sub: { en: 'Sayana\'s Commentary — 14th century', hi: 'सायण की टीका — 14वीं सदी' }, ready: true },
      { id: 4, title: { en: 'Seven Colors of Sunlight', hi: 'सूर्यप्रकाश के सात रंग' }, sub: { en: 'Yajurveda, Samaveda & Atharva Veda', hi: 'यजुर्वेद, सामवेद और अथर्ववेद' }, ready: true },
      { id: 5, title: { en: 'The World\'s First Electric Battery', hi: 'विश्व की प्रथम विद्युत बैटरी' }, sub: { en: 'Agastya Samhita', hi: 'अगस्त्य संहिता' }, ready: true },
      { id: 6, title: { en: 'Quantum Consciousness', hi: 'क्वांटम चेतना' }, sub: { en: 'Vedanta & Modern Physics', hi: 'वेदांत और आधुनिक भौतिकी' }, ready: false },
      { id: 7, title: { en: 'Kerala School Calculus', hi: 'केरल विद्यालय कैलकुलस' }, sub: { en: 'Madhava — 300 years before Newton', hi: 'माधव — न्यूटन से 300 साल पहले' }, ready: false },
      { id: 8, title: { en: 'Binary Numbers — Pingala', hi: 'बाइनरी संख्याएँ — पिंगल' }, sub: { en: 'Pingala — 300 BCE', hi: 'पिंगल — 300 ईसा पूर्व' }, ready: false },
      { id: 9, title: { en: 'Sound & Frequency in Vedic Texts', hi: 'वैदिक ग्रंथों में ध्वनि और आवृत्ति' }, sub: { en: 'Vedic Mantra Science', hi: 'वैदिक मंत्र विज्ञान' }, ready: false },
      { id: 10, title: { en: 'Aryabhatta — Earth\'s Rotation', hi: 'आर्यभट्ट — पृथ्वी का घूर्णन' }, sub: { en: 'Aryabhatta — 5th century CE', hi: 'आर्यभट्ट — 5वीं सदी ई.' }, ready: false },
    ],
  },
  {
    id: 'chemistry',
    emoji: '🧪',
    title: { en: 'Vedic Chemistry', hi: 'वैदिक रसायन विज्ञान' },
    subtitle: { en: 'Ancient metallurgy, alchemy and material science', hi: 'प्राचीन धातुकर्म, कीमिया और पदार्थ विज्ञान' },
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
    sectionComingSoon: true,
    chapters: [
      { id: 1, title: { en: 'Delhi Iron Pillar — No Rust in 1,600 Years', hi: 'दिल्ली लौह स्तंभ — 1,600 वर्षों में कोई जंग नहीं' }, sub: { en: 'Gupta Empire — 4th-5th century CE', hi: 'गुप्त साम्राज्य — 4-5वीं सदी ई.' }, ready: false },
      { id: 2, title: { en: 'Wootz / Damascus Steel', hi: 'वूट्ज / दमिश्क स्टील' }, sub: { en: 'South India — 300 BCE', hi: 'दक्षिण भारत — 300 ईसा पूर्व' }, ready: false },
      { id: 3, title: { en: 'Ayurvedic Nanoparticles — Bhasmas', hi: 'आयुर्वेदिक नैनोकण — भस्म' }, sub: { en: 'Confirmed by TEM/SEM analysis', hi: 'TEM/SEM विश्लेषण द्वारा पुष्टि' }, ready: false },
      { id: 4, title: { en: 'Nagarjuna\'s Alchemy — Rasayana', hi: 'नागार्जुन की कीमिया — रसायन' }, sub: { en: 'Nagarjuna — 8th-9th century CE', hi: 'नागार्जुन — 8-9वीं सदी ई.' }, ready: false },
      { id: 5, title: { en: 'Zinc Distillation — Zawar Mines', hi: 'जस्ता आसवन — ज़ावर खदानें' }, sub: { en: 'Rajasthan — predates Europe by 1,300 years', hi: 'राजस्थान — यूरोप से 1,300 साल पहले' }, ready: false },
      { id: 6, title: { en: 'Copper & Antimicrobial Science', hi: 'तांबा और रोगाणुरोधी विज्ञान' }, sub: { en: 'Tamra Jal — confirmed by modern studies', hi: 'तांबा जल — आधुनिक अध्ययनों द्वारा पुष्टि' }, ready: false },
      { id: 7, title: { en: 'Turmeric & Curcumin', hi: 'हल्दी और करक्यूमिन' }, sub: { en: 'Vedic herbal chemistry', hi: 'वैदिक हर्बल रसायन' }, ready: false },
      { id: 8, title: { en: 'Indigo Dye — Ancient Organic Chemistry', hi: 'नील रंग — प्राचीन कार्बनिक रसायन' }, sub: { en: 'India was the world\'s primary supplier', hi: 'भारत विश्व का प्राथमिक आपूर्तिकर्ता था' }, ready: false },
      { id: 9, title: { en: 'Green Chemistry in Vedic Texts', hi: 'वैदिक ग्रंथों में हरित रसायन' }, sub: { en: 'Aligns with modern 12 Green Chemistry principles', hi: 'आधुनिक 12 हरित रसायन सिद्धांतों से संरेखित' }, ready: false },
      { id: 10, title: { en: 'Atomic Bonding — Kanada\'s Molecules', hi: 'परमाणु बंधन — कणाद के अणु' }, sub: { en: 'Dvyanuka and Tryanuka', hi: 'द्व्यणुक और त्र्यणुक' }, ready: false },
    ],
  },
  {
    id: 'biology',
    emoji: '🌿',
    title: { en: 'Vedic Biology', hi: 'वैदिक जीव विज्ञान' },
    subtitle: { en: 'Ancient medicine, surgery and life sciences', hi: 'प्राचीन चिकित्सा, शल्य चिकित्सा और जीव विज्ञान' },
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.12)',
    sectionComingSoon: true,
    chapters: [
      { id: 1, title: { en: 'Sushruta — World\'s First Plastic Surgeon', hi: 'सुश्रुत — विश्व के प्रथम प्लास्टिक सर्जन' }, sub: { en: 'Sushruta Samhita — 600 BCE', hi: 'सुश्रुत संहिता — 600 ईसा पूर्व' }, ready: false },
      { id: 2, title: { en: 'Charaka Samhita — 1,120 Illnesses', hi: 'चरक संहिता — 1,120 रोग' }, sub: { en: 'Charaka — 700 BCE', hi: 'चरक — 700 ईसा पूर्व' }, ready: false },
      { id: 3, title: { en: 'Tridosha & Greek Medicine', hi: 'त्रिदोष और ग्रीक चिकित्सा' }, sub: { en: 'Ayurveda → Greek medicine derivation', hi: 'आयुर्वेद → ग्रीक चिकित्सा व्युत्पत्ति' }, ready: false },
      { id: 4, title: { en: 'Ayurvedic Genetics — Before Mendel', hi: 'आयुर्वेदिक आनुवंशिकता — मेंडल से पहले' }, sub: { en: '2,000 years before Mendel\'s genetics', hi: 'मेंडल की आनुवंशिकता से 2,000 साल पहले' }, ready: false },
      { id: 5, title: { en: 'Plant Intelligence — Prana & Science', hi: 'पादप बुद्धिमत्ता — प्राण और विज्ञान' }, sub: { en: 'J.C. Bose\'s Vedic-inspired research', hi: 'जे.सी. बोस का वैदिक-प्रेरित शोध' }, ready: false },
      { id: 6, title: { en: 'Panchakosha — Five-Layer Body', hi: 'पंचकोश — पाँच परत शरीर' }, sub: { en: 'Taittiriya Upanishad', hi: 'तैत्तिरीय उपनिषद' }, ready: false },
      { id: 7, title: { en: 'Vedic Ecology & Biodiversity', hi: 'वैदिक पारिस्थितिकी और जैव विविधता' }, sub: { en: 'Aligns with UN SDG 13 & 15', hi: 'UN SDG 13 और 15 से संरेखित' }, ready: false },
      { id: 8, title: { en: 'Leprosy — First Documentation', hi: 'कुष्ठरोग — प्रथम प्रलेखन' }, sub: { en: 'Atharvaveda — 1500-1200 BCE', hi: 'अथर्ववेद — 1500-1200 ईसा पूर्व' }, ready: false },
      { id: 9, title: { en: 'Sushruta\'s 120 Surgical Instruments', hi: 'सुश्रुत के 120 शल्य चिकित्सा उपकरण' }, sub: { en: 'World\'s first surgical inventory', hi: 'विश्व की प्रथम शल्य चिकित्सा सूची' }, ready: false },
      { id: 10, title: { en: 'Ayurvedic Pharmacology — 700 Plants', hi: 'आयुर्वेदिक औषधि विज्ञान — 700 पौधे' }, sub: { en: 'Charaka Samhita plant database', hi: 'चरक संहिता पादप डेटाबेस' }, ready: false },
    ],
  },
];

const tr = (f, lang) => f?.[lang] ?? f?.en ?? '';

export default function VedicSciencePage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState('physics');

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', color: '#F5F3FF' }}>
      <DashboardNavbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Pillar switcher */}
        <LearnPillarSwitcher active="vedic-science" dark />

        {/* Hero banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1152 0%, #0D1F3C 100%)',
          borderRadius: 18, padding: '28px 28px 24px',
          border: '1px solid rgba(139,92,246,0.25)',
          marginBottom: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 100, opacity: 0.08 }}>🔬</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(139,92,246,0.25)', borderRadius: 100,
            padding: '4px 14px', marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#C4B5FD', letterSpacing: 1 }}>
              ✨ {language === 'hi' ? 'नया विषय' : 'NEW SUBJECT'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: 'white', marginBottom: 8 }}>
            {language === 'hi' ? 'वैदिक विज्ञान' : 'Vedic Science'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 560 }}>
            {language === 'hi'
              ? 'खोजें कि कैसे प्राचीन भारतीय ऋषियों ने परमाणु सिद्धांत, गुरुत्वाकर्षण, प्रकाश और आधुनिक चिकित्सा में योगदान दिया — आधुनिक विज्ञान से सदियों पहले।'
              : 'Discover how ancient Indian rishis contributed to atomic theory, gravity, light, and modern medicine — centuries before Western science formally described them.'}
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { n: '30', label: language === 'hi' ? 'कुल अध्याय' : 'Total Chapters' },
              { n: '3', label: language === 'hi' ? 'विषय खंड' : 'Subject Sections' },
              { n: '5', label: language === 'hi' ? 'अभी उपलब्ध' : 'Available Now' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#A78BFA' }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => (
          <div key={section.id} style={{ marginBottom: 20 }}>
            {/* Section header */}
            <button
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              style={{
                width: '100%', background: section.bg,
                border: `1px solid ${section.color}44`,
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', marginBottom: expandedSection === section.id ? 10 : 0,
              }}
            >
              <span style={{ fontSize: 28 }}>{section.emoji}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'white' }}>
                    {tr(section.title, language)}
                  </span>
                  {section.sectionComingSoon && (
                    <span style={{ fontSize: 10, fontWeight: 800, background: '#F59E0B', color: '#1C0A00', borderRadius: 4, padding: '2px 6px' }}>
                      COMING SOON
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                  {tr(section.subtitle, language)}
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>
                {expandedSection === section.id ? '▲' : '▼'}
              </span>
            </button>

            {/* Chapter list */}
            {expandedSection === section.id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {section.chapters.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => ch.ready && !section.sectionComingSoon
                      ? alert('Chapter viewer coming soon — content is being built!')
                      : null}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${ch.ready && !section.sectionComingSoon ? section.color + '44' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 10, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: ch.ready && !section.sectionComingSoon ? 'pointer' : 'default',
                      opacity: ch.ready && !section.sectionComingSoon ? 1 : 0.6,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: ch.ready && !section.sectionComingSoon
                        ? section.color + '33'
                        : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                    }}>
                      {ch.ready && !section.sectionComingSoon ? '📖' : '🔒'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: ch.ready && !section.sectionComingSoon ? '#E9E4FF' : '#8B85AD' }}>
                        {tr(ch.title, language)}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        {tr(ch.sub, language)}
                      </div>
                    </div>
                    {ch.ready && !section.sectionComingSoon ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: section.color, background: section.color + '22', borderRadius: 6, padding: '2px 8px' }}>
                        {language === 'hi' ? 'उपलब्ध' : 'Available'}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: '#6B6590', fontWeight: 600 }}>
                        {language === 'hi' ? 'शीघ्र आ रहा है' : 'Coming Soon'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer note */}
        <div style={{
          marginTop: 24, padding: '16px 20px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.45)',
          textAlign: 'center',
        }}>
          {language === 'hi'
            ? '🔬 सभी 30 अध्याय जल्द ही उपलब्ध होंगे। हम सटीकता के साथ निर्माण कर रहे हैं।'
            : '🔬 All 30 chapters coming soon. We are building with accuracy and care.'}
        </div>
      </div>
    </div>
  );
}
