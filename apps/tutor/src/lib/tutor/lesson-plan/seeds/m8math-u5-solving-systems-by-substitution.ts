/**
 * Grade 8 Math — Systems of Linear Equations: Solving Simple Systems by
 * Substitution.
 *
 * PROCEDURE-LED row for the m8math fan-out. The student arrives owning two
 * things: a solution of a system is the (x, y) pair that works in BOTH
 * equations (row 5.1), and graphing two lines finds that pair by reading the
 * crossing, which is only a guess when the crossing sits between grid lines
 * (row 5.2). What is new is an algebraic route to the same pair that lands
 * exactly (CCSS 8.EE.C.8b): when both equations are solved for y, set the two
 * expressions equal; when one is, drop that expression into the other
 * equation in place of y. Either move leaves one equation in one variable, of
 * a kind the student already solves (Unit 4). Then back-substitute for the
 * second coordinate and check the pair in both equations. Two traps this plan
 * is built to kill: dropping the parentheses when a coefficient multiplies a
 * two-term expression (so the coefficient only reaches the first term), and
 * stopping at x as if a single number could be the crossing point of two
 * lines.
 *
 * SCOPE GUARD: Grade 8 row 5.3 solves a system algebraically only when one or
 * both equations are already solved for y: set two right-hand sides equal, or
 * substitute the expression for y into the other equation, then
 * back-substitute for the second coordinate and check the pair in BOTH
 * equations, noting the answer is exact where graphing only estimated. STOPS
 * before: isolating a variable from a general two-variable equation first ->
 * `alg1-u5-systems-substitution.ts`; adding/scaling equations ->
 * `alg1-u5-systems-elimination.ts`. Concretely: no equation in this plan is
 * ever rearranged to isolate x or y before substituting (every system offers
 * at least one equation that already reads y = ...), and no two equations are
 * ever added, subtracted or multiplied through. Sideways: the meaning of a
 * solution as the pair that satisfies both equations is row 5.1, assumed and
 * recalled in a sentence; graphing to find or estimate the crossing is row
 * 5.2, mentioned here only to contrast an estimate with an exact answer and
 * never re-taught; translating a story into two equations is row 5.4, so the
 * hook's drone story hands the student both equations already written. Below
 * (earlier units of this course, assumed and not re-taught): once the
 * substitution is made, the equation that remains has the variable on both
 * sides (row 4.1) or needs a factor distributed and like terms combined (row
 * 4.2); finishing those equations is in scope here and is done in full, but
 * the moves themselves are named, not re-taught. Every coefficient and
 * constant in this plan is an integer; the correct solution of every worked
 * example and try_yourself has integer coordinates (the WRONG road in the
 * second worked example and one MCQ distractor deliberately produce
 * non-integers, which is how the two-equation check exposes them); the
 * concept segment shows one crossing at x = 2.5 on purpose, because a
 * half-unit crossing is exactly what a grid cannot read. No system in this
 * plan has zero or infinitely many solutions
 * (row 5.2's parallel and coincident cases), and no classification
 * vocabulary appears.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U5_SOLVING_SYSTEMS_BY_SUBSTITUTION: LessonPlan = {
  id: 'evelyn.ms.m8math.solving-systems-by-substitution.v1',
  title: 'Solving Simple Systems by Substitution',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.solving-systems-by-substitution',
      standard: 'M8MATH-5.3',
      description:
        'Solve algebraically when one or both equations are already solved for y -- set y = 2x + 1 equal to y = -x + 7, or substitute y = 3x into 2x + y = 10 -- then back-substitute to get both coordinates, and note the answer is exact where graphing only estimated (CCSS 8.EE.C.8b).',
    },
  ],
  prerequisites: ['m8math.solving-systems-by-graphing'],
  followUps: ['m8math.systems-word-problems'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two already-written equations in front of the student and show that at the crossing the two y-values are the same number, so the graph is not the only way in.',
      script:
        'Two drones lift off at the park at the same moment. Drone A starts 1 meter off the ground and climbs 2 meters every second, so after x seconds its height is y = 2x + 1. Drone B starts 7 meters up and sinks 1 meter every second, so its height is y = -x + 7. At what second are they at the same height? Last lesson you would graph both lines and read the crossing point, and when the crossing sat between grid lines you had to guess. Today you get the exact answer without a grid. The whole method is one sentence: at the crossing, the y in the first equation IS the y in the second. So whatever 2x + 1 equals, -x + 7 equals the same thing, and you can set them equal to each other. That leaves one equation with one variable, and you already know how to solve that.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-substitute-then-back-substitute',
      kind: 'concept',
      goal: 'Install the two substitution moves (set equal, or drop the expression in with parentheses), the back-substitution for the second coordinate, and the two-equation check that proves the pair is exact.',
      keyIdeas: [
        'A SOLUTION IS THE PAIR THAT WORKS IN BOTH EQUATIONS — the solution of a system is the (x, y) pair that makes both equations true at once, the crossing point of the two lines. Graphing found it by looking, and if the crossing sits between grid lines, looking only gives a guess. Substitution finds the same pair with algebra, so the answer comes out exact.',
        'BOTH SOLVED FOR y: SET THE RIGHT SIDES EQUAL — at the crossing, y = 2x + 1 and y = -x + 7 are talking about the same y, so the two expressions must be equal: 2x + 1 = -x + 7. That is one equation with one variable, with the variable on both sides, and you already own that solve: add x to both sides, 3x + 1 = 7, subtract 1, 3x = 6, divide by 3, x = 2.',
        'ONE SOLVED FOR y: SUBSTITUTE THE WHOLE EXPRESSION — if the system is y = 3x and 2x + y = 10, the first equation says y is 3x, so wherever the second equation has y, write 3x instead: 2x + 3x = 10, so 5x = 10 and x = 2. When the expression has two terms, wrap it in parentheses so the coefficient multiplies all of it: y = 2x - 1 dropped into 4x + 3y = 27 becomes 4x + 3(2x - 1) = 27, and the 3 distributes to both the 2x and the -1.',
        'BACK-SUBSTITUTE FOR THE SECOND COORDINATE — x by itself is half an answer. Put the x-value into the equation that is already solved for y, because that is the shortest route: from y = 3x with x = 2, y = 3(2) = 6. The solution is the pair (2, 6), written with x first.',
        'CHECK THE PAIR IN BOTH EQUATIONS — a point on one line is not the crossing. For (2, 6): the first equation gives 6 = 3(2) = 6, and the second gives 2(2) + 6 = 4 + 6 = 10. Both true, so (2, 6) is the solution. If the pair fails either equation, the slip is usually a dropped parenthesis or a sign that did not change when a term crossed the equals sign.',
        'EXACT BEATS ESTIMATED — the system y = 4x + 1 and y = 2x + 6 gives 4x + 1 = 2x + 6, so 2x = 5 and x = 2.5, and then y = 4(2.5) + 1 = 11. On a grid that crossing sits halfway between two vertical lines, and the best a graph can offer is "about 2 and a half". Substitution says exactly 2.5, and the check agrees: 2(2.5) + 6 = 11 as well.',
      ],
      vocabulary: [
        { term: 'substitution', definition: 'replacing a variable with an expression that equals it, so the equation has only one variable left.' },
        { term: 'back-substitution', definition: 'putting the value found for one variable into an equation to find the other variable.' },
        { term: 'solution of a system', definition: 'the (x, y) pair that makes both equations of the system true; the point where the two lines cross.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-drones',
      kind: 'worked_example',
      problem:
        'Drone A is at height y = 2x + 1 meters after x seconds, and Drone B is at height y = -x + 7. Solve the system to find the exact second and height at which the two drones meet.',
      steps: [
        'Both equations are already solved for y, and at the meeting point both y-values are the same number. So the two expressions for y are equal: 2x + 1 = -x + 7.',
        'That is a one-variable equation with x on both sides. Add x to both sides: 2x + x + 1 = -x + x + 7, which leaves 3x + 1 = 7.',
        'Finish the two-step equation: subtract 1 from both sides, 3x = 6, then divide both sides by 3, x = 2.',
        'Back-substitute x = 2 into either equation to get y. Using the first: y = 2(2) + 1 = 4 + 1 = 5. The solution is the pair (2, 5).',
        'Check in BOTH equations. First: 2(2) + 1 = 5, and y is 5, true. Second: -2 + 7 = 5, and y is 5, true. Both hold, so (2, 5) is the crossing point.',
        'Read it back: 2 seconds after liftoff both drones are exactly 5 meters up. A graph would show this crossing at a grid point, but substitution would have given the same exact pair even if the crossing sat between the grid lines.',
      ],
      answer: '(2, 5): the drones meet after 2 seconds at a height of 5 meters',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parentheses-substitution',
      kind: 'worked_example',
      problem: 'Solve the system: y = 2x - 1 and 4x + 3y = 27',
      steps: [
        'Only the first equation is solved for y, so substitution goes one way: the first equation says y equals 2x - 1, and that whole expression goes where y sits in the second equation.',
        'Substitute with parentheses: 4x + 3(2x - 1) = 27. The 3 was multiplying y, so it must multiply all of what y equals.',
        'WRONG: writing 4x + 3 × 2x - 1 = 27, so 10x - 1 = 27, 10x = 28, and x = 2.8. CORRECT: the parentheses keep the -1 inside the multiplication. Distribute the 3 to both terms: 4x + 6x - 3 = 27. The check exposes the wrong road: x = 2.8 gives y = 2(2.8) - 1 = 4.6, and then 4(2.8) + 3(4.6) = 11.2 + 13.8 = 25, not 27.',
        'Combine like terms: 10x - 3 = 27. Add 3 to both sides, 10x = 30, then divide both sides by 10, x = 3.',
        'Back-substitute x = 3 into the equation solved for y: y = 2(3) - 1 = 6 - 1 = 5. The solution is (3, 5).',
        'Check in BOTH equations. First: 2(3) - 1 = 5, and y is 5, true. Second: 4(3) + 3(5) = 12 + 15 = 27, true. The pair works in both, so it is the crossing point of the two lines, found exactly and without a graph.',
      ],
      answer: 'x = 3, y = 5; the solution is (3, 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-both-solved-for-y',
      kind: 'try_yourself',
      problem: 'Solve the system y = 3x - 4 and y = x + 6. Which pair is the solution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(5, 11)', correct: true },
        { id: 'b', text: '(2, 8)' },
        { id: 'c', text: '(1, 7)' },
        { id: 'd', text: '(2.5, 8.5)' },
      ],
      expectedAnswer: '(5, 11)',
      hints: [
        'Both equations are solved for y, so set the two expressions equal: 3x - 4 = x + 6. Solve that for x first, then find y.',
        'Subtract x from both sides and add 4 to both sides to get 2x = 10. Back-substitute your x into y = x + 6, then check the pair in y = 3x - 4 as well; the solution must work in both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-substitution-step',
      kind: 'try_yourself',
      problem:
        'A student is solving the system y = 2x + 3 and 3x + 2y = 13 by substitution. Which equation is the correct result of substituting the expression for y into the second equation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3x + 4x + 3 = 13' },
        { id: 'b', text: '3(2x + 3) + 2y = 13' },
        { id: 'c', text: '3x + 2(2x + 3) = 13', correct: true },
        { id: 'd', text: '3x + 2x + 3 = 13' },
      ],
      expectedAnswer: '3x + 2(2x + 3) = 13',
      hints: [
        'The first equation says y equals 2x + 3, so 2x + 3 goes exactly where the y is in 3x + 2y = 13, and the 2 that was multiplying y still has to multiply it.',
        'Wrap the whole expression in parentheses so the 2 multiplies both the 2x and the 3. The x in 3x is untouched, because nothing was substituted for x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-second-coordinate',
      kind: 'try_yourself',
      problem:
        'Solve the system y = 5x and 2x + y = 28. What is the y-coordinate of the solution? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: [
        'The first equation says y is 5x, so replace the y in the second equation with 5x: 2x + 5x = 28.',
        'Solve 7x = 28 for x, then back-substitute into y = 5x. The question asks for y, not x, so finish the second step and check the pair in 2x + y = 28.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-answer-and-wrong-variable',
      kind: 'misconception_check',
      question:
        'Dev and Lena both solve the system y = 2x and 3x + y = 25. Dev writes "the solution is 5" and stops. Lena writes 3(2x) + y = 25 as her first line and cannot finish. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The solution is 5',
          misconception: 'Stopping after finding x = 5 and reporting a single number, when the solution of a system is the pair that makes both equations true.',
          correctsTo:
            'x = 5 is correct, but it is half an answer. Back-substitute into the equation solved for y: y = 2(5) = 10, so the solution is the pair (5, 10). Check it in both equations: 2(5) = 10 matches y = 10, and 3(5) + 10 = 15 + 10 = 25 is true. A single number cannot be the crossing point of two lines; a point needs both coordinates.',
        },
        {
          answer: '3(2x) + y = 25',
          misconception: 'Putting the expression 2x in place of x instead of in place of y, because the substitution was made without reading which variable the first equation is solved for.',
          correctsTo:
            'The first equation is y = 2x, which says what y equals, not what x equals. So 2x replaces the y in the second equation and the x stays: 3x + 2x = 25, so 5x = 25 and x = 5. Then y = 2(5) = 10, and the pair (5, 10) checks in both equations. If a line of work still has both x and y in it after substituting, the substitution went into the wrong variable.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The solution of a system is the (x, y) pair that makes both equations true. Substitution finds it exactly, where graphing only reads it off a grid.',
        'If both equations are solved for y, set the two expressions equal to each other and solve the one-variable equation that results.',
        'If one equation is solved for y, put that whole expression where y sits in the other equation, in parentheses if it has more than one term, then distribute.',
        'After finding x, back-substitute into the equation solved for y to get the second coordinate. A single number is only half the answer.',
        'Check the pair in BOTH equations. If it fails either one, look for a dropped parenthesis or a sign that did not change.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Solving Simple Systems by Substitution' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
