import { Heading, CodeBlock, InlineCode, ParamTable, PageTitle, Callout } from '../Prose';

export const toolsToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'geocode-location', label: 'geocode_location' },
  { id: 'retrieve-cluster-supply', label: 'retrieve_cluster_supply' },
  { id: 'compute-cost', label: 'compute_cost' },
  { id: 'get-transport-circuity', label: 'get_transport_circuity' },
  { id: 'get-burn-probability', label: 'get_burn_probability' },
  { id: 'compute-fire-pareto', label: 'compute_fire_pareto' },
  { id: 'project-multi-year', label: 'project_multi_year' },
  { id: 'compute-regional-summary', label: 'compute_regional_summary' },
  { id: 'explain-recommendation', label: 'explain_recommendation' }
];

export default function ToolsPage() {
  return (
    <>
      <PageTitle
        eyebrow='CS-RAG'
        title='Tool definitions'
        lede='FRED ships with nine tools. Each is a typed function with deterministic behavior, cacheable inputs, and a precise output schema. The agent invokes these tools to answer queries.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Tools are the contract between the agent's reasoning and the data
        layer. Adding a new tool means defining its input schema, output
        schema, cache key, and implementation; once registered, the agent can
        invoke it without further wiring. Existing tools cover the full
        spectrum of FRED's current query types.
      </p>
      <p>
        All tools return JSON. All tools accept a single JSON object input.
        All tools are cached by the SHA-256 hash of their canonicalized
        input. Cache TTL is 24 hours by default, configurable per tool.
      </p>

      <Heading id='geocode-location' level={2}>
        geocode_location
      </Heading>
      <p>Convert a place name to coordinates.</p>
      <ParamTable
        rows={[
          { name: 'location', type: 'string', required: true, description: 'Place name. Counties, cities, watersheds, or free-form descriptions like "near Redding, CA".' }
        ]}
      />
      <CodeBlock
        lang='json'
        filename='Response'
        code={`{
  "lat": 40.589,
  "lng": -121.658,
  "name_resolved": "Burney, Shasta County, CA",
  "county_fips": "06089",
  "watershed_huc8": "18020003",
  "confidence": 0.94
}`}
      />

      <Heading id='retrieve-cluster-supply' level={2}>
        retrieve_cluster_supply
      </Heading>
      <p>
        Retrieve enriched cluster polygons within a radius of a facility
        location. Expanding-ring search: starts at 5km and grows in 5km rings
        until two consecutive rings yield no new usable supply.
      </p>
      <ParamTable
        rows={[
          { name: 'lat', type: 'float', required: true, description: 'Facility latitude.' },
          { name: 'lng', type: 'float', required: true, description: 'Facility longitude.' },
          { name: 'min_biomass_bdt', type: 'float', defaultValue: '0', description: 'Minimum per-cluster biomass to include.' },
          { name: 'max_radius_km', type: 'float', defaultValue: 'none', description: 'Hard cap on search radius. Default has no cap.' }
        ]}
      />
      <CodeBlock
        lang='json'
        filename='Response (truncated)'
        code={`{
  "facility": {"lat": 40.589, "lng": -121.658},
  "radius_km": 43,
  "n_clusters": 1247,
  "total_bdt_per_year": 38400,
  "watershed_zones": 3,
  "clusters": [
    {
      "cluster_no": 412034,
      "centroid": {"lat": 40.612, "lng": -121.671},
      "total_biomass_bdt": 142.3,
      "harvest_cost_per_bdt": 82.10,
      "cf_origin": 1.78,
      "burn_probability": 0.024,
      "km_from_facility": 2.4
    }
    // ... 1246 more
  ]
}`}
      />

      <Heading id='compute-cost' level={2}>
        compute_cost
      </Heading>
      <p>
        Compute (or look up) the surrogate-predicted harvest cost for a
        specific cluster or a batch of clusters.
      </p>
      <ParamTable
        rows={[
          { name: 'cluster_nos', type: 'array of integers', required: true, description: 'Cluster IDs to compute cost for.' },
          { name: 'haul_distance_km', type: 'float | array', description: 'Optional override for haul distance. If omitted, uses straight-line distance scaled by cf_origin.' }
        ]}
      />

      <Heading id='get-transport-circuity' level={2}>
        get_transport_circuity
      </Heading>
      <p>
        Get the IDW-interpolated transport circuity factor at an arbitrary
        point.
      </p>
      <ParamTable
        rows={[
          { name: 'lat', type: 'float', required: true, description: 'Query point latitude.' },
          { name: 'lng', type: 'float', required: true, description: 'Query point longitude.' }
        ]}
      />

      <Heading id='get-burn-probability' level={2}>
        get_burn_probability
      </Heading>
      <p>
        Get the annual burn probability at a point or area-weighted across a
        polygon.
      </p>
      <ParamTable
        rows={[
          { name: 'lat', type: 'float', description: 'Required if polygon is not provided.' },
          { name: 'lng', type: 'float', description: 'Required if polygon is not provided.' },
          { name: 'polygon_wkt', type: 'string', description: 'Optional polygon WKT for area-weighted query.' }
        ]}
      />

      <Heading id='compute-fire-pareto' level={2}>
        compute_fire_pareto
      </Heading>
      <p>
        Compute the cost-vs-fire-risk Pareto frontier for a set of clusters.
        Returns the full curve plus a recommended alpha at the leverage knee.
      </p>
      <ParamTable
        rows={[
          { name: 'cluster_nos', type: 'array of integers', required: true, description: 'Clusters to consider.' },
          { name: 'demand_bdt_per_year', type: 'float', required: true, description: 'Facility demand. Determines how many clusters get included at each alpha.' },
          { name: 'alphas', type: 'array of floats', defaultValue: '21 points from 0 to 1', description: 'Alpha values to evaluate.' }
        ]}
      />
      <CodeBlock
        lang='json'
        filename='Response'
        code={`{
  "frontier": [
    {"alpha": 0.00, "lcoe": 87.40, "fire_score": 0.00, "leverage": null},
    {"alpha": 0.05, "lcoe": 91.80, "fire_score": 1.19, "leverage": 5.8},
    {"alpha": 0.10, "lcoe": 96.20, "fire_score": 1.84, "leverage": 4.1},
    {"alpha": 0.25, "lcoe": 105.30, "fire_score": 2.43, "leverage": 2.4},
    {"alpha": 0.50, "lcoe": 118.40, "fire_score": 2.78, "leverage": 1.5},
    {"alpha": 1.00, "lcoe": 134.20, "fire_score": 2.94, "leverage": 0.9}
  ],
  "recommended_alpha": 0.05,
  "leverage_at_recommended": 5.8
}`}
      />

      <Heading id='project-multi-year' level={2}>
        project_multi_year
      </Heading>
      <p>
        Project a multi-year supply curve with depletion. Each year,
        harvested clusters are removed from the pool; the radius expands as
        needed to meet demand.
      </p>
      <ParamTable
        rows={[
          { name: 'lat', type: 'float', required: true, description: 'Facility latitude.' },
          { name: 'lng', type: 'float', required: true, description: 'Facility longitude.' },
          { name: 'demand_bdt_per_year', type: 'float', required: true, description: 'Annual facility demand.' },
          { name: 'years', type: 'integer', defaultValue: '10', description: 'Projection horizon.' },
          { name: 'alpha', type: 'float', defaultValue: '0', description: 'Fire weighting for the optimization in each year.' }
        ]}
      />

      <Heading id='compute-regional-summary' level={2}>
        compute_regional_summary
      </Heading>
      <p>
        Roll up cluster supply at a chosen spatial unit: county, watershed
        (HUC8), or H3 hex (resolution 4, 5, or 6).
      </p>
      <ParamTable
        rows={[
          { name: 'unit', type: '"county" | "watershed" | "h3_r4" | "h3_r5" | "h3_r6"', required: true, description: 'Aggregation unit.' },
          { name: 'metric', type: '"total_bdt" | "mean_cost" | "mean_fire" | "cluster_count"', defaultValue: '"total_bdt"', description: 'What to roll up.' }
        ]}
      />

      <Heading id='explain-recommendation' level={2}>
        explain_recommendation
      </Heading>
      <p>
        Produce a natural-language explanation of a previous recommendation.
        Used internally when the agent needs to justify its conclusion at
        the end of a query. Not normally called directly.
      </p>

      <Callout kind='info'>
        Tools are versioned. The schema above is for v1. Breaking changes get
        a new tool name (e.g. <InlineCode>retrieve_cluster_supply_v2</InlineCode>)
        rather than a silent change to the existing tool.
      </Callout>
    </>
  );
}
