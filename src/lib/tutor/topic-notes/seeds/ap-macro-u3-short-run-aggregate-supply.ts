/**
 * AP Macroeconomics — Unit 3 CED 3.3: Short-Run Aggregate Supply.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.short-run-aggregate-supply.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.short-run-aggregate-supply.v1' }],
  theory: [
    { loId: 'apmacro.short-run-aggregate-supply', content: `SHORT-RUN AGGREGATE SUPPLY (SRAS): the relationship between the price level and the quantity of real GDP that firms are willing to produce IN THE SHORT RUN, when at least some prices and wages are sticky.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `SRAS SLOPES UPWARD. Three classical explanations: (1) STICKY WAGES — wages are set by contracts that don't adjust immediately. When the price level rises, real wages fall (same nominal wage, higher prices); cheaper labor lets firms expand profitably. Quantity supplied rises.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `(2) STICKY PRICES — many firms set prices that don't change instantly (menu costs, contracts, brand consistency). When the aggregate price level rises but a firm's price hasn't adjusted yet, the firm faces relatively higher demand at unchanged price → produces more.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `(3) MISPERCEPTIONS — firms mistake a general price-level rise for an increase in demand for their specific product, leading them to expand production temporarily.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `In all three explanations, the upward slope is TEMPORARY — it disappears in the long run as wages, prices, and expectations adjust. That is why LRAS is vertical (covered next plan).` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `SRAS SHIFTERS — RIGHTWARD (more supply at any price level): falling input prices (lower oil, raw materials, wages), productivity gains, lower business taxes / new subsidies, expected lower future inflation, deregulation reducing production costs.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `SRAS SHIFTERS — LEFTWARD (less supply at any price level — "supply shock"): rising input prices (oil shocks, wage hikes), productivity declines, higher business taxes, expected higher future inflation, supply chain disruptions, natural disasters.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `SUPPLY SHOCK = a sudden non-trivial leftward (or rightward) shift in SRAS. Negative supply shocks (leftward) raise the price level AND lower real GDP simultaneously — STAGFLATION. The 1970s oil crises are textbook examples. AP loves stagflation FRQs.` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `MOVEMENT ALONG SRAS: caused by a change in price level (typically driven by AD shifts).` },
    { loId: 'apmacro.short-run-aggregate-supply', content: `SHIFT OF SRAS: caused by anything else — input prices, productivity, taxes/subsidies, expectations.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'short-run aggregate supply (SRAS)', content: `the upward-sloping relationship between price level and quantity of real GDP firms produce in the short run, when wages and prices are sticky.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'sticky wages', content: `wages that adjust slowly because of long-term contracts, custom, or institutional inertia.` },
    { loId: 'apmacro.short-run-aggregate-supply', kind: 'definition', title: 'supply shock', content: 'a sudden shift in SRAS — typically due to input-price or productivity changes.' },
  ],
  methods: [
    {
      title: 'Worked supply shock',
      steps: [
        `STEP 1 — IDENTIFY the shock. Doubled oil prices = sharp rise in input prices for transportation, manufacturing, agriculture, and many other sectors. This is a NEGATIVE SUPPLY SHOCK.`,
        `STEP 2 — DIRECTION on SRAS: rising input prices SHIFT SRAS LEFT. At any given price level, firms now produce LESS because their costs are higher.`,
        `STEP 3 — NEW SHORT-RUN EQUILIBRIUM. With AD unchanged and SRAS shifted left, the new AD ∩ SRAS occurs at HIGHER price level AND LOWER real GDP. This is STAGFLATION — inflation up, GDP down.`,
        `STEP 4 — UNEMPLOYMENT EFFECT. Lower real GDP means firms hire fewer workers. Cyclical unemployment rises ABOVE the natural rate.`,
        `STEP 5 — POLICY DILEMMA. Standard fiscal/monetary tools struggle here. Expanding AD (rate cuts, fiscal stimulus) addresses the GDP/unemployment side but worsens inflation. Contracting AD addresses inflation but deepens recession. The 1973 and 1979 oil shocks famously trapped Western economies in this dilemma — neither tool helped both problems at once.`,
        `STEP 6 — DIAGRAM. On AD-AS: SRAS shifts LEFT (dashed); AD unchanged. New equilibrium intersects above and to the left of original. Labels: P↑, Y↓.`,
      ],
      example: { problem: `A major oil-producing region experiences a war that disrupts oil exports. The world oil price doubles. Trace the effect on a typical oil-importing country's SRAS curve and on its short-run equilibrium price level and real GDP.`, solution: `Negative supply shock → SRAS shifts LEFT → price level RISES, real GDP FALLS, unemployment RISES = STAGFLATION.` },
      relatedLoIds: ['apmacro.short-run-aggregate-supply'],
    },
  ],
  pointers: [
    { content: `SRAS slopes UP because of sticky wages, sticky prices, misperceptions — all temporary frictions.`, kind: 'tip' },
    { content: 'Shifters: input prices, productivity, taxes/subsidies, expectations.', kind: 'tip' },
    { content: 'Negative supply shock = SRAS LEFT → STAGFLATION (P↑, Y↓, U↑).', kind: 'tip' },
    { content: 'Positive supply shock = SRAS RIGHT → P↓, Y↑.', kind: 'tip' },
    { content: `Movement along = price level change. Shift = anything else affecting cost / capacity.`, kind: 'tip' },
  ],
};
