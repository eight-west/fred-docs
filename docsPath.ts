import { PAGES } from './registry';

export const DOCS_DEFAULT_SLUG = 'introduction';

export function docsPath(slug: string): string {
  return `/docs/${slug}`;
}

export function isDocsSlug(slug: string | undefined): slug is string {
  return typeof slug === 'string' && PAGES.some(p => p.slug === slug);
}
