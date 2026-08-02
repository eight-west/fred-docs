import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { PageTitle } from '../../../Platform/Docs/Prose/PageTitle';

function renderTitle(props: Partial<{ rootLabel: string; rootHref: string }> = {}) {
  return render(
    <MemoryRouter>
      <PageTitle eyebrow='Reference' title='Glossary' lede='Terms.' {...props} />
    </MemoryRouter>
  );
}

describe('PageTitle', () => {
  it('sends the docs crumb to a real page rather than a fragment', () => {
    renderTitle();
    expect(screen.getByRole('link', { name: 'DOCS' })).toHaveAttribute(
      'href',
      '/introduction'
    );
  });

  it('lets a section override the crumb', () => {
    renderTitle({ rootLabel: 'BLOG', rootHref: '/blog' });
    expect(screen.getByRole('link', { name: 'BLOG' })).toHaveAttribute('href', '/blog');
  });
});
