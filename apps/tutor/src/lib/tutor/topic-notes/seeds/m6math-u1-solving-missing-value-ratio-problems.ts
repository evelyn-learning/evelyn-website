/**
 * Grade 6 Math — Unit 1 CED 1.3: Solving Missing-Value Ratio Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.solving-missing-value-ratio-problems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U1_SOLVING_MISSING_VALUE_RATIO_PROBLEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.solving-missing-value-ratio-problems.v1',
  course: 'Grade 6 Math',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Solving Missing-Value Ratio Problems',
  planId: 'evelyn.ms.m6math.solving-missing-value-ratio-problems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.solving-missing-value-ratio-problems.v1' }],
  theory: [
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'A ratio table lines up equivalent pairs', content: `A RATIO TABLE LINES UP EQUIVALENT PAIRS — every column in the table names the same ratio using different numbers. If the top row is red beads and the bottom row is blue beads, every column still means 3 red beads for every 5 blue beads.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'Find the scale factor first', content: `FIND THE SCALE FACTOR FIRST — to fill in a missing value, first figure out what number the known quantity was multiplied or divided by to reach the new column. That single number is the scale factor, and it must be applied to the OTHER quantity in that same column too.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'Multiply or divide, never add or subtract', content: `MULTIPLY OR DIVIDE, NEVER ADD OR SUBTRACT — a ratio only stays equivalent when both quantities are scaled by the same factor. Adding the same amount to both numbers, instead of multiplying by the same factor, changes the ratio, even though it feels like a fair thing to do.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'A double number line shows the same idea side by side', content: `A DOUBLE NUMBER LINE SHOWS THE SAME IDEA SIDE BY SIDE — two lines, lined up so that marks directly above and below each other are equivalent pairs. Sliding to a new mark on the top line and reading the mark lined up beneath it gives the missing partner value.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'Every ratio pair is a point on the coordinate plane', content: `EVERY RATIO PAIR IS A POINT ON THE COORDINATE PLANE — put the first quantity on the x-axis and the second quantity on the y-axis. Each pair of numbers from the ratio table, written as an ordered pair (x, y), becomes one point. Plotting several pairs from the same ratio produces points that line up in a straight path, though it takes later work to say more than that about why.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'framework', title: 'Check by working backward', content: `CHECK BY WORKING BACKWARD — after finding a missing value, divide the new pair back down by the same scale factor. The result should land exactly back on the original ratio. If it does not, the scale factor was applied to the wrong number or found incorrectly.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'definition', title: 'scale factor', content: `the number a known quantity is multiplied or divided by to reach a new, equivalent quantity in the same ratio.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'definition', title: 'equivalent ratios', content: `ratios that describe the same relationship between two quantities using different pairs of numbers, such as 3:5 and 12:20.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'definition', title: 'ordered pair', content: `two numbers written as (x, y) that give the location of one point on the coordinate plane.` },
    { loId: 'm6math.solving-missing-value-ratio-problems', kind: 'definition', title: 'coordinate plane', content: `a flat grid formed by a horizontal x-axis and a vertical y-axis, used to plot ordered pairs as points.` },
  ],
  methods: [
    {
      title: 'Worked bracelet beads',
      steps: [
        `Set up a ratio table with the known pattern in the first column: red beads 3, blue beads 5.`,
        `The new red bead count, 12, goes in the next column. Find the scale factor that turns 3 into 12: 12 divided by 3 is 4.`,
        'Apply that same scale factor, 4, to the blue beads: 5 times 4 is 20.',
        'The completed column is red beads 12, blue beads 20.',
        `Check by working backward: divide the new column by the scale factor, 4. 12 divided by 4 is 3, and 20 divided by 4 is 5. That lands right back on the original pattern, 3 to 5, so the answer holds.`,
        'Plot both pairs on the coordinate plane as ordered pairs: (3, 5) and (12, 20).',
      ],
      example: { problem: `Sam's bracelet pattern uses 3 red beads for every 5 blue beads. Sam has 12 red beads. How many blue beads are needed to keep the same pattern? Then plot both ratio pairs on the coordinate plane, with red beads on the x-axis and blue beads on the y-axis.`, solution: `20 blue beads; the ordered pairs (3, 5) and (12, 20) are plotted on the coordinate plane.` },
      relatedLoIds: ['m6math.solving-missing-value-ratio-problems'],
    },
    {
      title: 'Worked trail mix mini batch',
      steps: [
        `Set up the ratio table with the full recipe in the first column: oats 4, nuts 10.`,
        `The mini batch uses 2 cups of oats. Find the scale factor that turns 4 into 2: 2 divided by 4 is one half.`,
        'Apply that same scale factor, one half, to the nuts: 10 times one half is 5.',
        `WRONG: subtracting the same amount, 2, from both numbers instead, giving oats 4 minus 2 equals 2 and nuts 10 minus 2 equals 8. That produces the ratio 2 to 8, which simplifies to 1 to 4 — a different recipe, not the same one scaled down. CORRECT: multiply both numbers by the same scale factor, one half, giving oats 2 and nuts 5, which is 2 to 5 — the same recipe as 4 to 10, just a smaller batch.`,
        `Check by working backward: multiply the mini batch back up by 2 (the flip side of scaling by one half). 2 times 2 is 4 and 5 times 2 is 10, which matches the original recipe exactly.`,
        'Plot both pairs on the coordinate plane as ordered pairs: (4, 10) and (2, 5).',
      ],
      example: { problem: `A trail mix recipe uses 4 cups of oats for every 10 cups of mixed nuts. For a mini batch, only 2 cups of oats are used. How many cups of nuts are needed to keep the same recipe? Then plot both ratio pairs on the coordinate plane, with oats on the x-axis and nuts on the y-axis.`, solution: `5 cups of nuts; the ordered pairs (4, 10) and (2, 5) are plotted on the coordinate plane.` },
      relatedLoIds: ['m6math.solving-missing-value-ratio-problems'],
    },
  ],
  pointers: [
    { content: `Students often say "9 cups of sugar" — A ratio stays equivalent only when both quantities are multiplied by the same scale factor, not when the same amount is added to both. The scale factor from 2 to 8 is 8 divided by 2, which is 4. Multiply the sugar, 3, by that same factor: 3 times 4 is 12 cups of sugar.`, kind: 'common-error' },
    { content: `Students often say "24 cups of sugar" — The new flour amount, 8, is not the scale factor — it has to be compared to the original flour amount first. Divide 8 by 2 to get the scale factor, 4, and only then multiply the sugar by it: 3 times 4 is 12 cups of sugar. Checking backward confirms it: 12 divided by 4 is 3, and 8 divided by 4 is 2, which matches the original recipe, 2 to 3.`, kind: 'common-error' },
    { content: `A ratio table or double number line shows pairs of numbers that all describe the same ratio.`, kind: 'tip' },
    { content: `To find a missing value, first find the scale factor: the number the known quantity was multiplied or divided by to reach its matching partner.`, kind: 'tip' },
    { content: `Apply that same scale factor to the other quantity in the same column — never add or subtract the same amount, since that changes the ratio.`, kind: 'tip' },
    { content: `Check every answer by working backward: dividing (or multiplying) the new pair by the scale factor should land exactly back on the original ratio.`, kind: 'tip' },
    { content: `Each pair of values from the table becomes one point on the coordinate plane, written as an ordered pair (x, y), with the first quantity on the x-axis and the second on the y-axis.`, kind: 'tip' },
    { content: `Points plotted from the same ratio line up in a straight path, though naming that pattern with an equation comes in a later course.`, kind: 'tip' },
  ],
};
