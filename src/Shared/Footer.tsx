import eightWestLogo from '../Resources/Images/8WLogo.png';
import { FOOTER_COLUMNS } from './siteLinks';

// A copy of Landing/sections/Footer in eight-west/fred.
export function Footer() {
  return (
    <footer className='w-full border-t border-edge bg-surface pt-s86'>
      <div className='mx-auto grid max-w-content grid-cols-1 items-start gap-12 px-5 pb-s59 md:grid-cols-[1.1fr_1fr] md:px-8'>
        <div>
          <p className='mb-s21 max-w-[420px] text-[15px] leading-body tracking-brand text-secondary'>
            Spatial agents that show their work.
          </p>
          <img
            src={eightWestLogo}
            alt='8W Research'
            className='footer-logo h-9 opacity-70'
          />
        </div>

        <div className='grid w-full grid-cols-2 gap-8 md:w-auto md:grid-cols-3 md:justify-self-end md:text-right'>
          {FOOTER_COLUMNS.map(col => (
            <div key={col.heading}>
              <div className='mb-4 font-mono text-mono-label uppercase tracking-[0.14em] text-gold'>
                {col.heading}
              </div>
              {col.links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className='block py-1.5 font-mono text-mono-label text-secondary no-underline transition-colors hover:text-primary'
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className='mx-auto max-w-content px-5 md:px-8'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-t border-edge pb-s29 pt-6 font-mono text-mono-label tracking-[0.04em] text-secondary-soft'>
          <span>© 8W Research 2026</span>
          <span className='italic'>"On the right side of AI"</span>
        </div>
      </div>

      <div
        aria-hidden='true'
        className='footer-wordmark-clip flex w-full items-start justify-center'
      >
        <span className='footer-wordmark'>
          FRED
          <span className='italic text-accent'>.</span>
        </span>
      </div>
    </footer>
  );
}
