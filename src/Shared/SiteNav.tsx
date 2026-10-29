import { ReactNode, useEffect, useId, useState } from 'react';
import cn from 'classnames';

import { URL_HOME, URL_LOGIN } from '../Resources/Constants';
import { BetaBadge } from './BetaBadge';
import { NAV_LINKS } from './siteLinks';

// A faithful copy of SiteNav's solid variant in eight-west/fred. The docs
// cannot read the product's session, so the button always offers sign in;
// the app sends a signed-in visitor on to their dashboard.
type SiteNavProps = {
  search?: ReactNode;
  themeToggle?: ReactNode;
};

const LINK =
  'font-mono text-mono-label no-underline transition-colors hover:text-primary';

export function SiteNav({ search, themeToggle }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav className='sticky top-0 z-50 border-b border-edge-soft bg-canvas/85 backdrop-blur-md'>
      <div className='mx-auto flex max-w-content items-center justify-between gap-s18 px-5 py-3.5 md:px-8'>
        <a
          href={URL_HOME}
          className='flex shrink-0 items-center gap-2 font-serif text-[15px] font-medium text-primary no-underline'
        >
          FRED
          <BetaBadge />
        </a>

        <div className='flex items-center gap-2 md:gap-s21'>
          <div className='hidden items-center gap-6 lg:flex'>
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                aria-current={l.current ? 'page' : undefined}
                className={cn(
                  LINK,
                  l.current ? 'text-primary' : 'text-secondary'
                )}
              >
                {l.label}
              </a>
            ))}
          </div>
          {search}
          {themeToggle}
          <a
            href={URL_LOGIN}
            className='inline-flex min-h-[36px] shrink-0 items-center whitespace-nowrap rounded-pill bg-primary px-s14 font-mono text-mono-label uppercase tracking-[0.04em] text-canvas no-underline transition-colors hover:bg-primary/85'
          >
            Sign in
          </a>
          <button
            type='button'
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(o => !o)}
            className='-mr-2 inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-pill px-2 font-mono text-mono-label uppercase tracking-[0.04em] text-primary lg:hidden'
          >
            <svg
              aria-hidden='true'
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            >
              {open ? (
                <path d='M4 4l10 10M14 4L4 14' />
              ) : (
                <path d='M2.5 5.5h13M2.5 12.5h13' />
              )}
            </svg>
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div
          id={menuId}
          className='border-y border-edge bg-canvas px-5 pb-s21 pt-s7 lg:hidden'
        >
          <ul className='m-0 flex list-none flex-col p-0'>
            {NAV_LINKS.map(l => (
              <li key={l.label} className='border-b border-edge last:border-b-0'>
                <a
                  href={l.href}
                  aria-current={l.current ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className='block py-s14 text-lead tracking-brand text-primary no-underline'
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
