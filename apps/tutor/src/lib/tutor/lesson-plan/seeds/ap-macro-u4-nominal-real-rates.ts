/**
 * AP Macroeconomics — CED Unit 4.2: Nominal vs Real Interest Rates.
 *
 * Fisher equation in financial context. Builds on U2.5 (Costs of
 * Inflation, where Fisher was introduced) and prepares for monetary
 * policy in U4.6 (which acts on nominal rates while real rates drive
 * investment).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_NOMINAL_REAL_RATES: LessonPlan = {
  id: 'evelyn.ap.macro.nominal-vs-real-interest-rates.v1',
  title: 'U4.2 Nominal vs Real Interest Rates',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.nominal-vs-real-interest-rates',
      description:
        'Apply the Fisher equation to convert between nominal and real interest rates, distinguish ex-ante (expected) from ex-post (actual) real rates, and identify which rate matters for which decision.',
      standard: 'AP-MACRO-4.2',
    },
  ],
  prerequisites: ['apmacro.financial-assets', 'apmacro.costs-of-inflation'],
  followUps: ['apmacro.functions-of-money'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the nominal-vs-real distinction feel like a critical practical skill.',
      script:
        "If your savings account pays 4 percent and inflation is 6 percent, your money is LOSING purchasing power even though the balance is growing. The nominal rate tells you the dollar growth; the real rate tells you the purchasing-power growth. Mixing the two up is a costly financial-literacy error — and a reliable AP point-loser.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-nominal-real',
      kind: 'concept',
      goal: 'Cover the Fisher equation, ex-ante vs ex-post, and which rate is relevant for which decision.',
      keyIdeas: [
        'NOMINAL INTEREST RATE: the stated rate on a loan or savings account, in dollar terms. The number you see on a bank statement or loan contract.',
        'REAL INTEREST RATE: the nominal rate adjusted for inflation. Tells you the change in PURCHASING POWER from holding the asset.',
        'FISHER EQUATION (approximate): REAL ≈ NOMINAL − INFLATION. Or equivalently: NOMINAL ≈ REAL + INFLATION. (The exact form is (1+nominal) = (1+real)(1+inflation), but the additive approximation is accurate for small rates and is what AP uses.)',
        'EX-ANTE (expected) real rate: nominal − EXPECTED inflation. This is the rate borrowers and lenders THINK they are agreeing to at the time of the contract.',
        'EX-POST (actual) real rate: nominal − ACTUAL inflation that occurred over the loan period. Only known after the fact.',
        'WHEN ACTUAL > EXPECTED inflation: ex-post real rate is LOWER than ex-ante. Borrowers BENEFIT (they pay back in cheaper dollars); lenders LOSE.',
        'WHEN ACTUAL < EXPECTED inflation: ex-post real rate is HIGHER than ex-ante. Borrowers LOSE (their fixed nominal payments are more burdensome in real terms); lenders BENEFIT.',
        'WHICH RATE MATTERS FOR WHICH DECISION:',
        '(a) INVESTMENT decisions (whether to build a factory, buy equipment): driven by REAL interest rate. Firms care about real cost of borrowing relative to real return.',
        '(b) SAVING decisions: driven by REAL interest rate. Savers care about purchasing power growth.',
        '(c) STATED rates on loan contracts: NOMINAL. Banks set nominal rates because inflation is uncertain at signing.',
        '(d) MONETARY POLICY: the Fed targets NOMINAL rates (federal funds rate is nominal), but its REAL effect on the economy is through the real rate.',
      ],
      vocabulary: [
        { term: 'nominal interest rate', definition: 'the stated rate of return in dollar terms.' },
        { term: 'real interest rate', definition: 'nominal rate adjusted for inflation; measures change in purchasing power.' },
        { term: 'ex-ante real rate', definition: 'real rate calculated using expected inflation, set at contract time.' },
        { term: 'ex-post real rate', definition: 'real rate calculated using actual inflation, known only after the period.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fisher',
      kind: 'worked_example',
      problem:
        'A 5-year loan is issued at a 7% nominal interest rate. At signing, both lender and borrower expected 3% annual inflation. (a) Compute the ex-ante real rate. (b) Suppose actual inflation averages 6% over the 5 years. Compute the ex-post real rate. (c) Identify who gains and who loses from the inflation surprise.',
      steps: [
        'STEP 1 — EX-ANTE REAL RATE: nominal − expected inflation = 7% − 3% = 4%. The lender expected 4% real return on the loan; the borrower expected to pay 4% real interest.',
        'STEP 2 — EX-POST REAL RATE: nominal − actual inflation = 7% − 6% = 1%. The lender actually earned only 1% in real terms.',
        'STEP 3 — WHO GAINS: BORROWER. They locked in a fixed 7% nominal payment. Their dollars repaid are worth less than expected (because actual inflation was higher), so the real burden of their debt is LOWER than what they signed up for. They effectively paid only 1% real interest instead of the expected 4%.',
        'STEP 4 — WHO LOSES: LENDER. They locked in 7% nominal expecting 4% real return. The dollars they receive are worth less than they expected; their real return is only 1%. They cannot retroactively raise the rate.',
        'STEP 5 — INTUITION. Surprise inflation transfers wealth from CREDITORS to DEBTORS. This is one reason borrowers (homeowners with fixed-rate mortgages, indebted businesses) prefer high inflation; lenders (bondholders, savers) prefer low inflation.',
      ],
      answer: 'Ex-ante real = 4%. Ex-post real = 1%. Borrower gains 3 pp; lender loses 3 pp.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-which-rate',
      kind: 'try_yourself',
      problem:
        'For each decision, identify whether the NOMINAL or REAL interest rate is the relevant one to consider, and briefly justify.',
      expectedAnswer:
        '(Sample scenarios; AP problem typically gives 4-5.) (a) "A firm deciding whether to take out a loan to build a new warehouse": REAL rate. The firm cares about whether the real cost of borrowing is less than the real return on the warehouse. Inflation will affect both the loan payments and the firm\'s revenue similarly, so the real comparison is what matters. (b) "A bank deciding what nominal rate to charge on a new mortgage": NOMINAL is what gets QUOTED, but the bank chooses the level by adding the real return target plus expected inflation. So both — the real determines the substantive return, the nominal is what gets written in the contract. (c) "A retiree on a fixed nominal pension trying to decide if she can afford a vacation": REAL purchasing power matters most. Her pension is fixed in nominal terms, but inflation eats away at what she can actually buy. (d) "An investor comparing two CDs offered at different banks": NOMINAL for direct comparison (assuming inflation is the same for both), but REAL for assessing whether either is "worth it" relative to inflation. (e) "A bond trader pricing a 10-year Treasury bond": Both — the YIELD quoted is nominal, but the trader uses real-rate models adjusted for expected inflation to assess fair value.',
      responseFormat: 'free',
      hints: [
        'Investment / saving / consumption decisions: real.',
        'Stated rates in contracts: nominal.',
        'Most decisions involve real considerations even when nominal is what is quoted.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-fisher-compute',
      kind: 'try_yourself',
      problem:
        'A savings account pays 3% nominal interest. (a) If inflation is 1%, what is the real rate? (b) If inflation is 5%, what is the real rate? (c) In which case is the saver gaining purchasing power, and in which losing?',
      expectedAnswer:
        '(a) Real ≈ 3% − 1% = 2%. (b) Real ≈ 3% − 5% = −2%. (c) (a) GAINING purchasing power: the dollar balance grows faster than inflation, so the same dollars buy more goods next year. (b) LOSING purchasing power: even though the dollar balance grows 3% per year, prices grow 5%, so the saver can buy LESS each year despite the growing balance. Negative real rate means money sitting in savings is losing purchasing power. AP frequently tests this: students who see "3% yield" without checking inflation may incorrectly assume the saver is gaining ground.',
      responseFormat: 'numeric',
      hints: [
        'Real ≈ nominal − inflation.',
        'Negative real rate = losing purchasing power.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Real ≈ Nominal − Inflation (Fisher equation, additive form).',
        'Ex-ante: at contract time, using EXPECTED inflation.',
        'Ex-post: after the fact, using ACTUAL inflation.',
        'Surprise inflation: borrowers GAIN, lenders LOSE.',
        'Investment/saving decisions: REAL rate matters. Stated contract rates: NOMINAL.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.2',
    cedTitle: 'Nominal vs Real Interest Rates',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '9', note: 'OpenStax Macro AP — Fisher equation and ex-ante / ex-post distinction.' },
    ],
  },
};
