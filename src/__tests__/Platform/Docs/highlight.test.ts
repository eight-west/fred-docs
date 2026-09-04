import { highlight } from '../../../Platform/Docs/Prose/highlight';
import {
  HIGHLIGHT_COMMENT,
  HIGHLIGHT_KEYWORD,
  HIGHLIGHT_STRING
} from '../../../Platform/Docs/Prose/tokens';

// The highlighter's output goes through dangerouslySetInnerHTML, so what a
// reader sees is the parsed DOM, not the string. Assert against that.
function rendered(code: string, lang: string) {
  const host = document.createElement('pre');
  host.innerHTML = highlight(code, lang);
  return host;
}

function text(code: string, lang: string) {
  return rendered(code, lang).textContent;
}

// jsdom normalises a style property to its computed form, so compare the
// token colours through the same normalisation rather than against the raw
// token values.
function asCss(color: string) {
  const probe = document.createElement('span');
  probe.style.color = color;
  return probe.style.color;
}

function colorsIn(code: string, lang: string) {
  return Array.from(rendered(code, lang).querySelectorAll('span')).map(
    el => (el as HTMLElement).style.color
  );
}

const SAMPLES: Record<string, string> = {
  typescript: 'const a: number | null = null; // note\nlet b = `x`;',
  js: 'function f() { return 3; }',
  python: 'def f(x):\n    return "s"  # done',
  sql: "SELECT id FROM t WHERE n = 3 -- note",
  bash: '$ npm run build --prod  # ship it',
  yaml: 'name: fred  # comment\n  - key: "v"',
  json: '{"name": "fred", "n": 3, "ok": true}',
  text: 'const is not a keyword here'
};

describe('highlight', () => {
  // The bug this guards: colour literals from an already-emitted style
  // attribute were re-matched by later rules, so the browser parsed
  // `style=<span` as an unquoted attribute and printed the hex as text.
  it.each(Object.keys(SAMPLES))('leaves %s source intact', lang => {
    expect(text(SAMPLES[lang], lang)).toBe(SAMPLES[lang]);
  });

  it.each(Object.keys(SAMPLES))('never leaks a colour into %s text', lang => {
    expect(text(SAMPLES[lang], lang)).not.toMatch(/color:|#4ADE80|rgba\(245/);
  });

  it('escapes markup in the source rather than emitting it', () => {
    const host = rendered('const a = "<img src=x>";', 'ts');
    expect(host.querySelector('img')).toBeNull();
    expect(host.textContent).toBe('const a = "<img src=x>";');
  });

  it('paints keywords, strings and comments', () => {
    const colors = colorsIn('const a = "s"; // note', 'ts');
    expect(colors).toContain(asCss(HIGHLIGHT_KEYWORD));
    expect(colors).toContain(asCss(HIGHLIGHT_STRING));
    expect(colors).toContain(asCss(HIGHLIGHT_COMMENT));
  });

  it('lets a comment own a keyword inside it', () => {
    expect(colorsIn('// return const', 'ts')).toEqual([asCss(HIGHLIGHT_COMMENT)]);
  });

  it('paints nothing in a plain text block', () => {
    expect(colorsIn(SAMPLES.text, 'text')).toEqual([]);
  });

  it('falls back to the js rules for an unknown language', () => {
    expect(colorsIn('const a = 1;', 'brainfuck')).toContain(
      asCss(HIGHLIGHT_KEYWORD)
    );
  });
});
