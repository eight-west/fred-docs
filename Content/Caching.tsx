import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const cachingToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'cache-key', label: 'Cache key' },
  { id: 'invalidation', label: 'Invalidation' },
  { id: 'hit-rates', label: 'Hit rates' },
  { id: 'warm-vs-cold', label: 'Warm vs cold latency' }
];

export default function CachingPage() {
  return (
    <>
      <PageTitle
        eyebrow='CS-RAG'
        title='Caching model'
        lede='FRED caches at the tool-invocation level using Redis. Cache keys are deterministic over canonicalized tool inputs, which gives precise invalidation and guaranteed correctness.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Every tool invocation in CS-RAG is cached. The cache is shared across
        sessions; if two users ask similar questions resulting in identical
        tool calls, the second user gets the cached result. This is safe
        because tool outputs are deterministic given their inputs, and the
        cache key includes the exact input.
      </p>
      <p>
        FRED chose tool-level caching over query-level caching deliberately.
        Query-level caching (cache the final agent response if a similar
        natural-language query arrives) is loose and hard to invalidate. Tool-
        level caching is precise and invalidation is well-defined.
      </p>

      <Heading id='cache-key' level={2}>
        Cache key
      </Heading>
      <p>
        The cache key for a tool call is:
      </p>
      <CodeBlock
        lang='python'
        code={`def cache_key(tool_name: str, args: dict) -> str:
    canonical = json.dumps(args, sort_keys=True, separators=(",", ":"))
    return f"fred:tool:{tool_name}:v1:{sha256(canonical)[:16]}"`}
      />
      <p>
        Floats are rounded to fixed precision (6 decimal places for lat/lng,
        2 for cost, 4 for probabilities) before hashing. This prevents false
        cache misses from float noise on equivalent queries.
      </p>

      <Heading id='invalidation' level={2}>
        Invalidation
      </Heading>
      <p>
        Three kinds of invalidation happen automatically:
      </p>
      <ol>
        <li>
          <strong>TTL.</strong> Default 24-hour TTL on all cache entries.
          Tools can override (e.g. <InlineCode>compute_regional_summary</InlineCode>{' '}
          uses 7-day TTL since it rolls up rarely-changing data).
        </li>
        <li>
          <strong>Model version.</strong> When the surrogate model or IDW
          raster is refreshed, the tool version bumps, which changes the
          cache key prefix. Old cache entries become unreachable and Redis
          ages them out.
        </li>
        <li>
          <strong>Manual flush.</strong> The <InlineCode>POST /admin/flush_cache</InlineCode>{' '}
          endpoint clears entries by tool name pattern.
        </li>
      </ol>

      <Callout kind='warn'>
        Cache entries are never silently mutated. If you ship a fix to a tool
        that changes its output for the same input, bump the tool version.
        Mutating a tool's behavior without a version bump can produce
        confusing results for users hitting cached responses.
      </Callout>

      <Heading id='hit-rates' level={2}>
        Hit rates
      </Heading>
      <p>
        Production hit rates across the nine tools:
      </p>
      <ul>
        <li><InlineCode>geocode_location</InlineCode>: ~92% (place names repeat).</li>
        <li><InlineCode>retrieve_cluster_supply</InlineCode>: ~58% (popular facility locations dominate).</li>
        <li><InlineCode>compute_cost</InlineCode>: ~71% (cluster cost lookup).</li>
        <li><InlineCode>get_transport_circuity</InlineCode>: ~84% (rounded coordinates).</li>
        <li><InlineCode>compute_fire_pareto</InlineCode>: ~42% (depends on radius and demand).</li>
        <li><InlineCode>project_multi_year</InlineCode>: ~28% (more parameters mean more cache variety).</li>
      </ul>
      <p>Overall query-weighted hit rate is roughly 64%.</p>

      <Heading id='warm-vs-cold' level={2}>
        Warm vs cold latency
      </Heading>
      <p>End-to-end query latency depends heavily on cache state:</p>
      <ul>
        <li><strong>Warm cache:</strong> 350-800 ms typical.</li>
        <li><strong>Cold cache, fast query (small radius):</strong> 1.2-2.0 seconds.</li>
        <li><strong>Cold cache, large radius:</strong> 3-5 seconds.</li>
        <li><strong>Cold cache, multi-year projection:</strong> 4-7 seconds.</li>
      </ul>
      <p>
        Roughly 70% of the warm-cache latency is the LLM reasoning loop, not
        the tool calls themselves. The tool layer is fast; the agent's
        thinking is the long pole.
      </p>
    </>
  );
}
