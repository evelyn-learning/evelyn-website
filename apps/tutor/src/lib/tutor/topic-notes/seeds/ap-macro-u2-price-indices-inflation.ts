/**
 * AP Macroeconomics — Unit 2 CED 2.4: Price Indices and Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.price-indices-inflation.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.price-indices-inflation.v1' }],
  theory: [
    { loId: 'apmacro.price-indices-inflation', content: `CONSUMER PRICE INDEX (CPI): the average price level for a FIXED BASKET of consumer goods and services, tracked by comparing what that same basket costs now versus in a chosen BASE YEAR.` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI FORMULA: $\\text{CPI}_t = \\frac{\\text{cost of basket in year } t}{\\text{cost of basket in base year}} \\times 100$. CPI in the base year is exactly 100 by definition.` },
    { loId: 'apmacro.price-indices-inflation', content: `INFLATION RATE between two periods: $\\pi = \\frac{\\text{CPI}_{new} - \\text{CPI}_{old}}{\\text{CPI}_{old}} \\times 100$. CPI is a LEVEL; inflation is the percentage CHANGE in that level.` },
    { loId: 'apmacro.price-indices-inflation', content: `BASKET-COST MECHANICS: multiply each good's basket QUANTITY by its price that year, sum across goods. The quantities stay FIXED at the basket weights; only the prices change between years.` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI vs GDP DEFLATOR — the BASKET differs. CPI: FIXED basket of goods bought by typical urban consumers (Laspeyres-style). GDP deflator: the CURRENT year's mix of ALL goods produced domestically (Paasche-style).` },
    { loId: 'apmacro.price-indices-inflation', content: `COVERAGE CONSEQUENCES: (a) IMPORTED consumer goods are in the CPI but NOT in the deflator (deflator covers domestic production only) — when import prices surge, CPI rises faster. (b) Capital goods, government purchases, and exports are in the DEFLATOR but not in the CPI (consumer-only). (c) The fixed CPI basket misses consumer SUBSTITUTION away from goods whose prices rose; the deflator's current-mix weights capture it.` },
    { loId: 'apmacro.price-indices-inflation', content: `CPI BIASES — CPI tends to OVERSTATE true cost-of-living inflation by roughly half a point to a point per year: (1) SUBSTITUTION BIAS — fixed basket ignores shifts toward relatively cheaper goods; (2) QUALITY BIAS — a much-better product at the same price reads as "no change"; (3) NEW-GOOD BIAS — innovations enter the basket years late, missing early price declines.` },
    { loId: 'apmacro.price-indices-inflation', content: `INTERPRETING A CPI NUMBER: a CPI of about 128 (base 100) means the basket costs roughly twenty-eight percent more than in the base year; a household with unchanged nominal income has lost about that much purchasing power.` },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'CPI', content: `Consumer Price Index — the cost of a fixed basket of consumer goods relative to its base-year cost, scaled to 100.` },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'inflation rate', content: `the percentage change in a price index from one period to the next.` },
    { loId: 'apmacro.price-indices-inflation', kind: 'definition', title: 'GDP deflator', content: `a price index covering all domestically produced goods, using the current year's output mix as weights.` },
  ],
  methods: [
    {
      title: 'Compute CPI and the inflation rate from a basket',
      steps: [
        `STEP 1 — COST OF BASKET, BASE YEAR: sum quantity × price for each good at base-year prices.`,
        `STEP 2 — COST OF BASKET, CURRENT YEAR: same fixed quantities × current-year prices.`,
        `STEP 3 — CPI (current) = (current cost / base cost) × 100. Base-year CPI = 100 automatically.`,
        `STEP 4 — INFLATION RATE = (CPI new − CPI old) / CPI old × 100.`,
        `STEP 5 — INTERPRET: the percentage tells how much more the same basket costs — equivalently, the purchasing-power loss for an unchanged nominal income.`,
      ],
      example: {
        problem: `Basket: ten loaves of bread, five gallons of milk, four pairs of shoes. Base-year prices: bread two dollars, milk three, shoes forty. Current prices: bread three, milk four, shoes fifty. Find the basket costs, the current CPI, and cumulative inflation.`,
        solution: `Base cost = $\\,10(2) + 5(3) + 4(40) = 195$ dollars. Current cost = $\\,10(3) + 5(4) + 4(50) = 250$ dollars. CPI = $\\tfrac{250}{195} \\times 100 \\approx 128.2$. Inflation = $\\tfrac{128.2 - 100}{100} \\times 100 \\approx 28.2\\%$ — the basket costs about twenty-eight percent more than in the base year.`,
      },
      relatedLoIds: ['apmacro.price-indices-inflation'],
    },
  ],
  pointers: [
    { content: 'CPI = (basket cost in year t / base-year cost) × 100; base year is always exactly 100.', kind: 'tip' },
    { content: 'Inflation = percentage CHANGE in the index — CPI is a level, inflation is its growth rate.', kind: 'tip' },
    { content: 'Basket quantities stay FIXED across years — only prices change in the computation.', kind: 'tip' },
    { content: 'CPI includes imports and only consumer goods; the deflator is domestic-production-only but covers everything produced.', kind: 'tip' },
    { content: 'CPI overstates inflation: substitution, quality, and new-good biases.', kind: 'tip' },
  ],
};
