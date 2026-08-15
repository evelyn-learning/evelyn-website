/**
 * AP Macroeconomics — Unit 3 CED 3.3: Short-Run Aggregate Supply.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.short-run-aggregate-supply.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_SHORT_RUN_AGGREGATE_SUPPLY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.short-run-aggregate-supply.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Short-Run Aggregate Supply',
  planId: 'evelyn.ap.macro.short-run-aggregate-supply.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.short-run-aggregate-supply.v1' }],
  theory: [
    { loId: 'apmacro.short-run-aggregate-supply', content: `SHORT-RUN AGGREGATE SUPPLY (SRAS): the relationship between the price level and the real GDP firms are willing to produce in the SHORT RUN — the horizon over which at least some wages and prices are STICKY. Upward-sloping.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `UPWARD-SLOPE EXPLANATION 1 — STICKY WAGES: wage contracts don't adjust immediately. When the price level rises, REAL wages fall (same nominal wage, higher prices) → labor is effectively cheaper → firms profitably expand output.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `UPWARD-SLOPE EXPLANATION 2 — STICKY PRICES: many firms hold their own prices fixed for a while (menu costs, contracts, brand consistency). When the AGGREGATE price level rises but a firm's price hasn't, that firm faces relatively higher demand at its unchanged price → produces more.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `UPWARD-SLOPE EXPLANATION 3 — MISPERCEPTIONS: firms mistake a GENERAL price-level rise for a rise in demand for THEIR product and expand temporarily. In all three explanations the slope is TEMPORARY — as wages, prices, and expectations adjust, the effect vanishes, which is why LRAS is vertical.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'shifter-list', title: 'SRAS shifters — rightward', content: `Falling input prices (oil, raw materials, wages); productivity gains; LOWER business taxes or NEW subsidies; deregulation cutting production costs; expected lower future inflation.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'shifter-list', title: 'SRAS shifters — leftward (negative supply shock)', content: `Rising input prices (oil shocks, wage hikes); productivity declines; higher business taxes; supply-chain disruptions; natural disasters; expected higher future inflation.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `NEGATIVE SUPPLY SHOCK → STAGFLATION: SRAS shifts LEFT with AD unchanged → new equilibrium at HIGHER price level AND LOWER real GDP; cyclical unemployment rises. Price up, output down, unemployment up simultaneously. Textbook cases: the oil crises of the nineteen-seventies.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `THE STAGFLATION POLICY DILEMMA: AD-side tools cannot fix an SRAS-side problem. Expanding AD helps output/unemployment but WORSENS inflation; contracting AD tames inflation but DEEPENS the recession. Either tool sacrifices one goal — a forced priority choice.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `MOVEMENT vs SHIFT: a price-level change (typically from an AD shift) moves the economy ALONG SRAS. Changes in input prices, productivity, business taxes/subsidies, or inflation expectations SHIFT the curve.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'short-run aggregate supply (SRAS)', content: `the upward-sloping relationship between price level and real GDP produced in the short run, when wages and prices are sticky.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'sticky wages', content: `wages that adjust slowly because of long-term contracts, custom, or institutional inertia.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'supply shock', content: `a sudden shift in SRAS — typically from input-price or productivity changes.` },
  ],
  methods: [
    {
      title: 'Trace a negative supply shock through the AD-AS model',
      steps: [
        `STEP 1 — IDENTIFY the shock as an input-cost or capacity change (oil price spike, disruption) → it hits SRAS, not AD.`,
        `STEP 2 — DIRECTION: higher input costs → SRAS shifts LEFT (less supplied at every price level).`,
        `STEP 3 — NEW EQUILIBRIUM: with AD unchanged, new AD ∩ SRAS sits at HIGHER price level and LOWER real GDP — stagflation.`,
        `STEP 4 — LABOR MARKET: lower output → fewer workers hired → cyclical unemployment rises above the natural rate.`,
        `STEP 5 — POLICY NOTE: state the dilemma — AD expansion helps Y but worsens P; AD contraction helps P but worsens Y. Neither fixes both.`,
        `STEP 6 — DIAGRAM CONVENTION: original SRAS solid, shifted SRAS dashed and primed; mark old and new equilibria with P and Y reference lines.`,
      ],
      example: {
        problem: `A war disrupts oil exports and the world oil price doubles. Trace the effect on an oil-importing country's SRAS, its short-run equilibrium price level and real GDP, and unemployment.`,
        solution: `Doubled oil prices raise input costs economy-wide → SRAS shifts LEFT. New equilibrium: price level RISES, real GDP FALLS, cyclical unemployment RISES — stagflation. Policy is trapped: stimulating AD re-ignites inflation; tightening deepens the downturn.`,
      },
      relatedLoIds: ['apmacro.short-run-aggregate-supply'],
    },
  ],
  pointers: [
    { content: 'SRAS slopes up for three sticky reasons: wages, prices, misperceptions — all temporary frictions.', kind: 'tip' },
    { content: 'SRAS shifters: input prices, productivity, business taxes/subsidies, inflation expectations.', kind: 'tip' },
    { content: 'SRAS LEFT = stagflation: P up, Y down, unemployment up — the oil-shock signature.', kind: 'tip' },
    { content: 'SRAS RIGHT is the best case: more output AND lower prices.', kind: 'tip' },
    { content: 'AD-side tools cannot shift SRAS — stagflation forces a priority choice between inflation and output.', kind: 'tip' },
  ],
};
