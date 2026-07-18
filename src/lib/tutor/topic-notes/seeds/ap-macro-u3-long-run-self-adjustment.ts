/**
 * AP Macroeconomics — Unit 3 CED 3.7: Long-Run Self-Adjustment.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.long-run-self-adjustment.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.long-run-self-adjustment.v1' }],
  theory: [
    { loId: 'apmacro.long-run-self-adjustment', content: `LONG-RUN SELF-ADJUSTMENT: the economy returns to LRAS WITHOUT policy intervention, through SRAS shifts driven by wage and price adjustment. THE MECHANISM IS SRAS — AD stays put unless policy moves it. Drawing an AD shift for self-adjustment is the classic diagram error.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `FROM A RECESSIONARY GAP: high cyclical unemployment → workers compete for scarce jobs → wage growth slows, eventually nominal wages fall → firms' costs decline → SRAS shifts RIGHT → new equilibrium where new SRAS meets unchanged AD ON LRAS. Real GDP back to potential; price level ENDS LOWER than the original short-run level.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `FROM AN INFLATIONARY GAP: labor is scarce → workers demand and win higher wages → firms' costs rise → SRAS shifts LEFT → new equilibrium on LRAS. Real GDP back down to potential; price level ENDS HIGHER — the gap "self-corrects" at the cost of further inflation during adjustment.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `THE ASYMMETRY OF OUTCOMES: real GDP ALWAYS returns to potential; only the PRICE LEVEL differs by starting point (down from a recessionary gap, up from an inflationary gap). At long-run equilibrium there is no gap and SRAS does not move.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `TIMING: self-adjustment is SLOW — often years. Workers resist nominal wage cuts, multi-year contracts lock costs in, expectations lag. The Great Depression left output below potential for nearly a decade. Downward wage adjustment (recessionary side) is especially sluggish.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `KEYNESIAN VIEW: self-adjustment is too slow to rely on. Waiting means years of lost output, unemployment, eroded skills. Active fiscal/monetary policy shifting AD back to potential shortens the pain; the inflation cost is small relative to the output gain. "In the long run we are all dead."` },
    { loId: 'apmacro.long-run-self-adjustment', content: `CLASSICAL / MONETARIST VIEW: self-adjustment works if given time, and active policy can MISFIRE — policy lags may hit after the economy has already healed (overshoot → inflation), political incentives breed chronic stimulus and deficits, deficit borrowing crowds out private investment. Prefer stable rules and patience.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `REAL-WORLD DECIDING FACTORS between acting and waiting: depth and persistence of the gap, whether the financial system is functioning (banking crises stall self-adjustment), policy lags, central-bank credibility, fiscal space. AP asks you to TRACE the mechanism accurately and ARTICULATE the trade-off, not to pick a side.` },
    { loId: 'apmacro.long-run-self-adjustment', content: `POLICY vs SELF-ADJUSTMENT ENDPOINTS (recessionary case): both return Y to potential. Active AD stimulus gets there FASTER at a HIGHER final price level; self-adjustment is slower but ends at a LOWER price level. Name speed AND price-level endpoint when comparing.` },
    { loId: 'apmacro.long-run-self-adjustment', kind: 'definition', title: 'long-run self-adjustment', content: `the process by which the economy returns to LRAS without policy intervention, via SRAS shifts driven by wage and price adjustment.` },
    { loId: 'apmacro.long-run-self-adjustment', kind: 'definition', title: 'sticky wages (downward)', content: `the slow downward adjustment of nominal wages — workers resist cuts, contracts bind — which makes recessionary self-adjustment take years.` },
  ],
  methods: [
    {
      title: 'Trace self-adjustment from a gap to long-run equilibrium',
      steps: [
        `STEP 1 — IDENTIFY the starting gap (AD ∩ SRAS left or right of LRAS) and the labor-market condition it implies (surplus of workers vs labor scarcity).`,
        `STEP 2 — WAGE RESPONSE: recessionary gap → wages eventually FALL; inflationary gap → wages RISE. This is the slow step.`,
        `STEP 3 — SRAS SHIFT: falling wages → costs down → SRAS RIGHT; rising wages → costs up → SRAS LEFT. AD does NOT move.`,
        `STEP 4 — CONVERGENCE: SRAS keeps shifting until the new AD ∩ SRAS lands ON LRAS. Real GDP = potential; cyclical unemployment zero.`,
        `STEP 5 — STATE the price-level endpoint: LOWER than the original short-run level (recessionary start) or HIGHER (inflationary start).`,
        `STEP 6 — COMPARE with active policy if asked: stimulus reaches potential faster but at a higher final price level.`,
      ],
      example: {
        problem: `An economy sits in a recessionary gap with short-run output at fourteen trillion dollars and potential at sixteen trillion. Trace the self-adjustment process and the final equilibrium, and compare with active fiscal stimulus.`,
        solution: `High cyclical unemployment → wages slowly fall → SRAS shifts RIGHT (AD unchanged) → equilibrium slides down along AD until it reaches LRAS at sixteen trillion. Final: Y at potential, price level BELOW the original short-run level. Active stimulus instead shifts AD right: same output endpoint, reached faster, but at a HIGHER price level. Trade-off: speed with inflation vs slow healing with deflationary pressure.`,
      },
      relatedLoIds: ['apmacro.long-run-self-adjustment'],
    },
  ],
  pointers: [
    { content: 'Self-adjustment works through SRAS — never draw an AD shift for it.', kind: 'tip' },
    { content: 'Recessionary gap → wages fall → SRAS RIGHT → potential at LOWER P. Inflationary → wages rise → SRAS LEFT → HIGHER P.', kind: 'tip' },
    { content: 'Real GDP always ends at potential; only the price level records which gap you came from.', kind: 'tip' },
    { content: 'Downward wage stickiness makes recessionary self-adjustment take years — the heart of the policy debate.', kind: 'tip' },
    { content: 'Keynesian: too slow, act. Classical: works, wait (lags/crowding-out risks). AP wants both traced, not endorsed.', kind: 'tip' },
  ],
};
