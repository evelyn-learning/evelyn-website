/**
 * Grade 6 Math — Unit 6 CED 6.1: Plotting Points in All Four Quadrants.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.plotting-points-in-all-four-quadrants.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U6_PLOTTING_POINTS_IN_ALL_FOUR_QUADRANTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.plotting-points-in-all-four-quadrants.v1',
  course: 'Grade 6 Math',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Plotting Points in All Four Quadrants',
  planId: 'evelyn.ms.m6math.plotting-points-in-all-four-quadrants.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.plotting-points-in-all-four-quadrants.v1' }],
  theory: [
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'Two number lines meeting at a right angle', content: `TWO NUMBER LINES MEETING AT A RIGHT ANGLE — the coordinate plane is built from a horizontal number line, the x-axis, and a vertical number line, the y-axis, crossing at a point called the origin. The origin is written (0, 0).` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'An ordered pair names one exact location', content: `AN ORDERED PAIR NAMES ONE EXACT LOCATION — write a point as (x, y). The FIRST number is always the x-coordinate, how far to move left or right from the origin. The SECOND number is always the y-coordinate, how far to move up or down. The order never changes: (3, -5) and (-5, 3) name two different points, even though they use the same two digits.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'The sign gives the direction, the digits give the distance', content: `THE SIGN GIVES THE DIRECTION, THE DIGITS GIVE THE DISTANCE — a positive x-coordinate moves right of the origin, a negative x-coordinate moves left. A positive y-coordinate moves up, a negative y-coordinate moves down. This is the same sign-as-direction idea from the number line, now used on two axes at once. No adding, subtracting, multiplying, or dividing happens here, only placing and reading.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'Four quadrants, four sign patterns', content: `FOUR QUADRANTS, FOUR SIGN PATTERNS — the two axes cut the plane into four regions called quadrants, numbered I, II, III, and IV, going counterclockwise starting at the upper right. Quadrant I is (+, +). Quadrant II is (-, +). Quadrant III is (-, -). Quadrant IV is (+, -).` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'A zero coordinate means the point sits on an axis, not in a quadrant', content: `A ZERO COORDINATE MEANS THE POINT SITS ON AN AXIS, NOT IN A QUADRANT — if x = 0, the point sits on the y-axis. If y = 0, the point sits on the x-axis. If both are 0, the point is the origin itself. A quadrant only contains points where BOTH coordinates are nonzero.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'framework', title: 'Plot by moving along the x-axis first, then the y-axis', content: `PLOT BY MOVING ALONG THE X-AXIS FIRST, THEN THE Y-AXIS — start at the origin every time. Move left or right by the x-coordinate first. From that spot, move up or down by the y-coordinate. Where you land is the point.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'definition', title: 'x-axis', content: `the horizontal number line on the coordinate plane, used to measure left-right distance from the origin.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'definition', title: 'y-axis', content: `the vertical number line on the coordinate plane, used to measure up-down distance from the origin.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'definition', title: 'origin', content: 'the point (0, 0), where the x-axis and the y-axis cross.' },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'definition', title: 'ordered pair', content: `two numbers written in a fixed order, (x, y), that name one exact point on the coordinate plane.` },
    { loId: 'm6math.plotting-points-in-all-four-quadrants', kind: 'definition', title: 'quadrant', content: `one of the four regions the x-axis and y-axis divide the coordinate plane into, each with its own pattern of positive and negative signs.` },
  ],
  methods: [
    {
      title: 'Worked plot and name quadrants',
      steps: [
        'Start every point at the origin, (0, 0).',
        `Point A(4, 2): move 4 units right (positive x), then 2 units up (positive y). Both coordinates are positive, so A lands in Quadrant I.`,
        `Point B(-3, 5): move 3 units left (negative x), then 5 units up (positive y). Negative x with positive y is the Quadrant II pattern, so B lands in Quadrant II.`,
        `Point C(-2, -6): move 2 units left (negative x), then 6 units down (negative y). Both coordinates are negative, so C lands in Quadrant III.`,
        `Point D(5, -1): move 5 units right (positive x), then 1 unit down (negative y). Positive x with negative y is the Quadrant IV pattern, so D lands in Quadrant IV.`,
        `Check each answer against the sign rule: Quadrant I is (+, +), Quadrant II is (-, +), Quadrant III is (-, -), Quadrant IV is (+, -). Every point above matches its quadrant's pattern.`,
      ],
      example: { problem: `Plot four points on the coordinate plane and name the quadrant each one lands in: A(4, 2), B(-3, 5), C(-2, -6), and D(5, -1).`, solution: `A is in Quadrant I, B is in Quadrant II, C is in Quadrant III, D is in Quadrant IV.` },
      relatedLoIds: ['m6math.plotting-points-in-all-four-quadrants'],
    },
    {
      title: 'Worked order matters swapped pair',
      steps: [
        'Start at the origin, (0, 0).',
        'The first coordinate is 3, the x-coordinate, so move 3 units right.',
        `The second coordinate is -5, the y-coordinate, so from there move 5 units down. This lands on (3, -5), in Quadrant IV, because x is positive and y is negative.`,
        `WRONG: swapping the two numbers and plotting (-5, 3) instead. That means moving 5 units left, then 3 units up, which lands in Quadrant II, because x is negative and y is positive.`,
        `CORRECT: (3, -5) and (-5, 3) use the same two digits but in a different order, so they are different points in different quadrants. The FIRST number always belongs to the x-axis and the SECOND number always belongs to the y-axis. Swapping them moves the point somewhere else entirely.`,
        `Check by comparing sign patterns: (3, -5) is (+, -), the Quadrant IV pattern. (-5, 3) is (-, +), the Quadrant II pattern. Different sign patterns confirm these are two different locations, not the same point written two ways.`,
      ],
      example: { problem: `Plot the point (3, -5). Then explain why (3, -5) and (-5, 3) are not the same point.`, solution: `(3, -5) is in Quadrant IV, 3 units right and 5 units down from the origin. It is a different point from (-5, 3), which is in Quadrant II.` },
      relatedLoIds: ['m6math.plotting-points-in-all-four-quadrants'],
    },
  ],
  pointers: [
    { content: `Students often say "(0, -6) is in Quadrant III." — A point belongs to a quadrant only when BOTH coordinates are nonzero. Since the x-coordinate of (0, -6) is 0, the point sits exactly on the y-axis, not inside Quadrant III or any other quadrant.`, kind: 'common-error' },
    { content: `Students often say "Plotting (-5, 3) when asked to plot (3, -5)." — The order of an ordered pair is fixed: the FIRST number is always the x-coordinate and the SECOND is always the y-coordinate. (3, -5) means right 3, down 5, landing in Quadrant IV. (-5, 3) means left 5, up 3, landing in Quadrant II. Swapping the numbers moves the point to a completely different location.`, kind: 'common-error' },
    { content: `The coordinate plane is two number lines, the x-axis and the y-axis, crossing at the origin, (0, 0).`, kind: 'tip' },
    { content: `An ordered pair (x, y) always lists the x-coordinate first and the y-coordinate second, in that fixed order.`, kind: 'tip' },
    { content: `A positive coordinate moves right (x) or up (y) from the origin; a negative coordinate moves left (x) or down (y) — the sign gives direction and is never computed here.`, kind: 'tip' },
    { content: `The two axes create four quadrants with four sign patterns: I is (+, +), II is (-, +), III is (-, -), IV is (+, -).`, kind: 'tip' },
    { content: 'A coordinate of 0 puts a point on an axis, not inside any quadrant.', kind: 'tip' },
    { content: `Swapping the two numbers in an ordered pair, like reading (3, -5) as (-5, 3), moves the point to a different location entirely.`, kind: 'tip' },
  ],
};
