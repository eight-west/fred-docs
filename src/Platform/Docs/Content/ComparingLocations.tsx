import { Heading, Callout, PageTitle } from '../Prose';

export const comparingLocationsToc = [
  { id: 'what-it-does', label: 'What it does' },
  { id: 'how-to-ask', label: 'How to ask' },
  { id: 'what-comes-back', label: 'What comes back' },
  { id: 'how-to-interpret', label: 'How to interpret' }
];

export default function ComparingLocationsPage() {
  return (
    <>
      <PageTitle
        eyebrow='CAPABILITIES'
        title='Comparing locations'
        lede="Run multiple facility scenarios side by side. FRED computes each independently and presents a comparison that surfaces the cost drivers separating the candidates."
      />

      <Heading id='what-it-does' level={2}>
        What it does
      </Heading>
      <p>
        Real procurement decisions usually involve several candidate sites.
        FRED's comparison capability runs the full siting analysis for two
        or more candidates and presents the results in a single comparison
        view rather than separate threads.
      </p>

      <Heading id='how-to-ask' level={2}>
        How to ask
      </Heading>
      <ul>
        <li><em>"Compare a 20MW facility in Quincy versus Susanville."</em></li>
        <li><em>"How does siting near Burney compare to siting near Redding?"</em></li>
        <li><em>"Show me Lake Almanor versus Greenville for a 15MW plant, with fire weighting."</em></li>
        <li><em>"Compare these three sites: Quincy, Chester, Westwood."</em></li>
      </ul>

      <Heading id='what-comes-back' level={2}>
        What comes back
      </Heading>
      <p>The comparison output shows for each candidate:</p>
      <ul>
        <li>Annual sustainable supply (BDT/year)</li>
        <li>LCOE with the breakdown by harvest cost versus transport</li>
        <li>Operational radius needed</li>
        <li>Mean burn probability of contributing clusters</li>
        <li>Dominant terrain class and harvest system mix</li>
        <li>10-year supply sustainability rating</li>
      </ul>
      <p>
        The justification paragraph specifically calls out what separates
        the candidates. Usually it's one or two factors: a notable
        transport circuity difference, a terrain class shift, or a supply
        density gap.
      </p>

      <Heading id='how-to-interpret' level={2}>
        How to interpret
      </Heading>
      <p>
        Comparison results often surface non-obvious differences. Two sites
        that look similar on a map can have very different procurement
        economics for reasons that aren't visible at the macro view:
      </p>
      <ul>
        <li>
          <strong>Road network differences.</strong> A site 5 miles away
          from yours could have systematically higher circuity if it's on
          the wrong side of a ridge or river. The Pareto curves will
          diverge as a result.
        </li>
        <li>
          <strong>Terrain mix differences.</strong> One site's procurement
          pool might be 60 percent ground-based, while a neighbor's is 40
          percent. The cost differential can be substantial.
        </li>
        <li>
          <strong>Cluster density differences.</strong> A site near a
          county boundary often has supply on one side and protected land
          on the other, which limits effective procurement radius.
        </li>
        <li>
          <strong>Fire-tier mix differences.</strong> Two nearby sites can
          have very different splits across the four fire-risk tiers,
          which matters substantially under fire weighting or BioRAM
          contracts.
        </li>
      </ul>

      <Callout kind='tip'>
        After a comparison, ask <em>"why is X cheaper than Y?"</em>. FRED
        will surface the specific cost drivers separating the candidates,
        often with a side-by-side breakdown of harvest cost, transport, and
        terrain composition.
      </Callout>
    </>
  );
}
