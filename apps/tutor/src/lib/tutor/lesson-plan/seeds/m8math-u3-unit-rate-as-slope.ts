/**
 * Grade 8 Math — Proportional Relationships & Slope: Unit Rate as Slope.
 *
 * CONCEPT-LED. The student arrives already able to find k from a table, a
 * graph or a description and to write y = kx. Nothing in that toolkit is new
 * here. What is new is a way of SEEING k: the graph of a proportional
 * relationship is a line through the origin, that line leans at one fixed
 * steepness, the steepness can be measured as the rise for a run of exactly
 * 1 unit, and the number that measurement produces is the unit rate, which
 * is k (CCSS 8.EE.B.5). The lesson therefore builds one mental model — slope
 * is a measurable steepness, and it is the same number the student has been
 * calling the unit rate all along — and runs it in both directions: table to
 * graph to slope, and equation to graph to slope. Two traps this plan is
 * built to kill: reading the y-coordinate of the one marked point as the
 * slope (only true at x = 1), and putting run over rise so the rate comes
 * out upside down.
 *
 * SCOPE GUARD: Starts from `m7math-u3-constant-of-proportionality.ts`
 * (identify k from table/graph/description, write y = kx — assumed, not
 * re-taught); the NEW move is slope as a measurable steepness of the graph.
 * Withholds: y-intercept (row 3.4); slope between two arbitrary points (row
 * 3.3). Concretely: every line in this plan passes through the origin, every
 * slope is positive, and the word "intercept" never appears in the body.
 * Slope is measured in exactly two ways here — as the rise for a run of
 * exactly 1 unit (stepping from a point on the line to the point 1 unit to
 * its right), or as y ÷ x from the origin to a single marked point, which
 * is the same division the student already uses to find k. No slope
 * triangle of width other than 1 is drawn, no rise-over-run is ever computed
 * between two points that are BOTH away from the origin, and no negative
 * slope appears — those are row 3.3. The plan says that a larger k makes a
 * steeper line, but it never sets two relationships side by side in
 * different representations and asks which is faster or cheaper — that is
 * row 3.2. Graphing from y = kx is in this row's scope cell and is done by
 * generating (x, kx) pairs and plotting them, never by the Algebra 1 move of
 * plotting an intercept and stepping by the slope
 * (`alg1-u4-slope-intercept-form.ts`); zero/undefined slope, horizontal or
 * vertical lines, and "rate of change" language are never used
 * (`alg1-u4-slope-rate-of-change.ts`). Salvaged from
 * `g8-math-slope-linear-functions.ts`: the slope-is-the-unit-rate framing
 * only; its y = mx + b bundling of 8.EE.B.5 with 8.F.B.4 was deliberately
 * left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U3_UNIT_RATE_AS_SLOPE: LessonPlan = {
  id: 'evelyn.ms.m8math.unit-rate-as-slope.v1',
  title: 'Unit Rate as Slope',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.unit-rate-as-slope',
      standard: 'M8MATH-3.1',
      description:
        'Graph a proportional relationship from a table or from y = kx, name the line\'s steepness "slope", and show that slope = rise per 1 unit of run = the unit rate = k (CCSS 8.EE.B.5).',
    },
  ],
  prerequisites: ['m8math.operations-in-scientific-notation'],
  followUps: ['m8math.comparing-proportional-relationships'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Let the student see a proportional relationship as a line that leans, so steepness becomes a thing worth measuring before it is named.',
      script:
        'A game update is downloading at 6 megabytes every second. After 1 second you have 6 megabytes, after 2 seconds 12, after 5 seconds 30. You already know this is proportional with k = 6, because 6 ÷ 1, 12 ÷ 2 and 30 ÷ 5 all give 6. Now plot those points, seconds across and megabytes up, and draw the line through them and through the origin. Look at how it climbs. If the download were crawling at 2 megabytes a second, the line would lean over flat and lazy; at 20 megabytes a second it would shoot up like a wall. That steepness is not decoration. It is a number you can measure right off the graph, it has a name, slope, and by the end of today you will see that it is the same 6 you already computed.',
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-is-the-unit-rate',
      kind: 'concept',
      goal: 'Graph a proportional relationship from a table or from y = kx, define slope as the rise for a run of 1, and show that the slope is the unit rate, which is k.',
      keyIdeas: [
        'GRAPH IT FIRST — a proportional relationship graphs as a straight line through the origin, the test you already own. From a table, plot each (x, y) pair as a point. From an equation such as y = 6x, make your own pairs by choosing x = 0, 1, 2, 3 and multiplying: (0, 0), (1, 6), (2, 12), (3, 18). Either way the points line up, so draw the line through them and through (0, 0).',
        'STEEPNESS HAS A NAME: SLOPE — every straight line leans at one fixed steepness, and that steepness is measured with two moves. The RUN is a move to the right, along the horizontal axis. The RISE is the move straight up that gets you back onto the line. The slope is the rise for a run of exactly 1 unit: step 1 to the right, count how far up you climb to reach the line, and that count is the slope.',
        'THE CLIMB IS THE SAME EVERYWHERE — on the download line y = 6x, stepping right 1 from (0, 0) means climbing 6 to reach (1, 6), and stepping right 1 from (2, 12) means climbing 6 again to reach (3, 18). A straight line has one steepness, so a run of 1 always buys the same rise, no matter where on the line you start.',
        'SLOPE IS THE UNIT RATE IS k — the unit rate asks "how much for 1", and the slope asks "how far up for 1 step right", which is the same question asked of the graph. Six megabytes per second, slope 6, k = 6: three names for one number. Because of that, the point where x = 1 sits at height k, and you can read the slope straight off it.',
        'WHEN x = 1 IS NOT MARKED — if the only point you can read is (4, 24), the rise from the origin is 24 spread across a run of 4, so each single unit of run gets 24 ÷ 4 = 6 of rise. That is the same y ÷ x you already use to find k, and it is not the y-value of the point. The point (4, 24) says that 4 seconds gives 24 megabytes; the slope says how fast.',
        'BIGGER k, STEEPER LINE — a slope of 2 climbs 2 for every step right and a slope of 10 climbs 10, so a larger k makes the line stand up steeper and a smaller k makes it lean flatter. Slope carries the units of the rate: 6 megabytes per second, 12 dollars per hour, 2.5 gallons per minute. Saying the units out loud is how you know you took rise over run and not run over rise.',
      ],
      vocabulary: [
        { term: 'slope', definition: 'the steepness of a line, measured as the rise for a run of exactly 1 unit.' },
        { term: 'run', definition: 'a move to the right along the horizontal axis; in this lesson the run is always 1 unit.' },
        { term: 'rise', definition: 'the move straight up needed to get back onto the line after a run.' },
        { term: 'unit rate', definition: 'the amount that goes with 1 of the other quantity; on a proportional graph it is the slope, and in y = kx it is k.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-table-to-graph-to-slope',
      kind: 'worked_example',
      problem:
        'Nia babysits for a family down the street. Her table: 2 hours earns $24, 3 hours earns $36, and 5 hours earns $60. Graph the relationship and find the slope of the line.',
      steps: [
        'Plot hours across and dollars up: (2, 24), (3, 36), (5, 60). Confirm the relationship is proportional before drawing anything: 24 ÷ 2 = 12, 36 ÷ 3 = 12, 60 ÷ 5 = 12, every row agrees, so the points sit on one straight line through the origin. Draw that line through (0, 0) and the three points.',
        'Measure the steepness with a run of exactly 1. Start at (2, 24) and step right 1 unit, to x = 3. The line is at (3, 36) there, so the rise is 36 - 24 = 12. The slope is 12.',
        'Measure it again somewhere else, to see that the line has only one steepness. From the origin, the point (5, 60) is a rise of 60 across a run of 5, so a single unit of run gets 60 ÷ 5 = 12 of rise. Same 12.',
        'Say the slope with its units: 12 dollars per hour. That is Nia\'s unit rate, and it is the constant of proportionality k, so the equation of the line is y = 12x.',
        'Check by working forward: the equation has to hit every table point. 12 × 2 = 24, 12 × 3 = 36, 12 × 5 = 60. All three match. And the point at x = 1 is (1, 12), sitting at a height equal to the slope, exactly where it should be.',
      ],
      answer: 'Slope 12, meaning 12 dollars per hour; the line is y = 12x',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-equation-to-graph-to-slope',
      kind: 'worked_example',
      problem:
        'A hose fills a kiddie pool at a steady rate, and the relationship is y = 2.5x, where x is minutes and y is gallons in the pool. Graph the relationship and find the slope of the line.',
      steps: [
        'Make points from the equation by choosing x-values and multiplying: x = 0 gives y = 2.5 × 0 = 0, x = 1 gives 2.5, x = 2 gives 5, x = 4 gives 10. So the pairs are (0, 0), (1, 2.5), (2, 5), (4, 10).',
        'Plot minutes across and gallons up. The four points line up on a straight line through the origin, as every y = kx graph does. Draw the line.',
        'Measure the slope with a run of 1: from (0, 0), step right 1 to x = 1 and climb 2.5 to reach (1, 2.5). The slope is 2.5. Try it again from (2, 5): step right 1 to x = 3, where y = 2.5 × 3 = 7.5, so the rise is 7.5 - 5 = 2.5. Same steepness.',
        'WRONG: looking at the point (4, 10) and saying the slope is 10. CORRECT: 10 is the rise for a run of 4, not for a run of 1. Share it out: 10 ÷ 4 = 2.5 per unit of run. The slope is 2.5, and the number 10 is how many gallons are in the pool after 4 minutes.',
        'Say it with units: 2.5 gallons per minute. That is the unit rate, and it is the k already sitting in y = 2.5x. The equation and the graph are saying the same thing, one with a number and one with a lean.',
        'Check by working backward from the slope: 2.5 × 4 = 10 matches (4, 10), and 2.5 × 2 = 5 matches (2, 5). The slope reproduces every point on the line.',
      ],
      answer: 'Slope 2.5, meaning 2.5 gallons per minute, the same number as k in y = 2.5x',
      estimatedMinutes: 3,
    },
    {
      id: 'try-slope-from-marked-point',
      kind: 'try_yourself',
      problem:
        'The graph of a proportional relationship between hours worked, x, and dollars earned, y, is a straight line through the origin and through the point (3, 12). What is the slope of the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4 dollars per hour', correct: true },
        { id: 'b', text: '12 dollars per hour' },
        { id: 'c', text: '0.25 dollars per hour' },
        { id: 'd', text: '9 dollars per hour' },
      ],
      expectedAnswer: '4 dollars per hour',
      hints: [
        'Slope is the rise for a run of exactly 1. The point (3, 12) gives a rise of 12 for a run of 3, so share that rise across the 3 units of run.',
        'Divide the rise by the run, 12 ÷ 3, not the other way around. Check: the point (1, your slope) has to sit on the line, and 3 times your slope has to give 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-step-right-one',
      kind: 'try_yourself',
      problem:
        'The point (2, 10) is on the line y = 5x. You start there, move exactly 1 unit to the right, and then move straight up until you are back on the line. Which point do you land on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(3, 11)' },
        { id: 'b', text: '(2, 15)' },
        { id: 'c', text: '(3, 15)', correct: true },
        { id: 'd', text: '(7, 11)' },
      ],
      expectedAnswer: '(3, 15)',
      hints: [
        'The slope of y = 5x is 5, so a run of 1 always buys a rise of 5. Your x goes up by 1; how much does y go up?',
        'The new x is 3. Put x = 3 into y = 5x to find the height of the line there, and compare it with 10 + 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-slope-from-table',
      kind: 'try_yourself',
      problem:
        'A streaming app uses data at a steady rate: 4 hours uses 6 gigabytes, 6 hours uses 9 gigabytes, and 10 hours uses 15 gigabytes. Graphed with hours across and gigabytes up, the points lie on a straight line through the origin. What is the slope of that line, in gigabytes per hour? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '1.5',
      hints: [
        'Slope is the rise for a run of 1, and every row of a proportional table gives the same y ÷ x.',
        'Use the easiest row: a rise of 6 gigabytes across a run of 4 hours, so 6 ÷ 4. Check that the other two rows give the same number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-y-value-and-run-over-rise',
      kind: 'misconception_check',
      question:
        'The graph of a proportional relationship goes through the origin and through the point (5, 20). Ava says the slope is 20. Ben says the slope is 0.25. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'slope = 20',
          misconception: 'Reading the y-coordinate of the one marked point as the slope, which only works when that point is at x = 1.',
          correctsTo:
            'The point (5, 20) says a run of 5 comes with a rise of 20, so one unit of run gets 20 ÷ 5 = 4 of rise. The slope is 4. Check it: stepping right 1 from the origin on this line lands on (1, 4), and 4 × 5 = 20 puts (5, 20) on the line. A slope of 20 would put (5, 100) on the line, nowhere near the marked point.',
        },
        {
          answer: 'slope = 0.25',
          misconception: 'Putting run over rise, 5 ÷ 20, so the rate comes out upside down.',
          correctsTo:
            'Slope is rise over run, the climb for a single step to the right: 20 ÷ 5 = 4, not 5 ÷ 20. A slope of 0.25 would mean the line climbs only a quarter of a unit for each step right, an almost flat line, when this one climbs 20 units in 5 steps. Saying the units catches it: 4 units up per 1 unit right.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A proportional relationship graphs as a straight line through the origin. Plot the table, or make points from y = kx, and draw the line.',
        'Slope is the steepness of the line: the rise for a run of exactly 1 unit. Step right 1, count up to the line.',
        'A straight line has one slope. A run of 1 buys the same rise from any point on the line.',
        'Slope = unit rate = k. Three names, one number, and the point at x = 1 sits at height k.',
        'If the marked point is not at x = 1, divide rise by run: (4, 24) gives 24 ÷ 4 = 6. Never read the y-value alone, and never put run over rise.',
        'Slope carries the units of the rate: 6 megabytes per second, 12 dollars per hour, 2.5 gallons per minute.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Unit Rate as Slope' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
