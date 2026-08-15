/**
 * AP Calculus BC — CED Unit 3.5+3.6: Selecting Procedures for
 * Calculating Derivatives + Higher-Order Derivatives. Combined.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U3_HIGHER_ORDER_DERIVATIVES: LessonPlan = {
  id: 'evelyn.ap.calcbc.higher-order-derivatives.v1',
  title: 'U3.5 Selecting Procedures and Higher-Order Derivatives',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.higher-order-derivatives',
      description:
        'Select the appropriate combination of differentiation rules for a given problem; compute second, third, and higher-order derivatives; recognize patterns in higher-order derivatives.',
      standard: 'AP-CALCBC-3.5-3.6',
    },
  ],
  prerequisites: ['apcalcbc.derivatives-inverse-functions'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame higher-order derivatives as repeating the differentiation operation.',
      script:
        "The derivative of a derivative is the second derivative. Of that, the third. And so on. f\\'\\' tells you how f\\' is changing — useful for concavity, acceleration, Taylor series. Today: combine all the rules from Units 2-3 and take derivatives MORE THAN ONCE.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-higher-and-strategy',
      kind: 'concept',
      goal: 'Cover notation, mechanics of higher derivatives, strategy for selecting techniques.',
      keyIdeas: [
        'NOTATION for higher-order derivatives:',
        'f\'(x), f\'\'(x), f\'\'\'(x), f^(4)(x), f^(5)(x), ..., f^(n)(x). After 3 primes, switch to superscripts.',
        'Or in Leibniz: dy/dx, d²y/dx², d³y/dx³, ..., dⁿy/dxⁿ.',
        'COMPUTING HIGHER DERIVATIVES: just differentiate repeatedly. Start with f, get f\'. Differentiate f\' to get f\'\'. And so on.',
        'PATTERN — for polynomials: each derivative reduces degree by 1. After (degree+1) derivatives, you reach 0.',
        'PATTERN — for sin/cos: cycle of period 4. d/dx[sin x] = cos x → -sin x → -cos x → sin x → ...',
        'PATTERN — for e^x: every derivative is e^x. f^(n)(x) = e^x for all n.',
        'PATTERN — for x^n with negative n: signs alternate; coefficients accumulate factorials.',
        'STRATEGY for selecting differentiation procedures (synthesis of all rules so far):',
        '(1) Is the function a SUM/DIFFERENCE? Use linearity, differentiate term-by-term.',
        '(2) Is it a PRODUCT? Use product rule. Or expand if simpler.',
        '(3) Is it a QUOTIENT? Use quotient rule.',
        '(4) Is it a COMPOSITION? Use chain rule.',
        '(5) Is the function defined IMPLICITLY (equation in x and y)? Implicit differentiation.',
        '(6) Is it an INVERSE function? Use inverse-function derivative formula or implicit differentiation.',
        'Most real problems combine several. Identify the OUTERMOST structure first; apply appropriate rule; recurse on the inside.',
      ],
      vocabulary: [
        { term: 'second derivative', definition: 'f\'\'(x) = d²f/dx² = the derivative of f\'(x).' },
        { term: 'higher-order derivative', definition: 'f^(n)(x) for n ≥ 2; obtained by differentiating n times.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-higher',
      kind: 'worked_example',
      problem:
        'Find f\'\'(x) for f(x) = sin(2x).',
      steps: [
        'STEP 1 — FIRST DERIVATIVE (chain rule). f\'(x) = cos(2x) · 2 = 2 cos(2x).',
        'STEP 2 — SECOND DERIVATIVE (chain rule again). f\'\'(x) = d/dx[2 cos(2x)] = 2 · d/dx[cos(2x)] = 2 · (-sin(2x))·2 = -4 sin(2x).',
      ],
      answer: 'f\'\'(x) = -4 sin(2x)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-second',
      kind: 'try_yourself',
      problem:
        'Find f\'\'(x). (a) f(x) = x⁴ + 3x² − 2x + 1. (b) f(x) = e^(3x). (c) f(x) = ln(x).',
      expectedAnswer:
        '(a) f\'(x) = 4x³ + 6x − 2. f\'\'(x) = 12x² + 6. (b) f\'(x) = 3 e^(3x). f\'\'(x) = 9 e^(3x). (c) f\'(x) = 1/x = x^(-1). f\'\'(x) = -x^(-2) = -1/x².',
      responseFormat: 'numeric',
      hints: ['Differentiate twice in succession.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-pattern',
      kind: 'try_yourself',
      problem:
        'Find a formula for f^(n)(x) (the n-th derivative) when f(x) = e^(2x). Verify by computing f, f\', f\'\', f\'\'\'.',
      expectedAnswer:
        'f(x) = e^(2x). Each application of d/dx multiplies by 2 (chain rule with inner = 2x). f\'(x) = 2 e^(2x). f\'\'(x) = 4 e^(2x). f\'\'\'(x) = 8 e^(2x). Pattern: each derivative pulls out another factor of 2. f^(n)(x) = 2^n · e^(2x).',
      responseFormat: 'numeric',
      hints: ['Each derivative brings out a factor of 2 from the chain rule.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-implicit-second',
      kind: 'try_yourself',
      problem:
        'For x² + y² = 4, find d²y/dx² in terms of x and y. (Hint: differentiate implicitly to get dy/dx, then differentiate again.)',
      expectedAnswer:
        'STEP 1: differentiate implicitly. 2x + 2y · dy/dx = 0 → dy/dx = -x/y.\nSTEP 2: differentiate dy/dx = -x/y w.r.t. x. Use quotient rule: d/dx[-x/y] = -[(1)·y − x·dy/dx]/y² = -(y − x·dy/dx)/y².\nSTEP 3: substitute dy/dx = -x/y. = -(y − x·(-x/y))/y² = -(y + x²/y)/y² = -((y² + x²)/y)/y² = -(y² + x²)/y³.\nSTEP 4: use the original equation x² + y² = 4 to simplify: -(4)/y³ = -4/y³.\nSo d²y/dx² = -4/y³.',
      responseFormat: 'numeric',
      hints: [
        'Get dy/dx first. Then differentiate that expression.',
        'Use the original constraint to simplify.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-strategy',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. For each function, identify which differentiation rules are needed and the order to apply them. Then differentiate. (a) y = (sin x · ln x)/(x² + 1). (b) y = arctan(e^(x²)).',
      expectedAnswer:
        '(a) Outermost: QUOTIENT (numerator over (x² + 1)). Numerator is a PRODUCT (sin x · ln x). So: quotient rule, with product rule applied inside the numerator. Numerator derivative: cos x · ln x + sin x · (1/x). Apply quotient rule: y\' = [(cos x · ln x + sin x/x)·(x² + 1) − sin x · ln x · 2x]/(x² + 1)².\n(b) Outermost: arctan. Inner: e^(x²). Innermost: x². Apply chain rule TWICE. y\' = 1/(1 + (e^(x²))²) · d/dx[e^(x²)] = 1/(1 + e^(2x²)) · e^(x²) · 2x = 2x e^(x²)/(1 + e^(2x²)).',
      responseFormat: 'frq',
      hints: ['Identify outermost structure first; apply rule; recurse.'],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Higher derivatives: differentiate repeatedly. Notation: f\', f\'\', f\'\'\', f^(4), ...',
        'Patterns: e^(ax) → factor of a per derivative; sin/cos cycle period 4; polynomials drop degree.',
        'Rule selection: outermost first. Linearity, product, quotient, chain, implicit, inverse — in roughly that order of recognition.',
        'For implicit second derivatives: differentiate dy/dx, then substitute dy/dx and the original equation.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.5-3.6',
    cedTitle: 'Selecting Procedures and Higher-Order Derivatives',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Strategy + higher-order derivatives.' }],
  },
};
