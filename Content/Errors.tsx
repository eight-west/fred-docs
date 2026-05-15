import { Heading, CodeBlock, ParamTable, Callout, InlineCode, PageTitle } from '../Prose';

export const errorsToc = [
  { id: 'response-shape', label: 'Response shape' },
  { id: 'status-codes', label: 'Status codes' },
  { id: 'error-codes', label: 'Error codes' },
  { id: 'retrying', label: 'Retrying' }
];

export default function ErrorsPage() {
  return (
    <>
      <PageTitle
        eyebrow='API'
        title='Errors'
        lede='How FRED reports errors, what status codes to expect, and which failures are safe to retry.'
      />

      <Heading id='response-shape' level={2}>
        Response shape
      </Heading>
      <p>
        Error responses always follow the same JSON shape. Status code is in
        the HTTP layer; the body provides detail.
      </p>
      <CodeBlock
        lang='json'
        code={`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'lat' must be between -90 and 90.",
    "field": "lat",
    "request_id": "req_a1b2c3d4..."
  }
}`}
      />
      <p>
        Always log <InlineCode>request_id</InlineCode>. When opening support
        tickets, include it; FRED operators use it to locate logs.
      </p>

      <Heading id='status-codes' level={2}>
        Status codes
      </Heading>
      <ParamTable
        rows={[
          { name: '200 OK', type: 'success', description: 'Request succeeded.' },
          { name: '202 Accepted', type: 'success', description: 'Long-running query started. Used only when stream=true and the connection drops mid-stream.' },
          { name: '400 Bad Request', type: 'client error', description: 'Validation failed. Inspect the error.field for which input was invalid.' },
          { name: '401 Unauthorized', type: 'client error', description: 'Missing or invalid Authorization header.' },
          { name: '403 Forbidden', type: 'client error', description: 'Authenticated but not authorized for this endpoint or scope.' },
          { name: '404 Not Found', type: 'client error', description: 'Resource (session, cluster, etc.) does not exist.' },
          { name: '429 Too Many Requests', type: 'client error', description: 'Rate limit exceeded. Retry-After header indicates when to retry.' },
          { name: '500 Internal Server Error', type: 'server error', description: 'Unexpected failure. Safe to retry with backoff.' },
          { name: '503 Service Unavailable', type: 'server error', description: 'Backend dependency unavailable (database, OSRM, Anthropic). Retry with backoff.' }
        ]}
      />

      <Heading id='error-codes' level={2}>
        Error codes
      </Heading>
      <ParamTable
        rows={[
          { name: 'VALIDATION_ERROR', type: 'string', description: 'Input failed schema validation. error.field identifies the problematic input.' },
          { name: 'AUTHENTICATION_FAILED', type: 'string', description: 'API key missing, malformed, or revoked.' },
          { name: 'AUTHORIZATION_FAILED', type: 'string', description: 'API key valid but does not have required scope.' },
          { name: 'SESSION_NOT_FOUND', type: 'string', description: 'session_id does not exist or has expired (24-hour TTL).' },
          { name: 'CLUSTER_NOT_FOUND', type: 'string', description: 'cluster_no does not exist in the current dataset.' },
          { name: 'OUTSIDE_COVERAGE', type: 'string', description: 'Query location is outside California. FRED is currently California-only.' },
          { name: 'RATE_LIMIT_EXCEEDED', type: 'string', description: 'Per-key rate limit exceeded. See Rate limits.' },
          { name: 'TOOL_TIMEOUT', type: 'string', description: 'A specific tool exceeded its timeout budget. Returned with 503.' },
          { name: 'AGENT_STEP_BUDGET', type: 'string', description: 'Agent reasoning loop did not reach a final response within max_steps.' },
          { name: 'INTERNAL_ERROR', type: 'string', description: 'Unspecified server error. Always include request_id in support tickets.' }
        ]}
      />

      <Heading id='retrying' level={2}>
        Retrying
      </Heading>
      <p>Retry rules:</p>
      <ul>
        <li>
          <strong>5xx errors:</strong> safe to retry. Use exponential backoff
          starting at 500ms, max 30s.
        </li>
        <li>
          <strong>429:</strong> retry after the Retry-After header value.
          Honor it; aggressive retries against a rate limit will extend the
          throttle window.
        </li>
        <li>
          <strong>4xx other than 429:</strong> do not retry. Fix the client
          and try again.
        </li>
        <li>
          <strong>AGENT_STEP_BUDGET:</strong> increase max_steps and retry, or
          simplify the query.
        </li>
      </ul>

      <Callout kind='tip'>
        FRED's agent endpoint is idempotent only when given the same{' '}
        <InlineCode>session_id</InlineCode>. Retrying with a new session ID
        produces a fresh conversation, not a replay.
      </Callout>
    </>
  );
}
