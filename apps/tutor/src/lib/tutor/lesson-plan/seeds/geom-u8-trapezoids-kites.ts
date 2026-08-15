/**
 * Geometry — Quadrilaterals: Trapezoids & Kites.
 *
 * The two quadrilateral families that are NOT parallelograms (CCSS
 * G-CO.C.11, G-SRT.B.5). Trapezoids keep one pair of parallel sides, so
 * same-side angles stay supplementary and the midsegment averages the
 * bases; kites keep no parallel sides at all and trade them for
 * perpendicular diagonals. Most errors here come from importing
 * parallelogram habits into shapes that never earned them.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U8_TRAPEZOIDS_KITES: LessonPlan = {
  id: 'evelyn.hs.geom.trapezoids-kites.v1',
  title: 'Trapezoids & Kites',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.trapezoids-kites',
      standard: 'GEOM-8.4',
      description:
        'Apply the defining properties of trapezoids, isosceles trapezoids, and kites — supplementary same-side angles, congruent base angles and diagonals, the midsegment average, and perpendicular kite diagonals — to find unknown side lengths and angle measures (CCSS G-CO.C.11, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.special-parallelograms'],
  followUps: ['geom.circle-basics-arcs'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame trapezoids and kites as the quadrilaterals that give up parallel sides — and what they get in return.',
      script:
        'Look at a sailboat under way, a lampshade, or the side panel of a highway bridge truss: those shapes taper. They have one pair of parallel edges, not two. And a real kite in the sky has no parallel edges at all — yet it holds its shape perfectly, because its two crossbars meet at a right angle. These are the last two quadrilateral families, and neither one is a parallelogram. Today you learn exactly which properties they keep, which they lose, and why importing parallelogram habits into them is the single most common mistake in this unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trapezoids-kites',
      kind: 'concept',
      goal: 'Definitions, the isosceles-trapezoid package, the midsegment average, and the kite diagonal rules.',
      keyIdeas: [
        'TRAPEZOID — a quadrilateral with EXACTLY one pair of parallel sides. The parallel sides are the BASES; the other two are the LEGS. Base angles are the two angles sharing one base. The legs are never parallel — that is what keeps a trapezoid out of the parallelogram family.',
        'SAME-SIDE ANGLES ARE SUPPLEMENTARY — each leg is a transversal crossing the two parallel bases, so the two angles on the SAME leg add to 180°. In trapezoid ABCD with AB ∥ DC, ∠A + ∠D = 180° and ∠B + ∠C = 180°.',
        'ISOSCELES TRAPEZOID — legs congruent. That single condition buys three things: each PAIR of base angles is congruent, the DIAGONALS are congruent, and opposite angles are supplementary. Careful: the two angles on the top base and the two on the bottom base are congruent within their own pair, NOT across pairs.',
        'MIDSEGMENT — the segment joining the midpoints of the two LEGS (not the bases). It is parallel to both bases and its length is their AVERAGE: m = (b1 + b2)/2. Working backwards from the midsegment, double first: b2 = 2m - b1.',
        'KITE — two pairs of CONSECUTIVE congruent sides, with the opposite sides never congruent. The two vertices where a congruent pair meets are the VERTEX angles; the other two are the non-vertex angles.',
        'KITE DIAGONALS — always ⊥ to each other. The main diagonal (joining the two vertex angles) is the axis of symmetry: it BISECTS the other diagonal and bisects both vertex angles. Only ONE diagonal gets bisected — kites are not rhombuses.',
        'KITE ANGLES — exactly ONE pair of opposite angles is congruent, and it is the NON-vertex pair. The vertex angles are generally different. All four still sum to 360°, so the fourth angle comes from subtraction.',
        'AREA — kite area = (d1 × d2)/2, using the two diagonals. Trapezoid area = (b1 + b2)/2 × h, which is just midsegment × height.',
      ],
      vocabulary: [
        {
          term: 'midsegment of a trapezoid',
          definition: 'the segment connecting the midpoints of the two legs; it is parallel to both bases and equals their average.',
        },
        {
          term: 'vertex angle of a kite',
          definition: 'an angle at a vertex where two congruent sides meet; the main diagonal bisects both vertex angles.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-isosceles-angles',
      kind: 'worked_example',
      problem:
        'In trapezoid WXYZ the vertices are listed in order, WX ∥ ZY, and the legs WZ and XY are congruent. If ∠Z = 68°, find ∠Y, ∠W, and ∠X.',
      steps: [
        'Congruent legs means this is an ISOSCELES trapezoid, so each pair of base angles is congruent.',
        '∠Z and ∠Y both sit on the base ZY, so they are a base-angle pair: ∠Y = ∠Z = 68°.',
        'Leg WZ is a transversal between the parallel bases, so ∠W and ∠Z are same-side angles: ∠W = 180° - 68° = 112°.',
        '∠X pairs with ∠W on base WX, so ∠X = 112°. Check the total: 68 + 68 + 112 + 112 = 360°. ✓',
      ],
      answer: '∠Y = 68°, ∠W = 112°, ∠X = 112°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-kite-angle-trap',
      kind: 'worked_example',
      problem:
        'Kite ABCD has vertices in order with AB = AD and CB = CD. Given ∠A = 118° and ∠B = 96°, a student answers "∠C = 118°, because opposite angles of a kite are congruent." Find ∠C correctly and explain the error.',
      steps: [
        'Identify the vertex angles: the congruent pairs meet at A (AB = AD) and at C (CB = CD), so ∠A and ∠C are the VERTEX angles and ∠B, ∠D are the non-vertex pair.',
        'The congruent pair in a kite is the NON-vertex pair, so ∠D = ∠B = 96°. The student borrowed the parallelogram rule "opposite angles are congruent" and applied it to the wrong pair — vertex angles are generally unequal.',
        'Use the quadrilateral angle sum: ∠A + ∠B + ∠C + ∠D = 360°, so 118 + 96 + ∠C + 96 = 360.',
        'Combine the knowns: 310 + ∠C = 360, so ∠C = 50°. Sanity check: 118 + 96 + 50 + 96 = 360°. ✓',
      ],
      answer: '∠C = 50° — in a kite only the NON-vertex angles (∠B and ∠D) are congruent',
      estimatedMinutes: 3,
    },
    {
      id: 'try-isosceles-angle',
      kind: 'try_yourself',
      problem:
        'Isosceles trapezoid JKLM has its vertices in order, JK ∥ ML, and congruent legs KL and MJ. If ∠J = 118°, what is ∠M?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '62°', correct: true },
        { id: 'b', text: '118°' },
        { id: 'c', text: '32°' },
        { id: 'd', text: '59°' },
      ],
      expectedAnswer: '62°',
      hints: [
        '∠J and ∠M sit at the two ends of the same LEG, MJ — are they congruent or supplementary?',
        'Angles on the same leg are same-side angles between parallel bases, so they add to 180°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-kite-property',
      kind: 'try_yourself',
      problem: 'Which statement is ALWAYS true of a kite?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The diagonals are perpendicular to each other', correct: true },
        { id: 'b', text: 'The diagonals bisect each other' },
        { id: 'c', text: 'Both pairs of opposite angles are congruent' },
        { id: 'd', text: 'Both pairs of opposite sides are parallel' },
      ],
      expectedAnswer: 'The diagonals are perpendicular to each other',
      hints: [
        'Three of these are parallelogram or rhombus properties borrowed by mistake — a kite is neither.',
        'In a kite only the main diagonal bisects the other, and only the non-vertex angles are congruent. What is left is the ⊥ crossbars.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A trapezoid has a midsegment of length 17 and one base of length 12. Find the length of the other base and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '22',
      hints: [
        'The midsegment is the AVERAGE of the bases: 17 = (12 + b2)/2.',
        'Multiply both sides by 2 first, then subtract 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-midsegment-sum',
      kind: 'misconception_check',
      question:
        'A trapezoid has bases of 12 and 20. A student says the midsegment is 32. What went wrong?',
      commonErrors: [
        {
          answer: 'Midsegment = 32',
          misconception: 'Adding the two bases without dividing by 2 — treating the midsegment formula as a sum instead of an average.',
          correctsTo:
            'The midsegment is the AVERAGE: (12 + 20)/2 = 16. A quick sanity check catches this instantly — the midsegment sits between the bases, so its length must land BETWEEN 12 and 20, never above both.',
        },
        {
          answer: 'Midsegment 17 with one base 12, so the other base is 5',
          misconception: 'Working backwards from a known midsegment by subtracting the base directly, forgetting to double the midsegment first.',
          correctsTo: 'Undo the average before you undo the addition: from m = (b1 + b2)/2, multiply by 2 to get b1 + b2 = 2m, then b2 = 2m - b1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Trapezoid = exactly one pair of parallel sides; angles on the SAME leg are supplementary.',
        'Isosceles trapezoid: congruent legs → congruent base angles within each pair and congruent diagonals.',
        'Midsegment joins the LEG midpoints and equals the AVERAGE of the bases: m = (b1 + b2)/2, so b2 = 2m - b1.',
        'Kite: two pairs of consecutive congruent sides, diagonals ⊥, only the main diagonal bisects the other, and only the NON-vertex angles are congruent.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Trapezoids & Kites' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
