/**
 * Geometry — Unit 7 CED 7.4: Solving Right Triangles & Angles of Elevation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.solving-right-triangles.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U7_SOLVING_RIGHT_TRIANGLES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.solving-right-triangles.v1',
  course: 'Geometry',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Solving Right Triangles & Angles of Elevation',
  planId: 'evelyn.hs.geom.solving-right-triangles.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.solving-right-triangles.v1' }],
  theory: [
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Solve the triangle', content: `SOLVE THE TRIANGLE — find all six parts: three sides and three angles. In a right triangle one angle is handed to you (90°), so you only ever need two more pieces of information to unlock the rest.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Choose your tool', content: `CHOOSE YOUR TOOL — two sides known, want the third side → Pythagorean theorem. Two sides known, want an ANGLE → inverse trig. One angle plus one side known, want another SIDE → sin, cos, or tan, picked by which two sides are in play. Third angle → subtract from 90°, since the two acute angles are complementary.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Inverse trig undoes the ratio', content: `INVERSE TRIG UNDOES THE RATIO — if sin A = 0.6 then A = sin⁻¹(0.6) ≈ 36.9°. Read sin⁻¹ as "the angle whose sine is". WARNING: sin⁻¹ is NOT 1/sin — the exponent notation here means inverse FUNCTION, not reciprocal. And the calculator must be in DEGREE mode or every answer is nonsense.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Unknown in the denominator', content: `UNKNOWN IN THE DENOMINATOR — sin 40° = 15/x does NOT give x = 15 · sin 40°. Multiply both sides by x first, then divide by the ratio: x = 15/sin 40°. Whenever the unknown sits underneath, you DIVIDE by the trig value; when it sits on top, you MULTIPLY.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Angle of elevation', content: `ANGLE OF ELEVATION — the angle from a HORIZONTAL line of sight UP to an object. Angle of depression — the angle from the horizontal DOWN to an object. Both are measured from the horizontal, never from a vertical wall or pole.` },
    { loId: 'geom.solving-right-triangles', content: `ELEVATION = DEPRESSION — the horizontal at the top and the ground are parallel, so the depression angle from the top down to a point equals the elevation angle from that point back up (alternate interior angles). The depression angle is NOT an interior angle of the triangle: the interior angle at the top vertex is 90° minus it.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Watch the baseline', content: `WATCH THE BASELINE — if the angle is sighted from an instrument 1.6 m above the ground, the triangle gives the height ABOVE THE INSTRUMENT. Add the instrument height back at the end to get the true height.` },
    { loId: 'geom.solving-right-triangles', kind: 'framework', title: 'Sanity-check every answer', content: `SANITY-CHECK EVERY ANSWER — the hypotenuse must be the longest side, each leg must be shorter than it, and the two acute angles must add to 90°. A "leg" longer than the hypotenuse means a flipped ratio.` },
    { loId: 'geom.solving-right-triangles', kind: 'definition', title: 'angle of elevation', content: 'the angle measured upward from a horizontal line of sight to an object above it.' },
    { loId: 'geom.solving-right-triangles', kind: 'definition', title: 'angle of depression', content: `the angle measured downward from a horizontal line of sight to an object below it.` },
  ],
  methods: [
    {
      title: 'Worked solve triangle',
      steps: [
        `Two legs known, hypotenuse unknown → Pythagorean theorem: DE² = 8² + 15² = 64 + 225 = 289, so DE = 17.`,
        `Now an angle. From vertex D, the OPPOSITE side is EF = 15 and the ADJACENT side is DF = 8 — opposite and adjacent, no hypotenuse, so use tangent: tan D = 15/8 = 1.875.`,
        'Undo the tangent: ∠D = tan⁻¹(1.875) ≈ 61.9°.',
        `The two acute angles are complementary, so ∠E = 90° - 61.9° = 28.1°. (Check it independently: tan E = 8/15 ≈ 0.533, and tan⁻¹(0.533) ≈ 28.1°. ✓)`,
        `Sanity check: DE = 17 is the longest side, and 61.9° + 28.1° + 90° = 180°. ✓ The triangle is solved: DE = 17, ∠D ≈ 61.9°, ∠E ≈ 28.1°.`,
      ],
      example: { problem: `Solve right triangle DEF completely. The right angle is at F, leg DF = 8, and leg EF = 15. Find DE, ∠D, and ∠E, rounding angles to the nearest tenth of a degree.`, solution: 'DE = 17, ∠D ≈ 61.9°, ∠E ≈ 28.1°' },
      relatedLoIds: ['geom.solving-right-triangles'],
    },
    {
      title: 'Worked depression trap',
      steps: [
        `Draw the right triangle in words: the vertical side is the 120 ft lighthouse, the horizontal side is the distance d along the water, and the right angle is at the base of the lighthouse.`,
        `The 25° is measured DOWN from the keeper's horizontal line of sight — it is the angle between the horizontal and the line to the boat, so it is NOT the interior angle at the top of the triangle. The interior angle at the top is 90° - 25° = 65°.`,
        `The student used 25° as that top interior angle, which puts the 120 ft side adjacent and d opposite — that is where tan 25° = d/120 came from.`,
        `Fix it by moving the angle to the boat instead: the depression angle at the top equals the elevation angle at the boat (alternate interior angles between two parallel horizontals), so the interior angle at the boat is 25°. From there, 120 is OPPOSITE and d is ADJACENT: tan 25° = 120/d.`,
        `The unknown is in the denominator, so divide: d = 120/tan 25° ≈ 120/0.4663 ≈ 257.3 ft.`,
        `Sanity check: a shallow 25° sightline should reach FAR out to sea — 257 ft makes sense, while the student's 56 ft would need a steep look almost straight down.`,
      ],
      example: { problem: `A lighthouse keeper stands 120 ft above sea level and sights a boat at an angle of depression of 25°. A student writes tan 25° = d/120 and reports the boat is about 56 ft from the base of the lighthouse. Find the true horizontal distance d and explain the error.`, solution: `d ≈ 257.3 ft — the depression angle is measured from the horizontal, so it is the interior angle at the boat, not at the top.` },
      relatedLoIds: ['geom.solving-right-triangles'],
    },
  ],
  pointers: [
    { content: `Multiply both sides by x first: x · sin 40° = 15, then divide: x = 15/sin 40° ≈ 15/0.643 ≈ 23.3. Unknown on top → multiply; unknown underneath → divide. The instant check: 9.6 is shorter than the leg 15, which is impossible for a hypotenuse.`, kind: 'common-error' },
    { content: `To solve a right triangle: Pythagorean theorem for a third side, a trig ratio for a side from an angle, inverse trig for an angle from two sides, and 90° minus the known acute angle for the last angle.`, kind: 'tip' },
    { content: `sin⁻¹, cos⁻¹, tan⁻¹ return an ANGLE — they are inverse functions, not reciprocals, and the calculator must be in degree mode.`, kind: 'tip' },
    { content: `Unknown on top → multiply by the trig value; unknown in the denominator → divide by it.`, kind: 'tip' },
    { content: `Elevation and depression angles are both measured from the HORIZONTAL, and the depression angle down equals the elevation angle back up.`, kind: 'tip' },
    { content: `Check every answer: the hypotenuse is the longest side and the two acute angles add to 90°.`, kind: 'tip' },
    { content: `\`sin⁻¹\` is the inverse FUNCTION, not the reciprocal. sin⁻¹(0.6) ≈ 36.9° (an angle); 1/sin(0.6) is something else entirely. Say it out loud as "the angle whose sine is 0.6" and you won't slip.`, kind: 'vocab-note' },
    { content: `Check DEGREE mode before every calculation. If tan⁻¹(1.875) gives you ≈1.08 instead of ≈61.9°, you're in radians and every angle in the problem is wrong.`, kind: 'common-error' },
    { content: `Unknown on TOP → multiply; unknown UNDERNEATH → divide. From sin 40° = 15/x you get x = 15/sin 40° ≈ 23.3, NOT 15·sin 40° ≈ 9.6. Reflex-multiplying is the single most common algebra slip here.`, kind: 'common-error' },
    { content: `A depression angle is NOT an interior angle of the triangle at the observer's vertex. Either use 90° − (depression) at the top, or slide it down to the object's vertex where it equals the elevation angle. Never plug it in at the top as-is.`, kind: 'gotcha' },
    { content: `Both elevation and depression angles are measured from the HORIZONTAL line of sight — never from a vertical tower, wall, or plumb line. If your diagram shows the angle hugging the vertical side, you've drawn its complement.`, kind: 'vocab-note' },
    { content: `Sanity-check before you write the answer: hypotenuse must be the longest side and the two acute angles must sum to exactly 90°. A "leg" longer than the hypotenuse means you flipped a ratio or divided when you should have multiplied.`, kind: 'tip' },
    { content: `If the angle was sighted from an instrument, eye, or rooftop above the ground, the triangle only gives the height ABOVE that baseline. Add the 1.6 m (or whatever) back at the end — and don't add it to a horizontal distance.`, kind: 'edge-case' },
    { content: `When you find the last acute angle by 90° − (rounded angle), you're stacking rounding error. Keep unrounded values in your calculator, and verify independently: tan E = 8/15 → 28.1° should match 90° − 61.9°.`, kind: 'tip' },
  ],
};
