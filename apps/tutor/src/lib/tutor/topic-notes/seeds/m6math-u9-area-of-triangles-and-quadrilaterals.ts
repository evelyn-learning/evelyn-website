/**
 * Grade 6 Math — Unit 9 CED 9.1: Area of Triangles & Quadrilaterals.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.area-of-triangles-and-quadrilaterals.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U9_AREA_OF_TRIANGLES_AND_QUADRILATERALS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.area-of-triangles-and-quadrilaterals.v1',
  course: 'Grade 6 Math',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Area of Triangles & Quadrilaterals',
  planId: 'evelyn.ms.m6math.area-of-triangles-and-quadrilaterals.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.area-of-triangles-and-quadrilaterals.v1' }],
  theory: [
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'Area means covering with squares', content: `AREA MEANS COVERING WITH SQUARES — the area of a flat shape is the number of same-size square units it takes to cover the shape completely, with no gaps and no overlaps. For a rectangle, that count is length times width, which can also be written base times height.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'A diagonal decomposes a rectangle into two triangles', content: `A DIAGONAL DECOMPOSES A RECTANGLE INTO TWO TRIANGLES — draw one diagonal line across a rectangle, from one corner to the opposite corner. That single cut splits the rectangle into two matching triangles, and each triangle is exactly half of the rectangle. That gives the triangle rule: area of a triangle equals base times height, divided by two, where the height is measured straight across, perpendicular to the base, from the base to the corner directly opposite it.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'Composing a parallelogram into a rectangle', content: `COMPOSING A PARALLELOGRAM INTO A RECTANGLE — cut a right triangle off one end of a parallelogram, slicing straight down from a corner so the cut is perpendicular to the base, and slide that triangle to the other end. The two pieces fit together with no gaps and no overlaps and form a rectangle with the same base and the same height the parallelogram started with. Composing and decomposing never change the total area, so a parallelogram's area is also base times height.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'Height is always perpendicular to the base', content: `HEIGHT IS ALWAYS PERPENDICULAR TO THE BASE — the height of a triangle or a parallelogram is the straight up-and-down distance between the base and the point or side directly across from it. It is never the length of a slanted side. A slanted side is almost always a different number from the height, and multiplying by the slanted side instead of the height gives a wrong area.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'Decompose a hard shape into pieces you already know', content: `DECOMPOSE A HARD SHAPE INTO PIECES YOU ALREADY KNOW — a trapezoid or an odd composite figure can usually be split into a rectangle and one or two triangles, or found by starting with one big rectangle and subtracting a triangular piece that does not belong. Find the area of every piece on its own using the rules above, then add the pieces together, or subtract a removed piece from the whole.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'framework', title: 'Compose and decompose are the same idea in opposite directions', content: `COMPOSE AND DECOMPOSE ARE THE SAME IDEA IN OPPOSITE DIRECTIONS — decomposing means cutting one shape into smaller pieces that are easy to measure. Composing means rearranging pieces into one shape that is easy to measure. Either direction is allowed to change how the shape looks, but neither one ever changes the total area, which is why both directions land on the same correct answer.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'definition', title: 'base', content: `one side of a triangle or a parallelogram, chosen as the side the height is measured from; any side can be the base, as long as the height matches that same choice.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'definition', title: 'height', content: `the straight up-and-down distance from the base to the point or side directly across from it, measured perpendicular to the base, never along a slanted side.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'definition', title: 'decompose', content: `to cut a shape into smaller pieces, such as rectangles and triangles, so the area of each piece can be found on its own.` },
    { loId: 'm6math.area-of-triangles-and-quadrilaterals', kind: 'definition', title: 'compose', content: `to rearrange or fit pieces together into one shape whose area is easier to find, such as sliding a cut triangle to turn a parallelogram into a rectangle.` },
  ],
  methods: [
    {
      title: 'Worked birthday banner',
      steps: [
        `Look for the cut before reaching for any formula. This banner is not a rectangle, because the top edge (5 inches) and the bottom edge (9 inches) are different lengths, and it is not a triangle either. But it is a rectangle and a triangle pushed together.`,
        `Draw one more line: starting where the top edge ends (the top-right corner), draw a straight vertical line down to the bottom edge. Because the left edge is already vertical and this new line is also vertical, the piece on the left is a rectangle. The piece on the right, bounded by the new vertical line, the slanted edge, and part of the bottom edge, is a right triangle.`,
        `Measure the rectangle piece: its width matches the top edge, 5 inches, and its height matches the left edge, 4 inches.`,
        `Measure the triangle piece: its base is what is left of the bottom edge once the rectangle's 5 inches is removed, so 9 minus 5 equals 4 inches. Its height is the same 4 inches as the rectangle, because the new line and the left edge are both vertical and span the same distance between the top and bottom edges.`,
        `Now the formulas can be used, one piece at a time. Rectangle area: 5 times 4 equals 20 square inches. Triangle area: 4 times 4 equals 16, divided by 2 equals 8 square inches.`,
        'Add the pieces: 20 plus 8 equals 28 square inches.',
        `Check with a different cut. Imagine the whole banner sitting inside one big rectangle that is 9 inches wide and 4 inches tall: 9 times 4 equals 36 square inches. The banner is that big rectangle with the same right triangle sliced off one corner, which has area 8 square inches. Subtract: 36 minus 8 equals 28 square inches, matching the first method exactly.`,
      ],
      example: { problem: `Maria is cutting a banner for her sister's birthday party. Draw the banner like this: a bottom edge that is a straight horizontal line 9 inches long. From the left end of that bottom edge, draw a left edge straight up 4 inches. From the top of that left edge, draw a top edge going right for 5 inches. Finally, connect the end of the top edge back down to the right end of the bottom edge with one slanted line. The left edge is perpendicular to both the top and bottom edges, the top and bottom edges are parallel to each other, and only the right edge is slanted. What is the area of the banner, in square inches?`, solution: '28 square inches' },
      relatedLoIds: ['m6math.area-of-triangles-and-quadrilaterals'],
    },
    {
      title: 'Worked class trip pennant',
      steps: [
        `Compose before reaching for a formula. Cut a right triangle off the left end of the pennant, slicing straight down from the top-left corner so the cut is perpendicular to the bottom edge. Slide that triangle to the right end of the shape.`,
        `The two pieces now fit together with no gaps and no overlaps, and they form a rectangle. The rectangle's width is the same as the pennant's 14-inch edge, and its height is the same 6-inch straight up-and-down distance the pennant had.`,
        `WRONG: multiplying the base by the 10-inch slanted edge, 14 times 10 equals 140 square inches. CORRECT: the height is the straight up-and-down distance between the two parallel edges, which is 6 inches, not the length of the slanted edge. Use 14 times 6, which equals 84 square inches.`,
        `Check with a second method. Draw one diagonal from a corner of the pennant to the opposite corner. That cut decomposes the pennant into two matching triangles, each with base 14 inches and height 6 inches. Each triangle's area is 14 times 6, divided by 2, which equals 42 square inches. Two of them together: 42 plus 42 equals 84 square inches, matching the first method.`,
      ],
      example: { problem: `Room 6 is making a parallelogram-shaped pennant flag for the class trip. Draw two horizontal edges, a top edge and a bottom edge, each 14 inches long, one above the other but shifted sideways so the shape leans. Connect their ends with two slanted edges, each 10 inches long, both slanting in the same direction. The straight up-and-down distance between the top edge and the bottom edge is 6 inches. What is the area of the pennant, in square inches?`, solution: '84 square inches' },
      relatedLoIds: ['m6math.area-of-triangles-and-quadrilaterals'],
    },
  ],
  pointers: [
    { content: `Students often say "40 square centimeters" — The height of a parallelogram is always the straight up-and-down distance between its two parallel sides, never the length of a slanted side. Multiply the base by the perpendicular height instead: 8 times 4 equals 32 square centimeters.`, kind: 'common-error' },
    { content: `Students often say "18 square feet" — Decomposing a shape into pieces only helps if every piece gets counted. The first rectangle is 6 times 3, which equals 18 square feet, and the second rectangle is 2 times 4, which equals 8 square feet. Add both pieces: 18 plus 8 equals 26 square feet, which is the total area of the garden plot.`, kind: 'common-error' },
    { content: `Area is the number of same-size squares it takes to cover a shape, with no gaps and no overlaps.`, kind: 'tip' },
    { content: `A diagonal decomposes a rectangle into two matching triangles, which is why a triangle's area is base times height, divided by 2.`, kind: 'tip' },
    { content: `Cutting a triangle off one end of a parallelogram and sliding it to the other end composes it into a rectangle, which is why a parallelogram's area is also base times height.`, kind: 'tip' },
    { content: `Height is always the straight up-and-down, perpendicular distance from the base to the point or side across from it, never the length of a slanted side.`, kind: 'tip' },
    { content: `A hard shape can be decomposed into a rectangle and triangles you already know how to measure, or found by subtracting a piece from a bigger rectangle.`, kind: 'tip' },
    { content: `When a shape is decomposed into pieces, every piece's area has to be added together to get the total.`, kind: 'tip' },
  ],
};
