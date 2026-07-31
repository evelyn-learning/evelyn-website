/**
 * Geometry — Foundations: Segment Measure, Distance & Midpoint.
 *
 * Where geometry gets numbers (CCSS G-CO.A.1, G-GPE.B.7): segment length,
 * the Segment Addition Postulate, midpoints, and the two coordinate
 * formulas. Distance SUBTRACTS, midpoint AVERAGES — the whole lesson lives
 * or dies on students keeping those two straight. Numeric work stays on
 * Pythagorean triples so answers come out whole.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U1_SEGMENTS_DISTANCE_MIDPOINT: LessonPlan = {
  id: 'evelyn.hs.geom.segments-distance-midpoint.v1',
  title: 'Segment Measure, Distance & Midpoint',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.segments-distance-midpoint',
      standard: 'GEOM-1.2',
      description:
        'Measure segments using the Segment Addition Postulate and midpoints, and compute the distance and midpoint between two points in the coordinate plane (CCSS G-CO.A.1, G-GPE.B.7).',
    },
  ],
  prerequisites: ['geom.points-lines-planes'],
  followUps: ['geom.angles-and-measure'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame coordinates plus two formulas as the machinery that turns pictures into measurements — how design and navigation software actually works.',
      script:
        'Last lesson, points and lines had no size — pure position. Today we attach numbers to them. Drop two pins on a map and your phone instantly tells you how far apart they are and where the halfway point sits. It is not doing anything mysterious: it is running two short formulas built straight out of the Pythagorean theorem and the idea of an average. Architects space columns with the same math, and every construction and proof in the rest of this course leans on it. Two formulas — but they pull in opposite directions, and mixing them up is the single most common mistake in the unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-measure-distance-midpoint',
      kind: 'concept',
      goal: 'Length notation, the Segment Addition Postulate, midpoints and bisectors, and the two coordinate formulas — with the errors that hide inside each.',
      keyIdeas: [
        'SEGMENT VS LENGTH — segment AB is a set of points: A, B, and everything between. AB written alone is a NUMBER, its length. So you say segment AB ≅ segment CD (congruent shapes) but AB = CD (equal numbers). Never write a segment equal to a number, and never write a length congruent to a length.',
        'SEGMENT ADDITION POSTULATE — if point B lies BETWEEN A and C on the same line, then AB + BC = AC. The whole equals the sum of its parts. Betweenness must be given or proven — if B is not between them, the equation is simply false.',
        'MIDPOINT — the point M on segment AB with AM = MB. It cuts the segment into two congruent halves, so AM = MB = ½ · AB, and going the other direction, AB = 2 · AM. A SEGMENT BISECTOR is any line, ray, segment, or plane that passes through the midpoint.',
        'DISTANCE ON A NUMBER LINE — the distance between coordinates a and b is |a − b|. Absolute value is why order does not matter: |3 − 10| and |10 − 3| both give 7. Length is never negative.',
        'DISTANCE FORMULA — for (x₁, y₁) and (x₂, y₂): d = √[(x₂ − x₁)² + (y₂ − y₁)²]. This is nothing but the Pythagorean theorem: the horizontal gap and the vertical gap are the legs of a right triangle, and the segment is the hypotenuse. Squaring erases sign errors, so a negative Δx is harmless.',
        'MIDPOINT FORMULA — M = ((x₁ + x₂)/2, (y₁ + y₂)/2). AVERAGE the x-coordinates, AVERAGE the y-coordinates. Distance SUBTRACTS; midpoint ADDS. Swapping the two is the number-one error in this unit — say "midpoint has no subtraction in it" out loud.',
        'THE ROOT DOES NOT DISTRIBUTE — √(6² + 8²) = √(36 + 64) = √100 = 10, NOT 6 + 8 = 14. You must finish the addition INSIDE the radical before taking the root. If your distance comes out equal to the two gaps added, you skipped a step.',
        'WORKING BACKWARD — given midpoint M and one endpoint A, the other endpoint is a reflection of A across M: x₂ = 2·x_M − x₁ and y₂ = 2·y_M − y₁. Do not average M with A — that lands you a quarter of the way along, not at the far end.',
      ],
      vocabulary: [
        { term: 'midpoint', definition: 'the point that divides a segment into two congruent segments — exactly halfway between the endpoints.' },
        { term: 'segment bisector', definition: 'a line, ray, segment, or plane that passes through the midpoint of a segment, cutting it into two congruent halves.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-distance-and-midpoint',
      kind: 'worked_example',
      problem:
        'Point A is at (−3, 2) and point B is at (5, 8) in the coordinate plane. Find the length AB and the coordinates of the midpoint of segment AB.',
      steps: [
        'Distance first. Horizontal gap: x₂ − x₁ = 5 − (−3) = 8. Vertical gap: y₂ − y₁ = 8 − 2 = 6. Subtracting a negative added, so the gap is 8, not 2.',
        'Square and add INSIDE the radical: d = √(8² + 6²) = √(64 + 36) = √100 = 10. Note it is 10, not 8 + 6 = 14 — the root never distributes.',
        'Midpoint next, and switch operations: average, do not subtract. x of M = (−3 + 5)/2 = 2/2 = 1. y of M = (2 + 8)/2 = 10/2 = 5.',
        'Sanity check: (1, 5) should sit between the endpoints on both axes — 1 is between −3 and 5, and 5 is between 2 and 8. ✓ And the 8-6-10 gaps are a scaled 3-4-5 triangle, which confirms the length.',
      ],
      answer: 'AB = 10; midpoint = (1, 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-missing-endpoint',
      kind: 'worked_example',
      problem:
        'M(1, −2) is the midpoint of segment AB, and endpoint A is at (−3, 4). A student averages M and A to get (−1, 1) and calls that B. Find the real coordinates of B and explain the error.',
      steps: [
        'Name the error: averaging M with A finds the midpoint of segment AM — the point a QUARTER of the way from A to B. The midpoint formula only runs forward, from two endpoints to the middle.',
        'Set up the formula with B unknown: (−3 + x₂)/2 = 1 and (4 + y₂)/2 = −2. Solve each by multiplying both sides by 2 first.',
        'x: −3 + x₂ = 2, so x₂ = 5. y: 4 + y₂ = −4, so y₂ = −8. B is at (5, −8).',
        'Shortcut worth keeping: B = (2·x_M − x_A, 2·y_M − y_A) = (2·1 − (−3), 2·(−2) − 4) = (5, −8). Same answer, one line.',
        'Check by running the midpoint formula forward on A(−3, 4) and B(5, −8): ((−3 + 5)/2, (4 + (−8))/2) = (1, −2) = M. ✓',
      ],
      answer: 'B is at (5, −8) — the student found the midpoint of AM instead of reflecting A across M.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-segment-addition',
      kind: 'try_yourself',
      problem:
        'Point B lies on segment AC, between A and C. AB = 3x, BC = x + 8, and AC = 32. What is the length BC?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6' },
        { id: 'b', text: '14', correct: true },
        { id: 'c', text: '18' },
        { id: 'd', text: '24' },
      ],
      expectedAnswer: '14',
      hints: [
        'B is between A and C, so the Segment Addition Postulate gives AB + BC = AC: 3x + (x + 8) = 32.',
        'Combine to 4x + 8 = 32, so x = 6 — but the question asks for BC = x + 8, not for x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-radical',
      kind: 'try_yourself',
      problem: 'Find the exact distance between P(−2, 1) and Q(3, 6).',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '10' },
        { id: 'b', text: '√10' },
        { id: 'c', text: '5√2', correct: true },
        { id: 'd', text: '50' },
      ],
      expectedAnswer: '5√2',
      hints: [
        'Horizontal gap: 3 − (−2) = 5. Vertical gap: 6 − 1 = 5. Both legs are 5.',
        'd = √(5² + 5²) = √50 — now simplify √50 by pulling out the perfect square 25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Find the distance between A(1, −2) and B(−3, 1). Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Horizontal gap: −3 − 1 = −4. Vertical gap: 1 − (−2) = 3. The signs vanish when you square.',
        'd = √((−4)² + 3²) = √(16 + 9) = √25 — a 3-4-5 triangle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-subtract-for-midpoint',
      kind: 'misconception_check',
      question:
        'To find the midpoint of the segment joining A(2, 7) and B(8, 3), a student subtracts the coordinates and reports the midpoint as (6, −4). What went wrong?',
      commonErrors: [
        {
          answer: '(6, −4)',
          misconception: 'Running the distance-style subtraction inside the midpoint formula — and the negative y should have been an instant red flag, since the midpoint of two positive y-values cannot be negative.',
          correctsTo:
            'Midpoint AVERAGES: M = ((2 + 8)/2, (7 + 3)/2) = (5, 5). Distance subtracts, midpoint adds and halves. Always check that the midpoint lands BETWEEN the endpoints on both axes — 5 is between 2 and 8, and between 7 and 3. ✓',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Segment AB is a shape (use ≅); AB alone is a number, its length (use =). If B is between A and C, then AB + BC = AC.',
        'A midpoint splits a segment into congruent halves: AM = MB = ½AB, so AB = 2AM. A segment bisector is anything passing through the midpoint.',
        'Distance = √[(x₂ − x₁)² + (y₂ − y₁)²] — Pythagoras in disguise. Finish the addition inside the radical; the root never distributes.',
        'Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) — average, never subtract. To recover a missing endpoint, reflect: x₂ = 2·x_M − x₁.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Segment Measure, Distance & Midpoint' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
