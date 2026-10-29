import { useEffect, useId, useState } from 'react';
import cn from 'classnames';
import type { PageEntry } from '../registry';
import { DocsNavList } from './DocsNavList';

// Below md the sidebar is hidden, so the page list folds into a disclosure
// above the content. Not a modal: it pushes the page down.
export function DocsMobileNav({ current }: { current: PageEntry }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => setOpen(false), [current.slug]);

  return (
    <div className='mb-s29 md:hidden'>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(o => !o)}
        className='flex w-full items-center justify-between gap-3 rounded-pill border border-edge-strong bg-surface px-5 py-2.5 text-left transition-colors hover:border-edge-hover-strong'
      >
        <span className='min-w-0'>
          <span className='block truncate font-mono text-[11px] uppercase tracking-[0.12em] text-gold'>
            {current.section}
          </span>
          <span className='block truncate text-[15px] tracking-brand text-primary'>
            {current.label}
          </span>
        </span>
        <svg
          aria-hidden='true'
          width='14'
          height='14'
          viewBox='0 0 16 16'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={cn(
            'shrink-0 text-secondary transition-transform duration-300 ease-brand motion-reduce:transition-none',
            open && 'rotate-180'
          )}
        >
          <path d='M4 6l4 4 4-4' />
        </svg>
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label='Docs'
          className='docs-pop mt-2 rounded-panel border border-edge bg-surface p-3 shadow-float'
        >
          <DocsNavList
            currentSlug={current.slug}
            onNavigate={() => setOpen(false)}
          />
        </nav>
      )}
    </div>
  );
}
