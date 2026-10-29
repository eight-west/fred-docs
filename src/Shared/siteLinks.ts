import {
  URL_CAREERS,
  URL_COOKIE_SETTINGS,
  URL_HOME,
  URL_PRIVACY,
  URL_TERMS,
  URL_VALUES
} from '../Resources/Constants';

export type SiteLink = { label: string; href: string; current?: boolean };

// Smaller than the landing nav on purpose: a reader here came to look
// something up, and the rest of biofred.us is one click past Home.
export const NAV_LINKS: SiteLink[] = [
  { label: 'Home', href: URL_HOME },
  { label: 'Docs', href: '/introduction/', current: true }
];

// The org links, which the nav does not carry.
export const FOOTER_LINKS: SiteLink[] = [
  { label: 'Values', href: URL_VALUES },
  { label: 'Careers', href: URL_CAREERS },
  { label: 'Privacy', href: URL_PRIVACY },
  { label: 'Terms', href: URL_TERMS },
  { label: 'Cookies', href: URL_COOKIE_SETTINGS }
];
