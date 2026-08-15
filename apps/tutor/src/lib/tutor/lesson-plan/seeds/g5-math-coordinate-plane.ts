/**
 * G5 — The coordinate plane (first quadrant), graphing ordered pairs.
 *
 * First exposure to (x, y) coordinates. Two perpendicular number
 * lines, four quadrants — but G5 only uses the first quadrant
 * (positive x and y). The "x then y" convention is the most-violated
 * rule by students, so this lesson hammers it.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_MATH_COORDINATE_PLANE: LessonPlan = {
  id: 'evelyn.g5.math.coordinate-plane.v1',
  title: 'The Coordinate Plane',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.g.a.1',
      description: 'Use a pair of perpendicular number lines to define a coordinate system.',
      standard: 'CCSS.MATH.CONTENT.5.G.A.1',
    },
    {
      id: 'ccss.math.5.g.a.2',
      description: 'Represent real-world problems by graphing points in the first quadrant.',
      standard: 'CCSS.MATH.CONTENT.5.G.A.2',
    },
  ],
  prerequisites: ['ccss.math.3.md.b.4'],
  followUps: ['ccss.math.6.ns.c.6', 'ccss.math.6.g.a.3'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a treasure-map metaphor to introduce coordinates.',
      script: 'You\'re reading a treasure map. The instructions say "go 3 steps east, then 4 steps north." That\'s exactly how a coordinate point works: two numbers — one for sideways, one for up — pinpoint exactly where the treasure is buried.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-axes-and-pairs',
      kind: 'concept',
      goal: 'Two perpendicular axes, the origin, ordered pairs (x, y) — x always first.',
      keyIdeas: [
        'The COORDINATE PLANE is two perpendicular number lines: a horizontal one (the x-axis) and a vertical one (the y-axis).',
        'The point where they meet is called the ORIGIN — that\'s (0, 0).',
        'Any point on the plane is named by an ORDERED PAIR: (x, y).',
        'The X-coordinate (first number) tells you how far RIGHT (or left) from the origin.',
        'The Y-coordinate (second number) tells you how far UP (or down) from the origin.',
        'X always comes FIRST. (3, 5) is NOT the same point as (5, 3).',
        'In G5 we use the FIRST QUADRANT only — both coordinates positive.',
        'Read it like a recipe: "right first, up second."',
      ],
      vocabulary: [
        { term: 'coordinate plane', definition: 'a flat surface formed by two perpendicular number lines.' },
        { term: 'x-axis', definition: 'the horizontal number line.' },
        { term: 'y-axis', definition: 'the vertical number line.' },
        { term: 'origin', definition: 'the point (0, 0) where the axes cross.' },
        { term: 'ordered pair', definition: 'two numbers in (x, y) order that name a point.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plot-3-5',
      kind: 'worked_example',
      problem: 'Plot the point (3, 5) on a coordinate plane.',
      steps: [
        'Use show_function_graph with no functions, just to display the grid.',
        'Start at the origin (0, 0).',
        'Move 3 units to the RIGHT along the x-axis (x-coordinate = 3).',
        'From there, move 5 units UP (y-coordinate = 5).',
        'Place a dot. That dot is at (3, 5).',
        'Label it: "(3, 5) — 3 right, 5 up."',
      ],
      answer: 'Point at (3, 5)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Where is the point (4, 2)? Choose: (a) 4 units up, 2 units right  (b) 4 units right, 2 units up  (c) 2 units right, 4 units up.',
      expectedAnswer: 'b',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4 units up, 2 units right' },
        { id: 'b', text: '4 units right, 2 units up', correct: true },
        { id: 'c', text: '2 units right, 4 units up' },
      ],
      hints: [
        'X comes first in (x, y). X is the horizontal direction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-swap',
      kind: 'misconception_check',
      question: 'Owen is asked to plot (2, 5). He goes 5 right and 2 up. Right or wrong?',
      commonErrors: [
        {
          answer: 'right',
          misconception: 'Reading the second number as x because it feels intuitive (vertical first?).',
          correctsTo: 'Wrong. X is FIRST in (x, y), and x is HORIZONTAL. So 2 right, then 5 up — not the other way around. (5, 2) and (2, 5) are different points.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Coordinate plane: two perpendicular axes meeting at the origin.',
        'X-axis is horizontal. Y-axis is vertical.',
        'Ordered pair: (x, y) — x ALWAYS first.',
        'X = right; Y = up.',
        'G5 stays in the first quadrant — both coordinates positive.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Plot three points: (1, 1), (5, 1), and (5, 4). What 3-sided shape would they form if connected?',
      hint: 'A right triangle. Two sides are along the gridlines (horizontal and vertical), the third is the diagonal.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
