/**
 * Algebra 1 — Polynomials & Factoring: Factoring Special Forms.
 *
 * The two patterns worth memorizing (CCSS A-SSE.A.2, A-SSE.B.3a):
 * difference of squares a² − b² = (a + b)(a − b) and the perfect-square
 * trinomial a² ± 2ab + b² = (a ± b)² — plus the coefficient cases like
 * 9x² − 25, the GCF-first habit, and why a sum of squares is prime.
 * Recognizing these on sight is what makes quadratic graphing and
 * solving fast instead of grindy.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U7_FACTORING_SPECIAL_FORMS: LessonPlan = {
  id: 'evelyn.hs.alg1.factoring-special-forms.v1',
  title: 'Factoring Special Forms',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.factoring-special-forms',
      standard: 'ALG1-7.5',
      description:
        'Factor the special forms — difference of squares and perfect-square trinomials — including cases with coefficients and a common factor pulled out first, and recognize that a sum of squares does not factor over the reals (CCSS A-SSE.A.2, A-SSE.B.3a).',
    },
  ],
  prerequisites: ['alg1.factoring-trinomials'],
  followUps: ['alg1.quadratic-graphs-vertex'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the special forms are pattern recognition, not work — a shortcut you can even use for mental arithmetic.',
      script:
        'Quick: what is 43 times 37? Most people reach for a calculator. But 43 × 37 is (40 + 3)(40 − 3), and that pattern always collapses to 40² − 3² = 1600 − 9 = 1591. That is the difference of squares, and it works on expressions too. Today you learn two patterns you will recognize on sight for the rest of this course — they turn a minute of factoring into about three seconds.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-special-forms',
      kind: 'concept',
      goal: 'The two special forms, the coefficient cases, the sum-of-squares exception, and the strategy order that decides which tool to reach for.',
      keyIdeas: [
        'STRATEGY ORDER — 1) pull out the GCF, always, 2) count the terms: TWO terms means look for a difference of squares, THREE terms means check for a perfect-square trinomial first and a general trinomial second, 3) keep factoring until nothing inside factors any further.',
        'DIFFERENCE OF SQUARES — a² − b² = (a + b)(a − b). It works because the middle terms cancel when you multiply back: (a + b)(a − b) = a² − ab + ab − b² = a² − b².',
        'COEFFICIENTS ARE PART OF THE SQUARE — 9x² − 25 is a difference of squares because 9x² = (3x)² and 25 = 5², so a = 3x and b = 5, giving (3x + 5)(3x − 5). Take the square root of the number AND the variable, not just the variable.',
        'PERFECT-SQUARE TRINOMIAL — a² + 2ab + b² = (a + b)² and a² − 2ab + b² = (a − b)². The test has two parts: the first and last terms are perfect squares, AND the middle term is exactly 2 × a × b. Example: 4x² − 12x + 9 = (2x − 3)² because 2 × 2x × 3 = 12x.',
        'THE SIGN LIVES IN THE MIDDLE TERM — the last term of a perfect-square trinomial is always positive (it is b²); the middle term is what tells you whether the binomial is (a + b) or (a − b).',
        'A SUM OF SQUARES DOES NOT FACTOR — a² + b² is prime over the real numbers. Test it yourself: (a + b)² = a² + 2ab + b², which carries an extra 2ab term that a² + b² simply does not have.',
        'GCF FIRST OR YOU WILL MISS THE PATTERN — 8x² − 50 looks unfactorable because 8 and 50 are not perfect squares, but pulling out the 2 gives 2(4x² − 25) = 2(2x + 5)(2x − 5).',
        'CHECK BY MULTIPLYING BACK — every factoring answer is verifiable in ten seconds by expanding it. If the product is not the original expression, the factoring is wrong.',
      ],
      vocabulary: [
        { term: 'difference of squares', definition: 'a two-term expression a² − b² — always factors as (a + b)(a − b).' },
        { term: 'perfect-square trinomial', definition: 'a trinomial that is the square of a binomial, a² ± 2ab + b² = (a ± b)².' },
        { term: 'prime polynomial', definition: 'a polynomial that cannot be factored further over the real numbers, like x² + 36.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-difference-of-squares',
      kind: 'worked_example',
      problem: 'Factor 9x² − 25.',
      steps: [
        'GCF first: 9 and 25 share nothing but 1, so there is no GCF to pull out.',
        'Two terms with a minus between them — check the difference-of-squares pattern.',
        'Is each term a perfect square? 9x² = (3x)² and 25 = 5². Yes, so a = 3x and b = 5.',
        'Apply a² − b² = (a + b)(a − b): (3x + 5)(3x − 5).',
        'CHECK by expanding: 9x² − 15x + 15x − 25 = 9x² − 25. ✓',
      ],
      answer: '(3x + 5)(3x − 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gcf-then-special-form',
      kind: 'worked_example',
      problem: 'Factor 8x² − 50 completely.',
      steps: [
        'Tempting wrong move: 8 is not a perfect square and 50 is not a perfect square, so a student who skips the GCF step declares this prime. It is not.',
        'GCF first: 8 and 50 both divide by 2. Pull it out: 2(4x² − 25).',
        'Now look inside. 4x² = (2x)² and 25 = 5², with a minus between them — a difference of squares with a = 2x and b = 5.',
        'Factor the inside and keep the GCF out front: 2(2x + 5)(2x − 5).',
        'CHECK: (2x + 5)(2x − 5) = 4x² − 25, and 2(4x² − 25) = 8x² − 50. ✓',
      ],
      answer: '2(2x + 5)(2x − 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-perfect-square',
      kind: 'try_yourself',
      problem: 'Factor completely: 4x² − 20x + 25',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(2x − 5)²', correct: true },
        { id: 'b', text: '(2x + 5)²' },
        { id: 'c', text: '(2x + 5)(2x − 5)' },
        { id: 'd', text: '(4x − 5)(x − 5)' },
      ],
      expectedAnswer: '(2x − 5)²',
      hints: [
        'The first and last terms are perfect squares: 4x² = (2x)² and 25 = 5², so a = 2x and b = 5.',
        'Confirm the middle term: 2 × 2x × 5 = 20x, and it appears with a minus sign — so the form is (a − b)².',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sum-of-squares',
      kind: 'try_yourself',
      problem: 'Which of these expressions CANNOT be factored over the real numbers?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x² − 36' },
        { id: 'b', text: 'x² + 36', correct: true },
        { id: 'c', text: 'x² − 12x + 36' },
        { id: 'd', text: '9x² − 1' },
      ],
      expectedAnswer: 'x² + 36',
      hints: [
        'Three of these are either a difference of squares or a perfect-square trinomial. Sort them into those two buckets.',
        'x² − 36 = (x + 6)(x − 6), x² − 12x + 36 = (x − 6)², and 9x² − 1 = (3x + 1)(3x − 1). What is left is a SUM of two squares.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-middle-term',
      kind: 'try_yourself',
      problem: 'The trinomial 9x² + kx + 49 is a perfect square that factors as (3x + 7)². Find k and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '42',
      hints: ['In a² + 2ab + b², the middle term is exactly 2 × a × b.', 'Here a = 3x and b = 7, so the middle term is 2 × 3x × 7 = 42x.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mixing-special-forms',
      kind: 'misconception_check',
      question: 'A student factors 9x² − 16 as (3x − 4)². Is that right?',
      commonErrors: [
        {
          answer: '(3x − 4)²',
          misconception: 'Mixing the two special forms — treating a two-term difference of squares as if it were a perfect-square trinomial.',
          correctsTo:
            'Expand the claim: (3x − 4)² = 9x² − 24x + 16, which has a −24x term the original does not have. Two terms with a minus means difference of squares, so it factors into a sum times a difference: 9x² − 16 = (3x + 4)(3x − 4).',
        },
        {
          answer: '(x + 4)(x − 4)',
          misconception: 'Taking the square root of 16 but forgetting that the coefficient 9 has to be square-rooted too.',
          correctsTo: 'a is the square root of the WHOLE first term: √(9x²) = 3x, not x. So the answer is (3x + 4)(3x − 4), which expands back to 9x² − 16. ✓',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Order: GCF first, then count terms — two terms means difference of squares, three terms means check for a perfect square — then factor again until nothing factors.',
        'Difference of squares: a² − b² = (a + b)(a − b), and the coefficient gets square-rooted too: 9x² − 25 = (3x + 5)(3x − 5).',
        'Perfect-square trinomial: a² ± 2ab + b² = (a ± b)², and the middle term must be exactly 2ab.',
        'A sum of squares, a² + b², is prime over the real numbers — it does NOT factor.',
        'Every answer is checkable: multiply back out and compare to the original.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.5', cedTitle: 'Factoring Special Forms' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
