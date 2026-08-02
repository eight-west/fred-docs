import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml } from './lib/renderHtml.mjs';
import { docsBody, docsJsonLd } from './lib/docs.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, '..', 'build');
const PAGES = join(HERE, '..', 'src', 'Platform', 'Docs', 'pages.json');

const ORIGIN = process.env.SITE_ORIGIN || 'https://docs.biofred.us';
const DEFAULT_IMAGE = 'https://biofred.us/og-image.jpg';
const DEFAULT_SLUG = 'introduction';

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function upsertHead(html, tag) {
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function applyMeta(template, meta) {
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  for (const [pattern, tag] of [
    [/<meta\s+name="description"[^>]*\/?>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`],
    [/<meta\s+property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`],
    [/<meta\s+property="og:description"[^>]*\/?>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`],
    [/<meta\s+property="og:url"[^>]*\/?>/, `<meta property="og:url" content="${escapeHtml(meta.url)}" />`],
    [/<meta\s+property="og:image"[^>]*\/?>/, `<meta property="og:image" content="${escapeHtml(DEFAULT_IMAGE)}" />`],
    [/<meta\s+name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`],
    [/<meta\s+name="twitter:description"[^>]*\/?>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`]
  ]) {
    html = replaceTag(html, pattern, tag);
  }

  html = upsertHead(html, `<link rel="canonical" href="${escapeHtml(meta.canonical ?? meta.url)}" />`);

  if (meta.jsonLd) {
    html = upsertHead(html, `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`);
  }

  if (meta.body) {
    html = html.replace(/<div id="root"><\/div>/, `<div id="root">${meta.body}</div>`);
  }

  return html;
}

async function writePage(route, html) {
  const dir = join(BUILD, route.replace(/^\//, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html);
}

function sitemap(entries) {
  const urls = entries
    .map(
      e =>
        `  <url>\n    <loc>${e.loc}</loc>\n` +
        `    <changefreq>monthly</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const templatePath = join(BUILD, 'index.html');
  if (!existsSync(templatePath)) {
    throw new Error('build/index.html not found - run this after the build');
  }
  const template = await readFile(templatePath, 'utf8');
  const pages = JSON.parse(await readFile(PAGES, 'utf8'));

  const entries = [];

  for (const page of pages) {
    const path = `/${page.slug}`;
    const url = `${ORIGIN}${path}`;
    const html = applyMeta(template, {
      title: `${page.label} \u2022 FRED Docs`,
      description: page.description,
      url,
      jsonLd: docsJsonLd(page, url, ORIGIN),
      body: docsBody(page, escapeHtml)
    });
    await writePage(path, html);
    entries.push({ loc: url, priority: '0.7' });
  }

  // The root only forwards to the first page, so it points its canonical there
  // and stays out of the sitemap.
  const first = pages.find(p => p.slug === DEFAULT_SLUG) ?? pages[0];
  await writeFile(
    join(BUILD, 'index.html'),
    applyMeta(template, {
      title: 'FRED Docs',
      description: first.description,
      url: ORIGIN,
      canonical: `${ORIGIN}/${first.slug}`
    })
  );

  await writeFile(join(BUILD, 'sitemap.xml'), sitemap(entries));
  await writeFile(
    join(BUILD, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
  );

  console.log(
    `[prerender] wrote ${pages.length} docs page(s), sitemap.xml (${entries.length} urls) and robots.txt`
  );
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
