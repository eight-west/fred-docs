import { Heading, Callout, PageTitle } from '../Prose';

export const facilitySitingToc = [
  { id: 'what-it-does', label: 'What it does' },
  { id: 'how-to-ask', label: 'How to ask' },
  { id: 'what-comes-back', label: 'What comes back' },
  { id: 'how-fred-decides', label: 'How FRED decides' },
  { id: 'common-followups', label: 'Common follow-ups' }
];

export default function FacilitySitingPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title='Facility siting'
        lede="The canonical FRED workflow. Give FRED a target region and a facility size, get back a specific recommended location with supporting data."
      />

      <Heading id='what-it-does' level={2}>
        What it does
      </Heading>
      <p>
        A siting query asks FRED to choose a specific location for a new
        facility within a target region. FRED considers cluster supply
        density, harvest cost, transport efficiency, and (optionally) fire
        risk in the surrounding terrain, then returns a single recommended
        coordinate.
      </p>
      <p>
        Behind the scenes, FRED evaluates candidate centroids across the
        target region, computes the procurement economics for each, and
        picks the centroid that minimizes the weighted objective.
      </p>

      <Heading id='how-to-ask' level={2}>
        How to ask
      </Heading>
      <p>The reliable phrasings include:</p>
      <ul>
        <li><em>"Where should I site a 20MW facility near Redding?"</em></li>
        <li><em>"Find the best location for a 15MW biomass plant in Plumas County."</em></li>
        <li><em>"Recommend a facility location with 30,000 BDT/yr capacity around Lake Almanor."</em></li>
        <li><em>"What's the optimal site for a 25MW plant near Burney, prioritizing fire risk?"</em></li>
      </ul>
      <p>
        FRED accepts capacity in MW or biomass demand in BDT/year. The
        target region can be a town, county, watershed, or coordinate point
        with an implicit radius.
      </p>

      <Heading id='what-comes-back' level={2}>
        What comes back
      </Heading>
      <p>A typical siting answer includes:</p>
      <ul>
        <li>
          <strong>The recommended site</strong>: latitude/longitude, the
          nearest named place, and the county.
        </li>
        <li>
          <strong>Annual supply</strong>: BDT/year available to that site
          under the operational radius.
        </li>
        <li>
          <strong>LCOE</strong>: per-BDT levelized cost at the recommended
          site, broken down into harvest cost and transport.
        </li>
        <li>
          <strong>Operational radius</strong>: the actual procurement radius
          needed to meet demand. This is often smaller than people expect
          for cluster-rich regions and larger for sparse ones.
        </li>
        <li>
          <strong>A map</strong>: the recommended site marked, contributing
          clusters color-coded by contribution, with the procurement boundary
          overlaid.
        </li>
        <li>
          <strong>A justification</strong>: why this site won out over
          nearby alternatives. Usually mentions terrain, transport
          efficiency, or supply density.
        </li>
      </ul>

      <Heading id='how-fred-decides' level={2}>
        How FRED decides
      </Heading>
      <p>
        FRED's siting algorithm is straightforward in concept: evaluate a
        grid of candidate centroids across the target region, run the
        procurement model for each, pick the best. The implementation
        details that matter for understanding the output:
      </p>
      <ul>
        <li>
          The candidate grid resolution adapts to the target region size.
          For a county-scale search, FRED evaluates roughly 100-200
          candidates. For a town-scale search, it evaluates a finer grid.
        </li>
        <li>
          Each candidate's "score" combines weighted LCOE (after the alpha
          weighting if fire risk is enabled) with a sustainability check:
          can this site sustain operations for at least 10 years without
          depleting available clusters?
        </li>
        <li>
          The expanding-ring radius search is rerun for each candidate.
          FRED does not assume a fixed radius across candidates; the radius
          itself is part of the optimization.
        </li>
      </ul>

      <Callout kind='info'>
        FRED's recommended coordinate is a centroid suggestion, not a
        precise parcel address. Real facility placement involves access
        roads, water rights, zoning, and grid interconnect that FRED does
        not model. Treat the recommendation as the center of a 1-2km
        search area for site-specific evaluation.
      </Callout>

      <Heading id='common-followups' level={2}>
        Common follow-ups
      </Heading>
      <p>Useful follow-up questions after a siting query:</p>
      <ul>
        <li>
          <em>"What were the top three alternative sites and why did they
          lose?"</em>
        </li>
        <li>
          <em>"Show me the cost surface across the search region."</em>
        </li>
        <li>
          <em>"What does this look like if I move the facility 5km north?"</em>
        </li>
        <li>
          <em>"How does the recommendation change at 25MW instead of 20MW?"</em>
        </li>
        <li>
          <em>"Project this over 10 years."</em>
        </li>
      </ul>
    </>
  );
}
