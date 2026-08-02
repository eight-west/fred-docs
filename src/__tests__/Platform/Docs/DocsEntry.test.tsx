import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';

import DocsEntry from '../../../Platform/Docs/DocsEntry';

function Landed() {
  const { slug } = useParams();
  return <div data-testid='slug'>{slug}</div>;
}

function renderWithHash(hash: string) {
  window.location.hash = hash;
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path='/' element={<DocsEntry />} />
        <Route path='/:slug' element={<Landed />} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(() => {
  window.location.hash = '';
});

describe('DocsEntry', () => {
  it('rescues an old #<slug> link', () => {
    renderWithHash('#facility-siting');
    expect(screen.getByTestId('slug')).toHaveTextContent('facility-siting');
  });

  it('falls back to the first page when there is no fragment', () => {
    renderWithHash('');
    expect(screen.getByTestId('slug')).toHaveTextContent('introduction');
  });

  it('ignores a fragment that is not a page', () => {
    renderWithHash('#what-fred-does');
    expect(screen.getByTestId('slug')).toHaveTextContent('introduction');
  });
});
