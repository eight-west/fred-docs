import { ReactNode, useState } from 'react';

// Hex constants used by the `highlight()` syntax highlighter below.
// They build an HTML string consumed by dangerouslySetInnerHTML, so Tailwind
// classes wouldn't apply — colors have to be raw values.
const HIGHLIGHT_KEYWORD = '#4ADE80';
const HIGHLIGHT_COMMENT = 'rgba(245,240,230,0.4)';

// Exported font stack — some downstream code pages may rely on this for
// custom code-block styling. Kept exported to avoid churn.
export const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* ---------------------------------------------------------------- Heading */

const HEADING_STYLES = {
  2: 'mt-14 mb-4 pt-3 text-doc-h2 tracking-brand',
  3: 'mt-9 mb-3 text-doc-h3 tracking-brand',
  4: 'mt-6 mb-2 text-doc-h4 tracking-brand',
} as const;

type HeadingProps = {
  id: string;
  level: 2 | 3 | 4;
  children: ReactNode;
};

export function Heading({ id, level, children }: HeadingProps) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <Tag
      id={id}
      className={`group relative scroll-mt-20 font-medium text-primary ${HEADING_STYLES[level]}`}
    >
      <a
        href={`#${id}`}
        aria-label='Link to this section'
        className='absolute -left-6 text-base text-tertiary-soft no-underline opacity-0 transition-opacity duration-150 group-hover:opacity-100'
      >
        #
      </a>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------- InlineCode */

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className='rounded-btn border border-edge-soft bg-[rgba(138,171,135,0.08)] px-1.5 py-px font-mono text-[0.88em] text-primary'>
      {children}
    </code>
  );
}

/* --------------------------------------------------------------- CodeBlock */

type CodeBlockProps = {
  lang: string;
  code: string;
  filename?: string;
};

export function CodeBlock({ lang, code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const tokens = highlight(code, lang);

  return (
    <div className='relative my-5 overflow-hidden rounded-btn border border-edge-soft bg-[rgba(8,14,8,0.7)]'>
      <div className='flex items-center justify-between border-b border-edge-soft px-3.5 py-2 font-mono text-[11px]'>
        <span className='tracking-[0.06em] text-tertiary-soft'>
          {filename ? `${filename}` : lang}
        </span>
        <button
          onClick={copy}
          className={`cursor-pointer rounded-btn border-none bg-transparent px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
            copied ? 'text-accent' : 'text-tertiary-soft hover:text-primary'
          }`}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre className='m-0 overflow-auto p-4 font-mono text-[13px] leading-relaxed text-primary'>
        <code dangerouslySetInnerHTML={{ __html: tokens }} />
      </pre>
    </div>
  );
}

// Tiny per-language syntax highlighter. Emits raw HTML with inline style
// attributes because the output is consumed by dangerouslySetInnerHTML —
// Tailwind classes wouldn't be picked up by the JIT here.
function highlight(code: string, lang: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = esc(code);

  if (lang === 'bash' || lang === 'shell' || lang === 'sh') {
    html = html.replace(
      /^(\$|>)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
    html = html.replace(
      /\b(curl|cd|ls|mkdir|pip|npm|docker|sudo|export|psql|wget|tar|chmod|systemctl|kubectl|helm|nginx|certbot)\b/g,
      `<span style="color:${HIGHLIGHT_KEYWORD}">$1</span>`
    );
    html = html.replace(
      /(--?[\w-]+)/g,
      `<span style="color:#9FE1CB">$1</span>`
    );
    html = html.replace(/(".*?")/g, `<span style="color:#F4C0D1">$1</span>`);
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
  } else if (lang === 'json') {
    html = html.replace(
      /"([^"]+)":/g,
      `<span style="color:${HIGHLIGHT_KEYWORD}">"$1"</span>:`
    );
    html = html.replace(
      /:\s*("[^"]*")/g,
      `: <span style="color:#F4C0D1">$1</span>`
    );
    html = html.replace(
      /:\s*(\d+\.?\d*)/g,
      `: <span style="color:#FAC775">$1</span>`
    );
    html = html.replace(
      /\b(true|false|null)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  } else if (lang === 'python' || lang === 'py') {
    html = html.replace(
      /\b(import|from|def|class|return|if|else|elif|for|in|while|with|as|async|await|None|True|False|try|except|finally|raise|yield|lambda)\b/g,
      `<span style="color:${HIGHLIGHT_KEYWORD}">$1</span>`
    );
    html = html.replace(
      /("[^"]*"|'[^']*')/g,
      `<span style="color:#F4C0D1">$1</span>`
    );
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  } else if (lang === 'sql') {
    html = html.replace(
      /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|VIEW|MATERIALIZED|REFRESH|WITH|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|DISTINCT|UNION|ALL|CASE|WHEN|THEN|ELSE|END)\b/gi,
      `<span style="color:${HIGHLIGHT_KEYWORD}">$&</span>`
    );
    html = html.replace(/('[^']*')/g, `<span style="color:#F4C0D1">$1</span>`);
    html = html.replace(
      /(--.*$)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  } else if (lang === 'yaml' || lang === 'yml') {
    html = html.replace(
      /^([\s-]*)([\w_-]+):/gm,
      `$1<span style="color:${HIGHLIGHT_KEYWORD}">$2</span>:`
    );
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
    html = html.replace(/(".*?")/g, `<span style="color:#F4C0D1">$1</span>`);
  } else {
    // js/ts default
    html = html.replace(
      /\b(const|let|var|function|return|if|else|for|while|async|await|import|from|export|default|new|class|extends|implements|interface|type|null|undefined|true|false|try|catch|throw|finally|of|in|typeof|instanceof)\b/g,
      `<span style="color:${HIGHLIGHT_KEYWORD}">$1</span>`
    );
    html = html.replace(
      /("[^"]*"|'[^']*'|`[^`]*`)/g,
      `<span style="color:#F4C0D1">$1</span>`
    );
    html = html.replace(
      /(\/\/.*$)/gm,
      `<span style="color:${HIGHLIGHT_COMMENT}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  }
  return html;
}

/* ----------------------------------------------------------------- Callout */

type CalloutKind = 'info' | 'warn' | 'tip' | 'danger';

// Each callout variant compiles to a fixed set of Tailwind classes so the JIT
// can pick them up. (Concatenating dynamic class fragments at runtime would
// not work.)
const CALLOUT_STYLES: Record<
  CalloutKind,
  { container: string; dot: string; label: string }
> = {
  info: {
    container: 'border-accent/25 bg-accent/[0.05]',
    dot: 'bg-accent',
    label: 'NOTE',
  },
  warn: {
    container: 'border-[rgba(250,199,117,0.25)] bg-[rgba(250,199,117,0.05)]',
    dot: 'bg-[#FAC775]',
    label: 'CAUTION',
  },
  tip: {
    container: 'border-[rgba(159,225,203,0.25)] bg-[rgba(159,225,203,0.05)]',
    dot: 'bg-[#9FE1CB]',
    label: 'TIP',
  },
  danger: {
    container: 'border-[rgba(244,144,144,0.25)] bg-[rgba(244,144,144,0.05)]',
    dot: 'bg-[#F49090]',
    label: 'WARNING',
  },
};

const CALLOUT_LABEL_COLORS: Record<CalloutKind, string> = {
  info: 'text-accent',
  warn: 'text-[#FAC775]',
  tip: 'text-[#9FE1CB]',
  danger: 'text-[#F49090]',
};

export function Callout({
  kind = 'info',
  children,
}: {
  kind?: CalloutKind;
  children: ReactNode;
}) {
  const styles = CALLOUT_STYLES[kind];
  return (
    <div
      className={`my-5 rounded-btn border px-4 py-3.5 text-sm leading-relaxed text-primary ${styles.container}`}
    >
      <div
        className={`mb-1.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] ${CALLOUT_LABEL_COLORS[kind]}`}
      >
        <span className={`block h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        {styles.label}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- ParamTable */

export type ParamRow = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: ReactNode;
};

export function ParamTable({ rows }: { rows: ParamRow[] }) {
  return (
    <div className='my-5 overflow-hidden rounded-btn border border-edge-soft'>
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={`grid grid-cols-[200px_1fr] gap-6 px-4 py-4 ${
            i === 0 ? '' : 'border-t border-edge-soft'
          } ${i % 2 === 0 ? '' : 'bg-[rgba(138,171,135,0.02)]'}`}
        >
          <div>
            <div className='font-mono text-[13px] font-medium text-primary'>
              {r.name}
            </div>
            <div className='mt-1 font-mono text-[11px] tracking-wide text-tertiary-soft'>
              {r.type}
              {r.required && (
                <span className='ml-1.5 text-[#F49090]'>required</span>
              )}
              {r.defaultValue && (
                <span className='ml-1.5 text-secondary-warm'>
                  default: {r.defaultValue}
                </span>
              )}
            </div>
          </div>
          <div className='text-sm leading-relaxed text-secondary-warm'>
            {r.description}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- EndpointHeader */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-[#9FE1CB]',
  POST: 'text-accent',
  PUT: 'text-[#FAC775]',
  PATCH: 'text-[#FAC775]',
  DELETE: 'text-[#F49090]',
};

export function EndpointHeader({
  method,
  path,
}: {
  method: HttpMethod;
  path: string;
}) {
  return (
    <div className='my-4 flex items-center gap-3 rounded-btn border border-edge-soft bg-[rgba(8,14,8,0.6)] px-3.5 py-2.5 font-mono text-[13px]'>
      <span
        className={`min-w-[50px] font-semibold tracking-[0.06em] ${METHOD_COLORS[method]}`}
      >
        {method}
      </span>
      <span className='text-primary'>{path}</span>
    </div>
  );
}

/* -------------------------------------------------------------------- DefList */

export function DefList({
  items,
}: {
  items: { term: string; def: ReactNode }[];
}) {
  return (
    <dl className='my-5'>
      {items.map((item) => (
        <div
          key={item.term}
          className='mb-4 border-b border-edge-soft pb-4'
        >
          <dt className='mb-1.5 font-mono text-[13px] font-medium tracking-wide text-accent'>
            {item.term}
          </dt>
          <dd className='m-0 text-sm leading-relaxed text-secondary-warm'>
            {item.def}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ----------------------------------------------------------------- PageTitle */

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
      <nav className='mb-6 flex items-center gap-2 font-mono text-xs tracking-[0.06em] text-tertiary-soft'>
        <a href='#introduction' className='text-tertiary-soft no-underline'>
          DOCS
        </a>
        <span>/</span>
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
