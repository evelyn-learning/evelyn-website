/**
 * ACT — Math / Plane Geometry: angles, triangles & circles.
 *
 * Unlike the SAT, the ACT hands you NO formula reference sheet — every
 * angle rule, triangle theorem, and circle formula tested here must be
 * memorized cold before test day. Standalone questions, calculator
 * allowed, ~60 seconds per question.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_PLANE_GEOMETRY: LessonPlan = {
  id: 'evelyn.testprep.act.plane-geometry.v1',
  title: 'Plane Geometry: Angles, Triangles & Circles',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.plane-geometry',
      standard: 'ACT-2.8',
      description:
        'Apply angle relationships, triangle theorems, and circle formulas from memory to solve standalone ACT plane-geometry questions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe plane geometry as a memorization test, since the ACT gives zero formulas — unlike the SAT.',
      script:
        'About 14 of the 60 ACT Math questions test plane geometry — angles, triangles, and circles. Here is the catch: the SAT hands you a formula sheet on test day, but the ACT does NOT. Every formula in this lesson — triangle angle sum, circle area, arc length, all of it — has to live in your head cold. Pace is about 60 seconds per question, so recall has to be instant, not looked-up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angles-triangles-circles',
      kind: 'concept',
      goal: 'The memorized formula set: angle relationships, triangle theorems, circle formulas — plus the traps ACT builds around each.',
      keyIdeas: [
        'ANGLE BASICS (memorize, no sheet): angles on a straight line sum to 180°; angles all the way around a point sum to 360°; vertical angles (formed when two lines cross) are always equal.',
        'PARALLEL LINES + TRANSVERSAL: corresponding angles are equal; alternate interior angles are equal; same-side (co-interior) angles are SUPPLEMENTARY, not equal — this pairing is a favorite ACT trap.',
        'TRIANGLE ANGLE SUM: interior angles of ANY triangle sum to 180°, regardless of how "off" the triangle looks in the (often not-to-scale) diagram.',
        'EXTERIOR ANGLE THEOREM: an exterior angle equals the SUM of the two remote (non-adjacent) interior angles — not either one alone, and not half the sum.',
        'ISOSCELES & EQUILATERAL: isosceles triangles have two equal sides with equal base angles opposite them; equilateral triangles have all three angles equal to 60°.',
        'SIMILAR TRIANGLES: same angles, proportional sides — always match corresponding VERTICES before writing a ratio, or the proportion comes out inverted or mismatched.',
        'CIRCLE FORMULAS (memorize): circumference = 2πr = πd; area = πr²; arc length = (θ/360°) × 2πr; sector area = (θ/360°) × πr².',
        'TANGENT LINES: a line tangent to a circle is always perpendicular to the radius drawn to the point of tangency — a fast way to unlock right-angle info in circle diagrams.',
      ],
      vocabulary: [
        { term: 'exterior angle', definition: 'the angle formed outside a triangle when one side is extended; equals the sum of the two remote (non-adjacent) interior angles.' },
        { term: 'co-interior angles', definition: 'angles on the same side of a transversal, between two parallel lines; they are supplementary (sum to 180°), not equal.' },
        { term: 'tangent line', definition: 'a line that touches a circle at exactly one point; perpendicular to the radius at that point.' },
        { term: 'sector', definition: 'a pie-slice region of a circle bounded by two radii and an arc.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-angle-sum-exterior',
      kind: 'worked_example',
      problem:
        'In triangle ABC, angle A measures 48° and angle B measures 65°. What is the measure of angle C, and what is the measure of the exterior angle at vertex C?',
      steps: [
        'Interior angles of a triangle always sum to 180°, so angle C = 180° − 48° − 65° = 67°.',
        'The exterior angle at C is supplementary to angle C (they form a straight line): 180° − 67° = 113°.',
        'Cross-check with the exterior angle theorem: the exterior angle at C should equal the sum of the two remote interior angles, A + B = 48° + 65° = 113°. ✓ Matches.',
      ],
      answer: 'Angle C = 67°; the exterior angle at C = 113°.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-circle-diameter-trap',
      kind: 'worked_example',
      problem: 'A circle has a diameter of 14. What is its area, in terms of π?',
      steps: [
        'TRAP: it is tempting to plug 14 directly into πr² — that silently treats the diameter as if it were the radius.',
        'Convert first: radius = diameter / 2 = 14 / 2 = 7.',
        'Area = πr² = π(7)² = 49π.',
        'Sanity check the trap: using 14 as r would have given 196π — four times too large, since area scales with the SQUARE of the (doubled) radius. Always confirm whether a circle problem gives you r or d before squaring.',
      ],
      answer: 'Area = 49π',
      estimatedMinutes: 3,
    },
    {
      id: 'try-similar-triangles',
      kind: 'try_yourself',
      problem:
        'Two triangles are similar. The smaller triangle has sides 6, 8, and 10. The side of length 6 in the smaller triangle corresponds to a side of length 9 in the larger triangle. What is the length of the side in the larger triangle that corresponds to the side of length 8?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8' },
        { id: 'b', text: '11' },
        { id: 'c', text: '12', correct: true },
        { id: 'd', text: '15' },
      ],
      expectedAnswer: '12',
      hints: [
        'Find the scale factor from the corresponding pair you know: 9 / 6 = 1.5.',
        'Apply that SAME scale factor to the side of length 8: 8 × 1.5 = 12. (Don\'t add a constant difference, and don\'t scale the wrong side.)',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parallel-transversal',
      kind: 'try_yourself',
      problem:
        'Lines l and m are parallel and are cut by a transversal t. One of the angles formed measures 118°. What is the measure of the angle that is same-side (co-interior) to it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '118°' },
        { id: 'b', text: '62°', correct: true },
        { id: 'c', text: '90°' },
        { id: 'd', text: '58°' },
      ],
      expectedAnswer: '62°',
      hints: [
        'Co-interior (same-side interior) angles are supplementary, not equal — that rules out matching the given angle.',
        '180° − 118° = 62°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sector-area',
      kind: 'try_yourself',
      problem:
        'Type your answer: A circle has radius 12. What is the area, in terms of π, of a sector with a central angle of 90°?',
      responseFormat: 'numeric',
      expectedAnswer: '36π',
      hints: [
        'Sector area = (θ / 360°) × πr².',
        '(90 / 360) × π(12)² = (1/4) × 144π = 36π.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exterior-angle-split',
      kind: 'misconception_check',
      question:
        'A triangle has an exterior angle of 130° at one vertex. A student concludes that both remaining interior angles must each be 65°. What went wrong, and what CAN we actually conclude?',
      commonErrors: [
        {
          answer: 'Each of the two remaining interior angles is 65°',
          misconception: 'Assuming the exterior angle theorem splits the exterior angle evenly between the two remote interior angles.',
          correctsTo:
            'The exterior angle theorem only guarantees that the SUM of the two remote interior angles is 130° — the split could be 40°/90°, 100°/30°, or infinitely many other pairs. Without another angle or a side relationship (like isosceles or a marked right angle), the individual angles can\'t be pinned down.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The ACT gives NO formula sheet — triangle, angle, and circle formulas must be memorized cold.',
        'Triangle interior angles always sum to 180°; an exterior angle equals the SUM of the two remote interior angles, not either one alone.',
        'Similar triangles: match corresponding vertices first, then apply one consistent scale factor to every side.',
        'Circle toolkit: circumference 2πr, area πr², arc length (θ/360°)×2πr, sector area (θ/360°)×πr² — and a tangent line is always perpendicular to the radius at the point of tangency.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.8', cedTitle: 'Plane Geometry: Angles, Triangles & Circles' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
