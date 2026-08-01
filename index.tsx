import { useEffect, useMemo, useState } from 'react';
import { filterSearch } from './search';
import { SiteHeader } from '../../Shared/SiteHeader';
import { useScrollSpy } from '../Hooks/useScrollSpy';
import { useHashSlug } from '../Hooks/useHashSlug';
import { PAGES, SECTION_ORDER } from './registry';
import { DocsSearchButton, DocsSearchPalette } from './components';


export default function DocsPage() {
  const pageSlugs = useMemo(() => PAGES.map(p => p.slug), []);
  const currentSlug = useHashSlug('introduction', pageSlugs);
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
      <SiteHeader section='Docs'>
        <DocsSearchButton onOpen={() => setSearchOpen(true)} />
      </SiteHeader>

      {searchOpen && (
        <DocsSearchPalette onClose={() => setSearchOpen(false)} />
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
