/**
 * AP Macroeconomics — Unit 2 CED 2.5: Costs of Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.costs-of-inflation.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.costs-of-inflation.v1' }],
  theory: [
    { loId: 'apmacro.costs-of-inflation', content: `INFLATION REDISTRIBUTES wealth — it does not uniformly destroy it. "Inflation makes everyone poorer" is WRONG: real positions depend on the balance of a person's assets, debts, and income contracts. AP tests who wins and who loses.` },
    { loId: 'apmacro.costs-of-inflation', content: `MENU COSTS: the resource cost of changing posted prices — reprinting menus, updating tags, reprogramming registers. Small per change, accumulating when inflation is high. Present even when inflation is fully anticipated.` },
    { loId: 'apmacro.costs-of-inflation', content: `SHOE-LEATHER COSTS: the cost of economizing on cash holdings to dodge inflation's erosion — more bank trips, smaller cash balances, more time managing money. Figurative name, real cost; also present under anticipated inflation.` },
    { loId: 'apmacro.costs-of-inflation', content: `REDISTRIBUTION FROM CREDITORS TO DEBTORS (when inflation exceeds expectations): a lender who priced a loan expecting low inflation gets repaid in dollars worth less than expected. The BORROWER's real debt burden shrinks; the LENDER's real return shrinks. Direction to memorize: unexpected inflation moves wealth creditors → debtors.` },
    { loId: 'apmacro.costs-of-inflation', content: `HURT BY UNANTICIPATED INFLATION: (1) lenders/creditors locked into fixed nominal rates; (2) workers on fixed nominal wages (real wage falls); (3) fixed-income retirees with no cost-of-living adjustment; (4) holders of cash and money-like assets (zero nominal return).` },
    { loId: 'apmacro.costs-of-inflation', content: `HELPED BY UNANTICIPATED INFLATION: (1) borrowers with fixed-rate debt (real burden falls — the classic fixed-rate mortgage holder); (2) workers with strong COLA escalators; (3) owners of real assets (land, homes, gold) whose nominal values ride up with inflation.` },
    { loId: 'apmacro.costs-of-inflation', content: `FISHER EQUATION: nominal interest rate ≈ real interest rate + EXPECTED inflation. Rearranged: real ≈ nominal − inflation. When inflation is anticipated, lenders raise nominal rates to protect the agreed real return.` },
    { loId: 'apmacro.costs-of-inflation', content: `ANTICIPATED vs UNANTICIPATED: fully anticipated inflation gets BAKED INTO nominal rates upfront — no surprise redistribution. Remaining costs under anticipation: menu, shoe-leather, and TAX DISTORTIONS (brackets and capital-gains taxes imperfectly indexed). Unanticipated inflation adds the surprise creditor-to-debtor wealth transfer on top — which is why surprises are the more damaging form.` },
    { loId: 'apmacro.costs-of-inflation', content: `EXPECTED vs ACTUAL REAL RATE: expected real = nominal − EXPECTED inflation (set at contract time); actual real = nominal − ACTUAL inflation (known only afterward). The gap between the two IS the surprise redistribution.` },
    { loId: 'apmacro.costs-of-inflation', content: `HYPERINFLATION: inflation of roughly fifty percent per MONTH or more. Currency value erodes so fast that money loses its store-of-value function; people barter or switch to foreign currency. Historical cases: Weimar Germany, Zimbabwe, Venezuela.` },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'menu costs', content: `the resource cost of changing posted prices when inflation requires re-pricing.` },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'shoe-leather costs', content: `costs of holding smaller cash balances to avoid inflation erosion (more bank trips, time on money management).` },
    { loId: 'apmacro.costs-of-inflation', kind: 'definition', title: 'Fisher equation', content: `nominal interest rate ≈ real interest rate + expected inflation rate.` },
  ],
  methods: [
    {
      title: 'Apply the Fisher equation to a surprise-inflation loan scenario',
      steps: [
        `STEP 1 — EXPECTED REAL RATE at contract time: expected real = nominal − expected inflation.`,
        `STEP 2 — ACTUAL REAL RATE after the fact: actual real = nominal − actual inflation. (Negative is possible — purchasing power shrinking despite nominal growth.)`,
        `STEP 3 — COMPARE the two: actual inflation ABOVE expected → actual real return below expected.`,
        `STEP 4 — ASSIGN winner and loser: the BORROWER wins (repays cheaper dollars than agreed in real terms); the LENDER loses (locked into the nominal rate, cannot reprice retroactively).`,
        `STEP 5 — STATE the general direction: unanticipated inflation transfers wealth from creditors to debtors; unanticipated DISinflation does the reverse.`,
      ],
      example: {
        problem: `A bank issues a five-year loan at a seven percent nominal rate when both sides expect three percent inflation. Actual inflation runs at six percent. Find the expected and actual real rates, and identify who gains.`,
        solution: `Expected real = seven − three = four percent. Actual real = seven − six = one percent. The borrower gains (pays one percent real instead of four); the bank loses three points of real return per year. Unanticipated inflation redistributed wealth from the creditor to the debtor.`,
      },
      relatedLoIds: ['apmacro.costs-of-inflation'],
    },
    {
      title: 'Classify who is helped or hurt by an inflation surprise',
      steps: [
        `STEP 1 — For each person, identify their NOMINAL FIXTURES: fixed-rate debts owed, fixed-rate assets held, fixed nominal wages or pensions, cash balances, real assets.`,
        `STEP 2 — APPLY the rule: fixed nominal OBLIGATIONS you OWE get cheaper (helped); fixed nominal CLAIMS or INCOME you RECEIVE get less valuable (hurt); real assets ride up (helped); cash erodes (hurt).`,
        `STEP 3 — JUSTIFY each verdict in one clause naming the mechanism (real debt burden falls, real wage falls, purchasing power of cash erodes).`,
      ],
      example: {
        problem: `Inflation unexpectedly rises. Classify: (a) a retiree on a fixed pension with no COLA; (b) a homeowner with a thirty-year fixed-rate mortgage; (c) the bank holding that mortgage; (d) someone holding a large cash hoard.`,
        solution: `(a) HURT — fixed nominal income buys less each year. (b) HELPED — fixed payments shrink relative to rising nominal incomes and prices; real debt burden falls. (c) HURT — same payments received, worth less in real terms. (d) HURT — cash has zero nominal return, so purchasing power erodes at the inflation rate.`,
      },
      relatedLoIds: ['apmacro.costs-of-inflation'],
    },
  ],
  pointers: [
    { content: 'Fisher: nominal ≈ real + expected inflation; real ≈ nominal − inflation.', kind: 'tip' },
    { content: 'Unexpected inflation: borrowers with fixed-rate debt WIN; creditors, cash-holders, fixed-income LOSE.', kind: 'tip' },
    { content: 'Anticipated inflation still costs: menu, shoe-leather, tax distortions — but no surprise redistribution.', kind: 'tip' },
    { content: 'A negative real rate means purchasing power falls even while the nominal balance grows.', kind: 'tip' },
    { content: '"Inflation makes everyone poorer" is wrong — it redistributes; check assets vs debts vs income contracts.', kind: 'tip' },
  ],
};
