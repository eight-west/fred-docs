import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const selfHostingToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Production architecture' },
  { id: 'compose-stack', label: 'Docker Compose stack' },
  { id: 'cloud-deployment', label: 'Cloud deployment' },
  { id: 'data-volumes', label: 'Data volumes' },
  { id: 'tls-and-routing', label: 'TLS and routing' },
  { id: 'monitoring', label: 'Monitoring' }
];

export default function SelfHostingPage() {
  return (
    <>
      <PageTitle
        eyebrow='DEPLOYMENT'
        title='Self-hosting'
        lede='Deploy FRED on your own infrastructure. This guide covers the production-ready Docker Compose stack, GCP and AWS templates, data volume management, TLS, and basic monitoring.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        FRED self-hosts cleanly. The reference deployment is a single
        Compute Engine VM with Docker Compose. The production deployment at{' '}
        <a href='https://biofred.us'>biofred.us</a> uses a{' '}
        <InlineCode>e2-standard-2</InlineCode> instance in us-west2-c. Larger
        deployments can shard the database tier separately.
      </p>

      <Heading id='architecture' level={2}>
        Production architecture
      </Heading>
      <p>Services in the stack:</p>
      <ul>
        <li><strong>API</strong> (FastAPI + Python 3.11): the agent and tool endpoints.</li>
        <li><strong>PostGIS 17</strong>: cluster storage, materialized views, spatial joins.</li>
        <li><strong>Redis 7</strong>: tool-level cache, session state.</li>
        <li><strong>OSRM</strong>: routing with the truck profile. Container exposes port 5001.</li>
        <li><strong>Nginx</strong>: TLS termination, static asset hosting, reverse proxy to API.</li>
      </ul>
      <p>
        The frontend (Create React App build) is deployed separately on
        Netlify and consumes the API over HTTPS. Self-hosters can serve it
        from Nginx if they prefer.
      </p>

      <Heading id='compose-stack' level={2}>
        Docker Compose stack
      </Heading>
      <CodeBlock
        lang='yaml'
        filename='docker-compose.yml'
        code={`services:
  postgis:
    image: postgis/postgis:17-3.5
    environment:
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASS}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - postgis_data:/var/lib/postgresql/data
      - ./db_init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru
    restart: unless-stopped

  osrm:
    image: osrm/osrm-backend:v5.27.1
    volumes:
      - ./osrm_data:/data
    command: osrm-routed --algorithm mld /data/california.osrm
    ports:
      - "5001:5000"
    restart: unless-stopped

  api:
    build: ./api
    env_file: .env
    ports:
      - "8000:8000"
    depends_on:
      - postgis
      - redis
      - osrm
    volumes:
      - ./models:/app/models:ro
    restart: unless-stopped

volumes:
  postgis_data:
  redis_data:`}
      />

      <Callout kind='warn'>
        <InlineCode>.env</InlineCode> contains your database password and
        Anthropic API key. Quote values with special characters using single
        quotes. Never commit this file.
      </Callout>

      <Heading id='cloud-deployment' level={2}>
        Cloud deployment
      </Heading>
      <p>
        The reference cloud deployment uses Google Compute Engine. Equivalent
        AWS / Azure flows work fine; the only requirement is Docker.
      </p>
      <CodeBlock
        lang='bash'
        code={`# Create the VM
gcloud compute instances create fred-prod \\
  --zone=us-west2-c \\
  --machine-type=e2-standard-2 \\
  --boot-disk-size=100GB \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud

# SSH in
gcloud compute ssh fred-prod --zone=us-west2-c

# Install Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin

# Clone and start
git clone https://github.com/aunshx/csrag.git
cd csrag
cp .env.example .env  # edit it
sudo docker compose up -d`}
      />
      <p>
        Note: on Debian/Ubuntu, all <InlineCode>docker</InlineCode> commands
        require <InlineCode>sudo</InlineCode> unless your user is in the
        docker group.
      </p>

      <Heading id='data-volumes' level={2}>
        Data volumes
      </Heading>
      <p>Three data volumes need to be populated on first start:</p>
      <ul>
        <li>
          <strong>PostGIS</strong>: cluster polygons, materialized views,
          burn probability raster. Roughly 4 GB.
        </li>
        <li>
          <strong>OSRM data</strong>: pre-processed California road network
          with the truck profile. Roughly 1.2 GB.
        </li>
        <li>
          <strong>Models</strong>: the surrogate (<InlineCode>surrogate.pkl</InlineCode>),
          IDW raster (<InlineCode>cf_idw.tif</InlineCode>), normalization
          bounds (<InlineCode>norm_bounds.json</InlineCode>). Roughly 60 MB.
        </li>
      </ul>
      <p>See <a href='#data-prep'>Data prep</a> for the population pipeline.</p>

      <Heading id='tls-and-routing' level={2}>
        TLS and routing
      </Heading>
      <p>
        For production, terminate TLS at Nginx in front of the API. The
        biofred.us deployment uses <InlineCode>nip.io</InlineCode> for
        development and a Namecheap A record plus certbot for production.
      </p>
      <CodeBlock
        lang='bash'
        code={`# Issue a Let's Encrypt cert for api.biofred.us
sudo certbot --nginx \\
  -d api.biofred.us \\
  --non-interactive \\
  --agree-tos \\
  --email admin@biofred.us`}
      />
      <CodeBlock
        lang='nginx'
        code={`server {
    listen 443 ssl http2;
    server_name api.biofred.us;

    ssl_certificate /etc/letsencrypt/live/api.biofred.us/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.biofred.us/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }
}`}
      />

      <Heading id='monitoring' level={2}>
        Monitoring
      </Heading>
      <p>The basic monitoring surface:</p>
      <ul>
        <li>
          <InlineCode>GET /health</InlineCode>: liveness probe. Returns 200 if
          DB, Redis, and models are loaded.
        </li>
        <li>
          <InlineCode>GET /metrics</InlineCode>: Prometheus metrics. Tool
          latencies, cache hit rates, per-tier rate limit usage.
        </li>
        <li>
          <strong>Logs</strong>: structured JSON to stdout. Capture with your
          log collector of choice.
        </li>
      </ul>
      <p>
        For production, hook the <InlineCode>/health</InlineCode> endpoint
        into your uptime monitor and scrape <InlineCode>/metrics</InlineCode>{' '}
        with Prometheus. Grafana dashboards are in{' '}
        <InlineCode>deploy/grafana/</InlineCode> in the repo.
      </p>
    </>
  );
}
