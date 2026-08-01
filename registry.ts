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

export type PageEntry = {
  slug: string;
  label: string;
  section: string;
  description: string;
  Component: () => JSX.Element;
  toc: { id: string; label: string }[];
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
    Component: UnderstandingSupplyPage,
    toc: understandingSupplyToc,
  },
  {
    slug: 'understanding-fire',
    label: 'Fire risk and alpha',
    section: 'Understanding the numbers',
    Component: UnderstandingFirePage,
    toc: understandingFireToc,
  },
  {
    slug: 'understanding-transport',
    label: 'Transport circuity',
    section: 'Understanding the numbers',
    Component: UnderstandingTransportPage,
    toc: understandingTransportToc,
  },

  // Methodology: the research behind the predictions
  {
    slug: 'methodology-overview',
    label: 'Overview',
    section: 'Methodology',
    Component: MethodologyOverviewPage,
    toc: methodologyOverviewToc,
  },
  {
    slug: 'harvest-cost-method',
    label: 'Harvest cost surrogate',
    section: 'Methodology',
    Component: HarvestCostMethodPage,
    toc: harvestCostMethodToc,
  },
  {
    slug: 'transport-method',
    label: 'Transport circuity model',
    section: 'Methodology',
    Component: TransportMethodPage,
    toc: transportMethodToc,
  },
  {
    slug: 'fire-method',
    label: 'Fire-aware Pareto framework',
    section: 'Methodology',
    Component: FireMethodPage,
    toc: fireMethodToc,
  },

  // Reference: glossary, FAQ, citations
  {
    slug: 'glossary',
    label: 'Glossary',
    section: 'Reference',
    Component: GlossaryPage,
    toc: glossaryToc,
  },
  {
    slug: 'faq',
    label: 'FAQ',
    section: 'Reference',
    Component: FAQPage,
    toc: faqToc,
  },
  {
    slug: 'citing-fred',
    label: 'Citing FRED',
    section: 'Reference',
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

