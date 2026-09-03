/**
 * Grade 6 Math — Unit 7 CED 7.3: Parts of an Expression.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.parts-of-an-expression.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U7_PARTS_OF_AN_EXPRESSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.parts-of-an-expression.v1',
  course: 'Grade 6 Math',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Parts of an Expression',
  planId: 'evelyn.ms.m6math.parts-of-an-expression.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.parts-of-an-expression.v1' }],
  theory: [
    { loId: 'm6math.parts-of-an-expression', kind: 'framework', title: 'An expression is built from terms', content: `AN EXPRESSION IS BUILT FROM TERMS — a term is a single number, a single variable, or numbers and variables multiplied together. Terms are the pieces that a + or - sign separates. The expression 4x + 7y + 9 has three terms: 4x, 7y, and 9.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'framework', title: 'Factors are the pieces multiplied together inside one term', content: `FACTORS ARE THE PIECES MULTIPLIED TOGETHER INSIDE ONE TERM — when numbers or variables are multiplied together to build a term, each piece being multiplied is called a factor. In the term 4x, the factors are 4 and x. A term can have more than two factors: in 4mn, the factors are 4, m, and n, and 4mn is still just ONE term.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'framework', title: 'A coefficient is the number factor on a variable', content: `A COEFFICIENT IS THE NUMBER FACTOR ON A VARIABLE — when a term has a variable, the number multiplying it is called the coefficient of that variable. In 4x, 4 is the coefficient of x. In a term written as just a letter, like n, the coefficient is understood to be 1.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'framework', title: 'A constant is a term with no variable at all', content: `A CONSTANT IS A TERM WITH NO VARIABLE AT ALL — a term that is just a number, with no letter attached to it, is called a constant. In 4x + 7y + 9, the term 9 is the constant, because it is the only term with no variable.` },
    { loId: 'm6math.parts-of-an-expression', content: `MULTIPLICATION BUILDS ONE TERM; ONLY + OR - STARTS A NEW ONE — this is the single most important rule in this lesson. 6 and x multiplied together make ONE term, 6x, no matter how the pieces look written side by side. A new term only begins where a + or - sign appears. Counting the + and - signs in an expression, then adding one, tells you exactly how many terms it has.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'framework', title: 'A term versus a factor is about adding versus multiplying', content: `A TERM VERSUS A FACTOR IS ABOUT ADDING VERSUS MULTIPLYING — to find the terms of an expression, look for where addition or subtraction happens between whole pieces. To find the factors of one term, look for where multiplication happens INSIDE that single piece. Mixing these up — for example, calling 6 and x in 6x two separate terms — is the most common mistake with this vocabulary.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'definition', title: 'term', content: `a single number, a single variable, or numbers and variables multiplied together; terms are the pieces separated by + or - signs in an expression.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'definition', title: 'factor', content: `one of the pieces multiplied together to build a single term, such as the 4 and the x that multiply to build the term 4x.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'definition', title: 'coefficient', content: `the number factor multiplying a variable in a term, such as the 4 in 4x; a variable written alone has a coefficient of 1.` },
    { loId: 'm6math.parts-of-an-expression', kind: 'definition', title: 'constant', content: `a term made of just a number, with no variable attached, such as the 9 in 4x + 7y + 9.` },
  ],
  methods: [
    {
      title: 'Worked name the parts',
      steps: [
        `(a) Terms are separated only by + or - signs. This expression has two + signs, so it has exactly three terms: 4x, 7y, and 9.`,
        `(b) In the term 4x, the number multiplying x is 4, so the coefficient of x is 4. In the term 7y, the number multiplying y is 7, so the coefficient of y is 7.`,
        `(c) The term 9 has no variable attached to it at all. Since it is a term made of just a number, 9 is the constant.`,
        `Check part (a) by underlining each piece the + signs separate: [4x] + [7y] + [9]. Three brackets, three terms, which matches the count.`,
      ],
      example: { problem: `Consider the expression 4x + 7y + 9. (a) How many terms does it have, and what are they? (b) For each term with a variable, name its coefficient. (c) Which term is the constant?`, solution: `(a) three terms: 4x, 7y, and 9; (b) coefficient of x is 4, coefficient of y is 7; (c) the constant term is 9` },
      relatedLoIds: ['m6math.parts-of-an-expression'],
    },
    {
      title: 'Worked term vs factor trap',
      steps: [
        `Terms are separated only by + or - signs. In 4mn + 10, there is exactly one + sign, so there are exactly two terms: 4mn and 10.`,
        `WRONG: breaking 4mn into three separate terms, 4, m, and n, because it is written as three symbols in a row. CORRECT: 4, m, and n are all multiplied together, with no + or - sign between any of them, so together they form ONE term, 4mn — a term can have more than two factors and it is still a single term.`,
        `Within the term 4mn, every piece that is multiplied together is a factor, so the factors of 4mn are 4, m, and n.`,
        `The coefficient of 4mn is 4, since 4 is the number factor multiplying the variables m and n.`,
        `Check by counting the + and - signs across the whole expression: exactly one sign appears, so exactly one boundary is crossed, which gives two terms total — no matter how many factors are multiplied inside each one.`,
      ],
      example: { problem: `The expression 4mn + 10 has two terms. A student says it has four terms: 4, m, n, and 10. Explain the mistake, then name the factors and the coefficient of the term 4mn.`, solution: `4mn + 10 has two terms, 4mn and 10; the factors of 4mn are 4, m, and n; the coefficient of 4mn is 4` },
      relatedLoIds: ['m6math.parts-of-an-expression'],
    },
  ],
  pointers: [
    { content: `Students often say "7m + 4 has three terms: 7, m, and 4." — 7 and m are multiplied together with no + or - sign between them, so they form ONE term, 7m. The expression 7m + 4 has exactly one + sign, so it has exactly two terms: 7m and 4.`, kind: 'common-error' },
    { content: `Students often say "The coefficient of the constant term in 6x + 9 is 9." — A coefficient is the number factor attached to a variable, so only a term with a variable has one. In 6x + 9, the term 9 has no variable, which is exactly why it is called the constant, not a coefficient. The coefficient in this expression belongs to x, and it is 6.`, kind: 'common-error' },
    { content: `An expression is made of terms, and only + and - signs separate one term from the next.`, kind: 'tip' },
    { content: `Inside a single term, numbers and variables multiplied together are called factors, no matter how many there are.`, kind: 'tip' },
    { content: 'A coefficient is the number factor multiplying a variable, such as the 4 in 4x.', kind: 'tip' },
    { content: `A constant is a term with no variable attached to it, such as the 9 in 4x + 7y + 9.`, kind: 'tip' },
    { content: `Multiplication builds one term out of several factors; only addition or subtraction starts a brand-new term.`, kind: 'tip' },
    { content: 'Count the terms in an expression by counting its + and - signs and adding one.', kind: 'tip' },
    { content: `Count + and − signs to find the number of terms. If you see two + signs, you have three terms. Don't count symbols or letters — only addition and subtraction create new terms.`, kind: 'tip' },
    { content: `Inside one term, 6 and x multiplied together make ONE term (6x), not two. Factors are the pieces being multiplied *inside* a term; terms are the pieces being added or subtracted *between* them.`, kind: 'common-error' },
    { content: `A coefficient is *only* for terms with a variable. The constant term (like 9 in 4x + 7y + 9) has no coefficient — it's just a number.`, kind: 'vocab-note' },
    { content: `A variable written alone (like just 'n') has a coefficient of 1, even though no '1' is written. Don't assume the coefficient is missing — it's always there, understood to be 1.`, kind: 'edge-case' },
    { content: `Don't mix up 'constant' with 'coefficient.' A constant is a whole term with no variable. A coefficient is the number factor *inside* a term that has a variable.`, kind: 'vocab-note' },
    { content: `A term can have many factors. In 4mn, there are three factors: 4, m, and n. They're all multiplied together, so it's still just one term.`, kind: 'gotcha' },
    { content: `The coefficient is the *number* that multiplies the variable(s). In 4mn, the coefficient is 4 (not 4m or 4mn). It's the number part only.`, kind: 'common-error' },
  ],
};
