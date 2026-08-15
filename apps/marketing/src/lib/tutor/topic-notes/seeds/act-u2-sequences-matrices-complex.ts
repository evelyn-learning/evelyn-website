/**
 * ACT — Unit 2 CED 2.11: Sequences, Matrices & Complex Numbers.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.sequences-matrices-complex.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_SEQUENCES_MATRICES_COMPLEX: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.sequences-matrices-complex.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.11',
  cedTitle: 'Sequences, Matrices & Complex Numbers',
  planId: 'evelyn.testprep.act.sequences-matrices-complex.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.sequences-matrices-complex.v1' }],
  theory: [
    { loId: 'act.sequences-matrices-complex', content: `ARITHMETIC SEQUENCES: each term adds a fixed common difference d. Formula: a_n = a_1 + (n − 1)d.` },
    { loId: 'act.sequences-matrices-complex', content: `GEOMETRIC SEQUENCES: each term is multiplied by a fixed common ratio r. Formula: a_n = a_1 · r^(n − 1).` },
    { loId: 'act.sequences-matrices-complex', kind: 'framework', title: 'Trap', content: `TRAP — OFF-BY-ONE: the exponent/multiplier is (n − 1), never n. The "5th term" has only 4 differences or ratios applied. When in doubt, list the first few terms by hand — it's slower per term but safer under pressure.` },
    { loId: 'act.sequences-matrices-complex', content: `2×2 MATRIX ADDITION/SUBTRACTION: combine corresponding entries only — same position, same operation. Matrices must be the same size.` },
    { loId: 'act.sequences-matrices-complex', content: `SCALAR MULTIPLICATION: multiply EVERY entry by the scalar, not just one row or one entry.` },
    { loId: 'act.sequences-matrices-complex', kind: 'framework', title: 'Trap', content: `TRAP — PARTIAL SCALING: applying the scalar to only one row, or scaling after adding instead of before. 2A + B is NOT the same as 2(A + B).` },
    { loId: 'act.sequences-matrices-complex', content: `i² = −1 is the entire content of "imaginary numbers" on the ACT. Treat i like a variable — FOIL/distribute normally — then substitute i² = −1 at the very end.` },
    { loId: 'act.sequences-matrices-complex', kind: 'framework', title: 'Trap', content: `TRAP — SIGN FLIP: a term like −8i² becomes +8, not −8, once you substitute. This sign flip is the single most common complex-number error on the ACT.` },
    { loId: 'act.sequences-matrices-complex', kind: 'definition', title: 'common difference', content: 'the fixed amount added each step in an arithmetic sequence (d).' },
    { loId: 'act.sequences-matrices-complex', kind: 'definition', title: 'common ratio', content: 'the fixed amount each term is multiplied by in a geometric sequence (r).' },
    { loId: 'act.sequences-matrices-complex', kind: 'definition', title: 'imaginary unit', content: `i, defined by i² = −1; treated as a variable until the final simplification step.` },
    { loId: 'act.sequences-matrices-complex', kind: 'definition', title: 'scalar', content: 'a single number that multiplies every entry of a matrix.' },
  ],
  methods: [
    {
      title: 'Worked arithmetic sequence',
      steps: [
        'Identify the pieces: a_1 = 7, d = 4, n = 10.',
        'Apply the formula: a_n = a_1 + (n − 1)d.',
        'Compute the exponent term first: n − 1 = 9, so a_10 = 7 + 9(4).',
        '9 × 4 = 36, so a_10 = 7 + 36 = 43.',
      ],
      example: { problem: `An arithmetic sequence has a first term of 7 and a common difference of 4. What is the 10th term?`, solution: '43' },
      relatedLoIds: ['act.sequences-matrices-complex'],
    },
    {
      title: 'Worked complex multiplication trap',
      steps: [
        'FOIL it exactly like a binomial: (3)(1) + (3)(−4i) + (2i)(1) + (2i)(−4i).',
        'Multiply each piece: 3 − 12i + 2i − 8i².',
        `Combine the imaginary terms first, leaving the i² term alone for now: 3 − 10i − 8i².`,
        'TRAP: substitute i² = −1 carefully — −8i² becomes −8(−1) = +8, not −8.',
        'Combine real parts: 3 + 8 = 11, so the answer is 11 − 10i.',
      ],
      example: { problem: 'Simplify (3 + 2i)(1 − 4i).', solution: '11 - 10i' },
      relatedLoIds: ['act.sequences-matrices-complex'],
    },
  ],
  pointers: [
    { content: 'Multiply EVERY entry by the scalar: Row 1: 3, 6 — Row 2: 9, 12.', kind: 'common-error' },
    { content: `a_n = a_1 + (n − 1)d for arithmetic sequences; a_n = a_1 · r^(n − 1) for geometric — always (n − 1), never n.`, kind: 'tip' },
    { content: `Add/subtract matrices entry-by-entry; scalar multiplication scales EVERY entry, and scaling happens before adding.`, kind: 'tip' },
    { content: `i² = −1 — treat i like a variable, FOIL normally, then substitute at the very end and watch the sign flip.`, kind: 'tip' },
    { content: `These grab-bag topics are fast, guaranteed points once you know the formula — don't let unfamiliarity cost you time.`, kind: 'tip' },
    { content: `"Common difference" means SUBTRACT consecutive terms (a₂ − a₁), "common ratio" means DIVIDE (a₂ ÷ a₁). When a problem hands you a list like 3, 12, 48, test both: if subtracting gives inconsistent gaps but dividing gives a constant, it's geometric.`, kind: 'vocab-note' },
    { content: `Watch for questions that give you a non-first term: "the 3rd term is 10 and the 7th term is 26." There are 4 steps between them, not 7 — so 4d = 16, d = 4. Back up to a₁ only if the question asks for it.`, kind: 'gotcha' },
    { content: `Negative or fractional r flips things: r = −2 makes terms alternate sign, and r = 1/2 makes them shrink. Check the sign of your answer against whether n−1 is even or odd before picking a choice.`, kind: 'edge-case' },
    { content: `Powers of i cycle every 4: i¹=i, i²=−1, i³=−i, i⁴=1. For i²⁷ or similar, divide the exponent by 4 and use the remainder. Don't try to write out 27 multiplications.`, kind: 'tip' },
    { content: `In (a + bi)(a − bi), the i² term makes the answer purely real: (3+2i)(3−2i) = 9 + 4 = 13, not 9 − 4. Conjugate pairs ADD the squares because −(−1) flips the sign.`, kind: 'common-error' },
    { content: `Answer choices for complex problems come in a + bi form. If you end with something like 11 − 10i, confirm the real part is real and the i coefficient is separate — mixing the +8 from −8i² into the imaginary part is the classic wrong answer.`, kind: 'gotcha' },
    { content: `Matrix answer choices differ by a single entry. After computing 2A + B, spot-check one entry the choices disagree on rather than recomputing all four — usually a bottom-right or a negative entry.`, kind: 'tip' },
    { content: `Sequence questions sometimes ask for the SUM of the first n terms or "how many terms until the value exceeds X" — not the nth term. Reread the stem; a_n alone won't answer it.`, kind: 'common-error' },
  ],
};
