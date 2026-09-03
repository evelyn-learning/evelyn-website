/**
 * Grade 8 Math — Functions & Volume: Linear vs Nonlinear Functions.
 *
 * CONCEPT-LED (row 6.2). The student arrives owning the function test from
 * row 6.1 and slope as rise over run from Unit 3; what is new is a single
 * mental model, that a function is linear exactly when its rate of change is
 * the same between every pair of neighboring rows, and that every such
 * function is a member of one family, y = mx + b, whose graph is a straight
 * line (CCSS 8.F.A.3). The rest of the lesson is built to make the model
 * survive its usual misreadings: "it goes up steadily" is not the test,
 * "it doubles each time" is not a constant rate, a table with uneven x-steps
 * must be divided rather than eyeballed, and a "+ 3" at the end of a rule
 * does not cancel an exponent on x. The counter-examples the standard itself
 * names, A = s² with (1, 1), (2, 4), (3, 9) and y = x³, are produced as
 * tables, plotted, and shown to bend, with the third point of A = s² sitting
 * above the line a student would draw through the first two.
 *
 * SCOPE GUARD: Grade 8 recognizes y = mx + b as the linear family whose
 * graph is a straight line; tests a table for a constant rate of change;
 * produces and plots nonlinear counter-examples (A = s² with (1,1), (2,4),
 * (3,9); y = x³); numeric item computes a table's rate of change or the
 * y-value that breaks linearity. Withholds: exponential and quadratic
 * families as named objects -> `alg1-u6-exponential-functions.ts`,
 * `alg1-u8-quadratic-graphs-vertex.ts`. Concretely: the words "quadratic",
 * "exponential", "parabola" and "growth" never appear; A = s², y = x³ and the
 * doubling table 2, 4, 8, 16 are described only as "not linear", with their
 * changing rates shown, and are never named as families or given a formula
 * beyond the one the standard states. Sideways: the function definition and
 * the repeated-input test are row 6.1, assumed and never re-run here; the
 * plan never compares two functions (row 6.3) and never derives m and b from
 * a table to write a line's equation (row 7.1) — where an equation is
 * mentioned beside a table, the equation is GIVEN and the student only checks
 * that it fits, and the rate of change is computed only to test whether it is
 * constant, never to build y = mx + b. The line's steepness is named "slope"
 * and "rate of change" without re-teaching either. Below, assumed and not
 * re-taught: proportional vs linear-but-not-proportional
 * (`m7math-u3-proportional-relationships.ts`), plotting points (`m6math` row
 * 6.1). Negative rates, decimal coefficients and b = 0 all appear, on
 * purpose, as members of the linear family that students wrongly reject.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U6_LINEAR_VS_NONLINEAR_FUNCTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.linear-vs-nonlinear-functions.v1',
  title: 'Linear vs Nonlinear Functions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.linear-vs-nonlinear-functions',
      standard: 'M8MATH-6.2',
      description:
        'Recognize y = mx + b as the linear family whose graph is a straight line; test a table for a constant rate of change; produce and plot nonlinear counter-examples (A = s² with (1,1), (2,4), (3,9); y = x³) (CCSS 8.F.A.3).',
    },
  ],
  prerequisites: ['m8math.identifying-functions'],
  followUps: ['m8math.comparing-functions-in-different-representations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a straight-line table and a bending table side by side so the student feels the difference between a steady rate and a changing one before either is named.',
      script:
        'Noah walks dogs for $15 a walk. One walk is $15, two walks are $30, three walks are $45, four walks are $60. Every extra walk adds the same $15, so if you plot his money it climbs in a perfectly straight line. His sister Leah is tiling a square patio with one-foot tiles. A patio 1 foot on a side needs 1 tile, 2 feet needs 4, 3 feet needs 9, and 4 feet needs 16. Both tables go up. But look at how much they go up by: Noah adds 15, then 15, then 15, and Leah adds 3, then 5, then 7. Plot Leah\'s points and they do not line up; the graph bends upward and gets steeper as it goes. Noah\'s money is a linear function and Leah\'s tile count is not, and today you learn the one thing that decides which is which: whether the rate of change stays the same.',
      suggestedTools: ['show_table', 'show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-constant-rate-and-the-family',
      kind: 'concept',
      goal: 'Name y = mx + b as the linear family, reduce linearity to one test on a table, and show why A = s² and y = x³ fail it in the equation, the table and the graph.',
      keyIdeas: [
        'THE LINEAR FAMILY IS y = mx + b — every rule you can write as a number times x, plus a number, is a linear function: y = 3x + 2, y = -4x + 20, y = 0.5x, y = 15x. The m is the slope you already measure as rise over run, and b is the height where the line crosses the y-axis. The m may be negative or a decimal, and b may be 0, and the rule is still in the family. Graph any member of the family and you get a straight line, every time.',
        'LINEAR MEANS A CONSTANT RATE OF CHANGE — the rate of change is the change in y divided by the change in x between two rows of a table. In Noah\'s table every x-step is 1 walk and every y-step is $15, so the rate is 15 ÷ 1 = 15 in every row. A function is linear exactly when that rate comes out the same between EVERY pair of neighboring rows, not just the first two. Check all of them; a table can start straight and bend later.',
        'UNEVEN x-STEPS MEAN YOU MUST DIVIDE — a table with x-values 0, 2, 5 and y-values 4, 10, 19 has y-changes of 6 and then 9, which look uneven. The x-steps are uneven too, 2 and then 3, so divide: 6 ÷ 2 = 3 and 9 ÷ 3 = 3. Same rate, so this table IS linear. Comparing the y-changes alone only works when every x-step is the same size.',
        'NONLINEAR MEANS THE RATE KEEPS CHANGING — the area of a square is A = s². Side lengths 1, 2, 3, 4 give areas 1, 4, 9, 16, so the pairs are (1, 1), (2, 4), (3, 9), (4, 16), and the changes are 3, then 5, then 7. The rate grows every row, so A = s² is not linear. The same happens with y = x³: inputs 1, 2, 3 give 1, 8, 27, with changes 7 and then 19. There is no single m for a table like that, so no y = mx + b can describe it.',
        'THE EXPONENT ON x IS THE GIVEAWAY IN AN EQUATION — in y = mx + b the x is plain; it is never squared, cubed, or multiplied by another x. So y = x² + 3 is nonlinear even though it ends in + 3, because the x is squared. And y = -2x is linear even though nothing is added, because the x is plain and b is simply 0. Read the x first, then the rest.',
        'PLOT IT AND LOOK — a linear table\'s points line up along one straight line that a ruler could cover. Plot (1, 1), (2, 4), (3, 9) and they climb faster and faster: a straight line through the first two points rises 3 per step and would reach (3, 7), but the real third point is (3, 9), sitting above that line. A graph that bends is the picture of a rate that changes; a straight line is the picture of a rate that does not.',
      ],
      vocabulary: [
        { term: 'linear function', definition: 'a function that can be written as y = mx + b, with x plain; its rate of change is constant and its graph is a straight line.' },
        { term: 'nonlinear function', definition: 'a function whose rate of change is not constant; its points do not lie on one straight line, and its rule cannot be written as y = mx + b.' },
        { term: 'rate of change', definition: 'the change in y divided by the change in x between two rows of a table or two points on a graph; for a linear function it is the same everywhere and equals the slope m.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-tables',
      kind: 'worked_example',
      problem:
        'Decide whether each table shows a linear function. Table A: x-values 1, 2, 3, 4 with y-values 7, 11, 15, 19. Table B: x-values 1, 2, 3, 4 with y-values 3, 6, 11, 18.',
      steps: [
        'Both tables have x-steps of 1, so the test is whether the y-values change by the same amount in every row.',
        'Table A: 11 - 7 = 4, then 15 - 11 = 4, then 19 - 15 = 4. Every change is 4 and every x-step is 1, so the rate of change is 4 ÷ 1 = 4 in every row. Table A is linear.',
        'You can see the rule fits without needing to find it: the equation y = 4x + 3 gives 4 × 1 + 3 = 7, 4 × 2 + 3 = 11, 4 × 3 + 3 = 15, and 4 × 4 + 3 = 19, every row of Table A. But the constant rate was already the whole answer; the equation is just a member of the y = mx + b family showing up where a constant rate lives.',
        'Table B: 6 - 3 = 3, then 11 - 6 = 5, then 18 - 11 = 7. The changes are 3, 5, 7, and they are not the same, so there is no single rate. Table B is not linear.',
        'WRONG: saying Table B is linear because y goes up in every row. CORRECT: going up is not the test. The rate from row 1 to row 2 is 3, and the rate from row 3 to row 4 is 7, so the table gets steeper as it goes, and its points bend instead of lining up. Only going up by the SAME amount every row makes a table linear.',
        'Check by plotting. Table A gives (1, 7), (2, 11), (3, 15), (4, 19), and a ruler laid on the first two points covers all four. Table B gives (1, 3), (2, 6), (3, 11), (4, 18), and a line through the first two points, rising 3 per step, would reach (3, 9) and (4, 12), while the real points sit at 11 and 18, higher and higher above it.',
      ],
      answer: 'Table A is linear (rate of change 4 in every row); Table B is not linear (changes of 3, 5, 7)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-produce-and-plot-counterexamples',
      kind: 'worked_example',
      problem:
        'Make a table for the area of a square, A = s², using side lengths 1, 2, 3, 4, and plot the points. Then do the same for y = x³ using inputs 0, 1, 2, 3. Show that neither function is linear.',
      steps: [
        'A = s²: side 1 gives 1 × 1 = 1, side 2 gives 2 × 2 = 4, side 3 gives 3 × 3 = 9, side 4 gives 4 × 4 = 16. The pairs are (1, 1), (2, 4), (3, 9), (4, 16).',
        'Test the rate of change. The s-steps are all 1, and the changes in A are 4 - 1 = 3, then 9 - 4 = 5, then 16 - 9 = 7. Three different rates, so A = s² is not linear.',
        'Plot the four points. They climb faster and faster: up 3, then up 5, then up 7. The graph is a curve that bends upward, not a line.',
        'WRONG: laying a ruler on (1, 1) and (2, 4), seeing a line, and calling the function linear. CORRECT: two points always line up; the test is whether the rest do. That line rises 3 per step, so at s = 3 it would sit at 4 + 3 = 7. The real point is (3, 9), two units above the line, and that one point is enough to make the function nonlinear.',
        'y = x³: input 0 gives 0, input 1 gives 1 × 1 × 1 = 1, input 2 gives 2 × 2 × 2 = 8, input 3 gives 3 × 3 × 3 = 27. The pairs are (0, 0), (1, 1), (2, 8), (3, 27).',
        'Test the rate. The x-steps are all 1 and the changes in y are 1 - 0 = 1, then 8 - 1 = 7, then 27 - 8 = 19. The rate jumps from 1 to 7 to 19, so y = x³ is not linear either. Plotted, the points hug the bottom near 0 and then shoot upward.',
        'Read the equations the same way: in A = s² the s is squared, and in y = x³ the x is cubed. Neither is a plain x times a number plus a number, so neither belongs to the y = mx + b family, which matches what the tables and the plots just showed.',
      ],
      answer: 'Both are nonlinear: A = s² has changes 3, 5, 7 and y = x³ has changes 1, 7, 19; neither rate is constant and neither plot is a straight line',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-table-is-linear',
      kind: 'try_yourself',
      problem: 'Which table shows a linear function?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x: 1, 2, 3, 4 and y: 10, 7, 4, 1', correct: true },
        { id: 'b', text: 'x: 1, 2, 3, 4 and y: 16, 9, 4, 1' },
        { id: 'c', text: 'x: 1, 2, 3, 4 and y: 2, 4, 8, 16' },
        { id: 'd', text: 'x: 1, 2, 4, 5 and y: 3, 5, 7, 9' },
      ],
      expectedAnswer: 'x: 1, 2, 3, 4 and y: 10, 7, 4, 1',
      hints: [
        'Check the x-steps first. When every x-step is 1, the y-values must change by the same amount in every row, whether that amount is positive or negative. When the x-steps are uneven, divide the change in y by the change in x before you compare.',
        'Going down is allowed, and going down by 7, then 5, then 3 is not the same as going down by the same amount. Doubling is a constant multiplier, not a constant rate. Exactly one table changes by the same amount for the same x-step, every row.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-equation-is-nonlinear',
      kind: 'try_yourself',
      problem: 'Which equation describes a nonlinear function?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 3x - 7' },
        { id: 'b', text: 'y = -2x' },
        { id: 'c', text: 'y = x³ + 1', correct: true },
        { id: 'd', text: 'y = 0.5x + 4' },
      ],
      expectedAnswer: 'y = x³ + 1',
      hints: [
        'In y = mx + b the x is plain. Look for an x that is squared, cubed, or multiplied by itself.',
        'A subtracted constant, a negative m, a decimal m, and a missing + b all still fit y = mx + b. Only one equation raises x to a power, and the + 1 at the end does not undo that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-value-that-breaks-linearity',
      kind: 'try_yourself',
      problem:
        'A phone game awards points for finishing each level. Level 1 gives 40 points, level 2 gives 55, level 3 gives 70, and level 4 gives 95. Three of the four rows fit one linear function, and one row breaks the pattern. Which points value breaks the linear pattern? Type that points value as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '95',
      hints: [
        'The level numbers go up by 1 each time, so find the change in points from each level to the next: 55 - 40, then 70 - 55, then 95 - 70.',
        'Two of those changes are 15. If the pattern had stayed linear, level 4 would give 70 + 15 = 85. The value that is actually in the table for level 4 is the one that breaks the pattern.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-uneven-steps-and-plus-b',
      kind: 'misconception_check',
      question:
        'Aisha looks at a table with x-values 1, 2, 4, 8 and y-values 5, 7, 11, 19 and says it is nonlinear, because the y-values go up by 2, then 4, then 8. Ben looks at the rule y = x² + 3 and says it is linear, because it ends in + 3 just like y = mx + b. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The table with y-values 5, 7, 11, 19 is nonlinear, because the changes 2, 4, 8 are not the same.',
          misconception: 'Comparing the changes in y alone when the x-steps are not all the same size, instead of dividing each change in y by its change in x.',
          correctsTo:
            'The x-steps are 1, 2, and 4, not 1, 1, 1, so the y-changes have to be divided before they can be compared: 2 ÷ 1 = 2, 4 ÷ 2 = 2, and 8 ÷ 4 = 2. The rate of change is 2 in every row, so the table IS linear. Plot (1, 5), (2, 7), (4, 11), (8, 19) and a ruler covers all four points. Uneven y-changes only prove nonlinear when the x-steps are even.',
        },
        {
          answer: 'y = x² + 3 is linear, because it has a + 3 at the end like y = mx + b.',
          misconception: 'Matching the "+ b" part of the family and ignoring the exponent on x, when the plain x is what makes a rule linear.',
          correctsTo:
            'Read the x before anything else. In y = x² + 3 the x is squared, so the rule is not a number times a plain x plus a number, and it is not in the y = mx + b family. The table proves it: inputs 1, 2, 3 give 1 + 3 = 4, 4 + 3 = 7, and 9 + 3 = 12, with changes of 3 and then 5. The + 3 lifts every point up by 3, but it cannot straighten the bend that the squaring puts in.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A function is linear when it can be written as y = mx + b with a plain x; every member of that family graphs as a straight line.',
        'Linear means a constant rate of change: the same change in y for the same change in x, between EVERY pair of neighboring rows.',
        'When the x-steps are uneven, divide each change in y by its change in x and compare the rates, not the raw y-changes.',
        'Negative m, decimal m, a subtracted constant, and b = 0 are all still linear. Doubling every row is a constant multiplier, not a constant rate.',
        'A = s² gives (1, 1), (2, 4), (3, 9), (4, 16) with changes 3, 5, 7, and y = x³ gives changes 1, 7, 19; the rate keeps changing, so both are nonlinear and both plots bend.',
        'One point off the line is enough: a straight line through (1, 1) and (2, 4) would put the third point at (3, 7), and the real point (3, 9) breaks it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Linear vs Nonlinear Functions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
