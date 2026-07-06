/**
 * AP Macroeconomics — Unit 2 CED 2.5: Costs of Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.costs-of-inflation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_COSTS_OF_INFLATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.costs-of-inflation.v1',
  course: 'AP Macroeconomics',
  cedUnit: 2,
  cedTopic: '2.5',
  cedTitle: 'Costs of Inflation',
  planId: 'evelyn.ap.macro.costs-of-inflation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.costs-of-inflation.v1' }],
  theory: [
    { loId: 'apmacro.costs-of-inflation', content: `MENU COSTS: the literal cost of changing prices — reprinting menus, updating price tags, reprogramming registers, communicating new prices. Small per change but accumulates when inflation is high. Modern e-commerce has reduced these costs; the term remains in AP usage.` },
    { loId: 'apmacro.costs-of-inflation', content: `SHOE-LEATHER COSTS: the cost of holding less cash to avoid the erosion from inflation. People make more frequent trips to the bank, hold smaller cash balances, spend more time managing money. Named "shoe leather" from the days of walking to a bank teller — figurative but accurate cost.` },
    { loId: 'apmacro.costs-of-inflation', content: `REDISTRIBUTION FROM CREDITORS TO DEBTORS (when inflation is HIGHER than expected): a creditor lends $10,000 expecting 3% inflation. If actual inflation turns out to be 8%, the dollars repaid have less purchasing power than the lender expected. The borrower benefits; the lender loses.` },
    { loId: 'apmacro.costs-of-inflation', content: `WHO IS HURT BY UNANTICIPATED INFLATION: (1) Lenders/creditors locked into fixed nominal interest rates. (2) Workers with fixed nominal wages (their real wage falls). (3) People with fixed-income retirement (pensions paying $X/month with no COLA). (4) Holders of cash and money-like assets.` },
    { loId: 'apmacro.costs-of-inflation', content: `WHO IS HELPED BY UNANTICIPATED INFLATION: (1) Borrowers with fixed-rate debt (their real debt burden falls). (2) Workers in unionized contracts with strong COLA escalators. (3) Owners of real assets (land, homes, gold) whose nominal values rise with inflation.` },
    { loId: 'apmacro.costs-of-inflation', content: `ANTICIPATED INFLATION is much LESS damaging than unanticipated: when borrowers + lenders correctly forecast inflation, they bake it into nominal interest rates upfront. No surprise redistribution occurs. The remaining costs are menu, shoe-leather, and tax distortions (since income tax brackets and capital-gains taxes are typically indexed imperfectly to inflation).` },
    { loId: 'apmacro.costs-of-inflation', content: `FISHER EQUATION (real vs nominal interest rates): NOMINAL interest rate ≈ REAL interest rate + EXPECTED inflation rate. Or: REAL = NOMINAL − INFLATION (approximately, for low rates). When inflation rises and lenders ANTICIPATE it, nominal rates rise to compensate.` },
    { loId: 'apmacro.costs-of-inflation', content: `HYPERINFLATION: when inflation runs above ~50% per month, the value of currency erodes so fast that normal economic life breaks down. Examples: Weimar Germany, Zimbabwe, Venezuela. Money loses its store-of-value function; people barter or switch to foreign currency.` },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'menu costs', content: 'the resource cost of changing posted prices when inflation requires re-pricing.' },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'shoe-leather costs', content: `costs incurred from holding smaller cash balances to avoid inflation erosion (more bank trips, time on money management).` },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'Fisher equation', content: 'nominal interest rate ≈ real interest rate + expected inflation rate.' },
  ],
  methods: [
    {
      title: 'Worked fisher',
      steps: [
        `STEP 1 — APPLY FISHER EQUATION (approximate form): real ≈ nominal − inflation. EXPECTED real = 7% − 3% = 4%. The bank thought it was earning 4% real on the loan.`,
        `STEP 2 — ACTUAL real rate. Real ≈ nominal − ACTUAL inflation = 7% − 6% = 1%. The bank actually earns only 1% real.`,
        `STEP 3 — WHO BENEFITS? The BORROWER. Their nominal payment is fixed by contract at 7%, but the dollars they pay back are less valuable than expected because inflation eroded purchasing power faster than anticipated. They effectively repay only 1% real interest instead of 4% real.`,
        `STEP 4 — WHO LOSES? The BANK (lender). They locked in 7% nominal, expecting 4% real return. Surprise inflation reduced their actual real return to 1%. They cannot raise the rate retroactively.`,
        `STEP 5 — INTUITION. Unanticipated inflation transfers wealth from CREDITORS to DEBTORS. A homeowner with a fixed-rate 30-year mortgage benefits when inflation surges; the bank holding the mortgage suffers. AP tests this scenario reliably — know the direction.`,
      ],
      example: { problem: `A bank issues a 5-year loan at a 7% NOMINAL interest rate. At the time of the loan, both bank and borrower expected inflation to average 3% over the 5 years. (a) Compute the EXPECTED real interest rate. (b) Suppose actual inflation turns out to be 6% per year over the 5 years. Compute the ACTUAL real interest rate the bank earns. (c) Identify who benefits from this surprise inflation, and explain why.`, solution: `Expected real = 4%. Actual real = 1%. Borrower benefits; bank (creditor) loses 3 pp of real return per year.` },
      relatedLoIds: ['apmacro.costs-of-inflation'],
    },
  ],
  pointers: [
    { content: `Costs: menu, shoe-leather, redistribution (creditors → debtors when unanticipated), tax distortions.`, kind: 'tip' },
    { content: `Fisher: nominal ≈ real + expected inflation. → real ≈ nominal − actual inflation.`, kind: 'tip' },
    { content: `UNANTICIPATED inflation HELPS borrowers (fixed-rate debt) and HURTS creditors / cash-holders / fixed-income.`, kind: 'tip' },
    { content: `Anticipated inflation has menu/shoe-leather/tax costs but no surprise redistribution.`, kind: 'tip' },
  ],
};
