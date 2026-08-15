/**
 * G6 — Area of composite shapes.
 *
 * Break complex shapes into rectangles, triangles, circles. Add or
 * subtract areas. Real-world: floor plans, irregular gardens.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_AREA_COMPOSITE: LessonPlan = {
  id: 'evelyn.g6.math.geometry.area-composite.v1',
  title: 'Area of composite shapes',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.g.a.1',
      description: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles.',
      standard: 'CCSS.MATH.CONTENT.6.G.A.1',
    },
  ],
  prerequisites: ['ccss.math.5.nf.b.4.b'],
  followUps: ['ccss.math.7.g.b.6'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Floor-plan problem to motivate decomposition.',
      script: 'You\'re carpeting an L-shaped room. There\'s no formula for "L-shape". So you BREAK IT INTO PIECES — two rectangles. Find each area, add them up. That\'s the trick for any complex shape.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Two strategies: ADD pieces or SUBTRACT cutouts.',
      keyIdeas: [
        'BASIC AREAS to know: rectangle (l·w), triangle ((1/2)·b·h), circle (π·r²), parallelogram (b·h).',
        'DECOMPOSITION (split into pieces): divide the composite shape into rectangles/triangles. Find each area. ADD.',
        'SUBTRACTION (cut out): if the shape is a big rectangle with a piece MISSING, find the big rectangle\'s area and SUBTRACT the missing piece.',
        'KEY: decide which strategy is FEWER STEPS for the given shape.',
        'SAME UNITS: convert if needed before adding (don\'t mix m² and cm²).',
      ],
      vocabulary: [
        { term: 'composite shape', definition: 'a shape made by combining simpler shapes.' },
        { term: 'decompose', definition: 'break a shape into simpler parts.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-l-shape',
      kind: 'worked_example',
      problem: 'An L-shaped room: imagine a 6×4 rectangle with a 2×2 square missing from one corner. Find total area.',
      steps: [
        'Big rectangle without cutout: 6 × 4 = 24.',
        'Missing piece: 2 × 2 = 4.',
        'L-shape area = big − missing = 24 − 4 = 20 square units.',
        'Alternative: divide L into two rectangles: 6×2 = 12 and 4×2 = 8. Sum: 20. Same answer.',
      ],
      answer: '20 square units',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A garden is a 10×6 rectangle with a triangular path cut out (base 4, height 3). Find the planted area.',
      expectedAnswer: '54',
      responseFormat: 'numeric',
      hints: [
        'Rectangle: 10 × 6 = 60.',
        'Triangle: (1/2)(4)(3) = 6.',
        'Subtract: 60 − 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-perimeters',
      kind: 'misconception_check',
      question: 'For composite shapes, can I add the SIDES of each piece together to get the area?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing perimeter with area, or summing dimensions.',
          correctsTo: 'No — adding sides gives PERIMETER, not area. Area requires multiplying (length × width or (1/2)·b·h, etc.). Compute each PIECE\'S area first, then ADD areas.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Decompose: split into rectangles/triangles/circles, add areas.',
        'Subtract: find big shape area, subtract missing pieces.',
        'Pick whichever is fewer steps.',
        'Don\'t add SIDES — multiply each piece\'s dimensions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A circle inscribed in a square: square is 10×10, circle has radius 5. Find the area BETWEEN them (inside square but outside circle).',
      hint: 'Square area: 100. Circle area: π·25 ≈ 78.5. Difference: ≈21.5 square units.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
