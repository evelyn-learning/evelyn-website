/**
 * AP Macroeconomics — Unit 2 CED 2.4: Price Indices and Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.price-indices-inflation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_PRICE_INDICES_INFLATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.price-indices-inflation.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Price Indices and Inflation',
  planId: 'evelyn.ap.macro.price-indices-inflation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.price-indices-inflation.v1' }],
  theory: [
    { loId: 'apmacro.price-indices-inflation', content: `CONSUMER PRICE INDEX (CPI): a measure of the average price level for a fixed BASKET of consumer goods/services. Computed by tracking what that same basket costs this year vs in a chosen BASE YEAR.` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI FORMULA: CPI_t = (Cost of basket in year t / Cost of basket in base year) × 100. CPI in the base year is 100 by definition.` },
    { loId: 'apmacro.price-indices-inflation', content: `INFLATION RATE between two periods = (CPI_new − CPI_old) / CPI_old × 100. Express as percent.` },
    { loId: 'apmacro.price-indices-inflation', content: `EXAMPLE: if CPI is 100 in 2020 (base) and 112 in 2024, inflation 2020-to-2024 is (112 − 100)/100 = 12%. Annualized inflation per year ≈ 2.87% (compounded over 4 years).` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI vs GDP DEFLATOR: both measure price-level changes, but they differ in BASKET. CPI uses a FIXED BASKET of goods bought by typical urban consumers. GDP DEFLATOR uses the CURRENT year's mix of all goods produced domestically. CPI is a Laspeyres-style fixed-basket index; deflator is Paasche-style current-basket.` },
    { loId: 'apmacro.price-indices-inflation', content: `CONSEQUENCES OF THE DIFFERENCE: (a) imported goods (e.g. foreign cars) appear in CPI but NOT in GDP deflator (deflator covers domestic production only). (b) Capital goods + government services appear in deflator but not in CPI (CPI is consumer-only). (c) The fixed CPI basket overstates inflation when consumers substitute away from goods whose prices rose; the deflator captures substitution.` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI BIAS: substitution bias (fixed basket misses substitution), quality bias (improvements not fully captured), new-good bias (lag in adding new goods to the basket). All make CPI tend to OVERSTATE true inflation by ~0.5-1 percentage point per year, by most estimates.` },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'CPI', content: `Consumer Price Index — the cost of a fixed basket of consumer goods relative to its cost in a base year, scaled to 100.` },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'inflation rate', content: 'the percentage change in a price index from one period to the next.' },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'GDP deflator', content: `a price index covering all domestically produced goods, using the current year's mix as weights.` },
  ],
  methods: [
    {
      title: 'Worked cpi',
      steps: [
        `STEP 1 — COST OF BASKET in 2020: (10 × $2) + (5 × $3) + (4 × $40) = $20 + $15 + $160 = $195.`,
        `STEP 2 — COST OF BASKET in 2026: (10 × $3) + (5 × $4) + (4 × $50) = $30 + $20 + $200 = $250.`,
        `STEP 3 — CPI 2020 (base) = 100 by definition. CPI 2026 = ($250 / $195) × 100 ≈ 128.21.`,
        `STEP 4 — INFLATION RATE 2020→2026: (CPI_new − CPI_old) / CPI_old × 100 = (128.21 − 100) / 100 × 100 = 28.21%.`,
        `STEP 5 — INTERPRET. The basket of consumer goods costs about 28% more in 2026 than in 2020. If a household earned the same nominal income, their REAL purchasing power has fallen by about 28%. (Annualized over 6 years: roughly 4.2% per year compounded.)`,
      ],
      example: { problem: `A simplified economy's basket: 10 loaves of bread, 5 gallons of milk, 4 pairs of shoes. Prices in 2020 (base year): bread $2, milk $3, shoes $40. Prices in 2026: bread $3, milk $4, shoes $50. Compute (a) the cost of the basket in each year, (b) CPI in 2026, (c) the cumulative inflation rate 2020→2026.`, solution: `Basket: $195 (2020), $250 (2026). CPI 2026 ≈ 128.21. Cumulative inflation 28.21%.` },
      relatedLoIds: ['apmacro.price-indices-inflation'],
    },
  ],
  pointers: [
    { content: 'CPI = (cost of basket in year t / cost of basket in base year) × 100.', kind: 'tip' },
    { content: 'Inflation rate = (CPI_new − CPI_old) / CPI_old × 100.', kind: 'tip' },
    { content: 'CPI: fixed basket, consumer goods, includes imports.', kind: 'tip' },
    { content: 'GDP deflator: current-year basket, all domestic production, no imports.', kind: 'tip' },
    { content: `CPI tends to OVERSTATE true inflation due to substitution / quality / new-good biases.`, kind: 'tip' },
  ],
};
