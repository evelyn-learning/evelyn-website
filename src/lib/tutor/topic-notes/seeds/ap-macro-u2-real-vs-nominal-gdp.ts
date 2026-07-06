/**
 * AP Macroeconomics — Unit 2 CED 2.6: Real vs. Nominal GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.real-vs-nominal-gdp.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_REAL_VS_NOMINAL_GDP: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.real-vs-nominal-gdp.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.6',
  cedTitle: 'Real vs. Nominal GDP',
  planId: 'evelyn.ap.macro.real-vs-nominal-gdp.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.real-vs-nominal-gdp.v1' }],
  theory: [
    { loId: 'apmacro.real-vs-nominal-gdp', content: `NOMINAL GDP: GDP measured at CURRENT-YEAR prices. Includes BOTH the change in physical output AND the change in prices. A 6% rise in nominal GDP could be 6% real growth and 0% inflation, OR 0% real growth and 6% inflation, OR any split.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `REAL GDP: GDP measured at BASE-YEAR (constant) prices. Strips out the price-level change so what remains is just the change in physical output.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `CONVERSION FORMULA: REAL GDP = (NOMINAL GDP / GDP DEFLATOR) × 100. The deflator captures the price-level change since the base year; dividing nominal by deflator (and scaling by 100) deflates back to base-year prices.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `EQUIVALENTLY: GDP DEFLATOR = (NOMINAL GDP / REAL GDP) × 100. Two ways to express the same identity. AP exam questions often give two of (nominal, real, deflator) and ask for the third.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `BASE YEAR: real GDP at the base year EQUALS nominal GDP at the base year, since prices are unchanged from themselves. Equivalently: GDP deflator in the base year = 100 by definition.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `REAL GDP GROWTH RATE: (Real GDP_new − Real GDP_old) / Real GDP_old × 100. This is the standard economic-growth measure. "GDP grew 2.5%" almost always means REAL GDP grew 2.5%.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `PER-CAPITA GDP for cross-country / cross-time comparison: Real GDP / population. Captures how much the AVERAGE person produces, controlling for both price level and population size.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `WHY REAL GDP MATTERS: comparing nominal GDP across years is misleading because of inflation. Real GDP isolates physical output growth. When evaluating policy effects, when comparing eras, when forecasting living standards — real is the right number.` },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'nominal GDP', content: 'GDP at current-year prices — combines output and price changes.' },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'real GDP', content: `GDP at constant base-year prices — output changes only, price effects stripped out.` },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'GDP deflator', content: 'a price index = (Nominal GDP / Real GDP) × 100.' },
  ],
  methods: [
    {
      title: 'Worked real gdp',
      steps: [
        `STEP 1 — REAL GDP 2026 = (Nominal / Deflator) × 100 = ($660 / 110) × 100 = $600B.`,
        'STEP 2 — REAL GROWTH 2020→2026: (600 − 560) / 560 × 100 ≈ 7.14% over 6 years.',
        `STEP 3 — NOMINAL GROWTH 2020→2026: nominal in 2020 equals real in 2020 (base year, deflator = 100): $560B. Nominal growth = (660 − 560) / 560 × 100 ≈ 17.86%.`,
        `STEP 4 — DIFFERENCE: nominal grew ~17.86%, real grew only ~7.14%. The remaining ~10.72% is the price-level change (deflator went from 100 to 110, a 10% increase).`,
        `STEP 5 — INTERPRET. The economy ACTUALLY grew about 7% in real output over 6 years (about 1.15% per year compounded). The remaining 10% of nominal growth was just inflation. If we used nominal GDP to evaluate this country's economic performance, we'd overstate the gain by more than 2x.`,
      ],
      example: { problem: `A country reports: Nominal GDP 2026 = $660B; GDP deflator 2026 = 110 (with 2020 as base year, deflator = 100). Real GDP 2020 was $560B. (a) Compute real GDP for 2026. (b) Compute the cumulative real GDP growth from 2020 to 2026. (c) Compare to the nominal GDP growth — what does the difference tell you?`, solution: `Real GDP 2026 = $600B. Real growth ≈ 7.14%; nominal growth ≈ 17.86%. The 10.7 pp gap is inflation.` },
      relatedLoIds: ['apmacro.real-vs-nominal-gdp'],
    },
  ],
  pointers: [
    { content: 'Real GDP = (Nominal / Deflator) × 100. Deflator = (Nominal / Real) × 100.', kind: 'tip' },
    { content: 'In the base year, Real = Nominal and Deflator = 100.', kind: 'tip' },
    { content: 'Real GDP isolates physical output. Nominal mixes output + prices.', kind: 'tip' },
    { content: 'Economic growth = REAL GDP growth, not nominal.', kind: 'tip' },
    { content: 'Real growth ≈ nominal growth − inflation (for small rates).', kind: 'tip' },
  ],
};
