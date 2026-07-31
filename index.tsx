import { useEffect, useMemo, useState } from 'react';
import { URL_DASHBOARD_PAGE, URL_LANDING_PAGE } from '../../Resources/Constants';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useHashSlug } from './hooks/useHashSlug';
import { PAGES, SECTION_ORDER } from './registry';

import {
  BORDER_STRONG,
  SERIF,
  TEXT_PRIMARY,
  TEXT_SECONDARY
} from '../../Resources/Theme';


/* ------------------------------------------------------------------- Hooks */

/* --------------------------------------------------------------- Main page */

export default function DocsPage() {
  const currentSlug = useHashSlug('introduction');
  const currentPage = PAGES.find((p) => p.slug === currentSlug) ?? PAGES[0];
  const tocIds = useMemo(() => currentPage.toc.map((t) => t.id), [currentPage]);
  const activeAnchor = useScrollSpy(tocIds);

  const currentIndex = PAGES.findIndex((p) => p.slug === currentPage.slug);
  const prevPage = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
  const nextPage =
    currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const Content = currentPage.Component;

  return (
    <div className='min-h-screen bg-canvas-deep text-primary'>
      <header className='sticky top-0 z-40 border-b border-edge-soft bg-canvas-deep/85 backdrop-blur-md'>
        <div className='mx-auto flex max-w-content items-center justify-between gap-6 px-8 py-3.5'>
          <div className='flex items-center gap-4'>
            <a
              href={URL_LANDING_PAGE}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                color: TEXT_PRIMARY,
                textDecoration: 'none',
                fontWeight: 500,
                fontFamily: SERIF
              }}
            >
              FRED
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 7px',
                  border: `1px solid ${BORDER_STRONG}`,
                  borderRadius: 3.6,
                  color: 'rgba(138,171,135,0.8)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Beta
              </span>
            </a>
            <span className='h-[18px] w-px bg-edge-soft-strong' />
            <span className='text-sm text-secondary-warm'>Docs</span>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className='flex min-w-[280px] cursor-pointer items-center gap-2.5 rounded-btn border border-edge-soft bg-[rgba(8,14,8,0.7)] px-3.5 py-1.5 text-[13px] text-tertiary-soft transition-colors hover:border-edge-soft-strong'
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 20 20'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <circle cx='9' cy='9' r='6' />
              <path d='M14 14l4 4' strokeLinecap='round' />
            </svg>
            <span className='flex-1 text-left'>Search docs...</span>
            <span className='rounded-btn bg-[rgba(138,171,135,0.08)] px-1.5 py-0.5 font-mono text-[10px] text-tertiary-soft'>
              ⌘K
            </span>
          </button>

          <div className='flex items-center gap-8'>
            <a
              key={'Home'}
              href={URL_LANDING_PAGE}
              className='font-mono text-caption'
              style={{
                color: TEXT_SECONDARY,
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={e =>
                (e.currentTarget.style.color = TEXT_PRIMARY)
              }
              onMouseOut={e =>
                (e.currentTarget.style.color = TEXT_SECONDARY)
              }
            >
              {'Home'}
            </a>
            <a
              href={URL_DASHBOARD_PAGE}
              className='rounded-btn bg-primary px-3.5 py-2 font-mono text-caption uppercase tracking-[0.04em] text-canvas no-underline'
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          className='fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-24 backdrop-blur-[4px]'
        >
          <div
            onClick={e => e.stopPropagation()}
            className='w-full max-w-[560px] overflow-hidden rounded-btn border border-edge-soft-strong bg-surface-deep'
          >
            <div className='flex items-center gap-3 border-b border-edge-soft px-5 py-4'>
              <svg
                width='16'
                height='16'
                viewBox='0 0 20 20'
                fill='none'
                stroke='rgba(245,240,230,0.65)'
                strokeWidth='1.5'
              >
                <circle cx='9' cy='9' r='6' />
                <path d='M14 14l4 4' strokeLinecap='round' />
              </svg>
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
              {filterSearch(search).map((r, i) => (
                <a
                  key={i}
                  href={`#${r.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className='flex items-center gap-3 px-5 py-2.5 text-sm text-primary no-underline hover:bg-accent/[0.06]'
                >
                  <span className='min-w-[110px] font-mono text-[10px] tracking-[0.08em] text-tertiary-soft'>
                    {r.section.toUpperCase()}
                  </span>
                  <span>{r.label}</span>
                </a>
              ))}
              {filterSearch(search).length === 0 && (
                <div className='p-5 text-center text-[13px] text-tertiary-soft'>
                  No results for "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='mx-auto grid max-w-content grid-cols-1 gap-6 px-5 pb-20 pt-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12 md:px-8 md:pb-30 md:pt-8 xl:grid-cols-[240px_minmax(0,1fr)_200px]'>
        <aside className='hidden self-start pt-4 md:sticky md:top-20 md:block md:max-h-[calc(100vh-100px)] md:overflow-y-auto'>
          {SECTION_ORDER.map(section => {
            const items = PAGES.filter(p => p.section === section);
            return (
              <div key={section} className='mb-6'>
                <div className='mb-3 pl-2.5 font-mono text-caption uppercase tracking-[0.12em] text-gold'>
                  {section}
                </div>
                {items.map(item => {
                  const isActive = item.slug === currentPage.slug;
                  return (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className={`-ml-2.5 block rounded-btn border-l-2 py-1.5 pl-2.5 text-[14px] tracking-brand leading-snug no-underline transition-colors hover:bg-[rgba(138,171,135,0.04)] hover:text-primary ${
                        isActive
                          ? '-ml-3 border-accent bg-accent/[0.06] pl-3 text-primary'
                          : 'border-transparent text-secondary-warm'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            );
          })}
        </aside>

        <main className='fred-doc-prose'>
          <Content />

          <nav className='mt-20 grid grid-cols-2 gap-3 border-t border-edge-soft pt-8'>
            {prevPage ? (
              <a
                href={`#${prevPage.slug}`}
                className='rounded-card border border-edge-soft p-5 text-primary no-underline transition-colors hover:border-edge-soft-strong'
              >
                <div className='mb-2 font-mono text-caption tracking-[0.12em] text-gold'>
                  ← PREVIOUS
                </div>
                <div className='text-[17px] font-normal tracking-brand'>{prevPage.label}</div>
              </a>
            ) : (
              <div />
            )}
            {nextPage ? (
              <a
                href={`#${nextPage.slug}`}
                className='rounded-card border border-edge-soft p-5 text-right text-primary no-underline transition-colors hover:border-edge-soft-strong'
              >
                <div className='mb-2 font-mono text-caption tracking-[0.12em] text-gold'>
                  NEXT →
                </div>
                <div className='text-[17px] font-normal tracking-brand'>{nextPage.label}</div>
              </a>
            ) : (
              <div />
            )}
          </nav>
        </main>

        <aside className='hidden self-start pt-4 xl:sticky xl:top-20 xl:block xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto'>
          <div className='mb-3.5 font-mono text-caption uppercase tracking-[0.12em] text-gold'>
            On this page
          </div>
          {currentPage.toc.map(t => {
            const active = activeAnchor === t.id;
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`block border-l-2 py-1.5 pl-3 text-xs leading-snug no-underline transition-colors hover:text-primary ${
                  active
                    ? 'border-accent text-primary'
                    : 'border-transparent text-tertiary-soft'
                }`}
              >
                {t.label}
              </a>
            );
          })}

          <div className='mt-8 rounded-card border border-edge-soft p-4'>
            <div className='mb-2 font-mono text-caption tracking-[0.1em] text-gold'>
              TRY IT
            </div>
            <p className='mb-2.5 text-xs leading-snug text-secondary-warm'>
              See FRED resolve a procurement query in real time.
            </p>
            <a
              href='/chat'
              className='inline-block font-mono text-caption uppercase tracking-[0.04em] text-gold no-underline'
            >
              Launch FRED
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Search helper */

function filterSearch(q: string) {
  const all = PAGES.map((p) => ({
    section: p.section,
    label: p.label,
    slug: p.slug,
  }));
  if (!q.trim()) return all.slice(0, 8);
  const lower = q.toLowerCase();
  return all
    .filter(
      (r) =>
        r.label.toLowerCase().includes(lower) ||
        r.section.toLowerCase().includes(lower)
    )
    .slice(0, 10);
}
