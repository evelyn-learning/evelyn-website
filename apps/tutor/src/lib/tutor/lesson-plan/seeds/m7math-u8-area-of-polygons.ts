/**
 * Grade 7 Math — Measurement: Area of Polygons.
 *
 * The 2-D half of the measurement unit (CCSS 7.G.B.6). Triangle, parallelogram
 * and trapezoid all reduce to base times height, and the single defect that
 * ruins all three is grabbing a slanted SIDE instead of the perpendicular
 * height. Irregular shapes get decomposed into pieces we already know. Every
 * answer here carries square units, because square units are what area IS.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U8_AREA_OF_POLYGONS: LessonPlan = {
  id: 'evelyn.ms.m7math.area-of-polygons.v1',
  title: 'Area of Polygons',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.area-of-polygons',
      standard: 'M7MATH-8.1',
      description:
        'Find the area of triangles, parallelograms and trapezoids using the perpendicular height, and find the area of an irregular polygon by decomposing it into familiar pieces (CCSS 7.G.B.6).',
    },
  ],
  prerequisites: ['m7math.cross-sections-of-solids'],
  followUps: ['m7math.circumference-and-area-of-circles'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make area feel like a shopping question the student actually has to answer.',
      script:
        'Your class is making a banner for the school dance. It is a big triangle of poster paper, and the paper costs money, so somebody has to say how much of it you need. Not how long the edges are — how much SURFACE the banner covers. That is area, and it gets measured in squares: square centimetres, square feet, square metres. Today we find the area of triangles, parallelograms and trapezoids, and then we handle a weird lopsided shape by chopping it into pieces we already know.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-area-formulas',
      kind: 'concept',
      goal: 'Build the three formulas from the rectangle, and name the perpendicular-height trap before it happens.',
      keyIdeas: [
        'AREA IS COVERED SQUARES — area counts how many unit squares fit inside a shape, so every area answer ends in square units: cm², m², ft². A rectangle 5 cm by 3 cm holds 5 rows of 3 squares, which is 15 cm². Length answers get plain units; area answers always get squared units. Write the units down every single time.',
        'A PARALLELOGRAM IS A RECTANGLE IN DISGUISE — slice the slanted triangle off one end and slide it around to the other end, and you have made a rectangle. Nothing was added and nothing was thrown away, so the area did not change. That gives A = bh, base times height, exactly like a rectangle.',
        'A TRIANGLE IS HALF A PARALLELOGRAM — take any triangle, make a copy, flip the copy upside down and push the two together. They lock into a parallelogram with the same base and the same height. So the triangle is half of it: A = ½bh. Forgetting that ½ doubles your answer.',
        'A TRAPEZOID AVERAGES ITS TWO BASES — a trapezoid has two parallel sides of different lengths, called the first base b₁ and the second base b₂. Its area is A = ½(b₁ + b₂)h. Read that as: add the two parallel sides, take half of the total to get their average, then multiply by the height.',
        'THE HEIGHT IS ALWAYS PERPENDICULAR — the height is the straight-up distance from the base to the opposite side, meeting the base at a square corner. It is NOT the slanted side, even when the slanted side is the number printed on the picture. A slanted side is longer than the height, so using it always makes the area too big. When a shape shows both, the height is the one with the little right-angle mark.',
        'IRREGULAR SHAPES GET CHOPPED UP — there is no formula for a lopsided shape, and you do not need one. Cut it with straight lines into rectangles and triangles, find each piece, and add the pieces. If it is a big rectangle with a bite taken out, find the big rectangle and subtract the bite. Either way the units stay square units.',
      ],
      vocabulary: [
        { term: 'area', definition: 'the amount of surface a flat shape covers, measured in square units such as cm².' },
        { term: 'base', definition: 'the side of a shape you measure the height from — any side can be the base, as long as the height matches it.' },
        { term: 'height', definition: 'the perpendicular distance from the base to the opposite side or corner; it meets the base at a square corner.' },
        { term: 'trapezoid', definition: 'a four-sided shape with exactly one pair of parallel sides, called the two bases.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-triangle-perpendicular-height',
      kind: 'worked_example',
      problem: 'A triangle has a base of 10 cm. The dashed height drawn straight down to that base is 6 cm. One slanted side is labelled 7 cm. Find the area.',
      steps: [
        'Three numbers are on the picture, and the formula only wants two of them. Pick carefully.',
        'The base is 10 cm. The height must be perpendicular to that base, and the dashed 6 cm segment is the one meeting the base at a square corner. So the height is 6 cm.',
        'The 7 cm is a slanted side. It is a real measurement of the triangle, but it is not a height, so it does not go in the formula at all. Cross it out.',
        'Apply A = ½bh: A = ½ × 10 × 6.',
        'Do it in order: 10 × 6 = 60, and half of 60 is 30.',
        'The answer is 30 cm². WRONG answer to avoid: ½ × 10 × 7 = 35 cm², which comes from using the slanted 7 cm side. RIGHT answer: 30 cm². Notice the wrong one is bigger, because a slanted side is always longer than the height.',
      ],
      answer: '30 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trapezoid-two-ways',
      kind: 'worked_example',
      problem: 'A garden bed is a trapezoid. The bottom base is 12 m, the top base is 8 m, and the height between them is 5 m. Find the area two different ways.',
      steps: [
        'Way one, the formula. Name the parts: b₁ = 12 m, b₂ = 8 m, h = 5 m. Then A = ½(b₁ + b₂)h.',
        'Add the bases: 12 + 8 = 20. Halve that: 20 ÷ 2 = 10, which is the average of the two bases. Multiply by the height: 10 × 5 = 50. So A = 50 m².',
        'Way two, chop it up. Drop a straight line from the end of the short base down to the long base. That splits the trapezoid into a rectangle and a triangle.',
        'The rectangle is 8 m wide and 5 m tall, so its area is 8 × 5 = 40 m².',
        'The triangle takes up whatever the rectangle did not: its base is 12 − 8 = 4 m and its height is the same 5 m. Its area is ½ × 4 × 5 = 10 m².',
        'Add the pieces: 40 + 10 = 50 m². Both ways give 50 m², so the answer is solid. Chopping a shape up is always allowed, and it is a free way to check a formula you are not sure about.',
      ],
      answer: '50 m²',
      estimatedMinutes: 3,
    },
    {
      id: 'try-parallelogram-slant-trap',
      kind: 'try_yourself',
      problem: 'A parallelogram has a base of 9 cm. Its perpendicular height is 4 cm, and its slanted side is 5 cm. What is the area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '45 cm²' },
        { id: 'b', text: '36 cm²', correct: true },
        { id: 'c', text: '18 cm²' },
        { id: 'd', text: '26 cm²' },
      ],
      expectedAnswer: '36 cm²',
      hints: [
        'Two of the three numbers belong in the formula and one does not. Which measurement meets the base at a square corner?',
        'A parallelogram uses A = bh with no halving. The 5 cm slanted side is not a height.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trapezoid',
      kind: 'try_yourself',
      problem: 'A trapezoid has parallel sides of 6 ft and 10 ft, and a height of 4 ft. What is its area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '64 ft²' },
        { id: 'b', text: '40 ft²' },
        { id: 'c', text: '32 ft²', correct: true },
        { id: 'd', text: '20 ft²' },
      ],
      expectedAnswer: '32 ft²',
      hints: [
        'Both parallel sides go into the formula: A = ½(b₁ + b₂)h. Neither one gets left behind.',
        'Add 6 and 10 first, then take half of that total, then multiply by the height of 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-decompose',
      kind: 'try_yourself',
      problem: 'A patio is shaped like the letter L. The whole shape fits inside a 10 m by 8 m rectangle, but a 4 m by 3 m rectangle is missing from one corner. What is the area of the patio in square metres? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '68',
      hints: [
        'Start with the full rectangle as if nothing were missing: 10 × 8.',
        'Now find the area of the missing corner, 4 × 3, and take it away from the full rectangle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slant-as-height',
      kind: 'misconception_check',
      question: 'A triangle has a base of 10 cm, a perpendicular height of 6 cm, and a slanted side of 7 cm. A student writes ½ × 10 × 7 = 35 cm². What went wrong?',
      commonErrors: [
        {
          answer: '35 cm²',
          misconception: 'Grabbing the slanted side because it is the number printed along the edge of the picture, and treating any measurement of the triangle as if it could be the height.',
          correctsTo: 'The height has to be perpendicular to the base, meaning it meets the base at a square corner. That is the 6 cm dashed segment, not the 7 cm slanted side. So A = ½ × 10 × 6 = 30 cm². A slanted side is always LONGER than the height, so this mistake always makes the area come out too big. Look for the little right-angle mark before you choose.',
        },
        {
          answer: '60 cm²',
          misconception: 'Using base times height and stopping there, as if the triangle were a parallelogram.',
          correctsTo: 'Base times height, 10 × 6 = 60 cm², is the area of the whole parallelogram that two copies of this triangle would build. One triangle is half of it, so you still have to halve: 60 ÷ 2 = 30 cm². If your triangle answer looks twice as big as it should, check whether the ½ went missing.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Area is measured in square units, so every answer ends in cm², m², ft² or the like.',
        'Parallelogram: A = bh. Triangle: A = ½bh, because a triangle is half a parallelogram.',
        'Trapezoid: A = ½(b₁ + b₂)h — add the two parallel sides, halve, then multiply by the height.',
        'The height is perpendicular to the base. A slanted side is never the height, and using it makes the area too big.',
        'For a lopsided shape, chop it into rectangles and triangles and add the pieces, or find the big rectangle and subtract the missing bite.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Area of Polygons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
