import React from 'react';

const TEACHER_CONFIG = {
  'Dadi Ji':  { emoji: '👵', bg: '#F59E0B', label: '👵 Dadi Ji sikhati hain' },
  'Hitansh':  { emoji: '🏏', bg: '#3B82F6', label: '🏏 Hitansh sikhata hai' },
  'Bhavika':  { emoji: '📚', bg: '#10B981', label: '📚 Bhavika sikhati hain' },
};

function TeacherBadge({ teacher }) {
  const config = TEACHER_CONFIG[teacher] || TEACHER_CONFIG['Dadi Ji'];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: config.bg,
      color: 'white',
      borderRadius: 100,
      padding: '6px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      marginBottom: 16,
    }}>
      {config.label}
    </div>
  );
}

export default function WatchTab({ lesson, glass }) {
  const videoId = lesson.youtube_video_id;
  const teacher = lesson.videoTeacher || 'Dadi Ji';

  if (!videoId) {
    return (
      <div style={{
        background: '#0A1628',
        borderRadius: 16,
        padding: '56px 32px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(10,22,40,0.12)',
      }}>
        <TeacherBadge teacher={teacher} />
        <div style={{ fontSize: 48, marginBottom: 20 }}>🎬</div>
        <h2 className="font-heading" style={{
          fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 10,
        }}>
          Video Coming Soon!
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15,
          color: 'rgba(255,255,255,0.7)', margin: 0,
        }}>
          Dadi Ji is preparing this lesson video
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, width: '100%' }}>
      {/* Character badge */}
      <TeacherBadge teacher={teacher} />

      {/* 16:9 video player */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0A1628',
        boxShadow: '0 8px 32px rgba(10,22,40,0.15)',
        marginBottom: 16,
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={lesson.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            border: 'none',
          }}
        />
      </div>

      {/* Video info card */}
      <div style={{
        ...glass,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>▶</span>
        <div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: '#0A1628' }}>
            {lesson.title} — Video Lesson
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Watch and follow along at your own pace
          </div>
        </div>
      </div>
    </div>
  );
}