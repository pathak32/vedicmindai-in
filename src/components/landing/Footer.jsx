import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const socialLinks = [
  { icon: Instagram, url: 'https://instagram.com/vedicmindai', label: 'Instagram' },
  { icon: Facebook, url: 'https://www.facebook.com/share/1MHabwnNYm/', label: 'Facebook' },
  { icon: Youtube, url: 'https://youtube.com/@vedicmindai', label: 'YouTube' },
];

export default function Footer() {
  const { t } = useLanguage();

  const scrollToContact = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0A1628] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <img src="/icons/icon-192.png" alt="VedicMindAI logo" className="w-8 h-8 rounded-lg" />
              <span className="font-heading text-xl font-bold text-white">VedicMindAI™</span>
            </div>
            <p className="text-blue-300 text-sm">{t('ancientWisdom')}</p>
            <a
              href="https://play.google.com/store/apps/details?id=in.vedicmindai.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 10, padding: '8px 14px', textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#A5B4FC"><path d="M3.18 23.82a1.5 1.5 0 0 0 2.07.56l11.04-6.38-2.9-2.9-10.21 8.72zm17.04-12.74L17.5 9.36 14.6 12.25l2.9 2.9 2.72-1.57a1.5 1.5 0 0 0 0-2.6zM2.5.56A1.5 1.5 0 0 0 .5 2v20a1.5 1.5 0 0 0 2 1.44V.5a1.5 1.5 0 0 0 0-.07zM5.25.62L16.17 7 13.27 9.9 2.87.93 5.25.62z"/></svg>
              <div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', lineHeight: 1, textTransform: 'uppercase', letterSpacing: 0.8 }}>Get it on</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>Google Play</div>
              </div>
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-row items-center justify-center gap-6">
            <Link to="/privacy" className="text-base text-blue-200 hover:text-white transition-colors">{t('privacy')}</Link>
            <Link to="/terms" className="text-base text-blue-200 hover:text-white transition-colors">{t('terms')}</Link>
            <a href="#contact" onClick={scrollToContact} className="text-base text-blue-200 hover:text-white transition-colors">{t('contact')}</a>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            {socialLinks.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-blue-200 hover:bg-[#3B82F6] hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Single combined bottom line — no more duplicate copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 36, paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
            © {new Date().getFullYear()} VedicMindAI™. All rights reserved. · Trademark application pending (Classes 9, 41 &amp; 42, App. Nos. 7785746, 7785747, 7785748, Govt. of India)
          </p>
        </div>
      </div>
    </footer>
  );
}
