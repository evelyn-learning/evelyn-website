/**
 * K — 3D shapes intro.
 *
 * Sphere, cube, cone, cylinder, rectangular prism. Real-world
 * examples. Compares to 2D shapes (face is 2D, whole is 3D).
 */

import type { LessonPlan } from '../types';

export const SEED_K_MATH_SHAPES_3D: LessonPlan = {
  id: 'evelyn.k.math.geometry.shapes-3d.v1',
  title: '3D shapes: sphere, cube, cone, cylinder',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.k.g.b.4',
      description: 'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations.',
      standard: 'CCSS.MATH.CONTENT.K.G.B.4',
    },
  ],
  prerequisites: ['ccss.math.k.g.a.2'],
  followUps: ['ccss.math.1.g.a.2'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show 3D shapes everywhere in the room.',
      script: 'Look around. A ball is a SPHERE. A box of cereal is a RECTANGULAR PRISM. An ice cream cone is a CONE. The room is full of 3D shapes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-shapes',
      kind: 'concept',
      goal: 'Five 3D shapes + how they differ from 2D.',
      keyIdeas: [
        '2D shapes are FLAT — circle, square, triangle. They have only length and width.',
        '3D shapes have length, width, AND DEPTH. You can pick them up — they take up space.',
        'SPHERE: round all over. Like a ball. No flat sides, no corners.',
        'CUBE: 6 square sides, all equal. Like dice. 8 corners.',
        'RECTANGULAR PRISM: like a cube but stretched. 6 rectangular sides. Cereal box, brick.',
        'CONE: round bottom, point at top. Ice cream cone, traffic cone, party hat.',
        'CYLINDER: two round flat ends, curved tube between them. Soda can, log, drum.',
      ],
      vocabulary: [
        { term: '3D shape', definition: 'a shape with length, width, AND depth.' },
        { term: 'face', definition: 'a flat side of a 3D shape.' },
        { term: 'corner / vertex', definition: 'a point where edges meet on a 3D shape.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-tin-can',
      kind: 'worked_example',
      problem: 'What 3D shape is a soup can?',
      steps: [
        'Look at the shape: round on top and bottom (those are circles).',
        'The sides curve smoothly between them.',
        'Two circles + curved tube = CYLINDER.',
      ],
      answer: 'cylinder',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What 3D shape is a basketball?',
      expectedAnswer: 'sphere',
      responseFormat: 'free',
      hints: [
        'Round all over, no flat sides.',
        'It rolls in any direction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-circle-vs-sphere',
      kind: 'misconception_check',
      question: 'Is a basketball a circle?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing 2D and 3D round shapes.',
          correctsTo: 'No — a CIRCLE is FLAT (you can draw it on paper). A basketball is round in all directions — that\'s a SPHERE. The basketball\'s SHADOW could be a circle, but the ball itself is 3D.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '3D shapes have length, width, AND depth.',
        'Sphere = ball (round everywhere).',
        'Cube = box with equal square sides.',
        'Cone = round bottom, point on top.',
        'Cylinder = round top and bottom, curved sides.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A FACE is a flat side of a 3D shape. How many faces does a cube have?',
      hint: 'Hold a die. Count the flat sides — top, bottom, front, back, left, right.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
