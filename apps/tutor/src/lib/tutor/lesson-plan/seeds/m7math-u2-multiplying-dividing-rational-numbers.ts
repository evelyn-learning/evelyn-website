/**
 * Grade 7 Math — Operations with Rational Numbers: Multiplying & Dividing.
 *
 * The sign rule (CCSS 7.NS.A.2) is short: same signs give a positive, different
 * signs give a negative, and it reads identically for multiplication and for
 * division. The grade-7 work is applying it to fractions and decimals, not just
 * integers — multiply straight across, divide by multiplying by the reciprocal.
 * The exponent sign trap, (−3)² = 9 against −3² = −9, is taught here so that
 * lesson 2.4 can lean on it inside a full order-of-operations problem.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U2_MULTIPLYING_DIVIDING_RATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m7math.multiplying-dividing-rational-numbers.v1',
  title: 'Multiplying & Dividing Rational Numbers',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.multiplying-dividing-rational-numbers',
      standard: 'M7MATH-2.3',
      description:
        'Multiply and divide rational numbers, including fractions and decimals, using the same-sign and different-sign rule, dividing by multiplying by the reciprocal, and distinguishing (−3)² from −3² (CCSS 7.NS.A.2, 7.NS.A.3).',
    },
  ],
  prerequisites: ['m7math.subtracting-rational-numbers'],
  followUps: ['m7math.order-of-operations-rationals'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show repeated loss as multiplication by a negative, using a rule the student would actually live under.',
      script:
        'Say your family has a jar on the counter. Every time you leave your water bottle at school, 25 cents of your allowance goes in the jar. This month you have done it six times. Six times, minus 25 cents. You could add negative 0 point 2 5 to itself six times, or you could just multiply and be done: six times negative 0 point 2 5 is negative 1 dollar 50. Multiplying with a negative is repeated loss. Today we nail down exactly when the answer comes out negative and when it does not.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mult-div-rationals',
      kind: 'concept',
      goal: 'Teach the sign rule for both operations, fraction mechanics, reciprocals, and the exponent sign trap.',
      keyIdeas: [
        'THE SIGN RULE — same signs give a POSITIVE answer, different signs give a NEGATIVE answer. So (−4)(−3) = 12 and (−4)(3) = −12. Why do two negatives turn positive? Taking away four debts of 3 dollars each leaves you 12 dollars better off.',
        'DIVISION USES THE EXACT SAME RULE — nothing changes: −12 ÷ 4 = −3 and −12 ÷ (−4) = 3. And the minus sign can sit anywhere in a fraction without changing its value, so −3/4 and (−3)/4 and 3/(−4) are all the same number.',
        'DO THE SIGN FIRST, THEN THE SIZE — decide positive or negative before you multiply anything, so the sign is settled while your head is still clear. With a long string, just count the negative factors: an EVEN count gives a positive answer, an ODD count gives a negative one. In (−2)(3)(−5) there are two negatives, so the answer is positive 30.',
        'MULTIPLY FRACTIONS STRAIGHT ACROSS — numerator times numerator, denominator times denominator. No common denominator is needed; that is an addition requirement and it does not belong here. So (−2/3)(3/5) = −6/15, which simplifies to −2/5.',
        'DIVIDE BY MULTIPLYING BY THE RECIPROCAL — flip the second fraction and multiply. The reciprocal of 2/5 is 5/2. So (−3/4) ÷ (2/5) = (−3/4)(5/2) = −15/8. Flip only the number you are dividing BY, and never the first one.',
        'THE EXPONENT SIGN TRAP — (−3)² means (−3)(−3), which is 9, because the parentheses make the minus part of the base. But −3² means take 3 times 3 and then apply the minus, which is −9. Same digits, opposite answers, decided entirely by whether the parentheses are there.',
      ],
      vocabulary: [
        { term: 'product', definition: 'the result of multiplying numbers together.' },
        { term: 'quotient', definition: 'the result of dividing one number by another.' },
        { term: 'reciprocal', definition: 'the flip of a fraction; the reciprocal of 2/5 is 5/2, and a number times its reciprocal is 1.' },
        { term: 'base', definition: 'the number an exponent is applied to; in (−3)² the base is −3, but in −3² the base is just 3.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-multiply-fractions',
      kind: 'worked_example',
      problem: 'Multiply: (−2/3)(9/10)',
      steps: [
        'Settle the sign before anything else. One factor is negative and one is positive, so the signs are different, which means the answer will be negative. Write the minus sign down now so it cannot get lost.',
        'Multiply straight across. Numerators: 2 times 9 is 18. Denominators: 3 times 10 is 30. So far the answer is −18/30.',
        'Simplify. Both 18 and 30 divide by 6: 18 ÷ 6 = 3 and 30 ÷ 6 = 5. That gives −3/5.',
        'Check with decimals. −2/3 is about −0.667 and 9/10 is 0.9, and −0.667 times 0.9 is about −0.6. And −3/5 is −0.6. They match.',
        'WRONG answer to avoid: −11/13, which comes from adding across the top and bottom instead of multiplying. RIGHT answer: −3/5. Multiplying fractions never needs a common denominator.',
      ],
      answer: '−3/5',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-divide-and-exponent-trap',
      kind: 'worked_example',
      problem: 'Compute: (a) (−5/6) ÷ (−2/3). (b) Evaluate (−4)² and −4².',
      steps: [
        '(a) Sign first. Both numbers are negative, so the signs are the same, which means the answer will be positive.',
        '(a) Division becomes multiplication by the reciprocal. Flip the SECOND fraction only: 2/3 becomes 3/2. So the problem is (5/6)(3/2), with the sign already settled as positive.',
        '(a) Multiply straight across: 5 times 3 is 15, and 6 times 2 is 12, giving 15/12. Both divide by 3, so it simplifies to 5/4. Check with decimals: −0.833 divided by −0.667 is about 1.25, and 5/4 is 1.25.',
        '(b) (−4)² has parentheses, so the whole −4 is the base: (−4)(−4). Two negative factors, an even count, so the answer is positive 16.',
        '(b) −4² has no parentheses, so the exponent grabs only the 4. Do 4 times 4 = 16 first, then apply the waiting minus sign, giving −16. Read the parentheses carefully: (−4)² = 16 but −4² = −16.',
      ],
      answer: '(a) 5/4, (b) (−4)² = 16 and −4² = −16',
      estimatedMinutes: 3,
    },
    {
      id: 'try-count-the-negatives',
      kind: 'try_yourself',
      problem: 'What is (−2)(3)(−5) ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−30' },
        { id: 'b', text: '30', correct: true },
        { id: 'c', text: '−6' },
        { id: 'd', text: '−4' },
      ],
      expectedAnswer: '30',
      hints: [
        'Count how many of the three factors are negative before you multiply anything.',
        'Two negatives is an even count, so the sign is positive. Now multiply the sizes: 2 times 3 times 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-exponent-sign',
      kind: 'try_yourself',
      problem: 'What is −5² ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '25' },
        { id: 'b', text: '−25', correct: true },
        { id: 'c', text: '−10' },
        { id: 'd', text: '10' },
      ],
      expectedAnswer: '−25',
      hints: [
        'Look for parentheses. Are they there? If they are not, what exactly is the exponent sitting on?',
        'With no parentheses the base is just 5, so square the 5 first and apply the minus sign afterward.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-decimal-product',
      kind: 'try_yourself',
      problem: 'The jar takes 0.75 dollars from you each time you forget your lunch card, and you have forgotten it 6 times. Write the total change to your money as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-4.5',
      hints: [
        'Losing money each time means each event is negative, so the problem is 6 times (−0.75).',
        'Different signs, so the answer is negative. Now find 6 times 0.75 and put the minus sign on it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-exponent-parentheses',
      kind: 'misconception_check',
      question: 'A student writes (−2)² = −4 and also writes −2² = 4. Both are wrong, and they are wrong in opposite directions. What went wrong in each?',
      commonErrors: [
        {
          answer: '−4',
          misconception: 'Squaring only the 2 and then pasting the minus sign back on at the end, as if the parentheses were not there.',
          correctsTo: 'The parentheses make the whole −2 the base, so (−2)² means (−2)(−2). Two negative factors is an even count, and same signs give a positive, so (−2)² = 4.',
        },
        {
          answer: '4',
          misconception: 'Assuming a minus sign in front is always part of the base, so −2² gets treated as though it were written (−2)².',
          correctsTo: 'With no parentheses the exponent owns only the 2. Square it first, 2 times 2 = 4, then apply the minus that was waiting in front, giving −2² = −4. The parentheses are the only thing that decides, so read them before you square.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Same signs give a positive answer, different signs give a negative one, for multiplying AND dividing.',
        'Count the negative factors: an even count is positive, an odd count is negative, so (−2)(3)(−5) = 30.',
        'Multiply fractions straight across, no common denominator needed: (−2/3)(9/10) = −18/30 = −3/5.',
        'Divide by multiplying by the reciprocal of the second fraction: (−5/6) ÷ (−2/3) = (5/6)(3/2) = 5/4.',
        'Parentheses decide the base: (−4)² = 16, but −4² = −16.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Multiplying & Dividing Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
