/**
 * AP Calculus BC — CED Unit 1.15: Connecting Limits at Infinity and
 * Horizontal Asymptotes.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_LIMITS_AT_INFINITY: LessonPlan = {
  id: 'evelyn.ap.calcbc.limits-at-infinity-horizontal-asymptotes.v1',
  title: 'U1.15 Limits at Infinity and Horizontal Asymptotes',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.limits-at-infinity-horizontal-asymptotes',
      description:
        'Compute limits as x → ±∞ (especially for rational functions via the degree comparison rule), connect such limits to horizontal asymptotes, and apply the dominant-term technique to evaluate them.',
      standard: 'AP-CALCBC-1.15',
    },
  ],
  prerequisites: ['apcalcbc.infinite-limits-vertical-asymptotes'],
  followUps: ['apcalcbc.intermediate-value-theorem'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Connect "x to infinity" with horizontal asymptotes.',
      script:
        "What does a function look like 'far out'? As x grows large (positive or negative), some functions level off (approaching a horizontal asymptote), some grow without bound, some oscillate. Limits at infinity capture this 'long-run' behavior precisely. The technique for rational functions is fast once you know the degree-comparison rule.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-infinity-limits',
      kind: 'concept',
      goal: 'Cover the dominant-term rule for rationals + horizontal asymptote definition + non-rational cases.',
      keyIdeas: [
        'LIMIT AT INFINITY: lim_{x→∞} f(x) = L means as x grows arbitrarily large positively, f(x) approaches L. Similarly for x → -∞.',
        'HORIZONTAL ASYMPTOTE: y = L is a horizontal asymptote of f if lim_{x→∞} f(x) = L OR lim_{x→-∞} f(x) = L (the function may have different HAs on the two sides, or only one side).',
        'DOMINANT-TERM RULE FOR RATIONAL FUNCTIONS. Given f(x) = N(x)/D(x) where N has degree n and D has degree d:',
        '(a) If n < d (denominator higher degree): lim_{x→±∞} f(x) = 0. HA at y = 0. Example: 1/(x² + 1) → 0.',
        '(b) If n = d: lim = ratio of LEADING COEFFICIENTS. HA at that ratio. Example: (3x² + 2)/(5x² − 1) → 3/5 as x → ±∞.',
        '(c) If n > d (numerator higher degree): lim = ±∞. NO horizontal asymptote (function grows without bound). Sign depends on parity of (n − d) and sign of leading coefficients.',
        'TECHNIQUE — DIVIDE BY HIGHEST POWER OF X IN DENOMINATOR. Given a rational, divide numerator and denominator by x^d. Each term becomes a constant divided by a power of x. As x → ∞, terms with positive powers of x in denominator → 0. What remains is the limit.',
        'EXAMPLE — n < d: lim (3x + 1)/(x² + 5). Divide by x²: (3/x + 1/x²)/(1 + 5/x²). As x → ∞: 0/(1) = 0. ✓ Matches dominant-term rule (degrees 1 vs 2, so → 0).',
        'NON-RATIONAL CASES. e^x → ∞ as x → ∞; → 0 as x → -∞. ln(x) → ∞ as x → ∞ (slowly). sin(x) and cos(x): no limit at ±∞ (oscillate forever, DNE).',
        'SQUARE ROOTS at infinity: be careful with signs. lim_{x→-∞} √(x²) = lim |x| = +∞ (NOT -∞). And √(x² + 1)/x as x → -∞ requires careful sign work because √(x²) = |x| = -x for negative x.',
      ],
      vocabulary: [
        { term: 'horizontal asymptote', definition: 'a horizontal line y = L that f approaches as x → ±∞.' },
        { term: 'dominant term', definition: 'the term with the highest power of x in a polynomial; controls the polynomial\'s behavior as x → ±∞.' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rational',
      kind: 'worked_example',
      problem:
        'Compute each limit and identify any horizontal asymptotes. (a) lim_{x→∞} (4x² − 3x + 1)/(2x² + 7). (b) lim_{x→∞} (5x + 2)/(x³ − 1). (c) lim_{x→-∞} (3x² + 2)/(x − 4).',
      steps: [
        'STEP 1 — (a) Numerator degree 2, denominator degree 2. EQUAL → ratio of leading coefficients. lim = 4/2 = 2. HA at y = 2.',
        'STEP 2 — (b) Numerator degree 1, denominator degree 3. Numerator < denominator → lim = 0. HA at y = 0.',
        'STEP 3 — (c) Numerator degree 2, denominator degree 1. Numerator > denominator → lim = ±∞. Sign: leading numerator coefficient is +3 (positive); denominator at x → -∞ has sign of x = negative. So 3x² (positive, since squared) / x (negative, large magnitude) = positive / large negative = ratio approaches large in magnitude with the sign of numerator/denominator. Specifically: 3x²/x = 3x → -∞ as x → -∞. So lim = -∞. NO horizontal asymptote.',
        'STEP 4 — VERIFICATION (for (a)). Divide N and D by x² (highest power in D): N = 4 − 3/x + 1/x²; D = 2 + 7/x². As x → ∞, the 1/x and 1/x² terms vanish. Limit = 4/2 = 2 ✓.',
      ],
      answer: '(a) lim = 2, HA y = 2. (b) lim = 0, HA y = 0. (c) lim = -∞, no HA.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-degree-rule',
      kind: 'try_yourself',
      problem:
        'Compute each limit using the degree-comparison rule. (a) lim_{x→∞} (3x² + 2x − 5)/(7x² + x). (b) lim_{x→∞} (x³ − 4x)/(2x² + 1). (c) lim_{x→-∞} 8/(x² + 100).',
      expectedAnswer:
        '(a) Degrees equal (both 2). Ratio of leads: 3/7. (b) Numerator deg 3, denom deg 2. Numerator > denom → lim = ∞. Specifically the leading term is x³/2x² = x/2 → ∞. (c) Numerator deg 0, denom deg 2. 0 < 2 → lim = 0. Both x → ∞ and x → -∞ give 0 (denominator dominated by x², which is always positive and large).',
      responseFormat: 'numeric',
      hints: ['Compare degrees, then apply the rule.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-non-rational-inf',
      kind: 'try_yourself',
      problem:
        'Compute each limit. (a) lim_{x→∞} e^(-x). (b) lim_{x→∞} ln(x). (c) lim_{x→∞} sin(x). (d) lim_{x→∞} (sin(x))/x.',
      expectedAnswer:
        '(a) e^(-x) = 1/e^x. As x → ∞, e^x → ∞, so 1/e^x → 0. lim = 0. (b) ln(x) → ∞ as x → ∞. (c) sin(x) oscillates between -1 and 1 forever; no convergence. lim DNE. (d) sin(x) is bounded (-1 ≤ sin(x) ≤ 1), and 1/x → 0. By squeeze theorem (or just bounded × 0): -1/x ≤ sin(x)/x ≤ 1/x. Both bounds → 0. lim_{x→∞} sin(x)/x = 0.',
      responseFormat: 'numeric',
      hints: [
        '(a) e^x grows exponentially.',
        '(b) ln grows but unboundedly.',
        '(c) Bounded oscillation, no limit.',
        '(d) Bounded numerator + denominator going to ∞ + squeeze.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-square-root',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Compute lim_{x→-∞} (√(x² + 1))/x. Show your work, paying careful attention to the sign issues with √(x²) when x < 0.',
      expectedAnswer:
        'For x → -∞, x is negative and large in magnitude. KEY FACT: √(x²) = |x|, which equals -x when x < 0 (because |x| is non-negative; -x makes a negative x positive). Strategy: factor x² out of the radical. √(x² + 1) = √(x²(1 + 1/x²)) = |x|·√(1 + 1/x²). For x → -∞ (x < 0): |x| = -x. So √(x² + 1) = -x·√(1 + 1/x²). Now: (√(x² + 1))/x = (-x·√(1 + 1/x²))/x = -√(1 + 1/x²). As x → -∞, 1/x² → 0, so √(1 + 1/x²) → 1. Therefore lim = -1. (Compare: lim_{x→+∞} (√(x² + 1))/x = +1, since for x > 0, √(x²) = x.) Strong answers: explicitly state √(x²) = |x|, handle the sign of x < 0 by writing |x| = -x, factor and simplify.',
      responseFormat: 'frq',
      hints: [
        '√(x²) = |x|, which is -x for negative x.',
        'Factor x² out of the radical for clean limit-taking.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Limit at infinity = behavior of f as x → ±∞.',
        'HA at y = L ⟺ lim_{x→±∞} f(x) = L for at least one direction.',
        'Rational functions: deg(N) < deg(D) → 0; equal → ratio of leads; deg(N) > deg(D) → ±∞.',
        'e^(-x) → 0; ln(x) → ∞ (slowly); sin/cos at ∞: DNE (oscillate).',
        'Square roots at -∞: √(x²) = |x| = -x for x < 0. Sign care required.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.15',
    cedTitle: 'Connecting Limits at Infinity and Horizontal Asymptotes',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Standard limits-at-infinity treatment with rational-function rule.' },
    ],
  },
};
