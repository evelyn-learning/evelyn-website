/**
 * AP Calculus BC — CED Unit 6.1+6.2+6.3: Riemann Sums (intro,
 * approximation, summation + integral notation).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_RIEMANN_SUMS: LessonPlan = {
  id: 'evelyn.ap.calcbc.riemann-sums.v1',
  title: 'U6.1 Riemann Sums and Definite Integral Notation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.riemann-sums', description: 'Approximate area under a curve using LRAM, RRAM, MRAM, and trapezoidal Riemann sums. Recognize the definite integral as a limit of Riemann sums.', standard: 'AP-CALCBC-6.1-6.3' }],
  prerequisites: ['apcalcbc.optimization'],
  followUps: ['apcalcbc.ftc-accumulation'],
  estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame integration as accumulation/area.',
      script: "Differentiation tackled rates. Integration tackles ACCUMULATED TOTALS — total distance from velocity, total revenue from marginal revenue, total area under a curve. The Riemann sum approximates the area; the definite integral is the LIMIT as the approximation gets perfect.",
      estimatedMinutes: 2 },
    { id: 'concept-riemann', kind: 'concept', goal: 'Cover Riemann sum types + summation notation + definite integral.',
      keyIdeas: [
        'AREA UNDER f(x) on [a, b]: divide into n equal sub-intervals of width Δx = (b−a)/n. Sum up rectangle areas.',
        'LRAM (Left): use LEFT endpoint of each sub-interval as height. f(x_0)·Δx + f(x_1)·Δx + ... + f(x_(n-1))·Δx.',
        'RRAM (Right): use RIGHT endpoint. f(x_1)·Δx + ... + f(x_n)·Δx.',
        'MRAM (Middle): use MIDPOINT. Often more accurate.',
        'TRAPEZOIDAL: average of LRAM and RRAM. Trapezoid area: (Δx/2)·[f(x_(i-1)) + f(x_i)] for each sub-interval. Total: (Δx/2)·[f(x_0) + 2·f(x_1) + 2·f(x_2) + ... + 2·f(x_(n-1)) + f(x_n)].',
        'SUMMATION NOTATION: Σ_{i=1}^n f(x_i*)·Δx where x_i* is left/right/midpoint depending on type.',
        'DEFINITE INTEGRAL DEFINITION: ∫_a^b f(x) dx = lim_{n→∞} Σ_{i=1}^n f(x_i*)·Δx. The Riemann sum LIMIT as the partitions get arbitrarily fine.',
        'NOTATION: ∫ = integral sign; a, b = bounds of integration; f(x) = integrand; dx = differential, indicates variable of integration.',
        'GEOMETRIC MEANING: ∫_a^b f(x) dx = SIGNED area between f and the x-axis on [a, b]. Areas above x-axis count positive; below count negative.',
        'OVER- VS UNDER-ESTIMATION: For INCREASING f: LRAM underestimates, RRAM overestimates. For DECREASING f: LRAM overestimates, RRAM underestimates. For CONCAVE UP: trapezoidal overestimates (chords above curve); MRAM underestimates. For CONCAVE DOWN: opposite.',
      ],
      vocabulary: [
        { term: 'definite integral', definition: '∫_a^b f(x) dx; the limit of Riemann sums; signed area under the curve.' },
        { term: 'Riemann sum', definition: 'an approximation of the integral using rectangles or trapezoids.' },
      ],
      suggestedTools: ['show_function_graph'], estimatedMinutes: 6 },
    { id: 'worked-lram-rram', kind: 'worked_example',
      problem: 'Approximate ∫_0^4 x² dx using LRAM, RRAM, and MRAM with n = 4 subintervals.',
      steps: [
        'STEP 1 — Δx = (4-0)/4 = 1. x_0 = 0, x_1 = 1, x_2 = 2, x_3 = 3, x_4 = 4.',
        'STEP 2 — LRAM: f(x_0)·1 + f(x_1)·1 + f(x_2)·1 + f(x_3)·1 = 0 + 1 + 4 + 9 = 14.',
        'STEP 3 — RRAM: f(x_1)·1 + f(x_2)·1 + f(x_3)·1 + f(x_4)·1 = 1 + 4 + 9 + 16 = 30.',
        'STEP 4 — MRAM: midpoints x = 0.5, 1.5, 2.5, 3.5. f-values: 0.25, 2.25, 6.25, 12.25. Sum × Δx = 21·1 = 21.',
        'STEP 5 — Compare. Actual integral = ∫x² dx = x³/3 from 0 to 4 = 64/3 ≈ 21.33. LRAM (14) underestimates (f increasing); RRAM (30) overestimates; MRAM (21) closest. Trapezoidal would be (LRAM+RRAM)/2 = 22.',
      ],
      answer: 'LRAM=14, RRAM=30, MRAM=21. Actual=64/3≈21.33.', estimatedMinutes: 5 },
    { id: 'try-trapezoidal', kind: 'try_yourself',
      problem: 'Use the trapezoidal rule with n = 4 to approximate ∫_1^9 √x dx.',
      expectedAnswer: 'Δx = (9-1)/4 = 2. x = 1, 3, 5, 7, 9. f-values: 1, √3≈1.732, √5≈2.236, √7≈2.646, 3. Trap = (Δx/2)·[f(1) + 2f(3) + 2f(5) + 2f(7) + f(9)] = 1·[1 + 3.464 + 4.472 + 5.292 + 3] = 17.228. (Actual: ∫√x dx = (2/3)x^(3/2) from 1 to 9 = (2/3)(27 - 1) = 52/3 ≈ 17.333. Very close.)',
      responseFormat: 'numeric', hints: ['Trapezoidal: (Δx/2)·[f(a) + 2·sum-of-interior + f(b)].'], estimatedMinutes: 4 },
    { id: 'try-classify', kind: 'try_yourself',
      problem: 'AP-style synthesis. For f(x) = x² on [0, 4]: f is INCREASING and CONCAVE UP. (a) Order LRAM, RRAM, MRAM, Trapezoidal, and the actual integral by VALUE (smallest to largest). (b) Justify each ordering using the increasing/concavity properties.',
      expectedAnswer: 'For INCREASING f: LRAM underestimates (uses smaller values), RRAM overestimates. For CONCAVE UP: TRAPEZOIDAL overestimates (chord lies above curve); MRAM underestimates (tangent at midpoint approximation lies below curve). \nORDERING (smallest to largest): LRAM (14) < MRAM (21) < ACTUAL (21.33) < TRAPEZOIDAL (22) < RRAM (30). \nJustification: LRAM smallest because it doubly underestimates (left endpoint AND under the curve); MRAM next because midpoint is below concave-up curve; actual is the truth; trapezoidal slightly overestimates (chord above curve); RRAM grossly overestimates (right endpoint of increasing function is the highest).',
      responseFormat: 'frq', hints: ['Inc/dec affects LRAM vs RRAM; concavity affects MRAM vs Trapezoidal.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Δx = (b-a)/n. Sum f at sample points × Δx.',
      'LRAM/RRAM: left/right endpoints. MRAM: midpoints. TRAP: avg of LRAM+RRAM.',
      'Inc f: LRAM under, RRAM over. Concave up: trap over, MRAM under (and vice versa).',
      'Definite integral = limit of Riemann sums = signed area.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.1-6.3', cedTitle: 'Riemann Sums and Definite Integral Notation',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard Riemann sums.' }] },
};
