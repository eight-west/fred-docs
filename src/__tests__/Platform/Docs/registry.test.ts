import pages from '../../../Platform/Docs/pages.json';
import { PAGES, SECTION_ORDER } from '../../../Platform/Docs/registry';

describe('the docs registry', () => {
  it('carries every page listed in pages.json', () => {
    expect(PAGES).toHaveLength(pages.length);
    expect(PAGES.map(p => p.slug)).toEqual(pages.map(p => p.slug));
  });

  it('joins each page to a component and a table of contents', () => {
    for (const page of PAGES) {
      expect(typeof page.Component).toBe('function');
      expect(Array.isArray(page.toc)).toBe(true);
    }
  });

  it('gives every table of contents entry an id and a label', () => {
    for (const page of PAGES) {
      for (const entry of page.toc) {
        expect(entry.id).toBeTruthy();
        expect(entry.label).toBeTruthy();
      }
    }
  });

  it('puts every page in a section the sidebar renders', () => {
    for (const page of PAGES) expect(SECTION_ORDER).toContain(page.section);
  });
});
