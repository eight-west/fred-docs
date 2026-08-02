import { HIGHLIGHT_KEYWORD, HIGHLIGHT_COMMENT } from './tokens';

export function highlight(code: string, lang: string): string {
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
