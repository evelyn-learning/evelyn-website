/**
 * Geometry — Right Triangles & Trigonometry: Solving Right Triangles &
 * Angles of Elevation.
 *
 * Where the three ratios become a measuring instrument (CCSS G-SRT.C.8):
 * inverse trig to recover an angle, the ratio to recover a side, and the
 * elevation/depression vocabulary surveyors actually use. The two classic
 * wrecks get equal billing — measuring the depression angle from the
 * vertical, and multiplying when the unknown sits in the denominator.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U7_SOLVING_RIGHT_TRIANGLES: LessonPlan = {
  id: 'evelyn.hs.geom.solving-right-triangles.v1',
  title: 'Solving Right Triangles & Angles of Elevation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.solving-right-triangles',
      standard: 'GEOM-7.4',
      description:
        'Solve a right triangle for all of its unknown sides and angles using trigonometric ratios, inverse trigonometric functions, and the Pythagorean theorem, and model real-world measurement situations with angles of elevation and depression (CCSS G-SRT.C.8).',
    },
  ],
  prerequisites: ['geom.trig-ratios'],
  followUps: ['geom.polygon-angle-sums'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame right-triangle solving as the surveyor\'s toolkit — measure what you can reach, calculate what you cannot.',
      script:
        'Nobody climbs a skyscraper with a tape measure. A surveyor stands on the sidewalk, points an instrument at the roofline, reads one angle, paces off the distance to the wall — and the building\'s height falls out of a right triangle. Same trick for a cliff\'s height from a boat, a mountain from a valley, a satellite from the ground. Last lesson you defined sine, cosine, and tangent. Today you run them in both directions: ratio to find a missing SIDE, inverse ratio to find a missing ANGLE — until every part of the triangle is known.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-solving',
      kind: 'concept',
      goal: 'What "solve the triangle" means, how to choose the tool, inverse trig notation, and elevation/depression discipline.',
      keyIdeas: [
        'SOLVE THE TRIANGLE — find all six parts: three sides and three angles. In a right triangle one angle is handed to you (90°), so you only ever need two more pieces of information to unlock the rest.',
        'CHOOSE YOUR TOOL — two sides known, want the third side → Pythagorean theorem. Two sides known, want an ANGLE → inverse trig. One angle plus one side known, want another SIDE → sin, cos, or tan, picked by which two sides are in play. Third angle → subtract from 90°, since the two acute angles are complementary.',
        'INVERSE TRIG UNDOES THE RATIO — if sin A = 0.6 then A = sin⁻¹(0.6) ≈ 36.9°. Read sin⁻¹ as "the angle whose sine is". WARNING: sin⁻¹ is NOT 1/sin — the exponent notation here means inverse FUNCTION, not reciprocal. And the calculator must be in DEGREE mode or every answer is nonsense.',
        'UNKNOWN IN THE DENOMINATOR — sin 40° = 15/x does NOT give x = 15 · sin 40°. Multiply both sides by x first, then divide by the ratio: x = 15/sin 40°. Whenever the unknown sits underneath, you DIVIDE by the trig value; when it sits on top, you MULTIPLY.',
        'ANGLE OF ELEVATION — the angle from a HORIZONTAL line of sight UP to an object. Angle of depression — the angle from the horizontal DOWN to an object. Both are measured from the horizontal, never from a vertical wall or pole.',
        'ELEVATION = DEPRESSION — the horizontal at the top and the ground are parallel, so the depression angle from the top down to a point equals the elevation angle from that point back up (alternate interior angles). The depression angle is NOT an interior angle of the triangle: the interior angle at the top vertex is 90° minus it.',
        'WATCH THE BASELINE — if the angle is sighted from an instrument 1.6 m above the ground, the triangle gives the height ABOVE THE INSTRUMENT. Add the instrument height back at the end to get the true height.',
        'SANITY-CHECK EVERY ANSWER — the hypotenuse must be the longest side, each leg must be shorter than it, and the two acute angles must add to 90°. A "leg" longer than the hypotenuse means a flipped ratio.',
      ],
      vocabulary: [
        {
          term: 'angle of elevation',
          definition: 'the angle measured upward from a horizontal line of sight to an object above it.',
        },
        {
          term: 'angle of depression',
          definition: 'the angle measured downward from a horizontal line of sight to an object below it.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-solve-triangle',
      kind: 'worked_example',
      problem:
        'Solve right triangle DEF completely. The right angle is at F, leg DF = 8, and leg EF = 15. Find DE, ∠D, and ∠E, rounding angles to the nearest tenth of a degree.',
      steps: [
        'Two legs known, hypotenuse unknown → Pythagorean theorem: DE² = 8² + 15² = 64 + 225 = 289, so DE = 17.',
        'Now an angle. From vertex D, the OPPOSITE side is EF = 15 and the ADJACENT side is DF = 8 — opposite and adjacent, no hypotenuse, so use tangent: tan D = 15/8 = 1.875.',
        'Undo the tangent: ∠D = tan⁻¹(1.875) ≈ 61.9°.',
        'The two acute angles are complementary, so ∠E = 90° - 61.9° = 28.1°. (Check it independently: tan E = 8/15 ≈ 0.533, and tan⁻¹(0.533) ≈ 28.1°. ✓)',
        'Sanity check: DE = 17 is the longest side, and 61.9° + 28.1° + 90° = 180°. ✓ The triangle is solved: DE = 17, ∠D ≈ 61.9°, ∠E ≈ 28.1°.',
      ],
      answer: 'DE = 17, ∠D ≈ 61.9°, ∠E ≈ 28.1°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-depression-trap',
      kind: 'worked_example',
      problem:
        'A lighthouse keeper stands 120 ft above sea level and sights a boat at an angle of depression of 25°. A student writes tan 25° = d/120 and reports the boat is about 56 ft from the base of the lighthouse. Find the true horizontal distance d and explain the error.',
      steps: [
        'Draw the right triangle in words: the vertical side is the 120 ft lighthouse, the horizontal side is the distance d along the water, and the right angle is at the base of the lighthouse.',
        'The 25° is measured DOWN from the keeper\'s horizontal line of sight — it is the angle between the horizontal and the line to the boat, so it is NOT the interior angle at the top of the triangle. The interior angle at the top is 90° - 25° = 65°.',
        'The student used 25° as that top interior angle, which puts the 120 ft side adjacent and d opposite — that is where tan 25° = d/120 came from.',
        'Fix it by moving the angle to the boat instead: the depression angle at the top equals the elevation angle at the boat (alternate interior angles between two parallel horizontals), so the interior angle at the boat is 25°. From there, 120 is OPPOSITE and d is ADJACENT: tan 25° = 120/d.',
        'The unknown is in the denominator, so divide: d = 120/tan 25° ≈ 120/0.4663 ≈ 257.3 ft.',
        'Sanity check: a shallow 25° sightline should reach FAR out to sea — 257 ft makes sense, while the student\'s 56 ft would need a steep look almost straight down.',
      ],
      answer: 'd ≈ 257.3 ft — the depression angle is measured from the horizontal, so it is the interior angle at the boat, not at the top.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-set-up-equation',
      kind: 'try_yourself',
      problem:
        'You stand 60 ft from the base of a radio tower on level ground and measure the angle of elevation to the top as 40°. Let h be the tower\'s height. The 60 ft is the horizontal leg and h is the vertical leg; the right angle is at the base of the tower. Which equation finds h?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'tan 40° = h/60', correct: true },
        { id: 'b', text: 'tan 40° = 60/h' },
        { id: 'c', text: 'sin 40° = h/60' },
        { id: 'd', text: 'cos 40° = h/60' },
      ],
      expectedAnswer: 'tan 40° = h/60',
      hints: [
        'From the 40° angle, which side is opposite and which is adjacent — and is the hypotenuse involved at all?',
        'h is opposite the 40° angle and 60 is adjacent to it. Opposite over adjacent is tangent, in that order.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-depression-equals-elevation',
      kind: 'try_yourself',
      problem:
        'A drone hovers 90 m directly above a point on level ground. From the drone, the angle of depression to a landing pad on the ground is 34°. What is the angle of elevation from the landing pad up to the drone?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '34°', correct: true },
        { id: 'b', text: '56°' },
        { id: 'c', text: '68°' },
        { id: 'd', text: 'It cannot be found without the horizontal distance' },
      ],
      expectedAnswer: '34°',
      hints: [
        'The drone\'s horizontal line of sight is parallel to the ground — what does that make the two angles?',
        'Alternate interior angles across a transversal are congruent, so the depression angle down equals the elevation angle back up.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'You are solving right triangle ABC, where the right angle is at C, leg AC = 5, and leg BC = 12. Before finding any angles, find the length of the hypotenuse AB. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Two legs are known and no angle is — that calls for the Pythagorean theorem, not a trig ratio.',
        'AB² = 5² + 12² = 25 + 144 = 169.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-denominator',
      kind: 'misconception_check',
      question:
        'A student needs the hypotenuse x of a right triangle where a 40° angle has an opposite side of 15. They correctly write sin 40° = 15/x, then compute x = 15 × sin 40° ≈ 9.6. What went wrong?',
      commonErrors: [
        {
          answer: 'x = 15 × sin 40° ≈ 9.6',
          misconception:
            'Multiplying by the trig value out of habit, without noticing the unknown is in the DENOMINATOR — and ignoring that a hypotenuse can never be shorter than a leg.',
          correctsTo:
            'Multiply both sides by x first: x · sin 40° = 15, then divide: x = 15/sin 40° ≈ 15/0.643 ≈ 23.3. Unknown on top → multiply; unknown underneath → divide. The instant check: 9.6 is shorter than the leg 15, which is impossible for a hypotenuse.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'To solve a right triangle: Pythagorean theorem for a third side, a trig ratio for a side from an angle, inverse trig for an angle from two sides, and 90° minus the known acute angle for the last angle.',
        'sin⁻¹, cos⁻¹, tan⁻¹ return an ANGLE — they are inverse functions, not reciprocals, and the calculator must be in degree mode.',
        'Unknown on top → multiply by the trig value; unknown in the denominator → divide by it.',
        'Elevation and depression angles are both measured from the HORIZONTAL, and the depression angle down equals the elevation angle back up.',
        'Check every answer: the hypotenuse is the longest side and the two acute angles add to 90°.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Solving Right Triangles & Angles of Elevation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
