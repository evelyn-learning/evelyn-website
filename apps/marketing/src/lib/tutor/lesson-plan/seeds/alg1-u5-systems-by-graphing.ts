/**
 * Algebra 1 — Systems of Linear Equations: Solving Systems by Graphing.
 *
 * Where two lines cross is the one (x, y) that satisfies BOTH equations
 * (CCSS A-REI.C.6, A-REI.D.11). This is the picture behind every later
 * system method — substitution and elimination are just faster ways of
 * finding the same intersection point.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U5_SYSTEMS_BY_GRAPHING: LessonPlan = {
  id: 'evelyn.hs.alg1.systems-by-graphing.v1',
  title: 'Solving Systems by Graphing',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.systems-by-graphing',
      standard: 'ALG1-5.1',
      description:
        'Solve a system of two linear equations by graphing, identify the solution as the intersection point, classify systems with one, no, or infinitely many solutions from slopes and intercepts, and verify a candidate point in both equations (CCSS A-REI.C.6, A-REI.D.11).',
    },
  ],
  prerequisites: ['alg1.parallel-perpendicular'],
  followUps: ['alg1.systems-substitution'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a system as two conditions at once, and the crossing point as the only deal that satisfies both.',
      script:
        'Two gyms want your money. One charges a $30 sign-up fee plus $10 a month; the other charges no fee but $16 a month. Which is cheaper depends on how long you stay — and there is exactly one month where they cost the same. Graph both cost lines and that month is literally the point where they cross. Today we learn to read that crossing point, and to spot the two systems that never cross at one point at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-intersection',
      kind: 'concept',
      goal: 'The solution of a system is the intersection point; how to graph both lines, read it, verify it, and classify the three possible outcomes.',
      keyIdeas: [
        'WHAT A SOLUTION IS — one linear equation is satisfied by a whole line of points. TWO equations together are satisfied only by the points on BOTH lines, so the solution of a system is the intersection point, written as an ordered pair (x, y).',
        'HOW TO GRAPH — rewrite each equation as y = mx + b, plot the y-intercept b, then step by the slope m as rise/run to get a second point, and draw the line. Do this for both equations on the SAME set of axes.',
        'READ, THEN VERIFY — a graph only gives an exact answer when the crossing lands on a lattice point (whole-number coordinates). Always confirm the point algebraically; a hand sketch cannot tell (2, 3) from (2.1, 3.2).',
        'CHECK IN BOTH EQUATIONS — substitute the candidate x and y into equation 1 AND equation 2. A point that works in only one equation is on only one line, so it is not a solution.',
        'THREE OUTCOMES FROM SLOPES AND INTERCEPTS — different slopes → lines cross once → exactly ONE solution. Same slope, different y-intercept → parallel lines → NO solution. Same slope AND same y-intercept → one line drawn twice → INFINITELY many solutions.',
        'CLASSIFY BEFORE YOU GRAPH — solve both equations for y and compare m and b. That comparison answers "how many solutions" in seconds, with no graph paper at all.',
        'STANDARD FORM TRAP — you cannot compare slopes until each equation is solved for y. From 6x + 2y = 14, divide EVERY term by 2 after moving 6x: 2y = −6x + 14, so y = −3x + 7 (not y = −6x + 7).',
        'ORDER MATTERS — the answer is (x, y), not (y, x). Reporting (3, 2) when the intersection is (2, 3) is a different point and fails the check.',
      ],
      vocabulary: [
        { term: 'system of equations', definition: 'two or more equations solved together, all of which must be true at once.' },
        { term: 'point of intersection', definition: 'the (x, y) where two graphed lines cross — the solution of the system.' },
        { term: 'inconsistent system', definition: 'a system with no solution; its lines are parallel.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-one-solution',
      kind: 'worked_example',
      problem: 'Solve by graphing: y = 2x − 1 and y = −x + 5',
      steps: [
        'Graph the first line: y-intercept −1, slope 2, so from (0, −1) go up 2 and right 1 to (1, 1).',
        'Graph the second line: y-intercept 5, slope −1, so from (0, 5) go down 1 and right 1 to (1, 4).',
        'The slopes 2 and −1 are different, so the lines cross exactly once. Reading the graph, they meet at (2, 3).',
        'Check in BOTH equations: 2(2) − 1 = 3 ✓ and −(2) + 5 = 3 ✓. Both true, so (2, 3) is the solution.',
      ],
      answer: '(2, 3)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parallel-no-solution',
      kind: 'worked_example',
      problem: 'Solve by graphing: y = −3x + 4 and 6x + 2y = 14',
      steps: [
        'The second equation is in standard form, so solve it for y: subtract 6x to get 2y = −6x + 14.',
        'Divide EVERY term by 2: y = −3x + 7. (Dividing only the 6x is the classic slip that gives a wrong slope.)',
        'Compare: both lines have slope −3, but the y-intercepts are 4 and 7 — different.',
        'Same slope with different intercepts means the lines are parallel: they stay 3 units apart vertically and never cross, so there is NO solution.',
        'Contrast: if the second equation had been 6x + 2y = 8, it would simplify to y = −3x + 4 — the SAME line — and the system would have infinitely many solutions.',
      ],
      answer: 'No solution (the lines are parallel)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-intersection-point',
      kind: 'try_yourself',
      problem: 'Which ordered pair is the solution of the system y = x + 4 and y = −2x + 1?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(−1, 3)', correct: true },
        { id: 'b', text: '(3, −1)' },
        { id: 'c', text: '(1, 5)' },
        { id: 'd', text: '(0, 4)' },
      ],
      expectedAnswer: '(−1, 3)',
      hints: [
        'Both lines give y, so the crossing point is where x + 4 = −2x + 1.',
        'Solving gives x = −1; substitute into either equation for y, then test the pair in BOTH equations.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem: 'Without graphing, how many solutions does the system y = (1/2)x − 3 and x − 2y = 6 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly one — the two equations look different, so the lines must cross' },
        { id: 'b', text: 'None — the lines are parallel' },
        { id: 'c', text: 'Infinitely many — solved for y, both equations are the same line', correct: true },
        { id: 'd', text: 'Exactly two — one crossing for each equation' },
      ],
      expectedAnswer: 'Infinitely many — solved for y, both equations are the same line',
      hints: [
        'Solve x − 2y = 6 for y before comparing anything.',
        '−2y = −x + 6 becomes y = (1/2)x − 3 — identical slope AND identical y-intercept.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'The lines y = 3x − 5 and y = x + 1 cross at exactly one point. Type the x-coordinate of that point as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'At the crossing point the two y-values are equal: 3x − 5 = x + 1.',
        'Subtract x from both sides: 2x − 5 = 1, so 2x = 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-answer',
      kind: 'misconception_check',
      question: 'A student graphs y = x + 2 and y = −2x + 8, sees the lines cross, and answers "x = 2". Another student answers "(4, 2)". What went wrong in each case?',
      commonErrors: [
        {
          answer: 'x = 2',
          misconception: 'Treating a two-variable system like a one-variable equation and stopping at the x-value.',
          correctsTo: 'A point has two coordinates. Substitute x = 2 back in: y = 2 + 2 = 4, so the solution is (2, 4). Check both: 2 + 2 = 4 ✓ and −2(2) + 8 = 4 ✓.',
        },
        {
          answer: '(4, 2)',
          misconception: 'Writing the coordinates in the wrong order — reporting (y, x) instead of (x, y).',
          correctsTo: 'Test it: for x = 4, the first equation gives y = 6, not 2. The correct pair is (2, 4). Order always goes (x, y).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The solution of a system is the intersection point of the two lines, written as (x, y).',
        'Graph by putting each equation in y = mx + b: plot b, then step by the slope.',
        'Different slopes → one solution. Same slope, different intercept → none. Same slope and intercept → infinitely many.',
        'Solve for y before comparing slopes — divide every term, not just the x-term.',
        'A point is only a solution if it checks out in BOTH equations.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Solving Systems by Graphing' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
