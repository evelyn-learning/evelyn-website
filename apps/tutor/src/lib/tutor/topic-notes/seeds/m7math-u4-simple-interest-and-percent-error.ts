/**
 * Grade 7 Math — Unit 4 CED 4.4: Simple Interest & Percent Error.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.simple-interest-and-percent-error.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U4_SIMPLE_INTEREST_AND_PERCENT_ERROR: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.simple-interest-and-percent-error.v1',
  course: 'Grade 7 Math',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Simple Interest & Percent Error',
  planId: 'evelyn.ms.m7math.simple-interest-and-percent-error.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.simple-interest-and-percent-error.v1' }],
  theory: [
    { loId: 'm7math.simple-interest-and-percent-error', content: `SIMPLE INTEREST IS I = P times r times t — P is the PRINCIPAL, the money you started with. The letter r is the yearly rate written as a DECIMAL, so 5% becomes 0.05. And t is the time. Multiply all three together and you get the interest earned or owed.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'framework', title: 'Time is measured in years', content: `TIME IS MEASURED IN YEARS — this is the trap that catches almost everybody. The rate is a yearly rate, so t has to be counted in years to match it. Six months is HALF a year, so t = 0.5. Three months is t = 0.25, and 18 months is t = 1.5. Putting t = 6 for six months multiplies the interest by twelve times too much.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'framework', title: 'Interest is not the total', content: `INTEREST IS NOT THE TOTAL — the formula gives you the extra money only. If you also want the balance in the account or the amount owed back, add the interest to the principal: total = P plus I. Read the question and check which one it wants.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'framework', title: 'Percent error measures a miss', content: `PERCENT ERROR MEASURES A MISS — the formula is the size of (measured minus actual), divided by the ACTUAL value, times 100. The straight bars mean absolute value, so you use the size of the gap and throw away the sign. Percent error is never negative; it says how far off you were, not which direction you missed.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'framework', title: 'The denominator is the actual value', content: `THE DENOMINATOR IS THE ACTUAL VALUE — the true value is what your guess is being judged against, so it goes on the bottom. Dividing by your own measurement instead is the same mistake as dividing percent change by the new amount, and it gives the wrong answer for the same reason.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'framework', title: 'Size checks catch disasters', content: `SIZE CHECKS CATCH DISASTERS — interest for one year is a small slice of the principal, so if your interest comes out bigger than the money you put in, check t and check the decimal. And a guess that is close should give a small percent error, so an answer over 100% means the guess was more than double the truth.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'definition', title: 'principal', content: `the starting amount of money that was saved, lent or borrowed — the P in I = Prt.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'definition', title: 'simple interest', content: 'extra money paid on the principal only, found with I = Prt.' },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'definition', title: 'rate', content: `the yearly percent charged or paid, written as a decimal in the formula: 5% becomes 0.05.` },
    { loId: 'm7math.simple-interest-and-percent-error', kind: 'definition', title: 'percent error', content: `how far a measurement or guess is from the actual value, as a percent of that actual value.` },
  ],
  methods: [
    {
      title: 'Worked simple interest years',
      steps: [
        `Label the three pieces. P is 600 dollars, the rate is 4% per year, and t is 3 years.`,
        'Convert the rate to a decimal: 4% becomes 0.04.',
        'Put them into I = P times r times t: I = 600 times 0.04 times 3.',
        `Multiply in the easy order. First 600 times 0.04 = 24, which is the interest for ONE year. Then 24 times 3 = 72 dollars of interest over the three years.`,
        `The question also asks for the balance, so add the interest back to the principal: 600 plus 72 = 672 dollars.`,
        `Size check: 72 dollars is a small slice of 600, which is exactly what a few years at a low rate should look like.`,
      ],
      example: { problem: `You put $600 into a savings account that pays 4% simple interest per year. You leave it alone for 3 years. How much interest do you earn, and what is the balance at the end?`, solution: '$72 in interest; the balance is $672.' },
      relatedLoIds: ['m7math.simple-interest-and-percent-error'],
    },
    {
      title: 'Worked six month term',
      steps: [
        `Label the pieces. P is 800 dollars and the rate is 5% per year, so r = 0.05. The time is 6 months, and that is the piece to be careful with.`,
        `Convert the time to YEARS, because the rate is a yearly rate. Six months is half of a year, so t = 0.5.`,
        'Put it together: I = 800 times 0.05 times 0.5.',
        `Work left to right. 800 times 0.05 = 40, which is the interest for a full year. Half a year earns half of that, so 40 times 0.5 = 20 dollars.`,
        `WRONG answer to avoid: leaving t as 6 and computing 800 times 0.05 times 6 = 240 dollars. That charges six YEARS of interest for six months. RIGHT answer: 20 dollars, because t = 0.5.`,
        'The cousin pays back the principal plus the interest: 800 plus 20 = 820 dollars.',
      ],
      example: { problem: `Your cousin borrows $800 at 5% simple interest and pays it back after 6 months. How much interest is owed?`, solution: '$20 in interest; the cousin pays back $820.' },
      relatedLoIds: ['m7math.simple-interest-and-percent-error'],
    },
  ],
  pointers: [
    { content: `Students often say "about 9.1%" — Percent error always divides by the ACTUAL value, because the actual value is the thing you are trying to hit. The gap is 22 minus 20 = 2 cm, and the actual length is 20 cm, so the percent error is 2 divided by 20 = 0.10, which is 10%. Check it: 10% of 20 is 2 cm, and the measurement really is 2 cm off.`, kind: 'common-error' },
    { content: `Students often say "110%" — That calculation says the measurement is 110% of the true length, which is a true statement but not the percent error. Percent error asks how big the MISS is, so the top of the fraction must be the difference, 2 cm, and not the entire 22 cm. The correct answer is 2 divided by 20 = 10%. Notice that 110 minus 100 = 10 as well, which is a nice way to see it, but the safe habit is to subtract first and then divide.`, kind: 'common-error' },
    { content: `Simple interest is I = P × r × t, with the rate written as a decimal: 5% becomes 0.05.`, kind: 'tip' },
    { content: `Time is always in YEARS. Six months is t = 0.5, three months is t = 0.25, and 18 months is t = 1.5.`, kind: 'tip' },
    { content: `The formula gives the interest only. For the balance or the payback amount, add it to the principal: 600 + 72 = 672.`, kind: 'tip' },
    { content: `Percent error is the size of (measured − actual), divided by the ACTUAL value, times 100.`, kind: 'tip' },
    { content: `The actual value goes on the bottom, the same way the original amount does in percent change: 22 cm against an actual 20 cm is 2 ÷ 20 = 10%.`, kind: 'tip' },
    { content: `Months are not years. Before you multiply, divide the months by 12: 6 months → t = 0.5, 3 months → t = 0.25, 18 months → t = 1.5. Leaving t = 6 for six months makes the interest 12 times too big.`, kind: 'common-error' },
    { content: `I = Prt gives the EXTRA money, not the total. If the question asks for the balance or the payback amount, add: total = P + I. Reread the last sentence of the problem before you answer.`, kind: 'gotcha' },
    { content: `The rate goes in as a decimal, not a percent. 5% → 0.05, 4% → 0.04, 12% → 0.12. Typing 5 instead of 0.05 makes your interest 100 times too large.`, kind: 'common-error' },
    { content: `In percent error, the ACTUAL value always goes on the bottom — never your measurement. Measured 22 cm, actual 20 cm → 2 ÷ 20 = 10%, not 2 ÷ 22.`, kind: 'gotcha' },
    { content: `The top of the percent error fraction is the DIFFERENCE, not the whole measurement. 22 ÷ 20 = 110% says the book is 110% of true length — that is not the error. Subtract first, then divide.`, kind: 'common-error' },
    { content: `Percent error is never negative. The bars | | mean take the size of the gap and drop the sign. Guessing too low and too high by the same amount give the same percent error.`, kind: 'vocab-note' },
    { content: `Size-check every answer. A few years at a low rate should give interest that's a small slice of the principal. And a percent error over 100% means your guess was more than double the truth — usually a signal you flipped the fraction.`, kind: 'tip' },
    { content: `Money answers can be non-whole. $300 at 5% for 18 months is $22.50 — write both decimal places, don't round to $22 or $23. Keep the dollar sign or unit on your final answer.`, kind: 'edge-case' },
  ],
};
