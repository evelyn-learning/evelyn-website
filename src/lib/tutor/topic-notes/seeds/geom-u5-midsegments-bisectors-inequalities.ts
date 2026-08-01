/**
 * Geometry — Unit 5 CED 5.5: Midsegments, Bisectors & Triangle Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.midsegments-bisectors-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U5_MIDSEGMENTS_BISECTORS_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.midsegments-bisectors-inequalities.v1',
  course: 'Geometry',
  cedUnit: 5,
  cedTopic: '5.5',
  cedTitle: 'Midsegments, Bisectors & Triangle Inequalities',
  planId: 'evelyn.hs.geom.midsegments-bisectors-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.midsegments-bisectors-inequalities.v1' }],
  theory: [
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'framework', title: 'Midsegment theorem', content: `MIDSEGMENT THEOREM — a midsegment joins the MIDPOINTS of two sides of a triangle. It is always parallel to the third side and exactly HALF its length. In △ABC with D the midpoint of AB and E the midpoint of AC: DE ∥ BC and DE = BC/2, so BC = 2(DE).` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'framework', title: 'Direction matters', content: `DIRECTION MATTERS — the midsegment is the SHORTER of the pair. Going midsegment → third side you DOUBLE; going third side → midsegment you HALVE. Reversing this is the single most common midsegment error.` },
    { loId: 'geom.midsegments-bisectors-inequalities', content: `PERPENDICULAR BISECTOR = EQUIDISTANT FROM THE ENDPOINTS — a line ⊥ to a segment through its midpoint. Every point on it is the same distance from the two ENDPOINTS, and the converse holds too. The three perpendicular bisectors of a triangle meet at the circumcenter, equidistant from all three vertices.` },
    { loId: 'geom.midsegments-bisectors-inequalities', content: `ANGLE BISECTOR = EQUIDISTANT FROM THE SIDES — a ray cutting an angle into two equal angles. Every point on it is the same PERPENDICULAR distance from the two sides of the angle. The three angle bisectors meet at the incenter, equidistant from all three sides. Do not swap these two: perpendicular bisector → distance to points, angle bisector → distance to sides.` },
    { loId: 'geom.midsegments-bisectors-inequalities', content: `MEDIAN & CENTROID — a median joins a vertex to the MIDPOINT of the opposite side (a bisector cuts an angle; a median cuts a side). The three medians meet at the centroid, which sits 2/3 of the way from each vertex: vertex-to-centroid : centroid-to-midpoint = 2 : 1.` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'framework', title: 'Triangle inequality', content: `TRIANGLE INEQUALITY — the sum of any two sides must be GREATER than the third. Equal is not enough: 4 + 9 = 13 collapses flat onto a line, so 4, 9, 13 is not a triangle. Fast check: only the two SHORTEST sides need testing — if their sum beats the longest side, all three inequalities hold.` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'framework', title: 'Third-side range', content: `THIRD-SIDE RANGE — given two sides a and b, the third side x must satisfy (a − b) < x < (a + b), using the positive difference. For sides 6 and 11 that is 5 < x < 17, endpoints excluded.` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'framework', title: 'Side-angle order', content: `SIDE-ANGLE ORDER — the largest angle sits OPPOSITE the longest side, and the smallest angle opposite the shortest side. Order the sides and the angles line up in the same order. The trap: the biggest angle is not at the vertices that NAME the longest side, it is across from it.` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'definition', title: 'midsegment', content: `the segment joining the midpoints of two sides of a triangle; parallel to the third side and half its length.` },
    { loId: 'geom.midsegments-bisectors-inequalities', kind: 'definition', title: 'centroid', content: `the point where the three medians of a triangle meet, located 2/3 of the way from each vertex to the opposite midpoint.` },
  ],
  methods: [
    {
      title: 'Worked midsegment',
      steps: [
        `Check the setup: D and E are midpoints of two different sides, so DE is a midsegment of △ABC and the third side is BC.`,
        `Apply the midsegment theorem for length: DE = BC/2 = 18/2 = 9. Sanity check — the midsegment must be SHORTER than the third side, and 9 < 18. ✓`,
        `Apply the midsegment theorem for direction: DE ∥ BC. Side AB is a transversal cutting the two parallel segments.`,
        '∠ADE and ∠ABC are corresponding angles on that transversal, so ∠ADE = ∠B = 54°.',
      ],
      example: { problem: `In △ABC, D is the midpoint of side AB and E is the midpoint of side AC. BC = 18 and ∠B = 54°. Find DE and ∠ADE.`, solution: 'DE = 9 and ∠ADE = 54°' },
      relatedLoIds: ['geom.midsegments-bisectors-inequalities'],
    },
    {
      title: 'Worked inequality trap',
      steps: [
        `The student tested only two of the three pairs — and picked the two easy ones, both involving the longest side. Those always pass, so they prove nothing.`,
        `Test the pair that matters, the two SHORTEST sides: 4 + 9 = 13, which is not greater than 13. It is exactly equal, so the two short sides lie flat along the long one and the triangle collapses to a line segment. The student is wrong: 4, 9, 13 is not a triangle.`,
        `Now build the range for a third side x with sides 4 and 9: x must be less than the sum, x < 4 + 9 = 13, and greater than the positive difference, x > 9 − 4 = 5. So 5 < x < 13.`,
        `Endpoints are excluded because equality means collapse, so the whole-number options are 6, 7, 8, 9, 10, 11, 12.`,
      ],
      example: { problem: `A student says the lengths 4, 9, and 13 form a triangle because 4 + 13 = 17 > 9 and 9 + 13 = 22 > 4. Is the student right? Then find every whole-number length that COULD join sides 4 and 9.`, solution: `No — 4 + 9 = 13 is not greater than 13. The third side must satisfy 5 < x < 13, so whole numbers 6 through 12 work.` },
      relatedLoIds: ['geom.midsegments-bisectors-inequalities'],
    },
  ],
  pointers: [
    { content: `The midsegment is always the SHORTER one: MN = AC/2, so AC = 2(MN) = 2(8) = 16. Check the direction every time — if your third side comes out smaller than the midsegment, you halved when you should have doubled.`, kind: 'common-error' },
    { content: `Midsegment theorem: joins two midpoints, is parallel to the third side, and is HALF its length — double to go back up.`, kind: 'tip' },
    { content: `Perpendicular bisector → equidistant from the two ENDPOINTS (circumcenter); angle bisector → equidistant from the two SIDES (incenter); medians meet at the centroid in a 2 : 1 vertex-to-midpoint split.`, kind: 'tip' },
    { content: `Triangle inequality: the two shortest sides must sum to MORE than the longest — equal means the triangle collapses.`, kind: 'tip' },
    { content: 'Third-side range: difference < x < sum, endpoints excluded.', kind: 'tip' },
    { content: `The largest angle lies opposite the longest side; ordering the sides orders the angles the same way.`, kind: 'tip' },
    { content: `Midsegment direction: the midsegment is always the SHORTER one. Midsegment → third side = DOUBLE; third side → midsegment = HALVE. If your third side comes out smaller than the midsegment, you halved backwards.`, kind: 'common-error' },
    { content: `Identify which side is the 'third side' by naming the two vertices NOT shared by the midpoints. If M is the midpoint of AB and N of BC, the shared vertex is B, so the third side is AC — not AB or BC.`, kind: 'tip' },
    { content: `Perpendicular bisector → equidistant from the two ENDPOINTS (circumcenter). Angle bisector → equidistant from the two SIDES (incenter). Points vs. sides — don't swap the pair.`, kind: 'vocab-note' },
    { content: `A median goes to the MIDPOINT of the opposite side; an angle bisector splits the ANGLE. They are generally different segments (they coincide only in isosceles/equilateral cases), so don't assume a median bisects the vertex angle.`, kind: 'gotcha' },
    { content: `Triangle inequality is strictly GREATER than. 4 + 9 = 13 fails — the triangle flattens into a segment. Equality never counts, so range endpoints are always excluded: difference < x < sum.`, kind: 'edge-case' },
    { content: `Testing pairs that include the longest side is a waste — those always pass. Only the two SHORTEST sides need checking against the longest.`, kind: 'common-error' },
    { content: `The largest angle is ACROSS from the longest side, not at the letters that name it. With PQ = 8, QR = 5, PR = 11, the longest side is PR, so the biggest angle is ∠Q — the vertex left out of the name.`, kind: 'gotcha' },
    { content: `Centroid ratio is 2 : 1, not 1 : 2 or half. Vertex-to-centroid is the LONG piece (2/3 of the median); centroid-to-midpoint is 1/3. Check which piece the problem names before you multiply.`, kind: 'common-error' },
  ],
};
