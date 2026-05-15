import { Heading, CodeBlock, Callout, InlineCode, ParamTable, PageTitle } from '../Prose';

export const harvestCostToc = [
  { id: 'overview', label: 'Overview' },
  { id: 'why-a-surrogate', label: 'Why a surrogate' },
  { id: 'training-data', label: 'Training data' },
  { id: 'architecture', label: 'Two-stage architecture' },
  { id: 'validation', label: 'Validation' },
  { id: 'feature-importance', label: 'Feature importance' },
  { id: 'using-the-model', label: 'Using the model' }
];

export default function HarvestCostPage() {
  return (
    <>
      <PageTitle
        eyebrow='SPATIAL LAYERS'
        title='Harvest cost surrogate'
        lede='An XGBoost model that predicts levelized harvest cost per BDT. Trained on 1.4M FRCS configurations spanning every combination of terrain, harvesting system, and prescription that exists in California. The portable artifact that makes FRED deployable without an FRCS runtime.'
      />

      <Heading id='overview' level={2}>
        Overview
      </Heading>
      <p>
        FRCS (Forest Residue Cost Simulator) is the USDA-sanctioned source of
        truth for harvest cost computation. It is a deterministic engineering
        simulator. The output is exact given the input parameters, but every
        invocation requires loading the FRCS runtime, which is a multi-second
        operation. For a system that needs to evaluate millions of clusters
        per query, FRCS-in-the-loop is infeasible.
      </p>
      <p>
        The harvest cost surrogate replaces FRCS-in-the-loop with a learned
        approximation. It is an XGBoost model trained on 1.4 million FRCS
        configurations that achieves R² of 0.997 against held-out test data
        with a mean absolute error under $2.10 per BDT. Each prediction takes
        roughly 0.2 milliseconds.
      </p>

      <Heading id='why-a-surrogate' level={2}>
        Why a surrogate
      </Heading>
      <p>
        The conventional argument for surrogate models is speed. That is true
        here, but it is not the most important argument.
      </p>
      <p>
        The more important argument is <strong>portability</strong>. The
        surrogate is a 12 MB serialized XGBoost model. It can be deployed
        anywhere Python or any other XGBoost binding runs. FRCS is a packaged
        npm library with its own data dependencies; running it in a serverless
        environment, on a research analyst's laptop, or inside an MLOps
        pipeline is genuinely difficult.
      </p>
      <p>
        The surrogate is a queryable, distributable artifact. FRED's
        California analysis sits behind it; researchers in other states can
        retrain it on their own FRCS runs without changing the rest of the
        pipeline.
      </p>

      <Callout kind='tip'>
        FRCS itself remains the source of truth. The surrogate is validated
        against FRCS, not replaced by it. For audit purposes, FRED can be
        configured to re-run FRCS on the final recommendation before
        publishing.
      </Callout>

      <Heading id='training-data' level={2}>
        Training data
      </Heading>
      <p>
        The training set is the Cartesian product of every reasonable parameter
        combination that exists in the California cluster space:
      </p>
      <ParamTable
        rows={[
          { name: 'terrain_class', type: 'categorical', description: 'Flat, moderate, steep, very steep. Sourced from C-BREC.' },
          { name: 'harvest_system', type: 'categorical', description: 'Cable, ground-based, helicopter, mixed. Each has a different cost curve.' },
          { name: 'treatment_id', type: 'categorical', description: 'The prescription type: thinning, fuels reduction, clearcut, etc.' },
          { name: 'biomass_per_acre', type: 'float', description: 'BDT per acre after prescription. Strong nonlinear cost driver.' },
          { name: 'cluster_size_acres', type: 'float', description: 'Size of the harvest block. Larger clusters amortize move-in costs.' },
          { name: 'haul_distance_km', type: 'float', description: 'Distance to the destination facility. Linearly affects per-BDT cost.' },
          { name: 'slope_pct', type: 'float', description: 'Mean slope across the cluster polygon. Within terrain_class, slope shifts cost noticeably.' }
        ]}
      />
      <p>
        FRCS was invoked for every cell in the parameter grid. Where the input
        was infeasible (a flat-terrain helicopter operation, for instance), the
        model includes a feasibility classifier as a first stage.
      </p>

      <Heading id='architecture' level={2}>
        Two-stage architecture
      </Heading>
      <p>The surrogate is two models in sequence:</p>
      <ol>
        <li>
          <strong>Feasibility classifier.</strong> Binary classifier predicting
          whether a (terrain, harvest_system, prescription) combination is
          operationally feasible. 1.4M training examples, 99.7% accuracy on
          held-out.
        </li>
        <li>
          <strong>Cost regressor.</strong> XGBoost regressor predicting the
          per-BDT levelized cost for feasible configurations. The model is
          conditioned on the categorical features as one-hot, with continuous
          features as raw inputs.
        </li>
      </ol>
      <p>
        At inference time, infeasible clusters are filtered out before cost is
        computed. This keeps the cost regressor focused on the feasible
        manifold and prevents extrapolation errors.
      </p>

      <Heading id='validation' level={2}>
        Validation
      </Heading>
      <p>
        Validation used a 80/10/10 train/validation/test split with
        stratification on terrain class and harvest system to ensure each
        terrain-system combination appeared in the test set:
      </p>
      <ParamTable
        rows={[
          { name: 'R² (test)', type: 'metric', description: '0.997 across all feasible configurations.' },
          { name: 'MAE', type: 'metric', description: '$2.10 per BDT mean absolute error.' },
          { name: 'P95 error', type: 'metric', description: 'P95 absolute error under $6.50 per BDT.' },
          { name: 'Worst error', type: 'metric', description: 'Worst single-cluster error: $28.40 per BDT, on a steep-terrain helicopter operation with edge-of-distribution biomass density.' }
        ]}
      />
      <p>
        Full validation methodology and per-stratum error breakdowns are in
        Chapter 4 of the thesis. Additional held-out validation against fresh
        FRCS runs (not in training) shows no degradation.
      </p>

      <Heading id='feature-importance' level={2}>
        Feature importance
      </Heading>
      <p>
        SHAP analysis on the cost regressor shows the dominant cost drivers
        are not the obvious ones. From the chapter:
      </p>
      <ul>
        <li>
          <strong>Terrain class and harvest system are primary.</strong>{' '}
          Together they explain about 65% of the variance.
        </li>
        <li>
          <strong>Biomass density per acre.</strong> Roughly 20% of variance.
          More density means lower per-BDT cost.
        </li>
        <li>
          <strong>Treatment type has minimal impact.</strong> Across all
          feasible cases, treatment choice accounts for only about 1.1% of
          LCOE variation. This is a counterintuitive finding that simplifies
          procurement planning.
        </li>
        <li>
          <strong>Haul distance.</strong> About 8% variance, but this is the
          input most under the operator's control.
        </li>
      </ul>

      <Heading id='using-the-model' level={2}>
        Using the model
      </Heading>
      <p>
        The surrogate is bundled as <InlineCode>surrogate.pkl</InlineCode> (the
        feasibility classifier plus cost regressor) and loaded by the FRED
        backend at startup. To call it directly in Python:
      </p>
      <CodeBlock
        lang='python'
        code={`import joblib
import pandas as pd

# Load the surrogate
surrogate = joblib.load("surrogate.pkl")

# Build the feature row
features = pd.DataFrame([{
    "terrain_class": "moderate",
    "harvest_system": "ground_based",
    "treatment_id": 12,
    "biomass_per_acre": 18.4,
    "cluster_size_acres": 24.0,
    "haul_distance_km": 32.0,
    "slope_pct": 18.0
}])

# Two-stage prediction
feasible = surrogate["feasibility"].predict(features)[0]
if not feasible:
    cost = None
else:
    cost = surrogate["cost"].predict(features)[0]

print(f"Cost: \${cost:.2f}/BDT")
# Cost: $87.40/BDT`}
      />

      <Callout kind='info'>
        For most use cases, you do not need to call the surrogate directly.
        FRED's <InlineCode>compute_cost</InlineCode> tool wraps it with
        cluster lookup and proper input validation.
      </Callout>
    </>
  );
}
