/**
 * Grade 6 Math — Unit 6 CED 6.2: Reflecting Points Across the Axes.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.reflecting-points-across-the-axes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U6_REFLECTING_POINTS_ACROSS_THE_AXES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.reflecting-points-across-the-axes.v1',
  course: 'Grade 6 Math',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Reflecting Points Across the Axes',
  planId: 'evelyn.ms.m6math.reflecting-points-across-the-axes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.reflecting-points-across-the-axes.v1' }],
  theory: [
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'framework', title: 'Reflecting across the x-axis flips the y-coordinate', content: `REFLECTING ACROSS THE X-AXIS FLIPS THE Y-COORDINATE — reflecting a point across the x-axis, the horizontal line, moves it straight up or down to the opposite side. The x-coordinate does not move sideways, so it stays the same. The y-coordinate becomes its opposite: the point (x, y) reflects to (x, -y).` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'framework', title: 'Reflecting across the y-axis flips the x-coordinate', content: `REFLECTING ACROSS THE Y-AXIS FLIPS THE X-COORDINATE — reflecting a point across the y-axis, the vertical line, moves it straight left or right to the opposite side. The y-coordinate does not move up or down, so it stays the same. The x-coordinate becomes its opposite: the point (x, y) reflects to (-x, y).` },
    { loId: 'm6math.reflecting-points-across-the-axes', content: `THE COORDINATE THAT CHANGES IS THE ONE THAT MOVES, NOT THE ONE NAMED BY THE AXIS — this is the easiest place to get turned around. Reflecting across the x-axis flips y, not x. Reflecting across the y-axis flips x, not y. Before flipping any sign, say out loud which line the point is crossing and which direction that sends it.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'framework', title: 'Reflecting across both axes flips both signs', content: `REFLECTING ACROSS BOTH AXES FLIPS BOTH SIGNS — reflect a point across the x-axis, then reflect that new point across the y-axis, and both coordinates come out with the opposite sign: (x, y) ends at (-x, -y). Doing the y-axis first and the x-axis second lands on the exact same final point.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'framework', title: 'A reflection keeps the same distance from the line, on the other side', content: `A REFLECTION KEEPS THE SAME DISTANCE FROM THE LINE, ON THE OTHER SIDE — a point 5 units above the x-axis reflects to a point 5 units below it. A point 4 units left of the y-axis reflects to a point 4 units right of it. The distance from the axis never changes; only the side does.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'framework', title: 'Flipping a sign is not computing', content: `FLIPPING A SIGN IS NOT COMPUTING — finding a reflection never means adding, subtracting, multiplying, or dividing. It means reading the coordinate you already have and writing down its opposite, the same way +3 and -3 from Lesson 5.1 are opposites of each other.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'definition', title: 'reflection', content: `a flip of a point to the opposite side of a line, landing the same distance from that line as the original point.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'definition', title: 'x-axis', content: `the horizontal number line on a coordinate plane; reflecting a point across it flips the sign of the y-coordinate.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'definition', title: 'y-axis', content: `the vertical number line on a coordinate plane; reflecting a point across it flips the sign of the x-coordinate.` },
    { loId: 'm6math.reflecting-points-across-the-axes', kind: 'definition', title: 'opposite', content: `two numbers the same distance from zero on opposite sides, such as 4 and -4; a reflected coordinate is always the opposite of the original coordinate.` },
  ],
  methods: [
    {
      title: 'Worked booth two single reflections',
      steps: [
        `Start with the booth's coordinates: (4, 5).`,
        `Reflect across the x-axis. This flip is straight up or down, so the x-coordinate does not move: it stays 4. The y-coordinate becomes its opposite: 5 becomes -5. The first decoy is (4, -5).`,
        `Reflect across the y-axis instead. This flip is straight left or right, so the y-coordinate does not move: it stays 5. The x-coordinate becomes its opposite: 4 becomes -4. The second decoy is (-4, 5).`,
        `WRONG: reflecting across the x-axis by flipping the x-coordinate instead, giving (-4, 5). CORRECT: that point is actually the reflection across the y-axis. Flipping across the x-axis changes y, not x, so check which line you are crossing before you flip a sign.`,
        `Check by comparing distances from each line. The booth sits 5 units above the x-axis, and (4, -5) sits 5 units below it: same distance, opposite side, exactly what a reflection across the x-axis means. The booth sits 4 units right of the y-axis, and (-4, 5) sits 4 units left of it: same distance, opposite side, exactly what a reflection across the y-axis means.`,
      ],
      example: { problem: `On the carnival grid, the ring-toss booth sits at (4, 5), using the fountain as the origin (0, 0). You need two decoys: the reflection of the booth across the x-axis, and the reflection of the booth across the y-axis. Find both.`, solution: 'Reflection across the x-axis: (4, -5). Reflection across the y-axis: (-4, 5).' },
      relatedLoIds: ['m6math.reflecting-points-across-the-axes'],
    },
    {
      title: 'Worked clue both axes',
      steps: [
        'Start at (-6, 3).',
        `Reflect across the x-axis first: the x-coordinate stays the same, and the y-coordinate flips sign. (-6, 3) becomes (-6, -3).`,
        `Now reflect that point, (-6, -3), across the y-axis: the y-coordinate stays the same, and the x-coordinate flips sign. (-6, -3) becomes (6, -3).`,
        `The final decoy is (6, -3). Both coordinates ended up with the opposite sign from where they started: -6 became 6, and 3 became -3. Reflecting across both axes always flips both signs, no matter which axis goes first.`,
        `WRONG: flipping only one sign and stopping, such as writing (6, 3) or (-6, -3) as the final answer. CORRECT: reflecting across both axes means both coordinates change sign, not just one.`,
        `Check by comparing distances from each line. (-6, 3) sits 6 units left of the y-axis and 3 units above the x-axis. (6, -3) sits 6 units right of the y-axis and 3 units below the x-axis: the same two distances, both flipped to the opposite side.`,
      ],
      example: { problem: `A clue is hidden at (-6, 3) on the same grid. The final decoy for this clue comes from reflecting the point across the x-axis, and then reflecting that new point across the y-axis. Find the final decoy.`, solution: '(6, -3)' },
      relatedLoIds: ['m6math.reflecting-points-across-the-axes'],
    },
  ],
  pointers: [
    { content: `Students often say "(-5, -3)" — Reflecting across the x-axis leaves x alone and flips the sign of y, because the point moves up or down across that line, not sideways. (5, -3) reflected across the x-axis is (5, 3), not (-5, -3).`, kind: 'common-error' },
    { content: `Students often say "(5, 3)" — Reflecting across the y-axis leaves y alone and flips the sign of x, because the point moves left or right across that line, not up or down. (5, -3) reflected across the y-axis is (-5, -3), not (5, 3).`, kind: 'common-error' },
    { content: `Reflecting a point across the x-axis keeps the x-coordinate the same and flips the sign of the y-coordinate.`, kind: 'tip' },
    { content: `Reflecting a point across the y-axis keeps the y-coordinate the same and flips the sign of the x-coordinate.`, kind: 'tip' },
    { content: `The coordinate that changes is the one that moves across the line, never the one named by the axis.`, kind: 'tip' },
    { content: `Reflecting across both axes flips both coordinates' signs, in either order.`, kind: 'tip' },
    { content: `A reflection sits the same distance from the axis as the original point, just on the other side.`, kind: 'tip' },
    { content: `Finding a reflection is reading off an opposite, never adding, subtracting, multiplying, or dividing.`, kind: 'tip' },
  ],
};
