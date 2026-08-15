/**
 * IB DP Math AA — Differentiation: Rules and Applications.
 * Power, product, quotient, chain rules; tangents/normals; max/min.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_DIFFERENTIATION: LessonPlan = {
  id: 'evelyn.ibdp.aa.differentiation.v1',
  title: 'IB DP Math AA — Differentiation Rules & Applications',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.differentiation',
      description: 'Apply power, product, quotient, and chain rules to differentiate functions; find equations of tangents and normals; locate stationary points and classify them.',
      standard: 'IB-DP-MATH-AA-5.3/5.6',
    },
  ],
  prerequisites: ['ibdp.aa.limits-continuity'],
  followUps: ['ibdp.aa.integration'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Differentiation rules unlock every IB AA calculus question — once internalised they\'re mechanical.',
      script: 'Power rule, product rule, quotient rule, chain rule. Memorise four templates and you can differentiate any function on the AA syllabus. Then applications follow: tangent lines (slope is the first derivative), max/min (set the derivative to zero), curve sketching (sign of the first and second derivatives).',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Four core rules + standard derivatives + max/min algorithm.',
      keyIdeas: [
        'POWER RULE: d/dx (x^n) = n·x^(n−1). Works for any real n (including fractional and negative).',
        'CONSTANT RULE: derivative of a constant is 0. Linearity: (af + bg)\' = af\' + bg\'.',
        'STANDARD DERIVATIVES: d/dx (sin x) = cos x; d/dx (cos x) = −sin x; d/dx (e^x) = e^x; d/dx (ln x) = 1/x.',
        'PRODUCT RULE: (fg)\' = f\'g + fg\'.',
        'QUOTIENT RULE: (f/g)\' = (f\'g − fg\')/g².',
        'CHAIN RULE: d/dx [f(g(x))] = f\'(g(x)) · g\'(x). Outer derivative times inner derivative.',
        'TANGENT LINE at x = a: y − f(a) = f\'(a)·(x − a). Slope is f\'(a).',
        'NORMAL LINE at x = a: perpendicular to tangent. Slope is −1/f\'(a).',
        'STATIONARY POINTS: f\'(x) = 0. Classify by f\'\'(x): positive → local min; negative → local max; zero → inconclusive (use sign-change test).',
      ],
      vocabulary: [
        { term: 'stationary point', definition: 'a point where f\'(x) = 0; could be max, min, or inflection.' },
        { term: 'normal', definition: 'the line perpendicular to the tangent at a given point.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-product-chain',
      kind: 'worked_example',
      problem: 'Differentiate y = x² · sin(3x).',
      steps: [
        'Recognise as a product: f(x) = x², g(x) = sin(3x).',
        'f\'(x) = 2x.',
        'g\'(x) = chain rule: outer is sin, derivative cos. Inner is 3x, derivative 3. So g\'(x) = cos(3x)·3 = 3 cos(3x).',
        'Apply product rule: dy/dx = f\'g + fg\' = 2x·sin(3x) + x²·3cos(3x) = 2x sin(3x) + 3x² cos(3x).',
      ],
      answer: 'dy/dx = 2x sin(3x) + 3x² cos(3x)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the stationary point(s) of y = x³ − 3x² + 4 and classify each.',
      expectedAnswer: '(0, 4) local maximum; (2, 0) local minimum',
      responseFormat: 'free',
      hints: [
        'dy/dx = 3x² − 6x = 3x(x − 2). Set = 0 → x = 0 or x = 2.',
        'd²y/dx² = 6x − 6. At x = 0: −6 < 0 → max. At x = 2: 6 > 0 → min.',
        'y(0) = 4; y(2) = 8 − 12 + 4 = 0.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-chain-rule',
      kind: 'misconception_check',
      question: 'A student differentiates y = sin(2x) and writes dy/dx = cos(2x). What\'s missing?',
      commonErrors: [
        {
          answer: 'dy/dx = cos(2x)',
          misconception: 'Forgetting to apply the chain rule when the argument is more than just x.',
          correctsTo: 'sin(2x) is a composite function: outer sin, inner 2x. Chain rule: derivative = cos(inner)·(derivative of inner) = cos(2x)·2 = 2 cos(2x). The factor of 2 comes from differentiating the inner function 2x. The general pattern: d/dx sin(g(x)) = cos(g(x))·g\'(x). Always check whether the argument has its own x-dependence.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Power rule: d/dx x^n = n x^(n−1). Standard: sin → cos, cos → −sin, e^x → e^x, ln x → 1/x.',
        'Product: (fg)\' = f\'g + fg\'. Quotient: (f/g)\' = (f\'g − fg\')/g².',
        'Chain rule: outer\' · inner\'. Always check argument.',
        'Stationary points where f\'(x) = 0; classify by f\'\'.',
        'Tangent slope = f\'(a); normal slope = −1/f\'(a).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the equation of the tangent to y = x²·e^x at x = 1.',
      hint: 'dy/dx (product rule) = 2x·e^x + x²·e^x = e^x(2x + x²). At x = 1: dy/dx = e·(2 + 1) = 3e. Point: y(1) = 1·e = e. Tangent: y − e = 3e(x − 1) → y = 3e·x − 2e.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
