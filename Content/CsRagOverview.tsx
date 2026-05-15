import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const csRagOverviewToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'three-tier-architecture', label: 'Three-tier architecture' },
  { id: 'why-compositional', label: 'Why "Compositional"' },
  { id: 'why-not-vector-rag', label: 'Why not vector RAG' },
  { id: 'request-lifecycle', label: 'Request lifecycle' },
  { id: 'agent-vs-llm', label: 'The agent dispatches, not the LLM' }
];

export default function CsRagOverviewPage() {
  return (
    <>
      <PageTitle
        eyebrow='CS-RAG'
        title='Architecture overview'
        lede="CS-RAG is FRED's domain-specific retrieval architecture. It treats spatial prediction layers as first-class retrievable objects, composed dynamically at query time, with tool-level deterministic caching."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Conventional retrieval-augmented generation (RAG) retrieves text
        chunks and lets the language model reason over them. FRED's domain is
        not textual; it is spatial. A query like "find biomass near Redding"
        does not retrieve documents, it retrieves <em>clusters with predicted
        attributes from three different machine-learning layers</em>.
      </p>
      <p>
        CS-RAG generalizes RAG to this setting. The retrievable objects are
        spatial prediction layers. The composition step is a learned or
        deterministic procedure that joins those layers at query-relevant
        locations. The agent reasoning loop decides which layers to retrieve
        and how to compose them, much like a conventional agent decides which
        documents to look up.
      </p>

      <Heading id='three-tier-architecture' level={2}>
        Three-tier architecture
      </Heading>
      <p>CS-RAG runs in three tiers:</p>

      <Heading id='tier-1' level={3}>
        Tier 1: persistent spatial store
      </Heading>
      <p>
        PostGIS 17 with H3-indexed materialized views. The store holds
        cluster polygons, precomputed predictions, and aggregated rollups at
        H3 resolutions 4, 5, and 6. This tier is read-mostly and refreshes
        nightly when new data is available.
      </p>

      <Heading id='tier-2' level={3}>
        Tier 2: tool layer
      </Heading>
      <p>
        Nine domain-specific tools that wrap the persistent store and the ML
        models. Each tool has a precise input schema, a precise output
        schema, and deterministic behavior. The tools are <em>not</em>{' '}
        LLM-callable functions in the loose sense; they are typed functions
        with cacheable parameter sets. See <a href='#tools'>Tool definitions</a>{' '}
        for the full list.
      </p>

      <Heading id='tier-3' level={3}>
        Tier 3: agent reasoning loop
      </Heading>
      <p>
        A ReAct-style loop that uses Claude as the reasoning backbone. The
        agent receives a natural-language query and produces a sequence of
        tool invocations, interleaved with reasoning steps. At each turn,
        the agent either calls a tool or emits a final response.
      </p>

      <CodeBlock
        lang='python'
        filename='Pseudocode'
        code={`while not done:
    thought = llm.generate_thought(history)
    if thought.is_final:
        return synthesize_response(history)
    tool_name, tool_args = thought.tool_call
    result = tools[tool_name](**tool_args)  # cached at this layer
    history.append((thought, result))`}
      />

      <Heading id='why-compositional' level={2}>
        Why "Compositional"
      </Heading>
      <p>
        The "C" in CS-RAG distinguishes it from monolithic retrieval. A single
        query touches multiple layers, and the composition is dynamic:
      </p>
      <ul>
        <li>
          A facility siting query touches cluster supply, harvest cost,
          transport circuity, and burn probability.
        </li>
        <li>
          A regional summary query touches the H3-aggregated views but not
          the per-cluster surrogate.
        </li>
        <li>
          A "what if I weight fire risk at 0.3" query touches Pareto frontier
          computation, which composes cost and fire layers.
        </li>
      </ul>
      <p>
        The composition is decided at query time by the agent. Layers can be
        added or replaced without changing the agent code; tools are the
        only contract.
      </p>

      <Heading id='why-not-vector-rag' level={2}>
        Why not vector RAG
      </Heading>
      <p>
        It is worth being explicit about why FRED is not built on the typical
        embeddings-and-cosine-similarity stack. Three reasons:
      </p>
      <ol>
        <li>
          <strong>The objects we retrieve are spatial polygons and ML
          predictions, not text.</strong> Embeddings would either be lossy
          (encoding everything as text and embedding the text) or contrived
          (training a custom spatial embedding that is unnecessary given
          PostGIS does the spatial work natively).
        </li>
        <li>
          <strong>Caching at the tool level is correctness-guaranteed.</strong>{' '}
          Cache invalidation is keyed on the exact spatial parameters of each
          tool call. Vector caches over natural-language queries are loose
          and can return semantically similar but factually wrong results.
        </li>
        <li>
          <strong>Auditability.</strong> Every FRED recommendation has a fully
          deterministic trace: tool A returned X, tool B returned Y, the
          agent synthesized Z. There is no "the embedding found this similar
          thing" step that obscures reasoning.
        </li>
      </ol>

      <Callout kind='tip'>
        CS-RAG and vector RAG are complementary, not competitive. A future
        version of FRED could add vector retrieval over the research papers
        and policy documents to ground its written explanations. The spatial
        retrieval would still run through CS-RAG.
      </Callout>

      <Heading id='request-lifecycle' level={2}>
        Request lifecycle
      </Heading>
      <p>
        A full request from natural language to recommendation:
      </p>
      <ol>
        <li>
          <strong>Session lookup.</strong> The session_id is used to retrieve
          message history from Redis (24-hour TTL).
        </li>
        <li>
          <strong>Agent step 1: reasoning.</strong> Claude generates the first
          reasoning step. Typically it identifies the location and decides to
          geocode.
        </li>
        <li>
          <strong>Tool call: geocode_location.</strong> Returns lat/lng and
          county FIPS. Cached if the location string has been geocoded before.
        </li>
        <li>
          <strong>Agent step 2: decide what to retrieve.</strong> Claude
          decides to retrieve cluster supply around the geocoded point.
        </li>
        <li>
          <strong>Tool call: retrieve_cluster_supply.</strong> Returns the
          enriched cluster set within the default radius. Cached on (lat, lng,
          radius) tuple.
        </li>
        <li>
          <strong>Agent step 3: decide optimization.</strong> If the query
          mentioned fire risk, Claude calls compute_fire_pareto.
        </li>
        <li>
          <strong>Tool call: compute_fire_pareto.</strong> Returns the Pareto
          frontier and recommended alpha.
        </li>
        <li>
          <strong>Agent step 4: synthesize.</strong> Claude composes the
          natural-language response with embedded structured data.
        </li>
        <li>
          <strong>Session save.</strong> Updated history is written back to
          Redis.
        </li>
      </ol>

      <Heading id='agent-vs-llm' level={2}>
        The agent dispatches, not the LLM
      </Heading>
      <p>
        A small but important distinction: in CS-RAG, the LLM (Claude) is the
        reasoning backbone, but the dispatching is done by an explicit agent
        controller. Claude proposes tool calls; the agent controller
        validates the arguments, looks up cached results, invokes the actual
        tool implementation, and feeds the result back to Claude.
      </p>
      <p>
        This separation matters because it allows deterministic caching, hard
        input validation, error recovery without hallucination, and clean
        replay of any past session. The LLM does not have direct access to
        the database or to the prediction models; everything goes through
        typed tools.
      </p>
    </>
  );
}
