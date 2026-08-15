/**
 * Algebra 1 — Foundations: Order of Operations & Evaluating Expressions.
 *
 * The grammar of algebra (CCSS 6.EE.A.2c → A-SSE.A.1): one agreed reading
 * order so every expression means exactly one thing. Nested grouping,
 * the fraction bar as an invisible parenthesis, and substituting negative
 * values are the three places this quietly breaks for the rest of the year.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U1_ORDER_OF_OPERATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.order-of-operations.v1',
  title: 'Order of Operations & Evaluating Expressions',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.order-of-operations',
      standard: 'ALG1-1.2',
      description:
        'Apply the order of operations — including left-to-right rules, nested grouping, and the fraction bar as a grouping symbol — to evaluate numeric and algebraic expressions at given values, including negatives (CCSS 6.EE.A.2c, A-SSE.A.1).',
    },
  ],
  prerequisites: ['alg1.real-numbers-operations'],
  followUps: ['alg1.simplifying-expressions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the order of operations as the shared grammar that makes every later formula readable — and show that a spreadsheet or calculator obeys it whether or not you do.',
      script:
        'Type 24 ÷ 4 · 3 − 5 into any spreadsheet or calculator on the planet and you get the same number back. That is not luck — it is a worldwide agreement about reading order, and every formula you will ever write leans on it. Get this reading order automatic now and expressions stop being guesswork for the rest of Algebra 1.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-order',
      kind: 'concept',
      goal: 'The full reading order, the two same-rank left-to-right rules, what counts as a grouping symbol, and how to substitute safely.',
      keyIdeas: [
        'THE ORDER — 1) grouping symbols, innermost first, 2) exponents, 3) multiplication and division, 4) addition and subtraction. PEMDAS is a memory hook, not four separate steps.',
        'SAME RANK, LEFT TO RIGHT — × and ÷ tie, so you work left to right: 24 ÷ 4 · 3 = 6 · 3 = 18, NOT 24 ÷ 12. Likewise + and − tie: 8 − 2 + 3 = 6 + 3 = 9, NOT 8 − 5.',
        'GROUPING IS MORE THAN PARENTHESES — brackets [ ], absolute value bars | |, the radicand under a √, and the bar of a fraction all group. They all mean "finish everything inside me first."',
        'THE FRACTION BAR — (3 + 9)/(5 − 1) means evaluate the whole top, evaluate the whole bottom, then divide: 12/4 = 3. Never cancel or divide term-by-term across the bar.',
        'NESTED GROUPING — work outward from the innermost pair: in 2[3² − (7 − 4)] you do 7 − 4 first, then the exponent, then the bracket, then the multiply.',
        'EVALUATING — to evaluate an expression at a value, substitute the value IN PARENTHESES, then run the order of operations. Write x² as ( )² first, so x = −3 becomes (−3)².',
        'NEGATIVES AND EXPONENTS — (−3)² = 9 because the parentheses say the whole −3 is squared, but −3² = −9 because the exponent grabs only the 3 and the minus sign is applied last. This one sign is the single most common evaluation error.',
        'SUBTRACTING A NEGATIVE — after substituting, −x with x = −3 becomes −(−3) = +3. Substitute first, simplify signs second; do not try to do both in your head at once.',
      ],
      vocabulary: [
        { term: 'grouping symbol', definition: 'anything that wraps part of an expression — ( ), [ ], | |, √, or a fraction bar — signaling "evaluate me first."' },
        { term: 'evaluate', definition: 'replace each variable with a given number and simplify to a single value.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-nested',
      kind: 'worked_example',
      problem: 'Evaluate: 18 − 2[3² − (7 − 4)] ÷ 3',
      steps: [
        'Innermost grouping first: 7 − 4 = 3, so the expression is 18 − 2[3² − 3] ÷ 3.',
        'Exponent inside the bracket: 3² = 9, giving 18 − 2[9 − 3] ÷ 3.',
        'Finish the bracket: 9 − 3 = 6, giving 18 − 2 · 6 ÷ 3.',
        'Multiplication and division tie, so go left to right: 2 · 6 = 12, then 12 ÷ 3 = 4.',
        'Subtract last: 18 − 4 = 14.',
      ],
      answer: '14',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-substitution',
      kind: 'worked_example',
      problem: 'Evaluate (x² − 5x)/(x + 1) when x = −3',
      steps: [
        'Substitute with parentheses everywhere: ((−3)² − 5(−3))/((−3) + 1).',
        'Numerator, exponent first: (−3)² = 9 — the parentheses mean the whole −3 gets squared. Writing −3² = −9 here is the classic trap.',
        'Numerator, then multiply: −5(−3) = +15, so the top is 9 + 15 = 24.',
        'Denominator: −3 + 1 = −2. The fraction bar groups, so the bottom is finished on its own before any dividing happens.',
        'Divide last: 24 ÷ (−2) = −12.',
        'Trap check: a student who used −3² = −9 gets (−9 + 15)/(−2) = 6/(−2) = −3 — a wrong answer that looks perfectly reasonable.',
      ],
      answer: '−12',
      estimatedMinutes: 3,
    },
    {
      id: 'try-left-to-right',
      kind: 'try_yourself',
      problem: 'Evaluate: 24 ÷ 4 · 3 − 5',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '13', correct: true },
        { id: 'b', text: '−3' },
        { id: 'c', text: '−12' },
        { id: 'd', text: '18' },
      ],
      expectedAnswer: '13',
      hints: [
        'There is no grouping and no exponent, so start with the × and ÷ — but they tie, so read left to right.',
        '24 ÷ 4 = 6 first, then 6 · 3 = 18. Now finish the subtraction.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-negative',
      kind: 'try_yourself',
      problem: 'Evaluate 2x² − x when x = −3',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '21', correct: true },
        { id: 'b', text: '−15' },
        { id: 'c', text: '15' },
        { id: 'd', text: '39' },
      ],
      expectedAnswer: '21',
      hints: [
        'Substitute in parentheses first: 2(−3)² − (−3). The exponent applies to (−3), not to 2(−3).',
        '(−3)² = 9, so the first term is 2 · 9 = 18. Now handle −(−3).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-fraction-bar',
      kind: 'try_yourself',
      problem: 'Evaluate (a² − b)/(a + b) when a = −4 and b = 2, and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-7',
      hints: [
        'The fraction bar groups: finish the whole top and the whole bottom before dividing.',
        'Top: (−4)² − 2 = 16 − 2 = 14. Bottom: −4 + 2 = −2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-subtract-order',
      kind: 'misconception_check',
      question: 'A student evaluates 8 − 2 + 3 and answers 3, explaining that "the A in PEMDAS comes before the S, so addition goes first." What went wrong?',
      commonErrors: [
        {
          answer: '3',
          misconception: 'Reading PEMDAS as six ranked steps, so addition is treated as outranking subtraction — 2 + 3 = 5 gets done before the 8 − 2.',
          correctsTo: 'Addition and subtraction share one rank, so they are done left to right: 8 − 2 = 6, then 6 + 3 = 9. The same tie applies to × and ÷.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Grouping (innermost first) → exponents → × and ÷ → + and −.',
        '× ties with ÷ and + ties with −: same rank means left to right.',
        'Brackets, absolute value bars, radicals, and the fraction bar are all grouping symbols.',
        'Substitute values in parentheses: (−3)² = 9 but −3² = −9.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Order of Operations & Evaluating Expressions' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
