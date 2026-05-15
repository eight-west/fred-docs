import { Heading, CodeBlock, InlineCode, Callout, ParamTable, PageTitle } from '../Prose';

export const clusterSupplyToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'cluster-schema', label: 'Cluster schema' },
  { id: 'materialized-views', label: 'Materialized views' },
  { id: 'querying', label: 'Querying' },
  { id: 'h3-indexing', label: 'H3 indexing' }
];

export default function ClusterSupplyPage() {
  return (
    <>
      <PageTitle
        eyebrow='SPATIAL LAYERS'
        title='Cluster supply'
        lede="The cluster supply layer is FRED's foundation. Every query ultimately resolves to a set of clusters with predicted attributes. This page covers schema, indexing, and the query interface."
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        California's forested landscape is partitioned into roughly 2.1 million
        clusters from the C-BREC dataset. Each cluster is a polygon over a
        contiguous forest area for which the dataset provides biomass volumes
        under a specified prescription, terrain class, and harvesting system.
      </p>
      <p>
        FRED enriches each cluster with three precomputed predictions: a
        harvest cost from the surrogate model, a transport circuity factor
        from the IDW raster sampled at the cluster centroid, and a burn
        probability from USDA FSim. These predictions are stored as columns on
        the materialized cluster supply view to keep query latency low.
      </p>

      <Heading id='cluster-schema' level={2}>
        Cluster schema
      </Heading>
      <p>
        The canonical schema for a cluster in the runtime database:
      </p>
      <CodeBlock
        lang='sql'
        code={`CREATE TABLE mv_cluster_supply (
    cluster_no        INTEGER PRIMARY KEY,
    geom              GEOMETRY(MultiPolygon, 4326),
    centroid          GEOMETRY(Point, 4326),
    total_biomass_bdt FLOAT NOT NULL,
    treatment_id      INTEGER REFERENCES treatments(id),
    terrain_class     TEXT NOT NULL,
    harvest_system    TEXT NOT NULL,

    -- precomputed predictions
    harvest_cost_per_bdt FLOAT NOT NULL,
    cf_origin         FLOAT NOT NULL,
    burn_probability  FLOAT NOT NULL,

    -- H3 indexing at three resolutions
    h3_r4             TEXT NOT NULL,
    h3_r5             TEXT NOT NULL,
    h3_r6             TEXT NOT NULL,

    county_fips       TEXT,
    watershed_huc8    TEXT
);

CREATE INDEX idx_cluster_geom ON mv_cluster_supply USING GIST (geom);
CREATE INDEX idx_cluster_centroid ON mv_cluster_supply USING GIST (centroid);
CREATE INDEX idx_cluster_h3_r5 ON mv_cluster_supply (h3_r5);
CREATE INDEX idx_cluster_county ON mv_cluster_supply (county_fips);`}
      />

      <ParamTable
        rows={[
          { name: 'cluster_no', type: 'integer', description: 'Stable C-BREC cluster identifier. Persistent across FRED runs.' },
          { name: 'total_biomass_bdt', type: 'float', description: 'Total harvestable biomass in BDT under the prescription. This is the value depleted per treatment visit.' },
          { name: 'harvest_cost_per_bdt', type: 'float', description: <>Predicted cost from the harvest cost surrogate. See <a href='#harvest-cost'>Harvest cost</a>.</> },
          { name: 'cf_origin', type: 'float', description: <>Circuity factor sampled at the cluster centroid. See <a href='#transport'>Transport circuity</a>.</> },
          { name: 'burn_probability', type: 'float', description: 'Annual burn probability from USDA FSim 2024, range 0 to ~0.08.' },
          { name: 'h3_r4 / h3_r5 / h3_r6', type: 'text', description: 'H3 hex IDs at three resolutions. Used for fast spatial aggregation.' }
        ]}
      />

      <Heading id='materialized-views' level={2}>
        Materialized views
      </Heading>
      <p>
        FRED uses PostGIS materialized views to precompute the joins between
        cluster polygons, surrogate predictions, IDW raster samples, and burn
        probability raster samples. Without these, a typical radius query
        would take 8-12 seconds. With them, it is consistently under 400ms.
      </p>
      <p>The relevant runtime views:</p>
      <ul>
        <li>
          <InlineCode>mv_cluster_supply</InlineCode>: the master per-cluster
          enriched view (~2.1M rows).
        </li>
        <li>
          <InlineCode>mv_hex_r4</InlineCode>, <InlineCode>mv_hex_r5</InlineCode>,{' '}
          <InlineCode>mv_hex_r6</InlineCode>: H3-aggregated supply totals at
          three resolutions.
        </li>
        <li>
          <InlineCode>mv_regional_summary</InlineCode>: county- and
          watershed-level rollups for statewide views.
        </li>
        <li>
          <InlineCode>mv_normalization_bounds</InlineCode>: percentile bounds
          used for color scales and weighted objective normalization.
        </li>
      </ul>

      <Callout kind='warn'>
        Materialized views must be refreshed when underlying data changes (new
        FSim raster release, new C-BREC version). The refresh is incremental
        but takes 15-30 minutes for the full set. See{' '}
        <a href='#data-prep'>Data prep</a> for the refresh schedule.
      </Callout>

      <Heading id='querying' level={2}>
        Querying
      </Heading>
      <p>
        The agent retrieves clusters via the{' '}
        <InlineCode>retrieve_cluster_supply</InlineCode> tool. You don't
        normally query the database directly. But for debugging and research,
        here are the canonical query patterns.
      </p>
      <p>Clusters within radius of a point:</p>
      <CodeBlock
        lang='sql'
        code={`SELECT
    cluster_no,
    total_biomass_bdt,
    harvest_cost_per_bdt,
    cf_origin,
    burn_probability,
    ST_Distance(centroid::geography, ST_Point(-122.39, 40.59)::geography) / 1000 AS km_from_facility
FROM mv_cluster_supply
WHERE ST_DWithin(
    centroid::geography,
    ST_Point(-122.39, 40.59)::geography,
    43000  -- 43km
)
ORDER BY km_from_facility;`}
      />

      <p>H3-aggregated supply at resolution 5 for choropleth display:</p>
      <CodeBlock
        lang='sql'
        code={`SELECT
    h3_r5,
    SUM(total_biomass_bdt) AS total_bdt,
    AVG(harvest_cost_per_bdt) AS mean_cost,
    AVG(burn_probability) AS mean_burn_prob,
    COUNT(*) AS cluster_count
FROM mv_cluster_supply
GROUP BY h3_r5
HAVING SUM(total_biomass_bdt) > 100
ORDER BY total_bdt DESC;`}
      />

      <Heading id='h3-indexing' level={2}>
        H3 indexing
      </Heading>
      <p>
        H3 is Uber's hexagonal hierarchical spatial index. FRED uses three
        resolution levels because each is appropriate to different query
        types:
      </p>
      <ul>
        <li>
          <strong>Resolution 4</strong> (avg edge ~22.6km): statewide
          dashboards, regional rollups. About 600 cells covering California.
        </li>
        <li>
          <strong>Resolution 5</strong> (avg edge ~8.5km): the default for
          choropleth maps and the API responses to{' '}
          <InlineCode>compute_regional_summary</InlineCode>. About 4,500 cells.
        </li>
        <li>
          <strong>Resolution 6</strong> (avg edge ~3.2km): fine-grained
          facility-site analysis when 100km+ radii are being considered.
        </li>
      </ul>
      <p>
        Each cluster gets all three H3 IDs precomputed in the materialized
        view. This trades a small amount of storage for the ability to roll up
        instantly at any resolution without re-binning at query time.
      </p>
    </>
  );
}
