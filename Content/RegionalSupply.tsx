import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const regionalSupplyToc = [
  { id: 'what-it-does', label: 'What it does' },
  { id: 'how-to-ask', label: 'How to ask' },
  { id: 'what-comes-back', label: 'What comes back' },
  { id: 'aggregation-levels', label: 'Aggregation levels' },
  { id: 'how-supply-is-computed', label: 'How supply is computed' }
];

export default function RegionalSupplyPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title='Regional supply analysis'
        lede="Ask FRED how much biomass is available in a region, how much it costs, and how it's distributed. Useful for early-stage screening before committing to a specific facility location."
      />

      <Heading id='what-it-does' level={2}>
        What it does
      </Heading>
      <p>
        A regional supply query rolls up cluster supply across a defined
        area. Unlike a siting query, it does not pick a facility location.
        It tells you the available supply, the cost distribution, and the
        spatial pattern within the region.
      </p>
      <p>
        This is the right query when you're screening multiple counties or
        watersheds to decide where to focus deeper analysis.
      </p>

      <Heading id='how-to-ask' level={2}>
        How to ask
      </Heading>
      <p>Reliable phrasings:</p>
      <ul>
        <li><em>"How much biomass is available in Shasta County?"</em></li>
        <li><em>"What's the supply situation in the Feather River watershed?"</em></li>
        <li><em>"Show me biomass density across Plumas, Lassen, and Modoc Counties."</em></li>
        <li><em>"What's the total sustainable yield within 50km of Quincy?"</em></li>
      </ul>

      <Heading id='what-comes-back' level={2}>
        What comes back
      </Heading>
      <ul>
        <li>
          <strong>Total annual supply</strong>: BDT/year aggregated across
          the region. This is the sustainable yield under current
          prescriptions, not a one-time inventory.
        </li>
        <li>
          <strong>Cluster count</strong>: how many distinct clusters
          contribute. A region with 1,200 small clusters is operationally
          different from a region with 200 large clusters even at the same
          total BDT.
        </li>
        <li>
          <strong>Cost distribution</strong>: median, P25, and P75 of
          per-BDT harvest cost across the contributing clusters. A wide
          spread indicates terrain or transport heterogeneity worth
          investigating.
        </li>
        <li>
          <strong>Spatial pattern</strong>: a choropleth map at H3
          resolution 5 showing where the supply concentrates within the
          region. Often surfaces sub-regions worth focused siting analysis.
        </li>
        <li>
          <strong>Fire risk distribution</strong>: how supply splits across
          the five circuity zones and the four fire-risk tiers. Useful for
          targeting BioRAM-eligible supply.
        </li>
      </ul>

      <Heading id='aggregation-levels' level={2}>
        Aggregation levels
      </Heading>
      <p>You can ask FRED to aggregate at different spatial units:</p>
      <ul>
        <li>
          <strong>County</strong>: useful for matching policy and reporting
          boundaries.
        </li>
        <li>
          <strong>Watershed (HUC8)</strong>: useful when fire risk or
          riparian considerations matter.
        </li>
        <li>
          <strong>H3 hex at resolution 4</strong>: roughly 22km edge length.
          Statewide patterns.
        </li>
        <li>
          <strong>H3 hex at resolution 5</strong>: roughly 8.5km edge
          length. The default.
        </li>
        <li>
          <strong>H3 hex at resolution 6</strong>: roughly 3.2km edge
          length. Useful when you need fine spatial granularity, but
          individual cells become noisy.
        </li>
      </ul>
      <p>
        Just say "show me at the county level" or "use H3 res 6" in the
        query. FRED switches automatically.
      </p>

      <Heading id='how-supply-is-computed' level={2}>
        How supply is computed
      </Heading>
      <p>
        FRED's supply numbers are the sum of <InlineCode>total_biomass_bdt</InlineCode>{' '}
        across contributing clusters, where each cluster's value is the
        harvestable yield under its assigned prescription. The numbers
        represent <strong>sustainable annual yield</strong>: harvesting at
        this rate indefinitely should not exhaust the resource, assuming the
        prescriptions are followed and forest growth meets historical
        projections.
      </p>
      <p>
        Two important caveats:
      </p>
      <ul>
        <li>
          <strong>Supply is on the landscape, not under contract.</strong>{' '}
          The total includes all clusters on land of types compatible with
          biomass harvest. Whether you can actually access a specific
          cluster depends on ownership, leases, and operational logistics.
        </li>
        <li>
          <strong>Demand competition is not modeled.</strong> If two
          facilities are sited near each other, FRED's per-facility supply
          numbers will overlap. For multi-facility planning, ask FRED to
          model the facilities together.
        </li>
      </ul>

      <Callout kind='info'>
        A useful screening workflow: ask for county-level supply totals
        across your region of interest, identify the top three counties by
        sustainable yield and cost, then run facility siting queries within
        each.
      </Callout>
    </>
  );
}
