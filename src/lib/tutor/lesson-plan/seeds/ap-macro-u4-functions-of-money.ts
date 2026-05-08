/**
 * AP Macroeconomics — CED Unit 4.3: Definition, Measurement, and
 * Functions of Money.
 *
 * Three functions of money (medium of exchange, store of value, unit of
 * account) plus monetary aggregates (M1, M2). Sets up the money market.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_FUNCTIONS_OF_MONEY: LessonPlan = {
  id: 'evelyn.ap.macro.functions-of-money.v1',
  title: 'U4.3 Definition, Measurement, and Functions of Money',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.functions-of-money',
      description:
        'Identify the three functions of money (medium of exchange, store of value, unit of account), distinguish M1 from M2, and explain why high inflation undermines money\'s store-of-value function.',
      standard: 'AP-MACRO-4.3',
    },
  ],
  prerequisites: ['apmacro.nominal-vs-real-interest-rates'],
  followUps: ['apmacro.banking-money-creation'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame money by what it does, not what it looks like.',
      script:
        "What makes a thing \"money\"? It's not that it's printed, or made of metal, or stored on a hard drive. It's that the thing does THREE things: lets you BUY stuff, holds VALUE between trades, and gives you a common UNIT to compare prices in. Anything that does those three things — gold, dollar bills, bank deposits, even cigarettes in a prison camp — IS money. Anything that fails at any of them is not.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-money',
      kind: 'concept',
      goal: 'Cover the three functions, monetary aggregates, and inflation\'s effect.',
      keyIdeas: [
        'THREE FUNCTIONS OF MONEY: (1) MEDIUM OF EXCHANGE — accepted in trade for goods and services. Eliminates barter (which requires "double coincidence of wants"). The most important function in modern economies.',
        '(2) STORE OF VALUE — preserves purchasing power across time. You can hold money today and use it next month. (Inflation erodes this function: high inflation makes money a poor store of value.)',
        '(3) UNIT OF ACCOUNT — a common scale for measuring and comparing prices. "This costs $5; that costs $3" only works because both prices use the same unit. Without a unit of account, every transaction would require recomputing relative values.',
        'COMMODITY MONEY: money whose value comes from the substance itself (gold coins, salt, cigarettes). Has intrinsic value beyond use as money.',
        'FIAT MONEY: money whose value comes only from government decree and social agreement (modern dollars, euros, etc.). Paper has no intrinsic value; we accept it because we know others will accept it. Backed by trust + legal tender laws + the state\'s tax-collection power.',
        'M1 MONETARY AGGREGATE: the most liquid forms of money. Includes (a) currency in circulation (paper bills + coins held by the public), (b) checking-account deposits, (c) traveler\'s checks. Roughly the "spendable now" total.',
        'M2 MONETARY AGGREGATE: M1 PLUS less-liquid forms — savings deposits, small time deposits (CDs), retail money market mutual funds. M2 is broader; includes things you can convert to spendable money easily but not instantly.',
        'NOT IN M1 OR M2: stocks, bonds, real estate, large institutional deposits. These are too illiquid or institutional to count in the ordinary money supply.',
        'INFLATION AND MONEY: high inflation undermines money\'s STORE-OF-VALUE function (purchasing power erodes faster than savings accumulate) and also its UNIT-OF-ACCOUNT function (prices change so fast that comparisons become unreliable). Hyperinflation destroys money\'s usefulness; people switch to barter or foreign currency.',
      ],
      vocabulary: [
        { term: 'medium of exchange', definition: 'the function of money in being accepted as payment for goods and services.' },
        { term: 'store of value', definition: 'the function of money in preserving purchasing power over time.' },
        { term: 'unit of account', definition: 'the function of money as a common standard for measuring and comparing prices.' },
        { term: 'M1', definition: 'the most liquid measure of money supply: currency, checking deposits, traveler\'s checks.' },
        { term: 'M2', definition: 'M1 plus less-liquid forms — savings deposits, small CDs, money market mutual funds.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify-aggregate',
      kind: 'worked_example',
      problem:
        'Classify each of the following into (a) M1 only, (b) M2 only (in M2 but not M1), (c) NEITHER M1 NOR M2. Items: $100 bill in your wallet; $5,000 in a checking account; $10,000 in a savings account; $50,000 in shares of Apple stock; a $20,000 6-month CD; $200 of euro currency held domestically; the value of your car.',
      steps: [
        'ITEM 1 — $100 bill: currency in circulation. M1 (and therefore also M2).',
        'ITEM 2 — $5,000 in checking: checking-account deposit. M1 (and M2).',
        'ITEM 3 — $10,000 in savings: savings deposit, less liquid. NOT M1; IS M2.',
        'ITEM 4 — $50,000 in Apple stock: financial asset but not money — too illiquid (price varies, can fall) and not a medium of exchange. NEITHER M1 NOR M2.',
        'ITEM 5 — $20,000 6-month CD: small time deposit. NOT M1; IS M2.',
        'ITEM 6 — $200 of euro currency: foreign currency held domestically does not count in U.S. M1 or M2. NEITHER (it would count in the eurozone\'s aggregates).',
        'ITEM 7 — Value of your car: real asset, not money. NEITHER.',
        'TOTAL M1: $100 + $5,000 = $5,100. TOTAL M2: M1 + $10,000 (savings) + $20,000 (CD) = $35,100.',
      ],
      answer: 'M1 only: $100 bill, checking deposit. M2 (not M1): savings, CD. Neither: stock, euro currency, car.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-three-functions',
      kind: 'try_yourself',
      problem:
        'Name the three functions of money and give one specific example for each function (using ordinary U.S. dollars or any other currency).',
      expectedAnswer:
        'MEDIUM OF EXCHANGE: example — paying $5 for a coffee. Money is accepted in trade for the coffee; the seller takes the money knowing they can use it elsewhere. STORE OF VALUE: example — earning $1000 today, depositing it, and using it for groceries next month. The dollars hold their purchasing power across the time gap. (Limited by inflation — if inflation is high, this function deteriorates.) UNIT OF ACCOUNT: example — comparing two cars, one priced at $25,000 and another at $30,000. The dollar serves as the common scale that makes the comparison meaningful. Without a shared unit, the comparison would require knowing how many cows the cars cost, or how many bushels of wheat, etc.',
      responseFormat: 'free',
      hints: [
        'Medium of exchange = accepting it in trade.',
        'Store of value = holding it across time.',
        'Unit of account = using it to measure prices.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-hyperinflation',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. During hyperinflation (e.g. Weimar Germany 1923, Zimbabwe 2008), money loses much of its usefulness — people switch to bartering, holding foreign currency, or using physical goods as substitutes. Using the THREE FUNCTIONS framework, explain WHY hyperinflation breaks money so badly.',
      expectedAnswer:
        'Hyperinflation undermines all three functions but most damages STORE OF VALUE and UNIT OF ACCOUNT, with knock-on effects on MEDIUM OF EXCHANGE. (1) STORE OF VALUE: when prices double weekly or daily, money held for even a short period rapidly loses purchasing power. People rush to spend money the moment they receive it; saving in domestic currency is irrational. The store-of-value function COLLAPSES. (2) UNIT OF ACCOUNT: when prices change daily or hourly, comparisons become unreliable. A price quoted yesterday is meaningless today; menus and price lists must be reprinted constantly. Comparing two products\' prices requires real-time information. The unit-of-account function DEGRADES. (3) MEDIUM OF EXCHANGE: as the first two functions break, sellers become reluctant to accept the currency at all (they expect it to lose value before they can spend it). Some refuse it entirely; others demand foreign currency or commodities. The medium-of-exchange function ALSO collapses. People switch to bartering (clumsy but at least involves real goods) or to a foreign currency (e.g., U.S. dollars in Zimbabwe) that retains its functions. Hyperinflation is so destructive because it doesn\'t just raise prices — it breaks the social technology of money itself, forcing economies to rebuild trade arrangements from scratch. Strong answers explicitly walk through each function being undermined and connect the cascade.',
      responseFormat: 'frq',
      hints: [
        'Trace each function and ask whether hyperinflation breaks it.',
        'Why might one function failing make the others fail too?',
        'What do people DO when money breaks?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three functions: MEDIUM OF EXCHANGE, STORE OF VALUE, UNIT OF ACCOUNT.',
        'Anything that fulfills all three functions IS money — currency, checks, gold, even cigarettes (in some contexts).',
        'M1 = currency + checking + traveler\'s checks (most liquid).',
        'M2 = M1 + savings + small CDs + retail MMMFs.',
        'Stocks, bonds, real assets are NEITHER M1 nor M2.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.3',
    cedTitle: 'Definition, Measurement, and Functions of Money',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '13', note: 'OpenStax Macro AP — money definitions and aggregates.' },
    ],
  },
};
