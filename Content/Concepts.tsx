import { Heading, InlineCode, Callout, PageTitle } from '../Prose';

export const conceptsToc = [
  { id: 'three-layers', label: 'The three prediction layers' },
  { id: 'clusters', label: 'Clusters' },
  { id: 'radius-and-supply', label: 'Radius and supply' },
  { id: 'alpha-weighting', label: 'Alpha and the Pareto frontier' },
  { id: 'multi-year', label: 'Multi-year projection' },
  { id: 'caching', label: 'Tool-level caching' }
];

export default function ConceptsPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Concepts'
        lede="The vocabulary you'll need to read the rest of the docs. FRED's design centers on a layered taxonomy: a learned prediction layer, an interpolated empirical layer, and an optimization layer over external domain data."
      />

      <Heading id='three-layers' level={2}>
        The three prediction layers
      </Heading>
      <p>
        FRED's spatial intelligence is structured as three distinct kinds of
        layer, each appropriate to a different kind of question. Distinguishing
        them matters because their accuracy guarantees, update cadence, and
        appropriate use cases are different.
      </p>
      <ul>
        <li>
          <strong>Learned prediction layer</strong> (XGBoost harvest cost
          surrogate). Trained on 1.4 million FRCS configurations spanning the
          full range of treatment prescriptions, terrain, and harvesting
          systems. Predicts levelized cost per BDT. R² = 0.997 on held-out
          configurations, mean absolute error under $2.10 per BDT.
        </li>
        <li>
          <strong>Interpolated empirical layer</strong> (IDW transport
          circuity). Built from 445,000 OSRM-computed truck-profile routes
          across California. Inverse-distance-weighted interpolation produces a
          continuous circuity-factor raster. Origin location dominates
          (87 percent feature importance); short routes have 65 percent higher
          circuity than long routes due to road hierarchy effects.
        </li>
        <li>
          <strong>Optimization layer over external domain data</strong> (USDA
          FSim burn probability with Pareto framework). Combines the 30m
          burn-probability raster with cost projections to compute fire-
          weighted procurement options. The composition is the layer; the
          underlying raster is sourced from USDA.
        </li>
      </ul>
      <p>
        Every FRED query touches one or more of these layers. The agent decides
        which to retrieve based on the query intent.
      </p>

      <Heading id='clusters' level={2}>
        Clusters
      </Heading>
      <p>
        A <InlineCode>cluster</InlineCode> is FRED's atomic unit of supply. It
        is a polygon over a small contiguous forest area with a known biomass
        inventory, prescription, and projected harvest yield. Clusters come
        from the C-BREC biomass dataset.
      </p>
      <p>
        Each cluster has the following attributes: total harvestable biomass
        (BDT under prescription), centroid coordinates, dominant species mix,
        terrain class, harvest-system feasibility, and a precomputed harvest
        cost from the surrogate model. There are roughly 2.1 million clusters
        across California.
      </p>
      <p>
        Clusters are indexed using H3 hexagonal binning at resolution levels 4,
        5, and 6. Materialized views aggregate cluster supply at each
        resolution to enable sub-second radius queries.
      </p>

      <Heading id='radius-and-supply' level={2}>
        Radius and supply
      </Heading>
      <p>
        When a user specifies a facility location, FRED computes the cluster
        supply available within an expanding radius from that point. The
        default search expands in 5km rings until two consecutive rings yield
        no additional usable supply.
      </p>
      <p>
        This is more accurate than a fixed-radius query because biomass
        availability is highly heterogeneous, especially across terrain
        boundaries. The expanding-ring approach lets the agent surface natural
        supply boundaries that match real procurement logistics.
      </p>

      <Callout kind='info'>
        Distance is computed in OSRM truck-profile road kilometers, not
        Euclidean distance. This is the actual haul distance a chip truck would
        drive, accounting for road network topology.
      </Callout>

      <Heading id='alpha-weighting' level={2}>
        Alpha and the Pareto frontier
      </Heading>
      <p>
        <InlineCode>alpha</InlineCode> is the weighting parameter in FRED's
        fire-risk-aware objective function. It ranges from 0 (cost-only
        optimization) to 1 (fire-risk-only optimization).
      </p>
      <p>
        Across all California facilities we've analyzed, the relationship
        between alpha and outcomes is consistently non-linear. At{' '}
        <InlineCode>alpha = 0.05</InlineCode>, the leverage ratio (fire risk
        reduction per unit cost premium) peaks at roughly 5.8x. Past that
        point, additional fire weighting yields diminishing returns at rapidly
        increasing cost.
      </p>
      <p>
        FRED exposes this tradeoff explicitly. Every multi-objective query
        returns either a Pareto frontier or a recommended alpha with the
        full curve available for inspection.
      </p>

      <Heading id='multi-year' level={2}>
        Multi-year projection
      </Heading>
      <p>
        Biomass procurement is not a one-shot decision. Treatments deplete
        cluster inventory; over a 10-year operating horizon, the optimal
        procurement footprint changes as nearby clusters are exhausted.
      </p>
      <p>
        FRED's <InlineCode>project_multi_year</InlineCode> tool models this
        depletion. Each year, the available clusters within the current radius
        are harvested up to facility demand; clusters that hit their fully
        depleted state are removed from the available pool; the radius expands
        as needed in subsequent years to make up the shortfall.
      </p>
      <p>
        The output is a year-by-year supply curve with per-year LCOE,
        weighted-average haul distance, and remaining cluster count. The
        characteristic sawtooth cost pattern across years is genuine terrain
        heterogeneity rather than a modeling artifact.
      </p>

      <Heading id='caching' level={2}>
        Tool-level caching
      </Heading>
      <p>
        FRED caches at the tool-invocation level, not the query level. This is
        a deliberate architectural choice. Query-level caching (semantic
        similarity over natural language) is loose and hard to invalidate. Tool-
        level caching is keyed on the exact spatial parameters of each tool
        call, which makes invalidation precise and correctness guaranteed.
      </p>
      <p>
        Cache hit rates in production are above 60 percent because spatial
        queries cluster around common facility locations and standard query
        patterns. Average response time with warm cache is under 800ms;
        cold-cache queries take 2-5 seconds depending on radius.
      </p>
    </>
  );
}
