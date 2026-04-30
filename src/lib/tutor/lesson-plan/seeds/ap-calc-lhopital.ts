/**
 * AP Calculus AB/BC — L'Hôpital's Rule.
 *
 * Limits of indeterminate forms (0/0, ∞/∞) using derivatives.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_LHOPITAL: LessonPlan = {
  id: 'evelyn.ap.calc.lhopitals-rule.v1',
  title: "L'Hôpital's Rule for indeterminate limits",
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalc.lhopitals',
      description: "Apply L'Hôpital's Rule to evaluate indeterminate-form limits.",
      standard: 'AP-CALC-LIM-4',
    },
  ],
  prerequisites: ['apcalc.derivative-rules'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show 0/0 as a frustrating problem until L\'Hôpital arrives.',
      script: 'You compute a limit and get 0/0. Useless — that\'s INDETERMINATE. L\'Hôpital said: take the derivative of top and bottom separately, retry. Often it works.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rule',
      kind: 'concept',
      goal: 'Statement, conditions, common indeterminate forms.',
      keyIdeas: [
        "L'HÔPITAL'S RULE: if lim x→a f(x)/g(x) gives 0/0 or ∞/∞, then it equals lim x→a f'(x)/g'(x), provided that latter limit exists.",
        'INDETERMINATE FORMS that L\'Hôpital handles directly: 0/0 and ∞/∞.',
        'OTHER INDETERMINATE FORMS (transform first, then apply): 0·∞, ∞−∞, 0⁰, ∞⁰, 1^∞.',
        'NOT INDETERMINATE: 0·5 = 0 (just zero), ∞ + 5 = ∞, etc. — don\'t apply L\'Hôpital to these.',
        'VERIFY indeterminate first by plugging in. Apply the rule. Repeat if you get another indeterminate form.',
        'CAUTION: derivative of TOP and derivative of BOTTOM separately — NOT the quotient rule. d/dx applies to f and g independently.',
      ],
      vocabulary: [
        { term: 'indeterminate form', definition: 'a limit expression like 0/0 or ∞/∞ whose value isn\'t determined by the form alone.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-sin-x-over-x',
      kind: 'worked_example',
      problem: 'Evaluate lim x→0 sin(x)/x.',
      steps: [
        'Plug in x = 0: sin(0)/0 = 0/0. Indeterminate.',
        'Apply L\'Hôpital: lim x→0 cos(x)/1.',
        'Plug in x = 0: cos(0)/1 = 1/1 = 1.',
        'Answer: 1.',
        'This is a famous limit — the foundation of d/dx sin(x) = cos(x).',
      ],
      answer: '1',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-infinity-form',
      kind: 'worked_example',
      problem: 'Evaluate lim x→∞ (3x² + 5)/(2x² − x).',
      steps: [
        'Plug in: ∞/∞. Indeterminate.',
        'Apply L\'Hôpital: lim x→∞ (6x)/(4x − 1).',
        'Still ∞/∞. Apply again: lim x→∞ 6/4 = 3/2.',
        'Answer: 3/2.',
        '(Also could divide by x²: (3 + 5/x²)/(2 − 1/x) → 3/2 as x→∞.)',
      ],
      answer: '3/2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate lim x→0 (e^x − 1)/x.',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: [
        'Plug in: (1 − 1)/0 = 0/0. Indeterminate.',
        "Apply L'Hôpital: derivative of top is e^x; derivative of bottom is 1.",
        'lim x→0 e^x/1 = 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-quotient-rule',
      kind: 'misconception_check',
      question: 'For L\'Hôpital, do I use the QUOTIENT RULE on f/g?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing L\'Hôpital with quotient rule.',
          correctsTo: 'No — L\'Hôpital takes derivative of TOP and BOTTOM separately. Quotient rule is for differentiating a quotient as a function. They\'re completely different operations even though both involve f/g.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "L'Hôpital: if 0/0 or ∞/∞, take derivative of top and bottom separately.",
        'Verify INDETERMINATE first by plugging in.',
        'Other forms (0·∞, etc.) need algebraic manipulation first.',
        'Can apply repeatedly if still indeterminate.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How would you handle lim x→∞ x · sin(1/x), which is the indeterminate form ∞·0?',
      hint: 'Rewrite as sin(1/x)/(1/x). Now it\'s 0/0 as x→∞. Apply L\'Hôpital. Answer: 1.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
