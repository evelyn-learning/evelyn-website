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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fx-market.v1' }],
  theory: [
    { loId: 'apmacro.fx-market', content: `THE FX MARKET IS AN ORDINARY SUPPLY-AND-DEMAND MARKET. AXES (dollar example): y-axis = EXCHANGE RATE (price of the dollar in the other currency, e.g. euros per dollar); x-axis = QUANTITY of dollars traded.` },
    { loId: 'apmacro.fx-market', content: `DEMAND FOR DOLLARS comes from FOREIGNERS wanting to acquire dollars: (a) to buy US EXPORTS; (b) to buy US ASSETS (stocks, bonds, real estate); (c) foreign tourists visiting the US; (d) speculators expecting the dollar to appreciate.` },
    { loId: 'apmacro.fx-market', content: `WHY DEMAND SLOPES DOWN: at a higher exchange rate the dollar costs more foreign currency, so US goods and assets are pricier for foreigners → quantity of dollars demanded falls.` },
    { loId: 'apmacro.fx-market', content: `SUPPLY OF DOLLARS comes from AMERICANS converting dollars into other currencies: (a) to buy IMPORTS; (b) to buy FOREIGN assets; (c) US tourists abroad; (d) speculators expecting the dollar to depreciate. Foreigners do not supply dollars — they don't start with them; they DEMAND them.` },
    { loId: 'apmacro.fx-market', content: `WHY SUPPLY SLOPES UP: at a higher exchange rate each dollar buys more foreign goods and assets, so Americans convert more dollars → quantity supplied rises.` },
    { loId: 'apmacro.fx-market', content: `EQUILIBRIUM: where demand meets supply — the rate that balances foreign desire for dollars (exports/assets/tourism) against American conversion of dollars (imports/foreign assets/travel).` },
    { loId: 'apmacro.fx-market', kind: 'shifter-list', title: 'demand-for-dollar shifters (D right → appreciate)', content: `US real interest rates RISE (foreign capital inflow); US exports become more attractive; expectations of dollar appreciation (self-fulfilling buying); a strengthening US economy raising asset attractiveness; more foreign tourism to the US.` },
    { loId: 'apmacro.fx-market', kind: 'shifter-list', title: 'supply-of-dollar shifters (S right → depreciate)', content: `US tastes shift toward foreign goods (more imports); FOREIGN interest rates rise (Americans send capital abroad); expectations of dollar depreciation (sell now); more US tourism abroad.` },
    { loId: 'apmacro.fx-market', content: `ONE EVENT CAN SHIFT BOTH CURVES: a US interest-rate rise shifts demand for dollars RIGHT (foreign capital in) AND supply LEFT (US investors keep money home) — both push the same way: appreciation. Expectations events likewise admit either-curve treatment; AP accepts either as long as the rate direction is right.` },
    { loId: 'apmacro.fx-market', content: `DOWNSTREAM LINK (preview of 6.5): appreciation makes exports pricier abroad and imports cheaper at home → NX falls → a leftward nudge to AD. Depreciation is the mirror image.` },
    { loId: 'apmacro.fx-market', kind: 'definition', title: 'foreign exchange market', content: `the market in which currencies are traded; demand and supply for each currency determine its exchange rate.` },
  ],
  methods: [
    {
      title: 'Classify an event into an FX-market shift and read the rate',
      steps: [
        `STEP 1 — WHO is acting? Foreigners acquiring the currency → DEMAND side. Domestic residents converting away from it → SUPPLY side.`,
        `STEP 2 — DIRECTION: more foreign appetite for the currency → D right; less → D left. More domestic conversion outward → S right; less → S left.`,
        `STEP 3 — READ the new equilibrium: D right or S left → exchange rate RISES → currency APPRECIATES. D left or S right → depreciates.`,
        `STEP 4 — TRACE the trade consequence if asked: appreciation → exports fall / imports rise → NX falls (and the reverse for depreciation).`,
      ],
      example: {
        problem: `Foreign investors sharply increase purchases of US real estate as a safe haven. Which curve shifts in the dollar's FX market, what happens to the exchange rate, and what does it mean for US exports and imports?`,
        solution: `Foreign purchases of US ASSETS are demand for dollars → D shifts RIGHT → equilibrium exchange rate rises → the dollar APPRECIATES. Consequence: US exports become more expensive in foreign currency (exports fall) while imports become cheaper in dollars (imports rise) → NX falls.`,
      },
      relatedLoIds: ['apmacro.fx-market'],
    },
  ],
  pointers: [
    { content: 'Demand for a currency = FOREIGNERS wanting it (exports, assets, tourism). Supply = RESIDENTS converting it away (imports, foreign assets, travel).', kind: 'tip' },
    { content: 'Higher domestic interest rates or asset attractiveness → D right → appreciation.', kind: 'tip' },
    { content: 'Domestic taste for foreign goods or higher foreign rates → S right → depreciation.', kind: 'tip' },
    { content: 'Expectations are self-fulfilling: expected appreciation → buy now → actual appreciation.', kind: 'tip' },
    { content: 'One event can move both curves (rate rise: D right AND S left) — both reinforce the same rate direction.', kind: 'tip' },
  ],
};
