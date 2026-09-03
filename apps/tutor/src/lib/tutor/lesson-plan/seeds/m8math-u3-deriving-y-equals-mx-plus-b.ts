/**
 * Grade 8 Math — Proportional Relationships & Slope: Deriving y = mx &
 * y = mx + b.
 *
 * CONCEPT-LED. The student arrives owning two things: slope as rise over run
 * that is the same between any two points of a line (row 3.3), and y = kx as
 * the equation of a proportional relationship (Grade 7). What is new is the
 * mental model that turns a picture into an equation: because the slope is
 * the same everywhere, one unnamed point (x, y) can stand for every point on
 * the line, and the slope triangle from the origin to (x, y) says y ÷ x = m,
 * so y = mx. Slide the line up to cross the y-axis at (0, b) and the same
 * triangle has rise y - b instead of y, so (y - b) ÷ x = m and y = mx + b
 * (CCSS 8.EE.B.6). The + b is then read as the line's starting value, its
 * height at x = 0, and the lesson finishes with the skill the model buys:
 * read b where the line crosses the y-axis, count rise over run for m, and
 * write the equation. Two traps this plan is built to kill: reading b from
 * the x-axis crossing instead of the y-axis crossing, and swapping the two
 * slots so the intercept rides with the x.
 *
 * SCOPE GUARD: Grade 8 row 3.4 derives y = mx for a line through the origin
 * and y = mx + b for a line crossing the y-axis at (0, b), and reads m and b
 * from a graph that shows the intercept to write the line's equation.
 * Lineage, verbatim from the curriculum: "contrast with the
 * through-the-origin test of `m7math-u3-proportional-relationships.ts`
 * (y = 2x + 3 is linear but not proportional — assumed known)". Boundary,
 * verbatim: "Withholds: writing the equation from a slope and a point or
 * from two points, and graphing directly from the equation →
 * `alg1-u4-slope-intercept-form.ts` (HS review) — in G8 the equation always
 * comes from a graph (here) or a table/description (rows 7.1–7.2);
 * point-slope and standard form → `alg1-u4-point-slope-standard-form.ts`."
 * Concretely: every graph in this plan is described as a y-axis crossing at
 * a grid point plus one or two other grid points, so b is always READ, never
 * backed out as y - mx (that hidden-intercept case is rows 7.1-7.3, along
 * with interpreting m and b inside a story); no step ever starts from an
 * equation and plots it; and no equation is ever built from a slope and a
 * point or from two arbitrary points. Counting rise over run between two grid
 * points to get m is row 3.3's skill, applied here and not re-argued: the
 * similar-triangles reason that the slope is the same everywhere is recalled
 * in one clause and never re-proved. Negative slopes and a negative b DO
 * appear, because row 3.3 already includes negative slopes and a y-axis
 * crossing below the origin is the natural way to make the sign of b matter.
 * Two lines with the same steepness appear in the hook and the first worked
 * example only to show that the intercept is the sole difference between
 * them; the word "parallel" and any slope relationship between two lines are
 * never taught. The plan never classifies a zero or undefined slope and never
 * treats a horizontal or vertical line as a topic. Below, assumed and not
 * re-taught: y = kx and the three proportionality tests
 * (`m7math-u3-proportional-relationships.ts`,
 * `m7math-u3-constant-of-proportionality.ts`); the plan uses them only to
 * explain, in one keyIdea and one recap line, why a proportional line has
 * b = 0. Salvaged from `g8-math-slope-linear-functions.ts`: the
 * y-intercept-as-starting-value framing only; its graphing-from-the-equation
 * example, zero/undefined slope classification, and slope formula with
 * subscripts were deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U3_DERIVING_Y_EQUALS_MX_PLUS_B: LessonPlan = {
  id: 'evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1',
  title: 'Deriving y = mx & y = mx + b',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.deriving-y-equals-mx-plus-b',
      standard: 'M8MATH-3.4',
      description:
        'Derive y = mx for a line through the origin and y = mx + b for a line crossing the y-axis at (0, b); read m and b from a graph that shows the intercept and write the line\'s equation (CCSS 8.EE.B.6).',
    },
  ],
  prerequisites: ['m8math.slope-from-similar-triangles'],
  followUps: ['m8math.equations-with-variables-on-both-sides'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a line through the origin next to a line with a head start, so the student sees that the only difference between y = 6x and y = 6x + 20 is where the line begins.',
      script:
        'Dev and Priya both start dog-walking jobs the same week, and both earn $6 a week. Dev starts with nothing. Priya starts with $20 of birthday money already in her jar. Plot the money each of them has, week by week, and you get two straight lines that climb at exactly the same steepness, because $6 a week is $6 a week. The difference is where each line begins: Dev\'s line starts at the origin, and Priya\'s line starts 20 higher, at (0, 20). You already know Dev\'s line is y = 6x, because his money is proportional to the weeks. Priya\'s line is y = 6x + 20, and today you find out why: where that + 20 comes from, why the 6 rides with the x, and how to read both numbers straight off any graph that shows where the line crosses the y-axis.',
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-one-point-stands-for-all',
      kind: 'concept',
      goal: 'Derive y = mx and y = mx + b from a slope triangle whose far corner is an unnamed point (x, y), name b as the starting value, and turn the model into a way of reading any graph that shows its intercept.',
      keyIdeas: [
        'ONE SLOPE, SO ONE POINT CAN STAND FOR ALL OF THEM — last lesson you showed with slope triangles that the slope of a line is the same between ANY two of its points. That lets you do something new: pick a point on the line and call it (x, y) without saying which point it is. Whatever you find out about (x, y) is true for every point on the line, and a statement that is true for every point on the line is the line\'s equation.',
        'THROUGH THE ORIGIN: y = mx — take a line through (0, 0) with slope m, and pick any point (x, y) on it. The slope triangle from (0, 0) to (x, y) has rise y and run x, so rise over run is y ÷ x, and that must equal m. Multiply both sides by x and you get y = mx. This is the y = kx of proportional relationships, and now you know that k was the slope all along.',
        'CROSSING AT (0, b): y = mx + b — now slide the line up so it crosses the y-axis at (0, b) instead of at the origin. From (0, b) to any point (x, y), the rise is y - b, because the triangle starts at height b instead of at height 0, and the run is still x. So (y - b) ÷ x = m, which gives y - b = mx, and adding b to both sides gives y = mx + b. The + b is the head start the line had before x started counting.',
        'b IS THE STARTING VALUE — b is the height of the line at x = 0, which is exactly where it crosses the y-axis. Put x = 0 into y = mx + b and you get y = m × 0 + b = b, so the equation agrees with the picture. A line through the origin has a starting value of 0, which is why y = mx has nothing added on: it is y = mx + b with b = 0.',
        'READING m AND b OFF A GRAPH — find the point where the line crosses the y-axis and read its height; that is b, sign included. Then pick two points on the line that sit on grid crossings and count rise over run; that is m, and a line that falls from left to right has a negative rise. Write y = mx + b with each number in its own slot: m rides with the x, and b stands alone.',
        'THE OLD TEST, EXPLAINED — you already know y = 2x + 3 is linear but not proportional. Now you can say exactly why: it is y = mx + b with m = 2 and b = 3, and a proportional relationship needs b = 0, because its line has to pass through the origin. Every line in this lesson is linear; only the ones with b = 0 are proportional.',
      ],
      vocabulary: [
        { term: 'y-intercept', definition: 'the point where a line crosses the y-axis; its height is b, the value of y when x = 0.' },
        { term: 'slope-intercept form', definition: 'the equation y = mx + b, where m is the slope and b is the y-intercept.' },
        { term: 'starting value', definition: 'another name for b: the value of y before x has started counting, at x = 0.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-derive-both-forms',
      kind: 'worked_example',
      problem:
        'A line passes through the origin and the point (4, 6). A second line crosses the y-axis at (0, 4) and passes through (4, 10). Derive the equation of each line.',
      steps: [
        'First line. Draw the slope triangle from (0, 0) to (4, 6): the rise is 6 and the run is 4, so m = 6 ÷ 4 = 1.5.',
        'Now pick any point (x, y) on that line, without saying which one. The slope triangle from (0, 0) to (x, y) has rise y and run x, and last lesson showed that the slope is the same for every triangle on the line, so y ÷ x = 1.5.',
        'Multiply both sides by x: y = 1.5x. That is the equation of the first line, and it has the shape y = mx because the line starts at the origin.',
        'Second line. Its slope triangle from (0, 4) to (4, 10) has rise 10 - 4 = 6 and run 4 - 0 = 4, so m = 6 ÷ 4 = 1.5, the same steepness as the first line.',
        'Pick any point (x, y) on the second line. From (0, 4), the rise to (x, y) is y - 4, because the triangle starts at height 4, and the run is x. So (y - 4) ÷ x = 1.5, which means y - 4 = 1.5x, and adding 4 to both sides gives y = 1.5x + 4.',
        'Check both equations with the given points. First line at x = 4: 1.5 × 4 = 6, and the point was (4, 6). Second line at x = 4: 1.5 × 4 + 4 = 6 + 4 = 10, and the point was (4, 10). At x = 0 the second equation gives 1.5 × 0 + 4 = 4, which is exactly where that line crosses the y-axis.',
      ],
      answer: 'First line: y = 1.5x. Second line: y = 1.5x + 4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-equation-from-graph',
      kind: 'worked_example',
      problem:
        'A graph shows a line that crosses the y-axis at (0, 5) and passes through the grid points (2, 1) and (5, -5). Write the equation of the line.',
      steps: [
        'Read b first. The line crosses the y-axis at (0, 5), so b = 5. That is the starting value: at x = 0, y is 5.',
        'Now count rise over run between two grid points. From (0, 5) to (2, 1), the line goes DOWN 4 and right 2. A drop is a negative rise, so the rise is -4 and the run is 2, and m = -4 ÷ 2 = -2.',
        'WRONG: writing y = 2x + 5 because the triangle is 4 tall and 2 wide. CORRECT: the line falls from left to right, so its slope is negative, and the equation is y = -2x + 5. The check catches the slip: y = 2x + 5 at x = 2 gives 2 × 2 + 5 = 9, but the graph shows the point (2, 1).',
        'WRONG: writing y = 5x - 2, with the y-intercept in front of the x. CORRECT: m is the number that rides with x, because slope is the change in y for each step of 1 in x; b stands alone, because it is the height when x = 0. The slots are not interchangeable: y = 5x - 2 at x = 0 gives -2, but the line crosses the y-axis at 5.',
        'Write the equation with each number in its own slot: y = -2x + 5.',
        'Check with the third point, (5, -5), which was not used to find m or b: -2 × 5 + 5 = -10 + 5 = -5. It matches, so the equation describes the whole line.',
      ],
      answer: 'y = -2x + 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-line-through-origin',
      kind: 'try_yourself',
      problem: 'A graph shows a line that passes through the origin and through the point (3, 12). Which equation describes the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 3x' },
        { id: 'b', text: 'y = 12x' },
        { id: 'c', text: 'y = x + 9' },
        { id: 'd', text: 'y = 4x', correct: true },
      ],
      expectedAnswer: 'y = 4x',
      hints: [
        'The line goes through (0, 0), so it has the shape y = mx with nothing added on. Draw the slope triangle from the origin to (3, 12) and count rise over run.',
        'The rise is 12 and the run is 3, so m = 12 ÷ 3. Check your equation two ways: x = 3 has to give y = 12, and x = 0 has to give y = 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-negative-intercept',
      kind: 'try_yourself',
      problem: 'A graph shows a line that crosses the y-axis at (0, -3) and passes through the grid point (2, 3). Which equation describes the line?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = -3x + 3' },
        { id: 'b', text: 'y = 3x - 3', correct: true },
        { id: 'c', text: 'y = 3x + 3' },
        { id: 'd', text: 'y = 6x - 3' },
      ],
      expectedAnswer: 'y = 3x - 3',
      hints: [
        'Read b straight off the y-axis crossing, sign included. Then count the rise and the run from (0, -3) up to (2, 3).',
        'From height -3 up to height 3 is a rise of 6, over a run of 2. Put m with the x and b on its own, then check with x = 0: the equation must give -3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-slope-from-graph',
      kind: 'try_yourself',
      problem:
        'A graph shows a line that crosses the y-axis at (0, 7) and passes through the grid point (4, -1). Its equation has the form y = mx + b. What is the value of m? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-2',
      hints: [
        'b is already showing: the line crosses at height 7. For m, draw the slope triangle from (0, 7) to (4, -1) and decide whether the line rises or falls.',
        'From height 7 down to height -1 is a drop of 8 over a run of 4. A drop is a negative rise, so m = -8 ÷ 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-x-axis-crossing-and-swapped-slots',
      kind: 'misconception_check',
      question:
        'A graph shows a line that crosses the y-axis at (0, -4) and crosses the x-axis at (2, 0). Jamal writes y = 2x + 2 and Keisha writes y = -4x + 2. Test each equation at x = 0 and at x = 2. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'y = 2x + 2',
          misconception: 'Reading b from where the line crosses the x-axis instead of the y-axis, so the 2 from the point (2, 0) is used as the starting value.',
          correctsTo:
            'b is the height of the line at x = 0, which is the crossing on the VERTICAL axis: the line crosses at (0, -4), so b = -4, sign included. The slope is right: from (0, -4) up to (2, 0) is a rise of 4 over a run of 2, so m = 2. The equation is y = 2x - 4. The check exposes the slip: y = 2x + 2 at x = 0 gives 2, but the graph shows the line at -4 there.',
        },
        {
          answer: 'y = -4x + 2',
          misconception: 'Swapping the two slots: putting the y-intercept -4 in front of the x, where the slope belongs, and adding the slope 2 on the end, where the y-intercept belongs.',
          correctsTo:
            'm rides with the x because it is the change in y for each step of 1 in x; b stands alone because it is the height at x = 0. Here m = 2 and b = -4, so y = 2x - 4. Test the swapped equation at x = 0: y = -4 × 0 + 2 = 2, but the line is at -4 when x = 0. Test the right equation: at x = 0, y = 2 × 0 - 4 = -4, and at x = 2, y = 2 × 2 - 4 = 0. Both points on the graph match.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'On a line through the origin, the slope triangle from (0, 0) to any point (x, y) has rise y and run x, so y ÷ x = m and the equation is y = mx.',
        'On a line crossing the y-axis at (0, b), the rise from (0, b) to any point (x, y) is y - b, so (y - b) ÷ x = m and the equation is y = mx + b.',
        'b is the starting value: the height of the line at x = 0, read where it crosses the y-axis, sign included.',
        'To write the equation from a graph, read b off the y-axis crossing, count rise over run between two grid points for m, and put m with the x and b on its own.',
        'A line that falls from left to right has a negative slope; a line that crosses the y-axis below the origin has a negative b.',
        'y = mx is y = mx + b with b = 0. That is why a proportional relationship must pass through the origin, and why y = 2x + 3 is linear but not proportional.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Deriving y = mx & y = mx + b' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
