/**
 * Geometry — Circles: Equations of Circles in the Coordinate Plane.
 *
 * Where the distance formula becomes a circle (CCSS G-GPE.A.1): a point is
 * on the circle exactly when its distance to the center equals r, so the
 * Pythagorean Theorem IS the equation. Standard form is read with two
 * sign flips and a square root — the two errors that swallow most answers —
 * and general form is recovered by completing the square.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U9_CIRCLE_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.geom.circle-equations.v1',
  title: 'Equations of Circles in the Coordinate Plane',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.circle-equations',
      standard: 'GEOM-9.4',
      description:
        'Derive and use the standard-form equation of a circle from the distance formula, read the center and radius from standard form, write the equation from a center-and-point or diameter description, and complete the square to convert general form to standard form (CCSS G-GPE.A.1).',
    },
  ],
  prerequisites: ['geom.tangents-secants-angles'],
  followUps: ['geom.area-polygons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the circle equation as the coverage-boundary test that lets a computer answer "is this point inside?" with one substitution.',
      script:
        'A cell tower covers every address within 12 miles of it. That coverage boundary is a circle — and once you can write its equation, a computer can check any address in the country with one substitution instead of measuring anything. Same idea behind a sprinkler pattern, a radar range, or the ring an earthquake sensor draws around itself. Today the definition of a circle — all points a fixed distance from a center — becomes an equation you can read, write, and dig back out of a scrambled form.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-circle-equation',
      kind: 'concept',
      goal: 'Standard form as the distance formula squared, the two reading traps, and completing the square from general form.',
      keyIdeas: [
        'WHERE IT COMES FROM — a point (x, y) is on the circle exactly when its distance to the center (h, k) equals r. The distance formula says √((x - h)² + (y - k)²) = r. Square both sides and the radical disappears. The circle equation IS the Pythagorean Theorem in disguise.',
        'STANDARD FORM — (x - h)² + (y - k)² = r². Center (h, k), radius r. Centered at the origin it collapses to x² + y² = r².',
        'TRAP 1: SIGN FLIP — h and k are the OPPOSITE of the sign written inside the parentheses, because the form subtracts them. (x - 3)² means h = 3; (y + 2)² is really (y - (-2))², so k = -2. Center (3, -2).',
        'TRAP 2: r² IS NOT r — the right side is the radius SQUARED. In (x - 1)² + (y - 4)² = 49 the radius is √49 = 7, not 49. Take the square root every single time.',
        'WRITING THE EQUATION FROM A DESCRIPTION — center plus radius: plug straight in. Center plus a point ON the circle: substituting that point gives r² directly, so you never have to simplify a radical. Endpoints of a DIAMETER: the midpoint is the center and HALF the distance is the radius.',
        'GENERAL FORM → COMPLETE THE SQUARE — given x² + y² + Dx + Ey + F = 0, group the x-terms and the y-terms, move the constant to the right, then add (coefficient/2)² for each variable to BOTH sides. Forgetting the right side is the classic wreck: the center survives, the radius does not.',
        'LEADING-COEFFICIENT CHECK — if the x² and y² terms carry a coefficient other than 1 (like 3x² + 3y² + ... = 0), divide EVERY term by it first. Completing the square before clearing that coefficient scrambles the center and the radius together.',
        'INSIDE, ON, OR OUTSIDE — substitute a point into the left side of standard form and compare to r²: less than r² is inside, equal is on the circle, greater is outside. That is the coverage test in one line.',
      ],
      vocabulary: [
        { term: 'standard form', definition: 'the circle equation written as (x - h)² + (y - k)² = r², with the center (h, k) and radius r readable directly.' },
        { term: 'general form', definition: 'the same circle expanded to x² + y² + Dx + Ey + F = 0, where the center and radius are hidden until you complete the square.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-complete-the-square',
      kind: 'worked_example',
      problem: 'Find the center and radius of the circle x² + y² - 6x + 4y - 12 = 0.',
      steps: [
        'The x² and y² terms both have coefficient 1, so no dividing is needed. Group by variable and move the constant to the right: (x² - 6x) + (y² + 4y) = 12.',
        'Complete the square on the x-group: half of -6 is -3, and (-3)² = 9. On the y-group: half of 4 is 2, and 2² = 4.',
        'Add BOTH numbers to BOTH sides: (x² - 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4, so the right side becomes 25.',
        'Factor each group into a perfect square: (x - 3)² + (y + 2)² = 25.',
        'Read it with the sign flip: h = 3 and k = -2, so the center is (3, -2). The right side is r², so r = √25 = 5.',
      ],
      answer: 'Center (3, -2), radius 5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-diameter-endpoints-error',
      kind: 'worked_example',
      problem:
        'A circle has a diameter whose endpoints are A(1, 2) and B(9, 8). A student writes the equation (x - 1)² + (y - 2)² = 100. Find the correct equation and name the two errors.',
      steps: [
        'The center of a circle is the midpoint of any diameter: midpoint of A(1, 2) and B(9, 8) is ((1 + 9)/2, (2 + 8)/2) = (5, 5). The student used the endpoint A as the center — error one.',
        'The distance from A to B is the DIAMETER: horizontal run 9 - 1 = 8, vertical rise 8 - 2 = 6, so AB = √(8² + 6²) = √100 = 10. That is a 6-8-10 right triangle.',
        'The radius is half the diameter: r = 10/2 = 5, so r² = 25. The student squared the whole diameter and wrote 100 — error two.',
        'Assemble standard form with h = 5, k = 5, r² = 25: (x - 5)² + (y - 5)² = 25.',
        'Check by substituting the endpoint A(1, 2): (1 - 5)² + (2 - 5)² = 16 + 9 = 25 ✓ — A really does sit on the circle.',
      ],
      answer: '(x - 5)² + (y - 5)² = 25 — the student used an endpoint as the center and used the full diameter as the radius.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-read-standard-form',
      kind: 'try_yourself',
      problem: 'A circle has the equation (x - 2)² + (y + 7)² = 81. What are its center and radius?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Center (2, -7), radius 9', correct: true },
        { id: 'b', text: 'Center (-2, 7), radius 9' },
        { id: 'c', text: 'Center (2, -7), radius 81' },
        { id: 'd', text: 'Center (-2, 7), radius 81' },
      ],
      expectedAnswer: 'Center (2, -7), radius 9',
      hints: [
        'Standard form subtracts the center coordinates, so flip the sign you see inside each set of parentheses.',
        '(y + 7)² is (y - (-7))², so k = -7. And the right side is r², so take the square root of 81.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-write-from-point',
      kind: 'try_yourself',
      problem:
        'Which equation represents the circle with center (3, -5) that passes through the point (3, 1)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(x - 3)² + (y + 5)² = 36', correct: true },
        { id: 'b', text: '(x + 3)² + (y - 5)² = 36' },
        { id: 'c', text: '(x - 3)² + (y + 5)² = 6' },
        { id: 'd', text: '(x - 3)² + (y - 5)² = 36' },
      ],
      expectedAnswer: '(x - 3)² + (y + 5)² = 36',
      hints: [
        'Both points share x = 3, so the radius is just the vertical gap from y = -5 up to y = 1.',
        'That gap is 6, so r = 6 and r² = 36 — and a center of -5 is written as (y + 5)².',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A circle in the coordinate plane has the equation x² + y² - 12x + 8y + 27 = 0. Find its radius and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Group and move the constant: (x² - 12x) + (y² + 8y) = -27.',
        'Add 36 and 16 to BOTH sides: (x - 6)² + (y + 4)² = -27 + 36 + 16 = 25. The radius is √25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reading-standard-form',
      kind: 'misconception_check',
      question:
        'A student looks at (x + 3)² + (y - 5)² = 49 and reports the center as (3, -5) and the radius as 49. What went wrong?',
      commonErrors: [
        {
          answer: 'Center (3, -5)',
          misconception: 'Copying the signs straight out of the parentheses instead of flipping them.',
          correctsTo:
            'The form subtracts the center: (x + 3)² is (x - (-3))², so h = -3, and (y - 5)² gives k = 5. The center is (-3, 5) — the exact opposite of what was reported.',
        },
        {
          answer: 'Radius 49',
          misconception: 'Reading the right side as the radius when it is the radius SQUARED.',
          correctsTo:
            'r² = 49, so r = √49 = 7. A radius of 49 would need 2401 on the right side.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Standard form (x - h)² + (y - k)² = r² is the distance formula squared — the definition of a circle written in algebra.',
        'Flip the signs inside the parentheses to get the center, and take the square root of the right side to get the radius.',
        'Building an equation: center plus a point gives r² directly; diameter endpoints give the center as the midpoint and the radius as half the distance.',
        'From general form, group, move the constant, and add (coefficient/2)² for each variable to BOTH sides — divide out any leading coefficient first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Equations of Circles in the Coordinate Plane' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
