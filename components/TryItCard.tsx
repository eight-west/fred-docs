export function TryItCard() {
  return (
    <div className='mt-8 rounded-card border border-edge-soft p-4'>
      <div className='mb-2 font-mono text-caption tracking-[0.1em] text-gold'>
        TRY IT
      </div>
      <p className='mb-2.5 text-xs leading-snug text-secondary-warm'>
        See FRED resolve a procurement query in real time.
      </p>
      <a
        href='/chat'
        className='inline-block font-mono text-caption uppercase tracking-[0.04em] text-gold no-underline'
      >
        Launch FRED
      </a>
    </div>
  );
}
