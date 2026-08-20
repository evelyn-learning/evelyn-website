/**
 * Grade 7 Math — Operations with Rational Numbers: Subtracting Rational Numbers.
 *
 * One idea carries the whole lesson (CCSS 7.NS.A.1): a − b = a + (−b). Every
 * subtraction gets rewritten as adding the opposite BEFORE any computing
 * happens, which means lesson 2.1 does all the real work. The two-minus-signs-
 * in-a-row case, 5 − (−3), gets the most weight because it is the step
 * students drop most often. Distance as |a − b| closes the loop back to Unit 1.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U2_SUBTRACTING_RATIONAL_NUMBERS: LessonPlan = {
  id: 'evelyn.ms.m7math.subtracting-rational-numbers.v1',
  title: 'Subtracting Rational Numbers',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.subtracting-rational-numbers',
      standard: 'M7MATH-2.2',
      description:
        'Rewrite subtraction of rational numbers as adding the opposite, a − b = a + (−b), compute with integers, fractions, and decimals, and express the distance between two rational numbers as the absolute value of their difference (CCSS 7.NS.A.1, 7.NS.A.3).',
    },
  ],
  prerequisites: ['m7math.adding-rational-numbers'],
  followUps: ['m7math.multiplying-dividing-rational-numbers'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make "subtracting a negative" feel obvious by cancelling a debt the student can picture.',
      script:
        'Your group chat is splitting a pizza order. You never had cash on you, so the spreadsheet says you owe 3 dollars. That is negative 3. Then the friend who paid says forget it, we are square. Something got taken AWAY from you, and yet you ended up 3 dollars better off. That is not a trick, and it is not a typo. Taking away a negative leaves you higher than you were. Today we turn that into one rule that handles every subtraction in this course.',
      suggestedTools: ['show_number_line'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-subtracting-rationals',
      kind: 'concept',
      goal: 'Establish add-the-opposite as the only rule, with heavy weight on two minus signs in a row.',
      keyIdeas: [
        'THERE IS ONLY ONE RULE — a − b = a + (−b). Change the subtraction sign to a plus, and change the number right after it to its opposite. Then you are back in the last lesson and the addition rules finish the job. Nothing new gets memorized. So 5 − 8 becomes 5 + (−8) = −3.',
        'TWO MINUS SIGNS IN A ROW MEAN ADD — this is the step people drop, so slow down here. In 5 − (−3), the opposite of −3 is 3, so the whole thing becomes 5 + 3 = 8. On the number line, subtracting a negative moves you RIGHT, which means the answer gets BIGGER than where you started. If your answer after subtracting a negative came out smaller, you missed the rewrite.',
        'REWRITE FIRST, COMPUTE SECOND — write the plus-and-opposite version on paper before you calculate anything. Doing the rewrite and the arithmetic in one mental jump is where sign errors live. So −7 − 4 gets written as −7 + (−4) first, and only then does it become −11.',
        'ORDER MATTERS IN SUBTRACTION — 3 − 8 = −5 but 8 − 3 = 5, so you cannot swap the two numbers. You may only swap AFTER the rewrite, because addition does allow it: 3 + (−8) is the same as −8 + 3.',
        'FRACTIONS AND DECIMALS FOLLOW THE SAME PATH — rewrite as adding the opposite, then find a common denominator or line up the decimal points. So 1/3 − (−1/4) becomes 1/3 + 1/4, which is 4/12 + 3/12 = 7/12.',
        'DISTANCE IS THE ABSOLUTE VALUE OF THE DIFFERENCE — how far apart two rational numbers sit is |a − b|. From −2.5 to 6 the distance is |−2.5 − 6| = |−8.5| = 8.5. Because it is a distance it is never negative, and it comes out the same either way around: |6 − (−2.5)| = |8.5| = 8.5 too.',
      ],
      vocabulary: [
        { term: 'difference', definition: 'the result of subtracting one number from another.' },
        { term: 'opposite', definition: 'the number the same distance from zero but on the other side; the opposite of −3 is 3.' },
        { term: 'distance between two numbers', definition: 'how far apart they sit on the number line, found with |a − b| and never negative.' },
      ],
      suggestedTools: ['show_number_line', 'show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rewrite-three-cases',
      kind: 'worked_example',
      problem: 'Rewrite each as addition, then compute: (a) 5 − (−3), (b) −7 − 4, (c) −2 − (−9)',
      steps: [
        '(a) The number after the subtraction sign is −3, and the opposite of −3 is 3. So 5 − (−3) becomes 5 + 3. Same signs, so add: the answer is 8. Notice 8 is BIGGER than the 5 you started from, which is exactly what subtracting a negative does.',
        '(b) The number after the subtraction sign is 4, and the opposite of 4 is −4. So −7 − 4 becomes −7 + (−4). Both are negative, so add the absolute values and keep the sign: 7 + 4 = 11, giving −11.',
        '(c) The number after the subtraction sign is −9, and the opposite of −9 is 9. So −2 − (−9) becomes −2 + 9. Different signs, so subtract: 9 − 2 = 7, and the 9 had the larger absolute value and was positive, so the answer is 7.',
        'Look back at (c). It started with two negative-looking numbers and finished with a positive 7. WRONG answer to avoid: −11, which comes from adding the absolute values as if it were −2 + (−9). RIGHT answer: 7. The rewrite is what keeps them apart.',
      ],
      answer: '(a) 8, (b) −11, (c) 7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fractions-and-distance',
      kind: 'worked_example',
      problem: 'Compute: (a) −3/5 − (−1/2). (b) How far apart are −4.75 and 2.5 on the number line?',
      steps: [
        '(a) Rewrite before anything else. The opposite of −1/2 is 1/2, so −3/5 − (−1/2) becomes −3/5 + 1/2.',
        '(a) Now the pieces need to match. The smallest number 5 and 2 both divide into is 10, so −3/5 = −6/10 and 1/2 = 5/10. The problem reads −6/10 + 5/10.',
        '(a) Different signs, so subtract the smaller absolute value from the larger: 6/10 − 5/10 = 1/10. The larger absolute value belonged to −6/10, which is negative, so the answer is −1/10. Check with decimals: −0.6 + 0.5 = −0.1, and −1/10 is −0.1.',
        '(b) Distance is the absolute value of the difference, so compute |−4.75 − 2.5|. Rewrite the inside as adding the opposite: −4.75 + (−2.5). Same signs, so add the absolute values: 4.75 + 2.50 = 7.25, and both were negative, so the inside is −7.25.',
        '(b) Finish the bars: |−7.25| = 7.25. The two numbers sit 7.25 apart. Sanity check by counting: from −4.75 up to 0 is 4.75, and from 0 up to 2.5 is 2.5, and 4.75 + 2.5 = 7.25.',
      ],
      answer: '(a) −1/10, (b) 7.25',
      estimatedMinutes: 3,
    },
    {
      id: 'try-subtract-a-negative',
      kind: 'try_yourself',
      problem: 'What is −6 − (−10) ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−16' },
        { id: 'b', text: '4', correct: true },
        { id: 'c', text: '−4' },
        { id: 'd', text: '16' },
      ],
      expectedAnswer: '4',
      hints: [
        'Write the rewrite down before you compute. What is the opposite of −10?',
        'The problem becomes −6 + 10. Different signs, so subtract 6 from 10 and keep the sign of the number with the bigger absolute value.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-subtract-fractions',
      kind: 'try_yourself',
      problem: 'What is 1/4 − 3/8 ?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1/8' },
        { id: 'b', text: '−1/8', correct: true },
        { id: 'c', text: '−5/8' },
        { id: 'd', text: '−1/4' },
      ],
      expectedAnswer: '−1/8',
      hints: [
        'Rewrite it as adding the opposite first: 1/4 + (−3/8). Then make the pieces the same size.',
        '1/4 is 2/8, so the problem is 2/8 + (−3/8). Different signs, so subtract 2 from 3 and keep the sign of the bigger one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-distance',
      kind: 'try_yourself',
      problem: 'How far apart are −3.5 and 4.25 on the number line? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '7.75',
      hints: [
        'Distance is the absolute value of the difference, so set up |−3.5 − 4.25|.',
        'Inside the bars, rewrite as adding the opposite: −3.5 + (−4.25) = −7.75. Then the bars turn that into a distance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-double-negative',
      kind: 'misconception_check',
      question: 'A student is asked for 8 − (−5). One classmate answers 3 and another answers −13. Both are wrong. What went wrong in each?',
      commonErrors: [
        {
          answer: '3',
          misconception: 'Reading the two minus signs as one and computing 8 − 5. The second minus sign belongs to the 5 itself, and it never got used.',
          correctsTo: 'Rewrite as adding the opposite: the opposite of −5 is 5, so 8 − (−5) = 8 + 5 = 13. Subtracting a negative moves you RIGHT on the number line, so the answer must end up bigger than 8. An answer of 3 is smaller than 8, which is the signal that the rewrite got skipped.',
        },
        {
          answer: '−13',
          misconception: 'Swapping the two numbers and computing −5 − 8 instead. Subtraction is not like addition; the order cannot be flipped.',
          correctsTo: '8 − (−5) means start at 8. Rewrite it as 8 + 5 = 13. Flipping to −5 − 8 asks a different question and gives −13. Keep the first number first, do the rewrite, and only then use the addition rules: the answer is 13.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every subtraction becomes addition: a − b = a + (−b). Rewrite on paper before you compute.',
        'Two minus signs in a row mean add: 5 − (−3) = 5 + 3 = 8, and the answer gets bigger, not smaller.',
        'Order matters: 3 − 8 = −5 but 8 − 3 = 5, so never swap the numbers before the rewrite.',
        'Fractions and decimals use the same rule: 1/3 − (−1/4) = 1/3 + 1/4 = 7/12.',
        'Distance between two numbers is |a − b|, and it is never negative: from −2.5 to 6 is 8.5.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Subtracting Rational Numbers' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
