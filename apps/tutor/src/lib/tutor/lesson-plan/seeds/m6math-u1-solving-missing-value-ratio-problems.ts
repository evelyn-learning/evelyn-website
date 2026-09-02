/**
 * Grade 6 Math — Understanding Ratios & Rates: Solving Missing-Value Ratio
 * Problems.
 *
 * PROCEDURE-LED lesson for the m6math fan-out, row 1.3. Row 1.2 already
 * taught the student to build a ratio table, tape diagram, or double number
 * line and fill it with equivalent ratios; this lesson turns that same table
 * into a tool for finding ONE missing value by reasoning about the scale
 * factor that connects a known pair to the target pair, then plots the known
 * and newly-found pairs as points on the coordinate plane (CCSS 6.RP.A.3a).
 * The one trap this plan is built to kill: reaching for addition instead of
 * multiplication when a quantity in the table needs to change size.
 *
 * SCOPE GUARD: Row 1.3 takes the ratio tables and double number lines that
 * row 1.2 already knows how to build and uses them to solve for ONE missing
 * value in a ratio, then plots the known and completed pairs as points on the
 * coordinate plane. It never reduces a ratio to a rate for a single unit and
 * never compares unit prices — computing and using a unit rate is row 1.4.
 * Every quantity and every plotted point here is nonnegative and stays in the
 * first quadrant; signed coordinates and reflecting a point across an axis
 * begin in Unit 6. The plotted points from one ratio happen to line up in a
 * straight path, and the lesson lets a student notice that pattern, but it
 * never names it a proportional relationship, assigns it a constant of
 * proportionality, or writes an equation such as y = kx — that formal step is
 * Grade 7 (m7math U3) and does not appear here. Every scale factor in this
 * plan is found by multiplying or dividing, never by adding or subtracting a
 * constant amount, since that additive shortcut is exactly the misconception
 * the lesson is built to catch.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U1_SOLVING_MISSING_VALUE_RATIO_PROBLEMS: LessonPlan = {
  id: 'evelyn.ms.m6math.solving-missing-value-ratio-problems.v1',
  title: 'Solving Missing-Value Ratio Problems',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.solving-missing-value-ratio-problems',
      standard: 'M6MATH-1.3',
      description:
        'Use a ratio table or double number line to find a missing value in a set of equivalent ratios, and plot the known and computed ratio pairs on the coordinate plane (CCSS 6.RP.A.3a).',
    },
  ],
  prerequisites: ['m6math.representing-ratios-with-tables-and-diagrams'],
  followUps: ['m6math.unit-rates-and-unit-pricing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that a ratio table can answer a question it was never explicitly given the answer to.',
      script:
        'Sam is making friendship bracelets for the school craft fair. Every bracelet uses the same pattern: 3 red beads for every 5 blue beads. Sam already knows how to build a table of matching pairs for that pattern. But today a friend asks a harder question: "I have exactly 12 red beads left. How many blue beads do I need so the pattern still comes out right?" Nobody handed Sam that pair of numbers. Today you learn how to find a missing value like that one yourself, using the same table you already know how to build, and how to show that pair as a point on a graph.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scale-factor-and-plotting',
      kind: 'concept',
      goal: 'Install scale-factor reasoning as the way to fill a missing value in a ratio table, and connect each completed pair to a point on the coordinate plane.',
      keyIdeas: [
        'A RATIO TABLE LINES UP EQUIVALENT PAIRS — every column in the table names the same ratio using different numbers. If the top row is red beads and the bottom row is blue beads, every column still means 3 red beads for every 5 blue beads.',
        'FIND THE SCALE FACTOR FIRST — to fill in a missing value, first figure out what number the known quantity was multiplied or divided by to reach the new column. That single number is the scale factor, and it must be applied to the OTHER quantity in that same column too.',
        'MULTIPLY OR DIVIDE, NEVER ADD OR SUBTRACT — a ratio only stays equivalent when both quantities are scaled by the same factor. Adding the same amount to both numbers, instead of multiplying by the same factor, changes the ratio, even though it feels like a fair thing to do.',
        'A DOUBLE NUMBER LINE SHOWS THE SAME IDEA SIDE BY SIDE — two lines, lined up so that marks directly above and below each other are equivalent pairs. Sliding to a new mark on the top line and reading the mark lined up beneath it gives the missing partner value.',
        'EVERY RATIO PAIR IS A POINT ON THE COORDINATE PLANE — put the first quantity on the x-axis and the second quantity on the y-axis. Each pair of numbers from the ratio table, written as an ordered pair (x, y), becomes one point. Plotting several pairs from the same ratio produces points that line up in a straight path, though it takes later work to say more than that about why.',
        'CHECK BY WORKING BACKWARD — after finding a missing value, divide the new pair back down by the same scale factor. The result should land exactly back on the original ratio. If it does not, the scale factor was applied to the wrong number or found incorrectly.',
      ],
      vocabulary: [
        { term: 'scale factor', definition: 'the number a known quantity is multiplied or divided by to reach a new, equivalent quantity in the same ratio.' },
        { term: 'equivalent ratios', definition: 'ratios that describe the same relationship between two quantities using different pairs of numbers, such as 3:5 and 12:20.' },
        { term: 'ordered pair', definition: 'two numbers written as (x, y) that give the location of one point on the coordinate plane.' },
        { term: 'coordinate plane', definition: 'a flat grid formed by a horizontal x-axis and a vertical y-axis, used to plot ordered pairs as points.' },
      ],
      suggestedTools: ['show_table', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bracelet-beads',
      kind: 'worked_example',
      problem:
        'Sam\'s bracelet pattern uses 3 red beads for every 5 blue beads. Sam has 12 red beads. How many blue beads are needed to keep the same pattern? Then plot both ratio pairs on the coordinate plane, with red beads on the x-axis and blue beads on the y-axis.',
      steps: [
        'Set up a ratio table with the known pattern in the first column: red beads 3, blue beads 5.',
        'The new red bead count, 12, goes in the next column. Find the scale factor that turns 3 into 12: 12 divided by 3 is 4.',
        'Apply that same scale factor, 4, to the blue beads: 5 times 4 is 20.',
        'The completed column is red beads 12, blue beads 20.',
        'Check by working backward: divide the new column by the scale factor, 4. 12 divided by 4 is 3, and 20 divided by 4 is 5. That lands right back on the original pattern, 3 to 5, so the answer holds.',
        'Plot both pairs on the coordinate plane as ordered pairs: (3, 5) and (12, 20).',
      ],
      answer: '20 blue beads; the ordered pairs (3, 5) and (12, 20) are plotted on the coordinate plane.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trail-mix-mini-batch',
      kind: 'worked_example',
      problem:
        'A trail mix recipe uses 4 cups of oats for every 10 cups of mixed nuts. For a mini batch, only 2 cups of oats are used. How many cups of nuts are needed to keep the same recipe? Then plot both ratio pairs on the coordinate plane, with oats on the x-axis and nuts on the y-axis.',
      steps: [
        'Set up the ratio table with the full recipe in the first column: oats 4, nuts 10.',
        'The mini batch uses 2 cups of oats. Find the scale factor that turns 4 into 2: 2 divided by 4 is one half.',
        'Apply that same scale factor, one half, to the nuts: 10 times one half is 5.',
        'WRONG: subtracting the same amount, 2, from both numbers instead, giving oats 4 minus 2 equals 2 and nuts 10 minus 2 equals 8. That produces the ratio 2 to 8, which simplifies to 1 to 4 — a different recipe, not the same one scaled down. CORRECT: multiply both numbers by the same scale factor, one half, giving oats 2 and nuts 5, which is 2 to 5 — the same recipe as 4 to 10, just a smaller batch.',
        'Check by working backward: multiply the mini batch back up by 2 (the flip side of scaling by one half). 2 times 2 is 4 and 5 times 2 is 10, which matches the original recipe exactly.',
        'Plot both pairs on the coordinate plane as ordered pairs: (4, 10) and (2, 5).',
      ],
      answer: '5 cups of nuts; the ordered pairs (4, 10) and (2, 5) are plotted on the coordinate plane.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fruit-punch',
      kind: 'try_yourself',
      problem:
        'A fruit punch recipe uses 3 cups of juice for every 4 cups of soda. Zara wants to use 9 cups of juice. How many cups of soda does she need to keep the same ratio?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12 cups', correct: true },
        { id: 'b', text: '10 cups' },
        { id: 'c', text: '27 cups' },
        { id: 'd', text: '3 cups' },
      ],
      expectedAnswer: '12 cups',
      hints: [
        'Find the scale factor first: what number does 3 (juice) turn into 9? Apply that same number to the soda amount.',
        'The scale factor is 9 divided by 3, which is 3. Multiply the soda amount, 4, by that scale factor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-field-trip-vans',
      kind: 'try_yourself',
      problem: 'Each van on a field trip seats 6 students. Keeping that same ratio, how many students fit in 5 vans?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '10 students' },
        { id: 'b', text: '36 students' },
        { id: 'c', text: '30 students', correct: true },
        { id: 'd', text: '6 students' },
      ],
      expectedAnswer: '30 students',
      hints: [
        'The ratio is 1 van to 6 students. Find the scale factor that turns 1 van into 5 vans, then apply it to the students.',
        'The scale factor is 5. Multiply 6 students by 5 — do not just repeat the 6, and do not add the number of vans to it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-bracelet-scale-up',
      kind: 'try_yourself',
      problem:
        'Sam\'s bracelet pattern still uses 3 red beads for every 5 blue beads. This time Sam has 21 red beads. How many blue beads are needed to keep the same pattern? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '35',
      hints: [
        'Find the scale factor that turns 3 red beads into 21 red beads, then apply that same scale factor to the blue beads.',
        'The scale factor is 21 divided by 3, which is 7. Multiply the blue bead amount, 5, by 7.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-additive-and-shortcut-scaling',
      kind: 'misconception_check',
      question:
        'A cookie recipe uses 2 cups of flour for every 3 cups of sugar. Mia wants to scale the recipe up to use 8 cups of flour. One friend tells her to use 9 cups of sugar. Another friend tells her to use 24 cups of sugar. What went wrong in each case, and how much sugar should Mia actually use?',
      commonErrors: [
        {
          answer: '9 cups of sugar',
          misconception:
            'Using additive reasoning: the flour amount grew by 6 (from 2 to 8), so this friend added that same amount, 6, to the sugar (3 plus 6 equals 9), instead of scaling both numbers by the same factor.',
          correctsTo:
            'A ratio stays equivalent only when both quantities are multiplied by the same scale factor, not when the same amount is added to both. The scale factor from 2 to 8 is 8 divided by 2, which is 4. Multiply the sugar, 3, by that same factor: 3 times 4 is 12 cups of sugar.',
        },
        {
          answer: '24 cups of sugar',
          misconception:
            'Skipping the scale-factor step and multiplying the original sugar amount directly by the new flour amount: 3 times 8 equals 24, instead of first finding how many times bigger the new flour amount is.',
          correctsTo:
            'The new flour amount, 8, is not the scale factor — it has to be compared to the original flour amount first. Divide 8 by 2 to get the scale factor, 4, and only then multiply the sugar by it: 3 times 4 is 12 cups of sugar. Checking backward confirms it: 12 divided by 4 is 3, and 8 divided by 4 is 2, which matches the original recipe, 2 to 3.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A ratio table or double number line shows pairs of numbers that all describe the same ratio.',
        'To find a missing value, first find the scale factor: the number the known quantity was multiplied or divided by to reach its matching partner.',
        'Apply that same scale factor to the other quantity in the same column — never add or subtract the same amount, since that changes the ratio.',
        'Check every answer by working backward: dividing (or multiplying) the new pair by the scale factor should land exactly back on the original ratio.',
        'Each pair of values from the table becomes one point on the coordinate plane, written as an ordered pair (x, y), with the first quantity on the x-axis and the second on the y-axis.',
        'Points plotted from the same ratio line up in a straight path, though naming that pattern with an equation comes in a later course.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Solving Missing-Value Ratio Problems' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
