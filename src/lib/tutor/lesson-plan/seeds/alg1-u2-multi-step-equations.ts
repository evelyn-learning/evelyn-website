/**
 * Algebra 1 — Linear Equations: Multi-Step Equations with Variables on
 * Both Sides.
 *
 * The workhorse skill of Algebra 1 (CCSS A-REI.B.3): distribute, collect,
 * solve — plus the classify-the-weird-cases endgame (no solution vs
 * identity). Everything from Unit 3 onward leans on this being automatic.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U2_MULTI_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.multi-step-equations.v1',
  title: 'Multi-Step Equations with Variables on Both Sides',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.multi-step-equations',
      standard: 'ALG1-2.2',
      description:
        'Solve multi-step linear equations with variables on both sides, including distribution and fraction clearing, and classify equations with no solution or infinitely many (CCSS A-REI.B.3, A-REI.A.1).',
    },
  ],
  prerequisites: ['alg1.one-two-step-equations'],
  followUps: ['alg1.literal-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame multi-step equations as the one skill the rest of Algebra 1 quietly reuses every single day.',
      script:
        'Every chapter after this one — inequalities, systems, quadratics — secretly ends with the same move: solving a linear equation. Master the routine today and the rest of the course gets easier. The routine is short: clear, distribute, collect, divide. Let us make it automatic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-routine',
      kind: 'concept',
      goal: 'The four-step solve routine, plus the two special endings: no solution and infinitely many.',
      keyIdeas: [
        'THE ROUTINE — 1) clear fractions (multiply every term by the LCD), 2) distribute to remove parentheses, 3) collect variable terms on one side and constants on the other, 4) divide by the coefficient.',
        'VARIABLES ON BOTH SIDES — move the smaller variable term across to keep the coefficient positive: for 7x − 4 = 3x + 16, subtract 3x from both sides to get 4x − 4 = 16.',
        'EVERY MOVE IS LEGAL because you do the same thing to both sides — the equation stays balanced. That is why you can check any answer by substituting it back.',
        'ENDING 1 — NO SOLUTION: if the variables cancel and you are left with a false statement like 0 = 7, no value of x works.',
        'ENDING 2 — IDENTITY: if the variables cancel into a true statement like 5 = 5, every value of x works — infinitely many solutions.',
        'SIGN DISCIPLINE — the two most common errors are dropping a negative while distributing, e.g. −2(x − 3) = −2x + 6 not −2x − 6, and dividing by a negative without flipping the sign of the answer.',
      ],
      vocabulary: [
        { term: 'like terms', definition: 'terms with the same variable part — only these can be combined.' },
        { term: 'identity', definition: 'an equation true for every value of the variable.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-both-sides',
      kind: 'worked_example',
      problem: 'Solve: 5(x − 3) = 2x + 9',
      steps: [
        'Distribute the 5: 5x − 15 = 2x + 9.',
        'Subtract 2x from both sides: 3x − 15 = 9.',
        'Add 15 to both sides: 3x = 24.',
        'Divide by 3: x = 8. Check: 5(8 − 3) = 25 and 2(8) + 9 = 25. ✓',
      ],
      answer: 'x = 8',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fractions-identity',
      kind: 'worked_example',
      problem: 'Solve: (1/2)(6x + 8) = 3x + 4',
      steps: [
        'Distribute the 1/2: 3x + 4 = 3x + 4.',
        'Subtract 3x from both sides: 4 = 4 — the variable is gone and the statement is TRUE.',
        'A true statement with no variable left means every x works: infinitely many solutions (an identity).',
        'Contrast: if the constants had disagreed (like 4 = 7), the answer would be NO solution.',
      ],
      answer: 'Infinitely many solutions (identity)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-both-sides',
      kind: 'try_yourself',
      problem: 'Solve for x: 4x + 7 = 9x − 13',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 4', correct: true },
        { id: 'b', text: 'x = −4' },
        { id: 'c', text: 'x = 6/5' },
        { id: 'd', text: 'x = 20' },
      ],
      expectedAnswer: 'x = 4',
      hints: ['Move the smaller variable term: subtract 4x from both sides.', '7 = 5x − 13 — now add 13 and divide by 5.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem: 'How many solutions does 3(2x − 4) = 6x − 12 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly one' },
        { id: 'b', text: 'None' },
        { id: 'c', text: 'Infinitely many', correct: true },
        { id: 'd', text: 'Exactly two' },
      ],
      expectedAnswer: 'Infinitely many',
      hints: ['Distribute the left side first.', '6x − 12 = 6x − 12 is true for every x.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve for x and type your answer as a number: 2(x + 5) − 3 = 4x − 11',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: ['Simplify the left side to 2x + 7 first.', '2x + 7 = 4x − 11 → 18 = 2x.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-distribute-negative',
      kind: 'misconception_check',
      question: 'A student simplifies 10 − 2(x − 3) as 8(x − 3) and gets a wrong answer. What went wrong?',
      commonErrors: [
        {
          answer: '8(x − 3)',
          misconception: 'Subtracting 10 − 2 first, ignoring that the 2 is glued to the parentheses by multiplication.',
          correctsTo: 'Distribute first: 10 − 2(x − 3) = 10 − 2x + 6 = 16 − 2x. Order of operations puts multiplication before subtraction.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The routine: clear fractions, distribute, collect, divide.',
        'Move the smaller variable term to keep coefficients positive.',
        'Variables cancel into a FALSE statement → no solution; into a TRUE statement → infinitely many.',
        'Distribute negatives carefully: −2(x − 3) = −2x + 6.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Multi-Step Equations with Variables on Both Sides' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
