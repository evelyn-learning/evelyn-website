/**
 * Grade 7 Math — Unit 5 CED 5.1: Writing Algebraic Expressions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.writing-algebraic-expressions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U5_WRITING_ALGEBRAIC_EXPRESSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.writing-algebraic-expressions.v1',
  course: 'Grade 7 Math',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Writing Algebraic Expressions',
  planId: 'evelyn.ms.m7math.writing-algebraic-expressions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.writing-algebraic-expressions.v1' }],
  theory: [
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'A variable is a placeholder', content: `A VARIABLE IS A PLACEHOLDER — a letter standing in for a number nobody has picked yet. Say what it means in words before you use it: let c = the number of trading cards you have. A letter with no meaning attached is where most word-problem mistakes start.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'The word bank', content: `THE WORD BANK — add: sum, total, more than, increased by, plus. Subtract: difference, less than, fewer than, decreased by, minus, take away. Multiply: product, times, twice, double, each, per, of. Divide: quotient, divided by, split evenly, shared equally.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'The order trap', content: `THE ORDER TRAP — "less than" and "subtracted from" say the amount you REMOVE first and the amount you START WITH second, so the symbols come out in the opposite order from the words. "5 less than n" is n − 5. It is NOT 5 − n. Test it with a number you can check in your head: 5 less than 12 is 7, and n − 5 gives 12 − 5 = 7, while 5 − n gives 5 − 12 = −7.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'Adding and multiplying do not reverse', content: `ADDING AND MULTIPLYING DO NOT REVERSE — "5 more than n" is n + 5, and 5 + n is the same thing, so the trap cannot bite there. Subtraction and division are the two operations where switching the order changes the answer, and those are exactly the two places to slow down. "The quotient of n and 4" is n/4, first number named on top.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'The parts of an expression', content: `THE PARTS OF AN EXPRESSION — an expression breaks into TERMS at every + and − sign. In 4n + 7 the terms are 4n and 7. The number multiplying the variable is the COEFFICIENT, so 4 is the coefficient of n. A term that is just a number is a CONSTANT, so 7 is the constant. In a real situation the constant is usually the one-time amount and the coefficient comes from the word "each" or "per".` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'framework', title: 'A whole phrase needs parentheses', content: `A WHOLE PHRASE NEEDS PARENTHESES — "the sum of n and 7" is one chunk. If something acts on that whole chunk, wrap it: "twice the sum of n and 7" is 2(n + 7), not 2n + 7. Without the parentheses the 2 only reaches the n.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'definition', title: 'variable', content: `a letter standing in for a number that is unknown or that can change, such as the c in c + 3.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'definition', title: 'term', content: `one piece of an expression, separated from the next by a + or − sign: 4n and 7 in 4n + 7.` },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'definition', title: 'coefficient', content: 'the number multiplying the variable in a term — the 4 in 4n.' },
    { loId: 'm7math.writing-algebraic-expressions', kind: 'definition', title: 'constant', content: `a term that is just a number, with no variable attached, such as the 7 in 4n + 7.` },
  ],
  methods: [
    {
      title: 'Worked real scenario',
      steps: [
        'Say what the letter means: let w = the number of weeks you have been saving.',
        `Find the part that does not change. The 25 dollars is already in the jar no matter how many weeks go by, so 25 is the constant.`,
        `Find the part that grows. Six dollars EVERY week means 6 times the number of weeks, which is 6w. The word "every" is what hands you the coefficient 6.`,
        'Put the two pieces together: 25 + 6w. This expression has two terms, 25 and 6w.',
        'Name the parts: the coefficient is 6, and the constant is 25.',
        `Sanity check with a small number. After 4 weeks the expression gives 25 + 6(4) = 25 + 24 = 49 dollars. Counting it out the slow way, 4 weeks of 6 dollars is 24 dollars added to the 25 you started with, which is also 49.`,
      ],
      example: { problem: `You already have 25 dollars saved, and you add 6 dollars to the jar every week. Write an expression for the total in the jar after w weeks, then name the coefficient and the constant.`, solution: '25 + 6w; coefficient 6, constant 25' },
      relatedLoIds: ['m7math.writing-algebraic-expressions'],
    },
    {
      title: 'Worked order traps',
      steps: [
        'Part (a) — build the inside piece first. "Four times a number n" is 4n.',
        `Now apply "6 less than". That phrase reverses: you start at 4n and take 6 away. The expression is 4n − 6. WRONG answer to avoid: 6 − 4n, which is what you get by writing the symbols in the order the words are spoken. RIGHT answer: 4n − 6.`,
        `Settle it with a number. Let n = 5. Four times 5 is 20, and 6 less than 20 is 14. Check the right version: 4(5) − 6 = 20 − 6 = 14. Check the wrong version: 6 − 4(5) = 6 − 20 = −14. The number test decides it every time.`,
        `Part (b) — again build the inside piece first. "The sum of a number n and 7" is n + 7, and that is one chunk.`,
        `The word "twice" doubles the WHOLE chunk, not just the n, so the chunk gets parentheses: 2(n + 7). WRONG answer to avoid: 2n + 7, which doubles only the n and leaves the 7 alone. RIGHT answer: 2(n + 7).`,
        `Number test again with n = 3. The sum is 3 + 7 = 10, and twice 10 is 20. Check: 2(3 + 7) = 2(10) = 20. The wrong version gives 2(3) + 7 = 13.`,
      ],
      example: { problem: `Translate each phrase: (a) 6 less than four times a number n; (b) twice the sum of a number n and 7.`, solution: '(a) 4n − 6   (b) 2(n + 7)' },
      relatedLoIds: ['m7math.writing-algebraic-expressions'],
    },
  ],
  pointers: [
    { content: `Students often say "9 − n" — The correct expression is n − 9. "Less than" names the amount being removed FIRST and the starting amount SECOND, so the symbols come out reversed. Check it with a number: 9 less than 20 is 11. RIGHT: n − 9 gives 20 − 9 = 11. WRONG: 9 − n gives 9 − 20 = −11. Only "minus" and "decreased by" keep the spoken order.`, kind: 'common-error' },
    { content: `Students often say "4/n" — The correct expression is n/4, because "the quotient of a and b" always puts the first number named on top. Check it with n = 12: the quotient of 12 and 4 is 3. RIGHT: n/4 gives 12/4 = 3. WRONG: 4/n gives 4/12, which is one third. Division and subtraction are the two operations where order changes the answer, so those are the two to slow down on.`, kind: 'common-error' },
    { content: 'Say what your letter means before you use it: let w = the number of weeks.', kind: 'tip' },
    { content: `"Less than" and "subtracted from" reverse the order: 5 less than n is n − 5, never 5 − n.`, kind: 'tip' },
    { content: '"The quotient of n and 4" puts the first number named on top: n/4.', kind: 'tip' },
    { content: `An expression splits into terms; the number multiplying the variable is the coefficient, and a lone number is the constant. In 25 + 6w the coefficient is 6 and the constant is 25.`, kind: 'tip' },
    { content: `When something acts on a whole phrase, wrap the phrase in parentheses: twice the sum of n and 7 is 2(n + 7).`, kind: 'tip' },
    { content: `When you are unsure of the order, test your expression with an easy number you can check in your head.`, kind: 'tip' },
    { content: `"Less than" flips the order; "minus" and "decreased by" do not. "7 less than n" is n − 7, but "n minus 7" is also n − 7 — the words sound different, the trap is only in the first one. Slow down every time you see *less than* or *subtracted from*.`, kind: 'gotcha' },
    { content: `In a quotient, the FIRST number named goes on top. "The quotient of n and 4" is n/4, not 4/n. Test with n = 12: 12/4 = 3 makes sense; 4/12 does not.`, kind: 'common-error' },
    { content: `The coefficient is the number stuck to the variable by multiplication; the constant is the lone number. In 25 + 6w the coefficient is 6 and the constant is 25 — not the other way around, even though 25 is written first.`, kind: 'vocab-note' },
    { content: `If a word like *twice*, *triple*, or *half* acts on a whole phrase ("the sum of n and 7"), put parentheses around the phrase: 2(n + 7). Writing 2n + 7 only doubles the n and leaves the 7 untouched.`, kind: 'common-error' },
    { content: `Always write what your letter means before writing the expression: "let t = the number of toppings," not just "t = toppings." A letter stands for a NUMBER, not for the object itself.`, kind: 'tip' },
    { content: `Not sure about the order? Plug in an easy number. For "6 less than 4n" with n = 5: 4(5) − 6 = 14 matches the words; 6 − 4(5) = −14 does not. A negative answer where you expected a positive one is a warning sign.`, kind: 'tip' },
    { content: `The words *each* and *per* hand you the coefficient; a one-time or starting amount is the constant. "$12 pizza plus $2 per topping" gives 12 + 2t — never 2 + 12t.`, kind: 'gotcha' },
    { content: `Terms split at + and − signs only, never at a multiplication. 4n + 7 has two terms (4n and 7), not three. The 4 and the n are one team.`, kind: 'edge-case' },
  ],
};
