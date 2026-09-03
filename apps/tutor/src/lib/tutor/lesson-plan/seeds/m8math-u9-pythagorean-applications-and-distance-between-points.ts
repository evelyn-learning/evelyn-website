/**
 * Grade 8 Math — Angles & the Pythagorean Theorem: Pythagorean Applications
 * & Distance Between Points.
 *
 * PROCEDURE-LED row 9.4. The student arrives owning a² + b² = c² from row
 * 9.3, used on triangles drawn on paper; what is new is that the right
 * triangle is now HIDDEN inside a situation and has to be found before the
 * theorem can be used (CCSS 8.G.B.7, 8.G.B.8). The concept segment is an
 * ordered recipe: find the right angle, name the hypotenuse and the legs,
 * decide whether the missing side is the hypotenuse (add the squares) or a
 * leg (subtract the squares), take the root, then sanity-check that the
 * hypotenuse is longer than either leg and shorter than the two legs added.
 * The same recipe runs in three settings — a ladder against a wall and a
 * screen diagonal (2-D), a box's space diagonal found through TWO right
 * triangles in a row (3-D), and the distance between two points on the
 * coordinate plane, found by drawing the right triangle whose legs are the
 * horizontal change Δx and the vertical change Δy. Two traps this plan is
 * built to kill: adding the squares when the missing side is a leg (the
 * ladder comes out shorter than the wall it leans on), and letting the root
 * distribute (√(36 + 64) read as 6 + 8), which is the same slip as walking
 * along the grid instead of straight across it.
 *
 * SCOPE GUARD: Apply the theorem in real-world 2-D problems (ladder against
 * a wall, TV diagonal), in 3-D (a box's space diagonal via two right
 * triangles), and to find the distance between two points on the coordinate
 * plane by drawing the right triangle with legs Δx and Δy; extends `m6math`
 * row 6.3 (distance between points sharing a coordinate). Withholds: the
 * named distance formula and midpoint → `geom-u1-segments-distance-midpoint.ts`.
 * Concretely: every coordinate-plane distance in this plan is found by
 * drawing the right triangle, naming its two legs as the horizontal change
 * and the vertical change, and then using a² + b² = c²; the plan never
 * writes a one-line formula in x₁, x₂, y₁, y₂ and never names or computes a
 * midpoint. Sideways: the theorem itself, its area proof, and its converse
 * (deciding whether three lengths make a right triangle) are row 9.3, which
 * this row assumes and recalls in a sentence, never re-teaches or assesses.
 * Above, withheld: no acute/obtuse classification from a² + b² versus c²,
 * no special right triangles, no trigonometric ratios (`geom-u7-*`); no
 * simplifying of a radical — a root that is not a perfect square (√52, √18)
 * is trapped between whole numbers and estimated to one decimal place the
 * way row 1.4 taught, and is never rewritten in a shorter radical form
 * (`alg1-u9-simplifying-radicals.ts`). Below, assumed and not re-taught:
 * finding a hypotenuse or a leg (row 9.3), estimating a square root (row
 * 1.4), and the distance between two points that share an x- or a
 * y-coordinate (`m6math` row 6.3), which is recalled only as the case where
 * no triangle is needed and is never taught or assessed. Negative coordinates DO appear, because
 * finding a horizontal leg from x = -2 to x = 4 is exactly where the sign is
 * dropped; every leg in this plan is a positive length, and every distance
 * is either a whole number or a one-decimal-place estimate.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U9_PYTHAGOREAN_APPLICATIONS_AND_DISTANCE_BETWEEN_POINTS: LessonPlan = {
  id: 'evelyn.ms.m8math.pythagorean-applications-and-distance-between-points.v1',
  title: 'Pythagorean Applications & Distance Between Points',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.pythagorean-applications-and-distance-between-points',
      standard: 'M8MATH-9.4',
      description:
        "Apply the Pythagorean theorem in real-world 2-D problems (ladder against a wall, TV diagonal), in 3-D (a box's space diagonal via two right triangles), and to find the distance between two points on the coordinate plane by drawing the right triangle with legs Δx and Δy (CCSS 8.G.B.7, 8.G.B.8).",
    },
  ],
  prerequisites: ['m8math.the-pythagorean-theorem-and-its-converse'],
  followUps: ['m8math.scatter-plots-and-association'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a right triangle hiding inside an everyday object, so the student sees that the hard part of an application is finding the triangle, not using the theorem.',
      script:
        'The box for a tablet says the screen is 10 inches. You put a ruler across it, left edge to right edge, and get 8 inches. Top to bottom is 6 inches. Nobody lied. Screens are measured corner to corner, and that corner-to-corner line is the longest side of a right triangle whose legs are the width and the height, because the width and the height meet at a right angle in the corner. Check it: 8² + 6² = 64 + 36 = 100, and √100 = 10. Last lesson you proved a² + b² = c² and used it on triangles drawn on paper. Today the triangle is hiding: inside a screen, along a ladder, through the inside of a shipping box, and between two points on a map. Your first job every time is the same: find the right angle.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-find-the-triangle',
      kind: 'concept',
      goal: 'Install the find-the-right-angle recipe, the hypotenuse-or-leg decision, the two-triangle move for a box, and the horizontal-and-vertical legs that turn two points into a right triangle.',
      keyIdeas: [
        'FIND THE RIGHT ANGLE FIRST — every application starts by locating the 90° corner. A wall meets the ground at a right angle, a screen\'s width meets its height at a right angle, and the horizontal and vertical directions on a coordinate plane meet at a right angle. Once you have the right angle, the side across from it is the hypotenuse, the other two sides are the legs, and a² + b² = c² is ready to use. The theorem only works when c is the hypotenuse, so name the sides before you square anything.',
        'HYPOTENUSE MISSING: ADD. LEG MISSING: SUBTRACT — if the unknown side is the hypotenuse, add the two squares and take the root: a screen 8 wide and 6 tall has a diagonal of √(64 + 36) = 10. If the unknown side is a leg, subtract the smaller square from the hypotenuse squared and take the root: a 13-foot ladder with its foot 5 feet from the wall reaches √(169 - 25) = √144 = 12 feet up. The ladder is the hypotenuse because it is the slanted side across from the right angle where the wall meets the ground.',
        'A BOX NEEDS TWO RIGHT TRIANGLES — the space diagonal of a box runs from a bottom corner to the opposite top corner, through the inside, and it does not lie in any face. First triangle: the bottom face, whose length and width are the legs and whose diagonal is the hypotenuse. Second triangle: that bottom diagonal and the height are the legs, and the space diagonal is the hypotenuse. Keep the bottom diagonal SQUARED between the two steps; if it is 25, carry the 25, and you never take a root only to square it again.',
        'TWO POINTS MAKE A RIGHT TRIANGLE — two points that share an x-coordinate or a y-coordinate are a straight count apart, which you already know. Two points that share neither need a triangle: from the first point go straight across, then straight up or down to the second point. The corner where across meets up is the right angle. The horizontal leg is Δx, the change in x, found by subtracting the x-coordinates; the vertical leg is Δy, the change in y, found by subtracting the y-coordinates; and the straight-line distance between the points is the hypotenuse.',
        'LEGS ARE LENGTHS, SO THEY ARE NEVER NEGATIVE — from (-2, 1) to (4, 5), the horizontal leg is 4 - (-2) = 6, not 4 - 2 = 2, because subtracting a negative reaches all the way across the y-axis. If a subtraction comes out negative, the leg is the positive version, since squaring erases the sign anyway. Count the squares on the grid whenever you can and let the count and the subtraction agree.',
        'MOST DISTANCES ARE NOT WHOLE NUMBERS — real legs rarely give a perfect square, so finish with the estimate you already own: trap the root between two consecutive whole numbers, then test one decimal place. √45 sits between 6 and 7 because 36 < 45 < 49; 6.7² = 44.89 and 6.8² = 46.24, so √45 ≈ 6.7. Then sanity-check: the hypotenuse must be longer than either leg and shorter than the two legs added together. An answer outside that window has a slip in it.',
      ],
      vocabulary: [
        { term: 'hypotenuse', definition: 'the side across from the right angle, always the longest side of a right triangle; the c in a² + b² = c².' },
        { term: 'leg', definition: 'either of the two sides that meet at the right angle; the a and the b in a² + b² = c².' },
        { term: 'space diagonal', definition: 'the segment from one corner of a box to the opposite corner, passing through the inside of the box rather than along any face.' },
        { term: 'Δx and Δy', definition: 'the horizontal change and the vertical change between two points, found by subtracting the x-coordinates and the y-coordinates; they are the two legs of the right triangle that joins the points.' },
      ],
      suggestedTools: ['show_diagram', 'show_coordinate_plane', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ladder-and-box',
      kind: 'worked_example',
      problem:
        '(a) A 13-foot ladder leans against a wall with its foot 5 feet from the base of the wall. How high up the wall does the ladder reach? (b) A box is 3 inches wide, 4 inches deep, and 12 inches tall. Will a 12.5-inch drumstick fit inside it?',
      steps: [
        '(a) Find the right angle: the wall meets the ground at 90°. The ladder is the slanted side across from that corner, so the ladder is the hypotenuse, c = 13. The 5 feet along the ground is a leg, and the height up the wall is the other leg, the one we want.',
        'WRONG: 5² + 13² = 25 + 169 = 194, so the height is √194, about 13.9 feet. That answer is taller than the ladder itself, which cannot happen, because the hypotenuse is always the longest side. Adding is for a missing hypotenuse. CORRECT: the missing side is a leg, so subtract: 13² - 5² = 169 - 25 = 144, and √144 = 12. The ladder reaches 12 feet up the wall.',
        'Check by working backward: 5² + 12² = 25 + 144 = 169 = 13². The three sides fit the theorem, and 12 is shorter than 13 and longer than 5, as a leg should be.',
        '(b) No edge of the box is 12.5 inches long, so the drumstick can only fit along the space diagonal, from a bottom corner to the opposite top corner. That needs two right triangles.',
        'First triangle, the bottom face: legs 3 and 4, so the bottom diagonal squared is 3² + 4² = 9 + 16 = 25. Keep it as 25 for now.',
        'Second triangle: the bottom diagonal and the 12-inch height meet at a right angle, so they are the legs and the space diagonal is the hypotenuse. c² = 25 + 12² = 25 + 144 = 169, and √169 = 13. The space diagonal is 13 inches.',
        'Answer the question: 13 inches is longer than 12.5 inches, so the drumstick fits, but only laid corner to opposite corner. Check: 13 is longer than the 12-inch height and the 5-inch bottom diagonal, and shorter than 5 + 12 = 17, so it sits in the right window. Starting with a different face gives the same result: 12² + 4² = 160, then 160 + 3² = 169.',
      ],
      answer: '(a) 12 feet; (b) yes, the space diagonal is 13 inches, so the 12.5-inch drumstick fits',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-distance-on-the-map',
      kind: 'worked_example',
      problem:
        'On a map of the skate park, each grid unit is 1 meter. The ramp is at (-2, 1) and the rail is at (4, 5). How far apart are the ramp and the rail in a straight line?',
      steps: [
        'The two points share neither an x-coordinate nor a y-coordinate, so there is no straight count. Draw the right triangle: from the ramp at (-2, 1) go straight across to (4, 1), then straight up to the rail at (4, 5). The corner at (4, 1) is the right angle, and the straight line from ramp to rail is the hypotenuse.',
        'Horizontal leg, the change in x: 4 - (-2) = 6. Count it on the grid: from x = -2 to x = 4 is 6 squares, so the subtraction and the count agree. Vertical leg, the change in y: 5 - 1 = 4.',
        'Use the theorem with the legs 6 and 4: c² = 6² + 4² = 36 + 16 = 52.',
        'WRONG: 6 + 4 = 10 meters, walking across and then up along the grid lines. CORRECT: the straight line is the hypotenuse, which is shorter than the two legs added together; the distance is √52, not 6 + 4, because a square root never splits across a plus sign.',
        '52 is not a perfect square. Trap it: 7² = 49 and 8² = 64, so √52 is between 7 and 8, and closer to 7. Test one decimal place: 7.2² = 51.84 and 7.3² = 53.29, and 52 is much closer to 51.84, so √52 ≈ 7.2.',
        'Check: 7.2 is longer than the longer leg, 6, and shorter than 6 + 4 = 10, so it sits in the window a hypotenuse must land in. Putting the corner at (-2, 5) instead of (4, 1) gives the same two legs and the same answer.',
      ],
      answer: 'About 7.2 meters (√52, which is between 7 and 8)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-park-diagonal',
      kind: 'try_yourself',
      problem:
        'A rectangular park is 120 meters long and 50 meters wide. A path runs straight from one corner of the park to the opposite corner. How long is the path?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '170 m' },
        { id: 'b', text: '130 m', correct: true },
        { id: 'c', text: 'about 109 m' },
        { id: 'd', text: '16,900 m' },
      ],
      expectedAnswer: '130 m',
      hints: [
        'The length and the width meet at a right angle in the corner, so they are the legs and the diagonal path is the hypotenuse. A missing hypotenuse means add the squares.',
        '120² + 50² = 14,400 + 2,500. Add, then take the square root of the total. The path must come out shorter than 120 + 50 = 170 and longer than 120.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-distance-between-points',
      kind: 'try_yourself',
      problem: 'On a coordinate grid, point P is at (-2, 3) and point Q is at (4, 11). What is the distance between P and Q?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '14 units' },
        { id: 'b', text: 'about 8.2 units' },
        { id: 'c', text: '100 units' },
        { id: 'd', text: '10 units', correct: true },
      ],
      expectedAnswer: '10 units',
      hints: [
        'Draw the right triangle. The horizontal leg runs from x = -2 to x = 4, so subtract 4 - (-2) and count the squares to be sure. The vertical leg runs from y = 3 to y = 11.',
        'The legs are 6 and 8. Square each, add the squares, and take the root of the total. Your distance must be longer than 8 and shorter than 6 + 8 = 14.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-space-diagonal',
      kind: 'try_yourself',
      problem:
        'A shipping box is 2 feet long, 3 feet wide, and 6 feet tall. What is the distance, in feet, from one bottom corner of the box to the opposite top corner? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Two right triangles. First, the bottom face: its legs are 2 and 3, so the bottom diagonal squared is 2² + 3² = 13. Keep the 13; do not take its root yet.',
        'Second triangle: the bottom diagonal and the 6-foot height are the legs, so the space diagonal squared is 13 + 6² = 13 + 36. Take the square root of that total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diagonal-count-and-split-root',
      kind: 'misconception_check',
      question:
        'Devon and Lena both find the distance between (1, 1) and (4, 4) on a grid. Devon counts the three diagonal squares between the points and says the distance is 3. Lena writes √(3² + 3²) = 3 + 3 and says the distance is 6. What went wrong in each case?',
      commonErrors: [
        {
          answer: '3',
          misconception: 'Counting diagonal grid squares as if the diagonal of a unit square were 1 unit long, when it is the hypotenuse of a 1-by-1 right triangle and is longer than 1.',
          correctsTo:
            'Draw the right triangle: across from (1, 1) to (4, 1) is a leg of 3, and up from (4, 1) to (4, 4) is a leg of 3. Then c² = 3² + 3² = 9 + 9 = 18. Since 4² = 16 and 5² = 25, √18 is between 4 and 5; 4.2² = 17.64 and 4.3² = 18.49, so √18 ≈ 4.2. The distance is about 4.2 units, longer than the 3 Devon counted, because each diagonal step across a square is longer than the square\'s side.',
        },
        {
          answer: '6',
          misconception: 'Splitting the square root across the plus sign, so √(9 + 9) is read as √9 + √9 = 3 + 3, which is the same as adding the two legs.',
          correctsTo:
            'A square root never splits across a plus sign. Finish the addition under the root first: 9 + 9 = 18, and then √18 ≈ 4.2. The sanity check catches the slip on its own: a hypotenuse has to be shorter than the two legs added together, and 6 is exactly 3 + 3, which is the length of walking along the grid, not straight across it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Find the right angle first. The side across from it is the hypotenuse, the two sides that meet at it are the legs, and only then does a² + b² = c² apply.',
        'Missing hypotenuse: add the squares and take the root. Missing leg: subtract the smaller square from the hypotenuse squared and take the root. A ladder is a hypotenuse; how high it reaches is a leg.',
        'A box\'s space diagonal takes two right triangles: the bottom face gives the bottom diagonal squared, and that number plus the height squared gives the space diagonal squared.',
        'Two points on the coordinate plane make a right triangle: the horizontal leg is the change in x, the vertical leg is the change in y, and the distance is the hypotenuse. Subtracting a negative coordinate reaches across the axis, so 4 - (-2) = 6.',
        'When the root is not a perfect square, trap it between two whole numbers and test one decimal place, as with √52 ≈ 7.2.',
        'A square root never splits across a plus sign, and a hypotenuse is always longer than either leg and shorter than the two legs added together. Use that window to catch a slip.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.4', cedTitle: 'Pythagorean Applications & Distance Between Points' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
