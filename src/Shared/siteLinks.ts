import {
  MAIN_SITE,
  URL_BLOG,
  URL_CAREERS,
  URL_COOKIE_SETTINGS,
  URL_LOGIN,
  URL_PRIVACY,
  URL_TERMS,
  URL_VALUES
} from '../Resources/Constants';

// Mirrors Landing/data/navLinks.ts and footerColumns.ts in eight-west/fred.
// Those use landing-relative anchors; from this origin every one of them has
// to name biofred.us, except the docs link, which is this site.
const DOCS_HOME = '/introduction';

export type SiteLink = { label: string; href: string; current?: boolean };

export const NAV_LINKS: SiteLink[] = [
  { label: 'How it works', href: `${MAIN_SITE}/#run` },
  { label: 'Platform', href: `${MAIN_SITE}/#platform` },
  { label: 'Research', href: `${MAIN_SITE}/#research` },
  { label: 'Docs', href: DOCS_HOME, current: true },
  { label: 'Blog', href: URL_BLOG }
];

export const FOOTER_COLUMNS: { heading: string; links: SiteLink[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Launch app', href: URL_LOGIN },
      { label: 'How it works', href: `${MAIN_SITE}/#run` },
      { label: 'Platform', href: `${MAIN_SITE}/#platform` },
      { label: 'Docs', href: DOCS_HOME },
      { label: 'Cookies', href: URL_COOKIE_SETTINGS }
    ]
  },
  {
    heading: 'Research',
    links: [
      { label: 'Publications', href: `${MAIN_SITE}/#research` },
      { label: 'Blog', href: URL_BLOG },
      { label: 'FAQ', href: `${MAIN_SITE}/#faq` }
    ]
  },
  {
    heading: 'Org',
    links: [
      { label: 'Values', href: URL_VALUES },
      { label: 'Careers', href: URL_CAREERS },
      { label: 'Privacy', href: URL_PRIVACY },
      { label: 'Terms', href: URL_TERMS }
    ]
  }
];
