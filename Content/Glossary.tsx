import { DefList, PageTitle, InlineCode } from '../Prose';

export const glossaryToc = [
  { id: 'glossary-a-c', label: 'A - C' },
  { id: 'glossary-d-l', label: 'D - L' },
  { id: 'glossary-m-r', label: 'M - R' },
  { id: 'glossary-s-z', label: 'S - Z' }
];

export default function GlossaryPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title='Glossary'
        lede='Domain vocabulary used throughout the FRED docs and the underlying research papers. Skim this once and the rest of the documentation reads more naturally.'
      />

      <h2 id='glossary-a-c' style={{ fontSize: 22, marginTop: 32, color: '#F5F0E6' }}>
        A - C
      </h2>
      <DefList
        items={[
          { term: 'Alpha (α)', def: <>Weighting parameter in the fire-risk-aware procurement objective. Ranges 0 to 1. <InlineCode>α=0</InlineCode> is cost-only; <InlineCode>α=1</InlineCode> is fire-only. The leverage knee is typically at <InlineCode>α≈0.05</InlineCode>.</> },
          { term: 'BDT', def: 'Bone Dry Ton. The standard unit of biomass supply, measured at zero moisture content. One BDT corresponds to approximately 1.5 to 2 green tons depending on species.' },
          { term: 'BioRAM', def: 'California PUC program providing power-purchase agreements for biomass facilities sourcing from high-fire-hazard zones. One of the policy frameworks FRED can model against.' },
          { term: 'BioMAT', def: 'California Biomass Market Adjusting Tariff. Smaller-facility analog to BioRAM with different siting incentives.' },
          { term: 'Burn probability', def: 'Per-pixel probability that a given location burns in any given year. FRED uses the 30m USDA FSim 2024 raster, projected from EPSG:5070 to EPSG:4326 for joins with cluster polygons.' },
          { term: 'C-BREC', def: 'California Biomass Residue and Energy Conversion dataset. The primary source for cluster polygons, biomass volumes, and prescription metadata.' },
          { term: 'CHP', def: 'Combined Heat and Power. One of the three biomass facility technology types FRED can model (alongside GPO and GP).' },
          { term: 'Circuity Factor (CF)', def: <>The ratio of actual road network distance to Euclidean distance between two points. FRED treats CF as an <em>origin-location property</em> rather than an O-D pair attribute, because origin features explain 87 percent of the variance.</> },
          { term: 'Cluster', def: <>FRED's atomic unit of supply. A polygon over a small forest area with known biomass inventory, harvesting system feasibility, and precomputed harvest cost. Approximately 2.1 million clusters cover California.</> },
          { term: 'Cluster supply vector', def: <>The full feature vector for a single cluster: biomass volume, treatment cost, transport-adjusted cost, fire-risk weight, terrain class. Returned by <InlineCode>retrieve_cluster_supply</InlineCode>.</> },
          { term: 'CS-RAG', def: <>Compositional Spatial RAG. FRED's agentic architecture. Retrieves heterogeneous prediction layers (cost, transport, fire) per query and composes them dynamically rather than at index time.</> }
        ]}
      />

      <h2 id='glossary-d-l' style={{ fontSize: 22, marginTop: 48, color: '#F5F0E6' }}>
        D - L
      </h2>
      <DefList
        items={[
          { term: 'Depletion modeling', def: 'The simulation of cluster inventory exhaustion across a multi-year operating horizon. Each year, harvested clusters are removed from the available pool and the procurement radius expands to compensate.' },
          { term: 'FRCS', def: 'Forest Residue Cost Simulator. A USDA Forest Service tool that computes harvest cost given terrain, harvesting system, prescription, and biomass yield. FRED uses a learned XGBoost surrogate of FRCS rather than running it in real time.' },
          { term: 'FRREDSS', def: 'Forest Resource and Renewable Energy Decision Support System. The web application Aunsh built (predecessor and integration partner to FRED). Now exposes its computational core via FRED.' },
          { term: 'FSim', def: 'USDA Wildfire Simulator. Source of the burn probability raster FRED ingests for fire-risk weighting.' },
          { term: 'GPO', def: 'Generating Plant, Oversized. Biomass facility technology category. See also CHP, GP.' },
          { term: 'GP', def: 'Generating Plant. The smallest of the three modeled facility categories.' },
          { term: 'H3', def: 'Uber\'s hexagonal hierarchical spatial index. FRED uses resolutions 4, 5, and 6 for materialized cluster supply aggregation.' },
          { term: 'Harvest cost surrogate', def: 'The XGBoost two-stage pipeline (feasibility classifier plus cost regressor) trained on 1.4 million FRCS configurations. Replaces real-time FRCS invocation with a sub-millisecond lookup. R² = 0.997.' },
          { term: 'IDW interpolation', def: 'Inverse Distance Weighted interpolation. FRED uses IDW to extrapolate the transport circuity factor from 445,000 sampled OSRM routes to a continuous statewide raster.' },
          { term: 'LCOE', def: 'Levelized Cost of Energy. The per-MWh cost over the lifetime of a facility, including procurement, capex, and operations. FRED outputs LCOE projections for multi-year procurement plans.' },
          { term: 'Leverage ratio', def: 'In Pareto fire-aware optimization, the ratio of fire-risk reduction to cost premium at a given alpha. Peaks at roughly 5.8x near alpha = 0.05.' }
        ]}
      />

      <h2 id='glossary-m-r' style={{ fontSize: 22, marginTop: 48, color: '#F5F0E6' }}>
        M - R
      </h2>
      <DefList
        items={[
          { term: 'Materialized view', def: <>A precomputed query result stored as a table. FRED uses materialized views (<InlineCode>mv_cluster_supply</InlineCode>, <InlineCode>mv_regional_summary</InlineCode>, <InlineCode>mv_hex_r4/r5/r6</InlineCode>) to make spatial aggregations sub-millisecond.</> },
          { term: 'OSRM', def: 'Open Source Routing Machine. Self-hosted routing engine with a custom truck profile FRED uses for circuity computation. Truck-profile is essential because chip trucks cannot use all roads cars can.' },
          { term: 'Pareto frontier', def: 'The set of all cost-fire-risk combinations such that no point dominates another. FRED computes the Pareto frontier explicitly and lets the user (or the agent) pick an alpha.' },
          { term: 'PostGIS', def: 'Spatial extension to PostgreSQL. FRED\'s primary data store. All cluster polygons, materialized views, and spatial joins live in a PostGIS 17 database.' },
          { term: 'Prescription', def: 'A specific harvest plan applied to a stand: which trees to remove, what proportion, on what cycle. Each cluster has a known prescription with corresponding biomass yield.' },
          { term: 'ReAct loop', def: 'Reasoning-Acting loop. The agent alternates between reasoning steps (Claude generates a thought) and acting steps (Claude invokes a tool). Continues until the agent decides it has enough information to synthesize a response.' }
        ]}
      />

      <h2 id='glossary-s-z' style={{ fontSize: 22, marginTop: 48, color: '#F5F0E6' }}>
        S - Z
      </h2>
      <DefList
        items={[
          { term: 'Session', def: <>A multi-turn conversation. Tracked with a UUID, stored in Redis with 24-hour TTL. Session state includes message history but excludes large precomputed objects like cached cluster results.</> },
          { term: 'Sawtooth pattern', def: 'The characteristic up-down trajectory of annual procurement cost across a multi-year horizon. Caused by genuine terrain heterogeneity (good year, bad year, repeat) rather than a modeling defect.' },
          { term: 'Spatial prediction layer', def: 'FRED\'s umbrella term for a model output that varies across space and can be queried per-point or per-region. Includes learned models, interpolated empirical layers, and optimization layers over external rasters.' },
          { term: 'Surrogate', def: 'A fast machine-learning model trained to approximate the output of a slower, deterministic simulator. FRED\'s harvest cost surrogate replaces FRCS.' },
          { term: 'Treatment', def: <>A harvest event applied to a cluster. A single visit; full depletion of <InlineCode>total_biomass_bdt</InlineCode> per visit.</> },
          { term: 'TEA', def: 'Techno-Economic Analysis. The end-to-end cost-and-revenue model for a candidate facility. FRED\'s recommendations feed into TEA workflows.' }
        ]}
      />
    </>
  );
}
