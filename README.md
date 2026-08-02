# FRED Docs

The documentation for [FRED](https://biofred.us), served at
**[docs.biofred.us](https://docs.biofred.us)**.

21 pages covering what FRED can be asked, how to read its answers, what the
numbers mean, and the methodology behind the harvest cost, transport and
fire-risk layers. The product itself lives in
[`eight-west/fred`](https://github.com/eight-west/fred).

## Running it

```bash
git clone https://github.com/eight-west/fred-docs.git
cd fred-docs
npm install
npm start                     # http://localhost:3000
```

No API keys, no database, no backend. The docs are self-contained React
components — if it builds, it runs.

## Tests

```bash
npm run typecheck             # tsc, no emit
npm test                      # component tests (jest)
npm run test:scripts          # build-script tests (node:test)
```

All three run in CI on every pull request. CI additionally asserts that **every
slug in `pages.json` produced a prerendered file**, so a page can never silently
stop being crawlable.

## How a page is built

Pages are React components, not markdown. `src/Platform/Docs/pages.json` holds
the metadata — slug, label, section, description — and `registry.ts` joins each
entry to its component and table of contents:

```
pages.json          slug, label, section, description   (read by the build script too)
      │
      ▼
registry.ts         + Component, + toc
      │
      ▼
Content/*.tsx       the page itself, built from Prose primitives
```

The split exists so `scripts/prerender.mjs` can read page metadata in Node
without parsing TypeScript. A slug in `pages.json` with no matching entry in
`registry.ts` renders a page with no component — `registry.test.ts` guards that.

### Adding a page

1. Add the component under `src/Platform/Docs/Content/`, exporting the page and
   its `toc` array.
2. Register it in `registry.ts`.
3. Add its metadata to `pages.json`, including a `description` — that becomes
   the meta description and the search-result snippet, so it must be under 160
   characters.

Tests will fail if you miss step 2 or 3.

## Prerendering

`npm run build` runs `scripts/prerender.mjs` afterwards, which writes
`build/<slug>/index.html` for all 21 pages with their own title, description,
canonical and `TechArticle` JSON-LD, plus `sitemap.xml` and `robots.txt`.

The page bodies are TSX, so unlike markdown there is no build-time AST to
serialise. Crawlers get the heading, the summary and correct head tags; the
prose itself arrives when the bundle runs.

## Styling

The design tokens in `tailwind.config.js` and the `.fred-doc-prose` layer in
`src/index.css` are copies of the ones in `eight-west/fred`, so the docs look
identical to the rest of the site. **They are copies, not a shared package** —
changing a token here does not change it there.

`npm run check:design` compares both files against the product repo and fails
if they have diverged. CI runs it on every pull request.

It cannot work while `eight-west/fred` is private: an unauthenticated fetch
404s, and the check says so loudly and passes rather than pretending. To arm
it, either make that repo public or set an `UPSTREAM_TOKEN` secret with read
access to it. Until then the two can drift silently, so keep them in step by
hand.

Detection is not sharing. Publishing the tokens as a package is the real fix,
and is worth doing once this check starts firing often.

One trap worth knowing: `.fred-doc-prose a` is more specific than a `text-gold`
utility, so a link inside the prose column cannot be recoloured by adding a
class. Class order in the string is irrelevant; CSS specificity decides. Chrome
that happens to sit inside the prose carries `fred-crumb` or `fred-pager` to win
that fight.

## Licence

Source-available under the [PolyForm Noncommercial License 1.0.0](LICENSE), the
same terms as [`eight-west/fred`](https://github.com/eight-west/fred).
Commercial use is a separate licence — see [COMMERCIAL.md](COMMERCIAL.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) to make a change, and
[SECURITY.md](SECURITY.md) to report a vulnerability.
