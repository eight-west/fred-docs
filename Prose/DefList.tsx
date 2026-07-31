import { ReactNode } from 'react';

export function DefList({
  items,
}: {
  items: { term: string; def: ReactNode }[];
}) {
  return (
    <dl className='my-5'>
      {items.map((item) => (
        <div
          key={item.term}
          className='mb-4 border-b border-edge-soft pb-4'
        >
          <dt className='mb-1.5 font-mono text-[13px] font-medium tracking-wide text-accent'>
            {item.term}
          </dt>
          <dd className='m-0 text-sm leading-relaxed text-secondary-warm'>
            {item.def}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ----------------------------------------------------------------- PageTitle */
