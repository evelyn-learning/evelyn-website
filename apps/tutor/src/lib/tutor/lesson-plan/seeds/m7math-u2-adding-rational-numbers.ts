/**
 * Grade 7 Math — Operations with Rational Numbers: Adding Rational Numbers.
 *
 * Unit 1 put every rational number on the number line. This lesson makes them
 * move (CCSS 7.NS.A.1). Two rules do all the work: same signs add and keep the
 * sign, different signs subtract and keep the sign of the larger absolute
 * value. Both rules are exercised on integers, on fractions with unlike
 * denominators, and on decimals, because the grade-7 standard is the
 * combination, not the integers alone. Additive inverses land here too.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U2_ADDING_RATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m7math.adding-rational-numbers.v1',
  title: 'Adding Rational Numbers',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.adding-rational-numbers',
      standard: 'M7MATH-2.1',
      description:
        'Add rational numbers — integers, fractions with unlike denominators, and decimals — using the same-sign and different-sign rules, and recognize that a number plus its opposite is zero (CCSS 7.NS.A.1, 7.NS.A.3).',
    },
  ],
  prerequisites: ['m7math.fractions-decimals-percents'],
  followUps: ['m7math.subtracting-rational-numbers'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn a running total the student already tracks into signed addition.',
      script:
        'Think about the snack account at school. Saturday your allowance lands: plus 12 dollars. Monday a smoothie costs you 4 dollars 50. Tuesday a friend pays back the 3 dollars they borrowed. Wednesday the vending machine eats another 6 dollars 75. The account does not care which day it is. It just keeps one running total, where some numbers push it up and some push it down. That is all adding rational numbers is. Today we work out who wins the tug of war, and by exactly how much.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-adding-rationals',
      kind: 'concept',
      goal: 'Build the two addition rules and show they hold for fractions and decimals, not just integers.',
      keyIdeas: [
        'ADDING IS MOVING ON THE NUMBER LINE — start at the first number. A positive number moves you right, a negative number moves you left. So −5 + 3 means start at −5 and take three steps right, landing on −2. Every rule below is just a shortcut for that walk.',
        'SAME SIGNS — ADD AND KEEP THE SIGN. When both numbers pull the same direction, add their absolute values and keep the sign they share. So −3 + (−7) = −10, because owing 3 and then owing 7 more means owing 10. In the same way −1.4 + (−2.6) = −4, and −1/8 + (−3/8) = −4/8, which is −1/2.',
        'DIFFERENT SIGNS — SUBTRACT AND KEEP THE WINNER. When the numbers pull opposite directions, subtract the smaller absolute value from the larger one, then keep the sign of the number that had the LARGER absolute value. So −8 + 3 = −5, because 8 − 3 = 5 and the 8 was negative. And 9 + (−2) = 7, because 9 − 2 = 7 and the 9 was positive.',
        'OPPOSITES ADD TO ZERO — a number plus its opposite always gives zero: 6 + (−6) = 0 and −2.5 + 2.5 = 0. That pair is called an additive inverse. Spotting one in a long string is a gift, because it cancels out and you can skip it.',
        'FRACTIONS NEED SAME-SIZE PIECES FIRST — the two sign rules never change, but fractions can only be added once the denominators match. Rewrite −3/4 + 1/6 as −9/12 + 2/12 before you touch the signs. Decimals want the same courtesy: line up the decimal points and fill in a zero so 7.2 becomes 7.20.',
      ],
      vocabulary: [
        { term: 'rational number', definition: 'any number that can be written as a fraction of two integers — that includes integers, fractions, and terminating or repeating decimals.' },
        { term: 'additive inverse', definition: 'the opposite of a number; the two of them add to zero, like 6 and −6.' },
        { term: 'sum', definition: 'the result of adding numbers together.' },
        { term: 'common denominator', definition: 'a shared bottom number that lets two fractions be added, because it makes the pieces the same size.' },
      ],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-add-unlike-fractions',
      kind: 'worked_example',
      problem: 'Add: −3/4 + 1/6',
      steps: [
        'Check the signs first. One number is negative and one is positive, so this is the different-signs case. But the pieces are different sizes, so the fractions have to match up before anything else happens.',
        'Find a common denominator for 4 and 6. The smallest number both divide into is 12. Rewrite: −3/4 = −9/12 because 3 times 3 is 9, and 1/6 = 2/12 because 1 times 2 is 2.',
        'Now the problem reads −9/12 + 2/12. Different signs, so subtract the smaller absolute value from the larger: 9/12 − 2/12 = 7/12.',
        'Keep the sign of the number with the larger absolute value. That was −9/12, which is negative, so the answer is −7/12.',
        'Check with decimals. −3/4 is −0.75 and 1/6 is about 0.167, so the sum is about −0.583. And −7/12 is about −0.583. They match. WRONG answer to avoid: −11/12, which comes from adding 9 and 2 as if the signs were the same. RIGHT answer: −7/12.',
      ],
      answer: '−7/12',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-add-decimals',
      kind: 'worked_example',
      problem: 'Your snack account is 7 dollars 20 in the hole, so it reads −7.2. You pay in 4.85. Find −7.2 + 4.85.',
      steps: [
        'The signs are different, so the two numbers pull opposite ways. Compare their absolute values: |−7.2| = 7.2 and |4.85| = 4.85. The 7.2 is bigger, so the negative side wins the tug of war.',
        'Subtract the smaller absolute value from the larger one. Line up the decimal points and write 7.2 as 7.20 so both numbers have two places: 7.20 − 4.85 = 2.35.',
        'Keep the sign of the larger absolute value, which was negative. So −7.2 + 4.85 = −2.35.',
        'Does that make sense in the story? You owed 7 dollars 20 and handed over 4 dollars 85, so you still owe 2 dollars 35. Still owing is negative, and −2.35 says exactly that.',
        'WRONG answer to avoid: 12.05, which comes from adding 7.2 and 4.85 as though the signs matched. RIGHT answer: −2.35.',
      ],
      answer: '−2.35',
      estimatedMinutes: 3,
    },
    {
      id: 'try-add-different-signs',
      kind: 'try_yourself',
      problem: 'What is −8 + 3 ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−11' },
        { id: 'b', text: '−5', correct: true },
        { id: 'c', text: '5' },
        { id: 'd', text: '11' },
      ],
      expectedAnswer: '−5',
      hints: [
        'Do the two numbers pull the same direction or opposite directions? That decides which rule you use.',
        'Different signs means subtract the absolute values: 8 − 3 = 5. Now, which of the two numbers had the bigger absolute value, and what sign was it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-add-fractions',
      kind: 'try_yourself',
      problem: 'What is −5/8 + 1/4 ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−7/8' },
        { id: 'b', text: '−3/8', correct: true },
        { id: 'c', text: '−4/12' },
        { id: 'd', text: '3/8' },
      ],
      expectedAnswer: '−3/8',
      hints: [
        'Make the pieces the same size before you do anything with the signs. What is 1/4 written in eighths?',
        'Once it reads −5/8 + 2/8, the signs are different, so subtract 2 from 5 and keep the sign of the bigger one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-opposites',
      kind: 'try_yourself',
      problem: 'What is −3.6 + 9 + (−9) ? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-3.6',
      hints: [
        'Scan the whole string before you compute anything. Are any two of these numbers opposites?',
        '9 and −9 are opposites, so they add to 0 and drop out. What is left behind?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-sign-addition',
      kind: 'misconception_check',
      question: 'A student is asked for −3 + (−7). One classmate answers −4 and another answers 10. Both are wrong. What went wrong in each?',
      commonErrors: [
        {
          answer: '−4',
          misconception: 'Seeing a minus sign and reaching for the different-signs rule, so 7 − 3 gets computed even though both numbers are negative.',
          correctsTo: 'Both numbers are negative, so they pull the SAME direction. Same signs means add the absolute values and keep the shared sign: 3 + 7 = 10, and the sign is negative, so −3 + (−7) = −10. Picture it as owing 3 dollars and then owing 7 more — you are 10 dollars down, not 4.',
        },
        {
          answer: '10',
          misconception: 'Applying "two negatives make a positive" to an addition problem. That saying belongs to multiplying and dividing, and it does not apply here at all.',
          correctsTo: 'Adding two negatives can never give a positive. Start at −3 on the number line and move 7 more steps LEFT; you land on −10, further from zero, not on the positive side of it. The correct answer is −10.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Same signs: add the absolute values and keep the sign they share, so −3 + (−7) = −10.',
        'Different signs: subtract the smaller absolute value from the larger and keep the sign of the larger, so −8 + 3 = −5.',
        'A number plus its opposite is always zero: 6 + (−6) = 0, so opposites cancel and drop out.',
        'Fractions need a common denominator before you add: −3/4 + 1/6 becomes −9/12 + 2/12 = −7/12.',
        'Decimals need lined-up decimal points: 7.20 − 4.85 = 2.35, so −7.2 + 4.85 = −2.35.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Adding Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
