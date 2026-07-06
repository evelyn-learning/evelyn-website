/**
 * AP Macroeconomics — Unit 3 CED 3.1: Aggregate Demand.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.aggregate-demand.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_AGGREGATE_DEMAND: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.aggregate-demand.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Aggregate Demand',
  planId: 'evelyn.ap.macro.aggregate-demand.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.aggregate-demand.v1' }],
  theory: [
    { loId: 'apmacro.aggregate-demand', content: `AGGREGATE DEMAND (AD): the total quantity of real GDP that buyers want to purchase at each price level. Plotted with PRICE LEVEL on the y-axis and REAL GDP on the x-axis.` },
    { loId: 'apmacro.aggregate-demand', content: `AD COMPONENTS: same as GDP expenditure — AD = C + I + G + NX. Aggregate demand shifts when any of the components changes for a reason OTHER than the price level.` },
    { loId: 'apmacro.aggregate-demand', content: `AD SLOPES DOWNWARD for three reasons. (1) WEALTH EFFECT: as the price level rises, the real value of money holdings and fixed-value assets falls. People feel poorer; they consume less. C falls → AD falls.` },
    { loId: 'apmacro.aggregate-demand', content: `(2) INTEREST RATE EFFECT: as price level rises, households need to hold more money for transactions. Greater money demand → higher interest rates → lower I (firms borrow less for investment) → AD falls.` },
    { loId: 'apmacro.aggregate-demand', content: `(3) EXCHANGE RATE EFFECT: as domestic prices rise, domestic goods become more expensive relative to foreign goods. Exports fall and imports rise, so NX falls → AD falls.` },
    { loId: 'apmacro.aggregate-demand', content: `MOVEMENT ALONG AD: caused by a change in the PRICE LEVEL. We slide up or down the existing AD curve.` },
    { loId: 'apmacro.aggregate-demand', content: `SHIFT OF AD: caused by anything OTHER than the price level changing one of C/I/G/NX. AD moves to a new curve.` },
    { loId: 'apmacro.aggregate-demand', content: `AD SHIFTERS — examples that move AD RIGHTWARD (increase): consumer confidence rises (C up), real interest rates fall (I up), G increases (gov purchases up), tax cuts (C up), tax cuts on investment (I up), foreign incomes rise (NX up via more exports), domestic currency depreciates (NX up via cheaper exports), expansionary monetary policy (I up).` },
    { loId: 'apmacro.aggregate-demand', content: `AD SHIFTERS LEFTWARD (decrease): consumer confidence falls, real interest rates rise, G decreases, tax hikes, foreign recessions, domestic currency appreciates, contractionary monetary policy.` },
    { loId: 'apmacro.aggregate-demand', kind: 'definition', title: 'aggregate demand', content: `the relationship between the price level and the total quantity of real GDP demanded by all buyers.` },
    { loId: 'apmacro.aggregate-demand', kind: 'definition', title: 'wealth effect', content: `as price level rises, real wealth falls, consumption falls — one reason AD slopes downward.` },
  ],
  methods: [
    {
      title: 'Worked shift vs movement',
      steps: [
        `STEP 1 — RULE: a change in the price level causes movement along AD; any other change causes a shift.`,
        `STEP 2 — EVENT (a) "Fed lowers interest rates": this is a NON-PRICE-LEVEL change that increases I (firms borrow more cheaply). AD SHIFTS RIGHTWARD.`,
        `STEP 3 — EVENT (b) "Aggregate price level rises sharply": this is a CHANGE IN PRICE LEVEL. MOVEMENT ALONG AD (upward and to the left, smaller real GDP demanded).`,
        `STEP 4 — EVENT (c) "Foreign incomes rise": foreigners demand more U.S. exports → NX increases (a non-price-level change). AD SHIFTS RIGHTWARD.`,
        `STEP 5 — EVENT (d) "Consumer confidence drops": households save more / spend less → C falls (non-price-level). AD SHIFTS LEFTWARD.`,
        `STEP 6 — INTUITION. Three of four are SHIFTS; one is movement along. AP loves to test "which is which" — confusing the two is a top-3 point-loser on Unit 3 FRQs.`,
      ],
      example: { problem: `For each event, identify whether it causes (i) a movement along the AD curve, or (ii) a shift of AD (specify direction). Justify each. Events: (a) The Fed lowers interest rates. (b) Aggregate price level rises sharply. (c) Foreign incomes rise, increasing demand for U.S. exports. (d) Consumer confidence drops sharply due to recession fears.`, solution: '(a) Shift right. (b) Movement along. (c) Shift right. (d) Shift left.' },
      relatedLoIds: ['apmacro.aggregate-demand'],
    },
  ],
  pointers: [
    { content: 'AD = C + I + G + NX (same components as GDP expenditure approach).', kind: 'tip' },
    { content: 'AD slopes DOWN for three reasons: WEALTH, INTEREST RATE, EXCHANGE RATE effects.', kind: 'tip' },
    { content: 'Movement ALONG AD ← change in price level. SHIFT of AD ← anything else.', kind: 'tip' },
    { content: `Common AD shifters: confidence, interest rates, fiscal policy, foreign income, exchange rate.`, kind: 'tip' },
  ],
};
