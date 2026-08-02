import { ReactNode } from 'react';

const HEADING_STYLES = {
  2: 'mt-16 mb-5 border-t border-edge-soft pt-8 text-subheading font-normal leading-subheading tracking-brand',
  3: 'mt-10 mb-3 text-doc-h3 font-medium tracking-brand',
  4: 'mt-6 mb-2 text-doc-h4 font-medium tracking-brand',
} as const;

type HeadingProps = {
  id: string;
  level: 2 | 3 | 4;
  children: ReactNode;
};

export function Heading({ id, level, children }: HeadingProps) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <Tag
      id={id}
      className={`group relative scroll-mt-20 text-primary ${HEADING_STYLES[level]}`}
    >
      <a
        href={`#${id}`}
        aria-label='Link to this section'
        className='absolute -left-6 text-base text-tertiary-soft no-underline opacity-0 transition-opacity duration-150 group-hover:opacity-100'
      >
        #
      </a>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------- InlineCode */
