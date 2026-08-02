import { PAGES } from './registry';

export const DOCS_DEFAULT_SLUG = 'introduction';

// The docs are the whole of this site, so a page sits at the root rather
// than under a /docs prefix that would repeat the subdomain.
export function docsPath(slug: string): string {
  return `/${slug}`;
}

export function isDocsSlug(slug: string | undefined): slug is string {
  return typeof slug === 'string' && PAGES.some(p => p.slug === slug);
}
