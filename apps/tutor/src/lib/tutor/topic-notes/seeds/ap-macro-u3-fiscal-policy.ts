/**
 * AP Macroeconomics — Unit 3 CED 3.8: Fiscal Policy.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fiscal-policy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FISCAL_POLICY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fiscal-policy.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.8',
  cedTitle: 'Fiscal Policy',
  planId: 'evelyn.ap.macro.fiscal-policy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fiscal-policy.v1' }],
  theory: [
    { loId: 'apmacro.fiscal-policy', content: `FISCAL POLICY: government changes in spending (G) or taxes (T) to influence AD. EXPANSIONARY = G up and/or T down → AD RIGHT (used against a recessionary gap). CONTRACTIONARY = G down and/or T up → AD LEFT (used against an inflationary gap).` },
    { loId: 'apmacro.fiscal-policy', content: `SIZING THE AD SHIFT: $\\Delta AD = \\text{spending multiplier} \\times \\Delta G$ for spending changes; $\\Delta AD = \\text{tax multiplier} \\times \\Delta T$ for tax changes. Combined packages: compute each and ADD. Spending hits harder dollar-for-dollar because the full dollar of G enters the cycle, while only the MPC fraction of a tax cut does.` },
    { loId: 'apmacro.fiscal-policy', content: `CLOSING A GAP EXACTLY: set the needed AD shift equal to the gap and solve. With MPC 0.75 (spending mult four, tax mult minus three), a four-hundred-billion-dollar recessionary gap closes with one hundred billion of new G, or about one hundred thirty-three billion of tax cuts, or any mix satisfying four ΔG + three |tax cut| = the gap.` },
    { loId: 'apmacro.fiscal-policy', content: `BALANCED-BUDGET OPERATION: raising G and T by the SAME amount still stimulates — balanced-budget multiplier = 1, so the AD shift equals ΔG. To close a gap with no deficit impact, set ΔG = ΔT = the gap.` },
    { loId: 'apmacro.fiscal-policy', content: `CROWDING OUT: deficit-financed spending requires government borrowing, which competes with private borrowers in the loanable-funds market → real interest rates RISE → private investment I (and rate-sensitive consumption) FALLS → part of the stimulus is offset. PARTIAL, not total — fiscal policy still works, just less than the bare multiplier implies.` },
    { loId: 'apmacro.fiscal-policy', content: `CROWDING OUT VARIES WITH SLACK: LARGE near full employment (loanable funds genuinely scarce; rates rise sharply). SMALL in deep recession (idle savings abound; rates barely move — some argue near zero in slumps). Real-world fiscal-multiplier estimates often land between one-half and two, below textbook values.` },
    { loId: 'apmacro.fiscal-policy', content: `DEFICIT vs DEBT: BUDGET DEFICIT = spending minus revenue THIS YEAR — a FLOW. NATIONAL DEBT = the cumulative sum of all past deficits minus surpluses — a STOCK. AP tests the flow/stock distinction directly.` },
    { loId: 'apmacro.fiscal-policy', content: `THREE TIME LAGS make fiscal policy slow: (1) RECOGNITION — GDP/unemployment data arrive with delay; (2) LEGISLATIVE — passing spending/tax law takes months; (3) IMPLEMENTATION — programs take time to start and money to flow. Conditions may change before stimulus lands — one reason monetary policy usually leads stabilization.` },
    { loId: 'apmacro.fiscal-policy', content: `DISCRETIONARY vs AUTOMATIC: this topic covers DISCRETIONARY fiscal policy — actions requiring NEW LEGISLATION. Automatic stabilizers (topic 3.9) adjust without any vote. Both are fiscal policy.` },
    { loId: 'apmacro.fiscal-policy', content: `EFFECTIVENESS DEPENDS ON: sizes of ΔG/ΔT, the multipliers (a function of MPC), crowding out, and the AD-AS position — the output effect dampens near full employment where SRAS is steep and shifts mostly raise prices.` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'discretionary fiscal policy', content: `changes in government spending or taxes that require legislation; deliberate macro stabilization.` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'crowding out', content: `reduction in private investment caused by government deficit borrowing pushing up interest rates.` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'budget deficit', content: `government spending exceeds revenue in a given year (annual flow).` },
    { loId: 'apmacro.fiscal-policy', kind: 'definition', title: 'national debt', content: `cumulative sum of past deficits minus surpluses (stock).` },
  ],
  methods: [
    {
      title: 'Design a fiscal package to close a gap (with multipliers)',
      steps: [
        `STEP 1 — COMPUTE the multipliers from MPC: spending = one over (one minus MPC); tax = minus MPC over (one minus MPC).`,
        `STEP 2 — SIZE each option's AD shift: spending option = spending multiplier × ΔG; tax option = |tax multiplier| × the tax cut.`,
        `STEP 3 — COMPARE against the gap: which option closes it, over-closes, or falls short.`,
        `STEP 4 — EXACT-CLOSE MIX: solve (spending mult × ΔG) + (|tax mult| × tax cut) = gap; or use the balanced-budget shortcut ΔG = ΔT = gap.`,
        `STEP 5 — CAVEATS to state: crowding out will trim the shift, and the fixed-price assumption only holds with slack (flat SRAS).`,
      ],
      example: {
        problem: `A recessionary gap of four hundred billion dollars; MPC = 0.75. Compare raising G by one hundred billion vs cutting taxes by one hundred billion, and give a mix that exactly closes the gap.`,
        solution: `Multipliers: spending four, tax minus three. G option: four × one hundred = four hundred billion — closes the gap exactly. Tax option: three × one hundred = three hundred billion — closes three-quarters. Balanced-budget alternative: raise G and T by four hundred billion each (balanced-budget multiplier one). Caveat: crowding out and steepening SRAS would trim these in practice.`,
      },
      relatedLoIds: ['apmacro.fiscal-policy'],
    },
    {
      title: 'Explain crowding out and judge its size',
      steps: [
        `STEP 1 — MECHANISM: deficit → government borrows (issues bonds) → demand for loanable funds rises → real interest rate rises.`,
        `STEP 2 — OFFSET: higher rates reduce private I and rate-sensitive C, subtracting from the AD shift the multiplier alone predicts.`,
        `STEP 3 — SIZE BY SLACK: full employment → large crowding out (scarce funds); deep recession → small (idle savings, rates barely move).`,
        `STEP 4 — CONCLUDE: net AD effect = multiplier effect minus crowding-out offset; state which regime the economy is in.`,
      ],
      example: {
        problem: `The government enacts a three-hundred-billion-dollar deficit-financed stimulus. Why will the AD increase likely undershoot the textbook multiplier, and when would the shortfall be largest?`,
        solution: `Bond issuance to fund the deficit raises interest rates, which crowds out private investment — the fall in I offsets part of the rise in G. The shortfall is largest at FULL EMPLOYMENT (loanable funds scarce, rates spike, I drops hard) and smallest in a DEEP RECESSION (abundant idle savings, rates barely move).`,
      },
      relatedLoIds: ['apmacro.fiscal-policy'],
    },
  ],
  pointers: [
    { content: 'Expansionary: G↑ and/or T↓ → AD right (recessionary gap). Contractionary: mirror (inflationary gap).', kind: 'tip' },
    { content: 'AD shift = multiplier × change. Spending beats an equal-size tax cut by a factor of one over MPC.', kind: 'tip' },
    { content: 'Deficit = flow (this year); debt = stock (cumulative). AP tests the distinction directly.', kind: 'tip' },
    { content: 'Crowding out: deficit borrowing → rates up → I down. Big at full employment, small in deep recession.', kind: 'tip' },
    { content: 'Three lags — recognition, legislative, implementation — make fiscal policy slow to land.', kind: 'tip' },
    { content: 'Balanced-budget stimulus still works: equal G and T increases shift AD by exactly ΔG.', kind: 'tip' },
  ],
};
