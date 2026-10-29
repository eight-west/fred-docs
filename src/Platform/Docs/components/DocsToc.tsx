import cn from 'classnames';
import { useMarker } from '../../Hooks/useMarker';

type DocsTocProps = {
  entries: { id: string; label: string }[];
  activeId: string;
};

export function DocsToc({ entries, activeId }: DocsTocProps) {
  const [listRef, marker] = useMarker<HTMLDivElement>(activeId, [entries]);

  return (
    <nav
      aria-label='On this page'
      className='rounded-panel border border-edge bg-surface p-5'
    >
      <p className='m-0 mb-3.5 font-mono text-mono-label uppercase tracking-[0.12em] text-gold'>
        On this page
      </p>
      <div ref={listRef} className='relative border-l border-edge'>
        {marker && (
          <span
            aria-hidden='true'
            className='absolute -left-px top-0 w-0.5 rounded-pill bg-accent transition-[transform,height] duration-500 ease-brand motion-reduce:transition-none'
            style={{ height: marker.h, transform: `translateY(${marker.y}px)` }}
          />
        )}
        {entries.map(t => (
          <a
            key={t.id}
            data-marker={t.id}
            href={`#${t.id}`}
            aria-current={activeId === t.id ? 'location' : undefined}
            className={cn(
              'block py-1.5 pl-3.5 text-[13px] leading-snug no-underline transition-colors duration-300 hover:text-primary',
              activeId === t.id ? 'text-primary' : 'text-secondary-soft'
            )}
          >
            {t.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
