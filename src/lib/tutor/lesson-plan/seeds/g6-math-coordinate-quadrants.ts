/**
 * G6 — Coordinate plane: all four quadrants.
 *
 * Extends G5\'s first-quadrant work to negative coordinates. Naming
 * quadrants, plotting points, reading from a graph.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_COORDINATE_QUADRANTS: LessonPlan = {
  id: 'evelyn.g6.math.geometry.coordinate-quadrants.v1',
  title: 'Coordinate plane: four quadrants',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.ns.c.6.b',
      description: 'Find and position pairs of integers and other rational numbers on a coordinate plane.',
      standard: 'CCSS.MATH.CONTENT.6.NS.C.6.B',
    },
  ],
  prerequisites: ['ccss.math.5.g.a.1'],
  followUps: ['ccss.math.7.rp.a.2'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor coordinates to giving directions.',
      script: 'If I told you "go 3 east, 2 north" — you could find the spot. Coordinates do the same thing on a map: x tells you east-west, y tells you north-south. Today we add NEGATIVES so we can go all four directions.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-quadrants',
      kind: 'concept',
      goal: 'Four quadrants, ordered pair conventions, plotting with negatives.',
      keyIdeas: [
        'A coordinate plane has TWO number lines: x-axis (horizontal) and y-axis (vertical). They cross at the ORIGIN (0, 0).',
        'A POINT is named by an ORDERED PAIR (x, y). x first, y second.',
        'POSITIVE x → right of origin. NEGATIVE x → left.',
        'POSITIVE y → above origin. NEGATIVE y → below.',
        'FOUR QUADRANTS, numbered counterclockwise from top-right:',
        '  Quadrant I: (+, +) — top right',
        '  Quadrant II: (-, +) — top left',
        '  Quadrant III: (-, -) — bottom left',
        '  Quadrant IV: (+, -) — bottom right',
      ],
      vocabulary: [
        { term: 'origin', definition: 'the point (0, 0) where the axes cross.' },
        { term: 'quadrant', definition: 'one of four sections of the coordinate plane.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plot',
      kind: 'worked_example',
      problem: 'Plot the point (-3, 4) and identify its quadrant.',
      steps: [
        'x = -3 → start at origin, move 3 LEFT.',
        'y = 4 → from there, move 4 UP.',
        'Sign of (x, y) is (-, +) → top-left → QUADRANT II.',
      ],
      answer: 'Quadrant II',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In which quadrant is the point (5, -2)?',
      expectedAnswer: 'IV',
      responseFormat: 'free',
      hints: [
        'Sign pattern: (+, -). What quadrant has positive x, negative y?',
        'Counterclockwise from top-right: I, II, III, IV.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-axes-as-quadrant',
      kind: 'misconception_check',
      question: 'Is the point (5, 0) in Quadrant I or Quadrant IV?',
      commonErrors: [
        {
          answer: 'I',
          misconception: 'Putting points ON an axis into a quadrant.',
          correctsTo: 'Neither — points exactly ON the x-axis (y = 0) or y-axis (x = 0) are NOT in any quadrant. They\'re ON an axis. (5, 0) is on the positive x-axis.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ordered pair (x, y): x first, y second.',
        'Quadrants I-IV go counterclockwise from top-right.',
        'Sign patterns: I (+,+), II (-,+), III (-,-), IV (+,-).',
        'Points on an axis are not in any quadrant.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If point A is at (3, 5) and point B is at (-3, -5), how would you describe their relationship geometrically?',
      hint: 'They\'re reflections through the origin — equally far from origin, opposite direction. Or: a 180° rotation.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
