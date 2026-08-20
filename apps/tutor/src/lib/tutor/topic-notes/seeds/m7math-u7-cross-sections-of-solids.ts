/**
 * Grade 7 Math — Unit 7 CED 7.4: Cross Sections of Solids.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.cross-sections-of-solids.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U7_CROSS_SECTIONS_OF_SOLIDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.cross-sections-of-solids.v1',
  course: 'Grade 7 Math',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Cross Sections of Solids',
  planId: 'evelyn.ms.m7math.cross-sections-of-solids.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.cross-sections-of-solids.v1' }],
  theory: [
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'A cross section is the face the cut leaves', content: `A CROSS SECTION IS THE FACE THE CUT LEAVES — slice straight through a solid and pull the two pieces apart. The flat shape staring back at you from the cut is the cross section. It is a two-dimensional shape, not a chunk. You are naming the face, not the piece of cheese.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'The two cuts we care about', content: `THE TWO CUTS WE CARE ABOUT — a cut PARALLEL to the base runs the same direction as the bottom, like a slice taken off the top of a cake. A cut PERPENDICULAR to the base runs straight up and down, like cutting a cake from the top down to the plate. Say which of the two you are doing before you try to picture the shape.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'Prism, cut parallel to the base', content: `PRISM, CUT PARALLEL TO THE BASE — a right rectangular prism, like a block of cheese, has the same rectangle all the way up. Slice it parallel to the base at any height and you get a rectangle exactly the same size and shape as the base. Every time, top to bottom, no shrinking.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'Prism, cut perpendicular to the base', content: `PRISM, CUT PERPENDICULAR TO THE BASE — cut straight down through a block of cheese and you still get a rectangle, but a different one. Its sides are the HEIGHT of the block and whichever base edge the knife crossed. So a prism gives rectangles both ways; only the dimensions change.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'Pyramid, cut parallel to the base', content: `PYRAMID, CUT PARALLEL TO THE BASE — a right rectangular pyramid, like a tent that narrows to a point, is skinnier the higher you go. Slice it parallel to the base and you get a rectangle SMALLER than the base but the same shape — a scale drawing of the base, using everything you learned last lesson. Slice halfway up and every side is half as long. Slice right at the tip and the rectangle shrinks to a single point.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'framework', title: 'Pyramid, cut perpendicular through the top point', content: `PYRAMID, CUT PERPENDICULAR THROUGH THE TOP POINT — stand the tent up and cut straight down through the peak to the ground. The face you expose is a TRIANGLE: the ground is its bottom edge and the peak is its top corner. This is the only case in the lesson that gives a triangle, and it needs a vertical cut through the point.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'definition', title: 'cross section', content: 'the flat two-dimensional shape exposed when a solid is sliced straight through.' },
    { loId: 'm7math.cross-sections-of-solids', kind: 'definition', title: 'right rectangular prism', content: `a box shape with rectangular faces, the same rectangle all the way from bottom to top.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'definition', title: 'right rectangular pyramid', content: `a solid with a rectangular base whose four triangular sides meet at a single point above the center of that base.` },
    { loId: 'm7math.cross-sections-of-solids', kind: 'definition', title: 'apex', content: 'the single point at the top of a pyramid where all the triangular faces meet.' },
  ],
  methods: [
    {
      title: 'Worked slicing a prism',
      steps: [
        `Set the picture. The base is the 10 cm by 6 cm rectangle resting on the plate. The 4 cm is how tall the block stands.`,
        `(a) A cut parallel to the base is a flat horizontal slice, like taking the top off. A prism is the same rectangle all the way up, so the cut face is a rectangle 10 cm by 6 cm — an exact copy of the base.`,
        `(b) Now cut straight down, with the knife crossing the 6 cm width. The knife travels 6 cm across and 4 cm down. So the face is a rectangle 6 cm by 4 cm.`,
        `(c) Cut straight down the other direction, with the knife crossing the 10 cm length. It travels 10 cm across and 4 cm down, giving a rectangle 10 cm by 4 cm.`,
        `Look at the pattern. All three cuts gave rectangles. A prism does not narrow anywhere, so straight cuts through it always come out rectangular. What changes is which two measurements show up as the sides.`,
      ],
      example: { problem: `A block of cheese is a right rectangular prism. It sits 10 cm long, 6 cm wide, and 4 cm tall. Describe the cross section for (a) a cut parallel to the base, (b) a straight-down cut across the width, and (c) a straight-down cut along the length.`, solution: `(a) a 10 cm by 6 cm rectangle, (b) a 6 cm by 4 cm rectangle, (c) a 10 cm by 4 cm rectangle` },
      relatedLoIds: ['m7math.cross-sections-of-solids'],
    },
    {
      title: 'Worked slicing a pyramid',
      steps: [
        `(a) Picture a flat sheet of cardboard slid through the tent, level with the ground, halfway between the ground and the peak. All four canvas walls slope inward, so the sheet meets all four of them and the cut closes into a rectangle.`,
        `The tent narrows as it rises, so this rectangle is SMALLER than the base. Halfway up means every length is half, which is a scale drawing of the base with a scale factor of one half.`,
        `Compute the sides: 8 ÷ 2 = 4 ft and 6 ÷ 2 = 3 ft. The cross section is a 4 ft by 3 ft rectangle.`,
        `Sense-check it. Slide the sheet higher and the rectangle keeps shrinking; slide it right up to the peak and it shrinks to a point. Slide it all the way down to the ground and it grows back to the full 8 ft by 6 ft base. That behavior matches.`,
        `(b) Now cut straight down from the peak to the ground, splitting the tent in half. The bottom edge of the exposed face lies on the ground, and the two upper edges run up the sloping walls and meet at the peak. Three edges meeting at three corners is a TRIANGLE.`,
        `WRONG answer to avoid for (b): a rectangle, copied over from the prism rule. RIGHT answer: a triangle, because the pyramid closes to a single point at the top and a rectangle has no single point.`,
      ],
      example: { problem: `A camping tent is shaped like a right rectangular pyramid. Its base on the ground is 8 ft by 6 ft, and the peak sits directly above the center of that base. Describe the cross section for (a) a cut parallel to the ground exactly halfway up, and (b) a straight-down cut through the peak.`, solution: '(a) a 4 ft by 3 ft rectangle, (b) a triangle' },
      relatedLoIds: ['m7math.cross-sections-of-solids'],
    },
  ],
  pointers: [
    { content: `Students often say "A triangle" — A cut parallel to the base crosses all four triangular walls at the same time, and those four crossings join up into a closed rectangle. So the cross section is a RECTANGLE, smaller than the base but the same shape as it. You do get a triangle from a pyramid, but only from a cut that goes straight DOWN through the apex. Parallel cut gives a rectangle; vertical cut through the apex gives a triangle.`, kind: 'common-error' },
    { content: `Students often say "A rectangle exactly the same size as the base" — A prism has straight vertical walls, so every parallel slice matches the base. A pyramid leans inward and closes to a point, so every parallel slice above the base is SMALLER than the base. Halfway up, each side is half as long. The only slice that matches the base is the base itself.`, kind: 'common-error' },
    { content: `A cross section is the flat two-dimensional face a straight cut exposes, not the piece that falls off.`, kind: 'tip' },
    { content: `Prism cut parallel to the base: a rectangle exactly matching the base, at any height.`, kind: 'tip' },
    { content: `Prism cut perpendicular to the base: still a rectangle, with the height of the prism as one of its sides.`, kind: 'tip' },
    { content: `Pyramid cut parallel to the base: a rectangle SMALLER than the base and the same shape, shrinking to a point at the apex.`, kind: 'tip' },
    { content: `Pyramid cut straight down through the apex: a triangle. That is the only cut in this lesson that gives one.`, kind: 'tip' },
    { content: `Name the flat cut face, not the leftover chunk. "Half the block" is a solid; the cross section is the 2-D shape you see when you pull the two pieces apart. Answers should be shapes like *rectangle* or *triangle* — never "a smaller prism."`, kind: 'common-error' },
    { content: `A pyramid's faces are triangles, but a parallel cut does NOT give a triangle. It crosses all four slanted walls at once and closes into a rectangle. Triangle only comes from a vertical cut through the apex.`, kind: 'gotcha' },
    { content: `Don't carry the prism rule over to the pyramid. Prism: every parallel slice equals the base. Pyramid: every parallel slice above the base is SMALLER than the base. The only pyramid slice that matches the base is the base itself.`, kind: 'common-error' },
    { content: `Say "parallel" or "perpendicular" out loud before picturing anything. Parallel = flat, level with the bottom (slice off the top). Perpendicular = straight up and down (top to plate). Mixing these two words flips your answer.`, kind: 'vocab-note' },
    { content: `On a perpendicular cut through a prism, one side of your rectangle is always the prism's HEIGHT. The other is whichever base edge the knife crossed. Don't list the two base edges — the height has to show up.`, kind: 'common-error' },
    { content: `Halfway up a pyramid means each side is half — halve BOTH lengths, not just one. For a 12 by 8 base: 6 by 4, area 24 cm². The area is not half of the base's area.`, kind: 'gotcha' },
    { content: `Edge case: slice a pyramid right at the apex and the rectangle shrinks to a single POINT — no length, no width. Slice exactly at the base and you get the full base back.`, kind: 'edge-case' },
    { content: `Check your answer by sliding the cut higher in your head. Prism: shape stays the same. Pyramid: it should keep shrinking. If your pyramid slice got bigger going up, you flipped something.`, kind: 'tip' },
  ],
};
