/**
 * Grade 6 Math — Unit 6 CED 6.3: Finding Distance Between Points.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.finding-distance-between-points.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U6_FINDING_DISTANCE_BETWEEN_POINTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.finding-distance-between-points.v1',
  course: 'Grade 6 Math',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Finding Distance Between Points',
  planId: 'evelyn.ms.m6math.finding-distance-between-points.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.finding-distance-between-points.v1' }],
  theory: [
    { loId: 'm6math.finding-distance-between-points', kind: 'framework', title: 'A shared coordinate puts both points on one straight line', content: `A SHARED COORDINATE PUTS BOTH POINTS ON ONE STRAIGHT LINE — if two points have the same second coordinate, they sit on the same horizontal line, the same number of blocks up or down from Main Street. If they have the same first coordinate, they sit on the same vertical line, the same number of blocks left or right of Center Avenue.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'framework', title: 'Look only at the coordinate that differs', content: `LOOK ONLY AT THE COORDINATE THAT DIFFERS — the matching coordinate is not part of the distance at all; it only tells you which line both points sit on. The coordinate that changes between the two points is the one that decides how far apart they are.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'framework', title: `Find each point's distance from zero first`, content: `FIND EACH POINT'S DISTANCE FROM ZERO FIRST — before comparing the two points, find how far each one sits from zero along that shared line. That distance is exactly what absolute value measures, the same meaning from row 5.3: |4| is 4, and |-6| is 6, no matter which side of zero the point sits on.` },
    { loId: 'm6math.finding-distance-between-points', content: `SAME SIDE OF ZERO: COUNT THE GAP BETWEEN THE TWO DISTANCES — if the differing coordinate is positive for both points, or negative for both points, the two points sit on the same side of zero. The shorter distance from zero fits inside the longer one, so subtract the shorter distance from the longer one to find the gap between them.` },
    { loId: 'm6math.finding-distance-between-points', content: `OPPOSITE SIDES OF ZERO: ADD THE TWO DISTANCES — if the differing coordinate is positive for one point and negative for the other, the zero line sits between the two points. Add their two distances from zero together to cross all the way from one point to the other.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'framework', title: 'When neither coordinate matches, this method does not apply', content: `WHEN NEITHER COORDINATE MATCHES, THIS METHOD DOES NOT APPLY — if two points do not share a first or second coordinate, they are not lined up on one straight horizontal or vertical line, and counting or adding along a single line will not work. Finding that distance needs a different method that this course does not cover here.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'definition', title: 'absolute value', content: `the distance a number sits from zero on the number line, the same meaning used in row 5.3, now measured along one line of the coordinate grid.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'definition', title: 'same first coordinate', content: `two points whose x-coordinates match, so they sit on the same vertical line on the grid.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'definition', title: 'same second coordinate', content: `two points whose y-coordinates match, so they sit on the same horizontal line on the grid.` },
    { loId: 'm6math.finding-distance-between-points', kind: 'definition', title: 'same side of zero', content: `two coordinates that are both positive or both negative, so the zero line does not sit between the two points.` },
  ],
  methods: [
    {
      title: 'Worked library and school',
      steps: [
        `Both points have the same second coordinate, 4, so the library and the school sit on the same horizontal line, four blocks up from Main Street. Only the first coordinates, 2 and 9, decide how far apart they are along that line.`,
        `Find each point's distance from zero along that line: the library is |2| = 2 blocks from Center Avenue, and the school is |9| = 9 blocks from Center Avenue.`,
        `Both 2 and 9 are positive, so the library and the school sit on the same side of Center Avenue. Since they are on the same side, subtract the shorter distance from the longer one to find the gap: 9 - 2 = 7 blocks.`,
        `Check by counting on the map: starting at x = 2 and stepping one block at a time to x = 9, count 3, 4, 5, 6, 7, 8, 9 — that is 7 steps, which matches the subtraction.`,
        'The library and the school are 7 blocks apart.',
      ],
      example: { problem: `The library sits at (2, 4) and the school sits at (9, 4) on the neighborhood map, where each unit is one block. Find the distance between the library and the school.`, solution: '7 blocks' },
      relatedLoIds: ['m6math.finding-distance-between-points'],
    },
    {
      title: 'Worked fountain and bench',
      steps: [
        `Both points have the same first coordinate, -3, so the fountain and the bench sit on the same vertical line, three blocks to the left of Center Avenue. Only the second coordinates, 4 and -6, decide how far apart they are along that line.`,
        `4 is positive and -6 is negative, so the fountain sits above Main Street and the bench sits below it. Main Street, the zero line for this direction, falls between the two points.`,
        `Find each point's distance from that zero line: the fountain is |4| = 4 blocks above Main Street, and the bench is |-6| = 6 blocks below it.`,
        `WRONG: treating this like the library-and-school example and subtracting one distance from the other, 6 - 4 = 2 blocks. Subtracting only works when both points sit on the same side of zero, and here they do not. CORRECT: since Main Street sits between the fountain and the bench, add their two distances from zero instead: 4 + 6 = 10 blocks.`,
        `Check by counting on the map: from the fountain at y = 4, count down through 3, 2, 1, 0 to reach Main Street — that is 4 blocks — then keep counting down through -1, -2, -3, -4, -5, -6 to reach the bench — 6 more blocks. 4 blocks plus 6 blocks is 10 blocks total, matching the addition.`,
        'The fountain and the bench are 10 blocks apart.',
      ],
      example: { problem: `The park fountain sits at (-3, 4) and the park bench sits at (-3, -6) on the neighborhood map, where each unit is one block. Find the distance between the fountain and the bench.`, solution: '10 blocks' },
      relatedLoIds: ['m6math.finding-distance-between-points'],
    },
  ],
  pointers: [
    { content: `Students often say "5 blocks" — 3 and -8 are on opposite sides of zero, one positive and one negative, so the zero line falls between the two points. That means the two distances from zero, 3 and 8, need to be added together, not subtracted: 3 + 8 = 11 blocks. Subtracting only works when both points sit on the same side of zero.`, kind: 'common-error' },
    { content: `Students often say "6 blocks" — (2, 4) and (9, 10) do not share either coordinate, so they are not lined up on one straight horizontal or vertical line. The counting and adding methods from this lesson only work when two points share a coordinate. Finding the distance between two points that share neither coordinate needs a different method that this course does not cover here.`, kind: 'common-error' },
    { content: `Two points that share a coordinate sit on one straight line: the same horizontal line if the second coordinates match, the same vertical line if the first coordinates match.`, kind: 'tip' },
    { content: `Only the coordinate that differs between the two points decides the distance; the matching coordinate just says which line they are on.`, kind: 'tip' },
    { content: `Absolute value measures each point's distance from zero along that shared line.`, kind: 'tip' },
    { content: `If both points sit on the same side of zero, subtract the shorter distance from zero from the longer one to find the gap.`, kind: 'tip' },
    { content: `If the two points sit on opposite sides of zero, add their two distances from zero together instead of subtracting.`, kind: 'tip' },
    { content: `This method only works when two points share a first or second coordinate; when neither matches, a different method is needed.`, kind: 'tip' },
  ],
};
