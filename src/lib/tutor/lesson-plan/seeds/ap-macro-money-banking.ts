/**
 * AP Macroeconomics — Money, banking, and the Federal Reserve.
 *
 * Money supply, fractional reserve banking, the Fed's tools.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MACRO_MONEY_BANKING: LessonPlan = {
  id: 'evelyn.ap.macro.money-banking-fed.v1',
  title: 'Money, banking, and the Federal Reserve',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.money-banking',
      description: 'Describe money creation through fractional reserve banking and the Fed\'s monetary policy tools.',
      standard: 'AP-MACRO-4',
    },
  ],
  prerequisites: ['apmacro.ad-as'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Banks CREATE money — and the Fed regulates the process.',
      script: 'When you deposit $100 in a bank, the bank doesn\'t put it in a vault. They lend most of it out — and the borrower deposits it elsewhere, where IT gets lent out again. This is FRACTIONAL RESERVE BANKING, and it MULTIPLIES the money supply. Sounds like magic. It\'s real.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-system',
      kind: 'concept',
      goal: 'Money types + fractional reserve + Fed tools.',
      keyIdeas: [
        'MONEY functions: (1) MEDIUM of exchange, (2) STORE of value, (3) UNIT of account.',
        'MONEY SUPPLY measures:',
        '  M1: cash + checking deposits + traveler\'s checks. Most LIQUID.',
        '  M2: M1 + savings, money market, small time deposits. Broader.',
        'FRACTIONAL RESERVE BANKING: banks keep a FRACTION of deposits as RESERVES; lend the rest.',
        '  RESERVE REQUIREMENT: Fed-mandated minimum % of deposits banks must hold (historically 10%; lowered to 0% during COVID, still 0% as of 2024).',
        'MONEY MULTIPLIER: 1 / reserve requirement. With 10% reserves, $1000 deposit can ultimately become up to $10,000 of total bank money via lending chains.',
        'FEDERAL RESERVE (the Fed): central bank of the US. Independent of immediate political control. Mandate: maximum employment + price stability + moderate long-term interest rates.',
        'FED TOOLS:',
        '  OPEN MARKET OPERATIONS: Fed BUYS/SELLS government bonds. Buy = puts money in economy → expansionary. Sell = removes money → contractionary. Most-used tool.',
        '  RESERVE REQUIREMENT: rarely changed but powerful.',
        '  DISCOUNT RATE: rate at which Fed lends to banks. Higher = banks borrow less.',
        '  FEDERAL FUNDS RATE: rate banks charge each other for overnight loans. Fed targets it; markets follow.',
        '  QUANTITATIVE EASING (QE): post-2008 tool. Fed buys massive quantities of bonds to lower long-term rates.',
        'EXPANSIONARY MONETARY POLICY: lower rates → more borrowing → more I, C → AD shifts right.',
        'CONTRACTIONARY: raise rates → cool inflation.',
      ],
      vocabulary: [
        { term: 'fractional reserve banking', definition: 'banks holding only a fraction of deposits as reserves and lending the rest.' },
        { term: 'money multiplier', definition: '1 / reserve requirement; how many times deposits expand through lending.' },
        { term: 'federal funds rate', definition: 'the rate banks charge each other for overnight loans, targeted by the Fed.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-multiplier',
      kind: 'worked_example',
      problem: 'Reserve requirement is 10%. You deposit $1000. Theoretical max increase in money supply?',
      steps: [
        'Money multiplier = 1 / 0.10 = 10.',
        'Theoretical max expansion = $1000 × 10 = $10,000.',
        'Real-world is less because banks hold EXCESS reserves and people hold cash. But this is the upper bound.',
        'CHAIN: bank holds $100, lends $900 → borrower deposits $900, that bank lends $810 → … sums to $10,000.',
      ],
      answer: '$10,000',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'The Fed BUYS government bonds in open-market operations. Is this EXPANSIONARY or CONTRACTIONARY?',
      expectedAnswer: 'expansionary — Fed pays sellers, money flows into the economy, bank reserves grow, lending expands',
      responseFormat: 'free',
      hints: [
        'Buy = pay sellers → money goes into circulation.',
        'More reserves at banks → more lending capacity.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fed-prints',
      kind: 'misconception_check',
      question: 'Does the Federal Reserve "print money" by literally printing dollar bills?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Visualizing literal printing.',
          correctsTo: 'Mostly no — physical cash is a small fraction of money. The Fed mostly creates money by CREDITING bank reserve accounts electronically. When the Fed buys bonds, it adds digital reserves to the seller\'s bank. Most "new money" in modern policy is keystrokes, not paper.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'M1 = cash + checking; M2 = M1 + savings/MM/small-time deposits.',
        'Banks lend most of deposits; multiplier = 1/reserve requirement.',
        'Fed tools: open market operations (main), reserve req, discount rate, fed funds rate, QE.',
        'Buy bonds = expansionary. Sell = contractionary.',
        'Most money creation is electronic, not physical.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might raising interest rates cause unemployment to rise?',
      hint: 'Higher rates → less borrowing → less business investment, less consumer spending → AD falls → firms hire less / lay off. The Fed deliberately uses this to cool inflation, but the cost is unemployment. The trade-off is at the heart of monetary policy.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
