/**
 * Grade 6 Math — Area, Surface Area & Volume: Nets & Surface Area.
 *
 * PROCEDURE-LED exemplar shape, built around a spatial skill that has no
 * picture to lean on in a words-only lesson: a NET is a flat pattern that
 * folds into a solid, and every face in that flat pattern must be described
 * precisely enough — by shape, dimensions, and which edge it shares with
 * which neighbor — that a student could draw it from the words alone (CCSS
 * 6.G.A.4). Both worked examples therefore build the net piece by piece in
 * words before any area is found, and every area formula used is APPLIED
 * exactly as row 9.1 already taught it, never re-derived by composing or
 * decomposing a shape. Two traps this plan is built to kill: leaving a face
 * out of the total (especially one hidden "behind" another face in the
 * student's mental picture), and adding each matching pair of faces only
 * once instead of twice.
 *
 * SCOPE GUARD: This lesson represents a three-dimensional figure with a net
 * of rectangles and triangles and uses that net to find surface area (CCSS
 * 6.G.A.4). Every net in this lesson folds into a rectangular prism or a
 * triangular prism; no pyramid and no composite solid appears, because Grade
 * 6 never reaches those — G7 U8 owns pyramid and composite-solid surface area
 * and volume. The area formulas for a rectangle (length times width) and a
 * triangle (base times height, divided by two) are APPLIED throughout,
 * exactly as row 9.1 already established them; this lesson never re-derives
 * those formulas by composing or decomposing a shape, which is row 9.1's own
 * method. Volume is mentioned only to distinguish it BY NAME from surface
 * area, inside the misconception check; this lesson never computes a volume,
 * which is row 9.3's skill.
 *
 * NOTE ON prerequisites/followUps: the true chain for this row is
 * 9.3 (volume-of-rectangular-prisms) -> 9.4 (this row) ->
 * 10.1 (statistical-questions), taken from the brief's authoritative table
 * rather than left empty, per the fan-out contract's chain rule.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U9_NETS_AND_SURFACE_AREA: LessonPlan = {
  id: 'evelyn.ms.m6math.nets-and-surface-area.v1',
  title: 'Nets & Surface Area',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.nets-and-surface-area',
      standard: 'M6MATH-9.4',
      description:
        'Represent a 3D figure using a net of rectangles and triangles; use the net to find surface area (CCSS 6.G.A.4).',
    },
  ],
  prerequisites: ['m6math.volume-of-rectangular-prisms'],
  followUps: ['m6math.statistical-questions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see a solid become a flat, addable pattern before any formula is named.',
      script:
        'Picture flattening an empty shoebox for the recycling bin. You pull the tape loose and press the box down, and a shape that used to stand up on its own now lies open and flat on the floor, still one connected piece made of rectangles. That flat pattern is called a net, and it holds a shortcut: once a solid is spread out flat like this, finding how much cardboard covers its whole outside is just adding up the area of every flat piece you can now see at once. Today we build nets for two solids in words alone, a box and a triangular prism, and use each net to find the solid\'s total surface area.',
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-nets-and-surface-area',
      kind: 'concept',
      goal: 'Install a net as a flat, fold-able pattern of faces, and surface area as the sum of every face in it.',
      keyIdeas: [
        'A NET IS A FLAT PATTERN THAT FOLDS INTO A SOLID — cut along the edges of a three-dimensional solid and unfold it flat, and the result is its net. Every face of the solid becomes one flat shape in the net, keeping its own exact dimensions, and every face stays attached to at least one neighboring face along a shared edge — the same edge the two faces meet at once the net is folded back up.',
        'SURFACE AREA IS THE SUM OF EVERY FACE\'S AREA — the surface area of a solid is the total area of every face on its outside, with no face skipped and none counted twice. Once a solid is laid out as a net, finding surface area becomes an addition problem: find the area of each flat piece using the area formulas already known (rectangle: length times width; triangle: base times height, divided by two), then add every piece together.',
        'A RECTANGULAR PRISM\'S NET IS SIX RECTANGLES IN THREE MATCHING PAIRS — a rectangular prism (a box shape) has six faces, and they come in three pairs of identical rectangles: top matches bottom, front matches back, and the two ends match each other. A net for it lays out all six rectangles, each attached to a neighbor along a shared edge.',
        'A TRIANGULAR PRISM\'S NET MIXES RECTANGLES AND TRIANGLES — a triangular prism has two identical triangular faces (its two ends) and three rectangular faces (the sides connecting those two ends). Each rectangular face\'s width matches one side length of the triangle, because that rectangle wraps around exactly that side once the prism is folded up.',
        'MATCH EVERY SHARED EDGE BEFORE TRUSTING THE NET — two faces that will touch once the solid is folded up must share an edge of the exact same length in the net. If a labeled edge does not match the length of the edge it is supposed to attach to, the net is drawn wrong and will not fold into the intended solid.',
        'COUNT THE FACES BEFORE YOU ADD — before adding anything, count how many faces the solid actually has and confirm the net shows exactly that many pieces. The single most common mistake in a surface-area problem is leaving out one face, especially a face that is easy to forget because it is hidden behind another face in your mental picture of the solid.',
      ],
      vocabulary: [
        { term: 'net', definition: 'a flat pattern of two-dimensional shapes that can be folded up along shared edges to form a three-dimensional solid.' },
        { term: 'face', definition: 'one of the flat surfaces of a three-dimensional solid.' },
        { term: 'surface area', definition: 'the total area of every face on the outside of a three-dimensional solid.' },
        { term: 'rectangular prism', definition: 'a solid with six rectangular faces arranged in three matching pairs, such as a cereal box or a shoebox.' },
        { term: 'triangular prism', definition: 'a solid with two identical triangular faces and three rectangular faces connecting them, such as a triangular prism-shaped pencil case.' },
      ],
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-shoebox-net',
      kind: 'worked_example',
      problem:
        'A shoebox is a rectangular prism 10 inches long, 6 inches wide, and 4 inches tall. Build its net in words, then use the net to find its total surface area.',
      steps: [
        'Build the net. Draw a horizontal strip of four rectangles in a row, all 4 inches tall (matching the box\'s height). From left to right, their widths are: 6 inches (this piece is the LEFT END), 10 inches (the FRONT), 6 inches (the RIGHT END), and 10 inches (the BACK). Each rectangle shares its full 4-inch vertical edge with the rectangle next to it, so all four stay connected as one strip.',
        'Attach the last two faces to the FRONT piece only (the second rectangle in the strip). Attach a 10-inch-by-6-inch rectangle to the front piece\'s top edge, extending upward — this is the TOP. Attach another 10-inch-by-6-inch rectangle to the front piece\'s bottom edge, extending downward — this is the BOTTOM. Both attach along a 10-inch edge, matching the front piece\'s 10-inch width.',
        'Count the faces before adding: left end, front, right end, back, top, bottom — six faces, in three matching pairs (left/right, front/back, top/bottom), exactly as a rectangular prism should have.',
        'Find the area of one face in each pair, using the rectangle-area formula from an earlier lesson. Left/right end: 6 times 4 equals 24 square inches. Front/back: 10 times 4 equals 40 square inches. Top/bottom: 10 times 6 equals 60 square inches.',
        'Double each pair, because every pair has two matching faces, then add all three doubled pairs: (24 times 2) plus (40 times 2) plus (60 times 2) equals 48 plus 80 plus 120, which equals 248 square inches.',
        'Check with a different grouping: add the three unique face areas first, 24 plus 40 plus 60 equals 124, then double the whole sum at once, 124 times 2 equals 248 square inches. Both methods land on the same total, which confirms no face was skipped or double-counted.',
      ],
      answer: '248 square inches',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pencil-case-net',
      kind: 'worked_example',
      problem:
        'A triangular prism-shaped pencil case has two identical triangular ends, each a right triangle with legs 3 centimeters and 4 centimeters and a third side of 5 centimeters. The pencil case is 10 centimeters long between its two triangular ends. Build its net in words, then use the net to find its total surface area.',
      steps: [
        'Build the rectangle strip first. Draw a horizontal strip of three rectangles in a row, all 10 centimeters tall (matching the pencil case\'s length). From left to right, their widths are 3 centimeters, 4 centimeters, and 5 centimeters, each sharing its 10-centimeter vertical edge with the rectangle beside it. Each rectangle wraps around one side of the triangular end once folded up: the 3-centimeter-wide rectangle wraps the triangle\'s 3-centimeter side, the 4-centimeter-wide one wraps the 4-centimeter side, and the 5-centimeter-wide one wraps the 5-centimeter side.',
        'Attach the two triangular faces. Attach one triangle to the top edge of the first (3-centimeter-wide) rectangle, matching the triangle\'s 3-centimeter side to that edge, pointing outward and upward from the strip. Attach the second, identical triangle to the bottom edge of the third (5-centimeter-wide) rectangle, matching the triangle\'s 5-centimeter side to that edge, pointing outward and downward. Every other edge of each triangle is left free — it does not touch any other piece of the net.',
        'Count the faces before adding: two triangles and three rectangles, five faces total.',
        'Find the triangle areas using the triangle-area formula from an earlier lesson: base times height, divided by two, using the two legs of the right triangle as base and height. 3 times 4 equals 12, divided by 2 equals 6 square centimeters, for each of the two identical triangles: 6 plus 6 equals 12 square centimeters.',
        'Find each rectangle\'s area: 10 times 3 equals 30 square centimeters, 10 times 4 equals 40 square centimeters, and 10 times 5 equals 50 square centimeters.',
        'WRONG: adding only the two rectangles that used the triangle\'s legs (30 plus 40) and the two triangles (12), forgetting the rectangle that wraps the 5-centimeter side, for a total of 82 square centimeters. CORRECT: every side of the triangle, including the 5-centimeter side, wraps its own rectangular face, so that rectangle\'s 50 square centimeters must be included too.',
        'Add all five faces: 12 plus 30 plus 40 plus 50 equals 132 square centimeters.',
        'Check with a different grouping: add the triangle\'s three side lengths to get its perimeter, 3 plus 4 plus 5 equals 12 centimeters, then multiply by the prism\'s length, 12 times 10 equals 120 square centimeters, which is the three rectangles found together in one step. Add the two triangular ends, 120 plus 12 equals 132 square centimeters, matching the first method.',
      ],
      answer: '132 square centimeters',
      estimatedMinutes: 3,
    },
    {
      id: 'try-net-structure',
      kind: 'try_yourself',
      problem:
        'A cereal box, a rectangular prism, is unfolded into its net. The net shows six rectangles. Which statement about those six rectangles is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All six rectangles are exactly the same size.' },
        { id: 'b', text: 'The six rectangles form three matching pairs: top with bottom, front with back, and one end with the other end.', correct: true },
        { id: 'c', text: 'Only three rectangles are needed, because the other three sides are open.' },
        { id: 'd', text: 'Each rectangle shares an edge with all three of the other rectangles.' },
      ],
      expectedAnswer: 'The six rectangles form three matching pairs: top with bottom, front with back, and one end with the other end.',
      hints: [
        'A rectangular prism has six faces total, and its net shows every one of them, even the top and bottom you might not notice while looking straight at the box.',
        'Faces directly across from each other on the box are the same size: top matches bottom, front matches back, and the two ends match each other. That gives three matching pairs, not six different sizes and not three faces total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-gift-box-surface-area',
      kind: 'try_yourself',
      problem:
        'A small gift box, shaped like a rectangular prism, is 6 inches long, 4 inches wide, and 2 inches tall. What is its total surface area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '44 square inches' },
        { id: 'b', text: '48 square inches' },
        { id: 'c', text: '72 square inches' },
        { id: 'd', text: '88 square inches', correct: true },
      ],
      expectedAnswer: '88 square inches',
      hints: [
        'This box has six faces in three matching pairs: a 6-by-4 pair, a 6-by-2 pair, and a 4-by-2 pair. Find the area of one rectangle in each pair, then double every pair before adding.',
        'One pair is 6 times 4 equals 24, another is 6 times 2 equals 12, and the last is 4 times 2 equals 8. Double each pair and add: 48 plus 24 plus 16. Skipping the doubling, skipping a whole pair, or multiplying all three dimensions together (which finds a different quantity, not surface area) will each give a wrong total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-pencil-case',
      kind: 'try_yourself',
      problem:
        'Deshawn\'s pencil case is shaped like a triangular prism. Both triangular ends are right triangles with legs 3 inches and 4 inches, and a third side of 5 inches. The pencil case is 6 inches long. What is the total surface area of the pencil case, in square inches? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '84',
      hints: [
        'This pencil case has five faces total: two triangular ends and three rectangular sides. Find the area of each face, then add all five together.',
        'The two triangles each have area (3 times 4) divided by 2, which equals 6 square inches. The three rectangles are 6 by 3, 6 by 4, and 6 by 5 — do not forget the rectangle that wraps around the 5-inch side.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipped-pair-and-volume-mixup',
      kind: 'misconception_check',
      question:
        'One student is asked for the total surface area of a shoebox that is 10 inches long, 6 inches wide, and 4 inches tall. The student writes 10 times 6 times 4 equals 240 square inches. A second student, working on the same shoebox, adds 60 plus 40 plus 24 to get 124 square inches. What went wrong in each case?',
      commonErrors: [
        {
          answer: '240 square inches',
          misconception: 'Multiplying all three dimensions together, which finds volume, a different quantity, instead of adding up the face areas shown in the net.',
          correctsTo:
            'Surface area comes from the box\'s net: six rectangles with areas 60, 60, 40, 40, 24, and 24 square inches (one pair for top and bottom, one pair for front and back, one pair for the two ends). Adding those six gives 248 square inches, not 240. Volume is a different quantity, covered in another lesson, and multiplying the three dimensions together never answers a surface-area question.',
        },
        {
          answer: '124 square inches',
          misconception: 'Adding each pair of matching faces only once instead of twice, so three of the box\'s six faces are left out of the total.',
          correctsTo:
            'A rectangular prism\'s six faces come in three matching pairs, and every face counts, including its match. Double each pair before adding: 60 plus 60 plus 40 plus 40 plus 24 plus 24 equals 248 square inches, not 124.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A net is a flat pattern that folds into a solid; every face of the solid appears once in the net, still attached to a neighbor along a shared edge of matching length.',
        'Surface area is the total area of every face on the outside of a solid: build the net, find each face\'s area, then add every face together.',
        'A rectangular prism\'s net is six rectangles in three matching pairs: top/bottom, front/back, and end/end.',
        'A triangular prism\'s net is two triangles plus three rectangles, one rectangle wrapping each side of the triangle, including the slanted side.',
        'Use the rectangle and triangle area formulas exactly as learned before; this lesson does not re-derive them.',
        'Count the faces before adding, and double every matching pair — a skipped face or an un-doubled pair is the most common way to get surface area wrong.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Nets & Surface Area' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
