/**
 * G8 — Geometric transformations (translations, reflections, rotations,
 * dilations).
 *
 * Four ways to move or resize a shape on the coordinate plane.
 * Translations slide; reflections flip; rotations turn; dilations
 * scale. The first three preserve size and shape (rigid motions);
 * dilation changes size but preserves shape (similarity).
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_TRANSFORMATIONS: LessonPlan = {
  id: 'evelyn.g8.math.transformations.v1',
  title: 'Geometric Transformations',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'transformations',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.g.a.1',
      description: 'Verify properties of rotations, reflections, and translations.',
      standard: 'CCSS.MATH.CONTENT.8.G.A.1',
    },
    {
      id: 'ccss.math.8.g.a.3',
      description: 'Describe the effect of dilations, translations, rotations, reflections using coordinates.',
      standard: 'CCSS.MATH.CONTENT.8.G.A.3',
    },
  ],
  prerequisites: ['ccss.math.5.g.a.1'],
  followUps: ['ccss.math.hsg.co.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a familiar object — a triangle being moved around — to introduce the four transformations.',
      script: 'Picture a paper triangle on a coordinate plane. You can do four different things to it: SLIDE it (without turning); FLIP it across a line; SPIN it around a point; and SHRINK or STRETCH it. Each move has a name. Let\'s learn all four.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-transformations',
      kind: 'concept',
      goal: 'Translation, reflection, rotation, dilation — what each does and the coordinate rule for each.',
      keyIdeas: [
        'TRANSLATION (slide): move every point the same distance in the same direction. Rule: (x, y) → (x + h, y + k). Size and shape unchanged.',
        'REFLECTION (flip): flip across a line (often the x-axis or y-axis). Across x-axis: (x, y) → (x, -y). Across y-axis: (x, y) → (-x, y). Size and shape unchanged.',
        'ROTATION (turn): spin around a point (often the origin). 90° counter-clockwise: (x, y) → (-y, x). 180°: (x, y) → (-x, -y). Size and shape unchanged.',
        'DILATION (resize): scale every distance from a center point by a factor k. Around origin: (x, y) → (kx, ky). If k > 1, the shape gets bigger. If 0 < k < 1, smaller. Shape SAME, size CHANGES.',
        'RIGID MOTIONS (translation, reflection, rotation): preserve size and shape — the result is CONGRUENT to the original.',
        'DILATION: preserves shape only — result is SIMILAR to the original.',
      ],
      vocabulary: [
        { term: 'translation', definition: 'a slide — every point moves the same way.' },
        { term: 'reflection', definition: 'a flip across a line.' },
        { term: 'rotation', definition: 'a turn around a point.' },
        { term: 'dilation', definition: 'a resize by a scale factor from a center point.' },
        { term: 'congruent', definition: 'same size AND shape.' },
        { term: 'similar', definition: 'same shape, different size.' },
      ],
      suggestedTools: ['show_function_graph', 'show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-translate',
      kind: 'worked_example',
      problem: 'Translate the point (3, 5) by (2, -4).',
      steps: [
        'Translation rule: (x, y) → (x + h, y + k). Here h = 2, k = -4.',
        'Apply: (3 + 2, 5 + (-4)) = (5, 1).',
        'New point: (5, 1).',
        'Picture it: started at (3, 5), moved 2 right and 4 down. Lands at (5, 1).',
      ],
      answer: '(5, 1)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dilate',
      kind: 'worked_example',
      problem: 'Dilate the triangle with vertices (1, 2), (3, 2), (1, 5) by a scale factor of 2 around the origin.',
      steps: [
        'Dilation rule (around origin): (x, y) → (kx, ky). k = 2.',
        '(1, 2) → (2, 4). (3, 2) → (6, 4). (1, 5) → (2, 10).',
        'New triangle: (2, 4), (6, 4), (2, 10).',
        'Each side is now twice as long. Same shape (still a right triangle), bigger size.',
      ],
      answer: '(2,4), (6,4), (2,10)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Reflect the point (4, -3) across the x-axis. What\'s the new point?',
      expectedAnswer: '(4, 3)',
      responseFormat: 'free',
      hints: [
        'Reflection across x-axis: (x, y) → (x, -y).',
        'x stays, y flips sign.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-similar-vs-congruent',
      kind: 'misconception_check',
      question: 'Sage dilates a triangle by factor 1.5 and says "the new triangle is congruent to the old one." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Using "congruent" loosely as "the same shape" without checking size.',
          correctsTo: 'No. Congruent means same SIZE AND shape. Dilation changes the size (unless k = 1), so the result is SIMILAR but not congruent. Translations, reflections, and rotations DO produce congruent figures.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Translation: slide. (x, y) → (x+h, y+k).',
        'Reflection: flip across a line. Across x-axis: y flips. Across y-axis: x flips.',
        'Rotation: spin around a point.',
        'Dilation: resize from a center point by factor k.',
        'Translations / reflections / rotations are RIGID — congruent. Dilation is similar (shape but not size).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Apply two transformations in order: translate (2, 3) by (1, 1), THEN reflect across the y-axis. What\'s the final point?',
      hint: 'After translation: (3, 4). After reflection across y-axis: (-3, 4).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
