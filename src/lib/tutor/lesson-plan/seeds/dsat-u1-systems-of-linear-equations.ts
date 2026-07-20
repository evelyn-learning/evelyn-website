/**
 * Digital SAT — Math / Algebra: Systems of Two Linear Equations.
 *
 * Recurring Algebra skill on the digital SAT (several questions per test,
 * word-problem-modeled). Focus on the digital-test traps: needing to SCALE
 * before eliminating, classifying no-solution / infinitely-many from
 * coefficient ratios, "k in a coefficient" questions, and spotting when a
 * question wants a combination (x + y) rather than each variable. Desmos is
 * allowed on every math question — graphing both lines and reading the
 * intersection is a legitimate solve/verify strategy for systems.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U1_SYSTEMS_OF_LINEAR_EQUATIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.systems-of-linear-equations.v1',
  title: 'Systems of Two Linear Equations',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.systems-of-linear-equations',
      standard: 'DSAT-1.4',
      description:
        'Solve systems of two linear equations using substitution and elimination (including scaling before eliminating), classify no-solution / infinitely-many-solutions cases from coefficient ratios, and recognize when a question asks for a combination of the variables rather than each one individually.',
    },
  ],
  prerequisites: ['dsat.linear-equations-one-var'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame systems of two linear equations as a recurring, high-value Algebra pattern on the digital SAT — mostly word-problem-modeled.',
      script:
        'Systems of two linear equations show up several times on every SAT Math test, inside the Algebra domain that makes up roughly a third of the section. Most are dressed up as word problems — cost, mixture, rate — but underneath they are always the same two moves: substitution and elimination. Learn when to use each, plus the classification and shortcut traps, and these become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-systems',
      kind: 'concept',
      goal: 'Substitution vs elimination, scaling before eliminating, solution-count classification, k-in-a-coefficient traps, and the combination-shortcut trap.',
      keyIdeas: [
        'BASE PROCEDURE — SUBSTITUTION. Solve one equation for one variable, plug it into the other equation, solve the resulting one-variable equation, then back-substitute. Best when a variable is already isolated (e.g., y = 3x + 2).',
        'BASE PROCEDURE — ELIMINATION. Multiply one or both equations so a variable\'s coefficients become equal (to subtract) or equal-and-opposite (to add), then combine the equations to cancel that variable. Best when neither equation is already solved for a variable — most SAT word-problem systems.',
        'TRAP — SCALE BEFORE YOU ELIMINATE. Many systems need BOTH equations multiplied by different constants before a variable cancels cleanly. Don\'t force-add two equations just because it\'s tempting — check the coefficients first, and when subtracting, distribute the negative sign across EVERY term of the equation being subtracted.',
        'TRAP — SOLUTION COUNT FROM COEFFICIENT RATIOS. Compare the x-coefficient ratio to the y-coefficient ratio between the two equations. If those ratios are EQUAL, the lines are parallel or identical. Then compare the constant ratio: matches too → INFINITELY MANY solutions (same line); doesn\'t match → NO solution (parallel, distinct lines).',
        'TRAP — VARIABLE-COEFFICIENT k QUESTIONS. "For what value of k does this system have no solution / infinitely many solutions?" When k sits in a coefficient (not a constant), first solve for the k that makes the coefficient ratios match — that\'s the unique value. Then check whether the constants also match at that k to decide no-solution vs infinitely-many.',
        'TRAP — COMBINATION SHORTCUT. Some questions ask for x + y (or 2x − y, etc.) rather than each variable. Before solving for x and y individually, check whether adding, subtracting, or scaling the two equations directly produces that exact combination — it\'s often faster than a full solve.',
        'DESMOS CHECK — the built-in calculator is available on EVERY math question. Typing both equations in and reading the intersection point instantly gives the solution, and instantly shows parallel (no intersection) or coincident (fully overlapping) lines for classification questions.',
      ],
      vocabulary: [
        { term: 'system of linear equations', definition: 'two or more linear equations in the same variables, considered together — a solution must satisfy all of them.' },
        { term: 'elimination method', definition: 'scaling and adding or subtracting equations so one variable cancels out.' },
        { term: 'no solution (parallel lines)', definition: 'coefficient ratios match but the constant ratio doesn\'t — the lines never intersect.' },
        { term: 'infinitely many solutions (coincident lines)', definition: 'coefficient AND constant ratios all match — the two equations describe the same line.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-elimination-scaled',
      kind: 'worked_example',
      problem: 'Solve the system: 3x + 2y = 16 and x + 4y = 22. What is the value of y?',
      steps: [
        'Neither variable\'s coefficients are equal-and-opposite yet, so scale first: multiply the second equation by 3 to match the x-coefficients: 3x + 12y = 66.',
        'Subtract the first equation from this scaled version, distributing the subtraction across every term: (3x + 12y) − (3x + 2y) = 66 − 16 → 10y = 50 → y = 5.',
        'Back-substitute into the second original equation: x + 4(5) = 22 → x = 2.',
        'Check in the first equation: 3(2) + 2(5) = 6 + 10 = 16 ✓.',
      ],
      answer: 'y = 5 (and x = 2)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-k-trap',
      kind: 'worked_example',
      problem: 'For what value of k does the system 4x + 3y = 9 and kx + 6y = 20 have NO solution?',
      steps: [
        'k sits in a coefficient position, so first force the coefficient ratios to match: x-coefficient ratio is 4/k, y-coefficient ratio is 3/6. Set them equal: 4/k = 3/6 → 4/k = 1/2 → k = 8.',
        'At k = 8, check whether the constants also match that same ratio (which would make it infinitely many instead of no solution): the second equation becomes 8x + 6y = 20, which divides by 2 to 4x + 3y = 10.',
        'Compare to the first equation, 4x + 3y = 9. The constants (10 vs 9) do NOT match, so the lines are parallel but distinct — confirming NO solution at k = 8.',
      ],
      answer: 'k = 8',
      estimatedMinutes: 3,
    },
    {
      id: 'try-elimination-direct',
      kind: 'try_yourself',
      problem: 'Solve the system: 2x + 5y = 19 and x − 5y = −1. What is the value of x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4' },
        { id: 'b', text: '6', correct: true },
        { id: 'c', text: '8' },
        { id: 'd', text: '−6' },
      ],
      expectedAnswer: '6',
      hints: [
        'The y-coefficients are +5 and −5 — equal and opposite. Add the equations directly to eliminate y.',
        '(2x + 5y) + (x − 5y) = 19 + (−1) → 3x = 18.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-solution-count',
      kind: 'try_yourself',
      problem: 'For what value of c does the system 2x + 5y = 8 and 6x + 15y = c have infinitely many solutions?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8' },
        { id: 'b', text: '16' },
        { id: 'c', text: '24', correct: true },
        { id: 'd', text: '3' },
      ],
      expectedAnswer: '24',
      hints: [
        'Compare coefficients: 6/2 = 3 and 15/5 = 3 — the second equation is already 3 times the first equation\'s coefficients.',
        'For infinitely many solutions (the same line), the constant must scale by that same factor: 8 × 3 = 24.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-elimination-scaled',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): solve the system 3x + 2y = 16 and x + 4y = 22. What is the value of y?',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Neither variable cancels yet — scale the second equation by 3 to match the x-coefficients.',
        'Subtract, distributing the negative across every term: 10y = 50.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-subtract-sign',
      kind: 'misconception_check',
      question:
        'A student solves 5x + 2y = 16 and 5x − 3y = 1 by subtracting equation 2 from equation 1 to eliminate x. They write the y-terms as 2y − 3y = −y and get −y = 15, so y = −15. What went wrong?',
      commonErrors: [
        {
          answer: 'y = −15',
          misconception:
            'Subtracting the second equation term-by-term without distributing the negative sign to the −3y term — subtracting a negative flips its sign.',
          correctsTo:
            'Distribute the subtraction across every term: (5x + 2y) − (5x − 3y) = 5x + 2y − 5x + 3y = 5y. So 5y = 16 − 1 = 15 → y = 3. Then 5x + 2(3) = 16 → x = 2. Check equation 2: 5(2) − 3(3) = 10 − 9 = 1 ✓.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Check coefficients before combining equations — scale one or both first, and distribute the negative sign across every term when subtracting.',
        'Equal coefficient ratios mean parallel or identical lines; matching constant ratio too → infinitely many, mismatched → no solution.',
        'k-in-a-coefficient questions: force the coefficient ratio match to find k first, then check the constants to classify no-solution vs infinitely-many.',
        'Desmos graphs both lines and shows the intersection (or confirms parallel/overlapping) instantly — use it to solve or verify.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Systems of Two Linear Equations' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
