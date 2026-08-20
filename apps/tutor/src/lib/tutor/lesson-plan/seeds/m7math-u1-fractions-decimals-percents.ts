/**
 * Grade 7 Math — Rational Numbers: Converting Fractions, Decimals & Percents.
 *
 * The closing row of Unit 1 and the hinge for two later units (CCSS 7.NS.A.2d,
 * 6.NS.C.7). Unit 2 needs students able to swap a fraction for a decimal
 * mid-calculation, and Unit 4 needs percent to be a number rather than a
 * symbol. The trap this plan is built to kill is the direction of the decimal
 * slide: to a percent the point goes RIGHT two places, from a percent it goes
 * LEFT two places, and "0.4 = 4%" is the error that proves it was guessed.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U1_FRACTIONS_DECIMALS_PERCENTS: LessonPlan = {
  id: 'evelyn.ms.m7math.fractions-decimals-percents.v1',
  title: 'Converting Fractions, Decimals & Percents',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.fractions-decimals-percents',
      standard: 'M7MATH-1.4',
      description:
        'Convert among fractions, decimals and percents — dividing to get a terminating or repeating decimal, multiplying or dividing by 100 to cross between decimal and percent, and writing a percent over 100 in simplest form (CCSS 7.NS.A.2d, 6.NS.C.7).',
    },
  ],
  prerequisites: ['m7math.comparing-and-ordering-rationals'],
  followUps: ['m7math.adding-rational-numbers'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show three notations naming one number before any procedure is taught.',
      script:
        'A game shop puts a controller on sale. The window sign says one quarter off. The shop app says 0.25 off. The sticker on the box says 25% off. Three different labels, and every one of them is the exact same deal. Nobody walks out paying less because they read a different sign. That is what today is about. A fraction, a decimal and a percent are three outfits for the same number, and you need to be able to change the outfit in either direction without changing the number underneath.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-forms',
      kind: 'concept',
      goal: 'Build the fraction, decimal and percent triangle and pin down the direction of the decimal slide.',
      keyIdeas: [
        'THREE NAMES, ONE NUMBER — 3/4 and 0.75 and 75% all mark the same point on the number line. The word percent means "out of one hundred", so 75% is a shorthand for 75/100. That is the key that unlocks every conversion below.',
        'FRACTION TO DECIMAL: DIVIDE TOP BY BOTTOM. The fraction bar IS a division sign, so 3/4 means 3 ÷ 4 = 0.75. Direction matters and is easy to flip by accident: 4 ÷ 3 gives 1.333…, which is a different number. Since 3/4 is less than a whole, its decimal has to be less than 1 — that is a free check.',
        'THE DIVISION ENDS ONE OF TWO WAYS. Either the remainder reaches zero and the digits stop, giving a terminating decimal like 3/8 = 0.375, or an old remainder comes back around and the digits repeat forever, giving a repeating decimal like 1/3 = 0.333… A repeating decimal is written with a bar over the part that repeats. Both kinds are still rational numbers.',
        'DECIMAL TO PERCENT: MULTIPLY BY 100, SO THE POINT SLIDES TWO PLACES RIGHT. 0.75 becomes 75%. Percent to decimal: divide by 100, so the point slides two places LEFT, and 8% becomes 0.08.',
        'WHICH DIRECTION? DECIDE IT BY SIZE, NEVER BY MEMORY. The percent number always LOOKS a hundred times bigger than its decimal, because it counts hundredths instead of ones. So heading toward a percent the number grows and the point goes right, and coming away from a percent the number shrinks and the point goes left. Test every answer against something you already know: one half is 0.5 and 50%, so if your rule turns 0.5 into 0.005% you slid the wrong way.',
        'PERCENT TO FRACTION: WRITE IT OVER 100, THEN SIMPLIFY. 40% = 40/100 = 2/5, and 24% = 24/100 = 6/25. Going the other way, a fraction becomes a percent either by dividing into a decimal and sliding right, or by building an equivalent fraction with 100 on the bottom: 7/20 = 35/100 = 35%.',
      ],
      vocabulary: [
        { term: 'percent', definition: 'a number of hundredths, written with the % sign — 25% means 25 out of 100.' },
        { term: 'terminating decimal', definition: 'a decimal whose digits stop, because the division reaches a remainder of zero.' },
        { term: 'repeating decimal', definition: 'a decimal whose digits repeat forever in a pattern, written with a bar over the repeating part.' },
      ],
      suggestedTools: ['show_equation', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fill-the-triangle',
      kind: 'worked_example',
      problem: 'Write 5/8 as a decimal and a percent. Then write 24% as a decimal and as a fraction in simplest form.',
      steps: [
        'Start with 5/8. The bar means divide, so work out 5 ÷ 8. Write the 5 as 5.000 and divide: 50 ÷ 8 = 6 with 2 left over, giving 0.6. Bring down a zero: 20 ÷ 8 = 2 with 4 left over, giving 0.62. Bring down a zero: 40 ÷ 8 = 5 with 0 left over, giving 0.625. The remainder is zero, so it terminates. 5/8 = 0.625, and 0.625 × 8 = 5 confirms it.',
        'Turn 0.625 into a percent by multiplying by 100, which slides the point two places right: 0.625 becomes 62.5%. Check the size: 5/8 is a little more than half, and 62.5% is a little more than 50%. That fits.',
        'Now 24%. To reach a decimal, divide by 100, which slides the point two places LEFT. Write 24 as 24.0 and slide: 24% = 0.24. Check the size: 24% is close to a quarter, and 0.24 is close to a quarter. That fits too.',
        'To reach a fraction, use what percent means and write it over 100: 24% = 24/100. Both numbers divide by 4, so 24 ÷ 4 = 6 and 100 ÷ 4 = 25, giving 6/25. Check by dividing back: 6 ÷ 25 = 0.24, which matches the decimal from the previous step.',
      ],
      answer: '5/8 = 0.625 = 62.5%, and 24% = 0.24 = 6/25',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repeating-and-shortcut',
      kind: 'worked_example',
      problem: 'Write 1/3 as a decimal and as a percent. Then write 7/20 as a decimal and a percent without long division.',
      steps: [
        'For 1/3, divide 1 ÷ 3. Write 1 as 1.000. Then 10 ÷ 3 = 3 with 1 left over, giving 0.3. Bring down a zero: 10 ÷ 3 = 3 with 1 left over again. The remainder 1 has come back, so the same step will repeat forever. 1/3 = 0.333…, written with a bar over the 3.',
        'To a percent, multiply by 100 and slide the point two places right: 0.333… becomes 33.333…%, which people usually write as 33 1/3 percent. Check it against something known: one third of 100 is 33 and a third, so 33 1/3 % is exactly right.',
        'For 7/20, look at the denominator before dividing. 20 × 5 = 100, so an equivalent fraction with 100 on the bottom is one step away. Multiply top and bottom by 5: 7 × 5 = 35 and 20 × 5 = 100, giving 35/100.',
        'A fraction over 100 is already a percent, so 7/20 = 35%. Slide the point two places LEFT to read off the decimal: 35% = 0.35.',
        'Confirm with division: 7 ÷ 20 = 0.35, and 20 × 0.35 = 7. The shortcut and the long way agree.',
      ],
      answer: '1/3 = 0.333… = 33 1/3 %, and 7/20 = 0.35 = 35%',
      estimatedMinutes: 3,
    },
    {
      id: 'try-percent-to-decimal',
      kind: 'try_yourself',
      problem: 'Write 8% as a decimal.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.8' },
        { id: 'b', text: '0.08', correct: true },
        { id: 'c', text: '8.0' },
        { id: 'd', text: '800' },
      ],
      expectedAnswer: '0.08',
      hints: [
        'Percent means out of 100, so start by writing 8% as the fraction 8/100.',
        'Leaving a percent makes the number smaller, so the point slides two places LEFT. Start from 8.0 and slide it twice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-fraction-to-percent',
      kind: 'try_yourself',
      problem: 'Which of these is equal to 3/5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '35%' },
        { id: 'b', text: '60%', correct: true },
        { id: 'c', text: '6%' },
        { id: 'd', text: '0.6%' },
      ],
      expectedAnswer: '60%',
      hints: [
        'Divide first. 3/5 means 3 ÷ 5, and that gives you the decimal form.',
        '3 ÷ 5 = 0.6. Write it as 0.60, then slide the point two places right to reach the percent.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-eighths-percent',
      kind: 'try_yourself',
      problem: 'Write 7/8 as a percent. Type just the number, without the percent sign.',
      responseFormat: 'numeric',
      expectedAnswer: '87.5',
      hints: [
        'Divide 7 by 8 first. Write the 7 as 7.000 and keep going until the remainder is zero.',
        '7 ÷ 8 = 0.875. Now multiply by 100, sliding the decimal point two places to the right.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-decimal-slide-direction',
      kind: 'misconception_check',
      question: 'A student writes 0.4 = 4%. What went wrong, and what is 0.4 as a percent?',
      commonErrors: [
        {
          answer: '4%',
          misconception: 'Dropping the "0." and keeping whatever digits are left, instead of multiplying by 100. The point effectively moved one place, not two.',
          correctsTo: 'Write 0.4 as 0.40 first, so both hundredths places are visible. Multiplying by 100 slides the point two places right: 0.40 becomes 40, so 0.4 = 40%. Check it by size — 0.4 is a bit less than half, and 40% is a bit less than half, while 4% is a tiny sliver. Whenever the size check fails, you slid the wrong number of places.',
        },
        {
          answer: '0.4%',
          misconception: 'Treating the percent sign as a label you can stick onto a decimal without changing the number, as if % were just a unit like cm.',
          correctsTo: 'The percent sign changes what the number counts: it counts hundredths instead of ones. So 0.4 means four tenths, but 0.4% means 0.4 out of 100, which is only 0.004. To cross from decimal to percent you must multiply by 100 first: 0.4 × 100 = 40, so 0.4 = 40%.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A fraction, a decimal and a percent are three names for one number: 3/4 = 0.75 = 75%.',
        'Fraction to decimal means divide TOP by BOTTOM: 5/8 = 5 ÷ 8 = 0.625, not 8 ÷ 5.',
        'The division either stops, like 3/8 = 0.375, or repeats forever, like 1/3 = 0.333…',
        'To a percent, multiply by 100 and slide the point two places RIGHT; from a percent, divide by 100 and slide two places LEFT. So 0.4 = 40% and 8% = 0.08.',
        'Percent to fraction means write it over 100 and simplify: 24% = 24/100 = 6/25.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Converting Fractions, Decimals & Percents' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
