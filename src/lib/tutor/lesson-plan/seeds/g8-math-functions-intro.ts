/**
 * G8 — Functions intro (function definition, function notation, input/output).
 *
 * The first formal definition of a function. ONE input → exactly ONE
 * output. The vending-machine metaphor (push button → predictable
 * snack). Function notation f(x) and the function-as-rule view.
 * Recognizing functions vs non-functions in tables, graphs (vertical
 * line test), mappings.
 */

import type { LessonPlan } from '../types';

export const SEED_G8_MATH_FUNCTIONS_INTRO: LessonPlan = {
  id: 'evelyn.g8.math.functions.intro.v1',
  title: 'Functions: Inputs and Outputs',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'math',
  topic: 'functions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.8.f.a.1',
      description: 'Understand that a function is a rule that assigns to each input exactly one output.',
      standard: 'CCSS.MATH.CONTENT.8.F.A.1',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.2'],
  followUps: ['ccss.math.8.f.a.2', 'ccss.math.hsa.rei.d.10'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a vending machine to make function = predictable rule.',
      script: 'You walk up to a vending machine. Press B4, you get a granola bar — every time. Press D2, you get gum — every time. One button, one snack, no surprises. That predictable "one input, one output" is what mathematicians mean by a FUNCTION.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-function-rule',
      kind: 'concept',
      goal: 'Function = rule that gives EXACTLY ONE output per input. Notation f(x).',
      keyIdeas: [
        'A FUNCTION is a rule that takes an input and gives back exactly ONE output.',
        'INPUT (x): the value you put in. Also called the independent variable or "domain" element.',
        'OUTPUT (y or f(x)): the value the rule gives back. Dependent variable.',
        'NOTATION: f(x) is read "f of x". It means "the output of function f when the input is x."',
        'f(x) = 2x + 1 means: take any input, double it, add 1. f(3) = 2(3) + 1 = 7.',
        'NOT a function if ONE input gives MULTIPLE outputs. (Inputs giving the SAME output is fine — many → one is OK; one → many is not.)',
        'Vertical line test on a graph: if any vertical line crosses the graph more than once, it\'s NOT a function.',
      ],
      vocabulary: [
        { term: 'function', definition: 'a rule assigning exactly one output to each input.' },
        { term: 'input', definition: 'the value (x) you give the function.' },
        { term: 'output', definition: 'the value (y or f(x)) the function returns.' },
        { term: 'function notation', definition: 'f(x) — "f of x" — naming the output for input x.' },
      ],
      suggestedTools: ['show_table', 'show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-evaluate',
      kind: 'worked_example',
      problem: 'For f(x) = 3x - 4, find f(2), f(0), and f(-1).',
      steps: [
        'f(2): substitute x = 2 → 3(2) - 4 = 6 - 4 = 2.',
        'f(0): substitute x = 0 → 3(0) - 4 = 0 - 4 = -4.',
        'f(-1): substitute x = -1 → 3(-1) - 4 = -3 - 4 = -7.',
        'So f(2) = 2, f(0) = -4, f(-1) = -7.',
      ],
      answer: 'f(2) = 2, f(0) = -4, f(-1) = -7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-not-a-function',
      kind: 'worked_example',
      problem: 'Is the table a function? x: 1, 2, 3, 1. y: 5, 7, 9, 11.',
      steps: [
        'Check: does any input (x) appear twice with DIFFERENT outputs?',
        'x = 1 appears twice. Once with y = 5, once with y = 11.',
        'One input giving two different outputs → NOT a function.',
        'A vending machine that sometimes gives a granola bar and sometimes gum for the same button isn\'t reliable — that\'s not a function.',
      ],
      answer: 'Not a function',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For f(x) = x² + 1, find f(4).',
      expectedAnswer: '17',
      responseFormat: 'numeric',
      hints: [
        'Substitute x = 4: 4² + 1.',
        '4² = 16, then + 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-many-to-one',
      kind: 'misconception_check',
      question: 'Mira sees a table where x = 2 gives y = 5 AND x = 8 gives y = 5 too. She says "Two inputs same output → not a function." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing "same output for different inputs" (allowed) with "different outputs for same input" (not allowed).',
          correctsTo: 'No. Many-to-one is fine — different inputs CAN give the same output. (Two buttons could give the same snack.) The rule is each INPUT gets only ONE output. f(x) = 5 (a constant function) is a valid function — every input maps to 5.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Function = rule. One input → exactly one output.',
        'Many inputs CAN share an output. One input CANNOT give multiple outputs.',
        'f(x) is the output of f at input x.',
        'Vertical line test: passes through a graph more than once → not a function.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'For f(x) = 2x + 5 and g(x) = x², find f(3) and g(3). Are they equal?',
      hint: 'f(3) = 2(3) + 5 = 11. g(3) = 3² = 9. Different rules, different outputs at x = 3.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
