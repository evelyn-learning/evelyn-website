/**
 * AP Pre-Calculus — Unit 1: Polynomial and Rational Functions.
 *
 * Aligned with the 2025-26 College Board CED. Unit 1 weight on the exam:
 * 30-40% of the multiple-choice section (the heaviest unit).
 *
 * Cross-referenced with Khan Academy AP Pre-Calculus + Fiveable Unit 1
 * for topic structure, common misconceptions, and worked-example types.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PRECALC_POLYNOMIAL_RATIONAL: LessonPlan = {
  id: 'evelyn.ap.precalc.polynomial-rational.v1',
  title: 'Polynomial and Rational Functions',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'math',
  topic: 'ap-precalculus',
  locale: 'en',
  los: [
    {
      id: 'apprecalc.polynomial-rational',
      description: 'Analyze polynomial and rational functions: end behavior, zeros, multiplicity, asymptotes (vertical, horizontal, slant), holes, and transformations.',
      standard: 'AP-PRECALC-1',
    },
  ],
  prerequisites: ['math.algebra-2'],
  followUps: ['apprecalc.exponential-logarithmic'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Unit 1 as the heaviest exam topic and the foundation for everything else.',
      script: 'Unit 1 is roughly a third of the AP exam — more than any other unit. Polynomials and rational functions show up everywhere: modeling rocket trajectories, analyzing supply curves, predicting drug-decay rates. The skills here are GRAPH READING and STRUCTURE RECOGNITION. Once you can look at a polynomial and immediately see its end behavior, zeros, and multiplicities — and look at a rational function and spot its asymptotes and holes — you\'ve unlocked half the exam.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-toolkit',
      kind: 'concept',
      goal: 'Polynomial features, rational features, transformations.',
      keyIdeas: [
        'POLYNOMIAL: P(x) = aₙxⁿ + ... + a₁x + a₀. Degree n, leading coefficient aₙ.',
        'END BEHAVIOR depends on degree + leading coefficient: even degree → both ends same direction (both up if aₙ>0, both down if aₙ<0); odd degree → opposite ends.',
        'ZEROS / ROOTS: where P(x) = 0. Multiplicity matters: ODD multiplicity → graph CROSSES the x-axis; EVEN multiplicity → graph TOUCHES and bounces off. A factor (x − r)² gives a zero at r with multiplicity 2.',
        'POLYNOMIAL DIVISION (synthetic or long): factor a polynomial when you know one root. (x − r) is a factor iff P(r) = 0 (Factor Theorem).',
        'AVERAGE RATE OF CHANGE on [a, b]: (P(b) − P(a)) / (b − a). For nonlinear functions, this DEPENDS on the interval. For linear, it\'s constant (the slope).',
        'RATIONAL FUNCTION: R(x) = P(x)/Q(x) where P, Q are polynomials.',
        'VERTICAL ASYMPTOTES: at zeros of Q(x) that are NOT also zeros of P(x). If both P and Q vanish at the same x = a (and (x-a) cancels), it\'s a HOLE, not an asymptote.',
        'HORIZONTAL ASYMPTOTES depend on degrees: deg P < deg Q → y = 0. deg P = deg Q → y = ratio of leading coefficients. deg P > deg Q → no horizontal asymptote (look for slant if deg P = deg Q + 1).',
        'TRANSFORMATIONS: f(x − h) shifts right h. f(x) + k shifts up k. a·f(x) stretches vertically. f(b·x) compresses horizontally by factor b. Practice composing them.',
        'AP TIP: most exam questions on this unit are GRAPH-feature identification or end-behavior comparison. Memorize the end-behavior table cold.',
      ],
      vocabulary: [
        { term: 'multiplicity', definition: 'the power of a factor (x − r) in a polynomial; controls whether the graph crosses or bounces at r.' },
        { term: 'asymptote', definition: 'a line a graph approaches without ever touching (or sometimes crosses for horizontal/slant).' },
        { term: 'hole (removable discontinuity)', definition: 'a single missing point in a rational function where a factor cancels in numerator and denominator.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-zeros',
      kind: 'worked_example',
      problem: 'For P(x) = (x − 2)(x + 1)²(x − 4)³, identify all zeros, their multiplicities, and the end behavior. Sketch the general shape.',
      steps: [
        'Zeros: x = 2 (multiplicity 1, CROSSES), x = −1 (multiplicity 2, TOUCHES), x = 4 (multiplicity 3, CROSSES with inflection-like flattening).',
        'Degree = 1 + 2 + 3 = 6 (even). Leading coefficient = +1 (product of all leading 1\'s is positive).',
        'End behavior: even degree + positive leading → BOTH ends go to +∞.',
        'Sketch: comes down from +∞ on the far left, crosses at x = −1 (no, wait — x = −1 has multiplicity 2 so TOUCHES), bounces back up. Then crosses x-axis at x = 2 (multiplicity 1). Continues, then has flat-crossing at x = 4 (multiplicity 3). Goes to +∞ on the right.',
        'CHECK: 6th degree polynomial, both ends up. Zeros at −1 (touch), 2 (cross), 4 (flat-cross). ✓',
      ],
      answer: 'Zeros: x = −1 (mult 2, touch), x = 2 (mult 1, cross), x = 4 (mult 3, flat-cross). Both ends go to +∞.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For R(x) = (x² − 4) / (x² − x − 6), find all vertical asymptotes and holes.',
      expectedAnswer: 'Vertical asymptote at x = 3. Hole at x = −2.',
      responseFormat: 'free',
      hints: [
        'Factor numerator: x² − 4 = (x − 2)(x + 2).',
        'Factor denominator: x² − x − 6 = (x − 3)(x + 2).',
        '(x + 2) cancels → hole at x = −2. (x − 3) doesn\'t cancel → vertical asymptote at x = 3.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-end-behavior-leading',
      kind: 'misconception_check',
      question: 'For P(x) = −2x⁴ + 5x³ − x + 7, the leading term −2x⁴ has a negative coefficient. So the graph goes to negative infinity on the right, but to positive infinity on the left. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating odd-degree end behavior rules as if they applied to all polynomials.',
          correctsTo: 'False. Even degree + negative leading coefficient → BOTH ends go to NEGATIVE infinity (mirror image of the standard upward-opening even polynomial). Odd degree gives opposite ends. Memorize: even-positive both up, even-negative both down, odd-positive down-left up-right, odd-negative up-left down-right. Mixing these is the most common Unit 1 error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'End behavior depends on DEGREE (even/odd) and LEADING COEFFICIENT (sign).',
        'Multiplicity: odd → cross, even → touch.',
        'Vertical asymptote: zero of denom that doesn\'t cancel. Hole: zero that cancels.',
        'Horizontal asymptote: compare degrees of numerator and denominator.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the graph of f(x) = x³ "flatten" near x = 0 even though it crosses through the origin?',
      hint: 'x = 0 is a zero of multiplicity 3 — odd, so it crosses, but the higher multiplicity means the function flattens against the x-axis on both sides before crossing. Higher-order zeros look "flatter" near the root. Multiplicity 1 zeros look like clean diagonal crossings.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
