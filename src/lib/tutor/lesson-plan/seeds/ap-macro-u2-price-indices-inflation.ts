/**
 * AP Macroeconomics — CED Unit 2.4: Price Indices and Inflation.
 *
 * CPI computation, inflation rate calculation, and the CPI-vs-deflator
 * distinction. Heavy on numerical worked examples — AP tests this with
 * almost arithmetic-only FRQs.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_PRICE_INDICES_INFLATION: LessonPlan = {
  id: 'evelyn.ap.macro.price-indices-inflation.v1',
  title: 'U2.4 Price Indices and Inflation',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.price-indices-inflation',
      description:
        'Compute the CPI from a basket of goods at base-year and current-year prices, compute the inflation rate from CPI changes, and distinguish the CPI from the GDP deflator.',
      standard: 'AP-MACRO-2.4',
    },
  ],
  prerequisites: ['apmacro.unemployment'],
  followUps: ['apmacro.costs-of-inflation'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make inflation feel measurable, not vibes-based.',
      script:
        "When you hear \"inflation was 3.2 percent last year,\" that is a specific calculation done by the Bureau of Labor Statistics. They track the price of a fixed BASKET of stuff a typical household buys, see how much that basket costs this year vs a base year, and turn it into an index. The inflation rate is just the year-over-year change in the index. Today we compute one ourselves.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cpi',
      kind: 'concept',
      goal: 'Cover CPI computation, inflation-rate formula, GDP deflator vs CPI distinction.',
      keyIdeas: [
        'CONSUMER PRICE INDEX (CPI): a measure of the average price level for a fixed BASKET of consumer goods/services. Computed by tracking what that same basket costs this year vs in a chosen BASE YEAR.',
        'CPI FORMULA: CPI_t = (Cost of basket in year t / Cost of basket in base year) × 100. CPI in the base year is 100 by definition.',
        'INFLATION RATE between two periods = (CPI_new − CPI_old) / CPI_old × 100. Express as percent.',
        'EXAMPLE: if CPI is 100 in 2020 (base) and 112 in 2024, inflation 2020-to-2024 is (112 − 100)/100 = 12%. Annualized inflation per year ≈ 2.87% (compounded over 4 years).',
        'CPI vs GDP DEFLATOR: both measure price-level changes, but they differ in BASKET. CPI uses a FIXED BASKET of goods bought by typical urban consumers. GDP DEFLATOR uses the CURRENT year\'s mix of all goods produced domestically. CPI is a Laspeyres-style fixed-basket index; deflator is Paasche-style current-basket.',
        'CONSEQUENCES OF THE DIFFERENCE: (a) imported goods (e.g. foreign cars) appear in CPI but NOT in GDP deflator (deflator covers domestic production only). (b) Capital goods + government services appear in deflator but not in CPI (CPI is consumer-only). (c) The fixed CPI basket overstates inflation when consumers substitute away from goods whose prices rose; the deflator captures substitution.',
        'CPI BIAS: substitution bias (fixed basket misses substitution), quality bias (improvements not fully captured), new-good bias (lag in adding new goods to the basket). All make CPI tend to OVERSTATE true inflation by ~0.5-1 percentage point per year, by most estimates.',
      ],
      vocabulary: [
        { term: 'CPI', definition: 'Consumer Price Index — the cost of a fixed basket of consumer goods relative to its cost in a base year, scaled to 100.' },
        { term: 'inflation rate', definition: 'the percentage change in a price index from one period to the next.' },
        { term: 'GDP deflator', definition: 'a price index covering all domestically produced goods, using the current year\'s mix as weights.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cpi',
      kind: 'worked_example',
      problem:
        "A simplified economy's basket: 10 loaves of bread, 5 gallons of milk, 4 pairs of shoes. Prices in 2020 (base year): bread $2, milk $3, shoes $40. Prices in 2026: bread $3, milk $4, shoes $50. Compute (a) the cost of the basket in each year, (b) CPI in 2026, (c) the cumulative inflation rate 2020→2026.",
      steps: [
        'STEP 1 — COST OF BASKET in 2020: (10 × $2) + (5 × $3) + (4 × $40) = $20 + $15 + $160 = $195.',
        'STEP 2 — COST OF BASKET in 2026: (10 × $3) + (5 × $4) + (4 × $50) = $30 + $20 + $200 = $250.',
        'STEP 3 — CPI 2020 (base) = 100 by definition. CPI 2026 = ($250 / $195) × 100 ≈ 128.21.',
        'STEP 4 — INFLATION RATE 2020→2026: (CPI_new − CPI_old) / CPI_old × 100 = (128.21 − 100) / 100 × 100 = 28.21%.',
        'STEP 5 — INTERPRET. The basket of consumer goods costs about 28% more in 2026 than in 2020. If a household earned the same nominal income, their REAL purchasing power has fallen by about 28%. (Annualized over 6 years: roughly 4.2% per year compounded.)',
      ],
      answer: 'Basket: $195 (2020), $250 (2026). CPI 2026 ≈ 128.21. Cumulative inflation 28.21%.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-formula',
      kind: 'try_yourself',
      problem:
        'State the CPI formula, the inflation-rate formula, and explain in one sentence what each of the two formulas tells you.',
      expectedAnswer:
        'CPI formula: CPI_t = (Cost of basket in year t) / (Cost of basket in base year) × 100. Tells you the relative price level in year t compared to the base year, scaled so the base year = 100. Inflation rate between two periods = (CPI_new − CPI_old) / CPI_old × 100. Tells you the percentage change in the price level from one period to the next — i.e., how fast prices are rising (or falling).',
      responseFormat: 'free',
      hints: ['Both formulas are ratios scaled to percentages.', 'CPI is a level; inflation is a CHANGE in the level.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cpi-compute',
      kind: 'try_yourself',
      problem:
        'A small economy uses a basket of 6 hamburgers, 4 movie tickets, 2 books. Base year (2022) prices: hamburger $5, ticket $12, book $15. Year 2026 prices: hamburger $7, ticket $14, book $20. (a) Compute the basket cost in each year. (b) Compute the CPI for 2026. (c) Compute the inflation rate 2022→2026.',
      expectedAnswer:
        '(a) 2022: (6×5) + (4×12) + (2×15) = 30 + 48 + 30 = $108. 2026: (6×7) + (4×14) + (2×20) = 42 + 56 + 40 = $138. (b) CPI 2026 = (138/108) × 100 ≈ 127.78. (c) Inflation 2022→2026 = (127.78 − 100)/100 × 100 ≈ 27.78%.',
      responseFormat: 'numeric',
      hints: [
        'Multiply quantity by price for each good, sum across goods.',
        'CPI base year is always 100; the new year scales relative to it.',
        'Inflation = (new − old) / old × 100.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-cpi-vs-deflator',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. CPI and the GDP deflator both measure changes in the price level, but they yield different numbers in any given year. Identify TWO specific differences in coverage between CPI and the GDP deflator, and explain what each difference implies for what the two indices measure.',
      expectedAnswer:
        'Two differences (any two of the following): (1) BASKET MIX — CPI uses a FIXED basket of consumer goods (chosen periodically by the BLS to reflect typical urban consumer spending). GDP deflator uses the CURRENT year\'s mix of ALL goods produced domestically. Implication: CPI doesn\'t capture consumer substitution (when consumers shift away from goods whose prices rose, the fixed CPI basket misses this); GDP deflator does capture substitution. (2) IMPORTED GOODS — CPI INCLUDES imported consumer goods (foreign cars in the basket count if households buy them). GDP deflator EXCLUDES imports (it covers domestic production only). Implication: when import prices rise faster than domestic prices, CPI rises faster than the deflator. (3) CAPITAL + GOVERNMENT GOODS — GDP deflator INCLUDES capital goods, government goods/services, exports. CPI is consumer-only. Implication: deflator is broader; it tracks the price level of EVERYTHING domestically produced, not just consumer purchases. Strong answers explicitly map each difference to its implication.',
      responseFormat: 'frq',
      hints: [
        'What goods are in CPI\'s basket vs the deflator\'s basket?',
        'Are imports in CPI? In the deflator?',
        'Each difference implies the two indices answer slightly different questions.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-cpi-bias',
      kind: 'misconception_check',
      question: 'Does the CPI accurately measure changes in the cost of living?',
      commonErrors: [
        {
          answer: 'yes — it tracks consumer prices, that\'s exactly the cost of living',
          misconception: 'Trusting the CPI as a perfect cost-of-living index without recognizing its known biases.',
          correctsTo:
            'NOT EXACTLY. CPI is the best widely-available measure of consumer-price changes, but it has documented BIASES that cause it to OVERSTATE true cost-of-living increases by an estimated 0.5-1 percentage point per year. Three sources: (1) SUBSTITUTION BIAS — the fixed basket can\'t capture consumers shifting toward goods whose prices rose less. (2) QUALITY BIAS — when a smartphone gets dramatically better but its price stays flat, CPI sees flat prices, not a quality improvement. (3) NEW-GOOD BIAS — the basket lags behind innovations; goods enter the basket only after years of widespread use, missing early price drops. The Boskin Commission (1996) estimated total bias around 1.1 pp per year. CPI is useful — but is not a perfect cost-of-living index.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CPI = (cost of basket in year t / cost of basket in base year) × 100.',
        'Inflation rate = (CPI_new − CPI_old) / CPI_old × 100.',
        'CPI: fixed basket, consumer goods, includes imports.',
        'GDP deflator: current-year basket, all domestic production, no imports.',
        'CPI tends to OVERSTATE true inflation due to substitution / quality / new-good biases.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4',
    cedTitle: 'Price Indices and Inflation',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '9', note: 'OpenStax Macro AP — CPI computation, inflation rate, deflator distinction.' },
    ],
  },
};
