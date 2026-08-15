/**
 * K-2 Math — Shapes & Patterns.
 *
 * Anchor plan covering 2D / 3D shape recognition, attributes, and
 * extending repeating + growing patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_MATH_SHAPES_PATTERNS: LessonPlan = {
  id: 'evelyn.k2.math.shapes-patterns.v1',
  title: 'K-2 Math — Shapes & Patterns',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'math',
  topic: 'shapes-patterns',
  locale: 'en',
  los: [
    {
      id: 'k2.math.shapes-patterns',
      description: 'Identify 2D and 3D shapes by their attributes and extend repeating and growing patterns.',
      standard: 'CCSS.MATH.CONTENT.K.G.A / 1.OA.D / 2.G.A',
    },
  ],
  prerequisites: [],
  followUps: ['k2.math.measurement-time'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Shapes and patterns are everywhere — once you know how to look.',
      script: 'Look around you. Count how many circles you can see. Now squares. Now patterns — like the stripes on a shirt or the tiles on a floor. Today we name what shapes are made of and figure out what comes next in a pattern.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-shapes-patterns',
      kind: 'concept',
      goal: 'Shape names, sides/corners attributes, 3D vs 2D, repeating + growing patterns.',
      keyIdeas: [
        '2D SHAPES are flat: circle, triangle, square, rectangle, hexagon. We name them by their sides and corners.',
        'TRIANGLE = 3 sides, 3 corners. SQUARE = 4 EQUAL sides, 4 corners. RECTANGLE = 4 sides, 4 corners (opposite sides equal). HEXAGON = 6 sides.',
        'CIRCLE has no sides and no corners — it\'s a curve.',
        '3D SHAPES are solid: sphere (like a ball), cube (like a die), cylinder (like a can), cone (like an ice-cream cone), rectangular prism (like a cereal box), pyramid.',
        '3D shapes have FACES (flat sides), EDGES (where two faces meet), and VERTICES (corners). A cube has 6 faces, 12 edges, 8 vertices.',
        'A REPEATING PATTERN is a unit that repeats: ABAB, ABCABC, AABBAABB. To extend it, find the unit, then keep going.',
        'A GROWING PATTERN gets bigger by a rule: 1, 3, 5, 7... (add 2 each time). 2, 4, 8, 16... (double each time).',
        'When we describe a pattern, we say the rule. "It goes up by 2." "Red, blue, red, blue."',
      ],
      vocabulary: [
        { term: 'side', definition: 'a straight edge of a flat (2D) shape.' },
        { term: 'vertex', definition: 'a corner where edges meet (plural: vertices). Triangles have 3 vertices.' },
        { term: 'pattern', definition: 'something that repeats or grows by a rule.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-pattern',
      kind: 'worked_example',
      problem: 'What comes next in this pattern: square, triangle, circle, square, triangle, circle, square, ___?',
      steps: [
        'Find the unit that repeats. Read the pattern out loud: square, triangle, circle, square, triangle, circle.',
        'The unit is "square, triangle, circle" — three shapes that repeat.',
        'After "circle, square," the next would be "triangle."',
        'Answer: triangle.',
      ],
      answer: 'triangle',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A shape has 4 equal sides and 4 corners. What shape is it?',
      expectedAnswer: 'square',
      responseFormat: 'free',
      hints: [
        'Count the sides: 4. That rules out triangle (3) and hexagon (6).',
        '4 EQUAL sides — not just any 4-sided shape. A rectangle has 4 sides but they\'re not all equal.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-square-rectangle',
      kind: 'misconception_check',
      question: 'Is a square also a rectangle? Why or why not?',
      commonErrors: [
        {
          answer: 'No, they are different shapes',
          misconception: 'Treating shape names as exclusive — if it\'s a square, it can\'t be a rectangle.',
          correctsTo: 'A rectangle is any shape with 4 sides and 4 right-angle corners. A square has 4 sides and 4 right-angle corners — AND its sides are all equal. So every square IS a rectangle (a special, equal-sided one), but not every rectangle is a square. This is the same reason every dog is an animal but not every animal is a dog.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '2D shapes are flat; 3D shapes are solid.',
        'Triangle = 3 sides, square = 4 equal sides, rectangle = 4 sides, hexagon = 6 sides.',
        'A pattern repeats or grows by a rule.',
        'To extend a pattern, find the rule and keep going.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How many edges does a rectangular prism (cereal box) have? Try counting carefully.',
      hint: '12 edges. A rectangular prism has 6 faces. The top and bottom each have 4 edges (8 total), but they\'re shared with the side faces. The 4 vertical edges connect top to bottom. 4 + 4 + 4 = 12. Trick: every face contributes its edges, but each edge is shared between two faces, so total edges = (faces × edges-per-face) / 2 = (6 × 4) / 2 = 12.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
