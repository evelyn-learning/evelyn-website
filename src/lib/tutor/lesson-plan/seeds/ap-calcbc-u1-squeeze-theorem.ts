/**
 * AP Calculus BC — CED Unit 1.8: Determining Limits Using the Squeeze
 * Theorem.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U1_SQUEEZE_THEOREM: LessonPlan = {
  id: 'evelyn.ap.calcbc.squeeze-theorem.v1',
  title: 'U1.8 Determining Limits Using the Squeeze Theorem',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.squeeze-theorem',
      description:
        'State the Squeeze Theorem and apply it to evaluate limits of bounded oscillating functions (e.g. lim_{x→0} x · sin(1/x) = 0) by trapping the function between two simpler limits.',
      standard: 'AP-CALCBC-1.8',
    },
  ],
  prerequisites: ['apcalcbc.limits-strategy'],
  followUps: ['apcalcbc.discontinuity-types'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Squeeze Theorem feel like the elegant solution to oscillating-limit problems.',
      script:
        "Some limits don't yield to factoring, conjugates, or trig identities — they involve a function oscillating wildly. The Squeeze Theorem catches these: trap the unfriendly function between two friendly ones whose limits agree, and you've shown the unfriendly one has the same limit. It's elegant — and AP exam questions LOVE it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-squeeze',
      kind: 'concept',
      goal: 'Cover the Squeeze Theorem statement, when it applies, and the standard examples.',
      keyIdeas: [
        'SQUEEZE THEOREM (sometimes called "Sandwich Theorem"): Suppose g(x) ≤ f(x) ≤ h(x) for all x near a (except possibly at a itself), AND lim_{x→a} g(x) = lim_{x→a} h(x) = L. Then lim_{x→a} f(x) = L.',
        'INTUITION. If two functions both approach L from above and below, anything trapped between them is forced to approach L too. The "squeeze" makes the trapped function follow.',
        'WHEN TO REACH FOR IT. Functions that OSCILLATE without an obvious form — typically involving sin(1/x), cos(1/x), or other erratic-near-0 expressions. Direct substitution fails (sin(1/0) is undefined; the function jumps wildly), and other techniques don\'t apply.',
        'KEY PROPERTY USED: |sin(anything)| ≤ 1 and |cos(anything)| ≤ 1 ALWAYS, regardless of how the argument behaves. This gives upper and lower bounds.',
        'STANDARD EXAMPLE: lim_{x→0} x · sin(1/x). The function sin(1/x) oscillates between -1 and 1 as x → 0. So x · sin(1/x) is bounded between -|x| and |x|. Both ±|x| → 0 as x → 0. Squeeze: lim x · sin(1/x) = 0.',
        'SECOND USE: PROVING the special trig limits. The proof of lim_{x→0} sin(x)/x = 1 uses the Squeeze Theorem with geometric bounds (cos(x) ≤ sin(x)/x ≤ 1 for small x). AP doesn\'t require the proof; just know that\'s where the limit comes from.',
        'NON-EXAMPLE — when not to use it. If the function isn\'t obviously bounded (no |·| ≤ 1 pattern, no trapping curves), Squeeze isn\'t the right tool. Look for sine/cosine of an unfriendly argument as the signal.',
      ],
      vocabulary: [
        { term: 'Squeeze Theorem', definition: 'if g(x) ≤ f(x) ≤ h(x) near a and lim g = lim h = L, then lim f = L.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-x-sin-inverse',
      kind: 'worked_example',
      problem:
        'Compute lim_{x→0} x² · sin(1/x). (Note: sin(1/x) oscillates wildly as x → 0; direct substitution gives sin(undefined).)',
      steps: [
        'STEP 1 — RECOGNIZE the situation. sin(1/x) oscillates between -1 and 1 as x → 0. The function x² · sin(1/x) doesn\'t simplify; squeeze theorem applies.',
        'STEP 2 — UPPER AND LOWER BOUNDS. Since -1 ≤ sin(1/x) ≤ 1 for all x ≠ 0, multiplying through by x² (which is non-negative): -x² ≤ x² · sin(1/x) ≤ x².',
        'STEP 3 — CHECK THE BOUNDING LIMITS. lim_{x→0} x² = 0. lim_{x→0} (-x²) = 0. Both upper and lower bounds approach 0.',
        'STEP 4 — APPLY SQUEEZE THEOREM. Since x² · sin(1/x) is trapped between -x² and x², and both limits are 0, lim_{x→0} x² · sin(1/x) = 0.',
        'STEP 5 — INTUITION. The wild oscillation of sin(1/x) doesn\'t matter because x² → 0 so fast that the product is dominated. The squeeze formalizes this intuition.',
      ],
      answer: '0',
      estimatedMinutes: 4,
    },
    {
      id: 'try-bound-sine',
      kind: 'try_yourself',
      problem:
        'Compute lim_{x→0} x · cos(1/x).',
      expectedAnswer:
        '|cos(1/x)| ≤ 1 always. So -|x| ≤ x · cos(1/x) ≤ |x|. (For x > 0: -x ≤ x · cos(1/x) ≤ x. For x < 0 the bounds flip but the absolute-value formulation handles it.) lim |x| = 0; lim -|x| = 0. Squeeze: lim_{x→0} x · cos(1/x) = 0.',
      responseFormat: 'numeric',
      hints: ['cos(1/x) is bounded between -1 and 1; multiply through by x.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-when-squeeze',
      kind: 'try_yourself',
      problem:
        'Identify which of the following limits can be evaluated using the Squeeze Theorem (and apply it where applicable). (a) lim_{x→0} x³ · sin(1/x²). (b) lim_{x→0} sin(1/x). (c) lim_{x→0} x · sin(x).',
      expectedAnswer:
        '(a) YES, squeeze applies. -|x³| ≤ x³ · sin(1/x²) ≤ |x³|. Both → 0. Limit = 0. (b) NO, squeeze does NOT give the limit. sin(1/x) is bounded but doesn\'t converge — it oscillates between -1 and 1 forever. The bounds -1 ≤ sin(1/x) ≤ 1 don\'t SQUEEZE to anything (the bounds don\'t both approach the same limit). lim DNE. (c) Squeeze technically applies (sin x is bounded), but DIRECT SUBSTITUTION suffices: sin(0) = 0, so x · sin(x) → 0 · 0 = 0. Squeeze is overkill here. Strong answers note that squeeze IS available but unnecessary when simpler tools work.',
      responseFormat: 'free',
      hints: [
        'Squeeze needs bounds that BOTH approach the same finite limit.',
        'If the bounds don\'t agree, squeeze doesn\'t resolve the limit.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-prove-trig-limit',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The standard trig limit lim_{x→0} sin(x)/x = 1 is PROVED using the Squeeze Theorem (with geometric bounds cos(x) ≤ sin(x)/x ≤ 1 for x near 0). Briefly explain how the squeeze gives us = 1, and why we can\'t use direct substitution to compute lim_{x→0} sin(x)/x.',
      expectedAnswer:
        'DIRECT SUBSTITUTION FAILS: plugging x = 0 into sin(x)/x gives 0/0, indeterminate. SQUEEZE PROOF: One can show geometrically (using areas of triangles and circular sectors) that for x near 0, cos(x) ≤ sin(x)/x ≤ 1. Now consider the limits of the bounding functions: lim_{x→0} cos(x) = cos(0) = 1 (cos is continuous). And the upper bound is just the constant 1 — its limit is also 1. Both bounds → 1. By Squeeze Theorem: lim_{x→0} sin(x)/x is squeezed between two limits both equal to 1, so it must equal 1. This is a CRITICAL technique because the result lim sin(x)/x = 1 is foundational for derivatives of trig functions (Unit 2). Strong answers cite: (i) why direct sub fails, (ii) the squeeze with cos(x) ≤ sin(x)/x ≤ 1, (iii) both bounds approach 1, (iv) squeeze conclusion.',
      responseFormat: 'frq',
      hints: [
        'sin(0)/0 = 0/0 — direct sub fails.',
        'Bounds: cos(x) ≤ sin(x)/x ≤ 1.',
        'Both bounds → 1 as x → 0.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Squeeze Theorem: g ≤ f ≤ h near a + lim g = lim h = L → lim f = L.',
        'Use when sin/cos of weird argument bounds an unfriendly function.',
        'Standard pattern: -|something_small| ≤ x · sin(1/x) ≤ |something_small|, both → 0.',
        'Squeeze is also the proof technique for lim sin(x)/x = 1.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.8',
    cedTitle: 'Determining Limits Using the Squeeze Theorem',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '1', note: 'Squeeze theorem as standard tool for oscillating limits.' },
    ],
  },
};
