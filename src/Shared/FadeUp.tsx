import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../Platform/Hooks/motion';

// Landing/Animations FadeUp from eight-west/fred, trimmed to what the docs use.
// The content is always rendered; only its opacity and offset wait for view.
export function FadeUp({
  children,
  delay = 0,
  duration = 700,
  className
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(24px)',
    transition: `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
