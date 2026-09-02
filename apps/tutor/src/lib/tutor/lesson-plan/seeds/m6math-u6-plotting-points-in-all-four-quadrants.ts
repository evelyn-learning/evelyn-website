/**
 * Grade 6 Math — The Coordinate Plane: Plotting Points in All Four
 * Quadrants.
 *
 * CONCEPT-LED lesson in the m6math fan-out. The student already knows a
 * single number line places a signed number relative to a chosen zero
 * (Unit 5). This lesson builds the next mental model: TWO number lines
 * crossing at a right angle turn a single signed number into an address for
 * an exact location, and the order the two numbers are written in is what
 * makes that address unambiguous (CCSS 6.NS.C.6b/c). The classic trap this
 * plan is built to kill is reading an ordered pair out of order — treating
 * (3, -5) as if it were (-5, 3) — which lands a student on a real point, just
 * the wrong one, so the mistake is easy to miss without checking the sign
 * pattern against the quadrant it landed in.
 *
 * SCOPE GUARD: This lesson extends number-line placement to two dimensions:
 * it plots an ordered pair given as two signed numbers, and reads a plotted
 * point back as an ordered pair, across all four quadrants. Every coordinate
 * is placed and read, never computed — no addition, subtraction,
 * multiplication, or division is ever performed on a coordinate value; the
 * arithmetic operations Grade 7 begins for these values (m7math U1-U2) do not
 * appear here. Finding the mirror image of a point across an axis is row 6.2
 * (Reflecting Points Across the Axes), finding the distance between two
 * points is row 6.3 (Finding Distance Between Points), and using a graphed
 * point to solve a further real-world or mathematical problem is row 6.4
 * (Real-World Coordinate Plane Problems) — none of those three skills is
 * taught or assessed here; this row stops at correctly placing and naming a
 * point.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 5.4 -> 6.1 -> 6.2. The
 * fan-out contract directs every row to populate its real previous/next
 * loIds now, even though rows 5.4 and 6.2 are authored by sibling agents in
 * this same batch; the controller's batched registration and lint pass
 * resolve them once the full 40-row course lands.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U6_PLOTTING_POINTS_IN_ALL_FOUR_QUADRANTS: LessonPlan = {
  id: 'evelyn.ms.m6math.plotting-points-in-all-four-quadrants.v1',
  title: 'Plotting Points in All Four Quadrants',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.plotting-points-in-all-four-quadrants',
      standard: 'M6MATH-6.1',
      description:
        'Extend number-line understanding to plot ordered pairs of rational numbers in all four quadrants of the coordinate plane (CCSS 6.NS.C.6b/c).',
    },
  ],
  prerequisites: ['m6math.ordering-rational-numbers'],
  followUps: ['m6math.reflecting-points-across-the-axes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student see the coordinate plane as two crossing number lines before any ordered pair is written.',
      script:
        'Picture the gym floor before class. Coach has taped a giant grid onto it for a new game. Two long tape lines cross in the exact middle of the gym, and that meeting point is home base. One line runs left and right across the floor. The other line runs the length of the room, toward the stage on one end and toward the bleachers on the other. Every square on the floor now has an address made of two numbers, and any player can be found by that address, whether they stand near the stage, near the bleachers, left of home base, or right of it. Today we learn how to read that address for any spot on the whole floor, not just the corner nearest the door.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-axes-and-quadrants',
      kind: 'concept',
      goal: 'Build the coordinate plane as two crossing number lines whose four regions each carry their own sign pattern, and make reading an ordered pair in a fixed order automatic.',
      keyIdeas: [
        'TWO NUMBER LINES MEETING AT A RIGHT ANGLE — the coordinate plane is built from a horizontal number line, the x-axis, and a vertical number line, the y-axis, crossing at a point called the origin. The origin is written (0, 0).',
        'AN ORDERED PAIR NAMES ONE EXACT LOCATION — write a point as (x, y). The FIRST number is always the x-coordinate, how far to move left or right from the origin. The SECOND number is always the y-coordinate, how far to move up or down. The order never changes: (3, -5) and (-5, 3) name two different points, even though they use the same two digits.',
        'THE SIGN GIVES THE DIRECTION, THE DIGITS GIVE THE DISTANCE — a positive x-coordinate moves right of the origin, a negative x-coordinate moves left. A positive y-coordinate moves up, a negative y-coordinate moves down. This is the same sign-as-direction idea from the number line, now used on two axes at once. No adding, subtracting, multiplying, or dividing happens here, only placing and reading.',
        'FOUR QUADRANTS, FOUR SIGN PATTERNS — the two axes cut the plane into four regions called quadrants, numbered I, II, III, and IV, going counterclockwise starting at the upper right. Quadrant I is (+, +). Quadrant II is (-, +). Quadrant III is (-, -). Quadrant IV is (+, -).',
        'A ZERO COORDINATE MEANS THE POINT SITS ON AN AXIS, NOT IN A QUADRANT — if x = 0, the point sits on the y-axis. If y = 0, the point sits on the x-axis. If both are 0, the point is the origin itself. A quadrant only contains points where BOTH coordinates are nonzero.',
        'PLOT BY MOVING ALONG THE X-AXIS FIRST, THEN THE Y-AXIS — start at the origin every time. Move left or right by the x-coordinate first. From that spot, move up or down by the y-coordinate. Where you land is the point.',
      ],
      vocabulary: [
        { term: 'x-axis', definition: 'the horizontal number line on the coordinate plane, used to measure left-right distance from the origin.' },
        { term: 'y-axis', definition: 'the vertical number line on the coordinate plane, used to measure up-down distance from the origin.' },
        { term: 'origin', definition: 'the point (0, 0), where the x-axis and the y-axis cross.' },
        { term: 'ordered pair', definition: 'two numbers written in a fixed order, (x, y), that name one exact point on the coordinate plane.' },
        { term: 'quadrant', definition: 'one of the four regions the x-axis and y-axis divide the coordinate plane into, each with its own pattern of positive and negative signs.' },
      ],
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plot-and-name-quadrants',
      kind: 'worked_example',
      problem:
        'Plot four points on the coordinate plane and name the quadrant each one lands in: A(4, 2), B(-3, 5), C(-2, -6), and D(5, -1).',
      steps: [
        'Start every point at the origin, (0, 0).',
        'Point A(4, 2): move 4 units right (positive x), then 2 units up (positive y). Both coordinates are positive, so A lands in Quadrant I.',
        'Point B(-3, 5): move 3 units left (negative x), then 5 units up (positive y). Negative x with positive y is the Quadrant II pattern, so B lands in Quadrant II.',
        'Point C(-2, -6): move 2 units left (negative x), then 6 units down (negative y). Both coordinates are negative, so C lands in Quadrant III.',
        'Point D(5, -1): move 5 units right (positive x), then 1 unit down (negative y). Positive x with negative y is the Quadrant IV pattern, so D lands in Quadrant IV.',
        'Check each answer against the sign rule: Quadrant I is (+, +), Quadrant II is (-, +), Quadrant III is (-, -), Quadrant IV is (+, -). Every point above matches its quadrant\'s pattern.',
      ],
      answer: 'A is in Quadrant I, B is in Quadrant II, C is in Quadrant III, D is in Quadrant IV.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-matters-swapped-pair',
      kind: 'worked_example',
      problem: 'Plot the point (3, -5). Then explain why (3, -5) and (-5, 3) are not the same point.',
      steps: [
        'Start at the origin, (0, 0).',
        'The first coordinate is 3, the x-coordinate, so move 3 units right.',
        'The second coordinate is -5, the y-coordinate, so from there move 5 units down. This lands on (3, -5), in Quadrant IV, because x is positive and y is negative.',
        'WRONG: swapping the two numbers and plotting (-5, 3) instead. That means moving 5 units left, then 3 units up, which lands in Quadrant II, because x is negative and y is positive.',
        'CORRECT: (3, -5) and (-5, 3) use the same two digits but in a different order, so they are different points in different quadrants. The FIRST number always belongs to the x-axis and the SECOND number always belongs to the y-axis. Swapping them moves the point somewhere else entirely.',
        'Check by comparing sign patterns: (3, -5) is (+, -), the Quadrant IV pattern. (-5, 3) is (-, +), the Quadrant II pattern. Different sign patterns confirm these are two different locations, not the same point written two ways.',
      ],
      answer: '(3, -5) is in Quadrant IV, 3 units right and 5 units down from the origin. It is a different point from (-5, 3), which is in Quadrant II.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-pair-from-description',
      kind: 'try_yourself',
      problem: 'A point is plotted 6 units to the left of the origin and 2 units below it. Which ordered pair names this point?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-2, -6)' },
        { id: 'b', text: '(6, 2)' },
        { id: 'c', text: '(-6, 2)' },
        { id: 'd', text: '(-6, -2)', correct: true },
      ],
      expectedAnswer: '(-6, -2)',
      hints: [
        'The FIRST number in an ordered pair is always the x-coordinate, and the SECOND is always the y-coordinate. Do not swap the order the two directions were given in.',
        'Left of the origin means a negative x-coordinate. Below the origin means a negative y-coordinate. Both directions here are negative.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-quadrant-iii-membership',
      kind: 'try_yourself',
      problem: 'Which of these ordered pairs lies in Quadrant III?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(5, -3)' },
        { id: 'b', text: '(-5, -3)', correct: true },
        { id: 'c', text: '(-5, 3)' },
        { id: 'd', text: '(5, 3)' },
      ],
      expectedAnswer: '(-5, -3)',
      hints: [
        'Quadrant III is the region where BOTH coordinates are negative. Check the sign of each number in every choice, not just one of them.',
        'Only one of these four pairs has a negative x-coordinate and a negative y-coordinate at the same time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-checkpoint-x-coordinate',
      kind: 'try_yourself',
      problem:
        'In a video game, a checkpoint is 8 units to the left of the starting flag and 3 units above it. The flag sits at the origin, (0, 0). What is the x-coordinate of the checkpoint? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-8',
      hints: [
        'The x-coordinate is the FIRST number in the ordered pair, and it measures left-right distance from the origin.',
        'Left of the origin is the negative x-direction, so the x-coordinate is a negative number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-axis-points-and-swapped-pairs',
      kind: 'misconception_check',
      question:
        'One student says the point (0, -6) is in Quadrant III because the y-coordinate is negative. Another student is told to plot (3, -5) and instead plots (-5, 3). What went wrong in each case?',
      commonErrors: [
        {
          answer: '(0, -6) is in Quadrant III.',
          misconception:
            'Assuming that any point with a negative coordinate must sit inside one of the four quadrants, without checking whether the other coordinate is zero.',
          correctsTo:
            'A point belongs to a quadrant only when BOTH coordinates are nonzero. Since the x-coordinate of (0, -6) is 0, the point sits exactly on the y-axis, not inside Quadrant III or any other quadrant.',
        },
        {
          answer: 'Plotting (-5, 3) when asked to plot (3, -5).',
          misconception:
            'Swapping the order of the two coordinates, as if (3, -5) and (-5, 3) named the same point because they use the same two numbers.',
          correctsTo:
            'The order of an ordered pair is fixed: the FIRST number is always the x-coordinate and the SECOND is always the y-coordinate. (3, -5) means right 3, down 5, landing in Quadrant IV. (-5, 3) means left 5, up 3, landing in Quadrant II. Swapping the numbers moves the point to a completely different location.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The coordinate plane is two number lines, the x-axis and the y-axis, crossing at the origin, (0, 0).',
        'An ordered pair (x, y) always lists the x-coordinate first and the y-coordinate second, in that fixed order.',
        'A positive coordinate moves right (x) or up (y) from the origin; a negative coordinate moves left (x) or down (y) — the sign gives direction and is never computed here.',
        'The two axes create four quadrants with four sign patterns: I is (+, +), II is (-, +), III is (-, -), IV is (+, -).',
        'A coordinate of 0 puts a point on an axis, not inside any quadrant.',
        'Swapping the two numbers in an ordered pair, like reading (3, -5) as (-5, 3), moves the point to a different location entirely.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Plotting Points in All Four Quadrants' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
