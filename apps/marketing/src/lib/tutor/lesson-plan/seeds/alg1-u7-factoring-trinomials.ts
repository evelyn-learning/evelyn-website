/**
 * Algebra 1 — Polynomials & Factoring: Factoring Trinomials.
 *
 * The sum-product method for x² + bx + c (signs read straight off c and b),
 * the ac-method plus grouping for ax² + bx + c, the GCF pulled first every
 * time, and FOIL as the built-in answer check (CCSS A-SSE.B.3a). This is the
 * gate to solving quadratics by factoring later in the course.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U7_FACTORING_TRINOMIALS: LessonPlan = {
  id: 'evelyn.hs.alg1.factoring-trinomials.v1',
  title: 'Factoring Trinomials',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.factoring-trinomials',
      standard: 'ALG1-7.4',
      description:
        'Factor quadratic trinomials of the form x² + bx + c by the sum-product method and ax² + bx + c by the ac-method with grouping, pulling out the GCF first and checking every answer by FOIL (CCSS A-SSE.B.3a).',
    },
  ],
  prerequisites: ['alg1.factoring-gcf-grouping'],
  followUps: ['alg1.factoring-special-forms'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame factoring a trinomial as running FOIL backwards — the move that turns a quadratic into something you can actually solve.',
      script:
        'You already know that (x + 3)(x + 8) multiplies out to x² + 11x + 24. Factoring is that same trip in reverse: someone hands you x² + 11x + 24 and you recover the two binomials it came from. That reversal is worth learning because a factored quadratic practically solves itself — the shape of a bridge cable, the height of a thrown ball, the profit on a price change all come down to finding where a quadratic equals zero, and factoring is the fastest way there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sum-product-and-ac',
      kind: 'concept',
      goal: 'The sum-product method for x² + bx + c, sign reading from c and b, and the ac-method with grouping for a leading coefficient — with GCF first and FOIL as the check.',
      keyIdeas: [
        'UN-FOILING — a trinomial that came from two binomials can be sent back to them. Since (x + 3)(x + 8) = x² + 11x + 24, the two numbers you are hunting for are exactly the ones that MULTIPLY to the constant and ADD to the middle coefficient.',
        'STEP 0 — GCF ALWAYS FIRST: pull the greatest common factor out of all three terms before anything else. 2x² + 12x + 16 = 2(x² + 6x + 8). The trinomial left inside is smaller and easier, and the GCF stays part of the final answer.',
        'x² + bx + c — SUM-PRODUCT: find two numbers whose product is c and whose sum is b, then drop them straight into (x + __)(x + __). For x² + 9x + 20 the pair is 4 and 5, giving (x + 4)(x + 5).',
        'SIGN READING — do not guess the signs, read them. If c is POSITIVE the two numbers share a sign and that sign matches b: c = +24 with b = +11 gives 3 and 8; c = +24 with b = −11 gives −3 and −8. If c is NEGATIVE the two numbers have OPPOSITE signs, and the one that is bigger in size takes the sign of b: c = −28 with b = −3 gives −7 and +4.',
        'ax² + bx + c — AC-METHOD: multiply a·c, find two numbers with that product that add to b, split the middle term into those two pieces, then factor by grouping. For 3x² + 10x + 8: a·c = 24, the pair is 4 and 6, so 3x² + 6x + 4x + 8 → 3x(x + 2) + 4(x + 2) → (x + 2)(3x + 4).',
        'GROUPING CHECK — after the split, the two parentheses you produce MUST be identical. If they are not, either a sign is off or the two middle pieces need to be swapped; either way, stop and fix it before continuing.',
        'CHECK BY FOIL, EVERY TIME — multiply your factors back out. Landing on anything other than the original trinomial means the factoring is wrong, and you will catch it in about ten seconds.',
        'CLASSIC ERRORS — forgetting the GCF, or pulling it out and then dropping it from the final answer; guessing signs instead of reading them off c and b; and calling the job done while a factor like (2x + 4) still hides a common factor of 2 inside.',
      ],
      vocabulary: [
        { term: 'trinomial', definition: 'a polynomial with exactly three terms, such as x² + 11x + 24.' },
        { term: 'ac-method', definition: 'for ax² + bx + c, split the middle term using two numbers that multiply to a·c and add to b, then factor by grouping.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sum-product',
      kind: 'worked_example',
      problem: 'Factor x² + 11x + 24.',
      steps: [
        'GCF check first: 1, 11, and 24 share nothing but 1, so there is no GCF to pull out.',
        'Leading coefficient is 1, so use sum-product: two numbers with product 24 and sum 11. Both are positive because c = +24 and b = +11.',
        'List the pairs multiplying to 24: 1 and 24 (sum 25), 2 and 12 (sum 14), 3 and 8 (sum 11) ← that is the pair, 4 and 6 (sum 10).',
        'Drop the pair in: (x + 3)(x + 8).',
        'Check by FOIL: x² + 8x + 3x + 24 = x² + 11x + 24. ✓',
      ],
      answer: '(x + 3)(x + 8)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gcf-ac-method',
      kind: 'worked_example',
      problem: 'Factor completely: 6x² − 2x − 20',
      steps: [
        'GCF FIRST — 6, −2, and −20 all share 2: 6x² − 2x − 20 = 2(3x² − x − 10). Park that 2 outside; it belongs in the final answer.',
        'Inside, a = 3, b = −1, c = −10, so the leading coefficient is not 1 — use the ac-method: a·c = 3(−10) = −30.',
        'Need two numbers with product −30 and sum −1. The product is negative, so the signs are opposite, and the bigger-in-size number takes the sign of b (negative): −6 and 5. Check: (−6)(5) = −30 and −6 + 5 = −1. ✓',
        'Split the middle term and group: 3x² − 6x + 5x − 10 = 3x(x − 2) + 5(x − 2). The two parentheses match, which confirms the split was right.',
        'Factor out the shared (x − 2): (x − 2)(3x + 5). Now restore the GCF — leaving it behind is the classic slip: 2(x − 2)(3x + 5).',
        'Check by FOIL: (x − 2)(3x + 5) = 3x² + 5x − 6x − 10 = 3x² − x − 10, and 2(3x² − x − 10) = 6x² − 2x − 20. ✓',
      ],
      answer: '2(x − 2)(3x + 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-negative-c',
      kind: 'try_yourself',
      problem: 'Factor x² − 3x − 28.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x − 7)(x + 4)', correct: true },
        { id: 'b', text: '(x + 7)(x − 4)' },
        { id: 'c', text: '(x − 7)(x − 4)' },
        { id: 'd', text: '(x + 7)(x + 4)' },
      ],
      expectedAnswer: '(x − 7)(x + 4)',
      hints: [
        'c = −28 is negative, so the two numbers have opposite signs — and the bigger one takes the sign of b.',
        'Product −28, sum −3: try 7 and 4 with the 7 negative.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-leading-coefficient',
      kind: 'try_yourself',
      problem: 'Factor 3x² + 10x + 8.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x + 4)(x + 2)' },
        { id: 'b', text: '(x + 2)(3x + 4)', correct: true },
        { id: 'c', text: '(3x + 8)(x + 1)' },
        { id: 'd', text: '(3x + 2)(x + 4)' },
      ],
      expectedAnswer: '(x + 2)(3x + 4)',
      hints: [
        'No GCF here, and a is not 1 — use the ac-method: a·c = 3 · 8 = 24.',
        'Two numbers with product 24 and sum 10 are 4 and 6. Split: 3x² + 6x + 4x + 8, then group.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Factor 4x² + 4x − 15 completely. One factor is (2x − 3) and the other is (2x + k). Type the value of k as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'There is no GCF, so use the ac-method: a·c = 4(−15) = −60.',
        'Two numbers with product −60 and sum 4 are 10 and −6 → 4x² + 10x − 6x − 15 → 2x(2x + 5) − 3(2x + 5).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-incomplete-gcf',
      kind: 'misconception_check',
      question: 'A student factors 2x² + 12x + 16 and writes (2x + 4)(x + 4). Multiplying back out does give 2x² + 12x + 16 — so is the student finished?',
      commonErrors: [
        {
          answer: '(2x + 4)(x + 4)',
          misconception: 'Stopping the moment the product checks out, without noticing that (2x + 4) still has a common factor of 2 hiding inside it.',
          correctsTo: 'Not finished. Pull the GCF before anything else: 2x² + 12x + 16 = 2(x² + 6x + 8) = 2(x + 2)(x + 4). Same product, but now every factor is fully broken down.',
        },
        {
          answer: '(x + 2)(x + 4)',
          misconception: 'Pulling the GCF of 2 out correctly and then forgetting to write it in the final answer.',
          correctsTo: 'The 2 is part of the answer: 2(x + 2)(x + 4). Without it the expression is only x² + 6x + 8, which is half of the original.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'GCF first — and keep it in the final answer.',
        'x² + bx + c: two numbers that multiply to c and add to b.',
        'c positive → same signs, matching b; c negative → opposite signs, with the bigger number taking the sign of b.',
        'ax² + bx + c: use a·c, split the middle term, factor by grouping — the two parentheses must match.',
        'Check by FOILing back, and make sure no factor still has something left to pull out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Factoring Trinomials' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
