import { useEffect, useState } from 'react';

// How far down the document the viewport's bottom edge has reached, 0-1.
function readScroll(): number {
  const height = document.documentElement.scrollHeight;
  if (height <= window.innerHeight) return 1;
  return Math.min(1, (window.scrollY + window.innerHeight) / height);
}

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPct(readScroll());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent'
      style={{ transform: `scaleX(${pct})` }}
    />
  );
}
