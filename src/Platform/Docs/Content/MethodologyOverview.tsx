import { DocLink, Heading, PageTitle } from '../Prose';

export const methodologyOverviewToc = [
  { id: 'three-layers', label: 'Three spatial prediction layers' },
  { id: 'data-sources', label: 'Data sources' },
  { id: 'how-they-compose', label: 'How they compose into FRED' },
  { id: 'reproducibility', label: 'Reproducibility' }
];

export default function MethodologyOverviewPage() {
  return (
    <>
      <PageTitle
        eyebrow='METHODOLOGY'
        title='Methodology overview'
        lede="FRED's recommendations rest on three published spatial prediction layers. This page explains what they are at a high level, how they compose, and where the underlying research is documented."
      />

      <Heading id='three-layers' level={2}>
        Three spatial prediction layers
      </Heading>
      <p>
        FRED organizes its predictive components into three distinct
        categories. Understanding the taxonomy makes the rest of the docs
        easier to follow.
      </p>
      <ul>
        <li>
          <strong>Learned prediction layer</strong>: a machine-learning
          model trained to predict an outcome from inputs. FRED's harvest
          cost surrogate is the canonical example. See{' '}
          <DocLink to='harvest-cost-method'>Harvest cost surrogate</DocLink>.
        </li>
        <li>
          <strong>Interpolated empirical layer</strong>: a continuous
          spatial field built from sampled observations using interpolation.
          FRED's transport circuity model is the example. See{' '}
          <DocLink to='transport-method'>Transport circuity model</DocLink>.
        </li>
        <li>
          <strong>Optimization layer over external domain data</strong>: a
          decision framework built on top of an external authoritative
          dataset. FRED's fire-aware Pareto framework wraps the USDA FSim
          burn probability raster this way. See{' '}
          <DocLink to='fire-method'>Fire-aware Pareto framework</DocLink>.
        </li>
      </ul>
      <p>
        Each layer has different accuracy guarantees, update cadences, and
        appropriate uses. Treating them as a single category obscures
        important differences; treating them as the same kind of thing
        makes for sloppy interpretation.
      </p>

      <Heading id='data-sources' level={2}>
        Data sources
      </Heading>
      <p>FRED ingests data from several authoritative sources:</p>
      <ul>
        <li>
          <strong>C-BREC</strong> (California Biomass Residue and Energy
          Conversion) for cluster polygons, biomass volumes, prescriptions,
          and terrain class. The cluster catalog is the foundation of
          every FRED query.
        </li>
        <li>
          <strong>FRCS</strong> (Forest Residue Cost Simulator) from USDA
          Forest Service for the harvest cost training data. FRED runs
          FRCS millions of times during training and queries the surrogate
          at inference time.
        </li>
        <li>
          <strong>OSRM</strong> with custom California truck profile for
          road network routing. Used to build the 445,000-route sample
          that the IDW circuity model is fit to.
        </li>
        <li>
          <strong>USDA FSim 2024</strong> burn probability raster at 30m
          resolution. Provides the fire-risk input to the Pareto
          framework.
        </li>
        <li>
          <strong>OpenStreetMap</strong> California extract for the road
          network underlying OSRM.
        </li>
      </ul>
      <p>
        Data provenance is documented per-layer on the following pages.
      </p>

      <Heading id='how-they-compose' level={2}>
        How they compose into FRED
      </Heading>
      <p>
        A FRED query composes outputs from one or more of the three
        layers. For a basic cost-only siting query, FRED uses the harvest
        cost surrogate and the transport circuity layer. For a fire-aware
        query, the Pareto framework joins the burn probability layer.
        For a multi-year projection, the same layers run iteratively with
        cluster depletion.
      </p>
      <p>
        The composition itself is the contribution of the CS-RAG
        architecture: dynamic per-query joining of heterogeneous spatial
        prediction layers, mediated by an agentic reasoning loop.
      </p>

      <Heading id='reproducibility' level={2}>
        Reproducibility
      </Heading>
      <p>
        FRED's predictions are deterministic given the underlying model
        weights and data versions. Two identical queries to the same FRED
        instance return identical answers; the same query against the
        same data versions on a different instance returns the same answer
        modulo numerical precision.
      </p>
      <p>
        For researchers needing fully reproducible parameterized runs, the
        prediction layers themselves are available as standalone
        artifacts:
      </p>
      <ul>
        <li>The harvest cost surrogate as a serialized XGBoost model.</li>
        <li>The IDW transport circuity field as a GeoTIFF raster.</li>
        <li>
          The burn probability raster as ingested from USDA (the data
          provenance is downstream of the original FSim release).
        </li>
      </ul>
      <p>
        Email <a href='mailto:contact@biofred.us'>contact@biofred.us</a>{' '}
        for access to the artifacts directly, or read the thesis and
        accompanying papers for the full methodology.
      </p>
    </>
  );
}
