import { fireEvent, render, screen } from '@testing-library/react';

import { ThemeToggle } from '../../Shared/ThemeToggle';
import { useSiteTheme } from '../../Platform/Hooks/useSiteTheme';

function Harness() {
  const { theme, toggle } = useSiteTheme();
  return <ThemeToggle theme={theme} onToggle={toggle} />;
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-landing-theme');
});

describe('ThemeToggle', () => {
  it('switches to light, marks <html> and remembers the choice', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));

    expect(document.documentElement).toHaveAttribute('data-landing-theme', 'light');
    expect(window.localStorage.getItem('fred_landing_theme')).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
  });

  it('starts from a stored choice over the system theme', () => {
    window.localStorage.setItem('fred_landing_theme', 'light');
    render(<Harness />);

    expect(document.documentElement).toHaveAttribute('data-landing-theme', 'light');
  });
});
