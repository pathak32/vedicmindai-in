// Video Library data — homepage video carousel (Item 5 of the homepage plan).
// All entries below are REAL links, provided by Hitesh Jul 23.
//
// The 5 YouTube entries have accurate titles — matched directly against the
// actual lesson video IDs in curriculumData.jsx, so these are guaranteed
// correct, not guessed.
//
// The Facebook and Instagram Reel entries use honest, generic titles since
// their specific content wasn't provided — just links. If real titles/topics
// become available later, swap them in here; no other change needed.
//
// platform: 'youtube' | 'facebook' | 'instagram'

// YouTube thumbnails use a stable, unauthenticated, non-expiring URL
// pattern (no API call needed) -- https://i.ytimg.com/vi/{videoId}/hqdefault.jpg
export function getYoutubeThumbnail(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  const videoId = match ? match[1] : null;
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

export const videoLibraryData = [
  {
    id: 'v1',
    platform: 'youtube',
    title: 'Introduction to Vedic Mathematics',
    url: 'https://www.youtube.com/watch?v=Dy4V6yVReRY',
  },
  {
    id: 'v2',
    platform: 'youtube',
    title: 'Nikhilam — Multiplication Near 10',
    url: 'https://www.youtube.com/watch?v=d_LaXX99e30',
  },
  {
    id: 'v3',
    platform: 'youtube',
    title: 'Nikhilam — Multiplication Near 100',
    url: 'https://www.youtube.com/watch?v=zLbqBL5faWs',
  },
  {
    id: 'v4',
    platform: 'youtube',
    title: 'Nikhilam — Multiplication Near 1000',
    url: 'https://www.youtube.com/watch?v=GBU4YAeXiNE',
  },
  {
    id: 'v5',
    platform: 'youtube',
    title: 'Squaring 2-Digit Numbers — General Method',
    url: 'https://www.youtube.com/watch?v=EevFTxaXp5Q',
  },
  {
    id: 'v6',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/1722853775527101/',
  },
  {
    id: 'v7',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/1050691573949485/',
  },
  {
    id: 'v8',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/1009945865124616/',
  },
  {
    id: 'v9',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/1397257355576954/',
  },
  {
    id: 'v10',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/2074346186838663/',
  },
  {
    id: 'v11',
    platform: 'facebook',
    title: 'VedicMindAI — Quick Vedic Maths Trick',
    url: 'https://www.facebook.com/reel/4568644570086244/',
  },
  {
    id: 'v12',
    platform: 'instagram',
    title: 'VedicMindAI — Speed Maths Reel',
    url: 'https://www.instagram.com/vedicmindai/reel/Dat2LggCsir/',
  },
  {
    id: 'v13',
    platform: 'instagram',
    title: 'VedicMindAI — Speed Maths Reel',
    url: 'https://www.instagram.com/vedicmindai/reel/Dasjx4pAQOK/',
  },
  {
    id: 'v14',
    platform: 'instagram',
    title: 'VedicMindAI — Speed Maths Reel',
    url: 'https://www.instagram.com/vedicmindai/reel/DaosmFXkfOe/',
  },
];
