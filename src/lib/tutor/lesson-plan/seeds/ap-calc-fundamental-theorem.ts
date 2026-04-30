/**
 * AP Calculus AB/BC — Fundamental Theorem of Calculus.
 *
 * The bridge between derivatives and integrals: the two operations
 * are inverses, and definite integrals can be evaluated via
 * antiderivatives.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_FUNDAMENTAL_THEOREM: LessonPlan = {
  id: 'evelyn.ap.calc.fundamental-theorem.v1',
  title: 'Fundamental Theorem of Calculus',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-ab',
  locale: 'en',
  los: [
    {
      id: 'apcalc.ftc.1',
      description: 'State and apply both parts of the Fundamental Theorem of Calculus.',
      standard: 'AP-CALC-FUN-5',
    },
  ],
  prerequisites: ['ccss.math.hsc.calc.derivatives', 'ccss.math.hsc.calc.integration'],
  followUps: ['apcalc.applications-integrals'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the elegance: the two big operations of calculus are mirror images.',
      script: 'You\'ve learned derivatives — slopes. And integrals — areas. They feel totally different. The Fundamental Theorem says: actually, they\'re INVERSES of each other. One undoes the other. That\'s why it\'s called fundamental.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-two-parts',
      kind: 'concept',
      goal: 'State both parts of the FTC and what each one is for.',
      keyIdeas: [
        'PART 1 (FTC1): If F(x) = ∫ from a to x of f(t) dt, then F\'(x) = f(x). Translation: differentiating an integral with the variable on top gives back the integrand.',
        'PART 2 (FTC2): ∫ from a to b of f(x) dx = F(b) − F(a), where F is ANY antiderivative of f. Translation: to evaluate a definite integral, find any antiderivative and subtract endpoint values.',
        'WHY IT MATTERS: before the FTC, computing area under a curve required Riemann sums (taking infinitely many rectangles). After the FTC, you just find an antiderivative — algebra, not limits.',
        'NOTATION: F(b) − F(a) is often written [F(x)] from a to b, with the bracket-bar.',
        'The FTC explains why we keep saying "antiderivative" — finding a function whose derivative is f IS the way to integrate.',
      ],
      vocabulary: [
        { term: 'antiderivative', definition: 'a function whose derivative is the original function.' },
        { term: 'definite integral', definition: 'an integral with limits — produces a NUMBER, not a family of functions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ftc2',
      kind: 'worked_example',
      problem: 'Evaluate ∫ from 0 to 3 of (2x) dx using FTC2.',
      steps: [
        'Find an antiderivative of 2x. Power rule in reverse: 2x → x² (since d/dx of x² = 2x).',
        'Apply FTC2: [x²] from 0 to 3 = 3² − 0² = 9 − 0 = 9.',
        'So ∫₀³ 2x dx = 9.',
        'Sanity check: the area under y = 2x from x=0 to x=3 is a triangle with base 3 and height 6. Area = (1/2)(3)(6) = 9. ✓',
      ],
      answer: '9',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-ftc1',
      kind: 'worked_example',
      problem: 'If G(x) = ∫ from 1 to x of (t² + 5) dt, find G\'(x).',
      steps: [
        'FTC1 says: differentiating an integral with x as the upper limit returns the integrand evaluated at x.',
        'The integrand is t² + 5. Replace t with x: x² + 5.',
        'So G\'(x) = x² + 5.',
        'Notice: we did NOT have to actually integrate t² + 5. The FTC1 told us the answer in one step.',
      ],
      answer: 'x² + 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate ∫ from 0 to π of sin(x) dx.',
      expectedAnswer: '2',
      responseFormat: 'numeric',
      hints: [
        'Antiderivative of sin(x) is -cos(x).',
        'Apply FTC2: [-cos(x)] from 0 to π = -cos(π) - (-cos(0)) = -(-1) - (-1) = 1 + 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-c-in-definite',
      kind: 'misconception_check',
      question: 'When using FTC2, do you need to add "+ C" to the antiderivative?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Carrying +C into definite integration.',
          correctsTo: 'No — for DEFINITE integrals, the +C cancels when you subtract F(b) − F(a). You only add +C for INDEFINITE integrals (no limits, returning a function).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'FTC1: d/dx of ∫ from a to x of f(t) dt = f(x). (Integral first, then derivative.)',
        'FTC2: ∫ from a to b of f(x) dx = F(b) − F(a). (Use any antiderivative.)',
        'Together: integrals and derivatives are inverse operations.',
        'No +C in definite integrals — it cancels.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What if the upper limit is a FUNCTION of x? Find d/dx of ∫ from 0 to x² of cos(t) dt.',
      hint: 'Apply FTC1 with the chain rule: d/dx[∫₀^u cos(t) dt] = cos(u) · du/dx, where u = x². So answer = cos(x²) · 2x.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
