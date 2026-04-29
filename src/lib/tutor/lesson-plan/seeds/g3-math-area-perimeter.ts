/**
 * G3 — Area and Perimeter (rectangles).
 *
 * Two distinct measurements that students mix up. Perimeter = walking
 * around the edge. Area = covering the inside. Both for the same
 * rectangle, but they answer different questions and use different
 * units (length vs square units). Connects area to multiplication
 * (rows × columns of unit squares).
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_AREA_PERIMETER: LessonPlan = {
  id: 'evelyn.g3.math.area-perimeter.v1',
  title: 'Area and Perimeter',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'measurement',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.md.c.5',
      description: 'Recognize area as an attribute of plane figures and understand square units.',
      standard: 'CCSS.MATH.CONTENT.3.MD.C.5',
    },
    {
      id: 'ccss.math.3.md.c.7',
      description: 'Relate area of rectangles to multiplication and to addition.',
      standard: 'CCSS.MATH.CONTENT.3.MD.C.7',
    },
    {
      id: 'ccss.math.3.md.d.8',
      description: 'Solve real-world problems involving perimeter of polygons.',
      standard: 'CCSS.MATH.CONTENT.3.MD.D.8',
    },
  ],
  prerequisites: ['ccss.math.3.oa.a.1'],
  followUps: ['ccss.math.4.md.a.3'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use two questions about the same garden to show area and perimeter answer different things.',
      script: 'Imagine a rectangular garden. If you wanted to put a fence around it, you\'d need to know one thing — the distance ALL the way around. If you wanted to cover the whole inside with grass, you\'d need a different measurement — how much SPACE is inside. Today we\'ll name both.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-perimeter-vs-area',
      kind: 'concept',
      goal: 'Perimeter measures the boundary; area measures the surface inside. Different formulas, different units.',
      keyIdeas: [
        'PERIMETER = the total distance around the outside of a shape. Add up all the side lengths.',
        'AREA = the amount of flat space INSIDE the shape. Count how many unit squares fit.',
        'For a rectangle: perimeter = 2 × (length + width). Or: length + length + width + width.',
        'For a rectangle: area = length × width. Same as counting rows of unit squares.',
        'Perimeter is measured in regular units (cm, ft, m). Area is measured in SQUARE units (cm², ft², m²).',
      ],
      vocabulary: [
        { term: 'perimeter', definition: 'the total distance around a shape\'s edge.' },
        { term: 'area', definition: 'the amount of space inside a flat shape.' },
        { term: 'square unit', definition: 'one square that\'s 1 unit on each side, used to measure area.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rectangle-5x3',
      kind: 'worked_example',
      problem: 'A rectangular rug is 5 feet long and 3 feet wide. Find its perimeter and its area.',
      steps: [
        'Draw the rectangle and label the sides: length = 5 ft, width = 3 ft.',
        'Perimeter: walk around the edge. 5 + 3 + 5 + 3 = 16 feet.',
        'Or use the shortcut: 2 × (5 + 3) = 2 × 8 = 16 feet.',
        'Area: cover the inside with 1×1 square tiles. 5 columns of 3 = 15 squares.',
        'Or use the shortcut: length × width = 5 × 3 = 15 square feet.',
        'Notice the units: perimeter is in FEET, area is in SQUARE FEET.',
      ],
      answer: 'perimeter 16 ft, area 15 sq ft',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A rectangular notebook is 8 inches long and 6 inches wide. What is its area?',
      expectedAnswer: '48',
      responseFormat: 'numeric',
      hints: [
        'Area means how much space is inside.',
        'For a rectangle: length × width.',
        'Don\'t forget the units — square inches.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-units',
      kind: 'misconception_check',
      question: 'Jamal measures a rectangle and writes "Perimeter = 12 square feet." What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Treating area and perimeter units as interchangeable.',
          correctsTo: 'Perimeter is a length — it\'s measured in regular feet, not square feet. Square feet are for area (the inside). Jamal\'s number might be right but the units are wrong.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Perimeter = distance around. Add all the sides.',
        'Area = space inside. For rectangles: length × width.',
        'Perimeter uses regular units; area uses square units.',
        'Same rectangle, two different measurements that answer different questions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two rectangles both have perimeter 12. One is 5 × 1, the other is 3 × 3. Which has the bigger area?',
      hint: 'Area: 5×1 = 5. 3×3 = 9. The closer to a square, the bigger the area for the same perimeter.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
