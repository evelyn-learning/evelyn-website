/**
 * Algebra 1 — Radicals & Rationals: Rational Expressions & Equations.
 *
 * Fractions with polynomials in them (CCSS A-APR.D.6, A-REI.A.2). Every
 * rule from numeric fractions carries over — the new work is factoring
 * first, watching for zero denominators, and remembering that FACTORS
 * cancel while terms never do.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U9_RATIONAL_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.rational-expressions.v1',
  title: 'Rational Expressions & Equations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.rational-expressions',
      standard: 'ALG1-9.3',
      description:
        'Simplify rational expressions by factoring, state excluded values, multiply and divide rational expressions, and solve rational equations by clearing denominators while rejecting extraneous solutions (CCSS A-APR.D.6, A-REI.A.2).',
    },
  ],
  prerequisites: ['alg1.radical-equations'],
  followUps: ['alg1.one-variable-statistics'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame rational expressions as ordinary fractions whose numbers have not been decided yet — and as the payoff for a whole unit of factoring.',
      script:
        'Anything measured "per" something else — miles per gallon, cost per person, jobs per hour — is a fraction. When the amounts themselves can change, you get a fraction with variables in it: a rational expression. The good news is you already know the rules, because they are the same rules as 6/8. The new part is that you have to FACTOR before you can cancel, which is exactly what the last unit was training you for.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rational-expressions',
      kind: 'concept',
      goal: 'Factor-then-cancel simplification, excluded values, multiplying and dividing, and clearing denominators to solve — plus the errors each step invites.',
      keyIdeas: [
        'WHAT IT IS — a rational expression is a fraction whose numerator and denominator are polynomials, like (x² − 9)/(x + 4). Every rule you already trust for number fractions still applies.',
        'SIMPLIFY BY FACTORING — factor the numerator and the denominator completely, then cancel any FACTOR they both contain. Example: (x² − 9)/(x² + 7x + 12) = (x − 3)(x + 3)/[(x + 3)(x + 4)] = (x − 3)/(x + 4).',
        'FACTORS CANCEL, TERMS DO NOT — this is the one error that sinks the whole topic. In (x + 3)/3 the 3 on top is a TERM being added, not a factor, so nothing cancels: (x + 3)/3 is NOT x. Test it with x = 3: (3 + 3)/3 = 2, not 3.',
        'EXCLUDED VALUES — any x that makes an ORIGINAL denominator zero is excluded, because dividing by zero is undefined. Read them off the factored ORIGINAL denominator, before cancelling: a factor that cancels still excludes its value.',
        'MULTIPLYING — factor everything first, then cancel any factor on a top against the same factor on a bottom (across the two fractions is fine), then multiply what survives. No common denominator is needed.',
        'DIVIDING — flip the second fraction and multiply by its reciprocal, then proceed exactly as above. Never divide straight across.',
        'SOLVING RATIONAL EQUATIONS — multiply EVERY term on both sides by the LCD so the denominators disappear, then solve the ordinary equation that is left.',
        'ALWAYS CHECK — clearing denominators can hand you a candidate that was never legal. If a candidate equals an excluded value, it is EXTRANEOUS: reject it, even though the algebra was correct.',
      ],
      vocabulary: [
        { term: 'rational expression', definition: 'a ratio of two polynomials, e.g. (x + 1)/(x² − 4).' },
        { term: 'excluded value', definition: 'an x-value that makes an original denominator zero, so the expression is undefined there.' },
        { term: 'extraneous solution', definition: 'a candidate produced by correct algebra that fails in the original equation and must be thrown out.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-simplify',
      kind: 'worked_example',
      problem: 'Simplify and state the excluded values: (x² − 9)/(x² + 7x + 12)',
      steps: [
        'Factor the numerator as a difference of squares: x² − 9 = (x − 3)(x + 3).',
        'Factor the denominator: x² + 7x + 12 = (x + 3)(x + 4), since 3 · 4 = 12 and 3 + 4 = 7.',
        'Excluded values come from the ORIGINAL denominator: (x + 3)(x + 4) = 0 when x = −3 or x = −4.',
        'Cancel the shared FACTOR (x + 3): (x − 3)(x + 3)/[(x + 3)(x + 4)] = (x − 3)/(x + 4).',
        'Spot-check with x = 0: original is −9/12 = −3/4, simplified is −3/4. ✓',
      ],
      answer: '(x − 3)/(x + 4), with x ≠ −3 and x ≠ −4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-extraneous',
      kind: 'worked_example',
      problem: 'Solve: x/(x − 3) = 3/(x − 3) + 2',
      steps: [
        'List the excluded value FIRST: x − 3 = 0 at x = 3, so x = 3 can never be a solution.',
        'Multiply every term by the LCD (x − 3): x = 3 + 2(x − 3).',
        'Distribute and collect: x = 3 + 2x − 6 → x = 2x − 3 → 0 = x − 3 → x = 3.',
        'The only candidate is x = 3 — but that is the excluded value. Substituting it makes both denominators zero, so it is EXTRANEOUS.',
        'Reject it. Nothing is left, so the equation has NO solution. The algebra was fine; clearing the denominator is what invented a candidate that was never allowed.',
      ],
      answer: 'No solution (x = 3 is extraneous)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-divide',
      kind: 'try_yourself',
      problem: 'Simplify: (x² − 4)/(x + 3) ÷ (x + 2)/(x + 3)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x − 2', correct: true },
        { id: 'b', text: 'x + 2' },
        { id: 'c', text: '(x − 2)(x + 2)²/(x + 3)²' },
        { id: 'd', text: 'x² − 4' },
      ],
      expectedAnswer: 'x − 2',
      hints: [
        'Dividing by a fraction means multiplying by its reciprocal — flip the second fraction.',
        'You now have (x² − 4)/(x + 3) · (x + 3)/(x + 2). Factor x² − 4 as (x − 2)(x + 2), then cancel (x + 3) and (x + 2).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-excluded',
      kind: 'try_yourself',
      problem: 'What are the excluded values of (x + 2)/(x² − 3x − 10)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 5 and x = −2', correct: true },
        { id: 'b', text: 'x = 5 only' },
        { id: 'c', text: 'x = −5 and x = 2' },
        { id: 'd', text: 'x = −2 only' },
      ],
      expectedAnswer: 'x = 5 and x = −2',
      hints: [
        'Factor the denominator: x² − 3x − 10 = (x − 5)(x + 2). Set each factor equal to zero.',
        'The (x + 2) cancels with the numerator, but excluded values are read off the ORIGINAL denominator — a cancelled factor still excludes its value.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 1/(x − 4) + 2 = 9/(x − 4)',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'The LCD is (x − 4). Multiply every term — including the 2 — by it.',
        '1 + 2(x − 4) = 9 → 2x − 7 = 9. Then confirm your answer is not the excluded value x = 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cancel-terms',
      kind: 'misconception_check',
      question: 'A student simplifies (x + 6)/6 to x by crossing out the two 6s. What went wrong?',
      commonErrors: [
        {
          answer: 'x',
          misconception: 'Cancelling a TERM instead of a FACTOR — the 6 on top is being added to x, not multiplied by it, so it is not a shared factor.',
          correctsTo: 'Only common FACTORS cancel. (x + 6)/6 is already simplified (you may split it as x/6 + 1). Disprove the shortcut with a number: at x = 6 the original is (6 + 6)/6 = 2, but the "simplified" x would give 6. To cancel legally, the numerator must be factored, as in 6(x + 1)/6 = x + 1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Factor the top and the bottom completely before you cancel anything.',
        'Factors cancel; terms never do. (x + 6)/6 is not x.',
        'Excluded values come from the ORIGINAL denominator — including factors that later cancel.',
        'Divide by flipping the second fraction and multiplying by its reciprocal.',
        'Solve by multiplying every term by the LCD, then reject any candidate that is an excluded value.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Rational Expressions & Equations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
