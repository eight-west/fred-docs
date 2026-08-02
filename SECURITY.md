# Security

## Reporting a vulnerability

Email **contact@biofred.us**. Do not open a public issue.

Include what you found, how to reproduce it, and what an attacker could do with
it. If you have a proof of concept, attach it.

You should get a reply within a few days. This is a small research project, not
a company with an on-call rotation — if something looks actively exploited, say
so in the subject line and I will treat it accordingly.

There is no bounty programme. Credit in the fix commit if you want it.

## Scope

In scope:

- `docs.biofred.us`
- the code in this repository

Out of scope, because they are not ours to fix:

- the Sanity Studio at `biofred.sanity.studio` — report to Sanity
- Netlify, Google Cloud, or Anthropic infrastructure — report to them
- the underlying geospatial datasets and their providers

## What is already known

Two things are deliberate rather than oversights, so they are not worth
reporting:

**Frontend environment variables are public.** This is a Create React App
build, so every `REACT_APP_*` value is substituted into the bundle and readable
by anyone who loads the site. That is why the Mapbox token is there and nothing
else is. The token is URL-restricted in the Mapbox dashboard.

**The Sanity dataset is public.** Sanity's free plan only offers public
datasets, so unpublished blog drafts are readable by anyone who knows the
project ID. The build query filters drafts out of the site, but it cannot make
them private. Nothing sensitive is drafted there.

## Supported versions

Only what is deployed at `docs.biofred.us`, built from `main`. There are no
maintained release branches.
