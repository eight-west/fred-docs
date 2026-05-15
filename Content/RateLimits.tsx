import { Heading, CodeBlock, ParamTable, Callout, InlineCode, PageTitle } from '../Prose';

export const rateLimitsToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'tiers', label: 'Tiers' },
  { id: 'headers', label: 'Headers' },
  { id: 'best-practices', label: 'Best practices' }
];

export default function RateLimitsPage() {
  return (
    <>
      <PageTitle
        eyebrow='API'
        title='Rate limits'
        lede='Per-key rate limits keep FRED responsive for everyone. Limits are generous for research workloads and adjustable for production users.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Rate limits are enforced per API key using a token-bucket algorithm.
        Each request consumes one token. Tokens refill at the per-second rate
        for your tier. The bucket size is 10x the per-second rate, allowing
        short bursts.
      </p>

      <Heading id='tiers' level={2}>
        Tiers
      </Heading>
      <ParamTable
        rows={[
          { name: 'Research', type: 'tier', description: '20 requests per minute (per-key). 5,000 requests per day. Default for academic and analyst keys.' },
          { name: 'Operator', type: 'tier', description: '120 requests per minute. 50,000 requests per day. For California biomass operators with production needs.' },
          { name: 'Enterprise', type: 'tier', description: 'Negotiated. For partners with high-volume integrations.' }
        ]}
      />

      <Heading id='headers' level={2}>
        Headers
      </Heading>
      <p>
        Every response includes rate limit headers so clients can self-throttle:
      </p>
      <CodeBlock
        lang='bash'
        code={`X-RateLimit-Limit: 20         # per-minute limit
X-RateLimit-Remaining: 14     # tokens left
X-RateLimit-Reset: 1730487600 # unix timestamp when bucket fully refills`}
      />
      <p>When throttled, the response includes:</p>
      <CodeBlock
        lang='bash'
        code={`HTTP/1.1 429 Too Many Requests
Retry-After: 12`}
      />

      <Heading id='best-practices' level={2}>
        Best practices
      </Heading>
      <ul>
        <li>
          Track <InlineCode>X-RateLimit-Remaining</InlineCode> and slow down
          preemptively when it drops below 10% of the limit.
        </li>
        <li>
          Honor <InlineCode>Retry-After</InlineCode>. Ignoring it can extend
          the throttle window.
        </li>
        <li>
          For batch workloads, use the tool endpoints directly rather than
          the agent endpoint. Tool calls cost one token; agent calls can
          consume 5-12 tokens of internal tool budget but still count as one
          external request.
        </li>
        <li>
          Use deterministic batch endpoints for bulk regional analysis rather
          than looping single-point queries.
        </li>
      </ul>

      <Callout kind='tip'>
        Need higher limits? Email{' '}
        <a href='mailto:frredss@ucdavis.edu'>frredss@ucdavis.edu</a> with your
        expected query pattern. We routinely raise limits for research use.
      </Callout>
    </>
  );
}
