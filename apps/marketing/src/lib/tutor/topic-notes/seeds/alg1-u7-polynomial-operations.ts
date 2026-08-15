/**
 * Algebra 1 — Unit 7 CED 7.1: Adding, Subtracting & Multiplying Polynomials.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.polynomial-operations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U7_POLYNOMIAL_OPERATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.polynomial-operations.v1',
  course: 'Algebra 1',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Adding, Subtracting & Multiplying Polynomials',
  planId: 'evelyn.hs.alg1.polynomial-operations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.polynomial-operations.v1' }],
  theory: [
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'What counts', content: `WHAT COUNTS — a POLYNOMIAL is a sum of terms, each a number times a variable raised to a WHOLE-NUMBER power: 3x² + 2x − 5. Not polynomials: 1/x, √x, x^(−2) — variables cannot sit in a denominator, under a root, or carry a negative or fractional exponent.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Naming the parts', content: `NAMING THE PARTS — the DEGREE of a term is its exponent (3x² has degree 2; the constant 5 has degree 0); the DEGREE of the polynomial is the highest term degree; the LEADING COEFFICIENT is the number on that highest-degree term. By term count: 1 = monomial, 2 = binomial, 3 = trinomial.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Standard form', content: `STANDARD FORM — write terms in order of DECREASING degree: 2x − 5 + 3x² becomes 3x² + 2x − 5. Always land your final answer here.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Add', content: `ADD — combine LIKE terms only, meaning same variable AND same exponent. 3x² + 4x² = 7x². But 3x² + 4x cannot combine and just stays as 3x² + 4x.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Subtract', content: `SUBTRACT — THE #1 TRAP: the minus sign belongs to EVERY term in the second polynomial, not just the first. (5x² − 3x + 8) − (2x² + 7x − 4) = 5x² − 3x + 8 − 2x² − 7x + 4. Safest habit: rewrite subtraction as "add the opposite" and flip all the signs before you combine anything.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Multiply', content: `MULTIPLY — every term in the first polynomial hits every term in the second. Multiply the coefficients, ADD the exponents: 3x(2x² − 5x + 4) = 6x³ − 15x² + 12x.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'FOIL is just double distribution', content: `FOIL IS JUST DOUBLE DISTRIBUTION — (x + 2)(x + 5) = x(x + 5) + 2(x + 5) = x² + 5x + 2x + 10 = x² + 7x + 10. First, Outer, Inner, Last is a bookkeeping name for those four products; for anything bigger than 2 by 2, use a row-by-column grid so nothing is missed.` },
    { loId: 'alg1.polynomial-operations', kind: 'framework', title: 'Closure', content: `CLOSURE — add, subtract, or multiply two polynomials and you always get another polynomial, exactly like integers under +, −, and ×. Division is the exception: x / (x + 1) is not a polynomial.` },
    { loId: 'alg1.polynomial-operations', kind: 'definition', title: 'like terms', content: `terms with the same variable raised to the same exponent — only these can be combined.` },
    { loId: 'alg1.polynomial-operations', kind: 'definition', title: 'standard form', content: 'a polynomial written with its terms in decreasing order of degree.' },
    { loId: 'alg1.polynomial-operations', kind: 'definition', title: 'closure', content: 'a set is closed under an operation when the result always stays inside the set.' },
  ],
  methods: [
    {
      title: 'Worked FOIL',
      steps: [
        `First: 2x × 3x = 6x² — multiply coefficients (2 × 3 = 6), add exponents (1 + 1 = 2).`,
        'Outer: 2x × (−4) = −8x.',
        'Inner: 5 × 3x = 15x.',
        'Last: 5 × (−4) = −20.',
        `Collect the two like middle terms: −8x + 15x = 7x, so the product is 6x² + 7x − 20.`,
        'Check with x = 1: (2 + 5)(3 − 4) = 7 × (−1) = −7, and 6 + 7 − 20 = −7. ✓',
      ],
      example: { problem: 'Multiply: (2x + 5)(3x − 4)', solution: '6x² + 7x − 20' },
      relatedLoIds: ['alg1.polynomial-operations'],
    },
    {
      title: 'Worked subtract minus trap',
      steps: [
        `Rewrite as adding the opposite — the minus flips the sign of ALL THREE terms in the second group: 5x² − 3x + 8 − 2x² − 7x + 4.`,
        `Notice the last term became +4, not −4. Flipping only the first term is the classic error here.`,
        'Combine x² terms: 5x² − 2x² = 3x².',
        'Combine x terms: −3x − 7x = −10x.',
        'Combine constants: 8 + 4 = 12.',
        `Standard form: 3x² − 10x + 12. Check with x = 1: (5 − 3 + 8) − (2 + 7 − 4) = 10 − 5 = 5, and 3 − 10 + 12 = 5. ✓`,
      ],
      example: { problem: 'Simplify: (5x² − 3x + 8) − (2x² + 7x − 4)', solution: '3x² − 10x + 12' },
      relatedLoIds: ['alg1.polynomial-operations'],
    },
  ],
  pointers: [
    { content: `3x² and 4x are not like terms (different exponents), so nothing combines: the answer is just 3x² + 4x. Exponents get ADDED only when you MULTIPLY: (3x²)(4x) = 12x³. Adding leaves exponents alone.`, kind: 'common-error' },
    { content: 'Degree = highest exponent; standard form = terms in decreasing degree.', kind: 'tip' },
    { content: 'Add or subtract by combining LIKE terms only — same variable, same exponent.', kind: 'tip' },
    { content: `Subtraction distributes the minus to EVERY term: −(2x² + 7x − 4) = −2x² − 7x + 4.`, kind: 'tip' },
    { content: `Multiply every term by every term; multiply coefficients, add exponents. FOIL is just double distribution.`, kind: 'tip' },
    { content: `Polynomials are closed under +, −, and × — the answer is always another polynomial.`, kind: 'tip' },
    { content: `When subtracting, put the second polynomial in parentheses and flip **every** sign before combining: \`−(2x² + 7x − 4) = −2x² − 7x + 4\`. If your last term's sign didn't change, you distributed the minus to only one term.`, kind: 'common-error' },
    { content: `Adding never touches exponents. \`3x² + 4x\` stays \`3x² + 4x\` (not 7x³). Exponents add only when you MULTIPLY: \`(3x²)(4x) = 12x³\`.`, kind: 'common-error' },
    { content: `"Like terms" means same variable AND same exponent — not just "both have an x." \`5x²\` and \`5x\` are unlike; \`−3x\` and \`7x\` are like. Circle matching powers before you combine.`, kind: 'vocab-note' },
    { content: `Degree of a term = its exponent, not its coefficient. In \`−9x³ + 4x⁵\`, the degree is 5 and the leading coefficient is 4 — reorder to standard form first, or you'll name the wrong leading coefficient.`, kind: 'gotcha' },
    { content: `In a binomial product, the two middle terms are usually the only ones that combine — don't stop at four terms. \`(2x+5)(3x−4)\` gives \`6x² − 8x + 15x − 20\`, so \`−8x + 15x = 7x\`.`, kind: 'common-error' },
    { content: `FOIL only works for binomial × binomial. For \`(x+2)(x²−3x+1)\` or a trinomial times a trinomial, use a grid or distribute row by row so no product goes missing.`, kind: 'edge-case' },
    { content: `Test your answer by plugging in x = 1 (or x = 2): the original expression and your simplified answer must give the same number. Fast catch for a dropped sign or a missed term.`, kind: 'tip' },
    { content: `\`1/x\`, \`√x\`, and \`x^(−2)\` are NOT polynomials — variables can't sit in a denominator, under a root, or carry negative/fractional exponents. That's also why division breaks closure: \`x/(x+1)\` isn't a polynomial.`, kind: 'vocab-note' },
  ],
};
