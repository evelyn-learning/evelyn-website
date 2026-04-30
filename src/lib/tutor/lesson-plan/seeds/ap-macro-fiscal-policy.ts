/**
 * AP Macro — Fiscal Policy.
 *
 * Government spending and taxes, multipliers, automatic stabilizers, debt vs deficit.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MACRO_FISCAL_POLICY: LessonPlan = {
  id: 'evelyn.ap.macro.fiscal-policy.v1',
  title: 'Fiscal Policy',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fiscal-policy',
      description: 'Apply expansionary and contractionary fiscal policy in the AD-AS model, compute spending and tax multipliers, and distinguish debt from deficit.',
      standard: 'AP-MACRO-3',
    },
  ],
  prerequisites: ['apmacro.ad-as'],
  followUps: ['apmacro.monetary-policy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Government spending and taxes as macro tools.',
      script: 'When a recession hits, governments don\'t sit and watch. They cut taxes, spend more on infrastructure, send checks to households. That\'s fiscal policy: using the budget to push the economy. Done right, it shortens downturns. Done wrong, it leaves debt for the next generation. Knowing when each tool works is half of macroeconomics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-fiscal',
      kind: 'concept',
      goal: 'Tools, multipliers, automatic stabilizers, debt vs deficit.',
      keyIdeas: [
        'EXPANSIONARY FISCAL POLICY: government spending UP and/or taxes DOWN. Used in recessions. Shifts AD RIGHT. Goal: raise real GDP and reduce unemployment.',
        'CONTRACTIONARY FISCAL POLICY: spending DOWN and/or taxes UP. Used to cool an overheating economy. Shifts AD LEFT.',
        'SPENDING MULTIPLIER: ΔGDP = (1 / (1 − MPC)) × ΔG. MPC = marginal propensity to consume. Households spend the income they receive, sellers re-spend, etc. — money cycles through the economy. If MPC = 0.8, multiplier = 5.',
        'TAX MULTIPLIER: ΔGDP = (−MPC / (1 − MPC)) × ΔT. Smaller magnitude than spending multiplier (and opposite sign). When taxes drop, households save part of the cut (1 − MPC) — only MPC enters the cycle.',
        'AUTOMATIC STABILIZERS: budget items that automatically smooth booms/busts without new legislation. Progressive taxes (collect more in good times), unemployment insurance (pays out in bad times). Built-in dampeners.',
        'DISCRETIONARY policy: requires legislation. Slower but more targeted (stimulus packages, Recovery Act).',
        'BUDGET DEFICIT (annual): government spending > revenue THIS YEAR. NATIONAL DEBT (cumulative): total of all past deficits minus surpluses.',
        'CROWDING OUT: when the government borrows to spend, it competes with private borrowing, raising interest rates and reducing private investment. Reduces fiscal policy\'s effectiveness in the long run.',
        'TIME LAGS: recognition lag (data takes time), legislative lag (Congress is slow), implementation lag (programs take time to start). All make discretionary policy hard to time.',
      ],
      vocabulary: [
        { term: 'marginal propensity to consume (MPC)', definition: 'fraction of additional income that is spent rather than saved.' },
        { term: 'crowding out', definition: 'reduction in private investment caused by government borrowing raising interest rates.' },
        { term: 'automatic stabilizer', definition: 'a budget rule that adjusts revenue or spending counter-cyclically without new legislation.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-multiplier',
      kind: 'worked_example',
      problem: 'MPC = 0.75. The government increases spending by $100 billion. What is the spending multiplier and the total change in GDP?',
      steps: [
        'Spending multiplier = 1 / (1 − MPC) = 1 / 0.25 = 4.',
        'ΔGDP = multiplier × ΔG = 4 × $100B = $400B.',
        'INTUITION: $100B in government spending generates $100B in income for sellers. They spend 75% ($75B) on goods, raising others\' incomes. Those people spend 75% of $75B, etc. The infinite cycle sums to 4 × original.',
        'COMPARE: a $100B tax cut. Tax multiplier = −MPC / (1 − MPC) = −0.75 / 0.25 = −3 (so a tax CUT raises GDP by 3 × $100B = $300B). Spending hits harder because all the money enters the cycle, vs only the spent portion of a tax cut.',
      ],
      answer: 'Multiplier = 4. ΔGDP = $400B. (Tax cut would yield $300B for the same dollar amount.)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does unemployment insurance act as an automatic stabilizer during a recession?',
      expectedAnswer: 'When unemployment rises, more people receive UI payments without any new legislation. This boosts household spending counter-cyclically — cushioning the fall in AD. When the economy recovers, UI payments drop automatically, reducing fiscal stimulus. The system self-adjusts.',
      responseFormat: 'free',
      hints: [
        'What happens to UI payments during a recession?',
        'Does it require Congress to pass new laws?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-debt-deficit',
      kind: 'misconception_check',
      question: 'Are "debt" and "deficit" the same thing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating annual flow with cumulative stock.',
          correctsTo: 'No. DEFICIT = how much spending exceeds revenue THIS YEAR (a flow). DEBT = total accumulated borrowings from past deficits minus surpluses (a stock). A balanced budget reduces the deficit to zero but does NOT pay off the debt. Debt only falls if the government runs SURPLUSES. Easy way to remember: deficit is a year\'s gap; debt is the running total.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Expansionary: G ↑ or T ↓. Contractionary: G ↓ or T ↑.',
        'Spending multiplier = 1/(1−MPC). Tax multiplier = −MPC/(1−MPC). Spending hits harder.',
        'Automatic stabilizers: progressive taxes + UI. Smooth without new laws.',
        'Deficit = annual flow. Debt = cumulative stock.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do fiscal-policy time lags weaken its usefulness as a recession-fighting tool?',
      hint: 'Recognition (data lag, ~6 months) + legislation (Congress, ~6-12 months) + implementation (programs, ~6 months) sum to roughly 18 months. By the time stimulus hits, the economy may already be recovering — the spending then arrives during a boom, fueling inflation. Monetary policy has shorter lags. This is one argument for relying more on automatic stabilizers + monetary policy for short-run smoothing.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
