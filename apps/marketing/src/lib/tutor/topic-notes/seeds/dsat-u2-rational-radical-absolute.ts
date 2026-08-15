/**
 * Digital SAT — Unit 2 CED 2.5: Rational, Radical & Absolute-Value Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.rational-radical-absolute.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_RATIONAL_RADICAL_ABSOLUTE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.rational-radical-absolute.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.5',
  cedTitle: 'Rational, Radical & Absolute-Value Equations',
  planId: 'evelyn.testprep.dsat.rational-radical-absolute.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.rational-radical-absolute.v1' }],
  theory: [
    { loId: 'dsat.rational-radical-absolute', kind: 'framework', title: 'Rational equations', content: `RATIONAL EQUATIONS — clear every denominator by multiplying both sides by the LCD, solve the resulting polynomial, then CHECK each candidate against the ORIGINAL denominators. Any candidate that makes an original denominator zero is EXTRANEOUS — reject it, even though it "solves" the cleared equation.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'framework', title: 'Radical equations', content: `RADICAL EQUATIONS — isolate the radical on one side, then square both sides to eliminate it. Squaring is not reversible (it loses sign information), so it can manufacture a candidate that fails the ORIGINAL (unsquared) equation. Plug every candidate back into the original before reporting it.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'framework', title: 'Absolute-value equations', content: `ABSOLUTE-VALUE EQUATIONS — |A| = B splits into two cases, A = B and A = −B, but ONLY when B ≥ 0. If B is negative, the equation has NO SOLUTION — an absolute value can never equal a negative number.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'framework', title: 'The SAT trap', content: `THE SAT TRAP — wrong answer choices on these questions are frequently the exact extraneous root produced by squaring or clearing denominators. Skipping the check step is the single most common way to miss an otherwise-correct solve.` },
    { loId: 'dsat.rational-radical-absolute', content: `DOMAIN FIRST, when possible — for rational equations, identify which x-values make a denominator zero BEFORE you solve, so you already know which candidates to reject on sight.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — graph y = (left side) − (right side); the x-intercepts are the TRUE solutions, since Desmos evaluates the actual original functions and automatically excludes points where a function is undefined.` },
    { loId: 'dsat.rational-radical-absolute', content: `|A| = |B| (absolute value on BOTH sides) splits into A = B or A = −B with no sign condition needed — both sides are already guaranteed nonnegative, so the split itself never introduces an extraneous root.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'definition', title: 'extraneous solution', content: `a value produced by valid algebra (squaring, clearing denominators) that fails to satisfy the ORIGINAL equation — must be rejected.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'definition', title: 'excluded value', content: `an x-value that makes a denominator zero and can never belong to a rational equation's solution set.` },
    { loId: 'dsat.rational-radical-absolute', kind: 'definition', title: 'case split', content: 'rewriting |A| = B as the two equations A = B and A = −B, valid only when B ≥ 0.' },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        'Cross-multiply: 2(x − 1) = 1(x + 3).',
        'Distribute and collect: 2x − 2 = x + 3 → x = 5.',
        `CHECK the original denominators: x + 3 = 8 ≠ 0 and x − 1 = 4 ≠ 0 — x = 5 is allowed. Verify: 2/8 = 0.25 and 1/4 = 0.25. ✓`,
      ],
      example: { problem: 'Solve: 2/(x + 3) = 1/(x − 1)', solution: 'x = 5' },
      relatedLoIds: ['dsat.rational-radical-absolute'],
    },
    {
      title: 'Worked trap',
      steps: [
        'Square both sides: x + 3 = (x − 3)² = x² − 6x + 9.',
        'Collect: 0 = x² − 7x + 6 = (x − 6)(x − 1) → x = 6 or x = 1.',
        'CHECK x = 6 in the ORIGINAL: √9 = 3, and 6 − 3 = 3. ✓ Valid.',
        `CHECK x = 1 in the ORIGINAL: √4 = 2, and 1 − 3 = −2. 2 ≠ −2 — EXTRANEOUS. Reject it.`,
      ],
      example: { problem: 'Solve: √(x + 3) = x − 3', solution: 'x = 6 (x = 1 is extraneous — squaring introduced it)' },
      relatedLoIds: ['dsat.rational-radical-absolute'],
    },
  ],
  pointers: [
    { content: `Before splitting |A| = B into cases, check the sign of B. Here B = −6, which is negative — and an absolute value can NEVER equal a negative number. The equation has NO SOLUTION. The case split A = B or A = −B is only valid when B ≥ 0.`, kind: 'common-error' },
    { content: `Rational equations: clear the LCD, solve, then reject any candidate that makes an original denominator zero.`, kind: 'tip' },
    { content: `Radical equations: isolate and square, then check every candidate in the ORIGINAL (unsquared) equation — squaring can create extraneous roots.`, kind: 'tip' },
    { content: `|A| = B splits into A = B or A = −B only when B ≥ 0; a negative B means no solution, full stop.`, kind: 'tip' },
    { content: `The SAT's wrong answer choices are often exactly the extraneous root — never skip the check.`, kind: 'tip' },
    { content: `Watch the question stem: "how many solutions" and "which value of x" (singular) are hints an extraneous root is coming. If your algebra gives two candidates but the stem says "the value," one of them is almost certainly failing the original — find which.`, kind: 'gotcha' },
    { content: `For √(expr) = (linear), the sign of the right side is the fast filter: any candidate making the right side negative is extraneous instantly — no need to compute the radical. In √(x+3) = x−3, x=1 gives RHS = −2 < 0, dead on sight.`, kind: 'tip' },
    { content: `"No solution" is a real answer choice on these. x/(x−2) = 2/(x−2) + 3 clears to x = 2 — the exact excluded value. Don't panic and re-solve; a candidate that equals an excluded value means the equation has NO solution.`, kind: 'edge-case' },
    { content: `Don't confuse |A| = |B| with |A| = B. Two absolute values: split into A = B or A = −B with no sign check needed. One absolute value: check B ≥ 0 first, or the whole split is invalid.`, kind: 'common-error' },
    { content: `SPR (type-in) answers can't be "no solution" — if a student-produced response gives you two candidates, exactly one is extraneous. Check both before typing; the extraneous one is the trap answer they expect.`, kind: 'tip' },
    { content: `Multiply the ENTIRE side by the LCD, including terms with no denominator. In x/(x−2) = 2/(x−2) + 3, the 3 becomes 3(x−2), not 3. Forgetting to distribute the LCD to the constant term is the #1 rational-equation slip.`, kind: 'common-error' },
    { content: `Squaring only creates extraneous roots — it never destroys real ones. So never add a root that appears after squaring but wasn't there before; your job is only to reject, never to hunt for extras.`, kind: 'vocab-note' },
    { content: `If a radical equation has TWO radicals, isolate one, square, then isolate and square again — one squaring won't clear both. Squaring √a + √b = c in one shot leaves a cross term 2√(ab).`, kind: 'edge-case' },
  ],
};
