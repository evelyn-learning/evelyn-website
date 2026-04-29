/**
 * G6 — Expressions and variables (writing, evaluating, simplifying).
 *
 * The transition from arithmetic to algebra. A variable is a letter
 * that stands for a number we don't know yet (or that can change).
 * Writing expressions from words ("3 more than n" → n + 3),
 * evaluating expressions for given values, and combining like terms.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_MATH_EXPRESSIONS_VARIABLES: LessonPlan = {
  id: 'evelyn.g6.math.expressions-variables.v1',
  title: 'Variables and Expressions',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'expressions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.6.ee.a.2',
      description: 'Write, read, and evaluate expressions in which letters stand for numbers.',
      standard: 'CCSS.MATH.CONTENT.6.EE.A.2',
    },
    {
      id: 'ccss.math.6.ee.a.4',
      description: 'Identify when two expressions are equivalent.',
      standard: 'CCSS.MATH.CONTENT.6.EE.A.4',
    },
  ],
  prerequisites: ['ccss.math.5.oa.a.1'],
  followUps: ['ccss.math.7.ee.a.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that letters stand in for "any number" in flexible math.',
      script: 'You and your friend each have some apples. You have 3 more than they do. If they have 5, you have 8. If they have 10, you have 13. Instead of writing this every time, we use a letter — say a — for "however many apples your friend has." Then YOUR apples = a + 3. One short rule, works for any number.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variables-and-eval',
      kind: 'concept',
      goal: 'A variable is a number-shaped placeholder. Substitution turns expressions into computable numbers.',
      keyIdeas: [
        'A VARIABLE is a letter that stands for a number. (Common letters: x, y, n, a.)',
        'An EXPRESSION is a math phrase that uses variables, numbers, and operations — but NO equals sign.',
        'Examples: 3x, n + 5, 2y - 7, 4(a + b).',
        'TERM: a single piece of an expression separated by + or -. In "3x + 7 - 2y", terms are 3x, +7, and -2y.',
        'COEFFICIENT: the number multiplied by a variable. In "3x", the coefficient is 3.',
        'CONSTANT: a number with no variable. The "7" in "3x + 7".',
        'EVALUATING an expression: substitute given values and compute. If x = 4, then 3x + 7 = 3(4) + 7 = 12 + 7 = 19.',
        'In algebra notation: 3x means 3 × x. Multiplication signs are usually dropped between a number and a variable.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a letter that represents a number.' },
        { term: 'coefficient', definition: 'the number multiplied by a variable.' },
        { term: 'constant', definition: 'a number on its own (no variable).' },
        { term: 'term', definition: 'a part of an expression separated by + or -.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-evaluate',
      kind: 'worked_example',
      problem: 'Evaluate 2x + 5 when x = 7.',
      steps: [
        'Substitute: replace x with 7. Expression becomes 2(7) + 5.',
        'Multiplication first (PEMDAS): 2 × 7 = 14.',
        'Add: 14 + 5 = 19.',
        'Answer: 19.',
      ],
      answer: '19',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-write',
      kind: 'worked_example',
      problem: 'Write an expression for "5 less than three times a number n".',
      steps: [
        'Identify the parts: "three times a number n" → 3n. "5 less than that" → subtract 5.',
        'Watch the order: "5 less than X" means X - 5, NOT 5 - X. ("5 less than 10" is 5, not -5.)',
        'Final expression: 3n - 5.',
        'Sense-check: if n = 4, expression = 3(4) - 5 = 12 - 5 = 7. "5 less than 12" — yes, 7.',
      ],
      answer: '3n - 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate 4a - 3 when a = 5.',
      expectedAnswer: '17',
      responseFormat: 'numeric',
      hints: [
        'Substitute a = 5: 4(5) - 3.',
        'Multiplication first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-less-than-order',
      kind: 'misconception_check',
      question: 'Asha is asked to write "7 less than n" and writes 7 - n. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reading "less than" left-to-right and putting the 7 first.',
          correctsTo: '"7 less than n" means n - 7. The "less than" reverses the order. Test: "7 less than 20" should be 13, not -13. So it\'s 20 - 7, not 7 - 20.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Variable = letter standing for a number.',
        'Expression = math phrase, NO equals sign.',
        '3x means 3 × x. Coefficient (3) times variable (x).',
        'Evaluate: substitute, then use PEMDAS.',
        '"X less than Y" = Y - X (subtract second from first).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Evaluate 3(x + 2) - x when x = 4.',
      hint: 'Substitute: 3(4 + 2) - 4. Parentheses first: 3(6) - 4 = 18 - 4 = 14.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
