/**
 * Grade 8 Math — Unit 3 CED 3.3: Slope & Similar Triangles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.slope-from-similar-triangles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U3_SLOPE_FROM_SIMILAR_TRIANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.slope-from-similar-triangles.v1',
  course: 'Grade 8 Math',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Slope & Similar Triangles',
  planId: 'evelyn.ms.m8math.slope-from-similar-triangles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.slope-from-similar-triangles.v1' }],
  theory: [
    { loId: 'm8math.slope-from-similar-triangles', kind: 'framework', title: 'A slope triangle is the measurement', content: `A SLOPE TRIANGLE IS THE MEASUREMENT — pick any two points on a line. Starting at the left point, go straight across until you are directly under or over the right point, then go straight up or down to reach it. The across leg is the RUN, the up-or-down leg is the RISE, and the piece of the line between the two points is the third side. Slope = rise ÷ run. On the proportional graphs of earlier this unit, slope was the rise for 1 unit of run; here the run can be any size and the line does not have to pass through the origin.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'framework', title: 'Every slope triangle on a line is the same shape', content: `EVERY SLOPE TRIANGLE ON A LINE IS THE SAME SHAPE — draw two slope triangles on one line, a small one and a large one. Each has a right angle where the run meets the rise, because across and up are always at right angles. And the line has one fixed tilt, so it meets every across leg at exactly the same angle. Same angles means the same shape at a different size, so the large triangle is the small one scaled by some factor k, exactly like a scale drawing and its real object. Triangles like that are called similar.` },
    { loId: 'm8math.slope-from-similar-triangles', content: `SCALED COPIES HAVE EQUAL RISE:RUN, SO THE k CANCELS — say the small triangle has rise 2 and run 3, and the large one is that triangle scaled by 4, so its rise is 8 and its run is 12. Its slope is 8 ÷ 12, and 8 over 12 is (4 × 2) over (4 × 3), which simplifies right back to 2 over 3. Whatever k is, it multiplies the rise and the run by the same amount, so it divides out of the fraction. That is why Jamal and Priya had to agree: slope belongs to the LINE, and any two points on it give the same slope.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'framework', title: 'Count it from a graph', content: `COUNT IT FROM A GRAPH — find two points where the line passes exactly through grid corners, then count squares: across for the run, up or down for the rise. If the line goes through (2, 1) and (5, 7), the run is 3 squares and the rise is 6 squares, so the slope is 6 ÷ 3 = 2. Bigger triangle, smaller triangle, any grid points you like, the count always divides to 2.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'framework', title: 'Compute it from two points', content: `COMPUTE IT FROM TWO POINTS — when the points are given as coordinates, subtract instead of counting. Rise is the second y minus the first y, and run is the second x minus the first x, with the SAME point going first in both. From (2, 3) to (6, 11): rise is 11 - 3 = 8, run is 6 - 2 = 4, slope is 8 ÷ 4 = 2. Going the other way, from (6, 11) to (2, 3), gives rise -8 and run -4, and -8 ÷ -4 is still 2. Mixing the orders is the trap: 8 on top and -4 on the bottom gives -2, the right size with the wrong sign.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'framework', title: 'A line that falls has a negative slope', content: `A LINE THAT FALLS HAS A NEGATIVE SLOPE — moving to the right, if the line drops, you count DOWN for the rise, so the rise is negative and so is the slope. From (1, 7) to (4, 1): run is 4 - 1 = 3, rise is 1 - 7 = -6, slope is -6 ÷ 3 = -2. The slope triangle is still a perfectly good triangle. The sign records the direction, downhill from left to right, and the size records how steep. A slope of -2 falls exactly as steeply as a slope of 2 climbs.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'definition', title: 'slope triangle', content: `a right triangle drawn between two points on a line, with an across leg (the run), an up-or-down leg (the rise), and a piece of the line as its third side.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'definition', title: 'rise', content: `the up-or-down leg of a slope triangle: the change in y between two points, negative when the line falls from left to right.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'definition', title: 'run', content: `the across leg of a slope triangle: the change in x between two points, measured from left to right.` },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'definition', title: 'slope', content: 'rise divided by run; the same number between any two points on a line.' },
    { loId: 'm8math.slope-from-similar-triangles', kind: 'definition', title: 'similar triangles', content: `triangles with the same angles, so the same shape at different sizes: one is the other with every side multiplied by the same scale factor.` },
  ],
  methods: [
    {
      title: 'Worked two triangles one line',
      steps: [
        `Small triangle, from (1, 2) to (3, 5). Run: go across from x = 1 to x = 3, which is 3 - 1 = 2. Rise: go up from y = 2 to y = 5, which is 5 - 2 = 3. Slope = 3 ÷ 2 = 1.5.`,
        `Large triangle, from (1, 2) to (7, 11). Run: 7 - 1 = 6. Rise: 11 - 2 = 9. Slope = 9 ÷ 6 = 1.5.`,
        `Same slope. Now look at why. The large triangle has run 6 and rise 9, and the small one has run 2 and rise 3. Every leg of the large triangle is exactly 3 times the matching leg of the small one: 2 × 3 = 6 and 3 × 3 = 9. The large triangle is the small triangle scaled by 3, the same way a real room is a floor plan scaled up.`,
        `Write the large slope with that factor showing: 9 over 6 is (3 × 3) over (3 × 2). The 3 on top and the 3 on the bottom divide out, leaving 3 over 2, which is the small slope. The scale factor cancels no matter what it is, so every slope triangle on this line gives 1.5.`,
        `Check by walking the line with the small triangle. From (1, 2), go across 2 and up 3 to reach (3, 5). Do it again: across 2 to x = 5, up 3 to y = 8, landing on (5, 8). Once more: across 2 to x = 7, up 3 to y = 11, landing on (7, 11), which is exactly the third point given. Three copies of the small triangle stack into the large one, and that is what scaled by 3 means.`,
      ],
      example: { problem: `A line passes through the points (1, 2), (3, 5), and (7, 11). Draw a small slope triangle from (1, 2) to (3, 5) and a large one from (1, 2) to (7, 11). Find the slope from each triangle, and explain why the two answers had to match.`, solution: `Both triangles give slope 1.5; the large triangle is the small one scaled by 3, and the 3 cancels out of 9 over 6.` },
      relatedLoIds: ['m8math.slope-from-similar-triangles'],
    },
    {
      title: 'Worked negative slope two points',
      steps: [
        `Choose (-3, 7) as the first point and (3, -2) as the second, and keep that order for both subtractions.`,
        `Run: second x minus first x, which is 3 - (-3) = 3 + 3 = 6. The line covers 6 units going across.`,
        `Rise: second y minus first y, which is -2 - 7 = -9. The rise is negative, which says the line drops 9 units while it goes across 6. This line falls from left to right.`,
        'Slope = rise ÷ run = -9 ÷ 6 = -1.5.',
        `WRONG: subtracting in mixed order, 7 - (-2) = 9 on top and 3 - (-3) = 6 on the bottom, to get 9 ÷ 6 = 1.5. CORRECT: the first point must go first in BOTH subtractions. A positive answer would mean the line climbs, but from (-3, 7) to (3, -2) the y-value went from 7 down to -2, so the slope has to be negative: -1.5.`,
        `WRONG: putting the run on top, 6 ÷ -9, to get about -0.67. CORRECT: rise goes on top, always. Run over rise is a different number that measures nothing about this line.`,
        `Check with a smaller triangle. Divide both legs by 3: run 6 ÷ 3 = 2 and rise -9 ÷ 3 = -3, so the small triangle is across 2, down 3. Walk it from (-3, 7): across 2 to x = -1, down 3 to y = 4, landing on (-1, 4). Again: across 2 to x = 1, down 3 to y = 1, landing on (1, 1). Again: across 2 to x = 3, down 3 to y = -2, landing on (3, -2), the second point given. The small triangle gives -3 ÷ 2 = -1.5 too, because the large one is just the small one scaled by 3.`,
      ],
      example: { problem: `A line passes through (-3, 7) and (3, -2). Find its slope, then draw a smaller slope triangle on the same line to check.`, solution: `The slope is -1.5; the small triangle (across 2, down 3) gives -3 ÷ 2 = -1.5 and stacks three times to reach (3, -2).` },
      relatedLoIds: ['m8math.slope-from-similar-triangles'],
    },
  ],
  pointers: [
    { content: `Students often say "Slope 0.5" — From (1, 2) to (4, 8) the run is 4 - 1 = 3 and the rise is 8 - 2 = 6. Slope is rise over run, so it is 6 ÷ 3 = 2, not 3 ÷ 6. A quick sense check catches this: the line climbs 6 while moving across only 3, which is steep, and a steep climb should give a slope bigger than 1, not smaller.`, kind: 'common-error' },
    { content: `Students often say "Slope 4" — From (1, 2) to (7, 14) the run is 7 - 1 = 6 and the rise is 14 - 2 = 12, so the slope is 12 ÷ 6 = 2, exactly what Dev should have gotten. Lena is right that her triangle is the small one scaled by 2, since 3 × 2 = 6 and 6 × 2 = 12. But 12 over 6 is (2 × 6) over (2 × 3), and the 2 divides out, leaving 6 over 3 = 2. A bigger triangle on the same line is the same shape, so it has the same slope. That is the whole point: slope belongs to the line, not to the points.`, kind: 'common-error' },
    { content: `A slope triangle is drawn between two points on a line: the across leg is the run, the up-or-down leg is the rise, and slope = rise ÷ run.`, kind: 'tip' },
    { content: `Every slope triangle on the same line is the same shape at a different size, because each has a right angle and the line meets each across leg at the same tilt. They are similar triangles.`, kind: 'tip' },
    { content: `Scaling a triangle by k multiplies rise and run by the same k, so k cancels out of rise over run. That is why any two points on a line give the same slope: slope belongs to the line.`, kind: 'tip' },
    { content: `From a graph, pick two grid points and count squares: across for run, up or down for rise.`, kind: 'tip' },
    { content: `From two given points, subtract in the same order on top and bottom: rise is second y minus first y, run is second x minus first x. Mixing the orders flips the sign.`, kind: 'tip' },
    { content: `A line that falls from left to right has a negative rise and a negative slope; the sign tells the direction and the size tells the steepness.`, kind: 'tip' },
    { content: `Always put **rise on top, run on the bottom**. Rise ÷ run, not run ÷ rise. A steep climb should give a big slope (>1), not a tiny one (<1).`, kind: 'common-error' },
    { content: `Use the **same point first in both subtractions**. If you go from (2, 3) to (6, 11), subtract 3 from 11 AND 2 from 6. Mixing them (11 - 2 on top, 6 - 3 on bottom) flips your sign.`, kind: 'common-error' },
    { content: `A bigger slope triangle on the **same line** gives the **same slope**, not a bigger one. The scale factor cancels: (2k) ÷ (3k) = 2 ÷ 3 no matter what k is.`, kind: 'gotcha' },
    { content: `The **sign of the slope tells direction** (up or down), and the **size tells steepness**. A slope of -2 falls as steeply as a slope of 2 climbs; they're opposites.`, kind: 'vocab-note' },
    { content: `When a line **falls from left to right**, the rise is **negative**. Count down as a negative number: from (1, 7) to (4, 1), the rise is 1 - 7 = -6, not 6.`, kind: 'edge-case' },
    { content: `A slope triangle has a **right angle where the run meets the rise**. That's by design—'across' and 'up/down' are always perpendicular, so all slope triangles on one line are similar.`, kind: 'vocab-note' },
    { content: `**Pick grid points** when reading slope from a graph. If the line doesn't pass exactly through corners, you'll count wrong. Estimate or find two points you can count cleanly between.`, kind: 'tip' },
  ],
};
