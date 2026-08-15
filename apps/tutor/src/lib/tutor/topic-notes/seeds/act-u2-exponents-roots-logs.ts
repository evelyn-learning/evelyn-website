/**
 * ACT — Unit 2 CED 2.6: Exponents, Roots & Logarithms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.exponents-roots-logs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_EXPONENTS_ROOTS_LOGS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.exponents-roots-logs.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.6',
  cedTitle: 'Exponents, Roots & Logarithms',
  planId: 'evelyn.testprep.act.exponents-roots-logs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.exponents-roots-logs.v1' }],
  theory: [
    { loId: 'act.exponents-roots-logs', content: `EXPONENT RULES: aᵐ × aⁿ = a^(m+n); aᵐ ÷ aⁿ = a^(m−n); (aᵐ)ⁿ = a^(mn); a⁰ = 1; a^(−n) = 1/aⁿ.` },
    { loId: 'act.exponents-roots-logs', content: `FRACTIONAL EXPONENTS ARE ROOTS: a^(1/n) = ⁿ√a — e.g. a^(1/2) = √a, a^(1/3) = the cube root of a. The ACT tests this equivalence directly.` },
    { loId: 'act.exponents-roots-logs', content: `RADICAL RULES: √(a·b) = √a · √b and √(a/b) = √a / √b — but radicals do NOT distribute over addition or subtraction: √(a+b) ≠ √a + √b.` },
    { loId: 'act.exponents-roots-logs', content: `SIMPLIFYING RADICALS: pull out perfect-square factors, e.g. √72 = √(36·2) = √36 · √2 = 6√2.` },
    { loId: 'act.exponents-roots-logs', content: `RATIONALIZING DENOMINATORS: no radical should be left on the bottom of a fraction — multiply top and bottom by that radical, e.g. 1/√2 = √2/2.` },
    { loId: 'act.exponents-roots-logs', kind: 'framework', title: 'Logs are inverse exponents', content: `LOGS ARE INVERSE EXPONENTS — CHANGE OF FORM: log_b(x) = y means "b raised to the y equals x." So log_b(x) = y ↔ b^y = x. This is the ACT log skill: move fluently between the two forms.` },
    { loId: 'act.exponents-roots-logs', content: `LOG DOMAIN TRAP: log_b(x) is only defined for x > 0 and b > 0, b ≠ 1. Trap choices sometimes offer a value of x that is zero or negative — it can never be the answer to a log equation.` },
    { loId: 'act.exponents-roots-logs', content: `NEGATIVE-EXPONENT TRAP: a negative exponent means "take the reciprocal," NOT "make the value negative." 2^(−3) = 1/8, not −8.` },
    { loId: 'act.exponents-roots-logs', kind: 'definition', title: 'logarithm', content: `the exponent you must raise a fixed base to, to produce a given number; log_b(x) is that exponent.` },
    { loId: 'act.exponents-roots-logs', kind: 'definition', title: 'base', content: `in log_b(x) or bˣ, the number b being raised to a power (for logs, must be positive and ≠ 1).` },
    { loId: 'act.exponents-roots-logs', kind: 'definition', title: 'radical', content: `the root symbol √; √a is the non-negative number that, multiplied by itself, gives a.` },
    { loId: 'act.exponents-roots-logs', kind: 'definition', title: 'rationalize', content: 'rewrite a fraction so no radical remains in the denominator.' },
  ],
  methods: [
    {
      title: 'Worked exponent rules',
      steps: [
        'Apply the power rule first: (x³)⁴ = x^(3×4) = x¹².',
        'Apply the product rule: x¹² · x² = x^(12+2) = x¹⁴.',
        'Apply the quotient rule: x¹⁴ / x⁵ = x^(14−5) = x⁹.',
      ],
      example: { problem: 'Simplify: (x³)⁴ · x² / x⁵', solution: 'x⁹' },
      relatedLoIds: ['act.exponents-roots-logs'],
    },
    {
      title: 'Worked log trap',
      steps: [
        `Rewrite in exponential form using log_b(x) = y ↔ b^y = x. Here b = 2, y = −3, so x = 2^(−3).`,
        `TRAP: a negative exponent does NOT make the value negative — students who write x = −8 are treating the sign of the exponent as the sign of the answer. That's wrong.`,
        'Correctly, 2^(−3) means the reciprocal of 2³: x = 1/2³ = 1/8.',
      ],
      example: { problem: 'If log₂(x) = −3, what is x?', solution: 'x = 1/8' },
      relatedLoIds: ['act.exponents-roots-logs'],
    },
  ],
  pointers: [
    { content: `Add inside the radical FIRST, then take the root: √(9+16) = √25 = 5. Radicals only distribute over multiplication and division — √(a·b) = √a · √b — never over addition or subtraction.`, kind: 'common-error' },
    { content: `log_b(x) = y is just another way of writing b^y = x — the ACT tests moving between these forms directly.`, kind: 'tip' },
    { content: `Exponent rules: same base multiplying → add exponents; power of a power → multiply exponents; negative exponent → reciprocal, not a negative value.`, kind: 'tip' },
    { content: `Radicals distribute over multiplication/division only — never over addition or subtraction: √(a+b) ≠ √a + √b.`, kind: 'tip' },
    { content: `ACT Math gives ~67 seconds per question — spot which rule applies before reaching for the calculator.`, kind: 'tip' },
    { content: `Exponent rules only apply with the SAME base. For 2³ · 4² the ACT wants you to rewrite 4² as (2²)² = 2⁴ first, then add: 2⁷. Adding exponents across different bases (getting "8⁵") is a top wrong-answer choice.`, kind: 'gotcha' },
    { content: `Read a^(m/n) as "nth root of a, then mth power." So 8^(2/3) = (∛8)² = 4 — NOT 8²/3 and not 8·(2/3). Denominator = root, numerator = power. Roots first keeps the arithmetic small.`, kind: 'common-error' },
    { content: `Watch coefficient vs. exponent: (3x²)³ = 27x⁶, not 3x⁶. The outside exponent hits EVERY factor inside the parentheses, including the number. Same for (2x)⁻¹ = 1/(2x), not 2/x.`, kind: 'common-error' },
    { content: `A negative exponent flips only the factor it's attached to. x⁻²y³ = y³/x², and (1/x)⁻² = x². Don't invert the whole fraction unless the exponent sits on the whole parenthesized fraction.`, kind: 'edge-case' },
    { content: `Simplify radicals to the END, not partway. √48 = 4√3, not 2√12 — check whether the leftover under the radical still has a perfect-square factor. ACT answer choices include the half-simplified version.`, kind: 'gotcha' },
    { content: `Rationalizing with a two-term denominator needs the CONJUGATE: for 1/(3+√2), multiply by (3−√2)/(3−√2), giving (3−√2)/7. Multiplying by √2/√2 leaves a radical on the bottom.`, kind: 'edge-case' },
    { content: `If an exponent equation has the same base on both sides, drop the bases and set exponents equal: 3^(2x) = 3^(x+4) → 2x = x+4 → x = 4. No logs or calculator needed — rewrite mixed bases (9, 27) as powers of 3 first.`, kind: 'tip' },
    { content: `After solving any log equation, plug back in: the argument must be > 0. In log(x−3) = 1, x = 13 works but a factoring problem yielding x = 1 is extraneous. "No solution" and negative-argument choices are planted traps.`, kind: 'gotcha' },
  ],
};
