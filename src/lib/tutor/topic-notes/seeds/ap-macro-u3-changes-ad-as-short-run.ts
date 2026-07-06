/**
 * AP Macroeconomics — Unit 3 CED 3.6: Changes in the AD-AS Model in the Short Run.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.changes-ad-as-short-run.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.changes-ad-as-short-run.v1' }],
  theory: [
    { loId: 'apmacro.changes-ad-as-short-run', content: `AD SHIFTS RIGHTWARD (e.g. tax cut, lower interest rates, rising consumer confidence): new equilibrium has HIGHER real GDP and HIGHER price level. Cyclical unemployment FALLS. Inflation rises. This is DEMAND-PULL INFLATION — inflation driven by expanding demand.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `AD SHIFTS LEFTWARD (e.g. tax hike, rate hike, falling consumer confidence): new equilibrium has LOWER real GDP and LOWER price level. Cyclical unemployment RISES. Inflation falls (or turns into deflation if severe).` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `SRAS SHIFTS RIGHTWARD (positive supply shock — e.g. productivity boom, falling oil prices, business tax cuts): new equilibrium has HIGHER real GDP and LOWER price level. Cyclical unemployment FALLS. Inflation falls. The "best of both worlds" — more output AND lower prices.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `SRAS SHIFTS LEFTWARD (negative supply shock — e.g. oil price spike, supply chain disruption, business tax hike): new equilibrium has LOWER real GDP and HIGHER price level. Cyclical unemployment RISES. Inflation rises. STAGFLATION — inflation rising while output falls. This is COST-PUSH INFLATION.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `DEMAND-PULL vs COST-PUSH INFLATION: both result in higher price level. Difference is in real GDP. Demand-pull: P↑ AND Y↑ (along SRAS). Cost-push: P↑ AND Y↓ (along AD, with SRAS shifted left). Distinguishing the source of inflation matters for policy because the appropriate response differs.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `AP DIAGRAM CONVENTION for showing a shift: draw the original curve as a solid line, draw the new curve as a dashed line labeled with a prime (AD', SRAS'). Mark old equilibrium (E_0) and new equilibrium (E_1). Show new price level (P_1) and new real GDP (Y_1) with reference lines.` },
    { loId: 'apmacro.changes-ad-as-short-run', content: `PREDICTION ALGORITHM: (1) classify the shock as AD shift or SRAS shift. (2) determine direction (left or right). (3) read off the new equilibrium's effects on Y and P from the diagram. (4) infer effects on UR (cyclical) from change in Y. (5) classify inflation as demand-pull (Y↑) or cost-push (Y↓).` },
    { loId: 'apmacro.changes-ad-as-short-run', kind: 'definition', title: 'demand-pull inflation', content: `inflation driven by an AD shift to the right; price level and real GDP both rise.` },
    { loId: 'apmacro.changes-ad-as-short-run', kind: 'definition', title: 'cost-push inflation', content: `inflation driven by an SRAS shift to the left; price level rises while real GDP falls (stagflation).` },
  ],
  methods: [
    {
      title: 'Worked classify shock',
      steps: [
        `EVENT (a) "Tax cut $500B": tax cut increases disposable income → C rises (and possibly I if business taxes also reduced). AD SHIFTS RIGHTWARD. New equilibrium: P higher, Y higher. UR falls. Inflation: DEMAND-PULL.`,
        `EVENT (b) "Oil price doubles": rising input prices → SRAS SHIFTS LEFTWARD. New equilibrium: P higher, Y LOWER. UR rises. Stagflation. Inflation: COST-PUSH.`,
        `EVENT (c) "Stock crash, household wealth -30%": households feel poorer → C falls (wealth effect). AD SHIFTS LEFTWARD. New equilibrium: P lower, Y lower. UR rises. Inflation falls (potentially deflation). Neither demand-pull nor cost-push (this is "demand-pull DOWNWARD" or "deflationary contraction"). Some texts call this deflationary, demand-driven; AP usually accepts "leftward AD shift causing falling P and Y" without a specific label.`,
        `INTUITION: each shock has a signature (curve + direction). Once you know the signature, the four effects (P, Y, UR, inflation type) follow mechanically.`,
      ],
      example: { problem: `For each event, identify (i) which curve shifts, (ii) the direction, (iii) the effect on price level, (iv) the effect on real GDP, and (v) classify the resulting inflation (or deflation) as demand-pull, cost-push, or neither. Events: (a) The U.S. enacts a $500B tax cut. (b) OPEC announces a major oil-supply cutback, doubling world oil prices. (c) A stock market crash wipes out 30% of household wealth.`, solution: `(a) AD right; P↑ Y↑ UR↓ demand-pull inflation. (b) SRAS left; P↑ Y↓ UR↑ cost-push inflation (stagflation). (c) AD left; P↓ Y↓ UR↑ demand-driven deflation.` },
      relatedLoIds: ['apmacro.changes-ad-as-short-run'],
    },
  ],
  pointers: [
    { content: 'AD right: Y↑, P↑, UR↓. Demand-pull inflation.', kind: 'tip' },
    { content: 'AD left: Y↓, P↓, UR↑. Demand-driven contraction.', kind: 'tip' },
    { content: 'SRAS right: Y↑, P↓, UR↓. Positive supply shock.', kind: 'tip' },
    { content: 'SRAS left: Y↓, P↑, UR↑. Cost-push inflation = STAGFLATION.', kind: 'tip' },
    { content: 'Demand-pull vs cost-push: same P direction, opposite Y direction.', kind: 'tip' },
  ],
};
