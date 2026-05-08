/**
 * AP Macroeconomics — CED Unit 4.4: Banking and the Expansion of the
 * Money Supply.
 *
 * Fractional-reserve banking, the money multiplier (1/RR), T-account
 * analysis. Supersedes the existing money-banking-fed plan with the
 * -v2 suffix per Q1d.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_BANKING_MONEY_CREATION: LessonPlan = {
  id: 'evelyn.ap.macro.banking-money-creation-v2.v1',
  title: 'Banking and the Expansion of the Money Supply',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.banking-money-creation-v2',
      description:
        'Apply fractional-reserve banking to compute the money multiplier (1/RR) and the maximum increase in the money supply from a given deposit, analyze a T-account showing assets and liabilities, and identify what shrinks the multiplier in real economies.',
      standard: 'AP-MACRO-4.4',
    },
  ],
  prerequisites: ['apmacro.functions-of-money'],
  followUps: ['apmacro.money-market'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make money creation feel surprising — banks create money out of thin air.',
      script:
        "When you deposit $1000 in a bank, you have $1000. The bank holds, say, $100 in reserve and lends out $900. The borrower spends the $900, the recipient deposits it in their bank, that bank holds $90 in reserve and lends out $810, and so on. By the end of the cascade, the money supply has grown by SEVERAL TIMES the original deposit — without anyone at the Fed printing more bills. Banks create money. AP tests this every year.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-banking',
      kind: 'concept',
      goal: 'Cover fractional-reserve banking, the money multiplier, T-accounts, and real-world dampers.',
      keyIdeas: [
        'FRACTIONAL-RESERVE BANKING: banks hold only a FRACTION of deposits as reserves; the rest is lent out. The required fraction is the RESERVE REQUIREMENT (RR), set by the central bank.',
        'EXAMPLE: RR = 10%. A $1000 deposit means the bank must hold $100 in reserves. It can lend out $900. The lent $900 becomes someone else\'s deposit; that bank holds $90 in reserves and lends $810. Cascade continues.',
        'MONEY MULTIPLIER (theoretical maximum) = 1 / RR. With RR = 10%, multiplier = 10. A $1000 INJECTION into the banking system can increase the money supply by up to 10 × $1000 = $10,000.',
        'KEY ASSUMPTION for max multiplier: banks lend out 100% of EXCESS reserves and ALL the lent money is RE-DEPOSITED in the banking system (no cash leakage).',
        'T-ACCOUNT: the standard accounting framework for showing a bank\'s assets and liabilities. ASSETS (left side): reserves, loans, securities, etc. LIABILITIES (right side): customer deposits, borrowings. Balance sheet identity: ASSETS = LIABILITIES + EQUITY (often abbreviated for AP).',
        'WHEN A NEW DEPOSIT ARRIVES at a bank with RR = 10% and $1000 deposited: ASSETS rise by $1000 (becomes reserves). LIABILITIES rise by $1000 (the new deposit is a liability — bank owes the depositor). Bank then converts $900 of reserves into $900 of loans (asset shift, no balance change overall, but loan creation injects new money into the economy).',
        'REAL-WORLD MULTIPLIER < THEORETICAL MAX. Reasons: (a) CASH HOLDING — people keep some cash in pockets/wallets, not redeposited. Each cash leak reduces multiplier. (b) EXCESS RESERVES — banks may hold MORE than the required minimum (especially in recessions when lending feels risky). Excess reserves don\'t multiply. (c) LOAN DEMAND — if borrowers don\'t want loans (low confidence, high uncertainty), banks can\'t lend even with reserves available.',
        'POST-2008 NOTE: U.S. banks have held large excess reserves since 2008-09; the actual money multiplier has been substantially below the theoretical max. Some textbooks still teach the simple multiplier; AP usually accepts the theoretical answer unless the problem explicitly mentions excess reserves or cash leakage.',
      ],
      vocabulary: [
        { term: 'fractional-reserve banking', definition: 'banks hold only a fraction of deposits as reserves and lend the rest.' },
        { term: 'reserve requirement', definition: 'the fraction of deposits a bank must hold as reserves; set by the central bank.' },
        { term: 'money multiplier', definition: '1 / RR; the theoretical maximum factor by which a new deposit can expand the money supply.' },
        { term: 'excess reserves', definition: 'reserves a bank holds BEYOND the required minimum.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-multiplier',
      kind: 'worked_example',
      problem:
        'A central bank sets the reserve requirement at 20%. The Fed buys $5 million in bonds from a commercial bank, paying with newly created reserves. Compute (a) the money multiplier, (b) the maximum increase in the money supply, (c) the corresponding T-account changes for the first round.',
      steps: [
        'STEP 1 — MONEY MULTIPLIER = 1 / RR = 1 / 0.20 = 5.',
        'STEP 2 — MAX MONEY SUPPLY INCREASE = multiplier × initial reserve injection = 5 × $5M = $25M. The Fed\'s $5M bond purchase can ultimately expand the money supply by up to $25M.',
        'STEP 3 — FIRST-ROUND T-ACCOUNT CHANGE for the bank that sold the bonds. ASSETS: bonds (securities) DOWN $5M; reserves UP $5M (the Fed\'s payment). Net asset change: zero. LIABILITIES: unchanged. The bank now has $5M of EXCESS reserves (assuming it had none before) — the deposits backing those reserves haven\'t changed, so all $5M is excess.',
        'STEP 4 — SECOND ROUND. The bank can lend out the $5M excess reserves. Suppose it makes a $5M loan. ASSETS: reserves DOWN $5M (transferred to borrower\'s account at another bank), loans UP $5M. Or: borrower deposits the loan in another bank; that bank gets $5M in deposits, holds $1M in reserves (20%), lends out $4M.',
        'STEP 5 — INDUCED ROUND CASCADE. $4M lent → $4M deposited at another bank → $0.8M reserves, $3.2M lent → ... The geometric series sums to the multiplier × initial reserve injection.',
        'STEP 6 — CAVEAT. In real life, banks may hold excess reserves (especially in recessions); some cash leaks out of the banking system; loan demand may be limited. Actual money supply increase is usually less than the theoretical $25M.',
      ],
      answer: 'Multiplier = 5. Max money supply increase = $25M. T-account: bonds down, reserves up (then loans up as lending occurs).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-multiplier-compute',
      kind: 'try_yourself',
      problem:
        'For each reserve requirement, compute the money multiplier and the maximum money supply increase from a $200,000 new deposit. (a) RR = 25%. (b) RR = 10%. (c) RR = 5%. (d) Briefly explain how RR is INVERSELY related to the multiplier.',
      expectedAnswer:
        '(a) Multiplier = 1/0.25 = 4. Max increase = 4 × $200,000 = $800,000. (b) Multiplier = 1/0.10 = 10. Max increase = 10 × $200,000 = $2,000,000. (c) Multiplier = 1/0.05 = 20. Max increase = 20 × $200,000 = $4,000,000. (d) RR is inversely related to multiplier because the multiplier formula is 1/RR. Lower RR means banks hold less in reserve and lend out more — each round of the deposit-loan cascade has more dollars available to expand into the next round. Higher RR means banks must hold more in reserve, so each round has less to lend, shortening the cascade. The central bank can therefore loosen monetary conditions by lowering RR (rare in modern policy; more often the Fed uses open-market operations or interest-on-reserves) or tighten by raising RR.',
      responseFormat: 'numeric',
      hints: [
        'Multiplier = 1 / RR (RR as a decimal).',
        'Max increase = multiplier × initial deposit.',
        'Lower RR = bigger multiplier.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-real-world-dampers',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why does the actual money supply increase from a Fed reserve injection often fall SHORT of the theoretical maximum (multiplier × injection)? Identify TWO specific reasons and explain the mechanism behind each.',
      expectedAnswer:
        'Two reasons (any two): (1) CASH LEAKAGE: when borrowers receive loans, they may keep some of the money as physical cash rather than redepositing it in a bank. Each dollar held as cash exits the banking system and stops cascading through the multiplier. The more cash people hold (e.g., during financial crises when trust in banks falls), the smaller the actual multiplier. (2) EXCESS RESERVES: banks may CHOOSE to hold more than the required minimum, especially when (a) loan demand is weak — businesses and households don\'t want to borrow during recessions or uncertainty; (b) lending feels risky — banks worry about defaults; (c) interest paid on reserves (IOR) makes holding reserves attractive. Each dollar held as excess reserves doesn\'t cascade. Post-2008, U.S. banks held trillions in excess reserves; the actual U.S. money multiplier ran well below the theoretical maximum for years. (3) LOAN-DEMAND CONSTRAINTS: even if banks WANT to lend, they need creditworthy borrowers who WANT loans. In deep recessions, demand for credit can be very weak, and reserves sit idle. (4) Strong answers identify specific mechanisms (cash leak, excess reserves, demand) and connect them to actual historical episodes (Great Depression saw both; 2008-2020 saw massive excess reserves).',
      responseFormat: 'frq',
      hints: [
        'What can interrupt the deposit-loan cascade?',
        'What determines whether a dollar lent gets redeposited?',
        'Banks have a CHOICE about excess reserves; what affects that choice?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Fractional-reserve banking: banks hold a fraction (RR) of deposits, lend the rest.',
        'Money multiplier = 1 / RR. Lower RR → bigger multiplier.',
        'Max money-supply increase = multiplier × initial reserve injection.',
        'T-account: assets (reserves, loans, securities) = liabilities (deposits) + equity.',
        'Real-world multiplier < max because of cash leakage, excess reserves, weak loan demand.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.4',
    cedTitle: 'Banking and the Expansion of the Money Supply',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '13', note: 'OpenStax Macro AP — fractional reserve banking, money multiplier, T-accounts.' },
    ],
  },
};
