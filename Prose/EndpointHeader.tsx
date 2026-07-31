import { MONO } from './tokens';

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
