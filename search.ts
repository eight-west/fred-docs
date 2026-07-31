import { PAGES } from './registry';

export function filterSearch(q: string) {
  const all = PAGES.map(p => ({
    section: p.section,
    label: p.label,
    slug: p.slug
  }));
  if (!q.trim()) return all.slice(0, 8);
  const lower = q.toLowerCase();
  return all
    .filter(
      r =>
        r.label.toLowerCase().includes(lower) ||
        r.section.toLowerCase().includes(lower)
    )
    .slice(0, 10);
}
