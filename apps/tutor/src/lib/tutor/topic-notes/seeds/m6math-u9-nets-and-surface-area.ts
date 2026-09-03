/**
 * Grade 6 Math — Unit 9 CED 9.4: Nets & Surface Area.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.nets-and-surface-area.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U9_NETS_AND_SURFACE_AREA: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.nets-and-surface-area.v1',
  course: 'Grade 6 Math',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Nets & Surface Area',
  planId: 'evelyn.ms.m6math.nets-and-surface-area.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.nets-and-surface-area.v1' }],
  theory: [
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: 'A net is a flat pattern that folds into a solid', content: `A NET IS A FLAT PATTERN THAT FOLDS INTO A SOLID — cut along the edges of a three-dimensional solid and unfold it flat, and the result is its net. Every face of the solid becomes one flat shape in the net, keeping its own exact dimensions, and every face stays attached to at least one neighboring face along a shared edge — the same edge the two faces meet at once the net is folded back up.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: `Surface area is the sum of every face's area`, content: `SURFACE AREA IS THE SUM OF EVERY FACE'S AREA — the surface area of a solid is the total area of every face on its outside, with no face skipped and none counted twice. Once a solid is laid out as a net, finding surface area becomes an addition problem: find the area of each flat piece using the area formulas already known (rectangle: length times width; triangle: base times height, divided by two), then add every piece together.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: `A rectangular prism's net is six rectangles in three matching pairs`, content: `A RECTANGULAR PRISM'S NET IS SIX RECTANGLES IN THREE MATCHING PAIRS — a rectangular prism (a box shape) has six faces, and they come in three pairs of identical rectangles: top matches bottom, front matches back, and the two ends match each other. A net for it lays out all six rectangles, each attached to a neighbor along a shared edge.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: `A triangular prism's net mixes rectangles and triangles`, content: `A TRIANGULAR PRISM'S NET MIXES RECTANGLES AND TRIANGLES — a triangular prism has two identical triangular faces (its two ends) and three rectangular faces (the sides connecting those two ends). Each rectangular face's width matches one side length of the triangle, because that rectangle wraps around exactly that side once the prism is folded up.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: 'Match every shared edge before trusting the net', content: `MATCH EVERY SHARED EDGE BEFORE TRUSTING THE NET — two faces that will touch once the solid is folded up must share an edge of the exact same length in the net. If a labeled edge does not match the length of the edge it is supposed to attach to, the net is drawn wrong and will not fold into the intended solid.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'framework', title: 'Count the faces before you add', content: `COUNT THE FACES BEFORE YOU ADD — before adding anything, count how many faces the solid actually has and confirm the net shows exactly that many pieces. The single most common mistake in a surface-area problem is leaving out one face, especially a face that is easy to forget because it is hidden behind another face in your mental picture of the solid.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'definition', title: 'net', content: `a flat pattern of two-dimensional shapes that can be folded up along shared edges to form a three-dimensional solid.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'definition', title: 'face', content: 'one of the flat surfaces of a three-dimensional solid.' },
    { loId: 'm6math.nets-and-surface-area', kind: 'definition', title: 'surface area', content: 'the total area of every face on the outside of a three-dimensional solid.' },
    { loId: 'm6math.nets-and-surface-area', kind: 'definition', title: 'rectangular prism', content: `a solid with six rectangular faces arranged in three matching pairs, such as a cereal box or a shoebox.` },
    { loId: 'm6math.nets-and-surface-area', kind: 'definition', title: 'triangular prism', content: `a solid with two identical triangular faces and three rectangular faces connecting them, such as a triangular prism-shaped pencil case.` },
  ],
  methods: [
    {
      title: 'Worked shoebox net',
      steps: [
        `Build the net. Draw a horizontal strip of four rectangles in a row, all 4 inches tall (matching the box's height). From left to right, their widths are: 6 inches (this piece is the LEFT END), 10 inches (the FRONT), 6 inches (the RIGHT END), and 10 inches (the BACK). Each rectangle shares its full 4-inch vertical edge with the rectangle next to it, so all four stay connected as one strip.`,
        `Attach the last two faces to the FRONT piece only (the second rectangle in the strip). Attach a 10-inch-by-6-inch rectangle to the front piece's top edge, extending upward — this is the TOP. Attach another 10-inch-by-6-inch rectangle to the front piece's bottom edge, extending downward — this is the BOTTOM. Both attach along a 10-inch edge, matching the front piece's 10-inch width.`,
        `Count the faces before adding: left end, front, right end, back, top, bottom — six faces, in three matching pairs (left/right, front/back, top/bottom), exactly as a rectangular prism should have.`,
        `Find the area of one face in each pair, using the rectangle-area formula from an earlier lesson. Left/right end: 6 times 4 equals 24 square inches. Front/back: 10 times 4 equals 40 square inches. Top/bottom: 10 times 6 equals 60 square inches.`,
        `Double each pair, because every pair has two matching faces, then add all three doubled pairs: (24 times 2) plus (40 times 2) plus (60 times 2) equals 48 plus 80 plus 120, which equals 248 square inches.`,
        `Check with a different grouping: add the three unique face areas first, 24 plus 40 plus 60 equals 124, then double the whole sum at once, 124 times 2 equals 248 square inches. Both methods land on the same total, which confirms no face was skipped or double-counted.`,
      ],
      example: { problem: `A shoebox is a rectangular prism 10 inches long, 6 inches wide, and 4 inches tall. Build its net in words, then use the net to find its total surface area.`, solution: '248 square inches' },
      relatedLoIds: ['m6math.nets-and-surface-area'],
    },
    {
      title: 'Worked pencil case net',
      steps: [
        `Build the rectangle strip first. Draw a horizontal strip of three rectangles in a row, all 10 centimeters tall (matching the pencil case's length). From left to right, their widths are 3 centimeters, 4 centimeters, and 5 centimeters, each sharing its 10-centimeter vertical edge with the rectangle beside it. Each rectangle wraps around one side of the triangular end once folded up: the 3-centimeter-wide rectangle wraps the triangle's 3-centimeter side, the 4-centimeter-wide one wraps the 4-centimeter side, and the 5-centimeter-wide one wraps the 5-centimeter side.`,
        `Attach the two triangular faces. Attach one triangle to the top edge of the first (3-centimeter-wide) rectangle, matching the triangle's 3-centimeter side to that edge, pointing outward and upward from the strip. Attach the second, identical triangle to the bottom edge of the third (5-centimeter-wide) rectangle, matching the triangle's 5-centimeter side to that edge, pointing outward and downward. Every other edge of each triangle is left free — it does not touch any other piece of the net.`,
        `Count the faces before adding: two triangles and three rectangles, five faces total.`,
        `Find the triangle areas using the triangle-area formula from an earlier lesson: base times height, divided by two, using the two legs of the right triangle as base and height. 3 times 4 equals 12, divided by 2 equals 6 square centimeters, for each of the two identical triangles: 6 plus 6 equals 12 square centimeters.`,
        `Find each rectangle's area: 10 times 3 equals 30 square centimeters, 10 times 4 equals 40 square centimeters, and 10 times 5 equals 50 square centimeters.`,
        `WRONG: adding only the two rectangles that used the triangle's legs (30 plus 40) and the two triangles (12), forgetting the rectangle that wraps the 5-centimeter side, for a total of 82 square centimeters. CORRECT: every side of the triangle, including the 5-centimeter side, wraps its own rectangular face, so that rectangle's 50 square centimeters must be included too.`,
        'Add all five faces: 12 plus 30 plus 40 plus 50 equals 132 square centimeters.',
        `Check with a different grouping: add the triangle's three side lengths to get its perimeter, 3 plus 4 plus 5 equals 12 centimeters, then multiply by the prism's length, 12 times 10 equals 120 square centimeters, which is the three rectangles found together in one step. Add the two triangular ends, 120 plus 12 equals 132 square centimeters, matching the first method.`,
      ],
      example: { problem: `A triangular prism-shaped pencil case has two identical triangular ends, each a right triangle with legs 3 centimeters and 4 centimeters and a third side of 5 centimeters. The pencil case is 10 centimeters long between its two triangular ends. Build its net in words, then use the net to find its total surface area.`, solution: '132 square centimeters' },
      relatedLoIds: ['m6math.nets-and-surface-area'],
    },
  ],
  pointers: [
    { content: `Students often say "240 square inches" — Surface area comes from the box's net: six rectangles with areas 60, 60, 40, 40, 24, and 24 square inches (one pair for top and bottom, one pair for front and back, one pair for the two ends). Adding those six gives 248 square inches, not 240. Volume is a different quantity, covered in another lesson, and multiplying the three dimensions together never answers a surface-area question.`, kind: 'common-error' },
    { content: `Students often say "124 square inches" — A rectangular prism's six faces come in three matching pairs, and every face counts, including its match. Double each pair before adding: 60 plus 60 plus 40 plus 40 plus 24 plus 24 equals 248 square inches, not 124.`, kind: 'common-error' },
    { content: `A net is a flat pattern that folds into a solid; every face of the solid appears once in the net, still attached to a neighbor along a shared edge of matching length.`, kind: 'tip' },
    { content: `Surface area is the total area of every face on the outside of a solid: build the net, find each face's area, then add every face together.`, kind: 'tip' },
    { content: `A rectangular prism's net is six rectangles in three matching pairs: top/bottom, front/back, and end/end.`, kind: 'tip' },
    { content: `A triangular prism's net is two triangles plus three rectangles, one rectangle wrapping each side of the triangle, including the slanted side.`, kind: 'tip' },
    { content: `Use the rectangle and triangle area formulas exactly as learned before; this lesson does not re-derive them.`, kind: 'tip' },
    { content: `Count the faces before adding, and double every matching pair — a skipped face or an un-doubled pair is the most common way to get surface area wrong.`, kind: 'tip' },
    { content: `Count faces BEFORE you add anything. A rectangular prism has 6 faces (3 matching pairs), a triangular prism has 5 faces (2 triangles + 3 rectangles). If your net doesn't match, you'll skip a face.`, kind: 'tip' },
    { content: `Don't multiply the three dimensions of a box together — that's volume, not surface area. Surface area comes from adding the areas of all six flat faces in the net.`, kind: 'common-error' },
    { content: `Every matching pair in a rectangular prism must be counted twice: (top + bottom) + (front + back) + (end + end). If you add each pair only once, you're missing half your faces.`, kind: 'gotcha' },
    { content: `In a triangular prism net, one rectangle wraps EVERY side of the triangle, including the slanted/longest side. Don't skip the rectangle that covers the hypotenuse or the third side.`, kind: 'common-error' },
    { content: `When checking if a net will fold correctly, match the edge lengths: if an edge on one face is labeled 4 cm, the edge it will attach to in the net must also be 4 cm, not 5 cm or unlabeled.`, kind: 'tip' },
    { content: `For triangular prisms, use the two perpendicular legs (not the hypotenuse) as your base and height for the triangle-area formula: (leg₁ × leg₂) ÷ 2.`, kind: 'vocab-note' },
    { content: `Surface area must have square units (like square inches or cm²), not just inches or cm. If your answer doesn't have 'square' in the units, something is wrong.`, kind: 'edge-case' },
  ],
};
