/**
 * Geometry — Unit 9 CED 9.3: Tangents, Secants & Angle Measures.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.tangents-secants-angles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U9_TANGENTS_SECANTS_ANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.tangents-secants-angles.v1',
  course: 'Geometry',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Tangents, Secants & Angle Measures',
  planId: 'evelyn.hs.geom.tangents-secants-angles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.tangents-secants-angles.v1' }],
  theory: [
    { loId: 'geom.tangents-secants-angles', content: `TANGENT ⊥ RADIUS — a tangent line touches a circle at exactly one point, the point of tangency, and the radius drawn to that point is PERPENDICULAR to the tangent. Drawing that radius is the first move in every tangent-length problem: it manufactures a right triangle you can finish with the Pythagorean Theorem.` },
    { loId: 'geom.tangents-secants-angles', kind: 'framework', title: 'Two tangents from one point', content: `TWO TANGENTS FROM ONE POINT — if PA and PB are tangent to the same circle from external point P, then PA = PB. The two tangent segments are congruent, so △PAB is isosceles. (Reason: the two right triangles formed by the radii share hypotenuse PO and have equal radii.)` },
    { loId: 'geom.tangents-secants-angles', content: `VERTEX ON THE CIRCLE (TANGENT-CHORD) — an angle formed by a tangent and a chord meeting at the point of tangency is HALF its intercepted arc: m∠ = ½ (arc). Nothing new happened — this is the inscribed-angle rule with one side slid outward until it became a tangent.` },
    { loId: 'geom.tangents-secants-angles', kind: 'framework', title: 'Vertex inside', content: `VERTEX INSIDE — two chords crossing at a point E inside the circle: the angle is HALF the SUM of the arc it intercepts and the arc its vertical angle intercepts. m∠ = ½ (first arc + second arc). Notice it is BIGGER than an inscribed angle on either arc alone.` },
    { loId: 'geom.tangents-secants-angles', kind: 'framework', title: 'Vertex outside', content: `VERTEX OUTSIDE — two secants, a secant and a tangent, or two tangents meeting at an external point P: the angle is HALF the DIFFERENCE of the two intercepted arcs, FAR arc minus NEAR arc. m∠P = ½ (far − near). The result is always positive; a negative answer means you subtracted backwards.` },
    { loId: 'geom.tangents-secants-angles', kind: 'framework', title: 'One story, four vertex positions', content: `ONE STORY, FOUR VERTEX POSITIONS — center: angle = the whole arc. On the circle: half of ONE arc. Inside: half the SUM. Outside: half the DIFFERENCE. Walk the vertex from the center outward and the angle keeps SHRINKING — that ordering is a free sanity check on every answer.` },
    { loId: 'geom.tangents-secants-angles', content: `ARCS CLOSE TO 360° — all the arcs around a circle add to 360°. Exterior-angle problems usually hand you one arc and expect you to recover the other by subtracting from 360° BEFORE applying the rule. Skipping that recovery step is the most common wrong answer in this lesson.` },
    { loId: 'geom.tangents-secants-angles', content: `CLASSIC ERROR: WRONG OPERATION FOR THE VERTEX — adding the arcs when the vertex is outside, or subtracting them when it is inside. Locate the vertex first, write "sum" or "difference" down next to it, and only then start computing.` },
    { loId: 'geom.tangents-secants-angles', kind: 'definition', title: 'secant', content: `a line that intersects a circle at exactly two points (a chord extended in both directions).` },
    { loId: 'geom.tangents-secants-angles', kind: 'definition', title: 'point of tangency', content: `the single point where a tangent line touches the circle — the radius drawn there is perpendicular to the tangent.` },
  ],
  methods: [
    {
      title: 'Worked inside chords',
      steps: [
        `Locate the vertex: E is INSIDE the circle, where two chords cross — so the half-the-SUM rule applies.`,
        `Find the two arcs for ∠AEB: it opens onto arc AB = 70°, and its VERTICAL angle ∠CED opens onto arc CD = 50°. Those are the two intercepted arcs.`,
        'Apply the rule: m∠AEB = ½ (70° + 50°) = ½ (120°) = 60°.',
        `∠BEC is the supplement of ∠AEB along the straight chord AC, so m∠BEC = 180° − 60° = 120°.`,
        `Check it with the rule instead: ∠BEC intercepts arc BC and arc AD, and those two arcs make up the rest of the circle: 360° − 70° − 50° = 240°. So m∠BEC = ½ (240°) = 120°. ✓`,
      ],
      example: { problem: `In circle O, points A, B, C, and D lie on the circle in that order. Chords AC and BD cross at point E inside the circle. Arc AB measures 70° and arc CD measures 50°. Find m∠AEB and m∠BEC.`, solution: 'm∠AEB = 60° and m∠BEC = 120°' },
      relatedLoIds: ['geom.tangents-secants-angles'],
    },
    {
      title: 'Worked outside sum trap',
      steps: [
        `Locate the vertex: P is OUTSIDE the circle, so the rule is half the DIFFERENCE, not half the sum. The student used the inside-the-circle rule on an outside-the-circle picture.`,
        `Sort the two intercepted arcs: the FAR arc (the one across the circle from P) is arc TB = 160°; the NEAR arc (the one closest to P) is arc TA = 40°.`,
        'Apply the rule: m∠P = ½ (far − near) = ½ (160° − 40°) = ½ (120°) = 60°.',
        `Sanity check the 100°: an angle with its vertex ON the circle intercepting the 160° arc would measure ½ (160°) = 80°, and pulling the vertex OUTSIDE only shrinks the angle further. So ∠P must be under 80° — 100° was impossible before any arithmetic.`,
        `Tangent or secant makes no difference to the formula: at an external vertex it is always half the difference, whether the sides are two secants, a secant and a tangent, or two tangents.`,
      ],
      example: { problem: `From a point P outside circle O, a tangent touches the circle at T and a secant passes through the circle at A (the nearer point) and then B (the farther point). The far arc TB (the arc from T to B not containing A) measures 160°, and the near arc TA (from T to A not containing B) measures 40°. A student writes m∠P = ½ (160° + 40°) = 100°. Find the correct measure of ∠P and name the error.`, solution: `m∠P = 60° — an external vertex takes half the DIFFERENCE of the arcs (far minus near), not half the sum.` },
      relatedLoIds: ['geom.tangents-secants-angles'],
    },
  ],
  pointers: [
    { content: `An external vertex uses half the DIFFERENCE of TWO arcs. The near arc is whatever is left of the 360°: 360° − 220° = 140°. So m∠P = ½ (220° − 140°) = ½ (80°) = 40°. Cross-check with the radii: OA ⊥ PA and OB ⊥ PB, so quadrilateral PAOB has angles 90° + 90° + 140° + m∠P = 360°, giving m∠P = 40°. ✓`, kind: 'common-error' },
    { content: `Find the vertex first: center → angle = the arc; ON the circle (inscribed OR tangent-chord) → half of ONE arc; INSIDE → half the SUM of two arcs; OUTSIDE → half the DIFFERENCE, far minus near.`, kind: 'tip' },
    { content: `A radius drawn to the point of tangency is perpendicular to the tangent — that right angle turns tangent-length questions into Pythagorean Theorem questions.`, kind: 'tip' },
    { content: `Two tangent segments drawn from the same external point are congruent, so the triangle they form with the chord of contact is isosceles.`, kind: 'tip' },
    { content: `All arcs around a circle total 360° — recover the missing arc by subtracting before you apply an external-angle rule.`, kind: 'tip' },
    { content: `Sanity check by moving the vertex: the angle shrinks as the vertex travels from the center, to the circle, to the outside. An external angle can never reach half the far arc.`, kind: 'tip' },
    { content: `Locate the vertex BEFORE picking a formula, and write "sum" or "difference" next to it. Inside → half the SUM; outside → half the DIFFERENCE (far − near). Choosing the wrong operation is the #1 error in this topic.`, kind: 'common-error' },
    { content: `In two-tangent problems the second arc is almost never given — recover it with 360° − (given arc). If a problem hands you exactly one arc and the vertex is outside, subtracting from 360° is a required step, not optional.`, kind: 'gotcha' },
    { content: `Half of ONE arc only works when the vertex is ON the circle. Applying m∠ = ½(arc) to an external vertex (e.g. ½ of 220° = 110°) is importing the inscribed-angle habit into the wrong picture.`, kind: 'common-error' },
    { content: `Sanity check by walking the vertex: center → whole arc, on circle → half of one arc, inside → bigger than either alone, outside → smallest. An external angle can never equal or exceed half the far arc.`, kind: 'tip' },
    { content: `A negative answer for an external angle means you did near − far. Always subtract the NEAR arc (the one closest to the vertex) from the FAR arc (the one across the circle).`, kind: 'common-error' },
    { content: `Say "secant" for a line hitting the circle twice and "chord" for the segment inside; a tangent touches at exactly ONE point, called the point of tangency. Don't call the tangent's touch point an "intersection point" of two arcs.`, kind: 'vocab-note' },
    { content: `For an inside vertex, the two arcs are the one the angle opens onto AND the one its VERTICAL angle opens onto — not the two arcs cut off by the same chord. The other pair of arcs belongs to the supplementary angle.`, kind: 'gotcha' },
    { content: `In tangent-length problems draw the radius to the point of tangency first — the right angle is what lets you use Pythagoras. OP is the HYPOTENUSE, so PT = √(13² − 5²) = 12, never √(13² + 5²).`, kind: 'edge-case' },
  ],
};
