/**
 * ACT — Math / Functions & Their Graphs: notation, evaluation, composition.
 *
 * Function notation and composite functions (f(g(x))) show up on nearly
 * every ACT math test, usually a handful of questions spread across the
 * Elementary/Intermediate Algebra and coordinate-geometry ranges. The math
 * itself is simple substitution — the points lost are almost always about
 * evaluating in the WRONG ORDER or reading the WRONG TABLE ROW / graph
 * point, not about the algebra. Calculator allowed; ~60 seconds per
 * question. All stimuli are original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_FUNCTIONS_GRAPHS: LessonPlan = {
  id: 'evelyn.testprep.act.functions-graphs.v1',
  title: 'Functions & Their Graphs',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.functions-graphs',
      standard: 'ACT-2.5',
      description:
        'Evaluate functions from equations, tables, and graphs, and correctly compose two functions f(g(x)) in the order the problem specifies.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 19,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe function questions as fast, mechanical substitution — lowering anxiety and raising pace.',
      script:
        'Function notation questions show up on almost every ACT math test — usually a handful of the 60 questions, and you get about 60 seconds each. Here is the good news: f(x) is never a mystery, it is just a rule that tells you what to do to whatever gets plugged in. The only real danger is doing the steps in the wrong ORDER. Today we make "inside out" automatic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-function-notation',
      kind: 'concept',
      goal: 'Function notation as substitution, the inside-out method for composite functions, and the traps that cost points.',
      keyIdeas: [
        'f(x) IS THE RULE. f(a) means "wherever you see x in the rule, write a instead." Nothing more mysterious than that.',
        'COMPOSITE FUNCTIONS GO INSIDE OUT. To find f(g(x)), evaluate g(x) FIRST, get a number, then plug THAT number into f. Never plug x into both at once.',
        'TRAP 1 — WRONG ORDER: f(g(x)) and g(f(x)) are usually different values. Match the order the problem gives you exactly; do not swap them out of habit.',
        'TRAP 2 — REUSING THE ORIGINAL INPUT: after computing g(x) = 5, the next step evaluates f(5), NOT f(x) again. The 5 replaces x completely.',
        'READING A GRAPH: f(a) = b means the point (a, b) is ON the curve. To find f(a), start at a on the x-axis, go up/down to the curve, then read across to the y-axis.',
        'READING A TABLE: a function can be given as a table of x-values and f(x)-values. Composite lookups mean finding the OUTPUT of one row, then hunting for a NEW row that starts with that output.',
        'TRAP 3 — SIGN ERRORS ON NEGATIVE INPUTS: squaring or absolute-valuing a negative input, e.g. f(-3) with f(x) = x², is (-3)² = 9, not -9. Write the substitution in parentheses first.',
        'CHAINED COMPOSITES like f(f(x)) reuse the SAME rule twice: evaluate f once, then feed that output back into f again.',
      ],
      vocabulary: [
        { term: 'composite function', definition: 'a function built by plugging one function’s output into another, written f(g(x)) or (f∘g)(x).' },
        { term: 'domain', definition: 'the set of valid input (x) values a function accepts.' },
        { term: 'range', definition: 'the set of output (y) values a function produces.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-composite-basic',
      kind: 'worked_example',
      problem: 'If f(x) = 2x - 3 and g(x) = x² + 1, what is f(g(2))?',
      steps: [
        'Inside out: the innermost function is g, and its input is 2. Evaluate g(2) first.',
        'g(2) = (2)² + 1 = 4 + 1 = 5.',
        'Now use that result, 5, as the input to f — NOT the original 2.',
        'f(5) = 2(5) - 3 = 10 - 3 = 7.',
      ],
      answer: '7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-composite-trap',
      kind: 'worked_example',
      problem: 'If f(x) = x² - 4 and g(x) = 3x + 1, what is g(f(-2))?',
      steps: [
        'The order here is g(f(-2)) — f is innermost this time, so evaluate f(-2) first, not g.',
        'Substitute carefully with parentheses: f(-2) = (-2)² - 4 = 4 - 4 = 0. (Squaring the negative gives a POSITIVE 4, not -4.)',
        'Now feed that result, 0, into g: g(0) = 3(0) + 1 = 0 + 1 = 1.',
        'Sanity check: if a student swapped the order and computed f(g(-2)) instead, they would get a different, wrong answer — always match the order given.',
      ],
      answer: '1',
      estimatedMinutes: 3,
    },
    {
      id: 'try-composite-equations',
      kind: 'try_yourself',
      problem: 'If f(x) = 4x - 1 and g(x) = x², what is f(g(3))?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '11' },
        { id: 'b', text: '23' },
        { id: 'c', text: '35', correct: true },
        { id: 'd', text: '32' },
      ],
      expectedAnswer: '35',
      hints: [
        'Work inside out: find g(3) first, then plug that result into f.',
        'g(3) = 3² = 9 (not 3×2 = 6). Then f(9) = 4(9) - 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-composite-table',
      kind: 'try_yourself',
      problem:
        'Two functions are given by tables. f: x = 1,2,3,4 → f(x) = 3,1,4,2. g: x = 1,2,3,4 → g(x) = 2,4,1,3. What is f(g(2))?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4' },
        { id: 'b', text: '1' },
        { id: 'c', text: '2', correct: true },
        { id: 'd', text: '3' },
      ],
      expectedAnswer: '2',
      hints: [
        'Work inside out: look up g(2) first from the g table — that row starts with x = 2.',
        'g(2) = 4, so now look up f(4) — a NEW row of the f table, not f(2). f(4) = 2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-composite-numeric',
      kind: 'try_yourself',
      problem: 'Type your answer: If f(x) = x² + 2x and g(x) = x - 5, what is f(g(6))?',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'First evaluate the inside function: g(6).',
        'g(6) = 6 - 5 = 1, so now find f(1) = 1² + 2(1).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-reused-input',
      kind: 'misconception_check',
      question:
        'A student is asked to find g(f(3)) where f(x) = x + 4 and g(x) = 2x. They compute f(3) = 7, then plug the ORIGINAL 3 back into g, getting g(3) = 6. What went wrong, and what is the correct answer?',
      commonErrors: [
        {
          answer: '6',
          misconception: 'Plugging the original input back into the outer function instead of the inner function’s OUTPUT.',
          correctsTo: 'After computing f(3) = 7, that 7 becomes the new input: g(7) = 2(7) = 14, not g(3).',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Composite functions evaluate INSIDE OUT: compute the inner function first, then feed that result into the outer function.',
        'f(g(x)) and g(f(x)) are usually different — always match the exact order the problem gives.',
        'On a graph, f(a) = b means the point (a, b) sits on the curve; on a table, look up the row for the CURRENT input at each step, not the original x.',
        'About 60 seconds per question — write down the intermediate result before finishing the outer step.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.5', cedTitle: 'Functions & Their Graphs' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
