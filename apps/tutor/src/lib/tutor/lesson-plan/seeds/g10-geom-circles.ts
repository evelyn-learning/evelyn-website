/**
 * G10 — Geometry: Circles (vocabulary, circumference, area, arc /
 * sector measure, central vs inscribed angles).
 *
 * Core circle vocabulary (radius, diameter, chord, tangent, arc,
 * sector). The two formulas C = 2πr and A = πr² that everyone needs.
 * Arc length and sector area as fractions of the whole. Central
 * angle = arc; inscribed angle = half the arc.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_GEOM_CIRCLES: LessonPlan = {
  id: 'evelyn.g10.math.geometry.circles.v1',
  title: 'Circles',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'circles',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.c.a.1',
      description: 'Prove that all circles are similar.',
      standard: 'CCSS.MATH.CONTENT.HSG.C.A.1',
    },
    {
      id: 'ccss.math.hsg.c.b.5',
      description: 'Derive arc length and sector area formulas using similarity.',
      standard: 'CCSS.MATH.CONTENT.HSG.C.B.5',
    },
  ],
  prerequisites: ['ccss.math.7.g.b.4'],
  followUps: ['ccss.math.hsg.c.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up π as the magic constant that ties all circle measurements together.',
      script: 'Take a string and wrap it around any circle. Cut the string. Now lay it next to a string that\'s the diameter of the SAME circle. The wrap is always about 3.14 times the diameter. ALWAYS — no matter the size. That magic 3.14… is π, and it shows up in every circle formula you\'ll ever use.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vocab-and-formulas',
      kind: 'concept',
      goal: 'Vocabulary; C and A formulas; arc / sector as fractions.',
      keyIdeas: [
        'CENTER: the middle point. RADIUS (r): distance from center to edge. DIAMETER (d): edge-to-edge through center. d = 2r.',
        'CHORD: line segment between any two points on the circle. (A diameter is the longest chord.)',
        'TANGENT line: touches the circle at exactly one point.',
        'ARC: a piece of the edge of the circle. SECTOR: a "pizza slice" — a wedge bounded by two radii and an arc.',
        'CIRCUMFERENCE (the distance around): C = 2πr (or πd).',
        'AREA: A = πr².',
        'A full circle is 360°. A central angle θ slices off the matching fraction:',
        '  Arc length = (θ / 360) × 2πr.',
        '  Sector area = (θ / 360) × πr².',
        'CENTRAL ANGLE (vertex at center) = the arc it subtends, in degrees.',
        'INSCRIBED ANGLE (vertex on the circle) = HALF the arc it subtends.',
      ],
      vocabulary: [
        { term: 'radius', definition: 'distance from the center to any point on the circle.' },
        { term: 'circumference', definition: 'the distance around a circle.' },
        { term: 'sector', definition: 'a "pie slice" — bounded by two radii and an arc.' },
        { term: 'inscribed angle', definition: 'an angle whose vertex is on the circle.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-circumference-area',
      kind: 'worked_example',
      problem: 'A circle has radius 5 cm. Find its circumference and area.',
      steps: [
        'Circumference: C = 2πr = 2π(5) = 10π cm. Decimal: ≈ 31.4 cm.',
        'Area: A = πr² = π(5²) = 25π cm². Decimal: ≈ 78.5 cm².',
        'Notice the units: circumference in cm (length), area in cm² (square units).',
      ],
      answer: 'C = 10π ≈ 31.4 cm, A = 25π ≈ 78.5 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sector',
      kind: 'worked_example',
      problem: 'A circle has radius 8. Find the area of the sector formed by a 90° central angle.',
      steps: [
        '90° is 1/4 of the full 360°.',
        'Full area: π(8²) = 64π.',
        'Sector area: (1/4)(64π) = 16π ≈ 50.3 square units.',
      ],
      answer: '16π ≈ 50.3',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A pizza has a 12-inch diameter. What is its area? (Use π ≈ 3.14.)',
      expectedAnswer: '113.04',
      responseFormat: 'numeric',
      hints: [
        'Diameter 12 means radius 6.',
        'A = πr² = 3.14 × 36 = 113.04 sq inches.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-r-vs-d',
      kind: 'misconception_check',
      question: 'A circle has DIAMETER 10. Owen plugs 10 into A = πr² and gets 100π. What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Using diameter where the formula calls for radius.',
          correctsTo: 'The formula uses RADIUS, not diameter. Radius = 10/2 = 5. A = π(5²) = 25π — exactly 1/4 of Owen\'s answer. Always read the problem carefully and convert if needed.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'C = 2πr (or πd). A = πr².',
        'Arc length = (θ/360)(2πr). Sector area = (θ/360)(πr²).',
        'Central angle = its arc. Inscribed angle = half its arc.',
        'Watch radius vs diameter — many formulas use r.',
        'Length units for C/arc, square units for A/sector.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'An inscribed angle subtends an arc of 80°. What is the inscribed angle\'s measure?',
      hint: 'Inscribed = half the arc. 80°/2 = 40°.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
