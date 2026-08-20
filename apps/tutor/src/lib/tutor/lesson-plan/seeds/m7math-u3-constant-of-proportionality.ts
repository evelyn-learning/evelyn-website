/**
 * Grade 7 Math — Ratios & Proportional Relationships: Constant of
 * Proportionality & Its Equation.
 *
 * CCSS 7.RP.A.2b, 2c, 2d. The unit lands: the number k = y ÷ x gets its
 * name, gets its equation y = kx, and gets read off both a table and a
 * graph point. The single most important sentence in the plan is that k and
 * the unit rate from lessons 3.1 and 3.2 are the SAME number. The trap is
 * reading the y-coordinate of a graph point as k, which only works when
 * x = 1.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U3_CONSTANT_OF_PROPORTIONALITY: LessonPlan = {
  id: 'evelyn.ms.m7math.constant-of-proportionality.v1',
  title: 'Constant of Proportionality & Its Equation',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.constant-of-proportionality',
      standard: 'M7MATH-3.4',
      description:
        'Identify the constant of proportionality from a table, a graph, or a verbal description, write the equation y = kx, and explain what a point on the graph means in context (CCSS 7.RP.A.2b, 7.RP.A.2c, 7.RP.A.2d).',
    },
  ],
  prerequisites: ['m7math.proportional-relationships'],
  followUps: ['m7math.percent-of-a-number'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Point at the one number that never changes inside a proportional situation, and name it.',
      script:
        'Your neighbor pays you $8 for every dog you walk. Walk 3 dogs and you make $24. Walk 7 dogs and you make $56. The number of dogs changes. The money changes. But look at the 8. The 8 never moves. It is the one steady number holding the whole situation together, and it has a name: the constant of proportionality. We call it k. Here is the part worth remembering: k is not a new idea. It is the unit rate you have been computing since the start of this unit, wearing a longer name.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-k-and-y-equals-kx',
      kind: 'concept',
      goal: 'Define k as y ÷ x, write y = kx, and teach reading k off a table and off any point on a graph.',
      keyIdeas: [
        'k IS y DIVIDED BY x — in a proportional relationship, every pair gives the same value of y ÷ x. That shared value is called the constant of proportionality and is written k. Constant is the whole point: it does not change from one pair to the next.',
        'THE EQUATION IS y = kx — once you know k, you can find the y that goes with any x by multiplying. If k = 8 dollars per dog, then y = 8x, and 7 dogs give y = 8 × 7 = 56 dollars. The equation replaces the table, because it works for every x, even ones nobody listed.',
        'k AND THE UNIT RATE ARE THE SAME NUMBER — this is the sentence to hold onto. $0.70 per bar from lesson 3.1 was a k. The 2 miles per hour from lesson 3.2 was a k. The 2.5 dollars per taco from lesson 3.3 was a k. One number, three names: unit rate, unit price, constant of proportionality. You have been finding k all unit long.',
        'READING k FROM A TABLE — pick any row and compute y ÷ x, then check a second row to make sure the relationship really is proportional. If the rows disagree, there is no k at all, because the relationship is not proportional.',
        'READING k FROM A GRAPH — the easiest place to look is the point where x = 1, because there y is exactly k. If the graph has no marked point at x = 1, take ANY point (x, y) on the line and divide: k = y ÷ x. Do not just read the y-value of whatever point you see. That shortcut only works at x = 1.',
        'k CARRIES UNITS, AND THE UNITS ARE THE MEANING — say k out loud with its units: 8 dollars per dog, 2.5 inches per hour, 12 dollars per shirt. Stating the units is how you explain what a point on the graph means, and it is how you catch a k that was computed upside down.',
      ],
      vocabulary: [
        { term: 'constant of proportionality', definition: 'the number k that every pair in a proportional relationship gives when you compute y ÷ x.' },
        { term: 'y = kx', definition: 'the equation of a proportional relationship: multiply x by the constant k to get y.' },
        { term: 'unit rate', definition: 'the amount that goes with one of the other quantity. It is the same number as k.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-k-from-table',
      kind: 'worked_example',
      problem: 'A team store sells shirts. 3 shirts cost $36, 5 shirts cost $60, and 8 shirts cost $96. Find k and write the equation.',
      steps: [
        'Let x be the number of shirts and y be the cost in dollars, then compute y ÷ x for the first row: 36 ÷ 3 = 12.',
        'Check the other rows before trusting that 12: 60 ÷ 5 = 12, and 96 ÷ 8 = 12. All three rows agree, so the relationship is proportional and k = 12.',
        'Write the equation: y = 12x.',
        'Say k with its units: 12 dollars per shirt. That is the unit price, which is exactly the kind of number lesson 3.1 was about.',
        'Use the equation on a row that was not in the table: 10 shirts cost y = 12 × 10 = $120.',
        'Check the equation against a row that WAS given: 12 × 8 = 96, which matches the table.',
      ],
      answer: 'k = 12 dollars per shirt, and y = 12x',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-k-from-graph-point',
      kind: 'worked_example',
      problem: 'A graph of snowfall is a straight line through the origin. It passes through the point (4, 10), meaning 10 inches of snow have fallen after 4 hours. Find k and write the equation.',
      steps: [
        'The line is straight and goes through the origin, so the relationship is proportional and a single k exists.',
        'Use k = y ÷ x with the point you were given: k = 10 ÷ 4 = 2.5.',
        'Attach the units: 2.5 inches per hour. That sentence is what the constant MEANS in this story.',
        'Write the equation: y = 2.5x, where x is hours and y is inches.',
        'Find the point at x = 1: y = 2.5 × 1 = 2.5, so (1, 2.5) is on the line. On any proportional graph, the y-value at x = 1 is k itself.',
        'Predict and check. After 6 hours: y = 2.5 × 6 = 15 inches. Back-check the given point: 2.5 × 4 = 10, which matches.',
        'WRONG answer to avoid: k = 10, taken from the y-coordinate of the point. RIGHT answer: k = 2.5, because k is y ÷ x and here x is 4, not 1.',
      ],
      answer: 'k = 2.5 inches per hour, and y = 2.5x',
      estimatedMinutes: 3,
    },
    {
      id: 'try-k-from-table',
      kind: 'try_yourself',
      problem: 'A proportional table shows x: 3, 5, 8 and y: 21, 35, 56. What is the constant of proportionality?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7', correct: true },
        { id: 'b', text: '1/7' },
        { id: 'c', text: '18' },
        { id: 'd', text: '63' },
      ],
      expectedAnswer: '7',
      hints: [
        'The constant of proportionality is y ÷ x, so divide the y-value by the x-value in one row.',
        'Start with 21 ÷ 3, then check your answer against 35 ÷ 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-equation-from-graph',
      kind: 'try_yourself',
      problem: 'A proportional relationship graphs as a straight line through the origin and through the point (6, 9). Which equation matches it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'y = 1.5x', correct: true },
        { id: 'b', text: 'y = (2/3)x' },
        { id: 'c', text: 'y = x + 3' },
        { id: 'd', text: 'y = 9x' },
      ],
      expectedAnswer: 'y = 1.5x',
      hints: [
        'Find k first, using k = y ÷ x with the point (6, 9). Divide y by x, not x by y.',
        'Test your equation on the given point. Putting x = 6 into the right equation has to give y = 9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-use-the-equation',
      kind: 'try_yourself',
      problem: 'A printer prints at a constant rate and finishes 45 pages in 5 minutes. At that same rate, how many pages does it print in 12 minutes? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '108',
      hints: [
        'Find k first: pages per minute is 45 ÷ 5.',
        'Then use y = kx with x = 12 minutes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reading-k-off-a-graph',
      kind: 'misconception_check',
      question: 'A proportional graph passes through (4, 10). A student says the constant of proportionality is 10. What went wrong?',
      commonErrors: [
        {
          answer: 'k = 10',
          misconception: 'Reading the y-coordinate of a point as k. That shortcut is only valid at x = 1, and here x is 4.',
          correctsTo: 'The constant is k = y ÷ x = 10 ÷ 4 = 2.5. Test it: y = 2.5 × 4 = 10, which matches the point, while y = 10 × 4 = 40 does not. The point where the y-value alone gives k is (1, k), and on this line that point is (1, 2.5).',
        },
        {
          answer: 'k = 0.4',
          misconception: 'Dividing x by y instead of y by x, so the rate comes out upside down.',
          correctsTo: 'The constant is defined as y ÷ x, which is 10 ÷ 4 = 2.5 inches per hour. The number 0.4 is 4 ÷ 10, which is 0.4 hours per inch. That is a true statement about the same snowfall, but it is the other rate. Substituting settles it: 2.5 × 4 = 10 matches the point, and 0.4 × 4 = 1.6 does not.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The constant of proportionality is k = y ÷ x, and it is the same for every pair.',
        'The equation of a proportional relationship is y = kx.',
        'k IS the unit rate. Unit price, miles per hour, and constant of proportionality are three names for one number.',
        'From a table, divide y by x in a row and confirm with a second row. From a graph, use k = y ÷ x with any point, or read y at x = 1.',
        'Always state k with its units, such as 12 dollars per shirt, because the units are what k means.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Constant of Proportionality & Its Equation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
