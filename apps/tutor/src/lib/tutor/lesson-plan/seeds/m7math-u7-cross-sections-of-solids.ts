/**
 * Grade 7 Math — Geometry: Cross Sections of Solids.
 *
 * Two dimensions meets three (CCSS 7.G.A.3). Slice a right rectangular prism
 * and a right rectangular pyramid, parallel to the base and perpendicular to
 * it, and name the flat shape the cut leaves behind. Everything stays
 * concrete — a block of cheese, a tent — because the whole difficulty here is
 * picturing the cut, not computing anything.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U7_CROSS_SECTIONS_OF_SOLIDS: LessonPlan = {
  id: 'evelyn.ms.m7math.cross-sections-of-solids.v1',
  title: 'Cross Sections of Solids',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.cross-sections-of-solids',
      standard: 'M7MATH-7.4',
      description:
        'Describe the two-dimensional figure that results from slicing a right rectangular prism or a right rectangular pyramid with a plane parallel or perpendicular to the base (CCSS 7.G.A.3).',
    },
  ],
  prerequisites: ['m7math.scale-drawings'],
  followUps: ['m7math.area-of-polygons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student picturing the flat face a knife leaves behind, using food they have watched somebody cut.',
      script:
        'Watch somebody cut a loaf of bread. Every slice comes off the end and every slice has the same flat face, over and over. Now imagine cutting that same loaf the long way, from the top down to the cutting board. The face you get is a completely different rectangle — long and short instead of tall and square. Same loaf, same knife, different cut, different shape. Today you learn to look at a solid, imagine the knife going through it, and name the flat shape the cut leaves behind before anybody actually cuts anything.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cross-sections',
      kind: 'concept',
      goal: 'Define a cross section and pin down all four cases: prism and pyramid, cut parallel and cut perpendicular.',
      keyIdeas: [
        'A CROSS SECTION IS THE FACE THE CUT LEAVES — slice straight through a solid and pull the two pieces apart. The flat shape staring back at you from the cut is the cross section. It is a two-dimensional shape, not a chunk. You are naming the face, not the piece of cheese.',
        'THE TWO CUTS WE CARE ABOUT — a cut PARALLEL to the base runs the same direction as the bottom, like a slice taken off the top of a cake. A cut PERPENDICULAR to the base runs straight up and down, like cutting a cake from the top down to the plate. Say which of the two you are doing before you try to picture the shape.',
        'PRISM, CUT PARALLEL TO THE BASE — a right rectangular prism, like a block of cheese, has the same rectangle all the way up. Slice it parallel to the base at any height and you get a rectangle exactly the same size and shape as the base. Every time, top to bottom, no shrinking.',
        'PRISM, CUT PERPENDICULAR TO THE BASE — cut straight down through a block of cheese and you still get a rectangle, but a different one. Its sides are the HEIGHT of the block and whichever base edge the knife crossed. So a prism gives rectangles both ways; only the dimensions change.',
        'PYRAMID, CUT PARALLEL TO THE BASE — a right rectangular pyramid, like a tent that narrows to a point, is skinnier the higher you go. Slice it parallel to the base and you get a rectangle SMALLER than the base but the same shape — a scale drawing of the base, using everything you learned last lesson. Slice halfway up and every side is half as long. Slice right at the tip and the rectangle shrinks to a single point.',
        'PYRAMID, CUT PERPENDICULAR THROUGH THE TOP POINT — stand the tent up and cut straight down through the peak to the ground. The face you expose is a TRIANGLE: the ground is its bottom edge and the peak is its top corner. This is the only case in the lesson that gives a triangle, and it needs a vertical cut through the point.',
      ],
      vocabulary: [
        { term: 'cross section', definition: 'the flat two-dimensional shape exposed when a solid is sliced straight through.' },
        { term: 'right rectangular prism', definition: 'a box shape with rectangular faces, the same rectangle all the way from bottom to top.' },
        { term: 'right rectangular pyramid', definition: 'a solid with a rectangular base whose four triangular sides meet at a single point above the center of that base.' },
        { term: 'apex', definition: 'the single point at the top of a pyramid where all the triangular faces meet.' },
      ],
      suggestedTools: ['show_geometry_constructed'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-slicing-a-prism',
      kind: 'worked_example',
      problem: 'A block of cheese is a right rectangular prism. It sits 10 cm long, 6 cm wide, and 4 cm tall. Describe the cross section for (a) a cut parallel to the base, (b) a straight-down cut across the width, and (c) a straight-down cut along the length.',
      steps: [
        'Set the picture. The base is the 10 cm by 6 cm rectangle resting on the plate. The 4 cm is how tall the block stands.',
        '(a) A cut parallel to the base is a flat horizontal slice, like taking the top off. A prism is the same rectangle all the way up, so the cut face is a rectangle 10 cm by 6 cm — an exact copy of the base.',
        '(b) Now cut straight down, with the knife crossing the 6 cm width. The knife travels 6 cm across and 4 cm down. So the face is a rectangle 6 cm by 4 cm.',
        '(c) Cut straight down the other direction, with the knife crossing the 10 cm length. It travels 10 cm across and 4 cm down, giving a rectangle 10 cm by 4 cm.',
        'Look at the pattern. All three cuts gave rectangles. A prism does not narrow anywhere, so straight cuts through it always come out rectangular. What changes is which two measurements show up as the sides.',
      ],
      answer: '(a) a 10 cm by 6 cm rectangle, (b) a 6 cm by 4 cm rectangle, (c) a 10 cm by 4 cm rectangle',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-slicing-a-pyramid',
      kind: 'worked_example',
      problem: 'A camping tent is shaped like a right rectangular pyramid. Its base on the ground is 8 ft by 6 ft, and the peak sits directly above the center of that base. Describe the cross section for (a) a cut parallel to the ground exactly halfway up, and (b) a straight-down cut through the peak.',
      steps: [
        '(a) Picture a flat sheet of cardboard slid through the tent, level with the ground, halfway between the ground and the peak. All four canvas walls slope inward, so the sheet meets all four of them and the cut closes into a rectangle.',
        'The tent narrows as it rises, so this rectangle is SMALLER than the base. Halfway up means every length is half, which is a scale drawing of the base with a scale factor of one half.',
        'Compute the sides: 8 ÷ 2 = 4 ft and 6 ÷ 2 = 3 ft. The cross section is a 4 ft by 3 ft rectangle.',
        'Sense-check it. Slide the sheet higher and the rectangle keeps shrinking; slide it right up to the peak and it shrinks to a point. Slide it all the way down to the ground and it grows back to the full 8 ft by 6 ft base. That behavior matches.',
        '(b) Now cut straight down from the peak to the ground, splitting the tent in half. The bottom edge of the exposed face lies on the ground, and the two upper edges run up the sloping walls and meet at the peak. Three edges meeting at three corners is a TRIANGLE.',
        'WRONG answer to avoid for (b): a rectangle, copied over from the prism rule. RIGHT answer: a triangle, because the pyramid closes to a single point at the top and a rectangle has no single point.',
      ],
      answer: '(a) a 4 ft by 3 ft rectangle, (b) a triangle',
      estimatedMinutes: 3,
    },
    {
      id: 'try-prism-parallel-cut',
      kind: 'try_yourself',
      problem: 'A right rectangular prism is sliced by a cut parallel to its base. What is the cross section?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A rectangle smaller than the base' },
        { id: 'b', text: 'A rectangle the same size and shape as the base', correct: true },
        { id: 'c', text: 'A rectangle whose sides are one base edge and the height of the prism' },
        { id: 'd', text: 'A triangle' },
      ],
      expectedAnswer: 'A rectangle the same size and shape as the base',
      hints: [
        'Picture a block of cheese. Does it get narrower as it goes up, or does it stay the same all the way?',
        'A prism keeps the same rectangle from bottom to top, so a horizontal slice cannot come out any smaller.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pyramid-vertical-cut',
      kind: 'try_yourself',
      problem: 'A right rectangular pyramid is sliced by a cut that goes straight down through the apex, perpendicular to the base. What is the cross section?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A triangle', correct: true },
        { id: 'b', text: 'A rectangle the same size as the base' },
        { id: 'c', text: 'A rectangle smaller than the base' },
        { id: 'd', text: 'A square' },
      ],
      expectedAnswer: 'A triangle',
      hints: [
        'The cut passes through the apex, which is a single point. Follow the edges of the exposed face: the bottom sits on the base, and the two sides climb toward that point.',
        'A shape with a bottom edge and two sides meeting at one point above it has three corners.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pyramid-slice-area',
      kind: 'try_yourself',
      problem: 'A right rectangular pyramid has a base 12 cm by 8 cm. A cut is made parallel to the base, exactly halfway between the base and the apex. What is the area of that cross section, in square centimeters? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '24',
      hints: [
        'Halfway up a pyramid, the cross section is a rectangle with every side half as long as the matching side of the base.',
        'Halve each side first: 12 ÷ 2 = 6 and 8 ÷ 2 = 4. Then find the area of that rectangle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pyramid-parallel-cut',
      kind: 'misconception_check',
      question:
        'A student says that slicing a right rectangular pyramid parallel to its base gives a triangle, because "a pyramid is made out of triangles." What went wrong?',
      commonErrors: [
        {
          answer: 'A triangle',
          misconception: 'Naming the shape of the pyramid FACES instead of the shape of the cut. The triangles are the four slanted walls, and a horizontal cut does not follow any one of them.',
          correctsTo:
            'A cut parallel to the base crosses all four triangular walls at the same time, and those four crossings join up into a closed rectangle. So the cross section is a RECTANGLE, smaller than the base but the same shape as it. You do get a triangle from a pyramid, but only from a cut that goes straight DOWN through the apex. Parallel cut gives a rectangle; vertical cut through the apex gives a triangle.',
        },
        {
          answer: 'A rectangle exactly the same size as the base',
          misconception: 'Applying the prism rule to a pyramid. In a prism the rectangle never changes, so it feels like it should never change here either.',
          correctsTo:
            'A prism has straight vertical walls, so every parallel slice matches the base. A pyramid leans inward and closes to a point, so every parallel slice above the base is SMALLER than the base. Halfway up, each side is half as long. The only slice that matches the base is the base itself.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A cross section is the flat two-dimensional face a straight cut exposes, not the piece that falls off.',
        'Prism cut parallel to the base: a rectangle exactly matching the base, at any height.',
        'Prism cut perpendicular to the base: still a rectangle, with the height of the prism as one of its sides.',
        'Pyramid cut parallel to the base: a rectangle SMALLER than the base and the same shape, shrinking to a point at the apex.',
        'Pyramid cut straight down through the apex: a triangle. That is the only cut in this lesson that gives one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Cross Sections of Solids' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
