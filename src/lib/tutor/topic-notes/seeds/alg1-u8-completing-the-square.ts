/**
 * Algebra 1 — Unit 8 CED 8.3: Completing the Square.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.completing-the-square.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U8_COMPLETING_THE_SQUARE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.completing-the-square.v1',
  course: 'Algebra 1',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Completing the Square',
  planId: 'evelyn.hs.alg1.completing-the-square.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.completing-the-square.v1' }],
  theory: [
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'The completion number', content: `THE COMPLETION NUMBER — for x² + bx, the number that finishes the square is (b/2)². HALVE first, THEN square. For b = 8 that is (8/2)² = 16, not 8² = 64.` },
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'Why it works', content: `WHY IT WORKS — (x + p)² expands to x² + 2px + p². So the middle coefficient is twice p, meaning p = b/2, and the constant you need is p² = (b/2)². Half of the middle coefficient always sits inside the parentheses: x² + bx + (b/2)² = (x + b/2)².` },
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'Solving an equation', content: `SOLVING AN EQUATION — 1) move the constant to the right, 2) add (b/2)² to BOTH sides, 3) factor the left as (x + b/2)², 4) square-root both sides, 5) isolate x. Skipping the right side breaks the balance and every answer after it is wrong.` },
    { loId: 'alg1.completing-the-square', content: `ALWAYS ± — square-rooting both sides gives two branches, because both +5 and −5 square to 25. Write x + b/2 = ±√(right side) or you lose one of the two solutions.` },
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'Leading coefficient not 1', content: `LEADING COEFFICIENT NOT 1 — divide (or factor) the a out first. 2x² + 12x − 4 = 0 becomes x² + 6x − 2 = 0, then x² + 6x = 2, then (x + 3)² = 11, so x = −3 ± √11.` },
    { loId: 'alg1.completing-the-square', content: `EQUATION vs EXPRESSION — on an equation you add (b/2)² to both sides. On an expression like y = x² + bx + c there is no second side, so you add AND subtract it in the same line: y = (x² + bx + (b/2)²) − (b/2)² + c. Adding without subtracting quietly changes the function.` },
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'Vertex form', content: `VERTEX FORM — that rewrite lands on y = a(x − h)² + k, whose vertex is (h, k). It is the fastest way to read a parabola off its equation: the h shifts it sideways, the k up or down.` },
    { loId: 'alg1.completing-the-square', kind: 'framework', title: 'Where the formula comes from', content: `WHERE THE FORMULA COMES FROM — complete the square on ax² + bx + c = 0 with letters instead of numbers and you get x = (−b ± √(b² − 4ac)) / (2a). The formula is not a separate trick; it is this lesson, done once, in general.` },
    { loId: 'alg1.completing-the-square', kind: 'definition', title: 'perfect-square trinomial', content: `a trinomial that factors as (x + p)² — its constant is the square of half its middle coefficient.` },
    { loId: 'alg1.completing-the-square', kind: 'definition', title: 'vertex form', content: 'y = a(x − h)² + k, which displays the vertex (h, k) of the parabola directly.' },
  ],
  methods: [
    {
      title: 'Worked solve equation',
      steps: [
        'Move the constant to the right: x² + 6x = 1.',
        'Half of 6 is 3, and 3² = 9. Add 9 to BOTH sides: x² + 6x + 9 = 10.',
        'The left side is now a perfect square: (x + 3)² = 10.',
        'Square-root both sides, keeping ±: x + 3 = ±√10.',
        `Subtract 3: x = −3 ± √10. Since √10 ≈ 3.16, the solutions are about 0.16 and −6.16.`,
        `Check x = −3 + √10: (−3 + √10)² = 19 − 6√10, and 6(−3 + √10) = −18 + 6√10. Adding gives 1, and 1 − 1 = 0. ✓`,
      ],
      example: { problem: 'Solve by completing the square: x² + 6x − 1 = 0', solution: 'x = −3 ± √10' },
      relatedLoIds: ['alg1.completing-the-square'],
    },
    {
      title: 'Worked vertex form',
      steps: [
        `Half of −5 is −5/2, and (−5/2)² = 25/4. This is an expression, not an equation, so add 25/4 and subtract it back in the same line: y = (x² − 5x + 25/4) − 25/4 + 2.`,
        'Factor the bracket as a perfect square: y = (x − 5/2)² − 25/4 + 2.',
        `Combine the constants: 2 = 8/4, so −25/4 + 8/4 = −17/4. Vertex form: y = (x − 5/2)² − 17/4.`,
        'Read the vertex off the form: (h, k) = (5/2, −17/4), i.e. (2.5, −4.25).',
        `Check by expanding: (x − 5/2)² = x² − 5x + 25/4, and 25/4 − 17/4 = 8/4 = 2, giving back x² − 5x + 2. ✓`,
        `Contrast: a student who adds 25/4 and forgets to subtract it gets y = (x − 5/2)² + 2, a different function shifted 25/4 too high.`,
      ],
      example: { problem: `Rewrite y = x² − 5x + 2 in vertex form and name the vertex. (Watch the one-sided bookkeeping — there is no second side to add to here.)`, solution: 'y = (x − 5/2)² − 17/4, vertex (5/2, −17/4)' },
      relatedLoIds: ['alg1.completing-the-square'],
    },
  ],
  pointers: [
    { content: `Whatever you add to complete the square must be added to BOTH sides: x² + 10x + 25 = 3 + 25, which gives (x + 5)² = 28.`, kind: 'common-error' },
    { content: `Both +√28 and −√28 square to 28, so x + 5 = ±√28 = ±2√7 and x = −5 ± 2√7. A quadratic has two solutions unless the squared side equals 0.`, kind: 'common-error' },
    { content: 'The completion number is (b/2)² — HALVE, then square. Never b².', kind: 'tip' },
    { content: `On an equation, add it to BOTH sides; on an expression, add and subtract it in the same line.`, kind: 'tip' },
    { content: `Factor as (x + b/2)², then square-root both sides WITH ± — two solutions, not one.`, kind: 'tip' },
    { content: 'If the leading coefficient is not 1, divide it out before you start.', kind: 'tip' },
    { content: `The same move turns y = ax² + bx + c into vertex form y = a(x − h)² + k with vertex (h, k) — and, done with letters, produces the quadratic formula.`, kind: 'tip' },
    { content: `Halve **then** square. For x² + 8x the completion number is (8/2)² = 16, never 8² = 64 and never 8/2 = 4 alone. Say "half of b, squared" out loud each time.`, kind: 'common-error' },
    { content: `Equation ⇒ add (b/2)² to BOTH sides. Expression (y = ...) ⇒ add AND subtract it on the same line. Mixing these up either unbalances the equation or silently shifts the graph vertically.`, kind: 'gotcha' },
    { content: `Write ± the instant you take a square root: x + 5 = ±√28, not √28. Dropping it loses a real solution. Only when the squared side equals 0 is there one answer.`, kind: 'common-error' },
    { content: `In (x − h)² the vertex x-coordinate is +h, not −h. y = (x + 5)² − 7 has vertex (−5, −7); y = (x − 5/2)² − 17/4 has vertex (5/2, −17/4). Flip the sign inside the parentheses.`, kind: 'gotcha' },
    { content: `If a ≠ 1, divide the whole equation by a *before* computing (b/2)². Completing the square on 2x² + 12x uses b = 6 after dividing, not b = 12.`, kind: 'edge-case' },
    { content: `Odd b is normal, not a sign you did it wrong — you get fractions. For x² − 5x, (b/2)² = 25/4. Keep exact fractions with common denominators; don't round to 6.25 mid-problem.`, kind: 'edge-case' },
    { content: `"Perfect-square trinomial" means the constant equals (half the middle coefficient)² — x² + 6x + 9 qualifies, x² + 6x + 8 does not. Don't call any factorable trinomial a perfect square.`, kind: 'vocab-note' },
    { content: `Simplify the radical and leave answers exact: x = −5 ± 2√7, not −5 ± 5.29. Then sanity-check by expanding your vertex form or plugging one root back in.`, kind: 'tip' },
  ],
};
