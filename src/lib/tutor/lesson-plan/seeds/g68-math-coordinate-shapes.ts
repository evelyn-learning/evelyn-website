/**
 * Grades 6-8 Math — Coordinate Plane: Shapes and Reflections.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_MATH_COORDINATE_SHAPES: LessonPlan = {
  id: 'evelyn.g68.math.coordinate-shapes.v1',
  title: 'Coordinate Plane — Shapes, Reflections, and Translations',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'coordinate-plane',
  locale: 'en',
  los: [{ id: 'g68.math.coordinate-shapes', description: 'Identify shapes drawn on a coordinate plane and apply reflections and translations to their vertices.', standard: 'CCSS.MATH.CONTENT.8.G.A' }],
  prerequisites: ['g68.math.coordinate-graphing'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'On a coordinate plane, you can MOVE shapes by changing their points\' coordinates.', script: 'Slide a triangle 3 units right. Reflect it over the y-axis. Each transformation has a clear coordinate rule. Today we cover the two most common: translations (slides) and reflections (flips).', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Shapes on the plane, translation rule, reflection rules.', keyIdeas: [
      'A shape on the coordinate plane is defined by its VERTICES (corners).',
      'TRANSLATE (slide): add a fixed amount to each x and/or y.',
      '  Move RIGHT 3, UP 2: (x, y) → (x + 3, y + 2).',
      '  Apply to every vertex; connect them.',
      'REFLECT (flip):',
      '  Over the X-AXIS: (x, y) → (x, −y). y flips sign.',
      '  Over the Y-AXIS: (x, y) → (−x, y). x flips sign.',
      '  Over the line y = x: (x, y) → (y, x). Swap.',
      'After a transformation, the shape\'s SIZE and ANGLES stay the same. Only its position (and possibly orientation) changes.',
      'COMPOSING transformations: do them in order. Translation followed by reflection ≠ reflection followed by translation in general.',
      'Real applications: computer graphics (every screen pixel uses coordinate transformations), maps, robotics.',
    ], vocabulary: [{ term: 'translation', definition: 'a slide of a shape; every point moves the same direction and distance.' }, { term: 'reflection', definition: 'a flip across a line; the line is the mirror.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Triangle ABC has vertices A(1, 2), B(4, 2), C(2, 5). Translate it 3 units RIGHT and 1 unit DOWN. Find the new vertices.', steps: [
      'Translation rule: (x, y) → (x + 3, y − 1).',
      'A(1, 2) → A\'(1+3, 2−1) = (4, 1).',
      'B(4, 2) → B\'(7, 1).',
      'C(2, 5) → C\'(5, 4).',
      'New triangle: A\'(4,1), B\'(7,1), C\'(5,4).',
      'Sanity check: shape is the same (still a triangle with those side relationships).',
    ], answer: 'A\'(4,1), B\'(7,1), C\'(5,4)', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Reflect the triangle from above (A(1,2), B(4,2), C(2,5)) across the X-AXIS. Find the new vertices.', expectedAnswer: 'Reflection over x-axis: (x, y) → (x, −y). A(1,2) → (1,−2). B(4,2) → (4,−2). C(2,5) → (2,−5). New triangle has vertices A\'(1,−2), B\'(4,−2), C\'(2,−5). The triangle is now BELOW the x-axis (mirror of the original).', responseFormat: 'free', hints: ['Reflection over x-axis flips y-sign.', 'Apply the rule to each vertex.'], estimatedMinutes: 3 },
    { id: 'misconception-axis-confusion', kind: 'misconception_check', question: 'A student reflects (3, 5) over the y-axis and writes (3, −5). What did they do wrong?', commonErrors: [{ answer: 'Flips y-sign for y-axis reflection', misconception: 'Confusing which sign flips for which axis.', correctsTo: 'Reflection OVER the X-AXIS flips Y-sign (because x-axis is horizontal, y measures vertical distance from it). Reflection OVER the Y-AXIS flips X-sign. Memory trick: reflect over horizontal axis = flip vertically (y); reflect over vertical axis = flip horizontally (x). Correct: (3, 5) over y-axis → (−3, 5).' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Translate: add to x and/or y.', 'Reflect over x-axis: flip y-sign.', 'Reflect over y-axis: flip x-sign.', 'Apply transformation to every vertex.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
