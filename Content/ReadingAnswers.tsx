import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const readingAnswersToc = [
  { id: 'anatomy', label: "Anatomy of an answer" },
  { id: 'the-headline', label: 'The headline number' },
  { id: 'the-map', label: 'The map' },
  { id: 'the-supply-curve', label: 'The supply curve' },
  { id: 'the-justification', label: 'The justification' },
  { id: 'when-to-trust-it', label: 'When to trust the answer' }
];

export default function ReadingAnswersPage() {
  return (
    <>
      <PageTitle
        eyebrow='GETTING STARTED'
        title="Reading FRED's answers"
        lede="FRED's recommendations come back with several parts. This page walks through each part, what it means, and when to look at which piece."
      />

      <Heading id='anatomy' level={2}>
        Anatomy of an answer
      </Heading>
      <p>A typical FRED response has four components:</p>
      <ol>
        <li>
          <strong>The headline</strong>: a one-sentence recommendation with the
          most important numbers.
        </li>
        <li>
          <strong>The map</strong>: a visualization of the recommended
          facility location, contributing clusters, and the relevant spatial
          context.
        </li>
        <li>
          <strong>The supply curve</strong>: a chart showing how much
          biomass is available at what cost, often broken out by year for
          multi-year queries.
        </li>
        <li>
          <strong>The justification</strong>: a written paragraph explaining
          how FRED arrived at the recommendation and what the key
          tradeoffs were.
        </li>
      </ol>

      <Heading id='the-headline' level={2}>
        The headline number
      </Heading>
      <p>An example headline:</p>
      <Callout kind='info'>
        <em>"Site near Burney, CA. Supplies 42.3k BDT/yr at $87.40/BDT with
        5.8x fire-risk leverage at alpha = 0.05."</em>
      </Callout>
      <p>Reading this:</p>
      <ul>
        <li>
          <strong>Site near Burney, CA</strong>: FRED's recommended facility
          coordinates, resolved to the nearest named place.
        </li>
        <li>
          <strong>42.3k BDT/yr</strong>: total annual sustainable biomass
          supply available to this facility. That's bone-dry tons per year.
        </li>
        <li>
          <strong>$87.40/BDT</strong>: levelized cost per ton, weighted
          across all contributing clusters. Includes harvest cost and
          transport.
        </li>
        <li>
          <strong>5.8x fire-risk leverage</strong>: ratio of fire reduction
          to cost premium versus the cost-only optimum. A 5.8x leverage
          means each 1 percent of extra cost buys roughly 5.8 percent of
          fire reduction.
        </li>
        <li>
          <strong>alpha = 0.05</strong>: the fire weighting FRED recommended
          for this query, at the knee of the Pareto curve.
        </li>
      </ul>

      <Heading id='the-map' level={2}>
        The map
      </Heading>
      <p>The map shows three things by default:</p>
      <ul>
        <li>
          The <strong>recommended facility location</strong>, marked with a
          breathing pin.
        </li>
        <li>
          The <strong>contributing clusters</strong>, color-coded by their
          contribution. Darker colors mean larger contribution.
        </li>
        <li>
          The <strong>procurement radius</strong>, drawn as a soft boundary
          around the facility.
        </li>
      </ul>
      <p>
        Toggle the map controls in the top right to add overlays. Fire-risk
        heatmap and transport circuity zones are the most commonly useful.
        The H3 hex aggregation makes regional patterns more visible than
        the per-cluster view at large radii.
      </p>

      <Heading id='the-supply-curve' level={2}>
        The supply curve
      </Heading>
      <p>
        For single-year queries, the supply curve shows clusters ranked
        from cheapest to most expensive on the x-axis with cumulative
        annual supply on the y-axis. The slope flattens out where supply
        gets expensive; the inflection point is usually a good indicator
        of where additional supply stops being economic.
      </p>
      <p>
        For multi-year queries, the supply curve is replaced by a year-by-
        year stacked chart. The bars often show a "sawtooth" pattern; this
        is a real signal, not a glitch. It reflects genuine terrain
        heterogeneity: in any given year, the available clusters may
        cluster into easier or harder terrain depending on what's left.
      </p>

      <Callout kind='tip'>
        If you see a year with unexpectedly high cost, hover over the bar
        in the chart. FRED will show which clusters contributed that year
        and you can usually see the terrain or transport reason.
      </Callout>

      <Heading id='the-justification' level={2}>
        The justification
      </Heading>
      <p>
        The written paragraph below the recommendation explains the
        reasoning. A typical justification covers:
      </p>
      <ul>
        <li>Why FRED picked this location over alternatives nearby.</li>
        <li>What the dominant cost drivers are (terrain, transport, or fire weighting).</li>
        <li>Any constraints that mattered, like coverage gaps or supply ceilings.</li>
        <li>What to consider for follow-up analysis.</li>
      </ul>
      <p>
        Read the justification before acting on the headline. The headline
        is a useful summary, but the justification often surfaces caveats
        that change how you interpret the number.
      </p>

      <Heading id='when-to-trust-it' level={2}>
        When to trust the answer
      </Heading>
      <p>
        FRED's predictions are validated against the source data they
        approximate. The harvest cost surrogate has R² = 0.997 against held-
        out FRCS runs with mean absolute error under $2.10 per BDT. The
        transport circuity model is built from 445,000 real road network
        routes. Within California, within standard prescription regimes, on
        typical haul distances, FRED's recommendations are dependable.
      </p>
      <p>
        Be more cautious when the query pushes the edges:
      </p>
      <ul>
        <li>
          <strong>Very remote terrain or very long hauls.</strong> The
          transport model interpolates from sampled routes; areas with few
          nearby samples have wider uncertainty.
        </li>
        <li>
          <strong>Unusual harvesting systems.</strong> If a query forces a
          helicopter operation on flat ground, FRED's feasibility classifier
          will catch it, but the cost prediction for marginal cases is
          noisier.
        </li>
        <li>
          <strong>Very high fire alpha.</strong> At alpha {'>'} 0.5, the model
          is operating in a regime where structural ceilings dominate. The
          predictions are still correct but the result is largely shaped by
          where biomass and high-fire-risk areas coincidentally overlap,
          which is sparse.
        </li>
        <li>
          <strong>Edge of the year horizon.</strong> Year-10 projections
          have more accumulated uncertainty than year-1. The depletion model
          assumes prescriptions stay constant; real procurement decisions
          may alter that.
        </li>
      </ul>

      <Callout kind='info'>
        When FRED is operating in a regime with elevated uncertainty, the
        justification paragraph will say so. Look for language like "this
        recommendation is at the edge of validated coverage" or
        "interpolation uncertainty is elevated here."
      </Callout>
    </>
  );
}
