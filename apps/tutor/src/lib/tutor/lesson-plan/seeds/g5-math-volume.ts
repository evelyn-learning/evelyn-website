/**
 * G5 — Volume of rectangular prisms.
 *
 * Volume as the COUNT of unit cubes that fit inside a 3D shape.
 * Builds from G3 area (which counted unit squares) by adding a third
 * dimension. V = length × width × height. Cubic units (cm³, ft³, m³)
 * because we're stacking square units into 3D space.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_VOLUME: LessonPlan = {
  id: 'evelyn.g5.math.volume.v1',
  title: 'Volume of Rectangular Prisms',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.md.c.3',
      description: 'Recognize volume as an attribute of solid figures and understand cubic units.',
      standard: 'CCSS.MATH.CONTENT.5.MD.C.3',
    },
    {
      id: 'ccss.math.5.md.c.5',
      description: 'Relate volume to multiplication; apply V = l × w × h.',
      standard: 'CCSS.MATH.CONTENT.5.MD.C.5',
    },
  ],
  prerequisites: ['ccss.math.3.md.c.7'],
  followUps: ['ccss.math.6.g.a.2'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie volume to a real container — how much room is inside?',
      script: 'You\'re packing a moving box. Will all your stuff fit? That depends on how much SPACE is inside the box — its volume. Today we\'ll figure out exactly how much room a box has.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cubic-units',
      kind: 'concept',
      goal: 'Volume is the count of unit cubes that fit. l × w × h works because layers of unit squares stack.',
      keyIdeas: [
        'VOLUME = how much 3D space is inside a solid figure.',
        'Measured in CUBIC UNITS — like cm³ (cubic centimeters), ft³ (cubic feet), m³ (cubic meters).',
        'A unit cube is 1 unit on each side. A box\'s volume = the count of unit cubes that pack inside.',
        'For a rectangular prism: V = length × width × height.',
        'Why? A bottom layer is length × width unit squares. The box is height layers tall. Total cubes = (length × width) × height.',
        'You can compute it in any order: 4 × 3 × 5 = 5 × 4 × 3 = 60. Same volume, same answer.',
      ],
      vocabulary: [
        { term: 'volume', definition: 'the amount of 3D space inside a solid figure.' },
        { term: 'cubic unit', definition: 'a 1×1×1 cube — the unit used to measure volume.' },
        { term: 'rectangular prism', definition: 'a 3D box with rectangular faces (like a cereal box).' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-box-4x3x5',
      kind: 'worked_example',
      problem: 'A box is 4 cm long, 3 cm wide, and 5 cm tall. Find its volume.',
      steps: [
        'Identify length, width, height: l = 4, w = 3, h = 5.',
        'Volume formula: V = l × w × h.',
        'Compute the bottom-layer area first: 4 × 3 = 12 cm² (12 cubes per layer).',
        'Multiply by height: 12 × 5 = 60. (60 cubes total — 5 layers of 12.)',
        'Volume = 60 cubic centimeters (60 cm³).',
      ],
      answer: '60 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A toy chest is 6 ft long, 2 ft wide, and 3 ft tall. What is its volume?',
      expectedAnswer: '36',
      responseFormat: 'numeric',
      hints: [
        'V = l × w × h.',
        '6 × 2 = 12. Then × 3.',
        'Don\'t forget the units — cubic feet (ft³).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-area-vs-volume',
      kind: 'misconception_check',
      question: 'Mira measures a box that\'s 5 cm by 5 cm by 5 cm and writes "Volume = 25 sq cm." What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Multiplying only two dimensions (treating it as area) and using square units instead of cubic.',
          correctsTo: 'Two errors. Volume needs all THREE dimensions: 5 × 5 × 5 = 125. And the units must be CUBIC, not square: 125 cm³ (cubic centimeters), not 25 sq cm.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Volume = how much 3D space is inside.',
        'Rectangular prism: V = length × width × height.',
        'Units: cubic — cm³, ft³, m³.',
        'Order of multiplication doesn\'t matter.',
        'Don\'t confuse volume with surface area or with face area — different measurements.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two boxes have the same volume (24 cm³). One is 2 × 3 × 4. List one OTHER set of dimensions for a box with volume 24.',
      hint: 'Find any three numbers that multiply to 24. Examples: 1×4×6, 2×2×6, 1×1×24.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
