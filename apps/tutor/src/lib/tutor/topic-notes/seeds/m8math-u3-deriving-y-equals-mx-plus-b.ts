/**
 * Grade 8 Math — Unit 3 CED 3.4: Deriving y = mx & y = mx + b.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U3_DERIVING_Y_EQUALS_MX_PLUS_B: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1',
  course: 'Grade 8 Math',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Deriving y = mx & y = mx + b',
  planId: 'evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.deriving-y-equals-mx-plus-b.v1' }],
  theory: [
    { loId: 'm8math.deriving-y-equals-mx-plus-b', kind: 'framework', title: 'One slope, so one point can stand for all of them', content: `ONE SLOPE, SO ONE POINT CAN STAND FOR ALL OF THEM — last lesson you showed with slope triangles that the slope of a line is the same between ANY two of its points. That lets you do something new: pick a point on the line and call it (x, y) without saying which point it is. Whatever you find out about (x, y) is true for every point on the line, and a statement that is true for every point on the line is the line's equation.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', content: `THROUGH THE ORIGIN: y = mx — take a line through (0, 0) with slope m, and pick any point (x, y) on it. The slope triangle from (0, 0) to (x, y) has rise y and run x, so rise over run is y ÷ x, and that must equal m. Multiply both sides by x and you get y = mx. This is the y = kx of proportional relationships, and now you know that k was the slope all along.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', content: `CROSSING AT (0, b): y = mx + b — now slide the line up so it crosses the y-axis at (0, b) instead of at the origin. From (0, b) to any point (x, y), the rise is y - b, because the triangle starts at height b instead of at height 0, and the run is still x. So (y - b) ÷ x = m, which gives y - b = mx, and adding b to both sides gives y = mx + b. The + b is the head start the line had before x started counting.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', content: `b IS THE STARTING VALUE — b is the height of the line at x = 0, which is exactly where it crosses the y-axis. Put x = 0 into y = mx + b and you get y = m × 0 + b = b, so the equation agrees with the picture. A line through the origin has a starting value of 0, which is why y = mx has nothing added on: it is y = mx + b with b = 0.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', content: `READING m AND b OFF A GRAPH — find the point where the line crosses the y-axis and read its height; that is b, sign included. Then pick two points on the line that sit on grid crossings and count rise over run; that is m, and a line that falls from left to right has a negative rise. Write y = mx + b with each number in its own slot: m rides with the x, and b stands alone.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', kind: 'framework', title: 'The old test, explained', content: `THE OLD TEST, EXPLAINED — you already know y = 2x + 3 is linear but not proportional. Now you can say exactly why: it is y = mx + b with m = 2 and b = 3, and a proportional relationship needs b = 0, because its line has to pass through the origin. Every line in this lesson is linear; only the ones with b = 0 are proportional.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', kind: 'definition', title: 'y-intercept', content: `the point where a line crosses the y-axis; its height is b, the value of y when x = 0.` },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', kind: 'definition', title: 'slope-intercept form', content: 'the equation y = mx + b, where m is the slope and b is the y-intercept.' },
    { loId: 'm8math.deriving-y-equals-mx-plus-b', kind: 'definition', title: 'starting value', content: 'another name for b: the value of y before x has started counting, at x = 0.' },
  ],
  methods: [
    {
      title: 'Worked derive both forms',
      steps: [
        `First line. Draw the slope triangle from (0, 0) to (4, 6): the rise is 6 and the run is 4, so m = 6 ÷ 4 = 1.5.`,
        `Now pick any point (x, y) on that line, without saying which one. The slope triangle from (0, 0) to (x, y) has rise y and run x, and last lesson showed that the slope is the same for every triangle on the line, so y ÷ x = 1.5.`,
        `Multiply both sides by x: y = 1.5x. That is the equation of the first line, and it has the shape y = mx because the line starts at the origin.`,
        `Second line. Its slope triangle from (0, 4) to (4, 10) has rise 10 - 4 = 6 and run 4 - 0 = 4, so m = 6 ÷ 4 = 1.5, the same steepness as the first line.`,
        `Pick any point (x, y) on the second line. From (0, 4), the rise to (x, y) is y - 4, because the triangle starts at height 4, and the run is x. So (y - 4) ÷ x = 1.5, which means y - 4 = 1.5x, and adding 4 to both sides gives y = 1.5x + 4.`,
        `Check both equations with the given points. First line at x = 4: 1.5 × 4 = 6, and the point was (4, 6). Second line at x = 4: 1.5 × 4 + 4 = 6 + 4 = 10, and the point was (4, 10). At x = 0 the second equation gives 1.5 × 0 + 4 = 4, which is exactly where that line crosses the y-axis.`,
      ],
      example: { problem: `A line passes through the origin and the point (4, 6). A second line crosses the y-axis at (0, 4) and passes through (4, 10). Derive the equation of each line.`, solution: 'First line: y = 1.5x. Second line: y = 1.5x + 4' },
      relatedLoIds: ['m8math.deriving-y-equals-mx-plus-b'],
    },
    {
      title: 'Worked read equation from graph',
      steps: [
        `Read b first. The line crosses the y-axis at (0, 5), so b = 5. That is the starting value: at x = 0, y is 5.`,
        `Now count rise over run between two grid points. From (0, 5) to (2, 1), the line goes DOWN 4 and right 2. A drop is a negative rise, so the rise is -4 and the run is 2, and m = -4 ÷ 2 = -2.`,
        `WRONG: writing y = 2x + 5 because the triangle is 4 tall and 2 wide. CORRECT: the line falls from left to right, so its slope is negative, and the equation is y = -2x + 5. The check catches the slip: y = 2x + 5 at x = 2 gives 2 × 2 + 5 = 9, but the graph shows the point (2, 1).`,
        `WRONG: writing y = 5x - 2, with the y-intercept in front of the x. CORRECT: m is the number that rides with x, because slope is the change in y for each step of 1 in x; b stands alone, because it is the height when x = 0. The slots are not interchangeable: y = 5x - 2 at x = 0 gives -2, but the line crosses the y-axis at 5.`,
        'Write the equation with each number in its own slot: y = -2x + 5.',
        `Check with the third point, (5, -5), which was not used to find m or b: -2 × 5 + 5 = -10 + 5 = -5. It matches, so the equation describes the whole line.`,
      ],
      example: { problem: `A graph shows a line that crosses the y-axis at (0, 5) and passes through the grid points (2, 1) and (5, -5). Write the equation of the line.`, solution: 'y = -2x + 5' },
      relatedLoIds: ['m8math.deriving-y-equals-mx-plus-b'],
    },
  ],
  pointers: [
    { content: `Students often say "y = 2x + 2" — b is the height of the line at x = 0, which is the crossing on the VERTICAL axis: the line crosses at (0, -4), so b = -4, sign included. The slope is right: from (0, -4) up to (2, 0) is a rise of 4 over a run of 2, so m = 2. The equation is y = 2x - 4. The check exposes the slip: y = 2x + 2 at x = 0 gives 2, but the graph shows the line at -4 there.`, kind: 'common-error' },
    { content: `Students often say "y = -4x + 2" — m rides with the x because it is the change in y for each step of 1 in x; b stands alone because it is the height at x = 0. Here m = 2 and b = -4, so y = 2x - 4. Test the swapped equation at x = 0: y = -4 × 0 + 2 = 2, but the line is at -4 when x = 0. Test the right equation: at x = 0, y = 2 × 0 - 4 = -4, and at x = 2, y = 2 × 2 - 4 = 0. Both points on the graph match.`, kind: 'common-error' },
    { content: `On a line through the origin, the slope triangle from (0, 0) to any point (x, y) has rise y and run x, so y ÷ x = m and the equation is y = mx.`, kind: 'tip' },
    { content: `On a line crossing the y-axis at (0, b), the rise from (0, b) to any point (x, y) is y - b, so (y - b) ÷ x = m and the equation is y = mx + b.`, kind: 'tip' },
    { content: `b is the starting value: the height of the line at x = 0, read where it crosses the y-axis, sign included.`, kind: 'tip' },
    { content: `To write the equation from a graph, read b off the y-axis crossing, count rise over run between two grid points for m, and put m with the x and b on its own.`, kind: 'tip' },
    { content: `A line that falls from left to right has a negative slope; a line that crosses the y-axis below the origin has a negative b.`, kind: 'tip' },
    { content: `y = mx is y = mx + b with b = 0. That is why a proportional relationship must pass through the origin, and why y = 2x + 3 is linear but not proportional.`, kind: 'tip' },
    { content: `b is where the line crosses the Y-AXIS, not the x-axis. Read b from the vertical axis. If the crossing is below the origin, b is negative.`, kind: 'common-error' },
    { content: `m rides with x, b stands alone. Don't swap them: y = mx + b, not y = bx + m. Check by plugging in x = 0; you should get b, the y-intercept.`, kind: 'gotcha' },
    { content: `When a line falls (slopes down left to right), the rise is negative. Don't just count the height of the triangle; check the direction. Falling line = negative slope.`, kind: 'common-error' },
    { content: `y = mx has no + b term because b = 0 at the origin. Don't add a +0; just write y = mx. A line through (0, 0) never needs an extra number tacked on.`, kind: 'vocab-note' },
    { content: `To find m from a graph, pick two points on grid lines (not on axes). Count the rise (up is +, down is -) and run (always +, left to right). Then divide rise by run.`, kind: 'tip' },
    { content: `The equation y = mx + b works for ANY point (x, y) on the line. If a point on the graph doesn't match your equation, you made an error—find it before you finish.`, kind: 'tip' },
    { content: `y = kx from last unit IS y = mx with the slope called k. Now you know k = m, and it's the ratio rise/run. Same idea, new name to match the new form.`, kind: 'vocab-note' },
  ],
};
