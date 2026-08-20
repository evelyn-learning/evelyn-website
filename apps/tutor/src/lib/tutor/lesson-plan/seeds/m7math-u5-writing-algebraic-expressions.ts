/**
 * Grade 7 Math — Expressions: Writing Algebraic Expressions.
 *
 * The bridge from a sentence to a symbol (CCSS 7.EE.A.2, 6.EE.A.2). A letter
 * stands in for a number nobody has picked yet, and the words around it pick
 * the operation. The whole lesson is built around one trap: "less than" and
 * "subtracted from" reverse the order they are spoken in, so "5 less than n"
 * is n − 5 and never 5 − n. Division reverses the same way; addition and
 * multiplication do not.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U5_WRITING_ALGEBRAIC_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.ms.m7math.writing-algebraic-expressions.v1',
  title: 'Writing Algebraic Expressions',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.writing-algebraic-expressions',
      standard: 'M7MATH-5.1',
      description:
        'Define a variable and translate words and real situations into algebraic expressions, naming terms, coefficients and constants, and handling the order-sensitive phrases "less than" and "divided into" (CCSS 7.EE.A.2, 6.EE.A.2).',
    },
  ],
  prerequisites: ['m7math.simple-interest-and-percent-error'],
  followUps: ['m7math.evaluating-expressions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that one short expression can say what a whole pile of sentences would take.',
      script:
        'A friend at your lunch table says: I have three more trading cards than you do. That is a real fact, but it does not name a number, because the number depends on you. If you have 10 cards, your friend has 13. If you have 40, your friend has 43. Algebra says all of that at once. Call your pile c. Then your friend has c + 3, and that one short line covers every case at the same time. Today we turn sentences into expressions like that one. We also meet the two little words that will wreck your answer if you write the symbols down in the order you hear them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translation',
      kind: 'concept',
      goal: 'Define the variable, map words to operations, name the parts of an expression, and expose the order trap.',
      keyIdeas: [
        'A VARIABLE IS A PLACEHOLDER — a letter standing in for a number nobody has picked yet. Say what it means in words before you use it: let c = the number of trading cards you have. A letter with no meaning attached is where most word-problem mistakes start.',
        'THE WORD BANK — add: sum, total, more than, increased by, plus. Subtract: difference, less than, fewer than, decreased by, minus, take away. Multiply: product, times, twice, double, each, per, of. Divide: quotient, divided by, split evenly, shared equally.',
        'THE ORDER TRAP — "less than" and "subtracted from" say the amount you REMOVE first and the amount you START WITH second, so the symbols come out in the opposite order from the words. "5 less than n" is n − 5. It is NOT 5 − n. Test it with a number you can check in your head: 5 less than 12 is 7, and n − 5 gives 12 − 5 = 7, while 5 − n gives 5 − 12 = −7.',
        'ADDING AND MULTIPLYING DO NOT REVERSE — "5 more than n" is n + 5, and 5 + n is the same thing, so the trap cannot bite there. Subtraction and division are the two operations where switching the order changes the answer, and those are exactly the two places to slow down. "The quotient of n and 4" is n/4, first number named on top.',
        'THE PARTS OF AN EXPRESSION — an expression breaks into TERMS at every + and − sign. In 4n + 7 the terms are 4n and 7. The number multiplying the variable is the COEFFICIENT, so 4 is the coefficient of n. A term that is just a number is a CONSTANT, so 7 is the constant. In a real situation the constant is usually the one-time amount and the coefficient comes from the word "each" or "per".',
        'A WHOLE PHRASE NEEDS PARENTHESES — "the sum of n and 7" is one chunk. If something acts on that whole chunk, wrap it: "twice the sum of n and 7" is 2(n + 7), not 2n + 7. Without the parentheses the 2 only reaches the n.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a letter standing in for a number that is unknown or that can change, such as the c in c + 3.' },
        { term: 'term', definition: 'one piece of an expression, separated from the next by a + or − sign: 4n and 7 in 4n + 7.' },
        { term: 'coefficient', definition: 'the number multiplying the variable in a term — the 4 in 4n.' },
        { term: 'constant', definition: 'a term that is just a number, with no variable attached, such as the 7 in 4n + 7.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-real-scenario',
      kind: 'worked_example',
      problem: 'You already have 25 dollars saved, and you add 6 dollars to the jar every week. Write an expression for the total in the jar after w weeks, then name the coefficient and the constant.',
      steps: [
        'Say what the letter means: let w = the number of weeks you have been saving.',
        'Find the part that does not change. The 25 dollars is already in the jar no matter how many weeks go by, so 25 is the constant.',
        'Find the part that grows. Six dollars EVERY week means 6 times the number of weeks, which is 6w. The word "every" is what hands you the coefficient 6.',
        'Put the two pieces together: 25 + 6w. This expression has two terms, 25 and 6w.',
        'Name the parts: the coefficient is 6, and the constant is 25.',
        'Sanity check with a small number. After 4 weeks the expression gives 25 + 6(4) = 25 + 24 = 49 dollars. Counting it out the slow way, 4 weeks of 6 dollars is 24 dollars added to the 25 you started with, which is also 49.',
      ],
      answer: '25 + 6w; coefficient 6, constant 25',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-traps',
      kind: 'worked_example',
      problem: 'Translate each phrase: (a) 6 less than four times a number n; (b) twice the sum of a number n and 7.',
      steps: [
        'Part (a) — build the inside piece first. "Four times a number n" is 4n.',
        'Now apply "6 less than". That phrase reverses: you start at 4n and take 6 away. The expression is 4n − 6. WRONG answer to avoid: 6 − 4n, which is what you get by writing the symbols in the order the words are spoken. RIGHT answer: 4n − 6.',
        'Settle it with a number. Let n = 5. Four times 5 is 20, and 6 less than 20 is 14. Check the right version: 4(5) − 6 = 20 − 6 = 14. Check the wrong version: 6 − 4(5) = 6 − 20 = −14. The number test decides it every time.',
        'Part (b) — again build the inside piece first. "The sum of a number n and 7" is n + 7, and that is one chunk.',
        'The word "twice" doubles the WHOLE chunk, not just the n, so the chunk gets parentheses: 2(n + 7). WRONG answer to avoid: 2n + 7, which doubles only the n and leaves the 7 alone. RIGHT answer: 2(n + 7).',
        'Number test again with n = 3. The sum is 3 + 7 = 10, and twice 10 is 20. Check: 2(3 + 7) = 2(10) = 20. The wrong version gives 2(3) + 7 = 13.',
      ],
      answer: '(a) 4n − 6   (b) 2(n + 7)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-less-than-order',
      kind: 'try_yourself',
      problem: 'Which expression means "7 less than the product of 3 and x"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3x − 7', correct: true },
        { id: 'b', text: '7 − 3x' },
        { id: 'c', text: '3(x − 7)' },
        { id: 'd', text: '3x + 7' },
      ],
      expectedAnswer: '3x − 7',
      hints: [
        'Write the inside piece by itself first. "The product of 3 and x" is 3x.',
        '"Less than" reverses the order. Test it with x = 10: the product is 30, and 7 less than 30 is 23.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-scenario',
      kind: 'try_yourself',
      problem: 'A pizza costs 12 dollars, and each extra topping costs 2 dollars. Which expression gives the total cost in dollars for t toppings?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12 + 2t', correct: true },
        { id: 'b', text: '12t + 2' },
        { id: 'c', text: '14t' },
        { id: 'd', text: '2(12 + t)' },
      ],
      expectedAnswer: '12 + 2t',
      hints: [
        'Which amount happens exactly once, and which amount repeats for every topping?',
        'The repeating amount is the one that gets multiplied by t. The one-time amount is the constant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-translate-evaluate',
      kind: 'try_yourself',
      problem: 'Write an expression for "5 less than twice a number n", then find its value when n = 9. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '13',
      hints: [
        '"Twice a number n" is 2n. Then "5 less than" that means you start at 2n and take 5 away.',
        'The expression is 2n − 5. Now put 9 in place of n: 2(9) − 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-order-reversal',
      kind: 'misconception_check',
      question: 'A student writes "9 less than a number n" as 9 − n, and on the next line writes "the quotient of n and 4" as 4/n. What went wrong each time?',
      commonErrors: [
        {
          answer: '9 − n',
          misconception: 'Writing the symbols in the same left-to-right order the words are spoken, as if "less than" were just another way of saying "minus".',
          correctsTo: 'The correct expression is n − 9. "Less than" names the amount being removed FIRST and the starting amount SECOND, so the symbols come out reversed. Check it with a number: 9 less than 20 is 11. RIGHT: n − 9 gives 20 − 9 = 11. WRONG: 9 − n gives 9 − 20 = −11. Only "minus" and "decreased by" keep the spoken order.',
        },
        {
          answer: '4/n',
          misconception: 'Putting the second number named on top, the same order-flip mistake in a different costume.',
          correctsTo: 'The correct expression is n/4, because "the quotient of a and b" always puts the first number named on top. Check it with n = 12: the quotient of 12 and 4 is 3. RIGHT: n/4 gives 12/4 = 3. WRONG: 4/n gives 4/12, which is one third. Division and subtraction are the two operations where order changes the answer, so those are the two to slow down on.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Say what your letter means before you use it: let w = the number of weeks.',
        '"Less than" and "subtracted from" reverse the order: 5 less than n is n − 5, never 5 − n.',
        '"The quotient of n and 4" puts the first number named on top: n/4.',
        'An expression splits into terms; the number multiplying the variable is the coefficient, and a lone number is the constant. In 25 + 6w the coefficient is 6 and the constant is 25.',
        'When something acts on a whole phrase, wrap the phrase in parentheses: twice the sum of n and 7 is 2(n + 7).',
        'When you are unsure of the order, test your expression with an easy number you can check in your head.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Writing Algebraic Expressions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
