import { Heading, Callout, InlineCode, PageTitle } from '../Prose';

export const understandingTransportToc = [
  { id: 'why-transport-matters', label: 'Why transport matters' },
  { id: 'circuity-factor', label: 'The circuity factor' },
  { id: 'the-five-zones', label: 'The five circuity zones' },
  { id: 'short-route-paradox', label: 'The short-route paradox' },
  { id: 'reading-the-overlay', label: 'Reading the circuity overlay' }
];

export default function UnderstandingTransportPage() {
  return (
    <>
      <PageTitle
        eyebrow='UNDERSTANDING THE NUMBERS'
        title='Transport: circuity and haul'
        lede="Transport is the single largest variable cost in biomass procurement. This page explains how FRED models it, what circuity zones mean, and why short hauls are sometimes more expensive than long ones."
      />

      <Heading id='why-transport-matters' level={2}>
        Why transport matters
      </Heading>
      <p>
        At the cost margins where biomass operations live, transport is
        often the deciding factor. A facility surrounded by abundant
        cheap-to-harvest biomass can still be uneconomic if the road
        network forces long, slow, switchback-heavy hauls.
      </p>
      <p>
        Conversely, two facilities with the same straight-line distance to
        their supply can have very different actual haul costs if one
        sits at the end of a well-graded state highway and the other has
        to navigate forest roads.
      </p>

      <Heading id='circuity-factor' level={2}>
        The circuity factor
      </Heading>
      <p>The circuity factor (CF) is defined as:</p>
      <Callout kind='info'>
        CF = actual road network distance / straight-line (Euclidean) distance
      </Callout>
      <p>
        A CF of 1.0 would mean a perfectly direct road; the truck drives
        exactly the straight-line distance. A CF of 2.0 means the truck
        drives twice the straight-line distance.
      </p>
      <p>
        Real California cluster origins have CFs ranging from about
        <strong> 1.15</strong> (Central Valley flatlands with grid road
        networks) to <strong>2.8+</strong> (remote Sierra terrain with
        switchback-heavy access roads). The variation is large and
        materially affects cost.
      </p>
      <p>
        FRED's transport model treats CF as an <em>origin location
        property</em>. Empirically, the origin location explains 87 percent
        of the variance in CF; the destination has a much smaller effect.
        This is why FRED can pre-compute a single CF value per cluster
        rather than per origin-destination pair.
      </p>

      <Heading id='the-five-zones' level={2}>
        The five circuity zones
      </Heading>
      <p>
        For interpretive purposes, FRED groups the continuous CF surface
        into five zones based on natural breaks in the distribution:
      </p>
      <ul>
        <li>
          <strong>Zone 1</strong> (CF 1.0 - 1.25): Central Valley and
          coastal flats. Best-case transport.
        </li>
        <li>
          <strong>Zone 2</strong> (CF 1.25 - 1.50): foothill transitions.
        </li>
        <li>
          <strong>Zone 3</strong> (CF 1.50 - 1.85): low Sierra and Coast
          Range. The most common zone for productive biomass.
        </li>
        <li>
          <strong>Zone 4</strong> (CF 1.85 - 2.30): high Sierra and Klamath
          terrain. Notable transport premium.
        </li>
        <li>
          <strong>Zone 5</strong> (CF 2.30 and above): remote mountain
          terrain. Transport often dominates cost.
        </li>
      </ul>
      <p>
        When FRED's recommendation includes a notable transport component,
        the dominant CF zone is usually the explanation.
      </p>

      <Heading id='short-route-paradox' level={2}>
        The short-route paradox
      </Heading>
      <p>
        A counterintuitive finding from FRED's transport research:{' '}
        <strong>short hauls have 65 percent higher circuity than long
        hauls</strong> on average.
      </p>
      <p>
        The explanation is the road network hierarchy. A short haul from
        a forest cluster to a nearby facility typically stays on
        low-class forest roads with many switchbacks for the entire trip.
        A long haul to a distant facility might also start on those
        switchback roads, but then transitions onto a state highway and
        runs nearly straight for most of the distance. The switchback
        segment becomes a small fraction of the total.
      </p>
      <p>
        Practical implication: a procurement plan that looks better on
        Euclidean distance (closer supply) can be worse on actual road
        cost because the shorter hauls have proportionally more
        switchbacks. FRED's transport model surfaces this in every
        recommendation.
      </p>

      <Heading id='reading-the-overlay' level={2}>
        Reading the circuity overlay
      </Heading>
      <p>
        When you enable the circuity overlay in FRED's chat interface, the
        map shows the five zones as color bands across the region. Useful
        patterns to look for:
      </p>
      <ul>
        <li>
          <strong>Sharp zone boundaries.</strong> These usually correspond
          to ridges or watershed divides where the road network changes
          character. Procurement that crosses a sharp boundary picks up
          significant transport cost.
        </li>
        <li>
          <strong>Isolated Zone 4 or 5 pockets.</strong> Visually small
          pockets of high circuity can be the right places to avoid even
          if the surrounding terrain is cheaper.
        </li>
        <li>
          <strong>Highway corridors.</strong> The state highway network
          appears as Zone 1-2 fingers extending into mountainous terrain.
          Sites near a highway often look operationally better than their
          terrain suggests.
        </li>
      </ul>

      <Callout kind='tip'>
        If you're considering two candidate sites that look similar on a
        map but FRED keeps preferring one, check the circuity overlay. The
        better site is usually closer to a highway corridor or in a more
        favorable circuity zone.
      </Callout>
    </>
  );
}
