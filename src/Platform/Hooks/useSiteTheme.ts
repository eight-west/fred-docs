import { useCallback, useEffect, useState } from 'react';
import { useBeforePaint } from './useBeforePaint';

export type SiteTheme = 'light' | 'dark';

// Read by the inline script in public/index.html too; keep the two in step.
// The same key as biofred.us, so the code reads the same in both repos.
const KEY = 'fred_landing_theme';
const ATTR = 'data-landing-theme';
const QUERY = '(prefers-color-scheme: light)';

function stored(): SiteTheme | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function system(): SiteTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return 'dark';
  return window.matchMedia(QUERY)?.matches ? 'light' : 'dark';
}

/** Follows the system theme until the visitor picks one. */
export function useSiteTheme() {
  const [theme, setTheme] = useState<SiteTheme>(() => stored() ?? system());

  useBeforePaint(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute(ATTR, 'light');
    else root.removeAttribute(ATTR);
  }, [theme]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    if (!mq) return;
    const on = () => {
      if (!stored()) setTheme(mq.matches ? 'light' : 'dark');
    };
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      try {
        window.localStorage.setItem(KEY, next);
      } catch {
        // Private windows can refuse storage; the switch still applies.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
