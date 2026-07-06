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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.multipliers.v1' }],
  theory: [
    { loId: 'apmacro.multipliers', content: `MARGINAL PROPENSITY TO CONSUME (MPC): the fraction of an additional dollar of disposable income that a household spends on consumption. Typical MPC values for AP problems: 0.6 to 0.9.` },
    { loId: 'apmacro.multipliers', content: 'MARGINAL PROPENSITY TO SAVE (MPS): the fraction saved. Identity: MPC + MPS = 1.' },
    { loId: 'apmacro.multipliers', content: `SPENDING MULTIPLIER = 1 / (1 − MPC) = 1 / MPS. Tells you how much real GDP rises per dollar of new SPENDING (G or autonomous I).` },
    { loId: 'apmacro.multipliers', content: `INTUITION FOR SPENDING MULTIPLIER: the government spends $100. Recipients earn $100, spend MPC × $100 = $80 (if MPC=0.8). Next round earns $80, spends $64. Next $64, spends $51.20. Sum: 100 + 80 + 64 + 51.20 + ... = 100 / (1 − 0.8) = $500. The infinite geometric series converges to original × multiplier.` },
    { loId: 'apmacro.multipliers', content: `TAX MULTIPLIER = −MPC / (1 − MPC) = −MPC × spending multiplier. Tells you how much real GDP changes per dollar of TAX change.` },
    { loId: 'apmacro.multipliers', content: `WHY TAX MULTIPLIER IS SMALLER (in magnitude): a tax cut puts a dollar in households' pockets. They consume only MPC of it (they save the rest). Only MPC enters the spending cycle initially; the rest sits as savings. So the first round is smaller, and all subsequent rounds are scaled down accordingly.` },
    { loId: 'apmacro.multipliers', content: `EXAMPLE: MPC = 0.75. Spending multiplier = 1/0.25 = 4. Tax multiplier = −0.75/0.25 = −3. A $100 increase in G raises GDP by $400. A $100 tax CUT raises GDP by $300 (the tax multiplier is negative; cut taxes by $100 means ΔT = −$100, so ΔGDP = −3 × (−100) = +$300).` },
    { loId: 'apmacro.multipliers', content: `BALANCED-BUDGET MULTIPLIER = 1. If the government raises G by $100 AND raises T by $100 (zero deficit impact), the net effect on GDP is +$100. Why? G's effect: +4 × 100 = +400. T's effect: −3 × 100 = −300. Sum: +100. Even balanced spending stimulates the economy by exactly the spending amount.` },
    { loId: 'apmacro.multipliers', content: `MULTIPLIER ASSUMPTIONS: MPC is constant; spare capacity exists (price level fixed); no crowding-out from interest rates rising. In real economies these conditions break down at full employment, where multipliers shrink.` },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'marginal propensity to consume (MPC)', content: 'fraction of an additional dollar of income that is spent on consumption.' },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'spending multiplier', content: '1 / (1 − MPC); the multiple by which GDP rises per dollar of new spending.' },
    { loId: 'apmacro.multipliers', kind: 'definition', title: 'tax multiplier', content: `−MPC / (1 − MPC); the multiple by which GDP changes per dollar of tax change (negative because a tax INCREASE reduces GDP).` },
  ],
  methods: [
    {
      title: 'Worked multiplier compute',
      steps: [
        'STEP 1 — MPS = 1 − MPC = 1 − 0.8 = 0.2.',
        'STEP 2 — SPENDING MULTIPLIER = 1 / (1 − MPC) = 1 / 0.2 = 5.',
        'STEP 3 — TAX MULTIPLIER = −MPC / (1 − MPC) = −0.8 / 0.2 = −4.',
        `STEP 4 — SPENDING change: ΔGDP = spending multiplier × ΔG = 5 × $200B = +$1,000B (or +$1T).`,
        `STEP 5 — TAX CUT: ΔT = −$200B (it's a cut). ΔGDP = tax multiplier × ΔT = −4 × (−$200B) = +$800B.`,
        `STEP 6 — COMPARE. Same dollar amount, different effect: $200B in spending generates $1T of GDP; $200B in tax cuts generates $800B. Why? When G rises $200B, ALL $200B enters the spending cycle in round 1. When taxes are cut $200B, households save MPS × $200B = $40B; only $160B enters the spending cycle in round 1. The smaller first-round injection cascades into smaller subsequent rounds.`,
      ],
      example: { problem: `MPC = 0.8. (a) Compute the spending multiplier and the tax multiplier. (b) The government increases purchases of goods and services by $200B. Compute the total change in real GDP. (c) Alternatively, the government cuts taxes by $200B. Compute the total change in real GDP. (d) Compare and explain why the two are different.`, solution: `Spending multiplier = 5; tax multiplier = −4. ΔG +$200B → ΔGDP +$1T. Tax cut $200B → ΔGDP +$800B. Spending hits harder.` },
      relatedLoIds: ['apmacro.multipliers'],
    },
  ],
  pointers: [
    { content: 'MPC + MPS = 1.', kind: 'tip' },
    { content: 'Spending multiplier = 1/(1−MPC) = 1/MPS.', kind: 'tip' },
    { content: 'Tax multiplier = −MPC/(1−MPC) = −MPC × spending multiplier.', kind: 'tip' },
    { content: `|Spending multiplier| > |tax multiplier| because all new G enters the cycle; only MPC of tax cut enters.`, kind: 'tip' },
    { content: 'Balanced-budget multiplier = 1 always.', kind: 'tip' },
    { content: 'Higher MPC → larger multipliers → fiscal policy more potent.', kind: 'tip' },
  ],
};
