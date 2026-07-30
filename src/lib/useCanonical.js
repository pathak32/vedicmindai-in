import { useEffect } from 'react';

// index.html ships a single static canonical tag pointing at the homepage
// (https://www.vedicmindai.in) as a safe default for the very first paint.
// Every public page needs to override it with its OWN URL once mounted --
// otherwise every page tells Google "I'm a duplicate of the homepage,"
// which can suppress all of them from being indexed. BlogPostPage already
// did this per-post; this hook is that same fix, reusable for every other
// public page.
//
// Usage: useCanonical('/pricing') near the top of a page component.
// Pass '' or '/' for the homepage itself (already correct by default, but
// harmless to call anyway).
export function useCanonical(path) {
  useEffect(() => {
    const url = `https://www.vedicmindai.in${path === '/' ? '' : path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Reset back to the site default on unmount so navigating to a page
    // that doesn't call this hook (or hasn't been updated yet) doesn't
    // inherit whatever URL the previous page left behind.
    return () => {
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute('href', 'https://www.vedicmindai.in');
    };
  }, [path]);
}
