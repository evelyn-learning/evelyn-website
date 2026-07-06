/**
 * AP Macroeconomics — Unit 3 CED 3.4: Long-Run Aggregate Supply.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.long-run-aggregate-supply.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.long-run-aggregate-supply.v1' }],
  theory: [
    { loId: 'apmacro.long-run-aggregate-supply', content: `LONG-RUN AGGREGATE SUPPLY (LRAS): a VERTICAL line at the level of POTENTIAL real GDP. The y-axis (price level) does not affect the x-position because in the long run the economy returns to producing at its potential.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `WHY LRAS IS VERTICAL: in the long run, wages, prices, and expectations FULLY adjust to any change in price level. Sticky wages unstick; menu costs are paid; misperceptions resolve. The frictions that gave SRAS its upward slope all disappear. What remains is the economy's actual productive capacity — determined by RESOURCES and TECHNOLOGY, not by prices.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `POTENTIAL GDP: the level of real output the economy produces at full employment (actual UR = natural rate). At potential, all available resources are being used as efficiently as the current technology allows. Sometimes called full-employment GDP.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `LRAS SHIFTERS — RIGHTWARD (long-run growth): more LABOR (population growth, immigration, increased participation), more CAPITAL (investment in machines, infrastructure), better TECHNOLOGY (R&D, innovation), better HUMAN CAPITAL (education, training, health), more NATURAL RESOURCES (discoveries), better INSTITUTIONS (rule of law, property rights, less corruption).` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `LRAS SHIFTERS — LEFTWARD: opposite of the above. Population decline, capital destruction (war), technology setbacks (rare), human capital loss (poor education systems, brain drain), resource depletion, institutional collapse.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `KEY DISTINCTION: SRAS is about how much the economy CHOOSES to produce given current price-level signals; LRAS is about how much the economy CAN produce given its real productive capacity. AD-side policies (fiscal, monetary) can shift AD and thereby move along SRAS — but they CANNOT shift LRAS. Only structural / supply-side policies do that.` },
    { loId: 'apmacro.long-run-aggregate-supply', content: `IMPLICATION: in the long run, AD shifts only change the PRICE LEVEL, not real GDP. Real GDP is pinned at potential by LRAS. This is why printing money or running endless stimulus eventually only causes inflation, not real growth.` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'definition', title: 'long-run aggregate supply (LRAS)', content: `a vertical line at potential GDP showing the amount of real output the economy produces in the long run.` },
    { loId: 'apmacro.long-run-aggregate-supply', kind: 'definition', title: 'potential GDP', content: `the real GDP an economy produces at full employment with all resources fully and efficiently used.` },
  ],
  methods: [
    {
      title: 'Worked lras shift',
      steps: [
        `STEP 1 — RULE: each event affects the economy's PRODUCTIVE CAPACITY → shifts LRAS. Determine direction.`,
        `STEP 2 — EVENT (a) "Immigration wave": adds LABOR resources. LRAS shifts RIGHT. Long-run potential GDP rises.`,
        `STEP 3 — EVENT (b) "AI productivity breakthrough": better TECHNOLOGY. LRAS shifts RIGHT. Same workforce produces more.`,
        `STEP 4 — EVENT (c) "Infrastructure investment": adds CAPITAL (and may indirectly improve productivity). LRAS shifts RIGHT. (Note: also temporarily shifts AD right via G; the long-run shift is what matters here.)`,
        `STEP 5 — EVENT (d) "War destroys 20% of factories": loses CAPITAL stock. LRAS shifts LEFT. Long-run potential GDP falls.`,
        `STEP 6 — DIAGRAM. On AD-AS, each LRAS shift moves the vertical line. The new long-run equilibrium has AD ∩ new LRAS at the new potential GDP. Price level adjusts to wherever that intersection sits.`,
      ],
      example: { problem: `Explain the long-run effect on the AD-AS model when an economy experiences each of the following: (a) A large wave of immigration that adds to the workforce. (b) A breakthrough in AI raises productivity across many sectors. (c) A massive infrastructure investment program (roads, ports, broadband). (d) A war that destroys 20% of the country's factories.`, solution: '(a) LRAS right. (b) LRAS right. (c) LRAS right. (d) LRAS left.' },
      relatedLoIds: ['apmacro.long-run-aggregate-supply'],
    },
  ],
  pointers: [
    { content: 'LRAS = vertical line at POTENTIAL GDP. Independent of price level.', kind: 'tip' },
    { content: `LRAS shifters: resources (labor, capital, natural), technology, human capital, institutions.`, kind: 'tip' },
    { content: 'AD-side policies (fiscal, monetary) do NOT shift LRAS.', kind: 'tip' },
    { content: `In the long run, AD shifts change PRICE LEVEL only — real GDP is pinned at potential.`, kind: 'tip' },
    { content: 'Money is "neutral" in the long run.', kind: 'tip' },
  ],
};
