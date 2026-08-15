/**
 * Algebra 1 — Linear Equations: One- & Two-Step Equations.
 *
 * The entry point to every solve in the course (CCSS A-REI.B.3): inverse
 * operations, unwinding in reverse order, and the two places students lose
 * points — negative coefficients and fraction forms like x/4 − 3 = 2.
 * Checking by substitution is taught as part of the solve, not an extra.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U2_ONE_TWO_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.one-two-step-equations.v1',
  title: 'One- & Two-Step Equations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.one-two-step-equations',
      standard: 'ALG1-2.1',
      description:
        'Solve one- and two-step linear equations with inverse operations, including negative coefficients and fractional forms, and verify each solution by substitution (CCSS A-REI.B.3, A-REI.A.1).',
    },
  ],
  prerequisites: ['alg1.translating-words-to-algebra'],
  followUps: ['alg1.multi-step-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame solving as undoing — a move students already make mentally — and as the foundation the whole course is built on.',
      script:
        'You already do this in your head: a shirt costs 12 dollars, you hand over 20, and you know the change without writing anything down. You undid the subtraction. Algebra just gives that instinct a procedure that keeps working when the numbers get ugly — negatives, fractions, two steps at once. Everything later in this course, inequalities, graphs, systems, quadratics, ends with a solve like today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inverse-operations',
      kind: 'concept',
      goal: 'Inverse operations, unwinding in reverse order, and the two trouble spots: negative coefficients and fraction forms.',
      keyIdeas: [
        'INVERSE OPERATIONS — addition and subtraction undo each other; multiplication and division undo each other. Solving means peeling operations off x one at a time with their inverses until x stands alone.',
        'ONE STEP FIRST — x + 7 = 12 needs one inverse (subtract 7 → x = 5); 5x = 45 needs one inverse (divide by 5 → x = 9). A two-step equation is just two of these in a row.',
        'UNDO IN REVERSE ORDER — order of operations built the expression, so unwind it backwards: undo addition and subtraction FIRST, multiplication and division LAST. For 3x + 8 = 26, subtract 8 before dividing by 3, never the other way around.',
        'BALANCE — whatever you do to one side you do to the other, and to EVERY term on that side. That is the only rule that makes any of these moves legal.',
        'NEGATIVE COEFFICIENTS — −4x = 20 means divide both sides by −4, so x = −5. The sign travels with the coefficient. And −x is really −1x, so it still needs dividing by −1.',
        'FRACTION FORM — x/4 means (1/4)x, so its inverse is multiplying by 4. You may clear the fraction first, but then you must multiply EVERY term by 4, including the constants.',
        'CHECK BY SUBSTITUTION — put your answer back into the ORIGINAL equation and evaluate both sides. If they match, you are done; if they do not, you caught your own mistake for free.',
      ],
      vocabulary: [
        { term: 'inverse operation', definition: 'the operation that undoes another — subtraction undoes addition, division undoes multiplication.' },
        { term: 'coefficient', definition: 'the number multiplying the variable, sign included: in −4x the coefficient is −4.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-step',
      kind: 'worked_example',
      problem: 'Solve: 5x − 8 = 27',
      steps: [
        'Two operations are wrapped around x: times 5, then minus 8. Undo them in reverse order.',
        'Undo the subtraction first — add 8 to both sides: 5x = 35.',
        'Undo the multiplication — divide both sides by 5: x = 7.',
        'Check in the original: 5(7) − 8 = 35 − 8 = 27. ✓',
      ],
      answer: 'x = 7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fraction-form',
      kind: 'worked_example',
      problem: 'Solve: x/4 − 3 = 2',
      steps: [
        'THE TEMPTING WRONG MOVE — multiply by 4 right away and write x − 3 = 8, which gives x = 11. Substituting back: 11/4 − 3 = 2.75 − 3 = −0.25, not 2. The 4 was only applied to some of the terms, so the equation stopped being balanced.',
        'ROUTE 1, undo in reverse order: add 3 to both sides → x/4 = 5, then multiply both sides by 4 → x = 20.',
        'ROUTE 2, clear the fraction but multiply EVERY term by 4: x − 12 = 8, then add 12 → x = 20. Same answer, which is the point.',
        'Check in the original: 20/4 − 3 = 5 − 3 = 2. ✓',
      ],
      answer: 'x = 20',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-step',
      kind: 'try_yourself',
      problem: 'Solve for x: 2x + 6 = 22',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 8', correct: true },
        { id: 'b', text: 'x = 5' },
        { id: 'c', text: 'x = 14' },
        { id: 'd', text: 'x = 11' },
      ],
      expectedAnswer: 'x = 8',
      hints: [
        'Undo the +6 before you touch the 2.',
        '2x = 16 — now divide both sides by 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-negative-coefficient',
      kind: 'try_yourself',
      problem: 'Solve for x: 10 − 3x = 25',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 5' },
        { id: 'b', text: 'x = −5', correct: true },
        { id: 'c', text: 'x = 15' },
        { id: 'd', text: 'x = −45' },
      ],
      expectedAnswer: 'x = −5',
      hints: [
        'Subtract 10 from both sides first — the coefficient of x is −3, not 3.',
        '−3x = 15, so divide both sides by −3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 3 − x/4 = 1',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Subtract 3 from both sides to isolate the x term.',
        '−x/4 = −2 — now multiply both sides by −4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-invisible-coefficient',
      kind: 'misconception_check',
      question: 'A student solves −x + 6 = 10, gets to −x = 4, and answers x = 4. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 4',
          misconception: 'Reading −x as if it were x, so the last division is skipped entirely. The minus sign is treated as decoration rather than a coefficient of −1.',
          correctsTo: '−x is −1x, so divide both sides by −1: x = −4. Check: −(−4) + 6 = 4 + 6 = 10. ✓',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solving is undoing: subtraction undoes addition, division undoes multiplication.',
        'Unwind in reverse order — addition and subtraction first, multiplication and division last.',
        'The sign belongs to the coefficient: −3x = 15 gives x = −5, and −x means −1x.',
        'Clearing a fraction means multiplying EVERY term, not just the one with the variable.',
        'Always substitute your answer back into the original equation — both sides must match.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'One- & Two-Step Equations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
