/**
 * AP Calculus BC — CED Unit 1.6: Determining Limits Using Algebraic
 * Manipulation.
 *
 * The workhorse plan for indeterminate forms. Higher density (4+
 * worked examples) per Q1 follow-up: limits has many distinct
 * question-types AP could test (factor, conjugate, common-denominator,
 * special trig limits) and we need full coverage.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_MANIPULATION: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-algebraic-manipulation.v1',
  title: 'U1.6 Determining Limits Using Algebraic Manipulation',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-algebraic-manipulation',
      description:
        'Apply algebraic techniques (factoring, multiplying by a conjugate, combining fractions, simplifying complex fractions) to resolve 0/0 indeterminate forms; apply the standard trig-limit identities lim sin(x)/x = 1 and lim (1−cos(x))/x = 0.',
      standard: 'AP-CALCBC-1.6',
    },
  ],
  prerequisites: ['apcalcbc.limits-algebraic-properties'],
  followUps: ['apcalcbc.limits-strategy'],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame manipulation as resolving 0/0 by canceling the offending common factor.',
      script:
        "When direct substitution gives 0/0, the function isn't really undefined — it just doesn't simplify obviously. Algebraic manipulation reveals what's hidden: a common factor in numerator and denominator. Cancel it, then substitute. Today's toolkit covers the four standard moves: factor, conjugate, common denominator, and the special trig limits.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-techniques',
      kind: 'concept',
      goal: 'Cover the four major algebraic-manipulation techniques + special trig limits.',
      keyIdeas: [
        'GENERAL STRATEGY for 0/0: simplify the function by an algebraic move that CANCELS THE OFFENDING FACTOR (the one making both numerator and denominator zero at x = a). After cancellation, direct substitution.',
        'TECHNIQUE 1 — FACTORING. When numerator and denominator share a polynomial common factor (often (x − a) for limits at x = a), factor and cancel. Example: (x² − 4)/(x − 2) = (x−2)(x+2)/(x−2) = x+2 (for x ≠ 2). lim_{x→2} = 2 + 2 = 4.',
        'TECHNIQUE 2 — CONJUGATE. When numerator or denominator contains a difference of square roots (like √x − 2), multiply by the CONJUGATE (√x + 2) over itself. The product becomes a difference of squares (x − 4), which often factors. Example: lim_{x→4} (√x − 2)/(x − 4). Multiply by (√x+2)/(√x+2): (x − 4)/[(x − 4)(√x + 2)] = 1/(√x + 2). lim → 1/4.',
        'TECHNIQUE 3 — COMMON DENOMINATOR (combining fractions). When the function is (1/x − 1/2)/(x − 2)-type with a small fraction in the numerator, combine over a common denominator first. Example: lim_{x→2} (1/x − 1/2)/(x − 2). Numerator: 1/x − 1/2 = (2 − x)/(2x). Whole expression: (2 − x)/(2x · (x − 2)) = −(x − 2)/(2x · (x − 2)) = −1/(2x). lim → −1/4.',
        'TECHNIQUE 4 — SPECIAL TRIG LIMITS. Two identities you must memorize: (a) lim_{x→0} sin(x)/x = 1. (b) lim_{x→0} (1 − cos(x))/x = 0. (Equivalently, lim_{x→0} (cos(x) − 1)/x = 0.) These are NOT direct-substitution results (both yield 0/0); they\'re proved geometrically (squeeze theorem) — covered in Unit 1.8.',
        'COMBINING TRIG LIMITS WITH ALGEBRA. Many AP problems involve sin or cos in a 0/0 limit, requiring you to manipulate to expose sin(x)/x or (1−cos(x))/x. Example: lim_{x→0} sin(3x)/x. Write as 3 · sin(3x)/(3x). As x → 0, 3x → 0, so sin(3x)/(3x) → 1. Limit = 3 · 1 = 3.',
        'SELECTING TECHNIQUE: spot the OFFENDING FACTOR. Polynomial 0/0 → factor. Square-root 0/0 → conjugate. Fraction-in-fraction 0/0 → common denominator. Sin or cos in numerator → trig identities. AP exam questions are typed to use each technique; you should recognize which by inspection.',
      ],
      vocabulary: [
        { term: 'conjugate', definition: 'for an expression a − b containing a radical, the conjugate is a + b; multiplying by it eliminates the radical via difference of squares.' },
        { term: 'common factor', definition: 'a factor present in both numerator and denominator that produces 0/0; canceling it resolves the limit.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-factor',
      kind: 'worked_example',
      problem:
        'Compute lim_{x→3} (x² − 9)/(x² − 5x + 6).',
      steps: [
        'STEP 1 — DIRECT SUBSTITUTE: (9 − 9)/(9 − 15 + 6) = 0/0. INDETERMINATE. Try factoring.',
        'STEP 2 — FACTOR. Numerator: x² − 9 = (x − 3)(x + 3). Denominator: x² − 5x + 6 = (x − 2)(x − 3).',
        'STEP 3 — CANCEL the common (x − 3) factor: [(x − 3)(x + 3)] / [(x − 2)(x − 3)] = (x + 3)/(x − 2), valid for x ≠ 3.',
        'STEP 4 — DIRECT SUBSTITUTE in the simplified expression. lim_{x→3} (x + 3)/(x − 2) = (3 + 3)/(3 − 2) = 6/1 = 6.',
      ],
      answer: '6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-conjugate',
      kind: 'worked_example',
      problem:
        'Compute lim_{x→0} (√(x + 4) − 2)/x.',
      steps: [
        'STEP 1 — DIRECT SUBSTITUTE: (√4 − 2)/0 = (2 − 2)/0 = 0/0. INDETERMINATE. Square root → use conjugate.',
        'STEP 2 — CONJUGATE of (√(x+4) − 2) is (√(x+4) + 2). Multiply numerator and denominator by it.',
        'STEP 3 — NUMERATOR after multiplication: (√(x+4))² − 2² = (x + 4) − 4 = x. (Difference of squares; the square roots cancel.)',
        'STEP 4 — DENOMINATOR: x · (√(x+4) + 2).',
        'STEP 5 — SIMPLIFIED EXPRESSION: x / [x · (√(x+4) + 2)] = 1/(√(x+4) + 2), valid for x ≠ 0.',
        'STEP 6 — DIRECT SUBSTITUTE: 1/(√4 + 2) = 1/(2 + 2) = 1/4.',
      ],
      answer: '1/4',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-trig',
      kind: 'worked_example',
      problem:
        'Compute lim_{x→0} sin(5x)/(2x).',
      steps: [
        'STEP 1 — DIRECT SUBSTITUTE: sin(0)/0 = 0/0. INDETERMINATE. Sin in numerator → use lim sin(x)/x = 1.',
        'STEP 2 — REWRITE to expose sin(5x)/(5x). Multiply by 5/5 inside: sin(5x)/(2x) = (5/2) · sin(5x)/(5x).',
        'STEP 3 — APPLY THE LIMIT IDENTITY. As x → 0, 5x → 0 too, so lim sin(5x)/(5x) = 1.',
        'STEP 4 — COMBINE. lim = (5/2) · 1 = 5/2.',
      ],
      answer: '5/2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-factor',
      kind: 'try_yourself',
      problem:
        'Compute lim_{x→4} (x² − 16)/(x − 4).',
      expectedAnswer:
        'Direct sub: (16 − 16)/(4 − 4) = 0/0. Factor: (x − 4)(x + 4)/(x − 4) = x + 4 (for x ≠ 4). Limit = 4 + 4 = 8.',
      responseFormat: 'numeric',
      hints: ['Difference of squares pattern in numerator.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-conjugate',
      kind: 'try_yourself',
      problem:
        'Compute lim_{x→9} (√x − 3)/(x − 9).',
      expectedAnswer:
        'Direct sub: (3 − 3)/0 = 0/0. Multiply num and denom by conjugate (√x + 3): numerator → x − 9. Expression: (x − 9)/[(x − 9)(√x + 3)] = 1/(√x + 3) (for x ≠ 9). Sub x = 9: 1/(3 + 3) = 1/6.',
      responseFormat: 'numeric',
      hints: ['Conjugate of √x − 3 is √x + 3. The product is x − 9 (difference of squares).'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-trig',
      kind: 'try_yourself',
      problem:
        'Compute each. (a) lim_{x→0} sin(7x)/x. (b) lim_{x→0} sin(2x)/sin(5x). (c) lim_{x→0} (1 − cos(x))/(x²).',
      expectedAnswer:
        '(a) sin(7x)/x = 7 · sin(7x)/(7x) → 7 · 1 = 7. (b) sin(2x)/sin(5x) = [sin(2x)/(2x)] · [(5x)/sin(5x)] · (2/5) = 1 · 1 · 2/5 = 2/5. (Or: numerator → 2 (treating 2x → 0); denom → 5; ratio → 2/5.) (c) Multiply num and denom by (1 + cos x): (1 − cos²x)/(x²(1 + cos x)) = sin²x/(x²(1 + cos x)) = (sin x/x)² · 1/(1 + cos x) → 1² · 1/(1 + 1) = 1/2.',
      responseFormat: 'numeric',
      hints: [
        '(a) Multiply by 7/7 to expose sin(7x)/(7x).',
        '(b) Split into two ratios that each → 1, with leftover constants.',
        '(c) Conjugate trick on (1 − cos x) gives sin²x / (1 + cos x).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-strategy-mix',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. For each indeterminate-form limit, identify which technique (factor, conjugate, common denominator, trig identity) is most appropriate, and briefly justify. (a) lim_{x→0} sin(3x)/(4x). (b) lim_{x→2} (x² − 5x + 6)/(x − 2). (c) lim_{x→0} (1/(x+1) − 1)/x. (d) lim_{x→1} (√(2x − 1) − 1)/(x − 1).",
      expectedAnswer:
        '(a) TRIG IDENTITY (lim sin(x)/x = 1). Sin in numerator with x in denominator — classic special trig limit. Multiply by 3/3 to get sin(3x)/(3x), apply identity, combine constants. Answer: 3/4. (b) FACTOR. Polynomial 0/0; factor numerator x² − 5x + 6 = (x − 2)(x − 3); cancel (x − 2). Simplified: x − 3. lim = -1. (c) COMMON DENOMINATOR. Numerator is (1/(x+1) − 1) — fraction-of-a-fraction. Combine: (1 − (x+1))/((x+1)) = -x/(x+1). Whole expression: -x/[x(x+1)] = -1/(x+1). lim = -1. (d) CONJUGATE. Square root in numerator. Multiply by conjugate (√(2x−1) + 1)/itself. Numerator becomes (2x − 1) − 1 = 2x − 2 = 2(x − 1). Cancel (x − 1). Simplified: 2/(√(2x−1) + 1). lim = 2/(1 + 1) = 1.',
      responseFormat: 'free',
      hints: [
        'Look at WHAT makes 0/0: polynomial roots → factor; square root → conjugate; small fractions → common denominator; sin/cos → trig identity.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-cancel-without-zero',
      kind: 'misconception_check',
      question:
        "After factoring (x² − 4)/(x − 2) = (x − 2)(x + 2)/(x − 2) and canceling, a student writes: 'So lim_{x→2} (x² − 4)/(x − 2) = lim_{x→2} (x + 2) = 4. The function is now defined at x = 2, so it's all good.' What's wrong?",
      commonErrors: [
        {
          answer: 'nothing — the simplification works',
          misconception: 'Treating algebraic cancellation as if it removes the original function\'s undefined point.',
          correctsTo:
            'The LIMIT computation is correct (= 4). But the CLAIM that "the function is now defined at x = 2" is wrong. The ORIGINAL function (x² − 4)/(x − 2) is STILL undefined at x = 2 (you\'re dividing by zero in the original expression). The simplified form (x + 2) is a DIFFERENT function — they agree at every x ≠ 2, but the original has a hole at x = 2. The limit doesn\'t care about that hole, because the limit examines x VALUES NEAR 2, not AT 2 — and the two functions agree near 2. AP frequently checks this: students must NOT claim the original function "becomes defined" via cancellation. Algebraic manipulation gives us a SIMPLER but EQUAL-NEAR-x=2 function for limit purposes; it doesn\'t change the original function\'s domain.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '0/0 indeterminate? Cancel the offending common factor.',
        'Polynomial 0/0 → FACTOR.',
        'Square-root 0/0 → CONJUGATE.',
        'Fraction-of-fraction 0/0 → COMMON DENOMINATOR.',
        'Sin/cos 0/0 → SPECIAL TRIG LIMITS: lim sin(x)/x = 1, lim (1−cos x)/x = 0.',
        'Cancellation finds the LIMIT but doesn\'t make the original function defined at the canceled point.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.6',
    cedTitle: 'Determining Limits Using Algebraic Manipulation',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard algebraic-manipulation toolkit for indeterminate forms.' },
    ],
  },
};
