import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const multiYearToc = [
  { id: 'what-it-does', label: 'What it does' },
  { id: 'how-to-ask', label: 'How to ask' },
  { id: 'depletion-model', label: 'The depletion model' },
  { id: 'reading-the-trajectory', label: 'Reading the trajectory' },
  { id: 'sawtooth-pattern', label: 'The sawtooth pattern' },
  { id: 'caveats', label: 'Caveats' }
];

export default function MultiYearPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title='Multi-year procurement planning'
        lede="Biomass procurement is not a one-shot decision. Nearby clusters get harvested first; the radius has to expand over time as supply depletes. FRED's multi-year projections model this trajectory."
      />

      <Heading id='what-it-does' level={2}>
        What it does
      </Heading>
      <p>
        A single-year siting query tells you the steady-state economics
        assuming an idealized supply environment. A multi-year projection
        models what actually happens over a facility's operating horizon:
        nearby clusters deplete, the operational radius grows, and
        per-year cost evolves accordingly.
      </p>
      <p>
        For a 10-year procurement plan, FRED simulates each year
        sequentially. Year 1 uses the closest clusters; year 2 picks up
        wherever year 1 left off; by year 10 the radius has often grown
        substantially.
      </p>

      <Heading id='how-to-ask' level={2}>
        How to ask
      </Heading>
      <ul>
        <li><em>"Project this over 10 years"</em> (as a follow-up to a siting query)</li>
        <li><em>"Show me 15-year supply and cost for a 20MW facility near Quincy"</em></li>
        <li><em>"What does the cost curve look like over a decade in this location?"</em></li>
        <li><em>"How far does the radius grow by year 10?"</em></li>
      </ul>

      <Heading id='depletion-model' level={2}>
        The depletion model
      </Heading>
      <p>
        FRED's depletion model is deterministic and follows a simple rule:
        each cluster, when harvested, contributes its full
        <InlineCode>total_biomass_bdt</InlineCode> in that year and is then
        removed from the available pool. The next year, the procurement
        radius expands as needed to make up the lost supply.
      </p>
      <p>
        Two design choices to be aware of:
      </p>
      <ul>
        <li>
          <strong>Full depletion per visit.</strong> The C-BREC dataset
          already encodes <InlineCode>total_biomass_bdt</InlineCode> as the
          harvestable yield under prescription, accounting for what gets
          left on the landscape. So when FRED depletes a cluster fully,
          this represents one harvest treatment visit, not exhaustive
          stripping of all biomass.
        </li>
        <li>
          <strong>Expanding ring search.</strong> Each year, FRED expands
          the search in 5km rings outward from the facility until demand is
          met. There is no hard radius cap; if year 10 needs a 75km radius,
          FRED reports that and you can decide if it remains economic.
        </li>
      </ul>

      <Heading id='reading-the-trajectory' level={2}>
        Reading the trajectory
      </Heading>
      <p>The multi-year output has three views:</p>
      <ul>
        <li>
          <strong>Year-by-year cost</strong>: per-BDT LCOE for each year of
          the horizon. Usually rises modestly over time as the radius grows.
        </li>
        <li>
          <strong>Year-by-year radius</strong>: the operational radius
          needed each year. The growth rate is informative; a radius that
          doubles by year 10 indicates supply scarcity, while one that
          grows by 30 percent indicates comfortable supply.
        </li>
        <li>
          <strong>Cumulative cluster count</strong>: how many distinct
          clusters have been visited by each year. Tells you how reliant
          the plan is on continued cluster availability.
        </li>
      </ul>

      <Heading id='sawtooth-pattern' level={2}>
        The sawtooth pattern
      </Heading>
      <p>
        Year-by-year cost charts often show a noticeable sawtooth: a year
        of lower cost followed by a year of higher cost, then back down.
        This is a real signal, not a numerical artifact.
      </p>
      <p>
        The pattern reflects genuine terrain heterogeneity. After a year
        that depleted easier flat-terrain clusters, the remaining clusters
        within reach may be on steeper or more remote ground. The next
        year's cost reflects this; the year after, the radius expands far
        enough to pick up easier clusters again.
      </p>
      <p>
        For planning purposes, the 10-year average is usually the right
        number to compare across candidate sites. The sawtooth tells you
        about year-over-year cash flow variability, which matters for
        contract structuring but not for site selection.
      </p>

      <Heading id='caveats' level={2}>
        Caveats
      </Heading>
      <ul>
        <li>
          <strong>Prescription continuity.</strong> The depletion model
          assumes prescriptions stay constant. Real procurement plans
          sometimes shift treatments based on landowner agreements,
          ecological conditions, or policy changes. Year-10 numbers should
          be treated as a trajectory, not a commitment.
        </li>
        <li>
          <strong>Forest regrowth is not modeled within horizon.</strong>{' '}
          Cluster regrowth on a 30-50 year cycle exceeds typical facility
          planning horizons, so FRED does not return clusters to the pool
          after depletion within the projection window.
        </li>
        <li>
          <strong>Inflation and market dynamics excluded.</strong> Costs are
          in real (constant) dollars. Diesel prices, labor costs, and chip
          market prices change over a decade; FRED's model is engineering
          cost only.
        </li>
        <li>
          <strong>Competition with adjacent facilities not modeled.</strong>{' '}
          If a competitor sites near your facility mid-horizon, the
          available supply shrinks. FRED's single-facility projection does
          not anticipate this.
        </li>
      </ul>

      <Callout kind='tip'>
        Use multi-year projections to compare the trajectory shape across
        candidate sites, not to commit to specific year-10 numbers. Two
        sites with the same year-1 LCOE can have very different 10-year
        trajectories, and that difference is usually decisive.
      </Callout>
    </>
  );
}
