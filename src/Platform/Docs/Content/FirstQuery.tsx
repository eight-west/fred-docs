import { Heading, Callout, PageTitle } from '../Prose';

export const firstQueryToc = [
  { id: 'starting-out', label: 'Starting out' },
  { id: 'good-questions', label: 'Good questions to ask' },
  { id: 'what-to-include', label: 'What to include' },
  { id: 'following-up', label: 'Following up' },
  { id: 'common-mistakes', label: 'Common mistakes' }
];

export default function FirstQueryPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Your first query'
        lede='FRED takes plain-English questions. The phrasing matters less than the content. This page covers what to include so FRED can answer well, and what common phrasings work best.'
      />

      <Heading id='starting-out' level={2}>
        Starting out
      </Heading>
      <p>
        Open <a href='/chat'>FRED chat</a> and type. There is no command
        syntax. You can write the way you would describe the problem to a
        colleague. FRED will ask follow-up questions if it needs more
        information.
      </p>
      <p>
        The fastest way to get a useful answer is to include three things in
        your first message: a <strong>location</strong>, a{' '}
        <strong>scale</strong>, and a <strong>preference</strong>.
      </p>

      <Heading id='good-questions' level={2}>
        Good questions to ask
      </Heading>
      <p>
        Here are examples that work well, paired with the kind of answer
        FRED will return.
      </p>
      <Callout kind='info'>
        <em>"Find biomass for a 20MW facility near Redding."</em>
        <br />
        <span className="text-[13px] opacity-70">
          → returns a recommended site, supply curve, and projected LCOE
        </span>
      </Callout>
      <Callout kind='info'>
        <em>"How much sustainable biomass is available within 50km of
        Burney, CA?"</em>
        <br />
        <span className="text-[13px] opacity-70">
          → returns total BDT/year, number of contributing clusters, and a
          map overlay
        </span>
      </Callout>
      <Callout kind='info'>
        <em>"Compare procurement cost between a Quincy and Susanville
        facility, both at 15MW."</em>
        <br />
        <span className="text-[13px] opacity-70">
          → returns side-by-side cost and supply for both candidate sites
        </span>
      </Callout>
      <Callout kind='info'>
        <em>"What's the leverage ratio for fire risk reduction in Shasta
        County?"</em>
        <br />
        <span className="text-[13px] opacity-70">
          → returns the cost-vs-fire Pareto curve with the knee identified
        </span>
      </Callout>
      <Callout kind='info'>
        <em>"Show me cluster supply over 10 years if I run a 25MW plant
        near Auburn."</em>
        <br />
        <span className="text-[13px] opacity-70">
          → returns a year-by-year supply curve with depletion modeling
        </span>
      </Callout>

      <Heading id='what-to-include' level={2}>
        What to include
      </Heading>
      <p>
        FRED works best when it has these inputs. You can leave any of them
        out and FRED will ask, but giving them up-front skips a turn.
      </p>
      <ul>
        <li>
          <strong>Location.</strong> A town, county, watershed, or coordinate
          pair all work. <em>"near Redding"</em>, <em>"in Plumas County"</em>,
          and <em>"around 40.5, -121.6"</em> all resolve fine.
        </li>
        <li>
          <strong>Facility scale.</strong> Either as MW capacity ("a 20MW
          plant") or as biomass demand ("about 40,000 BDT per year"). FRED
          knows the standard conversions between common technology types.
        </li>
        <li>
          <strong>Preference.</strong> What you want to optimize for.
          Cost-only is the default. If you want fire-risk weighting say
          something like <em>"prioritize fire risk"</em> or <em>"weight fire
          at 0.05"</em>. If you want multi-year, say <em>"over 10 years"</em>.
        </li>
      </ul>

      <Heading id='following-up' level={2}>
        Following up
      </Heading>
      <p>
        FRED remembers the conversation. After an initial query, you can
        refine without restating everything:
      </p>
      <ul>
        <li><em>"What about with a 60km radius instead?"</em></li>
        <li><em>"How does that look at α = 0.1?"</em></li>
        <li><em>"Project this over 15 years."</em></li>
        <li><em>"What if I move the facility 10km north?"</em></li>
        <li><em>"Show me only the clusters in the very low fire risk tier."</em></li>
      </ul>
      <p>
        FRED keeps track of the location, scale, and preferences you
        established. Follow-ups generally come back in 1-2 seconds because
        much of the underlying data is already in cache.
      </p>

      <Heading id='common-mistakes' level={2}>
        Common mistakes
      </Heading>
      <p>
        A few patterns that confuse FRED or produce less useful answers:
      </p>
      <ul>
        <li>
          <strong>Asking about places outside California.</strong> FRED is
          currently scoped to California. <em>"biomass near Portland,
          Oregon"</em> will return an out-of-coverage notice.
        </li>
        <li>
          <strong>Asking about specific cluster IDs.</strong> Cluster
          numbers are internal identifiers; phrase questions in terms of
          location and scale instead.
        </li>
        <li>
          <strong>Asking for absolute lowest cost without realism
          constraints.</strong> The cheapest cluster in California is
          isolated and supply-limited. Always include a scale; "as cheap as
          possible" without context is not actionable.
        </li>
        <li>
          <strong>Confusing total biomass with annual supply.</strong> When
          FRED says a region has 38,000 BDT/year of supply, that's the
          annual sustainable yield given current prescriptions, not a
          one-time inventory.
        </li>
      </ul>

      <Callout kind='tip'>
        If FRED's answer doesn't match your intuition, ask <em>"why?"</em> or{' '}
        <em>"what drove this?"</em>. FRED can show its work: which clusters
        contributed, what their predicted costs were, what the haul
        distances looked like.
      </Callout>
    </>
  );
}
