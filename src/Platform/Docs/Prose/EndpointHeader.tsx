type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-tip',
  POST: 'text-accent',
  PUT: 'text-warn',
  PATCH: 'text-warn',
  DELETE: 'text-danger',
};

export function EndpointHeader({
  method,
  path,
}: {
  method: HttpMethod;
  path: string;
}) {
  return (
    <div className='my-4 flex items-center gap-3 rounded-tile border border-edge-soft bg-canvas-deep/60 px-3.5 py-2.5 font-mono text-[13px]'>
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
