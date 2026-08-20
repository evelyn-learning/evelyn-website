/**
 * Grade 7 Math — Percent & Applications: Simple Interest & Percent Error.
 *
 * The last two percent formulas of the unit (CCSS 7.RP.A.3, 7.EE.B.3). Simple
 * interest is I = Prt with t measured in YEARS — a six-month term is t = 0.5,
 * and forgetting that is the classic trap. Percent error is the difference
 * over the ACTUAL value, which closes the unit on the same idea that opened
 * it: the denominator is the amount you are comparing against.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U4_SIMPLE_INTEREST_AND_PERCENT_ERROR: LessonPlan = {
  id: 'evelyn.ms.m7math.simple-interest-and-percent-error.v1',
  title: 'Simple Interest & Percent Error',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.simple-interest-and-percent-error',
      standard: 'M7MATH-4.4',
      description:
        'Compute simple interest with I = Prt where time is measured in years, and compute percent error as the difference from the actual value expressed as a percent of that actual value (CCSS 7.RP.A.3, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.tax-tip-discount-markup'],
  followUps: ['m7math.writing-algebraic-expressions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Give both formulas a concrete home before any symbols appear.',
      script:
        'Two things happen with numbers all the time and both are percent problems in disguise. First: you park 200 dollars of birthday money in a savings account, and the bank pays you a little extra every year just for leaving it alone. That extra is called interest. Second: you guess there are 300 jellybeans in the jar, the real answer is 250, and your friend wants to know how badly you missed. Today we get one formula for each. They look different, but both of them end the same way — dividing by the amount you are measuring against.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-interest-and-error',
      kind: 'concept',
      goal: 'Build I = Prt with time in years, and percent error over the actual value.',
      keyIdeas: [
        'SIMPLE INTEREST IS I = P times r times t — P is the PRINCIPAL, the money you started with. The letter r is the yearly rate written as a DECIMAL, so 5% becomes 0.05. And t is the time. Multiply all three together and you get the interest earned or owed.',
        'TIME IS MEASURED IN YEARS — this is the trap that catches almost everybody. The rate is a yearly rate, so t has to be counted in years to match it. Six months is HALF a year, so t = 0.5. Three months is t = 0.25, and 18 months is t = 1.5. Putting t = 6 for six months multiplies the interest by twelve times too much.',
        'INTEREST IS NOT THE TOTAL — the formula gives you the extra money only. If you also want the balance in the account or the amount owed back, add the interest to the principal: total = P plus I. Read the question and check which one it wants.',
        'PERCENT ERROR MEASURES A MISS — the formula is the size of (measured minus actual), divided by the ACTUAL value, times 100. The straight bars mean absolute value, so you use the size of the gap and throw away the sign. Percent error is never negative; it says how far off you were, not which direction you missed.',
        'THE DENOMINATOR IS THE ACTUAL VALUE — the true value is what your guess is being judged against, so it goes on the bottom. Dividing by your own measurement instead is the same mistake as dividing percent change by the new amount, and it gives the wrong answer for the same reason.',
        'SIZE CHECKS CATCH DISASTERS — interest for one year is a small slice of the principal, so if your interest comes out bigger than the money you put in, check t and check the decimal. And a guess that is close should give a small percent error, so an answer over 100% means the guess was more than double the truth.',
      ],
      vocabulary: [
        { term: 'principal', definition: 'the starting amount of money that was saved, lent or borrowed — the P in I = Prt.' },
        { term: 'simple interest', definition: 'extra money paid on the principal only, found with I = Prt.' },
        { term: 'rate', definition: 'the yearly percent charged or paid, written as a decimal in the formula: 5% becomes 0.05.' },
        { term: 'percent error', definition: 'how far a measurement or guess is from the actual value, as a percent of that actual value.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-simple-interest-years',
      kind: 'worked_example',
      problem: 'You put $600 into a savings account that pays 4% simple interest per year. You leave it alone for 3 years. How much interest do you earn, and what is the balance at the end?',
      steps: [
        'Label the three pieces. P is 600 dollars, the rate is 4% per year, and t is 3 years.',
        'Convert the rate to a decimal: 4% becomes 0.04.',
        'Put them into I = P times r times t: I = 600 times 0.04 times 3.',
        'Multiply in the easy order. First 600 times 0.04 = 24, which is the interest for ONE year. Then 24 times 3 = 72 dollars of interest over the three years.',
        'The question also asks for the balance, so add the interest back to the principal: 600 plus 72 = 672 dollars.',
        'Size check: 72 dollars is a small slice of 600, which is exactly what a few years at a low rate should look like.',
      ],
      answer: '$72 in interest; the balance is $672.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-six-month-term',
      kind: 'worked_example',
      problem: 'Your cousin borrows $800 at 5% simple interest and pays it back after 6 months. How much interest is owed?',
      steps: [
        'Label the pieces. P is 800 dollars and the rate is 5% per year, so r = 0.05. The time is 6 months, and that is the piece to be careful with.',
        'Convert the time to YEARS, because the rate is a yearly rate. Six months is half of a year, so t = 0.5.',
        'Put it together: I = 800 times 0.05 times 0.5.',
        'Work left to right. 800 times 0.05 = 40, which is the interest for a full year. Half a year earns half of that, so 40 times 0.5 = 20 dollars.',
        'WRONG answer to avoid: leaving t as 6 and computing 800 times 0.05 times 6 = 240 dollars. That charges six YEARS of interest for six months. RIGHT answer: 20 dollars, because t = 0.5.',
        'The cousin pays back the principal plus the interest: 800 plus 20 = 820 dollars.',
      ],
      answer: '$20 in interest; the cousin pays back $820.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-percent-error-mcq',
      kind: 'try_yourself',
      problem: 'You guess that a watermelon weighs 15 pounds. It actually weighs 12 pounds. What is the percent error of your guess?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3%' },
        { id: 'b', text: '20%' },
        { id: 'c', text: '25%', correct: true },
        { id: 'd', text: '125%' },
      ],
      expectedAnswer: '25%',
      hints: [
        'Find the size of the miss first by subtracting: 15 minus 12.',
        'Percent error divides that gap by the ACTUAL weight, which is 12, and then multiplies by 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interest-months-mcq',
      kind: 'try_yourself',
      problem: 'A loan of $1,200 charges 6% simple interest per year and is paid back after 6 months. How much interest is owed?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$36', correct: true },
        { id: 'b', text: '$72' },
        { id: 'c', text: '$360' },
        { id: 'd', text: '$432' },
      ],
      expectedAnswer: '$36',
      hints: [
        'Write down P, r and t separately before you multiply. The rate 6% becomes 0.06.',
        'Six months is half a year, so t = 0.5, not 6. Find one full year of interest first, then take half of it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-interest',
      kind: 'try_yourself',
      problem: 'You lend a friend $300 at 5% simple interest per year, and they pay you back after 18 months. How many dollars of interest do they owe? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '22.50',
      hints: [
        'Turn 18 months into years first. Twelve months is one year, so 18 months is one and a half years.',
        'Use I = P times r times t with P = 300, r = 0.05 and t = 1.5. One full year of interest is 15 dollars.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-percent-error-denominator',
      kind: 'misconception_check',
      question: 'A student measures a book as 22 cm long. The actual length is 20 cm. The student computes the percent error as 2 divided by 22, and reports about 9.1%. What went wrong?',
      commonErrors: [
        {
          answer: 'about 9.1%',
          misconception: 'Dividing by the MEASURED value instead of the actual value. The student put their own reading on the bottom of the fraction, so the answer is being judged against the mistake rather than against the truth.',
          correctsTo: 'Percent error always divides by the ACTUAL value, because the actual value is the thing you are trying to hit. The gap is 22 minus 20 = 2 cm, and the actual length is 20 cm, so the percent error is 2 divided by 20 = 0.10, which is 10%. Check it: 10% of 20 is 2 cm, and the measurement really is 2 cm off.',
        },
        {
          answer: '110%',
          misconception: 'Dividing the whole measurement by the actual value, 22 divided by 20, instead of dividing the DIFFERENCE by it.',
          correctsTo: 'That calculation says the measurement is 110% of the true length, which is a true statement but not the percent error. Percent error asks how big the MISS is, so the top of the fraction must be the difference, 2 cm, and not the entire 22 cm. The correct answer is 2 divided by 20 = 10%. Notice that 110 minus 100 = 10 as well, which is a nice way to see it, but the safe habit is to subtract first and then divide.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simple interest is I = P × r × t, with the rate written as a decimal: 5% becomes 0.05.',
        'Time is always in YEARS. Six months is t = 0.5, three months is t = 0.25, and 18 months is t = 1.5.',
        'The formula gives the interest only. For the balance or the payback amount, add it to the principal: 600 + 72 = 672.',
        'Percent error is the size of (measured − actual), divided by the ACTUAL value, times 100.',
        'The actual value goes on the bottom, the same way the original amount does in percent change: 22 cm against an actual 20 cm is 2 ÷ 20 = 10%.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Simple Interest & Percent Error' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
