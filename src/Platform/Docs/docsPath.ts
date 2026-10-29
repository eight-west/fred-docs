import { PAGES } from './registry';

export const DOCS_DEFAULT_SLUG = 'introduction';

// The docs are the whole of this site, so a page sits at the root rather
// than under a /docs prefix that would repeat the subdomain. The trailing
// slash is the address Netlify serves a prerendered <slug>/index.html at;
// without it every link and canonical points at a 301.
export function docsPath(slug: string): string {
  return `/${slug}/`;
}

export function isDocsSlug(slug: string | undefined): slug is string {
  return typeof slug === 'string' && PAGES.some(p => p.slug === slug);
}
