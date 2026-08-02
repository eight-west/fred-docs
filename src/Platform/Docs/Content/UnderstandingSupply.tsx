import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const understandingSupplyToc = [
  { id: 'what-bdt-means', label: 'What BDT/year means' },
  { id: 'sustainable-yield', label: 'Sustainable annual yield' },
  { id: 'cluster-supply', label: 'Where the supply comes from' },
  { id: 'depletion', label: 'How depletion works' },
  { id: 'mw-to-bdt', label: 'Converting MW to BDT/year' }
];

export default function UnderstandingSupplyPage() {
  return (
    <>
      <PageTitle
        eyebrow='UNDERSTANDING THE NUMBERS'
        title='Supply: BDT/year'
        lede="What FRED's supply numbers represent, how to convert between facility capacity and biomass demand, and how depletion changes the picture over time."
      />

      <Heading id='what-bdt-means' level={2}>
        What BDT/year means
      </Heading>
      <p>
        FRED reports biomass supply in <strong>bone dry tons per year
        (BDT/year)</strong>. The "bone dry" part matters: this is biomass
        at zero moisture content. Green tons (wet weight) are roughly 1.5x
        to 2x larger numerically.
      </p>
      <p>
        When FRED says a region offers 42,300 BDT/year, that is the
        sustainable annual yield available to procurement, summed across
        all qualifying clusters in the region.
      </p>

      <Heading id='sustainable-yield' level={2}>
        Sustainable annual yield
      </Heading>
      <p>
        FRED's supply is <em>sustainable annual yield</em>, not inventory.
        The distinction is important. If FRED reports 42,000 BDT/year of
        supply within a procurement radius, it means you can harvest that
        amount year after year under the assigned prescriptions without
        depleting the long-term resource.
      </p>
      <p>
        However, this rests on two underlying assumptions:
      </p>
      <ul>
        <li>
          <strong>Prescriptions are followed.</strong> The C-BREC
          prescriptions specify thinning levels and rotation cycles. If
          treatments are heavier or more frequent than prescribed, the
          sustainable yield is lower.
        </li>
        <li>
          <strong>Forest growth meets historical projections.</strong> The
          underlying growth assumptions in C-BREC reflect long-run trends.
          Severe drought or fire events can disrupt this.
        </li>
      </ul>

      <Heading id='cluster-supply' level={2}>
        Where the supply comes from
      </Heading>
      <p>
        FRED's supply numbers aggregate across individual clusters. A
        cluster is a polygon over a small contiguous forest area, typically
        20 to 200 acres, with a specific prescription assigned. Each
        cluster contributes its harvestable yield (the
        <InlineCode>total_biomass_bdt</InlineCode> column in the underlying
        dataset).
      </p>
      <p>
        The cluster-level granularity matters when supply is spatially
        concentrated. A region with 1,200 small clusters spread evenly
        across terrain is operationally different from one with 200 large
        clusters concentrated in a few areas. FRED's response will note
        cluster count and average cluster size; pay attention to both,
        not just the total.
      </p>

      <Heading id='depletion' level={2}>
        How depletion works
      </Heading>
      <p>
        For multi-year projections, FRED models cluster depletion
        explicitly. Each cluster, when harvested, contributes its full
        <InlineCode>total_biomass_bdt</InlineCode> to that year's supply,
        then is removed from the available pool. The
        <InlineCode>total_biomass_bdt</InlineCode> value is already the
        harvestable yield under prescription, so depleting a cluster
        represents one full treatment visit rather than exhaustive
        stripping.
      </p>
      <p>
        Regrowth happens on much longer timescales (decades) than typical
        facility planning horizons (10-20 years), so FRED does not return
        clusters to the available pool within projection windows.
      </p>

      <Heading id='mw-to-bdt' level={2}>
        Converting MW to BDT/year
      </Heading>
      <p>
        Facility capacity is typically stated in MW; biomass demand is in
        BDT/year. The conversion depends on the technology type and
        operating efficiency. Approximate conversions for standard
        California biomass technologies:
      </p>
      <ul>
        <li>
          <strong>Generating Plant (GP)</strong>: roughly 1,800-2,200
          BDT/MW/year at typical capacity factors.
        </li>
        <li>
          <strong>Generating Plant Oversized (GPO)</strong>: roughly
          1,600-1,900 BDT/MW/year.
        </li>
        <li>
          <strong>Combined Heat and Power (CHP)</strong>: lower per-MW
          demand for electricity-equivalent output because heat recovery
          improves overall efficiency.
        </li>
      </ul>
      <p>
        Worked example: a 20MW GP facility at 2,000 BDT/MW/year requires
        40,000 BDT/year of biomass demand. FRED will size the procurement
        radius to meet roughly that target. If you specify capacity in MW,
        FRED applies the appropriate conversion automatically. If you
        prefer to control the math, specify BDT/year directly.
      </p>

      <Callout kind='tip'>
        For a more precise capacity-to-demand conversion, ask FRED
        explicitly: <em>"What's the biomass demand for a 20MW GP facility
        at 85% capacity factor?"</em> FRED applies the technology-specific
        conversion and shows the result before running the procurement
        analysis.
      </Callout>
    </>
  );
}
