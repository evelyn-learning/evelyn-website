/**
 * ACT — Unit 2 CED 2.5: Functions & Their Graphs.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.functions-graphs.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_FUNCTIONS_GRAPHS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.functions-graphs.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.5',
  cedTitle: 'Functions & Their Graphs',
  planId: 'evelyn.testprep.act.functions-graphs.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.functions-graphs.v1' }],
  theory: [
    { loId: 'act.functions-graphs', content: `f(x) IS THE RULE. f(a) means "wherever you see x in the rule, write a instead." Nothing more mysterious than that.` },
    { loId: 'act.functions-graphs', content: `COMPOSITE FUNCTIONS GO INSIDE OUT. To find f(g(x)), evaluate g(x) FIRST, get a number, then plug THAT number into f. Never plug x into both at once.` },
    { loId: 'act.functions-graphs', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — WRONG ORDER: f(g(x)) and g(f(x)) are usually different values. Match the order the problem gives you exactly; do not swap them out of habit.` },
    { loId: 'act.functions-graphs', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — REUSING THE ORIGINAL INPUT: after computing g(x) = 5, the next step evaluates f(5), NOT f(x) again. The 5 replaces x completely.` },
    { loId: 'act.functions-graphs', content: `READING A GRAPH: f(a) = b means the point (a, b) is ON the curve. To find f(a), start at a on the x-axis, go up/down to the curve, then read across to the y-axis.` },
    { loId: 'act.functions-graphs', content: `READING A TABLE: a function can be given as a table of x-values and f(x)-values. Composite lookups mean finding the OUTPUT of one row, then hunting for a NEW row that starts with that output.` },
    { loId: 'act.functions-graphs', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — SIGN ERRORS ON NEGATIVE INPUTS: squaring or absolute-valuing a negative input, e.g. f(-3) with f(x) = x², is (-3)² = 9, not -9. Write the substitution in parentheses first.` },
    { loId: 'act.functions-graphs', content: `CHAINED COMPOSITES like f(f(x)) reuse the SAME rule twice: evaluate f once, then feed that output back into f again.` },
    { loId: 'act.functions-graphs', kind: 'definition', title: 'composite function', content: `a function built by plugging one function’s output into another, written f(g(x)) or (f∘g)(x).` },
    { loId: 'act.functions-graphs', kind: 'definition', title: 'domain', content: 'the set of valid input (x) values a function accepts.' },
    { loId: 'act.functions-graphs', kind: 'definition', title: 'range', content: 'the set of output (y) values a function produces.' },
  ],
  methods: [
    {
      title: 'Worked composite basic',
      steps: [
        `Inside out: the innermost function is g, and its input is 2. Evaluate g(2) first.`,
        'g(2) = (2)² + 1 = 4 + 1 = 5.',
        'Now use that result, 5, as the input to f — NOT the original 2.',
        'f(5) = 2(5) - 3 = 10 - 3 = 7.',
      ],
      example: { problem: 'If f(x) = 2x - 3 and g(x) = x² + 1, what is f(g(2))?', solution: '7' },
      relatedLoIds: ['act.functions-graphs'],
    },
    {
      title: 'Worked composite trap',
      steps: [
        `The order here is g(f(-2)) — f is innermost this time, so evaluate f(-2) first, not g.`,
        `Substitute carefully with parentheses: f(-2) = (-2)² - 4 = 4 - 4 = 0. (Squaring the negative gives a POSITIVE 4, not -4.)`,
        'Now feed that result, 0, into g: g(0) = 3(0) + 1 = 0 + 1 = 1.',
        `Sanity check: if a student swapped the order and computed f(g(-2)) instead, they would get a different, wrong answer — always match the order given.`,
      ],
      example: { problem: 'If f(x) = x² - 4 and g(x) = 3x + 1, what is g(f(-2))?', solution: '1' },
      relatedLoIds: ['act.functions-graphs'],
    },
  ],
  pointers: [
    { content: `After computing f(3) = 7, that 7 becomes the new input: g(7) = 2(7) = 14, not g(3).`, kind: 'common-error' },
    { content: `Composite functions evaluate INSIDE OUT: compute the inner function first, then feed that result into the outer function.`, kind: 'tip' },
    { content: `f(g(x)) and g(f(x)) are usually different — always match the exact order the problem gives.`, kind: 'tip' },
    { content: `On a graph, f(a) = b means the point (a, b) sits on the curve; on a table, look up the row for the CURRENT input at each step, not the original x.`, kind: 'tip' },
    { content: `About 60 seconds per question — write down the intermediate result before finishing the outer step.`, kind: 'tip' },
    { content: `f(g(x)) is NOT f(x)·g(x). When answer choices include a product like (2x-3)(x²+1) next to a true composite, the product is the planted distractor. Composition means substitution, never multiplication.`, kind: 'gotcha' },
    { content: `When the question asks for f(g(x)) as an EXPRESSION (not a number), substitute the whole g(x) in parentheses and expand fully. f(x)=x²-1, g(x)=x+3 → (x+3)²-1 = x²+6x+8, not x²+9-1.`, kind: 'common-error' },
    { content: `Distinguish f(x+2) from f(x)+2 and f(-x) from -f(x). The inner change hits the input BEFORE the rule runs; the outer change hits the output AFTER. Circle whether the number is inside or outside the parentheses before you compute.`, kind: 'gotcha' },
    { content: `On a graph, 'find f(3)' and 'find x when f(x)=3' move in opposite directions. f(3): start on the x-axis, go vertical, read the y. f(x)=3: start on the y-axis, go horizontal, read the x — and there may be two answers.`, kind: 'edge-case' },
    { content: `Table composites can dead-end: if g(2)=7 but no row of the f-table has x=7, the answer is 'cannot be determined from the given information.' Check that the intermediate output actually appears as an INPUT before you keep going.`, kind: 'edge-case' },
    { content: `The ACT invents symbols: 'a◊b = a² - 2b' or 'f(x) defined as x★3'. Treat the odd symbol exactly like function notation — substitute in order, left value where the left letter sits. No hidden math rule is being tested.`, kind: 'vocab-note' },
    { content: `'For what value of x does f(x) = g(x)?' means read the x-coordinate of the intersection, not the y. If the graphs meet at (4, 7), the answer is 4 — 7 will be sitting there as a choice.`, kind: 'common-error' },
    { content: `For f(f(x)) or f(g(f(x))), write each intermediate value on your test booklet before moving outward. Losing track of which number is current is what produces the 'reused the original input' error on three-layer chains.`, kind: 'tip' },
  ],
};
