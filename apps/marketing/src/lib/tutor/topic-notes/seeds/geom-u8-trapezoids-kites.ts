/**
 * Geometry — Unit 8 CED 8.4: Trapezoids & Kites.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.trapezoids-kites.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U8_TRAPEZOIDS_KITES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.trapezoids-kites.v1',
  course: 'Geometry',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Trapezoids & Kites',
  planId: 'evelyn.hs.geom.trapezoids-kites.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.trapezoids-kites.v1' }],
  theory: [
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Trapezoid', content: `TRAPEZOID — a quadrilateral with EXACTLY one pair of parallel sides. The parallel sides are the BASES; the other two are the LEGS. Base angles are the two angles sharing one base. The legs are never parallel — that is what keeps a trapezoid out of the parallelogram family.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Same-side angles are supplementary', content: `SAME-SIDE ANGLES ARE SUPPLEMENTARY — each leg is a transversal crossing the two parallel bases, so the two angles on the SAME leg add to 180°. In trapezoid ABCD with AB ∥ DC, ∠A + ∠D = 180° and ∠B + ∠C = 180°.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Isosceles trapezoid', content: `ISOSCELES TRAPEZOID — legs congruent. That single condition buys three things: each PAIR of base angles is congruent, the DIAGONALS are congruent, and opposite angles are supplementary. Careful: the two angles on the top base and the two on the bottom base are congruent within their own pair, NOT across pairs.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Midsegment', content: `MIDSEGMENT — the segment joining the midpoints of the two LEGS (not the bases). It is parallel to both bases and its length is their AVERAGE: m = (b1 + b2)/2. Working backwards from the midsegment, double first: b2 = 2m - b1.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Kite', content: `KITE — two pairs of CONSECUTIVE congruent sides, with the opposite sides never congruent. The two vertices where a congruent pair meets are the VERTEX angles; the other two are the non-vertex angles.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Kite diagonals', content: `KITE DIAGONALS — always ⊥ to each other. The main diagonal (joining the two vertex angles) is the axis of symmetry: it BISECTS the other diagonal and bisects both vertex angles. Only ONE diagonal gets bisected — kites are not rhombuses.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Kite angles', content: `KITE ANGLES — exactly ONE pair of opposite angles is congruent, and it is the NON-vertex pair. The vertex angles are generally different. All four still sum to 360°, so the fourth angle comes from subtraction.` },
    { loId: 'geom.trapezoids-kites', kind: 'framework', title: 'Area', content: `AREA — kite area = (d1 × d2)/2, using the two diagonals. Trapezoid area = (b1 + b2)/2 × h, which is just midsegment × height.` },
    { loId: 'geom.trapezoids-kites', kind: 'definition', title: 'midsegment of a trapezoid', content: `the segment connecting the midpoints of the two legs; it is parallel to both bases and equals their average.` },
    { loId: 'geom.trapezoids-kites', kind: 'definition', title: 'vertex angle of a kite', content: `an angle at a vertex where two congruent sides meet; the main diagonal bisects both vertex angles.` },
  ],
  methods: [
    {
      title: 'Worked isosceles angles',
      steps: [
        `Congruent legs means this is an ISOSCELES trapezoid, so each pair of base angles is congruent.`,
        '∠Z and ∠Y both sit on the base ZY, so they are a base-angle pair: ∠Y = ∠Z = 68°.',
        `Leg WZ is a transversal between the parallel bases, so ∠W and ∠Z are same-side angles: ∠W = 180° - 68° = 112°.`,
        `∠X pairs with ∠W on base WX, so ∠X = 112°. Check the total: 68 + 68 + 112 + 112 = 360°. ✓`,
      ],
      example: { problem: `In trapezoid WXYZ the vertices are listed in order, WX ∥ ZY, and the legs WZ and XY are congruent. If ∠Z = 68°, find ∠Y, ∠W, and ∠X.`, solution: '∠Y = 68°, ∠W = 112°, ∠X = 112°' },
      relatedLoIds: ['geom.trapezoids-kites'],
    },
    {
      title: 'Worked kite angle trap',
      steps: [
        `Identify the vertex angles: the congruent pairs meet at A (AB = AD) and at C (CB = CD), so ∠A and ∠C are the VERTEX angles and ∠B, ∠D are the non-vertex pair.`,
        `The congruent pair in a kite is the NON-vertex pair, so ∠D = ∠B = 96°. The student borrowed the parallelogram rule "opposite angles are congruent" and applied it to the wrong pair — vertex angles are generally unequal.`,
        `Use the quadrilateral angle sum: ∠A + ∠B + ∠C + ∠D = 360°, so 118 + 96 + ∠C + 96 = 360.`,
        `Combine the knowns: 310 + ∠C = 360, so ∠C = 50°. Sanity check: 118 + 96 + 50 + 96 = 360°. ✓`,
      ],
      example: { problem: `Kite ABCD has vertices in order with AB = AD and CB = CD. Given ∠A = 118° and ∠B = 96°, a student answers "∠C = 118°, because opposite angles of a kite are congruent." Find ∠C correctly and explain the error.`, solution: '∠C = 50° — in a kite only the NON-vertex angles (∠B and ∠D) are congruent' },
      relatedLoIds: ['geom.trapezoids-kites'],
    },
  ],
  pointers: [
    { content: `The midsegment is the AVERAGE: (12 + 20)/2 = 16. A quick sanity check catches this instantly — the midsegment sits between the bases, so its length must land BETWEEN 12 and 20, never above both.`, kind: 'common-error' },
    { content: `Undo the average before you undo the addition: from m = (b1 + b2)/2, multiply by 2 to get b1 + b2 = 2m, then b2 = 2m - b1.`, kind: 'common-error' },
    { content: `Trapezoid = exactly one pair of parallel sides; angles on the SAME leg are supplementary.`, kind: 'tip' },
    { content: `Isosceles trapezoid: congruent legs → congruent base angles within each pair and congruent diagonals.`, kind: 'tip' },
    { content: `Midsegment joins the LEG midpoints and equals the AVERAGE of the bases: m = (b1 + b2)/2, so b2 = 2m - b1.`, kind: 'tip' },
    { content: `Kite: two pairs of consecutive congruent sides, diagonals ⊥, only the main diagonal bisects the other, and only the NON-vertex angles are congruent.`, kind: 'tip' },
    { content: `In a kite, only the **NON-vertex** angles are congruent. Don't import "opposite angles are congruent" from parallelograms — the vertex angles (where the congruent sides meet) are usually unequal. Find the last vertex angle with the 360° sum.`, kind: 'common-error' },
    { content: `Midsegment = AVERAGE, not sum: m = (b1 + b2)/2. Sanity check — the midsegment length must land strictly BETWEEN the two bases. If your answer is bigger than both, you forgot to divide by 2.`, kind: 'common-error' },
    { content: `Working backwards from a midsegment: DOUBLE first, then subtract. b2 = 2m − b1, not m − b1. With m = 17 and b1 = 12 the answer is 22, not 5.`, kind: 'gotcha' },
    { content: `The midsegment joins the midpoints of the **LEGS**, never the bases. A segment between base midpoints is not the midsegment and has no average property.`, kind: 'vocab-note' },
    { content: `"Base angles are congruent" means congruent WITHIN a pair on the same base — not across bases. In an isosceles trapezoid the top pair and bottom pair are supplementary to each other, so 68° and 112° coexist. Always verify all four angles sum to 360°.`, kind: 'gotcha' },
    { content: `Angles that are supplementary are the two on the SAME LEG (same-side interior angles), not the two on the same base. Trace the leg as a transversal before you write x + y = 180.`, kind: 'common-error' },
    { content: `In a kite, both diagonals are perpendicular but only the MAIN diagonal (joining the vertex angles) is an axis of symmetry — it bisects the other diagonal and both vertex angles. The shorter diagonal does not bisect anything. Kites are not rhombuses.`, kind: 'edge-case' },
    { content: `A trapezoid has EXACTLY one pair of parallel sides, so no parallelogram, rectangle, or rhombus counts as one. Don't apply "opposite sides congruent" or "diagonals bisect each other" to a trapezoid — only the isosceles version gives congruent diagonals (which do NOT bisect).`, kind: 'vocab-note' },
  ],
};
