import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const reactLoopToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'turn-structure', label: 'Turn structure' },
  { id: 'state-management', label: 'State management' },
  { id: 'stopping', label: 'Stopping conditions' },
  { id: 'observability', label: 'Observability' }
];

export default function ReactLoopPage() {
  return (
    <>
      <PageTitle
        eyebrow='CS-RAG'
        title='ReAct loop'
        lede='The reasoning-acting loop that drives FRED. At each turn, Claude either calls a tool or emits a final response. The loop is bounded by a step budget and instrumented for tracing.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        ReAct stands for Reasoning + Acting. The model alternates between a
        natural-language reasoning trace ("I should geocode the location
        first") and a structured tool invocation. After each tool returns,
        the model takes the result into account and reasons again.
      </p>
      <p>
        This pattern is well-established (the original paper is Yao et al.,
        2023). FRED's contribution is the typed-tool dispatcher and the
        deterministic caching layer underneath, not the loop itself.
      </p>

      <Heading id='turn-structure' level={2}>
        Turn structure
      </Heading>
      <p>Each agent turn produces one of three outputs:</p>
      <ol>
        <li>
          <strong>Tool call.</strong> The model wants to invoke a tool. The
          dispatcher validates the call, looks up cached results, executes
          the tool if needed, and appends the result to history.
        </li>
        <li>
          <strong>Final response.</strong> The model has enough information.
          The synthesized response is returned to the user.
        </li>
        <li>
          <strong>Continued reasoning.</strong> The model emits a thought
          without a tool call. This is rare but happens occasionally when
          the model is consolidating prior tool results.
        </li>
      </ol>

      <CodeBlock
        lang='python'
        code={`async def react_step(state: SessionState) -> Action:
    response = await claude.complete(
        messages=state.history,
        tools=TOOL_SCHEMAS,
        system=SYSTEM_PROMPT
    )

    if response.stop_reason == "tool_use":
        tool_call = response.tool_calls[0]
        return ToolAction(tool_call.name, tool_call.input)

    if response.stop_reason == "end_turn":
        return FinalResponse(response.text)

    return ContinueAction(response.text)`}
      />

      <Heading id='state-management' level={2}>
        State management
      </Heading>
      <p>
        Session state lives in Redis with a 24-hour TTL. State includes:
      </p>
      <ul>
        <li>Full message history (user, assistant, tool result alternation)</li>
        <li>Geocoded location (cached at session level for context reuse)</li>
        <li>Session-level alpha preference if set</li>
        <li>Last facility center (for "what about further out?" follow-ups)</li>
      </ul>
      <p>
        Large objects are <em>not</em> stored in session state. The full
        cluster supply result from <InlineCode>retrieve_cluster_supply</InlineCode>{' '}
        can be tens of thousands of clusters; it lives in the tool cache,
        not the session. The session stores the tool call key and re-fetches
        when needed.
      </p>

      <Callout kind='info'>
        This separation matters for cost control. Session state grows
        linearly with conversation length; without excluding large objects,
        long sessions would quickly hit the Redis 512 KB string limit.
      </Callout>

      <Heading id='stopping' level={2}>
        Stopping conditions
      </Heading>
      <p>The loop terminates when one of:</p>
      <ol>
        <li>
          The model emits a final response (<InlineCode>stop_reason: "end_turn"</InlineCode>).
        </li>
        <li>
          The step budget is exhausted. Default is{' '}
          <InlineCode>AGENT_MAX_STEPS=12</InlineCode>. When exceeded, the
          agent emits a partial response with whatever information it has.
        </li>
        <li>
          A tool error is unrecoverable. Validation errors and database
          unavailability propagate up.
        </li>
      </ol>

      <Heading id='observability' level={2}>
        Observability
      </Heading>
      <p>
        Every agent step is logged to the trace store. Each trace record
        includes the model thought, the tool name and input, the tool latency,
        cache hit/miss, and the tool output size. Traces are available via
        the API at <InlineCode>GET /traces/&#123;session_id&#125;</InlineCode>.
      </p>
      <p>
        For debugging, the FRED chat interface displays the live trace as
        the agent works. Each tool call appears with its name, parameters,
        elapsed time, and a green checkmark when complete.
      </p>
    </>
  );
}
