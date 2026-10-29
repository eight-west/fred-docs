import { RefObject, useRef, useState } from 'react';
import { useBeforePaint } from './useBeforePaint';

export type Marker = { y: number; h: number } | null;

// One marker slides to the active item, rather than each item drawing and
// erasing its own highlight. Items carry data-marker={key}.
export function useMarker<T extends HTMLElement>(
  active: string | null | undefined,
  deps: unknown[] = []
): [RefObject<T>, Marker] {
  const ref = useRef<T>(null);
  const [marker, setMarker] = useState<Marker>(null);

  useBeforePaint(() => {
    const items = ref.current?.querySelectorAll<HTMLElement>('[data-marker]');
    const el = Array.from(items ?? []).find(i => i.dataset.marker === active);
    setMarker(el ? { y: el.offsetTop, h: el.offsetHeight } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps]);

  return [ref, marker];
}
