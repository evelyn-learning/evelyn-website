/**
 * Digital SAT — Unit 2 CED 2.1: Equivalent Expressions: Factoring & Rational Exponents.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.equivalent-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_EQUIVALENT_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.equivalent-expressions.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.1',
  cedTitle: 'Equivalent Expressions: Factoring & Rational Exponents',
  planId: 'evelyn.testprep.dsat.equivalent-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.equivalent-expressions.v1' }],
  theory: [
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'The question format', content: `THE QUESTION FORMAT — "Which of the following is equivalent to ___?" There is nothing to solve for; you are rewriting one expression as another that means the same thing for every value of the variable.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Factoring toolkit', content: `FACTORING TOOLKIT — pull out the GCF first. Difference of squares: a² − b² = (a − b)(a + b). Trinomial x² + bx + c = (x + m)(x + n) where m·n = c and m + n = b. Non-monic or 4-term expressions: factor by grouping.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Trap', content: `TRAP — SUM OF SQUARES DOES NOT FACTOR. a² + b² has no real factorization. The SAT plants this as a distractor pattern that LOOKS like difference of squares.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Rational exponents', content: `RATIONAL EXPONENTS — x^(1/n) = ⁿ√x (nth root). x^(p/q) = (ⁿ√x)^p, i.e. the qth root raised to the p power. All the integer exponent rules (product, quotient, power-of-power) apply unchanged to fractional exponents.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Power-of-power on a coefficient', content: `POWER-OF-POWER ON A COEFFICIENT — (27x⁶)^(1/3) applies the (1/3) power to BOTH factors: 27^(1/3) = 3 and x^(6·1/3) = x². Forgetting to apply the exponent to the numeric coefficient is a very common miss.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Simplifying rational expressions', content: `SIMPLIFYING RATIONAL EXPRESSIONS — factor the numerator and denominator completely, then cancel COMMON FACTORS only. A factor is something multiplied; you can never cancel a term that is added or subtracted.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Trap', content: `TRAP — CANCELING TERMS INSTEAD OF FACTORS. (x + 5)/x is NOT 5 — the x in the numerator is added to 5, not multiplied, so nothing cancels. This is the single most common equivalent-expressions error.` },
    { loId: 'dsat.equivalent-expressions', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — plug a convenient test number (avoid 0 and 1) into the original expression and into each answer choice; the one that matches is equivalent. Fast and reliable when factoring stalls.` },
    { loId: 'dsat.equivalent-expressions', kind: 'definition', title: 'GCF (greatest common factor)', content: 'the largest expression that divides every term of a polynomial evenly.' },
    { loId: 'dsat.equivalent-expressions', kind: 'definition', title: 'rational exponent', content: `an exponent written as a fraction; x^(p/q) means the qth root of x, raised to the p power.` },
    { loId: 'dsat.equivalent-expressions', kind: 'definition', title: 'excluded value', content: `a value of the variable that makes a rational expression's denominator zero, so it is excluded from the domain.` },
    { loId: 'dsat.equivalent-expressions', kind: 'definition', title: 'difference of squares', content: `a² − b² = (a − b)(a + b); a factoring pattern that only applies to a MINUS between two perfect squares.` },
  ],
  methods: [
    {
      title: 'Worked rational expression',
      steps: [
        `Factor the numerator: x² + 5x + 6 = (x + 2)(x + 3), since 2 · 3 = 6 and 2 + 3 = 5.`,
        'Rewrite the fraction: (x + 2)(x + 3) / (x + 2).',
        `Cancel the common FACTOR (x + 2) from numerator and denominator — this is valid because it is multiplied, not added.`,
        `What remains is x + 3, for x ≠ −2 (the excluded value that would have made the original denominator zero).`,
      ],
      example: { problem: 'Which expression is equivalent to (x² + 5x + 6)/(x + 2)?', solution: 'x + 3 (x ≠ −2)' },
      relatedLoIds: ['dsat.equivalent-expressions'],
    },
    {
      title: 'Worked rational exponent',
      steps: [
        `The outer exponent (1/3) applies to EVERY factor inside the parentheses — both the 27 and the x⁶.`,
        '27^(1/3) is the cube root of 27, which is 3 (since 3³ = 27).',
        `(x⁶)^(1/3) uses the power-of-power rule: multiply exponents, 6 · (1/3) = 2, giving x².`,
        `Combine: 3x². (A common miss is leaving the 27 unresolved, or multiplying 6 by 3 instead of by 1/3.)`,
      ],
      example: { problem: 'Which expression is equivalent to (27x⁶)^(1/3)?', solution: '3x²' },
      relatedLoIds: ['dsat.equivalent-expressions'],
    },
  ],
  pointers: [
    { content: `The x in (x + 5) is ADDED to 5, not multiplied — it is a term, not a factor, so it cannot cancel. The expression is already fully simplified as (x + 5)/x (equivalently 1 + 5/x); nothing further reduces.`, kind: 'common-error' },
    { content: `Factor first: pull the GCF, then look for difference of squares or a trinomial pattern (m·n = c, m+n = b).`, kind: 'tip' },
    { content: `Sum of squares (a² + b²) never factors over the reals — a favorite SAT distractor shape.`, kind: 'tip' },
    { content: `Rational exponent x^(p/q) means the qth root of x raised to the p power; product/quotient/power rules apply exactly as with integer exponents, including to numeric coefficients.`, kind: 'tip' },
    { content: `Simplify rational expressions by factoring fully, then canceling common FACTORS only — never a term that is added or subtracted.`, kind: 'tip' },
    { content: `Sign check on trinomials: if the constant is NEGATIVE (x² − 4x − 12), your two numbers have OPPOSITE signs and the bigger one carries the sign of the middle term. Answer choices always include the sign-flipped twin, (x + 6)(x − 2). Multiply back mentally before bubbling.`, kind: 'gotcha' },
    { content: `Negative rational exponents mean RECIPROCAL, not negative value: x^(−1/2) = 1/√x, never −√x. Similarly (16)^(−3/4) = 1/8, a positive number. Handle the minus sign first (flip), then the fraction (root, then power).`, kind: 'common-error' },
    { content: `"Equivalent for all x where the expression is defined" is the SAT's hedge language — it tells you the excluded value is baked into the question, so a choice isn't wrong just because it drops the restriction. Pick the simplified factored form.`, kind: 'vocab-note' },
    { content: `Difference of squares needs BOTH pieces to be perfect squares AND a minus. 4x² − 9 factors; 4x² − 7 and 4x² + 9 do not. Also check higher powers: x⁴ − 16 = (x² − 4)(x² + 4), and the x² − 4 factors AGAIN. Don't stop at one round.`, kind: 'edge-case' },
    { content: `When you plug in a test number to compare choices, avoid 0, 1, and 2 — they make different expressions coincidentally match. Use something like x = 3 or x = 5, and check EVERY choice, not just until one hits.`, kind: 'tip' },
    { content: `In (5x + 10)/(x + 2), you can't cancel until you factor the numerator into 5(x + 2). Factoring is what CREATES the factor; don't scan for cancellation before both top and bottom are fully factored.`, kind: 'common-error' },
    { content: `Non-monic setups (3x² + kx − 20) often come as student-produced responses: expand the given factored form and read off the coefficient. Multiply the outer/inner terms — 15x and −4x give k = 11 — rather than re-factoring from scratch.`, kind: 'tip' },
    { content: `√(x²) = |x|, not always x, and (√x)² requires x ≥ 0. If a question involves even roots with variables, watch for absolute-value or 'x > 0' language in the stem that signals which simplification the test wants.`, kind: 'edge-case' },
  ],
};
