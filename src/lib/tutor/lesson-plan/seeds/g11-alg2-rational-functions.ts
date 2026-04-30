/**
 * G11 — Algebra 2: Rational expressions and functions.
 *
 * Fractions where the numerator and denominator are polynomials.
 * Simplifying (factor and cancel), multiplying / dividing, and the
 * graphical features that don't exist for polynomials: VERTICAL
 * ASYMPTOTES (where the denominator = 0) and HOLES (when a factor
 * cancels).
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_RATIONAL_FUNCTIONS: LessonPlan = {
  id: 'evelyn.g11.math.algebra2.rational-functions.v1',
  title: 'Rational Expressions and Functions',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'rational-functions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.apr.d.6',
      description: 'Rewrite simple rational expressions in different forms.',
      standard: 'CCSS.MATH.CONTENT.HSA.APR.D.6',
    },
  ],
  prerequisites: ['ccss.math.hsa.sse.b.3.a'],
  followUps: ['ccss.math.hsa.rei.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect "polynomial fractions" to ordinary number fractions.',
      script: 'You know how 6/9 simplifies to 2/3 because both share a 3? Same idea works with polynomials: (x² - 1)/(x - 1) simplifies — but with one important catch. The original and the simplified form aren\'t QUITE the same function, because the denominator can\'t be zero. We\'ll see exactly where it matters.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-simplify-and-domain',
      kind: 'concept',
      goal: 'Factor → cancel; track domain restrictions; vertical asymptote vs hole.',
      keyIdeas: [
        'A RATIONAL EXPRESSION is a polynomial divided by a polynomial: P(x)/Q(x).',
        'A RATIONAL FUNCTION is f(x) = P(x)/Q(x).',
        'To SIMPLIFY: factor numerator and denominator, then cancel COMMON factors.',
        'Example: (x² - 4)/(x² + x - 2) = ((x+2)(x-2))/((x+2)(x-1)) = (x-2)/(x-1).',
        'DOMAIN: rational functions are undefined wherever the original DENOMINATOR is zero. ALWAYS list those x-values BEFORE you cancel — they remain restrictions even after simplification.',
        'After simplifying, denominator = 0 still gives a feature in the graph:',
        '  VERTICAL ASYMPTOTE: zero in the denominator that DID NOT cancel. The graph shoots to ±∞.',
        '  HOLE: zero in the denominator that WAS cancelled. Single missing point.',
        'TO MULTIPLY rational expressions: multiply numerators, multiply denominators, then simplify.',
        'TO DIVIDE: multiply by the reciprocal of the divisor.',
      ],
      vocabulary: [
        { term: 'rational function', definition: 'a ratio of two polynomials.' },
        { term: 'vertical asymptote', definition: 'an x-value where the function blows up to ±∞.' },
        { term: 'hole', definition: 'a single missing point in the graph from a cancelled factor.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-simplify',
      kind: 'worked_example',
      problem: 'Simplify (x² - 9) / (x² - x - 6) and identify the domain.',
      steps: [
        'Factor numerator: x² - 9 = (x + 3)(x - 3) (difference of squares).',
        'Factor denominator: x² - x - 6 = (x - 3)(x + 2).',
        'BEFORE cancelling, note the domain restrictions: denominator zero at x = 3 and x = -2.',
        'Cancel the (x - 3): result is (x + 3)/(x + 2).',
        'The cancelled x = 3 becomes a HOLE. The remaining x = -2 is a VERTICAL ASYMPTOTE.',
        'Domain: x ≠ 3 AND x ≠ -2 (still restricted from the original).',
      ],
      answer: '(x + 3)/(x + 2); hole at x = 3; VA at x = -2',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-multiply',
      kind: 'worked_example',
      problem: 'Multiply (x + 2)/(x - 1) · (x² - 1)/(x + 2).',
      steps: [
        'Factor x² - 1 = (x + 1)(x - 1).',
        'Set up the product: ((x+2)(x+1)(x-1)) / ((x-1)(x+2)).',
        'Cancel (x + 2) and (x - 1) from top and bottom.',
        'Result: x + 1.',
        'Domain restrictions: x ≠ 1 (original denominator) and x ≠ -2 (other original denominator).',
      ],
      answer: 'x + 1, with x ≠ 1 and x ≠ -2',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify (x² - 4) / (x + 2).',
      expectedAnswer: 'x - 2 (with x ≠ -2)',
      responseFormat: 'free',
      hints: [
        'Factor numerator: x² - 4 = (x + 2)(x - 2).',
        'Cancel (x + 2). Don\'t forget to note the original restriction.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cancel-terms',
      kind: 'misconception_check',
      question: 'Asha simplifies (x + 2)/(x + 5) by cancelling the x and gets 2/5. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Cancelling individual TERMS instead of FACTORS.',
          correctsTo: 'Wrong. You can only cancel FACTORS (things multiplied), not TERMS (things added/subtracted). (x + 2) is one term — x is added, not multiplied. Sense-check at x = 1: original is 3/6 = 0.5; her "simplified" 2/5 = 0.4. Different — confirms wrong.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rational expression = polynomial / polynomial.',
        'Simplify: factor everything, cancel COMMON FACTORS only.',
        'Cancel factors, NOT terms. (x + 2)/(x + 5) does not simplify.',
        'Track domain BEFORE cancelling — restrictions persist.',
        'Cancelled factor → hole. Uncancelled denominator zero → vertical asymptote.',
        'Divide rationals: multiply by the reciprocal.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the vertical asymptote(s) and hole(s) of f(x) = (x² - 4)/(x² - 2x).',
      hint: 'Factor: (x+2)(x-2) / x(x-2). Cancel (x-2) → (x+2)/x. Hole at x = 2 (cancelled). VA at x = 0 (uncancelled).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
