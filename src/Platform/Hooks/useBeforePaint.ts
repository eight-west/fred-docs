import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect in the browser, so measured or themed UI never paints a
// wrong frame; useEffect in the Node prerender, where a layout effect only
// logs a warning.
export const useBeforePaint =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
