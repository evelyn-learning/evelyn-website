/**
 * Grade 8 Math — Unit 8 CED 8.1: Translations & Reflections.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.translations-and-reflections.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U8_TRANSLATIONS_AND_REFLECTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.translations-and-reflections.v1',
  course: 'Grade 8 Math',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Translations & Reflections',
  planId: 'evelyn.ms.m8math.translations-and-reflections.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.translations-and-reflections.v1' }],
  theory: [
    { loId: 'm8math.translations-and-reflections', kind: 'framework', title: 'A translation is a slide, and its rule is an addition', content: `A TRANSLATION IS A SLIDE, AND ITS RULE IS AN ADDITION — every point of the figure moves the same distance in the same direction, so one rule covers all of them: (x, y) → (x + a, y + b). Moving right adds to x and moving left subtracts from it; moving up adds to y and moving down subtracts from it. A slide of 3 units right and 2 units down is the rule (x, y) → (x + 3, y - 2), so the point (1, 5) lands on (4, 3).` },
    { loId: 'm8math.translations-and-reflections', kind: 'framework', title: 'A reflection is a flip, and its rule is a sign change', content: `A REFLECTION IS A FLIP, AND ITS RULE IS A SIGN CHANGE — the axis is the mirror, and the one coordinate that measures distance from that mirror changes sign. Across the x-axis: (x, y) → (x, -y), so (4, 3) lands on (4, -3). Across the y-axis: (x, y) → (-x, y), so (4, 3) lands on (-4, 3). This is the same sign change you used on single points; the only new thing is doing it to every corner of a figure.` },
    { loId: 'm8math.translations-and-reflections', kind: 'framework', title: 'Move the vertices, then reconnect', content: `MOVE THE VERTICES, THEN RECONNECT — a figure is its vertices plus the straight sides joining them. Apply the rule to every vertex, mark each image vertex with a prime (A becomes A'), then join the image vertices in the same order the original was joined. You never move a middle point of a side, because a line always lands on a line: the image of side AB is the straight segment from A' to B', and any point on AB lands somewhere on that segment.` },
    { loId: 'm8math.translations-and-reflections', kind: 'framework', title: 'Lengths are preserved, and you can count to check', content: `LENGTHS ARE PRESERVED, AND YOU CAN COUNT TO CHECK — a slide moves the figure and a flip turns it over, but neither one stretches it. Check a horizontal or vertical side by counting grid units before and after: if AB runs from x = 1 to x = 5, it is 4 units long, and A'B' will be 4 units long too. Check a slanted side by its run and rise: if BC goes 4 units left and 3 units up, then B'C' goes 4 units and 3 units as well, so it has the same length and the same tilt.` },
    { loId: 'm8math.translations-and-reflections', kind: 'framework', title: 'Angles and parallel sides are preserved too', content: `ANGLES AND PARALLEL SIDES ARE PRESERVED TOO — if two sides met at a right angle before the motion, they meet at a right angle after it; a horizontal side meeting a vertical side is still horizontal meeting vertical. If two sides of the figure were parallel, running in the same direction, their images run in the same direction too, so they are still parallel. Because every side keeps its length and every angle keeps its measure, the image is the same size and the same shape as the original; it has only changed position, or been turned over.` },
    { loId: 'm8math.translations-and-reflections', kind: 'definition', title: 'translation', content: `a slide: every point of the figure moves the same distance in the same direction, by the rule (x, y) → (x + a, y + b).` },
    { loId: 'm8math.translations-and-reflections', kind: 'definition', title: 'reflection', content: `a flip across a line; across the x-axis, y changes sign, and across the y-axis, x changes sign.` },
    { loId: 'm8math.translations-and-reflections', kind: 'definition', title: 'preimage', content: 'the original figure, before the motion.' },
    { loId: 'm8math.translations-and-reflections', kind: 'definition', title: 'image', content: `the figure after the motion; its vertices are named with a prime, so A' is the image of A.` },
    { loId: 'm8math.translations-and-reflections', kind: 'definition', title: 'preserved', content: `unchanged by the motion; lengths, angle measures, and parallel sides are preserved by a slide or a flip.` },
  ],
  methods: [
    {
      title: 'Worked translate triangle',
      steps: [
        `Write the rule. Right 3 adds 3 to x, and down 4 subtracts 4 from y: (x, y) → (x + 3, y - 4).`,
        `Apply the rule to every vertex. A(1, 2) → A'(1 + 3, 2 - 4) = A'(4, -2). B(5, 2) → B'(5 + 3, 2 - 4) = B'(8, -2). C(1, 5) → C'(1 + 3, 5 - 4) = C'(4, 1). Join A' to B', B' to C', and C' to A', in the same order as the original.`,
        `Verify a line maps to a line. Every point on side AB has y = 2, and the rule turns y = 2 into y = -2, so every point of AB lands on the horizontal line through A'(4, -2) and B'(8, -2). Try a point on the slanted side too: the point (3, 3.5), halfway along BC, maps to (6, -0.5), and that is exactly halfway between B'(8, -2) and C'(4, 1), because (8 + 4) ÷ 2 = 6 and (-2 + 1) ÷ 2 = -0.5.`,
        `Verify lengths. AB runs from x = 1 to x = 5, so it is 5 - 1 = 4 units long; A'B' runs from x = 4 to x = 8, so it is 8 - 4 = 4 units long. AC runs from y = 2 to y = 5, so it is 3 units long; A'C' runs from y = -2 to y = 1, so it is 1 - (-2) = 3 units long. The slanted side BC goes 4 units left and 3 units up from B to C, and B'C' goes 4 units left and 3 units up from B'(8, -2) to C'(4, 1), so it has the same length and the same tilt.`,
        `Verify the angle. At A, the horizontal side AB meets the vertical side AC, which is a right angle. At A', the horizontal side A'B' meets the vertical side A'C', which is still a right angle. The image is the same size and shape as the original, just 3 units right and 4 units down.`,
        `Check by working backward: slide the image 3 units left and 4 units up with the rule (x, y) → (x - 3, y + 4). A'(4, -2) → (1, 2) = A, B'(8, -2) → (5, 2) = B, C'(4, 1) → (1, 5) = C. The original comes back, so the image is right.`,
      ],
      example: { problem: `Triangle ABC has vertices A(1, 2), B(5, 2), and C(1, 5). Translate it 3 units right and 4 units down. Give the image vertices, and verify that a line maps to a line, that the side lengths are preserved, and that the right angle at A is preserved.`, solution: `A'(4, -2), B'(8, -2), C'(4, 1); AB and A'B' are both 4 units, AC and A'C' are both 3 units, and the right angle at A is still a right angle at A'` },
      relatedLoIds: ['m8math.translations-and-reflections'],
    },
    {
      title: 'Worked reflect parallelogram',
      steps: [
        `Write the rule. The y-axis is the mirror, and x measures the distance from the y-axis, so x changes sign: (x, y) → (-x, y).`,
        `WRONG: writing P'(2, -1) by changing the sign of y. CORRECT: that is the rule for the x-axis. Across the y-axis, y stays and x flips. P is 2 units to the right of the y-axis, so its mirror image is 2 units to the left: P'(-2, 1).`,
        `Apply the rule to every vertex. P(2, 1) → P'(-2, 1). Q(6, 1) → Q'(-6, 1). R(7, 4) → R'(-7, 4). S(3, 4) → S'(-3, 4). Join P' to Q', Q' to R', R' to S', and S' to P'.`,
        `Verify lengths. PQ runs from x = 2 to x = 6, so it is 6 - 2 = 4 units long; P'Q' runs from x = -6 to x = -2, so it is -2 - (-6) = 4 units long. SR runs from x = 3 to x = 7, which is 4 units; S'R' runs from x = -7 to x = -3, which is -3 - (-7) = 4 units. The slanted side PS goes 1 unit right and 3 units up from P to S; P'S' goes 1 unit left and 3 units up from P'(-2, 1) to S'(-3, 4), so it covers the same run and rise and has the same length.`,
        `Verify the parallel pairs. PQ and SR are both horizontal, so they are parallel; P'Q' and S'R' both have y = 1 and y = 4 across their whole length, so both are still horizontal and still parallel. PS goes 1 right and 3 up, and QR goes from (6, 1) to (7, 4), also 1 right and 3 up, so PS and QR are parallel. In the image, P'S' goes 1 left and 3 up, and Q'R' goes from (-6, 1) to (-7, 4), also 1 left and 3 up. The flip turned both of them the same way, so they still run in the same direction as each other and are still parallel.`,
        `Check by working backward: reflecting the image across the y-axis again uses the same rule, (x, y) → (-x, y). P'(-2, 1) → (2, 1) = P, Q'(-6, 1) → (6, 1) = Q, R'(-7, 4) → (7, 4) = R, S'(-3, 4) → (3, 4) = S. Flipping twice brings the original back, so the image is right.`,
      ],
      example: { problem: `Parallelogram PQRS has vertices P(2, 1), Q(6, 1), R(7, 4), and S(3, 4). Reflect it across the y-axis. Give the image vertices, and verify that the side lengths are preserved and that the two pairs of parallel sides are still parallel.`, solution: `P'(-2, 1), Q'(-6, 1), R'(-7, 4), S'(-3, 4); every side keeps its length, P'Q' is still parallel to S'R', and P'S' is still parallel to Q'R'` },
      relatedLoIds: ['m8math.translations-and-reflections'],
    },
  ],
  pointers: [
    { content: `Students often say "The image of (3, 5) across the x-axis is (-3, 5)." — The x-axis is the mirror, and (3, 5) sits 5 units above it, so its image sits 5 units below it at (3, -5). The x-coordinate does not change, because the point does not move left or right. The full image is (3, -5), (7, -5), and (3, -8), directly below the original. Changing the sign of x is the rule for the y-axis, and it would have sent the triangle to the left instead of downward.`, kind: 'common-error' },
    { content: `Students often say "The translated triangle is bigger than the original." — The image vertices are (7, 9), (11, 9), and (7, 12). The original side from (3, 5) to (7, 5) is 7 - 3 = 4 units long, and its image from (7, 9) to (11, 9) is 11 - 7 = 4 units long. The vertical side went from 8 - 5 = 3 units to 12 - 9 = 3 units. Every side has the same length, every angle has the same measure, and the triangle is the same size; it has only slid 4 units right and 4 units up, farther from the origin.`, kind: 'common-error' },
    { content: `A translation is a slide with the rule (x, y) → (x + a, y + b): right or left changes x, up or down changes y, and every vertex moves by the same amounts.`, kind: 'tip' },
    { content: `A reflection is a flip across an axis, and the coordinate that changes sign is the one measuring distance from the mirror: across the x-axis, (x, y) → (x, -y); across the y-axis, (x, y) → (-x, y).`, kind: 'tip' },
    { content: `Apply the rule to every vertex, then join the image vertices in the same order; a line always lands on a line, so the image of a side is the straight segment between the image vertices.`, kind: 'tip' },
    { content: `Lengths and angle measures are preserved: count a horizontal or vertical side before and after, or match the run and rise of a slanted side, and a right angle stays a right angle.`, kind: 'tip' },
    { content: `Parallel sides stay parallel: two sides that ran in the same direction before the motion run in the same direction after it.`, kind: 'tip' },
    { content: `Check by working backward: slide the image back or flip it across the same axis again, and the original figure must reappear.`, kind: 'tip' },
    { content: `For reflections, the coordinate that changes sign is the one measuring distance from the mirror. Across the x-axis: y flips, x stays. Across the y-axis: x flips, y stays. Don't flip both.`, kind: 'common-error' },
    { content: `A translation moves every point the same distance in the same direction—the rule (x, y) → (x + a, y + b) uses the same numbers a and b for all vertices. If the figure gets bigger or smaller, you didn't translate; you scaled.`, kind: 'common-error' },
    { content: `When you apply a transformation rule, apply it to *every* vertex. Don't skip a corner or forget to include vertices at negative coordinates—the rule works on all of them the same way.`, kind: 'gotcha' },
    { content: `After you find the image vertices, join them in the same order as the original figure. If the original went A → B → C → A, the image must go A' → B' → C' → A'. Don't scramble the order or your figure won't match.`, kind: 'tip' },
    { content: `To check if you translated or reflected correctly, apply the *opposite* motion: slide the image back, or flip it across the same axis again. You should get the original figure back exactly.`, kind: 'tip' },
    { content: `For a horizontal or vertical side, count grid units to check that the length is preserved. For a slanted side, match the run (left/right) and rise (up/down) before and after—if both match, the length and tilt are the same.`, kind: 'vocab-note' },
    { content: `Negative coordinates need the sign rule too. If you translate (−2, 3) by (x, y) → (x + 5, y − 2), you get (3, 1), not (−2 + 5, −3 − 2). Treat negative numbers the same way you treat positive ones.`, kind: 'edge-case' },
    { content: `A reflected figure is not bigger or smaller, and its sides don't change direction relative to *each other*—only relative to the axes. Two parallel sides stay parallel after a flip because they turn the same way.`, kind: 'gotcha' },
  ],
};
