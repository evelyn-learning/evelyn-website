/**
 * AP Calculus BC — CED Unit 6.10: Integrating Functions Using Long
 * Division and Completing the Square.
 *
 * Two algebraic pre-processing techniques that turn an unintegrable
 * rational expression into a sum of standard forms: polynomial long
 * division (when degree of numerator ≥ degree of denominator) and
 * completing the square (to reach arctangent / arcsine forms).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_LONG_DIVISION_COMPLETING_SQUARE: LessonPlan = {
  id: 'evelyn.ap.calcbc.long-division-completing-square.v1',
  title: 'U6.10 Integration Using Long Division and Completing the Square',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.long-division-completing-square',
      description:
        'Pre-process rational integrands before integrating: use polynomial long division when the numerator degree ≥ denominator degree, and complete the square in a quadratic denominator to reach arctangent or arcsine forms.',
      standard: 'AP-CALCBC-6.10',
    },
  ],
  prerequisites: ['apcalcbc.u-substitution'],
  followUps: ['apcalcbc.integration-by-parts'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame these as the algebraic "make it integrable first" moves.',
      script:
        "Some integrals look impossible until you fix the algebra FIRST. If the top of a fraction is the same degree or bigger than the bottom, you long-divide before you ever think about integrating. If the bottom is an unfactorable quadratic, you complete the square to unlock an arctangent. Neither move is calculus — it's algebra you already know — but knowing WHEN to reach for each is what the exam tests. These are your setup tools before the real integration.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-techniques',
      kind: 'concept',
      goal: 'Cover when and how to use long division and completing the square on rational integrands.',
      keyIdeas: [
        'THE TRIGGER for LONG DIVISION: the integrand is a rational function p(x)/q(x) where degree(numerator) ≥ degree(denominator). You CANNOT directly integrate an "improper" rational function — divide first.',
        'LONG DIVISION RESULT: p(x)/q(x) = (polynomial quotient) + (remainder)/q(x), where the remainder has SMALLER degree than q(x). Now integrate term by term: the polynomial part with the power rule, and the proper-fraction remainder with substitution, log, or arctan as appropriate.',
        'QUICK EXAMPLE (long division): ∫ x²/(x + 1) dx. Divide: x² ÷ (x + 1) = x − 1 + 1/(x + 1). So ∫ x²/(x+1) dx = ∫ (x − 1 + 1/(x+1)) dx = x²/2 − x + ln|x + 1| + C.',
        'THE TRIGGER for COMPLETING THE SQUARE: a quadratic denominator x² + bx + c that does NOT factor nicely (no real rational roots), especially when you sense an arctan or arcsin is hiding. Completing the square rewrites it as (x + h)² ± k².',
        'TARGET FORMS to aim for after completing the square: ∫ du/(u² + a²) = (1/a)·arctan(u/a) + C, and ∫ du/√(a² − u²) = arcsin(u/a) + C. The completed square (x + h)² + a² sets up u = x + h.',
        'QUICK EXAMPLE (completing the square): ∫ 1/(x² + 4x + 5) dx. Complete the square: x² + 4x + 5 = (x + 2)² + 1. Let u = x + 2, du = dx: ∫ 1/(u² + 1) du = arctan(u) + C = arctan(x + 2) + C.',
        'COMBINED CASE — do long division FIRST, then completing the square if needed. If the numerator degree ≥ denominator degree AND the leftover denominator is an irreducible quadratic, long-divide, then complete the square on the remainder term. Order matters: division before square-completing.',
        'DECISION CHECKLIST before integrating any rational function: (1) Is degree(top) ≥ degree(bottom)? → long-divide. (2) Does the denominator factor? → (partial fractions, Topic 6.12). (3) Is the denominator an irreducible quadratic? → complete the square toward arctan/arcsin. (4) Is the numerator the derivative of the denominator? → u-substitution to ln.',
      ],
      vocabulary: [
        { term: 'improper rational function', definition: 'a rational function whose numerator degree is ≥ its denominator degree; requires long division before integrating.' },
        { term: 'completing the square', definition: 'rewriting x² + bx + c as (x + b/2)² + (c − b²/4) to expose an arctan/arcsin form.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-long-division',
      kind: 'worked_example',
      problem:
        'Evaluate ∫ (x² + 3x + 5)/(x + 1) dx.',
      steps: [
        'STEP 1 — CHECK DEGREES. Numerator degree 2 ≥ denominator degree 1. This is an IMPROPER rational function → long-divide first.',
        'STEP 2 — LONG DIVISION. Divide x² + 3x + 5 by x + 1. x² ÷ x = x; x·(x + 1) = x² + x; subtract → 2x + 5. Then 2x ÷ x = 2; 2·(x + 1) = 2x + 2; subtract → remainder 3. So (x² + 3x + 5)/(x + 1) = x + 2 + 3/(x + 1).',
        'STEP 3 — REWRITE THE INTEGRAL. ∫ (x² + 3x + 5)/(x + 1) dx = ∫ (x + 2 + 3/(x + 1)) dx.',
        'STEP 4 — INTEGRATE TERM BY TERM. ∫ x dx = x²/2. ∫ 2 dx = 2x. ∫ 3/(x + 1) dx = 3 ln|x + 1|.',
        'STEP 5 — COMBINE. Result: x²/2 + 2x + 3 ln|x + 1| + C.',
      ],
      answer: 'x²/2 + 2x + 3 ln|x + 1| + C',
      estimatedMinutes: 5,
    },
    {
      id: 'try-completing-square',
      kind: 'try_yourself',
      problem:
        'Evaluate ∫ 1/(x² + 6x + 13) dx.',
      expectedAnswer:
        'The denominator does not factor over the rationals, so complete the square: x² + 6x + 13 = (x² + 6x + 9) + 4 = (x + 3)² + 4 = (x + 3)² + 2². Let u = x + 3, du = dx. The integral becomes ∫ 1/(u² + 2²) du = (1/2) arctan(u/2) + C = (1/2) arctan((x + 3)/2) + C. Key recognition: irreducible quadratic denominator + numerator constant ⇒ complete the square toward the arctan form ∫ du/(u² + a²) = (1/a)arctan(u/a).',
      responseFormat: 'numeric',
      hints: [
        'Denominator does not factor — complete the square.',
        '(x + 3)² + 4 matches u² + a² with a = 2.',
        'Use ∫ du/(u² + a²) = (1/a) arctan(u/a).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-combined',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Evaluate ∫ (x² + 1)/(x² + 2x + 2) dx. (Hint: think about degrees first.)',
      expectedAnswer:
        'STEP 1 — DEGREES: numerator degree 2 = denominator degree 2, so the function is improper → long-divide FIRST. Dividing x² + 1 by x² + 2x + 2: the quotient is 1, since 1·(x² + 2x + 2) = x² + 2x + 2; subtract from x² + 1 to get remainder (x² + 1) − (x² + 2x + 2) = −2x − 1. So (x² + 1)/(x² + 2x + 2) = 1 + (−2x − 1)/(x² + 2x + 2). STEP 2 — split the remaining fraction. ∫ 1 dx = x. For ∫ (−2x − 1)/(x² + 2x + 2) dx, notice the denominator derivative is 2x + 2. Write −2x − 1 = −(2x + 2) + 1. So the fraction = −(2x + 2)/(x² + 2x + 2) + 1/(x² + 2x + 2). STEP 3 — integrate each: ∫ −(2x + 2)/(x² + 2x + 2) dx = −ln|x² + 2x + 2| (u-sub with u = denominator). For ∫ 1/(x² + 2x + 2) dx, complete the square: x² + 2x + 2 = (x + 1)² + 1, giving arctan(x + 1). STEP 4 — COMBINE: x − ln(x² + 2x + 2) + arctan(x + 1) + C. (Absolute value unnecessary since x² + 2x + 2 > 0 always.) Strong answers show (i) long division because degrees are equal, (ii) splitting the numerator to isolate the denominator-derivative piece (→ ln) from the constant piece, and (iii) completing the square on the constant piece (→ arctan).',
      responseFormat: 'frq',
      hints: [
        'Equal degrees ⇒ long-divide first.',
        'Split the leftover numerator into a "derivative of denominator" part (→ ln) and a constant part.',
        'Complete the square on the constant-over-quadratic part (→ arctan).',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Degree(top) ≥ degree(bottom) ⇒ long-divide BEFORE integrating.',
        'Long division gives polynomial + proper remainder/denominator.',
        'Irreducible quadratic denominator ⇒ complete the square toward arctan/arcsin.',
        '(x + h)² + a² ⇒ ∫ du/(u² + a²) = (1/a) arctan(u/a).',
        'Combined problems: divide first, then complete the square on what remains.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.10',
    cedTitle: 'Integrating Using Long Division and Completing the Square',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Algebraic pre-processing of rational integrands: long division and completing the square.' },
    ],
  },
};
