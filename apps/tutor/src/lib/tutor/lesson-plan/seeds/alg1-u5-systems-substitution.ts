/**
 * Algebra 1 — Systems of Equations: Solving Systems by Substitution.
 *
 * The first exact method for systems (CCSS A-REI.C.6): isolate a variable,
 * substitute the whole EXPRESSION in parentheses, solve the one-variable
 * equation, back-substitute for the second coordinate. Graphing gets you
 * close; substitution gets you the actual point.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U5_SYSTEMS_SUBSTITUTION: LessonPlan = {
  id: 'evelyn.hs.alg1.systems-substitution.v1',
  title: 'Solving Systems by Substitution',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.systems-substitution',
      standard: 'ALG1-5.2',
      description:
        'Solve a system of two linear equations by substitution — isolate one variable, substitute the expression into the other equation, and back-substitute to recover both coordinates (CCSS A-REI.C.6).',
    },
  ],
  prerequisites: ['alg1.systems-by-graphing'],
  followUps: ['alg1.systems-elimination'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame substitution as the upgrade from graphing: an exact answer instead of an eyeballed intersection.',
      script:
        'Two phone plans, two unknowns: how many minutes make them cost the same? Graphing gets you near the crossing point, but if the answer is x = 7/3 you will never read it off a grid. Substitution collapses two variables into one, and the answer comes out exact. One trick, four steps.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-substitution',
      kind: 'concept',
      goal: 'The four-step substitution routine, the parentheses rule, back-substitution, and when substitution is the smart choice.',
      keyIdeas: [
        'WHAT A SOLUTION IS — an (x, y) pair that makes BOTH equations true at once. On a graph that is the single point where the two lines cross.',
        'THE ROUTINE — 1) ISOLATE one variable in one equation, 2) SUBSTITUTE that expression into the OTHER equation, 3) SOLVE the resulting one-variable equation, 4) BACK-SUBSTITUTE to get the second coordinate.',
        'PICK THE EASY VARIABLE — isolate a variable whose coefficient is already 1 or −1, so no fractions appear. In x + y = 5 either variable is easy; in 4x − 2y = 8 neither is.',
        'PARENTHESES ALWAYS — you are replacing a variable with a whole EXPRESSION, so wrap it: substituting y = 5 − x into 4x − 2y gives 4x − 2(5 − x), which distributes to 4x − 10 + 2x. Writing 4x − 2·5 − x loses the sign flip and wrecks the answer.',
        'STEP 2 MUST USE THE OTHER EQUATION — substituting back into the equation you just rearranged only gives you something like 5 = 5, which is true and useless.',
        'YOU ARE NOT DONE AT ONE NUMBER — a system solution is a POINT. After solving for x, back-substitute into the isolated equation (the easiest one) to get y, and write the answer as an ordered pair.',
        'WHEN SUBSTITUTION WINS — when an equation is already solved for a variable (y = 3x − 4) or has a coefficient of ±1. When the two equations have matching or opposite coefficients instead, elimination is the faster tool.',
        'TWO SPECIAL ENDINGS — if the variables cancel into a false statement like 0 = 6, there is NO solution (parallel lines); into a true statement like 0 = 0, there are infinitely many (the same line twice).',
      ],
      vocabulary: [
        { term: 'system of equations', definition: 'two or more equations taken together; a solution must satisfy all of them simultaneously.' },
        { term: 'back-substitution', definition: 'plugging a found value back into an equation to recover the other variable.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-already-isolated',
      kind: 'worked_example',
      problem: 'Solve by substitution: y = 3x − 4 and 2x + y = 11',
      steps: [
        'Equation 1 is already isolated for y, so step 1 is free.',
        'Substitute the expression into the OTHER equation: 2x + (3x − 4) = 11.',
        'Combine like terms: 5x − 4 = 11, so 5x = 15 and x = 3.',
        'Back-substitute into the isolated equation: y = 3(3) − 4 = 5.',
        'Solution: (3, 5). Check in equation 2: 2(3) + 5 = 11. ✓',
      ],
      answer: '(x, y) = (3, 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parentheses-trap',
      kind: 'worked_example',
      problem: 'Solve by substitution: 3x − 2y = 4 and x + y = 3',
      steps: [
        'Neither equation is isolated, so pick the easy one: x + y = 3 has coefficients of 1. Isolate y: y = 3 − x.',
        'Substitute into the other equation WITH PARENTHESES: 3x − 2(3 − x) = 4.',
        'Distribute the −2 across both terms: 3x − 6 + 2x = 4. Note the +2x — the minus times the minus flips the sign.',
        'Combine and solve: 5x − 6 = 4, so 5x = 10 and x = 2.',
        'Back-substitute: y = 3 − 2 = 1. Solution: (2, 1). Check: 3(2) − 2(1) = 4 ✓ and 2 + 1 = 3 ✓.',
        'THE TRAP: dropping the parentheses gives 3x − 6 − x = 4, so 2x = 10 and x = 5, y = −2. Test it: 3(5) − 2(−2) = 19, not 4. Wrong.',
      ],
      answer: '(x, y) = (2, 1)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-solve-system',
      kind: 'try_yourself',
      problem: 'Solve by substitution: x + y = 5 and 4x − 2y = 8',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(3, 2)', correct: true },
        { id: 'b', text: '(6, −1)' },
        { id: 'c', text: '(2, 3)' },
        { id: 'd', text: '(−1, −6)' },
      ],
      expectedAnswer: '(3, 2)',
      hints: [
        'Isolate y in the first equation: y = 5 − x.',
        'Substitute in parentheses: 4x − 2(5 − x) = 8 becomes 4x − 10 + 2x = 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-method-choice',
      kind: 'try_yourself',
      problem: 'Which system is set up best for substitution, with no rearranging needed first?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2x + 7y = 15 and 5x − 3y = 4' },
        { id: 'b', text: 'y = 4x − 9 and 3x + 2y = 12', correct: true },
        { id: 'c', text: '4x + 3y = 10 and 4x − 3y = 2' },
        { id: 'd', text: '6x + 9y = 21 and 6x + 2y = 8' },
      ],
      expectedAnswer: 'y = 4x − 9 and 3x + 2y = 12',
      hints: [
        'Substitution is easiest when one equation is already solved for a single variable.',
        'Two of these have matching or opposite coefficients — those are elimination systems, not substitution systems.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve the system 2x + y = 12 and x = y + 3 by substitution, then type the value of y as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'The second equation is already isolated for x, so replace x in the first equation: 2(y + 3) + y = 12.',
        'Distribute and combine: 3y + 6 = 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-missing-parentheses',
      kind: 'misconception_check',
      question: 'A student substitutes y = 8 − x into 3x − y = 4 and writes 3x − 8 − x = 4, then reports x = 6. What went wrong, and what else is missing from that answer?',
      commonErrors: [
        {
          answer: 'x = 6',
          misconception: 'Substituting the expression without parentheses, so the minus sign only hit the 8 and never flipped the −x into +x.',
          correctsTo: 'Replacing y with an expression means writing it inside parentheses: 3x − (8 − x) = 3x − 8 + x = 4x − 8. Then 4x = 12 and x = 3. Sanity check the wrong route: x = 6 gives y = 2 and 3(6) − 2 = 16, not 4.',
        },
        {
          answer: 'The solution is 3',
          misconception: 'Stopping once one variable is found — treating a system answer like a single-variable equation answer.',
          correctsTo: 'A system solution is a POINT. Back-substitute: y = 8 − 3 = 5, so the solution is (3, 5). Check both: 3 + 5 = 8 ✓ and 3(3) − 5 = 4 ✓.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Isolate, substitute, solve, back-substitute — and substitute into the OTHER equation.',
        'Wrap the substituted expression in parentheses, then distribute the sign.',
        'Isolate the variable with coefficient 1 or −1 to avoid fractions.',
        'The answer is an ordered pair (x, y), not a single number — check it in both equations.',
        'Variables cancel into a false statement → no solution; into a true statement → infinitely many.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Solving Systems by Substitution' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
