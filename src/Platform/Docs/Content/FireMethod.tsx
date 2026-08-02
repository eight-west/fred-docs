import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const fireMethodToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'usda-fsim', label: 'USDA FSim as the input' },
  { id: 'objective-function', label: 'The objective function' },
  { id: 'pareto-curve', label: 'Computing the Pareto curve' },
  { id: 'the-knee', label: 'The leverage knee' },
  { id: 'ceiling', label: 'The structural ceiling' }
];

export default function FireMethodPage() {
  return (
    <>
      <PageTitle
        eyebrow='METHODOLOGY'
        title='Fire-aware Pareto framework'
        lede="An optimization layer built over USDA's burn probability raster. Combines per-cluster fire risk with the cost layer in a weighted objective that lets operators or policymakers explicitly tune the tradeoff."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Unlike the harvest cost surrogate and the transport circuity model,
        the fire-aware framework is not a new prediction layer. It is an
        optimization layer over data FRED consumes from elsewhere: the
        USDA FSim 2024 burn probability raster.
      </p>
      <p>
        FRED's contribution is the framework itself, the explicit weighting
        parameter, and the analysis of the leverage curve across California
        cluster supply.
      </p>

      <Heading id='usda-fsim' level={2}>
        USDA FSim as the input
      </Heading>
      <p>
        FSim is the USDA Forest Service wildfire simulator. It produces a
        30-meter-resolution raster of annual burn probability across the
        contiguous United States, based on millions of stochastic fire
        simulations under historical climate, weather, and fuel
        conditions.
      </p>
      <p>
        FRED uses the 2024 release of the dataset, area-weighted to each
        cluster polygon. The result is a per-cluster annual burn
        probability ranging from approximately 0 to 0.08.
      </p>

      <Callout kind='info'>
        FSim's burn probability is a long-run statistical estimate, not a
        forecast for any specific year. Treat it as a comparative measure
        across clusters, not an absolute prediction of imminent ignition.
      </Callout>

      <Heading id='objective-function' level={2}>
        The objective function
      </Heading>
      <p>
        With per-cluster burn probability available, FRED frames
        procurement as a weighted optimization. The objective for each
        cluster, given a weighting parameter alpha:
      </p>
      <Callout kind='info'>
        score = (1 - alpha) · cost_norm - alpha · fire_norm
      </Callout>
      <p>where:</p>
      <ul>
        <li>
          <InlineCode>cost_norm</InlineCode> is the cluster's harvest cost
          normalized to the 5th-95th percentile range across all California
          clusters.
        </li>
        <li>
          <InlineCode>fire_norm</InlineCode> is the cluster's burn
          probability normalized the same way.
        </li>
        <li>
          <InlineCode>alpha</InlineCode> is the user-specified weighting
          (0 = cost only, 1 = fire only).
        </li>
      </ul>
      <p>
        Normalization uses percentile bounds rather than raw min-max to
        prevent statewide outliers (a single very-low-cost cluster, for
        example) from compressing the distribution. This is a small
        technical detail with material effect on the leverage analysis.
      </p>

      <Heading id='pareto-curve' level={2}>
        Computing the Pareto curve
      </Heading>
      <p>
        For a given facility and demand, FRED computes the Pareto curve
        by sweeping alpha from 0 to 1, solving the weighted procurement
        optimization at each value, and recording the resulting cost and
        fire-risk reduction. The default sweep uses 21 alpha values
        non-uniformly spaced to give more resolution near the leverage
        knee.
      </p>
      <p>
        Each alpha point produces a procurement plan: a set of clusters
        selected to meet demand. The plan's weighted-average cost gives
        the cost axis; its weighted-average burn probability gives the
        fire axis. The curve is monotonic and concave by construction.
      </p>

      <Heading id='the-knee' level={2}>
        The leverage knee
      </Heading>
      <p>
        The leverage knee is the point on the Pareto curve where the
        leverage ratio (fire reduction percentage divided by cost premium
        percentage) is maximized. Empirically across California, this
        knee sits near <InlineCode>alpha = 0.05</InlineCode>, with leverage
        ratio approximately <strong>5.8x</strong>.
      </p>
      <p>
        Specifically at the knee:
      </p>
      <ul>
        <li>Cost premium versus the cost-only baseline: about +20.5 percent</li>
        <li>Procurement-weighted fire reduction: about 118.9 percent</li>
        <li>Leverage ratio: roughly 5.8x</li>
      </ul>
      <p>
        Past the knee, leverage drops rapidly. Pure fire optimization
        (alpha = 1) gives only marginally better fire reduction than alpha
        = 0.3 while costing substantially more.
      </p>

      <Heading id='ceiling' level={2}>
        The structural ceiling
      </Heading>
      <p>
        A counterintuitive but important finding: even at maximum fire
        weighting (alpha = 1), approximately 57 percent of procurement
        stays in the Very Low fire-risk tier.
      </p>
      <p>
        This is a structural ceiling, not a modeling limit. It exists
        because California's biomass supply and high-fire-risk areas
        overlap only partially. Some of the most fire-prone parts of the
        state have low biomass density (chaparral, oak woodland). Some of
        the densest biomass is in lower-fire-risk montane forests. When
        alpha pushes procurement toward fire-prone areas, the available
        cluster pool shrinks rapidly.
      </p>
      <p>
        The ceiling matters for policy design. Programs that incentivize
        fire-risk biomass procurement are bounded by where biomass and
        fire risk geographically coincide. FRED quantifies that bound; it
        is informative for shaping realistic incentive structures.
      </p>

      <Callout kind='tip'>
        The full leverage curve and ceiling analysis is documented in
        Chapter 6 of the thesis, with per-county and per-watershed
        breakdowns for researchers and policymakers needing geographic
        granularity.
      </Callout>
    </>
  );
}
