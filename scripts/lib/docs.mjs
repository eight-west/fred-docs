// A docs page body is TSX, so unlike a blog post there is no build-time AST to
// serialise. Crawlers get the heading and the summary; the rest arrives when
// the bundle runs. docs-stub keeps it out of sight for a normal load, which
// swaps it out within a second; see src/docs.css.
export function docsBody(page, escape) {
  return `<div class="docs-stub"><h1>${escape(page.label)}</h1><p>${escape(page.description)}</p></div>`;
}

export function docsJsonLd(page, url, origin) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.label,
    description: page.description,
    articleSection: page.section,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', name: 'FRED', url: origin }
  };
}
