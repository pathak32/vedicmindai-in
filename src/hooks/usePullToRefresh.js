import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh(onRefresh, threshold = 80) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(null);
  const el = useRef(document.documentElement);

  useEffect(() => {
    const onTouchStart = (e) => {
      if (el.current.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && el.current.scrollTop === 0) {
        setPulling(true);
        setPullDistance(Math.min(delta, threshold * 1.5));
      }
    };

    const onTouchEnd = () => {
      if (pulling && pullDistance >= threshold) {
        onRefresh();
      }
      setPulling(false);
      setPullDistance(0);
      startY.current = null;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [pulling, pullDistance, onRefresh, threshold]);

  return { pulling, pullDistance };
}