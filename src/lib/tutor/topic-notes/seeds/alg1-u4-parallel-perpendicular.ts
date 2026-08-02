/**
 * Algebra 1 — Unit 4 CED 4.5: Equations of Parallel & Perpendicular Lines.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.parallel-perpendicular.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U4_PARALLEL_PERPENDICULAR: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.parallel-perpendicular.v1',
  course: 'Algebra 1',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'Equations of Parallel & Perpendicular Lines',
  planId: 'evelyn.hs.alg1.parallel-perpendicular.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.parallel-perpendicular.v1' }],
  theory: [
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Parallel', content: `PARALLEL — same slope, different y-intercept. If both lines had the same slope AND the same intercept they would be the same line, not a parallel pair.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Perpendicular', content: `PERPENDICULAR — opposite reciprocals: flip the fraction AND change the sign. Slope 2 pairs with −1/2; slope −3/4 pairs with 4/3; slope 1 pairs with −1. The two slopes always multiply to −1.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Both flips are required', content: `BOTH FLIPS ARE REQUIRED — a perpendicular pair always has one positive slope and one negative slope, so if your two slopes share a sign you have made an error. Just reciprocating (2 to 1/2) or just negating (2 to −2) is not enough.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Read the slope before you use it', content: `READ THE SLOPE BEFORE YOU USE IT — a line given in standard form like 4x + 2y = 10 does NOT have slope 4. Solve for y first: y = −2x + 5, so the slope is −2.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Three-step recipe', content: `THREE-STEP RECIPE — 1) find the given line's slope m, 2) build the new slope (m for parallel, −1/m for perpendicular), 3) drop that slope and the given point into point-slope form y − y₁ = m(x − x₁), then simplify to y = mx + b.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'The point picks the intercept', content: `THE POINT PICKS THE INTERCEPT — the slope rule alone gives infinitely many lines. The given point is what selects the single one, so always substitute it back at the end to confirm it satisfies your equation.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'framework', title: 'Special case', content: `SPECIAL CASE — a horizontal line y = c has slope 0 and a vertical line x = k has undefined slope. They are perpendicular even though 0 has no reciprocal; handle this pair by picture, not by the −1/m formula.` },
    { loId: 'alg1.parallel-perpendicular', kind: 'definition', title: 'opposite reciprocal', content: 'flip the fraction and change the sign — the opposite reciprocal of 3/4 is −4/3.' },
    { loId: 'alg1.parallel-perpendicular', kind: 'definition', title: 'point-slope form', content: 'y − y₁ = m(x − x₁), the fastest way to build a line from one point and a slope.' },
  ],
  methods: [
    {
      title: 'Worked parallel',
      steps: [
        'Read the slope of the given line: m = 2/3.',
        'Parallel means the SAME slope, so the new line also has slope 2/3.',
        'Point-slope with (6, 1): y − 1 = (2/3)(x − 6).',
        'Distribute: (2/3)(−6) = −4, so y − 1 = (2/3)x − 4.',
        'Add 1 to both sides: y = (2/3)x − 3.',
        `Check the point: (2/3)(6) − 3 = 4 − 3 = 1 ✓. And the intercept −3 differs from −4, so it is a genuinely different line. ✓`,
      ],
      example: { problem: `Write the equation of the line parallel to y = (2/3)x − 4 that passes through (6, 1).`, solution: 'y = (2/3)x − 3' },
      relatedLoIds: ['alg1.parallel-perpendicular'],
    },
    {
      title: 'Worked perpendicular standard form',
      steps: [
        `The line is in standard form, so the slope is NOT 4 — solve for y first: 2y = −4x + 10, then y = −2x + 5. The slope is −2.`,
        `Perpendicular slope is the opposite reciprocal of −2: flip to −1/2, then change the sign to get 1/2. (Careful: −1/2 is the trap — it keeps the original sign.)`,
        'Sanity check the pair: (−2) × (1/2) = −1 ✓.',
        `Point-slope with (−4, 3): y − 3 = (1/2)(x + 4). Subtracting a negative x-coordinate makes a plus sign.`,
        'Distribute and simplify: y − 3 = (1/2)x + 2, so y = (1/2)x + 5.',
        'Check the point: (1/2)(−4) + 5 = −2 + 5 = 3 ✓.',
      ],
      example: { problem: `Write the equation of the line perpendicular to 4x + 2y = 10 that passes through (−4, 3).`, solution: 'y = (1/2)x + 5' },
      relatedLoIds: ['alg1.parallel-perpendicular'],
    },
  ],
  pointers: [
    { content: `Opposite reciprocal means flip AND change the sign: −3/4 becomes 4/3. Test it — (−3/4) × (4/3) = −1 ✓, while (−3/4) × (−4/3) = +1 ✗. Two negative slopes both fall left-to-right, so they can never meet at a square corner.`, kind: 'common-error' },
    { content: 'Parallel = same slope, different y-intercept.', kind: 'tip' },
    { content: `Perpendicular = opposite reciprocal: flip the fraction and change the sign, so the slopes multiply to −1.`, kind: 'tip' },
    { content: 'Solve for y before reading a slope out of standard form.', kind: 'tip' },
    { content: `Slope + given point + point-slope form y − y₁ = m(x − x₁) builds the line; substitute the point back to check.`, kind: 'tip' },
    { content: `Horizontal and vertical lines are the perpendicular pair the −1/m rule cannot handle.`, kind: 'tip' },
    { content: `Perpendicular slopes must have OPPOSITE signs. If both of your slopes are negative (or both positive), you flipped without negating. Quick self-check: multiply them — you need exactly −1, not +1.`, kind: 'common-error' },
    { content: `Never read the slope straight off standard form. In 4x + 2y = 10 the slope is −2, not 4 and not 4/2. Solve for y first, every time.`, kind: 'gotcha' },
    { content: `In point-slope, y − y₁ = m(x − x₁), a negative coordinate flips the sign: the point (−4, 3) gives y − 3 = m(x + 4). Write the subtraction first, then simplify — don't guess the sign.`, kind: 'common-error' },
    { content: `"Parallel" requires a *different* y-intercept. If your answer comes out identical to the original equation, you wrote the same line, not a parallel one — recheck the point you substituted.`, kind: 'edge-case' },
    { content: `Horizontal (y = c, slope 0) and vertical (x = k, undefined slope) are perpendicular, but −1/m breaks: 1/0 is undefined and 0 has no reciprocal. Handle this pair by picture, not formula.`, kind: 'edge-case' },
    { content: `"Opposite reciprocal" means two changes, not one. Saying "the negative reciprocal of −3/4 is −4/3" repeats the sign instead of reversing it. Correct: 4/3.`, kind: 'vocab-note' },
    { content: `The slope rule alone gives infinitely many lines — the given point is what picks one. Always plug the point back into your final y = mx + b and confirm both sides match.`, kind: 'tip' },
    { content: `The reciprocal of a whole number is a fraction: perpendicular to slope 2 is −1/2, and perpendicular to slope −5 is 1/5. Rewrite the integer as 2/1 first if flipping it feels unclear.`, kind: 'gotcha' },
  ],
};
