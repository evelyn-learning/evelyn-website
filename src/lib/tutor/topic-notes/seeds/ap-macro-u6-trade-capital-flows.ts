/**
 * AP Macroeconomics — Unit 6 CED 6.6: Trade and Capital Flow Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.trade-capital-flows.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_TRADE_CAPITAL_FLOWS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.trade-capital-flows.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.6',
  cedTitle: 'Trade and Capital Flow Relationships',
  planId: 'evelyn.ap.macro.trade-capital-flows.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.trade-capital-flows.v1' }],
  theory: [
    { loId: 'apmacro.trade-capital-flows', content: `BOP IDENTITY (review from U6.1): CA + FA ≈ 0. Current account deficit ⇔ financial account surplus, and vice versa. They are linked by accounting, not by causation in either direction alone.` },
    { loId: 'apmacro.trade-capital-flows', content: `TWIN DEFICITS PATTERN: persistent BUDGET deficit (government spending > revenue) + persistent CA deficit (imports > exports). The U.S. has shown this pattern since the 1980s. Mechanism: budget deficit → loanable funds D right → real rates rise → USD appreciates (FX channel) → exports fall, imports rise → CA deficit widens. The two "twins" emerge through this chain.` },
    { loId: 'apmacro.trade-capital-flows', content: `CAPITAL FLOWS are the FINANCING of the CA deficit. When the U.S. runs a CA deficit, foreigners must accumulate dollar-denominated assets (Treasury bonds, U.S. corporate stocks, real estate). This INCREASES U.S. external indebtedness over time.` },
    { loId: 'apmacro.trade-capital-flows', content: `NET INTERNATIONAL INVESTMENT POSITION (NIIP): the cumulative net asset position of a country with the rest of the world. Persistent CA deficits drive NIIP toward more negative — country owes more to foreigners over time.` },
    { loId: 'apmacro.trade-capital-flows', content: 'IS PERSISTENT CA DEFICIT BAD? DEPENDS. Some perspectives:' },
    { loId: 'apmacro.trade-capital-flows', content: `PERSPECTIVE 1 (concerned): persistent CA deficits accumulate foreign claims on the U.S.; future income is needed to service those claims; eventually the country may face a "sudden stop" if foreign confidence falls (Asian crisis 1997-style). The accumulating debt burden constrains future generations.` },
    { loId: 'apmacro.trade-capital-flows', content: `PERSPECTIVE 2 (sanguine): a CA deficit is the OTHER SIDE of foreign capital INFLOW — foreign investment in the U.S. economy. Foreign capital builds factories, invests in U.S. companies, deepens financial markets. The flip side is a benefit, not just a debt. Plus, the U.S. dollar is the global reserve currency; demand for USD assets is structurally high; the U.S. can run larger deficits than other countries before facing trouble.` },
    { loId: 'apmacro.trade-capital-flows', content: `CAPITAL ACCOUNT REVERSAL (sudden stop): historically, countries with persistent CA deficits financed by foreign capital sometimes face crisis when capital flows reverse abruptly. Examples: Mexico 1994, Asian Tigers 1997, Argentina 2001, Greece 2010. The risk is real for emerging markets; less so (so far) for the U.S. with reserve-currency status.` },
    { loId: 'apmacro.trade-capital-flows', content: `ROLE OF EXCHANGE RATE: a depreciating currency tends to AUTOMATICALLY narrow the CA deficit (cheaper exports, more expensive imports → NX rises → CA improves). Floating exchange rates provide a built-in adjustment mechanism. Fixed-rate countries face more abrupt adjustment when imbalances grow.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'twin deficits', content: `simultaneous government budget deficit and current-account deficit; common pattern for the U.S. since the 1980s.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'net international investment position (NIIP)', content: `a country's cumulative net asset position with the rest of the world; equals foreign-held domestic assets minus domestic-held foreign assets.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'sudden stop', content: `an abrupt reversal of foreign capital flows that can trigger a balance-of-payments crisis.` },
  ],
  methods: [
    {
      title: 'Worked twin deficits',
      steps: [
        `STEP 1 — BUDGET DEFICIT increases. Government borrows more in loanable funds market.`,
        'STEP 2 — LOANABLE FUNDS: D shifts RIGHT. Real interest rate RISES.',
        `STEP 3 — FX MARKET: higher real rates → foreign capital inflow → D_USD shifts RIGHT. USD APPRECIATES.`,
        `STEP 4 — NX EFFECT: stronger dollar → exports fall, imports rise → NX FALLS. The CA (which contains NX) MOVES TOWARD DEFICIT.`,
        `STEP 5 — BOP IDENTITY: CA deficit must be matched by FA surplus. The capital inflow (foreign purchases of U.S. assets — including the new Treasury bonds being issued to finance the deficit!) provides the FA surplus. CA + FA ≈ 0.`,
        `STEP 6 — SYNTHESIS. The same chain produces BOTH the budget deficit AND the trade deficit: government issues bonds → foreigners buy them → USD appreciates → trade deficit widens. The "twin" deficits arise from the same underlying mechanism.`,
        `STEP 7 — IMPLICATION. To address the trade deficit, addressing the budget deficit (reducing government borrowing) is a logical lever — it would lower real rates, depreciate USD, narrow NX deficit. This is one argument for fiscal restraint, especially during boom times. The empirical strength of the twin-deficits link is debated; in some periods (1990s) the link was weak.`,
      ],
      example: { problem: `Country A enacts a large fiscal stimulus financed by deficit borrowing. Trace the chain from the budget deficit to the current-account deficit. Identify the role of: (a) the loanable funds market, (b) the FX market, (c) net exports, (d) the BOP identity.`, solution: `Budget deficit → loanable funds D right → real rates up → USD appreciates → NX falls → CA deficit widens. BOP identity: CA deficit financed by foreign capital inflow (FA surplus).` },
      relatedLoIds: ['apmacro.trade-capital-flows'],
    },
  ],
  pointers: [
    { content: 'BOP identity: CA + FA ≈ 0. Current-account deficit ⇔ financial-account surplus.', kind: 'tip' },
    { content: `Twin deficits: budget deficit + CA deficit, linked via loanable funds → FX → NX chain.`, kind: 'tip' },
    { content: 'Persistent CA deficits accumulate net foreign liabilities (NIIP turns negative).', kind: 'tip' },
    { content: `Sustainability debate: concerned (sudden-stop risk) vs sanguine (capital inflow benefit).`, kind: 'tip' },
    { content: `U.S. exception: reserve-currency status enables larger sustainable deficits than other countries.`, kind: 'tip' },
  ],
};
