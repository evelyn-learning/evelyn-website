/**
 * K-2 Math — 2D and 3D Shapes.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_MATH_SHAPES_2D_3D: LessonPlan = {
  id: 'evelyn.k2.math.shapes-2d-3d.v1',
  title: 'K-2 Math — 2D and 3D Shape Attributes',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'math',
  topic: 'shapes-patterns',
  locale: 'en',
  los: [{ id: 'k2.math.shapes-2d-3d', description: 'Identify 2D shapes by sides and corners; identify 3D shapes by faces, edges, and vertices.', standard: 'CCSS.MATH.CONTENT.2.G.A.1' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Shapes are everywhere — and we name them by counting their parts.', script: 'A pizza slice. A soccer ball. A cereal box. Each has a shape with a name. Today: how to identify shapes by their SIDES, CORNERS, FACES, and EDGES.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: '2D shape names + features, 3D shape names + parts.', keyIdeas: [
      '2D = FLAT shapes (you can draw them on paper).',
      'TRIANGLE: 3 sides, 3 corners.',
      'SQUARE: 4 EQUAL sides, 4 corners.',
      'RECTANGLE: 4 sides, 4 corners (opposite sides equal).',
      'CIRCLE: no sides, no corners — round.',
      'PENTAGON: 5 sides. HEXAGON: 6 sides. OCTAGON: 8 sides.',
      '3D = SOLID shapes (you can hold them).',
      'CUBE: 6 SQUARE FACES, 12 EDGES, 8 VERTICES (corners). Like a die.',
      'RECTANGULAR PRISM: 6 RECTANGULAR faces. Like a cereal box.',
      'SPHERE: round; like a ball. No flat faces, edges, or vertices.',
      'CYLINDER: 2 circular faces + 1 curved surface. Like a can.',
      'CONE: 1 circular face + 1 curved surface meeting at a point.',
      'PYRAMID: 1 base (triangle, square) + triangular faces meeting at a point.',
      'FACE = a flat surface. EDGE = where two faces meet. VERTEX = a corner.',
    ], vocabulary: [{ term: 'face', definition: 'a flat side of a 3D shape.' }, { term: 'vertex', definition: 'a corner where edges meet (plural: vertices).' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'How many faces, edges, and vertices does a cube have?', steps: [
      'A cube is like a die. Count the FACES (flat sides): top, bottom, and 4 sides = 6 faces.',
      'Count the EDGES (where 2 faces meet): 4 around the top, 4 around the bottom, 4 vertical = 12 edges.',
      'Count the VERTICES (corners): 4 on top, 4 on bottom = 8 vertices.',
    ], answer: '6 faces, 12 edges, 8 vertices.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Look around your room. Find a cylinder, a sphere, and a rectangular prism. What did you find?', expectedAnswer: 'Cylinder examples: can, mug, candle. Sphere: ball, marble, orange. Rectangular prism: book, cereal box, brick. The point is to see that 3D shapes are EVERYWHERE in everyday objects.', responseFormat: 'free', hints: ['Cylinder = like a can. Sphere = ball. Rectangular prism = box.'], estimatedMinutes: 3 },
    { id: 'misconception-square-rectangle', kind: 'misconception_check', question: 'Is a square a rectangle?', commonErrors: [{ answer: 'No, they\'re different', misconception: 'Treating shape names as exclusive.', correctsTo: 'YES — a square IS a rectangle. A rectangle is any shape with 4 right-angle corners and 4 sides where opposite sides are equal. A square has all four sides equal — that\'s a SPECIAL kind of rectangle. So every square is a rectangle, but not every rectangle is a square.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['2D shapes are flat; 3D are solid.', 'Triangle = 3 sides. Square = 4 equal sides. Rectangle = 4 sides.', 'Cube = 6 faces, 12 edges, 8 vertices.', 'Face = flat side. Edge = where faces meet. Vertex = corner.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
