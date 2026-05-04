/**
 * GRE Quant — Circles.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_CIRCLES: LessonPlan = {
  id: 'evelyn.gre.q.circles.v1',
  title: 'GRE Quant — Circles',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.circles',
      description: 'Apply circumference, area, arc, sector, and inscribed-angle properties to GRE circle questions.',
      standard: 'GRE-Q-GEOM-CIRCLE',
    },
  ],
  prerequisites: ['gre.q.quadrilaterals'],
  followUps: ['gre.q.3d-geometry'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Circles arrive as standalone questions or hidden inside polygon problems — knowing the formulas keeps them painless.',
      script: 'Circumference 2πr. Area πr². Arc length and sector area scale with the angle fraction. Inscribed angles half the central angle. Five facts; everything else flows from them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-circles',
      kind: 'concept',
      goal: 'Core circle formulas + inscribed-angle facts + arc/sector relationships.',
      keyIdeas: [
        'CIRCUMFERENCE: C = 2πr = πd.',
        'AREA: A = πr².',
        'ARC LENGTH (degrees): s = (θ/360)·2πr.',
        'SECTOR AREA: A_sector = (θ/360)·πr².',
        'INSCRIBED ANGLE THEOREM: angle at the circumference = (1/2) × angle at the centre subtended by the same arc.',
        'ANGLE IN SEMICIRCLE = 90° (Thales).',
        'TANGENT-RADIUS: tangent meets radius at 90° at the point of contact.',
        'CONCENTRIC CIRCLES: same centre, different radii. Annulus area = πR² − πr².',
        'CIRCLE EQUATION: (x − h)² + (y − k)² = r². Centre (h, k), radius r.',
        'INSCRIBED / CIRCUMSCRIBED: a circle inside a polygon touches the sides; outside passes through vertices.',
      ],
      vocabulary: [
        { term: 'sector', definition: 'a pie-slice region bounded by two radii and an arc.' },
        { term: 'inscribed angle', definition: 'an angle whose vertex lies on the circle and whose sides are chords.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sector',
      kind: 'worked_example',
      problem: 'A circle has radius 6. A sector subtends 120° at the centre. Find the arc length and sector area.',
      steps: [
        'Arc length = (120/360)·2π·6 = (1/3)·12π = 4π.',
        'Sector area = (120/360)·π·6² = (1/3)·36π = 12π.',
      ],
      answer: 'Arc length 4π; sector area 12π',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A circle has area 16π. Find the circumference.',
      expectedAnswer: '8π',
      responseFormat: 'numeric',
      hints: [
        'πr² = 16π → r² = 16 → r = 4.',
        'Circumference = 2π·4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pi-squared',
      kind: 'misconception_check',
      question: 'A student writes circumference of a circle as π² instead of 2π. What\'s the underlying confusion?',
      commonErrors: [
        {
          answer: 'C = π²',
          misconception: 'Mixing up circumference 2πr with area πr², specifically blurring the constants.',
          correctsTo: 'Circumference is LINEAR (units of length): C = 2πr. Area is QUADRATIC (units of length squared): A = πr². For r = 1: C = 2π ≈ 6.28; A = π ≈ 3.14. Circumference and area are different units, dimensionally — circumference is in cm, area is in cm². π² has nothing to do with circles directly; it pops up rarely in pure mathematics.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'C = 2πr; A = πr².',
        'Arc = (θ/360)·2πr; Sector = (θ/360)·πr².',
        'Inscribed angle = (1/2)·central angle on the same arc.',
        'Angle in a semicircle = 90°.',
        'Tangent ⊥ radius at point of contact.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A square is inscribed in a circle of radius 5. Find the area of the square.',
      hint: 'Diagonal of square = diameter of circle = 10. Side = 10/√2 = 5√2. Area = (5√2)² = 50.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
