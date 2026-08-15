/**
 * Geometry — Unit 8 CED 8.2: Parallelograms & Their Properties.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.parallelograms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U8_PARALLELOGRAMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.parallelograms.v1',
  course: 'Geometry',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Parallelograms & Their Properties',
  planId: 'evelyn.hs.geom.parallelograms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.parallelograms.v1' }],
  theory: [
    { loId: 'geom.parallelograms', kind: 'framework', title: 'The definition', content: `THE DEFINITION — a parallelogram is a quadrilateral with BOTH pairs of opposite sides parallel. In parallelogram ABCD (vertices named in order around the shape) that means AB ∥ DC and BC ∥ AD. Every property below is a consequence of that one line.` },
    { loId: 'geom.parallelograms', kind: 'framework', title: 'The property list', content: `THE PROPERTY LIST — opposite sides are congruent (AB ≅ DC, BC ≅ AD); opposite angles are congruent (∠A ≅ ∠C, ∠B ≅ ∠D); consecutive (adjacent) angles are SUPPLEMENTARY (∠A + ∠B = 180°); the diagonals BISECT each other (they cut each other into two equal halves at their intersection).` },
    { loId: 'geom.parallelograms', kind: 'framework', title: 'Why they hold', content: `WHY THEY HOLD — draw diagonal AC. The parallel sides make alternate interior angles congruent, AC is shared (Reflexive Property), so △ABC ≅ △CDA by ASA. CPCTC then hands you the congruent opposite sides and angles in one move. A parallelogram is really two congruent triangles glued along a diagonal.` },
    { loId: 'geom.parallelograms', kind: 'framework', title: 'Consecutive angles are not equal', content: `CONSECUTIVE ANGLES ARE NOT EQUAL — this is the top error. Consecutive angles sit between two parallel sides cut by a transversal, so they are same-side interior angles: they add to 180°. A parallelogram has only TWO distinct angle measures, x and 180° - x, alternating around the shape. All four angles are equal only in the rectangle case.` },
    { loId: 'geom.parallelograms', kind: 'framework', title: 'Bisect does not mean congruent', content: `BISECT DOES NOT MEAN CONGRUENT — the diagonals of a parallelogram always cut each other in half, but the two diagonals are usually DIFFERENT lengths, and they usually are not perpendicular. Congruent diagonals belong to rectangles; perpendicular diagonals belong to rhombuses.` },
    { loId: 'geom.parallelograms', content: `PROVING A QUADRILATERAL IS A PARALLELOGRAM (the converses) — any ONE of these is enough: both pairs of opposite sides parallel (definition); both pairs of opposite sides congruent; both pairs of opposite angles congruent; the diagonals bisect each other; or ONE pair of opposite sides both parallel AND congruent.` },
    { loId: 'geom.parallelograms', kind: 'framework', title: 'The false converse', content: `THE FALSE CONVERSE — one pair of opposite sides parallel and the OTHER pair congruent proves nothing: an isosceles trapezoid fits that description and is not a parallelogram. The parallel pair and the congruent pair must be the SAME pair of sides.` },
    { loId: 'geom.parallelograms', content: `AREA = BASE × HEIGHT — the height is the PERPENDICULAR distance between the two parallel bases, never the slanted side. A parallelogram with base 10 and slant side 6 does not have area 60 unless that side happens to be perpendicular to the base, which would make it a rectangle.` },
    { loId: 'geom.parallelograms', kind: 'definition', title: 'parallelogram', content: 'a quadrilateral with both pairs of opposite sides parallel.' },
    { loId: 'geom.parallelograms', kind: 'definition', title: 'consecutive angles', content: `two angles of a polygon that share a side; in a parallelogram they are supplementary.` },
  ],
  methods: [
    {
      title: 'Worked angles and sides',
      steps: [
        'Opposite angles are congruent, and ∠C is opposite ∠A, so ∠C = 62°.',
        `Consecutive angles are supplementary: ∠A and ∠B share side AB, so ∠B = 180° - 62° = 118°. (Do NOT copy 62° here — consecutive angles are supplementary, not congruent.)`,
        `∠D is opposite ∠B, so ∠D = 118°. Check the quadrilateral angle sum: 62° + 118° + 62° + 118° = 360°. ✓`,
        'Opposite sides are congruent, and DC is opposite AB, so DC = 9.',
      ],
      example: { problem: `ABCD is a parallelogram with vertices named in order, so AB ∥ DC and BC ∥ AD. Given ∠A = 62° and AB = 9, find ∠B, ∠C, ∠D, and the length of DC.`, solution: '∠B = 118°, ∠C = 62°, ∠D = 118°, DC = 9' },
      relatedLoIds: ['geom.parallelograms'],
    },
    {
      title: 'Worked false converse',
      steps: [
        `Match the givens against the valid conditions: one pair PARALLEL (WX and ZY) plus the OTHER pair CONGRUENT (XY and WZ). That combination is not on the list — the valid one-pair condition needs the same pair to be both parallel and congruent.`,
        `Hunt a counterexample. Build an isosceles trapezoid: let WX = 10 and ZY = 6 be the two parallel sides, with ZY centered under WX so each end overhangs by 2, and let the vertical distance between them be 3.`,
        `Each leg then spans 2 across and 3 up, so XY = WZ (both are the same slanted length) — the givens are satisfied exactly. But XY and WZ tilt toward each other, so they are NOT parallel, and the shape is a trapezoid, not a parallelogram.`,
        `Repair the reasoning: WX ∥ ZY together with WX ≅ ZY — the SAME pair, parallel and congruent — would force a parallelogram. Congruence on the other pair is the wrong pair.`,
      ],
      example: { problem: `In quadrilateral WXYZ (vertices in order), WX ∥ ZY and the other pair of opposite sides is congruent: XY ≅ WZ. A classmate concludes that WXYZ must be a parallelogram. Is that reasoning valid?`, solution: `Not valid — an isosceles trapezoid satisfies both givens without being a parallelogram; the parallel pair and the congruent pair must be the same pair.` },
      relatedLoIds: ['geom.parallelograms'],
    },
  ],
  pointers: [
    { content: `Bisecting means each diagonal is split into two equal halves at E: AE = EC and BE = ED. It says nothing about comparing AC to BD, and in a typical slanted parallelogram one diagonal is clearly longer than the other. Congruent diagonals are a RECTANGLE property, coming up next lesson.`, kind: 'common-error' },
    { content: `Definition: both pairs of opposite sides parallel — every other property follows from splitting the shape into two congruent triangles with a diagonal.`, kind: 'tip' },
    { content: `Opposite sides congruent, opposite angles congruent, consecutive angles SUPPLEMENTARY (not equal), diagonals bisect each other.`, kind: 'tip' },
    { content: `Bisect ≠ congruent: the halves of each diagonal match, but the two diagonals are generally different lengths.`, kind: 'tip' },
    { content: `To prove a parallelogram: both pairs of sides parallel, both pairs of sides congruent, both pairs of angles congruent, diagonals bisecting each other, or one pair that is both parallel AND congruent — never one pair parallel with the other pair congruent.`, kind: 'tip' },
    { content: `Consecutive angles are supplementary, NOT congruent. If ∠A = 62°, then ∠B = 118° — don't copy 62° over. Quick check: your four angles must total 360°, and a parallelogram only ever shows two distinct measures, x and 180° − x, alternating.`, kind: 'common-error' },
    { content: `"The diagonals bisect each other" means AE = EC and BE = ED — it says nothing about AC vs BD. Never write AC ≅ BD from that property; congruent diagonals belong to rectangles, perpendicular diagonals to rhombuses.`, kind: 'vocab-note' },
    { content: `One pair of opposite sides parallel plus the OTHER pair congruent proves nothing — an isosceles trapezoid fits. The valid shortcut requires the SAME pair to be both parallel and congruent.`, kind: 'gotcha' },
    { content: `Vertex order matters: in parallelogram ABCD, AB pairs with DC and BC pairs with AD. Letters are read around the shape, so AB and BC are consecutive sides — never treat AB and BC as an 'opposite' pair.`, kind: 'vocab-note' },
    { content: `In diagonal problems, set the two HALVES of the same diagonal equal (AE = EC), not a half of one diagonal to a half of the other. AE = 3x − 5, EC = x + 7 gives x = 6 — then plug back in to confirm both halves equal 13.`, kind: 'tip' },
    { content: `For area, height is the PERPENDICULAR distance between the parallel bases, never the slanted side. Base 10 with slant side 6 is not area 60 — that only works if the side is perpendicular, which makes it a rectangle.`, kind: 'common-error' },
    { content: `Each converse condition needs BOTH pairs (sides congruent, or angles congruent) — showing only AB ≅ DC, or only ∠A ≅ ∠C, is not enough. The single-pair exception exists only for parallel AND congruent together.`, kind: 'edge-case' },
    { content: `In proofs, justify opposite sides/angles with the two-triangle argument: alternate interior angles + Reflexive side → ASA → CPCTC. Citing 'opposite sides are congruent' as a reason before you've established it's a parallelogram is circular.`, kind: 'gotcha' },
  ],
};
