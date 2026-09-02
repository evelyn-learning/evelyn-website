/**
 * Grade 6 Math — The Coordinate Plane: Finding Distance Between Points.
 *
 * CONCEPT-LED fan-out lesson. Row 6.2 taught reflections using sign changes;
 * this row turns "distance from zero" (absolute value, row 5.3) into a way to
 * measure the gap between two points that already sit on one straight grid
 * line, without ever subtracting one signed coordinate from another (CCSS
 * 6.NS.C.8). The whole lesson runs on one rule with two branches: when both
 * points sit on the same side of zero, count the gap between their two
 * distances from zero; when they sit on opposite sides, the zero line falls
 * between them, so add those two distances instead. Every sum or difference
 * in this lesson combines two NONNEGATIVE distances-from-zero, never a
 * positive coordinate combined directly with a negative one — that is how
 * this row teaches "using absolute value" the way the standard asks, while
 * staying out of Grade 7's signed-number arithmetic.
 *
 * SCOPE GUARD: This lesson finds the distance between two points ONLY when
 * they share a first or second coordinate, using each point's absolute
 * value (its distance from zero) -- counted as a gap when both points sit on
 * the same side of zero, added together when they sit on opposite sides. It
 * never adds, subtracts, multiplies, or divides a positive coordinate
 * together with a negative one to get an answer; every sum and difference in
 * this plan combines two nonnegative distances-from-zero, which is ordinary
 * whole-number arithmetic, not the signed-number arithmetic Grade 7 owns.
 * Two points that share NEITHER coordinate are described only as a case this
 * lesson's method does not reach; the diagonal-distance method for that case
 * (the Pythagorean theorem) is Grade 8 and is never taught, named, or used
 * here. Plotting points is row 6.1, reflecting them across an axis is row
 * 6.2, and multi-step real-world coordinate problems are row 6.4; this row
 * is the single skill of measuring a straight-line gap between two points
 * already known to share a coordinate.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U6_FINDING_DISTANCE_BETWEEN_POINTS: LessonPlan = {
  id: 'evelyn.ms.m6math.finding-distance-between-points.v1',
  title: 'Finding Distance Between Points',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.finding-distance-between-points',
      standard: 'M6MATH-6.3',
      description:
        'Find the distance between two points that share a first or second coordinate, using absolute value (CCSS 6.NS.C.8).',
    },
  ],
  prerequisites: ['m6math.reflecting-points-across-the-axes'],
  followUps: ['m6math.solving-real-world-coordinate-plane-problems'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put the student on one shared grid line before any distance is measured.',
      script:
        'Your class is doing a scavenger hunt around the neighborhood, using a map drawn as a coordinate grid. Main Street runs east to west and is the x-axis. Center Avenue runs north to south and is the y-axis. They cross at (0, 0), and each unit on the grid is one block. The library sits at (2, 4) and the school sits at (9, 4). Both buildings are exactly four blocks up from Main Street, so they sit on the very same straight line across the map. How many blocks apart are they, walking straight down that line? Today you learn a way to answer that using nothing but absolute value, no matter which side of zero the two points sit on.',
      suggestedTools: ['show_coordinate_plane'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distance-on-a-shared-line',
      kind: 'concept',
      goal: 'Build the two-branch rule for measuring a straight-line gap using each point\'s distance from zero.',
      keyIdeas: [
        'A SHARED COORDINATE PUTS BOTH POINTS ON ONE STRAIGHT LINE — if two points have the same second coordinate, they sit on the same horizontal line, the same number of blocks up or down from Main Street. If they have the same first coordinate, they sit on the same vertical line, the same number of blocks left or right of Center Avenue.',
        'LOOK ONLY AT THE COORDINATE THAT DIFFERS — the matching coordinate is not part of the distance at all; it only tells you which line both points sit on. The coordinate that changes between the two points is the one that decides how far apart they are.',
        'FIND EACH POINT\'S DISTANCE FROM ZERO FIRST — before comparing the two points, find how far each one sits from zero along that shared line. That distance is exactly what absolute value measures, the same meaning from row 5.3: |4| is 4, and |-6| is 6, no matter which side of zero the point sits on.',
        'SAME SIDE OF ZERO: COUNT THE GAP BETWEEN THE TWO DISTANCES — if the differing coordinate is positive for both points, or negative for both points, the two points sit on the same side of zero. The shorter distance from zero fits inside the longer one, so subtract the shorter distance from the longer one to find the gap between them.',
        'OPPOSITE SIDES OF ZERO: ADD THE TWO DISTANCES — if the differing coordinate is positive for one point and negative for the other, the zero line sits between the two points. Add their two distances from zero together to cross all the way from one point to the other.',
        'WHEN NEITHER COORDINATE MATCHES, THIS METHOD DOES NOT APPLY — if two points do not share a first or second coordinate, they are not lined up on one straight horizontal or vertical line, and counting or adding along a single line will not work. Finding that distance needs a different method that this course does not cover here.',
      ],
      vocabulary: [
        {
          term: 'absolute value',
          definition:
            'the distance a number sits from zero on the number line, the same meaning used in row 5.3, now measured along one line of the coordinate grid.',
        },
        {
          term: 'same first coordinate',
          definition: 'two points whose x-coordinates match, so they sit on the same vertical line on the grid.',
        },
        {
          term: 'same second coordinate',
          definition: 'two points whose y-coordinates match, so they sit on the same horizontal line on the grid.',
        },
        {
          term: 'same side of zero',
          definition:
            'two coordinates that are both positive or both negative, so the zero line does not sit between the two points.',
        },
      ],
      suggestedTools: ['show_coordinate_plane', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-library-and-school',
      kind: 'worked_example',
      problem:
        'The library sits at (2, 4) and the school sits at (9, 4) on the neighborhood map, where each unit is one block. Find the distance between the library and the school.',
      steps: [
        'Both points have the same second coordinate, 4, so the library and the school sit on the same horizontal line, four blocks up from Main Street. Only the first coordinates, 2 and 9, decide how far apart they are along that line.',
        'Find each point\'s distance from zero along that line: the library is |2| = 2 blocks from Center Avenue, and the school is |9| = 9 blocks from Center Avenue.',
        'Both 2 and 9 are positive, so the library and the school sit on the same side of Center Avenue. Since they are on the same side, subtract the shorter distance from the longer one to find the gap: 9 - 2 = 7 blocks.',
        'Check by counting on the map: starting at x = 2 and stepping one block at a time to x = 9, count 3, 4, 5, 6, 7, 8, 9 — that is 7 steps, which matches the subtraction.',
        'The library and the school are 7 blocks apart.',
      ],
      answer: '7 blocks',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fountain-and-bench',
      kind: 'worked_example',
      problem:
        'The park fountain sits at (-3, 4) and the park bench sits at (-3, -6) on the neighborhood map, where each unit is one block. Find the distance between the fountain and the bench.',
      steps: [
        'Both points have the same first coordinate, -3, so the fountain and the bench sit on the same vertical line, three blocks to the left of Center Avenue. Only the second coordinates, 4 and -6, decide how far apart they are along that line.',
        '4 is positive and -6 is negative, so the fountain sits above Main Street and the bench sits below it. Main Street, the zero line for this direction, falls between the two points.',
        'Find each point\'s distance from that zero line: the fountain is |4| = 4 blocks above Main Street, and the bench is |-6| = 6 blocks below it.',
        'WRONG: treating this like the library-and-school example and subtracting one distance from the other, 6 - 4 = 2 blocks. Subtracting only works when both points sit on the same side of zero, and here they do not. CORRECT: since Main Street sits between the fountain and the bench, add their two distances from zero instead: 4 + 6 = 10 blocks.',
        'Check by counting on the map: from the fountain at y = 4, count down through 3, 2, 1, 0 to reach Main Street — that is 4 blocks — then keep counting down through -1, -2, -3, -4, -5, -6 to reach the bench — 6 more blocks. 4 blocks plus 6 blocks is 10 blocks total, matching the addition.',
        'The fountain and the bench are 10 blocks apart.',
      ],
      answer: '10 blocks',
      estimatedMinutes: 4,
    },
    {
      id: 'try-playground-and-pool',
      kind: 'try_yourself',
      problem:
        'The playground sits at (3, 5) and the community pool sits at (11, 5) on the neighborhood map. Both points share the same second coordinate. How many blocks apart are the playground and the pool?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3 blocks' },
        { id: 'b', text: '8 blocks', correct: true },
        { id: 'c', text: '14 blocks' },
        { id: 'd', text: '11 blocks' },
      ],
      expectedAnswer: '8 blocks',
      hints: [
        'Both points share the same second coordinate, so look only at the two first coordinates, 3 and 11, to find how far apart they sit along that line.',
        'Both 3 and 11 are positive, so the playground and the pool sit on the same side of zero. Find the gap between those two distances from zero instead of adding them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-flagpole-and-time-capsule',
      kind: 'try_yourself',
      problem:
        'The school flagpole sits at (-4, 6) and a buried time capsule sits at (-4, -9) on the neighborhood map. Both points share the same first coordinate. How many blocks apart are the flagpole and the time capsule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3 blocks' },
        { id: 'b', text: '6 blocks' },
        { id: 'c', text: '9 blocks' },
        { id: 'd', text: '15 blocks', correct: true },
      ],
      expectedAnswer: '15 blocks',
      hints: [
        'Both points share the same first coordinate, so look only at the two second coordinates, 6 and -9, to find how far apart they sit along that line.',
        '6 is positive and -9 is negative, so the flagpole and the time capsule sit on opposite sides of zero. Find each one\'s distance from zero, 6 and 9, then add those two distances together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-park-and-garden',
      kind: 'try_yourself',
      problem:
        'The park sits at (7, -2) and the community garden sits at (7, -15) on the neighborhood map, where each unit is one block. Both points share the same first coordinate. How many blocks apart are the park and the garden? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        'Both points share the same first coordinate, so use the two second coordinates, -2 and -15, to find the distance between them.',
        '-2 and -15 are both negative, so the park and the garden sit on the same side of zero. Find each one\'s distance from zero, 2 and 15, then find the gap between those two distances.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-forgot-to-check-the-sides',
      kind: 'misconception_check',
      question:
        'A student is asked to find the distance between (-5, 3) and (-5, -8), which share the same first coordinate. The student finds each point\'s distance from zero, 3 and 8, and then subtracts to get 5 blocks. A second student is asked to find the distance between (2, 4) and (9, 10), which share neither coordinate, and tries the same subtraction method on the two second coordinates alone, getting 6. What went wrong in each case?',
      commonErrors: [
        {
          answer: '5 blocks',
          misconception:
            'Always subtracting the two distances from zero without first checking whether the points sit on the same side of zero or on opposite sides.',
          correctsTo:
            '3 and -8 are on opposite sides of zero, one positive and one negative, so the zero line falls between the two points. That means the two distances from zero, 3 and 8, need to be added together, not subtracted: 3 + 8 = 11 blocks. Subtracting only works when both points sit on the same side of zero.',
        },
        {
          answer: '6 blocks',
          misconception: 'Trying to use the same-line distance method on two points that do not share a first or second coordinate at all.',
          correctsTo:
            '(2, 4) and (9, 10) do not share either coordinate, so they are not lined up on one straight horizontal or vertical line. The counting and adding methods from this lesson only work when two points share a coordinate. Finding the distance between two points that share neither coordinate needs a different method that this course does not cover here.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two points that share a coordinate sit on one straight line: the same horizontal line if the second coordinates match, the same vertical line if the first coordinates match.',
        'Only the coordinate that differs between the two points decides the distance; the matching coordinate just says which line they are on.',
        'Absolute value measures each point\'s distance from zero along that shared line.',
        'If both points sit on the same side of zero, subtract the shorter distance from zero from the longer one to find the gap.',
        'If the two points sit on opposite sides of zero, add their two distances from zero together instead of subtracting.',
        'This method only works when two points share a first or second coordinate; when neither matches, a different method is needed.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Finding Distance Between Points' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
