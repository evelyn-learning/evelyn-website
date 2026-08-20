/**
 * Grade 7 Math — Ratios & Proportional Relationships: Unit Rates with Fractions.
 *
 * The harder half of CCSS 7.RP.A.1: a unit rate when BOTH quantities are
 * fractions, so the division is a complex fraction such as (1/2 mile) over
 * (1/4 hour). Two traps drive this plan. First, dividing in the wrong order,
 * which answers the other question (hours per mile instead of miles per hour).
 * Second, multiplying the two fractions instead of multiplying by the
 * reciprocal. The which-per-which decision is forced to happen BEFORE any
 * arithmetic, every single time.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U3_COMPLEX_FRACTION_UNIT_RATES: LessonPlan = {
  id: 'evelyn.ms.m7math.complex-fraction-unit-rates.v1',
  title: 'Unit Rates with Fractions',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.complex-fraction-unit-rates',
      standard: 'M7MATH-3.2',
      description:
        'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas, and other quantities measured in like or different units (CCSS 7.RP.A.1).',
    },
  ],
  prerequisites: ['m7math.ratios-and-unit-rates'],
  followUps: ['m7math.proportional-relationships'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a rate can hide inside two fractions, and that the answer is bigger than either of them.',
      script:
        'You walk the dog half a mile. It takes a quarter of an hour. How fast were you going, in miles per hour? Both numbers in that story are less than one, so it feels like the answer should be small. It is not. The answer is 2 miles per hour, which is bigger than either number you started with. Nothing strange is happening. A quarter of an hour is a short slice of time, and you covered half a mile in it, so in a whole hour you would cover four of those slices. Today we handle rates where both quantities are fractions, and we do it without guessing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-complex-fraction-rates',
      kind: 'concept',
      goal: 'Force the which-per-which decision first, then run division by a fraction as multiplication by the reciprocal.',
      keyIdeas: [
        'A COMPLEX FRACTION IS A FRACTION BUILT OUT OF FRACTIONS — writing (1/2) over (1/4) looks strange, but the bar in the middle still means exactly what it always means: divide. So (1/2) over (1/4) is just 1/2 ÷ 1/4.',
        'DECIDE WHICH QUANTITY IS PER WHICH BEFORE YOU COMPUTE — this is the step students skip, and skipping it is what makes the whole topic feel random. Miles per hour means miles ÷ hours, so distance goes on top and time goes on the bottom. Write the words down first, then replace them with numbers. Never the other way around.',
        'DIVIDING BY A FRACTION MEANS MULTIPLYING BY ITS RECIPROCAL — keep the first fraction, flip the second one over, and multiply. So 1/2 ÷ 1/4 becomes 1/2 × 4/1 = 4/2 = 2. The flip happens to the SECOND fraction only. Flipping the first one instead is a common slip and it produces the wrong rate.',
        'MIXED NUMBERS BECOME IMPROPER FRACTIONS FIRST — you cannot flip a mixed number. Rewrite 1 1/2 as 3/2 and 2 1/3 as 7/3 before doing anything else, and the rest of the work is unchanged.',
        'FLIPPING THE ORDER GIVES THE OTHER RATE, AND IT IS ALSO TRUE — 1/2 ÷ 1/4 = 2 says 2 miles per hour. Turn it around and 1/4 ÷ 1/2 = 1/2 says half an hour per mile. Both statements describe the same walk. Only one of them answers the question that was asked, so read the question carefully.',
        'CHECK BY SCALING BACK — take the unit rate you found and multiply it by the amount of the per quantity you were given. You should land exactly on the other number in the problem. Here, 2 miles per hour times 1/4 hour gives 2/4 = 1/2 mile, which matches the walk.',
      ],
      vocabulary: [
        { term: 'complex fraction', definition: 'a fraction whose top, bottom, or both are themselves fractions, such as (1/2) over (1/4).' },
        { term: 'reciprocal', definition: 'the fraction flipped upside down: the reciprocal of 1/4 is 4/1, and the reciprocal of 2/3 is 3/2.' },
        { term: 'unit rate', definition: 'the amount that goes with exactly ONE of the other quantity, such as 2 miles per one hour.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-half-mile-quarter-hour',
      kind: 'worked_example',
      problem: 'You walk 1/2 mile in 1/4 hour. What is your speed in miles per hour?',
      steps: [
        'Decide the order from the words. Miles per hour means miles ÷ hours. Distance is first, time is second. Write that sentence down before writing any numbers.',
        'Fill in the numbers in that order: 1/2 ÷ 1/4.',
        'Dividing by a fraction means multiplying by its reciprocal. Keep 1/2, flip 1/4 into 4/1, and multiply: 1/2 × 4/1.',
        'Multiply straight across. The tops give 1 × 4 = 4. The bottoms give 2 × 1 = 2. So the result is 4/2 = 2.',
        'Attach the units: 2 miles per hour.',
        'Check by scaling. A quarter hour is one of the four quarters that fill an hour. Four of those quarters at 1/2 mile each give 4 × 1/2 = 2 miles in one hour, which matches.',
      ],
      answer: '2 miles per hour',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-snail-meters-per-minute',
      kind: 'worked_example',
      problem: 'A snail crawls 2/5 of a meter in 2/3 of a minute. How many meters does it crawl per minute?',
      steps: [
        'Order first. Meters per minute means meters ÷ minutes, so 2/5 goes first and 2/3 goes second.',
        'Write the division: 2/5 ÷ 2/3.',
        'Flip the second fraction and multiply: 2/5 × 3/2.',
        'Multiply across: tops give 2 × 3 = 6, bottoms give 5 × 2 = 10, so the result is 6/10.',
        'Simplify 6/10 by dividing both parts by 2, which gives 3/5. As a decimal that is 0.6, so the snail crawls 3/5 of a meter per minute.',
        'Check by scaling back: 3/5 × 2/3 = 6/15 = 2/5 of a meter in 2/3 of a minute, which is exactly what the problem said.',
        'WRONG answer to avoid: 2/5 × 2/3 = 4/15, which comes from multiplying the two fractions without flipping. RIGHT answer: 3/5 of a meter per minute.',
      ],
      answer: '3/5 of a meter per minute',
      estimatedMinutes: 3,
    },
    {
      id: 'try-walk-speed',
      kind: 'try_yourself',
      problem: 'Sam walks 3/4 of a mile in 1/3 of an hour. What is his speed in miles per hour?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2 1/4 miles per hour', correct: true },
        { id: 'b', text: '1/4 mile per hour' },
        { id: 'c', text: '4/9 mile per hour' },
        { id: 'd', text: '4 miles per hour' },
      ],
      expectedAnswer: '2 1/4 miles per hour',
      hints: [
        'Miles per hour means miles ÷ hours, so write 3/4 ÷ 1/3 before you compute anything.',
        'Keep the first fraction, flip the second one, and multiply: 3/4 × 3/1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hose-tubs-per-hour',
      kind: 'try_yourself',
      problem: 'A hose fills 5/8 of a bathtub in 1/4 of an hour. How many tubs can it fill per hour?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2 1/2 tubs per hour', correct: true },
        { id: 'b', text: '2/5 of a tub per hour' },
        { id: 'c', text: '5/32 of a tub per hour' },
        { id: 'd', text: '6 2/5 tubs per hour' },
      ],
      expectedAnswer: '2 1/2 tubs per hour',
      hints: [
        'Tubs per hour means tubs ÷ hours. Which of the two given numbers is the tubs, and which is the hours?',
        'A quarter hour is short, so a whole hour gives four times as much. The answer must be bigger than 5/8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-oats-per-pan',
      kind: 'try_yourself',
      problem: 'A recipe uses 2/3 of a cup of oats to make 1/6 of a pan of granola bars. How many cups of oats does one whole pan need? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '4',
      hints: [
        'Cups per pan means cups ÷ pans, so set up 2/3 ÷ 1/6.',
        'Flip the second fraction: 2/3 × 6/1. One sixth of a pan is a small piece, so a whole pan needs six times as much.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-division-order',
      kind: 'misconception_check',
      question: 'You walk 1/2 mile in 1/4 hour. A student writes 1/4 ÷ 1/2 = 1/2 and answers that the speed is 1/2 mile per hour. What went wrong?',
      commonErrors: [
        {
          answer: '1/2 mile per hour',
          misconception: 'Dividing time by distance instead of distance by time, usually because the numbers got written down in the order they appeared in the sentence rather than the order the units require.',
          correctsTo: 'The number 1/2 is real, but it is 1/2 HOUR PER MILE, not miles per hour. Miles per hour means miles ÷ hours, which is 1/2 ÷ 1/4 = 1/2 × 4/1 = 2 miles per hour. A sanity check settles it: walking half a mile in fifteen minutes is a normal walking speed, and 1/2 mile per hour would be slower than that walk actually was. Decide which quantity is per which BEFORE dividing.',
        },
        {
          answer: '1/8 mile per hour',
          misconception: 'Multiplying the two fractions instead of multiplying by the reciprocal of the second one.',
          correctsTo: 'Multiplying gives 1/2 × 1/4 = 1/8, which makes the answer smaller when the situation clearly calls for something bigger. Dividing by a fraction means flipping that fraction and then multiplying: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2. Flip only the second fraction, then multiply.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A complex fraction is just a division problem: (1/2) over (1/4) means 1/2 ÷ 1/4.',
        'Decide which quantity is per which FIRST. Miles per hour means miles ÷ hours, always in that order.',
        'To divide by a fraction, keep the first, flip the second, and multiply: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2.',
        'Rewrite mixed numbers as improper fractions before flipping anything: 1 1/2 becomes 3/2.',
        'Check by scaling back: the unit rate times the given amount of the per quantity must land on the other given number.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Unit Rates with Fractions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
