/**
 * Geometry — Unit 6 CED 6.2: Similar Polygons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.similar-polygons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U6_SIMILAR_POLYGONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.similar-polygons.v1',
  course: 'Geometry',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Similar Polygons',
  planId: 'evelyn.hs.geom.similar-polygons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.similar-polygons.v1' }],
  theory: [
    { loId: 'geom.similar-polygons', kind: 'framework', title: 'The two-part definition', content: `THE TWO-PART DEFINITION — polygon ABCD ~ polygon EFGH means BOTH conditions hold: every pair of corresponding ANGLES is congruent (∠A ≅ ∠E, ∠B ≅ ∠F, …) AND every pair of corresponding SIDES is proportional (AB/EF = BC/FG = CD/GH = DA/HE). One condition alone is not similarity.` },
    { loId: 'geom.similar-polygons', kind: 'framework', title: 'Letter order carries the matching', content: `LETTER ORDER CARRIES THE MATCHING — in ABCD ~ EFGH the pairing is A↔E, B↔F, C↔G, D↔H, so side AB pairs with EF and side BC with FG. Pair sides by position in the statement, never by "both look like the long one."` },
    { loId: 'geom.similar-polygons', content: `SCALE FACTOR k — the common ratio of corresponding sides. Going from ABCD to EFGH, k = EF/AB, and EVERY length in EFGH is k times its partner in ABCD. k > 1 enlarges, 0 < k < 1 shrinks, k = 1 is congruence — congruent polygons are the special case of similar.` },
    { loId: 'geom.similar-polygons', kind: 'framework', title: 'Angles alone fail', content: `ANGLES ALONE FAIL — a 4-by-6 rectangle and a 6-by-8 rectangle both have four 90° angles, yet 4/6 ≠ 6/8. Equal angles fix the corner shape but let one direction stretch more than the other. (Triangles are the one exception, and that is Topic 6.3.)` },
    { loId: 'geom.similar-polygons', kind: 'framework', title: 'Sides alone fail', content: `SIDES ALONE FAIL — a square and a non-square rhombus with the same side length have all four sides in a 1:1 ratio, but the rhombus leans. Proportional sides without matching angles is a squashed copy, not a similar one.` },
    { loId: 'geom.similar-polygons', kind: 'framework', title: 'Solving for a missing side', content: `SOLVING FOR A MISSING SIDE — write one proportion pairing a KNOWN pair with the unknown pair, e.g. AB/EF = BC/FG, then cross-multiply. Sense-check with the scale factor: does the answer land on the bigger side of the ratio when k > 1?` },
    { loId: 'geom.similar-polygons', content: `PERIMETER SCALES BY k, AREA SCALES BY k² — perimeter is a sum of lengths, so it scales like a length. Area is a product of two lengths, so it picks up the factor twice. Double every side and the perimeter doubles but the area quadruples.` },
    { loId: 'geom.similar-polygons', kind: 'definition', title: 'similar polygons', content: `polygons whose corresponding angles are all congruent and whose corresponding sides are all proportional; written with the ~ symbol.` },
    { loId: 'geom.similar-polygons', kind: 'definition', title: 'scale factor', content: 'the constant ratio k between corresponding side lengths of two similar figures.' },
  ],
  methods: [
    {
      title: 'Worked find missing side',
      steps: [
        `Read the letter order: A↔E, B↔F, C↔G, D↔H. So AB pairs with EF, and BC pairs with FG.`,
        `Find the scale factor from the one complete pair: k = EF/AB = 9/6 = 1.5. Every length in EFGH is 1.5 times its partner in ABCD.`,
        `Find FG by proportion: AB/EF = BC/FG, so 6/9 = 10/FG. Cross-multiply: 6 · FG = 90, so FG = 15.`,
        `Sense-check with k: 10 × 1.5 = 15. ✓ And since k > 1, EFGH should be the larger polygon — 15 > 10 confirms it.`,
        'Angles do NOT scale — similarity leaves them alone. ∠F ≅ ∠B, so ∠F = 115°.',
      ],
      example: { problem: `Quadrilateral ABCD ~ quadrilateral EFGH. In ABCD, AB = 6, BC = 10, CD = 14, and DA = 8. In EFGH, EF = 9. Find the scale factor from ABCD to EFGH, the length of FG, and the measure of ∠F given that ∠B = 115°.`, solution: 'k = 1.5, FG = 15, ∠F = 115°' },
      relatedLoIds: ['geom.similar-polygons'],
    },
    {
      title: 'Worked angles not enough',
      steps: [
        `Check the angle condition first: every angle of every rectangle is 90°, so all four corresponding pairs are congruent. That half of the definition passes.`,
        `Check the side condition using the letter order: JK pairs with PQ, and KL pairs with QR.`,
        'Compute both ratios: JK/PQ = 4/6 = 2/3 ≈ 0.67, and KL/QR = 6/8 = 3/4 = 0.75.',
        `2/3 ≠ 3/4, so the corresponding sides are NOT proportional — the second rectangle was stretched more in one direction than the other.`,
        `Similarity requires BOTH conditions, so these rectangles are not similar. To be similar with k = 6/4 = 1.5, PQRS would need sides 6 and 9; the 8 is too short.`,
      ],
      example: { problem: `Rectangle JKLM has JK = 4 and KL = 6. Rectangle PQRS has PQ = 6 and QR = 8, with J↔P, K↔Q, L↔R, M↔S. A classmate says: "Both are rectangles, so all four pairs of corresponding angles are 90° and congruent — the rectangles must be similar." Is that right?`, solution: `Not similar — the angles all match, but 4/6 ≠ 6/8, so the sides are not proportional.` },
      relatedLoIds: ['geom.similar-polygons'],
    },
  ],
  pointers: [
    { content: `Every length multiplies by 4, and area is built from two lengths, so area multiplies by 4² = 16: the larger hexagon has area 5 × 16 = 80 m². Perimeter is the measurement that scales by plain k.`, kind: 'common-error' },
    { content: `Similar polygons need BOTH: corresponding angles congruent AND corresponding sides proportional.`, kind: 'tip' },
    { content: `Letter order in ABCD ~ EFGH tells you which sides and angles correspond — pair by position, not by appearance.`, kind: 'tip' },
    { content: `The scale factor k multiplies every length; angles never change, and k = 1 is congruence.`, kind: 'tip' },
    { content: `Perimeter scales by k, area scales by k² — the most common similarity slip is using k for area.`, kind: 'tip' },
    { content: `Similarity needs BOTH conditions. Before you write "~", confirm corresponding angles are congruent AND corresponding sides are proportional. Rectangles show angles alone fail (4/6 ≠ 6/8); a square vs. a rhombus shows sides alone fail.`, kind: 'common-error' },
    { content: `Area scales by k², not k. With k = 4, area multiplies by 16 — not 4. Perimeter is the measurement that uses plain k. Write "P: k, A: k²" in the margin of every similarity problem.`, kind: 'common-error' },
    { content: `Pair sides by the letter order in the similarity statement, never by which side "looks longest." In ABCD ~ EFGH, AB↔EF and BC↔FG. If the figures are drawn rotated or flipped, the letters still rule.`, kind: 'gotcha' },
    { content: `Angles never scale. Multiplying an angle by k is always wrong — ∠B = 115° means ∠F = 115°, whatever k is. The scale factor applies only to lengths (sides, perimeters, diagonals, heights).`, kind: 'gotcha' },
    { content: `State the direction of k. k = EF/AB (small→large) gives 1.5; the same pair gives 2/3 going the other way. Both are correct scale factors for different directions — always say "from ___ to ___."`, kind: 'vocab-note' },
    { content: `k = 1 is a legitimate case: congruent polygons are similar. So "similar" does not mean "different sizes" — never rule out similarity just because two figures look identical.`, kind: 'edge-case' },
    { content: `Sense-check every missing side against k: if k > 1, your answer must be **larger** than its partner; if 0 < k < 1, smaller. Getting FG = 6.67 when k = 1.5 and BC = 10 means you flipped the ratio.`, kind: 'tip' },
    { content: `Don't borrow triangle shortcuts yet. "All angles congruent ⇒ similar" works only for triangles (Topic 6.3). For quadrilaterals and beyond you must still verify every side ratio.`, kind: 'gotcha' },
  ],
};
