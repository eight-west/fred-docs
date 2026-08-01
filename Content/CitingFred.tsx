import { Heading, CodeBlock, Callout, PageTitle } from '../Prose';

export const citingFredToc = [
  { id: 'when-to-cite', label: 'When to cite' },
  { id: 'citing-fred-as-system', label: 'Citing FRED as a system' },
  { id: 'citing-individual-layers', label: 'Citing individual layers' },
  { id: 'acknowledgments', label: 'Acknowledgments' }
];

export default function CitingFredPage() {
  return (
    <>
      <PageTitle
        eyebrow='REFERENCE'
        title='Citing FRED'
        lede="If FRED's outputs appear in a paper, report, or policy analysis, please cite the appropriate primary sources. This page lists the recommended citations and when to use which."
      />

      <Heading id='when-to-cite' level={2}>
        When to cite
      </Heading>
      <p>
        Cite the relevant underlying paper when your analysis depends on a
        specific FRED component. Cite the umbrella thesis when discussing FRED
        as a system or when citing the CS-RAG architecture itself.
      </p>
      <ul>
        <li>
          If you use the harvest cost surrogate's predictions, cite the harvest
          cost paper.
        </li>
        <li>
          If you use the transport circuity raster or analysis, cite the
          transport paper.
        </li>
        <li>
          If you use the fire-aware Pareto framework or the leverage analysis,
          cite the fire procurement paper.
        </li>
        <li>
          If you use FRED as a workflow tool or reference the agentic
          architecture, cite the thesis or CS-RAG paper.
        </li>
      </ul>

      <Heading id='citing-fred-as-system' level={2}>
        Citing FRED as a system
      </Heading>
      <p>
        For citing FRED as a software tool or decision-support system, use the
        thesis as the primary reference:
      </p>
      <CodeBlock
        lang='bash'
        filename='BibTeX'
        code={`@mastersthesis{bandivadekar2026fred,
  author = {Bandivadekar, Aunsh},
  title  = {Agentic Decision Support via Spatial Prediction Layers
           for Forest Biomass Procurement in California},
  school = {University of California, Davis},
  year   = {2026}
}`}
      />

      <Heading id='citing-individual-layers' level={2}>
        Citing individual layers
      </Heading>
      <p>
        For specific prediction layers, cite the relevant paper. The canonical
        references are listed below. Pre-print drafts and published versions are
        accessible through the <a href='/'>FRED landing page</a>.
      </p>

      <Heading id='transport-cite' level={3}>
        Transport circuity model
      </Heading>
      <CodeBlock
        lang='bash'
        filename='BibTeX'
        code={`@unpublished{bandivadekar2026transport,
  author = {Bandivadekar, A., Yeo, B. L., Marvinney, E.},
  title  = {Characterizing Road Network Circuity Across
           Diverse Topography},
  year   = {2026},
  note   = {Manuscript submitted for publication; under review}
}`}
      />
      <Heading id='fire-cite' level={3}>
        Fire-aware Pareto framework
      </Heading>
      <CodeBlock
        lang='bash'
        filename='BibTeX'
        code={`@unpublished{bandivadekar2026fire,
        author = {Bandivadekar, A. and Yeo, B. L.},
        title  = {Fire-Aware Pareto Framework for Multi-Objective
           Forest Biomass Procurement},
        year   = {2026},
        note   = {Forthcoming}
}`}
      />

      <Heading id='csrag-cite' level={3}>
        CS-RAG architecture
      </Heading>
      <CodeBlock
        lang='bash'
        filename='BibTeX'
        code={`@inproceedings{bandivadekar2026csrag,
        author    = {Bandivadekar A, Yeo B.L., Ahamed Md, Li L},
        title     = {Compositional Spatial RAG: An Agentic Architecture
              for Spatial Decision Support},
        note     = {Forthcoming},
        year      = {2026}
}`}
      />

      <Heading id='acknowledgments' level={2}>
        Acknowledgments
      </Heading>
      <p>
        If FRED contributed materially to your work, a brief acknowledgment is
        appreciated. Example wording:
      </p>
      <Callout kind='info'>
        <em>
          "Procurement analysis was conducted using FRED, developed by
          Bandivadekar et al."
        </em>
      </Callout>
      <p>
        For policy reports or industry publications where formal citation is
        less common, please at least name FRED and link to{' '}
        <a href='https://biofred.us'>biofred.us</a>.
      </p>
    </>
  );
}
