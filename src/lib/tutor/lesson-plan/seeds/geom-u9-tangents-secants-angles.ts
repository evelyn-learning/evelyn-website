/**
 * Geometry — Circles: Tangents, Secants & Angle Measures.
 *
 * The last chapter of the circle-angle story (CCSS G-C.A.2): the vertex
 * chooses the rule. At the center the angle equals its arc; on the circle
 * it is half of ONE arc (chords or a tangent — same rule); inside it is
 * half the SUM; outside it is half the DIFFERENCE, far arc minus near.
 * Plus the workhorse fact behind every tangent-length problem — the radius
 * drawn to the point of tangency is perpendicular to the tangent.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U9_TANGENTS_SECANTS_ANGLES: LessonPlan = {
  id: 'evelyn.hs.geom.tangents-secants-angles.v1',
  title: 'Tangents, Secants & Angle Measures',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.tangents-secants-angles',
      standard: 'GEOM-9.3',
      description:
        'Apply the tangent-radius perpendicularity and congruent-tangent-segment relationships, and find angle and arc measures formed by chords, secants, and tangents meeting on, inside, or outside a circle (CCSS G-C.A.2).',
    },
  ],
  prerequisites: ['geom.central-inscribed-angles'],
  followUps: ['geom.circle-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame tangent lines as the sightlines and straight runs that show up wherever a curve meets a straight path — then promise one rule that closes out every circle angle.',
      script:
        'Stand on a beach and look out to sea. The horizon is not the edge of anything — it is exactly the spot where your line of sight stops cutting through the Earth and just grazes it. That grazing line is a tangent. Satellite coverage footprints, the reach of a lighthouse beam, the straight run of belt between two pulleys, the point where a highway straightaway feeds into a circular curve — all tangents. You already know two circle angles: vertex at the center, vertex on the circle. Today you add tangents and secants and finish the set, so that any angle in any circle picture comes down to one question — where is the vertex?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vertex-position',
      kind: 'concept',
      goal: 'Tangent-radius perpendicularity, congruent tangent segments, and the on/inside/outside angle rules as one family sorted by vertex position.',
      keyIdeas: [
        'TANGENT ⊥ RADIUS — a tangent line touches a circle at exactly one point, the point of tangency, and the radius drawn to that point is PERPENDICULAR to the tangent. Drawing that radius is the first move in every tangent-length problem: it manufactures a right triangle you can finish with the Pythagorean Theorem.',
        'TWO TANGENTS FROM ONE POINT — if PA and PB are tangent to the same circle from external point P, then PA = PB. The two tangent segments are congruent, so △PAB is isosceles. (Reason: the two right triangles formed by the radii share hypotenuse PO and have equal radii.)',
        'VERTEX ON THE CIRCLE (TANGENT-CHORD) — an angle formed by a tangent and a chord meeting at the point of tangency is HALF its intercepted arc: m∠ = ½ (arc). Nothing new happened — this is the inscribed-angle rule with one side slid outward until it became a tangent.',
        'VERTEX INSIDE — two chords crossing at a point E inside the circle: the angle is HALF the SUM of the arc it intercepts and the arc its vertical angle intercepts. m∠ = ½ (first arc + second arc). Notice it is BIGGER than an inscribed angle on either arc alone.',
        'VERTEX OUTSIDE — two secants, a secant and a tangent, or two tangents meeting at an external point P: the angle is HALF the DIFFERENCE of the two intercepted arcs, FAR arc minus NEAR arc. m∠P = ½ (far − near). The result is always positive; a negative answer means you subtracted backwards.',
        'ONE STORY, FOUR VERTEX POSITIONS — center: angle = the whole arc. On the circle: half of ONE arc. Inside: half the SUM. Outside: half the DIFFERENCE. Walk the vertex from the center outward and the angle keeps SHRINKING — that ordering is a free sanity check on every answer.',
        'ARCS CLOSE TO 360° — all the arcs around a circle add to 360°. Exterior-angle problems usually hand you one arc and expect you to recover the other by subtracting from 360° BEFORE applying the rule. Skipping that recovery step is the most common wrong answer in this lesson.',
        'CLASSIC ERROR: WRONG OPERATION FOR THE VERTEX — adding the arcs when the vertex is outside, or subtracting them when it is inside. Locate the vertex first, write "sum" or "difference" down next to it, and only then start computing.',
      ],
      vocabulary: [
        { term: 'secant', definition: 'a line that intersects a circle at exactly two points (a chord extended in both directions).' },
        { term: 'point of tangency', definition: 'the single point where a tangent line touches the circle — the radius drawn there is perpendicular to the tangent.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-inside-chords',
      kind: 'worked_example',
      problem:
        'In circle O, points A, B, C, and D lie on the circle in that order. Chords AC and BD cross at point E inside the circle. Arc AB measures 70° and arc CD measures 50°. Find m∠AEB and m∠BEC.',
      steps: [
        'Locate the vertex: E is INSIDE the circle, where two chords cross — so the half-the-SUM rule applies.',
        'Find the two arcs for ∠AEB: it opens onto arc AB = 70°, and its VERTICAL angle ∠CED opens onto arc CD = 50°. Those are the two intercepted arcs.',
        'Apply the rule: m∠AEB = ½ (70° + 50°) = ½ (120°) = 60°.',
        '∠BEC is the supplement of ∠AEB along the straight chord AC, so m∠BEC = 180° − 60° = 120°.',
        'Check it with the rule instead: ∠BEC intercepts arc BC and arc AD, and those two arcs make up the rest of the circle: 360° − 70° − 50° = 240°. So m∠BEC = ½ (240°) = 120°. ✓',
      ],
      answer: 'm∠AEB = 60° and m∠BEC = 120°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-outside-sum-trap',
      kind: 'worked_example',
      problem:
        'From a point P outside circle O, a tangent touches the circle at T and a secant passes through the circle at A (the nearer point) and then B (the farther point). The far arc TB (the arc from T to B not containing A) measures 160°, and the near arc TA (from T to A not containing B) measures 40°. A student writes m∠P = ½ (160° + 40°) = 100°. Find the correct measure of ∠P and name the error.',
      steps: [
        'Locate the vertex: P is OUTSIDE the circle, so the rule is half the DIFFERENCE, not half the sum. The student used the inside-the-circle rule on an outside-the-circle picture.',
        'Sort the two intercepted arcs: the FAR arc (the one across the circle from P) is arc TB = 160°; the NEAR arc (the one closest to P) is arc TA = 40°.',
        'Apply the rule: m∠P = ½ (far − near) = ½ (160° − 40°) = ½ (120°) = 60°.',
        'Sanity check the 100°: an angle with its vertex ON the circle intercepting the 160° arc would measure ½ (160°) = 80°, and pulling the vertex OUTSIDE only shrinks the angle further. So ∠P must be under 80° — 100° was impossible before any arithmetic.',
        'Tangent or secant makes no difference to the formula: at an external vertex it is always half the difference, whether the sides are two secants, a secant and a tangent, or two tangents.',
      ],
      answer: 'm∠P = 60° — an external vertex takes half the DIFFERENCE of the arcs (far minus near), not half the sum.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-two-secants',
      kind: 'try_yourself',
      problem:
        'From a point P outside circle O, two secants are drawn. The first passes through the circle at A (nearer to P) and then B (farther). The second passes through at C (nearer to P) and then D (farther). The far arc BD (between the two farther points, not containing A or C) measures 120°, and the near arc AC (between the two nearer points, not containing B or D) measures 30°. What is m∠P?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '45°', correct: true },
        { id: 'b', text: '75°' },
        { id: 'c', text: '90°' },
        { id: 'd', text: '60°' },
      ],
      expectedAnswer: '45°',
      hints: [
        'The vertex P is outside the circle — does that call for the sum of the arcs or the difference?',
        'm∠P = ½ (far arc − near arc) = ½ (120° − 30°).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tangent-chord',
      kind: 'try_yourself',
      problem:
        'A tangent line touches circle O at point T, and R is another point on the circle. Chord TR is drawn, forming an angle with the tangent line at T. The arc TR lying inside that angle measures 130°. What is the measure of the tangent-chord angle at T?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '65°', correct: true },
        { id: 'b', text: '130°' },
        { id: 'c', text: '115°' },
        { id: 'd', text: '50°' },
      ],
      expectedAnswer: '65°',
      hints: [
        'The vertex T sits ON the circle — that is the same halving rule you used for inscribed angles.',
        'A tangent-chord angle is half its intercepted arc: ½ (130°).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Circle O has radius 5. Point P lies outside the circle with OP = 13, and segment PT is tangent to the circle at point T. Find the length PT and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '12',
      hints: [
        'Draw radius OT. A radius meets a tangent at a right angle, so △OTP has its right angle at T, with hypotenuse OP = 13 and leg OT = 5.',
        'Pythagorean Theorem: PT² = 13² − 5² = 169 − 25 = 144.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forgot-near-arc',
      kind: 'misconception_check',
      question:
        'Two tangents are drawn to circle O from an external point P, touching the circle at A and B. The major arc AB (the far arc, the long way around) measures 220°. A student answers m∠P = ½ (220°) = 110°, saying "the angle is half its arc." What went wrong?',
      commonErrors: [
        {
          answer: 'm∠P = 110°',
          misconception:
            'Using only the far arc and halving it — importing the inscribed-angle habit into a picture where the vertex is OUTSIDE the circle, and never recovering the second arc.',
          correctsTo:
            'An external vertex uses half the DIFFERENCE of TWO arcs. The near arc is whatever is left of the 360°: 360° − 220° = 140°. So m∠P = ½ (220° − 140°) = ½ (80°) = 40°. Cross-check with the radii: OA ⊥ PA and OB ⊥ PB, so quadrilateral PAOB has angles 90° + 90° + 140° + m∠P = 360°, giving m∠P = 40°. ✓',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Find the vertex first: center → angle = the arc; ON the circle (inscribed OR tangent-chord) → half of ONE arc; INSIDE → half the SUM of two arcs; OUTSIDE → half the DIFFERENCE, far minus near.',
        'A radius drawn to the point of tangency is perpendicular to the tangent — that right angle turns tangent-length questions into Pythagorean Theorem questions.',
        'Two tangent segments drawn from the same external point are congruent, so the triangle they form with the chord of contact is isosceles.',
        'All arcs around a circle total 360° — recover the missing arc by subtracting before you apply an external-angle rule.',
        'Sanity check by moving the vertex: the angle shrinks as the vertex travels from the center, to the circle, to the outside. An external angle can never reach half the far arc.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Tangents, Secants & Angle Measures' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
