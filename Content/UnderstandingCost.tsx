import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const understandingCostToc = [
  { id: 'what-the-number-means', label: 'What the number means' },
  { id: 'whats-included', label: "What's included" },
  { id: 'whats-not-included', label: "What's not included" },
  { id: 'cost-drivers', label: 'Cost drivers' },
  { id: 'comparing-numbers', label: 'Comparing FRED costs to elsewhere' }
];

export default function UnderstandingCostPage() {
  return (
    <>
      <PageTitle
        eyebrow='UNDERSTANDING THE NUMBERS'
        title='Cost: $/BDT and LCOE'
        lede="What FRED's cost numbers represent, what's included, what's not, and how to compare them to costs from other tools or contracts."
      />

      <Heading id='what-the-number-means' level={2}>
        What the number means
      </Heading>
      <p>
        FRED reports cost in dollars per bone-dry ton ($/BDT). When you see
        a headline like "$87.40/BDT," that is the volume-weighted average
        across all contributing clusters in the procurement plan.
      </p>
      <p>
        For multi-year analyses, FRED reports either the year-1 number or
        the 10-year levelized cost of energy (LCOE) in $/MWh, depending on
        which is more relevant to the question.
      </p>

      <Heading id='whats-included' level={2}>
        What's included
      </Heading>
      <p>FRED's $/BDT covers the engineering cost components:</p>
      <ul>
        <li>
          <strong>Harvest operations</strong>: felling, skidding/yarding,
          processing, loading. The specific cost varies by terrain class
          and harvesting system.
        </li>
        <li>
          <strong>Move-in and mobilization</strong>: the cost of getting
          equipment on-site, amortized over the cluster's harvestable
          volume.
        </li>
        <li>
          <strong>Transport</strong>: chip truck haul to the facility, using
          the road network distance from OSRM and the IDW-interpolated
          circuity factor.
        </li>
        <li>
          <strong>Equipment overhead</strong>: amortized capital cost of the
          harvesting and chipping equipment, expressed as an hourly cost
          built into FRCS.
        </li>
      </ul>

      <Heading id='whats-not-included' level={2}>
        What's not included
      </Heading>
      <p>
        FRED's cost is engineering cost. The following are not included
        because they are facility-specific, contract-specific, or beyond
        FRED's data scope:
      </p>
      <ul>
        <li>
          <strong>Stumpage payments</strong> to landowners. These vary by
          ownership type and contract.
        </li>
        <li>
          <strong>Permitting costs</strong>. Highly site-specific.
        </li>
        <li>
          <strong>Insurance and bonding</strong>.
        </li>
        <li>
          <strong>Office overhead, admin, and brokerage</strong> on top of
          the operational cost.
        </li>
        <li>
          <strong>Facility-side costs</strong>: receiving, secondary
          handling, storage. FRED's number arrives at the facility gate.
        </li>
        <li>
          <strong>Fuel price fluctuations</strong>. FRCS uses average diesel
          pricing. If current diesel is unusually high or low, real costs
          will differ.
        </li>
      </ul>
      <p>
        A reasonable rule of thumb: take FRED's $/BDT and add roughly 15-25
        percent for the full delivered cost including stumpage, overhead,
        and contract margin. This is approximate; real contracts have wide
        variance.
      </p>

      <Heading id='cost-drivers' level={2}>
        Cost drivers
      </Heading>
      <p>
        The harvest cost surrogate's feature-importance analysis shows the
        dominant cost drivers in order:
      </p>
      <ul>
        <li>
          <strong>Terrain class and harvesting system</strong> (~65 percent
          combined). The biggest single determinant.
        </li>
        <li>
          <strong>Biomass density per acre</strong> (~20 percent). Denser
          clusters amortize fixed costs better.
        </li>
        <li>
          <strong>Haul distance</strong> (~8 percent). Linear effect on
          transport.
        </li>
        <li>
          <strong>Cluster size and slope</strong> (remainder).
        </li>
        <li>
          <strong>Treatment type</strong> has minimal impact (about 1.1
          percent of LCOE variation). A counterintuitive but consistent
          finding.
        </li>
      </ul>

      <Heading id='comparing-numbers' level={2}>
        Comparing FRED costs to elsewhere
      </Heading>
      <p>
        Reasonable benchmarks for California biomass:
      </p>
      <ul>
        <li>
          The cheapest clusters in flat-terrain ground-based regions come in
          around $40-60/BDT at the facility gate.
        </li>
        <li>
          Typical mid-range procurement runs $75-105/BDT.
        </li>
        <li>
          Steep cable yarding can reach $130-170/BDT in remote terrain.
        </li>
        <li>
          Helicopter operations are typically $200+/BDT and only justified
          for high-value contexts.
        </li>
      </ul>
      <p>
        If FRED returns a number well outside this range for a specific
        location, it's worth asking why. Usually it's a terrain class
        you weren't expecting or a transport circuity zone that ramped up
        the haul cost. The justification paragraph will name the driver.
      </p>

      <Callout kind='info'>
        Industry quotes are usually delivered cost including contract
        margin. FRED's engineering cost will be lower than a delivered
        quote. The difference is the contractor's overhead and margin, not
        a modeling error.
      </Callout>
    </>
  );
}
