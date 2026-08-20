/**
 * Grade 7 Math — Unit 8 CED 8.3: Surface Area of Prisms & Pyramids.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.surface-area-of-prisms-and-pyramids.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U8_SURFACE_AREA_OF_PRISMS_AND_PYRAMIDS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.surface-area-of-prisms-and-pyramids.v1',
  course: 'Grade 7 Math',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Surface Area of Prisms & Pyramids',
  planId: 'evelyn.ms.m7math.surface-area-of-prisms-and-pyramids.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.surface-area-of-prisms-and-pyramids.v1' }],
  theory: [
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'A net is the solid flattened out', content: `A NET IS THE SOLID FLATTENED OUT — cut a solid along its edges and unfold it, and you get a flat picture of every face at once. Surface area is just the total area of that flat picture. So surface area is a 2-D measurement and it ALWAYS ends in square units: cm², m², in². If your surface area answer has cubic units on it, something has gone wrong.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'Add every face, miss nothing', content: `ADD EVERY FACE, MISS NOTHING — the method never changes: list the faces, find the area of each one, add them up. The only way to get this wrong is to lose a face, so count the faces on the net before you start adding, and check your list has that many entries.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'A rectangular prism has three matching pairs', content: `A RECTANGULAR PRISM HAS THREE MATCHING PAIRS — six faces, but the front matches the back, the left matches the right, and the top matches the bottom. Find the three different rectangles, add them, and double the total: SA = 2(lw + lh + wh). A cube is the easy version, six identical squares, so SA = 6s².` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'A pyramid is one base plus triangles', content: `A PYRAMID IS ONE BASE PLUS TRIANGLES — a square pyramid has a square base on the bottom and four triangular faces leaning in to meet at the point on top. Its net looks like a square with four triangles folded out from its sides. So the surface area is the base area plus the four triangles.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'The triangles use the slant height', content: `THE TRIANGLES USE THE SLANT HEIGHT — the slant height is the distance measured UP THE OUTSIDE of a triangular face, from the middle of a base edge to the point at the top. The vertical height goes straight up the inside of the pyramid instead, and it is shorter. A triangular face is a real flat triangle, so its area is ½ × base edge × SLANT height. Using the vertical height by mistake makes the surface area too small.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'framework', title: 'Label every line with its units', content: `LABEL EVERY LINE WITH ITS UNITS — write each face as its own little sum with units attached, such as 8 cm × 5 cm = 40 cm², then total them. It slows you down by about ten seconds and it catches almost every mistake in this lesson.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'definition', title: 'net', content: `the flat picture you get by unfolding a solid along its edges, showing every face at once.` },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'definition', title: 'face', content: 'one flat surface of a solid; a rectangular prism has six of them.' },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'definition', title: 'surface area', content: 'the total area of all the faces of a solid, measured in square units.' },
    { loId: 'm7math.surface-area-of-prisms-and-pyramids', kind: 'definition', title: 'slant height', content: `the distance up the outside of a pyramid face, from the middle of a base edge to the top point.` },
  ],
  methods: [
    {
      title: 'Worked rectangular prism net',
      steps: [
        `Unfold it in your head. Six rectangles, in three matching pairs, so you only have to compute three different areas.`,
        `Top and bottom: each is 8 cm × 5 cm = 40 cm². There are two of them, so that pair gives 80 cm².`,
        'Front and back: each is 8 cm × 3 cm = 24 cm². Two of them give 48 cm².',
        'Left and right ends: each is 5 cm × 3 cm = 15 cm². Two of them give 30 cm².',
        `Add the three pairs: 80 + 48 + 30 = 158 cm². Six faces were counted, which matches the box, so nothing got lost.`,
        `The formula does the same thing faster: SA = 2(lw + lh + wh) = 2(40 + 24 + 15) = 2 × 79 = 158 cm². Same answer, and the units are square centimeters because cardboard is flat.`,
      ],
      example: { problem: `A pencil box is a rectangular prism 8 cm long, 5 cm wide and 3 cm tall. How much cardboard covers it?`, solution: '158 cm²' },
      relatedLoIds: ['m7math.surface-area-of-prisms-and-pyramids'],
    },
    {
      title: 'Worked pyramid slant height',
      steps: [
        `Two heights are printed here and only one of them belongs in a surface area problem. Decide first, before any arithmetic.`,
        `Surface area is about the OUTSIDE faces, and the slant height is the one measured along the outside face. So the triangles use 5 m. The 4 m vertical height is for volume, not for this. Cross it out.`,
        `The net is one square plus four triangles. Start with the square base: 6 m × 6 m = 36 m².`,
        `Now one triangular face. Its base is a 6 m edge of the square and its height is the 5 m slant height, so its area is ½ × 6 × 5 = 15 m².`,
        `A square base has four edges, so there are four identical triangles: 4 × 15 = 60 m².`,
        `Add the base and the triangles: 36 + 60 = 96 m². WRONG answer to avoid: using the 4 m vertical height gives ½ × 6 × 4 = 12, then 36 + 48 = 84 m², which is too small. RIGHT answer: 96 m².`,
      ],
      example: { problem: `A square pyramid has a base 6 m on each side. Its slant height is 5 m and its vertical height is 4 m. Find the surface area.`, solution: '96 m²' },
      relatedLoIds: ['m7math.surface-area-of-prisms-and-pyramids'],
    },
  ],
  pointers: [
    { content: `Students often say "112 ft²" — A triangular face is a flat triangle sitting on the OUTSIDE of the pyramid, so its height must be measured along that outside face. That is the slant height, 5 ft. Each triangle is ½ × 8 × 5 = 20 ft², and four of them give 80 ft². With the 64 ft² base, SA = 64 + 80 = 144 ft². The vertical height of 3 ft is shorter, so using it always makes the surface area come out too small. Vertical height is for volume; slant height is for surface area.`, kind: 'common-error' },
    { content: `Students often say "80 ft²" — Unfold the net and count: one square plus four triangles is five faces. The four triangles give 80 ft², and the base gives 8 × 8 = 64 ft², so SA = 80 + 64 = 144 ft². Count the faces on the net before you add, then check that your list has that many lines in it.`, kind: 'common-error' },
    { content: `Surface area is the total area of the net, so it always ends in square units such as cm² or ft².`, kind: 'tip' },
    { content: `The method never changes: list every face, find each area, add them all, lose none.`, kind: 'tip' },
    { content: `A rectangular prism has three matching pairs: SA = 2(lw + lh + wh). A cube is 6s².`, kind: 'tip' },
    { content: `A pyramid is one base plus its triangular faces, and each triangle is ½ × base edge × slant height.`, kind: 'tip' },
    { content: `Slant height is measured up the outside face and is used for surface area; the vertical height is for volume.`, kind: 'tip' },
    { content: `Surface area answers end in **square** units (cm², ft²), never cubic. If you wrote cm³, you either multiplied three lengths together or slipped into a volume problem.`, kind: 'common-error' },
    { content: `When a pyramid problem gives you TWO heights, cross out the vertical one before you compute anything. Triangular faces use the **slant height** because they sit on the outside.`, kind: 'gotcha' },
    { content: `Don't forget the base of a pyramid. Count the net: a square pyramid has 5 faces — one square plus four triangles. Four triangles alone is an incomplete answer.`, kind: 'common-error' },
    { content: `"Height" is not one word here. **Slant height** = up the outside face, used for surface area. **Vertical height** = straight up the inside, used for volume. The slant height is always the longer one.`, kind: 'vocab-note' },
    { content: `In SA = 2(lw + lh + wh), the 2 multiplies the WHOLE bracket, not just the first term. Add all three products first, then double: 2(40 + 24 + 15) = 2 × 79 = 158.`, kind: 'common-error' },
    { content: `Write every face on its own line with units: 8 cm × 5 cm = 40 cm². Then count your lines — 6 for a prism, 5 for a square pyramid. A missing line means a missing face.`, kind: 'tip' },
    { content: `A cube is just the easy prism: all six faces are s × s, so SA = 6s². Square the edge first, then multiply by 6 — 6 × 7² = 294, not (6 × 7)².`, kind: 'edge-case' },
    { content: `The triangle's base is the **base edge** of the pyramid, not the slant height. Each face is ½ × base edge × slant height — don't swap the two numbers or use two slant heights.`, kind: 'gotcha' },
  ],
};
