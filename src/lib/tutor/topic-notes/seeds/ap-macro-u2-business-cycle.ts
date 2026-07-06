/**
 * AP Macroeconomics — Unit 2 CED 2.7: The Business Cycle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.business-cycle.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_BUSINESS_CYCLE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.business-cycle.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.7',
  cedTitle: 'The Business Cycle',
  planId: 'evelyn.ap.macro.business-cycle.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.business-cycle.v1' }],
  theory: [
    { loId: 'apmacro.business-cycle', content: `BUSINESS CYCLE: the recurring pattern of fluctuations in real GDP around its long-run growth trend. Four phases: expansion, peak, contraction (recession), trough.` },
    { loId: 'apmacro.business-cycle', content: `EXPANSION: real GDP is rising. Unemployment falls; inflation may rise. Most years of most decades are expansion phases.` },
    { loId: 'apmacro.business-cycle', content: `PEAK: the high point of the cycle. Real GDP is at its maximum for that cycle. Unemployment at cycle low. After the peak, growth turns negative.` },
    { loId: 'apmacro.business-cycle', content: `CONTRACTION (RECESSION): real GDP is falling. Unemployment rises; inflation may fall (or even turn negative — deflation). Technical-rule definition: TWO consecutive quarters of negative real GDP growth (a common heuristic; the NBER officially calls recessions using a broader judgment incorporating employment, income, and other indicators).` },
    { loId: 'apmacro.business-cycle', content: `TROUGH: the low point of the cycle. Real GDP at its minimum; unemployment at cycle high. After the trough comes recovery — real GDP starts rising again.` },
    { loId: 'apmacro.business-cycle', content: `POTENTIAL GDP: the level of real GDP the economy WOULD produce if all resources (labor + capital) were fully employed at the natural rate of unemployment. Sometimes called full-employment GDP or long-run aggregate supply.` },
    { loId: 'apmacro.business-cycle', content: `OUTPUT GAP = ACTUAL GDP − POTENTIAL GDP. NEGATIVE output gap (recession): actual < potential, resources idle, cyclical unemployment > 0. POSITIVE output gap (overheating): actual > potential, economy operating beyond sustainable capacity, inflation pressure builds.` },
    { loId: 'apmacro.business-cycle', content: `BUSINESS CYCLE LINKS TO CYCLICAL UNEMPLOYMENT: in expansion, cyclical UE → 0 and actual UR → natural rate. In recession, cyclical UE > 0 and actual UR rises above natural rate.` },
    { loId: 'apmacro.business-cycle', content: `NO TWO CYCLES ARE IDENTICAL. Lengths vary (the 2009 recession was deeper than 2001; 1990s expansion was historically long). The four phases are descriptive labels, not a rigid clock.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'business cycle', content: 'recurring fluctuations in real GDP around its long-run trend.' },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'recession', content: `a contraction phase in the business cycle; technical rule: two consecutive quarters of negative real GDP growth.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'output gap', content: `actual real GDP minus potential real GDP; negative in recession, positive when overheating.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'potential GDP', content: `the real GDP an economy would produce at full employment (actual UR = natural rate).` },
  ],
  methods: [
    {
      title: 'Worked output gap',
      steps: [
        `STEP 1 — OUTPUT GAP (dollars): Actual − Potential = $19.4T − $20T = −$0.6T. Negative ($600B below potential).`,
        `STEP 2 — OUTPUT GAP (% of potential): −$0.6T / $20T × 100 = −3%. Real GDP is 3% below potential.`,
        `STEP 3 — CYCLICAL UNEMPLOYMENT: total UR − natural rate = 6% − 4% = 2 percentage points. The cyclical component of unemployment.`,
        `STEP 4 — PHASE: real GDP is below potential and cyclical unemployment is positive → the economy is in CONTRACTION (or post-trough early recovery). Resources are sitting idle.`,
        `STEP 5 — INFLATION DIRECTION: with a NEGATIVE output gap, demand is weaker than supply capacity. Inflation pressure is DOWNWARD. Inflation may slow, stop, or even turn into deflation depending on severity. (Connects to the Phillips Curve idea — covered later in Unit 5.)`,
      ],
      example: { problem: `An economy's potential real GDP this year is $20 trillion. Actual real GDP is $19.4 trillion. The natural rate of unemployment is 4%; the actual unemployment rate is 6%. (a) Compute the output gap (in dollars and as a percentage of potential GDP). (b) Identify the cyclical unemployment rate. (c) Identify the phase of the business cycle. (d) Identify expected direction of inflation pressure under these conditions.`, solution: `Output gap: −$0.6T (−3% of potential). Cyclical UE: 2pp. Phase: contraction/recession. Inflation pressure: downward.` },
      relatedLoIds: ['apmacro.business-cycle'],
    },
  ],
  pointers: [
    { content: 'Four phases: expansion → peak → contraction (recession) → trough → expansion.', kind: 'tip' },
    { content: `Output gap = actual GDP − potential GDP. Negative in recession, positive in overheating.`, kind: 'tip' },
    { content: `Recession = real GDP falling. Two-quarter rule is a heuristic; NBER uses broader judgment.`, kind: 'tip' },
    { content: `Cyclical UE = actual UR − natural UR. Positive in recession; can be negative in overheating.`, kind: 'tip' },
    { content: 'Negative output gap → downward inflation pressure. Positive output gap → upward.', kind: 'tip' },
  ],
};
