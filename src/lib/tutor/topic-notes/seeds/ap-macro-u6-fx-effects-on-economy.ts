/**
 * AP Macroeconomics — Unit 6 CED 6.5: Effects of Exchange Rate Changes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fx-effects-on-economy.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FX_EFFECTS_ON_ECONOMY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fx-effects-on-economy.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.5',
  cedTitle: 'Effects of Exchange Rate Changes',
  planId: 'evelyn.ap.macro.fx-effects-on-economy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-effects-on-economy.v1' }],
  theory: [
    { loId: 'apmacro.fx-effects-on-economy', content: `APPRECIATION CHAIN: stronger currency → exports pricier in foreign currency (exports FALL) and imports cheaper at home (imports RISE) → NX FALLS → AD shifts LEFT → real GDP FALLS, price level FALLS, unemployment RISES. Cheaper imports add a disinflationary nudge.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `DEPRECIATION CHAIN (mirror): weaker currency → exports cheaper abroad (rise) and imports pricier at home (fall) → NX RISES → AD shifts RIGHT → real GDP RISES, price level RISES, unemployment FALLS.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `SECONDARY INFLATION CHANNEL of depreciation: imported goods cost more in domestic currency → import-price inflation on top of the AD-driven price rise. Currency weakness feeding import-led inflation is a recurring real-world pattern.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `MONETARY POLICY + FX (reinforcement): expansionary policy lowers rates → currency DEPRECIATES → NX rises → EXTRA AD-right on top of the I and C channels. Contractionary policy appreciates the currency → NX falls → extra AD-left. The FX channel makes monetary policy MORE POTENT in an open economy.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `FISCAL POLICY + FX (offset — the MUNDELL-FLEMING effect): deficit-financed fiscal expansion → real interest rates rise (loanable funds) → currency APPRECIATES → NX FALLS → part of the stimulus is undone. The FX channel REDUCES fiscal effectiveness under floating rates.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `THE FULL FISCAL-OFFSET CHAIN to write on FRQs: deficit → loanable-funds demand right → real r up → foreign capital in → currency demand right → APPRECIATION → exports fall, imports rise → NX down → net AD shift SMALLER than the spending multiplier alone predicts. Two offsets stack: interest-rate crowding out (I) AND the FX-NX channel.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `TWIN LOGIC: the same chain links budget deficits to trade deficits (a preview of 6.6) — deficit spending appreciates the currency and widens the trade gap.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `J-CURVE (advanced, rarely tested): immediately after a depreciation, NX can WORSEN before improving — quantities respond slowly (contracts, supply chains), so the same exports earn less and the same imports cost more at first; over months-to-years quantities adjust and NX improves.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `SUMMARY ASYMMETRY worth memorizing: the FX channel is a FRIEND of monetary policy (reinforces it) and a DRAG on fiscal policy (offsets it) — because monetary policy moves rates and the currency in the reinforcing direction, while fiscal expansion moves rates in the appreciating (offsetting) direction.` },
    { loId: 'apmacro.fx-effects-on-economy', kind: 'definition', title: 'Mundell-Fleming effect', content: `in open economies with floating rates, expansionary fiscal policy is partially offset by currency appreciation reducing NX; reduces fiscal-policy effectiveness.` },
    { loId: 'apmacro.fx-effects-on-economy', kind: 'definition', title: 'J-curve', content: `the pattern where depreciation worsens NX in the very short run (quantities slow to adjust) before improving it.` },
  ],
  methods: [
    {
      title: 'Trace an exchange-rate change through NX into AD-AS',
      steps: [
        `STEP 1 — DIRECTION: appreciation or depreciation? (From an FX-market shift or a policy action.)`,
        `STEP 2 — EXPORTS: appreciation → pricier abroad → fall; depreciation → cheaper → rise.`,
        `STEP 3 — IMPORTS: appreciation → cheaper at home → rise; depreciation → pricier → fall.`,
        `STEP 4 — NX and AD: combine both movements (they always agree on NX's direction) and shift AD accordingly.`,
        `STEP 5 — READ Y, P, UR off AD-AS; for depreciation add the import-price inflation channel.`,
      ],
      example: {
        problem: `The Fed cuts rates sharply. Trace the dollar, net exports, AD, and the short-run macro outcome.`,
        solution: `Lower relative US rates → capital outflow → dollar DEPRECIATES → exports cheaper abroad (rise), imports pricier (fall) → NX RISES → AD shifts RIGHT on top of the direct I/C channels → real GDP up, price level up (plus import-price inflation), unemployment down. Open-economy monetary policy is stronger than closed.`,
      },
      relatedLoIds: ['apmacro.fx-effects-on-economy'],
    },
    {
      title: 'Analyze fiscal stimulus with the Mundell-Fleming offset',
      steps: [
        `STEP 1 — LOANABLE FUNDS: the deficit shifts demand right → real interest rate rises.`,
        `STEP 2 — FX MARKET: higher rates attract foreign capital → currency demand right → APPRECIATION.`,
        `STEP 3 — NX: stronger currency → exports fall, imports rise → NX falls.`,
        `STEP 4 — NET AD: multiplier effect minus TWO offsets — interest-rate crowding out of I, plus the FX-driven NX fall. Net shift is smaller than the multiplier alone predicts.`,
        `STEP 5 — NAME the effect (Mundell-Fleming) and note the regime dependence: under FIXED rates the appreciation offset disappears (the peg blocks it), so fiscal policy is relatively stronger there.`,
      ],
      example: {
        problem: `A government enacts a five-hundred-billion-dollar deficit-financed stimulus. Why is the resulting AD increase smaller than the spending multiplier predicts?`,
        solution: `Deficit borrowing raises real rates → (offset one) private I is crowded out; the higher rates also pull in foreign capital → currency APPRECIATES → exports fall and imports rise → NX drops (offset two, the Mundell-Fleming effect). Net AD = multiplier effect − I offset − NX offset. Under a fixed exchange rate the second offset vanishes.`,
      },
      relatedLoIds: ['apmacro.fx-effects-on-economy'],
    },
  ],
  pointers: [
    { content: 'Appreciation → NX↓ → AD left → Y↓ P↓ UR↑. Depreciation → mirror, plus import-price inflation.', kind: 'tip' },
    { content: 'FX channel REINFORCES monetary policy but OFFSETS fiscal policy (Mundell-Fleming).', kind: 'tip' },
    { content: 'Fiscal FRQ chain: deficit → r↑ → currency appreciates → NX↓ → net AD shift < multiplier prediction.', kind: 'tip' },
    { content: 'Depreciation is inflationary twice: AD-right AND costlier imports.', kind: 'tip' },
    { content: 'J-curve: depreciation can worsen NX briefly before quantities adjust — rarely tested, know the name.', kind: 'tip' },
  ],
};
