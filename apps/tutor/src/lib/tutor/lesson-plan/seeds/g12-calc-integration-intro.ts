/**
 * G12 — Calculus: Integration intro (antiderivatives, basic rules,
 * Fundamental Theorem).
 *
 * Integration as the inverse of differentiation. The antiderivative
 * (indefinite integral). Basic integration rules (reverse of power
 * rule). The Fundamental Theorem of Calculus connecting derivatives
 * and integrals. Definite integral as area under a curve.
 */

import type { LessonPlan } from '../types';

export const SEED_G12_CALC_INTEGRATION_INTRO: LessonPlan = {
  id: 'evelyn.g12.math.calc.integration-intro.v1',
  title: 'Integration: Antiderivatives and the Fundamental Theorem',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.calc.integration',
      description: 'Compute basic antiderivatives and apply the Fundamental Theorem of Calculus.',
    },
  ],
  prerequisites: ['ccss.math.calc.deriv-rules'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame integration as derivative-in-reverse.',
      script: 'You know the derivative of x³ is 3x². What if I gave you 3x² and asked "what function gives THIS as a derivative?" You\'d run the rule backwards and answer x³. That backwards process — finding a function whose derivative is given — is INTEGRATION. It\'s also (somehow) the way to compute the area under a curve. Calculus\' deepest connection.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-integration',
      kind: 'concept',
      goal: 'Antiderivative + reverse power rule + Fundamental Theorem + area meaning.',
      keyIdeas: [
        'An ANTIDERIVATIVE of f(x) is any function F(x) where F\'(x) = f(x).',
        'INDEFINITE INTEGRAL: ∫f(x) dx = F(x) + C, where C is a constant of integration. (Many functions differ by a constant but have the same derivative.)',
        'REVERSE POWER RULE: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C, for n ≠ -1.',
        '  ∫x² dx = x³/3 + C. (Add 1 to the exponent, divide by the new exponent.)',
        '  ∫1 dx = x + C. ∫dx = x + C. ∫(2) dx = 2x + C.',
        'SUM RULE: ∫[f + g] dx = ∫f dx + ∫g dx. CONSTANT MULTIPLE: ∫kf dx = k∫f dx.',
        'FUNDAMENTAL THEOREM OF CALCULUS (Part 1): If F is an antiderivative of f, then ∫ₐᵇ f(x) dx = F(b) - F(a). This is a DEFINITE integral.',
        'GEOMETRIC MEANING: ∫ₐᵇ f(x) dx = the SIGNED AREA between the curve y = f(x) and the x-axis between x=a and x=b. Above the x-axis = positive area; below = negative.',
        'WHY IS THE CONSTANT NEEDED? d/dx [x³ + 5] = 3x² and d/dx [x³ - 17] = 3x². Both have the same derivative. So the antiderivative of 3x² is x³ + ANY CONSTANT — we write "+C" to capture all of them.',
      ],
      vocabulary: [
        { term: 'antiderivative', definition: 'a function whose derivative is f.' },
        { term: 'indefinite integral', definition: 'the family of antiderivatives, written ∫f dx = F + C.' },
        { term: 'definite integral', definition: '∫ₐᵇ f dx — a specific number, the signed area.' },
        { term: 'Fundamental Theorem of Calculus', definition: 'connects definite integrals to antiderivatives.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-power',
      kind: 'worked_example',
      problem: 'Compute ∫(3x² + 4x - 1) dx.',
      steps: [
        'Apply reverse power rule term-by-term:',
        '∫3x² dx = 3 · x³/3 = x³.',
        '∫4x dx = 4 · x²/2 = 2x².',
        '∫(-1) dx = -x.',
        'Add them up + constant: x³ + 2x² - x + C.',
        'CHECK: differentiate. d/dx [x³ + 2x² - x + C] = 3x² + 4x - 1. ✓',
      ],
      answer: 'x³ + 2x² - x + C',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-definite',
      kind: 'worked_example',
      problem: 'Compute ∫₀² (x² + 1) dx using the Fundamental Theorem.',
      steps: [
        'Find antiderivative: F(x) = x³/3 + x. (No need for +C in definite integrals — it cancels.)',
        'Apply FTC: F(2) - F(0).',
        'F(2) = 8/3 + 2 = 14/3.',
        'F(0) = 0.',
        '∫₀² (x² + 1) dx = 14/3 - 0 = 14/3.',
        'Geometric meaning: this is the area under y = x² + 1 from x = 0 to x = 2. Always positive here since the curve is above the x-axis.',
      ],
      answer: '14/3',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Compute ∫(6x - 5) dx.',
      expectedAnswer: '3x² - 5x + C',
      responseFormat: 'free',
      hints: [
        '∫6x dx: power rule reverse — 6 · x²/2 = 3x².',
        '∫(-5) dx: -5x.',
        'Don\'t forget +C.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forget-c',
      kind: 'misconception_check',
      question: 'Asha computes ∫4x³ dx and writes x⁴. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Forgetting the constant of integration.',
          correctsTo: 'Almost. ∫4x³ dx = x⁴ + C. Forgetting +C costs you on every indefinite integral. The constant matters because (x⁴ + 5)\' and (x⁴ - 17)\' both equal 4x³ — both are valid antiderivatives. (Definite integrals don\'t need +C since it cancels: F(b) + C - (F(a) + C) = F(b) - F(a).)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Integration = differentiation in reverse.',
        'Reverse power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C.',
        'Always +C for indefinite integrals.',
        'FTC: ∫ₐᵇ f dx = F(b) - F(a) where F is any antiderivative.',
        'Geometric meaning: signed area between curve and x-axis.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute ∫₁³ 2x dx.',
      hint: 'Antiderivative: x². F(3) - F(1) = 9 - 1 = 8.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
