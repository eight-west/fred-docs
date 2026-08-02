const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ESCAPES[c]);
}

function renderInline(nodes = []) {
  return nodes
    .map(node => {
      if (node.t === 'link') {
        const href = escapeHtml(node.href);
        const external = !node.href.startsWith('/');
        const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${href}"${rel}>${renderInline(node.children)}</a>`;
      }
      let out = escapeHtml(node.v);
      if (node.c) out = `<code>${out}</code>`;
      if (node.b) out = `<strong>${out}</strong>`;
      if (node.i) out = `<em>${out}</em>`;
      return out;
    })
    .join('');
}

function renderBlock(block) {
  switch (block.t) {
    case 'h':
      return `<h${block.level} id="${escapeHtml(block.id)}">${renderInline(
        block.children
      )}</h${block.level}>`;

    case 'p':
      return `<p>${renderInline(block.children)}</p>`;

    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      const items = block.items
        .map(item => `<li>${item.map(renderBlock).join('')}</li>`)
        .join('');
      return `<${tag}>${items}</${tag}>`;
    }

    case 'code':
      return `<pre><code>${escapeHtml(block.code)}</code></pre>`;

    case 'callout':
      return `<blockquote>${block.children.map(renderBlock).join('')}</blockquote>`;

    case 'img': {
      const caption = block.caption
        ? `<figcaption>${escapeHtml(block.caption)}</figcaption>`
        : '';
      return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(
        block.alt
      )}" />${caption}</figure>`;
    }

    case 'table': {
      const head = block.head
        .map(cell => `<th>${renderInline(cell)}</th>`)
        .join('');
      const rows = block.rows
        .map(row => `<tr>${row.map(c => `<td>${renderInline(c)}</td>`).join('')}</tr>`)
        .join('');
      return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
    }

    case 'hr':
      return '<hr />';

    default:
      return '';
  }
}

export function blocksToHtml(blocks = []) {
  return blocks.map(renderBlock).join('');
}

export function blocksToPlainText(blocks = [], limit = 300) {
  const parts = [];

  const walkInline = nodes =>
    nodes.map(n => (n.t === 'link' ? walkInline(n.children) : n.v)).join('');

  const walk = list => {
    for (const b of list) {
      if (b.t === 'p' || b.t === 'h') parts.push(walkInline(b.children));
      else if (b.t === 'list') b.items.forEach(walk);
      else if (b.t === 'callout') walk(b.children);
    }
  };

  walk(blocks);
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}
