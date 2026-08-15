/**
 * AP Macroeconomics — Unit 2 CED 2.7: The Business Cycle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.business-cycle.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.business-cycle.v1' }],
  theory: [
    { loId: 'apmacro.business-cycle', content: `BUSINESS CYCLE: the recurring pattern of fluctuations in real GDP around its long-run growth trend. Four phases in order: EXPANSION → PEAK → CONTRACTION (recession) → TROUGH → back to expansion. A loop, not a line.` },
    { loId: 'apmacro.business-cycle', content: `EXPANSION: real GDP RISING; unemployment FALLING; inflation may rise. Most years of most decades are expansion years. PEAK: real GDP at its cycle MAXIMUM; unemployment at the cycle LOW; growth turns negative after.` },
    { loId: 'apmacro.business-cycle', content: `CONTRACTION (RECESSION): real GDP FALLING; unemployment RISING; inflation may slow or turn negative (deflation). TROUGH: real GDP at its cycle MINIMUM; unemployment at the cycle HIGH; recovery begins after.` },
    { loId: 'apmacro.business-cycle', content: `RECESSION DEFINITIONS: the media rule — TWO consecutive quarters of negative real GDP growth — is a HEURISTIC. The NBER officially dates US recessions with broader judgment across depth, diffusion, and duration, weighing employment, income, sales, and industrial production alongside GDP. (One recession in the early two-thousands had only one negative GDP quarter yet was clearly a downturn by other measures.)` },
    { loId: 'apmacro.business-cycle', content: `POTENTIAL GDP: the real GDP the economy WOULD produce with all resources fully employed at the natural rate of unemployment — also called full-employment GDP; corresponds to long-run aggregate supply.` },
    { loId: 'apmacro.business-cycle', content: `OUTPUT GAP = ACTUAL real GDP − POTENTIAL real GDP; usually expressed as a percent of potential. NEGATIVE gap (recessionary): actual < potential, idle resources, cyclical unemployment positive. POSITIVE gap (inflationary/overheating): actual > potential, economy beyond sustainable capacity.` },
    { loId: 'apmacro.business-cycle', content: `CYCLE ↔ UNEMPLOYMENT LINK: cyclical unemployment = actual UR − natural rate. In healthy expansion, cyclical UE approaches zero and actual UR approaches the natural rate. In recession, cyclical UE > 0. In overheating, actual UR falls BELOW the natural rate — cyclical UE is NEGATIVE.` },
    { loId: 'apmacro.business-cycle', content: `GAP ↔ INFLATION LINK: negative output gap → demand weaker than capacity → DOWNWARD inflation pressure (possible deflation if severe). Positive output gap → firms bid up wages and inputs → UPWARD inflation pressure — the "running hot" condition that prompts central banks to raise rates. (Formalized later by the Phillips curve, Unit 5.)` },
    { loId: 'apmacro.business-cycle', content: `NO TWO CYCLES ARE IDENTICAL: lengths and depths vary widely — the phases are descriptive labels, not a rigid clock.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'business cycle', content: `recurring fluctuations in real GDP around its long-run trend.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'recession', content: `the contraction phase of the business cycle; heuristic rule: two consecutive quarters of negative real GDP growth.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'output gap', content: `actual real GDP minus potential real GDP; negative in recession, positive when overheating.` },
    { loId: 'apmacro.business-cycle', kind: 'definition', title: 'potential GDP', content: `the real GDP an economy would produce at full employment (actual UR = natural rate).` },
  ],
  methods: [
    {
      title: 'Diagnose the economy from output-gap and unemployment data',
      steps: [
        `STEP 1 — OUTPUT GAP (level) = actual − potential real GDP. Note the sign.`,
        `STEP 2 — OUTPUT GAP (percent) = (actual − potential) / potential × 100.`,
        `STEP 3 — CYCLICAL UNEMPLOYMENT = actual UR − natural rate. Positive with a negative gap; NEGATIVE with a positive gap.`,
        `STEP 4 — NAME THE PHASE: negative gap + above-natural UR → contraction/early recovery. Positive gap + below-natural UR → late expansion/overheating.`,
        `STEP 5 — INFLATION DIRECTION: negative gap → downward pressure; positive gap → upward pressure. State it explicitly — AP asks.`,
      ],
      example: {
        problem: `Potential real GDP is twenty trillion dollars; actual is nineteen-point-four trillion. The natural rate of unemployment is four percent; actual UR is six percent. Find the output gap, cyclical unemployment, the phase, and the inflation pressure.`,
        solution: `Gap = −0.6 trillion dollars = −3 percent of potential. Cyclical UE = six − four = two points. Phase: contraction (or early recovery) — output below potential with idle resources. Inflation pressure: downward. (Mirror case: actual above potential with UR below natural → positive gap, negative cyclical UE, overheating, upward inflation pressure.)`,
      },
      relatedLoIds: ['apmacro.business-cycle'],
    },
  ],
  pointers: [
    { content: 'Order of phases: expansion → peak → contraction → trough → expansion. GDP and UR move oppositely.', kind: 'tip' },
    { content: 'Output gap = actual − potential (often as % of potential). Negative = recessionary, positive = inflationary.', kind: 'tip' },
    { content: 'Cyclical UE = actual UR − natural rate; it is NEGATIVE when the economy overheats.', kind: 'tip' },
    { content: 'Two-negative-quarters is a heuristic; the NBER dates recessions with multi-indicator judgment.', kind: 'tip' },
    { content: 'Negative gap → downward inflation pressure; positive gap → upward. Always state the direction.', kind: 'tip' },
  ],
};
