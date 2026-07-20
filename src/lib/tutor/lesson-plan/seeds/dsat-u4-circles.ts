/**
 * Digital SAT — Math / Geometry and Trigonometry: Circles.
 *
 * The digital SAT circle question is almost always the SAME move in
 * disguise: general-form equation → complete the square → read off
 * center and radius. That's the hardest recurring pattern on this
 * skill, especially once the leading coefficient isn't 1. Pair it
 * with the arc-length / sector-area fraction-of-360 formulas, which
 * show up just as often. Desmos is allowed on every math question —
 * graphing the equation is a fast way to sanity-check center/radius.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U4_CIRCLES: LessonPlan = {
  id: 'evelyn.testprep.dsat.circles.v1',
  title: 'Circles: Equations, Arcs & Sectors',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.circles',
      standard: 'DSAT-4.4',
      description:
        'Find the center and radius of a circle by completing the square from general form, and compute arc length and sector area from a central angle.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame circles as a small, high-yield slice of Geometry and Trig — worth it because the pattern barely varies.',
      script:
        'Geometry and Trig is about 15 percent of SAT Math, and circle questions show up on almost every test — usually one equation question and one arc-or-sector question. Both reduce to the same handful of moves. Learn to complete the square cleanly and you\'ve locked up these points every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-circles',
      kind: 'concept',
      goal: 'Standard form, completing the square from general form (including the leading-coefficient trap), and the arc-length/sector-area fractions.',
      keyIdeas: [
        'STANDARD FORM: (x − h)² + (y − k)² = r². Center (h, k), radius r. Read h and k as the OPPOSITE of the sign inside the parentheses — (x − 3)² means h = 3, but (y + 2)² means k = −2.',
        'GENERAL FORM → COMPLETE THE SQUARE. When the SAT gives x² + y² + Dx + Ey + F = 0, group the x-terms and y-terms and move the constant to the right, then complete the square on each variable: add (coefficient/2)² for x and for y — to BOTH sides.',
        'TRAP — LEADING COEFFICIENT ≠ 1. If the equation is written as Ax² + Ay² + ... = 0 with A ≠ 1, divide EVERY term by A first. Completing the square before clearing that coefficient scrambles both the center and the radius.',
        'TRAP — r² VS r. The right side of standard form is r², not r. Forgetting to take the square root at the end is the single most common circle-equation error on the digital SAT.',
        'ARC LENGTH and SECTOR AREA are fractions of the whole circle, using the central angle θ: Arc length = (θ/360) × 2πr. Sector area = (θ/360) × πr². The central angle IS the arc measure it cuts off, in degrees.',
        'TANGENT LINE is perpendicular to the radius at the point of tangency — this is how "find the slope of the tangent" questions get solved.',
        'DESMOS CHECK — type the equation straight into the calculator to read the center and radius off the graph, or graph the circle to sanity-check a sector-area answer.',
      ],
      vocabulary: [
        { term: 'general form', definition: 'a circle equation expanded out as x² + y² + Dx + Ey + F = 0, before completing the square.' },
        { term: 'sector', definition: 'a "pie slice" of a circle, bounded by two radii and an arc.' },
        { term: 'tangent', definition: 'a line that touches a circle at exactly one point, perpendicular to the radius there.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-complete-square',
      kind: 'worked_example',
      problem: 'Find the center and radius of the circle x² + y² − 6x + 4y − 3 = 0.',
      steps: [
        'Group the x-terms and y-terms, and move the constant to the right: (x² − 6x) + (y² + 4y) = 3.',
        'Complete the square on each: half of −6 is −3, squared is 9; half of 4 is 2, squared is 4. Add both to BOTH sides: (x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4 = 16.',
        'Factor: (x − 3)² + (y + 2)² = 16. Center (3, −2), radius √16 = 4.',
      ],
      answer: 'Center (3, −2), radius 4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-leading-coefficient-trap',
      kind: 'worked_example',
      problem: 'Find the center and radius of the circle 2x² + 2y² + 16x − 4y − 16 = 0.',
      steps: [
        'TRAP — the leading coefficient is 2, not 1. Divide every term by 2 first: x² + y² + 8x − 2y − 8 = 0.',
        'Group the x-terms and y-terms, and move the constant to the right: (x² + 8x) + (y² − 2y) = 8.',
        'Complete the square: half of 8 is 4, squared 16; half of −2 is −1, squared 1. Add both to BOTH sides: (x² + 8x + 16) + (y² − 2y + 1) = 8 + 16 + 1 = 25.',
        'Factor: (x + 4)² + (y − 1)² = 25. Center (−4, 1), radius √25 = 5.',
      ],
      answer: 'Center (−4, 1), radius 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-center',
      kind: 'try_yourself',
      problem: 'A circle in the xy-plane is defined by x² + y² − 4x − 10y + 13 = 0. What is the center of the circle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(−2, 5)' },
        { id: 'b', text: '(2, −5)' },
        { id: 'c', text: '(2, 5)', correct: true },
        { id: 'd', text: '(−2, −5)' },
      ],
      expectedAnswer: '(2, 5)',
      hints: [
        'Group the x-terms and y-terms, then complete the square on each.',
        'Half of −4 is −2 (squared 4); half of −10 is −5 (squared 25). (x − 2)² + (y − 5)² = 4 + 25 − 13 = 16 → center (2, 5).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sector',
      kind: 'try_yourself',
      problem: 'A circle with radius 9 has a central angle of 60°. What is the area of the sector formed by that angle?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4.5π' },
        { id: 'b', text: '9π' },
        { id: 'c', text: '13.5π', correct: true },
        { id: 'd', text: '27π' },
      ],
      expectedAnswer: '13.5π',
      hints: [
        'Sector area = (θ/360) × πr².',
        '60/360 = 1/6. (1/6) × π(81) = 13.5π.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-radius-spr',
      kind: 'try_yourself',
      problem: 'Student-produced response (type your answer): a circle has equation x² + y² + 6x − 8y = 0. What is its radius?',
      responseFormat: 'numeric',
      expectedAnswer: '5',
      hints: [
        'Group and complete the square: (x² + 6x) + (y² − 8y) = 0.',
        'Add 9 and 16 to both sides: (x + 3)² + (y − 4)² = 25. Radius = √25.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forgot-to-add-both-sides',
      kind: 'misconception_check',
      question:
        'A student simplifies x² + y² − 8x + 2y − 8 = 0 to (x − 4)² + (y + 1)² = 8 and reads the radius as √8. What went wrong?',
      commonErrors: [
        {
          answer: 'radius = √8',
          misconception:
            'Moved the constant to the right side but forgot to ALSO add the two completing-the-square numbers (16 and 1) to that same side.',
          correctsTo:
            '(x² − 8x + 16) + (y² + 2y + 1) = 8 + 16 + 1 = 25, so (x − 4)² + (y + 1)² = 25 and the radius is √25 = 5, not √8.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Standard form (x − h)² + (y − k)² = r²: center (h, k) is the OPPOSITE sign inside the parentheses; the right side is r², so take the square root for the radius.',
        'From general form, group x- and y-terms, then complete the square — adding (coefficient/2)² to BOTH sides for each variable. If the leading coefficient isn\'t 1, divide everything by it FIRST.',
        'Arc length = (θ/360) × 2πr; sector area = (θ/360) × πr². The central angle equals the arc it cuts off.',
        'Desmos graphs the circle instantly — use it to check a center/radius or sector answer, not to skip the algebra.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Circles: Equations, Arcs & Sectors' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
