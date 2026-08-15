/**
 * AP Calculus BC — CED Unit 2.1+2.2: Defining Average + Instantaneous
 * Rates of Change + Derivative Definition + Notation. Combined.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_DERIVATIVE_DEFINITION: LessonPlan = {
  id: 'evelyn.ap.calcbc.derivative-definition.v1',
  title: 'U2.1 The Derivative — Definition and Notation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.derivative-definition',
      description:
        'State the derivative as the limit of the difference quotient (two equivalent forms), apply the limit definition to compute f\'(a) for simple functions, and use Leibniz / Lagrange / Newton notation interchangeably.',
      standard: 'AP-CALCBC-2.1-2.2',
    },
  ],
  prerequisites: ['apcalcbc.intermediate-value-theorem'],
  followUps: ['apcalcbc.differentiability-continuity'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie back to U1.1 — calculus needed limits to define instantaneous rate; that limit IS the derivative.',
      script:
        "In Unit 1 we built limits to handle the 0/0 of instantaneous rate of change. Today we name what that limit IS — the DERIVATIVE. f\\'(a) — the slope of the tangent line at x = a, the velocity at instant t, the marginal rate of anything. The most important object in calculus.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-def',
      kind: 'concept',
      goal: 'Cover both equivalent forms of the derivative limit, notation, geometric meaning.',
      keyIdeas: [
        'DERIVATIVE AT A POINT — DEFINITION (form 1, "h-form"): f\'(a) = lim_{h→0} [f(a + h) − f(a)] / h. (h is the small offset.)',
        'DERIVATIVE — DEFINITION (form 2, "x-form"): f\'(a) = lim_{x→a} [f(x) − f(a)] / (x − a). (Equivalent — just rename h = x − a.) AP exam questions use both; you should recognize each as a derivative.',
        'GEOMETRIC MEANING: f\'(a) is the SLOPE OF THE TANGENT LINE to y = f(x) at x = a. The difference quotient is the slope of the secant; the limit makes it the tangent.',
        'PHYSICAL MEANING: if s(t) is position, s\'(t) is velocity. If V(r) is volume, V\'(r) is the rate at which volume changes per unit r. ANY rate-of-change interpretation transfers.',
        'NOTATION (3 forms — all mean the same thing):',
        'LAGRANGE: f\'(x), f\'(a). Most common in AP exam.',
        'LEIBNIZ: dy/dx, df/dx, df/dx |_{x=a}. Useful for differential equations and chain rule. The "d/dx" emphasizes "rate of change with respect to x".',
        'NEWTON: ẏ, ḟ. Used in physics; rare in AP.',
        'EXISTENCE. The limit may not exist at every point. f\'(a) DNE if (a) the function isn\'t continuous at a, (b) has a corner / cusp, (c) has a vertical tangent. We\'ll formalize in the next plan.',
      ],
      vocabulary: [
        { term: 'derivative', definition: 'f\'(a) = lim_{h→0} [f(a + h) − f(a)] / h — the instantaneous rate of change at x = a, equivalently the slope of the tangent line.' },
        { term: 'difference quotient', definition: '[f(x + h) − f(x)] / h — the slope of the secant line over an interval of width h.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-from-definition',
      kind: 'worked_example',
      problem:
        'Use the limit definition to find f\'(2), where f(x) = x² + 3x.',
      steps: [
        'STEP 1 — APPLY h-form. f\'(2) = lim_{h→0} [f(2 + h) − f(2)] / h.',
        'STEP 2 — COMPUTE NUMERATOR. f(2 + h) = (2 + h)² + 3(2 + h) = 4 + 4h + h² + 6 + 3h = 10 + 7h + h². f(2) = 4 + 6 = 10. Numerator = 7h + h².',
        'STEP 3 — DIVIDE BY h. (7h + h²)/h = 7 + h.',
        'STEP 4 — TAKE THE LIMIT. lim_{h→0} (7 + h) = 7.',
        'STEP 5 — ANSWER. f\'(2) = 7. (Quick check: with rules from U2.5, f\'(x) = 2x + 3, so f\'(2) = 4 + 3 = 7. ✓)',
      ],
      answer: 'f\'(2) = 7',
      estimatedMinutes: 5,
    },
    {
      id: 'try-h-form',
      kind: 'try_yourself',
      problem:
        'Use the limit definition to find f\'(3), where f(x) = x² − 5x + 2.',
      expectedAnswer:
        'f\'(3) = lim_{h→0} [f(3+h) − f(3)]/h. f(3+h) = (3+h)² − 5(3+h) + 2 = 9 + 6h + h² − 15 − 5h + 2 = -4 + h + h². f(3) = 9 − 15 + 2 = -4. Numerator = h + h². Divided: 1 + h. lim = 1. So f\'(3) = 1.',
      responseFormat: 'numeric',
      hints: ['Expand f(3 + h), simplify numerator, divide by h, take limit.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-recognize',
      kind: 'try_yourself',
      problem:
        'For each limit, identify whether it represents a derivative. If yes, identify the function f and the point a. (a) lim_{h→0} [(2+h)³ − 8]/h. (b) lim_{x→4} [√x − 2]/(x − 4). (c) lim_{h→0} [sin(h)]/h.',
      expectedAnswer:
        '(a) h-form. f(2 + h) = (2+h)³ and f(2) = 8 = 2³. So f(x) = x³ at a = 2. f\'(2) = 12 (using power rule: 3x² at x=2). (b) x-form. f(x) = √x; f(4) = 2; (x − 4) in denominator → a = 4. f\'(4) = 1/(2√4) = 1/4 (using power rule). (c) Special trig limit. Recognize as f\'(0) where f(x) = sin(x): lim_{h→0} [sin(0+h) − sin(0)]/h = lim sin(h)/h. f(x) = sin(x) at a = 0. Equals 1 (which is cos(0) = the derivative of sin at 0).',
      responseFormat: 'free',
      hints: [
        'h-form: identify f(a) by setting h = 0; then f(a + h) tells you f.',
        'x-form: identify a from where the denominator vanishes.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-secant-tangent',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Geometrically, the derivative f\'(a) is the slope of the TANGENT LINE at x = a. The difference quotient [f(a+h) − f(a)]/h is the slope of the SECANT LINE. Why is the limit-of-secants the tangent? Use the geometric picture.',
      expectedAnswer:
        'A SECANT LINE through points (a, f(a)) and (a+h, f(a+h)) has slope = [f(a+h) − f(a)]/h. As h shrinks toward 0, the second point (a+h, f(a+h)) slides ALONG the curve toward (a, f(a)). The secant line therefore PIVOTS around the fixed point (a, f(a)), and its slope changes continuously. In the LIMIT (h → 0), the secant has rotated to become the LINE THAT TOUCHES the curve at (a, f(a)) — the TANGENT LINE. The limit IS the tangent slope. The slope-of-secants converges to the slope-of-tangent because the secant\'s rotation has a definite limiting direction. Strong answers: (i) describe the secant pivoting, (ii) note that the second point approaches the first, (iii) connect to the tangent\'s definition.',
      responseFormat: 'frq',
      hints: ['Two points become one. The secant rotates. Where does it land?'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'f\'(a) = lim_{h→0} [f(a+h) − f(a)]/h (h-form) = lim_{x→a} [f(x) − f(a)]/(x−a) (x-form). Equivalent.',
        'Geometric: slope of tangent. Physical: instantaneous rate of change.',
        'Notation: Lagrange f\'(x); Leibniz dy/dx; Newton ẏ — all the same thing.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.1-2.2',
    cedTitle: 'The Derivative — Definition and Notation',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Standard derivative-by-definition.' }],
  },
};
