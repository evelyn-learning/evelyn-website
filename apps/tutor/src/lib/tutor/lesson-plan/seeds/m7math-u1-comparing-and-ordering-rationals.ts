/**
 * Grade 7 Math — Rational Numbers: Comparing & Ordering Rational Numbers.
 *
 * The one lesson in the unit built around a single trap (CCSS 6.NS.C.7,
 * 7.NS.A.1): once numbers cross zero, the one with the LARGER absolute value
 * is the SMALLER number, so −7 < −2. Everything else here — common
 * denominators, lining up decimal places, sorting a mixed set — is machinery
 * for getting numbers into a form where the number line can settle the
 * argument.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U1_COMPARING_AND_ORDERING_RATIONALS: LessonPlan = {
  id: 'evelyn.ms.m7math.comparing-and-ordering-rationals.v1',
  title: 'Comparing & Ordering Rational Numbers',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.comparing-and-ordering-rationals',
      standard: 'M7MATH-1.3',
      description:
        'Compare two rational numbers using a common denominator or a decimal conversion, interpret the result on a number line, and order a mixed set of fractions, decimals and negatives from least to greatest (CCSS 6.NS.C.7, 7.NS.A.1).',
    },
  ],
  prerequisites: ['m7math.rational-numbers-on-the-number-line'],
  followUps: ['m7math.fractions-decimals-percents'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the negative-number comparison rule feel obvious before it is stated as a rule.',
      script:
        'You and your friends are playing a card game where a bad round drops your score below zero. Sam is sitting on −2. Riley is on −7. Who is winning? Sam, and it is not even close, because Riley has five more points to climb just to get back to nothing. Notice what happened there. Riley has the bigger-looking number attached, and Riley is losing. That is the whole trick of today. Once numbers go past zero, bigger looking means further behind. We are going to line up fractions, decimals and negatives all together and sort them without getting fooled.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-comparing-rationals',
      kind: 'concept',
      goal: 'Establish "further right wins" and the tools that get any two numbers into comparable form.',
      keyIdeas: [
        'FURTHER RIGHT ON THE LINE IS ALWAYS GREATER. That is the only comparison rule there is, and it never breaks. Every trick below is just a way of finding out which number sits further right. The symbol < points its narrow end at the smaller number and opens its wide end toward the bigger one, so 3 < 8 and −8 < −3.',
        'AMONG NEGATIVES, THE BIGGER THE ABSOLUTE VALUE, THE SMALLER THE NUMBER. −7 sits seven units left of zero and −2 sits only two units left, so −7 < −2. Think about money you owe: owing $7 leaves you worse off than owing $2. This is the single mistake this lesson exists to stop.',
        'ZERO AND SIGNS SETTLE MOST COMPARISONS INSTANTLY. Every positive number is greater than zero, and zero is greater than every negative number, so every positive beats every negative no matter how the digits look. 0.01 is greater than −500. Sort a list into negatives, zero, and positives first, and half the work is already done.',
        'TO COMPARE TWO FRACTIONS, PUT THEM IN THE SAME UNITS. Either rewrite them with a common denominator or divide each one into a decimal. Compare 3/5 and 5/8 with a denominator of 40: 3/5 = 24/40 and 5/8 = 25/40, so 5/8 is larger. As decimals, 0.6 against 0.625 says the same thing.',
        'LINE UP THE DECIMAL PLACES BEFORE YOU COMPARE. More digits does not mean bigger. To compare 0.4 and 0.35, write 0.40 and 0.35, and now it is plain that 0.40 is larger. Padding with zeros on the right never changes a number, it just makes the columns match.',
        'TO ORDER A MIXED SET, CONVERT EVERYTHING TO DECIMALS FIRST, sort with the number line, then rewrite the answer in the forms the question used. Least to greatest means reading the line left to right.',
      ],
      vocabulary: [
        { term: 'common denominator', definition: 'a shared bottom number that lets two fractions be compared piece for piece.' },
        { term: 'least to greatest', definition: 'the order you get by reading the number line from left to right.' },
        { term: 'absolute value', definition: 'the distance a number sits from zero, which tells you how far left a negative number goes.' },
      ],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-negatives',
      kind: 'worked_example',
      problem: 'Which is greater, −3/4 or −0.7?',
      steps: [
        'Get both numbers into the same notation. The fraction bar means divide, so 3/4 = 3 ÷ 4 = 0.75, which makes −3/4 the same number as −0.75.',
        'Compare the sizes first, with the signs set aside. Line up the decimal places: 0.75 against 0.70. Seventy-five hundredths is more than seventy hundredths, so 0.75 is the bigger size.',
        'Now bring the signs back. Both numbers are negative, so a bigger size means a longer trip LEFT from zero. −0.75 sits further left than −0.70.',
        'Further left is smaller. So −3/4 < −0.7, which means −0.7 is the greater number. WRONG answer to avoid: saying −3/4 is greater because 0.75 beats 0.7. RIGHT answer: −0.7 is greater, because it sits closer to zero.',
        'Sanity check on the line: mark −1 and 0, cut the gap into quarters. −0.75 lands on the third mark left of zero, and −0.70 lands a little to the right of it. The picture agrees.',
      ],
      answer: '−0.7 is greater, so −3/4 < −0.7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-order-mixed-set',
      kind: 'worked_example',
      problem: 'Order from least to greatest: 2/5, −1.5, 0, −3/4, 1.2',
      steps: [
        'Turn every number into a decimal so one rule can handle all of them. 2/5 = 2 ÷ 5 = 0.4. And 3/4 = 0.75, so −3/4 = −0.75. The list is now 0.4, −1.5, 0, −0.75, 1.2.',
        'Split the list by sign. Negatives: −1.5 and −0.75. Then zero. Then the positives: 0.4 and 1.2. Every negative is smaller than zero, and zero is smaller than every positive, so the three groups are already in order.',
        'Order inside the negatives. The size 1.5 is bigger than the size 0.75, so −1.5 sits further left, and further left is smaller. That gives −1.5 first, then −0.75.',
        'Order inside the positives. 0.4 is less than 1.2, so 0.4 comes first.',
        'Glue the groups together: −1.5, −0.75, 0, 0.4, 1.2. Then switch back to the forms the question used, because that is the answer it asked for.',
      ],
      answer: '−1.5, −3/4, 0, 2/5, 1.2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-true-statement',
      kind: 'try_yourself',
      problem: 'Which statement is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−7 > −2' },
        { id: 'b', text: '−2 > −7', correct: true },
        { id: 'c', text: '−3.5 > −3.05' },
        { id: 'd', text: '−0.9 > 0.1' },
      ],
      expectedAnswer: '−2 > −7',
      hints: [
        'Sketch a quick number line and mark both numbers in each statement. Which one sits further right?',
        'Further right is greater. A positive number is always further right than any negative number.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-greatest-of-four',
      kind: 'try_yourself',
      problem: 'Which of these numbers is the greatest?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3/5' },
        { id: 'b', text: '5/8', correct: true },
        { id: 'c', text: '0.58' },
        { id: 'd', text: '−0.9' },
      ],
      expectedAnswer: '5/8',
      hints: [
        'Throw out anything negative straight away, then turn what is left into decimals by dividing top by bottom.',
        '3 ÷ 5 = 0.6 and 5 ÷ 8 = 0.625. Line up all three decimal places as 0.600, 0.625 and 0.580 before you decide. Extra digits do not make a number bigger.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-greatest-negative',
      kind: 'try_yourself',
      problem: 'Of the numbers −4.2, −4.8 and −4.02, which one is the greatest? Type it as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-4.02',
      hints: [
        'Line up the decimal places first: compare the sizes 4.20, 4.80 and 4.02.',
        'All three are negative, so the one with the SMALLEST size sits closest to zero — and closest to zero is furthest right, which makes it the greatest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-negative-is-bigger',
      kind: 'misconception_check',
      question: 'A student writes −7 > −2 and explains, "7 is bigger than 2, so −7 must be bigger than −2." What went wrong?',
      commonErrors: [
        {
          answer: '−7 > −2',
          misconception: 'Comparing only the sizes of the two numbers and forgetting that the minus sign sends them in the opposite direction from zero.',
          correctsTo: 'On the number line, −7 sits seven units to the LEFT of zero while −2 sits only two units left. Further left is smaller, so −7 < −2. The money version makes it obvious: owing $7 leaves you worse off than owing $2. With negatives, the number with the LARGER absolute value is the SMALLER number.',
        },
        {
          answer: '−0.75 > −0.7',
          misconception: 'The same flip, hidden inside decimals. Since 0.75 is bigger than 0.70, the student assumes −0.75 must be bigger than −0.70 as well.',
          correctsTo: 'Line the decimals up as 0.75 and 0.70. The size 0.75 is indeed bigger, and that is exactly why −0.75 sits FURTHER LEFT than −0.70. Further left is smaller, so −0.75 < −0.7. Compare the sizes first, then flip the result whenever both numbers are negative.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Further right on the number line is always greater. Every other rule is just a way of finding out which number sits further right.',
        'Among negatives, the larger the absolute value the smaller the number: −7 < −2, and −0.75 < −0.7.',
        'Every positive beats zero, and zero beats every negative, so sort a list by sign before doing any arithmetic.',
        'To compare fractions, give them a common denominator or divide each into a decimal: 3/5 = 0.6 is less than 5/8 = 0.625.',
        'Line up decimal places before comparing. Writing 0.4 as 0.40 shows at once that it is greater than 0.35.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Comparing & Ordering Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
