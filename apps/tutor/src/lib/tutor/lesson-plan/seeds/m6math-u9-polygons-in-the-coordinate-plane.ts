/**
 * Grade 6 Math — Area, Surface Area & Volume: Polygons in the Coordinate
 * Plane.
 *
 * CONCEPT-LED fan-out lesson. Row 9.1 found area from a base and a height
 * that were simply given; this row builds the mental model that turns a bare
 * list of ordered pairs into an actual shape you can see, and shows how to
 * pull a real side length out of that shape (CCSS 6.G.A.3). Plotting every
 * vertex and connecting them in order, closing the last gap back to the
 * first vertex, is the new move. Finding a side's length is NOT a new move:
 * it is row 6.3's absolute-value distance rule, reused exactly, applied to
 * whichever pair of consecutive vertices shares a coordinate. Every sum or
 * difference in this lesson combines two NONNEGATIVE distances-from-zero,
 * never a positive coordinate combined directly with a negative one — the
 * same discipline row 6.3 held, carried over here rather than reinvented.
 *
 * SCOPE GUARD: This lesson draws a polygon from its vertices' coordinates
 * and finds the length of a side that is horizontal or vertical, using row
 * 6.3's distance method: same side of zero, subtract the two distances from
 * zero; opposite sides of zero, add them. It never adds, subtracts,
 * multiplies, or divides a positive coordinate together with a negative one
 * to get an answer. A side that changes BOTH coordinates is a diagonal side;
 * this lesson names that such a side exists and states only that its exact
 * length needs a different tool (the Pythagorean theorem), which is Grade 8
 * and is never computed here. Finding the area enclosed by a polygon is row
 * 9.1's skill and does not appear here, even when a side length from this
 * lesson would feed into it; volume of rectangular prisms is row 9.3 and is
 * likewise out of scope.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U9_POLYGONS_IN_THE_COORDINATE_PLANE: LessonPlan = {
  id: 'evelyn.ms.m6math.polygons-in-the-coordinate-plane.v1',
  title: 'Polygons in the Coordinate Plane',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.polygons-in-the-coordinate-plane',
      standard: 'M6MATH-9.2',
      description:
        'Draw a polygon in the coordinate plane given the coordinates of its vertices, and find a side length using coordinates (CCSS 6.G.A.3).',
    },
  ],
  prerequisites: ['m6math.area-of-triangles-and-quadrilaterals'],
  followUps: ['m6math.volume-of-rectangular-prisms'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a shape can arrive as nothing but a list of ordered pairs, and make the student want a method for turning that list into an actual outline.',
      script:
        'Your class is building a stage for the talent show, and the stage crew hands you a blueprint. It is a coordinate grid where each unit is one foot, and it does not show a picture of the stage at all. It only lists four corner points: (2, 3), (2, 8), (9, 8), and (9, 3). Before anyone can cut a single board, you need to know what shape those four points make, and exactly how long each edge of the stage floor will be. Today you learn how to turn a list of coordinates into a real outline, and how to pull an exact side length straight out of the numbers.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vertices-to-a-polygon',
      kind: 'concept',
      goal: 'Build the plot-connect-close routine for drawing a polygon from its vertices, and reuse row 6.3\'s distance rule to measure a horizontal or vertical side.',
      keyIdeas: [
        'A POLYGON IS BUILT FROM ITS VERTICES, IN ORDER — a polygon is a closed, flat shape made only of straight sides, no gaps and no curves. Its corner points are called vertices (one corner is a vertex). To draw a polygon from coordinates, plot every vertex first, then connect each one to the next with a straight segment, following the order the vertices are listed in.',
        'CLOSE THE SHAPE BY CONNECTING THE LAST VERTEX BACK TO THE FIRST — after connecting every vertex to the next one in the list, draw one more segment from the very last vertex back to the very first vertex. Skip that last segment and the outline stays open, which is not a polygon at all, just a connected path with two loose ends.',
        'A SIDE THAT SHARES A COORDINATE IS HORIZONTAL OR VERTICAL — this is exactly the test from row 6.3. If two consecutive vertices have the same second coordinate, the side connecting them is horizontal, running left-right at one fixed height. If they have the same first coordinate, the side is vertical, running up-down at one fixed left-right position.',
        'FIND THAT SIDE\'S LENGTH THE SAME WAY ROW 6.3 DID — look only at the coordinate that differs between the two vertices, and find each vertex\'s distance from zero along that line using absolute value. If both vertices sit on the same side of zero, subtract the shorter distance from the longer one. If they sit on opposite sides of zero, add the two distances together instead.',
        'A SIDE THAT CHANGES BOTH COORDINATES IS DIAGONAL — some polygons have a side connecting two vertices that share neither coordinate, so the side runs at a slant instead of straight across or straight up and down. That side is still part of the polygon, and it still gets drawn, but its exact length needs a different tool than the one in this lesson, so this lesson does not compute it.',
      ],
      vocabulary: [
        {
          term: 'polygon',
          definition: 'a closed, flat shape made only of straight sides, with no gaps and no curves.',
        },
        {
          term: 'vertex (plural: vertices)',
          definition: 'a corner point of a polygon, the spot where two sides meet.',
        },
        {
          term: 'side',
          definition: 'a straight segment connecting two consecutive vertices of a polygon.',
        },
        {
          term: 'diagonal side',
          definition:
            'a side connecting two vertices that do not share a coordinate, so it runs at a slant rather than straight across or straight up and down.',
        },
      ],
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-stage-floor-rectangle',
      kind: 'worked_example',
      problem:
        'The stage crew lists the four corners of the stage floor, in order, as A(2, 3), B(2, 8), C(9, 8), and D(9, 3), where each unit on the blueprint is one foot. Draw the stage floor and find the length of side AB.',
      steps: [
        'Plot the four vertices: A at (2, 3), B at (2, 8), C at (9, 8), and D at (9, 3).',
        'Connect the vertices in order: A to B, B to C, C to D. Then close the shape by connecting D back to A. Four vertices and four sides make this polygon a quadrilateral, and every side here runs straight across or straight up and down, so the shape is a rectangle.',
        'To find the length of side AB, check what A and B share: both have first coordinate 2, so AB is a vertical side. Only the second coordinates, 3 and 8, decide its length.',
        'Find each vertex\'s distance from zero along that line: A is |3| = 3 feet from zero, and B is |8| = 8 feet from zero.',
        'Both 3 and 8 are positive, so A and B sit on the same side of zero. Subtract the shorter distance from the longer one: 8 - 3 = 5 feet.',
        'Check by counting on the grid: starting at y = 3 and stepping up one foot at a time to y = 8, count 4, 5, 6, 7, 8 — that is 5 steps, which matches the subtraction.',
        'Side AB is 5 feet long.',
      ],
      answer: '5 feet',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-garden-bed-hexagon',
      kind: 'worked_example',
      problem:
        'A community garden plot is shaped like an L. Its six vertices, in order, are P(-4, 6), Q(-4, -3), R(2, -3), S(2, 1), T(6, 1), and U(6, 6), where each unit is one meter. Find the length of side QR and the length of side PQ.',
      steps: [
        'Plot the six vertices and connect them in order, P to Q, Q to R, R to S, S to T, T to U, and finally U back to P to close the shape. This gives a six-sided polygon shaped like the letter L, and every side is either horizontal or vertical, since every consecutive pair of vertices shares a coordinate.',
        'Side QR connects Q(-4, -3) and R(2, -3). Both share the second coordinate -3, so QR is horizontal, and only the first coordinates, -4 and 2, decide its length.',
        'Find each vertex\'s distance from zero along that line: Q is |-4| = 4 meters from zero, and R is |2| = 2 meters from zero.',
        '-4 is negative and 2 is positive, so Q and R sit on opposite sides of zero. WRONG: subtracting the two distances anyway, 4 - 2 = 2 meters, the same move that worked for side AB in the last example. CORRECT: since zero falls between Q and R, add their two distances from zero instead: 4 + 2 = 6 meters.',
        'Check by counting on the grid: from x = -4, count right through -3, -2, -1, 0 to reach zero — that is 4 steps — then keep counting right through 1, 2 to reach R — 2 more steps. 4 steps plus 2 steps is 6 steps total, matching the addition. Side QR is 6 meters long.',
        'Side PQ connects P(-4, 6) and Q(-4, -3). Both share the first coordinate -4, so PQ is vertical, and only the second coordinates, 6 and -3, decide its length.',
        'P is |6| = 6 meters from zero and Q is |-3| = 3 meters from zero. 6 is positive and -3 is negative, so P and Q sit on opposite sides of zero: add the two distances, 6 + 3 = 9 meters. Side PQ is 9 meters long.',
      ],
      answer: 'QR is 6 meters, PQ is 9 meters',
      estimatedMinutes: 4,
    },
    {
      id: 'try-pool-deck-rectangle',
      kind: 'try_yourself',
      problem:
        'A rectangular pool deck has corners, in order, at E(1, 2), F(1, 9), G(6, 9), and H(6, 2), where each unit is one meter. What is the length of side FG?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '6 meters' },
        { id: 'b', text: '9 meters' },
        { id: 'c', text: '7 meters' },
        { id: 'd', text: '5 meters', correct: true },
      ],
      expectedAnswer: '5 meters',
      hints: [
        'F(1, 9) and G(6, 9) share the same second coordinate, 9, so side FG is horizontal. Only the first coordinates, 1 and 6, decide its length.',
        'Both 1 and 6 are positive, so F and G sit on the same side of zero. Find the gap between those two distances from zero instead of adding them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-tent-floor-quadrilateral',
      kind: 'try_yourself',
      problem:
        'A rectangular tent floor has corners, in order, at J(-6, 4), K(-6, -5), L(3, -5), and M(3, 4), where each unit is one foot. Which of these describes side JK?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'JK is diagonal, and this lesson does not find its exact length' },
        { id: 'b', text: 'JK is vertical, and it is 9 feet long', correct: true },
        { id: 'c', text: 'JK is horizontal, and it is 9 feet long' },
        { id: 'd', text: 'JK is vertical, and it is 1 foot long' },
      ],
      expectedAnswer: 'JK is vertical, and it is 9 feet long',
      hints: [
        'J(-6, 4) and K(-6, -5) share the same first coordinate, -6, so the side connecting them runs straight up and down, not at a slant and not side to side.',
        '4 is positive and -5 is negative, so J and K sit on opposite sides of zero. Find each one\'s distance from zero, 4 and 5, then add those two distances together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-mural-wall',
      kind: 'try_yourself',
      problem:
        'A rectangular mural on the gym wall has corners, in order, at W(3, -8), X(3, -1), Y(10, -1), and Z(10, -8), where each unit is one foot. What is the length of side WX? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'W(3, -8) and X(3, -1) share the same first coordinate, so side WX is vertical. Use the two second coordinates, -8 and -1, to find its length.',
        '-8 and -1 are both negative, so W and X sit on the same side of zero. Find each one\'s distance from zero, 8 and 1, then find the gap between those two distances.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skipped-the-close-and-mishandled-zero',
      kind: 'misconception_check',
      question:
        'A student is given four vertices, in order, A(1, 1), B(1, 5), C(6, 5), and D(6, 1), plots them, and connects A to B, B to C, and C to D, then stops. Separately, another student is asked for the length of a side running from (-2, 4) to (-2, -6), which share the same first coordinate, and writes 2 feet by finding |4| = 4 and |-6| = 6 and subtracting 6 - 4. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'A drawing with only three sides connected, left open between D and A',
          misconception: 'Stopping after connecting the vertices in listed order and forgetting the final segment that closes the shape.',
          correctsTo:
            'A polygon has to be a closed shape. After connecting A to B, B to C, and C to D, one more segment is needed: D back to A. Without it, the drawing is an open path with two loose ends, not a polygon.',
        },
        {
          answer: '2 feet',
          misconception: 'Always subtracting the two distances from zero without first checking whether the two points sit on the same side of zero or on opposite sides.',
          correctsTo:
            '4 and -6 are on opposite sides of zero, one positive and one negative, so the zero line falls between the two points. The two distances from zero, 4 and 6, need to be added together, not subtracted: 4 + 6 = 10 feet. Subtracting only works when both points sit on the same side of zero.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'To draw a polygon from its vertices, plot every vertex, connect each one to the next in order, then close the shape by connecting the last vertex back to the first.',
        'A side connecting two vertices that share a second coordinate is horizontal; a side connecting two vertices that share a first coordinate is vertical.',
        'Find a horizontal or vertical side\'s length exactly like row 6.3: use each vertex\'s distance from zero, subtract when both are on the same side of zero, add when they are on opposite sides.',
        'A side connecting two vertices that share neither coordinate is diagonal; this lesson names that it exists but does not compute its exact length.',
        'Finding the area a polygon encloses is a separate skill from drawing the polygon and measuring one of its sides.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.2', cedTitle: 'Polygons in the Coordinate Plane' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
