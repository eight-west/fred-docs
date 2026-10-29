import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsJsonLd } from './docs.mjs';

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

describe('docsJsonLd', () => {
  const url = 'https://docs.biofred.us/facility-siting/';
  const graph = docsJsonLd(page, url, 'https://docs.biofred.us')['@graph'];
  const node = type => graph.find(n => n['@type'] === type);

  it('describes the page as a technical article', () => {
    const article = node('TechArticle');
    assert.equal(article.headline, 'Facility siting');
    assert.equal(article.articleSection, 'Capabilities');
    assert.equal(article.mainEntityOfPage['@id'], url);
  });

  it('credits 8W Research, the same organisation biofred.us names', () => {
    const org = node('Organization');
    assert.equal(org.name, '8W Research');
    assert.equal(node('TechArticle').publisher['@id'], org['@id']);
    assert.equal(org['@id'], 'https://biofred.us/#organization');
  });

  it('ends its breadcrumb on the page itself', () => {
    assert.equal(node('BreadcrumbList').itemListElement.at(-1).item, url);
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
