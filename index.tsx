import { useEffect, useMemo, useState } from 'react';
import {
  MONO,
  CANVAS,
  SURFACE,
  BORDER,
  BORDER_STRONG,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  ACCENT
} from './Prose';

import IntroductionPage, { introductionToc } from './Content/Introduction';
import QuickstartPage, { quickstartToc } from './Content/Quickstart';
import ConceptsPage, { conceptsToc } from './Content/Concepts';
import GlossaryPage, { glossaryToc } from './Content/Glossary';
import ClusterSupplyPage, { clusterSupplyToc } from './Content/ClusterSupply';
import HarvestCostPage, { harvestCostToc } from './Content/HarvestCost';
import TransportPage, { transportToc } from './Content/Transport';
import BurnProbabilityPage, {
  burnProbabilityToc
} from './Content/BurnProbability';
import CsRagOverviewPage, { csRagOverviewToc } from './Content/CsRagOverview';
import ToolsPage, { toolsToc } from './Content/Tools';
import CachingPage, { cachingToc } from './Content/Caching';
import ReactLoopPage, { reactLoopToc } from './Content/ReactLoop';
import AuthPage, { authToc } from './Content/Auth';
import EndpointsPage, { endpointsToc } from './Content/Endpoints';
import ErrorsPage, { errorsToc } from './Content/Errors';
import RateLimitsPage, { rateLimitsToc } from './Content/RateLimits';
import SelfHostingPage, { selfHostingToc } from './Content/SelfHosting';
import EnvPage, { envToc } from './Content/Env';
import DataPrepPage, { dataPrepToc } from './Content/DataPrep';

/* ================================================================== */
/*  PAGE REGISTRY                                                      */
/* ================================================================== */

interface PageEntry {
  slug: string;
  label: string;
  section: string;
  Component: () => JSX.Element;
  toc: { id: string; label: string }[];
}

const PAGES: PageEntry[] = [
  {
    slug: 'introduction',
    label: 'Introduction',
    section: 'Getting started',
    Component: IntroductionPage,
    toc: introductionToc
  },
  {
    slug: 'quickstart',
    label: 'Quickstart',
    section: 'Getting started',
    Component: QuickstartPage,
    toc: quickstartToc
  },
  {
    slug: 'concepts',
    label: 'Concepts',
    section: 'Getting started',
    Component: ConceptsPage,
    toc: conceptsToc
  },
  {
    slug: 'glossary',
    label: 'Glossary',
    section: 'Getting started',
    Component: GlossaryPage,
    toc: glossaryToc
  },

  {
    slug: 'cluster-supply',
    label: 'Cluster supply',
    section: 'Spatial layers',
    Component: ClusterSupplyPage,
    toc: clusterSupplyToc
  },
  {
    slug: 'harvest-cost',
    label: 'Harvest cost surrogate',
    section: 'Spatial layers',
    Component: HarvestCostPage,
    toc: harvestCostToc
  },
  {
    slug: 'transport',
    label: 'Transport circuity',
    section: 'Spatial layers',
    Component: TransportPage,
    toc: transportToc
  },
  {
    slug: 'burn-probability',
    label: 'Burn probability',
    section: 'Spatial layers',
    Component: BurnProbabilityPage,
    toc: burnProbabilityToc
  },

  {
    slug: 'cs-rag-overview',
    label: 'Architecture overview',
    section: 'CS-RAG',
    Component: CsRagOverviewPage,
    toc: csRagOverviewToc
  },
  {
    slug: 'tools',
    label: 'Tool definitions',
    section: 'CS-RAG',
    Component: ToolsPage,
    toc: toolsToc
  },
  {
    slug: 'caching',
    label: 'Caching model',
    section: 'CS-RAG',
    Component: CachingPage,
    toc: cachingToc
  },
  {
    slug: 'react-loop',
    label: 'ReAct loop',
    section: 'CS-RAG',
    Component: ReactLoopPage,
    toc: reactLoopToc
  },

  {
    slug: 'auth',
    label: 'Authentication',
    section: 'API',
    Component: AuthPage,
    toc: authToc
  },
  {
    slug: 'endpoints',
    label: 'Endpoints',
    section: 'API',
    Component: EndpointsPage,
    toc: endpointsToc
  },
  {
    slug: 'errors',
    label: 'Errors',
    section: 'API',
    Component: ErrorsPage,
    toc: errorsToc
  },
  {
    slug: 'rate-limits',
    label: 'Rate limits',
    section: 'API',
    Component: RateLimitsPage,
    toc: rateLimitsToc
  },

  {
    slug: 'self-hosting',
    label: 'Self-hosting',
    section: 'Deployment',
    Component: SelfHostingPage,
    toc: selfHostingToc
  },
  {
    slug: 'env',
    label: 'Environment variables',
    section: 'Deployment',
    Component: EnvPage,
    toc: envToc
  },
  {
    slug: 'data-prep',
    label: 'Data prep',
    section: 'Deployment',
    Component: DataPrepPage,
    toc: dataPrepToc
  }
];

const SECTION_ORDER = [
  'Getting started',
  'Spatial layers',
  'CS-RAG',
  'API',
  'Deployment'
];

/* ================================================================== */
/*  HOOKS                                                              */
/* ================================================================== */

function useHashSlug(defaultSlug: string): string {
  const [slug, setSlug] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultSlug;
    const hash = window.location.hash.replace(/^#/, '');
    /* Hash can be a page slug or a section anchor inside the current page.
       We only treat it as a page slug if it matches one of our registered
       pages. */
    const isPage = PAGES.some(p => p.slug === hash);
    return isPage ? hash : defaultSlug;
  });

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash.replace(/^#/, '');
      const isPage = PAGES.some(p => p.slug === hash);
      if (isPage) {
        setSlug(hash);
        /* scroll to top when switching pages */
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
  }, [ids.join('|')]);

  return active;
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function DocsPage() {
  const currentSlug = useHashSlug('introduction');
  const currentPage = PAGES.find(p => p.slug === currentSlug) ?? PAGES[0];
  const tocIds = useMemo(() => currentPage.toc.map(t => t.id), [currentPage]);
  const activeAnchor = useScrollSpy(tocIds);

  const currentIndex = PAGES.findIndex(p => p.slug === currentPage.slug);
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
    <div
      style={{
        minHeight: '100vh',
        background: CANVAS,
        color: TEXT_PRIMARY,
        fontFamily: "'Outfit', system-ui, sans-serif"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        body { margin: 0; }
        .fred-doc-heading:hover .fred-doc-anchor { opacity: 1 !important; }
        .fred-doc-prose p { font-size: 15px; line-height: 1.75; color: ${TEXT_SECONDARY}; margin: 0 0 16px; }
        .fred-doc-prose a { color: ${ACCENT}; text-decoration: none; border-bottom: 1px solid rgba(74,222,128,0.25); }
        .fred-doc-prose a:hover { border-bottom-color: ${ACCENT}; }
        .fred-doc-prose ul, .fred-doc-prose ol { font-size: 15px; line-height: 1.75; color: ${TEXT_SECONDARY}; padding-left: 24px; margin: 0 0 16px; }
        .fred-doc-prose li { margin-bottom: 6px; }
        .fred-doc-prose strong { color: ${TEXT_PRIMARY}; font-weight: 500; }
        .fred-doc-prose em { color: ${TEXT_PRIMARY}; font-style: italic; }
        .docs-grid {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr) 200px;
          gap: 48px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 32px 120px;
        }
        @media (max-width: 1100px) {
          .docs-grid { grid-template-columns: 220px minmax(0, 1fr); }
          .docs-toc { display: none; }
        }
        @media (max-width: 760px) {
          .docs-grid { grid-template-columns: 1fr; padding: 24px 20px 80px; }
          .docs-sidebar { display: none; }
        }
        .sidebar-item {
          display: block;
          font-size: 13px;
          color: ${TEXT_SECONDARY};
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          margin-left: -10px;
          border-left: 2px solid transparent;
          line-height: 1.4;
        }
        .sidebar-item:hover {
          color: ${TEXT_PRIMARY};
          background: rgba(138,171,135,0.04);
        }
        .sidebar-item.active {
          color: ${TEXT_PRIMARY};
          background: rgba(74,222,128,0.06);
          border-left-color: ${ACCENT};
          padding-left: 12px;
          margin-left: -12px;
        }
        .docs-grid main h1 { color: ${TEXT_PRIMARY}; }
        .docs-grid main dl, .docs-grid main dd, .docs-grid main dt { color: ${TEXT_SECONDARY}; }
      `}</style>

      {/* ============================== TOP BAR ============================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(6,14,6,0.85)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${BORDER}`
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a
              href='/'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                fontWeight: 500,
                color: TEXT_PRIMARY,
                textDecoration: 'none',
                letterSpacing: '0.01em'
              }}
            >
              FRED
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  border: `1px solid ${BORDER_STRONG}`,
                  borderRadius: 4,
                  color: 'rgba(138,171,135,0.8)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                Beta
              </span>
            </a>
            <span style={{ width: 1, height: 18, background: BORDER_STRONG }} />
            <span style={{ fontSize: 14, color: TEXT_SECONDARY }}>Docs</span>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 14px',
              background: 'rgba(8,14,8,0.7)',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontSize: 13,
              color: TEXT_TERTIARY,
              cursor: 'pointer',
              minWidth: 280,
              fontFamily: 'inherit',
              transition: 'border-color 0.15s'
            }}
            onMouseOver={e =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                BORDER_STRONG)
            }
            onMouseOut={e =>
              ((e.currentTarget as HTMLButtonElement).style.borderColor =
                BORDER)
            }
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
            <span style={{ flex: 1, textAlign: 'left' }}>Search docs...</span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: TEXT_TERTIARY,
                padding: '2px 6px',
                background: 'rgba(138,171,135,0.08)',
                borderRadius: 4
              }}
            >
              ⌘K
            </span>
          </button>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a
              href='https://github.com/aunshx/csrag'
              target='_blank'
              rel='noreferrer'
              style={{
                fontSize: 13,
                color: TEXT_SECONDARY,
                textDecoration: 'none'
              }}
            >
              GitHub
            </a>
            <a
              href='/chat'
              style={{
                background: TEXT_PRIMARY,
                color: CANVAS,
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              Launch FRED
            </a>
          </div>
        </div>
      </header>

      {/* ============================== SEARCH MODAL ============================== */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 100
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 560,
              background: SURFACE,
              border: `1px solid ${BORDER_STRONG}`,
              borderRadius: 12,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: `1px solid ${BORDER}`,
                gap: 12
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 20 20'
                fill='none'
                stroke={TEXT_SECONDARY}
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
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  color: TEXT_PRIMARY,
                  fontFamily: 'inherit'
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: TEXT_TERTIARY,
                  padding: '3px 8px',
                  background: 'rgba(138,171,135,0.08)',
                  borderRadius: 4
                }}
              >
                ESC
              </span>
            </div>
            <div style={{ padding: '8px 0', maxHeight: 360, overflow: 'auto' }}>
              {filterSearch(search).map((r, i) => (
                <a
                  key={i}
                  href={`#${r.slug}`}
                  onClick={() => setSearchOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 20px',
                    color: TEXT_PRIMARY,
                    textDecoration: 'none',
                    fontSize: 14
                  }}
                  onMouseOver={e =>
                    ((e.currentTarget as HTMLAnchorElement).style.background =
                      'rgba(74,222,128,0.06)')
                  }
                  onMouseOut={e =>
                    ((e.currentTarget as HTMLAnchorElement).style.background =
                      'transparent')
                  }
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      color: TEXT_TERTIARY,
                      letterSpacing: '0.08em',
                      minWidth: 110
                    }}
                  >
                    {r.section.toUpperCase()}
                  </span>
                  <span>{r.label}</span>
                </a>
              ))}
              {filterSearch(search).length === 0 && (
                <div
                  style={{
                    padding: '20px',
                    color: TEXT_TERTIARY,
                    fontSize: 13,
                    textAlign: 'center'
                  }}
                >
                  No results for "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================== BODY GRID ============================== */}
      <div className='docs-grid'>
        {/* SIDEBAR */}
        <aside
          className='docs-sidebar'
          style={{
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            paddingTop: 16
          }}
        >
          {SECTION_ORDER.map(section => {
            const items = PAGES.filter(p => p.section === section);
            return (
              <div key={section} style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: TEXT_TERTIARY,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                    paddingLeft: 10
                  }}
                >
                  {section}
                </div>
                {items.map(item => (
                  <a
                    key={item.slug}
                    href={`#${item.slug}`}
                    className={`sidebar-item ${
                      item.slug === currentPage.slug ? 'active' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main className='fred-doc-prose'>
          <Content />

          {/* NEXT / PREV */}
          <nav
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 80,
              paddingTop: 32,
              borderTop: `1px solid ${BORDER}`
            }}
          >
            {prevPage ? (
              <a
                href={`#${prevPage.slug}`}
                style={{
                  padding: 20,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: TEXT_PRIMARY,
                  transition: 'border-color 0.15s'
                }}
                onMouseOver={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    BORDER_STRONG)
                }
                onMouseOut={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    BORDER)
                }
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: TEXT_TERTIARY,
                    letterSpacing: '0.12em',
                    marginBottom: 8
                  }}
                >
                  ← PREVIOUS
                </div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  {prevPage.label}
                </div>
              </a>
            ) : (
              <div />
            )}
            {nextPage ? (
              <a
                href={`#${nextPage.slug}`}
                style={{
                  padding: 20,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: TEXT_PRIMARY,
                  textAlign: 'right',
                  transition: 'border-color 0.15s'
                }}
                onMouseOver={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    BORDER_STRONG)
                }
                onMouseOut={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                    BORDER)
                }
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    color: TEXT_TERTIARY,
                    letterSpacing: '0.12em',
                    marginBottom: 8
                  }}
                >
                  NEXT →
                </div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>
                  {nextPage.label}
                </div>
              </a>
            ) : (
              <div />
            )}
          </nav>
        </main>

        {/* RIGHT-RAIL TOC */}
        <aside
          className='docs-toc'
          style={{
            position: 'sticky',
            top: 80,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            paddingTop: 16
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: TEXT_TERTIARY,
              letterSpacing: '0.12em',
              marginBottom: 14,
              textTransform: 'uppercase'
            }}
          >
            On this page
          </div>
          {currentPage.toc.map(t => {
            const active = activeAnchor === t.id;
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                style={{
                  display: 'block',
                  fontSize: 12,
                  color: active ? TEXT_PRIMARY : TEXT_TERTIARY,
                  textDecoration: 'none',
                  padding: '5px 0 5px 12px',
                  borderLeft: `2px solid ${active ? ACCENT : 'transparent'}`,
                  transition: 'color 0.15s, border-color 0.15s',
                  lineHeight: 1.4
                }}
                onMouseOver={e =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    TEXT_PRIMARY)
                }
                onMouseOut={e => {
                  if (!active)
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      TEXT_TERTIARY;
                }}
              >
                {t.label}
              </a>
            );
          })}

          <div
            style={{
              marginTop: 32,
              padding: '14px 14px',
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              background: 'rgba(74,222,128,0.04)'
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: ACCENT,
                letterSpacing: '0.1em',
                marginBottom: 6
              }}
            >
              TRY IT
            </div>
            <p
              style={{
                fontSize: 12,
                color: TEXT_SECONDARY,
                margin: '0 0 10px',
                lineHeight: 1.5
              }}
            >
              See FRED resolve a procurement query in real time.
            </p>
            <a
              href='/chat'
              style={{
                display: 'inline-block',
                fontSize: 12,
                color: TEXT_PRIMARY,
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Launch FRED →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  SEARCH HELPER                                                      */
/* ================================================================== */

function filterSearch(q: string) {
  const all = PAGES.map(p => ({
    section: p.section,
    label: p.label,
    slug: p.slug
  }));
  if (!q.trim()) return all.slice(0, 8);
  const lower = q.toLowerCase();
  return all
    .filter(
      r =>
        r.label.toLowerCase().includes(lower) ||
        r.section.toLowerCase().includes(lower)
    )
    .slice(0, 10);
}
