/**
 * G8 — Volume and surface area of 3D shapes.
 *
 * Cylinder, cone, sphere — formulas, when to use each, units.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_VOLUME_SURFACE_AREA: LessonPlan = {
  id: 'evelyn.g8.math.geometry.volume-surface.v1',
  title: 'Volume and surface area: cylinder, cone, sphere',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.g.c.9',
      description: 'Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world problems.',
      standard: 'CCSS.MATH.CONTENT.8.G.C.9',
    },
  ],
  prerequisites: ['ccss.math.7.g.b.6'],
  followUps: ['ccss.math.hsg-gmd.a.3'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor with real-world objects.',
      script: 'A soup can is a cylinder. An ice-cream cone is a cone. A basketball is a sphere. Each has its own volume formula — but they\'re all related, and once you see the relationship, they\'re easy to remember.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-formulas',
      kind: 'concept',
      goal: 'Volume formulas for the three shapes + surface area for cylinder.',
      keyIdeas: [
        'CYLINDER: V = πr²h. (Area of circular base × height.) Surface area = 2πr² + 2πrh (top + bottom + side).',
        'CONE: V = (1/3)πr²h. Exactly ONE-THIRD of a cylinder with the same base and height.',
        'SPHERE: V = (4/3)πr³. Surface area = 4πr².',
        'WHY 1/3 for the cone: imagine packing cones into a cylinder of the same base and height — exactly 3 cones\' worth of liquid fits in.',
        'UNITS: volume is always cubic (cm³, m³, in³). Area is squared (cm², m²).',
        'When solving: identify the shape, identify what\'s given (r, h, d), pick the right formula, plug in. Watch out: sometimes you\'re given DIAMETER, not radius — divide by 2 first.',
      ],
      vocabulary: [
        { term: 'volume', definition: 'how much space a 3D object takes up; measured in cubic units.' },
        { term: 'surface area', definition: 'total area of all surfaces of a 3D object; measured in square units.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-cylinder',
      kind: 'worked_example',
      problem: 'A soup can has radius 4 cm and height 10 cm. What is its volume?',
      steps: [
        'Cylinder formula: V = πr²h.',
        'Plug in: V = π(4)²(10) = π(16)(10) = 160π cm³.',
        'Numerical: 160 × 3.14 ≈ 502.4 cm³.',
        'Notice the units: cm³ (cubic centimeters), because it\'s VOLUME.',
      ],
      answer: '160π cm³ ≈ 502.4 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-sphere',
      kind: 'worked_example',
      problem: 'A basketball has radius 12 cm. Find its volume.',
      steps: [
        'Sphere formula: V = (4/3)πr³.',
        'Plug in: V = (4/3)π(12)³ = (4/3)π(1728) = 2304π cm³.',
        'Numerical: 2304 × 3.14 ≈ 7234.6 cm³.',
      ],
      answer: '2304π cm³ ≈ 7234.6 cm³',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A cone has radius 3 cm and height 9 cm. Find its volume in terms of π.',
      expectedAnswer: '27π',
      responseFormat: 'free',
      hints: [
        'V = (1/3)πr²h. Plug in r = 3 and h = 9.',
        '(1/3)π(9)(9) = (1/3)(81)π = 27π.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diameter',
      kind: 'misconception_check',
      question: 'A sphere has diameter 10. What\'s the cube in V = (4/3)πr³ — should you cube 10?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Plugging diameter directly as r.',
          correctsTo: 'No — formulas use RADIUS, not diameter. Diameter 10 → radius 5. Cube 5, not 10. V = (4/3)π(5)³ = (4/3)π(125) = 500π/3.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cylinder: V = πr²h.',
        'Cone: V = (1/3)πr²h. (One-third of cylinder.)',
        'Sphere: V = (4/3)πr³.',
        'Always check: is the value GIVEN the radius or the DIAMETER?',
        'Volume units are CUBIC; surface area units are SQUARED.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A cylinder, cone, and sphere all have radius r and height 2r (so the sphere fits exactly inside). What\'s the ratio of their volumes?',
      hint: 'Cylinder: π·r²·2r = 2πr³. Cone: (1/3)π·r²·2r = (2/3)πr³. Sphere: (4/3)πr³. Ratio cone:sphere:cylinder = 1:2:3.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
