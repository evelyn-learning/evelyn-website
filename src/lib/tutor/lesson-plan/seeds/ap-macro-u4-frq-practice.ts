/**
 * AP Macroeconomics — Unit 4 FRQ Practice.
 *
 * Three multi-part FRQs covering money creation + multiplier, money
 * market + monetary policy transmission, and loanable funds + crowding
 * out. Modeled on past AP Macro Unit-4 patterns.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u4-frq-practice.v1',
  title: 'Unit 4 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u4-frq-practice',
      description:
        'Apply Unit 4 concepts (money supply / multiplier, money market diagram, monetary policy transmission, loanable funds + crowding-out) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-MACRO-4-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.financial-assets',
    'apmacro.nominal-vs-real-interest-rates',
    'apmacro.functions-of-money',
    'apmacro.banking-money-creation-v2',
    'apmacro.money-market',
    'apmacro.monetary-policy',
    'apmacro.loanable-funds-market',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 4 FRQ stakes — financial-sector graphs are heavily tested.',
      script:
        "Unit 4 FRQs are graph-heavy: money market diagrams, loanable funds diagrams, and the AD-AS connection. Three problems incoming, each scored on rubric: graph correctness, calculations, and explanations of transmission mechanisms.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-graph-rubric',
      kind: 'concept',
      goal: 'Refresher on money-market and loanable-funds graph conventions.',
      keyIdeas: [
        'MONEY MARKET RUBRIC: y-axis = NOMINAL INTEREST RATE (i); x-axis = QUANTITY OF MONEY. Ms is VERTICAL; Md is DOWNWARD-sloping. Equilibrium at intersection.',
        'LOANABLE FUNDS RUBRIC: y-axis = REAL INTEREST RATE (r); x-axis = QUANTITY OF LOANABLE FUNDS. S is UPWARD-sloping; D is DOWNWARD-sloping. Equilibrium at intersection.',
        'COMMON ERRORS: (i) reversing axes (interest rate must be on y-axis); (ii) drawing Ms downward instead of vertical; (iii) drawing S downward in loanable funds (S is upward!); (iv) drawing Md upward (Md is downward); (v) using "i" for real and "r" for nominal (convention is reversed: i = nominal, r = real).',
        'TRANSMISSION-CHAIN questions: AP wants explicit cause-and-effect at each link. Skipping steps loses points even if final direction is right.',
        'CROWDING OUT questions: explicitly trace through the loanable funds market (D right → r up → private I falls). Don\'t just state "crowding out happens" — show the mechanism.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-money-multiplier',
      kind: 'try_yourself',
      problem:
        'FRQ Practice 1 — Money Creation. The Fed buys $40 million of government bonds from a commercial bank. The reserve requirement is 8%. Assume banks lend out 100% of excess reserves and all loans are redeposited. (a) Compute the money multiplier. (b) Compute the maximum increase in the money supply. (c) Show the immediate first-round T-account changes for the bank that sold the bonds. (d) Identify TWO real-world reasons the actual money-supply increase will likely be SMALLER than the maximum from (b).',
      expectedAnswer:
        '(a) Money multiplier = 1 / RR = 1 / 0.08 = 12.5. (1 point)\n(b) Max ΔM = multiplier × Fed purchase = 12.5 × $40M = $500M. (2 points: 1 for setup, 1 for correct number)\n(c) IMMEDIATE T-account change for the selling bank: ASSETS: bonds DOWN $40M; reserves UP $40M (Fed paid in newly created reserves). Net change in total assets: zero. LIABILITIES: unchanged at this step. The bank now holds $40M in EXCESS reserves (since the deposits backing them haven\'t increased). It can use those excess reserves to make new loans, which initiates the multiplier cascade. (2 points: 1 for correctly showing assets sides, 1 for naming the excess-reserve status)\n(d) Two real-world reasons (any two): (i) CASH LEAKAGE — borrowers may keep some loans as physical cash rather than redepositing in banks, exiting the multiplier cascade. (ii) EXCESS RESERVES — banks may CHOOSE to hold more than required, especially in recessions when lending feels risky or when interest on reserves makes holding attractive. (iii) WEAK LOAN DEMAND — banks need creditworthy borrowers; if borrowers don\'t want loans (recession, uncertainty), banks can\'t lend even with excess reserves available. (iv) Strong answers identify a specific mechanism, not just "real life is messier." (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Money multiplier = 1 / RR.',
        'For T-account, identify what changes on assets vs liabilities side.',
        'Real-world dampers: cash, excess reserves, loan demand.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-monetary-transmission',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — Monetary Policy Transmission. The economy is in a recessionary gap. The Fed announces an expansionary monetary policy, conducting open-market PURCHASES of $50B in bonds. (a) Identify which curve shifts in the money market and the direction. (b) Describe the effect on the equilibrium NOMINAL interest rate. (c) Trace the effect on AGGREGATE DEMAND through the chain: money market → investment → AD-AS. Identify the effect on real GDP, price level, and unemployment rate. (d) On AD-AS specifically, the recessionary gap was 200B real GDP below potential. The MPC is 0.8. The interest-rate decline causes investment to rise by 25B. Compute the resulting AD shift via the spending multiplier and identify whether the gap is fully closed.",
      expectedAnswer:
        '(a) MONEY SUPPLY (Ms) shifts RIGHTWARD. The Fed\'s bond purchase injects reserves; the money multiplier expands the money supply. (1 point)\n(b) Equilibrium NOMINAL interest rate FALLS. With Ms shifted right and Md unchanged, the new intersection is at a lower i. (1 point)\n(c) TRANSMISSION CHAIN: lower nominal i → lower real r (assuming stable inflation expectations) → INVESTMENT RISES (firms find more capital projects profitable). Some consumer borrowing also becomes cheaper, so C may rise modestly. C and I increases shift AGGREGATE DEMAND RIGHTWARD on the AD-AS diagram. New short-run equilibrium: REAL GDP RISES, PRICE LEVEL RISES, CYCLICAL UNEMPLOYMENT FALLS. The recessionary gap narrows. (3 points: 1 for the i → r → I chain, 1 for AD shift, 1 for AD-AS effects on Y/P/UR)\n(d) Spending multiplier = 1 / (1 − MPC) = 1 / (1 − 0.8) = 5. AD shift from $25B increase in I = 5 × $25B = $125B. The gap was $200B; the AD shift is only $125B. The gap is NOT fully closed — there remains a $75B recessionary gap. (3 points: 1 for multiplier, 1 for AD shift calculation, 1 for correct gap-closing assessment)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Trace the chain: Fed → Ms → i → I → AD → Y/P/UR.',
        'Spending multiplier = 1 / (1 − MPC).',
        'AD shift = multiplier × initial spending change.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'try-frq-crowding-out',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — Crowding Out via Loanable Funds. The federal government enacts a $300B fiscal stimulus financed by deficit borrowing. (a) Identify which curve shifts in the LOANABLE FUNDS market and the direction. (b) Describe the effect on the equilibrium REAL interest rate. (c) Describe the effect on private investment (I). (d) Connect this to the AD-AS framework: explain why the actual AD shift will be SMALLER than the spending-multiplier-implied shift. (e) Identify ONE situation in which crowding out would be especially LARGE, and ONE in which it would be especially SMALL. Justify each.",
      expectedAnswer:
        '(a) DEMAND for loanable funds shifts RIGHTWARD. Government deficit financing requires the government to BORROW $300B in the loanable funds market, adding to existing private demand. (1 point)\n(b) Equilibrium REAL interest rate RISES. With unchanged S and rightward-shifted D, the new intersection is at higher r. (1 point)\n(c) Private investment FALLS. Higher real interest rates make some private investment projects unprofitable; firms reduce I. (1 point)\n(d) AD shift will be SMALLER than the spending multiplier alone implies because: total ΔAD = (spending multiplier × ΔG) − (private I reduction from higher r). The fiscal stimulus shifts AD right via G, but the resulting increase in real interest rates partially OFFSETS the AD shift by suppressing I. Net AD shift is the difference; "crowding out" is the term for the I reduction that offsets the stimulus. (2 points: 1 for AD-shift formula, 1 for crowding-out identification)\n(e) LARGE CROWDING-OUT scenario: economy at FULL EMPLOYMENT with steep upward-sloping S curve. When government adds borrowing demand, the loanable funds market is already tight — rates rise sharply, I falls substantially. SMALL CROWDING-OUT scenario: economy in DEEP RECESSION with very flat S curve (lots of idle savings). Government bond demand rises, but rates barely move; I is barely affected. Some economists argue crowding-out is essentially zero in deep recessions, which is why fiscal stimulus is most potent then. (3 points: 1 each scenario with mechanism, 1 for explicit reference to S-curve elasticity / economic state)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Government deficit raises D in loanable funds.',
        'Higher r reduces private I; that\'s the crowding-out mechanism.',
        'Magnitude of crowding-out depends on how tight the loanable-funds market already is.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Money multiplier = 1 / RR. Multiply by initial reserve injection for max money supply increase.',
        'Money market (nominal i) vs loanable funds market (real r) — different rates, different supply curves.',
        'Monetary transmission: Fed → Ms → i → I → AD → Y/P/UR.',
        'Crowding out: government deficit → loanable funds D right → real r up → private I down.',
        'Spending multiplier = 1 / (1 − MPC). Use it to compute AD shift from given ΔG.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ',
    cedTitle: 'Unit 4 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on past AP Macro Unit-4 patterns. Verbatim CB FRQs to swap in once scrape-ced-frqs.ts ships.' },
    ],
  },
};
