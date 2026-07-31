/**
 * Geometry — Triangles: Midsegments, Bisectors & Triangle Inequalities.
 *
 * The "special segments and size limits" lesson (CCSS G-CO.C.10): the
 * midsegment theorem, what perpendicular bisectors / angle bisectors /
 * medians guarantee, and the two inequality rules that say which triangles
 * can exist at all and which angle is biggest. Numeric work stays on
 * integer setups so every answer is an exact whole number.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U5_MIDSEGMENTS_BISECTORS_INEQUALITIES: LessonPlan = {
  id: 'evelyn.hs.geom.midsegments-bisectors-inequalities.v1',
  title: 'Midsegments, Bisectors & Triangle Inequalities',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.midsegments-bisectors-inequalities',
      standard: 'GEOM-5.5',
      description:
        'Apply the triangle midsegment theorem, the equidistance properties of perpendicular and angle bisectors, and the median/centroid ratio, and use the triangle inequality and side-angle relationships to decide which triangles can exist and order their parts (CCSS G-CO.C.10).',
    },
  ],
  prerequisites: ['geom.isosceles-equilateral'],
  followUps: ['geom.dilations-scale-factor'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame special segments and the triangle inequality as the rules that decide what can actually be built.',
      script:
        'Hand a carpenter three boards — 4 feet, 9 feet, and 13 feet — and ask for a triangular brace. They will hand two of them back: those lengths cannot close into a triangle, no matter how you turn them. Triangles have hard limits on their sides, and they also have a set of special interior segments that architects and designers lean on constantly: the brace joining two midpoints of a roof truss is automatically parallel to the beam below it and exactly half as long, every single time. Today you learn both — the segments inside a triangle that come with guarantees, and the size rules that say which triangles can exist at all.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-segments-and-limits',
      kind: 'concept',
      goal: 'Midsegment theorem, the three bisector/median guarantees, and the two inequality rules — plus the classic slips in each.',
      keyIdeas: [
        'MIDSEGMENT THEOREM — a midsegment joins the MIDPOINTS of two sides of a triangle. It is always parallel to the third side and exactly HALF its length. In △ABC with D the midpoint of AB and E the midpoint of AC: DE ∥ BC and DE = BC/2, so BC = 2(DE).',
        'DIRECTION MATTERS — the midsegment is the SHORTER of the pair. Going midsegment → third side you DOUBLE; going third side → midsegment you HALVE. Reversing this is the single most common midsegment error.',
        'PERPENDICULAR BISECTOR = EQUIDISTANT FROM THE ENDPOINTS — a line ⊥ to a segment through its midpoint. Every point on it is the same distance from the two ENDPOINTS, and the converse holds too. The three perpendicular bisectors of a triangle meet at the circumcenter, equidistant from all three vertices.',
        'ANGLE BISECTOR = EQUIDISTANT FROM THE SIDES — a ray cutting an angle into two equal angles. Every point on it is the same PERPENDICULAR distance from the two sides of the angle. The three angle bisectors meet at the incenter, equidistant from all three sides. Do not swap these two: perpendicular bisector → distance to points, angle bisector → distance to sides.',
        'MEDIAN & CENTROID — a median joins a vertex to the MIDPOINT of the opposite side (a bisector cuts an angle; a median cuts a side). The three medians meet at the centroid, which sits 2/3 of the way from each vertex: vertex-to-centroid : centroid-to-midpoint = 2 : 1.',
        'TRIANGLE INEQUALITY — the sum of any two sides must be GREATER than the third. Equal is not enough: 4 + 9 = 13 collapses flat onto a line, so 4, 9, 13 is not a triangle. Fast check: only the two SHORTEST sides need testing — if their sum beats the longest side, all three inequalities hold.',
        'THIRD-SIDE RANGE — given two sides a and b, the third side x must satisfy (a − b) < x < (a + b), using the positive difference. For sides 6 and 11 that is 5 < x < 17, endpoints excluded.',
        'SIDE-ANGLE ORDER — the largest angle sits OPPOSITE the longest side, and the smallest angle opposite the shortest side. Order the sides and the angles line up in the same order. The trap: the biggest angle is not at the vertices that NAME the longest side, it is across from it.',
      ],
      vocabulary: [
        { term: 'midsegment', definition: 'the segment joining the midpoints of two sides of a triangle; parallel to the third side and half its length.' },
        { term: 'centroid', definition: 'the point where the three medians of a triangle meet, located 2/3 of the way from each vertex to the opposite midpoint.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-midsegment',
      kind: 'worked_example',
      problem:
        'In △ABC, D is the midpoint of side AB and E is the midpoint of side AC. BC = 18 and ∠B = 54°. Find DE and ∠ADE.',
      steps: [
        'Check the setup: D and E are midpoints of two different sides, so DE is a midsegment of △ABC and the third side is BC.',
        'Apply the midsegment theorem for length: DE = BC/2 = 18/2 = 9. Sanity check — the midsegment must be SHORTER than the third side, and 9 < 18. ✓',
        'Apply the midsegment theorem for direction: DE ∥ BC. Side AB is a transversal cutting the two parallel segments.',
        '∠ADE and ∠ABC are corresponding angles on that transversal, so ∠ADE = ∠B = 54°.',
      ],
      answer: 'DE = 9 and ∠ADE = 54°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inequality-trap',
      kind: 'worked_example',
      problem:
        'A student says the lengths 4, 9, and 13 form a triangle because 4 + 13 = 17 > 9 and 9 + 13 = 22 > 4. Is the student right? Then find every whole-number length that COULD join sides 4 and 9.',
      steps: [
        'The student tested only two of the three pairs — and picked the two easy ones, both involving the longest side. Those always pass, so they prove nothing.',
        'Test the pair that matters, the two SHORTEST sides: 4 + 9 = 13, which is not greater than 13. It is exactly equal, so the two short sides lie flat along the long one and the triangle collapses to a line segment. The student is wrong: 4, 9, 13 is not a triangle.',
        'Now build the range for a third side x with sides 4 and 9: x must be less than the sum, x < 4 + 9 = 13, and greater than the positive difference, x > 9 − 4 = 5. So 5 < x < 13.',
        'Endpoints are excluded because equality means collapse, so the whole-number options are 6, 7, 8, 9, 10, 11, 12.',
      ],
      answer: 'No — 4 + 9 = 13 is not greater than 13. The third side must satisfy 5 < x < 13, so whole numbers 6 through 12 work.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-third-side',
      kind: 'try_yourself',
      problem:
        'A triangle has two sides of length 6 and 11. Which of these could be the length of its third side?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '16', correct: true },
        { id: 'b', text: '17' },
        { id: 'c', text: '5' },
        { id: 'd', text: '4' },
      ],
      expectedAnswer: '16',
      hints: [
        'The third side must be smaller than the sum of the other two and larger than their positive difference.',
        'The range is 11 − 6 < x < 11 + 6, that is 5 < x < 17 — and both endpoints are excluded because equality collapses the triangle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-largest-angle',
      kind: 'try_yourself',
      problem:
        'In △PQR, PQ = 8, QR = 5, and PR = 11. Which angle of the triangle has the greatest measure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '∠Q', correct: true },
        { id: 'b', text: '∠P' },
        { id: 'c', text: '∠R' },
        { id: 'd', text: 'It cannot be determined without the angle measures' },
      ],
      expectedAnswer: '∠Q',
      hints: [
        'Find the longest side first, then ask which angle is across from it — not which letters name it.',
        'The longest side is PR = 11; the vertex not used in the name PR is Q, so ∠Q is opposite it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In △ABC, D is the midpoint of AB and E is the midpoint of AC, so DE is a midsegment. DE = 2x + 3 and BC = 26. Solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'The midsegment is half the third side, so 2x + 3 = 26/2 = 13.',
        'Subtract 3 from both sides, then divide by 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-midsegment-direction',
      kind: 'misconception_check',
      question:
        'In △ABC, M is the midpoint of AB and N is the midpoint of BC, and MN = 8. A student concludes that AC = 4. What went wrong?',
      commonErrors: [
        {
          answer: 'AC = 4',
          misconception:
            'Halving in the wrong direction — applying "half" to the midsegment instead of to the third side, as if the midsegment were the longer segment.',
          correctsTo:
            'The midsegment is always the SHORTER one: MN = AC/2, so AC = 2(MN) = 2(8) = 16. Check the direction every time — if your third side comes out smaller than the midsegment, you halved when you should have doubled.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Midsegment theorem: joins two midpoints, is parallel to the third side, and is HALF its length — double to go back up.',
        'Perpendicular bisector → equidistant from the two ENDPOINTS (circumcenter); angle bisector → equidistant from the two SIDES (incenter); medians meet at the centroid in a 2 : 1 vertex-to-midpoint split.',
        'Triangle inequality: the two shortest sides must sum to MORE than the longest — equal means the triangle collapses.',
        'Third-side range: difference < x < sum, endpoints excluded.',
        'The largest angle lies opposite the longest side; ordering the sides orders the angles the same way.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.5', cedTitle: 'Midsegments, Bisectors & Triangle Inequalities' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
