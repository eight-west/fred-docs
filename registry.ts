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
import pages from './pages.json';

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

export const PAGES: PageEntry[] = (pages as PageMeta[]).map(p => ({
  ...p,
  ...CONTENT[p.slug]
}));

export const SECTION_ORDER = [
  'Getting started',
  'Capabilities',
  'Understanding the numbers',
  'Methodology',
  'Reference',
];

