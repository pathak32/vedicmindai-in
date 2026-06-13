import React, { useState, useEffect } from 'react';

const TEACHER_LABELS = {
  'Dadi Ji': '👵 Dadi Ji sikhati hain',
  'Hitansh': '🏏 Hitansh sikhata hai',
  'Bhavika': '📚 Bhavika sikhati hain',
};

function VideoModal({ videoId, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 800, position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -40, right: 0,
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', borderRadius: 8, padding: '6px 14px',
            fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
          }}
        >
          ✕ Close
        </button>
        <div style={{
          position: 'relative', width: '100%', paddingTop: '56.25%',
          borderRadius: 16, overflow: 'hidden', background: '#0A1628',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function VideoButton({ lesson }) {
  const [open, setOpen] = useState(false);
  const videoId = lesson.youtube_video_id;
  const teacher = lesson.videoTeacher || 'Dadi Ji';
  const teacherLabel = TEACHER_LABELS[teacher] || TEACHER_LABELS['Dadi Ji'];

  if (!videoId) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%', height: 56, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #0A1628, #1E40AF)',
          borderRadius: 12, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px',
          boxShadow: '0 4px 16px rgba(30,64,175,0.25)',
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#3B82F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: 'white', fontSize: 14, marginLeft: 2 }}>▶</span>
        </div>
        <span style={{
          flex: 1, textAlign: 'left',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'white',
        }}>
          Watch Lesson Video — {teacherLabel}
        </span>
        <span style={{
          background: '#F59E0B', color: 'white',
          borderRadius: 99, padding: '3px 10px',
          fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
          flexShrink: 0,
        }}>
          NEW
        </span>
      </button>

      {open && <VideoModal videoId={videoId} onClose={() => setOpen(false)} />}
    </>
  );
}