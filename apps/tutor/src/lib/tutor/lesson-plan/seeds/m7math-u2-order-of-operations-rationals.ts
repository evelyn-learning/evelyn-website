/**
 * Grade 7 Math — Operations with Rational Numbers: Order of Operations.
 *
 * The unit closes by running all four operations in one expression
 * (CCSS 7.NS.A.3, 7.EE.B.3). Two things make this harder than the grade-6
 * version: the numbers are now negative fractions and decimals rather than
 * whole numbers, and the fraction bar shows up as a grouping symbol. The
 * same-rank left-to-right tie and the (−3)² against −3² trap from lesson 2.3
 * are the two failure points this plan is built around.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U2_ORDER_OF_OPERATIONS_RATIONALS: LessonPlan = {
  id: 'evelyn.ms.m7math.order-of-operations-rationals.v1',
  title: 'Order of Operations with Rational Numbers',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.order-of-operations-rationals',
      standard: 'M7MATH-2.4',
      description:
        'Evaluate multi-step numerical expressions containing negative fractions and decimals by applying the order of operations, treating a fraction bar as a grouping symbol and working same-rank operations left to right (CCSS 7.NS.A.3, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.multiplying-dividing-rational-numbers'],
  followUps: ['m7math.ratios-and-unit-rates'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Create the need for an agreed order by showing the same expression giving two answers.',
      script:
        'Someone drops 3 + 4 times 5 into the group chat. You work left to right in your head and get 35. Your friend types it into a calculator and gets 23. Same five symbols, two different answers, and now everyone is arguing. Only one of you can be right, and it is not decided by who typed faster. Mathematicians settled this a long time ago with one agreed order that every calculator on earth follows. Today we learn that order and then run it on the messy numbers from this unit: negatives, fractions and decimals all in the same problem.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-order-of-operations',
      kind: 'concept',
      goal: 'Lay out the order, kill the same-rank myth, and establish the fraction bar as grouping.',
      keyIdeas: [
        'THE ORDER, IN FOUR RANKS — first grouping symbols, innermost pair first. Second exponents. Third multiplication and division. Fourth addition and subtraction. PEMDAS is a way to remember it, but it is FOUR ranks, not six steps. So 3 + 4 times 5 = 3 + 20 = 23, not 35.',
        'SAME RANK GOES LEFT TO RIGHT — multiplication and division are tied, so neither one outranks the other: 24 ÷ 4 times 3 = 6 times 3 = 18, and NOT 24 ÷ 12. Addition and subtraction are tied the same way: 8 − 2 + 3 = 6 + 3 = 9, and NOT 8 − 5.',
        'GROUPING IS MORE THAN PARENTHESES — square brackets, absolute value bars, and the bar of a fraction all group. They all mean the same thing: finish everything inside me before I take part in anything else.',
        'THE FRACTION BAR IS A GROUPING SYMBOL — it means evaluate the entire top, evaluate the entire bottom, and only then divide. So (3 + 9) over (5 − 1) is 12 over 4, which is 3. Never cancel or divide one piece at a time across the bar.',
        'NEGATIVES AND FRACTIONS GET NO SPECIAL TREATMENT — they take their turn by rank like every other number, so do not save them for last. Use the sign rules from this unit at each step, and watch the base: (−3)² = 9 because the parentheses include the minus, while −3² = −9 because the exponent owns only the 3.',
      ],
      vocabulary: [
        { term: 'grouping symbol', definition: 'anything that wraps part of an expression — parentheses, brackets, absolute value bars, or a fraction bar — meaning evaluate me first.' },
        { term: 'evaluate', definition: 'work an expression down to a single number.' },
        { term: 'exponent', definition: 'the small raised number telling you how many copies of the base to multiply together.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-negative-fraction-exponent',
      kind: 'worked_example',
      problem: 'Evaluate: −2 + (1/2)(−3)²',
      steps: [
        'Scan for grouping symbols first. The only parentheses hold single numbers, so there is nothing to simplify inside them. Move on to rank two.',
        'Exponents next. The base is −3 because the parentheses wrap the minus sign along with the 3, so (−3)² = (−3)(−3). Two negative factors, an even count, so it is positive 9. The expression is now −2 + (1/2)(9).',
        'Rank three, multiplication. Half of 9 is 9/2, which is 4.5. The expression is now −2 + 9/2.',
        'Rank four, addition. Different signs, so use the addition rule from lesson 2.1. Write −2 in halves so the pieces match: −2 = −4/2. Then −4/2 + 9/2 = 5/2, which is 2.5.',
        'Check the whole thing as decimals: (−3)² = 9, half of 9 is 4.5, and −2 + 4.5 = 2.5. That agrees with 5/2. WRONG answer to avoid: −6.5, which comes from reading the exponent as −3² = −9 and then computing −2 + (−4.5). RIGHT answer: 5/2, or 2.5.',
      ],
      answer: '5/2, which is 2.5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fraction-bar',
      kind: 'worked_example',
      problem: 'Evaluate the fraction with (−8 + 2) on top and (5 − 2 times 4) on the bottom.',
      steps: [
        'The fraction bar groups. Treat the top as its own little problem and the bottom as its own little problem, and do not let anything cross the bar until both sides are single numbers.',
        'Top: −8 + 2. Different signs, so subtract the absolute values: 8 − 2 = 6, and the 8 had the larger absolute value and was negative. The top is −6.',
        'Bottom: 5 − 2 times 4. Multiplication outranks subtraction, so 2 times 4 = 8 first, giving 5 − 8. Rewrite as adding the opposite: 5 + (−8) = −3. The bottom is −3.',
        'Now the bar finally acts as division: −6 ÷ (−3). Both signs are the same, so the answer is positive, and 6 ÷ 3 = 2. The value is 2.',
        'WRONG answer to avoid: −1/2, which comes from working the bottom left to right as 5 − 2 = 3 and then 3 times 4 = 12, giving −6 over 12. RIGHT answer: 2. Multiplication outranks subtraction even when it is hiding under a fraction bar.',
      ],
      answer: '2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-multiply-before-subtract',
      kind: 'try_yourself',
      problem: 'Evaluate: 8 − 2 × (−3)',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−18' },
        { id: 'b', text: '14', correct: true },
        { id: 'c', text: '2' },
        { id: 'd', text: '18' },
      ],
      expectedAnswer: '14',
      hints: [
        'Which rank comes first here, the subtraction or the multiplication?',
        'Multiply first: 2 × (−3) = −6, so the expression becomes 8 − (−6). Now remember what two minus signs in a row do.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exponent-then-divide',
      kind: 'try_yourself',
      problem: 'Evaluate: 2 + (−6)² ÷ 4',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4' },
        { id: 'b', text: '11', correct: true },
        { id: 'c', text: '−7' },
        { id: 'd', text: '38' },
      ],
      expectedAnswer: '11',
      hints: [
        'Nothing needs simplifying inside the parentheses, so exponents come first. Is the base 6 or −6?',
        'The parentheses make the base −6, so (−6)² = 36. Now division outranks addition, so divide before you add.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-grouping-decimals',
      kind: 'try_yourself',
      problem: 'Evaluate (2.5 − 4) × (−6). Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '9',
      hints: [
        'Grouping symbols come first, so finish 2.5 − 4 before you multiply by anything.',
        'Inside the parentheses you get −1.5. Then multiply −1.5 by −6, and remember that same signs give a positive answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-rank-order',
      kind: 'misconception_check',
      question: 'A student answers 10 − 4 + 2 = 4 and 20 ÷ 5 × 2 = 2, explaining that "A comes before S and M comes before D in PEMDAS." Both answers are wrong. What is the shared mistake?',
      commonErrors: [
        {
          answer: '4',
          misconception: 'Treating addition as outranking subtraction, so 4 + 2 = 6 gets done first and then 10 − 6 = 4.',
          correctsTo: 'Addition and subtraction share ONE rank, so they run left to right: 10 − 4 = 6 first, then 6 + 2 = 8. The correct answer is 8. PEMDAS is four ranks with two ties inside it, not six steps in a line.',
        },
        {
          answer: '2',
          misconception: 'Treating multiplication as outranking division, so 5 × 2 = 10 gets done first and then 20 ÷ 10 = 2.',
          correctsTo: 'Multiplication and division also share one rank, so they run left to right: 20 ÷ 5 = 4 first, then 4 × 2 = 8. The correct answer is 8. Whenever two tied operations sit side by side, the one on the LEFT goes first.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four ranks: grouping, then exponents, then multiplying and dividing, then adding and subtracting.',
        'Tied operations run left to right, so 24 ÷ 4 × 3 = 18 and 8 − 2 + 3 = 9.',
        'A fraction bar groups: finish the whole top and the whole bottom, then divide.',
        'Parentheses decide the base, so (−3)² = 9 while −3² = −9.',
        'Negatives, fractions and decimals wait their turn by rank; use the sign rules from this unit at each step.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Order of Operations with Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
