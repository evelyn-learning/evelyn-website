/**
 * G8 — Slope and linear functions (y = mx + b).
 *
 * The slope-intercept form. Slope as rise/run, the rate of change of
 * y per unit of x. y-intercept as the starting value (where the line
 * crosses the y-axis). Reading m and b directly off the equation,
 * graphing from m and b, finding equation from a graph or table.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_SLOPE_LINEAR_FUNCTIONS: LessonPlan = {
  id: 'evelyn.g8.math.slope-linear-functions.v1',
  title: 'Slope and Linear Functions',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'linear-functions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.f.b.4',
      description: 'Construct a function to model a linear relationship; determine slope and y-intercept.',
      standard: 'CCSS.MATH.CONTENT.8.F.B.4',
    },
    {
      id: 'ccss.math.8.ee.b.5',
      description: 'Graph proportional relationships; interpret unit rate as slope.',
      standard: 'CCSS.MATH.CONTENT.8.EE.B.5',
    },
  ],
  prerequisites: ['ccss.math.7.rp.a.2', 'ccss.math.5.g.a.1'],
  followUps: ['ccss.math.hsf.le.a.1'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a phone-bill scenario to motivate y = mx + b.',
      script: 'A phone plan charges $10 a month no matter what (just for being a customer), plus $0.05 per minute of calls. Your monthly bill = 0.05 × minutes + 10. The 10 is the starting cost; the 0.05 tells you how fast the bill grows. THAT is the structure of a linear function.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-slope-intercept',
      kind: 'concept',
      goal: 'y = mx + b: m is slope (rate of change), b is y-intercept (starting value at x=0).',
      keyIdeas: [
        'A LINEAR FUNCTION graphs as a straight line. Standard form: y = mx + b.',
        'm = SLOPE = the rate of change. How much y changes per 1 increase in x.',
        'b = Y-INTERCEPT = the value of y when x = 0. The point where the line crosses the y-axis.',
        'SLOPE FORMULA: between two points (x₁, y₁) and (x₂, y₂): m = (y₂ - y₁) / (x₂ - x₁) = rise / run.',
        'Positive slope: line goes UP left-to-right. Negative slope: goes DOWN. Zero slope: horizontal line. Undefined slope: vertical line.',
        'GRAPHING from y = mx + b: plot b on the y-axis. From there, use the slope to step right (run) and up/down (rise) to get a second point.',
        'Proportional relationships (G7) are a special case: y = mx (where b = 0).',
      ],
      vocabulary: [
        { term: 'slope', definition: 'rise over run; how steep the line is.' },
        { term: 'y-intercept', definition: 'where the line crosses the y-axis (value of y when x = 0).' },
        { term: 'linear function', definition: 'a function whose graph is a straight line; y = mx + b.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-graph-from-equation',
      kind: 'worked_example',
      problem: 'Graph y = 2x + 3.',
      steps: [
        'Identify m and b. m = 2, b = 3.',
        'Plot the y-intercept first: (0, 3) is the starting point on the y-axis.',
        'Use the slope to find another point. m = 2 = 2/1 = rise 2, run 1. From (0, 3), move 1 right and 2 up: (1, 5).',
        'Plot a third point for confirmation: from (1, 5) → (2, 7).',
        'Draw a straight line through the three points.',
      ],
      answer: 'Line through (0,3) with slope 2',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-slope-from-points',
      kind: 'worked_example',
      problem: 'Find the slope of the line through (1, 4) and (5, 12).',
      steps: [
        'Apply the slope formula: m = (y₂ - y₁) / (x₂ - x₁).',
        'Pick (x₁, y₁) = (1, 4) and (x₂, y₂) = (5, 12).',
        'Numerator: 12 - 4 = 8.',
        'Denominator: 5 - 1 = 4.',
        'm = 8 / 4 = 2.',
        'Check: order doesn\'t matter as long as you\'re consistent. (4 - 12)/(1 - 5) = -8/-4 = 2 also.',
      ],
      answer: '2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the slope and y-intercept of y = -3x + 7.',
      expectedAnswer: 'slope = -3, y-intercept = 7',
      responseFormat: 'free',
      hints: [
        'In y = mx + b, m is the coefficient of x and b is the constant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-slope-direction',
      kind: 'misconception_check',
      question: 'Lina computes slope between (1, 4) and (5, 12) as (1 - 5)/(4 - 12) = -4/-8 = 0.5. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Putting x-differences on top and y-differences on bottom (slope is rise OVER run, not run over rise).',
          correctsTo: 'Wrong. Slope is (y₂ - y₁) / (x₂ - x₁) — y on top. Lina inverted it. The right answer is 8/4 = 2. Her 0.5 is the RECIPROCAL of the slope.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Linear function: y = mx + b. Straight line.',
        'm = slope = rise / run = (Δy)/(Δx).',
        'b = y-intercept = where the line crosses the y-axis (x = 0).',
        'Graph: plot b first, then use slope to step to next points.',
        'Slope formula: y on top, x on bottom — rise over run.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A line passes through (2, 10) with slope -3. Write its equation in slope-intercept form.',
      hint: 'y = mx + b. m = -3. Use the point: 10 = -3(2) + b → 10 = -6 + b → b = 16. Equation: y = -3x + 16.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
