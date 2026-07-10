/**
 * AP Macroeconomics — Unit 3 CED 3.6: Changes in the AD-AS Model in the Short Run.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.changes-ad-as-short-run.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_CHANGES_AD_AS_SHORT_RUN: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.changes-ad-as-short-run.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.6',
  cedTitle: 'Changes in the AD-AS Model in the Short Run',
  planId: 'evelyn.ap.macro.changes-ad-as-short-run.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.changes-ad-as-short-run.v1' }],
  theory: [
    { loId: 'apmacro.changes-ad-as-short-run', content: `THE FOUR SIGNATURES — memorize this grid. AD RIGHT: Y↑, P↑, UR↓ (demand-pull inflation). AD LEFT: Y↓, P↓, UR↑ (demand-driven contraction/deflationary). SRAS RIGHT: Y↑, P↓, UR↓ (positive supply shock — best of both worlds). SRAS LEFT: Y↓, P↑, UR↑ (cost-push inflation = STAGFLATION).` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `AD RIGHTWARD triggers: tax cuts, lower interest rates, rising consumer confidence, more G, export booms. Result: higher real GDP AND higher price level; cyclical unemployment falls. The inflation produced is DEMAND-PULL.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `AD LEFTWARD triggers: tax hikes, rate hikes, confidence collapse, wealth destruction (stock crash). Result: lower Y and lower P; unemployment rises; inflation falls — possibly deflation if severe. This is NOT cost-push or demand-pull inflation; it is a demand-driven contraction.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `SRAS RIGHTWARD triggers: productivity booms, falling oil/input prices, business tax cuts. Result: MORE output at LOWER prices with lower unemployment — the one shift that improves everything.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `SRAS LEFTWARD triggers: oil price spikes, supply-chain disruption, business tax hikes. Result: less output at higher prices with rising unemployment — STAGFLATION, and the inflation is COST-PUSH.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `DEMAND-PULL vs COST-PUSH: both raise the price level; the DIFFERENCE IS REAL GDP's direction. Demand-pull: P↑ AND Y↑ (moving up along SRAS). Cost-push: P↑ AND Y↓ (SRAS shifted left, sliding up along AD). Diagnosing the source matters because the right policy response differs.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `PREDICTION ALGORITHM: (1) classify the shock — AD or SRAS? (component change vs cost/capacity change); (2) direction; (3) read Y and P off the new intersection; (4) infer UR from Y's change; (5) label the inflation demand-pull (Y up) or cost-push (Y down), or neither if P fell.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `POLICY DEPENDS ON THE SOURCE: demand-pull inflation → tightening AD works cleanly (cools P and returns Y toward potential together). Cost-push inflation → AD tools force a trade-off (tighten and deepen the recession, or loosen and worsen inflation); the real fix is supply-side. Two countries with identical inflation rates can need OPPOSITE responses.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `AP DIAGRAM CONVENTION: original curve solid; shifted curve dashed with a prime label (AD′, SRAS′); mark old and new equilibria and drop reference lines to the new price level and real GDP.` },
    { loId: 'apmacro.changes-ad-as-short-run', kind: 'definition', title: 'demand-pull inflation', content: `inflation driven by a rightward AD shift; price level and real GDP both rise.` },
    { loId: 'apmacro.changes-ad-as-short-run', kind: 'definition', title: 'cost-push inflation', content: `inflation driven by a leftward SRAS shift; price level rises while real GDP falls (stagflation).` },
  ],
  methods: [
    {
      title: 'Predict short-run effects of a macro shock (five-step algorithm)',
      steps: [
        `STEP 1 — CLASSIFY: does the shock change a spending component (C, I, G, NX) → AD; or production costs/capacity (input prices, productivity, business taxes) → SRAS?`,
        `STEP 2 — DIRECTION: spending/cost movement determines left or right.`,
        `STEP 3 — READ the new equilibrium: AD right → Y↑ P↑; AD left → Y↓ P↓; SRAS right → Y↑ P↓; SRAS left → Y↓ P↑.`,
        `STEP 4 — UNEMPLOYMENT follows output inversely: Y up → UR down; Y down → UR up.`,
        `STEP 5 — LABEL the inflation: P↑ with Y↑ = demand-pull; P↑ with Y↓ = cost-push; P↓ = not inflation (disinflation/deflation).`,
      ],
      example: {
        problem: `For each event give curve, direction, and effects on P, Y, UR, plus the inflation label: (a) a five-hundred-billion-dollar tax cut; (b) OPEC doubles world oil prices; (c) a stock crash erases a third of household wealth.`,
        solution: `(a) AD RIGHT (disposable income → C up): P↑ Y↑ UR↓ — demand-pull inflation. (b) SRAS LEFT (input costs up): P↑ Y↓ UR↑ — cost-push inflation, stagflation. (c) AD LEFT (wealth effect → C down): P↓ Y↓ UR↑ — demand-driven contraction, no inflation label (prices falling).`,
      },
      relatedLoIds: ['apmacro.changes-ad-as-short-run'],
    },
  ],
  pointers: [
    { content: 'Grid: AD→ Y and P move TOGETHER; SRAS→ Y and P move OPPOSITE. Four signatures, memorize.', kind: 'tip' },
    { content: 'Demand-pull: P↑ Y↑. Cost-push: P↑ Y↓ (stagflation). Same P direction, opposite Y.', kind: 'tip' },
    { content: 'Falling P is never "inflation" — call it disinflation or deflation.', kind: 'tip' },
    { content: 'Diagram convention: solid original, dashed primed new curve, both equilibria labeled.', kind: 'tip' },
    { content: 'Diagnose the inflation source before prescribing: AD tools fit demand-pull; cost-push forces a trade-off.', kind: 'tip' },
  ],
};
