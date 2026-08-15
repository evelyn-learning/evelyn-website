/**
 * AP Calculus BC — CED Unit 2.8: The Product Rule.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_PRODUCT_RULE: LessonPlan = {
  id: 'evelyn.ap.calcbc.product-rule.v1',
  title: 'U2.8 The Product Rule',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.product-rule',
      description:
        'State and apply the product rule: d/dx[f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x). Recognize when the rule is needed (vs linearity alone).',
      standard: 'AP-CALCBC-2.8',
    },
  ],
  prerequisites: ['apcalcbc.transcendental-derivatives'],
  followUps: ['apcalcbc.quotient-rule'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Address the common misconception "derivative of product = product of derivatives".',
      script:
        "Derivatives DO distribute over addition (linearity). They do NOT distribute over multiplication. d/dx[x · sin x] is NOT (1)(cos x) — that's a critical error. The correct rule has TWO TERMS — the PRODUCT RULE. Today's plan: master the rule and recognize when to use it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-product',
      kind: 'concept',
      goal: 'State the product rule + when it applies + the "left-prime + right-prime" pattern.',
      keyIdeas: [
        'PRODUCT RULE: d/dx[f(x) · g(x)] = f\'(x) · g(x) + f(x) · g\'(x).',
        'MNEMONIC. "First prime times second, plus first times second prime." Or: differentiate ONE FACTOR AT A TIME, summing the two results.',
        'WHEN TO USE — recognize a PRODUCT of two functions where each is its own piece. Examples: x · sin x, e^x · ln x, (x² + 1)·cos x, (3x² + 5)(x − 4).',
        'WHEN NOT NEEDED — for polynomial products that simplify. (x + 2)(x − 3) — you CAN apply product rule, but expanding to x² − x − 6 first then differentiating to 2x − 1 is faster. Use product rule when expansion is hard or impossible (e.g., x · e^x cannot be simplified).',
        'PRODUCT RULE EXAMPLES:',
        '- d/dx[x sin x] = (1)·sin x + x·cos x = sin x + x cos x.',
        '- d/dx[e^x · ln x] = e^x · ln x + e^x · (1/x) = e^x(ln x + 1/x).',
        '- d/dx[(x²)·(cos x)] = (2x) cos x + x²(-sin x) = 2x cos x − x² sin x.',
        'EXTENDS TO 3+ FACTORS by repeated application: d/dx[fgh] = f\'gh + fg\'h + fgh\'. (Each factor differentiated in turn.)',
      ],
      vocabulary: [
        { term: 'product rule', definition: '(fg)\' = f\'g + fg\'.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-product',
      kind: 'worked_example',
      problem:
        'Differentiate f(x) = (3x² + 1)(sin x).',
      steps: [
        'STEP 1 — IDENTIFY: this is a PRODUCT of two functions. Let u(x) = 3x² + 1 and v(x) = sin x.',
        'STEP 2 — COMPUTE INDIVIDUAL DERIVATIVES. u\'(x) = 6x. v\'(x) = cos x.',
        'STEP 3 — APPLY PRODUCT RULE. f\'(x) = u\'·v + u·v\' = (6x)(sin x) + (3x² + 1)(cos x).',
        'STEP 4 — OPTIONAL SIMPLIFICATION. f\'(x) = 6x sin x + (3x² + 1) cos x. Could expand to 6x sin x + 3x² cos x + cos x.',
      ],
      answer: 'f\'(x) = 6x sin x + (3x² + 1) cos x',
      estimatedMinutes: 3,
    },
    {
      id: 'try-product-1',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) f(x) = x² · ln x. (b) g(x) = e^x · cos x. (c) h(x) = (x³ − 2x)(x + 1).',
      expectedAnswer:
        '(a) f\'(x) = 2x · ln x + x²·(1/x) = 2x ln x + x. (b) g\'(x) = e^x·cos x + e^x·(-sin x) = e^x(cos x − sin x). (c) Could expand first: x⁴ + x³ − 2x² − 2x. Differentiate: 4x³ + 3x² − 4x − 2. (Or apply product rule: (3x² − 2)(x + 1) + (x³ − 2x)(1) = 3x³ + 3x² − 2x − 2 + x³ − 2x = 4x³ + 3x² − 4x − 2. ✓)',
      responseFormat: 'numeric',
      hints: ['Apply f\'g + fg\'. For polynomial products, expanding first may be faster.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-tangent-product',
      kind: 'try_yourself',
      problem:
        'Find the slope of the tangent line to y = x · cos x at x = π/2.',
      expectedAnswer:
        'y\' = (1)·cos x + x·(-sin x) = cos x − x sin x. At x = π/2: y\' = cos(π/2) − (π/2)·sin(π/2) = 0 − (π/2)·1 = -π/2.',
      responseFormat: 'numeric',
      hints: ['Apply product rule then evaluate at x = π/2. cos(π/2) = 0, sin(π/2) = 1.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-three-factor',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The product rule extends to three or more factors via repeated application. Derive the formula for d/dx[f(x) · g(x) · h(x)] in terms of the individual derivatives. Then apply it to compute d/dx[x² · sin x · e^x].',
      expectedAnswer:
        'DERIVE: Treat (f·g·h) = (f·g)·h. By product rule: (f·g)\'·h + (f·g)·h\'. Now apply product rule again to (f·g)\': (f·g)\' = f\'·g + f·g\'. Substituting: (f\'·g + f·g\')·h + (f·g)·h\' = f\'·g·h + f·g\'·h + f·g·h\'. So d/dx[f·g·h] = f\'gh + fg\'h + fgh\'. PATTERN: each factor takes a turn being differentiated. APPLY to x² · sin x · e^x. Let f = x² (f\' = 2x), g = sin x (g\' = cos x), h = e^x (h\' = e^x). d/dx = (2x)·sin x·e^x + x²·cos x·e^x + x²·sin x·e^x = e^x·(2x sin x + x² cos x + x² sin x) = e^x · x · (2 sin x + x cos x + x sin x). Strong answers: derive the rule, identify the pattern (each factor differentiated once, others held constant), apply correctly.',
      responseFormat: 'frq',
      hints: ['Apply product rule twice (treat one pair as one factor at first).'],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-product',
      kind: 'misconception_check',
      question: 'Is d/dx[f(x) · g(x)] = f\'(x) · g\'(x)?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the derivative as distributing over multiplication.',
          correctsTo:
            'NO. The derivative does NOT distribute over multiplication. The correct rule is d/dx[f·g] = f\'·g + f·g\' (the PRODUCT RULE). Counter-example: f(x) = x, g(x) = x. Product = x², derivative = 2x. Naive: f\'·g\' = 1·1 = 1. WRONG. Product rule: f\'·g + f·g\' = 1·x + x·1 = 2x. ✓ The derivative DOES distribute over ADDITION (linearity), but NOT multiplication. AP exam regularly tests this distinction.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PRODUCT RULE: (fg)\' = f\'g + fg\'.',
        'TWO terms: differentiate one factor, keep the other; then swap.',
        'Derivative does NOT distribute over multiplication.',
        'Three factors: f\'gh + fg\'h + fgh\'.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.8',
    cedTitle: 'The Product Rule',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Standard product rule.' }],
  },
};
