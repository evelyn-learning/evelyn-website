/**
 * Algebra 1 — Foundations: Translating Words into Algebraic Expressions.
 *
 * The bridge between a sentence and a symbol (CCSS A-SSE.A.1, with a
 * lead-in to A-CED.A.1): define the variable, pick the operation, and
 * respect the order-sensitive phrases ("less than", "quotient of") that
 * quietly wreck word problems for the rest of the course.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U1_TRANSLATING_WORDS_TO_ALGEBRA: LessonPlan = {
  id: 'evelyn.hs.alg1.translating-words-to-algebra.v1',
  title: 'Translating Words into Algebraic Expressions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.translating-words-to-algebra',
      standard: 'ALG1-1.4',
      description:
        'Define a variable and translate verbal phrases and real-world scenarios into algebraic expressions, including the order-sensitive wording "less than", "subtracted from", and "quotient of", and grouped phrases such as "twice the sum of" (CCSS A-SSE.A.1, lead-in to A-CED.A.1).',
    },
  ],
  prerequisites: ['alg1.simplifying-expressions'],
  followUps: ['alg1.one-two-step-equations'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame translation as the step that turns a real situation into math you can actually solve.',
      script:
        'Nobody hands you 5h + 40 in real life. They hand you a rideshare quote: forty dollars to reserve the car, five dollars an hour after that. Algebra only helps once somebody turns that sentence into symbols — and that somebody is you. Today we build the translation habit, because every word problem for the rest of this course starts here.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translation',
      kind: 'concept',
      goal: 'Define the variable, map words to operations, and handle the phrases where word order and symbol order disagree.',
      keyIdeas: [
        'STEP ZERO — DEFINE THE VARIABLE, in writing, with units: "let m = number of months", not just "let m = months". A nameless variable is where most word-problem errors are born.',
        'THE WORD BANKS — addition: sum, total, increased by, more than, plus. Subtraction: difference, decreased by, less than, fewer than, minus, take away. Multiplication: product, times, twice, triple, of, each, per. Division: quotient, divided by, ratio, split evenly, per (when it means shared out).',
        'THE ORDER TRAP — "less than" and "subtracted from" REVERSE the order you read: "5 less than x" is x − 5, and "5 subtracted from x" is x − 5. Both are NOT 5 − x. Sanity check with a number: 5 less than 12 is 7, and 12 − 5 = 7. ✓',
        'ADDITION DOES NOT REVERSE — "5 more than x" is x + 5, which also equals 5 + x, so the trap only bites subtraction and division. Order matters exactly where the operation is not commutative.',
        'QUOTIENT ORDER — "the quotient of a and b" means a/b, first number on top. "The quotient of 12 and n" is 12/n; "n divided into 12" is also 12/n, but "n divided by 12" is n/12.',
        'PARENTHESES = A PHRASE TREATED AS ONE CHUNK — "the sum of n and 7" is a single quantity, so "twice the sum of n and 7" is 2(n + 7), not 2n + 7. If a word like twice, half, or squared acts on a whole phrase, wrap the phrase.',
        'REAL SCENARIOS FOLLOW ONE SHAPE — a fixed amount plus a rate times a quantity: cost = start-up + (rate)(quantity), as in 40 + 5h. Spot the "per" word and you have found the coefficient.',
        'EXPRESSION vs EQUATION — an expression is a phrase with no equals sign (3n − 7). Once the words say "is", "equals", or "results in", you have an equation instead, which is the next lesson.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a letter standing for an unknown quantity, always defined with its unit before use.' },
        { term: 'coefficient', definition: 'the number multiplying a variable — in 5h, the 5 is the coefficient and usually comes from a "per" phrase.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-real-scenario',
      kind: 'worked_example',
      problem:
        'A gym charges a one-time 30 dollar sign-up fee plus 25 dollars each month. Write an expression for the total cost in dollars after m months, then find the cost of 6 months.',
      steps: [
        'Define the variable: let m = number of months of membership.',
        'Find the fixed part: the 30 dollar sign-up fee happens once, no matter how many months — it is a constant, 30.',
        'Find the rate part: "25 dollars each month" means 25 times the number of months, or 25m. The word "each" gives you the coefficient.',
        'Combine: total cost = 30 + 25m.',
        'Evaluate at m = 6: 30 + 25(6) = 30 + 150 = 180, so 6 months costs 180 dollars. Sanity check: six months of dues alone is 150, plus the one-time 30. ✓',
      ],
      answer: '30 + 25m; 180 dollars for 6 months',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-traps',
      kind: 'worked_example',
      problem:
        'Translate each phrase: (a) 7 less than three times a number n; (b) the quotient of n and 4, increased by 9.',
      steps: [
        'Part (a) — build the inner piece first: "three times a number n" is 3n.',
        'Now apply "7 less than". This phrase REVERSES: you start from 3n and take 7 away, giving 3n − 7. The tempting wrong answer is 7 − 3n.',
        'Test part (a) with a number: let n = 5. Three times 5 is 15, and 7 less than 15 is 8. Check: 3(5) − 7 = 8 ✓, while 7 − 3(5) = −8 ✗. The number test settles the order every time.',
        'Part (b) — "the quotient of n and 4" puts the first-named number on top: n/4.',
        'Then "increased by 9" adds on the outside: n/4 + 9. Note that "increased by" does not reverse, so no parentheses and no flipping.',
      ],
      answer: '(a) 3n − 7   (b) n/4 + 9',
      estimatedMinutes: 3,
    },
    {
      id: 'try-less-than',
      kind: 'try_yourself',
      problem: 'Which expression represents "8 less than the product of 4 and x"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4x − 8', correct: true },
        { id: 'b', text: '8 − 4x' },
        { id: 'c', text: '4(x − 8)' },
        { id: 'd', text: '4 + x − 8' },
      ],
      expectedAnswer: '4x − 8',
      hints: [
        'Translate the inner phrase first: "the product of 4 and x" is 4x.',
        '"Less than" reverses — test it with x = 10: the product is 40, and 8 less than 40 is 32.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-twice-the-sum',
      kind: 'try_yourself',
      problem: 'Which expression represents "twice the sum of a number n and 7"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2(n + 7)', correct: true },
        { id: 'b', text: '2n + 7' },
        { id: 'c', text: '7(n + 2)' },
        { id: 'd', text: '(n + 7)/2' },
      ],
      expectedAnswer: '2(n + 7)',
      hints: [
        '"The sum of a number n and 7" is one chunk — write it down by itself first.',
        '"Twice" doubles that whole chunk, not just the n, so the chunk needs parentheses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Translate "6 less than the product of 5 and a number n" into an expression, then evaluate it when n = 4. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '14',
      hints: [
        'The product of 5 and n is 5n; "6 less than" that means you subtract 6 from it.',
        'The expression is 5n − 6. Substitute n = 4: 5(4) − 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-less-than-order',
      kind: 'misconception_check',
      question: 'A student translates "12 less than a number n" as 12 − n. What went wrong, and what is the correct expression?',
      commonErrors: [
        {
          answer: '12 − n',
          misconception:
            'Writing the symbols in the same left-to-right order the words are spoken, as if "less than" behaved like "minus".',
          correctsTo:
            'The correct expression is n − 12. "Less than" names the amount removed FIRST and the starting quantity SECOND, so the order flips. Confirm with a number: 12 less than 30 is 18, and n − 12 gives 30 − 12 = 18 ✓, while 12 − n gives 12 − 30 = −18 ✗. Only "minus" and "decreased by" keep the spoken order.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Define the variable first, in writing, with its unit: "let m = number of months".',
        '"Less than" and "subtracted from" reverse the order: 5 less than x is x − 5.',
        '"The quotient of a and b" is a/b — the first number named goes on top.',
        'A phrase acted on as a whole needs parentheses: twice the sum of n and 7 is 2(n + 7).',
        'Real scenarios are fixed amount + rate times quantity; the "per" or "each" word hands you the coefficient.',
        'When in doubt, test the translation with an easy number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Translating Words into Algebraic Expressions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
