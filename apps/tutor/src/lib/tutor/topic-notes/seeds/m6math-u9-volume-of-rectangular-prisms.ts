/**
 * Grade 6 Math — Unit 9 CED 9.3: Volume of Rectangular Prisms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.volume-of-rectangular-prisms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U9_VOLUME_OF_RECTANGULAR_PRISMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.volume-of-rectangular-prisms.v1',
  course: 'Grade 6 Math',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Volume of Rectangular Prisms',
  planId: 'evelyn.ms.m6math.volume-of-rectangular-prisms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.volume-of-rectangular-prisms.v1' }],
  theory: [
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'framework', title: 'Volume means counting cubes that fill a solid', content: `VOLUME MEANS COUNTING CUBES THAT FILL A SOLID — the volume of a solid is the number of same-size cubes it takes to pack it completely, with no gaps and no cubes left sticking out. If those cubes are unit cubes, edge length 1, the count is the volume in cubic units.` },
    { loId: 'm6math.volume-of-rectangular-prisms', content: `V = l x w x h COUNTS LAYERS OF UNIT CUBES — for a right rectangular prism with whole-number edges, multiplying length times width times height counts exactly that many unit cubes, layer by layer. A box 3 inches by 2 inches by 4 inches holds 3 x 2 x 4 = 24 unit cubes, arranged as 4 layers of 3 x 2 = 6 cubes each.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'framework', title: 'Fractional edges need a smaller cube', content: `FRACTIONAL EDGES NEED A SMALLER CUBE — when an edge length is a fraction, like 1/2 inch or 1/4 inch, a unit cube does not fit evenly. Instead, pack the prism with smaller cubes whose edge length is a unit fraction, chosen so that fraction fits a whole number of times along EVERY edge of the prism, not just one of them.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'framework', title: 'Each small cube has its own fractional volume', content: `EACH SMALL CUBE HAS ITS OWN FRACTIONAL VOLUME — a cube with edge length 1/2 inch has volume 1/2 x 1/2 x 1/2 = 1/8 cubic inch, since it takes 8 of them, stacked 2 by 2 by 2, to fill one unit cube. A cube with edge length 1/4 inch has volume 1/4 x 1/4 x 1/4 = 1/64 cubic inch. To find the total volume, count how many small cubes fit, then multiply that count by one small cube's volume.` },
    { loId: 'm6math.volume-of-rectangular-prisms', content: `PACKING ALWAYS AGREES WITH V = l x w x h — count the small cubes along each edge, multiply those three counts together, then multiply by one small cube's volume, and the result is always exactly the same as multiplying the prism's three edge lengths straight across. That is why the same formula still works when the edges are fractions, not just whole numbers.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'framework', title: 'Multiply fractional edges straight across', content: `MULTIPLY FRACTIONAL EDGES STRAIGHT ACROSS — to use V = l x w x h with fractional edges, multiply the three edge lengths the same way you multiply any fractions: numerator times numerator, denominator times denominator, writing a whole number as itself over 1. Volume is always measured in cubic units, such as cubic inches, because it counts cubes, not flat squares.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'definition', title: 'right rectangular prism', content: `a box shape with six flat rectangular faces, where every edge meets the next one at a right angle.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'definition', title: 'unit cube', content: `a cube with an edge length of exactly 1 unit, used as the basic building block for measuring volume.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'definition', title: 'unit fraction cube', content: `a small cube whose edge length is a unit fraction, such as 1/2 inch or 1/4 inch, used to pack a prism whose own edges are not whole numbers.` },
    { loId: 'm6math.volume-of-rectangular-prisms', kind: 'definition', title: 'cubic unit', content: `the unit volume is measured in, such as cubic inches, because volume counts cubes rather than flat squares.` },
  ],
  methods: [
    {
      title: 'Worked jewelry box packing',
      steps: [
        `Pick a small cube size that fits a whole number of times along every edge. The edges are 3/2 inch, 1 inch, and 1/2 inch, and 1/2 inch fits evenly into all three, so pack the box with small cubes that each measure 1/2 inch on every edge.`,
        `Count how many small cubes fit along each edge. Along the 3/2-inch edge: 3/2 divided by 1/2 = 3 small cubes. Along the 1-inch edge: 1 divided by 1/2 = 2 small cubes. Along the 1/2-inch edge: 1/2 divided by 1/2 = 1 small cube.`,
        `Multiply the three counts to get the total number of small cubes: 3 x 2 x 1 = 6 small cubes fill the box.`,
        `Find the volume of one small cube: edge 1/2 inch, so its volume is 1/2 x 1/2 x 1/2 = 1/8 cubic inch.`,
        `Multiply the number of small cubes by the volume of one small cube: 6 x 1/8 = 6/8 cubic inch, which simplifies to 3/4 cubic inch.`,
        `Check with the formula directly: V = l x w x h = 3/2 x 1 x 1/2 = 3/4 cubic inch. Packing and counting gives the exact same answer as multiplying the edges.`,
        `Check by dividing back: dividing the volume by the base area, length times width, should return the height. 3/4 divided by (3/2 x 1) = 3/4 divided by 3/2 = 3/4 x 2/3 = 1/2, which matches the height exactly, so the volume is correct.`,
      ],
      example: { problem: `A small rectangular jewelry box for a friend's birthday present measures 3/2 inches long, 1 inch wide, and 1/2 inch tall. Find its volume by packing it with small cubes and counting them.`, solution: '3/4 cubic inch' },
      relatedLoIds: ['m6math.volume-of-rectangular-prisms'],
    },
    {
      title: 'Worked party favor box formula',
      steps: [
        `Rewrite every edge so they share the same denominator: 5/4 inch stays 5/4, 1/2 inch becomes 2/4, and 1 inch becomes 4/4. Pack the box with small cubes that each measure 1/4 inch on every edge, since 1/4 fits evenly into all three.`,
        `Count small cubes along each edge: 5 along the 5/4-inch edge, 2 along the 2/4-inch edge, and 4 along the 4/4-inch edge.`,
        'Multiply the three counts: 5 x 2 x 4 = 40 small cubes fill the box.',
        `Find the volume of one small cube: edge 1/4 inch, so its volume is 1/4 x 1/4 x 1/4 = 1/64 cubic inch.`,
        'Multiply: 40 x 1/64 = 40/64 cubic inch, which simplifies to 5/8 cubic inch.',
        `WRONG: multiplying only two of the three edges, such as length times height, 5/4 x 1 = 5/4, and calling that the volume. That number is the area of one rectangular face, in square inches, not the volume of the whole box. CORRECT: volume needs all three edges multiplied together: 5/4 x 1/2 x 1 = 5/8 cubic inch.`,
        `Check with the formula directly: V = l x w x h = 5/4 x 1/2 x 1 = 5/8 cubic inch, matching the packing count.`,
        `Check by dividing back: dividing the volume by the base area should return the height. 5/8 divided by (5/4 x 1/2) = 5/8 divided by 5/8 = 1, which matches the height exactly.`,
      ],
      example: { problem: `A small party favor box for the same birthday party measures 5/4 inches long, 1/2 inch wide, and 1 inch tall. Find its volume.`, solution: '5/8 cubic inch' },
      relatedLoIds: ['m6math.volume-of-rectangular-prisms'],
    },
  ],
  pointers: [
    { content: `Students often say "4 and 1/6 cubic inches" — Volume is never found by adding edges; it is found by multiplying them. Multiply straight across: 2/3 x 3 x 1/2 = (2 x 3 x 1) divided by (3 x 1 x 2) = 6/6 = 1 cubic inch. Adding gives a length-like number, not a volume, and it does not match packing the prism with small cubes and counting them.`, kind: 'common-error' },
    { content: `Students often say "2 cubic inches" — Two edges multiplied together give the area of one rectangular face, in square inches, not the volume of the whole prism. All three edges must be multiplied: 2/3 x 3 x 1/2 = 1 cubic inch, which matches packing the prism with small cubes and counting them.`, kind: 'common-error' },
    { content: `Volume counts how many same-size cubes, unit cubes or smaller fractional cubes, it takes to fill a solid with no gaps and no overlaps.`, kind: 'tip' },
    { content: `V = l x w x h works for fractional edges exactly the way it works for whole-number edges: packing with unit-fraction cubes and counting always agrees with multiplying the edges straight across.`, kind: 'tip' },
    { content: `To pack a prism with fractional edges, choose a small cube edge length that fits a whole number of times into EVERY edge of the prism, not just one of them.`, kind: 'tip' },
    { content: `Multiply fractional edge lengths straight across, numerator times numerator and denominator times denominator, writing any whole number as itself over 1.`, kind: 'tip' },
    { content: `Volume is always measured in cubic units, such as cubic inches, because it counts cubes, not flat squares.`, kind: 'tip' },
    { content: `Multiplying only two of the three edges gives the area of one face, not the volume — always use all three.`, kind: 'tip' },
  ],
};
