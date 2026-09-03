/**
 * Grade 6 Math — Unit 9 CED 9.2: Polygons in the Coordinate Plane.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.polygons-in-the-coordinate-plane.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U9_POLYGONS_IN_THE_COORDINATE_PLANE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.polygons-in-the-coordinate-plane.v1',
  course: 'Grade 6 Math',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Polygons in the Coordinate Plane',
  planId: 'evelyn.ms.m6math.polygons-in-the-coordinate-plane.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.polygons-in-the-coordinate-plane.v1' }],
  theory: [
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'framework', title: 'A polygon is built from its vertices, in order', content: `A POLYGON IS BUILT FROM ITS VERTICES, IN ORDER — a polygon is a closed, flat shape made only of straight sides, no gaps and no curves. Its corner points are called vertices (one corner is a vertex). To draw a polygon from coordinates, plot every vertex first, then connect each one to the next with a straight segment, following the order the vertices are listed in.` },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'framework', title: 'Close the shape by connecting the last vertex back to the first', content: `CLOSE THE SHAPE BY CONNECTING THE LAST VERTEX BACK TO THE FIRST — after connecting every vertex to the next one in the list, draw one more segment from the very last vertex back to the very first vertex. Skip that last segment and the outline stays open, which is not a polygon at all, just a connected path with two loose ends.` },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'framework', title: 'A side that shares a coordinate is horizontal or vertical', content: `A SIDE THAT SHARES A COORDINATE IS HORIZONTAL OR VERTICAL — this is exactly the test from row 6.3. If two consecutive vertices have the same second coordinate, the side connecting them is horizontal, running left-right at one fixed height. If they have the same first coordinate, the side is vertical, running up-down at one fixed left-right position.` },
    { loId: 'm6math.polygons-in-the-coordinate-plane', content: `FIND THAT SIDE'S LENGTH THE SAME WAY ROW 6.3 DID — look only at the coordinate that differs between the two vertices, and find each vertex's distance from zero along that line using absolute value. If both vertices sit on the same side of zero, subtract the shorter distance from the longer one. If they sit on opposite sides of zero, add the two distances together instead.` },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'framework', title: 'A side that changes both coordinates is diagonal', content: `A SIDE THAT CHANGES BOTH COORDINATES IS DIAGONAL — some polygons have a side connecting two vertices that share neither coordinate, so the side runs at a slant instead of straight across or straight up and down. That side is still part of the polygon, and it still gets drawn, but its exact length needs a different tool than the one in this lesson, so this lesson does not compute it.` },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'definition', title: 'polygon', content: 'a closed, flat shape made only of straight sides, with no gaps and no curves.' },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'definition', title: 'vertex (plural: vertices)', content: 'a corner point of a polygon, the spot where two sides meet.' },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'definition', title: 'side', content: 'a straight segment connecting two consecutive vertices of a polygon.' },
    { loId: 'm6math.polygons-in-the-coordinate-plane', kind: 'definition', title: 'diagonal side', content: `a side connecting two vertices that do not share a coordinate, so it runs at a slant rather than straight across or straight up and down.` },
  ],
  methods: [
    {
      title: 'Worked stage floor rectangle',
      steps: [
        'Plot the four vertices: A at (2, 3), B at (2, 8), C at (9, 8), and D at (9, 3).',
        `Connect the vertices in order: A to B, B to C, C to D. Then close the shape by connecting D back to A. Four vertices and four sides make this polygon a quadrilateral, and every side here runs straight across or straight up and down, so the shape is a rectangle.`,
        `To find the length of side AB, check what A and B share: both have first coordinate 2, so AB is a vertical side. Only the second coordinates, 3 and 8, decide its length.`,
        `Find each vertex's distance from zero along that line: A is |3| = 3 feet from zero, and B is |8| = 8 feet from zero.`,
        `Both 3 and 8 are positive, so A and B sit on the same side of zero. Subtract the shorter distance from the longer one: 8 - 3 = 5 feet.`,
        `Check by counting on the grid: starting at y = 3 and stepping up one foot at a time to y = 8, count 4, 5, 6, 7, 8 — that is 5 steps, which matches the subtraction.`,
        'Side AB is 5 feet long.',
      ],
      example: { problem: `The stage crew lists the four corners of the stage floor, in order, as A(2, 3), B(2, 8), C(9, 8), and D(9, 3), where each unit on the blueprint is one foot. Draw the stage floor and find the length of side AB.`, solution: '5 feet' },
      relatedLoIds: ['m6math.polygons-in-the-coordinate-plane'],
    },
    {
      title: 'Worked garden bed hexagon',
      steps: [
        `Plot the six vertices and connect them in order, P to Q, Q to R, R to S, S to T, T to U, and finally U back to P to close the shape. This gives a six-sided polygon shaped like the letter L, and every side is either horizontal or vertical, since every consecutive pair of vertices shares a coordinate.`,
        `Side QR connects Q(-4, -3) and R(2, -3). Both share the second coordinate -3, so QR is horizontal, and only the first coordinates, -4 and 2, decide its length.`,
        `Find each vertex's distance from zero along that line: Q is |-4| = 4 meters from zero, and R is |2| = 2 meters from zero.`,
        `-4 is negative and 2 is positive, so Q and R sit on opposite sides of zero. WRONG: subtracting the two distances anyway, 4 - 2 = 2 meters, the same move that worked for side AB in the last example. CORRECT: since zero falls between Q and R, add their two distances from zero instead: 4 + 2 = 6 meters.`,
        `Check by counting on the grid: from x = -4, count right through -3, -2, -1, 0 to reach zero — that is 4 steps — then keep counting right through 1, 2 to reach R — 2 more steps. 4 steps plus 2 steps is 6 steps total, matching the addition. Side QR is 6 meters long.`,
        `Side PQ connects P(-4, 6) and Q(-4, -3). Both share the first coordinate -4, so PQ is vertical, and only the second coordinates, 6 and -3, decide its length.`,
        `P is |6| = 6 meters from zero and Q is |-3| = 3 meters from zero. 6 is positive and -3 is negative, so P and Q sit on opposite sides of zero: add the two distances, 6 + 3 = 9 meters. Side PQ is 9 meters long.`,
      ],
      example: { problem: `A community garden plot is shaped like an L. Its six vertices, in order, are P(-4, 6), Q(-4, -3), R(2, -3), S(2, 1), T(6, 1), and U(6, 6), where each unit is one meter. Find the length of side QR and the length of side PQ.`, solution: 'QR is 6 meters, PQ is 9 meters' },
      relatedLoIds: ['m6math.polygons-in-the-coordinate-plane'],
    },
  ],
  pointers: [
    { content: `Students often say "A drawing with only three sides connected, left open between D and A" — A polygon has to be a closed shape. After connecting A to B, B to C, and C to D, one more segment is needed: D back to A. Without it, the drawing is an open path with two loose ends, not a polygon.`, kind: 'common-error' },
    { content: `Students often say "2 feet" — 4 and -6 are on opposite sides of zero, one positive and one negative, so the zero line falls between the two points. The two distances from zero, 4 and 6, need to be added together, not subtracted: 4 + 6 = 10 feet. Subtracting only works when both points sit on the same side of zero.`, kind: 'common-error' },
    { content: `To draw a polygon from its vertices, plot every vertex, connect each one to the next in order, then close the shape by connecting the last vertex back to the first.`, kind: 'tip' },
    { content: `A side connecting two vertices that share a second coordinate is horizontal; a side connecting two vertices that share a first coordinate is vertical.`, kind: 'tip' },
    { content: `Find a horizontal or vertical side's length exactly like row 6.3: use each vertex's distance from zero, subtract when both are on the same side of zero, add when they are on opposite sides.`, kind: 'tip' },
    { content: `A side connecting two vertices that share neither coordinate is diagonal; this lesson names that it exists but does not compute its exact length.`, kind: 'tip' },
    { content: `Finding the area a polygon encloses is a separate skill from drawing the polygon and measuring one of its sides.`, kind: 'tip' },
  ],
};
