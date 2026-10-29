// Consumed by dangerouslySetInnerHTML in the highlighter, so these have to be
// raw values rather than Tailwind classes. They are CSS variables so a code
// block follows the page's theme.
export const HIGHLIGHT_KEYWORD = 'rgb(var(--c-accent))';
export const HIGHLIGHT_COMMENT = 'var(--hl-comment)';
export const HIGHLIGHT_STRING = 'var(--hl-string)';
export const HIGHLIGHT_LITERAL = 'rgb(var(--c-warn))';
export const HIGHLIGHT_FLAG = 'rgb(var(--c-tip))';

export const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
