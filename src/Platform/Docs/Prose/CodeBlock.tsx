import { useState } from 'react';
import { highlight } from './highlight';

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
    <div className='relative my-6 overflow-hidden rounded-tile border border-edge-soft bg-canvas-deep/70'>
      <div className='flex items-center justify-between border-b border-edge-soft px-3.5 py-2 font-mono text-[11px]'>
        <span className='tracking-[0.06em] text-secondary-soft'>
          {filename ? `${filename}` : lang}
        </span>
        <button
          onClick={copy}
          className={`cursor-pointer rounded-pill border-none bg-transparent px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
            copied ? 'text-accent' : 'text-secondary-soft hover:text-primary'
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
// attributes because the output is consumed by dangerouslySetInnerHTML:
// Tailwind classes wouldn't be picked up by the JIT here.
