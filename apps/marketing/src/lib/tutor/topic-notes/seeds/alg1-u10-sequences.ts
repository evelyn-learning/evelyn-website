/**
 * Algebra 1 — Unit 10 CED 10.3: Arithmetic & Geometric Sequences.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.sequences.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U10_SEQUENCES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.sequences.v1',
  course: 'Algebra 1',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Arithmetic & Geometric Sequences',
  planId: 'evelyn.hs.alg1.sequences.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.sequences.v1' }],
  theory: [
    { loId: 'alg1.sequences', content: `A SEQUENCE is an ordered list of numbers. Term 1 is a₁, term 2 is a₂, and the term in position n is aₙ. The position n is always a counting number: 1, 2, 3, ...` },
    { loId: 'alg1.sequences', kind: 'framework', title: 'Arithmetic', content: `ARITHMETIC — you ADD the same number every step. That number is the common difference d, and you find it by subtracting: d = a₂ − a₁ (later term minus earlier term, so d can be negative).` },
    { loId: 'alg1.sequences', kind: 'framework', title: 'Geometric', content: `GEOMETRIC — you MULTIPLY by the same number every step. That number is the common ratio r, and you find it by dividing: r = a₂ ÷ a₁.` },
    { loId: 'alg1.sequences', kind: 'framework', title: 'Test which one', content: `TEST WHICH ONE — check consecutive differences AND consecutive ratios. Constant difference → arithmetic. Constant ratio → geometric. Neither constant → it is some other pattern.` },
    { loId: 'alg1.sequences', content: `RECURSIVE FORMULA says how to get the NEXT term from the one before: arithmetic is a₁ = (start), aₙ = aₙ₋₁ + d; geometric is a₁ = (start), aₙ = r · aₙ₋₁. Great for the next term, terrible for the 50th.` },
    { loId: 'alg1.sequences', content: `EXPLICIT FORMULA jumps straight to any term: arithmetic is aₙ = a₁ + (n − 1)d; geometric is aₙ = a₁ · rⁿ⁻¹.` },
    { loId: 'alg1.sequences', content: `WHY n − 1 — you are already standing on a₁, so getting to term n costs only n − 1 steps. Reaching a₅ takes 4 additions, not 5. Using n instead of n − 1 is the single most common error in this whole topic.` },
    { loId: 'alg1.sequences', content: `SEQUENCES ARE FUNCTIONS of the position n. Arithmetic is LINEAR: aₙ = a₁ + (n − 1)d rewrites as aₙ = dn + (a₁ − d), so d is the slope. Geometric is EXPONENTIAL: r is the base, so r > 1 grows and 0 < r < 1 decays.` },
    { loId: 'alg1.sequences', kind: 'definition', title: 'common difference (d)', content: 'the fixed amount added each step in an arithmetic sequence.' },
    { loId: 'alg1.sequences', kind: 'definition', title: 'common ratio (r)', content: 'the fixed multiplier applied each step in a geometric sequence.' },
    { loId: 'alg1.sequences', kind: 'definition', title: 'explicit formula', content: 'a rule that gives aₙ directly from the position n, with no earlier terms needed.' },
  ],
  methods: [
    {
      title: 'Worked arithmetic explicit',
      steps: [
        `Check the type: 11 − 4 = 7, 18 − 11 = 7, 25 − 18 = 7. The difference is constant, so it is arithmetic with d = 7 and a₁ = 4.`,
        'Plug into aₙ = a₁ + (n − 1)d: aₙ = 4 + (n − 1)(7).',
        `Simplify if you like: aₙ = 4 + 7n − 7 = 7n − 3. This is a line with slope 7 — the common difference IS the slope.`,
        `Find a₂₀: 4 + (20 − 1)(7) = 4 + (19)(7) = 4 + 133 = 137. Check with the simplified form: 7(20) − 3 = 140 − 3 = 137. ✓`,
      ],
      example: { problem: `For the sequence 4, 11, 18, 25, ... write the explicit formula and find the 20th term.`, solution: 'aₙ = 4 + (n − 1)(7) = 7n − 3, and a₂₀ = 137' },
      relatedLoIds: ['alg1.sequences'],
    },
    {
      title: 'Worked geometric offbyone',
      steps: [
        `Check the type: 15 ÷ 5 = 3, 45 ÷ 15 = 3, 135 ÷ 45 = 3. Constant ratio, so it is geometric with a₁ = 5 and r = 3.`,
        'Explicit formula: aₙ = a₁ · rⁿ⁻¹ = 5 · 3ⁿ⁻¹.',
        `THE TRAP: writing a₇ = 5 · 3⁷ = 5 · 2187 = 10935. That answer is one whole step too far along the sequence.`,
        'Do it right: a₇ = 5 · 3⁷⁻¹ = 5 · 3⁶ = 5 · 729 = 3645.',
        `Sanity-check by listing: 5, 15, 45, 135, 405, 1215, 3645 — the 7th number is 3645. ✓ Notice 10935 is the 8th term, exactly one position past where you wanted to stop.`,
      ],
      example: { problem: 'For the sequence 5, 15, 45, 135, ... find the 7th term — and watch the exponent.', solution: 'a₇ = 5 · 3⁶ = 3645' },
      relatedLoIds: ['alg1.sequences'],
    },
  ],
  pointers: [
    { content: `d = a₂ − a₁ = 17 − 20 = −3. The correct formula is aₙ = 20 + (n − 1)(−3) = 23 − 3n. Check n = 4: 23 − 12 = 11 ✓. The student formula would give 29 at n = 4, growing when the sequence is clearly shrinking.`, kind: 'common-error' },
    { content: `The differences 2, 4, 8 are not constant, but the ratios 4÷2 = 2, 8÷4 = 2, 16÷8 = 2 are. It is geometric with r = 2, so aₙ = 2 · 2ⁿ⁻¹.`, kind: 'common-error' },
    { content: `Constant DIFFERENCE → arithmetic (d = a₂ − a₁, and it can be negative). Constant RATIO → geometric (r = a₂ ÷ a₁).`, kind: 'tip' },
    { content: 'Explicit: aₙ = a₁ + (n − 1)d for arithmetic, aₙ = a₁ · rⁿ⁻¹ for geometric.', kind: 'tip' },
    { content: `The n − 1 is not optional — you start ON a₁, so reaching term n takes only n − 1 steps.`, kind: 'tip' },
    { content: `Recursive tells you the next term from the last one; explicit jumps straight to any term.`, kind: 'tip' },
    { content: `Arithmetic sequences are linear functions of n (d is the slope); geometric sequences are exponential functions of n (r is the base).`, kind: 'tip' },
    { content: `The exponent and multiplier are always **n − 1**, never n. Reaching a₇ takes 6 steps because you start standing on a₁. If your answer is exactly one step too big (or a factor of r too big), you dropped the −1.`, kind: 'common-error' },
    { content: `Compute d as *later minus earlier*: d = a₂ − a₁. For 20, 17, 14, ... that's 17 − 20 = **−3**, not 3. A positive d with a shrinking list is an instant red flag.`, kind: 'common-error' },
    { content: `"The gaps follow a pattern" is NOT arithmetic. 2, 4, 8, 16 has growing gaps (2, 4, 8) — arithmetic demands the differences be **identical**. Check ratios too before naming the type.`, kind: 'vocab-note' },
    { content: `Test BOTH differences and ratios before committing. Some sequences (1, 4, 9, 16, ... or 1, 1, 2, 3, 5, ...) are neither arithmetic nor geometric — "neither" is a legitimate answer.`, kind: 'edge-case' },
    { content: `Recursive formulas need TWO lines: the seed a₁ = (start) AND the rule aₙ = aₙ₋₁ + d. Writing only "aₙ = aₙ₋₁ + 4" defines infinitely many sequences, not one.`, kind: 'gotcha' },
    { content: `Don't mix the notations: aₙ₋₁ means the *previous term*, while (n − 1) is a *number* multiplied or used as an exponent. "aₙ = a₁ · rⁿ⁻¹" is explicit; "aₙ = r · aₙ₋₁" is recursive.`, kind: 'vocab-note' },
    { content: `When simplifying arithmetic to aₙ = dn + (a₁ − d), the y-intercept is **not** a₁. For 4, 11, 18, ... you get 7n − 3, and −3 is a₀ — a term that doesn't exist since n starts at 1.`, kind: 'gotcha' },
    { content: `Quick self-check: after finding a formula, plug in n = 1 and n = 3 and compare to the listed terms. Or just list terms out to your target position — for small n, listing beats formula errors every time.`, kind: 'tip' },
  ],
};
