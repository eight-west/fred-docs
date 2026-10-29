import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { escapeHtml } from './lib/renderHtml.mjs';
import { docsJsonLd } from './lib/docs.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, '..', 'build');
const PAGES = join(HERE, '..', 'src', 'Platform', 'Docs', 'pages.json');
const SSR_BUNDLE = join(HERE, '..', 'node_modules', '.cache', 'prerender', 'ssr.cjs');

const ORIGIN = process.env.SITE_ORIGIN || 'https://docs.biofred.us';
const DEFAULT_IMAGE = 'https://biofred.us/og-image.jpg';
const DEFAULT_SLUG = 'introduction';

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function upsertHead(html, tag) {
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

function setRobots(html, value) {
  return replaceTag(html, /<meta\s+name="robots"[^>]*\/?>/, `<meta name="robots" content="${value}" />`);
}

// A prerendered page reads fine without JavaScript, so the shell's notice
// would only be wrong, and it is the first text in the body a crawler sees.
function withBody(html, body) {
  if (!html.includes('<div id="root"></div>')) {
    throw new Error('build/index.html has no empty <div id="root"></div> to fill');
  }
  return html
    .replace(/<noscript>[\s\S]*?<\/noscript>/, '')
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
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
    html = upsertHead(
      html,
      `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`
    );
  }

  if (meta.body) html = withBody(html, meta.body);

  return html;
}

// CRA has already fingerprinted every imported image into static/media (or
// inlined the small ones), so the prerender points at those same URLs.
const craMedia = {
  name: 'cra-media',
  setup(b) {
    b.onLoad({ filter: /\.(png|jpe?g|gif|webp|svg)$/ }, async args => {
      const { name, ext } = parse(args.path);
      const media = join(BUILD, 'static', 'media');
      const built = existsSync(media)
        ? (await readdir(media)).find(f => f.startsWith(`${name}.`) && f.endsWith(ext))
        : undefined;
      if (built) {
        return {
          contents: `module.exports = ${JSON.stringify(`/static/media/${built}`)};`,
          loader: 'js'
        };
      }
      return { contents: await readFile(args.path), loader: 'dataurl' };
    });
  }
};

async function loadRenderer() {
  await build({
    entryPoints: [join(HERE, '..', 'src', 'ssr.tsx')],
    outfile: SSR_BUNDLE,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    packages: 'external',
    loader: { '.css': 'empty' },
    plugins: [craMedia],
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning'
  });
  return createRequire(import.meta.url)(SSR_BUNDLE);
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

  const ssr = await loadRenderer();
  const entries = [];

  // Netlify serves <slug>/index.html at /<slug>/ and 301s /<slug> to it, so
  // the slashed form is the page's real address.
  for (const page of pages) {
    const path = `/${page.slug}/`;
    const url = `${ORIGIN}${path}`;
    const html = applyMeta(template, {
      title: `${page.label} \u2022 FRED Docs`,
      description: page.description,
      url,
      jsonLd: docsJsonLd(page, url, ORIGIN),
      body: ssr.render(path)
    });
    await writePage(path, html);
    entries.push({ loc: url, priority: '0.7' });
  }

  // The root only forwards to the first page, so it points its canonical there
  // and stays out of the sitemap. It stays a page rather than a 301 because
  // old /docs#<slug> links land here and only the browser sees the fragment.
  const first = pages.find(p => p.slug === DEFAULT_SLUG) ?? pages[0];
  await writeFile(
    join(BUILD, 'index.html'),
    applyMeta(template, {
      title: 'FRED Docs',
      description: first.description,
      url: `${ORIGIN}/`,
      canonical: `${ORIGIN}/${first.slug}/`
    })
  );

  // Netlify serves this with a 404 status for any path no file matches. It
  // still boots the bundle, which sends an unknown slug to the first page.
  await writeFile(
    join(BUILD, '404.html'),
    setRobots(
      template.replace(/<title>[^<]*<\/title>/, '<title>Page not found \u2022 FRED Docs</title>'),
      'noindex'
    )
  );

  await writeFile(join(BUILD, 'sitemap.xml'), sitemap(entries));
  await writeFile(
    join(BUILD, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
  );

  console.log(
    `[prerender] wrote ${pages.length} docs page(s), 404.html, sitemap.xml (${entries.length} urls) and robots.txt`
  );
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
