export function docsJsonLd(page, url, origin) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: page.label,
        description: page.description,
        articleSection: page.section,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: { '@id': 'https://biofred.us/#organization' },
        publisher: { '@id': 'https://biofred.us/#organization' }
      },
      {
        '@type': 'Organization',
        '@id': 'https://biofred.us/#organization',
        name: '8W Research',
        url: 'https://biofred.us/',
        logo: 'https://biofred.us/8w-research-logo.png'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'FRED Docs', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: page.section },
          { '@type': 'ListItem', position: 3, name: page.label, item: url }
        ]
      }
    ]
  };
}
