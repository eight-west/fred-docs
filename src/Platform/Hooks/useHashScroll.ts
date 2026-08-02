import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Routers restore scroll by pathname, so a fragment on first paint scrolls
// nowhere: the target does not exist when the browser looks for it.
export function useHashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}
