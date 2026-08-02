import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const understandingFireToc = [
  { id: 'burn-probability', label: 'Burn probability' },
  { id: 'the-four-tiers', label: 'The four fire-risk tiers' },
  { id: 'alpha', label: 'Alpha: the weighting knob' },
  { id: 'leverage-ratio', label: 'The leverage ratio' },
  { id: 'fire-score', label: 'Fire score' }
];

export default function UnderstandingFirePage() {
  return (
    <>
      <PageTitle
        eyebrow='UNDERSTANDING THE NUMBERS'
        title='Fire risk: alpha, leverage, and the curve'
        lede="The vocabulary FRED uses to describe wildfire risk and the procurement tradeoff that lets you weight it. This page covers everything you'll see in a fire-aware response."
      />

      <Heading id='burn-probability' level={2}>
        Burn probability
      </Heading>
      <p>
        Every cluster in FRED has an associated <strong>annual burn
        probability</strong>, sourced from the USDA FSim 2024 wildfire
        simulator. The values range from approximately 0 (negligible risk)
        to about 0.08 (8 percent annual probability) for the most fire-
        prone clusters.
      </p>
      <p>
        Burn probability is computed at 30-meter pixel resolution by FSim,
        then area-weighted to each cluster polygon by FRED. A cluster with
        a burn probability of 0.03 has, on average, a 3 percent chance of
        burning in any given year under current climate and fuel
        conditions.
      </p>

      <Heading id='the-four-tiers' level={2}>
        The four fire-risk tiers
      </Heading>
      <p>
        For interpretive purposes, FRED groups clusters into four tiers
        based on burn probability percentiles:
      </p>
      <ul>
        <li>
          <strong>Very Low</strong>: clusters in the bottom half of statewide
          burn probability.
        </li>
        <li>
          <strong>Low</strong>: clusters in the 50th to 75th percentile.
        </li>
        <li>
          <strong>Moderate</strong>: 75th to 90th percentile.
        </li>
        <li>
          <strong>High</strong>: top 10 percent of statewide burn probability.
        </li>
      </ul>
      <p>
        FRED's responses will sometimes break supply down by tier ("65
        percent of your procurement comes from Very Low and Low tiers").
        This is useful context for programs like BioRAM that target
        specific risk levels.
      </p>

      <Heading id='alpha' level={2}>
        Alpha: the weighting knob
      </Heading>
      <p>
        Alpha is the single parameter that controls FRED's cost-versus-fire
        tradeoff. It ranges from 0 to 1:
      </p>
      <ul>
        <li>
          <InlineCode>alpha = 0</InlineCode>: pure cost optimization. FRED
          minimizes $/BDT regardless of fire risk in the contributing
          clusters.
        </li>
        <li>
          <InlineCode>alpha = 0.05</InlineCode>: modest fire weighting. The
          leverage knee for most California regions. Roughly 5.8 percent
          fire reduction per 1 percent cost premium.
        </li>
        <li>
          <InlineCode>alpha = 0.25</InlineCode>: meaningful fire weighting.
          Notable cost premium, declining leverage. Suitable for
          BioRAM-style contracts with explicit risk targets.
        </li>
        <li>
          <InlineCode>alpha = 0.5</InlineCode>: aggressive fire weighting.
          Substantially higher cost; smaller marginal fire reduction.
          Used for high-priority fire treatment programs.
        </li>
        <li>
          <InlineCode>alpha = 1.0</InlineCode>: pure fire optimization. FRED
          ignores cost. Useful as a theoretical benchmark.
        </li>
      </ul>
      <p>
        You can set alpha explicitly in a query ("at alpha = 0.1") or let
        FRED recommend the leverage-optimal alpha for your region. The
        default behavior when you say "prioritize fire risk" is to find
        the leverage knee, typically near alpha = 0.05.
      </p>

      <Heading id='leverage-ratio' level={2}>
        The leverage ratio
      </Heading>
      <p>The leverage ratio at any alpha is defined as:</p>
      <Callout kind='info'>
        leverage = (fire reduction percentage) / (cost premium percentage)
      </Callout>
      <p>
        At alpha = 0.05, the typical leverage ratio across California is
        approximately <strong>5.8x</strong>. This is the headline number
        from FRED's fire-aware analysis.
      </p>
      <p>
        A 5.8x leverage means a 1 percent cost premium buys roughly 5.8
        percent fire-risk reduction. Both numbers are measured relative to
        the cost-only optimum: cost premium is the percentage increase in
        LCOE versus the alpha = 0 baseline, and fire reduction is the
        percentage decrease in the procurement-weighted average burn
        probability.
      </p>
      <p>
        Leverage declines monotonically with alpha. Past alpha ≈ 0.1, the
        ratio drops below 4x. Past alpha = 0.5, it's typically 1.5x or
        less. Past alpha = 1.0, leverage is below 1x, meaning each
        additional percent of cost is buying less than a percent of fire
        reduction. The economics are not favorable past the knee.
      </p>

      <Heading id='fire-score' level={2}>
        Fire score
      </Heading>
      <p>
        When FRED reports a "fire score" or "fire gain," this is the
        normalized fire-risk reduction relative to the cost-only baseline.
        A fire score of 1.19 means the procurement plan has 119 percent
        the fire-risk reduction of the cost-only optimum. The number is
        unitless and only meaningful as a comparison.
      </p>
      <p>
        Most useful when comparing two alpha settings or two sites. If
        site A's fire score is 1.19 and site B's is 0.84, site A is doing
        substantially more fire-risk reduction for whatever cost premium it
        has incurred.
      </p>

      <Callout kind='tip'>
        For policy-facing presentations, the cost premium / fire reduction
        pair is usually clearer than the leverage ratio alone. "+20%
        cost, +119% fire reduction" communicates the tradeoff more
        directly than "5.8x leverage."
      </Callout>
    </>
  );
}
