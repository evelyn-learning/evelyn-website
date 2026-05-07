/**
 * TEST PLAN — G7 Math — Direct and Inverse Variation.
 *
 * QA harness, not production content. Designed to invite:
 *   - show_equation (y = kx; k = y/x; y = k/x) — exercises the
 *     equation renderer; numeric substitutions like k = 12/3 = 4 give
 *     the Wolfram numeric validator something to check.
 *   - show_function_graph — the linear y=kx vs the y=k/x curve.
 *   - show_table — value pairs (x, y) for both kinds of variation.
 *   - show_solved_example — boxed worked example with steps.
 *   - generate_problem — at the end of the worked example, lesson asks
 *     for "another like that"; brain should call generate_problem with
 *     difficulty="same".
 *   - paceBias chips — Skip ahead, I'm stuck, Slow down, Speed up.
 *
 * Coverage gap this fills: variation is adjacent to existing G7
 * proportional relationships and ratios plans but isn't directly
 * covered as its own plan.
 */

import type { LessonPlan } from '../types';

export const SEED_TEST_G7_MATH_DIRECT_INVERSE_VARIATION: LessonPlan = {
  id: 'evelyn.test.g7.math.direct-inverse-variation.v1',
  title: '[TEST] G7 Math — Direct and Inverse Variation',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'ratios-proportions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.rp.a.2',
      description: 'Recognize and represent proportional relationships between quantities.',
      standard: 'CCSS.MATH.CONTENT.7.RP.A.2',
    },
    {
      id: 'evelyn.g7.variation.identify',
      description: 'Distinguish direct variation (y = kx) from inverse variation (y = k/x) given a table or equation.',
    },
  ],
  prerequisites: ['ccss.math.6.rp.a.3'],
  followUps: ['ccss.math.8.f.b.4'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with two situations: more workers → faster job (inverse), more hours worked → more pay (direct).',
      script: 'If 2 painters take 6 days to paint a house, and 4 painters take 3 days, what happens to the time when you double the workers? Now: if you earn $15 per hour, how do total earnings change as hours go up? Two different patterns — that\'s today\'s lesson.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-direct',
      kind: 'concept',
      goal: 'Direct variation: y = kx. As x grows, y grows in lockstep. The constant k is the rate.',
      keyIdeas: [
        'DIRECT VARIATION means y = kx for some constant k.',
        'When x doubles, y doubles. When x triples, y triples.',
        'The ratio y/x is the SAME for every pair — that\'s how you find k.',
        'Graph: a STRAIGHT LINE through the origin (0, 0) with slope k.',
      ],
      vocabulary: [
        { term: 'constant of variation', definition: 'the fixed number k that ties x and y together.' },
        { term: 'direct variation', definition: 'a relationship y = kx where y changes proportionally to x.' },
      ],
      suggestedTools: ['show_equation', 'show_table', 'show_function_graph'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-direct',
      kind: 'worked_example',
      problem: 'A bakery uses 12 cups of flour to make 3 loaves. How many cups for 8 loaves?',
      steps: [
        'Set up direct variation: cups = k · loaves.',
        'Find k from the given pair: k = 12 / 3 = 4 cups per loaf.',
        'Apply k to the new x: cups = 4 · 8 = 32.',
        'Answer: 32 cups.',
      ],
      answer: '32 cups',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A car travels 240 miles on 8 gallons of gas. How far on 12 gallons?',
      expectedAnswer: '360',
      responseFormat: 'numeric',
      hints: [
        'This is direct variation: miles = k · gallons. What is k?',
        'k = 240 / 8 = 30 miles per gallon. Now find miles for 12 gallons.',
      ],
      estimatedMinutes: 3,
      teacherNote: 'After the student answers, suggested follow-up: brain should ask "want another at this level?" and on student "yes" call generate_problem({ difficulty: "same", anchorProblem: "240 miles on 8 gallons …", anchorAnswer: "360" }). This exercises the generate_problem path.',
    },
    {
      id: 'concept-inverse',
      kind: 'concept',
      goal: 'Inverse variation: y = k/x. As x grows, y shrinks. The PRODUCT xy is the constant.',
      keyIdeas: [
        'INVERSE VARIATION means y = k/x for some constant k.',
        'When x doubles, y is HALVED. When x triples, y is one-third.',
        'The PRODUCT x · y is the same for every pair — that\'s how you find k.',
        'Graph: a CURVE that drops fast and never touches either axis (a hyperbola).',
      ],
      vocabulary: [
        { term: 'inverse variation', definition: 'a relationship y = k/x where y shrinks as x grows.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph', 'show_table'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-2',
      kind: 'try_yourself',
      problem: '4 workers take 9 hours to finish a job. How long would 6 workers take, if everyone works at the same rate?',
      expectedAnswer: '6',
      responseFormat: 'numeric',
      hints: [
        'This is inverse variation: workers · hours = k.',
        'Find k from the first pair: k = 4 · 9 = 36 worker-hours.',
        'Now solve 6 · hours = 36.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-direct-vs-inverse',
      kind: 'misconception_check',
      question: 'A friend says "any time two things change together, that\'s direct variation." Is that right?',
      commonErrors: [
        {
          answer: 'yes — anything that changes together is direct',
          misconception: 'Conflating "changes together" with "direct variation".',
          correctsTo: 'Direct variation requires y = kx — both go UP together, in lockstep, with a CONSTANT ratio. If one goes UP while the other goes DOWN (workers and time), or if the ratio isn\'t constant (a stock price over time), it\'s NOT direct variation. Inverse variation is y = k/x — they move OPPOSITE ways, but their PRODUCT is constant.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Direct: y = kx. Same RATIO. Straight line through the origin.',
        'Inverse: y = k/x. Same PRODUCT. Curve that drops as x grows.',
        'Find k from any one pair, then apply to a new x.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn QA', org: 'Evelyn', license: 'test-only' },
  schemaVersion: 1,
};
