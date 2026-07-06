/**
 * AP Macroeconomics — Unit 6 CED 6.5: Effects of Exchange Rate Changes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fx-effects-on-economy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-effects-on-economy.v1' }],
  theory: [
    { loId: 'apmacro.fx-effects-on-economy', content: `APPRECIATION → NX FALLS → AD LEFT. Mechanism: stronger currency → exports more expensive abroad → foreign demand for exports falls → EXPORTS decline. Stronger currency → imports cheaper at home → domestic demand for imports rises → IMPORTS rise. NX = exports − imports → NX falls. AD shifts LEFT.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `DEPRECIATION → NX RISES → AD RIGHT. Mechanism (mirror image): weaker currency → exports cheaper abroad → exports rise. Weaker currency → imports more expensive at home → imports fall. NX rises. AD shifts RIGHT.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `AD-AS EFFECTS. Following the AD shift: (a) APPRECIATION (AD left) → real GDP FALLS, price level FALLS, unemployment RISES. (b) DEPRECIATION (AD right) → real GDP RISES, price level RISES, unemployment FALLS.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `INFLATION OPENING. Depreciation has a SECONDARY inflation channel: imported goods become more expensive in domestic currency → import prices rise → contributes to overall inflation. The 2021-22 dollar weakness contributed to U.S. import-led inflation.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `POLICY INTERACTION 1 — MONETARY POLICY in OPEN economy. Expansionary monetary (lower rates) → currency depreciation → boosts NX → reinforces AD right. Contractionary monetary → currency appreciation → reduces NX → reinforces AD left. The FX channel makes monetary policy MORE POTENT in open economies.` },
    { loId: 'apmacro.fx-effects-on-economy', content: `POLICY INTERACTION 2 — FISCAL POLICY in OPEN economy. Expansionary fiscal (deficit spending) → typically raises real interest rates (crowding-out via loanable funds) → currency APPRECIATES → NX FALLS. The FX channel REDUCES the effectiveness of fiscal policy: some of the fiscal stimulus is offset by lower NX. This is sometimes called the "Mundell-Fleming" or "twin deficits" effect (deficit spending → trade deficit through FX channel).` },
    { loId: 'apmacro.fx-effects-on-economy', content: `J-CURVE EFFECT (advanced): in the very short run, depreciation can WORSEN NX before improving it. Why? Quantities respond slowly to price changes (contracts, supply chains, search costs); the immediate effect is that the same export quantity now earns LESS in foreign currency, while the same import quantity now costs MORE. Over months-to-years, quantities adjust and NX improves. AP rarely tests J-curve mechanics.` },
    { loId: 'apmacro.fx-effects-on-economy', kind: 'definition', title: 'Mundell-Fleming effect', content: `in open economies, expansionary fiscal policy is partially offset by currency appreciation reducing NX; reduces fiscal-policy effectiveness.` },
  ],
  methods: [
    {
      title: 'Worked depreciation trace',
      steps: [
        `STEP 1 — Fed rate cut. U.S. real interest rates FALL relative to other countries.`,
        `STEP 2 — FX MARKET. Lower U.S. rates make U.S. assets less attractive to foreign investors. D_USD shifts LEFT (or S_USD shifts right as U.S. investors look abroad). USD DEPRECIATES.`,
        `STEP 3 — NX EFFECT. Weaker dollar → U.S. exports cheaper abroad → exports rise. Weaker dollar → foreign imports more expensive at home → imports fall. NX rises significantly.`,
        `STEP 4 — AD-AS. Higher NX shifts AD RIGHTWARD (in addition to the direct AD shift right from lower rates → higher I and C). The two effects ADD together.`,
        `STEP 5 — NEW SHORT-RUN EQUILIBRIUM (in AD-AS). Real GDP RISES (more than it would in a closed economy). Price level RISES. Cyclical unemployment FALLS.`,
        `STEP 6 — INFLATION CHANNEL. Depreciation also contributes to import-price inflation: dollar-priced imports cost more, raising overall price level beyond just the AD-AS effect.`,
        `STEP 7 — TOTAL EFFECT. Expansionary monetary policy in an OPEN economy = direct AD-right (I, C) + reinforced AD-right (NX via depreciation) + import-led inflation. The FX channel makes monetary policy MORE potent than in a closed economy.`,
      ],
      example: { problem: `The U.S. Fed conducts expansionary monetary policy, lowering interest rates significantly. Trace the FULL chain from the rate cut through the FX market and through AD-AS, identifying effects on (i) the dollar, (ii) net exports, (iii) AD, (iv) real GDP, price level, unemployment.`, solution: `Fed cuts rates → USD depreciates → NX rises → AD shifts right (above closed-economy effect) → Y up, P up, UR down. FX channel reinforces direct effects.` },
      relatedLoIds: ['apmacro.fx-effects-on-economy'],
    },
  ],
  pointers: [
    { content: 'Appreciation → NX falls → AD left → Y down, P down, UR up.', kind: 'tip' },
    { content: 'Depreciation → NX rises → AD right → Y up, P up, UR down.', kind: 'tip' },
    { content: 'FX channel REINFORCES monetary policy in open economy.', kind: 'tip' },
    { content: 'FX channel REDUCES fiscal policy effectiveness (Mundell-Fleming effect).', kind: 'tip' },
    { content: 'Depreciation also creates import-price inflation channel.', kind: 'tip' },
  ],
};
