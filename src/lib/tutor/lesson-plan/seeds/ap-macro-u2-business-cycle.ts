/**
 * AP Macroeconomics — CED Unit 2.7: The Business Cycle.
 *
 * Wraps Unit 2 by tying together GDP, unemployment, and inflation under
 * the business-cycle framework: expansion / peak / contraction / trough,
 * output gap, and the link to cyclical unemployment.
 *
 * Uses the new `business_cycle` structured diagram kind.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U2_BUSINESS_CYCLE: LessonPlan = {
  id: 'evelyn.ap.macro.business-cycle.v1',
  title: 'U2.7 The Business Cycle',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.business-cycle',
      description:
        'Identify the four phases of the business cycle (expansion, peak, contraction/recession, trough), distinguish actual from potential GDP, compute the output gap, and connect cyclical unemployment to recession.',
      standard: 'AP-MACRO-2.7',
    },
  ],
  prerequisites: ['apmacro.real-vs-nominal-gdp', 'apmacro.unemployment'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the business cycle as a recurring pattern, not chaos.',
      script:
        "Real GDP doesn't grow in a smooth line. It grows in waves — periods of expansion followed by recessions, then recovery, then more expansion. The pattern is so consistent that economists named the phases: peak, contraction, trough, expansion. Understanding where the economy SITS in the cycle drives every Unit 3 onward.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-business-cycle',
      kind: 'concept',
      goal: 'Cover the four phases, output gap, recession definition, and connection to cyclical unemployment.',
      keyIdeas: [
        'BUSINESS CYCLE: the recurring pattern of fluctuations in real GDP around its long-run growth trend. Four phases: expansion, peak, contraction (recession), trough.',
        'EXPANSION: real GDP is rising. Unemployment falls; inflation may rise. Most years of most decades are expansion phases.',
        'PEAK: the high point of the cycle. Real GDP is at its maximum for that cycle. Unemployment at cycle low. After the peak, growth turns negative.',
        'CONTRACTION (RECESSION): real GDP is falling. Unemployment rises; inflation may fall (or even turn negative — deflation). Technical-rule definition: TWO consecutive quarters of negative real GDP growth (a common heuristic; the NBER officially calls recessions using a broader judgment incorporating employment, income, and other indicators).',
        'TROUGH: the low point of the cycle. Real GDP at its minimum; unemployment at cycle high. After the trough comes recovery — real GDP starts rising again.',
        'POTENTIAL GDP: the level of real GDP the economy WOULD produce if all resources (labor + capital) were fully employed at the natural rate of unemployment. Sometimes called full-employment GDP or long-run aggregate supply.',
        'OUTPUT GAP = ACTUAL GDP − POTENTIAL GDP. NEGATIVE output gap (recession): actual < potential, resources idle, cyclical unemployment > 0. POSITIVE output gap (overheating): actual > potential, economy operating beyond sustainable capacity, inflation pressure builds.',
        'BUSINESS CYCLE LINKS TO CYCLICAL UNEMPLOYMENT: in expansion, cyclical UE → 0 and actual UR → natural rate. In recession, cyclical UE > 0 and actual UR rises above natural rate.',
        'NO TWO CYCLES ARE IDENTICAL. Lengths vary (the 2009 recession was deeper than 2001; 1990s expansion was historically long). The four phases are descriptive labels, not a rigid clock.',
      ],
      vocabulary: [
        { term: 'business cycle', definition: 'recurring fluctuations in real GDP around its long-run trend.' },
        { term: 'recession', definition: 'a contraction phase in the business cycle; technical rule: two consecutive quarters of negative real GDP growth.' },
        { term: 'output gap', definition: 'actual real GDP minus potential real GDP; negative in recession, positive when overheating.' },
        { term: 'potential GDP', definition: 'the real GDP an economy would produce at full employment (actual UR = natural rate).' },
      ],
      suggestedTools: ['business_cycle'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-output-gap',
      kind: 'worked_example',
      problem:
        "An economy's potential real GDP this year is $20 trillion. Actual real GDP is $19.4 trillion. The natural rate of unemployment is 4%; the actual unemployment rate is 6%. (a) Compute the output gap (in dollars and as a percentage of potential GDP). (b) Identify the cyclical unemployment rate. (c) Identify the phase of the business cycle. (d) Identify expected direction of inflation pressure under these conditions.",
      steps: [
        'STEP 1 — OUTPUT GAP (dollars): Actual − Potential = $19.4T − $20T = −$0.6T. Negative ($600B below potential).',
        'STEP 2 — OUTPUT GAP (% of potential): −$0.6T / $20T × 100 = −3%. Real GDP is 3% below potential.',
        'STEP 3 — CYCLICAL UNEMPLOYMENT: total UR − natural rate = 6% − 4% = 2 percentage points. The cyclical component of unemployment.',
        'STEP 4 — PHASE: real GDP is below potential and cyclical unemployment is positive → the economy is in CONTRACTION (or post-trough early recovery). Resources are sitting idle.',
        'STEP 5 — INFLATION DIRECTION: with a NEGATIVE output gap, demand is weaker than supply capacity. Inflation pressure is DOWNWARD. Inflation may slow, stop, or even turn into deflation depending on severity. (Connects to the Phillips Curve idea — covered later in Unit 5.)',
      ],
      answer: 'Output gap: −$0.6T (−3% of potential). Cyclical UE: 2pp. Phase: contraction/recession. Inflation pressure: downward.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-phases',
      kind: 'try_yourself',
      problem:
        'Name the four phases of the business cycle in the order they occur. For each, briefly state what real GDP and unemployment are doing.',
      expectedAnswer:
        'EXPANSION → PEAK → CONTRACTION (RECESSION) → TROUGH → (back to expansion). Expansion: real GDP is RISING; unemployment FALLING. Peak: real GDP at MAXIMUM for the cycle; unemployment at cycle LOW. Contraction: real GDP FALLING; unemployment RISING. Trough: real GDP at MINIMUM; unemployment at cycle HIGH. After trough the cycle restarts with expansion.',
      responseFormat: 'free',
      hints: [
        'Cycle through them in order — they form a loop.',
        'For each phase, GDP direction and UR direction tend to move oppositely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-output-gap',
      kind: 'try_yourself',
      problem:
        'Country Q has potential real GDP of $5T this year. Actual real GDP is $5.2T. Natural rate of unemployment is 5%; actual UR is 3%. (a) Compute the output gap as a percent of potential GDP. (b) State the cyclical unemployment rate (it can be negative). (c) Identify the business-cycle phase. (d) Identify expected direction of inflation pressure.',
      expectedAnswer:
        '(a) Output gap = (5.2 − 5.0) / 5.0 × 100 = +4%. POSITIVE output gap of 4% — actual production is above potential. (b) Cyclical UR = actual − natural = 3% − 5% = −2%. Yes, this can be negative — when actual UR is below natural rate. (c) Phase: late EXPANSION / overheating. The economy is operating beyond sustainable capacity. (d) Inflation pressure: UPWARD. Demand exceeds long-run supply capacity; firms bid up wages and input prices; aggregate price level pushed up. This is the "running hot" condition that often prompts central banks to raise interest rates.',
      responseFormat: 'numeric',
      hints: [
        'Output gap = (actual − potential) / potential × 100.',
        'Cyclical UR = actual UR − natural UR. Negative means actual is below natural.',
        'Positive output gap and below-natural UR signal overheating.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-recession-definition',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The "two consecutive quarters of negative real GDP growth" rule is widely used in the media as the definition of a recession. The official body in the U.S. — the National Bureau of Economic Research (NBER) — does NOT use this rule mechanically. Briefly explain why a more flexible, judgment-based definition might be preferred over the strict two-quarter rule.',
      expectedAnswer:
        'The two-quarter rule is appealing as a clean, mechanical definition but has several weaknesses. (1) It ignores DEPTH and BREADTH — a tiny 0.1% quarterly contraction repeated twice would qualify, while a single deep 5% quarter would not, even if the latter is plainly more recessionary. (2) It uses ONLY GDP — a recession typically affects employment, income, retail sales, and industrial production simultaneously. NBER weighs all five. The 2001 recession had only one quarter of negative GDP growth but was clearly a downturn by every other measure. (3) It LAGS in real time — GDP estimates are revised significantly after initial release; a "two negative quarters" call could be retroactively reversed. (4) It misses STRUCTURAL features like sustained employment loss that define recessions in lived experience. NBER\'s judgment-based approach uses depth, diffusion (how widespread across sectors), and duration to call recessions accurately even when they don\'t cleanly fit the two-quarter rule. Strong answers cite at least two of: depth-vs-duration trade-off, multi-indicator confirmation, real-time revision noise, lived-experience match.',
      responseFormat: 'frq',
      hints: [
        'Could the rule miss real recessions?',
        'Could the rule call false positives?',
        'What do recessions actually look like in the labor market and income data?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four phases: expansion → peak → contraction (recession) → trough → expansion.',
        'Output gap = actual GDP − potential GDP. Negative in recession, positive in overheating.',
        'Recession = real GDP falling. Two-quarter rule is a heuristic; NBER uses broader judgment.',
        'Cyclical UE = actual UR − natural UR. Positive in recession; can be negative in overheating.',
        'Negative output gap → downward inflation pressure. Positive output gap → upward.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.7',
    cedTitle: 'The Business Cycle',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '7', note: 'OpenStax Macro AP — business cycle phases, output gap, NBER definition.' },
    ],
  },
};
