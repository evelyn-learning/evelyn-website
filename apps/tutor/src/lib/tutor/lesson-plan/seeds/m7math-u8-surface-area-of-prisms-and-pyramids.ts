/**
 * Grade 7 Math — Measurement: Surface Area of Prisms & Pyramids.
 *
 * Unfolding a solid into its net turns a 3-D problem into a pile of 2-D
 * problems the student already owns (CCSS 7.G.B.6). Two things carry the
 * lesson: a rectangular prism has three MATCHING PAIRS of faces, and a
 * pyramid's triangles use the SLANT height, never the vertical height.
 * Surface area is a 2-D quantity, so every answer here ends in square units.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U8_SURFACE_AREA_OF_PRISMS_AND_PYRAMIDS: LessonPlan = {
  id: 'evelyn.ms.m7math.surface-area-of-prisms-and-pyramids.v1',
  title: 'Surface Area of Prisms & Pyramids',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.surface-area-of-prisms-and-pyramids',
      standard: 'M7MATH-8.3',
      description:
        'Find the surface area of a rectangular prism, a cube and a pyramid by unfolding the solid into a net and adding the area of every face, using the slant height for a pyramid triangular face (CCSS 7.G.B.6).',
    },
  ],
  prerequisites: ['m7math.circumference-and-area-of-circles'],
  followUps: ['m7math.volume-of-prisms-and-composite-solids'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame surface area as wrapping paper, which is something the student has actually run out of.',
      script:
        'You are wrapping a present the night before a birthday and you have one sheet of paper left. Will it cover the box? That question is not about how much fits INSIDE the box. It is about the outside, the skin of it. Cut the box along its edges and flatten it out, and it turns into six flat rectangles lying on the table. Six flat rectangles are easy — you already know how to find the area of a rectangle. That flattened picture is called a net, and adding up its pieces is the whole trick to surface area.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nets-and-faces',
      kind: 'concept',
      goal: 'Define the net, drill the three matching pairs of a prism, and separate slant height from vertical height.',
      keyIdeas: [
        'A NET IS THE SOLID FLATTENED OUT — cut a solid along its edges and unfold it, and you get a flat picture of every face at once. Surface area is just the total area of that flat picture. So surface area is a 2-D measurement and it ALWAYS ends in square units: cm², m², in². If your surface area answer has cubic units on it, something has gone wrong.',
        'ADD EVERY FACE, MISS NOTHING — the method never changes: list the faces, find the area of each one, add them up. The only way to get this wrong is to lose a face, so count the faces on the net before you start adding, and check your list has that many entries.',
        'A RECTANGULAR PRISM HAS THREE MATCHING PAIRS — six faces, but the front matches the back, the left matches the right, and the top matches the bottom. Find the three different rectangles, add them, and double the total: SA = 2(lw + lh + wh). A cube is the easy version, six identical squares, so SA = 6s².',
        'A PYRAMID IS ONE BASE PLUS TRIANGLES — a square pyramid has a square base on the bottom and four triangular faces leaning in to meet at the point on top. Its net looks like a square with four triangles folded out from its sides. So the surface area is the base area plus the four triangles.',
        'THE TRIANGLES USE THE SLANT HEIGHT — the slant height is the distance measured UP THE OUTSIDE of a triangular face, from the middle of a base edge to the point at the top. The vertical height goes straight up the inside of the pyramid instead, and it is shorter. A triangular face is a real flat triangle, so its area is ½ × base edge × SLANT height. Using the vertical height by mistake makes the surface area too small.',
        'LABEL EVERY LINE WITH ITS UNITS — write each face as its own little sum with units attached, such as 8 cm × 5 cm = 40 cm², then total them. It slows you down by about ten seconds and it catches almost every mistake in this lesson.',
      ],
      vocabulary: [
        { term: 'net', definition: 'the flat picture you get by unfolding a solid along its edges, showing every face at once.' },
        { term: 'face', definition: 'one flat surface of a solid; a rectangular prism has six of them.' },
        { term: 'surface area', definition: 'the total area of all the faces of a solid, measured in square units.' },
        { term: 'slant height', definition: 'the distance up the outside of a pyramid face, from the middle of a base edge to the top point.' },
      ],
      suggestedTools: ['show_diagram', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rectangular-prism-net',
      kind: 'worked_example',
      problem: 'A pencil box is a rectangular prism 8 cm long, 5 cm wide and 3 cm tall. How much cardboard covers it?',
      steps: [
        'Unfold it in your head. Six rectangles, in three matching pairs, so you only have to compute three different areas.',
        'Top and bottom: each is 8 cm × 5 cm = 40 cm². There are two of them, so that pair gives 80 cm².',
        'Front and back: each is 8 cm × 3 cm = 24 cm². Two of them give 48 cm².',
        'Left and right ends: each is 5 cm × 3 cm = 15 cm². Two of them give 30 cm².',
        'Add the three pairs: 80 + 48 + 30 = 158 cm². Six faces were counted, which matches the box, so nothing got lost.',
        'The formula does the same thing faster: SA = 2(lw + lh + wh) = 2(40 + 24 + 15) = 2 × 79 = 158 cm². Same answer, and the units are square centimeters because cardboard is flat.',
      ],
      answer: '158 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pyramid-slant-height',
      kind: 'worked_example',
      problem: 'A square pyramid has a base 6 m on each side. Its slant height is 5 m and its vertical height is 4 m. Find the surface area.',
      steps: [
        'Two heights are printed here and only one of them belongs in a surface area problem. Decide first, before any arithmetic.',
        'Surface area is about the OUTSIDE faces, and the slant height is the one measured along the outside face. So the triangles use 5 m. The 4 m vertical height is for volume, not for this. Cross it out.',
        'The net is one square plus four triangles. Start with the square base: 6 m × 6 m = 36 m².',
        'Now one triangular face. Its base is a 6 m edge of the square and its height is the 5 m slant height, so its area is ½ × 6 × 5 = 15 m².',
        'A square base has four edges, so there are four identical triangles: 4 × 15 = 60 m².',
        'Add the base and the triangles: 36 + 60 = 96 m². WRONG answer to avoid: using the 4 m vertical height gives ½ × 6 × 4 = 12, then 36 + 48 = 84 m², which is too small. RIGHT answer: 96 m².',
      ],
      answer: '96 m²',
      estimatedMinutes: 3,
    },
    {
      id: 'try-prism-surface-area',
      kind: 'try_yourself',
      problem: 'A rectangular box measures 6 in by 2 in by 9 in. What is its surface area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '168 in²', correct: true },
        { id: 'b', text: '84 in²' },
        { id: 'c', text: '144 in²' },
        { id: 'd', text: '108 in³' },
      ],
      expectedAnswer: '168 in²',
      hints: [
        'Find the three different rectangles first: 6 × 2, 6 × 9, and 2 × 9.',
        'Every one of those three has a twin on the opposite side of the box, so the box has six faces in total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pyramid-surface-area',
      kind: 'try_yourself',
      problem: 'A square pyramid has a base 10 cm on each side, a vertical height of 12 cm and a slant height of 13 cm. What is its surface area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '340 cm²' },
        { id: 'b', text: '360 cm²', correct: true },
        { id: 'c', text: '260 cm²' },
        { id: 'd', text: '230 cm²' },
      ],
      expectedAnswer: '360 cm²',
      hints: [
        'Two heights are given and only one goes on the outside faces. Surface area uses the slant height.',
        'Add the square base to FOUR triangles, each of them ½ × 10 × 13.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-cube',
      kind: 'try_yourself',
      problem: 'A number cube has edges 7 cm long. What is its surface area in square centimeters? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '294',
      hints: [
        'Every face of a cube is the same square: 7 cm by 7 cm.',
        'A cube has six faces, so find one face and multiply by 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vertical-height-on-faces',
      kind: 'misconception_check',
      question: 'A square pyramid has a base 8 ft on each side, a vertical height of 3 ft and a slant height of 5 ft. A student writes 64 + 4 × (½ × 8 × 3) = 112 ft². What went wrong?',
      commonErrors: [
        {
          answer: '112 ft²',
          misconception: 'Using the vertical height inside the pyramid as the height of the triangular faces, because it is the number that gets called "the height".',
          correctsTo: 'A triangular face is a flat triangle sitting on the OUTSIDE of the pyramid, so its height must be measured along that outside face. That is the slant height, 5 ft. Each triangle is ½ × 8 × 5 = 20 ft², and four of them give 80 ft². With the 64 ft² base, SA = 64 + 80 = 144 ft². The vertical height of 3 ft is shorter, so using it always makes the surface area come out too small. Vertical height is for volume; slant height is for surface area.',
        },
        {
          answer: '80 ft²',
          misconception: 'Adding up the four triangles and stopping, forgetting that the base is a face too.',
          correctsTo: 'Unfold the net and count: one square plus four triangles is five faces. The four triangles give 80 ft², and the base gives 8 × 8 = 64 ft², so SA = 80 + 64 = 144 ft². Count the faces on the net before you add, then check that your list has that many lines in it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Surface area is the total area of the net, so it always ends in square units such as cm² or ft².',
        'The method never changes: list every face, find each area, add them all, lose none.',
        'A rectangular prism has three matching pairs: SA = 2(lw + lh + wh). A cube is 6s².',
        'A pyramid is one base plus its triangular faces, and each triangle is ½ × base edge × slant height.',
        'Slant height is measured up the outside face and is used for surface area; the vertical height is for volume.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Surface Area of Prisms & Pyramids' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
