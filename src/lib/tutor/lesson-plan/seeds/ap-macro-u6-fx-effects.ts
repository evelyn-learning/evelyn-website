/**
 * AP Macroeconomics — CED Unit 6.5: Effects of Exchange Rate Changes
 * on Net Exports and Aggregate Demand.
 *
 * Trace through how appreciation/depreciation flows into NX and then
 * into AD-AS. AP frequently combines this with monetary or fiscal
 * policy questions.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_FX_EFFECTS: LessonPlan = {
  id: 'evelyn.ap.macro.fx-effects-on-economy.v1',
  title: 'U6.5 Effects of Exchange Rate Changes',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fx-effects-on-economy',
      description:
        'Trace the effect of exchange-rate changes (appreciation or depreciation) on net exports, aggregate demand, real GDP, price level, and unemployment; integrate with monetary and fiscal policy analysis.',
      standard: 'AP-MACRO-6.5',
    },
  ],
  prerequisites: ['apmacro.fx-determinants'],
  followUps: ['apmacro.trade-capital-flows'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect FX market changes to AD-AS outcomes.',
      script:
        "An exchange rate change isn't an isolated currency event — it ripples through net exports into aggregate demand, then into real GDP, price level, and employment. AP wants you to trace the full chain. Master this and FRQs about \"what happens to the economy when the dollar appreciates\" become routine.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-effects',
      kind: 'concept',
      goal: 'Cover the chain from FX to NX to AD to AD-AS, with both directions.',
      keyIdeas: [
        'APPRECIATION → NX FALLS → AD LEFT. Mechanism: stronger currency → exports more expensive abroad → foreign demand for exports falls → EXPORTS decline. Stronger currency → imports cheaper at home → domestic demand for imports rises → IMPORTS rise. NX = exports − imports → NX falls. AD shifts LEFT.',
        'DEPRECIATION → NX RISES → AD RIGHT. Mechanism (mirror image): weaker currency → exports cheaper abroad → exports rise. Weaker currency → imports more expensive at home → imports fall. NX rises. AD shifts RIGHT.',
        'AD-AS EFFECTS. Following the AD shift: (a) APPRECIATION (AD left) → real GDP FALLS, price level FALLS, unemployment RISES. (b) DEPRECIATION (AD right) → real GDP RISES, price level RISES, unemployment FALLS.',
        'INFLATION OPENING. Depreciation has a SECONDARY inflation channel: imported goods become more expensive in domestic currency → import prices rise → contributes to overall inflation. The 2021-22 dollar weakness contributed to U.S. import-led inflation.',
        'POLICY INTERACTION 1 — MONETARY POLICY in OPEN economy. Expansionary monetary (lower rates) → currency depreciation → boosts NX → reinforces AD right. Contractionary monetary → currency appreciation → reduces NX → reinforces AD left. The FX channel makes monetary policy MORE POTENT in open economies.',
        'POLICY INTERACTION 2 — FISCAL POLICY in OPEN economy. Expansionary fiscal (deficit spending) → typically raises real interest rates (crowding-out via loanable funds) → currency APPRECIATES → NX FALLS. The FX channel REDUCES the effectiveness of fiscal policy: some of the fiscal stimulus is offset by lower NX. This is sometimes called the "Mundell-Fleming" or "twin deficits" effect (deficit spending → trade deficit through FX channel).',
        'J-CURVE EFFECT (advanced): in the very short run, depreciation can WORSEN NX before improving it. Why? Quantities respond slowly to price changes (contracts, supply chains, search costs); the immediate effect is that the same export quantity now earns LESS in foreign currency, while the same import quantity now costs MORE. Over months-to-years, quantities adjust and NX improves. AP rarely tests J-curve mechanics.',
      ],
      vocabulary: [
        { term: 'Mundell-Fleming effect', definition: 'in open economies, expansionary fiscal policy is partially offset by currency appreciation reducing NX; reduces fiscal-policy effectiveness.' },
      ],
      suggestedTools: ['foreign_exchange_market', 'aggregate_demand_supply'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-depreciation-trace',
      kind: 'worked_example',
      problem:
        "The U.S. Fed conducts expansionary monetary policy, lowering interest rates significantly. Trace the FULL chain from the rate cut through the FX market and through AD-AS, identifying effects on (i) the dollar, (ii) net exports, (iii) AD, (iv) real GDP, price level, unemployment.",
      steps: [
        'STEP 1 — Fed rate cut. U.S. real interest rates FALL relative to other countries.',
        'STEP 2 — FX MARKET. Lower U.S. rates make U.S. assets less attractive to foreign investors. D_USD shifts LEFT (or S_USD shifts right as U.S. investors look abroad). USD DEPRECIATES.',
        'STEP 3 — NX EFFECT. Weaker dollar → U.S. exports cheaper abroad → exports rise. Weaker dollar → foreign imports more expensive at home → imports fall. NX rises significantly.',
        'STEP 4 — AD-AS. Higher NX shifts AD RIGHTWARD (in addition to the direct AD shift right from lower rates → higher I and C). The two effects ADD together.',
        'STEP 5 — NEW SHORT-RUN EQUILIBRIUM (in AD-AS). Real GDP RISES (more than it would in a closed economy). Price level RISES. Cyclical unemployment FALLS.',
        'STEP 6 — INFLATION CHANNEL. Depreciation also contributes to import-price inflation: dollar-priced imports cost more, raising overall price level beyond just the AD-AS effect.',
        'STEP 7 — TOTAL EFFECT. Expansionary monetary policy in an OPEN economy = direct AD-right (I, C) + reinforced AD-right (NX via depreciation) + import-led inflation. The FX channel makes monetary policy MORE potent than in a closed economy.',
      ],
      answer: 'Fed cuts rates → USD depreciates → NX rises → AD shifts right (above closed-economy effect) → Y up, P up, UR down. FX channel reinforces direct effects.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-direction',
      kind: 'try_yourself',
      problem:
        'For each scenario, identify the effects on (i) NX, (ii) AD direction, (iii) real GDP, (iv) price level, (v) unemployment. (a) The U.S. dollar APPRECIATES sharply. (b) The U.S. dollar DEPRECIATES sharply.',
      expectedAnswer:
        '(a) USD APPRECIATES: (i) NX FALLS (exports more expensive abroad → fall; imports cheaper at home → rise). (ii) AD shifts LEFT (NX is a component of AD). (iii) Real GDP FALLS. (iv) Price level FALLS. (v) Unemployment RISES. Some inflation reduction also from cheaper imports — disinflationary effect. (b) USD DEPRECIATES: (i) NX RISES (exports cheaper → rise; imports more expensive → fall). (ii) AD shifts RIGHT. (iii) Real GDP RISES. (iv) Price level RISES (both AD effect and import-price channel). (v) Unemployment FALLS. Inflationary effect.',
      responseFormat: 'free',
      hints: [
        'Trace the chain: FX → NX → AD → Y/P/UR.',
        'Appreciation hurts exports; depreciation helps them.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-mundell-fleming',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The U.S. government enacts a $500B fiscal stimulus financed by deficit borrowing. Trace the effect through (a) the loanable funds market, (b) the FX market, (c) net exports, and (d) the OVERALL effect on AD compared to what the spending multiplier alone would predict. Why is the FX channel called the Mundell-Fleming effect?',
      expectedAnswer:
        '(a) LOANABLE FUNDS: government deficit borrowing shifts D right. Real interest rate RISES.\n(b) FX MARKET: higher U.S. real rates → foreign capital flows IN (chasing higher yields). D_USD shifts RIGHT. USD APPRECIATES.\n(c) NET EXPORTS: stronger dollar → exports more expensive abroad (fall), imports cheaper at home (rise). NX FALLS.\n(d) AD COMPARISON: the spending multiplier alone predicts AD shift = multiplier × ΔG (e.g., with MPC=0.75, multiplier=4, AD shift would be $2T). BUT: (i) crowding-out from higher rates reduces private I, partially offsetting AD. (ii) FX-channel reduction in NX FURTHER offsets AD. The net AD shift is SMALLER than the spending multiplier predicts. The fiscal stimulus is partially offset by both the I reduction (loanable funds crowding-out) and the NX reduction (FX-channel crowding-out).\n(e) MUNDELL-FLEMING NAME: economists Robert Mundell and Marcus Fleming (1960s) were the first to formalize how exchange-rate flexibility reduces fiscal-policy effectiveness in open economies. The model shows that fiscal expansion under floating exchange rates produces currency appreciation and offsetting NX reduction; fiscal expansion under FIXED exchange rates does not have this offset (because the FX rate is held fixed by central-bank intervention). The Mundell-Fleming effect is one reason large fiscal stimulus is more effective in closed economies (or under fixed exchange rates) than in open economies with floating rates. Strong answers articulate: (i) fiscal expansion → real rates up → currency appreciates → NX falls → AD partially offset; (ii) name the formalism (Mundell-Fleming).',
      responseFormat: 'frq',
      hints: [
        'Trace: deficit → loanable funds → real rates → FX → NX.',
        'Both crowding-out (I) AND FX-NX channel offset fiscal stimulus.',
        'Net AD shift is smaller than multiplier alone predicts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Appreciation → NX falls → AD left → Y down, P down, UR up.',
        'Depreciation → NX rises → AD right → Y up, P up, UR down.',
        'FX channel REINFORCES monetary policy in open economy.',
        'FX channel REDUCES fiscal policy effectiveness (Mundell-Fleming effect).',
        'Depreciation also creates import-price inflation channel.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.5',
    cedTitle: 'Effects of Exchange Rate Changes',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — FX rate effects on NX and AD; Mundell-Fleming.' },
    ],
  },
};
