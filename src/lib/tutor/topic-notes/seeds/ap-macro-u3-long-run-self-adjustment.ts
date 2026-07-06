/**
 * AP Macroeconomics — Unit 3 CED 3.7: Long-Run Self-Adjustment.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.long-run-self-adjustment.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_LONG_RUN_SELF_ADJUSTMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.long-run-self-adjustment.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.7',
  cedTitle: 'Long-Run Self-Adjustment',
  planId: 'evelyn.ap.macro.long-run-self-adjustment.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.long-run-self-adjustment.v1' }],
  theory: [
    { loId: 'apmacro.long-run-self-adjustment', content: `SELF-ADJUSTMENT FROM A RECESSIONARY GAP: economy at AD ∩ SRAS to the LEFT of LRAS. Cyclical unemployment is high; workers compete for scarce jobs and accept lower wages. Lower wages reduce firms' costs → SRAS shifts RIGHTWARD. New equilibrium emerges where new SRAS intersects unchanged AD on LRAS. Real GDP returns to potential; price level falls below original.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `SELF-ADJUSTMENT FROM AN INFLATIONARY GAP: economy at AD ∩ SRAS to the RIGHT of LRAS. Labor is scarce; workers demand higher wages; firms grant them; firms' costs rise → SRAS shifts LEFTWARD. New equilibrium emerges where new SRAS intersects unchanged AD on LRAS. Real GDP returns to potential; price level rises above original.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `KEY ASYMMETRY: in self-adjustment, real GDP always returns to LRAS. The PRICE LEVEL is what changes. From a recessionary gap, price level falls (deflation in the adjustment). From an inflationary gap, price level rises (further inflation during adjustment).` },
    { loId: 'apmacro.long-run-self-adjustment', content: `TIMING: self-adjustment can take years. Sticky wages don't adjust quickly downward (workers resist nominal wage cuts); contracts span multiple years; expectations are slow to update. The Great Depression saw real GDP below potential for nearly a decade.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `POLICY DEBATE — KEYNESIAN view: self-adjustment is too slow. Workers and businesses suffer in the gap. Active fiscal/monetary policy to shift AD back toward LRAS shortens the adjustment, reducing the human cost. "In the long run, we are all dead" (Keynes).` },
    { loId: 'apmacro.long-run-self-adjustment', content: `POLICY DEBATE — CLASSICAL / MONETARIST view: self-adjustment works if given time. Active policy may misfire (lags, political distortions, crowding out, inflation). Better to commit to stable monetary policy and let the economy heal. Some argue active policy creates moral hazard or worsens long-run growth.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `AP usually presents both views; questions ask students to TRACE the self-adjustment process accurately and to ARTICULATE the policy trade-off without endorsing one side.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `CRITICAL DIAGRAM SKILL: when tracing self-adjustment, draw the SRAS shift (not AD). AD stays put unless policy intervenes. The SRAS shift is the mechanism that closes the gap. New equilibrium is where new SRAS meets unchanged AD on LRAS.` },
    { loId: 'apmacro.long-run-self-adjustment', kind: 'definition', title: 'long-run self-adjustment', content: `the process by which the economy returns to LRAS without policy intervention via SRAS shifts driven by wage and price adjustment.` },
  ],
  methods: [
    {
      title: 'Worked self adjust recession',
      steps: [
        `STEP 1 — SHORT-RUN EQUILIBRIUM. AD ∩ SRAS at Y=$14T, output gap = -$2T. Cyclical UE high. Inflation pressure DOWNWARD.`,
        `STEP 2 — WAGE ADJUSTMENT BEGINS. With high cyclical unemployment, workers compete for scarce jobs. Wage growth slows; eventually nominal wages fall (slow because of sticky-wage frictions). This may take 1-3 years to show meaningful adjustment.`,
        `STEP 3 — SRAS SHIFTS RIGHT. As wages fall, firms' production costs decline. At any given price level, firms can profitably supply more output. SRAS shifts rightward.`,
        `STEP 4 — NEW SHORT-RUN EQUILIBRIUM. New SRAS intersects unchanged AD at higher real GDP and lower price level. The economy moves rightward and downward along the AD curve.`,
        `STEP 5 — CONVERGENCE TO LRAS. SRAS keeps shifting right until the new short-run equilibrium reaches LRAS at $16T (potential). At that point, cyclical UE = 0, output = potential. Self-adjustment complete.`,
        `STEP 6 — RESULT: real GDP back to $16T. Price level LOWER than the original short-run equilibrium's price level. The recession is "paid for" with a lower price level — a difficult outcome for debtors but a relief for cash-holders.`,
        `STEP 7 — COMPARISON WITH ACTIVE POLICY. If the government had instead shifted AD right (fiscal stimulus) at the start, the economy would have returned to $16T more quickly and at a HIGHER price level than self-adjustment alone. The trade-off: speed and inflation up vs slow adjustment and lower price level.`,
      ],
      example: { problem: `An economy enters a deep recessionary gap: AD ∩ SRAS at $14T, with potential GDP = $16T. Trace the long-run self-adjustment process step by step. Describe what happens to wages, SRAS, real GDP, and the price level. Compare to where the economy would land with active policy.`, solution: `Self-adjustment via SRAS rightward shift. Final outcome: Y back to potential ($16T), P below original short-run level. Slower than active policy but no inflation cost.` },
      relatedLoIds: ['apmacro.long-run-self-adjustment'],
    },
  ],
  pointers: [
    { content: 'Self-adjustment works through SRAS shifts (NOT AD).', kind: 'tip' },
    { content: 'Recessionary gap → wages fall → SRAS right → return to LRAS at LOWER P.', kind: 'tip' },
    { content: 'Inflationary gap → wages rise → SRAS left → return to LRAS at HIGHER P.', kind: 'tip' },
    { content: 'Real GDP always returns to potential. Only the price level changes.', kind: 'tip' },
    { content: `Keynesian: self-adjust too slow, intervene. Classical: self-adjustment works, wait.`, kind: 'tip' },
  ],
};
