type SearchIconProps = {
  size?: number;
  className?: string;
};

export function SearchIcon({ size = 14, className }: SearchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className={className}
      aria-hidden='true'
    >
      <circle cx='9' cy='9' r='6' />
      <path d='M14 14l4 4' strokeLinecap='round' />
    </svg>
  );
}
