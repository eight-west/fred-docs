// The design tokens and the prose layer are copies of the ones in
// eight-west/fred, so the docs look identical to the rest of the site. Nothing
// enforces that at runtime, so this compares them and fails loudly when they
// diverge.
//
// This detects drift; it does not fix it. The real fix is publishing the tokens
// as a package, which is worth doing once the two get edited often enough that
// this check starts firing.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const UPSTREAM =
  process.env.UPSTREAM_RAW ||
  'https://raw.githubusercontent.com/eight-west/fred/main/frontend';

const SHARED = ['tailwind.config.js', 'src/index.css'];

const digest = text =>
  createHash('sha256').update(text.replace(/\r\n/g, '\n').trimEnd()).digest('hex');

// The product repo is private today, so an unauthenticated fetch 404s. Supply
// a token with read access to it and this check becomes real.
const TOKEN = process.env.UPSTREAM_TOKEN;
const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function main() {
  const drifted = [];
  const unreachable = [];

  for (const file of SHARED) {
    const mine = await readFile(join(ROOT, file), 'utf8');

    const res = await fetch(`${UPSTREAM}/${file}`, { headers });
    if (!res.ok) {
      unreachable.push(`${file} (${res.status})`);
      continue;
    }
    const theirs = await res.text();

    if (digest(mine) === digest(theirs)) {
      console.log(`[design] ${file} matches upstream`);
    } else {
      drifted.push(file);
      console.error(`[design] ${file} DIFFERS from eight-west/fred`);
    }
  }

  if (drifted.length > 0) {
    console.error(
      `\n[design] ${drifted.length} file(s) have drifted from the product site.\n` +
        `The docs will no longer look identical to it.\n\n` +
        `Either copy the upstream version over, or land the same change in both\n` +
        `repositories. To see what differs:\n\n` +
        drifted.map(f => `  curl -s ${UPSTREAM}/${f} | diff ${f} -`).join('\n') +
        '\n'
    );
    process.exit(1);
  }

  if (unreachable.length === SHARED.length) {
    console.warn(
      `\n[design] could not reach any upstream file: ${unreachable.join(', ')}\n` +
        `This check is INERT until ${UPSTREAM.replace('https://raw.githubusercontent.com/', '')}\n` +
        `is reachable — the product repo is private, so it needs UPSTREAM_TOKEN set\n` +
        `to a token with read access, or the repo made public.\n` +
        `Passing here proves nothing about whether the design has drifted.\n`
    );
    return;
  }

  if (unreachable.length > 0) {
    console.warn(`[design] skipped (unreachable): ${unreachable.join(', ')}`);
  }

  console.log('[design] no drift');
}

main().catch(err => {
  console.error('[design] check failed:', err.message);
  process.exit(1);
});
