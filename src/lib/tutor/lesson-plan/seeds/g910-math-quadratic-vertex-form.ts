/**
 * Grades 9-10 Math — Quadratic Vertex Form and Graphing.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_QUADRATIC_VERTEX_FORM: LessonPlan = {
  id: 'evelyn.g910.math.quadratic.vertex-form.v1',
  title: 'Quadratic Equations — Vertex Form and Graphing',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'quadratic-equations',
  locale: 'en',
  los: [
    {
      id: 'g910.math.quadratic.vertex-form',
      description: 'Convert between standard and vertex form; identify vertex, axis of symmetry, intercepts, and graph the parabola.',
      standard: 'CCSS.MATH.CONTENT.HSF.IF.C.7a',
    },
  ],
  prerequisites: ['g910.math.quadratic.completing-square'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Vertex form makes graphing trivial — and tells you the parabola\'s key feature at a glance.',
      script: 'In standard form y = ax² + bx + c, finding the vertex requires extra work. In vertex form y = a(x − h)² + k, the vertex is RIGHT THERE: (h, k). Same parabola, just a more useful angle on it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-vertex',
      kind: 'concept',
      goal: 'Vertex form, vertex, axis of symmetry, opens-up/down, transforming, intercepts.',
      keyIdeas: [
        'VERTEX FORM: y = a(x − h)² + k. Vertex is (h, k). Axis of symmetry is x = h. Opens up if a > 0, down if a < 0. Wider/narrower scaled by |a|.',
        'CONVERT standard ⟶ vertex by completing the square. Quick formula: h = −b/(2a), k = c − b²/(4a) (or k = f(h)).',
        'CONVERT vertex ⟶ standard by expanding: a(x − h)² + k = a(x² − 2hx + h²) + k = ax² − 2ahx + (ah² + k).',
        'KEY POINTS to plot a parabola: vertex (h, k), y-intercept (0, c) [from standard form], x-intercepts (roots from quadratic formula or factoring), and one or two symmetric points across the axis of symmetry.',
        'TRANSFORMATIONS from y = x²:',
        '  vertical shift k: up if k > 0, down if k < 0.',
        '  horizontal shift h: right if h > 0, left if h < 0 (note the SIGN inside parens — opposite of intuition).',
        '  vertical stretch / compression: |a| > 1 stretches, 0 < |a| < 1 compresses.',
        '  reflection over x-axis: a < 0.',
        'MAX/MIN: if a > 0, vertex is a MINIMUM. If a < 0, vertex is a MAXIMUM. Optimization word problems use this.',
      ],
      vocabulary: [
        { term: 'vertex', definition: 'the highest or lowest point of a parabola; (h, k) in vertex form.' },
        { term: 'axis of symmetry', definition: 'the vertical line x = h that splits a parabola into mirror images.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Convert y = x² − 6x + 5 to vertex form, identify the vertex, then sketch the parabola.',
      steps: [
        'Group the x-terms: y = (x² − 6x) + 5.',
        'Complete the square inside the parens. Half of −6 is −3, squared is 9. Add and subtract 9: y = (x² − 6x + 9 − 9) + 5.',
        'Factor: y = (x − 3)² − 9 + 5 = (x − 3)² − 4. ← VERTEX FORM.',
        'Vertex: (3, −4). Axis of symmetry: x = 3.',
        'a = 1 > 0, so opens UP. Vertex is a minimum.',
        'y-intercept: x = 0 ⟹ y = (−3)² − 4 = 5. Point (0, 5).',
        'x-intercepts: 0 = (x−3)² − 4 ⟹ (x−3)² = 4 ⟹ x − 3 = ±2 ⟹ x = 5 or x = 1. Points (1, 0) and (5, 0).',
        'Sketch: opens up, vertex (3,−4), passes through (0,5), (1,0), (5,0), symmetric across x = 3.',
      ],
      answer: 'Vertex form y = (x − 3)² − 4; vertex (3, −4); opens up.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A parabola has vertex (−2, 5) and passes through (0, 1). Write its equation in vertex form.',
      expectedAnswer: 'y = a(x − (−2))² + 5 = a(x + 2)² + 5. Plug in (0, 1): 1 = a(4) + 5 ⟹ a = −1. So y = −(x + 2)² + 5.',
      responseFormat: 'free',
      hints: [
        'Start with vertex form y = a(x − h)² + k and plug in the vertex.',
        'Use the second point to solve for a.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-shift-direction',
      kind: 'misconception_check',
      question: 'A student claims y = (x + 4)² is the same as y = x² shifted RIGHT by 4 units. What\'s the actual direction?',
      commonErrors: [
        {
          answer: 'Plus inside means shift right',
          misconception: 'Reading the sign inside the parentheses literally instead of as the SOLVE-FOR-X direction.',
          correctsTo: 'y = (x + 4)² shifts LEFT by 4. The vertex form y = (x − h)² gives vertex at x = h. Here (x + 4)² = (x − (−4))², so h = −4, vertex at x = −4 — i.e. LEFT of origin. The trick: the sign INSIDE the parens is opposite the shift direction. Memorable rule: "the parabola moves to make the inside zero." For (x + 4)² = 0, x = −4, so it moved left.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = a(x − h)² + k: vertex (h, k); axis x = h.',
        'a > 0 opens up (min at vertex); a < 0 opens down (max).',
        'Inside-parens sign is OPPOSITE the shift direction.',
        'Convert standard ⟶ vertex by completing the square; or use h = −b/(2a).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
