/**
 * Geometry — Unit 10 CED 10.1: Area: Triangles, Quadrilaterals & Regular Polygons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.geom.area-polygons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_GEOM_U10_AREA_POLYGONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.geom.area-polygons.v1',
  course: 'Geometry',
  cedUnit: 10,
  cedTopic: '10.1',
  cedTitle: 'Area: Triangles, Quadrilaterals & Regular Polygons',
  planId: 'evelyn.hs.geom.area-polygons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.geom.area-polygons.v1' }],
  theory: [
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Area counts squares', content: `AREA COUNTS SQUARES — area is how many unit squares fit inside a figure, so every answer carries SQUARE units (cm², ft², m²). Perimeter is a distance around; area is a covering. Never add side lengths to get area.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Rectangle and parallelogram', content: `RECTANGLE AND PARALLELOGRAM — A = b·h. Slide the triangle off one end of a parallelogram to the other and you have built a rectangle, so a parallelogram with base b and height h has exactly the rectangle's area. The h is the PERPENDICULAR distance between the two parallel sides — never the slanted side.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Triangle', content: `TRIANGLE — A = (1/2)·b·h. Two copies of any triangle snap together into a parallelogram, so a triangle is half of it. ANY side may serve as the base, but the height must be measured ⊥ to THAT base — and in an obtuse triangle that height lands on the base's extension, outside the triangle. Still legal.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Trapezoid', content: `TRAPEZOID — A = (1/2)(b1 + b2)·h, where b1 and b2 are the two PARALLEL sides and h is the distance between them. Read it as "average of the parallel sides × height": the trapezoid covers the same area as a rectangle whose width is that average.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Diagonal formula', content: `DIAGONAL FORMULA — for a rhombus or a kite, A = (1/2)·d1·d2, where d1 and d2 are the full diagonals. It works because those diagonals are ⊥, so the figure fits exactly inside a d1-by-d2 rectangle and fills half of it.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Regular polygons', content: `REGULAR POLYGONS — the apothem a is the ⊥ segment from the center to the midpoint of a side. Cut a regular n-gon into n identical triangles, each with base s and height a: A = n·(1/2)·s·a = (1/2)·a·P, where P = n·s is the perimeter. One formula covers pentagons, hexagons, octagons — everything.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Coordinate figures', content: `COORDINATE FIGURES — with vertices given as points, horizontal and vertical side lengths come straight from subtracting coordinates. For a tilted figure, box it in the smallest rectangle and SUBTRACT the corner right triangles rather than fighting for a slanted height.` },
    { loId: 'geom.area-polygons', kind: 'framework', title: 'Classic errors', content: `CLASSIC ERRORS — (1) using a slanted side as the height; (2) forgetting the 1/2 in the triangle, trapezoid, and diagonal formulas; (3) in a rhombus or kite, using HALF-diagonals in A = (1/2)·d1·d2, which quarters the answer; (4) mixing units (convert before you multiply).` },
    { loId: 'geom.area-polygons', kind: 'definition', title: 'apothem', content: `in a regular polygon, the perpendicular segment from the center to the midpoint of a side.` },
    { loId: 'geom.area-polygons', kind: 'definition', title: 'height (altitude)', content: `the perpendicular distance from a base to the opposite side or vertex — perpendicular to the chosen base, not along a slanted side.` },
  ],
  methods: [
    {
      title: 'Worked regular pentagon',
      steps: [
        `Picture the slicing: connect the center to all five vertices. That cuts the pentagon into 5 identical triangles, each with base 8 (a side) and height 5.5 (the apothem).`,
        'Area of one wedge triangle: (1/2)·8·5.5 = 22 ft².',
        'Five identical wedges: 5 · 22 = 110 ft².',
        `Same thing with the packaged formula: P = 5 · 8 = 40 ft, so A = (1/2)·a·P = (1/2)·5.5·40 = 110 ft². The two routes agree, which is why (1/2)·a·P works for ANY regular polygon.`,
      ],
      example: { problem: `A garden bed is a regular pentagon with side length 8 ft. The apothem — the perpendicular distance from the center to the midpoint of a side — is 5.5 ft. How many square feet of soil does the bed cover?`, solution: '110 ft²' },
      relatedLoIds: ['geom.area-polygons'],
    },
    {
      title: 'Worked slant height trap',
      steps: [
        `Identify the base: the bottom side, b = 10 in. Now the height must be measured ⊥ to that base.`,
        `The 6 in slanted side runs at an angle, so it is longer than the perpendicular gap between the parallel sides. The perpendicular gap is the stated 4 in — that is h.`,
        'A = b·h = 10 · 4 = 40 in².',
        `Why the student's 60 is impossible: the slanted side is the hypotenuse of a right triangle whose leg is the true height, so it is ALWAYS longer than h. Using it inflates the area every time. Sanity check: a 10-by-6 rectangle would have area 60, and the parallelogram is the "leaned-over" version of a shorter rectangle, so it must come in under 60.`,
      ],
      example: { problem: `A parallelogram-shaped sign has a horizontal bottom side of 10 in and slanted sides of 6 in. The perpendicular distance between the two horizontal sides is 4 in. A student computes 10 × 6 = 60 in². Find the correct area and explain the error.`, solution: '40 in² — the height is the perpendicular 4 in, not the slanted 6 in side' },
      relatedLoIds: ['geom.area-polygons'],
    },
  ],
  pointers: [
    { content: `A = (1/2)·b·h needs a base and the perpendicular distance to the opposite vertex, and that distance is allowed to land on the base's extension. Pair the base 6 with its own altitude 4: A = (1/2)(6)(4) = 12 square units. Two sides may be multiplied only in a right triangle, where the legs are already perpendicular.`, kind: 'common-error' },
    { content: `Parallelogram b·h; triangle (1/2)·b·h; trapezoid (1/2)(b1 + b2)·h — every one is a rectangle halved or averaged.`, kind: 'tip' },
    { content: `The height is always ⊥ to the chosen base — never a slanted side, and it may land outside an obtuse triangle.`, kind: 'tip' },
    { content: 'Rhombus and kite: A = (1/2)·d1·d2 using the FULL diagonals.', kind: 'tip' },
    { content: `Regular polygon: A = (1/2)·a·P — apothem times perimeter, halved; it is just n wedge triangles added up.`, kind: 'tip' },
    { content: 'Answers carry square units; convert to one unit before multiplying.', kind: 'tip' },
    { content: `In \`A = ½d₁d₂\` for a rhombus or kite, d₁ and d₂ are the **full** diagonals, not the halves. Using 8 and 6 instead of 16 and 12 gives 24 instead of 96 — a quarter of the truth. If the problem hands you half-diagonals, double them first.`, kind: 'common-error' },
    { content: `Extra side lengths are often decoys. A rhombus with diagonals 16 and 12 also has sides of 10 — the 10 does nothing for the area. Same with the 6 in slanted side of a parallelogram. Ask: is this length perpendicular to my base, or is it just a side?`, kind: 'gotcha' },
    { content: `A slanted side is the hypotenuse of a right triangle whose leg is the true height, so it is **always** longer than h. If your area comes out bigger than the rectangle with the same base and slant side, you used the wrong number.`, kind: 'tip' },
    { content: `In an obtuse triangle the altitude lands on the **extension** of the base, outside the figure. That's completely legal — the formula still works. Never swap in a second side for the height unless the triangle is right and those sides are the legs.`, kind: 'edge-case' },
    { content: `'Base' and 'height' are a matched pair, not fixed labels. Any of a triangle's three sides may be the base, but you must use the altitude drawn to *that* base. Pairing base 6 with an altitude belonging to base 9 is a guaranteed wrong answer.`, kind: 'vocab-note' },
    { content: `In a trapezoid, b₁ and b₂ must be the two **parallel** sides — the legs never enter the formula. And h is the distance between those parallel sides, not the length of a slanted leg.`, kind: 'vocab-note' },
    { content: `Apothem ≠ radius. The apothem goes from the center ⊥ to the **midpoint of a side**; the radius goes to a **vertex** and is longer. In \`A = ½aP\`, P is the whole perimeter (n·s), not one side.`, kind: 'vocab-note' },
    { content: `Don't lose the ½: triangle, trapezoid, and diagonal formulas all have it; parallelogram and rectangle don't. And label every answer in square units after converting all lengths to the same unit — never multiply inches by feet.`, kind: 'common-error' },
  ],
};
