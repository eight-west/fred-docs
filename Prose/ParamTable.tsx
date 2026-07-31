import { ReactNode } from 'react';
import { MONO } from './tokens';

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
