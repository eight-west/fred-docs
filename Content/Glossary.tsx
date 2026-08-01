import { DefList, DocLink, InlineCode, PageTitle } from '../Prose';

export const glossaryToc = [
  { id: 'a-c', label: 'A - C' },
  { id: 'd-l', label: 'D - L' },
  { id: 'm-r', label: 'M - R' },
  { id: 's-z', label: 'S - Z' }
];

export default function GlossaryPage() {
  return (
    <>
      <PageTitle
        eyebrow='REFERENCE'
        title='Glossary'
        lede='Domain vocabulary used throughout the FRED docs. Skim this once and the rest of the documentation reads more naturally.'
      />

      <h2 id='a-c' className='mt-8 text-h3 text-primary'>
        A - C
      </h2>
      <DefList
        items={[
          { term: 'Alpha (α)', def: <>FRED's fire-versus-cost weighting parameter. Ranges 0 to 1. <InlineCode>α=0</InlineCode> is cost-only; <InlineCode>α=1</InlineCode> is fire-only. The leverage knee for most California regions sits near <InlineCode>α≈0.05</InlineCode>.</> },
          { term: 'BDT', def: 'Bone Dry Ton. The standard unit of biomass supply, measured at zero moisture content. One BDT corresponds to roughly 1.5 to 2 green tons depending on species.' },
          { term: 'BioRAM', def: 'California PUC program offering preferential power-purchase agreements for biomass facilities sourcing from high-fire-hazard zones. FRED can be tuned to model BioRAM-style criteria.' },
          { term: 'BioMAT', def: 'California Biomass Market Adjusting Tariff. The smaller-facility analog to BioRAM.' },
          { term: 'Burn probability', def: 'Per-pixel annual probability of burning, from the USDA FSim 2024 raster. Values typically 0 to 0.08.' },
          { term: 'C-BREC', def: 'California Biomass Residue and Energy Conversion dataset. The source for FRED\'s cluster polygons, biomass volumes, and prescription metadata.' },
          { term: 'CHP', def: 'Combined Heat and Power. One of three biomass facility technology types FRED can model.' },
          { term: 'Circuity factor (CF)', def: <>The ratio of road network distance to straight-line distance between two points. Used to convert Euclidean haul estimates into realistic truck distances. See <DocLink to='understanding-transport'>Transport: circuity and haul</DocLink>.</> },
          { term: 'Cluster', def: 'FRED\'s atomic unit of supply. A polygon over a small forest area with known biomass inventory, harvesting system feasibility, and precomputed harvest cost. About 3.1 million clusters cover California.' },
          { term: 'CS-RAG', def: 'Compositional Spatial RAG. FRED\'s underlying architecture. Retrieves spatial prediction layers and composes them dynamically at query time.' }
        ]}
      />

      <h2 id='d-l' className='mt-12 text-h3 text-primary'>
        D - L
      </h2>
      <DefList
        items={[
          { term: 'Depletion', def: 'In multi-year projections, the sequential exhaustion of clusters as they are harvested. FRED\'s depletion model removes each visited cluster from the available pool for subsequent years.' },
          { term: 'FRCS', def: 'Forest Residue Cost Simulator. A USDA Forest Service tool that computes harvest cost. FRED uses a learned surrogate of FRCS rather than running it in real time.' },
          { term: 'FSim', def: 'USDA Wildfire Simulator. The source of the burn probability raster FRED uses for fire-aware procurement.' },
          { term: 'GP / GPO / CHP', def: 'The three facility technology types FRED can model: Generating Plant, Generating Plant Oversized, and Combined Heat and Power. Each has different biomass demand per MW.' },
          { term: 'Harvest cost surrogate', def: <>The XGBoost model that predicts FRCS harvest cost in approximately 0.2 ms per cluster. See <a href='#harvest-cost-method'>Harvest cost surrogate</a>.</> },
          { term: 'IDW interpolation', def: 'Inverse Distance Weighted interpolation. The method FRED uses to extrapolate the transport circuity factor from 445,000 sampled OSRM routes to a continuous statewide raster.' },
          { term: 'LCOE', def: 'Levelized Cost of Energy. The per-MWh cost over a facility\'s operating life, including procurement, capex, and operations.' },
          { term: 'Leverage ratio', def: 'The ratio of fire-risk reduction to cost premium at a given alpha setting. Peaks at roughly 5.8x near alpha = 0.05 for most California regions.' }
        ]}
      />

      <h2 id='m-r' className='mt-12 text-h3 text-primary'>
        M - R
      </h2>
      <DefList
        items={[
          { term: 'OSRM', def: 'Open Source Routing Machine. The routing engine FRED uses to compute road network distances. Configured with a custom California truck profile.' },
          { term: 'Pareto frontier', def: 'The set of all cost-fire combinations that are not dominated by any other combination. FRED computes the Pareto frontier explicitly to expose the cost-versus-fire tradeoff.' },
          { term: 'PostGIS', def: 'The spatial extension to PostgreSQL underlying FRED\'s data store. Users do not interact with it directly.' },
          { term: 'Prescription', def: 'A specific harvest plan applied to a cluster: which trees to remove, in what proportion, on what rotation cycle.' }
        ]}
      />

      <h2 id='s-z' className='mt-12 text-h3 text-primary'>
        S - Z
      </h2>
      <DefList
        items={[
          { term: 'Sawtooth pattern', def: 'The characteristic up-down trajectory of annual cost across a multi-year procurement projection. Caused by genuine terrain heterogeneity in the depletion sequence.' },
          { term: 'Spatial prediction layer', def: 'FRED\'s umbrella term for a model output that varies across space. Three kinds: learned (cost surrogate), interpolated empirical (transport circuity), and optimization-over-external (fire Pareto).' },
          { term: 'Sustainable annual yield', def: 'The amount of biomass that can be harvested annually under the assigned prescription without depleting the long-term resource. FRED\'s supply numbers represent this, not one-time inventory.' },
          { term: 'Treatment', def: 'A single harvest event applied to a cluster. Each treatment visit harvests the cluster\'s full prescription-defined yield.' },
          { term: 'TEA', def: 'Techno-Economic Analysis. The end-to-end cost-and-revenue model for a candidate facility. FRED\'s recommendations feed into TEA workflows.' }
        ]}
      />
    </>
  );
}
