import { SiteTheme } from '../Platform/Hooks/useSiteTheme';

type ThemeToggleProps = {
  theme: SiteTheme;
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const light = theme === 'light';
  return (
    <button
      type='button'
      onClick={onToggle}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      className='inline-flex h-9 w-9 items-center justify-center rounded-pill border border-edge-strong text-primary transition-colors duration-200 hover:border-edge-hover-strong hover:bg-surface-tint'
    >
      <svg
        aria-hidden='true'
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      >
        {light ? (
          <path d='M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z' />
        ) : (
          <>
            <circle cx='8' cy='8' r='3' />
            <path d='M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1' />
          </>
        )}
      </svg>
    </button>
  );
}
