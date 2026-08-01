import IntroductionPage, { introductionToc } from './Content/Introduction';
import FirstQueryPage, { firstQueryToc } from './Content/FirstQuery';
import ReadingAnswersPage, { readingAnswersToc } from './Content/Answers';
import ScopePage, { scopeToc } from './Content/Scope';

import CapabilitiesOverviewPage, {
  capabilitiesOverviewToc,
} from './Content/CapabilitiesOverview';
import FacilitySitingPage, {
  facilitySitingToc,
} from './Content/FacilitySiting';
import RegionalSupplyPage, {
  regionalSupplyToc,
} from './Content/RegionalSupply';
import FireTradeoffsPage, { fireTradeoffsToc } from './Content/FireTradeoffs';
import MultiYearPage, { multiYearToc } from './Content/MultiYear';
import ComparingLocationsPage, {
  comparingLocationsToc,
} from './Content/ComparingLocations';

import UnderstandingCostPage, {
  understandingCostToc,
} from './Content/UnderstandingCost';
import UnderstandingSupplyPage, {
  understandingSupplyToc,
} from './Content/UnderstandingSupply';
import UnderstandingFirePage, {
  understandingFireToc,
} from './Content/UnderstandingFire';
import UnderstandingTransportPage, {
  understandingTransportToc,
} from './Content/UnderstandingTransport';

import MethodologyOverviewPage, {
  methodologyOverviewToc,
} from './Content/MethodologyOverview';
import HarvestCostMethodPage, {
  harvestCostMethodToc,
} from './Content/HarvestCostMethod';
import TransportMethodPage, {
  transportMethodToc,
} from './Content/TransportMethod';
import FireMethodPage, { fireMethodToc } from './Content/FireMethod';

import GlossaryPage, { glossaryToc } from './Content/Glossary';
import FAQPage, { faqToc } from './Content/Faq';
import CitingFredPage, { citingFredToc } from './Content/CitingFred';

export type TocEntry = { id: string; label: string };

// Everything the build scripts need lives in pages.json; the registry only
// adds what cannot be serialised.
export type PageMeta = {
  slug: string;
  label: string;
  section: string;
  description: string;
};

export type PageEntry = PageMeta & {
  Component: () => JSX.Element;
  toc: TocEntry[];
};

const CONTENT: Record<string, { Component: () => JSX.Element; toc: TocEntry[] }> = {
  'introduction': { Component: IntroductionPage, toc: introductionToc },
  'first-query': { Component: FirstQueryPage, toc: firstQueryToc },
  'reading-answers': { Component: ReadingAnswersPage, toc: readingAnswersToc },
  'scope': { Component: ScopePage, toc: scopeToc },
  'capabilities-overview': { Component: CapabilitiesOverviewPage, toc: capabilitiesOverviewToc },
  'facility-siting': { Component: FacilitySitingPage, toc: facilitySitingToc },
  'regional-supply': { Component: RegionalSupplyPage, toc: regionalSupplyToc },
  'fire-tradeoffs': { Component: FireTradeoffsPage, toc: fireTradeoffsToc },
  'multi-year': { Component: MultiYearPage, toc: multiYearToc },
  'comparing-locations': { Component: ComparingLocationsPage, toc: comparingLocationsToc },
  'understanding-cost': { Component: UnderstandingCostPage, toc: understandingCostToc },
  'understanding-supply': { Component: UnderstandingSupplyPage, toc: understandingSupplyToc },
  'understanding-fire': { Component: UnderstandingFirePage, toc: understandingFireToc },
  'understanding-transport': { Component: UnderstandingTransportPage, toc: understandingTransportToc },
  'methodology-overview': { Component: MethodologyOverviewPage, toc: methodologyOverviewToc },
  'harvest-cost-method': { Component: HarvestCostMethodPage, toc: harvestCostMethodToc },
  'transport-method': { Component: TransportMethodPage, toc: transportMethodToc },
  'fire-method': { Component: FireMethodPage, toc: fireMethodToc },
  'glossary': { Component: GlossaryPage, toc: glossaryToc },
  'faq': { Component: FAQPage, toc: faqToc },
  'citing-fred': { Component: CitingFredPage, toc: citingFredToc },
};

export const PAGES: PageEntry[] = [
  // Getting started: what FRED is, how to use it, what to expect
  {
    slug: 'introduction',
    label: 'Introduction',
    section: 'Getting started',
    description:
      'What FRED is, the kind of question it answers, and how a conversational agent over spatial models differs from a GIS dashboard.',
    Component: IntroductionPage,
    toc: introductionToc,
  },
  {
    slug: 'first-query',
    label: 'Your first query',
    section: 'Getting started',
    description:
      'How to phrase a first question to FRED, what to include in it, and the mistakes that produce vague answers.',
    Component: FirstQueryPage,
    toc: firstQueryToc,
  },
  {
    slug: 'reading-answers',
    label: "Reading FRED's answers",
    section: 'Getting started',
    description:
      'How to read a FRED answer: the headline number, the map, the supply curve, the justification, and when to trust the result.',
    Component: ReadingAnswersPage,
    toc: readingAnswersToc,
  },
  {
    slug: 'scope',
    label: "What FRED can and can't do",
    section: 'Getting started',
    description:
      'What FRED handles well, where its coverage is partial, what sits outside its scope, and what is on the roadmap.',
    Component: ScopePage,
    toc: scopeToc,
  },

  // Capabilities: the kinds of queries FRED handles
  {
    slug: 'capabilities-overview',
    label: 'Overview',
    section: 'Capabilities',
    description:
      'What FRED can be asked to do, and how siting, regional supply, multi-year planning and fire-aware runs differ.',
    Component: CapabilitiesOverviewPage,
    toc: capabilitiesOverviewToc,
  },
  {
    slug: 'facility-siting',
    label: 'Facility siting',
    section: 'Capabilities',
    description:
      'Ask FRED where to site a biomass facility: how to phrase the question, what comes back, and how the ranking is decided.',
    Component: FacilitySitingPage,
    toc: facilitySitingToc,
  },
  {
    slug: 'regional-supply',
    label: 'Regional supply analysis',
    section: 'Capabilities',
    description:
      'Estimate how much biomass a region can supply each year, at county, watershed or custom-radius aggregation.',
    Component: RegionalSupplyPage,
    toc: regionalSupplyToc,
  },
  {
    slug: 'fire-tradeoffs',
    label: 'Fire-risk tradeoffs',
    section: 'Capabilities',
    description:
      'Trade feedstock cost against fire-risk reduction, read the Pareto curve, and find the leverage knee.',
    Component: FireTradeoffsPage,
    toc: fireTradeoffsToc,
  },
  {
    slug: 'multi-year',
    label: 'Multi-year planning',
    section: 'Capabilities',
    description:
      'Plan procurement across several years, including the depletion model and the sawtooth pattern in the trajectory.',
    Component: MultiYearPage,
    toc: multiYearToc,
  },
  {
    slug: 'comparing-locations',
    label: 'Comparing locations',
    section: 'Capabilities',
    description:
      'Put candidate sites side by side and interpret the differences FRED reports between them.',
    Component: ComparingLocationsPage,
    toc: comparingLocationsToc,
  },

  // Understanding the numbers: interpreting outputs
  {
    slug: 'understanding-cost',
    label: 'Cost: $/BDT and LCOE',
    section: 'Understanding the numbers',
    description:
      'What $/BDT and LCOE mean in a FRED answer, what drives them, and how they compare with published figures.',
    Component: UnderstandingCostPage,
    toc: understandingCostToc,
  },
  {
    slug: 'understanding-supply',
    label: 'Supply: BDT/year',
    section: 'Understanding the numbers',
    description:
      'What BDT/year means, how sustainable annual yield is derived, and how to turn a MW target into a feedstock requirement.',
    Component: UnderstandingSupplyPage,
    toc: understandingSupplyToc,
  },
  {
    slug: 'understanding-fire',
    label: 'Fire risk and alpha',
    section: 'Understanding the numbers',
    description:
      'Burn probability, the four fire-risk tiers, the alpha weighting knob, and how the fire score is computed.',
    Component: UnderstandingFirePage,
    toc: understandingFireToc,
  },
  {
    slug: 'understanding-transport',
    label: 'Transport circuity',
    section: 'Understanding the numbers',
    description:
      'The circuity factor, the five circuity zones, the short-route paradox, and how to read the circuity overlay.',
    Component: UnderstandingTransportPage,
    toc: understandingTransportToc,
  },

  // Methodology: the research behind the predictions
  {
    slug: 'methodology-overview',
    label: 'Overview',
    section: 'Methodology',
    description:
      'The three spatial prediction layers behind FRED, the data sources they are built from, and how they compose into an answer.',
    Component: MethodologyOverviewPage,
    toc: methodologyOverviewToc,
  },
  {
    slug: 'harvest-cost-method',
    label: 'Harvest cost surrogate',
    section: 'Methodology',
    description:
      'The surrogate model that stands in for the harvest cost simulation: training data, two-stage architecture, and validation results.',
    Component: HarvestCostMethodPage,
    toc: harvestCostMethodToc,
  },
  {
    slug: 'transport-method',
    label: 'Transport circuity model',
    section: 'Methodology',
    description:
      'How truck routing is modelled: the OSRM profile, the 445,000 sampled routes, and IDW interpolation between them.',
    Component: TransportMethodPage,
    toc: transportMethodToc,
  },
  {
    slug: 'fire-method',
    label: 'Fire-aware Pareto framework',
    section: 'Methodology',
    description:
      'The fire-aware Pareto framework: USDA FSim as the input, the objective function, and how the curve is computed.',
    Component: FireMethodPage,
    toc: fireMethodToc,
  },

  // Reference: glossary, FAQ, citations
  {
    slug: 'glossary',
    label: 'Glossary',
    section: 'Reference',
    description:
      'Definitions of the terms FRED uses, from bone-dry tonne to sustainable annual yield.',
    Component: GlossaryPage,
    toc: glossaryToc,
  },
  {
    slug: 'faq',
    label: 'FAQ',
    section: 'Reference',
    description:
      'Common questions about what FRED covers, how accurate it is, what it is for, and how to cite it.',
    Component: FAQPage,
    toc: faqToc,
  },
  {
    slug: 'citing-fred',
    label: 'Citing FRED',
    section: 'Reference',
    description:
      'How to cite FRED as a system and the individual model layers it is built from, with acknowledgments.',
    Component: CitingFredPage,
    toc: citingFredToc,
  },
];

export const SECTION_ORDER = [
  'Getting started',
  'Capabilities',
  'Understanding the numbers',
  'Methodology',
  'Reference',
];

