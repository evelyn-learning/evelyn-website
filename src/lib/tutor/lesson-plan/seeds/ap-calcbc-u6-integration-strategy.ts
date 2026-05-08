/**
 * AP Calculus BC — CED Unit 6.14: Selecting Techniques for
 * Antidifferentiation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_INTEGRATION_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.calcbc.integration-strategy.v1',
  title: 'U6.14 Selecting Techniques for Antidifferentiation',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.integration-strategy', description: 'Given an integral, select the most efficient technique: direct antiderivative, u-substitution, integration by parts, partial fractions, long division, or trig identities.', standard: 'AP-CALCBC-6.14' }],
  prerequisites: ['apcalcbc.improper-integrals'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame technique selection as the speed-determining skill.',
      script: "Knowing techniques isn't enough. KNOWING WHICH ONE TO USE separates fast students from slow ones. Today: a decision tree for integration.",
      estimatedMinutes: 2 },
    { id: 'concept-strategy', kind: 'concept', goal: 'Decision tree for integration techniques.',
      keyIdeas: [
        'STEP 1 — TRY DIRECT ANTIDERIVATIVE. Recognize basic forms (power, trig, exp, log, arctan/arcsin). If direct match: done.',
        'STEP 2 — IF YOU SEE AN INNER FUNCTION WITH ITS DERIVATIVE PRESENT: U-SUBSTITUTION.',
        'STEP 3 — IF YOU SEE A PRODUCT OF DIFFERENT FUNCTION TYPES (e.g., x · e^x, x · sin x, ln x): INTEGRATION BY PARTS. Use LIATE for choosing u.',
        'STEP 4 — IF YOU SEE A RATIONAL FUNCTION (proper, distinct linear factors): PARTIAL FRACTIONS.',
        'STEP 5 — IF NUMERATOR DEGREE ≥ DENOMINATOR DEGREE: POLYNOMIAL LONG DIVISION first, then integrate the quotient + remainder.',
        'STEP 6 — IF QUADRATIC IN DENOMINATOR (irreducible): COMPLETE THE SQUARE then use arctan or another inverse trig form.',
        'STEP 7 — IF TRIG POWERS / PRODUCTS: USE TRIG IDENTITIES to simplify (e.g., sin²x = (1−cos 2x)/2).',
        'STEP 8 — IF INFINITE LIMITS OR DISCONTINUOUS INTEGRAND: HANDLE AS IMPROPER (replace with limit).',
        'STEP 9 — COMBINE TECHNIQUES — many problems require u-sub THEN parts, or parts TWICE, or parts THEN u-sub. Recognize the COMPOSITION OF MOVES needed.',
      ],
      estimatedMinutes: 4 },
    { id: 'try-classify', kind: 'try_yourself',
      problem: 'For each integral, identify the BEST technique. Then compute. (a) ∫ x³ √(x⁴ + 1) dx. (b) ∫ x e^(-x) dx. (c) ∫ 1/(x² + 4x + 3) dx.',
      expectedAnswer: '(a) U-SUB. u = x⁴ + 1, du = 4x³ dx. ∫ √u (1/4) du = (1/4)·(2/3)u^(3/2) = (1/6)(x⁴+1)^(3/2) + C. \n(b) BY PARTS. u = x, dv = e^(-x) dx. du = dx, v = -e^(-x). I = -x e^(-x) − ∫ -e^(-x) dx = -x e^(-x) − e^(-x) + C = -e^(-x)(x+1) + C. \n(c) PARTIAL FRACTIONS. x² + 4x + 3 = (x+1)(x+3). 1/[(x+1)(x+3)] = A/(x+1) + B/(x+3). Multiply: 1 = A(x+3) + B(x+1). x = -1: 1 = 2A → A = 1/2. x = -3: 1 = -2B → B = -1/2. Integral = (1/2) ln|x+1| − (1/2) ln|x+3| + C.',
      responseFormat: 'numeric', hints: ['Identify the structure first; pick the matching technique.'], estimatedMinutes: 5 },
    { id: 'try-mix', kind: 'try_yourself',
      problem: 'Compute ∫ x² · cos(x³) dx.',
      expectedAnswer: 'U-SUB: u = x³, du = 3x² dx. ∫ cos(u) (1/3) du = (1/3) sin(u) + C = (1/3) sin(x³) + C.',
      responseFormat: 'numeric', hints: ['Inner function x³ with derivative 3x² present.'], estimatedMinutes: 3 },
    { id: 'try-strategy-discuss', kind: 'try_yourself',
      problem: 'AP-style synthesis. State the SIGNATURE features of an integrand that suggest each technique: (a) u-substitution, (b) integration by parts, (c) partial fractions.',
      expectedAnswer: '(a) U-SUBSTITUTION: presence of an INNER COMPOSITE FUNCTION combined with (a multiple of) its DERIVATIVE. E.g., x²·sin(x³) signals u = x³ since 3x² appears. Look for "f(g(x))·g\'(x)" pattern. (b) INTEGRATION BY PARTS: PRODUCT of TWO DIFFERENT FUNCTION TYPES — typically polynomial × (trig, exp, log, inverse trig). E.g., x·sin x or x·ln x. The product won\'t simplify, but parts can. Use LIATE to pick u. (c) PARTIAL FRACTIONS: PROPER RATIONAL FUNCTION (deg num < deg denom) with denominator factoring into distinct LINEAR (or simple quadratic) factors. The integrand is unintegrable as-is, but each partial-fraction piece is a logarithm.',
      responseFormat: 'frq', hints: ['Each technique has a SIGNATURE shape. Pattern recognition is the skill.'], estimatedMinutes: 4 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Pattern-match BEFORE computing. Inner function + derivative → u-sub. Different-type product → parts. Rational w/ linear factors → partial fractions.',
      'For improper rationals: divide first.',
      'Combine techniques freely (u-sub then parts, parts twice, etc.).',
      'Always try direct substitution / direct antiderivative first.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.14', cedTitle: 'Selecting Techniques for Antidifferentiation',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '7', note: 'Strategy synthesis.' }] },
};
