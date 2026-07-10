/**
 * AP Macroeconomics — Unit 6 CED 6.1: Balance of Payments.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.balance-of-payments.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.balance-of-payments.v1' }],
  theory: [
    { loId: 'apmacro.balance-of-payments', content: `BALANCE OF PAYMENTS (BOP): the comprehensive accounting record of ALL transactions between a country's residents and the rest of the world in a period. Two main accounts: CURRENT ACCOUNT (CA) and FINANCIAL/CAPITAL ACCOUNT (FA).` },
    { loId: 'apmacro.balance-of-payments', content: `CURRENT ACCOUNT (CA) — "current" cross-border income flows: (a) NET EXPORTS of goods and services (exports − imports); (b) NET INCOME from abroad (interest, dividends, wages received minus paid); (c) NET CURRENT TRANSFERS (remittances, foreign aid).` },
    { loId: 'apmacro.balance-of-payments', content: `TRADE BALANCE = net exports of goods and services — a SUBSET of the current account, and the most-discussed piece. Negative = trade deficit; positive = trade surplus.` },
    { loId: 'apmacro.balance-of-payments', content: `FINANCIAL/CAPITAL ACCOUNT (FA) — cross-border ASSET transactions: (a) DIRECT investment (foreign firms building/buying domestic businesses and vice versa); (b) PORTFOLIO investment (cross-border purchases of stocks and bonds); (c) bank and central-bank holdings (foreign holdings of dollars and Treasuries); (d) official RESERVE assets.` },
    { loId: 'apmacro.balance-of-payments', kind: 'identity', title: 'BOP identity', content: `$CA + FA \\approx 0$. A current-account deficit is matched by a financial-account surplus and vice versa. Holds up to a small statistical discrepancy — near-exact in practice.` },
    { loId: 'apmacro.balance-of-payments', content: `WHY THE IDENTITY HOLDS: when a country imports more than it exports, foreigners end up holding its currency — and they cannot eat it. They use it to BUY that country's ASSETS (bonds, stocks, real estate, bank deposits) — an FA inflow. Every dollar out via CA comes back via FA.` },
    { loId: 'apmacro.balance-of-payments', content: `CLASSIFICATION RULES: trade in goods and services → CA. Cross-border INCOME (a US firm's foreign earnings) → CA. Remittances and aid → CA (transfers). ASSET purchases (factories, Treasuries, stocks, real estate) → FA. Tourism = trade in SERVICES → CA (a US tourist abroad is a service import).` },
    { loId: 'apmacro.balance-of-payments', content: `US PATTERN: persistent CA deficits for roughly four decades, mirrored by heavy foreign investment in US assets — the US is a net DEBTOR to the world. China's persistent CA surpluses financed US deficits largely through Treasury purchases.` },
    { loId: 'apmacro.balance-of-payments', content: `BOP CRISIS: if foreign investors lose confidence and rapidly pull funds (FA collapses) while the CA is still in deficit, the currency must depreciate sharply or reserves drain — a currency crisis (the 1997 Asian financial crisis pattern).` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'balance of payments (BOP)', content: `comprehensive record of all economic transactions between residents of a country and the rest of the world.` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'current account (CA)', content: `BOP component capturing net exports, net income from abroad, and net current transfers.` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'financial account (FA)', content: `BOP component capturing net cross-border asset transactions.` },
    { loId: 'apmacro.balance-of-payments', kind: 'definition', title: 'trade balance', content: `net exports of goods and services; a subset of the current account.` },
  ],
  methods: [
    {
      title: 'Classify a cross-border transaction into CA or FA',
      steps: [
        `STEP 1 — ASK: is it a CURRENT flow (goods, services, income, transfers) or an ASSET transaction (buying/building something that will be owned)?`,
        `STEP 2 — Current flows → CA: exports/imports (including tourism as services), cross-border earnings, remittances, aid.`,
        `STEP 3 — Asset transactions → FA: direct investment (factories, acquisitions), portfolio purchases (stocks, bonds, Treasuries), bank deposits, reserves.`,
        `STEP 4 — TAG the direction from the home country's perspective: money coming in (exports, foreign asset purchases at home) = inflow; money going out (imports, aid given, buying foreign assets) = outflow.`,
      ],
      example: {
        problem: `Classify from the US perspective: (a) US farm exports to China; (b) Toyota builds a factory in Tennessee; (c) a worker in the US remits money to family in Mexico; (d) foreign central banks buy newly issued US Treasuries; (e) an American tourist spends money in Paris; (f) Apple earns iPhone revenue in Europe.`,
        solution: `(a) CA — export inflow. (b) FA — foreign direct investment inflow. (c) CA — current-transfer outflow. (d) FA — foreign purchase of US assets, inflow. (e) CA — service IMPORT (tourism), outflow. (f) CA — income earned abroad, inflow.`,
      },
      relatedLoIds: ['apmacro.balance-of-payments'],
    },
  ],
  pointers: [
    { content: 'CA = trade + cross-border income + transfers. FA = asset transactions. Every flow lands in one.', kind: 'tip' },
    { content: 'BOP identity: CA + FA ≈ 0. A CA deficit is FINANCED by an FA surplus — foreigners buying domestic assets.', kind: 'tip' },
    { content: 'Tourism is trade in SERVICES: a citizen spending abroad is a service import (CA outflow).', kind: 'tip' },
    { content: 'Remittances and foreign aid are CA transfers, not FA.', kind: 'tip' },
    { content: 'Foreign purchases of Treasuries or factories = FA inflow; income those assets later earn = CA.', kind: 'tip' },
  ],
};
