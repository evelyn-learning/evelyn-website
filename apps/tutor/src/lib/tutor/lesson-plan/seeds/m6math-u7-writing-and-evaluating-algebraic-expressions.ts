/**
 * Grade 6 Math — Expressions & Exponents: Writing & Evaluating Algebraic
 * Expressions.
 *
 * PROCEDURE-LED fan-out row for m6math. Lesson 7.1 built numerical
 * expressions with exponents; this lesson introduces the letter that stands
 * for an unknown number and teaches two skills that always travel together:
 * translating a word phrase into an algebraic expression, and evaluating an
 * expression — including a formula — once given a number for the variable
 * (CCSS 6.EE.A.2a/c). The one trap this plan is built to kill is word-order
 * reversal in subtraction phrases: "5 less than n" is n - 5, not 5 - n, and
 * the misconception check confronts that error directly. A secondary trap,
 * evaluating an expression like 3n + 5 by adding the constant before
 * multiplying, is caught in the second worked example and reinforced in a
 * try_yourself item.
 *
 * SCOPE GUARD: this lesson writes and evaluates algebraic expressions with
 * ONE variable, using addition, subtraction, multiplication, and division,
 * for nonnegative whole-number values only — every chosen coefficient and
 * every substituted variable value is a nonnegative whole number (Grade 7
 * introduces negative and rational coefficients), and no exponent is placed
 * on a variable (that stays with row 7.1's numerical-exponent work). A
 * negative number appears twice, only as the wrong result of a flipped
 * subtraction ("5 - n" style), shown to be implausible and never carried
 * forward into further computation. This lesson never names the PARTS of an
 * expression (term, factor, coefficient — row 7.3), never rewrites an
 * expression into an equivalent form (row 7.4), and never solves an equation
 * for an unknown (Unit 8) — every value here is given, and every problem asks
 * only to write or evaluate, never to solve.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 7.1 -> 7.2 ->
 * 7.3. Row 7.1 (numerical-expressions-with-exponents) and row 7.3
 * (parts-of-an-expression) are authored elsewhere in this same fan-out and are
 * not yet registered when this file is written, but the controller wires and
 * lints the full 40-row batch together, so both loIds are written here now.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U7_WRITING_AND_EVALUATING_ALGEBRAIC_EXPRESSIONS: LessonPlan = {
  id: 'evelyn.ms.m6math.writing-and-evaluating-algebraic-expressions.v1',
  title: 'Writing & Evaluating Algebraic Expressions',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.writing-and-evaluating-algebraic-expressions',
      standard: 'M6MATH-7.2',
      description:
        'Write an algebraic expression from a word phrase and evaluate expressions (including formulas) for given variable values (CCSS 6.EE.A.2a/c).',
    },
  ],
  prerequisites: ['m6math.numerical-expressions-with-exponents'],
  followUps: ['m6math.parts-of-an-expression'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the need for a letter that stands for a number nobody has told them yet.',
      script:
        'You do not know how many text messages your friend sent you this week. You just know it was 8 more than last week. You cannot write down a number for "how many texts," because you do not know it. What you can write down is a letter, like n, standing in for that unknown count, and then build n + 8 around it. That is the whole idea behind an algebraic expression: a letter holds the place of a number until you are ready to find it. Today you learn how to turn a sentence into an expression like that, and how to plug in a number once someone finally tells you what the letter is worth.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-translate-and-evaluate',
      kind: 'concept',
      goal: 'Install the key-word-to-operation translation, the subtraction word-order trap, and the substitute-then-compute rule for evaluating.',
      keyIdeas: [
        'A VARIABLE STANDS FOR A NUMBER — a letter such as n, x, or w takes the place of a number that has not been given yet, or a number that can change from one problem to the next. It is not a mystery symbol; it just means "some number."',
        'KEY WORDS TELL YOU WHICH OPERATION TO WRITE — sum, total, more than, increased by, and plus all mean add (+). Product, times, and of mean multiply, and 6 times n is usually written as 6n, with no multiplication sign at all. Quotient and divided by mean divide (n ÷ 4, also written n/4). Difference, less than, and fewer than mean subtract (-), but subtraction needs extra care — see the next idea.',
        'WORD ORDER FLIPS FOR "LESS THAN" — "n minus 5" and "5 less than n" mean the exact same thing: start with n, then take away 5, so both are n - 5. WRONG: reading "5 less than n" left to right and writing 5 - n, just because 5 appears first in the sentence. CORRECT: n - 5. Say the phrase as "n, then take away 5" before writing anything, and the correct order follows every time.',
        'EVALUATING MEANS SUBSTITUTE, THEN COMPUTE — to evaluate an expression for a given value, replace every copy of the variable with that number, then follow the order of operations to find a single number. 3n + 5 evaluated at n = 4 becomes 3(4) + 5, which is 12 + 5 = 17. The plus 5 is never grouped with n unless parentheses say so, so multiply the 3 and the 4 first.',
        'A FORMULA IS AN EXPRESSION WITH A JOB — the perimeter formula for a rectangle, P = 2l + 2w, is an expression built from two variables, l and w, that always gives the perimeter once you know a length and a width. Evaluating a formula works exactly like evaluating any other expression: substitute the given values for the variables, then compute.',
        'CHECK YOUR EXPRESSION BY PLUGGING IN A NUMBER — pick any number for the variable, work out the word phrase in plain arithmetic, and see if your expression gives the same result. If "5 less than n" really is n - 5, then at n = 20 both should give 15. This catches a flipped subtraction before it turns into a wrong answer.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a letter that stands for a number, such as n or x.' },
        { term: 'expression', definition: 'a combination of numbers, variables, and operations, such as 3n + 5, with no equal sign.' },
        { term: 'evaluate', definition: 'to find the value of an expression by substituting a given number for the variable and then computing.' },
        { term: 'formula', definition: 'an expression that has a specific job, such as finding a perimeter, built from variables that stand for real quantities.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-translate-word-phrases',
      kind: 'worked_example',
      problem:
        'Write each word phrase as an algebraic expression. Use n for the unknown number. (a) 8 more than a number n. (b) the product of 6 and a number n. (c) 5 less than a number n. (d) the quotient of a number n and 4.',
      steps: [
        '(a) "More than" means add. The phrase adds 8 onto n, so the expression is n + 8.',
        '(b) "Product" means multiply. 6 multiplied by n is written 6 × n, or without the multiplication sign, 6n.',
        '(c) "5 less than a number n" means start with n and take away 5. WRONG: copying the numbers in the order the sentence names them and writing 5 - n. CORRECT: n - 5, because "less than" tells you the 5 is what gets subtracted FROM n, not the other way around.',
        'Check part (c) with a number: let n = 20. "5 less than 20" is 15 in plain English, and n - 5 = 20 - 5 = 15, which matches. 5 - n would give 5 - 20 = -5, a negative number, and this lesson only uses nonnegative values, so that mismatch is a warning sign that the order was flipped.',
        '(d) "Quotient" means divide. A number n divided by 4 is written n ÷ 4, or as a fraction, n/4.',
      ],
      answer: '(a) n + 8, (b) 6n, (c) n - 5, (d) n ÷ 4 (also written n/4)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evaluate-expression-and-formula',
      kind: 'worked_example',
      problem:
        'Evaluate each expression for the given value. (a) The perimeter of a rectangle is P = 2l + 2w, where l is the length and w is the width, both in feet. Find P when l = 9 feet and w = 6 feet. (b) Evaluate 3n + 5 when n = 4.',
      steps: [
        '(a) Substitute the given values in place of the variables: P = 2(9) + 2(6).',
        'Order of operations says multiply before you add. Compute each product first: 2(9) = 18 and 2(6) = 12.',
        'Add the two products: 18 + 12 = 30, so P = 30 feet.',
        'Check by rereading the story: a 9-by-6 rectangle has two sides of 9 feet and two sides of 6 feet, and 9 + 9 + 6 + 6 = 30, which matches.',
        '(b) Substitute n = 4 into 3n + 5, giving 3(4) + 5.',
        'WRONG: adding the 4 and the 5 first because they sit close together on the page, computing 3(4 + 5) = 3(9) = 27. CORRECT: the plus 5 is not inside parentheses with the n, so nothing groups it with the multiplication. Multiply first: 3(4) = 12, then add 5: 12 + 5 = 17.',
        'Check part (b) by substituting again from scratch: 3 × 4 = 12, and 12 + 5 = 17. The answer holds.',
      ],
      answer: '(a) 30 feet, (b) 17',
      estimatedMinutes: 3,
    },
    {
      id: 'try-translate-less-than',
      kind: 'try_yourself',
      problem: 'Which expression means "7 less than a number x"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7 - x' },
        { id: 'b', text: 'x - 7', correct: true },
        { id: 'c', text: 'x + 7' },
        { id: 'd', text: '7x' },
      ],
      expectedAnswer: 'x - 7',
      hints: [
        '"Less than" means start with the number named first in your thinking, which is the variable, and take away the other amount.',
        'Say the phrase as "x, then take away 7." That order gives x - 7, not 7 - x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-order-of-operations',
      kind: 'try_yourself',
      problem: 'Evaluate 4n + 3 when n = 5.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '32' },
        { id: 'b', text: '12' },
        { id: 'c', text: '20' },
        { id: 'd', text: '23', correct: true },
      ],
      expectedAnswer: '23',
      hints: [
        'Substitute first: replace n with 5 to get 4(5) + 3. Multiply before you add.',
        '4 × 5 = 20, and then add 3: 20 + 3 = 23. Do not add the 5 and the 3 together before multiplying.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-perimeter-formula',
      kind: 'try_yourself',
      problem:
        'A rectangular room has length l = 14 feet and width w = 8 feet. Use the formula P = 2l + 2w to find the perimeter, in feet. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '44',
      hints: [
        'Substitute the values into the formula: P = 2(14) + 2(8).',
        'Multiply each part first: 2(14) = 28 and 2(8) = 16. Then add: 28 + 16 = 44.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flipped-subtraction-and-early-addition',
      kind: 'misconception_check',
      question:
        'One student translates "6 less than a number y" as 6 - y. Another student evaluates 5m + 2 for m = 3 by computing 5(3 + 2) = 25. What went wrong in each case?',
      commonErrors: [
        {
          answer: '6 - y',
          misconception: 'Reading the phrase left to right and writing the numbers in the order they appear, instead of noticing that "less than" reverses that order.',
          correctsTo:
            '"6 less than a number y" means start with y and take away 6, so the correct expression is y - 6. Check with a number: if y = 10, "6 less than 10" is 4 in plain English, and y - 6 = 10 - 6 = 4, which matches. 6 - y would give 6 - 10 = -4, a negative number, and this course only uses nonnegative values, so that mismatch is a sign the order was flipped.',
        },
        {
          answer: '5(3 + 2) = 25',
          misconception: 'Adding the substituted number and the constant together before multiplying, because they sit next to each other in the written work.',
          correctsTo:
            '5m + 2 means multiply 5 by m first, then add 2. The plus 2 is not inside parentheses with m, so nothing groups it into the multiplication. Substituting m = 3 gives 5(3) + 2 = 15 + 2 = 17, not 25.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A variable is a letter that stands for a number that is unknown or that can change.',
        'Key words tell you the operation: sum/more than/plus means add, product/times means multiply, quotient/divided by means divide, difference/less than means subtract.',
        '"Less than" flips the word order: "5 less than n" is n - 5, not 5 - n.',
        'To evaluate an expression, substitute the given number for the variable, then follow the order of operations.',
        'A formula, such as P = 2l + 2w, is an expression with a job — evaluate it the same way as any other expression, by substituting and then computing.',
        'Check an expression by testing it with a number, and check an evaluation by rereading the answer against the original story.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Writing & Evaluating Algebraic Expressions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
