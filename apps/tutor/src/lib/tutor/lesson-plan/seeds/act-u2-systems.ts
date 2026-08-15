/**
 * ACT — Math / Systems of Equations: substitution, elimination & solution counts.
 *
 * Systems questions show up several times per test in the Intermediate
 * Algebra reporting category. Calculator is allowed but the winning move is
 * almost always a clean elimination or substitution set-up, not brute-force
 * arithmetic. ~60 seconds per question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_SYSTEMS: LessonPlan = {
  id: 'evelyn.testprep.act.systems.v1',
  title: 'Systems of Equations',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.systems',
      standard: 'ACT-2.3',
      description:
        'Solve systems of two linear equations by substitution and elimination, recognize whether a system has one, zero, or infinitely many solutions, and translate two-unknown word problems into systems, at ACT calculator-allowed pace.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe systems questions as a set-up game, not an arithmetic grind — lowering time-per-question.',
      script:
        'Systems of equations show up several times on every ACT Math section, and calculators are allowed — but the calculator can\'t pick your strategy for you. The students who fly through these questions spot the fast combination of the two equations in a few seconds instead of grinding through algebra. You have about 60 seconds per question, so today is about set-up speed.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-systems-method',
      kind: 'concept',
      goal: 'Substitution vs. elimination, the direct-combo speed trick, and reading the number of solutions.',
      keyIdeas: [
        'SUBSTITUTION: solve one equation for a variable (best when a variable already has coefficient 1, or one equation is already "y = …"), then plug that expression into the other equation.',
        'ELIMINATION: add or subtract the two equations (scaling one first if needed) so one variable cancels. Fastest when coefficients are already equal, opposite, or easy multiples.',
        'SPEED TRICK: if the question asks for a COMBINATION like x + y, 2x − y, or 3x + 3y directly, look for a way to add/subtract/scale the given equations to land on exactly that combination — you often never need x and y separately.',
        'NUMBER OF SOLUTIONS from two linear equations: different slopes → exactly ONE solution (lines cross once). Same slope, different intercept → NO solution (parallel lines; reducing the system gives a false statement like 0 = 5). Same slope AND same intercept (one equation is a multiple of the other) → INFINITELY MANY solutions.',
        'TRAP — SIGN ERRORS: when subtracting one equation from another, distribute the subtraction to EVERY term on that side, including the constant. A dropped sign flips the answer.',
        'WORD PROBLEMS: name your two unknowns explicitly, then find two SEPARATE pieces of given information (e.g., a total count AND a total cost) to write your two equations — mixing the same fact into both equations gives an unsolvable or redundant system.',
        'ALWAYS check the final (x, y) pair in BOTH original equations, not just the one you used last — a value that satisfies only one equation is not the answer.',
      ],
      vocabulary: [
        { term: 'system of equations', definition: 'two or more equations sharing the same variables, solved together for values that satisfy all of them at once.' },
        { term: 'substitution', definition: 'solving one equation for a variable, then replacing that variable with the resulting expression in the other equation.' },
        { term: 'elimination', definition: 'adding or subtracting (scaled) equations so that one variable\'s terms cancel out.' },
        { term: 'coefficient', definition: 'the number multiplying a variable, e.g., the 3 in 3x.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-elimination',
      kind: 'worked_example',
      problem: 'Solve the system: 2x + y = 11 and x − y = 1. What is the value of x?',
      steps: [
        'Look for a fast cancellation: the first equation has +y, the second has −y — adding the equations cancels y immediately.',
        'Add term-by-term: (2x + y) + (x − y) = 11 + 1 → 3x = 12.',
        'Divide: x = 4.',
        'Back-substitute into the simpler equation to find y: x − y = 1 → 4 − y = 1 → y = 3.',
        'Check in BOTH originals: 2(4) + 3 = 11 ✓ and 4 − 3 = 1 ✓.',
      ],
      answer: 'x = 4 (and y = 3)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-no-solution-trap',
      kind: 'worked_example',
      problem: 'What can you conclude about the system: 4x − 6y = 12 and 2x − 3y = 5?',
      steps: [
        'Try elimination: scale the second equation by 2 so the x-coefficients match: 2(2x − 3y) = 2(5) → 4x − 6y = 10.',
        'Compare to the first equation: 4x − 6y = 12.',
        'Same left side, DIFFERENT right side (12 ≠ 10) — this is a contradiction, not a solvable system.',
        'TRAP: a student who subtracts carelessly gets 0 = 2, a false statement, and may think they made an arithmetic mistake and keep hunting for x and y. Instead, a false numeric statement is the SIGNAL to stop: it means the two lines are parallel (same slope, different intercepts).',
        'Conclusion: the system has NO solution.',
      ],
      answer: 'No solution — the lines are parallel and never intersect.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-substitution',
      kind: 'try_yourself',
      problem: 'If y = 2x − 1 and 3x + y = 14, what is the value of x?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2' },
        { id: 'b', text: '3', correct: true },
        { id: 'c', text: '5' },
        { id: 'd', text: '7' },
      ],
      expectedAnswer: '3',
      hints: [
        'Substitute the expression for y directly into the second equation: 3x + (2x − 1) = 14.',
        'Combine like terms: 5x − 1 = 14, so 5x = 15.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-combo-trick',
      kind: 'try_yourself',
      problem: 'If 2x + 5y = 23 and 2x + 2y = 14, what is the value of y?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3', correct: true },
        { id: 'b', text: '4' },
        { id: 'c', text: '5' },
        { id: 'd', text: '9' },
      ],
      expectedAnswer: '3',
      hints: [
        'The 2x terms are identical in both equations — subtract the second equation from the first to cancel x directly.',
        '(2x + 5y) − (2x + 2y) = 23 − 14 → 3y = 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-word-problem',
      kind: 'try_yourself',
      problem:
        'Type your answer: A movie theater sells adult tickets for $9 and child tickets for $6. A family bought 5 tickets total and paid $39. How many adult tickets did they buy?',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Let a = number of adult tickets and c = number of child tickets. Write two equations: a + c = 5 and 9a + 6c = 39.',
        'Substitute c = 5 − a into the cost equation: 9a + 6(5 − a) = 39, then solve for a.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subtraction-sign',
      kind: 'misconception_check',
      question:
        'To eliminate y from 5x + 3y = 22 and 2x + 3y = 10, a student subtracts the equations and writes 3x + 3y = 12 instead of 3x = 12. What went wrong?',
      commonErrors: [
        {
          answer: '3x + 3y = 12',
          misconception: 'Only subtracting the x-terms and the constants, but forgetting to also subtract the y-terms — even though they are identical (3y and 3y) and should cancel to 0.',
          correctsTo: 'Subtract term-by-term on every part of both equations: (5x − 2x) + (3y − 3y) = 22 − 10 → 3x + 0 = 12 → 3x = 12, so x = 4.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Elimination: add or scale-then-combine equations to cancel a variable; substitution: solve one equation for a variable and plug it into the other.',
        'If the question asks for a combination like x + y or 2x − y directly, look for a shortcut combo of the two equations before solving for x and y separately.',
        'Different slopes → one solution; same slope + different intercept → no solution; same line → infinitely many solutions.',
        'Check your (x, y) pair in BOTH original equations — about 60 seconds per question.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Systems of Equations' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
