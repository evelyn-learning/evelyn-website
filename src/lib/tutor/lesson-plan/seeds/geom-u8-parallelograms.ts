/**
 * Geometry — Quadrilaterals: Parallelograms & Their Properties.
 *
 * One definition (both pairs of opposite sides parallel) generates a whole
 * property list (CCSS G-CO.C.11, G-SRT.B.5): opposite sides and angles
 * congruent, consecutive angles supplementary, diagonals bisecting each
 * other. Equal billing for the converses — which conditions actually
 * PROVE a quadrilateral is a parallelogram, and the famous one that does
 * not (one pair parallel, the other pair congruent).
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U8_PARALLELOGRAMS: LessonPlan = {
  id: 'evelyn.hs.geom.parallelograms.v1',
  title: 'Parallelograms & Their Properties',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.parallelograms',
      standard: 'GEOM-8.2',
      description:
        'Apply the properties of parallelograms — congruent opposite sides and angles, supplementary consecutive angles, and diagonals that bisect each other — and use the valid converse conditions to prove a quadrilateral is a parallelogram (CCSS G-CO.C.11, G-SRT.B.5).',
    },
  ],
  prerequisites: ['geom.polygon-angle-sums'],
  followUps: ['geom.special-parallelograms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the parallelogram as the shape engineers build linkages out of — one definition that hands you a stack of guarantees for free.',
      script:
        'Pull open an expanding baby gate, raise a scissor lift, or swing a drafting lamp across a desk: every one of those is a chain of parallelograms. The lamp head stays at the same tilt no matter where you move it, and that is not clever engineering — it is a theorem. Once a shape has both pairs of opposite sides parallel, the opposite sides must be equal, the opposite angles must be equal, and the diagonals must cut each other in half. Today you earn that property list, then learn how to run it backwards to PROVE a shape is a parallelogram.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parallelogram-properties',
      kind: 'concept',
      goal: 'The definition, the four properties it forces, the valid converse conditions, and the two errors that eat the most points.',
      keyIdeas: [
        'THE DEFINITION — a parallelogram is a quadrilateral with BOTH pairs of opposite sides parallel. In parallelogram ABCD (vertices named in order around the shape) that means AB ∥ DC and BC ∥ AD. Every property below is a consequence of that one line.',
        'THE PROPERTY LIST — opposite sides are congruent (AB ≅ DC, BC ≅ AD); opposite angles are congruent (∠A ≅ ∠C, ∠B ≅ ∠D); consecutive (adjacent) angles are SUPPLEMENTARY (∠A + ∠B = 180°); the diagonals BISECT each other (they cut each other into two equal halves at their intersection).',
        'WHY THEY HOLD — draw diagonal AC. The parallel sides make alternate interior angles congruent, AC is shared (Reflexive Property), so △ABC ≅ △CDA by ASA. CPCTC then hands you the congruent opposite sides and angles in one move. A parallelogram is really two congruent triangles glued along a diagonal.',
        'CONSECUTIVE ANGLES ARE NOT EQUAL — this is the top error. Consecutive angles sit between two parallel sides cut by a transversal, so they are same-side interior angles: they add to 180°. A parallelogram has only TWO distinct angle measures, x and 180° - x, alternating around the shape. All four angles are equal only in the rectangle case.',
        'BISECT DOES NOT MEAN CONGRUENT — the diagonals of a parallelogram always cut each other in half, but the two diagonals are usually DIFFERENT lengths, and they usually are not perpendicular. Congruent diagonals belong to rectangles; perpendicular diagonals belong to rhombuses.',
        'PROVING A QUADRILATERAL IS A PARALLELOGRAM (the converses) — any ONE of these is enough: both pairs of opposite sides parallel (definition); both pairs of opposite sides congruent; both pairs of opposite angles congruent; the diagonals bisect each other; or ONE pair of opposite sides both parallel AND congruent.',
        'THE FALSE CONVERSE — one pair of opposite sides parallel and the OTHER pair congruent proves nothing: an isosceles trapezoid fits that description and is not a parallelogram. The parallel pair and the congruent pair must be the SAME pair of sides.',
        'AREA = BASE × HEIGHT — the height is the PERPENDICULAR distance between the two parallel bases, never the slanted side. A parallelogram with base 10 and slant side 6 does not have area 60 unless that side happens to be perpendicular to the base, which would make it a rectangle.',
      ],
      vocabulary: [
        { term: 'parallelogram', definition: 'a quadrilateral with both pairs of opposite sides parallel.' },
        { term: 'consecutive angles', definition: 'two angles of a polygon that share a side; in a parallelogram they are supplementary.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-angles-and-sides',
      kind: 'worked_example',
      problem:
        'ABCD is a parallelogram with vertices named in order, so AB ∥ DC and BC ∥ AD. Given ∠A = 62° and AB = 9, find ∠B, ∠C, ∠D, and the length of DC.',
      steps: [
        'Opposite angles are congruent, and ∠C is opposite ∠A, so ∠C = 62°.',
        'Consecutive angles are supplementary: ∠A and ∠B share side AB, so ∠B = 180° - 62° = 118°. (Do NOT copy 62° here — consecutive angles are supplementary, not congruent.)',
        '∠D is opposite ∠B, so ∠D = 118°. Check the quadrilateral angle sum: 62° + 118° + 62° + 118° = 360°. ✓',
        'Opposite sides are congruent, and DC is opposite AB, so DC = 9.',
      ],
      answer: '∠B = 118°, ∠C = 62°, ∠D = 118°, DC = 9',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-false-converse',
      kind: 'worked_example',
      problem:
        'In quadrilateral WXYZ (vertices in order), WX ∥ ZY and the other pair of opposite sides is congruent: XY ≅ WZ. A classmate concludes that WXYZ must be a parallelogram. Is that reasoning valid?',
      steps: [
        'Match the givens against the valid conditions: one pair PARALLEL (WX and ZY) plus the OTHER pair CONGRUENT (XY and WZ). That combination is not on the list — the valid one-pair condition needs the same pair to be both parallel and congruent.',
        'Hunt a counterexample. Build an isosceles trapezoid: let WX = 10 and ZY = 6 be the two parallel sides, with ZY centered under WX so each end overhangs by 2, and let the vertical distance between them be 3.',
        'Each leg then spans 2 across and 3 up, so XY = WZ (both are the same slanted length) — the givens are satisfied exactly. But XY and WZ tilt toward each other, so they are NOT parallel, and the shape is a trapezoid, not a parallelogram.',
        'Repair the reasoning: WX ∥ ZY together with WX ≅ ZY — the SAME pair, parallel and congruent — would force a parallelogram. Congruence on the other pair is the wrong pair.',
      ],
      answer: 'Not valid — an isosceles trapezoid satisfies both givens without being a parallelogram; the parallel pair and the congruent pair must be the same pair.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-consecutive-angle',
      kind: 'try_yourself',
      problem:
        'PQRS is a parallelogram with vertices named in order, so PQ ∥ SR and QR ∥ PS. If ∠P = 115°, what is the measure of ∠Q?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '65°', correct: true },
        { id: 'b', text: '115°' },
        { id: 'c', text: '90°' },
        { id: 'd', text: '245°' },
      ],
      expectedAnswer: '65°',
      hints: [
        '∠P and ∠Q share side PQ, so they are consecutive angles — are consecutive angles equal or supplementary?',
        'Consecutive angles are supplementary: 180° - 115° = 65°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-condition',
      kind: 'try_yourself',
      problem: 'Which single condition is enough to prove that a quadrilateral is a parallelogram?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One pair of opposite sides is both parallel and congruent', correct: true },
        { id: 'b', text: 'One pair of opposite sides is parallel and the other pair is congruent' },
        { id: 'c', text: 'The two diagonals are congruent' },
        { id: 'd', text: 'Two consecutive sides are congruent' },
      ],
      expectedAnswer: 'One pair of opposite sides is both parallel and congruent',
      hints: [
        'Three of these are also true of shapes that are definitely not parallelograms — an isosceles trapezoid or a kite.',
        'The one-pair condition works only when the SAME pair is parallel and congruent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In parallelogram ABCD the diagonals AC and BD intersect at point E. AE = 3x - 5 and EC = x + 7. Solve for x and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'The diagonals of a parallelogram bisect each other, so E is the midpoint of AC: AE = EC.',
        'Solve 3x - 5 = x + 7 by subtracting x from both sides, then adding 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diagonals-congruent',
      kind: 'misconception_check',
      question:
        'A student writes: "The diagonals of a parallelogram bisect each other, so the two diagonals are congruent." In parallelogram ABCD the diagonals meet at E — what has this student mixed up?',
      commonErrors: [
        {
          answer: 'AC = BD because the diagonals bisect each other',
          misconception: 'Reading "bisect each other" as "are equal to each other" — mixing up how each diagonal is CUT with how long the diagonals ARE.',
          correctsTo:
            'Bisecting means each diagonal is split into two equal halves at E: AE = EC and BE = ED. It says nothing about comparing AC to BD, and in a typical slanted parallelogram one diagonal is clearly longer than the other. Congruent diagonals are a RECTANGLE property, coming up next lesson.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Definition: both pairs of opposite sides parallel — every other property follows from splitting the shape into two congruent triangles with a diagonal.',
        'Opposite sides congruent, opposite angles congruent, consecutive angles SUPPLEMENTARY (not equal), diagonals bisect each other.',
        'Bisect ≠ congruent: the halves of each diagonal match, but the two diagonals are generally different lengths.',
        'To prove a parallelogram: both pairs of sides parallel, both pairs of sides congruent, both pairs of angles congruent, diagonals bisecting each other, or one pair that is both parallel AND congruent — never one pair parallel with the other pair congruent.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Parallelograms & Their Properties' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
