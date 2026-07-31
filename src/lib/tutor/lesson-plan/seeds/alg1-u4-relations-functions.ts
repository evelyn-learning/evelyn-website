/**
 * Algebra 1 — Functions: Relations, Functions & Function Notation.
 *
 * The vocabulary gate for the back half of Algebra 1 (CCSS F-IF.A.1,
 * F-IF.A.2): what makes a relation a function, the vertical line test,
 * reading domain and range off sets and graphs, and the f(x) machine.
 * Every later unit — slope, linear models, quadratics — is phrased in
 * this language.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U4_RELATIONS_FUNCTIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.relations-functions.v1',
  title: 'Relations, Functions & Function Notation',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.relations-functions',
      standard: 'ALG1-4.1',
      description:
        'Decide whether a relation is a function using the one-output rule and the vertical line test, state domain and range from sets and graphs, and evaluate functions written in f(x) notation (CCSS F-IF.A.1, F-IF.A.2).',
    },
  ],
  prerequisites: ['alg1.absolute-value'],
  followUps: ['alg1.slope-rate-of-change'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a function as a reliable machine — and function notation as the shorthand the rest of the course is written in.',
      script:
        'A vending machine that gives you a different snack every time you press B4 is a broken machine. Functions are the math version of a machine you can trust: one input, one guaranteed output. Once we name that machine f, we can write f(3) and everyone knows exactly what we mean. Every graph, every model, every formula from here on is written in that language — so let us learn it properly today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-function-language',
      kind: 'concept',
      goal: 'Relation vs function, the vertical line test, domain and range, and how to read and evaluate f(x).',
      keyIdeas: [
        'RELATION — any set of ordered pairs (input, output). A relation pairs x-values with y-values; that is all it promises.',
        'FUNCTION — a relation where every input has EXACTLY ONE output. Check the x-values: if the same x appears twice with two different y-values, it is not a function.',
        'REPEATED OUTPUTS ARE FINE — {(1, 5), (2, 5), (3, 5)} is a function. Many inputs may share an output; one input may never have two outputs.',
        'VERTICAL LINE TEST — on a graph, if any vertical line hits the curve more than once, that x has two outputs and the graph is not a function. A circle fails; a parabola opening up passes.',
        'DOMAIN AND RANGE FROM A SET — domain is the set of inputs (x-values), range is the set of outputs (y-values). List each value once, in increasing order.',
        'DOMAIN AND RANGE FROM A GRAPH — sweep left-to-right for the domain (which x-values are covered), bottom-to-top for the range (which y-values are reached).',
        'FUNCTION NOTATION — f(x) is the NAME of the output when the input is x. It is read "f of x", not "f times x". The equations y = 2x + 1 and f(x) = 2x + 1 say the same thing.',
        'EVALUATING f(a) — replace every x with a, in parentheses, then simplify: for f(x) = x² + 1, f(−3) = (−3)² + 1 = 10. Those parentheses are what keep the negative inside the square.',
      ],
      vocabulary: [
        { term: 'domain', definition: 'the set of all allowed inputs (x-values) of a relation.' },
        { term: 'range', definition: 'the set of all outputs (y-values) a relation produces.' },
        { term: 'function notation', definition: 'writing the output as f(x) — read "f of x" — so a specific input can be named, as in f(4).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-relation-to-domain-range',
      kind: 'worked_example',
      problem: 'Is the relation {(−3, 4), (−1, 0), (2, 4), (5, −6)} a function? State its domain and range.',
      steps: [
        'List the inputs: −3, −1, 2, 5. No x-value repeats, so no input has two different outputs.',
        'The output 4 appears twice, at x = −3 and x = 2 — that is allowed. Only repeated INPUTS break a function.',
        'So yes, it is a function. Domain = the inputs, written once each in order: {−3, −1, 2, 5}.',
        'Range = the outputs, written once each in order: {−6, 0, 4}. The duplicate 4 is listed a single time.',
      ],
      answer: 'Yes, a function. Domain {−3, −1, 2, 5}; range {−6, 0, 4}',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evaluate-negative',
      kind: 'worked_example',
      problem: 'For f(x) = x² − 4x, find f(−3).',
      steps: [
        'f(−3) means substitute −3 for x. Write the parentheses first: f(−3) = (−3)² − 4(−3).',
        'Square the whole input: (−3)² = 9. This is the step students lose — without parentheses you would write −3² = −9, which squares only the 3.',
        'Handle the second term: −4(−3) = +12. A negative times a negative is positive.',
        'Add: 9 + 12 = 21. So f(−3) = 21. Note f(−3) is an OUTPUT, not "f times −3" and not an equation to solve for x.',
      ],
      answer: 'f(−3) = 21',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-function',
      kind: 'try_yourself',
      problem: 'Which of these relations is NOT a function?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '{(1, 2), (2, 4), (3, 6), (4, 8)}' },
        { id: 'b', text: '{(0, 5), (1, 5), (2, 5), (3, 5)}' },
        { id: 'c', text: '{(2, 1), (3, 4), (2, 7), (5, 9)}', correct: true },
        { id: 'd', text: '{(−4, 1), (−2, 2), (0, 3), (2, 4)}' },
      ],
      expectedAnswer: '{(2, 1), (3, 4), (2, 7), (5, 9)}',
      hints: [
        'Look only at the first number in each pair — the inputs. Does any input show up twice?',
        'In one option the input 2 is paired with both 1 and 7. One input, two outputs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate',
      kind: 'try_yourself',
      problem: 'If f(x) = 5 − 2x, what is f(−4)?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '13', correct: true },
        { id: 'b', text: '−3' },
        { id: 'c', text: '−12' },
        { id: 'd', text: '4.5' },
      ],
      expectedAnswer: '13',
      hints: [
        'Substitute with parentheses: f(−4) = 5 − 2(−4). Keep the input negative.',
        'Subtracting a negative adds: 5 − (−8) = 5 + 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-range-count',
      kind: 'try_yourself',
      problem: 'The relation {(−5, 2), (−1, 7), (0, 2), (3, 9), (6, 7)} is a function. How many numbers are in its range? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3',
      hints: [
        'The range is the set of OUTPUTS — the second number in each pair.',
        'The outputs are 2, 7, 2, 9, 7. List each distinct value once and count them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-f-times-x',
      kind: 'misconception_check',
      question: 'Given f(x) = 2x + 1, a student writes f(3) = f · 3 = 3f. Another student decides f(3) means "set 2x + 1 equal to 3 and solve", getting x = 1. What went wrong in each case?',
      commonErrors: [
        {
          answer: '3f',
          misconception: 'Reading f(x) as multiplication, treating f as a variable multiplied by whatever is in the parentheses.',
          correctsTo: 'f is the NAME of the function, not a factor. f(3) is read "f of 3" and means "substitute 3 for x": f(3) = 2(3) + 1 = 7.',
        },
        {
          answer: 'x = 1',
          misconception: 'Confusing the input with the output — solving f(x) = 3 instead of evaluating f(3).',
          correctsTo: 'The number inside the parentheses is the INPUT. f(3) = 7 asks for the output at x = 3; the different question f(x) = 3 would ask which input gives output 3, which is x = 1.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Function = every input has exactly one output. Repeated inputs break it; repeated outputs do not.',
        'Vertical line test: a vertical line may cross the graph at most once.',
        'Domain = inputs (x), range = outputs (y); list each value once.',
        'f(x) is read "f of x", never "f times x".',
        'To find f(a), substitute a for every x using parentheses: for f(x) = x² − 4x, f(−3) = 9 + 12 = 21.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Relations, Functions & Function Notation' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
