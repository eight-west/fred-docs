export function PageTitle({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <>
      <nav className='mb-6 flex items-center gap-3 font-mono text-caption uppercase tracking-[0.14em] text-tertiary-soft'>
        <span aria-hidden className='block h-px w-6 bg-gold/60' />
        <a href='#introduction' className='text-gold no-underline'>
          DOCS
        </a>
        <span className='opacity-40'>/</span>
        <span className='text-secondary-warm'>{eyebrow}</span>
      </nav>
      <h1 className='m-0 mb-5 text-doc-h1 font-normal leading-heading tracking-brand text-primary'>
        {title}
      </h1>
      <p className='mb-10 max-w-[680px] text-[17px] leading-body tracking-brand text-secondary-warm'>
        {lede}
      </p>
    </>
  );
}
