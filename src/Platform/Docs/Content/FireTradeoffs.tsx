import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const fireTradeoffsToc = [
  { id: 'what-it-does', label: 'What it does' },
  { id: 'how-to-ask', label: 'How to ask' },
  { id: 'reading-the-pareto', label: 'Reading the Pareto curve' },
  { id: 'the-leverage-knee', label: 'The leverage knee' },
  { id: 'structural-ceilings', label: 'Structural ceilings' },
  { id: 'policy-context', label: 'Policy context' }
];

export default function FireTradeoffsPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title='Fire-risk tradeoff exploration'
        lede="FRED's most policy-relevant capability. Quantify exactly how much it costs to weight biomass procurement toward fire-prone areas, and how much fire risk reduction you actually get for the spend."
      />

      <Heading id='what-it-does' level={2}>
        What it does
      </Heading>
      <p>
        Biomass procurement and wildfire risk reduction have an obvious
        connection: thinning fire-prone forests removes fuel and produces
        biomass. The question is how much it costs to prioritize fire-prone
        clusters over the cheapest available supply.
      </p>
      <p>
        FRED's fire-aware procurement framework answers this explicitly. By
        adjusting a single weighting parameter (alpha), you trade cost for
        fire-risk reduction. FRED computes the full Pareto frontier and
        identifies the leverage knee, the point where additional fire
        weighting stops being a good deal.
      </p>

      <Heading id='how-to-ask' level={2}>
        How to ask
      </Heading>
      <ul>
        <li><em>"Show me the cost-vs-fire Pareto curve for a 20MW facility near Redding."</em></li>
        <li><em>"What's the leverage ratio for fire risk reduction in Shasta County?"</em></li>
        <li><em>"How much extra does it cost to prioritize fire risk at alpha = 0.05?"</em></li>
        <li><em>"What's the cheapest way to get 50% fire risk reduction in this region?"</em></li>
      </ul>

      <Heading id='reading-the-pareto' level={2}>
        Reading the Pareto curve
      </Heading>
      <p>
        FRED returns the Pareto curve as a chart with cost on the x-axis
        and fire-risk score on the y-axis. Each point on the curve
        corresponds to a different alpha (fire weighting from 0 to 1). The
        leftmost point is the cost-only optimum; the rightmost is the
        fire-only optimum.
      </p>
      <p>
        The curve is invariably concave: at low alpha, small increases in
        cost buy large amounts of fire reduction. As you move right, you
        spend more per unit of additional fire reduction. The shape itself
        is the policy-relevant information.
      </p>

      <Heading id='the-leverage-knee' level={2}>
        The leverage knee
      </Heading>
      <p>
        The leverage ratio at any point on the curve is:
      </p>
      <Callout kind='info'>
        leverage = fire reduction percentage / cost premium percentage
      </Callout>
      <p>
        At the knee, leverage is maximized. Across California, the knee
        consistently sits near <InlineCode>alpha = 0.05</InlineCode>, where
        the leverage ratio is roughly <strong>5.8x</strong>. In other words,
        a 1 percent cost premium buys 5.8 percent fire reduction at the
        knee.
      </p>
      <p>
        Past the knee, leverage declines fast. At alpha = 0.5, the leverage
        ratio is typically around 1.5x. At alpha = 1.0, it's near 0.9x.
      </p>
      <p>
        The practical implication: modest fire weighting is usually a clear
        win for any operator with policy incentives or community
        relationships that value fire risk reduction. Aggressive fire
        weighting requires either strong external incentives or programmatic
        commitment to the goal.
      </p>

      <Heading id='structural-ceilings' level={2}>
        Structural ceilings
      </Heading>
      <p>
        One counterintuitive finding from FRED's data: even at maximum fire
        weighting (alpha = 1), roughly 57 percent of procurement stays in
        the Very Low fire-risk tier. This is a structural ceiling, not a
        modeling limit.
      </p>
      <p>
        The ceiling exists because biomass and high-fire-risk areas only
        partially overlap geographically. Some of California's most
        fire-prone areas have low biomass density (chaparral, oak woodland).
        Some of the highest biomass densities are in lower-fire-risk
        montane forests. When alpha pushes procurement toward fire-prone
        supply, the available cluster pool shrinks rapidly.
      </p>

      <Callout kind='info'>
        This ceiling is a real-world constraint, not a flaw. It means even
        aggressively fire-targeted biomass programs are bounded by where
        biomass and fire risk actually coincide. Policymakers benefit from
        knowing this when designing incentive structures.
      </Callout>

      <Heading id='policy-context' level={2}>
        Policy context
      </Heading>
      <p>
        California's biomass procurement landscape is shaped by several
        policy frameworks:
      </p>
      <ul>
        <li>
          <strong>BioRAM</strong> (Bioenergy Resource and Market Adjustments
          Mechanism) provides preferential PPA pricing for facilities
          sourcing from high-fire-hazard zones. FRED's Pareto framework can
          be tuned to BioRAM-style criteria.
        </li>
        <li>
          <strong>BioMAT</strong> targets smaller facilities with similar
          incentive structure.
        </li>
        <li>
          <strong>Forest Resilience Bond</strong> and <strong>California
          Climate Investments</strong> programs increasingly factor wildfire
          risk reduction into funding decisions. FRED can quantify the
          implicit alpha embedded in these criteria.
        </li>
      </ul>
      <p>
        If you have a specific policy framework in mind, tell FRED. It can
        often translate the framework's stated priorities into an
        equivalent alpha and run the analysis accordingly.
      </p>
    </>
  );
}
