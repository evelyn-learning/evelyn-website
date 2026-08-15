/**
 * AP Macroeconomics — CED Unit 6.1: Balance of Payments.
 *
 * Current account vs financial account, the BOP identity, and what each
 * entry represents. Foundation for everything in Unit 6.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_BALANCE_OF_PAYMENTS: LessonPlan = {
  id: 'evelyn.ap.macro.balance-of-payments.v1',
  title: 'U6.1 Balance of Payments',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.balance-of-payments',
      description:
        'Define the current account and the financial (capital) account, identify what each entry represents, apply the BOP identity (CA + FA ≈ 0), and interpret a country\'s position from sample data.',
      standard: 'AP-MACRO-6.1',
    },
  ],
  prerequisites: ['apmacro.public-policy-growth'],
  followUps: ['apmacro.exchange-rates'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the BOP as a country\'s ledger with the rest of the world.',
      script:
        "Every dollar that crosses a U.S. border is recorded somewhere in the Balance of Payments — exports, imports, foreign investment in U.S. companies, U.S. investment abroad, central bank reserve transactions. The BOP is a giant accounting identity: every flow has an equal-and-opposite entry. Once you understand the framework, headlines about 'trade deficits' and 'capital flight' become precisely interpretable.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-bop',
      kind: 'concept',
      goal: 'Cover CA, FA, the BOP identity, and what each entry contains.',
      keyIdeas: [
        'BALANCE OF PAYMENTS (BOP): a comprehensive accounting record of all transactions between residents of a country and the rest of the world during a given period.',
        'TWO MAIN ACCOUNTS: CURRENT ACCOUNT (CA) + FINANCIAL/CAPITAL ACCOUNT (FA). They sum (approximately) to zero by accounting identity: every dollar that flows out via one must come back via the other.',
        'CURRENT ACCOUNT (CA): records "current" cross-border income flows. Components: (a) NET EXPORTS of goods and services (exports − imports). (b) NET INCOME from abroad (interest, dividends, wages received from foreign sources minus same paid to foreigners). (c) NET CURRENT TRANSFERS (foreign aid given/received, remittances).',
        'TRADE BALANCE: a SUBSET of the current account — net exports of goods + services. The most-discussed BOP measure but only one piece. Negative = trade deficit; positive = trade surplus.',
        'FINANCIAL/CAPITAL ACCOUNT (FA): records cross-border ASSET transactions. Components: (a) DIRECT INVESTMENT (foreign companies buying U.S. companies, U.S. companies acquiring foreign businesses). (b) PORTFOLIO INVESTMENT (foreign purchases of U.S. stocks/bonds, U.S. purchases of foreign assets). (c) BANK / CENTRAL-BANK TRANSACTIONS (foreign holdings of U.S. dollars and Treasury bonds; U.S. dollar holdings abroad). (d) RESERVE assets (gold, foreign currency reserves held by the central bank).',
        'THE BOP IDENTITY: CA + FA ≈ 0. Why? When the U.S. imports more than it exports (CA in deficit), it must PAY for the excess imports somehow — by sending dollars abroad that foreigners then use to BUY U.S. assets (bonds, stocks, real estate). FA goes into surplus to offset CA deficit. The identity holds approximately because of measurement errors and "statistical discrepancy" — not a mathematical theorem, but very close in practice.',
        'INTERPRETATION OF U.S. DATA: the U.S. has run persistent CA deficits for ~40 years. By the BOP identity, foreigners have been investing heavily in U.S. assets — U.S. is a net DEBTOR to the world. China has run persistent CA surpluses, financing U.S. CA deficits via U.S. Treasury purchases.',
        'BOP CRISIS: occurs when foreign investors lose confidence and rapidly withdraw funds (FA crashes). With CA still in deficit, currency must depreciate sharply or foreign reserves deplete; sometimes leads to currency crises (e.g. 1997 Asian financial crisis).',
      ],
      vocabulary: [
        { term: 'balance of payments (BOP)', definition: 'comprehensive record of all economic transactions between residents of a country and the rest of the world.' },
        { term: 'current account (CA)', definition: 'BOP component capturing net exports, net income from abroad, and net current transfers.' },
        { term: 'financial account (FA)', definition: 'BOP component capturing net cross-border asset transactions.' },
        { term: 'trade balance', definition: 'net exports of goods and services; a subset of the current account.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bop-classify',
      kind: 'worked_example',
      problem:
        "Classify each of the following transactions as CURRENT ACCOUNT (CA), FINANCIAL ACCOUNT (FA), or NEITHER. (a) U.S. exports $5B of agricultural products to China. (b) Toyota (Japanese) builds a $2B factory in Tennessee. (c) A Mexican farmer sends $500 of remittances to family in Mexico City. (d) The U.S. Treasury issues $50B of bonds, of which $20B is purchased by foreign central banks. (e) An American tourist spends $3000 in Paris. (f) Apple Inc. earns $10B from iPhone sales in Europe.",
      steps: [
        'STEP 1 — RULE: CA = current income flows (trade, income, transfers). FA = asset transactions (investment, bank holdings).',
        'STEP 2 — TRANSACTION (a) "U.S. exports $5B to China": EXPORTS, part of CA (net exports). U.S. CA + $5B (export gain). Money flows FROM China TO U.S. companies.',
        'STEP 3 — TRANSACTION (b) "Toyota builds $2B factory in Tennessee": Toyota is FOREIGN; it is buying / building a U.S. asset. FOREIGN DIRECT INVESTMENT in the U.S. → U.S. FA + $2B. Money flows FROM Japan TO U.S. (to pay workers, contractors, buy land).',
        'STEP 4 — TRANSACTION (c) "Mexican farmer remits $500 to family in Mexico": this is a REMITTANCE — a current transfer. From the U.S. perspective: this is money LEAVING the U.S. as a current transfer to a Mexican resident. U.S. CA - $500 (transfer outflow). Mexican CA + $500.',
        'STEP 5 — TRANSACTION (d) "Foreign central banks purchase $20B U.S. Treasury bonds": foreign purchase of U.S. ASSET. U.S. FA + $20B (foreign investment in U.S. Treasury bonds).',
        'STEP 6 — TRANSACTION (e) "American tourist spends $3000 in Paris": this is U.S. IMPORT of services (tourism). From U.S. perspective: U.S. CA - $3000 (service import).',
        'STEP 7 — TRANSACTION (f) "Apple earns $10B in Europe": this is INCOME EARNED ABROAD by a U.S. company. U.S. CA + $10B (net income from abroad).',
        'STEP 8 — INTUITION. Trade transactions go in CA. Asset purchases (factories, bonds, stocks) go in FA. Remittances/aid are CA transfers. Income earned across borders is CA income. The two accounts together capture every cross-border dollar.',
      ],
      answer: '(a) CA. (b) FA. (c) CA (transfer). (d) FA. (e) CA (service import). (f) CA (income).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-identity',
      kind: 'try_yourself',
      problem:
        'State the BOP identity. Then explain why a country running a CURRENT ACCOUNT DEFICIT must have a FINANCIAL ACCOUNT SURPLUS (or vice versa). Use a concrete example.',
      expectedAnswer:
        'BOP IDENTITY: CA + FA ≈ 0 (approximately, with statistical discrepancy as the small remainder). Equivalently: a CA deficit must be matched by an FA surplus, and a CA surplus by an FA deficit. WHY: when the U.S. imports MORE than it exports (CA deficit), foreigners receive more dollars from U.S. importers than they spend buying U.S. exports. Those foreigners must do SOMETHING with the dollars — they cannot eat them. The most common choice is to BUY U.S. ASSETS: Treasury bonds, U.S. corporate stocks, U.S. real estate, deposits in U.S. banks. Each of these is an FA inflow to the U.S. The total dollars flowing in via FA must equal the dollars flowing out via CA. CONCRETE EXAMPLE: U.S. imports $1T more than it exports each year (CA = -$1T). Foreigners holding those $1T mostly buy U.S. Treasury bonds, U.S. stocks, and U.S. corporate debt — net $1T inflows to U.S. via FA. FA = +$1T. CA + FA = 0. The persistent U.S. CA deficit is mirrored exactly by foreign investment in U.S. assets — making the U.S. an increasingly large net DEBTOR to the rest of the world.',
      responseFormat: 'free',
      hints: [
        'CA + FA ≈ 0 by accounting.',
        'Where do the dollars from imports go?',
        'Foreigners hold dollars or use them to buy U.S. assets — that is the FA.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-additional',
      kind: 'try_yourself',
      problem:
        'For each transaction, classify as CA, FA, or NEITHER, and identify whether it is an INFLOW or OUTFLOW from the U.S. perspective. (a) Saudi government buys $10B of U.S. Treasuries. (b) Walmart imports $50B of consumer goods from China. (c) U.S. provides $5B of foreign aid to a developing country. (d) A U.S. mutual fund buys $1B of European stocks.',
      expectedAnswer:
        '(a) "Saudi buys U.S. Treasuries": FA — INFLOW. Foreign purchase of U.S. asset. (b) "Walmart imports $50B from China": CA — OUTFLOW. Import; U.S. CA decreases (ingoods balance). (c) "$5B foreign aid OUT": CA — OUTFLOW. Current transfer leaving the U.S. (d) "U.S. fund buys European stocks": FA — OUTFLOW. U.S. resident purchasing foreign asset.',
      responseFormat: 'free',
      hints: [
        'CA = current income flows. FA = asset transactions.',
        'Inflow/outflow tracks money direction relative to the U.S.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'BOP records all cross-border transactions.',
        'CA: net exports + net income from abroad + net transfers.',
        'FA: cross-border asset transactions (investment, bonds, deposits).',
        'BOP identity: CA + FA ≈ 0.',
        'CA deficit + FA surplus go together. Imports of goods financed by foreign asset purchases.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.1',
    cedTitle: 'Balance of Payments',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — balance of payments structure and identity.' },
    ],
  },
};
