/**
 * Geometry — Transformations: Congruence in Terms of Rigid Motions.
 *
 * The definition that reorganizes the whole course (CCSS G-CO.A.5,
 * G-CO.B.6): two figures are congruent exactly when some sequence of
 * translations, reflections, and rotations carries one onto the other.
 * Equal parts follow from the motion, the letter order of a congruence
 * statement records the mapping, and dilations are shown the door.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U4_CONGRUENCE_RIGID_MOTIONS: LessonPlan = {
  id: 'evelyn.hs.geom.congruence-rigid-motions.v1',
  title: 'Congruence in Terms of Rigid Motions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.congruence-rigid-motions',
      standard: 'GEOM-4.5',
      description:
        'Decide whether two figures are congruent by describing a sequence of rigid motions that maps one onto the other, and use that mapping to state the correspondence between their parts (CCSS G-CO.A.5, G-CO.B.6).',
    },
  ],
  prerequisites: ['geom.compositions-symmetry'],
  followUps: ['geom.triangle-angle-relationships'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame congruence as "can be moved into place without changing it" — the test a factory, a tiler, or a robot arm actually applies.',
      script:
        'A robot arm on an assembly line grabs a metal bracket, slides it across the bench, spins it a quarter turn, and drops it into the frame. The bracket fits. Nothing about the bracket changed — only where it sits and which way it faces. That is the whole idea of congruence: two figures are congruent when you can MOVE one onto the other without stretching, shrinking, or bending it. Today you turn that into a definition precise enough to prove things with, and you learn to name the exact moves that do the job.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rigid-motion-congruence',
      kind: 'concept',
      goal: 'The rigid-motion definition of congruence, what the motion preserves, how it names the correspondence, and the two figures students wrongly call congruent (or wrongly refuse to).',
      keyIdeas: [
        'THE DEFINITION — two figures are CONGRUENT when there is a sequence of rigid motions (translations, reflections, rotations) that maps one exactly onto the other. Not "they look the same" — there must be a sequence of moves you can name.',
        'WHAT RIGID MOTIONS PRESERVE — every distance and every angle measure. Position and facing may change; length, angle, area, and shape never do. That is why the matching sides and angles of congruent figures are automatically equal — you get corresponding parts for free from the motion.',
        'THE MOTION NAMES THE MATCH — if the sequence sends A→D, B→E, C→F, you write △ABC ≅ △DEF. The letter ORDER is the mapping, not decoration: it tells you AB = DE and ∠B = ∠E without measuring anything.',
        'HOW TO BUILD THE SEQUENCE — translate one vertex onto its partner, rotate about that vertex until a matching side lines up, then reflect across that side if the figure is still facing the wrong way. Two or three motions are always enough for triangles.',
        'ORIENTATION TELLS YOU IF A REFLECTION IS NEEDED — read the vertices A→B→C around the figure. If one figure reads counterclockwise and the other reads clockwise, the sequence MUST contain a reflection (an odd number of them). Same reading direction → translations and rotations alone will do it.',
        'ERROR: A DILATION IS NOT A RIGID MOTION — scaling by anything other than 1 changes distances, so a mapping that doubles a figure proves SIMILARITY, not congruence. Same shape is not the same as congruent.',
        'ERROR: "IT IS FLIPPED, SO IT CANNOT BE CONGRUENT" — a reflection is a rigid motion. A mirror image is fully congruent; your left and right hands are congruent figures. Congruence never requires matching orientation.',
        'ERROR: MATCHING PARTS IN THE WRONG ORDER — two triangles can be congruent while the statement you wrote is false. △ABC ≅ △DEF is a claim about WHICH vertex goes to which; if the motion actually sends A→E, that statement is wrong even though the triangles are congruent.',
      ],
      vocabulary: [
        {
          term: 'rigid motion',
          definition:
            'a transformation that preserves every distance and angle measure — a translation, reflection, rotation, or any sequence of them.',
        },
        {
          term: 'orientation',
          definition:
            'the direction, clockwise or counterclockwise, in which the labeled vertices of a figure are read; reflections reverse it, translations and rotations do not.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-the-sequence',
      kind: 'worked_example',
      problem:
        'Right triangle ABC has vertices A(-5, 1), B(-2, 1), and C(-5, 3), with the right angle at A. Triangle DEF has vertices D(2, -1), E(5, -1), and F(2, -3). Show that △ABC ≅ △DEF by naming a sequence of rigid motions that maps A→D, B→E, and C→F.',
      steps: [
        'Compare the side lengths first: AB runs 3 units right, AC runs 2 units up; DE runs 3 units right, DF runs 2 units down. The legs match, so congruence is at least plausible.',
        'Check orientation: reading A→B→C goes right, then up-and-left — counterclockwise. Reading D→E→F goes right, then down-and-left — clockwise. The reading direction reversed, so the sequence must include a reflection.',
        'Reflect across the x-axis, the rule (x, y) → (x, -y): A(-5, 1) → (-5, -1), B(-2, 1) → (-2, -1), C(-5, 3) → (-5, -3). The image now faces the same way as △DEF.',
        'Translate 7 units right, the rule (x, y) → (x + 7, y): (-5, -1) → (2, -1) = D, (-2, -1) → (5, -1) = E, (-5, -3) → (2, -3) = F. Every vertex lands on its partner.',
        'A sequence of rigid motions maps △ABC exactly onto △DEF, so by definition the triangles are congruent — and the mapping A→D, B→E, C→F makes △ABC ≅ △DEF the correct statement.',
      ],
      answer:
        'Reflect across the x-axis, then translate 7 units right; the sequence maps A→D, B→E, C→F, so △ABC ≅ △DEF.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dilation-impostor',
      kind: 'worked_example',
      problem:
        'A classmate says: "Triangle ABC has A(0, 0), B(3, 0), C(0, 4). Triangle JKL has J(0, 0), K(6, 0), L(0, 8). I found a transformation that maps △ABC onto △JKL, so the triangles are congruent." Is the conclusion right?',
      steps: [
        'Identify the transformation: every point doubled its distance from the origin, so this is a dilation centered at (0, 0) with scale factor 2 — not a translation, reflection, or rotation.',
        'Test the rigid-motion requirement on distances: AB = 3 but JK = 6; the hypotenuse BC = 5 (a 3-4-5 triangle) but KL = 10. Distances changed, so the mapping is NOT a rigid motion.',
        'Notice what DID survive: the angles are unchanged, so the triangles have the same shape. Same shape with different size is SIMILARITY, which is Unit 6, not congruence.',
        'Could some other sequence work? No — every rigid motion preserves length, so no sequence of them can turn a side of 3 into a side of 6. No sequence exists.',
        'The transformation exists, but it is the wrong kind. △ABC and △JKL are similar, not congruent.',
      ],
      answer:
        'No — the mapping is a dilation with scale factor 2, which is not a rigid motion; the triangles are similar, not congruent.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-single-motion',
      kind: 'try_yourself',
      problem:
        'Triangle ABC has vertices A(1, 1), B(4, 1), C(1, 5). Triangle DEF has vertices D(1, -1), E(4, -1), F(1, -5). Which SINGLE rigid motion maps △ABC onto △DEF so that A→D, B→E, and C→F?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reflection across the x-axis', correct: true },
        { id: 'b', text: 'Translation 2 units down' },
        { id: 'c', text: 'Reflection across the y-axis' },
        { id: 'd', text: 'Rotation of 180° about the origin' },
      ],
      expectedAnswer: 'Reflection across the x-axis',
      hints: [
        'Compare each image point to its original: what happened to the x-coordinates, and what happened to the y-coordinates?',
        'Test your choice on ALL THREE vertices, not just A. The rule (x, y) → (x, -y) is a reflection across the x-axis.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-correspondence',
      kind: 'try_yourself',
      problem:
        'A sequence of rigid motions maps △PQR onto △STU so that P lands on U, Q lands on S, and R lands on T. Which congruence statement correctly records this mapping?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '△PQR ≅ △STU' },
        { id: 'b', text: '△PQR ≅ △UST', correct: true },
        { id: 'c', text: '△PQR ≅ △TUS' },
        { id: 'd', text: '△PQR ≅ △SUT' },
      ],
      expectedAnswer: '△PQR ≅ △UST',
      hints: [
        'The second triangle must list the images of P, Q, R in that exact order — not the alphabetical order of its own name.',
        'P maps to U, so U is the FIRST letter after the ≅ sign; Q maps to S, so S is second.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A translation is a rigid motion that moves every point the same way. This translation maps A(-3, 5) to D(4, 1). The same translation maps B(2, 5) to point E. What is the x-coordinate of E? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Find the rule first: from A to D, the x-coordinate went from -3 to 4, so how far right did every point move?',
        'Every point shifts by the same amount. Add that shift to the x-coordinate of B, which is 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reflection-orientation',
      kind: 'misconception_check',
      question:
        'Two triangles are mirror images of each other across a line. A student says they cannot be congruent because one of them is "backwards." What went wrong?',
      commonErrors: [
        {
          answer: 'They are not congruent because one is flipped',
          misconception:
            'Believing congruence requires the same orientation, as if a reflection damaged the figure.',
          correctsTo:
            'A reflection IS a rigid motion — it preserves every distance and angle, so the mirror image is fully congruent. Reversed orientation only tells you the sequence contains a reflection; it never rules congruence out. Your left and right hands are congruent.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Congruent means there IS a sequence of rigid motions — translations, reflections, rotations — mapping one figure onto the other.',
        'Rigid motions preserve all distances and angles, so matching sides and angles come free with the mapping.',
        'The mapping sets the letter order: A→D, B→E, C→F means △ABC ≅ △DEF, and a scrambled order makes the statement false.',
        'Reversed orientation means a reflection is in the sequence — flipped figures are still congruent.',
        'Dilations with scale factor other than 1 are not rigid motions: they give similarity, never congruence.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.5', cedTitle: 'Congruence in Terms of Rigid Motions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
