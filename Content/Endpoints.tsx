import { Heading, CodeBlock, EndpointHeader, ParamTable, Callout, InlineCode, PageTitle } from '../Prose';

export const endpointsToc = [
  { id: 'base-url', label: 'Base URL' },
  { id: 'agent', label: 'Agent' },
  { id: 'tools', label: 'Tools' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'traces', label: 'Traces' },
  { id: 'admin', label: 'Admin' }
];

export default function EndpointsPage() {
  return (
    <>
      <PageTitle
        eyebrow='API'
        title='Endpoints'
        lede='Complete reference for the FRED REST API. All endpoints are JSON-in JSON-out, authenticated with a bearer token, and rate-limited per key.'
      />

      <Heading id='base-url' level={2}>
        Base URL
      </Heading>
      <CodeBlock lang='bash' code={`https://api.biofred.us`} />
      <p>
        Self-hosted deployments use the host configured in your environment.
        Local development typically uses <InlineCode>http://localhost:8000</InlineCode>.
      </p>

      <Heading id='agent' level={2}>
        Agent
      </Heading>
      <p>
        The primary endpoint. Send a natural-language query, get back a
        recommendation with structured spatial data.
      </p>

      <EndpointHeader method='POST' path='/agent' />
      <ParamTable
        rows={[
          { name: 'query', type: 'string', required: true, description: 'The user query in natural language.' },
          { name: 'session_id', type: 'string', description: 'UUID-formatted session identifier. If omitted, a new session is created.' },
          { name: 'stream', type: 'boolean', defaultValue: 'false', description: 'If true, returns Server-Sent Events with each reasoning step as it arrives.' },
          { name: 'max_steps', type: 'integer', defaultValue: '12', description: 'Cap on the agent reasoning loop length.' }
        ]}
      />
      <CodeBlock
        lang='bash'
        code={`curl -X POST https://api.biofred.us/agent \\
  -H "Authorization: Bearer $FRED_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Find biomass for a 20MW facility near Redding. Prioritize fire risk.",
    "session_id": "0c2a8e2e-1234-5678-90ab-cdef01234567"
  }'`}
      />

      <Heading id='tools' level={2}>
        Tools
      </Heading>
      <p>
        Direct access to individual tools, bypassing the agent. Useful for
        scripted workflows where you know exactly what you need.
      </p>

      <EndpointHeader method='POST' path='/tool/{tool_name}' />
      <p>
        <InlineCode>tool_name</InlineCode> is one of the nine tool names
        defined in <a href='#tools'>Tool definitions</a>. The request body
        is the tool's input schema.
      </p>
      <CodeBlock
        lang='bash'
        code={`# Direct cluster retrieval
curl -X POST https://api.biofred.us/tool/retrieve_cluster_supply \\
  -H "Authorization: Bearer $FRED_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "lat": 40.589,
    "lng": -121.658
  }'`}
      />

      <Heading id='sessions' level={2}>
        Sessions
      </Heading>

      <EndpointHeader method='GET' path='/sessions/{session_id}' />
      <p>Fetch the full state of a session.</p>

      <EndpointHeader method='DELETE' path='/sessions/{session_id}' />
      <p>Delete a session. Returns 204 on success.</p>

      <Heading id='traces' level={2}>
        Traces
      </Heading>

      <EndpointHeader method='GET' path='/traces/{session_id}' />
      <p>
        Return the full ReAct trace for a session: each tool call, its
        parameters, latency, cache hit status, and output size.
      </p>
      <CodeBlock
        lang='json'
        filename='Response'
        code={`{
  "session_id": "0c2a8e2e-...",
  "steps": [
    {
      "type": "thought",
      "content": "I need to geocode 'Redding' first.",
      "elapsed_ms": 412
    },
    {
      "type": "tool_call",
      "tool": "geocode_location",
      "args": {"location": "Redding, CA"},
      "elapsed_ms": 38,
      "cache_hit": true,
      "result_size_bytes": 142
    },
    {
      "type": "tool_call",
      "tool": "retrieve_cluster_supply",
      "args": {"lat": 40.589, "lng": -122.39},
      "elapsed_ms": 387,
      "cache_hit": false,
      "result_size_bytes": 184320
    }
  ]
}`}
      />

      <Heading id='admin' level={2}>
        Admin
      </Heading>

      <EndpointHeader method='POST' path='/admin/flush_cache' />
      <p>
        Flush cache entries matching a tool name pattern. Admin scope
        required.
      </p>
      <ParamTable
        rows={[
          { name: 'pattern', type: 'string', required: true, description: 'Tool name pattern, e.g. retrieve_cluster_supply or * for everything.' }
        ]}
      />

      <EndpointHeader method='POST' path='/admin/reload_models' />
      <p>
        Reload the surrogate, IDW raster, and burn raster from disk without
        restarting the service. Used after data prep refreshes.
      </p>

      <Callout kind='warn'>
        Admin endpoints log every invocation with the calling key. Use named
        admin keys (not shared between humans) so the audit trail is
        meaningful.
      </Callout>
    </>
  );
}
