/**
 * Grades 9-10 Math — Linear Functions: Slope-Intercept Form.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_MATH_LINEAR_SLOPE_INTERCEPT: LessonPlan = {
  id: 'evelyn.g910.math.linear.slope-intercept.v1',
  title: 'Linear Functions — Slope-Intercept Form',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'linear-functions',
  locale: 'en',
  los: [
    {
      id: 'g910.math.linear.slope-intercept',
      description: 'Write, interpret, and graph linear functions in y = mx + b form; identify slope and y-intercept from graphs and tables.',
      standard: 'CCSS.MATH.CONTENT.HSF.IF.B.4 / HSF.LE.A.2',
    },
  ],
  prerequisites: ['g8.math.slope-linear-functions'],
  followUps: ['g910.math.linear.point-slope'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Slope-intercept form turns a line into two numbers — and those numbers tell a story.',
      script: 'Cell-phone plan: $30 base fee plus $0.10 per text. Total cost C as a function of texts t? C = 0.10t + 30. The 30 is the y-intercept (cost at zero texts). The 0.10 is the slope (cost per added text). Two numbers, full story. That\'s y = mx + b.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-intercept',
      kind: 'concept',
      goal: 'Form, slope as rate of change, y-intercept as starting value, graphing, interpreting.',
      keyIdeas: [
        'FORM: y = mx + b, where m = slope, b = y-intercept.',
        'SLOPE m = rise / run = (change in y) / (change in x). Real-world meaning: the rate of change of y per unit increase in x.',
        'Y-INTERCEPT b = the value of y when x = 0. Real-world meaning: the starting value before any x has accumulated.',
        'POSITIVE slope rises left-to-right; NEGATIVE slope falls; ZERO slope is horizontal; UNDEFINED slope is vertical (vertical lines aren\'t functions).',
        'TO GRAPH y = mx + b: plot the y-intercept (0, b), then use slope to find another point (rise m, run 1, or in fraction form rise/run). Draw the line.',
        'TO FIND m FROM TWO POINTS (x₁, y₁) and (x₂, y₂): m = (y₂ − y₁) / (x₂ − x₁).',
        'TO FIND m FROM A TABLE: pick any two rows; (Δy)/(Δx). If the table is linear, every consecutive Δy/Δx is the same.',
        'WORD-PROBLEM CONTEXT: identify which quantity is x (the input/independent), which is y (output). Slope = "per unit change"; intercept = "starting amount."',
      ],
      vocabulary: [
        { term: 'slope', definition: 'the ratio of vertical change to horizontal change between any two points on a line; the line\'s rate of change.' },
        { term: 'y-intercept', definition: 'the y-value where the line crosses the y-axis; equivalently, the value when x = 0.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Pizzeria charges $5 delivery + $12 per pizza. Find the linear function for total cost C of n pizzas, identify slope and intercept in context, and graph for 0 ≤ n ≤ 5.',
      steps: [
        'Identify variables: n = number of pizzas (input), C = total cost (output).',
        'Slope: $12 per additional pizza ⟹ m = 12.',
        'Y-intercept: cost when n = 0 (just the delivery fee) ⟹ b = 5.',
        'Function: C = 12n + 5.',
        'Interpret: every pizza adds $12 (slope), starting from $5 (intercept).',
        'Graph: y-intercept at (0, 5). Slope 12 means rise 12 for every run 1.',
        'Plot points: (0, 5), (1, 17), (2, 29), (3, 41), (4, 53), (5, 65). Draw a line.',
        'Reasonable check: 5 pizzas at $12 + delivery = 60 + 5 = $65 ✓.',
      ],
      answer: 'C = 12n + 5; slope = $12/pizza; intercept = $5 delivery.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A line passes through (1, 4) and (4, 13). Write its slope-intercept form.',
      expectedAnswer: 'Slope m = (13 − 4)/(4 − 1) = 9/3 = 3. Plug (1, 4) into y = 3x + b: 4 = 3(1) + b ⟹ b = 1. Equation: y = 3x + 1. Verify with second point: 3(4) + 1 = 13 ✓.',
      responseFormat: 'free',
      hints: [
        'Compute slope from the two points first.',
        'Then plug one point into y = mx + b to find b.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-slope-direction',
      kind: 'misconception_check',
      question: 'A student computes slope from (1, 4) and (4, 13) as (4 − 1)/(13 − 4) = 3/9 = 1/3. What went wrong?',
      commonErrors: [
        {
          answer: 'Inverts the slope ratio',
          misconception: 'Mixing rise/run with run/rise — flipping the formula.',
          correctsTo: 'Slope is RISE OVER RUN = (change in y) / (change in x). The student wrote (change in x) / (change in y), inverting the ratio. Correct: (13 − 4)/(4 − 1) = 9/3 = 3, NOT 1/3. Memory trick: y is on top because slope tells you how much y changes per UNIT of x. The denominator is what x changes BY (the unit); the numerator is the response.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'y = mx + b: m is rate of change, b is starting value.',
        'Slope = rise/run = Δy/Δx (y on top).',
        'In context, slope = "per unit"; intercept = "starting amount."',
        'Graph by plotting (0, b) then using slope as rise/run.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
