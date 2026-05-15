import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const quickstartToc = [
  { id: 'prerequisites', label: 'Prerequisites' },
  { id: 'install', label: 'Install' },
  { id: 'configure', label: 'Configure' },
  { id: 'first-query', label: 'First query' },
  { id: 'whats-next', label: "What's next" }
];

export default function QuickstartPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Quickstart'
        lede='Get FRED running locally in about ten minutes. This walkthrough covers cloning the repo, starting the backend services, and running your first agent query.'
      />

      <Heading id='prerequisites' level={2}>
        Prerequisites
      </Heading>
      <p>You need the following installed on your machine:</p>
      <ul>
        <li>Docker Engine 24+ and Docker Compose v2</li>
        <li>Node.js 20+ (for the frontend, optional for API-only use)</li>
        <li>Git, curl</li>
        <li>An Anthropic API key (the agent uses Claude for reasoning)</li>
        <li>A USDA FSim raster license (free, registration required) if you plan to ingest fresh fire data</li>
      </ul>
      <p>
        Hardware: 8 GB RAM minimum, 16 GB recommended. The PostGIS database
        with all materialized views is roughly 4 GB on disk after ingest.
      </p>

      <Heading id='install' level={2}>
        Install
      </Heading>
      <p>Clone the repository and start the backend services:</p>
      <CodeBlock
        lang='bash'
        code={`git clone https://github.com/aunshx/csrag.git
cd csrag

# copy the example env and edit it
cp .env.example .env
# open .env in your editor and set:
#   ANTHROPIC_API_KEY=sk-ant-...
#   DB_PASS=<choose a password>

# bring up postgis, redis, and the api
docker compose up -d

# wait ~30s for postgis to initialize, then verify
curl http://localhost:8000/health`}
      />

      <p>A successful health response looks like:</p>

      <CodeBlock
        lang='json'
        code={`{
  "status": "ok",
  "db": "connected",
  "redis": "connected",
  "models": {
    "cost_surrogate": "loaded",
    "transport_idw": "loaded",
    "fire_raster": "loaded"
  }
}`}
      />

      <Callout kind='warn'>
        If the <InlineCode>models</InlineCode> field shows any layer as{' '}
        <InlineCode>missing</InlineCode>, you need to run the data prep
        pipeline. See <a href='#data-prep'>Data prep</a>.
      </Callout>

      <Heading id='configure' level={2}>
        Configure
      </Heading>
      <p>
        The default configuration is suitable for development. For production
        deployments, you'll want to review the full{' '}
        <a href='#env'>environment variables reference</a>. The most important
        settings:
      </p>
      <CodeBlock
        lang='bash'
        filename='.env'
        code={`# Anthropic key for the agent reasoning layer
ANTHROPIC_API_KEY=sk-ant-...

# PostGIS connection
DB_HOST=postgis
DB_PORT=5432
DB_USER=fred
DB_PASS=changeme
DB_NAME=firegnn

# Redis (used for tool-level caching and session state)
REDIS_URL=redis://redis:6379/0

# OSRM service for road network routing
OSRM_URL=http://osrm:5001

# Default model
AGENT_MODEL=claude-sonnet-4-6
AGENT_MAX_STEPS=12`}
      />

      <Heading id='first-query' level={2}>
        First query
      </Heading>
      <p>Send a query to the agent endpoint:</p>
      <CodeBlock
        lang='bash'
        code={`curl -X POST http://localhost:8000/agent \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Where should I site a 10MW biomass facility in Shasta County?",
    "session_id": "quickstart-1"
  }'`}
      />
      <p>
        The agent streams its reasoning. You'll see it geocode Shasta County,
        retrieve cluster supply within a default radius, compute a Pareto
        frontier across cost and fire risk, then synthesize a recommendation.
        Total roundtrip is typically 2-5 seconds.
      </p>

      <Heading id='whats-next' level={2}>
        What's next
      </Heading>
      <p>You have a working FRED instance. From here:</p>
      <ul>
        <li>
          Learn the <a href='#concepts'>core concepts</a>: clusters, prediction
          layers, alpha weighting.
        </li>
        <li>
          Browse the <a href='#tools'>9 agent tools</a> to see what queries are
          possible.
        </li>
        <li>
          Read the <a href='#endpoints'>API reference</a> if you're integrating
          programmatically.
        </li>
      </ul>
    </>
  );
}
