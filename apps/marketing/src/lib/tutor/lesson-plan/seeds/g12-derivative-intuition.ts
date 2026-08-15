/**
 * G12 — Calculus: derivative as instantaneous rate of change.
 *
 * The big calculus moment: from "average rate over an interval" to
 * "rate at a single instant" via taking the limit. Builds intuition
 * with secant lines collapsing to the tangent line.
 */

import type { LessonPlan } from '../types';

export const SEED_G12_DERIVATIVE_INTUITION: LessonPlan = {
  id: 'evelyn.g12.math.calculus.derivative-intuition.v1',
  title: 'The Derivative — Instantaneous Rate of Change',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ap.calc-ab.cha.2',
      description: 'Define the derivative as a limit; interpret it as a rate of change and slope of the tangent line.',
      standard: 'AP-Calculus-AB-CHA-2',
    },
    {
      id: 'evelyn.calc.derivative.first-principles',
      description: 'Compute a derivative from first principles using f\'(x) = lim h→0 [f(x+h) − f(x)] / h.',
      standard: 'evelyn-internal',
    },
  ],
  prerequisites: ['ccss.math.hsf.if.b.6'],
  followUps: ['ap.calc-ab.cha.3'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student confront the paradox: speed at a SINGLE instant. If no time has passed, no distance was covered — so what does it even mean?',
      script: 'You\'re driving and your speedometer says 60 mph. But "miles per hour" is a RATE — distance over time. At a single instant, no time has passed and no distance was covered. So what does the speedometer actually mean? That paradox is what derivatives solve.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-secant-to-tangent',
      kind: 'concept',
      goal: 'The average rate over an interval [x, x+h] is the slope of a SECANT line. As h shrinks to 0, the secant pivots into the TANGENT line — and that slope is the instantaneous rate.',
      keyIdeas: [
        'Average rate of change of f over [x, x+h] = [f(x+h) − f(x)] / h. That\'s the slope of the SECANT line through the two points (x, f(x)) and (x+h, f(x+h)).',
        'Pick smaller and smaller h. The secant line pivots, getting closer and closer to the TANGENT line at x.',
        'The slope of the tangent line is what we call the DERIVATIVE at x: f\'(x).',
        'Formally: f\'(x) = lim h→0 [f(x+h) − f(x)] / h.',
        'The limit handles the "0/0" paradox — we never actually plug h = 0; we look at the trend as h gets close.',
      ],
      vocabulary: [
        { term: 'secant line', definition: 'a line through two points on the curve.' },
        { term: 'tangent line', definition: 'the line touching the curve at a single point, matching its instantaneous slope.' },
        { term: 'derivative', definition: 'the slope of the tangent line at a point — the instantaneous rate of change.' },
      ],
      suggestedTools: ['show_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-quadratic',
      kind: 'worked_example',
      problem: 'Find f\'(x) for f(x) = x² using first principles.',
      steps: [
        'Write the difference quotient: [f(x+h) − f(x)] / h = [(x+h)² − x²] / h.',
        'Expand (x+h)² = x² + 2xh + h². So numerator = x² + 2xh + h² − x² = 2xh + h².',
        'Divide by h: (2xh + h²) / h = 2x + h. (Allowed because h ≠ 0 inside the limit.)',
        'Now take the limit as h → 0: lim (2x + h) = 2x.',
        'So f\'(x) = 2x. The slope of y = x² at any x is 2x.',
        'CHECK: at x = 3, f\'(3) = 6. The tangent to y = x² at (3, 9) has slope 6.',
      ],
      answer: 'f\'(x) = 2x',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use first principles to find f\'(x) for f(x) = 3x.',
      expectedAnswer: '3',
      responseFormat: 'frq',
      hints: [
        'Set up [f(x+h) − f(x)] / h with f(x) = 3x.',
        'Numerator: 3(x+h) − 3x = 3h. Divide by h: 3. The limit of 3 as h → 0 is just 3.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cant-divide-by-zero',
      kind: 'misconception_check',
      question: 'A friend says "you\'re dividing by h, but h is going to 0, so you\'re dividing by zero. That\'s illegal." How do you respond?',
      commonErrors: [
        {
          answer: 'illegal',
          misconception: 'Conflating "the LIMIT as h → 0" with "plugging in h = 0."',
          correctsTo: 'We never plug h = 0. We simplify the expression algebraically (e.g., cancel one factor of h) until what\'s left has no division by h, THEN look at the limit. The limit asks "what does this APPROACH" as h gets near 0, not what it equals AT 0. The cancellation is what makes the answer well-defined.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Average rate over [x, x+h] = slope of the secant. Instantaneous rate at x = slope of the tangent.',
        'f\'(x) = lim h→0 [f(x+h) − f(x)] / h.',
        'Compute by expanding, simplifying (cancel h from the numerator), then taking the limit.',
        'The derivative IS itself a function — f\'(x) gives the slope at every x.',
        '"Limit as h → 0" is NOT "plug in h = 0."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'You found that the derivative of x² is 2x. Guess the derivative of x³, and verify with first principles.',
      hint: 'Pattern from x² → 2x: bring the exponent down, reduce by 1. So x³ → 3x². Now check by expanding (x+h)³ = x³ + 3x²h + 3xh² + h³.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
