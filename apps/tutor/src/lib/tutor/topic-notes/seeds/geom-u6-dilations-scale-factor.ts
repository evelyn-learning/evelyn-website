/**
 * Geometry — Unit 6 CED 6.1: Dilations & Scale Factor.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.dilations-scale-factor.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U6_DILATIONS_SCALE_FACTOR: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.dilations-scale-factor.v1',
  course: 'Geometry',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Dilations & Scale Factor',
  planId: 'evelyn.hs.geom.dilations-scale-factor.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.dilations-scale-factor.v1' }],
  theory: [
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'Two ingredients', content: `TWO INGREDIENTS — a dilation needs a CENTER point C and a SCALE FACTOR k. Every point P moves along ray CP to the image point P' with CP' = k · CP. The center itself never moves; it is the only fixed point (unless k = 1).` },
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'Rule at the origin', content: `RULE AT THE ORIGIN — with center (0, 0): (x, y) → (kx, ky). Multiply both coordinates. Nothing is added.` },
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'Rule away from the origin', content: `RULE AWAY FROM THE ORIGIN — with center (a, b): subtract, scale, add back. (x, y) → (a + k(x - a), b + k(y - b)). Measure the trip FROM the center, stretch that trip, then start again at the center.` },
    { loId: 'geom.dilations-scale-factor', content: `WHAT k TELLS YOU — k = image length / preimage length, always new over old. k > 1 enlarges, 0 < k < 1 reduces, k = 1 leaves the figure alone. Find k from any pair of corresponding sides, then confirm with a second pair.` },
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'Preserved vs scaled', content: `PRESERVED VS SCALED — angle measures are UNCHANGED (a 40° angle stays 40°, it does not become 40k°), parallel sides stay parallel, and betweenness/collinearity survive. Only distances change, each multiplied by k. Because size changes, a dilation is NOT a rigid motion: the image is SIMILAR to the preimage, not congruent.` },
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'Lines and the center', content: `LINES AND THE CENTER — a line through the center of dilation maps onto ITSELF; a line that misses the center maps to a PARALLEL line. This is the fact that makes similar figures line up so neatly.` },
    { loId: 'geom.dilations-scale-factor', content: `PERIMETER SCALES BY k, AREA SCALES BY k² — perimeter is a length, so it multiplies by k; area is a length times a length, so it multiplies by k². A dilation by 3 makes a shape 3 times as tall and 9 times as roomy. (Volume, later, scales by k³.)` },
    { loId: 'geom.dilations-scale-factor', kind: 'framework', title: 'The three classic errors', content: `THE THREE CLASSIC ERRORS — (1) ADDING instead of multiplying, which is a translation, not a dilation; (2) multiplying the coordinates directly when the center is NOT the origin; (3) flipping the ratio and reporting 1/k because you divided old by new.` },
    { loId: 'geom.dilations-scale-factor', kind: 'definition', title: 'center of dilation', content: `the fixed point every image point is measured from; distances from it are multiplied by the scale factor.` },
    { loId: 'geom.dilations-scale-factor', kind: 'definition', title: 'scale factor', content: 'the constant k equal to image length divided by the matching preimage length.' },
  ],
  methods: [
    {
      title: 'Worked origin dilation',
      steps: [
        `Center is the origin, so the rule is (x, y) → (kx, ky) with k = 1/2 — halve both coordinates of each vertex.`,
        `P(-4, 2) → P'(-2, 1). Q(6, 8) → Q'(3, 4). R(2, -6) → R'(1, -3).`,
        `Check with a length: PQ runs from (-4, 2) to (6, 8), a horizontal change of 10 and a vertical change of 6. P'Q' runs from (-2, 1) to (3, 4), a horizontal change of 5 and a vertical change of 3.`,
        `Both changes were halved, so P'Q' = (1/2) · PQ, exactly as k demands. Since 0 < k < 1 this is a reduction, and △P'Q'R' ~ △PQR with all three angle measures unchanged.`,
      ],
      example: { problem: `Triangle PQR has vertices P(-4, 2), Q(6, 8), and R(2, -6). Dilate it about the origin with scale factor k = 1/2, and check the result on side PQ.`, solution: `P'(-2, 1), Q'(3, 4), R'(1, -3) — a reduction similar to △PQR` },
      relatedLoIds: ['geom.dilations-scale-factor'],
    },
    {
      title: 'Worked center not origin',
      steps: [
        `Spot the error: the student used the origin rule (x, y) → (3x, 3y). That rule only works when the center IS the origin, and here the center is C(1, 2).`,
        'Subtract the center to get the trip from C to A: (7 - 1, 4 - 2) = (6, 2).',
        `Scale that trip by k = 3: (18, 6). The image is three times as far from C, in the same direction.`,
        `Add the center back: A' = (1 + 18, 2 + 6) = (19, 8).`,
        `Sanity check the fixed point: the correct rule leaves C itself in place — (1 + 3(1 - 1), 2 + 3(2 - 2)) = (1, 2). The student's rule would have moved C to (3, 6), so it could not have been a dilation centered at C.`,
      ],
      example: { problem: `A dilation has center C(1, 2) and scale factor k = 3. A student maps point A(7, 4) to (21, 12). Find the correct image A' and explain the error.`, solution: `A' = (19, 8); the student ignored the center and used the origin-only rule` },
      relatedLoIds: ['geom.dilations-scale-factor'],
    },
  ],
  pointers: [
    { content: `Area is a length times a length, so BOTH dimensions get multiplied by 3 — the area scales by k² = 9, giving 180 m². Perimeter is the one that scales by plain k. Quick check: a 4 by 5 plot dilates to 12 by 15, and 12 × 15 = 180.`, kind: 'common-error' },
    { content: `A dilation is defined by a CENTER and a SCALE FACTOR k: CP' = k · CP along ray CP, and the center never moves.`, kind: 'tip' },
    { content: `Origin rule: (x, y) → (kx, ky). Any other center (a, b): subtract, scale, add back — (x, y) → (a + k(x - a), b + k(y - b)).`, kind: 'tip' },
    { content: 'k = image length / preimage length. k > 1 enlarges, 0 < k < 1 reduces.', kind: 'tip' },
    { content: `Angle measures and parallelism survive; lengths scale by k, perimeter by k, area by k². The image is similar, never congruent (unless k = 1).`, kind: 'tip' },
    { content: `Before you multiply coordinates, ask: **is the center the origin?** If the center is any other point (a, b), you must subtract, scale, add back: (x, y) → (a + k(x−a), b + k(y−b)). Multiplying (7,4) by 3 when C(1,2) is a guaranteed wrong answer.`, kind: 'common-error' },
    { content: `k = **new over old** (image ÷ preimage). 12 cm → 18 cm gives k = 18/12 = 1.5, not 12/18. If you get k < 1 for a figure that clearly got bigger, you flipped the ratio.`, kind: 'common-error' },
    { content: `Angles do **not** scale. A 40° angle stays 40° under any k — it never becomes 40k°. Only distances get multiplied.`, kind: 'gotcha' },
    { content: `Length scales by k, perimeter by k, **area by k²**. Area 20 m² with k = 3 becomes 20·9 = 180 m², not 60. Verify with dimensions: 4×5 → 12×15 = 180.`, kind: 'common-error' },
    { content: `Say **similar**, not congruent. Dilations with k ≠ 1 are not rigid motions, so write △P'Q'R' ~ △PQR with the tilde, not ≅.`, kind: 'vocab-note' },
    { content: `Adding to coordinates is a **translation**, not a dilation. If your rule looks like (x+k, y+k), you've built the wrong transformation — dilation multiplies distances from the center.`, kind: 'common-error' },
    { content: `Quick check: plug the center into your own rule. A correct dilation rule leaves the center fixed. If C(1,2) maps to (3,6), your rule isn't centered at C.`, kind: 'tip' },
    { content: `Edge cases: k = 1 gives the identical figure (every point fixed, image congruent); a line **through** the center maps onto itself, while a line missing the center maps to a distinct **parallel** line — not to itself.`, kind: 'edge-case' },
  ],
};
