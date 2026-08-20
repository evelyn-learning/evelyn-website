/**
 * Grade 7 Math — Unit 6 CED 6.4: Solving & Graphing Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.solving-and-graphing-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U6_SOLVING_AND_GRAPHING_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.solving-and-graphing-inequalities.v1',
  course: 'Grade 7 Math',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Solving & Graphing Inequalities',
  planId: 'evelyn.ms.m7math.solving-and-graphing-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.solving-and-graphing-inequalities.v1' }],
  theory: [
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'Four symbols, two families', content: `FOUR SYMBOLS, TWO FAMILIES — the strict symbols are < (less than) and > (greater than). The inclusive symbols are ≤ (less than or equal to) and ≥ (greater than or equal to). An inequality usually has infinitely many solutions, so the answer looks like x < 5 rather than x = 5.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'Solve it exactly like an equation', content: `SOLVE IT EXACTLY LIKE AN EQUATION — undo addition and subtraction first, then undo multiplication and division, and do every move to BOTH sides. Nothing about that routine changes.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'The one exception, the flip rule', content: `THE ONE EXCEPTION, THE FLIP RULE — when you multiply or divide BOTH sides by a NEGATIVE number, you must REVERSE the inequality symbol. So −3x > 15 becomes x < −5, with the symbol turned around. Forget the flip and the answer describes the exact wrong half of the number line.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'Why it flips', content: `WHY IT FLIPS — start with something true, like 2 < 5. Now multiply both sides by −1, giving −2 and −5. But −2 is GREATER than −5, because −2 sits further right on the number line. The numbers swapped places, so the symbol has to swap too or the statement becomes false.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'When not to flip', content: `WHEN NOT TO FLIP — adding or subtracting never flips, not even when the number is negative. Multiplying or dividing by a POSITIVE never flips. The symbol turns around only for a negative multiplier or divisor, and at no other moment.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'framework', title: 'Graphing on a number line', content: `GRAPHING ON A NUMBER LINE — mark the boundary number, then decide the circle and the shading. Strict symbols < and > get an OPEN circle, because the boundary itself is not a solution. Inclusive symbols ≤ and ≥ get a CLOSED, filled-in circle, because the boundary counts. Then shade the side named by your FINAL line, with x on the left: x < 4 shades left, x > 4 shades right. Never read the shading direction off the original problem, because the symbol may have flipped along the way.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'definition', title: 'inequality', content: `a statement that one expression is less than or greater than another, using <, >, ≤, or ≥.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'definition', title: 'solution set', content: `all the values of the variable that make the inequality true, usually infinitely many.` },
    { loId: 'm7math.solving-and-graphing-inequalities', kind: 'definition', title: 'boundary', content: `the number where the solution set starts or stops; included for ≤ and ≥, excluded for < and >.` },
  ],
  methods: [
    {
      title: 'Worked no flip',
      steps: [
        `Undo the +4 first. Subtract 4 from both sides: 3x ≤ 15. Subtracting never flips anything, so the symbol stays as ≤.`,
        'Now divide both sides by 3. Three is positive, so again there is no flip: x ≤ 5.',
        `Graph it. Put a CLOSED, filled circle on 5, because ≤ means 5 itself is allowed. Then shade everything to the LEFT of 5, toward the smaller numbers.`,
        `Sense-check with a number INSIDE the shading, x = 5: 3(5) + 4 = 19, and 19 ≤ 19 is true.`,
        `Sense-check with a number OUTSIDE it, x = 6: 3(6) + 4 = 22, and 22 ≤ 19 is false. Inside works, outside fails, so the answer is right.`,
      ],
      example: { problem: 'Solve and graph: 3x + 4 ≤ 19', solution: 'x ≤ 5, with a closed circle at 5 and shading to the left' },
      relatedLoIds: ['m7math.solving-and-graphing-inequalities'],
    },
    {
      title: 'Worked flip rule',
      steps: [
        `The variable term is −2x, minus sign included. Undo the 6 first by subtracting 6 from both sides: −2x > 8. The symbol does NOT flip here, because subtracting is not multiplying or dividing.`,
        `Now divide both sides by −2. This is the flip step: dividing by a negative reverses the symbol, so > becomes <.`,
        `8 divided by −2 is −4, so the answer is x < −4. WRONG answer to avoid: x > −4, which comes from skipping the flip. RIGHT answer: x < −4.`,
        `Graph it. OPEN circle at −4, because > and < are strict and the boundary is not included. Shade to the LEFT, which is what the final line x < −4 says. Do not shade right just because the original problem showed a > symbol.`,
        `Sense-check inside the shading, x = −5: 6 − 2(−5) = 6 + 10 = 16, and 16 > 14 is true.`,
        `Sense-check outside it, x = 0: 6 − 2(0) = 6, and 6 > 14 is false. The flip was necessary, and the check proves it.`,
      ],
      example: { problem: 'Solve and graph: 6 − 2x > 14', solution: 'x < −4, with an open circle at −4 and shading to the left' },
      relatedLoIds: ['m7math.solving-and-graphing-inequalities'],
    },
  ],
  pointers: [
    { content: `Students often say "x < 2" — Dividing by a NEGATIVE reverses the symbol, so −4x < −8 gives x > 2, not x < 2. Test the student answer with x = 1: 10 − 4(1) = 6, and 6 < 2 is false, so 1 is not a solution at all. Test x = 3 instead: 10 − 4(3) = −2, and −2 < 2 is true. The correct solution set is x > 2, drawn with an open circle at 2 and shading to the right.`, kind: 'common-error' },
    { content: `Students often say "Flip the symbol at the first step, because there is a minus sign in the problem" — Subtracting 10 from both sides is subtraction, so nothing flips: 10 − 4x < 2 becomes −4x < −8 with the symbol unchanged. The single flip happens later, at the divide-by-−4 step. Adding or subtracting a negative never flips anything.`, kind: 'common-error' },
    { content: `An inequality has a whole range of solutions, and you solve it exactly like an equation.`, kind: 'tip' },
    { content: `THE FLIP RULE: multiplying or dividing both sides by a NEGATIVE reverses the symbol, so −5x < 20 gives x > −4.`, kind: 'tip' },
    { content: `Adding or subtracting never flips, and multiplying or dividing by a positive never flips.`, kind: 'tip' },
    { content: 'Open circle for < and >; closed, filled circle for ≤ and ≥.', kind: 'tip' },
    { content: `Shade the direction your FINAL line points, then test one number inside and one outside to be sure.`, kind: 'tip' },
    { content: `Flip ONLY when you multiply or divide **both sides** by a negative. A minus sign somewhere in the problem is not a reason to flip. In 10 − 4x < 2, subtracting 10 flips nothing; the flip comes later, at ÷(−4).`, kind: 'common-error' },
    { content: `Read the shading direction off your FINAL line, never the original problem. 6 − 2x > 14 ends as x < −4, so you shade LEFT even though the problem showed >.`, kind: 'gotcha' },
    { content: `Open circle = < or > (boundary NOT allowed). Closed, filled circle = ≤ or ≥ (boundary counts). Solving never changes strict to inclusive — if you started with >, you end with < or >, never ≤.`, kind: 'vocab-note' },
    { content: `Write x on the LEFT before you graph. If you end with 5 > x, rewrite it as x < 5 first — otherwise your brain reads the arrow the wrong way and shades backwards.`, kind: 'tip' },
    { content: `Answers are ranges, not single numbers. Don't write x = 5 when the answer is x ≤ 5. The solution set has infinitely many values, so leave the inequality symbol in your final answer.`, kind: 'common-error' },
    { content: `Test two numbers before you're done: one INSIDE your shading (should be true) and one OUTSIDE (should be false). Plug into the ORIGINAL inequality, not your last line — that's how you catch a missed flip.`, kind: 'tip' },
    { content: `Careful with negative boundaries: for x > −4, the shading goes right toward −3, −2, 0 — the bigger numbers. Bigger negatives like −5 and −10 are to the LEFT, not the right.`, kind: 'edge-case' },
    { content: `When a question asks for the smallest or largest INTEGER solution, solve first, then look at your graph. For −4x ≤ 12 → x ≥ −3, the smallest integer is −3 itself, because ≥ includes the boundary.`, kind: 'edge-case' },
  ],
};
