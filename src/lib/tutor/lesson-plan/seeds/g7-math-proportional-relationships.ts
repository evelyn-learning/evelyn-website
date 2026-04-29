/**
 * G7 — Proportional relationships (constant of proportionality, k).
 *
 * The leap from "equivalent ratios" (G6) to "y is proportional to x"
 * with a constant of proportionality k. y = kx is THE template — the
 * same idea returns as slope, density, unit price, scale factor, and
 * direct variation. Recognize proportional relationships in tables,
 * graphs, and equations.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_PROPORTIONAL_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.g7.math.proportional-relationships.v1',
  title: 'Proportional Relationships',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'proportions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.rp.a.2',
      description: 'Recognize and represent proportional relationships between quantities.',
      standard: 'CCSS.MATH.CONTENT.7.RP.A.2',
    },
  ],
  prerequisites: ['ccss.math.6.rp.a.2', 'ccss.math.6.rp.a.3'],
  followUps: ['ccss.math.8.ee.b.5'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a wage scenario where doubling hours doubles pay — proportional in the everyday sense.',
      script: 'You earn $12 for every hour you work. 2 hours: $24. 4 hours: $48. Double the hours, double the pay. That neat "scales together" pattern is what we call a PROPORTIONAL relationship — and there\'s a single number ($12, the hourly rate) that ties everything together.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-y-equals-kx',
      kind: 'concept',
      goal: 'Proportional means y = kx for some constant k. Recognize from tables, graphs, equations.',
      keyIdeas: [
        'Two quantities are PROPORTIONAL if their ratio is always the same.',
        'For every (x, y) pair, y ÷ x equals the same number — call it k, the CONSTANT OF PROPORTIONALITY.',
        'Equation form: y = k × x (often written y = kx).',
        'TABLE check: divide y by x in every row. If you get the same number every time, it\'s proportional.',
        'GRAPH check: a proportional relationship graphs as a straight line THROUGH THE ORIGIN (0, 0).',
        'If x = 0 doesn\'t give y = 0, it\'s NOT proportional. Doubling x must double y exactly.',
        'Examples: distance = rate × time, total cost = unit price × quantity, circumference = π × diameter.',
      ],
      vocabulary: [
        { term: 'proportional', definition: 'two quantities whose ratio is constant.' },
        { term: 'constant of proportionality', definition: 'the number k in y = kx — the unit rate.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-table',
      kind: 'worked_example',
      problem: 'Is the table proportional? Hours: 1, 2, 3, 5. Pay: $12, $24, $36, $60. If yes, find k.',
      steps: [
        'Compute pay ÷ hours for each row: 12÷1 = 12. 24÷2 = 12. 36÷3 = 12. 60÷5 = 12.',
        'Same ratio every row → YES, proportional.',
        'Constant of proportionality k = 12 (dollars per hour).',
        'Equation: pay = 12 × hours.',
      ],
      answer: 'Yes, proportional, k = 12',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-non-proportional',
      kind: 'worked_example',
      problem: 'Is "y = 2x + 3" a proportional relationship?',
      steps: [
        'Test: when x = 0, y = 2(0) + 3 = 3. NOT zero.',
        'A proportional graph must pass through (0, 0). This one passes through (0, 3).',
        'Also: try the ratio test. (1, 5): 5/1 = 5. (2, 7): 7/2 = 3.5. Different ratios — confirms NOT proportional.',
        'This is a linear relationship, but not a proportional one. The "+3" breaks proportionality.',
      ],
      answer: 'No, not proportional',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A car travels 65 miles per hour at a steady speed. Write an equation for distance d after t hours. What is k?',
      expectedAnswer: 'd = 65t, k = 65',
      responseFormat: 'free',
      hints: [
        'The constant rate is 65 mph.',
        'd = k × t, where k is the rate.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-linear-vs-proportional',
      kind: 'misconception_check',
      question: 'Mateo says "Any line on a graph shows a proportional relationship." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing linear (any straight line) with proportional (line through origin).',
          correctsTo: 'No. Proportional REQUIRES the line to go through (0, 0). y = 2x + 3 is a straight line, but it doesn\'t pass through the origin — so it\'s linear but NOT proportional. All proportional relationships are linear, but not the reverse.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Proportional: y/x is constant. Equation: y = kx.',
        'Graph: straight line THROUGH the origin (0, 0).',
        'Tables: divide y by x in every row — same answer means proportional.',
        'k is the constant of proportionality (also the unit rate).',
        'y = kx + b (with non-zero b) is linear but NOT proportional.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A recipe calls for 3 cups flour to make 12 cookies. How many cups for 30 cookies?',
      hint: 'Find k: 3 cups / 12 cookies = 0.25 cups per cookie. For 30 cookies: 0.25 × 30 = 7.5 cups.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
