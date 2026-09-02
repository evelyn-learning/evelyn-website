/**
 * Grade 6 Math — Expressions & Exponents: Parts of an Expression.
 *
 * CONCEPT-LED fan-out row for m6math. Lesson 7.2 taught the student to build
 * and evaluate an expression; this lesson steps back and teaches the words
 * mathematicians use to talk ABOUT an expression once it already exists —
 * term, factor, coefficient, constant (CCSS 6.EE.A.2b). No expression is
 * written from a phrase and no expression is evaluated here; every expression
 * in this plan is already sitting on the page and is only described. The one
 * trap this plan is built to kill is confusing a TERM with a FACTOR: a
 * student who sees 6x + 8 and calls it three terms (6, x, and 8) has missed
 * that multiplication binds pieces into one term, while only + and - signs
 * start a new one. A second, related trap — calling a term's own number a
 * "coefficient" when that term has no variable at all — is handled directly
 * in the second worked example and the misconception check.
 *
 * SCOPE GUARD: this lesson only NAMES the parts of an expression — term,
 * factor, coefficient, constant — using correct vocabulary. Every expression
 * here is already written down and is only described, never built from a word
 * phrase and never evaluated for a numeric value, which is row 7.2's skill,
 * and never rewritten into an equivalent form by combining like terms or
 * applying the distributive property, which is row 7.4's skill. No variable
 * in this lesson carries an exponent (row 7.1's territory). Every coefficient
 * and constant used is a nonnegative whole number, no expression is ever
 * evaluated, and no arithmetic — signed-number or otherwise — is ever
 * computed on any of them; Grade 7's negative and rational coefficients and
 * multi-step expression manipulation do not appear here.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6MATH_U7_PARTS_OF_AN_EXPRESSION: LessonPlan = {
  id: 'evelyn.ms.m6math.parts-of-an-expression.v1',
  title: 'Parts of an Expression',
  curriculum: 'MS',
  grade: '6',
  subject: 'math',
  topic: 'grade-6-math',
  locale: 'en',
  los: [
    {
      id: 'm6math.parts-of-an-expression',
      standard: 'M6MATH-7.3',
      description:
        'Identify parts of an expression — terms, factors, coefficients — using correct mathematical vocabulary (CCSS 6.EE.A.2b).',
    },
  ],
  prerequisites: ['m6math.writing-and-evaluating-algebraic-expressions'],
  followUps: ['m6math.equivalent-expressions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Give the student a real expression with distinct pieces before naming any vocabulary, so the words attach to something they can already see.',
      script:
        'Your class is running a bake sale. You count b boxes of cupcakes, with 6 cupcakes packed in every box, plus 4 loose cupcakes that never made it into a box. The total number of cupcakes is 6b + 4. That expression is built out of pieces: a number multiplied by a letter, and a number sitting by itself. Right now all you can do is point at each piece and say "that part" and "this other part." Today you learn the exact words mathematicians use for every piece of an expression, so you can describe any expression precisely, without pointing at all.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-terms-factors-coefficients-constants',
      kind: 'concept',
      goal: 'Install the vocabulary for the pieces of an expression, and make the term-versus-factor boundary the thing the student checks first.',
      keyIdeas: [
        'AN EXPRESSION IS BUILT FROM TERMS — a term is a single number, a single variable, or numbers and variables multiplied together. Terms are the pieces that a + or - sign separates. The expression 4x + 7y + 9 has three terms: 4x, 7y, and 9.',
        'FACTORS ARE THE PIECES MULTIPLIED TOGETHER INSIDE ONE TERM — when numbers or variables are multiplied together to build a term, each piece being multiplied is called a factor. In the term 4x, the factors are 4 and x. A term can have more than two factors: in 4mn, the factors are 4, m, and n, and 4mn is still just ONE term.',
        'A COEFFICIENT IS THE NUMBER FACTOR ON A VARIABLE — when a term has a variable, the number multiplying it is called the coefficient of that variable. In 4x, 4 is the coefficient of x. In a term written as just a letter, like n, the coefficient is understood to be 1.',
        'A CONSTANT IS A TERM WITH NO VARIABLE AT ALL — a term that is just a number, with no letter attached to it, is called a constant. In 4x + 7y + 9, the term 9 is the constant, because it is the only term with no variable.',
        'MULTIPLICATION BUILDS ONE TERM; ONLY + OR - STARTS A NEW ONE — this is the single most important rule in this lesson. 6 and x multiplied together make ONE term, 6x, no matter how the pieces look written side by side. A new term only begins where a + or - sign appears. Counting the + and - signs in an expression, then adding one, tells you exactly how many terms it has.',
        'A TERM VERSUS A FACTOR IS ABOUT ADDING VERSUS MULTIPLYING — to find the terms of an expression, look for where addition or subtraction happens between whole pieces. To find the factors of one term, look for where multiplication happens INSIDE that single piece. Mixing these up — for example, calling 6 and x in 6x two separate terms — is the most common mistake with this vocabulary.',
      ],
      vocabulary: [
        { term: 'term', definition: 'a single number, a single variable, or numbers and variables multiplied together; terms are the pieces separated by + or - signs in an expression.' },
        { term: 'factor', definition: 'one of the pieces multiplied together to build a single term, such as the 4 and the x that multiply to build the term 4x.' },
        { term: 'coefficient', definition: 'the number factor multiplying a variable in a term, such as the 4 in 4x; a variable written alone has a coefficient of 1.' },
        { term: 'constant', definition: 'a term made of just a number, with no variable attached, such as the 9 in 4x + 7y + 9.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-the-parts',
      kind: 'worked_example',
      problem:
        'Consider the expression 4x + 7y + 9. (a) How many terms does it have, and what are they? (b) For each term with a variable, name its coefficient. (c) Which term is the constant?',
      steps: [
        '(a) Terms are separated only by + or - signs. This expression has two + signs, so it has exactly three terms: 4x, 7y, and 9.',
        '(b) In the term 4x, the number multiplying x is 4, so the coefficient of x is 4. In the term 7y, the number multiplying y is 7, so the coefficient of y is 7.',
        '(c) The term 9 has no variable attached to it at all. Since it is a term made of just a number, 9 is the constant.',
        'Check part (a) by underlining each piece the + signs separate: [4x] + [7y] + [9]. Three brackets, three terms, which matches the count.',
      ],
      answer: '(a) three terms: 4x, 7y, and 9; (b) coefficient of x is 4, coefficient of y is 7; (c) the constant term is 9',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-term-vs-factor-trap',
      kind: 'worked_example',
      problem:
        'The expression 4mn + 10 has two terms. A student says it has four terms: 4, m, n, and 10. Explain the mistake, then name the factors and the coefficient of the term 4mn.',
      steps: [
        'Terms are separated only by + or - signs. In 4mn + 10, there is exactly one + sign, so there are exactly two terms: 4mn and 10.',
        'WRONG: breaking 4mn into three separate terms, 4, m, and n, because it is written as three symbols in a row. CORRECT: 4, m, and n are all multiplied together, with no + or - sign between any of them, so together they form ONE term, 4mn — a term can have more than two factors and it is still a single term.',
        'Within the term 4mn, every piece that is multiplied together is a factor, so the factors of 4mn are 4, m, and n.',
        'The coefficient of 4mn is 4, since 4 is the number factor multiplying the variables m and n.',
        'Check by counting the + and - signs across the whole expression: exactly one sign appears, so exactly one boundary is crossed, which gives two terms total — no matter how many factors are multiplied inside each one.',
      ],
      answer: '4mn + 10 has two terms, 4mn and 10; the factors of 4mn are 4, m, and n; the coefficient of 4mn is 4',
      estimatedMinutes: 3,
    },
    {
      id: 'try-factors-of-a-term',
      kind: 'try_yourself',
      problem: 'In the expression 8n + 3, which two pieces are the factors of the term 8n?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8 and 3' },
        { id: 'b', text: 'n and 3' },
        { id: 'c', text: '8 and n', correct: true },
        { id: 'd', text: '8, n, and 3' },
      ],
      expectedAnswer: '8 and n',
      hints: [
        'Look only inside the term 8n. Factors are the pieces multiplied together within that ONE term, not numbers borrowed from a different term.',
        'The term 8n is built by multiplying 8 and n together, so those two pieces are its factors. The 3 sits in a different term, separated by a + sign, so it is not one of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-constant',
      kind: 'try_yourself',
      problem: 'Which term in the expression 5p + 6q + 11 is the constant term?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '11', correct: true },
        { id: 'b', text: '5p' },
        { id: 'c', text: '6q' },
        { id: 'd', text: '5' },
      ],
      expectedAnswer: '11',
      hints: [
        'A constant term has no variable attached to it at all. Check each term for a letter before deciding.',
        '5p and 6q both contain a variable, so neither can be the constant, and 5 by itself is only a coefficient, not a whole term. The one term with no variable is 11.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-count-the-terms',
      kind: 'try_yourself',
      problem: 'How many terms are in the expression 4a + 9b + 2c + 15? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Find every + sign in the expression. Each one marks the boundary between one term and the next.',
        '4a + 9b + 2c + 15 has three + signs. Three boundaries plus the one term before the first sign gives four terms total: 4a, 9b, 2c, and 15.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-term-vs-factor-and-coefficient-without-a-variable',
      kind: 'misconception_check',
      question:
        'One student says the expression 7m + 4 has three terms: 7, m, and 4. Another student says the coefficient of the constant term in 6x + 9 is 9. What went wrong in each case?',
      commonErrors: [
        {
          answer: '7m + 4 has three terms: 7, m, and 4.',
          misconception: 'Treating every symbol written next to another as its own separate term, instead of checking whether a + or - sign actually separates them.',
          correctsTo:
            '7 and m are multiplied together with no + or - sign between them, so they form ONE term, 7m. The expression 7m + 4 has exactly one + sign, so it has exactly two terms: 7m and 4.',
        },
        {
          answer: 'The coefficient of the constant term in 6x + 9 is 9.',
          misconception: 'Applying the word "coefficient" to a term that has no variable at all, instead of reserving that word for the number multiplying a variable.',
          correctsTo:
            'A coefficient is the number factor attached to a variable, so only a term with a variable has one. In 6x + 9, the term 9 has no variable, which is exactly why it is called the constant, not a coefficient. The coefficient in this expression belongs to x, and it is 6.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An expression is made of terms, and only + and - signs separate one term from the next.',
        'Inside a single term, numbers and variables multiplied together are called factors, no matter how many there are.',
        'A coefficient is the number factor multiplying a variable, such as the 4 in 4x.',
        'A constant is a term with no variable attached to it, such as the 9 in 4x + 7y + 9.',
        'Multiplication builds one term out of several factors; only addition or subtraction starts a brand-new term.',
        'Count the terms in an expression by counting its + and - signs and adding one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Parts of an Expression' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
