import { Heading, CodeBlock, Callout, InlineCode, PageTitle } from '../Prose';

export const dataPrepToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'pipeline', label: 'The pipeline' },
  { id: 'osrm-prep', label: 'OSRM preprocessing' },
  { id: 'refreshes', label: 'Refresh schedule' },
  { id: 'troubleshooting', label: 'Troubleshooting' }
];

export default function DataPrepPage() {
  return (
    <>
      <PageTitle
        eyebrow='DEPLOYMENT'
        title='Data prep'
        lede='Populating a fresh FRED instance with the cluster polygons, surrogate model, IDW raster, burn probability raster, and OSRM road graph. End-to-end roughly 4 hours on a fresh VM.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        FRED is read-mostly. The data prep pipeline runs once at deployment
        time, then incrementally when source data updates. The pipeline is
        idempotent: rerunning it on already-prepped data does no harm.
      </p>

      <Heading id='inputs' level={2}>
        Inputs
      </Heading>
      <p>The pipeline ingests:</p>
      <ul>
        <li>
          <strong>C-BREC biomass dataset</strong>: shapefile (or GeoPackage)
          of cluster polygons with biomass attributes. Roughly 2.1M
          polygons, 1.8 GB compressed.
        </li>
        <li>
          <strong>USDA FSim 2024 burn probability raster</strong>: GeoTIFF in
          EPSG:5070, 30-meter resolution. Roughly 800 MB.
        </li>
        <li>
          <strong>OSRM extract</strong>: California PBF from{' '}
          <InlineCode>geofabrik.de</InlineCode>.
        </li>
        <li>
          <strong>Pre-sampled OSRM routes</strong>: a CSV of 445,000 routes
          with origin, destination, road distance, and Euclidean distance.
          Used to fit the IDW raster.
        </li>
        <li>
          <strong>FRCS surrogate</strong>: pre-trained{' '}
          <InlineCode>surrogate.pkl</InlineCode> (12 MB). Optional; can be
          retrained from FRCS runs if needed.
        </li>
      </ul>

      <Heading id='pipeline' level={2}>
        The pipeline
      </Heading>
      <CodeBlock
        lang='bash'
        code={`# 1. Ingest cluster polygons and biomass
python prep/01_load_clusters.py \\
  --shapefile data/cbrec_clusters.shp \\
  --db-url $DATABASE_URL

# 2. Reproject and load burn probability raster
python prep/02_load_burn_raster.py \\
  --input data/usda_burn_2024.tif \\
  --target-srs EPSG:4326 \\
  --db-url $DATABASE_URL

# 3. Compute per-cluster burn probability (area-weighted)
python prep/03_join_burn_to_clusters.py --db-url $DATABASE_URL

# 4. Build IDW raster from sampled OSRM routes
python prep/04_build_idw.py \\
  --input data/osrm_routes_445k.csv \\
  --output models/cf_idw.tif \\
  --power 2 --k 12

# 5. Sample IDW at cluster centroids
python prep/05_join_cf_to_clusters.py --db-url $DATABASE_URL

# 6. Run surrogate predictions for all clusters
python prep/06_predict_costs.py \\
  --surrogate models/surrogate.pkl \\
  --db-url $DATABASE_URL

# 7. Build H3 indexes at resolutions 4, 5, 6
python prep/07_build_h3.py --db-url $DATABASE_URL

# 8. Refresh materialized views
python prep/08_refresh_views.py --db-url $DATABASE_URL

# 9. Compute normalization bounds
python prep/09_compute_norm_bounds.py \\
  --db-url $DATABASE_URL \\
  --output models/norm_bounds.json`}
      />

      <Callout kind='warn'>
        Step 2 (raster reprojection) is the single most common point of
        failure. Always verify the projected raster opens correctly in QGIS
        before continuing.
      </Callout>

      <Heading id='osrm-prep' level={2}>
        OSRM preprocessing
      </Heading>
      <p>
        OSRM needs to preprocess the PBF with the truck profile before it can
        route. This is done once and the output is mounted into the OSRM
        container.
      </p>
      <CodeBlock
        lang='bash'
        code={`# Download the California PBF
wget -O osrm_data/california.osm.pbf \\
  https://download.geofabrik.de/north-america/us/california-latest.osm.pbf

# Extract with the FRED truck profile
docker run --rm -t -v "\${PWD}/osrm_data:/data" \\
  -v "\${PWD}/forestry.lua:/opt/forestry.lua" \\
  osrm/osrm-backend:v5.27.1 \\
  osrm-extract -p /opt/forestry.lua /data/california.osm.pbf

# Partition and customize
docker run --rm -t -v "\${PWD}/osrm_data:/data" \\
  osrm/osrm-backend:v5.27.1 \\
  osrm-partition /data/california.osrm

docker run --rm -t -v "\${PWD}/osrm_data:/data" \\
  osrm/osrm-backend:v5.27.1 \\
  osrm-customize /data/california.osrm`}
      />
      <p>
        The <InlineCode>forestry.lua</InlineCode> profile is in the repo and
        excludes high-grade roads, weight-restricted bridges, and seasonal
        forest roads.
      </p>

      <Heading id='refreshes' level={2}>
        Refresh schedule
      </Heading>
      <ul>
        <li><strong>OSM/OSRM</strong>: quarterly. The road network changes slowly.</li>
        <li><strong>USDA FSim raster</strong>: annually. Released each fall.</li>
        <li><strong>C-BREC clusters</strong>: irregularly. Typically annual.</li>
        <li><strong>FRCS surrogate</strong>: only when FRCS itself releases a major version.</li>
      </ul>
      <p>
        Each refresh runs the relevant subset of the pipeline above, then
        refreshes materialized views and bumps <InlineCode>CACHE_VERSION</InlineCode>{' '}
        to invalidate the tool cache.
      </p>

      <Heading id='troubleshooting' level={2}>
        Troubleshooting
      </Heading>
      <ul>
        <li>
          <strong>EPSG mismatch on raster join</strong>: see the warning under
          "Joining to clusters" in <a href='#burn-probability'>Burn probability</a>.
          Always reproject before joining.
        </li>
        <li>
          <strong>Duplicate routes in OSRM dataset</strong>: the historical
          duplicated-treatment bug inflated route counts from 435K to 7.4M.
          The fix is in <InlineCode>prep/04_build_idw.py</InlineCode>; rerun
          if numbers look wrong.
        </li>
        <li>
          <strong>H3 indexing taking forever</strong>: index in parallel
          across H3 resolutions. The default script uses 4 worker processes.
        </li>
      </ul>
    </>
  );
}
