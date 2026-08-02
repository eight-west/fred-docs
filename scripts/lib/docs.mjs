// A docs page body is TSX, so unlike a blog post there is no build-time AST to
// serialise. Crawlers get the heading and the summary; the rest arrives when
// the bundle runs.
export function docsBody(page, escape) {
  return `<h1>${escape(page.label)}</h1><p>${escape(page.description)}</p>`;
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
