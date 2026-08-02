/**
 * Algebra 1 — Unit 1 CED 1.4: Translating Words into Algebraic Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.translating-words-to-algebra.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U1_TRANSLATING_WORDS_TO_ALGEBRA: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.translating-words-to-algebra.v1',
  course: 'Algebra 1',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Translating Words into Algebraic Expressions',
  planId: 'evelyn.hs.alg1.translating-words-to-algebra.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.translating-words-to-algebra.v1' }],
  theory: [
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'Step zero', content: `STEP ZERO — DEFINE THE VARIABLE, in writing, with units: "let m = number of months", not just "let m = months". A nameless variable is where most word-problem errors are born.` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'The word banks', content: `THE WORD BANKS — addition: sum, total, increased by, more than, plus. Subtraction: difference, decreased by, less than, fewer than, minus, take away. Multiplication: product, times, twice, triple, of, each, per. Division: quotient, divided by, ratio, split evenly, per (when it means shared out).` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'The order trap', content: `THE ORDER TRAP — "less than" and "subtracted from" REVERSE the order you read: "5 less than x" is x − 5, and "5 subtracted from x" is x − 5. Both are NOT 5 − x. Sanity check with a number: 5 less than 12 is 7, and 12 − 5 = 7. ✓` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'Addition does not reverse', content: `ADDITION DOES NOT REVERSE — "5 more than x" is x + 5, which also equals 5 + x, so the trap only bites subtraction and division. Order matters exactly where the operation is not commutative.` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'Quotient order', content: `QUOTIENT ORDER — "the quotient of a and b" means a/b, first number on top. "The quotient of 12 and n" is 12/n; "n divided into 12" is also 12/n, but "n divided by 12" is n/12.` },
    { loId: 'alg1.translating-words-to-algebra', content: `PARENTHESES = A PHRASE TREATED AS ONE CHUNK — "the sum of n and 7" is a single quantity, so "twice the sum of n and 7" is 2(n + 7), not 2n + 7. If a word like twice, half, or squared acts on a whole phrase, wrap the phrase.` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'framework', title: 'Real scenarios follow one shape', content: `REAL SCENARIOS FOLLOW ONE SHAPE — a fixed amount plus a rate times a quantity: cost = start-up + (rate)(quantity), as in 40 + 5h. Spot the "per" word and you have found the coefficient.` },
    { loId: 'alg1.translating-words-to-algebra', content: `EXPRESSION vs EQUATION — an expression is a phrase with no equals sign (3n − 7). Once the words say "is", "equals", or "results in", you have an equation instead, which is the next lesson.` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'definition', title: 'variable', content: `a letter standing for an unknown quantity, always defined with its unit before use.` },
    { loId: 'alg1.translating-words-to-algebra', kind: 'definition', title: 'coefficient', content: `the number multiplying a variable — in 5h, the 5 is the coefficient and usually comes from a "per" phrase.` },
  ],
  methods: [
    {
      title: 'Worked real scenario',
      steps: [
        'Define the variable: let m = number of months of membership.',
        `Find the fixed part: the 30 dollar sign-up fee happens once, no matter how many months — it is a constant, 30.`,
        `Find the rate part: "25 dollars each month" means 25 times the number of months, or 25m. The word "each" gives you the coefficient.`,
        'Combine: total cost = 30 + 25m.',
        `Evaluate at m = 6: 30 + 25(6) = 30 + 150 = 180, so 6 months costs 180 dollars. Sanity check: six months of dues alone is 150, plus the one-time 30. ✓`,
      ],
      example: { problem: `A gym charges a one-time 30 dollar sign-up fee plus 25 dollars each month. Write an expression for the total cost in dollars after m months, then find the cost of 6 months.`, solution: '30 + 25m; 180 dollars for 6 months' },
      relatedLoIds: ['alg1.translating-words-to-algebra'],
    },
    {
      title: 'Worked order traps',
      steps: [
        'Part (a) — build the inner piece first: "three times a number n" is 3n.',
        `Now apply "7 less than". This phrase REVERSES: you start from 3n and take 7 away, giving 3n − 7. The tempting wrong answer is 7 − 3n.`,
        `Test part (a) with a number: let n = 5. Three times 5 is 15, and 7 less than 15 is 8. Check: 3(5) − 7 = 8 ✓, while 7 − 3(5) = −8 ✗. The number test settles the order every time.`,
        'Part (b) — "the quotient of n and 4" puts the first-named number on top: n/4.',
        `Then "increased by 9" adds on the outside: n/4 + 9. Note that "increased by" does not reverse, so no parentheses and no flipping.`,
      ],
      example: { problem: `Translate each phrase: (a) 7 less than three times a number n; (b) the quotient of n and 4, increased by 9.`, solution: '(a) 3n − 7   (b) n/4 + 9' },
      relatedLoIds: ['alg1.translating-words-to-algebra'],
    },
  ],
  pointers: [
    { content: `The correct expression is n − 12. "Less than" names the amount removed FIRST and the starting quantity SECOND, so the order flips. Confirm with a number: 12 less than 30 is 18, and n − 12 gives 30 − 12 = 18 ✓, while 12 − n gives 12 − 30 = −18 ✗. Only "minus" and "decreased by" keep the spoken order.`, kind: 'common-error' },
    { content: `Define the variable first, in writing, with its unit: "let m = number of months".`, kind: 'tip' },
    { content: '"Less than" and "subtracted from" reverse the order: 5 less than x is x − 5.', kind: 'tip' },
    { content: '"The quotient of a and b" is a/b — the first number named goes on top.', kind: 'tip' },
    { content: `A phrase acted on as a whole needs parentheses: twice the sum of n and 7 is 2(n + 7).`, kind: 'tip' },
    { content: `Real scenarios are fixed amount + rate times quantity; the "per" or "each" word hands you the coefficient.`, kind: 'tip' },
    { content: 'When in doubt, test the translation with an easy number.', kind: 'tip' },
    { content: `"Less than" and "subtracted from" reverse the order; "minus", "decreased by", and "take away" do NOT. "7 less than n" = n − 7, but "n minus 7" = n − 7 and "7 minus n" = 7 − n. Sort the phrase into the right pile before you write anything.`, kind: 'gotcha' },
    { content: `Don't write "let m = months" — write "let m = the number of months". The variable stands for a *count* or *amount*, never the thing itself. Same for "let c = cost in dollars", not "let c = money".`, kind: 'vocab-note' },
    { content: `If a word like *twice*, *half*, *squared*, or *three times* comes BEFORE a sum/difference phrase, wrap that phrase in parentheses: "twice the sum of n and 7" = 2(n + 7). Writing 2n + 7 doubles only one piece.`, kind: 'common-error' },
    { content: `Test any translation with an easy number. Plug n = 5 into your expression and into the words separately — if they disagree, your order is flipped. This catches "less than" and "quotient" errors in ten seconds.`, kind: 'tip' },
    { content: `Division wording is fussy: "the quotient of n and 4" = n/4, "n divided by 4" = n/4, but "n divided INTO 4" = 4/n. The word *into* flips it. Read the preposition, not just the numbers.`, kind: 'edge-case' },
    { content: `An expression has no equals sign. If your answer contains "=", you wrote an equation — reread the prompt. Words like "is", "equals", "totals", or "results in" signal an equation; "write an expression for the total cost" does not.`, kind: 'common-error' },
    { content: `In "fixed amount + rate × quantity" scenarios, the number attached to "each", "per", or "every" is the coefficient; the one-time number is the constant. "$30 sign-up plus $25 each month" → 30 + 25m, never 30m + 25.`, kind: 'gotcha' },
    { content: `"Of" usually means multiply ("half of n" = n/2 or ½n), but "more than" means add — don't let "than" trick you into subtracting. "5 more than x" = x + 5, and here order truly doesn't matter since addition commutes.`, kind: 'vocab-note' },
  ],
};
