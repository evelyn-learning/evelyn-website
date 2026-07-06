/**
 * AP Macroeconomics — Unit 6 CED 6.1: Balance of Payments.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.balance-of-payments.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_BALANCE_OF_PAYMENTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.balance-of-payments.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Balance of Payments',
  planId: 'evelyn.ap.macro.balance-of-payments.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.balance-of-payments.v1' }],
  theory: [
    { loId: 'apmacro.balance-of-payments', content: `BALANCE OF PAYMENTS (BOP): a comprehensive accounting record of all transactions between residents of a country and the rest of the world during a given period.` },
    { loId: 'apmacro.balance-of-payments', content: `TWO MAIN ACCOUNTS: CURRENT ACCOUNT (CA) + FINANCIAL/CAPITAL ACCOUNT (FA). They sum (approximately) to zero by accounting identity: every dollar that flows out via one must come back via the other.` },
    { loId: 'apmacro.balance-of-payments', content: `CURRENT ACCOUNT (CA): records "current" cross-border income flows. Components: (a) NET EXPORTS of goods and services (exports − imports). (b) NET INCOME from abroad (interest, dividends, wages received from foreign sources minus same paid to foreigners). (c) NET CURRENT TRANSFERS (foreign aid given/received, remittances).` },
    { loId: 'apmacro.balance-of-payments', content: `TRADE BALANCE: a SUBSET of the current account — net exports of goods + services. The most-discussed BOP measure but only one piece. Negative = trade deficit; positive = trade surplus.` },
    { loId: 'apmacro.balance-of-payments', content: `FINANCIAL/CAPITAL ACCOUNT (FA): records cross-border ASSET transactions. Components: (a) DIRECT INVESTMENT (foreign companies buying U.S. companies, U.S. companies acquiring foreign businesses). (b) PORTFOLIO INVESTMENT (foreign purchases of U.S. stocks/bonds, U.S. purchases of foreign assets). (c) BANK / CENTRAL-BANK TRANSACTIONS (foreign holdings of U.S. dollars and Treasury bonds; U.S. dollar holdings abroad). (d) RESERVE assets (gold, foreign currency reserves held by the central bank).` },
    { loId: 'apmacro.balance-of-payments', content: `THE BOP IDENTITY: CA + FA ≈ 0. Why? When the U.S. imports more than it exports (CA in deficit), it must PAY for the excess imports somehow — by sending dollars abroad that foreigners then use to BUY U.S. assets (bonds, stocks, real estate). FA goes into surplus to offset CA deficit. The identity holds approximately because of measurement errors and "statistical discrepancy" — not a mathematical theorem, but very close in practice.` },
    { loId: 'apmacro.balance-of-payments', content: `INTERPRETATION OF U.S. DATA: the U.S. has run persistent CA deficits for ~40 years. By the BOP identity, foreigners have been investing heavily in U.S. assets — U.S. is a net DEBTOR to the world. China has run persistent CA surpluses, financing U.S. CA deficits via U.S. Treasury purchases.` },
    { loId: 'apmacro.balance-of-payments', content: `BOP CRISIS: occurs when foreign investors lose confidence and rapidly withdraw funds (FA crashes). With CA still in deficit, currency must depreciate sharply or foreign reserves deplete; sometimes leads to currency crises (e.g. 1997 Asian financial crisis).` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'balance of payments (BOP)', content: `comprehensive record of all economic transactions between residents of a country and the rest of the world.` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'current account (CA)', content: `BOP component capturing net exports, net income from abroad, and net current transfers.` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'financial account (FA)', content: 'BOP component capturing net cross-border asset transactions.' },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'trade balance', content: 'net exports of goods and services; a subset of the current account.' },
  ],
  methods: [
    {
      title: 'Worked bop classify',
      steps: [
        `STEP 1 — RULE: CA = current income flows (trade, income, transfers). FA = asset transactions (investment, bank holdings).`,
        `STEP 2 — TRANSACTION (a) "U.S. exports $5B to China": EXPORTS, part of CA (net exports). U.S. CA + $5B (export gain). Money flows FROM China TO U.S. companies.`,
        `STEP 3 — TRANSACTION (b) "Toyota builds $2B factory in Tennessee": Toyota is FOREIGN; it is buying / building a U.S. asset. FOREIGN DIRECT INVESTMENT in the U.S. → U.S. FA + $2B. Money flows FROM Japan TO U.S. (to pay workers, contractors, buy land).`,
        `STEP 4 — TRANSACTION (c) "Mexican farmer remits $500 to family in Mexico": this is a REMITTANCE — a current transfer. From the U.S. perspective: this is money LEAVING the U.S. as a current transfer to a Mexican resident. U.S. CA - $500 (transfer outflow). Mexican CA + $500.`,
        `STEP 5 — TRANSACTION (d) "Foreign central banks purchase $20B U.S. Treasury bonds": foreign purchase of U.S. ASSET. U.S. FA + $20B (foreign investment in U.S. Treasury bonds).`,
        `STEP 6 — TRANSACTION (e) "American tourist spends $3000 in Paris": this is U.S. IMPORT of services (tourism). From U.S. perspective: U.S. CA - $3000 (service import).`,
        `STEP 7 — TRANSACTION (f) "Apple earns $10B in Europe": this is INCOME EARNED ABROAD by a U.S. company. U.S. CA + $10B (net income from abroad).`,
        `STEP 8 — INTUITION. Trade transactions go in CA. Asset purchases (factories, bonds, stocks) go in FA. Remittances/aid are CA transfers. Income earned across borders is CA income. The two accounts together capture every cross-border dollar.`,
      ],
      example: { problem: `Classify each of the following transactions as CURRENT ACCOUNT (CA), FINANCIAL ACCOUNT (FA), or NEITHER. (a) U.S. exports $5B of agricultural products to China. (b) Toyota (Japanese) builds a $2B factory in Tennessee. (c) A Mexican farmer sends $500 of remittances to family in Mexico City. (d) The U.S. Treasury issues $50B of bonds, of which $20B is purchased by foreign central banks. (e) An American tourist spends $3000 in Paris. (f) Apple Inc. earns $10B from iPhone sales in Europe.`, solution: `(a) CA. (b) FA. (c) CA (transfer). (d) FA. (e) CA (service import). (f) CA (income).` },
      relatedLoIds: ['apmacro.balance-of-payments'],
    },
  ],
  pointers: [
    { content: 'BOP records all cross-border transactions.', kind: 'tip' },
    { content: 'CA: net exports + net income from abroad + net transfers.', kind: 'tip' },
    { content: 'FA: cross-border asset transactions (investment, bonds, deposits).', kind: 'tip' },
    { content: 'BOP identity: CA + FA ≈ 0.', kind: 'tip' },
    { content: `CA deficit + FA surplus go together. Imports of goods financed by foreign asset purchases.`, kind: 'tip' },
  ],
};
