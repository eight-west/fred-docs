import {
  Heading,
  InlineCode,
  CodeBlock,
  Callout,
  PageTitle
} from '../Prose';

export const introductionToc = [
  { id: 'what-is-fred', label: 'What is FRED' },
  { id: 'who-this-is-for', label: 'Who this is for' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'first-query', label: 'Your first query' },
  { id: 'next-steps', label: 'Next steps' }
];

export default function IntroductionPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Introduction'
        lede="FRED is a decision-support system for forest biomass procurement in California. This guide explains what FRED does, who it's for, and how to ask your first question."
      />

      <Heading id='what-is-fred' level={2}>
        What is FRED
      </Heading>
      <p>
        FRED is the conversational interface to a statewide spatial
        decision-support system for forest biomass procurement. It composes
        three machine-learning prediction layers, a harvest cost surrogate, a
        transport circuity model, and a wildfire burn probability raster,
        through an agentic architecture called{' '}
        <InlineCode>Compositional Spatial RAG</InlineCode> (CS-RAG).
      </p>
      <p>
        Under the hood, FRED indexes 2.1 million harvest clusters across
        California using PostGIS with H3 hexagonal binning. A 9-tool ReAct-style
        agent orchestrates queries against the prediction layers, with
        deterministic caching at the tool level for sub-second response times.
      </p>

      <Callout kind='info'>
        FRED is currently scoped to California. The CS-RAG architecture is
        region-agnostic and can be extended with equivalent regional datasets.
      </Callout>

      <Heading id='who-this-is-for' level={2}>
        Who this is for
      </Heading>
      <p>
        FRED is designed for three audiences with overlapping but distinct needs:
      </p>
      <ul>
        <li>
          <strong>Biomass operators</strong> evaluating procurement feasibility
          for candidate facility locations. FRED returns supply curves, cost
          projections, and fire-risk-weighted alternatives without requiring you
          to run FRCS yourself.
        </li>
        <li>
          <strong>Researchers</strong> who need reproducible parameterized runs
          against the same prediction layers powering the chat interface. Direct
          tool endpoints are available for scripted workflows.
        </li>
        <li>
          <strong>Policy analysts</strong> quantifying the tradeoff between
          procurement cost and wildfire risk reduction at the watershed, county,
          or statewide level.
        </li>
      </ul>

      <Heading id='how-it-works' level={2}>
        How it works
      </Heading>
      <p>A typical FRED query flows through four stages:</p>
      <ol>
        <li>
          <strong>Intent parsing.</strong> The agent extracts location,
          capacity, and weighting preferences from natural language.
        </li>
        <li>
          <strong>Spatial retrieval.</strong> Relevant cluster supply vectors
          are pulled from PostGIS materialized views, filtered by radius.
        </li>
        <li>
          <strong>Layer composition.</strong> Harvest cost, transport circuity,
          and fire probability layers are joined per-cluster and weighted
          according to the user's alpha.
        </li>
        <li>
          <strong>Synthesis.</strong> The agent returns a procurement
          recommendation with a multi-year supply curve and LCOE projection.
        </li>
      </ol>

      <Heading id='first-query' level={3}>
        Your first query
      </Heading>
      <p>
        The fastest way to see FRED in action is the chat interface at{' '}
        <a href='https://biofred.us/chat'>biofred.us/chat</a>. For programmatic
        access, send a query directly to the agent endpoint:
      </p>

      <CodeBlock
        lang='bash'
        code={`curl -X POST https://api.biofred.us/agent \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "query": "Find biomass for a 20MW facility near Redding. Prioritize fire risk.",
    "session_id": "demo"
  }'`}
      />

      <p>
        The response includes both the natural-language recommendation and the
        structured spatial result:
      </p>

      <CodeBlock
        lang='json'
        code={`{
  "recommendation": "Site near Burney, CA. Supplies 42.3k BDT/yr at $87.40/BDT with 5.8x fire-risk leverage at alpha=0.05.",
  "facility": {
    "lat": 40.589,
    "lng": -121.658,
    "capacity_mw": 20
  },
  "supply_curve": {
    "total_bdt_per_year": 42300,
    "lcoe_per_bdt": 87.40,
    "radius_km": 43,
    "alpha": 0.05
  },
  "tool_calls": [
    {"name": "geocode_location", "ms": 142},
    {"name": "retrieve_cluster_supply", "ms": 387},
    {"name": "compute_fire_pareto", "ms": 201},
    {"name": "project_multi_year", "ms": 154}
  ]
}`}
      />

      <Callout kind='tip'>
        Use <InlineCode>session_id</InlineCode> to maintain conversational
        context across turns. Sessions are stored in Redis with a 24-hour TTL.
      </Callout>

      <Heading id='next-steps' level={2}>
        Next steps
      </Heading>
      <p>You're ready to go deeper. We recommend:</p>
      <ul>
        <li>
          Read <a href='#quickstart'>Quickstart</a> for a self-hosted walkthrough.
        </li>
        <li>
          Read <a href='#concepts'>Concepts</a> to understand the spatial
          prediction layer taxonomy.
        </li>
        <li>
          See <a href='#cs-rag-overview'>CS-RAG architecture</a> for the full
          agent design.
        </li>
        <li>
          Try the <a href='#endpoints'>API reference</a> for programmatic access.
        </li>
      </ul>
    </>
  );
}
