import { Link } from 'react-router-dom';

type PageTitleProps = {
  eyebrow: string;
  title: string;
  lede: string;
  rootLabel?: string;
  rootHref?: string;
};

export function PageTitle({
  eyebrow,
  title,
  lede,
  rootLabel = 'DOCS',
  rootHref = '/introduction'
}: PageTitleProps) {
  return (
    <header className='mb-s59'>
      <nav
        aria-label='Breadcrumb'
        className='fred-crumb mb-s21 inline-flex items-center gap-2 rounded-pill border border-gold-dim px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]'
      >
        <Link to={rootHref} className='text-gold no-underline'>
          {rootLabel}
        </Link>
        <span aria-hidden='true' className='text-gold-dim'>
          /
        </span>
        <span className='text-secondary'>{eyebrow}</span>
      </nav>
      <h1 className='m-0 mb-s21 text-[34px] font-normal leading-heading tracking-brand text-primary [text-wrap:balance] md:text-[44px]'>
        {title}
      </h1>
      <p className='fred-lede'>{lede}</p>
    </header>
  );
}
