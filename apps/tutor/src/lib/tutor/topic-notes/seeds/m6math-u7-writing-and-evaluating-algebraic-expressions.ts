/**
 * Grade 6 Math — Unit 7 CED 7.2: Writing & Evaluating Algebraic Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.writing-and-evaluating-algebraic-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U7_WRITING_AND_EVALUATING_ALGEBRAIC_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.writing-and-evaluating-algebraic-expressions.v1',
  course: 'Grade 6 Math',
  cedUnit: 7,
  cedTopic: '7.2',
  cedTitle: 'Writing & Evaluating Algebraic Expressions',
  planId: 'evelyn.ms.m6math.writing-and-evaluating-algebraic-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.writing-and-evaluating-algebraic-expressions.v1' }],
  theory: [
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'framework', title: 'A variable stands for a number', content: `A VARIABLE STANDS FOR A NUMBER — a letter such as n, x, or w takes the place of a number that has not been given yet, or a number that can change from one problem to the next. It is not a mystery symbol; it just means "some number."` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'framework', title: 'Key words tell you which operation to write', content: `KEY WORDS TELL YOU WHICH OPERATION TO WRITE — sum, total, more than, increased by, and plus all mean add (+). Product, times, and of mean multiply, and 6 times n is usually written as 6n, with no multiplication sign at all. Quotient and divided by mean divide (n ÷ 4, also written n/4). Difference, less than, and fewer than mean subtract (-), but subtraction needs extra care — see the next idea.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', content: `WORD ORDER FLIPS FOR "LESS THAN" — "n minus 5" and "5 less than n" mean the exact same thing: start with n, then take away 5, so both are n - 5. WRONG: reading "5 less than n" left to right and writing 5 - n, just because 5 appears first in the sentence. CORRECT: n - 5. Say the phrase as "n, then take away 5" before writing anything, and the correct order follows every time.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'framework', title: 'Evaluating means substitute, then compute', content: `EVALUATING MEANS SUBSTITUTE, THEN COMPUTE — to evaluate an expression for a given value, replace every copy of the variable with that number, then follow the order of operations to find a single number. 3n + 5 evaluated at n = 4 becomes 3(4) + 5, which is 12 + 5 = 17. The plus 5 is never grouped with n unless parentheses say so, so multiply the 3 and the 4 first.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'framework', title: 'A formula is an expression with a job', content: `A FORMULA IS AN EXPRESSION WITH A JOB — the perimeter formula for a rectangle, P = 2l + 2w, is an expression built from two variables, l and w, that always gives the perimeter once you know a length and a width. Evaluating a formula works exactly like evaluating any other expression: substitute the given values for the variables, then compute.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'framework', title: 'Check your expression by plugging in a number', content: `CHECK YOUR EXPRESSION BY PLUGGING IN A NUMBER — pick any number for the variable, work out the word phrase in plain arithmetic, and see if your expression gives the same result. If "5 less than n" really is n - 5, then at n = 20 both should give 15. This catches a flipped subtraction before it turns into a wrong answer.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'definition', title: 'variable', content: 'a letter that stands for a number, such as n or x.' },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'definition', title: 'expression', content: `a combination of numbers, variables, and operations, such as 3n + 5, with no equal sign.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'definition', title: 'evaluate', content: `to find the value of an expression by substituting a given number for the variable and then computing.` },
    { loId: 'm6math.writing-and-evaluating-algebraic-expressions', kind: 'definition', title: 'formula', content: `an expression that has a specific job, such as finding a perimeter, built from variables that stand for real quantities.` },
  ],
  methods: [
    {
      title: 'Worked translate word phrases',
      steps: [
        '(a) "More than" means add. The phrase adds 8 onto n, so the expression is n + 8.',
        `(b) "Product" means multiply. 6 multiplied by n is written 6 × n, or without the multiplication sign, 6n.`,
        `(c) "5 less than a number n" means start with n and take away 5. WRONG: copying the numbers in the order the sentence names them and writing 5 - n. CORRECT: n - 5, because "less than" tells you the 5 is what gets subtracted FROM n, not the other way around.`,
        `Check part (c) with a number: let n = 20. "5 less than 20" is 15 in plain English, and n - 5 = 20 - 5 = 15, which matches. 5 - n would give 5 - 20 = -5, a negative number, and this lesson only uses nonnegative values, so that mismatch is a warning sign that the order was flipped.`,
        `(d) "Quotient" means divide. A number n divided by 4 is written n ÷ 4, or as a fraction, n/4.`,
      ],
      example: { problem: `Write each word phrase as an algebraic expression. Use n for the unknown number. (a) 8 more than a number n. (b) the product of 6 and a number n. (c) 5 less than a number n. (d) the quotient of a number n and 4.`, solution: '(a) n + 8, (b) 6n, (c) n - 5, (d) n ÷ 4 (also written n/4)' },
      relatedLoIds: ['m6math.writing-and-evaluating-algebraic-expressions'],
    },
    {
      title: 'Worked evaluate expression and formula',
      steps: [
        '(a) Substitute the given values in place of the variables: P = 2(9) + 2(6).',
        `Order of operations says multiply before you add. Compute each product first: 2(9) = 18 and 2(6) = 12.`,
        'Add the two products: 18 + 12 = 30, so P = 30 feet.',
        `Check by rereading the story: a 9-by-6 rectangle has two sides of 9 feet and two sides of 6 feet, and 9 + 9 + 6 + 6 = 30, which matches.`,
        '(b) Substitute n = 4 into 3n + 5, giving 3(4) + 5.',
        `WRONG: adding the 4 and the 5 first because they sit close together on the page, computing 3(4 + 5) = 3(9) = 27. CORRECT: the plus 5 is not inside parentheses with the n, so nothing groups it with the multiplication. Multiply first: 3(4) = 12, then add 5: 12 + 5 = 17.`,
        `Check part (b) by substituting again from scratch: 3 × 4 = 12, and 12 + 5 = 17. The answer holds.`,
      ],
      example: { problem: `Evaluate each expression for the given value. (a) The perimeter of a rectangle is P = 2l + 2w, where l is the length and w is the width, both in feet. Find P when l = 9 feet and w = 6 feet. (b) Evaluate 3n + 5 when n = 4.`, solution: '(a) 30 feet, (b) 17' },
      relatedLoIds: ['m6math.writing-and-evaluating-algebraic-expressions'],
    },
  ],
  pointers: [
    { content: `Students often say "6 - y" — "6 less than a number y" means start with y and take away 6, so the correct expression is y - 6. Check with a number: if y = 10, "6 less than 10" is 4 in plain English, and y - 6 = 10 - 6 = 4, which matches. 6 - y would give 6 - 10 = -4, a negative number, and this course only uses nonnegative values, so that mismatch is a sign the order was flipped.`, kind: 'common-error' },
    { content: `Students often say "5(3 + 2) = 25" — 5m + 2 means multiply 5 by m first, then add 2. The plus 2 is not inside parentheses with m, so nothing groups it into the multiplication. Substituting m = 3 gives 5(3) + 2 = 15 + 2 = 17, not 25.`, kind: 'common-error' },
    { content: `A variable is a letter that stands for a number that is unknown or that can change.`, kind: 'tip' },
    { content: `Key words tell you the operation: sum/more than/plus means add, product/times means multiply, quotient/divided by means divide, difference/less than means subtract.`, kind: 'tip' },
    { content: '"Less than" flips the word order: "5 less than n" is n - 5, not 5 - n.', kind: 'tip' },
    { content: `To evaluate an expression, substitute the given number for the variable, then follow the order of operations.`, kind: 'tip' },
    { content: `A formula, such as P = 2l + 2w, is an expression with a job — evaluate it the same way as any other expression, by substituting and then computing.`, kind: 'tip' },
    { content: `Check an expression by testing it with a number, and check an evaluation by rereading the answer against the original story.`, kind: 'tip' },
    { content: `Don't read "less than" left to right. "5 less than n" means n - 5, not 5 - n. Say "n, then take away 5" before you write anything.`, kind: 'common-error' },
    { content: `When you write multiplication with a variable, drop the × sign. Write 6n, not 6 × n. But keep ÷ or write a fraction bar for division: n ÷ 4 or n/4.`, kind: 'vocab-note' },
    { content: `Order of operations still rules after you substitute. In 3n + 5 with n = 4, multiply 3 × 4 first (=12), then add 5 (=17). Don't group the 4 and 5 just because they're close on the page.`, kind: 'common-error' },
    { content: `Always check your expression with a number before you turn it in. Pick any value for the variable, work the word phrase in plain math, and see if your expression matches. This catches flipped subtraction instantly.`, kind: 'tip' },
    { content: `A formula is just an expression with a real-world job. Evaluate it exactly the way you evaluate any other expression: substitute, then follow order of operations. No new rules.`, kind: 'gotcha' },
    { content: `A variable is not a mystery — it's a placeholder for a number. It can change from one problem to the next, but in any single problem, the variable stands for exactly one value.`, kind: 'vocab-note' },
    { content: `Include units in your final answer when the problem gives them. If you find perimeter in feet, write "30 feet", not just "30". The units are part of the meaning.`, kind: 'edge-case' },
  ],
};
