import eightWestLogo from '../Resources/Images/8WLogo.png';
import { FOOTER_LINKS } from './siteLinks';

// The landing footer's palette and type at a reference site's height: a
// reader came to look something up, so no link columns and no wordmark band.
export function Footer() {
  return (
    <footer className='w-full border-t border-edge bg-surface'>
      <div className='mx-auto flex max-w-content flex-col gap-s18 px-5 py-s29 md:flex-row md:items-center md:justify-between md:px-8'>
        <div className='flex items-center gap-s14'>
          <img
            src={eightWestLogo}
            alt='8W Research'
            className='footer-logo h-6 opacity-70'
          />
          <span className='font-mono text-mono-label tracking-[0.04em] text-secondary-soft'>
            © 8W Research 2026
          </span>
        </div>

        <ul className='m-0 flex list-none flex-wrap gap-x-s21 gap-y-2 p-0'>
          {FOOTER_LINKS.map(l => (
            <li key={l.label}>
              <a
                href={l.href}
                className='font-mono text-mono-label text-secondary no-underline transition-colors hover:text-primary'
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
