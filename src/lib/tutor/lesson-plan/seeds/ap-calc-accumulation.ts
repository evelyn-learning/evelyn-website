/**
 * AP Calc AB — Accumulation Functions and the Definite Integral.
 *
 * F(x) = ∫_a^x f(t) dt, FTC connection, accumulating change as area.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_ACCUMULATION: LessonPlan = {
  id: 'evelyn.ap.calc.accumulation.v1',
  title: 'Accumulation Functions',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'math',
  topic: 'ap-calculus-ab',
  locale: 'en',
  los: [
    {
      id: 'apcalc.accumulation',
      description: 'Interpret and compute accumulation functions F(x) = ∫_a^x f(t) dt, recognize the connection to the FTC, and apply to rate-of-change problems.',
      standard: 'AP-CALC-CHA-3',
    },
  ],
  prerequisites: ['apcalc.fundamental-theorem'],
  followUps: ['apcalc.area-between-curves'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'An integral as a function, not just a number.',
      script: 'You\'ve seen ∫_a^b f(x) dx as a single number — the area under the curve. Now imagine letting the upper limit move. Each value of x gives a different area. That\'s an accumulation function: an integral whose output depends on how far you\'ve gone. Understanding this is the bridge from definite integrals to the FTC.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ftc',
      kind: 'concept',
      goal: 'Accumulation functions and FTC Part 1.',
      keyIdeas: [
        'DEFINITION: F(x) = ∫_a^x f(t) dt. The variable t is a dummy; x is the running upper limit.',
        'F(x) measures the SIGNED AREA under f from a to x. Negative values of f produce negative contributions.',
        'F(a) = 0 (area from a to a is zero).',
        'FTC PART 1: F\'(x) = f(x). The derivative of an accumulation function is the integrand. So F is an antiderivative of f.',
        'EXTENSION: if F(x) = ∫_a^{g(x)} f(t) dt, then F\'(x) = f(g(x)) · g\'(x). Chain rule applies.',
        'BEHAVIOR OF F: where f > 0, F is INCREASING. Where f < 0, F is DECREASING. Where f = 0, F has a critical point. Sign of f\'(x) = f tells you concavity of F.',
        'INTERPRETING IN CONTEXT: if f(t) is a RATE (gallons/min, m/s, $/year), then F(x) gives the TOTAL ACCUMULATED quantity from time a to time x.',
        'EXTREMA OF F: where F\'(x) = f(x) = 0 AND f changes sign. Sign chart of f tells you where F is max/min on [a, b].',
      ],
      vocabulary: [
        { term: 'accumulation function', definition: 'F(x) = ∫_a^x f(t) dt — running total of f starting from a.' },
        { term: 'Fundamental Theorem of Calculus (Part 1)', definition: 'd/dx ∫_a^x f(t) dt = f(x) — differentiating an accumulation function returns the integrand.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-graph',
      kind: 'worked_example',
      problem: 'A rate function f(t) = 6 − 2t describes water flowing into a tank in gallons/min. Define F(x) = ∫_0^x (6 − 2t) dt. Find F(2), then determine where F is increasing.',
      steps: [
        'F(x) = ∫_0^x (6 − 2t) dt = [6t − t²] from 0 to x = 6x − x².',
        'F(2) = 6·2 − 2² = 12 − 4 = 8 gallons accumulated in the first 2 minutes.',
        'F is increasing where F\'(x) > 0, i.e., where f(x) > 0.',
        '6 − 2x > 0 → x < 3.',
        'So F is increasing on [0, 3) and decreasing on (3, ∞).',
        'INTERPRETATION: water flows in until t = 3 (rate becomes zero), then drains.',
      ],
      answer: 'F(2) = 8 gallons. F is increasing on [0, 3).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'If F(x) = ∫_1^x t² dt, find F\'(x).',
      expectedAnswer: 'x²',
      responseFormat: 'free',
      hints: [
        'FTC Part 1: differentiating an accumulation function returns the integrand evaluated at x.',
        'F\'(x) = f(x). Here f(t) = t².',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dummy-variable',
      kind: 'misconception_check',
      question: 'In F(x) = ∫_0^x t² dt, can you replace t with x inside the integral?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the dummy integration variable with the function\'s input.',
          correctsTo: 'No — t is the DUMMY variable of integration; x is the UPPER LIMIT. They have different roles. Replacing t with x would create the nonsensical ∫_0^x x² dt = x²·x = x³ — which is actually the value of F here, but only because the integrand happens to be t². For F(x) = ∫_0^x f(t) dt in general, t is the moving variable across [0, x] and x is fixed during the integration.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F(x) = ∫_a^x f(t) dt is a function of x. F(a) = 0.',
        'FTC Part 1: F\'(x) = f(x). Sign of f tells you behavior of F.',
        'If f is a rate, F is the accumulated total.',
        'Don\'t confuse the dummy variable with the limit.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'If H(x) = ∫_0^{x²} sin(t) dt, find H\'(x).',
      hint: 'Chain rule. H\'(x) = sin(x²) · 2x. The integrand evaluated at the upper limit, times the derivative of the upper limit.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
