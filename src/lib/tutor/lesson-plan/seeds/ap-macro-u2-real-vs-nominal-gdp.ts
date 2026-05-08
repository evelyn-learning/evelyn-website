/**
 * AP Macroeconomics — CED Unit 2.6: Real vs. Nominal GDP.
 *
 * The deflator-adjusted GDP measure that lets us track real growth
 * vs price-level changes. AP heavily tests the formula: Real GDP =
 * Nominal GDP / GDP deflator × 100.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_REAL_VS_NOMINAL_GDP: LessonPlan = {
  id: 'evelyn.ap.macro.real-vs-nominal-gdp.v1',
  title: 'U2.6 Real vs. Nominal GDP',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.real-vs-nominal-gdp',
      description:
        'Convert between nominal and real GDP using the GDP deflator, compute real GDP growth rates, and explain why real GDP is the standard for tracking economic growth.',
      standard: 'AP-MACRO-2.6',
    },
  ],
  prerequisites: ['apmacro.costs-of-inflation'],
  followUps: ['apmacro.business-cycle'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish growing-because-prices-rose from growing-because-output-rose.',
      script:
        "Suppose nominal GDP rose 5 percent last year. Did the economy actually produce 5 percent more stuff? Maybe — or maybe prices rose 5 percent and real output didn't change. We need a way to strip out the inflation and isolate the change in REAL production. That is what real GDP does, and it is the number economists actually mean when they say 'the economy grew.'",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-real-nominal',
      kind: 'concept',
      goal: 'Cover the definitions, the deflator-adjustment formula, and why real GDP is the standard.',
      keyIdeas: [
        'NOMINAL GDP: GDP measured at CURRENT-YEAR prices. Includes BOTH the change in physical output AND the change in prices. A 6% rise in nominal GDP could be 6% real growth and 0% inflation, OR 0% real growth and 6% inflation, OR any split.',
        'REAL GDP: GDP measured at BASE-YEAR (constant) prices. Strips out the price-level change so what remains is just the change in physical output.',
        'CONVERSION FORMULA: REAL GDP = (NOMINAL GDP / GDP DEFLATOR) × 100. The deflator captures the price-level change since the base year; dividing nominal by deflator (and scaling by 100) deflates back to base-year prices.',
        'EQUIVALENTLY: GDP DEFLATOR = (NOMINAL GDP / REAL GDP) × 100. Two ways to express the same identity. AP exam questions often give two of (nominal, real, deflator) and ask for the third.',
        'BASE YEAR: real GDP at the base year EQUALS nominal GDP at the base year, since prices are unchanged from themselves. Equivalently: GDP deflator in the base year = 100 by definition.',
        'REAL GDP GROWTH RATE: (Real GDP_new − Real GDP_old) / Real GDP_old × 100. This is the standard economic-growth measure. "GDP grew 2.5%" almost always means REAL GDP grew 2.5%.',
        'PER-CAPITA GDP for cross-country / cross-time comparison: Real GDP / population. Captures how much the AVERAGE person produces, controlling for both price level and population size.',
        'WHY REAL GDP MATTERS: comparing nominal GDP across years is misleading because of inflation. Real GDP isolates physical output growth. When evaluating policy effects, when comparing eras, when forecasting living standards — real is the right number.',
      ],
      vocabulary: [
        { term: 'nominal GDP', definition: 'GDP at current-year prices — combines output and price changes.' },
        { term: 'real GDP', definition: 'GDP at constant base-year prices — output changes only, price effects stripped out.' },
        { term: 'GDP deflator', definition: 'a price index = (Nominal GDP / Real GDP) × 100.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-real-gdp',
      kind: 'worked_example',
      problem:
        'A country reports: Nominal GDP 2026 = $660B; GDP deflator 2026 = 110 (with 2020 as base year, deflator = 100). Real GDP 2020 was $560B. (a) Compute real GDP for 2026. (b) Compute the cumulative real GDP growth from 2020 to 2026. (c) Compare to the nominal GDP growth — what does the difference tell you?',
      steps: [
        'STEP 1 — REAL GDP 2026 = (Nominal / Deflator) × 100 = ($660 / 110) × 100 = $600B.',
        'STEP 2 — REAL GROWTH 2020→2026: (600 − 560) / 560 × 100 ≈ 7.14% over 6 years.',
        'STEP 3 — NOMINAL GROWTH 2020→2026: nominal in 2020 equals real in 2020 (base year, deflator = 100): $560B. Nominal growth = (660 − 560) / 560 × 100 ≈ 17.86%.',
        'STEP 4 — DIFFERENCE: nominal grew ~17.86%, real grew only ~7.14%. The remaining ~10.72% is the price-level change (deflator went from 100 to 110, a 10% increase).',
        'STEP 5 — INTERPRET. The economy ACTUALLY grew about 7% in real output over 6 years (about 1.15% per year compounded). The remaining 10% of nominal growth was just inflation. If we used nominal GDP to evaluate this country\'s economic performance, we\'d overstate the gain by more than 2x.',
      ],
      answer: 'Real GDP 2026 = $600B. Real growth ≈ 7.14%; nominal growth ≈ 17.86%. The 10.7 pp gap is inflation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-formula',
      kind: 'try_yourself',
      problem:
        'State the formula relating Real GDP, Nominal GDP, and GDP deflator. Then state in one sentence what each variable measures.',
      expectedAnswer:
        'Real GDP = (Nominal GDP / GDP deflator) × 100. Equivalently: GDP deflator = (Nominal GDP / Real GDP) × 100. NOMINAL GDP measures GDP at current-year prices — includes both output growth and price changes. REAL GDP measures GDP at constant base-year prices — output growth only. GDP DEFLATOR measures the price level — the percentage by which the nominal-to-real conversion deflates current-year prices back to base-year prices, scaled to 100.',
      responseFormat: 'free',
      hints: ['One formula has Real on the left; the other has the deflator. They are algebraically equivalent.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-real-gdp-compute',
      kind: 'try_yourself',
      problem:
        'A country reports for 2026: Nominal GDP = $1,400B; Real GDP (in 2020 dollars) = $1,250B. (a) Compute the GDP deflator for 2026. (b) The country\'s 2020 nominal GDP was $1,000B. Compute the real GDP growth rate from 2020 to 2026.',
      expectedAnswer:
        '(a) Deflator = (Nominal / Real) × 100 = (1400 / 1250) × 100 = 112. So prices in 2026 are 12% higher than in the 2020 base year. (b) Real GDP in 2020 (base year) = nominal in 2020 = $1,000B. Real growth 2020→2026 = (1250 − 1000) / 1000 × 100 = 25%. Annualized over 6 years ≈ 3.79% per year.',
      responseFormat: 'numeric',
      hints: [
        'Use Deflator = Nominal / Real × 100 for part (a).',
        'Remember: in the base year, Real = Nominal (deflator = 100).',
        'Growth rate uses real values, not nominal.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-real-vs-nominal-implication',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A country reports nominal GDP rising 8% one year. Without more information, can you conclude the economy is growing? If not, what additional information do you need? Explain.',
      expectedAnswer:
        'NO — you cannot conclude growth from nominal GDP alone. An 8% nominal rise could be: (a) 8% real growth + 0% inflation (genuinely strong growth), (b) 0% real growth + 8% inflation (no actual production increase, just prices rising), (c) any split in between (e.g. 3% real + 5% inflation), or (d) actual real CONTRACTION combined with very high inflation (e.g. -2% real + 10% inflation = 8% nominal). To assess true growth you need either the inflation rate (CPI or GDP deflator change) or directly the real GDP figure. Real GDP growth = nominal GDP growth − inflation rate (approximately, for small rates). Strong answers state explicitly that nominal growth conflates output and price effects, name the formula, and give one or two scenarios where the same nominal growth implies different real outcomes.',
      responseFormat: 'frq',
      hints: [
        'Could the same nominal growth correspond to different real outcomes?',
        'What would you need to disentangle output from prices?',
        'Try writing out a few scenarios that all yield 8% nominal growth.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Real GDP = (Nominal / Deflator) × 100. Deflator = (Nominal / Real) × 100.',
        'In the base year, Real = Nominal and Deflator = 100.',
        'Real GDP isolates physical output. Nominal mixes output + prices.',
        'Economic growth = REAL GDP growth, not nominal.',
        'Real growth ≈ nominal growth − inflation (for small rates).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.6',
    cedTitle: 'Real vs. Nominal GDP',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '6', note: 'OpenStax Macro AP — real-vs-nominal GDP, deflator formula.' },
    ],
  },
};
