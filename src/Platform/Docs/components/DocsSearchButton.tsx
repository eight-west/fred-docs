import { SearchIcon } from './SearchIcon';

export function DocsSearchButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type='button'
      onClick={onOpen}
      aria-label='Search docs'
      aria-keyshortcuts='Meta+K Control+K'
      className='inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-pill border border-edge-strong bg-surface text-[13px] text-secondary transition-colors hover:border-edge-hover-strong hover:text-primary md:w-auto md:min-w-[220px] md:justify-start md:pl-3.5 md:pr-1.5'
    >
      <SearchIcon />
      <span className='hidden flex-1 text-left md:inline'>Search docs</span>
      <span className='hidden rounded-pill bg-surface-tint px-2 py-0.5 font-mono text-[11px] text-secondary-soft md:inline'>
        &#8984;K
      </span>
    </button>
  );
}
