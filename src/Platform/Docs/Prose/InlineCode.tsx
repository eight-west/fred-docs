import { ReactNode } from 'react';

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className='rounded-btn border border-edge-soft bg-[rgba(138,171,135,0.08)] px-1.5 py-px font-mono text-[0.88em] text-primary'>
      {children}
    </code>
  );
}

/* --------------------------------------------------------------- CodeBlock */
