/**
 * Grade 8 Math — Linear Functions as Models: Rate of Change & Initial Value
 * from Tables & Graphs.
 *
 * PROCEDURE-LED. The student already owns y = mx + b as the shape of a line
 * and can read m and b off a graph that shows where the line crosses the
 * y-axis. What is new is that the crossing is hidden: the table does not
 * start at x = 0, or the graph's window starts to the right of the y-axis, or
 * all that is given is two (x, y) values (CCSS 8.F.B.4). The concept segment
 * is a short ordered recipe: pick any two rows or points and divide the
 * change in y by the change in x to get m; if a row with x = 0 is there, read
 * b from it, and if it is not, back b out from one row as b = y - mx; write
 * y = mx + b; check with a row that was not used. Both worked examples run
 * the same moves (one from a table with x stepping by 3, one from a graph
 * whose window hides the y-axis and whose slope is negative), and every
 * equation is checked against a spare row. Two traps this plan is built to
 * kill: taking the jump in y as the rate when x jumps by more than 1, and
 * taking the first row's y (or the first point you can see) as b when that
 * row is not x = 0.
 *
 * SCOPE GUARD: Grade 8 row 7.1 determines m (Δy/Δx from any two rows or
 * points) and b (read at x = 0, or backed out as b = y - mx when x = 0 is
 * absent) from a table, a graph, or two given (x, y) values, and writes
 * y = mx + b. Distinct from row 3.4, which reads m and b off a graph that
 * shows the intercept; every case here hides it. Withholds: point-slope form
 * → `alg1-u4-point-slope-standard-form.ts`; `alg1-u4-slope-rate-of-change.ts`
 * repeats slope-from-two-points as HS review. Concretely: no worked example
 * or try_yourself in this plan hands the student a row with x = 0 or a graph
 * that shows the y-axis crossing, so b is backed out from a row every time;
 * the "read it at x = 0" case is stated in the concept and the recap as the
 * easy case the recipe covers and is never an item. Slope from two points
 * (rise over
 * run, including negative slopes) is row 3.3 ground and y = mx + b with b as
 * the y-axis crossing is row 3.4 ground; both are recalled in a sentence and
 * used as steps, never re-taught, and no slope is ever classified as zero or
 * undefined and no line is horizontal or vertical. Every m in this plan is
 * an integer or a terminating decimal. Sideways: no equation here is built
 * from a sentence that names the fee and the rate in words (row 7.2) — every
 * rate and starting value is computed from numbers in a table, on a graph, or
 * in two given pairs; and while each answer is read back into its story in a
 * sentence so the numbers stay anchored, interpreting m and b with units,
 * predicting an output, and solving for an input are row 7.3's objectives
 * and are never a worked step or an item here. The word "function" is used
 * and f(x) never is. Below, assumed and not re-taught: unit rates and the
 * constant of proportionality (`m7math-u3-*`). Salvage note: the brief
 * pointed at the equation-from-a-table example in
 * `g8-math-slope-linear-functions.ts`, but that file has no table example;
 * only the shape of its back-out step (10 = -3(2) + b, so b = 16) was used.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U7_RATE_OF_CHANGE_AND_INITIAL_VALUE_FROM_TABLES_AND_GRAPHS: LessonPlan = {
  id: 'evelyn.ms.m8math.rate-of-change-and-initial-value-from-tables-and-graphs.v1',
  title: 'Rate of Change & Initial Value from Tables & Graphs',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.rate-of-change-and-initial-value-from-tables-and-graphs',
      standard: 'M8MATH-7.1',
      description:
        'Determine m (Δy/Δx from any two rows or points) and b (read at x = 0, or back it out as b = y - mx when x = 0 is absent) from a table, a graph, or two given (x, y) values, and write y = mx + b (CCSS 8.F.B.4).',
    },
  ],
  prerequisites: ['m8math.volume-of-cylinders-cones-and-spheres'],
  followUps: ['m8math.constructing-linear-models-from-descriptions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hide the starting value behind two receipts, so the student feels why reading b off the picture is no longer an option.',
      script:
        'The laser tag place charges a flat fee for the vest and then a set price per game, but the sign is missing and all you have is two receipts from last weekend. Two games cost $14. Five games cost $26. You want to know two numbers: the price of one game, and the vest fee you pay before you play anything. Nobody ever bought zero games, so the fee is not written anywhere. Here is the thing: it is still in the receipts, hiding. Three extra games cost $12 more, so a game is $4, and if two games are $8 of the $14, the other $6 has to be the vest. That is the whole lesson. Any two rows of a table, or any two points on a line, give you the rate, and then one row gives you the starting value, even when x = 0 is nowhere in sight.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-rows-then-back-out',
      kind: 'concept',
      goal: 'Install the recipe for m from any two rows or points and b backed out from one row, and make the check against a spare row a habit.',
      keyIdeas: [
        'THE SHAPE YOU ARE HUNTING FOR IS y = mx + b — you already know it from reading lines off a graph. m is the rate of change, how much y goes up or down when x goes up by 1, and b is the initial value, what y is when x = 0. In the laser tag story m is the price of one game and b is the vest fee. Today the rows and the picture stop handing you b, so you learn to dig both numbers out.',
        'm COMES FROM ANY TWO ROWS OR POINTS — pick two rows, subtract the y-values, subtract the x-values in the SAME order, and divide: m = (change in y) ÷ (change in x). From the rows (2, 14) and (5, 26), m = (26 - 14) ÷ (5 - 2) = 12 ÷ 3 = 4. The rows do not have to be next to each other, because on a line every pair of points gives the same slope, the fact you argued with slope triangles.',
        'DIVIDE, DO NOT JUST READ THE JUMP — when a table steps x by 1, the jump in y is the rate. When it steps x by 3, the jump in y is three rates stacked together. In the laser tag table y jumps by 12 while x jumps by 3, so the rate is 12 ÷ 3 = 4, not 12. Always look at how far x moved before you trust the jump in y.',
        'IF A ROW HAS x = 0, b IS SITTING RIGHT THERE — the initial value is the y-value when x = 0, so a table row (0, something) or the point where the line crosses the y-axis hands you b with no work. Most tables in this lesson do not start at 0, and the graphs are cut off before the y-axis, so this easy case is rare here.',
        'IF x = 0 IS MISSING, BACK b OUT FROM ONE ROW — take any row you trust, multiply m by its x, and subtract that from its y: b = y - mx. Using the row (2, 14) with m = 4: b = 14 - 4 × 2 = 14 - 8 = 6. The row (5, 26) works too: 26 - 4 × 5 = 26 - 20 = 6. Same b either way, which is how you know the line really passes through both rows.',
        'WRITE THE EQUATION AND CHECK WITH A SPARE ROW — put the two numbers in place: y = 4x + 6. Then plug in a row you did NOT use for b. If the table also says (8, 38), check 4 × 8 + 6 = 32 + 6 = 38. It matches, so the equation is right. If it did not match, the first place to look is whether you divided by the change in x.',
      ],
      vocabulary: [
        { term: 'rate of change', definition: 'the number m in y = mx + b; how much y changes each time x goes up by 1, found as (change in y) ÷ (change in x) between any two rows or points.' },
        { term: 'initial value', definition: 'the number b in y = mx + b; the value of y when x = 0, whether it is written in the table or has to be backed out.' },
        { term: 'back out', definition: 'find a hidden number by undoing the arithmetic around it; b = y - mx backs the initial value out of one row once m is known.' },
      ],
      suggestedTools: ['show_table', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-laser-tag-table',
      kind: 'worked_example',
      problem:
        'The laser tag table lists games played and total cost in dollars. Games: 2, 5, 8. Cost: 14, 26, 38. Write the equation for the cost y of x games.',
      steps: [
        'Find m from two rows. Take (2, 14) and (5, 26). Change in y: 26 - 14 = 12. Change in x: 5 - 2 = 3. So m = 12 ÷ 3 = 4.',
        'Confirm with a different pair, because on a line every pair must agree. From (5, 26) to (8, 38): change in y is 38 - 26 = 12, change in x is 8 - 5 = 3, and 12 ÷ 3 = 4 again.',
        'Look for x = 0. The table starts at 2 games, so nobody paid for zero games and b is not written down. Back it out from one row.',
        'Use the row (2, 14): b = y - mx = 14 - 4 × 2 = 14 - 8 = 6.',
        'Write the equation: y = 4x + 6.',
        'Check with the row you have not touched yet, (8, 38): 4 × 8 + 6 = 32 + 6 = 38. It matches. Read it back into the story: each game costs $4 and the vest fee is $6.',
      ],
      answer: 'y = 4x + 6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-battery-graph',
      kind: 'worked_example',
      problem:
        'A graph shows a phone battery during a video call, with minutes on the horizontal axis and battery percent on the vertical axis. The horizontal axis starts at 5 minutes, not 0, so the line runs off the left edge before it reaches the y-axis. Two points sit exactly on grid crossings: (10, 70) and (30, 40). Write the equation of the line.',
      steps: [
        'Find m from the two points. Change in y: 40 - 70 = -30. Change in x: 30 - 10 = 20. So m = -30 ÷ 20 = -1.5. The line falls, so a negative rate is exactly what you expect: the battery drops 1.5 percent every minute.',
        'WRONG: subtracting in mixed order, (70 - 40) ÷ (30 - 10) = 30 ÷ 20 = 1.5, and calling the rate positive. CORRECT: whichever point you start from for y, start from the same point for x. (70 - 40) ÷ (10 - 30) = 30 ÷ (-20) = -1.5, the same answer as before. A falling line always gets a negative m.',
        'Look for x = 0. The picture starts at 5 minutes, so the y-axis crossing is not on the page. WRONG: taking the first point you can see, (10, 70), and calling 70 the initial value. CORRECT: 70 is the battery at 10 minutes, not at 0 minutes. Back b out.',
        'Use the point (10, 70): b = y - mx = 70 - (-1.5) × 10 = 70 - (-15) = 70 + 15 = 85.',
        'Write the equation: y = -1.5x + 85.',
        'Check with the other point, (30, 40): -1.5 × 30 + 85 = -45 + 85 = 40. It matches. Read it back: the call started with the battery at 85 percent, and the phone loses 1.5 percent a minute.',
      ],
      answer: 'y = -1.5x + 85',
      estimatedMinutes: 3,
    },
    {
      id: 'try-table-equation',
      kind: 'try_yourself',
      problem: 'A table lists x: 2, 4, 6 and y: 11, 17, 23. Which equation fits the table?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 3x + 5', correct: true },
        { id: 'b', text: 'y = 6x - 1' },
        { id: 'c', text: 'y = 3x + 11' },
        { id: 'd', text: 'y = 3x - 5' },
      ],
      expectedAnswer: 'y = 3x + 5',
      hints: [
        'Between the first two rows, y goes up by 6 while x goes up by 2. The rate is the change in y divided by the change in x, not the change in y by itself.',
        'With m = 3, back b out from the row (2, 11): b = 11 - 3 × 2. Then check your equation against the row (6, 23).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-graph-hidden-intercept',
      kind: 'try_yourself',
      problem:
        'A graph shows the rank points in an online game against matches played. The horizontal axis runs from 10 to 60 matches, so the y-axis is not in the picture. The line passes through the grid points (20, 340) and (50, 490). Which equation is the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 5x + 340' },
        { id: 'b', text: 'y = 5x - 240' },
        { id: 'c', text: 'y = 5x + 240', correct: true },
        { id: 'd', text: 'y = 0.2x + 240' },
      ],
      expectedAnswer: 'y = 5x + 240',
      hints: [
        'Rate first: the change in y is 490 - 340 and the change in x is 50 - 20. Put the change in y on top.',
        'The first point you can see is at 20 matches, not 0 matches, so its y-value is not b. Back b out: b = 340 - m × 20, and make sure you subtract in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-dog-walking-fee',
      kind: 'try_yourself',
      problem:
        'A dog-walking job pays a flat show-up fee plus the same amount for each dog. Walking 3 dogs pays $23 and walking 7 dogs pays $43. What is the show-up fee, the initial value b, in dollars? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Treat the two facts as the points (3, 23) and (7, 43). Find m first: the change in pay divided by the change in dogs.',
        'With m = 5, back b out from (3, 23): b = 23 - 5 × 3. Check by plugging b and m into the other point, (7, 43).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-jump-as-rate-and-first-row-as-b',
      kind: 'misconception_check',
      question:
        'A table lists x: 5, 10, 15 and y: 22, 37, 52. Theo writes y = 15x + 22. Nadia writes y = 3x + 22. Check each equation against the row (10, 37). What went wrong in each case?',
      commonErrors: [
        {
          answer: 'y = 15x + 22',
          misconception: 'Taking the jump in y, 15, as the rate without dividing by the jump in x, which is 5, and then taking the first row\'s y as b.',
          correctsTo:
            'y jumps by 15 while x jumps by 5, so the rate is 15 ÷ 5 = 3, not 15. Then b is backed out from the row (5, 22): b = 22 - 3 × 5 = 22 - 15 = 7, so the equation is y = 3x + 7. The check exposes the slip: for x = 10, Theo\'s equation gives 15 × 10 + 22 = 172, nowhere near 37, while 3 × 10 + 7 = 37 matches.',
        },
        {
          answer: 'y = 3x + 22',
          misconception: 'Getting m = 3 correctly, then treating the first row\'s y-value, 22, as the initial value even though that row is x = 5, not x = 0.',
          correctsTo:
            'The initial value is y when x = 0, and this table starts at x = 5, so 22 is the value five steps in, not the start. Back b out: b = 22 - 3 × 5 = 7, so the equation is y = 3x + 7. The check catches it too: for x = 10, Nadia\'s equation gives 3 × 10 + 22 = 52, but the table says 37, while 3 × 10 + 7 = 37 matches. Both students needed the same habit: after writing the equation, test it on a row you did not use.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every linear function is y = mx + b: m is the rate of change and b is the initial value, the y when x = 0.',
        'm comes from any two rows or points: (change in y) ÷ (change in x), subtracting in the same order both times. A falling line gets a negative m.',
        'When x steps by more than 1, divide. The jump in y alone is not the rate.',
        'If a row has x = 0, read b from it. If not, back it out from one row: b = y - mx.',
        'The first row of a table, or the first point you can see on a graph, is not b unless its x is 0.',
        'Write y = mx + b, then check it against a row you did not use.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Rate of Change & Initial Value from Tables & Graphs' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
