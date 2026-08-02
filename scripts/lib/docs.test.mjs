import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsBody, docsJsonLd } from './docs.mjs';
import { escapeHtml } from './renderHtml.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGES = JSON.parse(
  await readFile(join(HERE, '..', '..', 'src', 'Platform', 'Docs', 'pages.json'), 'utf8')
);

const page = {
  slug: 'facility-siting',
  label: 'Facility siting',
  section: 'Capabilities',
  description: 'Where to put a plant.'
};

describe('docsBody', () => {
  it('renders the label as the heading and the description as prose', () => {
    assert.equal(
      docsBody(page, escapeHtml),
      '<h1>Facility siting</h1><p>Where to put a plant.</p>'
    );
  });

  it('escapes metadata rather than trusting it', () => {
    const out = docsBody(
      { label: '<script>x</script>', description: 'a & b' },
      escapeHtml
    );
    assert.ok(!out.includes('<script>'));
    assert.ok(out.includes('a &amp; b'));
  });
});

describe('docsJsonLd', () => {
  it('describes the page as a technical article', () => {
    const ld = docsJsonLd(page, 'https://biofred.us/docs/facility-siting', 'https://biofred.us');
    assert.equal(ld['@type'], 'TechArticle');
    assert.equal(ld.headline, 'Facility siting');
    assert.equal(ld.articleSection, 'Capabilities');
    assert.equal(ld.mainEntityOfPage['@id'], 'https://biofred.us/docs/facility-siting');
  });
});

describe('pages.json', () => {
  it('is the list the prerenderer walks', () => {
    assert.ok(PAGES.length > 0);
  });

  it('gives every page the four fields a page needs', () => {
    for (const p of PAGES) {
      for (const key of ['slug', 'label', 'section', 'description']) {
        assert.equal(typeof p[key], 'string', `${p.slug} is missing ${key}`);
        assert.ok(p[key].length > 0, `${p.slug} has an empty ${key}`);
      }
    }
  });

  it('keeps descriptions inside a meta description', () => {
    for (const p of PAGES) {
      assert.ok(p.description.length <= 160, `${p.slug} description is too long`);
    }
  });

  it('uses url-safe slugs', () => {
    for (const p of PAGES) assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('uses each slug once', () => {
    const slugs = PAGES.map(p => p.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });
});
