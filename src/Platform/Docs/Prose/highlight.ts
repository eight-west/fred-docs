import {
  HIGHLIGHT_COMMENT,
  HIGHLIGHT_FLAG,
  HIGHLIGHT_KEYWORD,
  HIGHLIGHT_LITERAL,
  HIGHLIGHT_STRING
} from './tokens';

// Tiny per-language syntax highlighter.
//
// Every rule matches against the *source*, never against the HTML being built.
// The previous version chained String.replace passes over its own output, so a
// later pass would match the colour literal inside an earlier pass's style
// attribute: `<span style="color:#4ADE80">` fed the string rule `"[^"]*"`,
// which wrapped the attribute value in a second span and left the browser
// parsing `style=<span` as an unquoted attribute. The hex then rendered as
// visible text next to the keyword.
//
// One combined regex per language, scanned once, escaping at emit time is what
// keeps that from being possible rather than merely unlikely.

type Kind = 'keyword' | 'string' | 'comment' | 'literal' | 'flag';

const COLOR: Record<Kind, string> = {
  keyword: HIGHLIGHT_KEYWORD,
  comment: HIGHLIGHT_COMMENT,
  string: HIGHLIGHT_STRING,
  literal: HIGHLIGHT_LITERAL,
  flag: HIGHLIGHT_FLAG
};

// `lead` is matched but painted as plain text, for the rules that need
// left-hand context they should not colour (YAML keys need their indent).
type Rule = { kind: Kind; source: string; lead?: string };

type Language = { rules: Rule[]; ignoreCase?: boolean };

const JS_KEYWORDS =
  'const|let|var|function|return|if|else|for|while|async|await|import|from|' +
  'export|default|new|class|extends|implements|interface|type|null|undefined|' +
  'true|false|try|catch|throw|finally|of|in|typeof|instanceof';

const PY_KEYWORDS =
  'import|from|def|class|return|if|else|elif|for|in|while|with|as|async|await|' +
  'None|True|False|try|except|finally|raise|yield|lambda';

const SQL_KEYWORDS =
  'SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|' +
  'LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|VIEW|' +
  'MATERIALIZED|REFRESH|WITH|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|DISTINCT|' +
  'UNION|ALL|CASE|WHEN|THEN|ELSE|END';

const SH_KEYWORDS =
  'curl|cd|ls|mkdir|pip|npm|docker|sudo|export|psql|wget|tar|chmod|systemctl|' +
  'kubectl|helm|nginx|certbot';

const NUMBER = '\\b\\d+\\.?\\d*\\b';

// Comments and strings come first: whichever rule owns a position owns every
// character it consumes, so a keyword inside a comment stays a comment.
const LANGUAGES: Record<string, Language> = {
  js: {
    rules: [
      { kind: 'comment', source: '//.*' },
      { kind: 'string', source: '"[^"]*"|\'[^\']*\'|`[^`]*`' },
      { kind: 'keyword', source: `\\b(?:${JS_KEYWORDS})\\b` },
      { kind: 'literal', source: NUMBER }
    ]
  },

  python: {
    rules: [
      { kind: 'comment', source: '#.*' },
      { kind: 'string', source: '"[^"]*"|\'[^\']*\'' },
      { kind: 'keyword', source: `\\b(?:${PY_KEYWORDS})\\b` },
      { kind: 'literal', source: NUMBER }
    ]
  },

  sql: {
    ignoreCase: true,
    rules: [
      { kind: 'comment', source: '--.*' },
      { kind: 'string', source: "'[^']*'" },
      { kind: 'keyword', source: `\\b(?:${SQL_KEYWORDS})\\b` },
      { kind: 'literal', source: NUMBER }
    ]
  },

  bash: {
    rules: [
      { kind: 'comment', source: '#.*' },
      { kind: 'string', source: '"[^"]*"' },
      { kind: 'comment', source: '^[$>]' },
      { kind: 'flag', source: '--?[\\w-]+' },
      { kind: 'keyword', source: `\\b(?:${SH_KEYWORDS})\\b` }
    ]
  },

  json: {
    rules: [
      { kind: 'keyword', source: '"[^"]*"(?=\\s*:)' },
      { kind: 'string', source: '"[^"]*"' },
      { kind: 'literal', source: '\\b(?:true|false|null)\\b' },
      { kind: 'literal', source: NUMBER }
    ]
  },

  yaml: {
    rules: [
      { kind: 'comment', source: '#.*' },
      { kind: 'string', source: '"[^"]*"' },
      {
        kind: 'keyword',
        lead: '^[ \\t]*(?:-[ \\t]+)?',
        source: '[\\w.$-]+(?=[ \\t]*:)'
      }
    ]
  },

  text: { rules: [] }
};

const ALIASES: Record<string, string> = {
  javascript: 'js',
  jsx: 'js',
  ts: 'js',
  tsx: 'js',
  typescript: 'js',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  txt: 'text',
  plain: 'text',
  plaintext: 'text'
};

const compiled = new Map<string, RegExp>();

function patternFor(name: string, language: Language): RegExp {
  const cached = compiled.get(name);
  if (cached) return cached;

  // Each rule gets a uniquely named group so a match can be traced back to the
  // rule that produced it without counting capture groups across alternatives.
  const source = language.rules
    .map((rule, i) =>
      rule.lead
        ? `(?<lead${i}>${rule.lead})(?<k${i}>${rule.source})`
        : `(?<k${i}>${rule.source})`
    )
    .join('|');

  const re = new RegExp(source, language.ignoreCase ? 'gmi' : 'gm');
  compiled.set(name, re);
  return re;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function paint(kind: Kind, text: string): string {
  return `<span style="color:${COLOR[kind]}">${esc(text)}</span>`;
}

export function highlight(code: string, lang: string): string {
  const name = ALIASES[lang] ?? (lang in LANGUAGES ? lang : 'js');
  const language = LANGUAGES[name];
  if (language.rules.length === 0) return esc(code);

  const re = patternFor(name, language);
  re.lastIndex = 0;

  let out = '';
  let pos = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code)) !== null) {
    // A rule that can match nothing would never advance lastIndex.
    if (match[0] === '') {
      re.lastIndex += 1;
      continue;
    }

    const groups = match.groups ?? {};
    const i = language.rules.findIndex(
      (_, index) => groups[`k${index}`] !== undefined
    );
    if (i === -1) continue;

    out += esc(code.slice(pos, match.index));
    if (groups[`lead${i}`]) out += esc(groups[`lead${i}`]);
    out += paint(language.rules[i].kind, groups[`k${i}`]);

    pos = match.index + match[0].length;
  }

  return out + esc(code.slice(pos));
}
