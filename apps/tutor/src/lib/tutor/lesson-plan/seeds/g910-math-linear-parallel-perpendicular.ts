/**
 * Grades 9-10 Math — Linear Functions: Parallel & Perpendicular Lines.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_LINEAR_PARALLEL_PERPENDICULAR: LessonPlan = {
  id: 'evelyn.g910.math.linear.parallel-perpendicular.v1',
  title: 'Linear Functions — Parallel & Perpendicular Lines',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'linear-functions',
  locale: 'en',
  los: [
    {
      id: 'g910.math.linear.parallel-perpendicular',
      description: 'Identify parallel and perpendicular lines from their slopes; write equations of lines parallel or perpendicular to a given line through a given point.',
      standard: 'CCSS.MATH.CONTENT.HSG.GPE.B.5',
    },
  ],
  prerequisites: ['g910.math.linear.point-slope'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Parallel and perpendicular relationships are encoded in slopes — quick checks once you know the rules.',
      script: 'Two lines are PARALLEL if they have the same slope (and never meet). Two lines are PERPENDICULAR if their slopes are NEGATIVE RECIPROCALS. Once you internalise these two rules, you can write equations for parallel/perpendicular lines almost instantly.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-parallel-perp',
      kind: 'concept',
      goal: 'Slope rules, special cases (horizontal/vertical), writing equations.',
      keyIdeas: [
        'PARALLEL: same slope, different y-intercept. m₁ = m₂. The lines never meet.',
        'PERPENDICULAR: slopes are negative reciprocals. m₁ × m₂ = −1, equivalently m₂ = −1/m₁.',
        'EXAMPLES of perpendicular slopes:',
        '  m = 2 ⟹ perpendicular slope = −1/2.',
        '  m = −3/4 ⟹ perpendicular slope = 4/3.',
        '  m = 1 ⟹ perpendicular slope = −1.',
        'SPECIAL CASES:',
        '  HORIZONTAL line (y = c) has slope 0. Perpendicular is VERTICAL (x = k), undefined slope. The negative-reciprocal rule "fails" here because 0 has no reciprocal — but geometrically they\'re still perpendicular.',
        '  VERTICAL line (x = k) has undefined slope. Perpendicular is horizontal (y = c).',
        'TO WRITE a line PARALLEL to y = mx + b through point (x₁, y₁): slope is m, use point-slope form: y − y₁ = m(x − x₁).',
        'TO WRITE a line PERPENDICULAR to y = mx + b through point (x₁, y₁): slope is −1/m, then point-slope: y − y₁ = (−1/m)(x − x₁).',
        'WHY negative reciprocal? Geometrically: rotating a line 90° turns rise/run into −run/rise. Algebraic fact: dot product of direction vectors (1, m₁) and (1, m₂) is 1 + m₁m₂; perpendicular ⟺ this dot product = 0 ⟺ m₁m₂ = −1.',
      ],
      vocabulary: [
        { term: 'negative reciprocal', definition: 'flip the fraction and negate the sign; e.g. negative reciprocal of 3/4 is −4/3.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Write the equation of the line perpendicular to y = (1/2)x + 3 passing through the point (4, 1).',
      steps: [
        'Identify slope of given line: m = 1/2.',
        'Perpendicular slope: −1/(1/2) = −2.',
        'Use point-slope form with (4, 1) and slope −2: y − 1 = −2(x − 4).',
        'Simplify to slope-intercept: y − 1 = −2x + 8 ⟹ y = −2x + 9.',
        'Verify perpendicularity: (1/2) × (−2) = −1 ✓.',
        'Verify the point: y = −2(4) + 9 = 1 ✓.',
      ],
      answer: 'y = −2x + 9',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Are the lines 3x − y = 5 and y = 3x + 2 parallel, perpendicular, or neither?',
      expectedAnswer: 'Convert eq 1 to slope-intercept: y = 3x − 5. Slope = 3. Eq 2: y = 3x + 2, slope = 3. Same slope, different intercepts — PARALLEL.',
      responseFormat: 'free',
      hints: [
        'Convert both to slope-intercept form first.',
        'Compare slopes: same → parallel; negative reciprocals → perpendicular.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-reciprocal-no-sign',
      kind: 'misconception_check',
      question: 'A student claims the perpendicular slope to m = 4 is 1/4 (just the reciprocal). What\'s missing?',
      commonErrors: [
        {
          answer: 'Just reciprocal, no sign flip',
          misconception: 'Forgetting the NEGATIVE in negative reciprocal.',
          correctsTo: 'Perpendicular slope is the NEGATIVE reciprocal: −1/m. For m = 4, perpendicular slope is −1/4, not 1/4. A line with slope 1/4 is roughly parallel-ish to the original (both rise left-to-right). Only −1/4 turns a 90° corner. Memory trick: if both slopes have the same sign, the lines either rise together or fall together — they can\'t be perpendicular.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Parallel: same slope, different intercept.',
        'Perpendicular: slopes are NEGATIVE reciprocals (m₁m₂ = −1).',
        'Horizontal ⊥ vertical (special case — slopes 0 and undefined).',
        'To find a perpendicular through a point, take −1/m and use point-slope form.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
