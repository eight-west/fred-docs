import { Heading, CodeBlock, ParamTable, Callout, InlineCode, PageTitle } from '../Prose';

export const envToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'core', label: 'Core' },
  { id: 'database', label: 'Database' },
  { id: 'services', label: 'External services' },
  { id: 'agent', label: 'Agent tuning' },
  { id: 'cache', label: 'Cache' },
  { id: 'observability', label: 'Observability' }
];

export default function EnvPage() {
  return (
    <>
      <PageTitle
        eyebrow='DEPLOYMENT'
        title='Environment variables'
        lede='Every configuration knob FRED exposes. The .env.example file in the repo contains sensible defaults; this page documents what each one means and when to change it.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        FRED reads all configuration from environment variables on process
        start. Values are not reloaded at runtime; restart the API service
        after changing them. Quote values that contain special characters.
      </p>

      <Heading id='core' level={2}>
        Core
      </Heading>
      <ParamTable
        rows={[
          { name: 'ANTHROPIC_API_KEY', type: 'string', required: true, description: 'Used by the agent reasoning layer. Get one from console.anthropic.com.' },
          { name: 'API_HOST', type: 'string', defaultValue: '0.0.0.0', description: 'Bind address for the FastAPI server.' },
          { name: 'API_PORT', type: 'integer', defaultValue: '8000', description: 'Port for the FastAPI server.' },
          { name: 'CORS_ALLOWED_ORIGINS', type: 'string', defaultValue: '*', description: 'Comma-separated list of allowed origins. Tighten this in production.' },
          { name: 'LOG_LEVEL', type: 'string', defaultValue: 'INFO', description: 'One of DEBUG, INFO, WARN, ERROR.' }
        ]}
      />

      <Heading id='database' level={2}>
        Database
      </Heading>
      <ParamTable
        rows={[
          { name: 'DB_HOST', type: 'string', defaultValue: 'postgis', description: 'PostGIS host. Default is the service name in the Compose network.' },
          { name: 'DB_PORT', type: 'integer', defaultValue: '5432', description: 'PostGIS port.' },
          { name: 'DB_USER', type: 'string', required: true, description: 'Database user with read access to all FRED materialized views.' },
          { name: 'DB_PASS', type: 'string', required: true, description: 'Database password. Special characters must be quoted.' },
          { name: 'DB_NAME', type: 'string', defaultValue: 'firegnn', description: 'Database name. Historical naming from the original GNN model.' },
          { name: 'DB_POOL_MIN', type: 'integer', defaultValue: '2', description: 'Minimum connection pool size.' },
          { name: 'DB_POOL_MAX', type: 'integer', defaultValue: '20', description: 'Maximum connection pool size. Increase for high-concurrency deployments.' }
        ]}
      />

      <Heading id='services' level={2}>
        External services
      </Heading>
      <ParamTable
        rows={[
          { name: 'REDIS_URL', type: 'string', defaultValue: 'redis://redis:6379/0', description: 'Redis connection string. Used for tool cache and session state.' },
          { name: 'OSRM_URL', type: 'string', defaultValue: 'http://osrm:5001', description: 'OSRM routing service. Must be running with the truck profile.' }
        ]}
      />

      <Heading id='agent' level={2}>
        Agent tuning
      </Heading>
      <ParamTable
        rows={[
          { name: 'AGENT_MODEL', type: 'string', defaultValue: 'claude-sonnet-4-6', description: 'Claude model to use. Opus gives better reasoning at higher cost.' },
          { name: 'AGENT_MAX_STEPS', type: 'integer', defaultValue: '12', description: 'Maximum agent reasoning steps before forced response.' },
          { name: 'AGENT_TEMPERATURE', type: 'float', defaultValue: '0.0', description: 'Sampling temperature. Keep low for deterministic procurement recommendations.' },
          { name: 'AGENT_TIMEOUT_S', type: 'integer', defaultValue: '60', description: 'Total agent loop timeout in seconds.' }
        ]}
      />

      <Heading id='cache' level={2}>
        Cache
      </Heading>
      <ParamTable
        rows={[
          { name: 'CACHE_TTL_DEFAULT', type: 'integer', defaultValue: '86400', description: 'Default tool cache TTL in seconds (24 hours).' },
          { name: 'CACHE_TTL_REGIONAL', type: 'integer', defaultValue: '604800', description: 'TTL for compute_regional_summary (7 days; aggregations rarely change).' },
          { name: 'SESSION_TTL', type: 'integer', defaultValue: '86400', description: 'Session state TTL.' },
          { name: 'CACHE_VERSION', type: 'string', defaultValue: 'v1', description: 'Prefix bumping value. Change to invalidate all cache entries.' }
        ]}
      />

      <Heading id='observability' level={2}>
        Observability
      </Heading>
      <ParamTable
        rows={[
          { name: 'TRACE_ENABLED', type: 'boolean', defaultValue: 'true', description: 'Whether to record agent traces for the /traces endpoint.' },
          { name: 'TRACE_RETENTION_DAYS', type: 'integer', defaultValue: '7', description: 'How long traces are kept before being purged.' },
          { name: 'METRICS_ENABLED', type: 'boolean', defaultValue: 'true', description: 'Expose Prometheus metrics on /metrics.' }
        ]}
      />

      <Callout kind='tip'>
        For a production deployment, set <InlineCode>LOG_LEVEL=INFO</InlineCode>,
        tighten <InlineCode>CORS_ALLOWED_ORIGINS</InlineCode>, and keep{' '}
        <InlineCode>AGENT_TEMPERATURE=0.0</InlineCode>. Reproducibility
        matters for analyst workflows.
      </Callout>
    </>
  );
}
