/**
 * Algebra 1 — Systems of Equations: Solving Systems by Elimination.
 *
 * The method that makes real systems tractable (CCSS A-REI.C.5, A-REI.C.6):
 * add or subtract the equations so one variable cancels, scaling first when
 * the coefficients do not already line up. Substitution stalls the moment
 * both equations are in standard form; elimination does not.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U5_SYSTEMS_ELIMINATION: LessonPlan = {
  id: 'evelyn.hs.alg1.systems-elimination.v1',
  title: 'Solving Systems by Elimination',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.systems-elimination',
      standard: 'ALG1-5.3',
      description:
        'Solve systems of linear equations by elimination — adding or subtracting the equations, scaling one or both first — and interpret the cases where elimination leaves no solution or infinitely many (CCSS A-REI.C.5, A-REI.C.6).',
    },
  ],
  prerequisites: ['alg1.systems-substitution'],
  followUps: ['alg1.systems-applications'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that when both equations are already in standard form, cancelling a variable beats solving for one.',
      script:
        'Two people buy tickets at the same booth. One pays 61 dollars for 2 adult and 3 child tickets; the other pays 43 dollars for 2 adult and 1 child ticket. Substitution here means solving for a and dragging fractions around. Watch instead: both equations start with 2a, so subtract them and the adults vanish — 2c = 18, so a child ticket is 9 dollars. That is elimination. Real systems arrive in standard form, and this is the move that opens them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-elimination',
      kind: 'concept',
      goal: 'Add or subtract to cancel a variable, scale when coefficients do not match, and read the two no-variable endings.',
      keyIdeas: [
        'WHY IT IS LEGAL — equals added to equals stay equal. If A = B and C = D then A + C = B + D, so you may add two true equations term by term and the result is still true. Multiplying an entire equation by a nonzero constant is legal too — as long as BOTH sides get multiplied.',
        'OPPOSITE COEFFICIENTS → ADD — if one variable appears as +2y in one equation and −2y in the other, adding the equations cancels it: 3x + 2y = 12 plus 5x − 2y = 4 gives 8x = 16.',
        'MATCHING COEFFICIENTS → SUBTRACT — if the variable appears as +2y in both, subtract one equation from the other and it cancels.',
        'NEITHER MATCHES → SCALE FIRST — multiply one or both equations so the target variable\'s coefficients become equal or opposite. To kill y in 3x + 2y = 18 and 2x + 5y = 23, multiply the first by 5 and the second by 2: 15x + 10y = 90 and 4x + 10y = 46, then subtract. Aim for the least common multiple of the two coefficients.',
        'THE SUBTRACTION TRAP — subtracting an equation means subtracting EVERY term of it. (5x + 2y) − (3x + 2y) = 2x, not 2x + 4y. Students who drop the parentheses distribute the minus to the first term only. Safer habit: multiply the second equation by −1 and ADD, so there is nothing to distribute.',
        'FINISH THE JOB — solving the one-variable equation is only half. Back-substitute into an ORIGINAL equation (never a scaled one, where an error would hide), then check the pair in the OTHER original equation.',
        'ENDING 1 — NO SOLUTION: both variables cancel and you are left with something false like 0 = 24. The lines are parallel — same slope, different intercepts — so they never meet.',
        'ENDING 2 — INFINITELY MANY: both variables cancel into something true like 0 = 0. The two equations describe the SAME line, so every point on it is a solution.',
      ],
      vocabulary: [
        { term: 'elimination', definition: 'combining two equations so one variable cancels, leaving a single equation in one variable.' },
        { term: 'standard form', definition: 'a linear equation written as Ax + By = C, with the variable terms lined up on the left.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-scale-both',
      kind: 'worked_example',
      problem: 'Solve by elimination: 3x + 2y = 16 and 2x − 3y = −11',
      steps: [
        'Choose a variable to cancel. The y-coefficients are +2 and −3; their least common multiple is 6, and they already have opposite signs, so y is the easy target.',
        'Multiply the first equation by 3 (both sides): 9x + 6y = 48.',
        'Multiply the second equation by 2 (both sides): 4x − 6y = −22.',
        'Add the two scaled equations: +6y and −6y cancel, leaving 13x = 26, so x = 2.',
        'Back-substitute into the ORIGINAL first equation: 3(2) + 2y = 16 → 2y = 10 → y = 5.',
        'Check in the other original equation: 2(2) − 3(5) = 4 − 15 = −11. ✓',
      ],
      answer: '(x, y) = (2, 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-subtract-no-solution',
      kind: 'worked_example',
      problem: 'Solve by elimination: 6x − 4y = 10 and 3x − 2y = 8',
      steps: [
        'Scale the second equation by 2 so the x-terms match: 6x − 4y = 16. Note both coefficients matched up at once — that is the warning sign.',
        'Subtract the scaled equation from the first, in full: (6x − 4y) − (6x − 4y) = 10 − 16. Keep the parentheses so the minus reaches every term.',
        'The left side collapses to 0 and the right side to −6, giving 0 = −6 — a FALSE statement with no variable left.',
        'False means NO SOLUTION. Dividing the first equation by 2 shows why: 3x − 2y = 5 and 3x − 2y = 8 are parallel lines, same slope, different intercepts.',
        'Contrast the near-miss: had the second equation been 3x − 2y = 5, the subtraction would give 0 = 0 — TRUE — and the answer would be infinitely many solutions, because both equations name the same line.',
      ],
      answer: 'No solution (the lines are parallel)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-add-directly',
      kind: 'try_yourself',
      problem: 'Solve by elimination: 3x + 2y = 12 and 5x − 2y = 4',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(2, 3)', correct: true },
        { id: 'b', text: '(3, 2)' },
        { id: 'c', text: '(2, −3)' },
        { id: 'd', text: '(2, 6)' },
      ],
      expectedAnswer: '(2, 3)',
      hints: [
        'The y-terms are +2y and −2y — already opposites, so no scaling is needed. Add the equations.',
        '8x = 16 gives x = 2. Put that into 3x + 2y = 12 and finish solving for y.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem: 'How many solutions does this system have? 4x − 6y = 10 and −2x + 3y = 7',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly one solution' },
        { id: 'b', text: 'No solution', correct: true },
        { id: 'c', text: 'Infinitely many solutions' },
        { id: 'd', text: 'Exactly two solutions' },
      ],
      expectedAnswer: 'No solution',
      hints: [
        'Multiply the second equation by 2 (both sides) so the x-terms become opposites, then add.',
        'You get 0 = 24. Both variables vanished and the statement is false — decide what that means about the lines.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve by elimination: 3x + 2y = 18 and 2x + 5y = 23. Type the value of x as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Nothing cancels yet. To eliminate y, scale to a common coefficient of 10: multiply the first equation by 5 and the second by 2.',
        '15x + 10y = 90 and 4x + 10y = 46 — the y-terms now match, so subtract to get 11x = 44.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subtraction-sign',
      kind: 'misconception_check',
      question: 'Subtracting 3x + 2y = 16 from 5x + 2y = 24, a student writes 2x + 4y = 8 and gets stuck. What went wrong?',
      commonErrors: [
        {
          answer: '2x + 4y = 8',
          misconception: 'Applying the minus sign to only the first term of the second equation: 5x + 2y − 3x + 2y instead of 5x + 2y − (3x + 2y). The y-terms then add instead of cancelling, so nothing gets eliminated.',
          correctsTo: 'Subtract the WHOLE equation: (5x + 2y) − (3x + 2y) = 24 − 16 gives 2x = 8, so x = 4. Back-substitute into 3x + 2y = 16: 12 + 2y = 16 → y = 2. Check in 5x + 2y = 24: 20 + 4 = 24 ✓. To avoid the trap entirely, multiply the second equation by −1 and add instead of subtracting.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Opposite coefficients → add; matching coefficients → subtract; neither → scale one or both equations first.',
        'When you scale, multiply BOTH sides of the equation.',
        'Subtracting means subtracting every term — keep the parentheses, or multiply by −1 and add.',
        'Back-substitute into an ORIGINAL equation, then check the pair in the other one.',
        'Variables cancel into a FALSE statement → no solution (parallel lines); into a TRUE statement → infinitely many (same line).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Solving Systems by Elimination' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
