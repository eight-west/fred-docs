import { Link } from 'react-router-dom';
import type { PageEntry } from '../registry';
import { docsPath } from '../docsPath';

type DocsPagerProps = {
  prev: PageEntry | null;
  next: PageEntry | null;
};

const CARD =
  'rounded-card border border-edge-soft p-5 text-primary no-underline transition-colors hover:border-edge-soft-strong';

export function DocsPager({ prev, next }: DocsPagerProps) {
  return (
    <nav className='mt-20 grid grid-cols-2 gap-3 border-t border-edge-soft pt-8'>
      {prev ? (
        <Link to={docsPath(prev.slug)} className={CARD}>
          <div className='mb-2 font-mono text-caption tracking-[0.12em] text-gold'>
            &#8592; PREVIOUS
          </div>
          <div className='text-[17px] font-normal tracking-brand'>{prev.label}</div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={docsPath(next.slug)} className={`${CARD} text-right`}>
          <div className='mb-2 font-mono text-caption tracking-[0.12em] text-gold'>
            NEXT &#8594;
          </div>
          <div className='text-[17px] font-normal tracking-brand'>{next.label}</div>
        </a>
      ) : (
        <div />
      )}
    </nav>
  );
}
