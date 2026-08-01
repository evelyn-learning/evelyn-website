/**
 * Algebra 1 — Unit 3 CED 3.1: Solving & Graphing One-Variable Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.one-variable-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U3_ONE_VARIABLE_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.one-variable-inequalities.v1',
  course: 'Algebra 1',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Solving & Graphing One-Variable Inequalities',
  planId: 'evelyn.hs.alg1.one-variable-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.one-variable-inequalities.v1' }],
  theory: [
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'Same routine as equations', content: `SAME ROUTINE AS EQUATIONS — distribute, collect like terms, undo addition/subtraction, then divide by the coefficient. Whatever you do to one side you do to the other.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'The flip rule', content: `THE FLIP RULE — multiplying OR dividing both sides by a NEGATIVE number reverses the inequality symbol: −3x > 15 becomes x < −5, not x > −5.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'Why it flips', content: `WHY IT FLIPS — start with a true statement, 5 > 3. Multiply both sides by −1: −5 and −3. But −5 is LESS than −3, so the symbol must reverse to keep the statement true.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'When not to flip', content: `WHEN NOT TO FLIP — adding or subtracting anything (even a negative number) never flips. Multiplying or dividing by a POSITIVE never flips. Only a negative multiplier or divisor does.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'Number-line graph', content: `NUMBER-LINE GRAPH — put the boundary value on the line, then shade every value that works.` },
    { loId: 'alg1.one-variable-inequalities', content: `OPEN vs CLOSED CIRCLE — strict symbols (< or >) get an OPEN circle: the boundary itself is not a solution. Inclusive symbols (≤ or ≥) get a CLOSED, filled circle: the boundary IS a solution.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'Which way to shade', content: `WHICH WAY TO SHADE — read the FINAL line with x on the left. x < 5 shades left (toward smaller numbers); x > 5 shades right. Do not read the direction off the original problem — it may have flipped along the way.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'framework', title: 'Always sense-check', content: `ALWAYS SENSE-CHECK — pick one number inside your shaded region and one outside, and substitute both into the ORIGINAL inequality. The inside number must make it true and the outside number must make it false.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'definition', title: 'solution set', content: `every value of the variable that makes the inequality true — usually infinitely many.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'definition', title: 'boundary value', content: `the number where the solution set starts or stops; included for ≤ and ≥, excluded for < and >.` },
    { loId: 'alg1.one-variable-inequalities', kind: 'definition', title: 'strict inequality', content: `one using < or > only, so the boundary value itself does not count as a solution.` },
  ],
  methods: [
    {
      title: 'Worked no flip',
      steps: [
        'Subtract 9 from both sides: 4x ≤ 24. (Subtraction never flips the symbol.)',
        'Divide both sides by 4 — positive, so no flip: x ≤ 6.',
        `Graph: CLOSED circle at 6 because ≤ includes the boundary, shaded LEFT toward smaller numbers.`,
        `Sense-check inside: x = 6 → 4(6) + 9 = 33 ≤ 33 ✓. Outside: x = 7 → 37 ≤ 33 is false ✓.`,
      ],
      example: { problem: 'Solve and graph: 4x + 9 ≤ 33', solution: 'x ≤ 6 (closed circle at 6, shaded left)' },
      relatedLoIds: ['alg1.one-variable-inequalities'],
    },
    {
      title: 'Worked flip',
      steps: [
        `Subtract 7 from both sides: −3x > 15. Still >, because subtracting does not flip.`,
        `Now divide both sides by −3. THIS is the flip step: the symbol reverses from > to <.`,
        '15 ÷ (−3) = −5, so x < −5.',
        `Graph: OPEN circle at −5 because > is strict, shaded LEFT — read the direction off the final line x < −5, not off the original >.`,
        `Sense-check inside: x = −6 → 7 − 3(−6) = 7 + 18 = 25 > 22 ✓. Outside: x = 0 → 7 > 22 is false ✓.`,
      ],
      example: { problem: 'Solve and graph: 7 − 3x > 22', solution: 'x < −5 (open circle at −5, shaded left)' },
      relatedLoIds: ['alg1.one-variable-inequalities'],
    },
  ],
  pointers: [
    { content: `Dividing by a NEGATIVE reverses the symbol: −5x < −10 gives x > 2. Check the student answer x = 1: 12 − 5(1) = 7, and 7 < 2 is false, so x = 1 is not a solution. Check x = 3: 12 − 15 = −3 < 2 ✓.`, kind: 'common-error' },
    { content: `Subtracting 12 from both sides is addition/subtraction, so nothing flips: 12 − 5x < 2 becomes −5x < −10 with the symbol unchanged. The flip happens only at the divide-by-−5 step.`, kind: 'common-error' },
    { content: 'Solve an inequality exactly like an equation — same move on both sides.', kind: 'tip' },
    { content: `THE FLIP RULE: multiplying or dividing both sides by a NEGATIVE reverses the symbol. Nothing else does.`, kind: 'tip' },
    { content: 'Open circle for < and >; closed, filled circle for ≤ and ≥.', kind: 'tip' },
    { content: `Shade based on the FINAL line with x isolated on the left, not the symbol in the original problem.`, kind: 'tip' },
    { content: 'Sense-check with one number inside the solution set and one outside.', kind: 'tip' },
    { content: `Flip only when you multiply or divide BOTH sides by a negative. Subtracting a negative, or a negative sitting in the problem, changes nothing. In \`12 − 5x < 2\`, the symbol stays \`<\` until the divide-by-−5 step.`, kind: 'common-error' },
    { content: `Read the shading direction off your FINAL line with x alone on the left. \`7 − 3x > 22\` ends as \`x < −5\` and shades LEFT even though the original said \`>\`.`, kind: 'gotcha' },
    { content: `If your answer ends up as \`−5 > x\`, rewrite it as \`x < −5\` before graphing. Swapping the sides swaps the symbol's direction — this is NOT the flip rule, just re-reading the same statement.`, kind: 'vocab-note' },
    { content: `Open circle = \`<\` or \`>\` (boundary excluded). Closed/filled = \`≤\` or \`≥\` (boundary included). The circle depends only on the symbol, never on whether the boundary is positive or negative.`, kind: 'common-error' },
    { content: `Sense-check by substituting into the ORIGINAL inequality, not your last line. Testing your own final answer just confirms your own arithmetic — including a missed flip.`, kind: 'tip' },
    { content: `For "smallest/largest integer" questions, solve first, then read the boundary carefully. \`−4x + 1 ≤ 17\` gives \`x ≥ −4\`, so the smallest integer is −4 itself (closed). Had it been \`x > −4\`, the answer would be −3.`, kind: 'edge-case' },
    { content: `Don't write a single number as your answer. The solution set is infinitely many values — \`x ≤ 6\` means every number at or below 6, including decimals like 5.7, not just integers.`, kind: 'vocab-note' },
    { content: `Watch for a negative coefficient hiding inside a subtraction: in \`7 − 3x\`, the coefficient of x is \`−3\`, not \`3\`. Miss that sign and you'll never realize a flip is coming.`, kind: 'gotcha' },
  ],
};
