import { Callout, DocLink, Heading, PageTitle } from '../Prose';

export const faqToc = [
  { id: 'general', label: 'General' },
  { id: 'coverage', label: 'Coverage and scope' },
  { id: 'accuracy', label: 'Accuracy and trust' },
  { id: 'using-it', label: 'Using FRED' },
  { id: 'research', label: 'Research and citation' }
];

export default function FAQPage() {
  return (
    <>
      <PageTitle
        eyebrow='REFERENCE'
        title='Frequently asked questions'
        lede="Answers to questions FRED's users actually ask."
      />

      <Heading id='general' level={2}>
        General
      </Heading>

      <Heading id='who-built-fred' level={3}>
        Who built FRED?
      </Heading>
      <p>
        FRED is a research project developed by Aunsh Bandivadekar with
        collaborators. The underlying research is documented in a
        peer-reviewed thesis and several published papers.
      </p>

      <Heading id='is-fred-free' level={3}>
        Is FRED free to use?
      </Heading>
      <p>
        Yes, for research, policy analysis, and California biomass
        procurement evaluation. FRED is a research tool maintained by
        the project team. Commercial use at scale requires no fee but
        does require coordination; email{' '}
        <a href='mailto:contact@biofred.us'>contact@biofred.us</a>.
      </p>

      <Heading id='how-much-does-it-cost-to-run' level={3}>
        How does FRED handle costs internally?
      </Heading>
      <p>
        FRED uses Claude as its reasoning backbone, which has per-query
        compute cost. For users of the chat interface, this is
        transparent. The query cost scales with conversation length and
        complexity but is generally a fraction of a cent per turn.
      </p>

      <Heading id='coverage' level={2}>
        Coverage and scope
      </Heading>

      <Heading id='what-states' level={3}>
        Which states does FRED cover?
      </Heading>
      <p>
        Currently California only. The cluster dataset, fire raster, and
        transport model are all California-specific. Oregon and Washington
        coverage is on the roadmap pending equivalent regional data.
      </p>

      <Heading id='ag-residues' level={3}>
        Does FRED cover agricultural residues?
      </Heading>
      <p>
        No. FRED's supply is forest biomass only. Orchard residues, dairy
        waste, crop residues, and other agricultural waste streams are not
        in the cluster catalog.
      </p>

      <Heading id='private-vs-public' level={3}>
        Does FRED distinguish private versus public land?
      </Heading>
      <p>
        FRED knows the ownership type of each cluster but does not filter
        on it by default. If you want only private-land supply, ask: "find
        biomass on private land near X." Most users find that ownership
        composition matters less than terrain and transport in the cost
        analysis.
      </p>

      <Heading id='accuracy' level={2}>
        Accuracy and trust
      </Heading>

      <Heading id='how-accurate' level={3}>
        How accurate are FRED's cost predictions?
      </Heading>
      <p>
        The harvest cost surrogate validates against FRCS with R² = 0.997
        and mean absolute error under $2.10 per BDT. For typical California
        cluster configurations within the C-BREC catalog, FRED's
        predictions are dependable to within a few dollars per BDT. See{' '}
        <DocLink to='harvest-cost-method'>Harvest cost surrogate</DocLink> for the
        full validation details.
      </p>

      <Heading id='why-different-from-quote' level={3}>
        Why does FRED's cost differ from a contractor's quote?
      </Heading>
      <p>
        FRED reports engineering cost. Contractor quotes include stumpage
        payments, contract margin, overhead, and operational reserves that
        FRED does not model. A reasonable rule of thumb is that delivered
        contract pricing runs 15-25 percent higher than FRED's engineering
        cost. The difference is not a modeling error; it's the
        contractor's business overhead.
      </p>

      <Heading id='confidence-intervals' level={3}>
        Does FRED produce confidence intervals?
      </Heading>
      <p>
        Not as standard output. The surrogate's R² and MAE statistics
        give a global error estimate, but per-prediction intervals are
        not exposed in the chat interface. If you need formal uncertainty
        quantification for a specific procurement plan, email the team.
      </p>

      <Heading id='using-it' level={2}>
        Using FRED
      </Heading>

      <Heading id='how-long' level={3}>
        How long do queries take?
      </Heading>
      <p>
        Typical query time is 2 to 5 seconds for first-time queries and
        under 1 second for follow-ups that hit the cache. Complex multi-
        year projections in large radii can take up to 7 seconds.
      </p>

      <Heading id='conversation-memory' level={3}>
        How long does FRED remember a conversation?
      </Heading>
      <p>
        Within a session, FRED remembers everything you've said. Sessions
        time out after 24 hours of inactivity, after which the
        conversation is cleared. To revisit a prior analysis later, copy
        the recommendation or use the export option.
      </p>

      <Heading id='export-results' level={3}>
        Can I export results?
      </Heading>
      <p>
        Yes. FRED's chat interface includes export options for the
        recommendation card, supply curve, map snapshot, and cluster
        list. Exports are available in CSV, JSON, and PDF formats. For
        programmatic access to FRED's underlying data, contact the team.
      </p>

      <Heading id='research' level={2}>
        Research and citation
      </Heading>

      <Heading id='cite-fred' level={3}>
        How do I cite FRED in a paper?
      </Heading>
      <p>
        See <a href='#citing-fred'>Citing FRED</a> for the recommended
        citations. Cite the relevant prediction layer paper for specific
        methodology, or the umbrella thesis when referencing FRED as a
        system.
      </p>

      <Heading id='underlying-papers' level={3}>
        Where are the underlying papers?
      </Heading>
      <p>
        The harvest cost surrogate, transport circuity model, and CS-RAG
        architecture each have their own paper. Drafts and preprints are
        linked from the <a href='/'>FRED landing page</a> in the Research
        section.
      </p>

      <Heading id='reproduce-results' level={3}>
        Can I reproduce FRED's results outside the chat interface?
      </Heading>
      <p>
        Yes. The harvest cost surrogate is available as a standalone
        XGBoost model. The IDW transport raster is available as a GeoTIFF.
        The USDA FSim burn probability data is publicly available from
        USDA. Email{' '}
        <a href='mailto:contact@biofred.us'>contact@biofred.us</a> to
        request the artifacts for reproducibility.
      </p>

      <Callout kind='tip'>
        If your question isn't answered here, just ask FRED. Many
        questions about FRED's behavior, methodology, and outputs can be
        answered directly by the agent itself.
      </Callout>
    </>
  );
}
