/**
 * Geometry — Circles: Central & Inscribed Angles.
 *
 * The two vertex rules that unlock every circle-angle problem (CCSS
 * G-C.A.2, G-C.A.3): vertex at the center → the angle EQUALS its arc;
 * vertex on the circle → the angle is HALF its arc. Everything else in
 * this lesson — congruent inscribed angles, the right angle hiding in
 * every semicircle, supplementary opposite angles in an inscribed
 * quadrilateral — falls out of that one halving.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U9_CENTRAL_INSCRIBED_ANGLES: LessonPlan = {
  id: 'evelyn.hs.geom.central-inscribed-angles.v1',
  title: 'Central & Inscribed Angles',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.central-inscribed-angles',
      standard: 'GEOM-9.2',
      description:
        'Use the central angle and inscribed angle theorems to find arc and angle measures in a circle, including the congruent-inscribed-angles, semicircle, and inscribed-quadrilateral corollaries (CCSS G-C.A.2, G-C.A.3).',
    },
  ],
  prerequisites: ['geom.circle-basics-arcs'],
  followUps: ['geom.tangents-secants-angles'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the inscribed angle theorem as the reason a whole curve of viewing spots sees the same thing at the same angle.',
      script:
        'A photographer wants one wall of a building to fill the frame exactly — edge to edge, nothing cut off. Step closer and the wall spills past the frame; step back and it shrinks. The spots that work perfectly are not random: they all lie on one curve, an arc of a circle, because every point on that arc sees the wall at the SAME angle. Architects, stadium designers, and goalkeepers all live off that fact. It comes from one clean rule you will learn today: an angle with its vertex ON a circle is exactly half the arc it opens onto — and a right angle is hiding in every semicircle.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vertex-rules',
      kind: 'concept',
      goal: 'The two vertex rules, the intercepted-arc discipline, and the three corollaries that follow from halving.',
      keyIdeas: [
        'VERTEX DECIDES THE RULE — before writing anything, ask where the vertex sits. At the CENTER → central angle. ON the circle → inscribed angle. Same picture, two completely different formulas.',
        'CENTRAL ANGLE = ITS ARC — if O is the center, m∠AOB equals the measure of arc AB it cuts off. Central angles are how arcs get their degree measures in the first place.',
        'INSCRIBED ANGLE = HALF ITS ARC — if C is ON the circle and its two sides are chords CA and CB, then m∠ACB = ½ (arc AB). Read backwards: the arc is DOUBLE the inscribed angle.',
        'INTERCEPTED ARC — the arc lying INSIDE the angle, with endpoints where the two sides cross the circle. For inscribed ∠ACB the intercepted arc is arc AB not containing C. Pick the wrong arc and every number after it is wrong.',
        'SAME ARC → SAME ANGLE — slide the vertex anywhere along the far arc and the inscribed angle does not change: all inscribed angles intercepting the same arc are congruent. That is the photographer\'s curve.',
        'SEMICIRCLE COROLLARY (THALES) — if the two sides of an inscribed angle end at the ends of a DIAMETER, the intercepted arc is 180°, so the angle is ½(180°) = 90°. Any angle inscribed in a semicircle is a right angle.',
        'INSCRIBED QUADRILATERAL — if all four vertices of a quadrilateral lie on the circle, each pair of OPPOSITE angles is supplementary (sums to 180°), because their two intercepted arcs together make the full 360°.',
        'CLASSIC ERROR: HALVING THE WRONG DIRECTION — going arc → inscribed angle you HALVE; going inscribed angle → arc you DOUBLE. Sanity check: an inscribed angle is always SMALLER than the arc it intercepts, and never reaches 180°.',
      ],
      vocabulary: [
        { term: 'inscribed angle', definition: 'an angle whose vertex lies on the circle and whose sides are chords of that circle.' },
        { term: 'intercepted arc', definition: 'the arc lying in the interior of an angle, with endpoints where the angle\'s sides meet the circle.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-central-to-inscribed',
      kind: 'worked_example',
      problem:
        'Circle O has points A and B on it, and the central angle ∠AOB measures 110°. Point C is another point on the circle, on the major arc AB (the long way around, away from the 110° opening). Find the measure of arc AB (the minor arc) and the measure of inscribed angle ∠ACB.',
      steps: [
        'Locate each vertex: O is the CENTER, so ∠AOB is a central angle; C is ON the circle, so ∠ACB is an inscribed angle.',
        'Central angle = its arc: arc AB (minor) = m∠AOB = 110°.',
        'Find what ∠ACB intercepts: its sides are chords CA and CB, so it opens onto arc AB not containing C — the same 110° minor arc.',
        'Inscribed = half its arc: m∠ACB = ½(110°) = 55°. Sanity check: 55° is smaller than the 110° arc, as an inscribed angle must be. ✓',
      ],
      answer: 'arc AB = 110° and m∠ACB = 55°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-semicircle-direction-trap',
      kind: 'worked_example',
      problem:
        'In circle O, segment MN is a diameter and P is a third point on the circle. A student says: "The intercepted arc MN is 180°, and angle and arc are related by a factor of 2, so m∠MPN = 360°." Find the correct measure of ∠MPN and name the error.',
      steps: [
        'Check the vertex: P lies ON the circle and both sides PM and PN are chords, so ∠MPN is an INSCRIBED angle — the halving rule applies.',
        'Confirm the arc: MN is a diameter, so it splits the circle into two 180° arcs; the arc intercepted by ∠MPN is the semicircle not containing P, measuring 180°.',
        'Apply the rule in the right direction: inscribed angle = ½ (arc) = ½(180°) = 90°. The student doubled instead of halving.',
        'Catch it with the sanity check: a 360° angle is impossible, and an inscribed angle is always smaller than its arc. Name the result — any angle inscribed in a semicircle is a RIGHT angle (Thales\' Theorem), so △MPN is a right triangle with the right angle at P.',
      ],
      answer: 'm∠MPN = 90° — the inscribed angle is HALF its arc, not double; an angle inscribed in a semicircle is always right.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-same-arc',
      kind: 'try_yourself',
      problem:
        'In circle O, chord AB divides the circle into a minor arc and a major arc. Points C and D both lie on the major arc AB, and both ∠ACB and ∠ADB are inscribed angles intercepting the minor arc AB. If m∠ACB = 32°, what is m∠ADB?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '32°', correct: true },
        { id: 'b', text: '64°' },
        { id: 'c', text: '16°' },
        { id: 'd', text: 'It cannot be found without knowing where D sits on the arc' },
      ],
      expectedAnswer: '32°',
      hints: [
        'Both angles are inscribed, and both open onto the SAME arc — what does that force?',
        'Inscribed angles intercepting the same arc are congruent; moving the vertex along the arc changes nothing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cyclic-quad',
      kind: 'try_yourself',
      problem:
        'Quadrilateral WXYZ has all four of its vertices on circle O, with the vertices in order W, X, Y, Z around the circle. If m∠W = 85°, what is m∠Y?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '95°', correct: true },
        { id: 'b', text: '85°' },
        { id: 'c', text: '170°' },
        { id: 'd', text: '275°' },
      ],
      expectedAnswer: '95°',
      hints: [
        'W and Y are OPPOSITE vertices of a quadrilateral inscribed in a circle — what is true of that pair?',
        'Their intercepted arcs together make the whole 360°, so the angles are supplementary: 180° - 85°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In circle O, inscribed angle ∠ACB intercepts arc AB, and arc AB measures 70°. If m∠ACB = (3x + 5)°, solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '10',
      hints: [
        'First find the angle: an inscribed angle is half its intercepted arc, so m∠ACB = ½(70°).',
        'Set 3x + 5 = 35, subtract 5, then divide by 3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vertex-location',
      kind: 'misconception_check',
      question:
        'In circle O, central angle ∠AOB measures 40°. Point C is on the circle, and inscribed angle ∠ACB intercepts the same arc AB. A student answers that ∠ACB also measures 40°, saying "they cut off the same arc, so they are the same angle." What went wrong?',
      commonErrors: [
        {
          answer: 'm∠ACB = 40°',
          misconception: 'Treating every angle drawn in a circle by one rule, ignoring where the vertex sits.',
          correctsTo:
            'The vertex chooses the rule. At the CENTER, the angle equals its arc, so arc AB = 40°. ON the circle, the angle is HALF its arc, so m∠ACB = ½(40°) = 20°. Same arc, but the central angle is always twice the inscribed one — locate the vertex before writing a single number.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Vertex at the CENTER: the angle equals its intercepted arc. Vertex ON the circle: the angle is HALF its intercepted arc — so the central angle is twice the inscribed one on the same arc.',
        'Identify the intercepted arc first — for inscribed ∠ACB it is arc AB not containing C.',
        'Inscribed angles intercepting the SAME arc are congruent; an angle inscribed in a semicircle (sides ending at a diameter) is 90°.',
        'Opposite angles of a quadrilateral inscribed in a circle are supplementary (sum 180°).',
        'Direction check: arc → angle means halve, angle → arc means double; an inscribed angle is always smaller than its arc.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Central & Inscribed Angles' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
