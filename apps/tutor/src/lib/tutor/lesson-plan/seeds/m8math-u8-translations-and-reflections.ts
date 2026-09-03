/**
 * Grade 8 Math — Transformations, Congruence & Similarity: Translations &
 * Reflections.
 *
 * PROCEDURE-LED row 8.1. The student already knows how to flip a single
 * plotted point across an axis by changing the sign of one coordinate; what
 * is new is doing that, and the slide, to a WHOLE figure, and then checking
 * what the motion left alone (CCSS 8.G.A.1, 8.G.A.3). The concept segment is
 * a recipe: write the coordinate rule, apply it to every vertex, reconnect
 * the image vertices in the same order, then verify the three preserved
 * properties by counting on the grid: a line lands on a line, every side
 * keeps its length, every angle keeps its measure, and sides that were
 * parallel are still parallel. The first worked example slides a right
 * triangle and verifies the preserved list; the second flips a parallelogram
 * across the y-axis and verifies it again, with the parallel pair front and
 * center. Two traps this plan is built to kill: flipping the wrong
 * coordinate (across the x-axis it is y that changes sign, not x), and
 * believing that a figure whose coordinates all got bigger got bigger
 * itself.
 *
 * SCOPE GUARD: Translate and reflect whole figures on the coordinate plane
 * with coordinate rules ((x, y) -> (x + a, y + b); reflection across the
 * x-axis or the y-axis) and verify that lines map to lines, lengths and
 * angle measures are preserved, and parallel lines stay parallel. Extends
 * `m6math` row 6.2 (reflecting single points across the axes — assumed) to
 * figures plus the preserved-property list. Withholds: translation vectors,
 * reflection across y = x or other lines, orientation arguments ->
 * `geom-u4-translations.ts`, `geom-u4-reflections.ts`. Concretely, in the
 * body beneath this comment: every translation is written as a coordinate
 * rule or as "a units right/left and b units up/down", never as a vector;
 * every reflection is across the x-axis or the y-axis and no other line; no
 * step argues about clockwise or counterclockwise order of the vertices, and
 * the words "orientation", "vector", "symmetry", "rotation" and "dilation" do
 * not appear as things taught. Sideways: rotations are row 8.2, and this plan
 * never turns a figure; the word "congruent" never appears and no sequence
 * of two motions is ever applied, because deciding congruence from a
 * sequence of motions is row 8.3; nothing is scaled, because dilations are
 * row 8.4. Negative coordinates DO appear throughout, because a reflection
 * across an axis necessarily produces them and a translation may cross an
 * axis. Lengths are verified only for horizontal and vertical sides (by
 * counting grid units, `m6math` row 6.3, assumed) or by matching the
 * horizontal run and vertical rise of a slanted side before and after; the
 * length of a slanted side is never computed, because the Pythagorean
 * theorem is row 9.3. Angles are verified only as "a horizontal side meeting
 * a vertical side is still a right angle" or "the same run and rise means
 * the same tilt"; no angle is measured in degrees. Salvaged from
 * `g8-math-transformations.ts`: the slide/flip vocabulary and the three
 * coordinate rules only; its four-transformations-in-one-lesson shape was
 * deliberately left behind.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U8_TRANSLATIONS_AND_REFLECTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.translations-and-reflections.v1',
  title: 'Translations & Reflections',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.translations-and-reflections',
      standard: 'M8MATH-8.1',
      description:
        'Translate and reflect whole figures on the coordinate plane with coordinate rules ((x, y) → (x + a, y + b); reflection across the x-axis or the y-axis) and verify that lines map to lines, lengths and angle measures are preserved, and parallel lines stay parallel (CCSS 8.G.A.1, 8.G.A.3).',
    },
  ],
  prerequisites: ['m8math.describing-and-sketching-qualitative-graphs'],
  followUps: ['m8math.rotations-about-the-origin'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a whole figure, not a single point, in front of the student and make the slide and the flip feel like two different jobs before either rule is written.',
      script:
        'Sam is building a level in a phone game, and the level editor is a coordinate grid. A triangle-shaped platform sits near the left edge, and the level needs two copies of it: one slid 6 units to the right so the player can jump between them, and one flipped across the y-axis so the right half of the level mirrors the left half. Sam could drag each corner by hand and hope the copies come out the same size, or Sam could write one rule for the corners and let it do the moving. You already know how to flip one point across an axis by changing the sign of a coordinate. Today that becomes a rule for every corner of a figure, and then we check what a slide or a flip cannot change: how long the sides are, how wide the angles are, and which sides run parallel.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules-and-preserved-properties',
      kind: 'concept',
      goal: 'Install the three coordinate rules, the apply-to-every-vertex-then-reconnect recipe, and the grid checks that show what a slide or a flip leaves unchanged.',
      keyIdeas: [
        'A TRANSLATION IS A SLIDE, AND ITS RULE IS AN ADDITION — every point of the figure moves the same distance in the same direction, so one rule covers all of them: (x, y) → (x + a, y + b). Moving right adds to x and moving left subtracts from it; moving up adds to y and moving down subtracts from it. A slide of 3 units right and 2 units down is the rule (x, y) → (x + 3, y - 2), so the point (1, 5) lands on (4, 3).',
        'A REFLECTION IS A FLIP, AND ITS RULE IS A SIGN CHANGE — the axis is the mirror, and the one coordinate that measures distance from that mirror changes sign. Across the x-axis: (x, y) → (x, -y), so (4, 3) lands on (4, -3). Across the y-axis: (x, y) → (-x, y), so (4, 3) lands on (-4, 3). This is the same sign change you used on single points; the only new thing is doing it to every corner of a figure.',
        'MOVE THE VERTICES, THEN RECONNECT — a figure is its vertices plus the straight sides joining them. Apply the rule to every vertex, mark each image vertex with a prime (A becomes A\'), then join the image vertices in the same order the original was joined. You never move a middle point of a side, because a line always lands on a line: the image of side AB is the straight segment from A\' to B\', and any point on AB lands somewhere on that segment.',
        'LENGTHS ARE PRESERVED, AND YOU CAN COUNT TO CHECK — a slide moves the figure and a flip turns it over, but neither one stretches it. Check a horizontal or vertical side by counting grid units before and after: if AB runs from x = 1 to x = 5, it is 4 units long, and A\'B\' will be 4 units long too. Check a slanted side by its run and rise: if BC goes 4 units left and 3 units up, then B\'C\' goes 4 units and 3 units as well, so it has the same length and the same tilt.',
        'ANGLES AND PARALLEL SIDES ARE PRESERVED TOO — if two sides met at a right angle before the motion, they meet at a right angle after it; a horizontal side meeting a vertical side is still horizontal meeting vertical. If two sides of the figure were parallel, running in the same direction, their images run in the same direction too, so they are still parallel. Because every side keeps its length and every angle keeps its measure, the image is the same size and the same shape as the original; it has only changed position, or been turned over.',
      ],
      vocabulary: [
        { term: 'translation', definition: 'a slide: every point of the figure moves the same distance in the same direction, by the rule (x, y) → (x + a, y + b).' },
        { term: 'reflection', definition: 'a flip across a line; across the x-axis, y changes sign, and across the y-axis, x changes sign.' },
        { term: 'preimage', definition: 'the original figure, before the motion.' },
        { term: 'image', definition: 'the figure after the motion; its vertices are named with a prime, so A\' is the image of A.' },
        { term: 'preserved', definition: 'unchanged by the motion; lengths, angle measures, and parallel sides are preserved by a slide or a flip.' },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_geometry'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-translate-triangle',
      kind: 'worked_example',
      problem:
        'Triangle ABC has vertices A(1, 2), B(5, 2), and C(1, 5). Translate it 3 units right and 4 units down. Give the image vertices, and verify that a line maps to a line, that the side lengths are preserved, and that the right angle at A is preserved.',
      steps: [
        'Write the rule. Right 3 adds 3 to x, and down 4 subtracts 4 from y: (x, y) → (x + 3, y - 4).',
        'Apply the rule to every vertex. A(1, 2) → A\'(1 + 3, 2 - 4) = A\'(4, -2). B(5, 2) → B\'(5 + 3, 2 - 4) = B\'(8, -2). C(1, 5) → C\'(1 + 3, 5 - 4) = C\'(4, 1). Join A\' to B\', B\' to C\', and C\' to A\', in the same order as the original.',
        'Verify a line maps to a line. Every point on side AB has y = 2, and the rule turns y = 2 into y = -2, so every point of AB lands on the horizontal line through A\'(4, -2) and B\'(8, -2). Try a point on the slanted side too: the point (3, 3.5), halfway along BC, maps to (6, -0.5), and that is exactly halfway between B\'(8, -2) and C\'(4, 1), because (8 + 4) ÷ 2 = 6 and (-2 + 1) ÷ 2 = -0.5.',
        'Verify lengths. AB runs from x = 1 to x = 5, so it is 5 - 1 = 4 units long; A\'B\' runs from x = 4 to x = 8, so it is 8 - 4 = 4 units long. AC runs from y = 2 to y = 5, so it is 3 units long; A\'C\' runs from y = -2 to y = 1, so it is 1 - (-2) = 3 units long. The slanted side BC goes 4 units left and 3 units up from B to C, and B\'C\' goes 4 units left and 3 units up from B\'(8, -2) to C\'(4, 1), so it has the same length and the same tilt.',
        'Verify the angle. At A, the horizontal side AB meets the vertical side AC, which is a right angle. At A\', the horizontal side A\'B\' meets the vertical side A\'C\', which is still a right angle. The image is the same size and shape as the original, just 3 units right and 4 units down.',
        'Check by working backward: slide the image 3 units left and 4 units up with the rule (x, y) → (x - 3, y + 4). A\'(4, -2) → (1, 2) = A, B\'(8, -2) → (5, 2) = B, C\'(4, 1) → (1, 5) = C. The original comes back, so the image is right.',
      ],
      answer: 'A\'(4, -2), B\'(8, -2), C\'(4, 1); AB and A\'B\' are both 4 units, AC and A\'C\' are both 3 units, and the right angle at A is still a right angle at A\'',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reflect-parallelogram',
      kind: 'worked_example',
      problem:
        'Parallelogram PQRS has vertices P(2, 1), Q(6, 1), R(7, 4), and S(3, 4). Reflect it across the y-axis. Give the image vertices, and verify that the side lengths are preserved and that the two pairs of parallel sides are still parallel.',
      steps: [
        'Write the rule. The y-axis is the mirror, and x measures the distance from the y-axis, so x changes sign: (x, y) → (-x, y).',
        'WRONG: writing P\'(2, -1) by changing the sign of y. CORRECT: that is the rule for the x-axis. Across the y-axis, y stays and x flips. P is 2 units to the right of the y-axis, so its mirror image is 2 units to the left: P\'(-2, 1).',
        'Apply the rule to every vertex. P(2, 1) → P\'(-2, 1). Q(6, 1) → Q\'(-6, 1). R(7, 4) → R\'(-7, 4). S(3, 4) → S\'(-3, 4). Join P\' to Q\', Q\' to R\', R\' to S\', and S\' to P\'.',
        'Verify lengths. PQ runs from x = 2 to x = 6, so it is 6 - 2 = 4 units long; P\'Q\' runs from x = -6 to x = -2, so it is -2 - (-6) = 4 units long. SR runs from x = 3 to x = 7, which is 4 units; S\'R\' runs from x = -7 to x = -3, which is -3 - (-7) = 4 units. The slanted side PS goes 1 unit right and 3 units up from P to S; P\'S\' goes 1 unit left and 3 units up from P\'(-2, 1) to S\'(-3, 4), so it covers the same run and rise and has the same length.',
        'Verify the parallel pairs. PQ and SR are both horizontal, so they are parallel; P\'Q\' and S\'R\' both have y = 1 and y = 4 across their whole length, so both are still horizontal and still parallel. PS goes 1 right and 3 up, and QR goes from (6, 1) to (7, 4), also 1 right and 3 up, so PS and QR are parallel. In the image, P\'S\' goes 1 left and 3 up, and Q\'R\' goes from (-6, 1) to (-7, 4), also 1 left and 3 up. The flip turned both of them the same way, so they still run in the same direction as each other and are still parallel.',
        'Check by working backward: reflecting the image across the y-axis again uses the same rule, (x, y) → (-x, y). P\'(-2, 1) → (2, 1) = P, Q\'(-6, 1) → (6, 1) = Q, R\'(-7, 4) → (7, 4) = R, S\'(-3, 4) → (3, 4) = S. Flipping twice brings the original back, so the image is right.',
      ],
      answer: 'P\'(-2, 1), Q\'(-6, 1), R\'(-7, 4), S\'(-3, 4); every side keeps its length, P\'Q\' is still parallel to S\'R\', and P\'S\' is still parallel to Q\'R\'',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translate-vertex',
      kind: 'try_yourself',
      problem: 'Triangle DEF has vertices D(-3, 4), E(1, 4), and F(-3, 1). It is translated by the rule (x, y) → (x + 5, y - 2). What are the coordinates of E\', the image of E?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-1, 9)' },
        { id: 'b', text: '(6, 2)', correct: true },
        { id: 'c', text: '(-4, 6)' },
        { id: 'd', text: '(6, 6)' },
      ],
      expectedAnswer: '(6, 2)',
      hints: [
        'The rule tells you what happens to each coordinate separately: x gets 5 added, and y gets 2 subtracted. Start from E(1, 4), not from D.',
        'Compute 1 + 5 for the new x and 4 - 2 for the new y. Keep the minus sign on the 2: the figure slides down, so the y-coordinate gets smaller.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reflect-rectangle-property',
      kind: 'try_yourself',
      problem: 'Rectangle KLMN has vertices K(1, 1), L(5, 1), M(5, 3), and N(1, 3). It is reflected across the x-axis. Which statement about the image is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'M\' is at (-5, 3), and K\'L\' is still 4 units long' },
        { id: 'b', text: 'M\' is at (5, -3), but the angle at M\' is no longer a right angle because the rectangle was flipped over' },
        { id: 'c', text: 'M\' is at (-5, -3), and K\'L\' is still 4 units long and parallel to N\'M\'' },
        { id: 'd', text: 'M\' is at (5, -3), and K\'L\' is still 4 units long and parallel to N\'M\'', correct: true },
      ],
      expectedAnswer: 'M\' is at (5, -3), and K\'L\' is still 4 units long and parallel to N\'M\'',
      hints: [
        'The x-axis is the mirror, so the coordinate that changes sign is y, not x. Find M\' first, then decide what the flip did to the sides and the angles.',
        'Exactly one coordinate changes sign, and a flip does not stretch a figure or bend its corners. K\'L\' runs from (1, -1) to (5, -1): count its length, notice it is still horizontal, and compare it with N\'M\' from (1, -3) to (5, -3).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-preserved-length',
      kind: 'try_yourself',
      problem:
        'Triangle ABC has vertices A(-2, 3), B(4, 3), and C(1, 7). It is translated by the rule (x, y) → (x - 3, y - 6). How many units long is A\'B\', the image of side AB? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Apply the rule to A and to B: subtract 3 from each x-coordinate and 6 from each y-coordinate. Both image points will share the same y-coordinate, so A\'B\' is horizontal.',
        'A\' is at (-5, -3) and B\' is at (1, -3). Count the units from x = -5 to x = 1, or compute 1 - (-5). It should match the length of AB, because a slide preserves length.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-axis-and-bigger-figure',
      kind: 'misconception_check',
      question:
        'Two students work on the triangle with vertices (3, 5), (7, 5), and (3, 8). Ana reflects it across the x-axis and writes the image of (3, 5) as (-3, 5). Leo translates it by the rule (x, y) → (x + 4, y + 4) and says the image triangle is bigger than the original, because every coordinate got bigger. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The image of (3, 5) across the x-axis is (-3, 5).',
          misconception: 'Changing the sign of x when reflecting across the x-axis, when the coordinate that changes is the one measuring distance from the mirror, which is y.',
          correctsTo:
            'The x-axis is the mirror, and (3, 5) sits 5 units above it, so its image sits 5 units below it at (3, -5). The x-coordinate does not change, because the point does not move left or right. The full image is (3, -5), (7, -5), and (3, -8), directly below the original. Changing the sign of x is the rule for the y-axis, and it would have sent the triangle to the left instead of downward.',
        },
        {
          answer: 'The translated triangle is bigger than the original.',
          misconception: 'Believing that a figure grows when its coordinates grow, when a translation moves every vertex by the same amount and leaves every distance between vertices unchanged.',
          correctsTo:
            'The image vertices are (7, 9), (11, 9), and (7, 12). The original side from (3, 5) to (7, 5) is 7 - 3 = 4 units long, and its image from (7, 9) to (11, 9) is 11 - 7 = 4 units long. The vertical side went from 8 - 5 = 3 units to 12 - 9 = 3 units. Every side has the same length, every angle has the same measure, and the triangle is the same size; it has only slid 4 units right and 4 units up, farther from the origin.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A translation is a slide with the rule (x, y) → (x + a, y + b): right or left changes x, up or down changes y, and every vertex moves by the same amounts.',
        'A reflection is a flip across an axis, and the coordinate that changes sign is the one measuring distance from the mirror: across the x-axis, (x, y) → (x, -y); across the y-axis, (x, y) → (-x, y).',
        'Apply the rule to every vertex, then join the image vertices in the same order; a line always lands on a line, so the image of a side is the straight segment between the image vertices.',
        'Lengths and angle measures are preserved: count a horizontal or vertical side before and after, or match the run and rise of a slanted side, and a right angle stays a right angle.',
        'Parallel sides stay parallel: two sides that ran in the same direction before the motion run in the same direction after it.',
        'Check by working backward: slide the image back or flip it across the same axis again, and the original figure must reappear.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Translations & Reflections' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
