/**
 * AP Macroeconomics — Unit 6 CED 6.4: Determinants of Exchange Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fx-determinants.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FX_DETERMINANTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fx-determinants.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Determinants of Exchange Rates',
  planId: 'evelyn.ap.macro.fx-determinants.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-determinants.v1' }],
  theory: [
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 1 — RELATIVE REAL INTEREST RATES (the most-tested driver): a country's real rates rising RELATIVE to others pulls foreign capital IN → demand for its currency rises → APPRECIATION. Rates falling relatively → capital out → depreciation. This is monetary policy's channel into the exchange rate.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 2 — RELATIVE INFLATION (purchasing-power-parity logic): persistently HIGHER inflation than trading partners → the country's goods become uncompetitive at the old rate → export demand and currency demand fall → DEPRECIATION over time. PPP anchors the LONG RUN; short-run deviations can be large.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 3 — RELATIVE ECONOMIC GROWTH: a faster-growing economy attracts foreign investment → currency demand rises → APPRECIATION (often reinforced because strong growth also lifts interest rates).` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 4 — EXPECTATIONS: investors expecting appreciation BUY NOW, raising demand and appreciating the currency before fundamentals move — self-fulfilling. Expected depreciation → sell now → actual depreciation.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 5 — TRADE FLOWS: strong exports earn foreign currency that converts into domestic → demand up → appreciation. Import-heavy trade → domestic currency supplied outward → depreciation.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 6 — RELATIVE TASTES: global preferences shifting TOWARD a country's goods raise demand for its currency (appreciation); shifting away → depreciation. DETERMINANT 7 — GOVERNMENT INTERVENTION: direct central-bank FX purchases/sales, capital controls, peg maintenance.` },
    { loId: 'apmacro.fx-determinants', content: `MEMORY RULE: anything making a country's goods, assets, or returns MORE attractive to foreigners appreciates its currency; anything making foreign goods/assets more attractive to residents depreciates it.` },
    { loId: 'apmacro.fx-determinants', content: `THE TIGHTENING CHAIN (canonical FRQ): central bank raises rates → relative real rates up → foreign capital in → currency demand right → APPRECIATION → exports pricier, imports cheaper → NX falls → AD LEFT. The FX channel REINFORCES contractionary policy beyond its direct I and C effects.` },
    { loId: 'apmacro.fx-determinants', content: `OPEN vs CLOSED ECONOMY POTENCY: monetary policy has THREE channels in an open economy — I, rate-sensitive C, and NX-via-exchange-rate. Expansionary policy depreciates the currency, BOOSTING NX and amplifying the AD shift; contraction appreciates and reinforces the cooling. Monetary policy is MORE potent open than closed.` },
    { loId: 'apmacro.fx-determinants', kind: 'definition', title: 'purchasing power parity (PPP)', content: `long-run principle that exchange rates adjust to equate the cost of identical goods across countries.` },
    { loId: 'apmacro.fx-determinants', kind: 'definition', title: 'relative real interest rates', content: `the gap between a country's real rates and its partners'; the primary short-run exchange-rate driver via capital flows.` },
  ],
  methods: [
    {
      title: 'Map an event to its determinant and predict the currency move',
      steps: [
        `STEP 1 — NAME the determinant operating: relative rates, relative inflation, relative growth, expectations, trade flows, tastes, or intervention.`,
        `STEP 2 — STATE the mechanism in one clause (capital chasing yield; goods losing competitiveness; speculative positioning; export earnings).`,
        `STEP 3 — SHIFT the FX curve (demand for the currency right/left, or supply) and read the rate: more attractive to foreigners → appreciate.`,
        `STEP 4 — If the question continues into the macro economy, chain to NX and AD (appreciation → NX down → AD left).`,
      ],
      example: {
        problem: `Predict the dollar's move: (a) US inflation rises while Europe's stays low; (b) US growth accelerates while Europe is in recession; (c) investors come to expect dollar appreciation; (d) global consumers shift from American to European brands.`,
        solution: `(a) Relative inflation → US goods less competitive → dollar demand falls → DEPRECIATES (PPP logic). (b) Relative growth → capital flows to the US → APPRECIATES. (c) Expectations → buy now → APPRECIATES, self-fulfilling. (d) Tastes → export demand falls → dollar demand left → DEPRECIATES.`,
      },
      relatedLoIds: ['apmacro.fx-determinants'],
    },
    {
      title: 'Trace a monetary-policy change through the FX channel',
      steps: [
        `STEP 1 — RELATIVE RATES: the policy changes the country's real rates versus partners'.`,
        `STEP 2 — CAPITAL FLOW: higher relative rates → inflow (currency demand right); lower → outflow (supply right / demand left).`,
        `STEP 3 — RATE: appreciation with tightening; depreciation with easing.`,
        `STEP 4 — NX: appreciation → exports fall, imports rise → NX down; depreciation → NX up.`,
        `STEP 5 — AD: add the NX effect to the direct I and C channels — the FX channel REINFORCES the policy's direction, making monetary policy stronger in an open economy.`,
      ],
      example: {
        problem: `The Fed raises rates from three to five percent while other central banks hold steady. Trace the dollar, NX, and AD.`,
        solution: `US relative real rates rise → foreign capital inflow → dollar demand right → APPRECIATION → US exports pricier abroad (fall) and imports cheaper (rise) → NX FALLS → AD shifts LEFT, reinforcing the direct contraction from lower I and C. Three channels, one direction.`,
      },
      relatedLoIds: ['apmacro.fx-determinants'],
    },
  ],
  pointers: [
    { content: 'Determinant list: relative real rates, relative inflation, relative growth, expectations, trade flows, tastes, intervention.', kind: 'tip' },
    { content: 'Higher relative real rates → capital inflow → appreciation. The most-tested chain.', kind: 'tip' },
    { content: 'Higher relative inflation → depreciation (PPP, long-run anchor).', kind: 'tip' },
    { content: 'Everything attractive-to-foreigners appreciates the currency; the reverse depreciates it.', kind: 'tip' },
    { content: 'Open economy: the FX-NX channel makes monetary policy MORE potent than closed-economy analysis suggests.', kind: 'tip' },
  ],
};
