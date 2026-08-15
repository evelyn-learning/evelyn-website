/**
 * Algebra 1 — Linear Functions: Graphing with Slope-Intercept Form.
 *
 * y = mx + b is the form students will read, graph, and write more often
 * than any other in the course (CCSS F-IF.C.7a, F-LE.B.5): m is the rate
 * of change, b is the starting value. Get the two numbers out of an
 * equation, a graph, or a sentence — and put them back in.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U4_SLOPE_INTERCEPT_FORM: LessonPlan = {
  id: 'evelyn.hs.alg1.slope-intercept-form.v1',
  title: 'Graphing with Slope-Intercept Form',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.slope-intercept-form',
      standard: 'ALG1-4.3',
      description:
        'Identify the slope m and y-intercept b in y = mx + b, graph a line directly from that equation, write the equation from a graph or from a slope and a point, and interpret m and b in a real-world context (CCSS F-IF.C.7a, F-LE.B.5).',
    },
  ],
  prerequisites: ['alg1.slope-rate-of-change'],
  followUps: ['alg1.point-slope-standard-form'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a whole straight-line relationship compresses into exactly two numbers — a start and a rate.',
      script:
        'A rideshare charges a $3 pickup fee plus $2 per mile. That entire price list is two numbers: where it starts, $3, and how fast it climbs, $2 a mile. As a line: y = 2x + 3. Pay per hour, water draining from a tank, a savings balance — every straight-line story collapses to the same two numbers. Learn to read them and you can graph a line in ten seconds, or turn a graph back into its equation.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mx-plus-b',
      kind: 'concept',
      goal: 'What m and b mean, how to graph from them, how to recover them from a graph or a context.',
      keyIdeas: [
        'THE FORM — y = mx + b. Only two numbers matter: m, the number multiplied by x, and b, the number added on. Everything else in this lesson is reading them or using them.',
        'm IS THE SLOPE — rise over run, the change in y for every 1 unit increase in x. Positive m rises left to right, negative m falls, m = 0 is a horizontal line.',
        'b IS THE y-INTERCEPT — the value of y when x = 0, which is the point (0, b) where the line crosses the y-AXIS. It is not where the line crosses the x-axis.',
        'GRAPHING FROM THE EQUATION — 1) plot (0, b), 2) from that point step the slope as rise/run, 3) plot the new point and draw the line through both. For y = (3/4)x − 2: start at (0, −2), go up 3 and right 4 to (4, 1).',
        'NEGATIVE SLOPE — write it over 1: m = −3 means −3/1, so from your starting point go right 1 and DOWN 3. Going down-and-right and up-and-left both work; they land on the same line.',
        'WRITING THE EQUATION FROM A GRAPH — read b where the line crosses the y-axis, then count rise/run between two points the line passes through exactly, and assemble y = mx + b. Given a slope and any point instead, substitute the point into y = mx + b and solve for b.',
        'IN CONTEXT — m is the "per one unit of x" amount (per mile, per hour, per month) and b is the starting amount before any x has accumulated. Units matter: for C = 25x + 40, m is 25 dollars per month and b is 40 dollars.',
        'ORDER TRAP — y = 4 − 2x is still slope-intercept form; rewrite it as y = −2x + 4 to see that m = −2 and b = 4. m is whatever multiplies x, not whichever number is written first.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'the rise over the run between any two points on a line — how much y changes per 1 unit of x.' },
        { term: 'y-intercept', definition: 'the y-value where the line crosses the y-axis; the output when the input is 0.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-graph-from-equation',
      kind: 'worked_example',
      problem: 'Graph y = (3/4)x − 2 and state the slope and y-intercept.',
      steps: [
        'Read the two numbers off the form: m = 3/4 and b = −2.',
        'Plot the y-intercept first: the point (0, −2) on the y-axis.',
        'Step the slope as rise/run: from (0, −2) go up 3 and right 4, landing on (4, 1).',
        'Do it once more for a third point: from (4, 1) go up 3 and right 4 to (8, 4). Draw the line through all three.',
        'Check with the equation: at x = 8, y = (3/4)(8) − 2 = 6 − 2 = 4 ✓. Slope 3/4, y-intercept −2.',
      ],
      answer: 'Slope m = 3/4, y-intercept b = −2; line through (0, −2), (4, 1), (8, 4).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reordered-negative',
      kind: 'worked_example',
      problem: 'Graph y = 4 − 2x. A student says m = 4 and b = −2. Fix the reading, then graph it.',
      steps: [
        'The student read left to right. m is the number MULTIPLIED by x, so rewrite in order: y = −2x + 4.',
        'Now the two numbers are clear: m = −2 and b = 4.',
        'Plot the y-intercept (0, 4).',
        'Write the slope over 1: −2/1. From (0, 4) go right 1 and down 2 to (1, 2); again to (2, 0).',
        'Check with the equation: at x = 2, y = 4 − 2(2) = 0 ✓, and at x = 3, y = 4 − 6 = −2, matching the point (3, −2) on the same line.',
      ],
      answer: 'm = −2 and b = 4; line falls through (0, 4), (1, 2), (2, 0).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-equation-from-graph',
      kind: 'try_yourself',
      problem: 'A line crosses the y-axis at (0, −3) and passes through (4, 5). Which equation describes it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = −3x + 2' },
        { id: 'b', text: 'y = 2x − 3', correct: true },
        { id: 'c', text: 'y = (1/2)x − 3' },
        { id: 'd', text: 'y = 2x + 3' },
      ],
      expectedAnswer: 'y = 2x − 3',
      hints: [
        'The y-axis crossing hands you b directly.',
        'Slope is rise over run: the y-value climbs from −3 to 5 while x moves from 0 to 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-context',
      kind: 'try_yourself',
      problem: 'A gym charges total cost C = 25x + 40 dollars, where x is the number of months of membership. What does the 40 represent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cost goes up $40 for each additional month.' },
        { id: 'b', text: 'The membership costs $40 per month.' },
        { id: 'c', text: 'A one-time joining fee — the cost when x = 0, before any months are paid for.', correct: true },
        { id: 'd', text: 'The membership runs out after 40 months.' },
      ],
      expectedAnswer: 'A one-time joining fee — the cost when x = 0, before any months are paid for.',
      hints: [
        'Which of the two numbers is m and which is b here?',
        'Substitute x = 0 and see what the cost is before a single month has passed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-find-b',
      kind: 'try_yourself',
      problem: 'A line has slope 4 and passes through the point (2, 11). Find its y-intercept b and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'Start from y = 4x + b — only b is unknown.',
        'Substitute x = 2 and y = 11: 11 = 4(2) + b.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rise-run-swap',
      kind: 'misconception_check',
      question: 'To graph y = (2/5)x + 1, a student plots (0, 1) and then counts 2 units right and 5 units up. What went wrong?',
      commonErrors: [
        {
          answer: 'Moves right 2 and up 5, landing on (2, 6).',
          misconception: 'Reading the slope fraction as run over rise — using the top number for the horizontal move instead of the vertical one.',
          correctsTo: 'Slope is RISE over RUN, so 2/5 means up 2 and right 5: from (0, 1) the next point is (5, 3). Check it in the equation: (2/5)(5) + 1 = 2 + 1 = 3 ✓. The student\'s point fails the same check — at x = 2 the line is only at (2/5)(2) + 1 = 1.8, not 6.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = mx + b: m is the slope (rise/run, the per-unit rate), b is the y-intercept (the value at x = 0).',
        'Graph it by plotting (0, b) first, then stepping rise over run — a negative slope goes over 1 and down.',
        'From a graph: read b at the y-axis, count rise/run between two points. From a slope and a point: substitute and solve for b.',
        'y = 4 − 2x means m = −2, b = 4 — m is whatever multiplies x, not the first number written.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'Graphing with Slope-Intercept Form' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
