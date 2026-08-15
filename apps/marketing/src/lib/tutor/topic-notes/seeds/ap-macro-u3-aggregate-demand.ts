/**
 * AP Macroeconomics — Unit 3 CED 3.1: Aggregate Demand.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.aggregate-demand.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.aggregate-demand.v1' }],
  theory: [
    { loId: 'apmacro.aggregate-demand', content: `AGGREGATE DEMAND (AD): the total quantity of real GDP that all buyers want to purchase at each price level. AXES: PRICE LEVEL on the y-axis, REAL GDP on the x-axis. Downward-sloping.` },
    { loId: 'apmacro.aggregate-demand', content: `AD COMPONENTS: the same four as the GDP expenditure approach — $AD = C + I + G + NX$. AD shifts when any component changes for a reason OTHER than the price level.` },
    { loId: 'apmacro.aggregate-demand', content: `DOWNWARD-SLOPE REASON 1 — WEALTH EFFECT: a higher price level lowers the REAL value of money holdings and fixed-value assets; people feel poorer and consume less. C falls → quantity of real GDP demanded falls.` },
    { loId: 'apmacro.aggregate-demand', content: `DOWNWARD-SLOPE REASON 2 — INTEREST RATE EFFECT: a higher price level makes households hold more money for transactions → money demand rises → interest rates rise → firms borrow and invest less. I falls → quantity demanded falls.` },
    { loId: 'apmacro.aggregate-demand', content: `DOWNWARD-SLOPE REASON 3 — EXCHANGE RATE EFFECT: higher domestic prices make domestic goods expensive relative to foreign goods → exports fall, imports rise. NX falls → quantity demanded falls. Note each reason routes through a DIFFERENT component: C, I, NX.` },
    { loId: 'apmacro.aggregate-demand', content: `MOVEMENT vs SHIFT — the load-bearing rule: a change in the PRICE LEVEL causes movement ALONG the existing AD curve; ANYTHING ELSE that changes C, I, G, or NX SHIFTS the whole curve. Confusing the two is a top point-loser on Unit 3 FRQs.` },
    { loId: 'apmacro.aggregate-demand', kind: 'shifter-list', title: 'AD shifters — rightward (increase)', content: `Consumer confidence rises (C up); real interest rates fall / expansionary monetary policy (I up); government purchases rise (G up); tax cuts (C up, and I up if on business/investment); foreign incomes rise (exports up → NX up); domestic currency DEPRECIATES (exports cheaper abroad → NX up).` },
    { loId: 'apmacro.aggregate-demand', kind: 'shifter-list', title: 'AD shifters — leftward (decrease)', content: `Consumer confidence falls; real interest rates rise / contractionary monetary policy; G falls; tax hikes; foreign recessions cut export demand; domestic currency APPRECIATES; wealth destruction (stock or housing crash) cutting C.` },
    { loId: 'apmacro.aggregate-demand', content: `OPPOSING SIMULTANEOUS SHOCKS: when two events push AD in opposite directions (rate cut → right; confidence collapse → left), the NET direction is INDETERMINATE without knowing relative magnitudes. Say so explicitly — AP rewards identifying both shifts and the magnitude dependence.` },
    { loId: 'apmacro.aggregate-demand', content: `PRECISION TRAP: "AD increased so the price level fell" mixes a SHIFT with a MOVEMENT-ALONG description. Correct account: a rightward AD shift produces a NEW equilibrium with AD ∩ SRAS at HIGHER price level and higher real GDP (standard shapes).` },
    { loId: 'apmacro.aggregate-demand', kind: 'definition', title: 'aggregate demand', content: `the relationship between the price level and the total quantity of real GDP demanded by all buyers.` },
    { loId: 'apmacro.aggregate-demand', kind: 'definition', title: 'wealth effect', content: `as the price level rises, real wealth falls and consumption falls — one of the three reasons AD slopes downward.` },
  ],
  methods: [
    {
      title: 'Classify an event: movement along AD vs shift of AD',
      steps: [
        `STEP 1 — APPLY THE RULE: did the PRICE LEVEL change? If yes → movement ALONG AD. Anything else → SHIFT.`,
        `STEP 2 — For a shift, NAME the component affected (C, I, G, or NX) and the mechanism ("rate cut → cheaper borrowing → I rises").`,
        `STEP 3 — STATE the direction: component up → AD RIGHT; component down → AD LEFT.`,
        `STEP 4 — For multiple simultaneous events, classify each separately; if they oppose, state that the net depends on relative magnitudes.`,
      ],
      example: {
        problem: `Classify each event: (a) the Fed lowers interest rates; (b) the aggregate price level rises sharply; (c) foreign incomes rise, boosting demand for US exports; (d) consumer confidence collapses on recession fears.`,
        solution: `(a) SHIFT RIGHT — non-price-level change raising I. (b) MOVEMENT ALONG AD — the trigger is the price level itself (up the curve to a smaller quantity demanded). (c) SHIFT RIGHT — exports rise → NX up. (d) SHIFT LEFT — households spend less → C down.`,
      },
      relatedLoIds: ['apmacro.aggregate-demand'],
    },
  ],
  pointers: [
    { content: 'AD = C + I + G + NX — the same components as the expenditure approach to GDP.', kind: 'tip' },
    { content: 'Three downward-slope reasons: WEALTH (→C), INTEREST RATE (→I), EXCHANGE RATE (→NX). One component each.', kind: 'tip' },
    { content: 'Price-level change → movement ALONG AD. Everything else → SHIFT. Never mix the two descriptions.', kind: 'tip' },
    { content: 'Currency depreciation shifts AD RIGHT (exports cheaper); appreciation shifts it LEFT.', kind: 'tip' },
    { content: 'Opposing shocks → net direction indeterminate without magnitudes; say so explicitly on FRQs.', kind: 'tip' },
  ],
};
