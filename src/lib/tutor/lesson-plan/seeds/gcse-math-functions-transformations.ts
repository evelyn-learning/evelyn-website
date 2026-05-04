/**
 * GCSE Math Higher — Functions & Graph Transformations.
 * f(x) notation, composite functions, inverse functions, and the four
 * graph transformations (translation horiz/vert, reflection, stretch).
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_FUNCTIONS_TRANSFORMATIONS: LessonPlan = {
  id: 'evelyn.gcse.math.functions-transformations.v1',
  title: 'GCSE Higher — Functions & Graph Transformations',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.functions-transformations',
      description: 'Use function notation; compose, invert, and transform functions y = f(x) → y = f(x) + a, f(x + a), −f(x), f(−x), af(x), f(ax).',
      standard: 'GCSE-MATH-A7/A13',
    },
  ],
  prerequisites: ['gcse.math.simultaneous-lin-quad'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Function notation looks abstract until you realise f(x) is just a recipe — and transformations are simple shifts and squashes.',
      script: 'Many students freeze when they see fg(x) on a paper, even though they\'ve been doing function machines since Year 7. Today we\'ll connect the abstract f(x) notation to the concrete picture of graphs sliding, flipping, and stretching on the coordinate plane.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-functions',
      kind: 'concept',
      goal: 'f-notation, composition, inverse, and the six standard transformations.',
      keyIdeas: [
        'FUNCTION NOTATION: f(x) means "apply rule f to input x". Example: f(x) = 2x + 3, then f(5) = 2·5 + 3 = 13. f(x − 1) means substitute (x − 1) wherever x appears.',
        'COMPOSITE FUNCTION: fg(x) means apply g FIRST, then f. fg(x) = f(g(x)). Order matters: gf(x) is usually different.',
        'INVERSE FUNCTION f⁻¹(x): "undoes" f. To find: write y = f(x), swap x and y, solve for y. Example: f(x) = 2x + 3 → y = 2x + 3 → x = 2y + 3 → y = (x − 3)/2 → f⁻¹(x) = (x − 3)/2.',
        'TRANSLATION: y = f(x) + a moves graph UP by a (along y-axis). y = f(x + a) moves graph LEFT by a (note: + INSIDE the bracket = LEFT, the counter-intuitive direction).',
        'REFLECTION: y = −f(x) reflects in the x-axis (flips vertically). y = f(−x) reflects in the y-axis (flips horizontally).',
        'STRETCH: y = af(x) is a vertical stretch by factor a (heights multiplied). y = f(ax) is a horizontal stretch by factor 1/a (widths divided — also counter-intuitive: f(2x) compresses by half).',
        'KEY TRICK: changes INSIDE f( ) act on x and behave inversely (left for +, squash for ×). Changes OUTSIDE f( ) act on y and behave normally (up for +, stretch for ×).',
      ],
      vocabulary: [
        { term: 'composite function', definition: 'a function applied after another: fg(x) = f(g(x)).' },
        { term: 'inverse function', definition: 'the function that undoes f, denoted f⁻¹(x); f(f⁻¹(x)) = x.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-composite',
      kind: 'worked_example',
      problem: 'f(x) = 3x − 1 and g(x) = x² + 2. Find: (a) fg(2), (b) gf(x) as a simplified expression.',
      steps: [
        'Part (a): fg(2) = f(g(2)). Compute g(2) first: g(2) = 2² + 2 = 6.',
        'Then apply f: f(6) = 3·6 − 1 = 17.',
        'Part (b): gf(x) = g(f(x)). Substitute f(x) = 3x − 1 into g: g(3x − 1) = (3x − 1)² + 2.',
        'Expand (3x − 1)² = 9x² − 6x + 1.',
        'So gf(x) = 9x² − 6x + 1 + 2 = 9x² − 6x + 3.',
        'NOTE: fg(x) would be 3(x² + 2) − 1 = 3x² + 5 — totally different. Always work the inner function first.',
      ],
      answer: 'fg(2) = 17; gf(x) = 9x² − 6x + 3',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the inverse of f(x) = (x + 5)/3.',
      expectedAnswer: 'f⁻¹(x) = 3x − 5',
      responseFormat: 'free',
      hints: [
        'Write y = (x + 5)/3.',
        'Swap x and y: x = (y + 5)/3.',
        'Solve for y: 3x = y + 5 → y = 3x − 5.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-translation',
      kind: 'misconception_check',
      question: 'Given y = f(x) is sketched, which way does the graph y = f(x − 4) move compared to y = f(x)?',
      commonErrors: [
        {
          answer: 'Left by 4',
          misconception: 'Reading the minus inside f( ) as an instruction to go in the negative-x direction.',
          correctsTo: 'INSIDE-the-bracket transformations are inverted. y = f(x − 4) moves the graph RIGHT by 4. Test it: at x = 4 in the new graph, the value equals f(0) — the same value that was at x = 0 in the original. So the point at x = 0 has migrated to x = 4 → moved right. The general rule: f(x ± a) → opposite of the sign of a.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'fg(x) means do g first, then f. Order matters.',
        'Inverse: swap x and y, solve for y.',
        'OUTSIDE f( ): y-axis, normal direction. f(x) + a up; af(x) vertical stretch.',
        'INSIDE f( ): x-axis, inverse direction. f(x + a) LEFT; f(ax) horizontal stretch by 1/a.',
        'When sketching, transform a few key points and connect — never plot from scratch.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'The graph y = f(x) has a maximum at (3, 5). Find the coordinates of the maximum of y = 2f(x − 1) − 4.',
      hint: 'Apply transformations one at a time: f(x − 1) shifts right 1 → max at (4, 5). 2f(x − 1) stretches y by 2 → max at (4, 10). 2f(x − 1) − 4 shifts down 4 → max at (4, 6).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
