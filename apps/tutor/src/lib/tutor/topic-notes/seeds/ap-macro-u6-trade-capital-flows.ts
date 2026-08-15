/**
 * AP Macroeconomics — Unit 6 CED 6.6: Trade and Capital Flow Relationships.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.trade-capital-flows.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.trade-capital-flows.v1' }],
  theory: [
    { loId: 'apmacro.trade-capital-flows', content: `THE BOP IDENTITY DRIVES EVERYTHING HERE: $CA + FA \\approx 0$. A trade (current-account) deficit and a net capital INFLOW are MIRROR IMAGES — linked by accounting, not by one-way causation. The dollars paid out for excess imports return as foreign purchases of domestic assets.` },
    { loId: 'apmacro.trade-capital-flows', content: `TWIN DEFICITS PATTERN: a persistent BUDGET deficit alongside a persistent CURRENT-ACCOUNT deficit — the US pattern since the nineteen-eighties. MECHANISM: budget deficit → loanable-funds demand right → real rates rise → currency APPRECIATES (capital inflow) → exports fall, imports rise → CA deficit widens. One chain produces both twins.` },
    { loId: 'apmacro.trade-capital-flows', content: `THE FINANCING VIEW: capital inflows ARE the financing of a CA deficit — foreigners accumulate domestic assets (Treasuries, stocks, real estate), often including the very bonds issued to fund the budget deficit. External indebtedness grows over time.` },
    { loId: 'apmacro.trade-capital-flows', content: `NET INTERNATIONAL INVESTMENT POSITION (NIIP): the cumulative net asset position with the rest of the world (foreign-held domestic assets minus domestically held foreign assets). Persistent CA deficits push NIIP increasingly NEGATIVE — the country owes more to foreigners.` },
    { loId: 'apmacro.trade-capital-flows', content: `THE CONCERNED VIEW of persistent CA deficits: accumulating foreign claims require future income to service; if foreign confidence breaks, capital reverses abruptly (a SUDDEN STOP) → sharp depreciation, import-price inflation, possible crisis. Historical cases: Mexico 1994, the Asian Tigers 1997, Argentina 2001, Greece 2010.` },
    { loId: 'apmacro.trade-capital-flows', content: `THE SANGUINE VIEW: a CA deficit is the flip side of foreign capital INFLOW — foreign investment building factories, funding firms, deepening financial markets; a country importing foreign savings to invest beyond its domestic saving. As long as its assets stay attractive, the deficits are sustainable.` },
    { loId: 'apmacro.trade-capital-flows', content: `THE US EXCEPTION: the dollar's RESERVE-CURRENCY status creates structural global demand for dollar assets (trade settlement, central-bank reserves, safety), letting the US run larger, longer deficits than other countries before facing pressure — the "exorbitant privilege." Deep liquid markets and strong rule of law reinforce it.` },
    { loId: 'apmacro.trade-capital-flows', content: `EXCHANGE-RATE ADJUSTMENT: under FLOATING rates, a depreciating currency automatically narrows a CA deficit (cheaper exports, dearer imports → NX rises) — a built-in correction. FIXED-rate countries lack this valve and face more abrupt adjustments when imbalances build.` },
    { loId: 'apmacro.trade-capital-flows', content: `POLICY COROLLARY: shrinking the budget deficit is a logical lever on the trade deficit — less government borrowing → lower real rates → currency depreciates → NX improves. The empirical strength of the twin link varies by era (weak in the nineteen-nineties), so present it as a mechanism, not an iron law.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'twin deficits', content: `simultaneous government budget deficit and current-account deficit; the common US pattern since the nineteen-eighties.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'net international investment position (NIIP)', content: `a country's cumulative net asset position with the rest of the world — foreign-held domestic assets minus domestically held foreign assets.` },
    { loId: 'apmacro.trade-capital-flows', kind: 'definition', title: 'sudden stop', content: `an abrupt reversal of foreign capital flows that can trigger a balance-of-payments crisis.` },
  ],
  methods: [
    {
      title: 'Trace the twin-deficits chain from budget deficit to trade deficit',
      steps: [
        `STEP 1 — LOANABLE FUNDS: the budget deficit shifts borrowing demand right → real interest rate RISES.`,
        `STEP 2 — FX MARKET: higher rates attract foreign capital → demand for the currency right → APPRECIATION.`,
        `STEP 3 — NX: stronger currency → exports fall, imports rise → NX falls → the CURRENT ACCOUNT moves toward deficit.`,
        `STEP 4 — BOP IDENTITY: the CA deficit is financed by the FA surplus — foreign capital inflow, including foreign purchases of the newly issued government bonds. CA + FA ≈ 0 closes the loop.`,
        `STEP 5 — SYNTHESIZE: one mechanism produced both deficits; fiscal consolidation would run the chain in reverse. Note the link's empirical strength varies by period.`,
      ],
      example: {
        problem: `Country A enacts a large deficit-financed fiscal stimulus. Show how its budget deficit produces a current-account deficit, naming the roles of the loanable-funds market, the FX market, net exports, and the BOP identity.`,
        solution: `Deficit → loanable-funds demand right → real r up → foreign capital chases the yield → currency demand right → APPRECIATION → exports fall, imports rise → NX down → CA moves into deficit. Identity: the CA deficit is exactly financed by the FA surplus — foreigners buying Country A's assets, including its new government bonds. Same chain, both twins.`,
      },
      relatedLoIds: ['apmacro.trade-capital-flows'],
    },
  ],
  pointers: [
    { content: 'CA + FA ≈ 0: trade deficits and capital inflows are mirror images by accounting.', kind: 'tip' },
    { content: 'Twin-deficits chain: budget deficit → r↑ → currency appreciates → NX↓ → CA deficit.', kind: 'tip' },
    { content: 'Persistent CA deficits drive NIIP negative — rising net foreign claims on the country.', kind: 'tip' },
    { content: 'Debate: sudden-stop risk (concerned) vs foreign-investment benefit (sanguine) — present both on FRQs.', kind: 'tip' },
    { content: 'US exception = reserve-currency status: structural dollar demand sustains larger deficits.', kind: 'tip' },
    { content: 'Floating rates self-correct CA imbalances via depreciation; fixed regimes adjust abruptly.', kind: 'tip' },
  ],
};
