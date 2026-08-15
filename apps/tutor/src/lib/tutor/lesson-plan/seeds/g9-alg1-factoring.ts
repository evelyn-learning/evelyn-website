/**
 * G9 — Algebra 1: Factoring polynomials.
 *
 * The reverse of multiplying. Three core moves: GCF (greatest common
 * factor), factoring x² + bx + c (find two numbers that multiply to
 * c and add to b), and difference of squares (a² − b² = (a+b)(a−b)).
 * Foundation for solving quadratics and simplifying rational
 * expressions.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_FACTORING: LessonPlan = {
  id: 'evelyn.g9.math.algebra.factoring.v1',
  title: 'Factoring Polynomials',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'polynomials',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.sse.b.3.a',
      description: 'Factor a quadratic expression to reveal its zeros.',
      standard: 'CCSS.MATH.CONTENT.HSA.SSE.B.3.A',
    },
  ],
  prerequisites: ['ccss.math.hsa.apr.a.1'],
  followUps: ['ccss.math.hsa.rei.b.4'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reverse a multiplication the student already knows.',
      script: 'You know (x + 2)(x + 3) = x² + 5x + 6 — that\'s FOIL. Factoring is the reverse trick: someone hands you x² + 5x + 6 and you have to figure out it came from (x + 2)(x + 3). Why bother? Because once a polynomial is factored, you can SOLVE equations involving it almost for free.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-moves',
      kind: 'concept',
      goal: 'Three factoring tools: GCF, x² + bx + c via "two numbers", difference of squares.',
      keyIdeas: [
        'FACTORING = writing a polynomial as a PRODUCT of simpler polynomials.',
        'STEP 1 — ALWAYS: pull out the GCF (greatest common factor) first. Look at every term, find the biggest thing they share — coefficient AND variable — and factor it out.',
        '6x² + 9x → both share 3x. Factor: 3x(2x + 3).',
        'STEP 2 — quadratic trinomial x² + bx + c: find TWO numbers that MULTIPLY to c AND ADD to b. Those are your two factors.',
        'x² + 5x + 6: need two numbers multiplying to 6 and adding to 5. → 2 and 3. Factored: (x + 2)(x + 3).',
        'STEP 3 — difference of squares: a² − b² = (a + b)(a − b). Always works when both terms are perfect squares with a MINUS between them.',
        'x² − 25 → (x + 5)(x − 5). x² − 9 → (x + 3)(x − 3).',
        'Sum of squares (x² + 25) does NOT factor over the real numbers.',
        'Always factor COMPLETELY. After factoring once, check if any factor can be factored again.',
      ],
      vocabulary: [
        { term: 'GCF', definition: 'greatest common factor — biggest thing every term shares.' },
        { term: 'difference of squares', definition: 'a² − b² = (a + b)(a − b).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trinomial',
      kind: 'worked_example',
      problem: 'Factor x² + 7x + 12.',
      steps: [
        'GCF first: 1 (no common factor besides 1). Skip.',
        'Quadratic trinomial. Need two numbers that MULTIPLY to 12 AND ADD to 7.',
        'List pairs that multiply to 12: 1×12, 2×6, 3×4. Their sums: 13, 8, 7. ← 3 and 4 work.',
        'Factor: (x + 3)(x + 4).',
        'CHECK by FOILing: x² + 4x + 3x + 12 = x² + 7x + 12. ✓',
      ],
      answer: '(x + 3)(x + 4)',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-diff-squares',
      kind: 'worked_example',
      problem: 'Factor x² − 49.',
      steps: [
        'Recognize the form: a² − b². Both terms perfect squares (x² and 49 = 7²), MINUS between.',
        'Apply: a² − b² = (a + b)(a − b).',
        'a = x, b = 7. → (x + 7)(x − 7).',
        'CHECK: (x + 7)(x − 7) = x² − 7x + 7x − 49 = x² − 49. ✓',
      ],
      answer: '(x + 7)(x − 7)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gcf',
      kind: 'worked_example',
      problem: 'Factor 4x² − 16.',
      steps: [
        'GCF first: 4 divides both terms. Pull it out: 4(x² − 4).',
        'Inside is now x² − 4 — a difference of squares (x² and 4 = 2²).',
        'Apply: x² − 4 = (x + 2)(x − 2).',
        'Final: 4(x + 2)(x − 2).',
      ],
      answer: '4(x + 2)(x − 2)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Factor x² − 5x + 6.',
      expectedAnswer: '(x − 2)(x − 3)',
      responseFormat: 'free',
      hints: [
        'Need two numbers multiplying to 6 AND adding to -5.',
        'Both negative: (-2) × (-3) = 6, and (-2) + (-3) = -5.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-sum-squares',
      kind: 'misconception_check',
      question: 'Owen writes x² + 16 = (x + 4)(x + 4). Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating sum of squares like difference of squares; or not checking by multiplying back out.',
          correctsTo: 'Wrong. (x + 4)(x + 4) = x² + 8x + 16, not x² + 16. The middle term 8x doesn\'t exist in the original. Sum of two squares (x² + 16) does NOT factor over the real numbers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Always pull GCF first.',
        'x² + bx + c: find two numbers that multiply to c, add to b.',
        'Difference of squares: a² − b² = (a + b)(a − b).',
        'Sum of squares does NOT factor over the reals.',
        'Always check by multiplying back out.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Factor 3x² + 12x + 9 completely.',
      hint: 'GCF 3 first: 3(x² + 4x + 3). Then trinomial: numbers multiplying to 3 and adding to 4 → 1 and 3. Final: 3(x + 1)(x + 3).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
