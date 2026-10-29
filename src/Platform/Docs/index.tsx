import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { SiteNav } from '../../Shared/SiteNav';
import { Footer } from '../../Shared/Footer';
import { ThemeToggle } from '../../Shared/ThemeToggle';
import { SITE_ORIGIN } from '../../Resources/Constants';
import { useScrollSpy } from '../Hooks/useScrollSpy';
import { useSearchPalette } from '../Hooks/useSearchPalette';
import { useHashScroll } from '../Hooks/useHashScroll';
import { useDocumentMeta } from '../Hooks/useDocumentMeta';
import { useSiteTheme } from '../Hooks/useSiteTheme';
import { PAGES } from './registry';
import { DOCS_DEFAULT_SLUG, docsPath } from './docsPath';
import {
  DocsMobileNav,
  DocsPager,
  DocsSearchButton,
  DocsSearchPalette,
  DocsSidebar,
  DocsToc,
  ReadingProgress,
  TryItCard
} from './components';

export default function DocsPage() {
  const { slug } = useParams<{ slug: string }>();
  const matched = PAGES.find(p => p.slug === slug);
  const currentPage = matched ?? PAGES[0];
  const tocIds = useMemo(() => currentPage.toc.map((t) => t.id), [currentPage]);
  const activeAnchor = useScrollSpy(tocIds);
  const { theme, toggle } = useSiteTheme();

  const currentIndex = PAGES.findIndex((p) => p.slug === currentPage.slug);
  const prevPage = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
  const nextPage =
    currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

  const { open: searchOpen, openPalette, closePalette } = useSearchPalette();
  useHashScroll();

  useDocumentMeta({
    title: `${currentPage.label} • FRED Docs`,
    description: currentPage.description,
    canonical: `${SITE_ORIGIN}${docsPath(currentPage.slug)}`,
    type: 'article'
  });

  if (!matched) return <Navigate to={docsPath(DOCS_DEFAULT_SLUG)} replace />;

  const Content = currentPage.Component;

  return (
    // overflow-x-clip, not hidden: hidden would make this the scroll container
    // and the sticky nav, sidebar and contents would stop sticking.
    <div className='relative min-h-screen overflow-x-clip bg-canvas text-primary'>
      <ReadingProgress />
      <SiteNav
        search={<DocsSearchButton onOpen={openPalette} />}
        themeToggle={<ThemeToggle theme={theme} onToggle={toggle} />}
      />

      {searchOpen && <DocsSearchPalette onClose={closePalette} />}

      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-glow-soft'
      />

      <div className='relative mx-auto grid max-w-content grid-cols-1 gap-6 px-5 pb-s104 pt-s29 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12 md:px-8 md:pt-s59 xl:grid-cols-[230px_minmax(0,1fr)_240px]'>
        <DocsSidebar currentSlug={currentPage.slug} />

        <main id='main-content' tabIndex={-1} className='min-w-0 outline-none'>
          <DocsMobileNav current={currentPage} />

          {/* Keyed so each page plays its entrance, and a CSS animation so the
              text is in the DOM, and readable without JS, from the first frame. */}
          <article key={currentPage.slug} className='docs-rise fred-doc-prose'>
            <Content />
          </article>

          <DocsPager prev={prevPage} next={nextPage} />
        </main>

        <aside className='hidden self-start xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto'>
          <DocsToc entries={currentPage.toc} activeId={activeAnchor} />

          <TryItCard />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
