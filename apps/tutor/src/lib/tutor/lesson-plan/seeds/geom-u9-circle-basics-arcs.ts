/**
 * Geometry — Circles: Radii, Chords & Arcs.
 *
 * The vocabulary and the two structural facts the whole circle unit rests
 * on (CCSS G-C.A.1, G-C.A.2): every radius of a circle is congruent, and a
 * perpendicular dropped from the center bisects a chord. Arc MEASURE is
 * introduced here in degrees — and carefully separated from arc LENGTH,
 * the error that follows students all the way to Unit 10.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U9_CIRCLE_BASICS_ARCS: LessonPlan = {
  id: 'evelyn.hs.geom.circle-basics-arcs.v1',
  title: 'Circles: Radii, Chords & Arcs',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.circle-basics-arcs',
      standard: 'GEOM-9.1',
      description:
        'Identify and use the parts of a circle — radius, diameter, chord, secant, tangent, and arc — to find arc measures and to apply the radius-chord relationships, distinguishing arc measure in degrees from arc length (CCSS G-C.A.1, G-C.A.2).',
    },
  ],
  prerequisites: ['geom.trapezoids-kites'],
  followUps: ['geom.central-inscribed-angles'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the circle as the shape built from one repeated distance — the reason wheels, domes, and roundabouts work at all.',
      script:
        'A circle is the simplest shape in geometry and the most useful: it is just every point that sits the same distance from one center. That single rule is why a wheel rolls without bouncing, why a dome carries its own weight evenly, and why a roundabout keeps cars at a constant turn. Today you learn the parts — radius, chord, arc — and the two facts that unlock every circle problem for the rest of this course: every radius of a circle is congruent, and a perpendicular from the center cuts a chord exactly in half.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parts-and-arcs',
      kind: 'concept',
      goal: 'Circle vocabulary, arc measure from the central angle, and the two radius-chord theorems.',
      keyIdeas: [
        'THE DEFINING RULE — a circle is every point a fixed distance (the RADIUS) from the CENTER, and it is named by its center: circle O. So every radius is congruent: OA ≅ OB ≅ OC, always. Two radii drawn to the same chord therefore build an ISOSCELES triangle for free — that is the most-missed given in the whole unit.',
        'THE SEGMENTS AND LINES — CHORD: a segment with both endpoints on the circle. DIAMETER: a chord through the center, d = 2r, and the longest chord there is. SECANT: a line that cuts the circle at two points. TANGENT: a line touching the circle at exactly one point.',
        'ARCS COME IN THREE SIZES — a MINOR arc is less than 180° and is named with 2 letters (arc AB); a MAJOR arc is more than 180° and MUST be named with 3 letters (arc ACB, where C is a point on the long way around); a SEMICIRCLE is exactly 180°, its endpoints being the ends of a diameter. Naming a major arc with only two letters is the classic slip — arc AB always means the short way.',
        'ARC MEASURE COMES FROM THE CENTRAL ANGLE — a CENTRAL ANGLE has its vertex at the center, and the minor arc it cuts off has the same measure as the angle. Then major arc = 360° − minor arc, and all the arcs around a full circle add to 360°. ARC ADDITION: arcs that share an endpoint add, so arc AB + arc BC = arc ABC.',
        'MEASURE IS NOT LENGTH — arc measure is in DEGREES and ignores the size of the circle; arc length is in UNITS and grows with the radius. A 60° arc on a bike wheel and a 60° arc on a stadium track have the same measure and wildly different lengths. That is also why congruent arcs must have equal measure AND live in the same circle (or in congruent circles).',
        'THE PERPENDICULAR-FROM-THE-CENTER THEOREM — a radius or diameter that is PERPENDICULAR to a chord bisects that chord and its arc. Running it backwards: the perpendicular bisector of any chord passes through the center. The word perpendicular does all the work — a random segment from the center to a chord bisects nothing.',
        'EQUAL CHORDS SIT AT EQUAL DISTANCES — in one circle, two chords are congruent exactly when they are the same distance from the center (distance meaning the PERPENDICULAR distance). So the closer a chord is to the center, the longer it is, and the diameter — distance 0 — is the longest of all.',
        'THE WORKHORSE RIGHT TRIANGLE — drop the perpendicular from the center to a chord and a right triangle appears: the radius is the HYPOTENUSE, the center-to-chord distance is one leg, and HALF the chord is the other leg, so r² = (distance)² + (half-chord)². The classic error is feeding the FULL chord into that leg; the second classic error is stopping at the half-chord instead of doubling back to the whole chord.',
      ],
      vocabulary: [
        { term: 'chord', definition: 'a segment whose two endpoints both lie on the circle; a diameter is the special chord that passes through the center.' },
        { term: 'arc measure', definition: 'the size of an arc in degrees, equal to its central angle — a property of the angle, not of how long the arc physically is.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-chord-distance',
      kind: 'worked_example',
      problem:
        'Circle O has radius 13. Chord AB is drawn, and OM is the segment from center O to point M on AB with OM ⊥ AB and OM = 5. Find the length of AB.',
      steps: [
        'Draw the radius OA. Every radius of circle O is 13, so OA = 13 — that is the hypotenuse of the triangle we are about to use.',
        'Because OM ⊥ AB, triangle OMA has a right angle at M, with legs OM = 5 and AM, and hypotenuse OA = 13.',
        'Apply the Pythagorean Theorem: 5² + AM² = 13², so AM² = 169 − 25 = 144 and AM = 12. (It is the 5-12-13 triple.)',
        'AM is only HALF the chord: the perpendicular from the center bisects AB, so M is the midpoint. Double it: AB = 2(12) = 24.',
      ],
      answer: 'AB = 24',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-measure-vs-length',
      kind: 'worked_example',
      problem:
        'Circle P has radius 3 and circle Q has radius 12. Each has a 60° central angle cutting off an arc. A classmate says "both arcs are 60°, so the two arcs are congruent." Is that right?',
      steps: [
        'Check the measures first: a minor arc equals its central angle, so both arcs measure 60°. That part of the claim is true.',
        'Now compare the actual lengths. In circle P the arc is 60/360 = 1/6 of the circumference: (1/6)(2π · 3) = π ≈ 3.1 units.',
        'In circle Q the same fraction gives (1/6)(2π · 12) = 4π ≈ 12.6 units — four times as long, exactly the ratio of the radii.',
        'Congruent arcs must match in measure AND sit in the same circle or in congruent circles. These circles are not congruent, so the arcs have equal MEASURE but are not congruent arcs.',
      ],
      answer: 'No — both arcs measure 60°, but their lengths are π and 4π, so they are not congruent arcs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-major-arc',
      kind: 'try_yourself',
      problem:
        'In circle O, points A and B lie on the circle and the central angle ∠AOB measures 110°. Point C lies on the circle on the long way around from A to B. What is the measure of arc ACB?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '250°', correct: true },
        { id: 'b', text: '110°' },
        { id: 'c', text: '55°' },
        { id: 'd', text: '220°' },
      ],
      expectedAnswer: '250°',
      hints: [
        'Three letters means the MAJOR arc — the long way around through C, not the 110° short way.',
        'The two arcs together make a full circle: 360° − 110°.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-chord-distance',
      kind: 'try_yourself',
      problem:
        'Circle O has radius 8, and chord RS has length 8. How far is chord RS from the center O (measured along the perpendicular from O to RS)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4√3', correct: true },
        { id: 'b', text: '4√5' },
        { id: 'c', text: '4' },
        { id: 'd', text: '8' },
      ],
      expectedAnswer: '4√3',
      hints: [
        'Drop the perpendicular from O to RS. It bisects the chord, so one leg of the right triangle is 8/2 = 4, and the radius 8 is the hypotenuse.',
        'The distance is the OTHER leg: 8² = 4² + (distance)², so (distance)² = 64 − 16 = 48.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-arc-sum',
      kind: 'try_yourself',
      problem:
        'Points A, B, and C lie on circle P in that order, splitting the circle into three arcs. Arc AB measures 74° and arc BC measures 138°. Find the measure of arc CA in degrees. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '148',
      hints: [
        'The three arcs together go all the way around, so they must add to 360°.',
        'Add the two known arcs, then subtract from 360: 74 + 138 = 212.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-perpendicular',
      kind: 'misconception_check',
      question:
        'In circle O, chord AB is drawn. A student draws segment OM from the center to a point M on AB and writes "M is the midpoint of AB, because OM comes from the center." What went wrong?',
      commonErrors: [
        {
          answer: 'M is the midpoint because OM starts at the center',
          misconception: 'Believing any segment from the center to a chord bisects it, and dropping the perpendicular condition.',
          correctsTo:
            'Only a segment from the center that is PERPENDICULAR to the chord bisects it. A slanted OM lands off-center and splits AB into two unequal pieces. Before splitting a chord in half — or building the r² = (distance)² + (half-chord)² right triangle — confirm the ⊥ mark is actually given.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every radius of a circle is congruent — that free given turns two radii into an isosceles triangle, and d = 2r.',
        'Minor arc = its central angle, major arc = 360° − minor, and a major arc needs three letters; adjacent arcs add.',
        'Arc MEASURE is degrees and size-blind; arc LENGTH is units and grows with the radius. Congruent arcs need equal measure in the same or congruent circles.',
        'A radius perpendicular to a chord bisects the chord and its arc — and the perpendicular bisector of a chord runs through the center.',
        'Chord right triangle: r² = (center-to-chord distance)² + (half the chord)². Remember to double the half-chord back to the full chord.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Circles: Radii, Chords & Arcs' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
