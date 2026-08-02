import { ReactNode } from 'react';
import cn from 'classnames';

type ProseTableProps = {
  head: ReactNode[];
  rows: ReactNode[][];
};

export function ProseTable({ head, rows }: ProseTableProps) {
  return (
    <div className='my-5 overflow-x-auto rounded-btn border border-edge-soft'>
      <table className='w-full border-collapse text-left'>
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th
                key={i}
                className='px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gold'
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr
              key={r}
              className={cn(
                'border-t border-edge-soft',
                r % 2 === 0 ? '' : 'bg-[rgba(138,171,135,0.02)]'
              )}
            >
              {row.map((cell, c) => (
                <td
                  key={c}
                  className='px-4 py-3 align-top text-sm leading-relaxed text-secondary-warm'
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
