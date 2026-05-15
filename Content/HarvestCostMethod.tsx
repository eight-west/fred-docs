import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const harvestCostMethodToc = [
  { id: 'what-it-replaces', label: 'What it replaces' },
  { id: 'why-a-surrogate', label: 'Why a surrogate' },
  { id: 'training-data', label: 'Training data' },
  { id: 'two-stage-architecture', label: 'Two-stage architecture' },
  { id: 'validation', label: 'Validation results' },
  { id: 'when-to-trust-it', label: 'When to trust it' }
];

export default function HarvestCostMethodPage() {
  return (
    <>
      <PageTitle
        eyebrow='METHODOLOGY'
        title='Harvest cost surrogate'
        lede="An XGBoost model trained to predict the output of FRCS (Forest Residue Cost Simulator) across the full parameter space of California cluster supply. The surrogate is what makes FRED capable of evaluating millions of clusters per query."
      />

      <Heading id='what-it-replaces' level={2}>
        What it replaces
      </Heading>
      <p>
        FRCS is the USDA Forest Service tool for computing harvest cost
        given terrain, harvesting system, prescription, and biomass yield.
        It is deterministic, engineering-grounded, and considered the
        standard for forest biomass cost estimation in California.
      </p>
      <p>
        FRCS is also slow. Each invocation requires loading the FRCS
        runtime, which is a multi-second operation. For a system that
        needs to evaluate procurement economics across millions of
        clusters per query, calling FRCS directly is not feasible.
      </p>
      <p>
        FRED's harvest cost surrogate replaces FRCS-in-the-loop with a
        learned approximation that runs in roughly 0.2 milliseconds per
        prediction.
      </p>

      <Heading id='why-a-surrogate' level={2}>
        Why a surrogate
      </Heading>
      <p>
        The standard argument for surrogate modeling is speed. That holds
        here, but it is not the most important argument.
      </p>
      <p>
        The more important argument is <strong>portability</strong>. The
        surrogate is a 12 MB serialized model file. It can run anywhere
        with an XGBoost binding: a Python notebook, a JavaScript backend,
        a research workstation, a serverless function. FRCS itself is a
        packaged tool with its own runtime requirements; running it at
        scale or in a non-standard environment is genuinely difficult.
      </p>
      <p>
        The surrogate is a queryable, distributable artifact. FRED's
        California analysis runs through it, but researchers in other
        states can retrain it on their own FRCS runs without changing the
        rest of the pipeline.
      </p>

      <Callout kind='info'>
        FRCS remains the source of truth. The surrogate is validated
        against FRCS, not replaced by it. For audit purposes, FRED can be
        configured to re-run FRCS on the final recommended supply set
        before publishing the recommendation.
      </Callout>

      <Heading id='training-data' level={2}>
        Training data
      </Heading>
      <p>
        The training set is approximately 1.4 million FRCS configurations
        spanning the Cartesian product of:
      </p>
      <ul>
        <li>
          <strong>Terrain classes</strong>: flat, moderate, steep, very steep.
        </li>
        <li>
          <strong>Harvesting systems</strong>: cable, ground-based,
          helicopter, mixed.
        </li>
        <li>
          <strong>Prescriptions</strong>: every treatment ID in the C-BREC
          catalog.
        </li>
        <li>
          <strong>Biomass density per acre</strong>: sampled across the
          range observed in California clusters.
        </li>
        <li>
          <strong>Cluster size</strong>: sampled to cover small-block and
          large-block cases.
        </li>
        <li>
          <strong>Haul distance</strong>: sampled to cover near and far
          haul scenarios.
        </li>
        <li>
          <strong>Slope</strong>: sampled within each terrain class.
        </li>
      </ul>
      <p>
        FRCS was invoked for every cell in this grid. Infeasible
        combinations (helicopter on flat ground, for instance) were
        retained as labeled-infeasible examples for the first-stage
        classifier.
      </p>

      <Heading id='two-stage-architecture' level={2}>
        Two-stage architecture
      </Heading>
      <p>The surrogate is two models in sequence:</p>
      <ol>
        <li>
          <strong>Feasibility classifier.</strong> Binary XGBoost classifier
          predicting whether a (terrain, harvest system, prescription)
          combination is operationally feasible. Trained on the full 1.4M
          configuration set with feasibility labels from FRCS. Held-out
          accuracy is 99.7 percent.
        </li>
        <li>
          <strong>Cost regressor.</strong> XGBoost regressor predicting per-
          BDT levelized cost for feasible configurations. Trained only on
          the feasible subset to avoid extrapolation errors.
        </li>
      </ol>
      <p>
        The two-stage design matters because the cost surface is highly
        discontinuous across the feasibility boundary. A single model
        trying to predict cost across infeasible regions would have to
        either extrapolate wildly or compress the feasible distribution.
        Separating the two yields much better feasible-region accuracy.
      </p>

      <Heading id='validation' level={2}>
        Validation results
      </Heading>
      <p>
        Validation used a stratified 80/10/10 train/validation/test split
        with stratification on terrain class and harvesting system, so
        every terrain-system combination appears in the test set:
      </p>
      <ul>
        <li><strong>R²</strong> (test, feasible configurations): 0.997</li>
        <li><strong>Mean absolute error</strong>: under $2.10 per BDT</li>
        <li><strong>P95 absolute error</strong>: under $6.50 per BDT</li>
        <li>
          <strong>Worst single-cluster error</strong>: $28.40 per BDT, on a
          steep-terrain helicopter operation at the edge of the biomass
          density distribution. Outliers like this exist; they are rare
          and the surrogate's confidence is appropriately low in those
          regions.
        </li>
      </ul>
      <p>
        Additional held-out validation against fresh FRCS runs (not in
        training) shows no degradation. Full methodology and per-stratum
        error breakdowns are in Chapter 4 of the thesis.
      </p>

      <Heading id='when-to-trust-it' level={2}>
        When to trust it
      </Heading>
      <p>
        For typical California cluster configurations, the surrogate's
        predictions are dependable to within a few dollars per BDT. The
        regions of higher uncertainty are:
      </p>
      <ul>
        <li>
          <strong>Edge-of-distribution biomass densities.</strong> Very
          sparse or very dense clusters are less common in training and
          have wider prediction intervals.
        </li>
        <li>
          <strong>Marginally feasible configurations.</strong> Cases right
          on the feasibility boundary can have noisy cost predictions even
          though the classifier rates them as feasible.
        </li>
        <li>
          <strong>Helicopter operations on edge terrain.</strong>{' '}
          Helicopter cost in FRCS itself is more variable, and the
          surrogate inherits that variance.
        </li>
      </ul>

      <Callout kind='info'>
        The surrogate inherits FRCS's modeling assumptions about machine
        rates, fuel costs, and operational efficiency. If you have
        equipment costs or labor rates that differ substantially from
        FRCS's defaults, the surrogate's absolute numbers will be off in
        the same direction, though the relative comparisons across
        clusters remain valid.
      </Callout>
    </>
  );
}
