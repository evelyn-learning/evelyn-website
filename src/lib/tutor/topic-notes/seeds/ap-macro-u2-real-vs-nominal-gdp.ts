/**
 * AP Macroeconomics — Unit 2 CED 2.6: Real vs. Nominal GDP.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.real-vs-nominal-gdp.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.real-vs-nominal-gdp.v1' }],
  theory: [
    { loId: 'apmacro.real-vs-nominal-gdp', content: `NOMINAL GDP: GDP at CURRENT-YEAR prices. It mixes TWO changes — physical output and prices. A six percent nominal rise could be all real growth, all inflation, or any split; nominal alone cannot tell you the economy grew.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `REAL GDP: GDP at BASE-YEAR (constant) prices. The price-level change is stripped out, leaving only the change in physical output. "The economy grew" in economics ALWAYS means REAL GDP grew.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `CONVERSION FORMULA: $\\text{Real GDP} = \\frac{\\text{Nominal GDP}}{\\text{GDP deflator}} \\times 100$. Dividing by the deflator "deflates" current prices back to base-year prices.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `EQUIVALENT FORM: $\\text{GDP deflator} = \\frac{\\text{Nominal GDP}}{\\text{Real GDP}} \\times 100$. AP questions give two of {nominal, real, deflator} and ask for the third — the same identity rearranged.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `BASE-YEAR ANCHOR: in the base year, real GDP = nominal GDP and the deflator = 100 by definition (prices unchanged from themselves). Use this to recover the base-year real value when only nominal is given.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `REAL GDP GROWTH RATE: $g = \\frac{\\text{Real}_{new} - \\text{Real}_{old}}{\\text{Real}_{old}} \\times 100$. This is the standard economic-growth statistic — growth rates are always computed on REAL values.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `APPROXIMATION for small rates: real growth ≈ nominal growth − inflation. A deflator moving from 100 to 110 is a ten percent price rise; that much of nominal growth is "just inflation."` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `PER-CAPITA REAL GDP = real GDP / population — controls for both price level AND population size; the right measure for comparing average living standards across countries or eras.` },
    { loId: 'apmacro.real-vs-nominal-gdp', content: `WHY IT MATTERS: judging performance by nominal GDP overstates growth whenever inflation is positive — sometimes by a factor of two or more. Nominal can even RISE while real output FALLS if inflation is high enough (negative real growth masked by price increases).` },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'nominal GDP', content: `GDP at current-year prices — combines output and price changes.` },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'real GDP', content: `GDP at constant base-year prices — output changes only, price effects stripped out.` },
    { loId: 'apmacro.real-vs-nominal-gdp', kind: 'definition', title: 'GDP deflator', content: `a price index equal to (nominal GDP / real GDP) × 100; equals 100 in the base year.` },
  ],
  methods: [
    {
      title: 'Convert nominal to real GDP and separate real growth from inflation',
      steps: [
        `STEP 1 — REAL GDP = (nominal / deflator) × 100 for the current year. (Or deflator = nominal / real × 100 if the deflator is the unknown.)`,
        `STEP 2 — BASE-YEAR VALUES: real = nominal there, deflator = 100. Use this to pin the starting real value.`,
        `STEP 3 — REAL GROWTH = (real new − real old) / real old × 100.`,
        `STEP 4 — NOMINAL GROWTH = same formula on nominal values.`,
        `STEP 5 — DECOMPOSE: the gap between nominal and real growth ≈ the price-level change (deflator's percentage rise). State how much of the headline was inflation.`,
      ],
      example: {
        problem: `Nominal GDP is 660 billion dollars this year with a deflator of 110 (base year six years ago, deflator 100). Base-year real GDP was 560 billion dollars. Find current real GDP, cumulative real growth, and nominal growth.`,
        solution: `Real = $\\tfrac{660}{110} \\times 100 = 600$ billion dollars. Real growth = $\\tfrac{600-560}{560} \\approx 7.1\\%$. Base-year nominal = base-year real = 560, so nominal growth = $\\tfrac{660-560}{560} \\approx 17.9\\%$. The roughly ten-point gap is the price-level rise (deflator 100 → 110). Using nominal would overstate the true gain by more than double.`,
      },
      relatedLoIds: ['apmacro.real-vs-nominal-gdp'],
    },
  ],
  pointers: [
    { content: 'Real = (Nominal / Deflator) × 100; Deflator = (Nominal / Real) × 100 — one identity, two forms.', kind: 'tip' },
    { content: 'Base year: Real = Nominal, Deflator = 100. Use this anchor when only nominal is given.', kind: 'tip' },
    { content: 'Growth rates always use REAL values. "GDP grew" means real GDP grew.', kind: 'tip' },
    { content: 'Real growth ≈ nominal growth − inflation (small-rate approximation).', kind: 'tip' },
    { content: 'Rising nominal GDP proves nothing by itself — high inflation can hide a real contraction.', kind: 'tip' },
  ],
};
