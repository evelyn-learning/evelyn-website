/**
 * AP Calculus BC — CED Unit 6.8: Basic Antiderivatives.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U6_BASIC_ANTIDERIVATIVES: LessonPlan = {
  id: 'evelyn.ap.calcbc.basic-antiderivatives.v1',
  title: 'U6.8 Basic Antiderivatives and Indefinite Integrals',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.basic-antiderivatives', description: 'Compute indefinite integrals of basic functions: power rule (reverse), trig, exponential, logarithmic. Recognize the +C constant of integration.', standard: 'AP-CALCBC-6.8' }],
  prerequisites: ['apcalcbc.integral-properties'],
  followUps: ['apcalcbc.u-substitution'],
  estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame antiderivatives as "undoing" the basic derivative rules.',
      script: "Every derivative rule has a corresponding antiderivative rule (reversed). Power rule for derivatives: x^n → n·x^(n-1). Power rule for antiderivatives: x^n → x^(n+1)/(n+1). Today: master the basic table of antiderivatives.",
      estimatedMinutes: 2 },
    { id: 'concept-table', kind: 'concept', goal: 'Cover basic antiderivatives + indefinite integral notation.',
      keyIdeas: [
        'INDEFINITE INTEGRAL: ∫ f(x) dx = F(x) + C, where F is any antiderivative of f and C is the CONSTANT OF INTEGRATION (since adding a constant to F still gives the same derivative f).',
        'POWER RULE (reverse): ∫ x^n dx = x^(n+1)/(n+1) + C, for n ≠ -1.',
        'SPECIAL CASE n = -1: ∫ (1/x) dx = ln|x| + C.',
        'TRIG: ∫ sin(x) dx = -cos(x) + C. ∫ cos(x) dx = sin(x) + C. ∫ sec²(x) dx = tan(x) + C. ∫ sec(x)tan(x) dx = sec(x) + C. ∫ csc²(x) dx = -cot(x) + C. ∫ csc(x)cot(x) dx = -csc(x) + C.',
        'EXPONENTIAL: ∫ e^x dx = e^x + C. More generally: ∫ a^x dx = a^x/ln(a) + C.',
        'INVERSE TRIG: ∫ 1/√(1-x²) dx = arcsin(x) + C. ∫ 1/(1+x²) dx = arctan(x) + C.',
        'LINEARITY: ∫ [c·f(x) + d·g(x)] dx = c·∫f(x) dx + d·∫g(x) dx. Constants come out; sums distribute.',
        'ALWAYS INCLUDE +C for indefinite integrals. Definite integrals lose the +C (cancels in subtraction).',
        'CHECK YOUR ANSWER: differentiate F(x). If you get f(x), antiderivative is correct.',
      ],
      vocabulary: [
        { term: 'antiderivative', definition: 'F such that F\'(x) = f(x).' },
        { term: 'indefinite integral', definition: '∫ f(x) dx = F(x) + C; family of all antiderivatives.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-basic', kind: 'worked_example',
      problem: 'Compute. (a) ∫ (4x³ + 2x − 1) dx. (b) ∫ (2 cos x + 3 e^x) dx. (c) ∫ (1/x + 1/x²) dx.',
      steps: [
        'STEP 1 — (a) ∫ 4x³ dx = x⁴. ∫ 2x dx = x². ∫ -1 dx = -x. Combined: x⁴ + x² − x + C.',
        'STEP 2 — (b) ∫ 2 cos x dx = 2 sin x. ∫ 3 e^x dx = 3 e^x. Total: 2 sin x + 3 e^x + C.',
        'STEP 3 — (c) ∫ 1/x dx = ln|x|. ∫ 1/x² dx = ∫ x^(-2) dx = x^(-1)/(-1) = -1/x. Total: ln|x| − 1/x + C.',
      ],
      answer: '(a) x⁴+x²-x+C. (b) 2sinx+3e^x+C. (c) ln|x|-1/x+C.', estimatedMinutes: 4 },
    { id: 'try-basic', kind: 'try_yourself',
      problem: 'Evaluate. (a) ∫ (x⁵ − 3x² + 2) dx. (b) ∫ (5 sin x) dx. (c) ∫ (e^x + 1/(1+x²)) dx. (d) ∫ √x dx.',
      expectedAnswer: '(a) x⁶/6 − x³ + 2x + C. (b) -5 cos x + C. (c) e^x + arctan(x) + C. (d) ∫ x^(1/2) dx = x^(3/2)/(3/2) = (2/3)x^(3/2) + C.',
      responseFormat: 'numeric', hints: ['Apply power rule reversed; trig formulas; remember +C.'], estimatedMinutes: 4 },
    { id: 'try-definite', kind: 'try_yourself',
      problem: 'Evaluate the definite integrals. (a) ∫_0^2 (x² + 1) dx. (b) ∫_0^{π/2} sin x dx. (c) ∫_1^4 (1/√x) dx.',
      expectedAnswer: '(a) [x³/3 + x] from 0 to 2 = 8/3 + 2 = 14/3. (b) [-cos x] from 0 to π/2 = -cos(π/2) − (-cos(0)) = 0 + 1 = 1. (c) ∫ x^(-1/2) dx = 2x^(1/2). Evaluate: 2(√4 − √1) = 2(2 − 1) = 2.',
      responseFormat: 'numeric', hints: ['Find antiderivative; F(b) − F(a).'], estimatedMinutes: 4 },
    { id: 'try-trick', kind: 'try_yourself',
      problem: 'AP-style synthesis. Why must we include "+C" for indefinite integrals but NOT for definite integrals?',
      expectedAnswer: 'INDEFINITE: ∫ f(x) dx is a FAMILY of all antiderivatives — any function whose derivative is f. If F is one antiderivative, then F + C is another for any constant C (since (F+C)\' = F\' = f). So we write F(x) + C to capture the entire family. Without +C, we\'d be giving only ONE specific antiderivative, omitting the whole family. DEFINITE: ∫_a^b f(x) dx = F(b) − F(a). The "+C" cancels in the subtraction: (F(b) + C) − (F(a) + C) = F(b) − F(a). So the constant doesn\'t affect the definite integral\'s value. Strong answers: (i) explain "family" of antiderivatives, (ii) show the +C cancellation in definite case.',
      responseFormat: 'frq', hints: ['Many antiderivatives exist; +C captures them all. In definite case, +C cancels in subtraction.'], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: [
      '∫ x^n dx = x^(n+1)/(n+1) + C (n ≠ -1).',
      '∫ 1/x dx = ln|x| + C.',
      'Trig: sin/cos/sec²/sec·tan/csc²/csc·cot have memorizable antiderivatives.',
      'e^x → e^x; 1/(1+x²) → arctan(x); 1/√(1-x²) → arcsin(x).',
      'INDEFINITE: always +C. DEFINITE: +C cancels.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '6', cedTopic: '6.8', cedTitle: 'Basic Antiderivatives',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '4', note: 'Standard antiderivative table.' }] },
};
