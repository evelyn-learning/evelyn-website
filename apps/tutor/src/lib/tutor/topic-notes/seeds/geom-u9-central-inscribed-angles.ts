/**
 * Geometry — Unit 9 CED 9.2: Central & Inscribed Angles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.central-inscribed-angles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U9_CENTRAL_INSCRIBED_ANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.central-inscribed-angles.v1',
  course: 'Geometry',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Central & Inscribed Angles',
  planId: 'evelyn.hs.geom.central-inscribed-angles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.central-inscribed-angles.v1' }],
  theory: [
    { loId: 'geom.central-inscribed-angles', kind: 'framework', title: 'Vertex decides the rule', content: `VERTEX DECIDES THE RULE — before writing anything, ask where the vertex sits. At the CENTER → central angle. ON the circle → inscribed angle. Same picture, two completely different formulas.` },
    { loId: 'geom.central-inscribed-angles', content: `CENTRAL ANGLE = ITS ARC — if O is the center, m∠AOB equals the measure of arc AB it cuts off. Central angles are how arcs get their degree measures in the first place.` },
    { loId: 'geom.central-inscribed-angles', content: `INSCRIBED ANGLE = HALF ITS ARC — if C is ON the circle and its two sides are chords CA and CB, then m∠ACB = ½ (arc AB). Read backwards: the arc is DOUBLE the inscribed angle.` },
    { loId: 'geom.central-inscribed-angles', kind: 'framework', title: 'Intercepted arc', content: `INTERCEPTED ARC — the arc lying INSIDE the angle, with endpoints where the two sides cross the circle. For inscribed ∠ACB the intercepted arc is arc AB not containing C. Pick the wrong arc and every number after it is wrong.` },
    { loId: 'geom.central-inscribed-angles', kind: 'framework', title: 'Same arc → same angle', content: `SAME ARC → SAME ANGLE — slide the vertex anywhere along the far arc and the inscribed angle does not change: all inscribed angles intercepting the same arc are congruent. That is the photographer's curve.` },
    { loId: 'geom.central-inscribed-angles', content: `SEMICIRCLE COROLLARY (THALES) — if the two sides of an inscribed angle end at the ends of a DIAMETER, the intercepted arc is 180°, so the angle is ½(180°) = 90°. Any angle inscribed in a semicircle is a right angle.` },
    { loId: 'geom.central-inscribed-angles', kind: 'framework', title: 'Inscribed quadrilateral', content: `INSCRIBED QUADRILATERAL — if all four vertices of a quadrilateral lie on the circle, each pair of OPPOSITE angles is supplementary (sums to 180°), because their two intercepted arcs together make the full 360°.` },
    { loId: 'geom.central-inscribed-angles', content: `CLASSIC ERROR: HALVING THE WRONG DIRECTION — going arc → inscribed angle you HALVE; going inscribed angle → arc you DOUBLE. Sanity check: an inscribed angle is always SMALLER than the arc it intercepts, and never reaches 180°.` },
    { loId: 'geom.central-inscribed-angles', kind: 'definition', title: 'inscribed angle', content: `an angle whose vertex lies on the circle and whose sides are chords of that circle.` },
    { loId: 'geom.central-inscribed-angles', kind: 'definition', title: 'intercepted arc', content: `the arc lying in the interior of an angle, with endpoints where the angle's sides meet the circle.` },
  ],
  methods: [
    {
      title: 'Worked central to inscribed',
      steps: [
        `Locate each vertex: O is the CENTER, so ∠AOB is a central angle; C is ON the circle, so ∠ACB is an inscribed angle.`,
        'Central angle = its arc: arc AB (minor) = m∠AOB = 110°.',
        `Find what ∠ACB intercepts: its sides are chords CA and CB, so it opens onto arc AB not containing C — the same 110° minor arc.`,
        `Inscribed = half its arc: m∠ACB = ½(110°) = 55°. Sanity check: 55° is smaller than the 110° arc, as an inscribed angle must be. ✓`,
      ],
      example: { problem: `Circle O has points A and B on it, and the central angle ∠AOB measures 110°. Point C is another point on the circle, on the major arc AB (the long way around, away from the 110° opening). Find the measure of arc AB (the minor arc) and the measure of inscribed angle ∠ACB.`, solution: 'arc AB = 110° and m∠ACB = 55°' },
      relatedLoIds: ['geom.central-inscribed-angles'],
    },
    {
      title: 'Worked semicircle direction trap',
      steps: [
        `Check the vertex: P lies ON the circle and both sides PM and PN are chords, so ∠MPN is an INSCRIBED angle — the halving rule applies.`,
        `Confirm the arc: MN is a diameter, so it splits the circle into two 180° arcs; the arc intercepted by ∠MPN is the semicircle not containing P, measuring 180°.`,
        `Apply the rule in the right direction: inscribed angle = ½ (arc) = ½(180°) = 90°. The student doubled instead of halving.`,
        `Catch it with the sanity check: a 360° angle is impossible, and an inscribed angle is always smaller than its arc. Name the result — any angle inscribed in a semicircle is a RIGHT angle (Thales' Theorem), so △MPN is a right triangle with the right angle at P.`,
      ],
      example: { problem: `In circle O, segment MN is a diameter and P is a third point on the circle. A student says: "The intercepted arc MN is 180°, and angle and arc are related by a factor of 2, so m∠MPN = 360°." Find the correct measure of ∠MPN and name the error.`, solution: `m∠MPN = 90° — the inscribed angle is HALF its arc, not double; an angle inscribed in a semicircle is always right.` },
      relatedLoIds: ['geom.central-inscribed-angles'],
    },
  ],
  pointers: [
    { content: `The vertex chooses the rule. At the CENTER, the angle equals its arc, so arc AB = 40°. ON the circle, the angle is HALF its arc, so m∠ACB = ½(40°) = 20°. Same arc, but the central angle is always twice the inscribed one — locate the vertex before writing a single number.`, kind: 'common-error' },
    { content: `Vertex at the CENTER: the angle equals its intercepted arc. Vertex ON the circle: the angle is HALF its intercepted arc — so the central angle is twice the inscribed one on the same arc.`, kind: 'tip' },
    { content: `Identify the intercepted arc first — for inscribed ∠ACB it is arc AB not containing C.`, kind: 'tip' },
    { content: `Inscribed angles intercepting the SAME arc are congruent; an angle inscribed in a semicircle (sides ending at a diameter) is 90°.`, kind: 'tip' },
    { content: `Opposite angles of a quadrilateral inscribed in a circle are supplementary (sum 180°).`, kind: 'tip' },
    { content: `Direction check: arc → angle means halve, angle → arc means double; an inscribed angle is always smaller than its arc.`, kind: 'tip' },
    { content: `Before writing any number, mark where the vertex is. Center → angle = arc. On the circle → angle = ½ arc. Same picture, same arc, different answer — the vertex, not the arc, picks the rule.`, kind: 'tip' },
    { content: `Direction matters: arc → inscribed angle you **halve**; inscribed angle → arc you **double**. Sanity check every answer — an inscribed angle must come out SMALLER than its intercepted arc, and never 180° or more.`, kind: 'common-error' },
    { content: `For inscribed ∠ACB, the intercepted arc is arc AB **not containing C**. Students often grab the arc the vertex sits on. Trace inside the angle's opening: endpoints only where the two sides cross the circle.`, kind: 'vocab-note' },
    { content: `Don't say 'arc AB = 110°' without checking whether you mean minor or major. Write 'minor arc AB' or use three letters (arc ACB) whenever a diagram has points on both arcs; the two differ by 360° − x.`, kind: 'vocab-note' },
    { content: `Inscribed angles on the same arc are congruent — the answer doesn't change when you slide the vertex. If a problem gives two inscribed angles on the same arc, don't add or average them; they're just equal.`, kind: 'gotcha' },
    { content: `The 90° result needs BOTH sides ending at the ends of a **diameter**. A chord through a point that merely looks long isn't enough — verify it passes through the center before claiming a right angle.`, kind: 'edge-case' },
    { content: `In an inscribed quadrilateral, supplementary pairs are **opposite** angles (W & Y, X & Z), not adjacent ones. Check the vertices are listed in order around the circle before pairing them.`, kind: 'common-error' },
    { content: `When an angle is given as an expression like (3x + 5)°, set the expression equal to the ANGLE value (½ the arc), not to the arc. Compute ½(70°) = 35° first, then solve 3x + 5 = 35.`, kind: 'common-error' },
  ],
};
