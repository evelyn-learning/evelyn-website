/**
 * AP Macroeconomics — Unit 6 CED 6.4: Determinants of Exchange Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fx-determinants.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-determinants.v1' }],
  theory: [
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 1 — RELATIVE REAL INTEREST RATES (the most-tested driver). When a country's real rates RISE relative to others, foreign capital flows IN seeking higher returns; D for that currency rises; currency APPRECIATES. When rates fall relative to others, capital flows out; currency DEPRECIATES. This is the channel through which monetary policy affects FX rates.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 2 — RELATIVE INFLATION RATES (purchasing power parity logic). A country with persistently higher inflation than its trading partners sees its currency DEPRECIATE over time. Reason: at the same nominal exchange rate, the higher-inflation country's goods become uncompetitive abroad; demand for its exports falls; D for currency falls; currency depreciates until parity is restored. PPP is a long-run anchor; short-run deviations can be large.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 3 — RELATIVE ECONOMIC GROWTH. A faster-growing economy attracts foreign capital (firms invest where returns are higher); D for currency rises; currency APPRECIATES. Strong growth also typically raises interest rates, reinforcing the appreciation effect.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 4 — EXPECTATIONS. If investors expect a currency to appreciate, they BUY it now (boosting D), causing it to appreciate even before the underlying fundamentals change. Self-fulfilling expectations are a key feature of FX markets.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 5 — TRADE FLOWS / NX. A country with strong exports earns foreign currency that gets converted to domestic — D for domestic currency rises; APPRECIATES. A country importing more than exporting must convert domestic to foreign — S of domestic currency rises; DEPRECIATES.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 6 — RELATIVE TASTES / PREFERENCES. If global consumers shift preferences toward U.S. goods (e.g., iPhones become must-have globally), D for USD rises; USD appreciates.` },
    { loId: 'apmacro.fx-determinants', content: `DETERMINANT 7 — GOVERNMENT INTERVENTION. Direct central-bank intervention in FX markets, capital controls, fixed-rate maintenance.` },
    { loId: 'apmacro.fx-determinants', content: `INTERACTION CASE — TIGHTER U.S. MONETARY POLICY (Fed raises rates): U.S. real rates rise relative to other countries → foreign capital flows in → D_USD shifts RIGHT → USD appreciates. Effects: (a) U.S. exports become more expensive abroad (NX falls); (b) U.S. imports become cheaper (NX falls). (c) AD shifts LEFT (via NX). The FX channel REINFORCES the contractionary effect of higher rates beyond the direct I and C reductions.` },
    { loId: 'apmacro.fx-determinants', kind: 'definition', title: 'purchasing power parity (PPP)', content: `long-run principle that exchange rates adjust to equate the cost of identical goods across countries.` },
  ],
  methods: [
    {
      title: 'Worked fed tightening',
      steps: [
        `STEP 1 — IDENTIFY DETERMINANT. U.S. real rates rise relative to other countries → DETERMINANT 1 (relative real interest rates). Direct effect: foreign capital flows in seeking higher yields.`,
        `STEP 2 — D_USD SHIFTS RIGHT. Foreigners want more USD to buy U.S. Treasury bonds and other dollar-denominated assets. (Some texts also note S_USD shifts left, as American investors keep money home rather than going abroad — same direction effect on rate.)`,
        'STEP 3 — NEW EQUILIBRIUM. Higher exchange rate. USD APPRECIATES.',
        `STEP 4 — IMPLICATION FOR NX. (a) Stronger USD → U.S. exports become more expensive in foreign currency → foreign demand falls → exports DECLINE. (b) Stronger USD → foreign imports become cheaper in dollars → U.S. demand for imports rises → imports INCREASE. (c) NX = exports − imports → both effects → NX FALLS.`,
        `STEP 5 — IMPLICATION FOR AD. NX is a component of AD. NX falls → AD shifts LEFT. This REINFORCES the direct contractionary effect of higher U.S. rates on AD (which already worked via lower I and C).`,
        `STEP 6 — TOTAL CONTRACTIONARY EFFECT. Higher rates have THREE channels reducing AD: (i) lower I (firms borrow less), (ii) lower C (consumers borrow less for durables/houses), (iii) lower NX (USD appreciation). The FX channel is sometimes called the "monetary policy super-channel" because it operates additionally to the standard direct channels.`,
        `STEP 7 — POLICY INSIGHT. AP often tests "what is the EFFECT of monetary policy in an OPEN economy" — answer: bigger than in a closed economy because the FX channel adds to the conventional channels. Same logic in reverse: expansionary monetary policy depreciates the currency, which BOOSTS NX, amplifying the AD-rightward effect.`,
      ],
      example: { problem: `The U.S. Federal Reserve raises interest rates from 3% to 5%. Other major central banks hold rates steady. Trace the FX market effect on the U.S. dollar, then identify the implications for U.S. NX and AD.`, solution: `Fed raises rates → USD appreciates → exports fall, imports rise → NX falls → AD shifts left. FX channel reinforces standard contractionary effect.` },
      relatedLoIds: ['apmacro.fx-determinants'],
    },
  ],
  pointers: [
    { content: `Determinants: relative interest rates, relative inflation, relative growth, expectations, trade flows, tastes.`, kind: 'tip' },
    { content: 'Higher real rates → currency APPRECIATES (capital inflow).', kind: 'tip' },
    { content: 'Higher inflation → currency DEPRECIATES (PPP).', kind: 'tip' },
    { content: 'Stronger growth / better assets → APPRECIATES.', kind: 'tip' },
    { content: 'FX channel adds to monetary policy potency in open economies via NX effect.', kind: 'tip' },
  ],
};
