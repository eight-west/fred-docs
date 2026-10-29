import { URL_LOGIN } from '../../../Resources/Constants';

export function TryItCard() {
  return (
    <div className='mt-s18 overflow-hidden rounded-panel border border-edge bg-surface bg-glow-soft p-5'>
      <p className='m-0 mb-2 font-mono text-mono-label uppercase tracking-[0.12em] text-gold'>
        Try it
      </p>
      <p className='m-0 mb-s18 text-[14px] leading-snug tracking-brand text-secondary'>
        Ask FRED a question about a place and watch it work.
      </p>
      <a
        href={URL_LOGIN}
        className='inline-flex items-center rounded-pill bg-gold px-s14 py-2 font-mono text-mono-label uppercase tracking-[0.04em] text-gold-ink no-underline transition-colors hover:bg-gold-bright'
      >
        Try FRED
      </a>
    </div>
  );
}
