import { useEffect, useState } from 'react';
import { PAGES } from '../registry';

export function useHashSlug(defaultSlug: string): string {
  const [slug, setSlug] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultSlug;
    const hash = window.location.hash.replace(/^#/, '');
    // Hash can be a page slug or a section anchor inside the current page.
    // We only treat it as a page slug if it matches one of our registered pages.
    const isPage = PAGES.some((p) => p.slug === hash);
    return isPage ? hash : defaultSlug;
  });

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash.replace(/^#/, '');
      const isPage = PAGES.some((p) => p.slug === hash);
      if (isPage) {
        setSlug(hash);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return slug;
}
