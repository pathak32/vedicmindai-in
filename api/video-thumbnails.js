// Vercel Serverless Function — real Facebook/Instagram Reel thumbnails via
// Meta's oEmbed APIs. As of June 15 2026 Meta made these endpoints callable
// WITHOUT an access token (previously required a Facebook Developer App +
// App Review) — see https://developers.facebook.com/blog/post/2026/06/15/
// tokenless-access-to-meta-oembed-apis/. That change is what makes this
// approach viable without asking Hitesh for developer credentials.
//
// YouTube thumbnails don't need this — https://i.ytimg.com/vi/{id}/hqdefault.jpg
// is a stable, unauthenticated, non-expiring URL pattern, computed directly
// in the frontend (see videoLibraryData.js). Only Facebook/Instagram route
// through this function, since their oEmbed thumbnail_url values are signed
// CDN links that can expire — fetching fresh server-side on a cache interval
// keeps them valid without exposing this to every visitor's browser
// individually (rate limits are per-endpoint, not per-visitor).
//
// Fails gracefully per-video: if one Reel's oEmbed call fails (deleted,
// made private, Meta rate-limits us, network hiccup), that entry is simply
// omitted from the response — the frontend falls back to the existing
// gradient+play-icon placeholder for that card, nothing breaks.

const ENTRIES = [
  { id: 'v6', platform: 'facebook', url: 'https://www.facebook.com/reel/1722853775527101/' },
  { id: 'v7', platform: 'facebook', url: 'https://www.facebook.com/reel/1050691573949485/' },
  { id: 'v8', platform: 'facebook', url: 'https://www.facebook.com/reel/1009945865124616/' },
  { id: 'v9', platform: 'facebook', url: 'https://www.facebook.com/reel/1397257355576954/' },
  { id: 'v10', platform: 'facebook', url: 'https://www.facebook.com/reel/2074346186838663/' },
  { id: 'v11', platform: 'facebook', url: 'https://www.facebook.com/reel/4568644570086244/' },
  { id: 'v12', platform: 'instagram', url: 'https://www.instagram.com/vedicmindai/reel/Dat2LggCsir/' },
  { id: 'v13', platform: 'instagram', url: 'https://www.instagram.com/vedicmindai/reel/Dasjx4pAQOK/' },
  { id: 'v14', platform: 'instagram', url: 'https://www.instagram.com/vedicmindai/reel/DaosmFXkfOe/' },
];

async function fetchThumbnail(entry) {
  const endpoint = entry.platform === 'facebook'
    ? 'https://graph.facebook.com/v25.0/oembed_video'
    : 'https://graph.facebook.com/v25.0/instagram_oembed';
  const apiUrl = `${endpoint}?url=${encodeURIComponent(entry.url)}&omitscript=true`;

  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`oEmbed ${entry.platform} returned ${res.status}`);
  const data = await res.json();
  if (!data.thumbnail_url) throw new Error(`oEmbed ${entry.platform} had no thumbnail_url`);
  return { id: entry.id, thumbnailUrl: data.thumbnail_url };
}

export default async function handler(req, res) {
  try {
    const results = await Promise.allSettled(ENTRIES.map(fetchThumbnail));
    const thumbnails = {};
    let failures = 0;
    for (const r of results) {
      if (r.status === 'fulfilled') {
        thumbnails[r.value.id] = r.value.thumbnailUrl;
      } else {
        failures += 1;
        console.warn('Video thumbnail fetch failed:', r.reason?.message);
      }
    }

    res.setHeader('Content-Type', 'application/json');
    // Edge-cache for 6 hours -- Meta's signed CDN thumbnail URLs can expire,
    // so we deliberately re-fetch periodically rather than caching forever.
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');
    res.status(200).json({ thumbnails, fetched: results.length - failures, failed: failures });
  } catch (err) {
    console.error('Video thumbnails handler error:', err.message);
    // Fail gracefully with an empty map -- frontend falls back to the
    // gradient placeholder for every card rather than showing a broken page.
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ thumbnails: {}, fetched: 0, failed: ENTRIES.length });
  }
}
