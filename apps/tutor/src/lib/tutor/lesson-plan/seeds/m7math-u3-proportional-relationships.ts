/**
 * Grade 7 Math — Ratios & Proportional Relationships: Recognizing
 * Proportional Relationships.
 *
 * CCSS 7.RP.A.2a. The question moves from "what is the rate" to "is this
 * relationship proportional at all", and it is answered three ways: a table
 * (does every row give the same y ÷ x), a graph (straight line THROUGH THE
 * ORIGIN), and an equation (y = kx with nothing added). The origin condition
 * is the part students drop, so the discriminating non-example y = 2x + 3
 * runs through the whole plan: straight line, steady climb, not proportional.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U3_PROPORTIONAL_RELATIONSHIPS: LessonPlan = {
  id: 'evelyn.ms.m7math.proportional-relationships.v1',
  title: 'Recognizing Proportional Relationships',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.proportional-relationships',
      standard: 'M7MATH-3.3',
      description:
        'Decide whether two quantities are in a proportional relationship by testing equivalent ratios in a table, by checking whether the graph is a straight line through the origin, and by inspecting the equation (CCSS 7.RP.A.2a).',
    },
  ],
  prerequisites: ['m7math.complex-fraction-unit-rates'],
  followUps: ['m7math.constant-of-proportionality'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a proportional situation and a linear-but-not-proportional situation side by side so the difference is felt before it is named.',
      script:
        'Your school sells raffle tickets for $2 each. One ticket is $2. Two tickets are $4. Five tickets are $10. Double the tickets and the price doubles right along with them. Now picture the bowling alley: $4 to rent shoes, then $3 for each game. Two games cost $10. Four games cost $16, which is more, but it is not double, because the shoes only get paid for once. Both situations are steady. Both of them graph as perfectly straight lines. Only ONE of them is proportional. Today we learn the three tests that tell them apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-tests',
      kind: 'concept',
      goal: 'Give the student three independent tests for proportionality and make the origin condition impossible to forget.',
      keyIdeas: [
        'PROPORTIONAL MEANS THE RATIO NEVER CHANGES — two quantities are in a proportional relationship when y ÷ x gives the same number for every single pair. That shared number is the unit rate you have been finding all unit long.',
        'TEST 1, THE TABLE — divide y by x in EVERY row, not just the first one. If all the answers match, the relationship is proportional. One matching row proves nothing, because a table can start out looking proportional and then break in a later row.',
        'TEST 2, THE GRAPH — the graph must be a straight line AND it must pass through the origin, the point (0, 0). Both parts are required. The origin part is the one students forget, and it is exactly where most mistakes come from. A straight line that crosses the vertical axis anywhere else is linear but NOT proportional.',
        'TEST 3, THE EQUATION — the equation has to look like y = kx, a number times x and nothing else. Nothing added on, nothing subtracted off. So y = 5x is proportional, and y = 2x + 3 is not, because that + 3 is riding along no matter how small x gets.',
        'THE DISCRIMINATING CASE IS y = 2x + 3 — it climbs by the same amount every step, so its graph is a straight line, and it feels proportional. Check the ratios and it falls apart: at x = 1 the ratio is 5, at x = 2 it is 3.5, at x = 3 it is 3. Every proportional relationship is linear, but plenty of linear relationships are not proportional.',
        'TWO FAST SANITY CHECKS — first, zero in should give zero out: if x = 0 does not make y = 0, stop, it is not proportional. Second, doubling x must exactly double y. Either check can rule a relationship out in seconds.',
      ],
      vocabulary: [
        { term: 'proportional relationship', definition: 'a relationship in which y ÷ x is the same number for every pair of values.' },
        { term: 'origin', definition: 'the point (0, 0) on a graph, where both axes meet.' },
        { term: 'linear', definition: 'graphing as a straight line. Every proportional relationship is linear, but not every linear one is proportional.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-table-test',
      kind: 'worked_example',
      problem: 'A taco stand posts this table. Tacos: 2, 4, 6, 10. Cost in dollars: 5, 10, 15, 25. Is the relationship proportional?',
      steps: [
        'Run the table test, which means dividing cost by tacos in every row.',
        'Row by row: 5 ÷ 2 = 2.5, then 10 ÷ 4 = 2.5, then 15 ÷ 6 = 2.5, then 25 ÷ 10 = 2.5.',
        'All four rows give the same number, 2.5, so the relationship IS proportional.',
        'The shared number has meaning: $2.50 per taco. That is the unit rate, and it is the same kind of number you found in lessons 3.1 and 3.2.',
        'Confirm with the sanity checks. Zero tacos cost zero dollars, so the graph goes through the origin. And doubling the tacos from 2 to 4 doubles the cost from $5 to $10.',
      ],
      answer: 'Yes, it is proportional, and every row gives 2.5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-non-example',
      kind: 'worked_example',
      problem: 'A skating rink charges $3 to get in, plus $2 for each hour you skate, so the cost is y = 2x + 3. Is the relationship between hours and cost proportional?',
      steps: [
        'Build a small table from the equation. At x = 0, y = 2(0) + 3 = 3. At x = 1, y = 5. At x = 2, y = 7. At x = 3, y = 9.',
        'Table test: 5 ÷ 1 = 5, then 7 ÷ 2 = 3.5, then 9 ÷ 3 = 3. Those are not the same number, so it fails the table test.',
        'Graph test: at x = 0 the cost is $3, not $0. The line crosses the vertical axis at (0, 3), so it misses the origin and fails the graph test.',
        'Equation test: y = 2x + 3 is not in the form y = kx, because of the + 3. That is a third failure, and all three tests agree.',
        'Notice what is still true. The cost climbs by exactly $2 every hour, so the graph really is a perfectly straight line. Straight is not enough.',
        'WRONG answer to avoid: it is proportional because the graph is a straight line. RIGHT answer: it is linear but NOT proportional, because the $3 entry fee is paid once and does not grow with the hours.',
      ],
      answer: 'No. It is linear but not proportional.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-table',
      kind: 'try_yourself',
      problem: 'Which table shows a proportional relationship?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x: 1, 2, 3 and y: 4, 8, 12', correct: true },
        { id: 'b', text: 'x: 1, 2, 3 and y: 6, 9, 12' },
        { id: 'c', text: 'x: 1, 2, 3 and y: 2, 4, 7' },
        { id: 'd', text: 'x: 1, 2, 3 and y: 1, 4, 9' },
      ],
      expectedAnswer: 'x: 1, 2, 3 and y: 4, 8, 12',
      hints: [
        'Divide y by x in every row of every table. Do not stop after the first row.',
        'Going up by the same amount each step is NOT the test. The test is dividing and getting the same answer each time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-graph-origin',
      kind: 'try_yourself',
      problem: 'A straight line passes through the points (0, 2), (1, 5), and (2, 8). Is the relationship proportional?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, because the line does not pass through the origin', correct: true },
        { id: 'b', text: 'Yes, because the points all lie on a straight line' },
        { id: 'c', text: 'Yes, because y goes up by 3 every time x goes up by 1' },
        { id: 'd', text: 'Yes, because every y-value is larger than its x-value' },
      ],
      expectedAnswer: 'No, because the line does not pass through the origin',
      hints: [
        'The graph test has two parts. Straight is only the first part. What is the second part?',
        'Look hard at the point (0, 2). When x is 0, what does y have to be for a proportional relationship?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-common-ratio',
      kind: 'try_yourself',
      problem: 'This table is proportional. x: 4, 6, 10 and y: 18, 27, 45. Every row gives the same value of y ÷ x. What is that value? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4.5',
      hints: [
        'Pick any row and divide y by x, then check a second row to be sure.',
        'Start with the easiest row: 18 ÷ 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-linear-is-not-proportional',
      kind: 'misconception_check',
      question: 'A student looks at the table x: 1, 2, 3 with y: 5, 7, 9 and says it is proportional, because y goes up by the same amount every time. What went wrong?',
      commonErrors: [
        {
          answer: 'It is proportional, because y goes up by 2 each time',
          misconception: 'Testing for a constant DIFFERENCE when proportionality requires a constant RATIO. A steady climb makes a relationship linear, which is a weaker condition.',
          correctsTo: 'Divide instead of subtracting: 5 ÷ 1 = 5, then 7 ÷ 2 = 3.5, then 9 ÷ 3 = 3. Those do not match, so it is not proportional. This table is exactly y = 2x + 3, which means x = 0 gives y = 3, and the graph is a straight line through (0, 3) rather than through the origin. Linear, yes. Proportional, no.',
        },
        {
          answer: 'Any straight line on a graph shows a proportional relationship',
          misconception: 'Treating the graph test as if straightness were the whole test, and dropping the origin condition.',
          correctsTo: 'The graph test has two parts, and both are required: straight line AND through the origin (0, 0). The line for y = 2x + 3 is perfectly straight, but it crosses the vertical axis at (0, 3), so it is not proportional. Every proportional relationship is linear; the reverse is not true.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Proportional means y ÷ x is the SAME number for every pair.',
        'Table test: divide y by x in every row, not just one row.',
        'Graph test: straight line AND through the origin (0, 0). Both parts are required.',
        'Equation test: y = kx with nothing added or subtracted. y = 2x + 3 is linear but not proportional.',
        'Fast checks: x = 0 must give y = 0, and doubling x must double y.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Recognizing Proportional Relationships' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
