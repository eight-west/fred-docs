import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from './SearchIcon';
import { filterSearch } from '../search';

export function DocsSearchPalette({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const results = filterSearch(search);

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-24 backdrop-blur-[4px]'
    >
      <div
        onClick={e => e.stopPropagation()}
        className='w-full max-w-[560px] overflow-hidden rounded-btn border border-edge-soft-strong bg-surface-deep'
      >
        <div className='flex items-center gap-3 border-b border-edge-soft px-5 py-4'>
          <SearchIcon size={16} className='text-secondary-warm' />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search documentation...'
            className='flex-1 border-none bg-transparent text-[15px] text-primary outline-none'
          />
          <span className='rounded-btn bg-[rgba(138,171,135,0.08)] px-2 py-0.5 font-mono text-[10px] text-tertiary-soft'>
            ESC
          </span>
        </div>
        <div className='max-h-[360px] overflow-auto py-2'>
          {results.map(r => (
            <a
              key={r.slug}
              href={`#${r.slug}`}
              onClick={onClose}
              className='flex items-center gap-3 px-5 py-2.5 text-sm text-primary no-underline hover:bg-accent/[0.06]'
            >
              <span className='min-w-[110px] font-mono text-[10px] tracking-[0.08em] text-tertiary-soft'>
                {r.section.toUpperCase()}
              </span>
              <span>{r.label}</span>
            </a>
          ))}
          {results.length === 0 && (
            <div className='p-5 text-center text-[13px] text-tertiary-soft'>
              No results for &quot;{search}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
