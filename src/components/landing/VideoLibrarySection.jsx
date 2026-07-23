import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { videoLibraryData } from '@/data/videoLibraryData';

const PLATFORM_GRADIENTS = {
  instagram: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
  youtube: 'linear-gradient(135deg, #FF0000, #990000)',
  facebook: 'linear-gradient(135deg, #1877F2, #0C5DC7)',
};

function VideoCard({ video }) {
  const PLATFORM_ICONS = { instagram: Instagram, youtube: Youtube, facebook: Facebook };
  const PlatformIcon = PLATFORM_ICONS[video.platform] || Instagram;
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        flex: '0 0 auto', width: 220, scrollSnapAlign: 'start', textDecoration: 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '9 / 16', borderRadius: 16,
        background: PLATFORM_GRADIENTS[video.platform] || PLATFORM_GRADIENTS.instagram,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', marginBottom: 10, boxShadow: '0 8px 24px rgba(10,22,40,0.15)',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.35)', borderRadius: 8, padding: 5 }}>
          <PlatformIcon size={16} color="white" />
        </div>
      </div>
      <p style={{
        margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
        color: '#0A1628', lineHeight: 1.4,
      }}>
        {video.title}
      </p>
    </a>
  );
}

export default function VideoLibrarySection() {
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <section style={{ background: '#0A1628', padding: '80px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 32 }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('videoLibraryLabel')}
          </p>
          <h2 className="font-heading" style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            {t('videoLibraryTitle')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            {t('videoLibrarySubtitle')}
          </p>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            style={{
              display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory',
              paddingBottom: 8, scrollbarWidth: 'none',
            }}
          >
            {videoLibraryData.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Desktop-only prev/next buttons */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous videos"
            className="hidden md:flex"
            style={{
              position: 'absolute', left: -20, top: '38%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%', background: 'white',
              alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <ChevronLeft size={20} color="#0A1628" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next videos"
            className="hidden md:flex"
            style={{
              position: 'absolute', right: -20, top: '38%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%', background: 'white',
              alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <ChevronRight size={20} color="#0A1628" />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
            {t('videoLibraryFollowCta')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a
              href="https://instagram.com/vedicmindai"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10, color: 'white',
                textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              }}
            >
              <Instagram size={16} /> Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1MHabwnNYm/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10, color: 'white',
                textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              }}
            >
              <Facebook size={16} /> Facebook
            </a>
            <a
              href="https://youtube.com/@vedicmindai"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10, color: 'white',
                textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              }}
            >
              <Youtube size={16} /> YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
