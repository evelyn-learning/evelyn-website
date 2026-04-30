/**
 * G9 Algebra 1 — Graphing functions: domain, range, intercepts.
 *
 * Reading a graph: identify x-intercept, y-intercept, domain, range,
 * increasing/decreasing intervals.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_GRAPHING_FUNCTIONS: LessonPlan = {
  id: 'evelyn.g9.alg1.functions.graph-features.v1',
  title: 'Reading a graph: domain, range, intercepts',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsf-if.b.4',
      description: 'For a function that models a relationship between two quantities, interpret key features of graphs and tables.',
      standard: 'CCSS.MATH.CONTENT.HSF.IF.B.4',
    },
  ],
  prerequisites: ['ccss.math.8.f.b.4'],
  followUps: ['ccss.math.hsf-if.b.5'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that graphs encode a lot of information at a glance.',
      script: 'A single graph can tell you: where the function equals zero, what its highest value is, where it crosses the y-axis, where it grows fastest. Reading those features quickly is one of the most useful algebra skills.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-features',
      kind: 'concept',
      goal: 'Five graph features: intercepts, domain, range, increasing/decreasing.',
      keyIdeas: [
        'Y-INTERCEPT: where the graph crosses the y-axis. x = 0 there. Find by plugging x = 0 into the function.',
        'X-INTERCEPT (or ZERO): where the graph crosses the x-axis. y = 0 there. Find by setting f(x) = 0 and solving.',
        'DOMAIN: all valid INPUT values (x-values). Read left-to-right on the graph. Default for polynomials: all real numbers. Restrictions for square root (x ≥ value), rational (x ≠ value).',
        'RANGE: all OUTPUT values (y-values) the function takes. Read top-to-bottom.',
        'INCREASING / DECREASING: an interval where y goes UP as x goes RIGHT (increasing) or y goes DOWN as x goes RIGHT (decreasing). Always describe over an x-interval.',
        'INTERVAL NOTATION: (a, b) for open, [a, b] for closed. (-∞, ∞) for all real numbers.',
      ],
      vocabulary: [
        { term: 'domain', definition: 'all valid input values for a function.' },
        { term: 'range', definition: 'all output values a function produces.' },
        { term: 'zero', definition: 'an x-value where f(x) = 0; same as x-intercept.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-parabola',
      kind: 'worked_example',
      problem: 'For y = x² − 4, find: y-intercept, x-intercepts, domain, range.',
      steps: [
        'y-intercept: plug x = 0. y = 0² − 4 = −4. Point (0, −4).',
        'x-intercepts: set y = 0. x² − 4 = 0 → x² = 4 → x = ±2. Points (-2, 0) and (2, 0).',
        'Domain: any real number works for x. Domain = (-∞, ∞).',
        'Range: minimum is at the vertex. Vertex of y = x² − 4 is (0, −4). y goes up to ∞. Range = [−4, ∞).',
      ],
      answer: 'y-int (0,-4); x-ints (±2, 0); domain ℝ; range [−4, ∞)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the y-intercept of f(x) = 2x + 7.',
      expectedAnswer: '7',
      responseFormat: 'numeric',
      hints: [
        'Plug x = 0 into the function.',
        'f(0) = 2(0) + 7 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-domain-range-swap',
      kind: 'misconception_check',
      question: 'Are domain and range the same thing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the two.',
          correctsTo: 'No — DOMAIN is INPUTS (x-values you can use). RANGE is OUTPUTS (y-values you get out). For y = x², domain is all reals, but range is [0, ∞) since x² is never negative.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y-intercept: plug in x = 0.',
        'x-intercept (zero): set f(x) = 0, solve for x.',
        'Domain = inputs (x). Range = outputs (y).',
        'Increasing/decreasing: described over an x-interval.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For f(x) = √(x − 3), what is the domain? Why?',
      hint: 'You can\'t take a square root of a negative. So x − 3 must be ≥ 0 → x ≥ 3 → domain = [3, ∞).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
