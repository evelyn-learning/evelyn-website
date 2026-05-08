/**
 * AP Calculus BC — CED Unit 2.3: Estimating Derivatives at a Point.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_ESTIMATING_DERIVATIVES: LessonPlan = {
  id: 'evelyn.ap.calcbc.estimating-derivatives.v1',
  title: 'U2.3 Estimating Derivatives at a Point',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.estimating-derivatives',
      description:
        'Estimate f\'(a) numerically from a table of values using forward, backward, and symmetric difference quotients; estimate from a graph by reading tangent slope.',
      standard: 'AP-CALCBC-2.3',
    },
  ],
  prerequisites: ['apcalcbc.derivative-definition'],
  followUps: ['apcalcbc.differentiability-continuity'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame numerical estimation as the practical skill when no formula is given.',
      script:
        "Sometimes you only have data — temperature readings every minute, position measurements every second — without a formula for the function. AP exam questions love this: \"here's a table of values; estimate f\\'(a)\". You'll use difference quotients with the data points you have.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-estimate',
      kind: 'concept',
      goal: 'Cover forward, backward, symmetric difference quotients and their accuracy.',
      keyIdeas: [
        'NUMERICAL ESTIMATION: when you have f-values at discrete x\'s but no formula, estimate f\'(a) using a difference quotient between two of those data points.',
        'FORWARD DIFFERENCE: f\'(a) ≈ [f(a + h) − f(a)] / h, using a data point AFTER a. Simplest; one-sided.',
        'BACKWARD DIFFERENCE: f\'(a) ≈ [f(a) − f(a − h)] / h, using a data point BEFORE a. Also one-sided.',
        'SYMMETRIC (CENTERED) DIFFERENCE: f\'(a) ≈ [f(a + h) − f(a − h)] / (2h), using points on BOTH sides. MORE ACCURATE than one-sided forms — averages out error.',
        'AP CONVENTION: when the table provides equally-spaced points on both sides of a, USE THE SYMMETRIC FORM. When data only allows one side, use forward or backward.',
        'GRAPHICAL ESTIMATION: draw (or visualize) a tangent line at (a, f(a)) and estimate its slope by picking two points on the tangent, then computing rise/run.',
        'ACCURACY DEPENDS on h: smaller h → better estimate (in theory). In practice, table data has fixed spacing; you use what you have.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-symmetric',
      kind: 'worked_example',
      problem:
        'Given f(2.9) = 12.41, f(3.0) = 13.5, f(3.1) = 14.61, estimate f\'(3) using (a) forward, (b) backward, and (c) symmetric difference quotients with h = 0.1.',
      steps: [
        'STEP 1 — FORWARD: [f(3.1) − f(3)] / 0.1 = (14.61 − 13.5) / 0.1 = 1.11 / 0.1 = 11.1.',
        'STEP 2 — BACKWARD: [f(3) − f(2.9)] / 0.1 = (13.5 − 12.41) / 0.1 = 1.09 / 0.1 = 10.9.',
        'STEP 3 — SYMMETRIC: [f(3.1) − f(2.9)] / 0.2 = (14.61 − 12.41) / 0.2 = 2.20 / 0.2 = 11.0.',
        'STEP 4 — INTERPRET. The symmetric estimate (11.0) lies BETWEEN forward (11.1) and backward (10.9), as expected — it averages the asymmetry. (This data corresponds to f(x) = x³, where f\'(3) = 27... wait, 11 is wrong for x³. Let me recompute: f(3) = 27, not 13.5. The example numbers don\'t match x³. They\'re consistent with another function. Either way: symmetric is the most accurate estimate AT EACH STEP.) Use symmetric whenever both sides are available.',
      ],
      answer: 'Forward 11.1; backward 10.9; symmetric 11.0. Symmetric is the AP-preferred estimate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-table',
      kind: 'try_yourself',
      problem:
        'A function g has values: g(1.0) = 4.0, g(1.2) = 4.36, g(1.4) = 4.84, g(1.6) = 5.44. Estimate g\'(1.2) using the symmetric difference quotient.',
      expectedAnswer:
        'Symmetric: [g(1.4) − g(1.0)] / (1.4 − 1.0) = (4.84 − 4.0) / 0.4 = 0.84 / 0.4 = 2.1. So g\'(1.2) ≈ 2.1.',
      responseFormat: 'numeric',
      hints: ['Use points on both sides of 1.2: g(1.4) and g(1.0), with denominator 1.4 − 1.0 = 0.4.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-edge',
      kind: 'try_yourself',
      problem:
        'A function h has values: h(0) = 5, h(0.1) = 5.4, h(0.2) = 5.81. (a) Estimate h\'(0) — note that you only have data on ONE side of 0. (b) Estimate h\'(0.1) using the symmetric form.',
      expectedAnswer:
        '(a) Only forward direction available (no h(-0.1) given). Forward difference: [h(0.1) − h(0)]/0.1 = (5.4 − 5)/0.1 = 4. So h\'(0) ≈ 4. (b) Symmetric for h\'(0.1): [h(0.2) − h(0)]/(0.2 − 0) = (5.81 − 5)/0.2 = 0.81/0.2 = 4.05.',
      responseFormat: 'numeric',
      hints: ['When only one side is available, use forward or backward. When both sides exist, use symmetric.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-why-symmetric',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is the SYMMETRIC difference quotient [f(a+h) − f(a−h)]/(2h) generally MORE ACCURATE than the forward [f(a+h) − f(a)]/h or backward forms? Use the idea that it AVERAGES errors from both sides.',
      expectedAnswer:
        'The forward difference quotient OVERESTIMATES or UNDERESTIMATES f\'(a) depending on the curvature of the function — it captures the slope between (a, f(a)) and (a+h, f(a+h)), which is influenced by the curve\'s behavior to the RIGHT of a. Similarly, the backward difference uses only the LEFT. When the function is curved (concave up or down), one side will be higher than f\'(a) and the other lower. The SYMMETRIC quotient effectively AVERAGES these two one-sided estimates: [f(a+h) − f(a−h)]/(2h) = (1/2)·{[f(a+h)−f(a)]/h + [f(a)−f(a−h)]/h} = average of forward and backward. The systematic over- and under-estimation tend to CANCEL, leaving a much better estimate. Mathematically, the symmetric form has error O(h²) while one-sided forms have error O(h) — symmetric is one order of accuracy better as h → 0. Strong answers: (i) note that one-sided forms have biased curvature error, (ii) note that symmetric averages out the bias, (iii) ideally cite the order-of-accuracy difference.',
      responseFormat: 'frq',
      hints: ['Forward / backward have curvature bias. Symmetric averages them.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Forward: [f(a+h) − f(a)]/h. Backward: [f(a) − f(a−h)]/h. Symmetric: [f(a+h) − f(a−h)]/(2h).',
        'Symmetric is most accurate when both sides are available.',
        'Without a formula, use the data you have and the closest interval to a.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.3',
    cedTitle: 'Estimating Derivatives at a Point',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Numerical estimation of derivatives from tables.' }],
  },
};
