/**
 * Geometry — Triangles: Isosceles & Equilateral Triangles.
 *
 * The first big payoff of CPCTC (CCSS G-CO.C.10, G-CO.B.7): congruent sides
 * force congruent angles, and the statement runs backwards too. Nearly every
 * mistake here is a matching mistake — students pair an angle with the sides
 * that share its letter instead of the side ACROSS from it — so the lesson
 * drills "opposite, not adjacent" from the first sentence to the last.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U5_ISOSCELES_EQUILATERAL: LessonPlan = {
  id: 'evelyn.hs.geom.isosceles-equilateral.v1',
  title: 'Isosceles & Equilateral Triangles',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.isosceles-equilateral',
      standard: 'GEOM-5.4',
      description:
        'Apply the Isosceles Triangle Theorem, its converse, and the equilateral-equiangular corollary to find unknown angle measures and side lengths and to justify why a triangle is isosceles or equilateral (CCSS G-CO.C.10, G-CO.B.7).',
    },
  ],
  prerequisites: ['geom.cpctc-proofs'],
  followUps: ['geom.midsegments-bisectors-inequalities'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the isosceles triangle as the shape builders and designers reach for because one measurement determines the rest.',
      script:
        'Look at a roof truss, an A-frame cabin, a yield sign, a music stand. Almost none of them are scalene. Builders love isosceles and equilateral triangles because they are self-describing: tell a carpenter the peak angle of a gable and the two slopes are already decided, no second measurement needed. That symmetry is not an accident of construction — it is a theorem, and today you prove it, run it backwards, and use it to fill in an entire triangle from one number.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-isosceles-theorem',
      kind: 'concept',
      goal: 'The Isosceles Triangle Theorem and its converse, the equilateral corollary, the triple-duty apex segment, and the two matching errors.',
      keyIdeas: [
        'THE PARTS, NAMED FIRST — an isosceles triangle has two congruent LEGS, a BASE (the third side), a VERTEX ANGLE (the angle between the legs), and two BASE ANGLES (the angles that touch the base). Label these before computing anything.',
        'ISOSCELES TRIANGLE THEOREM — if two sides of a triangle are congruent, then the angles OPPOSITE those sides are congruent. In △ABC with AB ≅ AC, the base angles ∠B and ∠C are congruent. Proof sketch: draw the bisector of ∠A, get △ABD ≅ △ACD by SAS, then ∠B ≅ ∠C by CPCTC.',
        'THE CONVERSE IS ALSO TRUE — if two angles of a triangle are congruent, the sides opposite them are congruent. So you can prove a triangle is isosceles from angle measures alone, with no ruler involved.',
        'THE ANGLE ARITHMETIC — vertex angle + 2(base angle) = 180°. Rearranged: base angle = (180° − vertex)/2, and vertex = 180° − 2(base angle). One known angle gives you the other two.',
        'EQUILATERAL MEANS EQUIANGULAR, BOTH WAYS — apply the theorem to each pair of sides: all three sides congruent forces all three angles congruent, so each is 60°. The converse runs the same way — three 60° angles force three congruent sides.',
        'THE APEX SEGMENT DOES TRIPLE DUTY — the segment from the vertex angle to the midpoint of the base is simultaneously a median, an altitude (⊥ to the base), and the bisector of the vertex angle. It splits the triangle into two congruent right triangles.',
        'CLASSIC ERROR — PAIRING BY LETTERS: given AB ≅ AC a student pairs ∠A with ∠B because the letters look alike. Match each congruent side to the angle ACROSS from it: side AB is opposite ∠C, side AC is opposite ∠B, so ∠B ≅ ∠C.',
        'CLASSIC ERROR — ASSUMING THE GIVEN ANGLE IS THE VERTEX ANGLE: before you subtract from 180 and halve, check whether the angle you were handed sits between the legs (vertex) or touches the base (base angle). Halving a base angle problem is the single most common wrong answer in this unit.',
      ],
      vocabulary: [
        { term: 'vertex angle', definition: 'in an isosceles triangle, the angle formed by (between) the two congruent legs.' },
        { term: 'base angles', definition: 'the two angles that touch the base of an isosceles triangle; they are the angles opposite the congruent legs, and they are always congruent.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-fill-in-triangle',
      kind: 'worked_example',
      problem:
        'In △ABC, AB ≅ AC and ∠B measures 64°. Point M is the midpoint of BC, and segment AM is drawn. Find m∠C, m∠A, and m∠AMB.',
      steps: [
        'Identify the parts: AB and AC are the legs, so BC is the base, ∠A is the vertex angle, and ∠B and ∠C are the base angles.',
        'Isosceles Triangle Theorem: the angles opposite the congruent legs are congruent, so ∠C ≅ ∠B and m∠C = 64°.',
        'Use the angle sum: m∠A = 180° − 64° − 64° = 52°. (Same thing as vertex = 180° − 2(base angle).)',
        'AM runs from the vertex angle to the midpoint of the base, so it is the median — and in an isosceles triangle that segment is also the altitude, meaning AM ⊥ BC.',
        'Perpendicular means the angle at M is a right angle, so m∠AMB = 90°.',
      ],
      answer: 'm∠C = 64°, m∠A = 52°, m∠AMB = 90°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-which-angles-match',
      kind: 'worked_example',
      problem:
        'In △JKL, JK ≅ KL and m∠K = 104°. A student writes "∠J ≅ ∠K, because J and K are the letters in the congruent side JK," then reports m∠J = 104°. Find the correct measures and pinpoint the error.',
      steps: [
        'Find the shared vertex of the congruent sides: JK and KL both contain K, so the legs meet at K and ∠K is the VERTEX angle. The base is JL.',
        'Match each leg to the angle across from it: leg JK is opposite ∠L, leg KL is opposite ∠J. So the congruent pair is ∠J ≅ ∠L — the base angles — not ∠J and ∠K.',
        'The student paired by shared letters instead of by opposite position, which is why a 104° answer appeared for a base angle.',
        'Compute correctly: the two base angles share 180° − 104° = 76°, so each is 76°/2 = 38°.',
        'Sanity check: 38° + 38° + 104° = 180°, and the vertex angle being the obtuse one matches the picture of two long legs leaning apart.',
      ],
      answer: 'm∠J = m∠L = 38°; the error was pairing angles by shared letters instead of using the angles opposite the congruent sides.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-vertex-from-base',
      kind: 'try_yourself',
      problem:
        'In △PQR, PQ ≅ PR and ∠Q measures 55°. What is m∠P?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '70°', correct: true },
        { id: 'b', text: '55°' },
        { id: 'c', text: '62.5°' },
        { id: 'd', text: '125°' },
      ],
      expectedAnswer: '70°',
      hints: [
        'The congruent legs PQ and PR meet at P, so ∠P is the vertex angle and ∠Q and ∠R are the base angles.',
        'Both base angles are 55°, so subtract them both from 180°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equiangular',
      kind: 'try_yourself',
      problem:
        'In △XYZ, ∠X measures 60° and ∠Y measures 60°. Which statement must be true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '△XYZ is equilateral, so all three sides are congruent', correct: true },
        { id: 'b', text: 'Only YZ ≅ XZ, so the triangle is isosceles but not necessarily equilateral' },
        { id: 'c', text: 'Nothing can be concluded about the sides, because the converse does not hold' },
        { id: 'd', text: 'XY ≅ YZ, because the congruent angles are at X and Y' },
      ],
      expectedAnswer: '△XYZ is equilateral, so all three sides are congruent',
      hints: [
        'Find m∠Z first using the 180° angle sum before deciding what the sides do.',
        'All three angles turn out to be 60°, and equiangular forces equilateral.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'In isosceles △DEF, DE ≅ DF and the vertex angle ∠D measures 36°. Find m∠E in degrees. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '72',
      hints: [
        'The legs meet at D, so ∠E and ∠F are the congruent base angles.',
        'Subtract 36 from 180, then split what is left evenly between the two base angles.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-converse',
      kind: 'misconception_check',
      question:
        'In △DEF a student measures ∠D = 55° and ∠F = 55°, then says: "The angles match, but with no side lengths given I cannot conclude anything about the sides." What is the student missing?',
      commonErrors: [
        {
          answer: 'Nothing can be concluded about DE and EF without measuring them',
          misconception:
            'Believing the Isosceles Triangle Theorem runs only one direction — sides to angles — so angle information can never prove a side relationship.',
          correctsTo:
            'The CONVERSE is a theorem too: if two angles are congruent, the sides opposite them are congruent. ∠D is opposite EF and ∠F is opposite DE, so EF ≅ DE and △DEF is isosceles with vertex angle ∠E — proved from angles alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Congruent sides give congruent angles OPPOSITE them, and the converse holds: congruent angles give congruent opposite sides.',
        'Match by opposite position, never by shared letters — with AB ≅ AC the congruent angles are ∠B and ∠C.',
        'Angle arithmetic: vertex + 2(base angle) = 180°. Check which kind of angle you were given before halving.',
        'Equilateral and equiangular are the same condition: every side congruent exactly when every angle is 60°.',
        'From the vertex angle, the median to the base is also the altitude and the angle bisector — one segment, three jobs.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Isosceles & Equilateral Triangles' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
