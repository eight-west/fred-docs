import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const burnProbabilityToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-source', label: 'Data source' },
  { id: 'reprojection', label: 'Reprojection' },
  { id: 'cluster-join', label: 'Joining to clusters' },
  { id: 'pareto-objective', label: 'Pareto objective' },
  { id: 'leverage-curve', label: 'The leverage curve' }
];

export default function BurnProbabilityPage() {
  return (
    <>
      <PageTitle
        eyebrow='SPATIAL LAYERS'
        title='Burn probability'
        lede='An optimization layer over external domain data. FRED ingests the USDA FSim 2024 burn probability raster, joins it per-cluster, and uses it in the Pareto-weighted procurement objective.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        Unlike the harvest cost surrogate (which FRED owns and trains) and the
        transport circuity layer (which FRED builds from sampled routes), the
        burn probability layer is consumed from an external authoritative
        source: USDA's wildfire simulator (FSim).
      </p>
      <p>
        FRED's contribution is the optimization layer over this raster: a
        Pareto-weighted objective function that lets users explicitly trade
        procurement cost for fire-risk reduction, plus the spatial joins and
        normalizations that make per-cluster burn probability accessible to
        the agent.
      </p>

      <Heading id='data-source' level={2}>
        Data source
      </Heading>
      <p>
        FRED uses the USDA 2024 Wildfire Risk dataset. The relevant raster is
        the annual burn probability at 30-meter resolution, covering the
        contiguous United States.
      </p>
      <ul>
        <li><strong>Source:</strong> USDA Forest Service, FSim 2024 release.</li>
        <li><strong>Resolution:</strong> 30 meters per pixel.</li>
        <li><strong>Coverage:</strong> CONUS; FRED uses the California clip.</li>
        <li><strong>Projection:</strong> EPSG:5070 (NAD83 Conus Albers Equal Area).</li>
        <li><strong>Value range:</strong> 0 to ~0.08 annual burn probability.</li>
      </ul>
      <p>
        Refresh cadence: USDA publishes the raster annually. FRED's data prep
        pipeline detects new releases and re-runs the per-cluster join.
      </p>

      <Heading id='reprojection' level={2}>
        Reprojection
      </Heading>
      <p>
        A subtle but consequential detail: USDA's raster is in EPSG:5070
        (equal-area projection). FRED's PostGIS database stores all geometry
        in EPSG:4326 (lat/lng). The raster must be reprojected on ingest, not
        joined directly.
      </p>

      <Callout kind='danger'>
        A previous FRED data pipeline had a bug where the raster join was
        attempted without explicit reprojection. PostGIS silently produced
        wrong results because the raster CRS hint did not match the geometry
        CRS. Always specify both projections explicitly.
      </Callout>

      <p>The reprojection step:</p>
      <CodeBlock
        lang='bash'
        code={`# Reproject USDA raster from EPSG:5070 to EPSG:4326
gdalwarp \\
  -s_srs EPSG:5070 \\
  -t_srs EPSG:4326 \\
  -r bilinear \\
  -tr 0.0003 0.0003 \\
  usda_burn_probability_2024.tif \\
  burn_probability_4326.tif

# Load into PostGIS
raster2pgsql -s 4326 -I -C -M \\
  burn_probability_4326.tif \\
  public.burn_probability_raster | \\
  psql -d firegnn`}
      />

      <Heading id='cluster-join' level={2}>
        Joining to clusters
      </Heading>
      <p>
        Once reprojected, each cluster's burn probability is computed as the
        area-weighted mean of the raster pixels under the cluster polygon.
        This is done at data prep time and stored on{' '}
        <InlineCode>mv_cluster_supply</InlineCode>.
      </p>
      <CodeBlock
        lang='sql'
        code={`-- Compute area-weighted mean burn probability per cluster
UPDATE mv_cluster_supply c
SET burn_probability = (
    SELECT ST_SummaryStatsAgg(
        ST_Clip(r.rast, c.geom),
        1,  -- band
        true  -- exclude nodata
    ).mean
    FROM burn_probability_raster r
    WHERE ST_Intersects(r.rast, c.geom)
);`}
      />

      <Heading id='pareto-objective' level={2}>
        Pareto objective
      </Heading>
      <p>
        With per-cluster burn probability available, FRED can pose
        procurement as a Pareto-weighted optimization. The objective function:
      </p>
      <CodeBlock
        lang='python'
        code={`def objective(cluster, alpha):
    """
    Compute the weighted score for a single cluster.

    alpha = 0 means cost-only.
    alpha = 1 means fire-only.
    """
    cost_norm = (cluster.harvest_cost_per_bdt - cost_min) / (cost_max - cost_min)
    fire_norm = (cluster.burn_probability - fire_min) / (fire_max - fire_min)

    # Lower is better for both; we want to minimize cost and maximize fire reduction
    score = (1 - alpha) * cost_norm - alpha * fire_norm
    return score`}
      />
      <p>
        Normalization bounds (<InlineCode>cost_min</InlineCode>,{' '}
        <InlineCode>cost_max</InlineCode>, etc.) come from the{' '}
        <InlineCode>mv_normalization_bounds</InlineCode> view, computed as the
        5th and 95th percentiles of statewide values. Using percentiles rather
        than min/max prevents outlier clusters from compressing the rest of
        the distribution.
      </p>

      <Heading id='leverage-curve' level={2}>
        The leverage curve
      </Heading>
      <p>
        The leverage ratio at a given alpha is:
      </p>
      <CodeBlock
        lang='python'
        code={`leverage(alpha) = fire_reduction_pct(alpha) / cost_premium_pct(alpha)`}
      />
      <p>
        Empirically across California, this curve is sharply non-linear with a
        clear knee at <InlineCode>alpha ≈ 0.05</InlineCode>. At the knee:
      </p>
      <ul>
        <li>Cost premium over the cost-only baseline: about +20.5%</li>
        <li>Fire-risk reduction (procurement weighted): about 118.9%</li>
        <li>Leverage ratio: roughly 5.8x</li>
      </ul>
      <p>
        Past the knee, additional alpha buys little additional fire reduction
        at sharply increasing cost. Even at full fire optimization, roughly 57
        percent of procurement stays in the Very Low risk tier; this is a
        structural ceiling set by the geometry of California's road network
        and the location of harvestable biomass.
      </p>

      <Callout kind='info'>
        The leverage curve is the single most important policy-facing output
        from FRED. It quantifies the "free win" available from a modest fire
        weighting and the diminishing return past the knee.
      </Callout>
    </>
  );
}
