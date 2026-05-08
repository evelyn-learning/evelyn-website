/**
 * AP Calculus BC — CED Unit 2.9 + 2.10: Quotient Rule + Trig Derivatives.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_QUOTIENT_RULE: LessonPlan = {
  id: 'evelyn.ap.calcbc.quotient-rule.v1',
  title: 'U2.9 The Quotient Rule and Derivatives of tan, cot, sec, csc',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.quotient-rule',
      description:
        'Apply the quotient rule (f/g)\' = (f\'g − fg\')/g², and use it to derive and apply the standard trig derivatives: tan, cot, sec, csc.',
      standard: 'AP-CALCBC-2.9-2.10',
    },
  ],
  prerequisites: ['apcalcbc.product-rule'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame quotient rule as the version for division.',
      script:
        "When you have f(x)/g(x) — a quotient of two functions — you need the QUOTIENT RULE. It looks more complex than the product rule but follows a clean pattern: 'low d-high minus high d-low, all over low squared.' Memorize the mnemonic; use it everywhere there's a fraction.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quotient',
      kind: 'concept',
      goal: 'State the quotient rule + use it to derive tan/sec/csc/cot derivatives.',
      keyIdeas: [
        'QUOTIENT RULE: d/dx[f(x)/g(x)] = [f\'(x)·g(x) − f(x)·g\'(x)] / [g(x)]².',
        'MNEMONIC: "Low d-high minus high d-low, all over the square of what\'s below." Or: (top\'·bottom − top·bottom\')/(bottom²).',
        'CRITICAL — sign order matters. The minus is in the middle. Reversing to (f·g\' − f\'·g)/g² is WRONG.',
        'WHEN TO USE — visible quotient where denominator and numerator are both functions. f(x) = (x² + 1)/(x − 3); f(x) = sin x / x; f(x) = e^x / (x² + 1).',
        'ALTERNATIVE — for f(x)/c where c is a constant, just use linearity: d/dx[f/c] = f\'/c. No need for quotient rule.',
        'STANDARD TRIG DERIVATIVES (derived using quotient rule):',
        '- d/dx[tan x] = sec² x. Derivation: tan x = sin x / cos x. Apply quotient rule. Numerator: cos x · cos x − sin x · (-sin x) = cos²x + sin²x = 1. Denominator: cos²x. Result: 1/cos²x = sec²x.',
        '- d/dx[cot x] = -csc² x. Similar derivation; cot = cos/sin.',
        '- d/dx[sec x] = sec x · tan x. Use sec x = 1/cos x; quotient rule.',
        '- d/dx[csc x] = -csc x · cot x. Similar.',
        'MEMORIZE THE FOUR — they appear constantly in AP exam questions.',
      ],
      vocabulary: [{ term: 'quotient rule', definition: '(f/g)\' = (f\'g − fg\')/g².' }],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-quotient',
      kind: 'worked_example',
      problem:
        'Differentiate f(x) = (x² + 1)/(x³ − 5).',
      steps: [
        'STEP 1 — IDENTIFY top and bottom. Top = x² + 1; top\' = 2x. Bottom = x³ − 5; bottom\' = 3x².',
        'STEP 2 — APPLY QUOTIENT RULE. f\'(x) = [(2x)·(x³ − 5) − (x² + 1)·(3x²)] / (x³ − 5)².',
        'STEP 3 — EXPAND NUMERATOR (optional). 2x·(x³ − 5) = 2x⁴ − 10x. (x² + 1)·(3x²) = 3x⁴ + 3x². Numerator = 2x⁴ − 10x − 3x⁴ − 3x² = -x⁴ − 3x² − 10x.',
        'STEP 4 — FINAL. f\'(x) = (-x⁴ − 3x² − 10x) / (x³ − 5)².',
      ],
      answer: 'f\'(x) = (-x⁴ − 3x² − 10x) / (x³ − 5)²',
      estimatedMinutes: 4,
    },
    {
      id: 'try-quotient-1',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) f(x) = x / sin x. (b) g(x) = (3x − 1)/(x² + 4). (c) h(x) = e^x / (x + 1).',
      expectedAnswer:
        '(a) f\'(x) = [1·sin x − x·cos x]/sin²x = (sin x − x cos x)/sin²x. (b) g\'(x) = [3(x² + 4) − (3x − 1)(2x)]/(x² + 4)² = [3x² + 12 − 6x² + 2x]/(x² + 4)² = (-3x² + 2x + 12)/(x² + 4)². (c) h\'(x) = [e^x·(x + 1) − e^x·1]/(x + 1)² = e^x·x/(x + 1)² = x e^x/(x + 1)².',
      responseFormat: 'numeric',
      hints: ['Top\'·bottom minus top·bottom\', over bottom squared.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-trig-derivs',
      kind: 'try_yourself',
      problem:
        'Compute. (a) d/dx[tan x]. (b) d/dx[sec x]. (c) d/dx[3 tan x − 2 sec x].',
      expectedAnswer:
        '(a) sec²x (memorize). (b) sec x tan x (memorize). (c) 3 sec²x − 2 sec x tan x.',
      responseFormat: 'numeric',
      hints: ['tan → sec²; sec → sec·tan. Linearity for the third.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-derive-tan',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. DERIVE the formula d/dx[tan x] = sec² x using the quotient rule and the identity tan x = sin x/cos x. Show every step.',
      expectedAnswer:
        'tan x = sin x/cos x. Apply quotient rule with top = sin x (top\' = cos x), bottom = cos x (bottom\' = -sin x). d/dx[tan x] = [cos x·cos x − sin x·(-sin x)]/(cos x)² = (cos²x + sin²x)/cos²x. Use Pythagorean identity sin²x + cos²x = 1: numerator = 1. Result: 1/cos²x. Recognize 1/cos x = sec x, so 1/cos²x = sec²x. Therefore d/dx[tan x] = sec²x. Strong answers: (i) state tan = sin/cos, (ii) apply quotient rule with correct sign, (iii) simplify using Pythagorean identity, (iv) convert to sec².',
      responseFormat: 'frq',
      hints: ['tan = sin/cos. Quotient rule. Pythagorean identity simplifies.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'QUOTIENT RULE: (f/g)\' = (f\'g − fg\')/g². Sign order matters.',
        'tan → sec². cot → -csc². sec → sec·tan. csc → -csc·cot.',
        'Memorize all four trig derivatives. They appear everywhere.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.9-2.10',
    cedTitle: 'Quotient Rule and Trig Derivatives',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Standard quotient rule + trig derivatives.' }],
  },
};
