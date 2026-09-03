/**
 * Grade 8 Math — Functions & Volume: Identifying Functions.
 *
 * CONCEPT-LED exemplar for the m8math fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one mental model: a
 * function is a rule that hands back exactly one output for each input
 * (CCSS 8.F.A.1), and the ONLY thing that breaks it is a repeated input
 * carrying two different outputs. Everything else the student might worry
 * about — a repeated output, a pair written twice, points that do not line
 * up, a table with no formula behind it — is shown to be harmless, because
 * those are the four ways this test gets misread. The same test is then run
 * on all four representations the standard names (table, mapping diagram,
 * set of ordered pairs, plotted points), and the graph is presented as
 * nothing more than the set of (input, output) pairs drawn as points.
 *
 * SCOPE GUARD: Grade 8 defines a function and tests a table, a mapping
 * diagram, a set of ordered pairs, or a plotted set of points for a repeated
 * input with different outputs. Withholds: f(x) notation (CCSS G8: function
 * notation not required), domain/range, and the named vertical line test ->
 * `alg1-u4-relations-functions.ts`. Concretely: the word "function" is used
 * throughout and "f(x)" never is; a rule is always written in words ("double
 * the input and add 1") or shown as pairs, never as f(x) = 2x + 1; the words
 * "domain" and "range" do not appear; and the stacked-points observation in
 * the second worked example is made in plain words — two points sitting
 * directly above the same input — and is never named as a test. Sideways: the
 * plan never classifies a function as linear or nonlinear (row 6.2), never
 * compares two functions (row 6.3), and never extracts a rate of change or an
 * initial value (rows 7.1-7.3); where a straight line is mentioned at all, it
 * is only to say that lining up is NOT what makes a rule a function. Below,
 * assumed and not re-taught: independent/dependent variables (`m6math` row
 * 8.4) and plotting points (`m6math` row 6.1). Salvaged from
 * `g8-math-functions-intro.ts`: the vending-machine metaphor and the
 * mapping-diagram examples only; its f(x) and vertical-line-test material was
 * deliberately left behind.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 5.4 -> 6.1 -> 6.2
 * (`systems-word-problems` -> this row -> `linear-vs-nonlinear-functions`).
 * Both arrays are empty here only because this exemplar is written before its
 * neighbors exist; the controller wires the chain at registration.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U6_IDENTIFYING_FUNCTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.identifying-functions.v1',
  title: 'Identifying Functions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.identifying-functions',
      standard: 'M8MATH-6.1',
      description:
        'Define a function as a rule that assigns exactly one output to each input; test tables, mapping diagrams, sets of ordered pairs, and a plotted set of points for a repeated input with different outputs; the graph of a function is its set of (input, output) pairs (CCSS 8.F.A.1).',
    },
  ],
  prerequisites: ['m8math.systems-word-problems'],
  followUps: ['m8math.linear-vs-nonlinear-functions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the difference between a rule that can be trusted and one that cannot, before the word function is defined.',
      script:
        'The vending machine outside the gym has a button for every slot. Press B4 and a granola bar drops, every single time; press D2 and you get gum, every single time. Nobody has to think about it, because each button has exactly one answer. Now picture a broken machine where B4 drops a granola bar on Monday and a bag of chips on Tuesday. Same button, two different results, and now you cannot trust the machine at all. Mathematicians have a name for the reliable machine: a function. Today we learn the one test that separates a function from a rule that cannot be trusted, and we run it on tables, arrow diagrams, lists of pairs, and plotted points.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-one-output-per-input',
      kind: 'concept',
      goal: 'Define a function by its one-output-per-input rule, reduce the test to a single check on inputs, and show that check in all four representations.',
      keyIdeas: [
        'A FUNCTION IS A RULE WITH ONE ANSWER PER INPUT — a function takes an input and hands back exactly one output. Press B4, get the granola bar. Put in 3, get out 7. If the same input can produce two different outputs, the rule is not a function, no matter how neat the rest of it looks.',
        'INPUT IN, OUTPUT OUT — the input is what you put into the rule, and the output is what the rule hands back. In a table or a list of pairs the input is the first number and the output is the second. These are the independent and dependent variables you already use, so the input is the x-value and the output is the y-value.',
        'THE ONLY THING TO CHECK — scan the inputs for a repeat. If an input appears twice with two DIFFERENT outputs, the rule is not a function. That is the whole test. If an input appears twice with the SAME output, that is one pair written down twice, and the rule survives.',
        'SHARING AN OUTPUT IS ALLOWED — two different inputs can land on the same output. Two buttons can both give gum. Under the rule "square the input", both -2 and 2 give 4, and that is a perfectly good function. The rule limits what each input does, not how many inputs an output can collect. A table whose outputs are 6, 6, 6, 6 is still a function.',
        'FOUR PICTURES OF ONE RULE — a table lists inputs beside outputs. A mapping diagram draws an arrow from each input to its output, so an input with two arrows leaving it breaks the rule. A set of ordered pairs writes each (input, output) in parentheses, so two pairs with the same first number and different second numbers break the rule. Plotted points put the input on the horizontal axis and the output on the vertical axis, so two points stacked directly above one another share an input and break the rule.',
        'THE GRAPH IS THE SET OF PAIRS — the graph of a function is nothing more than every (input, output) pair drawn as a point. Reading a point off the graph reads a pair out of the table, and plotting the table draws the graph. The points do not have to line up in a straight line, and the rule does not need a formula: any list that gives each input one output is a function.',
      ],
      vocabulary: [
        { term: 'function', definition: 'a rule that assigns exactly one output to each input.' },
        { term: 'input', definition: 'the value put into the rule; the first number in a pair and the x-value of a plotted point.' },
        { term: 'output', definition: 'the value the rule hands back; the second number in a pair and the y-value of a plotted point.' },
        { term: 'mapping diagram', definition: 'a picture with inputs in one column, outputs in another, and an arrow from each input to its output.' },
        { term: 'ordered pair', definition: 'two numbers in parentheses, written (input, output), where the order matters.' },
      ],
      suggestedTools: ['show_table', 'show_diagram', 'show_coordinate_plane'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-representations',
      kind: 'worked_example',
      problem:
        'Decide whether each rule is a function. (a) A table with inputs 1, 2, 3, 4 and outputs 3, 5, 7, 9. (b) A mapping diagram in which 2 goes to 8, 5 goes to 8, and 7 goes to 12. (c) The set of ordered pairs (1, 4), (3, 6), (1, 9), (5, 2).',
      steps: [
        'Run the same test on all three: look for an input that appears more than once, and if one does, compare its outputs.',
        '(a) The inputs are 1, 2, 3, 4, and none of them repeats. Each input has one output, so the table is a function. You might notice the rule is double the input and add 1, since 2 × 1 + 1 = 3, 2 × 2 + 1 = 5, 2 × 3 + 1 = 7, and 2 × 4 + 1 = 9, but you do not need the formula to answer the question. No repeated input means function.',
        '(b) The inputs are 2, 5, 7, and none of them repeats. Two arrows land on 8, one from 2 and one from 5, and that is allowed, because sharing an output never breaks a function. Each input has exactly one arrow leaving it, so the diagram is a function.',
        '(c) The first numbers are 1, 3, 1, 5. The input 1 appears twice, in (1, 4) and in (1, 9), with two different outputs. One input, two outputs, so this set of pairs is not a function.',
        'Check with the machine. In (c), pressing button 1 sometimes drops a 4 and sometimes drops a 9, which is exactly the broken machine. In (a) and (b), every button drops one thing.',
      ],
      answer: '(a) function, (b) function, (c) not a function',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plotted-points',
      kind: 'worked_example',
      problem:
        'Five points are plotted on a coordinate plane: (1, 2), (2, 4), (3, 2), (4, 8), and (2, 6). Is this set of points the graph of a function? Then decide whether erasing the point (2, 6) leaves the graph of a function.',
      steps: [
        'The graph is the set of pairs, so read every point as (input, output): the x-coordinate is the input and the y-coordinate is the output. The inputs are 1, 2, 3, 4, 2.',
        'The input 2 appears twice, once with output 4 and once with output 6. On the plane those two points sit directly above one another, one at height 4 and one at height 6. One input, two outputs, so the five points are not the graph of a function.',
        'WRONG: saying the points (1, 2) and (3, 2) break the rule because they share the output 2. CORRECT: those two points sit side by side at the same height with different inputs, and two inputs sharing an output is allowed. Only points stacked above the same input break a function.',
        'Erase (2, 6). The remaining points are (1, 2), (2, 4), (3, 2), (4, 8), with inputs 1, 2, 3, 4, and none repeats. What is left is the graph of a function.',
        'Check by playing the machine on the four remaining points: press 1 and get 2, press 2 and get 4, press 3 and get 2, press 4 and get 8. Every button has one answer, and the points do not need to line up on a straight line for that to be true.',
      ],
      answer: 'Not a function as plotted; after erasing (2, 6), the remaining four points are the graph of a function',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-set-breaks',
      kind: 'try_yourself',
      problem: 'Which set of ordered pairs is NOT a function?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(1, 5), (2, 5), (3, 5), (4, 5)' },
        { id: 'b', text: '(-2, 4), (2, 4), (-3, 9), (3, 9)' },
        { id: 'c', text: '(5, 1), (5, 1), (6, 2), (7, 3)' },
        { id: 'd', text: '(3, 7), (5, 9), (3, 11), (6, 4)', correct: true },
      ],
      expectedAnswer: '(3, 7), (5, 9), (3, 11), (6, 4)',
      hints: [
        'Look only at the first number in each pair. Find a set where the same first number shows up twice, then compare the second numbers.',
        'A repeated output never breaks a function, and a pair written twice is still one pair. You want an input that appears with two DIFFERENT outputs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plotted-points-reason',
      kind: 'try_yourself',
      problem: 'Four points are plotted on a coordinate plane: (1, 3), (4, 3), (6, 0), and (4, 7). Is this set of points the graph of a function?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No, because the points (1, 3) and (4, 3) share the output 3' },
        { id: 'b', text: 'No, because the input 4 has two different outputs, 3 and 7', correct: true },
        { id: 'c', text: 'Yes, because all four points are different pairs' },
        { id: 'd', text: 'No, because the four points do not lie on one straight line' },
      ],
      expectedAnswer: 'No, because the input 4 has two different outputs, 3 and 7',
      hints: [
        'Read each point as (input, output) and list the inputs by themselves: 1, 4, 6, 4.',
        'One input appears twice. Check whether its two points sit stacked above one another at different heights. Sharing a height with a different input is not the problem, and lining up in a straight line is not the test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-forced-output',
      kind: 'try_yourself',
      problem:
        'A function contains the pairs (2, 7), (6, 19), and (10, 31). A fourth pair is added whose input is 6, and the rule is still a function afterward. What must the output of that fourth pair be? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '19',
      hints: [
        'A function gives each input exactly one output, and the input 6 already has an output in the list.',
        'The new pair has to agree with the pair that is already there. Same input, same output, or the rule breaks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-repeated-output-and-no-formula',
      kind: 'misconception_check',
      question:
        'A student looks at a table with inputs 1, 2, 3, 4 and outputs 6, 6, 6, 6 and says it is not a function because the output repeats. The same student looks at the pairs (1, 7), (2, 3), (3, 12), (4, 5) and says that cannot be a function either, because there is no formula behind it. What went wrong in each case?',
      commonErrors: [
        {
          answer: 'The table with outputs 6, 6, 6, 6 is not a function, because the output repeats.',
          misconception: 'Treating a repeated OUTPUT as what breaks a function, when the test only looks at inputs.',
          correctsTo:
            'The inputs are 1, 2, 3, 4, and none of them repeats, so each input has exactly one output: the number 6. That is a function, and a plain one. Four buttons that all drop gum still make a reliable machine. Sharing an output is always allowed; only an input with two different outputs breaks the rule.',
        },
        {
          answer: 'The pairs (1, 7), (2, 3), (3, 12), (4, 5) cannot be a function, because there is no formula.',
          misconception: 'Believing a function must come from a formula or show a pattern, when a function is any rule that gives each input one output, including a plain list.',
          correctsTo:
            'Check the inputs: 1, 2, 3, 4, with no repeats, so each input has exactly one output and the list is a function. The rule does not have to be a formula, and the outputs do not have to climb, fall, or line up. A list of which snack each button drops is a rule, and so is this table.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A function is a rule that gives each input exactly one output.',
        'The only test: look for an input that appears twice with two different outputs. Nothing else breaks a function.',
        'Different inputs may share an output. A table whose outputs are all 6 is still a function.',
        'An input repeated with the SAME output is one pair written twice, not a break.',
        'In a table, a mapping diagram, a set of ordered pairs, or plotted points, the input is the first number or the x-value; hunt for repeated inputs there.',
        'The graph of a function is its set of (input, output) pairs drawn as points; two points stacked above the same input mean it is not a function.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Identifying Functions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
