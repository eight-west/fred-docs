import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const transportMethodToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'osrm-truck-profile', label: 'OSRM truck profile' },
  { id: 'sampled-routes', label: 'The 445,000 routes' },
  { id: 'idw-interpolation', label: 'IDW interpolation' },
  { id: 'feature-importance', label: 'Why origin dominates' },
  { id: 'limitations', label: 'Limitations' }
];

export default function TransportMethodPage() {
  return (
    <>
      <PageTitle
        eyebrow='METHODOLOGY'
        title='Transport circuity model'
        lede="An empirical, interpolated spatial layer of road network circuity factors built from 445,000 OSRM truck-profile routes. Produces a continuous statewide raster that converts straight-line distance estimates to realistic chip truck haul distances."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Naive transport cost estimation uses Euclidean distance from
        cluster to facility, often multiplied by a flat cost-per-km. The
        reality is that chip trucks navigate a constrained road network
        with grade limits, weight limits, and forest road access that is
        often missing from consumer-grade routing engines.
      </p>
      <p>
        FRED's transport circuity model addresses this with an empirical
        approach: sample real OSRM truck-profile routes across California,
        compute the circuity factor for each route's origin, then
        interpolate to a continuous raster using inverse distance
        weighting (IDW).
      </p>

      <Heading id='osrm-truck-profile' level={2}>
        OSRM truck profile
      </Heading>
      <p>
        FRED uses a custom Lua profile configuration for OSRM that
        reflects how chip trucks actually use the road network. The key
        constraints:
      </p>
      <ul>
        <li>Roads weight-restricted below 36 tons are excluded.</li>
        <li>Road grades above 8 percent are penalized heavily.</li>
        <li>State highways are preferred for long-haul segments.</li>
        <li>Seasonal forest roads are penalized to reflect winter restrictions.</li>
        <li>Bridge load limits are honored.</li>
      </ul>
      <p>
        This profile is documented in the underlying paper and validated
        against truck operators' real routing decisions. It is materially
        different from a passenger-car profile; using a car profile would
        systematically underestimate haul times by 15-30 percent.
      </p>

      <Heading id='sampled-routes' level={2}>
        The 445,000 routes
      </Heading>
      <p>
        The training corpus for the IDW model is 445,000 OSRM-computed
        routes across California. Each route was sampled by:
      </p>
      <ol>
        <li>
          Picking a random origin point in a forested area (sampled from
          cluster centroids).
        </li>
        <li>
          Picking up to 10 random destinations representing plausible
          facility locations.
        </li>
        <li>
          Computing the OSRM truck-profile route for each (origin,
          destination) pair.
        </li>
        <li>
          Recording the resulting circuity factor along with the origin's
          terrain class, elevation, slope, and county.
        </li>
      </ol>

      <Callout kind='warn'>
        An earlier version of the route dataset included duplicates from a
        treatment-id join error that inflated the count to roughly 7.4
        million. The deduplicated count of 445,000 is the figure used in
        all published results.
      </Callout>

      <Heading id='idw-interpolation' level={2}>
        IDW interpolation
      </Heading>
      <p>
        Inverse Distance Weighted interpolation is the standard approach
        for spatial extrapolation when the underlying process has local
        spatial correlation but no clear parametric form. The IDW
        prediction at a query point is:
      </p>
      <Callout kind='info'>
        CF(q) = Σ (w<sub>i</sub> · CF<sub>i</sub>) / Σ w<sub>i</sub>, where
        w<sub>i</sub> = 1 / d(q, sample<sub>i</sub>)<sup>p</sup>
      </Callout>
      <p>
        FRED uses <InlineCode>p = 2</InlineCode> and the 12 nearest sampled
        routes for each prediction, chosen by cross-validation. The output
        is rasterized to a 1km grid across California and also stored per-
        cluster on the materialized supply view.
      </p>

      <Heading id='feature-importance' level={2}>
        Why origin dominates
      </Heading>
      <p>
        A key methodological finding from FRED's transport research:
        <strong> origin location explains 87 percent of the variance in
        CF</strong>. The destination effect, conditional on origin, is much
        smaller.
      </p>
      <p>
        This is intuitive once you see it. The road quality at the origin
        determines how much switchback navigation is required to reach any
        nearby highway. Once on the highway, the route to a destination is
        mostly straight. So all routes from a given origin share most of
        their circuity, and the destination just adds a small variance
        term.
      </p>
      <p>
        The practical consequence: FRED can pre-compute a single CF value
        per cluster (sampled at the cluster centroid) rather than a
        circuity matrix between every origin-destination pair. This is the
        difference between roughly 2 million stored values and roughly 2
        million squared, which is computationally impossible.
      </p>

      <Heading id='limitations' level={2}>
        Limitations
      </Heading>
      <ul>
        <li>
          <strong>Sample density variation.</strong> Some remote terrain has
          fewer sampled routes, so the IDW prediction in those areas has
          wider uncertainty. FRED's responses flag this when relevant.
        </li>
        <li>
          <strong>OSRM truck profile is California-tuned.</strong> The
          weight, grade, and seasonal constraints reflect California
          regulations. Applying the model to other states would require
          re-sampling routes with the relevant local truck profile.
        </li>
        <li>
          <strong>Static road network.</strong> The OSRM data is a
          snapshot. Construction projects, washed-out bridges, and new
          forest road closures are not captured until the next refresh.
        </li>
        <li>
          <strong>Truck-specific time and fuel constraints not modeled.</strong>{' '}
          The circuity factor captures the road network geometry. Driver
          hours-of-service rules, fuel stops, and other operational
          constraints are factored into the cost layer separately.
        </li>
      </ul>
    </>
  );
}
