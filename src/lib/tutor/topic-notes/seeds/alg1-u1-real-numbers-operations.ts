/**
 * Algebra 1 — Unit 1 CED 1.1: Real Numbers & Operations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.real-numbers-operations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U1_REAL_NUMBERS_OPERATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.real-numbers-operations.v1',
  course: 'Algebra 1',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Real Numbers & Operations',
  planId: 'evelyn.hs.alg1.real-numbers-operations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.real-numbers-operations.v1' }],
  theory: [
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'The sets nest', content: `THE SETS NEST — counting numbers sit inside whole numbers, which sit inside integers (… −2, −1, 0, 1, 2 …), which sit inside the RATIONALS. A rational number is any number you can write as a fraction a/b of two integers with b ≠ 0, which is exactly the terminating decimals (0.75) and the repeating ones (0.333…).` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'Irrationals fill the gaps', content: `IRRATIONALS FILL THE GAPS — numbers like √2, √10, and π have decimals that never end and never repeat, so no fraction of integers equals them. Rationals plus irrationals together make the REAL numbers. Roots are the usual trap: √9 = 3 is rational because 9 is a perfect square, while √10 is irrational — the root symbol alone does not mean irrational.` },
    { loId: 'alg1.real-numbers-operations', content: `CLOSURE (the N-RN.B.3 rules) — rational + rational and rational × rational are always rational. Rational + irrational is ALWAYS irrational. Nonzero rational × irrational is always irrational — the word nonzero matters, since 0 · √2 = 0 is rational.` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'Signed adding', content: `SIGNED ADDING — same signs: add the absolute values and keep that sign, so −6 + (−5) = −11. Different signs: subtract the smaller absolute value from the larger and keep the sign of the larger, so −6 + 5 = −1.` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'Subtracting is adding the opposite', content: `SUBTRACTING IS ADDING THE OPPOSITE — rewrite every subtraction before you compute: 5 − (−3) becomes 5 + 3 = 8. Two negatives in a row is the single most-missed step.` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'Signed multiplying and dividing', content: `SIGNED MULTIPLYING AND DIVIDING — same signs give a positive, different signs give a negative: (−4)(−3) = 12 but (−4)(3) = −12. Watch the exponent gotcha: (−3)² = 9 while −3² = −9, because with no parentheses the square applies to the 3 and the minus stays outside.` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'Absolute value is distance from zero', content: `ABSOLUTE VALUE IS DISTANCE FROM ZERO — |−7| = 7 and |7| = 7, so it is never negative. The distance between two numbers a and b is |a − b|. A minus sign OUTSIDE the bars survives: −|7| = −7.` },
    { loId: 'alg1.real-numbers-operations', kind: 'framework', title: 'The three properties', content: `THE THREE PROPERTIES — commutative (a + b = b + a, ab = ba) and associative (regrouping) hold for addition and multiplication ONLY; 5 − 3 ≠ 3 − 5. Distributive is the bridge between them: a(b + c) = ab + ac, the move behind every expansion you will do this year.` },
    { loId: 'alg1.real-numbers-operations', kind: 'definition', title: 'rational number', content: `a number expressible as a/b with integers a and b, b ≠ 0 — its decimal terminates or repeats.` },
    { loId: 'alg1.real-numbers-operations', kind: 'definition', title: 'irrational number', content: 'a real number whose decimal never terminates and never repeats, such as √2 or π.' },
    { loId: 'alg1.real-numbers-operations', kind: 'definition', title: 'absolute value', content: `the distance of a number from 0 on the number line, written |x| and never negative.` },
  ],
  methods: [
    {
      title: 'Worked signed arithmetic',
      steps: [
        `Rewrite the subtraction as adding the opposite: − (−5) becomes + 5, giving −8 + 3 + 5 + |−4|.`,
        `Absolute value first: |−4| is the distance from 0, which is 4. Now the expression is −8 + 3 + 5 + 4.`,
        'Add the positives: 3 + 5 + 4 = 12.',
        `Combine with the negative: −8 + 12 = 4, since the signs differ we subtract 8 from 12 and keep the positive sign.`,
      ],
      example: { problem: 'Evaluate: −8 + 3 − (−5) + |−4|', solution: '4' },
      relatedLoIds: ['alg1.real-numbers-operations'],
    },
    {
      title: 'Worked classify edge case',
      steps: [
        `(a) √16 = 4 because 16 is a perfect square, so this is 0.75 + 4 = 4.75 — a terminating decimal, therefore RATIONAL. The root symbol did not make it irrational.`,
        `(b) 5 is not a perfect square, so √5 is irrational. Rational + irrational is always irrational, so 3 + √5 is IRRATIONAL. There is no way the endless non-repeating decimal cancels out.`,
        `(c) The edge case: √2 · √2 = 2, which is RATIONAL. Two irrationals multiplied can land back on a rational — the closure rules only promise things about rational + irrational and nonzero rational × irrational.`,
        `Takeaway: check whether the radicand is a perfect square first, then apply the closure rule that matches the operation.`,
      ],
      example: { problem: `Classify each result as rational or irrational: (a) 0.75 + √16, (b) 3 + √5, (c) √2 · √2`, solution: '(a) rational, (b) irrational, (c) rational' },
      relatedLoIds: ['alg1.real-numbers-operations'],
    },
  ],
  pointers: [
    { content: `Absolute value only acts on what is INSIDE the bars: |−6| = 6. The minus outside then applies to that result, so −|−6| = −6. Compare |−6| = 6 with −|−6| = −6 — the bars close before the outside sign gets its turn.`, kind: 'common-error' },
    { content: `Rationals are the fractions of integers — terminating or repeating decimals; irrationals like √2 and π are neither. Together they are the reals.`, kind: 'tip' },
    { content: `Rational + irrational is always irrational, and nonzero rational × irrational is always irrational — but irrational × irrational can be rational (√2 · √2 = 2).`, kind: 'tip' },
    { content: `Rewrite every subtraction as adding the opposite; same signs multiply to a positive, different signs to a negative, and (−3)² = 9 while −3² = −9.`, kind: 'tip' },
    { content: `|x| is distance from 0, so it is never negative, the gap between a and b is |a − b|, and a minus outside the bars survives: −|7| = −7.`, kind: 'tip' },
    { content: `Commutative and associative apply to + and × only; distributive, a(b + c) = ab + ac, is the property you will lean on all year.`, kind: 'tip' },
    { content: `A radical sign does **not** mean irrational. Check the radicand for a perfect square first: √9 = 3 and √16 = 4 are rational; √10 and √5 are irrational.`, kind: 'common-error' },
    { content: `Don't over-apply closure: irrational × irrational and irrational + irrational can be rational (√2 · √2 = 2, √3 + (−√3) = 0). The guaranteed rules are rational + irrational and *nonzero* rational × irrational.`, kind: 'edge-case' },
    { content: `Absolute value bars act only on what's INSIDE them. |−6| = 6, but −|−6| = −6 — the outside minus survives. Same with −|7| = −7.`, kind: 'gotcha' },
    { content: `(−3)² = 9 but −3² = −9. With no parentheses the exponent grabs only the 3 and the minus sign waits outside. Write parentheses when you mean the negative to be squared.`, kind: 'notation' },
    { content: `Rewrite subtraction as adding the opposite BEFORE computing: −6 − (−9) → −6 + 9 = 3. Two minus signs in a row is the most-missed step in signed arithmetic.`, kind: 'tip' },
    { content: `Distance between two numbers is |a − b| and is never negative. For −7 and 4: |−7 − 4| = 11, not 3. Subtract, then take absolute value — don't add the numbers' absolute values without thinking.`, kind: 'common-error' },
    { content: `Say "commutative" only for + and × — never for subtraction or division. 5 − 3 ≠ 3 − 5 and 8 ÷ 2 ≠ 2 ÷ 8. Also don't call regrouping parentheses 'commutative'; moving order = commutative, regrouping = associative.`, kind: 'vocab-note' },
    { content: `Every integer and every terminating or repeating decimal is rational — including 0, −5, and 0.333…. Write it as a/b (e.g. −5 = −5/1) if you're unsure. "Rational" doesn't mean "looks like a fraction."`, kind: 'gotcha' },
  ],
};
