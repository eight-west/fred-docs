import cn from 'classnames';
import { Link } from 'react-router-dom';
import type { PageEntry } from '../registry';
import { docsPath } from '../docsPath';
import { FadeUp } from '../../../Shared/FadeUp';

type DocsPagerProps = {
  prev: PageEntry | null;
  next: PageEntry | null;
};

const CARD =
  'group flex h-full items-center gap-4 rounded-panel border border-edge bg-surface p-5 text-primary no-underline transition-[transform,box-shadow,border-color] duration-500 ease-brand hover:-translate-y-1 hover:border-edge-hover-strong hover:shadow-float motion-reduce:transition-none motion-reduce:hover:translate-y-0';

function Arrow({ back }: { back?: boolean }) {
  return (
    <span
      aria-hidden='true'
      className='flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-edge-strong text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-canvas'
    >
      <span
        className={cn(
          'transition-transform duration-300 ease-brand motion-reduce:transition-none',
          back ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'
        )}
      >
        <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
          <path
            d={back ? 'M13 8H3M7 4L3 8l4 4' : 'M3 8h10M9 4l4 4-4 4'}
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
    </span>
  );
}

function Label({ text, page }: { text: string; page: PageEntry }) {
  return (
    <span className='min-w-0 flex-1'>
      <span className='mb-1 block font-mono text-mono-label uppercase tracking-[0.12em] text-secondary-soft'>
        {text}
      </span>
      <span className='block text-[17px] leading-snug tracking-brand'>
        {page.label}
      </span>
    </span>
  );
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  return (
    <nav
      aria-label='More docs'
      className='fred-pager mt-s86 grid grid-cols-1 gap-s18 sm:grid-cols-2'
    >
      {prev ? (
        <FadeUp>
          <Link to={docsPath(prev.slug)} className={CARD}>
            <Arrow back />
            <Label text='Previous' page={prev} />
          </Link>
        </FadeUp>
      ) : (
        <div className='hidden sm:block' />
      )}
      {next && (
        <FadeUp delay={90}>
          <Link to={docsPath(next.slug)} className={cn(CARD, 'text-right')}>
            <Label text='Next' page={next} />
            <Arrow />
          </Link>
        </FadeUp>
      )}
    </nav>
  );
}
