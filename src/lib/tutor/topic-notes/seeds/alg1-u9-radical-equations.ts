/**
 * Algebra 1 — Unit 9 CED 9.2: Radical Equations & Pythagorean Applications.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.radical-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U9_RADICAL_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.radical-equations.v1',
  course: 'Algebra 1',
  cedUnit: 9,
  cedTopic: '9.2',
  cedTitle: 'Radical Equations & Pythagorean Applications',
  planId: 'evelyn.hs.alg1.radical-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.radical-equations.v1' }],
  theory: [
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'The routine', content: `THE ROUTINE — 1) isolate the radical alone on one side, 2) square both sides to undo the root, 3) solve whatever equation is left, 4) CHECK every answer in the ORIGINAL equation.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'Isolate first', content: `ISOLATE FIRST — squaring only kills the root when the radical stands alone. (√x + 3)² is x + 6√x + 9, NOT x + 9; the root survives and you are worse off than when you started.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'Squaring is not a reversible move', content: `SQUARING IS NOT A REVERSIBLE MOVE — the statement x = −2 is false, but squaring it gives x² = 4, which x = −2 satisfies. Squaring can turn a false statement into a true one, so it can create answers out of nothing.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'Extraneous solution', content: `EXTRANEOUS SOLUTION — a value the squared equation accepts but the original equation rejects. It is not an arithmetic mistake; it is a side effect of squaring. Discard it. The check is the last step of the method, not optional.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'The principal root is never negative', content: `THE PRINCIPAL ROOT IS NEVER NEGATIVE — √(anything) = a negative number has NO solution. You can stop before squaring; squaring would hide the contradiction and hand you a fake answer.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'When squaring makes a quadratic', content: `WHEN SQUARING MAKES A QUADRATIC — √(x + 6) = x becomes x + 6 = x², i.e. x² − x − 6 = 0. Solve it the usual way, then test BOTH roots; typically one survives and one is extraneous.` },
    { loId: 'alg1.radical-equations', kind: 'framework', title: 'Pythagorean theorem', content: `PYTHAGOREAN THEOREM — the radical equation you will meet most: a² + b² = c². Missing hypotenuse: c = √(a² + b²). Missing leg: b = √(c² − a²). Lengths take the POSITIVE root only, so the ± never appears here.` },
    { loId: 'alg1.radical-equations', content: `LEG vs HYPOTENUSE — c is ALWAYS the hypotenuse, the longest side, across from the right angle. Adding the two given sides when one of them is the hypotenuse (so you should have subtracted) is the number-one error in these problems.` },
    { loId: 'alg1.radical-equations', kind: 'definition', title: 'radicand', content: 'the expression sitting under the radical sign — the x + 6 in √(x + 6).' },
    { loId: 'alg1.radical-equations', kind: 'definition', title: 'extraneous solution', content: `a value produced by squaring that fails the original equation and must be thrown out.` },
    { loId: 'alg1.radical-equations', kind: 'definition', title: 'hypotenuse', content: `the longest side of a right triangle, opposite the right angle — always c in a² + b² = c².` },
  ],
  methods: [
    {
      title: 'Worked isolate then square',
      steps: [
        'Isolate the radical: subtract 4 from both sides to get √(x − 3) = 5.',
        'Now the radical stands alone, so square both sides: x − 3 = 25.',
        'Solve the leftover linear equation: add 3 to both sides, x = 28.',
        `CHECK in the ORIGINAL: √(28 − 3) + 4 = √25 + 4 = 5 + 4 = 9. ✓ So x = 28 is a genuine solution.`,
      ],
      example: { problem: 'Solve: √(x − 3) + 4 = 9', solution: 'x = 28' },
      relatedLoIds: ['alg1.radical-equations'],
    },
    {
      title: 'Worked extraneous',
      steps: [
        'The radical is already alone, so square both sides: x + 6 = x².',
        `Move everything to one side: x² − x − 6 = 0, which factors as (x − 3)(x + 2) = 0, giving candidates x = 3 and x = −2.`,
        `CHECK x = 3 in the original: √(3 + 6) = √9 = 3, and the right side is 3. ✓ It works.`,
        `CHECK x = −2: √(−2 + 6) = √4 = 2, but the right side is −2. Since 2 ≠ −2, x = −2 is EXTRANEOUS — squaring invented it, and the check catches it.`,
        `Report only the survivor: x = 3. Skipping the check here would have doubled the answer set with a value that is simply not a solution.`,
      ],
      example: { problem: 'Solve: √(x + 6) = x', solution: 'x = 3 only (x = −2 is extraneous)' },
      relatedLoIds: ['alg1.radical-equations'],
    },
  ],
  pointers: [
    { content: `Isolate before squaring: √x = 4, then square to get x = 16. Check: √16 + 3 = 4 + 3 = 7 ✓. (For the record, (√x + 3)² = x + 6√x + 9, which still contains a radical — that is exactly why you isolate first.) And x = 40 fails the check: √40 + 3 ≈ 9.3, not 7.`, kind: 'common-error' },
    { content: `A principal square root is never negative, so √(x − 2) = −5 has NO solution — you can say that before squaring. And the check confirms it: √(27 − 2) = √25 = 5, not −5, so x = 27 is extraneous.`, kind: 'common-error' },
    { content: `The routine: isolate the radical, square both sides, solve, then CHECK in the original equation.`, kind: 'tip' },
    { content: `Squaring can invent solutions — any candidate that fails the original is EXTRANEOUS and gets discarded.`, kind: 'tip' },
    { content: 'Isolate before you square: (√x + 3)² = x + 6√x + 9, not x + 9.', kind: 'tip' },
    { content: `√(expression) = a negative number has no solution; the principal root is never negative.`, kind: 'tip' },
    { content: `Pythagorean: hypotenuse c = √(a² + b²), missing leg b = √(c² − a²) — positive root only, and c is always the longest side.`, kind: 'tip' },
    { content: `Isolate the radical BEFORE squaring. Squaring \`√x + 3 = 7\` term-by-term gives x + 9 = 49 — wrong. (√x + 3)² = x + 6√x + 9, so the root survives. Subtract first: √x = 4 → x = 16.`, kind: 'common-error' },
    { content: `The check is a STEP, not extra credit. Substitute every candidate into the ORIGINAL equation, not into the squared version — the squared equation accepts extraneous values by design.`, kind: 'gotcha' },
    { content: `Say "extraneous solution," not "wrong answer." An extraneous root isn't an arithmetic mistake — it's a side effect of squaring. Write "x = −2 is extraneous" rather than crossing it out silently.`, kind: 'vocab-note' },
    { content: `If a radical is set equal to a negative number, e.g. √(x − 2) = −5, stop: NO solution. A principal root is never negative. Squaring hides the contradiction and hands you a fake answer like x = 27.`, kind: 'edge-case' },
    { content: `When squaring produces a quadratic, test BOTH roots — don't assume the negative one dies and the positive one lives. Sometimes both survive, sometimes both fail. The check decides, not the sign.`, kind: 'gotcha' },
    { content: `In a² + b² = c², c is ALWAYS the hypotenuse (longest side, opposite the right angle). Given 17 and 8 with 17 as hypotenuse, compute √(17² − 8²) = 15 — subtract, don't add. Adding here is the #1 error.`, kind: 'common-error' },
    { content: `Sanity-check triangle answers: a leg must come out SHORTER than the hypotenuse. If your "leg" is longer than c, you added when you should have subtracted.`, kind: 'tip' },
    { content: `Side lengths use the positive root only — no ± in Pythagorean work. The ± belongs to solving x² = k in general, not to a length.`, kind: 'vocab-note' },
  ],
};
