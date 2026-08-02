/**
 * ACT — Unit 2 CED 2.8: Plane Geometry: Angles, Triangles & Circles.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.plane-geometry.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_PLANE_GEOMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.plane-geometry.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.8',
  cedTitle: 'Plane Geometry: Angles, Triangles & Circles',
  planId: 'evelyn.testprep.act.plane-geometry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.plane-geometry.v1' }],
  theory: [
    { loId: 'act.plane-geometry', content: `ANGLE BASICS (memorize, no sheet): angles on a straight line sum to 180°; angles all the way around a point sum to 360°; vertical angles (formed when two lines cross) are always equal.` },
    { loId: 'act.plane-geometry', content: `PARALLEL LINES + TRANSVERSAL: corresponding angles are equal; alternate interior angles are equal; same-side (co-interior) angles are SUPPLEMENTARY, not equal — this pairing is a favorite ACT trap.` },
    { loId: 'act.plane-geometry', content: `TRIANGLE ANGLE SUM: interior angles of ANY triangle sum to 180°, regardless of how "off" the triangle looks in the (often not-to-scale) diagram.` },
    { loId: 'act.plane-geometry', content: `EXTERIOR ANGLE THEOREM: an exterior angle equals the SUM of the two remote (non-adjacent) interior angles — not either one alone, and not half the sum.` },
    { loId: 'act.plane-geometry', content: `ISOSCELES & EQUILATERAL: isosceles triangles have two equal sides with equal base angles opposite them; equilateral triangles have all three angles equal to 60°.` },
    { loId: 'act.plane-geometry', content: `SIMILAR TRIANGLES: same angles, proportional sides — always match corresponding VERTICES before writing a ratio, or the proportion comes out inverted or mismatched.` },
    { loId: 'act.plane-geometry', content: `CIRCLE FORMULAS (memorize): circumference = 2πr = πd; area = πr²; arc length = (θ/360°) × 2πr; sector area = (θ/360°) × πr².` },
    { loId: 'act.plane-geometry', content: `TANGENT LINES: a line tangent to a circle is always perpendicular to the radius drawn to the point of tangency — a fast way to unlock right-angle info in circle diagrams.` },
    { loId: 'act.plane-geometry', kind: 'definition', title: 'exterior angle', content: `the angle formed outside a triangle when one side is extended; equals the sum of the two remote (non-adjacent) interior angles.` },
    { loId: 'act.plane-geometry', kind: 'definition', title: 'co-interior angles', content: `angles on the same side of a transversal, between two parallel lines; they are supplementary (sum to 180°), not equal.` },
    { loId: 'act.plane-geometry', kind: 'definition', title: 'tangent line', content: `a line that touches a circle at exactly one point; perpendicular to the radius at that point.` },
    { loId: 'act.plane-geometry', kind: 'definition', title: 'sector', content: 'a pie-slice region of a circle bounded by two radii and an arc.' },
  ],
  methods: [
    {
      title: 'Worked angle sum exterior',
      steps: [
        `Interior angles of a triangle always sum to 180°, so angle C = 180° − 48° − 65° = 67°.`,
        `The exterior angle at C is supplementary to angle C (they form a straight line): 180° − 67° = 113°.`,
        `Cross-check with the exterior angle theorem: the exterior angle at C should equal the sum of the two remote interior angles, A + B = 48° + 65° = 113°. ✓ Matches.`,
      ],
      example: { problem: `In triangle ABC, angle A measures 48° and angle B measures 65°. What is the measure of angle C, and what is the measure of the exterior angle at vertex C?`, solution: 'Angle C = 67°; the exterior angle at C = 113°.' },
      relatedLoIds: ['act.plane-geometry'],
    },
    {
      title: 'Worked circle diameter trap',
      steps: [
        `TRAP: it is tempting to plug 14 directly into πr² — that silently treats the diameter as if it were the radius.`,
        'Convert first: radius = diameter / 2 = 14 / 2 = 7.',
        'Area = πr² = π(7)² = 49π.',
        `Sanity check the trap: using 14 as r would have given 196π — four times too large, since area scales with the SQUARE of the (doubled) radius. Always confirm whether a circle problem gives you r or d before squaring.`,
      ],
      example: { problem: 'A circle has a diameter of 14. What is its area, in terms of π?', solution: 'Area = 49π' },
      relatedLoIds: ['act.plane-geometry'],
    },
  ],
  pointers: [
    { content: `The exterior angle theorem only guarantees that the SUM of the two remote interior angles is 130° — the split could be 40°/90°, 100°/30°, or infinitely many other pairs. Without another angle or a side relationship (like isosceles or a marked right angle), the individual angles can't be pinned down.`, kind: 'common-error' },
    { content: `The ACT gives NO formula sheet — triangle, angle, and circle formulas must be memorized cold.`, kind: 'tip' },
    { content: `Triangle interior angles always sum to 180°; an exterior angle equals the SUM of the two remote interior angles, not either one alone.`, kind: 'tip' },
    { content: `Similar triangles: match corresponding vertices first, then apply one consistent scale factor to every side.`, kind: 'tip' },
    { content: `Circle toolkit: circumference 2πr, area πr², arc length (θ/360°)×2πr, sector area (θ/360°)×πr² — and a tangent line is always perpendicular to the radius at the point of tangency.`, kind: 'tip' },
    { content: `ACT geometry figures are only to scale if the problem says so — and often the note "not drawn to scale" is buried in small print. Never eyeball whether an angle is 90°, whether sides look equal, or whether lines look parallel. Use only marked info and stated relationships.`, kind: 'gotcha' },
    { content: `"In terms of π" means LEAVE π in the answer (49π). If choices are decimals instead, they want 3.14… multiplied through. Scan the answer choices before computing — matching their form saves a full re-calculation.`, kind: 'tip' },
    { content: `Radius/diameter swaps hide in circumference too, not just area. C = πd but C = 2πr — plugging a diameter into 2πr doubles your answer. Circle the given letter (r or d) the instant you read it.`, kind: 'common-error' },
    { content: `In similar-triangle problems, the scale factor applies to SIDES and perimeter linearly, but AREA scales by the factor squared. A 3:1 side ratio means a 9:1 area ratio — a favorite distractor is the un-squared 3:1.`, kind: 'edge-case' },
    { content: `"Isosceles" tells you the base angles are equal, but you must identify which angle is the vertex. If the given angle is the vertex angle: base angles = (180 − x)/2. If it's a base angle: vertex = 180 − 2x. Different setups, different answers.`, kind: 'common-error' },
    { content: `Don't confuse a sector (pie slice, two radii + arc) with an arc (curved length only) or a chord (straight segment). "Arc length" uses 2πr; "sector area" uses πr². Reading "arc" as "sector" swaps the formula entirely.`, kind: 'vocab-note' },
    { content: `With parallel lines cut by a transversal, every angle is either x or 180 − x. Find one angle, label the whole figure with those two values, then just read off the one asked for — faster and safer than naming each pair type.`, kind: 'tip' },
    { content: `When a tangent line appears, immediately draw the radius to the point of tangency and mark 90°. That right angle usually unlocks a Pythagorean or special-triangle step — the problem is unsolvable until you add that segment yourself.`, kind: 'tip' },
  ],
};
