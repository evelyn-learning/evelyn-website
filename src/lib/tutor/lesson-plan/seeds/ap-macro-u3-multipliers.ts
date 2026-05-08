/**
 * AP Macroeconomics — CED Unit 3.2: Multipliers.
 *
 * The spending multiplier 1/(1-MPC), the tax multiplier -MPC/(1-MPC),
 * MPC + MPS = 1, and the relationship between AD shifts and induced GDP
 * changes. Heavy on numerical worked examples — AP tests this every year.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_MULTIPLIERS: LessonPlan = {
  id: 'evelyn.ap.macro.multipliers.v1',
  title: 'Multipliers',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.multipliers',
      description:
        'Compute the spending multiplier from MPC, compute the tax multiplier, apply each to find the total change in real GDP from initial spending or tax changes, and explain why the spending multiplier exceeds the tax multiplier in magnitude.',
      standard: 'AP-MACRO-3.2',
    },
  ],
  prerequisites: ['apmacro.aggregate-demand'],
  followUps: ['apmacro.short-run-aggregate-supply'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the multiplier feel like a chain reaction.',
      script:
        "When the government spends $100 billion, GDP rises by MORE than $100 billion. Why? The recipients of that spending earn income; they spend most of it; the next round earns income; spends most of it; and so on. The infinite cycle SUMS to a finite multiplier — typically 2 to 5 times the original spending. This is the most important arithmetic in fiscal policy.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-multipliers',
      kind: 'concept',
      goal: 'Cover MPC, MPS, the two multipliers, and why they differ.',
      keyIdeas: [
        'MARGINAL PROPENSITY TO CONSUME (MPC): the fraction of an additional dollar of disposable income that a household spends on consumption. Typical MPC values for AP problems: 0.6 to 0.9.',
        'MARGINAL PROPENSITY TO SAVE (MPS): the fraction saved. Identity: MPC + MPS = 1.',
        'SPENDING MULTIPLIER = 1 / (1 − MPC) = 1 / MPS. Tells you how much real GDP rises per dollar of new SPENDING (G or autonomous I).',
        'INTUITION FOR SPENDING MULTIPLIER: the government spends $100. Recipients earn $100, spend MPC × $100 = $80 (if MPC=0.8). Next round earns $80, spends $64. Next $64, spends $51.20. Sum: 100 + 80 + 64 + 51.20 + ... = 100 / (1 − 0.8) = $500. The infinite geometric series converges to original × multiplier.',
        'TAX MULTIPLIER = −MPC / (1 − MPC) = −MPC × spending multiplier. Tells you how much real GDP changes per dollar of TAX change.',
        'WHY TAX MULTIPLIER IS SMALLER (in magnitude): a tax cut puts a dollar in households\' pockets. They consume only MPC of it (they save the rest). Only MPC enters the spending cycle initially; the rest sits as savings. So the first round is smaller, and all subsequent rounds are scaled down accordingly.',
        'EXAMPLE: MPC = 0.75. Spending multiplier = 1/0.25 = 4. Tax multiplier = −0.75/0.25 = −3. A $100 increase in G raises GDP by $400. A $100 tax CUT raises GDP by $300 (the tax multiplier is negative; cut taxes by $100 means ΔT = −$100, so ΔGDP = −3 × (−100) = +$300).',
        'BALANCED-BUDGET MULTIPLIER = 1. If the government raises G by $100 AND raises T by $100 (zero deficit impact), the net effect on GDP is +$100. Why? G\'s effect: +4 × 100 = +400. T\'s effect: −3 × 100 = −300. Sum: +100. Even balanced spending stimulates the economy by exactly the spending amount.',
        'MULTIPLIER ASSUMPTIONS: MPC is constant; spare capacity exists (price level fixed); no crowding-out from interest rates rising. In real economies these conditions break down at full employment, where multipliers shrink.',
      ],
      vocabulary: [
        { term: 'marginal propensity to consume (MPC)', definition: 'fraction of an additional dollar of income that is spent on consumption.' },
        { term: 'spending multiplier', definition: '1 / (1 − MPC); the multiple by which GDP rises per dollar of new spending.' },
        { term: 'tax multiplier', definition: '−MPC / (1 − MPC); the multiple by which GDP changes per dollar of tax change (negative because a tax INCREASE reduces GDP).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-multiplier-compute',
      kind: 'worked_example',
      problem:
        'MPC = 0.8. (a) Compute the spending multiplier and the tax multiplier. (b) The government increases purchases of goods and services by $200B. Compute the total change in real GDP. (c) Alternatively, the government cuts taxes by $200B. Compute the total change in real GDP. (d) Compare and explain why the two are different.',
      steps: [
        'STEP 1 — MPS = 1 − MPC = 1 − 0.8 = 0.2.',
        'STEP 2 — SPENDING MULTIPLIER = 1 / (1 − MPC) = 1 / 0.2 = 5.',
        'STEP 3 — TAX MULTIPLIER = −MPC / (1 − MPC) = −0.8 / 0.2 = −4.',
        'STEP 4 — SPENDING change: ΔGDP = spending multiplier × ΔG = 5 × $200B = +$1,000B (or +$1T).',
        'STEP 5 — TAX CUT: ΔT = −$200B (it\'s a cut). ΔGDP = tax multiplier × ΔT = −4 × (−$200B) = +$800B.',
        'STEP 6 — COMPARE. Same dollar amount, different effect: $200B in spending generates $1T of GDP; $200B in tax cuts generates $800B. Why? When G rises $200B, ALL $200B enters the spending cycle in round 1. When taxes are cut $200B, households save MPS × $200B = $40B; only $160B enters the spending cycle in round 1. The smaller first-round injection cascades into smaller subsequent rounds.',
      ],
      answer: 'Spending multiplier = 5; tax multiplier = −4. ΔG +$200B → ΔGDP +$1T. Tax cut $200B → ΔGDP +$800B. Spending hits harder.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-mpc-formula',
      kind: 'try_yourself',
      problem:
        'State the formula for the spending multiplier and the tax multiplier in terms of MPC. Then briefly explain why the spending multiplier is LARGER in magnitude than the tax multiplier.',
      expectedAnswer:
        'Spending multiplier = 1 / (1 − MPC). Tax multiplier = −MPC / (1 − MPC). The spending multiplier is larger in magnitude because new spending puts the FULL dollar into the spending cycle in round one, while a tax change initially affects only the MPC fraction of it (households save the (1−MPC) portion of any tax cut). Only the spent portion cascades through subsequent rounds, so the cycle starts from a smaller base and yields a smaller total. Algebraically: tax multiplier = −MPC × spending multiplier, so |tax multiplier| / |spending multiplier| = MPC < 1.',
      responseFormat: 'free',
      hints: [
        'The two formulas differ by a factor of MPC.',
        'Why does $1 of G enter the cycle differently than $1 of tax cut?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-multiplier-compute',
      kind: 'try_yourself',
      problem:
        'MPC = 0.6. (a) Compute the spending multiplier. (b) Compute the tax multiplier. (c) The government simultaneously increases purchases by $100B AND raises taxes by $100B (a balanced budget operation). Compute the net change in real GDP.',
      expectedAnswer:
        '(a) Spending multiplier = 1 / (1 − 0.6) = 1 / 0.4 = 2.5. (b) Tax multiplier = −0.6 / 0.4 = −1.5. (c) Effect of ΔG = +$100B: ΔGDP = 2.5 × 100 = +$250B. Effect of ΔT = +$100B (tax increase): ΔGDP = −1.5 × 100 = −$150B. Net: +250 + (−150) = +$100B. The balanced-budget multiplier equals 1 — net change in GDP equals the original spending change. Useful AP fact: this is true in general (balanced-budget multiplier = 1) regardless of MPC.',
      responseFormat: 'numeric',
      hints: [
        'Compute each multiplier from MPC.',
        'For a balanced budget, both G and T increase by the same amount.',
        'Net effect = ΔG × spending multiplier + ΔT × tax multiplier.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-mpc-large',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. Country A has MPC = 0.9. Country B has MPC = 0.5. Both countries' governments increase spending by $50B. (a) Compute the spending multiplier for each country. (b) Compute the change in GDP for each country. (c) Briefly explain WHY MPC matters for fiscal-policy effectiveness, and identify TWO reasons why MPC might be HIGHER in some countries than others.",
      expectedAnswer:
        '(a) Country A: spending multiplier = 1/(1−0.9) = 1/0.1 = 10. Country B: 1/(1−0.5) = 1/0.5 = 2. (b) Country A: ΔGDP = 10 × $50B = $500B. Country B: ΔGDP = 2 × $50B = $100B. Same fiscal stimulus, 5× the GDP impact in Country A. (c) Higher MPC means more of each round of spending cascades into the next round, expanding the multiplier exponentially. Reasons MPC may differ across countries (any two of the following): (i) DEMOGRAPHICS — younger populations tend to consume more of marginal income; older populations save more for retirement. (ii) WEALTH DISTRIBUTION — lower-income households spend a higher fraction of marginal income; high-inequality economies with concentrated wealth at the top often have lower aggregate MPC. (iii) FINANCIAL ACCESS — economies where households can borrow easily smooth consumption more, raising effective MPC. (iv) CULTURE / SAVINGS NORMS — cultures with strong saving habits (e.g. Japan) have lower MPC. (v) INSTITUTIONAL FACTORS — generous social safety nets reduce precautionary saving, raising MPC. Strong answers cite specific mechanisms, not just "they save more."',
      responseFormat: 'frq',
      hints: [
        'Higher MPC → spending cascades further → larger multiplier.',
        'What demographic / institutional factors influence saving rates?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'MPC + MPS = 1.',
        'Spending multiplier = 1/(1−MPC) = 1/MPS.',
        'Tax multiplier = −MPC/(1−MPC) = −MPC × spending multiplier.',
        '|Spending multiplier| > |tax multiplier| because all new G enters the cycle; only MPC of tax cut enters.',
        'Balanced-budget multiplier = 1 always.',
        'Higher MPC → larger multipliers → fiscal policy more potent.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.2',
    cedTitle: 'Multipliers',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '17', note: 'OpenStax Macro AP — multiplier derivation, MPC variation.' },
    ],
  },
};
