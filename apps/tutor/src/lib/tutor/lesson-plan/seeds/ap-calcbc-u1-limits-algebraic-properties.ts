/**
 * AP Calculus BC — CED Unit 1.5: Determining Limits Using Algebraic
 * Properties of Limits.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_ALGEBRAIC_PROPERTIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-algebraic-properties.v1',
  title: 'U1.5 Determining Limits Using Algebraic Properties',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-algebraic-properties',
      description:
        'Apply the limit laws (sum, difference, constant multiple, product, quotient, power, root) plus direct substitution for continuous functions to compute limits algebraically.',
      standard: 'AP-CALCBC-1.5',
    },
  ],
  prerequisites: ['apcalcbc.limits-graphs-tables'],
  followUps: ['apcalcbc.limits-algebraic-manipulation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame limits as following arithmetic, not requiring case analysis when functions are well-behaved.',
      script:
        "For most functions you'll see — polynomials, rational functions away from zeros, sin/cos/exp — limits behave EXACTLY like substitution. lim_{x→3} (x² + 5) = 14, just plug in. The limit laws make this rigorous: limits distribute over the basic arithmetic operations. Today's plan: the laws and direct substitution.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Cover the limit laws + direct substitution + when substitution fails.',
      keyIdeas: [
        'LIMIT LAWS. Suppose lim_{x→a} f(x) = L and lim_{x→a} g(x) = M. Then:',
        '(1) SUM/DIFFERENCE: lim [f(x) ± g(x)] = L ± M.',
        '(2) CONSTANT MULTIPLE: lim [c · f(x)] = c · L.',
        '(3) PRODUCT: lim [f(x) · g(x)] = L · M.',
        '(4) QUOTIENT: lim [f(x) / g(x)] = L / M, PROVIDED M ≠ 0.',
        '(5) POWER: lim [f(x)]^n = L^n.',
        '(6) ROOT: lim ⁿ√f(x) = ⁿ√L (assuming L ≥ 0 for even roots).',
        'DIRECT SUBSTITUTION applies for any function CONTINUOUS at a: lim_{x→a} f(x) = f(a). This includes all polynomials, rational functions where denominator ≠ 0 at a, sin x, cos x, e^x, ln x (where x > 0), and combinations.',
        'WHEN SUBSTITUTION FAILS — INDETERMINATE FORMS. If you plug in and get 0/0, ∞/∞, ∞ - ∞, 0 · ∞, 0⁰, ∞⁰, or 1^∞ — the limit\'s value is NOT determined by direct substitution. You need algebraic manipulation (Unit 1.6) or special techniques to evaluate.',
        'EXAMPLE OF SUBSTITUTION WORKING: lim_{x→2} (3x² + x − 1) = 3(4) + 2 − 1 = 13. The polynomial is continuous at every real number, so direct substitution gives the exact answer.',
        'EXAMPLE WHERE SUBSTITUTION FAILS: lim_{x→2} (x² − 4) / (x − 2). Plugging in: (4 − 4) / (2 − 2) = 0/0. INDETERMINATE. Need algebraic manipulation.',
      ],
      vocabulary: [
        { term: 'direct substitution', definition: 'evaluating lim_{x→a} f(x) by computing f(a) — valid when f is continuous at a.' },
        { term: 'indeterminate form', definition: 'a limit expression like 0/0, ∞/∞, ∞−∞, etc., whose value is not directly determined; requires manipulation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-direct-substitution',
      kind: 'worked_example',
      problem:
        'Compute each limit using the limit laws. (a) lim_{x→2} (3x³ − x² + 4). (b) lim_{x→1} (x² + 1) / (x + 3). (c) lim_{x→0} sin(x) · cos(x). (d) lim_{x→4} √(x² + 9).',
      steps: [
        'STEP 1 — (a) "lim (3x³ − x² + 4) at x=2": polynomial, continuous everywhere → direct substitution. = 3(8) − 4 + 4 = 24.',
        'STEP 2 — (b) "lim (x² + 1)/(x + 3) at x=1": rational; check denominator at x=1: 1+3 = 4 ≠ 0. Continuous at x=1 → direct substitution. Numerator: 1+1 = 2. Denominator: 4. Limit = 2/4 = 1/2.',
        'STEP 3 — (c) "lim sin(x)·cos(x) at x=0": sin and cos continuous everywhere. Substitute. sin(0) = 0, cos(0) = 1. Product = 0 · 1 = 0.',
        'STEP 4 — (d) "lim √(x² + 9) at x=4": square root composed with continuous polynomial; continuous since x²+9 > 0. Direct substitute. Inside: 16 + 9 = 25. √25 = 5. Limit = 5.',
        'STEP 5 — INTUITION. All four cases are "easy" because the functions are continuous at the target point. The limit IS the function value. Most calculus problems aren\'t this clean — the harder cases are where substitution fails (indeterminate forms).',
      ],
      answer: '(a) 24. (b) 1/2. (c) 0. (d) 5.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-direct-sub',
      kind: 'try_yourself',
      problem:
        'Compute each limit by direct substitution where applicable. (a) lim_{x→3} (2x² − 5x + 1). (b) lim_{x→0} cos(2x). (c) lim_{x→2} e^(x²−4). (d) lim_{x→1} ln(2x).',
      expectedAnswer:
        '(a) 2(9) − 15 + 1 = 18 − 15 + 1 = 4. (b) cos(0) = 1. (c) e^0 = 1. (d) ln(2) ≈ 0.693.',
      responseFormat: 'numeric',
      hints: ['Each function here is continuous at the target point — substitute directly.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fail-cases',
      kind: 'try_yourself',
      problem:
        'For each limit, attempt direct substitution. If it succeeds, give the answer. If it produces an indeterminate form, identify the form (0/0, ∞/∞, etc.). (a) lim_{x→2} (x² − 4)/(x − 2). (b) lim_{x→3} (x − 3)/(x² − 9). (c) lim_{x→0} sin(x)/x. (d) lim_{x→1} (x + 4)/(x − 1).',
      expectedAnswer:
        '(a) Substitution: (4 − 4)/(2 − 2) = 0/0. INDETERMINATE. (b) (3 − 3)/(9 − 9) = 0/0. INDETERMINATE. (c) sin(0)/0 = 0/0. INDETERMINATE. (d) (1 + 4)/(1 − 1) = 5/0. NOT indeterminate; this is "finite/0" which means the limit is INFINITE (we\'ll examine in Unit 1.14). Strictly: lim DNE as a finite real number; the function has a vertical asymptote at x = 1.',
      responseFormat: 'free',
      hints: [
        'Plug in carefully. If both numerator and denominator → 0, that\'s 0/0.',
        '5/0 is NOT 0/0 — it\'s a vertical-asymptote case.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-when-laws-apply',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why is the QUOTIENT limit law restricted to cases where the denominator\'s limit is NONZERO? What goes wrong when the denominator → 0?',
      expectedAnswer:
        'The quotient law states lim [f/g] = L/M provided M ≠ 0. The restriction is necessary because DIVISION BY ZERO IS UNDEFINED in arithmetic — and the limit can\'t simply equal "L / 0". Two distinct cases when M = 0: (i) IF L ≠ 0 and M = 0: the function blows up near a — vertical asymptote, infinite limit, which AP calls DNE (or describes as ±∞). The quotient law as stated doesn\'t apply; we use limit-at-infinity techniques (Unit 1.14). (ii) IF L = 0 AND M = 0: 0/0 indeterminate form. We don\'t know the limit yet — algebraic manipulation may reveal it. The quotient law still doesn\'t apply directly. The law\'s "M ≠ 0" restriction is precisely the dividing line between "easy direct substitution" and "needs more work". Strong answers: name BOTH the L≠0,M=0 (asymptote/DNE) AND L=0,M=0 (indeterminate) cases, articulate that the law\'s restriction is what separates well-defined from problematic.',
      responseFormat: 'frq',
      hints: [
        'What is L/0 when L is nonzero? When L is zero?',
        'Two distinct failure cases.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Limit laws: limits distribute over +, −, ×, /, powers, roots (with quotient: M ≠ 0).',
        'For continuous functions: lim_{x→a} f(x) = f(a). This is direct substitution.',
        'Polynomials, sin/cos/exp/ln, rational functions away from zeros — all continuous, all substitution-friendly.',
        'INDETERMINATE FORMS (0/0, ∞/∞, etc.) require algebraic manipulation or other techniques.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.5',
    cedTitle: 'Determining Limits Using Algebraic Properties',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard limit laws across AP calculus textbooks.' },
    ],
  },
};
