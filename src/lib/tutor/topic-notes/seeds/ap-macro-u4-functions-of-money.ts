/**
 * AP Macroeconomics — Unit 4 CED 4.3: Definition, Measurement, and Functions of Money.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.functions-of-money.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FUNCTIONS_OF_MONEY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.functions-of-money.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.3',
  cedTitle: 'Definition, Measurement, and Functions of Money',
  planId: 'evelyn.ap.macro.functions-of-money.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.functions-of-money.v1' }],
  theory: [
    { loId: 'apmacro.functions-of-money', content: `THREE FUNCTIONS OF MONEY: (1) MEDIUM OF EXCHANGE — accepted in trade for goods and services. Eliminates barter (which requires "double coincidence of wants"). The most important function in modern economies.` },
    { loId: 'apmacro.functions-of-money', content: `(2) STORE OF VALUE — preserves purchasing power across time. You can hold money today and use it next month. (Inflation erodes this function: high inflation makes money a poor store of value.)` },
    { loId: 'apmacro.functions-of-money', content: `(3) UNIT OF ACCOUNT — a common scale for measuring and comparing prices. "This costs $5; that costs $3" only works because both prices use the same unit. Without a unit of account, every transaction would require recomputing relative values.` },
    { loId: 'apmacro.functions-of-money', content: `COMMODITY MONEY: money whose value comes from the substance itself (gold coins, salt, cigarettes). Has intrinsic value beyond use as money.` },
    { loId: 'apmacro.functions-of-money', content: `FIAT MONEY: money whose value comes only from government decree and social agreement (modern dollars, euros, etc.). Paper has no intrinsic value; we accept it because we know others will accept it. Backed by trust + legal tender laws + the state's tax-collection power.` },
    { loId: 'apmacro.functions-of-money', content: `M1 MONETARY AGGREGATE: the most liquid forms of money. Includes (a) currency in circulation (paper bills + coins held by the public), (b) checking-account deposits, (c) traveler's checks. Roughly the "spendable now" total.` },
    { loId: 'apmacro.functions-of-money', content: `M2 MONETARY AGGREGATE: M1 PLUS less-liquid forms — savings deposits, small time deposits (CDs), retail money market mutual funds. M2 is broader; includes things you can convert to spendable money easily but not instantly.` },
    { loId: 'apmacro.functions-of-money', content: `NOT IN M1 OR M2: stocks, bonds, real estate, large institutional deposits. These are too illiquid or institutional to count in the ordinary money supply.` },
    { loId: 'apmacro.functions-of-money', content: `INFLATION AND MONEY: high inflation undermines money's STORE-OF-VALUE function (purchasing power erodes faster than savings accumulate) and also its UNIT-OF-ACCOUNT function (prices change so fast that comparisons become unreliable). Hyperinflation destroys money's usefulness; people switch to barter or foreign currency.` },
    { loId: 'apmacro.functions-of-money', kind: 'definition', title: 'medium of exchange', content: 'the function of money in being accepted as payment for goods and services.' },
    { loId: 'apmacro.functions-of-money', kind: 'definition', title: 'store of value', content: 'the function of money in preserving purchasing power over time.' },
    { loId: 'apmacro.functions-of-money', kind: 'definition', title: 'unit of account', content: 'the function of money as a common standard for measuring and comparing prices.' },
    { loId: 'apmacro.functions-of-money', kind: 'definition', title: 'M1', content: `the most liquid measure of money supply: currency, checking deposits, traveler's checks.` },
    { loId: 'apmacro.functions-of-money', kind: 'definition', title: 'M2', content: `M1 plus less-liquid forms — savings deposits, small CDs, money market mutual funds.` },
  ],
  methods: [
    {
      title: 'Worked classify aggregate',
      steps: [
        'ITEM 1 — $100 bill: currency in circulation. M1 (and therefore also M2).',
        'ITEM 2 — $5,000 in checking: checking-account deposit. M1 (and M2).',
        'ITEM 3 — $10,000 in savings: savings deposit, less liquid. NOT M1; IS M2.',
        `ITEM 4 — $50,000 in Apple stock: financial asset but not money — too illiquid (price varies, can fall) and not a medium of exchange. NEITHER M1 NOR M2.`,
        'ITEM 5 — $20,000 6-month CD: small time deposit. NOT M1; IS M2.',
        `ITEM 6 — $200 of euro currency: foreign currency held domestically does not count in U.S. M1 or M2. NEITHER (it would count in the eurozone's aggregates).`,
        'ITEM 7 — Value of your car: real asset, not money. NEITHER.',
        `TOTAL M1: $100 + $5,000 = $5,100. TOTAL M2: M1 + $10,000 (savings) + $20,000 (CD) = $35,100.`,
      ],
      example: { problem: `Classify each of the following into (a) M1 only, (b) M2 only (in M2 but not M1), (c) NEITHER M1 NOR M2. Items: $100 bill in your wallet; $5,000 in a checking account; $10,000 in a savings account; $50,000 in shares of Apple stock; a $20,000 6-month CD; $200 of euro currency held domestically; the value of your car.`, solution: `M1 only: $100 bill, checking deposit. M2 (not M1): savings, CD. Neither: stock, euro currency, car.` },
      relatedLoIds: ['apmacro.functions-of-money'],
    },
  ],
  pointers: [
    { content: 'Three functions: MEDIUM OF EXCHANGE, STORE OF VALUE, UNIT OF ACCOUNT.', kind: 'tip' },
    { content: `Anything that fulfills all three functions IS money — currency, checks, gold, even cigarettes (in some contexts).`, kind: 'tip' },
    { content: `M1 = currency + checking + traveler's checks (most liquid).`, kind: 'tip' },
    { content: 'M2 = M1 + savings + small CDs + retail MMMFs.', kind: 'tip' },
    { content: 'Stocks, bonds, real assets are NEITHER M1 nor M2.', kind: 'tip' },
  ],
};
