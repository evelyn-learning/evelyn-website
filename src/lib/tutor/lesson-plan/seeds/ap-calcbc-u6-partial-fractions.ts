/**
 * AP Calculus BC — CED Unit 6.12: Partial Fractions (BC only).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_PARTIAL_FRACTIONS: LessonPlan = {
  id: 'evelyn.ap.calcbc.partial-fractions.v1',
  title: 'U6.12 Integration Using Partial Fractions',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.partial-fractions', description: 'Decompose proper rational functions into partial fractions (linear factors only on AP) and integrate each piece. Recognize when the technique applies.', standard: 'AP-CALCBC-6.12' }],
  prerequisites: ['apcalcbc.integration-by-parts'],
  followUps: ['apcalcbc.improper-integrals'],
  estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame partial fractions as the algebraic prep for integrating rational functions.',
      script: "Some rational functions can't be integrated directly. But if you DECOMPOSE them into a sum of simpler fractions — each with a linear denominator — then each piece is just a logarithm. AP Calc BC tests this technique on PROPER rational functions with distinct LINEAR factors.",
      estimatedMinutes: 2 },
    { id: 'concept-partial-fractions', kind: 'concept', goal: 'Cover decomposition and integration of partial fractions.',
      keyIdeas: [
        'WHEN TO USE: integrand is a PROPER rational function (degree of numerator < degree of denominator) with denominator factoring into DISTINCT LINEAR FACTORS.',
        'PROCEDURE: write f(x)/[(x-a)(x-b)] = A/(x-a) + B/(x-b). Solve for constants A, B. Integrate each piece: ∫ A/(x-a) dx = A ln|x-a|.',
        'FINDING THE CONSTANTS: clear denominators by multiplying both sides. Substitute strategic x-values (often the roots of the denominator) to isolate one constant at a time.',
        'EXAMPLE. ∫ 1/[(x−1)(x+2)] dx. Decompose: 1/[(x-1)(x+2)] = A/(x−1) + B/(x+2). Multiply: 1 = A(x+2) + B(x−1). Plug x = 1: 1 = 3A → A = 1/3. Plug x = -2: 1 = -3B → B = -1/3. Integral = (1/3) ln|x−1| − (1/3) ln|x+2| + C.',
        'IF DEGREE OF NUMERATOR ≥ DENOMINATOR: do polynomial long division FIRST to get a polynomial + a proper fraction. Integrate each.',
        'REPEATED LINEAR FACTORS (just for completeness; rarely on AP): for (x-a)², decomposition needs A/(x-a) + B/(x-a)². AP usually keeps factors distinct.',
        'IRREDUCIBLE QUADRATIC FACTORS: BC may include this in advanced problems; typical AP keeps to linear-factor cases.',
      ],
      vocabulary: [
        { term: 'partial fraction decomposition', definition: 'rewriting a rational function as a sum of simpler rational pieces with linear (or quadratic) denominators.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-decompose', kind: 'worked_example',
      problem: 'Compute ∫ (x + 4)/[(x−1)(x+2)] dx.',
      steps: [
        'STEP 1 — Decompose. (x + 4)/[(x−1)(x+2)] = A/(x−1) + B/(x+2). Multiply: x + 4 = A(x+2) + B(x−1).',
        'STEP 2 — Plug x = 1: 5 = 3A → A = 5/3. Plug x = -2: 2 = -3B → B = -2/3.',
        'STEP 3 — Substitute back. (x + 4)/[(x−1)(x+2)] = (5/3)/(x−1) + (-2/3)/(x+2).',
        'STEP 4 — Integrate each. ∫ (5/3)/(x−1) dx = (5/3) ln|x−1|. ∫ (-2/3)/(x+2) dx = -(2/3) ln|x+2|.',
        'STEP 5 — Combine: (5/3) ln|x−1| − (2/3) ln|x+2| + C.',
      ],
      answer: '(5/3) ln|x−1| − (2/3) ln|x+2| + C', estimatedMinutes: 5 },
    { id: 'try-decompose', kind: 'try_yourself',
      problem: 'Compute ∫ 1/(x² − 4) dx.',
      expectedAnswer: 'x² − 4 = (x − 2)(x + 2). Decompose: 1/[(x−2)(x+2)] = A/(x−2) + B/(x+2). Multiply: 1 = A(x+2) + B(x−2). Plug x = 2: 1 = 4A → A = 1/4. Plug x = -2: 1 = -4B → B = -1/4. Integral = (1/4) ln|x−2| − (1/4) ln|x+2| + C = (1/4) ln|(x−2)/(x+2)| + C.',
      responseFormat: 'numeric', hints: ['Factor denominator; decompose; solve for constants; integrate each.'], estimatedMinutes: 5 },
    { id: 'try-three-factors', kind: 'try_yourself',
      problem: 'Compute ∫ (3x − 1)/[(x)(x−1)(x+1)] dx.',
      expectedAnswer: 'Decompose: (3x−1)/[x(x−1)(x+1)] = A/x + B/(x−1) + C/(x+1). Multiply: 3x − 1 = A(x−1)(x+1) + B(x)(x+1) + C(x)(x−1). \nPlug x = 0: -1 = A(-1)(1) → -1 = -A → A = 1. Plug x = 1: 2 = B(1)(2) → B = 1. Plug x = -1: -4 = C(-1)(-2) = 2C → C = -2. \nIntegrate: ∫ 1/x + 1/(x−1) + (-2)/(x+1) dx = ln|x| + ln|x−1| − 2 ln|x+1| + C.',
      responseFormat: 'numeric', hints: ['Decompose with three terms; plug roots to find A, B, C.'], estimatedMinutes: 5 },
    { id: 'try-improper-rational', kind: 'try_yourself',
      problem: 'AP-style synthesis. Compute ∫ (x² + 3x + 2)/(x − 1) dx.',
      expectedAnswer: 'Numerator degree (2) ≥ denominator degree (1) → do POLYNOMIAL LONG DIVISION first. Divide x² + 3x + 2 by (x−1): x² ÷ x = x; x(x−1) = x²−x; subtract: (3x+2) − (-x) = 4x + 2. 4x ÷ x = 4; 4(x−1) = 4x − 4; subtract: 2 − (-4) = 6. So (x² + 3x + 2)/(x − 1) = x + 4 + 6/(x−1). Integrate: ∫ (x + 4 + 6/(x−1)) dx = x²/2 + 4x + 6 ln|x−1| + C.',
      responseFormat: 'frq', hints: ['Divide first because deg(N) ≥ deg(D). Then integrate the quotient + remainder over divisor.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'When: PROPER rational function with distinct linear factors.',
      'Decompose: f/[(x-a)(x-b)] = A/(x-a) + B/(x-b). Solve for A, B by plugging roots.',
      'Each piece integrates as ln of linear factor.',
      'For improper rationals: long-divide first.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.12', cedTitle: 'Partial Fractions (BC)',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '7', note: 'Standard partial fractions.' }] },
};
