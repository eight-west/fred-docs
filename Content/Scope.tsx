import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const scopeToc = [
  { id: 'what-fred-handles-well', label: 'What FRED handles well' },
  { id: 'partial-coverage', label: 'Partial coverage' },
  { id: 'out-of-scope', label: 'Out of scope' },
  { id: 'roadmap', label: 'On the roadmap' }
];

export default function ScopePage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title="What FRED can and can't do"
        lede="An honest catalog of the queries FRED is designed for, the ones it can partially address, and the questions to take elsewhere."
      />

      <Heading id='what-fred-handles-well' level={2}>
        What FRED handles well
      </Heading>
      <p>The following are FRED's strongest capabilities:</p>
      <ul>
        <li>
          <strong>Facility siting</strong> within California, anywhere with
          forest biomass coverage. FRED returns specific coordinates, supply
          curves, and cost projections.
        </li>
        <li>
          <strong>Supply-radius analysis</strong> around a candidate location.
          Given a point and a demand, FRED computes the procurement radius
          needed to meet demand and the LCOE that results.
        </li>
        <li>
          <strong>Cost-vs-fire tradeoff exploration</strong>. The Pareto
          framework is built for this. FRED can show the full curve, the
          leverage knee, and the cost premium at any alpha you specify.
        </li>
        <li>
          <strong>Multi-year procurement planning</strong> with depletion
          modeling. FRED projects year-by-year supply and cost up to 15
          years out, accounting for the fact that nearby clusters get
          harvested first and the radius must expand over time.
        </li>
        <li>
          <strong>Regional summaries</strong> at the county, watershed (HUC8),
          or H3 hex level. Useful for screening multiple candidate regions
          before deep analysis.
        </li>
        <li>
          <strong>Comparison queries</strong> between two or more candidate
          locations. FRED runs both analyses and presents a side-by-side
          summary.
        </li>
      </ul>

      <Heading id='partial-coverage' level={2}>
        Partial coverage
      </Heading>
      <p>
        FRED can answer the following, but with caveats worth knowing about:
      </p>
      <ul>
        <li>
          <strong>Very long-horizon projections (15+ years).</strong> FRED's
          depletion model is deterministic and assumes prescriptions
          continue. Real-world procurement plans evolve. Treat 15+ year
          projections as rough trajectories, not commitments.
        </li>
        <li>
          <strong>Custom prescriptions outside the C-BREC catalog.</strong>{' '}
          FRED uses the prescriptions already encoded in the cluster
          dataset. If you have a custom prescription, you can describe it,
          but the cost prediction may be less accurate.
        </li>
        <li>
          <strong>Real-time pricing.</strong> FRED's cost model is from the
          harvest cost surrogate, which captures the engineering cost. It
          does not know about today's spot market for chip prices, fuel
          costs, or labor availability.
        </li>
        <li>
          <strong>Permitting and regulatory feasibility.</strong> FRED can
          tell you the cost-optimal location; it cannot tell you whether
          you'll be able to get permits there. Use FRED to narrow the
          search, then apply local knowledge.
        </li>
        <li>
          <strong>Specific landowner contracts.</strong> The cluster supply
          is on a mix of ownership types. FRED knows the rough split but
          cannot model individual landowner contracts.
        </li>
      </ul>

      <Heading id='out-of-scope' level={2}>
        Out of scope
      </Heading>
      <p>FRED currently does not handle the following:</p>
      <ul>
        <li>
          <strong>States other than California.</strong> The cluster
          dataset, fire raster, and transport model are all California-
          specific. Other states require running the data prep pipeline
          against equivalent regional data.
        </li>
        <li>
          <strong>Agricultural residues.</strong> FRED's supply is forest
          biomass only. Orchard residues, dairy waste, and crop residues are
          not in the cluster catalog.
        </li>
        <li>
          <strong>Carbon accounting.</strong> FRED tracks BDT supply and
          cost. It does not produce carbon offset estimates, RPS compliance
          calculations, or life-cycle emissions analyses.
        </li>
        <li>
          <strong>Detailed facility engineering.</strong> FRED tells you the
          biomass economics. It does not size the boiler, layout the yard,
          or design the chipping line.
        </li>
        <li>
          <strong>Endangered species, habitat, or wilderness constraints.</strong>{' '}
          FRED's cluster polygons reflect the C-BREC inventory, which
          incorporates broad land use categories. Site-specific
          environmental review is a separate workflow.
        </li>
      </ul>

      <Callout kind='warn'>
        FRED is decision support, not a decision system. The recommendations
        are grounded in published research and validated models, but they
        are inputs to your process. Real procurement decisions involve
        permitting, contracts, community engagement, and operational
        considerations FRED does not see.
      </Callout>

      <Heading id='roadmap' level={2}>
        On the roadmap
      </Heading>
      <p>
        Capabilities under active development:
      </p>
      <ul>
        <li>
          <strong>Coverage expansion to Oregon and Washington</strong> using
          equivalent C-BREC-style inventories.
        </li>
        <li>
          <strong>Custom prescription support</strong> for users with their
          own treatment specifications.
        </li>
        <li>
          <strong>Sensitivity and scenario analysis</strong> built into the
          chat experience, so you can ask "what if diesel prices rise 20
          percent" and FRED applies it.
        </li>
        <li>
          <strong>Persistent project workspaces</strong> so analysis on one
          facility can be saved and revisited weeks later with comparisons
          to the original recommendation.
        </li>
      </ul>
      <p>
        If you have a use case FRED almost handles but doesn't quite, email{' '}
        <a href='mailto:contact@biofred.us'>contact@biofred.us</a>. The
        roadmap is driven by what users are actually trying to do.
      </p>
    </>
  );
}
