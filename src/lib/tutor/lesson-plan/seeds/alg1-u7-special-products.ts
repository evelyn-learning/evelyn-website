/**
 * Algebra 1 — Polynomials: Special Products.
 *
 * Three patterns worth memorizing (CCSS A-APR.A.1, A-SSE.A.2): the square
 * of a sum, the square of a difference, and the difference of squares.
 * They are just FOIL with the work already done — and they run backwards
 * as the factoring patterns of the next unit. The unit's central trap is
 * (a + b)² = a² + b²: the missing middle term.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U7_SPECIAL_PRODUCTS: LessonPlan = {
  id: 'evelyn.hs.alg1.special-products.v1',
  title: 'Special Products',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.special-products',
      standard: 'ALG1-7.2',
      description:
        'Expand and recognize the special products (a + b)², (a − b)², and (a + b)(a − b), and use the patterns to multiply numbers mentally (CCSS A-APR.A.1, A-SSE.A.2).',
    },
  ],
  prerequisites: ['alg1.polynomial-operations'],
  followUps: ['alg1.factoring-gcf-grouping'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the three patterns as shortcuts that also run backwards into factoring — and show one as a mental-math trick.',
      script:
        'Quick — what is 21 times 19? Most people reach for a pencil. But 21 times 19 is (20 + 1)(20 − 1), and that always collapses to 20² − 1, which is 399. That is one of three products that show up so often they are worth memorizing. Learn them forwards today and you get the next unit — factoring — half done, because factoring is these same three patterns read right to left.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-patterns',
      kind: 'concept',
      goal: 'The three special-product patterns, why the middle term exists, and the errors that kill it.',
      keyIdeas: [
        'SQUARE OF A SUM — (a + b)² = a² + 2ab + b². Squaring means (a + b)(a + b), so FOIL gives a² + ab + ba + b², and the two identical middle terms add to 2ab.',
        'SQUARE OF A DIFFERENCE — (a − b)² = a² − 2ab + b². Same pattern, middle term negative, LAST term still POSITIVE because (−b)(−b) = +b².',
        'DIFFERENCE OF SQUARES — (a + b)(a − b) = a² − b². Here the middle terms are +ab and −ab, so they cancel and no middle term survives.',
        'THE CENTRAL ERROR — (a + b)² is NOT a² + b². Exponents do not distribute over addition. Test it with numbers: (3 + 4)² = 49, but 3² + 4² = 25. The missing 2ab = 24 is the whole gap.',
        'SQUARE THE WHOLE TERM — in (5x)² both parts get squared: 25x², not 5x². The coefficient is inside the square too.',
        'READ THE SHAPE FIRST — same two terms with the SAME sign twice → square pattern (middle term present). Same two terms with OPPOSITE signs → difference of squares (no middle term).',
        'MENTAL MATH — any product of two numbers equally far from a round number is a difference of squares: 21·19 = 20² − 1² = 399, and 53·47 = 50² − 3² = 2491.',
        'THE PATTERNS ARE OPTIONAL, NOT MAGIC — you can always FOIL instead and get the same answer. Use FOIL as your check whenever the pattern feels shaky.',
      ],
      vocabulary: [
        { term: 'special product', definition: 'a multiplication pattern common enough to memorize rather than re-derive.' },
        { term: 'difference of squares', definition: 'a² − b², the product of a sum and the matching difference.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-square-sum',
      kind: 'worked_example',
      problem: 'Expand: (3x + 5)²',
      steps: [
        'Match the pattern (a + b)² = a² + 2ab + b², with a = 3x and b = 5.',
        'Square the first term: a² = (3x)² = 9x². Square the coefficient too — not 3x².',
        'Double the product of the terms: 2ab = 2 · 3x · 5 = 30x.',
        'Square the last term: b² = 5² = 25.',
        'Assemble: 9x² + 30x + 25. Check by FOIL: (3x + 5)(3x + 5) = 9x² + 15x + 15x + 25 = 9x² + 30x + 25. ✓',
      ],
      answer: '9x² + 30x + 25',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-square-difference-trap',
      kind: 'worked_example',
      problem: 'Expand: (4x − 7)² — and test the tempting answer 16x² + 49 first.',
      steps: [
        'The tempting answer squares each term separately: 16x² + 49. Test it at x = 1: the original is (4 − 7)² = (−3)² = 9, but 16 + 49 = 65. Not equal, so that answer is wrong.',
        'Use the real pattern (a − b)² = a² − 2ab + b², with a = 4x and b = 7.',
        'a² = (4x)² = 16x². The middle term is −2ab = −2 · 4x · 7 = −56x. b² = (−7)(−7) = +49 — the last term stays positive.',
        'Assemble: 16x² − 56x + 49. Test at x = 1: 16 − 56 + 49 = 9, matching the original. ✓',
        'The whole difference between the wrong answer and the right one is that −56x middle term.',
      ],
      answer: '16x² − 56x + 49',
      estimatedMinutes: 3,
    },
    {
      id: 'try-square-sum',
      kind: 'try_yourself',
      problem: 'Expand: (2x + 9)²',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x² + 36x + 81', correct: true },
        { id: 'b', text: '4x² + 81' },
        { id: 'c', text: '4x² + 18x + 81' },
        { id: 'd', text: '2x² + 36x + 81' },
      ],
      expectedAnswer: '4x² + 36x + 81',
      hints: [
        'Use (a + b)² = a² + 2ab + b² with a = 2x and b = 9 — and remember the coefficient gets squared.',
        'The middle term is DOUBLE the product: 2 · 2x · 9, not just 2x · 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-difference-of-squares',
      kind: 'try_yourself',
      problem: 'Multiply: (5x − 4)(5x + 4)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '25x² − 16', correct: true },
        { id: 'b', text: '25x² + 16' },
        { id: 'c', text: '25x² − 40x + 16' },
        { id: 'd', text: '5x² − 16' },
      ],
      expectedAnswer: '25x² − 16',
      hints: [
        'Same two terms, opposite signs — that is the difference-of-squares shape.',
        'FOIL if you want proof: 25x² + 20x − 20x − 16, and the middle terms cancel.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Use the difference-of-squares pattern to compute 43 × 37 without long multiplication. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1591',
      hints: [
        'Both numbers sit 3 away from 40, so write them as (40 + 3)(40 − 3).',
        'That equals 40² − 3² = 1600 − 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-square-distributes',
      kind: 'misconception_check',
      question: 'Marcos writes (x + 6)² = x² + 36. Is he right?',
      commonErrors: [
        {
          answer: 'x² + 36',
          misconception: 'Treating the exponent as if it distributes over addition, the way it does over a product like (xy)² = x²y².',
          correctsTo:
            'Wrong — the 12x is missing. (x + 6)² means (x + 6)(x + 6) = x² + 6x + 6x + 36 = x² + 12x + 36. Test at x = 1: the original is 7² = 49, and x² + 12x + 36 gives 1 + 12 + 36 = 49, while x² + 36 gives only 37.',
        },
        {
          answer: 'x² − 36',
          misconception: 'Confusing the square of a sum with the difference-of-squares pattern, which needs OPPOSITE signs.',
          correctsTo:
            'a² − b² comes from (a + b)(a − b), where the middle terms cancel. Here both factors are (x + 6), so nothing cancels and the middle term survives: x² + 12x + 36.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '(a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b² — the last term is positive either way.',
        '(a + b)(a − b) = a² − b² — opposite signs make the middle terms cancel.',
        'Never write (a + b)² = a² + b². The 2ab middle term is the whole point.',
        'Square the entire term, coefficient included: (5x)² = 25x².',
        'Numbers work too: 21·19 = 20² − 1² = 399.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Special Products' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
