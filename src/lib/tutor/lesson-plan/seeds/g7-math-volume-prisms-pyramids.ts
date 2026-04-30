/**
 * G7 — Volume of prisms and pyramids.
 *
 * V = base area × height for prisms; V = (1/3) base × height for
 * pyramids. Triangular and rectangular bases.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_VOLUME_PRISMS_PYRAMIDS: LessonPlan = {
  id: 'evelyn.g7.math.geometry.volume-prisms-pyramids.v1',
  title: 'Volume of prisms and pyramids',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.g.b.6',
      description: 'Solve real-world problems involving area, volume, and surface area of two- and three-dimensional objects.',
      standard: 'CCSS.MATH.CONTENT.7.G.B.6',
    },
  ],
  prerequisites: ['ccss.math.5.md.c.5'],
  followUps: ['ccss.math.8.g.c.9'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the formula intuition-based.',
      script: 'A box of cereal: a rectangular prism. To find how much cereal it holds, you find the AREA of the base and multiply by the HEIGHT. That\'s it. Volume of any prism = base × height.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-formulas',
      kind: 'concept',
      goal: 'Two formulas + how to compute base area for different shapes.',
      keyIdeas: [
        'PRISM = a 3D shape with two parallel, identical bases connected by rectangular sides. Cereal boxes (rectangular prism), Toblerone (triangular prism), hexagonal nut.',
        'V_prism = (Area of base) × height.',
        'PYRAMID = a 3D shape with one base and triangular faces meeting at a point. Egyptian pyramid (square base), tetrahedron (triangle base).',
        'V_pyramid = (1/3) × (Area of base) × height. The 1/3 factor — same as a cone vs cylinder.',
        'BASE AREA depends on the shape: rectangle (l·w), triangle ((1/2)·b·h), regular hexagon, etc.',
        'The HEIGHT of the prism/pyramid is PERPENDICULAR distance between bases (or base to apex), NOT the slant.',
      ],
      vocabulary: [
        { term: 'prism', definition: 'a 3D shape with two identical parallel bases.' },
        { term: 'pyramid', definition: 'a 3D shape with one base and triangular sides meeting at a point.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rect-prism',
      kind: 'worked_example',
      problem: 'A rectangular prism has dimensions 4 × 3 × 5. Find its volume.',
      steps: [
        'Pick a base (any face). Let\'s say the 4 × 3 rectangle on the bottom.',
        'Base area = 4 × 3 = 12 square units.',
        'Height (perpendicular to that base) = 5.',
        'V = base × height = 12 × 5 = 60 cubic units.',
      ],
      answer: '60 cubic units',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-triangular-prism',
      kind: 'worked_example',
      problem: 'A triangular prism has a base which is a triangle with base 6 cm and height 4 cm. The prism is 10 cm long. Find volume.',
      steps: [
        'Triangular base area = (1/2) × 6 × 4 = 12 cm².',
        'Length of prism (the height that connects the two triangular bases) = 10 cm.',
        'V = 12 × 10 = 120 cm³.',
      ],
      answer: '120 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A square pyramid has a base 5 × 5 and height 9. Find its volume.',
      expectedAnswer: '75',
      responseFormat: 'numeric',
      hints: [
        'Base area = 5 × 5 = 25.',
        'Pyramid: V = (1/3) × base × height = (1/3) × 25 × 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slant-height',
      kind: 'misconception_check',
      question: 'For a pyramid, can I use the SLANT height (along the side) in the volume formula?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Using slant height for volume.',
          correctsTo: 'No — volume uses the PERPENDICULAR height (straight up from the base to the apex). Slant height is for SURFACE AREA. Mixing them up is a very common error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prism: V = base area × height.',
        'Pyramid: V = (1/3) × base area × height.',
        'Compute base area first based on the shape (rectangle, triangle).',
        'Use PERPENDICULAR height, never slant.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the pyramid\'s formula have a 1/3 factor?',
      hint: 'Three identical pyramids exactly fit inside a prism with the same base and height. So pyramid = 1/3 of that prism. (You can also derive it with calculus integrating a shrinking square cross-section.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
