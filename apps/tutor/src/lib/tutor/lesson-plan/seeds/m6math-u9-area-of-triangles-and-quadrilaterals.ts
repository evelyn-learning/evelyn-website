/**
 * Grade 6 Math — Area, Surface Area & Volume: Area of Triangles &
 * Quadrilaterals.
 *
 * PROCEDURE-LED exemplar shape, built around a method rather than a bare
 * formula (CCSS 6.G.A.1). A student who only memorizes "area of a triangle is
 * base times height divided by two" has missed the point of this standard:
 * the point is that ANY triangle or special quadrilateral can be found by
 * composing it into, or decomposing it into, rectangles and triangles whose
 * areas are already known. Both worked examples therefore do the cutting or
 * the rearranging FIRST, in words, before any formula is applied to the
 * pieces. Two traps this plan is built to kill: reaching for a formula before
 * identifying the pieces a shape is made of, and using a slanted side's
 * length as if it were the height.
 *
 * SCOPE GUARD: This lesson finds the area of triangles and special
 * quadrilaterals (parallelograms, trapezoids, and composite figures built
 * from them) by composing and decomposing the shape into rectangles and
 * triangles — the decomposition or composition move is the point of every
 * example, not a formula recalled from memory, so a worked example always
 * identifies the pieces before any area formula is applied to them. Every
 * shape here is described in words by its side lengths, bases, and
 * perpendicular heights; no shape is placed on a coordinate grid or given as
 * a set of vertex coordinates, and finding a side length from coordinates
 * does not appear here — that is row 9.2. No circle, no circumference, and no
 * radius or diameter appears anywhere in this lesson; circles are Grade 7.
 * Nothing here asks for volume, surface area, or the net of a
 * three-dimensional solid; those are rows 9.3 and 9.4. Grade-7-only
 * escalations such as angle relationships, scale drawings, and cross-sections
 * of solids do not appear either.
 *
 * NOTE ON prerequisites/followUps: the true chain for this row is
 * 8.4 (dependent-and-independent-variables) -> 9.1 (this row) ->
 * 9.2 (polygons-in-the-coordinate-plane), taken from the brief's authoritative
 * table rather than left empty, per the fan-out contract's chain rule.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U9_AREA_OF_TRIANGLES_AND_QUADRILATERALS: LessonPlan = {
  id: 'evelyn.ms.m6math.area-of-triangles-and-quadrilaterals.v1',
  title: 'Area of Triangles & Quadrilaterals',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.area-of-triangles-and-quadrilaterals',
      standard: 'M6MATH-9.1',
      description:
        'Find the area of triangles and special quadrilaterals by composing/decomposing into rectangles and triangles (CCSS 6.G.A.1).',
    },
  ],
  prerequisites: ['m6math.dependent-and-independent-variables'],
  followUps: ['m6math.polygons-in-the-coordinate-plane'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see that a hard shape is really just easy shapes pushed together, before any formula is named.',
      script:
        'Picture a slice of pizza. It is not a rectangle and it is not a square, so it does not feel like a shape you know how to measure. But look again: a triangle IS a shape you already understand how to build, because two matching triangles pushed together along their longest side make a rectangle. That is the whole idea behind today\'s lesson. A triangle, a parallelogram, or an odd-looking figure can almost always be cut apart or rearranged into rectangles and triangles you already know how to measure. Learn to see the cut, and the area follows.',
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-compose-and-decompose',
      kind: 'concept',
      goal: 'Install decomposing and composing as the method, derive both area rules from a rectangle, and lock in that height is always perpendicular to the base.',
      keyIdeas: [
        'AREA MEANS COVERING WITH SQUARES — the area of a flat shape is the number of same-size square units it takes to cover the shape completely, with no gaps and no overlaps. For a rectangle, that count is length times width, which can also be written base times height.',
        'A DIAGONAL DECOMPOSES A RECTANGLE INTO TWO TRIANGLES — draw one diagonal line across a rectangle, from one corner to the opposite corner. That single cut splits the rectangle into two matching triangles, and each triangle is exactly half of the rectangle. That gives the triangle rule: area of a triangle equals base times height, divided by two, where the height is measured straight across, perpendicular to the base, from the base to the corner directly opposite it.',
        'COMPOSING A PARALLELOGRAM INTO A RECTANGLE — cut a right triangle off one end of a parallelogram, slicing straight down from a corner so the cut is perpendicular to the base, and slide that triangle to the other end. The two pieces fit together with no gaps and no overlaps and form a rectangle with the same base and the same height the parallelogram started with. Composing and decomposing never change the total area, so a parallelogram\'s area is also base times height.',
        'HEIGHT IS ALWAYS PERPENDICULAR TO THE BASE — the height of a triangle or a parallelogram is the straight up-and-down distance between the base and the point or side directly across from it. It is never the length of a slanted side. A slanted side is almost always a different number from the height, and multiplying by the slanted side instead of the height gives a wrong area.',
        'DECOMPOSE A HARD SHAPE INTO PIECES YOU ALREADY KNOW — a trapezoid or an odd composite figure can usually be split into a rectangle and one or two triangles, or found by starting with one big rectangle and subtracting a triangular piece that does not belong. Find the area of every piece on its own using the rules above, then add the pieces together, or subtract a removed piece from the whole.',
        'COMPOSE AND DECOMPOSE ARE THE SAME IDEA IN OPPOSITE DIRECTIONS — decomposing means cutting one shape into smaller pieces that are easy to measure. Composing means rearranging pieces into one shape that is easy to measure. Either direction is allowed to change how the shape looks, but neither one ever changes the total area, which is why both directions land on the same correct answer.',
      ],
      vocabulary: [
        { term: 'base', definition: 'one side of a triangle or a parallelogram, chosen as the side the height is measured from; any side can be the base, as long as the height matches that same choice.' },
        { term: 'height', definition: 'the straight up-and-down distance from the base to the point or side directly across from it, measured perpendicular to the base, never along a slanted side.' },
        { term: 'decompose', definition: 'to cut a shape into smaller pieces, such as rectangles and triangles, so the area of each piece can be found on its own.' },
        { term: 'compose', definition: 'to rearrange or fit pieces together into one shape whose area is easier to find, such as sliding a cut triangle to turn a parallelogram into a rectangle.' },
      ],
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-birthday-banner',
      kind: 'worked_example',
      problem:
        'Maria is cutting a banner for her sister\'s birthday party. Draw the banner like this: a bottom edge that is a straight horizontal line 9 inches long. From the left end of that bottom edge, draw a left edge straight up 4 inches. From the top of that left edge, draw a top edge going right for 5 inches. Finally, connect the end of the top edge back down to the right end of the bottom edge with one slanted line. The left edge is perpendicular to both the top and bottom edges, the top and bottom edges are parallel to each other, and only the right edge is slanted. What is the area of the banner, in square inches?',
      steps: [
        'Look for the cut before reaching for any formula. This banner is not a rectangle, because the top edge (5 inches) and the bottom edge (9 inches) are different lengths, and it is not a triangle either. But it is a rectangle and a triangle pushed together.',
        'Draw one more line: starting where the top edge ends (the top-right corner), draw a straight vertical line down to the bottom edge. Because the left edge is already vertical and this new line is also vertical, the piece on the left is a rectangle. The piece on the right, bounded by the new vertical line, the slanted edge, and part of the bottom edge, is a right triangle.',
        'Measure the rectangle piece: its width matches the top edge, 5 inches, and its height matches the left edge, 4 inches.',
        'Measure the triangle piece: its base is what is left of the bottom edge once the rectangle\'s 5 inches is removed, so 9 minus 5 equals 4 inches. Its height is the same 4 inches as the rectangle, because the new line and the left edge are both vertical and span the same distance between the top and bottom edges.',
        'Now the formulas can be used, one piece at a time. Rectangle area: 5 times 4 equals 20 square inches. Triangle area: 4 times 4 equals 16, divided by 2 equals 8 square inches.',
        'Add the pieces: 20 plus 8 equals 28 square inches.',
        'Check with a different cut. Imagine the whole banner sitting inside one big rectangle that is 9 inches wide and 4 inches tall: 9 times 4 equals 36 square inches. The banner is that big rectangle with the same right triangle sliced off one corner, which has area 8 square inches. Subtract: 36 minus 8 equals 28 square inches, matching the first method exactly.',
      ],
      answer: '28 square inches',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-class-trip-pennant',
      kind: 'worked_example',
      problem:
        'Room 6 is making a parallelogram-shaped pennant flag for the class trip. Draw two horizontal edges, a top edge and a bottom edge, each 14 inches long, one above the other but shifted sideways so the shape leans. Connect their ends with two slanted edges, each 10 inches long, both slanting in the same direction. The straight up-and-down distance between the top edge and the bottom edge is 6 inches. What is the area of the pennant, in square inches?',
      steps: [
        'Compose before reaching for a formula. Cut a right triangle off the left end of the pennant, slicing straight down from the top-left corner so the cut is perpendicular to the bottom edge. Slide that triangle to the right end of the shape.',
        'The two pieces now fit together with no gaps and no overlaps, and they form a rectangle. The rectangle\'s width is the same as the pennant\'s 14-inch edge, and its height is the same 6-inch straight up-and-down distance the pennant had.',
        'WRONG: multiplying the base by the 10-inch slanted edge, 14 times 10 equals 140 square inches. CORRECT: the height is the straight up-and-down distance between the two parallel edges, which is 6 inches, not the length of the slanted edge. Use 14 times 6, which equals 84 square inches.',
        'Check with a second method. Draw one diagonal from a corner of the pennant to the opposite corner. That cut decomposes the pennant into two matching triangles, each with base 14 inches and height 6 inches. Each triangle\'s area is 14 times 6, divided by 2, which equals 42 square inches. Two of them together: 42 plus 42 equals 84 square inches, matching the first method.',
      ],
      answer: '84 square inches',
      estimatedMinutes: 3,
    },
    {
      id: 'try-choose-the-height',
      kind: 'try_yourself',
      problem:
        'A parallelogram-shaped sticker has a base of 8 centimeters. Its slanted side is 6 centimeters long. The straight up-and-down distance between its two parallel sides is 5 centimeters. Which measurement should be multiplied by the base to find the sticker\'s area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6 centimeters, the length of the slanted side' },
        { id: 'b', text: '8 centimeters, the same as the base' },
        { id: 'c', text: '5 centimeters, the perpendicular distance between the two parallel sides', correct: true },
        { id: 'd', text: '13 centimeters, the base plus the perpendicular distance added together' },
      ],
      expectedAnswer: '5 centimeters, the perpendicular distance between the two parallel sides',
      hints: [
        'The height of a parallelogram is not the length of a slanted side. It is the straight up-and-down distance between the two parallel sides.',
        'The base and the top edge across from it are the two parallel sides here. The straight up-and-down distance between them is 5 centimeters, so that is the height to multiply by the base.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-doghouse-door',
      kind: 'try_yourself',
      problem:
        'A doghouse door opening is shaped like a rectangle with a triangular roof sitting on top, like the outline of a little house. The rectangle part is 4 feet wide and 5 feet tall. The triangular roof shares the rectangle\'s full 4-foot-wide top edge as its own base, and it comes to a point 3 feet above that edge. What is the total area of the door opening, in square feet?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '26 square feet', correct: true },
        { id: 'b', text: '32 square feet' },
        { id: 'c', text: '20 square feet' },
        { id: 'd', text: '36 square feet' },
      ],
      expectedAnswer: '26 square feet',
      hints: [
        'Decompose the shape into the two pieces it is already made of: the rectangle and the triangular roof. Find each piece\'s area on its own, then add them.',
        'Rectangle: 4 times 5 equals 20 square feet. Roof: 4 times 3 equals 12, and a triangle is half of that, so 12 divided by 2 equals 6 square feet. Add: 20 plus 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-triangular-flag',
      kind: 'try_yourself',
      problem:
        'A triangular flag has a base of 14 centimeters and a height of 6 centimeters, measured perpendicular to the base. What is the area of the flag, in square centimeters? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '42',
      hints: [
        'A triangle\'s area is base times height, divided by 2.',
        '14 times 6 equals 84. Now divide by 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slant-height-and-forgotten-piece',
      kind: 'misconception_check',
      question:
        'One student finds the area of a parallelogram-shaped sticker with base 8 centimeters, slanted side 5 centimeters, and perpendicular height 4 centimeters, and multiplies 8 times 5 to get 40 square centimeters. Another student decomposes an L-shaped garden plot into a 6-by-3-foot rectangle and a 2-by-4-foot rectangle, then reports the area as 18 square feet. What went wrong in each case?',
      commonErrors: [
        {
          answer: '40 square centimeters',
          misconception: 'Using the slanted side\'s length as if it were the height, instead of measuring the perpendicular distance between the two parallel sides.',
          correctsTo:
            'The height of a parallelogram is always the straight up-and-down distance between its two parallel sides, never the length of a slanted side. Multiply the base by the perpendicular height instead: 8 times 4 equals 32 square centimeters.',
        },
        {
          answer: '18 square feet',
          misconception: 'After decomposing a shape into pieces, forgetting to add every piece\'s area together, and reporting only one piece as if it were the whole answer.',
          correctsTo:
            'Decomposing a shape into pieces only helps if every piece gets counted. The first rectangle is 6 times 3, which equals 18 square feet, and the second rectangle is 2 times 4, which equals 8 square feet. Add both pieces: 18 plus 8 equals 26 square feet, which is the total area of the garden plot.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Area is the number of same-size squares it takes to cover a shape, with no gaps and no overlaps.',
        'A diagonal decomposes a rectangle into two matching triangles, which is why a triangle\'s area is base times height, divided by 2.',
        'Cutting a triangle off one end of a parallelogram and sliding it to the other end composes it into a rectangle, which is why a parallelogram\'s area is also base times height.',
        'Height is always the straight up-and-down, perpendicular distance from the base to the point or side across from it, never the length of a slanted side.',
        'A hard shape can be decomposed into a rectangle and triangles you already know how to measure, or found by subtracting a piece from a bigger rectangle.',
        'When a shape is decomposed into pieces, every piece\'s area has to be added together to get the total.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Area of Triangles & Quadrilaterals' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
