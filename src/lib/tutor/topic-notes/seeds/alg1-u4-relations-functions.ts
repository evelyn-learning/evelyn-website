/**
 * Algebra 1 — Unit 4 CED 4.1: Relations, Functions & Function Notation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.relations-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U4_RELATIONS_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.relations-functions.v1',
  course: 'Algebra 1',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Relations, Functions & Function Notation',
  planId: 'evelyn.hs.alg1.relations-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.relations-functions.v1' }],
  theory: [
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Relation', content: `RELATION — any set of ordered pairs (input, output). A relation pairs x-values with y-values; that is all it promises.` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Function', content: `FUNCTION — a relation where every input has EXACTLY ONE output. Check the x-values: if the same x appears twice with two different y-values, it is not a function.` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Repeated outputs are fine', content: `REPEATED OUTPUTS ARE FINE — {(1, 5), (2, 5), (3, 5)} is a function. Many inputs may share an output; one input may never have two outputs.` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Vertical line test', content: `VERTICAL LINE TEST — on a graph, if any vertical line hits the curve more than once, that x has two outputs and the graph is not a function. A circle fails; a parabola opening up passes.` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Domain and range from a set', content: `DOMAIN AND RANGE FROM A SET — domain is the set of inputs (x-values), range is the set of outputs (y-values). List each value once, in increasing order.` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Domain and range from a graph', content: `DOMAIN AND RANGE FROM A GRAPH — sweep left-to-right for the domain (which x-values are covered), bottom-to-top for the range (which y-values are reached).` },
    { loId: 'alg1.relations-functions', kind: 'framework', title: 'Function notation', content: `FUNCTION NOTATION — f(x) is the NAME of the output when the input is x. It is read "f of x", not "f times x". The equations y = 2x + 1 and f(x) = 2x + 1 say the same thing.` },
    { loId: 'alg1.relations-functions', content: `EVALUATING f(a) — replace every x with a, in parentheses, then simplify: for f(x) = x² + 1, f(−3) = (−3)² + 1 = 10. Those parentheses are what keep the negative inside the square.` },
    { loId: 'alg1.relations-functions', kind: 'definition', title: 'domain', content: 'the set of all allowed inputs (x-values) of a relation.' },
    { loId: 'alg1.relations-functions', kind: 'definition', title: 'range', content: 'the set of all outputs (y-values) a relation produces.' },
    { loId: 'alg1.relations-functions', kind: 'definition', title: 'function notation', content: `writing the output as f(x) — read "f of x" — so a specific input can be named, as in f(4).` },
  ],
  methods: [
    {
      title: 'Worked relation to domain range',
      steps: [
        `List the inputs: −3, −1, 2, 5. No x-value repeats, so no input has two different outputs.`,
        `The output 4 appears twice, at x = −3 and x = 2 — that is allowed. Only repeated INPUTS break a function.`,
        `So yes, it is a function. Domain = the inputs, written once each in order: {−3, −1, 2, 5}.`,
        `Range = the outputs, written once each in order: {−6, 0, 4}. The duplicate 4 is listed a single time.`,
      ],
      example: { problem: `Is the relation {(−3, 4), (−1, 0), (2, 4), (5, −6)} a function? State its domain and range.`, solution: 'Yes, a function. Domain {−3, −1, 2, 5}; range {−6, 0, 4}' },
      relatedLoIds: ['alg1.relations-functions'],
    },
    {
      title: 'Worked evaluate negative',
      steps: [
        `f(−3) means substitute −3 for x. Write the parentheses first: f(−3) = (−3)² − 4(−3).`,
        `Square the whole input: (−3)² = 9. This is the step students lose — without parentheses you would write −3² = −9, which squares only the 3.`,
        'Handle the second term: −4(−3) = +12. A negative times a negative is positive.',
        `Add: 9 + 12 = 21. So f(−3) = 21. Note f(−3) is an OUTPUT, not "f times −3" and not an equation to solve for x.`,
      ],
      example: { problem: 'For f(x) = x² − 4x, find f(−3).', solution: 'f(−3) = 21' },
      relatedLoIds: ['alg1.relations-functions'],
    },
  ],
  pointers: [
    { content: `f is the NAME of the function, not a factor. f(3) is read "f of 3" and means "substitute 3 for x": f(3) = 2(3) + 1 = 7.`, kind: 'common-error' },
    { content: `The number inside the parentheses is the INPUT. f(3) = 7 asks for the output at x = 3; the different question f(x) = 3 would ask which input gives output 3, which is x = 1.`, kind: 'common-error' },
    { content: `Function = every input has exactly one output. Repeated inputs break it; repeated outputs do not.`, kind: 'tip' },
    { content: 'Vertical line test: a vertical line may cross the graph at most once.', kind: 'tip' },
    { content: 'Domain = inputs (x), range = outputs (y); list each value once.', kind: 'tip' },
    { content: 'f(x) is read "f of x", never "f times x".', kind: 'tip' },
    { content: `To find f(a), substitute a for every x using parentheses: for f(x) = x² − 4x, f(−3) = 9 + 12 = 21.`, kind: 'tip' },
    { content: `Repeated **outputs** are fine; repeated **inputs** are fatal. Before deciding, cover the y-values and look only at the x-list: {(1,5),(2,5)} is a function, {(2,1),(2,7)} is not.`, kind: 'common-error' },
    { content: `f(3) is an OUTPUT, not an equation. Don't confuse \`f(3) = ?\` (substitute 3 for x) with \`f(x) = 3\` (solve for the input that gives output 3). For f(x) = 2x+1 those give 7 and x = 1 — different questions.`, kind: 'gotcha' },
    { content: `Always wrap the input in parentheses when substituting: f(−3) = (−3)² − 4(−3), not −3² − 4−3. Without parentheses you square only the 3 and lose the sign of the whole input.`, kind: 'common-error' },
    { content: `In f(x), the f is a NAME, not a variable being multiplied. Read it aloud as "f of x". Writing f(3) = 3f treats f as a factor and is meaningless here.`, kind: 'vocab-note' },
    { content: `When listing domain or range, write each value **once**, in increasing order, inside braces. Range of {(−3,4),(−1,0),(2,4),(5,−6)} is {−6, 0, 4} — one 4, and −6 first, not last.`, kind: 'vocab-note' },
    { content: `The vertical line test only says whether a graph IS a function — it never tells you the domain or range. A vertical line itself (x = 2) fails the test; a horizontal line (y = 2) passes.`, kind: 'edge-case' },
    { content: `y = 2x + 1 and f(x) = 2x + 1 are the same rule; f(x) just replaces y. So f(x) is the output value — don't treat the two notations as different kinds of objects.`, kind: 'tip' },
    { content: `Every function is a relation, but not every relation is a function. If a problem only says "relation," nothing about one-output-per-input is guaranteed — you must check.`, kind: 'vocab-note' },
  ],
};
