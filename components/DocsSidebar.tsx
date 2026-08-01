import cn from 'classnames';
import { Link } from 'react-router-dom';
import { PAGES, SECTION_ORDER } from '../registry';
import { docsPath } from '../docsPath';

export function DocsSidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <aside className='hidden self-start pt-4 md:sticky md:top-20 md:block md:max-h-[calc(100vh-100px)] md:overflow-y-auto'>
      {SECTION_ORDER.map(section => (
        <div key={section} className='mb-6'>
          <div className='mb-3 pl-2.5 font-mono text-caption uppercase tracking-[0.12em] text-gold'>
            {section}
          </div>
          {PAGES.filter(p => p.section === section).map(item => (
            <Link
              key={item.slug}
              to={docsPath(item.slug)}
              className={cn(
                '-ml-2.5 block rounded-btn border-l-2 py-1.5 pl-2.5 text-[14px] leading-snug tracking-brand no-underline transition-colors hover:bg-[rgba(138,171,135,0.04)] hover:text-primary',
                item.slug === currentSlug
                  ? '-ml-3 border-accent bg-accent/[0.06] pl-3 text-primary'
                  : 'border-transparent text-secondary-warm'
              )}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
