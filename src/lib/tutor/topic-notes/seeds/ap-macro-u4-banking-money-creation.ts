/**
 * AP Macroeconomics — Unit 4 CED 4.4: Banking and the Expansion of the Money Supply.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.banking-money-creation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_BANKING_MONEY_CREATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.banking-money-creation.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Banking and the Expansion of the Money Supply',
  planId: 'evelyn.ap.macro.banking-money-creation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.banking-money-creation.v1' }],
  theory: [
    { loId: 'apmacro.banking-money-creation', content: `FRACTIONAL-RESERVE BANKING: banks hold only a FRACTION of deposits as reserves; the rest is lent out. The required fraction is the RESERVE REQUIREMENT (RR), set by the central bank.` },
    { loId: 'apmacro.banking-money-creation', content: `EXAMPLE: RR = 10%. A $1000 deposit means the bank must hold $100 in reserves. It can lend out $900. The lent $900 becomes someone else's deposit; that bank holds $90 in reserves and lends $810. Cascade continues.` },
    { loId: 'apmacro.banking-money-creation', content: `MONEY MULTIPLIER (theoretical maximum) = 1 / RR. With RR = 10%, multiplier = 10. A $1000 INJECTION into the banking system can increase the money supply by up to 10 × $1000 = $10,000.` },
    { loId: 'apmacro.banking-money-creation', content: `KEY ASSUMPTION for max multiplier: banks lend out 100% of EXCESS reserves and ALL the lent money is RE-DEPOSITED in the banking system (no cash leakage).` },
    { loId: 'apmacro.banking-money-creation', content: `T-ACCOUNT: the standard accounting framework for showing a bank's assets and liabilities. ASSETS (left side): reserves, loans, securities, etc. LIABILITIES (right side): customer deposits, borrowings. Balance sheet identity: ASSETS = LIABILITIES + EQUITY (often abbreviated for AP).` },
    { loId: 'apmacro.banking-money-creation', content: `WHEN A NEW DEPOSIT ARRIVES at a bank with RR = 10% and $1000 deposited: ASSETS rise by $1000 (becomes reserves). LIABILITIES rise by $1000 (the new deposit is a liability — bank owes the depositor). Bank then converts $900 of reserves into $900 of loans (asset shift, no balance change overall, but loan creation injects new money into the economy).` },
    { loId: 'apmacro.banking-money-creation', content: `REAL-WORLD MULTIPLIER < THEORETICAL MAX. Reasons: (a) CASH HOLDING — people keep some cash in pockets/wallets, not redeposited. Each cash leak reduces multiplier. (b) EXCESS RESERVES — banks may hold MORE than the required minimum (especially in recessions when lending feels risky). Excess reserves don't multiply. (c) LOAN DEMAND — if borrowers don't want loans (low confidence, high uncertainty), banks can't lend even with reserves available.` },
    { loId: 'apmacro.banking-money-creation', content: `POST-2008 NOTE: U.S. banks have held large excess reserves since 2008-09; the actual money multiplier has been substantially below the theoretical max. Some textbooks still teach the simple multiplier; AP usually accepts the theoretical answer unless the problem explicitly mentions excess reserves or cash leakage.` },
    { loId: 'apmacro.banking-money-creation', kind: 'definition', title: 'fractional-reserve banking', content: 'banks hold only a fraction of deposits as reserves and lend the rest.' },
    { loId: 'apmacro.banking-money-creation', kind: 'definition', title: 'reserve requirement', content: 'the fraction of deposits a bank must hold as reserves; set by the central bank.' },
    { loId: 'apmacro.banking-money-creation', kind: 'definition', title: 'money multiplier', content: `1 / RR; the theoretical maximum factor by which a new deposit can expand the money supply.` },
    { loId: 'apmacro.banking-money-creation', kind: 'definition', title: 'excess reserves', content: 'reserves a bank holds BEYOND the required minimum.' },
  ],
  methods: [
    {
      title: 'Worked multiplier',
      steps: [
        'STEP 1 — MONEY MULTIPLIER = 1 / RR = 1 / 0.20 = 5.',
        `STEP 2 — MAX MONEY SUPPLY INCREASE = multiplier × initial reserve injection = 5 × $5M = $25M. The Fed's $5M bond purchase can ultimately expand the money supply by up to $25M.`,
        `STEP 3 — FIRST-ROUND T-ACCOUNT CHANGE for the bank that sold the bonds. ASSETS: bonds (securities) DOWN $5M; reserves UP $5M (the Fed's payment). Net asset change: zero. LIABILITIES: unchanged. The bank now has $5M of EXCESS reserves (assuming it had none before) — the deposits backing those reserves haven't changed, so all $5M is excess.`,
        `STEP 4 — SECOND ROUND. The bank can lend out the $5M excess reserves. Suppose it makes a $5M loan. ASSETS: reserves DOWN $5M (transferred to borrower's account at another bank), loans UP $5M. Or: borrower deposits the loan in another bank; that bank gets $5M in deposits, holds $1M in reserves (20%), lends out $4M.`,
        `STEP 5 — INDUCED ROUND CASCADE. $4M lent → $4M deposited at another bank → $0.8M reserves, $3.2M lent → ... The geometric series sums to the multiplier × initial reserve injection.`,
        `STEP 6 — CAVEAT. In real life, banks may hold excess reserves (especially in recessions); some cash leaks out of the banking system; loan demand may be limited. Actual money supply increase is usually less than the theoretical $25M.`,
      ],
      example: { problem: `A central bank sets the reserve requirement at 20%. The Fed buys $5 million in bonds from a commercial bank, paying with newly created reserves. Compute (a) the money multiplier, (b) the maximum increase in the money supply, (c) the corresponding T-account changes for the first round.`, solution: `Multiplier = 5. Max money supply increase = $25M. T-account: bonds down, reserves up (then loans up as lending occurs).` },
      relatedLoIds: ['apmacro.banking-money-creation'],
    },
  ],
  pointers: [
    { content: `Fractional-reserve banking: banks hold a fraction (RR) of deposits, lend the rest.`, kind: 'tip' },
    { content: 'Money multiplier = 1 / RR. Lower RR → bigger multiplier.', kind: 'tip' },
    { content: 'Max money-supply increase = multiplier × initial reserve injection.', kind: 'tip' },
    { content: `T-account: assets (reserves, loans, securities) = liabilities (deposits) + equity.`, kind: 'tip' },
    { content: `Real-world multiplier < max because of cash leakage, excess reserves, weak loan demand.`, kind: 'tip' },
  ],
};
