/**
 * Grade 6 Math — Unit 6 CED 6.4: Real-World Coordinate Plane Problems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.solving-real-world-coordinate-plane-problems.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U6_SOLVING_REAL_WORLD_COORDINATE_PLANE_PROBLEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.solving-real-world-coordinate-plane-problems.v1',
  course: 'Grade 6 Math',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Real-World Coordinate Plane Problems',
  planId: 'evelyn.ms.m6math.solving-real-world-coordinate-plane-problems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.solving-real-world-coordinate-plane-problems.v1' }],
  theory: [
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', content: `TURN THE CLUE INTO AN ORDERED PAIR, IN ORDER -- "4 blocks east and 3 blocks south of Town Square" becomes the point (4, -3). The east-west number becomes the x-coordinate and comes first, exactly like the order of an ordered pair (x, y).` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', content: `EAST AND NORTH ARE POSITIVE; WEST AND SOUTH ARE NEGATIVE -- on the Riverside map, Elm Street is the x-axis and Oak Avenue is the y-axis. East of Town Square gives a positive x-coordinate, and west gives a negative one. North gives a positive y-coordinate, and south gives a negative one. Get the sign from the direction word every time, never from where the number sits in the sentence.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', content: `THE SIGNS ALONE NAME THE QUADRANT -- before plotting exactly, (positive, positive) sits northeast of Town Square, (negative, positive) sits northwest, (negative, negative) sits southwest, and (positive, negative) sits southeast. Checking the signs first catches a plotting mistake before it happens.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', content: `A SHARED COORDINATE MEANS A SHARED STREET -- two flags with the same x-coordinate sit on the same north-south street, one straight up or down the map from the other. Two flags with the same y-coordinate sit on the same east-west street. Spotting the shared coordinate is what tells you two flags can be compared by counting blocks along one street.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', content: `COUNT ALONG THE SHARED STREET TO FIND THE DISTANCE -- once two points share a coordinate, compare their other coordinate. If both values sit on the same side of zero, subtract the smaller distance from the larger one. If they sit on opposite sides of zero, add the two distances from zero instead. Either way, the answer is a distance, so it is never negative.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', kind: 'definition', title: 'ordered pair', content: `a pair of numbers written (x, y) that names one exact point, with the x-coordinate first and the y-coordinate second.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', kind: 'definition', title: 'quadrant', content: `one of the four regions the x-axis and y-axis divide the coordinate plane into, identified by the signs of the coordinates in it.` },
    { loId: 'm6math.solving-real-world-coordinate-plane-problems', kind: 'definition', title: 'origin', content: `the point (0, 0), where the x-axis and y-axis cross. On the Riverside map, this is Town Square.` },
  ],
  methods: [
    {
      title: 'Worked clue to point and quadrant',
      steps: [
        `Town Square is the origin, (0, 0). On the Riverside map, east is the positive x-direction and south is the negative y-direction.`,
        `Flag 1: 4 blocks east gives x = 4. 3 blocks south gives y = -3. Flag 1 = (4, -3).`,
        'Flag 2: 4 blocks east gives x = 4. 5 blocks north gives y = 5. Flag 2 = (4, 5).',
        `WRONG: writing Flag 1 as (-4, -3), making east negative because the clue felt like it was moving away from Town Square. CORRECT: east is always the positive x-direction on this map, for every flag. Only west gives a negative x-coordinate.`,
        `Check the quadrant from the signs alone. Flag 1 is (positive, negative), so it sits southeast of Town Square, in Quadrant IV. Flag 2 is (positive, positive), so it sits northeast of Town Square, in Quadrant I.`,
        `Notice both flags share the same x-coordinate, 4. That means Flag 1 and Flag 2 sit on the very same north-south street, four blocks east of Town Square, with one flag south of Town Square and the other north of it.`,
      ],
      example: { problem: `Team Red's clue says: "Flag 1 is 4 blocks east of Town Square and 3 blocks south." Team Blue's clue says: "Flag 2 is 4 blocks east of Town Square and 5 blocks north." Write each flag as an ordered pair, and name which quadrant each one sits in.`, solution: 'Flag 1 = (4, -3), Quadrant IV. Flag 2 = (4, 5), Quadrant I.' },
      relatedLoIds: ['m6math.solving-real-world-coordinate-plane-problems'],
    },
    {
      title: 'Worked distance along shared street',
      steps: [
        `Flag 1 and Flag 2 share the x-coordinate 4, so compare their y-coordinates: -3 and 5. One is negative and one is positive, so these two points sit on OPPOSITE sides of Town Square's east-west street. Add their distances from zero: 3 + 5 = 8 blocks.`,
        `Flag 3 and Flag 4 share the x-coordinate -3, so compare their y-coordinates: 6 and 2. Both are positive, so these two points sit on the SAME side of Town Square's east-west street. Subtract the smaller distance from the larger one instead of adding: 6 - 2 = 4 blocks.`,
        `WRONG: subtracting for Flag 1 and Flag 2 the same way, 5 - 3 = 2 blocks. CORRECT: subtracting only works when both points sit on the same side of zero. Flag 1 and Flag 2 sit on opposite sides (-3 and 5), so their distances from zero must be added, not subtracted: 3 + 5 = 8 blocks.`,
        `Check both answers by counting on the street. From -3 up through 0 to 5 is 3 blocks plus 5 blocks, which is 8. From 2 up to 6 is 4 blocks, counted directly, since that hop never crosses zero.`,
      ],
      example: { problem: `Flag 1 and Flag 2 sit on the same street at (4, -3) and (4, 5). On a different street, three blocks west of Town Square, Flag 3 is at (-3, 6) and Flag 4 is at (-3, 2). Find how many blocks apart each pair of flags is, walking straight along their shared street.`, solution: 'Flag 1 to Flag 2: 8 blocks. Flag 3 to Flag 4: 4 blocks.' },
      relatedLoIds: ['m6math.solving-real-world-coordinate-plane-problems'],
    },
  ],
  pointers: [
    { content: `Students often say "(6, -4)" — West means the x-coordinate is negative, so x = -6. North means the y-coordinate is positive, so y = 4. The correct point is (-6, 4). Each coordinate gets its sign from its own direction word, never from its position in the sentence.`, kind: 'common-error' },
    { content: `Students often say "6" — 7 and -1 sit on opposite sides of Town Square's east-west street: 7 is 7 blocks north of it, and -1 is 1 block south of it. Since the two points are on opposite sides, add the two distances instead of subtracting them: 7 + 1 = 8 blocks. Subtracting only works when both points sit on the same side of the shared axis.`, kind: 'common-error' },
    { content: `Turn a real-world clue into an ordered pair by matching each direction word to its coordinate: east and north are positive, west and south are negative.`, kind: 'tip' },
    { content: `The x-coordinate is the east-west number and comes first; the y-coordinate is the north-south number and comes second, matching the order of (x, y).`, kind: 'tip' },
    { content: `The signs of an ordered pair name its quadrant before you ever plot it: for example, (positive, positive) sits northeast of Town Square.`, kind: 'tip' },
    { content: `Two points that share an x-coordinate sit on the same north-south street; two that share a y-coordinate sit on the same east-west street.`, kind: 'tip' },
    { content: `To find the distance between two points that share a coordinate, add their distances from zero when they sit on opposite sides of the shared axis, and subtract when they sit on the same side.`, kind: 'tip' },
    { content: `Plotting a point is only the first step. The real question is always what the graphed points tell you, like which street two flags share or how far apart they sit.`, kind: 'tip' },
    { content: `Get the sign from the direction word, never from where the number sits in the sentence. West and south are always negative; east and north are always positive — even if the number comes first.`, kind: 'common-error' },
    { content: `Remember: x-coordinate first, y-coordinate second. East-west (x) comes before north-south (y) in the ordered pair, just like in the alphabet.`, kind: 'vocab-note' },
    { content: `Before plotting, check the signs to name the quadrant. (positive, positive) = northeast, (negative, positive) = northwest, (negative, negative) = southwest, (positive, negative) = southeast.`, kind: 'tip' },
    { content: `When two points share a coordinate, check whether the other coordinates sit on the same side or opposite sides of zero. Add distances only if opposite sides; subtract only if same side.`, kind: 'common-error' },
    { content: `A shared x-coordinate means a shared north-south street. A shared y-coordinate means a shared east-west street. Spot this before you count.`, kind: 'tip' },
    { content: `Distance is never negative. If your answer is negative, you've subtracted in the wrong direction — flip it to positive.`, kind: 'edge-case' },
    { content: `The origin (0, 0) is Town Square on the map. A point on an axis has one zero coordinate — it sits on a street that passes through Town Square.`, kind: 'vocab-note' },
  ],
};
