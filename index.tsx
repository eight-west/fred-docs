import { useEffect, useMemo, useState } from 'react';

import IntroductionPage, { introductionToc } from './Content/Introduction';
import FirstQueryPage, { firstQueryToc } from './Content/FirstQuery';
import ReadingAnswersPage, { readingAnswersToc } from './Content/Answers';
import ScopePage, { scopeToc } from './Content/Scope';

import CapabilitiesOverviewPage, {
  capabilitiesOverviewToc,
} from './Content/CapabilitiesOverview';
import FacilitySitingPage, {
  facilitySitingToc,
} from './Content/FacilitySiting';
import RegionalSupplyPage, {
  regionalSupplyToc,
} from './Content/RegionalSupply';
import FireTradeoffsPage, { fireTradeoffsToc } from './Content/FireTradeoffs';
import MultiYearPage, { multiYearToc } from './Content/MultiYear';
import ComparingLocationsPage, {
  comparingLocationsToc,
} from './Content/ComparingLocations';

import UnderstandingCostPage, {
  understandingCostToc,
} from './Content/UnderstandingCost';
import UnderstandingSupplyPage, {
  understandingSupplyToc,
} from './Content/UnderstandingSupply';
import UnderstandingFirePage, {
  understandingFireToc,
} from './Content/UnderstandingFire';
import UnderstandingTransportPage, {
  understandingTransportToc,
} from './Content/UnderstandingTransport';

import MethodologyOverviewPage, {
  methodologyOverviewToc,
} from './Content/MethodologyOverview';
import HarvestCostMethodPage, {
  harvestCostMethodToc,
} from './Content/HarvestCostMethod';
import TransportMethodPage, {
  transportMethodToc,
} from './Content/TransportMethod';
import FireMethodPage, { fireMethodToc } from './Content/FireMethod';

import GlossaryPage, { glossaryToc } from './Content/Glossary';
import FAQPage, { faqToc } from './Content/Faq';
import CitingFredPage, { citingFredToc } from './Content/CitingFred';

/* ----------------------------------------------------------- Page registry */

type PageEntry = {
  slug: string;
  label: string;
  section: string;
  Component: () => JSX.Element;
  toc: { id: string; label: string }[];
};

const PAGES: PageEntry[] = [
  // Getting started: what FRED is, how to use it, what to expect
  {
    slug: 'introduction',
    label: 'Introduction',
    section: 'Getting started',
    Component: IntroductionPage,
    toc: introductionToc,
  },
  {
    slug: 'first-query',
    label: 'Your first query',
    section: 'Getting started',
    Component: FirstQueryPage,
    toc: firstQueryToc,
  },
  {
    slug: 'reading-answers',
    label: "Reading FRED's answers",
    section: 'Getting started',
    Component: ReadingAnswersPage,
    toc: readingAnswersToc,
  },
  {
    slug: 'scope',
    label: "What FRED can and can't do",
    section: 'Getting started',
    Component: ScopePage,
    toc: scopeToc,
  },

  // Capabilities: the kinds of queries FRED handles
  {
    slug: 'capabilities-overview',
    label: 'Overview',
    section: 'Capabilities',
    Component: CapabilitiesOverviewPage,
    toc: capabilitiesOverviewToc,
  },
  {
    slug: 'facility-siting',
    label: 'Facility siting',
    section: 'Capabilities',
    Component: FacilitySitingPage,
    toc: facilitySitingToc,
  },
  {
    slug: 'regional-supply',
    label: 'Regional supply analysis',
    section: 'Capabilities',
    Component: RegionalSupplyPage,
    toc: regionalSupplyToc,
  },
  {
    slug: 'fire-tradeoffs',
    label: 'Fire-risk tradeoffs',
    section: 'Capabilities',
    Component: FireTradeoffsPage,
    toc: fireTradeoffsToc,
  },
  {
    slug: 'multi-year',
    label: 'Multi-year planning',
    section: 'Capabilities',
    Component: MultiYearPage,
    toc: multiYearToc,
  },
  {
    slug: 'comparing-locations',
    label: 'Comparing locations',
    section: 'Capabilities',
    Component: ComparingLocationsPage,
    toc: comparingLocationsToc,
  },

  // Understanding the numbers: interpreting outputs
  {
    slug: 'understanding-cost',
    label: 'Cost: $/BDT and LCOE',
    section: 'Understanding the numbers',
    Component: UnderstandingCostPage,
    toc: understandingCostToc,
  },
  {
    slug: 'understanding-supply',
    label: 'Supply: BDT/year',
    section: 'Understanding the numbers',
    Component: UnderstandingSupplyPage,
    toc: understandingSupplyToc,
  },
  {
    slug: 'understanding-fire',
    label: 'Fire risk and alpha',
    section: 'Understanding the numbers',
    Component: UnderstandingFirePage,
    toc: understandingFireToc,
  },
  {
    slug: 'understanding-transport',
    label: 'Transport circuity',
    section: 'Understanding the numbers',
    Component: UnderstandingTransportPage,
    toc: understandingTransportToc,
  },

  // Methodology: the research behind the predictions
  {
    slug: 'methodology-overview',
    label: 'Overview',
    section: 'Methodology',
    Component: MethodologyOverviewPage,
    toc: methodologyOverviewToc,
  },
  {
    slug: 'harvest-cost-method',
    label: 'Harvest cost surrogate',
    section: 'Methodology',
    Component: HarvestCostMethodPage,
    toc: harvestCostMethodToc,
  },
  {
    slug: 'transport-method',
    label: 'Transport circuity model',
    section: 'Methodology',
    Component: TransportMethodPage,
    toc: transportMethodToc,
  },
  {
    slug: 'fire-method',
    label: 'Fire-aware Pareto framework',
    section: 'Methodology',
    Component: FireMethodPage,
    toc: fireMethodToc,
  },

  // Reference: glossary, FAQ, citations
  {
    slug: 'glossary',
    label: 'Glossary',
    section: 'Reference',
    Component: GlossaryPage,
    toc: glossaryToc,
  },
  {
    slug: 'faq',
    label: 'FAQ',
    section: 'Reference',
    Component: FAQPage,
    toc: faqToc,
  },
  {
    slug: 'citing-fred',
    label: 'Citing FRED',
    section: 'Reference',
    Component: CitingFredPage,
    toc: citingFredToc,
  },
];

const SECTION_ORDER = [
  'Getting started',
  'Capabilities',
  'Understanding the numbers',
  'Methodology',
  'Reference',
];

/* ------------------------------------------------------------------- Hooks */

function useHashSlug(defaultSlug: string): string {
  const [slug, setSlug] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultSlug;
    const hash = window.location.hash.replace(/^#/, '');
    // Hash can be a page slug or a section anchor inside the current page.
    // We only treat it as a page slug if it matches one of our registered pages.
    const isPage = PAGES.some((p) => p.slug === hash);
    return isPage ? hash : defaultSlug;
  });

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash.replace(/^#/, '');
      const isPage = PAGES.some((p) => p.slug === hash);
      if (isPage) {
        setSlug(hash);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return slug;
}

function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (ids.length === 0) return;
    setActive(ids[0]);

    function onScroll() {
      const scrollY = window.scrollY + 160;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);

  return active;
}

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
              href='/'
              className='flex items-center gap-2 text-base font-medium tracking-[0.01em] text-primary no-underline'
            >
              FRED
              <span className='rounded border border-edge-soft-strong px-1.5 py-0.5 text-[10px] uppercase tracking-[0.06em] text-[rgba(138,171,135,0.8)]'>
                Beta
              </span>
            </a>
            <span className='h-[18px] w-px bg-edge-soft-strong' />
            <span className='text-sm text-secondary-warm'>Docs</span>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className='flex min-w-[280px] cursor-pointer items-center gap-2.5 rounded-lg border border-edge-soft bg-[rgba(8,14,8,0.7)] px-3.5 py-1.5 text-[13px] text-tertiary-soft transition-colors hover:border-edge-soft-strong'
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
            <span className='rounded bg-[rgba(138,171,135,0.08)] px-1.5 py-0.5 font-mono text-[10px] text-tertiary-soft'>
              ⌘K
            </span>
          </button>

          <div className='flex items-center gap-3'>
            <a
              href='/dashboard'
              className='rounded-lg bg-primary px-3.5 py-1.5 text-[13px] font-medium text-canvas-deep no-underline'
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
            onClick={(e) => e.stopPropagation()}
            className='w-full max-w-[560px] overflow-hidden rounded-xl border border-edge-soft-strong bg-surface-deep'
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search documentation...'
                className='flex-1 border-none bg-transparent text-[15px] text-primary outline-none'
              />
              <span className='rounded bg-[rgba(138,171,135,0.08)] px-2 py-0.5 font-mono text-[10px] text-tertiary-soft'>
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
          {SECTION_ORDER.map((section) => {
            const items = PAGES.filter((p) => p.section === section);
            return (
              <div key={section} className='mb-6'>
                <div className='mb-2.5 pl-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-tertiary-soft'>
                  {section}
                </div>
                {items.map((item) => {
                  const isActive = item.slug === currentPage.slug;
                  return (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className={`-ml-2.5 block rounded-md border-l-2 py-1.5 pl-2.5 text-[13px] leading-snug no-underline transition-colors hover:bg-[rgba(138,171,135,0.04)] hover:text-primary ${
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
                className='rounded-lg border border-edge-soft bg-surface-deep p-5 text-primary no-underline transition-colors hover:border-edge-soft-strong'
              >
                <div className='mb-2 font-mono text-[10px] tracking-[0.12em] text-tertiary-soft'>
                  ← PREVIOUS
                </div>
                <div className='text-[15px] font-medium'>{prevPage.label}</div>
              </a>
            ) : (
              <div />
            )}
            {nextPage ? (
              <a
                href={`#${nextPage.slug}`}
                className='rounded-lg border border-edge-soft bg-surface-deep p-5 text-right text-primary no-underline transition-colors hover:border-edge-soft-strong'
              >
                <div className='mb-2 font-mono text-[10px] tracking-[0.12em] text-tertiary-soft'>
                  NEXT →
                </div>
                <div className='text-[15px] font-medium'>{nextPage.label}</div>
              </a>
            ) : (
              <div />
            )}
          </nav>
        </main>

        <aside className='hidden self-start pt-4 xl:sticky xl:top-20 xl:block xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto'>
          <div className='mb-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-tertiary-soft'>
            On this page
          </div>
          {currentPage.toc.map((t) => {
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

          <div className='mt-8 rounded-lg border border-edge-soft bg-accent/[0.04] p-3.5'>
            <div className='mb-1.5 font-mono text-[10px] tracking-[0.1em] text-accent'>
              TRY IT
            </div>
            <p className='mb-2.5 text-xs leading-snug text-secondary-warm'>
              See FRED resolve a procurement query in real time.
            </p>
            <a
              href='/chat'
              className='inline-block text-xs font-medium text-primary no-underline'
            >
              Launch FRED →
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
