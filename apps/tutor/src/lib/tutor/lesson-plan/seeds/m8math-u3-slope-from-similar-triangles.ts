/**
 * Grade 8 Math — Proportional Relationships & Slope: Slope & Similar
 * Triangles.
 *
 * CONCEPT-LED row for the m8math fan-out. The student arrives owning slope
 * as the steepness of a proportional graph (row 3.1) and scale factors from
 * Grade 7. What this lesson builds is one mental model: slope belongs to the
 * LINE, not to the two points you happen to pick (CCSS 8.EE.B.6). The reason
 * is a picture — every slope triangle drawn on a line is a scaled copy of
 * every other one, because they all have a right angle and the line meets
 * each horizontal leg at the same tilt — and scaled copies have equal
 * rise:run ratios because the scale factor cancels out of the fraction. Once
 * that is in place, computing slope is just counting: rise over run from two
 * grid points on a graph, or from two given coordinate pairs by subtracting
 * in the same order top and bottom, with the sign of the rise recording
 * whether the line climbs or falls from left to right.
 *
 * SCOPE GUARD: Grade 8 row 3.3 draws two slope triangles on the same
 * non-vertical line, argues informally (same angles, so one triangle is the
 * other scaled by a factor k, so rise:run is the same because k cancels) that
 * the slope is the same between any two points, and computes slope from a
 * graph or from two given points by counting rise over run, including
 * negative slopes. Assumes scale factor intuition from
 * `m7math-u7-scale-drawings.ts`. Withholds: zero/undefined slope
 * classification and horizontal/vertical lines as a topic, "rate of change
 * with units" language → `alg1-u4-slope-rate-of-change.ts` (cites 8.F.B.4;
 * HS review); parallel/perpendicular slope relationships →
 * `alg1-u4-parallel-perpendicular.ts` and
 * `geom-u3-slopes-parallel-perpendicular.ts`; formal similarity criteria →
 * `geom-u6-triangle-similarity-criteria.ts`. Concretely: the lesson body
 * calls the two legs of a slope triangle the "across" leg and the
 * "up-or-down" leg, and the words "horizontal" and "vertical" do not appear
 * in it at all apart from "non-vertical" in the objective sentence; no line
 * in this plan is horizontal or vertical, no slope in this plan is zero, and
 * the words "undefined", "rate of change", "parallel" and "perpendicular"
 * never appear in the lesson body (only here, in this guard).
 * The similarity argument is informal throughout — two triangles with the
 * same angles are the same shape at different sizes — and is never named as
 * a criterion, never abbreviated, and never proved (AA is row 9.2's angle
 * fact; the criteria with proofs are Geometry). Sideways: the plan never
 * reads where a line crosses the y-axis, never writes y = mx or y = mx + b,
 * and never uses the letter m for slope (row 3.4); slope as the unit rate of
 * a proportional graph (row 3.1) is recalled in one clause of the concept
 * segment and is otherwise not taught or assessed; several lines here do not
 * pass through the origin, which the first key idea says once, as the
 * contrast with row 3.1, and which is never read as an intercept. Below,
 * assumed and not re-taught: scale factor as the one number every length is
 * multiplied by (`m7math-u7-scale-drawings.ts`), signed-number subtraction
 * (`m7math-u2-*`), and plotting points (`m6math` row 6.1). Negative
 * coordinates and negative slopes DO appear, because the row's scope names
 * negative slopes and the two-point subtraction only earns its keep when a
 * coordinate is negative.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U3_SLOPE_FROM_SIMILAR_TRIANGLES: LessonPlan = {
  id: 'evelyn.ms.m8math.slope-from-similar-triangles.v1',
  title: 'Slope & Similar Triangles',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.slope-from-similar-triangles',
      standard: 'M8MATH-3.3',
      description:
        'Draw two slope triangles on the same non-vertical line and argue informally (similar triangles, so equal rise:run ratios) that the slope is the same between any two points; then compute slope from a graph or from two given points by counting rise over run, including negative slopes (CCSS 8.EE.B.6).',
    },
  ],
  prerequisites: ['m8math.comparing-proportional-relationships'],
  followUps: ['m8math.deriving-y-equals-mx-plus-b'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that the steepness of one straight ramp cannot depend on where along it you measure, before the similar-triangle reason is given.',
      script:
        'The big ramp at the skate park is one long straight board. Two friends want to know how steep it is, and they measure it in two different places. Jamal uses a short section near the bottom: it rises 1 foot over a run of 4 feet, so he says the steepness is 1 over 4, which is 0.25. Priya measures the whole ramp: it rises 3 feet over a run of 12 feet, so she says 3 over 12, which is also 0.25. Same number. That is not a coincidence, and it is not luck. It is one board, so it can only have one steepness, and any honest measurement has to find it. Today you learn why the two measurements are forced to agree, and the reason is a picture you already know from scale drawings. Then you use it to read the slope of any line from its graph or from two points, even when the line runs downhill.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-similar-slope-triangles',
      kind: 'concept',
      goal: 'Define a slope triangle, show that every slope triangle on a line is a scaled copy of every other, conclude that slope belongs to the line, and set up counting rise over run from a graph and from two points.',
      keyIdeas: [
        'A SLOPE TRIANGLE IS THE MEASUREMENT — pick any two points on a line. Starting at the left point, go straight across until you are directly under or over the right point, then go straight up or down to reach it. The across leg is the RUN, the up-or-down leg is the RISE, and the piece of the line between the two points is the third side. Slope = rise ÷ run. On the proportional graphs of earlier this unit, slope was the rise for 1 unit of run; here the run can be any size and the line does not have to pass through the origin.',
        'EVERY SLOPE TRIANGLE ON A LINE IS THE SAME SHAPE — draw two slope triangles on one line, a small one and a large one. Each has a right angle where the run meets the rise, because across and up are always at right angles. And the line has one fixed tilt, so it meets every across leg at exactly the same angle. Same angles means the same shape at a different size, so the large triangle is the small one scaled by some factor k, exactly like a scale drawing and its real object. Triangles like that are called similar.',
        'SCALED COPIES HAVE EQUAL RISE:RUN, SO THE k CANCELS — say the small triangle has rise 2 and run 3, and the large one is that triangle scaled by 4, so its rise is 8 and its run is 12. Its slope is 8 ÷ 12, and 8 over 12 is (4 × 2) over (4 × 3), which simplifies right back to 2 over 3. Whatever k is, it multiplies the rise and the run by the same amount, so it divides out of the fraction. That is why Jamal and Priya had to agree: slope belongs to the LINE, and any two points on it give the same slope.',
        'COUNT IT FROM A GRAPH — find two points where the line passes exactly through grid corners, then count squares: across for the run, up or down for the rise. If the line goes through (2, 1) and (5, 7), the run is 3 squares and the rise is 6 squares, so the slope is 6 ÷ 3 = 2. Bigger triangle, smaller triangle, any grid points you like, the count always divides to 2.',
        'COMPUTE IT FROM TWO POINTS — when the points are given as coordinates, subtract instead of counting. Rise is the second y minus the first y, and run is the second x minus the first x, with the SAME point going first in both. From (2, 3) to (6, 11): rise is 11 - 3 = 8, run is 6 - 2 = 4, slope is 8 ÷ 4 = 2. Going the other way, from (6, 11) to (2, 3), gives rise -8 and run -4, and -8 ÷ -4 is still 2. Mixing the orders is the trap: 8 on top and -4 on the bottom gives -2, the right size with the wrong sign.',
        'A LINE THAT FALLS HAS A NEGATIVE SLOPE — moving to the right, if the line drops, you count DOWN for the rise, so the rise is negative and so is the slope. From (1, 7) to (4, 1): run is 4 - 1 = 3, rise is 1 - 7 = -6, slope is -6 ÷ 3 = -2. The slope triangle is still a perfectly good triangle. The sign records the direction, downhill from left to right, and the size records how steep. A slope of -2 falls exactly as steeply as a slope of 2 climbs.',
      ],
      vocabulary: [
        { term: 'slope triangle', definition: 'a right triangle drawn between two points on a line, with an across leg (the run), an up-or-down leg (the rise), and a piece of the line as its third side.' },
        { term: 'rise', definition: 'the up-or-down leg of a slope triangle: the change in y between two points, negative when the line falls from left to right.' },
        { term: 'run', definition: 'the across leg of a slope triangle: the change in x between two points, measured from left to right.' },
        { term: 'slope', definition: 'rise divided by run; the same number between any two points on a line.' },
        { term: 'similar triangles', definition: 'triangles with the same angles, so the same shape at different sizes: one is the other with every side multiplied by the same scale factor.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-triangles-one-line',
      kind: 'worked_example',
      problem:
        'A line passes through the points (1, 2), (3, 5), and (7, 11). Draw a small slope triangle from (1, 2) to (3, 5) and a large one from (1, 2) to (7, 11). Find the slope from each triangle, and explain why the two answers had to match.',
      steps: [
        'Small triangle, from (1, 2) to (3, 5). Run: go across from x = 1 to x = 3, which is 3 - 1 = 2. Rise: go up from y = 2 to y = 5, which is 5 - 2 = 3. Slope = 3 ÷ 2 = 1.5.',
        'Large triangle, from (1, 2) to (7, 11). Run: 7 - 1 = 6. Rise: 11 - 2 = 9. Slope = 9 ÷ 6 = 1.5.',
        'Same slope. Now look at why. The large triangle has run 6 and rise 9, and the small one has run 2 and rise 3. Every leg of the large triangle is exactly 3 times the matching leg of the small one: 2 × 3 = 6 and 3 × 3 = 9. The large triangle is the small triangle scaled by 3, the same way a real room is a floor plan scaled up.',
        'Write the large slope with that factor showing: 9 over 6 is (3 × 3) over (3 × 2). The 3 on top and the 3 on the bottom divide out, leaving 3 over 2, which is the small slope. The scale factor cancels no matter what it is, so every slope triangle on this line gives 1.5.',
        'Check by walking the line with the small triangle. From (1, 2), go across 2 and up 3 to reach (3, 5). Do it again: across 2 to x = 5, up 3 to y = 8, landing on (5, 8). Once more: across 2 to x = 7, up 3 to y = 11, landing on (7, 11), which is exactly the third point given. Three copies of the small triangle stack into the large one, and that is what scaled by 3 means.',
      ],
      answer: 'Both triangles give slope 1.5; the large triangle is the small one scaled by 3, and the 3 cancels out of 9 over 6.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-slope-two-points',
      kind: 'worked_example',
      problem: 'A line passes through (-3, 7) and (3, -2). Find its slope, then draw a smaller slope triangle on the same line to check.',
      steps: [
        'Choose (-3, 7) as the first point and (3, -2) as the second, and keep that order for both subtractions.',
        'Run: second x minus first x, which is 3 - (-3) = 3 + 3 = 6. The line covers 6 units going across.',
        'Rise: second y minus first y, which is -2 - 7 = -9. The rise is negative, which says the line drops 9 units while it goes across 6. This line falls from left to right.',
        'Slope = rise ÷ run = -9 ÷ 6 = -1.5.',
        'WRONG: subtracting in mixed order, 7 - (-2) = 9 on top and 3 - (-3) = 6 on the bottom, to get 9 ÷ 6 = 1.5. CORRECT: the first point must go first in BOTH subtractions. A positive answer would mean the line climbs, but from (-3, 7) to (3, -2) the y-value went from 7 down to -2, so the slope has to be negative: -1.5.',
        'WRONG: putting the run on top, 6 ÷ -9, to get about -0.67. CORRECT: rise goes on top, always. Run over rise is a different number that measures nothing about this line.',
        'Check with a smaller triangle. Divide both legs by 3: run 6 ÷ 3 = 2 and rise -9 ÷ 3 = -3, so the small triangle is across 2, down 3. Walk it from (-3, 7): across 2 to x = -1, down 3 to y = 4, landing on (-1, 4). Again: across 2 to x = 1, down 3 to y = 1, landing on (1, 1). Again: across 2 to x = 3, down 3 to y = -2, landing on (3, -2), the second point given. The small triangle gives -3 ÷ 2 = -1.5 too, because the large one is just the small one scaled by 3.',
      ],
      answer: 'The slope is -1.5; the small triangle (across 2, down 3) gives -3 ÷ 2 = -1.5 and stacks three times to reach (3, -2).',
      estimatedMinutes: 3,
    },
    {
      id: 'try-scaled-triangle-rise',
      kind: 'try_yourself',
      problem:
        'Two slope triangles are drawn on the same line. The small one has a rise of 2 and a run of 5. The large one has a run of 20. What is the rise of the large triangle, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Rise 2, because a line has only one rise' },
        { id: 'b', text: 'Rise 17, because the run went up by 15, so the rise goes up by 15' },
        { id: 'c', text: 'Rise 8, because the large triangle is the small one scaled by 4', correct: true },
        { id: 'd', text: 'Rise 50, because the slope is 5 ÷ 2 = 2.5 and 2.5 × 20 = 50' },
      ],
      expectedAnswer: 'Rise 8, because the large triangle is the small one scaled by 4',
      hints: [
        'Both triangles sit on the same line, so they are the same shape at different sizes. Compare the two runs first: what number turns 5 into 20?',
        'Whatever factor scaled the run must scale the rise by the same amount. Multiply the small rise by that factor, then confirm that the large rise over the large run still simplifies to 2 over 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-slope-from-two-points',
      kind: 'try_yourself',
      problem: 'A line passes through (-4, 5) and (2, -7). What is its slope?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-2', correct: true },
        { id: 'b', text: '2' },
        { id: 'c', text: '-0.5' },
        { id: 'd', text: '6' },
      ],
      expectedAnswer: '-2',
      hints: [
        'Pick (-4, 5) as the first point and keep it first in both subtractions. Rise is -7 - 5, and run is 2 - (-4). Subtracting a negative x-coordinate adds.',
        'The y-value went from 5 down to -7, so the line falls from left to right and the slope must be negative. Rise goes on top: divide -12 by 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-slope-decimal',
      kind: 'try_yourself',
      problem:
        'A line passes through (-3, -4) and (5, 8). What is its slope? Type your answer as a decimal.',
      responseFormat: 'numeric',
      expectedAnswer: '1.5',
      hints: [
        'Take (-3, -4) as the first point. Rise is 8 - (-4), and run is 5 - (-3). Subtracting a negative number adds, so both differences come out positive.',
        'Divide the rise by the run, 12 ÷ 8, and write the result as a decimal. Check it with a smaller triangle: across 2 and up 3 from (-3, -4) should land on a point of the line, and repeating it four times should reach (5, 8).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-run-over-rise-and-bigger-triangle',
      kind: 'misconception_check',
      question:
        'Dev and Lena are finding the slope of the line through (1, 2), (4, 8), and (7, 14). Dev uses the points (1, 2) and (4, 8) and gets 0.5. Lena uses (1, 2) and (7, 14) and says her slope must be twice the correct slope Dev should have found, because her triangle is twice as big, so she reports 4. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'Slope 0.5',
          misconception: 'Putting the run on top and the rise on the bottom, so 3 ÷ 6 instead of 6 ÷ 3.',
          correctsTo:
            'From (1, 2) to (4, 8) the run is 4 - 1 = 3 and the rise is 8 - 2 = 6. Slope is rise over run, so it is 6 ÷ 3 = 2, not 3 ÷ 6. A quick sense check catches this: the line climbs 6 while moving across only 3, which is steep, and a steep climb should give a slope bigger than 1, not smaller.',
        },
        {
          answer: 'Slope 4',
          misconception: 'Believing a bigger slope triangle produces a bigger slope, when the scale factor multiplies the rise and the run by the same amount and cancels out of the fraction.',
          correctsTo:
            'From (1, 2) to (7, 14) the run is 7 - 1 = 6 and the rise is 14 - 2 = 12, so the slope is 12 ÷ 6 = 2, exactly what Dev should have gotten. Lena is right that her triangle is the small one scaled by 2, since 3 × 2 = 6 and 6 × 2 = 12. But 12 over 6 is (2 × 6) over (2 × 3), and the 2 divides out, leaving 6 over 3 = 2. A bigger triangle on the same line is the same shape, so it has the same slope. That is the whole point: slope belongs to the line, not to the points.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A slope triangle is drawn between two points on a line: the across leg is the run, the up-or-down leg is the rise, and slope = rise ÷ run.',
        'Every slope triangle on the same line is the same shape at a different size, because each has a right angle and the line meets each across leg at the same tilt. They are similar triangles.',
        'Scaling a triangle by k multiplies rise and run by the same k, so k cancels out of rise over run. That is why any two points on a line give the same slope: slope belongs to the line.',
        'From a graph, pick two grid points and count squares: across for run, up or down for rise.',
        'From two given points, subtract in the same order on top and bottom: rise is second y minus first y, run is second x minus first x. Mixing the orders flips the sign.',
        'A line that falls from left to right has a negative rise and a negative slope; the sign tells the direction and the size tells the steepness.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Slope & Similar Triangles' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
