import cn from 'classnames';

type DocsTocProps = {
  entries: { id: string; label: string }[];
  activeId: string;
};

export function DocsToc({ entries, activeId }: DocsTocProps) {
  return (
    <>
      <div className='mb-3.5 font-mono text-caption uppercase tracking-[0.12em] text-gold'>
        On this page
      </div>
      {entries.map(t => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className={cn(
            'block border-l-2 py-1.5 pl-3 text-xs leading-snug no-underline transition-colors hover:text-primary',
            activeId === t.id
              ? 'border-accent text-primary'
              : 'border-transparent text-tertiary-soft'
          )}
        >
          {t.label}
        </a>
      ))}
    </>
  );
}
