/**
 * Geometry — Unit 3 CED 3.3: Slopes & Equations of Parallel and Perpendicular Lines.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.slopes-parallel-perpendicular.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U3_SLOPES_PARALLEL_PERPENDICULAR: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.slopes-parallel-perpendicular.v1',
  course: 'Geometry',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Slopes & Equations of Parallel and Perpendicular Lines',
  planId: 'evelyn.hs.geom.slopes-parallel-perpendicular.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.slopes-parallel-perpendicular.v1' }],
  theory: [
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Slope is direction', content: `SLOPE IS DIRECTION — for two points on a line, m = rise/run = (y2 - y1)/(x2 - x1). Slope is the single number that encodes which way the line points, so two lines point the same way exactly when their slopes are equal.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Parallel test', content: `PARALLEL TEST — two DIFFERENT lines are parallel exactly when their slopes are equal. In y = mx + b form, equal m, different b. Written ∥.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Same slope, same intercept is not parallel', content: `SAME SLOPE, SAME INTERCEPT IS NOT PARALLEL — if m and b both match, the two equations describe the SAME line (coincident). Parallel lines share no points at all, so the intercepts must differ.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Perpendicular test', content: `PERPENDICULAR TEST — two lines are perpendicular (⊥) exactly when their slopes are negative reciprocals: flip the fraction AND change the sign. Equivalent check: the product of the two slopes is -1. Slope 3/4 pairs with -4/3; slope 5 pairs with -1/5.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Why negative reciprocal', content: `WHY NEGATIVE RECIPROCAL — turning a line 90° turns its slope triangle on its side: the rise becomes the run and the run becomes the rise, and one of the two changes sign. So rise/run becomes -run/rise. A quick sanity check: perpendicular slopes always have OPPOSITE signs, because one line must rise while the other falls.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'The one exception', content: `THE ONE EXCEPTION — a horizontal line (y = c) has slope 0 and a vertical line (x = k) has undefined slope. They are perpendicular, but the product test cannot be run because "undefined" is not a number. Handle this pair by inspection, not by multiplying.` },
    { loId: 'geom.slopes-parallel-perpendicular', content: `SOLVE FOR y BEFORE COMPARING — in standard form Ax + By = C the slope is NOT A. Isolate y first: 2x + 3y = 12 becomes y = -2/3 x + 4, so the slope is -2/3. Every comparison starts from y = mx + b form.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'framework', title: 'Building the new line', content: `BUILDING THE NEW LINE — the relationship gives the slope (copy it for parallel, negative-reciprocal it for perpendicular); the given point gives everything else. Substitute into point-slope form y - y1 = m(x - x1), then simplify to y = mx + b. Check both conditions at the end: the slope relationship holds, and the point satisfies your equation.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'definition', title: 'negative reciprocal', content: `the result of flipping a fraction and changing its sign — the negative reciprocal of 2/5 is -5/2.` },
    { loId: 'geom.slopes-parallel-perpendicular', kind: 'definition', title: 'point-slope form', content: `y - y1 = m(x - x1) — the equation of the line with slope m through the point (x1, y1).` },
  ],
  methods: [
    {
      title: 'Worked write perpendicular',
      steps: [
        'Read the slope of k straight off slope-intercept form: m = 2/3.',
        `Take the negative reciprocal for the perpendicular slope: flip 2/3 to 3/2, then change the sign, giving -3/2. Check: (2/3)(-3/2) = -1. ✓`,
        `Substitute the slope -3/2 and the point (6, -1) into point-slope form: y - (-1) = -3/2 (x - 6), which is y + 1 = -3/2 (x - 6).`,
        'Distribute and solve for y: y + 1 = -3/2 x + 9, so y = -3/2 x + 8.',
        `Check the point: at x = 6, y = -3/2 (6) + 8 = -9 + 8 = -1. ✓ The line passes through (6, -1) and has the required perpendicular slope.`,
      ],
      example: { problem: `Line k has equation y = (2/3)x + 5. Write the equation of the line perpendicular to k that passes through the point (6, -1). Give your answer in slope-intercept form.`, solution: 'y = -3/2 x + 8' },
      relatedLoIds: ['geom.slopes-parallel-perpendicular'],
    },
    {
      title: 'Worked standard form trap',
      steps: [
        `Spot the error: in Ax + By = C the coefficient A is not the slope. The equations must be solved for y first.`,
        `First line: 2x + 3y = 12 becomes 3y = -2x + 12, so y = -2/3 x + 4. Its slope is -2/3.`,
        `Second line: 3x - 2y = 6 becomes -2y = -3x + 6, so y = 3/2 x - 3. Its slope is 3/2.`,
        `Compare: the slopes have opposite signs and the fraction is flipped, so they are negative reciprocals. Product check: (-2/3)(3/2) = -6/6 = -1. ✓`,
        `The lines are PERPENDICULAR. The student compared the x-coefficients instead of the slopes, which only works when the y-coefficient happens to be 1.`,
      ],
      example: { problem: `A student is asked whether 2x + 3y = 12 and 3x - 2y = 6 are parallel, perpendicular, or neither. They answer: "The slopes are 2 and 3, so neither." Find the true relationship and name the error.`, solution: `Perpendicular — the slopes are -2/3 and 3/2, whose product is -1. The error was reading the slope off standard form without solving for y.` },
      relatedLoIds: ['geom.slopes-parallel-perpendicular'],
    },
  ],
  pointers: [
    { content: `Solve the second equation for y: -6y = -2x - 12, so y = (1/3)x + 2 — the identical equation. Same slope AND same intercept means one line drawn twice (coincident), and a line is not parallel to itself. Parallel lines share NO points: equal slopes, different intercepts.`, kind: 'common-error' },
    { content: `Parallel ∥: equal slopes, different y-intercepts. Equal slopes with equal intercepts is the same line, not a parallel pair.`, kind: 'tip' },
    { content: `Perpendicular ⊥: negative reciprocal slopes — flip and change the sign, so the product is -1. Opposite signs every time.`, kind: 'tip' },
    { content: `Horizontal (slope 0) and vertical (undefined slope) are perpendicular, but the product test cannot be used on them.`, kind: 'tip' },
    { content: 'Always solve for y before comparing: in Ax + By = C the slope is -A/B, not A.', kind: 'tip' },
    { content: `To build the line: take the slope from the relationship, the intercept from the point via y - y1 = m(x - x1), then check both.`, kind: 'tip' },
    { content: `In Ax + By = C the slope is **-A/B**, never A. Solve for y before you compare anything — and watch the sign when B is negative: 3x - 2y = 6 gives y = (3/2)x - 3, slope +3/2, not -3/2.`, kind: 'common-error' },
    { content: `Negative reciprocal means TWO changes: flip AND change sign. Answering -2/5 for a line of slope -5/2 (sign never changed) or 2/5 for slope 5/2 (sign changed but not flipped) are both wrong. Perpendicular slopes always have opposite signs.`, kind: 'common-error' },
    { content: `Equal slopes alone do NOT prove parallel — check the y-intercepts too. If m and b both match, it's one line drawn twice (coincident), and a line isn't parallel to itself. Parallel lines share zero points.`, kind: 'gotcha' },
    { content: `Horizontal (y = c, slope 0) and vertical (x = k, undefined slope) lines ARE perpendicular, but you can't multiply to show it — 'undefined' isn't a number, and 0 · anything ≠ -1. Handle this pair by inspection.`, kind: 'edge-case' },
    { content: `Say 'undefined slope' for vertical lines, not 'no slope' or 'slope 0'. Slope 0 is horizontal — a perfectly flat line that has a slope. Mixing these up flips your answer completely.`, kind: 'vocab-note' },
    { content: `When plugging a negative coordinate into y - y₁ = m(x - x₁), keep the subtraction visible: for (6, -1), write y - (-1) = m(x - 6), i.e. y + 1 = .... Dropping to y - 1 shifts your line by 2.`, kind: 'gotcha' },
    { content: `The given point never changes the slope — it only sets b. Don't compute a slope from the given point and the given line's intercept; get m from the relationship (copy it, or flip-and-negate it), then use the point.`, kind: 'common-error' },
    { content: `Finish by checking both conditions: does your slope match the required relationship, and does the given point actually satisfy your equation? Substitute the x-value back in — it takes ten seconds and catches every arithmetic slip.`, kind: 'tip' },
  ],
};
