import { PAGES } from '../../../Platform/Docs/registry';
import {
  DOCS_DEFAULT_SLUG,
  docsPath,
  isDocsSlug
} from '../../../Platform/Docs/docsPath';

describe('docsPath', () => {
  it('builds a path at the root', () => {
    expect(docsPath('facility-siting')).toBe('/facility-siting');
  });

  it('addresses every registered page', () => {
    for (const page of PAGES) {
      expect(docsPath(page.slug)).toBe(`/${page.slug}`);
    }
  });
});

describe('isDocsSlug', () => {
  it('accepts every registered slug', () => {
    for (const page of PAGES) expect(isDocsSlug(page.slug)).toBe(true);
  });

  it('rejects anything that is not a page', () => {
    expect(isDocsSlug('not-a-page')).toBe(false);
    expect(isDocsSlug('')).toBe(false);
    expect(isDocsSlug(undefined)).toBe(false);
  });
});

describe('the default docs slug', () => {
  it('names a page that exists', () => {
    expect(isDocsSlug(DOCS_DEFAULT_SLUG)).toBe(true);
  });
});
