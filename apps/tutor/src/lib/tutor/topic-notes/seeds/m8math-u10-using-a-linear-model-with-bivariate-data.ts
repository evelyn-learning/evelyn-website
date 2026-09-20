/**
 * Grade 8 Math — Unit 10 CED 10.3: Using a Linear Model with Bivariate Data.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.using-a-linear-model-with-bivariate-data.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U10_USING_A_LINEAR_MODEL_WITH_BIVARIATE_DATA: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.using-a-linear-model-with-bivariate-data.v1',
  course: 'Grade 8 Math',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Using a Linear Model with Bivariate Data',
  planId: 'evelyn.ms.m8math.using-a-linear-model-with-bivariate-data.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.using-a-linear-model-with-bivariate-data.v1' }],
  theory: [
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'framework', title: 'A fitted line is a summary, not a rule', content: `A FITTED LINE IS A SUMMARY, NOT A RULE — the candle model y = -0.5x + 12 was an exact rule, so every prediction came out exactly. The bean-plant line y = 1.5x + 6 was drawn through scattered points, and most of the points sit a little above or a little below it. So every number this line hands you is "about", and a point that sits off the line is normal, not a mistake.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'framework', title: 'The slope is a per-unit sentence with two units', content: `THE SLOPE IS A PER-UNIT SENTENCE WITH TWO UNITS — the slope 1.5 is the rise for every 1 unit of run, so it reads: each additional hour of light per day goes with about 1.5 cm more height. Say the two units out loud, centimeters per hour, and say the word "additional": the slope compares one plant with a plant that got ONE MORE hour. It is a description of how the heights and the hours climb together across the eight plants, nothing more.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', content: `THE INTERCEPT IS THE MODEL'S VALUE AT x = 0 — the 6 is the height the line gives when x is 0 hours of light. Before you read meaning into it, check whether any data sit near x = 0. No plant got fewer than 2 hours, so 6 cm is where the line starts on the axis, not a plant anybody measured. Some intercepts are sensible starting values, like the price of a phone that is 0 years old, and some are only the line reaching the axis; in both cases you say what the model claims and where the data actually begin.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', content: `PREDICT BY PUTTING x INTO THE EQUATION — for a plant getting 5 hours, y = 1.5(5) + 6 = 7.5 + 6 = 13.5, so the model predicts about 13.5 cm. The plant in the data that got 5 hours measured 14 cm, which is close and not identical, exactly what a fitted line should do. On the graph, the same prediction is the height of the line directly above x = 5.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'framework', title: 'Stay inside the data', content: `STAY INSIDE THE DATA — the eight plants got between 2 and 8 hours, so the line has earned trust only from x = 2 to x = 8. Asking it about 20 hours is EXTRAPOLATION: stretching the line past the data and assuming the pattern keeps going, when nothing in the experiment says it does. You can still compute 1.5(20) + 6 = 36, but you report it with a flag, "the data stop at 8 hours, so this is a guess the line was never checked against", or you decline to predict. The clearest warning sign is a prediction that is impossible, like a negative price for an old phone; that is the line telling you it has been stretched too far.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'definition', title: 'linear model', content: `an equation y = mx + b that was fitted to scattered data points to summarize the pattern they make.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'definition', title: 'slope of a fitted line', content: `the change in y that goes with each additional 1 unit of x, stated as an "about" amount with both units.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'definition', title: 'intercept', content: `the y-value the model gives when x is 0; meaningful only if the situation and the data make sense there.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'definition', title: 'data span', content: `the span from the smallest x-value in the data to the largest, the only stretch where the line has been checked against real points.` },
    { loId: 'm8math.using-a-linear-model-with-bivariate-data', kind: 'definition', title: 'extrapolation', content: `using the line to predict at an x-value outside the data span, which assumes the pattern continues where nobody measured.` },
  ],
  methods: [
    {
      title: 'Worked bean plants',
      steps: [
        `Say what kind of line this is before touching the numbers. It was drawn through scattered points, so it is a summary of the eight plants, and every answer it gives is "about" rather than exact.`,
        `(a) The slope is 1.5, which is the rise for every 1 unit of run, so it means: each additional hour of light per day goes with about 1.5 cm more height. Both units belong in the sentence, centimeters per hour. Check it on the line itself: at 4 hours, y = 1.5(4) + 6 = 6 + 6 = 12, and at 5 hours, y = 1.5(5) + 6 = 7.5 + 6 = 13.5. One more hour, 13.5 - 12 = 1.5 cm more.`,
        `(b) The intercept is 6, the height the line gives at x = 0. In context that is the model's height for a plant with no lamp light at all: about 6 cm. Now check the data: the plant with the least light got 2 hours, so nobody measured a plant at 0 hours. The 6 cm is where the line reaches the axis, and it is a claim the experiment never tested, so say exactly that.`,
        `(c) Put x = 5 into the equation: y = 1.5(5) + 6 = 7.5 + 6 = 13.5. The model predicts about 13.5 cm. The real plant with 5 hours measured 14 cm, half a centimeter above the line, which is normal for a fitted line. On the graph, 13.5 is the height of the line directly above x = 5, and the data point sits just above it.`,
        `(d) The equation still computes: y = 1.5(20) + 6 = 30 + 6 = 36 cm. But the data run from 2 hours to 8 hours, and 20 hours is far past that. This is extrapolation. Nothing in the experiment says the plants keep gaining 1.5 cm per hour once the light goes past 8 hours, so the honest answer is: the line gives 36 cm, but the data stop at 8 hours, and this prediction was never checked against a real plant.`,
        `Read the whole thing back as sentences about beans, not about x and y: each extra hour of light goes with about 1.5 cm more growth, the line starts at 6 cm on the axis where no plant was grown, a 5-hour plant should be about 13.5 cm, and 20 hours is a question the data cannot answer.`,
      ],
      example: { problem: `Eight bean plants got between 2 and 8 hours of lamp light a day, and after three weeks their heights were plotted against their hours of light. The line fitted to the scatter plot has the equation y = 1.5x + 6, where x is hours of light per day and y is height in centimeters. (a) What does the slope mean? (b) What does the intercept mean? (c) Predict the height of a plant that gets 5 hours a day; the plant in the data with 5 hours measured 14 cm. (d) A student wants to predict the height of a plant under a lamp 20 hours a day. What should the model say?`, solution: `Slope: about 1.5 cm more height for each additional hour of light; intercept: the model gives 6 cm at 0 hours, but no plant in the data got less than 2 hours; 5 hours: about 13.5 cm (the real plant was 14 cm); 20 hours: the equation gives 36 cm, but that is extrapolation past the 2-to-8-hour data and cannot be trusted` },
      relatedLoIds: ['m8math.using-a-linear-model-with-bivariate-data'],
    },
    {
      title: 'Worked used phones',
      steps: [
        `The slope is negative this time, -90, so the line falls as x grows. The per-unit sentence has to say so: each additional year of age goes with about $90 LESS in price. Units: dollars per year.`,
        `WRONG: reading the slope as "the phone loses $90". CORRECT: the slope is per year, not total. A phone 3 years older than another sits about 3 × 90 = $270 lower on the line, not $90 lower. The word "additional" is what keeps the slope a rate.`,
        `(b) The intercept is 520, the price the line gives at x = 0. A phone that is 0 years old is brand new, so the model says a new phone of this model goes for about $520. The data start at 1 year, so 0 years is just past the edge of the data; it is a sensible starting value, but it is still the line reaching the axis, not a phone anybody listed.`,
        `(c) Put x = 2.5 into the equation: y = -90(2.5) + 520 = -225 + 520 = 295. A phone that is 2.5 years old should be listed for about $295. That age sits inside the 1-to-4-year data, so the prediction is one the line has earned.`,
        `(d) The equation computes y = -90(8) + 520 = -720 + 520 = -200, a price of negative two hundred dollars. WRONG: writing -$200 as the answer. CORRECT: a negative price is impossible, and the impossible number is the line telling you it has been stretched too far. The oldest phone in the data is 4 years, and 8 years is twice that. Real prices flatten out near some small amount instead of dropping through zero, so this is extrapolation and the model should not be used at 8 years.`,
        `Check (c) by working backward on the line: at 2 years the line gives -90(2) + 520 = -180 + 520 = 340, and at 3 years it gives -90(3) + 520 = -270 + 520 = 250. The 2.5-year prediction of 295 sits exactly halfway between 340 and 250, which is what a straight line must do.`,
      ],
      example: { problem: `A class collected the ages and asking prices of used phones of one model for sale online. The phones were between 1 and 4 years old. The line fitted to the scatter plot is y = -90x + 520, where x is the age in years and y is the price in dollars. (a) What does the slope mean? (b) What does the intercept mean? (c) Predict the price of a phone that is 2.5 years old. (d) A student uses the line for a phone that is 8 years old. What happens?`, solution: `Slope: about $90 less for each additional year of age; intercept: about $520 for a 0-year-old (new) phone, just outside the 1-to-4-year data; 2.5 years: about $295; 8 years: the equation gives -$200, an impossible extrapolation, so the model cannot be used there` },
      relatedLoIds: ['m8math.using-a-linear-model-with-bivariate-data'],
    },
  ],
  pointers: [
    { content: `Students often say "The 5-hour plant was measured wrong, because the model says 13.5 cm and the sheet says 14 cm." — The line was drawn through the middle of eight points that do not sit in a perfect line, so almost every plant is a little above or a little below it. The model predicts about 13.5 cm for 5 hours, and a real plant at 14 cm is half a centimeter off, which is normal, not an error. The data came first; the line is the summary. If every point matched the line exactly, the line would be an exact rule like the candle, and this one is not.`, kind: 'common-error' },
    { content: `Students often say "A plant under a lamp 24 hours a day will be 42 cm tall, because 1.5(24) + 6 = 42." — The arithmetic is right, 1.5(24) + 6 = 36 + 6 = 42, but 24 hours is three times the most light any plant in the data received. That is extrapolation: the line is being stretched far past the data and asked to keep climbing 1.5 cm per hour where nothing was ever measured. Plants under constant light may stop growing faster, or may grow worse. The honest answer is that the model cannot say what happens at 24 hours, and any number it gives there needs a flag, not a claim.`, kind: 'common-error' },
    { content: `A line fitted to scattered data is a summary of the points, not an exact rule, so every number it gives is "about" and a point off the line is normal.`, kind: 'tip' },
    { content: `The slope is a per-unit sentence with two units: each additional 1 unit of x goes with about m more (or less, if m is negative) of y.`, kind: 'tip' },
    { content: `The intercept is the model's y-value at x = 0. Say what it claims, then check whether any data actually sit near x = 0 before treating it as real.`, kind: 'tip' },
    { content: `To predict, put the x-value into y = mx + b and report the result as "about"; on the graph it is the height of the line directly above that x.`, kind: 'tip' },
    { content: `A prediction can be trusted only inside the data span. Predicting past the smallest or largest x in the data is extrapolation, and it must be flagged or declined.`, kind: 'tip' },
    { content: `An impossible prediction, like a negative price, is the line telling you it has been stretched too far past the data.`, kind: 'tip' },
    { content: `A fitted line is "about", not exact. If a data point sits off the line, that's normal—the line is a summary, not a rule the data must obey.`, kind: 'gotcha' },
    { content: `Slope must include both units and the word "additional". Not "the slope is 1.5", but "each additional hour goes with about 1.5 cm more height" (centimeters per hour).`, kind: 'vocab-note' },
    { content: `Don't predict outside the data span without a flag. If data run from x = 2 to x = 8, predicting at x = 20 is extrapolation—the line was never checked there.`, kind: 'common-error' },
    { content: `An impossible answer (like negative price or negative weight) is a red flag that extrapolation has gone too far. Stop and say the model cannot be used there.`, kind: 'edge-case' },
    { content: `The intercept (y-value at x = 0) is where the line reaches the axis, not necessarily a real data point. Check if any data actually sit near x = 0 before claiming the intercept means something in context.`, kind: 'common-error' },
    { content: `On the graph, a prediction is the height of the line directly above the x-value. It's not a data point; it's where the line itself sits.`, kind: 'tip' },
    { content: `Negative slope still means per-unit. The slope -90 means each additional year goes with about $90 *less*, not that the phone loses $90 total.`, kind: 'common-error' },
  ],
};
