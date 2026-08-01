/**
 * Algebra 1 — Unit 9 CED 9.3: Rational Expressions & Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.rational-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U9_RATIONAL_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.rational-expressions.v1',
  course: 'Algebra 1',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'Rational Expressions & Equations',
  planId: 'evelyn.hs.alg1.rational-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.rational-expressions.v1' }],
  theory: [
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'What it is', content: `WHAT IT IS — a rational expression is a fraction whose numerator and denominator are polynomials, like (x² − 9)/(x + 4). Every rule you already trust for number fractions still applies.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Simplify by factoring', content: `SIMPLIFY BY FACTORING — factor the numerator and the denominator completely, then cancel any FACTOR they both contain. Example: (x² − 9)/(x² + 7x + 12) = (x − 3)(x + 3)/[(x + 3)(x + 4)] = (x − 3)/(x + 4).` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Factors cancel, terms do not', content: `FACTORS CANCEL, TERMS DO NOT — this is the one error that sinks the whole topic. In (x + 3)/3 the 3 on top is a TERM being added, not a factor, so nothing cancels: (x + 3)/3 is NOT x. Test it with x = 3: (3 + 3)/3 = 2, not 3.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Excluded values', content: `EXCLUDED VALUES — any x that makes an ORIGINAL denominator zero is excluded, because dividing by zero is undefined. Read them off the factored ORIGINAL denominator, before cancelling: a factor that cancels still excludes its value.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Multiplying', content: `MULTIPLYING — factor everything first, then cancel any factor on a top against the same factor on a bottom (across the two fractions is fine), then multiply what survives. No common denominator is needed.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Dividing', content: `DIVIDING — flip the second fraction and multiply by its reciprocal, then proceed exactly as above. Never divide straight across.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Solving rational equations', content: `SOLVING RATIONAL EQUATIONS — multiply EVERY term on both sides by the LCD so the denominators disappear, then solve the ordinary equation that is left.` },
    { loId: 'alg1.rational-expressions', kind: 'framework', title: 'Always check', content: `ALWAYS CHECK — clearing denominators can hand you a candidate that was never legal. If a candidate equals an excluded value, it is EXTRANEOUS: reject it, even though the algebra was correct.` },
    { loId: 'alg1.rational-expressions', kind: 'definition', title: 'rational expression', content: 'a ratio of two polynomials, e.g. (x + 1)/(x² − 4).' },
    { loId: 'alg1.rational-expressions', kind: 'definition', title: 'excluded value', content: `an x-value that makes an original denominator zero, so the expression is undefined there.` },
    { loId: 'alg1.rational-expressions', kind: 'definition', title: 'extraneous solution', content: `a candidate produced by correct algebra that fails in the original equation and must be thrown out.` },
  ],
  methods: [
    {
      title: 'Worked simplify',
      steps: [
        'Factor the numerator as a difference of squares: x² − 9 = (x − 3)(x + 3).',
        `Factor the denominator: x² + 7x + 12 = (x + 3)(x + 4), since 3 · 4 = 12 and 3 + 4 = 7.`,
        `Excluded values come from the ORIGINAL denominator: (x + 3)(x + 4) = 0 when x = −3 or x = −4.`,
        `Cancel the shared FACTOR (x + 3): (x − 3)(x + 3)/[(x + 3)(x + 4)] = (x − 3)/(x + 4).`,
        'Spot-check with x = 0: original is −9/12 = −3/4, simplified is −3/4. ✓',
      ],
      example: { problem: 'Simplify and state the excluded values: (x² − 9)/(x² + 7x + 12)', solution: '(x − 3)/(x + 4), with x ≠ −3 and x ≠ −4' },
      relatedLoIds: ['alg1.rational-expressions'],
    },
    {
      title: 'Worked extraneous',
      steps: [
        `List the excluded value FIRST: x − 3 = 0 at x = 3, so x = 3 can never be a solution.`,
        'Multiply every term by the LCD (x − 3): x = 3 + 2(x − 3).',
        'Distribute and collect: x = 3 + 2x − 6 → x = 2x − 3 → 0 = x − 3 → x = 3.',
        `The only candidate is x = 3 — but that is the excluded value. Substituting it makes both denominators zero, so it is EXTRANEOUS.`,
        `Reject it. Nothing is left, so the equation has NO solution. The algebra was fine; clearing the denominator is what invented a candidate that was never allowed.`,
      ],
      example: { problem: 'Solve: x/(x − 3) = 3/(x − 3) + 2', solution: 'No solution (x = 3 is extraneous)' },
      relatedLoIds: ['alg1.rational-expressions'],
    },
  ],
  pointers: [
    { content: `Only common FACTORS cancel. (x + 6)/6 is already simplified (you may split it as x/6 + 1). Disprove the shortcut with a number: at x = 6 the original is (6 + 6)/6 = 2, but the "simplified" x would give 6. To cancel legally, the numerator must be factored, as in 6(x + 1)/6 = x + 1.`, kind: 'common-error' },
    { content: 'Factor the top and the bottom completely before you cancel anything.', kind: 'tip' },
    { content: 'Factors cancel; terms never do. (x + 6)/6 is not x.', kind: 'tip' },
    { content: `Excluded values come from the ORIGINAL denominator — including factors that later cancel.`, kind: 'tip' },
    { content: 'Divide by flipping the second fraction and multiplying by its reciprocal.', kind: 'tip' },
    { content: `Solve by multiplying every term by the LCD, then reject any candidate that is an excluded value.`, kind: 'tip' },
    { content: `Only **factors** cancel — never terms. Before you cross anything out, ask: "is this thing multiplied by everything else on its line?" If it's being added, it stays. Quick disproof: at x = 6, (x + 6)/6 = 2, not 6.`, kind: 'common-error' },
    { content: `Read excluded values off the **original** factored denominator, not the simplified answer. In (x²−9)/(x²+7x+12) the (x+3) cancels but x ≠ −3 still holds — so the answer needs both x ≠ −3 and x ≠ −4.`, kind: 'gotcha' },
    { content: `The numerator being zero is fine — only a zero **denominator** is excluded. For (x+2)/(x²−3x−10), x = −2 makes the top zero (value 0, perfectly legal) but it's still excluded because it also zeros the bottom.`, kind: 'edge-case' },
    { content: `"Extraneous" ≠ "wrong work." An extraneous solution comes from correct algebra; the LCD step invented it. So write the excluded values down *before* solving, then compare your candidates against that list.`, kind: 'vocab-note' },
    { content: `When every candidate turns out to be extraneous, the answer is "no solution" — not the rejected number and not a blank. State it: "no solution; x = 3 is extraneous."`, kind: 'edge-case' },
    { content: `Multiply **every** term by the LCD, including the ones with no denominator. In 1/(x−4) + 2 = 9/(x−4), the 2 becomes 2(x−4), not 2. Forgetting it is the most common wrong answer here.`, kind: 'common-error' },
    { content: `Division: flip the **second** fraction, then multiply. Never cancel or divide straight across before flipping, and don't hunt for a common denominator — multiplying and dividing rational expressions never need one.`, kind: 'gotcha' },
    { content: `Spot-check simplifications with an easy legal number (often x = 0 or x = 1). Plug it into the original and your simplified form — if they don't match, you cancelled a term. Just avoid using an excluded value as your test number.`, kind: 'tip' },
  ],
};
