/**
 * Digital SAT — Math / Algebra: Linear Equations in One Variable.
 *
 * Highest-frequency Algebra skill on the digital SAT. Focus on the
 * digital-test traps: equations with fraction coefficients, "no solution /
 * infinitely many" classification, and solving for an EXPRESSION (2x+3)
 * rather than the variable. Desmos is allowed on every math question —
 * teach when it's faster to type the equation in than to push symbols.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_LINEAR_EQUATIONS_ONE_VAR: LessonPlan = {
  id: 'evelyn.testprep.dsat.linear-equations-one-var.v1',
  title: 'Linear Equations in One Variable',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.linear-equations-one-var',
      standard: 'DSAT-1.1',
      description:
        'Solve linear equations in one variable, including fraction coefficients; classify equations with no solution or infinitely many; solve for a target expression.',
    },
  ],
  prerequisites: [],
  followUps: ['dsat.linear-functions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame this as the single most common Algebra skill on the digital SAT — free points once the three traps are known.',
      script:
        'Algebra is about 35 percent of SAT Math, and one-variable linear equations are its bread and butter. The equations themselves are easy — the SAT makes them hard with three specific traps. Learn the traps and these become the fastest points on the test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-traps',
      kind: 'concept',
      goal: 'The solve procedure plus the three SAT traps: fraction coefficients, solution-count questions, solve-for-an-expression.',
      keyIdeas: [
        'BASE PROCEDURE — distribute, collect variable terms on one side and constants on the other, divide. Every one-variable linear equation yields to this.',
        'TRAP 1 — FRACTION COEFFICIENTS. (2/3)x − 5 = 7. Clear fractions FIRST: multiply every term by the denominator. Multiplying through by 3 gives 2x − 15 = 21 → x = 18.',
        'TRAP 2 — SOLUTION COUNT. If simplifying collapses to a false statement (0 = 7), NO solution. If it collapses to a true one (0 = 0), INFINITELY MANY. The SAT asks for the value of a constant k that forces one of these — match coefficients, mismatch (or match) constants.',
        'TRAP 3 — SOLVE FOR AN EXPRESSION. "If 4x + 2 = 26, what is 4x + 8?" Do NOT solve for x. The target is the given plus 6, so the answer is 32. The SAT rewards seeing the shortcut.',
        'DESMOS CHECK — the built-in calculator is available on EVERY math question. Typing y = left side and y = right side and reading the intersection is a legitimate 15-second verification.',
      ],
      vocabulary: [
        { term: 'no solution', definition: 'simplification produces a false statement — the equation holds for no x.' },
        { term: 'infinitely many solutions', definition: 'simplification produces an identity — every x works.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fractions',
      kind: 'worked_example',
      problem: 'Solve: (3/4)x − 2 = (1/2)x + 5',
      steps: [
        'Multiply every term by 4 (the least common denominator): 3x − 8 = 2x + 20.',
        'Collect: 3x − 2x = 20 + 8 → x = 28.',
        'Check in the original: (3/4)(28) − 2 = 19 and (1/2)(28) + 5 = 19. ✓',
      ],
      answer: 'x = 28',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-solution-count',
      kind: 'worked_example',
      problem: 'For what value of k does 6x + 12 = 2(3x + k) have infinitely many solutions?',
      steps: [
        'Distribute the right side: 6x + 12 = 6x + 2k.',
        'The x-coefficients already match, so the equation is an identity exactly when the constants match: 12 = 2k.',
        'k = 6. (Any other k gives 12 = 2k false → NO solution — the SAT asks that variant too.)',
      ],
      answer: 'k = 6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-basic',
      kind: 'try_yourself',
      problem: 'Solve for x: 5(x − 3) = 2x + 9',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 2' },
        { id: 'b', text: 'x = 8', correct: true },
        { id: 'c', text: 'x = −2' },
        { id: 'd', text: 'x = 4' },
      ],
      expectedAnswer: 'x = 8',
      hints: ['Distribute the 5 first.', '5x − 15 = 2x + 9 — now collect the x terms.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-expression',
      kind: 'try_yourself',
      problem: 'If 3x − 7 = 20, what is the value of 6x − 7?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '40' },
        { id: 'b', text: '54' },
        { id: 'c', text: '47', correct: true },
        { id: 'd', text: '27' },
      ],
      expectedAnswer: '47',
      hints: [
        'You could solve for x — or notice 6x − 7 = (3x − 7) + 3x.',
        '3x = 27, so 6x = 54 and 6x − 7 = 47.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): for what value of c does 4x + c = 2(2x + 3) + 1 have infinitely many solutions?',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: ['Expand the right side: 4x + 7.', 'Identity requires the constants to match.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-negative-divide',
      kind: 'misconception_check',
      question: 'A student solves −2x = 10 and answers x = 5. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 5',
          misconception: 'Dividing by 2 instead of −2 (dropping the sign).',
          correctsTo: 'Divide both sides by −2: x = −5. The sign travels with the coefficient.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Clear fractions first by multiplying through by the LCD.',
        'False statement → no solution; identity → infinitely many. Constant-k questions hinge on matching coefficients vs constants.',
        'When asked for an expression, look for the shortcut before solving for x.',
        'Desmos is available on every question — use it to verify, not to think for you.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Linear Equations in One Variable' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
