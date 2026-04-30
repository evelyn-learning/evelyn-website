/**
 * AP Calc AB — Area Between Curves.
 *
 * Setting up integrals top-minus-bottom or right-minus-left, finding intersection points.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_AREA_BETWEEN_CURVES: LessonPlan = {
  id: 'evelyn.ap.calc.area-between-curves.v1',
  title: 'Area Between Curves',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalc.area-between',
      description: 'Compute the area between two curves by integrating top-minus-bottom (or right-minus-left), finding intersection points to set the limits.',
      standard: 'AP-CALC-CHA-5',
    },
  ],
  prerequisites: ['apcalc.fundamental-theorem', 'apcalc.accumulation'],
  followUps: ['apcalc.volumes'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Two curves sandwich a region; the integral measures it.',
      script: 'You can find the area between any two curves by integrating their DIFFERENCE. The trick is being clear about which is on top and where they cross. Sketch the region, identify the boundaries, and the integral falls out. The challenge is rarely the calculus — it\'s the bookkeeping.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Set up integrals for area between curves; choose dx vs dy.',
      keyIdeas: [
        'TOP-MINUS-BOTTOM: if f(x) ≥ g(x) on [a, b], area = ∫_a^b [f(x) − g(x)] dx.',
        'RIGHT-MINUS-LEFT: if h(y) ≥ k(y) on [c, d], area = ∫_c^d [h(y) − k(y)] dy. Use this when curves are easier to express as x = function(y).',
        'STEP 1 — SKETCH the region. Identify which curve is on top vs bottom (or right vs left).',
        'STEP 2 — FIND INTERSECTIONS. Set f(x) = g(x), solve for x. These become the integration limits.',
        'STEP 3 — IF curves SWITCH which is on top, you must SPLIT the integral at the crossover. Each piece has its own (top − bottom) order.',
        'STEP 4 — INTEGRATE. The result is always positive — area is unsigned.',
        'EXAMPLE TYPES: parabola and line, two parabolas, sin and cos, exponential and polynomial.',
        'WHEN TO USE dy: if a curve is a function of y but not of x (e.g. x = y² is a parabola opening rightward — fails vertical line test), integrate in y.',
      ],
      vocabulary: [
        { term: 'integration limits', definition: 'the x-values (or y-values) bounding the region of integration.' },
        { term: 'crossover', definition: 'an x-value where the two curves intersect, possibly switching which is on top.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-line-parabola',
      kind: 'worked_example',
      problem: 'Find the area between y = x and y = x² from x = 0 to where they intersect again.',
      steps: [
        'Sketch: y = x is a line through origin. y = x² is a parabola through origin. They meet at x = 0 and x = 1 (since x = x² → x(x − 1) = 0).',
        'On (0, 1), which is on top? At x = 0.5: line gives 0.5; parabola gives 0.25. Line is on top.',
        'Setup: area = ∫_0^1 (x − x²) dx.',
        'Antiderivative: x²/2 − x³/3.',
        'Evaluate: (1/2 − 1/3) − (0 − 0) = 3/6 − 2/6 = 1/6.',
      ],
      answer: '1/6 square units',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the area between y = x² and y = 4 from x = −2 to x = 2.',
      expectedAnswer: '32/3',
      responseFormat: 'free',
      hints: [
        'Top is y = 4; bottom is y = x². They cross at x = ±2.',
        '∫_{−2}^{2} (4 − x²) dx = [4x − x³/3] from −2 to 2.',
        'By symmetry: 2 · ∫_0^2 (4 − x²) dx.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-absolute-value',
      kind: 'misconception_check',
      question: 'If f(x) − g(x) is negative on part of [a, b], can you just put absolute value bars and integrate ∫_a^b |f(x) − g(x)| dx?',
      commonErrors: [
        {
          answer: 'yes — that handles everything',
          misconception: 'Treating |f − g| as a one-line shortcut.',
          correctsTo: 'In principle yes, but in PRACTICE you have to find where f − g changes sign and split the integral anyway, integrating |f − g| = (f − g) on intervals where f > g and (g − f) where g > f. Skipping that step usually leads to a wrong answer because you can\'t mechanically antidifferentiate an absolute value. The standard AP method: find intersection points, sketch, set up TOP − BOTTOM on each piece.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Top − Bottom (or Right − Left) is the integrand.',
        'Find intersections to set the limits. Sketch first.',
        'Split the integral if curves swap order.',
        'Integrate dx by default; switch to dy if curves are easier as x = f(y).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the area between x = y² and x = 2y − y² (sketch first).',
      hint: 'Both expressed as x = f(y) — integrate in y. Set them equal: y² = 2y − y² → 2y² − 2y = 0 → y = 0, 1. On (0,1), which is right? At y = 0.5: y² = 0.25; 2y − y² = 0.75. Right curve is 2y − y². Area = ∫_0^1 (2y − y² − y²) dy = ∫_0^1 (2y − 2y²) dy = [y² − 2y³/3]_0^1 = 1 − 2/3 = 1/3.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
