export function prefersReducedMotion(): boolean {
  // CRA resets mocks between tests, which leaves matchMedia a jest.fn that
  // returns undefined, so guard that as well as a missing window.
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
    return false;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)')?.matches === true
  );
}
