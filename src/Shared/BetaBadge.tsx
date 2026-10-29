type BetaBadgeProps = {
  className?: string;
};

/**
 * The Beta mark that rides next to the FRED wordmark.
 *
 * It lives inside the wordmark link, so its text lands in the link's
 * accessible name and a screen reader announces "FRED Beta", which is the
 * whole point of the mark. Nothing here should become a link of its own.
 */
export function BetaBadge({ className = '' }: BetaBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-tag border border-beta-edge bg-beta-tint px-s5 py-[3px] font-mono text-mono-micro font-medium uppercase leading-none tracking-[0.08em] text-beta ${className}`}
    >
      Beta
    </span>
  );
}
