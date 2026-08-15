/**
 * AP Macroeconomics — Unit 3 CED 3.4: Long-Run Aggregate Supply.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.long-run-aggregate-supply.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_LONG_RUN_AGGREGATE_SUPPLY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.long-run-aggregate-supply.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Long-Run Aggregate Supply',
  planId: 'evelyn.ap.macro.long-run-aggregate-supply.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.long-run-aggregate-supply.v1' }],
  theory: [
    { loId: 'apmacro.long-run-aggregate-supply', content: `LONG-RUN AGGREGATE SUPPLY (LRAS): a VERTICAL line at POTENTIAL real GDP. The price level (y-axis) does not affect its position — in the long run the economy produces at its potential regardless of prices.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `WHY VERTICAL: in the long run, wages, prices, and expectations FULLY adjust. Sticky wages unstick, menu prices reset, misperceptions resolve — every friction that gave SRAS its upward slope disappears. What remains is real productive capacity, set by RESOURCES and TECHNOLOGY, not prices.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `POTENTIAL GDP: output at FULL EMPLOYMENT (actual UR = natural rate), with all resources used as efficiently as current technology allows. Also called full-employment GDP. LRAS and potential GDP are the same vertical line.` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'shifter-list', title: 'LRAS shifters — rightward (long-run growth)', content: `More LABOR (population growth, immigration, higher participation); more CAPITAL (investment in machines, infrastructure); better TECHNOLOGY (R&D, innovation); better HUMAN CAPITAL (education, training, health); more NATURAL RESOURCES (discoveries); better INSTITUTIONS (rule of law, property rights, low corruption).` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'shifter-list', title: 'LRAS shifters — leftward', content: `Population decline or workforce loss (pandemic, emigration); capital destruction (war); human-capital erosion (failing education, brain drain); resource depletion; institutional collapse.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `SRAS vs LRAS — the conceptual split: SRAS is how much the economy CHOOSES to produce given current price signals under frictions; LRAS is how much it CAN produce given real capacity. AD-side policies (fiscal, monetary) move AD along SRAS — they CANNOT shift LRAS. Only structural/supply-side changes do.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `LONG-RUN NEUTRALITY OF MONEY: a large AD expansion (say monetary stimulus) raises BOTH price level and real GDP in the short run — output moves above potential. Then wages and prices adjust, SRAS shifts LEFT, and output returns to potential at a PERMANENTLY HIGHER price level. Long-run effect: prices up, real GDP unchanged.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `IMPLICATION FOR POLICY: printing money or perpetual stimulus cannot buy long-run growth — it eventually buys only inflation. Long-run real growth comes exclusively from LRAS shifters: resources, technology, human capital, institutions.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `CLASSIFICATION EDGE CASES: a Fed rate cut → AD, NOT LRAS. A minimum-wage hike → SRAS (input costs), not LRAS in standard AP framing. Infrastructure programs shift AD in the short run (G) AND LRAS in the long run (capital stock) — name both when asked.` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'definition', title: 'long-run aggregate supply (LRAS)', content: `a vertical line at potential GDP showing the real output the economy produces in the long run.` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'definition', title: 'potential GDP', content: `the real GDP an economy produces at full employment with all resources fully and efficiently used.` },
  ],
  methods: [
    {
      title: 'Decide whether an event shifts LRAS (and which way)',
      steps: [
        `STEP 1 — ASK: does the event change REAL PRODUCTIVE CAPACITY — labor, capital, technology, human capital, natural resources, institutions? If not, LRAS does not move.`,
        `STEP 2 — AD-side actions (interest-rate changes, transfer checks, confidence swings) shift AD only. Input-cost events (minimum wage, oil prices) shift SRAS. Neither is an LRAS shifter in AP framing.`,
        `STEP 3 — DIRECTION: capacity added (immigration, capital investment, tech breakthrough) → LRAS RIGHT. Capacity destroyed (war losses, workforce decline) → LRAS LEFT.`,
        `STEP 4 — DUAL-EFFECT EVENTS: government infrastructure spending shifts AD right now (G) AND LRAS right later (capital) — credit both.`,
        `STEP 5 — DIAGRAM: move the vertical line; the new long-run equilibrium is AD ∩ new LRAS, with the price level adjusting to that intersection.`,
      ],
      example: {
        problem: `Give the long-run AD-AS effect of: (a) a large immigration wave; (b) an AI productivity breakthrough; (c) a massive infrastructure program; (d) a war destroying a fifth of the nation's factories.`,
        solution: `(a) LRAS RIGHT — more labor. (b) LRAS RIGHT — better technology. (c) LRAS RIGHT — more capital (plus a short-run AD-right effect via G). (d) LRAS LEFT — capital stock destroyed; potential GDP falls.`,
      },
      relatedLoIds: ['apmacro.long-run-aggregate-supply'],
    },
  ],
  pointers: [
    { content: 'LRAS = vertical at potential GDP, independent of the price level.', kind: 'tip' },
    { content: 'LRAS shifters: labor, capital, technology, human capital, natural resources, institutions.', kind: 'tip' },
    { content: 'Fiscal and monetary policy shift AD — they NEVER shift LRAS.', kind: 'tip' },
    { content: 'Long-run: AD shifts change only the price level; real GDP is pinned at potential (money is neutral).', kind: 'tip' },
    { content: 'Infrastructure spending is a dual mover: AD now (G), LRAS later (capital stock).', kind: 'tip' },
  ],
};
