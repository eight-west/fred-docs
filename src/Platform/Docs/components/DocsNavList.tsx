import cn from 'classnames';
import { Link } from 'react-router-dom';
import { PAGES, SECTION_ORDER } from '../registry';
import { docsPath } from '../docsPath';
import { useMarker } from '../../Hooks/useMarker';

type DocsNavListProps = {
  currentSlug: string;
  onNavigate?: () => void;
};

// Every page, grouped by section. The sidebar and the phone's page picker both
// render this, so the two can never list different pages.
export function DocsNavList({ currentSlug, onNavigate }: DocsNavListProps) {
  const [listRef, marker] = useMarker<HTMLDivElement>(currentSlug);

  return (
    <div ref={listRef} className='relative'>
      {marker && (
        <span
          aria-hidden='true'
          className='absolute inset-x-0 top-0 rounded-tile bg-accent-faint transition-[transform,height] duration-500 ease-brand motion-reduce:transition-none'
          style={{ height: marker.h, transform: `translateY(${marker.y}px)` }}
        >
          <span className='absolute bottom-2 left-0 top-2 w-0.5 rounded-pill bg-accent' />
        </span>
      )}
      {SECTION_ORDER.map(section => (
        <div key={section} className='mb-6 last:mb-0'>
          <p className='m-0 mb-2 pl-3 font-mono text-mono-label uppercase tracking-[0.12em] text-gold'>
            {section}
          </p>
          {PAGES.filter(p => p.section === section).map(item => {
            const current = item.slug === currentSlug;
            return (
              <Link
                key={item.slug}
                data-marker={item.slug}
                to={docsPath(item.slug)}
                onClick={onNavigate}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'relative block rounded-tile px-3 py-1.5 text-[14px] leading-snug tracking-brand no-underline transition-[color,transform] duration-300 ease-brand hover:translate-x-0.5 hover:text-primary motion-reduce:transition-none motion-reduce:hover:translate-x-0',
                  current ? 'text-primary' : 'text-secondary'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
