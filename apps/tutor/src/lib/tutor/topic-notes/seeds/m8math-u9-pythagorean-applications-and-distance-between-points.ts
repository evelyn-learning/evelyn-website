/**
 * Grade 8 Math — Unit 9 CED 9.4: Pythagorean Applications & Distance Between Points.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.pythagorean-applications-and-distance-between-points.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U9_PYTHAGOREAN_APPLICATIONS_AND_DISTANCE_BETWEEN_POINTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.pythagorean-applications-and-distance-between-points.v1',
  course: 'Grade 8 Math',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Pythagorean Applications & Distance Between Points',
  planId: 'evelyn.ms.m8math.pythagorean-applications-and-distance-between-points.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.pythagorean-applications-and-distance-between-points.v1' }],
  theory: [
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'framework', title: 'Find the right angle first', content: `FIND THE RIGHT ANGLE FIRST — every application starts by locating the 90° corner. A wall meets the ground at a right angle, a screen's width meets its height at a right angle, and the horizontal and vertical directions on a coordinate plane meet at a right angle. Once you have the right angle, the side across from it is the hypotenuse, the other two sides are the legs, and a² + b² = c² is ready to use. The theorem only works when c is the hypotenuse, so name the sides before you square anything.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', content: `HYPOTENUSE MISSING: ADD. LEG MISSING: SUBTRACT — if the unknown side is the hypotenuse, add the two squares and take the root: a screen 8 wide and 6 tall has a diagonal of √(64 + 36) = 10. If the unknown side is a leg, subtract the smaller square from the hypotenuse squared and take the root: a 13-foot ladder with its foot 5 feet from the wall reaches √(169 - 25) = √144 = 12 feet up. The ladder is the hypotenuse because it is the slanted side across from the right angle where the wall meets the ground.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'framework', title: 'A box needs two right triangles', content: `A BOX NEEDS TWO RIGHT TRIANGLES — the space diagonal of a box runs from a bottom corner to the opposite top corner, through the inside, and it does not lie in any face. First triangle: the bottom face, whose length and width are the legs and whose diagonal is the hypotenuse. Second triangle: that bottom diagonal and the height are the legs, and the space diagonal is the hypotenuse. Keep the bottom diagonal SQUARED between the two steps; if it is 25, carry the 25, and you never take a root only to square it again.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'framework', title: 'Two points make a right triangle', content: `TWO POINTS MAKE A RIGHT TRIANGLE — two points that share an x-coordinate or a y-coordinate are a straight count apart, which you already know. Two points that share neither need a triangle: from the first point go straight across, then straight up or down to the second point. The corner where across meets up is the right angle. The horizontal leg is Δx, the change in x, found by subtracting the x-coordinates; the vertical leg is Δy, the change in y, found by subtracting the y-coordinates; and the straight-line distance between the points is the hypotenuse.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'framework', title: 'Legs are lengths, so they are never negative', content: `LEGS ARE LENGTHS, SO THEY ARE NEVER NEGATIVE — from (-2, 1) to (4, 5), the horizontal leg is 4 - (-2) = 6, not 4 - 2 = 2, because subtracting a negative reaches all the way across the y-axis. If a subtraction comes out negative, the leg is the positive version, since squaring erases the sign anyway. Count the squares on the grid whenever you can and let the count and the subtraction agree.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'framework', title: 'Most distances are not whole numbers', content: `MOST DISTANCES ARE NOT WHOLE NUMBERS — real legs rarely give a perfect square, so finish with the estimate you already own: trap the root between two consecutive whole numbers, then test one decimal place. √45 sits between 6 and 7 because 36 < 45 < 49; 6.7² = 44.89 and 6.8² = 46.24, so √45 ≈ 6.7. Then sanity-check: the hypotenuse must be longer than either leg and shorter than the two legs added together. An answer outside that window has a slip in it.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'definition', title: 'hypotenuse', content: `the side across from the right angle, always the longest side of a right triangle; the c in a² + b² = c².` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'definition', title: 'leg', content: `either of the two sides that meet at the right angle; the a and the b in a² + b² = c².` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'definition', title: 'space diagonal', content: `the segment from one corner of a box to the opposite corner, passing through the inside of the box rather than along any face.` },
    { loId: 'm8math.pythagorean-applications-and-distance-between-points', kind: 'definition', title: 'Δx and Δy', content: `the horizontal change and the vertical change between two points, found by subtracting the x-coordinates and the y-coordinates; they are the two legs of the right triangle that joins the points.` },
  ],
  methods: [
    {
      title: 'Worked ladder and box',
      steps: [
        `(a) Find the right angle: the wall meets the ground at 90°. The ladder is the slanted side across from that corner, so the ladder is the hypotenuse, c = 13. The 5 feet along the ground is a leg, and the height up the wall is the other leg, the one we want.`,
        `WRONG: 5² + 13² = 25 + 169 = 194, so the height is √194, about 13.9 feet. That answer is taller than the ladder itself, which cannot happen, because the hypotenuse is always the longest side. Adding is for a missing hypotenuse. CORRECT: the missing side is a leg, so subtract: 13² - 5² = 169 - 25 = 144, and √144 = 12. The ladder reaches 12 feet up the wall.`,
        `Check by working backward: 5² + 12² = 25 + 144 = 169 = 13². The three sides fit the theorem, and 12 is shorter than 13 and longer than 5, as a leg should be.`,
        `(b) No edge of the box is 12.5 inches long, so the drumstick can only fit along the space diagonal, from a bottom corner to the opposite top corner. That needs two right triangles.`,
        `First triangle, the bottom face: legs 3 and 4, so the bottom diagonal squared is 3² + 4² = 9 + 16 = 25. Keep it as 25 for now.`,
        `Second triangle: the bottom diagonal and the 12-inch height meet at a right angle, so they are the legs and the space diagonal is the hypotenuse. c² = 25 + 12² = 25 + 144 = 169, and √169 = 13. The space diagonal is 13 inches.`,
        `Answer the question: 13 inches is longer than 12.5 inches, so the drumstick fits, but only laid corner to opposite corner. Check: 13 is longer than the 12-inch height and the 5-inch bottom diagonal, and shorter than 5 + 12 = 17, so it sits in the right window. Starting with a different face gives the same result: 12² + 4² = 160, then 160 + 3² = 169.`,
      ],
      example: { problem: `(a) A 13-foot ladder leans against a wall with its foot 5 feet from the base of the wall. How high up the wall does the ladder reach? (b) A box is 3 inches wide, 4 inches deep, and 12 inches tall. Will a 12.5-inch drumstick fit inside it?`, solution: `(a) 12 feet; (b) yes, the space diagonal is 13 inches, so the 12.5-inch drumstick fits` },
      relatedLoIds: ['m8math.pythagorean-applications-and-distance-between-points'],
    },
    {
      title: 'Worked distance on the map',
      steps: [
        `The two points share neither an x-coordinate nor a y-coordinate, so there is no straight count. Draw the right triangle: from the ramp at (-2, 1) go straight across to (4, 1), then straight up to the rail at (4, 5). The corner at (4, 1) is the right angle, and the straight line from ramp to rail is the hypotenuse.`,
        `Horizontal leg, the change in x: 4 - (-2) = 6. Count it on the grid: from x = -2 to x = 4 is 6 squares, so the subtraction and the count agree. Vertical leg, the change in y: 5 - 1 = 4.`,
        'Use the theorem with the legs 6 and 4: c² = 6² + 4² = 36 + 16 = 52.',
        `WRONG: 6 + 4 = 10 meters, walking across and then up along the grid lines. CORRECT: the straight line is the hypotenuse, which is shorter than the two legs added together; the distance is √52, not 6 + 4, because a square root never splits across a plus sign.`,
        `52 is not a perfect square. Trap it: 7² = 49 and 8² = 64, so √52 is between 7 and 8, and closer to 7. Test one decimal place: 7.2² = 51.84 and 7.3² = 53.29, and 52 is much closer to 51.84, so √52 ≈ 7.2.`,
        `Check: 7.2 is longer than the longer leg, 6, and shorter than 6 + 4 = 10, so it sits in the window a hypotenuse must land in. Putting the corner at (-2, 5) instead of (4, 1) gives the same two legs and the same answer.`,
      ],
      example: { problem: `On a map of the skate park, each grid unit is 1 meter. The ramp is at (-2, 1) and the rail is at (4, 5). How far apart are the ramp and the rail in a straight line?`, solution: 'About 7.2 meters (√52, which is between 7 and 8)' },
      relatedLoIds: ['m8math.pythagorean-applications-and-distance-between-points'],
    },
  ],
  pointers: [
    { content: `Students often say "3" — Draw the right triangle: across from (1, 1) to (4, 1) is a leg of 3, and up from (4, 1) to (4, 4) is a leg of 3. Then c² = 3² + 3² = 9 + 9 = 18. Since 4² = 16 and 5² = 25, √18 is between 4 and 5; 4.2² = 17.64 and 4.3² = 18.49, so √18 ≈ 4.2. The distance is about 4.2 units, longer than the 3 Devon counted, because each diagonal step across a square is longer than the square's side.`, kind: 'common-error' },
    { content: `Students often say "6" — A square root never splits across a plus sign. Finish the addition under the root first: 9 + 9 = 18, and then √18 ≈ 4.2. The sanity check catches the slip on its own: a hypotenuse has to be shorter than the two legs added together, and 6 is exactly 3 + 3, which is the length of walking along the grid, not straight across it.`, kind: 'common-error' },
    { content: `Find the right angle first. The side across from it is the hypotenuse, the two sides that meet at it are the legs, and only then does a² + b² = c² apply.`, kind: 'tip' },
    { content: `Missing hypotenuse: add the squares and take the root. Missing leg: subtract the smaller square from the hypotenuse squared and take the root. A ladder is a hypotenuse; how high it reaches is a leg.`, kind: 'tip' },
    { content: `A box's space diagonal takes two right triangles: the bottom face gives the bottom diagonal squared, and that number plus the height squared gives the space diagonal squared.`, kind: 'tip' },
    { content: `Two points on the coordinate plane make a right triangle: the horizontal leg is the change in x, the vertical leg is the change in y, and the distance is the hypotenuse. Subtracting a negative coordinate reaches across the axis, so 4 - (-2) = 6.`, kind: 'tip' },
    { content: `When the root is not a perfect square, trap it between two whole numbers and test one decimal place, as with √52 ≈ 7.2.`, kind: 'tip' },
    { content: `A square root never splits across a plus sign, and a hypotenuse is always longer than either leg and shorter than the two legs added together. Use that window to catch a slip.`, kind: 'tip' },
  ],
};
