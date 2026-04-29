/**
 * Kindergarten Math — 2D Shapes.
 * CCSS K.G.A.2 / K.G.B.4: identify and analyze 2D shapes.
 */

import type { LessonPlan } from '../types';

export const SEED_K_SHAPES_2D: LessonPlan = {
  id: 'evelyn.k.math.shapes-2d.v1',
  title: '2D Shapes: Circle, Square, Triangle, Rectangle',
  curriculum: 'CCSS', grade: 'K', subject: 'math', topic: 'geometry', locale: 'en',
  los: [{ id: 'ccss.k.g.a.2', description: 'Correctly name shapes regardless of their orientations or overall size.', standard: 'CCSS.K.G.A.2' }],
  prerequisites: [], followUps: ['g1.math.shapes-3d'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in shapes around us.', script: 'Look around. A pizza is a CIRCLE. A book is a RECTANGLE. A slice of pizza is a TRIANGLE. A window pane is a SQUARE. Shapes are everywhere!', estimatedMinutes: 2 },
    { id: 'concept-shapes', kind: 'concept', goal: 'Learn 4 main 2D shapes by sides and corners.', keyIdeas: [
      'CIRCLE: round, no sides, no corners.',
      'TRIANGLE: 3 straight sides, 3 corners.',
      'SQUARE: 4 sides, all SAME LENGTH, 4 corners.',
      'RECTANGLE: 4 sides, opposite sides same length, 4 corners.',
      'A square IS a rectangle (with all sides equal). All squares are rectangles, but not all rectangles are squares.',
    ], vocabulary: [{ term: 'side', definition: 'one straight edge of a shape.' }, { term: 'corner', definition: 'where two sides meet.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-orientation', kind: 'concept', goal: 'Shape stays the same shape no matter how it\'s turned.', keyIdeas: [
      'A triangle is a triangle whether it points up, down, or sideways.',
      'A square is a square even if it\'s tilted (some call this a "diamond" — but it\'s still a square).',
      'Count the SIDES and CORNERS to be sure.',
    ], estimatedMinutes: 3 },
    { id: 'worked-identify', kind: 'worked_example', problem: 'Look at a stop sign. How many sides does it have? Is it any of our 4 shapes?', steps: [
      'Count the sides of a stop sign: 8 sides.',
      'It is NOT a circle (has corners), triangle (only 3 sides), square (only 4 sides), or rectangle (only 4 sides).',
      'It\'s an OCTAGON — a special shape with 8 sides.',
    ], answer: '8 sides — it\'s an octagon, a different shape from our 4!', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Tell me what shape your TV screen is. How do you know?', expectedAnswer: 'A RECTANGLE. It has 4 sides, opposite sides are the same length (top = bottom, left = right), and it has 4 corners. Most TVs aren\'t square because they\'re wider than they are tall.', responseFormat: 'free', hints: ['How many sides?', 'Are opposite sides the same length?'], estimatedMinutes: 3 },
    { id: 'misconception-square-not-rectangle', kind: 'misconception_check', question: 'Is a SQUARE also a RECTANGLE?', commonErrors: [{ answer: 'No, they\'re different shapes.', misconception: 'Treating square and rectangle as separate.', correctsTo: 'YES — a square is a SPECIAL kind of rectangle (one with all sides equal). Every square fits the rectangle definition (4 sides, 4 corners, opposite sides equal). But not every rectangle is a square.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Circle: round, no corners.', 'Triangle: 3 sides, 3 corners.', 'Square: 4 equal sides.', 'Rectangle: 4 sides, opposite sides equal.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
