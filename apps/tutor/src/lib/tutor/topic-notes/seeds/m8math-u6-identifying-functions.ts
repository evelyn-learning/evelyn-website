/**
 * Grade 8 Math — Unit 6 CED 6.1: Identifying Functions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.identifying-functions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U6_IDENTIFYING_FUNCTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.identifying-functions.v1',
  course: 'Grade 8 Math',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Identifying Functions',
  planId: 'evelyn.ms.m8math.identifying-functions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.identifying-functions.v1' }],
  theory: [
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'A function is a rule with one answer per input', content: `A FUNCTION IS A RULE WITH ONE ANSWER PER INPUT — a function takes an input and hands back exactly one output. Press B4, get the granola bar. Put in 3, get out 7. If the same input can produce two different outputs, the rule is not a function, no matter how neat the rest of it looks.` },
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'Input in, output out', content: `INPUT IN, OUTPUT OUT — the input is what you put into the rule, and the output is what the rule hands back. In a table or a list of pairs the input is the first number and the output is the second. These are the independent and dependent variables you already use, so the input is the x-value and the output is the y-value.` },
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'The only thing to check', content: `THE ONLY THING TO CHECK — scan the inputs for a repeat. If an input appears twice with two DIFFERENT outputs, the rule is not a function. That is the whole test. If an input appears twice with the SAME output, that is one pair written down twice, and the rule survives.` },
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'Sharing an output is allowed', content: `SHARING AN OUTPUT IS ALLOWED — two different inputs can land on the same output. Two buttons can both give gum. Under the rule "square the input", both -2 and 2 give 4, and that is a perfectly good function. The rule limits what each input does, not how many inputs an output can collect. A table whose outputs are 6, 6, 6, 6 is still a function.` },
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'Four pictures of one rule', content: `FOUR PICTURES OF ONE RULE — a table lists inputs beside outputs. A mapping diagram draws an arrow from each input to its output, so an input with two arrows leaving it breaks the rule. A set of ordered pairs writes each (input, output) in parentheses, so two pairs with the same first number and different second numbers break the rule. Plotted points put the input on the horizontal axis and the output on the vertical axis, so two points stacked directly above one another share an input and break the rule.` },
    { loId: 'm8math.identifying-functions', kind: 'framework', title: 'The graph is the set of pairs', content: `THE GRAPH IS THE SET OF PAIRS — the graph of a function is nothing more than every (input, output) pair drawn as a point. Reading a point off the graph reads a pair out of the table, and plotting the table draws the graph. The points do not have to line up in a straight line, and the rule does not need a formula: any list that gives each input one output is a function.` },
    { loId: 'm8math.identifying-functions', kind: 'definition', title: 'function', content: 'a rule that assigns exactly one output to each input.' },
    { loId: 'm8math.identifying-functions', kind: 'definition', title: 'input', content: `the value put into the rule; the first number in a pair and the x-value of a plotted point.` },
    { loId: 'm8math.identifying-functions', kind: 'definition', title: 'output', content: `the value the rule hands back; the second number in a pair and the y-value of a plotted point.` },
    { loId: 'm8math.identifying-functions', kind: 'definition', title: 'mapping diagram', content: `a picture with inputs in one column, outputs in another, and an arrow from each input to its output.` },
    { loId: 'm8math.identifying-functions', kind: 'definition', title: 'ordered pair', content: 'two numbers in parentheses, written (input, output), where the order matters.' },
  ],
  methods: [
    {
      title: 'Worked three representations',
      steps: [
        `Run the same test on all three: look for an input that appears more than once, and if one does, compare its outputs.`,
        `(a) The inputs are 1, 2, 3, 4, and none of them repeats. Each input has one output, so the table is a function. You might notice the rule is double the input and add 1, since 2 × 1 + 1 = 3, 2 × 2 + 1 = 5, 2 × 3 + 1 = 7, and 2 × 4 + 1 = 9, but you do not need the formula to answer the question. No repeated input means function.`,
        `(b) The inputs are 2, 5, 7, and none of them repeats. Two arrows land on 8, one from 2 and one from 5, and that is allowed, because sharing an output never breaks a function. Each input has exactly one arrow leaving it, so the diagram is a function.`,
        `(c) The first numbers are 1, 3, 1, 5. The input 1 appears twice, in (1, 4) and in (1, 9), with two different outputs. One input, two outputs, so this set of pairs is not a function.`,
        `Check with the machine. In (c), pressing button 1 sometimes drops a 4 and sometimes drops a 9, which is exactly the broken machine. In (a) and (b), every button drops one thing.`,
      ],
      example: { problem: `Decide whether each rule is a function. (a) A table with inputs 1, 2, 3, 4 and outputs 3, 5, 7, 9. (b) A mapping diagram in which 2 goes to 8, 5 goes to 8, and 7 goes to 12. (c) The set of ordered pairs (1, 4), (3, 6), (1, 9), (5, 2).`, solution: '(a) function, (b) function, (c) not a function' },
      relatedLoIds: ['m8math.identifying-functions'],
    },
    {
      title: 'Worked plotted points',
      steps: [
        `The graph is the set of pairs, so read every point as (input, output): the x-coordinate is the input and the y-coordinate is the output. The inputs are 1, 2, 3, 4, 2.`,
        `The input 2 appears twice, once with output 4 and once with output 6. On the plane those two points sit directly above one another, one at height 4 and one at height 6. One input, two outputs, so the five points are not the graph of a function.`,
        `WRONG: saying the points (1, 2) and (3, 2) break the rule because they share the output 2. CORRECT: those two points sit side by side at the same height with different inputs, and two inputs sharing an output is allowed. Only points stacked above the same input break a function.`,
        `Erase (2, 6). The remaining points are (1, 2), (2, 4), (3, 2), (4, 8), with inputs 1, 2, 3, 4, and none repeats. What is left is the graph of a function.`,
        `Check by playing the machine on the four remaining points: press 1 and get 2, press 2 and get 4, press 3 and get 2, press 4 and get 8. Every button has one answer, and the points do not need to line up on a straight line for that to be true.`,
      ],
      example: { problem: `Five points are plotted on a coordinate plane: (1, 2), (2, 4), (3, 2), (4, 8), and (2, 6). Is this set of points the graph of a function? Then decide whether erasing the point (2, 6) leaves the graph of a function.`, solution: `Not a function as plotted; after erasing (2, 6), the remaining four points are the graph of a function` },
      relatedLoIds: ['m8math.identifying-functions'],
    },
  ],
  pointers: [
    { content: `Students often say "The table with outputs 6, 6, 6, 6 is not a function, because the output repeats." — The inputs are 1, 2, 3, 4, and none of them repeats, so each input has exactly one output: the number 6. That is a function, and a plain one. Four buttons that all drop gum still make a reliable machine. Sharing an output is always allowed; only an input with two different outputs breaks the rule.`, kind: 'common-error' },
    { content: `Students often say "The pairs (1, 7), (2, 3), (3, 12), (4, 5) cannot be a function, because there is no formula." — Check the inputs: 1, 2, 3, 4, with no repeats, so each input has exactly one output and the list is a function. The rule does not have to be a formula, and the outputs do not have to climb, fall, or line up. A list of which snack each button drops is a rule, and so is this table.`, kind: 'common-error' },
    { content: 'A function is a rule that gives each input exactly one output.', kind: 'tip' },
    { content: `The only test: look for an input that appears twice with two different outputs. Nothing else breaks a function.`, kind: 'tip' },
    { content: `Different inputs may share an output. A table whose outputs are all 6 is still a function.`, kind: 'tip' },
    { content: 'An input repeated with the SAME output is one pair written twice, not a break.', kind: 'tip' },
    { content: `In a table, a mapping diagram, a set of ordered pairs, or plotted points, the input is the first number or the x-value; hunt for repeated inputs there.`, kind: 'tip' },
    { content: `The graph of a function is its set of (input, output) pairs drawn as points; two points stacked above the same input mean it is not a function.`, kind: 'tip' },
  ],
};
