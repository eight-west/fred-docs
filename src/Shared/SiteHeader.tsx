import { ReactNode } from 'react';
import { URL_BLOG, URL_HOME, URL_PLATFORM } from '../Resources/Constants';

// Every destination here lives on the product site, a different origin, so
// these are plain anchors. A router Link would produce a client-side
// navigation to a route this app does not have.
type SiteHeaderProps = {
  section: string;
  children?: ReactNode;
};

export function SiteHeader({ section, children }: SiteHeaderProps) {
  return (
    <header className='sticky top-0 z-40 border-b border-edge-soft bg-canvas/85 backdrop-blur-md'>
      <div className='mx-auto flex max-w-content items-center justify-between gap-6 px-8 py-3.5'>
        <div className='flex items-center gap-4'>
          <a
            href={URL_HOME}
            className='flex items-center gap-2 font-serif text-[15px] font-medium text-primary no-underline'
          >
            FRED
            <span className='rounded-tag border border-edge-strong px-[7px] py-0.5 text-[11px] uppercase tracking-[0.06em] text-[rgba(138,171,135,0.8)]'>
              Beta
            </span>
          </a>
          <span className='h-[18px] w-px bg-edge-soft-strong' />
          <span className='text-sm text-secondary-warm'>{section}</span>
        </div>

        {children}

        <div className='flex items-center gap-8'>
          <a
            href={URL_HOME}
            className='font-mono text-caption text-secondary no-underline transition-colors hover:text-primary'
          >
            Home
          </a>
          <a
            href={URL_BLOG}
            className='font-mono text-caption text-secondary no-underline transition-colors hover:text-primary'
          >
            Blog
          </a>
          <a
            href={URL_PLATFORM}
            className='rounded-pill bg-primary px-3.5 py-2 font-mono text-caption uppercase tracking-[0.04em] text-canvas no-underline'
          >
            Platform
          </a>
        </div>
      </div>
    </header>
  );
}
