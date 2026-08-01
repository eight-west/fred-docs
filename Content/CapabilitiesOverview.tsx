import { Callout, DocLink, Heading, PageTitle } from '../Prose';

export const capabilitiesOverviewToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'siting-vs-supply', label: 'Siting versus supply analysis' },
  { id: 'single-vs-multi-year', label: 'Single-year versus multi-year' },
  { id: 'cost-vs-tradeoff', label: 'Cost-only versus fire-aware' }
];

export default function CapabilitiesOverviewPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title="What FRED can do"
        lede="A guided tour of the question types FRED is designed to answer, with concrete examples for each. Use this page to figure out which capability page to read next."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        FRED's capabilities cluster into five overlapping query types, each
        documented on its own page in this section:
      </p>
      <ul>
        <li>
          <DocLink to='facility-siting'>Facility siting</DocLink>: where should I put a
          new biomass facility?
        </li>
        <li>
          <a href='#regional-supply'>Regional supply analysis</a>: how much
          biomass is available in a region, and what does it cost?
        </li>
        <li>
          <a href='#fire-tradeoffs'>Fire-risk tradeoff exploration</a>: how
          does prioritizing fire risk change the procurement picture?
        </li>
        <li>
          <a href='#multi-year'>Multi-year procurement planning</a>: how does
          supply and cost evolve over a 10-year operating horizon?
        </li>
        <li>
          <a href='#comparing-locations'>Comparing locations</a>: which of
          several candidate sites is better, and why?
        </li>
      </ul>

      <Heading id='siting-vs-supply' level={2}>
        Siting versus supply analysis
      </Heading>
      <p>
        The most common mix-up is between siting and supply analysis. They
        sound similar but are different questions.
      </p>
      <p>
        <strong>Siting</strong> asks: <em>"Given a target region, where
        specifically should I put the facility?"</em> FRED returns a
        specific coordinate, supply available there, and the projected LCOE.
      </p>
      <p>
        <strong>Supply analysis</strong> asks: <em>"Given a specific point,
        what supply is available?"</em> FRED returns the supply
        characteristics around that point but does not move the
        facility.
      </p>
      <p>
        In practice, an operator typically starts with supply analysis
        around a few candidate sites, then runs a siting query in the most
        promising region to find the local optimum.
      </p>

      <Heading id='single-vs-multi-year' level={2}>
        Single-year versus multi-year
      </Heading>
      <p>
        By default, FRED returns single-year (steady-state) results. The
        supply numbers represent sustainable annual yield given current
        prescriptions; the costs represent levelized per-BDT cost in the
        first year of operation.
      </p>
      <p>
        For long-term planning, ask explicitly for multi-year: "show me
        supply over 10 years" or "project this out 15 years." FRED switches
        to the depletion model, which simulates cluster harvest over time
        and shows you how the radius and cost evolve.
      </p>

      <Heading id='cost-vs-tradeoff' level={2}>
        Cost-only versus fire-aware
      </Heading>
      <p>
        FRED defaults to cost-only procurement. Add a phrase like
        "prioritize fire risk" or "weight fire at 0.05" to switch to the
        Pareto framework.
      </p>
      <p>
        Even if you don't intend to operate under a fire weighting, asking
        FRED to show you the Pareto curve is informative. The shape of the
        curve and the location of the leverage knee tell you how much
        "free" fire reduction is available before costs start climbing
        steeply. This is policy-relevant for understanding programs like
        BioRAM.
      </p>

      <Callout kind='tip'>
        If you're not sure where to start, the most useful first query for
        a new user is usually: <em>"What's the fire-vs-cost Pareto curve
        for a 20MW facility near {`[your candidate town]`}?"</em> This
        gives you the supply, the cost, and a sense of the regional fire
        risk in one query.
      </Callout>
    </>
  );
}
