/**
 * Geometry — Triangles: Triangle Angle Sum & Exterior Angles.
 *
 * The 180° fact (CCSS G-CO.C.10) proved from the parallel-line angle rules
 * of Unit 3, plus the exterior-angle shortcut it generates. The whole
 * lesson is built around the two slips that cost students the most points:
 * adding the ADJACENT interior angle instead of the two remote ones, and
 * solving for x but reporting x instead of the angle.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U5_TRIANGLE_ANGLE_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.hs.geom.triangle-angle-relationships.v1',
  title: 'Triangle Angle Sum & Exterior Angles',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.triangle-angle-relationships',
      standard: 'GEOM-5.1',
      description:
        'Apply the Triangle Angle Sum Theorem and the Exterior Angle Theorem to find unknown angle measures in triangles described verbally, and explain why the three interior angles of any triangle must total 180° (CCSS G-CO.C.10).',
    },
  ],
  prerequisites: ['geom.congruence-rigid-motions'],
  followUps: ['geom.triangle-congruence-criteria'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the 180° sum as the constraint that makes triangles the most trusted shape in building and navigation — and as the tool that unlocks the rest of the unit.',
      script:
        'Roof trusses, bridge frames, bicycle frames, camera tripods — all triangles, because a triangle cannot flex without changing its side lengths. Part of that rigidity is an angle budget: the three corners of ANY triangle, thin or fat, always spend exactly 180°. That means two angles hand you the third for free — which is exactly how a surveyor finds an unreachable angle across a river, and how the congruence proofs coming up in this unit close their final gap.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-angle-sum',
      kind: 'concept',
      goal: 'The angle sum and why it is true, the exterior angle as a linear pair, the remote-interior shortcut, and the classic slips.',
      keyIdeas: [
        'TRIANGLE ANGLE SUM — the three interior angles of ANY triangle sum to 180°. In △ABC: m∠A + m∠B + m∠C = 180°. It holds for skinny, wide, right, and obtuse triangles alike — there are no exceptions to check.',
        'WHY IT IS TRUE — draw a line through vertex A parallel to side BC. The two outer angles at A are alternate interior angles with ∠B and ∠C, so they equal them. Together with ∠A they form a straight angle at A: 180°. The parallel-line rules from Unit 3 are what prove it.',
        'EXTERIOR ANGLE — extend one side of a triangle past a vertex. The angle between that extension and the other side at the vertex is an exterior angle. It forms a LINEAR PAIR with the interior angle at that same vertex, so exterior + adjacent interior = 180°.',
        'EXTERIOR ANGLE THEOREM — an exterior angle equals the SUM of the two REMOTE interior angles, the two that do not touch it. This is a one-step shortcut: no need to find the third interior angle first.',
        'CLASSIC ERROR — WRONG PAIR. The remote angles are the two at the OTHER vertices. Including the adjacent interior angle (the one right next to the exterior angle) is the single most common slip; that angle is SUPPLEMENTARY to the exterior angle, not part of the sum.',
        'CLASSIC ERROR — REPORTING x. With algebraic angles like (2x + 10)°, solving the equation gives x, not an angle measure. Substitute back. A fast check: the three angle values must add to 180°.',
        'CLASSIC ERROR — 180 vs 360. A triangle sums to 180°; a quadrilateral sums to 360°, and so does a full turn around a point. Using 360° for a triangle is the most common set-up mistake.',
        'THIRD ANGLE THEOREM — if two angles of one triangle equal two angles of another, the third pair must be equal too, since all three sum to the same 180°. That is what makes AAS a real congruence criterion in the next lesson.',
      ],
      vocabulary: [
        {
          term: 'exterior angle',
          definition: 'the angle formed outside a triangle between one extended side and the adjacent side at that vertex.',
        },
        {
          term: 'remote interior angles',
          definition: 'the two interior angles of a triangle that are NOT adjacent to a given exterior angle.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-algebraic-angle-sum',
      kind: 'worked_example',
      problem:
        'In △ABC, m∠A = (2x + 10)°, m∠B = (3x − 15)°, and m∠C = (x + 5)°. Find the measure of each angle.',
      steps: [
        'Write the angle-sum equation before any arithmetic: (2x + 10) + (3x − 15) + (x + 5) = 180.',
        'Combine like terms: the x terms give 2x + 3x + x = 6x; the constants give 10 − 15 + 5 = 0. So 6x = 180.',
        'Divide by 6: x = 30. Stop — x is not an angle. Substitute back.',
        'm∠A = 2(30) + 10 = 70°, m∠B = 3(30) − 15 = 75°, m∠C = 30 + 5 = 35°.',
        'Check: 70 + 75 + 35 = 180. ✓ The three measures spend the full budget.',
      ],
      answer: 'm∠A = 70°, m∠B = 75°, m∠C = 35°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-exterior-wrong-pair',
      kind: 'worked_example',
      problem:
        'In △PQR, m∠P = 47° and m∠Q = 68°. Side QR is extended beyond R to a point S, forming exterior angle ∠PRS. A student answers 133°. Find the correct measure and explain the error.',
      steps: [
        'Locate the exterior angle: because QR is extended past R, ∠PRS sits outside the triangle at vertex R and is adjacent to the interior angle ∠PRQ.',
        'Identify the REMOTE interior angles — the two that do not touch ∠PRS. Those are ∠P (47°) and ∠Q (68°), at the other two vertices.',
        'Exterior Angle Theorem: m∠PRS = 47 + 68 = 115°.',
        'Find the error: the interior angle at R is 180 − 47 − 68 = 65°, and the student added 68 + 65 = 133 — pairing a remote angle with the ADJACENT interior angle instead of using the two remote ones.',
        'Verify with the linear pair: the exterior angle and its adjacent interior angle must sum to 180°. 115 + 65 = 180 ✓, while 133 + 65 = 198 ✗ — the wrong answer was catchable in one line.',
      ],
      answer: 'm∠PRS = 115° — the remote interior angles are ∠P and ∠Q, not the adjacent interior angle at R',
      estimatedMinutes: 3,
    },
    {
      id: 'try-exterior-angle',
      kind: 'try_yourself',
      problem:
        'In △DEF, m∠D = 55° and m∠E = 40°. Side DF is extended beyond F to a point G, forming exterior angle ∠EFG. What is m∠EFG?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '85°' },
        { id: 'b', text: '95°', correct: true },
        { id: 'c', text: '125°' },
        { id: 'd', text: '140°' },
      ],
      expectedAnswer: '95°',
      hints: [
        'The exterior angle at F equals the sum of the two interior angles that do NOT touch it — the ones at D and E.',
        '55 + 40 = 95. Check it against the linear pair: the interior angle at F is 85°, and 95 + 85 = 180. ✓',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ratio-angles',
      kind: 'try_yourself',
      problem:
        'In △RST, m∠R = 3x°, m∠S = 4x°, and m∠T = 5x°. What is m∠T?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '15°' },
        { id: 'b', text: '60°' },
        { id: 'c', text: '75°', correct: true },
        { id: 'd', text: '150°' },
      ],
      expectedAnswer: '75°',
      hints: [
        'Set the three expressions equal to the triangle total: 3x + 4x + 5x = 180.',
        '12x = 180 gives x = 15 — but the question asks for ∠T, so finish with 5x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In △ABC, m∠A = 62°. Side BC is extended beyond C to a point D, and the exterior angle ∠ACD measures 141°. Find m∠B in degrees and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '79',
      hints: [
        'The exterior angle at C equals the sum of the two remote interior angles, ∠A and ∠B: 62 + m∠B = 141.',
        'Subtract 62 from 141.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-adjacent-interior',
      kind: 'misconception_check',
      question:
        'In △MNP, m∠M = 40° and m∠N = 75°, so the interior angle at P is 65°. Side MP is extended beyond P to a point Q. A student computes the exterior angle ∠NPQ as 75° + 65° = 140°. What went wrong?',
      commonErrors: [
        {
          answer: '140°',
          misconception:
            'Adding the ADJACENT interior angle (65° at P) to a remote angle, instead of adding the two remote interior angles.',
          correctsTo:
            'The remote interior angles are the two that do not touch the exterior angle: ∠M and ∠N. So m∠NPQ = 40 + 75 = 115°. The adjacent angle at P is supplementary to the exterior angle, never added to it — and 115 + 65 = 180 confirms it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every triangle spends exactly 180° across its three interior angles — provable from the parallel-line angle rules.',
        'An exterior angle equals the SUM of the two REMOTE interior angles (the two that do not touch it).',
        'An exterior angle and its adjacent interior angle form a linear pair: they sum to 180°. Use that as a one-line answer check.',
        'With algebraic angles, solve for x and then substitute back — x is almost never the answer, and the three measures must total 180°.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Triangle Angle Sum & Exterior Angles' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
