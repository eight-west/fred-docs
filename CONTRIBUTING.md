# Contributing to FRED Docs

Documentation is read far more often than it is written, so the bar is clarity
over completeness. A page that answers one question well beats a page that
gestures at five.

## Getting it running

```bash
git clone https://github.com/eight-west/fred-docs.git
cd fred-docs
npm install
npm start                     # http://localhost:3000
```

Nothing else is needed — no keys, no database, no backend.

## Before you open a pull request

```bash
npm run typecheck
npm test
npm run test:scripts
```

All three run in CI, along with a check that every slug in `pages.json` produced
a prerendered file.

## Adding or changing a page

See the README for the three steps. The one that gets missed is `description` in
`pages.json`: it is the meta description and the search snippet, it must be
under 160 characters, and a test enforces that.

Only the Prose primitives in `src/Platform/Docs/Prose/` render correctly inside
the docs column — `Heading`, `CodeBlock`, `Callout`, `InlineCode`, `Figure`,
`ProseTable`, `ParamTable`, `DefList`, `PageTitle`, `DocLink`. Bare `p`, `ul`,
`ol` and `a` are styled by the `.fred-doc-prose` layer and are fine. Reach for a
new primitive only when none of those fit, and add it to the barrel.

Use `DocLink` for links between docs pages rather than a bare anchor. It routes
client-side and keeps the paths in one place.

## Writing

Say the thing, then explain it. A reader arriving from a search result has no
context and no patience for a preamble.

Prefer concrete numbers over adjectives — "445,000 sampled routes", not
"extensive routing data". Where a number has a caveat, give the caveat in the
same sentence rather than a paragraph later.

Be honest about limits. The most valuable sentences in these docs are the ones
saying what FRED does *not* model.

## Commits

Branch off `main`; never commit to it directly. Write commit subjects as plain
sentences describing what changed — `add a page on the depletion model`, not
`feat(docs): add depletion page`.

## Copyright in contributions

FRED is source-available under the [PolyForm Noncommercial License](LICENSE),
with commercial licences sold separately.

That model only works if one party can license the whole codebase. **By opening
a pull request you grant Eight West a perpetual, worldwide, irrevocable,
royalty-free licence to use, modify, sublicense and relicense your contribution,
including under commercial terms.** You keep your own copyright and remain free
to use your contribution however you like.

If you cannot agree to that — because an employer or university claims rights in
your work — say so in the pull request before review.

## Security

Do not open an issue for a vulnerability. See [SECURITY.md](SECURITY.md).
