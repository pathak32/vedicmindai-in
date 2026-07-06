import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/lib/LanguageContext';

const ROOT_ROUTES = ['/', '/dashboard', '/learn', '/practice'];

export default function MobileAppHeader() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  if (ROOT_ROUTES.includes(location.pathname)) return null;

  return (
    <>
      <div className="mobile-app-header safe-top" style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(30,64,175,0.1)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48, padding: '0 8px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 12px',
              borderRadius: 8,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              color: '#0A1628',
              fontWeight: 500,
              minHeight: 44,
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            {t('back')}
          </button>
          <LanguageToggle size="xs" />
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .mobile-app-header { display: block !important; }
        }
      `}</style>
    </>
  );
}
