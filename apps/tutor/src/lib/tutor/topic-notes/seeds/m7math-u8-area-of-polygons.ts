/**
 * Grade 7 Math — Unit 8 CED 8.1: Area of Polygons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.area-of-polygons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U8_AREA_OF_POLYGONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.area-of-polygons.v1',
  course: 'Grade 7 Math',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Area of Polygons',
  planId: 'evelyn.ms.m7math.area-of-polygons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.area-of-polygons.v1' }],
  theory: [
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'Area is covered squares', content: `AREA IS COVERED SQUARES — area counts how many unit squares fit inside a shape, so every area answer ends in square units: cm², m², ft². A rectangle 5 cm by 3 cm holds 5 rows of 3 squares, which is 15 cm². Length answers get plain units; area answers always get squared units. Write the units down every single time.` },
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'A parallelogram is a rectangle in disguise', content: `A PARALLELOGRAM IS A RECTANGLE IN DISGUISE — slice the slanted triangle off one end and slide it around to the other end, and you have made a rectangle. Nothing was added and nothing was thrown away, so the area did not change. That gives A = bh, base times height, exactly like a rectangle.` },
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'A triangle is half a parallelogram', content: `A TRIANGLE IS HALF A PARALLELOGRAM — take any triangle, make a copy, flip the copy upside down and push the two together. They lock into a parallelogram with the same base and the same height. So the triangle is half of it: A = ½bh. Forgetting that ½ doubles your answer.` },
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'A trapezoid averages its two bases', content: `A TRAPEZOID AVERAGES ITS TWO BASES — a trapezoid has two parallel sides of different lengths, called the first base b₁ and the second base b₂. Its area is A = ½(b₁ + b₂)h. Read that as: add the two parallel sides, take half of the total to get their average, then multiply by the height.` },
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'The height is always perpendicular', content: `THE HEIGHT IS ALWAYS PERPENDICULAR — the height is the straight-up distance from the base to the opposite side, meeting the base at a square corner. It is NOT the slanted side, even when the slanted side is the number printed on the picture. A slanted side is longer than the height, so using it always makes the area too big. When a shape shows both, the height is the one with the little right-angle mark.` },
    { loId: 'm7math.area-of-polygons', kind: 'framework', title: 'Irregular shapes get chopped up', content: `IRREGULAR SHAPES GET CHOPPED UP — there is no formula for a lopsided shape, and you do not need one. Cut it with straight lines into rectangles and triangles, find each piece, and add the pieces. If it is a big rectangle with a bite taken out, find the big rectangle and subtract the bite. Either way the units stay square units.` },
    { loId: 'm7math.area-of-polygons', kind: 'definition', title: 'area', content: 'the amount of surface a flat shape covers, measured in square units such as cm².' },
    { loId: 'm7math.area-of-polygons', kind: 'definition', title: 'base', content: `the side of a shape you measure the height from — any side can be the base, as long as the height matches it.` },
    { loId: 'm7math.area-of-polygons', kind: 'definition', title: 'height', content: `the perpendicular distance from the base to the opposite side or corner; it meets the base at a square corner.` },
    { loId: 'm7math.area-of-polygons', kind: 'definition', title: 'trapezoid', content: `a four-sided shape with exactly one pair of parallel sides, called the two bases.` },
  ],
  methods: [
    {
      title: 'Worked triangle perpendicular height',
      steps: [
        `Three numbers are on the picture, and the formula only wants two of them. Pick carefully.`,
        `The base is 10 cm. The height must be perpendicular to that base, and the dashed 6 cm segment is the one meeting the base at a square corner. So the height is 6 cm.`,
        `The 7 cm is a slanted side. It is a real measurement of the triangle, but it is not a height, so it does not go in the formula at all. Cross it out.`,
        'Apply A = ½bh: A = ½ × 10 × 6.',
        'Do it in order: 10 × 6 = 60, and half of 60 is 30.',
        `The answer is 30 cm². WRONG answer to avoid: ½ × 10 × 7 = 35 cm², which comes from using the slanted 7 cm side. RIGHT answer: 30 cm². Notice the wrong one is bigger, because a slanted side is always longer than the height.`,
      ],
      example: { problem: `A triangle has a base of 10 cm. The dashed height drawn straight down to that base is 6 cm. One slanted side is labeled 7 cm. Find the area.`, solution: '30 cm²' },
      relatedLoIds: ['m7math.area-of-polygons'],
    },
    {
      title: 'Worked trapezoid two ways',
      steps: [
        `Way one, the formula. Name the parts: b₁ = 12 m, b₂ = 8 m, h = 5 m. Then A = ½(b₁ + b₂)h.`,
        `Add the bases: 12 + 8 = 20. Halve that: 20 ÷ 2 = 10, which is the average of the two bases. Multiply by the height: 10 × 5 = 50. So A = 50 m².`,
        `Way two, chop it up. Drop a straight line from the end of the short base down to the long base. That splits the trapezoid into a rectangle and a triangle.`,
        'The rectangle is 8 m wide and 5 m tall, so its area is 8 × 5 = 40 m².',
        `The triangle takes up whatever the rectangle did not: its base is 12 − 8 = 4 m and its height is the same 5 m. Its area is ½ × 4 × 5 = 10 m².`,
        `Add the pieces: 40 + 10 = 50 m². Both ways give 50 m², so the answer is solid. Chopping a shape up is always allowed, and it is a free way to check a formula you are not sure about.`,
      ],
      example: { problem: `A garden bed is a trapezoid. The bottom base is 12 m, the top base is 8 m, and the height between them is 5 m. Find the area two different ways.`, solution: '50 m²' },
      relatedLoIds: ['m7math.area-of-polygons'],
    },
  ],
  pointers: [
    { content: `Students often say "35 cm²" — The height has to be perpendicular to the base, meaning it meets the base at a square corner. That is the 6 cm dashed segment, not the 7 cm slanted side. So A = ½ × 10 × 6 = 30 cm². A slanted side is always LONGER than the height, so this mistake always makes the area come out too big. Look for the little right-angle mark before you choose.`, kind: 'common-error' },
    { content: `Students often say "60 cm²" — Base times height, 10 × 6 = 60 cm², is the area of the whole parallelogram that two copies of this triangle would build. One triangle is half of it, so you still have to halve: 60 ÷ 2 = 30 cm². If your triangle answer looks twice as big as it should, check whether the ½ went missing.`, kind: 'common-error' },
    { content: `Area is measured in square units, so every answer ends in cm², m², ft² or the like.`, kind: 'tip' },
    { content: `Parallelogram: A = bh. Triangle: A = ½bh, because a triangle is half a parallelogram.`, kind: 'tip' },
    { content: `Trapezoid: A = ½(b₁ + b₂)h — add the two parallel sides, halve, then multiply by the height.`, kind: 'tip' },
    { content: `The height is perpendicular to the base. A slanted side is never the height, and using it makes the area too big.`, kind: 'tip' },
    { content: `For a lopsided shape, chop it into rectangles and triangles and add the pieces, or find the big rectangle and subtract the missing bite.`, kind: 'tip' },
    { content: `Look for the little right-angle mark before you pick the height. If a number runs along a slanted edge, it is a side, not a height — cross it out. Using it always makes your area too big.`, kind: 'common-error' },
    { content: `Triangle answers need the ½. If your triangle area looks like it could be a whole parallelogram, you probably wrote bh instead of ½bh. Quick check: your answer should be smaller than base × height.`, kind: 'common-error' },
    { content: `Write square units every time: cm², m², ft². A plain '30' or '30 cm' for an area is wrong even if the number is right. Lengths get plain units; areas get squared units.`, kind: 'vocab-note' },
    { content: `In A = ½(b₁ + b₂)h, b₁ and b₂ are the two PARALLEL sides — not any two sides you see. h is the gap between those parallel sides, not a slanted leg.`, kind: 'vocab-note' },
    { content: `Any side can be the base — but the height must match the base you chose. Never pair a base with a height drawn to a different side.`, kind: 'gotcha' },
    { content: `For an L-shape, decide first: adding pieces or subtracting a bite. If you subtract, take the missing rectangle away from the WHOLE big rectangle — don't also count the missing piece as part of the shape.`, kind: 'common-error' },
    { content: `Watch the order in ½(b₁ + b₂)h: add the bases FIRST, then halve, then multiply by h. Halving only one base, like ½(12) + 8, gives a wrong answer.`, kind: 'gotcha' },
    { content: `Not sure a formula answer is right? Chop the shape a second way and add the pieces. If both routes give the same number, you're safe — that's exactly what the 12 m / 8 m / 5 m trapezoid did.`, kind: 'tip' },
  ],
};
