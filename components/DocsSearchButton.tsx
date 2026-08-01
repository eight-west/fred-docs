import { SearchIcon } from './SearchIcon';

export function DocsSearchButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className='flex min-w-[280px] cursor-pointer items-center gap-2.5 rounded-btn border border-edge-soft bg-[rgba(8,14,8,0.7)] px-3.5 py-1.5 text-[13px] text-tertiary-soft transition-colors hover:border-edge-soft-strong'
    >
      <SearchIcon />
      <span className='flex-1 text-left'>Search docs...</span>
      <span className='rounded-btn bg-[rgba(138,171,135,0.08)] px-1.5 py-0.5 font-mono text-[10px] text-tertiary-soft'>
        &#8984;K
      </span>
    </button>
  );
}
