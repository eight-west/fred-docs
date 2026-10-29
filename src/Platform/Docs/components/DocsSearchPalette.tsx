import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from './SearchIcon';
import { filterSearch } from '../search';
import { docsPath } from '../docsPath';

export function DocsSearchPalette({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const results = filterSearch(search);

  return (
    <div
      onClick={onClose}
      className='docs-fade fixed inset-0 z-[100] flex items-start justify-center bg-canvas-deep/70 px-4 pt-20 backdrop-blur-[6px] md:pt-24'
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Search documentation'
        onClick={e => e.stopPropagation()}
        className='docs-pop w-full max-w-[560px] overflow-hidden rounded-panel border border-edge-strong bg-surface shadow-float'
      >
        <div className='flex items-center gap-3 border-b border-edge-soft px-5 py-4'>
          <SearchIcon size={16} className='text-secondary' />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search documentation'
            aria-label='Search documentation'
            className='flex-1 rounded-tile border-none bg-transparent text-[15px] text-primary outline-none placeholder:text-secondary-soft'
          />
          <span className='rounded-pill bg-surface-tint px-2 py-0.5 font-mono text-[11px] text-secondary-soft'>
            ESC
          </span>
        </div>
        <div className='max-h-[360px] overflow-auto p-2'>
          {results.map(r => (
            <Link
              key={r.slug}
              to={docsPath(r.slug)}
              onClick={onClose}
              className='flex items-center gap-3 rounded-tile px-3 py-2.5 text-sm text-primary no-underline transition-colors hover:bg-accent-faint focus-visible:bg-accent-faint'
            >
              <span className='min-w-[110px] font-mono text-[11px] uppercase tracking-[0.08em] text-secondary-soft'>
                {r.section}
              </span>
              <span>{r.label}</span>
            </Link>
          ))}
          {results.length === 0 && (
            <p className='m-0 p-5 text-center text-[13px] text-secondary-soft'>
              No results for &quot;{search}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
