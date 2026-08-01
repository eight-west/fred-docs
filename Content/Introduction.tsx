import { Callout, DocLink, Heading, InlineCode, PageTitle } from '../Prose';

export const introductionToc = [
  { id: 'what-fred-does', label: 'What FRED does' },
  { id: 'who-its-for', label: "Who it's for" },
  { id: 'a-typical-question', label: 'A typical question' },
  { id: 'what-makes-fred-different', label: 'What makes FRED different' },
  { id: 'where-to-go-next', label: 'Where to go next' }
];

export default function IntroductionPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Introduction'
        lede="FRED is a conversational decision-support system for forest biomass procurement in California. Ask it a question in plain English, get back a defensible recommendation grounded in spatial data."
      />

      <Heading id='what-fred-does' level={2}>
        What FRED does
      </Heading>
      <p>
        Forest biomass procurement is a high-stakes spatial decision. Where do
        you site a facility? How much biomass can you actually source within
        an economic haul radius? What does it cost per ton once you account
        for terrain, transport, and harvest system? How does the answer
        change if you also want to prioritize wildfire risk reduction? How
        does it evolve over a 10-year operating horizon as nearby supply
        depletes?
      </p>
      <p>
        Each of these questions has historically required a specialist with a
        seat license to FRCS, access to GIS data, and a lot of patience.
        FRED collapses that workflow into a conversation.
      </p>
      <p>
        You ask FRED a question. It reasons about what data it needs, pulls
        the right spatial layers, runs the necessary calculations, and
        returns an answer grounded in the same models published in
        peer-reviewed research. The answer comes back as a recommendation
        card with a map, a supply curve, and a written justification you
        can act on.
      </p>

      <Heading id='who-its-for' level={2}>
        Who it's for
      </Heading>
      <p>
        FRED is designed for three audiences with overlapping but distinct
        needs:
      </p>
      <ul>
        <li>
          <strong>Biomass operators</strong> evaluating where to site a new
          facility or whether an existing site has enough sustainable supply.
          FRED returns the answer in minutes instead of weeks.
        </li>
        <li>
          <strong>Researchers</strong> studying biomass economics, fuels
          treatment, or fire risk reduction. FRED gives reproducible numbers
          against published prediction layers.
        </li>
        <li>
          <strong>Policy analysts</strong> quantifying the tradeoff between
          procurement cost and wildfire risk reduction. FRED's
          Pareto-weighted framework was designed for exactly this question.
        </li>
      </ul>

      <Heading id='a-typical-question' level={2}>
        A typical question
      </Heading>
      <p>
        FRED is most useful for questions that combine location, scale, and a
        preference. For example:
      </p>
      <Callout kind='info'>
        <em>"Where should I site a 20MW biomass facility near Redding if I
        want to prioritize fire risk reduction?"</em>
      </Callout>
      <p>
        FRED will geocode Redding, find candidate cluster supply within a
        defensible radius, evaluate the cost-vs-fire tradeoff across that
        supply, and return a specific recommended location with the
        full Pareto curve. A typical answer takes about 3 to 5 seconds.
      </p>
      <p>
        You can keep going from there. Follow-ups like <em>"what if I push
        the radius out to 60km?"</em> or <em>"how does the cost change over
        10 years?"</em> work without restating the original context.
        FRED remembers the conversation.
      </p>

      <Heading id='what-makes-fred-different' level={2}>
        What makes FRED different
      </Heading>
      <p>
        Three things, mainly.
      </p>
      <p>
        <strong>It thinks in spatial layers, not text.</strong> Most AI
        assistants retrieve text passages from documents and reason over
        them. FRED retrieves machine-learning predictions about cost,
        transport, and fire risk, then composes them at query time. The
        architecture, <InlineCode>Compositional Spatial RAG</InlineCode>, is
        purpose-built for this kind of question.
      </p>
      <p>
        <strong>Every answer is traceable.</strong> When FRED tells you a
        facility should cost $87.40 per BDT, you can see exactly which
        clusters contributed, what the surrogate predicted for each, what
        the haul distances were, and how the fire weighting shifted the
        result. There is no opaque embedding step.
      </p>
      <p>
        <strong>The underlying research is published.</strong> FRED is built
        on three peer-reviewed contributions: a learned harvest cost
        surrogate validated against FRCS, an empirical transport circuity
        model derived from 445,000 truck-profile routes, and a fire-aware
        Pareto framework built over USDA's burn probability data. See the{' '}
        <DocLink to='methodology-overview'>Methodology</DocLink> section for the
        details.
      </p>

      <Heading id='where-to-go-next' level={2}>
        Where to go next
      </Heading>
      <p>If you want to get started right away:</p>
      <ul>
        <li>
          Read <a href='#first-query'>Your first query</a> to learn how to
          phrase questions effectively.
        </li>
        <li>
          Read <a href='#reading-answers'>Reading FRED's answers</a> to
          understand what each part of the response means.
        </li>
      </ul>
      <p>If you want to understand the system first:</p>
      <ul>
        <li>
          <a href='#capabilities-overview'>What FRED can do</a> walks through
          the kinds of questions FRED handles well.
        </li>
        <li>
          <a href='#methodology-overview'>Methodology</a> covers the research
          behind the predictions.
        </li>
      </ul>
    </>
  );
}
