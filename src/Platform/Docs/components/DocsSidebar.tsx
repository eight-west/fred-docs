import { DocsNavList } from './DocsNavList';

export function DocsSidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <nav
      aria-label='Docs'
      className='-ml-3 hidden self-start md:sticky md:top-24 md:block md:max-h-[calc(100vh-120px)] md:overflow-y-auto md:pb-6'
    >
      <DocsNavList currentSlug={currentSlug} />
    </nav>
  );
}
