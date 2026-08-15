/**
 * Algebra 1 — Unit 1 CED 1.3: Simplifying Expressions: Distributive Property & Like Terms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.simplifying-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U1_SIMPLIFYING_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.simplifying-expressions.v1',
  course: 'Algebra 1',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Simplifying Expressions: Distributive Property & Like Terms',
  planId: 'evelyn.hs.alg1.simplifying-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.simplifying-expressions.v1' }],
  theory: [
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Term anatomy', content: `TERM ANATOMY — an expression is a sum of terms separated by + and −. In 7x² − 4x + 9, the terms are 7x², −4x, and 9. The sign in front BELONGS to the term.` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Like terms', content: `LIKE TERMS — terms with the exact same variable part, same exponent: 5x and −2x are like; 5x and 5x² are NOT; 5x and 5y are NOT. Constants like 9 and −3 are like each other.` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Combining', content: `COMBINING — add the coefficients, keep the variable part unchanged: 5x + (−2x) = 3x. The exponent never changes and never adds, so 5x + 2x = 7x, never 7x².` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Distributive property', content: `DISTRIBUTIVE PROPERTY — a(b + c) = ab + ac. The outside factor multiplies EVERY term inside, not just the first: 3(2x + 5) = 6x + 15.` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Negative multipliers', content: `NEGATIVE MULTIPLIERS — carry the sign through both products: −2(x − 6) = −2x + 12. Multiplying two negatives gives a positive, which is where most simplification errors are born.` },
    { loId: 'alg1.simplifying-expressions', content: `A BARE MINUS IS −1 — the expression 8 − (2x − 4) means 8 + (−1)(2x − 4) = 8 − 2x + 4 = 12 − 2x. Every sign inside the parentheses flips.` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'The routine', content: `THE ROUTINE — 1) distribute to clear every set of parentheses, 2) group like terms, 3) add coefficients, 4) write the result with the variable term first, highest power first.` },
    { loId: 'alg1.simplifying-expressions', kind: 'framework', title: 'Stop when nothing matches', content: `STOP WHEN NOTHING MATCHES — 9x + 4 is finished. Forcing it into 13x is the single most common Algebra 1 error, because a variable term and a constant are not like terms.` },
    { loId: 'alg1.simplifying-expressions', kind: 'definition', title: 'coefficient', content: 'the number multiplying the variable part of a term — the 7 in 7x².' },
    { loId: 'alg1.simplifying-expressions', kind: 'definition', title: 'like terms', content: `terms with identical variable parts and exponents — the only terms that can be combined.` },
  ],
  methods: [
    {
      title: 'Worked distribute collect',
      steps: [
        `Distribute the 3 to BOTH inside terms: 3 · 2x = 6x and 3 · 5 = 15, so the expression becomes 6x + 15 + 4x − 7.`,
        'Group like terms: the x-terms are 6x and 4x; the constants are 15 and −7.',
        'Combine the x-terms: 6x + 4x = 10x.',
        `Combine the constants: 15 − 7 = 8. Final form: 10x + 8. Check with x = 1: original 3(7) + 4 − 7 = 18, simplified 10 + 8 = 18. ✓`,
      ],
      example: { problem: 'Simplify: 3(2x + 5) + 4x − 7', solution: '10x + 8' },
      relatedLoIds: ['alg1.simplifying-expressions'],
    },
    {
      title: 'Worked negative multiplier',
      steps: [
        `The 3 is glued to the parentheses by multiplication and it is being SUBTRACTED, so the multiplier is −3. Do not compute 8 − 3 first.`,
        `Distribute −3 to both terms: −3 · 2x = −6x and −3 · (−4) = +12. The expression becomes 8 − 6x + 12 + 5x.`,
        'Group like terms: x-terms −6x and 5x; constants 8 and 12.',
        `Combine: −6x + 5x = −x, and 8 + 12 = 20. Final form: −x + 20. Check with x = 2: original 8 − 3(0) + 10 = 18, simplified −2 + 20 = 18. ✓`,
      ],
      example: { problem: 'Simplify: 8 − 3(2x − 4) + 5x', solution: '−x + 20' },
      relatedLoIds: ['alg1.simplifying-expressions'],
    },
  ],
  pointers: [
    { content: `5x and 3 are unlike terms — 5x means 5 of something and 3 means 3 of nothing-in-particular. 5x + 3 is already fully simplified; leave it alone.`, kind: 'common-error' },
    { content: `x and x² are different variable parts, so these are unlike terms — 2x + 3x² cannot be combined at all. Even when terms DO match, only coefficients add: the exponent stays put, so 2x + 3x = 5x.`, kind: 'common-error' },
    { content: `The routine: distribute every set of parentheses, then group and add coefficients of like terms.`, kind: 'tip' },
    { content: `The outside factor hits EVERY term inside — and it carries its sign: −3(2x − 4) = −6x + 12.`, kind: 'tip' },
    { content: 'A bare minus in front of parentheses is −1: 8 − (2x − 4) = 12 − 2x.', kind: 'tip' },
    { content: `Like terms need the same variable AND the same exponent; combining only adds coefficients, never exponents.`, kind: 'tip' },
    { content: '9x + 4 is a finished answer. Not everything combines.', kind: 'tip' },
    { content: `When a minus sign sits in front of a factor times parentheses, the multiplier is negative: in 8 − 3(2x − 4), distribute **−3**, not 3. Never subtract 8 − 3 first — the 3 is glued to the parentheses by multiplication.`, kind: 'common-error' },
    { content: `A bare minus before parentheses means −1, so EVERY sign inside flips: 8 − (2x − 4) = 8 − 2x + 4 = 12 − 2x. Writing 8 − 2x − 4 is the classic slip.`, kind: 'gotcha' },
    { content: `Combining like terms adds only the COEFFICIENTS — the exponent never changes and never adds. 5x + 2x = 7x (not 7x²); 2x + 3x² stays as it is.`, kind: 'common-error' },
    { content: `5x + 3 = 8x is wrong — a variable term and a constant are never like terms. If nothing matches, the expression is already simplified. 9x + 4 is a complete answer.`, kind: 'common-error' },
    { content: `The sign in front of a term BELONGS to it. In 7x² − 4x + 9 the terms are 7x², **−4x**, and 9. Carry that minus into your grouping, or you'll add 4x instead of subtracting it.`, kind: 'vocab-note' },
    { content: `'Coefficient' means the number multiplying the variable, sign included. In −x the coefficient is −1, and −6x + 5x = −x, not 0 or −11x. Write −x, not −1x.`, kind: 'vocab-note' },
    { content: `Same variable AND same exponent, or it's not like: 5x and 5y don't combine; 5x and 5x² don't combine. Different letters and different powers both block combining.`, kind: 'edge-case' },
    { content: `Self-check by substituting a number (try x = 1 or 2) into the original AND your simplified expression — they must match. This catches sign errors instantly.`, kind: 'tip' },
  ],
};
