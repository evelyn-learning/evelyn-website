/**
 * AP Macroeconomics — Unit 6 CED 6.3: The Foreign Exchange Market.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fx-market.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FX_MARKET: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fx-market.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'The Foreign Exchange Market',
  planId: 'evelyn.ap.macro.fx-market.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-market.v1' }],
  theory: [
    { loId: 'apmacro.fx-market', content: `AXES (for the U.S. dollar example): y-axis = EXCHANGE RATE (price of USD in terms of another currency, e.g. EUR per USD). x-axis = QUANTITY OF USD traded.` },
    { loId: 'apmacro.fx-market', content: `DEMAND for USD (D_USD): comes from foreigners (and Americans abroad) wanting to BUY DOLLARS. Sources: (a) foreign demand for U.S. EXPORTS (a foreigner buying U.S. goods needs USD); (b) foreign demand for U.S. ASSETS (foreigners buying U.S. stocks, bonds, real estate); (c) foreign tourists visiting the U.S.; (d) speculators expecting USD to appreciate. SLOPES DOWNWARD: at higher exchange rates (USD more expensive), foreigners need more of their currency to get a USD; quantity demanded falls.` },
    { loId: 'apmacro.fx-market', content: `SUPPLY of USD (S_USD): comes from Americans wanting to convert their dollars to other currencies. Sources: (a) U.S. imports (American buying foreign goods supplies USD to FX market); (b) Americans buying foreign assets; (c) U.S. tourists abroad; (d) speculators expecting USD to depreciate. SLOPES UPWARD: at higher exchange rates (USD worth more in foreign currency), Americans get more foreign goods/assets per dollar — more dollars are supplied to convert. Quantity supplied rises.` },
    { loId: 'apmacro.fx-market', content: `EQUILIBRIUM: where D and S intersect. The equilibrium exchange rate balances foreign demand for dollars (to buy U.S. exports/assets) with American supply (to buy foreign goods/assets).` },
    { loId: 'apmacro.fx-market', content: `WHAT SHIFTS D_USD: factors changing FOREIGN demand for USD. (a) U.S. real interest rates rise → foreign capital flows in → D_USD shifts RIGHT → USD appreciates. (b) U.S. exports become more attractive (better quality, lower prices) → D rights → USD appreciates. (c) Investors expect USD to appreciate → buy now → D right. (d) U.S. economy strengthens, raising attractiveness of U.S. assets → D right.` },
    { loId: 'apmacro.fx-market', content: `WHAT SHIFTS S_USD: factors changing AMERICAN supply of USD. (a) U.S. tastes shift toward foreign goods → S_USD shifts RIGHT → USD depreciates. (b) Foreign interest rates rise → Americans send capital abroad → S_USD right. (c) Investors expect USD to depreciate → sell now → S_USD right.` },
    { loId: 'apmacro.fx-market', content: `CRITICAL: a single event often shifts BOTH D and S. E.g., U.S. interest rates rise: D_USD shifts right (foreign capital in), and S_USD might shift left (U.S. investors keep money home). Both effects cause USD appreciation.` },
    { loId: 'apmacro.fx-market', kind: 'definition', title: 'foreign exchange market', content: `the market in which currencies are traded; demand and supply for each currency determine its exchange rate.` },
  ],
  methods: [
    {
      title: 'Worked shift d',
      steps: [
        `STEP 1 — IDENTIFY THE SOURCE. Foreign purchase of U.S. real estate is FOREIGN DEMAND FOR U.S. ASSETS — a source of D_USD.`,
        'STEP 2 — D_USD SHIFTS RIGHT. At every exchange rate, more dollars are demanded.',
        `STEP 3 — NEW EQUILIBRIUM. With unchanged S_USD and rightward-shifted D_USD, the equilibrium exchange rate (EUR per USD) RISES. The dollar becomes more valuable in EUR terms.`,
        `STEP 4 — DOLLAR APPRECIATES. (USD goes from say 0.90 EUR to 0.95 EUR per dollar.)`,
        `STEP 5 — IMPLICATIONS. (a) U.S. EXPORTS become MORE EXPENSIVE in foreign currency. A $100 U.S. good costs more euros than before. Foreign demand for U.S. exports falls; U.S. exports decline. (b) U.S. IMPORTS become CHEAPER in dollar terms. The same euro of foreign goods now costs fewer dollars. U.S. consumers buy more imports. (c) NX = exports - imports → both effects reduce NX.`,
        `STEP 6 — AD-AS implication. Lower NX means AD shifts LEFT (modestly). However, in an open economy with capital flows, the resulting reduction in U.S. real interest rates can offset some of this — net effect is ambiguous in the short run. AP focuses on the FX market effects directly.`,
      ],
      example: { problem: `A foreign country becomes interested in U.S. real estate as a safe-haven investment, increasing its purchases of U.S. real estate by $100B per year. (a) Identify which curve shifts in the FX market and the direction. (b) Identify the effect on the equilibrium exchange rate (e.g., EUR per USD). (c) State whether the dollar appreciates or depreciates. (d) Identify the implication for U.S. exports and imports.`, solution: `D_USD shifts right → exchange rate rises → USD appreciates → exports fall, imports rise → NX falls.` },
      relatedLoIds: ['apmacro.fx-market'],
    },
  ],
  pointers: [
    { content: 'FX market diagram: y-axis = exchange rate; x-axis = quantity of currency.', kind: 'tip' },
    { content: 'D for currency: from foreigners wanting it (exports, assets, tourism).', kind: 'tip' },
    { content: `S of currency: from domestic residents wanting foreign currency (imports, foreign assets, foreign tourism).`, kind: 'tip' },
    { content: `Higher domestic interest rates / domestic attractiveness → D right → currency appreciates.`, kind: 'tip' },
    { content: 'Domestic preference for foreign goods/assets → S right → currency depreciates.', kind: 'tip' },
  ],
};
