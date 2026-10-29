import { ReactNode } from 'react';

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className='rounded-app-sm border border-edge-soft bg-edge-soft px-1.5 py-px font-mono text-[0.88em] text-primary'>
      {children}
    </code>
  );
}

/* --------------------------------------------------------------- CodeBlock */
