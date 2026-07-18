/**
 * AP Macroeconomics — Unit 3 CED 3.2: Multipliers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.multipliers.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_MULTIPLIERS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.multipliers.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Multipliers',
  planId: 'evelyn.ap.macro.multipliers.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.multipliers.v1' }],
  theory: [
    { loId: 'apmacro.multipliers', content: `MARGINAL PROPENSITY TO CONSUME (MPC): the fraction of an ADDITIONAL dollar of disposable income that a household spends. MARGINAL PROPENSITY TO SAVE (MPS): the fraction saved. IDENTITY: $MPC + MPS = 1$.` },
    { loId: 'apmacro.multipliers', kind: 'formula', title: 'spending multiplier', content: `$\\text{spending multiplier} = \\frac{1}{1 - MPC} = \\frac{1}{MPS}$. How much real GDP rises per dollar of NEW SPENDING (a change in G or autonomous I). With MPC of 0.8 the multiplier is five.` },
    { loId: 'apmacro.multipliers', kind: 'formula', title: 'tax multiplier', content: `$\\text{tax multiplier} = \\frac{-MPC}{1 - MPC} = -MPC \\times \\text{spending multiplier}$. GDP change per dollar of TAX change — NEGATIVE because a tax INCREASE reduces GDP. A tax CUT is a negative $\\Delta T$, so its GDP effect is positive.` },
    { loId: 'apmacro.multipliers', content: `THE CHAIN-REACTION INTUITION: new government spending of one hundred (with MPC 0.8) → recipients earn one hundred, spend eighty → next round earns eighty, spends sixty-four → … The infinite geometric series sums to $\\frac{100}{1-0.8} = 500$. Original injection × multiplier.` },
    { loId: 'apmacro.multipliers', content: `WHY THE TAX MULTIPLIER IS SMALLER (in magnitude): a tax cut puts the dollar in households' pockets, and they SPEND only the MPC fraction of it — the saved slice never enters the spending cycle. The first round starts smaller, so every subsequent round is scaled down. Algebraically $|\\text{tax mult}| = MPC \\times \\text{spending mult} <$ spending mult.` },
    { loId: 'apmacro.multipliers', content: `WORKED CONTRAST at MPC 0.75: spending multiplier = four, tax multiplier = minus three. Raising G by one hundred billion dollars lifts GDP by four hundred billion; cutting taxes by the same amount lifts GDP by only three hundred billion.` },
    { loId: 'apmacro.multipliers', content: `BALANCED-BUDGET MULTIPLIER = 1, ALWAYS (regardless of MPC). Equal increases in G and T net out to a GDP change equal to the spending change itself: with MPC 0.75, the G effect (+four per dollar) and T effect (−three per dollar) sum to +one per dollar.` },
    { loId: 'apmacro.multipliers', content: `MPC DRIVES POTENCY: higher MPC → more of each round cascades onward → larger multiplier → fiscal policy more powerful. MPC 0.9 gives a multiplier of ten; MPC 0.5 gives two. MPC differs across countries with demographics, wealth distribution (lower-income households spend more of marginal income), financial access, savings culture, and safety-net generosity.` },
    { loId: 'apmacro.multipliers', content: `ASSUMPTIONS BEHIND THE TEXTBOOK MULTIPLIER: constant MPC, spare capacity (price level fixed), and no crowding out from rising interest rates. Near full employment these break down and real-world multipliers shrink well below the formula value.` },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'marginal propensity to consume (MPC)', content: `fraction of an additional dollar of income spent on consumption.` },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'spending multiplier', content: `one divided by (one minus MPC); the multiple by which GDP rises per dollar of new spending.` },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'tax multiplier', content: `negative MPC divided by (one minus MPC); the multiple by which GDP changes per dollar of tax change.` },
  ],
  methods: [
    {
      title: 'Compute GDP effects of spending and tax changes',
      steps: [
        `STEP 1 — $MPS = 1 - MPC$; spending multiplier $= \\frac{1}{MPS}$; tax multiplier $= \\frac{-MPC}{MPS}$.`,
        `STEP 2 — SPENDING change: $\\Delta GDP = \\text{spending multiplier} \\times \\Delta G$.`,
        `STEP 3 — TAX change: $\\Delta GDP = \\text{tax multiplier} \\times \\Delta T$. Watch the SIGNS: a tax cut is a negative $\\Delta T$, so the product turns positive.`,
        `STEP 4 — COMBINED packages: add the two effects. For equal-size G and T increases, shortcut: balanced-budget multiplier = 1, so $\\Delta GDP = \\Delta G$.`,
        `STEP 5 — EXPLAIN any spending-vs-tax difference: all of new G enters round one; only MPC of a tax cut does.`,
      ],
      example: {
        problem: `MPC = 0.8. (a) Find both multipliers. (b) GDP effect of raising G by two hundred billion dollars. (c) GDP effect of cutting taxes by two hundred billion. (d) Why do they differ?`,
        solution: `(a) Spending multiplier = $\\tfrac{1}{0.2} = 5$; tax multiplier = $\\tfrac{-0.8}{0.2} = -4$. (b) $\\Delta GDP = 5 \\times 200 = 1000$ billion. (c) $\\Delta T = -200$, so $\\Delta GDP = -4 \\times (-200) = +800$ billion. (d) All two hundred billion of new G enters the spending cycle in round one; of the tax cut, households save forty billion (MPS 0.2), so only one hundred sixty billion starts the cascade.`,
      },
      relatedLoIds: ['apmacro.multipliers'],
    },
  ],
  pointers: [
    { content: 'MPC + MPS = 1. Spending multiplier = 1/(1−MPC) = 1/MPS.', kind: 'tip' },
    { content: 'Tax multiplier = −MPC/(1−MPC) = −MPC × spending multiplier — always smaller in magnitude.', kind: 'tip' },
    { content: 'Sign care: a tax CUT is negative ΔT, so tax-multiplier × ΔT comes out positive.', kind: 'tip' },
    { content: 'Balanced-budget multiplier = 1 for any MPC: equal G and T increases raise GDP by exactly ΔG.', kind: 'tip' },
    { content: 'Higher MPC → bigger multiplier → more potent fiscal policy.', kind: 'tip' },
    { content: 'Textbook multipliers assume spare capacity and no crowding out — they shrink near full employment.', kind: 'tip' },
  ],
};
