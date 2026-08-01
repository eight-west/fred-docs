import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '../../Shared/SiteHeader';
import { useScrollSpy } from '../Hooks/useScrollSpy';
import { useSearchPalette } from '../Hooks/useSearchPalette';
import { useHashSlug } from '../Hooks/useHashSlug';
import { PAGES } from './registry';
import { DocsPager, DocsSearchButton, DocsSearchPalette, DocsSidebar, DocsToc,
  TryItCard } from './components';


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

  const { open: searchOpen, openPalette, closePalette } = useSearchPalette();

  const Content = currentPage.Component;

  return (
    <div className='min-h-screen bg-canvas-deep text-primary'>
      <SiteHeader section='Docs'>
        <DocsSearchButton onOpen={openPalette} />
      </SiteHeader>

      {searchOpen && (
        <DocsSearchPalette onClose={() => setSearchOpen(false)} />
      )}

      <div className='mx-auto grid max-w-content grid-cols-1 gap-6 px-5 pb-20 pt-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12 md:px-8 md:pb-30 md:pt-8 xl:grid-cols-[240px_minmax(0,1fr)_200px]'>
        <DocsSidebar currentSlug={currentPage.slug} />

        <main className='fred-doc-prose'>
          <Content />

          <DocsPager prev={prevPage} next={nextPage} />
        </main>

        <aside className='hidden self-start pt-4 xl:sticky xl:top-20 xl:block xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto'>
          <DocsToc entries={currentPage.toc} activeId={activeAnchor} />

          <TryItCard />
        </aside>
      </div>
    </div>
  );
}
