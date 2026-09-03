/**
 * Grade 8 Math — Real Numbers: Repeating Decimals to Fractions.
 *
 * Procedure-led. The student already turns a fraction into a decimal by
 * dividing top by bottom and has seen that the division either stops or
 * repeats; what is new is running that machine BACKWARD (CCSS 8.NS.A.1):
 * name the repeating decimal x, multiply by 10 or 100 so a shifted copy ends
 * in the identical endless tail, subtract so the tails cancel, then divide
 * and reduce to lowest terms. The concept segment is the recipe plus the one
 * reason it works (the tails cancel only when they line up), both worked
 * examples run the same moves, and every conversion ends with the division
 * check the student already owns. Two traps this plan is built to kill:
 * reading a lead digit as part of the block (0.8333… treated as 0.838383…,
 * which lands on 83/99), and treating the endless decimal as if it simply
 * stopped (0.72 over 100).
 *
 * SCOPE GUARD: Know that every rational number has a decimal expansion that
 * terminates or repeats (≤5-min recall of
 * `m7math-u1-rational-numbers-on-the-number-line.ts`, which already converts
 * fraction → decimal by division; not re-taught). NEW: convert a repeating
 * decimal to a fraction by the x = 0.3636…, 100x = 36.36…, subtract-and-divide
 * method, including one-digit and two-digit repeats and a non-repeating lead
 * digit (0.8333…). Withholds: the rational/irrational distinction (row 1.2).
 * Concretely: the word "irrational" never appears in any spoken field, every
 * decimal in this plan either terminates or repeats, and the plan never says
 * what a decimal that does neither is or is not. Fraction → decimal by long
 * division appears only as the recall in the first keyIdea and as the
 * "divide it back" check that ends each conversion, never as a worked example
 * or a try_yourself. Every decimal converted here lies between 0 and 1, has a
 * repeating block of one or two digits, and carries at most one non-repeating
 * lead digit; no three-digit block and no two-digit lead is ever converted.
 * Writing a terminating decimal over 100 is assumed Grade 6/7 ground: it is
 * named in passing as the move that does NOT work for an endless decimal, and
 * it shows up inside a student's wrong answer (0.72 = 18/25) in the
 * misconception check; it is never taught. The row names no Algebra 1
 * extension; the real-number hierarchy that re-classifies rational vs
 * irrational belongs to `alg1-u1-real-numbers-operations.ts` via row 1.2 and
 * is not touched here.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8MATH_U1_REPEATING_DECIMALS_TO_FRACTIONS: LessonPlan = {
  id: 'evelyn.ms.m8math.repeating-decimals-to-fractions.v1',
  title: 'Repeating Decimals to Fractions',
  curriculum: 'MS',
  grade: '8',
  subject: 'math',
  topic: 'grade-8-math',
  locale: 'en',
  los: [
    {
      id: 'm8math.repeating-decimals-to-fractions',
      standard: 'M8MATH-1.1',
      description:
        'Know that every rational number has a decimal expansion that terminates or repeats; convert a repeating decimal to a fraction by the x = 0.3636…, 100x = 36.36…, subtract-and-divide method, including one-digit and two-digit repeats and a non-repeating lead digit (0.8333…) (CCSS 8.NS.A.1).',
    },
  ],
  prerequisites: [],
  followUps: ['m8math.rational-and-irrational-numbers'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a repeating decimal the student meets in real life and pose the reverse question, so the backward direction feels like a real need before the method is named.',
      script:
        'The stats app for your basketball team shows one player with a free-throw rate of 0.636363…, and the digits scroll right off the edge of the screen. Somebody in the group chat asks the obvious question: so how many did she actually make, out of how many tries? The app built that decimal by dividing makes by attempts, and you already know how to go that direction, top divided by bottom. Nobody has shown you how to go back. The decimal never ends, so you cannot just write it over 100 or 1000 the way you would with 0.75. Today you learn a four-move trick that makes the endless part cancel itself out, and it turns any repeating decimal back into the fraction it came from.',
      suggestedTools: ['show_equation'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-name-shift-subtract-divide',
      kind: 'concept',
      goal: 'Recall why a fraction always gives a stopping or repeating decimal, then install the name-it, shift-it, subtract, divide recipe and the reason the endless tails cancel.',
      keyIdeas: [
        'EVERY FRACTION GIVES A DECIMAL THAT STOPS OR REPEATS — you already turn a fraction into a decimal by dividing top by bottom, and you have met both endings: 3/8 = 0.375 stops, and 2/3 = 0.666… repeats. Those are the only two endings, and the remainders are the reason. When you divide by 11, every remainder is one of the numbers 0 through 10. Either a remainder of 0 shows up and the decimal stops, or within eleven steps some remainder has to come back, and from that point the digits repeat in a loop. That is what it means to say a rational number has a decimal that terminates or repeats.',
        'FIND THE REPEATING BLOCK FIRST — the digits that loop are the repeating block, and a bar over them means "forever". In 0.3636… the block is 36. In 0.777… the block is 7. In 0.8333… the block is just the 3, and the 8 in front is a lead digit that never repeats. Deciding exactly which digits loop is the first move, because it decides every number that comes next.',
        'NAME IT x, THEN SHIFT IT — call the decimal x. Multiply by 10 for a one-digit block or by 100 for a two-digit block, which slides the decimal point past exactly one block. If x = 0.3636…, then 100x = 36.3636…, and look at the part after the decimal point: it is the same .3636… it was before. Shifting by a whole block leaves the tail untouched.',
        'SUBTRACT, AND THE FOREVER CANCELS — 100x - x = 36.3636… - 0.3636…. The two endless tails are identical, so they wipe each other out completely, leaving 99x = 36. That is the whole reason for the shift: the tails only cancel when they line up, and they only line up when the multiplier matches the block, 10 for one digit and 100 for two.',
        'DIVIDE, THEN REDUCE — 99x = 36 gives x = 36/99, and both 36 and 99 divide by 9, so x = 4/11. Lowest terms is part of the answer, not a bonus step. Then check the way you already know how: 4 ÷ 11 = 0.3636…, which is exactly where you started.',
        'A LEAD DIGIT NEEDS TWO SHIFTED COPIES — in 0.1666… the 1 never repeats, so x and 10x do not share a tail: x = 0.1666… ends in 1666… but 10x = 1.666… ends in 666…. Shift again: 100x = 16.666…. Now 10x and 100x both end in the same 666… tail, so subtract those two: 100x - 10x = 16.666… - 1.666… = 15, which is 90x = 15, so x = 15/90 = 1/6. Check: 1 ÷ 6 = 0.1666….',
      ],
      vocabulary: [
        { term: 'repeating decimal', definition: 'a decimal whose digits loop forever in a pattern, such as 0.3636…' },
        { term: 'repeating block', definition: 'the group of digits that loops; in 0.3636… the block is 36, in 0.8333… the block is just the 3.' },
        { term: 'lead digit', definition: 'a digit after the decimal point that comes before the block starts and never repeats, such as the 8 in 0.8333…' },
        { term: 'lowest terms', definition: 'a fraction whose top and bottom share no common factor bigger than 1, such as 4/11 instead of 36/99.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-free-throw-two-digit-block',
      kind: 'worked_example',
      problem: 'The stats app shows a free-throw rate of 0.636363…, with 63 repeating forever. Write it as a fraction in lowest terms, then read it back as makes out of attempts.',
      steps: [
        'Find the block. The digits 6, 3 loop, so the block is 63. It has two digits, so the multiplier is 100.',
        'Name it and shift it. Let x = 0.6363…. Then 100x = 63.6363…. Compare the tails: both x and 100x end in the same .6363… after the decimal point.',
        'Subtract to cancel the tails: 100x - x = 63.6363… - 0.6363…. The endless parts are identical and wipe out, so 99x = 63.',
        'Divide: x = 63/99. Reduce: both 63 and 99 divide by 9, and 63 ÷ 9 = 7, 99 ÷ 9 = 11. So x = 7/11.',
        'Check by dividing it back. 7 ÷ 11: 70 ÷ 11 = 6 remainder 4, then 40 ÷ 11 = 3 remainder 7, and remainder 7 is where we started, so the digits 6, 3 loop again. 7/11 = 0.6363…, which matches.',
        'Read it back into the story: 7 makes out of 11 attempts. Lowest terms gives the smallest pair of whole numbers with that rate; 14 out of 22 would show the exact same decimal, but 7 out of 11 is the simplest version of it.',
      ],
      answer: '7/11 (7 makes out of 11 attempts)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-lead-digit',
      kind: 'worked_example',
      problem: 'Write 0.8333…, where only the 3 repeats, as a fraction in lowest terms.',
      steps: [
        'Find the block. Only the 3 loops, so the block is one digit. The 8 is a lead digit: it sits before the block and never repeats. That means one shift will not line up two identical tails, because x = 0.8333… ends in 8333… while 10x = 8.333… ends in 333….',
        'WRONG: reading the decimal as 0.838383…, writing 100x - x = 99x = 83, and answering 83/99. CORRECT: the 8 does not repeat, so 100x is 83.333…, not 83.8383…. The check exposes the slip: 83 ÷ 99 = 0.8383…, which is not the decimal we were given.',
        'Shift twice so that two copies share a tail. 10x = 8.333… and 100x = 83.333…, and both of them end in the same 333….',
        'Subtract those two copies: 100x - 10x = 83.333… - 8.333… = 75. On the left, 100x - 10x = 90x, so 90x = 75.',
        'Divide: x = 75/90. Reduce: both 75 and 90 divide by 15, and 75 ÷ 15 = 5, 90 ÷ 15 = 6. So x = 5/6.',
        'Check by dividing it back. 5 ÷ 6: 50 ÷ 6 = 8 remainder 2, then 20 ÷ 6 = 3 remainder 2, and the remainder 2 comes back, so the 3 loops forever. 5/6 = 0.8333…, which matches.',
      ],
      answer: '5/6',
      estimatedMinutes: 3,
    },
    {
      id: 'try-one-digit-block',
      kind: 'try_yourself',
      problem: 'Which fraction equals 0.7777…, where the 7 repeats forever?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '7/10' },
        { id: 'b', text: '7/99' },
        { id: 'c', text: '7/9', correct: true },
        { id: 'd', text: '77/100' },
      ],
      expectedAnswer: '7/9',
      hints: [
        'Only one digit repeats, so shift the decimal point past one digit: multiply by 10, not by 100. Then subtract x so the tails cancel.',
        '10x - x = 7.777… - 0.777… = 7, so 9x = 7. Divide both sides by 9, and check by dividing your fraction back into a decimal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-subtraction',
      kind: 'try_yourself',
      problem: 'A student writes x = 0.2727…, where 27 repeats forever. Which subtraction makes the two endless tails cancel exactly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Subtract x from 100x', correct: true },
        { id: 'b', text: 'Subtract x from 10x' },
        { id: 'c', text: 'Subtract 10x from 100x' },
        { id: 'd', text: 'Subtract x from 1000x' },
      ],
      expectedAnswer: 'Subtract x from 100x',
      hints: [
        'Write out 10x, 100x and 1000x, and look only at the digits after the decimal point in each one. The tails cancel only when the two numbers you subtract have identical tails.',
        'A two-digit block needs a shift of exactly two places. 100x = 27.2727… and x = 0.2727… end in the same tail, so their difference is the whole number 27, and 99x = 27.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-lead-digit-denominator',
      kind: 'try_yourself',
      problem: 'Write 0.5333…, where only the 3 repeats, as a fraction in lowest terms. What is the denominator of that fraction? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '15',
      hints: [
        'The 5 is a lead digit that never repeats, so you need two shifted copies that share a tail: 10x = 5.333… and 100x = 53.333….',
        'Subtracting those two copies gives 90x = 48. Reduce 48/90 all the way down before you read off the denominator; both numbers divide by 6.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-which-digits-repeat',
      kind: 'misconception_check',
      question: 'Ava and Ben both convert 0.7222…, where only the 2 repeats, to a fraction. Ava gets 8/11 and Ben gets 18/25. Divide each answer back into a decimal. What went wrong in each case?',
      commonErrors: [
        {
          answer: '8/11',
          misconception: 'Reading the decimal as 0.727272…, with both digits in the block, and writing 100x - x = 99x = 72, so x = 72/99 = 8/11.',
          correctsTo:
            'Only the 2 repeats. The 7 is a lead digit, so 100x = 72.222…, not 72.7272…, and subtracting x from it leaves a tail behind. Use two copies that share the same tail: 10x = 7.222… and 100x = 72.222…, so 100x - 10x = 65, which is 90x = 65 and x = 65/90 = 13/18. The check tells the story: 8 ÷ 11 = 0.7272…, which is the wrong decimal, while 13 ÷ 18 gives 130 ÷ 18 = 7 remainder 4, then 40 ÷ 18 = 2 remainder 4 over and over, so 13/18 = 0.7222….',
        },
        {
          answer: '18/25',
          misconception: 'Treating the decimal as if it stopped at 0.72, writing it over 100, and reducing 72/100 to 18/25.',
          correctsTo:
            'Writing a decimal over 100 only works when the decimal actually ends after two places. This one never ends, so 18/25 = 0.72 exactly falls short of 0.7222… by the whole endless tail. A repeating decimal has to be converted by the shift-and-subtract method: 100x - 10x = 72.222… - 7.222… = 65, so 90x = 65 and x = 13/18. Dividing back, 13 ÷ 18 = 0.7222…, which matches, and 0.72 does not.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A fraction always gives a decimal that stops or repeats, because the remainders in the division run out of new values and one has to come back.',
        'Find the repeating block first. The block decides the multiplier: 10 for a one-digit block, 100 for a two-digit block.',
        'Name it x, shift it, subtract, and the identical endless tails cancel: 100x - x = 99x for a two-digit block.',
        'A lead digit that does not repeat needs two shifted copies that share a tail: 100x - 10x = 90x.',
        'Divide, reduce to lowest terms, then check by dividing the fraction back into its decimal.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Repeating Decimals to Fractions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
