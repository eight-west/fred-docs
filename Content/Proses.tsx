import { ReactNode, useState } from 'react';

export const MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
export const CANVAS = '#060e06';
export const SURFACE = '#0B100D';
export const BORDER = 'rgba(138,171,135,0.12)';
export const BORDER_STRONG = 'rgba(138,171,135,0.25)';
export const TEXT_PRIMARY = '#F5F0E6';
export const TEXT_SECONDARY = 'rgba(245,240,230,0.65)';
export const TEXT_TERTIARY = 'rgba(245,240,230,0.4)';
export const ACCENT = '#4ADE80';
export const ACCENT_DIM = 'rgba(74,222,128,0.5)';

/* =============================================================
 * HEADING
 * ============================================================= */

export function Heading({
  id,
  level,
  children
}: {
  id: string;
  level: 2 | 3 | 4;
  children: ReactNode;
}) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  const sizes = {
    2: { fs: 26, mt: 56, mb: 16, ls: '-0.02em', pt: 12 },
    3: { fs: 19, mt: 36, mb: 12, ls: '-0.01em', pt: 0 },
    4: { fs: 15, mt: 24, mb: 8, ls: '0', pt: 0 }
  };
  const s = sizes[level];
  return (
    <Tag
      id={id}
      className='fred-doc-heading'
      style={{
        position: 'relative',
        scrollMarginTop: 80,
        fontSize: s.fs,
        fontWeight: 500,
        letterSpacing: s.ls,
        marginTop: s.mt,
        marginBottom: s.mb,
        paddingTop: s.pt,
        color: TEXT_PRIMARY
      }}
    >
      <a
        href={`#${id}`}
        className='fred-doc-anchor'
        aria-label='Link to this section'
        style={{
          position: 'absolute',
          left: -24,
          opacity: 0,
          color: TEXT_TERTIARY,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
          fontSize: 16
        }}
      >
        #
      </a>
      {children}
    </Tag>
  );
}

/* =============================================================
 * INLINE CODE
 * ============================================================= */

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: '0.88em',
        background: 'rgba(138,171,135,0.08)',
        border: `1px solid ${BORDER}`,
        padding: '1px 6px',
        borderRadius: 4,
        color: TEXT_PRIMARY
      }}
    >
      {children}
    </code>
  );
}

/* =============================================================
 * CODE BLOCK with syntax highlighter and copy button
 * ============================================================= */

export function CodeBlock({
  lang,
  code,
  filename
}: {
  lang: string;
  code: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const tokens = highlight(code, lang);

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(8,14,8,0.7)',
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        margin: '20px 0',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderBottom: `1px solid ${BORDER}`,
          fontFamily: MONO,
          fontSize: 11
        }}
      >
        <span style={{ color: TEXT_TERTIARY, letterSpacing: '0.06em' }}>
          {filename ? `${filename}` : lang}
        </span>
        <button
          onClick={copy}
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? ACCENT : TEXT_TERTIARY,
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: MONO,
            padding: '2px 6px',
            borderRadius: 4,
            transition: 'color 0.15s'
          }}
          onMouseOver={e => {
            if (!copied)
              (e.currentTarget as HTMLButtonElement).style.color = TEXT_PRIMARY;
          }}
          onMouseOut={e => {
            if (!copied)
              (e.currentTarget as HTMLButtonElement).style.color =
                TEXT_TERTIARY;
          }}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '16px 18px',
          overflow: 'auto',
          fontSize: 13,
          lineHeight: 1.65,
          fontFamily: MONO,
          color: TEXT_PRIMARY
        }}
      >
        <code dangerouslySetInnerHTML={{ __html: tokens }} />
      </pre>
    </div>
  );
}

function highlight(code: string, lang: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let html = esc(code);

  if (lang === 'bash' || lang === 'shell' || lang === 'sh') {
    html = html.replace(
      /^(\$|>)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
    html = html.replace(
      /\b(curl|cd|ls|mkdir|pip|npm|docker|sudo|export|psql|wget|tar|chmod|systemctl|kubectl|helm|nginx|certbot)\b/g,
      `<span style="color:${ACCENT}">$1</span>`
    );
    html = html.replace(
      /(--?[\w-]+)/g,
      `<span style="color:#9FE1CB">$1</span>`
    );
    html = html.replace(/(".*?")/g, `<span style="color:#F4C0D1">$1</span>`);
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
  } else if (lang === 'json') {
    html = html.replace(
      /"([^"]+)":/g,
      `<span style="color:${ACCENT}">"$1"</span>:`
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
      `<span style="color:${ACCENT}">$1</span>`
    );
    html = html.replace(
      /("[^"]*"|'[^']*')/g,
      `<span style="color:#F4C0D1">$1</span>`
    );
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  } else if (lang === 'sql') {
    html = html.replace(
      /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|VIEW|MATERIALIZED|REFRESH|WITH|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|DISTINCT|UNION|ALL|CASE|WHEN|THEN|ELSE|END)\b/gi,
      `<span style="color:${ACCENT}">$&</span>`
    );
    html = html.replace(/('[^']*')/g, `<span style="color:#F4C0D1">$1</span>`);
    html = html.replace(
      /(--.*$)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  } else if (lang === 'yaml' || lang === 'yml') {
    html = html.replace(
      /^([\s-]*)([\w_-]+):/gm,
      `$1<span style="color:${ACCENT}">$2</span>:`
    );
    html = html.replace(
      /(#.*$)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
    html = html.replace(/(".*?")/g, `<span style="color:#F4C0D1">$1</span>`);
  } else {
    /* js/ts default */
    html = html.replace(
      /\b(const|let|var|function|return|if|else|for|while|async|await|import|from|export|default|new|class|extends|implements|interface|type|null|undefined|true|false|try|catch|throw|finally|of|in|typeof|instanceof)\b/g,
      `<span style="color:${ACCENT}">$1</span>`
    );
    html = html.replace(
      /("[^"]*"|'[^']*'|`[^`]*`)/g,
      `<span style="color:#F4C0D1">$1</span>`
    );
    html = html.replace(
      /(\/\/.*$)/gm,
      `<span style="color:${TEXT_TERTIARY}">$1</span>`
    );
    html = html.replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color:#FAC775">$1</span>`
    );
  }
  return html;
}

/* =============================================================
 * CALLOUT
 * ============================================================= */

export function Callout({
  kind = 'info',
  children
}: {
  kind?: 'info' | 'warn' | 'tip' | 'danger';
  children: ReactNode;
}) {
  const colors = {
    info: {
      bg: 'rgba(74,222,128,0.05)',
      border: 'rgba(74,222,128,0.25)',
      dot: ACCENT,
      label: 'NOTE'
    },
    warn: {
      bg: 'rgba(250,199,117,0.05)',
      border: 'rgba(250,199,117,0.25)',
      dot: '#FAC775',
      label: 'CAUTION'
    },
    tip: {
      bg: 'rgba(159,225,203,0.05)',
      border: 'rgba(159,225,203,0.25)',
      dot: '#9FE1CB',
      label: 'TIP'
    },
    danger: {
      bg: 'rgba(244,144,144,0.05)',
      border: 'rgba(244,144,144,0.25)',
      dot: '#F49090',
      label: 'WARNING'
    }
  };
  const c = colors[kind];
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        padding: '14px 18px',
        margin: '20px 0',
        fontSize: 14,
        lineHeight: 1.6,
        color: TEXT_PRIMARY
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: c.dot,
          letterSpacing: '0.12em',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: c.dot
          }}
        />
        {c.label}
      </div>
      <div>{children}</div>
    </div>
  );
}

/* =============================================================
 * PARAM TABLE (for API / config docs)
 * ============================================================= */

export interface ParamRow {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: ReactNode;
}

export function ParamTable({ rows }: { rows: ParamRow[] }) {
  return (
    <div
      style={{
        margin: '20px 0',
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      {rows.map((r, i) => (
        <div
          key={r.name}
          style={{
            padding: '16px 18px',
            borderTop: i === 0 ? 'none' : `1px solid ${BORDER}`,
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: 24,
            background: i % 2 === 0 ? 'transparent' : 'rgba(138,171,135,0.02)'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                color: TEXT_PRIMARY,
                fontWeight: 500
              }}
            >
              {r.name}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: TEXT_TERTIARY,
                marginTop: 4,
                letterSpacing: '0.02em'
              }}
            >
              {r.type}
              {r.required && (
                <span style={{ color: '#F49090', marginLeft: 6 }}>
                  required
                </span>
              )}
              {r.defaultValue && (
                <span style={{ color: TEXT_SECONDARY, marginLeft: 6 }}>
                  default: {r.defaultValue}
                </span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.6 }}>
            {r.description}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =============================================================
 * ENDPOINT HEADER (for /endpoints page)
 * ============================================================= */

export function EndpointHeader({
  method,
  path
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
}) {
  const methodColors: Record<string, string> = {
    GET: '#9FE1CB',
    POST: ACCENT,
    PUT: '#FAC775',
    PATCH: '#FAC775',
    DELETE: '#F49090'
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(8,14,8,0.6)',
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: '10px 14px',
        margin: '16px 0',
        fontFamily: MONO,
        fontSize: 13
      }}
    >
      <span
        style={{
          color: methodColors[method],
          fontWeight: 600,
          letterSpacing: '0.06em',
          minWidth: 50
        }}
      >
        {method}
      </span>
      <span style={{ color: TEXT_PRIMARY }}>{path}</span>
    </div>
  );
}

/* =============================================================
 * DEFINITION LIST (used in glossary)
 * ============================================================= */

export function DefList({
  items
}: {
  items: { term: string; def: ReactNode }[];
}) {
  return (
    <dl style={{ margin: '20px 0' }}>
      {items.map(item => (
        <div
          key={item.term}
          style={{
            paddingBottom: 18,
            marginBottom: 18,
            borderBottom: `1px solid ${BORDER}`
          }}
        >
          <dt
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: ACCENT,
              fontWeight: 500,
              marginBottom: 6,
              letterSpacing: '0.02em'
            }}
          >
            {item.term}
          </dt>
          <dd
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.7,
              color: TEXT_SECONDARY
            }}
          >
            {item.def}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* =============================================================
 * PAGE TITLE
 * ============================================================= */

export function PageTitle({
  eyebrow,
  title,
  lede
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: TEXT_TERTIARY,
          marginBottom: 24,
          fontFamily: MONO,
          letterSpacing: '0.06em'
        }}
      >
        <a
          href='#introduction'
          style={{ color: TEXT_TERTIARY, textDecoration: 'none' }}
        >
          DOCS
        </a>
        <span>/</span>
        <span style={{ color: TEXT_SECONDARY }}>{eyebrow}</span>
      </nav>
      <h1
        style={{
          fontSize: 'clamp(36px, 4.5vw, 48px)',
          fontWeight: 500,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          margin: '0 0 20px',
          color: TEXT_PRIMARY
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.6,
          color: TEXT_SECONDARY,
          marginBottom: 40,
          maxWidth: 680
        }}
      >
        {lede}
      </p>
    </>
  );
}
