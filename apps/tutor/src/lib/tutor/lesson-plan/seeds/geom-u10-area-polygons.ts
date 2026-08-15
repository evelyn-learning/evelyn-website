/**
 * Geometry — Measurement & Modeling: Area of Triangles, Quadrilaterals &
 * Regular Polygons.
 *
 * One idea in many costumes (CCSS G-MG.A.1, G-GPE.B.7): every area formula
 * on this list is a rectangle that has been halved, averaged, or sliced into
 * wedges. The recurring student error — grabbing a slanted SIDE instead of
 * the perpendicular HEIGHT — gets its own worked example.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U10_AREA_POLYGONS: LessonPlan = {
  id: 'evelyn.hs.geom.area-polygons.v1',
  title: 'Area: Triangles, Quadrilaterals & Regular Polygons',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.area-polygons',
      standard: 'GEOM-10.1',
      description:
        'Compute the area of triangles, parallelograms, trapezoids, rhombuses, kites, and regular polygons using the perpendicular height, the diagonal formula, and the apothem-perimeter formula, and decompose composite or coordinate figures into these pieces (CCSS G-MG.A.1, G-GPE.B.7).',
    },
  ],
  prerequisites: ['geom.circle-equations'],
  followUps: ['geom.circumference-arc-length-sector'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame area as the number every builder, designer, and landscaper actually pays for — and the formulas as one rectangle in disguise.',
      script:
        'Flooring, turf, roofing, paint, fabric — all of it is sold by the square unit, so somebody has to turn a shape into a number. The good news: you do not need a formula for every shape on earth. Almost every area formula in this lesson is a rectangle that got halved, averaged, or sliced into wedges. Learn where each one comes from and you can hand back a number for a triangle, a trapezoid, a kite, or a regular octagon without memorizing a wall of formulas.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-area-formulas',
      kind: 'concept',
      goal: 'The formula family, where each comes from, and the perpendicular-height discipline that decides every answer.',
      keyIdeas: [
        'AREA COUNTS SQUARES — area is how many unit squares fit inside a figure, so every answer carries SQUARE units (cm², ft², m²). Perimeter is a distance around; area is a covering. Never add side lengths to get area.',
        'RECTANGLE AND PARALLELOGRAM — A = b·h. Slide the triangle off one end of a parallelogram to the other and you have built a rectangle, so a parallelogram with base b and height h has exactly the rectangle\'s area. The h is the PERPENDICULAR distance between the two parallel sides — never the slanted side.',
        'TRIANGLE — A = (1/2)·b·h. Two copies of any triangle snap together into a parallelogram, so a triangle is half of it. ANY side may serve as the base, but the height must be measured ⊥ to THAT base — and in an obtuse triangle that height lands on the base\'s extension, outside the triangle. Still legal.',
        'TRAPEZOID — A = (1/2)(b1 + b2)·h, where b1 and b2 are the two PARALLEL sides and h is the distance between them. Read it as "average of the parallel sides × height": the trapezoid covers the same area as a rectangle whose width is that average.',
        'DIAGONAL FORMULA — for a rhombus or a kite, A = (1/2)·d1·d2, where d1 and d2 are the full diagonals. It works because those diagonals are ⊥, so the figure fits exactly inside a d1-by-d2 rectangle and fills half of it.',
        'REGULAR POLYGONS — the apothem a is the ⊥ segment from the center to the midpoint of a side. Cut a regular n-gon into n identical triangles, each with base s and height a: A = n·(1/2)·s·a = (1/2)·a·P, where P = n·s is the perimeter. One formula covers pentagons, hexagons, octagons — everything.',
        'COORDINATE FIGURES — with vertices given as points, horizontal and vertical side lengths come straight from subtracting coordinates. For a tilted figure, box it in the smallest rectangle and SUBTRACT the corner right triangles rather than fighting for a slanted height.',
        'CLASSIC ERRORS — (1) using a slanted side as the height; (2) forgetting the 1/2 in the triangle, trapezoid, and diagonal formulas; (3) in a rhombus or kite, using HALF-diagonals in A = (1/2)·d1·d2, which quarters the answer; (4) mixing units (convert before you multiply).',
      ],
      vocabulary: [
        {
          term: 'apothem',
          definition: 'in a regular polygon, the perpendicular segment from the center to the midpoint of a side.',
        },
        {
          term: 'height (altitude)',
          definition: 'the perpendicular distance from a base to the opposite side or vertex — perpendicular to the chosen base, not along a slanted side.',
        },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-regular-pentagon',
      kind: 'worked_example',
      problem:
        'A garden bed is a regular pentagon with side length 8 ft. The apothem — the perpendicular distance from the center to the midpoint of a side — is 5.5 ft. How many square feet of soil does the bed cover?',
      steps: [
        'Picture the slicing: connect the center to all five vertices. That cuts the pentagon into 5 identical triangles, each with base 8 (a side) and height 5.5 (the apothem).',
        'Area of one wedge triangle: (1/2)·8·5.5 = 22 ft².',
        'Five identical wedges: 5 · 22 = 110 ft².',
        'Same thing with the packaged formula: P = 5 · 8 = 40 ft, so A = (1/2)·a·P = (1/2)·5.5·40 = 110 ft². The two routes agree, which is why (1/2)·a·P works for ANY regular polygon.',
      ],
      answer: '110 ft²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-slant-height-trap',
      kind: 'worked_example',
      problem:
        'A parallelogram-shaped sign has a horizontal bottom side of 10 in and slanted sides of 6 in. The perpendicular distance between the two horizontal sides is 4 in. A student computes 10 × 6 = 60 in². Find the correct area and explain the error.',
      steps: [
        'Identify the base: the bottom side, b = 10 in. Now the height must be measured ⊥ to that base.',
        'The 6 in slanted side runs at an angle, so it is longer than the perpendicular gap between the parallel sides. The perpendicular gap is the stated 4 in — that is h.',
        'A = b·h = 10 · 4 = 40 in².',
        'Why the student\'s 60 is impossible: the slanted side is the hypotenuse of a right triangle whose leg is the true height, so it is ALWAYS longer than h. Using it inflates the area every time. Sanity check: a 10-by-6 rectangle would have area 60, and the parallelogram is the "leaned-over" version of a shorter rectangle, so it must come in under 60.',
      ],
      answer: '40 in² — the height is the perpendicular 4 in, not the slanted 6 in side',
      estimatedMinutes: 3,
    },
    {
      id: 'try-octagon',
      kind: 'try_yourself',
      problem:
        'A regular octagon has side length 5 cm and apothem 6 cm. What is its area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '120 cm²', correct: true },
        { id: 'b', text: '240 cm²' },
        { id: 'c', text: '15 cm²' },
        { id: 'd', text: '40 cm²' },
      ],
      expectedAnswer: '120 cm²',
      hints: [
        'A = (1/2)·a·P — start by finding the perimeter of a regular octagon with side 5.',
        'P = 8 · 5 = 40 cm, so A = (1/2)·6·40. Do not stop at one wedge triangle, and do not drop the 1/2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rhombus-diagonals',
      kind: 'try_yourself',
      problem:
        'A rhombus has diagonals of length 16 and 12, and each of its four sides measures 10. What is its area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '96 square units', correct: true },
        { id: 'b', text: '192 square units' },
        { id: 'c', text: '100 square units' },
        { id: 'd', text: '48 square units' },
      ],
      expectedAnswer: '96 square units',
      hints: [
        'A rhombus has perpendicular diagonals, so use A = (1/2)·d1·d2 — the side length of 10 is not needed.',
        'Use the FULL diagonals, 16 and 12, and keep the 1/2: (1/2)(16)(12).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A trapezoidal deck has two parallel sides measuring 20 ft and 12 ft, and the perpendicular distance between those parallel sides is 7 ft. Find the area in square feet. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '112',
      hints: [
        'A = (1/2)(b1 + b2)·h with b1 = 20 and b2 = 12 — add the parallel sides first, do not subtract them.',
        '(1/2)(20 + 12)(7) = (1/2)(32)(7).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-height',
      kind: 'misconception_check',
      question:
        'A triangle has sides 5, 6, and 9. It is obtuse, so the altitude drawn to the 6-unit side meets the EXTENSION of that side, outside the triangle; that altitude measures 4. A student says the area formula "does not apply because the height is outside," and instead multiplies two sides: (1/2)(5)(6) = 15. What went wrong?',
      commonErrors: [
        {
          answer: '15 square units, using (1/2)(5)(6)',
          misconception:
            'Believing the height must land inside the triangle, then substituting a second SIDE for the height — which only works when those two sides are perpendicular.',
          correctsTo:
            'A = (1/2)·b·h needs a base and the perpendicular distance to the opposite vertex, and that distance is allowed to land on the base\'s extension. Pair the base 6 with its own altitude 4: A = (1/2)(6)(4) = 12 square units. Two sides may be multiplied only in a right triangle, where the legs are already perpendicular.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parallelogram b·h; triangle (1/2)·b·h; trapezoid (1/2)(b1 + b2)·h — every one is a rectangle halved or averaged.',
        'The height is always ⊥ to the chosen base — never a slanted side, and it may land outside an obtuse triangle.',
        'Rhombus and kite: A = (1/2)·d1·d2 using the FULL diagonals.',
        'Regular polygon: A = (1/2)·a·P — apothem times perimeter, halved; it is just n wedge triangles added up.',
        'Answers carry square units; convert to one unit before multiplying.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.1', cedTitle: 'Area: Triangles, Quadrilaterals & Regular Polygons' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
