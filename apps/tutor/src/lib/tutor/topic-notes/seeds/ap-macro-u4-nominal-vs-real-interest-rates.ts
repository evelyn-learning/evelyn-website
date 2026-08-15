/**
 * AP Macroeconomics — Unit 4 CED 4.2: Nominal vs Real Interest Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.nominal-vs-real-interest-rates.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_NOMINAL_VS_REAL_INTEREST_RATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.nominal-vs-real-interest-rates.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Nominal vs Real Interest Rates',
  planId: 'evelyn.ap.macro.nominal-vs-real-interest-rates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.nominal-vs-real-interest-rates.v1' }],
  theory: [
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `NOMINAL INTEREST RATE: the stated rate on a loan or savings account, in dollar terms. The number you see on a bank statement or loan contract.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `REAL INTEREST RATE: the nominal rate adjusted for inflation. Tells you the change in PURCHASING POWER from holding the asset.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `FISHER EQUATION (approximate): REAL ≈ NOMINAL − INFLATION. Or equivalently: NOMINAL ≈ REAL + INFLATION. (The exact form is (1+nominal) = (1+real)(1+inflation), but the additive approximation is accurate for small rates and is what AP uses.)` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `EX-ANTE (expected) real rate: nominal − EXPECTED inflation. This is the rate borrowers and lenders THINK they are agreeing to at the time of the contract.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `EX-POST (actual) real rate: nominal − ACTUAL inflation that occurred over the loan period. Only known after the fact.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `WHEN ACTUAL > EXPECTED inflation: ex-post real rate is LOWER than ex-ante. Borrowers BENEFIT (they pay back in cheaper dollars); lenders LOSE.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `WHEN ACTUAL < EXPECTED inflation: ex-post real rate is HIGHER than ex-ante. Borrowers LOSE (their fixed nominal payments are more burdensome in real terms); lenders BENEFIT.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: 'WHICH RATE MATTERS FOR WHICH DECISION:' },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `(a) INVESTMENT decisions (whether to build a factory, buy equipment): driven by REAL interest rate. Firms care about real cost of borrowing relative to real return.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `(b) SAVING decisions: driven by REAL interest rate. Savers care about purchasing power growth.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `(c) STATED rates on loan contracts: NOMINAL. Banks set nominal rates because inflation is uncertain at signing.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', content: `(d) MONETARY POLICY: the Fed targets NOMINAL rates (federal funds rate is nominal), but its REAL effect on the economy is through the real rate.` },
    { loId: 'apmacro.nominal-vs-real-interest-rates', kind: 'definition', title: 'nominal interest rate', content: 'the stated rate of return in dollar terms.' },
    { loId: 'apmacro.nominal-vs-real-interest-rates', kind: 'definition', title: 'real interest rate', content: 'nominal rate adjusted for inflation; measures change in purchasing power.' },
    { loId: 'apmacro.nominal-vs-real-interest-rates', kind: 'definition', title: 'ex-ante real rate', content: 'real rate calculated using expected inflation, set at contract time.' },
    { loId: 'apmacro.nominal-vs-real-interest-rates', kind: 'definition', title: 'ex-post real rate', content: 'real rate calculated using actual inflation, known only after the period.' },
  ],
  methods: [
    {
      title: 'Worked fisher',
      steps: [
        `STEP 1 — EX-ANTE REAL RATE: nominal − expected inflation = 7% − 3% = 4%. The lender expected 4% real return on the loan; the borrower expected to pay 4% real interest.`,
        `STEP 2 — EX-POST REAL RATE: nominal − actual inflation = 7% − 6% = 1%. The lender actually earned only 1% in real terms.`,
        `STEP 3 — WHO GAINS: BORROWER. They locked in a fixed 7% nominal payment. Their dollars repaid are worth less than expected (because actual inflation was higher), so the real burden of their debt is LOWER than what they signed up for. They effectively paid only 1% real interest instead of the expected 4%.`,
        `STEP 4 — WHO LOSES: LENDER. They locked in 7% nominal expecting 4% real return. The dollars they receive are worth less than they expected; their real return is only 1%. They cannot retroactively raise the rate.`,
        `STEP 5 — INTUITION. Surprise inflation transfers wealth from CREDITORS to DEBTORS. This is one reason borrowers (homeowners with fixed-rate mortgages, indebted businesses) prefer high inflation; lenders (bondholders, savers) prefer low inflation.`,
      ],
      example: { problem: `A 5-year loan is issued at a 7% nominal interest rate. At signing, both lender and borrower expected 3% annual inflation. (a) Compute the ex-ante real rate. (b) Suppose actual inflation averages 6% over the 5 years. Compute the ex-post real rate. (c) Identify who gains and who loses from the inflation surprise.`, solution: 'Ex-ante real = 4%. Ex-post real = 1%. Borrower gains 3 pp; lender loses 3 pp.' },
      relatedLoIds: ['apmacro.nominal-vs-real-interest-rates'],
    },
  ],
  pointers: [
    { content: 'Real ≈ Nominal − Inflation (Fisher equation, additive form).', kind: 'tip' },
    { content: 'Ex-ante: at contract time, using EXPECTED inflation.', kind: 'tip' },
    { content: 'Ex-post: after the fact, using ACTUAL inflation.', kind: 'tip' },
    { content: 'Surprise inflation: borrowers GAIN, lenders LOSE.', kind: 'tip' },
    { content: 'Investment/saving decisions: REAL rate matters. Stated contract rates: NOMINAL.', kind: 'tip' },
  ],
};
