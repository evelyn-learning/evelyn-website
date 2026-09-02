/**
 * Grade 6 Math — The Coordinate Plane: Reflecting Points Across the Axes.
 *
 * CONCEPT-LED lesson for the m6math fan-out. Row 6.1 already taught how to
 * plot a point in any of the four quadrants; this lesson teaches where a
 * plotted point lands after a flip across the x-axis, the y-axis, or both
 * (CCSS 6.NS.C.6b). The whole lesson is a sign-reading skill, not a
 * computation: a reflection is read off and stated as the opposite of a
 * coordinate the student already has, the same way Lesson 5.1 introduced
 * opposites on the number line. The one trap this plan is built to kill is
 * swapping which coordinate changes: reflecting across the x-axis flips y,
 * and reflecting across the y-axis flips x, and students reliably cross the
 * two.
 *
 * SCOPE GUARD: Row 6.2 covers only reading off the reflection of a plotted
 * point across the x-axis, the y-axis, or both, as a sign change on the
 * matching coordinate. It is never a computation: no coordinate in this plan
 * is found by adding, subtracting, multiplying, or dividing a negative
 * number, which stays Grade 7 territory (G7 U1-U2) and does not appear here.
 * Plotting a point from nothing is row 6.1's skill and is assumed already in
 * place, so no step here teaches how to place a point on the grid for the
 * first time. Where this lesson names how far a coordinate sits from an
 * axis, it only restates that coordinate's own size, read directly — never
 * the distance between two different points, which is row 6.3's skill, and
 * it never uses absolute-value notation, which is row 5.3's. Real-world
 * problems that require graphing and reasoning about several points
 * together are row 6.4's territory; this lesson uses one continuous
 * real-world scene only to give the reflections somewhere to live.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U6_REFLECTING_POINTS_ACROSS_THE_AXES: LessonPlan = {
  id: 'evelyn.ms.m6math.reflecting-points-across-the-axes.v1',
  title: 'Reflecting Points Across the Axes',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.reflecting-points-across-the-axes',
      standard: 'M6MATH-6.2',
      description:
        'Find and interpret the reflection of a plotted point across one or both axes using sign changes in its coordinates (CCSS 6.NS.C.6b).',
    },
  ],
  prerequisites: ['m6math.plotting-points-in-all-four-quadrants'],
  followUps: ['m6math.finding-distance-between-points'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student picturing a flip across a line before any sign rule is named.',
      script:
        'Your class is setting up a treasure hunt for the school carnival on a grid painted on the blacktop. The fountain in the middle is the origin, (0, 0). The chalk line running east to west through the fountain is the x-axis. The chalk line running north to south through the fountain is the y-axis. The rules say every clue needs a matching decoy on the opposite side of one of those two lines, so nobody can guess the pattern by checking only one side. Today you learn exactly how to find that decoy. It is called a reflection, and you build it with nothing but a sign change on one coordinate, or on both.',
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sign-flip-rules',
      kind: 'concept',
      goal: 'Install the two sign-flip rules, stop the x/y mixup before it starts, and show what a double reflection does.',
      keyIdeas: [
        'REFLECTING ACROSS THE X-AXIS FLIPS THE Y-COORDINATE — reflecting a point across the x-axis, the horizontal line, moves it straight up or down to the opposite side. The x-coordinate does not move sideways, so it stays the same. The y-coordinate becomes its opposite: the point (x, y) reflects to (x, -y).',
        'REFLECTING ACROSS THE Y-AXIS FLIPS THE X-COORDINATE — reflecting a point across the y-axis, the vertical line, moves it straight left or right to the opposite side. The y-coordinate does not move up or down, so it stays the same. The x-coordinate becomes its opposite: the point (x, y) reflects to (-x, y).',
        'THE COORDINATE THAT CHANGES IS THE ONE THAT MOVES, NOT THE ONE NAMED BY THE AXIS — this is the easiest place to get turned around. Reflecting across the x-axis flips y, not x. Reflecting across the y-axis flips x, not y. Before flipping any sign, say out loud which line the point is crossing and which direction that sends it.',
        'REFLECTING ACROSS BOTH AXES FLIPS BOTH SIGNS — reflect a point across the x-axis, then reflect that new point across the y-axis, and both coordinates come out with the opposite sign: (x, y) ends at (-x, -y). Doing the y-axis first and the x-axis second lands on the exact same final point.',
        'A REFLECTION KEEPS THE SAME DISTANCE FROM THE LINE, ON THE OTHER SIDE — a point 5 units above the x-axis reflects to a point 5 units below it. A point 4 units left of the y-axis reflects to a point 4 units right of it. The distance from the axis never changes; only the side does.',
        'FLIPPING A SIGN IS NOT COMPUTING — finding a reflection never means adding, subtracting, multiplying, or dividing. It means reading the coordinate you already have and writing down its opposite, the same way +3 and -3 from Lesson 5.1 are opposites of each other.',
      ],
      vocabulary: [
        { term: 'reflection', definition: 'a flip of a point to the opposite side of a line, landing the same distance from that line as the original point.' },
        { term: 'x-axis', definition: 'the horizontal number line on a coordinate plane; reflecting a point across it flips the sign of the y-coordinate.' },
        { term: 'y-axis', definition: 'the vertical number line on a coordinate plane; reflecting a point across it flips the sign of the x-coordinate.' },
        { term: 'opposite', definition: 'two numbers the same distance from zero on opposite sides, such as 4 and -4; a reflected coordinate is always the opposite of the original coordinate.' },
      ],
      suggestedTools: ['show_geometry'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-booth-two-single-reflections',
      kind: 'worked_example',
      problem:
        'On the carnival grid, the ring-toss booth sits at (4, 5), using the fountain as the origin (0, 0). You need two decoys: the reflection of the booth across the x-axis, and the reflection of the booth across the y-axis. Find both.',
      steps: [
        'Start with the booth\'s coordinates: (4, 5).',
        'Reflect across the x-axis. This flip is straight up or down, so the x-coordinate does not move: it stays 4. The y-coordinate becomes its opposite: 5 becomes -5. The first decoy is (4, -5).',
        'Reflect across the y-axis instead. This flip is straight left or right, so the y-coordinate does not move: it stays 5. The x-coordinate becomes its opposite: 4 becomes -4. The second decoy is (-4, 5).',
        'WRONG: reflecting across the x-axis by flipping the x-coordinate instead, giving (-4, 5). CORRECT: that point is actually the reflection across the y-axis. Flipping across the x-axis changes y, not x, so check which line you are crossing before you flip a sign.',
        'Check by comparing distances from each line. The booth sits 5 units above the x-axis, and (4, -5) sits 5 units below it: same distance, opposite side, exactly what a reflection across the x-axis means. The booth sits 4 units right of the y-axis, and (-4, 5) sits 4 units left of it: same distance, opposite side, exactly what a reflection across the y-axis means.',
      ],
      answer: 'Reflection across the x-axis: (4, -5). Reflection across the y-axis: (-4, 5).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-clue-both-axes',
      kind: 'worked_example',
      problem:
        'A clue is hidden at (-6, 3) on the same grid. The final decoy for this clue comes from reflecting the point across the x-axis, and then reflecting that new point across the y-axis. Find the final decoy.',
      steps: [
        'Start at (-6, 3).',
        'Reflect across the x-axis first: the x-coordinate stays the same, and the y-coordinate flips sign. (-6, 3) becomes (-6, -3).',
        'Now reflect that point, (-6, -3), across the y-axis: the y-coordinate stays the same, and the x-coordinate flips sign. (-6, -3) becomes (6, -3).',
        'The final decoy is (6, -3). Both coordinates ended up with the opposite sign from where they started: -6 became 6, and 3 became -3. Reflecting across both axes always flips both signs, no matter which axis goes first.',
        'WRONG: flipping only one sign and stopping, such as writing (6, 3) or (-6, -3) as the final answer. CORRECT: reflecting across both axes means both coordinates change sign, not just one.',
        'Check by comparing distances from each line. (-6, 3) sits 6 units left of the y-axis and 3 units above the x-axis. (6, -3) sits 6 units right of the y-axis and 3 units below the x-axis: the same two distances, both flipped to the opposite side.',
      ],
      answer: '(6, -3)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-reflect-across-x-axis',
      kind: 'try_yourself',
      problem: 'Point P is at (6, -2) on the grid. What are the coordinates of its reflection across the x-axis?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(6, 2)', correct: true },
        { id: 'b', text: '(-6, -2)' },
        { id: 'c', text: '(-6, 2)' },
        { id: 'd', text: '(6, -2)' },
      ],
      expectedAnswer: '(6, 2)',
      hints: [
        'Reflecting across the x-axis only changes the y-coordinate. The x-coordinate stays put.',
        'The x-coordinate 6 stays the same. The y-coordinate -2 flips to its opposite, +2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reflect-across-y-axis',
      kind: 'try_yourself',
      problem: 'Point Q is at (-3, 5) on the grid. What are the coordinates of its reflection across the y-axis?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(-3, -5)' },
        { id: 'b', text: '(3, -5)' },
        { id: 'c', text: '(3, 5)', correct: true },
        { id: 'd', text: '(-3, 5)' },
      ],
      expectedAnswer: '(3, 5)',
      hints: [
        'Reflecting across the y-axis only changes the x-coordinate. The y-coordinate stays put.',
        'The y-coordinate 5 stays the same. The x-coordinate -3 flips to its opposite, +3.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-double-reflection',
      kind: 'try_yourself',
      problem:
        'Point T is at (2, -9). It is reflected across the x-axis, and then that new point is reflected across the y-axis. Type the x-coordinate of the final point as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-2',
      hints: [
        'Reflect across the x-axis first. That flip changes the y-coordinate, so the x-coordinate is still 2 after this step.',
        'The second reflection, across the y-axis, is the one that flips the x-coordinate\'s sign. 2 becomes -2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-crossed-axes',
      kind: 'misconception_check',
      question:
        'A student reflects the point (5, -3) across the x-axis and writes (-5, -3). The same student reflects (5, -3) across the y-axis and writes (5, 3). What went wrong in each case?',
      commonErrors: [
        {
          answer: '(-5, -3)',
          misconception:
            'Reflecting across the x-axis by changing the sign of the x-coordinate instead of the y-coordinate, flipping the coordinate that names the axis rather than the one that actually moves.',
          correctsTo:
            'Reflecting across the x-axis leaves x alone and flips the sign of y, because the point moves up or down across that line, not sideways. (5, -3) reflected across the x-axis is (5, 3), not (-5, -3).',
        },
        {
          answer: '(5, 3)',
          misconception:
            'Reflecting across the y-axis by changing the sign of the y-coordinate instead of the x-coordinate.',
          correctsTo:
            'Reflecting across the y-axis leaves y alone and flips the sign of x, because the point moves left or right across that line, not up or down. (5, -3) reflected across the y-axis is (-5, -3), not (5, 3).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Reflecting a point across the x-axis keeps the x-coordinate the same and flips the sign of the y-coordinate.',
        'Reflecting a point across the y-axis keeps the y-coordinate the same and flips the sign of the x-coordinate.',
        'The coordinate that changes is the one that moves across the line, never the one named by the axis.',
        'Reflecting across both axes flips both coordinates\' signs, in either order.',
        'A reflection sits the same distance from the axis as the original point, just on the other side.',
        'Finding a reflection is reading off an opposite, never adding, subtracting, multiplying, or dividing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Reflecting Points Across the Axes' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
