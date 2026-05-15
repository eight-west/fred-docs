import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const transportToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'circuity-factor', label: 'The circuity factor' },
  { id: 'data-collection', label: 'Data collection' },
  { id: 'idw-interpolation', label: 'IDW interpolation' },
  { id: 'five-zones', label: 'Five circuity zones' },
  { id: 'short-route-paradox', label: 'Short-route paradox' },
  { id: 'using-the-layer', label: 'Using the layer' }
];

export default function TransportPage() {
  return (
    <>
      <PageTitle
        eyebrow='SPATIAL LAYERS'
        title='Transport circuity'
        lede="An interpolated empirical layer of road network circuity factors across California. Built from 445,000 OSRM truck-profile routes. Produces a continuous statewide raster that converts Euclidean distance estimates to realistic haul distances."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Transport cost is the dominant variable cost in biomass procurement.
        The naive way to estimate it uses Euclidean distance from cluster to
        facility. The reality is that chip trucks navigate a constrained road
        network with grade limits, weight limits, and forest road access that
        is often missing from consumer-grade routing engines.
      </p>
      <p>
        FRED's transport circuity layer addresses this with an empirical
        approach: sample real OSRM truck-profile routes across California,
        compute the circuity factor (actual road distance divided by Euclidean
        distance) for each route origin, then interpolate to a continuous
        raster using IDW.
      </p>

      <Heading id='circuity-factor' level={2}>
        The circuity factor
      </Heading>
      <p>
        The circuity factor (CF) at a point is defined as:
      </p>
      <CodeBlock
        lang='python'
        code={`CF = road_network_distance / euclidean_distance`}
      />
      <p>
        A CF of 1.0 means a perfectly direct road; the truck drives a straight
        line. A CF of 2.0 means the truck drives twice the straight-line
        distance. Real California cluster origins range from 1.15 (Central
        Valley flatlands) to over 2.8 (high-elevation Sierra terrain).
      </p>
      <p>
        FRED treats CF as an <strong>origin property</strong>, not an O-D pair
        property. This is a key methodological choice. Empirically, the
        origin location explains 87 percent of the variance in CF; the
        destination has a minor effect, and that effect can be absorbed into
        cluster-level features.
      </p>

      <Heading id='data-collection' level={2}>
        Data collection
      </Heading>
      <p>
        The training corpus is 445,000 OSRM-computed routes across California.
        Each route was sampled by:
      </p>
      <ol>
        <li>
          Picking a random origin point in a forested area (sampled from
          cluster centroids).
        </li>
        <li>
          Picking 10 random destinations covering plausible facility
          locations.
        </li>
        <li>
          Computing the OSRM truck-profile route for each (origin, destination)
          pair.
        </li>
        <li>
          Recording the resulting CF along with the origin's terrain class,
          elevation, slope, and county FIPS.
        </li>
      </ol>
      <p>
        Truck profile uses a custom Lua configuration that disables roads
        weight-restricted below 36 tons, excludes road grades above 8 percent,
        and prefers state highways for long hauls. This profile lives in
        the OSRM container configuration.
      </p>

      <Callout kind='warn'>
        Earlier versions of the dataset had a duplicate-treatment bug that
        inflated the route count from 435K to 7.4M. The number reported in
        external papers is the deduplicated 445K. Always cite the corrected
        figure.
      </Callout>

      <Heading id='idw-interpolation' level={2}>
        IDW interpolation
      </Heading>
      <p>
        With 445,000 sampled CFs across the state, we need a way to assign a
        CF to every cluster centroid (and every arbitrary query point). IDW is
        the standard approach for spatial interpolation when the underlying
        process has local spatial correlation but no clear functional form.
      </p>
      <p>The IDW formula:</p>
      <CodeBlock
        lang='python'
        code={`def idw(query_point, samples, power=2.0, k=12):
    """Interpolate CF at query_point from k nearest samples."""
    distances = [(sample, haversine(query_point, sample.coord))
                 for sample in samples]
    distances.sort(key=lambda x: x[1])
    nearest = distances[:k]

    weights = [1.0 / (d ** power + 1e-9) for _, d in nearest]
    weighted_sum = sum(w * s.cf for (s, _), w in zip(nearest, weights))
    return weighted_sum / sum(weights)`}
      />
      <p>
        FRED uses <InlineCode>power=2.0</InlineCode> and <InlineCode>k=12</InlineCode>,
        chosen by cross-validation. The output is rasterized to a 1km grid
        across California and stored as a GeoTIFF (and as per-cluster columns
        in <InlineCode>mv_cluster_supply</InlineCode>).
      </p>

      <Heading id='five-zones' level={2}>
        Five circuity zones
      </Heading>
      <p>
        For interpretive purposes, the continuous CF raster is quantized into
        five zones based on natural breaks:
      </p>
      <ul>
        <li><strong>Zone 1</strong> (CF 1.0 to 1.25): Central Valley and coastal flats.</li>
        <li><strong>Zone 2</strong> (CF 1.25 to 1.50): foothill transition.</li>
        <li><strong>Zone 3</strong> (CF 1.50 to 1.85): low Sierra and Coast Range.</li>
        <li><strong>Zone 4</strong> (CF 1.85 to 2.30): high Sierra and Klamath.</li>
        <li><strong>Zone 5</strong> (CF 2.30 and above): remote mountain terrain.</li>
      </ul>
      <p>
        These zones appear in the FRED chat interface as map overlays and in
        the regional summary endpoints. They are derived attributes; the raw
        CF is always available.
      </p>

      <Heading id='short-route-paradox' level={2}>
        Short-route paradox
      </Heading>
      <p>
        The most counterintuitive finding from the transport circuity research:
        <strong> short routes have 65 percent higher circuity than long
        routes</strong>.
      </p>
      <p>
        This is a road-network-hierarchy effect. A short haul from a cluster
        to a nearby facility usually traverses low-class forest roads with
        many switchbacks. A long haul to a distant facility quickly transitions
        to a state highway and runs nearly straight for most of the trip; the
        switchback section is amortized.
      </p>
      <p>
        The practical implication: facility-siting decisions that look better
        on Euclidean distance often look worse on actual road distance. FRED
        surfaces this in every multi-year recommendation.
      </p>

      <Heading id='using-the-layer' level={2}>
        Using the layer
      </Heading>
      <p>
        The transport circuity layer is exposed via the{' '}
        <InlineCode>get_transport_circuity</InlineCode> tool. To query a single
        point directly:
      </p>
      <CodeBlock
        lang='bash'
        code={`curl -X POST http://localhost:8000/tool/get_transport_circuity \\
  -H "Content-Type: application/json" \\
  -d '{
    "lat": 40.589,
    "lng": -121.658
  }'`}
      />
      <CodeBlock
        lang='json'
        code={`{
  "cf": 1.83,
  "zone": 3,
  "zone_name": "Low Sierra / Coast Range",
  "n_samples_used": 12,
  "neighbor_mean_distance_km": 4.2
}`}
      />
    </>
  );
}
